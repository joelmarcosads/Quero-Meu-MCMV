import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  const app = (
    <StrictMode>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </StrictMode>
  );

  if (rootElement.hasChildNodes()) {
    hydrateRoot(rootElement, app);
  } else {
    createRoot(rootElement).render(app);
  }
} else {
  // Suporte a carregamento direto em arquivos HTML estáticos específicos se houver
  const ownerFormRoot = document.getElementById('owner-form-root');
  if (ownerFormRoot) {
    import('./components/OwnerForm').then(({ default: OwnerForm }) => {
      createRoot(ownerFormRoot).render(
        <StrictMode>
          <OwnerForm />
        </StrictMode>
      );
    });
  }

  const obrigadoRoot = document.getElementById('obrigado-app');
  if (obrigadoRoot) {
    import('./components/ObrigadoImovel').then(({ default: ObrigadoImovel }) => {
      createRoot(obrigadoRoot).render(
        <StrictMode>
          <ObrigadoImovel />
        </StrictMode>
      );
    });
  }
}
