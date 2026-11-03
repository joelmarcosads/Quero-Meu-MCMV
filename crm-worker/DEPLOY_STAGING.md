# Guia de Deploy — Worker Staging (Windows PowerShell)

> **Hostname de staging:** `api-staging.queromeumcmv.com.br`  
> **O domínio principal `queromeumcmv.com.br` não será tocado em nenhum passo.**

---

## Visão geral do que será feito

```
[Você no browser]
      │  HTTPS
      ▼
Cloudflare Access  ──── rejeita sem login ───▶  401 Forbidden
      │  (injeta Cf-Access-Jwt-Assertion)
      ▼
Worker market-imobi-crm-staging
      │  valida JWT RS256 + busca usuário no D1
      ▼
D1 market-imobi-staging  (banco exclusivo de staging)
KV market-imobi-jwks-cache-staging  (cache JWKS exclusivo)
```

Produção (`queromeumcmv.com.br`, Google Sheets, Apps Script, GA4, GTM, Meta Pixel) fica **completamente isolada** — o Worker de staging opera em subdomínio e banco próprios.

---

## Parte A — Cloudflare Dashboard (navegador)

Execute estas etapas **antes** de qualquer comando PowerShell.

---

### A1 — Verificar que o domínio queromeumcmv.com.br está na sua conta

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com)
2. Selecione o domínio **queromeumcmv.com.br**
3. Confirme que o status está **Active**

---

### A2 — Criar registro DNS para o hostname de staging

> ⚠️ Isso cria apenas um subdomínio novo. Não altera nenhum registro existente.

1. No painel do domínio `queromeumcmv.com.br` → **DNS → Records**
2. Clique em **Add record**
3. Preencha:

   | Campo | Valor |
   |---|---|
   | Type | `AAAA` |
   | Name | `api-staging` |
   | IPv6 address | `100::` |
   | Proxy status | **Proxied** (nuvem laranja ativa) |
   | TTL | Auto |

4. Clique **Save**

> O IP `100::` é um endereço reservado — o Cloudflare o ignora e roteia o tráfego para o Worker. É o método correto para hospedar Workers em domínio próprio.

---

### A3 — Descobrir o Team Domain do Zero Trust

1. Acesse [one.dash.cloudflare.com](https://one.dash.cloudflare.com)
2. No menu lateral → **Settings → Custom Pages**
3. Anote o valor em **Team Domain** — formato: `<nome>.cloudflareaccess.com`

**Guarde esse valor** — será usado como `CF_ACCESS_TEAM_DOMAIN` no `wrangler.toml`.

---

### A4 — Criar a aplicação Cloudflare Access para staging

1. Em Zero Trust → **Access → Applications → Add an Application**
2. Escolha **Self-Hosted**
3. Preencha:

   | Campo | Valor |
   |---|---|
   | Application name | `Market Imobi CRM Staging` |
   | Session Duration | `8 hours` |
   | Application domain | `api-staging.queromeumcmv.com.br` |
   | Path | *(deixar vazio — protege tudo)* |

4. Clique **Next**

---

### A5 — Configurar a política de acesso (usuários autorizados)

Na tela de políticas:

1. Clique em **Add a policy**
2. Nome da policy: `Usuarios de Teste Staging`
3. Action: **Allow**
4. Em **Configure rules → Include**, adicione uma regra por e-mail:

   | Rule type | Value |
   |---|---|
   | Emails | `joelmarcos123@gmail.com` |

   Adicione também os e-mails dos outros 2 usuários de teste que precisam acessar.

5. Clique **Save policy** → **Next** → **Add application**

> Qualquer e-mail **não listado** receberá 401 do CF Access antes mesmo de chegar ao Worker.

---

### A6 — Anotar o Audience Tag (AUD)

1. Após criar, vá em **Access → Applications**
2. Clique em **Edit** na aplicação `Market Imobi CRM Staging`
3. Na aba **Overview**, localize **Application Audience Tag**
4. Copie a string hex longa (exemplo: `a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4...`)

**Guarde esse valor** — será usado como `CF_ACCESS_AUD` no `wrangler.toml`.

---

## Parte B — Windows PowerShell

Abra o **PowerShell** (não o Prompt de Comando) e execute os passos na ordem.

---

### B1 — Verificar pré-requisitos

```powershell
node --version
# Precisa ser >= 18. Se não tiver: https://nodejs.org/en/download

npm --version
# Qualquer versão recente

git --version
# Para clonar/atualizar o repositório
```

---

### B2 — Instalar Wrangler (versão mais recente da série 3)

```powershell
npm install -g wrangler@^3
wrangler --version
# Saída esperada: wrangler 3.x.x (não instalar a série 2 — incompatível com D1)
```

> Se já tiver o Wrangler instalado, verifique a versão com `wrangler --version` antes de prosseguir. Versões da série 2 não suportam D1 remote corretamente.

---

### B3 — Autenticar no Cloudflare

```powershell
wrangler login
# Abrirá o navegador. Faça login com a conta que tem o domínio
# queromeumcmv.com.br e os recursos D1/KV/Worker criados.
```

Confirme que autenticou com a conta correta:

```powershell
wrangler whoami
# Deve mostrar seu e-mail e Account ID
```

---

### B4 — Obter o repositório na branch de staging

```powershell
# Se ainda não tiver o repositório clonado:
git clone https://github.com/joelmarcosads/Quero-Meu-MCMV.git
cd Quero-Meu-MCMV

# Se já tiver clonado:
git fetch origin
git checkout feat/market-imobi-crm-staging
git pull origin feat/market-imobi-crm-staging

# Entrar na pasta do Worker
cd crm-worker
```

---

### B5 — Preencher os PLACEHOLDERs no wrangler.toml

Abra o arquivo `wrangler.toml` em qualquer editor (Bloco de Notas, VS Code, Notepad++) e localize o bloco `[env.staging.vars]`:

```toml
[env.staging.vars]
ENVIRONMENT = "staging"
CF_ACCESS_TEAM_DOMAIN = "PLACEHOLDER_SEU_DOMINIO.cloudflareaccess.com"
CF_ACCESS_AUD = "PLACEHOLDER_AUD_DO_SEU_APP"
```

Substitua pelas informações anotadas nos passos A3 e A6:

```toml
[env.staging.vars]
ENVIRONMENT = "staging"
CF_ACCESS_TEAM_DOMAIN = "NOME_DA_SUA_EQUIPE.cloudflareaccess.com"
CF_ACCESS_AUD = "STRING_HEX_LONGA_DO_APP"
```

> **Atenção:** salve o arquivo, mas **não faça commit** com valores reais — os PLACEHOLDERs permanecem no repositório. As variáveis sensíveis ficam apenas localmente no `wrangler.toml` e são enviadas ao Worker como variáveis de ambiente criptografadas pelo Cloudflare.

---

### B6 — Adicionar a rota do hostname no wrangler.toml

Abra novamente o `wrangler.toml` e **adicione** a seção de rotas ao bloco `[env.staging]` (após as linhas existentes do KV):

```toml
[[env.staging.routes]]
pattern = "api-staging.queromeumcmv.com.br/*"
zone_name = "queromeumcmv.com.br"
```

O bloco `[env.staging]` completo ficará assim:

```toml
[env.staging]
name = "market-imobi-crm-staging"

[[env.staging.d1_databases]]
binding = "DB"
database_name = "market-imobi-staging"
database_id = "f214ad6c-50d5-4afb-89c0-a18a4208cf89"

[[env.staging.kv_namespaces]]
binding = "JWKS_CACHE"
id = "f17d5063d19d4f739db793931c6b6e43"

[[env.staging.routes]]
pattern = "api-staging.queromeumcmv.com.br/*"
zone_name = "queromeumcmv.com.br"

[env.staging.vars]
ENVIRONMENT = "staging"
CF_ACCESS_TEAM_DOMAIN = "NOME_DA_SUA_EQUIPE.cloudflareaccess.com"
CF_ACCESS_AUD = "STRING_HEX_LONGA_DO_APP"
```

---

### B7 — Compilar o TypeScript

```powershell
# Dentro de crm-worker\
npx esbuild src/index.ts `
  --bundle --format=esm --target=es2022 --platform=browser `
  "--outfile=dist/worker.js" `
  "--external:node:*"

# Verificar:
Get-Item dist\worker.js | Select-Object Name, Length
# Esperado: worker.js  ~20.000 bytes
```

---

### B8 — Deploy para staging

```powershell
wrangler deploy --env staging
```

Saída esperada:

```
Total Upload: 20.xx KiB / gzip: 6.xx KiB
Uploaded market-imobi-crm-staging (x.xx sec)
Published market-imobi-crm-staging (x.xx sec)
  https://market-imobi-crm-staging.<conta>.workers.dev
  https://api-staging.queromeumcmv.com.br
```

O Worker agora está acessível em **ambas** as URLs. A URL `workers.dev` será desabilitada no passo B11, depois de confirmar o funcionamento pelo domínio customizado.

---

### B9 — Verificar health check (sem autenticação)

```powershell
Invoke-RestMethod -Uri "https://api-staging.queromeumcmv.com.br/health"
```

Resposta esperada:

```json
{
  "status": "ok",
  "environment": "staging",
  "timestamp": "2026-11-03T13:00:00.000Z"
}
```

> Se retornar `403` ou página de login do CF Access, o `/health` está coberto pela política de acesso. Nesse caso, configure uma exceção de path `/health` na aplicação Access (Add a policy → Action: **Bypass** → Path: `/health`).

---

### B10 — Testar rejeição sem autenticação

```powershell
# Deve retornar HTTP 401 (sem Cf-Access-Jwt-Assertion):
$response = Invoke-WebRequest -Uri "https://api-staging.queromeumcmv.com.br/api/v1/empreendimentos" `
  -SkipHttpErrorCheck
$response.StatusCode   # Esperado: 401
$response.Content      # Esperado: {"error":"Token de autenticação ausente..."}
```

---

### B11 — Desabilitar a URL pública workers.dev

**Somente após confirmar** que `api-staging.queromeumcmv.com.br` responde corretamente:

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Workers & Pages → market-imobi-crm-staging**
3. Aba **Settings → Domains & Routes**
4. Localize a linha **workers.dev** e clique em **Disable**

A partir desse momento, o Worker só responde por `api-staging.queromeumcmv.com.br`, que está protegido pelo CF Access.

---

## Parte C — Após o deploy: testes de integração

Execute estes testes para validar todos os controles de segurança.

---

### C1 — Obter JWT de teste via CF Access

Acesse `https://api-staging.queromeumcmv.com.br` no browser. O CF Access exibirá a tela de login. Após autenticar:

1. Abra o DevTools (F12) → **Application → Cookies**
2. Copie o valor do cookie `CF_Authorization`
3. Esse valor é o JWT — use-o nos testes abaixo

```powershell
$JWT = "COLE_O_JWT_AQUI"
$BASE = "https://api-staging.queromeumcmv.com.br"
```

---

### C2 — Tabela de testes

| Teste | Comando PowerShell | Esperado |
|---|---|---|
| **T1** Health (sem auth) | `Invoke-RestMethod "$BASE/health"` | `status: ok` |
| **T2** Sem JWT → 401 | `(Invoke-WebRequest "$BASE/api/v1/empreendimentos" -SkipHttpErrorCheck).StatusCode` | `401` |
| **T3** JWT inválido → 401 | `-H "Cf-Access-Jwt-Assertion: token.fake.aqui"` | `401` |
| **T4** JWT válido → lista | Ver T4 abaixo | 2 empreendimentos fictícios |
| **T5** Criar lead | Ver T5 abaixo | `HTTP 201` |
| **T6** Idempotência | Repetir T5 com mesmo `idempotency_key` | `HTTP 200, idempotent: true` |
| **T7** Dedup telefone | 5 POSTs paralelos, mesmo telefone | 1 contato, 5 leads no D1 |

---

### C3 — Comandos completos para T4 e T5

**T4 — Listar empreendimentos (JWT válido):**

```powershell
Invoke-RestMethod `
  -Uri "$BASE/api/v1/empreendimentos" `
  -Headers @{ "Cf-Access-Jwt-Assertion" = $JWT }
```

**T5 — Criar lead:**

```powershell
$body = @{
  nome             = "Maria Teste Ficticia"
  telefone         = "21987654321"
  email            = "maria.ficticia@example.com"
  empreendimento_id = 1
  origem           = "portal_organico"
  idempotency_key  = "test-lead-001"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method POST `
  -Uri "$BASE/api/v1/leads" `
  -Headers @{ "Cf-Access-Jwt-Assertion" = $JWT; "Content-Type" = "application/json" } `
  -Body $body
```

---

## Resumo do que já está pronto (sem ação necessária)

| Recurso | Status | Detalhe |
|---|---|---|
| D1 `market-imobi-staging` | ✅ | 16 tabelas + seed fictício |
| KV `market-imobi-jwks-cache-staging` | ✅ | Cache JWKS TTL 3600s |
| Worker TypeScript | ✅ | 8 arquivos, auth RS256 real |
| Branch `feat/market-imobi-crm-staging` | ✅ | No GitHub, main intocada |
| Validação JWT no código | ✅ | alg, exp, iss, aud, assinatura, sub→D1 |

---

## Após o deploy — informar Claude

Compartilhe:

1. Confirmação de que `https://api-staging.queromeumcmv.com.br/health` retornou `status: ok`
2. O valor de `CF_ACCESS_TEAM_DOMAIN` (sem segredos — apenas o domínio público)
3. O resultado dos testes C2 (quais passaram/falharam)

Com isso os entregáveis restantes da Fase 3A serão concluídos.
