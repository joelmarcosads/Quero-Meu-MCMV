import Header from '../components/Header';
import Footer from '../components/Footer';
import { m as motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, MapPin, Home, Shield, Trees, Info, MessageCircle, Waves, Dumbbell, Accessibility, Map, Flame, Cctv, Car, Utensils, Smile, UserCheck, PartyPopper, Gamepad2, Sun } from 'lucide-react';
import imgFachada from '../assets/fachada-residencial-florescer.webp';
import imgSala from '../assets/sala-de-tv-1.webp';
import imgShopping from '../assets/shooping-partage.jpg';

export default function ResidencialFlorescer() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Residencial Florescer | 2 e 3 Quartos com Suíte em São Gonçalo</title>
        <meta name="description" content="Eleve seu padrão de vida no Residencial Florescer em Vila Iara, São Gonçalo - RJ. Exclusivos apartamentos de 2 e 3 quartos com suíte, varanda gourmet e lazer completo." />
        <meta name="keywords" content="Residencial Florescer São Gonçalo, Vila Iara, apartamento 2 e 3 quartos São Gonçalo, RJ Engenharia, apartamento com suíte, varanda gourmet, imóveis alto padrão São Gonçalo" />
<link rel="canonical" href="https://www.queromeumcmv.com.br/residencial-florescer" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.queromeumcmv.com.br/images/residencial-florescer/fachada-residencial-florescer.webp" />
        <meta property="og:title" content="Residencial Florescer | 2 e 3 Quartos com Suíte em São Gonçalo" />
        <meta property="og:description" content="Eleve seu padrão de vida no Residencial Florescer em Vila Iara, São Gonçalo - RJ. Exclusivos apartamentos de 2 e 3 quartos com suíte, varanda gourmet e lazer completo." />
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="Vila Iara, São Gonçalo" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "RealEstateListing",
              "name": "Residencial Florescer",
              "description": "Apartamentos de 2 e 3 Quartos com Suíte e Varanda Gourmet em São Gonçalo",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "São Gonçalo",
                "addressRegion": "RJ",
                "addressCountry": "BR"
              },
              "offers": {
                "@type": "Offer",
                "priceCurrency": "BRL",
                "description": "Condições exclusivas de negociação para as últimas unidades"
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
            <img referrerPolicy="no-referrer" loading="lazy" 
              src={imgFachada} 
              alt="Fachada do Residencial Florescer" 
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
                Lançamento Imobiliário em Vila Iara, São Gonçalo - RJ
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight text-white drop-shadow-md">
                Residencial Florescer: Apartamentos de 2 e 3 Quartos com Suíte e Varanda Gourmet
              </h1>
              <p className="text-xl md:text-2xl text-slate-200 mb-10 text-justify md:text-center leading-relaxed font-medium">
                Descubra o Residencial Florescer, um marco de sofisticação e conforto da RJ Engenharia. Exclusivos apartamentos de 2 e 3 quartos com suíte, varanda gourmet e infraestrutura de lazer completa. Invista no seu bem-estar e viva momentos inesquecíveis em coberturas de tirar o fôlego, com 3 quartos e 2 vagas. Planejamento financeiro inteligente para transformar seu sonho em realidade.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a 
                  href="https://wa.me/5521965928399" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-success hover:bg-green-600 text-white font-bold text-lg py-4 px-8 rounded-xl shadow-xl shadow-green-600/30 transition-transform transform hover:-translate-y-1 flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Agendar Atendimento Exclusivo
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
                  Eleve o Seu Padrão de Vida: Exclusividade e Sofisticação
                </h2>
                <p className="text-lg text-slate-600 text-justify mb-6 leading-relaxed">
                  O <strong>Residencial Florescer</strong> é o primeiro grande projeto da construtora RJ Engenharia, concebido para quem não abre mão de conforto e elegância. Mais do que morar, é um convite para vivenciar o melhor de Vila Iara, São Gonçalo, em ambientes projetados para maximizar o seu bem-estar, com detalhes arquitetônicos primorosos e uma área de lazer em formato resort: salão de festas/jogos, espaço gourmet, piscina adulto e infantil, estacionamento, playground, espaço fitness, e churrasqueira.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Apartamentos premium de 2 e 3 quartos com suíte e varanda gourmet",
                    "Coberturas imponentes com 3 quartos e 2 vagas na garagem",
                    "Resort particular: lazer com piscina, espaço gourmet e mais",
                    "Controle de acesso para sua maior proteção e segurança",
                    "Planejamento financeiro personalizado e inteligente"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle2 className="w-6 h-6 text-success mr-3 shrink-0 mt-0.5" />
                      <span className="text-slate-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img referrerPolicy="no-referrer" loading="lazy" 
                  src={imgSala} 
                  alt="Sala de TV do Residencial Florescer" 
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
                Uma área de lazer incrível projetada para oferecer diversão e bem-estar para toda a família, sem sair de casa.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { icon: <Dumbbell />, title: "Academia", desc: "Cuide do corpo e mente com equipamentos modernos" },
                { icon: <Accessibility />, title: "Acessibilidade", desc: "Estrutura inclusiva para o conforto de todos" },
                { icon: <Map />, title: "Amplo Terreno", desc: "Respire fundo e aproveite cada metro quadrado" },
                { icon: <Flame />, title: "Churrasqueira", desc: "Momentos deliciosos ao lado de quem você ama" },
                { icon: <Cctv />, title: "Circuito de TV", desc: "Tranquilidade total com monitoramento constante" },
                { icon: <Car />, title: "Estacionamento", desc: "Praticidade rotativa para o seu veículo" },
                { icon: <Utensils />, title: "Espaço Gourmet", desc: "Celebre conquistas em um ambiente sofisticado" },
                { icon: <Waves />, title: "Piscina Adulto", desc: "Relaxe e renove suas energias em águas cristalinas" },
                { icon: <Smile />, title: "Piscina Infantil", desc: "Diversão segura e refrescante para os pequenos" },
                { icon: <Trees />, title: "Playground", desc: "Onde a imaginação e a alegria ganham vida" },
                { icon: <UserCheck />, title: "Portaria 24h", desc: "Recepção em tempo integral para sua paz de espírito" },
                { icon: <PartyPopper />, title: "Salão de Festas", desc: "Crie memórias inesquecíveis nos seus eventos" },
                { icon: <Gamepad2 />, title: "Salão de Jogos", desc: "Entretenimento garantido para todas as idades" },
                { icon: <Sun />, title: "Solarium", desc: "Um refúgio de luz e tranquilidade para relaxar ao sol" }
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
                <img referrerPolicy="no-referrer" loading="lazy" 
                  src={imgShopping} 
                  alt="Shopping Partage, próximo ao Residencial Florescer em São Gonçalo, RJ" 
                  className="w-full h-auto object-cover rounded-2xl aspect-video"
                />
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full mb-6">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span className="font-semibold tracking-wide uppercase text-sm">Vila Iara, São Gonçalo - RJ</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight">
                  Localização Estratégica e Praticidade no seu Dia a Dia
                </h2>
                <p className="text-lg text-blue-100 text-justify mb-8 leading-relaxed">
                  Localizado na Rua São Carlos Gianelli 879, Vila Iara, próximo ao Centro de São Gonçalo. O Residencial Florescer coloca você perto de tudo o que você precisa para uma vida mais prática e confortável: shoppings, farmácias, padarias, centros médicos, creches, escolas e bancos.
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
                Principais Dúvidas sobre o Residencial Florescer (FAQ)
              </h2>
              <p className="text-lg text-slate-600">
                Encontre respostas diretas para as perguntas mais comuns de quem busca comprar um apartamento no empreendimento.
              </p>
            </div>
            
            <div className="space-y-6">
              {[
                {
                  q: "Onde fica localizado o Residencial Florescer?",
                  a: "O Residencial Florescer está estrategicamente localizado no bairro de Vila Iara, em São Gonçalo, RJ, oferecendo fácil acesso à infraestrutura local e tranquilidade para sua família."
                },
                {
                  q: "Os apartamentos possuem varanda?",
                  a: "Absolutamente. O Residencial Florescer dispõe de plantas sofisticadas de 2 e 3 quartos com varanda gourmet, um espaço ideal para receber amigos e celebrar a vida."
                },
                {
                  q: "Como funciona o financiamento para o Residencial Florescer?",
                  a: "Oferecemos condições personalizadas com planejamento financeiro inteligente. Nossos especialistas em crédito imobiliário estão à disposição para desenhar a estrutura de pagamento que melhor se adapta ao seu perfil."
                },
                {
                  q: "Quem é a construtora responsável?",
                  a: "O empreendimento é um projeto da RJ Engenharia, uma empresa com histórico de qualidade e compromisso com o bem-estar dos moradores."
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
              Descubra o Privilégio de Morar no Residencial Florescer
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              As unidades do Residencial Florescer são altamente cobiçadas. Fale com um de nossos consultores de alto padrão e dê o próximo passo rumo ao seu novo estilo de vida.
            </p>
            <a 
              href="https://wa.me/5521965928399" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-success hover:bg-green-700 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-xl shadow-green-600/30 text-lg transform hover:-translate-y-1"
            >
              Falar com um Especialista
            </a>
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}
