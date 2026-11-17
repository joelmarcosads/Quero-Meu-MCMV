import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import {
  MapPin,
  CheckCircle2,
  MessageCircle,
  Clock,
  Car,
  Home,
  Trees,
  Dumbbell,
  Waves,
  Flame,
  Baby,
  Dog,
  PartyPopper,
  Building2,
  Star,
  ShieldCheck,
} from 'lucide-react';

const WHATSAPP_URL =
  'https://wa.me/5521965928399?text=Ol%C3%A1%2C%20Joel!%20Tenho%20interesse%20no%20Unic%20S%C3%A3o%20Gon%C3%A7alo.%20Pode%20me%20enviar%20mais%20informa%C3%A7%C3%B5es%3F';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ApartmentComplex',
      '@id': 'https://queromeumcmv.com.br/unicsaogoncalo#development',
      name: 'Unic São Gonçalo',
      description:
        'Lançamento Domma em São Gonçalo-RJ com 360 apartamentos de 2 quartos, varanda, lazer rooftop e financiamento pelo Minha Casa Minha Vida.',
      url: 'https://queromeumcmv.com.br/unicsaogoncalo',
      image: 'https://queromeumcmv.com.br/capa-site-quero-meu-mcmv-open-graph.webp',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Rua Nova Jersey',
        addressLocality: 'São Gonçalo',
        addressRegion: 'RJ',
        addressCountry: 'BR',
      },
      numberOfRooms: 2,
      floorSize: {
        '@type': 'QuantitativeValue',
        value: 45,
        unitCode: 'MTK',
      },
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Piscina Rooftop', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Academia', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Salão de Festas', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Churrasqueira', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Cinema ao Ar Livre', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Playground', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Pet Place', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Sauna', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Salão de Jogos', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Vaga de Garagem', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Varanda', value: true },
      ],
      numberOfBathroomsTotal: 1,
      petsAllowed: true,
      yearBuilt: 2026,
      broker: {
        '@id': 'https://queromeumcmv.com.br/#organization',
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://queromeumcmv.com.br/' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'MCMV São Gonçalo',
          item: 'https://queromeumcmv.com.br/minha-casa-minha-vida-sao-goncalo',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Unic São Gonçalo',
          item: 'https://queromeumcmv.com.br/unicsaogoncalo',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'O Unic São Gonçalo aceita financiamento pelo Minha Casa Minha Vida?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sim. O Unic São Gonçalo é financiado pela Caixa Econômica Federal dentro do programa Minha Casa Minha Vida (Lei nº 14.620/2023). Dependendo da renda familiar, é possível obter subsídio e taxas de juros reduzidas.',
          },
        },
        {
          '@type': 'Question',
          name: 'Qual é o valor do condomínio no Unic São Gonçalo?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'O condomínio estimado pelo incorporador é de R$ 450,00 por mês, valor competitivo para um condomínio com lazer completo em rooftop.',
          },
        },
        {
          '@type': 'Question',
          name: 'Como é a localização do Unic São Gonçalo?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'O empreendimento fica na Rua Nova Jersey, a apenas 30 segundos do Shopping São Gonçalo. A Ponte Rio-Niterói é alcançada em 11 minutos, o Centro de Niterói em 15 minutos e o Centro do Rio de Janeiro em 29 minutos.',
          },
        },
        {
          '@type': 'Question',
          name: 'Quais as tipologias disponíveis no Unic São Gonçalo?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'O empreendimento oferece apartamentos de 2 quartos a partir de 45 m², com varanda em todas as unidades. Também há opções PNE (acessíveis) e Garden (com área verde privativa no térreo).',
          },
        },
        {
          '@type': 'Question',
          name: 'Posso usar o FGTS na compra de um apartamento no Unic São Gonçalo?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sim. O FGTS pode ser usado como parte da entrada ou para amortizar o saldo devedor do financiamento Caixa, desde que você tenha pelo menos 3 anos de trabalho sob regime do FGTS (podendo somar períodos diferentes).',
          },
        },
      ],
    },
  ],
};

const diferenciais = [
  { icon: <Building2 className="w-6 h-6" />, titulo: '360 Unidades', desc: '2 torres de 15 andares com lazer na cobertura' },
  { icon: <Home className="w-6 h-6" />, titulo: 'A partir de 45 m²', desc: 'Todas as unidades com varanda' },
  { icon: <Car className="w-6 h-6" />, titulo: '155 Vagas', desc: '43% de vagas — acima da média do mercado' },
  { icon: <ShieldCheck className="w-6 h-6" />, titulo: 'Financiamento Caixa', desc: 'MCMV com subsídio e taxas reduzidas' },
];

const lazeres = [
  { icon: <Waves className="w-5 h-5" />, nome: '2 Piscinas (Rooftop)', desc: '1 por torre, com vista panorâmica' },
  { icon: <Dumbbell className="w-5 h-5" />, nome: '2 Academias', desc: 'Equipadas — 1 por torre' },
  { icon: <PartyPopper className="w-5 h-5" />, nome: '3 Salões de Festas', desc: 'Rooftop (50 pessoas), Térreo (70 pessoas) e 1 por torre' },
  { icon: <Flame className="w-5 h-5" />, nome: '4 Churrasqueiras', desc: '1 por torre no rooftop + 2 no térreo' },
  { icon: <Star className="w-5 h-5" />, nome: '2 Cinemas ao Ar Livre', desc: 'Entretenimento para toda a família' },
  { icon: <Trees className="w-5 h-5" />, nome: '2 Saunas', desc: 'Relaxamento e bem-estar' },
  { icon: <Baby className="w-5 h-5" />, nome: 'Playground + Área Kids', desc: 'Diversão garantida para as crianças' },
  { icon: <Dog className="w-5 h-5" />, nome: 'Pet Place', desc: 'Espaço dedicado aos pets da família' },
];

const distancias = [
  { local: 'Shopping São Gonçalo', tempo: '30 seg', icon: '🛍️' },
  { local: 'Ponte Rio-Niterói', tempo: '11 min', icon: '🌉' },
  { local: 'Centro São Gonçalo', tempo: '12 min', icon: '🏙️' },
  { local: 'Centro Niterói', tempo: '15 min', icon: '🏛️' },
  { local: 'Centro Rio de Janeiro', tempo: '29 min', icon: '🏖️' },
  { local: 'Hospital Leste Fluminense', tempo: '6 min', icon: '🏥' },
];

const faqs = [
  {
    pergunta: 'O Unic São Gonçalo aceita financiamento pelo Minha Casa Minha Vida?',
    resposta:
      'Sim. O Unic São Gonçalo é financiado pela Caixa Econômica Federal dentro do programa Minha Casa Minha Vida (Lei nº 14.620/2023). Dependendo da renda familiar, é possível obter subsídio e taxas de juros reduzidas.',
  },
  {
    pergunta: 'Qual é o valor do condomínio no Unic São Gonçalo?',
    resposta:
      'O condomínio estimado pelo incorporador é de R$ 450,00 por mês — valor competitivo para um condomínio com lazer completo em rooftop.',
  },
  {
    pergunta: 'Como é a localização do Unic São Gonçalo?',
    resposta:
      'O empreendimento fica na Rua Nova Jersey, a apenas 30 segundos do Shopping São Gonçalo. A Ponte Rio-Niterói é alcançada em 11 minutos, o Centro de Niterói em 15 minutos e o Centro do Rio de Janeiro em 29 minutos.',
  },
  {
    pergunta: 'Quais as tipologias disponíveis no Unic São Gonçalo?',
    resposta:
      'São apartamentos de 2 quartos a partir de 45 m², com varanda em todas as unidades. Há ainda opções PNE (acessíveis) e Garden (com área verde privativa no térreo).',
  },
  {
    pergunta: 'Posso usar o FGTS na compra de um apartamento no Unic São Gonçalo?',
    resposta:
      'Sim. O FGTS pode ser usado como parte da entrada ou para amortizar o financiamento, desde que você tenha pelo menos 3 anos de trabalho sob regime do FGTS, podendo somar períodos diferentes.',
  },
];

export default function UnicSaoGoncalo() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Unic São Gonçalo | Apartamentos 2 Quartos MCMV | Domma</title>
        <meta
          name="description"
          content="Lançamento Domma em São Gonçalo-RJ: 360 apartamentos de 2 quartos com varanda, piscina rooftop e condomínio de R$ 450. Financiamento Caixa MCMV. Simule já."
        />
        <link rel="canonical" href="https://queromeumcmv.com.br/unicsaogoncalo" />
        <meta property="og:site_name" content="Quero Meu MCMV" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://queromeumcmv.com.br/unicsaogoncalo" />
        <meta property="og:title" content="Unic São Gonçalo | Apartamentos 2 Quartos MCMV | Domma" />
        <meta
          property="og:description"
          content="Lançamento Domma em São Gonçalo-RJ: 360 apartamentos de 2 quartos com varanda, piscina rooftop e condomínio de R$ 450. Financiamento Caixa MCMV."
        />
        <meta property="og:image" content="https://queromeumcmv.com.br/capa-site-quero-meu-mcmv-open-graph.webp" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Unic São Gonçalo | Apartamentos 2 Quartos MCMV | Domma" />
        <meta
          name="twitter:description"
          content="Lançamento Domma em São Gonçalo-RJ: 360 apartamentos de 2 quartos com varanda, piscina rooftop e condomínio de R$ 450. Financiamento Caixa MCMV."
        />
        <meta name="twitter:image" content="https://queromeumcmv.com.br/capa-site-quero-meu-mcmv-open-graph.webp" />
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="São Gonçalo" />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
      </Helmet>

      <Header />

      <main>
        {/* ── HERO + FORMULÁRIO ── */}
        <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
          {/* Fachada como background */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/unic-sao-goncalo-fachada.jpg')" }}
          />
          <div className="absolute inset-0 bg-slate-900/75" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="text-sm font-medium text-slate-400 mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center flex-wrap gap-1">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><span className="mx-1 text-slate-500">&gt;</span></li>
                <li>
                  <Link to="/minha-casa-minha-vida-sao-goncalo" className="hover:text-white transition-colors">
                    MCMV São Gonçalo
                  </Link>
                </li>
                <li><span className="mx-1 text-slate-500">&gt;</span></li>
                <li className="text-orange-300" aria-current="page">Unic São Gonçalo</li>
              </ol>
            </nav>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Conteúdo textual */}
              <div className="lg:col-span-7 space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full bg-accent/90 border border-amber-300/30 text-white text-xs font-bold tracking-wider uppercase shadow-lg">
                  <MapPin className="w-3.5 h-3.5 text-amber-200" />
                  <span>São Gonçalo-RJ • Lançamento Domma • MCMV</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                  Unic São Gonçalo — Apartamentos 2 Quartos com Lazer Rooftop
                </h1>

                <p className="text-lg text-slate-300 leading-relaxed">
                  Viva a 30 segundos do Shopping São Gonçalo em um condomínio clube com piscina e academia no rooftop.
                  360 apartamentos com varanda, financiamento Caixa e condomínio a partir de <strong className="text-white">R$ 450/mês</strong>.
                </p>

                {/* Destaques rápidos */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {diferenciais.map((d) => (
                    <div
                      key={d.titulo}
                      className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3 text-center"
                    >
                      <div className="flex justify-center mb-2 text-accent">{d.icon}</div>
                      <p className="font-bold text-white text-sm leading-snug">{d.titulo}</p>
                      <p className="text-slate-400 text-xs mt-0.5 leading-tight">{d.desc}</p>
                    </div>
                  ))}
                </div>

                {/* CTA WhatsApp */}
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Quero saber o preço e condições</span>
                </a>

                <p className="text-xs text-slate-400">
                  Corretor Joel Marcos · CRECI 39.583F · Atendimento seg–sex 9h–17h
                </p>
              </div>

              {/* Formulário estratégico */}
              <div className="lg:col-span-5" id="simulacao">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <div className="bg-primary px-6 py-4 text-white text-center">
                    <p className="font-extrabold text-lg">Receba Condições Exclusivas</p>
                    <p className="text-primary-foreground/80 text-sm">
                      Simulação gratuita pelo WhatsApp
                    </p>
                  </div>
                  <LeadForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── LOCALIZAÇÃO ── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900">
                Localização Privilegiada em São Gonçalo
              </h2>
              <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
                Na Rua Nova Jersey, o Unic São Gonçalo coloca você no coração do maior município do interior
                fluminense, com acesso rápido a Niterói e ao Rio de Janeiro.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {distancias.map((item) => (
                <div
                  key={item.local}
                  className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-primary/50 transition-colors"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{item.local}</p>
                    <p className="text-primary font-bold flex items-center gap-1 text-sm">
                      <Clock className="w-3.5 h-3.5" />
                      {item.tempo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LAZER COMPLETO ── */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900">
                Lazer Humanizado no Rooftop de Cada Torre
              </h2>
              <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
                Dois rooftops completos com piscina, academia e salão de festas com vista panorâmica —
                um para cada torre, com área de lazer compartilhada no térreo.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {lazeres.map((item) => (
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

            {/* Galeria de imagens do lazer */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { src: '/unic-sao-goncalo-churrasco-rooftop.png', alt: 'Churrasco no Rooftop — Unic São Gonçalo', label: 'Rooftop' },
                { src: '/unic-sao-goncalo-academia.jpg', alt: 'Academia equipada — Unic São Gonçalo', label: 'Academia' },
                { src: '/unic-sao-goncalo-cinema.jpg', alt: 'Cinema ao ar livre — Unic São Gonçalo', label: 'Cinema Rooftop' },
                { src: '/unic-sao-goncalo-sala-jogos.jpg', alt: 'Sala de jogos — Unic São Gonçalo', label: 'Sala de Jogos' },
                { src: '/unic-sao-goncalo-pet-place.jpg', alt: 'Pet Place — Unic São Gonçalo', label: 'Pet Place' },
                { src: '/unic-sao-goncalo-playground.png', alt: 'Playground — Unic São Gonçalo', label: 'Playground' },
                { src: '/unic-sao-goncalo-espaco-gourmet.png', alt: 'Espaço gourmet — Unic São Gonçalo', label: 'Espaço Gourmet' },
                { src: '/unic-sao-goncalo-fachada.jpg', alt: 'Fachada Unic São Gonçalo — Domma', label: 'Fachada' },
              ].map((img) => (
                <div key={img.src} className="relative group overflow-hidden rounded-xl aspect-video bg-slate-200">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent py-2 px-3">
                    <span className="text-white text-xs font-semibold">{img.label}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-slate-400 mt-3">Imagens meramente ilustrativas. Composição artística.</p>
          </div>
        </section>

        {/* ── TIPOLOGIAS ── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Plantas e Tipologias do Unic São Gonçalo
                </h2>
                <p className="text-slate-700 leading-relaxed mb-6">
                  O empreendimento oferece três tipologias para atender diferentes perfis de família.
                  Todas as unidades contam com varanda e acabamento entregue com piso vinílico/laminado
                  nas áreas secas e cerâmico nas áreas molhadas.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">2 Quartos (padrão)</p>
                      <p className="text-slate-600 text-sm">A partir de 45 m² com varanda — ideal para casais e famílias com filhos</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">PNE (acessível)</p>
                      <p className="text-slate-600 text-sm">Unidades adaptadas para pessoas com necessidades especiais</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Garden (térreo)</p>
                      <p className="text-slate-600 text-sm">Área verde privativa exclusiva para quem prefere um espaço externo</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Ficha Técnica */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-5">Ficha Técnica</h3>
                <dl className="space-y-3">
                  {[
                    ['Incorporadora', 'Domma'],
                    ['Endereço', 'Rua Nova Jersey, São Gonçalo-RJ'],
                    ['Área do terreno', '7.586,00 m²'],
                    ['N.º de unidades', '360 apartamentos'],
                    ['Torres', '2 torres'],
                    ['Pavimentos', 'Térreo + 14 andares + cobertura'],
                    ['Área privativa', 'A partir de 45 m²'],
                    ['Vagas', '155 vagas (43% das unidades)'],
                    ['Condomínio estimado', 'R$ 450,00/mês'],
                    ['Financiamento', 'Caixa — Minha Casa Minha Vida'],
                    ['Elevadores', '3 por torre'],
                    ['Sistema construtivo', 'Alvenaria estrutural + Drywall'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between text-sm border-b border-slate-200 pb-2 last:border-0">
                      <dt className="text-slate-500 font-medium">{label}</dt>
                      <dd className="text-slate-900 font-semibold text-right max-w-[55%]">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* ── POR QUE COMPRAR ── */}
        <section className="py-16 bg-primary/5 border-y border-primary/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Por que o Unic São Gonçalo é uma Excelente Escolha?
            </h2>
            <p className="text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
              Com localização estratégica ao lado do Shopping São Gonçalo, lazer de alto padrão em dois
              rooftops e financiamento facilitado pelo MCMV, o empreendimento reúne qualidade de vida
              e valorização em um único endereço.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 text-left">
              {[
                {
                  titulo: 'Localização Central',
                  texto: 'A 30 segundos do Shopping São Gonçalo e com acesso rápido à Ponte Rio-Niterói, você está perto de tudo.',
                },
                {
                  titulo: 'Condomínio Clube Premium',
                  texto: 'Dois rooftops completos com piscina, academia e salão de festas com vista panorâmica — raridade no MCMV.',
                },
                {
                  titulo: 'Financiamento Facilitado',
                  texto: 'FGTS como entrada, subsídio do governo e taxas reduzidas da Caixa. Parcelas que cabem no orçamento.',
                },
              ].map((card) => (
                <div key={card.titulo} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-green-600 mb-3" />
                  <p className="font-bold text-slate-900 mb-2">{card.titulo}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{card.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
              Perguntas Frequentes — Unic São Gonçalo
            </h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.pergunta} className="border-b border-slate-200 pb-6 last:border-0">
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{faq.pergunta}</h3>
                  <p className="text-slate-600 leading-relaxed">{faq.resposta}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                <span>Fale com Joel Marcos pelo WhatsApp</span>
              </a>
            </div>
          </div>
        </section>

        {/* ── LINKS INTERNOS ── */}
        <section className="py-12 bg-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/minha-casa-minha-vida-sao-goncalo"
                className="bg-white p-5 rounded-xl border border-slate-200 hover:border-primary hover:shadow-md transition-all"
              >
                <h3 className="font-bold text-slate-900 mb-1">MCMV em São Gonçalo</h3>
                <p className="text-sm text-slate-600">Veja outros empreendimentos disponíveis na cidade.</p>
              </Link>
              <Link
                to="/subsidio-minha-casa-minha-vida"
                className="bg-white p-5 rounded-xl border border-slate-200 hover:border-primary hover:shadow-md transition-all"
              >
                <h3 className="font-bold text-slate-900 mb-1">Subsídio MCMV</h3>
                <p className="text-sm text-slate-600">Descubra quanto de subsídio você pode obter.</p>
              </Link>
              <Link
                to="/fgts-minha-casa-minha-vida"
                className="bg-white p-5 rounded-xl border border-slate-200 hover:border-primary hover:shadow-md transition-all"
              >
                <h3 className="font-bold text-slate-900 mb-1">Use o seu FGTS</h3>
                <p className="text-sm text-slate-600">Saiba como usar o FGTS na entrada ou nas parcelas.</p>
              </Link>
              <Link
                to="/documentos-minha-casa-minha-vida"
                className="bg-white p-5 rounded-xl border border-slate-200 hover:border-primary hover:shadow-md transition-all"
              >
                <h3 className="font-bold text-slate-900 mb-1">Documentação</h3>
                <p className="text-sm text-slate-600">Lista completa de documentos para aprovar seu crédito.</p>
              </Link>
            </div>
          </div>
        </section>

        {/* ── FORMULÁRIO FINAL (CTA) ── */}
        <section className="py-16 bg-slate-800 text-white" id="contato">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
                Interesse no Unic São Gonçalo? Fale Agora!
              </h2>
              <p className="text-slate-300 max-w-xl mx-auto">
                Preencha o formulário e o corretor Joel Marcos entrará em contato com preço,
                condições de pagamento e disponibilidade.
              </p>
            </div>
            <div className="max-w-xl mx-auto shadow-2xl rounded-2xl overflow-hidden">
              <LeadForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
