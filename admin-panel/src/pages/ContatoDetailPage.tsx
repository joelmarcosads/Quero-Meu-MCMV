import { useState } from 'react';
import type { ReactNode, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useApi } from '../hooks/useApi';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorBanner }    from '../components/ui/ErrorBanner';
import { Badge }          from '../components/ui/Badge';
import { Button }         from '../components/ui/Button';
import type { Contato, Oportunidade, Interacao } from '../types';
import { ESTAGIOS_LABELS, ESTAGIOS_CORES, TIPO_INTERACAO_LABELS } from '../lib/constants';

interface ContatoDetalhe extends Contato {
  oportunidades: Oportunidade[];
  interacoes_recentes: Interacao[];
}

// ─── Input / Select / Textarea dark-theme ────────────────────────────────────
const INPUT_CLS = 'w-full h-9 px-3 rounded-lg text-sm bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20';
const SELECT_CLS = `${INPUT_CLS} appearance-none`;

// ─── EditForm ─────────────────────────────────────────────────────────────────
interface EditFormProps {
  contato: Contato;
  onSave: (fields: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
}

function EditForm({ contato, onSave, onCancel }: EditFormProps) {
  const [nome,       setNome]       = useState(contato.nome ?? '');
  const [email,      setEmail]      = useState(contato.email ?? '');
  const [cidade,     setCidade]     = useState(contato.cidade ?? '');
  const [bairro,     setBairro]     = useState(contato.bairro ?? '');
  const [profissao,  setProfissao]  = useState(contato.profissao ?? '');
  const [rendaFaixa, setRendaFaixa] = useState(contato.renda_faixa ?? '');
  const [saving, setSaving]         = useState(false);
  const [err, setErr]               = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true); setErr(null);
    try {
      await onSave({ nome: nome || null, email: email || null, cidade: cidade || null,
                     bairro: bairro || null, profissao: profissao || null, renda_faixa: rendaFaixa || null });
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'Erro ao salvar');
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {err && <ErrorBanner message={err}/>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Nome">
          <input type="text" value={nome} onChange={e => setNome(e.target.value)} className={INPUT_CLS}/>
        </Field>
        <Field label="E-mail">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={INPUT_CLS}/>
        </Field>
        <Field label="Cidade">
          <input type="text" value={cidade} onChange={e => setCidade(e.target.value)} className={INPUT_CLS}/>
        </Field>
        <Field label="Bairro">
          <input type="text" value={bairro} onChange={e => setBairro(e.target.value)} className={INPUT_CLS}/>
        </Field>
        <Field label="Profissão">
          <input type="text" value={profissao} onChange={e => setProfissao(e.target.value)} className={INPUT_CLS}/>
        </Field>
        <Field label="Faixa de Renda">
          <select value={rendaFaixa} onChange={e => setRendaFaixa(e.target.value)} className={SELECT_CLS}
                  style={{ background: '#10223B' }}>
            <option value="">Não informado</option>
            <option value="ate_2sm">Até 2 salários mínimos</option>
            <option value="2a4sm">2 a 4 salários mínimos</option>
            <option value="4a6sm">4 a 6 salários mínimos</option>
            <option value="acima_6sm">Acima de 6 salários mínimos</option>
          </select>
        </Field>
      </div>
      <p className="text-xs text-slate-500">⚠️ O telefone não pode ser alterado (identificador único).</p>
      <div className="flex gap-3 pt-1">
        <Button type="submit" variant="primary" loading={saving}>Salvar alterações</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

// ─── NovaInteracaoForm ────────────────────────────────────────────────────────
interface NovaInteracaoFormProps { contatoId: number; onSaved: () => void; }

function NovaInteracaoForm({ contatoId, onSaved }: NovaInteracaoFormProps) {
  const [tipo,     setTipo]     = useState('anotacao');
  const [direcao,  setDirecao]  = useState('interno');
  const [conteudo, setConteudo] = useState('');
  const [saving,   setSaving]   = useState(false);
  const [err,      setErr]      = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!conteudo.trim()) return;
    setSaving(true); setErr(null);
    try {
      await api.interacoes.create({ contato_id: contatoId, tipo, direcao, conteudo });
      setConteudo('');
      onSaved();
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'Erro ao registrar');
    } finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {err && <ErrorBanner message={err}/>}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Tipo">
          <select value={tipo} onChange={e => setTipo(e.target.value)} className={SELECT_CLS}
                  style={{ background: '#10223B' }}>
            {(['ligacao','whatsapp','email','visita','anotacao'] as const).map(t => (
              <option key={t} value={t}>{TIPO_INTERACAO_LABELS[t]}</option>
            ))}
          </select>
        </Field>
        <Field label="Direção">
          <select value={direcao} onChange={e => setDirecao(e.target.value)} className={SELECT_CLS}
                  style={{ background: '#10223B' }}>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
            <option value="interno">Interno</option>
          </select>
        </Field>
      </div>
      <Field label="Conteúdo">
        <textarea value={conteudo} onChange={e => setConteudo(e.target.value)} rows={3} required
                  placeholder="Descreva a interação…"
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-slate-200 placeholder-slate-500 outline-none resize-none transition-all focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20"/>
      </Field>
      <Button type="submit" variant="primary" loading={saving} disabled={!conteudo.trim()}>
        Registrar interação
      </Button>
    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function ContatoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const numId  = Number(id);
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

  if (loading) return <LoadingSpinner fullPage label="Carregando contato…"/>;
  if (error)   return <div className="p-5"><ErrorBanner message={error} onRetry={refetch}/></div>;
  if (!contato) return null;

  return (
    <div className="space-y-5 max-w-3xl">

      <nav className="text-xs text-slate-500 flex items-center gap-1.5">
        <Link to="/contatos" className="hover:text-cyan-400 transition-colors">Contatos</Link>
        <span>/</span>
        <span className="text-slate-300 font-medium">{contato.nome ?? contato.telefone}</span>
      </nav>

      {/* Header */}
      <div className="glass-card p-5 flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold text-white shrink-0"
               style={{ background: 'linear-gradient(135deg, #00E5FF, #0077FF)', boxShadow: '0 0 14px rgba(0,229,255,0.30)' }}>
            {contato.nome?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-tight">{contato.nome ?? 'Sem nome'}</h1>
            <p className="text-slate-400 text-sm mt-0.5 font-mono">{contato.telefone}</p>
          </div>
        </div>
        {!editing && (
          <Button variant="secondary" onClick={() => setEditing(true)} size="sm">
            ✏️ Editar
          </Button>
        )}
      </div>

      {/* Dados / Formulário */}
      <div className="glass-card p-5 space-y-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Dados do Contato</h2>
        {editing ? (
          <EditForm contato={contato} onSave={handleSave} onCancel={() => setEditing(false)}/>
        ) : (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <Row label="Nome">{contato.nome ?? <Vazio/>}</Row>
            <Row label="Telefone"><span className="font-mono">{contato.telefone}</span></Row>
            <Row label="E-mail">{contato.email ?? <Vazio/>}</Row>
            <Row label="Cidade">{contato.cidade ?? <Vazio/>}</Row>
            <Row label="Bairro">{contato.bairro ?? <Vazio/>}</Row>
            <Row label="Profissão">{contato.profissao ?? <Vazio/>}</Row>
            <Row label="Faixa de renda">
              {contato.renda_faixa ? contato.renda_faixa.replace(/_/g, ' ') : <Vazio/>}
            </Row>
            <Row label="Cadastro">{new Date(contato.created_at).toLocaleDateString('pt-BR')}</Row>
          </dl>
        )}
      </div>

      {/* Oportunidades */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Oportunidades</h2>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/20">
            {contato.oportunidades?.length ?? 0}
          </span>
        </div>

        {!contato.oportunidades?.length ? (
          <p className="text-sm text-slate-500">Nenhuma oportunidade registrada.</p>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {contato.oportunidades.map(op => (
              <div key={op.id} className="flex items-center justify-between gap-3 py-3 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={ESTAGIOS_CORES[op.estagio]}>{ESTAGIOS_LABELS[op.estagio]}</Badge>
                  {op.empreendimento_nome && (
                    <span className="text-sm text-slate-400">{op.empreendimento_nome}</span>
                  )}
                  {op.valor_negocio && (
                    <span className="text-xs text-slate-400">
                      {op.valor_negocio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  )}
                </div>
                <Link to={`/oportunidades/${op.id}`}
                      className="text-xs font-medium text-slate-500 hover:text-cyan-400 transition-colors shrink-0">
                  Ver →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nova interação */}
      <div className="glass-card p-5 space-y-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Registrar Interação</h2>
        <NovaInteracaoForm contatoId={numId} onSaved={refetch}/>
      </div>

      {/* Histórico */}
      <div className="glass-card p-5 space-y-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Histórico Recente</h2>

        {!contato.interacoes_recentes?.length ? (
          <p className="text-sm text-slate-500">Nenhuma interação registrada.</p>
        ) : (
          <ul className="space-y-4">
            {contato.interacoes_recentes.map(inter => (
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
                    {inter.usuario_nome && (
                      <span className="text-[11px] text-slate-500">por {inter.usuario_nome}</span>
                    )}
                    <span className="text-[11px] text-slate-600 ml-auto">
                      {new Date(inter.created_at).toLocaleString('pt-BR', {
                        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">{inter.conteudo}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex">
        <Link to="/contatos" className="text-xs text-slate-500 hover:text-cyan-400 transition-colors">
          ← Voltar para Contatos
        </Link>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex gap-3 text-sm">
      <dt className="text-slate-500 w-28 shrink-0 text-xs font-medium leading-relaxed pt-0.5">{label}</dt>
      <dd className="text-slate-200 leading-relaxed">{children}</dd>
    </div>
  );
}

function Vazio() {
  return <span className="text-slate-600 text-xs italic">não informado</span>;
}
