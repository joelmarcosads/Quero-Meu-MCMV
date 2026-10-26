import { useRef, useState } from 'react';

// ====== CONFIGURAÇÃO ======
const CONFIG = {
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzdjbC0ZWboJtR_9oGIdwvX7X7ERQ_O4n0Slvlnig2GtoQCyYuHDG1xmLhPIoBhvwvACQ/exec',
  WHATSAPP: '5521965928399', // DDI + DDD + número, só dígitos
  THANKS_PATH: '/obrigado',
};
// ==========================

// Formulário em 5 etapas (micro-compromissos):
// 1-4: perguntas de toque único, sem dado pessoal → baixa fricção, alto engajamento
// 5: contato (nome + WhatsApp; e-mail opcional) → pedido quando a pessoa já investiu esforço
// Campos enviados à planilha: os mesmos da versão anterior + renda e regime_trabalho.

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;700&display=swap');
#lead-box{--ink:#14293d;--sea:#1b6f66;--sea-dark:#14554e;--line:#c9d6d4;--warn:#b3261e;--sun:#f0b44c;--soft:#eef5f4;
  font-family:'Figtree',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--ink);
  max-width:560px;margin:0 auto;padding:26px 22px;background:#fff;border:1px solid var(--line);
  border-radius:16px;box-sizing:border-box}
#lead-box *{box-sizing:border-box}
#lead-box h2{margin:0 0 6px;font-size:1.5rem;line-height:1.2}
#lead-box .sub{margin:0 0 16px;color:#44586a;line-height:1.5}
#lead-box .progress{display:flex;gap:6px;margin:0 0 6px}
#lead-box .progress i{flex:1;height:6px;border-radius:9px;background:var(--line);transition:background .2s}
#lead-box .progress i.on{background:var(--sea)}
#lead-box .step-label{font-size:.8rem;font-weight:700;color:var(--sea);margin:0 0 14px;letter-spacing:.02em}
#lead-box .field{margin-bottom:14px}
#lead-box label.lb,#lead-box legend{display:block;font-weight:700;font-size:.95rem;margin-bottom:8px;padding:0}
#lead-box .opt{font-weight:400;color:#6b7c8c;font-size:.85rem}
#lead-box input[type=text],#lead-box input[type=tel],#lead-box input[type=email]{
  width:100%;padding:13px;font:inherit;font-size:16px;color:var(--ink);background:#fff;border:1.5px solid var(--line);border-radius:10px}
#lead-box input:focus{outline:3px solid var(--sun);outline-offset:1px;border-color:var(--sea)}
#lead-box .invalid{border-color:var(--warn)!important}
#lead-box .err{color:var(--warn);font-size:.84rem;margin-top:6px;font-weight:600}
#lead-box fieldset{border:0;margin:0 0 16px;padding:0;min-width:0}
#lead-box .chips{display:grid;grid-template-columns:1fr 1fr;gap:8px}
#lead-box .chips label{position:relative;display:block;margin:0}
#lead-box .chips input{position:absolute;opacity:0;pointer-events:none}
#lead-box .chips span{display:flex;align-items:center;justify-content:center;text-align:center;min-height:46px;padding:9px 10px;
  border:1.5px solid var(--line);border-radius:12px;cursor:pointer;font-size:.92rem;font-weight:500;background:#fff;transition:all .15s}
#lead-box .chips span:hover{border-color:var(--sea)}
#lead-box .chips-invalid span{border-color:var(--warn)!important}
#lead-box .chips input:checked + span{background:var(--sea);border-color:var(--sea);color:#fff;font-weight:700}
#lead-box .chips input:focus-visible + span{outline:3px solid var(--sun);outline-offset:2px}
#lead-box .consent{display:flex;gap:10px;align-items:flex-start;font-size:.8rem;color:#44586a;line-height:1.45;margin:4px 0 6px;font-weight:400;cursor:pointer}
#lead-box .consent input{margin-top:2px;width:18px;height:18px;flex:none;accent-color:var(--sea)}
#lead-box .hp{position:absolute;left:-9999px;height:0;overflow:hidden}
#lead-box button.cta{width:100%;padding:15px;margin-top:6px;border:0;border-radius:12px;background:var(--sea);color:#fff;
  font:inherit;font-weight:700;font-size:1.05rem;cursor:pointer;transition:background .15s}
#lead-box button.cta:hover{background:var(--sea-dark)}
#lead-box button.cta:disabled{opacity:.6;cursor:wait}
#lead-box button.back{display:block;width:100%;background:none;border:0;color:#5b6d7d;font:inherit;font-size:.9rem;margin-top:10px;cursor:pointer;padding:6px}
#lead-box .reward{background:var(--soft);border-radius:10px;padding:10px 12px;font-size:.88rem;line-height:1.45;margin:0 0 14px}
#lead-box .trust{text-align:center;font-size:.78rem;color:#6b7c8c;margin-top:10px}
#lead-box .fail{margin-top:12px;color:var(--warn);font-size:.9rem;text-align:center}
#lead-box .step{animation:leadIn .25s ease}
@keyframes leadIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){#lead-box *{transition:none!important;animation:none!important}}
`;

const CIDADES = ['Itaboraí', 'São Gonçalo', 'Niterói', 'Ainda não sei'];
const QUARTOS = ['1 quarto', '2 quartos', '3 quartos', '4 ou mais'];
// Faixas de renda alinhadas às faixas do MCMV 2026 (F1 até 3.200 · F2 até 5.000 · F3 até 9.600 · F4 até 13.000)
const RENDAS = ['Até R$ 1.800', 'R$ 1.800 a 2.500', 'R$ 2.500 a 3.200', 'R$ 3.200 a 5.000', 'R$ 5.000 a 9.600', 'Acima de R$ 9.600'];
const REGIMES = ['Carteira assinada', 'Funcionário público', 'Autônomo', 'Aposentado / pensionista'];
// Rendas que se enquadram nas Faixas 1 e 2 (com possibilidade de subsídio)
const RENDAS_COM_SUBSIDIO = RENDAS.slice(0, 4);
const PAGAMENTOS = ['Financiamento Imobiliário', 'à vista', 'Consórcio'];
const FAIXAS = ['Até R$ 200 mil', 'R$ 200 a 300 mil', 'R$ 300 a 450 mil', 'R$ 450 a 700 mil', 'Acima de R$ 700 mil'];
const PRIMEIRA = ['Sim', 'Não, já tive outro', 'É para investir'];
const PRAZOS = ['O quanto antes', 'Em até 3 meses', 'Em 3 a 6 meses', 'Só pesquisando'];

const TOTAL = 5;
const STEP_TEXT = {
  1: 'Etapa 1 de 5 · Seu próximo lar',
  2: 'Etapa 2 de 5 · Sua renda',
  3: 'Etapa 3 de 5 · Como você quer comprar',
  4: 'Etapa 4 de 5 · Seu momento',
  5: 'Última etapa · Para onde enviamos as opções',
};

function maskPhone(v) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length > 6) {
    const cut = d.length > 10 ? 7 : 6;
    return `(${d.slice(0, 2)}) ${d.slice(2, cut)}-${d.slice(cut)}`;
  }
  if (d.length > 2) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return d;
}

function push(obj) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(obj);
  } catch (_) {}
}

function Chips({ name, legend, options, value, onChange, error }) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      <div className={`chips ${error ? 'chips-invalid' : ''}`}>
        {options.map((o) => (
          <label key={o}>
            <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} />
            <span>{o}</span>
          </label>
        ))}
      </div>
      {error && <div className="err">{error}</div>}
    </fieldset>
  );
}

export default function LeadForm() {
  const [v, setV] = useState({
    nome: '', whatsapp: '', email: '', cidade: '', faixa: '', quartos: '',
    renda: '', regime_trabalho: '',
    pagamento: '', primeira_compra: '', prazo: '', lgpd: false, website: '',
  });
  const [step, setStep] = useState(1);
  const [errs, setErrs] = useState({});
  const [sending, setSending] = useState(false);
  const [fail, setFail] = useState(false);
  const t0 = useRef(Date.now());
  const started = useRef(false);
  const boxRef = useRef(null);

  const set = (k) => (val) => {
    if (!started.current) {
      started.current = true;
      push({ event: 'form_start', form_name: 'lead_home' });
    }
    setV((s) => ({ ...s, [k]: val }));
    if (errs[k]) {
      setErrs((prev) => {
        const next = { ...prev };
        delete next[k];
        return next;
      });
    }
  };

  // Valida só os campos da etapa atual
  function validateStep(s) {
    const e = {};
    if (s === 1) {
      if (!v.cidade) e.cidade = 'Escolha uma cidade para continuar.';
      if (!v.quartos) e.quartos = 'Escolha a quantidade de quartos.';
    }
    if (s === 2) {
      if (!v.renda) e.renda = 'Escolha a faixa de renda da família.';
      if (!v.regime_trabalho) e.regime_trabalho = 'Escolha como você trabalha hoje.';
    }
    if (s === 3) {
      if (!v.pagamento) e.pagamento = 'Escolha como pretende pagar.';
      if (!v.faixa) e.faixa = 'Escolha uma faixa de valor.';
    }
    if (s === 4) {
      if (!v.primeira_compra) e.primeira_compra = 'Responda para continuar.';
      if (!v.prazo) e.prazo = 'Escolha quando quer comprar.';
    }
    if (s === 5) {
      if (!v.nome || v.nome.trim().length < 2) e.nome = 'Informe seu nome.';
      if (!v.whatsapp || v.whatsapp.replace(/\D/g, '').length < 10) e.whatsapp = 'Informe seu WhatsApp com DDD.';
      if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) {
        e.email = 'Digite um e-mail válido (ex: seu@email.com) ou deixe em branco.';
      }
      if (!v.lgpd) e.lgpd = 'Marque a autorização para recebermos seu contato.';
    }
    setErrs(e);
    return e;
  }

  function goTo(n) {
    setStep(n);
    setErrs({});
    if (boxRef.current && boxRef.current.getBoundingClientRect().top < 0) {
      boxRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function next() {
    const e = validateStep(step);
    if (Object.keys(e).length) return;
    push({ event: 'form_step', form_name: 'lead_home', form_step: step + 1 });
    goTo(step + 1);
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    if (step < TOTAL) return next();
    setFail(false);
    const e = validateStep(TOTAL);
    if (Object.keys(e).length) return;

    // Robô: preencheu a isca ou enviou rápido demais
    if (v.website || Date.now() - t0.current < 3000) return;

    const qs = new URLSearchParams(window.location.search);

    // ID único do lead (external_id): liga a linha da planilha ao evento de conversão
    const externalId =
      window.crypto && window.crypto.randomUUID
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    const fromStore = (k) =>
      qs.get(k) ||
      (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(k)) ||
      (typeof localStorage !== 'undefined' && localStorage.getItem(k)) ||
      '';
    const utmSource = fromStore('utm_source');
    const utmMedium = fromStore('utm_medium');
    const utmCampaign = fromStore('utm_campaign');

    const email = v.email.trim();
    const fone = v.whatsapp.replace(/\D/g, '');

    const data = new URLSearchParams({
      external_id: externalId,
      nome: v.nome.trim(),
      whatsapp: fone,
      email,
      cidade: v.cidade,
      faixa: v.faixa,
      quartos: v.quartos,
      renda: v.renda,
      regime_trabalho: v.regime_trabalho,
      pagamento: v.pagamento,
      primeira_compra: v.primeira_compra,
      prazo: v.prazo,
      consentimento_lgpd: 'Sim',
      website: v.website,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      pagina: window.location.href.split('?')[0],
      referrer: document.referrer || '',
    });

    setSending(true);
    try {
      await fetch(CONFIG.SCRIPT_URL, { method: 'POST', mode: 'no-cors', body: data });

      // Guarda dados para a página de obrigado (só no navegador, nada de dados pessoais na URL)
      const msg = `Olá! Sou ${v.nome.trim()}. Preenchi o formulário no site: busco imóvel em ${v.cidade}, ${v.quartos}, faixa ${v.faixa}. Renda familiar: ${v.renda} (${v.regime_trabalho}).`;
      try {
        sessionStorage.setItem('lead_external_id', externalId);
        if (email) sessionStorage.setItem('lead_email', email.toLowerCase());
        else sessionStorage.removeItem('lead_email');
        sessionStorage.setItem('lead_phone', `+55${fone}`); // formato E.164
        sessionStorage.setItem('lead_nome', v.nome.trim().split(' ')[0]);
        sessionStorage.setItem('lead_wa', `https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(msg)}`);
        sessionStorage.setItem('lead_utm_source', utmSource);
        sessionStorage.setItem('lead_utm_medium', utmMedium);
        sessionStorage.setItem('lead_utm_campaign', utmCampaign);
        sessionStorage.removeItem('lead_convertido');
      } catch (_) {}

      // Encaminha para /obrigado com os parâmetros UTM na URL para rastreamento
      const thanksParams = new URLSearchParams();
      if (utmSource) thanksParams.set('utm_source', utmSource);
      if (utmMedium) thanksParams.set('utm_medium', utmMedium);
      if (utmCampaign) thanksParams.set('utm_campaign', utmCampaign);
      const thanksQuery = thanksParams.toString();
      window.location.href = thanksQuery ? `${CONFIG.THANKS_PATH}?${thanksQuery}` : CONFIG.THANKS_PATH;
    } catch (_) {
      setSending(false);
      setFail(true);
    }
  }

  const ctaText = { 1: 'Continuar →', 2: 'Continuar →', 3: 'Continuar →', 4: 'Quase lá →' }[step];

  return (
    <section id="lead-box" aria-labelledby="lead-title" ref={boxRef}>
      <style>{CSS}</style>
      <form onSubmit={onSubmit} noValidate>
        <h2 id="lead-title">Conte o que você procura</h2>
        <p className="sub">Leva menos de 1 minuto. Respondo pelo WhatsApp com opções que cabem no seu bolso.</p>

        <div className="progress" aria-hidden="true">
          {Array.from({ length: TOTAL }, (_, i) => <i key={i} className={i < step ? 'on' : ''} />)}
        </div>
        <p className="step-label" aria-live="polite">{STEP_TEXT[step]}</p>

        {step === 1 && (
          <div className="step" key="s1">
            <Chips name="cidade" legend="Em qual cidade quer morar?" options={CIDADES}
              value={v.cidade} onChange={set('cidade')} error={errs.cidade} />
            <Chips name="quartos" legend="Quantos quartos?" options={QUARTOS}
              value={v.quartos} onChange={set('quartos')} error={errs.quartos} />
          </div>
        )}

        {step === 2 && (
          <div className="step" key="s2">
            <Chips name="renda" legend="Qual a renda bruta mensal da família?" options={RENDAS}
              value={v.renda} onChange={set('renda')} error={errs.renda} />
            {RENDAS_COM_SUBSIDIO.includes(v.renda) && (
              <p className="reward">🎉 Com essa renda você pode ter direito ao <strong>subsídio do Minha Casa Minha Vida</strong>, um desconto do governo de até R$ 55 mil que não precisa ser devolvido.</p>
            )}
            <Chips name="regime_trabalho" legend="Como você trabalha hoje?" options={REGIMES}
              value={v.regime_trabalho} onChange={set('regime_trabalho')} error={errs.regime_trabalho} />
            {v.regime_trabalho === 'Autônomo' && (
              <p className="reward">👍 Autônomo também financia! A renda pode ser comprovada com extratos bancários, e eu te ajudo a organizar.</p>
            )}
            <p className="trust" style={{ marginTop: 0 }}>Pode somar a renda de quem vai morar com você (cônjuge, familiar).</p>
          </div>
        )}

        {step === 3 && (
          <div className="step" key="s3">
            <Chips name="pagamento" legend="Como pretende pagar?" options={PAGAMENTOS}
              value={v.pagamento} onChange={set('pagamento')} error={errs.pagamento} />
            <Chips name="faixa" legend="Até quanto quer investir no imóvel?" options={FAIXAS}
              value={v.faixa} onChange={set('faixa')} error={errs.faixa} />
          </div>
        )}

        {step === 4 && (
          <div className="step" key="s4">
            <Chips name="primeira_compra" legend="É o seu primeiro imóvel?" options={PRIMEIRA}
              value={v.primeira_compra} onChange={set('primeira_compra')} error={errs.primeira_compra} />
            <Chips name="prazo" legend="Quando quer comprar?" options={PRAZOS}
              value={v.prazo} onChange={set('prazo')} error={errs.prazo} />
          </div>
        )}

        {step === 5 && (
          <div className="step" key="s5">
            <p className="reward">
              ✅ Pronto! Já separei o perfil: <strong>{v.quartos}</strong> em <strong>{v.cidade}</strong>,{' '}
              <strong>{v.faixa}</strong>. Agora é só dizer para onde envio as opções.
            </p>
            <div className="field">
              <label className="lb" htmlFor="nome">Seu nome</label>
              <input type="text" id="nome" autoComplete="name" value={v.nome} placeholder="Como posso te chamar?"
                onChange={(e) => set('nome')(e.target.value)} className={errs.nome ? 'invalid' : ''} />
              {errs.nome && <div className="err">{errs.nome}</div>}
            </div>
            <div className="field">
              <label className="lb" htmlFor="whatsapp">WhatsApp com DDD</label>
              <input type="tel" id="whatsapp" inputMode="numeric" autoComplete="tel" placeholder="(21) 99999-9999"
                value={v.whatsapp} onChange={(e) => set('whatsapp')(maskPhone(e.target.value))}
                className={errs.whatsapp ? 'invalid' : ''} />
              {errs.whatsapp && <div className="err">{errs.whatsapp}</div>}
            </div>
            <div className="field">
              <label className="lb" htmlFor="email">E-mail <span className="opt">(opcional)</span></label>
              <input type="email" id="email" autoComplete="email" placeholder="seu@email.com" value={v.email}
                onChange={(e) => set('email')(e.target.value)} className={errs.email ? 'invalid' : ''} />
              {errs.email && <div className="err">{errs.email}</div>}
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
          </div>
        )}

        <button type="submit" className="cta" disabled={sending}>
          {step < TOTAL ? ctaText : sending ? 'Enviando...' : 'Quero receber opções de imóveis'}
        </button>
        {step > 1 && !sending && (
          <button type="button" className="back" onClick={() => goTo(step - 1)}>← Voltar</button>
        )}
        {step === TOTAL && <p className="trust">🔒 Atendimento gratuito, sem compromisso e sem spam.</p>}
        {fail && <div className="fail">Não conseguimos enviar agora. Tente de novo ou chame direto no WhatsApp.</div>}
      </form>
    </section>
  );
}
