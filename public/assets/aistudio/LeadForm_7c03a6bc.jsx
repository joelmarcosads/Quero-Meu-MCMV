import { useRef, useState } from 'react';

// ====== CONFIGURAÇÃO ======
const CONFIG = {
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzdjbC0ZWboJtR_9oGIdwvX7X7ERQ_O4n0Slvlnig2GtoQCyYuHDG1xmLhPIoBhvwvACQ/exec',
  WHATSAPP: '55DDDNUMERO', // DDI + DDD + número, só dígitos
  THANKS_PATH: '/obrigado',
};
// ==========================

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;700&display=swap');
#lead-box{--ink:#14293d;--sea:#1b6f66;--sea-dark:#14554e;--line:#c9d6d4;--warn:#b3261e;--sun:#f0b44c;
  font-family:'Figtree',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--ink);
  max-width:560px;margin:0 auto;padding:28px 22px;background:#fff;border:1px solid var(--line);
  border-radius:16px;box-sizing:border-box}
#lead-box *{box-sizing:border-box}
#lead-box h2{margin:0 0 6px;font-size:1.5rem;line-height:1.2}
#lead-box .sub{margin:0 0 22px;color:#44586a;line-height:1.5}
#lead-box .row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
#lead-box .field{margin-bottom:14px}
#lead-box label,#lead-box legend{display:block;font-weight:700;font-size:.92rem;margin-bottom:6px;padding:0}
#lead-box input[type=text],#lead-box input[type=tel],#lead-box input[type=email],#lead-box select{
  width:100%;padding:12px;font:inherit;color:var(--ink);background:#fff;border:1.5px solid var(--line);border-radius:10px}
#lead-box input:focus,#lead-box select:focus{outline:3px solid var(--sun);outline-offset:1px;border-color:var(--sea)}
#lead-box .invalid{border-color:var(--warn)!important}
#lead-box .err{color:var(--warn);font-size:.82rem;margin-top:4px}
#lead-box fieldset{border:0;margin:0 0 14px;padding:0}
#lead-box .chips{display:flex;flex-wrap:wrap;gap:8px}
#lead-box .chips input{position:absolute;opacity:0;pointer-events:none}
#lead-box .chips span{display:inline-block;padding:9px 14px;border:1.5px solid var(--line);border-radius:999px;cursor:pointer;font-size:.92rem;background:#fff}
#lead-box .chips input:checked + span{background:var(--sea);border-color:var(--sea);color:#fff}
#lead-box .chips input:focus-visible + span{outline:3px solid var(--sun);outline-offset:2px}
#lead-box .consent{display:flex;gap:10px;align-items:flex-start;font-size:.82rem;color:#44586a;line-height:1.45;margin:6px 0 8px;font-weight:400}
#lead-box .consent input{margin-top:3px;width:18px;height:18px;flex:none}
#lead-box .hp{position:absolute;left:-9999px;height:0;overflow:hidden}
#lead-box button.cta{width:100%;padding:15px;margin-top:10px;border:0;border-radius:12px;background:var(--sea);color:#fff;
  font:inherit;font-weight:700;font-size:1.02rem;cursor:pointer;transition:background .15s}
#lead-box button.cta:hover{background:var(--sea-dark)}
#lead-box button.cta:disabled{opacity:.6;cursor:wait}
#lead-box .fail{margin-top:12px;color:var(--warn);font-size:.9rem;text-align:center}
@media(max-width:480px){#lead-box .row{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){#lead-box *{transition:none!important}}
`;

const CIDADES = ['Niterói', 'São Gonçalo', 'Itaboraí', 'Ainda não sei'];
const PAGAMENTOS = ['Financiamento', 'Minha Casa Minha Vida', 'FGTS + entrada', 'À vista'];
const FAIXAS = ['Até R$ 200 mil', 'R$ 200 a 300 mil', 'R$ 300 a 450 mil', 'R$ 450 a 700 mil', 'Acima de R$ 700 mil'];
const QUARTOS = ['1 quarto', '2 quartos', '3 quartos', '4 ou mais'];
const PRIMEIRA = ['Sim', 'Não, já tive outro', 'É para investir'];
const PRAZOS = ['O quanto antes', 'Em até 3 meses', 'Em 3 a 6 meses', 'Só pesquisando'];

function maskPhone(v) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length > 6) {
    const cut = d.length > 10 ? 7 : 6;
    return `(${d.slice(0, 2)}) ${d.slice(2, cut)}-${d.slice(cut)}`;
  }
  if (d.length > 2) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return d;
}

function Chips({ name, options, value, onChange }) {
  return (
    <div className="chips">
      {options.map((o) => (
        <label key={o}>
          <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} />
          <span>{o}</span>
        </label>
      ))}
    </div>
  );
}

function Select({ id, label, options, value, onChange, error, msg }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={error ? 'invalid' : ''}>
        <option value="">Selecione</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      {error && <div className="err">{msg}</div>}
    </div>
  );
}

export default function LeadForm() {
  const [v, setV] = useState({
    nome: '', whatsapp: '', email: '', cidade: '', faixa: '', quartos: '',
    pagamento: '', primeira_compra: '', prazo: '', lgpd: false, website: '',
  });
  const [errs, setErrs] = useState({});
  const [sending, setSending] = useState(false);
  const [fail, setFail] = useState(false);
  const t0 = useRef(Date.now());

  const set = (k) => (val) => setV((s) => ({ ...s, [k]: val }));

  function validate() {
    const e = {};
    if (v.nome.trim().length < 2) e.nome = 'Informe seu nome.';
    if (v.whatsapp.replace(/\D/g, '').length < 10) e.whatsapp = 'Digite DDD + número.';
    if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'E-mail inválido.';
    if (!v.cidade) e.cidade = 'Escolha uma opção.';
    if (!v.pagamento) e.pagamento = 'Escolha uma opção.';
    if (!v.faixa) e.faixa = 'Selecione a faixa.';
    if (!v.quartos) e.quartos = 'Selecione os quartos.';
    if (!v.primeira_compra) e.primeira_compra = 'Selecione uma opção.';
    if (!v.prazo) e.prazo = 'Selecione o prazo.';
    if (!v.lgpd) e.lgpd = 'É necessário autorizar para continuar.';
    setErrs(e);
    return e;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    setFail(false);
    const e = validate();
    if (Object.keys(e).length) {
      const first = document.querySelector('#lead-box .invalid, #lead-box .err');
      if (first && first.scrollIntoView) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    // Robô: preencheu a isca ou enviou rápido demais
    if (v.website || Date.now() - t0.current < 3000) return;

    const qs = new URLSearchParams(window.location.search);

    // ID único do lead (external_id): liga a linha da planilha ao evento de conversão
    const externalId =
      window.crypto && window.crypto.randomUUID
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    const data = new URLSearchParams({
      external_id: externalId,
      nome: v.nome.trim(),
      whatsapp: v.whatsapp.replace(/\D/g, ''),
      email: v.email.trim(),
      cidade: v.cidade,
      faixa: v.faixa,
      quartos: v.quartos,
      pagamento: v.pagamento,
      primeira_compra: v.primeira_compra,
      prazo: v.prazo,
      consentimento_lgpd: 'Sim',
      website: v.website,
      utm_source: qs.get('utm_source') || '',
      utm_medium: qs.get('utm_medium') || '',
      utm_campaign: qs.get('utm_campaign') || '',
      pagina: window.location.href.split('?')[0],
      referrer: document.referrer || '',
    });

    setSending(true);
    try {
      await fetch(CONFIG.SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: data });

      // Guarda dados para a página de obrigado (só no navegador, nada de dados pessoais na URL)
      const msg = `Olá! Sou ${v.nome.trim()}. Preenchi o formulário no site: busco imóvel em ${v.cidade}, ${v.quartos}, faixa ${v.faixa}.`;
      try {
        sessionStorage.setItem('lead_external_id', externalId);
        sessionStorage.setItem('lead_email', v.email.trim().toLowerCase());
        sessionStorage.setItem('lead_phone', `+55${v.whatsapp.replace(/\D/g, '')}`); // formato E.164
        sessionStorage.setItem('lead_nome', v.nome.trim().split(' ')[0]);
        sessionStorage.setItem('lead_wa', `https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(msg)}`);
        sessionStorage.removeItem('lead_convertido');
      } catch (_) {}

      window.location.href = CONFIG.THANKS_PATH;
    } catch (_) {
      setSending(false);
      setFail(true);
    }
  }

  const cls = (k) => (errs[k] ? 'invalid' : '');

  return (
    <section id="lead-box" aria-labelledby="lead-title">
      <style>{CSS}</style>
      <form onSubmit={onSubmit} noValidate>
        <h2 id="lead-title">Conte o que você procura</h2>
        <p className="sub">Respondo pelo WhatsApp com opções que cabem no seu bolso e no seu momento.</p>

        <div className="field">
          <label htmlFor="nome">Seu nome</label>
          <input type="text" id="nome" autoComplete="name" value={v.nome}
            onChange={(e) => set('nome')(e.target.value)} className={cls('nome')} />
          {errs.nome && <div className="err">{errs.nome}</div>}
        </div>

        <div className="row">
          <div className="field">
            <label htmlFor="whatsapp">WhatsApp com DDD</label>
            <input type="tel" id="whatsapp" inputMode="numeric" autoComplete="tel" placeholder="(21) 99999-9999"
              value={v.whatsapp} onChange={(e) => set('whatsapp')(maskPhone(e.target.value))} className={cls('whatsapp')} />
            {errs.whatsapp && <div className="err">{errs.whatsapp}</div>}
          </div>
          <div className="field">
            <label htmlFor="email">E-mail (opcional)</label>
            <input type="email" id="email" autoComplete="email" value={v.email}
              onChange={(e) => set('email')(e.target.value)} className={cls('email')} />
            {errs.email && <div className="err">{errs.email}</div>}
          </div>
        </div>

        <fieldset>
          <legend>Em qual cidade quer comprar?</legend>
          <Chips name="cidade" options={CIDADES} value={v.cidade} onChange={set('cidade')} />
          {errs.cidade && <div className="err">{errs.cidade}</div>}
        </fieldset>

        <div className="row">
          <Select id="faixa" label="Faixa de valor" options={FAIXAS} value={v.faixa}
            onChange={set('faixa')} error={errs.faixa} msg={errs.faixa} />
          <Select id="quartos" label="Quartos" options={QUARTOS} value={v.quartos}
            onChange={set('quartos')} error={errs.quartos} msg={errs.quartos} />
        </div>

        <fieldset>
          <legend>Como pretende pagar?</legend>
          <Chips name="pagamento" options={PAGAMENTOS} value={v.pagamento} onChange={set('pagamento')} />
          {errs.pagamento && <div className="err">{errs.pagamento}</div>}
        </fieldset>

        <div className="row">
          <Select id="primeira" label="É o primeiro imóvel?" options={PRIMEIRA} value={v.primeira_compra}
            onChange={set('primeira_compra')} error={errs.primeira_compra} msg={errs.primeira_compra} />
          <Select id="prazo" label="Quando quer comprar?" options={PRAZOS} value={v.prazo}
            onChange={set('prazo')} error={errs.prazo} msg={errs.prazo} />
        </div>

        {/* Campo isca contra robôs: humanos não veem nem preenchem */}
        <div className="hp" aria-hidden="true">
          <label>Não preencha
            <input type="text" tabIndex={-1} autoComplete="off" value={v.website}
              onChange={(e) => set('website')(e.target.value)} />
          </label>
        </div>

        <label className="consent">
          <input type="checkbox" checked={v.lgpd} onChange={(e) => set('lgpd')(e.target.checked)} />
          <span>Autorizo o contato por WhatsApp, e-mail ou telefone e o uso dos meus dados para atendimento imobiliário,
            conforme a LGPD (Lei 13.709/2018). Posso pedir a exclusão a qualquer momento.</span>
        </label>
        {errs.lgpd && <div className="err">{errs.lgpd}</div>}

        <button type="submit" className="cta" disabled={sending}>
          {sending ? 'Enviando...' : 'Quero receber opções de imóveis'}
        </button>
        {fail && <div className="fail">Não conseguimos enviar agora. Tente de novo ou chame direto no WhatsApp.</div>}
      </form>
    </section>
  );
}
