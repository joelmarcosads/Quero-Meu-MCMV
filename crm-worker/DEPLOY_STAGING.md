# Deploy Manual — Worker Staging

> **Este guia é necessário porque** o ambiente de build não tem acesso direto a
> `api.cloudflare.com` nem ao `registry.npmjs.org`. O `dist/worker.js` já está
> compilado (20 KB, ESM). Basta seguir os passos abaixo **no seu computador local**.

---

## Pré-requisitos (máquina local)

```bash
node --version   # >= 18
npm --version    # qualquer versão recente
```

---

## Passo 1 — Instalar Wrangler localmente

```bash
npm install -g wrangler@3
wrangler --version   # deve imprimir "3.x.x"
```

---

## Passo 2 — Autenticar no Cloudflare

```bash
wrangler login
# Abrirá o navegador para autorizar. Faça login com a conta
# que tem o Worker + D1 + KV criados.
```

---

## Passo 3 — Clonar / puxar a branch

```bash
git fetch origin feat/market-imobi-crm-staging
git checkout feat/market-imobi-crm-staging
cd crm-worker
```

---

## Passo 4 — Preencher os PLACEHOLDERs do wrangler.toml

Abra `wrangler.toml` e substitua as duas linhas em `[env.staging.vars]`:

| Variável | Onde encontrar |
|---|---|
| `CF_ACCESS_TEAM_DOMAIN` | Cloudflare Zero Trust → Settings → Custom Pages — o domínio tem formato `<sua-equipe>.cloudflareaccess.com` |
| `CF_ACCESS_AUD` | Zero Trust → Access → Applications → seu app → Edit → Application Audience Tag (string hex longa) |

Exemplo depois do preenchimento:
```toml
[env.staging.vars]
ENVIRONMENT = "staging"
CF_ACCESS_TEAM_DOMAIN = "joelmarcos.cloudflareaccess.com"
CF_ACCESS_AUD = "a1b2c3d4e5f6..."
```

---

## Passo 5 — Instalar dependências e compilar

```bash
# Dentro de crm-worker/
npm install
npm run build 2>/dev/null || \
  npx esbuild src/index.ts \
    --bundle --format=esm --target=es2022 --platform=browser \
    --outfile=dist/worker.js --external:node:*
```

> Se o `dist/worker.js` já existir no repositório (foi gerado pelo ambiente de
> build), pode pular este passo.

---

## Passo 6 — Deploy para staging

```bash
wrangler deploy --env staging
```

Saída esperada:
```
Total Upload: 20.xx KiB / gzip: 6.xx KiB
Uploaded market-imobi-crm-staging (x.xx sec)
Published market-imobi-crm-staging (x.xx sec)
  https://market-imobi-crm-staging.<seu-subdominio>.workers.dev
```

Anote a URL — é o endpoint de staging.

---

## Passo 7 — Verificar health check

```bash
curl -sS https://market-imobi-crm-staging.<subdominio>.workers.dev/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "environment": "staging",
  "version": "1.0.0",
  "timestamp": "2026-11-03T13:00:00.000Z"
}
```

---

## Passo 8 — Testar autenticação (requer CF Access configurado)

```bash
# 1. Obter o JWT (via CF Access app)
CF_JWT="<token do header Cf-Access-Jwt-Assertion>"

# 2. Testar endpoint protegido
curl -sS \
  -H "Cf-Access-Jwt-Assertion: $CF_JWT" \
  https://market-imobi-crm-staging.<subdominio>.workers.dev/api/v1/empreendimentos
```

---

## O que já está pronto (não precisa configurar)

| Recurso | Status | ID |
|---|---|---|
| D1 `market-imobi-staging` | ✅ Criado + 16 tabelas migradas | `f214ad6c-50d5-4afb-89c0-a18a4208cf89` |
| KV `market-imobi-jwks-cache-staging` | ✅ Criado | `f17d5063d19d4f739db793931c6b6e43` |
| wrangler.toml | ✅ IDs reais preenchidos | ver arquivo |
| Worker TypeScript | ✅ Compilado 20 KB ESM | `dist/worker.js` |

---

## Após o deploy — informar Claude

Compartilhe:
1. A URL do Worker (`*.workers.dev`)
2. Seu `CF_ACCESS_TEAM_DOMAIN` (ex: `joelmarcos.cloudflareaccess.com`)
3. O `CF_ACCESS_AUD` do app de staging

Com isso, os testes de integração reais da Fase 3A podem começar.
