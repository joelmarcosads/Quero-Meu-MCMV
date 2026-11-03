/**
 * routes/leads.ts
 *
 * POST /api/v1/leads          → criar lead (dedup por telefone + idempotência)
 * GET  /api/v1/leads          → listar (admin: todos; corretor: apenas seus)
 * GET  /api/v1/leads/:id      → detalhe
 */

import type { Env, AuthenticatedUser, CreateLeadPayload } from '../types';
import { AuthError, requirePerfil, requireOwnershipOrAdmin } from '../auth';
import {
  jsonOk, jsonCreated, jsonError, jsonIdempotent,
  normalizePhone, parseJsonBody, writeAudit, getClientIp,
} from '../utils';

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
    const existing = await env.DB.prepare(
      `SELECT l.id, l.contato_id, l.status, l.created_at
       FROM leads l
       WHERE l.idempotency_key = ?
       LIMIT 1`,
    ).bind(body.idempotency_key).first();

    if (existing) {
      return jsonIdempotent(existing);
    }
  }

  // ── Deduplicação race-safe de contato por telefone ────────────────────────
  // INSERT OR IGNORE: se telefone já existe (UNIQUE parcial), ignora silenciosamente
  await env.DB.prepare(
    `INSERT OR IGNORE INTO contatos (telefone, nome, email)
     VALUES (?, ?, ?)`,
  ).bind(
    telefone,
    body.nome?.trim() ?? null,
    body.email?.trim() ?? null,
  ).run();

  // SELECT garante o id correto independente de quem ganhou a corrida
  const contato = await env.DB.prepare(
    `SELECT id FROM contatos WHERE telefone = ? AND deleted_at IS NULL AND anonimizado_at IS NULL`,
  ).bind(telefone).first<{ id: number }>();

  if (!contato) {
    return jsonError('Erro ao localizar/criar contato', 500);
  }

  // ── Inserir lead ──────────────────────────────────────────────────────────
  const empreendimentoId = body.empreendimento_id ?? null;
  const tipologiaId = body.tipologia_id ?? null;

  // Validar empreendimento se informado
  if (empreendimentoId !== null) {
    const empr = await env.DB.prepare(
      `SELECT id FROM empreendimentos WHERE id = ? AND deleted_at IS NULL`,
    ).bind(empreendimentoId).first();
    if (!empr) {
      return jsonError(`Empreendimento id=${empreendimentoId} não encontrado`, 422);
    }
  }

  const leadResult = await env.DB.prepare(
    `INSERT INTO leads
       (contato_id, empreendimento_id, tipologia_id, responsavel_id,
        origem, canal, status, idempotency_key, meta_fbc, meta_fbp)
     VALUES (?, ?, ?, ?, ?, ?, 'novo', ?, ?, ?)
     RETURNING id, contato_id, empreendimento_id, status, created_at`,
  ).bind(
    contato.id,
    empreendimentoId,
    tipologiaId,
    null, // será atribuído pelo corretor responsável depois
    body.origem.trim(),
    body.canal?.trim() ?? null,
    body.idempotency_key ?? null,
    body.meta_fbc ?? null,
    body.meta_fbp ?? null,
  ).first();

  if (!leadResult) {
    return jsonError('Erro ao criar lead', 500);
  }

  const lead = leadResult as { id: number; contato_id: number; empreendimento_id: number | null; status: string; created_at: string };

  // Audit log (contatos sanitizados automaticamente dentro do writeAudit)
  await writeAudit({
    db: env.DB,
    usuarioId: user.id,
    tabela: 'leads',
    registroId: lead.id,
    acao: 'INSERT',
    dadosNov: lead as unknown as Record<string, unknown>,
    ip: getClientIp(request),
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
  const status = url.searchParams.get('status');
  const emprId = url.searchParams.get('empreendimento_id');
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50'), 100);
  const offset = parseInt(url.searchParams.get('offset') ?? '0');

  // Corretor: apenas seus leads. Admin: todos.
  const whereUser = user.perfil === 'admin' ? '' : 'AND l.responsavel_id = ?';
  const whereStatus = status ? 'AND l.status = ?' : '';
  const whereEmpr = emprId ? 'AND l.empreendimento_id = ?' : '';

  const sql = `
    SELECT l.id, l.status, l.origem, l.canal, l.created_at,
           c.telefone, c.nome AS contato_nome,
           e.nome AS empreendimento_nome
    FROM leads l
    JOIN contatos c ON c.id = l.contato_id
    LEFT JOIN empreendimentos e ON e.id = l.empreendimento_id
    WHERE l.deleted_at IS NULL
      AND c.deleted_at IS NULL
      AND c.anonimizado_at IS NULL
      ${whereUser}
      ${whereStatus}
      ${whereEmpr}
    ORDER BY l.created_at DESC
    LIMIT ? OFFSET ?
  `;

  const binds: (string | number)[] = [];
  if (user.perfil !== 'admin') binds.push(user.id);
  if (status) binds.push(status);
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
    `SELECT l.*, c.telefone, c.nome AS contato_nome, c.email AS contato_email
     FROM leads l
     JOIN contatos c ON c.id = l.contato_id
     WHERE l.id = ? AND l.deleted_at IS NULL`,
  ).bind(id).first<{ responsavel_id: number | null; [key: string]: unknown }>();

  if (!lead) {
    return jsonError('Lead não encontrado', 404);
  }

  // Corretor só pode ver seus leads ou não atribuídos (admin vê tudo)
  if (user.perfil !== 'admin' && lead.responsavel_id !== null && lead.responsavel_id !== user.id) {
    return jsonError('Acesso negado a este lead', 403);
  }

  return jsonOk(lead);
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
