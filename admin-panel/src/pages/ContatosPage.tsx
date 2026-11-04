import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useApi } from '../hooks/useApi';
import {
  Card, LoadingSpinner, ErrorBanner, EmptyState, SearchInput, Pagination,
} from '../components/ui';
import type { Contato, PaginaMeta } from '../types';

interface ContatosResponse { contatos: Contato[]; meta: PaginaMeta }

export function ContatosPage() {
  const [q, setQ] = useState('');
  const [offset, setOffset] = useState(0);
  const LIMIT = 50;

  const params: Record<string, string> = { limit: String(LIMIT), offset: String(offset) };
  if (q) params['q'] = q;

  const { data, loading, error, refetch } = useApi<ContatosResponse>(
    () => api.contatos.list(params) as Promise<ContatosResponse>,
    [q, offset],
  );

  const handleSearch = (value: string) => { setQ(value); setOffset(0); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <SearchInput placeholder="Buscar por nome, telefone ou e-mail…" onSearch={handleSearch} />
        <p className="text-sm text-gray-500">{data ? `${data.contatos.length} registros` : ''}</p>
      </div>

      <Card>
        {loading && <LoadingSpinner />}
        {error && <ErrorBanner message={error} onRetry={refetch} />}

        {!loading && !error && data && (
          <>
            {data.contatos.length === 0 ? (
              <EmptyState
                title="Nenhum contato encontrado"
                description="Contatos são criados automaticamente a partir dos leads recebidos."
                icon="👥"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left">
                      <th className="px-4 py-3 font-medium text-gray-500">Nome / Telefone</th>
                      <th className="px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Localização</th>
                      <th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Oportunidades</th>
                      <th className="px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Desde</th>
                      <th className="px-4 py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {data.contatos.map(contato => (
                      <tr key={contato.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-800">{contato.nome ?? '—'}</p>
                          <p className="text-gray-500 text-xs">{contato.telefone}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">
                          {[contato.bairro, contato.cidade, contato.uf].filter(Boolean).join(', ') || '—'}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className={`text-sm font-medium ${(contato.total_oportunidades ?? 0) > 0 ? 'text-[#1e3a5f]' : 'text-gray-300'}`}>
                            {contato.total_oportunidades ?? 0}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                          {new Date(contato.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            to={`/contatos/${contato.id}`}
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
                    count={data.contatos.length}
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
