# Market Imobi CRM — Fase 3A: Relatório de Homologação Revisado

> **Versão:** 2.0  
> **Data:** 2026-11-03  
> **Branch:** feat/market-imobi-crm-staging  
> **Status geral:** PARCIALMENTE HOMOLOGADO

---

## Matriz T1–T12 Revisada

| # | Teste | Classificação | Ferramenta | Status | Evidência |
|---|-------|--------------|------------|--------|-----------|
| T1 | Health check Worker `/health` | Browser manual | Navegador (CF Access) | ✅ APROVADO | Joel confirmou 200 OK no navegador |
| T2 | JWT válido → 200 / JWT inválido → 401 | HTTP real Worker | CF Access Service Token (proposto) | ⏳ PENDENTE | Workflow preparado; requer Service Token + patch auth.ts |
| T3 | JWT inválido → 401 (assinatura, exp, iss, aud) | Teste local unitário | node:test / t1_t9_local.mjs | ✅ APROVADO | 45/45 pass em 476 ms |
| T4 | Token expirado → 401 | Teste local unitário | node:test / t1_t9_local.mjs | ✅ APROVADO | idem |
| T5 | Perfil sem permissão → 403 | Teste local unitário | node:test / t1_t9_local.mjs | ✅ APROVADO | idem |
| T6 | Ownership corretor → isolamento | Teste local unitário | node:test / t1_t9_local.mjs | ✅ APROVADO | idem |
| T7 | Idempotência — chave duplicada → 200 | Teste local unitário | node:test / t1_t9_local.mjs | ✅ APROVADO | idem |
| T8 | Deduplicação `INSERT OR IGNORE` via telefone | SQL direto D1 | MCP D1 query contra staging | ✅ APROVADO | SELECT confirmou dedup; não passou pelo Worker HTTP |
| T9 | LGPD — truncamento de IP (/16 IPv4, /64 IPv6) | Teste local unitário | node:test / t1_t9_local.mjs | ✅ APROVADO | idem |
| T10 | Latência Worker CPU P50/P95/P99 | HTTP real Worker | k6 + CF Analytics (proposto) | ⏳ PENDENTE | Workflow k6 preparado; requer Service Token + deploy |
| T11 | Criação de lead via API real | HTTP real Worker | CF Access Service Token (proposto) | ⏳ PENDENTE | Workflow preparado; requer Service Token + patch auth.ts |
| T12 | Backup/restore em banco D1 descartável | SQL direto D1 (restauração manual) | MCP D1 / banco descartável excluído | ⚠️ PARCIAL | Ciclo SQL executado; Time Travel nativo bloqueado |

**Contagem:** 8 aprovados ✅ / 1 parcial ⚠️ / 3 pendentes ⏳ / 0 reprovados ❌

---

## Detalhamento T12 — PARCIAL

### O que foi executado

Banco descartável `market-imobi-backup-test-20261103` (UUID `5889e882-b5f6-45b7-b949-240a6e549621`):

| Etapa | Operação | Resultado |
|-------|----------|-----------|
| Criação do banco | `d1_database_create` | ✅ Criado em ENAM/ATL |
| Migração 0001 | 16 tabelas + índices (com `ip_anonimizado`) | ✅ |
| Migração 0002 | 3 usuários, 2 empreendimentos, 4 tipologias | ✅ |
| Verificação inicial | 2 migrações, 5 config, 3 usuários, 2 empr., 4 tip. | ✅ |
| Simular exclusão | `DELETE FROM usuarios WHERE id=2` (Corretor Fictício) | ✅ |
| Simular alteração | `UPDATE tipologias SET situacao_comercial='vendido', valor_base=99999999 WHERE id=4` | ✅ |
| Restaurar por SQL snapshot | `INSERT` + `UPDATE` com valores originais | ✅ |
| Verificação pós-restauro | 3/3 usuários, Tipo D = `em_negociacao` / 55000000 | ✅ |
| Excluir banco descartável | `d1_database_delete` confirmada | ✅ |

**Por que é PARCIAL e não APROVADO:**  
A restauração executada foi via SQL manual (re-INSERT e re-UPDATE), não via D1 Time Travel nativo (`wrangler d1 time-travel restore`). Time Travel cria bookmarks automáticos a cada escrita e permite restaurar o banco a qualquer ponto no tempo — esse mecanismo não foi validado.

### Por que Time Travel não foi executado

`wrangler d1 time-travel restore` requer acesso a `api.cloudflare.com`. O container CI bloqueia esse endpoint (blocklist de proxy). Tentativa de `curl https://api.cloudflare.com` resulta em connection refused.

### Procedimento para concluir T12 (executar em ambiente com rede desbloqueada)

```bash
# 1. Criar banco descartável
wrangler d1 create market-imobi-backup-test-$(date +%Y%m%d)
# → anotar UUID gerado

# 2. Aplicar migrações
wrangler d1 execute <UUID> --file=crm-worker/migrations/0001_initial_schema.sql
wrangler d1 execute <UUID> --file=crm-worker/migrations/0002_seed_fictitious_data.sql

# 3. Capturar bookmark "antes"
wrangler d1 time-travel info <UUID>
# → anotar timestamp do bookmark mais recente

# 4. Simular dano
wrangler d1 execute <UUID> --command="DELETE FROM usuarios WHERE id=2"
wrangler d1 execute <UUID> --command="UPDATE tipologias SET valor_base=99999999 WHERE id=4"

# 5. Restaurar via Time Travel
wrangler d1 time-travel restore <UUID> --timestamp=<TIMESTAMP_ANTES>

# 6. Verificar integridade
wrangler d1 execute <UUID> --command="SELECT id, nome FROM usuarios ORDER BY id"
wrangler d1 execute <UUID> --command="SELECT id, valor_base FROM tipologias WHERE id=4"

# 7. Excluir banco descartável
wrangler d1 delete <UUID>
```

---

## Detalhamento T2, T10, T11 — PENDENTES

### Bloqueador principal

`auth.ts` atual não suporta service tokens: o claim `sub` de um service token CF Access é uma **string vazia**, e o lookup `WHERE cf_access_id = ?` retorna nulo → 401 para toda requisição de serviço.

Documentação completa: `crm-worker/docs/service-tokens-architecture.md`

### Patch necessário em auth.ts (proposta)

```typescript
// 1. Estender JwtPayload
interface JwtPayload {
  sub: string;
  iss: string;
  aud: string[];
  exp: number;
  iat: number;
  jti?: string;
  email?: string;
  common_name?: string;  // ← NOVO: presente apenas em service tokens
}

// 2. Estender authenticate() — detecção de service token
const isServiceToken = payload.sub === '' && typeof payload.common_name === 'string';
const lookupKey = isServiceToken ? payload.common_name! : payload.sub;

const result = await env.DB.prepare(
  `SELECT id, cf_access_id, nome, perfil, email
   FROM usuarios WHERE cf_access_id = ? AND deleted_at IS NULL LIMIT 1`,
).bind(lookupKey).first<AuthenticatedUser>();
```

### Status do patch (Fase 3A.1 — IMPLEMENTADO)

O patch foi aplicado em `src/auth.ts`. Cobertura de testes locais (`t1_t9_local.mjs`):

| Teste | Cenário | Resultado |
|-------|---------|-----------|
| ST1 | Service token válido (`sub=""`, `common_name` presente) → resolve usuário CI | ✅ PASS |
| ST2 | Service token malformado (`sub=""`, sem `common_name`) → AuthError 401 | ✅ PASS |
| ST3 | `common_name` não cadastrado no D1 → AuthError 401 | ✅ PASS |
| ST4 | Token de usuário humano (`sub != ""`) → fluxo inalterado | ✅ PASS |
| ST4b | Usuário humano com `sub` não cadastrado → AuthError 401 | ✅ PASS |
| ST5 | `requirePerfil(['admin'])` passa para service identity admin | ✅ PASS |
| ST5b | `requirePerfil(['corretor'])` falha para admin → AuthError 403 | ✅ PASS |
| ST6 | `requireOwnershipOrAdmin` bypass para admin service identity | ✅ PASS |
| ST6b | Isolamento de ownership bloqueado para service identity corretor | ✅ PASS |

**Total de testes locais: 54/54 pass** (45 anteriores + 9 novos ST)

### Pré-requisitos para executar T2/T10/T11 (requer nova autorização)

1. Autorização de Joel para:
   - Criar Service Token no painel CF Access
   - Inserir usuário CI no D1 staging
   - Aplicar patch em `src/auth.ts` e fazer deploy
2. Configurar GitHub Secrets: `CF_ACCESS_CLIENT_ID` e `CF_ACCESS_CLIENT_SECRET`
3. Executar workflow `integration-tests-staging.yml` via `workflow_dispatch`

---

## Resumo de arquivos entregues nesta fase

| Arquivo | Descrição |
|---------|-----------|
| `crm-worker/tests/t1_t9_local.mjs` | 54 testes unitários locais (T1–T9 + LGPD + ST — 54/54 pass) |
| `crm-worker/src/auth.ts` | Patch Fase 3A.1: suporte a service tokens (sub="" + common_name) |
| `crm-worker/docs/service-tokens-architecture.md` | Análise completa da arquitetura Service Tokens vs auth.ts |
| `crm-worker/docs/fase3a-homologacao-revisada.md` | Este arquivo — relatório consolidado |
| `.github/workflows/integration-tests-staging.yml` | Proposta de workflow para T2, T10, T11 |

---

## Próximos passos (requerem nova autorização)

1. **T12 completo:** executar `wrangler d1 time-travel restore` localmente com rede desbloqueada
2. **T2/T10/T11:** aprovar e implementar Service Tokens conforme `service-tokens-architecture.md`
3. **Fase 3B:** só iniciar após T2/T10/T11 aprovados com evidências HTTP reais
