import type { EstagioOportunidade } from '../types';

export const ESTAGIOS_LABELS: Record<EstagioOportunidade, string> = {
  novo_lead:        'Novo Lead',
  em_contato:       'Em Contato',
  visita_solicitada:'Visita Solicitada',
  visita_agendada:  'Visita Agendada',
  visita_realizada: 'Visita Realizada',
  proposta_enviada: 'Proposta Enviada',
  documentacao:     'Documentação',
  fechado_ganho:    'Fechado ✓',
  fechado_perdido:  'Fechado ✗',
};

export const ESTAGIOS_CORES: Record<EstagioOportunidade, string> = {
  novo_lead:        'bg-blue-500/15 text-blue-300 border border-blue-500/20',
  em_contato:       'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20',
  visita_solicitada:'bg-yellow-500/15 text-yellow-300 border border-yellow-500/20',
  visita_agendada:  'bg-orange-500/15 text-orange-300 border border-orange-500/20',
  visita_realizada: 'bg-purple-500/15 text-purple-300 border border-purple-500/20',
  proposta_enviada: 'bg-pink-500/15 text-pink-300 border border-pink-500/20',
  documentacao:     'bg-teal-500/15 text-teal-300 border border-teal-500/20',
  fechado_ganho:    'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20',
  fechado_perdido:  'bg-red-500/15 text-red-300 border border-red-500/20',
};

export const ESTAGIOS_ORDEM: EstagioOportunidade[] = [
  'novo_lead',
  'em_contato',
  'visita_solicitada',
  'visita_agendada',
  'visita_realizada',
  'proposta_enviada',
  'documentacao',
  'fechado_ganho',
  'fechado_perdido',
];

export const PRIORIDADE_LABELS: Record<string, string> = {
  baixa:   'Baixa',
  media:   'Média',
  alta:    'Alta',
  urgente: 'Urgente',
};

export const PRIORIDADE_CORES: Record<string, string> = {
  baixa:   'bg-slate-500/15 text-slate-300 border border-slate-500/20',
  media:   'bg-blue-500/15 text-blue-300 border border-blue-500/20',
  alta:    'bg-orange-500/15 text-orange-300 border border-orange-500/20',
  urgente: 'bg-red-500/15 text-red-300 border border-red-500/20',
};

export const TIPO_INTERACAO_LABELS: Record<string, string> = {
  ligacao:  '📞 Ligação',
  whatsapp: '💬 WhatsApp',
  email:    '✉️ E-mail',
  visita:   '🏠 Visita',
  anotacao: '📝 Anotação',
  sistema:  '⚙️ Sistema',
};
