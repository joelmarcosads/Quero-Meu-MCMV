import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import { m as motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, MapPin, Home, Shield, Trees, Info, MessageCircle } from 'lucide-react';
import { gerarLinkWhatsApp } from '../utils/whatsapp';
const imgCapa = '/capa-do-site-prime-club-itaborai.webp';
const imgPiscina = '/area-de-lazer-com-piscina-prime-club-itaborai.webp';
const imgLocalizacao = '/localizacao-prime-club-itaborai.webp';

export default function PrimeClubItaborai() {
  const nomeEmpreendimento = "Prime Clube Itaboraí";
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Prime Clube Itaboraí - Apartamentos Minha Casa Minha Vida</title>
        <meta name="description" content="Conheça o Prime Clube Itaboraí no Outeiro das Pedras. Apartamentos de 2 quartos com suíte reversível e lazer completo. Faça sua simulação Caixa!" />
        <link rel="canonical" href="https://queromeumcmv.com.br/prime-club-itaborai" />
        <meta property="fb:app_id" content="966242223397117" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://queromeumcmv.com.br/prime-club-itaborai" />
        <meta property="og:image" content="https://queromeumcmv.com.br/capa-do-site-prime-club-itaborai.webp" />
        <meta property="og:image:alt" content="Fachada do condomínio Prime Club Itaboraí" />
        <meta property="og:title" content="Prime Club Itaboraí | Apartamentos 2 Quartos, Minha Casa Minha Vida" />
        <meta property="og:description" content="Lançamento Prime Club em Itaboraí - RJ. Apartamentos 2 Quartos em condomínio fechado. Sinal a partir de R$ 1.000 e Subsídio até R$ 55 mil. Compre pela Caixa." />
        
        <meta property="og:site_name" content="Quero Meu MCMV" />
        <meta property="og:locale" content="pt_BR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Prime Club Itaboraí | Apartamentos 2 Quartos, Minha Casa Minha Vida" />
        <meta name="twitter:description" content="Lançamento Prime Club em Itaboraí - RJ. Apartamentos 2 Quartos em condomínio fechado. Sinal a partir de R$ 1.000 e Subsídio até R$ 55 mil. Compre pela Caixa." />
        <meta name="twitter:image" content="https://queromeumcmv.com.br/capa-do-site-prime-club-itaborai.webp" />
        
        {/* GEO Tags */}
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="Itaboraí" />
      </Helmet>
      <Header />
      
      <main>
        {/* Hero Section - Primeira Dobra com Formulário Estratégico */}
        {/* Hero Section - Primeira Dobra Harmoniosa com Formulário Estratégico */}
        <section className="relative pt-16 pb-16 lg:pt-24 lg:pb-24 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img fetchPriority="high" 
              src={imgCapa} 
              alt="Apartamentos Prime Clube Itaboraí Minha Casa Minha Vida" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-slate-900/80"></div>
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
                      <span>Outeiro das Pedras, Itaboraí • Minha Casa Minha Vida</span>
                    </div>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] font-black leading-[1.18] text-white drop-shadow-md tracking-tight">
                    Prime Clube Itaboraí: Apartamentos 2 Quartos em Condomínio Clube
                  </h1>

                  <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
                    Transforme o valor do aluguel na parcela do seu apartamento próprio com varanda e elevador. Viva com segurança 24h, lazer completo de clube e financiamento facilitado com garantia da <strong className="text-white font-semibold">Caixa Econômica Federal</strong>.
                  </p>
                </div>

                {/* Meio - 4 Diferenciais em Grade e Cards de Condições */}
                <div className="space-y-4 my-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-inner">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                        <Home className="w-4 h-4 text-amber-300" />
                      </div>
                      <span className="text-sm font-medium text-slate-100">2 Quartos com Opção de Suíte Reversível</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                        <Shield className="w-4 h-4 text-amber-300" />
                      </div>
                      <span className="text-sm font-medium text-slate-100">Portaria e Monitoramento com Segurança 24h</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                        <Trees className="w-4 h-4 text-amber-300" />
                      </div>
                      <span className="text-sm font-medium text-slate-100">Lazer com Piscina, Churrasqueira e Playground</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-amber-300" />
                      </div>
                      <span className="text-sm font-medium text-slate-100">Localização Privilegiada perto da Av. 22 de Maio</span>
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
                    "Condições exclusivas pelo programa Minha Casa Minha Vida 2026"
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
                  alt="Piscina do condomínio Prime Club em Itaboraí" 
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
                  src={imgLocalizacao} 
                  alt="Mapa de localização do condomínio Prime Club em Itaboraí, RJ" 
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
                  <li className="text-orange-300" aria-current="page">Prime Club Itaboraí</li>
                </ol>
              </nav>

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
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-4">
              A oportunidade de sair do aluguel está acabando.
            </h2>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
              Os apartamentos no Prime Club têm alta procura em Itaboraí. Fale com um de nossos corretores credenciados e garanta as melhores condições de lançamento.
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

