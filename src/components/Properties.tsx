import { m as motion } from 'motion/react';
import { MapPin, BedDouble, Car, Shield, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';

const imgReserva = '/fachada-da-casa-reserva-dos-passaros.webp';
const imgPrime = '/capa-do-site-prime-club-itaborai.webp';
const imgFlores = '/fachada-flores-de-maio.webp';
const imgResidencial = '/fachada-residencial-florescer.webp';
const imgSolar = '/fachada-solar-trindade.webp';
const imgConquista = '/fachada-conquista-oceanica.webp';
const imgUnic = '/unic-sao-goncalo-fachada.webp';
const imgVert = '/vert-alcantara-fachada.webp';
const imgMarDeTrindade = '/mar-de-trindade-guarita.webp';
const imgOrlaCentral = '/orla-central-niteroi-fachada.webp';
const imgBosque = '/meu-crescer-niteroi-bosque-vista-do-morro-800.webp';
const imgOrlaGuanabara = '/orla-guanabara-niteroi-vista-aerea-caminho-niemeyer-800.webp';
const imgSunIn = '/sun-in-studio-design-niteroi-piscina-rooftop-800.webp';

type Property = {
  id: number;
  name: string;
  location: string;
  image: string;
  imageAlt?: string;
  badges: string[];
  features: {
    bed: number | string;
    bedText?: string;
    car: number;
    carText?: string;
    leisure: boolean;
    security: boolean;
  };
  priceCondition: string;
  slug: string;
};

const PROPERTIES: Property[] = [
  {
    id: 1,
    name: "Reserva dos Pássaros 2",
    location: "Itaboraí - RJ",
    image: imgReserva,
    imageAlt: "Fachada do empreendimento Reserva dos Pássaros 2 localizado em Itaboraí - RJ - Minha Casa Minha Vida",
    badges: ["MCMV - Caixa", "Condomínio Clube"],
    features: { bed: 2, car: 1, leisure: true, security: true },
    priceCondition: "Parcelas Mensais a Partir de R$ 650,00*",
    slug: "/reserva-dos-passaros-2"
  },
  {
    id: 2,
    name: "Prime Club Itaboraí",
    location: "Itaboraí - RJ",
    image: imgPrime,
    imageAlt: "Fachada do empreendimento Prime Club Itaboraí localizado em Itaboraí - RJ - Minha Casa Minha Vida",
    badges: ["MCMV - Caixa", "Condomínio Clube"],
    features: { bed: 2, car: 1, leisure: true, security: true },
    priceCondition: "Entrada Facilitada em até 72X",
    slug: "/prime-club-itaborai"
  },
  {
    id: 7,
    name: "Flores de Maio",
    location: "Santo Expedito, Itaboraí - RJ",
    image: imgFlores,
    imageAlt: "Fachada do empreendimento Flores de Maio localizado em Santo Expedito, Itaboraí - RJ - Minha Casa Minha Vida",
    badges: ["MCMV - Caixa", "A 5 min. do Centro de Itaboraí"],
    features: { bed: 2, car: 1, leisure: true, security: true },
    priceCondition: "Descubra quanto o subsídio reduz a sua entrada",
    slug: "/flores-de-maio"
  },
  {
    id: 3,
    name: "Residencial Florescer",
    location: "Vila Iara, São Gonçalo - RJ",
    image: imgResidencial,
    imageAlt: "Fachada do lançamento Residencial Florescer, em Vila Iara, São Gonçalo - RJ",
    badges: ["Lançamento Exclusivo", "Alto Padrão"],
    features: { bed: 3, bedText: "2 e 3 Quartos c/ Suíte", car: 2, carText: "1 ou 2 Vagas", leisure: true, security: true },
    priceCondition: "Condições Exclusivas de Negociação",
    slug: "/residencial-florescer"
  },
  {
    id: 4,
    name: "Solar da Trindade",
    location: "Trindade, São Gonçalo - RJ",
    image: imgSolar,
    imageAlt: "Fachada do empreendimento Solar da Trindade localizado em Trindade, São Gonçalo - RJ - Minha Casa Minha Vida",
    badges: ["MCMV - Caixa", "A 300m da Faculdade UNIVERSO"],
    features: { bed: 2, car: 1, leisure: true, security: true },
    priceCondition: "Entrada parcelada em até 100x — simule a sua",
    slug: "/solar-da-trindade"
  },
  {
    id: 5,
    name: "Conquista Oceânica",
    location: "Maricá - RJ",
    image: imgConquista,
    imageAlt: "Fachada do condomínio Conquista Oceânica em Maricá - RJ",
    badges: ["Lançamento", "Minha Casa Minha Vida"],
    features: { bed: "1 e 2", car: 1, leisure: true, security: true },
    priceCondition: "A minutos das praias — veja as condições",
    slug: "/conquista-oceanica"
  },
  {
    id: 6,
    name: "Unic São Gonçalo",
    location: "São Gonçalo - RJ",
    image: imgUnic,
    imageAlt: "Fachada do Unic São Gonçalo — apartamentos 2 quartos com varanda e lazer rooftop perto do Shopping São Gonçalo",
    badges: ["MCMV - Caixa", "30s do Shopping SG"],
    features: { bed: 2, bedText: "2 Quartos c/ Varanda", car: 1, leisure: true, security: true },
    priceCondition: "Consulte Condições Especiais",
    slug: "/unicsaogoncalo"
  },
  {
    id: 10,
    name: "Orla Central",
    location: "Centro, Niterói - RJ",
    image: imgOrlaCentral,
    imageAlt: "Fachada do Orla Central, da Cury, no Centro de Niterói — apartamentos de 1 a 3 quartos com varanda perto do Caminho Niemeyer",
    badges: ["Lançamento Cury", "Centro de Niterói"],
    features: { bed: "1 a 3", bedText: "1 a 3 Quartos c/ Varanda", car: 1, carText: "Vagas limitadas", leisure: true, security: true },
    priceCondition: "A partir de R$ 331 mil* — consulte disponibilidade",
    slug: "/orla-central-niteroi"
  },
  {
    id: 11,
    name: "Bosque Residence",
    location: "Fonseca, Niterói - RJ",
    image: imgBosque,
    imageAlt: "Torres do Bosque Residence cercadas pela mata no Fonseca, Niterói — apartamentos de 2 quartos com 8.000 m² de bosque privativo",
    badges: ["Financiamento Caixa", "8.000 m² de bosque"],
    features: { bed: 2, bedText: "2 Quartos c/ Varanda", car: 1, leisure: true, security: true },
    priceCondition: "A partir de R$ 324 mil* — consulte disponibilidade",
    slug: "/bosque-residence-niteroi"
  },
  {
    id: 12,
    name: "Orla Guanabara",
    location: "Caminho Niemeyer, Niterói - RJ",
    image: imgOrlaGuanabara,
    imageAlt: "Vista aérea do Orla Guanabara, da Emccamp, perto do Caminho Niemeyer em Niterói — 2 quartos com rooftop e vista para a Baía de Guanabara",
    badges: ["Minha Casa Minha Vida", "Vista para a Baía"],
    features: { bed: 2, bedText: "2 Quartos c/ Varanda", car: 0, carText: "Vagas limitadas", leisure: true, security: true },
    priceCondition: "A partir de R$ 299 mil* — consulte disponibilidade",
    slug: "/orla-guanabara-niteroi"
  },
  {
    id: 13,
    name: "Sun In Studio Design",
    location: "Centro, Niterói - RJ",
    image: imgSunIn,
    imageAlt: "Piscina no rooftop do Sun In Studio Design, da RDR Engenharia, no Centro de Niterói — studios perto da UFF e do Plaza Shopping",
    badges: ["Studios", "Financiamento Caixa"],
    features: { bed: 1, bedText: "Studios de 24 a 30 m²", car: 0, carText: "Vagas limitadas", leisure: true, security: true },
    priceCondition: "A partir de R$ 295 mil* — consulte disponibilidade",
    slug: "/sun-in-studio-design-niteroi"
  },
  {
    id: 8,
    name: "Direcional Vert Alcântara",
    location: "Alcântara, São Gonçalo - RJ",
    image: imgVert,
    imageAlt: "Fachada do Direcional Vert Alcântara — apartamentos 2 quartos MCMV em Alcântara, São Gonçalo RJ",
    badges: ["MCMV - Caixa", "Lazer Completo"],
    features: { bed: "1 e 2", bedText: "Studio, 1 e 2 Quartos", car: 1, leisure: true, security: true },
    priceCondition: "+15 itens de lazer — descubra a sua parcela",
    slug: "/vert-alcantara"
  },
  {
    id: 9,
    name: "Residencial Mar de Trindade",
    location: "Alcântara, São Gonçalo - RJ",
    image: imgMarDeTrindade,
    imageAlt: "Fachada do Residencial Mar de Trindade MRV — apartamentos 2 quartos com suíte, varanda e garden em Alcântara, São Gonçalo RJ",
    badges: ["MCMV - Caixa", "Suíte + Varanda + Garden"],
    features: { bed: 2, bedText: "2 Quartos | Suíte | Garden", car: 1, leisure: true, security: true },
    priceCondition: "A partir de R$ 270.990",
    slug: "/apartamentos-mar-de-trindade"
  }
];

type PropertiesProps = {
  filterCity?: string;
};

export default function Properties({ filterCity }: PropertiesProps) {
  return (
    <section className="py-20 bg-slate-50" id="empreendimentos">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {filterCity 
              ? `Empreendimentos em Destaque em ${filterCity}` 
              : "Empreendimentos Minha Casa Minha Vida em Itaboraí e Região"}
          </h2>
          <p className="text-lg text-slate-600 text-justify md:text-center">
            Conheça as melhores opções do programa Minha Casa Minha Vida na sua região. Compre com facilidade e pare de pagar aluguel hoje.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROPERTIES.filter(prop => !filterCity || prop.location.includes(filterCity)).map((prop, idx) => (
            <motion.div 
              key={prop.id}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden group hover:shadow-xl transition-shadow flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <img loading="lazy" decoding="async" width={640} height={427}
                  src={prop.image} 
                  alt={prop.imageAlt || `Fachada do empreendimento ${prop.name} localizado em ${prop.location} - Apartamentos Minha Casa Minha Vida`} 
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
                    <BedDouble className="w-5 h-5 mr-2 text-slate-400 shrink-0" />
                    <span className="leading-tight">{prop.features.bedText || `${prop.features.bed} Quartos`}</span>
                  </div>
                  <div className="flex items-center text-slate-600 text-sm">
                    <Car className={`w-5 h-5 mr-2 ${prop.features.car ? 'text-slate-400' : 'text-slate-300'} shrink-0`} />
                    <span className="leading-tight">
                      {prop.features.carText || (prop.features.car ? "Com Vaga" : "Sem Vaga")}
                    </span>
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
