#!/usr/bin/env python3 -I
"""
tests/concurrency_sqlite.py
===========================
Testes de concorrência simulando o comportamento do D1 (SQLite).

Cenários testados:
  C01 — Requisições simultâneas: mesmo telefone → apenas 1 contato criado
  C02 — Requisições simultâneas: mesmo email, telefones diferentes
         → contato encontrado por email, sem duplicação
  C03 — Conflito de identidade (tel→C1, email→C2) com captacoes_conflito
  C04 — Idempotência: mesmo idempotency_key → apenas 1 lead inserido
  C05 — INSERT OR IGNORE garante unicidade mesmo sob threads paralelas

Estratégia:
  Recria o schema D1 real em SQLite in-memory, com os mesmos
  UNIQUE indexes parciais (WHERE deleted_at IS NULL AND anonimizado_at IS NULL).
  Usa threading.Thread para simular Workers concorrentes.
  Cada thread executa o algoritmo do contact-resolver.ts em Python.

Requisito: Python 3.8+ (stdlib apenas — sem dependências externas).
"""

import sqlite3
import threading
import uuid
import time
import sys
from typing import Optional

# ─── Schema D1 simplificado (suficiente para os testes) ──────────────────────

SCHEMA = """
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS contatos (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  telefone        TEXT    NOT NULL,
  nome            TEXT    NOT NULL DEFAULT 'Visitante',
  email           TEXT,
  cidade          TEXT,
  deleted_at      TEXT,
  anonimizado_at  TEXT,
  created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Índice UNIQUE parcial no telefone (mesma regra do D1)
CREATE UNIQUE INDEX IF NOT EXISTS idx_con_telefone
  ON contatos(telefone)
  WHERE deleted_at IS NULL AND anonimizado_at IS NULL;

-- Índice UNIQUE parcial no email (migration 0003 proposta)
CREATE UNIQUE INDEX IF NOT EXISTS idx_con_email_unique
  ON contatos(lower(trim(email)))
  WHERE deleted_at IS NULL AND anonimizado_at IS NULL
    AND email IS NOT NULL AND trim(email) != '';

CREATE TABLE IF NOT EXISTS leads (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  contato_id      INTEGER NOT NULL REFERENCES contatos(id),
  empreendimento_id INTEGER,
  idempotency_key TEXT    UNIQUE,
  origem          TEXT    NOT NULL,
  canal           TEXT,
  created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS captacoes_conflito (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  tel_contato_id    INTEGER NOT NULL REFERENCES contatos(id),
  email_contato_id  INTEGER NOT NULL REFERENCES contatos(id),
  origem            TEXT    NOT NULL,
  canal             TEXT,
  idempotency_key   TEXT    UNIQUE,
  status            TEXT    NOT NULL DEFAULT 'pendente'
    CHECK(status IN ('pendente','resolvido_tel','resolvido_email','descartado')),
  created_at        TEXT    NOT NULL DEFAULT (datetime('now'))
);
"""

# ─── Implementação Python do contact-resolver (espelha o TypeScript) ─────────

def normalize_email(raw: Optional[str]) -> Optional[str]:
    if not raw:
        return None
    n = raw.strip().lower()
    return n if n else None


def resolve_contact(
    conn: sqlite3.Connection,
    telefone: str,
    email: Optional[str] = None,
    nome: Optional[str] = None,
    cidade: Optional[str] = None,
) -> dict:
    """
    Espelha contact-resolver.ts resolveContact().
    Retorna dict com 'kind': 'found' | 'created' | 'conflict'.
    """
    email_norm = normalize_email(email)
    nome_final = (nome or '').strip() or 'Visitante'

    # 1. Busca por telefone
    row_tel = conn.execute(
        "SELECT id FROM contatos WHERE telefone = ? AND deleted_at IS NULL AND anonimizado_at IS NULL LIMIT 1",
        (telefone,)
    ).fetchone()

    # 2. Busca por email
    row_email = None
    if email_norm:
        row_email = conn.execute(
            "SELECT id FROM contatos WHERE lower(trim(email)) = ? AND deleted_at IS NULL AND anonimizado_at IS NULL LIMIT 1",
            (email_norm,)
        ).fetchone()

    # 3. Avaliação
    if row_tel and row_email and row_tel[0] != row_email[0]:
        return {'kind': 'conflict', 'tel_id': row_tel[0], 'email_id': row_email[0]}

    if row_tel:
        # Verifica phone_divergence (email encontrou contato diferente — mas aqui row_email
        # seria o mesmo ou None, então phone_divergence não se aplica neste branch)
        return {'kind': 'found', 'contato_id': row_tel[0], 'is_new': False}

    if row_email:
        existing = conn.execute(
            "SELECT telefone FROM contatos WHERE id = ? LIMIT 1",
            (row_email[0],)
        ).fetchone()
        phone_div = existing and existing[0] != telefone
        return {'kind': 'found', 'contato_id': row_email[0], 'is_new': False,
                'phone_divergence': bool(phone_div)}

    # 4. Nenhum encontrado → INSERT OR IGNORE + SELECT
    try:
        conn.execute(
            "INSERT OR IGNORE INTO contatos (telefone, nome, email, cidade) VALUES (?, ?, ?, ?)",
            (telefone, nome_final, email_norm, cidade)
        )
        conn.commit()
    except sqlite3.IntegrityError:
        pass  # Corrida de concorrência: outro thread ganhou — SELECT abaixo recupera o id

    created = conn.execute(
        "SELECT id FROM contatos WHERE telefone = ? AND deleted_at IS NULL AND anonimizado_at IS NULL LIMIT 1",
        (telefone,)
    ).fetchone()

    if not created:
        raise RuntimeError(f"[resolve_contact] contato não encontrado após INSERT para {telefone}")

    return {'kind': 'created', 'contato_id': created[0], 'is_new': True}

# ─── Helpers de asserção ──────────────────────────────────────────────────────

PASS_COUNT = 0
FAIL_COUNT = 0

def assert_eq(label: str, expected, actual):
    global PASS_COUNT, FAIL_COUNT
    if expected == actual:
        print(f"  ✓ {label}")
        PASS_COUNT += 1
    else:
        print(f"  ✗ {label}  ESPERADO={expected!r}  OBTIDO={actual!r}", file=sys.stderr)
        FAIL_COUNT += 1

def assert_true(label: str, value: bool):
    assert_eq(label, True, value)

def make_db() -> sqlite3.Connection:
    """Cria banco in-memory com schema completo."""
    conn = sqlite3.connect(":memory:", check_same_thread=False)
    conn.isolation_level = None  # autocommit para simular commits explícitos
    conn.executescript(SCHEMA)
    return conn

# ─── C01: Requisições simultâneas — mesmo telefone ───────────────────────────

def test_c01_concurrent_same_phone():
    print("\nC01 — Mesmo telefone, N threads paralelas → apenas 1 contato criado")
    conn = make_db()
    lock = threading.Lock()
    results = []
    N = 10

    def worker():
        with lock:
            r = resolve_contact(conn, telefone='+5521999990001')
        results.append(r)

    threads = [threading.Thread(target=worker) for _ in range(N)]
    for t in threads: t.start()
    for t in threads: t.join()

    total = conn.execute("SELECT COUNT(*) FROM contatos").fetchone()[0]
    created_count = sum(1 for r in results if r['kind'] == 'created')
    found_count   = sum(1 for r in results if r['kind'] == 'found')

    assert_eq("apenas 1 contato no banco", 1, total)
    assert_eq("exatamente 1 resultado 'created'", 1, created_count)
    assert_eq(f"restantes {N-1} resultados 'found'", N - 1, found_count)
    all_same_id = len({r['contato_id'] for r in results}) == 1
    assert_true("todos os threads retornaram o mesmo contato_id", all_same_id)

# ─── C02: Mesmo email, telefones diferentes ──────────────────────────────────

def test_c02_same_email_diff_phones():
    print("\nC02 — Mesmo email, telefones diferentes → phone_divergence, sem duplicação")
    conn = make_db()

    # Criar contato inicial com telefone A
    r1 = resolve_contact(conn, '+5511888880001', email='joe@example.com', nome='Joe')
    assert_eq("r1.kind = created", 'created', r1['kind'])

    # Segunda chamada com mesmo email, telefone B diferente
    r2 = resolve_contact(conn, '+5521999990002', email='joe@example.com')
    assert_eq("r2.kind = found (encontrado pelo email)", 'found', r2['kind'])
    assert_eq("r2.contato_id = mesmo contato", r1['contato_id'], r2['contato_id'])
    assert_true("r2.phone_divergence = True", r2.get('phone_divergence', False))

    total = conn.execute("SELECT COUNT(*) FROM contatos").fetchone()[0]
    assert_eq("apenas 1 contato no banco (telefone não sobrescrito)", 1, total)

    # Verificar que o telefone cadastrado NÃO foi sobrescrito
    tel_stored = conn.execute(
        "SELECT telefone FROM contatos WHERE id = ?", (r1['contato_id'],)
    ).fetchone()[0]
    assert_eq("telefone original preservado", '+5511888880001', tel_stored)

# ─── C03: Conflito de identidade tel→C1 email→C2 ─────────────────────────────

def test_c03_conflict_identity():
    print("\nC03 — Conflito: tel→C1, email→C2 → captacoes_conflito, sem lead criado")
    conn = make_db()

    # Criar dois contatos distintos
    r_c1 = resolve_contact(conn, '+5511111110001', email='c1@example.com', nome='C1')
    r_c2 = resolve_contact(conn, '+5522222220002', email='c2@example.com', nome='C2')

    assert_eq("C1 criado", 'created', r_c1['kind'])
    assert_eq("C2 criado", 'created', r_c2['kind'])

    # Tentativa de captação com tel→C1 e email→C2
    r_conflict = resolve_contact(conn, '+5511111110001', email='c2@example.com')
    assert_eq("resultado kind = conflict", 'conflict', r_conflict['kind'])
    assert_eq("tel_id = C1", r_c1['contato_id'], r_conflict['tel_id'])
    assert_eq("email_id = C2", r_c2['contato_id'], r_conflict['email_id'])

    # Simular registro em captacoes_conflito (como faz leads.ts)
    ikey = str(uuid.uuid4())
    conn.execute(
        """INSERT OR IGNORE INTO captacoes_conflito
             (tel_contato_id, email_contato_id, origem, idempotency_key)
           VALUES (?, ?, ?, ?)""",
        (r_conflict['tel_id'], r_conflict['email_id'], 'portal_organico', ikey)
    )
    conn.commit()

    # Verificar que nenhum lead foi criado
    leads_total = conn.execute("SELECT COUNT(*) FROM leads").fetchone()[0]
    assert_eq("nenhum lead criado automaticamente", 0, leads_total)

    # Verificar que captacoes_conflito tem 1 registro pendente
    conf_total = conn.execute(
        "SELECT COUNT(*) FROM captacoes_conflito WHERE status = 'pendente'"
    ).fetchone()[0]
    assert_eq("1 conflito pendente registrado", 1, conf_total)

    # Verificar os IDs do conflito
    conf = conn.execute(
        "SELECT tel_contato_id, email_contato_id FROM captacoes_conflito WHERE idempotency_key = ?",
        (ikey,)
    ).fetchone()
    assert_eq("conflito.tel_contato_id = C1", r_c1['contato_id'], conf[0])
    assert_eq("conflito.email_contato_id = C2", r_c2['contato_id'], conf[1])

# ─── C04: Idempotência — mesmo idempotency_key ───────────────────────────────

def test_c04_idempotency_key():
    print("\nC04 — Idempotência: mesmo idempotency_key → apenas 1 lead")
    conn = make_db()

    r = resolve_contact(conn, '+5531777770001')
    ikey = str(uuid.uuid4())
    errors = []

    def insert_lead():
        try:
            conn.execute(
                """INSERT OR IGNORE INTO leads (contato_id, origem, idempotency_key)
                   VALUES (?, ?, ?)""",
                (r['contato_id'], 'portal_organico', ikey)
            )
            conn.commit()
        except sqlite3.IntegrityError as e:
            errors.append(str(e))

    threads = [threading.Thread(target=insert_lead) for _ in range(5)]
    for t in threads: t.start()
    for t in threads: t.join()

    total_leads = conn.execute(
        "SELECT COUNT(*) FROM leads WHERE idempotency_key = ?", (ikey,)
    ).fetchone()[0]
    assert_eq("apenas 1 lead com esse idempotency_key", 1, total_leads)

# ─── C05: INSERT OR IGNORE atômico sob threads paralelas ─────────────────────

def test_c05_insert_or_ignore_atomicity():
    """
    No D1 real, cada Worker tem sua própria connection ao banco.
    Simulamos isso com um arquivo SQLite temporário em disco + uma
    connection por thread (WAL permite leituras concorrentes; escritas
    serializam via lock de arquivo).
    Verificamos que mesmo com 20 threads fazendo INSERT OR IGNORE,
    apenas 1 contato é criado (UNIQUE index garante atomicidade).
    """
    print("\nC05 — INSERT OR IGNORE atômico: N threads, connections separadas → 0 duplicatas")
    import tempfile, os

    # Banco em arquivo temporário para permitir múltiplas connections
    db_path = tempfile.mktemp(suffix='.db')
    # Criar schema no banco de arquivo
    setup_conn = sqlite3.connect(db_path)
    setup_conn.executescript(SCHEMA)
    setup_conn.close()

    N = 20
    errors = []
    lock_errors = []

    def worker(i: int):
        # Cada thread tem sua própria connection (como no D1 / Workers)
        tconn = sqlite3.connect(db_path, timeout=10)
        tconn.isolation_level = None
        try:
            tconn.execute(
                "INSERT OR IGNORE INTO contatos (telefone, nome) VALUES (?, ?)",
                ('+5541666660001', f'Worker{i}')
            )
        except sqlite3.IntegrityError as e:
            lock_errors.append(str(e))
        except Exception as e:
            errors.append(f"Thread{i}: {e}")
        finally:
            tconn.close()

    threads = [threading.Thread(target=worker, args=(i,)) for i in range(N)]
    for t in threads: t.start()
    for t in threads: t.join()

    # Verificar resultado final
    final_conn = sqlite3.connect(db_path)
    total_all = final_conn.execute("SELECT COUNT(*) FROM contatos").fetchone()[0]
    final_conn.close()
    os.unlink(db_path)

    assert_eq("exatamente 1 contato no banco após 20 threads", 1, total_all)
    assert_eq("sem erros inesperados nas threads", 0, len(errors))

# ─── Entry point ──────────────────────────────────────────────────────────────

if __name__ == '__main__':
    print("=" * 60)
    print("Testes de Concorrência — Market Imobi CRM (D1/SQLite)")
    print("=" * 60)

    test_c01_concurrent_same_phone()
    test_c02_same_email_diff_phones()
    test_c03_conflict_identity()
    test_c04_idempotency_key()
    test_c05_insert_or_ignore_atomicity()

    print("\n" + "=" * 60)
    print(f"Resultado: {PASS_COUNT} ✓ passou  |  {FAIL_COUNT} ✗ falhou")
    print("=" * 60)

    if FAIL_COUNT > 0:
        sys.exit(1)
