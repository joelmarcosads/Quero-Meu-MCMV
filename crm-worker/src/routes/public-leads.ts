/**
 * routes/public-leads.ts
 *
 * POST /api/v1/public/leads  → ingestão pública de leads do portal Quero Meu MCMV
 *
 * Esta rota NÃO exige autenticação via Cloudflare Access.
 * É acessível diretamente pelo browser do visitante do portal.
 *
 * Proteções implementadas:
 *   1. Honeypot: campo `website` deve estar ausente ou vazio
 *   2. Validação de campos obrigatórios (external_id, whatsapp)
 *   3. Normalização de telefone E.164
 *   4. Idempotência por external_id (retorna 200 se já existe)
 *   5. LGPD: consentimento obrigatório; registro em consentimentos_lgpd
 *   6. IP sanitizado (3 octetos) — LGPD art. 7
 *   7. Sem dados sensíveis em logs
 *
 * Estratégia de resposta:
 *   - Honeypot ativado → 200 silencioso (não revela presença do filtro ao bot)
 *   - Erros de validação → 400 com mensagem clara
 *   - Sucesso → 201 com { id, idempotent: false } ou 200 com { idempotent: true }
 */

import type { Env, PublicLeadPayload } from '../types';
import {
  normalizePhone, parseJsonBody, getClientIp, sanitizeIp,
} from '../utils';

/** jsonError local que inclui CORS headers */
function publicJsonError(message: string, status: number, cors: HeadersInit): Response {
  return new Response(
    JSON.stringify({ success: false, error: message }),
    { status, headers: { 'Content-Type': 'application/json', ...cors } },
  );
}

// Versão do texto de consentimento LGPD em vigor (sincronizar com configuracoes)
const VERSAO_CONSENTIMENTO = 'v2026-11';

// Origens permitidas para CORS (adicionar domínios de staging conforme necessário)
const ALLOWED_ORIGINS = [
  'https://queromeumcmv.com.br',
  'https://www.queromeumcmv.com.br',
  // staging / dev local (remover em produção se desejado)
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
];

function corsHeaders(origin: string | null): HeadersInit {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0]; // fallback para domínio principal
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

/**
 * Inferir `origem` a partir das UTMs do lead.
 * Preserva o campo `origem` canônico do schema (CHECK constraint).
 */
function inferirOrigem(payload: PublicLeadPayload): string {
  const src = (payload.utm_source ?? '').toLowerCase();
  const medium = (payload.utm_medium ?? '').toLowerCase();

  if (src.includes('google') || payload.gclid) return 'google_ads';
  if (
    src.includes('facebook') ||
    src.includes('meta') ||
    src.includes('instagram') ||
    payload.fbclid ||
    payload.meta_fbc ||
    payload.meta_fbp
  ) return 'meta_ads';
  if (medium === 'cpc' || medium === 'ppc' || medium === 'paid') return 'portal_pago';

  return 'portal_organico';
}

/**
 * Handler principal da rota pública de leads.
 * Chamado pelo index.ts antes do bloco de autenticação.
 */
export async function handlePublicLeads(
  request: Request,
  env: Env,
): Promise<Response> {
  const origin = request.headers.get('Origin');
  const cors = corsHeaders(origin);

  // ── CORS preflight ──────────────────────────────────────────────────────────
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }

  if (request.method !== 'POST') {
    return new Response(null, { status: 405, headers: { ...cors, Allow: 'POST, OPTIONS' } });
  }

  // ── Parse do body ──────────────────────────────────────────────────────────
  let body: PublicLeadPayload;
  try {
    body = await parseJsonBody<PublicLeadPayload>(request);
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: 'JSON inválido' }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...cors } },
    );
  }

  // ── 1. Honeypot ─────────────────────────────────────────────────────────────
  // Retorno 200 silencioso — não revelar ao bot que foi filtrado
  if (body.website) {
    // Log mínimo sem dados pessoais
    console.log('[public-leads] honeypot ativado — descartado silenciosamente');
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...cors } },
    );
  }

  // ── 2. Validação de campos obrigatórios ────────────────────────────────────
  if (!body.external_id?.trim()) {
    return publicJsonError('Campo obrigatório: external_id', 400, cors);
  }
  if (!body.whatsapp?.trim()) {
    return publicJsonError('Campo obrigatório: whatsapp', 400, cors);
  }
  if (!body.consentimento_lgpd) {
    return publicJsonError('Consentimento LGPD obrigatório', 400, cors);
  }

  // ── 3. Normalizar telefone E.164 ───────────────────────────────────────────
  const telefone = normalizePhone(body.whatsapp);
  if (!telefone) {
    return publicJsonError(
      `Telefone inválido: '${body.whatsapp}'. Formato esperado: DDD + número (10 ou 11 dígitos)`,
      422,
      cors,
    );
  }

  // ── 4. Idempotência por external_id ───────────────────────────────────────
  const idempotencyKey = body.external_id.trim();
  const existing = await env.DB.prepare(
    `SELECT l.id, l.contato_id, l.origem, l.created_at
     FROM leads l
     WHERE l.idempotency_key = ?
     LIMIT 1`,
  ).bind(idempotencyKey).first();

  if (existing) {
    return new Response(
      JSON.stringify({ success: true, data: existing, idempotent: true }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...cors } },
    );
  }

  // ── 5. Upsert de contato (dedup por telefone) ──────────────────────────────
  await env.DB.prepare(
    `INSERT OR IGNORE INTO contatos (telefone, nome, email, cidade)
     VALUES (?, ?, ?, ?)`,
  ).bind(
    telefone,
    body.nome?.trim() ?? null,
    body.email?.trim() ?? null,
    body.cidade?.trim() ?? null,
  ).run();

  const contato = await env.DB.prepare(
    `SELECT id FROM contatos WHERE telefone = ? AND deleted_at IS NULL AND anonimizado_at IS NULL`,
  ).bind(telefone).first<{ id: number }>();

  if (!contato) {
    return publicJsonError('Erro ao processar contato', 500, cors);
  }

  // ── 6. Resolver empreendimento por slug (opcional) ─────────────────────────
  let empreendimentoId: number | null = null;
  if (body.empreendimento_slug?.trim()) {
    const empr = await env.DB.prepare(
      `SELECT id FROM empreendimentos WHERE slug = ? AND deleted_at IS NULL LIMIT 1`,
    ).bind(body.empreendimento_slug.trim()).first<{ id: number }>();
    if (empr) empreendimentoId = empr.id;
  }

  // ── 7. Inferir origem ──────────────────────────────────────────────────────
  const origem = inferirOrigem(body);

  // ── 8. IP sanitizado (LGPD) ───────────────────────────────────────────────
  const rawIp = getClientIp(request);
  const ipSanitizado = rawIp ? sanitizeIp(rawIp) : null;

  // ── 9. Dados extras MCMV → JSON ───────────────────────────────────────────
  const dadosExtras = body.dados_extras
    ? JSON.stringify(body.dados_extras)
    : null;

  // ── 10. Inserir lead ───────────────────────────────────────────────────────
  const leadResult = await env.DB.prepare(
    `INSERT INTO leads
       (contato_id, empreendimento_id, tipologia_id, idempotency_key,
        origem, canal,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term,
        gclid, fbclid, meta_fbc, meta_fbp,
        ip_address, user_agent, dados_extras_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     RETURNING id, contato_id, empreendimento_id, origem, created_at`,
  ).bind(
    contato.id,
    empreendimentoId,
    null,                                              // tipologia_id — não disponível no portal
    idempotencyKey,
    origem,
    'portal_web',                                      // canal fixo
    body.utm_source?.trim()   ?? null,
    body.utm_medium?.trim()   ?? null,
    body.utm_campaign?.trim() ?? null,
    body.utm_content?.trim()  ?? null,
    body.utm_term?.trim()     ?? null,
    body.gclid?.trim()        ?? null,
    body.fbclid?.trim()       ?? null,
    body.meta_fbc             ?? null,
    body.meta_fbp             ?? null,
    ipSanitizado,
    request.headers.get('user-agent')?.slice(0, 500) ?? null,
    dadosExtras,
  ).first<{ id: number; contato_id: number; empreendimento_id: number | null; origem: string; created_at: string }>();

  if (!leadResult) {
    return publicJsonError('Erro ao registrar lead', 500, cors);
  }

  // ── 11. Registrar consentimento LGPD ──────────────────────────────────────
  // Fire-and-forget — não bloqueia resposta, mas registra
  env.DB.prepare(
    `INSERT INTO consentimentos_lgpd
       (contato_id, tipo, concedido, canal, texto_versao, base_legal, ip_address)
     VALUES (?, 'contato_whatsapp', 1, 'portal_web', ?, 'consentimento', ?)`,
  ).bind(contato.id, VERSAO_CONSENTIMENTO, ipSanitizado).run().catch((_err: unknown) => {
    // Log sem dados pessoais
    console.error('[public-leads] Falha ao registrar consentimento LGPD');
  });

  return new Response(
    JSON.stringify({
      success: true,
      data: { id: leadResult.id, origem: leadResult.origem },
      idempotent: false,
    }),
    { status: 201, headers: { 'Content-Type': 'application/json', ...cors } },
  );
}

