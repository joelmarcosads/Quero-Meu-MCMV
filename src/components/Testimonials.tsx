import { m as motion } from 'motion/react';
import { Star, Quote, CheckCircle } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: "Ana Beatriz",
    role: "Compradora no Residencial Itaboraí",
    image: "https://i.pravatar.cc/150?img=5",
    content: "Nunca imaginei que conseguiria comprar meu apê com uma renda de R$ 2.400. O processo foi super rápido, dei apenas R$ 500 de sinal e usei meu saldo do FGTS. Hoje pago R$ 680 de prestação, bem menos que meu aluguel antigo!",
    rating: 5
  },
  {
    name: "Carlos Eduardo & Família",
    role: "Moradores em São Gonçalo",
    image: "https://i.pravatar.cc/150?img=11",
    content: "Achei que como motorista de app não conseguiria aprovação. Mandei meus extratos, o banco Caixa aprovou rapidamente. As crianças adoram a área de lazer. Equipe atenciosa demais pelo WhatsApp.",
    rating: 5
  },
  {
    name: "Juliana Santos",
    role: "Compradora Primeiro Imóvel",
    image: "https://i.pravatar.cc/150?img=9",
    content: "Assinei meu contrato na Caixa ontem! Muito obrigada pela paciência dos consultores. Consegui o subsídio máximo do Minha Casa Minha Vida e a entrada ficou muito suave em 60 meses. Recomendo de olhos fechados.",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Quem aprova, indica!
          </h2>
          <p className="text-lg text-slate-600 text-justify md:text-center">
            Veja as histórias de pessoas reais que saíram do aluguel e conquistaram a chave da casa própria através do nosso atendimento.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((test, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-slate-50 rounded-2xl p-8 border border-slate-100 relative text-left"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-slate-200" />
              
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(test.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-slate-700 leading-relaxed mb-8 italic text-justify md:text-left">
                "{test.content}"
              </p>

              <div className="flex items-center">
                <img 
                  src={test.image} 
                  alt={`Foto do cliente ${test.name}, ${test.role}`}
                  title={`${test.name} - Cliente Satisfeito`} 
                  className="w-12 h-12 rounded-full mr-4 border-2 border-white shadow-sm"
                />
                <div>
                  <h3 className="font-bold text-slate-900 flex items-center">
                    {test.name}
                    <CheckCircle className="w-4 h-4 text-blue-500 ml-1" />
                  </h3>
                  <p className="text-sm text-slate-500">{test.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
