import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useApi } from '../hooks/useApi';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorBanner }    from '../components/ui/ErrorBanner';
import { Badge }          from '../components/ui/Badge';
import { Button }         from '../components/ui/Button';
import type { Oportunidade, Interacao, EstagioOportunidade } from '../types';
import {
  ESTAGIOS_LABELS, ESTAGIOS_CORES, ESTAGIOS_ORDEM,
  PRIORIDADE_LABELS, PRIORIDADE_CORES, TIPO_INTERACAO_LABELS,
} from '../lib/constants';
import { useAuth } from '../hooks/useAuth';

interface OportunidadeDetalhe extends Oportunidade {
  interacoes: Interacao[];
}

// ─── Dark-theme field constants ───────────────────────────────────────────────
const INPUT_CLS   = 'w-full h-9 px-3 rounded-lg text-sm bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20';
const SELECT_CLS  = `${INPUT_CLS} appearance-none`;
const TEXTAREA_CLS = 'w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 outline-none resize-none transition-all focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20';

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

// ─── Seletor de estágio ───────────────────────────────────────────────────────
interface SeletorEstagioProps {
  atual: EstagioOportunidade;
  onMudar: (estagio: EstagioOportunidade, motivo?: string) => Promise<void>;
}

function SeletorEstagio({ atual, onMudar }: SeletorEstagioProps) {
  const [selecionado, setSelecionado] = useState<EstagioOportunidade>(atual);
  const [motivo, setMotivo] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const mudou = selecionado !== atual;
  const precisaMotivo = selecionado === 'fechado_perdido';

  const handleConfirmar = async () => {
    if (precisaMotivo && !motivo.trim()) return;
    setSaving(true);
    setErr(null);
    try {
      await onMudar(selecionado, motivo || undefined);
      setMotivo('');
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'Erro ao atualizar estágio');
      setSelecionado(atual);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Grid de estágios */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ESTAGIOS_ORDEM.map((estagio, idx) => {
          const isAtual      = estagio === atual;
          const isSelecionado = estagio === selecionado;

          return (
            <button
              key={estagio}
              onClick={() => setSelecionado(estagio)}
              className={[
                'flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-left',
                isSelecionado
                  ? 'border-cyan-500/40 text-white'
                  : isAtual
                    ? 'border-cyan-500/20 text-cyan-300 bg-cyan-500/10'
                    : 'border-white/8 bg-white/[0.03] text-slate-400 hover:border-white/15 hover:text-slate-200',
              ].join(' ')}
              style={isSelecionado ? {
                background: 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(0,119,255,0.15))',
                boxShadow: '0 0 10px rgba(0,229,255,0.12)',
              } : {}}
            >
              <span className="text-xs opacity-50 font-mono shrink-0">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span className="truncate">{ESTAGIOS_LABELS[estagio]}</span>
            </button>
          );
        })}
      </div>

      {/* Campo de motivo (fechado perdido) */}
      {precisaMotivo && mudou && (
        <Field label="Motivo da perda *">
          <textarea
            value={motivo}
            onChange={e => setMotivo(e.target.value)}
            rows={2}
            placeholder="Ex.: cliente adquiriu imóvel com outro corretor…"
            className={TEXTAREA_CLS}
          />
        </Field>
      )}

      {err && <ErrorBanner message={err}/>}

      {mudou && (
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={handleConfirmar}
            loading={saving}
            disabled={saving || (precisaMotivo && !motivo.trim())}
          >
            {saving ? 'Salvando…' : `Mover para "${ESTAGIOS_LABELS[selecionado]}"`}
          </Button>
          <Button variant="ghost" onClick={() => { setSelecionado(atual); setMotivo(''); }}>
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Formulário de nova interação ─────────────────────────────────────────────
interface NovaInteracaoFormProps {
  oportunidadeId: number;
  contatoId: number;
  onSaved: () => void;
}

function NovaInteracaoForm({ oportunidadeId, contatoId, onSaved }: NovaInteracaoFormProps) {
  const [tipo,     setTipo]     = useState('anotacao');
  const [direcao,  setDirecao]  = useState('interno');
  const [conteudo, setConteudo] = useState('');
  const [saving,   setSaving]   = useState(false);
  const [err,      setErr]      = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!conteudo.trim()) return;
    setSaving(true);
    setErr(null);
    try {
      await api.interacoes.create({
        contato_id: contatoId,
        oportunidade_id: oportunidadeId,
        tipo,
        direcao,
        conteudo,
      });
      setConteudo('');
      onSaved();
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'Erro ao registrar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {err && <ErrorBanner message={err}/>}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Tipo">
          <select value={tipo} onChange={e => setTipo(e.target.value)}
                  className={SELECT_CLS} style={{ background: '#10223B' }}>
            {(['ligacao','whatsapp','email','visita','anotacao'] as const).map(t => (
              <option key={t} value={t}>{TIPO_INTERACAO_LABELS[t]}</option>
            ))}
          </select>
        </Field>
        <Field label="Direção">
          <select value={direcao} onChange={e => setDirecao(e.target.value)}
                  className={SELECT_CLS} style={{ background: '#10223B' }}>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
            <option value="interno">Interno</option>
          </select>
        </Field>
      </div>
      <Field label="Conteúdo">
        <textarea value={conteudo} onChange={e => setConteudo(e.target.value)} rows={3}
                  placeholder="Descreva a interação…" className={TEXTAREA_CLS} required/>
      </Field>
      <Button type="submit" variant="primary" loading={saving} disabled={!conteudo.trim()}>
        Registrar interação
      </Button>
    </form>
  );
}

// ─── Painel de edição ─────────────────────────────────────────────────────────
interface EditResponsavelProps {
  op: Oportunidade;
  onSaved: () => void;
}

function EditResponsavel({ op, onSaved }: EditResponsavelProps) {
  const { user } = useAuth();
  const isAdmin  = user?.perfil === 'admin';

  const { data: usuarios } = useApi(
    () => isAdmin
      ? api.usuarios.list() as Promise<{ usuarios: Array<{ id: number; nome: string; perfil: string }> }>
      : Promise.resolve(null),
    [isAdmin],
  );

  const [responsavelId, setResponsavelId] = useState<number | null>(op.responsavel_id);
  const [valor,         setValor]         = useState(op.valor_negocio ?? '');
  const [observacoes,   setObservacoes]   = useState(op.observacoes ?? '');
  const [prioridade,    setPrioridade]    = useState(op.prioridade);
  const [saving,  setSaving]  = useState(false);
  const [err,     setErr]     = useState<string | null>(null);
  const [saved,   setSaved]   = useState(false);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      const body: Record<string, unknown> = {
        prioridade,
        valor_negocio: valor === '' ? null : Number(valor),
        observacoes: observacoes || null,
      };
      if (isAdmin) body['responsavel_id'] = responsavelId;
      await api.oportunidades.patch(op.id, body);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSaved();
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {err && <ErrorBanner message={err}/>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {isAdmin && usuarios && (
          <Field label="Responsável">
            <select value={responsavelId ?? ''}
                    onChange={e => setResponsavelId(e.target.value ? Number(e.target.value) : null)}
                    className={SELECT_CLS} style={{ background: '#10223B' }}>
              <option value="">Sem responsável</option>
              {(usuarios as { usuarios: Array<{ id: number; nome: string; perfil: string }> })
                .usuarios.map(u => (
                  <option key={u.id} value={u.id}>{u.nome} ({u.perfil})</option>
                ))}
            </select>
          </Field>
        )}

        <Field label="Prioridade">
          <select value={prioridade}
                  onChange={e => setPrioridade(e.target.value as Oportunidade['prioridade'])}
                  className={SELECT_CLS} style={{ background: '#10223B' }}>
            {(['baixa', 'media', 'alta', 'urgente'] as const).map(p => (
              <option key={p} value={p}>{PRIORIDADE_LABELS[p]}</option>
            ))}
          </select>
        </Field>

        <Field label="Valor do negócio (R$)">
          <input type="number" value={valor} onChange={e => setValor(e.target.value)}
                 min={0} step={1000} placeholder="ex.: 185000" className={INPUT_CLS}/>
        </Field>
      </div>

      <Field label="Observações">
        <textarea value={observacoes} onChange={e => setObservacoes(e.target.value)}
                  rows={2} className={TEXTAREA_CLS}/>
      </Field>

      <Button type="submit" variant="primary" loading={saving} disabled={saving}>
        {saved ? '✓ Salvo!' : 'Salvar alterações'}
      </Button>
    </form>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export function OportunidadeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const numId  = Number(id);

  const { data: op, loading, error, refetch } = useApi<OportunidadeDetalhe>(
    () => api.oportunidades.get(numId) as Promise<OportunidadeDetalhe>,
    [numId],
  );

  const handleMudarEstagio = async (estagio: EstagioOportunidade, motivo?: string) => {
    await api.oportunidades.patchEstagio(numId, {
      estagio,
      ...(motivo ? { motivo_perda: motivo } : {}),
    });
    refetch();
  };

  if (loading) return <LoadingSpinner fullPage label="Carregando oportunidade…"/>;
  if (error)   return <div className="p-5"><ErrorBanner message={error} onRetry={refetch}/></div>;
  if (!op)     return null;

  return (
    <div className="space-y-5 max-w-3xl">

      {/* Breadcrumb */}
      <nav className="text-xs text-slate-500 flex items-center gap-1.5">
        <Link to="/oportunidades" className="hover:text-cyan-400 transition-colors">Oportunidades</Link>
        <span>/</span>
        <span className="text-slate-300 font-medium">Op. #{op.id}</span>
      </nav>

      {/* Header */}
      <div className="glass-card p-5 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-white leading-tight">
            {op.contato_nome ?? 'Sem nome'}
          </h1>
          <p className="text-slate-400 text-sm mt-0.5 font-mono">
            {op.contato_telefone}
            {op.empreendimento_nome && (
              <span className="ml-2 not-mono font-sans text-slate-500">· {op.empreendimento_nome}</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={ESTAGIOS_CORES[op.estagio]}>
            {ESTAGIOS_LABELS[op.estagio]}
          </Badge>
          <Badge className={PRIORIDADE_CORES[op.prioridade]}>
            {PRIORIDADE_LABELS[op.prioridade]}
          </Badge>
          {op.valor_negocio && (
            <span className="text-sm font-semibold text-slate-200">
              {op.valor_negocio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          )}
        </div>
      </div>

      {/* Links rápidos */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <Link to={`/contatos/${op.contato_id}`}
              className="glass-card glass-card-hover flex items-center gap-2 px-4 py-3 text-slate-300 hover:text-cyan-300 transition-colors">
          <span className="text-base">👤</span>
          <span className="font-medium">Ver contato</span>
          <span className="ml-auto text-slate-600">→</span>
        </Link>
        {op.lead_id && (
          <Link to={`/leads/${op.lead_id}`}
                className="glass-card glass-card-hover flex items-center gap-2 px-4 py-3 text-slate-300 hover:text-cyan-300 transition-colors">
            <span className="text-base">📋</span>
            <span className="font-medium">Ver lead original</span>
            <span className="ml-auto text-slate-600">→</span>
          </Link>
        )}
      </div>

      {/* Pipeline — mover estágio */}
      <div className="glass-card p-5 space-y-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          Pipeline — Mover Estágio
        </h2>
        <SeletorEstagio atual={op.estagio} onMudar={handleMudarEstagio}/>
      </div>

      {/* Responsável & dados */}
      <div className="glass-card p-5 space-y-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          Responsável & Dados
        </h2>
        <EditResponsavel op={op} onSaved={refetch}/>
      </div>

      {/* Registrar interação */}
      <div className="glass-card p-5 space-y-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
          Registrar Interação
        </h2>
        <NovaInteracaoForm
          oportunidadeId={numId}
          contatoId={op.contato_id}
          onSaved={refetch}
        />
      </div>

      {/* Histórico de interações */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Histórico de Interações
          </h2>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/20">
            {op.interacoes?.length ?? 0}
          </span>
        </div>

        {!op.interacoes?.length ? (
          <p className="text-sm text-slate-500">Nenhuma interação registrada nesta oportunidade.</p>
        ) : (
          <ul className="space-y-4">
            {op.interacoes.map(inter => (
              <li key={inter.id} className="flex gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 mt-0.5"
                     style={{ background: 'rgba(0,229,255,0.07)', border: '1px solid rgba(0,229,255,0.12)' }}>
                  {TIPO_INTERACAO_LABELS[inter.tipo]?.split(' ')[0] ?? '💬'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-slate-200">
                      {TIPO_INTERACAO_LABELS[inter.tipo] ?? inter.tipo}
                    </span>
                    {inter.direcao !== 'interno' && (
                      <span className="text-[11px] text-slate-500">
                        {inter.direcao === 'entrada' ? '← entrada' : '→ saída'}
                      </span>
                    )}
                    {inter.usuario_nome && (
                      <span className="text-[11px] text-slate-500">por {inter.usuario_nome}</span>
                    )}
                    <span className="text-[11px] text-slate-600 ml-auto shrink-0">
                      {new Date(inter.created_at).toLocaleString('pt-BR', {
                        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">{inter.conteudo}</p>
                  {inter.duracao_seg && (
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Duração: {Math.floor(inter.duracao_seg / 60)}min {inter.duracao_seg % 60}s
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex">
        <Link to="/oportunidades" className="text-xs text-slate-500 hover:text-cyan-400 transition-colors">
          ← Voltar para Oportunidades
        </Link>
      </div>
    </div>
  );
}
