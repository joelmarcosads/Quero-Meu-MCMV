import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const PAGE_TITLES: Record<string, string> = {
  '/':              'Dashboard',
  '/leads':         'Leads',
  '/contatos':      'Contatos',
  '/oportunidades': 'Pipeline de Oportunidades',
};

export function AppLayout() {
  const { pathname } = useLocation();
  const basePath = '/' + pathname.split('/')[1];
  const title = PAGE_TITLES[basePath] ?? 'Market Imobi CRM';

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
