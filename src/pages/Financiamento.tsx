import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CheckCircle2, FileText, Home, DollarSign, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Financiamento() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Como Financiar pelo Minha Casa Minha Vida | Subsídio e FGTS</title>
        <meta name="description" content="Entenda como funciona o financiamento Minha Casa Minha Vida. Saiba quem pode participar, como usar o FGTS, conseguir subsídio e os documentos necessários." />
        <link rel="canonical" href="https://queromeumcmv.com.br/financiamento-minha-casa-minha-vida" />
      </Helmet>
      <Header />
      
      <main>
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Financiamento Minha Casa Minha Vida</h1>
            <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
              O guia completo para você entender as taxas de juros, o uso do FGTS e o subsídio oferecido pelo governo. Saiba como realizar o seu sonho em Itaboraí e São Gonçalo.
            </p>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 p-3 rounded-xl mr-4">
                    <DollarSign className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">O que é o Subsídio?</h2>
                </div>
                <p className="text-slate-700 mb-4 leading-relaxed text-justify">
                  O subsídio é um benefício concedido pelo Governo Federal para facilitar a compra do primeiro imóvel. Funciona como um "desconto" no valor total do apartamento ou casa, pago diretamente pelo governo à Caixa Econômica, reduzindo o valor que você precisará financiar.
                </p>
                <p className="text-slate-700 mb-4 leading-relaxed text-justify">
                  O valor do subsídio varia de acordo com a sua renda bruta familiar, a localização do imóvel e a composição familiar. Quanto menor a renda, maior pode ser o subsídio, podendo chegar a até R$ 55 mil na faixa 1 do programa.
                </p>
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-6">
                  <h3 className="font-bold text-lg mb-2">Atenção:</h3>
                  <p className="text-sm text-slate-600">
                    Valores e condições de subsídio podem variar conforme análise de crédito da Caixa, aprovação do empreendimento e regras vigentes do Governo Federal. Consulte-nos para uma simulação personalizada.
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <div className="bg-success/10 p-3 rounded-xl mr-4">
                    <Calculator className="w-8 h-8 text-success" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900">Como usar o FGTS</h2>
                </div>
                <p className="text-slate-700 mb-4 leading-relaxed text-justify">
                  O Fundo de Garantia do Tempo de Serviço (FGTS) é um grande aliado na hora de comprar o seu imóvel. Ele pode ser utilizado de duas formas principais:
                </p>
                <ul className="space-y-4 mb-6">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-success shrink-0 mr-3" />
                    <div>
                      <strong className="block text-slate-900">Abater o valor da entrada</strong>
                      <span className="text-sm text-slate-600">Reduz o montante que você precisa pagar de sinal para a construtora.</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-6 h-6 text-success shrink-0 mr-3" />
                    <div>
                      <strong className="block text-slate-900">Amortizar as parcelas</strong>
                      <span className="text-sm text-slate-600">O saldo pode ser usado a cada 2 anos para diminuir o saldo devedor ou o valor das prestações mensais.</span>
                    </div>
                  </li>
                </ul>
                <p className="text-slate-700 leading-relaxed text-justify">
                  Para usar o FGTS, é necessário ter pelo menos 3 anos de trabalho sob regime do FGTS (consecutivos ou não), não possuir financiamento ativo no SFH e não ser proprietário de imóvel residencial no município onde reside ou trabalha.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center mb-8">
              <FileText className="w-12 h-12 text-primary mb-4" />
              <h2 className="text-3xl font-bold text-slate-900 text-center">Documentos Necessários</h2>
              <p className="text-slate-600 mt-2 text-center">Prepare a documentação para a análise de crédito do Minha Casa Minha Vida.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-4 border-b pb-2">Compradores (CLT)</h3>
                  <ul className="space-y-2 text-slate-700">
                    <li>• RG e CPF (ou CNH)</li>
                    <li>• Certidão de Nascimento ou Casamento</li>
                    <li>• Comprovante de Residência atualizado</li>
                    <li>• 3 últimos contracheques</li>
                    <li>• Carteira de Trabalho (CTPS)</li>
                    <li>• Extrato atualizado do FGTS</li>
                    <li>• Declaração de Imposto de Renda (se declarar)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-4 border-b pb-2">Compradores (Autônomos)</h3>
                  <ul className="space-y-2 text-slate-700">
                    <li>• RG e CPF (ou CNH)</li>
                    <li>• Certidão de Nascimento ou Casamento</li>
                    <li>• Comprovante de Residência atualizado</li>
                    <li>• Extratos bancários dos últimos 6 meses</li>
                    <li>• Declaração de Imposto de Renda (obrigatório)</li>
                    <li>• Pró-labore ou Decore (se aplicável)</li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 text-center">
                <a href="/#simulacao" className="inline-block bg-accent hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg shadow-orange-500/30">
                  Solicitar Análise de Crédito
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
