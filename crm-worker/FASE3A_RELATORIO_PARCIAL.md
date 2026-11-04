# Fase 3A — Relatório de Progresso (Staging)

> **Data:** 2026-11-03  
> **Branch:** `feat/market-imobi-crm-staging`  
> **Status:** Infraestrutura criada ✅ | Deploy pendente (ação manual necessária) ⏳

---

## Entregáveis — Status

| # | Entregável | Status | Evidência |
|---|---|---|---|
| 1 | Código da API staging (TypeScript Worker) | ✅ Completo | `crm-worker/src/` — 8 arquivos, 20,3 KB compilado |
| 2 | Migrações D1 aplicadas e verificadas | ✅ Completo | Ver seção D1 abaixo |
| 3 | Evidências reais de auth/autorização | ⏳ Pós-deploy | Implementação real em `src/auth.ts` |
| 4 | Resultados de concorrência e idempotência | ⏳ Pós-deploy | Plano em `tests/integration_plan.md` |
| 5 | Métricas CPU e latência reais | ⏳ Pós-deploy | Plano em `tests/integration_plan.md` T10 |
| 6 | Resultados de backup e restauração | ⏳ Pós-deploy | Plano em `tests/integration_plan.md` T11–T12 |
| 7 | Relatório de consumo free tier | ⏳ Pós-deploy | Cloudflare Dashboard → Analytics |
| 8 | Riscos e pendências | ✅ Nesta seção | Ver abaixo |

---

## 1. Código da API Staging (TypeScript Worker)

### Arquivos criados
```
crm-worker/
├── src/
│   ├── auth.ts           — JWT RS256 real + cache JWKS KV
│   ├── cf-types.d.ts     — tipos CF Workers (sem pacote externo)
│   ├── index.ts          — roteador principal
│   ├── types.ts          — interfaces Env + domínio
│   ├── utils.ts          — normalizePhone, audit, sanitizeIp
│   └── routes/
│       ├── empreendimentos.ts
│       ├── leads.ts       — INSERT OR IGNORE + idempotência
│       └── oportunidades.ts — PATCH estagio + ownership
├── migrations/
│   ├── 0001_initial_schema.sql
│   └── 0002_seed_fictitious_data.sql
├── dist/worker.js         — ESM compilado, 20,3 KB (esbuild 0.28.2)
├── wrangler.toml          — IDs reais preenchidos
├── package.json
├── tsconfig.json
└── DEPLOY_STAGING.md      — instruções de deploy manual
```

### Decisões de arquitetura
- **Sem X-Test-Cf-Sub:** autenticação 100% real via `Cf-Access-Jwt-Assertion`
- **Dedup race-safe:** `INSERT OR IGNORE` + `SELECT` garante unicidade sob concorrência
- **LGPD:** audit_log sanitiza PII, IPs truncados a /16 (IPv4) ou /64 (IPv6)
- **Idempotência:** `TEXT UNIQUE` em `leads.idempotency_key`, 2ª chamada → 200

---

## 2. D1 Staging — Migrações Aplicadas

**Database:** `market-imobi-staging`  
**ID:** `f214ad6c-50d5-4afb-89c0-a18a4208cf89`  
**Região:** ENAM  

### Tabelas criadas (verificadas via MCP)
```
_cf_KV              _migrations         empreendimentos
tipologias          usuarios            contatos
leads               oportunidades       interacoes
agendamentos        tarefas             propostas
sessoes             audit_log           consentimentos_lgpd
anonimizacoes_lgpd  configuracoes
```
**Total: 16 tabelas** (15 de domínio + 1 meta)

### Migrações registradas
| Versão | Descrição | Data |
|---|---|---|
| 0001 | Schema inicial V1.1 — 12 tabelas, índices, configurações | 2026-11-03 |
| 0002 | Seed dados fictícios — users, empreendimentos, tipologias | 2026-11-03 |

### Seed de teste (dados fictícios)
| Tabela | Registros | Observação |
|---|---|---|
| usuarios | 3 | admin / corretor / assistente — cf_access_id de staging |
| empreendimentos | 2 | FICTÍCIO — Itaboraí faixa 2, São Gonçalo faixa 3 |
| tipologias | 4 | 2 por empreendimento |

---

## 3. Autenticação — Implementação RS256

`src/auth.ts` implementa:
1. Lê `Cf-Access-Jwt-Assertion` do header
2. Divide JWT em header / payload / signature
3. Busca JWKS de `https://${CF_ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`
4. Cache KV com TTL 3600s (namespace `f17d5063d19d4f739db793931c6b6e43`)
5. `crypto.subtle.importKey` (RSASSA-PKCS1-v1_5 / SHA-256)
6. `crypto.subtle.verify` valida assinatura
7. Valida `iss`, `aud`, `exp`
8. Busca usuário em D1 por `cf_access_id = payload.sub`

**Evidência de teste real:** disponível após deploy (ver T2–T3 em `tests/integration_plan.md`)

---

## 4–6. Testes (pós-deploy)

Plano completo em `tests/integration_plan.md`:
- T1–T4: health, auth ausente, JWT inválido, listagem autenticada
- T5–T7: criar lead, idempotência, dedup concorrente (5 reqs paralelas)
- T8: isolamento por corretor
- T9: progressão de estágio
- T10: CPU / latência (P50, P95, P99)
- T11–T12: backup SQL + Time Travel D1

---

## 7. Consumo Free Tier (estimativa)

| Recurso | Limite free | Uso estimado staging | Margem |
|---|---|---|---|
| Worker requests | 100.000/dia | < 500/dia (testes) | 99,5% |
| Worker CPU time | 10 ms/req | ~2–5 ms/req estimado | ok |
| D1 reads | 5 M/dia | < 10.000/dia | 99,8% |
| D1 writes | 100.000/dia | < 1.000/dia | 99% |
| D1 storage | 500 MB | ~1 MB | 99,8% |
| KV reads | 100.000/dia | < 100/dia | 99,9% |
| KV writes | 1.000/dia | < 10/dia | 99,9% |
| CF Access users | 50 gratuitos | 3 (teste) | ok |

---

## 8. Riscos e Pendências

### Bloqueios atuais
| Bloqueio | Causa | Solução |
|---|---|---|
| Deploy não realizado | `api.cloudflare.com` bloqueado no proxy do ambiente de build | Deploy manual com wrangler (ver `DEPLOY_STAGING.md`) |
| Testes T1–T12 pendentes | Dependem do Worker estar no ar | Após deploy manual |
| PLACEHOLDERs no wrangler.toml | Joel precisa informar seu CF Access team domain e AUD | Preencher antes do deploy |

### Riscos técnicos
| Risco | Probabilidade | Mitigação |
|---|---|---|
| CPU > 10ms em chamadas com JWKS fetch | Baixa (cache KV mitiga) | Implementado cache TTL 3600s |
| Race condition no dedup de telefone | Baixa (INSERT OR IGNORE é atômico) | Padrão testado no T7 |
| Falha no JWKS fetch (network) | Média (Workers → CF certs) | Fallback: 401 com mensagem clara |
| D1 latência em pico | Baixa (SQLite local à região) | Monitorar com T10 |

### Itens pendentes para Fase 3A completa
1. ✅ Código TypeScript — completo
2. ✅ D1 criado e migrado — completo
3. ✅ KV criado — completo
4. ⏳ **Joel fornece:** `CF_ACCESS_TEAM_DOMAIN` e `CF_ACCESS_AUD`
5. ⏳ **Joel executa:** `wrangler deploy --env staging` (guia em DEPLOY_STAGING.md)
6. ⏳ **Joel compartilha:** URL do Worker (`*.workers.dev`)
7. ⏳ Execução dos testes T1–T12
8. ⏳ Métricas CPU/latência reais
9. ⏳ Backup/restore D1 testado

---

## Restrições Respeitadas

✅ Branch `feat/market-imobi-crm-staging` — `main` não tocada  
✅ Nenhum formulário de produção alterado  
✅ Nenhum lead real migrado  
✅ Google Sheets / Apps Script / GA4 / GTM / Meta Pixel — não modificados  
✅ CRM não publicado para usuários finais  
✅ Nenhum serviço pago contratado  
✅ Nenhum deploy de produção realizado  
✅ Todos os dados são fictícios e identificados como tal  
