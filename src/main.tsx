import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const isObrigadoRoute =
  typeof window !== 'undefined' &&
  (window.location.pathname === '/obrigado.imoveis' ||
    window.location.pathname === '/obrigado.imoveis/' ||
    window.location.pathname.startsWith('/obrigado.imoveis') ||
    window.location.pathname === '/obrigado' ||
    window.location.pathname === '/obrigado/' ||
    window.location.pathname.startsWith('/obrigado'));

if (isObrigadoRoute) {
  // Se a rota for /obrigado.imoveis ou /obrigado mas o elemento não tiver sido renderizado estaticamente
  if (!document.getElementById('obrigado-imovel')) {
    import('./components/ObrigadoImovel').then(({ default: ObrigadoImovel }) => {
      document.body.innerHTML = '<div id="obrigado-app"></div>';
      const rootEl = document.getElementById('obrigado-app');
      if (rootEl) {
        createRoot(rootEl).render(
          <React.StrictMode>
            <ObrigadoImovel />
          </React.StrictMode>
        );
      }
    });
  }
} else {
  let formLoaded = false;
  let rootInstance: ReturnType<typeof createRoot> | null = null;

  const mountOwnerForm = async () => {
    if (formLoaded) return;
    const container = document.getElementById('owner-form-root');
    if (!container) return;
    formLoaded = true;

    try {
      const { default: OwnerForm } = await import('./components/OwnerForm');
      if (!rootInstance) {
        rootInstance = createRoot(container);
      }
      rootInstance.render(
        <React.StrictMode>
          <OwnerForm />
        </React.StrictMode>
      );
    } catch (err) {
      console.error('Erro ao inicializar formulário de avaliação:', err);
      formLoaded = false;
    }
  };

  // 1. Carrega imediatamente quando qualquer CTA que aponte para #avaliacao for acionado
  const setupCtaTriggers = () => {
    const ctaElements = document.querySelectorAll(
      'a[href="#avaliacao"], button[data-scroll="#avaliacao"], .trigger-form-load'
    );

    ctaElements.forEach((el) => {
      el.addEventListener('click', () => mountOwnerForm(), { once: true });
      el.addEventListener('pointerenter', () => mountOwnerForm(), { once: true });
      el.addEventListener('focus', () => mountOwnerForm(), { once: true });
    });
  };

  // 2. Carrega via requestIdleCallback quando o navegador estiver ocioso
  if (typeof window !== 'undefined') {
    if ('requestIdleCallback' in window) {
      (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void }).requestIdleCallback(
        () => mountOwnerForm(),
        { timeout: 2500 }
      );
    } else {
      setTimeout(() => mountOwnerForm(), 1200);
    }

    // 3. Fallback de rolagem com IntersectionObserver antes do usuário chegar na seção
    if ('IntersectionObserver' in window) {
      const target = document.getElementById('avaliacao');
      if (target) {
        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                mountOwnerForm();
                observer.disconnect();
                break;
              }
            }
          },
          { rootMargin: '350px' }
        );
        observer.observe(target);
      }
    }

    // 4. Configura ouvintes dos CTAs assim que o DOM estiver pronto
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupCtaTriggers);
    } else {
      setupCtaTriggers();
    }
  }
}
