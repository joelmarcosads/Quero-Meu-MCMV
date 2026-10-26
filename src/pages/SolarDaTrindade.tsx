import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import { m as motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, MapPin, Home, Shield, Trees, Info, MessageCircle, Waves, Store, HeartPulse, GraduationCap, ShoppingBag, School, ShoppingCart, Dog, Accessibility, Bike, Coffee, Key, Clock, Sofa, Utensils, Flame, Dumbbell, Flower2, Baby, PartyPopper, Check } from 'lucide-react';
import { gerarLinkWhatsApp } from '../utils/whatsapp';
const imgFachada = '/fachada-solar-trindade.webp';
const imgMapa = '/mapa-solar-trindade.webp';

export default function SolarDaTrindade() {
  const nomeEmpreendimento = "Solar da Trindade";
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Solar da Trindade | Apartamentos 2 Quartos, Minha Casa Minha Vida</title>
        <meta name="description" content="Conheça o Solar da Trindade em Trindade, São Gonçalo - RJ. Apartamentos de 2 quartos, sinal a partir de R$ 1.000 e subsídio Caixa." />
<link rel="canonical" href="https://queromeumcmv.com.br/solar-da-trindade" />
        <meta property="fb:app_id" content="966242223397117" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://queromeumcmv.com.br/solar-da-trindade" />
        <meta property="og:image" content="https://queromeumcmv.com.br/fachada-solar-trindade.webp" />
        <meta property="og:image:alt" content="Fachada do condomínio Solar da Trindade em São Gonçalo" />
        <meta property="og:title" content="Solar da Trindade | Apartamentos 2 Quartos, Minha Casa Minha Vida" />
        <meta property="og:description" content="Conheça o Solar da Trindade em Trindade, São Gonçalo - RJ. Apartamentos de 2 quartos, sinal a partir de R$ 1.000 e subsídio Caixa." />
        <meta property="og:site_name" content="Quero Meu MCMV" />
        <meta property="og:locale" content="pt_BR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Solar da Trindade | Apartamentos 2 Quartos, Minha Casa Minha Vida" />
        <meta name="twitter:description" content="Conheça o Solar da Trindade em Trindade, São Gonçalo - RJ. Apartamentos de 2 quartos, sinal a partir de R$ 1.000 e subsídio Caixa." />
        <meta name="twitter:image" content="https://queromeumcmv.com.br/fachada-solar-trindade.webp" />
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="Trindade, São Gonçalo" />
      </Helmet>
      <Header />
      
      <main>
        {/* Hero Section - Primeira Dobra com Formulário Estratégico */}
        <section className="relative pt-20 pb-20 lg:pt-28 lg:pb-28 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img fetchPriority="high" 
              src={imgFachada} 
              alt="Apartamentos de 2 quartos no Solar da Trindade em São Gonçalo RJ" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/80"></div>
          </div>
          
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              {/* Left Column - Alinhado perfeitamente com o topo e rodapé do formulário */}
              <motion.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-7 flex flex-col justify-between text-left h-full py-1"
              >
                {/* Topo do Texto - Alinhado ao topo do formulário */}
                <div className="space-y-4">
                  <div>
                    <div className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full bg-accent/90 border border-amber-300/30 text-white text-xs sm:text-sm font-bold tracking-wider uppercase shadow-lg">
                      <MapPin className="w-3.5 h-3.5 text-amber-200" />
                      <span>Trindade, São Gonçalo • Minha Casa Minha Vida</span>
                    </div>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black leading-[1.18] text-white drop-shadow-md tracking-tight">
                    Solar da Trindade: Apartamentos 2 Quartos em Condomínio Clube
                  </h1>

                  <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
                    More no coração da Trindade, com lazer completo, segurança e fácil acesso a tudo. Financiamento com subsídio do governo e parcelas que cabem no bolso pela <strong className="text-white font-semibold">Caixa Econômica Federal</strong>.
                  </p>
                </div>

                {/* Meio - 4 Diferenciais em Grade e Cards de Condições */}
                <div className="space-y-4 my-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-inner">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                        <Home className="w-4 h-4 text-amber-300" />
                      </div>
                      <span className="text-sm font-medium text-slate-100">2 Quartos com Opção de Varanda e Suíte</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                        <Shield className="w-4 h-4 text-amber-300" />
                      </div>
                      <span className="text-sm font-medium text-slate-100">Portaria 24h e Acesso Totalmente Seguro</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                        <Waves className="w-4 h-4 text-amber-300" />
                      </div>
                      <span className="text-sm font-medium text-slate-100">Lazer Completo com Piscina Adulto e Infantil</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-amber-300" />
                      </div>
                      <span className="text-sm font-medium text-slate-100">Ao Lado da Praça da Trindade e Universo</span>
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
                initial={false}
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
                  O <strong>Solar da Trindade</strong>, desenvolvido pela renomada Tenda, marca a estreia para quem busca morar bem, com segurança e praticidade. Ter um apartamento com área de lazer é o diferencial que você procura em Trindade, São Gonçalo.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Apartamentos de 2 quartos com excelente acabamento",
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
                  alt="Apartamento do Solar da Trindade em São Gonçalo" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Lazer e Diferenciais */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                Estrutura Completa e Qualidade de Vida
              </h2>
              <p className="text-lg text-slate-600">
                Ofereça conforto, segurança e lazer para sua família todos os dias. O Solar da Trindade conta com diferenciais pensados no seu bem-estar.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[
                { icon: <Dog />, title: "Aceita animais", type: "condominio" },
                { icon: <Accessibility />, title: "Acesso para deficientes", type: "condominio" },
                { icon: <CheckCircle2 />, title: "Área de serviço", type: "apartamento" },
                { icon: <Bike />, title: "Bicicletário", type: "condominio" },
                { icon: <Shield />, title: "Condomínio fechado", type: "condominio" },
                { icon: <Coffee />, title: "Cozinha americana", type: "apartamento" },
                { icon: <Key />, title: "Portão eletrônico", type: "condominio" },
                { icon: <Clock />, title: "Portaria 24h", type: "condominio" },
                { icon: <Sofa />, title: "Sala de estar", type: "apartamento" },
                { icon: <Utensils />, title: "Sala de jantar", type: "apartamento" },
                { icon: <Flame />, title: "Churrasqueira", type: "lazer" },
                { icon: <Dumbbell />, title: "Espaço fitness", type: "lazer" },
                { icon: <Flower2 />, title: "Jardim", type: "lazer" },
                { icon: <Baby />, title: "Playground", type: "lazer" },
                { icon: <PartyPopper />, title: "Salão de festas", type: "lazer" }
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-lg transition-shadow flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-blue-100 text-primary rounded-full flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
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
                  alt="Mapa de localização do Solar da Trindade em São Gonçalo, RJ" 
                  className="w-full h-full object-cover rounded-2xl aspect-video"
                />
              </div>
              <div className="order-1 lg:order-2">
                <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full mb-6">
                  <MapPin className="w-5 h-5 text-accent" />
                  <span className="font-semibold tracking-wide uppercase text-sm">Trindade, São Gonçalo - RJ</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight">
                  Localização Estratégica e Praticidade no seu Dia a Dia
                </h2>
                <p className="text-lg text-blue-100 text-justify mb-8 leading-relaxed">
                  Ganhe tempo para o que realmente importa. O Solar da Trindade fica no bairro de Trindade em São Gonçalo, com fácil acesso à BR-101 e a serviços essenciais. O empreendimento oferece qualidade de vida, segurança e valorização imobiliária.
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

        {/* Proximidades */}
        <section className="py-20 bg-slate-50 border-y border-slate-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                Tudo o que você precisa a poucos minutos
              </h2>
              <p className="text-lg text-slate-600">
                Uma infraestrutura completa de comércio, serviços, saúde e educação ao seu redor, garantindo praticidade no seu dia a dia.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/* Comércio */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-orange-100 text-accent rounded-full flex items-center justify-center mr-3">
                    <Store className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Comércio</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex flex-col">
                    <span className="text-slate-800 font-medium">Polo Gastronômico</span>
                    <span className="text-sm text-slate-500">800 m • 10 min.</span>
                  </li>
                </ul>
              </div>

              {/* Saúde */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-orange-100 text-accent rounded-full flex items-center justify-center mr-3">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Saúde</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex flex-col">
                    <span className="text-slate-800 font-medium">Upa Municipal Nova CIDADE</span>
                    <span className="text-sm text-slate-500">2,2 km • 7 min.</span>
                  </li>
                </ul>
              </div>

              {/* Educação */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-orange-100 text-accent rounded-full flex items-center justify-center mr-3">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Educação</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex flex-col">
                    <span className="text-slate-800 font-medium">Universidade Salgado de Oliveira</span>
                    <span className="text-sm text-slate-500">700 m • 10 min.</span>
                  </li>
                </ul>
              </div>

              {/* Shopping */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-orange-100 text-accent rounded-full flex items-center justify-center mr-3">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Shopping</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex flex-col">
                    <span className="text-slate-800 font-medium">Shopping Pátio Alcântara</span>
                    <span className="text-sm text-slate-500">1,6 km • 5 min.</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-slate-800 font-medium">Shopping das Fábricas</span>
                    <span className="text-sm text-slate-500">2,4 km • 6 min.</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-slate-800 font-medium">Partage Shopping São Gonçalo</span>
                    <span className="text-sm text-slate-500">4,5 km • 10 min.</span>
                  </li>
                </ul>
              </div>

              {/* Escola */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-orange-100 text-accent rounded-full flex items-center justify-center mr-3">
                    <School className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Escola</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex flex-col">
                    <span className="text-slate-800 font-medium">E.M. Marluce Salles Almeida</span>
                    <span className="text-sm text-slate-500">160 m • 3 min.</span>
                  </li>
                </ul>
              </div>

              {/* Supermercado */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-orange-100 text-accent rounded-full flex items-center justify-center mr-3">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Supermercado</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex flex-col">
                    <span className="text-slate-800 font-medium">Supermarket</span>
                    <span className="text-sm text-slate-500">800 m • 11 min.</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-slate-800 font-medium">Carrefour Hipermercado</span>
                    <span className="text-sm text-slate-500">1,4 km • 4 min.</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-slate-800 font-medium">Publix Trindade</span>
                    <span className="text-sm text-slate-500">1,3 km • 3 min.</span>
                  </li>
                </ul>
              </div>

              {/* Outros */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1 xl:col-span-2">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-orange-100 text-accent rounded-full flex items-center justify-center mr-3">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Outros</h3>
                </div>
                <ul className="space-y-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-x-4">
                  <li className="flex flex-col">
                    <span className="text-slate-800 font-medium">Centro de Alcântara</span>
                    <span className="text-sm text-slate-500">1,4 km • 4 min.</span>
                  </li>
                  <li className="flex flex-col">
                    <span className="text-slate-800 font-medium">CIEP 408 Sergio Cardoso</span>
                    <span className="text-sm text-slate-500">700 m • 10 min.</span>
                  </li>
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
                Principais Dúvidas sobre o Solar da Trindade (FAQ)
              </h2>
              <p className="text-lg text-slate-600">
                Encontre respostas diretas para as perguntas mais comuns de quem busca comprar um apartamento no empreendimento.
              </p>
            </div>
            
            <div className="space-y-6">
              {[
                {
                  q: "Onde fica localizado o Solar da Trindade?",
                  a: "O Solar da Trindade está estrategicamente localizado no bairro de Trindade, em São Gonçalo, RJ, oferecendo fácil acesso à infraestrutura local e tranquilidade para sua família."
                },
                {
                  q: "Os apartamentos possuem vaga de garagem?",
                  a: "O empreendimento conta com unidades com vaga de garagem, proporcionando mais segurança e praticidade para o seu veículo."
                },
                {
                  q: "Como funciona o financiamento para o Solar da Trindade?",
                  a: "O financiamento é facilitado e realizado em parceria com a Caixa Econômica Federal. Nossos corretores estão prontos para ajudar na simulação e nas melhores condições para você."
                },
                {
                  q: "Quem é a construtora responsável?",
                  a: "O empreendimento é um projeto da Tenda, uma empresa com histórico de qualidade e compromisso com o bem-estar dos moradores."
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
              Os apartamentos no Solar da Trindade têm alta procura. Atendimento com Joel Marcos, corretor especialista em MCMV em Itaboraí, que também atende São Gonçalo.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="#formulario"
                className="inline-flex items-center justify-center bg-accent hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-xl text-lg transform hover:-translate-y-1"
              >
                Preencher Formulário de Simulação
              </a>
              <a 
                href="https://wa.me/5521965928399?text=Ol%C3%A1%2C%20Joel!%20Vim%20pelo%20site%20e%20quero%20simular%20meu%20Minha%20Casa%20Minha%20Vida." 
                target="_blank"
                rel="noopener"
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
