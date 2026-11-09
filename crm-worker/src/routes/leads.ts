/**
 * routes/leads.ts
 *
 * POST /api/v1/leads          → criar lead (dedup por telefone + idempotência)
 * GET  /api/v1/leads          → listar (admin: todos; corretor: apenas com oportunidade sua)
 * GET  /api/v1/leads/:id      → detalhe
 *
 * Corrigido B4: alinhado com schema D1 real
 *   - Removidos responsavel_id e status (não existem na tabela leads)
 *   - RBAC de corretor implementado via oportunidades.responsavel_id
 *   - leads não possui deleted_at — filtro removido
 *   - Idempotency check sem l.status
 *   - UTMs e tracking preservados no INSERT
 */

import type { Env, AuthenticatedUser, CreateLeadPayload } from '../types';
import { AuthError } from '../auth';
import {
  jsonOk, jsonCreated, jsonError, jsonIdempotent,
  normalizePhone, parseJsonBody, writeAudit, getClientIp, sanitizeIp,
} from '../utils';
import {
  resolveContact, findLeadByIdempotencyKey, normalizeEmail,
} from '../services/contact-resolver';

// ─── Criar lead com deduplicação e idempotência ───────────────────────────────
async function createLead(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
): Promise<Response> {
  let body: CreateLeadPayload;
  try {
    body = await parseJsonBody<CreateLeadPayload>(request);
  } catch (err) {
    return jsonError((err as Error).message, 400);
  }

  // Validação básica
  if (!body.telefone?.trim()) {
    return jsonError('Campo obrigatório: telefone', 400);
  }
  if (!body.origem?.trim()) {
    return jsonError('Campo obrigatório: origem', 400);
  }

  // Normalizar telefone E.164
  const telefone = normalizePhone(body.telefone);
  if (!telefone) {
    return jsonError(
      `Telefone inválido: '${body.telefone}'. Formato esperado: DDD + número (10 ou 11 dígitos)`,
      422,
    );
  }

  // ── Idempotência: verificar chave antes de qualquer INSERT ────────────────
  if (body.idempotency_key) {
    const existing = await findLeadByIdempotencyKey(env.DB, body.idempotency_key);
    if (existing) {
      return jsonIdempotent(existing);
    }
  }

  // ── Resolver contato via ContactResolver (dedup por telefone + email) ─────
  const resolved = await resolveContact(env.DB, {
    telefone,
    email: normalizeEmail(body.email),
    nome: body.nome?.trim() ?? null,
  });

  // Conflito detectado na rota autenticada: retornar 409 com detalhe
  // O corretor pode então abrir a ficha do contato existente para decidir.
  if (resolved.kind === 'conflict') {
    return jsonError(
      `Conflito de duplicidade: o telefone pertence ao contato #${resolved.tel_id} ` +
      `e o e-mail pertence ao contato #${resolved.email_id}. ` +
      `Verifique e unifique manualmente antes de criar este lead.`,
      409,
    );
  }

  const contato = { id: resolved.contato_id };

  // ── Validar empreendimento se informado ──────────────────────────────────
  const empreendimentoId = body.empreendimento_id ?? null;
  const tipologiaId = body.tipologia_id ?? null;

  if (empreendimentoId !== null) {
    const empr = await env.DB.prepare(
      `SELECT id FROM empreendimentos WHERE id = ? AND deleted_at IS NULL`,
    ).bind(empreendimentoId).first();
    if (!empr) {
      return jsonError(`Empreendimento id=${empreendimentoId} não encontrado`, 422);
    }
  }

  // ── IP sanitizado (LGPD) ─────────────────────────────────────────────────
  const rawIp = getClientIp(request);
  const ipSanitizado = rawIp ? sanitizeIp(rawIp) : null;

  // ── Inserir lead ──────────────────────────────────────────────────────────
  // Schema leads: id, contato_id, empreendimento_id, tipologia_id,
  //   idempotency_key, origem, canal,
  //   utm_source, utm_medium, utm_campaign, utm_content, utm_term,
  //   gclid, fbclid, meta_fbc, meta_fbp, ip_address, user_agent, created_at
  const leadResult = await env.DB.prepare(
    `INSERT INTO leads
       (contato_id, empreendimento_id, tipologia_id, idempotency_key,
        origem, canal,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term,
        gclid, fbclid, meta_fbc, meta_fbp,
        ip_address, user_agent)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     RETURNING id, contato_id, empreendimento_id, tipologia_id, origem, created_at`,
  ).bind(
    contato.id,
    empreendimentoId,
    tipologiaId,
    body.idempotency_key ?? null,
    body.origem.trim(),
    body.canal?.trim() ?? null,
    body.utm_source?.trim() ?? null,
    body.utm_medium?.trim() ?? null,
    body.utm_campaign?.trim() ?? null,
    body.utm_content?.trim() ?? null,
    body.utm_term?.trim() ?? null,
    body.gclid?.trim() ?? null,
    body.fbclid?.trim() ?? null,
    body.meta_fbc ?? null,
    body.meta_fbp ?? null,
    ipSanitizado,
    request.headers.get('user-agent')?.slice(0, 500) ?? null,
  ).first();

  if (!leadResult) {
    return jsonError('Erro ao criar lead', 500);
  }

  const lead = leadResult as {
    id: number;
    contato_id: number;
    empreendimento_id: number | null;
    tipologia_id: number | null;
    origem: string;
    created_at: string;
  };

  // Audit log
  await writeAudit({
    db: env.DB,
    usuarioId: user.id,
    tabela: 'leads',
    registroId: lead.id,
    acao: 'INSERT',
    dadosNov: lead as unknown as Record<string, unknown>,
    ip: rawIp,
  });

  return jsonCreated({ ...lead, telefone_normalizado: telefone });
}

// ─── Listar leads ─────────────────────────────────────────────────────────────
async function listLeads(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
): Promise<Response> {
  const url = new URL(request.url);
  const emprId = url.searchParams.get('empreendimento_id');
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50'), 100);
  const offset = parseInt(url.searchParams.get('offset') ?? '0');

  const whereEmpr = emprId ? 'AND l.empreendimento_id = ?' : '';

  // RBAC: corretor vê apenas leads que têm uma oportunidade atribuída a ele
  // Admin e assistente veem todos
  const whereUser = user.perfil === 'admin' || user.perfil === 'assistente'
    ? ''
    : `AND EXISTS (
         SELECT 1 FROM oportunidades o
         WHERE o.lead_id = l.id AND o.responsavel_id = ?
       )`;

  const sql = `
    SELECT l.id, l.origem, l.canal, l.created_at,
           c.telefone, c.nome AS contato_nome,
           e.nome AS empreendimento_nome
    FROM leads l
    JOIN contatos c ON c.id = l.contato_id
    LEFT JOIN empreendimentos e ON e.id = l.empreendimento_id
    WHERE c.deleted_at IS NULL
      AND c.anonimizado_at IS NULL
      ${whereUser}
      ${whereEmpr}
    ORDER BY l.created_at DESC
    LIMIT ? OFFSET ?
  `;

  const binds: (string | number)[] = [];
  if (user.perfil !== 'admin' && user.perfil !== 'assistente') binds.push(user.id);
  if (emprId) binds.push(emprId);
  binds.push(limit, offset);

  const results = await env.DB.prepare(sql).bind(...binds).all();

  return jsonOk({
    leads: results.results,
    meta: { limit, offset, count: results.results.length },
  });
}

// ─── Detalhe de um lead ───────────────────────────────────────────────────────
async function getLead(
  _request: Request,
  env: Env,
  user: AuthenticatedUser,
  id: string,
): Promise<Response> {
  const lead = await env.DB.prepare(
    `SELECT l.id, l.contato_id, l.empreendimento_id, l.tipologia_id,
            l.origem, l.canal, l.utm_source, l.utm_medium, l.utm_campaign,
            l.gclid, l.fbclid, l.created_at,
            c.telefone, c.nome AS contato_nome, c.email AS contato_email
     FROM leads l
     JOIN contatos c ON c.id = l.contato_id
     WHERE l.id = ?`,
  ).bind(id).first<Record<string, unknown>>();

  if (!lead) {
    return jsonError('Lead não encontrado', 404);
  }

  // RBAC: corretor só vê lead se tiver oportunidade atribuída a ele
  if (user.perfil !== 'admin' && user.perfil !== 'assistente') {
    const hasOportunidade = await env.DB.prepare(
      `SELECT 1 FROM oportunidades WHERE lead_id = ? AND responsavel_id = ? LIMIT 1`,
    ).bind(id, user.id).first();

    if (!hasOportunidade) {
      return jsonError('Acesso negado a este lead', 403);
    }
  }

  // Incluir oportunidades associadas
  const oportunidades = await env.DB.prepare(
    `SELECT o.id, o.estagio, o.responsavel_id, o.valor_negocio,
            o.created_at, o.updated_at, o.fechada_at,
            u.nome AS responsavel_nome
     FROM oportunidades o
     LEFT JOIN usuarios u ON u.id = o.responsavel_id
     WHERE o.lead_id = ?
     ORDER BY o.created_at DESC`,
  ).bind(id).all();

  return jsonOk({ ...lead, oportunidades: oportunidades.results });
}

// ─── Router de leads ──────────────────────────────────────────────────────────
export async function handleLeads(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
  pathParts: string[],
): Promise<Response> {
  const method = request.method;
  const resourceId = pathParts[4]; // /api/v1/leads/:id

  try {
    if (method === 'POST' && !resourceId) {
      return await createLead(request, env, user);
    }
    if (method === 'GET' && !resourceId) {
      return await listLeads(request, env, user);
    }
    if (method === 'GET' && resourceId) {
      return await getLead(request, env, user, resourceId);
    }
  } catch (err) {
    if (err instanceof AuthError) {
      return jsonError(err.message, err.statusCode);
    }
    console.error('[leads] Erro:', err);
    return jsonError('Erro interno do servidor', 500);
  }

  return jsonError('Método não permitido', 405);
}
