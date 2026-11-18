import { Helmet } from 'react-helmet-async';
import {
  MapPin, Bed, Car, Maximize2, CalendarCheck, Building2,
  Dumbbell, Bike, Waves, Baby, Dog, Briefcase, Flame,
  Truck, Zap, CheckCircle2, ChevronRight, Phone, Star,
  ShoppingCart, PartyPopper,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';

const WHATSAPP_URL =
  'https://wa.me/5521965928399?text=Ol%C3%A1%2C%20Joel!%20Tenho%20interesse%20no%20Mirante%20Boa%20Vista%20em%20S%C3%A3o%20Crist%C3%B3v%C3%A3o...';

/* ── Schema JSON-LD ──────────────────────────────────────────────── */
const schemaJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ApartmentComplex',
      name: 'Mirante Boa Vista',
      description:
        'Lançamento Tenda em São Cristóvão, Rio de Janeiro: 441 apartamentos 1 e 2 quartos com varanda e garden, piscina adulto e infantil, academia, salão de festas gourmet, 450 vagas de bicicletário. Entrada a partir de R$ 499/mês pelo Minha Casa Minha Vida.',
      url: 'https://queromeumcmv.com.br/mirante-boa-vista',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Rua Sabino Vieira, 70',
        addressLocality: 'São Cristóvão',
        addressRegion: 'RJ',
        postalCode: '20910-110',
        addressCountry: 'BR',
      },
      geo: { '@type': 'GeoCoordinates', latitude: -22.8982, longitude: -43.2272 },
      numberOfRooms: '1 a 2',
      floorSize: { '@type': 'QuantitativeValue', minValue: 33.97, maxValue: 36.54, unitCode: 'MTK' },
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Piscina Adulto e Infantil', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Fitness (Academia)', value: true },
        { '@type': 'LocationFeatureSpecification', name: '2 Churrasqueiras Gourmet', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Salão de Festas Gourmet', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Quadra Streetball', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Bicicletário com 450 vagas', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Play Pet', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Brinquedoteca', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Play Kids e Play Baby', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Espaço Office', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Mini Market', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Espaço Delivery', value: true },
      ],
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Construtora', value: 'Tenda' },
        { '@type': 'PropertyValue', name: 'Total de unidades', value: '441' },
        { '@type': 'PropertyValue', name: 'Torres', value: '5' },
        { '@type': 'PropertyValue', name: 'Tipologia', value: 'Térreo + 6 pavimentos' },
        { '@type': 'PropertyValue', name: 'Programa', value: 'Minha Casa Minha Vida' },
        { '@type': 'PropertyValue', name: 'Previsão de entrega', value: 'Setembro/2028' },
        { '@type': 'PropertyValue', name: 'ITBI e Registro', value: 'Grátis' },
        { '@type': 'PropertyValue', name: 'Memorial de Incorporação', value: 'R-55 — Matrícula 55.316 do 3° Registro de Imóveis do Rio de Janeiro/RJ' },
      ],
      priceRange: 'A partir de R$ 295.000',
      broker: { '@id': 'https://queromeumcmv.com.br/#organization' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://queromeumcmv.com.br/' },
        { '@type': 'ListItem', position: 2, name: 'MCMV Rio de Janeiro', item: 'https://queromeumcmv.com.br/minha-casa-minha-vida-sao-goncalo' },
        { '@type': 'ListItem', position: 3, name: 'Mirante Boa Vista', item: 'https://queromeumcmv.com.br/mirante-boa-vista' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Qual o preço do Mirante Boa Vista?',
          acceptedAnswer: { '@type': 'Answer', text: 'Os apartamentos do Mirante Boa Vista começam a partir de R$ 295.000, com entrada parcelada a partir de R$ 499/mês e uso do FGTS como entrada. O ITBI e o registro em cartório são isentos.' },
        },
        {
          '@type': 'Question',
          name: 'O Mirante Boa Vista é pelo Minha Casa Minha Vida?',
          acceptedAnswer: { '@type': 'Answer', text: 'Sim. O Mirante Boa Vista, da Construtora Tenda, é enquadrado no programa Minha Casa Minha Vida, com financiamento pela Caixa Econômica Federal e subsídio de até R$ 55 mil para famílias com renda a partir de R$ 5.500.' },
        },
        {
          '@type': 'Question',
          name: 'Qual é a localização do Mirante Boa Vista?',
          acceptedAnswer: { '@type': 'Answer', text: 'O Mirante Boa Vista está localizado na Rua Sabino Vieira, 70, no bairro São Cristóvão, Rio de Janeiro — a 180 m da Quinta da Boa Vista, 400 m do Bio Parque do Rio, 1,4 km da Estação São Cristóvão do metrô e 2,5 km do Maracanã.' },
        },
        {
          '@type': 'Question',
          name: 'Qual a previsão de entrega do Mirante Boa Vista?',
          acceptedAnswer: { '@type': 'Answer', text: 'A previsão de entrega do Mirante Boa Vista é setembro de 2028. O Memorial de Incorporação está registrado sob R-55 da Matrícula 55.316 do 3° Registro de Imóveis do Rio de Janeiro/RJ.' },
        },
        {
          '@type': 'Question',
          name: 'Quantas unidades e tipos de apartamento tem o Mirante Boa Vista?',
          acceptedAnswer: { '@type': 'Answer', text: 'O Mirante Boa Vista conta com 441 unidades distribuídas em 5 torres (Térreo + 6 pavimentos), sendo 18 apartamentos garden (36,22 a 36,54 m²), 114 com varanda (33,97 a 34,22 m²), 14 adaptadas para PCD e demais plantas tipo.' },
        },
      ],
    },
  ],
};

/* ── Distâncias ───────────────────────────────────────────────────── */
const distancias = [
  { local: 'Largo da Cancela', tempo: '1 min', dist: '80 m', icon: '🏪' },
  { local: 'Quinta da Boa Vista', tempo: '2 min', dist: '180 m', icon: '🌳' },
  { local: 'Bio Parque do Rio', tempo: '6 min', dist: '400 m', icon: '🦁' },
  { local: 'Museu Nacional', tempo: '7 min a pé', dist: '550 m', icon: '🏛️' },
  { local: 'Feira de São Cristóvão', tempo: '14 min a pé', dist: '950 m', icon: '🎵' },
  { local: 'Estação São Cristóvão (metrô)', tempo: '3 min', dist: '1,4 km', icon: '🚇' },
  { local: 'Futuro Estádio do Flamengo', tempo: '4 min', dist: '2,2 km', icon: '⚽' },
  { local: 'Maracanã', tempo: '5 min', dist: '2,5 km', icon: '🏟️' },
];

/* ── FAQs ─────────────────────────────────────────────────────────── */
const faqs = [
  {
    pergunta: 'Qual o preço do Mirante Boa Vista?',
    resposta: 'Os apartamentos do Mirante Boa Vista começam a partir de R$ 295.000, com entrada parcelada a partir de R$ 499/mês e uso do FGTS como entrada. O ITBI e o registro em cartório são isentos.',
  },
  {
    pergunta: 'O Mirante Boa Vista é pelo Minha Casa Minha Vida?',
    resposta: 'Sim. O Mirante Boa Vista, da Construtora Tenda, é enquadrado no programa Minha Casa Minha Vida, com financiamento pela Caixa Econômica Federal e subsídio de até R$ 55 mil para famílias com renda a partir de R$ 5.500.',
  },
  {
    pergunta: 'Qual a localização do Mirante Boa Vista?',
    resposta: 'Rua Sabino Vieira, 70 (acesso principal) e Rua São Luís Gonzaga, 275 — Imperial de São Cristóvão, Rio de Janeiro. A 180 m da Quinta da Boa Vista, 400 m do Bio Parque do Rio e 1,4 km da Estação São Cristóvão do metrô.',
  },
  {
    pergunta: 'Qual a previsão de entrega?',
    resposta: 'A previsão de entrega do Mirante Boa Vista é setembro de 2028. Memorial de Incorporação R-55 — Mat. 55.316 — 3° RI-RJ, datado de 24 de junho de 2026.',
  },
  {
    pergunta: 'Quantas unidades e quais são os tipos de apartamento?',
    resposta: '441 unidades em 5 torres (T+6): 18 garden (36,22–36,54 m²), 114 com varanda (33,97–34,22 m²), 14 adaptadas para PCD. Tipologia: 1 e 2 quartos. Bicicletário com 450 vagas.',
  },
];

/* ═══════════════════════════════════════════════════════════════════ */
export default function MiranteBoacVista() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Header />

      <Helmet>
        <title>Mirante Boa Vista | Apartamentos MCMV São Cristóvão Rio de Janeiro | Tenda</title>
        <meta name="description" content="Lançamento Tenda Mirante Boa Vista em São Cristóvão-RJ: 441 apartamentos 1 e 2 quartos a partir de R$ 295 mil, piscina adulto e infantil, academia, salão gourmet. Entrada R$ 499/mês. ITBI grátis." />
        <link rel="canonical" href="https://queromeumcmv.com.br/mirante-boa-vista" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Mirante Boa Vista | Apartamentos MCMV São Cristóvão Rio de Janeiro | Tenda" />
        <meta property="og:description" content="Lançamento Tenda em São Cristóvão-RJ: 441 aptos 1 e 2 quartos a partir de R$ 295 mil, piscina, academia, salão gourmet. Entrada R$ 499/mês. ITBI grátis." />
        <meta property="og:url" content="https://queromeumcmv.com.br/mirante-boa-vista" />
        <meta property="og:image" content="https://queromeumcmv.com.br/mirante-boa-vista-fachada.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mirante Boa Vista | Tenda | São Cristóvão RJ" />
        <meta name="twitter:description" content="441 apartamentos 1 e 2 quartos a partir de R$ 295 mil com piscina e 14+ itens de lazer no coração do Rio de Janeiro." />
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="São Cristóvão, Rio de Janeiro" />
        <script type="application/ld+json">{JSON.stringify(schemaJsonLd)}</script>
      </Helmet>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/mirante-boa-vista-fachada.webp')" }}
        />
        <div className="absolute inset-0 bg-slate-900/75" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-sm font-medium text-slate-400 mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 flex-wrap">
              <li><a href="/" className="hover:text-white transition-colors">Início</a></li>
              <li className="text-slate-600"><ChevronRight className="w-3.5 h-3.5" /></li>
              <li><a href="/minha-casa-minha-vida-sao-goncalo" className="hover:text-white transition-colors">MCMV Rio de Janeiro</a></li>
              <li className="text-slate-600"><ChevronRight className="w-3.5 h-3.5" /></li>
              <li className="text-slate-200">Mirante Boa Vista</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Coluna esquerda — copy */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-amber-500/90 text-white text-xs font-bold tracking-wide uppercase shadow">
                  🔥 Lançamento • São Cristóvão – RJ
                </span>
                <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-yellow-400/20 border border-yellow-300/40 text-yellow-200 text-xs font-bold tracking-wide uppercase">
                  🏆 Empreendimento do Ano — Tenda
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
                Mirante Boa Vista — Apartamentos 1 e 2 Quartos em São Cristóvão, Rio de Janeiro
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                441 unidades, piscina adulto e infantil, academia, salão gourmet e 450 vagas de bicicletário — com entrada a partir de <strong className="text-white">R$ 499/mês</strong> e ITBI <strong className="text-green-400">grátis</strong>.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: <Bed className="w-4 h-4" />, text: '1 e 2 Quartos' },
                  { icon: <Maximize2 className="w-4 h-4" />, text: '33,97 a 36,54 m²' },
                  { icon: <Building2 className="w-4 h-4" />, text: '441 unidades · 5 torres' },
                  { icon: <CalendarCheck className="w-4 h-4" />, text: 'Entrega Set/2028' },
                ].map((b) => (
                  <div key={b.text} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm font-semibold">{b.icon}{b.text}</div>
                  </div>
                ))}
              </div>

              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition-colors">
                <Phone className="w-5 h-5" />
                Quero saber mais no WhatsApp
              </a>
            </div>

            {/* Coluna direita — formulário */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-primary px-6 py-4 text-white text-center">
                <p className="font-bold text-lg">Receba condições exclusivas</p>
                <p className="text-sm text-blue-100">Preencha e receba a tabela de preços</p>
              </div>
              <div className="p-6">
                <LeadForm utmSource="mirante-boa-vista" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFÍCIOS MCMV ───────────────────────────────────────────── */}
      <section className="py-8 bg-green-50 border-y border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: '💰', titulo: 'Subsídio até R$ 55 mil', desc: 'Renda a partir de R$ 5.500' },
              { emoji: '🏦', titulo: 'ITBI + Registro Grátis', desc: 'Economia de milhares de reais' },
              { emoji: '📋', titulo: 'Entrada R$ 499/mês', desc: 'Parcelada em até 100x' },
              { emoji: '🔑', titulo: 'Use o FGTS', desc: 'Como entrada ou amortização' },
            ].map((b) => (
              <div key={b.titulo} className="bg-white rounded-xl p-4 border border-green-200 text-center">
                <div className="text-2xl mb-1">{b.emoji}</div>
                <p className="font-bold text-slate-900 text-sm">{b.titulo}</p>
                <p className="text-slate-500 text-xs mt-0.5">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALERIA HERO (garden + piscina) ───────────────────────────── */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden shadow-md aspect-video">
              <img
                src="/mirante-boa-vista-garden.webp"
                alt="Apartamento garden com área externa privativa — Mirante Boa Vista São Cristóvão RJ"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md aspect-video">
              <img
                src="/mirante-boa-vista-piscina.webp"
                alt="Piscina adulto com deck e espreguiçadeiras — Mirante Boa Vista São Cristóvão RJ"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 mt-2">Imagens meramente ilustrativas. Composição artística.</p>
        </div>
      </section>

      {/* ── LOCALIZAÇÃO ───────────────────────────────────────────────── */}
      <section className="py-10 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Localização Privilegiada em São Cristóvão</h2>
            <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
              <strong>Rua Sabino Vieira, 70 — Imperial de São Cristóvão</strong>. Entre a memória carioca e o novo Porto Maravilha.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {distancias.map((d) => (
              <div key={d.local} className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-4 hover:border-primary/50 transition-colors">
                <span className="text-2xl">{d.icon}</span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm leading-tight">{d.local}</p>
                  <p className="text-primary font-bold text-sm mt-0.5">{d.tempo}</p>
                  <p className="text-slate-400 text-xs">{d.dist}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-start gap-4">
              <span className="text-3xl">🚊</span>
              <div>
                <p className="font-bold text-slate-900">VLT chegando à região</p>
                <p className="text-slate-600 text-sm mt-1">Novo VLT ampliará a mobilidade de São Cristóvão conectando Porto Maravilha e Centro — diferencial estratégico para valorização futura.</p>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4">
              <span className="text-3xl">⚽</span>
              <div>
                <p className="font-bold text-slate-900">Futuro Estádio do Flamengo a 2,2 km</p>
                <p className="text-slate-600 text-sm mt-1">Novo estádio do Flamengo no Gasômetro — maior vetor de valorização da Zona Portuária carioca nos próximos anos.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LAZER: ÁREAS EXTERNAS ─────────────────────────────────────── */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-2">Lazer Completo Dentro do Condomínio</h2>
          <p className="text-slate-500 text-center mb-8 max-w-xl mx-auto">Tudo entregue equipado e ambientado pela Tenda — sem obras, pronto para usar no dia da chave.</p>

          {/* Áreas Externas */}
          <h3 className="text-base font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
            <span className="text-lg">☀️</span> Áreas Externas
          </h3>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {/* Piscina */}
            <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 group">
              <div className="aspect-video overflow-hidden">
                <img src="/mirante-boa-vista-piscina.webp" alt="Piscina adulto com deck — Mirante Boa Vista" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-3 bg-white">
                <p className="font-bold text-slate-900 text-sm">🏊 Piscina Adulto + Infantil</p>
                <p className="text-slate-500 text-xs mt-0.5">Com deck e espreguiçadeiras para toda a família</p>
              </div>
            </div>
            {/* Churrasqueira */}
            <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 group">
              <div className="aspect-video overflow-hidden">
                <img src="/mirante-boa-vista-churrasqueira.webp" alt="Churrasqueira gourmet — Mirante Boa Vista" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-3 bg-white">
                <p className="font-bold text-slate-900 text-sm">🔥 2 Churrasqueiras Gourmet</p>
                <p className="text-slate-500 text-xs mt-0.5">Para reunir amigos e família nos fins de semana</p>
              </div>
            </div>
            {/* Quadra */}
            <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 group">
              <div className="aspect-video overflow-hidden">
                <img src="/mirante-boa-vista-quadra.webp" alt="Quadra de streetball — Mirante Boa Vista" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-3 bg-white">
                <p className="font-bold text-slate-900 text-sm">🏀 Quadra Streetball</p>
                <p className="text-slate-500 text-xs mt-0.5">Esporte e movimento dentro do condomínio</p>
              </div>
            </div>
            {/* Múltipla Estação */}
            <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 group">
              <div className="aspect-video overflow-hidden">
                <img src="/mirante-boa-vista-multipla-estacao.webp" alt="Múltipla estação outdoor com ducha — Mirante Boa Vista" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-3 bg-white">
                <p className="font-bold text-slate-900 text-sm">🏋️ Múltipla Estação + Ducha</p>
                <p className="text-slate-500 text-xs mt-0.5">Academia ao ar livre com chuveiro externo</p>
              </div>
            </div>
            {/* Pet */}
            <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 group">
              <div className="aspect-video overflow-hidden">
                <img src="/mirante-boa-vista-pet.webp" alt="Play pet — Mirante Boa Vista" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-3 bg-white">
                <p className="font-bold text-slate-900 text-sm">🐾 Play Pet</p>
                <p className="text-slate-500 text-xs mt-0.5">Área cercada e equipada para o seu pet brincar</p>
              </div>
            </div>
            {/* Playground */}
            <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 group">
              <div className="aspect-video overflow-hidden">
                <img src="/mirante-boa-vista-playground.webp" alt="Playground infantil — Mirante Boa Vista" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-3 bg-white">
                <p className="font-bold text-slate-900 text-sm">🎪 Play Kids</p>
                <p className="text-slate-500 text-xs mt-0.5">Playground coberto para crianças maiores</p>
              </div>
            </div>
          </div>

          {/* Áreas Internas */}
          <h3 className="text-base font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
            <span className="text-lg">🏢</span> Áreas Internas — Entregues Equipadas e Ambientadas
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Fitness */}
            <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 group">
              <div className="aspect-video overflow-hidden">
                <img src="/mirante-boa-vista-fitness.webp" alt="Academia fitness — Mirante Boa Vista" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-3 bg-white">
                <p className="font-bold text-slate-900 text-sm">💪 Fitness (Academia Coberta)</p>
                <p className="text-slate-500 text-xs mt-0.5">Equipamentos modernos disponíveis 24h</p>
              </div>
            </div>
            {/* Office */}
            <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 group">
              <div className="aspect-video overflow-hidden">
                <img src="/mirante-boa-vista-office.webp" alt="Espaço office coworking — Mirante Boa Vista" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-3 bg-white">
                <p className="font-bold text-slate-900 text-sm">💼 Espaço Office</p>
                <p className="text-slate-500 text-xs mt-0.5">Co-working no condomínio — trabalhe sem sair de casa</p>
              </div>
            </div>
            {/* Oficina */}
            <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 group">
              <div className="aspect-video overflow-hidden">
                <img src="/mirante-boa-vista-oficina.webp" alt="Oficina com bicicletário — Mirante Boa Vista" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-3 bg-white">
                <p className="font-bold text-slate-900 text-sm">🔧 Oficina + Bicicletário</p>
                <p className="text-slate-500 text-xs mt-0.5">Faça-você-mesmo e 450 vagas para bikes</p>
              </div>
            </div>
            {/* Mini Market */}
            <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 group">
              <div className="aspect-video overflow-hidden">
                <img src="/mirante-boa-vista-mini-market.webp" alt="Mini market no condomínio — Mirante Boa Vista" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-3 bg-white">
                <p className="font-bold text-slate-900 text-sm">🛒 Mini Market</p>
                <p className="text-slate-500 text-xs mt-0.5">Conveniência sem sair do condomínio</p>
              </div>
            </div>
            {/* Brinquedoteca */}
            <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 group">
              <div className="aspect-video overflow-hidden">
                <img src="/mirante-boa-vista-brinquedoteca.webp" alt="Brinquedoteca infantil — Mirante Boa Vista" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-3 bg-white">
                <p className="font-bold text-slate-900 text-sm">🧸 Brinquedoteca</p>
                <p className="text-slate-500 text-xs mt-0.5">Espaço infantil climatizado e seguro</p>
              </div>
            </div>
            {/* Play Baby */}
            <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 group">
              <div className="aspect-video overflow-hidden">
                <img src="/mirante-boa-vista-play-baby.webp" alt="Play baby para bebês — Mirante Boa Vista" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              </div>
              <div className="p-3 bg-white">
                <p className="font-bold text-slate-900 text-sm">👶 Play Baby</p>
                <p className="text-slate-500 text-xs mt-0.5">Espaço dedicado para os menores da família</p>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-4">Imagens meramente ilustrativas. Composição artística.</p>

          {/* Bicicletário destaque */}
          <div className="mt-6 bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-center gap-5">
            <Bike className="w-10 h-10 text-primary shrink-0" />
            <div>
              <p className="font-bold text-slate-900">Bicicletário com 450 vagas — uma por morador</p>
              <p className="text-slate-600 text-sm mt-0.5">Maior investimento em mobilidade sustentável da região. Estacione, pedale, economize.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIPOLOGIAS + FICHA TÉCNICA ──────────────────────────────── */}
      <section className="py-10 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Tipologias */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-5">Plantas Disponíveis</h2>

              {/* Planta com varanda (imagem) */}
              <div className="mb-5 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <img
                  src="/mirante-boa-vista-planta-varanda.webp"
                  alt="Planta 2 quartos com varanda — Mirante Boa Vista São Cristóvão"
                  className="w-full object-contain bg-white"
                  loading="lazy"
                />
                <p className="text-center text-xs text-slate-400 py-2 bg-slate-50">
                  Planta 2 quartos com varanda · 33,97–34,22 m² · Imagem meramente ilustrativa
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    tipo: 'Planta Tipo',
                    area: '33,97 a 34,22 m²',
                    desc: 'Ambientes integrados, banheiro com ventilação natural, paredes lisas e teto texturizado.',
                    preco: 'A partir de R$ 295.000',
                    destaque: false,
                  },
                  {
                    tipo: 'Planta com Varanda',
                    area: '33,97 a 34,22 m²',
                    desc: 'Varanda versátil — home office, cantinho das crianças, refúgio ou espaço para reunir quem você ama.',
                    preco: 'Consulte disponibilidade',
                    destaque: true,
                  },
                  {
                    tipo: 'Planta Garden',
                    area: '36,22 a 36,54 m²',
                    desc: 'Área externa privativa no térreo. Exclusividade e privacidade — apenas 18 unidades disponíveis.',
                    preco: 'Consulte disponibilidade',
                    destaque: false,
                  },
                ].map((t) => (
                  <div key={t.tipo} className={`border rounded-xl p-4 transition-colors ${t.destaque ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/50 bg-white'}`}>
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div>
                        <p className="font-bold text-slate-900">{t.tipo}</p>
                        <p className="text-primary font-semibold text-sm">{t.area}</p>
                      </div>
                      <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">{t.preco}</span>
                    </div>
                    <p className="text-slate-500 text-sm">{t.desc}</p>
                    {t.destaque && (
                      <div className="mt-2 inline-flex items-center gap-1 text-primary text-xs font-bold">
                        <Star className="w-3 h-3 fill-primary" /> Mais vendida
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Garden image */}
              <div className="mt-5 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                <img
                  src="/mirante-boa-vista-garden.webp"
                  alt="Área externa privativa do apartamento garden — Mirante Boa Vista São Cristóvão"
                  className="w-full object-cover max-h-52"
                  loading="lazy"
                />
                <p className="text-center text-xs text-slate-400 py-2 bg-slate-50">
                  Planta Garden · área externa privativa · Imagem meramente ilustrativa
                </p>
              </div>
            </div>

            {/* Ficha Técnica */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-5">Ficha Técnica</h2>
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      ['Empreendimento', 'Mirante Boa Vista'],
                      ['Construtora', 'Tenda'],
                      ['Endereço principal', 'Rua Sabino Vieira, 70 — São Cristóvão, RJ'],
                      ['Acesso suplementar', 'Rua São Luís Gonzaga, 275'],
                      ['CEP', '20910-110'],
                      ['Programa', 'Minha Casa Minha Vida (Faixa 2/3)'],
                      ['Torres', '5 torres'],
                      ['Tipologia', 'Térreo + 6 pavimentos'],
                      ['Total de unidades', '441 (14 PCD · 18 garden · 114 varanda)'],
                      ['Metragem', '33,97 a 36,54 m²'],
                      ['Quartos', '1 e 2 quartos'],
                      ['Preço', 'A partir de R$ 295.000'],
                      ['Entrada', 'A partir de R$ 499/mês'],
                      ['ITBI + Registro', 'Grátis'],
                      ['Bicicletário', '450 vagas'],
                      ['Entrega prevista', 'Setembro/2028'],
                      ['Memorial de Incorporação', 'R-55 — Mat. 55.316 — 3° RI-RJ'],
                    ].map(([chave, valor]) => (
                      <tr key={chave} className="border-b border-slate-100 last:border-0">
                        <td className="py-2 pr-4 font-semibold text-slate-700 text-xs whitespace-nowrap">{chave}</td>
                        <td className="py-2 text-slate-600 text-xs">{valor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Acabamentos */}
              <div className="mt-5 bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <h3 className="font-bold text-slate-900 mb-3">Acabamentos Incluídos</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { emoji: '🚿', titulo: 'Área de serviço e box revestidos' },
                    { emoji: '🪟', titulo: 'Janela na cozinha' },
                    { emoji: '💡', titulo: 'Lâmpadas LED com sensor' },
                    { emoji: '🚰', titulo: 'Louças e metais incluídos' },
                    { emoji: '💧', titulo: 'Água e gás individualizados' },
                    { emoji: '🔒', titulo: 'Portaria com portão duplo' },
                    { emoji: '🌿', titulo: 'Áreas verdes com paisagismo' },
                    { emoji: '📡', titulo: 'Infraestrutura de internet' },
                  ].map((d) => (
                    <div key={d.titulo} className="flex items-center gap-2 text-xs text-slate-700">
                      <span>{d.emoji}</span>
                      <span>{d.titulo}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA WHATSAPP ──────────────────────────────────────────────── */}
      <section className="py-12 bg-slate-800 text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Receba a Tabela de Preços Atualizada</h2>
          <p className="text-slate-300 mb-6">
            Joel Marcos, corretor credenciado CRECI, envia a tabela completa, condições de financiamento e simula suas parcelas sem compromisso.
          </p>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition-colors text-lg">
            <Phone className="w-5 h-5" />
            Falar no WhatsApp agora
          </a>
          <p className="text-slate-400 text-xs mt-3">Atendimento seg–sex 9h–17h · Sem compromisso</p>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="py-10 bg-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-6">Perguntas Frequentes</h2>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.pergunta} className="bg-white p-5 rounded-xl border border-slate-200 group">
                <summary className="font-semibold text-slate-900 cursor-pointer list-none flex justify-between items-center gap-3">
                  {f.pergunta}
                  <ChevronRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <p className="mt-3 text-slate-600 text-sm leading-relaxed">{f.resposta}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── LINKS INTERNOS ────────────────────────────────────────────── */}
      <section className="py-8 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Saiba mais</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: '/minha-casa-minha-vida-sao-goncalo', label: 'MCMV Rio de Janeiro' },
              { href: '/subsidio-mcmv', label: 'Como funciona o subsídio' },
              { href: '/fgts-mcmv', label: 'Usar FGTS na entrada' },
              { href: '/documentos-mcmv', label: 'Documentos necessários' },
              { href: '/financiamento-mcmv', label: 'Simulação de financiamento' },
            ].map((link) => (
              <a key={link.href} href={link.href}
                className="text-sm bg-slate-100 hover:bg-primary hover:text-white text-slate-700 font-medium px-4 py-2 rounded-full border border-slate-200 transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
