#!/usr/bin/env python3
"""
Inicializa o banco SQLite de testes para o harness T1-T17.
Aplica as migrations 0001, 0002, 0004 (captacoes_conflito), 0005 (unique email).

Uso: python3 tests/setup_test_db.py <caminho_do_db>
"""
import sqlite3
import sys
import os

def setup(db_path):
    # Remover DB anterior se existir
    if os.path.exists(db_path):
        os.remove(db_path)

    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA journal_mode = WAL")
    conn.execute("PRAGMA foreign_keys = ON")

    migrations_dir = os.path.join(os.path.dirname(__file__), '..', 'migrations')

    # Ordem correta das migrations
    files = [
        '0001_initial_schema.sql',
        '0002_add_leads_dados_extras.sql',
        '0004_captacoes_conflito.sql',
        '0005_unique_email_contatos.sql',
    ]

    for fname in files:
        path = os.path.join(migrations_dir, fname)
        if not os.path.exists(path):
            print(f"[setup_db] SKIP {fname} (arquivo não encontrado)")
            continue
        with open(path, 'r', encoding='utf-8') as f:
            sql = f.read()
        try:
            conn.executescript(sql)
            print(f"[setup_db] OK {fname}")
        except Exception as e:
            print(f"[setup_db] ERRO {fname}: {e}")

    conn.commit()
    conn.close()
    print(f"[setup_db] Banco criado em: {db_path}")

if __name__ == '__main__':
    db_path = sys.argv[1] if len(sys.argv) > 1 else '/tmp/test_webhook_meta.db'
    setup(db_path)
