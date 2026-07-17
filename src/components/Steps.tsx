import { m as motion } from 'motion/react';
import { MessageCircle, FileText, ClipboardCheck, Key } from 'lucide-react';

const STEPS = [
  {
    icon: <MessageCircle className="w-8 h-8 text-primary" />,
    title: "Fale pelo WhatsApp",
    desc: "Encontre o apartamento dos seus sonhos e conte com nosso suporte durante todo o processo. Um de nossos corretores te acompanha desde o envio dos documentos, até a análise dos bancos."
  },
  {
    icon: <FileText className="w-8 h-8 text-primary" />,
    title: "Defina os detalhes",
    desc: "Aproveite todos os benefícios: use seu FGTS, confira seu subsídio, faça composição de renda e garanta as melhores condições para fechar negócio."
  },
  {
    icon: <ClipboardCheck className="w-8 h-8 text-primary" />,
    title: "Aguarde a avaliação",
    desc: "Seu cadastro será analisado pelo banco para confirmar se você atende aos requisitos do programa. Com a aprovação, é só seguir para a assinatura do contrato!"
  },
  {
    icon: <Key className="w-8 h-8 text-primary" />,
    title: "Conquista do apê",
    desc: "Com o contrato assinado com o banco e com a Construtora, é só aguardar a entrega das chaves e curtir o seu novo lar!"
  }
];

export default function Steps() {
  return (
    <section className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Como se inscrever no Minha Casa Minha Vida com as melhores condições
          </h2>
          <p className="text-lg text-slate-600 text-justify md:text-center">
            Cuidamos de tudo para você. Veja como o processo é simples e transparente.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all relative overflow-hidden flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full z-0"></div>
              
              <div className="relative z-10 w-full">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto lg:mx-0">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm text-justify lg:text-left">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
