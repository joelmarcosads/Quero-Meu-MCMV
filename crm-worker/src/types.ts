// ─── Bindings do Worker ───────────────────────────────────────────────────────
export interface Env {
  DB: D1Database;
  JWKS_CACHE: KVNamespace;
  ENVIRONMENT: string;
  CF_ACCESS_TEAM_DOMAIN: string;
  CF_ACCESS_AUD: string;
  // Static Assets binding para o Admin Panel SPA (opcional: pode não existir em dev)
  ASSETS?: { fetch(request: Request): Promise<Response> };
  // ─── Secrets Meta Lead Ads (configurados via `wrangler secret put`) ────────
  // Nunca definidos como vars — apenas como secrets criptografados no Cloudflare
  META_VERIFY_TOKEN: string;      // Token de verificação do webhook (compartilhado com Meta)
  META_APP_SECRET: string;        // App Secret do Meta App (valida X-Hub-Signature-256)
  META_PAGE_ACCESS_TOKEN: string; // Page Access Token para buscar dados via Graph API
}

// ─── Usuário autenticado (extraído do JWT) ────────────────────────────────────
export interface AuthenticatedUser {
  id: number;
  cf_access_id: string;
  nome: string;
  perfil: 'admin' | 'corretor' | 'assistente';
  email: string;
}

// ─── Contexto enriquecido da requisição ───────────────────────────────────────
export interface RequestContext {
  request: Request;
  env: Env;
  user: AuthenticatedUser;
  requestId: string;
}

// ─── Respostas padronizadas ───────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  idempotent?: boolean;
}

// ─── Modelos de domínio ───────────────────────────────────────────────────────
export interface Empreendimento {
  id: number;
  slug: string;
  nome: string;
  construtora: string | null;
  status: string;
  faixa_mcmv: number | null;      // 1, 2 ou 3
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string;
  uf: string;
  cep: string | null;
  area_privativa_min: number | null;
  area_privativa_max: number | null;
  valor_min: number | null;
  valor_max: number | null;
  descricao: string | null;
  ativo: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Tipologia {
  id: number;
  empreendimento_id: number;
  nome: string;
  quartos: number | null;
  suites: number;
  banheiros: number | null;
  vagas: number;
  area_m2: number | null;         // campo correto no schema D1
  valor_base: number | null;
  situacao_comercial: string;
  created_at: string;
}

export interface Contato {
  id: number;
  telefone: string;
  nome: string | null;
  email: string | null;
  created_at: string;
  deleted_at: string | null;
  anonimizado_at: string | null;
}

export interface Lead {
  id: number;
  contato_id: number;
  empreendimento_id: number | null;
  tipologia_id: number | null;
  // responsavel_id e status NÃO existem na tabela leads do D1
  // RBAC de corretor é feito via oportunidades.responsavel_id
  origem: string;
  canal: string | null;
  idempotency_key: string | null;
  meta_fbc: string | null;
  meta_fbp: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

// ─── Payloads de entrada ──────────────────────────────────────────────────────
export interface CreateLeadPayload {
  nome?: string;
  telefone: string;
  email?: string;
  empreendimento_id?: number;
  tipologia_id?: number;
  origem: string;
  canal?: string;
  idempotency_key?: string;
  meta_fbc?: string;
  meta_fbp?: string;
  mensagem?: string;
  // UTMs e tracking
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
}

// ─── Payload público (portal Quero Meu MCMV → CRM) ──────────────────────────
// Enviado pelo LeadForm.jsx via fetch sem CF Access JWT.
// Campos MCMV extras (quartos, faixa, renda…) são armazenados em dados_extras_json.
export interface PublicLeadPayload {
  // Idempotência — external_id gerado pelo browser (UUID)
  external_id: string;
  // Contato
  nome?: string;
  whatsapp: string;              // DDD + número, formatado ou raw
  email?: string;
  cidade?: string;
  // Empreendimento (opcional — slug da página que originou o lead)
  empreendimento_slug?: string;
  // UTMs / tracking
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  meta_fbc?: string;
  meta_fbp?: string;
  // Anti-spam: honeypot — deve ser string vazia
  website?: string;
  // Consentimento LGPD
  consentimento_lgpd: boolean;
  // Campos MCMV extras (armazenados em dados_extras_json)
  dados_extras?: {
    quartos?: string;
    faixa?: string;
    renda?: string;
    regime_trabalho?: string;
    pagamento?: string;
    primeira_compra?: string;
    prazo?: string;
    pagina?: string;
    referrer?: string;
  };
}

export interface CreateEmpreendimentoPayload {
  slug?: string;                  // gerado automaticamente se ausente
  nome: string;
  construtora?: string;
  cidade: string;
  uf: string;
  bairro?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  cep?: string;
  faixa_mcmv?: number;            // 1, 2 ou 3 (INTEGER)
  status?: string;
  descricao?: string;
  area_privativa_min?: number;
  area_privativa_max?: number;
  valor_min?: number;
  valor_max?: number;
}
