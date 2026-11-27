/**
 * Landing page — Solar Manilha
 * URL canônica: https://queromeumcmv.com.br/solar-manilha-itaborai
 * Incorporadora: Grupo Natus (CNPJ 24.353.357/0001-11)
 * Fonte: https://www.natusgrupo.com.br/empreendimentos/solar-manilha (27/11/2026)
 * Autor: Market Local Digital · Joel Marcos · CRECI 39.583F
 *
 * PREÇO: não divulgado — omitido da página e dos metadados conforme instrução.
 */

import { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import {
  SOLAR_MANILHA_AVISO_PRECO,
  SOLAR_MANILHA_DATA_CONFERENCIA,
  SOLAR_MANILHA_LAZER,
  SOLAR_MANILHA_NUMS,
  FAQ_SOLAR_MANILHA,
} from '../data/solarManilha';
import {
  MapPin,
  CheckCircle2,
  Home,
  Shield,
  Trees,
  Bike,
  Baby,
  Dumbbell,
  Waves,
  Car,
  Building2,
  Star,
  MessageCircle,
  ChevronRight,
} from 'lucide-react';

// ─── Constantes de SEO / rastreamento ───────────────────────────────────────
const SLUG = '/solar-manilha-itaborai';
const CANONICAL = `https://queromeumcmv.com.br${SLUG}`;
const EMPREENDIMENTO = 'Solar Manilha — Manilha, Itaboraí';
const FORM_ID = 'lead_solar_manilha';
const PAGINA_SLUG = 'solar-manilha-itaborai';

// Imagens: serão substituídas pelas fotos oficiais do Grupo Natus quando disponíveis.
// Para fazer o download, acesse: https://www.natusgrupo.com.br/empreendimentos/solar-manilha
// e salve os arquivos listados abaixo em /public/ com os nomes indicados.
const IMG_HERO      = '/solar-manilha-acesso-principal.webp';
const IMG_PISCINA   = '/solar-manilha-piscinas.webp';
const IMG_LAZER     = '/solar-manilha-quadras.webp';
const IMG_GARDEN    = '/solar-manilha-garden.webp';
const IMG_INTERIOR  = '/solar-manilha-sala-de-estar.webp';
const IMG_OG        = '/capa-site-quero-meu-mcmv-open-graph.webp'; // placeholder até fachada oficial

// Fallback para imagens ainda não baixadas (exibe placeholder neutro)
const imgSafe = (src: string, alt: string, cls = '') => (
  <img
    src={src}
    alt={alt}
    className={cls}
    onError={(e) => {
      (e.currentTarget as HTMLImageElement).src = '/capa-site-quero-meu-mcmv-open-graph.webp';
    }}
  />
);

// ─── Ícone pelo slug ─────────────────────────────────────────────────────────
const LazerIcon = ({ slug }: { slug: string }) => {
  const cls = 'w-6 h-6 text-amber-400';
  switch (slug) {
    case 'waves':     return <Waves className={cls} />;
    case 'volleyball':return <Star className={cls} />;
    case 'baby':      return <Baby className={cls} />;
    case 'party':     return <Home className={cls} />;
    case 'dumbbell':  return <Dumbbell className={cls} />;
    case 'bike':      return <Bike className={cls} />;
    case 'hammock':   return <Trees className={cls} />;
    case 'paw':       return <Shield className={cls} />;
    default:          return <CheckCircle2 className={cls} />;
  }
};

// ─── JSON-LD ─────────────────────────────────────────────────────────────────
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ApartmentComplex',
      '@id': `${CANONICAL}#empreendimento`,
      name: 'Solar Manilha',
      description:
        'Condomínio residencial Minha Casa Minha Vida em Manilha, Itaboraí-RJ. 23 blocos, 368 apartamentos de 2 quartos, opção de unidades garden, lazer de clube e 275 vagas de garagem.',
      url: CANONICAL,
      numberOfRooms: 2,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'R. Carlota Maria do Amor Divino, Loteamento Santo Antônio',
        addressLocality: 'Itaboraí',
        addressRegion: 'RJ',
        postalCode: '24856-500',
        addressCountry: 'BR',
        neighborhood: 'Manilha',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -22.767126,
        longitude: -42.918125,
      },
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Piscinas com quiosques', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Quadras esportivas', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Espaço infantil', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Salão de festas interno e externo', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Academia ao ar livre', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Bicicletário', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Redário', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Pet place', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Portaria 24h', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Vagas de garagem', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Unidades com garden', value: true },
      ],
      numberOfUnitsTotal: 368,
      containsPlace: { '@type': 'Accommodation', numberOfRooms: 2 },
      developer: {
        '@type': 'Organization',
        name: 'Grupo Natus',
        identifier: '24.353.357/0001-11',
      },
      agent: {
        '@type': 'RealEstateAgent',
        name: 'Joel Marcos',
        identifier: 'CRECI 39.583F',
        url: 'https://queromeumcmv.com.br',
        telephone: '+55-21-96592-8399',
        areaServed: { '@type': 'City', name: 'Itaboraí', containedInPlace: { '@type': 'State', name: 'Rio de Janeiro' } },
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${CANONICAL}#faq`,
      mainEntity: FAQ_SOLAR_MANILHA.map((f) => ({
        '@type': 'Question',
        name: f.pergunta,
        acceptedAnswer: { '@type': 'Answer', text: f.resposta },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://queromeumcmv.com.br/' },
        { '@type': 'ListItem', position: 2, name: 'MCMV Itaboraí', item: 'https://queromeumcmv.com.br/minha-casa-minha-vida-itaborai' },
        { '@type': 'ListItem', position: 3, name: 'Solar Manilha', item: CANONICAL },
      ],
    },
  ],
};

// ─── Componente ───────────────────────────────────────────────────────────────
export default function SolarManilha() {
  const formRef = useRef<HTMLDivElement>(null);
  const scrollForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-amber-500 selection:text-white">
      <Helmet>
        {/* SEO On-page */}
        <title>Solar Manilha Itaboraí | Apartamentos 2 Quartos MCMV em Manilha</title>
        <meta
          name="description"
          content="Solar Manilha em Manilha, Itaboraí-RJ: condomínio fechado com 368 aptos 2 quartos, opção garden, lazer de clube, portaria 24h e subsídio Minha Casa Minha Vida. Consulte disponibilidade."
        />
        <link rel="canonical" href={CANONICAL} />
        <meta name="author" content="Market Local Digital" />
        <meta name="robots" content="index,follow" />

        {/* Geo */}
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="Itaboraí" />
        <meta name="geo.position" content="-22.767126;-42.918125" />
        <meta name="ICBM" content="-22.767126, -42.918125" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:site_name" content="Quero Meu MCMV" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:title" content="Solar Manilha Itaboraí | Apartamentos 2 Quartos MCMV em Manilha" />
        <meta
          property="og:description"
          content="Solar Manilha em Manilha, Itaboraí-RJ: condomínio fechado com 368 aptos 2 quartos, opção garden, lazer de clube e subsídio MCMV. Consulte disponibilidade."
        />
        <meta property="og:image" content={`https://queromeumcmv.com.br${IMG_OG}`} />
        <meta property="og:image:alt" content="Solar Manilha — condomínio MCMV em Manilha, Itaboraí RJ" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="fb:app_id" content="966242223397117" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Solar Manilha Itaboraí | Apartamentos 2 Quartos MCMV" />
        <meta
          name="twitter:description"
          content="Condomínio fechado em Manilha, Itaboraí: 2 quartos, garden, lazer de clube e subsídio MCMV. Consulte disponibilidade."
        />
        <meta name="twitter:image" content={`https://queromeumcmv.com.br${IMG_OG}`} />

        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Header />

      <main>
        {/* ── 1ª DOBRA: Hero + Formulário ─────────────────────────────────── */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
          {/* Imagem de fundo */}
          <div className="absolute inset-0 z-0">
            <img
              src={IMG_HERO}
              alt="Vista aérea do Solar Manilha em Manilha, Itaboraí — condomínio Minha Casa Minha Vida"
              className="w-full h-full object-cover"
              width={1920}
              height={1080}
              fetchPriority="high"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/capa-site-quero-meu-mcmv-open-graph.webp'; }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-900/85 to-slate-900/60" />
          </div>

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
            <div className="grid lg:grid-cols-[1fr_400px] gap-10 items-start">

              {/* Col esquerda — headline + benefícios */}
              <div className="text-white space-y-6">
                {/* Badge localização */}
                <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full">
                  <MapPin className="w-3.5 h-3.5" />
                  Manilha, Itaboraí · Minha Casa Minha Vida
                </div>

                {/* H1 */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.12] text-white drop-shadow">
                  Solar Manilha:<br />
                  <span className="text-amber-300">Condomínio Clube</span> com<br />
                  Subsídio do Governo Federal
                </h1>

                <p className="text-lg sm:text-xl text-slate-200 leading-relaxed max-w-xl">
                  Apartamentos de <strong className="text-white">2 quartos</strong> em condomínio fechado com lazer de clube, portaria 24h e opção de <strong className="text-amber-300">unidades com garden</strong>. Financiamento Caixa com subsídio de até R$&nbsp;55 mil para famílias elegíveis.
                </p>

                {/* Números do empreendimento */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {SOLAR_MANILHA_NUMS.map((n) => (
                    <div key={n.label} className="bg-white/10 border border-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                      <span className="block text-2xl font-black text-amber-300">{n.valor}</span>
                      <span className="block text-xs font-bold text-slate-200 leading-tight">{n.label}</span>
                      <span className="block text-[10px] text-slate-400">{n.sub}</span>
                    </div>
                  ))}
                </div>

                {/* Bullets diferenciais */}
                <div className="grid sm:grid-cols-2 gap-2">
                  {[
                    '2 quartos com opção de garden exclusivo',
                    'Condomínio fechado — portaria 24h',
                    'Lazer de clube: piscina, quadra, academia',
                    'Subsídio MCMV + uso do FGTS na entrada',
                    'Área verde integrada ao projeto',
                    '275 vagas de garagem para moradores',
                  ].map((txt) => (
                    <div key={txt} className="flex items-start gap-2 text-sm text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      {txt}
                    </div>
                  ))}
                </div>

                {/* Aviso preço */}
                <p className="text-[11px] text-slate-400 italic border-t border-white/10 pt-3">
                  {SOLAR_MANILHA_AVISO_PRECO} Dados conferidos em {SOLAR_MANILHA_DATA_CONFERENCIA}.
                </p>
              </div>

              {/* Col direita — formulário */}
              <div ref={formRef} id="formulario" className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-slate-900 px-5 py-4 text-white text-center">
                  <p className="text-xs font-bold tracking-widest uppercase text-amber-400 mb-1">Solar Manilha · Itaboraí</p>
                  <h2 className="text-lg font-black">Receba as plantas e consulte as unidades</h2>
                  <p className="text-xs text-slate-300 mt-1">Preenchimento rápido · Resposta em até 1h útil</p>
                </div>
                <div className="p-1">
                  <LeadForm
                    confirmarGravacao
                    empreendimento={EMPREENDIMENTO}
                    formName={FORM_ID}
                    textoBotao="Quero consultar as unidades →"
                    cidadeFixa="Itaboraí - RJ"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── BREADCRUMB ───────────────────────────────────────────────────── */}
        <nav aria-label="Localização na página" className="bg-slate-100 border-b border-slate-200 py-2 px-4 text-xs text-slate-500">
          <ol className="container mx-auto flex flex-wrap items-center gap-1">
            <li><Link to="/" className="hover:text-amber-600 transition-colors">Início</Link></li>
            <li><ChevronRight className="w-3 h-3" /></li>
            <li><Link to="/minha-casa-minha-vida-itaborai" className="hover:text-amber-600 transition-colors">MCMV Itaboraí</Link></li>
            <li><ChevronRight className="w-3 h-3" /></li>
            <li className="text-slate-800 font-semibold" aria-current="page">Solar Manilha</li>
          </ol>
        </nav>

        {/* ── SOBRE O EMPREENDIMENTO ───────────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block text-xs font-bold tracking-widest uppercase text-amber-600 mb-3">
                  Grupo Natus · Lançamento 2026
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-5 leading-tight">
                  Condomínio fechado com área verde e lazer de clube em Manilha
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  O <strong>Solar Manilha</strong> é um projeto do <strong>Grupo Natus</strong> pensado para famílias que buscam qualidade de vida, segurança e um lar que cresce junto com elas. Com <strong>23 blocos de 4 pavimentos</strong> e <strong>368 unidades</strong>, o empreendimento combina a escala de um condomínio-clube com a intimidade de um bairro planejado — cercado por área verde em Manilha, Itaboraí.
                </p>
                <p className="text-base text-slate-600 leading-relaxed mb-6">
                  Os apartamentos de <strong>2 quartos</strong> foram projetados para aproveitar cada metro com funcionalidade — cozinha integrada, home office e áreas bem dimensionadas. As unidades <strong>garden</strong> do térreo oferecem espaço externo privativo: jardim próprio, independência para crianças e pets e convívio ao ar livre.
                </p>
                <ul className="space-y-3">
                  {[
                    { icon: <Building2 className="w-5 h-5 text-amber-500" />, txt: '23 blocos com 4 pavimentos · 368 apartamentos de 2 quartos' },
                    { icon: <Home className="w-5 h-5 text-amber-500" />, txt: 'Opção de unidades com garden privativo no térreo' },
                    { icon: <Car className="w-5 h-5 text-amber-500" />, txt: '275 vagas de carro + 23 vagas de moto' },
                    { icon: <Shield className="w-5 h-5 text-amber-500" />, txt: 'Portaria e controle de acesso 24 horas' },
                    { icon: <Trees className="w-5 h-5 text-amber-500" />, txt: 'Área verde integrada ao projeto paisagístico' },
                  ].map(({ icon, txt }) => (
                    <li key={txt} className="flex items-start gap-3 text-slate-700">
                      <span className="shrink-0 mt-0.5">{icon}</span>
                      {txt}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl aspect-video lg:aspect-[4/3]">
                {imgSafe(IMG_PISCINA, 'Piscinas do Solar Manilha em Manilha, Itaboraí', 'w-full h-full object-cover')}
              </div>
            </div>
          </div>
        </section>

        {/* ── LAZER ───────────────────────────────────────────────────────── */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-amber-400 mb-3">Área de Clube</span>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                Lazer de resort sem sair do condomínio
              </h2>
              <p className="text-slate-300 text-lg">
                Mais de 8 itens de lazer para toda a família desfrutar todos os dias — do playground para as crianças ao pet place e redário para os adultos descansarem.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
              {SOLAR_MANILHA_LAZER.map((item) => (
                <div key={item.titulo} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center mb-4">
                    <LazerIcon slug={item.icon} />
                  </div>
                  <h3 className="font-bold text-white mb-1 text-sm">{item.titulo}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Galeria 2 imagens */}
            <div className="grid md:grid-cols-2 gap-5">
              <div className="rounded-2xl overflow-hidden aspect-video shadow-lg">
                {imgSafe(IMG_LAZER, 'Quadras esportivas do Solar Manilha, Itaboraí', 'w-full h-full object-cover')}
              </div>
              <div className="rounded-2xl overflow-hidden aspect-video shadow-lg">
                {imgSafe(IMG_GARDEN, 'Unidade garden do Solar Manilha com espaço externo privativo', 'w-full h-full object-cover')}
              </div>
            </div>
          </div>
        </section>

        {/* ── GARDEN ──────────────────────────────────────────────────────── */}
        <section className="py-20 bg-amber-50 border-y border-amber-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="rounded-2xl overflow-hidden shadow-xl aspect-video">
                {imgSafe(IMG_INTERIOR, 'Interior de apartamento Solar Manilha — sala de estar integrada', 'w-full h-full object-cover')}
              </div>
              <div>
                <span className="inline-block text-xs font-bold tracking-widest uppercase text-amber-700 mb-3">Diferenciais do projeto</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-5 leading-tight">
                  Apartamento ou garden: escolha o espaço que a sua família precisa
                </h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Os apartamentos-tipo têm layout funcional com sala integrada, home office, 2 dormitórios e área de serviço. Para quem quer mais espaço ao ar livre, as <strong>unidades garden</strong> oferecem área externa privativa — ideal para criar filhos com liberdade ou receber amigos sem dividir espaço com o condomínio.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { titulo: 'Sala integrada', desc: 'Layout aberto que amplifica a sensação de espaço e facilita a convivência.' },
                    { titulo: 'Home office', desc: 'Espaço dedicado ao trabalho remoto — sem improvisação.' },
                    { titulo: 'Garden privativo', desc: 'Área externa exclusiva para as unidades do térreo — disponibilidade a consultar.' },
                    { titulo: 'Cozinha funcional', desc: 'Espaço dimensionado para o dia a dia com bancada e integração à área de serviço.' },
                  ].map((item) => (
                    <div key={item.titulo} className="bg-white rounded-xl p-4 border border-amber-200 shadow-sm">
                      <h3 className="font-bold text-slate-900 mb-1 text-sm">{item.titulo}</h3>
                      <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── LOCALIZAÇÃO ─────────────────────────────────────────────────── */}
        <section className="py-20 bg-slate-800 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block text-xs font-bold tracking-widest uppercase text-amber-400 mb-3">Localização</span>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-5 leading-tight">
                  Manilha, Itaboraí: infraestrutura completa e fácil acesso à região metropolitana
                </h2>
                <p className="text-slate-300 leading-relaxed mb-8">
                  O Solar Manilha está no <strong className="text-white">Loteamento Santo Antônio, Manilha</strong> — bairro consolidado de Itaboraí com supermercados, escolas, farmácias, comércio e serviços de saúde. A poucos minutos da <strong className="text-amber-300">BR-493 (Arco Metropolitano)</strong> e da <strong className="text-amber-300">RJ-116</strong>, com acesso direto a Niterói, São Gonçalo e Guapimirim.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Acesso rápido ao Arco Metropolitano (BR-493)',
                    'Próximo à RJ-116 — conexão com São Gonçalo e Niterói',
                    'Comércio, escolas e saúde a poucos minutos',
                    'Região em valorização com o crescimento de Itaboraí',
                    'Ambiente tranquilo, integrado à natureza',
                  ].map((txt) => (
                    <li key={txt} className="flex items-start gap-3 text-slate-200 text-sm">
                      <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      {txt}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-slate-400 italic">
                  Endereço: R. Carlota Maria do Amor Divino, Loteamento Santo Antônio, Manilha, Itaboraí-RJ · CEP 24856-500
                </p>
              </div>

              {/* Mapa embed */}
              <div className="rounded-2xl overflow-hidden shadow-xl aspect-video bg-slate-700">
                <iframe
                  title="Localização do Solar Manilha em Manilha, Itaboraí RJ"
                  src="https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFmBWY&q=-22.767126,-42.918125&zoom=15&language=pt-BR"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── MCMV / FINANCIAMENTO ─────────────────────────────────────────── */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-amber-600 mb-3">Minha Casa Minha Vida</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                Transforme o aluguel na parcela do seu apartamento
              </h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                O Solar Manilha é enquadrado no MCMV. Dependendo da sua renda, você tem acesso a subsídio do governo federal, taxas de juros menores que o mercado e possibilidade de usar o FGTS na entrada.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  titulo: 'Subsídio de até R$ 55 mil',
                  desc: 'Redução direta no valor do imóvel para famílias com renda elegível ao programa. Sem devolução — é um benefício do governo.',
                  icon: <Star className="w-7 h-7 text-amber-500" />,
                },
                {
                  titulo: 'FGTS na entrada',
                  desc: 'Use o saldo do seu Fundo de Garantia para reduzir a entrada ou abater nas parcelas. Válido para quem tem 3+ anos de carteira assinada.',
                  icon: <CheckCircle2 className="w-7 h-7 text-amber-500" />,
                },
                {
                  titulo: 'Financiamento Caixa',
                  desc: 'Taxas abaixo do mercado com garantia da Caixa Econômica Federal. Prazo de pagamento de até 35 anos para caber no bolso.',
                  icon: <Shield className="w-7 h-7 text-amber-500" />,
                },
              ].map((card) => (
                <div key={card.titulo} className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">{card.icon}</div>
                  <h3 className="font-bold text-slate-900 mb-2">{card.titulo}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-slate-400 mt-8 italic">{SOLAR_MANILHA_AVISO_PRECO}</p>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                Dúvidas sobre o Solar Manilha
              </h2>
              <p className="text-slate-600">Respostas diretas para quem está pesquisando apartamento em Itaboraí pelo MCMV.</p>
            </div>
            <div className="space-y-5">
              {FAQ_SOLAR_MANILHA.map((faq) => (
                <div key={faq.pergunta} className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-slate-900 mb-3 text-base">{faq.pergunta}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">{faq.resposta}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AUTOR / CRECI ─────────────────────────────────────────────────── */}
        <section className="py-12 bg-white border-y border-slate-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-2xl font-black text-amber-700">
                JM
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900">Joel Marcos · Corretor de Imóveis</p>
                <p className="text-sm text-slate-500">CRECI 39.583F · Market Local Digital · Especialista MCMV em Itaboraí há mais de 20 anos</p>
                <p className="text-xs text-slate-400 mt-1">
                  Dados comerciais conferidos em {SOLAR_MANILHA_DATA_CONFERENCIA} a partir da página oficial do Grupo Natus
                  (<a href="https://www.natusgrupo.com.br/empreendimentos/solar-manilha" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-600">natusgrupo.com.br</a>).
                  Metragens, preço e prazo de entrega sujeitos a confirmação pelo corretor.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ────────────────────────────────────────────────────── */}
        <section className="relative py-20 overflow-hidden">
          <img
            src={IMG_HERO}
            alt="Solar Manilha — condomínio fechado em Manilha, Itaboraí"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/capa-site-quero-meu-mcmv-open-graph.webp'; }}
          />
          <div className="absolute inset-0 bg-slate-900/82" />
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl text-white">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Pronto para sair do aluguel?
            </h2>
            <p className="text-lg text-slate-200 mb-8 leading-relaxed">
              O Solar Manilha está em lançamento. Fale agora com Joel Marcos e descubra se você tem direito ao subsídio — sem compromisso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={scrollForm}
                className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-black py-4 px-10 rounded-xl text-lg transition shadow-lg shadow-amber-900/40"
              >
                Quero consultar as unidades →
              </button>
              <a
                href="https://wa.me/5521965928399?text=Ol%C3%A1%2C%20Joel!%20Tenho%20interesse%20no%20Solar%20Manilha%20em%20Manilha%2C%20Itabora%C3%AD.%20Pode%20me%20ajudar%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-10 rounded-xl text-lg transition shadow-lg shadow-green-900/30 inline-flex items-center gap-2 justify-center"
              >
                <MessageCircle className="w-5 h-5" />
                Chamar no WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
