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
        "dateModified": "2024-03-20"
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
          
          <ArticleMeta date="20 de Março de 2024" />
          
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:text-slate-700 prose-p:leading-relaxed">
            
            <h2 id="o-que-e">Afinal, o que é subsídio habitacional?</h2>
            <p className="font-semibold text-lg text-slate-800">
              O subsídio é um desconto financeiro concedido pelo Governo Federal para ajudar famílias de menor renda a comprarem a casa própria. O valor não é um empréstimo: é uma parte do imóvel paga pelo governo que não precisa ser devolvida.
            </p>
            <p>
              Imagine que você encontrou um imóvel no valor de R$ 200.000,00 e conseguiu um subsídio de R$ 30.000,00. Isso significa que o imóvel passará a custar para você R$ 170.000,00. O subsídio atua como um facilitador fundamental no <Link to="/financiamento-minha-casa-minha-vida" className="text-primary hover:underline">financiamento imobiliário</Link>, reduzindo significativamente o valor da entrada que você pagaria.
            </p>

            <h2 id="quem-tem-direito">Quem tem direito ao benefício?</h2>
            <p className="font-semibold text-slate-800">
              Têm direito ao subsídio os cidadãos brasileiros que se enquadram nas faixas de renda 1 e 2 do programa Minha Casa Minha Vida (renda bruta familiar mensal de até R$ 4.400,00) e que não possuem imóveis registrados em seus nomes.
            </p>
            <p>Os principais critérios são:</p>
            <ul>
              <li><strong>Imóveis Próprios:</strong> Você não pode possuir imóvel residencial próprio registrado em seu nome.</li>
              <li><strong>Idade e Nacionalidade:</strong> Ser maior de 18 anos ou emancipado, e brasileiro nato ou naturalizado.</li>
              <li><strong>Programas Habitacionais:</strong> Não ter recebido benefícios de natureza habitacional em outros programas governamentais, como descontos do FGTS concedidos anteriormente.</li>
            </ul>

            <h2 id="valor-do-subsidio">Como o valor do subsídio é calculado?</h2>
            <p className="font-semibold text-slate-800">
              O valor exato não é o mesmo para todo mundo. Ele varia conforme a renda familiar, a localização geográfica do imóvel (cidade) e o valor total do imóvel. Atualmente, o teto do subsídio no MCMV pode chegar a até R$ 55.000,00.
            </p>
            <p>A lógica principal é: <strong>quanto menor a sua renda familiar, maior tende a ser o subsídio oferecido pelo governo</strong>.</p>
            <ul>
              <li><strong>Renda Familiar:</strong> Famílias na Faixa 1 (até R$ 2.850,00) e na Faixa 2 (até R$ 4.400,00) são as contempladas. Para famílias da Faixa 3 (renda até R$ 8.000,00), o programa não oferece subsídio no valor da entrada, mas oferece taxas de juros reduzidas e vantajosas. (<Link to="/renda-minha-casa-minha-vida" className="text-primary hover:underline">Entenda mais sobre a análise de renda</Link>).</li>
              <li><strong>Localização:</strong> Cidades maiores ou com déficit habitacional específico possuem regras de cálculos ajustadas pela Caixa. Você encontra excelentes oportunidades de desconto em imóveis em <Link to="/minha-casa-minha-vida-itaborai" className="text-primary hover:underline">Itaboraí</Link> e em <Link to="/minha-casa-minha-vida-sao-goncalo" className="text-primary hover:underline">São Gonçalo</Link>.</li>
            </ul>

            <h2 id="precisa-devolver">O subsídio precisa ser devolvido ao governo?</h2>
            <p className="font-semibold text-slate-800">
              Não. O subsídio habitacional é caracterizado como um desconto definitivo. Se o financiamento for concluído regularmente e o imóvel for utilizado para moradia própria da família, você jamais precisará devolver o valor ao governo.
            </p>
            <p>
              A única exceção de devolução ocorre em casos onde for comprovada fraude na obtenção do desconto, ocultação de bens prévios ou irregularidade na emissão dos <Link to="/documentos-minha-casa-minha-vida" className="text-primary hover:underline">documentos de aprovação</Link>. Por isso, é essencial ser transparente ao fornecer os dados durante a avaliação.
            </p>

            <h2 id="fgts">Posso juntar Subsídio com o FGTS?</h2>
            <p className="font-semibold text-slate-800">
              Sim! A estratégia mais recomendada e utilizada para a compra de apartamentos e casas pelo programa é a junção do subsídio (desconto do governo) com o <Link to="/fgts-minha-casa-minha-vida" className="text-primary hover:underline">saldo do FGTS</Link>. 
            </p>
            <p>
              Em muitos casos de compra na planta, a junção do FGTS e do Subsídio é o suficiente para cobrir 100% da entrada exigida pela instituição bancária. E quando há necessidade de diferença, as construtoras facilitam o parcelamento.
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
              <strong>Fontes consultadas:</strong> Regras vigentes do programa Minha Casa Minha Vida (Lei nº 14.620/2023) e Ministério das Cidades. *Valores máximos de subsídio e faixas de renda são determinados e regidos exclusivamente pelo Governo Federal, estando sujeitos a atualizações legais. 
            </div>

          </div>
          
          <AuthorProfile />
          
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
