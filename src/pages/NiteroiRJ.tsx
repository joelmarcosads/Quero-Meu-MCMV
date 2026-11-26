import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import AuthorProfile from '../components/AuthorProfile';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const WHATSAPP_URL =
  'https://wa.me/5521965928399?text=Ol%C3%A1%2C%20Joel!%20Vim%20pelo%20site%20e%20quero%20simular%20meu%20Minha%20Casa%20Minha%20Vida%20em%20Niter%C3%B3i.';

export default function NiteroiRJ() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Minha Casa Minha Vida em Niterói-RJ: Apartamentos 2026</title>
        <meta name="description" content="Quer morar em Niterói ou a 15 minutos dela pagando parcela de Minha Casa Minha Vida? Veja as faixas de renda, o subsídio e as opções para o seu orçamento." />
        <link rel="canonical" href="https://queromeumcmv.com.br/niteroirj" />
        <meta property="og:site_name" content="Quero Meu MCMV" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:title" content="Minha Casa Minha Vida em Niterói-RJ: Apartamentos 2026" />
        <meta property="og:description" content="Quer morar em Niterói ou a 15 minutos dela pagando parcela de Minha Casa Minha Vida? Veja as faixas de renda, o subsídio e as opções para o seu orçamento." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://queromeumcmv.com.br/niteroirj" />
        <meta property="og:image" content="https://queromeumcmv.com.br/capa-site-quero-meu-mcmv-open-graph.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Minha Casa Minha Vida em Niterói-RJ: Apartamentos 2026" />
        <meta name="twitter:description" content="Quer morar em Niterói ou a 15 minutos dela pagando parcela de Minha Casa Minha Vida? Veja as faixas de renda, o subsídio e as opções para o seu orçamento." />
        <meta name="twitter:image" content="https://queromeumcmv.com.br/capa-site-quero-meu-mcmv-open-graph.webp" />
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="Niterói" />
      </Helmet>
      <Header />

      <main id="main-content">
        {/* Hero */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-sm font-medium text-slate-400 mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><span className="mx-2">&gt;</span></li>
                <li className="text-orange-300" aria-current="page">MCMV Niterói</li>
              </ol>
            </nav>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              Minha Casa Minha Vida em Niterói - RJ
            </h1>
            <p className="text-lg text-slate-300 max-w-3xl leading-relaxed mb-4">
              Financie seu apartamento em Niterói pelo programa Minha Casa Minha Vida com as menores taxas de juros do mercado, subsídio do governo e aprovação pela Caixa Econômica Federal.
            </p>
            <p className="text-sm text-orange-200/90 font-medium">
              Atendimento consultivo com Joel Marcos (CRECI 39.583F), especialista em MCMV com base em Itaboraí-RJ.
            </p>
          </div>
        </section>

        {/* Conteúdo principal */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                Apartamentos MCMV disponíveis em Niterói
              </h2>
              <p className="text-slate-700 mb-4 leading-relaxed">
                Niterói oferece excelente qualidade de vida e infraestrutura consolidada, com acesso fácil ao Rio de Janeiro pela Ponte Rio-Niterói e pelas barcas. A cidade conta com opções de apartamentos enquadrados no Minha Casa Minha Vida, especialmente nos bairros periféricos e em municípios limítrofes com fácil acesso à região.
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">
                Por que comprar pelo MCMV em Niterói:
              </h2>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-success mr-2 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Taxas de juros subsidiadas — as menores do mercado para imóvel residencial.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-success mr-2 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Subsídio de até R$ 55.000 para famílias nas faixas 1 e 2 do programa.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-success mr-2 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Uso do FGTS como entrada ou para abater parcelas do financiamento.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-success mr-2 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Região valorizada, próxima a universidades, hospitais e comércio.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-success mr-2 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Acesso rápido ao Rio de Janeiro (Ponte Rio-Niterói e barcas).</span>
                </li>
              </ul>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Como funciona o atendimento em Niterói
              </h2>
              <p className="text-slate-700 mb-4 leading-relaxed">
                Joel Marcos atende Niterói de forma consultiva: após a simulação gratuita, analisamos sua renda, faixa do programa e melhores opções disponíveis na região — tudo online ou por WhatsApp, sem necessidade de deslocamento inicial.
              </p>
              <p className="text-slate-700 mb-4 leading-relaxed">
                O processo segue os mesmos critérios da Caixa Econômica Federal: análise de crédito, faixa de renda familiar, uso do FGTS e documentação. Com 24 anos de experiência no mercado imobiliário, Joel Marcos conhece os caminhos mais rápidos para aprovação.
              </p>
              <Link
                to="/financiamento-minha-casa-minha-vida"
                className="text-primary font-bold hover:underline"
              >
                Como funciona o financiamento MCMV pela Caixa →
              </Link>
            </div>
          </div>
        </section>

        {/* Lançamento em destaque */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/orla-central-niteroi"
              className="grid md:grid-cols-2 gap-6 items-center bg-slate-900 text-white rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src="/orla-central-niteroi-fachada.webp"
                alt="Fachada do Orla Central, da Cury, no Centro de Niterói"
                width={1600}
                height={774}
                loading="lazy"
                className="w-full h-56 md:h-full object-cover"
              />
              <div className="p-6 md:p-8">
                <p className="text-xs font-bold tracking-widest text-orange-300">LANÇAMENTO NO CENTRO DE NITERÓI</p>
                <h2 className="text-2xl font-bold mt-2">Orla Central — apartamentos de 1 a 3 quartos perto do Caminho Niemeyer</h2>
                <p className="text-slate-300 mt-3">
                  Rooftop com vista para a Baía, lazer completo e barcas por perto. A partir de R$ 331 mil*.
                </p>
                <p className="text-xs text-slate-400 mt-2">*Valores sujeitos a alteração sem aviso prévio. Consulte a disponibilidade com o corretor.</p>
                <span className="inline-block mt-4 font-bold text-orange-300">Ver o Orla Central →</span>
              </div>
            </Link>
          </div>
        </section>

        <section className="pb-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/bosque-residence-niteroi"
              className="grid md:grid-cols-2 gap-6 items-center bg-[#1E3B2C] text-white rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src="/meu-crescer-niteroi-bosque-vista-do-morro-800.webp"
                alt="Torres do Bosque Residence cercadas pela mata no Fonseca, Niterói"
                width={800}
                height={566}
                loading="lazy"
                className="w-full h-56 md:h-full object-cover"
              />
              <div className="p-6 md:p-8">
                <p className="text-xs font-bold tracking-widest text-amber-300">LANÇAMENTO NO FONSECA</p>
                <h2 className="text-2xl font-bold mt-2">Bosque Residence — 2 quartos com 8.000 m² de bosque privativo</h2>
                <p className="text-emerald-50/90 mt-3">Trilha, mirante e piscina no rooftop, com financiamento CAIXA. A partir de R$ 324 mil*.</p>
                <p className="text-xs text-emerald-50/70 mt-2">*Os valores podem sofrer alterações sem prévio aviso. Consulte a disponibilidade com o corretor.</p>
                <span className="inline-block mt-4 font-bold text-amber-300">Ver o Bosque Residence →</span>
              </div>
            </Link>
          </div>
        </section>

        <section className="pb-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/orla-guanabara-niteroi"
              className="grid md:grid-cols-2 gap-6 items-center bg-[#0B3B44] text-white rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src="/orla-guanabara-niteroi-vista-aerea-caminho-niemeyer-800.webp"
                alt="Vista aérea do Orla Guanabara perto do Caminho Niemeyer, em Niterói"
                width={800}
                height={437}
                loading="lazy"
                className="w-full h-56 md:h-full object-cover"
              />
              <div className="p-6 md:p-8">
                <p className="text-xs font-bold tracking-widest text-amber-300">LANÇAMENTO MINHA CASA MINHA VIDA</p>
                <h2 className="text-2xl font-bold mt-2">Orla Guanabara — 2 quartos com rooftop e vista para a Baía</h2>
                <p className="text-cyan-50/90 mt-3">Perto do Caminho Niemeyer, com lazer completo. A partir de R$ 299 mil*.</p>
                <p className="text-xs text-cyan-50/70 mt-2">*Os valores podem sofrer alterações sem prévio aviso. Consulte a disponibilidade com o corretor.</p>
                <span className="inline-block mt-4 font-bold text-amber-300">Ver o Orla Guanabara →</span>
              </div>
            </Link>
          </div>
        </section>

        <section className="pb-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/sun-in-studio-design-niteroi"
              className="grid md:grid-cols-2 gap-6 items-center bg-[#1E2A44] text-white rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src="/sun-in-studio-design-niteroi-piscina-rooftop-800.webp"
                alt="Piscina no rooftop do Sun In Studio Design, no Centro de Niterói"
                width={800}
                height={416}
                loading="lazy"
                className="w-full h-56 md:h-full object-cover"
              />
              <div className="p-6 md:p-8">
                <p className="text-xs font-bold tracking-widest text-orange-300">STUDIOS NO CENTRO DE NITERÓI</p>
                <h2 className="text-2xl font-bold mt-2">Sun In Studio Design — studios perto da UFF com rooftop e vista mar</h2>
                <p className="text-orange-50/90 mt-3">Piscina, sky bar e spa na cobertura, coworking e coliving. A partir de R$ 295 mil*.</p>
                <p className="text-xs text-orange-50/70 mt-2">*Os valores podem sofrer alterações sem prévio aviso. Consulte a disponibilidade com o corretor.</p>
                <span className="inline-block mt-4 font-bold text-orange-300">Ver o Sun In →</span>
              </div>
            </Link>
          </div>
        </section>

        <section className="pb-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/caminhos-guanabara-niteroi"
              className="grid md:grid-cols-2 gap-6 items-center bg-[#123A47] text-white rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src="/caminhos-da-guanabara-niteroi-solario-rooftop-800.webp"
                alt="Solário no rooftop do Caminhos da Guanabara, com vista para a Baía de Guanabara, em Niterói"
                width={800}
                height={511}
                loading="lazy"
                className="w-full h-56 md:h-full object-cover"
              />
              <div className="p-6 md:p-8">
                <p className="text-xs font-bold tracking-widest text-amber-300">LANÇAMENTO CURY · CAMINHO NIEMEYER</p>
                <h2 className="text-2xl font-bold mt-2">Caminhos da Guanabara — 1 e 2 quartos com varanda e rooftop de frente para a Baía</h2>
                <p className="text-sky-50/90 mt-3">Piscinas, campo society, academia e coworking, perto das barcas e do Terminal João Goulart. A partir de R$ 340 mil*.</p>
                <p className="text-xs text-sky-50/70 mt-2">*Os valores podem sofrer alterações sem prévio aviso. Consulte a disponibilidade com o corretor.</p>
                <span className="inline-block mt-4 font-bold text-amber-300">Ver o Caminhos da Guanabara →</span>
              </div>
            </Link>
          </div>
        </section>

        <section className="pb-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to="/niteroi-open-residence"
              className="grid md:grid-cols-2 gap-6 items-center bg-[#1B2A5C] text-white rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src="/niteroi-open-residencial-fachada-800.webp"
                alt="Fachada do Niterói Open Residencial, no Bairro Chic, Fonseca, Niterói"
                width={800}
                height={720}
                loading="lazy"
                className="w-full h-56 md:h-full object-cover"
              />
              <div className="p-6 md:p-8">
                <p className="text-xs font-bold tracking-widest text-rose-300">PRONTO PARA MORAR · ÚLTIMAS UNIDADES</p>
                <h2 className="text-2xl font-bold mt-2">Niterói Open Residencial — lofts e 2 quartos prontos para morar no Fonseca</h2>
                <p className="text-rose-50/90 mt-3">Piscina com prainha, coworking e espaço fitness, a 1 minuto da Alameda São Boaventura. A partir de R$ 287 mil*.</p>
                <p className="text-xs text-rose-50/70 mt-2">*Os valores podem sofrer alterações sem prévio aviso. Consulte a disponibilidade com o corretor.</p>
                <span className="inline-block mt-4 font-bold text-rose-300">Ver o Niterói Open →</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Links internos */}
        <section className="py-12 bg-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link to="/renda-minha-casa-minha-vida" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-primary hover:shadow-md transition-all">
                <h3 className="font-bold text-slate-900 mb-2">Faixas de Renda</h3>
                <p className="text-sm text-slate-600">Veja qual faixa do MCMV se encaixa na sua renda familiar bruta.</p>
              </Link>
              <Link to="/subsidio-minha-casa-minha-vida" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-primary hover:shadow-md transition-all">
                <h3 className="font-bold text-slate-900 mb-2">Subsídio MCMV</h3>
                <p className="text-sm text-slate-600">Descubra quanto de desconto o governo pode dar na sua compra.</p>
              </Link>
              <Link to="/fgts-minha-casa-minha-vida" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-primary hover:shadow-md transition-all">
                <h3 className="font-bold text-slate-900 mb-2">Uso do FGTS</h3>
                <p className="text-sm text-slate-600">Saiba como usar o saldo do Fundo de Garantia na entrada.</p>
              </Link>
              <Link to="/documentos-minha-casa-minha-vida" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-primary hover:shadow-md transition-all">
                <h3 className="font-bold text-slate-900 mb-2">Documentos</h3>
                <p className="text-sm text-slate-600">Lista completa do que separar para aprovação na Caixa.</p>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
              Dúvidas Frequentes — MCMV em Niterói
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Tem apartamento Minha Casa Minha Vida em Niterói?
                </h3>
                <p className="text-slate-600 mt-2">
                  Sim. Niterói tem opções enquadradas no MCMV, especialmente em bairros como Pendotiba, Largo da Batalha e regiões com acesso ao centro. Consulte nossa carteira de imóveis disponíveis via WhatsApp para ver as opções atuais.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Qual a renda mínima para financiar em Niterói pelo MCMV?
                </h3>
                <p className="text-slate-600 mt-2">
                  Não existe renda mínima: o programa atende famílias com renda bruta de até R$ 13.000, divididas em 4 faixas (até R$ 3.200, R$ 5.000, R$ 9.600 e R$ 13.000). Quem ganha até R$ 5.000 ainda pode receber subsídio. Trabalhadores formais, informais e MEIs podem participar — desde que comprovem a renda de acordo com as exigências da Caixa Econômica Federal.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Joel Marcos atende presencialmente em Niterói?
                </h3>
                <p className="text-slate-600 mt-2">
                  O atendimento inicial é consultivo — feito por WhatsApp, vídeo ou telefone. O deslocamento até Niterói para visitas aos imóveis e assinatura de documentos é combinado conforme andamento do processo.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  Posso usar o FGTS na compra de imóvel em Niterói?
                </h3>
                <p className="text-slate-600 mt-2">
                  Sim, desde que você tenha pelo menos 3 anos de trabalho com carteira assinada (somando todos os vínculos empregatícios). O FGTS pode ser usado como entrada, para abater parcelas ou reduzir o saldo devedor do financiamento.
                </p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center bg-success hover:bg-green-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                <span>Fale com Joel Marcos pelo WhatsApp</span>
              </a>
            </div>
          </div>
        </section>

        {/* Formulário */}
        <section className="py-16 bg-slate-100 border-t border-slate-200" id="simulacao">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">
                Simule seu MCMV em Niterói — Grátis
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Preencha o formulário e receba no seu WhatsApp as melhores opções disponíveis em Niterói com atendimento personalizado de Joel Marcos.
              </p>
            </div>
            <div className="max-w-xl mx-auto shadow-xl rounded-2xl overflow-hidden">
              <LeadForm />
            </div>
          </div>
        </section>

        {/* Author */}
        <section className="py-12 bg-slate-50 border-t border-slate-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <AuthorProfile />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
