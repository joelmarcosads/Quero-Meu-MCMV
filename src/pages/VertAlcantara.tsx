import { Helmet } from 'react-helmet-async';
import {
  MapPin, Bed, Maximize2, CalendarCheck, Building2,
  Dumbbell, Bike, Waves, Baby, Dog, Briefcase,
  CheckCircle2, ChevronRight, Phone, Star,
  ShoppingCart, Flame, Zap, Car,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';

const WHATSAPP_URL =
  'https://wa.me/5521965928399?text=Ol%C3%A1%2C%20Joel!%20Tenho%20interesse%20no%20Direcional%20Vert%20Alc%C3%A2ntara%20em%20S%C3%A3o%20Gon%C3%A7alo...';

/* ── Schema JSON-LD ──────────────────────────────────────────────── */
const schemaJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ApartmentComplex',
      name: 'Direcional Vert Alcântara',
      description:
        'Lançamento Direcional Vert Alcântara em São Gonçalo, RJ: apartamentos 1 e 2 quartos de 36 a 77 m² com varanda e garden, piscina adulto e infantil, academia, salão de festas gourmet, coworking e lavanderia coletiva. Elegível ao Minha Casa Minha Vida.',
      url: 'https://queromeumcmv.com.br/vert-alcantara',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Estrada dos Menezes, s/n',
        addressLocality: 'Alcântara',
        addressRegion: 'RJ',
        addressCountry: 'BR',
      },
      geo: { '@type': 'GeoCoordinates', latitude: -22.8307, longitude: -43.0735 },
      numberOfRooms: '1 a 2',
      floorSize: { '@type': 'QuantitativeValue', minValue: 36, maxValue: 77, unitCode: 'MTK' },
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Piscina Adulto e Infantil', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Fitness Externo', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Churrasqueiras Gourmet', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Salão de Festas', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Quadra Poliesportiva de Areia', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Coworking (Espaço Office)', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Lavanderia Coletiva', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Mini Market 24h', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Pet Place', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Brinquedoteca e PlayBaby', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Playground Lúdico', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Guarita Blindada 24h', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Espaço Yoga/Pilates', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Espaço Delivery', value: true },
      ],
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Construtora', value: 'Direcional Engenharia' },
        { '@type': 'PropertyValue', name: 'Programa', value: 'Minha Casa Minha Vida' },
        { '@type': 'PropertyValue', name: 'Tipologia', value: 'Studio, 1 e 2 Quartos + Garden' },
        { '@type': 'PropertyValue', name: 'Metragem', value: '36 m² a 77 m²' },
      ],
      broker: { '@id': 'https://queromeumcmv.com.br/#organization' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://queromeumcmv.com.br/' },
        { '@type': 'ListItem', position: 2, name: 'MCMV São Gonçalo', item: 'https://queromeumcmv.com.br/minha-casa-minha-vida-sao-goncalo' },
        { '@type': 'ListItem', position: 3, name: 'Direcional Vert Alcântara', item: 'https://queromeumcmv.com.br/vert-alcantara' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'O que é o Direcional Vert Alcântara?',
          acceptedAnswer: { '@type': 'Answer', text: 'O Direcional Vert Alcântara é um lançamento residencial da Direcional Engenharia em Alcântara, São Gonçalo-RJ. São apartamentos de 36 a 77 m² (studio, 1 e 2 quartos, com varanda e opções garden), com mais de 15 itens de lazer e elegíveis ao Minha Casa Minha Vida.' },
        },
        {
          '@type': 'Question',
          name: 'O Vert Alcântara é pelo Minha Casa Minha Vida?',
          acceptedAnswer: { '@type': 'Answer', text: 'Sim. O Direcional Vert Alcântara é elegível ao programa Minha Casa Minha Vida, com subsídios governamentais, juros reduzidos pela Caixa Econômica Federal, composição de renda em até 3 pessoas e uso do FGTS como entrada ou amortização.' },
        },
        {
          '@type': 'Question',
          name: 'Onde fica o Vert Alcântara?',
          acceptedAnswer: { '@type': 'Answer', text: 'O Direcional Vert Alcântara fica na Estrada dos Menezes, s/n, no bairro Alcântara, São Gonçalo-RJ — ao lado do Atacadão Alcântara, próximo à RJ-104 (saída para Niterói em 15 min) e ao maior hub de transporte coletivo do leste fluminense.' },
        },
        {
          '@type': 'Question',
          name: 'Quais são as tipologias do Vert Alcântara?',
          acceptedAnswer: { '@type': 'Answer', text: 'O Vert Alcântara oferece: Studio/1 Quarto com Varanda (incluindo PcD adaptável), 2 Quartos Tipo Meio com Varanda, 2 Quartos Tipo Ponta e Unidades Garden com quintal privativo. As metragens vão de 36 m² a 77 m².' },
        },
        {
          '@type': 'Question',
          name: 'O Vert Alcântara tem bicicletário?',
          acceptedAnswer: { '@type': 'Answer', text: 'Sim. O condomínio oferece bicicletário como parte de sua infraestrutura de mobilidade sustentável, além de espaço para esportes ao ar livre com fitness externo e quadra poliesportiva de areia.' },
        },
      ],
    },
  ],
};

/* ── Dados ──────────────────────────────────────────────────────── */
const distancias = [
  { local: 'Atacadão Alcântara', tempo: '1 min', dist: 'Ao lado', icon: '🛒' },
  { local: 'Assaí e Carrefour', tempo: '5 min', dist: 'Próximo', icon: '🏬' },
  { local: 'Pátio Alcântara', tempo: '5 min', dist: '2,0 km', icon: '🏢' },
  { local: 'São Gonçalo Shopping', tempo: '8 min', dist: '3,5 km', icon: '🏪' },
  { local: 'Hospital Alberto Torres', tempo: '10 min', dist: '4,0 km', icon: '🏥' },
  { local: 'RJ-104 → Niterói', tempo: '15–20 min', dist: 'Via expressa', icon: '🛣️' },
  { local: 'BR-101 → Ponte Rio-Niterói', tempo: '25 min', dist: 'Via expressa', icon: '🌉' },
  { local: 'Hub de Transporte Coletivo', tempo: 'Na porta', dist: 'Maior hub leste RJ', icon: '🚌' },
];

const lazersExterno = [
  { img: '/vert-alcantara-piscina.webp', alt: 'Piscina adulto com deck e palmeiras — Vert Alcântara São Gonçalo', titulo: '🏊 Piscina Adulto + Infantil', desc: 'Com solarium, deck e palmeiras — resort dentro do condomínio' },
  { img: '/vert-alcantara-churrasqueira.webp', alt: 'Churrasqueira gourmet com jardim — Vert Alcântara', titulo: '🔥 Churrasqueiras Gourmet', desc: 'Área coberta integrada ao jardim para reunir amigos e família' },
  { img: '/vert-alcantara-quadra-areia.webp', alt: 'Quadra de areia beach tennis e futevôlei — Vert Alcântara', titulo: '🏐 Quadra de Areia', desc: 'Beach tennis, futevôlei e futebol de areia — esporte no condomínio' },
  { img: '/vert-alcantara-fitness-externo.webp', alt: 'Fitness externo ao ar livre — Vert Alcântara São Gonçalo', titulo: '🏋️ Fitness Externo', desc: 'Academia ao ar livre com equipamentos profissionais' },
];

const lazersInterno = [
  { img: '/vert-alcantara-salao-festas.webp', alt: 'Salão de festas gourmet — Vert Alcântara', titulo: '🎉 Salão de Festas Gourmet', desc: 'Espaço amplo, mobiliado e integrado à área verde com playground' },
  { img: '/vert-alcantara-coworking.webp', alt: 'Espaço coworking — Vert Alcântara São Gonçalo', titulo: '💼 Coworking Profissional', desc: 'Sala de reunião privativa, estação de trabalho e lounge — trabalhe sem sair de casa' },
  { img: '/vert-alcantara-lavanderia.webp', alt: 'Lavanderia coletiva OMO pay-per-use — Vert Alcântara', titulo: '👕 Lavanderia Coletiva', desc: 'Máquinas industriais OMO pay-per-use — roupa pronta sem sair do condomínio' },
  { img: '/vert-alcantara-guarita.webp', alt: 'Guarita blindada com portão automático — Vert Alcântara', titulo: '🔒 Guarita Blindada 24h', desc: 'Controle automatizado de pedestres e veículos com CFTV completo' },
];

const faqs = [
  {
    pergunta: 'O que é o Direcional Vert Alcântara?',
    resposta: 'O Direcional Vert Alcântara é um lançamento residencial da Direcional Engenharia em Alcântara, São Gonçalo-RJ. São apartamentos de 36 a 77 m² (studio, 1 e 2 quartos, com varanda e opções garden), com mais de 15 itens de lazer e elegíveis ao Minha Casa Minha Vida.',
  },
  {
    pergunta: 'O Vert Alcântara é pelo Minha Casa Minha Vida?',
    resposta: 'Sim. O Direcional Vert Alcântara é elegível ao MCMV, com subsídios governamentais, juros reduzidos pela Caixa Econômica Federal, composição de renda em até 3 pessoas e uso do FGTS como entrada ou amortização.',
  },
  {
    pergunta: 'Onde fica o Vert Alcântara?',
    resposta: 'Na Estrada dos Menezes, s/n — Alcântara, São Gonçalo-RJ. Ao lado do Atacadão Alcântara, próximo à RJ-104 (Niterói em 15 min) e ao maior hub de transporte coletivo do leste fluminense.',
  },
  {
    pergunta: 'Quais são as tipologias do Vert Alcântara?',
    resposta: 'Studio/1 Quarto com Varanda (incluindo PcD), 2 Quartos Tipo Meio com Varanda, 2 Quartos Tipo Ponta e Unidades Garden com quintal privativo. Metragens de 36 a 77 m².',
  },
  {
    pergunta: 'Quais são os diferenciais do Vert Alcântara em relação a outros lançamentos da região?',
    resposta: 'O Vert Alcântara combina: (1) Localização no coração de Alcântara, o 2° maior centro comercial a céu aberto do RJ; (2) Mais de 15 itens de lazer entregues equipados e ambientados; (3) Conceito "resort urbano" com lavanderia coletiva, coworking e mini market 24h — serviços que eliminam deslocamentos extras; (4) Construtora Direcional, top 5 nacional com histórico de entrega no prazo.',
  },
];

/* ═══════════════════════════════════════════════════════════════════ */
export default function VertAlcantara() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Header />

      <Helmet>
        <title>Direcional Vert Alcântara | Apartamentos MCMV São Gonçalo RJ | Lançamento</title>
        <meta name="description" content="Lançamento Direcional Vert Alcântara em Alcântara, São Gonçalo-RJ: apartamentos 1 e 2 quartos de 36 a 77 m², piscina, coworking, lavanderia, salão gourmet e +15 itens de lazer. Elegível ao Minha Casa Minha Vida. Fale com Joel Marcos, CRECI." />
        <link rel="canonical" href="https://queromeumcmv.com.br/vert-alcantara" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Direcional Vert Alcântara | Apartamentos MCMV São Gonçalo RJ" />
        <meta property="og:description" content="Apartamentos 1 e 2 quartos de 36 a 77 m² em Alcântara, São Gonçalo-RJ. Piscina, coworking, lavanderia, +15 itens de lazer. Elegível ao MCMV. Fale com Joel Marcos." />
        <meta property="og:url" content="https://queromeumcmv.com.br/vert-alcantara" />
        <meta property="og:image" content="https://queromeumcmv.com.br/vert-alcantara-fachada.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Direcional Vert Alcântara | MCMV São Gonçalo RJ" />
        <meta name="twitter:description" content="Apartamentos MCMV em Alcântara, São Gonçalo-RJ. Piscina, coworking, lavanderia coletiva e +15 itens de lazer. Fale com Joel Marcos, corretor CRECI." />
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="Alcântara, São Gonçalo, Rio de Janeiro" />
        <script type="application/ld+json">{JSON.stringify(schemaJsonLd)}</script>
      </Helmet>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/vert-alcantara-fachada.webp')" }}
        />
        <div className="absolute inset-0 bg-slate-900/72" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-sm font-medium text-slate-400 mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 flex-wrap">
              <li><a href="/" className="hover:text-white transition-colors">Início</a></li>
              <li className="text-slate-600"><ChevronRight className="w-3.5 h-3.5" /></li>
              <li><a href="/minha-casa-minha-vida-sao-goncalo" className="hover:text-white transition-colors">MCMV São Gonçalo</a></li>
              <li className="text-slate-600"><ChevronRight className="w-3.5 h-3.5" /></li>
              <li className="text-slate-200">Vert Alcântara</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Coluna esquerda — copy */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-amber-500/90 text-white text-xs font-bold tracking-wide uppercase shadow">
                  🔥 Lançamento • Alcântara – São Gonçalo RJ
                </span>
                <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-yellow-400/20 border border-yellow-300/40 text-yellow-200 text-xs font-bold tracking-wide uppercase">
                  🏆 Top 5 Construtoras do Brasil — Direcional
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">
                Direcional Vert Alcântara — Apartamentos MCMV em São Gonçalo com Padrão de Condomínio Clube
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                De 36 a 77 m² com varanda e garden, piscina, coworking, lavanderia coletiva e +15 itens de lazer — ao lado do Atacadão, a <strong className="text-white">15 min de Niterói</strong> pela RJ-104. Elegível ao <strong className="text-green-400">Minha Casa Minha Vida</strong>.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: <Bed className="w-4 h-4" />, text: 'Studio a 2 Quartos' },
                  { icon: <Maximize2 className="w-4 h-4" />, text: '36 m² a 77 m²' },
                  { icon: <MapPin className="w-4 h-4" />, text: 'Alcântara, SG-RJ' },
                  { icon: <Building2 className="w-4 h-4" />, text: 'Direcional Engenharia' },
                ].map((b) => (
                  <div key={b.text} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm font-semibold">{b.icon}{b.text}</div>
                  </div>
                ))}
              </div>

              {/* Prova social */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-4 mb-6">
                <p className="text-sm font-semibold text-yellow-300 mb-2">⭐ Por que confiar na Direcional?</p>
                <ul className="space-y-1 text-sm text-slate-200">
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />Top 5 incorporadoras do Brasil</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />+40 anos entregando no prazo</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />Lazer entregue equipado e ambientado — sem obras extras</li>
                </ul>
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
                <LeadForm utmSource="vert-alcantara" />
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
              { emoji: '💰', titulo: 'Subsídio MCMV', desc: 'Reduz o saldo devedor na entrada' },
              { emoji: '🏦', titulo: 'Juros Reduzidos', desc: 'Caixa Econômica Federal' },
              { emoji: '📋', titulo: 'Composição de Renda', desc: 'Até 3 pessoas na aprovação' },
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

      {/* ── GALERIA DECORADO ─────────────────────────────────────────── */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Apartamento Decorado — Como Fica na Prática</h2>
            <p className="text-slate-500 mt-1 text-sm">Ambientes compactos e funcionais com marcenaria planejada — tudo otimizado para o seu dia a dia</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl overflow-hidden shadow-md aspect-video md:aspect-auto md:row-span-2">
              <img
                src="/vert-alcantara-decorado-living.webp"
                alt="Sala de estar e jantar integrada ao apartamento decorado — Vert Alcântara São Gonçalo"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md aspect-video">
              <img
                src="/vert-alcantara-sala-estar-01.webp"
                alt="Living integrado com cozinha americana e marcenaria planejada — Vert Alcântara"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-md aspect-video">
              <img
                src="/vert-alcantara-sala-estar-02.webp"
                alt="Sala de estar com painel de TV e mesa de jantar — Vert Alcântara"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 mt-2">Imagens do apartamento decorado. Composição artística — pode não representar o acabamento padrão.</p>
        </div>
      </section>

      {/* ── LOCALIZAÇÃO ───────────────────────────────────────────────── */}
      <section className="py-10 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Alcântara: o Coração Comercial de São Gonçalo</h2>
            <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
              <strong>Estrada dos Menezes, s/n — Alcântara, São Gonçalo-RJ</strong>. O 2º maior centro comercial a céu aberto do Rio de Janeiro — tudo a pé da sua porta.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
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

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-start gap-4">
              <span className="text-3xl">🏦</span>
              <div>
                <p className="font-bold text-slate-900">Todos os bancos e cartórios na redondeza</p>
                <p className="text-slate-600 text-sm mt-1">Alcântara reúne agências de todos os principais bancos, cartórios, policlínicas e hospitais — uma cidade dentro do bairro, sem precisar pegar trânsito.</p>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
              <span className="text-3xl">📈</span>
              <div>
                <p className="font-bold text-slate-900">Região em constante valorização</p>
                <p className="text-slate-600 text-sm mt-1">Qualificação viária contínua na Estrada dos Menezes e atração de novas redes comerciais garantem potencial de valorização acima da média regional.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LAZER EXTERNO ────────────────────────────────────────────── */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-2">Resort Urbano no Coração de São Gonçalo</h2>
          <p className="text-slate-500 text-center mb-8 max-w-xl mx-auto">Mais de 15 itens de lazer entregues equipados e ambientados. Sem obras, sem chamadas extras — pronto para usar no dia da chave.</p>

          <h3 className="text-base font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
            <span>☀️</span> Áreas Externas
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {lazersExterno.map((item) => (
              <div key={item.titulo} className="rounded-xl overflow-hidden shadow-sm border border-slate-200 group">
                <div className="aspect-video overflow-hidden">
                  <img src={item.img} alt={item.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-3 bg-white">
                  <p className="font-bold text-slate-900 text-sm">{item.titulo}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-base font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2">
            <span>🏢</span> Áreas Internas — Serviços Integrados
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {lazersInterno.map((item) => (
              <div key={item.titulo} className="rounded-xl overflow-hidden shadow-sm border border-slate-200 group">
                <div className="aspect-video overflow-hidden">
                  <img src={item.img} alt={item.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-3 bg-white">
                  <p className="font-bold text-slate-900 text-sm">{item.titulo}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Outros itens */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { emoji: '🧘', label: 'Yoga / Pilates' },
              { emoji: '🐾', label: 'Pet Place c/ Circuito' },
              { emoji: '🧸', label: 'Brinquedoteca + PlayBaby' },
              { emoji: '🛍️', label: 'Mini Market 24h' },
              { emoji: '🔧', label: 'Oficina Compartilhada' },
              { emoji: '💈', label: 'Espaço Beleza' },
              { emoji: '📦', label: 'Espaço Delivery Seguro' },
              { emoji: '🌿', label: 'Paisagismo e Áreas Verdes' },
            ].map((it) => (
              <div key={it.label} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
                <span className="text-xl block mb-1">{it.emoji}</span>
                <p className="text-xs font-semibold text-slate-700">{it.label}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-slate-400 mt-4">Imagens meramente ilustrativas. Composição artística.</p>
        </div>
      </section>

      {/* ── TIPOLOGIAS ───────────────────────────────────────────────── */}
      <section className="py-10 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-2">Escolha o Apartamento Ideal para Você</h2>
          <p className="text-slate-500 text-center mb-8 max-w-xl mx-auto">Da praticidade do studio à amplitude do garden — cada tipologia pensada para um estilo de vida.</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                tipo: 'Studio / 1 Quarto',
                area: 'A partir de 36 m²',
                icon: '🛏️',
                desc: 'Ideal para solteiros, investidores e quem busca praticidade máxima. Inclui versão adaptada para PcD.',
                publico: 'Solteiros e Investidores',
                destaque: false,
              },
              {
                tipo: '2 Quartos Tipo Meio',
                area: 'A partir de 43 m²',
                icon: '🏠',
                desc: 'Área social integrada à varanda. Otimização de espaço inteligente — casal ou família pequena com conforto.',
                publico: 'Casais e Famílias',
                destaque: true,
              },
              {
                tipo: '2 Quartos Tipo Ponta',
                area: 'A partir de 50 m²',
                icon: '🌬️',
                desc: 'Maior privacidade, ventilação cruzada e iluminação natural superior. Vantagem de posição no andar.',
                publico: 'Quem valoriza qualidade de vida',
                destaque: false,
              },
              {
                tipo: 'Garden',
                area: 'Até 77 m²',
                icon: '🌿',
                desc: 'Quintal privativo estendido no térreo — sensação de casa com a segurança de condomínio fechado. Perfeito para pets e crianças.',
                publico: 'Famílias com pets ou crianças',
                destaque: false,
              },
            ].map((t) => (
              <div key={t.tipo} className={`rounded-2xl border p-5 transition-colors ${t.destaque ? 'border-primary bg-primary/5' : 'border-slate-200 bg-white hover:border-primary/50'}`}>
                <div className="text-3xl mb-3">{t.icon}</div>
                <p className="font-bold text-slate-900 text-lg">{t.tipo}</p>
                <p className="text-primary font-bold text-sm mb-2">{t.area}</p>
                <p className="text-slate-600 text-sm mb-3">{t.desc}</p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  {t.publico}
                </div>
                {t.destaque && (
                  <div className="mt-2 inline-flex items-center gap-1 text-primary text-xs font-bold bg-primary/10 px-2 py-0.5 rounded-full">
                    ⭐ Mais vendida
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl shadow transition-colors">
              <Phone className="w-4 h-4" />
              Ver plantas disponíveis no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── DORES E SOLUÇÕES (neuromarketing) ────────────────────────── */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Por Que o Vert Alcântara Resolve os Problemas de Quem Mora de Aluguel</h2>
          <p className="text-slate-500 text-center mb-8 text-sm max-w-xl mx-auto">Cada detalhe do projeto foi pensado para eliminar as maiores dores de quem vive na região.</p>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              {
                dor: '"O aluguel consome minha renda sem construir patrimônio"',
                solucao: 'Com o MCMV, a parcela do financiamento equivale — ou fica abaixo — do valor de um aluguel na região. Cada pagamento constrói o seu patrimônio.',
                icon: '💸',
                cor: 'border-red-200 bg-red-50',
                corIcon: 'text-red-500',
              },
              {
                dor: '"Meus filhos não têm onde brincar em segurança"',
                solucao: 'Condomínio 100% murado com guarita blindada, playground, brinquedoteca, playbaby e piscina infantil — lazer seguro sem contato com o tráfego da rua.',
                icon: '👶',
                cor: 'border-blue-200 bg-blue-50',
                corIcon: 'text-blue-500',
              },
              {
                dor: '"Perco horas no trânsito para resolver coisas básicas"',
                solucao: 'Mini market 24h, lavanderia, espaço delivery, coworking e transporte coletivo na porta — a maioria das demandas do dia a dia resolve-se dentro ou ao lado do condomínio.',
                icon: '⏳',
                cor: 'border-amber-200 bg-amber-50',
                corIcon: 'text-amber-500',
              },
              {
                dor: '"Não tenho dinheiro para clube ou lazer nos fins de semana"',
                solucao: 'Piscina, churrasco, quadra de areia, salão de festas e academia — tudo já incluído na cota condominial. Resort urbano acessível todo final de semana.',
                icon: '🏊',
                cor: 'border-green-200 bg-green-50',
                corIcon: 'text-green-500',
              },
            ].map((item) => (
              <div key={item.dor} className={`rounded-2xl border p-5 ${item.cor}`}>
                <div className="flex items-start gap-4">
                  <span className={`text-3xl ${item.corIcon}`}>{item.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-700 text-sm italic mb-2">{item.dor}</p>
                    <p className="text-slate-700 text-sm leading-relaxed">{item.solucao}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-12 bg-slate-800 text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Receba a Tabela de Preços e Condições de Financiamento</h2>
          <p className="text-slate-300 mb-6">
            Joel Marcos, corretor credenciado CRECI com 24 anos de mercado imobiliário, envia a tabela completa e simula suas parcelas sem compromisso.
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
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-6">Perguntas Frequentes — Vert Alcântara</h2>
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
          <p className="text-center text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Outros lançamentos e conteúdos úteis</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: '/minha-casa-minha-vida-sao-goncalo', label: 'MCMV São Gonçalo' },
              { href: '/mirante-boa-vista', label: 'Mirante Boa Vista — São Cristóvão' },
              { href: '/subsidio-minha-casa-minha-vida', label: 'Como funciona o subsídio' },
              { href: '/fgts-minha-casa-minha-vida', label: 'Usar FGTS na entrada' },
              { href: '/documentos-minha-casa-minha-vida', label: 'Documentos necessários' },
              { href: '/financiamento-minha-casa-minha-vida', label: 'Simulação de financiamento' },
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
