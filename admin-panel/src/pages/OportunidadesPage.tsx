import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useApi } from '../hooks/useApi';
import { Card, LoadingSpinner, ErrorBanner, EmptyState, Badge } from '../components/ui';
import { ESTAGIOS_LABELS, ESTAGIOS_CORES, ESTAGIOS_ORDEM, PRIORIDADE_CORES, PRIORIDADE_LABELS } from '../lib/constants';
import type { Oportunidade, EstagioOportunidade } from '../types';

interface OportunidadesResponse { oportunidades: Oportunidade[] }

type ViewMode = 'kanban' | 'lista';

export function OportunidadesPage() {
  const [view, setView] = useState<ViewMode>('kanban');
  const [incluirFechadas, setIncluirFechadas] = useState(false);

  const params: Record<string, string> = {
    limit: '200',
    incluir_fechadas: incluirFechadas ? '1' : '0',
  };

  const { data, loading, error, refetch } = useApi<OportunidadesResponse>(
    () => api.oportunidades.list(params) as Promise<OportunidadesResponse>,
    [incluirFechadas],
  );

  const oportunidades = data?.oportunidades ?? [];

  // Agrupar por estágio para kanban
  const porEstagio: Partial<Record<EstagioOportunidade, Oportunidade[]>> = {};
  for (const o of oportunidades) {
    if (!porEstagio[o.estagio]) porEstagio[o.estagio] = [];
    porEstagio[o.estagio]!.push(o);
  }

  return (
    <div className="space-y-4">
      {/* Controles */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setView('kanban')}
            className={`px-3 py-1.5 text-sm transition-colors ${view === 'kanban' ? 'bg-[#1e3a5f] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            🏗️ Kanban
          </button>
          <button
            onClick={() => setView('lista')}
            className={`px-3 py-1.5 text-sm transition-colors ${view === 'lista' ? 'bg-[#1e3a5f] text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            📋 Lista
          </button>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={incluirFechadas}
            onChange={e => setIncluirFechadas(e.target.checked)}
            className="rounded"
          />
          Incluir fechadas
        </label>

        {data && (
          <span className="text-sm text-gray-400 ml-auto">{oportunidades.length} oportunidades</span>
        )}
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {!loading && !error && oportunidades.length === 0 && (
        <EmptyState
          title="Nenhuma oportunidade"
          description="Crie uma oportunidade a partir de um lead para começar a acompanhar."
          icon="🏗️"
        />
      )}

      {/* Kanban */}
      {!loading && !error && oportunidades.length > 0 && view === 'kanban' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-3 min-w-max">
            {ESTAGIOS_ORDEM.map(estagio => {
              const cards = porEstagio[estagio] ?? [];
              return (
                <div key={estagio} className="w-56 shrink-0">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge
                      label={ESTAGIOS_LABELS[estagio]}
                      className={ESTAGIOS_CORES[estagio]}
                    />
                    <span className="text-xs text-gray-400">{cards.length}</span>
                  </div>
                  <div className="space-y-2">
                    {cards.map(o => (
                      <Link key={o.id} to={`/oportunidades/${o.id}`}>
                        <Card className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                          <p className="text-sm font-medium text-gray-800 leading-tight">
                            {o.contato_nome ?? '—'}
                          </p>
                          {o.empreendimento_nome && (
                            <p className="text-xs text-gray-400 mt-0.5 truncate">{o.empreendimento_nome}</p>
                          )}
                          <div className="mt-2 flex items-center justify-between">
                            <Badge
                              label={PRIORIDADE_LABELS[o.prioridade] ?? o.prioridade}
                              className={PRIORIDADE_CORES[o.prioridade] ?? ''}
                            />
                            {o.valor_negocio && (
                              <span className="text-xs text-gray-500">
                                {o.valor_negocio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                              </span>
                            )}
                          </div>
                          {o.responsavel_nome && (
                            <p className="text-xs text-gray-400 mt-1">👤 {o.responsavel_nome}</p>
                          )}
                        </Card>
                      </Link>
                    ))}
                    {cards.length === 0 && (
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                        <p className="text-xs text-gray-300">Vazio</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lista */}
      {!loading && !error && oportunidades.length > 0 && view === 'lista' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-4 py-3 font-medium text-gray-500">Contato</th>
                  <th className="px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Estágio</th>
                  <th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Prioridade</th>
                  <th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Responsável</th>
                  <th className="px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Valor</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {oportunidades.map(o => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{o.contato_nome ?? '—'}</p>
                      <p className="text-xs text-gray-400">{o.empreendimento_nome ?? ''}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge label={ESTAGIOS_LABELS[o.estagio]} className={ESTAGIOS_CORES[o.estagio]} />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge
                        label={PRIORIDADE_LABELS[o.prioridade] ?? o.prioridade}
                        className={PRIORIDADE_CORES[o.prioridade] ?? ''}
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                      {o.responsavel_nome ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">
                      {o.valor_negocio
                        ? o.valor_negocio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/oportunidades/${o.id}`}
                        className="text-[#1e3a5f] hover:underline text-xs font-medium"
                      >
                        Ver →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
