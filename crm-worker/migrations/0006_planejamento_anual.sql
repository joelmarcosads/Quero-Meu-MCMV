-- ─── Migration 0006 — Módulo Planejamento Anual ──────────────────────────────
-- Market Imobi CRM · Missão 7+ · feat/market-imobi-crm-staging
-- STAGING ONLY — não aplicar em produção sem autorização expressa

-- ─── Configuração fixa dos 9 canais (seed do sistema) ────────────────────────
CREATE TABLE IF NOT EXISTS config_canais (
  canal_id            TEXT    PRIMARY KEY,
  nome                TEXT    NOT NULL,
  peso                REAL    NOT NULL DEFAULT 0,          -- peso estratégico 0–100
  nucleo              INTEGER NOT NULL DEFAULT 0,          -- 1=canal núcleo
  mes_entrada_padrao  INTEGER NOT NULL DEFAULT 1,          -- 1=jan … 12=dez
  tipo_funil          TEXT    NOT NULL DEFAULT 'leads'
    CHECK(tipo_funil IN ('leads','social','relacionamento')),
  taxa_agenda         REAL    NOT NULL DEFAULT 0,          -- % leads → agendamento
  taxa_comparece      REAL    NOT NULL DEFAULT 0,          -- % agendados → visita
  taxa_fecha          REAL    NOT NULL DEFAULT 0,          -- % visitas → venda
  taxa_visita_social  REAL    NOT NULL DEFAULT 0,          -- % contatos → visita (social/lista)
  taxa_fecha_social   REAL    NOT NULL DEFAULT 0,          -- % visita → fecha (social/lista)
  divide_comissao     INTEGER NOT NULL DEFAULT 0,          -- 1=divide
  pct_divisao         REAL    NOT NULL DEFAULT 100,        -- % que fica com o corretor
  icone               TEXT    NOT NULL DEFAULT '📊',
  acoes               TEXT    NOT NULL DEFAULT '[]'        -- JSON: 3 ações do canal
);

-- Seed: 9 canais com benchmarks do mercado imobiliário brasileiro
INSERT OR IGNORE INTO config_canais VALUES
  ('trafego_pago',      'Tráfego Pago',           40, 1, 2,  'leads',
   0.195, 0.30, 0.20, 0, 0, 0, 100, '📱',
   '["Criar campanha de leads com vídeo de apresentação","Responder todos os leads em até 5 minutos","Acompanhar CPL semanalmente e pausar anúncios fora do limite"]'),
  ('social_selling',    'Social Selling',          15, 1, 2,  'social',
   0, 0, 0, 0.015, 0.10, 0, 100, '📲',
   '["Publicar 1 conteúdo por dia no Instagram","Enviar DM para engajamentos quentes","Criar Stories com enquetes de interesse"]'),
  ('lista_fria',        'Lista Fria / Base',       15, 1, 1,  'social',
   0, 0, 0, 0.015, 0.10, 0, 100, '📋',
   '["Disparar mensagem de oferta do mês para toda a base","Fazer follow-up em 3 etapas nos que abriram","Reativar com vídeo curto de empreendimento"]'),
  ('indicacao',         'Indicação de Clientes',   10, 1, 1,  'relacionamento',
   0, 0, 0, 0.30, 0.20, 0, 100, '🤝',
   '["Pedir indicação em todo pós-venda com script simples","Criar grupo VIP de clientes satisfeitos","Enviar cartão de agradecimento + oferta para indicados"]'),
  ('prospeccao_ativa',  'Prospecção Ativa',         8, 0, 1,  'social',
   0, 0, 0, 0.01, 0.10, 0, 100, '📞',
   '["Bloco fixo de 1h de prospecção todo dia útil","Script de abordagem contextualizado por bairro","Registrar todas as abordagens no CRM"]'),
  ('portais',           'Portais (ZAP/Viva/OLX)',   6, 0, 4,  'leads',
   0.15, 0.30, 0.20, 0, 0, 0, 100, '🏠',
   '["Atualizar anúncios com fotos profissionais","Responder mensagens do portal em até 2h","Destacar diferenciais do MCMV nos títulos"]'),
  ('google_meu_negocio','Google Meu Negócio',        3, 0, 4,  'leads',
   0.15, 0.30, 0.20, 0, 0, 0, 100, '🔍',
   '["Pedir avaliação a todo cliente atendido","Publicar foto de imóvel novo toda semana","Responder todas as avaliações em até 24h"]'),
  ('parcerias',         'Parcerias',                 2, 0, 2,  'relacionamento',
   0, 0, 0, 0.50, 0.20, 1, 50,  '🤲',
   '["Listar 5 colegas corretores para parceria","Compartilhar carteira toda semana no grupo","Definir regras de divisão por escrito antes"]'),
  ('construtora',       'Construtora / Lançamentos', 1, 0, 4,  'relacionamento',
   0, 0, 0, 0.30, 0.20, 0, 100, '🏗️',
   '["Credenciar-se em 2 construtoras locais","Meta de 3 unidades por lançamento","Participar de todos os eventos de lançamento"]');

-- ─── Configuração de CPL por faixa de ticket ─────────────────────────────────
CREATE TABLE IF NOT EXISTS config_cpl (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  faixa           INTEGER NOT NULL,                        -- 1,2,3,4
  ticket_ate      REAL,                                    -- NULL = acima de tudo
  cpl_padrao      REAL    NOT NULL,
  fator_metodo    REAL    NOT NULL DEFAULT 0.70,           -- fator com método (-30%)
  cpl_com_metodo  REAL    NOT NULL
);

INSERT OR IGNORE INTO config_cpl (faixa, ticket_ate, cpl_padrao, fator_metodo, cpl_com_metodo) VALUES
  (1,  500000,  12.50, 0.70,  8.75),
  (2,  800000,  22.50, 0.70, 15.75),
  (3, 2000000,  45.00, 0.70, 31.50),
  (4, NULL,     90.00, 0.70, 63.00);

-- ─── Plano anual (1 por corretor por ano) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS plano_anual (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id      INTEGER NOT NULL REFERENCES usuarios(id),
  ano_referencia  INTEGER NOT NULL,                        -- ano do plano (ex: 2027)
  ano_base        INTEGER NOT NULL,                        -- ano de comparação (ex: 2026)
  tipo_corretor   TEXT    NOT NULL DEFAULT 'autonomo'
    CHECK(tipo_corretor IN ('autonomo','imobiliaria')),
  comissao_base   REAL    NOT NULL,                        -- comissão total recebida ano base (R$)
  pct_comissao    REAL    NOT NULL,                        -- % de comissão cobrada (ex: 5.00)
  ticket_medio    REAL    NOT NULL,                        -- ticket médio (R$)
  imoveis_base    REAL    NOT NULL,                        -- imóveis vendidos no ano base
  meta_comissao   REAL    NOT NULL,                        -- meta de comissão ano referência (R$)
  status          TEXT    NOT NULL DEFAULT 'rascunho'
    CHECK(status IN ('rascunho','ativo','concluido')),
  created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE(usuario_id, ano_referencia)
);

CREATE INDEX IF NOT EXISTS idx_plano_usuario ON plano_anual(usuario_id);
CREATE INDEX IF NOT EXISTS idx_plano_ano     ON plano_anual(ano_referencia);

-- ─── Canais do plano (9 linhas por plano) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS plano_canal (
  id                    INTEGER PRIMARY KEY AUTOINCREMENT,
  plano_id              INTEGER NOT NULL REFERENCES plano_anual(id) ON DELETE CASCADE,
  canal_id              TEXT    NOT NULL REFERENCES config_canais(canal_id),
  ativo                 INTEGER NOT NULL DEFAULT 0,        -- 1=ativo
  imoveis_base          REAL    NOT NULL DEFAULT 0,        -- imóveis deste canal no ano base
  mes_entrada           INTEGER NOT NULL,                  -- mês de ativação planejado
  meta_mensal_ajustada  REAL,                              -- sobrescrita manual (opcional)
  created_at            TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at            TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE(plano_id, canal_id)
);

CREATE INDEX IF NOT EXISTS idx_plano_canal_plano ON plano_canal(plano_id);

-- ─── Progresso mensal realizado vs meta ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS plano_progresso_mes (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  plano_canal_id      INTEGER NOT NULL REFERENCES plano_canal(id) ON DELETE CASCADE,
  mes                 INTEGER NOT NULL CHECK(mes BETWEEN 1 AND 12),
  leads_recebidos     INTEGER NOT NULL DEFAULT 0,
  visitas_realizadas  INTEGER NOT NULL DEFAULT 0,
  imoveis_vendidos    REAL    NOT NULL DEFAULT 0,
  comissao_recebida   REAL    NOT NULL DEFAULT 0,
  created_at          TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at          TEXT    NOT NULL DEFAULT (datetime('now')),
  UNIQUE(plano_canal_id, mes)
);

CREATE INDEX IF NOT EXISTS idx_progresso_canal ON plano_progresso_mes(plano_canal_id);
CREATE INDEX IF NOT EXISTS idx_progresso_mes   ON plano_progresso_mes(mes);
