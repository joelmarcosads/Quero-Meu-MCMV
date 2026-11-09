/**
 * routes/conflitos.ts
 *
 * GET  /api/v1/conflitos            → listar captacoes_conflito pendentes
 * POST /api/v1/conflitos/:id/resolver → vincular ao contato escolhido e gerar lead
 *
 * Acesso: admin e assistente apenas (corretor não tem permissão).
 * Exige CF Access JWT (rota autenticada normal).
 *
 * Regras de negócio:
 *  1. GET lista conflitos com status 'pendente' por padrão.
 *     Query param `status` permite filtrar por outro valor.
 *  2. POST /resolver valida a escolha ('tel' | 'email'), cria o lead
 *     vinculado ao contato escolhido, e atualiza captacoes_conflito
 *     com status, resolvido_por, resolvido_at e lead_id_gerado.
 *  3. Dados pessoais (telefone, email) NÃO são retornados na listagem
 *     — o payload_json contém apenas origem/empreendimento/utm.
 *
 * LGPD: IP e user_agent são preservados na captacao_conflito
 * mas não são retornados nas respostas de listagem.
 */

import type { Env, AuthenticatedUser, ResolverConflitoPayload } from '../types';
import { jsonOk, jsonCreated, jsonError, parseJsonBody, writeAudit, getClientIp, uuidv4 } from '../utils';

// ─── Listar conflitos pendentes ───────────────────────────────────────────────
async function listConflitos(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
): Promise<Response> {
  // Apenas admin e assistente
  if (user.perfil !== 'admin' && user.perfil !== 'assistente') {
    return jsonError('Acesso negado: apenas admin e assistente podem gerenciar conflitos', 403);
  }

  const url = new URL(request.url);
  const statusFilter = url.searchParams.get('status') ?? 'pendente';
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50'), 100);
  const offset = parseInt(url.searchParams.get('offset') ?? '0');

  // Validar status
  const validStatuses = ['pendente', 'resolvido_tel', 'resolvido_email', 'descartado'];
  if (!validStatuses.includes(statusFilter)) {
    return jsonError(
      `Status inválido: '${statusFilter}'. Valores aceitos: ${validStatuses.join(', ')}`,
      400,
    );
  }

  const results = await env.DB.prepare(
    `SELECT
       cc.id,
       cc.tel_contato_id,
       cc.email_contato_id,
       cc.origem,
       cc.canal,
       cc.utm_source,
       cc.utm_medium,
       cc.utm_campaign,
       cc.idempotency_key,
       cc.payload_json,
       cc.status,
       cc.resolvido_por,
       cc.resolvido_at,
       cc.lead_id_gerado,
       cc.created_at,
       -- Contato do telefone (sem expor telefone na listagem)
       ct.nome AS tel_contato_nome,
       -- Contato do email
       ce.nome  AS email_contato_nome,
       ce.email AS email_contato_email,
       -- Resolvido por (nome do usuário)
       u.nome AS resolvido_por_nome
     FROM captacoes_conflito cc
     LEFT JOIN contatos ct ON ct.id = cc.tel_contato_id
     LEFT JOIN contatos ce ON ce.id = cc.email_contato_id
     LEFT JOIN usuarios u  ON u.id  = cc.resolvido_por
     WHERE cc.status = ?
     ORDER BY cc.created_at ASC
     LIMIT ? OFFSET ?`,
  )
    .bind(statusFilter, limit, offset)
    .all<Record<string, unknown>>();

  // Parsear payload_json inline
  const conflitos = results.results.map((row) => {
    let payload: unknown = null;
    if (typeof row.payload_json === 'string') {
      try { payload = JSON.parse(row.payload_json); } catch { /* mantém null */ }
    }
    const { payload_json: _omit, ...rest } = row;
    return { ...rest, payload };
  });

  return jsonOk({
    conflitos,
    meta: { status: statusFilter, limit, offset, count: conflitos.length },
  });
}

// ─── Resolver conflito ────────────────────────────────────────────────────────
async function resolverConflito(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
  conflitoId: string,
): Promise<Response> {
  // Apenas admin e assistente
  if (user.perfil !== 'admin' && user.perfil !== 'assistente') {
    return jsonError('Acesso negado: apenas admin e assistente podem resolver conflitos', 403);
  }

  let body: ResolverConflitoPayload;
  try {
    body = await parseJsonBody<ResolverConflitoPayload>(request);
  } catch (err) {
    return jsonError((err as Error).message, 400);
  }

  if (!body.escolha || !['tel', 'email'].includes(body.escolha)) {
    return jsonError("Campo obrigatório: escolha ('tel' ou 'email')", 400);
  }

  // Buscar captação de conflito
  const conflito = await env.DB.prepare(
    `SELECT id, tel_contato_id, email_contato_id, origem, canal,
            utm_source, utm_medium, utm_campaign, utm_content, utm_term,
            gclid, fbclid, meta_fbc, meta_fbp, idempotency_key,
            status, lead_id_gerado
     FROM captacoes_conflito
     WHERE id = ?
     LIMIT 1`,
  ).bind(conflitoId).first<{
    id: number;
    tel_contato_id: number;
    email_contato_id: number;
    origem: string;
    canal: string | null;
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    utm_content: string | null;
    utm_term: string | null;
    gclid: string | null;
    fbclid: string | null;
    meta_fbc: string | null;
    meta_fbp: string | null;
    idempotency_key: string | null;
    status: string;
    lead_id_gerado: number | null;
  }>();

  if (!conflito) {
    return jsonError(`Conflito #${conflitoId} não encontrado`, 404);
  }

  if (conflito.status !== 'pendente') {
    return jsonError(
      `Conflito #${conflitoId} já foi processado (status: ${conflito.status})`,
      409,
    );
  }

  // Determinar qual contato usar
  const contatoId = body.escolha === 'tel'
    ? conflito.tel_contato_id
    : conflito.email_contato_id;

  const novoStatus = body.escolha === 'tel' ? 'resolvido_tel' : 'resolvido_email';

  // Validar empreendimento se informado
  const empreendimentoId = body.empreendimento_id ?? null;
  if (empreendimentoId !== null) {
    const empr = await env.DB.prepare(
      `SELECT id FROM empreendimentos WHERE id = ? AND deleted_at IS NULL`,
    ).bind(empreendimentoId).first();
    if (!empr) {
      return jsonError(`Empreendimento id=${empreendimentoId} não encontrado`, 422);
    }
  }

  const tipologiaId = body.tipologia_id ?? null;

  // Usar idempotency_key do conflito (ou gerar novo) para identificar o lead
  const idempotencyKey = conflito.idempotency_key ?? uuidv4();

  const rawIp = getClientIp(request);

  // ── PASSO 1: UPDATE atômico como mutex ─────────────────────────────────────
  // Dois operadores podem chegar aqui simultaneamente: ambos passaram no SELECT
  // acima porque status ainda era 'pendente'.
  // O UPDATE condicional (WHERE status = 'pendente') age como mutex atômico:
  // apenas um operador encontrará a linha com status='pendente' e escreverá.
  // O segundo receberá rows_written = 0 e será redirecionado para 409.
  //
  // NÃO usamos INSERT OR IGNORE porque ele suprime silenciosamente QUALQUER
  // IntegrityError, incluindo FK violations (contato_id inválido), schema errors
  // e outros erros reais que devem resultar em 500.
  const claimResult = await env.DB.prepare(
    `UPDATE captacoes_conflito
     SET status = ?,
         resolvido_por = ?,
         resolvido_at = datetime('now')
     WHERE id = ? AND status = 'pendente'`,
  ).bind(novoStatus, user.id, conflito.id).run();

  if (claimResult.meta.rows_written === 0) {
    // Outro operador ganhou a corrida — buscar estado atual para resposta consistente
    const current = await env.DB.prepare(
      `SELECT status, lead_id_gerado FROM captacoes_conflito WHERE id = ? LIMIT 1`,
    ).bind(conflito.id).first<{ status: string; lead_id_gerado: number | null }>();

    return new Response(
      JSON.stringify({
        success: false,
        error: `Conflito #${conflitoId} já foi resolvido (status: ${current?.status ?? 'desconhecido'}).`,
        data: { conflito_id: conflito.id, lead_id: current?.lead_id_gerado ?? null },
      }),
      { status: 409, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // ── PASSO 2: INSERT normal — erros reais surgem como exceção (sem OR IGNORE) ─
  // Agora que o mutex foi adquirido via UPDATE, inserimos o lead.
  // Erros reais (FK violation, schema error) NÃO são suprimidos:
  // o catch externo os captura e retorna 500, e o rollback compensatório
  // devolve o conflito para 'pendente' para que outro operador possa tentar.
  let leadResult: {
    id: number;
    contato_id: number;
    empreendimento_id: number | null;
    tipologia_id: number | null;
    origem: string;
    created_at: string;
  } | null = null;

  try {
    leadResult = await env.DB.prepare(
      `INSERT INTO leads
         (contato_id, empreendimento_id, tipologia_id, idempotency_key,
          origem, canal,
          utm_source, utm_medium, utm_campaign, utm_content, utm_term,
          gclid, fbclid, meta_fbc, meta_fbp,
          ip_address, user_agent, dados_extras_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       RETURNING id, contato_id, empreendimento_id, tipologia_id, origem, created_at`,
    ).bind(
      contatoId,
      empreendimentoId,
      tipologiaId,
      idempotencyKey,
      conflito.origem,
      conflito.canal,
      conflito.utm_source,
      conflito.utm_medium,
      conflito.utm_campaign,
      conflito.utm_content,
      conflito.utm_term,
      conflito.gclid,
      conflito.fbclid,
      conflito.meta_fbc,
      conflito.meta_fbp,
      rawIp,
      request.headers.get('user-agent')?.slice(0, 500) ?? null,
      JSON.stringify({ _resolvido_de_conflito: conflito.id, escolha: body.escolha }),
    ).first<{
      id: number;
      contato_id: number;
      empreendimento_id: number | null;
      tipologia_id: number | null;
      origem: string;
      created_at: string;
    }>();
  } catch (insertErr) {
    // Rollback compensatório: devolver status para 'pendente' para que outro
    // operador (ou uma nova tentativa) possa resolver o conflito
    await env.DB.prepare(
      `UPDATE captacoes_conflito
       SET status = 'pendente', resolvido_por = NULL, resolvido_at = NULL
       WHERE id = ?`,
    ).bind(conflito.id).run();
    console.error('[conflitos] Erro ao inserir lead (rollback executado):', insertErr);
    return jsonError('Erro ao criar lead a partir do conflito', 500);
  }

  if (!leadResult) {
    // INSERT executou mas não retornou linha — situação inesperada
    // Rollback compensatório para consistência
    await env.DB.prepare(
      `UPDATE captacoes_conflito
       SET status = 'pendente', resolvido_por = NULL, resolvido_at = NULL
       WHERE id = ?`,
    ).bind(conflito.id).run();
    return jsonError('Erro ao criar lead a partir do conflito: nenhuma linha retornada', 500);
  }

  // ── PASSO 3: Atualizar lead_id_gerado na captacao_conflito ────────────────
  await env.DB.prepare(
    `UPDATE captacoes_conflito SET lead_id_gerado = ? WHERE id = ?`,
  ).bind(leadResult.id, conflito.id).run();

  // Audit log
  await writeAudit({
    db: env.DB,
    usuarioId: user.id,
    tabela: 'captacoes_conflito',
    registroId: conflito.id,
    acao: 'UPDATE',
    dadosAnt: { status: 'pendente' },
    dadosNov: { status: novoStatus, lead_id_gerado: leadResult.id },
    ip: rawIp,
  });

  await writeAudit({
    db: env.DB,
    usuarioId: user.id,
    tabela: 'leads',
    registroId: leadResult.id,
    acao: 'INSERT',
    dadosNov: leadResult as unknown as Record<string, unknown>,
    ip: rawIp,
  });

  return jsonCreated({
    conflito_id: conflito.id,
    status: novoStatus,
    lead_id: leadResult.id,
    contato_id: contatoId,
    escolha: body.escolha,
  });
}

// ─── Router de conflitos ──────────────────────────────────────────────────────
export async function handleConflitos(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
  pathParts: string[],
): Promise<Response> {
  const method = request.method;
  // /api/v1/conflitos         → pathParts[4] undefined
  // /api/v1/conflitos/:id     → pathParts[4] = id
  // /api/v1/conflitos/:id/resolver → pathParts[4] = id, pathParts[5] = 'resolver'
  const resourceId = pathParts[4];
  const subAction  = pathParts[5];

  try {
    if (method === 'GET' && !resourceId) {
      return await listConflitos(request, env, user);
    }
    if (method === 'POST' && resourceId && subAction === 'resolver') {
      return await resolverConflito(request, env, user, resourceId);
    }
  } catch (err) {
    console.error('[conflitos] Erro:', err);
    return jsonError('Erro interno do servidor', 500);
  }

  return jsonError('Método não permitido', 405);
}
