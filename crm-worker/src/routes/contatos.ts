/**
 * routes/contatos.ts
 *
 * GET   /api/v1/contatos        → listar (admin/assistente: todos; corretor: apenas com oportunidade sua)
 * GET   /api/v1/contatos/:id    → detalhe
 * PATCH /api/v1/contatos/:id    → atualizar (nome, email, cidade, bairro, profissao, renda_faixa)
 */

import type { Env, AuthenticatedUser } from '../types';
import { AuthError } from '../auth';
import { jsonOk, jsonError, parseJsonBody, writeAudit, getClientIp } from '../utils';

// ─── Listar contatos ──────────────────────────────────────────────────────────
async function listContatos(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
): Promise<Response> {
  const url = new URL(request.url);
  const q = url.searchParams.get('q')?.trim();
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50'), 100);
  const offset = parseInt(url.searchParams.get('offset') ?? '0');

  // RBAC: corretor vê apenas contatos com oportunidade sua
  const whereUser =
    user.perfil === 'admin' || user.perfil === 'assistente'
      ? ''
      : `AND EXISTS (
           SELECT 1 FROM oportunidades o
           WHERE o.contato_id = c.id AND o.responsavel_id = ?
         )`;

  const whereQ = q
    ? `AND (c.nome LIKE ? OR c.telefone LIKE ? OR c.email LIKE ?)`
    : '';

  const sql = `
    SELECT c.id, c.nome, c.telefone, c.email, c.cidade, c.bairro, c.uf,
           c.profissao, c.renda_faixa, c.created_at,
           COUNT(DISTINCT o.id) AS total_oportunidades
    FROM contatos c
    LEFT JOIN oportunidades o ON o.contato_id = c.id
    WHERE c.deleted_at IS NULL
      AND c.anonimizado_at IS NULL
      ${whereUser}
      ${whereQ}
    GROUP BY c.id
    ORDER BY c.created_at DESC
    LIMIT ? OFFSET ?
  `;

  const binds: (string | number)[] = [];
  if (user.perfil !== 'admin' && user.perfil !== 'assistente') binds.push(user.id);
  if (q) {
    const like = `%${q}%`;
    binds.push(like, like, like);
  }
  binds.push(limit, offset);

  const results = await env.DB.prepare(sql).bind(...binds).all();

  return jsonOk({
    contatos: results.results,
    meta: { limit, offset, count: results.results.length },
  });
}

// ─── Detalhe de contato ───────────────────────────────────────────────────────
async function getContato(
  _request: Request,
  env: Env,
  user: AuthenticatedUser,
  id: string,
): Promise<Response> {
  // RBAC: corretor só acessa se tiver oportunidade com este contato
  if (user.perfil !== 'admin' && user.perfil !== 'assistente') {
    const hasAccess = await env.DB.prepare(
      `SELECT 1 FROM oportunidades WHERE contato_id = ? AND responsavel_id = ? LIMIT 1`,
    ).bind(id, user.id).first();
    if (!hasAccess) return jsonError('Acesso negado', 403);
  }

  const contato = await env.DB.prepare(
    `SELECT c.id, c.nome, c.telefone, c.email, c.cidade, c.bairro, c.uf,
            c.profissao, c.renda_faixa, c.data_nascimento_ano, c.created_at, c.updated_at
     FROM contatos c
     WHERE c.id = ? AND c.deleted_at IS NULL AND c.anonimizado_at IS NULL`,
  ).bind(id).first<Record<string, unknown>>();

  if (!contato) return jsonError('Contato não encontrado', 404);

  // Oportunidades do contato
  const oportunidades = await env.DB.prepare(
    `SELECT o.id, o.estagio, o.prioridade, o.valor_negocio,
            o.created_at, o.updated_at, o.fechada_at,
            e.nome AS empreendimento_nome,
            u.nome AS responsavel_nome
     FROM oportunidades o
     LEFT JOIN empreendimentos e ON e.id = o.empreendimento_id
     LEFT JOIN usuarios u ON u.id = o.responsavel_id
     WHERE o.contato_id = ?
     ORDER BY o.created_at DESC
     LIMIT 20`,
  ).bind(id).all();

  // Interações recentes
  const interacoes = await env.DB.prepare(
    `SELECT i.id, i.tipo, i.direcao, i.conteudo, i.created_at,
            u.nome AS usuario_nome
     FROM interacoes i
     LEFT JOIN usuarios u ON u.id = i.usuario_id
     WHERE i.contato_id = ?
     ORDER BY i.created_at DESC
     LIMIT 10`,
  ).bind(id).all();

  return jsonOk({
    ...contato,
    oportunidades: oportunidades.results,
    interacoes_recentes: interacoes.results,
  });
}

// ─── Atualizar contato ────────────────────────────────────────────────────────
async function patchContato(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
  id: string,
): Promise<Response> {
  // RBAC: corretor só edita se tiver oportunidade com o contato
  if (user.perfil !== 'admin' && user.perfil !== 'assistente') {
    const hasAccess = await env.DB.prepare(
      `SELECT 1 FROM oportunidades WHERE contato_id = ? AND responsavel_id = ? LIMIT 1`,
    ).bind(id, user.id).first();
    if (!hasAccess) return jsonError('Acesso negado', 403);
  }

  const contato = await env.DB.prepare(
    `SELECT id, nome, email, cidade, bairro, uf, profissao, renda_faixa FROM contatos
     WHERE id = ? AND deleted_at IS NULL AND anonimizado_at IS NULL`,
  ).bind(id).first<Record<string, unknown>>();

  if (!contato) return jsonError('Contato não encontrado', 404);

  let body: Partial<{
    nome: string;
    email: string;
    cidade: string;
    bairro: string;
    uf: string;
    profissao: string;
    renda_faixa: string;
    data_nascimento_ano: number;
  }>;

  try {
    body = await parseJsonBody(request);
  } catch (err) {
    return jsonError((err as Error).message, 400);
  }

  // Campos permitidos (telefone NÃO pode ser alterado aqui — dedup via lead flow)
  const campos: Record<string, unknown> = {};
  if (body.nome !== undefined) campos['nome'] = body.nome.trim();
  if (body.email !== undefined) campos['email'] = body.email.trim() || null;
  if (body.cidade !== undefined) campos['cidade'] = body.cidade.trim() || null;
  if (body.bairro !== undefined) campos['bairro'] = body.bairro.trim() || null;
  if (body.uf !== undefined) campos['uf'] = body.uf.trim().toUpperCase().slice(0, 2) || null;
  if (body.profissao !== undefined) campos['profissao'] = body.profissao.trim() || null;
  if (body.renda_faixa !== undefined) campos['renda_faixa'] = body.renda_faixa.trim() || null;
  if (body.data_nascimento_ano !== undefined)
    campos['data_nascimento_ano'] = body.data_nascimento_ano;

  if (Object.keys(campos).length === 0) {
    return jsonError('Nenhum campo para atualizar', 400);
  }

  const setClauses = Object.keys(campos)
    .map(k => `${k} = ?`)
    .join(', ');
  const values = [...Object.values(campos), id];

  await env.DB.prepare(
    `UPDATE contatos SET ${setClauses}, updated_at = datetime('now') WHERE id = ?`,
  ).bind(...values).run();

  const atualizado = await env.DB.prepare(
    `SELECT id, nome, telefone, email, cidade, bairro, uf, profissao, renda_faixa, updated_at
     FROM contatos WHERE id = ?`,
  ).bind(id).first();

  await writeAudit({
    db: env.DB,
    usuarioId: user.id,
    tabela: 'contatos',
    registroId: parseInt(id),
    acao: 'UPDATE',
    dadosAnt: contato,
    dadosNov: atualizado as Record<string, unknown>,
    ip: getClientIp(request),
  });

  return jsonOk(atualizado);
}

// ─── Router ───────────────────────────────────────────────────────────────────
export async function handleContatos(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
  pathParts: string[],
): Promise<Response> {
  const method = request.method;
  const resourceId = pathParts[4]; // /api/v1/contatos/:id

  try {
    if (method === 'GET' && !resourceId) return await listContatos(request, env, user);
    if (method === 'GET' && resourceId) return await getContato(request, env, user, resourceId);
    if (method === 'PATCH' && resourceId) return await patchContato(request, env, user, resourceId);
  } catch (err) {
    if (err instanceof AuthError) return jsonError(err.message, err.statusCode);
    console.error('[contatos] Erro:', err);
    return jsonError('Erro interno do servidor', 500);
  }

  return jsonError('Rota não encontrada', 404);
}
