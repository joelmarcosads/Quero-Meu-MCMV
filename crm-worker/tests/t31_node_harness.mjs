/**
 * t31_node_harness.mjs — Harness de testes T1-T17 para o webhook Meta Lead Ads
 *
 * Executado com Node.js 22 (nativo — sem dependências npm externas).
 *
 * Estratégia:
 *   - D1 simulado por Python sqlite3 via child_process (nenhum pacote necessário)
 *   - HMAC via Node.js 22 crypto.subtle (Web Crypto API — idêntico ao Workers runtime)
 *   - Graph API simulada por mock HTTP em http.createServer (porta 3099)
 *   - Lógica do Worker re-implementada em JS puro (copiada de webhook-meta.ts
 *     e contact-resolver.ts com type annotations removidas)
 *
 * Cobertura:
 *   T1  — GET verify_token correto → 200 + challenge
 *   T2  — GET verify_token errado → 403
 *   T3  — GET sem token → 403
 *   T4  — POST válido → 200, lead criado (origem=meta_ads, LGPD registrado)
 *   T5  — POST HMAC inválido → 401
 *   T6  — POST duplicado (mesmo leadgen_id) → 200, 'duplicate'
 *   T7  — POST sem phone_number → 200, 'discarded'
 *   T8  — POST telefone inválido → 200, 'discarded'
 *   T9  — POST page_id não autorizado → 200, 'skipped'
 *   T10 — POST page_id autorizado → 200, lead criado
 *   T11 — POST objeto não-'page' → 200
 *   T12 — POST JSON inválido → 400
 *   T13 — POST Graph API 429 → 503
 *   T14 — POST Graph API 500 → 503
 *   T15 — POST Graph API 404 → 200, 'discarded'
 *   T16 — POST conflito tel/email → 200, 'conflict', captacoes_conflito
 *   T17 — Retry Meta (3× mesmo leadgen_id após 503) → sem duplicatas
 */

import { createServer }   from 'node:http';
import { spawnSync }      from 'node:child_process';
import { mkdtempSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { join }           from 'node:path';
import { tmpdir }         from 'node:os';
import { fileURLToPath }  from 'node:url';
import { dirname }        from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Configuração ─────────────────────────────────────────────────────────────

const MOCK_PORT      = 3099;
const APP_SECRET     = 'test-app-secret-abc';
const VERIFY_TOKEN   = 'test-verify-token-123';
const PAGE_TOKEN     = 'qualquer-valor-para-dev-local';
const TEST_PAGE_ID   = '111222333444555';

// DB criado por setup_test_db.py no diretório temporário desta sessão
const DB_PATH = join(tmpdir(), 'test_t31_webhook_meta.db');

// ─── D1 Adapter (SQLite via Python) ──────────────────────────────────────────

const PYTHON_RUNNER = `
import sqlite3, sys, json

db_path = sys.argv[1]
mode    = sys.argv[2]
sql     = sys.argv[3]
params_raw = sys.argv[4] if len(sys.argv) > 4 else '[]'
params  = json.loads(params_raw)

conn = sqlite3.connect(db_path, check_same_thread=False)
conn.row_factory = sqlite3.Row
conn.execute("PRAGMA foreign_keys = ON")

try:
    if mode == 'run':
        conn.execute(sql, params)
        conn.commit()
        print(json.dumps({"success": True, "meta": {"changes": conn.total_changes}}))
    elif mode == 'first':
        row = conn.execute(sql, params).fetchone()
        if row is None:
            print(json.dumps(None))
        else:
            print(json.dumps(dict(row)))
    elif mode == 'all':
        rows = conn.execute(sql, params).fetchall()
        print(json.dumps({"results": [dict(r) for r in rows], "success": True}))
    elif mode == 'run_returning':
        # INSERT ... RETURNING — fetchone
        row = conn.execute(sql, params).fetchone()
        conn.commit()
        if row is None:
            print(json.dumps(None))
        else:
            print(json.dumps(dict(row)))
except Exception as e:
    import traceback
    sys.stderr.write(traceback.format_exc())
    print(json.dumps({"error": str(e)}))
finally:
    conn.close()
`;

// Escrever o runner Python uma vez
const RUNNER_PATH = join(tmpdir(), 't31_sqlite_runner.py');
writeFileSync(RUNNER_PATH, PYTHON_RUNNER);

function runSql(mode, sql, params = []) {
  const result = spawnSync('python3', [
    RUNNER_PATH,
    DB_PATH,
    mode,
    sql,
    JSON.stringify(params),
  ], { encoding: 'utf8', timeout: 5000 });

  if (result.stderr) {
    // Apenas logar erros reais (não warnings)
    const stderr = result.stderr.trim();
    if (stderr) process.stderr.write('[sqlite] ' + stderr + '\n');
  }

  if (!result.stdout.trim()) return null;
  const parsed = JSON.parse(result.stdout.trim());
  if (parsed && parsed.error) throw new Error('[D1] ' + parsed.error);
  return parsed;
}

class D1PreparedStatement {
  constructor(sql) {
    this.sql = sql;
    this._params = [];
  }
  bind(...args) {
    this._params = args.map(a => a === undefined ? null : a);
    return this;
  }
  async first() {
    // Detectar INSERT ... RETURNING
    if (/INSERT\s+/i.test(this.sql) && /RETURNING\s+/i.test(this.sql)) {
      return runSql('run_returning', this.sql, this._params);
    }
    return runSql('first', this.sql, this._params);
  }
  async run() {
    return runSql('run', this.sql, this._params);
  }
  async all() {
    return runSql('all', this.sql, this._params);
  }
}

const mockDB = {
  prepare(sql) { return new D1PreparedStatement(sql); },
};

// ─── Helpers de normalização (de utils.ts e contact-resolver.ts) ──────────────

function normalizePhone(raw) {
  const digits = raw.replace(/\D/g, '');
  let national = digits;
  if (digits.startsWith('55') && digits.length >= 12) {
    national = digits.slice(2);
  } else if (digits.startsWith('0') && digits.length >= 11) {
    national = digits.slice(1);
  }
  if (national.length < 10 || national.length > 11) return null;
  return `+55${national}`;
}

function normalizeEmail(raw) {
  if (!raw) return null;
  const normalized = raw.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

// ─── ContactResolver (de contact-resolver.ts) ─────────────────────────────────

async function resolveContact(db, { telefone, email, nome, cidade }) {
  const emailNorm = normalizeEmail(email);

  const byPhone = await db
    .prepare(`SELECT id FROM contatos WHERE telefone = ? AND deleted_at IS NULL AND anonimizado_at IS NULL LIMIT 1`)
    .bind(telefone)
    .first();

  let byEmail = null;
  if (emailNorm) {
    byEmail = await db
      .prepare(`SELECT id FROM contatos WHERE lower(trim(email)) = ? AND deleted_at IS NULL AND anonimizado_at IS NULL LIMIT 1`)
      .bind(emailNorm)
      .first();
  }

  if (byPhone && byEmail && byPhone.id !== byEmail.id) {
    return {
      kind: 'conflict',
      message: 'Telefone e e-mail pertencem a contatos diferentes.',
      tel_id: byPhone.id,
      email_id: byEmail.id,
    };
  }

  if (byPhone) {
    return { kind: 'found', contato_id: byPhone.id, is_new: false };
  }

  if (byEmail) {
    const existing = await db
      .prepare(`SELECT telefone FROM contatos WHERE id = ? LIMIT 1`)
      .bind(byEmail.id)
      .first();
    const phoneDivergence = !!existing && existing.telefone !== telefone;
    return {
      kind: 'found',
      contato_id: byEmail.id,
      is_new: false,
      ...(phoneDivergence ? { phone_divergence: true } : {}),
    };
  }

  const nomeFinal = (nome && nome.trim()) || 'Visitante';
  await db
    .prepare(`INSERT OR IGNORE INTO contatos (telefone, nome, email, cidade) VALUES (?, ?, ?, ?)`)
    .bind(telefone, nomeFinal, emailNorm, cidade ? cidade.trim() : null)
    .run();

  const created = await db
    .prepare(`SELECT id FROM contatos WHERE telefone = ? AND deleted_at IS NULL AND anonimizado_at IS NULL LIMIT 1`)
    .bind(telefone)
    .first();

  if (!created) throw new Error('[contact-resolver] falha ao recuperar contato após INSERT');
  return { kind: 'created', contato_id: created.id, is_new: true };
}

async function findLeadByIdempotencyKey(db, key) {
  return db
    .prepare(`SELECT id, contato_id, origem, created_at FROM leads WHERE idempotency_key = ? LIMIT 1`)
    .bind(key)
    .first();
}

// ─── VERSAO_LI_META ───────────────────────────────────────────────────────────

const VERSAO_LI_META = 'meta-lead-form-li-v1';

// ─── verifySignature (de webhook-meta.ts) ─────────────────────────────────────

async function verifySignature(sigHeader, body, appSecret) {
  if (!sigHeader || !sigHeader.startsWith('sha256=')) return false;
  const receivedHex = sigHeader.slice(7);

  const keyBytes = new TextEncoder().encode(appSecret);
  const key = await crypto.subtle.importKey(
    'raw', keyBytes.buffer,
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const sigBytes = await crypto.subtle.sign('HMAC', key, body);
  const computedHex = Array.from(new Uint8Array(sigBytes))
    .map(b => b.toString(16).padStart(2, '0')).join('');

  if (computedHex.length !== receivedHex.length) return false;
  let diff = 0;
  for (let i = 0; i < computedHex.length; i++) {
    diff |= computedHex.charCodeAt(i) ^ receivedHex.charCodeAt(i);
  }
  return diff === 0;
}

async function computeHmac(secret, bodyBuffer) {
  const keyBytes = new TextEncoder().encode(secret);
  const key = await crypto.subtle.importKey(
    'raw', keyBytes.buffer,
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const sigBytes = await crypto.subtle.sign('HMAC', key, bodyBuffer);
  return 'sha256=' + Array.from(new Uint8Array(sigBytes))
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

// ─── extractField ─────────────────────────────────────────────────────────────

function extractField(fields, name) {
  return fields.find(f => f.name === name)?.values?.[0] ?? null;
}

// ─── fetchLeadData (de webhook-meta.ts) ──────────────────────────────────────

async function fetchLeadData(leadgenId, pageAccessToken, graphApiBase) {
  const base = graphApiBase ?? 'https://graph.facebook.com';
  const fields = 'field_data,created_time,ad_id,form_id,campaign_id,ad_name,adset_name,campaign_name';
  const url = `${base}/v21.0/${encodeURIComponent(leadgenId)}?fields=${fields}`;

  let resp;
  try {
    resp = await fetch(url, { headers: { 'Authorization': `Bearer ${pageAccessToken}` } });
  } catch (err) {
    throw new Error(`[webhook-meta] Falha de rede ao buscar leadgen ${leadgenId}: ${String(err)}`);
  }

  if (resp.status === 429) throw new Error(`[webhook-meta] Rate limit (429) para leadgen ${leadgenId}`);
  if (resp.status >= 500) throw new Error(`[webhook-meta] Graph API erro de servidor ${resp.status} para leadgen ${leadgenId}`);
  if (!resp.ok) {
    await resp.text().catch(() => '');
    return null;
  }
  try {
    return await resp.json();
  } catch {
    return null;
  }
}

// ─── processLeadgenEvent (de webhook-meta.ts) ─────────────────────────────────

async function processLeadgenEvent(value, env) {
  const { leadgen_id, page_id, form_id, ad_id, campaign_id, ad_name, campaign_name } = value;

  if (!leadgen_id || typeof leadgen_id !== 'string' || leadgen_id.trim() === '') {
    return 'discarded';
  }

  const existing = await findLeadByIdempotencyKey(env.DB, leadgen_id);
  if (existing) return 'duplicate';

  const pageAccessToken = env.META_PAGE_ACCESS_TOKEN;
  if (!pageAccessToken) return 'discarded';

  const leadData = await fetchLeadData(leadgen_id, pageAccessToken, env.GRAPH_API_BASE_URL);
  if (!leadData) return 'discarded';

  const fields = leadData.field_data ?? [];

  const firstName = extractField(fields, 'first_name');
  const lastName  = extractField(fields, 'last_name');
  const nome = extractField(fields, 'full_name')
    ?? ([firstName, lastName].filter(Boolean).join(' ').trim() || null);

  const telefoneRaw = extractField(fields, 'phone_number');
  const emailRaw    = extractField(fields, 'email');
  const cidade      = extractField(fields, 'city') ?? extractField(fields, 'cidade') ?? null;

  if (!telefoneRaw) return 'discarded';

  const telefone = normalizePhone(telefoneRaw);
  if (!telefone) return 'discarded';

  const email = normalizeEmail(emailRaw);

  const resolved = await resolveContact(env.DB, { telefone, email, nome, cidade });

  if (resolved.kind === 'conflict') {
    const payloadAudit = JSON.stringify({
      origem: 'meta_ads', leadgen_id, page_id, form_id,
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
    ).run().catch(() => {});

    return 'conflict';
  }

  const contatoId = resolved.contato_id;

  const dadosExtras = JSON.stringify({
    meta_leadgen_id: leadgen_id,
    meta_page_id: page_id,
    meta_form_id: form_id,
    meta_ad_id: ad_id ?? leadData.ad_id ?? null,
    meta_campaign_id: campaign_id ?? leadData.campaign_id ?? null,
    meta_ad_name: ad_name ?? leadData.ad_name ?? null,
    meta_campaign_name: campaign_name ?? leadData.campaign_name ?? null,
    meta_adset_name: leadData.adset_name ?? null,
    ...(resolved.kind === 'found' && resolved.phone_divergence
      ? { _phone_divergence_incoming: true } : {}),
  });

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
  ).bind(contatoId, leadgen_id, campaign_name ?? leadData.campaign_name ?? null, dadosExtras).first();

  if (!leadResult) return 'duplicate';

  await env.DB.prepare(
    `INSERT INTO consentimentos_lgpd
       (contato_id, tipo, concedido, canal, texto_versao, base_legal, ip_address)
     VALUES (?, 'contato_whatsapp', 1, 'portal_web', ?, 'legitimo_interesse', NULL)`,
  ).bind(contatoId, VERSAO_LI_META).run().catch(() => {});

  return 'processed';
}

// ─── handleMetaWebhook (de webhook-meta.ts) ───────────────────────────────────

async function handleMetaWebhook(request, env) {
  const url = new URL(request.url);

  // GET — verificação do token
  if (request.method === 'GET') {
    const verifyToken = env.META_VERIFY_TOKEN;
    if (!verifyToken) return new Response('Forbidden', { status: 403 });

    const mode      = url.searchParams.get('hub.mode');
    const token     = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === verifyToken) {
      return new Response(challenge ?? '', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
    return new Response('Forbidden', { status: 403 });
  }

  // POST — receber eventos leadgen
  if (request.method === 'POST') {
    const appSecret = env.META_APP_SECRET;
    if (!appSecret) return new Response('Internal Server Error', { status: 500 });

    const rawBody = await request.arrayBuffer();
    const sigHeader = request.headers.get('x-hub-signature-256');
    const valid = await verifySignature(sigHeader, rawBody, appSecret);
    if (!valid) return new Response('Unauthorized', { status: 401 });

    let payload;
    try {
      payload = JSON.parse(new TextDecoder().decode(rawBody));
    } catch {
      return new Response('Bad Request', { status: 400 });
    }

    if (env.META_PAGE_ID) {
      for (const entry of payload.entry ?? []) {
        if (entry.id !== env.META_PAGE_ID) {
          return new Response(
            JSON.stringify({ success: true, skipped: 'unauthorized_page_id' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          );
        }
      }
    }

    if (payload.object !== 'page') {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    for (const entry of payload.entry ?? []) {
      for (const change of entry.changes ?? []) {
        if (change.field !== 'leadgen') continue;
        try {
          await processLeadgenEvent(change.value, env);
        } catch (err) {
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

// ─── Mock Graph API Server ────────────────────────────────────────────────────

let mockServer;
let mockBehavior = 'normal'; // 'normal' | '429' | '500' | '404'
let mockOverride = null;     // null | { phone, email } para T16

function startMockServer() {
  return new Promise((resolve) => {
    mockServer = createServer((req, res) => {
      // Extrair leadgen_id do path /v21.0/:leadgen_id
      const match = req.url.match(/\/v21\.0\/([^?]+)/);
      const leadgenId = match ? decodeURIComponent(match[1]) : 'unknown';

      if (mockBehavior === '429') {
        res.writeHead(429); res.end('Too Many Requests');
        return;
      }
      if (mockBehavior === '500') {
        res.writeHead(500); res.end('Internal Server Error');
        return;
      }
      if (mockBehavior === '404') {
        res.writeHead(404); res.end(JSON.stringify({ error: { code: 100, message: 'Invalid leadgen_id' } }));
        return;
      }

      // Resposta normal
      let phone = '11999990001';
      let email = 'lead@exemplo.com';

      if (mockOverride && typeof mockOverride === 'object' && mockOverride.phone) {
        phone = mockOverride.phone;
        email = mockOverride.email ?? email;
      }

      const leadData = {
        id: leadgenId,
        created_time: '2026-11-09T12:00:00+0000',
        field_data: [
          { name: 'full_name', values: ['João Silva'] },
          { name: 'phone_number', values: [phone] },
          { name: 'email', values: [email] },
          { name: 'city', values: ['Niterói'] },
        ],
        form_id: 'form_123456',
        campaign_id: 'camp_789',
        campaign_name: 'campanha-mcmv-novembro',
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(leadData));
    });

    mockServer.listen(MOCK_PORT, '127.0.0.1', () => {
      resolve();
    });
  });
}

function stopMockServer() {
  return new Promise((resolve) => {
    if (mockServer) mockServer.close(resolve);
    else resolve();
  });
}

// ─── Helpers de teste ─────────────────────────────────────────────────────────

function makeEnv({ pageId = undefined } = {}) {
  return {
    DB: mockDB,
    META_VERIFY_TOKEN: VERIFY_TOKEN,
    META_APP_SECRET: APP_SECRET,
    META_PAGE_ACCESS_TOKEN: PAGE_TOKEN,
    GRAPH_API_BASE_URL: `http://127.0.0.1:${MOCK_PORT}`,
    ...(pageId ? { META_PAGE_ID: pageId } : {}),
  };
}

function makeLeadgenPayload(leadgenId, pageId = TEST_PAGE_ID) {
  return {
    object: 'page',
    entry: [{
      id: pageId,
      time: Math.floor(Date.now() / 1000),
      changes: [{
        field: 'leadgen',
        value: {
          leadgen_id: leadgenId,
          page_id: pageId,
          form_id: 'form_123456',
          ad_id: 'ad_111',
          campaign_id: 'camp_789',
          campaign_name: 'campanha-mcmv-novembro',
          created_time: Math.floor(Date.now() / 1000),
        },
      }],
    }],
  };
}

async function postWebhook(payload, env, appSecret = APP_SECRET) {
  const body = JSON.stringify(payload);
  const bodyBytes = new TextEncoder().encode(body);
  const sig = await computeHmac(appSecret, bodyBytes.buffer);

  const req = new Request('http://localhost/api/v1/webhook/meta', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Hub-Signature-256': sig,
    },
    body,
  });
  return handleMetaWebhook(req, env);
}

// ─── Runner de testes ─────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const results = [];

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++;
    results.push({ name, status: 'PASS' });
  } catch (err) {
    console.error(`  ❌ ${name}: ${err.message}`);
    failed++;
    results.push({ name, status: 'FAIL', error: err.message });
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function assertEqual(a, b, msg) {
  if (a !== b) throw new Error(`${msg ?? 'assertEqual'}: expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
}

// ─── Preparar DB ─────────────────────────────────────────────────────────────

function setupDb() {
  const setupScript = join(__dirname, 'setup_test_db.py');
  const r = spawnSync('python3', [setupScript, DB_PATH], { encoding: 'utf8' });
  if (r.stderr && r.stderr.includes('ERRO')) {
    throw new Error('Falha ao inicializar DB de testes:\n' + r.stderr);
  }
}

// ─── Execução ─────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  MARKET IMOBI CRM — Mission 6B.1 — Testes T1-T17             ');
  console.log('  Node.js', process.version, '| Harness: t31_node_harness.mjs  ');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Inicializar banco
  console.log('▸ Inicializando banco de testes SQLite...');
  setupDb();
  console.log(`  DB: ${DB_PATH}\n`);

  // Iniciar mock da Graph API
  console.log(`▸ Iniciando mock Graph API em http://127.0.0.1:${MOCK_PORT}...`);
  await startMockServer();
  console.log('  Mock ativo\n');

  console.log('▸ Executando testes...\n');

  // ── T1: GET verify_token correto ────────────────────────────────────────────
  await test('T1 — GET verify_token correto → 200 + challenge', async () => {
    const env = makeEnv();
    const req = new Request(
      `http://localhost/api/v1/webhook/meta?hub.mode=subscribe&hub.verify_token=${VERIFY_TOKEN}&hub.challenge=abc123`,
      { method: 'GET' },
    );
    const resp = await handleMetaWebhook(req, env);
    assertEqual(resp.status, 200, 'status');
    const body = await resp.text();
    assertEqual(body, 'abc123', 'challenge');
  });

  // ── T2: GET verify_token errado ─────────────────────────────────────────────
  await test('T2 — GET verify_token errado → 403', async () => {
    const env = makeEnv();
    const req = new Request(
      `http://localhost/api/v1/webhook/meta?hub.mode=subscribe&hub.verify_token=WRONG_TOKEN&hub.challenge=abc123`,
      { method: 'GET' },
    );
    const resp = await handleMetaWebhook(req, env);
    assertEqual(resp.status, 403, 'status');
  });

  // ── T3: GET sem token ───────────────────────────────────────────────────────
  await test('T3 — GET sem hub.verify_token → 403', async () => {
    const env = makeEnv();
    const req = new Request(
      `http://localhost/api/v1/webhook/meta?hub.mode=subscribe&hub.challenge=abc123`,
      { method: 'GET' },
    );
    const resp = await handleMetaWebhook(req, env);
    assertEqual(resp.status, 403, 'status');
  });

  // ── T4: POST válido → 200, lead criado ─────────────────────────────────────
  await test('T4 — POST válido → 200, lead criado (origem=meta_ads, LGPD=legitimo_interesse)', async () => {
    mockBehavior = 'normal';
    mockOverride = null;
    const env = makeEnv();
    const leadgenId = `lgid_t4_${Date.now()}`;
    const payload = makeLeadgenPayload(leadgenId);

    const resp = await postWebhook(payload, env);
    assertEqual(resp.status, 200, 'status');
    const json = await resp.json();
    assert(json.success, 'success=true');

    // Verificar lead inserido
    const lead = await mockDB
      .prepare(`SELECT id, contato_id, origem, canal, idempotency_key FROM leads WHERE idempotency_key = ?`)
      .bind(leadgenId).first();
    assert(lead !== null, 'Lead deve existir no DB');
    assertEqual(lead.origem, 'meta_ads', 'origem=meta_ads');
    assertEqual(lead.canal, 'formulario_meta', 'canal=formulario_meta');
    assertEqual(lead.idempotency_key, leadgenId, 'idempotency_key=leadgen_id');

    // Verificar LGPD
    const lgpd = await mockDB
      .prepare(`SELECT base_legal, texto_versao, canal FROM consentimentos_lgpd WHERE contato_id = ? LIMIT 1`)
      .bind(lead.contato_id).first();
    assert(lgpd !== null, 'Registro LGPD deve existir');
    assertEqual(lgpd.base_legal, 'legitimo_interesse', 'base_legal=legitimo_interesse');
    assertEqual(lgpd.texto_versao, 'meta-lead-form-li-v1', 'texto_versao correto');
    assertEqual(lgpd.canal, 'portal_web', 'canal=portal_web');
  });

  // ── T5: POST HMAC inválido → 401 ───────────────────────────────────────────
  await test('T5 — POST HMAC inválido → 401', async () => {
    const env = makeEnv();
    const payload = makeLeadgenPayload(`lgid_t5_${Date.now()}`);
    const resp = await postWebhook(payload, env, 'wrong-secret');
    assertEqual(resp.status, 401, 'status');
  });

  // ── T6: POST duplicado → 200, duplicate ────────────────────────────────────
  await test('T6 — POST duplicado (mesmo leadgen_id) → 200 sem duplicar', async () => {
    mockBehavior = 'normal';
    mockOverride = null;
    const env = makeEnv();
    const leadgenId = `lgid_t6_${Date.now()}`;
    const payload = makeLeadgenPayload(leadgenId);

    // Primeira vez
    const r1 = await postWebhook(payload, env);
    assertEqual(r1.status, 200, 'primeira req status');

    // Segunda vez (duplicado)
    const r2 = await postWebhook(payload, env);
    assertEqual(r2.status, 200, 'segunda req status');

    // Deve haver apenas 1 lead com esse leadgen_id
    const all = await mockDB
      .prepare(`SELECT COUNT(*) as cnt FROM leads WHERE idempotency_key = ?`)
      .bind(leadgenId).first();
    assertEqual(all.cnt, 1, 'apenas 1 lead inserido (idempotência)');
  });

  // ── T7: POST sem phone_number → 200, discarded ─────────────────────────────
  await test('T7 — POST Graph API retorna sem phone_number → 200, discarded', async () => {
    // Sobrescrever mock para retornar sem telefone
    const origServer = mockServer;
    // Substituir handler temporariamente via mockOverride especial
    const prevBehavior = mockBehavior;
    // Vamos parar o mock e criar um temporário sem phone_number
    await stopMockServer();

    const tempServer = createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        id: 'lgid_t7',
        created_time: '2026-11-09T12:00:00+0000',
        field_data: [
          { name: 'full_name', values: ['Sem Telefone'] },
          { name: 'email', values: ['semtelefone@exemplo.com'] },
          // SEM phone_number
        ],
      }));
    });

    await new Promise(r => tempServer.listen(MOCK_PORT, '127.0.0.1', r));

    const env = makeEnv();
    const leadgenId = `lgid_t7_${Date.now()}`;
    const payload = makeLeadgenPayload(leadgenId);
    const resp = await postWebhook(payload, env);
    assertEqual(resp.status, 200, 'status');

    // Lead NÃO deve ter sido criado
    const lead = await mockDB
      .prepare(`SELECT id FROM leads WHERE idempotency_key = ?`)
      .bind(leadgenId).first();
    assert(lead === null, 'Lead não deve existir para phone_number ausente');

    await new Promise(r => tempServer.close(r));
    // Reiniciar mock normal
    mockBehavior = prevBehavior;
    await startMockServer();
  });

  // ── T8: POST telefone inválido → 200, discarded ────────────────────────────
  await test('T8 — POST telefone inválido (apenas letras) → 200, discarded', async () => {
    await stopMockServer();
    const tempServer = createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        id: 'lgid_t8',
        created_time: '2026-11-09T12:00:00+0000',
        field_data: [
          { name: 'phone_number', values: ['NAO-EH-TELEFONE'] },
          { name: 'full_name', values: ['Inválido'] },
        ],
      }));
    });
    await new Promise(r => tempServer.listen(MOCK_PORT, '127.0.0.1', r));

    const env = makeEnv();
    const leadgenId = `lgid_t8_${Date.now()}`;
    const payload = makeLeadgenPayload(leadgenId);
    const resp = await postWebhook(payload, env);
    assertEqual(resp.status, 200, 'status');

    const lead = await mockDB
      .prepare(`SELECT id FROM leads WHERE idempotency_key = ?`)
      .bind(leadgenId).first();
    assert(lead === null, 'Lead não deve existir para telefone inválido');

    await new Promise(r => tempServer.close(r));
    await startMockServer();
  });

  // ── T9: POST page_id não autorizado → 200, skipped ────────────────────────
  await test('T9 — POST page_id não autorizado → 200, skipped', async () => {
    mockBehavior = 'normal';
    mockOverride = null;
    // Env com META_PAGE_ID configurado
    const env = makeEnv({ pageId: TEST_PAGE_ID });
    // Payload com page_id DIFERENTE
    const wrongPageId = '999888777666555';
    const leadgenId = `lgid_t9_${Date.now()}`;
    const payload = makeLeadgenPayload(leadgenId, wrongPageId);

    const resp = await postWebhook(payload, env);
    assertEqual(resp.status, 200, 'status');
    const json = await resp.json();
    assertEqual(json.skipped, 'unauthorized_page_id', 'skipped=unauthorized_page_id');

    const lead = await mockDB
      .prepare(`SELECT id FROM leads WHERE idempotency_key = ?`)
      .bind(leadgenId).first();
    assert(lead === null, 'Lead não deve existir para page_id não autorizado');
  });

  // ── T10: POST page_id autorizado → 200, lead criado ────────────────────────
  await test('T10 — POST page_id autorizado → 200, lead criado', async () => {
    mockBehavior = 'normal';
    mockOverride = { phone: '21888880002', email: 'lead_t10@exemplo.com' };
    const env = makeEnv({ pageId: TEST_PAGE_ID });
    const leadgenId = `lgid_t10_${Date.now()}`;
    const payload = makeLeadgenPayload(leadgenId, TEST_PAGE_ID);

    const resp = await postWebhook(payload, env);
    assertEqual(resp.status, 200, 'status');

    const lead = await mockDB
      .prepare(`SELECT id FROM leads WHERE idempotency_key = ?`)
      .bind(leadgenId).first();
    assert(lead !== null, 'Lead deve existir para page_id autorizado');
    mockOverride = null;
  });

  // ── T11: POST objeto não-'page' → 200 ──────────────────────────────────────
  await test('T11 — POST objeto não-"page" → 200 (ignorar)', async () => {
    const env = makeEnv();
    const leadgenId = `lgid_t11_${Date.now()}`;
    const payload = { object: 'user', entry: [] }; // objeto diferente de 'page'
    const resp = await postWebhook(payload, env);
    assertEqual(resp.status, 200, 'status');
  });

  // ── T12: POST JSON inválido → 400 ───────────────────────────────────────────
  await test('T12 — POST JSON inválido → 400', async () => {
    const env = makeEnv();
    const body = 'isso nao e json {{{';
    const bodyBytes = new TextEncoder().encode(body);
    const sig = await computeHmac(APP_SECRET, bodyBytes.buffer);

    const req = new Request('http://localhost/api/v1/webhook/meta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Hub-Signature-256': sig },
      body,
    });
    const resp = await handleMetaWebhook(req, env);
    assertEqual(resp.status, 400, 'status');
  });

  // ── T13: POST Graph API 429 → 503 ───────────────────────────────────────────
  await test('T13 — POST Graph API 429 → 503 (Meta deve retentar)', async () => {
    mockBehavior = '429';
    const env = makeEnv();
    const leadgenId = `lgid_t13_${Date.now()}`;
    const payload = makeLeadgenPayload(leadgenId);
    const resp = await postWebhook(payload, env);
    assertEqual(resp.status, 503, 'status');
    assert(resp.headers.get('retry-after') !== null, 'Retry-After presente');
    mockBehavior = 'normal';
  });

  // ── T14: POST Graph API 500 → 503 ───────────────────────────────────────────
  await test('T14 — POST Graph API 500 → 503 (Meta deve retentar)', async () => {
    mockBehavior = '500';
    const env = makeEnv();
    const leadgenId = `lgid_t14_${Date.now()}`;
    const payload = makeLeadgenPayload(leadgenId);
    const resp = await postWebhook(payload, env);
    assertEqual(resp.status, 503, 'status');
    mockBehavior = 'normal';
  });

  // ── T15: POST Graph API 404 → 200, discarded ──────────────────────────────
  await test('T15 — POST Graph API 404 → 200, discarded (erro permanente)', async () => {
    mockBehavior = '404';
    const env = makeEnv();
    const leadgenId = `lgid_t15_${Date.now()}`;
    const payload = makeLeadgenPayload(leadgenId);
    const resp = await postWebhook(payload, env);
    assertEqual(resp.status, 200, 'status');

    const lead = await mockDB
      .prepare(`SELECT id FROM leads WHERE idempotency_key = ?`)
      .bind(leadgenId).first();
    assert(lead === null, 'Lead não deve existir para leadgen_id inválido (404)');
    mockBehavior = 'normal';
  });

  // ── T16: Conflito tel/email → 200, captacoes_conflito ─────────────────────
  await test('T16 — Conflito identidade (tel→C1, email→C2) → 200, captacoes_conflito', async () => {
    mockBehavior = 'normal';

    // 1. Criar contato A com telefone T1
    const telA = '+5521777770016';
    const emailA = 'contato_a_t16@exemplo.com';
    await mockDB.prepare(
      `INSERT OR IGNORE INTO contatos (telefone, nome, email) VALUES (?, 'Contato A', ?)`
    ).bind(telA, emailA).run();

    const contatoA = await mockDB
      .prepare(`SELECT id FROM contatos WHERE telefone = ?`)
      .bind(telA).first();

    // 2. Criar contato B com email E2 e telefone diferente
    const telB = '+5521888880016';
    const emailB = 'contato_b_t16@exemplo.com';
    await mockDB.prepare(
      `INSERT OR IGNORE INTO contatos (telefone, nome, email) VALUES (?, 'Contato B', ?)`
    ).bind(telB, emailB).run();

    const contatoB = await mockDB
      .prepare(`SELECT id FROM contatos WHERE telefone = ?`)
      .bind(telB).first();

    assert(contatoA && contatoB && contatoA.id !== contatoB.id, 'Dois contatos distintos criados');

    // 3. Mock retorna telA + emailB → conflito
    mockOverride = { phone: '21777770016', email: emailB };

    const env = makeEnv();
    const leadgenId = `lgid_t16_${Date.now()}`;
    const payload = makeLeadgenPayload(leadgenId);

    const resp = await postWebhook(payload, env);
    assertEqual(resp.status, 200, 'status (conflito deve retornar 200)');

    // 4. Verificar captacoes_conflito
    const conflito = await mockDB
      .prepare(`SELECT * FROM captacoes_conflito WHERE idempotency_key = ?`)
      .bind(leadgenId).first();

    assert(conflito !== null, 'Conflito deve estar em captacoes_conflito');
    assertEqual(conflito.tel_contato_id, contatoA.id, 'tel_contato_id = Contato A');
    assertEqual(conflito.email_contato_id, contatoB.id, 'email_contato_id = Contato B');
    assertEqual(conflito.origem, 'meta_ads', 'origem=meta_ads');
    assertEqual(conflito.canal, 'formulario_meta', 'canal=formulario_meta');
    assertEqual(conflito.status, 'pendente', 'status=pendente');

    // 5. Lead NÃO deve existir (conflito não cria lead)
    const lead = await mockDB
      .prepare(`SELECT id FROM leads WHERE idempotency_key = ?`)
      .bind(leadgenId).first();
    assert(lead === null, 'Lead NÃO deve existir para conflito (revisão manual necessária)');

    mockOverride = null;
  });

  // ── T17: Retry Meta — 3× mesmo leadgen_id → sem duplicatas ────────────────
  await test('T17 — Retry Meta (3× mesmo leadgen_id após 503) → sem duplicatas', async () => {
    mockBehavior = 'normal';
    mockOverride = { phone: '11966660017', email: 'retry_t17@exemplo.com' };
    const env = makeEnv();
    const leadgenId = `lgid_t17_${Date.now()}`;
    const payload = makeLeadgenPayload(leadgenId);

    // Simular: Meta envia 3 vezes (retenta após falhas anteriores)
    const r1 = await postWebhook(payload, env);
    assertEqual(r1.status, 200, 'retry 1 status');

    const r2 = await postWebhook(payload, env);
    assertEqual(r2.status, 200, 'retry 2 status');

    const r3 = await postWebhook(payload, env);
    assertEqual(r3.status, 200, 'retry 3 status');

    // Deve haver exatamente 1 lead
    const count = await mockDB
      .prepare(`SELECT COUNT(*) as cnt FROM leads WHERE idempotency_key = ?`)
      .bind(leadgenId).first();
    assertEqual(count.cnt, 1, 'Exatamente 1 lead após 3 reenvios (idempotência garantida)');

    // LGPD: apenas 1 registro de consentimento
    const lead = await mockDB
      .prepare(`SELECT contato_id FROM leads WHERE idempotency_key = ?`)
      .bind(leadgenId).first();
    const lgpdCount = await mockDB
      .prepare(`SELECT COUNT(*) as cnt FROM consentimentos_lgpd WHERE contato_id = ? AND texto_versao = ?`)
      .bind(lead.contato_id, VERSAO_LI_META).first();
    assertEqual(lgpdCount.cnt, 1, 'Exatamente 1 registro LGPD (sem duplicar consentimento)');

    mockOverride = null;
  });

  // ─── Finalização ───────────────────────────────────────────────────────────

  await stopMockServer();

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(`  RESULTADO: ${passed} passaram / ${failed} falharam / ${passed + failed} total`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  if (failed > 0) {
    console.log('Falhas:');
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`  ✗ ${r.name}`);
      console.log(`    ${r.error}`);
    });
    console.log('');
  }

  // Verificações extras de integridade do banco
  console.log('▸ Verificações de integridade pós-testes:');

  const totalLeads = await mockDB
    .prepare(`SELECT COUNT(*) as cnt FROM leads`).first();
  console.log(`  Leads no banco: ${totalLeads.cnt}`);

  const totalContatos = await mockDB
    .prepare(`SELECT COUNT(*) as cnt FROM contatos`).first();
  console.log(`  Contatos no banco: ${totalContatos.cnt}`);

  const totalConflitos = await mockDB
    .prepare(`SELECT COUNT(*) as cnt FROM captacoes_conflito`).first();
  console.log(`  Conflitos no banco: ${totalConflitos.cnt}`);

  const totalLgpd = await mockDB
    .prepare(`SELECT COUNT(*) as cnt FROM consentimentos_lgpd`).first();
  console.log(`  Registros LGPD: ${totalLgpd.cnt}`);

  const metaLeads = await mockDB
    .prepare(`SELECT COUNT(*) as cnt FROM leads WHERE origem = 'meta_ads'`).first();
  console.log(`  Leads origem=meta_ads: ${metaLeads.cnt}`);

  const liLeads = await mockDB
    .prepare(`SELECT COUNT(*) as cnt FROM consentimentos_lgpd WHERE base_legal = 'legitimo_interesse'`).first();
  console.log(`  LGPD legitimo_interesse: ${liLeads.cnt}`);

  console.log('');

  // Limpeza do runner Python temporário
  try { unlinkSync(RUNNER_PATH); } catch {}

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Erro fatal no harness:', err);
  process.exit(1);
});
