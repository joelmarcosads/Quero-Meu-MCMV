import React, { useRef, useState } from 'react';

// ====== CONFIGURAÇÃO ======
const CONFIG = {
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxGGoduZ4sZzfnRoeGKJNmRZN7rWnMa2iDlbWrgCQ4qeG1H960uakUpf7R452qTXzPf/exec',
  WHATSAPP: '5521965928399', // DDI + DDD + número, só dígitos
  THANKS_PATH: '/obrigado.imoveis',
};
// ==========================

const CSS = `
#owner-box {
  --ink: #2A1D15;
  --cafe: #5B3A29;
  --bronze: #A9743B;
  --line: #E0D3C4;
  --warn: #b3261e;
  --gold: #D4A64A;
  --cta: #0F7A5A;
  --cta-dark: #0B5F46;
  font-family: 'Figtree', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  color: var(--ink);
  max-width: 640px;
  margin: 0 auto;
  padding: 32px 26px;
  background: #ffffff;
  border: 1px solid var(--line);
  border-radius: 16px;
  box-sizing: border-box;
  box-shadow: 0 4px 24px rgba(42, 29, 21, 0.05);
}
#owner-box * { box-sizing: border-box; }
#owner-box h2 {
  margin: 0 0 8px;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 1.6rem;
  line-height: 1.25;
  color: var(--cafe);
  font-weight: 700;
}
#owner-box .sub {
  margin: 0 0 20px;
  color: #64554b;
  font-size: 0.95rem;
  line-height: 1.5;
}
#owner-box .alert {
  background: #fef2f2;
  border: 1.5px solid var(--warn);
  color: var(--warn);
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  line-height: 1.4;
}
#owner-box .alert-icon { font-size: 1.2rem; flex: none; }
#owner-box .row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
#owner-box .field { margin-bottom: 14px; }
#owner-box label, #owner-box legend {
  display: block;
  font-weight: 700;
  font-size: 0.92rem;
  margin-bottom: 6px;
  padding: 0;
  color: var(--cafe);
}
#owner-box .req { color: var(--warn); margin-left: 3px; }
#owner-box input[type=text],
#owner-box input[type=tel],
#owner-box input[type=email],
#owner-box select {
  width: 100%;
  padding: 12px 14px;
  font: inherit;
  color: var(--ink);
  background: #FAF7F2;
  border: 1.5px solid var(--line);
  border-radius: 10px;
  transition: border-color .15s, outline .15s, background .15s;
}
#owner-box input:focus,
#owner-box select:focus {
  outline: 3px solid var(--gold);
  outline-offset: 1px;
  border-color: var(--bronze);
  background: #ffffff;
}
#owner-box .invalid { border-color: var(--warn) !important; background: #fff8f8 !important; }
#owner-box .err { color: var(--warn); font-size: 0.82rem; margin-top: 4px; font-weight: 600; }
#owner-box fieldset { border: 0; margin: 0 0 14px; padding: 0; }
#owner-box fieldset.invalid legend { color: var(--warn) !important; }
#owner-box .chips { display: flex; flex-wrap: wrap; gap: 8px; }
#owner-box .chips input { position: absolute; opacity: 0; pointer-events: none; }
#owner-box .chips span {
  display: inline-block;
  padding: 8px 14px;
  border: 1.5px solid var(--line);
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.9rem;
  background: #FAF7F2;
  color: var(--ink);
  transition: all .15s ease;
}
#owner-box .chips-invalid span { border-color: var(--warn) !important; }
#owner-box .chips input:checked + span {
  background: var(--cta);
  border-color: var(--cta);
  color: #fff;
  font-weight: 600;
}
#owner-box .chips input:focus-visible + span { outline: 3px solid var(--gold); outline-offset: 2px; }
#owner-box .consent {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 0.82rem;
  color: #55483e;
  line-height: 1.45;
  margin: 12px 0 16px;
  font-weight: 400;
}
#owner-box .consent input {
  margin-top: 3px;
  width: 18px;
  height: 18px;
  accent-color: var(--cta);
  flex: none;
}
#owner-box .hp { position: absolute; left: -9999px; height: 0; overflow: hidden; }
#owner-box button.cta {
  width: 100%;
  padding: 16px;
  margin-top: 10px;
  border: 0;
  border-radius: 12px;
  background: var(--cta);
  color: #fff;
  font: inherit;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  transition: background .15s ease, transform .1s ease;
  box-shadow: 0 4px 14px rgba(15, 122, 90, 0.25);
}
#owner-box button.cta:hover { background: var(--cta-dark); }
#owner-box button.cta:disabled { opacity: .65; cursor: wait; }
#owner-box .fail {
  margin-top: 14px;
  color: var(--warn);
  font-size: 0.9rem;
  text-align: center;
  font-weight: 600;
}
#owner-box .cep-status {
  font-size: 0.8rem;
  color: var(--bronze);
  margin-top: 3px;
  font-weight: 500;
}
#owner-box .checkbox-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
#owner-box .checkbox-chips label {
  cursor: pointer;
  margin-bottom: 0;
  display: inline-flex;
}
#owner-box .checkbox-chips input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
#owner-box .checkbox-chips span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 8px 14px;
  border: 1.5px solid var(--line);
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.88rem;
  background: #FAF7F2;
  color: var(--ink);
  transition: all .15s ease;
  user-select: none;
}
#owner-box .checkbox-chips input:checked + span {
  background: var(--cta);
  border-color: var(--cta);
  color: #fff;
  font-weight: 600;
}
#owner-box .checkbox-chips input:focus-visible + span {
  outline: 3px solid var(--gold);
  outline-offset: 2px;
}
#owner-box .section-heading {
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--bronze);
  margin: 22px 0 10px;
  padding-bottom: 4px;
  border-bottom: 1px dashed var(--line);
}
@media (max-width: 520px) {
  #owner-box { padding: 22px 16px; }
  #owner-box .row { grid-template-columns: 1fr; gap: 0; }
}
@media (prefers-reduced-motion: reduce) {
  #owner-box * { transition: none !important; }
}
`;

const TIPOS_IMOVEL = ['Apartamento', 'Casa', 'Casa em Condomínio', 'Cobertura', 'Terreno', 'Comercial'];
const SITUACOES_IMOVEL = ['Ocupado', 'Desocupado'];
const CIDADES = ['Itaboraí', 'São Gonçalo', 'Niterói', 'Maricá', 'Rio de Janeiro', 'Outra'];
const ESTADOS_IMOVEL = ['Novo (Pronto para morar)', 'Reformado', 'Usado / Terceiro', 'Na planta / Em obras'];
const QUARTOS = ['1 quarto', '2 quartos', '3 quartos', '4 ou mais'];
const SUITES = ['Sem suíte', '1 suíte', '2 suítes', '3 ou mais'];
const BANHEIROS = ['1 banheiro', '2 banheiros', '3 banheiros', '4 ou mais'];
const VAGAS = ['Sem vaga', '1 vaga', '2 vagas', '3 ou mais'];
const DIFERENCIAIS_OPCOES = [
  'Piscina',
  'Churrasqueira',
  'Quintal',
  'Varanda / Sacada',
  'Área Gourmet',
  'Armários Planejados',
  'Condomínio Fechado',
  'Elevador',
  'Portaria 24h',
  'Aceita Pets',
];
const OBJETIVOS = ['Quero vender agora', 'Quero vender nos próximos meses', 'Quero alugar', 'Apenas saber o valor de mercado'];

function maskPhone(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length > 6) {
    const cut = d.length > 10 ? 7 : 6;
    return `(${d.slice(0, 2)}) ${d.slice(2, cut)}-${d.slice(cut)}`;
  }
  if (d.length > 2) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return d;
}

function maskCep(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 8);
  if (d.length > 5) {
    return `${d.slice(0, 5)}-${d.slice(5)}`;
  }
  return d;
}

function Chips({
  name,
  options,
  value,
  onChange,
  error,
}: {
  name: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  return (
    <div className={`chips ${error ? 'chips-invalid' : ''}`}>
      {options.map((o) => (
        <label key={o}>
          <input
            type="radio"
            name={name}
            value={o}
            checked={value === o}
            onChange={() => onChange(o)}
          />
          <span>{o}</span>
        </label>
      ))}
    </div>
  );
}

function DiferenciaisSelector({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (opt: string) => void;
}) {
  return (
    <div className="checkbox-chips" role="group" aria-label="Diferenciais do imóvel">
      {options.map((opt) => {
        const isChecked = selected.includes(opt);
        return (
          <label key={opt}>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onToggle(opt)}
            />
            <span>
              {isChecked ? '✓ ' : '+ '}
              {opt}
            </span>
          </label>
        );
      })}
    </div>
  );
}

function Select({
  id,
  label,
  options,
  value,
  onChange,
  error,
  msg,
  required,
}: {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  error?: string;
  msg?: string;
  required?: boolean;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required && <span className="req">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={error ? 'invalid' : ''}
      >
        <option value="">Selecione</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {error && <div className="err">{msg}</div>}
    </div>
  );
}

export default function OwnerForm() {
  const [v, setV] = useState({
    nome: '',
    whatsapp: '',
    email: '',
    cep: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: 'Itaboraí',
    referencia: '',
    tipo_imovel: '',
    situacao_imovel: '',
    estado_imovel: '',
    quartos: '',
    suites: '',
    banheiros: '',
    vagas: '',
    area: '',
    diferenciais: [] as string[],
    outros_diferenciais: '',
    objetivo: '',
    lgpd: false,
    website: '', // honeypot
  });

  const [errs, setErrs] = useState<Record<string, string>>({});
  const [showAlert, setShowAlert] = useState(false);
  const [sending, setSending] = useState(false);
  const [fail, setFail] = useState(false);
  const [cepStatus, setCepStatus] = useState('');
  const t0 = useRef(Date.now());

  const set = (k: string) => (val: string | boolean) => {
    setV((s) => ({ ...s, [k]: val }));
    if (errs[k]) {
      setErrs((prev) => {
        const next = { ...prev };
        delete next[k];
        if (Object.keys(next).length === 0) setShowAlert(false);
        return next;
      });
    }
  };

  const toggleDiferencial = (item: string) => {
    setV((s) => {
      const exists = s.diferenciais.includes(item);
      const next = exists
        ? s.diferenciais.filter((d) => d !== item)
        : [...s.diferenciais, item];
      return { ...s, diferenciais: next };
    });
  };

  // Busca automática de endereço pelo CEP usando ViaCEP
  async function handleCepChange(val: string) {
    const masked = maskCep(val);
    set('cep')(masked);
    const cleanCep = masked.replace(/\D/g, '');

    if (cleanCep.length === 8) {
      setCepStatus('Buscando endereço pelo CEP...');
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        if (!res.ok) throw new Error('Falha');
        const data = await res.json();
        if (data.erro) {
          setCepStatus('CEP não encontrado. Digite o endereço manualmente.');
        } else {
          setCepStatus('');
          setV((s) => ({
            ...s,
            endereco: data.logradouro || s.endereco,
            bairro: data.bairro || s.bairro,
            cidade: data.localidade || s.cidade,
          }));
        }
      } catch (_) {
        setCepStatus('Não foi possível autocompletar. Digite os dados abaixo.');
      }
    } else {
      setCepStatus('');
    }
  }

  function validate() {
    const e: Record<string, string> = {};

    // 1. Seus Dados de Contato: todos
    if (!v.nome || v.nome.trim().length < 2) {
      e.nome = 'Atenção: Por favor, informe seu nome completo.';
    }
    if (!v.whatsapp || v.whatsapp.replace(/\D/g, '').length < 10) {
      e.whatsapp = 'Atenção: Por favor, informe seu WhatsApp com DDD.';
    }
    if (!v.email || !v.email.trim()) {
      e.email = 'Atenção: Por favor, informe seu e-mail.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) {
      e.email = 'Atenção: Digite um e-mail válido (ex: seu@email.com).';
    }

    // 2. Localização do Imóvel: todos
    if (!v.cep || v.cep.replace(/\D/g, '').length < 8) {
      e.cep = 'Atenção: Informe o CEP do imóvel (8 dígitos).';
    }
    if (!v.cidade) {
      e.cidade = 'Atenção: Por favor, selecione a cidade do imóvel.';
    }
    if (!v.bairro || !v.bairro.trim()) {
      e.bairro = 'Atenção: Por favor, informe o bairro do imóvel.';
    }
    if (!v.endereco || !v.endereco.trim()) {
      e.endereco = 'Atenção: Por favor, informe o endereço / rua do imóvel.';
    }
    if (!v.numero || !v.numero.trim()) {
      e.numero = 'Atenção: Por favor, informe o número ou complemento do imóvel.';
    }
    if (!v.referencia || !v.referencia.trim()) {
      e.referencia = 'Atenção: Por favor, informe um ponto de referência da localização.';
    }

    // 3. Características e Cômodos
    if (!v.tipo_imovel) {
      e.tipo_imovel = 'Atenção: Selecione o tipo do imóvel.';
    }
    if (!v.situacao_imovel) {
      e.situacao_imovel = 'Atenção: Selecione a situação do imóvel (Ocupado ou Desocupado).';
    }
    if (!v.estado_imovel) {
      e.estado_imovel = 'Atenção: Selecione o estado de conservação do imóvel.';
    }
    if (!v.quartos) {
      e.quartos = 'Atenção: Selecione a quantidade de quartos.';
    }
    if (!v.suites) {
      e.suites = 'Atenção: Selecione a quantidade de suítes.';
    }
    if (!v.vagas) {
      e.vagas = 'Atenção: Selecione a quantidade de vagas de garagem.';
    }

    // 5. Seu Momento
    if (!v.objetivo) {
      e.objetivo = 'Atenção: Selecione o objetivo da avaliação.';
    }

    // Consentimento LGPD
    if (!v.lgpd) {
      e.lgpd = 'Atenção: É necessário autorizar o contato para receber a avaliação.';
    }

    setErrs(e);
    return e;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setFail(false);
    const e = validate();
    if (Object.keys(e).length) {
      setShowAlert(true);
      const first = document.querySelector('#owner-box .alert, #owner-box .invalid, #owner-box .err');
      if (first && 'scrollIntoView' in first) {
        (first as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setShowAlert(false);

    // Robô: preencheu a isca (honeypot) ou enviou em menos de 1 segundo (tempo desumano)
    if (v.website || Date.now() - t0.current < 1000) return;

    const qs = new URLSearchParams(window.location.search);

    // ID único do lead (external_id): liga o lead à conversão
    const externalId =
      typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID
        ? window.crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    const utmSource =
      qs.get('utm_source') ||
      (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('utm_source')) ||
      (typeof localStorage !== 'undefined' && localStorage.getItem('utm_source')) ||
      '';
    const utmMedium =
      qs.get('utm_medium') ||
      (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('utm_medium')) ||
      (typeof localStorage !== 'undefined' && localStorage.getItem('utm_medium')) ||
      '';
    const utmCampaign =
      qs.get('utm_campaign') ||
      (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('utm_campaign')) ||
      (typeof localStorage !== 'undefined' && localStorage.getItem('utm_campaign')) ||
      '';

    const listaDiferenciais = [...v.diferenciais];
    if (v.outros_diferenciais.trim()) {
      listaDiferenciais.push(v.outros_diferenciais.trim());
    }
    const diferenciaisFinal = listaDiferenciais.join(', ');

    const telDigitos = v.whatsapp.replace(/\D/g, '');
    const waLeadMsg = `Olá ${v.nome.trim()}! Sou o Joel Marcos, Corretor de Imóveis. Recebi os dados do seu imóvel (${v.tipo_imovel}) para avaliação gratuita.`;
    const waLink = telDigitos ? `https://wa.me/55${telDigitos}?text=${encodeURIComponent(waLeadMsg)}` : '';

    const data = new URLSearchParams({
      formulario: 'proprietario',
      form_tipo: 'avaliacao_proprietario',
      external_id: externalId,
      status: 'Novo Lead',
      nome: v.nome.trim(),
      whatsapp: v.whatsapp.trim(),
      whatsapp_raw: telDigitos,
      link_whatsapp: waLink,
      email: v.email.trim(),
      finalidade: v.objetivo,
      objetivo: v.objetivo,
      tipo: v.tipo_imovel,
      tipo_imovel: v.tipo_imovel,
      metragem: v.area.trim(),
      area: v.area.trim(),
      quartos: v.quartos,
      suites: v.suites,
      banheiros: v.banheiros,
      vagas: v.vagas,
      diferenciais: diferenciaisFinal,
      outros_diferenciais: v.outros_diferenciais.trim(),
      valor: 'Sob consulta',
      cep: v.cep.trim(),
      rua: v.endereco.trim(),
      endereco: v.endereco.trim(),
      numero: v.numero.trim(),
      complemento: '',
      bairro: v.bairro.trim(),
      cidade: v.cidade,
      uf: 'RJ',
      referencia: v.referencia.trim(),
      estado_imovel: v.estado_imovel,
      situacao: v.situacao_imovel,
      situacao_imovel: v.situacao_imovel,
      autorizacao: 'Sim',
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
      await fetch(CONFIG.SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: data.toString(),
      });

      // Detalhamento para mensagem amigável no WhatsApp
      const partesComodos: string[] = [];
      if (v.quartos) partesComodos.push(v.quartos);
      if (v.suites && v.suites !== 'Sem suíte') partesComodos.push(v.suites);
      if (v.banheiros) partesComodos.push(v.banheiros);
      if (v.vagas && v.vagas !== 'Sem vaga') partesComodos.push(v.vagas);
      if (v.area.trim()) partesComodos.push(`${v.area.trim()}`);
      const comodosStr = partesComodos.length ? ` (${partesComodos.join(', ')})` : '';

      const estadoStr = v.estado_imovel ? ` [${v.estado_imovel}]` : '';
      const situacaoStr = v.situacao_imovel ? ` [${v.situacao_imovel}]` : '';
      const difStr = diferenciaisFinal ? ` • Diferenciais: ${diferenciaisFinal}` : '';
      const refStr = v.referencia.trim() ? ` • Ref: ${v.referencia.trim()}` : '';

      const msg = `Olá! Sou ${v.nome.trim()}. Cadastrei meu imóvel para avaliação: ${v.tipo_imovel}${estadoStr}${situacaoStr} em ${v.bairro}, ${v.cidade}${comodosStr}.${difStr}${refStr} Gostaria de receber o parecer de mercado.`;

      // Guarda dados para a página de obrigado (só no sessionStorage, nenhum dado pessoal na URL)
      try {
        sessionStorage.setItem('prop_external_id', externalId);
        sessionStorage.setItem('prop_email', v.email.trim().toLowerCase());
        sessionStorage.setItem('prop_phone', `+55${v.whatsapp.replace(/\D/g, '')}`);
        sessionStorage.setItem('prop_nome', v.nome.trim().split(' ')[0]);
        sessionStorage.setItem(
          'prop_wa',
          `https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(msg)}`
        );
        sessionStorage.setItem('prop_tipo', v.tipo_imovel);
        sessionStorage.setItem('prop_situacao', v.situacao_imovel);
        sessionStorage.setItem('prop_bairro', v.bairro.trim());
        sessionStorage.setItem('prop_cidade', v.cidade);
        sessionStorage.setItem('prop_endereco', v.endereco.trim());
        sessionStorage.setItem('prop_numero', v.numero.trim());
        sessionStorage.setItem('prop_referencia', v.referencia.trim());
        sessionStorage.setItem('prop_estado', v.estado_imovel);
        sessionStorage.setItem('prop_quartos', v.quartos);
        sessionStorage.setItem('prop_suites', v.suites);
        sessionStorage.setItem('prop_banheiros', v.banheiros);
        sessionStorage.setItem('prop_vagas', v.vagas);
        sessionStorage.setItem('prop_area', v.area.trim());
        sessionStorage.setItem('prop_diferenciais', diferenciaisFinal);
        sessionStorage.setItem('prop_objetivo', v.objetivo);
        sessionStorage.setItem('prop_utm_source', utmSource);
        sessionStorage.setItem('prop_utm_medium', utmMedium);
        sessionStorage.setItem('prop_utm_campaign', utmCampaign);
        sessionStorage.removeItem('prop_convertido');
      } catch (_) {}

      // Encaminha para /obrigado com os parâmetros UTM preservados
      const thanksParams = new URLSearchParams();
      if (utmSource) thanksParams.set('utm_source', utmSource);
      if (utmMedium) thanksParams.set('utm_medium', utmMedium);
      if (utmCampaign) thanksParams.set('utm_campaign', utmCampaign);
      const thanksQuery = thanksParams.toString();
      window.location.href = thanksQuery
        ? `${CONFIG.THANKS_PATH}?${thanksQuery}`
        : CONFIG.THANKS_PATH;
    } catch (_) {
      setSending(false);
      setFail(true);
    }
  }

  const cls = (k: string) => (errs[k] ? 'invalid' : '');

  return (
    <section id="owner-box" aria-labelledby="owner-form-title">
      <style>{CSS}</style>
      <form onSubmit={onSubmit} noValidate>
        <h2 id="owner-form-title">Receba a avaliação gratuita do seu imóvel</h2>
        <p className="sub">
          Preencha os dados do imóvel para elaborarmos um estudo comparativo fundamentado no mercado real.
        </p>

        {showAlert && (
          <div className="alert" role="alert">
            <span className="alert-icon">⚠️</span>
            <span>
              Atenção: Por favor, verifique os campos destacados abaixo para continuarmos.
            </span>
          </div>
        )}

        <div className="section-heading">1. Seus Dados de Contato</div>

        <div className="field">
          <label htmlFor="owner-nome">
            Seu nome completo <span className="req">*</span>
          </label>
          <input
            type="text"
            id="owner-nome"
            autoComplete="name"
            value={v.nome}
            onChange={(e) => set('nome')(e.target.value)}
            className={cls('nome')}
            placeholder="Ex: Carlos Eduardo Silveira"
          />
          {errs.nome && <div className="err">{errs.nome}</div>}
        </div>

        <div className="row">
          <div className="field">
            <label htmlFor="owner-whatsapp">
              WhatsApp com DDD <span className="req">*</span>
            </label>
            <input
              type="tel"
              id="owner-whatsapp"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="(21) 99999-9999"
              value={v.whatsapp}
              onChange={(e) => set('whatsapp')(maskPhone(e.target.value))}
              className={cls('whatsapp')}
            />
            {errs.whatsapp && <div className="err">{errs.whatsapp}</div>}
          </div>
          <div className="field">
            <label htmlFor="owner-email">
              Seu e-mail <span className="req">*</span>
            </label>
            <input
              type="email"
              id="owner-email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={v.email}
              onChange={(e) => set('email')(e.target.value)}
              className={cls('email')}
            />
            {errs.email && <div className="err">{errs.email}</div>}
          </div>
        </div>

        <div className="section-heading">2. Localização do Imóvel</div>

        <div className="row">
          <div className="field">
            <label htmlFor="owner-cep">
              CEP do imóvel <span className="req">*</span>
            </label>
            <input
              type="text"
              id="owner-cep"
              inputMode="numeric"
              placeholder="00000-000"
              value={v.cep}
              onChange={(e) => handleCepChange(e.target.value)}
              className={cls('cep')}
            />
            {cepStatus && <div className="cep-status">{cepStatus}</div>}
            {errs.cep && <div className="err">{errs.cep}</div>}
          </div>
          <Select
            id="owner-cidade"
            label="Cidade do imóvel"
            options={CIDADES}
            value={v.cidade}
            onChange={(val) => set('cidade')(val)}
            error={errs.cidade}
            msg={errs.cidade}
            required
          />
        </div>

        <div className="row">
          <div className="field">
            <label htmlFor="owner-bairro">
              Bairro <span className="req">*</span>
            </label>
            <input
              type="text"
              id="owner-bairro"
              placeholder="Ex: Icaraí, Trindade, Centro..."
              value={v.bairro}
              onChange={(e) => set('bairro')(e.target.value)}
              className={cls('bairro')}
            />
            {errs.bairro && <div className="err">{errs.bairro}</div>}
          </div>
          <div className="field">
            <label htmlFor="owner-endereco">
              Endereço / Rua <span className="req">*</span>
            </label>
            <input
              type="text"
              id="owner-endereco"
              placeholder="Rua / Avenida"
              value={v.endereco}
              onChange={(e) => set('endereco')(e.target.value)}
              className={cls('endereco')}
            />
            {errs.endereco && <div className="err">{errs.endereco}</div>}
          </div>
        </div>

        <div className="field">
          <label htmlFor="owner-numero">
            Número / Complemento <span className="req">*</span>
          </label>
          <input
            type="text"
            id="owner-numero"
            placeholder="Ex: 120, Apto 402, Bloco 2"
            value={v.numero}
            onChange={(e) => set('numero')(e.target.value)}
            className={cls('numero')}
          />
          {errs.numero && <div className="err">{errs.numero}</div>}
        </div>

        <div className="field">
          <label htmlFor="owner-referencia">
            Ponto de referência da localização <span className="req">*</span>
          </label>
          <input
            type="text"
            id="owner-referencia"
            placeholder="Ex: Próximo ao supermercado, em frente à praça, colégio, esquina com..."
            value={v.referencia}
            onChange={(e) => set('referencia')(e.target.value)}
            className={cls('referencia')}
          />
          {errs.referencia && <div className="err">{errs.referencia}</div>}
        </div>

        <div className="section-heading">3. Características e Cômodos</div>

        <fieldset className={cls('tipo_imovel')}>
          <legend>
            Tipo de imóvel <span className="req">*</span>
          </legend>
          <Chips
            name="tipo_imovel"
            options={TIPOS_IMOVEL}
            value={v.tipo_imovel}
            onChange={(val) => set('tipo_imovel')(val)}
            error={errs.tipo_imovel}
          />
          {errs.tipo_imovel && <div className="err">{errs.tipo_imovel}</div>}
        </fieldset>

        <fieldset className={cls('situacao_imovel')}>
          <legend>
            Situação do imóvel <span className="req">*</span>
          </legend>
          <Chips
            name="situacao_imovel"
            options={SITUACOES_IMOVEL}
            value={v.situacao_imovel}
            onChange={(val) => set('situacao_imovel')(val)}
            error={errs.situacao_imovel}
          />
          {errs.situacao_imovel && <div className="err">{errs.situacao_imovel}</div>}
        </fieldset>

        <fieldset className={cls('estado_imovel')}>
          <legend>
            Estado de conservação do imóvel <span className="req">*</span>
          </legend>
          <Chips
            name="estado_imovel"
            options={ESTADOS_IMOVEL}
            value={v.estado_imovel}
            onChange={(val) => set('estado_imovel')(val)}
            error={errs.estado_imovel}
          />
          {errs.estado_imovel && <div className="err">{errs.estado_imovel}</div>}
        </fieldset>

        <div className="row">
          <Select
            id="owner-quartos"
            label="Quantidade de quartos"
            options={QUARTOS}
            value={v.quartos}
            onChange={(val) => set('quartos')(val)}
            error={errs.quartos}
            msg={errs.quartos}
            required
          />
          <Select
            id="owner-suites"
            label="Quantidade de suítes"
            options={SUITES}
            value={v.suites}
            onChange={(val) => set('suites')(val)}
            error={errs.suites}
            msg={errs.suites}
            required
          />
        </div>

        <div className="row">
          <Select
            id="owner-vagas"
            label="Vagas de garagem"
            options={VAGAS}
            value={v.vagas}
            onChange={(val) => set('vagas')(val)}
            error={errs.vagas}
            msg={errs.vagas}
            required
          />
          <Select
            id="owner-banheiros"
            label="Quantidade de banheiros"
            options={BANHEIROS}
            value={v.banheiros}
            onChange={(val) => set('banheiros')(val)}
          />
        </div>

        <div className="field">
          <label htmlFor="owner-area">
            Área privativa aprox. (m²) (opcional)
          </label>
          <input
            type="text"
            id="owner-area"
            placeholder="Ex: 68 m²"
            value={v.area}
            onChange={(e) => set('area')(e.target.value)}
          />
        </div>

        <div className="section-heading">4. Diferenciais do Imóvel</div>

        <fieldset>
          <legend>Diferenciais e comodidades (marque os que se aplicam)</legend>
          <DiferenciaisSelector
            options={DIFERENCIAIS_OPCOES}
            selected={v.diferenciais}
            onToggle={toggleDiferencial}
          />
        </fieldset>

        <div className="field" style={{ marginTop: '12px' }}>
          <label htmlFor="owner-outros-diferenciais">
            Outros diferenciais ou destaques por escrito (opcional)
          </label>
          <input
            type="text"
            id="owner-outros-diferenciais"
            placeholder="Ex: Energia solar fotovoltaica, armários planejados em todos os cômodos, vista panorâmica..."
            value={v.outros_diferenciais}
            onChange={(e) => set('outros_diferenciais')(e.target.value)}
          />
        </div>

        <div className="section-heading">5. Seu Momento</div>

        <fieldset className={cls('objetivo')}>
          <legend>
            Qual é o seu objetivo principal? <span className="req">*</span>
          </legend>
          <Chips
            name="objetivo"
            options={OBJETIVOS}
            value={v.objetivo}
            onChange={(val) => set('objetivo')(val)}
            error={errs.objetivo}
          />
          {errs.objetivo && <div className="err">{errs.objetivo}</div>}
        </fieldset>

        {/* Campo isca (honeypot): preenchido somente por bots */}
        <div className="hp" aria-hidden="true">
          <label>
            Não preencha este campo
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={v.website}
              onChange={(e) => set('website')(e.target.value)}
            />
          </label>
        </div>

        <label className="consent">
          <input
            type="checkbox"
            checked={v.lgpd}
            onChange={(e) => set('lgpd')(e.target.checked)}
          />
          <span>
            Autorizo o contato por WhatsApp ou telefone para envio da avaliação do meu imóvel,
            conforme a LGPD (Lei 13.709/2018). Meus dados não serão compartilhados com terceiros e
            posso pedir a exclusão a qualquer momento. <span className="req">*</span>
          </span>
        </label>
        {errs.lgpd && <div className="err">{errs.lgpd}</div>}

        <button type="submit" className="cta" disabled={sending}>
          {sending ? 'Enviando...' : 'Quero minha avaliação gratuita'}
        </button>
        {fail && (
          <div className="fail">
            Não conseguimos processar o envio neste momento. Por favor, tente novamente ou fale
            diretamente comigo pelo WhatsApp.
          </div>
        )}
      </form>
    </section>
  );
}
