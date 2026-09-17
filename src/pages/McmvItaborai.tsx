import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Properties from '../components/Properties';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function McmvItaborai() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Minha Casa Minha Vida em Itaboraí RJ | Quero Meu MCMV</title>
        <meta name="description" content="Encontre apartamentos Minha Casa Minha Vida em Itaboraí. Consulte empreendimentos, financiamento, FGTS, subsídio e condições disponíveis." />
        <link rel="canonical" href="https://queromeumcmv.com.br/minha-casa-minha-vida-itaborai" />
      </Helmet>
      <Header />
      
      <main>
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Minha Casa Minha Vida em Itaboraí - RJ</h1>
            <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
              O programa habitacional que está transformando a vida de milhares de brasileiros tem oportunidades incríveis em Itaboraí. Conheça as regras, saiba como funciona o financiamento e descubra os melhores empreendimentos disponíveis na cidade.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">O que é o Minha Casa Minha Vida?</h2>
              <p className="text-slate-700 mb-4 leading-relaxed">
                O Minha Casa Minha Vida (MCMV) é o maior programa de habitação do Brasil, criado pelo Governo Federal em parceria com a Caixa Econômica Federal. Ele oferece condições facilitadas, como taxas de juros menores e subsídios, para ajudar famílias a conquistarem a casa própria.
              </p>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">Quem pode participar em Itaboraí?</h2>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-success mr-2 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Famílias com renda mensal bruta de acordo com as faixas do programa (Faixa 1, 2 e 3).</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-success mr-2 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Brasileiros ou naturalizados maiores de 18 anos.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-success mr-2 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Pessoas que não possuem imóvel próprio em seu nome.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-success mr-2 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Trabalhadores com carteira assinada (CLT) ou autônomos com comprovação de renda.</span>
                </li>
              </ul>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Como funciona o financiamento e FGTS?</h2>
              <p className="text-slate-700 mb-4 leading-relaxed">
                Ao escolher o seu apartamento em Itaboraí, faremos uma simulação junto à Caixa Econômica. O financiamento pode chegar a até 35 anos (420 meses).
              </p>
              <p className="text-slate-700 mb-4 leading-relaxed">
                Você pode utilizar o seu saldo do <strong>FGTS</strong> para abater o valor da entrada ou reduzir o valor das parcelas mensais, dependendo da sua situação.
              </p>
              <Link to="/financiamento-minha-casa-minha-vida" className="text-primary font-bold hover:underline">
                Ler guia completo sobre Financiamento e FGTS &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* Reuse the properties list, could filter but we can just show all and specify in title */}
        <Properties />

        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Dúvidas Frequentes (FAQ)</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Quais imóveis estão disponíveis em Itaboraí?</h3>
                <p className="text-slate-600 mt-2">Temos diversas opções, como o Prime Club Itaboraí, Flores de Maio e Reserva dos Pássaros 2. Consulte nossa lista de empreendimentos para ver as plantas e metragens disponíveis.</p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Quais documentos são necessários?</h3>
                <p className="text-slate-600 mt-2">Geralmente exigimos RG, CPF, Certidão de Nascimento/Casamento, Comprovante de Residência, Carteira de Trabalho, Extrato do FGTS e os últimos 3 contracheques (ou extratos bancários para autônomos).</p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Como funciona a entrada?</h3>
                <p className="text-slate-600 mt-2">A entrada varia de acordo com a aprovação de crédito da Caixa, o valor do imóvel e o subsídio concedido. Em alguns lançamentos, é possível dar um sinal a partir de R$ 500 ou R$ 1.000 e parcelar o restante da entrada direto com a construtora.</p>
                <p className="text-xs text-slate-500 mt-2">* Valores e condições podem variar conforme análise de crédito, empreendimento e regras vigentes.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
