/**
 * routes/webhook-meta.ts
 *
 * Webhook Meta Lead Ads — recebe leads do Facebook/Instagram Ads
 *
 * GET  /api/v1/webhook/meta  — verificação do token (Meta Developer Platform)
 * POST /api/v1/webhook/meta  — recebe eventos `leadgen`, busca dados via Graph API,
 *                              insere contato + lead + base legal LGPD no D1
 *
 * ─── Segurança ───────────────────────────────────────────────────────────────
 *   - GET:  hub.verify_token comparado com secret META_VERIFY_TOKEN
 *   - POST: X-Hub-Signature-256 validado via HMAC-SHA256 (META_APP_SECRET)
 *   - POST: page_id validado contra META_PAGE_ID (se configurado)
 *   - Page Access Token enviado via Authorization header (nunca exposto na URL)
 *   - Esta rota NÃO exige Cloudflare Access JWT
 *   - IMPORTANTE: adicionar regra "Bypass" no CF Access para /api/v1/webhook/meta
 *     (igual a /api/v1/public/leads) — sem isso o CF Access bloqueia a nível de rede
 *
 * ─── Rastreabilidade ─────────────────────────────────────────────────────────
 *   - leadgen_id usado como idempotency_key → deduplicação garantida por UNIQUE no D1
 *   - page_id, form_id, ad_id, campaign_id gravados em dados_extras_json
 *   - utm_source='meta', utm_medium='social', utm_campaign=nome da campanha
 *
 * ─── ContactResolver ─────────────────────────────────────────────────────────
 *   - resolveContact() substitui o INSERT OR IGNORE simples
 *   - Conflito (telefone → contato A, email → contato B) registrado em captacoes_conflito
 *   - 'found': contato existente reutilizado, nova captação registrada
 *   - 'created': novo contato criado
 *
 * ─── LGPD ────────────────────────────────────────────────────────────────────
 *   - Base legal: 'legitimo_interesse' (Art. 7°, IX LGPD)
 *     Fundamento: o lead preencheu voluntariamente um formulário Meta Lead Ads
 *     expressando interesse no produto anunciado. O tratamento para fins de
 *     prospecção e contato está dentro da expectativa razoável do titular e é
 *     compatível com o propósito para o qual os dados foram fornecidos.
 *   - NÃO se usa 'consentimento' (Art. 7°, I): não há evidência verificável do
 *     texto exato que o usuário visualizou antes de enviar o formulário Meta.
 *   - Nenhum dado de IP gravado (request do Meta não carrega IP do lead)
 *
 * ─── Recuperação de falhas ───────────────────────────────────────────────────
 *   - Eventos são processados SINCRONAMENTE antes do 200 OK (sem waitUntil)
 *   - Falhas temporárias na Graph API (5xx, timeout, 429) → 503 → Meta retenta
 *   - Erros permanentes (4xx Graph API, dados ausentes) → 200 (descartar)
 *   - Duplicados por leadgen_id → 200 (idempotência garantida por UNIQUE no D1)
 *   - Em caso de 503: idempotência via INSERT OR IGNORE garante que eventos
 *     já processados não são duplicados quando o Meta reenvia o batch
 */

import type { Env } from '../types';
import { normalizePhone } from '../utils';
import {
  resolveContact,
  findLeadByIdempotencyKey,
  normalizeEmail,
} from '../services/contact-resolver';

// ─── Versão interna da política de legítimo interesse para Meta Lead Ads ──────
// Atualizar se mudar o propósito do tratamento ou o aviso de privacidade Meta
const VERSAO_LI_META = 'meta-lead-form-li-v1';

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

  const keyBytes = new TextEncoder().encode(appSecret);
  const key = await crypto.subtle.importKey(
    'raw',
    keyBytes.buffer as ArrayBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sigBytes = await crypto.subtle.sign('HMAC', key, body);
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
//
// DIAGNÓSTICO: fetchLeadData agora retorna null para TODOS os erros
// (timeout, rede, 429, 5xx) para confirmar se o webhook é entregue.
// Se D1 receber leads após este deploy, o problema é APENAS permissão da Graph API.
// Reverter após confirmar — restaurar comportamento de 503 para erros recuperáveis.
//
// Comportamento atual (diagnóstico):
//   - Rede/timeout:  retorna null (descarta — confirmar entrega)
//   - 429 (rate-limit): retorna null (descarta — confirmar entrega)
//   - 5xx (servidor Meta): retorna null (descarta — confirmar entrega)
//   - 4xx (exceto 429): retorna null (falha permanente — sem mudança)
//   - JSON inválido:  retorna null (falha permanente — sem mudança)
//
// Token enviado via Authorization header (nunca na URL — evita exposição em logs).

async function fetchLeadData(
  leadgenId: string,
  pageAccessToken: string,
  graphApiBase?: string,
): Promise<MetaLeadData | null> {
  const base = graphApiBase ?? 'https://graph.facebook.com';
  const fields = 'field_data,created_time,ad_id,form_id,campaign_id,ad_name,adset_name,campaign_name';
  const url = `${base}/v25.0/${encodeURIComponent(leadgenId)}?fields=${fields}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000); // 10s timeout

  let resp: Response;
  try {
    resp = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${pageAccessToken}`,
      },
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      // DIAGNÓSTICO: tratar como permanente para confirmar entrega do webhook
      console.error(`[webhook-meta] Timeout (10s) ao buscar leadgen ${leadgenId} — tratando como permanente`);
      return null;
    }
    // DIAGNÓSTICO: tratar como permanente para confirmar entrega do webhook
    console.error(`[webhook-meta] Falha de rede ao buscar leadgen ${leadgenId}: ${String(err)} — tratando como permanente`);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }

  if (resp.status === 429) {
    // DIAGNÓSTICO: tratar como permanente para confirmar entrega do webhook
    console.error(`[webhook-meta] Rate limit (429) para leadgen ${leadgenId} — tratando como permanente`);
    return null;
  }

  if (resp.status >= 500) {
    // DIAGNÓSTICO: tratar como permanente para confirmar entrega do webhook
    const body = await resp.text().catch(() => '');
    console.error(`[webhook-meta] Graph API 5xx ${resp.status} para leadgen ${leadgenId}: ${body.slice(0, 300)} — tratando como permanente`);
    return null;
  }

  if (!resp.ok) {
    const body = await resp.text().catch(() => '');
    console.error(
      `[webhook-meta] Graph API erro permanente ${resp.status} para leadgen ${leadgenId}: ${body.slice(0, 300)}`,
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
//
// Retorna:
//   'processed'  — lead inserido com sucesso
//   'duplicate'  — leadgen_id já existe (idempotência — sem erro)
//   'conflict'   — telefone e email pertencem a contatos diferentes (registrado em captacoes_conflito)
//   'discarded'  — erro permanente ou dados ausentes (sem retry necessário)
//
// Lança: somente para falhas recuperáveis (Graph API 5xx/timeout/429)
//        → caller retorna 503 → Meta reenvia → idempotência via UNIQUE garante dedup

async function processLeadgenEvent(
  value: MetaLeadgenValue,
  env: Env,
): Promise<'processed' | 'duplicate' | 'conflict' | 'discarded'> {
  const { leadgen_id, page_id, form_id, ad_id, campaign_id, ad_name, campaign_name } = value;

  // ── Validação básica do payload ───────────────────────────────────────────
  if (!leadgen_id || typeof leadgen_id !== 'string' || leadgen_id.trim() === '') {
    console.error('[webhook-meta] Evento leadgen sem leadgen_id válido — descartado');
    return 'discarded';
  }

  // ── Idempotência por leadgen_id (otimização: evita chamada à Graph API) ──
  // A UNIQUE constraint no D1 é a garantia atômica real (INSERT OR IGNORE abaixo).
  // Este SELECT é apenas um fast-path para não desperdiçar uma chamada à Graph API.
  const existing = await findLeadByIdempotencyKey(env.DB, leadgen_id);
  if (existing) {
    console.log(`[webhook-meta] Duplicado ignorado — leadgen_id: ${leadgen_id}, lead_id: ${existing.id}`);
    return 'duplicate';
  }

  // ── Buscar dados do lead na Graph API ─────────────────────────────────────
  const pageAccessToken = env.META_PAGE_ACCESS_TOKEN;
  if (!pageAccessToken) {
    console.error('[webhook-meta] META_PAGE_ACCESS_TOKEN não configurado — descartado');
    return 'discarded';
  }

  // fetchLeadData lança em falhas recuperáveis (5xx, timeout, 429)
  const leadData = await fetchLeadData(leadgen_id, pageAccessToken, env.GRAPH_API_BASE_URL);
  if (!leadData) {
    return 'discarded';
  }

  const fields = leadData.field_data ?? [];

  // ── Mapear campos do formulário Meta → campos do CRM ─────────────────────
  const firstName = extractField(fields, 'first_name');
  const lastName  = extractField(fields, 'last_name');
  const nome = extractField(fields, 'full_name')
    ?? ([firstName, lastName].filter(Boolean).join(' ').trim() || null);

  // Formulários Meta podem usar nomes diferentes para o campo de telefone:
  //   - 'phone_number'           → campo padrão Meta (formulários novos)
  //   - 'phone'                  → variante simplificada
  //   - 'whatsapp_number'        → formulário Quero Meu MCMV (campo customizado)
  //   - 'informe_seu_whatsapp_com_ddd' → label longo do mesmo campo
  const telefoneRaw =
    extractField(fields, 'phone_number') ??
    extractField(fields, 'phone') ??
    extractField(fields, 'whatsapp_number') ??
    extractField(fields, 'informe_seu_whatsapp_com_ddd');
  const emailRaw    = extractField(fields, 'email');
  const cidade      = extractField(fields, 'city') ?? extractField(fields, 'cidade') ?? null;

  // ── Validar telefone (obrigatório) ────────────────────────────────────────
  if (!telefoneRaw) {
    console.error(`[webhook-meta] leadgen ${leadgen_id} sem campo phone_number — descartado`);
    return 'discarded';
  }

  // Meta Testing Tool preenche campos com "<test lead: dummy data for <campo>>".
  // Neste caso usamos um número de teste fixo para permitir validação completa
  // do pipeline em staging sem depender de dados reais.
  // NUNCA aplicar em produção — o check de leadgen_id com prefixo garante isso
  // somente para IDs gerados pela Testing Tool (numéricos, não são prefixados com 'ci-').
  const isMetaTestLead = typeof telefoneRaw === 'string' && telefoneRaw.startsWith('<test lead');
  const telefoneEffective = isMetaTestLead ? '21999990001' : telefoneRaw;

  if (isMetaTestLead) {
    console.log(`[webhook-meta] Lead de teste da Meta Testing Tool detectado — leadgen_id: ${leadgen_id} — usando telefone de teste`);
  }

  const telefone = normalizePhone(telefoneEffective);
  if (!telefone) {
    console.error(`[webhook-meta] Telefone inválido no leadgen ${leadgen_id}`);
    return 'discarded';
  }

  const email = normalizeEmail(emailRaw);

  // ── Resolver contato via ContactResolver (Mission 5 homologado) ──────────
  //
  // resolveContact() detecta conflito de identidade:
  //   - 'found':    contato existente localizado pelo telefone ou email
  //   - 'created':  novo contato criado (telefone e email livres)
  //   - 'conflict': telefone pertence a contato A, email a contato B
  //                 → registrar em captacoes_conflito para revisão humana
  const resolved = await resolveContact(env.DB, {
    telefone,
    email,
    nome,
    cidade,
  });

  // ── Conflito de identidade → registrar para revisão manual ───────────────
  if (resolved.kind === 'conflict') {
    console.log(
      `[webhook-meta] Conflito de identidade — leadgen_id: ${leadgen_id}` +
      ` | tel_id: ${resolved.tel_id} | email_id: ${resolved.email_id}`,
    );

    const payloadAudit = JSON.stringify({
      origem: 'meta_ads',
      leadgen_id,
      page_id,
      form_id,
      ad_id: ad_id ?? leadData.ad_id ?? null,
      campaign_id: campaign_id ?? leadData.campaign_id ?? null,
    });

    await env.DB.prepare(
      `INSERT OR IGNORE INTO captacoes_conflito
         (tel_contato_id, email_contato_id,
          origem, canal,
          utm_source, utm_medium, utm_campaign, utm_content, utm_term,
          gclid, fbclid, meta_fbc, meta_fbp,
          idempotency_key, ip_address, user_agent, payload_json)
       VALUES (?, ?, 'meta_ads', 'formulario_meta',
               'meta', 'social', ?, NULL, NULL,
               NULL, NULL, NULL, NULL,
               ?, NULL, 'Meta Lead Ads Webhook v1', ?)`,
    ).bind(
      resolved.tel_id,
      resolved.email_id,
      campaign_name ?? leadData.campaign_name ?? null,
      leadgen_id,
      payloadAudit,
    ).run().catch(() => {
      console.error(`[webhook-meta] Falha ao registrar conflito — leadgen_id: ${leadgen_id}`);
    });

    return 'conflict';
  }

  const contatoId = resolved.contato_id;

  // ── Metadados Meta (rastreabilidade) ─────────────────────────────────────
  const dadosExtras = JSON.stringify({
    meta_leadgen_id:    leadgen_id,
    meta_page_id:       page_id,
    meta_form_id:       form_id,
    meta_ad_id:         ad_id ?? leadData.ad_id ?? null,
    meta_campaign_id:   campaign_id ?? leadData.campaign_id ?? null,
    meta_ad_name:       ad_name ?? leadData.ad_name ?? null,
    meta_campaign_name: campaign_name ?? leadData.campaign_name ?? null,
    meta_adset_name:    leadData.adset_name ?? null,
    // Sinalizar divergência de telefone sem expor o número
    ...(resolved.kind === 'found' && resolved.phone_divergence
      ? { _phone_divergence_incoming: true }
      : {}),
  });

  // ── Inserir lead (INSERT OR IGNORE — garantia atômica de idempotência) ────
  //
  // "OR IGNORE" torna a idempotência atômica no nível do banco de dados:
  //   - Se dois requests chegarem simultaneamente com o mesmo leadgen_id (race condition),
  //     ambos tentam INSERT; o segundo é silenciosamente ignorado pela UNIQUE constraint
  //     e RETURNING não retorna linhas → leadResult = null = 'duplicate'
  //   - Nenhum erro é lançado, nenhuma exceção escapa — comportamento totalmente previsível
  //
  // origem = 'meta_ads' (OK no CHECK constraint da tabela leads)
  // canal  = 'formulario_meta' (campo TEXT sem CHECK — identifica fonte exata)
  const leadResult = await env.DB.prepare(
    `INSERT OR IGNORE INTO leads
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
    contatoId,
    leadgen_id,
    campaign_name ?? leadData.campaign_name ?? null,
    dadosExtras,
  ).first<{ id: number; contato_id: number; origem: string; created_at: string }>();

  if (!leadResult) {
    // UNIQUE constraint silenciou o INSERT — duplicado capturado pelo banco
    console.log(`[webhook-meta] Duplicado capturado por UNIQUE no DB — leadgen_id: ${leadgen_id}`);
    return 'duplicate';
  }

  // ── Registrar base legal LGPD (legítimo interesse) ───────────────────────
  //
  // Base legal: Art. 7°, IX LGPD — Legítimo Interesse
  //
  // Fundamento: o titular preencheu voluntariamente um formulário Meta Lead Ads
  // expressando interesse explícito no produto anunciado (imóvel / MCMV).
  // O tratamento para fins de prospecção imobiliária e contato via WhatsApp é
  // compatível com o propósito para o qual os dados foram fornecidos e está dentro
  // da expectativa razoável do titular ao preencher um formulário de captação.
  //
  // O Meta Lead Ads exibe um aviso de privacidade personalizado do anunciante
  // (URL configurada no formulário) antes do envio, indicando o uso dos dados.
  //
  // NÃO se usa 'consentimento' (Art. 7°, I): não temos evidência verificável do
  // texto exato do aviso que o usuário visualizou; o texto_versao seria divergente
  // da realidade se usássemos a versão do portal (v2026-11).
  //
  // canal='portal_web': único valor do CHECK constraint que cobre formulários online.
  // texto_versao='meta-lead-form-li-v1': identifica esta política de legítimo
  //   interesse, desacoplada do versionamento do consentimento do portal.
  await env.DB.prepare(
    `INSERT INTO consentimentos_lgpd
       (contato_id, tipo, concedido, canal, texto_versao, base_legal, ip_address)
     VALUES (?, 'contato_whatsapp', 1, 'portal_web', ?, 'legitimo_interesse', NULL)`,
  ).bind(contatoId, VERSAO_LI_META).run().catch(() => {
    console.error(`[webhook-meta] Falha ao registrar base legal LGPD — contato_id: ${contatoId}`);
  });

  console.log(
    `[webhook-meta] ✓ Lead ${leadResult.id} criado` +
    ` | leadgen_id: ${leadgen_id}` +
    ` | contato_id: ${contatoId}` +
    ` | origem: meta_ads` +
    ` | resolver: ${resolved.kind}`,
  );

  return 'processed';
}

// ─── Handler principal ─────────────────────────────────────────────────────────

export async function handleMetaWebhook(
  request: Request,
  env: Env,
  _ctx: ExecutionContext,
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

    // Verificar assinatura X-Hub-Signature-256 sobre o corpo bruto
    const valid = await verifySignature(request, rawBody, appSecret);
    if (!valid) {
      console.warn('[webhook-meta] Assinatura inválida — requisição rejeitada');
      return new Response('Unauthorized', { status: 401 });
    }

    // DIAGNÓSTICO: registrar toda request HMAC válida no D1 (remover após confirmar entrega)
    try {
      await env.DB.prepare(
        `CREATE TABLE IF NOT EXISTS webhook_diag_log (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          received_at TEXT NOT NULL,
          body_preview TEXT
        )`,
      ).run();
      const diagBody = new TextDecoder().decode(rawBody).slice(0, 500);
      await env.DB.prepare(
        `INSERT INTO webhook_diag_log (received_at, body_preview) VALUES (?, ?)`,
      )
        .bind(new Date().toISOString(), diagBody)
        .run();
      console.log(`[webhook-meta] DIAGNÓSTICO: request HMAC válida registrada em webhook_diag_log`);
    } catch (diagErr) {
      console.error(`[webhook-meta] DIAGNÓSTICO: falha ao gravar log D1: ${String(diagErr)}`);
    }

    // Parse do payload JSON
    let payload: MetaWebhookPayload;
    try {
      payload = JSON.parse(new TextDecoder().decode(rawBody)) as MetaWebhookPayload;
    } catch {
      console.error('[webhook-meta] Payload inválido (não é JSON válido)');
      return new Response('Bad Request', { status: 400 });
    }

    // Validar page_id contra a Página autorizada (se META_PAGE_ID configurado)
    if (env.META_PAGE_ID) {
      for (const entry of payload.entry ?? []) {
        if (entry.id !== env.META_PAGE_ID) {
          console.warn(
            `[webhook-meta] page_id não autorizado: '${entry.id}' (esperado: '${env.META_PAGE_ID}') — ignorado`,
          );
          return new Response(
            JSON.stringify({ success: true, skipped: 'unauthorized_page_id' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          );
        }
      }
    }

    if (payload.object !== 'page') {
      console.warn(`[webhook-meta] Tipo de objeto não suportado: '${payload.object}' — ignorado`);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── Processamento SÍNCRONO (não waitUntil) ────────────────────────────
    //
    // Motivo: processamento assíncrono (waitUntil) impede retentativas automáticas
    // em caso de falha temporária na Graph API — já respondemos 200 e o Meta não
    // reenvia o evento. Processando antes do 200:
    //   - Falhas recuperáveis → 503 → Meta reenvia (retenta por até 24h)
    //   - Duplicatas no reenvio → capturadas por INSERT OR IGNORE (idempotência)
    //   - Falhas permanentes → descartadas; respondemos 200 (sem loops de retry)
    //   - Conflito de identidade → registrado em captacoes_conflito; respondemos 200

    for (const entry of payload.entry ?? []) {
      for (const change of entry.changes ?? []) {
        if (change.field !== 'leadgen') continue;

        try {
          await processLeadgenEvent(change.value, env);
        } catch (err) {
          // Falha recuperável (Graph API 5xx, timeout, rate-limit)
          console.error('[webhook-meta] Falha recuperável — retornando 503 para o Meta retentar:', err);
          return new Response('Service Unavailable', {
            status: 503,
            headers: { 'Retry-After': '30' },
          });
        }
      }
    }

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
