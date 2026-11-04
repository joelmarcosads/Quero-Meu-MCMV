import { useState } from 'react';
import type { ReactNode, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useApi } from '../hooks/useApi';
import {
  Card, LoadingSpinner, ErrorBanner, Badge, Button,
} from '../components/ui';
import type { Contato, Oportunidade, Interacao } from '../types';
import { ESTAGIOS_LABELS, ESTAGIOS_CORES, TIPO_INTERACAO_LABELS } from '../lib/constants';

interface ContatoDetalhe extends Contato {
  oportunidades: Oportunidade[];
  interacoes_recentes: Interacao[];
}

// ─── Formulário de edição inline ──────────────────────────────────────────────
interface EditFormProps {
  contato: Contato;
  onSave: (fields: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}

function EditForm({ contato, onSave, onCancel }: EditFormProps) {
  const [nome, setNome] = useState(contato.nome ?? '');
  const [email, setEmail] = useState(contato.email ?? '');
  const [cidade, setCidade] = useState(contato.cidade ?? '');
  const [bairro, setBairro] = useState(contato.bairro ?? '');
  const [profissao, setProfissao] = useState(contato.profissao ?? '');
  const [rendaFaixa, setRendaFaixa] = useState(contato.renda_faixa ?? '');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      await onSave({
        nome: nome || null,
        email: email || null,
        cidade: cidade || null,
        bairro: bairro || null,
        profissao: profissao || null,
        renda_faixa: rendaFaixa || null,
      });
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {err && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
          {err}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Nome">
          <input
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
          />
        </Field>
        <Field label="E-mail">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
          />
        </Field>
        <Field label="Cidade">
          <input
            type="text"
            value={cidade}
            onChange={e => setCidade(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
          />
        </Field>
        <Field label="Bairro">
          <input
            type="text"
            value={bairro}
            onChange={e => setBairro(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
          />
        </Field>
        <Field label="Profissão">
          <input
            type="text"
            value={profissao}
            onChange={e => setProfissao(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
          />
        </Field>
        <Field label="Faixa de Renda">
          <select
            value={rendaFaixa}
            onChange={e => setRendaFaixa(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 bg-white"
          >
            <option value="">Não informado</option>
            <option value="ate_2sm">Até 2 salários mínimos</option>
            <option value="2a4sm">2 a 4 salários mínimos</option>
            <option value="4a6sm">4 a 6 salários mínimos</option>
            <option value="acima_6sm">Acima de 6 salários mínimos</option>
          </select>
        </Field>
      </div>

      <div className="pt-1 text-xs text-gray-400">
        ⚠️ O telefone não pode ser alterado por aqui (identificador único do contato).
      </div>

      <div className="flex gap-3 pt-1">
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? 'Salvando…' : 'Salvar alterações'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

// ─── Formulário de nova interação ─────────────────────────────────────────────
interface NovaInteracaoFormProps {
  contatoId: number;
  onSaved: () => void;
}

function NovaInteracaoForm({ contatoId, onSaved }: NovaInteracaoFormProps) {
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
      await api.interacoes.create({ contato_id: contatoId, tipo, direcao, conteudo });
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
            <option value="entrada">Entrada (cliente nos contactou)</option>
            <option value="saida">Saída (nós contactamos)</option>
            <option value="interno">Interno (anotação)</option>
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

// ─── Página principal ─────────────────────────────────────────────────────────
export function ContatoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const numId = Number(id);
  const [editing, setEditing] = useState(false);

  const { data: contato, loading, error, refetch } = useApi<ContatoDetalhe>(
    () => api.contatos.get(numId) as Promise<ContatoDetalhe>,
    [numId],
  );

  const handleSave = async (fields: Record<string, unknown>) => {
    await api.contatos.patch(numId, fields);
    setEditing(false);
    refetch();
  };

  if (loading) return <LoadingSpinner />;
  if (error)   return <ErrorBanner message={error} onRetry={refetch} />;
  if (!contato) return null;

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500">
        <Link to="/contatos" className="hover:text-[#1e3a5f]">Contatos</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">{contato.nome ?? contato.telefone}</span>
      </nav>

      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-[#1e3a5f]">
            {contato.nome ?? 'Sem nome'}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{contato.telefone}</p>
        </div>
        {!editing && (
          <Button variant="secondary" onClick={() => setEditing(true)}>
            ✏️ Editar dados
          </Button>
        )}
      </div>

      {/* Dados / Formulário */}
      <Card className="p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Dados do Contato
        </h2>

        {editing ? (
          <EditForm contato={contato} onSave={handleSave} onCancel={() => setEditing(false)} />
        ) : (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <Row label="Nome">{contato.nome ?? <Vazio />}</Row>
            <Row label="Telefone">
              <span className="font-mono">{contato.telefone}</span>
            </Row>
            <Row label="E-mail">{contato.email ?? <Vazio />}</Row>
            <Row label="Cidade">{contato.cidade ?? <Vazio />}</Row>
            <Row label="Bairro">{contato.bairro ?? <Vazio />}</Row>
            <Row label="Profissão">{contato.profissao ?? <Vazio />}</Row>
            <Row label="Faixa de renda">
              {contato.renda_faixa
                ? contato.renda_faixa.replace(/_/g, ' ')
                : <Vazio />}
            </Row>
            <Row label="Cadastro">
              {new Date(contato.created_at).toLocaleDateString('pt-BR')}
            </Row>
          </dl>
        )}
      </Card>

      {/* Oportunidades */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Oportunidades
          </h2>
          <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
            {contato.oportunidades?.length ?? 0}
          </span>
        </div>

        {!contato.oportunidades?.length ? (
          <p className="text-sm text-gray-400">Nenhuma oportunidade registrada.</p>
        ) : (
          <div className="space-y-2">
            {contato.oportunidades.map(op => (
              <div
                key={op.id}
                className="flex items-center justify-between gap-3 py-2.5 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={ESTAGIOS_CORES[op.estagio]}>
                    {ESTAGIOS_LABELS[op.estagio]}
                  </Badge>
                  {op.empreendimento_nome && (
                    <span className="text-sm text-gray-600">{op.empreendimento_nome}</span>
                  )}
                  {op.valor_negocio && (
                    <span className="text-xs text-gray-500">
                      {op.valor_negocio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  )}
                </div>
                <Link
                  to={`/oportunidades/${op.id}`}
                  className="text-xs font-medium text-[#1e3a5f] hover:underline shrink-0"
                >
                  Ver →
                </Link>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Nova interação */}
      <Card className="p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Registrar Interação
        </h2>
        <NovaInteracaoForm contatoId={numId} onSaved={refetch} />
      </Card>

      {/* Histórico de interações recentes */}
      <Card className="p-5 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Histórico Recente
        </h2>

        {!contato.interacoes_recentes?.length ? (
          <p className="text-sm text-gray-400">Nenhuma interação registrada.</p>
        ) : (
          <ul className="space-y-3">
            {contato.interacoes_recentes.map(inter => (
              <li key={inter.id} className="flex gap-3 text-sm">
                <span className="text-lg leading-none mt-0.5">
                  {TIPO_INTERACAO_LABELS[inter.tipo]?.split(' ')[0] ?? '💬'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-gray-700">
                      {TIPO_INTERACAO_LABELS[inter.tipo] ?? inter.tipo}
                    </span>
                    {inter.usuario_nome && (
                      <span className="text-xs text-gray-400">por {inter.usuario_nome}</span>
                    )}
                    <span className="text-xs text-gray-400 ml-auto">
                      {new Date(inter.created_at).toLocaleString('pt-BR', {
                        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1 leading-snug">{inter.conteudo}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="flex justify-end">
        <Link to="/contatos" className="text-sm text-gray-500 hover:text-[#1e3a5f]">
          ← Voltar para Contatos
        </Link>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex gap-2">
      <dt className="text-gray-500 w-32 shrink-0 text-xs font-medium pt-0.5">{label}</dt>
      <dd className="text-gray-800">{children}</dd>
    </div>
  );
}

function Vazio() {
  return <span className="text-gray-300 text-xs italic">não informado</span>;
}
