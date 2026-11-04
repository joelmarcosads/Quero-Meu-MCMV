/**
 * routes/interacoes.ts
 *
 * GET  /api/v1/interacoes  → listar (filtro: contato_id e/ou oportunidade_id)
 * POST /api/v1/interacoes  → registrar interação
 */

import type { Env, AuthenticatedUser } from '../types';
import { AuthError } from '../auth';
import { jsonOk, jsonCreated, jsonError, parseJsonBody, writeAudit, getClientIp } from '../utils';

const TIPOS_VALIDOS = ['ligacao', 'whatsapp', 'email', 'visita', 'anotacao', 'sistema'] as const;
const DIRECOES_VALIDAS = ['entrada', 'saida', 'interno'] as const;

type TipoInteracao = typeof TIPOS_VALIDOS[number];
type DirecaoInteracao = typeof DIRECOES_VALIDAS[number];

// ─── Listar interações ────────────────────────────────────────────────────────
async function listInteracoes(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
): Promise<Response> {
  const url = new URL(request.url);
  const contatoId = url.searchParams.get('contato_id');
  const oportunidadeId = url.searchParams.get('oportunidade_id');
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50'), 100);
  const offset = parseInt(url.searchParams.get('offset') ?? '0');

  if (!contatoId && !oportunidadeId) {
    return jsonError('Informe contato_id ou oportunidade_id', 400);
  }

  // RBAC: corretor só vê interações de contatos/oportunidades suas
  if (user.perfil !== 'admin' && user.perfil !== 'assistente') {
    if (contatoId) {
      const hasAccess = await env.DB.prepare(
        `SELECT 1 FROM oportunidades WHERE contato_id = ? AND responsavel_id = ? LIMIT 1`,
      ).bind(contatoId, user.id).first();
      if (!hasAccess) return jsonError('Acesso negado', 403);
    }
    if (oportunidadeId) {
      const hasAccess = await env.DB.prepare(
        `SELECT 1 FROM oportunidades WHERE id = ? AND responsavel_id = ? LIMIT 1`,
      ).bind(oportunidadeId, user.id).first();
      if (!hasAccess) return jsonError('Acesso negado', 403);
    }
  }

  const whereContato = contatoId ? 'AND i.contato_id = ?' : '';
  const whereOportunidade = oportunidadeId ? 'AND i.oportunidade_id = ?' : '';

  const sql = `
    SELECT i.id, i.tipo, i.direcao, i.conteudo, i.duracao_seg,
           i.created_at, i.contato_id, i.oportunidade_id,
           u.nome AS usuario_nome
    FROM interacoes i
    LEFT JOIN usuarios u ON u.id = i.usuario_id
    WHERE 1=1
      ${whereContato}
      ${whereOportunidade}
    ORDER BY i.created_at DESC
    LIMIT ? OFFSET ?
  `;

  const binds: (string | number)[] = [];
  if (contatoId) binds.push(contatoId);
  if (oportunidadeId) binds.push(oportunidadeId);
  binds.push(limit, offset);

  const results = await env.DB.prepare(sql).bind(...binds).all();

  return jsonOk({
    interacoes: results.results,
    meta: { limit, offset, count: results.results.length },
  });
}

// ─── Criar interação ──────────────────────────────────────────────────────────
async function createInteracao(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
): Promise<Response> {
  let body: {
    contato_id: number;
    oportunidade_id?: number;
    tipo: string;
    direcao?: string;
    conteudo: string;
    duracao_seg?: number;
  };

  try {
    body = await parseJsonBody(request);
  } catch (err) {
    return jsonError((err as Error).message, 400);
  }

  if (!body.contato_id) return jsonError('Campo obrigatório: contato_id', 400);
  if (!body.tipo) return jsonError('Campo obrigatório: tipo', 400);
  if (!body.conteudo?.trim()) return jsonError('Campo obrigatório: conteudo', 400);

  if (!TIPOS_VALIDOS.includes(body.tipo as TipoInteracao)) {
    return jsonError(`tipo inválido. Valores aceitos: ${TIPOS_VALIDOS.join(', ')}`, 422);
  }

  const direcao = body.direcao ?? 'interno';
  if (!DIRECOES_VALIDAS.includes(direcao as DirecaoInteracao)) {
    return jsonError(`direcao inválida. Valores aceitos: ${DIRECOES_VALIDAS.join(', ')}`, 422);
  }

  // RBAC: corretor só cria se tiver acesso ao contato/oportunidade
  if (user.perfil !== 'admin' && user.perfil !== 'assistente') {
    const hasAccess = await env.DB.prepare(
      `SELECT 1 FROM oportunidades WHERE contato_id = ? AND responsavel_id = ? LIMIT 1`,
    ).bind(body.contato_id, user.id).first();
    if (!hasAccess) return jsonError('Acesso negado a este contato', 403);
  }

  const result = await env.DB.prepare(
    `INSERT INTO interacoes (contato_id, oportunidade_id, usuario_id, tipo, direcao, conteudo, duracao_seg)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     RETURNING id, contato_id, oportunidade_id, tipo, direcao, conteudo, duracao_seg, created_at`,
  ).bind(
    body.contato_id,
    body.oportunidade_id ?? null,
    user.id,
    body.tipo,
    direcao,
    body.conteudo.trim(),
    body.duracao_seg ?? null,
  ).first();

  if (!result) return jsonError('Erro ao registrar interação', 500);

  await writeAudit({
    db: env.DB,
    usuarioId: user.id,
    tabela: 'interacoes',
    registroId: (result as { id: number }).id,
    acao: 'INSERT',
    dadosNov: result as Record<string, unknown>,
    ip: getClientIp(request),
  });

  return jsonCreated(result);
}

// ─── Router ───────────────────────────────────────────────────────────────────
export async function handleInteracoes(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
): Promise<Response> {
  const method = request.method;

  try {
    if (method === 'GET') return await listInteracoes(request, env, user);
    if (method === 'POST') return await createInteracao(request, env, user);
  } catch (err) {
    if (err instanceof AuthError) return jsonError(err.message, err.statusCode);
    console.error('[interacoes] Erro:', err);
    return jsonError('Erro interno do servidor', 500);
  }

  return jsonError('Método não permitido', 405);
}
