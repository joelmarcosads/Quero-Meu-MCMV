-- ================================================================
-- Market Imobi CRM — Migração 0002: Dados fictícios para PoC
-- ⚠️  DADOS 100% FICTÍCIOS — APENAS PARA TESTES
-- Nomes, telefones, endereços e valores são inventados
-- ================================================================

-- ── USUÁRIOS FICTÍCIOS ───────────────────────────────────────────
INSERT INTO usuarios (nome, email, perfil, creci, cf_access_id) VALUES
  ('Admin Fictício',    'admin@teste-poc.invalid',    'admin',      NULL,          'cf-sub-admin-0001'),
  ('Corretor Fictício', 'corretor@teste-poc.invalid', 'corretor',   'RJ-12345',    'cf-sub-corretor-0002'),
  ('Assistente Fictício','assist@teste-poc.invalid',  'assistente', NULL,          'cf-sub-assist-0003');

-- ── EMPREENDIMENTOS FICTÍCIOS ────────────────────────────────────
INSERT INTO empreendimentos
  (slug, nome, construtora, status, faixa_mcmv, logradouro, numero, bairro, cidade, uf, cep, lat, lng, area_privativa_min, area_privativa_max, valor_min, valor_max, descricao)
VALUES
  ('residencial-flores-itaborai',
   'Residencial Flores do Campo',
   'Construtora Fictícia Beta Ltda',
   'lancamento', 2,
   'Rua das Flores Fictícias', '100', 'Jardim Fictício',
   'Itaboraí', 'RJ', '24800000',
   -22.7666, -42.8617,
   42.0, 56.0,
   22000000, 35000000,
   'DADO FICTÍCIO — Apartamentos de 2 e 3 quartos no programa MCMV faixa 2.'),
  ('viver-bem-sao-goncalo',
   'Viver Bem São Gonçalo',
   'Incorporadora Fictícia Gama S.A.',
   'em_obras', 3,
   'Av. Fictícia do Progresso', '500', 'Bairro Fictício Zona Norte',
   'São Gonçalo', 'RJ', '24400000',
   -22.8270, -43.0540,
   55.0, 72.0,
   35000000, 55000000,
   'DADO FICTÍCIO — Apartamentos de 2 a 3 quartos MCMV faixa 3.');

-- ── TIPOLOGIAS FICTÍCIAS ─────────────────────────────────────────
INSERT INTO tipologias
  (empreendimento_id, nome, quartos, suites, banheiros, vagas, area_m2,
   situacao_comercial, valor_base, valor_entrada_min, valor_parcela_estimada,
   condicoes_validade, condicoes_fonte, caracteristicas_json)
VALUES
  (1, 'Tipo A — 2 quartos 42m²', 2, 0, 1, 1, 42.0,
   'disponivel', 22000000, 2200000, 120000,
   '2026-12-31', 'tabela_ficticia_v1_nov2026',
   '["academia","playground","salao_de_festas"]'),
  (1, 'Tipo B — 3 quartos 56m²', 3, 1, 2, 1, 56.0,
   'disponivel', 35000000, 3500000, 190000,
   '2026-12-31', 'tabela_ficticia_v1_nov2026',
   '["academia","playground","salao_de_festas","churrasqueira"]'),
  (2, 'Tipo C — 2 quartos 55m²', 2, 1, 2, 1, 55.0,
   'disponivel', 40000000, 4000000, 220000,
   '2026-11-30', 'tabela_ficticia_v2_nov2026',
   '["piscina","academia","portaria_24h"]'),
  (2, 'Tipo D — 3 quartos 72m²', 3, 1, 2, 2, 72.0,
   'em_negociacao', 55000000, 5500000, 300000,
   '2026-11-30', 'tabela_ficticia_v2_nov2026',
   '["piscina","academia","portaria_24h","gourmet"]');

-- ── REGISTRO DA MIGRAÇÃO ─────────────────────────────────────────
INSERT INTO _migrations (version, descricao) VALUES
  ('0002', 'Dados fictícios para PoC — 3 usuários, 2 empreendimentos, 4 tipologias');
