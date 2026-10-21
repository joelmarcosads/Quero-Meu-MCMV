import { useEffect, useState } from 'react';

// Mesmo número usado no formulário (DDI + DDD + número, só dígitos)
const WHATSAPP = '55DDDNUMERO';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;700&display=swap');
#obrigado{--ink:#14293d;--line:#c9d6d4;--wa:#1f9d55;
  font-family:'Figtree',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--ink);
  min-height:100vh;display:grid;place-items:center;padding:24px;background:#f4f8f7;box-sizing:border-box}
#obrigado *{box-sizing:border-box}
#obrigado main{max-width:520px;width:100%;background:#fff;border:1px solid var(--line);border-radius:16px;padding:32px 24px;text-align:center}
#obrigado h1{margin:0 0 10px;font-size:1.6rem;line-height:1.2}
#obrigado p{margin:0 0 20px;line-height:1.55;color:#44586a}
#obrigado .wa{display:inline-block;padding:15px 26px;border-radius:12px;background:var(--wa);color:#fff;font-weight:700;text-decoration:none}
#obrigado .wa:focus-visible{outline:3px solid #f0b44c;outline-offset:3px}
#obrigado ul{margin:26px 0 0;padding:0;list-style:none;text-align:left;font-size:.95rem;color:#44586a}
#obrigado li{padding:10px 0;border-top:1px solid var(--line)}
#obrigado b{color:var(--ink)}
`;

export default function Obrigado() {
  const [nome, setNome] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    document.title = 'Obrigado! Recebi seus dados';

    // Impede a página de aparecer no Google (ela só serve para marcar conversão)
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);

    let n = '';
    let l = '';
    let email = '';
    let phone = '';
    let externalId = '';
    let jaMarcou = false;
    try {
      n = sessionStorage.getItem('lead_nome') || '';
      l = sessionStorage.getItem('lead_wa') || '';
      email = sessionStorage.getItem('lead_email') || '';
      phone = sessionStorage.getItem('lead_phone') || '';
      externalId = sessionStorage.getItem('lead_external_id') || '';
      jaMarcou = sessionStorage.getItem('lead_convertido') === '1';
    } catch (_) {}

    setNome(n);
    setLink(
      l ||
        `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
          'Olá! Preenchi o formulário no site e quero ver opções de imóveis.'
        )}`
    );

    // Marcação de conversão: 1 vez por envio, mesmo se a pessoa atualizar a página
    // Tudo passa pela dataLayer (Google Tag Manager): evita contar a conversão em dobro
    if (!jaMarcou && externalId) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'lead_compra_imovel',
        form_name: 'compra_imovel',
        external_id: externalId,
        event_id: externalId, // usado pelo Meta para deduplicar Pixel e API de Conversões
        user_data: {
          email: email || undefined,
          phone_number: phone || undefined,
        },
      });
      try {
        sessionStorage.setItem('lead_convertido', '1');
        // Remove os dados pessoais do navegador depois de enviados
        sessionStorage.removeItem('lead_email');
        sessionStorage.removeItem('lead_phone');
      } catch (_) {}
    }

    return () => { meta.remove(); };
  }, []);

  return (
    <div id="obrigado">
      <style>{CSS}</style>
      <main>
        <h1>{nome ? `Recebi seus dados, ${nome}` : 'Recebi seus dados'}</h1>
        <p>Já vou separar imóveis que combinam com o seu perfil. Para agilizar, me chame agora no WhatsApp.</p>
        <a className="wa" href={link} target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a>
        <ul>
          <li><b>Hoje:</b> analiso o que você informou.</li>
          <li><b>Em seguida:</b> envio opções reais na sua faixa de valor.</li>
          <li><b>Depois:</b> simulamos o financiamento e agendamos as visitas.</li>
        </ul>
      </main>
    </div>
  );
}
