import type { ReactNode } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useApi } from '../hooks/useApi';
import {
  Card, LoadingSpinner, ErrorBanner, Badge,
} from '../components/ui';
import type { Lead, Oportunidade } from '../types';
import { ESTAGIOS_LABELS, ESTAGIOS_CORES, PRIORIDADE_LABELS, PRIORIDADE_CORES } from '../lib/constants';

interface LeadDetalhe extends Lead {
  contato_id: number;
  empreendimento_id: number | null;
  tipologia_id: number | null;
  canal: string | null;
  mensagem?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  oportunidades?: Oportunidade[];
}

export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const numId = Number(id);

  const { data: lead, loading, error, refetch } = useApi<LeadDetalhe>(
    () => api.leads.get(numId) as Promise<LeadDetalhe>,
    [numId],
  );

  if (loading) return <LoadingSpinner />;
  if (error)   return <ErrorBanner message={error} onRetry={refetch} />;
  if (!lead)   return null;

  const utms = [
    lead.utm_source && `source: ${lead.utm_source}`,
    lead.utm_medium && `medium: ${lead.utm_medium}`,
    lead.utm_campaign && `campaign: ${lead.utm_campaign}`,
  ].filter(Boolean);

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500">
        <Link to="/leads" className="hover:text-[#1e3a5f]">Leads</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Lead #{lead.id}</span>
      </nav>

      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-[#1e3a5f]">
            {lead.contato_nome ?? 'Sem nome'}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{lead.telefone}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="default" className="capitalize">{lead.origem}</Badge>
          {lead.canal && <Badge variant="default">{lead.canal}</Badge>}
        </div>
      </div>

      {/* Dados principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Informações do Lead
          </h2>
          <dl className="space-y-3 text-sm">
            <Row label="Contato ID">
              <Link to={`/contatos/${lead.contato_id}`} className="text-[#1e3a5f] hover:underline font-medium">
                #{lead.contato_id} — ver contato →
              </Link>
            </Row>
            <Row label="Empreendimento">
              {lead.empreendimento_nome ?? <span className="text-gray-400">—</span>}
            </Row>
            <Row label="Origem">{lead.origem}</Row>
            <Row label="Canal">{lead.canal ?? <span className="text-gray-400">—</span>}</Row>
            <Row label="Data">
              {new Date(lead.created_at).toLocaleString('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </Row>
          </dl>
        </Card>

        {/* UTMs / Tracking */}
        {utms.length > 0 && (
          <Card className="p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Rastreamento UTM
            </h2>
            <ul className="space-y-2 text-sm text-gray-600">
              {utms.map(u => (
                <li key={u} className="flex gap-2">
                  <span className="text-gray-400">•</span>
                  <span className="font-mono text-xs bg-gray-50 px-2 py-1 rounded">{u}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {/* Mensagem */}
      {lead.mensagem && (
        <Card className="p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Mensagem do Lead
          </h2>
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 rounded-lg p-4">
            {lead.mensagem}
          </p>
        </Card>
      )}

      {/* Oportunidades associadas */}
      <Card className="p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Oportunidades Vinculadas
        </h2>

        {!lead.oportunidades || lead.oportunidades.length === 0 ? (
          <p className="text-sm text-gray-400">Nenhuma oportunidade gerada deste lead.</p>
        ) : (
          <div className="space-y-3">
            {lead.oportunidades.map(op => (
              <div
                key={op.id}
                className="flex items-center justify-between gap-3 py-3 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className={ESTAGIOS_CORES[op.estagio]}>
                    {ESTAGIOS_LABELS[op.estagio]}
                  </Badge>
                  <Badge className={PRIORIDADE_CORES[op.prioridade]}>
                    {PRIORIDADE_LABELS[op.prioridade]}
                  </Badge>
                  {op.valor_negocio && (
                    <span className="text-sm text-gray-600 font-medium">
                      {op.valor_negocio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  )}
                </div>
                <Link
                  to={`/oportunidades/${op.id}`}
                  className="text-xs font-medium text-[#1e3a5f] hover:underline shrink-0"
                >
                  Ver →
                </Link>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Ação */}
      <div className="flex justify-end">
        <Link to="/leads" className="text-sm text-gray-500 hover:text-[#1e3a5f]">
          ← Voltar para Leads
        </Link>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex gap-2">
      <dt className="text-gray-500 w-32 shrink-0">{label}</dt>
      <dd className="text-gray-800">{children}</dd>
    </div>
  );
}
