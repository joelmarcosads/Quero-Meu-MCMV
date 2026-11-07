import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar }   from './Sidebar';
import { Header }    from './Header';
import { BottomNav } from './BottomNav';

const PAGE_TITLES: Record<string, string> = {
  '/':              'Dashboard',
  '/leads':         'Leads',
  '/contatos':      'Contatos',
  '/oportunidades': 'Pipeline de Oportunidades',
};

export function AppLayout() {
  const { pathname }        = useLocation();
  const basePath            = '/' + pathname.split('/')[1];
  const title               = PAGE_TITLES[basePath] ?? 'Market Imobi CRM';
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ background: '#071426' }}>
      {/* Sidebar — hidden on mobile (overlay), always shown on lg+ */}
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} onMenuOpen={() => setMenuOpen(true)} />

        {/* pb-20 no mobile para não esconder conteúdo atrás da BottomNav */}
        <main className="flex-1 overflow-auto p-3 sm:p-5 lg:p-6 pb-20 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Barra de navegação inferior — mobile only (< lg) */}
      <BottomNav />
    </div>
  );
}
