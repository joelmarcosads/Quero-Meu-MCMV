import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import { m as motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, MapPin, Home, Shield, Trees, MessageCircle, Waves, Dumbbell, Accessibility, Map, Flame, Cctv, Car, Utensils, Smile, UserCheck, PartyPopper, Gamepad2, Sun } from 'lucide-react';
import { gerarLinkWhatsApp } from '../utils/whatsapp';
const imgFachada = '/fachada-conquista-oceanica.webp';
const imgPiscina = '/piscina-conquista-oceanica.webp';
const imgChurrasqueira = '/churrasqueira-conquista-oceanica.webp';

export default function ConquistaOceanica() {
  const nomeEmpreendimento = "Conquista Oceânica";
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Conquista Oceânica | 1 e 2 Quartos em Maricá</title>
        <meta name="description" content="Conquista Oceânica em Maricá - RJ. Apartamentos de 1 e 2 quartos com gardens e lazer completo. Compre com o Minha Casa Minha Vida." />
<link rel="canonical" href="https://queromeumcmv.com.br/conquista-oceanica" />
        <meta property="fb:app_id" content="966242223397117" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://queromeumcmv.com.br/conquista-oceanica" />
        <meta property="og:image" content="https://queromeumcmv.com.br/fachada-conquista-oceanica.webp" />
        <meta property="og:image:alt" content="Fachada do condomínio Conquista Oceânica em Maricá" />
        <meta property="og:title" content="Conquista Oceânica | 1 e 2 Quartos em Maricá" />
        <meta property="og:description" content="Conquista Oceânica em Maricá - RJ. Apartamentos de 1 e 2 quartos com gardens e lazer completo. Compre com o Minha Casa Minha Vida." />
        <meta property="og:site_name" content="Quero Meu MCMV" />
        <meta property="og:locale" content="pt_BR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Conquista Oceânica | 1 e 2 Quartos em Maricá" />
        <meta name="twitter:description" content="Conquista Oceânica em Maricá - RJ. Apartamentos de 1 e 2 quartos com gardens e lazer completo. Compre com o Minha Casa Minha Vida." />
        <meta name="twitter:image" content="https://queromeumcmv.com.br/fachada-conquista-oceanica.webp" />
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="Maricá" />
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
                      "name": "Conquista Oceânica",
                      "item": "https://queromeumcmv.com.br/conquista-oceanica"
                    }
                  ]
                },
                {
                  "@type": "RealEstateListing",
                  "name": "Conquista Oceânica",
                  "description": "Apartamentos de 1 e 2 quartos com gardens e lazer completo em Maricá.",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Maricá",
                    "addressRegion": "RJ",
                    "addressCountry": "BR"
                  },
                  "offers": {
                    "@type": "Offer",
                    "priceCurrency": "BRL",
                    "description": "Financiamento pelo programa Minha Casa Minha Vida"
                  }
                },
                {
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "Onde fica localizado o Conquista Oceânica?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "O Conquista Oceânica está localizado em Maricá - RJ, a minutos de distância das melhores praias de Niterói e perto de toda infraestrutura."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Quais os tipos de apartamentos?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "O empreendimento oferece apartamentos de 1 e 2 quartos com opções de gardens."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "O empreendimento tem área de lazer?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Sim, o Conquista Oceânica possui lazer completo entregue equipado e mobiliado, incluindo piscina, salão de festas, fitness, espaço pet, churrasqueiras e muito mais."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "Quais as formas de pagamento?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "O imóvel pode ser financiado pelo programa Minha Casa Minha Vida, permitindo o uso do FGTS e oferecendo condições imperdíveis de entrada."
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
        {/* Hero Section - Primeira Dobra Harmoniosa com Formulário Estratégico */}
        <section className="relative pt-16 pb-16 lg:pt-24 lg:pb-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img fetchPriority="high" 
              src={imgFachada} 
              alt="Fachada do Conquista Oceânica em Maricá" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-900/80"></div>
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
                      <span>Maricá / Divisa Niterói • Minha Casa Minha Vida</span>
                    </div>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black leading-[1.18] text-white drop-shadow-md tracking-tight">
                    Conquista Oceânica: 1 e 2 Quartos a Minutos das Praias de Niterói
                  </h1>

                  <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
                    More no empreendimento Direcional que conecta você à tranquilidade e às praias da Região Oceânica. Condomínio fechado com lazer completo, conforto e condições do <strong className="text-white font-semibold">Minha Casa Minha Vida</strong>.
                  </p>
                </div>

                {/* Meio - 4 Diferenciais em Grade e Cards de Condições */}
                <div className="space-y-4 my-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-inner">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                        <Home className="w-4 h-4 text-amber-300" />
                      </div>
                      <span className="text-sm font-medium text-slate-100">1 e 2 Quartos com Opção de Gardens</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                        <Shield className="w-4 h-4 text-amber-300" />
                      </div>
                      <span className="text-sm font-medium text-slate-100">Condomínio Fechado com Portaria 24h</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                        <Waves className="w-4 h-4 text-amber-300" />
                      </div>
                      <span className="text-sm font-medium text-slate-100">Piscina, Espaço Gourmet e Área Pet</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-amber-300" />
                      </div>
                      <span className="text-sm font-medium text-slate-100">Acesso Direto à Região Oceânica e Niterói</span>
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

        {/* Sobre o Projeto */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
                  Bem-estar e Qualidade de Vida para Você e Sua Família
                </h2>
                <p className="text-lg text-slate-600 text-justify mb-6 leading-relaxed">
                  São apartamentos de 1 e 2 quartos com gardens e lazer completo. Aproveite as áreas de lazer entregues mobiliadas e equipadas para a sua diversão ser completa. Conquiste a sua casa própria com sinal parcelado em até 3x sem juros no cartão de crédito*, entrada facilitada* e você ainda pode juntar renda com até 3 familiares* e usar seu FGTS*.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Sinal parcelado em até 3x sem juros no cartão*",
                    "Junte renda com até 3 familiares e use seu FGTS",
                    "Condomínio fechado com segurança e conforto",
                    "Lazer completo, entregue equipado e mobiliado",
                    "Perto da infraestrutura, educação e cultura de Maricá"
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
                  alt="Piscina do Conquista Oceânica" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Lazer */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="text-center mb-16">
              <span className="text-accent font-bold tracking-wider uppercase text-sm mb-2 block">Seu Novo Estilo de Vida</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                Infraestrutura de Lazer Completa
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                No Conquista Oceânica, você aproveita áreas de lazer entregues mobiliadas e equipadas para a diversão ser completa para toda a família.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                { icon: <Waves />, title: "Piscina", desc: "Refresque-se com solarium" },
                { icon: <PartyPopper />, title: "Salão de Festas", desc: "Celebre os melhores momentos" },
                { icon: <Flame />, title: "Churrasqueiras", desc: "Reúna os amigos no fim de semana" },
                { icon: <Trees />, title: "Praça de Jogos", desc: "Diversão ao ar livre" },
                { icon: <Accessibility />, title: "Pista de Caminhada", desc: "Mantenha a saúde em dia" },
                { icon: <Sun />, title: "Praça do Encontro", desc: "Espaço para convívio" },
                { icon: <Smile />, title: "Playground", desc: "Segurança e alegria para as crianças" },
                { icon: <Map />, title: "Espaço Zen", desc: "Relaxe após um dia cansativo" },
                { icon: <Dumbbell />, title: "Fitness Externo", desc: "Exercícios ao ar livre" },
                { icon: <Utensils />, title: "Piquenique", desc: "Lanches em família" },
                { icon: <Home />, title: "Espaço Pet", desc: "Seu animalzinho também tem lugar" },
                { icon: <Cctv />, title: "Quadra", desc: "Pratique seus esportes favoritos" },
                { icon: <Car />, title: "Bicicletário", desc: "Guarde sua bike com segurança" },
                { icon: <UserCheck />, title: "Coworking", desc: "Trabalhe sem sair do condomínio" }
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
                  src={imgChurrasqueira} 
                  alt="Churrasqueira do Conquista Oceânica em Maricá, RJ" 
                  className="w-full h-full object-cover rounded-2xl aspect-video"
                />
              </div>
              <div className="order-1 lg:order-2">
                              <nav className="text-sm font-medium text-slate-300 mb-6" aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center space-x-2">
                  <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                  <li><span className="mx-2">&gt;</span></li>
                  
                  <li className="text-orange-300" aria-current="page">Conquista Oceânica</li>
                </ol>
              </nav>

              <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full mb-6">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span className="font-semibold tracking-wide uppercase text-sm">Maricá - RJ</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight">
                  Localização Privilegiada
                </h2>
                <p className="text-lg text-blue-100 text-justify mb-8 leading-relaxed">
                  Mobilidade é o que não vai faltar no seu dia a dia! Com opções de transporte e ônibus na porta, more a poucos minutos de Maricá e a 35 min do Centro de Niterói. Já pensou em morar a 20 min da praia de Itaipuaçu, Itaipu e Itacoatiara e com acesso fácil a todas as praias da Região Oceânica? Aqui você pode e por um valor que cabe no seu bolso!
                </p>
                <ul className="space-y-4">
                  {[
                    "Ônibus na porta e fácil transporte",
                    "A 35 min do Centro de Niterói",
                    "A 20 min das praias da Região Oceânica",
                    "Endereço: Av. Rio do Ouro, S/N – Antiga Rod. Amaral Peixoto RJ-106"
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
                Principais Dúvidas sobre o Conquista Oceânica (FAQ)
              </h2>
              <p className="text-lg text-slate-600">
                Encontre respostas diretas para as perguntas mais comuns de quem busca comprar um apartamento no empreendimento.
              </p>
            </div>
            
            <div className="space-y-6">
              {[
                {
                  q: "Onde fica localizado o Conquista Oceânica?",
                  a: "O Conquista Oceânica está localizado em Maricá - RJ, a minutos de distância das melhores praias de Niterói e perto de toda infraestrutura."
                },
                {
                  q: "Quais os tipos de apartamentos?",
                  a: "O empreendimento oferece apartamentos de 1 e 2 quartos com opções de gardens."
                },
                {
                  q: "O empreendimento tem área de lazer?",
                  a: "Sim, o Conquista Oceânica possui lazer completo entregue equipado e mobiliado, incluindo piscina, salão de festas, fitness, espaço pet, churrasqueiras e muito mais."
                },
                {
                  q: "Quais as formas de pagamento?",
                  a: "O imóvel pode ser financiado pelo programa Minha Casa Minha Vida, permitindo o uso do FGTS e oferecendo condições imperdíveis de entrada."
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
              Realize o Sonho da Casa Própria no Conquista Oceânica
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Saia do aluguel hoje mesmo e conquiste o seu apartamento com lazer completo em Maricá. Fale com um especialista.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="#formulario"
                className="inline-flex items-center justify-center bg-accent hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-xl text-lg transform hover:-translate-y-1"
              >
                Preencher Formulário de Simulação
              </a>
              <a 
                href={gerarLinkWhatsApp(nomeEmpreendimento, "Falar com um Especialista")} 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-success hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-xl shadow-green-600/30 text-lg transform hover:-translate-y-1"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Falar com um Especialista
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
