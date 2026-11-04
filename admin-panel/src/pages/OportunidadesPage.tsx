import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useApi } from '../hooks/useApi';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorBanner }    from '../components/ui/ErrorBanner';
import { EmptyState }     from '../components/ui/EmptyState';
import { Badge }          from '../components/ui/Badge';
import { ESTAGIOS_LABELS, ESTAGIOS_CORES, ESTAGIOS_ORDEM, PRIORIDADE_CORES, PRIORIDADE_LABELS } from '../lib/constants';
import type { Oportunidade, EstagioOportunidade } from '../types';

interface OportunidadesResponse { oportunidades: Oportunidade[] }

type ViewMode = 'kanban' | 'lista';

function fmt(v: number | null): string {
  if (!v) return '';
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

export function OportunidadesPage() {
  const [view, setView]                       = useState<ViewMode>('kanban');
  const [incluirFechadas, setIncluirFechadas] = useState(false);

  const params: Record<string, string> = { limit: '200', incluir_fechadas: incluirFechadas ? '1' : '0' };

  const { data, loading, error, refetch } = useApi<OportunidadesResponse>(
    () => api.oportunidades.list(params) as Promise<OportunidadesResponse>,
    [incluirFechadas],
  );

  const oportunidades = data?.oportunidades ?? [];

  const porEstagio: Partial<Record<EstagioOportunidade, Oportunidade[]>> = {};
  for (const o of oportunidades) {
    if (!porEstagio[o.estagio]) porEstagio[o.estagio] = [];
    porEstagio[o.estagio]!.push(o);
  }

  return (
    <div className="space-y-4">

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* View toggle */}
        <div className="flex rounded-lg overflow-hidden border border-white/10">
          {(['kanban','lista'] as ViewMode[]).map(v => (
            <button key={v} onClick={() => setView(v)}
                    className={`px-3 py-1.5 text-xs font-medium transition-all ${view === v ? 'text-[#071426]' : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/8'}`}
                    style={view === v ? { background: 'linear-gradient(135deg, #00E5FF, #0077FF)' } : {}}>
              {v === 'kanban' ? '◫ Kanban' : '≡ Lista'}
            </button>
          ))}
        </div>

        {/* Incluir fechadas */}
        <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
          <input type="checkbox" checked={incluirFechadas} onChange={e => setIncluirFechadas(e.target.checked)}
                 className="accent-cyan-400 w-3.5 h-3.5"/>
          Incluir fechadas
        </label>

        {data && (
          <span className="text-xs text-slate-400 ml-auto">
            <span className="text-slate-200 font-medium">{oportunidades.length}</span> oportunidades
          </span>
        )}
      </div>

      {loading && !data && <LoadingSpinner fullPage label="Carregando pipeline…"/>}
      {error && <ErrorBanner message={error} onRetry={refetch}/>}

      {!loading && !error && oportunidades.length === 0 && (
        <EmptyState
          title="Nenhuma oportunidade"
          description="Crie uma oportunidade a partir de um lead para começar a acompanhar."
          icon="◇"
        />
      )}

      {/* ── Kanban ── */}
      {!loading && !error && oportunidades.length > 0 && view === 'kanban' && (
        <div className="overflow-x-auto pb-4 -mx-1 px-1">
          <div className="flex gap-3 min-w-max">
            {ESTAGIOS_ORDEM.map(estagio => {
              const cards = porEstagio[estagio] ?? [];
              return (
                <div key={estagio} className="w-56 shrink-0">
                  <div className="mb-2 flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${ESTAGIOS_CORES[estagio]}`}>
                      {ESTAGIOS_LABELS[estagio]}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">{cards.length}</span>
                  </div>
                  <div className="space-y-2">
                    {cards.map(o => (
                      <Link key={o.id} to={`/oportunidades/${o.id}`}>
                        <div className="glass-card glass-card-hover p-3 cursor-pointer">
                          <p className="text-sm font-medium text-slate-100 leading-tight">
                            {o.contato_nome ?? '—'}
                          </p>
                          {o.empreendimento_nome && (
                            <p className="text-[11px] text-slate-400 mt-0.5 truncate">{o.empreendimento_nome}</p>
                          )}
                          <div className="mt-2 flex items-center justify-between gap-1">
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${PRIORIDADE_CORES[o.prioridade] ?? ''}`}>
                              {PRIORIDADE_LABELS[o.prioridade] ?? o.prioridade}
                            </span>
                            {o.valor_negocio && (
                              <span className="text-[11px] text-slate-400 font-medium">{fmt(o.valor_negocio)}</span>
                            )}
                          </div>
                          {o.responsavel_nome && (
                            <p className="text-[10px] text-slate-500 mt-1.5 truncate">
                              👤 {o.responsavel_nome}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                    {cards.length === 0 && (
                      <div className="rounded-xl border-2 border-dashed border-white/[0.06] p-4 text-center">
                        <p className="text-xs text-slate-600">Vazio</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Lista ── */}
      {!loading && !error && oportunidades.length > 0 && view === 'lista' && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Contato</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden sm:table-cell">Estágio</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">Prioridade</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">Responsável</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 hidden lg:table-cell">Valor</th>
                  <th className="px-5 py-3 w-10"/>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {oportunidades.map(o => (
                  <tr key={o.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-100 leading-tight">{o.contato_nome ?? '—'}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{o.empreendimento_nome ?? ''}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <Badge className={ESTAGIOS_CORES[o.estagio]}>{ESTAGIOS_LABELS[o.estagio]}</Badge>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <Badge className={PRIORIDADE_CORES[o.prioridade] ?? ''}>
                        {PRIORIDADE_LABELS[o.prioridade] ?? o.prioridade}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs hidden md:table-cell">
                      {o.responsavel_nome ?? '—'}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs hidden lg:table-cell">
                      {fmt(o.valor_negocio) || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link to={`/oportunidades/${o.id}`}
                            className="text-xs font-medium text-slate-500 hover:text-cyan-400 transition-colors group-hover:text-cyan-400">
                        Ver →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
