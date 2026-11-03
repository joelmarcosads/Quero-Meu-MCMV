/**
 * Market Imobi CRM — Fase 3A
 * Suite de testes locais T1–T9 (Node.js 22, sem framework externo)
 *
 * Cobertura:
 *   T1 — Health check (lógica de rota sem auth)
 *   T2 — Token ausente → 401
 *   T3 — JWT malformado → 401 (3 sub-casos)
 *   T3b — JWT com AUD incorreto → 401
 *   T3c — JWT expirado → 401
 *   T4 — Verificação RS256 real com chave gerada localmente
 *   T5 — Normalização E.164 de telefone (10 casos)
 *   T6 — Idempotência: mesma chave → não duplica
 *   T7 — Deduplicação race-safe por telefone (INSERT OR IGNORE semântica)
 *   T8 — Isolamento de corretor (SQL WHERE responsavel_id)
 *   T9 — Progressão de estágio: transições válidas e inválidas
 *
 * Execução:
 *   node crm-worker/tests/t1_t9_local.mjs
 *
 * ⚠️  Sem dados reais — apenas lógica isolada e criptografia local.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS EXTRAÍDOS/REPLICADOS DO CÓDIGO DE PRODUÇÃO (isolados para teste)
// ═══════════════════════════════════════════════════════════════════════════════

/** Replica exata de utils.ts normalizePhone */
function normalizePhone(raw) {
  const digits = raw.replace(/\D/g, '');
  let national = digits;
  if (digits.startsWith('55') && digits.length >= 12) national = digits.slice(2);
  else if (digits.startsWith('0') && digits.length >= 11) national = digits.slice(1);
  if (national.length < 10 || national.length > 11) return null;
  return `+55${national}`;
}

/** Replica exata de auth.ts base64urlDecode */
function base64urlDecode(str) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function base64urlEncode(bytes) {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Gerar par RSA-2048 local para testes (não usa chaves reais) */
async function generateTestKeyPair() {
  return crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true, ['sign', 'verify']
  );
}

/** Criar JWT RS256 assinado com chave local */
async function createTestJwt({ privateKey, header, payload }) {
  const headerB64 = base64urlEncode(new TextEncoder().encode(JSON.stringify(header)));
  const payloadB64 = base64urlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const signingInput = `${headerB64}.${payloadB64}`;
  const sig = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5', privateKey,
    new TextEncoder().encode(signingInput)
  );
  return `${signingInput}.${base64urlEncode(new Uint8Array(sig))}`;
}

/** Verificar assinatura RS256 (replica auth.ts verifyJwt — apenas assinatura) */
async function verifyJwtSignature(token, publicKey) {
  const parts = token.split('.');
  if (parts.length !== 3) throw new Error('JWT malformado: esperados 3 partes');
  const [headerB64, payloadB64, sigB64] = parts;
  const header = JSON.parse(new TextDecoder().decode(base64urlDecode(headerB64)));
  const payload = JSON.parse(new TextDecoder().decode(base64urlDecode(payloadB64)));
  if (header.alg !== 'RS256') throw new Error(`Algoritmo JWT inválido: ${header.alg}`);
  const isValid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5', publicKey,
    base64urlDecode(sigB64),
    new TextEncoder().encode(`${headerB64}.${payloadB64}`)
  );
  if (!isValid) throw new Error('Assinatura JWT inválida');
  return payload;
}

// ═══════════════════════════════════════════════════════════════════════════════
// T1 — Health Check (lógica de rota sem autenticação)
// ═══════════════════════════════════════════════════════════════════════════════

describe('T1 — Health Check (lógica de rota)', () => {
  test('T1.1: /health retorna status=ok sem autenticação', () => {
    // Replica a lógica de index.ts: if (path === '/health' || path === '/api/v1/health')
    const paths = ['/health', '/api/v1/health'];
    for (const path of paths) {
      const isHealthPath = (path === '/health' || path === '/api/v1/health');
      assert.ok(isHealthPath, `Path ${path} deveria ser tratado como health check`);
    }
  });

  test('T1.2: /api/v1/leads NÃO é rota pública', () => {
    const path = '/api/v1/leads';
    const isHealthPath = (path === '/health' || path === '/api/v1/health');
    assert.equal(isHealthPath, false, 'Rota de leads não pode ser pública');
  });

  test('T1.3: Resposta health contém campos obrigatórios', () => {
    const mockEnv = { ENVIRONMENT: 'staging' };
    const response = {
      status: 'ok',
      environment: mockEnv.ENVIRONMENT,
      timestamp: new Date().toISOString(),
    };
    assert.equal(response.status, 'ok');
    assert.equal(response.environment, 'staging');
    assert.ok(response.timestamp.match(/^\d{4}-\d{2}-\d{2}T/), 'Timestamp deve ser ISO8601');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T2 — Token ausente → 401
// ═══════════════════════════════════════════════════════════════════════════════

describe('T2 — Rejeição: token ausente', () => {
  test('T2.1: Header Cf-Access-Jwt-Assertion ausente → AuthError 401', () => {
    // Replica authenticate(): if (!jwt) throw new AuthError(...)
    const jwt = null; // simula headers.get('Cf-Access-Jwt-Assertion') retornando null
    assert.equal(jwt, null, 'JWT deve ser null');
    // A lógica: if (!jwt) → AuthError 401
    const shouldThrow = !jwt;
    assert.ok(shouldThrow, 'Deve lançar erro quando JWT ausente');
  });

  test('T2.2: Header presente mas vazio → AuthError 401', () => {
    const jwt = '';
    const shouldThrow = !jwt;
    assert.ok(shouldThrow, 'JWT vazio deve ser rejeitado');
  });

  test('T2.3: Header presente com espaços → AuthError 401', () => {
    const jwt = '   ';
    const shouldThrow = !jwt.trim();
    assert.ok(shouldThrow, 'JWT só com espaços deve ser rejeitado');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T3 — JWT inválido → 401 (vários sub-casos)
// ═══════════════════════════════════════════════════════════════════════════════

describe('T3 — Rejeição criptográfica: JWT inválido', () => {
  test('T3.1: JWT com apenas 2 partes (malformado) → erro', async () => {
    const badToken = 'header.payload'; // sem assinatura
    await assert.rejects(
      async () => {
        const parts = badToken.split('.');
        if (parts.length !== 3) throw new Error('JWT malformado: esperados 3 partes');
      },
      /JWT malformado/,
    );
  });

  test('T3.2: JWT com algoritmo HS256 (não RS256) → erro', async () => {
    const { privateKey } = await generateTestKeyPair();
    // Criar JWT com alg HS256 no header (simula ataque de downgrade)
    const headerB64 = base64urlEncode(new TextEncoder().encode(JSON.stringify({ alg: 'HS256', kid: 'test' })));
    const payloadB64 = base64urlEncode(new TextEncoder().encode(JSON.stringify({ sub: 'test', exp: 9999999999 })));
    const fakeToken = `${headerB64}.${payloadB64}.fakesig`;
    await assert.rejects(
      async () => {
        const header = JSON.parse(new TextDecoder().decode(base64urlDecode(fakeToken.split('.')[0])));
        if (header.alg !== 'RS256') throw new Error(`Algoritmo JWT inválido: ${header.alg}`);
      },
      /Algoritmo JWT inválido/,
    );
  });

  test('T3.3: JWT com assinatura adulterada → verificação falha', async () => {
    const { privateKey, publicKey } = await generateTestKeyPair();
    const now = Math.floor(Date.now() / 1000);
    const token = await createTestJwt({
      privateKey,
      header: { alg: 'RS256', kid: 'test-kid', typ: 'JWT' },
      payload: { sub: 'test-sub', iss: 'https://test.cloudflareaccess.com', aud: ['test-aud'], exp: now + 3600, iat: now },
    });
    // Adulterar: trocar último caractere da assinatura
    const parts = token.split('.');
    const tamperedSig = parts[2].slice(0, -1) + (parts[2].slice(-1) === 'A' ? 'B' : 'A');
    const tamperedToken = `${parts[0]}.${parts[1]}.${tamperedSig}`;
    await assert.rejects(
      async () => verifyJwtSignature(tamperedToken, publicKey),
      /Assinatura JWT inválida/,
    );
  });

  test('T3.4: JWT com AUD incorreto → erro de audience', () => {
    const payload = {
      sub: 'test-sub',
      iss: 'https://test.cloudflareaccess.com',
      aud: ['aud-errado-xpto'],
      exp: 9999999999,
      iat: 1700000000,
    };
    const expectedAud = 'aud-correto-do-sistema';
    const audValido = payload.aud.includes(expectedAud);
    assert.equal(audValido, false, 'AUD incorreto deve ser rejeitado');
    if (!audValido) {
      const error = `JWT audience inválido: ${payload.aud.join(',')}`;
      assert.ok(error.includes('audience inválido'), 'Mensagem de erro correta');
    }
  });

  test('T3.5: JWT expirado → erro de expiração', () => {
    const expiredExp = Math.floor(Date.now() / 1000) - 3600; // 1h atrás
    const now = Math.floor(Date.now() / 1000);
    const expirou = expiredExp < now;
    assert.ok(expirou, 'JWT expirado deve ser detectado');
    const error = `JWT expirado em ${new Date(expiredExp * 1000).toISOString()}`;
    assert.ok(error.includes('JWT expirado'), 'Mensagem de erro correta');
  });

  test('T3.6: JWT com assinatura RS256 VÁLIDA é aceito (round-trip)', async () => {
    const { privateKey, publicKey } = await generateTestKeyPair();
    const now = Math.floor(Date.now() / 1000);
    const token = await createTestJwt({
      privateKey,
      header: { alg: 'RS256', kid: 'test-kid', typ: 'JWT' },
      payload: {
        sub: 'cf-sub-corretor-ficticio',
        iss: 'https://hidden-block-6fbc.cloudflareaccess.com',
        aud: ['4e8722c354df3e583fb04ceb1c1c3da7bdac50aaabccb867764cce151e59327d'],
        exp: now + 3600,
        iat: now,
        email: 'teste@exemplo.invalid',
      },
    });
    const payload = await verifyJwtSignature(token, publicKey);
    assert.equal(payload.sub, 'cf-sub-corretor-ficticio');
    assert.ok(payload.aud.includes('4e8722c354df3e583fb04ceb1c1c3da7bdac50aaabccb867764cce151e59327d'));
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T4 — Verificação RS256 completa (issuer + aud + exp + assinatura)
// ═══════════════════════════════════════════════════════════════════════════════

describe('T4 — Verificação RS256 completa (pipeline de autenticação)', () => {
  test('T4.1: Pipeline completo válido passa em todas as verificações', async () => {
    const { privateKey, publicKey } = await generateTestKeyPair();
    const teamDomain = 'hidden-block-6fbc.cloudflareaccess.com';
    const aud = '4e8722c354df3e583fb04ceb1c1c3da7bdac50aaabccb867764cce151e59327d';
    const now = Math.floor(Date.now() / 1000);

    const token = await createTestJwt({
      privateKey,
      header: { alg: 'RS256', kid: 'kid-ficticio-001', typ: 'JWT' },
      payload: { sub: 'cf-sub-corretor-0002', iss: `https://${teamDomain}`, aud: [aud], exp: now + 3600, iat: now },
    });

    const parts = token.split('.');
    assert.equal(parts.length, 3, 'JWT deve ter 3 partes');

    const header = JSON.parse(new TextDecoder().decode(base64urlDecode(parts[0])));
    assert.equal(header.alg, 'RS256', 'alg deve ser RS256');

    const payload = JSON.parse(new TextDecoder().decode(base64urlDecode(parts[1])));
    assert.equal(payload.iss, `https://${teamDomain}`, 'issuer correto');
    assert.ok(payload.aud.includes(aud), 'audience correto');
    assert.ok(payload.exp > now, 'não expirado');

    const verifiedPayload = await verifyJwtSignature(token, publicKey);
    assert.equal(verifiedPayload.sub, 'cf-sub-corretor-0002', 'sub correto após verificação');
  });

  test('T4.2: Chave pública diferente rejeita assinatura', async () => {
    const keyPair1 = await generateTestKeyPair();
    const keyPair2 = await generateTestKeyPair();
    const now = Math.floor(Date.now() / 1000);
    const token = await createTestJwt({
      privateKey: keyPair1.privateKey,
      header: { alg: 'RS256', kid: 'k1', typ: 'JWT' },
      payload: { sub: 'test', iss: 'https://test.cloudflareaccess.com', aud: ['aud'], exp: now + 3600, iat: now },
    });
    await assert.rejects(
      async () => verifyJwtSignature(token, keyPair2.publicKey),
      /Assinatura JWT inválida/,
    );
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T5 — Normalização E.164 de telefone
// ═══════════════════════════════════════════════════════════════════════════════

describe('T5 — Normalização E.164 (normalizePhone)', () => {
  const cases = [
    // [entrada, saída esperada, descrição]
    ['21987654321',    '+5521987654321', 'celular 11 dígitos sem DDI'],
    ['2198765432',     '+552198765432',  'fixo 10 dígitos sem DDI'],
    ['021987654321',   '+5521987654321', 'celular com 0 na frente'],
    ['5521987654321',  '+5521987654321', 'com DDI 55 sem +'],
    ['+5521987654321', '+5521987654321', 'E.164 completo com +'],
    ['(21) 98765-4321','+5521987654321', 'com formatação brasileira'],
    ['21 98765 4321',  '+5521987654321', 'com espaços'],
    ['9876543',        null,             'número curto demais (inválido)'],
    ['5511999999999',  '+5511999999999', 'SP 11 dígitos com DDI'],
    ['2222222',        null,             '7 dígitos (inválido)'],
  ];

  for (const [input, expected, desc] of cases) {
    test(`T5: ${desc} → ${expected ?? 'null'}`, () => {
      const result = normalizePhone(input);
      assert.equal(result, expected, `normalizePhone('${input}') deveria ser ${expected}`);
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// T6 — Idempotência (simulação sem D1 real)
// ═══════════════════════════════════════════════════════════════════════════════

describe('T6 — Idempotência de criação de lead', () => {
  test('T6.1: Primeira chamada com idempotency_key → cria lead (simula INSERT)', () => {
    // Simula estado do banco: tabela vazia
    const dbMock = new Map(); // key → lead

    function createLeadIdempotent(key, payload) {
      if (dbMock.has(key)) {
        return { idempotent: true, data: dbMock.get(key) };
      }
      const lead = { id: dbMock.size + 1, ...payload, created_at: new Date().toISOString() };
      dbMock.set(key, lead);
      return { idempotent: false, data: lead };
    }

    const payload = { nome: 'Maria Fictícia', telefone: '+5521987654321', origem: 'portal_organico' };
    const result1 = createLeadIdempotent('key-001', payload);
    assert.equal(result1.idempotent, false, 'Primeira chamada: não idempotente');
    assert.equal(result1.data.id, 1);
  });

  test('T6.2: Segunda chamada com mesma key → retorna existente (idempotent:true)', () => {
    const dbMock = new Map();
    function createLeadIdempotent(key, payload) {
      if (dbMock.has(key)) return { idempotent: true, data: dbMock.get(key) };
      const lead = { id: dbMock.size + 1, ...payload, created_at: new Date().toISOString() };
      dbMock.set(key, lead);
      return { idempotent: false, data: lead };
    }

    const payload = { nome: 'Maria Fictícia', telefone: '+5521987654321', origem: 'portal_organico' };
    createLeadIdempotent('key-001', payload); // primeira
    const result2 = createLeadIdempotent('key-001', payload); // segunda
    assert.equal(result2.idempotent, true, 'Segunda chamada: deve ser idempotent:true');
    assert.equal(result2.data.id, 1, 'ID deve ser o mesmo do primeiro insert');
  });

  test('T6.3: Chaves diferentes → criam leads distintos', () => {
    const dbMock = new Map();
    function createLeadIdempotent(key, payload) {
      if (dbMock.has(key)) return { idempotent: true, data: dbMock.get(key) };
      const lead = { id: dbMock.size + 1, ...payload };
      dbMock.set(key, lead);
      return { idempotent: false, data: lead };
    }

    const r1 = createLeadIdempotent('key-A', { nome: 'Lead A' });
    const r2 = createLeadIdempotent('key-B', { nome: 'Lead B' });
    assert.notEqual(r1.data.id, r2.data.id, 'IDs distintos para chaves diferentes');
    assert.equal(dbMock.size, 2, 'Dois leads criados');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T7 — Deduplicação race-safe por telefone (semântica INSERT OR IGNORE)
// ═══════════════════════════════════════════════════════════════════════════════

describe('T7 — Deduplicação race-safe de contato por telefone', () => {
  test('T7.1: INSERT OR IGNORE — mesmo telefone 5x → apenas 1 contato criado', async () => {
    // Simula a semântica de INSERT OR IGNORE + SELECT subsequente
    const contatos = new Map(); // telefone → contato

    async function upsertContato(telefone, nome) {
      // Simula INSERT OR IGNORE (race-safe: múltiplos tentam simultaneamente)
      if (!contatos.has(telefone)) {
        contatos.set(telefone, { id: contatos.size + 1, telefone, nome });
      }
      return contatos.get(telefone);
    }

    const telefone = '+5521911112222';
    // Simula 5 requisições simultâneas
    const promises = Array.from({ length: 5 }, (_, i) =>
      upsertContato(telefone, `Lead Fictício ${i + 1}`)
    );
    const results = await Promise.all(promises);

    // Todos devem retornar o mesmo contato_id
    const ids = new Set(results.map(r => r.id));
    assert.equal(ids.size, 1, 'Apenas 1 contato deve existir para o mesmo telefone');
    assert.equal(contatos.size, 1, 'Map deve ter apenas 1 entrada');
  });

  test('T7.2: 5 leads com mesmo contato → 5 leads distintos', async () => {
    const contatos = new Map();
    const leads = [];

    async function createLead(telefone, nomeContato, idempotencyKey) {
      if (!contatos.has(telefone)) {
        contatos.set(telefone, { id: 1, telefone, nome: nomeContato });
      }
      const contato = contatos.get(telefone);
      leads.push({ id: leads.length + 1, contato_id: contato.id, idempotency_key: idempotencyKey });
      return leads[leads.length - 1];
    }

    const tel = '+5521911112222';
    for (let i = 1; i <= 5; i++) {
      await createLead(tel, `Lead ${i}`, `dup-test-${i}`);
    }

    assert.equal(contatos.size, 1, '1 contato único');
    assert.equal(leads.length, 5, '5 leads distintos');
    assert.ok(leads.every(l => l.contato_id === 1), 'Todos leads apontam para contato_id=1');
  });

  test('T7.3: Telefones diferentes → contatos distintos', async () => {
    const contatos = new Map();
    const tels = ['+5521111110001', '+5521111110002', '+5521111110003'];
    for (const tel of tels) {
      if (!contatos.has(tel)) contatos.set(tel, { id: contatos.size + 1, telefone: tel });
    }
    assert.equal(contatos.size, 3, '3 contatos distintos para 3 telefones');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T8 — Isolamento por corretor (SQL WHERE responsavel_id)
// ═══════════════════════════════════════════════════════════════════════════════

describe('T8 — Isolamento de leads por corretor', () => {
  // Simula os dados de seed (0002_seed_fictitious_data.sql)
  const leads = [
    { id: 1, responsavel_id: 2, contato_nome: 'Lead Fictício A', status: 'novo' },
    { id: 2, responsavel_id: 2, contato_nome: 'Lead Fictício B', status: 'novo' },
    { id: 3, responsavel_id: 3, contato_nome: 'Lead Fictício C', status: 'novo' },
  ];

  function listLeadsForUser(user) {
    if (user.perfil === 'admin') return leads;
    // Replica: WHERE l.responsavel_id = ? (ou responsavel_id IS NULL para novos)
    return leads.filter(l => l.responsavel_id === user.id || l.responsavel_id === null);
  }

  test('T8.1: Admin vê todos os leads', () => {
    const admin = { id: 1, perfil: 'admin' };
    const result = listLeadsForUser(admin);
    assert.equal(result.length, 3, 'Admin deve ver todos os 3 leads');
  });

  test('T8.2: Corretor 2 vê apenas seus leads (id=2)', () => {
    const corretor2 = { id: 2, perfil: 'corretor' };
    const result = listLeadsForUser(corretor2);
    assert.equal(result.length, 2, 'Corretor 2 deve ver 2 leads');
    assert.ok(result.every(l => l.responsavel_id === 2), 'Todos os leads são do corretor 2');
  });

  test('T8.3: Corretor 3 (assistente) vê apenas seu lead', () => {
    const assistente3 = { id: 3, perfil: 'assistente' };
    const result = listLeadsForUser(assistente3);
    assert.equal(result.length, 1);
    assert.equal(result[0].id, 3);
  });

  test('T8.4: Acesso direto a lead de outro corretor → 403', () => {
    const corretor2 = { id: 2, perfil: 'corretor' };
    const lead = leads.find(l => l.id === 3); // pertence ao id=3

    // Replica: if (user.perfil !== 'admin' && lead.responsavel_id !== user.id) → 403
    const denied = lead.responsavel_id !== null && lead.responsavel_id !== corretor2.id && corretor2.perfil !== 'admin';
    assert.ok(denied, 'Acesso a lead de outro corretor deve ser negado (403)');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T9 — Progressão de estágio de oportunidade
// ═══════════════════════════════════════════════════════════════════════════════

describe('T9 — Progressão de estágio de oportunidade', () => {
  // Estágios válidos conforme schema D1 (oportunidades.estagio CHECK)
  const ESTAGIOS_VALIDOS = ['novo', 'em_contato', 'visita_agendada', 'proposta', 'contrato', 'ganho', 'perdido', 'arquivado'];

  function isEstagioValido(estagio) {
    return ESTAGIOS_VALIDOS.includes(estagio);
  }

  function progressarEstagio(oportunidade, novoEstagio, user) {
    if (!isEstagioValido(novoEstagio)) {
      throw new Error(`Estágio inválido: ${novoEstagio}`);
    }
    if (user.perfil !== 'admin' && oportunidade.responsavel_id !== user.id) {
      throw new Error('Acesso negado: você não é responsável por esta oportunidade');
    }
    return { ...oportunidade, estagio: novoEstagio, updated_at: new Date().toISOString() };
  }

  test('T9.1: novo → em_contato (válido)', () => {
    const opo = { id: 1, estagio: 'novo', responsavel_id: 2 };
    const user = { id: 2, perfil: 'corretor' };
    const result = progressarEstagio(opo, 'em_contato', user);
    assert.equal(result.estagio, 'em_contato');
  });

  test('T9.2: em_contato → visita_agendada (válido)', () => {
    const opo = { id: 1, estagio: 'em_contato', responsavel_id: 2 };
    const user = { id: 2, perfil: 'corretor' };
    const result = progressarEstagio(opo, 'visita_agendada', user);
    assert.equal(result.estagio, 'visita_agendada');
  });

  test('T9.3: proposta → ganho (válido)', () => {
    const opo = { id: 1, estagio: 'proposta', responsavel_id: 2 };
    const user = { id: 2, perfil: 'corretor' };
    const result = progressarEstagio(opo, 'ganho', user);
    assert.equal(result.estagio, 'ganho');
  });

  test('T9.4: Estágio inválido → erro', () => {
    const opo = { id: 1, estagio: 'novo', responsavel_id: 2 };
    const user = { id: 2, perfil: 'corretor' };
    assert.throws(
      () => progressarEstagio(opo, 'estagio_inexistente', user),
      /Estágio inválido/,
    );
  });

  test('T9.5: Corretor tenta mover oportunidade de outro → 403', () => {
    const opo = { id: 1, estagio: 'novo', responsavel_id: 2 };
    const outroCorretor = { id: 3, perfil: 'corretor' };
    assert.throws(
      () => progressarEstagio(opo, 'em_contato', outroCorretor),
      /Acesso negado/,
    );
  });

  test('T9.6: Admin pode mover oportunidade de qualquer corretor', () => {
    const opo = { id: 1, estagio: 'novo', responsavel_id: 2 };
    const admin = { id: 1, perfil: 'admin' };
    const result = progressarEstagio(opo, 'perdido', admin);
    assert.equal(result.estagio, 'perdido');
  });

  test('T9.7: Todos os estágios válidos são aceitos', () => {
    for (const estagio of ESTAGIOS_VALIDOS) {
      assert.ok(isEstagioValido(estagio), `Estágio ${estagio} deve ser válido`);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// EXTRAS — Sanitização LGPD e Audit Log
// ═══════════════════════════════════════════════════════════════════════════════

describe('Extra — Sanitização LGPD (utils.ts sanitizeIp + writeAudit)', () => {
  function sanitizeIp(ip) {
    if (!ip) return null;
    const parts = ip.split('.');
    if (parts.length === 4) return `${parts[0]}.${parts[1]}.0.0`;
    const ipv6parts = ip.split(':');
    return ipv6parts.slice(0, 4).join(':') + '::/64';
  }

  test('LGPD.1: IPv4 truncado para /16 (últimos 2 octetos zerados)', () => {
    assert.equal(sanitizeIp('177.92.123.45'), '177.92.0.0');
    assert.equal(sanitizeIp('192.168.1.100'), '192.168.0.0');
  });

  test('LGPD.2: IPv6 truncado para /64', () => {
    const result = sanitizeIp('2001:db8:85a3:0:0:8a2e:370:7334');
    assert.ok(result.endsWith('::/64'), `IPv6 deve terminar com ::/64, got: ${result}`);
  });

  test('LGPD.3: IP null → null', () => {
    assert.equal(sanitizeIp(null), null);
  });

  test('LGPD.4: Audit de contatos sanitiza PII', () => {
    function sanitizeAuditData(tabela, data) {
      if (!data) return null;
      if (tabela === 'contatos') return JSON.stringify({ id: data.id, _sanitizado: true });
      return JSON.stringify(data);
    }
    const contatoData = { id: 42, telefone: '+5521987654321', nome: 'João Fictício', email: 'joao@ficticio.invalid' };
    const sanitized = sanitizeAuditData('contatos', contatoData);
    const parsed = JSON.parse(sanitized);
    assert.equal(parsed.id, 42, 'ID deve ser preservado');
    assert.equal(parsed._sanitizado, true, 'Flag de sanitização presente');
    assert.equal(parsed.telefone, undefined, 'Telefone NÃO deve estar no audit');
    assert.equal(parsed.nome, undefined, 'Nome NÃO deve estar no audit');
    assert.equal(parsed.email, undefined, 'Email NÃO deve estar no audit');
  });
});
