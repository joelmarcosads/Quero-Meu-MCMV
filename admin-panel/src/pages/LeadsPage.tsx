import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useApi } from '../hooks/useApi';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorBanner }    from '../components/ui/ErrorBanner';
import { EmptyState }     from '../components/ui/EmptyState';
import { SearchInput }    from '../components/ui/SearchInput';
import { Pagination }     from '../components/ui/Pagination';
import type { Lead, PaginaMeta } from '../types';

interface LeadsResponse { leads: Lead[]; meta: PaginaMeta }

function OrigemBadge({ origem }: { origem: string }) {
  const style: Record<string, string> = {
    whatsapp:   'bg-green-500/15 text-green-300 border-green-500/20',
    facebook:   'bg-blue-500/15  text-blue-300  border-blue-500/20',
    instagram:  'bg-pink-500/15  text-pink-300  border-pink-500/20',
    'zap imóveis': 'bg-orange-500/15 text-orange-300 border-orange-500/20',
    olx:        'bg-yellow-500/15 text-yellow-300 border-yellow-500/20',
    site:       'bg-cyan-500/15  text-cyan-300  border-cyan-500/20',
  };
  const cls = style[origem.toLowerCase()] ?? 'bg-white/8 text-slate-300 border-white/10';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${cls}`}>
      {origem}
    </span>
  );
}

const LIMIT = 50;

export function LeadsPage() {
  const [q, setQ]           = useState('');
  const [page, setPage]     = useState(1);
  const offset              = (page - 1) * LIMIT;

  const params: Record<string, string> = { limit: String(LIMIT), offset: String(offset) };
  if (q) params['q'] = q;

  const { data, loading, error, refetch } = useApi<LeadsResponse>(
    () => api.leads.list(params) as Promise<LeadsResponse>,
    [q, page],
  );

  const handleSearch = (value: string) => { setQ(value); setPage(1); };
  const totalPages   = Math.ceil((data?.meta.count ?? 0) / LIMIT);

  return (
    <div className="space-y-4">

      {/* Header bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <SearchInput value={q} onChange={handleSearch} placeholder="Buscar por nome ou telefone…" className="max-w-xs w-full"/>
        {data && (
          <p className="text-xs text-slate-400">
            <span className="text-slate-200 font-medium">{data.meta.count}</span> leads
          </p>
        )}
      </div>

      {/* Table card */}
      <div className="glass-card overflow-hidden">
        {loading && !data && <LoadingSpinner fullPage label="Carregando leads…"/>}
        {error    && <div className="p-5"><ErrorBanner message={error} onRetry={refetch}/></div>}

        {!loading && !error && data && (
          data.leads.length === 0 ? (
            <EmptyState
              title="Nenhum lead encontrado"
              description="Ajuste os filtros ou aguarde novos leads chegarem do portal."
              icon="⬡"
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Contato</th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden sm:table-cell">Empreendimento</th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">Origem</th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden lg:table-cell">Data</th>
                      <th className="px-5 py-3 w-10"/>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {data.leads.map(lead => (
                      <tr key={lead.id} className="hover:bg-white/[0.03] transition-colors group">
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-slate-100 leading-tight">{lead.contato_nome ?? '—'}</p>
                          <p className="text-slate-500 text-xs mt-0.5">{lead.telefone}</p>
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 hidden sm:table-cell text-xs">
                          {lead.empreendimento_nome ?? <span className="text-slate-600">—</span>}
                        </td>
                        <td className="px-5 py-3.5 hidden md:table-cell">
                          <OrigemBadge origem={lead.origem}/>
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 text-xs hidden lg:table-cell">
                          {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Link to={`/leads/${lead.id}`}
                                className="text-xs font-medium text-slate-500 hover:text-cyan-400 transition-colors group-hover:text-cyan-400">
                            Ver →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-white/[0.06]">
                <Pagination page={page} totalPages={totalPages} onPage={p => { setPage(p); window.scrollTo(0,0); }}/>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}
