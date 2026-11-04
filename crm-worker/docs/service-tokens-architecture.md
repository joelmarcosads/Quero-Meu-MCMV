# Cloudflare Access Service Tokens — Análise de Arquitetura

> **Status:** Proposta técnica — requer autorização antes de qualquer implementação  
> **Data:** 2026-11-03  
> **Branch:** feat/market-imobi-crm-staging

---

## 1. Como o Cloudflare Access autentica requisições M2M

### Fluxo de autenticação com Service Token

```
GitHub Actions (CI)
  │
  │  Headers da requisição:
  │  CF-Access-Client-Id:     <client_id>
  │  CF-Access-Client-Secret: <client_secret>
  ▼
Cloudflare Access (borda)
  │  Valida Client ID + Secret contra registro do token
  │  Se válido: assina e injeta Cf-Access-Jwt-Assertion
  │  Se inválido: retorna 401 antes de chegar ao Worker
  ▼
Cloudflare Worker
  │  Recebe Cf-Access-Jwt-Assertion (JWT RS256 assinado pela CF)
  │  auth.ts → verifyJwt() valida assinatura, iss, aud, exp
  │  PROBLEMA: sub é string vazia (ver seção 3)
  ▼
D1 (banco de dados)
```

A CF Access não diferencia o tratamento do JWT para o Worker: em ambos os casos (humano ou serviço), o header `Cf-Access-Jwt-Assertion` é injetado. A diferença está nos **claims** do payload.

---

## 2. Claims disponíveis no JWT

### JWT de usuário humano

```json
{
  "aud": ["4e8722c354df3e583fb04ceb1c1c3da7bdac50aaabccb867764cce151e59327d"],
  "email": "corretor@exemplo.com",
  "exp": 1762300000,
  "iat": 1762296400,
  "nbf": 1762296400,
  "iss": "https://<team>.cloudflareaccess.com",
  "type": "app",
  "identity_nonce": "abc123",
  "sub": "a1b2c3d4-e5f6-...",
  "country": "BR"
}
```

### JWT de Service Token

```json
{
  "aud": ["4e8722c354df3e583fb04ceb1c1c3da7bdac50aaabccb867764cce151e59327d"],
  "exp": 1762300000,
  "iat": 1762296400,
  "iss": "https://<team>.cloudflareaccess.com",
  "type": "app",
  "common_name": "market-imobi-ci-tests",
  "sub": ""
}
```

### Diferenças críticas

| Claim | Usuário humano | Service Token |
|-------|---------------|---------------|
| `sub` | UUID único do usuário na conta CF | **String vazia `""`** |
| `email` | Email do usuário | **Ausente** |
| `common_name` | **Ausente** | **Client ID do token** |
| `identity_nonce` | Presente | Ausente |
| `country` | Presente | Ausente |
| `type` | `"app"` | `"app"` (igual — não usar para distinguir) |

**Fonte:** [Cloudflare One — Application token](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/application-token/)

---

## 3. Incompatibilidade crítica com `auth.ts` atual

### Problema identificado

O `authenticate()` em `src/auth.ts` (linha 195) faz:

```typescript
const result = await env.DB.prepare(
  `SELECT id, cf_access_id, nome, perfil, email
   FROM usuarios
   WHERE cf_access_id = ? AND deleted_at IS NULL
   LIMIT 1`,
).bind(payload.sub).first<AuthenticatedUser>();
```

Para um service token, `payload.sub = ""` → a query retorna `null` → `AuthError 401`.

**Comportamento atual:** qualquer service token resulta em 401, independentemente de haver um usuário cadastrado.

### Solução proposta

Estender `verifyJwt()` para retornar o payload completo incluindo `common_name`, e estender `authenticate()` para detectar service tokens:

```typescript
// Extensão necessária em JwtPayload (src/auth.ts)
interface JwtPayload {
  sub: string;
  iss: string;
  aud: string[];
  exp: number;
  iat: number;
  jti?: string;
  email?: string;
  common_name?: string;  // ← ADICIONAR: presente apenas em service tokens
}

// Lógica de lookup em authenticate() (src/auth.ts)
// Detectar tipo de identidade
const isServiceToken = payload.sub === '' && typeof payload.common_name === 'string';
const lookupKey = isServiceToken ? payload.common_name! : payload.sub;

const result = await env.DB.prepare(
  `SELECT id, cf_access_id, nome, perfil, email
   FROM usuarios
   WHERE cf_access_id = ? AND deleted_at IS NULL
   LIMIT 1`,
).bind(lookupKey).first<AuthenticatedUser>();
```

Isso permite que service tokens sejam mapeados para registros em `usuarios` usando o Client ID como `cf_access_id`, mantendo o fluxo de autorização por perfil e ownership existente.

---

## 4. Identificação da identidade de serviço no banco

Para que o service token de CI seja reconhecido pelo Worker, é necessário inserir um registro na tabela `usuarios` do banco D1 staging:

```sql
-- A executar SOMENTE após autorização e criação do Service Token no painel CF
-- O <CLIENT_ID> é o valor de CF-Access-Client-Id gerado pelo painel CF Access
INSERT INTO usuarios (nome, email, perfil, creci, cf_access_id) VALUES
  ('CI/CD — GitHub Actions',
   'ci@market-imobi.invalid',
   'admin',               -- perfil admin para cobrir todos os testes de acesso
   NULL,
   '<CLIENT_ID>');        -- substituir pelo Client ID real
```

**Perfil recomendado:** `admin` — permite testar todos os endpoints sem conflito de ownership. Para testes específicos de ownership de corretor, criar um segundo service token com perfil `corretor` e um `responsavel_id` de lead fictício associado.

---

## 5. Distinção entre identidade de serviço e usuário humano

### No Worker

```typescript
// Após authenticate(), verificar se a requisição veio de um service token
// Adicionar campo is_service_token ao AuthenticatedUser ou verificar via email
const isServiceTokenRequest = !payload.email && payload.common_name !== undefined;
```

Alternativamente, usar uma convenção de nomenclatura no campo `cf_access_id`:
- Usuários humanos: UUID (ex: `a1b2c3d4-...`)
- Service tokens: prefixo `svc:` (ex: `svc:market-imobi-ci-tests`)

### Em logs e audit_log

Registrar o `common_name` em `audit_log.dados_novos` ao invés de deixar sem identificação. Proposta de campo adicional na sessão ou header customizado não é necessária — o `common_name` no JWT já identifica a operação.

---

## 6. Autorização por perfil e ownership

### Perfil

A tabela `usuarios` já tem `perfil CHECK(perfil IN ('admin','corretor','assistente'))`. O service token de CI é cadastrado com `perfil = 'admin'`, passando automaticamente em todas as verificações de `requirePerfil()`.

### Ownership

O `requireOwnershipOrAdmin()` retorna sem erro quando `user.perfil === 'admin'`. Portanto, um service token com perfil admin pode acessar qualquer recurso sem conflito de ownership — adequado para testes de integração.

Para testar especificamente o isolamento de ownership (T6), é necessário:
1. Criar um segundo service token com perfil `corretor`
2. Inserir leads com `responsavel_id` correspondente a esse usuário CI/corretor
3. Verificar que requests desse token retornam apenas os próprios leads

---

## 7. Como revogar credenciais de teste

### Nível Cloudflare Access (revogação imediata)

1. Painel CF Zero Trust → Access → Service Auth → Service Tokens
2. Localizar `market-imobi-ci-tests` → **Roll** ou **Delete**
3. Qualquer requisição futura com aquele Client ID/Secret retorna 401 na borda — sem chegar ao Worker

### Nível D1 (defesa em profundidade)

```sql
-- Desativar usuário CI sem excluir o registro (preserva audit trail)
UPDATE usuarios SET ativo = 0 WHERE cf_access_id = '<CLIENT_ID>';
-- ou marcar como deletado:
UPDATE usuarios SET deleted_at = datetime('now') WHERE cf_access_id = '<CLIENT_ID>';
```

### Nível GitHub Actions

Remoção dos secrets `CF_ACCESS_CLIENT_ID` e `CF_ACCESS_CLIENT_SECRET` em Settings → Secrets and variables → Actions → deletar ambos.

---

## 8. Resumo de mudanças necessárias em auth.ts

| Mudança | Arquivo | Tipo |
|---------|---------|------|
| Adicionar `common_name?: string` em `JwtPayload` | `src/auth.ts` | Extensão de tipo |
| Detectar service token por `sub === ""` em `authenticate()` | `src/auth.ts` | Lógica de lookup |
| Usar `common_name` como lookup key quando service token | `src/auth.ts` | Lógica de lookup |
| Nenhuma mudança em `verifyJwt()` | `src/auth.ts` | — |
| Nenhuma mudança em `requirePerfil()` ou `requireOwnershipOrAdmin()` | `src/auth.ts` | — |

**Impacto:** mínimo. A validação criptográfica do JWT (assinatura RS256, iss, aud, exp) não muda. Apenas o lookup de identidade no D1 é estendido.

---

## 9. Pré-requisitos para implementação (requer autorização)

- [ ] Criar Service Token no painel CF Access (`market-imobi-ci-tests`)
- [ ] Copiar Client ID e Client Secret gerados
- [ ] Adicionar secrets `CF_ACCESS_CLIENT_ID` e `CF_ACCESS_CLIENT_SECRET` no GitHub
- [ ] Inserir usuário CI no D1 staging com `cf_access_id = <CLIENT_ID>`
- [ ] Aplicar patch em `src/auth.ts` (ver seção 3)
- [ ] Deploy do Worker atualizado na branch staging
- [ ] Executar workflow de testes

Nenhum destes passos foi executado nesta etapa.
