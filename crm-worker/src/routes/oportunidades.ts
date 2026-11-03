/**
 * routes/oportunidades.ts
 *
 * PATCH /api/v1/oportunidades/:id/estagio  → alterar estágio (corretor dono ou admin)
 * GET   /api/v1/oportunidades              → listar
 * POST  /api/v1/oportunidades              → criar (admin ou corretor)
 */

import type { Env, AuthenticatedUser } from '../types';
import { AuthError, requireOwnershipOrAdmin } from '../auth';
import { jsonOk, jsonError, parseJsonBody, writeAudit, getClientIp } from '../utils';

const ESTAGIOS_VALIDOS = [
  'novo', 'contato_realizado', 'visita_agendada', 'visita_realizada',
  'proposta_enviada', 'negociando', 'ganho', 'perdido', 'descartado',
] as const;

type Estagio = typeof ESTAGIOS_VALIDOS[number];

// ─── Alterar estágio ──────────────────────────────────────────────────────────
async function patchEstagio(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
  id: string,
): Promise<Response> {
  // Buscar oportunidade atual
  const oport = await env.DB.prepare(
    `SELECT id, responsavel_id, estagio FROM oportunidades WHERE id = ? AND deleted_at IS NULL`,
  ).bind(id).first<{ id: number; responsavel_id: number | null; estagio: string }>();

  if (!oport) {
    return jsonError('Oportunidade não encontrada', 404);
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

  await env.DB.prepare(
    `UPDATE oportunidades
     SET estagio = ?, motivo_perda = ?, updated_at = datetime('now')
     WHERE id = ?`,
  ).bind(
    body.estagio,
    body.estagio === 'perdido' ? (body.motivo_perda ?? null) : null,
    id,
  ).run();

  const atualizado = await env.DB.prepare(
    `SELECT id, estagio, responsavel_id, updated_at FROM oportunidades WHERE id = ?`,
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

// ─── Listar oportunidades ─────────────────────────────────────────────────────
async function listOportunidades(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
): Promise<Response> {
  const url = new URL(request.url);
  const estagio = url.searchParams.get('estagio');
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50'), 100);
  const offset = parseInt(url.searchParams.get('offset') ?? '0');

  const whereUser = user.perfil === 'admin' ? '' : 'AND o.responsavel_id = ?';
  const whereEstagio = estagio ? 'AND o.estagio = ?' : '';

  const sql = `
    SELECT o.id, o.estagio, o.created_at, o.updated_at,
           c.nome AS contato_nome, c.telefone,
           e.nome AS empreendimento_nome
    FROM oportunidades o
    JOIN contatos c ON c.id = o.contato_id
    LEFT JOIN empreendimentos e ON e.id = o.empreendimento_id
    WHERE o.deleted_at IS NULL AND c.deleted_at IS NULL
      ${whereUser} ${whereEstagio}
    ORDER BY o.updated_at DESC
    LIMIT ? OFFSET ?
  `;

  const binds: (string | number)[] = [];
  if (user.perfil !== 'admin') binds.push(user.id);
  if (estagio) binds.push(estagio);
  binds.push(limit, offset);

  const results = await env.DB.prepare(sql).bind(...binds).all();
  return jsonOk({ oportunidades: results.results, meta: { limit, offset } });
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
    if (method === 'GET' && !resourceId) {
      return await listOportunidades(request, env, user);
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
