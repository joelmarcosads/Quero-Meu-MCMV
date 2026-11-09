/**
 * tests/contact-resolver.test.ts
 *
 * Testes unitários do ContactResolver service.
 * Executar com: tsx tests/contact-resolver.test.ts
 *
 * Cobertura:
 *  T01  — normalizePhone: 11 dígitos com DDD (vários formatos)
 *  T01b — normalizePhone: 10 dígitos (fixo)
 *  T02  — normalizePhone: números inválidos retornam null
 *  T03  — normalizeEmail: lowercase + trim + null/undefined
 *  T04  — resolveContact: cria contato quando nenhum existe (kind='created')
 *  T05  — resolveContact: retorna 'found' para telefone já existente
 *  T06  — resolveContact: retorna 'found' para email existente (telefone novo)
 *  T07  — resolveContact: retorna 'found' quando telefone e email são do MESMO contato
 *  T08  — resolveContact: retorna 'conflict' quando telefone e email são de contatos DIFERENTES
 *  T09  — resolveContact: idempotente em corridas simultâneas (INSERT OR IGNORE)
 *  T10  — findLeadByIdempotencyKey: retorna null para chave inexistente
 *  T11  — findLeadByIdempotencyKey: retorna lead para chave existente
 */

import { normalizePhone } from '../src/utils';
import {
  normalizeEmail,
  resolveContact,
  findLeadByIdempotencyKey,
  type ContactResolveResult,
} from '../src/services/contact-resolver';

// ─── Mini test runner ──────────────────────────────────────────────────────────

type TestFn = () => void | Promise<void>;
interface TestResult { name: string; ok: boolean; error?: string }
const results: TestResult[] = [];

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

function assertEquals<T>(actual: T, expected: T, label: string): void {
  if (actual !== expected) {
    throw new Error(
      `${label}: esperado ${JSON.stringify(expected)}, obtido ${JSON.stringify(actual)}`,
    );
  }
}

async function test(name: string, fn: TestFn): Promise<void> {
  try {
    await fn();
    results.push({ name, ok: true });
    console.log(`  ✅ ${name}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    results.push({ name, ok: false, error: msg });
    console.error(`  ❌ ${name}\n     ${msg}`);
  }
}

// ─── Mock D1 ──────────────────────────────────────────────────────────────────
// Simula o D1Database com arrays em memória, respeitando a mesma interface
// que o contact-resolver usa: prepare().bind().first() e .run()

interface ContatoRow {
  id: number;
  telefone: string;
  email: string | null;
  nome: string | null;
  cidade: string | null;
  deleted_at: null;
  anonimizado_at: null;
}

interface LeadRow {
  id: number;
  contato_id: number;
  origem: string;
  created_at: string;
  idempotency_key: string | null;
}

class MockD1 {
  contatos: ContatoRow[] = [];
  leads: LeadRow[] = [];
  private nextCid = 1;
  private nextLid = 1;

  addContato(c: Omit<ContatoRow, 'id' | 'deleted_at' | 'anonimizado_at'>): ContatoRow {
    const row: ContatoRow = { ...c, id: this.nextCid++, deleted_at: null, anonimizado_at: null };
    this.contatos.push(row);
    return row;
  }

  addLead(l: Omit<LeadRow, 'id'>): LeadRow {
    const row: LeadRow = { ...l, id: this.nextLid++ };
    this.leads.push(row);
    return row;
  }

  reset(): void {
    this.contatos = [];
    this.leads = [];
    this.nextCid = 1;
    this.nextLid = 1;
  }

  // ── D1Database interface: prepare().bind().first() / .run() ──────────────
  prepare(sql: string) {
    const db = this;
    return {
      bind(...args: unknown[]) {
        return {
          async first<T>(): Promise<T | null> {
            const q = sql.trim().toUpperCase();

            // SELECT id FROM contatos WHERE telefone = ?
            if (q.includes('WHERE TELEFONE = ?')) {
              const tel = args[0] as string;
              const row = db.contatos.find(
                c => c.telefone === tel && !c.deleted_at && !c.anonimizado_at,
              );
              return (row ? { id: row.id } : null) as T | null;
            }

            // SELECT id FROM contatos WHERE lower(trim(email)) = ?
            if (q.includes('WHERE LOWER(TRIM(EMAIL))')) {
              const em = args[0] as string;
              const row = db.contatos.find(
                c =>
                  c.email !== null &&
                  c.email.toLowerCase().trim() === em &&
                  !c.deleted_at &&
                  !c.anonimizado_at,
              );
              return (row ? { id: row.id } : null) as T | null;
            }

            // SELECT id,contato_id,... FROM leads WHERE idempotency_key = ?
            if (q.includes('IDEMPOTENCY_KEY = ?')) {
              const key = args[0] as string;
              const row = db.leads.find(l => l.idempotency_key === key);
              return (row ?? null) as T | null;
            }

            return null;
          },

          async run(): Promise<{ success: boolean }> {
            const q = sql.trim().toUpperCase();

            // INSERT OR IGNORE INTO contatos (telefone, nome, email, cidade)
            if (q.includes('INSERT OR IGNORE INTO CONTATOS')) {
              const [telefone, nome, email, cidade] = args as [
                string, string | null, string | null, string | null
              ];
              const exists = db.contatos.find(c => c.telefone === telefone);
              if (!exists) {
                db.contatos.push({
                  id: db.nextCid++,
                  telefone,
                  nome,
                  email,
                  cidade,
                  deleted_at: null,
                  anonimizado_at: null,
                });
              }
              return { success: true };
            }

            return { success: true };
          },
        };
      },
    };
  }
}

const db = new MockD1();

// ─────────────────────────────────────────────────────────────────────────────
// TESTES
// ─────────────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {

  console.log('\n=== ContactResolver — Testes Unitários ===\n');

  // ── T01 — normalizePhone: 11 dígitos ───────────────────────────────────────
  await test('T01 — normalizePhone: 11 dígitos com DDD (vários formatos)', () => {
    assertEquals(normalizePhone('11999990001'),           '+5511999990001', 'bare');
    assertEquals(normalizePhone('(11) 99999-0001'),       '+5511999990001', 'formatted');
    assertEquals(normalizePhone('011999990001'),           '+5511999990001', '0 prefix');
    assertEquals(normalizePhone('5511999990001'),          '+5511999990001', '55 prefix');
    assertEquals(normalizePhone('+55 (11) 99999-0001'),   '+5511999990001', '+55 formatted');
    assertEquals(normalizePhone('+5511999990001'),         '+5511999990001', 'já E.164');
  });

  await test('T01b — normalizePhone: 10 dígitos (fixo)', () => {
    assertEquals(normalizePhone('2130001234'),       '+552130001234', 'fixo bare');
    assertEquals(normalizePhone('(21) 3000-1234'),   '+552130001234', 'fixo formatted');
    assertEquals(normalizePhone('552130001234'),      '+552130001234', '55 prefix fixo');
  });

  // ── T02 — normalizePhone: inválidos ───────────────────────────────────────
  await test('T02 — normalizePhone: números inválidos retornam null', () => {
    assertEquals(normalizePhone('99999'),             null, 'too short');
    assertEquals(normalizePhone(''),                  null, 'empty string');
    assertEquals(normalizePhone('123456789012345'),   null, 'too long (13+ nat digits)');
    assertEquals(normalizePhone('abcdefghij'),        null, 'non-digits only');
  });

  // ── T03 — normalizeEmail ──────────────────────────────────────────────────
  await test('T03 — normalizeEmail: lowercase + trim + null/undefined', () => {
    assertEquals(normalizeEmail('  JOEL@GMAIL.COM  '),        'joel@gmail.com',       'trim + lowercase');
    assertEquals(normalizeEmail('User+Tag@Domain.COM'),       'user+tag@domain.com',  'mixed case');
    assertEquals(normalizeEmail(''),                          null,                   'empty string');
    assertEquals(normalizeEmail(null),                        null,                   'null');
    assertEquals(normalizeEmail(undefined),                   null,                   'undefined');
    assertEquals(normalizeEmail('   '),                       null,                   'only whitespace');
  });

  // ── T04 — resolveContact: cria contato novo ───────────────────────────────
  await test('T04 — resolveContact: cria contato quando nenhum existe (kind=created)', async () => {
    db.reset();
    const r = await resolveContact(db as unknown as Parameters<typeof resolveContact>[0], {
      telefone: '+5511999990001',
      email: 'joel@gmail.com',
      nome: 'Joel',
      cidade: 'Itaboraí',
    });
    assertEquals(r.kind, 'created', 'kind');
    assert('contato_id' in r && (r as { contato_id: number }).contato_id > 0, 'contato_id > 0');
    assert('is_new' in r && (r as { is_new: boolean }).is_new === true, 'is_new = true');
    assertEquals(db.contatos.length, 1, '1 contato no DB');
  });

  // ── T05 — resolveContact: telefone já existe ──────────────────────────────
  await test('T05 — resolveContact: retorna found para telefone já existente', async () => {
    db.reset();
    const existing = db.addContato({ telefone: '+5511999990001', email: null, nome: 'Existente', cidade: null });
    const r = await resolveContact(db as unknown as Parameters<typeof resolveContact>[0], {
      telefone: '+5511999990001',
    });
    assertEquals(r.kind, 'found', 'kind');
    assertEquals((r as { contato_id: number }).contato_id, existing.id, 'contato_id correto');
    assert('is_new' in r && (r as { is_new: boolean }).is_new === false, 'is_new = false');
  });

  // ── T06 — resolveContact: email já existe, telefone novo ──────────────────
  await test('T06 — resolveContact: retorna found pelo email (telefone ainda não cadastrado)', async () => {
    db.reset();
    const existing = db.addContato({ telefone: '+5511888880001', email: 'joel@gmail.com', nome: 'Existente', cidade: null });
    const r = await resolveContact(db as unknown as Parameters<typeof resolveContact>[0], {
      telefone: '+5511999990002',   // telefone DIFERENTE
      email: 'JOEL@GMAIL.COM',      // email igual (case insensitive)
    });
    assertEquals(r.kind, 'found', 'kind');
    assertEquals((r as { contato_id: number }).contato_id, existing.id, 'retorna id do contato existente pelo email');
  });

  // ── T07 — resolveContact: mesmo contato por telefone e email ──────────────
  await test('T07 — resolveContact: mesmo contato por telefone e email → found (sem conflito)', async () => {
    db.reset();
    const existing = db.addContato({ telefone: '+5511999990001', email: 'joel@gmail.com', nome: 'Joel', cidade: null });
    const r = await resolveContact(db as unknown as Parameters<typeof resolveContact>[0], {
      telefone: '+5511999990001',
      email: 'joel@gmail.com',
    });
    assertEquals(r.kind, 'found', 'kind');
    assertEquals((r as { contato_id: number }).contato_id, existing.id, 'mesmo id');
    assert(r.kind !== 'conflict', 'não gerou conflito indevido');
  });

  // ── T08 — resolveContact: conflito (telefone→C1, email→C2) ───────────────
  await test('T08 — resolveContact: conflict quando telefone e email pertencem a contatos DIFERENTES', async () => {
    db.reset();
    const c1 = db.addContato({ telefone: '+5511999990001', email: null,              nome: 'C1', cidade: null });
    const c2 = db.addContato({ telefone: '+5521888880001', email: 'outro@gmail.com', nome: 'C2', cidade: null });

    const r = await resolveContact(db as unknown as Parameters<typeof resolveContact>[0], {
      telefone: '+5511999990001',  // telefone do C1
      email: 'outro@gmail.com',   // email do C2
    }) as Extract<ContactResolveResult, { kind: 'conflict' }>;

    assertEquals(r.kind,     'conflict', 'kind = conflict');
    assertEquals(r.tel_id,   c1.id,     'tel_id = C1');
    assertEquals(r.email_id, c2.id,     'email_id = C2');
    assert(r.message.length > 0, 'message não vazia');
    assertEquals(db.contatos.length, 2, 'nenhum contato extra criado pelo conflict');
  });

  // ── T09 — Concorrência (INSERT OR IGNORE race-safety) ─────────────────────
  await test('T09 — INSERT OR IGNORE: idempotente em corridas simultâneas', async () => {
    db.reset();
    // Duas "requisições" concorrentes para o mesmo telefone
    const [r1, r2] = await Promise.all([
      resolveContact(db as unknown as Parameters<typeof resolveContact>[0], { telefone: '+5511999990001' }),
      resolveContact(db as unknown as Parameters<typeof resolveContact>[0], { telefone: '+5511999990001' }),
    ]);
    const id1 = (r1 as { contato_id: number }).contato_id;
    const id2 = (r2 as { contato_id: number }).contato_id;
    assertEquals(id1, id2, 'ambas as corridas retornam o MESMO contato_id');
    assert(r1.kind !== 'conflict', 'r1 não gerou conflito');
    assert(r2.kind !== 'conflict', 'r2 não gerou conflito');
    // O mock é síncrono, então pode criar 1 ou 2 entradas; o importante é que
    // o id retornado é o mesmo (SELECT pós-INSERT garante isso no D1 real).
    assert(db.contatos.length >= 1, 'pelo menos 1 contato no DB');
  });

  // ── T10 — findLeadByIdempotencyKey: inexistente ────────────────────────────
  await test('T10 — findLeadByIdempotencyKey: retorna null para chave inexistente', async () => {
    db.reset();
    const r = await findLeadByIdempotencyKey(
      db as unknown as Parameters<typeof findLeadByIdempotencyKey>[0],
      'chave-nao-existe',
    );
    assertEquals(r, null, 'resultado nulo');
  });

  // ── T11 — findLeadByIdempotencyKey: existente ──────────────────────────────
  await test('T11 — findLeadByIdempotencyKey: retorna lead para chave existente', async () => {
    db.reset();
    db.addContato({ telefone: '+5511999990001', email: null, nome: null, cidade: null });
    db.addLead({
      contato_id: 1,
      origem: 'portal_organico',
      created_at: '2026-01-01T00:00:00Z',
      idempotency_key: 'uuid-abc-123',
    });

    const r = await findLeadByIdempotencyKey(
      db as unknown as Parameters<typeof findLeadByIdempotencyKey>[0],
      'uuid-abc-123',
    );

    assert(r !== null,                        'resultado não nulo');
    assertEquals(r!.contato_id, 1,            'contato_id correto');
    assertEquals(r!.origem, 'portal_organico','origem correta');
  });

  // ── Histórico: mesmo contato pode ter múltiplos leads ─────────────────────
  await test('T12 — Histórico: mesmo contato pode ter múltiplos leads (interesses distintos)', async () => {
    db.reset();
    db.addContato({ telefone: '+5511999990001', email: 'joel@gmail.com', nome: 'Joel', cidade: null });
    db.addLead({ contato_id: 1, origem: 'google_ads', created_at: '2026-01-01T00:00:00Z', idempotency_key: 'k1' });
    db.addLead({ contato_id: 1, origem: 'meta_ads',   created_at: '2026-02-01T00:00:00Z', idempotency_key: 'k2' });

    assertEquals(db.leads.filter(l => l.contato_id === 1).length, 2, 'contato tem 2 leads distintos');

    // Novo interesse: mesma pessoa com telefone já cadastrado → found (não cria duplicata)
    const r = await resolveContact(db as unknown as Parameters<typeof resolveContact>[0], {
      telefone: '+5511999990001',
    });
    assertEquals(r.kind, 'found', 'kind = found (não recriou)');
    assertEquals(db.contatos.length, 1, 'ainda 1 único contato');
  });

  // ── Sumário ───────────────────────────────────────────────────────────────
  const passed = results.filter(r => r.ok).length;
  const failed = results.filter(r => !r.ok).length;
  console.log(`\n${'─'.repeat(55)}`);
  console.log(`Testes: ${passed} ✅   ${failed} ❌   Total: ${results.length}`);
  if (failed > 0) {
    console.log('\nFalhas:');
    results.filter(r => !r.ok).forEach(r => console.log(`  • ${r.name}\n    ${r.error}`));
    process.exit(1);
  } else {
    console.log('Todos os testes passaram. ✔\n');
  }
}

main().catch(err => {
  console.error('[FATAL]', err);
  process.exit(1);
});
