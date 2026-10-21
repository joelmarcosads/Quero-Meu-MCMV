import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import { m as motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, MapPin, Home, Shield, Trees, Info, MessageCircle, Waves } from 'lucide-react';
import { gerarLinkWhatsApp } from '../utils/whatsapp';
const imgFachada = '/fachada-flores-de-maio.webp';
const imgMapa = '/mapa-da-localizacao-flores-de-maio.webp';

export default function FloresDeMaio() {
  const nomeEmpreendimento = "Flores de Maio";
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Flores de Maio | Apartamentos 2 Quartos, Minha Casa Minha Vida</title>
        <meta name="description" content="Conheça o Flores de Maio em Santo Expedito, Itaboraí - RJ. Apartamentos com varanda, sinal a partir de R$ 1.000 e subsídio Caixa." />
<link rel="canonical" href="https://queromeumcmv.com.br/flores-de-maio" />
        <meta property="fb:app_id" content="966242223397117" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://queromeumcmv.com.br/flores-de-maio" />
        <meta property="og:image" content="https://queromeumcmv.com.br/fachada-flores-de-maio.webp" />
        <meta property="og:image:alt" content="Fachada do condomínio Flores de Maio em Itaboraí" />
        <meta property="og:title" content="Flores de Maio | Apartamentos 2 Quartos, Minha Casa Minha Vida" />
        <meta property="og:description" content="Conheça o Flores de Maio em Santo Expedito, Itaboraí - RJ. Apartamentos com varanda, sinal a partir de R$ 1.000 e subsídio Caixa." />
        <meta property="og:site_name" content="Quero Meu MCMV" />
        <meta property="og:locale" content="pt_BR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Flores de Maio | Apartamentos 2 Quartos, Minha Casa Minha Vida" />
        <meta name="twitter:description" content="Conheça o Flores de Maio em Santo Expedito, Itaboraí - RJ. Apartamentos com varanda, sinal a partir de R$ 1.000 e subsídio Caixa." />
        <meta name="twitter:image" content="https://queromeumcmv.com.br/fachada-flores-de-maio.webp" />
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="Santo Expedito, Itaboraí" />
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
                      "name": "Flores de Maio",
                      "item": "https://queromeumcmv.com.br/flores-de-maio"
                    }
                  ]
                },
                {
                  "@type": "RealEstateListing",
                  "name": "Flores de Maio",
                  "description": "Apartamentos de 2 Quartos com Varanda em Itaboraí",
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
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "Onde fica localizado o Flores de Maio?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "O Flores de Maio está estrategicamente localizado no bairro de Santo Expedito, em Itaboraí, RJ, oferecendo fácil acesso à infraestrutura local e tranquilidade para sua família."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Os apartamentos possuem varanda?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Sim. O Flores de Maio oferece apartamentos de 2 quartos com varanda, trazendo mais ventilação, iluminação natural e um espaço a mais para o seu conforto."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Como funciona o financiamento para o Flores de Maio?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "O financiamento é facilitado e realizado em parceria com a Caixa Econômica Federal. Nossos corretores estão prontos para ajudar na simulação e nas melhores condições para você."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Quem é a construtora responsável?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "O empreendimento é um projeto da RJ Incorporadora, uma empresa com histórico de qualidade e compromisso com o bem-estar dos moradores."
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
        {/* Hero Section - Primeira Dobra com Formulário Estratégico */}
        <section className="relative pt-20 pb-20 lg:pt-28 lg:pb-28 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img fetchPriority="high" 
              src={imgFachada} 
              alt="Apartamentos de 2 quartos no Flores de Maio em Itaboraí RJ" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/80"></div>
          </div>
          
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              {/* Left Column - Alinhado perfeitamente com o topo e rodapé do formulário */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-7 flex flex-col justify-between text-left h-full py-1"
              >
                {/* Topo do Texto - Alinhado ao topo do formulário */}
                <div className="space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full bg-accent/90 border border-amber-300/30 text-white text-xs sm:text-sm font-bold tracking-wider uppercase shadow-lg">
                      <MapPin className="w-3.5 h-3.5 text-amber-200" />
                      <span>Santo Expedito, Itaboraí • Minha Casa Minha Vida</span>
                    </div>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black leading-[1.18] text-white drop-shadow-md tracking-tight">
                    Flores de Maio: Apartamentos 2 Quartos com Varanda em Condomínio
                  </h1>

                  <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
                    More com tranquilidade, conforto e qualidade de vida. Condomínio fechado com área de lazer completa, piscina e financiamento facilitado com subsídio e garantia da <strong className="text-white font-semibold">Caixa Econômica Federal</strong>.
                  </p>
                </div>

                {/* Meio - 4 Diferenciais em Grade e Cards de Condições */}
                <div className="space-y-4 my-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-inner">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                        <Home className="w-4 h-4 text-amber-300" />
                      </div>
                      <span className="text-sm font-medium text-slate-100">Plantas Funcionais de 2 Quartos com Varanda</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                        <Shield className="w-4 h-4 text-amber-300" />
                      </div>
                      <span className="text-sm font-medium text-slate-100">Condomínio Fechado com Guarita 24h</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                        <Waves className="w-4 h-4 text-amber-300" />
                      </div>
                      <span className="text-sm font-medium text-slate-100">Piscina, Churrasqueira e Espaço Gourmet</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-amber-300" />
                      </div>
                      <span className="text-sm font-medium text-slate-100">Fácil Acesso a Transporte e Comércio Local</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 text-center">
                      <span className="block text-[11px] font-semibold text-blue-200 mb-0.5 uppercase tracking-wide">Entrada Facilitada</span>
                      <span className="block text-base sm:text-lg font-black text-amber-300">Sinal R$ 1.000</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 text-center">
                      <span className="block text-[11px] font-semibold text-blue-200 mb-0.5 uppercase tracking-wide">Programa Governo</span>
                      <span className="block text-base sm:text-lg font-black text-amber-300">Até R$ 55 Mil</span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 text-center">
                      <span className="block text-[11px] font-semibold text-blue-200 mb-0.5 uppercase tracking-wide">Garantia Total</span>
                      <span className="block text-base sm:text-lg font-black text-amber-300">Caixa Federal</span>
                    </div>
                  </div>
                </div>

                {/* Rodapé do Texto - Alinhado à base do formulário com Aviso Legal Fonte 10 */}
                <div className="pt-2">
                  <p className="text-[10px] text-slate-300/80 leading-normal italic border-t border-white/10 pt-2">
                    *As informações podem sofrer alteração sem prévio aviso. Consulte preço, condições de pagamento e disponibilidade. Cadastre-se para mais informações.
                  </p>
                </div>
              </motion.div>

              {/* Right Column - Strategic Lead Form na 1ª Dobra */}
              <motion.div
                id="formulario"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-5 w-full max-w-lg mx-auto shadow-2xl rounded-2xl overflow-hidden text-slate-900 flex flex-col justify-center"
              >
                <LeadForm />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Detalhes do Projeto */}
        <section id="detalhes" className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                  O Conforto que Você e sua Família Merecem
                </h2>
                <p className="text-lg text-slate-600 text-justify mb-6 leading-relaxed">
                  O <strong>Flores de Maio</strong>, desenvolvido pela renomada RJ Incorporadora, marca a estreia para quem busca morar bem, com segurança e praticidade. Ter um apartamento com varanda e área de lazer é o diferencial que você procura em Santo Expedito, Itaboraí.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Apartamentos de 2 quartos com varanda e excelente acabamento",
                    "Área de lazer para você aproveitar com toda a família",
                    "Controle de acesso para sua maior proteção e segurança",
                    "Condições exclusivas de financiamento pela Caixa Econômica Federal"
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
                  src={imgFachada} 
                  alt="Apartamento do Flores de Maio em Itaboraí" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Lazer */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                Lazer e Qualidade de Vida
              </h2>
              <p className="text-lg text-slate-600">
                Ofereça entretenimento saudável, contato com a natureza e diversão segura para seus filhos todos os dias, sem precisar sair de casa.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { icon: <Waves />, title: "Piscina", desc: "Estrutura para se refrescar nos dias quentes" },
                { icon: <Home />, title: "Salão de Festas", desc: "O espaço ideal para suas comemorações" },
                { icon: <Shield />, title: "Segurança", desc: "Ambiente protegido e controlado" },
                { icon: <Trees />, title: "Área Verde", desc: "Contato direto com a natureza" }
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

        {/* Localização Estratégica */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 aspect-video">
                <img loading="lazy" 
                  src={imgMapa} 
                  alt="Mapa de localização do Flores de Maio em Itaboraí, RJ" 
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
                  <li className="text-orange-300" aria-current="page">Flores de Maio</li>
                </ol>
              </nav>

              <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full mb-6">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span className="font-semibold tracking-wide uppercase text-sm">Santo Expedito, Itaboraí - RJ</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight">
                  Localização Estratégica e Praticidade no seu Dia a Dia
                </h2>
                <p className="text-lg text-blue-100 text-justify mb-8 leading-relaxed">
                  Ganhe tempo para o que realmente importa. O Flores de Maio fica no bairro de Santo Expedito em Itaboraí, próximo ao Centro, ao Hospital São Judas Tadeu e com fácil acesso pela Avenida 22 de Maio. O empreendimento oferece qualidade de vida, segurança e valorização imobiliária.
                </p>
                <ul className="space-y-4">
                  {[
                    "Fácil acesso às principais vias da cidade",
                    "Proximidade com serviços essenciais",
                    "Região tranquila e segura",
                    "Oportunidade de valorização"
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

        {/* AEO / FAQ SEO */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                Principais Dúvidas sobre o Flores de Maio (FAQ)
              </h2>
              <p className="text-lg text-slate-600">
                Encontre respostas diretas para as perguntas mais comuns de quem busca comprar um apartamento no empreendimento.
              </p>
            </div>
            
            <div className="space-y-6">
              {[
                {
                  q: "Onde fica localizado o Flores de Maio?",
                  a: "O Flores de Maio está estrategicamente localizado no bairro de Santo Expedito, em Itaboraí, RJ, oferecendo fácil acesso à infraestrutura local e tranquilidade para sua família."
                },
                {
                  q: "Os apartamentos possuem varanda?",
                  a: "Sim. O Flores de Maio oferece apartamentos de 2 quartos com varanda, trazendo mais ventilação, iluminação natural e um espaço a mais para o seu conforto."
                },
                {
                  q: "Como funciona o financiamento para o Flores de Maio?",
                  a: "O financiamento é facilitado e realizado em parceria com a Caixa Econômica Federal. Nossos corretores estão prontos para ajudar na simulação e nas melhores condições para você."
                },
                {
                  q: "Quem é a construtora responsável?",
                  a: "O empreendimento é um projeto da RJ Incorporadora, uma empresa com histórico de qualidade e compromisso com o bem-estar dos moradores."
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
        
        {/* Call to Action Final */}
        <section className="py-16 bg-slate-100 border-t border-slate-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4">
              A oportunidade de sair do aluguel está acabando.
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Os apartamentos no Flores de Maio têm alta procura. Fale com um de nossos corretores credenciados e garanta as melhores condições.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="#formulario"
                className="inline-flex items-center justify-center bg-accent hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-xl text-lg transform hover:-translate-y-1"
              >
                Preencher Formulário de Simulação
              </a>
              <a 
                href={gerarLinkWhatsApp(nomeEmpreendimento, "Consultar Disponibilidade e Valores")} 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-success hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-xl shadow-green-600/30 text-lg transform hover:-translate-y-1"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Consultar Disponibilidade e Valores
              </a>
            </div>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}
