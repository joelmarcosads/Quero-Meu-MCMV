import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <span className="text-5xl">🏚️</span>
      <h2 className="text-xl font-semibold text-gray-700">Página não encontrada</h2>
      <p className="text-sm text-gray-500">O endereço que você acessou não existe neste painel.</p>
      <Link
        to="/"
        className="mt-2 px-4 py-2 bg-[#1e3a5f] text-white text-sm font-medium rounded-lg hover:bg-[#152a45] transition-colors"
      >
        Ir para o Dashboard
      </Link>
    </div>
  );
}
