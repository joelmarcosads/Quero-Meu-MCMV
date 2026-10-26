import { ChevronDown } from 'lucide-react';

const FAQS = [
  { 
    id: 1,
    q: "Posso compor renda com outra pessoa?", 
    a: "Sim! Você pode juntar sua renda com familiares (cônjuge, pais, irmãos, filhos) ou até mesmo com amigos e namorado(a) para alcançar o valor necessário e aumentar suas chances de aprovação no financiamento." 
  },
  { 
    id: 2,
    q: "Sou autônomo e não tenho carteira assinada. Posso participar?", 
    a: "Com certeza! Trabalhadores informais, autônomos e MEIs podem comprar seu imóvel. Você pode comprovar sua renda através de extratos bancários de pessoa física dos últimos 6 meses e também declaração de Imposto de Renda." 
  },
  { 
    id: 3,
    q: "Como funciona o uso do FGTS?", 
    a: "Você pode utilizar o saldo do seu FGTS como parte do pagamento da entrada no imóvel, ajudando a diminuir o valor que você precisa pagar do próprio bolso. Também pode ser usado para abater o valor das parcelas do financiamento." 
  },
  { 
    id: 4,
    q: "O que é o subsídio do governo?", 
    a: "O subsídio é um benefício financeiro (um verdadeiro 'desconto') dado pelo Governo Federal para ajudar na compra. Esse valor não precisa ser devolvido! O montante depende da sua renda familiar e região do imóvel, podendo chegar a até R$ 55.000 de desconto (conforme as regras vigentes do programa)." 
  },
  { 
    id: 5,
    q: "Quanto tempo demora a aprovação do banco?", 
    a: "O tempo de análise costuma ser rápido. Nossos corretores ajudam você a organizar tudo. Com a documentação completa em mãos, a análise do crédito pela Caixa Econômica costuma ter a resposta preliminar em até 48 horas úteis (prazo médio que pode variar conforme a demanda do banco)." 
  }
];

export default function FAQ() {
  return (
    <section className="py-24 bg-white" id="duvidas-frequentes">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Dúvidas Frequentes
          </h2>
          <p className="text-lg text-slate-600 text-justify md:text-center">
            Ainda não tem certeza de como funciona? Separamos as respostas para as principais dúvidas dos nossos clientes.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq) => (
            <details
              key={faq.id}
              className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 transition-colors hover:border-slate-300 group"
            >
              <summary className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer list-none focus:outline-none select-none">
                <span className="font-bold text-slate-900 text-lg pr-4">{faq.q}</span>
                <ChevronDown 
                  className="w-6 h-6 text-primary flex-shrink-0 transition-transform duration-300 group-open:rotate-180" 
                />
              </summary>
              <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">Ainda tem dúvidas?</p>
          <a 
            href="/#simulacao"
            className="inline-flex items-center justify-center text-center bg-success hover:bg-green-700 text-white font-bold py-3 px-4 sm:px-8 text-sm sm:text-base rounded-xl transition-all shadow-lg shadow-green-600/20 w-full sm:w-auto"
          >
            Fale com um Consultor pelo WhatsApp
          </a>
        </div>

      </div>
    </section>
  );
}
