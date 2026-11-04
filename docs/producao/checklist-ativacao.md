# Checklist de Ativação — Produção Market Imobi CRM

**Portal**: queromeumcmv.com.br  
**Worker**: market-imobi-crm → api.queromeumcmv.com.br  
**Branch de origem**: feat/market-imobi-crm-staging (a ser mergeada à main)

---

## FASE 1 — Pré-requisitos (fazer antes de qualquer deploy)

### 1.1 Criar recursos Cloudflare (requer autorização Joel)

```bash
# D1 de produção
wrangler d1 create market-imobi-prod
# → Copiar database_id gerado → wrangler.toml [env.production].d1_databases.database_id

# KV para cache JWKS
wrangler kv namespace create JWKS_CACHE --env production
# → Copiar id gerado → wrangler.toml [env.production].kv_namespaces.id
```

```
□ D1 "market-imobi-prod" criado — ID inserido no wrangler.toml
□ KV JWKS_CACHE (produção) criado — ID inserido no wrangler.toml
```

### 1.2 Configurar CF Access (ver docs/producao/cf-access-setup.md)

```
□ CF Access Application "CRM Admin Produção" criada
□ AUD copiado → wrangler.toml [env.production].vars.CF_ACCESS_AUD
□ CF Access Bypass "/api/v1/public/leads" criado (Bypass Everyone)
□ DNS api.queromeumcmv.com.br: registro AAAA 100:: Proxied
```

### 1.3 Verificar wrangler.toml sem placeholders

```bash
grep "PENDENTE" crm-worker/wrangler.toml
# Deve retornar vazio. Se retornar linhas → preencher os IDs antes de continuar.
```

```
□ Nenhum "PENDENTE" no wrangler.toml
```

---

## FASE 2 — Aplicar migrations no D1 de produção (requer autorização Joel)

```bash
# IMPORTANTE: aplicar SOMENTE estas duas, nesta ordem.
# NÃO aplicar 0002_seed_fictitious_data (está em migrations/staging-only/)

# Schema completo
wrangler d1 migrations apply market-imobi-prod --env production --remote

# Verificar que versão '0001' e '0002' estão na tabela _migrations (via D1):
wrangler d1 execute market-imobi-prod --env production --remote \
  --command "SELECT version, descricao FROM _migrations ORDER BY version"
```

Resultado esperado:
```
version | descricao
--------|------------------------------------------------
0001    | Schema inicial v1.1 — Market Imobi CRM
0002    | ADD COLUMN leads.dados_extras_json — campos MCMV extras do portal
```

```
□ Migration 0001 aplicada (schema + configuracoes LGPD)
□ Migration 0002 aplicada (dados_extras_json)
□ _migrations confirmada: 2 registros, sem fictícios
□ Nenhum dado fictício inserido (ausência de registros em usuarios/empreendimentos)
```

---

## FASE 3 — Merge e deploy (requer autorização Joel)

### 3.1 Merge feat/market-imobi-crm-staging → main

```bash
git checkout main
git merge --no-ff feat/market-imobi-crm-staging
git push origin main
```

```
□ Branch mergeada à main sem conflitos
□ Push para origin/main realizado
```

### 3.2 Deploy via GitHub Actions

1. GitHub → Actions → "Deploy Worker — Production"
2. Run workflow → Branch: `main`
3. Campo: `CONFIRMAR_PRODUCAO`
4. Aguardar ~90s

```
□ Workflow concluído com ✅
```

---

## FASE 4 — Validação pós-deploy

### 4.1 Health check do Worker

```bash
# No browser com sessão CF Access ativa:
# https://api.queromeumcmv.com.br/health
# Esperado: {"status":"ok","environment":"production"}
```

```
□ /health retorna 200 com environment: "production"
```

### 4.2 Rota pública — sem autenticação

```bash
curl -s -X POST https://api.queromeumcmv.com.br/api/v1/public/leads \
  -H "Content-Type: application/json" \
  -d '{"external_id":"test-invalid"}'
# Esperado: 400 (body inválido) — confirma que a rota bypass está funcionando
```

```
□ POST /api/v1/public/leads sem JWT retorna 400 (não 302/403)
```

### 4.3 Lead sintético de ponta a ponta

> ⚠️ Usar telefone fictício (ex: (21) 99000-0000) para não contaminar D1 de produção.

```bash
curl -s -X POST https://api.queromeumcmv.com.br/api/v1/public/leads \
  -H "Content-Type: application/json" \
  -d '{
    "external_id": "prod-smoke-test-001",
    "nome": "Teste Sintético Prod",
    "whatsapp": "21990000001",
    "consentimento_lgpd": true
  }'
# Esperado: 201 {"success":true,"data":{"id":1,...}}
```

```
□ Lead sintético retornou 201
□ Verificar D1: SELECT * FROM leads WHERE idempotency_key = 'prod-smoke-test-001'
□ Verificar D1: SELECT * FROM consentimentos_lgpd ORDER BY id DESC LIMIT 1
□ Idempotência: reenviar mesmo external_id → 200 (não 201)
```

### 4.4 Ativar portal → CRM

Editar `src/components/LeadForm.jsx` (1 linha):

```diff
- CRM_PUBLIC_URL: 'https://api-staging.queromeumcmv.com.br/api/v1/public/leads',
+ CRM_PUBLIC_URL: 'https://api.queromeumcmv.com.br/api/v1/public/leads',
```

```
□ LeadForm.jsx atualizado e portal redesployado
□ Lead real de teste enviado via portal (acompanhar no D1 + Sheets)
□ Sheets continua recebendo normalmente (dual-write validado)
```

---

## FASE 5 — Monitoramento pós-ativação (primeiras 24h)

```
□ Zero erros 5xx nos logs (Cloudflare → Workers → market-imobi-crm → Logs)
□ D1 recebendo novos leads (SELECT COUNT(*) FROM leads)
□ consentimentos_lgpd crescendo junto com leads
□ Google Sheets continua funcional (nenhum lead perdido)
□ Nenhum lead duplicado (idempotency_key funcionando)
```

---

## PROCEDIMENTO DE ROLLBACK

### Rollback imediato (sem mexer em código)

1. **Cloudflare Dashboard** → Workers & Pages → `market-imobi-crm`
2. Aba **Deployments** → localizar versão anterior pelo timestamp
3. `...` → **Rollback to this deployment** → confirmar

Tempo: ~30 segundos. Não afeta o D1.

### Rollback do portal (se LeadForm.jsx foi alterado)

Reverter a linha CRM_PUBLIC_URL para staging ou remover o dual-write CRM:
```diff
- CRM_PUBLIC_URL: 'https://api.queromeumcmv.com.br/api/v1/public/leads',
+ CRM_PUBLIC_URL: 'https://api-staging.queromeumcmv.com.br/api/v1/public/leads',
```
Redesployar o portal. O Sheets continua funcionando normalmente.

### Rollback do banco (somente se necessário)

As migrations `0001` e `0002` são não-destrutivas (ADD COLUMN, sem DROP).
Rollback de banco não é necessário na maioria dos cenários.

---

## Plano gratuito Cloudflare — Limites relevantes

| Recurso | Plano Free | Uso estimado |
|---------|-----------|--------------|
| Workers requests/dia | 100.000 | ~100 leads/dia → ≪ limite |
| Workers CPU time | 10ms/req | Handler público: ~2ms |
| D1 reads/dia | 5.000.000 | ≪ limite |
| D1 writes/dia | 100.000 | ≪ limite |
| D1 storage | 500 MB | Schema + leads: estimado <10 MB/ano |
| KV reads/dia | 100.000 | Cache JWKS: 1 leitura/usuário/sessão |

Sem custo adicional esperado no plano free para o volume atual.
