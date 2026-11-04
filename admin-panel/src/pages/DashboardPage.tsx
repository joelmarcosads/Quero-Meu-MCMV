import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { api } from '../lib/api';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorBanner } from '../components/ui/ErrorBanner';
import type { DashboardStats, DashboardAnalytics, EstagioOportunidade } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number | undefined | null): string {
  if (n == null) return '—';
  return n.toLocaleString('pt-BR');
}

function pct(a: number, b: number): string {
  if (!b) return '0%';
  return ((a / b) * 100).toFixed(1) + '%';
}

/** Converte 'YYYY-MM-DD' em 'DD/MM' (formato brasileiro) */
function fmtDia(iso: string): string {
  const parts = iso.split('-');
  if (parts.length < 3) return iso.slice(5);
  return `${parts[2]}/${parts[1]}`;
}

// ─── Tooltip state ────────────────────────────────────────────────────────────
interface TooltipState { x: number; y: number; text: string }

// ─── Estágio labels (nomes canônicos completos e abreviados) ──────────────────
const ESTAGIO_LABEL: Record<EstagioOportunidade, string> = {
  novo_lead:        'Novo Lead',
  em_contato:       'Em Contato',
  visita_solicitada:'Visita Solicitada',
  visita_agendada:  'Visita Agendada',
  visita_realizada: 'Visita Realizada',
  proposta_enviada: 'Proposta Enviada',
  documentacao:     'Documentação',
  fechado_ganho:    'Ganho ✓',
  fechado_perdido:  'Perdido ✗',
};

/** Nomes abreviados para o gráfico de funil (máx. ~12 chars) */
const ESTAGIO_SHORT: Record<EstagioOportunidade, string> = {
  novo_lead:        'Novo Lead',
  em_contato:       'Em Contato',
  visita_solicitada:'Vis. Solicitada',
  visita_agendada:  'Vis. Agendada',
  visita_realizada: 'Vis. Realizada',
  proposta_enviada: 'Proposta',
  documentacao:     'Documentação',
  fechado_ganho:    'Ganho ✓',
  fechado_perdido:  'Perdido ✗',
};

// ─── KPI Card ──────────────────────────────────────────────────────────────────
interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: 'cyan' | 'orange' | 'green' | 'red';
  icon: string;
}

function KpiCard({ label, value, sub, accent = 'cyan', icon }: KpiCardProps) {
  const ACCENT = {
    cyan:   { glow: 'rgba(0,229,255,0.18)',   border: 'rgba(0,229,255,0.15)',   color: '#00E5FF', bg: 'rgba(0,229,255,0.07)' },
    orange: { glow: 'rgba(255,122,24,0.18)',  border: 'rgba(255,122,24,0.15)',  color: '#FF7A18', bg: 'rgba(255,122,24,0.07)' },
    green:  { glow: 'rgba(0,245,160,0.18)',   border: 'rgba(0,245,160,0.15)',   color: '#00F5A0', bg: 'rgba(0,245,160,0.07)' },
    red:    { glow: 'rgba(255,77,109,0.18)',  border: 'rgba(255,77,109,0.15)',  color: '#FF4D6D', bg: 'rgba(255,77,109,0.07)' },
  }[accent];

  return (
    <div className="rounded-2xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 transition-transform duration-200 hover:-translate-y-0.5"
         style={{ background: 'rgba(16,34,59,0.80)', backdropFilter: 'blur(12px)', border: `1px solid ${ACCENT.border}`, boxShadow: `0 4px 24px rgba(0,0,0,0.40), 0 0 0 1px ${ACCENT.glow}` }}>
      <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-lg sm:text-xl shrink-0"
           style={{ background: ACCENT.bg, border: `1px solid ${ACCENT.border}` }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] sm:text-xs text-slate-400 font-medium tracking-wide mb-1 leading-tight">{label}</p>
        <p className="text-xl sm:text-2xl font-bold leading-none" style={{ color: ACCENT.color }}>{value}</p>
        {sub && <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1 sm:mt-1.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Line Chart SVG ───────────────────────────────────────────────────────────
function LineChart({
  data,
  color = '#00E5FF',
  onTooltip,
  onHideTooltip,
}: {
  data: { dia: string; total: number }[];
  color?: string;
  onTooltip?: (e: React.MouseEvent, text: string) => void;
  onHideTooltip?: () => void;
}) {
  if (!data.length) return <div className="flex items-center justify-center h-full text-slate-500 text-xs">Sem dados</div>;

  const W = 560, H = 140, PAD = { t: 10, r: 16, b: 32, l: 32 };
  const xs = W - PAD.l - PAD.r;
  const ys = H - PAD.t - PAD.b;
  const maxV = Math.max(...data.map(d => d.total), 1);

  const pts = data.map((d, i) => ({
    x: PAD.l + (i / Math.max(data.length - 1, 1)) * xs,
    y: PAD.t + (1 - d.total / maxV) * ys,
    ...d,
  }));

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaD = `${pathD} L${pts[pts.length - 1].x.toFixed(1)},${(PAD.t + ys).toFixed(1)} L${PAD.l},${(PAD.t + ys).toFixed(1)} Z`;

  // Mostrar rótulos: todos se ≤ 7 pontos, caso contrário início / meio / fim
  const labelIdx = data.length <= 7
    ? data.map((_, i) => i)
    : [0, Math.floor(data.length / 2), data.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none"
         role="img" aria-label={`Gráfico de evolução de leads — ${data.length} dias`}>
      <title>Evolução de leads por dia</title>
      <defs>
        <linearGradient id="lg-line" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0, 0.5, 1].map(r => (
        <line key={r} x1={PAD.l} y1={PAD.t + r * ys} x2={PAD.l + xs} y2={PAD.t + r * ys}
              stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
      ))}
      {/* Area */}
      <path d={areaD} fill="url(#lg-line)"/>
      {/* Line */}
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
      {/* Dots com área interativa */}
      {pts.map((p, i) => (
        <g key={i}
           onMouseEnter={e => onTooltip?.(e, `${fmtDia(p.dia)}: ${p.total} lead${p.total !== 1 ? 's' : ''}`)}
           onMouseLeave={onHideTooltip}
           style={{ cursor: 'default' }}>
          <title>{`${fmtDia(p.dia)}: ${p.total} leads`}</title>
          {/* Hit area maior */}
          <circle cx={p.x} cy={p.y} r="10" fill="transparent"/>
          <circle cx={p.x} cy={p.y} r="3" fill={color} stroke="#071426" strokeWidth="1.5"/>
        </g>
      ))}
      {/* X labels no formato DD/MM */}
      {labelIdx.map(i => (
        <text key={i} x={pts[i].x} y={H - 4} textAnchor="middle" fontSize="9" fill="#64748B">
          {fmtDia(pts[i].dia)}
        </text>
      ))}
    </svg>
  );
}

// ─── Bar Chart SVG ────────────────────────────────────────────────────────────
function BarChart({
  data,
  color = '#00E5FF',
  onTooltip,
  onHideTooltip,
}: {
  data: { label: string; total: number }[];
  color?: string;
  onTooltip?: (e: React.MouseEvent, text: string) => void;
  onHideTooltip?: () => void;
}) {
  if (!data.length) return <div className="flex items-center justify-center h-full text-slate-500 text-xs">Sem dados</div>;

  // Aumentar PAD.b para acomodar labels rotacionadas
  const W = 420, H = 180, PAD = { t: 10, r: 16, b: 54, l: 36 };
  const xs = W - PAD.l - PAD.r;
  const ys = H - PAD.t - PAD.b;
  const maxV = Math.max(...data.map(d => d.total), 1);
  const barW = Math.max(10, xs / data.length - 8);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none"
         role="img" aria-label="Leads por origem">
      <title>Leads por origem</title>
      {data.map((d, i) => {
        const bx = PAD.l + (i + 0.5) * (xs / data.length) - barW / 2;
        const bh = Math.max(d.total > 0 ? 2 : 0, (d.total / maxV) * ys);
        const by = PAD.t + ys - bh;
        // Ponto de âncora para rotação do label
        const lx = bx + barW / 2;
        const ly = PAD.t + ys + 10;
        return (
          <g key={i}
             onMouseEnter={e => onTooltip?.(e, `${d.label}: ${d.total}`)}
             onMouseLeave={onHideTooltip}
             style={{ cursor: 'default' }}>
            <title>{`${d.label}: ${d.total}`}</title>
            <rect x={bx} y={by} width={barW} height={bh} rx="3"
                  fill={color} fillOpacity="0.75"/>
            {/* Label rotacionado -40° para evitar truncamento */}
            <text
              x={lx} y={ly}
              textAnchor="end"
              fontSize="9"
              fill="#64748B"
              transform={`rotate(-40,${lx.toFixed(1)},${ly.toFixed(1)})`}
            >
              {d.label}
            </text>
            {d.total > 0 && (
              <text x={bx + barW / 2} y={by - 4} textAnchor="middle" fontSize="9" fill="#94A3B8">
                {d.total}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Donut Chart SVG ──────────────────────────────────────────────────────────
const DONUT_COLORS = ['#00E5FF', '#FF7A18', '#00F5A0', '#FF4D6D', '#8B5CF6', '#F59E0B'];

function DonutChart({
  data,
  onTooltip,
  onHideTooltip,
}: {
  data: { label: string; total: number }[];
  onTooltip?: (e: React.MouseEvent, text: string) => void;
  onHideTooltip?: () => void;
}) {
  if (!data.length) return <div className="flex items-center justify-center h-full text-slate-500 text-xs">Sem dados</div>;

  const total = data.reduce((a, d) => a + d.total, 0) || 1;
  const CX = 70, CY = 70, R = 54, r = 34;

  let startAngle = -Math.PI / 2;
  const slices = data.map((d, i) => {
    const angle = (d.total / total) * 2 * Math.PI;
    const x1 = CX + R * Math.cos(startAngle);
    const y1 = CY + R * Math.sin(startAngle);
    const x2 = CX + R * Math.cos(startAngle + angle);
    const y2 = CY + R * Math.sin(startAngle + angle);
    const ix1 = CX + r * Math.cos(startAngle);
    const iy1 = CY + r * Math.sin(startAngle);
    const ix2 = CX + r * Math.cos(startAngle + angle);
    const iy2 = CY + r * Math.sin(startAngle + angle);
    const large = angle > Math.PI ? 1 : 0;
    const path = `M${x1.toFixed(2)},${y1.toFixed(2)} A${R},${R} 0 ${large},1 ${x2.toFixed(2)},${y2.toFixed(2)} L${ix2.toFixed(2)},${iy2.toFixed(2)} A${r},${r} 0 ${large},0 ${ix1.toFixed(2)},${iy1.toFixed(2)} Z`;
    const color = DONUT_COLORS[i % DONUT_COLORS.length];
    startAngle += angle;
    return { ...d, path, color };
  });

  return (
    <div className="flex items-center gap-4 h-full">
      <svg viewBox="0 0 140 140" className="w-[110px] h-[110px] shrink-0"
           role="img" aria-label="Distribuição de leads por origem">
        <title>Distribuição de leads por origem</title>
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} fillOpacity="0.85" stroke="#071426" strokeWidth="1.5"
                style={{ cursor: 'default' }}
                onMouseEnter={e => onTooltip?.(e, `${s.label}: ${s.total} (${pct(s.total, total)})`)}
                onMouseLeave={onHideTooltip}>
            <title>{`${s.label}: ${s.total} — ${pct(s.total, total)}`}</title>
          </path>
        ))}
        <text x={CX} y={CY + 4} textAnchor="middle" fontSize="13" fontWeight="600" fill="#F1F5F9">{total}</text>
      </svg>
      <ul className="space-y-1.5 flex-1 min-w-0">
        {slices.slice(0, 5).map((s, i) => (
          <li key={i} className="flex items-center gap-2 text-[11px]">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }}/>
            <span className="text-slate-400 truncate">{s.label}</span>
            <span className="text-slate-200 font-medium ml-auto">{pct(s.total, total)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Funnel Chart SVG ─────────────────────────────────────────────────────────
const FUNNEL_STAGES: EstagioOportunidade[] = [
  'novo_lead', 'em_contato', 'visita_agendada', 'visita_realizada',
  'proposta_enviada', 'documentacao',
];

function FunnelChart({
  pipeline,
  onTooltip,
  onHideTooltip,
}: {
  pipeline: Array<{ estagio: EstagioOportunidade; total: number }>;
  onTooltip?: (e: React.MouseEvent, text: string) => void;
  onHideTooltip?: () => void;
}) {
  const map = Object.fromEntries(pipeline.map(p => [p.estagio, p.total]));
  const stages = FUNNEL_STAGES.map(e => ({ estagio: e, total: map[e] ?? 0 }));
  const maxV = Math.max(...stages.map(s => s.total), 1);
  const W = 320, ROW = 24, PAD = 36, LABEL_W = 92;

  return (
    <svg viewBox={`0 0 ${W} ${stages.length * ROW + 8}`} className="w-full h-full" preserveAspectRatio="none"
         role="img" aria-label="Pipeline de oportunidades por estágio">
      <title>Pipeline de oportunidades por estágio</title>
      {stages.map((s, i) => {
        const availableW = W - PAD - LABEL_W - 24; // espaço para a barra
        const bw = s.total > 0
          ? Math.max(4, (s.total / maxV) * availableW)
          : 2; // barra mínima para zero (indica o estágio existe)
        const bx = LABEL_W + (availableW - bw) / 2 + 4;
        const by = i * ROW + 2;
        const barH = ROW - 6;
        // Opacidade: menor para zero, gradiente para valores positivos
        const opacity = s.total > 0 ? (0.15 + 0.65 * (1 - i / stages.length)) : 0.08;

        return (
          <g key={s.estagio}
             onMouseEnter={e => onTooltip?.(e, `${ESTAGIO_LABEL[s.estagio]}: ${s.total}`)}
             onMouseLeave={onHideTooltip}
             style={{ cursor: 'default' }}>
            <title>{`${ESTAGIO_LABEL[s.estagio]}: ${s.total} oportunidade${s.total !== 1 ? 's' : ''}`}</title>
            {/* Barra */}
            <rect x={bx} y={by} width={bw} height={barH} rx="3"
                  fill="#00E5FF" fillOpacity={opacity}
                  stroke={s.total === 0 ? 'rgba(0,229,255,0.15)' : 'none'}
                  strokeWidth={s.total === 0 ? '1' : '0'}
                  strokeDasharray={s.total === 0 ? '3,2' : 'none'}/>
            {/* Label abreviado à esquerda */}
            <text x={LABEL_W - 4} y={by + barH / 2 + 3.5} textAnchor="end" fontSize="8.5"
                  fill={s.total === 0 ? '#475569' : '#64748B'}>
              {ESTAGIO_SHORT[s.estagio]}
            </text>
            {/* Valor à direita */}
            <text x={W - 4} y={by + barH / 2 + 3.5} textAnchor="end" fontSize="9" fontWeight="600"
                  fill={s.total === 0 ? '#334155' : '#94A3B8'}>
              {s.total}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Conversion Card ──────────────────────────────────────────────────────────
/**
 * Taxa de conversão = ganhas / (ganhas + perdidas) × 100
 * Mede o percentual de oportunidades fechadas que resultaram em venda.
 * Base: apenas oportunidades concluídas nos últimos 30 dias.
 */
function ConversionCard({ ganhas, perdidas }: { ganhas: number; perdidas: number }) {
  const totalFechadas = ganhas + perdidas;
  const pctGanhas = totalFechadas > 0 ? (ganhas / totalFechadas) * 100 : 0;

  return (
    <div className="flex flex-col gap-3 h-full justify-center">
      <div className="flex justify-between items-baseline">
        <div>
          <p className="text-xs text-slate-400">Ganhas</p>
          <p className="text-2xl font-bold" style={{ color: '#00F5A0' }}>{ganhas}</p>
        </div>
        <div className="text-center px-2">
          <p className="text-[10px] text-slate-500 leading-tight">
            {totalFechadas === 0
              ? 'Nenhum fechamento'
              : `${totalFechadas} fechamento${totalFechadas !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Perdidas</p>
          <p className="text-2xl font-bold" style={{ color: '#FF4D6D' }}>{perdidas}</p>
        </div>
      </div>
      {/* Barra proporcional */}
      <div className="relative h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,77,109,0.20)' }}>
        <div className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
             style={{ width: `${pctGanhas}%`, background: 'linear-gradient(90deg, #00F5A0, #00E5FF)' }}/>
      </div>
      <div className="flex justify-between text-[11px]">
        <span style={{ color: '#00F5A0' }} className="font-semibold">{pctGanhas.toFixed(1)}% conversão</span>
        <span className="text-slate-500">{totalFechadas === 0 ? 'sem dados' : `${ganhas}/${totalFechadas}`}</span>
      </div>
      {/* Descrição da fórmula */}
      <p className="text-[10px] text-slate-600 leading-snug border-t border-white/[0.05] pt-2">
        Taxa = ganhas ÷ (ganhas + perdidas). Base: fechamentos dos últimos 30 dias.
      </p>
    </div>
  );
}

// ─── Tooltip flutuante ────────────────────────────────────────────────────────
function FloatingTooltip({ tooltip }: { tooltip: TooltipState | null }) {
  if (!tooltip) return null;
  return (
    <div
      style={{
        position: 'fixed',
        left: tooltip.x + 14,
        top: tooltip.y - 10,
        background: 'rgba(7,20,38,0.95)',
        border: '1px solid rgba(0,229,255,0.20)',
        borderRadius: '6px',
        padding: '4px 8px',
        fontSize: '11px',
        color: '#E2E8F0',
        pointerEvents: 'none',
        zIndex: 9999,
        backdropFilter: 'blur(8px)',
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
      }}
    >
      {tooltip.text}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type Period = '7' | '30' | '90';

export function DashboardPage() {
  const [period, setPeriod]   = useState<Period>('30');
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const statsReq     = useApi<DashboardStats>(() => api.dashboard.stats() as Promise<DashboardStats>);
  const analyticsReq = useApi<DashboardAnalytics>(
    () => api.dashboard.analytics(period) as Promise<DashboardAnalytics>,
    [period],
  );

  const stats     = statsReq.data;
  const analytics = analyticsReq.data;

  if (statsReq.loading && !stats) return <LoadingSpinner fullPage label="Carregando dashboard…"/>;
  if (statsReq.error)             return <ErrorBanner message={statsReq.error} onRetry={statsReq.refetch}/>;

  const fechadas30 = stats?.oportunidades.fechadas_30d;
  const taxaConv   = fechadas30
    ? pct(fechadas30.ganhas, fechadas30.ganhas + fechadas30.perdidas)
    : '—';

  const showTooltip = (e: React.MouseEvent, text: string) =>
    setTooltip({ x: e.clientX, y: e.clientY, text });
  const hideTooltip = () => setTooltip(null);

  return (
    <div className="space-y-5 sm:space-y-6">

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <KpiCard label="Leads Total"    value={fmt(stats?.leads.total)}           sub={`+${fmt(stats?.leads.hoje)} hoje`} accent="cyan"   icon="⬡"/>
        <KpiCard label="Contatos"       value={fmt(stats?.contatos.total)}        sub="cadastrados"                        accent="cyan"   icon="◎"/>
        <KpiCard label="Oport. Abertas" value={fmt(stats?.oportunidades.abertas)} sub="em andamento"                       accent="orange" icon="◇"/>
        <KpiCard label="Ganhas (30d)"   value={fmt(fechadas30?.ganhas)}           sub="fechamentos"                        accent="green"  icon="✓"/>
        <KpiCard label="Perdidas (30d)" value={fmt(fechadas30?.perdidas)}         sub="oportunidades"                      accent="red"    icon="✗"/>
        <KpiCard label="Taxa Conversão" value={taxaConv}                          sub="ganhas ÷ fechamentos"               accent="green"  icon="◈"/>
      </div>

      {/* ── Charts Row 1: Line + Bar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">

        {/* Line: evolução leads */}
        <div className="glass-card p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-100">Evolução de Leads</p>
              <p className="text-xs text-slate-500 mt-0.5">Captações por dia (horário Brasília)</p>
            </div>
            <div className="flex gap-1">
              {(['7','30','90'] as Period[]).map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                        className={`px-2 sm:px-2.5 py-1 rounded text-[11px] font-medium transition-all ${period === p ? 'text-[#071426]' : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/8'}`}
                        style={period === p ? { background: 'linear-gradient(135deg, #00E5FF, #0077FF)' } : {}}>
                  {p}d
                </button>
              ))}
            </div>
          </div>
          <div className="h-32 sm:h-36">
            {analyticsReq.loading
              ? <div className="flex items-center justify-center h-full"><LoadingSpinner size="sm"/></div>
              : <LineChart
                  data={analytics?.leads_evolution ?? []}
                  onTooltip={showTooltip}
                  onHideTooltip={hideTooltip}
                />
            }
          </div>
        </div>

        {/* Bar: leads por origem */}
        <div className="glass-card p-4 sm:p-5">
          <div className="mb-4">
            <p className="text-sm font-semibold text-slate-100">Leads por Origem</p>
            <p className="text-xs text-slate-500 mt-0.5">Últimos 30 dias</p>
          </div>
          <div className="h-36 sm:h-40">
            <BarChart
              data={(stats?.leads_por_origem_30d ?? []).map(o => ({ label: o.origem, total: o.total }))}
              color="#FF7A18"
              onTooltip={showTooltip}
              onHideTooltip={hideTooltip}
            />
          </div>
        </div>
      </div>

      {/* ── Charts Row 2: Donut + Funnel + Conversion ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">

        {/* Donut: leads por origem */}
        <div className="glass-card p-4 sm:p-5">
          <div className="mb-3">
            <p className="text-sm font-semibold text-slate-100">Distribuição Origens</p>
            <p className="text-xs text-slate-500 mt-0.5">Share por canal</p>
          </div>
          <div className="h-28 sm:h-32">
            <DonutChart
              data={(stats?.leads_por_origem_30d ?? []).map(o => ({ label: o.origem, total: o.total }))}
              onTooltip={showTooltip}
              onHideTooltip={hideTooltip}
            />
          </div>
        </div>

        {/* Funnel: pipeline */}
        <div className="glass-card p-4 sm:p-5">
          <div className="mb-3">
            <p className="text-sm font-semibold text-slate-100">Pipeline por Estágio</p>
            <p className="text-xs text-slate-500 mt-0.5">Oportunidades ativas</p>
          </div>
          <div className="h-28 sm:h-32">
            <FunnelChart
              pipeline={stats?.pipeline ?? []}
              onTooltip={showTooltip}
              onHideTooltip={hideTooltip}
            />
          </div>
        </div>

        {/* Conversion */}
        <div className="glass-card p-4 sm:p-5 sm:col-span-2 md:col-span-1">
          <div className="mb-3">
            <p className="text-sm font-semibold text-slate-100">Ganhas × Perdidas</p>
            <p className="text-xs text-slate-500 mt-0.5">Últimos 30 dias</p>
          </div>
          <div className="h-auto">
            <ConversionCard
              ganhas={fechadas30?.ganhas ?? 0}
              perdidas={fechadas30?.perdidas ?? 0}
            />
          </div>
        </div>
      </div>

      {/* Tooltip flutuante — global */}
      <FloatingTooltip tooltip={tooltip}/>
    </div>
  );
}
