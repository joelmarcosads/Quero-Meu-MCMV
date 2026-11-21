-- Migration 0007 — Módulo WhatsApp Cloud API
-- Market Imobi CRM — feat/market-imobi-crm-staging (STAGING ONLY)
-- Aplica SOMENTE ao D1 market-imobi-staging (f214ad6c-50d5-4afb-89c0-a18a4208cf89)
-- Propósito: registrar todos os envios de mensagens WhatsApp para rastreabilidade,
--            idempotência e auditoria (nenhuma mensagem enviada duas vezes por engano).

-- ─── Tabela principal de log ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS whatsapp_mensagens (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  idempotency_key  TEXT    NOT NULL UNIQUE,       -- cliente garante dedup
  destinatario     TEXT    NOT NULL,               -- E.164: +5521XXXXXXXXX
  tipo             TEXT    NOT NULL DEFAULT 'test',-- 'test' | 'lead_new' | 'visit_reminder'
  template_name    TEXT,                           -- nome do template Meta aprovado
  template_lang    TEXT    DEFAULT 'pt_BR',
  payload_json     TEXT    NOT NULL,               -- corpo completo enviado à Graph API
  status           TEXT    NOT NULL DEFAULT 'pending',
                                                   -- 'pending'|'sent'|'failed'|'skipped'
  wa_message_id    TEXT,                           -- wamid retornado pela Meta
  error_code       INTEGER,                        -- código de erro Meta (se houver)
  error_message    TEXT,                           -- mensagem de erro legível
  enviado_por      INTEGER REFERENCES usuarios(id),-- usuário que disparou
  lead_id          INTEGER REFERENCES leads(id),   -- lead relacionado (nullable para tests)
  created_at       TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
  updated_at       TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_wa_mensagens_destinatario ON whatsapp_mensagens(destinatario);
CREATE INDEX IF NOT EXISTS idx_wa_mensagens_status       ON whatsapp_mensagens(status);
CREATE INDEX IF NOT EXISTS idx_wa_mensagens_tipo         ON whatsapp_mensagens(tipo);
CREATE INDEX IF NOT EXISTS idx_wa_mensagens_lead         ON whatsapp_mensagens(lead_id);

-- ─── Número de teste Meta (provisionado pelo App) ─────────────────────────────
-- Todo Meta App para WhatsApp Cloud API inclui um número de teste gratuito:
--   - Phone Number ID: visível em developers.facebook.com → App → WhatsApp → Getting Started
--   - Permite enviar até 5 destinatários de teste registrados sem WABA verificada
--   - Templates pré-aprovados: 'hello_world' (en_US)
-- Configuração via secrets (nunca hardcoded):
--   WA_PHONE_NUMBER_ID   — Phone Number ID do número de teste do App
--   WA_ACCESS_TOKEN      — System User Token ou App Token temporário
-- Para produção futura (número dedicado real), apenas rotacionar os secrets acima.
