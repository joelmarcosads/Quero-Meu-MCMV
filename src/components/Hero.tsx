import React, { useState } from 'react';
import { m as motion } from 'motion/react';
import { CheckCircle2, TrendingDown, Clock, Home, ShieldCheck } from 'lucide-react';
const imgHeroBg = '/imperio-do-ouro-mrv.webp';

export default function Hero() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission & integration with CRM/WhatsApp
    console.log('Lead Captured:', formData);
    setSubmitted(true);
    // In a real scenario, this would redirect to WhatsApp or a thank you page
    setTimeout(() => {
      alert("Simulação solicitada com sucesso! Um consultor entrará em contato via WhatsApp em breve.");
      setSubmitted(false);
      setFormData({
        nome: '',
        email: '',
        telefone: ''
      });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section className="relative bg-slate-900 overflow-hidden text-white" id="simulacao">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 bg-slate-900">
        <img referrerPolicy="no-referrer" 
          src={imgHeroBg} 
          alt="Perspectiva ilustrativa da varanda do apartamento Império do Ouro - MRV São Gonçalo - RJ" 
          title="Varanda Império do Ouro Minha Casa Minha Vida"
          className="w-full h-full object-cover opacity-60"
        />
        {/* Gradient that is dark on the left for text, but transparent on the right to show the image */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 sm:via-slate-900/60 to-transparent"></div>
        {/* Subtle bottom gradient for blending */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-900 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-[10px] text-white/50 z-20 hidden lg:block">
          Imagem ilustrativa - Fonte: MRV
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Copywriting */}
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-block bg-accent/20 border border-accent/50 text-orange-300 font-semibold px-4 py-1.5 rounded-full text-sm mb-6 mx-auto lg:mx-0">
              Oportunidade Limitada no Rio de Janeiro
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Saia do aluguel! Seu apartamento <span className="text-orange-300">Minha Casa Minha Vida</span> em Itaboraí e São Gonçalo
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-300 font-normal mb-8 leading-relaxed text-justify lg:text-left">
              O seu novo apartamento em Itaboraí ou São Gonçalo está mais perto do que você imagina. Aproveite as novas condições do programa <span className="font-bold text-white">Minha Casa Minha Vida</span>.
            </p>

            <ul className="space-y-4 mb-10 max-w-md mx-auto lg:mx-0 text-left">
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-success shrink-0 mr-3" />
                <span className="text-base sm:text-lg font-medium">Imóveis com sinal a partir de <strong className="text-white">R$ 500,00</strong></span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-success shrink-0 mr-3" />
                <span className="text-base sm:text-lg font-medium">Entrada parcelada em até <strong className="text-white">100 vezes</strong></span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-success shrink-0 mr-3" />
                <span className="text-base sm:text-lg font-medium">Parcelas <strong className="text-white">menores que o seu aluguel</strong> atual</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-success shrink-0 mr-3" />
                <span className="text-base sm:text-lg font-medium">Possibilidade de subsídio e até <strong className="text-white">100% financiado</strong></span>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700 max-w-md mx-auto lg:mx-0">
              <div className="flex -space-x-3">
                <img referrerPolicy="no-referrer" className="w-10 h-10 rounded-full border-2 border-slate-800" src="https://i.pravatar.cc/100?img=1" alt="Foto de um cliente satisfeito Minha Casa Minha Vida" />
                <img referrerPolicy="no-referrer" className="w-10 h-10 rounded-full border-2 border-slate-800" src="https://i.pravatar.cc/100?img=2" alt="Foto de um casal cliente feliz Minha Casa Minha Vida" />
                <img referrerPolicy="no-referrer" className="w-10 h-10 rounded-full border-2 border-slate-800" src="https://i.pravatar.cc/100?img=3" alt="Foto de cliente aprovado em apartamento São Gonçalo" />
              </div>
              <div className="text-sm text-center sm:text-left">
                <div className="font-bold text-white mb-0.5">Mais de 500 famílias</div>
                <div className="text-slate-400">já garantiram suas chaves conosco.</div>
              </div>
            </div>
          </div>

          {/* Right Column - Lead Form */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-accent"></div>
              
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Faça sua Simulação Gratuita</h2>
                <p className="text-slate-600 text-sm">Descubra agora quanto o banco libera para você comprar seu apartamento.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nome" className="block text-sm font-semibold text-slate-700 mb-1">Seu Nome Completo</label>
                  <input 
                    type="text" 
                    id="nome" 
                    name="nome" 
                    required
                    value={formData.nome}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                    placeholder="Ex: João da Silva"
                  />
                </div>
                
                <div>
                  <label htmlFor="telefone" className="block text-sm font-semibold text-slate-700 mb-1">Seu WhatsApp</label>
                  <input 
                    type="tel" 
                    id="telefone" 
                    name="telefone" 
                    required
                    value={formData.telefone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                    placeholder="(21) 99999-9999"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">Seu E-mail (Opcional)</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                    placeholder="joao@email.com"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitted}
                  className="w-full mt-6 bg-success hover:bg-green-700 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-[15px] sm:text-lg shadow-lg shadow-green-600/30 transition-all transform hover:-translate-y-0.5 flex justify-center items-center"
                >
                  {submitted ? 'Enviando...' : 'QUERO FAZER MINHA SIMULAÇÃO'}
                </button>
                <div className="mt-4 flex items-start">
                  <input
                    type="checkbox"
                    id="privacy"
                    required
                    className="mt-0.5 mr-2 h-4 w-4 shrink-0 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="privacy" className="text-[11px] text-slate-500 leading-tight text-left text-justify">
                    Estou de acordo com a política de privacidade e aceito receber contatos (WhatsApp, SMS, e-mail, ligações).
                  </label>
                </div>
                <div className="text-center mt-3 flex items-center justify-center text-xs text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Seus dados estão seguros conosco
                </div>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
