// ─── Bindings do Worker ───────────────────────────────────────────────────────
export interface Env {
  DB: D1Database;
  JWKS_CACHE: KVNamespace;
  ENVIRONMENT: string;
  CF_ACCESS_TEAM_DOMAIN: string;
  CF_ACCESS_AUD: string;
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
  nome: string;
  cidade: string;
  uf: string;
  bairro: string | null;
  endereco_completo: string | null;
  faixa_programa: string;
  status: string;
  descricao_curta: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Tipologia {
  id: number;
  empreendimento_id: number;
  nome: string;
  quartos: number;
  suites: number | null;
  banheiros: number;
  vagas: number;
  area_privativa_m2: number | null;
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
  responsavel_id: number | null;
  origem: string;
  canal: string | null;
  status: string;
  idempotency_key: string | null;
  meta_fbc: string | null;
  meta_fbp: string | null;
  created_at: string;
  updated_at: string;
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
}

export interface CreateEmpreendimentoPayload {
  nome: string;
  cidade: string;
  uf: string;
  bairro?: string;
  endereco_completo?: string;
  faixa_programa: string;
  status?: string;
  descricao_curta?: string;
}
