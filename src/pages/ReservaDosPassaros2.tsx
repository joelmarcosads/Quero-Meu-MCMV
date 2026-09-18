import Header from '../components/Header';
import Footer from '../components/Footer';
import { m as motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, MapPin, Home, Shield, Trees, Info, MessageCircle } from 'lucide-react';
import { gerarLinkWhatsApp } from '../utils/whatsapp';
const imgFachada = '/fachada-da-casa-reserva-dos-passaros.webp';
const imgPiscina = '/piscina-reserva-dos-passaros-2.webp';
const imgMapa = '/mapa-reserva-dos-passaros-2.webp';

export default function ReservaDosPassaros2() {
  const nomeEmpreendimento = "Reserva dos Pássaros 2";
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Reserva dos Pássaros 2 | Casas 2 Quartos em Condomínio, Itaboraí</title>
        <meta name="description" content="Lançamento Reserva dos Pássaros 2 em Itaboraí. Casas de 2 quartos em condomínio fechado. Sinal de R$ 1.000, subsídio MCMV e garantia Caixa." />
        <link rel="canonical" href="https://queromeumcmv.com.br/reserva-dos-passaros-2" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://queromeumcmv.com.br/reserva-dos-passaros-2" />
        <meta property="og:title" content="Reserva dos Pássaros 2 | Casas 2 Quartos em Condomínio, Itaboraí" />
        <meta property="og:description" content="Lançamento Reserva dos Pássaros 2 em Itaboraí. Casas de 2 quartos em condomínio fechado. Sinal de R$ 1.000, subsídio MCMV e garantia Caixa." />
        <meta property="og:image" content="https://queromeumcmv.com.br/fachada-da-casa-reserva-dos-passaros.webp" />
        <meta property="og:image:alt" content="Fachada da casa no Reserva dos Pássaros 2 em Itaboraí" />
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="Itaboraí" />
        <link rel="preload" as="image" href="/fachada-da-casa-reserva-dos-passaros.webp" />
        <script type="application/ld+json">
          {`
            {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://queromeumcmv.com.br/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "MCMV Itaboraí",
          "item": "https://queromeumcmv.com.br/minha-casa-minha-vida-itaborai"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Reserva dos Pássaros 2",
          "item": "https://queromeumcmv.com.br/reserva-dos-passaros-2"
        }
      ]
    },
    {
      "@type": "RealEstateListing",
      "name": "Reserva dos Pássaros 2",
      "description": "Casas de 2 Quartos em Condomínio Clube em Itaboraí",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Itaboraí",
        "addressRegion": "RJ",
        "addressCountry": "BR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "-22.7483",
        "longitude": "-42.8594"
      },
      "builder": {
        "@type": "Organization",
        "name": "Realiza Construtora"
      },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "BRL",
        "description": "Sinal a partir de R$ 1.000 com subsídio de até R$ 55 mil"
      },
      "amenityFeature": [
        {
          "@type": "LocationFeatureSpecification",
          "name": "Piscinas Climatizadas (Adulto e Infantil)",
          "value": "True"
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Salão de Festas com Churrasqueira",
          "value": "True"
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Academia",
          "value": "True"
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Pet Place",
          "value": "True"
        },
        {
          "@type": "LocationFeatureSpecification",
          "name": "Segurança 24 horas",
          "value": "True"
        }
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Onde fica localizado o condomínio Reserva dos Pássaros 2?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "O condomínio fechado Reserva dos Pássaros 2 está localizado no bairro Retiro São Joaquim (região da Vila Rica), em Itaboraí, RJ. Em apenas 10 minutos você chega ao Centro, com fácil acesso à Avenida 22 de Maio, escolas, comércio e transporte."
          }
        },
        {
          "@type": "Question",
          "name": "As casas no Reserva dos Pássaros 2 são geminadas?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Não, as casas do Reserva dos Pássaros 2 são 100% independentes (não geminadas). Este é o grande diferencial da Realiza Construtora, garantindo que você não sofra com barulhos de parede-meia de vizinhos, com lotes privativos a partir de 150m² e amplo quintal."
          }
        },
        {
          "@type": "Question",
          "name": "Como comprar casa pelo Minha Casa Minha Vida em Itaboraí?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Basta usar o programa Minha Casa Minha Vida da Caixa Econômica Federal. O Reserva dos Pássaros 2 é totalmente aprovado pela Caixa, permitindo usar o seu saldo do FGTS, contar com subsídios do governo de até R$ 55 mil e juros menores."
          }
        },
        {
          "@type": "Question",
          "name": "Quais opções de lazer o condomínio clube oferece?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "O condomínio oferece estrutura completa de resort: piscinas climatizadas (adulto e infantil), academia, salão de festas com churrasqueira, playground, pet place, quadra de esportes, pomar, redário e minimercado autônomo 24 horas."
          }
        }
      ]
    }
  ]
}
          `}
        </script>
      </Helmet>
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img fetchPriority="high" 
              src={imgFachada} 
              alt="Casas de 2 quartos em condomínio fechado Reserva dos Pássaros 2 em Itaboraí RJ" 
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
                Reserva dos Pássaros 2: Casa de 2 Quartos em Condomínio Clube em Itaboraí
              </h1>
              <p className="text-xl md:text-2xl text-slate-200 mb-10 text-justify md:text-center leading-relaxed font-medium">
                Dê adeus ao barulho de apartamentos geminados e conquiste seu quintal privativo. Viva com total segurança, liberdade e lazer de resort. Financiamento facilitado com a chancela da <strong className="text-white">Realiza Construtora</strong> e garantia da <strong className="text-white">Caixa Econômica Federal</strong>.
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
                  href={`https://wa.me/5521965928399?text=${encodeURIComponent("Olá! Quero fazer uma simulação de financiamento para o Reserva dos Pássaros 2 com entrada de R$ 1.000.")}`}
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
                  O <strong>Reserva dos Pássaros 2</strong>, desenvolvido pela renomada Realiza Construtora, foi pensado para quem deseja dar um fim definitivo ao aluguel e valoriza o próprio espaço. Morar em uma <strong>casa 100% não geminada</strong> significa paz: nada de ouvir os passos do vizinho pela parede. Significa quintal privativo para seus filhos brincarem seguros e a garantia inabalável de um condomínio fechado padrão Caixa.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Casas de 2 quartos 100% independentes (não geminadas)",
                    "Terrenos amplos a partir de 150m² com espaço para sua própria área gourmet",
                    "Controle de acesso e portaria 24 horas para total proteção",
                    "Condições exclusivas pelo novo programa Minha Casa Minha Vida 2026"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle2 className="w-6 h-6 text-success mr-3 shrink-0 mt-0.5" />
                      <span className="text-slate-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video">
                <img loading="lazy" 
                  src={imgPiscina} 
                  alt="Piscina do condomínio Reserva dos Pássaros 2 em Itaboraí" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
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
              <div className="order-2 lg:order-1 relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-video">
                <img loading="lazy" 
                  src={imgMapa} 
                  alt="Mapa de localização do condomínio Reserva dos Pássaros 2 em Itaboraí, RJ" 
                  className="w-full h-full object-cover rounded-2xl aspect-video"
                />
              </div>
              <div className="order-1 lg:order-2">
                              <nav className="text-sm font-medium text-slate-300 mb-6" aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center space-x-2">
                  <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                  <li><span className="mx-2">&gt;</span></li>
                  <li><a href="/minha-casa-minha-vida-itaborai" className="hover:text-white transition-colors">MCMV Itaboraí</a></li>
                  <li><span className="mx-2">&gt;</span></li>
                  <li className="text-orange-300" aria-current="page">Reserva dos Pássaros 2</li>
                </ol>
              </nav>

              <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full mb-6">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span className="font-semibold tracking-wide uppercase text-sm">Vila Rica / Retiro São Joaquim - Itaboraí</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight">
                  Localização Estratégica: Praticidade no seu Dia a Dia em Itaboraí, RJ
                </h2>
                <p className="text-lg text-blue-100 text-justify mb-8 leading-relaxed">
                  Ganhe tempo para o que realmente importa. O Reserva dos Pássaros 2 fica em uma região de alto crescimento comercial e valorização imobiliária em Itaboraí, garantindo que sua família tenha escolas, comércio e transporte sempre por perto.
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
                Principais Dúvidas sobre o Reserva dos Pássaros 2 (FAQ)
              </h2>
              <p className="text-lg text-slate-600">
                Encontre respostas diretas para as perguntas mais comuns de quem busca comprar casa em Itaboraí.
              </p>
            </div>
            
            <div className="space-y-6">
              {[
                {
                  q: "Onde fica localizado o condomínio Reserva dos Pássaros 2?",
                  a: "O condomínio fechado Reserva dos Pássaros 2 está localizado no bairro Retiro São Joaquim (região da Vila Rica), em Itaboraí, RJ. Em apenas 10 minutos você chega ao Centro, com fácil acesso à Avenida 22 de Maio, escolas e comércios estratégicos da Região Metropolitana."
                },
                {
                  q: "As casas no Reserva dos Pássaros 2 são geminadas?",
                  a: "Não, as casas do Reserva dos Pássaros 2 são 100% independentes (não geminadas). Este é o grande diferencial da Realiza Construtora, garantindo que você não sofra com barulhos de parede-meia, em lotes privativos a partir de 150m² com amplo quintal."
                },
                {
                  q: "Como comprar casa pelo Minha Casa Minha Vida em Itaboraí?",
                  a: "Basta usar o programa Minha Casa Minha Vida da Caixa Econômica Federal. O Reserva dos Pássaros 2 é totalmente aprovado pela Caixa, permitindo usar o seu saldo do FGTS, contar com subsídios do governo de até R$ 55 mil e juros reduzidos."
                },
                {
                  q: "Quais opções de lazer o condomínio clube oferece?",
                  a: "O condomínio oferece estrutura completa de resort: piscinas climatizadas (adulto e infantil), academia, salão de festas com churrasqueira, playground, pet place, quadra de esportes, pomar, redário e minimercado autônomo 24 horas."
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
              As unidades não geminadas da Realiza Construtora em Itaboraí possuem disponibilidade rigorosamente limitada na fase de lançamento. Fale com um corretor para assegurar as melhores condições.
            </p>
            <a 
              href={`https://wa.me/5521965928399?text=${encodeURIComponent("Olá! Gostaria de consultar a tabela de valores e as unidades disponíveis do Reserva dos Pássaros 2.")}`}
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

