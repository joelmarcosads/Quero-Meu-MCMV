import { m as motion } from 'motion/react';
import { CheckCircle2, Landmark } from 'lucide-react';

const FAIXAS = [
  { faixa: "FAIXA 1", renda: "até R$ 3.200" },
  { faixa: "FAIXA 2", renda: "até R$ 5.000" },
  { faixa: "FAIXA 3", renda: "até R$ 9.600" },
  { faixa: "FAIXA 4", renda: "até R$ 13.000" },
];

export default function McmvRules() {
  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden" id="sobre-o-programa">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-accent/20 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6 tracking-tight leading-tight">
              Como funciona o Minha Casa Minha Vida com as <span className="text-accent text-transparent bg-clip-text bg-gradient-to-r from-orange-700 to-orange-600">novas regras de 2026?</span>
            </h2>
            
            <p className="text-lg text-slate-300 mb-6 leading-relaxed text-justify lg:text-left">
              O Minha Casa Minha Vida é um programa habitacional do Governo Federal que facilita a conquista do primeiro imóvel, com subsídios de até <strong className="text-white">R$ 55 mil</strong> e taxas reduzidas.
            </p>
            
            <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-6 mb-8 shadow-inner shadow-slate-900/50">
              <p className="text-slate-200 leading-relaxed text-justify lg:text-left">
                Com as <strong className="text-white">novas regras de 2026</strong>, mais famílias podem participar, graças à ampliação das faixas de renda! Sair do aluguel ficou mais fácil, dê o próximo passo e conquiste a sua casa própria.
              </p>
            </div>

            <a 
              href="/#simulacao"
              className="inline-flex items-center justify-center bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-white font-bold py-3 px-8 rounded-xl transition-colors mx-auto lg:mx-0 w-full lg:w-auto"
            >
              Descubra sua Vantagem
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {FAIXAS.map((item, idx) => (
              <div key={idx} className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-slate-500 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Landmark className="w-16 h-16 text-white" />
                </div>
                <div className="flex items-center space-x-2 text-success items-start mb-3">
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                  <span className="font-extrabold text-base tracking-widest uppercase text-white">{item.faixa}</span>
                </div>
                <div className="text-sm text-slate-400 mb-1 font-medium">
                  Renda familiar mensal:
                </div>
                <div className="text-2xl font-black text-white">
                  {item.renda}
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
