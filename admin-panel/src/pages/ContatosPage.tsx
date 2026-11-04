import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useApi } from '../hooks/useApi';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorBanner }    from '../components/ui/ErrorBanner';
import { EmptyState }     from '../components/ui/EmptyState';
import { SearchInput }    from '../components/ui/SearchInput';
import { Pagination }     from '../components/ui/Pagination';
import type { Contato, PaginaMeta } from '../types';

interface ContatosResponse { contatos: Contato[]; meta: PaginaMeta }

function Avatar({ nome }: { nome: string | null }) {
  const letter = nome?.[0]?.toUpperCase() ?? '?';
  return (
    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
         style={{ background: 'linear-gradient(135deg, #00E5FF, #0077FF)' }}>
      {letter}
    </div>
  );
}

const LIMIT = 50;

export function ContatosPage() {
  const [q, setQ]       = useState('');
  const [page, setPage] = useState(1);
  const offset          = (page - 1) * LIMIT;

  const params: Record<string, string> = { limit: String(LIMIT), offset: String(offset) };
  if (q) params['q'] = q;

  const { data, loading, error, refetch } = useApi<ContatosResponse>(
    () => api.contatos.list(params) as Promise<ContatosResponse>,
    [q, page],
  );

  const handleSearch = (value: string) => { setQ(value); setPage(1); };
  const totalPages   = Math.ceil((data?.meta.count ?? 0) / LIMIT);

  return (
    <div className="space-y-4">

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <SearchInput value={q} onChange={handleSearch} placeholder="Buscar por nome, telefone ou e-mail…" className="max-w-xs w-full"/>
        {data && (
          <p className="text-xs text-slate-400">
            <span className="text-slate-200 font-medium">{data.meta.count}</span> contatos
          </p>
        )}
      </div>

      <div className="glass-card overflow-hidden">
        {loading && !data && <LoadingSpinner fullPage label="Carregando contatos…"/>}
        {error    && <div className="p-5"><ErrorBanner message={error} onRetry={refetch}/></div>}

        {!loading && !error && data && (
          data.contatos.length === 0 ? (
            <EmptyState
              title="Nenhum contato encontrado"
              description="Contatos são criados automaticamente a partir dos leads recebidos."
              icon="◎"
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Nome</th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden sm:table-cell">Localização</th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">Oport.</th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden lg:table-cell">Desde</th>
                      <th className="px-5 py-3 w-10"/>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {data.contatos.map(c => (
                      <tr key={c.id} className="hover:bg-white/[0.03] transition-colors group">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <Avatar nome={c.nome}/>
                            <div>
                              <p className="font-medium text-slate-100 leading-tight">{c.nome ?? '—'}</p>
                              <p className="text-slate-500 text-xs mt-0.5">{c.telefone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 text-xs hidden sm:table-cell">
                          {[c.bairro, c.cidade, c.uf].filter(Boolean).join(', ') || <span className="text-slate-600">—</span>}
                        </td>
                        <td className="px-5 py-3.5 hidden md:table-cell">
                          {(c.total_oportunidades ?? 0) > 0
                            ? <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/20">{c.total_oportunidades}</span>
                            : <span className="text-slate-600 text-xs">—</span>
                          }
                        </td>
                        <td className="px-5 py-3.5 text-slate-500 text-xs hidden lg:table-cell">
                          {new Date(c.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Link to={`/contatos/${c.id}`}
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
