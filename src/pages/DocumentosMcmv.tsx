import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ArticleMeta from '../components/ArticleMeta';
import AuthorProfile from '../components/AuthorProfile';
import { Link } from 'react-router-dom';

export default function DocumentosMcmv() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": "Documentos para Financiamento pelo Minha Casa Minha Vida",
        "description": "Lista de documentos necessários para financiar um imóvel. Saiba o que separar, seja você trabalhador CLT, autônomo ou MEI.",
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
            "name": "Documentos MCMV",
            "item": "https://queromeumcmv.com.br/documentos-minha-casa-minha-vida"
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Documentos para Financiamento Minha Casa Minha Vida | Quero Meu MCMV</title>
        <meta name="description" content="Lista completa e atualizada dos documentos exigidos pela Caixa Econômica para a análise e aprovação de crédito imobiliário do Minha Casa Minha Vida." />
        <link rel="canonical" href="https://queromeumcmv.com.br/documentos-minha-casa-minha-vida" />
        <meta property="og:title" content="Documentos para Financiamento Minha Casa Minha Vida" />
        <meta property="og:description" content="Lista completa e atualizada dos documentos exigidos pela Caixa Econômica para a análise e aprovação de crédito imobiliário do Minha Casa Minha Vida." />
        <meta property="og:url" content="https://queromeumcmv.com.br/documentos-minha-casa-minha-vida" />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      
      <Header />
      
      <main className="flex-grow bg-slate-50 py-12">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Documentos necessários para o Financiamento
          </h1>
          
          <ArticleMeta date="17 de Setembro de 2026" />
          
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:text-slate-700 prose-p:leading-relaxed">
            
            <h2 id="documentos-basicos">Quais documentos são exigidos no processo?</h2>
            <p className="font-semibold text-lg text-slate-800">
              O banco exige basicamente a comprovação da sua identidade, estado civil, endereço atualizado, além da demonstração da sua estabilidade financeira e comprovação de renda mensal.
            </p>
            <p>
              Separar a documentação corretamente agiliza a análise e aprovação da sua carta de crédito, evitando frustrações durante o <Link to="/financiamento-minha-casa-minha-vida" className="text-primary hover:underline">processo de financiamento habitacional</Link>. É importante lembrar que, se você for realizar composição de renda com um parceiro ou parente, essa mesma lista de documentos deverá ser apresentada por todas as partes envolvidas no contrato.
            </p>

            <h2 id="lista-clt">Documentação Geral e para quem trabalha de Carteira Assinada (CLT)</h2>
            <p className="font-semibold text-slate-800">
              Se você trabalha sob o regime de carteira assinada, o processo de comprovação é muito simplificado. O principal documento comprobatório exigido pelo banco são os contracheques (holerites) mais recentes emitidos pelo seu empregador.
            </p>
            <ul>
              <li>Documento de Identidade oficial com foto (RG ou CNH).</li>
              <li>CPF (se não estiver incluído no documento de identidade).</li>
              <li>Comprovante de residência emitido nos últimos 60 dias em seu nome (conta de água, luz, internet ou telefone).</li>
              <li>Certidão de Estado Civil (Certidão de Nascimento para solteiros, Certidão de Casamento ou Averbação de Divórcio).</li>
              <li>Carteira de Trabalho física ou digital (cópias/prints das páginas de identificação civil e contratos vigentes).</li>
              <li>Últimos 2 ou 3 contracheques (holerites) referentes ao mês atual e meses anteriores.</li>
              <li>Declaração de Imposto de Renda Pessoa Física (DIRPF) completa com recibo de entrega, caso você tenha sido obrigado a declarar.</li>
            </ul>
            <p>Se você for utilizar o seu <Link to="/fgts-minha-casa-minha-vida" className="text-primary hover:underline">saldo do FGTS para a entrada</Link>, o banco também poderá solicitar o Extrato do FGTS e uma cópia atualizada do seu número do PIS/NIS/PASEP.</p>

            <h2 id="lista-autonomo">Sou Autônomo ou MEI. O que preciso separar?</h2>
            <p className="font-semibold text-slate-800">
              No caso de autônomos ou empreendedores formais (MEI), a <Link to="/renda-minha-casa-minha-vida" className="text-primary hover:underline">comprovação de renda familiar</Link> é feita principalmente por extratos bancários de movimentação contínua e a Declaração de Imposto de Renda do exercício vigente.
            </p>
            <p>Além dos documentos gerais de identidade civil, residência e estado civil listados acima, você precisará providenciar:</p>
            <ul>
              <li><strong>Para o MEI:</strong> Certificado da Condição de Microempreendedor Individual (CCMEI), comprovantes de pagamento das taxas do DAS-MEI (referente aos últimos 6 meses) e Declaração Anual do Simples Nacional (DASN-SIMEI).</li>
              <li><strong>Movimentação Básica:</strong> Extratos originais da sua conta bancária (conta corrente com limites ou cheque especial preferencialmente) comprovando suas movimentações financeiras de entrada durante, pelo menos, os últimos 6 meses consecutivos.</li>
              <li><strong>Imposto de Renda (IRPF):</strong> Declaração Anual do Imposto de Renda Pessoal preenchida com todas as páginas, e acompanhada obrigatoriamente do recibo impresso. A Declaração serve para atestar os lucros auferidos e fortalecer os recebimentos provados no extrato.</li>
            </ul>

            <h2 id="aprovacao">A documentação garante minha aprovação?</h2>
            <p className="font-semibold text-slate-800">
              Não. Entregar toda a documentação solicitada não configura a aprovação automática do seu financiamento imobiliário. Os documentos são submetidos para o sistema da instituição financeira para análise de veracidade e risco.
            </p>
            <p>
              A análise considerará seu <Link to="/subsidio-minha-casa-minha-vida" className="text-primary hover:underline">enquadramento para o recebimento de subsídio</Link>, conferirá restrições cadastrais através de birôs de crédito e validará a capacidade de pagamento familiar e comprometimento da renda. É possível que, durante a avaliação de crédito ou emissão da pasta habitacional, o banco, a assessoria imobiliária ou a Caixa solicitem documentos ou certidões complementares para dar seguimento ao contrato de compra de imóvel em <Link to="/minha-casa-minha-vida-sao-goncalo" className="text-primary hover:underline">São Gonçalo</Link> ou <Link to="/minha-casa-minha-vida-itaborai" className="text-primary hover:underline">Itaboraí</Link>.
            </p>
            
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 my-10 text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Descubra hoje se você pode financiar</h3>
              <p className="text-slate-700 mb-6">
                Realize uma simulação gratuita e deixe que façamos as contas da sua análise preliminar, sem burocracia.
              </p>
              <a 
                href="/#simulacao"
                className="inline-block bg-accent hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md transform hover:-translate-y-0.5"
              >
                Quero saber se posso financiar
              </a>
            </div>

            <div className="mt-12 p-4 bg-slate-50 text-sm text-slate-500 rounded-lg border border-slate-100">
              <p className="mb-2"><strong>Nota Editorial:</strong> As regras e condições do Minha Casa Minha Vida podem ser atualizadas. A aprovação do financiamento, subsídio, uso do FGTS e demais condições dependem do enquadramento da família, do imóvel e da análise da instituição financeira.</p>
              <strong>Fontes consultadas:</strong> Caixa Econômica Federal e normativos do Ministério das Cidades. A relação é informativa e a instituição concedente poderá requisitar documentos extras aplicáveis à operação.
            </div>

          </div>
          
          <AuthorProfile />
          
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
