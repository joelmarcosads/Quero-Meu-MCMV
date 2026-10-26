import type { MouseEvent } from 'react';
import { m as motion } from 'motion/react';
import { CheckCircle2, ShieldCheck, ArrowDown } from 'lucide-react';
import LeadForm from './LeadForm';

export default function Hero() {
  const scrollToSimulation = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById('simulacao') || document.getElementById('lead-box');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-slate-900 overflow-hidden text-white" id="simulacao">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 bg-slate-900">
        <picture>
          <source media="(max-width: 600px)" srcSet="/imperio-do-ouro-mrv-mobile.webp" />
          <source media="(min-width: 601px)" srcSet="/imperio-do-ouro-mrv-desktop.webp" />
          <img 
            src="/imperio-do-ouro-mrv-desktop.webp" 
            alt="Perspectiva ilustrativa de apartamento Minha Casa Minha Vida em Itaboraí-RJ" 
            title="Apartamento Minha Casa Minha Vida em Itaboraí-RJ"
            className="w-full h-full object-cover opacity-60"
            fetchPriority="high"
            loading="eager"
            width="1363"
            height="767"
          />
        </picture>
        {/* Gradient that is dark on the left for text, but transparent on the right to show the image */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 sm:via-slate-900/60 to-transparent"></div>
        {/* Subtle bottom gradient for blending */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-[10px] text-white/50 z-20 hidden lg:block">
          Imagem ilustrativa
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Copywriting */}
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-block bg-accent/20 border border-accent/50 text-orange-300 font-semibold px-4 py-1.5 rounded-full text-sm mb-6 mx-auto lg:mx-0">
              Corretor especialista em MCMV em Itaboraí
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Saia do aluguel! Seu apartamento <span className="text-orange-300">Minha Casa Minha Vida</span> em Itaboraí
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-300 font-normal mb-3 leading-relaxed text-justify lg:text-left">
              O seu novo apartamento está mais perto do que você imagina. Descubra as condições do programa <span className="font-bold text-white">Minha Casa Minha Vida</span>.
            </p>

            {/* Linha discreta de atendimento nas 4 cidades */}
            <p className="text-sm sm:text-base text-orange-200/90 font-medium mb-8 text-center lg:text-left">
              📍 Atendimento em Itaboraí, São Gonçalo, Niterói e Maricá
            </p>

            <ul className="space-y-4 mb-6 max-w-md mx-auto lg:mx-0 text-left">
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-success shrink-0 mr-3" />
                <span className="text-base sm:text-lg font-medium">Imóveis com sinal a partir de <strong className="text-white">R$ 500,00</strong> (consulte condições)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-success shrink-0 mr-3" />
                <span className="text-base sm:text-lg font-medium">Possibilidade de entrada facilitada</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-success shrink-0 mr-3" />
                <span className="text-base sm:text-lg font-medium">Parcelas que podem ser <strong className="text-white">menores que o seu aluguel</strong></span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-success shrink-0 mr-3" />
                <span className="text-base sm:text-lg font-medium">Subsídio sujeito à análise de crédito</span>
              </li>
            </ul>

            {/* Botão no celular visível na primeira dobra logo abaixo dos bullets */}
            <div className="block lg:hidden mb-6">
              <a
                href="#simulacao"
                onClick={scrollToSimulation}
                className="w-full inline-flex items-center justify-center gap-2 bg-accent hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-xl text-base shadow-lg shadow-orange-500/30 transition-all"
              >
                <span>Simular grátis</span>
                <ArrowDown className="w-4 h-4" />
              </a>
            </div>

            <div className="text-[10px] text-slate-400 italic mb-6 text-center lg:text-left">*As informações podem sofrer alteração sem prévio aviso. Consulte preço, condições de pagamento e disponibilidade. Cadastre-se para mais informações.</div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center justify-center bg-accent/20 p-2 rounded-full">
                <ShieldCheck className="w-8 h-8 text-orange-300" />
              </div>
              <div className="text-sm text-center sm:text-left">
                <div className="font-bold text-white mb-0.5">Atendimento Transparente</div>
                <div className="text-slate-400">Joel Marcos - Corretor CRECI 39.583F</div>
                <div className="text-xs text-orange-300 font-medium mt-0.5">Especialista em Minha Casa Minha Vida em Itaboraí-RJ</div>
              </div>
            </div>
          </div>

          {/* Right Column - Lead Form */}
          <motion.div 
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-xl mx-auto shadow-2xl rounded-2xl overflow-hidden"
          >
            <LeadForm />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
