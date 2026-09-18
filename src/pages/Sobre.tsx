import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { UserCheck, Award, Clock, Target, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sobre() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Sobre Nós | Joel Marcos - Corretor de Imóveis MCMV</title>
        <meta name="description" content="Conheça Joel Marcos, corretor de imóveis CRECI 39.583F especialista em Minha Casa Minha Vida em Itaboraí, São Gonçalo e Niterói." />
        <link rel="canonical" href="https://queromeumcmv.com.br/sobre" />
        <meta property="og:title" content="Sobre Nós | Joel Marcos - Corretor de Imóveis MCMV" />
        <meta property="og:description" content="Conheça Joel Marcos, corretor especialista em imóveis do Minha Casa Minha Vida em Itaboraí e São Gonçalo." />
        <meta property="og:url" content="https://queromeumcmv.com.br/sobre" />
      </Helmet>
      <Header />
      
      <main>
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Sobre o Quero Meu MCMV</h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Transparência, ética e dedicação para ajudar você a conquistar o sonho da casa própria.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Joel Marcos</h2>
                <div className="inline-block bg-primary/10 text-primary font-bold px-4 py-2 rounded-full mb-6">
                  Corretor de Imóveis • CRECI 39.583F
                </div>
                <p className="text-slate-700 mb-4 leading-relaxed text-justify">
                  Olá! Sou Joel Marcos, especialista em financiamento imobiliário e no programa Minha Casa Minha Vida. Atuo com forte presença nas cidades de Itaboraí, São Gonçalo e Niterói, orientando famílias em todo o processo de aquisição da casa própria.
                </p>
                <p className="text-slate-700 mb-4 leading-relaxed text-justify">
                  Acredito que a compra de um imóvel vai muito além de tijolo e cimento; trata-se de segurança, dignidade e futuro. Por isso, meu compromisso é oferecer um atendimento humano e 100% transparente, sem falsas promessas, baseando-me estritamente nas regras da Caixa Econômica Federal e das construtoras parceiras.
                </p>
                <p className="text-slate-700 leading-relaxed text-justify">
                  Nosso escritório físico está localizado em Retiro São Joaquim, Itaboraí, onde atendemos com hora marcada para garantir total atenção à sua análise de crédito.
                </p>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6 text-center border-b pb-4">Nossos Pilares</h3>
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <Award className="w-8 h-8 text-accent shrink-0 mr-4" />
                    <div>
                      <strong className="block text-slate-900">Especialização</strong>
                      <span className="text-sm text-slate-600 text-justify block mt-1">Foco total no Minha Casa Minha Vida e nas regras de aprovação da Caixa Econômica.</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <UserCheck className="w-8 h-8 text-accent shrink-0 mr-4" />
                    <div>
                      <strong className="block text-slate-900">Atendimento Humano</strong>
                      <span className="text-sm text-slate-600 text-justify block mt-1">Cada cliente tem uma realidade. Analisamos sua renda e capacidade com empatia e sigilo.</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Target className="w-8 h-8 text-accent shrink-0 mr-4" />
                    <div>
                      <strong className="block text-slate-900">Transparência Comercial</strong>
                      <span className="text-sm text-slate-600 text-justify block mt-1">Não omitimos taxas de documentação e ITBI. O cliente sabe exatamente quanto vai pagar.</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Nossa Região de Atuação</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Link to="/minha-casa-minha-vida-itaborai" className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center group">
                <Home className="w-10 h-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-slate-900">Itaboraí</span>
              </Link>
              <Link to="/minha-casa-minha-vida-sao-goncalo" className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center group">
                <Home className="w-10 h-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-slate-900">São Gonçalo</span>
              </Link>
              <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center">
                <Home className="w-10 h-10 text-slate-400 mb-3" />
                <span className="font-bold text-slate-900">Niterói & Maricá</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
