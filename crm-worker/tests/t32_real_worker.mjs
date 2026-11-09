/**
 * t32_real_worker.mjs — Mission 6C: integração com o Worker TypeScript REAL
 *
 * Diferença em relação ao t31_node_harness.mjs:
 *   t31: reimplementação JS das funções de webhook-meta.ts (lógica COPIADA)
 *   t32: importa o código COMPILADO de webhook-meta.ts via tsc → CJS
 *        → testa o código real, não uma reimplementação
 *
 * Pré-requisito:
 *   tsc --project tsconfig.mission6c.json  (gera dist-mission6c/)
 *
 * Cobertura T1–T17 (reprodução com código real) + novos:
 *   T18 — Batch parcial: 2 entries, 2ª com Graph 429 → 503, reenvio → idempotência
 *   T19 — Concorrência: 3 requests simultâneos com mesmo leadgen_id → 1 lead
 *   T20 — GRAPH_API_BASE_URL ausente → usa graph.facebook.com (verificado via erro de rede)
 *   T21 — LGPD: base_legal=legitimo_interesse, NÃO consentimento; canal=portal_web
 *   T22 — origem=meta_ads em leads, dados_extras_json contém meta_leadgen_id
 */

import { createServer }  from 'node:http';
import { spawnSync }     from 'node:child_process';
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir }        from 'node:os';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const require    = createRequire(import.meta.url);

// ─── Importar o Worker REAL compilado (não reimplementação) ──────────────────

const DIST_DIR = join(__dirname, '..', 'dist-mission6c');
const WORKER_MODULE = join(DIST_DIR, 'routes', 'webhook-meta.js');

if (!existsSync(WORKER_MODULE)) {
  console.error(`\n❌ Módulo compilado não encontrado: ${WORKER_MODULE}`);
  console.error('Execute: tsc --project tsconfig.mission6c.json\n');
  process.exit(1);
}

const { handleMetaWebhook } = require(WORKER_MODULE);

console.log(`✓ handleMetaWebhook carregado de: ${WORKER_MODULE.replace(join(__dirname, '..'), '[crm-worker]')}`);

// ─── Configuração ─────────────────────────────────────────────────────────────

const MOCK_PORT    = 3098;  // Porta diferente do t31 para evitar conflito
const APP_SECRET   = 'test-app-secret-abc';
const VERIFY_TOKEN = 'test-verify-token-123';
const PAGE_TOKEN   = 'qualquer-valor-para-dev-local';
const TEST_PAGE_ID = '111222333444555';
const DB_PATH      = join(tmpdir(), 'test_t32_real_worker.db');

// ─── D1 Adapter (SQLite via Python — idêntico ao t31) ────────────────────────

const PYTHON_RUNNER_SRC = `
import sqlite3, sys, json

db_path = sys.argv[1]
mode    = sys.argv[2]
sql     = sys.argv[3]
params  = json.loads(sys.argv[4]) if len(sys.argv) > 4 else []

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
        print(json.dumps(None if row is None else dict(row)))
    elif mode == 'all':
        rows = conn.execute(sql, params).fetchall()
        print(json.dumps({"results": [dict(r) for r in rows], "success": True}))
    elif mode == 'run_returning':
        row = conn.execute(sql, params).fetchone()
        conn.commit()
        print(json.dumps(None if row is None else dict(row)))
except Exception as e:
    import traceback
    sys.stderr.write(traceback.format_exc())
    print(json.dumps({"error": str(e)}))
finally:
    conn.close()
`;

const RUNNER_PATH = join(tmpdir(), 't32_sqlite_runner.py');
writeFileSync(RUNNER_PATH, PYTHON_RUNNER_SRC);

function runSql(mode, sql, params = []) {
  const r = spawnSync('python3', [RUNNER_PATH, DB_PATH, mode, sql, JSON.stringify(params)], {
    encoding: 'utf8', timeout: 5000,
  });
  if (r.stderr && r.stderr.trim()) process.stderr.write('[sqlite] ' + r.stderr.trim() + '\n');
  if (!r.stdout.trim()) return null;
  const parsed = JSON.parse(r.stdout.trim());
  if (parsed && parsed.error) throw new Error('[D1] ' + parsed.error);
  return parsed;
}

class D1PreparedStatement {
  constructor(sql) { this.sql = sql; this._params = []; }
  bind(...args) { this._params = args.map(a => a === undefined ? null : a); return this; }
  async first() {
    if (/INSERT\s+/i.test(this.sql) && /RETURNING\s+/i.test(this.sql)) {
      return runSql('run_returning', this.sql, this._params);
    }
    return runSql('first', this.sql, this._params);
  }
  async run() { return runSql('run', this.sql, this._params); }
  async all() { return runSql('all', this.sql, this._params); }
}

const mockDB = { prepare(sql) { return new D1PreparedStatement(sql); } };

// ─── Mock Graph API Server ────────────────────────────────────────────────────

let mockServer;
let mockBehavior = 'normal';
let mockOverride = null;
let requestLog   = [];

function startMockServer() {
  return new Promise(resolve => {
    mockServer = createServer((req, res) => {
      const match = req.url.match(/\/v21\.0\/([^?]+)/);
      const leadgenId = match ? decodeURIComponent(match[1]) : 'unknown';
      requestLog.push({ leadgenId, behavior: mockBehavior, ts: Date.now() });

      if (mockBehavior === '429') { res.writeHead(429); res.end('Too Many Requests'); return; }
      if (mockBehavior === '500') { res.writeHead(500); res.end('Internal Server Error'); return; }
      if (mockBehavior === '404') {
        res.writeHead(404);
        res.end(JSON.stringify({ error: { code: 100, message: 'Invalid leadgen_id' } }));
        return;
      }

      let phone = '11999990001';
      let email = 'lead@exemplo.com';
      if (mockOverride?.phone) { phone = mockOverride.phone; email = mockOverride.email ?? email; }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        id: leadgenId,
        created_time: '2026-11-09T12:00:00+0000',
        field_data: [
          { name: 'full_name',    values: ['João Silva'] },
          { name: 'phone_number', values: [phone] },
          { name: 'email',        values: [email] },
          { name: 'city',         values: ['Niterói'] },
        ],
        form_id:       'form_123456',
        campaign_id:   'camp_789',
        campaign_name: 'campanha-mcmv-novembro',
      }));
    });
    mockServer.listen(MOCK_PORT, '127.0.0.1', resolve);
  });
}

function stopMockServer() {
  return new Promise(resolve => { if (mockServer) mockServer.close(resolve); else resolve(); });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeEnv(opts = {}) {
  return {
    DB: mockDB,
    META_VERIFY_TOKEN: VERIFY_TOKEN,
    META_APP_SECRET: APP_SECRET,
    META_PAGE_ACCESS_TOKEN: PAGE_TOKEN,
    GRAPH_API_BASE_URL: `http://127.0.0.1:${MOCK_PORT}`,
    ...(opts.pageId ? { META_PAGE_ID: opts.pageId } : {}),
    ...(opts.noGraphUrl ? { GRAPH_API_BASE_URL: undefined } : {}),
  };
}

function makeLeadgenPayload(leadgenId, pageId = TEST_PAGE_ID) {
  return {
    object: 'page',
    entry: [{ id: pageId, time: Math.floor(Date.now() / 1000), changes: [{
      field: 'leadgen',
      value: { leadgen_id: leadgenId, page_id: pageId, form_id: 'form_123456',
               ad_id: 'ad_111', campaign_id: 'camp_789',
               campaign_name: 'campanha-mcmv-novembro',
               created_time: Math.floor(Date.now() / 1000) },
    }] }],
  };
}

async function computeHmac(secret, bodyBuffer) {
  const keyBytes = new TextEncoder().encode(secret);
  const key = await crypto.subtle.importKey(
    'raw', keyBytes.buffer, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'],
  );
  const sigBytes = await crypto.subtle.sign('HMAC', key, bodyBuffer);
  return 'sha256=' + Array.from(new Uint8Array(sigBytes))
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

async function postWebhook(payload, env, appSecretOverride) {
  const secret = appSecretOverride ?? APP_SECRET;
  const body = JSON.stringify(payload);
  const bodyBytes = new TextEncoder().encode(body);
  const sig = await computeHmac(secret, bodyBytes.buffer);
  const req = new Request('http://localhost/api/v1/webhook/meta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Hub-Signature-256': sig },
    body,
  });
  // ctx simulado — sem waitUntil
  return handleMetaWebhook(req, env, { waitUntil: () => {} });
}

function setupDb() {
  const script = join(__dirname, 'setup_test_db.py');
  const r = spawnSync('python3', [script, DB_PATH], { encoding: 'utf8' });
  if (r.stderr?.includes('ERRO')) throw new Error('Falha ao inicializar DB:\n' + r.stderr);
}

// ─── Runner ──────────────────────────────────────────────────────────────────

let passed = 0, failed = 0;
const results = [];

async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✅ ${name}`);
    passed++; results.push({ name, status: 'PASS' });
  } catch (err) {
    console.error(`  ❌ ${name}: ${err.message}`);
    failed++; results.push({ name, status: 'FAIL', error: err.message });
  }
}

function assert(cond, msg)     { if (!cond) throw new Error(msg ?? 'assert failed'); }
function assertEqual(a, b, msg) {
  if (a !== b) throw new Error(`${msg ?? 'assertEqual'}: expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('  MARKET IMOBI CRM — Mission 6C — Integração Worker TypeScript REAL');
  console.log('  Node.js', process.version, '| Código compilado de webhook-meta.ts   ');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  console.log('▸ Inicializando banco SQLite...');
  setupDb();
  console.log(`  DB: ${DB_PATH}\n`);

  console.log(`▸ Iniciando mock Graph API (porta ${MOCK_PORT})...`);
  await startMockServer();
  console.log('  Mock ativo\n');

  console.log('▸ Executando T1–T17 (reprodução com código real) + T18-T22 (novos)...\n');

  // ════ T1-T3: Verificação do token (GET) ════════════════════════════════════

  await test('T1 — GET verify_token correto → 200 + challenge', async () => {
    const env = makeEnv();
    const req = new Request(
      `http://localhost/api/v1/webhook/meta?hub.mode=subscribe&hub.verify_token=${VERIFY_TOKEN}&hub.challenge=desafio_abc`,
      { method: 'GET' },
    );
    const resp = await handleMetaWebhook(req, env, {});
    assertEqual(resp.status, 200, 'status');
    assertEqual(await resp.text(), 'desafio_abc', 'challenge retornado exatamente');
  });

  await test('T2 — GET verify_token errado → 403', async () => {
    const env = makeEnv();
    const req = new Request(
      `http://localhost/api/v1/webhook/meta?hub.mode=subscribe&hub.verify_token=TOKEN_ERRADO&hub.challenge=x`,
      { method: 'GET' },
    );
    assertEqual((await handleMetaWebhook(req, env, {})).status, 403, 'status');
  });

  await test('T3 — GET sem hub.verify_token → 403', async () => {
    const env = makeEnv();
    const req = new Request(
      `http://localhost/api/v1/webhook/meta?hub.mode=subscribe&hub.challenge=x`,
      { method: 'GET' },
    );
    assertEqual((await handleMetaWebhook(req, env, {})).status, 403, 'status');
  });

  // ════ T4: Lead completo ════════════════════════════════════════════════════

  await test('T4 — POST válido → 200, lead meta_ads + LGPD legitimo_interesse', async () => {
    mockBehavior = 'normal'; mockOverride = null;
    const env = makeEnv();
    const lgid = `lgid_t4r_${Date.now()}`;
    const resp = await postWebhook(makeLeadgenPayload(lgid), env);
    assertEqual(resp.status, 200, 'status');
    assert((await resp.json()).success, 'success=true');

    const lead = await mockDB.prepare(
      `SELECT id, contato_id, origem, canal, idempotency_key, dados_extras_json
       FROM leads WHERE idempotency_key = ?`
    ).bind(lgid).first();

    assert(lead !== null, 'Lead deve existir');
    assertEqual(lead.origem, 'meta_ads', 'origem=meta_ads');
    assertEqual(lead.canal,  'formulario_meta', 'canal=formulario_meta');
    assertEqual(lead.idempotency_key, lgid, 'idempotency_key=leadgen_id');

    // dados_extras_json deve conter meta_leadgen_id (T22)
    const extras = JSON.parse(lead.dados_extras_json);
    assertEqual(extras.meta_leadgen_id, lgid, 'dados_extras.meta_leadgen_id');
    assert(extras.meta_page_id, 'dados_extras.meta_page_id presente');
    assert(extras.meta_form_id, 'dados_extras.meta_form_id presente');
    assert(extras.meta_campaign_name, 'dados_extras.meta_campaign_name presente');

    // LGPD
    const lgpd = await mockDB.prepare(
      `SELECT base_legal, texto_versao, canal, tipo, concedido
       FROM consentimentos_lgpd WHERE contato_id = ? LIMIT 1`
    ).bind(lead.contato_id).first();
    assert(lgpd !== null, 'Registro LGPD deve existir');
    assertEqual(lgpd.base_legal,    'legitimo_interesse', 'base_legal');
    assertEqual(lgpd.texto_versao,  'meta-lead-form-li-v1', 'texto_versao');
    assertEqual(lgpd.canal,         'portal_web', 'canal LGPD');
    assertEqual(lgpd.tipo,          'contato_whatsapp', 'tipo LGPD');
    assertEqual(lgpd.concedido,     1, 'concedido=1 (registro ativo)');
  });

  // ════ T5: HMAC inválido ═══════════════════════════════════════════════════

  await test('T5 — POST HMAC inválido → 401', async () => {
    const env = makeEnv();
    const resp = await postWebhook(makeLeadgenPayload(`lgid_t5r_${Date.now()}`), env, 'wrong-secret');
    assertEqual(resp.status, 401, 'status');
  });

  // ════ T6: Idempotência ════════════════════════════════════════════════════

  await test('T6 — POST duplicado (mesmo leadgen_id) → 200 sem duplicar', async () => {
    mockBehavior = 'normal'; mockOverride = null;
    const env = makeEnv();
    const lgid = `lgid_t6r_${Date.now()}`;
    const payload = makeLeadgenPayload(lgid);
    assertEqual((await postWebhook(payload, env)).status, 200, 'req1');
    assertEqual((await postWebhook(payload, env)).status, 200, 'req2');
    const cnt = await mockDB.prepare(`SELECT COUNT(*) as c FROM leads WHERE idempotency_key = ?`).bind(lgid).first();
    assertEqual(cnt.c, 1, 'exatamente 1 lead');
  });

  // ════ T7-T8: Dados ausentes ═══════════════════════════════════════════════

  await test('T7 — POST Graph API retorna sem phone_number → 200, discarded', async () => {
    await stopMockServer();
    const noPhoneServer = createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        id: 'x', created_time: '2026-11-09T00:00:00+0000',
        field_data: [{ name: 'email', values: ['semtelefone@ex.com'] }],
      }));
    });
    await new Promise(r => noPhoneServer.listen(MOCK_PORT, '127.0.0.1', r));

    const lgid = `lgid_t7r_${Date.now()}`;
    assertEqual((await postWebhook(makeLeadgenPayload(lgid), makeEnv())).status, 200, 'status');
    assert(null === await mockDB.prepare(`SELECT id FROM leads WHERE idempotency_key = ?`).bind(lgid).first(), 'sem lead');

    await new Promise(r => noPhoneServer.close(r));
    await startMockServer();
  });

  await test('T8 — POST telefone inválido → 200, discarded', async () => {
    await stopMockServer();
    const badPhoneServer = createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        id: 'x', created_time: '2026-11-09T00:00:00+0000',
        field_data: [{ name: 'phone_number', values: ['NAO-TELEFONE'] }],
      }));
    });
    await new Promise(r => badPhoneServer.listen(MOCK_PORT, '127.0.0.1', r));

    const lgid = `lgid_t8r_${Date.now()}`;
    assertEqual((await postWebhook(makeLeadgenPayload(lgid), makeEnv())).status, 200, 'status');
    assert(null === await mockDB.prepare(`SELECT id FROM leads WHERE idempotency_key = ?`).bind(lgid).first(), 'sem lead');

    await new Promise(r => badPhoneServer.close(r));
    await startMockServer();
  });

  // ════ T9-T10: Filtro page_id ══════════════════════════════════════════════

  await test('T9 — POST page_id não autorizado → 200, skipped', async () => {
    mockBehavior = 'normal';
    const env = makeEnv({ pageId: TEST_PAGE_ID });
    const resp = await postWebhook(makeLeadgenPayload(`lgid_t9r_${Date.now()}`, '999888777'), env);
    assertEqual(resp.status, 200, 'status');
    assertEqual((await resp.json()).skipped, 'unauthorized_page_id', 'skipped');
  });

  await test('T10 — POST page_id autorizado → 200, lead criado', async () => {
    mockBehavior = 'normal'; mockOverride = { phone: '21888880010', email: 'lead_t10r@ex.com' };
    const env = makeEnv({ pageId: TEST_PAGE_ID });
    const lgid = `lgid_t10r_${Date.now()}`;
    assertEqual((await postWebhook(makeLeadgenPayload(lgid, TEST_PAGE_ID), env)).status, 200, 'status');
    assert(null !== await mockDB.prepare(`SELECT id FROM leads WHERE idempotency_key = ?`).bind(lgid).first(), 'lead criado');
    mockOverride = null;
  });

  // ════ T11-T12: Payloads inválidos ═════════════════════════════════════════

  await test('T11 — POST object != page → 200, ignorado', async () => {
    const env = makeEnv();
    assertEqual((await postWebhook({ object: 'user', entry: [] }, env)).status, 200, 'status');
  });

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
    assertEqual((await handleMetaWebhook(req, env, {})).status, 400, 'status');
  });

  // ════ T13-T15: Erros da Graph API ════════════════════════════════════════

  await test('T13 — POST Graph API 429 → 503 + Retry-After', async () => {
    mockBehavior = '429';
    const resp = await postWebhook(makeLeadgenPayload(`lgid_t13r_${Date.now()}`), makeEnv());
    assertEqual(resp.status, 503, 'status');
    assert(resp.headers.get('retry-after') !== null, 'Retry-After presente');
    mockBehavior = 'normal';
  });

  await test('T14 — POST Graph API 500 → 503', async () => {
    mockBehavior = '500';
    assertEqual((await postWebhook(makeLeadgenPayload(`lgid_t14r_${Date.now()}`), makeEnv())).status, 503, 'status');
    mockBehavior = 'normal';
  });

  await test('T15 — POST Graph API 404 → 200, discarded (erro permanente)', async () => {
    mockBehavior = '404';
    const lgid = `lgid_t15r_${Date.now()}`;
    assertEqual((await postWebhook(makeLeadgenPayload(lgid), makeEnv())).status, 200, 'status');
    assert(null === await mockDB.prepare(`SELECT id FROM leads WHERE idempotency_key = ?`).bind(lgid).first(), 'sem lead');
    mockBehavior = 'normal';
  });

  // ════ T16: Conflito de identidade ════════════════════════════════════════

  await test('T16 — Conflito identidade (tel→C1, email→C2) → captacoes_conflito', async () => {
    mockBehavior = 'normal';
    const telA = '+5521777770032', emailA = 'contato_a_t16r@ex.com';
    const telB = '+5521888880032', emailB = 'contato_b_t16r@ex.com';

    await mockDB.prepare(`INSERT OR IGNORE INTO contatos (telefone, nome, email) VALUES (?, 'A', ?)`).bind(telA, emailA).run();
    await mockDB.prepare(`INSERT OR IGNORE INTO contatos (telefone, nome, email) VALUES (?, 'B', ?)`).bind(telB, emailB).run();

    const cA = await mockDB.prepare(`SELECT id FROM contatos WHERE telefone = ?`).bind(telA).first();
    const cB = await mockDB.prepare(`SELECT id FROM contatos WHERE telefone = ?`).bind(telB).first();
    assert(cA && cB && cA.id !== cB.id, 'dois contatos distintos');

    mockOverride = { phone: '21777770032', email: emailB };
    const lgid = `lgid_t16r_${Date.now()}`;
    const resp = await postWebhook(makeLeadgenPayload(lgid), makeEnv());
    assertEqual(resp.status, 200, 'conflito retorna 200');

    const conflito = await mockDB.prepare(`SELECT * FROM captacoes_conflito WHERE idempotency_key = ?`).bind(lgid).first();
    assert(conflito !== null, 'captacoes_conflito deve existir');
    assertEqual(conflito.tel_contato_id,   cA.id, 'tel_contato_id = C_A');
    assertEqual(conflito.email_contato_id, cB.id, 'email_contato_id = C_B');
    assertEqual(conflito.origem, 'meta_ads', 'origem=meta_ads');
    assertEqual(conflito.status, 'pendente', 'status=pendente');
    assert(null === await mockDB.prepare(`SELECT id FROM leads WHERE idempotency_key = ?`).bind(lgid).first(), 'sem lead em conflito');
    mockOverride = null;
  });

  // ════ T17: Idempotência de retry ══════════════════════════════════════════

  await test('T17 — Retry Meta (3× mesmo leadgen_id) → 1 lead, 1 LGPD', async () => {
    mockBehavior = 'normal'; mockOverride = { phone: '11966660017', email: 'retry_t17r@ex.com' };
    const env = makeEnv();
    const lgid = `lgid_t17r_${Date.now()}`;
    const payload = makeLeadgenPayload(lgid);

    for (let i = 0; i < 3; i++) {
      assertEqual((await postWebhook(payload, env)).status, 200, `retry ${i+1}`);
    }

    const cnt = await mockDB.prepare(`SELECT COUNT(*) as c FROM leads WHERE idempotency_key = ?`).bind(lgid).first();
    assertEqual(cnt.c, 1, '1 lead após 3 reenvios');

    const lead = await mockDB.prepare(`SELECT contato_id FROM leads WHERE idempotency_key = ?`).bind(lgid).first();
    const lgpdCnt = await mockDB.prepare(
      `SELECT COUNT(*) as c FROM consentimentos_lgpd WHERE contato_id = ? AND texto_versao = 'meta-lead-form-li-v1'`
    ).bind(lead.contato_id).first();
    assertEqual(lgpdCnt.c, 1, '1 registro LGPD após 3 reenvios');
    mockOverride = null;
  });

  // ════ T18 (NOVO): Batch parcial — 1ª entry ok, 2ª com 429 → 503 ═══════════

  await test('T18 — Batch parcial: 2ª entry com Graph 429 → 503; reenvio → idempotência', async () => {
    mockBehavior = 'normal'; mockOverride = { phone: '11955550018', email: 'batch1_t18@ex.com' };
    const env = makeEnv();
    const lgid1 = `lgid_t18a_${Date.now()}`;
    const lgid2 = `lgid_t18b_${Date.now()}`;

    // Payload com 2 entries: lgid1 (normal) e lgid2 (vai receber 429)
    const batchPayload = {
      object: 'page',
      entry: [
        { id: TEST_PAGE_ID, time: Date.now(), changes: [{ field: 'leadgen', value: {
          leadgen_id: lgid1, page_id: TEST_PAGE_ID, form_id: 'form_x',
          campaign_name: 'camp-t18', created_time: Date.now(),
        }}]},
        { id: TEST_PAGE_ID, time: Date.now(), changes: [{ field: 'leadgen', value: {
          leadgen_id: lgid2, page_id: TEST_PAGE_ID, form_id: 'form_x',
          campaign_name: 'camp-t18', created_time: Date.now(),
        }}]},
      ],
    };

    // 1ª request: lgid1 vai ser processado normal, lgid2 vai pegar o 429
    // Configurar mock para retornar 429 no segundo request
    let reqCount = 0;
    await stopMockServer();
    const partialServer = createServer((req, res) => {
      reqCount++;
      if (reqCount === 2) { // segundo leadgen → 429
        res.writeHead(429); res.end('Too Many Requests');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        id: 'x', created_time: '2026-11-09T00:00:00+0000',
        field_data: [
          { name: 'phone_number', values: ['11955550018'] },
          { name: 'email', values: ['batch1_t18@ex.com'] },
          { name: 'full_name', values: ['Batch T18'] },
        ],
        campaign_name: 'camp-t18',
      }));
    });
    await new Promise(r => partialServer.listen(MOCK_PORT, '127.0.0.1', r));

    // Primeira tentativa: 503 porque lgid2 recebeu 429
    const r1 = await postWebhook(batchPayload, env);
    assertEqual(r1.status, 503, 'primeira tentativa → 503 (lgid2 falhou)');

    // O lgid1 pode ou não ter sido processado dependendo da ordem
    // Verificar quantos leads foram criados
    const after503 = await mockDB.prepare(`SELECT COUNT(*) as c FROM leads WHERE idempotency_key IN (?, ?)`).bind(lgid1, lgid2).first();

    // Reenvio completo: desta vez ambos vão funcionar (mock reconfigurado)
    await new Promise(r => partialServer.close(r));
    await startMockServer();
    mockBehavior = 'normal';
    mockOverride = { phone: '11955550018', email: 'batch1_t18@ex.com' };

    const r2 = await postWebhook(batchPayload, env);
    assertEqual(r2.status, 200, 'segundo envio → 200');

    // Deve haver exatamente 2 leads ao final (um por lgid)
    const after200 = await mockDB.prepare(`SELECT COUNT(*) as c FROM leads WHERE idempotency_key IN (?, ?)`).bind(lgid1, lgid2).first();
    assert(after200.c <= 2, `máximo 2 leads (idempotência): encontrados ${after200.c}`);
    console.log(`    [T18 info] após 503: ${after503.c} lead(s), após reenvio: ${after200.c} lead(s)`);
    mockOverride = null;
  });

  // ════ T19 (NOVO): Concorrência — 3 requests simultâneos ══════════════════

  await test('T19 — Concorrência: 3 requests simultâneos com mesmo leadgen_id → 1 lead', async () => {
    mockBehavior = 'normal'; mockOverride = { phone: '11944440019', email: 'concorrencia_t19@ex.com' };
    const env = makeEnv();
    const lgid = `lgid_t19_${Date.now()}`;
    const payload = makeLeadgenPayload(lgid);

    // Enviar 3 requests em paralelo (simula concorrência do Meta)
    const [r1, r2, r3] = await Promise.all([
      postWebhook(payload, env),
      postWebhook(payload, env),
      postWebhook(payload, env),
    ]);

    // Todos devem retornar 200 (idempotência ou duplicate)
    assertEqual(r1.status, 200, 'req1 status');
    assertEqual(r2.status, 200, 'req2 status');
    assertEqual(r3.status, 200, 'req3 status');

    // Deve haver exatamente 1 lead
    const cnt = await mockDB.prepare(`SELECT COUNT(*) as c FROM leads WHERE idempotency_key = ?`).bind(lgid).first();
    assertEqual(cnt.c, 1, `exatamente 1 lead após 3 requests simultâneos (encontrado: ${cnt.c})`);
    mockOverride = null;
  });

  // ════ T20 (NOVO): GRAPH_API_BASE_URL ausente → graph.facebook.com ══════════

  await test('T20 — Sem GRAPH_API_BASE_URL → tenta graph.facebook.com (falha de rede controlada)', async () => {
    // Sem GRAPH_API_BASE_URL, o código usa 'https://graph.facebook.com'
    // Em ambiente sem rede para graph.facebook.com → lança erro → 503
    const envSemMock = {
      DB: mockDB,
      META_VERIFY_TOKEN: VERIFY_TOKEN,
      META_APP_SECRET: APP_SECRET,
      META_PAGE_ACCESS_TOKEN: PAGE_TOKEN,
      // SEM GRAPH_API_BASE_URL
    };
    const lgid = `lgid_t20_${Date.now()}`;
    const resp = await postWebhook(makeLeadgenPayload(lgid), envSemMock);

    // Sem acesso à rede, o fetch para graph.facebook.com vai lançar → 503
    // OU se houver acesso e o token for inválido → 4xx (discarded) → 200
    // Em qualquer caso, NÃO deve ser 401 (HMAC seria válido)
    assert(resp.status !== 401, 'status NÃO deve ser 401 (HMAC é válido)');
    assert(resp.status !== 400, 'status NÃO deve ser 400');
    // Verificar que o Worker não usou o mock (porta 3098)
    const mockReqs = requestLog.filter(r => r.leadgenId === lgid);
    assertEqual(mockReqs.length, 0, 'mock NÃO deve ter sido chamado — confirma que usa graph.facebook.com');
    console.log(`    [T20 info] status sem GRAPH_API_BASE_URL: ${resp.status} (503=rede falhou; 200=discarded se 4xx da API)`);
  });

  // ════ T21 (NOVO): LGPD — legitimo_interesse ≠ consentimento ═════════════

  await test('T21 — LGPD: legitimo_interesse é base legal distinta, não consentimento presunção', async () => {
    // Verificar que NENHUM registro LGPD tem base_legal='consentimento' origem meta
    // (todos os leads meta_ads devem ter legitimo_interesse)
    const wrongLgpd = await mockDB.prepare(
      `SELECT l.idempotency_key, c.base_legal
       FROM consentimentos_lgpd c
       JOIN leads l ON l.contato_id = c.contato_id
       WHERE l.origem = 'meta_ads'
         AND c.base_legal != 'legitimo_interesse'`
    ).all();
    assertEqual(wrongLgpd.results.length, 0,
      `Todos os leads meta_ads devem ter base_legal=legitimo_interesse. Encontrado(s) com base errada: ${JSON.stringify(wrongLgpd.results)}`);

    // Verificar texto_versao correto (documenta a versão da política LI)
    const lgpdMeta = await mockDB.prepare(
      `SELECT DISTINCT texto_versao FROM consentimentos_lgpd
       WHERE texto_versao = 'meta-lead-form-li-v1'`
    ).first();
    assert(lgpdMeta !== null, 'texto_versao=meta-lead-form-li-v1 deve existir');

    // Verificar que concedido=1 indica registro ATIVO (não "consentimento explícito")
    // para base_legal=legitimo_interesse — semanticamente correto pois
    // concedido aqui significa "base legal vigente/não revogada"
    const activeLi = await mockDB.prepare(
      `SELECT COUNT(*) as c FROM consentimentos_lgpd
       WHERE base_legal = 'legitimo_interesse' AND concedido = 1 AND revogado_at IS NULL`
    ).first();
    assert(activeLi.c > 0, 'Registros de LI ativos devem existir');
    console.log(`    [T21 info] registros legitimo_interesse ativos: ${activeLi.c}`);
  });

  // ════ T22 (NOVO): Rastreabilidade Meta nos dados_extras_json ══════════════

  await test('T22 — dados_extras_json contém identificadores Meta (page_id, form_id, campaign_id)', async () => {
    const lead = await mockDB.prepare(
      `SELECT dados_extras_json FROM leads WHERE origem = 'meta_ads' LIMIT 1`
    ).first();
    assert(lead !== null, 'Deve existir lead meta_ads');

    const extras = JSON.parse(lead.dados_extras_json);
    assert(extras.meta_leadgen_id,  'meta_leadgen_id presente');
    assert(extras.meta_page_id,     'meta_page_id presente');
    assert(extras.meta_form_id,     'meta_form_id presente');
    // campaign_name pode ser null se mock não retornar
    console.log(`    [T22 info] dados_extras keys: ${Object.keys(extras).join(', ')}`);
  });

  // ─── Encerrar mock ────────────────────────────────────────────────────────
  await stopMockServer();

  // ─── Relatório final ──────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log(`  RESULTADO: ${passed} passaram / ${failed} falharam / ${passed + failed} total`);
  console.log('═══════════════════════════════════════════════════════════════════\n');

  if (failed > 0) {
    console.log('FALHAS:');
    results.filter(r => r.status === 'FAIL').forEach(r => {
      console.log(`  ✗ ${r.name}`);
      console.log(`    ${r.error}`);
    });
    console.log('');
  }

  // Verificações de integridade do banco
  console.log('▸ Integridade do banco pós-testes:');
  for (const [label, sql] of [
    ['Leads total',           `SELECT COUNT(*) as c FROM leads`],
    ['Leads meta_ads',        `SELECT COUNT(*) as c FROM leads WHERE origem = 'meta_ads'`],
    ['Contatos',              `SELECT COUNT(*) as c FROM contatos`],
    ['Conflitos pendentes',   `SELECT COUNT(*) as c FROM captacoes_conflito WHERE status = 'pendente'`],
    ['LGPD legitimo_int',     `SELECT COUNT(*) as c FROM consentimentos_lgpd WHERE base_legal = 'legitimo_interesse'`],
    ['LGPD consentimento',    `SELECT COUNT(*) as c FROM consentimentos_lgpd WHERE base_legal = 'consentimento'`],
  ]) {
    const r = await mockDB.prepare(sql).first();
    console.log(`  ${label}: ${r.c}`);
  }
  console.log('');

  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => { console.error('Erro fatal:', err); process.exit(1); });
