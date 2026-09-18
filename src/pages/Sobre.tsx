import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { UserCheck, Award, Target, Home, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Sobre() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Joel Marcos - Corretor de Imóveis",
    "image": "https://queromeumcmv.com.br/logo.svg",
    "@id": "https://queromeumcmv.com.br/sobre",
    "url": "https://queromeumcmv.com.br/sobre",
    "telephone": "5521990422111",
    "description": "Corretor de imóveis especializado no programa Minha Casa Minha Vida em Itaboraí, São Gonçalo e região.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Itaboraí",
      "addressRegion": "RJ",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-22.7483",
      "longitude": "-42.8601"
    },
    "areaServed": ["Itaboraí", "São Gonçalo", "Niterói", "Maricá"],
    "knowsAbout": ["Minha Casa Minha Vida", "Financiamento Habitacional", "Subsídio do Governo", "Imóveis na Planta", "Caixa Econômica Federal"]
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Sobre Nós | Joel Marcos - Corretor de Imóveis MCMV</title>
        <meta name="description" content="Conheça Joel Marcos, corretor de imóveis CRECI 39.583F especialista no Minha Casa Minha Vida em Itaboraí e São Gonçalo. Transparência e segurança." />
        <link rel="canonical" href="https://queromeumcmv.com.br/sobre" />
        <meta property="og:title" content="Sobre Nós | Joel Marcos - Corretor de Imóveis MCMV" />
        <meta property="og:description" content="Conheça Joel Marcos, corretor especialista em imóveis do Minha Casa Minha Vida em Itaboraí e São Gonçalo." />
        <meta property="og:url" content="https://queromeumcmv.com.br/sobre" />
        <meta property="og:type" content="profile" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <Header />
      
      <main>
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary-light font-medium text-sm mb-4 border border-primary/30">
              Conheça Nossa História
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Sobre o Quero Meu MCMV</h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Transparência, ética e dedicação para ajudar você a conquistar o sonho da casa própria com segurança jurídica.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Joel Marcos</h2>
                <div className="inline-flex items-center text-primary font-bold mb-6 bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  Corretor de Imóveis • CRECI 39.583F
                </div>
                <p className="text-slate-700 mb-4 leading-relaxed text-justify">
                  Olá! Sou Joel Marcos, corretor de imóveis devidamente credenciado e especialista técnico no programa Minha Casa Minha Vida. Atuo com forte presença e liderança de vendas nas cidades de Itaboraí, São Gonçalo e Niterói, orientando famílias em todo o processo de aquisição da casa própria.
                </p>
                <p className="text-slate-700 mb-4 leading-relaxed text-justify">
                  Acredito que a compra de um imóvel vai muito além de tijolo e cimento; trata-se de segurança, dignidade e futuro. Por isso, meu compromisso é oferecer um atendimento humano e 100% transparente, sem falsas promessas, baseando-me estritamente nas regras normativas da Caixa Econômica Federal e das maiores construtoras parceiras do mercado (como MRV, Direcional, Cury e outras).
                </p>
                <p className="text-slate-700 leading-relaxed text-justify">
                  O portal <strong>Quero Meu MCMV</strong> nasceu da necessidade de simplificar a informação. Aqui você encontra um guia claro e honesto sobre <Link to="/renda-minha-casa-minha-vida" className="text-primary hover:underline">faixas de renda</Link>, <Link to="/subsidio-minha-casa-minha-vida" className="text-primary hover:underline">subsídios</Link> e regras do programa.
                </p>
              </div>
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6 text-center border-b pb-4">Nossos Pilares E-E-A-T</h3>
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <Award className="w-8 h-8 text-accent shrink-0 mr-4 mt-1" />
                    <div>
                      <strong className="block text-slate-900">Expertise (Especialização)</strong>
                      <span className="text-sm text-slate-600 text-justify block mt-1">Foco total no Minha Casa Minha Vida e nas regras de aprovação da Caixa Econômica, dominando os processos de ponta a ponta.</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <UserCheck className="w-8 h-8 text-accent shrink-0 mr-4 mt-1" />
                    <div>
                      <strong className="block text-slate-900">Experiência Humana</strong>
                      <span className="text-sm text-slate-600 text-justify block mt-1">Cada cliente tem uma realidade. Analisamos sua renda e capacidade com empatia, mantendo total sigilo bancário e pessoal.</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Target className="w-8 h-8 text-accent shrink-0 mr-4 mt-1" />
                    <div>
                      <strong className="block text-slate-900">Autoridade e Confiança</strong>
                      <span className="text-sm text-slate-600 text-justify block mt-1">Registro profissional regular (CRECI-RJ) e transparência comercial. O cliente sabe exatamente quanto vai pagar, sem taxas ocultas.</span>
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
              <Link to="/minha-casa-minha-vida-itaborai" className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center group border border-slate-100 hover:border-primary">
                <Home className="w-10 h-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-slate-900">Itaboraí - RJ</span>
                <span className="text-xs text-slate-500 mt-1">Ver lançamentos</span>
              </Link>
              <Link to="/minha-casa-minha-vida-sao-goncalo" className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center group border border-slate-100 hover:border-primary">
                <Home className="w-10 h-10 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-slate-900">São Gonçalo - RJ</span>
                <span className="text-xs text-slate-500 mt-1">Ver lançamentos</span>
              </Link>
              <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col items-center border border-slate-100">
                <Home className="w-10 h-10 text-slate-400 mb-3" />
                <span className="font-bold text-slate-900">Niterói & Maricá</span>
                <span className="text-xs text-slate-400 mt-1">Atendimento Regional</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
