import { m as motion } from 'motion/react';
import { MapPin, BedDouble, Car, Shield, Waves } from 'lucide-react';

import { Link } from 'react-router-dom';

const PROPERTIES = [
  {
    id: 1,
    name: "Reserva dos Pássaros 2",
    location: "Itaboraí - RJ",
    image: "/Reserva-dos-passaros-2-card.webp",
    badges: ["MCMV - Caixa", "Sinal de R$ 1.000"],
    features: { bed: 2, car: 1, leisure: true, security: true },
    priceCondition: "Sinal a partir de R$ 1.000 + Subsídio",
    slug: "/reserva-dos-passaros-2"
  },
  {
    id: 2,
    name: "Prime Club Itaboraí",
    location: "Itaboraí - RJ",
    image: "/Capa-do-site-Prime-Club-Itaborai.webp",
    badges: ["MCMV - Caixa", "Sinal de R$ 1.000"],
    features: { bed: 2, car: 1, leisure: true, security: true },
    priceCondition: "Sinal a partir de R$ 1.000 + Subsídio",
    slug: "/prime-club-itaborai"
  },
  {
    id: 7,
    name: "Flores de Maio",
    location: "Santo Expedito, Itaboraí - RJ",
    image: "/fachada flores de maio  .webp",
    badges: ["MCMV - Caixa", "Sinal de R$ 1.000"],
    features: { bed: 2, car: 1, leisure: true, security: true },
    priceCondition: "Sinal a partir de R$ 1.000 + Subsídio",
    slug: "/flores-de-maio"
  },
  {
    id: 3,
    name: "Residencial Florescer",
    location: "Vila Iara, São Gonçalo - RJ",
    image: "/Fachada-Residencial-Florescer.webp",
    badges: ["Lançamento Exclusivo", "Alto Padrão"],
    features: { bed: 3, car: 2, leisure: true, security: true },
    priceCondition: "Condições Exclusivas de Negociação",
    slug: "/residencial-florescer"
  },
  {
    id: 4,
    name: "Solar da Trindade",
    location: "Trindade, São Gonçalo - RJ",
    image: "/Fachada-do-predio-entrada.webp",
    badges: ["MCMV - Caixa", "Sinal de R$ 1.000"],
    features: { bed: 2, car: 1, leisure: true, security: true },
    priceCondition: "Sinal a partir de R$ 1.000 + Subsídio",
    slug: "/solar-da-trindade"
  },
  {
    id: 5,
    name: "Conquista Oceânica",
    location: "Maricá - RJ",
    image: "/FACHADA-CONQUISTA-OCEANICA.webp",
    badges: ["Lançamento", "Minha Casa Minha Vida"],
    features: { bed: "1 e 2", car: 1, leisure: true, security: true },
    priceCondition: "Entrada Facilitada",
    slug: "/conquista-oceanica"
  }
];

export default function Properties() {
  return (
    <section className="py-20 bg-slate-50" id="empreendimentos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Empreendimentos em Destaque em São Gonçalo e Itaboraí
          </h2>
          <p className="text-lg text-slate-600 text-justify md:text-center">
            Conheça as melhores opções do programa Minha Casa Minha Vida na sua região. Compre com facilidade e pare de pagar aluguel hoje.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROPERTIES.map((prop, idx) => (
            <motion.div 
              key={prop.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden group hover:shadow-xl transition-shadow flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={prop.image} 
                  alt={`Fachada do empreendimento ${prop.name} localizado em ${prop.location} - Apartamentos Minha Casa Minha Vida`} 
                  title={`Empreendimento ${prop.name}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex flex-col items-start gap-2">
                  {prop.badges.map(badge => (
                    <span key={badge} className="bg-primary/95 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm self-start text-left">
                      {badge}
                    </span>
                  ))}
                </div>
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-slate-900/80 to-transparent p-4">
                  <h3 className="text-xl font-bold text-white mb-1">{prop.name}</h3>
                  <div className="flex items-center text-slate-200 text-sm">
                    <MapPin className="w-4 h-4 mr-1 text-accent" />
                    {prop.location}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-slate-600 text-sm">
                    <BedDouble className="w-5 h-5 mr-2 text-slate-400" />
                    {prop.features.bed} Quartos
                  </div>
                  <div className="flex items-center text-slate-600 text-sm">
                    {prop.features.car ? (
                      <><Car className="w-5 h-5 mr-2 text-slate-400" /> Com Vaga</>
                    ) : (
                      <><Car className="w-5 h-5 mr-2 text-slate-300" /> Sem Vaga</>
                    )}
                  </div>
                  <div className="flex items-center text-slate-600 text-sm">
                    <Shield className="w-5 h-5 mr-2 text-slate-400" />
                    Cond. Fechado
                  </div>
                  <div className="flex items-center text-slate-600 text-sm">
                    <Waves className="w-5 h-5 mr-2 text-slate-400" />
                    Lazer Completo
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-6 text-center">
                  <p className="text-orange-800 font-bold tracking-tight">
                    {prop.priceCondition}
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {prop.slug ? (
                    <Link to={prop.slug} className="block w-full text-center bg-accent hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md shadow-orange-500/20" aria-label={`Saiba mais sobre ${prop.name}`}>
                      Saiba Mais <span className="sr-only">sobre {prop.name}</span>
                    </Link>
                  ) : (
                    <a href="#simulacao" className="block w-full text-center bg-accent hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md shadow-orange-500/20" aria-label={`Saiba mais sobre ${prop.name}`}>
                      Saiba Mais <span className="sr-only">sobre {prop.name}</span>
                    </a>
                  )}
                  <a 
                    href="#simulacao"
                    className="block w-full text-center bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-3 px-4 rounded-xl transition-colors"
                    aria-label={`Simular financiamento para ${prop.name}`}
                  >
                    Simular <span className="sr-only">financiamento para {prop.name}</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
