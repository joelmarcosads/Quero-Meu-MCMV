import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from './hooks/useAuth';
import { api } from './lib/api';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { LeadsPage } from './pages/LeadsPage';
import { ContatosPage } from './pages/ContatosPage';
import { OportunidadesPage } from './pages/OportunidadesPage';
import { NotFoundPage } from './pages/NotFoundPage';
import type { Usuario } from './types';

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.me()
      .then(data => { setUser(data as Usuario); setLoading(false); })
      .catch(err => {
        const msg = err instanceof Error ? err.message : 'Erro de autenticação';
        setError(msg);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Verificando autenticação…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-sm w-full bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm">
          <span className="text-4xl">🔒</span>
          <h2 className="text-lg font-semibold text-gray-800 mt-4">Acesso restrito</h2>
          <p className="text-sm text-gray-500 mt-2">{error}</p>
          <p className="text-xs text-gray-400 mt-4">
            Este painel requer autorização via Cloudflare Access.
            Verifique sua sessão ou entre em contato com o administrador.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading: false, error: null }}>
      {children}
    </AuthContext.Provider>
  );
}

export function App() {
  return (
    <BrowserRouter basename="/admin">
      <AuthProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="leads/:id" element={<LeadsPage />} />
            <Route path="contatos" element={<ContatosPage />} />
            <Route path="contatos/:id" element={<ContatosPage />} />
            <Route path="oportunidades" element={<OportunidadesPage />} />
            <Route path="oportunidades/:id" element={<OportunidadesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
