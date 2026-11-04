/**
 * routes/oportunidades.ts
 *
 * PATCH /api/v1/oportunidades/:id/estagio  → alterar estágio (corretor dono ou admin)
 * GET   /api/v1/oportunidades              → listar (abertas por default)
 * POST  /api/v1/oportunidades              → criar (admin ou corretor)
 *
 * Corrigido B3: alinhado com schema D1 real
 *   - ESTAGIOS_VALIDOS sincronizado com CHECK constraint da tabela oportunidades
 *   - deleted_at → fechada_at (oportunidades não possui deleted_at)
 *   - motivo_perda: 'perdido' → 'fechado_perdido'
 */

import type { Env, AuthenticatedUser } from '../types';
import { AuthError, requireOwnershipOrAdmin } from '../auth';
import { jsonOk, jsonCreated, jsonError, parseJsonBody, writeAudit, getClientIp } from '../utils';

// Estágios exatamente como definidos no CHECK constraint do schema D1
const ESTAGIOS_VALIDOS = [
  'novo_lead',
  'em_contato',
  'visita_solicitada',
  'visita_agendada',
  'visita_realizada',
  'proposta_enviada',
  'documentacao',
  'fechado_ganho',
  'fechado_perdido',
] as const;

type Estagio = typeof ESTAGIOS_VALIDOS[number];

// ─── Alterar estágio ──────────────────────────────────────────────────────────
async function patchEstagio(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
  id: string,
): Promise<Response> {
  // oportunidades usa fechada_at, não deleted_at
  const oport = await env.DB.prepare(
    `SELECT id, responsavel_id, estagio FROM oportunidades WHERE id = ? AND fechada_at IS NULL`,
  ).bind(id).first<{ id: number; responsavel_id: number | null; estagio: string }>();

  if (!oport) {
    return jsonError('Oportunidade não encontrada ou já encerrada', 404);
  }

  // Verificar ownership: corretor só altera a sua
  requireOwnershipOrAdmin(user, oport.responsavel_id);

  let body: { estagio: string; motivo_perda?: string };
  try {
    body = await parseJsonBody(request);
  } catch (err) {
    return jsonError((err as Error).message, 400);
  }

  if (!body.estagio) {
    return jsonError('Campo obrigatório: estagio', 400);
  }

  if (!ESTAGIOS_VALIDOS.includes(body.estagio as Estagio)) {
    return jsonError(
      `Estágio inválido: '${body.estagio}'. Valores aceitos: ${ESTAGIOS_VALIDOS.join(', ')}`,
      422,
    );
  }

  const dadosAnt = { id: oport.id, estagio: oport.estagio };

  // Ao fechar a oportunidade, registrar fechada_at
  const isFechamento = body.estagio === 'fechado_ganho' || body.estagio === 'fechado_perdido';

  await env.DB.prepare(
    `UPDATE oportunidades
     SET estagio = ?,
         motivo_perda = ?,
         fechada_at = CASE WHEN ? THEN datetime('now') ELSE fechada_at END,
         updated_at = datetime('now')
     WHERE id = ?`,
  ).bind(
    body.estagio,
    body.estagio === 'fechado_perdido' ? (body.motivo_perda ?? null) : null,
    isFechamento ? 1 : 0,
    id,
  ).run();

  const atualizado = await env.DB.prepare(
    `SELECT id, estagio, responsavel_id, motivo_perda, updated_at, fechada_at
     FROM oportunidades WHERE id = ?`,
  ).bind(id).first();

  await writeAudit({
    db: env.DB,
    usuarioId: user.id,
    tabela: 'oportunidades',
    registroId: oport.id,
    acao: 'UPDATE',
    dadosAnt: dadosAnt as Record<string, unknown>,
    dadosNov: atualizado as Record<string, unknown>,
    ip: getClientIp(request),
  });

  return jsonOk(atualizado);
}

// ─── Criar oportunidade ───────────────────────────────────────────────────────
async function createOportunidade(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
): Promise<Response> {
  let body: {
    contato_id: number;
    lead_id?: number;
    empreendimento_id?: number;
    tipologia_id?: number;
    responsavel_id?: number;
    estagio?: string;
    valor_negocio?: number;
    data_previsao?: string;
    observacoes?: string;
    prioridade?: string;
  };

  try {
    body = await parseJsonBody(request);
  } catch (err) {
    return jsonError((err as Error).message, 400);
  }

  if (!body.contato_id) {
    return jsonError('Campo obrigatório: contato_id', 400);
  }

  const estagio = body.estagio ?? 'novo_lead';
  if (!ESTAGIOS_VALIDOS.includes(estagio as Estagio)) {
    return jsonError(
      `Estágio inválido: '${estagio}'. Valores aceitos: ${ESTAGIOS_VALIDOS.join(', ')}`,
      422,
    );
  }

  const prioridadesValidas = ['baixa', 'media', 'alta', 'urgente'];
  const prioridade = body.prioridade ?? 'media';
  if (!prioridadesValidas.includes(prioridade)) {
    return jsonError(`prioridade inválida. Valores aceitos: ${prioridadesValidas.join(', ')}`, 400);
  }

  // Corretor só pode atribuir a si mesmo; admin pode atribuir a qualquer um
  const responsavelId = user.perfil === 'admin'
    ? (body.responsavel_id ?? user.id)
    : user.id;

  const result = await env.DB.prepare(
    `INSERT INTO oportunidades
       (contato_id, lead_id, empreendimento_id, tipologia_id,
        estagio, responsavel_id, valor_negocio,
        data_previsao, observacoes, prioridade)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     RETURNING id, contato_id, lead_id, estagio, responsavel_id,
               prioridade, created_at`,
  ).bind(
    body.contato_id,
    body.lead_id ?? null,
    body.empreendimento_id ?? null,
    body.tipologia_id ?? null,
    estagio,
    responsavelId,
    body.valor_negocio ?? null,
    body.data_previsao ?? null,
    body.observacoes?.trim() ?? null,
    prioridade,
  ).first();

  if (!result) {
    return jsonError('Erro ao criar oportunidade', 500);
  }

  await writeAudit({
    db: env.DB,
    usuarioId: user.id,
    tabela: 'oportunidades',
    registroId: (result as { id: number }).id,
    acao: 'INSERT',
    dadosNov: result as Record<string, unknown>,
    ip: getClientIp(request),
  });

  return jsonCreated(result);
}

// ─── Listar oportunidades ─────────────────────────────────────────────────────
async function listOportunidades(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
): Promise<Response> {
  const url = new URL(request.url);
  const estagio = url.searchParams.get('estagio');
  const incluirFechadas = url.searchParams.get('incluir_fechadas') === '1';
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50'), 100);
  const offset = parseInt(url.searchParams.get('offset') ?? '0');

  // RBAC: corretor vê apenas as suas; admin/assistente veem todas
  const whereUser = user.perfil === 'admin' || user.perfil === 'assistente'
    ? ''
    : 'AND o.responsavel_id = ?';

  // oportunidades usa fechada_at (não deleted_at)
  const whereFechadas = incluirFechadas ? '' : 'AND o.fechada_at IS NULL';
  const whereEstagio = estagio ? 'AND o.estagio = ?' : '';

  const sql = `
    SELECT o.id, o.estagio, o.prioridade, o.valor_negocio,
           o.created_at, o.updated_at, o.fechada_at,
           c.nome AS contato_nome, c.telefone,
           e.nome AS empreendimento_nome,
           u.nome AS responsavel_nome
    FROM oportunidades o
    JOIN contatos c ON c.id = o.contato_id
    LEFT JOIN empreendimentos e ON e.id = o.empreendimento_id
    LEFT JOIN usuarios u ON u.id = o.responsavel_id
    WHERE c.deleted_at IS NULL
      ${whereFechadas}
      ${whereUser}
      ${whereEstagio}
    ORDER BY o.updated_at DESC
    LIMIT ? OFFSET ?
  `;

  const binds: (string | number)[] = [];
  if (user.perfil !== 'admin' && user.perfil !== 'assistente') binds.push(user.id);
  if (estagio) binds.push(estagio);
  binds.push(limit, offset);

  const results = await env.DB.prepare(sql).bind(...binds).all();
  return jsonOk({ oportunidades: results.results, meta: { limit, offset } });
}

// ─── Detalhe de oportunidade ──────────────────────────────────────────────────
async function getOportunidade(
  _request: Request,
  env: Env,
  user: AuthenticatedUser,
  id: string,
): Promise<Response> {
  const oport = await env.DB.prepare(
    `SELECT o.id, o.estagio, o.prioridade, o.valor_negocio, o.data_previsao,
            o.observacoes, o.motivo_perda, o.created_at, o.updated_at, o.fechada_at,
            o.contato_id, o.lead_id, o.empreendimento_id, o.tipologia_id,
            c.nome AS contato_nome, c.telefone AS contato_telefone, c.email AS contato_email,
            e.nome AS empreendimento_nome,
            u.id AS responsavel_id, u.nome AS responsavel_nome
     FROM oportunidades o
     JOIN contatos c ON c.id = o.contato_id
     LEFT JOIN empreendimentos e ON e.id = o.empreendimento_id
     LEFT JOIN usuarios u ON u.id = o.responsavel_id
     WHERE o.id = ?`,
  ).bind(id).first<Record<string, unknown>>();

  if (!oport) return jsonError('Oportunidade não encontrada', 404);

  // RBAC
  if (user.perfil !== 'admin' && user.perfil !== 'assistente') {
    if (oport['responsavel_id'] !== user.id) {
      return jsonError('Acesso negado', 403);
    }
  }

  // Interações
  const interacoes = await env.DB.prepare(
    `SELECT i.id, i.tipo, i.direcao, i.conteudo, i.duracao_seg, i.created_at,
            u.nome AS usuario_nome
     FROM interacoes i
     LEFT JOIN usuarios u ON u.id = i.usuario_id
     WHERE i.oportunidade_id = ?
     ORDER BY i.created_at DESC
     LIMIT 20`,
  ).bind(id).all();

  return jsonOk({ ...oport, interacoes: interacoes.results });
}

// ─── Atualizar oportunidade (responsavel, valor, observacoes, prioridade) ─────
async function patchOportunidade(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
  id: string,
): Promise<Response> {
  const oport = await env.DB.prepare(
    `SELECT id, responsavel_id, estagio, valor_negocio, observacoes, prioridade FROM oportunidades WHERE id = ?`,
  ).bind(id).first<{ id: number; responsavel_id: number | null; estagio: string; valor_negocio: number | null; observacoes: string | null; prioridade: string }>();

  if (!oport) return jsonError('Oportunidade não encontrada', 404);

  // Apenas admin pode reatribuir responsável; corretor só edita a sua
  if (user.perfil !== 'admin' && user.perfil !== 'assistente') {
    if (oport.responsavel_id !== user.id) return jsonError('Acesso negado', 403);
  }

  let body: Partial<{
    responsavel_id: number;
    valor_negocio: number;
    data_previsao: string;
    observacoes: string;
    prioridade: string;
  }>;

  try {
    body = await parseJsonBody(request);
  } catch (err) {
    return jsonError((err as Error).message, 400);
  }

  const campos: Record<string, unknown> = {};

  if (body.responsavel_id !== undefined) {
    if (user.perfil !== 'admin') return jsonError('Apenas admin pode reatribuir responsável', 403);
    campos['responsavel_id'] = body.responsavel_id;
  }
  if (body.valor_negocio !== undefined) campos['valor_negocio'] = body.valor_negocio;
  if (body.data_previsao !== undefined) campos['data_previsao'] = body.data_previsao;
  if (body.observacoes !== undefined) campos['observacoes'] = body.observacoes?.trim() ?? null;
  if (body.prioridade !== undefined) {
    const validas = ['baixa', 'media', 'alta', 'urgente'];
    if (!validas.includes(body.prioridade)) {
      return jsonError(`prioridade inválida. Aceitos: ${validas.join(', ')}`, 422);
    }
    campos['prioridade'] = body.prioridade;
  }

  if (Object.keys(campos).length === 0) {
    return jsonError('Nenhum campo para atualizar', 400);
  }

  const setClauses = Object.keys(campos).map(k => `${k} = ?`).join(', ');
  const values = [...Object.values(campos), id];

  await env.DB.prepare(
    `UPDATE oportunidades SET ${setClauses}, updated_at = datetime('now') WHERE id = ?`,
  ).bind(...values).run();

  const atualizado = await env.DB.prepare(
    `SELECT id, estagio, prioridade, valor_negocio, data_previsao, observacoes,
            responsavel_id, updated_at
     FROM oportunidades WHERE id = ?`,
  ).bind(id).first();

  await writeAudit({
    db: env.DB,
    usuarioId: user.id,
    tabela: 'oportunidades',
    registroId: oport.id,
    acao: 'UPDATE',
    dadosAnt: oport as Record<string, unknown>,
    dadosNov: atualizado as Record<string, unknown>,
    ip: getClientIp(request),
  });

  return jsonOk(atualizado);
}

// ─── Router ───────────────────────────────────────────────────────────────────
export async function handleOportunidades(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
  pathParts: string[],
): Promise<Response> {
  const method = request.method;
  const resourceId = pathParts[4]; // /api/v1/oportunidades/:id
  const subResource = pathParts[5]; // /api/v1/oportunidades/:id/estagio

  try {
    if (method === 'PATCH' && resourceId && subResource === 'estagio') {
      return await patchEstagio(request, env, user, resourceId);
    }
    if (method === 'GET' && resourceId && !subResource) {
      return await getOportunidade(request, env, user, resourceId);
    }
    if (method === 'PATCH' && resourceId && !subResource) {
      return await patchOportunidade(request, env, user, resourceId);
    }
    if (method === 'GET' && !resourceId) {
      return await listOportunidades(request, env, user);
    }
    if (method === 'POST' && !resourceId) {
      return await createOportunidade(request, env, user);
    }
  } catch (err) {
    if (err instanceof AuthError) {
      return jsonError(err.message, err.statusCode);
    }
    console.error('[oportunidades] Erro:', err);
    return jsonError('Erro interno do servidor', 500);
  }

  return jsonError('Rota não encontrada', 404);
}
