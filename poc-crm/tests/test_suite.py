#!/usr/bin/env python3
"""
Market Imobi CRM — Suite de Testes da PoC
Testa: integridade, concorrência, idempotência, autorização, constraints, LGPD.
⚠️  Usa banco fictício local — sem dados reais, sem deploy.
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'worker-sim'))

import sqlite3
import json
import uuid
import time
import threading
import urllib.request
import urllib.error
from api import start_server, normalize_phone, DB_PATH, get_db

# ─── Helpers ─────────────────────────────────────────────────────────────────
BASE_URL = 'http://127.0.0.1:8787'
RESULTS = []

def request(method, path, body=None, headers=None):
    url = BASE_URL + path
    h = {'Content-Type': 'application/json'}
    if headers:
        h.update(headers)
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(url, data=data, headers=h, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, json.loads(resp.read())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read())

def test(name, fn):
    try:
        result = fn()
        RESULTS.append({'nome': name, 'ok': True, 'detalhe': result})
        print(f'  ✅  {name}')
        if result:
            for line in str(result).split('\n'):
                if line.strip():
                    print(f'      {line}')
    except AssertionError as e:
        RESULTS.append({'nome': name, 'ok': False, 'detalhe': str(e)})
        print(f'  ❌  {name}: {e}')
    except Exception as e:
        RESULTS.append({'nome': name, 'ok': False, 'detalhe': str(e)})
        print(f'  💥  {name}: {e}')

def reset_test_data():
    """Remove dados de teste entre grupos sem afetar seeds (usuarios/empreendimentos/tipologias)."""
    db = get_db()
    # Ordem respeita FK constraints: dependentes antes de referenciados
    db.execute('DELETE FROM interacoes')
    db.execute('DELETE FROM tarefas')
    db.execute('DELETE FROM propostas')
    db.execute('DELETE FROM agendamentos')
    db.execute('DELETE FROM oportunidades')
    db.execute('DELETE FROM consentimentos_lgpd')
    db.execute('DELETE FROM audit_log')
    db.execute('DELETE FROM leads')
    db.execute('DELETE FROM contatos')
    db.commit()
    db.close()

# ─── 1. Testes de constraints e integridade ──────────────────────────────────
def run_constraints():
    print('\n── 1. CONSTRAINTS E INTEGRIDADE ──')

    def t_phone_normalization():
        assert normalize_phone('21999887766') == '+5521999887766', 'DDD+9 digits'
        assert normalize_phone('(21) 99988-7766') == '+5521999887766', 'formatted'
        assert normalize_phone('+5521999887766') == '+5521999887766', 'already E.164'
        assert normalize_phone('999') is None, 'should reject short'
        return 'E.164 normalização: OK para 3 formatos, rejeita curto'
    test('Normalização E.164', t_phone_normalization)

    def t_unique_phone_constraint():
        db = get_db()
        db.execute("INSERT OR IGNORE INTO contatos (nome, telefone) VALUES ('Fictício A', '+5521111111101')")
        db.execute("INSERT OR IGNORE INTO contatos (nome, telefone) VALUES ('Fictício B', '+5521111111101')")
        db.commit()
        count = db.execute("SELECT COUNT(*) FROM contatos WHERE telefone = '+5521111111101'").fetchone()[0]
        db.execute("DELETE FROM contatos WHERE telefone = '+5521111111101'")
        db.commit()
        db.close()
        assert count == 1, f'Esperava 1 contato, encontrou {count}'
        return 'Telefone duplicado: INSERT OR IGNORE → 1 contato (correto)'
    test('UNIQUE constraint telefone', t_unique_phone_constraint)

    def t_situacao_comercial_check():
        db = get_db()
        try:
            db.execute(
                "INSERT INTO tipologias (empreendimento_id, nome, situacao_comercial) VALUES (1, 'T-Teste', 'INVALIDO')"
            )
            db.commit()
            db.execute("DELETE FROM tipologias WHERE nome='T-Teste'")
            db.commit()
            db.close()
            raise AssertionError('CHECK constraint não rejeitou valor inválido!')
        except sqlite3.IntegrityError:
            db.close()
            return 'CHECK(situacao_comercial): INVALIDO rejeitado corretamente'
    test('CHECK situacao_comercial', t_situacao_comercial_check)

    def t_agendamento_status_check():
        db = get_db()
        try:
            db.execute(
                """INSERT INTO agendamentos
                   (contato_id, empreendimento_id, data_hora, status)
                   VALUES (1, 1, '2026-11-10T10:00:00Z', 'agendado')"""
            )
            db.commit()
            db.execute("DELETE FROM agendamentos WHERE status='agendado'")
            db.commit()
            db.close()
            raise AssertionError("CHECK constraint não rejeitou 'agendado'!")
        except sqlite3.IntegrityError:
            db.close()
            return "CHECK(status): 'agendado' rejeitado (status inicial deve ser 'solicitado')"
    test("CHECK agendamento status 'agendado' rejeitado", t_agendamento_status_check)

    def t_agendamento_status_solicitado_aceito():
        db = get_db()
        # Precisamos de contato e empreendimento válidos
        db.execute("INSERT OR IGNORE INTO contatos (nome, telefone) VALUES ('Test Agend', '+5521222222201')")
        contato_id = db.execute("SELECT id FROM contatos WHERE telefone='+5521222222201'").fetchone()[0]
        db.execute(
            """INSERT INTO agendamentos
               (contato_id, empreendimento_id, data_hora, status)
               VALUES (?, 1, '2026-11-10T10:00:00Z', 'solicitado')""",
            (contato_id,)
        )
        db.commit()
        row = db.execute("SELECT status FROM agendamentos WHERE contato_id=?", (contato_id,)).fetchone()
        assert row['status'] == 'solicitado'
        db.execute("DELETE FROM agendamentos WHERE contato_id=?", (contato_id,))
        db.execute("DELETE FROM contatos WHERE telefone='+5521222222201'")
        db.commit()
        db.close()
        return "Status 'solicitado': aceito e persistido corretamente"
    test("Status inicial 'solicitado' aceito", t_agendamento_status_solicitado_aceito)

    def t_proposta_oportunidade_not_null():
        db = get_db()
        try:
            db.execute(
                """INSERT INTO propostas
                   (numero, oportunidade_id, contato_id, empreendimento_id, usuario_id, valor_imovel)
                   VALUES ('PROP-TST-001', NULL, 1, 1, 1, 30000000)"""
            )
            db.commit()
            db.execute("DELETE FROM propostas WHERE numero='PROP-TST-001'")
            db.commit()
            db.close()
            raise AssertionError('NOT NULL constraint não rejeitou oportunidade_id NULL!')
        except sqlite3.IntegrityError:
            db.close()
            return 'NOT NULL oportunidade_id: NULL rejeitado corretamente'
    test('NOT NULL propostas.oportunidade_id', t_proposta_oportunidade_not_null)

    def t_oportunidade_without_empreendimento():
        db = get_db()
        db.execute("INSERT OR IGNORE INTO contatos (nome, telefone) VALUES ('Test Op', '+5521333333301')")
        contato_id = db.execute("SELECT id FROM contatos WHERE telefone='+5521333333301'").fetchone()[0]
        db.execute(
            """INSERT INTO oportunidades (contato_id, empreendimento_id, estagio)
               VALUES (?, NULL, 'novo_lead')""",
            (contato_id,)
        )
        db.commit()
        row = db.execute("SELECT id, empreendimento_id FROM oportunidades WHERE contato_id=?", (contato_id,)).fetchone()
        assert row['empreendimento_id'] is None
        db.execute("DELETE FROM oportunidades WHERE contato_id=?", (contato_id,))
        db.execute("DELETE FROM contatos WHERE telefone='+5521333333301'")
        db.commit()
        db.close()
        return 'oportunidades.empreendimento_id=NULL: aceito (V1.1 nullable ok)'
    test('oportunidade sem empreendimento (nullable V1.1)', t_oportunidade_without_empreendimento)

    def t_audit_log_pii_sanitization():
        db = get_db()
        db.execute("INSERT OR IGNORE INTO contatos (nome, telefone, email) VALUES ('PII Test', '+5521444444401', 'pii@test.invalid')")
        contato_id = db.execute("SELECT id FROM contatos WHERE telefone='+5521444444401'").fetchone()[0]
        # Simular INSERT de contato com dados pessoais no audit log (deve sanitizar)
        dados_pessoais = {
            'id': contato_id,
            'nome': 'PII Test',
            'telefone': '+5521444444401',
            'email': 'pii@test.invalid'
        }
        # A função write_audit deve sanitizar dados de contatos
        from api import write_audit
        write_audit(db, None, 'contatos', contato_id, 'INSERT', dados_nov=dados_pessoais)
        db.commit()
        log_row = db.execute(
            "SELECT dados_novos FROM audit_log WHERE tabela='contatos' AND registro_id=?", (contato_id,)
        ).fetchone()
        dados_salvos = json.loads(log_row['dados_novos'])
        assert 'nome' not in dados_salvos or dados_salvos.get('nome') is None, \
            f'PII vazou no audit log: nome={dados_salvos.get("nome")}'
        assert 'telefone' not in dados_salvos or dados_salvos.get('telefone') is None, \
            f'PII vazou no audit log: telefone={dados_salvos.get("telefone")}'
        assert dados_salvos.get('_sanitizado') is True, 'Flag _sanitizado ausente'
        db.execute("DELETE FROM audit_log WHERE tabela='contatos' AND registro_id=?", (contato_id,))
        db.execute("DELETE FROM contatos WHERE telefone='+5521444444401'")
        db.commit()
        db.close()
        return f'Audit log sanitizado: {dados_salvos}'
    test('Audit log sanitização PII', t_audit_log_pii_sanitization)


# ─── 2. Testes de concorrência ───────────────────────────────────────────────
def run_concurrency():
    print('\n── 2. CONCORRÊNCIA (via API HTTP) ──')
    reset_test_data()

    def t_concurrent_same_phone():
        """Dois leads simultâneos com o mesmo telefone → 1 contato, 2 leads."""
        results = []
        errors = []

        def submit_lead(idem_key):
            code, body = request('POST', '/api/v1/leads', {
                'nome': 'Comprador Fictício',
                'telefone': '21555000001',
                'email': 'ficticio@teste-poc.invalid',
                'origem': 'portal_organico',
                'idempotency_key': idem_key,
                'consentimento_whatsapp': True
            })
            results.append((code, body))

        key1 = str(uuid.uuid4())
        key2 = str(uuid.uuid4())
        t1 = threading.Thread(target=submit_lead, args=(key1,))
        t2 = threading.Thread(target=submit_lead, args=(key2,))
        t1.start(); t2.start()
        t1.join(); t2.join()

        codes = [r[0] for r in results]
        assert all(c in [200, 201] for c in codes), f'Códigos inesperados: {codes}'

        db = get_db()
        contato_count = db.execute(
            "SELECT COUNT(*) FROM contatos WHERE telefone = '+5521555000001'"
        ).fetchone()[0]
        lead_count = db.execute(
            """SELECT COUNT(*) FROM leads l
               JOIN contatos c ON l.contato_id = c.id
               WHERE c.telefone = '+5521555000001'"""
        ).fetchone()[0]
        db.close()

        assert contato_count == 1, f'Race condition! Esperava 1 contato, criou {contato_count}'
        assert lead_count == 2, f'Esperava 2 leads distintos, criou {lead_count}'
        return f'Concorrência: 2 threads → 1 contato, 2 leads (race condition resolvida)'
    test('Race condition: dois leads simultâneos mesmo telefone', t_concurrent_same_phone)

    def t_idempotency_double_submit():
        """Mesmo idempotency_key enviado duas vezes → 1 lead, segundo retorna idempotent:true."""
        idem_key = str(uuid.uuid4())
        payload = {
            'nome': 'Comprador Idempotente',
            'telefone': '21555000002',
            'origem': 'google_ads',
            'idempotency_key': idem_key
        }
        code1, body1 = request('POST', '/api/v1/leads', payload)
        code2, body2 = request('POST', '/api/v1/leads', payload)

        assert code1 == 201, f'Primeira submissão esperava 201, recebeu {code1}'
        assert code2 == 200, f'Segunda submissão esperava 200 (idempotent), recebeu {code2}'
        assert body2.get('idempotent') is True, f'idempotent flag ausente: {body2}'
        assert body1['lead_id'] == body2['lead_id'], 'IDs diferentes — leads duplicados!'

        db = get_db()
        lead_count = db.execute(
            "SELECT COUNT(*) FROM leads WHERE idempotency_key = ?", (idem_key,)
        ).fetchone()[0]
        db.close()
        assert lead_count == 1, f'Idempotência falhou: {lead_count} leads com mesma chave'
        return f'Double-submit: lead_id={body1["lead_id"]}, segundo retornou idempotent=True'
    test('Idempotência: double-submit mesmo idempotency_key', t_idempotency_double_submit)

    def t_concurrent_idempotency():
        """Mesmo idempotency_key enviado por 3 threads → exatamente 1 lead."""
        idem_key = str(uuid.uuid4())
        results = []

        def submit():
            code, body = request('POST', '/api/v1/leads', {
                'nome': 'Comprador Thread',
                'telefone': '21555000003',
                'origem': 'meta_ads',
                'idempotency_key': idem_key
            })
            results.append((code, body))

        threads = [threading.Thread(target=submit) for _ in range(3)]
        for t in threads: t.start()
        for t in threads: t.join()

        created = [r for r in results if r[0] == 201]
        idempotent = [r for r in results if r[0] == 200 and r[1].get('idempotent')]
        assert len(created) >= 1, 'Nenhum lead criado'
        assert len(created) + len(idempotent) == 3, f'Resultados inesperados: {results}'

        db = get_db()
        count = db.execute(
            "SELECT COUNT(*) FROM leads WHERE idempotency_key = ?", (idem_key,)
        ).fetchone()[0]
        db.close()
        assert count == 1, f'Concorrência + idempotência falhou: {count} leads criados'
        return f'3 threads, mesma chave → 1 criado, {len(idempotent)} idempotentes'
    test('Concorrência + idempotência (3 threads)', t_concurrent_idempotency)


# ─── 3. Testes de autorização ────────────────────────────────────────────────
def run_authorization():
    print('\n── 3. AUTORIZAÇÃO ──')
    reset_test_data()

    # Criar oportunidade de teste para o corretor
    db = get_db()
    db.execute("INSERT OR IGNORE INTO contatos (nome, telefone) VALUES ('Contato Auth Test', '+5521666000001')")
    contato_id = db.execute("SELECT id FROM contatos WHERE telefone='+5521666000001'").fetchone()[0]
    db.execute(
        "INSERT INTO oportunidades (contato_id, estagio, responsavel_id) VALUES (?, 'novo_lead', 2)",
        (contato_id,)
    )  # responsavel_id=2 = corretor fictício
    op_id = db.execute("SELECT last_insert_rowid()").fetchone()[0]
    db.execute(
        "INSERT INTO oportunidades (contato_id, estagio, responsavel_id) VALUES (?, 'novo_lead', 2)",
        (contato_id,)
    )
    op_id_2 = db.execute("SELECT last_insert_rowid()").fetchone()[0]
    db.commit()
    db.close()

    def t_unauthenticated_leads():
        code, body = request('GET', '/api/v1/leads')
        assert code == 401, f'Esperava 401, recebeu {code}'
        return '401 sem JWT'
    test('GET /leads sem autenticação → 401', t_unauthenticated_leads)

    def t_admin_can_create_empreendimento():
        code, body = request('POST', '/api/v1/empreendimentos',
            {'slug': 'test-emp-auth', 'nome': 'Test Auth Emp', 'cidade': 'Itaboraí', 'uf': 'RJ'},
            headers={'X-Test-Cf-Sub': 'cf-sub-admin-0001'}
        )
        assert code == 201, f'Admin esperava 201, recebeu {code}: {body}'
        db = get_db()
        db.execute("DELETE FROM empreendimentos WHERE slug='test-emp-auth'")
        db.commit()
        db.close()
        return f'Admin criou empreendimento: id={body.get("empreendimento_id")}'
    test('Admin cria empreendimento → 201', t_admin_can_create_empreendimento)

    def t_corretor_cannot_create_empreendimento():
        code, body = request('POST', '/api/v1/empreendimentos',
            {'slug': 'test-emp-corretor', 'nome': 'Test Corretor', 'cidade': 'Niterói', 'uf': 'RJ'},
            headers={'X-Test-Cf-Sub': 'cf-sub-corretor-0002'}
        )
        assert code == 403, f'Corretor esperava 403, recebeu {code}'
        return f'403 corretamente negado'
    test('Corretor cria empreendimento → 403', t_corretor_cannot_create_empreendimento)

    def t_owner_can_change_estagio():
        code, body = request('PATCH', f'/api/v1/oportunidades/{op_id}/estagio',
            {'estagio': 'em_contato'},
            headers={'X-Test-Cf-Sub': 'cf-sub-corretor-0002'}  # é o dono
        )
        assert code == 200, f'Corretor dono esperava 200, recebeu {code}: {body}'
        assert body['estagio_novo'] == 'em_contato'
        return f'Corretor (dono) alterou estágio: {body["estagio_anterior"]} → {body["estagio_novo"]}'
    test('Corretor (dono) altera estágio → 200', t_owner_can_change_estagio)

    def t_non_owner_cannot_change_estagio():
        # Criar outra oportunidade com responsavel_id diferente (assistente=3)
        db = get_db()
        db.execute(
            "INSERT INTO oportunidades (contato_id, estagio, responsavel_id) VALUES (?, 'novo_lead', 3)",
            (contato_id,)
        )
        op_alheio = db.execute("SELECT last_insert_rowid()").fetchone()[0]
        db.commit()
        db.close()
        code, body = request('PATCH', f'/api/v1/oportunidades/{op_alheio}/estagio',
            {'estagio': 'em_contato'},
            headers={'X-Test-Cf-Sub': 'cf-sub-corretor-0002'}  # não é o dono
        )
        assert code == 403, f'Corretor não-dono esperava 403, recebeu {code}: {body}'
        return f'403 corretamente negado para não-dono'
    test('Corretor não-dono altera estágio → 403', t_non_owner_cannot_change_estagio)

    def t_admin_can_change_any_estagio():
        code, body = request('PATCH', f'/api/v1/oportunidades/{op_id_2}/estagio',
            {'estagio': 'visita_solicitada'},
            headers={'X-Test-Cf-Sub': 'cf-sub-admin-0001'}  # admin
        )
        assert code == 200, f'Admin esperava 200, recebeu {code}: {body}'
        return f'Admin alterou estágio alheio: {body["estagio_anterior"]} → {body["estagio_novo"]}'
    test('Admin altera estágio de qualquer oportunidade → 200', t_admin_can_change_any_estagio)

    def t_invalid_jwt_rejected():
        code, body = request('GET', '/api/v1/leads',
            headers={'X-Test-Cf-Sub': 'cf-sub-INEXISTENTE-9999'}
        )
        assert code == 401, f'JWT inválido esperava 401, recebeu {code}'
        return '401 para cf_access_id não cadastrado'
    test('JWT com sub inexistente → 401', t_invalid_jwt_rejected)

    def t_dedup_no_pii_in_error():
        """Erros de duplicidade não vazam o telefone completo."""
        code, body = request('POST', '/api/v1/leads', {
            'nome': 'Erro PII Test',
            'telefone': '21777000001',
            'origem': 'portal_organico',
        })
        code2, body2 = request('POST', '/api/v1/leads', {
            'nome': 'Erro PII Test 2',
            'telefone': '21777000001',
            'origem': 'portal_organico',
        })
        # O segundo pode criar com sucesso (dedup correto) mas mensagem não deve vazar tel
        body_str = json.dumps(body2)
        # O telefone normalizado não deve aparecer em uma mensagem de erro
        # (pode aparecer nos dados se retornado corretamente, mas não em mensagem de erro)
        if 'error' in body2:
            assert '+5521777000001' not in body2.get('error', {}).get('message', ''), \
                'Telefone E.164 vazou na mensagem de erro!'
        return f'Resposta não vaza telefone em mensagem de erro'
    test('Sem PII em mensagens de erro', t_dedup_no_pii_in_error)


# ─── 4. Testes de lead flow completo ─────────────────────────────────────────
def run_lead_flow():
    print('\n── 4. FLUXO COMPLETO DE LEAD ──')
    reset_test_data()

    def t_full_lead_submission():
        idem_key = str(uuid.uuid4())
        code, body = request('POST', '/api/v1/leads', {
            'nome': 'Ana Fictícia da Silva',
            'telefone': '21988887777',
            'email': 'ana.ficticia@teste-poc.invalid',
            'cidade': 'Itaboraí',
            'uf': 'RJ',
            'renda_faixa': 'ate_2sm',
            'empreendimento_id': 1,
            'tipologia_id': 1,
            'origem': 'google_ads',
            'utm_source': 'google',
            'utm_medium': 'cpc',
            'utm_campaign': 'mcmv-poc-test',
            'gclid': 'EAIaIQ-FICTICIO-TEST',
            'meta_fbc': 'fb.1.1698765432.ficticiofbc',
            'meta_fbp': 'fb.1.1698765432.ficticiofbp',
            'idempotency_key': idem_key,
            'consentimento_whatsapp': True,
            'consentimento_marketing': False
        })
        assert code == 201, f'Esperava 201, recebeu {code}: {body}'
        lead_id = body['lead_id']
        contato_id = body['contato_id']

        db = get_db()
        lead = db.execute('SELECT * FROM leads WHERE id = ?', (lead_id,)).fetchone()
        assert lead['meta_fbc'] == 'fb.1.1698765432.ficticiofbc', 'meta_fbc não gravado'
        assert lead['meta_fbp'] == 'fb.1.1698765432.ficticiofbp', 'meta_fbp não gravado'
        assert lead['gclid'] == 'EAIaIQ-FICTICIO-TEST', 'gclid não gravado'

        # Verificar consentimento whatsapp criado, marketing não
        consent_wpp = db.execute(
            "SELECT id FROM consentimentos_lgpd WHERE contato_id=? AND tipo='contato_whatsapp'",
            (contato_id,)
        ).fetchone()
        consent_mkt = db.execute(
            "SELECT id FROM consentimentos_lgpd WHERE contato_id=? AND tipo='comunicacao_marketing'",
            (contato_id,)
        ).fetchone()
        db.close()
        assert consent_wpp is not None, 'Consentimento WhatsApp não criado'
        assert consent_mkt is None, 'Consentimento marketing não deveria existir'

        return f'Lead {lead_id} criado com todos os campos, consentimentos corretos'
    test('Fluxo completo de lead com todos os campos', t_full_lead_submission)

    def t_lead_without_empreendimento():
        """Lead de WhatsApp direto sem empreendimento definido."""
        code, body = request('POST', '/api/v1/leads', {
            'nome': 'Bruno Fictício',
            'telefone': '21977776666',
            'origem': 'whatsapp_direto',
        })
        assert code == 201, f'Esperava 201, recebeu {code}: {body}'
        db = get_db()
        lead = db.execute('SELECT * FROM leads WHERE id = ?', (body['lead_id'],)).fetchone()
        assert lead['empreendimento_id'] is None, 'empreendimento_id deveria ser NULL'
        db.close()
        return f'Lead sem empreendimento criado: id={body["lead_id"]}'
    test('Lead sem empreendimento (WhatsApp direto)', t_lead_without_empreendimento)

    def t_lead_invalid_phone():
        code, body = request('POST', '/api/v1/leads', {
            'nome': 'Teste',
            'telefone': '123',
            'origem': 'portal_organico',
        })
        assert code == 400, f'Telefone inválido deveria ser 400, recebeu {code}'
        return 'Telefone inválido → 400'
    test('Telefone inválido → 400', t_lead_invalid_phone)

    def t_lead_invalid_origem():
        code, body = request('POST', '/api/v1/leads', {
            'nome': 'Teste',
            'telefone': '21988001001',
            'origem': 'ORIGEM_INVALIDA',
        })
        assert code == 400, f'Origem inválida deveria ser 400, recebeu {code}'
        return 'Origem inválida → 400'
    test('Origem inválida → 400', t_lead_invalid_origem)


# ─── 5. Testes de empreendimentos ────────────────────────────────────────────
def run_empreendimentos():
    print('\n── 5. EMPREENDIMENTOS E TIPOLOGIAS ──')

    def t_list_empreendimentos():
        code, body = request('GET', '/api/v1/empreendimentos')
        assert code == 200, f'Esperava 200, recebeu {code}'
        assert body['total'] >= 2, f'Esperava >= 2 empreendimentos, encontrou {body["total"]}'
        # Verificar que campos de tipologia não estão aqui (preços corretos)
        assert 'tipologias' not in body['data'][0], 'Tipologias não devem aparecer na listagem'
        return f'{body["total"]} empreendimentos, sem tipologias inline'
    test('GET /empreendimentos lista sem tipologias', t_list_empreendimentos)

    def t_get_empreendimento_with_tipologias():
        code, body = request('GET', '/api/v1/empreendimentos/1')
        assert code == 200, f'Esperava 200, recebeu {code}'
        emp = body['data']
        assert 'tipologias' in emp, 'Detalhes devem incluir tipologias'
        tips = emp['tipologias']
        assert len(tips) >= 1, 'Sem tipologias no empreendimento'
        tip = tips[0]
        assert 'suites' in tip, 'Campo suites ausente (V1.1)'
        assert 'situacao_comercial' in tip, 'Campo situacao_comercial ausente (V1.1)'
        assert 'condicoes_validade' in tip, 'Campo condicoes_validade ausente (V1.1)'
        return f'Empreendimento 1: {len(tips)} tipologias com todos os campos V1.1'
    test('GET /empreendimentos/1 inclui tipologias V1.1', t_get_empreendimento_with_tipologias)

    def t_get_nonexistent_empreendimento():
        code, body = request('GET', '/api/v1/empreendimentos/99999')
        assert code == 404, f'Esperava 404, recebeu {code}'
        return '404 para empreendimento inexistente'
    test('GET /empreendimentos/99999 → 404', t_get_nonexistent_empreendimento)


# ─── 6. Testes de LGPD ───────────────────────────────────────────────────────
def run_lgpd():
    print('\n── 6. LGPD ──')

    def t_contatos_sem_cpf_hash():
        db = get_db()
        cols = db.execute("PRAGMA table_info(contatos)").fetchall()
        col_names = [c['name'] for c in cols]
        db.close()
        assert 'cpf_hash' not in col_names, 'cpf_hash ainda presente em contatos!'
        assert 'anonimizado_at' in col_names, 'anonimizado_at ausente'
        assert 'deleted_at' in col_names, 'deleted_at ausente'
        return f'Colunas contatos: {col_names}'
    test('contatos sem cpf_hash, com anonimizado_at (LGPD)', t_contatos_sem_cpf_hash)

    def t_consentimentos_com_base_legal():
        db = get_db()
        cols = db.execute("PRAGMA table_info(consentimentos_lgpd)").fetchall()
        col_names = [c['name'] for c in cols]
        db.close()
        assert 'base_legal' in col_names, 'base_legal ausente em consentimentos_lgpd'
        return f'consentimentos_lgpd.base_legal: presente'
    test('consentimentos_lgpd tem base_legal (V1.1)', t_consentimentos_com_base_legal)

    def t_usuarios_sem_senha_hash():
        db = get_db()
        cols = db.execute("PRAGMA table_info(usuarios)").fetchall()
        col_names = [c['name'] for c in cols]
        db.close()
        assert 'senha_hash' not in col_names, 'senha_hash ainda em usuarios!'
        assert 'cf_access_id' in col_names, 'cf_access_id ausente em usuarios'
        return f'usuarios: sem senha_hash, com cf_access_id'
    test('usuarios sem senha_hash (auth via CF Access)', t_usuarios_sem_senha_hash)

    def t_anonimizacao_lgpd_table():
        db = get_db()
        cols = db.execute("PRAGMA table_info(anonimizacoes_lgpd)").fetchall()
        col_names = [c['name'] for c in cols]
        db.close()
        expected = ['id', 'contato_id', 'tipo', 'executado_por', 'executado_at', 'campos_afetados']
        for col in expected:
            assert col in col_names, f'Coluna {col} ausente em anonimizacoes_lgpd'
        return f'anonimizacoes_lgpd: todos os campos presentes'
    test('Tabela anonimizacoes_lgpd estrutura correta', t_anonimizacao_lgpd_table)


# ─── MAIN ─────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    print('=' * 60)
    print('Market Imobi CRM — Suite de Testes PoC')
    print('Dados fictícios | Ambiente isolado | Sem deploy')
    print('=' * 60)

    # Iniciar servidor
    server = start_server(8787)
    time.sleep(0.3)  # aguardar inicialização

    # Executar grupos
    run_constraints()
    run_concurrency()
    run_authorization()
    run_lead_flow()
    run_empreendimentos()
    run_lgpd()

    server.shutdown()

    # Resumo
    total = len(RESULTS)
    passed = sum(1 for r in RESULTS if r['ok'])
    failed = total - passed

    print('\n' + '=' * 60)
    print(f'RESULTADO: {passed}/{total} testes passaram')
    if failed:
        print(f'\n❌ {failed} FALHA(S):')
        for r in RESULTS:
            if not r['ok']:
                print(f'  • {r["nome"]}: {r["detalhe"]}')
    print('=' * 60)

    sys.exit(0 if failed == 0 else 1)
