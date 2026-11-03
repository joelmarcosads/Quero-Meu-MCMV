/**
 * routes/empreendimentos.ts
 *
 * GET  /api/v1/empreendimentos          → listar (público via CF Access)
 * GET  /api/v1/empreendimentos/:id      → detalhe com tipologias
 * POST /api/v1/empreendimentos          → criar (admin only)
 */

import type { Env, AuthenticatedUser, CreateEmpreendimentoPayload } from '../types';
import { requirePerfil, AuthError } from '../auth';
import {
  jsonOk, jsonCreated, jsonError,
  parseJsonBody, writeAudit, getClientIp,
} from '../utils';

// ─── Listar empreendimentos ───────────────────────────────────────────────────
async function listEmpreendimentos(
  _request: Request,
  env: Env,
  _user: AuthenticatedUser,
): Promise<Response> {
  const results = await env.DB.prepare(
    `SELECT id, nome, cidade, uf, bairro, faixa_programa, status, descricao_curta, created_at
     FROM empreendimentos
     WHERE deleted_at IS NULL
     ORDER BY nome ASC`,
  ).all();

  return jsonOk(results.results);
}

// ─── Detalhe de um empreendimento com tipologias ──────────────────────────────
async function getEmpreendimento(
  _request: Request,
  env: Env,
  _user: AuthenticatedUser,
  id: string,
): Promise<Response> {
  const empr = await env.DB.prepare(
    `SELECT * FROM empreendimentos WHERE id = ? AND deleted_at IS NULL`,
  ).bind(id).first();

  if (!empr) {
    return jsonError('Empreendimento não encontrado', 404);
  }

  const tipologias = await env.DB.prepare(
    `SELECT id, nome, quartos, suites, banheiros, vagas,
            area_privativa_m2, valor_base, situacao_comercial
     FROM tipologias
     WHERE empreendimento_id = ? AND deleted_at IS NULL
     ORDER BY quartos, valor_base`,
  ).bind(id).all();

  return jsonOk({ ...empr, tipologias: tipologias.results });
}

// ─── Criar empreendimento (admin only) ───────────────────────────────────────
async function createEmpreendimento(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
): Promise<Response> {
  requirePerfil(user, ['admin']);

  let body: CreateEmpreendimentoPayload;
  try {
    body = await parseJsonBody<CreateEmpreendimentoPayload>(request);
  } catch (err) {
    return jsonError((err as Error).message, 400);
  }

  if (!body.nome?.trim() || !body.cidade?.trim() || !body.uf?.trim() || !body.faixa_programa?.trim()) {
    return jsonError('Campos obrigatórios: nome, cidade, uf, faixa_programa', 400);
  }

  const ufValida = /^[A-Z]{2}$/.test(body.uf.toUpperCase());
  if (!ufValida) {
    return jsonError('UF inválida (use 2 letras maiúsculas, ex: RJ)', 400);
  }

  const result = await env.DB.prepare(
    `INSERT INTO empreendimentos (nome, cidade, uf, bairro, endereco_completo, faixa_programa, status, descricao_curta)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     RETURNING id, nome, cidade, uf, faixa_programa, status, created_at`,
  ).bind(
    body.nome.trim(),
    body.cidade.trim(),
    body.uf.toUpperCase(),
    body.bairro?.trim() ?? null,
    body.endereco_completo?.trim() ?? null,
    body.faixa_programa.trim(),
    body.status ?? 'lancamento',
    body.descricao_curta?.trim() ?? null,
  ).first();

  if (!result) {
    return jsonError('Erro ao criar empreendimento', 500);
  }

  await writeAudit({
    db: env.DB,
    usuarioId: user.id,
    tabela: 'empreendimentos',
    registroId: (result as { id: number }).id,
    acao: 'INSERT',
    dadosNov: result as Record<string, unknown>,
    ip: getClientIp(request),
  });

  return jsonCreated(result);
}

// ─── Router de empreendimentos ────────────────────────────────────────────────
export async function handleEmpreendimentos(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
  pathParts: string[],
): Promise<Response> {
  const method = request.method;
  const resourceId = pathParts[4]; // /api/v1/empreendimentos/:id

  try {
    if (method === 'GET' && !resourceId) {
      return await listEmpreendimentos(request, env, user);
    }
    if (method === 'GET' && resourceId) {
      return await getEmpreendimento(request, env, user, resourceId);
    }
    if (method === 'POST' && !resourceId) {
      return await createEmpreendimento(request, env, user);
    }
  } catch (err) {
    if (err instanceof AuthError) {
      return jsonError(err.message, err.statusCode);
    }
    console.error('[empreendimentos] Erro:', err);
    return jsonError('Erro interno do servidor', 500);
  }

  return jsonError('Método não permitido', 405);
}
