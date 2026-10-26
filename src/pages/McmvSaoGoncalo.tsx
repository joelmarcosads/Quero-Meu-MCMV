import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import Properties from '../components/Properties';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthorProfile from '../components/AuthorProfile';

const WHATSAPP_URL =
  'https://wa.me/5521965928399?text=Ol%C3%A1%2C%20Joel!%20Vim%20pelo%20site%20e%20quero%20simular%20meu%20Minha%20Casa%20Minha%20Vida.';

export default function McmvSaoGoncalo() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Minha Casa Minha Vida em São Gonçalo: Apartamentos 2026</title>
        <meta name="description" content="Apartamentos MCMV em São Gonçalo, perto da Universo e com entrada facilitada. Atendimento com corretor CRECI. Simule seu financiamento." />
        <link rel="canonical" href="https://queromeumcmv.com.br/minha-casa-minha-vida-sao-goncalo" />
        <meta property="og:site_name" content="Quero Meu MCMV" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:title" content="Minha Casa Minha Vida em São Gonçalo: Apartamentos 2026" />
        <meta property="og:description" content="Apartamentos MCMV em São Gonçalo, perto da Universo e com entrada facilitada. Atendimento com corretor CRECI. Simule seu financiamento." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://queromeumcmv.com.br/minha-casa-minha-vida-sao-goncalo" />
        <meta property="og:image" content="https://queromeumcmv.com.br/capa-site-quero-meu-mcmv-open-graph.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Minha Casa Minha Vida em São Gonçalo: Apartamentos 2026" />
        <meta name="twitter:description" content="Apartamentos MCMV em São Gonçalo, perto da Universo e com entrada facilitada. Atendimento com corretor CRECI. Simule seu financiamento." />
        <meta name="twitter:image" content="https://queromeumcmv.com.br/capa-site-quero-meu-mcmv-open-graph.webp" />
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="São Gonçalo" />
      </Helmet>
      <Header />
      
      <main>
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-sm font-medium text-slate-400 mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><span className="mx-2">&gt;</span></li>
                <li className="text-orange-300" aria-current="page">MCMV São Gonçalo</li>
              </ol>
            </nav>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Minha Casa Minha Vida em São Gonçalo - RJ</h1>
            <p className="text-lg text-slate-300 max-w-3xl leading-relaxed mb-4">
              Descubra as melhores opções de apartamentos financiados pela Caixa em São Gonçalo. Entenda o processo de compra, análise de crédito e conquiste a sua casa própria com as vantagens do programa.
            </p>
            <p className="text-sm text-orange-200/90 font-medium">
              Atendimento com Joel Marcos, corretor especialista em MCMV em Itaboraí, que também atende São Gonçalo.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Apartamentos e Lançamentos em São Gonçalo</h2>
              <p className="text-slate-700 mb-4 leading-relaxed">
                São Gonçalo é uma das cidades com o maior crescimento imobiliário do estado, atraindo excelentes lançamentos. Aqui você encontra condomínios fechados com lazer completo, segurança 24h e infraestrutura moderna.
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Vantagens de comprar em São Gonçalo:</h2>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-success mr-2 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Empreendimentos em localizações estratégicas (como Trindade, Vila Iara, etc).</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-success mr-2 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Fácil acesso a Niterói e ao Centro do Rio de Janeiro.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-success mr-2 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Excelente custo-benefício e alto potencial de valorização do imóvel.</span>
                </li>
              </ul>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">O processo de compra e aprovação</h2>
              <p className="text-slate-700 mb-4 leading-relaxed">
                Comprar o seu primeiro imóvel pode parecer complexo, mas o atendimento com Joel Marcos, corretor especialista em MCMV em Itaboraí, que também atende São Gonçalo, simplifica toda a burocracia para você. A primeira etapa é solicitar uma simulação gratuita e fornecer a documentação para a Caixa Econômica Federal.
              </p>
              <p className="text-slate-700 mb-4 leading-relaxed">
                A Caixa realizará a análise de crédito considerando sua renda, idade e valor do imóvel desejado em São Gonçalo, determinando o valor liberado, a taxa de juros e o subsídio.
              </p>
              <Link to="/financiamento-minha-casa-minha-vida" className="text-primary font-bold hover:underline">
                Tudo sobre o processo de Financiamento Caixa &rarr;
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 bg-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link to="/renda-minha-casa-minha-vida" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-primary hover:shadow-md transition-all">
                <h3 className="font-bold text-slate-900 mb-2">Faixas de Renda</h3>
                <p className="text-sm text-slate-600">Descubra sua faixa de renda e os limites de aprovação para São Gonçalo.</p>
              </Link>
              <Link to="/subsidio-minha-casa-minha-vida" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-primary hover:shadow-md transition-all">
                <h3 className="font-bold text-slate-900 mb-2">Subsídio MCMV</h3>
                <p className="text-sm text-slate-600">Entenda como conseguir desconto na compra do seu apartamento.</p>
              </Link>
              <Link to="/fgts-minha-casa-minha-vida" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-primary hover:shadow-md transition-all">
                <h3 className="font-bold text-slate-900 mb-2">Uso do FGTS</h3>
                <p className="text-sm text-slate-600">Saiba como abater a entrada usando o seu saldo do Fundo de Garantia.</p>
              </Link>
              <Link to="/documentos-minha-casa-minha-vida" className="bg-white p-6 rounded-xl border border-slate-200 hover:border-primary hover:shadow-md transition-all">
                <h3 className="font-bold text-slate-900 mb-2">Documentos</h3>
                <p className="text-sm text-slate-600">Veja o que separar para aprovar seu crédito imobiliário na Caixa.</p>
              </Link>
            </div>
          </div>
        </section>

        <Properties filterCity="São Gonçalo" />

        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Principais Dúvidas (FAQ)</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Existem apartamentos Minha Casa Minha Vida em São Gonçalo?</h3>
                <p className="text-slate-600 mt-2">Sim! Trabalhamos com diversas opções como o Solar da Trindade e o Residencial Florescer, que oferecem apartamentos de 2 e 3 quartos, suíte e varanda.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Posso usar meu FGTS na compra?</h3>
                <p className="text-slate-600 mt-2">Sim, o FGTS pode ser utilizado como parte do pagamento da entrada ou para reduzir o valor das parcelas do financiamento, desde que você tenha pelo menos 3 anos de trabalho sob regime do FGTS (somando todos os períodos trabalhados).</p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Como solicitar uma simulação?</h3>
                <p className="text-slate-600 mt-2">Basta clicar em qualquer botão de simulação no nosso site ou entrar em contato direto pelo WhatsApp. Faremos a sua análise de forma ágil e transparente.</p>
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
        
        {/* Formulário de Captação Estratégico */}
        <section className="py-16 bg-slate-100 border-t border-slate-200" id="simulacao">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">
                Receba Opções de Imóveis em São Gonçalo
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Faça sua simulação gratuita e receba no seu WhatsApp as melhores oportunidades pelo Minha Casa Minha Vida com o corretor Joel Marcos.
              </p>
            </div>
            <div className="max-w-xl mx-auto shadow-xl rounded-2xl overflow-hidden">
              <LeadForm />
            </div>
          </div>
        </section>

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
