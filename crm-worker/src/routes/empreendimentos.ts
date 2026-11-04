/**
 * routes/empreendimentos.ts
 *
 * GET  /api/v1/empreendimentos          → listar (todos autenticados)
 * GET  /api/v1/empreendimentos/:id      → detalhe com tipologias
 * POST /api/v1/empreendimentos          → criar (admin only)
 *
 * Corrigido B2: alinhado com schema D1 real
 *   - faixa_programa → faixa_mcmv (INTEGER 1|2|3)
 *   - descricao_curta → descricao
 *   - endereco_completo → logradouro, numero, complemento
 *   - area_privativa_m2 (tipologias) → area_m2
 *   - adicionado slug obrigatório (UNIQUE no schema)
 *   - tipologias não possuem deleted_at
 */

import type { Env, AuthenticatedUser, CreateEmpreendimentoPayload } from '../types';
import { requirePerfil, AuthError } from '../auth';
import {
  jsonOk, jsonCreated, jsonError,
  parseJsonBody, writeAudit, getClientIp,
} from '../utils';

/** Converte texto em slug URL-safe */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

// ─── Listar empreendimentos ───────────────────────────────────────────────────
async function listEmpreendimentos(
  _request: Request,
  env: Env,
  _user: AuthenticatedUser,
): Promise<Response> {
  const results = await env.DB.prepare(
    `SELECT id, slug, nome, cidade, uf, bairro, faixa_mcmv, status,
            descricao, area_privativa_min, area_privativa_max,
            valor_min, valor_max, created_at
     FROM empreendimentos
     WHERE deleted_at IS NULL AND ativo = 1
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
  // Aceita busca por id numérico ou por slug
  const isNumeric = /^\d+$/.test(id);
  const whereClause = isNumeric ? 'id = ?' : 'slug = ?';

  const empr = await env.DB.prepare(
    `SELECT * FROM empreendimentos WHERE ${whereClause} AND deleted_at IS NULL`,
  ).bind(id).first();

  if (!empr) {
    return jsonError('Empreendimento não encontrado', 404);
  }

  // tipologias não possuem deleted_at no schema D1
  const tipologias = await env.DB.prepare(
    `SELECT id, nome, quartos, suites, banheiros, vagas,
            area_m2, valor_base, valor_entrada_min, valor_parcela_estimada,
            situacao_comercial, caracteristicas_json
     FROM tipologias
     WHERE empreendimento_id = ?
     ORDER BY quartos, valor_base`,
  ).bind((empr as { id: number }).id).all();

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

  // Campos obrigatórios
  if (!body.nome?.trim()) {
    return jsonError('Campo obrigatório: nome', 400);
  }
  if (!body.cidade?.trim()) {
    return jsonError('Campo obrigatório: cidade', 400);
  }
  if (!body.uf?.trim()) {
    return jsonError('Campo obrigatório: uf', 400);
  }

  const uf = body.uf.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(uf)) {
    return jsonError('UF inválida (use 2 letras maiúsculas, ex: RJ)', 400);
  }

  // faixa_mcmv é INTEGER 1, 2 ou 3
  if (body.faixa_mcmv !== undefined && ![1, 2, 3].includes(body.faixa_mcmv)) {
    return jsonError('faixa_mcmv deve ser 1, 2 ou 3', 400);
  }

  // status (default lancamento)
  const statusValidos = ['em_breve', 'lancamento', 'em_obras', 'pronto', 'encerrado'];
  const status = body.status ?? 'lancamento';
  if (!statusValidos.includes(status)) {
    return jsonError(`status inválido. Valores aceitos: ${statusValidos.join(', ')}`, 400);
  }

  // Gerar slug se não fornecido
  const slugBase = body.slug?.trim() || slugify(`${body.nome.trim()} ${body.cidade.trim()}`);

  // Garantir unicidade de slug
  let slug = slugBase;
  const existing = await env.DB.prepare(
    `SELECT id FROM empreendimentos WHERE slug = ?`,
  ).bind(slug).first();
  if (existing) {
    // Adicionar sufixo numérico para evitar colisão
    slug = `${slugBase}-${Date.now()}`;
  }

  const result = await env.DB.prepare(
    `INSERT INTO empreendimentos
       (slug, nome, construtora, cidade, uf, bairro,
        logradouro, numero, complemento, cep,
        faixa_mcmv, status, descricao,
        area_privativa_min, area_privativa_max,
        valor_min, valor_max)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     RETURNING id, slug, nome, cidade, uf, faixa_mcmv, status, created_at`,
  ).bind(
    slug,
    body.nome.trim(),
    body.construtora?.trim() ?? null,
    body.cidade.trim(),
    uf,
    body.bairro?.trim() ?? null,
    body.logradouro?.trim() ?? null,
    body.numero?.trim() ?? null,
    body.complemento?.trim() ?? null,
    body.cep?.replace(/\D/g, '').slice(0, 8) ?? null,
    body.faixa_mcmv ?? null,
    status,
    body.descricao?.trim() ?? null,
    body.area_privativa_min ?? null,
    body.area_privativa_max ?? null,
    body.valor_min ?? null,
    body.valor_max ?? null,
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
