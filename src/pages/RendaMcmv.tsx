import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import ArticleMeta from '../components/ArticleMeta';
import AuthorProfile from '../components/AuthorProfile';
import { Link } from 'react-router-dom';

export default function RendaMcmv() {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Faixas de Renda do Minha Casa Minha Vida 2026</title>
        <meta name="description" content="Confira as faixas 1, 2, 3 e 4 do MCMV em 2026, o limite de renda e o valor máximo do imóvel em cada uma." />
        <link rel="canonical" href="https://queromeumcmv.com.br/renda-minha-casa-minha-vida" />
        <meta property="og:site_name" content="Quero Meu MCMV" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:title" content="Faixas de Renda do Minha Casa Minha Vida 2026" />
        <meta property="og:description" content="Confira as faixas 1, 2, 3 e 4 do MCMV em 2026, o limite de renda e o valor máximo do imóvel em cada uma." />
        <meta property="og:url" content="https://queromeumcmv.com.br/renda-minha-casa-minha-vida" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://queromeumcmv.com.br/capa-site-quero-meu-mcmv-open-graph.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Faixas de Renda do Minha Casa Minha Vida 2026" />
        <meta name="twitter:description" content="Confira as faixas 1, 2, 3 e 4 do MCMV em 2026, o limite de renda e o valor máximo do imóvel em cada uma." />
        <meta name="twitter:image" content="https://queromeumcmv.com.br/capa-site-quero-meu-mcmv-open-graph.webp" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow bg-slate-50 py-12">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
            A Renda no Minha Casa Minha Vida
          </h1>
          
          <ArticleMeta date="17 de Setembro de 2026" />
          
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
              Para as áreas urbanas, o programa habitacional organiza as famílias em faixas principais, baseadas na renda bruta mensal familiar.
            </p>
            <ul>
              <li><strong>Faixa 1:</strong> Renda familiar bruta mensal de até R$ 3.200,00. Garante acesso aos maiores valores de subsídio governamental e às taxas de juros mais acessíveis do mercado.</li>
              <li><strong>Faixa 2:</strong> Renda familiar bruta mensal de R$ 3.200,01 até R$ 5.000,00. Possui taxas de juros atrativas e também possibilita acesso a subsídios/descontos na linha financiada.</li>
              <li><strong>Faixa 3:</strong> Renda familiar bruta mensal de R$ 5.000,01 até R$ 9.600,00. Embora geralmente não conte com subsídios na entrada para essa faixa, garante o benefício de acesso a taxas de juros mais baixas que a média das modalidades convencionais.</li>
              <li><strong>MCMV Classe Média:</strong> A linha financiada do Minha Casa Minha Vida atende agora famílias com renda familiar de até R$ 13.000,00, observadas as regras e condições da modalidade.</li>
            </ul>

            <h2 id="autonomos">Sou autônomo ou MEI. Consigo financiar?</h2>
            <p className="font-semibold text-slate-800">
              Sim! Autônomos, empreendedores individuais (MEI) e profissionais liberais têm acesso ao Minha Casa Minha Vida normalmente. O processo de análise requer apenas que você comprove sua movimentação e capacidade financeira.
            </p>
            <p>
              A diferença está apenas na documentação. Em vez de apresentar um contracheque, a análise de crédito é feita cruzando informações do Imposto de Renda, extratos bancários de movimentação recente e pagamentos de contribuições (como o DAS do MEI). <Link to="/documentos-minha-casa-minha-vida" className="text-primary hover:underline">Saiba mais sobre a documentação exigida</Link>.
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 sm:p-8 my-10" id="simulacao">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Vamos analisar a sua capacidade de compra?</h3>
                <p className="text-slate-700 max-w-xl mx-auto">
                  Descubra qual é a sua faixa e as condições liberadas preenchendo algumas informações simples. Faremos a simulação gratuitamente.
                </p>
              </div>
              <div className="max-w-xl mx-auto shadow-lg rounded-2xl overflow-hidden">
                <LeadForm />
              </div>
            </div>

            <div className="mt-12 p-4 bg-slate-50 text-sm text-slate-500 rounded-lg border border-slate-100">
              <p className="mb-2"><strong>Nota Editorial:</strong> As regras e condições do Minha Casa Minha Vida podem ser atualizadas. A aprovação do financiamento, subsídio, uso do FGTS e demais condições dependem do enquadramento da família, do imóvel e da análise da instituição financeira.</p>
              <strong>Fontes consultadas:</strong> <a href="https://www.gov.br/cidades/pt-br" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-700">Ministério das Cidades</a> (Portaria MCID nº 333, de 30 de março de 2026) e regras oficiais da linha financiada.
            </div>

          </div>
          
          <AuthorProfile />
          
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
