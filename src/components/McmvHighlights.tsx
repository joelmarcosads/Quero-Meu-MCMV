import { m as motion } from 'motion/react';
import { Users, Home, TrendingDown } from 'lucide-react';

const HIGHLIGHTS = [
  {
    icon: <Users className="w-10 h-10 text-white" />,
    title: "Mais famílias",
    desc: "Renda até R$ 13 mil"
  },
  {
    icon: <Home className="w-10 h-10 text-white" />,
    title: "Mais opções",
    desc: "Imóveis até R$ 600 mil"
  },
  {
    icon: <TrendingDown className="w-10 h-10 text-white" />,
    title: "Mais economia",
    desc: "Juros a partir de 4% ao ano"
  }
];

export default function McmvHighlights() {
  return (
    <section className="py-20 bg-primary relative overflow-hidden text-white" id="mcmv-beneficios">
      <div className="absolute inset-0 z-0 opacity-10" aria-hidden="true">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-700 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-700 rounded-full blur-3xl -ml-20 -mb-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
            O Minha Casa Minha Vida está ainda melhor em <span className="text-orange-300 underline decoration-4 underline-offset-4">2026!</span>
          </h2>
          <p className="text-lg text-blue-100 text-justify md:text-center">
            Além da ampliação das faixas, as novas regras trazem outros benefícios incríveis para você.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {HIGHLIGHTS.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center flex flex-col items-center"
            >
              <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-6 border border-white/30">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
              <p className="text-blue-100 font-medium text-lg text-center">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center bg-slate-900/40 rounded-2xl p-8 border border-slate-700/50">
          <p className="text-xl md:text-2xl font-medium leading-relaxed text-justify md:text-center">
            Isso aumenta as oportunidades para conquistar a casa própria. 
            <strong className="text-orange-300 font-bold"> Mais de 2 milhões de famílias </strong> 
            já mudaram de vida com o Minha Casa Minha Vida, agora é sua vez!
          </p>
        </div>

      </div>
    </section>
  );
}
