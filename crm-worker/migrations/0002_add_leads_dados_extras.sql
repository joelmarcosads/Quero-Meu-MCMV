-- ================================================================
-- Market Imobi CRM — Migração 0002
-- Objetivo: adicionar coluna dados_extras_json à tabela leads
--
-- Esta migração é NÃO-DESTRUTIVA (ADD COLUMN sem NOT NULL constraint).
-- Nenhum dado existente é alterado. Registros anteriores terão NULL.
-- ================================================================

-- Armazena campos específicos do formulário MCMV que não têm coluna
-- dedicada na tabela leads: quartos, faixa, renda, regime_trabalho,
-- pagamento, primeira_compra, prazo, pagina, referrer.
-- Formato: JSON {"quartos":"2 quartos","faixa":"Faixa 2","renda":"..."}
ALTER TABLE leads ADD COLUMN dados_extras_json TEXT;

-- Índice parcial para facilitar queries por empreendimento+dados_extras no futuro
-- (omitido por ora — ADD INDEX em SQLite requer criação separada)

-- Registro da migração
INSERT INTO _migrations (version, descricao) VALUES
  ('0002', 'ADD COLUMN leads.dados_extras_json — campos MCMV extras do portal');
