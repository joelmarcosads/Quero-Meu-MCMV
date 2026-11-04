import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useApi } from '../hooks/useApi';
import {
  Card, LoadingSpinner, ErrorBanner, EmptyState, SearchInput, Pagination,
} from '../components/ui';
import type { Lead, PaginaMeta } from '../types';

interface LeadsResponse { leads: Lead[]; meta: PaginaMeta }

export function LeadsPage() {
  const [q, setQ] = useState('');
  const [offset, setOffset] = useState(0);
  const LIMIT = 50;

  const params: Record<string, string> = { limit: String(LIMIT), offset: String(offset) };
  if (q) params['q'] = q;

  const { data, loading, error, refetch } = useApi<LeadsResponse>(
    () => api.leads.list(params) as Promise<LeadsResponse>,
    [q, offset],
  );

  const handleSearch = (value: string) => { setQ(value); setOffset(0); };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <SearchInput placeholder="Buscar por nome ou telefone…" onSearch={handleSearch} />
        <p className="text-sm text-gray-500">
          {data ? `${data.leads.length} registros` : ''}
        </p>
      </div>

      <Card>
        {loading && <LoadingSpinner />}
        {error && <ErrorBanner message={error} onRetry={refetch} />}

        {!loading && !error && data && (
          <>
            {data.leads.length === 0 ? (
              <EmptyState
                title="Nenhum lead encontrado"
                description="Ajuste os filtros ou aguarde novos leads chegarem do portal."
                icon="📋"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left">
                      <th className="px-4 py-3 font-medium text-gray-500">Nome / Telefone</th>
                      <th className="px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Empreendimento</th>
                      <th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Origem</th>
                      <th className="px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Data</th>
                      <th className="px-4 py-3 font-medium text-gray-500 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.leads.map(lead => (
                      <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800">{lead.contato_nome ?? '—'}</p>
                          <p className="text-gray-500 text-xs">{lead.telefone}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                          {lead.empreendimento_nome ?? <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-4 py-3 text-gray-600 capitalize hidden md:table-cell">
                          {lead.origem}
                        </td>
                        <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                          {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            to={`/leads/${lead.id}`}
                            className="text-[#1e3a5f] hover:underline text-xs font-medium"
                          >
                            Ver →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="px-4 pb-4">
                  <Pagination
                    offset={offset}
                    limit={LIMIT}
                    count={data.leads.length}
                    onPageChange={setOffset}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
