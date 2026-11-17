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
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -22.8982,
        longitude: -43.2272,
      },
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
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Os apartamentos do Mirante Boa Vista começam a partir de R$ 295.000, com entrada parcelada a partir de R$ 499/mês e uso do FGTS como entrada. O ITBI e o registro em cartório são isentos.',
          },
        },
        {
          '@type': 'Question',
          name: 'O Mirante Boa Vista é pelo Minha Casa Minha Vida?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sim. O Mirante Boa Vista, da Construtora Tenda, é enquadrado no programa Minha Casa Minha Vida, com financiamento pela Caixa Econômica Federal e subsídio de até R$ 55 mil para famílias com renda a partir de R$ 5.500.',
          },
        },
        {
          '@type': 'Question',
          name: 'Qual é a localização do Mirante Boa Vista?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'O Mirante Boa Vista está localizado na Rua Sabino Vieira, 70, no bairro São Cristóvão (Imperial de São Cristóvão), Rio de Janeiro — a 180 m da Quinta da Boa Vista, 400 m do Bio Parque do Rio, 1,4 km da Estação São Cristóvão do metrô e 2,5 km do Maracanã.',
          },
        },
        {
          '@type': 'Question',
          name: 'Qual a previsão de entrega do Mirante Boa Vista?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A previsão de entrega do Mirante Boa Vista é setembro de 2028. O Memorial de Incorporação está registrado sob R-55 da Matrícula 55.316 do 3° Registro de Imóveis do Rio de Janeiro/RJ.',
          },
        },
        {
          '@type': 'Question',
          name: 'Quantas unidades e tipos de apartamento tem o Mirante Boa Vista?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'O Mirante Boa Vista conta com 441 unidades distribuídas em 5 torres (Térreo + 6 pavimentos), sendo 18 apartamentos garden (36,22 a 36,54 m²), 114 com varanda (33,97 a 34,22 m²), 14 adaptadas para PCD e demais plantas tipo. Todas com 1 ou 2 quartos.',
          },
        },
      ],
    },
  ],
};

/* ── Dados de lazer ───────────────────────────────────────────────── */
const lazereExternos = [
  { icon: <Waves className="w-5 h-5" />, nome: 'Piscina Adulto + Infantil', desc: 'Com deck — para toda a família' },
  { icon: <Building2 className="w-5 h-5" />, nome: 'Quadra Streetball', desc: 'Esporte e movimento no condomínio' },
  { icon: <Flame className="w-5 h-5" />, nome: '2 Churrasqueiras Gourmet', desc: 'Para reunir amigos e família' },
  { icon: <Baby className="w-5 h-5" />, nome: 'Play Kids + Play Baby', desc: 'Diversão para todas as idades' },
  { icon: <Dog className="w-5 h-5" />, nome: 'Play Pet', desc: 'Área dedicada ao seu pet' },
  { icon: <Dumbbell className="w-5 h-5" />, nome: 'Múltipla Estação + Ducha', desc: 'Academia ao ar livre' },
];

const lazereInternos = [
  { icon: <PartyPopper className="w-5 h-5" />, nome: 'Salão de Festas Gourmet', desc: 'Para seus eventos especiais' },
  { icon: <Dumbbell className="w-5 h-5" />, nome: 'Fitness (Academia)', desc: 'Equipamentos modernos cobertos' },
  { icon: <Baby className="w-5 h-5" />, nome: 'Brinquedoteca', desc: 'Espaço infantil climatizado' },
  { icon: <ShoppingCart className="w-5 h-5" />, nome: 'Mini Market', desc: 'Conveniência sem sair do condomínio' },
  { icon: <Truck className="w-5 h-5" />, nome: 'Espaço Delivery', desc: 'Receba suas entregas com segurança' },
  { icon: <Briefcase className="w-5 h-5" />, nome: 'Espaço Office + Oficina', desc: 'Co-working e faça-você-mesmo' },
];

/* ── Distâncias (book oficial) ────────────────────────────────────── */
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

/* ── FAQs ──────────────────────────────────────────────────────────── */
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
    resposta: 'Rua Sabino Vieira, 70 (acesso principal) e Rua São Luís Gonzaga, 275 (acesso suplementar) — Imperial de São Cristóvão, Rio de Janeiro. A 180 m da Quinta da Boa Vista, 400 m do Bio Parque do Rio e 1,4 km da Estação São Cristóvão do metrô.',
  },
  {
    pergunta: 'Qual a previsão de entrega?',
    resposta: 'A previsão de entrega do Mirante Boa Vista é setembro de 2028. O Memorial de Incorporação está registrado sob R-55 da Matrícula 55.316 do 3° Registro de Imóveis do Rio de Janeiro/RJ, datado de 24 de junho de 2026.',
  },
  {
    pergunta: 'Quantas unidades e quais são os tipos de apartamento?',
    resposta: 'O Mirante Boa Vista conta com 441 unidades em 5 torres (T+6): 18 garden (36,22–36,54 m²), 114 com varanda (33,97–34,22 m²), 14 adaptadas para PCD. Tipologia: 1 e 2 quartos. Bicicletário com 450 vagas.',
  },
];

/* ═══════════════════════════════════════════════════════════════════ */
export default function MiranteBoacVista() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Header />

      <Helmet>
        <title>Mirante Boa Vista | Apartamentos MCMV São Cristóvão Rio de Janeiro | Tenda</title>
        <meta
          name="description"
          content="Lançamento Tenda Mirante Boa Vista em São Cristóvão-RJ: 441 apartamentos 1 e 2 quartos a partir de R$ 295 mil, piscina adulto e infantil, academia, salão gourmet. Entrada R$ 499/mês. ITBI grátis."
        />
        <link rel="canonical" href="https://queromeumcmv.com.br/mirante-boa-vista" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Mirante Boa Vista | Apartamentos MCMV São Cristóvão Rio de Janeiro | Tenda" />
        <meta property="og:description" content="Lançamento Tenda em São Cristóvão-RJ: 441 aptos 1 e 2 quartos a partir de R$ 295 mil, piscina, academia, salão gourmet. Entrada R$ 499/mês. ITBI grátis." />
        <meta property="og:url" content="https://queromeumcmv.com.br/mirante-boa-vista" />
        <meta property="og:image" content="https://queromeumcmv.com.br/capa-site-quero-meu-mcmv-open-graph.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mirante Boa Vista | Tenda | São Cristóvão RJ" />
        <meta name="twitter:description" content="441 apartamentos 1 e 2 quartos a partir de R$ 295 mil com piscina e 14+ itens de lazer no coração do Rio de Janeiro." />
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="São Cristóvão, Rio de Janeiro" />
        <script type="application/ld+json">{JSON.stringify(schemaJsonLd)}</script>
      </Helmet>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
        {/* Fachada como background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/mirante-boa-vista-fachada.jpg')" }}
        />
        <div className="absolute inset-0 bg-slate-900/78" />

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
              {/* Awards badge */}
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-amber-500/90 text-white text-xs font-bold tracking-wide uppercase shadow">
                  🔥 Lançamento • São Cristóvão – RJ
                </div>
                <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-yellow-400/20 border border-yellow-300/40 text-yellow-200 text-xs font-bold tracking-wide uppercase shadow">
                  🏆 Empreendimento do Ano — Tenda
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
                Mirante Boa Vista — Apartamentos 1 e 2 Quartos em São Cristóvão, Rio de Janeiro
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                No encontro entre a tradição de São Cristóvão e o novo Porto Maravilha. 441 unidades, piscina adulto e infantil, academia, salão gourmet e 450 vagas de bicicletário — com entrada a partir de <strong className="text-white">R$ 499/mês</strong> e ITBI <strong className="text-green-400">grátis</strong>.
              </p>

              {/* Badges de diferenciais */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: <Bed className="w-4 h-4" />, text: '1 e 2 Quartos' },
                  { icon: <Maximize2 className="w-4 h-4" />, text: '33,97 a 36,54 m²' },
                  { icon: <Building2 className="w-4 h-4" />, text: '441 unidades · 5 torres' },
                  { icon: <CalendarCheck className="w-4 h-4" />, text: 'Entrega Set/2028' },
                ].map((b) => (
                  <div
                    key={b.text}
                    className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3 text-center"
                  >
                    <div className="flex items-center justify-center gap-2 text-sm font-semibold">
                      {b.icon}
                      {b.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA WhatsApp */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition-colors"
              >
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

      {/* ── BENEFÍCIOS MCMV ────────────────────────────────────────────── */}
      <section className="py-10 bg-green-50 border-y border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: '💰', titulo: 'Subsídio até R$ 55 mil', desc: 'Para renda a partir de R$ 5.500' },
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

      {/* ── LOCALIZAÇÃO ───────────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">
              Localização Privilegiada em São Cristóvão
            </h2>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
              <strong>Rua Sabino Vieira, 70 — Imperial de São Cristóvão</strong>. Entre a memória carioca e o futuro urbano do Porto Maravilha — cercado por mobilidade, serviços, lazer e cultura.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {distancias.map((d) => (
              <div
                key={d.local}
                className="flex items-start gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-primary/50 transition-colors"
              >
                <span className="text-2xl">{d.icon}</span>
                <div>
                  <p className="font-semibold text-slate-900 text-sm leading-tight">{d.local}</p>
                  <p className="text-primary font-bold text-sm mt-0.5">{d.tempo}</p>
                  <p className="text-slate-400 text-xs">{d.dist}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Destaque VLT + Estádio Flamengo */}
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-start gap-4">
              <span className="text-3xl">🚊</span>
              <div>
                <p className="font-bold text-slate-900">VLT chegando à região</p>
                <p className="text-slate-600 text-sm mt-1">
                  O novo VLT ampliará a mobilidade de São Cristóvão, conectando ainda mais o bairro ao Porto Maravilha e ao Centro — um diferencial estratégico para quem investe na valorização futura.
                </p>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4">
              <span className="text-3xl">⚽</span>
              <div>
                <p className="font-bold text-slate-900">Futuro Estádio do Flamengo a 2,2 km</p>
                <p className="text-slate-600 text-sm mt-1">
                  O novo estádio do Flamengo no Gasômetro, a 4 minutos do Mirante Boa Vista, promete ser o maior vetor de valorização da Zona Portuária carioca nos próximos anos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LAZER ─────────────────────────────────────────────────────── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900">
              Lazer Completo Dentro do Condomínio
            </h2>
            <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
              Piscina adulto e infantil, academia coberta, salão gourmet e 450 vagas de bicicletário — tudo entregue equipado e ambientado pela Tenda.
            </p>
          </div>

          <div className="grid gap-8">
            {/* Lazer Externo */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">☀️</span>
                Áreas Externas
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {lazereExternos.map((item) => (
                  <div
                    key={item.nome}
                    className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                      {item.icon}
                    </div>
                    <p className="font-bold text-slate-900 text-sm mb-1">{item.nome}</p>
                    <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lazer Interno */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm">🏢</span>
                Áreas Internas — Entregues Equipadas e Ambientadas
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {lazereInternos.map((item) => (
                  <div
                    key={item.nome}
                    className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3">
                      {item.icon}
                    </div>
                    <p className="font-bold text-slate-900 text-sm mb-1">{item.nome}</p>
                    <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Imagem da piscina */}
          <div className="mt-8 rounded-2xl overflow-hidden shadow-lg aspect-video max-h-80">
            <img
              src="/mirante-boa-vista-piscina.jpg"
              alt="Piscina adulto com deck e espreguiçadeiras — Mirante Boa Vista, São Cristóvão RJ"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <p className="text-center text-xs text-slate-400 mt-2">Imagem meramente ilustrativa. Composição artística.</p>

          {/* Bicicletário destaque */}
          <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-5">
            <Bike className="w-10 h-10 text-primary shrink-0" />
            <div>
              <p className="font-bold text-slate-900">Bicicletário com 450 vagas</p>
              <p className="text-slate-600 text-sm mt-0.5">Uma vaga de bicicleta garantida para cada morador — o maior investimento em mobilidade sustentável da região.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIPOLOGIAS + FICHA TÉCNICA ──────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Tipologias */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Plantas Disponíveis</h2>
              <div className="space-y-4">
                {[
                  {
                    tipo: 'Planta Tipo',
                    area: '33,97 a 34,22 m²',
                    desc: 'Versátil e moderna, com ambientes integrados e banheiro com ventilação natural. Paredes com acabamento liso, teto texturizado.',
                    preco: 'A partir de R$ 295.000',
                    destaque: false,
                  },
                  {
                    tipo: 'Planta com Varanda',
                    area: '33,97 a 34,22 m²',
                    desc: 'Varanda versátil — pode virar home office, cantinho das crianças, refúgio para relaxar ou espaço para reunir quem você ama.',
                    preco: 'Consulte disponibilidade',
                    destaque: true,
                  },
                  {
                    tipo: 'Planta Garden',
                    area: '36,22 a 36,54 m²',
                    desc: 'Área externa privativa no térreo com mais espaço para viver do seu jeito. Exclusividade e privacidade — são apenas 18 unidades.',
                    preco: 'Consulte disponibilidade',
                    destaque: false,
                  },
                ].map((t) => (
                  <div
                    key={t.tipo}
                    className={`border rounded-xl p-5 transition-colors ${t.destaque ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/50'}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
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
            </div>

            {/* Ficha Técnica */}
            <div>
              {/* Planta 2 quartos com varanda */}
              <div className="mb-6 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <img
                  src="/mirante-boa-vista-planta-varanda.jpg"
                  alt="Planta 2 quartos com varanda — Mirante Boa Vista São Cristóvão"
                  className="w-full object-contain bg-white"
                  loading="lazy"
                />
                <p className="text-center text-xs text-slate-400 py-2 bg-slate-50">
                  Planta 2 quartos com varanda · 33,97–34,22 m² · Imagem meramente ilustrativa
                </p>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Ficha Técnica</h2>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      ['Empreendimento', 'Mirante Boa Vista'],
                      ['Construtora', 'Tenda'],
                      ['Endereço principal', 'Rua Sabino Vieira, 70 — São Cristóvão, RJ'],
                      ['Acesso suplementar', 'Rua São Luís Gonzaga, 275 — São Cristóvão, RJ'],
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
                      <tr key={chave} className="border-b border-slate-200 last:border-0">
                        <td className="py-2 pr-4 font-semibold text-slate-700 text-xs whitespace-nowrap">{chave}</td>
                        <td className="py-2 text-slate-600 text-xs">{valor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIFERENCIAIS DA UNIDADE ──────────────────────────────────── */}
      <section className="py-14 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            Acabamento Que Você Não Espera no MCMV
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { emoji: '🚿', titulo: 'Área de serviço e box já revestidos', desc: 'Entrega pronta, sem custo extra' },
              { emoji: '🪟', titulo: 'Janela na cozinha', desc: 'Ventilação natural garantida' },
              { emoji: '💡', titulo: 'Lâmpadas LED com sensor', desc: 'Economia nas áreas comuns' },
              { emoji: '🚰', titulo: 'Louças e metais incluídos', desc: 'Pronto para morar de imediato' },
              { emoji: '💧', titulo: 'Água e gás individualizados', desc: 'Pague só o que consumir' },
              { emoji: '🔒', titulo: 'Portaria com portão duplo', desc: 'Dupla segurança no acesso' },
              { emoji: '🌿', titulo: 'Áreas verdes com paisagismo', desc: 'Sustentabilidade e qualidade de vida' },
              { emoji: '📡', titulo: 'Infraestrutura de internet', desc: 'Condomínio preparado para o futuro' },
            ].map((d) => (
              <div key={d.titulo} className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="text-2xl mb-2">{d.emoji}</div>
                <p className="font-bold text-slate-900 text-sm">{d.titulo}</p>
                <p className="text-slate-500 text-xs mt-0.5">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POR QUE COMPRAR ───────────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            3 Razões para Escolher o Mirante Boa Vista
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                titulo: 'O endereço mais estratégico do Rio',
                texto: 'São Cristóvão vive um novo momento: Quinta da Boa Vista e Bio Parque do Rio a metros, Maracanã a 5 minutos, futuro estádio do Flamengo a 4 minutos e VLT chegando. Quem compra agora pega o pico de valorização.',
              },
              {
                titulo: 'Lazer de alto padrão por preço MCMV',
                texto: 'Piscina adulto e infantil, academia coberta, salão de festas gourmet, mini market, espaço office e 450 vagas de bicicletário — tudo entregue equipado. Uma experiência de condomínio premium dentro do bolso do Minha Casa Minha Vida.',
              },
              {
                titulo: 'Tenda: dois prêmios, histórico garantido',
                texto: 'A Construtora Tenda ganhou os prêmios de Empreendimento de Habitação Econômica do Ano e Lançamento Imobiliário do Ano com o Mirante Boa Vista. Empresa de capital aberto, 50+ anos de mercado e histórico comprovado de entregas.',
              },
            ].map((card) => (
              <div key={card.titulo} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <CheckCircle2 className="w-7 h-7 text-primary mb-3" />
                <p className="font-bold text-slate-900 mb-2">{card.titulo}</p>
                <p className="text-slate-600 text-sm leading-relaxed">{card.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA WHATSAPP ──────────────────────────────────────────────── */}
      <section className="py-16 bg-slate-800 text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Receba a Tabela de Preços Atualizada
          </h2>
          <p className="text-slate-300 mb-6">
            Joel Marcos, corretor credenciado CRECI, envia a tabela completa, condições de financiamento e te ajuda a simular parcelas sem compromisso.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition-colors text-lg"
          >
            <Phone className="w-5 h-5" />
            Falar no WhatsApp agora
          </a>
          <p className="text-slate-400 text-xs mt-3">Atendimento seg–sex 9h–17h · Sem compromisso</p>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section className="py-12 bg-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Perguntas Frequentes</h2>
          <div className="space-y-4">
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
      <section className="py-10 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wide mb-5">Saiba mais</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: '/minha-casa-minha-vida-sao-goncalo', label: 'MCMV Rio de Janeiro' },
              { href: '/subsidio-mcmv', label: 'Como funciona o subsídio' },
              { href: '/fgts-mcmv', label: 'Usar FGTS na entrada' },
              { href: '/documentos-mcmv', label: 'Documentos necessários' },
              { href: '/financiamento-mcmv', label: 'Simulação de financiamento' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm bg-slate-100 hover:bg-primary hover:text-white text-slate-700 font-medium px-4 py-2 rounded-full border border-slate-200 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMULÁRIO FINAL ──────────────────────────────────────────── */}
      <section className="py-16 bg-primary text-white" id="contato">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Garantir meu apartamento no Mirante Boa Vista</h2>
          <p className="text-blue-100 mb-8 text-sm">
            Lançamento premiado com alta demanda. Preencha o formulário e receba atendimento prioritário.
          </p>
          <div className="bg-white rounded-2xl p-6 text-left">
            <LeadForm utmSource="mirante-boa-vista-bottom" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
