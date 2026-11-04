-- ================================================================
-- Market Imobi CRM — Migração 0001: Schema inicial V1.1
-- ✅ APLICAR EM PRODUÇÃO: contém apenas DDL + configurações LGPD
-- (Dados fictícios estão em migrations/staging-only/ — NÃO aplicar)
-- ================================================================

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ── META DE MIGRAÇÃO ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS _migrations (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  version    TEXT NOT NULL UNIQUE,
  descricao  TEXT NOT NULL,
  executado_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ── EMPREENDIMENTOS ──────────────────────────────────────────────
CREATE TABLE empreendimentos (
  id                   INTEGER PRIMARY KEY AUTOINCREMENT,
  slug                 TEXT    NOT NULL UNIQUE,
  nome                 TEXT    NOT NULL,
  construtora          TEXT,
  status               TEXT    NOT NULL DEFAULT 'lancamento'
    CHECK(status IN ('em_breve','lancamento','em_obras','pronto','encerrado')),
  faixa_mcmv           INTEGER CHECK(faixa_mcmv IN (1,2,3)),
  logradouro           TEXT,
  numero               TEXT,
  complemento          TEXT,
  bairro               TEXT,
  cidade               TEXT    NOT NULL,
  uf                   CHAR(2) NOT NULL,
  cep                  CHAR(8),
  lat                  REAL,
  lng                  REAL,
  area_privativa_min   REAL,
  area_privativa_max   REAL,
  valor_min            INTEGER,
  valor_max            INTEGER,
  foto_capa_url        TEXT,
  descricao            TEXT,
  ativo                INTEGER NOT NULL DEFAULT 1,
  created_at           TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at           TEXT    NOT NULL DEFAULT (datetime('now')),
  deleted_at           TEXT
);
CREATE INDEX idx_emp_status  ON empreendimentos(status)     WHERE deleted_at IS NULL;
CREATE INDEX idx_emp_faixa   ON empreendimentos(faixa_mcmv) WHERE deleted_at IS NULL;
CREATE INDEX idx_emp_cidade  ON empreendimentos(cidade, uf) WHERE deleted_at IS NULL;

-- ── TIPOLOGIAS ───────────────────────────────────────────────────
CREATE TABLE tipologias (
  id                      INTEGER PRIMARY KEY AUTOINCREMENT,
  empreendimento_id       INTEGER NOT NULL REFERENCES empreendimentos(id),
  nome                    TEXT    NOT NULL,
  quartos                 INTEGER,
  suites                  INTEGER NOT NULL DEFAULT 0,
  banheiros               INTEGER,
  vagas                   INTEGER NOT NULL DEFAULT 0,
  area_m2                 REAL,
  planta_url              TEXT,
  caracteristicas_json    TEXT,
  situacao_comercial      TEXT    NOT NULL DEFAULT 'disponivel'
    CHECK(situacao_comercial IN ('disponivel','em_negociacao','reservado','vendido')),
  valor_base              INTEGER,
  valor_entrada_min       INTEGER,
  valor_parcela_estimada  INTEGER,
  condicoes_validade      TEXT,
  condicoes_fonte         TEXT,
  created_at              TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at              TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_tip_empreendimento      ON tipologias(empreendimento_id);
CREATE INDEX idx_tip_situacao_comercial  ON tipologias(situacao_comercial);

-- ── USUARIOS ─────────────────────────────────────────────────────
CREATE TABLE usuarios (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  nome            TEXT    NOT NULL,
  email           TEXT    NOT NULL UNIQUE,
  telefone        TEXT,
  perfil          TEXT    NOT NULL DEFAULT 'corretor'
    CHECK(perfil IN ('admin','corretor','assistente')),
  creci           TEXT,
  ativo           INTEGER NOT NULL DEFAULT 1,
  cf_access_id    TEXT    UNIQUE,
  ultimo_login_at TEXT,
  created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ── CONTATOS ─────────────────────────────────────────────────────
CREATE TABLE contatos (
  id                   INTEGER PRIMARY KEY AUTOINCREMENT,
  nome                 TEXT    NOT NULL,
  telefone             TEXT    NOT NULL,
  telefone_raw         TEXT,
  email                TEXT,
  cidade               TEXT,
  bairro               TEXT,
  uf                   CHAR(2),
  profissao            TEXT,
  renda_faixa          TEXT
    CHECK(renda_faixa IN ('ate_2sm','2_4sm','4_8sm','acima_8sm')),
  data_nascimento_ano  INTEGER,
  created_at           TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at           TEXT    NOT NULL DEFAULT (datetime('now')),
  deleted_at           TEXT,
  anonimizado_at       TEXT
);
CREATE UNIQUE INDEX idx_con_telefone ON contatos(telefone)
  WHERE deleted_at IS NULL AND anonimizado_at IS NULL;
CREATE INDEX idx_con_email ON contatos(email)
  WHERE deleted_at IS NULL AND email IS NOT NULL;

-- ── LEADS ────────────────────────────────────────────────────────
CREATE TABLE leads (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  contato_id        INTEGER NOT NULL REFERENCES contatos(id),
  empreendimento_id INTEGER          REFERENCES empreendimentos(id),
  tipologia_id      INTEGER          REFERENCES tipologias(id),
  idempotency_key   TEXT    UNIQUE,
  origem            TEXT    NOT NULL
    CHECK(origem IN (
      'portal_organico','portal_pago','google_ads','meta_ads',
      'whatsapp_direto','indicacao','marketplace_zap','marketplace_viva',
      'marketplace_olx','marketplace_facebook','outro'
    )),
  canal             TEXT,
  utm_source        TEXT,
  utm_medium        TEXT,
  utm_campaign      TEXT,
  utm_content       TEXT,
  utm_term          TEXT,
  gclid             TEXT,
  fbclid            TEXT,
  meta_fbc          TEXT,
  meta_fbp          TEXT,
  ip_address        TEXT,
  user_agent        TEXT,
  created_at        TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_lea_contato        ON leads(contato_id);
CREATE INDEX idx_lea_empreendimento ON leads(empreendimento_id);
CREATE INDEX idx_lea_origem         ON leads(origem);
CREATE INDEX idx_lea_created        ON leads(created_at);

-- ── OPORTUNIDADES ────────────────────────────────────────────────
CREATE TABLE oportunidades (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  contato_id        INTEGER NOT NULL REFERENCES contatos(id),
  empreendimento_id INTEGER          REFERENCES empreendimentos(id),
  tipologia_id      INTEGER          REFERENCES tipologias(id),
  lead_id           INTEGER          REFERENCES leads(id),
  estagio           TEXT    NOT NULL DEFAULT 'novo_lead'
    CHECK(estagio IN (
      'novo_lead','em_contato','visita_solicitada','visita_agendada',
      'visita_realizada','proposta_enviada','documentacao',
      'fechado_ganho','fechado_perdido'
    )),
  responsavel_id    INTEGER          REFERENCES usuarios(id),
  valor_negocio     INTEGER,
  data_previsao     TEXT,
  motivo_perda      TEXT,
  observacoes       TEXT,
  prioridade        TEXT    NOT NULL DEFAULT 'media'
    CHECK(prioridade IN ('baixa','media','alta','urgente')),
  created_at        TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT    NOT NULL DEFAULT (datetime('now')),
  fechada_at        TEXT
);
CREATE INDEX idx_opo_estagio      ON oportunidades(estagio)        WHERE fechada_at IS NULL;
CREATE INDEX idx_opo_responsavel  ON oportunidades(responsavel_id) WHERE fechada_at IS NULL;
CREATE INDEX idx_opo_contato      ON oportunidades(contato_id);

-- ── INTERAÇÕES ───────────────────────────────────────────────────
CREATE TABLE interacoes (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  contato_id      INTEGER NOT NULL REFERENCES contatos(id),
  oportunidade_id INTEGER          REFERENCES oportunidades(id),
  usuario_id      INTEGER          REFERENCES usuarios(id),
  tipo            TEXT    NOT NULL
    CHECK(tipo IN ('ligacao','whatsapp','email','visita','anotacao','sistema')),
  direcao         TEXT    CHECK(direcao IN ('entrada','saida','interno')),
  conteudo        TEXT,
  duracao_seg     INTEGER,
  created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_int_contato      ON interacoes(contato_id);
CREATE INDEX idx_int_oportunidade ON interacoes(oportunidade_id);
CREATE INDEX idx_int_created      ON interacoes(created_at);

-- ── AGENDAMENTOS ─────────────────────────────────────────────────
CREATE TABLE agendamentos (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  oportunidade_id   INTEGER          REFERENCES oportunidades(id),
  contato_id        INTEGER NOT NULL REFERENCES contatos(id),
  empreendimento_id INTEGER NOT NULL REFERENCES empreendimentos(id),
  usuario_id        INTEGER          REFERENCES usuarios(id),
  data_hora         TEXT    NOT NULL,
  duracao_min       INTEGER NOT NULL DEFAULT 60,
  status            TEXT    NOT NULL DEFAULT 'solicitado'
    CHECK(status IN (
      'solicitado','confirmado_corretor','confirmado_comprador',
      'realizado','no_show','cancelado_corretor','cancelado_comprador'
    )),
  observacoes       TEXT,
  lembrete_24h_at   TEXT,
  lembrete_1h_at    TEXT,
  created_at        TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_age_data_hora   ON agendamentos(data_hora);
CREATE INDEX idx_age_status      ON agendamentos(status);
CREATE INDEX idx_age_responsavel ON agendamentos(usuario_id);

-- ── TAREFAS ──────────────────────────────────────────────────────
CREATE TABLE tarefas (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo          TEXT    NOT NULL,
  descricao       TEXT,
  tipo            TEXT    CHECK(tipo IN ('ligacao','whatsapp','email','visita','documento','outro')),
  prioridade      TEXT    NOT NULL DEFAULT 'media'
    CHECK(prioridade IN ('baixa','media','alta','urgente')),
  status          TEXT    NOT NULL DEFAULT 'pendente'
    CHECK(status IN ('pendente','em_andamento','concluida','cancelada')),
  oportunidade_id INTEGER REFERENCES oportunidades(id),
  contato_id      INTEGER REFERENCES contatos(id),
  usuario_id      INTEGER NOT NULL REFERENCES usuarios(id),
  data_vencimento TEXT,
  created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  concluida_at    TEXT
);
CREATE INDEX idx_tar_usuario      ON tarefas(usuario_id);
CREATE INDEX idx_tar_vencimento   ON tarefas(data_vencimento) WHERE status = 'pendente';
CREATE INDEX idx_tar_oportunidade ON tarefas(oportunidade_id);

-- ── PROPOSTAS ────────────────────────────────────────────────────
CREATE TABLE propostas (
  id                       INTEGER PRIMARY KEY AUTOINCREMENT,
  numero                   TEXT    NOT NULL UNIQUE,
  oportunidade_id          INTEGER NOT NULL REFERENCES oportunidades(id),
  contato_id               INTEGER NOT NULL REFERENCES contatos(id),
  empreendimento_id        INTEGER NOT NULL REFERENCES empreendimentos(id),
  tipologia_id             INTEGER          REFERENCES tipologias(id),
  usuario_id               INTEGER NOT NULL REFERENCES usuarios(id),
  snapshot_valor_base      INTEGER,
  valor_imovel             INTEGER NOT NULL,
  valor_entrada            INTEGER,
  valor_financiamento      INTEGER,
  valor_fgts               INTEGER,
  fgts_utilizado           INTEGER NOT NULL DEFAULT 0,
  modalidade               TEXT
    CHECK(modalidade IN ('mcmv_faixa1','mcmv_faixa2','mcmv_faixa3','sbpe','consorcio','vista')),
  subsidio_estimado        INTEGER,
  renda_familiar_declarada INTEGER,
  status                   TEXT    NOT NULL DEFAULT 'rascunho'
    CHECK(status IN (
      'rascunho','enviada','em_analise','aceita','recusada','expirada','cancelada'
    )),
  validade_data            TEXT,
  observacoes              TEXT,
  pdf_gerado_at            TEXT,
  created_at               TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at               TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ── SESSÕES ──────────────────────────────────────────────────────
CREATE TABLE sessoes (
  id          TEXT    PRIMARY KEY,
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id),
  cf_jwt_jti  TEXT    UNIQUE,
  ip_address  TEXT,
  user_agent  TEXT,
  criada_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  expira_at   TEXT    NOT NULL,
  revogada_at TEXT
);
CREATE INDEX idx_ses_usuario    ON sessoes(usuario_id);
CREATE INDEX idx_ses_cf_jwt_jti ON sessoes(cf_jwt_jti);
CREATE INDEX idx_ses_expira     ON sessoes(expira_at) WHERE revogada_at IS NULL;

-- ── AUDIT LOG ────────────────────────────────────────────────────
CREATE TABLE audit_log (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id       INTEGER REFERENCES usuarios(id),
  tabela           TEXT    NOT NULL,
  registro_id      INTEGER NOT NULL,
  acao             TEXT    NOT NULL CHECK(acao IN ('INSERT','UPDATE','DELETE')),
  dados_anteriores TEXT,
  dados_novos      TEXT,
  ip_address       TEXT,
  created_at       TEXT    NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_aud_tabela  ON audit_log(tabela, registro_id);
CREATE INDEX idx_aud_usuario ON audit_log(usuario_id);
CREATE INDEX idx_aud_created ON audit_log(created_at);

-- ── CONSENTIMENTOS LGPD ──────────────────────────────────────────
CREATE TABLE consentimentos_lgpd (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  contato_id     INTEGER NOT NULL REFERENCES contatos(id),
  tipo           TEXT    NOT NULL
    CHECK(tipo IN (
      'uso_dados_crm','comunicacao_marketing','contato_whatsapp',
      'contato_email','compartilhamento_parceiros'
    )),
  concedido      INTEGER NOT NULL DEFAULT 1,
  canal          TEXT    CHECK(canal IN ('portal_web','whatsapp','telefone','presencial')),
  texto_versao   TEXT    NOT NULL,
  base_legal     TEXT    NOT NULL DEFAULT 'consentimento'
    CHECK(base_legal IN (
      'consentimento','contrato','legitimo_interesse','obrigacao_legal'
    )),
  ip_address     TEXT,
  created_at     TEXT    NOT NULL DEFAULT (datetime('now')),
  revogado_at    TEXT
);
CREATE INDEX idx_lgpd_contato ON consentimentos_lgpd(contato_id);

-- ── ANONIMIZAÇÕES LGPD ───────────────────────────────────────────
CREATE TABLE anonimizacoes_lgpd (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  contato_id       INTEGER NOT NULL REFERENCES contatos(id),
  tipo             TEXT    NOT NULL
    CHECK(tipo IN (
      'esquecimento_solicitado','retencao_expirada','ip_leads_90d'
    )),
  executado_por    INTEGER          REFERENCES usuarios(id),
  executado_at     TEXT    NOT NULL DEFAULT (datetime('now')),
  campos_afetados  TEXT    NOT NULL
);

-- ── CONFIGURAÇÕES ────────────────────────────────────────────────
CREATE TABLE configuracoes (
  chave      TEXT PRIMARY KEY,
  valor      TEXT,
  descricao  TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by INTEGER REFERENCES usuarios(id)
);
INSERT INTO configuracoes VALUES
  ('crm.versao_consentimento_atual', 'v2026-11',
   'Versão do texto de consentimento LGPD em vigor', datetime('now'), NULL),
  ('lgpd.retencao_ip_dias', '90',
   'Dias para anonimizar IP/UA de leads', datetime('now'), NULL),
  ('lgpd.retencao_inativo_anos', '2',
   'Anos sem interação para anonimização automática de contato', datetime('now'), NULL),
  ('lgpd.prazo_esquecimento_dias', '30',
   'Dias após deleted_at para anonimizar dados pessoais', datetime('now'), NULL),
  ('auth.sessao_duracao_horas', '8',
   'Duração da sessão Access antes de reautenticação', datetime('now'), NULL);

-- ── REGISTRO DA MIGRAÇÃO ─────────────────────────────────────────
INSERT INTO _migrations (version, descricao) VALUES
  ('0001', 'Schema inicial V1.1 — 12 tabelas, índices, configurações');
