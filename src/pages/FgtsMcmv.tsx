import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ArticleMeta from '../components/ArticleMeta';
import AuthorProfile from '../components/AuthorProfile';
import { Link } from 'react-router-dom';

export default function FgtsMcmv() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": "Como usar o FGTS no Financiamento Minha Casa Minha Vida",
        "description": "Entenda as regras, requisitos e como o saldo do FGTS pode ajudar na compra do seu imóvel pelo programa Minha Casa Minha Vida.",
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
            "name": "FGTS no Minha Casa Minha Vida",
            "item": "https://queromeumcmv.com.br/fgts-minha-casa-minha-vida"
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Como Usar o FGTS no Minha Casa Minha Vida | Quero Meu MCMV</title>
        <meta name="description" content="Saiba como utilizar o saldo do seu FGTS para comprar um imóvel pelo Minha Casa Minha Vida. Confira as regras e quem tem direito." />
        <link rel="canonical" href="https://queromeumcmv.com.br/fgts-minha-casa-minha-vida" />
        <meta property="og:title" content="Como Usar o FGTS no Minha Casa Minha Vida" />
        <meta property="og:description" content="Saiba como utilizar o saldo do seu FGTS para comprar um imóvel pelo Minha Casa Minha Vida. Confira as regras e quem tem direito." />
        <meta property="og:url" content="https://queromeumcmv.com.br/fgts-minha-casa-minha-vida" />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      
      <Header />
      
      <main className="flex-grow bg-slate-50 py-12">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Como usar o FGTS no Minha Casa Minha Vida
          </h1>
          
          <ArticleMeta date="17 de Setembro de 2026" />
          
          <div className="prose prose-slate max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-p:text-slate-700 prose-p:leading-relaxed">
            
            <h2 id="posso-usar">Posso usar o FGTS no Minha Casa Minha Vida?</h2>
            <p className="font-semibold text-lg text-slate-800">
              Sim, o Fundo de Garantia do Tempo de Serviço (FGTS) pode ser utilizado na compra do seu primeiro imóvel residencial pelo Minha Casa Minha Vida, desde que você atenda aos requisitos do programa e do Conselho Curador do FGTS.
            </p>
            <p>
              O FGTS é um dos maiores aliados de quem deseja sair do aluguel. Ele funciona como uma reserva financeira que pode ser usada para diminuir o valor que você precisa tirar do próprio bolso na hora da compra. Entender as regras é o primeiro passo para o seu <Link to="/financiamento-minha-casa-minha-vida" className="text-primary hover:underline">financiamento pelo Minha Casa Minha Vida</Link>.
            </p>

            <h2 id="para-que-serve">Para que o FGTS pode ser utilizado?</h2>
            <p className="font-semibold text-slate-800">
              O saldo do FGTS pode ser usado de três formas principais no financiamento: como valor de entrada, para amortização do saldo devedor ou para pagamento de parte do valor das parcelas mensais.
            </p>
            <ul>
              <li><strong>Pagamento da Entrada:</strong> O valor que você possui de saldo pode ser abatido do valor da entrada exigida pela instituição financeira. Dependendo das condições da operação e do seu saldo, ele pode reduzir significativamente a necessidade de entrada e até eliminá-la.</li>
              <li><strong>Amortização do Saldo Devedor:</strong> Após a compra, você pode usar o FGTS a cada 2 anos para reduzir o valor total da sua dívida, diminuindo o tempo do financiamento ou o valor das parcelas.</li>
              <li><strong>Pagamento de Parcelas:</strong> É possível utilizar o FGTS para pagar até 80% do valor da parcela mensal, por um período de até 12 meses consecutivos.</li>
            </ul>

            <h2 id="requisitos">Quais os requisitos para usar o FGTS na compra do imóvel?</h2>
            <p className="font-semibold text-slate-800">
              Para usar o FGTS, o comprador não pode possuir outro imóvel na mesma cidade ou em municípios vizinhos, não pode ter um financiamento ativo no Sistema Financeiro de Habitação (SFH) e deve ter pelo menos 3 anos de trabalho sob o regime do FGTS (consecutivos ou não).
            </p>
            <p>Os principais requisitos do comprador são:</p>
            <ul>
              <li>Ter, no mínimo, 3 anos de trabalho com carteira assinada (somando todas as empresas).</li>
              <li>Não ter financiamento ativo no SFH (Sistema Financeiro de Habitação) em nenhuma parte do país.</li>
              <li>Não ser proprietário, possuidor, promitente comprador, usufrutuário ou cessionário de outro imóvel residencial urbano na cidade onde mora ou onde trabalha, nem nos municípios vizinhos.</li>
              <li>Trabalhar ou morar na cidade (ou região metropolitana) onde o imóvel está sendo comprado.</li>
            </ul>
            <p>Se você é de <Link to="/minha-casa-minha-vida-itaborai" className="text-primary hover:underline">Itaboraí</Link> ou <Link to="/minha-casa-minha-vida-sao-goncalo" className="text-primary hover:underline">São Gonçalo</Link>, por exemplo, a regra de localidade se aplica a essas regiões e suas divisas.</p>

            <h2 id="fgts-e-subsidio">Posso usar o FGTS junto com o Subsídio?</h2>
            <p className="font-semibold text-slate-800">
              Sim, é perfeitamente possível combinar o uso do seu FGTS com o subsídio do governo. Ambos os valores são somados para reduzir o custo total do imóvel e facilitar a entrada.
            </p>
            <p>
              Enquanto o FGTS é um dinheiro que já é seu (fruto do seu tempo de trabalho), o <Link to="/subsidio-minha-casa-minha-vida" className="text-primary hover:underline">subsídio</Link> é um desconto dado pelo Governo Federal com base na sua <Link to="/renda-minha-casa-minha-vida" className="text-primary hover:underline">renda familiar</Link>. Somar essas duas vantagens é a estratégia mais utilizada para comprar imóveis novos.
            </p>

            <h2 id="como-consultar">Como consultar meu saldo?</h2>
            <p className="font-semibold text-slate-800">
              Você pode consultar seu saldo facilmente através do aplicativo oficial do FGTS, disponível para Android e iOS, ou nas agências da Caixa.
            </p>
            <p>
              Recomendamos que você verifique o seu extrato no aplicativo antes de iniciar o processo. Lá você consegue ver o valor disponível para o "Saque-Moradia". Isso facilita muito no momento de separar os <Link to="/documentos-minha-casa-minha-vida" className="text-primary hover:underline">documentos para o financiamento</Link> e iniciar a sua simulação de compra.
            </p>
            
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 my-10 text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Quer saber se o seu FGTS cobre a entrada?</h3>
              <p className="text-slate-700 mb-6">
                Faça uma simulação gratuita e descubra o valor da entrada, o subsídio liberado e o valor das parcelas para o seu perfil.
              </p>
              <a 
                href="/#simulacao"
                className="inline-block bg-accent hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md transform hover:-translate-y-0.5"
              >
                Quero fazer uma simulação
              </a>
            </div>

            <div className="mt-12 p-4 bg-slate-50 text-sm text-slate-500 rounded-lg border border-slate-100">
              <p className="mb-2"><strong>Nota Editorial:</strong> As regras e condições do Minha Casa Minha Vida podem ser atualizadas. A aprovação do financiamento, subsídio, uso do FGTS e demais condições dependem do enquadramento da família, do imóvel e da análise da instituição financeira.</p>
              <strong>Fontes consultadas:</strong> Regras oficiais do Conselho Curador do FGTS e da Caixa Econômica Federal.
            </div>

          </div>
          
          <AuthorProfile />
          
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
