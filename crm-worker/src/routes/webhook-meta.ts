/**
 * routes/webhook-meta.ts
 *
 * Webhook Meta Lead Ads — recebe leads do Facebook/Instagram Ads
 *
 * GET  /api/v1/webhook/meta  — verificação do token (Meta Developer Platform)
 * POST /api/v1/webhook/meta  — recebe eventos `leadgen`, busca dados via Graph API,
 *                              insere contato + lead + consentimento LGPD no D1
 *
 * ─── Segurança ───────────────────────────────────────────────────────────────
 *   - GET:  hub.verify_token comparado com secret META_VERIFY_TOKEN
 *   - POST: X-Hub-Signature-256 validado via HMAC-SHA256 (META_APP_SECRET)
 *   - Esta rota NÃO exige Cloudflare Access JWT — deve ter "Bypass" na CF Access policy
 *
 * ─── Rastreabilidade ─────────────────────────────────────────────────────────
 *   - leadgen_id usado como idempotency_key → deduplicação nativa
 *   - page_id, form_id, ad_id, campaign_id gravados em dados_extras_json
 *   - utm_source='meta', utm_medium='social', utm_campaign=nome da campanha
 *
 * ─── LGPD ────────────────────────────────────────────────────────────────────
 *   - Consentimento registrado em consentimentos_lgpd (canal='portal_web')
 *   - base_legal='consentimento' — lead preencheu formulário Meta voluntariamente
 *   - Nenhum dado de IP gravado (request do Meta não carrega IP do lead)
 */

import type { Env } from '../types';
import { normalizePhone } from '../utils';

// ─── Versão do texto de consentimento LGPD em vigor ───────────────────────────
const VERSAO_CONSENTIMENTO = 'v2026-11';

// ─── Tipos do payload Meta ─────────────────────────────────────────────────────

interface MetaLeadgenValue {
  leadgen_id: string;
  page_id: string;
  form_id: string;
  ad_id?: string;
  adset_id?: string;
  campaign_id?: string;
  ad_name?: string;
  adset_name?: string;
  campaign_name?: string;
  created_time: number;
}

interface MetaWebhookEntry {
  id: string; // page_id
  time: number;
  changes: Array<{
    field: string; // 'leadgen'
    value: MetaLeadgenValue;
  }>;
}

interface MetaWebhookPayload {
  object: string; // 'page'
  entry: MetaWebhookEntry[];
}

interface MetaLeadFieldData {
  name: string;
  values: string[];
}

interface MetaLeadData {
  id: string;
  created_time: string;
  field_data: MetaLeadFieldData[];
  ad_id?: string;
  form_id?: string;
  campaign_id?: string;
  ad_name?: string;
  adset_name?: string;
  campaign_name?: string;
}

// ─── Verificação HMAC-SHA256 (timing-safe) ────────────────────────────────────

async function verifySignature(
  request: Request,
  body: ArrayBuffer,
  appSecret: string,
): Promise<boolean> {
  const sigHeader = request.headers.get('x-hub-signature-256');
  if (!sigHeader || !sigHeader.startsWith('sha256=')) return false;
  const receivedHex = sigHeader.slice(7);

  // Cast necessário: SubtleCrypto com 'raw' + HMAC/sign não está tipado no lib ES2022
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subtle = crypto.subtle as unknown as any;
  const keyBytes = new TextEncoder().encode(appSecret);
  const key = await subtle.importKey(
    'raw',
    keyBytes.buffer as ArrayBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  ) as CryptoKey;
  const sigBytes = await subtle.sign('HMAC', key, body) as ArrayBuffer;
  const computedHex = Array.from(new Uint8Array(sigBytes))
    .map((b: number) => b.toString(16).padStart(2, '0'))
    .join('');

  // Comparação em tempo constante — evita timing attacks
  if (computedHex.length !== receivedHex.length) return false;
  let diff = 0;
  for (let i = 0; i < computedHex.length; i++) {
    diff |= computedHex.charCodeAt(i) ^ receivedHex.charCodeAt(i);
  }
  return diff === 0;
}

// ─── Buscar dados do lead via Graph API ──────────────────────────────────────

async function fetchLeadData(
  leadgenId: string,
  pageAccessToken: string,
): Promise<MetaLeadData | null> {
  const fields = 'field_data,created_time,ad_id,form_id,campaign_id,ad_name,adset_name,campaign_name';
  const url = `https://graph.facebook.com/v21.0/${encodeURIComponent(leadgenId)}` +
              `?fields=${fields}&access_token=${pageAccessToken}`;

  let resp: Response;
  try {
    resp = await fetch(url);
  } catch (err) {
    console.error(`[webhook-meta] Falha de rede ao buscar leadgen ${leadgenId}:`, err);
    return null;
  }

  if (resp.status === 429) {
    // Rate limit da Graph API — log sem lançar (Meta vai retentar)
    console.warn(`[webhook-meta] Rate limit (429) para leadgen ${leadgenId}`);
    return null;
  }

  if (!resp.ok) {
    const body = await resp.text().catch(() => '');
    console.error(
      `[webhook-meta] Graph API erro ${resp.status} para leadgen ${leadgenId}: ${body.slice(0, 300)}`,
    );
    return null;
  }

  try {
    return await resp.json() as MetaLeadData;
  } catch {
    console.error(`[webhook-meta] Resposta não-JSON para leadgen ${leadgenId}`);
    return null;
  }
}

// ─── Extrair campo do formulário ──────────────────────────────────────────────

function extractField(fields: MetaLeadFieldData[], name: string): string | null {
  return fields.find(f => f.name === name)?.values?.[0] ?? null;
}

// ─── Processar um evento leadgen ─────────────────────────────────────────────

async function processLeadgenEvent(
  value: MetaLeadgenValue,
  env: Env,
): Promise<void> {
  const { leadgen_id, page_id, form_id, ad_id, campaign_id, ad_name, campaign_name } = value;

  // ── Idempotência por leadgen_id ───────────────────────────────────────────
  const existing = await env.DB.prepare(
    'SELECT id FROM leads WHERE idempotency_key = ? LIMIT 1',
  ).bind(leadgen_id).first<{ id: number }>();

  if (existing) {
    console.log(`[webhook-meta] Duplicado ignorado — leadgen_id: ${leadgen_id}, lead_id: ${existing.id}`);
    return;
  }

  // ── Buscar dados do lead na Graph API ─────────────────────────────────────
  const pageAccessToken = env.META_PAGE_ACCESS_TOKEN;
  if (!pageAccessToken) {
    console.error('[webhook-meta] META_PAGE_ACCESS_TOKEN não configurado');
    return;
  }

  const leadData = await fetchLeadData(leadgen_id, pageAccessToken);
  if (!leadData) {
    // Falha na Graph API — log registrado em fetchLeadData, não relançar
    // (impediria o Meta de receber 200 e causaria retentativas excessivas)
    return;
  }

  const fields = leadData.field_data ?? [];

  // ── Mapear campos do formulário Meta → campos do CRM ─────────────────────
  // Nomes canônicos Meta: full_name, first_name, last_name, phone_number, email, city
  const firstName = extractField(fields, 'first_name');
  const lastName  = extractField(fields, 'last_name');
  const nome = extractField(fields, 'full_name')
    ?? ([firstName, lastName].filter(Boolean).join(' ').trim() || null);

  const telefoneRaw = extractField(fields, 'phone_number');
  const email       = extractField(fields, 'email');
  const cidade      = extractField(fields, 'city') ?? extractField(fields, 'cidade') ?? null;

  // ── Validar telefone (obrigatório) ────────────────────────────────────────
  if (!telefoneRaw) {
    console.error(`[webhook-meta] leadgen ${leadgen_id} sem campo phone_number — descartado`);
    return;
  }

  const telefone = normalizePhone(telefoneRaw);
  if (!telefone) {
    console.error(`[webhook-meta] Telefone inválido no leadgen ${leadgen_id}: '${telefoneRaw}'`);
    return;
  }

  // ── Upsert de contato (dedup por telefone) ────────────────────────────────
  await env.DB.prepare(
    'INSERT OR IGNORE INTO contatos (telefone, nome, email, cidade) VALUES (?, ?, ?, ?)',
  ).bind(telefone, nome, email, cidade).run();

  const contato = await env.DB.prepare(
    'SELECT id FROM contatos WHERE telefone = ? AND deleted_at IS NULL AND anonimizado_at IS NULL',
  ).bind(telefone).first<{ id: number }>();

  if (!contato) {
    console.error(`[webhook-meta] Falha ao obter/criar contato para leadgen ${leadgen_id}`);
    return;
  }

  // ── Metadados Meta (rastreabilidade) ─────────────────────────────────────
  // Armazenados em dados_extras_json para auditoria e análise de campanhas
  const dadosExtras = JSON.stringify({
    meta_leadgen_id:   leadgen_id,
    meta_page_id:      page_id,
    meta_form_id:      form_id,
    meta_ad_id:        ad_id ?? leadData.ad_id ?? null,
    meta_campaign_id:  campaign_id ?? leadData.campaign_id ?? null,
    meta_ad_name:      ad_name ?? leadData.ad_name ?? null,
    meta_campaign_name: campaign_name ?? leadData.campaign_name ?? null,
    meta_adset_name:   leadData.adset_name ?? null,
  });

  // ── Inserir lead ─────────────────────────────────────────────────────────
  // origem = 'meta_ads' (CHECK constraint OK)
  // canal  = 'formulario_meta' (campo TEXT sem CHECK — identifica fonte exata)
  // utm_source/medium = valores padrão para analytics
  // utm_campaign = nome da campanha Meta para relatórios de desempenho
  const leadResult = await env.DB.prepare(
    `INSERT INTO leads
       (contato_id, empreendimento_id, tipologia_id, idempotency_key,
        origem, canal,
        utm_source, utm_medium, utm_campaign, utm_content, utm_term,
        gclid, fbclid, meta_fbc, meta_fbp,
        ip_address, user_agent, dados_extras_json)
     VALUES (?, NULL, NULL, ?,
             'meta_ads', 'formulario_meta',
             'meta', 'social', ?, NULL, NULL,
             NULL, NULL, NULL, NULL,
             NULL, 'Meta Lead Ads Webhook v1', ?)
     RETURNING id, contato_id, origem, created_at`,
  ).bind(
    contato.id,
    leadgen_id,
    campaign_name ?? leadData.campaign_name ?? null,
    dadosExtras,
  ).first<{ id: number; contato_id: number; origem: string; created_at: string }>();

  if (!leadResult) {
    console.error(`[webhook-meta] Falha ao inserir lead para leadgen ${leadgen_id}`);
    return;
  }

  // ── Registrar consentimento LGPD ─────────────────────────────────────────
  // tipo: 'contato_whatsapp' — consentimento para contato via WhatsApp
  // canal: 'portal_web' — único valor do CHECK constraint que cobre formulários online
  // base_legal: 'consentimento' — lead preencheu formulário Meta voluntariamente
  await env.DB.prepare(
    `INSERT INTO consentimentos_lgpd
       (contato_id, tipo, concedido, canal, texto_versao, base_legal, ip_address)
     VALUES (?, 'contato_whatsapp', 1, 'portal_web', ?, 'consentimento', NULL)`,
  ).bind(contato.id, VERSAO_CONSENTIMENTO).run().catch(() => {
    console.error(`[webhook-meta] Falha ao registrar consentimento LGPD — contato_id: ${contato.id}`);
  });

  console.log(
    `[webhook-meta] ✓ Lead ${leadResult.id} criado` +
    ` | leadgen_id: ${leadgen_id}` +
    ` | contato_id: ${contato.id}` +
    ` | origem: meta_ads`,
  );
}

// ─── Handler principal ─────────────────────────────────────────────────────────

export async function handleMetaWebhook(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const url = new URL(request.url);

  // ── GET — verificação do token (Meta Developer Platform) ─────────────────
  if (request.method === 'GET') {
    const verifyToken = env.META_VERIFY_TOKEN;
    if (!verifyToken) {
      console.error('[webhook-meta] META_VERIFY_TOKEN não configurado');
      return new Response('Forbidden', { status: 403 });
    }

    const mode      = url.searchParams.get('hub.mode');
    const token     = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === verifyToken) {
      console.log('[webhook-meta] Token verificado com sucesso');
      return new Response(challenge ?? '', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    console.warn('[webhook-meta] Verificação de token falhou');
    return new Response('Forbidden', { status: 403 });
  }

  // ── POST — receber eventos leadgen ────────────────────────────────────────
  if (request.method === 'POST') {
    const appSecret = env.META_APP_SECRET;
    if (!appSecret) {
      console.error('[webhook-meta] META_APP_SECRET não configurado');
      return new Response('Internal Server Error', { status: 500 });
    }

    // Ler body como ArrayBuffer antes de qualquer leitura (necessário para HMAC)
    const rawBody = await request.arrayBuffer();

    // Verificar assinatura X-Hub-Signature-256
    const valid = await verifySignature(request, rawBody, appSecret);
    if (!valid) {
      console.warn('[webhook-meta] Assinatura inválida — requisição rejeitada');
      return new Response('Unauthorized', { status: 401 });
    }

    // Parse do payload JSON
    let payload: MetaWebhookPayload;
    try {
      payload = JSON.parse(new TextDecoder().decode(rawBody)) as MetaWebhookPayload;
    } catch {
      console.error('[webhook-meta] Payload inválido (não é JSON)');
      return new Response('Bad Request', { status: 400 });
    }

    // Responder 200 ao Meta imediatamente — processamento assíncrono via waitUntil
    // O Meta exige resposta em < 20 segundos; processamento real ocorre em background
    if (payload.object === 'page') {
      ctx.waitUntil(
        (async () => {
          for (const entry of payload.entry ?? []) {
            for (const change of entry.changes ?? []) {
              if (change.field === 'leadgen') {
                try {
                  await processLeadgenEvent(change.value, env);
                } catch (err) {
                  // Capturar erros inesperados para não abortar processamento dos demais eventos
                  console.error('[webhook-meta] Erro inesperado em processLeadgenEvent:', err);
                }
              }
            }
          }
        })(),
      );
    } else {
      console.warn(`[webhook-meta] Tipo de objeto não suportado: ${payload.object}`);
    }

    // 200 OK — Meta não retentará este evento
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response('Method Not Allowed', {
    status: 405,
    headers: { Allow: 'GET, POST' },
  });
}
