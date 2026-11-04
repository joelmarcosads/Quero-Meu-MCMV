import { api } from '../lib/api';
import { useApi } from '../hooks/useApi';
import { Card, LoadingSpinner, ErrorBanner, Badge } from '../components/ui';
import { ESTAGIOS_LABELS, ESTAGIOS_CORES } from '../lib/constants';
import type { DashboardStats, EstagioOportunidade } from '../types';

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-[#1e3a5f] mt-1">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </Card>
  );
}

export function DashboardPage() {
  const { data, loading, error, refetch } = useApi<DashboardStats>(
    () => api.dashboard.stats() as Promise<DashboardStats>,
  );

  if (loading) return <LoadingSpinner text="Carregando indicadores..." />;
  if (error) return <ErrorBanner message={error} onRetry={refetch} />;
  if (!data) return null;

  const taxaConversao =
    data.oportunidades.fechadas_30d.ganhas + data.oportunidades.fechadas_30d.perdidas > 0
      ? Math.round(
          (data.oportunidades.fechadas_30d.ganhas /
            (data.oportunidades.fechadas_30d.ganhas + data.oportunidades.fechadas_30d.perdidas)) *
            100,
        )
      : null;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total de Leads"
          value={data.leads.total.toLocaleString('pt-BR')}
          sub={`${data.leads.hoje} hoje`}
        />
        <StatCard
          label="Contatos"
          value={data.contatos.total.toLocaleString('pt-BR')}
        />
        <StatCard
          label="Oportunidades Abertas"
          value={data.oportunidades.abertas}
        />
        {taxaConversao !== null && (
          <StatCard
            label="Taxa de Conversão (30d)"
            value={`${taxaConversao}%`}
            sub={`${data.oportunidades.fechadas_30d.ganhas} ganhas · ${data.oportunidades.fechadas_30d.perdidas} perdidas`}
          />
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pipeline */}
        <Card>
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Pipeline atual</h3>
          </div>
          <div className="p-5 space-y-2">
            {data.pipeline.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Sem dados de pipeline</p>
            ) : (
              data.pipeline.map(row => (
                <div key={row.estagio} className="flex items-center justify-between gap-3">
                  <Badge
                    label={ESTAGIOS_LABELS[row.estagio as EstagioOportunidade] ?? row.estagio}
                    className={ESTAGIOS_CORES[row.estagio as EstagioOportunidade] ?? 'bg-gray-100 text-gray-700'}
                  />
                  <span className="text-sm font-semibold text-gray-700">{row.total}</span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Origens */}
        <Card>
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Leads por origem (30d)</h3>
          </div>
          <div className="p-5 space-y-2">
            {data.leads_por_origem_30d.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Sem dados no período</p>
            ) : (
              data.leads_por_origem_30d.map(row => (
                <div key={row.origem} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">{row.origem}</span>
                  <span className="text-sm font-semibold text-gray-700">{row.total}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
