-- =============================================================================
-- PROPOSTA DE MIGRATION — NÃO APLICAR SEM AUTORIZAÇÃO EXPLÍCITA
-- =============================================================================
-- Arquivo: 0004_captacoes_conflito.sql.proposed
-- Objetivo: Criar tabela captacoes_conflito para captações onde telefone e
--           e-mail pertencem a contatos diferentes (conflito de identidade).
--
-- STATUS: PROPOSTA — requer:
--   1. Autorização explícita do responsável técnico
--   2. Aplicar APENAS no ambiente de staging (market-imobi-staging)
--      após homologação completa
--   3. Produção (market-imobi-prod) NÃO deve receber sem validação no staging
--
-- MOTIVAÇÃO:
--   Quando tel → Contato A e email → Contato B, não é possível vincular
--   o lead a um contato sem revisão humana. A tabela `leads` exige
--   contato_id NOT NULL, impossibilitando leads "sem contato".
--   captacoes_conflito armazena o payload completo + os dois contato_id
--   envolvidos, e fica pendente de resolução manual pelo corretor.
--
-- ROLLBACK:
--   DROP TABLE IF EXISTS captacoes_conflito;
--
-- =============================================================================

CREATE TABLE captacoes_conflito (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,

  -- Os dois contatos conflitantes (NÃO mesclar automaticamente)
  tel_contato_id    INTEGER NOT NULL REFERENCES contatos(id),
  email_contato_id  INTEGER NOT NULL REFERENCES contatos(id),

  -- Dados da captação original (para criar lead após resolução)
  origem            TEXT    NOT NULL,
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
  idempotency_key   TEXT    UNIQUE,
  ip_address        TEXT,
  user_agent        TEXT,

  -- Payload completo serializado para auditoria (sem PII de texto livre)
  payload_json      TEXT,

  -- Status de resolução
  status            TEXT    NOT NULL DEFAULT 'pendente'
    CHECK(status IN ('pendente','resolvido_tel','resolvido_email','descartado')),
  resolvido_por     INTEGER REFERENCES usuarios(id),
  resolvido_at      TEXT,

  -- Lead gerado após resolução manual (NULL até que resolvido)
  lead_id_gerado    INTEGER REFERENCES leads(id),

  created_at        TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Índices para o painel admin
CREATE INDEX idx_cconf_pendente   ON captacoes_conflito(status)         WHERE status = 'pendente';
CREATE INDEX idx_cconf_tel        ON captacoes_conflito(tel_contato_id);
CREATE INDEX idx_cconf_email      ON captacoes_conflito(email_contato_id);
CREATE INDEX idx_cconf_created    ON captacoes_conflito(created_at);
CREATE INDEX idx_cconf_idempotent ON captacoes_conflito(idempotency_key) WHERE idempotency_key IS NOT NULL;

-- Registro da migração
INSERT INTO _migrations (version, descricao) VALUES
  ('0004', 'CREATE TABLE captacoes_conflito — captações pendentes de resolução humana');

-- =============================================================================
-- NOTAS PÓS-APLICAÇÃO
-- =============================================================================
-- 1. GET /api/v1/conflitos            → listar captacoes_conflito pendentes
-- 2. POST /api/v1/conflitos/:id/resolver → criar lead vinculado ao contato
--    escolhido (tel ou email), atualizar status para 'resolvido_tel' ou
--    'resolvido_email', preencher lead_id_gerado e resolvido_por
-- 3. Verificar os cenários:
--    a. POST /api/v1/public/leads com tel→C1 e email→C2
--       → HTTP 200 silencioso + registro em captacoes_conflito
--    b. POST /api/v1/leads (admin) com mesmo cenário
--       → HTTP 409 + { conflito_id, status: 'conflito_pendente' }
-- =============================================================================
