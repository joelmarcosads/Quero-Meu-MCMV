# Guia de Deploy — Worker Staging (Windows PowerShell)

> **Hostname de staging:** `api-staging.queromeumcmv.com.br`  
> **O domínio principal `queromeumcmv.com.br` não será tocado em nenhum passo.**  
> **Branch:** `feat/market-imobi-crm-staging` — `main` nunca modificada.

---

## Arquitetura de segurança em camadas

```
Requisição HTTP
      │
      ▼
┌─────────────────────────────────────┐
│  Cloudflare Access (camada 1)       │  ← sem sessão válida → redireciona para login
│  api-staging.queromeumcmv.com.br    │  ← sessão expirada  → redireciona para login
└─────────────────────────────────────┘
      │ injeta Cf-Access-Jwt-Assertion
      ▼
┌─────────────────────────────────────┐
│  Worker market-imobi-crm-staging    │  ← JWT ausente/inválido → HTTP 401
│  (camada 2 — validação criptográfica│  ← usuário sem permissão → HTTP 403
│   alg · exp · iss · aud · assinatura│
│   sub → lookup D1 → AuthenticatedUser
└─────────────────────────────────────┘
      │
      ▼
D1 market-imobi-staging  (banco exclusivo de staging)
KV market-imobi-jwks-cache-staging  (cache JWKS exclusivo)
```

**Produção isolada:** o site `queromeumcmv.com.br`, Google Sheets, Apps Script, GA4, GTM e Meta Pixel operam em pipeline completamente separada. Este Worker não toca nesses recursos.

---

## ✅ Checklist pré-deploy

Execute este checklist **antes** de rodar qualquer comando PowerShell. Cada item tem a fonte de verificação.

### DNS

- [ ] Registro `api-staging` do tipo `AAAA` com valor `100::` criado no domínio `queromeumcmv.com.br`
- [ ] Status do registro: **Proxied** (nuvem laranja)
- [ ] Nenhum registro existente (A, CNAME, MX) foi alterado
- [ ] **Fonte:** Cloudflare Dashboard → `queromeumcmv.com.br` → DNS → Records

### Cloudflare Access — aplicação

- [ ] Aplicação Self-Hosted criada com nome `Market Imobi CRM Staging`
- [ ] Domínio configurado: `api-staging.queromeumcmv.com.br` (sem path)
- [ ] Session Duration: `8 hours`
- [ ] **Fonte:** Zero Trust → Access → Applications

### Cloudflare Access — política de acesso

- [ ] Policy `Usuarios de Teste Staging` criada com Action = **Allow**
- [ ] E-mails dos 3 usuários de teste listados explicitamente (regra Emails)
- [ ] Nenhuma regra `Everyone` ou `Domain` que permita acesso irrestrito
- [ ] **Fonte:** Zero Trust → Access → Applications → Edit → Policies

### Team Domain e Audience Tag

- [ ] `CF_ACCESS_TEAM_DOMAIN` anotado (formato: `<nome>.cloudflareaccess.com`)
  - **Fonte:** Zero Trust → Settings → Custom Pages → Team Domain
- [ ] `CF_ACCESS_AUD` anotado (string hex longa)
  - **Fonte:** Zero Trust → Access → Applications → Edit → Overview → Audience Tag
- [ ] Ambos os PLACEHOLDERs substituídos no `wrangler.toml` local (não commitar)

### Rota do Worker

- [ ] Bloco `[[env.staging.routes]]` presente no `wrangler.toml` com:
  - `pattern = "api-staging.queromeumcmv.com.br/*"`
  - `zone_name = "queromeumcmv.com.br"`
- [ ] **Fonte:** arquivo `crm-worker/wrangler.toml` no repositório

### Isolamento D1 / KV

- [ ] `database_id = "f214ad6c-50d5-4afb-89c0-a18a4208cf89"` (market-imobi-**staging**)
- [ ] `id = "f17d5063d19d4f739db793931c6b6e43"` (market-imobi-jwks-cache-**staging**)
- [ ] Nenhum ID de banco de produção referenciado em `[env.staging]`
- [ ] **Fonte:** arquivo `crm-worker/wrangler.toml`, bloco `[env.staging]`

### Ausência de alterações em produção

- [ ] Branch `main` intocada: `git log --oneline main` igual ao estado anterior
- [ ] Nenhum formulário do site alterado
- [ ] Google Sheets / Apps Script / GA4 / GTM / Meta Pixel: sem alterações
- [ ] **Fonte:** `git diff main feat/market-imobi-crm-staging` — diferenças apenas em `crm-worker/`

---

## Parte A — Cloudflare Dashboard (navegador)

### A1 — Registro DNS para o hostname de staging

1. Acesse [dash.cloudflare.com](https://dash.cloudflare.com) → selecione `queromeumcmv.com.br` → **DNS → Records**
2. Clique **Add record** e preencha:

   | Campo | Valor |
   |---|---|
   | Type | `AAAA` |
   | Name | `api-staging` |
   | IPv6 address | `100::` |
   | Proxy status | **Proxied** (nuvem laranja) |
   | TTL | Auto |

3. Clique **Save**

> O IP `100::` é reservado — o Cloudflare nunca o roteia para a internet. O tráfego vai direto para o Worker. Nenhum registro existente é afetado.

### A2 — Anotar o Team Domain

1. Acesse [one.dash.cloudflare.com](https://one.dash.cloudflare.com) → **Settings → Custom Pages**
2. Anote o **Team Domain** (ex: `joelmarcos.cloudflareaccess.com`)

### A3 — Criar aplicação Access Self-Hosted

1. Zero Trust → **Access → Applications → Add an Application → Self-Hosted**
2. Preencha:

   | Campo | Valor |
   |---|---|
   | Application name | `Market Imobi CRM Staging` |
   | Session Duration | `8 hours` |
   | Application domain | `api-staging.queromeumcmv.com.br` |
   | Path | *(vazio — protege tudo)* |

3. Clique **Next**

### A4 — Criar política de acesso

1. **Add a policy** → Nome: `Usuarios de Teste Staging` → Action: **Allow**
2. Em **Configure rules → Include**, adicione:

   | Rule type | Value |
   |---|---|
   | Emails | `joelmarcos123@gmail.com` |

   Adicione os e-mails dos outros usuários de teste.

3. **Save policy → Next → Add application**

### A5 — Anotar o Audience Tag

1. Zero Trust → **Access → Applications → Edit** na aplicação recém-criada
2. Aba **Overview** → copie o **Application Audience Tag** (string hex)

### A6 — Exceção para o health check (opcional, recomendado)

Para que `/health` seja acessível sem login (útil para monitoramento):

1. Na mesma aplicação → **Policies → Add a policy**
2. Nome: `Health Check Bypass` → Action: **Bypass**
3. Em **Configure rules → Include** → Rule type: **Everyone**
4. Em **Application domain → Path**, digite: `/health`
5. **Save policy**

---

## Parte B — Windows PowerShell

> Os comandos abaixo funcionam no **PowerShell 5.1** (Windows 10 built-in) e no **PowerShell 7** (instalação separada). Onde houver diferença, as duas versões são apresentadas.

### B1 — Verificar pré-requisitos

```powershell
node --version
# Precisa ser >= 18. Download: https://nodejs.org

npm --version
# Qualquer versão recente (>= 8)

git --version
# Necessário para clonar/atualizar o repositório
```

**Verificar a versão do PowerShell:**
```powershell
$PSVersionTable.PSVersion
# Major 5 = PowerShell 5.1 (built-in)
# Major 7 = PowerShell 7 (instalação separada)
```

### B2 — Instalar Wrangler na versão do projeto

O `package.json` do projeto declara `"wrangler": "^3.87.0"`. Isso garante uso da série 3 (necessária para D1 `--remote` e rotas customizadas), na versão mínima compatível com a `compatibility_date = "2024-10-22"` do `wrangler.toml`.

**Opção A — instalação local no projeto (recomendada):**
```powershell
# Dentro de crm-worker\
npm install
# Instala exatamente wrangler@^3.87.0 do package.json
# Wrangler ficará disponível via npx dentro desse diretório
npx wrangler --version
# Esperado: wrangler 3.x.x (>= 3.87.0)
```

**Opção B — instalação global (se preferir chamar `wrangler` diretamente):**
```powershell
npm install -g wrangler@^3.87.0
wrangler --version
# Esperado: wrangler 3.x.x (>= 3.87.0)
```

> **Por que série 3 e não 4?** O projeto foi desenvolvido e testado com `^3.87.0`. A série 4 introduz mudanças de API ainda não validadas com este `wrangler.toml`. Quando a série 4 estiver estável e testada, o `package.json` será atualizado explicitamente.

### B3 — Autenticar no Cloudflare

```powershell
npx wrangler login
# Abrirá o navegador. Faça login com a conta
# que tem o domínio queromeumcmv.com.br e os recursos D1/KV criados.

npx wrangler whoami
# Saída esperada: e-mail da conta + Account ID
```

### B4 — Obter o repositório na branch de staging

```powershell
# Se ainda não tiver o repositório:
git clone https://github.com/joelmarcosads/Quero-Meu-MCMV.git
Set-Location Quero-Meu-MCMV

# Se já tiver clonado:
git fetch origin
git checkout feat/market-imobi-crm-staging
git pull origin feat/market-imobi-crm-staging

# Entrar na pasta do Worker
Set-Location crm-worker
```

### B5 — Preencher os PLACEHOLDERs no wrangler.toml

Abra o arquivo `wrangler.toml` em um editor de texto e localize o bloco:

```toml
[env.staging.vars]
ENVIRONMENT = "staging"
CF_ACCESS_TEAM_DOMAIN = "PLACEHOLDER_SEU_DOMINIO.cloudflareaccess.com"
CF_ACCESS_AUD = "PLACEHOLDER_AUD_DO_SEU_APP"
```

Substitua pelos valores anotados nos passos A2 e A5:

```toml
[env.staging.vars]
ENVIRONMENT = "staging"
CF_ACCESS_TEAM_DOMAIN = "NOME_REAL.cloudflareaccess.com"
CF_ACCESS_AUD = "STRING_HEX_REAL"
```

> Salve o arquivo localmente. **Não faça commit** dessas alterações — os PLACEHOLDERs ficam no repositório. O Wrangler envia as variáveis ao Worker de forma criptografada durante o deploy.

### B6 — Instalar dependências e compilar

```powershell
# Instalar dependências (inclui wrangler local)
npm install

# Compilar TypeScript → ESM
npx esbuild src/index.ts `
  --bundle --format=esm --target=es2022 --platform=browser `
  "--outfile=dist/worker.js" `
  "--external:node:*"

# Verificar o arquivo gerado
Get-Item dist\worker.js | Select-Object Name, @{N='KB';E={[math]::Round($_.Length/1KB,1)}}
# Esperado: worker.js  ~20 KB
```

### B7 — Deploy para staging

```powershell
npx wrangler deploy --env staging
```

Saída esperada:

```
Total Upload: 20.xx KiB / gzip: 6.xx KiB
Uploaded market-imobi-crm-staging (x.xx sec)
Published market-imobi-crm-staging (x.xx sec)
  https://market-imobi-crm-staging.<conta>.workers.dev
  https://api-staging.queromeumcmv.com.br
```

> O Worker fica acessível pelas **duas** URLs até o passo B11. O `workers.dev` será desabilitado após confirmar o funcionamento pelo domínio customizado.

---

## Parte C — Testes de autenticação

> **Antes de começar:** compreenda as duas camadas de proteção para interpretar os resultados corretamente.

### Comportamentos esperados por camada

| Situação | Camada que atua | Resposta |
|---|---|---|
| Acesso pelo **browser** sem sessão CF Access | Cloudflare Access | Redirecionamento para página de login (`302` ou `200` com form) |
| Acesso pelo **browser** com sessão expirada | Cloudflare Access | Redirecionamento para login novamente |
| Chamada API sem `Cf-Access-Jwt-Assertion` | Worker (camada 2) | `HTTP 401` — o header não chegou |
| JWT malformado ou assinatura inválida | Worker (camada 2) | `HTTP 401` |
| JWT expirado | Worker (camada 2) | `HTTP 401` |
| JWT de issuer errado | Worker (camada 2) | `HTTP 401` |
| JWT de audience errado | Worker (camada 2) | `HTTP 401` |
| JWT válido, `sub` não encontrado no D1 | Worker (camada 2) | `HTTP 401` |
| JWT válido, usuário sem perfil suficiente | Worker (camada 2) | `HTTP 403` |
| JWT válido, corretor tentando ver lead de outro | Worker (camada 2) | `HTTP 403` |

> **Importante:** testes via `curl` ou `Invoke-WebRequest` **ignoram o Cloudflare Access** (a camada 1) porque não passam pelo fluxo de login do browser. Por isso os testes abaixo chegam direto ao Worker e recebem `401` — não `302`. Esse comportamento é correto e esperado para testes de API.

### C1 — Variáveis de ambiente para os testes

```powershell
$BASE = "https://api-staging.queromeumcmv.com.br"

# JWT válido: obtido após login no browser (ver C2 abaixo)
$JWT  = "COLE_O_JWT_AQUI"
```

### C2 — Como obter o JWT de teste (sem expor rotas privadas)

O JWT é gerado pelo Cloudflare Access após o login. Para obtê-lo:

1. Acesse `https://api-staging.queromeumcmv.com.br/health` no browser
2. O CF Access exibirá a tela de login. Faça login com um dos e-mails da política
3. Após autenticar, abra o **DevTools** (F12) → aba **Application** → **Cookies**
4. Copie o valor do cookie chamado **`CF_Authorization`**
5. Esse valor é o JWT RS256 — use-o como `$JWT` nos testes abaixo

> O `/health` é a única rota sem autenticação no Worker. Ele não expõe dados de negócio e serve exatamente para essa finalidade: confirmar que o Worker está no ar sem precisar de credenciais.

### C3 — Testes PowerShell 5.1 e 7

**T1 — Health check (sem autenticação)**

```powershell
# PowerShell 5.1 e 7
Invoke-RestMethod -Uri "$BASE/health"
# Esperado: status "ok", environment "staging"
```

---

**T2 — Sem JWT → HTTP 401**

```powershell
# PowerShell 5.1
$r = Invoke-WebRequest -Uri "$BASE/api/v1/empreendimentos" `
     -UseBasicParsing -ErrorAction SilentlyContinue
$r.StatusCode          # Esperado: 401
$r.Content             # Esperado: {"error":"Token de autenticação ausente..."}

# PowerShell 7
$r = Invoke-WebRequest -Uri "$BASE/api/v1/empreendimentos" -SkipHttpErrorCheck
$r.StatusCode          # Esperado: 401
```

---

**T3 — JWT malformado → HTTP 401**

```powershell
# PowerShell 5.1
$headers = @{ "Cf-Access-Jwt-Assertion" = "token.invalido.aqui" }
$r = Invoke-WebRequest -Uri "$BASE/api/v1/empreendimentos" `
     -Headers $headers -UseBasicParsing -ErrorAction SilentlyContinue
$r.StatusCode          # Esperado: 401

# PowerShell 7
$r = Invoke-WebRequest -Uri "$BASE/api/v1/empreendimentos" `
     -Headers @{ "Cf-Access-Jwt-Assertion" = "token.invalido.aqui" } `
     -SkipHttpErrorCheck
$r.StatusCode          # Esperado: 401
```

---

**T4 — JWT válido → lista empreendimentos**

```powershell
# PowerShell 5.1 e 7
$headers = @{ "Cf-Access-Jwt-Assertion" = $JWT }
Invoke-RestMethod -Uri "$BASE/api/v1/empreendimentos" -Headers $headers
# Esperado: array com 2 empreendimentos fictícios (Itaboraí faixa 2, SG faixa 3)
```

---

**T5 — Criar lead → HTTP 201**

```powershell
# PowerShell 5.1 e 7
$headers = @{
  "Cf-Access-Jwt-Assertion" = $JWT
  "Content-Type"            = "application/json"
}
$body = '{"nome":"Maria Teste Ficticia","telefone":"21987654321","email":"maria.ficticia@example.com","empreendimento_id":1,"origem":"portal_organico","idempotency_key":"test-lead-001"}'

$r = Invoke-WebRequest -Uri "$BASE/api/v1/leads" `
     -Method POST -Headers $headers -Body $body -UseBasicParsing `
     -ErrorAction SilentlyContinue
$r.StatusCode          # Esperado: 201
$r.Content | ConvertFrom-Json
```

> **PowerShell 5.1:** `-UseBasicParsing` é necessário pois o Internet Explorer engine pode não estar disponível. No PS 7, o parâmetro é ignorado silenciosamente — funciona em ambos.

---

**T6 — Idempotência → HTTP 200 com `idempotent: true`**

```powershell
# Repetir exatamente o mesmo corpo do T5 (mesma idempotency_key)
$r = Invoke-WebRequest -Uri "$BASE/api/v1/leads" `
     -Method POST -Headers $headers -Body $body -UseBasicParsing `
     -ErrorAction SilentlyContinue
$r.StatusCode          # Esperado: 200
($r.Content | ConvertFrom-Json).idempotent   # Esperado: True
```

---

**T7 — Deduplicação de telefone (5 chamadas, mesmo telefone)**

```powershell
# PowerShell 5.1 e 7 — jobs paralelos
$jobs = 1..5 | ForEach-Object {
  $i = $_
  Start-Job -ScriptBlock {
    param($base, $jwt, $i)
    $h = @{
      "Cf-Access-Jwt-Assertion" = $jwt
      "Content-Type"            = "application/json"
    }
    $b = "{`"nome`":`"Dup $i`",`"telefone`":`"21911112222`",`"origem`":`"google_ads`",`"idempotency_key`":`"dup-test-$i`"}"
    Invoke-WebRequest -Uri "$base/api/v1/leads" `
      -Method POST -Headers $h -Body $b `
      -UseBasicParsing -ErrorAction SilentlyContinue |
      Select-Object -ExpandProperty StatusCode
  } -ArgumentList $BASE, $JWT, $i
}
$jobs | Wait-Job | Receive-Job
# Esperado: 5 linhas, cada uma com valor 201

# Verificar no D1 (via Cloudflare Dashboard → D1 → market-imobi-staging → Console):
# SELECT COUNT(*) FROM contatos WHERE telefone = '+5521911112222';
# → 1 (um único contato, apesar das 5 chamadas)
# SELECT COUNT(*) FROM leads WHERE contato_id = (SELECT id FROM contatos WHERE telefone = '+5521911112222');
# → 5
Remove-Job $jobs
```

---

**T8 — HTTP 403: usuário sem permissão (se tiver 2 usuários de teste)**

```powershell
# Com JWT de corretor 2 (deve ser cf_access_id diferente do corretor 1 no seed):
$JWT_C2 = "JWT_DO_CORRETOR_2"
$r = Invoke-WebRequest -Uri "$BASE/api/v1/leads" `
     -Headers @{ "Cf-Access-Jwt-Assertion" = $JWT_C2 } `
     -UseBasicParsing -ErrorAction SilentlyContinue
# Esperado: 200, mas lista vazia — corretor 2 não vê leads de corretor 1
# Para forçar 403: tentar PATCH em oportunidade do corretor 1 com JWT do corretor 2
```

---

### C4 — Desabilitar workers.dev (após todos os testes passarem)

Somente após confirmar que `api-staging.queromeumcmv.com.br` responde corretamente:

1. Cloudflare Dashboard → **Workers & Pages → market-imobi-crm-staging**
2. Aba **Settings → Domains & Routes**
3. Localize a linha **workers.dev** → clique em **Disable**

A partir desse momento o Worker responde **exclusivamente** por `api-staging.queromeumcmv.com.br`, que está protegido pelo CF Access.

---

## Resumo — recursos já criados (sem ação necessária)

| Recurso | ID / Detalhe | Status |
|---|---|---|
| D1 `market-imobi-staging` | `f214ad6c-50d5-4afb-89c0-a18a4208cf89` | ✅ 16 tabelas + seed fictício |
| KV `market-imobi-jwks-cache-staging` | `f17d5063d19d4f739db793931c6b6e43` | ✅ cache JWKS TTL 3600s |
| Worker TypeScript | 8 arquivos, `dist/worker.js` 20 KB | ✅ |
| Branch staging | `feat/market-imobi-crm-staging` no GitHub | ✅ `main` intocada |
| Rota no wrangler.toml | `api-staging.queromeumcmv.com.br/*` | ✅ |
| Validação JWT | alg · exp · iss · aud · assinatura · sub→D1 | ✅ |

---

## Após o deploy — informar Claude

Compartilhe para concluir os entregáveis da Fase 3A:

1. Resultado do `Invoke-RestMethod "$BASE/health"` (confirmar `status: ok`)
2. Resultados dos testes T1–T8 (status HTTP de cada um)
3. Valor de `CF_ACCESS_TEAM_DOMAIN` (domínio público, sem segredo)
