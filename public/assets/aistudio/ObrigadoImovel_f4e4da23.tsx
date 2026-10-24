// @ts-nocheck
import { useEffect, useState } from 'react';

// Mesmo número do formulário (DDI + DDD + número, só dígitos)
const WHATSAPP = '5521965928399';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;700&display=swap');
#obrigado-imovel{--ink:#2a1d15;--cafe:#5b3a29;--line:#e0d3c4;--wa:#0f7a5a;
  font-family:'Figtree',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--ink);
  min-height:100vh;display:grid;place-items:center;padding:24px;background:#faf7f2;box-sizing:border-box}
#obrigado-imovel *{box-sizing:border-box}
#obrigado-imovel main{max-width:520px;width:100%;background:#fff;border:1px solid var(--line);border-radius:16px;padding:32px 24px;text-align:center}
#obrigado-imovel h1{margin:0 0 10px;font-size:1.6rem;line-height:1.2;color:var(--cafe)}
#obrigado-imovel p{margin:0 0 20px;line-height:1.55;color:#5d4a3c}
#obrigado-imovel .wa{display:inline-block;padding:15px 26px;border-radius:12px;background:var(--wa);color:#fff;font-weight:700;text-decoration:none}
#obrigado-imovel .wa:focus-visible{outline:3px solid #d4a64a;outline-offset:3px}
#obrigado-imovel ul{margin:26px 0 0;padding:0;list-style:none;text-align:left;font-size:.95rem;color:#5d4a3c}
#obrigado-imovel li{padding:10px 0;border-top:1px solid var(--line)}
#obrigado-imovel b{color:var(--ink)}
#obrigado-imovel .creci{margin:22px 0 0;font-size:.82rem;color:#7a6657}
`;

export default function ObrigadoImovel() {
  const [nome, setNome] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    document.title = 'Imóvel cadastrado com sucesso';

    // Impede a página de aparecer no Google (ela só serve para marcar conversão)
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);

    let n = '';
    let l = '';
    let phone = '';
    let externalId = '';
    let jaMarcou = false;
    try {
      n = sessionStorage.getItem('prop_nome') || '';
      l = sessionStorage.getItem('prop_wa') || '';
      phone = sessionStorage.getItem('prop_phone') || '';
      externalId = sessionStorage.getItem('prop_external_id') || '';
      jaMarcou = sessionStorage.getItem('prop_convertido') === '1';
    } catch (_) {}

    setNome(n);
    setLink(
      l ||
        `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
          'Olá! Acabei de cadastrar meu imóvel no site e gostaria de falar com o corretor.'
        )}`
    );

    // Conversão: 1 evento por envio, via dataLayer (Google Tag Manager)
    if (!jaMarcou && externalId) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'lead_captacao_imovel',
        form_name: 'captacao_imovel',
        external_id: externalId,
        event_id: externalId,
        user_data: { phone_number: phone || undefined },
      });
      try {
        sessionStorage.setItem('prop_convertido', '1');
        sessionStorage.removeItem('prop_phone');
      } catch (_) {}
    }

    return () => { meta.remove(); };
  }, []);

  return (
    <div id="obrigado-imovel">
      <style>{CSS}</style>
      <main>
        <h1>{nome ? `Imóvel cadastrado, ${nome}!` : 'Imóvel cadastrado!'}</h1>
        <p>Recebi os dados do seu imóvel. Para agilizar a avaliação, me chame agora no WhatsApp.</p>
        <a className="wa" href={link} target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a>
        <ul>
          <li><b>Agora:</b> analiso as características e a localização do imóvel.</li>
          <li><b>Em seguida:</b> entro em contato para confirmar os detalhes e apresentar a avaliação.</li>
          <li><b>Depois:</b> formalizamos a autorização por escrito e iniciamos a divulgação.</li>
        </ul>
        <p className="creci">Joel Marcos · CRECI-RJ 39.583</p>
      </main>
    </div>
  );
}
