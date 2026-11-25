/**
 * PlanejamentoPage.tsx — Módulo Planejamento Anual
 * Market Imobi CRM · feat/market-imobi-crm-staging
 */

import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorBanner } from '../components/ui/ErrorBanner';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface HealthScore {
  canais_ativos: number;
  total_canais: number;
  score: number;
  classificacao: 'Dependente' | 'Em construção' | 'Saudável';
  cor: 'vermelho' | 'amarelo' | 'verde';
}

interface CanalCalc {
  canal_id: string;
  nome: string;
  icone: string;
  ativo: number;
  nucleo: number;
  mes_entrada: number;
  peso_relativo: number;
  imoveis_meta_canal: number;
  meta_mensal: number;
  meses_ativos: number;
  tipo_funil: string;
  leads_necessarios_mes: number | null;
  contatos_necessarios_mes: number | null;
  investimento_mes?: { cpl_usado: number; investimento_mes: number };
  acoes: string[];
}

interface PlanoAnual {
  id: number;
  ano_referencia: number;
  ano_base: number;
  tipo_corretor: string;
  comissao_base: number;
  pct_comissao: number;
  ticket_medio: number;
  imoveis_base: number;
  meta_comissao: number;
  status: string;
  canais_ativos?: number;
}

interface PlanoResumo {
  plano: PlanoAnual;
  diagnostico: { imoveis_base: number; vgv_base: number };
  health_score: HealthScore;
  meta: {
    vgv_necessario: number;
    imoveis_meta_ano: number;
    crescimento_pct: number;
    imoveis_adicionais: number;
  };
  canais: CanalCalc[];
  investimento_total_mes: number;
}

interface ConfigCanal {
  canal_id: string;
  nome: string;
  icone: string;
  peso: number;
  nucleo: number;
  mes_entrada_padrao: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmtBRL = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 });

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const COR_HEALTH: Record<string, { bar: string; badge: string; text: string }> = {
  vermelho: { bar: '#FF4D6D', badge: 'rgba(255,77,109,0.15)', text: '#FF4D6D' },
  amarelo:  { bar: '#FFB800', badge: 'rgba(255,184,0,0.15)',  text: '#FFB800' },
  verde:    { bar: '#00F5A0', badge: 'rgba(0,245,160,0.15)',  text: '#00F5A0' },
};

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function KpiCard({ label, value, sub, icon, accent = 'cyan' }: {
  label: string; value: string; sub?: string; icon: string;
  accent?: 'cyan' | 'orange' | 'green' | 'red';
}) {
  const A = {
    cyan:   { border: 'rgba(0,229,255,0.15)',  color: '#00E5FF', bg: 'rgba(0,229,255,0.07)' },
    orange: { border: 'rgba(255,122,24,0.15)', color: '#FF7A18', bg: 'rgba(255,122,24,0.07)' },
    green:  { border: 'rgba(0,245,160,0.15)',  color: '#00F5A0', bg: 'rgba(0,245,160,0.07)' },
    red:    { border: 'rgba(255,77,109,0.15)', color: '#FF4D6D', bg: 'rgba(255,77,109,0.07)' },
  }[accent];
  return (
    <div className="rounded-2xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4"
         style={{ background: 'rgba(16,34,59,0.80)', border: `1px solid ${A.border}` }}>
      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-lg sm:text-xl shrink-0"
           style={{ background: A.bg, border: `1px solid ${A.border}` }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] sm:text-xs text-slate-400 font-medium tracking-wide mb-1">{label}</p>
        <p className="text-lg sm:text-xl font-bold tracking-tight truncate" style={{ color: A.color }}>{value}</p>
        {sub && <p className="text-[11px] text-slate-500 mt-0.5 truncate">{sub}</p>}
      </div>
    </div>
  );
}

function HealthScoreBar({ hs }: { hs: HealthScore }) {
  const c = COR_HEALTH[hs.cor];
  return (
    <div className="rounded-2xl p-4 sm:p-5"
         style={{ background: 'rgba(16,34,59,0.80)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-white">Health Score dos Canais</p>
          <p className="text-[11px] text-slate-400">{hs.canais_ativos} de {hs.total_canais} canais ativos</p>
        </div>
        <div className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: c.badge, color: c.text }}>
          {hs.classificacao}
        </div>
      </div>
      <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
             style={{ width: `${hs.score}%`, background: c.bar }} />
      </div>
      <div className="flex justify-between mt-1.5 text-[10px] text-slate-500">
        <span>0%</span>
        <span className="font-semibold" style={{ color: c.text }}>{hs.score}%</span>
        <span>100%</span>
      </div>
    </div>
  );
}

// ─── Wizard de criação ────────────────────────────────────────────────────────

interface WizardData {
  ano_referencia: number;
  ano_base: number;
  tipo_corretor: string;
  comissao_base: string;
  pct_comissao: string;
  ticket_medio: string;
  meta_comissao: string;
}

const WIZARD_DEFAULTS: WizardData = {
  ano_referencia: new Date().getFullYear() + 1,
  ano_base: new Date().getFullYear(),
  tipo_corretor: 'autonomo',
  comissao_base: '',
  pct_comissao: '5',
  ticket_medio: '',
  meta_comissao: '',
};

function WizardCriacao({ configCanais, onSuccess }: {
  configCanais: ConfigCanal[];
  onSuccess: (plano: PlanoAnual) => void;
}) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(WIZARD_DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof WizardData, v: string | number) =>
    setData(prev => ({ ...prev, [k]: v }));

  const imoveis_base = data.comissao_base && data.pct_comissao && data.ticket_medio
    ? parseFloat(data.comissao_base) / (parseFloat(data.pct_comissao) / 100) / parseFloat(data.ticket_medio)
    : null;

  const crescimento = data.comissao_base && data.meta_comissao
    ? ((parseFloat(data.meta_comissao) - parseFloat(data.comissao_base)) / parseFloat(data.comissao_base)) * 100
    : null;

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const result = await (api.planejamento as any).create({
        ano_referencia: data.ano_referencia,
        ano_base: data.ano_base,
        tipo_corretor: data.tipo_corretor,
        comissao_base: parseFloat(data.comissao_base),
        pct_comissao: parseFloat(data.pct_comissao),
        ticket_medio: parseFloat(data.ticket_medio),
        meta_comissao: parseFloat(data.meta_comissao),
      });
      onSuccess((result as any).plano);
    } catch (e: any) {
      setError(e.message ?? 'Erro ao criar plano');
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "w-full rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/40";
  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' };

  return (
    <div className="max-w-lg mx-auto">
      {/* Steps indicator */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex-1 h-1 rounded-full transition-all duration-300"
               style={{ background: s <= step ? '#00E5FF' : 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>

      {/* Step 1 — Diagnóstico */}
      {step === 1 && (
        <div>
          <h3 className="text-base font-semibold text-white mb-1">📊 Passo 1 — Diagnóstico</h3>
          <p className="text-xs text-slate-400 mb-5">Quanto você faturou em comissões no ano anterior?</p>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">Ano do plano</label>
                <input type="number" className={inputCls} style={inputStyle}
                  value={data.ano_referencia}
                  onChange={e => set('ano_referencia', parseInt(e.target.value))} />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">Ano de comparação</label>
                <input type="number" className={inputCls} style={inputStyle}
                  value={data.ano_base}
                  onChange={e => set('ano_base', parseInt(e.target.value))} />
              </div>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block">Tipo de atuação</label>
              <select className={inputCls} style={{ ...inputStyle, cursor: 'pointer' }}
                value={data.tipo_corretor} onChange={e => set('tipo_corretor', e.target.value)}>
                <option value="autonomo">Corretor Autônomo</option>
                <option value="imobiliaria">Imobiliária / Equipe</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 mb-1 block">Comissão total recebida em {data.ano_base} (R$)</label>
              <input type="number" placeholder="Ex: 120000" className={inputCls} style={inputStyle}
                value={data.comissao_base} onChange={e => set('comissao_base', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">% de comissão</label>
                <input type="number" step="0.5" placeholder="5" className={inputCls} style={inputStyle}
                  value={data.pct_comissao} onChange={e => set('pct_comissao', e.target.value)} />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">Ticket médio (R$)</label>
                <input type="number" placeholder="Ex: 350000" className={inputCls} style={inputStyle}
                  value={data.ticket_medio} onChange={e => set('ticket_medio', e.target.value)} />
              </div>
            </div>
          </div>
          {imoveis_base !== null && (
            <div className="mt-4 rounded-xl p-3 text-sm"
                 style={{ background: 'rgba(0,229,255,0.07)', border: '1px solid rgba(0,229,255,0.15)' }}>
              <span className="text-slate-400">Imóveis vendidos estimados em {data.ano_base}: </span>
              <span className="font-bold text-cyan-400">{imoveis_base.toFixed(1)}</span>
            </div>
          )}
          <button disabled={!data.comissao_base || !data.ticket_medio}
            onClick={() => setStep(2)}
            className="mt-5 w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-40"
            style={{ background: '#00E5FF', color: '#071426' }}>
            Próximo →
          </button>
        </div>
      )}

      {/* Step 2 — Canais (apenas visualização) */}
      {step === 2 && (
        <div>
          <h3 className="text-base font-semibold text-white mb-1">🛤️ Passo 2 — Seus canais</h3>
          <p className="text-xs text-slate-400 mb-4">Os canais núcleo já vêm ativos. Você pode ativar mais depois.</p>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {configCanais.map(c => (
              <div key={c.canal_id} className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                   style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span className="text-lg">{c.icone}</span>
                <span className="text-sm text-white flex-1">{c.nome}</span>
                <span className="text-[11px] rounded-full px-2 py-0.5 font-medium"
                      style={c.nucleo
                        ? { background: 'rgba(0,229,255,0.12)', color: '#00E5FF' }
                        : { background: 'rgba(255,255,255,0.06)', color: '#64748b' }}>
                  {c.nucleo ? 'Núcleo' : 'Opcional'}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={() => setStep(1)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-300"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              ← Voltar
            </button>
            <button onClick={() => setStep(3)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: '#00E5FF', color: '#071426' }}>
              Próximo →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Meta */}
      {step === 3 && (
        <div>
          <h3 className="text-base font-semibold text-white mb-1">🎯 Passo 3 — Sua meta</h3>
          <p className="text-xs text-slate-400 mb-5">Qual a sua meta de faturamento em comissões para {data.ano_referencia}?</p>
          <div>
            <label className="text-[11px] text-slate-400 mb-1 block">Meta de comissão {data.ano_referencia} (R$)</label>
            <input type="number" placeholder="Ex: 180000" className={inputCls} style={inputStyle}
              value={data.meta_comissao} onChange={e => set('meta_comissao', e.target.value)} />
          </div>
          {crescimento !== null && (
            <div className="mt-4 rounded-xl p-3 space-y-1"
                 style={{ background: 'rgba(0,245,160,0.06)', border: '1px solid rgba(0,245,160,0.15)' }}>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Crescimento necessário</span>
                <span className="font-bold text-emerald-400">+{crescimento.toFixed(1)}%</span>
              </div>
              {data.ticket_medio && data.pct_comissao && (
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Imóveis-meta</span>
                  <span className="font-bold text-white">
                    {Math.ceil(parseFloat(data.meta_comissao) / (parseFloat(data.pct_comissao) / 100) / parseFloat(data.ticket_medio))} imóveis
                  </span>
                </div>
              )}
            </div>
          )}
          {error && <div className="mt-3 text-xs text-red-400 rounded-lg p-2" style={{ background: 'rgba(255,77,109,0.1)' }}>{error}</div>}
          <div className="flex gap-3 mt-5">
            <button onClick={() => setStep(2)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-300"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              ← Voltar
            </button>
            <button disabled={!data.meta_comissao || loading}
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-40"
              style={{ background: '#00E5FF', color: '#071426' }}>
              {loading ? 'Criando…' : 'Criar Plano ✓'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Painel do plano existente ────────────────────────────────────────────────

function PlanoDashboard({ planoId, onBack }: { planoId: number; onBack: () => void }) {
  const [resumo, setResumo] = useState<PlanoResumo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [atualizando, setAtualizando] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await (api.planejamento as any).get(planoId);
      setResumo(r as PlanoResumo);
    } catch (e: any) {
      setError(e.message ?? 'Erro ao carregar plano');
    } finally {
      setLoading(false);
    }
  }, [planoId]);

  useEffect(() => { carregar(); }, [carregar]);

  async function toggleCanal(canalId: string, ativo: boolean) {
    setAtualizando(canalId);
    try {
      await (api.planejamento as any).updateCanal(planoId, canalId, { ativo });
      await carregar();
    } finally {
      setAtualizando(null);
    }
  }

  if (loading) return <div className="flex justify-center py-16"><LoadingSpinner /></div>;
  if (error) return <ErrorBanner message={error} />;
  if (!resumo) return null;

  const { plano, health_score, meta, canais, investimento_total_mes } = resumo;
  const hs = health_score;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Plano {plano.ano_referencia}</h2>
          <p className="text-xs text-slate-400">Base: {plano.ano_base} · {plano.tipo_corretor === 'autonomo' ? 'Corretor Autônomo' : 'Imobiliária'}</p>
        </div>
        <button onClick={onBack} className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.05)' }}>
          ← Voltar
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon="💰" label="Meta de Comissão" value={fmtBRL(plano.meta_comissao)} accent="cyan" />
        <KpiCard icon="🏠" label="Imóveis-meta" value={`${meta.imoveis_meta_ano} imóveis`}
                 sub={`+${meta.crescimento_pct.toFixed(0)}% sobre ${plano.ano_base}`} accent="green" />
        <KpiCard icon="📈" label="VGV Necessário" value={fmtBRL(meta.vgv_necessario)} accent="orange" />
        <KpiCard icon="💸" label="Invest./mês (Tráfego)"
                 value={investimento_total_mes > 0 ? fmtBRL(investimento_total_mes) : '—'} accent="red" />
      </div>

      {/* Health Score */}
      <HealthScoreBar hs={hs} />

      {/* Canais */}
      <div className="rounded-2xl overflow-hidden"
           style={{ background: 'rgba(16,34,59,0.80)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="text-sm font-semibold text-white">Canais de Captação</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Ative/inative para redistribuir as metas</p>
        </div>
        <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
          {canais.map(c => (
            <CanalRow key={c.canal_id} canal={c}
              onToggle={v => toggleCanal(c.canal_id, v)}
              atualizando={atualizando === c.canal_id} />
          ))}
        </div>
      </div>

      {/* Cronograma mensal simplificado */}
      <CronogramaGrid canais={canais} />
    </div>
  );
}

function CanalRow({ canal, onToggle, atualizando }: {
  canal: CanalCalc;
  onToggle: (v: boolean) => void;
  atualizando: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const ativo = canal.ativo === 1;

  return (
    <div>
      <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
           onClick={() => setExpanded(e => !e)}>
        <span className="text-lg w-6 text-center shrink-0">{canal.icone}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white truncate">{canal.nome}</span>
            {canal.nucleo === 1 && (
              <span className="text-[10px] rounded-full px-1.5 py-0.5"
                    style={{ background: 'rgba(0,229,255,0.12)', color: '#00E5FF' }}>Núcleo</span>
            )}
          </div>
          {ativo && (
            <p className="text-[11px] text-slate-400 mt-0.5">
              Meta: <span className="text-white">{canal.meta_mensal.toFixed(1)} imóv/mês</span>
              {canal.leads_necessarios_mes && ` · ${canal.leads_necessarios_mes} leads/mês`}
              {canal.contatos_necessarios_mes && ` · ${canal.contatos_necessarios_mes} contatos/mês`}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {/* Toggle */}
          <button
            disabled={atualizando}
            onClick={e => { e.stopPropagation(); onToggle(!ativo); }}
            className="relative w-10 h-5 rounded-full transition-colors duration-200 outline-none focus:ring-2 focus:ring-cyan-500/30"
            style={{ background: ativo ? '#00E5FF' : 'rgba(255,255,255,0.12)' }}>
            <span className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all duration-200"
                  style={{ left: ativo ? 'calc(100% - 18px)' : '2px' }} />
          </button>
          <span className="text-slate-500 text-xs">{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && ativo && (
        <div className="px-4 pb-4 pt-0">
          <div className="rounded-xl p-3 space-y-2"
               style={{ background: 'rgba(0,0,0,0.20)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-slate-500">Meta anual</span>
                <p className="text-white font-semibold mt-0.5">{canal.imoveis_meta_canal.toFixed(1)} imóveis</p>
              </div>
              <div>
                <span className="text-slate-500">Entrada em</span>
                <p className="text-white font-semibold mt-0.5">{MESES[canal.mes_entrada - 1]}</p>
              </div>
              {canal.investimento_mes && (
                <div>
                  <span className="text-slate-500">Investimento</span>
                  <p className="text-white font-semibold mt-0.5">{fmtBRL(canal.investimento_mes.investimento_mes)}/mês</p>
                </div>
              )}
            </div>
            {canal.acoes.length > 0 && (
              <div className="pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <p className="text-[11px] text-slate-400 mb-1.5 font-medium">Próximas ações:</p>
                <ul className="space-y-1">
                  {canal.acoes.map((a, i) => (
                    <li key={i} className="text-xs text-slate-300 flex gap-2">
                      <span className="text-cyan-500 shrink-0">→</span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CronogramaGrid({ canais }: { canais: CanalCalc[] }) {
  const ativos = canais.filter(c => c.ativo === 1);
  if (ativos.length === 0) return null;

  return (
    <div className="rounded-2xl overflow-hidden"
         style={{ background: 'rgba(16,34,59,0.80)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <p className="text-sm font-semibold text-white">Cronograma de Ativação</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left px-4 py-2 text-slate-400 font-medium w-32">Canal</th>
              {MESES.map(m => (
                <th key={m} className="text-center px-1 py-2 text-slate-400 font-medium w-10">{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ativos.map(c => (
              <tr key={c.canal_id} className="border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                <td className="px-4 py-2 text-slate-300 truncate max-w-[128px]">
                  {c.icone} {c.nome.split(' ')[0]}
                </td>
                {MESES.map((_, i) => {
                  const mes = i + 1;
                  const ativo = mes >= c.mes_entrada;
                  return (
                    <td key={mes} className="text-center py-2 px-1">
                      <div className="mx-auto w-6 h-6 rounded flex items-center justify-center text-[10px]"
                           style={ativo
                             ? { background: 'rgba(0,229,255,0.15)', color: '#00E5FF' }
                             : { background: 'rgba(255,255,255,0.03)', color: '#475569' }}>
                        {ativo ? '●' : '·'}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export function PlanejamentoPage() {
  const [planos, setPlanos] = useState<PlanoAnual[] | null>(null);
  const [configCanais, setConfigCanais] = useState<ConfigCanal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
  const [planoSelecionado, setPlanoSelecionado] = useState<number | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [listaRes, canaisRes] = await Promise.all([
        (api.planejamento as any).list(),
        (api.planejamento as any).configCanais(),
      ]);
      setPlanos((listaRes as any).planos ?? []);
      setConfigCanais((canaisRes as any).canais ?? []);
    } catch (e: any) {
      setError(e.message ?? 'Erro ao carregar');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  if (view === 'detail' && planoSelecionado !== null) {
    return (
      <PlanoDashboard
        planoId={planoSelecionado}
        onBack={() => { setView('list'); setPlanoSelecionado(null); }} />
    );
  }

  if (view === 'create') {
    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setView('list')} className="text-slate-400 hover:text-white text-sm">
            ← Voltar
          </button>
          <h2 className="text-lg font-bold text-white">Novo Planejamento Anual</h2>
        </div>
        <WizardCriacao
          configCanais={configCanais}
          onSuccess={plano => {
            setPlanoSelecionado(plano.id);
            setView('detail');
            carregar();
          }} />
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-5">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Planejamento Anual</h2>
          <p className="text-xs text-slate-400 mt-0.5">Defina metas, ative canais e acompanhe o crescimento</p>
        </div>
        <button onClick={() => setView('create')}
          className="px-4 py-2 rounded-xl text-sm font-semibold transition-opacity"
          style={{ background: '#00E5FF', color: '#071426' }}>
          + Novo plano
        </button>
      </div>

      {loading && <div className="flex justify-center py-16"><LoadingSpinner /></div>}
      {error && <ErrorBanner message={error} />}

      {!loading && !error && planos !== null && (
        planos.length === 0 ? (
          <div className="rounded-2xl flex flex-col items-center justify-center py-16 text-center"
               style={{ background: 'rgba(16,34,59,0.60)', border: '1px dashed rgba(255,255,255,0.10)' }}>
            <span className="text-5xl mb-3">🎯</span>
            <p className="text-white font-semibold mb-1">Nenhum plano criado ainda</p>
            <p className="text-xs text-slate-400 mb-5 max-w-xs">
              Crie seu planejamento anual para definir metas, ativar canais e acompanhar o crescimento.
            </p>
            <button onClick={() => setView('create')}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: '#00E5FF', color: '#071426' }}>
              Criar meu planejamento
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {planos.map(p => (
              <button key={p.id} onClick={() => { setPlanoSelecionado(p.id); setView('detail'); }}
                className="w-full text-left rounded-2xl px-5 py-4 transition-colors hover:bg-white/[0.02]"
                style={{ background: 'rgba(16,34,59,0.80)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-bold text-white">Plano {p.ano_referencia}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Meta: <span className="text-cyan-400 font-semibold">{fmtBRL(p.meta_comissao)}</span>
                      {' · '}
                      <span>{p.canais_ativos ?? '?'} canais ativos</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] rounded-full px-2 py-0.5"
                          style={p.status === 'ativo'
                            ? { background: 'rgba(0,245,160,0.12)', color: '#00F5A0' }
                            : { background: 'rgba(255,255,255,0.07)', color: '#64748b' }}>
                      {p.status}
                    </span>
                    <span className="text-slate-500">→</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )
      )}
    </div>
  );
}
