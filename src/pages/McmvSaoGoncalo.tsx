import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Properties from '../components/Properties';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function McmvSaoGoncalo() {
  const schema = {
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
            "name": "Minha Casa Minha Vida São Gonçalo",
            "item": "https://queromeumcmv.com.br/minha-casa-minha-vida-sao-goncalo"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Existem apartamentos Minha Casa Minha Vida em São Gonçalo?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim! Trabalhamos com diversas opções como o Solar da Trindade e o Residencial Florescer, que oferecem apartamentos de 2 e 3 quartos, suíte e varanda."
            }
          },
          {
            "@type": "Question",
            "name": "Posso usar meu FGTS na compra?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim, o FGTS pode ser utilizado como parte do pagamento da entrada ou para reduzir o valor das parcelas do financiamento, desde que você tenha pelo menos 3 anos de trabalho sob regime do FGTS (somando todos os períodos trabalhados)."
            }
          },
          {
            "@type": "Question",
            "name": "Como solicitar uma simulação?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Basta clicar em qualquer botão de simulação no nosso site ou entrar em contato direto pelo WhatsApp. Faremos a sua análise de forma ágil e transparente."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Minha Casa Minha Vida em São Gonçalo RJ | Quero Meu MCMV</title>
        <meta name="description" content="Encontre apartamentos Minha Casa Minha Vida em São Gonçalo. Consulte empreendimentos, financiamento, FGTS, subsídio e condições disponíveis." />
        <link rel="canonical" href="https://queromeumcmv.com.br/minha-casa-minha-vida-sao-goncalo" />
        <meta property="og:title" content="Minha Casa Minha Vida em São Gonçalo RJ | Quero Meu MCMV" />
        <meta property="og:description" content="Encontre apartamentos Minha Casa Minha Vida em São Gonçalo. Consulte empreendimentos, financiamento, FGTS, subsídio e condições disponíveis." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://queromeumcmv.com.br/minha-casa-minha-vida-sao-goncalo" />
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="São Gonçalo" />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
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
            <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
              Descubra as melhores opções de apartamentos e casas financiadas pela Caixa em São Gonçalo. Entenda o processo de compra, análise de crédito e conquiste a sua casa própria com as vantagens do programa.
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
                Comprar o seu primeiro imóvel pode parecer complexo, mas nossa equipe cuida de toda a burocracia para você. A primeira etapa é solicitar uma simulação gratuita e fornecer a documentação para a Caixa Econômica Federal.
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
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
