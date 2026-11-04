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
  novo_lead:        'bg-blue-100 text-blue-800',
  em_contato:       'bg-indigo-100 text-indigo-800',
  visita_solicitada:'bg-yellow-100 text-yellow-800',
  visita_agendada:  'bg-orange-100 text-orange-800',
  visita_realizada: 'bg-purple-100 text-purple-800',
  proposta_enviada: 'bg-pink-100 text-pink-800',
  documentacao:     'bg-teal-100 text-teal-800',
  fechado_ganho:    'bg-green-100 text-green-800',
  fechado_perdido:  'bg-red-100 text-red-800',
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
  baixa:   'bg-gray-100 text-gray-700',
  media:   'bg-blue-100 text-blue-700',
  alta:    'bg-orange-100 text-orange-700',
  urgente: 'bg-red-100 text-red-700',
};

export const TIPO_INTERACAO_LABELS: Record<string, string> = {
  ligacao:  '📞 Ligação',
  whatsapp: '💬 WhatsApp',
  email:    '✉️ E-mail',
  visita:   '🏠 Visita',
  anotacao: '📝 Anotação',
  sistema:  '⚙️ Sistema',
};
