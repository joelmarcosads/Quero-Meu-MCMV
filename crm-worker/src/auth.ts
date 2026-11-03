/**
 * auth.ts — Validação criptográfica real de JWT RS256 (Cloudflare Access)
 *
 * Fluxo:
 * 1. Extrair header `Cf-Access-Jwt-Assertion` (injetado pelo CF Access)
 * 2. Decodificar header JWT → obter `kid`
 * 3. Buscar JWKS do endpoint CF Access (com cache KV TTL 3600s)
 * 4. Verificar: assinatura RS256, issuer, audience, expiração
 * 5. Extrair `sub` claim → buscar usuário no D1
 *
 * ⚠️  X-Test-Cf-Sub é REMOVIDO — não existe nesta implementação.
 */

import type { Env, AuthenticatedUser } from './types';

// ─── Tipos JWKS ───────────────────────────────────────────────────────────────
interface JwkKey {
  kty: string;
  kid: string;
  use?: string;
  alg?: string;
  n: string;  // modulus (base64url)
  e: string;  // exponent (base64url)
}

interface JwksResponse {
  keys: JwkKey[];
}

interface JwtHeader {
  alg: string;
  kid: string;
  typ?: string;
}

interface JwtPayload {
  sub: string;       // cf_access_id do usuário
  iss: string;       // https://<team>.cloudflareaccess.com
  aud: string[];     // audience do aplicativo
  exp: number;       // unix timestamp
  iat: number;
  jti?: string;      // JWT ID (para revogação de sessão)
  email?: string;
}

// ─── Helpers base64url ────────────────────────────────────────────────────────
function base64urlDecode(str: string): Uint8Array {
  // Converte base64url → base64 padrão
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function decodeJwtPart<T>(part: string): T {
  const decoded = new TextDecoder().decode(base64urlDecode(part));
  return JSON.parse(decoded) as T;
}

// ─── Cache JWKS no KV ─────────────────────────────────────────────────────────
const JWKS_CACHE_KEY = 'cf_access_jwks';
const JWKS_CACHE_TTL = 3600; // 1 hora

async function fetchJwks(env: Env): Promise<JwksResponse> {
  // 1. Tentar cache KV
  const cached = await env.JWKS_CACHE.get(JWKS_CACHE_KEY);
  if (cached) {
    return JSON.parse(cached) as JwksResponse;
  }

  // 2. Buscar do endpoint CF Access
  const jwksUrl = `https://${env.CF_ACCESS_TEAM_DOMAIN}/cdn-cgi/access/certs`;
  const response = await fetch(jwksUrl, {
    headers: { 'Accept': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`JWKS fetch falhou: ${response.status} ${response.statusText}`);
  }

  const jwks = await response.json() as JwksResponse;

  // 3. Salvar no KV com TTL
  await env.JWKS_CACHE.put(JWKS_CACHE_KEY, JSON.stringify(jwks), {
    expirationTtl: JWKS_CACHE_TTL,
  });

  return jwks;
}

// ─── Importar chave pública RSA para WebCrypto ────────────────────────────────
async function importRsaPublicKey(jwk: JwkKey): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'jwk',
    {
      kty: jwk.kty,
      n: jwk.n,
      e: jwk.e,
      alg: 'RS256',
      use: 'sig',
    },
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );
}

// ─── Verificação completa do JWT ──────────────────────────────────────────────
async function verifyJwt(token: string, env: Env): Promise<JwtPayload> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('JWT malformado: esperados 3 partes');
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  // Decodificar header e payload
  const header = decodeJwtPart<JwtHeader>(headerB64);
  const payload = decodeJwtPart<JwtPayload>(payloadB64);

  // Verificar algoritmo
  if (header.alg !== 'RS256') {
    throw new Error(`Algoritmo JWT inválido: ${header.alg} (esperado RS256)`);
  }

  // Verificar expiração
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) {
    throw new Error(`JWT expirado em ${new Date(payload.exp * 1000).toISOString()}`);
  }

  // Verificar issuer
  const expectedIssuer = `https://${env.CF_ACCESS_TEAM_DOMAIN}`;
  if (payload.iss !== expectedIssuer) {
    throw new Error(`JWT issuer inválido: ${payload.iss}`);
  }

  // Verificar audience
  const expectedAud = env.CF_ACCESS_AUD;
  if (!payload.aud.includes(expectedAud)) {
    throw new Error(`JWT audience inválido: ${payload.aud.join(',')}`);
  }

  // Buscar JWKS e encontrar chave pelo kid
  const jwks = await fetchJwks(env);
  const jwk = jwks.keys.find(k => k.kid === header.kid);
  if (!jwk) {
    throw new Error(`Chave JWK não encontrada para kid=${header.kid}`);
  }

  // Importar chave e verificar assinatura
  const publicKey = await importRsaPublicKey(jwk);
  const signingInput = `${headerB64}.${payloadB64}`;
  const signature = base64urlDecode(signatureB64);

  const isValid = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    publicKey,
    signature,
    new TextEncoder().encode(signingInput),
  );

  if (!isValid) {
    throw new Error('Assinatura JWT inválida');
  }

  return payload;
}

// ─── Middleware de autenticação principal ─────────────────────────────────────
export async function authenticate(
  request: Request,
  env: Env,
): Promise<AuthenticatedUser> {
  // Extrair JWT do header injetado pelo CF Access
  const jwt = request.headers.get('Cf-Access-Jwt-Assertion');

  if (!jwt) {
    throw new AuthError('Token de autenticação ausente (Cf-Access-Jwt-Assertion)', 401);
  }

  let payload: JwtPayload;
  try {
    payload = await verifyJwt(jwt, env);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro desconhecido';
    throw new AuthError(`JWT inválido: ${msg}`, 401);
  }

  // Buscar usuário no D1 pelo cf_access_id (= sub do JWT)
  const result = await env.DB.prepare(
    `SELECT id, cf_access_id, nome, perfil, email
     FROM usuarios
     WHERE cf_access_id = ? AND deleted_at IS NULL
     LIMIT 1`,
  ).bind(payload.sub).first<AuthenticatedUser>();

  if (!result) {
    throw new AuthError(`Usuário não encontrado para cf_access_id=${payload.sub}`, 401);
  }

  return result;
}

// ─── Erro de autenticação/autorização ────────────────────────────────────────
export class AuthError extends Error {
  constructor(
    message: string,
    public readonly statusCode: 401 | 403 = 401,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// ─── Verificação de perfil/ownership ─────────────────────────────────────────
export function requirePerfil(
  user: AuthenticatedUser,
  perfis: Array<'admin' | 'corretor' | 'assistente'>,
): void {
  if (!perfis.includes(user.perfil)) {
    throw new AuthError(
      `Perfil '${user.perfil}' não tem permissão para esta ação (requer: ${perfis.join(' ou ')})`,
      403,
    );
  }
}

export function requireOwnershipOrAdmin(
  user: AuthenticatedUser,
  responsavelId: number | null,
): void {
  if (user.perfil === 'admin') return;
  if (responsavelId === null || responsavelId !== user.id) {
    throw new AuthError(
      'Acesso negado: você não é responsável por este registro',
      403,
    );
  }
}
