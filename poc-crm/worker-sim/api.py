#!/usr/bin/env python3
"""
Market Imobi CRM — Simulador de Worker API (PoC local)
Simula o comportamento do Cloudflare Worker usando Python puro.
⚠️  NÃO É O WORKER REAL — apenas simulação para testes da PoC.
    Dados fictícios. Sem deploy. Sem D1 remoto.
"""

import sqlite3
import json
import uuid
import time
import re
from datetime import datetime, timezone
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading

DB_PATH = '/home/claude/joelmarcosads/quero-meu-mcmv/poc-crm/data/market-imobi-poc.db'

# ─── CPU timer helper ─────────────────────────────────────────────────────────
class CPUTimer:
    """Mede apenas tempo de CPU (não I/O) para validar o limite de 10ms."""
    def __init__(self):
        self.cpu_start = time.process_time()
        self.wall_start = time.monotonic()
    def stop(self):
        cpu_ms = (time.process_time() - self.cpu_start) * 1000
        wall_ms = (time.monotonic() - self.wall_start) * 1000
        return {'cpu_ms': round(cpu_ms, 3), 'wall_ms': round(wall_ms, 3)}

# ─── DB helper ────────────────────────────────────────────────────────────────
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.execute('PRAGMA foreign_keys=ON')
    conn.row_factory = sqlite3.Row
    return conn

# ─── Phone normalization E.164 ────────────────────────────────────────────────
def normalize_phone(raw: str) -> str | None:
    digits = re.sub(r'\D', '', raw)
    if len(digits) == 11:           # DDD + 9 dígitos
        return f'+55{digits}'
    if len(digits) == 10:           # DDD + 8 dígitos (fixo)
        return f'+55{digits}'
    if len(digits) == 13 and digits.startswith('55'):
        return f'+{digits}'
    return None

# ─── JWT mock validator ───────────────────────────────────────────────────────
# Na produção: busca JWKS do Cloudflare Access e valida RS256
# Na PoC: aceita o cf_access_id diretamente no header X-Test-User-Id
def validate_jwt_mock(headers: dict) -> dict | None:
    """
    Mock do Cloudflare Access JWT validation.
    Header X-Test-Cf-Sub simula o 'sub' claim do JWT.
    CPU real na produção: ~1-3ms (RS256 verify).
    """
    cf_sub = headers.get('X-Test-Cf-Sub') or headers.get('x-test-cf-sub')
    if not cf_sub:
        return None
    db = get_db()
    row = db.execute(
        'SELECT id, nome, email, perfil, ativo FROM usuarios WHERE cf_access_id = ?',
        (cf_sub,)
    ).fetchone()
    db.close()
    if not row or not row['ativo']:
        return None
    return dict(row)

# ─── Ownership check ──────────────────────────────────────────────────────────
def check_ownership(usuario: dict, responsavel_id: int | None) -> bool:
    if usuario['perfil'] == 'admin':
        return True
    return responsavel_id == usuario['id']

# ─── Audit log (sanitizado — sem PII de contatos) ─────────────────────────────
def write_audit(db, usuario_id: int | None, tabela: str, registro_id: int,
                acao: str, dados_ant=None, dados_nov=None, ip: str = None):
    """
    Grava no audit_log sem PII.
    Para tabela 'contatos': apenas {id, acao} — sem campos pessoais.
    """
    if tabela == 'contatos':
        # Sanitizar: remover todos os campos pessoais
        if dados_ant: dados_ant = {'id': dados_ant.get('id'), '_sanitizado': True}
        if dados_nov: dados_nov = {'id': dados_nov.get('id'), '_sanitizado': True}

    # Truncar IP para dois primeiros octetos
    ip_safe = None
    if ip:
        parts = ip.split('.')
        ip_safe = f'{parts[0]}.{parts[1]}.x.x' if len(parts) == 4 else ip

    db.execute(
        '''INSERT INTO audit_log (usuario_id, tabela, registro_id, acao,
           dados_anteriores, dados_novos, ip_address)
           VALUES (?, ?, ?, ?, ?, ?, ?)''',
        (usuario_id, tabela, registro_id, acao,
         json.dumps(dados_ant) if dados_ant else None,
         json.dumps(dados_nov) if dados_nov else None,
         ip_safe)
    )

# ─── Request handler ──────────────────────────────────────────────────────────
class CRMHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args): pass  # silenciar logs do servidor

    def _send(self, code: int, data: dict, cpu_stats: dict = None):
        body = json.dumps({**data, '_perf': cpu_stats} if cpu_stats else data,
                          ensure_ascii=False).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', len(body))
        self.end_headers()
        self.wfile.write(body)

    def _err(self, code: int, msg: str):
        self._send(code, {'error': {'code': 'ERR', 'message': msg}})

    def _parse_body(self) -> dict:
        length = int(self.headers.get('Content-Length', 0))
        if not length:
            return {}
        return json.loads(self.rfile.read(length))

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip('/')
        qs = parse_qs(parsed.query)

        # ── GET /api/v1/empreendimentos ──────────────────────────────────────
        if path == '/api/v1/empreendimentos':
            t = CPUTimer()
            db = get_db()
            rows = db.execute(
                '''SELECT id, slug, nome, construtora, status, faixa_mcmv,
                   cidade, uf, bairro, area_privativa_min, area_privativa_max,
                   valor_min, valor_max, foto_capa_url
                   FROM empreendimentos
                   WHERE deleted_at IS NULL AND ativo = 1
                   ORDER BY created_at DESC'''
            ).fetchall()
            result = [dict(r) for r in rows]
            db.close()
            stats = t.stop()
            self._send(200, {'data': result, 'total': len(result)}, stats)

        # ── GET /api/v1/empreendimentos/:id ──────────────────────────────────
        elif re.match(r'^/api/v1/empreendimentos/\d+$', path):
            emp_id = int(path.split('/')[-1])
            t = CPUTimer()
            db = get_db()
            emp = db.execute(
                'SELECT * FROM empreendimentos WHERE id = ? AND deleted_at IS NULL', (emp_id,)
            ).fetchone()
            if not emp:
                db.close()
                return self._err(404, 'Empreendimento não encontrado.')
            tips = db.execute(
                'SELECT * FROM tipologias WHERE empreendimento_id = ?', (emp_id,)
            ).fetchall()
            db.close()
            stats = t.stop()
            self._send(200, {
                'data': {**dict(emp), 'tipologias': [dict(t) for t in tips]}
            }, stats)

        # ── GET /api/v1/leads (requer auth) ──────────────────────────────────
        elif path == '/api/v1/leads':
            t = CPUTimer()
            usuario = validate_jwt_mock(dict(self.headers))
            if not usuario:
                return self._err(401, 'Não autenticado.')
            # Corretor só vê seus próprios leads
            db = get_db()
            if usuario['perfil'] == 'admin':
                rows = db.execute(
                    '''SELECT l.*, c.nome contato_nome, c.telefone contato_tel
                       FROM leads l JOIN contatos c ON l.contato_id = c.id
                       WHERE c.deleted_at IS NULL
                       ORDER BY l.created_at DESC LIMIT 50'''
                ).fetchall()
            else:
                rows = db.execute(
                    '''SELECT l.*, c.nome contato_nome, c.telefone contato_tel
                       FROM leads l
                       JOIN contatos c ON l.contato_id = c.id
                       JOIN oportunidades o ON o.lead_id = l.id
                       WHERE c.deleted_at IS NULL AND o.responsavel_id = ?
                       ORDER BY l.created_at DESC LIMIT 50''',
                    (usuario['id'],)
                ).fetchall()
            db.close()
            stats = t.stop()
            self._send(200, {'data': [dict(r) for r in rows], 'total': len(rows)}, stats)

        else:
            self._err(404, 'Rota não encontrada.')

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip('/')

        # ── POST /api/v1/leads (público — formulário portal) ─────────────────
        if path == '/api/v1/leads':
            t = CPUTimer()
            body = self._parse_body()

            # Validação básica
            required = ['nome', 'telefone', 'origem']
            missing = [f for f in required if not body.get(f)]
            if missing:
                return self._err(400, f'Campos obrigatórios: {", ".join(missing)}')

            # Normalizar telefone
            tel = normalize_phone(str(body['telefone']))
            if not tel:
                return self._err(400, 'Telefone inválido. Use formato com DDD (11 dígitos).')

            # Validar origem
            origens_validas = [
                'portal_organico','portal_pago','google_ads','meta_ads',
                'whatsapp_direto','indicacao','marketplace_zap','marketplace_viva',
                'marketplace_olx','marketplace_facebook','outro'
            ]
            if body['origem'] not in origens_validas:
                return self._err(400, f'Origem inválida: {body["origem"]}')

            # Idempotência
            idem_key = body.get('idempotency_key')
            db = get_db()
            if idem_key:
                existing = db.execute(
                    'SELECT id FROM leads WHERE idempotency_key = ?', (idem_key,)
                ).fetchone()
                if existing:
                    db.close()
                    stats = t.stop()
                    return self._send(200, {
                        'lead_id': existing['id'],
                        'idempotent': True,
                        'message': 'Lead já registrado com esta chave.'
                    }, stats)

            # Deduplicação concorrente: INSERT OR IGNORE + SELECT
            try:
                db.execute('BEGIN')
                db.execute(
                    '''INSERT OR IGNORE INTO contatos
                       (nome, telefone, telefone_raw, email, cidade, uf, renda_faixa)
                       VALUES (?, ?, ?, ?, ?, ?, ?)''',
                    (body['nome'], tel, body['telefone'],
                     body.get('email'), body.get('cidade'), body.get('uf'),
                     body.get('renda_faixa'))
                )
                contato_row = db.execute(
                    'SELECT id FROM contatos WHERE telefone = ? AND deleted_at IS NULL',
                    (tel,)
                ).fetchone()
                contato_id = contato_row['id']

                # Inserir lead
                cursor = db.execute(
                    '''INSERT INTO leads
                       (contato_id, empreendimento_id, tipologia_id, idempotency_key,
                        origem, utm_source, utm_medium, utm_campaign,
                        gclid, fbclid, meta_fbc, meta_fbp, ip_address, user_agent)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                    (contato_id,
                     body.get('empreendimento_id'), body.get('tipologia_id'),
                     idem_key or str(uuid.uuid4()),
                     body['origem'],
                     body.get('utm_source'), body.get('utm_medium'), body.get('utm_campaign'),
                     body.get('gclid'), body.get('fbclid'),
                     body.get('meta_fbc'), body.get('meta_fbp'),
                     body.get('ip_address', '0.0.0.0'),
                     body.get('user_agent', 'poc-test'))
                )
                lead_id = cursor.lastrowid

                # Consentimentos LGPD
                if body.get('consentimento_whatsapp'):
                    db.execute(
                        '''INSERT INTO consentimentos_lgpd
                           (contato_id, tipo, concedido, canal, texto_versao, base_legal, ip_address)
                           VALUES (?, 'contato_whatsapp', 1, 'portal_web', 'v2026-11', 'consentimento', ?)''',
                        (contato_id, body.get('ip_address', '0.0.0.0'))
                    )
                if body.get('consentimento_marketing'):
                    db.execute(
                        '''INSERT INTO consentimentos_lgpd
                           (contato_id, tipo, concedido, canal, texto_versao, base_legal, ip_address)
                           VALUES (?, 'comunicacao_marketing', 1, 'portal_web', 'v2026-11', 'consentimento', ?)''',
                        (contato_id, body.get('ip_address', '0.0.0.0'))
                    )

                # Audit log (sanitizado)
                write_audit(db, None, 'leads', lead_id, 'INSERT',
                           dados_nov={'lead_id': lead_id, 'origem': body['origem']})

                db.execute('COMMIT')
                db.close()
                stats = t.stop()
                self._send(201, {
                    'lead_id': lead_id,
                    'contato_id': contato_id,
                    'idempotent': False,
                    'message': 'Lead registrado com sucesso.'
                }, stats)

            except sqlite3.IntegrityError as e:
                db.execute('ROLLBACK')
                db.close()
                self._err(409, f'Conflito de integridade: {str(e)}')
            except Exception as e:
                db.execute('ROLLBACK')
                db.close()
                self._err(500, f'Erro interno: {str(e)}')

        # ── POST /api/v1/empreendimentos (requer admin) ───────────────────────
        elif path == '/api/v1/empreendimentos':
            t = CPUTimer()
            usuario = validate_jwt_mock(dict(self.headers))
            if not usuario:
                return self._err(401, 'Não autenticado.')
            if usuario['perfil'] != 'admin':
                return self._err(403, 'Apenas administradores podem criar empreendimentos.')

            body = self._parse_body()
            required = ['slug', 'nome', 'cidade', 'uf']
            missing = [f for f in required if not body.get(f)]
            if missing:
                return self._err(400, f'Campos obrigatórios: {", ".join(missing)}')

            db = get_db()
            try:
                cursor = db.execute(
                    '''INSERT INTO empreendimentos
                       (slug, nome, construtora, status, faixa_mcmv,
                        logradouro, numero, bairro, cidade, uf, cep,
                        lat, lng, area_privativa_min, area_privativa_max,
                        valor_min, valor_max, descricao)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                    (body['slug'], body['nome'],
                     body.get('construtora'), body.get('status', 'lancamento'),
                     body.get('faixa_mcmv'),
                     body.get('logradouro'), body.get('numero'), body.get('bairro'),
                     body['cidade'], body['uf'], body.get('cep'),
                     body.get('lat'), body.get('lng'),
                     body.get('area_privativa_min'), body.get('area_privativa_max'),
                     body.get('valor_min'), body.get('valor_max'), body.get('descricao'))
                )
                emp_id = cursor.lastrowid
                write_audit(db, usuario['id'], 'empreendimentos', emp_id, 'INSERT',
                           dados_nov={'id': emp_id, 'slug': body['slug'], 'nome': body['nome']})
                db.commit()
                db.close()
                stats = t.stop()
                self._send(201, {'empreendimento_id': emp_id, 'message': 'Criado com sucesso.'}, stats)
            except sqlite3.IntegrityError:
                db.close()
                self._err(409, f'Slug já existe: {body["slug"]}')

        else:
            self._err(404, 'Rota não encontrada.')

    def do_PATCH(self):
        path = self.path.rstrip('/')

        # ── PATCH /api/v1/oportunidades/:id/estagio ───────────────────────────
        m = re.match(r'^/api/v1/oportunidades/(\d+)/estagio$', path)
        if m:
            t = CPUTimer()
            usuario = validate_jwt_mock(dict(self.headers))
            if not usuario:
                return self._err(401, 'Não autenticado.')

            op_id = int(m.group(1))
            body = self._parse_body()
            novo_estagio = body.get('estagio')

            estagios_validos = [
                'novo_lead','em_contato','visita_solicitada','visita_agendada',
                'visita_realizada','proposta_enviada','documentacao',
                'fechado_ganho','fechado_perdido'
            ]
            if novo_estagio not in estagios_validos:
                return self._err(400, f'Estágio inválido: {novo_estagio}')

            db = get_db()
            op = db.execute(
                'SELECT id, estagio, responsavel_id FROM oportunidades WHERE id = ?', (op_id,)
            ).fetchone()
            if not op:
                db.close()
                return self._err(404, 'Oportunidade não encontrada.')

            # Verificação de ownership (V1.1)
            if not check_ownership(usuario, op['responsavel_id']):
                db.close()
                return self._err(403, 'Acesso negado — não é o responsável por esta oportunidade.')

            estagio_ant = op['estagio']
            db.execute(
                'UPDATE oportunidades SET estagio = ?, updated_at = ? WHERE id = ?',
                (novo_estagio, datetime.now(timezone.utc).isoformat(), op_id)
            )
            write_audit(db, usuario['id'], 'oportunidades', op_id, 'UPDATE',
                       dados_ant={'estagio': estagio_ant},
                       dados_nov={'estagio': novo_estagio})
            db.commit()
            db.close()
            stats = t.stop()
            self._send(200, {
                'oportunidade_id': op_id,
                'estagio_anterior': estagio_ant,
                'estagio_novo': novo_estagio
            }, stats)
            return

        self._err(404, 'Rota não encontrada.')


def start_server(port=8787):
    server = HTTPServer(('127.0.0.1', port), CRMHandler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server


if __name__ == '__main__':
    import sys
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8787
    print(f'Worker API simulado rodando em http://127.0.0.1:{port}')
    print('Rotas disponíveis:')
    print('  GET  /api/v1/empreendimentos')
    print('  GET  /api/v1/empreendimentos/:id')
    print('  POST /api/v1/empreendimentos  (requer X-Test-Cf-Sub: cf-sub-admin-0001)')
    print('  GET  /api/v1/leads            (requer auth)')
    print('  POST /api/v1/leads            (público)')
    print('  PATCH /api/v1/oportunidades/:id/estagio (requer auth + ownership)')
    print()
    server = HTTPServer(('127.0.0.1', port), CRMHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nServidor encerrado.')
