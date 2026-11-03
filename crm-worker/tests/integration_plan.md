# Plano de Testes de Integração — Fase 3A Staging

> Execute APÓS o deploy (`wrangler deploy --env staging`) e com CF Access configurado.
> Substitua `$BASE` pela URL real do Worker e `$JWT` por um token válido.

```bash
BASE="https://market-imobi-crm-staging.<subdominio>.workers.dev"
JWT="<Cf-Access-Jwt-Assertion do usuário de teste>"
```

---

## T1 — Health Check (sem autenticação)

```bash
curl -sS "$BASE/health"
# Esperado: {"status":"ok","environment":"staging",...}
```

---

## T2 — Autenticação: token ausente → 401

```bash
curl -sS -w "\nHTTP %{http_code}\n" "$BASE/api/v1/empreendimentos"
# Esperado: HTTP 401, {"error":"Token de autenticação ausente..."}
```

---

## T3 — Autenticação: JWT inválido → 401

```bash
curl -sS -w "\nHTTP %{http_code}\n" \
  -H "Cf-Access-Jwt-Assertion: token.invalido.aqui" \
  "$BASE/api/v1/empreendimentos"
# Esperado: HTTP 401
```

---

## T4 — Listar empreendimentos (autenticado)

```bash
curl -sS -H "Cf-Access-Jwt-Assertion: $JWT" "$BASE/api/v1/empreendimentos"
# Esperado: lista com 2 empreendimentos fictícios (Itaboraí faixa 2, SG faixa 3)
```

---

## T5 — Criar lead (POST)

```bash
curl -sS -X POST \
  -H "Cf-Access-Jwt-Assertion: $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Teste Fictícia",
    "telefone": "21987654321",
    "email": "maria.ficticia@example.com",
    "empreendimento_id": 1,
    "origem": "portal_organico",
    "idempotency_key": "test-lead-001"
  }' \
  "$BASE/api/v1/leads"
# Esperado: HTTP 201, {"id":N,"idempotent":false,...}
```

---

## T6 — Idempotência: mesmo key → 200 idempotent:true

```bash
# Segunda chamada com a mesma idempotency_key
curl -sS -X POST \
  -H "Cf-Access-Jwt-Assertion: $JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Teste Fictícia",
    "telefone": "21987654321",
    "email": "maria.ficticia@example.com",
    "empreendimento_id": 1,
    "origem": "portal_organico",
    "idempotency_key": "test-lead-001"
  }' \
  "$BASE/api/v1/leads"
# Esperado: HTTP 200, {"idempotent":true,"lead_id":N}
```

---

## T7 — Deduplicação de telefone (concorrência simulada)

```bash
# Enviar 5 requisições simultâneas com mesmo telefone, keys diferentes
for i in 1 2 3 4 5; do
  curl -sS -X POST \
    -H "Cf-Access-Jwt-Assertion: $JWT" \
    -H "Content-Type: application/json" \
    -d "{\"nome\":\"Dup Teste $i\",\"telefone\":\"21911112222\",\"origem\":\"google_ads\",\"idempotency_key\":\"dup-test-$i\"}" \
    "$BASE/api/v1/leads" &
done
wait
# Esperado: todos retornam HTTP 201/200; contatos com telefone 21911112222
#           deve existir UM ÚNICO registro em contatos (dedup INSERT OR IGNORE)
```

Verificar no D1 (via Cloudflare Dashboard ou MCP):
```sql
SELECT COUNT(*) FROM contatos WHERE telefone = '+5521911112222';
-- Esperado: 1
SELECT COUNT(*) FROM leads WHERE contato_id = (
  SELECT id FROM contatos WHERE telefone = '+5521911112222'
);
-- Esperado: 5
```

---

## T8 — Autorização: corretor não vê leads de outro corretor

```bash
# Com JWT do corretor 2 (cf_access_id diferente):
curl -sS -H "Cf-Access-Jwt-Assertion: $JWT_CORRETOR2" \
  "$BASE/api/v1/leads"
# Esperado: lista vazia (não vê leads do corretor 1)
```

---

## T9 — Progressão de estágio

```bash
LEAD_ID=1  # ajustar para ID retornado no T5
OPO_ID=... # obter do GET /api/v1/leads/$LEAD_ID

curl -sS -X PATCH \
  -H "Cf-Access-Jwt-Assertion: $JWT" \
  -H "Content-Type: application/json" \
  -d '{"estagio":"em_contato"}' \
  "$BASE/api/v1/oportunidades/$OPO_ID/estagio"
# Esperado: HTTP 200, oportunidade com estagio=em_contato
```

---

## T10 — Métricas de CPU / Latência

Executar 100 requests e medir (requer `hyperfine` ou `hey`):

```bash
# Com hey (Go HTTP load tester):
hey -n 100 -c 10 \
  -H "Cf-Access-Jwt-Assertion: $JWT" \
  "$BASE/api/v1/empreendimentos"

# Registrar P50, P95, P99 da saída
```

Ou via Cloudflare Dashboard → Workers → market-imobi-crm-staging → Analytics
- CPU Time (median e p99)
- Request Duration
- Errors

---

## T11 — Backup D1 (export SQL)

```bash
# No computador com wrangler instalado:
wrangler d1 export market-imobi-staging \
  --remote \
  --output ./backup/staging-$(date +%Y%m%d-%H%M%S).sql

# Verificar tamanho e integridade
wc -l ./backup/staging-*.sql
grep -c "CREATE TABLE" ./backup/staging-*.sql
# Esperado: 16 linhas (16 tabelas)
```

---

## T12 — Restauração D1 (Time Travel)

```bash
# Listar bookmarks disponíveis
wrangler d1 time-travel info market-imobi-staging

# Restaurar para timestamp anterior (teste)
wrangler d1 time-travel restore market-imobi-staging \
  --timestamp="2026-11-03T12:00:00Z"
# ⚠️  APENAS EM STAGING — nunca em produção
```

---

## Checklist de Entregáveis Fase 3A

- [ ] T1–T4: autenticação real funcionando
- [ ] T5–T7: leads, idempotência, dedup concorrente
- [ ] T8: isolamento por corretor
- [ ] T9: progressão de estágio
- [ ] T10: CPU P50 < 5ms, P99 < 10ms (dentro do free tier 10ms/req)
- [ ] T11: backup SQL gerado e verificado
- [ ] T12: Time Travel documentado (RPO ~1min, RTO ~5min)
- [ ] Consumo free tier documentado (D1 reads/writes, KV ops, Worker requests)
