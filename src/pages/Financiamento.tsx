import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ArticleMeta from '../components/ArticleMeta';
import AuthorProfile from '../components/AuthorProfile';
import { Link } from 'react-router-dom';
import { Calculator, FileText, Home, Coins, HandCoins, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export default function Financiamento() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "O que mudou no novo Minha Casa Minha Vida?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "O novo Minha Casa Minha Vida ampliou o limite de renda da faixa 1, aumentou o valor máximo do imóvel que pode ser financiado (até R$ 350 mil na faixa 3) e elevou o teto do subsídio para até R$ 55 mil, dependendo da região e da renda familiar."
        }
      },
      {
        "@type": "Question",
        "name": "Posso juntar renda com outra pessoa?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim, é possível compor renda com cônjuge, familiares ou até amigos. A soma das rendas será considerada para definir a faixa do programa e a capacidade de pagamento das parcelas."
        }
      },
      {
        "@type": "Question",
        "name": "Autônomo pode financiar pelo Minha Casa Minha Vida?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim. Profissionais autônomos e MEIs podem financiar comprovando renda através de extratos bancários dos últimos 6 meses e Declaração de Imposto de Renda."
        }
      }
    ]
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Guia Completo: Financiamento Minha Casa Minha Vida",
    "description": "Entenda as faixas de renda, como conseguir subsídio, utilizar o FGTS e os documentos exigidos pela Caixa Econômica no MCMV.",
    "author": {
      "@type": "Person",
      "name": "Joel Marcos",
      "jobTitle": "Corretor de Imóveis"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Quero Meu MCMV"
    },
    "dateModified": "2024-03-20"
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Como Financiar pelo Minha Casa Minha Vida | Guia Completo MCMV</title>
        <meta name="description" content="Entenda as faixas de renda, como conseguir subsídio de até R$ 55 mil, utilizar o FGTS na entrada e os documentos exigidos pela Caixa Econômica." />
        <link rel="canonical" href="https://queromeumcmv.com.br/financiamento-minha-casa-minha-vida" />
        <meta property="og:title" content="Como Financiar pelo Minha Casa Minha Vida | Guia Completo MCMV" />
        <meta property="og:description" content="Entenda as faixas de renda, como conseguir subsídio de até R$ 55 mil, utilizar o FGTS na entrada e os documentos exigidos pela Caixa Econômica." />
        <meta property="og:url" content="https://queromeumcmv.com.br/financiamento-minha-casa-minha-vida" />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>
      
      <Header />
      
      <main>
        {/* HERO PILLAR */}
        <section className="bg-slate-900 text-white pt-24 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary-light font-medium text-sm mb-4 border border-primary/30">
              Guia Definitivo 2024
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
              Como funciona o Financiamento <span className="text-primary-light">Minha Casa Minha Vida</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
              Entenda as novas regras do programa habitacional, descubra qual é a sua faixa de renda, como conseguir descontos do governo e usar o seu FGTS na compra do primeiro imóvel.
            </p>
          </div>
        </section>

        {/* BREADCRUMB */}
        <div className="bg-white border-b border-slate-200 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ol className="flex items-center space-x-2 text-sm text-slate-500">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><span className="mx-2">&gt;</span></li>
              <li className="text-slate-800 font-medium">Financiamento MCMV</li>
            </ol>
          </div>
        </div>

        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-12">
              
              {/* MAIN CONTENT */}
              <div className="lg:col-span-8">
                <article className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:text-slate-900 prose-p:text-slate-700 prose-a:text-primary hover:prose-a:text-primary-dark">
                  
                  <ArticleMeta date="20 de Março de 2024" />

                  <p className="lead text-lg font-medium text-slate-800">
                    O programa Minha Casa Minha Vida (MCMV) retornou com novas regras, limites ampliados e taxas de juros reduzidas para facilitar o acesso da população brasileira à casa própria. Se você mora em <Link to="/minha-casa-minha-vida-itaborai">Itaboraí</Link>, <Link to="/minha-casa-minha-vida-sao-goncalo">São Gonçalo</Link> ou região, este guia explicará o passo a passo para a sua aprovação.
                  </p>

                  <h2 id="o-programa">O que é o Programa Minha Casa Minha Vida?</h2>
                  <p>
                    O MCMV é o programa de habitação federal do Brasil, operado principalmente pela Caixa Econômica Federal. O seu objetivo é subsidiar a aquisição de moradia própria para famílias com renda bruta de até R$ 8.000,00 mensais em áreas urbanas, oferecendo as menores taxas de juros do mercado imobiliário.
                  </p>

                  {/* TOPICOS CLUSTER */}
                  <div className="not-prose my-12 grid sm:grid-cols-2 gap-6">
                    <Link to="/renda-minha-casa-minha-vida" className="block p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:border-primary hover:shadow-md transition-all group">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 transition-transform">
                        <Coins className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Faixas de Renda</h3>
                      <p className="text-slate-600 text-sm mb-4">Descubra em qual faixa você se enquadra e se pode compor renda com outra pessoa.</p>
                      <div className="text-primary font-medium text-sm flex items-center">
                        Ler artigo <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </Link>

                    <Link to="/subsidio-minha-casa-minha-vida" className="block p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:border-primary hover:shadow-md transition-all group">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 text-green-600 group-hover:scale-110 transition-transform">
                        <HandCoins className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Subsídio do Governo</h3>
                      <p className="text-slate-600 text-sm mb-4">Entenda o que é o desconto de até R$ 55 mil e quem tem direito a recebê-lo.</p>
                      <div className="text-primary font-medium text-sm flex items-center">
                        Ler artigo <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </Link>

                    <Link to="/fgts-minha-casa-minha-vida" className="block p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:border-primary hover:shadow-md transition-all group">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 text-orange-600 group-hover:scale-110 transition-transform">
                        <Calculator className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Uso do FGTS</h3>
                      <p className="text-slate-600 text-sm mb-4">Saiba como utilizar o seu saldo do FGTS para pagar a entrada ou amortizar parcelas.</p>
                      <div className="text-primary font-medium text-sm flex items-center">
                        Ler artigo <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </Link>

                    <Link to="/documentos-minha-casa-minha-vida" className="block p-6 bg-slate-50 border border-slate-200 rounded-2xl hover:border-primary hover:shadow-md transition-all group">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 text-purple-600 group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Documentação</h3>
                      <p className="text-slate-600 text-sm mb-4">A lista completa de documentos exigidos pela Caixa para trabalhadores CLT e Autônomos.</p>
                      <div className="text-primary font-medium text-sm flex items-center">
                        Ler artigo <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </Link>
                  </div>

                  <h2 id="etapas">Como funciona o processo de aprovação?</h2>
                  <p>O processo de financiamento habitacional envolve algumas etapas padrão desde a escolha do imóvel até a assinatura do contrato:</p>
                  <ol>
                    <li><strong>Simulação de Crédito:</strong> A primeira etapa é simular o seu perfil para saber o valor liberado pelo banco, a estimativa do subsídio e o valor da parcela.</li>
                    <li><strong>Análise de Documentação:</strong> O correspondente bancário reúne seus <Link to="/documentos-minha-casa-minha-vida">documentos pessoais e comprovantes de renda</Link> para análise rigorosa do risco de crédito na Caixa Econômica.</li>
                    <li><strong>Aprovação e Escolha:</strong> Com a "carta de crédito" aprovada, você escolhe o imóvel (na planta ou pronto) que se enquadra nos valores liberados.</li>
                    <li><strong>Assinatura do Contrato:</strong> O contrato tem força de escritura pública. Após a assinatura, inicia-se o pagamento das parcelas.</li>
                  </ol>

                  <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl my-8">
                    <h3 className="text-blue-900 font-bold flex items-center mt-0 mb-2">
                      <ShieldCheck className="w-5 h-5 mr-2" />
                      Consultoria Especializada
                    </h3>
                    <p className="text-blue-800 m-0">
                      Na <strong>Quero Meu MCMV</strong>, nós cuidamos de toda a burocracia documental e bancária para você de forma transparente. Trabalhamos em parceria com a Caixa Econômica para garantir agilidade na sua aprovação.
                    </p>
                  </div>
                  
                  <AuthorProfile />

                </article>
              </div>

              {/* SIDEBAR CTA */}
              <aside className="lg:col-span-4">
                <div className="sticky top-24">
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 text-center">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 text-accent">
                      <Home className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Quer saber se você aprova?</h3>
                    <p className="text-slate-600 mb-6 text-sm">
                      Faça uma simulação gratuita e descubra o valor da parcela e o subsídio liberado para a sua renda.
                    </p>
                    <a 
                      href="/#simulacao"
                      className="block w-full bg-accent hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md transform hover:-translate-y-0.5"
                    >
                      Fazer Simulação Grátis
                    </a>
                    
                    <hr className="my-6 border-slate-100" />
                    
                    <h4 className="font-bold text-slate-900 text-sm mb-4 text-left">Imóveis na Região:</h4>
                    <ul className="space-y-3 text-left">
                      <li>
                        <Link to="/minha-casa-minha-vida-itaborai" className="flex items-center text-slate-600 hover:text-primary transition-colors text-sm">
                          <ArrowRight className="w-4 h-4 mr-2 text-primary" />
                          Lançamentos em Itaboraí
                        </Link>
                      </li>
                      <li>
                        <Link to="/minha-casa-minha-vida-sao-goncalo" className="flex items-center text-slate-600 hover:text-primary transition-colors text-sm">
                          <ArrowRight className="w-4 h-4 mr-2 text-primary" />
                          Lançamentos em São Gonçalo
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </aside>

            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center mb-10">
              <HelpCircle className="w-8 h-8 text-primary mr-3" />
              <h2 className="text-3xl font-bold text-slate-900 text-center">Perguntas Frequentes</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-2">O que mudou no novo Minha Casa Minha Vida?</h3>
                <p className="text-slate-600">O novo Minha Casa Minha Vida ampliou o limite de renda da faixa 1, aumentou o valor máximo do imóvel que pode ser financiado (até R$ 350 mil na faixa 3) e elevou o teto do subsídio para até R$ 55 mil, dependendo da região e da renda familiar.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Posso juntar renda com outra pessoa?</h3>
                <p className="text-slate-600">Sim, é possível compor renda com cônjuge, familiares ou até amigos. A soma das rendas será considerada para definir a faixa do programa e a capacidade de pagamento das parcelas.</p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Autônomo pode financiar pelo Minha Casa Minha Vida?</h3>
                <p className="text-slate-600">Sim. Profissionais autônomos e MEIs podem financiar comprovando renda através de extratos bancários dos últimos 6 meses e Declaração de Imposto de Renda.</p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
