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
        <meta name="description" content="Apartamentos Minha Casa Minha Vida em Niterói-RJ com financiamento pela Caixa Econômica Federal. Atendimento consultivo com corretor CRECI 39.583F. Simule grátis." />
        <link rel="canonical" href="https://queromeumcmv.com.br/niteroirj" />
        <meta property="og:site_name" content="Quero Meu MCMV" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:title" content="Minha Casa Minha Vida em Niterói-RJ: Apartamentos 2026" />
        <meta property="og:description" content="Apartamentos Minha Casa Minha Vida em Niterói-RJ com financiamento pela Caixa Econômica Federal. Atendimento consultivo com corretor CRECI 39.583F. Simule grátis." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://queromeumcmv.com.br/niteroirj" />
        <meta property="og:image" content="https://queromeumcmv.com.br/capa-site-quero-meu-mcmv-open-graph.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Minha Casa Minha Vida em Niterói-RJ: Apartamentos 2026" />
        <meta name="twitter:description" content="Apartamentos Minha Casa Minha Vida em Niterói-RJ com financiamento pela Caixa Econômica Federal. Atendimento consultivo com corretor CRECI 39.583F. Simule grátis." />
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
                  A renda familiar bruta deve ser de até R$ 8.000 (Faixa 2) ou até R$ 4.400 (Faixa 1, com maior subsídio). Trabalhadores formais, informais e MEIs podem participar — desde que comprovem a renda de acordo com as exigências da Caixa Econômica Federal.
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
