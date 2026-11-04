/**
 * routes/usuarios.ts
 *
 * GET /api/v1/usuarios  → listar usuários ativos (admin/assistente apenas)
 * GET /api/v1/me        → dados do usuário autenticado (qualquer perfil)
 */

import type { Env, AuthenticatedUser } from '../types';
import { jsonOk, jsonError } from '../utils';

// ─── /me ─────────────────────────────────────────────────────────────────────
export async function handleMe(
  _request: Request,
  env: Env,
  user: AuthenticatedUser,
): Promise<Response> {
  const me = await env.DB.prepare(
    `SELECT id, nome, email, telefone, perfil, creci, ativo, ultimo_login_at, created_at
     FROM usuarios WHERE id = ?`,
  ).bind(user.id).first();

  if (!me) return jsonError('Usuário não encontrado', 404);

  // Atualizar ultimo_login_at assincronamente (fire and forget)
  env.DB.prepare(
    `UPDATE usuarios SET ultimo_login_at = datetime('now') WHERE id = ?`,
  ).bind(user.id).run().catch(() => {/* ignora */});

  return jsonOk(me);
}

// ─── Listar usuários ──────────────────────────────────────────────────────────
export async function handleUsuarios(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
): Promise<Response> {
  // Apenas admin e assistente podem listar usuários
  if (user.perfil !== 'admin' && user.perfil !== 'assistente') {
    return jsonError('Acesso restrito', 403);
  }

  const url = new URL(request.url);
  const perfil = url.searchParams.get('perfil');
  const apenasAtivos = url.searchParams.get('ativos') !== '0';

  const wherePerfil = perfil ? 'AND perfil = ?' : '';
  const whereAtivo = apenasAtivos ? 'AND ativo = 1' : '';

  const sql = `
    SELECT id, nome, email, telefone, perfil, creci, ativo, ultimo_login_at, created_at
    FROM usuarios
    WHERE 1=1
      ${whereAtivo}
      ${wherePerfil}
    ORDER BY nome ASC
    LIMIT 200
  `;

  const binds: (string | number)[] = [];
  if (perfil) binds.push(perfil);

  const results = await env.DB.prepare(sql).bind(...binds).all();

  return jsonOk({ usuarios: results.results });
}
