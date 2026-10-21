import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Página Não Encontrada | Quero Meu MCMV</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 text-center py-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-4">404</h1>
        <h2 className="text-xl md:text-2xl text-slate-700 mb-4">Página não encontrada</h2>
        <p className="text-slate-600 mb-8 max-w-md">
          A página que você está procurando não existe ou foi movida. Se você procura opções de imóveis pelo Minha Casa Minha Vida, preencha o formulário abaixo:
        </p>
        <div className="w-full max-w-xl mx-auto text-left mb-8 shadow-xl rounded-2xl overflow-hidden">
          <LeadForm />
        </div>
        <Link 
          to="/" 
          className="text-primary hover:underline font-semibold"
        >
          ← Voltar para a Página Inicial
        </Link>
      </main>
      <Footer />
    </div>
  );
}
