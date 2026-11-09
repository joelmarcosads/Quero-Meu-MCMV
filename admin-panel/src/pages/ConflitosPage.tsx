/**
 * ConflitosPage.tsx
 *
 * Lista e resolução de conflitos de identidade (captacoes_conflito).
 * Acesso: admin e assistente apenas.
 *
 * Padrão visual: idêntico ao LeadsPage / ContatosPage (glass-card dark theme).
 */

import { useState } from 'react';
import { api } from '../lib/api';
import { useApi } from '../hooks/useApi';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface ConflitoPendente {
  id: number;
  tel_contato_id: number;
  email_contato_id: number;
  origem: string;
  canal: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  idempotency_key: string | null;
  status: 'pendente' | 'resolvido_tel' | 'resolvido_email' | 'descartado';
  resolvido_por: number | null;
  resolvido_at: string | null;
  lead_id_gerado: number | null;
  created_at: string;
  tel_contato_nome: string | null;
  email_contato_nome: string | null;
  email_contato_email: string | null;
  resolvido_por_nome: string | null;
  payload: Record<string, unknown> | null;
}

interface ListaConflitosResponse {
  conflitos: ConflitoPendente[];
  meta: { status: string; limit: number; offset: number; count: number };
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function OrigemBadge({ origem }: { origem: string }) {
  const map: Record<string, { label: string; color: string }> = {
    portal_organico:     { label: 'Portal Orgânico',    color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20' },
    portal_pago:         { label: 'Portal Pago',         color: 'bg-purple-500/15 text-purple-400 border-purple-500/20' },
    google_ads:          { label: 'Google Ads',          color: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
    meta_ads:            { label: 'Meta Ads',            color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20' },
    whatsapp_direto:     { label: 'WhatsApp',            color: 'bg-green-500/15 text-green-400 border-green-500/20' },
    indicacao:           { label: 'Indicação',           color: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
    marketplace_zap:     { label: 'ZAP',                 color: 'bg-orange-500/15 text-orange-400 border-orange-500/20' },
    marketplace_viva:    { label: 'VivaReal',            color: 'bg-pink-500/15 text-pink-400 border-pink-500/20' },
    marketplace_olx:     { label: 'OLX',                 color: 'bg-rose-500/15 text-rose-400 border-rose-500/20' },
    marketplace_facebook:{ label: 'Facebook',            color: 'bg-blue-500/15 text-blue-300 border-blue-500/20' },
    outro:               { label: 'Outro',               color: 'bg-slate-500/15 text-slate-400 border-slate-500/20' },
  };
  const cfg = map[origem] ?? { label: origem, color: 'bg-slate-500/15 text-slate-400 border-slate-500/20' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function StatusBadge({ status }: { status: ConflitoPendente['status'] }) {
  const colorMap: Record<ConflitoPendente['status'], string> = {
    pendente:        'bg-amber-500/15 text-amber-400 border-amber-500/20',
    resolvido_tel:   'bg-cyan-500/15 text-cyan-400 border-cyan-500/20',
    resolvido_email: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
    descartado:      'bg-slate-500/15 text-slate-400 border-slate-500/20',
  };
  const labelMap: Record<ConflitoPendente['status'], string> = {
    pendente:        'Pendente',
    resolvido_tel:   'Resolvido (Tel)',
    resolvido_email: 'Resolvido (Email)',
    descartado:      'Descartado',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${colorMap[status]}`}>
      {labelMap[status]}
    </span>
  );
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

// ─── Modal de Confirmação ─────────────────────────────────────────────────────

interface ConfirmModalProps {
  conflito: ConflitoPendente;
  escolha: 'tel' | 'email';
  onConfirm: () => void;
  onCancel: () => void;
  saving: boolean;
}

function ConfirmModal({ conflito, escolha, onConfirm, onCancel, saving }: ConfirmModalProps) {
  const contatoNome = escolha === 'tel'
    ? conflito.tel_contato_nome ?? `Contato #${conflito.tel_contato_id}`
    : conflito.email_contato_nome ?? `Contato #${conflito.email_contato_id}`;

  const contatoDesc = escolha === 'tel'
    ? `Contato do telefone — #${conflito.tel_contato_id}`
    : `Contato do e-mail — #${conflito.email_contato_id}${conflito.email_contato_email ? ' · ' + conflito.email_contato_email : ''}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        style={{ backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}
        onClick={onCancel}
      />
      {/* Dialog */}
      <div
        className="relative w-full max-w-md rounded-xl border border-white/[0.1] p-6 shadow-2xl z-10"
        style={{ background: 'linear-gradient(135deg, #0d1f3c 0%, #0a1628 100%)' }}
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full mb-4 mx-auto"
             style={{ background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.2)' }}>
          <span className="text-xl">⚠</span>
        </div>

        <h3 className="text-base font-semibold text-white text-center mb-1">
          Confirmar resolução de conflito
        </h3>
        <p className="text-xs text-slate-400 text-center mb-5">
          Conflito #{conflito.id} · {formatDate(conflito.created_at)}
        </p>

        <div className="rounded-lg border border-white/[0.08] p-3 mb-5 bg-white/[0.03]">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1">
            Contato selecionado
          </p>
          <p className="text-sm font-medium text-white">{contatoNome}</p>
          <p className="text-xs text-slate-400 mt-0.5">{contatoDesc}</p>
        </div>

        <p className="text-xs text-slate-400 text-center mb-5">
          Um lead será criado vinculado a este contato. Esta ação não pode ser desfeita.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={saving}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400
                       border border-white/[0.08] hover:border-white/[0.15] hover:text-white
                       transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={saving}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white
                       transition-all disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #00E5FF 0%, #0077FF 100%)',
              boxShadow: '0 0 16px rgba(0,229,255,0.3)',
            }}
          >
            {saving ? 'Resolvendo…' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Painel de detalhes do conflito ──────────────────────────────────────────

interface ConflitoPainelProps {
  conflito: ConflitoPendente;
  onResolver: (id: number, escolha: 'tel' | 'email') => void;
  resolvendo: boolean;
}

function ConflitoPainel({ conflito, onResolver, resolvendo }: ConflitoPainelProps) {
  const nomeTel   = conflito.tel_contato_nome   ?? `Contato #${conflito.tel_contato_id}`;
  const nomeEmail = conflito.email_contato_nome ?? `Contato #${conflito.email_contato_id}`;

  return (
    <div className="border border-white/[0.06] rounded-xl overflow-hidden mb-3">
      {/* Header da linha */}
      <div className="flex items-center justify-between gap-3 px-4 py-3
                      border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-mono text-slate-500 shrink-0">#{conflito.id}</span>
          <span className="text-xs text-slate-400 truncate">{formatDate(conflito.created_at)}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <OrigemBadge origem={conflito.origem} />
          <StatusBadge status={conflito.status} />
        </div>
      </div>

      <div className="p-4">
        {/* Dois contatos envolvidos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Contato do telefone */}
          <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/[0.04] p-3">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-cyan-500/70 mb-1.5">
              📞 Contato do Telefone
            </p>
            <p className="text-sm font-medium text-white leading-tight">{nomeTel}</p>
            <p className="text-xs text-slate-500 mt-0.5">ID #{conflito.tel_contato_id}</p>
            {conflito.status === 'pendente' && (
              <button
                onClick={() => onResolver(conflito.id, 'tel')}
                disabled={resolvendo}
                className="mt-3 w-full px-3 py-1.5 rounded-lg text-xs font-medium
                           text-white transition-all disabled:opacity-40"
                style={{ background: 'rgba(0,229,255,0.15)', border: '1px solid rgba(0,229,255,0.3)' }}
              >
                Vincular a este contato
              </button>
            )}
          </div>

          {/* Contato do email */}
          <div className="rounded-lg border border-blue-500/20 bg-blue-500/[0.04] p-3">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-blue-500/70 mb-1.5">
              ✉ Contato do E-mail
            </p>
            <p className="text-sm font-medium text-white leading-tight">{nomeEmail}</p>
            <p className="text-xs text-slate-500 mt-0.5">ID #{conflito.email_contato_id}</p>
            {conflito.email_contato_email && (
              <p className="text-xs text-slate-400 truncate">{conflito.email_contato_email}</p>
            )}
            {conflito.status === 'pendente' && (
              <button
                onClick={() => onResolver(conflito.id, 'email')}
                disabled={resolvendo}
                className="mt-3 w-full px-3 py-1.5 rounded-lg text-xs font-medium
                           text-white transition-all disabled:opacity-40"
                style={{ background: 'rgba(0,119,255,0.15)', border: '1px solid rgba(0,119,255,0.3)' }}
              >
                Vincular a este contato
              </button>
            )}
          </div>
        </div>

        {/* UTMs, se presentes */}
        {(conflito.utm_source ?? conflito.utm_medium ?? conflito.utm_campaign) && (
          <div className="text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
            {conflito.utm_source   && <span>Source: <span className="text-slate-400">{conflito.utm_source}</span></span>}
            {conflito.utm_medium   && <span>Medium: <span className="text-slate-400">{conflito.utm_medium}</span></span>}
            {conflito.utm_campaign && <span>Campaign: <span className="text-slate-400">{conflito.utm_campaign}</span></span>}
          </div>
        )}

        {/* Info de resolução */}
        {conflito.status !== 'pendente' && (
          <div className="mt-3 pt-3 border-t border-white/[0.06] text-xs text-slate-500">
            Resolvido por{' '}
            <span className="text-slate-400">
              {conflito.resolvido_por_nome ?? `#${conflito.resolvido_por}`}
            </span>
            {conflito.resolvido_at && (
              <> em <span className="text-slate-400">{formatDate(conflito.resolvido_at)}</span></>
            )}
            {conflito.lead_id_gerado && (
              <> · Lead <span className="text-slate-400">#{conflito.lead_id_gerado}</span> gerado</>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

type StatusFilter = 'pendente' | 'resolvido_tel' | 'resolvido_email' | 'descartado';

const STATUS_OPTS: { value: StatusFilter; label: string }[] = [
  { value: 'pendente',        label: 'Pendentes'    },
  { value: 'resolvido_tel',   label: 'Res. Tel'     },
  { value: 'resolvido_email', label: 'Res. Email'   },
  { value: 'descartado',      label: 'Descartados'  },
];

export function ConflitosPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pendente');

  const { data, loading, error, refetch } = useApi<ListaConflitosResponse>(
    () => api.conflitos.list({ status: statusFilter }) as Promise<ListaConflitosResponse>,
    [statusFilter],
  );

  // Estado do modal de confirmação
  const [confirmState, setConfirmState] = useState<{
    conflitoId: number;
    escolha: 'tel' | 'email';
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [flashMsg, setFlashMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  function pedirConfirmacao(conflitoId: number, escolha: 'tel' | 'email') {
    setFlashMsg(null);
    setConfirmState({ conflitoId, escolha });
  }

  async function confirmarResolucao() {
    if (!confirmState) return;
    setSaving(true);
    try {
      await api.conflitos.resolver(confirmState.conflitoId, { escolha: confirmState.escolha });
      setFlashMsg({
        type: 'success',
        text: `Conflito #${confirmState.conflitoId} resolvido com sucesso.`,
      });
      setConfirmState(null);
      refetch();
    } catch (err) {
      setFlashMsg({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erro ao resolver conflito',
      });
      setConfirmState(null);
    } finally {
      setSaving(false);
    }
  }

  const conflitoParaModal = confirmState
    ? (data?.conflitos ?? []).find(c => c.id === confirmState.conflitoId) ?? null
    : null;

  const totalPendentes = (data?.conflitos ?? []).filter(c => c.status === 'pendente').length;

  return (
    <div className="space-y-4">
      {/* Modal de confirmação */}
      {confirmState && conflitoParaModal && (
        <ConfirmModal
          conflito={conflitoParaModal}
          escolha={confirmState.escolha}
          onConfirm={() => { void confirmarResolucao(); }}
          onCancel={() => setConfirmState(null)}
          saving={saving}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-white">Conflitos de Identidade</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Captações com divergência entre telefone e e-mail cadastrados
          </p>
        </div>
        {statusFilter === 'pendente' && totalPendentes > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-500/20 bg-amber-500/[0.06]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-medium text-amber-400">
              {totalPendentes} {totalPendentes === 1 ? 'pendente' : 'pendentes'}
            </span>
          </div>
        )}
      </div>

      {/* Flash message */}
      {flashMsg && (
        <div className={[
          'flex items-center justify-between gap-3 px-4 py-3 rounded-lg border text-sm',
          flashMsg.type === 'success'
            ? 'bg-green-500/[0.08] border-green-500/20 text-green-400'
            : 'bg-red-500/[0.08] border-red-500/20 text-red-400',
        ].join(' ')}>
          <span>{flashMsg.text}</span>
          <button
            onClick={() => setFlashMsg(null)}
            className="text-xs opacity-60 hover:opacity-100 transition-opacity shrink-0"
          >✕</button>
        </div>
      )}

      {/* Filtro de status */}
      <div className="glass-card p-1.5 flex gap-1">
        {STATUS_OPTS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => { setStatusFilter(value); setFlashMsg(null); }}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              statusFilter === value ? 'text-white' : 'text-slate-500 hover:text-slate-300'
            }`}
            style={statusFilter === value ? {
              background: 'rgba(0,229,255,0.12)',
              border: '1px solid rgba(0,229,255,0.2)',
              color: '#00E5FF',
            } : {}}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="glass-card overflow-hidden">
        {/* Cabeçalho */}
        <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Conflitos · {statusFilter}
          </p>
          <button
            onClick={() => { void refetch(); }}
            disabled={loading}
            className="text-xs text-slate-500 hover:text-cyan-400 transition-colors disabled:opacity-50"
          >
            {loading ? '…' : '↻ Atualizar'}
          </button>
        </div>

        {/* Loading */}
        {loading && !data && (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-slate-700 border-t-cyan-400 rounded-full animate-spin" />
              <p className="text-xs text-slate-500">Carregando conflitos…</p>
            </div>
          </div>
        )}

        {/* Erro */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-2xl">⚠</span>
            <p className="text-sm text-slate-400">{error}</p>
            <button
              onClick={() => { void refetch(); }}
              className="text-xs text-cyan-400 hover:underline"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Lista vazia */}
        {!loading && !error && data && data.conflitos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-3xl">✓</span>
            <p className="text-sm text-slate-400">
              {statusFilter === 'pendente'
                ? 'Nenhum conflito pendente — ótimo!'
                : `Nenhum conflito com status "${statusFilter}".`}
            </p>
          </div>
        )}

        {/* Lista de conflitos */}
        {!loading && !error && data && data.conflitos.length > 0 && (
          <div className="p-4">
            {data.conflitos.map(conflito => (
              <ConflitoPainel
                key={conflito.id}
                conflito={conflito}
                onResolver={pedirConfirmacao}
                resolvendo={saving}
              />
            ))}
          </div>
        )}

        {/* Rodapé */}
        {data && data.conflitos.length > 0 && (
          <div className="px-4 py-3 border-t border-white/[0.06]">
            <p className="text-xs text-slate-500">
              {data.conflitos.length}{' '}
              {data.conflitos.length === 1 ? 'conflito' : 'conflitos'} · status: {statusFilter}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
