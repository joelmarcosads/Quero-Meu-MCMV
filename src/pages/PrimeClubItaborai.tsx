import Header from '../components/Header';
import Footer from '../components/Footer';
import { m as motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, MapPin, Home, Shield, Trees, Info, MessageCircle } from 'lucide-react';

export default function PrimeClubItaborai() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Prime Club Itaboraí | Apartamentos 2 Quartos, Minha Casa Minha Vida</title>
        <meta name="description" content="Lançamento Prime Club em Itaboraí - RJ. Apartamentos 2 Quartos em condomínio fechado. Sinal a partir de R$ 1.000 e Subsídio até R$ 55 mil. Compre pela Caixa." />
        <meta name="keywords" content="Prime Club Itaboraí, Apartamento Itaboraí, Minha casa minha vida Itaboraí, imóveis Itaboraí, apartamento planta, comprar apartamento Itaboraí, subsídio caixa" />
<link rel="canonical" href="https://www.queromeumcmv.com.br/prime-club-itaborai" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.queromeumcmv.com.br/prime-club-itaborai/capa-do-site-prime-club-itaborai.webp" />
        <meta property="og:title" content="Prime Club Itaboraí | Apartamentos 2 Quartos, Minha Casa Minha Vida" />
        <meta property="og:description" content="Lançamento Prime Club em Itaboraí - RJ. Apartamentos 2 Quartos em condomínio fechado. Sinal a partir de R$ 1.000 e Subsídio até R$ 55 mil. Compre pela Caixa." />
        
        {/* GEO Tags */}
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="Itaboraí" />
        
        {/* Schema.org for RealEstateListing */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "RealEstateListing",
              "name": "Prime Club Itaboraí",
              "description": "Apartamentos de 2 Quartos em Condomínio Clube em Itaboraí",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Itaboraí",
                "addressRegion": "RJ",
                "addressCountry": "BR"
              },
              "offers": {
                "@type": "Offer",
                "priceCurrency": "BRL",
                "description": "Sinal a partir de R$ 1.000 com subsídio de até R$ 55 mil"
              }
            }
          `}
        </script>
      </Helmet>
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="/prime-club-itaborai/capa-do-site-prime-club-itaborai.webp" 
              alt="Apartamentos de 2 quartos em condomínio clube Prime Club em Itaboraí RJ" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/75"></div>
          </div>
          
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <span className="inline-block py-1.5 px-4 rounded-full bg-accent text-white text-sm font-bold tracking-widest mb-6 uppercase shadow-lg">
                Lançamento Imobiliário em Itaboraí - RJ
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-white drop-shadow-md">
                Prime Club Itaboraí: Apartamentos de 2 Quartos em Condomínio Clube
              </h1>
              <p className="text-xl md:text-2xl text-slate-200 mb-10 text-justify md:text-center leading-relaxed font-medium">
                Transforme o valor do aluguel na parcela do seu apartamento próprio. Viva com total segurança, conforto e lazer completo. Financiamento facilitado pelo <strong className="text-white">Minha Casa Minha Vida</strong>.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center w-full sm:w-1/3">
                  <span className="block text-sm font-semibold text-blue-200 mb-1">Entrada Facilitada</span>
                  <span className="block text-2xl font-bold text-accent">Sinal de R$ 1.000</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center w-full sm:w-1/3">
                  <span className="block text-sm font-semibold text-blue-200 mb-1">Programa do Governo</span>
                  <span className="block text-2xl font-bold text-accent">Subsídio até R$ 55 Mil</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-center w-full sm:w-1/3">
                  <span className="block text-sm font-semibold text-blue-200 mb-1">Garantia Construtiva</span>
                  <span className="block text-2xl font-bold text-accent">Caixa Econômica</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a 
                  href="https://wa.me/5521965928399" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-success hover:bg-green-600 text-white font-bold text-lg py-4 px-8 rounded-xl shadow-xl shadow-green-600/30 transition-transform transform hover:-translate-y-1 flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Fazer Simulação de Financiamento
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Detalhes do Projeto - Neuromarketing: foco em segurança, pertencimento e independência */}
        <section id="detalhes" className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                  A Privacidade e Segurança que sua Família Merece
                </h2>
                <p className="text-lg text-slate-600 text-justify mb-6 leading-relaxed">
                  O <strong>Prime Club Itaboraí</strong>, desenvolvido pela renomada Realiza Construtora, foi pensado para quem busca conforto e modernidade. Morar em um <strong>condomínio clube</strong> significa ter acesso a diversas opções de lazer, segurança para sua família e a praticidade de estar bem localizado.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Apartamentos de 2 quartos com acabamento impecável",
                    "Condomínio clube com área de lazer completa",
                    "Controle de acesso e portaria 24 horas para sua proteção",
                    "Condições exclusivas pelo programa Minha Casa Minha Vida 2024"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle2 className="w-6 h-6 text-success mr-3 shrink-0 mt-0.5" />
                      <span className="text-slate-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/prime-club-itaborai/area-de-lazer-com-piscina-prime-club-itaborai.webp" 
                  alt="Piscina do condomínio Prime Club em Itaboraí" 
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Lazer Completo - Apelo Emocional e Exclusividade */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                Qualidade de Vida de um Resort sem Sair de Casa
              </h2>
              <p className="text-lg text-slate-600">
                Por que viajar no final de semana se você pode viver em um verdadeiro clube? Ofereça entretenimento saudável, contato com a natureza e diversão segura para seus filhos todos os dias.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { icon: <Trees />, title: "Piscinas Climatizadas", desc: "Estrutura adulto e infantil" },
                { icon: <Home />, title: "Salão de Festas", desc: "Com churrasqueira e forno de pizza" },
                { icon: <CheckCircle2 />, title: "Redário e Pomar", desc: "Contato direto com a natureza" },
                { icon: <Shield />, title: "Condomínio Fechado", desc: "Segurança 24 horas garantida" },
                { icon: <Info />, title: "Quadra e Academia", desc: "Esporte e saúde a poucos passos" },
                { icon: <CheckCircle2 />, title: "Pet Place", desc: "Diversão ao ar livre para seu pet" },
                { icon: <Home />, title: "Playground Moderno", desc: "Espaço seguro para as crianças" },
                { icon: <Info />, title: "Minimercado Autônomo", desc: "Conveniência e praticidade 24h" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Localização Estratégica - GEO SEO (Otimização Local) */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
                <img 
                  src="/prime-club-itaborai/localizacao-prime-club-itaborai.webp" 
                  alt="Mapa de localização do condomínio Prime Club em Itaboraí, RJ" 
                  className="w-full h-auto object-cover rounded-2xl aspect-video"
                />
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full mb-6">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span className="font-semibold tracking-wide uppercase text-sm">Itaboraí - RJ</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight">
                  Localização Estratégica: Praticidade no seu Dia a Dia em Itaboraí, RJ
                </h2>
                <p className="text-lg text-blue-100 text-justify mb-8 leading-relaxed">
                  Ganhe tempo para o que realmente importa. O Prime Club fica em uma região de alto crescimento comercial e valorização imobiliária em Itaboraí, garantindo que sua família tenha escolas, comércio e transporte sempre por perto.
                </p>
                <ul className="space-y-4">
                  {[
                    "A apenas 10 minutos do Centro Comercial de Itaboraí",
                    "Proximidade com o Colégio Municipal e Faculdade Anhanguera",
                    "Acesso fácil ao transporte público (ponto de ônibus a 600m)",
                    "Região tranquila, livre de enchentes e em franca valorização"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <div className="w-2 h-2 bg-accent rounded-full mr-4 shrink-0"></div>
                      <span className="font-medium text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* AEO / FAQ SEO - Respondendo dúvidas diretas dos usuários (Answer Engine Optimization) */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                Principais Dúvidas sobre o Prime Club (FAQ)
              </h2>
              <p className="text-lg text-slate-600">
                Encontre respostas diretas para as perguntas mais comuns de quem busca comprar apartamento em Itaboraí.
              </p>
            </div>
            
            <div className="space-y-6">
              {[
                {
                  q: "Onde fica localizado o condomínio Prime Club?",
                  a: "O condomínio fechado Prime Club está estrategicamente localizado em Itaboraí, RJ. Com acesso rápido a escolas e comércios da região, trazendo total facilidade para sua rotina."
                },
                {
                  q: "Os apartamentos no Prime Club possuem vaga de garagem?",
                  a: "Sim. O Prime Club oferece apartamentos de 2 quartos com direito a vaga de garagem, proporcionando mais segurança e conforto para você e sua família."
                },
                {
                  q: "Como comprar apartamento pelo Minha Casa Minha Vida em Itaboraí?",
                  a: "É muito simples. O Prime Club está aprovado pelo programa Minha Casa Minha Vida (MCMV) da Caixa Econômica Federal. Você pode utilizar seu FGTS como parte da entrada, aproveitar taxas de juros reduzidas e garantir o subsídio do governo de acordo com a sua renda familiar."
                },
                {
                  q: "Quais opções de lazer o condomínio clube oferece?",
                  a: "A área de lazer do condomínio é uma das mais completas da região, incluindo: piscinas adulto e infantil, academia equipada, salão de festas com churrasqueira, playground infantil, espaço pet (pet place), quadra de esportes e muito mais."
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{faq.q}</h3>
                  <p className="text-slate-600 text-justify leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action Final - Gatilho de Escassez e Urgência */}
        <section className="py-16 bg-slate-100 border-t border-slate-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4">
              A oportunidade de sair do aluguel está acabando.
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Os apartamentos no Prime Club têm alta procura em Itaboraí. Fale com um de nossos corretores credenciados e garanta as melhores condições de lançamento.
            </p>
            <a 
              href="https://wa.me/5521965928399" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-success hover:bg-green-700 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-xl shadow-green-600/30 text-lg transform hover:-translate-y-1"
            >
              Consultar Disponibilidade e Valores
            </a>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}

