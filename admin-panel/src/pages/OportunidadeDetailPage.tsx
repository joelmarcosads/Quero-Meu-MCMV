import { useState } from 'react';
import type { ReactNode, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useApi } from '../hooks/useApi';
import {
  Card, LoadingSpinner, ErrorBanner, Badge, Button,
} from '../components/ui';
import type { Oportunidade, Interacao, EstagioOportunidade } from '../types';
import {
  ESTAGIOS_LABELS, ESTAGIOS_CORES, ESTAGIOS_ORDEM,
  PRIORIDADE_LABELS, PRIORIDADE_CORES, TIPO_INTERACAO_LABELS,
} from '../lib/constants';
import { useAuth } from '../hooks/useAuth';

interface OportunidadeDetalhe extends Oportunidade {
  interacoes: Interacao[];
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
          const isAtual = estagio === atual;
          const isSelecionado = estagio === selecionado;
          const isFechado = estagio === 'fechado_ganho' || estagio === 'fechado_perdido';

          return (
            <button
              key={estagio}
              onClick={() => setSelecionado(estagio)}
              className={[
                'flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-left',
                isSelecionado
                  ? 'border-[#1e3a5f] bg-[#1e3a5f] text-white shadow-sm'
                  : isAtual
                    ? 'border-blue-200 bg-blue-50 text-blue-700'
                    : isFechado
                      ? 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-300'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50',
              ].join(' ')}
            >
              <span className="text-xs text-current opacity-60">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <span>{ESTAGIOS_LABELS[estagio]}</span>
            </button>
          );
        })}
      </div>

      {/* Campo de motivo (fechado perdido) */}
      {precisaMotivo && mudou && (
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Motivo da perda <span className="text-red-500">*</span>
          </label>
          <textarea
            value={motivo}
            onChange={e => setMotivo(e.target.value)}
            rows={2}
            placeholder="Ex.: cliente adquiriu imóvel com outro corretor…"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 resize-none"
          />
        </div>
      )}

      {err && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
          {err}
        </div>
      )}

      {mudou && (
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={handleConfirmar}
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
  const [tipo, setTipo] = useState('anotacao');
  const [direcao, setDirecao] = useState('interno');
  const [conteudo, setConteudo] = useState('');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

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
      {err && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
          {err}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Tipo</label>
          <select
            value={tipo}
            onChange={e => setTipo(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
          >
            {(['ligacao','whatsapp','email','visita','anotacao'] as const).map(t => (
              <option key={t} value={t}>{TIPO_INTERACAO_LABELS[t]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Direção</label>
          <select
            value={direcao}
            onChange={e => setDirecao(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
          >
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
            <option value="interno">Interno</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Conteúdo</label>
        <textarea
          value={conteudo}
          onChange={e => setConteudo(e.target.value)}
          rows={3}
          placeholder="Descreva a interação…"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 resize-none"
          required
        />
      </div>
      <Button type="submit" variant="primary" disabled={saving || !conteudo.trim()}>
        {saving ? 'Registrando…' : 'Registrar interação'}
      </Button>
    </form>
  );
}

// ─── Painel de edição de responsável ─────────────────────────────────────────
interface EditResponsavelProps {
  op: Oportunidade;
  onSaved: () => void;
}

function EditResponsavel({ op, onSaved }: EditResponsavelProps) {
  const { user } = useAuth();
  const isAdmin = user?.perfil === 'admin';

  const { data: usuarios } = useApi(
    () => isAdmin ? api.usuarios.list() as Promise<{ usuarios: Array<{ id: number; nome: string; perfil: string }> }> : Promise.resolve(null),
    [isAdmin],
  );

  const [responsavelId, setResponsavelId] = useState<number | null>(op.responsavel_id);
  const [valor, setValor] = useState(op.valor_negocio ?? '');
  const [observacoes, setObservacoes] = useState(op.observacoes ?? '');
  const [prioridade, setPrioridade] = useState(op.prioridade);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

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
      {err && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
          {err}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {isAdmin && usuarios && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Responsável</label>
            <select
              value={responsavelId ?? ''}
              onChange={e => setResponsavelId(e.target.value ? Number(e.target.value) : null)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
            >
              <option value="">Sem responsável</option>
              {(usuarios as { usuarios: Array<{ id: number; nome: string; perfil: string }> }).usuarios.map(u => (
                <option key={u.id} value={u.id}>{u.nome} ({u.perfil})</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Prioridade</label>
          <select
            value={prioridade}
            onChange={e => setPrioridade(e.target.value as Oportunidade['prioridade'])}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
          >
            {(['baixa', 'media', 'alta', 'urgente'] as const).map(p => (
              <option key={p} value={p}>{PRIORIDADE_LABELS[p]}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Valor do negócio (R$)</label>
          <input
            type="number"
            value={valor}
            onChange={e => setValor(e.target.value)}
            min={0}
            step={1000}
            placeholder="ex.: 185000"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Observações</label>
        <textarea
          value={observacoes}
          onChange={e => setObservacoes(e.target.value)}
          rows={2}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 resize-none"
        />
      </div>

      <Button type="submit" variant="primary" disabled={saving}>
        {saving ? 'Salvando…' : saved ? '✓ Salvo!' : 'Salvar'}
      </Button>
    </form>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export function OportunidadeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const numId = Number(id);

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

  if (loading) return <LoadingSpinner />;
  if (error)   return <ErrorBanner message={error} onRetry={refetch} />;
  if (!op)     return null;

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500">
        <Link to="/oportunidades" className="hover:text-[#1e3a5f]">Oportunidades</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Op. #{op.id}</span>
      </nav>

      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-[#1e3a5f]">
            {op.contato_nome ?? 'Sem nome'}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {op.contato_telefone}
            {op.empreendimento_nome && (
              <span className="ml-2 text-gray-400">· {op.empreendimento_nome}</span>
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
            <span className="text-sm font-semibold text-gray-700">
              {op.valor_negocio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          )}
        </div>
      </div>

      {/* Mudar estágio */}
      <Card className="p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Pipeline — Mover Estágio
        </h2>
        <SeletorEstagio atual={op.estagio} onMudar={handleMudarEstagio} />
      </Card>

      {/* Links rápidos */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <Link
          to={`/contatos/${op.contato_id}`}
          className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-[#1e3a5f] hover:text-[#1e3a5f] transition-colors"
        >
          <span>👤</span>
          <span>Ver contato</span>
          <span className="ml-auto text-gray-400">→</span>
        </Link>
        {op.lead_id && (
          <Link
            to={`/leads/${op.lead_id}`}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-[#1e3a5f] hover:text-[#1e3a5f] transition-colors"
          >
            <span>📋</span>
            <span>Ver lead original</span>
            <span className="ml-auto text-gray-400">→</span>
          </Link>
        )}
      </div>

      {/* Dados e responsável */}
      <Card className="p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Responsável & Dados
        </h2>
        <EditResponsavel op={op} onSaved={refetch} />
      </Card>

      {/* Registrar interação */}
      <Card className="p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Registrar Interação
        </h2>
        <NovaInteracaoForm
          oportunidadeId={numId}
          contatoId={op.contato_id}
          onSaved={refetch}
        />
      </Card>

      {/* Histórico de interações */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Histórico de Interações
          </h2>
          <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
            {op.interacoes?.length ?? 0}
          </span>
        </div>

        {!op.interacoes?.length ? (
          <p className="text-sm text-gray-400">Nenhuma interação registrada nesta oportunidade.</p>
        ) : (
          <ul className="space-y-3">
            {op.interacoes.map(inter => (
              <li key={inter.id} className="flex gap-3 text-sm border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <span className="text-lg leading-none mt-0.5">
                  {TIPO_INTERACAO_LABELS[inter.tipo]?.split(' ')[0] ?? '💬'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-700">
                      {TIPO_INTERACAO_LABELS[inter.tipo] ?? inter.tipo}
                    </span>
                    {inter.direcao !== 'interno' && (
                      <span className="text-xs text-gray-400">
                        {inter.direcao === 'entrada' ? '← entrada' : '→ saída'}
                      </span>
                    )}
                    {inter.usuario_nome && (
                      <span className="text-xs text-gray-400">por {inter.usuario_nome}</span>
                    )}
                    <span className="text-xs text-gray-400 ml-auto shrink-0">
                      {new Date(inter.created_at).toLocaleString('pt-BR', {
                        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1 leading-snug">{inter.conteudo}</p>
                  {inter.duracao_seg && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Duração: {Math.floor(inter.duracao_seg / 60)}min {inter.duracao_seg % 60}s
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="flex justify-end">
        <Link to="/oportunidades" className="text-sm text-gray-500 hover:text-[#1e3a5f]">
          ← Voltar para Oportunidades
        </Link>
      </div>
    </div>
  );
}
