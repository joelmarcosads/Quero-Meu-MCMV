import React, { useState } from 'react';
import { m as motion, AnimatePresence } from 'motion/react';
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
    a: "O subsídio é um benefício financeiro (um verdadeiro 'desconto') dado pelo Governo Federal para ajudar na compra. Esse valor não precisa ser devolvido! O montante depende da sua renda familiar e região do imóvel, podendo chegar a até R$ 55.000 de desconto." 
  },
  { 
    id: 5,
    q: "Quanto tempo demora a aprovação do banco?", 
    a: "O tempo de análise é rápido. Nossos corretores ajudam você a organizar tudo. Com a documentação completa em mãos, a análise do crédito pela Caixa Econômica costuma ter a resposta preliminar em até 48 horas úteis." 
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Schema Markup for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <section className="py-24 bg-white" id="duvidas-frequentes">
      {/* Search Engine Optimization: Json-LD Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

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
          {FAQS.map((faq, index) => (
            <motion.div 
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 transition-colors hover:border-slate-300"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                aria-expanded={openIndex === index}
              >
                <span className="font-bold text-slate-900 text-lg pr-4">{faq.q}</span>
                <ChevronDown 
                  className={`w-6 h-6 text-primary flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`} 
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
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
