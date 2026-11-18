import { Helmet } from 'react-helmet-async';
import {
  MapPin, Bed, Maximize2, CalendarCheck, Building2,
  CheckCircle2, ChevronRight, Phone, Star,
  ShoppingCart, Car, TreePine, Shield,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';

const WHATSAPP_URL =
  'https://wa.me/5521965928399?text=Ol%C3%A1%2C%20Joel!%20Tenho%20interesse%20no%20Residencial%20Mar%20de%20Trindade%20em%20S%C3%A3o%20Gon%C3%A7alo...%20Pode%20me%20ajudar%3F';

/* ── Schema JSON-LD ──────────────────────────────────────────────── */
const schemaJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ApartmentComplex',
      name: 'Residencial Mar de Trindade',
      description:
        'Residencial Mar de Trindade em Alcântara, São Gonçalo, RJ: apartamentos 2 quartos de 42 a 75,9 m² com opção de suíte, varanda e área privativa garden, piscina adulto e infantil, academia, salão de festas, espaço kids, quadra poliesportiva e churrasqueira gourmet. Elegível ao Minha Casa Minha Vida. Construtora MRV Engenharia.',
      url: 'https://queromeumcmv.com.br/apartamentos-mar-de-trindade',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Estrada dos Menezes, s/n',
        addressLocality: 'Alcântara',
        addressRegion: 'RJ',
        postalCode: '24714-150',
        addressCountry: 'BR',
      },
      geo: { '@type': 'GeoCoordinates', latitude: -22.834, longitude: -43.071 },
      numberOfRooms: '2',
      floorSize: { '@type': 'QuantitativeValue', minValue: 42, maxValue: 75.9, unitCode: 'MTK' },
      numberOfUnitsTotal: 504,
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Piscina Adulto e Infantil', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Academia Completa', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Churrasqueira Gourmet', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Salão de Festas', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Espaço Kids / Brinquedoteca', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Quadra Poliesportiva', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Futmesa', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Praça com Área Verde', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Playground', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Portaria 24h', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Vestiário da Piscina', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Bicicletário', value: true },
      ],
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Construtora', value: 'MRV Engenharia' },
        { '@type': 'PropertyValue', name: 'Programa', value: 'Minha Casa Minha Vida' },
        { '@type': 'PropertyValue', name: 'Tipologia', value: '2 Quartos | Suíte | Varanda | Garden' },
        { '@type': 'PropertyValue', name: 'Torres', value: '3 torres, 3 elevadores cada' },
        { '@type': 'PropertyValue', name: 'Unidades', value: '504 apartamentos' },
        { '@type': 'PropertyValue', name: 'Entrega', value: 'Dezembro 2028' },
      ],
      broker: { '@id': 'https://queromeumcmv.com.br/#organization' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://queromeumcmv.com.br/' },
        { '@type': 'ListItem', position: 2, name: 'MCMV São Gonçalo', item: 'https://queromeumcmv.com.br/minha-casa-minha-vida-sao-goncalo' },
        { '@type': 'ListItem', position: 3, name: 'Residencial Mar de Trindade', item: 'https://queromeumcmv.com.br/apartamentos-mar-de-trindade' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'O que é o Residencial Mar de Trindade?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'O Residencial Mar de Trindade é um empreendimento da MRV Engenharia em Alcântara, São Gonçalo-RJ. São 504 apartamentos de 2 quartos (42 a 75,9 m²), com opções de suíte, varanda e área privativa garden, distribuídos em 3 torres. É o primeiro residencial de Alcântara a oferecer esse conjunto de diferenciais, elegível ao programa Minha Casa Minha Vida.',
          },
        },
        {
          '@type': 'Question',
          name: 'Qual o preço do Residencial Mar de Trindade?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Os apartamentos do Residencial Mar de Trindade partem de R$ 270.990 para a planta de 42 m². Com o Minha Casa Minha Vida, famílias com renda até R$ 8.000 podem acessar subsídios do governo, juros reduzidos pela Caixa Econômica Federal e uso do FGTS como entrada. Consulte um corretor credenciado CRECI para simular sua parcela.',
          },
        },
        {
          '@type': 'Question',
          name: 'Onde fica o Residencial Mar de Trindade?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'O Residencial Mar de Trindade fica na Estrada dos Menezes, no bairro Alcântara, São Gonçalo-RJ — ao lado do Atacadão, a 5 minutos do Assaí, do Shopping Pátio Alcântara e do Terminal Rodoviário. Acesso direto à Rodovia RJ-104 para Niterói e Rio de Janeiro.',
          },
        },
        {
          '@type': 'Question',
          name: 'Quando o Residencial Mar de Trindade será entregue?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A previsão de entrega do Residencial Mar de Trindade é dezembro de 2028. O empreendimento foi lançado em agosto de 2025 e está em construção pela MRV Engenharia, maior construtora do Brasil.',
          },
        },
        {
          '@type': 'Question',
          name: 'O Residencial Mar de Trindade tem apartamento garden?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sim. O Residencial Mar de Trindade conta com 36 unidades garden, com áreas privativas externas que variam de 19 m² a 31,86 m². As unidades garden ficam no térreo e são ideais para famílias com crianças ou pets.',
          },
        },
      ],
    },
  ],
};

/* ── Dados ───────────────────────────────────────────────────────── */
const distancias = [
  { local: 'Atacadão Alcântara', tempo: 'Ao lado', dist: '< 1 min', icon: '🛒' },
  { local: 'Assaí Atacadista', tempo: '3 min', dist: 'Via Estrada dos Menezes', icon: '🛒' },
  { local: 'Shopping Pátio Alcântara', tempo: '5 min', dist: 'Polo comercial', icon: '🛍️' },
  { local: 'Terminal Rod. Alcântara', tempo: '5 min', dist: 'Ônibus p/ Niterói e Rio', icon: '🚌' },
  { local: 'Rodovia RJ-104', tempo: '5 min', dist: 'Acesso expresso', icon: '🛣️' },
  { local: 'Academia Smartfit', tempo: '5 min', dist: 'Próximo ao empreendimento', icon: '💪' },
  { local: 'Supermercado Carrefour', tempo: '7 min', dist: 'Grande rede', icon: '🏪' },
  { local: 'Parque das Águas', tempo: '8 min', dist: 'Lazer e natureza', icon: '🌳' },
];

const lazerItems = [
  { img: '/mar-de-trindade-piscina.webp', alt: 'Piscina adulto e infantil do Residencial Mar de Trindade em São Gonçalo', titulo: '🏊 Piscina Adulto + Infantil', desc: 'Área de lazer aquático com deck de madeira, solarium e vestiários completos.' },
  { img: '/mar-de-trindade-churrasqueira.webp', alt: 'Churrasqueira gourmet com bancada em granito do Mar de Trindade', titulo: '🍖 Churrasqueira Gourmet', desc: 'Espaço gourmet com churrasqueira embutida, bancada em granito e integração ao salão de festas.' },
  { img: '/mar-de-trindade-quadra.webp', alt: 'Quadra poliesportiva com futsal e basquete do Mar de Trindade', titulo: '⚽ Quadra Poliesportiva', desc: 'Quadra com demarcação para futsal e basquete, cercada por vegetação natural.' },
  { img: '/mar-de-trindade-academia.webp', alt: 'Academia completa com equipamentos modernos do Residencial Mar de Trindade', titulo: '🏋️ Academia Completa', desc: 'Musculação, cardio e área funcional com equipamentos profissionais e iluminação especial.' },
  { img: '/mar-de-trindade-salao-festas.webp', alt: 'Salão de festas espaçoso do Residencial Mar de Trindade em Alcântara', titulo: '🎉 Salão de Festas', desc: 'Amplo salão com capacidade para grandes eventos, painel em madeira e integração ao espaço gourmet.' },
  { img: '/mar-de-trindade-kids.webp', alt: 'Espaço kids colorido e equipado do Residencial Mar de Trindade', titulo: '👶 Espaço Kids', desc: 'Brinquedoteca temática com brinquedos pedagógicos, mezanino e área de leitura para crianças.' },
  { img: '/mar-de-trindade-futmesa.webp', alt: 'Futmesa e área de lazer verde do Mar de Trindade São Gonçalo', titulo: '🏓 Futmesa + Área Verde', desc: 'Área verde com futmesa e espaço convivência integrado à natureza do condomínio.' },
  { img: '/mar-de-trindade-praca.webp', alt: 'Praça com paisagismo e churrasqueira do condomínio Mar de Trindade', titulo: '🌳 Praça com Paisagismo', desc: 'Área de convivência com palmeiras, ipês roxos, bancos e churrasqueira ao ar livre.' },
];

const tipologias = [
  {
    tipo: '2 Quartos — Padrão',
    metragem: '42 m²',
    desc: 'Planta compacta e funcional. Sala integrada à cozinha, 2 quartos, banheiro social e 1 vaga. Ideal para casais e pequenas famílias iniciando.',
    icon: '🏠',
    publico: 'Casal jovem | Primeira compra',
    preco: 'A partir de R$ 270.990',
    destaque: false,
  },
  {
    tipo: '2 Quartos — Suíte + Varanda',
    metragem: '46 m²',
    desc: 'O primeiro de Alcântara com suíte e varanda no MCMV. Quarto do casal com banheiro privativo, varanda integrada à sala e 1 vaga coberta.',
    icon: '🌟',
    publico: 'Família | Upgrade de vida',
    preco: 'Consulte disponibilidade',
    destaque: true,
  },
  {
    tipo: '2 Quartos — Garden',
    metragem: 'Até 75,9 m²',
    desc: 'Térreo com área privativa externa de 19 m² a 31,86 m². Espaço exclusivo ao ar livre para o seu filho brincar e receber amigos com privacidade.',
    icon: '🌿',
    publico: 'Famílias com crianças | Pets',
    preco: 'Consulte disponibilidade',
    destaque: false,
  },
];

const doresEsolucoes = [
  {
    dor: '😩 "Pago aluguel e o dinheiro some todo mês"',
    solucao: 'Com o MCMV, sua parcela pode ser MENOR que o aluguel que você paga hoje — e cada centavo vai para o seu patrimônio. Pare de enriquecer o dono do imóvel.',
  },
  {
    dor: '😰 "Não tenho dinheiro para a entrada"',
    solucao: 'Use seu FGTS como entrada. Muitos clientes compram sem desembolsar nada do próprio bolso. Consulte-nos para simular com o saldo do seu FGTS.',
  },
  {
    dor: '🤔 "Minha renda não é suficiente"',
    solucao: 'Você pode compor renda com cônjuge, filhos ou qualquer membro da família — até 3 pessoas. Renda conjunta de R$ 2.500 já abre o financiamento MCMV.',
  },
  {
    dor: '😟 "Moro longe de tudo, em bairro sem estrutura"',
    solucao: 'O Mar de Trindade fica em Alcântara — o polo comercial de São Gonçalo. Atacadão do lado, Shopping a 5 min, transporte para Niterói e Rio na porta.',
  },
];

/* ── Componente ──────────────────────────────────────────────────── */
export default function MarDeTrindade() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header />

      <Helmet>
        <title>Residencial Mar de Trindade MRV | Apartamentos MCMV São Gonçalo RJ | 2 Quartos a partir de R$ 270.990</title>
        <meta
          name="description"
          content="Residencial Mar de Trindade MRV em Alcântara, São Gonçalo RJ. 2 quartos de 42 a 75,9 m² com suíte, varanda e garden. Piscina, academia, salão de festas e quadra. MCMV a partir de R$ 270.990. Consulte Joel Marcos, corretor CRECI."
        />
        <meta name="keywords" content="Mar de Trindade, apartamentos São Gonçalo, MCMV Alcântara, MRV São Gonçalo, apartamentos Alcântara RJ, Minha Casa Minha Vida São Gonçalo, apartamentos 2 quartos São Gonçalo" />
        <link rel="canonical" href="https://queromeumcmv.com.br/apartamentos-mar-de-trindade" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Residencial Mar de Trindade MRV | MCMV São Gonçalo RJ" />
        <meta property="og:description" content="2 quartos com suíte, varanda e garden em Alcântara, São Gonçalo. A partir de R$ 270.990 pelo MCMV. Lazer de clube: piscina, academia, salão de festas e quadra." />
        <meta property="og:url" content="https://queromeumcmv.com.br/apartamentos-mar-de-trindade" />
        <meta property="og:image" content="https://queromeumcmv.com.br/mar-de-trindade-guarita.webp" />
        <meta property="og:locale" content="pt_BR" />

        {/* GEO */}
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="Alcântara, São Gonçalo, Rio de Janeiro" />
        <meta name="geo.position" content="-22.834;-43.071" />
        <meta name="ICBM" content="-22.834, -43.071" />

        <script type="application/ld+json">{JSON.stringify(schemaJsonLd)}</script>
      </Helmet>

      {/* ═══════════════════════════════════════════════
          HERO — Fachada + Copy Neuromarketing + Formulário
      ═══════════════════════════════════════════════ */}
      <section className="relative py-20 bg-slate-900 text-white overflow-hidden min-h-[600px] flex items-center">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35"
          style={{ backgroundImage: "url('/mar-de-trindade-guarita.webp')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/60" aria-hidden="true" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Coluna Esquerda: Copy */}
            <div>
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  🏆 MRV — Maior Construtora do Brasil
                </span>
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  ✅ Minha Casa Minha Vida
                </span>
                <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  🔥 Em construção
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
                Residencial{' '}
                <span className="text-blue-400">Mar de Trindade</span>
                <br />
                <span className="text-2xl lg:text-3xl font-semibold text-slate-200">
                  O primeiro de Alcântara com suíte, varanda e garden
                </span>
              </h1>

              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                Imagine sair do aluguel e ter o seu apartamento em Alcântara —{' '}
                <strong className="text-white">o polo comercial de São Gonçalo</strong> — com piscina, academia,
                salão de festas e lazer completo. Tudo isso pelo{' '}
                <strong className="text-green-400">Minha Casa Minha Vida</strong>.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { icon: <Maximize2 className="w-5 h-5" />, label: 'Metragem', val: '42 – 75 m²' },
                  { icon: <Bed className="w-5 h-5" />, label: 'Quartos', val: '2 Quartos' },
                  { icon: <Building2 className="w-5 h-5" />, label: 'Torres', val: '3 Torres' },
                  { icon: <CalendarCheck className="w-5 h-5" />, label: 'Entrega', val: 'Dez/2028' },
                ].map((s, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/20">
                    <div className="text-blue-400 flex justify-center mb-1">{s.icon}</div>
                    <div className="text-xs text-slate-400">{s.label}</div>
                    <div className="text-sm font-bold text-white">{s.val}</div>
                  </div>
                ))}
              </div>

              {/* Prova Social */}
              <div className="flex items-center gap-3 p-4 bg-green-500/20 rounded-xl border border-green-500/40 mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-slate-200 text-sm">
                  <strong>504 unidades</strong> · 36 options garden exclusivas ·
                  Único com suíte + varanda no MCMV de Alcântara
                </p>
              </div>

              {/* CTA Mobile */}
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="lg:hidden inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all shadow-lg shadow-green-500/30"
              >
                <Phone className="w-5 h-5" />
                Quero saber mais no WhatsApp
              </a>
            </div>

            {/* Coluna Direita: Formulário */}
            <div>
              <LeadForm utmSource="mar-de-trindade" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FAIXA MCMV — 4 Benefícios
      ═══════════════════════════════════════════════ */}
      <section className="bg-green-600 text-white py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <span className="text-sm font-bold uppercase tracking-widest opacity-80">Programa Federal</span>
            <h2 className="text-2xl font-extrabold mt-1">Por que o MCMV muda tudo?</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '💰', titulo: 'Subsídio do Governo', desc: 'Até R$ 55 mil de desconto no valor do imóvel para renda até R$ 4.400.' },
              { icon: '📉', titulo: 'Juros da Caixa', desc: 'Taxa a partir de 4% a.a. — muito abaixo do mercado convencional (12%+).' },
              { icon: '👨‍👩‍👧', titulo: 'Composição de Renda', desc: 'Some a renda de até 3 pessoas da família para aumentar o poder de compra.' },
              { icon: '🏦', titulo: 'FGTS como Entrada', desc: 'Use o saldo do seu FGTS para dar entrada ou abater o saldo devedor.' },
            ].map((b, i) => (
              <div key={i} className="bg-white/15 rounded-2xl p-5 text-center border border-white/20 backdrop-blur-sm">
                <div className="text-3xl mb-2">{b.icon}</div>
                <div className="font-bold mb-1">{b.titulo}</div>
                <div className="text-sm opacity-80">{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          GALERIA DO DECORADO
      ═══════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-green-600 font-bold text-sm uppercase tracking-widest">Ambientes</span>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-1">
              Decorado que inspira uma nova vida
            </h2>
            <p className="text-slate-500 mt-2 max-w-xl mx-auto">
              Cada detalhe foi pensado para você se imaginar morando aqui — porque esse é o seu lugar.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { img: '/mar-de-trindade-sala.webp', alt: 'Sala de estar integrada à cozinha do Residencial Mar de Trindade', label: 'Sala + Cozinha Integradas' },
              { img: '/mar-de-trindade-suite.webp', alt: 'Suíte com banheiro privativo do Mar de Trindade Alcântara', label: 'Suíte com Banheiro Privativo' },
              { img: '/mar-de-trindade-varanda.webp', alt: 'Varanda do apartamento 2 quartos do Mar de Trindade', label: 'Varanda com Vista para a Natureza' },
            ].map((f, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-md group">
                <div className="relative overflow-hidden">
                  <img
                    src={f.img}
                    alt={f.alt}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <span className="text-white font-semibold text-sm">{f.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quartos */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {[
              { img: '/mar-de-trindade-quarto-casal.webp', alt: 'Quarto do casal com closet e iluminação LED do Mar de Trindade', label: 'Quarto do Casal com Closet' },
              { img: '/mar-de-trindade-quarto-infantil.webp', alt: 'Quarto infantil decorado do Residencial Mar de Trindade São Gonçalo', label: 'Quarto Infantil — Espaço para Crescer' },
            ].map((f, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-md group">
                <div className="relative overflow-hidden">
                  <img
                    src={f.img}
                    alt={f.alt}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <span className="text-white font-semibold">{f.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Área Privativa Garden */}
          <div className="mt-6 rounded-2xl overflow-hidden shadow-lg">
            <div className="relative">
              <img
                src="/mar-de-trindade-area-privativa.webp"
                alt="Área privativa garden do Residencial Mar de Trindade — exclusivo no MCMV de Alcântara"
                className="w-full h-72 object-cover object-center"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                <div className="p-8">
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase mb-3 inline-block">Exclusividade</span>
                  <h3 className="text-white text-2xl font-extrabold">🌿 Área Privativa Garden</h3>
                  <p className="text-slate-200 mt-2 max-w-sm">
                    36 unidades únicas com área externa privativa de até 31,86 m².
                    Seu jardim, sua churrasqueira, seu espaço — sem dividir com ninguém.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          LOCALIZAÇÃO
      ═══════════════════════════════════════════════ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-green-600 font-bold text-sm uppercase tracking-widest">Localização</span>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-1">
              Alcântara: a vida inteira ao seu redor
            </h2>
            <p className="text-slate-500 mt-2 max-w-xl mx-auto">
              O polo comercial mais completo de São Gonçalo — supermercados, shopping, transporte e saúde a minutos do seu apartamento.
            </p>
          </div>

          {/* Foto Aérea */}
          <div className="mb-10 rounded-2xl overflow-hidden shadow-xl">
            <img
              src="/mar-de-trindade-foto-aerea.webp"
              alt="Vista aérea do Residencial Mar de Trindade em Alcântara São Gonçalo com pontos de referência próximos"
              className="w-full h-72 md:h-96 object-cover object-center"
              loading="lazy"
            />
          </div>

          {/* Cards de Distância */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {distancias.map((d, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-start gap-3">
                <span className="text-2xl">{d.icon}</span>
                <div>
                  <div className="font-semibold text-slate-800 text-sm">{d.local}</div>
                  <div className="text-green-600 font-bold text-sm">{d.tempo}</div>
                  <div className="text-slate-400 text-xs">{d.dist}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Destaques de Localização */}
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: <ShoppingCart className="w-6 h-6 text-green-600" />, titulo: 'Atacadão ao Lado', desc: 'O maior atacadista da região fica literalmente ao lado do condomínio. Conveniência no dia a dia.' },
              { icon: <Car className="w-6 h-6 text-blue-600" />, titulo: 'Acesso à RJ-104', desc: 'Em 5 minutos você acessa a Rodovia RJ-104 — o caminho direto para Niterói e o Grande Rio.' },
              { icon: <TreePine className="w-6 h-6 text-teal-600" />, titulo: 'Cercado por Natureza', desc: 'Montanhas e vegetação como pano de fundo. Ar fresco e qualidade de vida que o centro não tem.' },
            ].map((d, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-4">
                <div className="p-3 bg-slate-50 rounded-xl flex-shrink-0">{d.icon}</div>
                <div>
                  <div className="font-bold text-slate-800 mb-1">{d.titulo}</div>
                  <div className="text-slate-500 text-sm">{d.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          LAZER DE CLUBE — 8 itens
      ═══════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-green-600 font-bold text-sm uppercase tracking-widest">Lazer Completo</span>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-1">
              Clube particular — sem mensalidade
            </h2>
            <p className="text-slate-500 mt-2 max-w-xl mx-auto">
              Tudo o que você pagaria em um clube particular já está incluído no seu condomínio.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {lazerItems.map((item, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-md group bg-white border border-slate-100">
                <div className="relative overflow-hidden h-44">
                  <img
                    src={item.img}
                    alt={item.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <div className="font-bold text-slate-800 text-sm mb-1">{item.titulo}</div>
                  <div className="text-slate-500 text-xs leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Itens em grid */}
          <div className="mt-8 bg-slate-50 rounded-2xl p-6">
            <h3 className="font-bold text-slate-700 mb-4 text-center">E ainda mais no seu condomínio:</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                '🎯 Playground Infantil', '🚲 Bicicletário', '♿ Acessibilidade Total',
                '📦 Coleta Seletiva', '💧 Medição Água Individualizada',
                '⛽ Previsão Gás Individualizado', '🔒 Portaria 24h', '🛗 3 Elevadores por Torre',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-600 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          DORES E SOLUÇÕES — Neuromarketing
      ═══════════════════════════════════════════════ */}
      <section className="py-16 bg-slate-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-green-400 font-bold text-sm uppercase tracking-widest">Sua Realidade Pode Mudar</span>
            <h2 className="text-3xl font-extrabold mt-1">
              Reconhece alguma dessas situações?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {doresEsolucoes.map((item, i) => (
              <div key={i} className="bg-white/10 rounded-2xl p-6 border border-white/20 backdrop-blur-sm">
                <p className="text-slate-300 text-sm font-semibold mb-3 italic">{item.dor}</p>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-white text-sm leading-relaxed">{item.solucao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TIPOLOGIAS — 3 Plantas
      ═══════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-green-600 font-bold text-sm uppercase tracking-widest">Plantas Disponíveis</span>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-1">
              Escolha a sua tipologia ideal
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {tipologias.map((t, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 border-2 ${
                  t.destaque
                    ? 'border-green-500 bg-green-50 shadow-lg shadow-green-100'
                    : 'border-slate-200 bg-white shadow-sm'
                }`}
              >
                {t.destaque && (
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase mb-3 inline-block">
                    ⭐ Mais Procurado
                  </span>
                )}
                <div className="text-3xl mb-3">{t.icon}</div>
                <h3 className="font-extrabold text-slate-800 text-lg mb-1">{t.tipo}</h3>
                <div className="text-green-600 font-bold text-2xl mb-2">{t.metragem}</div>
                <p className="text-slate-500 text-sm mb-4 leading-relaxed">{t.desc}</p>
                <div className="bg-slate-100 rounded-lg p-3 mb-4">
                  <div className="text-xs text-slate-400 uppercase font-semibold">Ideal para</div>
                  <div className="text-slate-700 font-semibold text-sm">{t.publico}</div>
                </div>
                <div className="text-green-700 font-bold">{t.preco}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CTA CENTRAL — WhatsApp
      ═══════════════════════════════════════════════ */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-extrabold mb-3">
            Fale agora com Joel Marcos, corretor CRECI
          </h2>
          <p className="text-green-100 text-lg mb-8">
            24 anos de experiência no mercado imobiliário. Atendimento personalizado,
            simulação MCMV gratuita e suporte do início ao financiamento até a chave na sua mão.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-green-700 font-extrabold text-lg py-4 px-10 rounded-full shadow-xl hover:shadow-2xl hover:bg-green-50 transition-all"
          >
            <Phone className="w-5 h-5" />
            Quero meu apartamento no Mar de Trindade
            <ChevronRight className="w-5 h-5" />
          </a>
          <p className="text-green-200 text-sm mt-4 opacity-80">
            Resposta em até 5 minutos · Seg a Sex, 9h–17h
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FAQ — AEO/SGE
      ═══════════════════════════════════════════════ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-green-600 font-bold text-sm uppercase tracking-widest">Perguntas Frequentes</span>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-1">Tire suas dúvidas</h2>
          </div>
          <div className="space-y-3">
            {[
              {
                q: 'O que é o Residencial Mar de Trindade?',
                a: 'O Residencial Mar de Trindade é um empreendimento da MRV Engenharia em Alcântara, São Gonçalo-RJ. São 504 apartamentos de 2 quartos (42 a 75,9 m²) com opção de suíte, varanda e área privativa garden. É o primeiro residencial de Alcântara a reunir esses diferenciais dentro do MCMV.',
              },
              {
                q: 'Qual o preço do Residencial Mar de Trindade?',
                a: 'Os apartamentos partem de R$ 270.990 para a planta de 42 m². Com o Minha Casa Minha Vida, famílias podem acessar subsídios, juros reduzidos e usar o FGTS. A parcela pode ser inferior ao aluguel atual. Solicite uma simulação personalizada com o corretor Joel Marcos.',
              },
              {
                q: 'Onde fica o Residencial Mar de Trindade?',
                a: 'Na Estrada dos Menezes, bairro Alcântara, São Gonçalo-RJ. O Atacadão fica literalmente ao lado. O Assaí e o Shopping Pátio Alcântara estão a 5 minutos, e o Terminal Rodoviário com ônibus para Niterói e Rio também.',
              },
              {
                q: 'Quando o Residencial Mar de Trindade será entregue?',
                a: 'A previsão de entrega é dezembro de 2028. O empreendimento foi lançado em agosto de 2025 e está em construção. Comprar agora garante o preço de lançamento — após a entrega, o valor do m² tende a valorizar significativamente.',
              },
              {
                q: 'O Residencial Mar de Trindade tem apartamento garden?',
                a: 'Sim. São 36 unidades garden com área privativa de 19 m² a 31,86 m² no térreo. Espaço exclusivo ao ar livre — perfeito para famílias com crianças ou pets. As vagas garden são limitadas e costumam ser as primeiras a sair.',
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="bg-white rounded-xl border border-slate-200 shadow-sm group"
              >
                <summary className="flex justify-between items-center cursor-pointer p-5 font-semibold text-slate-800 hover:text-green-700 transition-colors list-none">
                  {faq.q}
                  <ChevronRight className="w-5 h-5 flex-shrink-0 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          LINKS INTERNOS — DEO
      ═══════════════════════════════════════════════ */}
      <section className="py-10 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wide text-center mb-6">
            Mais opções de apartamentos MCMV
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { href: '/minha-casa-minha-vida-sao-goncalo', label: '🏠 MCMV São Gonçalo' },
              { href: '/vert-alcantara', label: '🏢 Direcional Vert Alcântara' },
              { href: '/minha-casa-minha-vida-itaborai', label: '🏠 MCMV Itaboraí' },
              { href: '/financiamento-minha-casa-minha-vida', label: '💰 Como financiar pelo MCMV' },
              { href: '/subsidio-minha-casa-minha-vida', label: '💵 Subsidio MCMV' },
              { href: '/fgts-minha-casa-minha-vida', label: '🏦 FGTS no MCMV' },
            ].map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="inline-flex items-center gap-1 bg-slate-100 hover:bg-green-50 hover:text-green-700 text-slate-600 text-sm font-medium px-4 py-2 rounded-full border border-slate-200 hover:border-green-300 transition-all"
              >
                {link.label}
                <ChevronRight className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* WhatsApp Float — global no App.tsx, não duplicar */}
    </div>
  );
}
