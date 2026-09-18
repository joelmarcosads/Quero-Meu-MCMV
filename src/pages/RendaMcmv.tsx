import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ArticleMeta from '../components/ArticleMeta';
import AuthorProfile from '../components/AuthorProfile';
import { Link } from 'react-router-dom';

export default function RendaMcmv() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": "Renda Familiar no Minha Casa Minha Vida: Regras e Faixas",
        "description": "Entenda o que é a renda bruta familiar, quais são as faixas do programa Minha Casa Minha Vida e como elas influenciam o seu financiamento habitacional.",
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
            "name": "Renda MCMV",
            "item": "https://queromeumcmv.com.br/renda-minha-casa-minha-vida"
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Renda Familiar e as Faixas do Minha Casa Minha Vida | Quero Meu MCMV</title>
        <meta name="description" content="Saiba como a sua renda bruta impacta a análise de crédito, os juros e o subsídio no Minha Casa Minha Vida. Veja se você pode juntar renda com outra pessoa." />
        <link rel="canonical" href="https://queromeumcmv.com.br/renda-minha-casa-minha-vida" />
        <meta property="og:title" content="Renda Familiar e as Faixas do Minha Casa Minha Vida" />
        <meta property="og:description" content="Saiba como a sua renda bruta impacta a análise de crédito, os juros e o subsídio no Minha Casa Minha Vida. Veja se você pode juntar renda com outra pessoa." />
        <meta property="og:url" content="https://queromeumcmv.com.br/renda-minha-casa-minha-vida" />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      
      <Header />
      
      <main className="flex-grow bg-slate-50 py-12">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
            A Renda no Minha Casa Minha Vida
          </h1>
          
          <ArticleMeta date="20 de Março de 2024" />
          
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:text-slate-700 prose-p:leading-relaxed">
            
            <h2 id="renda-bruta">O que é a Renda Bruta Familiar?</h2>
            <p className="font-semibold text-lg text-slate-800">
              A renda bruta familiar é a soma do salário de todas as pessoas que vão participar do contrato de financiamento, considerando o valor sem os descontos (como INSS ou imposto de renda).
            </p>
            <p>
              É este valor total que a Caixa Econômica Federal e o Governo utilizam para analisar o seu perfil de crédito, determinar a faixa em que você se enquadra no <Link to="/financiamento-minha-casa-minha-vida" className="text-primary hover:underline">programa Minha Casa Minha Vida</Link> e estipular as taxas de juros que você irá pagar. Benefícios sociais, como o Bolsa Família e o auxílio-doença, não entram neste cálculo.
            </p>

            <h2 id="composicao">Posso juntar renda com outra pessoa?</h2>
            <p className="font-semibold text-slate-800">
              Sim! O programa permite a composição de renda. Você pode unir o seu salário com o de seu cônjuge, parceiro, pais, filhos, irmãos ou até amigos, desde que as pessoas não possuam restrições no CPF.
            </p>
            <p>
              Juntar a renda aumenta a capacidade de pagamento familiar aos olhos do banco. Isso costuma aumentar o valor liberado para o empréstimo, facilitando a compra de imóveis em faixas de valor mais atrativas em <Link to="/minha-casa-minha-vida-sao-goncalo" className="text-primary hover:underline">São Gonçalo</Link> e <Link to="/minha-casa-minha-vida-itaborai" className="text-primary hover:underline">Itaboraí</Link>.
            </p>
            <p>
              Contudo, preste atenção: a soma total vai ditar a faixa que você estará. Se a soma das rendas superar o teto de isenções do programa, você poderá ter o <Link to="/subsidio-minha-casa-minha-vida" className="text-primary hover:underline">subsídio reduzido</Link>. A idade do participante mais velho também definirá o prazo máximo do financiamento.
            </p>

            <h2 id="faixas">Quais são as faixas de renda do Minha Casa Minha Vida?</h2>
            <p className="font-semibold text-slate-800">
              Para as áreas urbanas, o programa habitacional organiza as famílias em três faixas principais, baseadas na renda bruta mensal familiar de até R$ 8.000,00.
            </p>
            <ul>
              <li><strong>Faixa 1:</strong> Renda bruta familiar até R$ 2.850,00 mensais. Garante acesso aos maiores valores de subsídio governamental e às taxas de juros mais acessíveis do mercado (a partir de 4% ao ano, a depender da região).</li>
              <li><strong>Faixa 2:</strong> Renda bruta familiar de R$ 2.850,01 até R$ 4.400,00 mensais. Possui taxas de juros atrativas e também possibilita acesso a subsídios governamentais substanciais para a entrada.</li>
              <li><strong>Faixa 3:</strong> Renda bruta familiar de R$ 4.400,01 até R$ 8.000,00 mensais. Embora não conte com subsídios na entrada, esta faixa ainda garante o benefício de acesso a taxas de juros mais baixas que a média das modalidades convencionais dos bancos (podendo chegar a até 8,16% ao ano), sendo ainda extremamente vantajosa.</li>
            </ul>

            <h2 id="autonomos">Sou autônomo ou MEI. Consigo financiar?</h2>
            <p className="font-semibold text-slate-800">
              Sim! Autônomos, empreendedores individuais (MEI) e profissionais liberais têm acesso ao Minha Casa Minha Vida normalmente. O processo de análise requer apenas que você comprove sua movimentação e capacidade financeira.
            </p>
            <p>
              A diferença está apenas na documentação. Em vez de apresentar um contracheque, a análise de crédito é feita cruzando informações do Imposto de Renda, extratos bancários de movimentação recente e pagamentos de contribuições (como o DAS do MEI). <Link to="/documentos-minha-casa-minha-vida" className="text-primary hover:underline">Saiba mais sobre a documentação exigida</Link>.
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 my-10 text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Vamos analisar a sua capacidade de compra?</h3>
              <p className="text-slate-700 mb-6">
                Descubra qual é a sua faixa e as condições liberadas preenchendo algumas informações simples. Faremos a simulação gratuitamente.
              </p>
              <a 
                href="/#simulacao"
                className="inline-block bg-accent hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md transform hover:-translate-y-0.5"
              >
                Analisar meu perfil
              </a>
            </div>

            <div className="mt-12 p-4 bg-slate-50 text-sm text-slate-500 rounded-lg border border-slate-100">
              <strong>Fontes consultadas:</strong> Ministério das Cidades e normas operacionais vigentes da Caixa Econômica Federal. *Os tetos de faixas de renda estão sujeitos a enquadramento de análise bancária, regras vigentes da portaria MCID e legislação em vigor.
            </div>

          </div>
          
          <AuthorProfile />
          
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
