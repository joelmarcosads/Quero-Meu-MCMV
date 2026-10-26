import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import { Home, MapPin, MessageCircle, AlertTriangle } from 'lucide-react';
import { gerarLinkWhatsApp } from '../utils/whatsapp';

export default function NotFound() {
  const whatsappUrl = gerarLinkWhatsApp(
    'Página 404',
    'Falar com corretor no WhatsApp'
  );

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 selection:bg-accent selection:text-white">
      <Helmet>
        <title>Página Não Encontrada | Quero Meu MCMV</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-bold tracking-wider uppercase mb-4">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Erro 404</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Página não encontrada
        </h1>

        <p className="text-slate-600 mb-8 max-w-xl text-base sm:text-lg leading-relaxed">
          O link que você tentou acessar não existe, mudou de endereço ou foi desativado. Mas não se preocupe! Você pode explorar as opções do Minha Casa Minha Vida pelos links abaixo ou falar diretamente com nosso corretor:
        </p>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10 max-w-2xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-primary hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-sm text-sm"
          >
            <Home className="w-4 h-4" />
            <span>Página Inicial</span>
          </Link>

          <Link
            to="/minha-casa-minha-vida-itaborai"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-semibold py-2.5 px-5 rounded-xl border border-slate-200 transition-all shadow-sm text-sm"
          >
            <MapPin className="w-4 h-4 text-accent" />
            <span>MCMV Itaboraí</span>
          </Link>

          <Link
            to="/minha-casa-minha-vida-sao-goncalo"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-800 font-semibold py-2.5 px-5 rounded-xl border border-slate-200 transition-all shadow-sm text-sm"
          >
            <MapPin className="w-4 h-4 text-accent" />
            <span>MCMV São Gonçalo</span>
          </Link>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-success hover:bg-green-700 text-white font-semibold py-2.5 px-5 rounded-xl transition-all shadow-sm text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Falar no WhatsApp</span>
          </a>
        </div>

        {/* Lead Form Section */}
        <div className="w-full max-w-xl mx-auto text-left shadow-xl rounded-2xl overflow-hidden bg-white border border-slate-100">
          <div className="p-4 sm:p-6 bg-slate-900 text-white text-center">
            <h2 className="text-xl sm:text-2xl font-bold">Simule seu Minha Casa Minha Vida</h2>
            <p className="text-slate-300 text-sm mt-1">Preencha abaixo para receber opções personalizadas</p>
          </div>
          <LeadForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
