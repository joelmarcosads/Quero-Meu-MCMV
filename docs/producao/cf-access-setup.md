# CF Access — Configuração de Produção

## Contexto

O CRM Worker de produção (`market-imobi-crm`, `api.queromeumcmv.com.br`) requer
duas configurações distintas no Cloudflare Access:

1. **Aplicação principal** — protege o painel administrativo e as rotas autenticadas.
2. **Bypass para rota pública** — permite que o portal envie leads sem CF Access JWT.

Conta Cloudflare: `5f8abdde2df34998f0454821d8be59da`  
Team domain: `hidden-block-61bc.cloudflareaccess.com`

---

## Aplicação 1 — CRM Admin (produção)

Finalidade: exigir login Google via CF Access em todas as rotas de `api.queromeumcmv.com.br`.

### Passos no Cloudflare Dashboard

1. **Zero Trust → Access → Applications → Add an application**
2. **Type**: Self-hosted
3. **Name**: `Market Imobi CRM — Producao`
4. **Session Duration**: 24 hours
5. **Application Domain**:
   - Subdomain: `api`
   - Domain: `queromeumcmv.com.br`
   - Path: *(vazio — cobre tudo)*
6. **Identity providers**: Google (já configurado no staging)
7. **Instant Auth**: ativado (single IdP)
8. **Policy**:
   - Policy name: `Corretores autorizados`
   - Action: Allow
   - Rule: Emails → listar emails autorizados (mesmos do staging)
9. **Save application**
10. **Copiar o AUD** (Application Audience Tag — aparece na tela de detalhes)
11. **Preencher** `CF_ACCESS_AUD` em `crm-worker/wrangler.toml` → `[env.production].vars`

> ⚠️ O AUD de produção é **diferente** do AUD de staging. São aplicações CF Access
> distintas com tokens distintos.

---

## Aplicação 2 — Bypass rota pública de leads

Finalidade: permitir que `POST api.queromeumcmv.com.br/api/v1/public/leads` chegue
ao Worker **sem** exigir CF Access JWT (o portal não tem sessão de usuário).

### Configuração idêntica à do staging

No staging, o bypass foi criado como uma segunda aplicação com política "Bypass Everyone"
cobrindo apenas o path `/api/v1/public/leads`.

### Passos no Cloudflare Dashboard

1. **Zero Trust → Access → Applications → Add an application**
2. **Type**: Self-hosted
3. **Name**: `Market Imobi CRM — Public Leads (Producao)`
4. **Application Domain**:
   - Subdomain: `api`
   - Domain: `queromeumcmv.com.br`
   - Path: `/api/v1/public/leads`
5. **Policy**:
   - Policy name: `Bypass publico`
   - Action: **Bypass**
   - Rule: Everyone
6. **Save application**

> Não é necessário copiar AUD desta aplicação — ela não valida JWT.

---

## DNS — Hostname de produção

O hostname `api.queromeumcmv.com.br` precisa existir no DNS da zona Cloudflare
com proxy ativado (ícone laranja ☁️).

### Verificar ou criar

1. **Cloudflare Dashboard → DNS → Records**
2. Verificar se existe registro `api` do tipo `AAAA` ou `A`:
   - Se existir: confirmar que está "Proxied" (ícone laranja)
   - Se não existir: criar novo registro
     - **Type**: AAAA
     - **Name**: api
     - **IPv6**: `100::` (endereço reservado — Workers ignora e intercepta o tráfego)
     - **Proxy status**: Proxied (obrigatório)
     - **TTL**: Auto

> O registro `api-staging.queromeumcmv.com.br` já existe e segue este padrão.
> `api.queromeumcmv.com.br` deve seguir o mesmo.

---

## Checklist CF Access — Produção

```
□ CF Access Application "CRM Admin Produção" criada
□ AUD copiado e inserido em wrangler.toml [env.production].CF_ACCESS_AUD
□ CF Access Application "Public Leads Bypass Produção" criada com Bypass Everyone
□ DNS api.queromeumcmv.com.br criado e proxied
□ Teste manual: GET api.queromeumcmv.com.br/health → redirect CF Access login (200 após login)
□ Teste rota pública: POST api.queromeumcmv.com.br/api/v1/public/leads → 400/201 (sem JWT)
```

---

## Referência — Configuração de staging (já funcionando)

| Parâmetro | Staging |
|-----------|---------|
| Hostname | `api-staging.queromeumcmv.com.br` |
| CF Access AUD | `4e8722c354df3e583fb04ceb1c1c3da7bdac50aaabccb867764cce151e59327d` |
| Bypass path | `/api/v1/public/leads` |
| D1 database_id | `f214ad6c-50d5-4afb-89c0-a18a4208cf89` |
| KV JWKS_CACHE id | `f17d5063d19d4f739db793931c6b6e43` |
