/**
 * Market Imobi CRM — Fase 3 Etapa 4
 * Suite de testes E2E locais T10–T20: rota pública POST /api/v1/public/leads
 *
 * Cobertura:
 *   T10 — Submit válido com todos os campos                         → 201
 *   T11 — Submit duplicado (mesmo external_id)                     → 200 idempotent:true
 *   T12 — Honeypot ativado (website truthy)                        → 200 silencioso, sem lead
 *   T13 — Telefone inválido                                        → 422
 *   T14 — Sem consentimento LGPD                                   → 400
 *   T15 — external_id ausente                                      → 400
 *   T16 — empreendimento_slug válido                               → associa empreendimento_id
 *   T17 — empreendimento_slug inválido                             → lead criado sem empreendimento
 *   T18 — UTMs google / gclid                                      → origem = google_ads
 *   T19 — UTMs facebook/meta/instagram / fbclid                   → origem = meta_ads
 *   T20 — Sem UTMs                                                 → origem = portal_organico
 *   T21 — Leads duplicados por telefone                           → mesmo contato_id, novo lead
 *   T22 — Sanitização LGPD: IP no consentimento (3 octetos)       → formato correto
 *   T23 — CORS: origem permitida                                   → header Allow-Origin correto
 *   T24 — CORS: origem desconhecida                               → fallback domínio principal
 *
 * Estratégia: lógica de negócio isolada em funções JS puras + mock D1 em memória.
 * Nenhum dado real é criado. Nenhuma escrita no D1 remoto.
 *
 * Execução:
 *   node crm-worker/tests/t10_t20_public_leads.mjs
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS EXTRAÍDOS DO CÓDIGO DE PRODUÇÃO (réplicas isoladas para teste)
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

/** Replica exata de utils.ts sanitizeIp */
function sanitizeIp(ip) {
  if (!ip) return null;
  const parts = ip.split('.');
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.0.0`;
  const ipv6parts = ip.split(':');
  return ipv6parts.slice(0, 4).join(':') + '::/64';
}

/** Replica exata de public-leads.ts inferirOrigem */
function inferirOrigem(payload) {
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

/** Replica exata de public-leads.ts corsHeaders */
const ALLOWED_ORIGINS = [
  'https://queromeumcmv.com.br',
  'https://www.queromeumcmv.com.br',
  'http://localhost:5173',
  'http://localhost:4173',
  'http://127.0.0.1:5173',
];

function corsHeaders(origin) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK D1 — simula as tabelas contatos, leads, empreendimentos, consentimentos_lgpd
// Isolado por suite para garantir estado limpo em cada describe.
// ═══════════════════════════════════════════════════════════════════════════════

function createMockDb() {
  const contatos = new Map();      // telefone_e164 → { id, telefone, nome, email, cidade }
  const leads = new Map();         // idempotency_key → { id, contato_id, origem, ... }
  const leadsById = [];
  const empreendimentos = new Map(); // slug → { id, slug, nome }
  const consentimentos = [];

  let contatoSeq = 1;
  let leadSeq = 1;

  // Seed: empreendimento fictício
  empreendimentos.set('reserva-dos-passaros-2', {
    id: 1,
    slug: 'reserva-dos-passaros-2',
    nome: 'Reserva dos Pássaros 2 (Teste)',
  });

  return {
    contatos,
    leads,
    leadsById,
    empreendimentos,
    consentimentos,

    /**
     * Simula handlePublicLeads() com mock D1.
     * Retorna { status, body } equivalente ao Response HTTP.
     */
    handlePublicLeads(payload, originHeader = 'https://queromeumcmv.com.br', rawIp = '177.92.123.45') {
      const cors = corsHeaders(originHeader);

      // 1. Honeypot
      if (payload.website) {
        return { status: 200, body: { success: true }, cors };
      }

      // 2. Validação
      if (!payload.external_id?.trim()) {
        return { status: 400, body: { success: false, error: 'Campo obrigatório: external_id' }, cors };
      }
      if (!payload.whatsapp?.trim()) {
        return { status: 400, body: { success: false, error: 'Campo obrigatório: whatsapp' }, cors };
      }
      if (!payload.consentimento_lgpd) {
        return { status: 400, body: { success: false, error: 'Consentimento LGPD obrigatório' }, cors };
      }

      // 3. Normalizar telefone
      const telefone = normalizePhone(payload.whatsapp);
      if (!telefone) {
        return {
          status: 422,
          body: { success: false, error: `Telefone inválido: '${payload.whatsapp}'. Formato esperado: DDD + número (10 ou 11 dígitos)` },
          cors,
        };
      }

      // 4. Idempotência
      const idempotencyKey = payload.external_id.trim();
      const existingLead = leads.get(idempotencyKey);
      if (existingLead) {
        return { status: 200, body: { success: true, data: existingLead, idempotent: true }, cors };
      }

      // 5. Upsert contato
      if (!contatos.has(telefone)) {
        contatos.set(telefone, {
          id: contatoSeq++,
          telefone,
          nome: payload.nome?.trim() ?? null,
          email: payload.email?.trim() ?? null,
          cidade: payload.cidade?.trim() ?? null,
        });
      }
      const contato = contatos.get(telefone);

      // 6. Resolver empreendimento por slug (opcional)
      let empreendimentoId = null;
      if (payload.empreendimento_slug?.trim()) {
        const empr = empreendimentos.get(payload.empreendimento_slug.trim());
        if (empr) empreendimentoId = empr.id;
      }

      // 7. Inferir origem
      const origem = inferirOrigem(payload);

      // 8. IP sanitizado
      const ipSanitizado = sanitizeIp(rawIp);

      // 9. dados_extras_json
      const dadosExtrasJson = payload.dados_extras ? JSON.stringify(payload.dados_extras) : null;

      // 10. Inserir lead
      const lead = {
        id: leadSeq++,
        contato_id: contato.id,
        empreendimento_id: empreendimentoId,
        idempotency_key: idempotencyKey,
        origem,
        canal: 'portal_web',
        utm_source: payload.utm_source ?? null,
        utm_medium: payload.utm_medium ?? null,
        utm_campaign: payload.utm_campaign ?? null,
        gclid: payload.gclid ?? null,
        fbclid: payload.fbclid ?? null,
        meta_fbc: payload.meta_fbc ?? null,
        meta_fbp: payload.meta_fbp ?? null,
        ip_address: ipSanitizado,
        dados_extras_json: dadosExtrasJson,
        created_at: new Date().toISOString(),
      };
      leads.set(idempotencyKey, lead);
      leadsById.push(lead);

      // 11. Registrar consentimento (fire-and-forget simulado)
      consentimentos.push({
        contato_id: contato.id,
        tipo: 'contato_whatsapp',
        concedido: 1,
        canal: 'portal_web',
        texto_versao: 'v2026-11',
        base_legal: 'consentimento',
        ip_address: ipSanitizado,
        created_at: new Date().toISOString(),
      });

      return {
        status: 201,
        body: { success: true, data: { id: lead.id, origem: lead.origem }, idempotent: false },
        cors,
      };
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAYLOAD SINTÉTICO BASE — dados completamente fictícios
// ═══════════════════════════════════════════════════════════════════════════════

function payloadBase(overrides = {}) {
  return {
    external_id: `test-uuid-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    nome: 'Maria Fictícia dos Santos',
    whatsapp: '21987654321',
    email: 'maria.ficticia@example.invalid',
    cidade: 'Itaboraí',
    consentimento_lgpd: true,
    website: '',
    dados_extras: {
      quartos: '2 quartos',
      faixa: 'Faixa 2',
      renda: 'R$ 2.500 a 3.200',
      regime_trabalho: 'CLT',
      pagamento: 'FGTS + financiamento',
      primeira_compra: 'Sim',
      prazo: '3 a 6 meses',
      pagina: 'https://queromeumcmv.com.br/mcmv-itaborai',
      referrer: 'https://www.google.com',
    },
    ...overrides,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// T10 — Submit válido com todos os campos → 201
// ═══════════════════════════════════════════════════════════════════════════════

describe('T10 — Submit válido completo', () => {
  const db = createMockDb();

  test('T10.1: Payload completo retorna 201 com id e origem', () => {
    const result = db.handlePublicLeads(payloadBase({
      utm_source: undefined,
      utm_medium: undefined,
    }));

    assert.equal(result.status, 201, 'Status deve ser 201');
    assert.equal(result.body.success, true);
    assert.equal(result.body.idempotent, false);
    assert.ok(typeof result.body.data.id === 'number', 'data.id deve ser número');
    assert.equal(result.body.data.origem, 'portal_organico', 'Sem UTMs → portal_organico');
  });

  test('T10.2: Contato é criado no banco mock', () => {
    const tel = '+5521987654321';
    assert.ok(db.contatos.has(tel), `Contato com telefone ${tel} deve existir`);
  });

  test('T10.3: dados_extras_json é serializado corretamente', () => {
    const lead = db.leadsById[0];
    assert.ok(lead.dados_extras_json !== null, 'dados_extras_json não pode ser null');
    const parsed = JSON.parse(lead.dados_extras_json);
    assert.equal(parsed.quartos, '2 quartos');
    assert.equal(parsed.faixa, 'Faixa 2');
    assert.equal(parsed.renda, 'R$ 2.500 a 3.200');
  });

  test('T10.4: Consentimento LGPD é registrado', () => {
    assert.equal(db.consentimentos.length, 1, 'Um consentimento deve ser registrado');
    const c = db.consentimentos[0];
    assert.equal(c.texto_versao, 'v2026-11');
    assert.equal(c.tipo, 'contato_whatsapp');
    assert.equal(c.base_legal, 'consentimento');
    assert.equal(c.canal, 'portal_web');
  });

  test('T10.5: IP sanitizado (3 octetos) no lead e no consentimento', () => {
    const lead = db.leadsById[0];
    assert.equal(lead.ip_address, '177.92.0.0', 'IP deve ter últimos 2 octetos zerados');
    assert.equal(db.consentimentos[0].ip_address, '177.92.0.0');
  });

  test('T10.6: canal fixo = portal_web', () => {
    const lead = db.leadsById[0];
    assert.equal(lead.canal, 'portal_web');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T11 — Idempotência: mesmo external_id → 200 idempotent:true
// ═══════════════════════════════════════════════════════════════════════════════

describe('T11 — Idempotência por external_id', () => {
  const db = createMockDb();
  const extId = `idem-test-${Date.now()}`;

  test('T11.1: Primeira submissão → 201', () => {
    const result = db.handlePublicLeads(payloadBase({ external_id: extId }));
    assert.equal(result.status, 201);
    assert.equal(result.body.idempotent, false);
  });

  test('T11.2: Segunda submissão com mesmo external_id → 200 idempotent:true', () => {
    const result = db.handlePublicLeads(payloadBase({ external_id: extId }));
    assert.equal(result.status, 200, 'Status deve ser 200 (não 201)');
    assert.equal(result.body.idempotent, true, 'idempotent deve ser true');
    assert.ok(result.body.data, 'data deve estar presente (lead existente)');
  });

  test('T11.3: Apenas 1 lead criado após 2 submissões com mesma chave', () => {
    assert.equal(db.leadsById.length, 1, 'Apenas 1 lead deve existir no banco');
  });

  test('T11.4: Terceira submissão também retorna idempotent:true', () => {
    const result = db.handlePublicLeads(payloadBase({ external_id: extId }));
    assert.equal(result.body.idempotent, true);
    assert.equal(db.leadsById.length, 1, 'Ainda apenas 1 lead');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T12 — Honeypot ativado → 200 silencioso, sem lead criado
// ═══════════════════════════════════════════════════════════════════════════════

describe('T12 — Honeypot anti-spam', () => {
  const db = createMockDb();

  test('T12.1: website preenchido → 200 silencioso', () => {
    const result = db.handlePublicLeads(payloadBase({ website: 'https://spam.example.com' }));
    assert.equal(result.status, 200, 'Deve retornar 200 (não revelar filtro ao bot)');
    assert.equal(result.body.success, true, 'Body deve parecer sucesso para o bot');
    assert.equal(result.body.idempotent, undefined, 'Não deve ter campo idempotent');
    assert.equal(result.body.data, undefined, 'Não deve ter campo data');
  });

  test('T12.2: Nenhum lead criado quando honeypot ativo', () => {
    assert.equal(db.leadsById.length, 0, 'Nenhum lead deve ter sido criado');
  });

  test('T12.3: Nenhum contato criado quando honeypot ativo', () => {
    assert.equal(db.contatos.size, 0, 'Nenhum contato deve ter sido criado');
  });

  test('T12.4: Nenhum consentimento registrado quando honeypot ativo', () => {
    assert.equal(db.consentimentos.length, 0, 'Nenhum consentimento deve ter sido registrado');
  });

  test('T12.5: website = "" (string vazia) NÃO ativa honeypot', () => {
    const result = db.handlePublicLeads(payloadBase({ website: '' }));
    assert.equal(result.status, 201, 'String vazia não deve ativar honeypot');
  });

  test('T12.6: website ausente (undefined) NÃO ativa honeypot', () => {
    const p = payloadBase();
    delete p.website;
    const result = db.handlePublicLeads(p);
    assert.equal(result.status, 201, 'Ausência do campo não deve ativar honeypot');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T13 — Telefone inválido → 422
// ═══════════════════════════════════════════════════════════════════════════════

describe('T13 — Validação de telefone', () => {
  const db = createMockDb();

  // Telefones que passam na validação de presença mas falham na normalização → 422
  const telefonesInvalidos422 = [
    ['9876543',    '7 dígitos (curto demais)'],
    ['2222222',    '7 dígitos sem DDD'],
    ['123',        '3 dígitos'],
    ['abcdefghij', 'letras (não numérico)'],
  ];

  for (const [tel, desc] of telefonesInvalidos422) {
    test(`T13: "${tel}" (${desc}) → 422`, () => {
      const result = db.handlePublicLeads(payloadBase({ whatsapp: tel }));
      assert.equal(result.status, 422, `Telefone "${tel}" deve retornar 422`);
      assert.equal(result.body.success, false);
      assert.ok(result.body.error.includes('Telefone inválido'), 'Mensagem deve mencionar "Telefone inválido"');
    });
  }

  // Telefones vazios/ausentes: falham na validação de presença → 400 (antes da normalização)
  const telefonesInvalidos400 = [
    ['',    'string vazia'],
    ['   ', 'apenas espaços'],
  ];

  for (const [tel, desc] of telefonesInvalidos400) {
    test(`T13: "${tel}" (${desc}) → 400 (campo obrigatório)`, () => {
      const result = db.handlePublicLeads(payloadBase({ whatsapp: tel }));
      assert.equal(result.status, 400, `Telefone "${tel}" vazio deve retornar 400 (obrigatório)`);
      assert.equal(result.body.success, false);
    });
  }

  const telefonesValidos = [
    ['21987654321',    'celular 11 dígitos sem DDI'],
    ['2198765432',     'fixo 10 dígitos sem DDI'],
    ['(21) 98765-4321','formatação brasileira'],
    ['5521987654321',  'com DDI 55'],
    ['+5521987654321', 'E.164 completo'],
  ];

  for (const [tel, desc] of telefonesValidos) {
    test(`T13: "${tel}" (${desc}) → 201 (válido)`, () => {
      const result = db.handlePublicLeads(payloadBase({
        whatsapp: tel,
        external_id: `t13-valid-${tel.replace(/\D/g, '')}-${Math.random().toString(36).slice(2)}`,
      }));
      assert.equal(result.status, 201, `Telefone "${tel}" deve retornar 201`);
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// T14 — Sem consentimento LGPD → 400
// ═══════════════════════════════════════════════════════════════════════════════

describe('T14 — Consentimento LGPD obrigatório', () => {
  const db = createMockDb();

  test('T14.1: consentimento_lgpd = false → 400', () => {
    const result = db.handlePublicLeads(payloadBase({ consentimento_lgpd: false }));
    assert.equal(result.status, 400);
    assert.match(result.body.error, /Consentimento LGPD obrigatório/);
  });

  test('T14.2: consentimento_lgpd = null → 400', () => {
    const result = db.handlePublicLeads(payloadBase({ consentimento_lgpd: null }));
    assert.equal(result.status, 400);
  });

  test('T14.3: consentimento_lgpd ausente → 400', () => {
    const p = payloadBase();
    delete p.consentimento_lgpd;
    const result = db.handlePublicLeads(p);
    assert.equal(result.status, 400);
  });

  test('T14.4: consentimento_lgpd = true → 201', () => {
    const result = db.handlePublicLeads(payloadBase({ consentimento_lgpd: true }));
    assert.equal(result.status, 201);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T15 — external_id ausente ou vazio → 400
// ═══════════════════════════════════════════════════════════════════════════════

describe('T15 — external_id obrigatório', () => {
  const db = createMockDb();

  test('T15.1: external_id ausente → 400', () => {
    const p = payloadBase();
    delete p.external_id;
    const result = db.handlePublicLeads(p);
    assert.equal(result.status, 400);
    assert.match(result.body.error, /external_id/);
  });

  test('T15.2: external_id = "" → 400', () => {
    const result = db.handlePublicLeads(payloadBase({ external_id: '' }));
    assert.equal(result.status, 400);
  });

  test('T15.3: external_id = "   " (espaços) → 400', () => {
    const result = db.handlePublicLeads(payloadBase({ external_id: '   ' }));
    assert.equal(result.status, 400);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T16 — empreendimento_slug válido → associa empreendimento_id
// ═══════════════════════════════════════════════════════════════════════════════

describe('T16 — Slug de empreendimento válido', () => {
  const db = createMockDb();

  test('T16.1: slug válido → empreendimento_id = 1', () => {
    const result = db.handlePublicLeads(payloadBase({
      empreendimento_slug: 'reserva-dos-passaros-2',
    }));
    assert.equal(result.status, 201);
    const lead = db.leadsById[0];
    assert.equal(lead.empreendimento_id, 1, 'empreendimento_id deve ser 1');
  });

  test('T16.2: Verificar que empreendimento fictício existe no mock', () => {
    const empr = db.empreendimentos.get('reserva-dos-passaros-2');
    assert.ok(empr, 'Empreendimento deve existir no mock');
    assert.equal(empr.id, 1);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T17 — empreendimento_slug inválido → lead criado sem empreendimento
// ═══════════════════════════════════════════════════════════════════════════════

describe('T17 — Slug de empreendimento inválido', () => {
  const db = createMockDb();

  test('T17.1: slug inexistente → lead criado com empreendimento_id = null', () => {
    const result = db.handlePublicLeads(payloadBase({
      empreendimento_slug: 'empreendimento-que-nao-existe-xpto',
    }));
    assert.equal(result.status, 201, 'Lead deve ser criado mesmo com slug inválido');
    const lead = db.leadsById[0];
    assert.equal(lead.empreendimento_id, null, 'empreendimento_id deve ser null');
  });

  test('T17.2: empreendimento_slug ausente → lead criado com empreendimento_id = null', () => {
    const p = payloadBase();
    delete p.empreendimento_slug;
    const result = db.handlePublicLeads(p);
    assert.equal(result.status, 201);
    const lead = db.leadsById[1];
    assert.equal(lead.empreendimento_id, null);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T18 — UTMs Google / gclid → origem = google_ads
// ═══════════════════════════════════════════════════════════════════════════════

describe('T18 — Inferência de origem: google_ads', () => {
  const db = createMockDb();

  const casesGoogle = [
    [{ utm_source: 'google' },                                     'utm_source=google'],
    [{ utm_source: 'google', utm_medium: 'cpc' },                  'utm_source=google utm_medium=cpc'],
    [{ utm_source: 'Google' },                                     'utm_source=Google (case insensitive)'],
    [{ utm_source: 'google-ads' },                                 'utm_source=google-ads'],
    [{ gclid: 'Cj0KCQjwz8bABhDpARIsAKETC123ficticio456' },        'gclid presente (sem utm)'],
    [{ utm_source: 'google', gclid: 'Cj0KCQjwz8bABhDpARIs' },    'google + gclid'],
  ];

  for (const [overrides, desc] of casesGoogle) {
    test(`T18: ${desc} → origem = google_ads`, () => {
      const origem = inferirOrigem({ ...payloadBase(), ...overrides });
      assert.equal(origem, 'google_ads', `${desc} deveria resultar em google_ads`);
    });
  }

  test('T18.final: Lead criado com origem=google_ads é salvo corretamente', () => {
    const result = db.handlePublicLeads(payloadBase({
      utm_source: 'google',
      utm_medium: 'cpc',
      utm_campaign: 'mcmv-itaborai-2026',
      gclid: 'Cj0KCQjwz8bABhDpARIsAKETC123ficticio456',
    }));
    assert.equal(result.status, 201);
    assert.equal(result.body.data.origem, 'google_ads');
    const lead = db.leadsById[0];
    assert.equal(lead.utm_source, 'google');
    assert.equal(lead.gclid, 'Cj0KCQjwz8bABhDpARIsAKETC123ficticio456');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T19 — UTMs Facebook/Meta/Instagram / fbclid / meta_fbc → origem = meta_ads
// ═══════════════════════════════════════════════════════════════════════════════

describe('T19 — Inferência de origem: meta_ads', () => {
  const casesMeta = [
    [{ utm_source: 'facebook' },                                 'utm_source=facebook'],
    [{ utm_source: 'meta' },                                     'utm_source=meta'],
    [{ utm_source: 'instagram' },                                'utm_source=instagram'],
    [{ utm_source: 'Facebook' },                                 'utm_source=Facebook (case insensitive)'],
    [{ fbclid: 'AbCd1234ficticio' },                             'fbclid presente (sem utm)'],
    [{ meta_fbc: 'fb.1.1234567890.ficticio' },                  'meta_fbc presente'],
    [{ meta_fbp: 'fb.1.1234567890.0987654321' },                'meta_fbp presente'],
    [{ utm_source: 'facebook', fbclid: 'AbCd1234ficticio' },    'facebook + fbclid'],
  ];

  for (const [overrides, desc] of casesMeta) {
    test(`T19: ${desc} → origem = meta_ads`, () => {
      const origem = inferirOrigem({ ...payloadBase(), ...overrides });
      assert.equal(origem, 'meta_ads', `${desc} deveria resultar em meta_ads`);
    });
  }

  const db = createMockDb();

  test('T19.final: Lead criado com origem=meta_ads é salvo corretamente', () => {
    const result = db.handlePublicLeads(payloadBase({
      utm_source: 'facebook',
      utm_medium: 'cpc',
      utm_campaign: 'mcmv-sao-goncalo-meta-2026',
      fbclid: 'AbCd1234ficticio5678',
      meta_fbc: 'fb.1.1234567890.ficticio',
      meta_fbp: 'fb.1.1234567890.0987654321',
    }));
    assert.equal(result.status, 201);
    assert.equal(result.body.data.origem, 'meta_ads');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T20 — Sem UTMs → origem = portal_organico
// ═══════════════════════════════════════════════════════════════════════════════

describe('T20 — Inferência de origem: portal_organico / portal_pago', () => {
  const db = createMockDb();

  test('T20.1: Sem nenhuma UTM/tracking → portal_organico', () => {
    const origem = inferirOrigem({});
    assert.equal(origem, 'portal_organico');
  });

  test('T20.2: utm_source desconhecido sem medium → portal_organico', () => {
    const origem = inferirOrigem({ utm_source: 'email', utm_medium: 'newsletter' });
    assert.equal(origem, 'portal_organico', 'utm_source=email → portal_organico (não é pago)');
  });

  test('T20.3: utm_medium=cpc (sem source google/facebook) → portal_pago', () => {
    const origem = inferirOrigem({ utm_source: 'olx', utm_medium: 'cpc' });
    assert.equal(origem, 'portal_pago', 'cpc de portal diferente → portal_pago');
  });

  test('T20.4: utm_medium=ppc → portal_pago', () => {
    const origem = inferirOrigem({ utm_source: 'zap-imoveis', utm_medium: 'ppc' });
    assert.equal(origem, 'portal_pago');
  });

  test('T20.5: utm_medium=paid → portal_pago', () => {
    const origem = inferirOrigem({ utm_medium: 'paid' });
    assert.equal(origem, 'portal_pago');
  });

  test('T20.6: Lead orgânico criado com origem=portal_organico', () => {
    const result = db.handlePublicLeads(payloadBase());
    assert.equal(result.status, 201);
    assert.equal(result.body.data.origem, 'portal_organico');
  });

  test('T20.7: Origem preservada CHECK constraint (apenas origens válidas)', () => {
    // CHECK constraint do schema D1:
    const origensValidas = new Set([
      'portal_organico', 'portal_pago', 'google_ads', 'meta_ads',
      'whatsapp_direto', 'indicacao', 'marketplace_zap',
      'marketplace_viva', 'marketplace_olx', 'marketplace_facebook', 'outro',
    ]);
    const casos = [
      {}, // portal_organico
      { utm_source: 'google' }, // google_ads
      { utm_source: 'facebook' }, // meta_ads
      { utm_medium: 'cpc' }, // portal_pago
    ];
    for (const c of casos) {
      const origem = inferirOrigem(c);
      assert.ok(origensValidas.has(origem), `'${origem}' deve estar no CHECK constraint do schema`);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T21 — Leads duplicados por telefone → mesmo contato_id, novo lead
// ═══════════════════════════════════════════════════════════════════════════════

describe('T21 — Deduplicação de contato por telefone', () => {
  const db = createMockDb();

  test('T21.1: 3 leads com mesmo telefone (external_ids distintos) → 3 leads, 1 contato', () => {
    const tel = '21911112222';
    const extIds = [`dup-tel-001-${Date.now()}`, `dup-tel-002-${Date.now()}`, `dup-tel-003-${Date.now()}`];

    for (const extId of extIds) {
      const result = db.handlePublicLeads(payloadBase({ whatsapp: tel, external_id: extId }));
      assert.equal(result.status, 201, `Lead ${extId} deve ser criado (201)`);
    }

    // Apenas 1 contato
    assert.equal(db.contatos.size, 1, '1 contato único para o mesmo telefone');

    // 3 leads distintos
    assert.equal(db.leadsById.length, 3, '3 leads distintos');

    // Todos apontam para o mesmo contato_id
    const contatoId = db.contatos.get('+5521911112222').id;
    assert.ok(
      db.leadsById.every(l => l.contato_id === contatoId),
      'Todos os leads devem ter o mesmo contato_id',
    );
  });

  test('T21.2: Telefones diferentes → contatos distintos', () => {
    const db2 = createMockDb();
    const tels = ['21911110001', '21911110002', '21911110003'];

    for (const tel of tels) {
      db2.handlePublicLeads(payloadBase({
        whatsapp: tel,
        external_id: `diff-tel-${tel}-${Date.now()}`,
      }));
    }

    assert.equal(db2.contatos.size, 3, '3 contatos para 3 telefones distintos');
    assert.equal(db2.leadsById.length, 3, '3 leads distintos');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T22 — Sanitização LGPD: IP no consentimento (3 octetos)
// ═══════════════════════════════════════════════════════════════════════════════

describe('T22 — LGPD: sanitização de IP', () => {
  test('T22.1: IPv4 → últimos 2 octetos zerados', () => {
    assert.equal(sanitizeIp('177.92.123.45'), '177.92.0.0');
    assert.equal(sanitizeIp('192.168.1.100'), '192.168.0.0');
    assert.equal(sanitizeIp('10.0.0.1'),      '10.0.0.0');
    assert.equal(sanitizeIp('8.8.8.8'),        '8.8.0.0');
  });

  test('T22.2: IPv6 → 4 primeiros blocos + ::/64', () => {
    const result = sanitizeIp('2001:db8:85a3:0:0:8a2e:370:7334');
    assert.ok(result.endsWith('::/64'), `Deve terminar com ::/64, recebeu: ${result}`);
    assert.ok(result.startsWith('2001:db8:85a3:0'), `Deve preservar primeiros 4 blocos`);
  });

  test('T22.3: IP null → null (cliente sem header CF-Connecting-IP)', () => {
    assert.equal(sanitizeIp(null), null);
  });

  test('T22.4: IP sanitizado é o que entra no banco (não o IP real)', () => {
    const db = createMockDb();
    const result = db.handlePublicLeads(payloadBase(), 'https://queromeumcmv.com.br', '200.150.200.100');
    assert.equal(result.status, 201);
    const lead = db.leadsById[0];
    assert.equal(lead.ip_address, '200.150.0.0', 'Deve armazenar IP sanitizado, não o real');
    assert.notEqual(lead.ip_address, '200.150.200.100', 'IP real NÃO deve ser armazenado');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T23 — CORS: origem permitida
// ═══════════════════════════════════════════════════════════════════════════════

describe('T23 — CORS: origens permitidas', () => {
  const origensPermitidas = [
    ['https://queromeumcmv.com.br',     'domínio principal'],
    ['https://www.queromeumcmv.com.br', 'subdomínio www'],
    ['http://localhost:5173',           'dev Vite local'],
    ['http://localhost:4173',           'dev Vite preview'],
    ['http://127.0.0.1:5173',          'dev Vite 127.0.0.1'],
  ];

  for (const [origin, desc] of origensPermitidas) {
    test(`T23: ${desc} → Allow-Origin = "${origin}"`, () => {
      const headers = corsHeaders(origin);
      assert.equal(
        headers['Access-Control-Allow-Origin'],
        origin,
        `Allow-Origin deve refletir a origem solicitada`,
      );
    });
  }

  test('T23: Allow-Methods inclui POST e OPTIONS', () => {
    const headers = corsHeaders('https://queromeumcmv.com.br');
    assert.ok(headers['Access-Control-Allow-Methods'].includes('POST'));
    assert.ok(headers['Access-Control-Allow-Methods'].includes('OPTIONS'));
  });

  test('T23: Vary: Origin está presente', () => {
    const headers = corsHeaders('https://queromeumcmv.com.br');
    assert.equal(headers['Vary'], 'Origin');
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// T24 — CORS: origem desconhecida → fallback domínio principal
// ═══════════════════════════════════════════════════════════════════════════════

describe('T24 — CORS: origem desconhecida cai para fallback', () => {
  const origensDesconhecidas = [
    'https://outro-site.com.br',
    'https://malicious-domain.example',
    'http://localhost:3000',
    null,
    undefined,
    '',
  ];

  for (const origin of origensDesconhecidas) {
    test(`T24: origin="${origin}" → Allow-Origin = domínio principal (fallback)`, () => {
      const headers = corsHeaders(origin);
      assert.equal(
        headers['Access-Control-Allow-Origin'],
        'https://queromeumcmv.com.br',
        `Origem desconhecida deve cair para o domínio principal`,
      );
    });
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// RESUMO: Contagem de testes por categoria
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n📋 Suite T10–T24: Rota Pública POST /api/v1/public/leads (Fase 3 Etapa 4)');
console.log('   Sem dados reais. Sem escrita no D1 remoto. Lógica isolada em memória.\n');
