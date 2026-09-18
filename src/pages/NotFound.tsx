import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Página Não Encontrada | Quero Meu MCMV</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-4">404</h1>
        <h2 className="text-xl md:text-2xl text-slate-700 mb-8">Página não encontrada</h2>
        <p className="text-slate-600 mb-8 max-w-md">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link 
          to="/" 
          className="bg-accent hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg"
        >
          Voltar para o Início
        </Link>
      </main>
      <Footer />
    </div>
  );
}
