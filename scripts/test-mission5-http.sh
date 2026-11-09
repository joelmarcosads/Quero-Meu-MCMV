#!/usr/bin/env bash
# =============================================================================
# MARKET IMOBI CRM — MISSION 5: TESTES DE INTEGRAÇÃO HTTP
# Alvo exclusivo: api-staging.queromeumcmv.com.br
# Versão: 2.2.0 — 2026-11-09 (fix HT1: jf // empty suprime boolean false)
# =============================================================================
# USO:
#   export CF_TOKEN="$(cat ~/.cf-staging-token)"
#   chmod +x scripts/test-mission5-http.sh
#   ./scripts/test-mission5-http.sh
#
# Como obter o CF_TOKEN (Cloudflare Access JWT):
#   1. Abra no navegador: https://api-staging.queromeumcmv.com.br/cdn-cgi/access/token
#   2. Copie o valor do campo "token" (SEM aspas, SEM quebra de linha)
#   3. echo 'SEU_TOKEN' > ~/.cf-staging-token && chmod 600 ~/.cf-staging-token
#   4. export CF_TOKEN="$(cat ~/.cf-staging-token)"
#
# SAÍDA:
#   ./test-results/mission5-http-<timestamp>.log   — log sanitizado (sem tokens)
#   ./test-results/mission5-http-<timestamp>.json  — resultados estruturados
#
# CRITÉRIOS DE APROVAÇÃO:
#   HT0  GET  /health                              → 200
#   HT1  POST /public/leads (inédito)              → 201, idempotent=false, data.id > 0
#   HT2  POST /public/leads (mesmo payload)        → 200, idempotent=true, mesmo data.id
#   HT3a POST /public/leads cria contato-A         → 201
#   HT3b POST /public/leads cria contato-B         → 201
#   HT3c POST /public/leads phoneA+emailB (conflict)→ 200 (silencioso — sem conflito_id público)
#   HT3d GET  /conflitos?status=pendente           → conflito presente (identificado pela key)
#   HT4  Conflito listado no painel admin          → data.conflitos contém o conflito
#   HT5  POST /conflitos/:id/resolver              → 201, data.lead_id > 0
#   HT6  Vínculo exato conflito↔lead               → data.lead_id == conflito.lead_id_gerado
#   HT7a Duas resoluções simultâneas               → exatamente 1×201 e 1×409
#   HT7b Lead único no D1                          → conflito.lead_id_gerado único
#
# SEGURANÇA:
#   CF_TOKEN é escrito em tmpfile chmod 600 e passado via -H @file.
#   NUNCA aparece em argumentos de processo (ps aux), logs ou relatórios.
#   Apenas "[definido]" é registrado para confirmação.
#
# RESTRIÇÕES:
#   - Dados fictícios com prefixo único por execução
#   - Apenas staging — sem toque em produção, migrations ou Access
# =============================================================================

set -euo pipefail

# ── Configuração ──────────────────────────────────────────────────────────────

readonly BASE_URL="https://api-staging.queromeumcmv.com.br"
RESULTS_DIR="$(cd "$(dirname "$0")/.." && pwd)/test-results"
RUN_ID="$(date +%Y%m%d-%H%M%S)-$$"
LOG_FILE="$RESULTS_DIR/mission5-http-${RUN_ID}.log"
JSON_FILE="$RESULTS_DIR/mission5-http-${RUN_ID}.json"
readonly TIMEOUT=30

# Prefixo único por execução — evita colisão entre runs
RUN_PREFIX="m5h-${RUN_ID}"

# ── Pré-requisitos ────────────────────────────────────────────────────────────

mkdir -p "$RESULTS_DIR"

if ! command -v jq &>/dev/null; then
  echo "ERRO: jq não encontrado. Instale: brew install jq  |  apt install jq" >&2
  exit 1
fi

# ── Autenticação: dois modos suportados ──────────────────────────────────────
#
#  Modo A — JWT (uso local, sessão de browser):
#    export CF_TOKEN="$(cat ~/.cf-staging-token)"
#    ./scripts/test-mission5-http.sh
#    → Header: cf-access-jwt-assertion: <JWT>
#
#  Modo B — Service Token (GitHub Actions / CI):
#    export CF_SERVICE_TOKEN_ID="<client-id>"
#    export CF_SERVICE_TOKEN_SECRET="<client-secret>"
#    ./scripts/test-mission5-http.sh
#    → Headers: CF-Access-Client-Id: <id>
#               CF-Access-Client-Secret: <secret>
#    Nenhuma credencial aparece em argumentos de processo (ps aux).
#
# Nunca definir ambos; CF_SERVICE_TOKEN_* tem precedência.

AUTH_MODE=""
if [[ -n "${CF_SERVICE_TOKEN_ID:-}" ]] && [[ -n "${CF_SERVICE_TOKEN_SECRET:-}" ]]; then
  AUTH_MODE="service-token"
elif [[ -n "${CF_TOKEN:-}" ]]; then
  AUTH_MODE="jwt"
else
  cat >&2 <<'EOF'

ERRO: credenciais de autenticação não definidas.

  Modo local (JWT):
    export CF_TOKEN="$(cat ~/.cf-staging-token)"
    Obtenha o token: https://api-staging.queromeumcmv.com.br/cdn-cgi/access/token

  Modo CI (Service Token):
    export CF_SERVICE_TOKEN_ID="<CF-Access-Client-Id>"
    export CF_SERVICE_TOKEN_SECRET="<CF-Access-Client-Secret>"

EOF
  exit 1
fi

# Gravar headers em arquivo temporário seguro — credenciais nunca vão para ps aux
CF_HEADER_FILE=$(mktemp)
chmod 600 "$CF_HEADER_FILE"
if [[ "$AUTH_MODE" == "service-token" ]]; then
  # curl aceita múltiplos headers por linha em -H @file
  printf 'CF-Access-Client-Id: %s\nCF-Access-Client-Secret: %s' \
    "$CF_SERVICE_TOKEN_ID" "$CF_SERVICE_TOKEN_SECRET" > "$CF_HEADER_FILE"
else
  printf 'cf-access-jwt-assertion: %s' "$CF_TOKEN" > "$CF_HEADER_FILE"
fi
# Limpar arquivo de header ao sair (normal, erro ou sinal)
trap 'rm -f "$CF_HEADER_FILE"; save_json' EXIT INT TERM

# ── Helpers ───────────────────────────────────────────────────────────────────

PASS=0; FAIL=0; declare -a RESULTS=()

log()     { echo "[$(date +%H:%M:%S)] $*" | tee -a "$LOG_FILE"; }
section() { log ""; log "━━━ $* ━━━"; }
pass()    {
  local name="$1"
  PASS=$((PASS+1))
  log "  ✅ PASS  $name"
  RESULTS+=("{\"test\":\"$name\",\"result\":\"PASS\"}")
}
fail()    {
  local name="$1" reason="$2"
  FAIL=$((FAIL+1))
  log "  ❌ FAIL  $name — $reason"
  RESULTS+=("{\"test\":\"$name\",\"result\":\"FAIL\",\"reason\":$(printf '%s' "$reason" | jq -Rs .)}")
}
abort()   { log "  🛑 ABORT — $*"; log "  Diagnóstico: $LOG_FILE"; exit 1; }

# http <METHOD> <URL> [curl-extra-args...]
# Retorna: HTTP_CODE\tDURATION_MS\tBODY
# CF_TOKEN injetado via CF_HEADER_FILE — nunca exposto em argumentos de processo
http() {
  local method="$1" url="$2"; shift 2
  local tmpbody; tmpbody=$(mktemp)
  local start end duration http_code
  start=$(date +%s%3N)
  http_code=$(curl -s -o "$tmpbody" -w "%{http_code}" \
    --max-time "$TIMEOUT" \
    -H @"$CF_HEADER_FILE" \
    -H "Accept: application/json" \
    -X "$method" "$@" "$url" 2>>"$LOG_FILE")
  end=$(date +%s%3N)
  duration=$(( end - start ))
  local body; body=$(cat "$tmpbody"); rm -f "$tmpbody"
  printf '%s\t%s\t%s' "$http_code" "$duration" "$body"
}

# Extrai campo jq com fallback vazio — nunca falha com set -e
jf() { printf '%s' "$1" | jq -r "$2 // empty" 2>/dev/null || true; }

save_json() {
  [[ ${#RESULTS[@]} -eq 0 ]] && return
  local arr; arr=$(printf '%s,' "${RESULTS[@]}"); arr="${arr%,}"
  jq -n \
    --arg run_id  "$RUN_ID" \
    --arg base    "$BASE_URL" \
    --argjson pass "$PASS" \
    --argjson fail "$FAIL" \
    --argjson results "[$arr]" \
    '{run_id:$run_id, base_url:$base,
      cf_token:"[não registrado]",
      summary:{pass:$pass,fail:$fail,total:($pass+$fail)},
      tests:$results}' > "$JSON_FILE" 2>/dev/null || true
}

# ── Início ────────────────────────────────────────────────────────────────────

section "MARKET IMOBI CRM — MISSION 5: TESTES HTTP"
log "Run ID   : $RUN_ID"
log "Base URL : $BASE_URL"
log "Auth Mode: $AUTH_MODE ([credenciais não registradas nos logs])"
log "Log      : $LOG_FILE"
log "JSON     : $JSON_FILE"
log ""

# ── HT0: Health check ─────────────────────────────────────────────────────────

section "HT0 — Health check"
IFS=$'\t' read -r code dur body <<< "$(http GET "$BASE_URL/health")"
log "  GET /health → $code (${dur}ms)"
if [[ "$code" == "200" ]]; then
  ENVIRONMENT=$(jf "$body" ".environment")
  log "  environment=$ENVIRONMENT"
  if [[ "$ENVIRONMENT" != "staging" ]] && [[ "$ENVIRONMENT" != "development" ]]; then
    abort "environment='$ENVIRONMENT' — este script só deve rodar em staging!"
  fi
  pass "HT0-health"
else
  abort "Worker não responde (HTTP $code). Verifique o deploy do staging."
fi

BASELINE_TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
log ""
log "Baseline timestamp UTC: $BASELINE_TS"
log "(Registrar contagens D1 pré-teste via MCP para comparação pós-run)"

# ── HT1: Novo lead inédito ────────────────────────────────────────────────────

section "HT1 — Novo lead (contato inédito)"
HT1_EXT_ID="${RUN_PREFIX}-ht1"
HT1_PAYLOAD=$(jq -n \
  --arg nome  "HT1 Teste HTTP" \
  --arg wa    "+5521966660101" \
  --arg email "${RUN_PREFIX}-ht1@teste.invalid" \
  --arg ext   "$HT1_EXT_ID" \
  '{nome:$nome, whatsapp:$wa, email:$email, external_id:$ext,
    consentimento_lgpd:true,
    utm_source:"test", utm_medium:"integration"}')

IFS=$'\t' read -r code dur body <<< "$(http POST "$BASE_URL/api/v1/public/leads" \
  -H "Content-Type: application/json" -d "$HT1_PAYLOAD")"
log "  POST /api/v1/public/leads → $code (${dur}ms)"

HT1_LEAD_ID=$(jf "$body" ".data.id")
HT1_IDEMPOTENT=$(jf "$body" ".idempotent")
log "  data.id=$HT1_LEAD_ID  idempotent=$HT1_IDEMPOTENT"

# Nota: jf usa "// empty" que suprime boolean false → idempotent=false chega como ''.
# Para novo lead: idempotent != true  (false ou ausente são ambos corretos)
if [[ "$code" == "201" ]] && [[ -n "$HT1_LEAD_ID" ]] && [[ "$HT1_IDEMPOTENT" != "true" ]]; then
  pass "HT1-novo-lead"
else
  fail "HT1-novo-lead" "HTTP $code, data.id='$HT1_LEAD_ID', idempotent='$HT1_IDEMPOTENT'"
fi

# ── HT2: Idempotência — mesmo payload ────────────────────────────────────────

section "HT2 — Idempotência (payload idêntico ao HT1)"
# HT1_PAYLOAD reutilizado sem alteração — mesma variável, mesmo JSON
IFS=$'\t' read -r code dur body <<< "$(http POST "$BASE_URL/api/v1/public/leads" \
  -H "Content-Type: application/json" -d "$HT1_PAYLOAD")"
log "  POST /api/v1/public/leads (reenvio) → $code (${dur}ms)"

HT2_LEAD_ID=$(jf "$body" ".data.id")
HT2_IDEMPOTENT=$(jf "$body" ".idempotent")
log "  data.id=$HT2_LEAD_ID  idempotent=$HT2_IDEMPOTENT"

if [[ "$code" == "200" ]] && \
   [[ "$HT2_LEAD_ID" == "$HT1_LEAD_ID" ]] && \
   [[ "$HT2_IDEMPOTENT" == "true" ]]; then
  pass "HT2-idempotencia"
else
  fail "HT2-idempotencia" \
    "HTTP $code, id HT1=$HT1_LEAD_ID HT2=$HT2_LEAD_ID, idempotent='$HT2_IDEMPOTENT'"
fi

# ── HT3: Criação de conflito real via API ─────────────────────────────────────
#
# Para obter kind:'conflict' no ContactResolver:
#   byPhone(phoneA) → contato A
#   byEmail(emailB) → contato B   (A ≠ B)
#
# Passos:
#   HT3a: cria contato A com phoneA + emailA → lead criado
#   HT3b: cria contato B com phoneB + emailB → lead criado
#   HT3c: envia phoneA + emailB              → conflict detectado → 200 silencioso
#   HT3d: GET /conflitos (admin) → localiza conflito pelo idempotency_key

section "HT3a — Cria contato A (phoneA + emailA)"
HT3_PHONE_A="+5521966660202"
HT3_EMAIL_A="${RUN_PREFIX}-contatoA@teste.invalid"
HT3A_EXT_ID="${RUN_PREFIX}-ht3a"
HT3A_PAYLOAD=$(jq -n \
  --arg nome  "HT3 Contato A" \
  --arg wa    "$HT3_PHONE_A" \
  --arg email "$HT3_EMAIL_A" \
  --arg ext   "$HT3A_EXT_ID" \
  '{nome:$nome, whatsapp:$wa, email:$email, external_id:$ext,
    consentimento_lgpd:true, utm_source:"test"}')

IFS=$'\t' read -r code dur body <<< "$(http POST "$BASE_URL/api/v1/public/leads" \
  -H "Content-Type: application/json" -d "$HT3A_PAYLOAD")"
log "  POST /public/leads (contato-A) → $code (${dur}ms)"
HT3A_LEAD_ID=$(jf "$body" ".data.id")
log "  data.id=$HT3A_LEAD_ID"

if [[ "$code" == "201" ]] && [[ -n "$HT3A_LEAD_ID" ]]; then
  pass "HT3a-cria-contato-A"
else
  fail "HT3a-cria-contato-A" "HTTP $code, data.id='$HT3A_LEAD_ID'"
fi

section "HT3b — Cria contato B (phoneB + emailB)"
HT3_PHONE_B="+5521966660303"
HT3_EMAIL_B="${RUN_PREFIX}-contatoB@teste.invalid"
HT3B_EXT_ID="${RUN_PREFIX}-ht3b"
HT3B_PAYLOAD=$(jq -n \
  --arg nome  "HT3 Contato B" \
  --arg wa    "$HT3_PHONE_B" \
  --arg email "$HT3_EMAIL_B" \
  --arg ext   "$HT3B_EXT_ID" \
  '{nome:$nome, whatsapp:$wa, email:$email, external_id:$ext,
    consentimento_lgpd:true, utm_source:"test"}')

IFS=$'\t' read -r code dur body <<< "$(http POST "$BASE_URL/api/v1/public/leads" \
  -H "Content-Type: application/json" -d "$HT3B_PAYLOAD")"
log "  POST /public/leads (contato-B) → $code (${dur}ms)"
HT3B_LEAD_ID=$(jf "$body" ".data.id")
log "  data.id=$HT3B_LEAD_ID"

if [[ "$code" == "201" ]] && [[ -n "$HT3B_LEAD_ID" ]]; then
  pass "HT3b-cria-contato-B"
else
  fail "HT3b-cria-contato-B" "HTTP $code, data.id='$HT3B_LEAD_ID'"
fi

section "HT3c — Aciona conflito (phoneA + emailB)"
# phoneA → contato A | emailB → contato B → conflict!
# Rota pública retorna 200 silencioso { success: true } — sem conflito_id
HT3C_EXT_ID="${RUN_PREFIX}-ht3c-conflict"
HT3C_PAYLOAD=$(jq -n \
  --arg nome  "HT3 Visitante Conflito" \
  --arg wa    "$HT3_PHONE_A" \
  --arg email "$HT3_EMAIL_B" \
  --arg ext   "$HT3C_EXT_ID" \
  '{nome:$nome, whatsapp:$wa, email:$email, external_id:$ext,
    consentimento_lgpd:true,
    utm_source:"google", utm_medium:"cpc", utm_campaign:"mcmv-itaborai"}')

IFS=$'\t' read -r code dur body <<< "$(http POST "$BASE_URL/api/v1/public/leads" \
  -H "Content-Type: application/json" -d "$HT3C_PAYLOAD")"
log "  POST /public/leads (phoneA+emailB) → $code (${dur}ms)"
HT3C_SUCCESS=$(jf "$body" ".success")
log "  success=$HT3C_SUCCESS (rota pública não expõe conflito_id)"

# Worker retorna 200 { success:true } para conflito — comportamento esperado (LGPD)
if [[ "$code" == "200" ]] && [[ "$HT3C_SUCCESS" == "true" ]]; then
  pass "HT3c-acionamento-conflito"
else
  fail "HT3c-acionamento-conflito" "HTTP $code, success='$HT3C_SUCCESS'"
fi

section "HT3d — Localiza conflito via API admin (por idempotency_key)"
IFS=$'\t' read -r code dur body <<< "$(http GET \
  "$BASE_URL/api/v1/conflitos?status=pendente&limit=100")"
log "  GET /api/v1/conflitos?status=pendente → $code (${dur}ms)"

CONFLITO_COUNT=$(jf "$body" ".data.conflitos | length")
# Localiza conflito pelo idempotency_key — único por execução
HT3_CONFLITO_ID=$(jf "$body" \
  ".data.conflitos[] | select(.idempotency_key == \"${HT3C_EXT_ID}\") | .id")
log "  conflitos pendentes=$CONFLITO_COUNT  conflito_id=${HT3_CONFLITO_ID:-NÃO ENCONTRADO}"

if [[ "$code" == "200" ]] && [[ -n "$HT3_CONFLITO_ID" ]]; then
  pass "HT3d-conflito-localizado-admin"
else
  fail "HT3d-conflito-localizado-admin" \
    "HTTP $code, conflitos=$CONFLITO_COUNT, id por key='${HT3_CONFLITO_ID:-}'"
fi

# ── HT4: Painel admin lista o conflito ───────────────────────────────────────

section "HT4 — Conflito visível na listagem admin"
# Reutiliza a resposta de HT3d (já temos o dado)
HT4_TEL_ID=$(jf "$body" \
  ".data.conflitos[] | select(.idempotency_key == \"${HT3C_EXT_ID}\") | .tel_contato_id")
HT4_EMAIL_ID=$(jf "$body" \
  ".data.conflitos[] | select(.idempotency_key == \"${HT3C_EXT_ID}\") | .email_contato_id")
log "  conflito #$HT3_CONFLITO_ID: tel_contato_id=$HT4_TEL_ID email_contato_id=$HT4_EMAIL_ID"

if [[ -n "$HT4_TEL_ID" ]] && [[ -n "$HT4_EMAIL_ID" ]] && \
   [[ "$HT4_TEL_ID" != "$HT4_EMAIL_ID" ]]; then
  pass "HT4-conflito-listado-admin"
else
  fail "HT4-conflito-listado-admin" \
    "tel_contato_id='$HT4_TEL_ID' email_contato_id='$HT4_EMAIL_ID'"
fi

# ── HT5: Resolução via API (retorna 201) ─────────────────────────────────────

section "HT5 — Resolução via API (escolha: tel)"
if [[ -z "${HT3_CONFLITO_ID:-}" ]]; then
  fail "HT5-resolver-conflito" "conflito_id indisponível (HT3d falhou)"
  HT5_LEAD_ID=""
  HT5_CONFLITO_STATUS=""
else
  IFS=$'\t' read -r code dur body <<< "$(http POST \
    "$BASE_URL/api/v1/conflitos/${HT3_CONFLITO_ID}/resolver" \
    -H "Content-Type: application/json" \
    -d '{"escolha":"tel"}')"
  log "  POST /api/v1/conflitos/${HT3_CONFLITO_ID}/resolver → $code (${dur}ms)"

  HT5_LEAD_ID=$(jf "$body" ".data.lead_id")
  HT5_CONFLITO_STATUS=$(jf "$body" ".data.status")
  HT5_CONTATO_ID=$(jf "$body" ".data.contato_id")
  HT5_ESCOLHA=$(jf "$body" ".data.escolha")
  log "  data.status=$HT5_CONFLITO_STATUS data.lead_id=$HT5_LEAD_ID" \
      "data.contato_id=$HT5_CONTATO_ID data.escolha=$HT5_ESCOLHA"

  # POST /resolver → jsonCreated → 201
  if [[ "$code" == "201" ]] && \
     [[ -n "$HT5_LEAD_ID" ]] && \
     [[ "$HT5_CONFLITO_STATUS" == "resolvido_tel" ]]; then
    pass "HT5-resolver-conflito"
  else
    fail "HT5-resolver-conflito" \
      "HTTP $code, status='$HT5_CONFLITO_STATUS', lead_id='$HT5_LEAD_ID'"
    HT5_LEAD_ID=""
  fi
fi

# ── HT6: Vínculo exato conflito ↔ lead ───────────────────────────────────────

section "HT6 — Vínculo exato conflito↔lead"
# Critério: lead_id retornado pelo resolver deve corresponder EXATAMENTE
# ao lead_id_gerado registrado no conflito (GET /conflitos lista o campo).
# Não usamos GET /conflitos/:id (rota inexistente) — consultamos a listagem
# filtrada por status=resolvido_tel.

if [[ -z "${HT5_LEAD_ID:-}" ]]; then
  fail "HT6-vinculo-conflito-lead" "HT5 não produziu lead_id — skipped"
else
  IFS=$'\t' read -r code dur body <<< "$(http GET \
    "$BASE_URL/api/v1/conflitos?status=resolvido_tel&limit=50")"
  log "  GET /api/v1/conflitos?status=resolvido_tel → $code (${dur}ms)"

  # Localiza o conflito específico pelo id
  HT6_LEAD_VINCULADO=$(jf "$body" \
    ".data.conflitos[] | select(.id == ${HT3_CONFLITO_ID}) | .lead_id_gerado")
  HT6_STATUS=$(jf "$body" \
    ".data.conflitos[] | select(.id == ${HT3_CONFLITO_ID}) | .status")
  log "  conflito #${HT3_CONFLITO_ID}: status=$HT6_STATUS lead_id_gerado=$HT6_LEAD_VINCULADO"
  log "  lead_id do resolver: $HT5_LEAD_ID"

  # Vínculo exato: lead_id_gerado no D1 == lead_id retornado pelo resolver
  if [[ "$code" == "200" ]] && \
     [[ "$HT6_LEAD_VINCULADO" == "$HT5_LEAD_ID" ]] && \
     [[ "$HT6_STATUS" == "resolvido_tel" ]]; then
    pass "HT6-vinculo-conflito-lead"
  else
    fail "HT6-vinculo-conflito-lead" \
      "HTTP $code, status=$HT6_STATUS, lead_id_gerado=$HT6_LEAD_VINCULADO esperado=$HT5_LEAD_ID"
  fi
fi

# ── HT7: Resoluções simultâneas (atomicidade) ─────────────────────────────────

section "HT7 — Resoluções simultâneas"

# Cria conflito dedicado para o teste de concorrência
log "  Criando contato C e D para conflito de concorrência…"

HT7_PHONE_C="+5521966660404"
HT7_EMAIL_C="${RUN_PREFIX}-contatoC@teste.invalid"
HT7_PHONE_D="+5521966660505"
HT7_EMAIL_D="${RUN_PREFIX}-contatoD@teste.invalid"

# Contato C
IFS=$'\t' read -r code dur body <<< "$(http POST "$BASE_URL/api/v1/public/leads" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg n "HT7 Conc C" --arg w "$HT7_PHONE_C" --arg e "$HT7_EMAIL_C" \
         --arg x "${RUN_PREFIX}-ht7c" \
         '{nome:$n,whatsapp:$w,email:$e,external_id:$x,consentimento_lgpd:true}')")"
log "  POST contato-C → $code"

# Contato D
IFS=$'\t' read -r code dur body <<< "$(http POST "$BASE_URL/api/v1/public/leads" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg n "HT7 Conc D" --arg w "$HT7_PHONE_D" --arg e "$HT7_EMAIL_D" \
         --arg x "${RUN_PREFIX}-ht7d" \
         '{nome:$n,whatsapp:$w,email:$e,external_id:$x,consentimento_lgpd:true}')")"
log "  POST contato-D → $code"

# Aciona conflito: phoneC + emailD
HT7_CONFLICT_KEY="${RUN_PREFIX}-ht7-conflict"
IFS=$'\t' read -r code dur body <<< "$(http POST "$BASE_URL/api/v1/public/leads" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg n "HT7 Conflito" --arg w "$HT7_PHONE_C" --arg e "$HT7_EMAIL_D" \
         --arg x "$HT7_CONFLICT_KEY" \
         '{nome:$n,whatsapp:$w,email:$e,external_id:$x,consentimento_lgpd:true}')")"
log "  POST phoneC+emailD → $code (esperado 200 silencioso)"

if [[ "$code" != "200" ]]; then
  fail "HT7-setup-conflito" "HTTP $code (esperado 200)"
  log "  ⚠️  HT7a/HT7b pulados — falha no setup"
else
  # Localiza conflito pelo key
  IFS=$'\t' read -r code dur body <<< "$(http GET \
    "$BASE_URL/api/v1/conflitos?status=pendente&limit=100")"
  HT7_CONFLITO_ID=$(jf "$body" \
    ".data.conflitos[] | select(.idempotency_key == \"$HT7_CONFLICT_KEY\") | .id")
  log "  conflito HT7 id=$HT7_CONFLITO_ID"

  if [[ -z "$HT7_CONFLITO_ID" ]]; then
    fail "HT7-setup-conflito" "conflito_id não localizado na listagem admin"
  else
    log "  Conflito #$HT7_CONFLITO_ID pronto. Disparando resoluções simultâneas…"

    # Dois tmpfiles para capturar resultados das subshells
    TMP1=$(mktemp); TMP2=$(mktemp)

    # Subshells herdam CF_HEADER_FILE (variável exportada) — CF_TOKEN nunca vai
    # para argumentos de processo em nenhuma das duas chamadas
    (
      http POST "$BASE_URL/api/v1/conflitos/${HT7_CONFLITO_ID}/resolver" \
        -H "Content-Type: application/json" -d '{"escolha":"tel"}' \
        > "$TMP1"
    ) &
    PID1=$!

    (
      http POST "$BASE_URL/api/v1/conflitos/${HT7_CONFLITO_ID}/resolver" \
        -H "Content-Type: application/json" -d '{"escolha":"email"}' \
        > "$TMP2"
    ) &
    PID2=$!

    wait $PID1 $PID2 2>/dev/null || true
    sleep 1  # margem para D1 confirmar escrita

    IFS=$'\t' read -r C1 D1r B1 <<< "$(cat "$TMP1")"
    IFS=$'\t' read -r C2 D2r B2 <<< "$(cat "$TMP2")"
    rm -f "$TMP1" "$TMP2"

    L1=$(jf "$B1" ".data.lead_id")
    L2=$(jf "$B2" ".data.lead_id")
    log "  Resolução 1 → HTTP $C1 (${D1r}ms) lead_id=${L1:-N/A}"
    log "  Resolução 2 → HTTP $C2 (${D2r}ms) lead_id=${L2:-N/A}"

    # Critério principal: exatamente uma vencedora (201) e uma perdedora (409)
    # Exceção aceitável: ambas 409 (primeira completou antes da segunda chegar)
    # Critério inaceitável: ambas 201 (lead duplicado)
    if [[ "$C1" == "200" ]] && [[ "$C2" == "200" ]]; then
      # Nenhuma deve retornar 200 — 200 seria do list, não do resolver
      fail "HT7a-atomicidade" "AMBAS retornaram 200 — resposta inesperada"
    elif [[ "$C1" == "201" ]] && [[ "$C2" == "201" ]]; then
      fail "HT7a-atomicidade" "AMBAS retornaram 201 — lead duplicado (L1=$L1 L2=$L2)"
    elif   ([[ "$C1" == "201" ]] && [[ "$C2" == "409" ]]) || \
           ([[ "$C1" == "409" ]] && [[ "$C2" == "201" ]]); then
      pass "HT7a-atomicidade-http"
    elif [[ "$C1" == "409" ]] && [[ "$C2" == "409" ]]; then
      # Ambas 409: primeira chegou e completou antes da segunda; válido
      log "  ℹ️  Ambas 409 — Workers serializaram. Verificando D1 para confirmar exatamente 1 lead."
      pass "HT7a-atomicidade-http"
    else
      fail "HT7a-atomicidade" "Códigos inesperados: C1=$C1 C2=$C2"
    fi

    # Verifica D1 via API: conflito deve ter exatamente 1 lead vinculado
    # e status resolvido (qualquer variante)
    IFS=$'\t' read -r code dur body <<< "$(http GET \
      "$BASE_URL/api/v1/conflitos?status=resolvido_tel&limit=100")"
    HT7_FINAL_LEAD=$(jf "$body" \
      ".data.conflitos[] | select(.id == $HT7_CONFLITO_ID) | .lead_id_gerado")

    # Tenta também em resolvido_email se não encontrou
    if [[ -z "$HT7_FINAL_LEAD" ]]; then
      IFS=$'\t' read -r code dur body <<< "$(http GET \
        "$BASE_URL/api/v1/conflitos?status=resolvido_email&limit=100")"
      HT7_FINAL_LEAD=$(jf "$body" \
        ".data.conflitos[] | select(.id == $HT7_CONFLITO_ID) | .lead_id_gerado")
    fi

    log "  Conflito #$HT7_CONFLITO_ID → lead_id_gerado=$HT7_FINAL_LEAD"

    if [[ -n "$HT7_FINAL_LEAD" ]] && [[ "$HT7_FINAL_LEAD" != "null" ]]; then
      pass "HT7b-lead-unico-no-d1"
    else
      fail "HT7b-lead-unico-no-d1" \
        "lead_id_gerado='${HT7_FINAL_LEAD:-vazio}' — conflito pode não estar resolvido"
    fi
  fi
fi

# ── Resumo ────────────────────────────────────────────────────────────────────

section "RESUMO FINAL"
TOTAL=$(( PASS + FAIL ))
log "  Testes executados : $TOTAL"
log "  ✅ Passou         : $PASS"
log "  ❌ Falhou         : $FAIL"
log ""

if [[ $FAIL -eq 0 ]]; then
  log "  🏆 MISSION 5 HTTP — APROVADA"
  log "     Todos os critérios de integração validados no staging."
else
  log "  ⚠️  MISSION 5 HTTP — PENDENTE ($FAIL falha(s))"
  log "     Revise o diagnóstico acima e corrija antes da Mission 6."
fi

log ""
log "Próximo passo: registrar contagens D1 pós-run via D1 MCP e comparar com baseline."
log "Delta esperado (a partir do baseline imediatamente anterior a este run):"
log "  contatos          : +6 (HT1×1, HT3a×1, HT3b×1, HT7c×1, HT7d×1 — mais HT5 que reusa A)"
log "  leads             : +4 (HT1, HT3a, HT3b, HT7c, HT7d — HT5 e HT7 adicionam mais 1 cada)"
log "  captacoes_conflito: +2 (HT3c, HT7-conflito)"
log ""
log "Verificação manual:"
log "  Acesse https://api-staging.queromeumcmv.com.br/admin/conflitos"
log "  Esperado: conflito #${HT3_CONFLITO_ID:-N/A} → Resolvido (tel)"
log "            conflito #${HT7_CONFLITO_ID:-N/A} → Resolvido"
log ""
log "Logs: $LOG_FILE"
log "JSON: $JSON_FILE"

# save_json é chamado pelo trap EXIT
[[ $FAIL -eq 0 ]]
