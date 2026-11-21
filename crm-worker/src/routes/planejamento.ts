/**
 * routes/planejamento.ts — Módulo Planejamento Anual
 *
 * GET    /api/v1/planejamento                      → listar planos do usuário
 * POST   /api/v1/planejamento                      → criar plano (wizard step 1–3)
 * GET    /api/v1/planejamento/:id                  → resumo completo do plano
 * PATCH  /api/v1/planejamento/:id                  → atualizar meta/status
 * GET    /api/v1/planejamento/:id/canais            → canais do plano com cálculos
 * PATCH  /api/v1/planejamento/:id/canais/:canal_id  → ativar/inativar ou ajustar canal
 * GET    /api/v1/planejamento/:id/progresso         → progresso realizado vs meta
 * POST   /api/v1/planejamento/:id/progresso         → registrar mês realizado
 * GET    /api/v1/planejamento/config/canais         → config_canais (seed)
 * GET    /api/v1/planejamento/config/cpl            → config_cpl (faixas de CPL)
 */

import type { Env, AuthenticatedUser } from '../types';
import { jsonOk, jsonCreated, jsonError, parseJsonBody } from '../utils';
import {
  calcDiagnostico,
  calcPlanoCompleto,
  type ConfigCanal,
  type ConfigCpl,
  type PlanoAnual,
  type PlanoCanal,
} from '../services/planejamento-calculos';

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getConfigCanais(env: Env): Promise<ConfigCanal[]> {
  const { results } = await env.DB.prepare('SELECT * FROM config_canais ORDER BY peso DESC').all<ConfigCanal>();
  return results;
}

async function getConfigCpls(env: Env): Promise<ConfigCpl[]> {
  const { results } = await env.DB.prepare('SELECT * FROM config_cpl ORDER BY faixa').all<ConfigCpl>();
  return results;
}

async function getPlano(env: Env, id: number, userId: number): Promise<PlanoAnual | null> {
  return env.DB.prepare('SELECT * FROM plano_anual WHERE id = ? AND usuario_id = ?')
    .bind(id, userId)
    .first<PlanoAnual>();
}

async function getPlanoCanais(env: Env, planoId: number): Promise<PlanoCanal[]> {
  const { results } = await env.DB.prepare(
    'SELECT * FROM plano_canal WHERE plano_id = ? ORDER BY mes_entrada, canal_id',
  ).bind(planoId).all<PlanoCanal>();
  return results;
}

// ─── Rotas ───────────────────────────────────────────────────────────────────

/** GET /api/v1/planejamento/config/canais */
async function handleGetConfigCanais(env: Env): Promise<Response> {
  const canais = await getConfigCanais(env);
  return jsonOk({ canais });
}

/** GET /api/v1/planejamento/config/cpl */
async function handleGetConfigCpl(env: Env): Promise<Response> {
  const cpls = await getConfigCpls(env);
  return jsonOk({ cpls });
}

/** GET /api/v1/planejamento — lista planos do usuário */
async function handleListPlanos(env: Env, user: AuthenticatedUser): Promise<Response> {
  const { results } = await env.DB.prepare(
    `SELECT p.*,
       (SELECT COUNT(*) FROM plano_canal WHERE plano_id = p.id AND ativo = 1) AS canais_ativos
     FROM plano_anual p
     WHERE p.usuario_id = ?
     ORDER BY p.ano_referencia DESC`,
  ).bind(user.id).all();
  return jsonOk({ planos: results });
}

/** POST /api/v1/planejamento — criar plano */
async function handleCreatePlano(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
): Promise<Response> {
  const body = await parseJsonBody<{
    ano_referencia: number;
    ano_base: number;
    tipo_corretor?: string;
    comissao_base: number;
    pct_comissao: number;
    ticket_medio: number;
    meta_comissao: number;
    canais_iniciais?: Array<{ canal_id: string; ativo: boolean; imoveis_base?: number; mes_entrada?: number }>;
  }>(request);

  if (!body) return jsonError('Corpo da requisição inválido', 400);

  const { ano_referencia, ano_base, tipo_corretor = 'autonomo', comissao_base,
    pct_comissao, ticket_medio, meta_comissao, canais_iniciais = [] } = body;

  if (!ano_referencia || !comissao_base || !pct_comissao || !ticket_medio || !meta_comissao) {
    return jsonError('Campos obrigatórios: ano_referencia, comissao_base, pct_comissao, ticket_medio, meta_comissao', 400);
  }

  if (!['autonomo', 'imobiliaria'].includes(tipo_corretor)) {
    return jsonError('tipo_corretor deve ser "autonomo" ou "imobiliaria"', 400);
  }

  const diag = calcDiagnostico({ comissao_base, pct_comissao, ticket_medio });

  // Verificar se já existe plano para este ano
  const existing = await env.DB.prepare(
    'SELECT id FROM plano_anual WHERE usuario_id = ? AND ano_referencia = ?',
  ).bind(user.id, ano_referencia).first<{ id: number }>();
  if (existing) {
    return jsonError(`Já existe um plano para ${ano_referencia}`, 409);
  }

  // Inserir plano
  const ins = await env.DB.prepare(
    `INSERT INTO plano_anual (usuario_id, ano_referencia, ano_base, tipo_corretor,
       comissao_base, pct_comissao, ticket_medio, imoveis_base, meta_comissao)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(user.id, ano_referencia, ano_base ?? (ano_referencia - 1), tipo_corretor,
    comissao_base, pct_comissao, ticket_medio, diag.imoveis_base, meta_comissao).run();

  const planoNewId = ins.meta.last_row_id as number;

  // Buscar config de canais para seeding
  const configCanais = await getConfigCanais(env);

  // Criar entradas plano_canal para todos os 9 canais
  const stmts = configCanais.map(cfg => {
    const override = canais_iniciais.find(c => c.canal_id === cfg.canal_id);
    const ativo = override?.ativo ? 1 : (cfg.nucleo ? 1 : 0);
    const imoveis_base = override?.imoveis_base ?? 0;
    const mes_entrada = override?.mes_entrada ?? cfg.mes_entrada_padrao;
    return env.DB.prepare(
      `INSERT OR IGNORE INTO plano_canal (plano_id, canal_id, ativo, imoveis_base, mes_entrada)
       VALUES (?, ?, ?, ?, ?)`,
    ).bind(planoNewId, cfg.canal_id, ativo, imoveis_base, mes_entrada);
  });
  await env.DB.batch(stmts);

  const plano = await env.DB.prepare('SELECT * FROM plano_anual WHERE id = ?').bind(planoNewId).first<PlanoAnual>();
  return jsonCreated({ plano, diagnostico: diag });
}

/** GET /api/v1/planejamento/:id — resumo completo */
async function handleGetPlano(
  env: Env,
  user: AuthenticatedUser,
  id: number,
): Promise<Response> {
  const plano = await getPlano(env, id, user.id);
  if (!plano) return jsonError('Plano não encontrado', 404);

  const [configCanais, configCpls, planoCanais] = await Promise.all([
    getConfigCanais(env),
    getConfigCpls(env),
    getPlanoCanais(env, id),
  ]);

  if (planoCanais.length === 0) return jsonError('Plano sem canais configurados', 500);

  const resumo = calcPlanoCompleto(plano, planoCanais, configCanais, configCpls);
  return jsonOk(resumo);
}

/** PATCH /api/v1/planejamento/:id — atualizar meta/status */
async function handleUpdatePlano(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
  id: number,
): Promise<Response> {
  const plano = await getPlano(env, id, user.id);
  if (!plano) return jsonError('Plano não encontrado', 404);

  const body = await parseJsonBody<{
    meta_comissao?: number;
    ticket_medio?: number;
    pct_comissao?: number;
    status?: string;
  }>(request);
  if (!body) return jsonError('Corpo inválido', 400);

  const updates: string[] = [];
  const values: unknown[] = [];

  if (body.meta_comissao !== undefined) { updates.push('meta_comissao = ?'); values.push(body.meta_comissao); }
  if (body.ticket_medio !== undefined) { updates.push('ticket_medio = ?'); values.push(body.ticket_medio); }
  if (body.pct_comissao !== undefined) { updates.push('pct_comissao = ?'); values.push(body.pct_comissao); }
  if (body.status !== undefined) {
    if (!['rascunho', 'ativo', 'concluido'].includes(body.status)) {
      return jsonError('Status inválido', 400);
    }
    updates.push('status = ?'); values.push(body.status);
  }

  if (updates.length === 0) return jsonError('Nenhum campo para atualizar', 400);

  updates.push("updated_at = datetime('now')");
  values.push(id, user.id);

  await env.DB.prepare(
    `UPDATE plano_anual SET ${updates.join(', ')} WHERE id = ? AND usuario_id = ?`,
  ).bind(...values).run();

  const updated = await env.DB.prepare('SELECT * FROM plano_anual WHERE id = ?').bind(id).first<PlanoAnual>();
  return jsonOk({ plano: updated });
}

/** GET /api/v1/planejamento/:id/canais */
async function handleGetCanais(
  env: Env,
  user: AuthenticatedUser,
  id: number,
): Promise<Response> {
  const plano = await getPlano(env, id, user.id);
  if (!plano) return jsonError('Plano não encontrado', 404);

  const [configCanais, configCpls, planoCanais] = await Promise.all([
    getConfigCanais(env),
    getConfigCpls(env),
    getPlanoCanais(env, id),
  ]);

  const resumo = calcPlanoCompleto(plano, planoCanais, configCanais, configCpls);

  // Enriquecer com acoes do config
  const canaisEnriquecidos = resumo.canais.map(c => {
    const cfg = configCanais.find(cc => cc.canal_id === c.canal_id);
    return { ...c, acoes: cfg ? JSON.parse(cfg.acoes) : [], nucleo: cfg?.nucleo ?? 0 };
  });

  return jsonOk({
    canais: canaisEnriquecidos,
    health_score: resumo.health_score,
    investimento_total_mes: resumo.investimento_total_mes,
  });
}

/** PATCH /api/v1/planejamento/:id/canais/:canal_id */
async function handleUpdateCanal(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
  planoIdNum: number,
  canalId: string,
): Promise<Response> {
  const plano = await getPlano(env, planoIdNum, user.id);
  if (!plano) return jsonError('Plano não encontrado', 404);

  const body = await parseJsonBody<{
    ativo?: boolean;
    imoveis_base?: number;
    mes_entrada?: number;
    meta_mensal_ajustada?: number | null;
  }>(request);
  if (!body) return jsonError('Corpo inválido', 400);

  const updates: string[] = [];
  const values: unknown[] = [];

  if (body.ativo !== undefined) { updates.push('ativo = ?'); values.push(body.ativo ? 1 : 0); }
  if (body.imoveis_base !== undefined) { updates.push('imoveis_base = ?'); values.push(body.imoveis_base); }
  if (body.mes_entrada !== undefined) {
    if (body.mes_entrada < 1 || body.mes_entrada > 12) return jsonError('mes_entrada deve ser 1–12', 400);
    updates.push('mes_entrada = ?'); values.push(body.mes_entrada);
  }
  if ('meta_mensal_ajustada' in body) {
    updates.push('meta_mensal_ajustada = ?');
    values.push(body.meta_mensal_ajustada ?? null);
  }

  if (updates.length === 0) return jsonError('Nenhum campo para atualizar', 400);

  updates.push("updated_at = datetime('now')");
  values.push(planoIdNum, canalId);

  const result = await env.DB.prepare(
    `UPDATE plano_canal SET ${updates.join(', ')} WHERE plano_id = ? AND canal_id = ?`,
  ).bind(...values).run();

  if (result.meta.changes === 0) return jsonError('Canal não encontrado neste plano', 404);

  const updated = await env.DB.prepare(
    'SELECT * FROM plano_canal WHERE plano_id = ? AND canal_id = ?',
  ).bind(planoIdNum, canalId).first<PlanoCanal>();

  return jsonOk({ canal: updated });
}

/** GET /api/v1/planejamento/:id/progresso */
async function handleGetProgresso(
  env: Env,
  user: AuthenticatedUser,
  id: number,
): Promise<Response> {
  const plano = await getPlano(env, id, user.id);
  if (!plano) return jsonError('Plano não encontrado', 404);

  const { results } = await env.DB.prepare(
    `SELECT pc.canal_id, cc.nome, cc.icone, pp.*
     FROM plano_progresso_mes pp
     JOIN plano_canal pc ON pc.id = pp.plano_canal_id
     JOIN config_canais cc ON cc.canal_id = pc.canal_id
     WHERE pc.plano_id = ?
     ORDER BY pp.mes, pc.canal_id`,
  ).bind(id).all();

  return jsonOk({ progresso: results });
}

/** POST /api/v1/planejamento/:id/progresso */
async function handleUpsertProgresso(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
  id: number,
): Promise<Response> {
  const plano = await getPlano(env, id, user.id);
  if (!plano) return jsonError('Plano não encontrado', 404);

  const body = await parseJsonBody<{
    canal_id: string;
    mes: number;
    leads_recebidos?: number;
    visitas_realizadas?: number;
    imoveis_vendidos?: number;
    comissao_recebida?: number;
  }>(request);
  if (!body) return jsonError('Corpo inválido', 400);

  const { canal_id, mes, leads_recebidos = 0, visitas_realizadas = 0, imoveis_vendidos = 0, comissao_recebida = 0 } = body;

  if (!canal_id || !mes || mes < 1 || mes > 12) {
    return jsonError('canal_id e mes (1–12) são obrigatórios', 400);
  }

  const pc = await env.DB.prepare(
    'SELECT id FROM plano_canal WHERE plano_id = ? AND canal_id = ?',
  ).bind(id, canal_id).first<{ id: number }>();
  if (!pc) return jsonError('Canal não pertence a este plano', 404);

  await env.DB.prepare(
    `INSERT INTO plano_progresso_mes
       (plano_canal_id, mes, leads_recebidos, visitas_realizadas, imoveis_vendidos, comissao_recebida)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(plano_canal_id, mes) DO UPDATE SET
       leads_recebidos   = excluded.leads_recebidos,
       visitas_realizadas= excluded.visitas_realizadas,
       imoveis_vendidos  = excluded.imoveis_vendidos,
       comissao_recebida = excluded.comissao_recebida,
       updated_at        = datetime('now')`,
  ).bind(pc.id, mes, leads_recebidos, visitas_realizadas, imoveis_vendidos, comissao_recebida).run();

  return jsonOk({ ok: true, mes });
}

// ─── Router principal ─────────────────────────────────────────────────────────

export async function handlePlanejamento(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
): Promise<Response> {
  const url = new URL(request.url);
  const method = request.method.toUpperCase();
  const parts = url.pathname.split('/').filter(Boolean);
  // parts: ['api','v1','planejamento', ...]

  const afterPlano = parts.slice(3); // tudo depois de /api/v1/planejamento
  // afterPlano[0] = id | 'config'
  // afterPlano[1] = 'canais' | 'progresso'
  // afterPlano[2] = canal_id

  // /api/v1/planejamento/config/canais
  if (afterPlano[0] === 'config' && afterPlano[1] === 'canais' && method === 'GET') {
    return handleGetConfigCanais(env);
  }
  // /api/v1/planejamento/config/cpl
  if (afterPlano[0] === 'config' && afterPlano[1] === 'cpl' && method === 'GET') {
    return handleGetConfigCpl(env);
  }

  // /api/v1/planejamento (list / create)
  if (!afterPlano[0]) {
    if (method === 'GET') return handleListPlanos(env, user);
    if (method === 'POST') return handleCreatePlano(request, env, user);
    return jsonError('Método não permitido', 405);
  }

  const id = parseInt(afterPlano[0]);
  if (isNaN(id)) return jsonError('ID de plano inválido', 400);

  // /api/v1/planejamento/:id/canais
  if (afterPlano[1] === 'canais') {
    if (!afterPlano[2]) {
      if (method === 'GET') return handleGetCanais(env, user, id);
      return jsonError('Método não permitido', 405);
    }
    // /api/v1/planejamento/:id/canais/:canal_id
    const canalId = afterPlano[2];
    if (method === 'PATCH') return handleUpdateCanal(request, env, user, id, canalId);
    return jsonError('Método não permitido', 405);
  }

  // /api/v1/planejamento/:id/progresso
  if (afterPlano[1] === 'progresso') {
    if (method === 'GET') return handleGetProgresso(env, user, id);
    if (method === 'POST') return handleUpsertProgresso(request, env, user, id);
    return jsonError('Método não permitido', 405);
  }

  // /api/v1/planejamento/:id
  if (!afterPlano[1]) {
    if (method === 'GET') return handleGetPlano(env, user, id);
    if (method === 'PATCH') return handleUpdatePlano(request, env, user, id);
    return jsonError('Método não permitido', 405);
  }

  return jsonError('Rota não encontrada', 404);
}
