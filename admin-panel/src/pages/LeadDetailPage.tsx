import type { ReactNode } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useApi } from '../hooks/useApi';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorBanner }    from '../components/ui/ErrorBanner';
import { Badge }          from '../components/ui/Badge';
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
  const { id }   = useParams<{ id: string }>();
  const numId    = Number(id);

  const { data: lead, loading, error, refetch } = useApi<LeadDetalhe>(
    () => api.leads.get(numId) as Promise<LeadDetalhe>,
    [numId],
  );

  if (loading) return <LoadingSpinner fullPage label="Carregando lead…"/>;
  if (error)   return <div className="p-5"><ErrorBanner message={error} onRetry={refetch}/></div>;
  if (!lead)   return null;

  const utms = [
    lead.utm_source   && `source: ${lead.utm_source}`,
    lead.utm_medium   && `medium: ${lead.utm_medium}`,
    lead.utm_campaign && `campaign: ${lead.utm_campaign}`,
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-5 max-w-3xl">

      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 flex items-center gap-1.5">
        <Link to="/leads" className="hover:text-cyan-400 transition-colors">Leads</Link>
        <span>/</span>
        <span className="text-slate-300 font-medium">Lead #{lead.id}</span>
      </nav>

      {/* Header */}
      <div className="glass-card p-5 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-white leading-tight">
            {lead.contato_nome ?? 'Sem nome'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">{lead.telefone}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium capitalize bg-cyan-500/15 text-cyan-300 border border-cyan-500/20">
            {lead.origem}
          </span>
          {lead.canal && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-white/8 text-slate-300 border border-white/10">
              {lead.canal}
            </span>
          )}
        </div>
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="glass-card p-5 space-y-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Informações do Lead</h2>
          <dl className="space-y-3">
            <Row label="Contato">
              <Link to={`/contatos/${lead.contato_id}`}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium text-sm">
                #{lead.contato_id} — ver contato →
              </Link>
            </Row>
            <Row label="Empreendimento">{lead.empreendimento_nome ?? <Dash/>}</Row>
            <Row label="Origem">{lead.origem}</Row>
            <Row label="Canal">{lead.canal ?? <Dash/>}</Row>
            <Row label="Data">
              {new Date(lead.created_at).toLocaleString('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </Row>
          </dl>
        </div>

        {utms.length > 0 && (
          <div className="glass-card p-5 space-y-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Rastreamento UTM</h2>
            <ul className="space-y-2">
              {utms.map(u => (
                <li key={u} className="flex gap-2 items-start">
                  <span className="text-cyan-500/50 mt-0.5">•</span>
                  <code className="text-xs font-mono px-2 py-1 rounded text-slate-300"
                        style={{ background: 'rgba(0,229,255,0.07)', border: '1px solid rgba(0,229,255,0.12)' }}>
                    {u}
                  </code>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Mensagem */}
      {lead.mensagem && (
        <div className="glass-card p-5 space-y-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Mensagem do Lead</h2>
          <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed rounded-xl p-4"
             style={{ background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {lead.mensagem}
          </p>
        </div>
      )}

      {/* Oportunidades */}
      <div className="glass-card p-5 space-y-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Oportunidades Vinculadas</h2>

        {!lead.oportunidades || lead.oportunidades.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhuma oportunidade gerada deste lead.</p>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {lead.oportunidades.map(op => (
              <div key={op.id} className="flex items-center justify-between gap-3 py-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={ESTAGIOS_CORES[op.estagio]}>{ESTAGIOS_LABELS[op.estagio]}</Badge>
                  <Badge className={PRIORIDADE_CORES[op.prioridade]}>{PRIORIDADE_LABELS[op.prioridade]}</Badge>
                  {op.valor_negocio && (
                    <span className="text-sm text-slate-300 font-medium">
                      {op.valor_negocio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  )}
                </div>
                <Link to={`/oportunidades/${op.id}`}
                      className="text-xs font-medium text-slate-500 hover:text-cyan-400 transition-colors shrink-0">
                  Ver →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex">
        <Link to="/leads" className="text-xs text-slate-500 hover:text-cyan-400 transition-colors">
          ← Voltar para Leads
        </Link>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex gap-3 text-sm">
      <dt className="text-slate-500 w-32 shrink-0 leading-relaxed">{label}</dt>
      <dd className="text-slate-200 leading-relaxed">{children}</dd>
    </div>
  );
}

function Dash() {
  return <span className="text-slate-600">—</span>;
}
