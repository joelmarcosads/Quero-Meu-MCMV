import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ArticleMeta from '../components/ArticleMeta';
import AuthorProfile from '../components/AuthorProfile';
import { Link } from 'react-router-dom';

export default function SubsidioMcmv() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": "O que é o Subsídio Habitacional do Minha Casa Minha Vida?",
        "description": "Descubra o que é o subsídio, quem tem direito ao desconto e como ele funciona para a compra de imóveis financiados pela Caixa.",
        "author": {
          "@type": "Person",
          "name": "Joel Marcos",
          "jobTitle": "Corretor de Imóveis"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Quero Meu MCMV"
        },
        "dateModified": "2026-09-17"
      },
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
            "name": "Financiamento",
            "item": "https://queromeumcmv.com.br/financiamento-minha-casa-minha-vida"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Subsídio MCMV",
            "item": "https://queromeumcmv.com.br/subsidio-minha-casa-minha-vida"
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>O que é Subsídio no Minha Casa Minha Vida? | Quero Meu MCMV</title>
        <meta name="description" content="Entenda como funciona o subsídio do Minha Casa Minha Vida, quem tem direito ao desconto de até R$ 55 mil e as regras aplicadas pela Caixa." />
        <link rel="canonical" href="https://queromeumcmv.com.br/subsidio-minha-casa-minha-vida" />
        <meta property="og:title" content="O que é Subsídio no Minha Casa Minha Vida?" />
        <meta property="og:description" content="Entenda como funciona o subsídio do Minha Casa Minha Vida, quem tem direito ao desconto de até R$ 55 mil e as regras aplicadas pela Caixa." />
        <meta property="og:url" content="https://queromeumcmv.com.br/subsidio-minha-casa-minha-vida" />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      
      <Header />
      
      <main className="flex-grow bg-slate-50 py-12">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
            O que é o Subsídio do Minha Casa Minha Vida?
          </h1>
          
          <ArticleMeta date="17 de Setembro de 2026" />
          
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:text-slate-700 prose-p:leading-relaxed">
            
            <h2 id="o-que-e">Afinal, o que é subsídio habitacional?</h2>
            <p className="font-semibold text-lg text-slate-800">
              O subsídio é um benefício financeiro concedido pelo Governo Federal para ajudar famílias de menor renda a comprarem a casa própria. O valor não é um empréstimo: é uma parte do imóvel paga pelo governo que reduz o valor a ser financiado.
            </p>
            <p>
              Imagine que você encontrou um imóvel no valor de R$ 200.000,00 e conseguiu um subsídio de R$ 30.000,00. Isso significa que o imóvel passará a custar para você R$ 170.000,00. O subsídio atua como um facilitador fundamental no <Link to="/financiamento-minha-casa-minha-vida" className="text-primary hover:underline">financiamento imobiliário</Link>, reduzindo significativamente o valor da entrada que você pagaria.
            </p>

            <h2 id="quem-tem-direito">Quem tem direito ao benefício?</h2>
            <p className="font-semibold text-slate-800">
              Famílias com renda de até R$ 5.000 podem ser beneficiadas com descontos/subsídios na linha financiada, caso se enquadrem nas regras da Caixa e do Governo Federal.
            </p>
            <p>Os principais critérios são:</p>
            <ul>
              <li><strong>Imóveis Próprios:</strong> Você não pode possuir imóvel residencial próprio registrado em seu nome.</li>
              <li><strong>Idade e Nacionalidade:</strong> Ser maior de 18 anos ou emancipado, e brasileiro nato ou naturalizado.</li>
              <li><strong>Programas Habitacionais:</strong> Não ter recebido benefícios de natureza habitacional em outros programas governamentais, como descontos do FGTS concedidos anteriormente.</li>
            </ul>

            <h2 id="valor-do-subsidio">Como o valor do subsídio é calculado?</h2>
            <p className="font-semibold text-slate-800">
              O valor exato não é o mesmo para todo mundo. Ele varia conforme a renda familiar, a localização geográfica do imóvel (cidade) e o valor total do imóvel. Os descontos podem chegar a até R$ 55 mil nas demais regiões brasileiras, incluindo o Sudeste, conforme renda familiar, localização e regras vigentes.
            </p>
            <p>A lógica principal é: <strong>quanto menor a sua renda familiar, maior tende a ser o subsídio oferecido pelo governo</strong>.</p>
            <ul>
              <li><strong>Renda Familiar:</strong> Famílias na Faixa 1 (até R$ 3.200,00) e na Faixa 2 (de R$ 3.200,01 a R$ 5.000,00) podem ser beneficiadas com descontos na linha financiada. Para famílias da Faixa 3 (renda de R$ 5.000,01 a R$ 9.600,00), o programa não costuma oferecer subsídio no valor da entrada, mas disponibiliza taxas de juros reduzidas e vantajosas. (<Link to="/renda-minha-casa-minha-vida" className="text-primary hover:underline">Entenda mais sobre a análise de renda</Link>).</li>
              <li><strong>Localização:</strong> Cidades maiores ou com déficit habitacional específico possuem regras de cálculos ajustadas pela Caixa. Você encontra excelentes oportunidades de desconto em imóveis em <Link to="/minha-casa-minha-vida-itaborai" className="text-primary hover:underline">Itaboraí</Link> e em <Link to="/minha-casa-minha-vida-sao-goncalo" className="text-primary hover:underline">São Gonçalo</Link>.</li>
            </ul>

            <h2 id="precisa-devolver">O subsídio precisa ser devolvido ao governo?</h2>
            <p className="font-semibold text-slate-800">
              O subsídio habitacional é um benefício concedido conforme as regras da modalidade e reduz o valor necessário para aquisição ou financiamento do imóvel. As condições da operação devem ser verificadas no enquadramento e no contrato.
            </p>
            <p>
              A suspensão ou devolução pode ocorrer em casos onde for comprovada fraude na obtenção do desconto, ocultação de bens prévios, venda irregular do imóvel antes do prazo ou irregularidade na emissão dos <Link to="/documentos-minha-casa-minha-vida" className="text-primary hover:underline">documentos de aprovação</Link>. Por isso, é essencial ser transparente ao fornecer os dados durante a avaliação.
            </p>

            <h2 id="fgts">Posso juntar Subsídio com o FGTS?</h2>
            <p className="font-semibold text-slate-800">
              Sim! A estratégia mais recomendada e utilizada para a compra de apartamentos e casas pelo programa é a junção do subsídio (desconto do governo) com o <Link to="/fgts-minha-casa-minha-vida" className="text-primary hover:underline">saldo do FGTS</Link>. 
            </p>
            <p>
              Dependendo do perfil da família, do valor do imóvel, do saldo de FGTS, do subsídio calculado e das condições da operação, esses recursos podem reduzir significativamente a necessidade de entrada e, em determinados casos, até eliminá-la. E quando há necessidade de diferença, construtoras costumam facilitar o parcelamento.
            </p>
            
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 my-10 text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Descubra qual o valor do seu subsídio!</h3>
              <p className="text-slate-700 mb-6">
                Fale comigo agora e solicite uma simulação gratuita e sem compromisso para vermos quanto de desconto o governo libera para o seu perfil.
              </p>
              <a 
                href="/#simulacao"
                className="inline-block bg-accent hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md transform hover:-translate-y-0.5"
              >
                Simular o meu Subsídio
              </a>
            </div>

            <div className="mt-12 p-4 bg-slate-50 text-sm text-slate-500 rounded-lg border border-slate-100">
              <p className="mb-2"><strong>Nota Editorial:</strong> As regras e condições do Minha Casa Minha Vida podem ser atualizadas. A aprovação do financiamento, subsídio, uso do FGTS e demais condições dependem do enquadramento da família, do imóvel e da análise da instituição financeira.</p>
              <strong>Fontes consultadas:</strong> Regras vigentes do programa Minha Casa Minha Vida, <a href="https://www.gov.br/cidades/pt-br" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-700">Ministério das Cidades</a> e normativos da linha financiada. 
            </div>

          </div>
          
          <AuthorProfile />
          
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
