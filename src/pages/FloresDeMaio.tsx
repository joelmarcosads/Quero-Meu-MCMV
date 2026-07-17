import Header from '../components/Header';
import Footer from '../components/Footer';
import { m as motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, MapPin, Home, Shield, Trees, Info, MessageCircle, Waves } from 'lucide-react';
import imgFachada from '../assets/fachada-flores-de-maio.webp';
import imgMapa from '../assets/mapa-da-localizacao-flores-de-maio.webp';

export default function FloresDeMaio() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Flores de Maio | Apartamentos 2 Quartos, Minha Casa Minha Vida</title>
        <meta name="description" content="Conheça o Flores de Maio em Santo Expedito, Itaboraí - RJ. Apartamentos com varanda, sinal a partir de R$ 1.000 e subsídio Caixa." />
        <meta name="keywords" content="Flores de maio Itaboraí, Santo Expedito, apartamento 2 quartos Itaboraí, Minha casa minha vida, financiamento Caixa" />
<link rel="canonical" href="https://www.queromeumcmv.com.br/flores-de-maio" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.queromeumcmv.com.br/flores-de-maio/fachada-flores-de-maio.webp" />
        <meta property="og:title" content="Flores de Maio | Apartamentos 2 Quartos, Minha Casa Minha Vida" />
        <meta property="og:description" content="Conheça o Flores de Maio em Santo Expedito, Itaboraí - RJ. Apartamentos com varanda, sinal a partir de R$ 1.000 e subsídio Caixa." />
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="Santo Expedito, Itaboraí" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
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
            }
          `}
        </script>
      </Helmet>
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img loading="lazy" 
              src={imgFachada} 
              alt="Apartamentos de 2 quartos no Flores de Maio em Itaboraí RJ" 
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
                Lançamento Imobiliário em Santo Expedito, Itaboraí - RJ
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-white drop-shadow-md">
                Flores de Maio: Apartamentos de 2 Quartos com Varanda
              </h1>
              <p className="text-xl md:text-2xl text-slate-200 mb-10 text-justify md:text-center leading-relaxed font-medium">
                More com tranquilidade e qualidade de vida. Viva com total segurança, conforto e área de lazer. Financiamento facilitado pela <strong className="text-white">Caixa Econômica Federal</strong> pelo programa <strong className="text-white">Minha Casa Minha Vida</strong>.
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
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img loading="lazy" 
                  src={imgFachada} 
                  alt="Apartamento do Flores de Maio em Itaboraí" 
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
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
              <div className="order-2 lg:order-1 relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
                <img loading="lazy" 
                  src={imgMapa} 
                  alt="Mapa de localização do Flores de Maio em Itaboraí, RJ" 
                  className="w-full h-auto object-cover rounded-2xl aspect-video"
                />
              </div>
              <div className="order-1 lg:order-2">
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
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4">
              A oportunidade de sair do aluguel está acabando.
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Os apartamentos no Flores de Maio têm alta procura. Fale com um de nossos corretores credenciados e garanta as melhores condições.
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
