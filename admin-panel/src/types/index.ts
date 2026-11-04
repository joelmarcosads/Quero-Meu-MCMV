// ─── Respostas API ────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  idempotent?: boolean;
}

// ─── Usuário ──────────────────────────────────────────────────────────────────
export interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  perfil: 'admin' | 'corretor' | 'assistente';
  creci: string | null;
  ativo: number;
  ultimo_login_at: string | null;
  created_at: string;
}

// ─── Contato ──────────────────────────────────────────────────────────────────
export interface Contato {
  id: number;
  nome: string | null;
  telefone: string;
  email: string | null;
  cidade: string | null;
  bairro: string | null;
  uf: string | null;
  profissao: string | null;
  renda_faixa: string | null;
  total_oportunidades?: number;
  created_at: string;
}

// ─── Lead ─────────────────────────────────────────────────────────────────────
export interface Lead {
  id: number;
  origem: string;
  canal: string | null;
  created_at: string;
  telefone: string;
  contato_nome: string | null;
  empreendimento_nome: string | null;
}

// ─── Oportunidade ─────────────────────────────────────────────────────────────
export type EstagioOportunidade =
  | 'novo_lead'
  | 'em_contato'
  | 'visita_solicitada'
  | 'visita_agendada'
  | 'visita_realizada'
  | 'proposta_enviada'
  | 'documentacao'
  | 'fechado_ganho'
  | 'fechado_perdido';

export interface Oportunidade {
  id: number;
  estagio: EstagioOportunidade;
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  valor_negocio: number | null;
  data_previsao: string | null;
  observacoes: string | null;
  motivo_perda: string | null;
  created_at: string;
  updated_at: string;
  fechada_at: string | null;
  contato_id: number;
  lead_id: number | null;
  empreendimento_id: number | null;
  contato_nome: string | null;
  contato_telefone: string | null;
  empreendimento_nome: string | null;
  responsavel_id: number | null;
  responsavel_nome: string | null;
}

// ─── Interação ────────────────────────────────────────────────────────────────
export type TipoInteracao = 'ligacao' | 'whatsapp' | 'email' | 'visita' | 'anotacao' | 'sistema';
export type DirecaoInteracao = 'entrada' | 'saida' | 'interno';

export interface Interacao {
  id: number;
  tipo: TipoInteracao;
  direcao: DirecaoInteracao;
  conteudo: string;
  duracao_seg: number | null;
  created_at: string;
  contato_id: number;
  oportunidade_id: number | null;
  usuario_nome: string | null;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export interface DashboardStats {
  leads: { total: number; hoje: number };
  contatos: { total: number };
  oportunidades: {
    abertas: number;
    fechadas_30d: { ganhas: number; perdidas: number };
  };
  oportunidades_ganhas_total: number;
  leads_por_origem_30d: Array<{ origem: string; total: number }>;
  pipeline: Array<{ estagio: EstagioOportunidade; total: number }>;
}

export interface DashboardAnalytics {
  period: number;
  leads_evolution: Array<{ dia: string; total: number }>;
}

// ─── Paginação ────────────────────────────────────────────────────────────────
export interface PaginaMeta {
  limit: number;
  offset: number;
  count: number;
}
