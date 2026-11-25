// Rastreio de clique no WhatsApp — ÚNICA conversão contabilizada no clique.
// Formulários NÃO geram conversão no clique: eles são contabilizados apenas
// nas páginas de obrigado (lead_compra_imovel / lead_captacao_imovel).
//
// Dispara na dataLayer o evento "clique_whatsapp" para qualquer link que abra o
// WhatsApp (wa.me, api.whatsapp.com, web.whatsapp.com, whatsapp://), em todas as
// páginas, inclusive botões criados depois do carregamento.

declare global {
  interface Window {
    __waTrackInstalled?: boolean;
  }
}

const WA_RE = /^(?:https?:\/\/(?:wa\.me|api\.whatsapp\.com|web\.whatsapp\.com|chat\.whatsapp\.com)\/|whatsapp:)/i;
let lastClick = 0;

function local(el: Element): string {
  try {
    if (window.getComputedStyle(el).position === 'fixed') return 'botao_flutuante';
  } catch (_) {}
  if (el.closest('header')) return 'cabecalho';
  if (el.closest('footer')) return 'rodape';
  return 'conteudo';
}

export function installWhatsAppTracking(): void {
  if (typeof window === 'undefined' || window.__waTrackInstalled) return;
  window.__waTrackInstalled = true;

  document.addEventListener(
    'click',
    (ev) => {
      const a = (ev.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a || !WA_RE.test(a.href)) return;
      const now = Date.now();
      if (now - lastClick < 800) return; // evita contagem dupla em clique duplo
      lastClick = now;
      try {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: 'clique_whatsapp',
          wa_local: local(a),
          wa_texto: (a.textContent || a.getAttribute('aria-label') || '').trim().slice(0, 80),
          pagina: window.location.pathname,
        });
      } catch (_) {
        /* rastreio nunca bloqueia a abertura do WhatsApp */
      }
    },
    true
  );
}
