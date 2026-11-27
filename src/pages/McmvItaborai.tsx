/**
 * Página municipal: /minha-casa-minha-vida-itaborai
 * Autoria: Market Local Digital | CRECI 39.583F — Joel Marcos
 * Data de publicação: 2026-11-27
 *
 * SEO: CollectionPage + ItemList (4 empreendimentos) + FAQPage
 * Destaque comercial vigente: Solar Manilha (1º card)
 * Proposta editorial: comparação casas vs apartamentos em Itaboraí
 */

import { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Home,
  Building2,
  MapPin,
  ArrowRight,
  ChevronDown,
  Star,
  Shield,
  Landmark,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import AuthorProfile from '../components/AuthorProfile';

// ─── Constantes de rastreamento ───────────────────────────────────────────────
const SLUG = 'minha-casa-minha-vida-itaborai';
const FORM_ID = 'form-mcmv-itaborai';
const CANONICAL = 'https://queromeumcmv.com.br/minha-casa-minha-vida-itaborai';
const OG_IMAGE = 'https://queromeumcmv.com.br/capa-site-quero-meu-mcmv-open-graph.webp';

// ─── Dados dos empreendimentos ─────────────────────────────────────────────────
interface Empreendimento {
  id: number;
  nome: string;
  slug: string;
  tipo: 'apartamento' | 'casa';
  bairro: string;
  quartos: string;
  destaque: string;
  condicao: string;
  lazer: string[];
  imagem: string;
  imagemAlt: string;
  badge?: string;
  itemListUrl: string;
}

const EMPREENDIMENTOS: Empreendimento[] = [
  {
    id: 1,
    nome: 'Solar Manilha',
    slug: '/solar-manilha-itaborai',
    tipo: 'apartamento',
    bairro: 'Manilha, Itaboraí',
    quartos: '2 quartos',
    destaque: 'Destaque do mês · condomínio fechado',
    condicao: 'Subsídio de até R$ 55 mil · Caixa MCMV',
    lazer: ['Piscina', 'Playground', 'Academia'],
    imagem: '/capa-site-quero-meu-mcmv-open-graph.webp',
    imagemAlt: 'Solar Manilha em Itaboraí — apartamentos Minha Casa Minha Vida em Manilha',
    badge: '⭐ Em Destaque',
    itemListUrl: 'https://queromeumcmv.com.br/solar-manilha-itaborai',
  },
  {
    id: 2,
    nome: 'Reserva dos Pássaros 2',
    slug: '/reserva-dos-passaros-2',
    tipo: 'casa',
    bairro: 'Retiro São Joaquim, Itaboraí',
    quartos: '2 quartos',
    destaque: 'Casas 100% independentes · quintal privativo',
    condicao: 'Parcelas a partir de R$ 650*',
    lazer: ['Piscinas climatizadas', 'Academia', 'Salão de festas', 'Pet place'],
    imagem: '/fachada-da-casa-reserva-dos-passaros.webp',
    imagemAlt: 'Fachada das casas do Reserva dos Pássaros 2 em Itaboraí — condomínio clube MCMV',
    itemListUrl: 'https://queromeumcmv.com.br/reserva-dos-passaros-2',
  },
  {
    id: 3,
    nome: 'Prime Club Itaboraí',
    slug: '/prime-club-itaborai',
    tipo: 'apartamento',
    bairro: 'Itaboraí',
    quartos: '2 quartos',
    destaque: 'Entrada facilitada em até 72 vezes',
    condicao: 'Financiamento Caixa · MCMV',
    lazer: ['Piscina adulto e infantil', 'Academia equipada', 'Salão de festas'],
    imagem: '/capa-do-site-prime-club-itaborai.webp',
    imagemAlt: 'Prime Club Itaboraí — apartamentos 2 quartos com lazer completo pelo MCMV',
    itemListUrl: 'https://queromeumcmv.com.br/prime-club-itaborai',
  },
  {
    id: 4,
    nome: 'Flores de Maio',
    slug: '/flores-de-maio',
    tipo: 'apartamento',
    bairro: 'Santo Expedito, Itaboraí',
    quartos: '2 quartos',
    destaque: '5 min do Centro · apartamentos com varanda',
    condicao: 'Subsídio de até R$ 55 mil · Caixa MCMV',
    lazer: ['Piscina', 'Churrasqueira', 'Playground'],
    imagem: '/fachada-flores-de-maio.webp',
    imagemAlt: 'Flores de Maio em Santo Expedito, Itaboraí — 2 quartos com varanda pelo MCMV',
    itemListUrl: 'https://queromeumcmv.com.br/flores-de-maio',
  },
];

// ─── JSON-LD ──────────────────────────────────────────────────────────────────
const SCHEMA_JSON = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: 'Apartamentos Minha Casa Minha Vida em Itaboraí: Lançamentos',
      description:
        'Lançamentos MCMV em Itaboraí com condomínio fechado, lazer e parcela que pode ser menor que o aluguel. Compare os empreendimentos e descubra a sua condição.',
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://queromeumcmv.com.br/' },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Minha Casa Minha Vida Itaboraí',
            item: CANONICAL,
          },
        ],
      },
    },
    {
      '@type': 'ItemList',
      '@id': `${CANONICAL}#lista`,
      name: 'Empreendimentos Minha Casa Minha Vida em Itaboraí',
      description: 'Lista de empreendimentos MCMV disponíveis em Itaboraí-RJ em 2026',
      numberOfItems: EMPREENDIMENTOS.length,
      itemListElement: EMPREENDIMENTOS.map((e, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: e.nome,
        url: e.itemListUrl,
        item: {
          '@type': 'ApartmentComplex',
          name: e.nome,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Itaboraí',
            addressRegion: 'RJ',
            addressCountry: 'BR',
            streetAddress: e.bairro,
          },
          numberOfBedrooms: 2,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'BRL',
            description: e.condicao,
          },
        },
      })),
    },
    {
      '@type': 'FAQPage',
      '@id': `${CANONICAL}#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Quais imóveis estão disponíveis em Itaboraí pelo Minha Casa Minha Vida?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Em 2026 trabalhamos com Solar Manilha (apartamentos em Manilha), Reserva dos Pássaros 2 (casas independentes em Retiro São Joaquim), Prime Club Itaboraí (apartamentos 2 quartos) e Flores de Maio (apartamentos com varanda em Santo Expedito). Consulte disponibilidade com o corretor.',
          },
        },
        {
          '@type': 'Question',
          name: 'Qual a diferença entre comprar uma casa ou apartamento pelo MCMV em Itaboraí?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'As casas (como o Reserva dos Pássaros 2) oferecem quintal privativo, sem vizinhos nas laterais e geralmente com lotes maiores a partir de 150 m². Os apartamentos costumam ter custo de condomínio menor por unidade, estrutura de lazer compartilhada e segurança integrada. Ambos podem ser financiados pelo MCMV com subsídio de até R$ 55 mil.',
          },
        },
        {
          '@type': 'Question',
          name: 'Qual a renda necessária para comprar imóvel pelo MCMV em Itaboraí?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'O programa atende famílias com renda bruta de até R$ 13.000 por mês. Famílias com renda de até R$ 5.000 (Faixas 1 e 2) podem receber subsídio de até R$ 55 mil. É permitida a composição de renda com cônjuge, familiares ou parceiros.',
          },
        },
        {
          '@type': 'Question',
          name: 'Quais documentos são necessários para o MCMV em Itaboraí?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Geralmente: RG, CPF, Certidão de Nascimento ou Casamento, Comprovante de Residência recente, Carteira de Trabalho, Extrato do FGTS e últimos 3 contracheques (ou extratos bancários dos últimos 6 meses para autônomos).',
          },
        },
        {
          '@type': 'Question',
          name: 'Como funciona a entrada nos imóveis MCMV de Itaboraí?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A entrada varia conforme o empreendimento, o subsídio aprovado e a análise de crédito da Caixa. Em muitos lançamentos a entrada pode ser parcelada diretamente com a construtora durante a obra. O saldo do FGTS também pode ser usado na entrada.',
          },
        },
      ],
    },
  ],
});

// ─── Componente principal ──────────────────────────────────────────────────────
export default function McmvItaborai() {
  const formRef = useRef<HTMLDivElement>(null);

  function scrollForm() {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Helmet>
        {/* ── Título & Descrição ── */}
        <title>Apartamentos Minha Casa Minha Vida em Itaboraí: Lançamentos</title>
        <meta
          name="description"
          content="Lançamentos MCMV em Itaboraí com condomínio fechado, lazer e parcela que pode ser menor que o aluguel. Compare os empreendimentos e descubra a sua condição."
        />
        <meta name="author" content="Market Local Digital" />

        {/* ── Canonical ── */}
        <link rel="canonical" href={CANONICAL} />

        {/* ── Open Graph ── */}
        <meta property="og:site_name" content="Quero Meu MCMV" />
        <meta property="og:locale" content="pt_BR" />
        <meta
          property="og:title"
          content="Apartamentos Minha Casa Minha Vida em Itaboraí: Lançamentos"
        />
        <meta
          property="og:description"
          content="Lançamentos MCMV em Itaboraí com condomínio fechado, lazer e parcela que pode ser menor que o aluguel. Compare os empreendimentos e descubra a sua condição."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* ── Twitter Card ── */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Apartamentos Minha Casa Minha Vida em Itaboraí: Lançamentos"
        />
        <meta
          name="twitter:description"
          content="Lançamentos MCMV em Itaboraí com condomínio fechado, lazer e parcela que pode ser menor que o aluguel."
        />
        <meta name="twitter:image" content={OG_IMAGE} />

        {/* ── Geo ── */}
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="Itaboraí" />

        {/* ── JSON-LD ── */}
        <script type="application/ld+json">{SCHEMA_JSON}</script>
      </Helmet>

      <Header />

      <main>
        {/* ════════════════════════════════════════════════════════════════════
            HERO — Página municipal
        ════════════════════════════════════════════════════════════════════ */}
        <section className="bg-slate-900 text-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="text-sm font-medium text-slate-400 mb-6" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Início
                  </Link>
                </li>
                <li aria-hidden="true" className="mx-1 text-slate-600">›</li>
                <li className="text-emerald-400" aria-current="page">
                  MCMV Itaboraí
                </li>
              </ol>
            </nav>

            <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-start">
              {/* Coluna texto */}
              <div>
                <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                  Lançamentos 2026 · Itaboraí-RJ
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-5">
                  Apartamentos Minha Casa Minha Vida em Itaboraí: lançamentos 2026
                </h1>
                <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mb-8">
                  Imagine trocar o recibo do aluguel pela chave de um imóvel seu — casa ou apartamento — em condomínio fechado com lazer, a poucos minutos do Centro de Itaboraí. Veja os lançamentos, compare as opções e descubra qual cabe no seu bolso.
                </p>

                {/* Quick stats */}
                <div className="flex flex-wrap gap-4 mb-8">
                  {[
                    { icon: Building2, label: '4 empreendimentos ativos' },
                    { icon: MapPin, label: 'Itaboraí-RJ' },
                    { icon: Landmark, label: 'Subsídio até R$ 55 mil' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 text-slate-300 text-sm">
                      <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={scrollForm}
                  className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-7 rounded-xl transition-colors text-base"
                >
                  Simular gratuitamente
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {/* Formulário flutuante */}
              <div
                ref={formRef}
                id="formulario"
                className="bg-white rounded-2xl shadow-2xl p-6 w-full"
              >
                <p className="text-center text-slate-900 font-bold text-lg mb-1">
                  Simulação gratuita
                </p>
                <p className="text-center text-slate-500 text-sm mb-5">
                  Receba no WhatsApp as melhores opções para o seu perfil
                </p>
                <LeadForm
                  confirmarGravacao
                  pagina={SLUG}
                  empreendimento="MCMV Itaboraí"
                  formId={FORM_ID}
                  ctaTexto="Quero ver as opções →"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            GRADE DE EMPREENDIMENTOS
        ════════════════════════════════════════════════════════════════════ */}
        <section className="py-16 bg-white" aria-label="Empreendimentos em Itaboraí">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                Imóveis disponíveis em Itaboraí
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Casas e apartamentos em condomínio fechado, financiados pela Caixa pelo programa Minha Casa Minha Vida.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {EMPREENDIMENTOS.map((emp) => (
                <article
                  key={emp.id}
                  className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col ${
                    emp.id === 1
                      ? 'ring-2 ring-emerald-400 border-emerald-200'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Badge destaque */}
                  {emp.badge && (
                    <div className="bg-emerald-500 text-white text-xs font-bold text-center py-1.5 tracking-wide">
                      {emp.badge}
                    </div>
                  )}

                  {/* Imagem */}
                  <div className="relative">
                    <img
                      src={emp.imagem}
                      alt={emp.imagemAlt}
                      width={400}
                      height={225}
                      loading={emp.id <= 2 ? 'eager' : 'lazy'}
                      className="w-full h-44 object-cover object-center"
                    />
                    {/* Tipo de imóvel */}
                    <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 bg-slate-900/80 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {emp.tipo === 'casa' ? (
                        <Home className="w-3 h-3" />
                      ) : (
                        <Building2 className="w-3 h-3" />
                      )}
                      {emp.tipo === 'casa' ? 'Casa' : 'Apartamento'}
                    </span>
                  </div>

                  {/* Conteúdo */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-slate-900 text-base mb-0.5">{emp.nome}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                      <MapPin className="w-3 h-3 shrink-0" /> {emp.bairro}
                    </p>
                    <p className="text-xs text-slate-700 mb-2 leading-relaxed">{emp.destaque}</p>

                    {/* Lazer chips */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {emp.lazer.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    {/* Condição comercial */}
                    <p className="text-xs font-semibold text-emerald-700 mb-4 mt-auto">
                      {emp.condicao}
                    </p>

                    <Link
                      to={emp.slug}
                      className="block text-center bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-colors"
                    >
                      Ver detalhes <ArrowRight className="inline w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Aviso de preço */}
            <p className="text-center text-xs text-slate-400 mt-6">
              * Valores, condições e disponibilidade sujeitos a alteração sem aviso prévio. Consulte o corretor para confirmação.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            COMPARATIVO: CASAS vs APARTAMENTOS
        ════════════════════════════════════════════════════════════════════ */}
        <section className="py-16 bg-slate-50" aria-labelledby="comparativo-heading">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2
                id="comparativo-heading"
                className="text-3xl font-bold text-slate-900 mb-3"
              >
                Casa ou apartamento em Itaboraí?
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Ambos podem ser financiados pelo Minha Casa Minha Vida. A escolha certa depende do seu estilo de vida e das suas prioridades.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Casas */}
              <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Home className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Casa em condomínio</h3>
                    <p className="text-xs text-slate-500">Ex: Reserva dos Pássaros 2</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    'Quintal e área externa privativa',
                    'Sem vizinhos nas laterais (100% independente)',
                    'Lote privativo a partir de 150 m²',
                    'Maior sensação de espaço e liberdade',
                    'Ideal para famílias com crianças ou pets',
                    'Condomínio compartilhado com clube completo',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/reserva-dos-passaros-2"
                  className="mt-6 block text-center border border-amber-500 text-amber-700 hover:bg-amber-50 font-semibold py-2.5 rounded-xl text-sm transition-colors"
                >
                  Ver Reserva dos Pássaros 2
                </Link>
              </div>

              {/* Apartamentos */}
              <div className="bg-white rounded-2xl border border-emerald-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Apartamento em condomínio</h3>
                    <p className="text-xs text-slate-500">Solar Manilha, Prime Club, Flores de Maio</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {[
                    'Lazer completo com piscina e academia',
                    'Segurança com portaria 24h e câmeras',
                    'Ticket médio de entrada geralmente menor',
                    'Manutenção do exterior por conta do condomínio',
                    'Varanda privativa (em alguns modelos)',
                    'Acesso ao subsídio integral do MCMV',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={scrollForm}
                  className="mt-6 block w-full text-center bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
                >
                  Simular um apartamento
                </button>
              </div>
            </div>

            <div className="mt-8 bg-slate-900 text-white rounded-2xl p-6 text-center">
              <Star className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <p className="font-semibold mb-1">Não sabe qual escolher?</p>
              <p className="text-slate-300 text-sm mb-4">
                Joel Marcos (CRECI 39.583F) analisa seu perfil e indica a melhor opção sem custo.
              </p>
              <button
                onClick={scrollForm}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors"
              >
                Falar com o corretor <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            COMO FUNCIONA O MCMV — Bloco informativo
        ════════════════════════════════════════════════════════════════════ */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-5">
                O que é o Minha Casa Minha Vida?
              </h2>
              <p className="text-slate-700 mb-4 leading-relaxed">
                O Minha Casa Minha Vida (MCMV) é o maior programa habitacional do Brasil, criado pelo Governo Federal em parceria com a Caixa Econômica Federal. Ele oferece condições facilitadas — taxas de juros menores e subsídios — para ajudar famílias a conquistarem a casa própria.
              </p>
              <h3 className="text-xl font-bold text-slate-900 mb-4 mt-7">
                Quem pode participar em Itaboraí?
              </h3>
              <ul className="space-y-3">
                {[
                  'Famílias com renda mensal bruta de até R$ 13.000 (Faixas 1, 2, 3 e faixa ampliada).',
                  'Brasileiros ou naturalizados maiores de 18 anos.',
                  'Pessoas que não possuem imóvel próprio no nome.',
                  'CLT, autônomos e MEIs podem participar com comprovação de renda.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 p-7 rounded-2xl border border-slate-200">
              <h2 className="text-xl font-bold text-slate-900 mb-5">
                Financiamento, FGTS e subsídio
              </h2>
              <p className="text-slate-700 mb-4 leading-relaxed">
                O financiamento pode chegar a até 35 anos (420 meses). Você pode usar o saldo do <strong>FGTS</strong> para abater a entrada ou reduzir as parcelas mensais.
              </p>
              <p className="text-slate-700 mb-4 leading-relaxed">
                Famílias com renda de até R$ 5.000 ainda contam com o <strong>subsídio</strong> — um desconto de até R$ 55 mil que não precisa ser devolvido.
              </p>
              <div className="flex flex-col gap-2 mt-4">
                <Link
                  to="/financiamento-minha-casa-minha-vida"
                  className="text-emerald-700 font-semibold hover:underline text-sm flex items-center gap-1"
                >
                  <ArrowRight className="w-4 h-4" /> Guia completo sobre financiamento e FGTS
                </Link>
                <Link
                  to="/subsidio-minha-casa-minha-vida"
                  className="text-emerald-700 font-semibold hover:underline text-sm flex items-center gap-1"
                >
                  <ArrowRight className="w-4 h-4" /> Quanto de subsídio você recebe em 2026
                </Link>
                <Link
                  to="/renda-minha-casa-minha-vida"
                  className="text-emerald-700 font-semibold hover:underline text-sm flex items-center gap-1"
                >
                  <ArrowRight className="w-4 h-4" /> Faixas de renda do MCMV 2026
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            LINKS INFORMATIVOS — Grade de tópicos
        ════════════════════════════════════════════════════════════════════ */}
        <section className="py-12 bg-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">
              Saiba mais sobre o programa
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  to: '/renda-minha-casa-minha-vida',
                  titulo: 'Faixas de Renda',
                  desc: 'Descubra sua faixa de renda e os limites de aprovação para Itaboraí.',
                },
                {
                  to: '/subsidio-minha-casa-minha-vida',
                  titulo: 'Subsídio MCMV',
                  desc: 'Entenda como conseguir até R$ 55 mil de desconto na compra.',
                },
                {
                  to: '/fgts-minha-casa-minha-vida',
                  titulo: 'Uso do FGTS',
                  desc: 'Saiba como abater a entrada usando o saldo do Fundo de Garantia.',
                },
                {
                  to: '/documentos-minha-casa-minha-vida',
                  titulo: 'Documentos',
                  desc: 'Veja o que separar para aprovar o crédito imobiliário na Caixa.',
                },
              ].map(({ to, titulo, desc }) => (
                <Link
                  key={to}
                  to={to}
                  className="bg-white p-5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all block"
                >
                  <h3 className="font-bold text-slate-900 mb-1.5">{titulo}</h3>
                  <p className="text-sm text-slate-600">{desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            FAQ
        ════════════════════════════════════════════════════════════════════ */}
        <section className="py-16 bg-white" aria-labelledby="faq-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              id="faq-heading"
              className="text-3xl font-bold text-slate-900 mb-10 text-center"
            >
              Dúvidas frequentes
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: 'Quais imóveis estão disponíveis em Itaboraí?',
                  a: 'Em 2026 trabalhamos com Solar Manilha (apartamentos em Manilha), Reserva dos Pássaros 2 (casas 100% independentes em Retiro São Joaquim), Prime Club Itaboraí (apartamentos 2 quartos com lazer completo) e Flores de Maio (apartamentos com varanda em Santo Expedito). Consulte disponibilidade e condições com o corretor.',
                },
                {
                  q: 'Qual a diferença entre comprar uma casa ou apartamento pelo MCMV em Itaboraí?',
                  a: 'As casas (como o Reserva dos Pássaros 2) oferecem quintal privativo, sem vizinhos nas laterais e lotes a partir de 150 m². Os apartamentos costumam ter custo de entrada menor, lazer compartilhado completo e portaria 24h. Ambos podem ser financiados pelo MCMV com subsídio de até R$ 55 mil.',
                },
                {
                  q: 'Qual a renda necessária para comprar imóvel pelo MCMV em Itaboraí?',
                  a: 'O programa atende famílias com renda bruta de até R$ 13.000 mensais. Famílias com renda de até R$ 5.000 (Faixas 1 e 2) podem receber subsídio de até R$ 55 mil. É permitida a composição de renda com cônjuge, familiares ou parceiros.',
                },
                {
                  q: 'Quais documentos são necessários?',
                  a: 'Geralmente: RG, CPF, Certidão de Nascimento ou Casamento, Comprovante de Residência recente, Carteira de Trabalho, Extrato do FGTS e últimos 3 contracheques. Para autônomos: extratos bancários dos últimos 6 meses.',
                },
                {
                  q: 'Como funciona a entrada?',
                  a: 'A entrada varia conforme o empreendimento, o subsídio aprovado e a análise de crédito da Caixa. Em muitos lançamentos a entrada pode ser parcelada diretamente com a construtora durante a obra. O saldo do FGTS também pode ser usado na entrada.',
                  nota: '* Valores e condições podem variar conforme análise de crédito, empreendimento e regras vigentes.',
                },
              ].map(({ q, a, nota }) => (
                <div key={q} className="border-b border-slate-100 pb-6 last:border-0">
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{q}</h3>
                  <p className="text-slate-600 leading-relaxed">{a}</p>
                  {nota && <p className="text-xs text-slate-400 mt-2">{nota}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            FORMULÁRIO DE CAPTAÇÃO — CTA final
        ════════════════════════════════════════════════════════════════════ */}
        <section
          className="py-16 bg-slate-100 border-t border-slate-200"
          id="simulacao"
          aria-label="Simulação gratuita"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <Shield className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">
                Receba as melhores opções em Itaboraí
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Simulação 100% gratuita e sem compromisso. Joel Marcos (CRECI 39.583F) analisa seu perfil e envia as opções direto no seu WhatsApp.
              </p>
            </div>
            <div className="max-w-xl mx-auto shadow-xl rounded-2xl overflow-hidden">
              <LeadForm
                confirmarGravacao
                pagina={SLUG}
                empreendimento="MCMV Itaboraí — CTA final"
                formId={`${FORM_ID}-final`}
                ctaTexto="Quero receber as opções →"
              />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════════
            AUTHOR PROFILE
        ════════════════════════════════════════════════════════════════════ */}
        <section className="py-12 bg-slate-50 border-t border-slate-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <AuthorProfile />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
