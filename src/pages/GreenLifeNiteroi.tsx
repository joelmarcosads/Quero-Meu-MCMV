import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import { GL_AVISO_PRECO, GL_DATA_CONFERENCIA, FAQ_GL } from '../data/greenLife';
import {
  MapPin,
  CheckCircle2,
  ChevronRight,
  X,
  Waves,
  Award,
  Users,
  Home,
  ShieldCheck,
  Building2,
  Bike,
  Leaf,
  Zap,
  Star,
  Flame,
  Trees,
  Timer,
} from 'lucide-react';

// ─── Landing: Green Life (Novolar/Grupo Patrimar) — Av. Washington Luiz, 1, Centro, Niterói ───
// Head (title/description/canonical/OG) e JSON-LD são gerados no build a partir de
// src/seo/routes.ts (rota /green-life-niteroi). O Helmet abaixo repete os dados para
// navegação interna (SPA). Fonte dos dados: book oficial (ver src/data/greenLife.ts).

const SLUG = '/green-life-niteroi';
const URL_PAGINA = `https://queromeumcmv.com.br${SLUG}`;
const EMPREENDIMENTO = 'Green Life — Centro de Niterói';
const TITLE = 'Green Life Niterói | A partir de R$ 350 mil | Centro';
const DESCRIPTION =
  'Green Life da Novolar no Centro de Niterói: 2 quartos, suíte e varanda, lazer com mais de 30 itens e rooftop gourmet. A partir de R$ 350 mil. Entregas jul/2027 e ago/2028.';
const PRECO = 'R$ 350.000';
const FORM = 'lead_green_life';

const img = (nome: string) => `/green-life-niteroi-${nome}.webp`;

type Foto = { src: string; alt: string; label: string; w: number; h: number };
const f = (nome: string, label: string, alt: string, w = 900, h = 1200): Foto => ({ src: img(nome), label, alt, w, h });

const FOTOS_LAZER: Foto[] = [
  f('piscina', 'Piscina adulto', 'Piscina adulto do Green Life Niterói com área de lazer', 900, 506),
  f('rooftop', 'Rooftop gourmet', 'Espaço gourmet rooftop do Green Life com churrasqueira e forno de pizza', 900, 506),
  f('academia', 'Academia completa', 'Academia equipada do Green Life Niterói', 900, 506),
  f('apartamento', 'Ambientes internos', 'Sala integrada e cozinha do apartamento Green Life Niterói', 900, 506),
];

type Planta = { id: string; label: string; src: string; area: string; desc: string; w: number; h: number };
const PLANTAS: Planta[] = [
  {
    id: '2q', label: '2 Quartos', src: '/green-life-niteroi-planta-2-quartos.webp',
    area: '48 m²', desc: 'Sala integrada, 2 quartos, banheiro, varanda, cozinha e área de serviço com janela.',
    w: 800, h: 1067,
  },
  {
    id: '2qs', label: '2 Quartos com Suíte', src: '/green-life-niteroi-planta-2-quartos-suite.webp',
    area: '49 m²', desc: 'Sala integrada, suíte, quarto, 2 banheiros, varanda, cozinha e área de serviço com janela.',
    w: 800, h: 1067,
  },
  {
    id: 'garden', label: 'Garden 2 Quartos', src: '/green-life-niteroi-planta-garden.webp',
    area: '60 m²', desc: 'Térreo privativo com terraço descoberto, sala integrada, 2 quartos e área de serviço.',
    w: 800, h: 1067,
  },
];

const LAZER_ITEMS = [
  'Piscina adulto', 'Piscina infantil', 'Piscina com raia de 25 m', 'Prainha', 'Gazebos',
  'Sauna e descanso', 'Churrasqueira', 'Espaço gourmet rooftop', 'Salão de festas', 'Playground',
  'Espaço kids', 'Espaço games', 'Quadra recreativa', 'Quadra de areia', 'Academia',
  'Crossfit zone', 'Pet place', 'Praça das Jabuticabeiras', 'Espaço luau', 'Pista de caminhada',
];

const COMODIDADES = [
  'Bicicletário + bicicletas compartilhadas',
  'Car app point (ponto para carros por app)',
  'Coworking',
  'Espaço delivery',
  'Aplicativo Novolar Conecta',
  'Wi-Fi nas áreas comuns',
];

const SUSTENTABILIDADE = [
  { icon: <Zap size={20} />, texto: 'Placas fotovoltaicas nas áreas comuns' },
  { icon: <Leaf size={20} />, texto: 'Estação de recarga para carro elétrico' },
  { icon: <Waves size={20} />, texto: 'Reuso de águas pluviais e cinzas' },
  { icon: <Home size={20} />, texto: 'Medição individualizada de água e gás' },
  { icon: <ShieldCheck size={20} />, texto: 'Iluminação LED com sensor de presença' },
  { icon: <Bike size={20} />, texto: 'Bicicletas compartilhadas no condomínio' },
];

const DIFERENCIAIS_APT = [
  'Todas as unidades com varanda',
  'Sala de jantar e estar integradas',
  'Opção de unidades com suíte',
  'Piso em laminado de madeira nos quartos',
  'Piso em cerâmica na cozinha, banheiros e varanda',
  'Previsão para ar-condicionado nos quartos',
  'Área de serviço entregue com janela',
  'Vaso sanitário com sistema dual flux',
  'Torneiras com economizadores',
];

export default function GreenLifeNiteroi() {
  const formRef = useRef<HTMLDivElement>(null);
  const [plantaAtiva, setPlantaAtiva] = useState<string>('2q');
  const [modalFoto, setModalFoto] = useState<Foto | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const scrollForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setModalFoto(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const plantaSel = PLANTAS.find(p => p.id === plantaAtiva) ?? PLANTAS[0];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Apartment',
        name: 'Green Life',
        description: DESCRIPTION,
        url: URL_PAGINA,
        image: `https://queromeumcmv.com.br/green-life-niteroi-fachada.webp`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Av. Washington Luiz, 1',
          addressLocality: 'Niterói',
          addressRegion: 'RJ',
          postalCode: '24020-421',
          addressCountry: 'BR',
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'BRL',
          price: '350000',
          availability: 'https://schema.org/InStock',
          seller: { '@type': 'RealEstateAgent', name: 'Joel Marcos', telephone: '+55-21-97019-6446' },
        },
        numberOfRooms: 2,
        floorSize: { '@type': 'QuantitativeValue', value: 48, unitCode: 'MTK' },
      },
      {
        '@type': 'RealEstateAgent',
        name: 'Joel Marcos',
        url: 'https://queromeumcmv.com.br',
        telephone: '+55-21-97019-6446',
        areaServed: ['Niterói', 'São Gonçalo', 'Itaboraí'],
        hasCredential: 'CRECI 39.583F',
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_GL.map(faq => ({
          '@type': 'Question',
          name: faq.pergunta,
          acceptedAnswer: { '@type': 'Answer', text: faq.resposta },
        })),
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href={URL_PAGINA} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={URL_PAGINA} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content="https://queromeumcmv.com.br/green-life-niteroi-og.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="pt_BR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="author" content="Market Local Digital" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Header />

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 lg:py-8 grid lg:grid-cols-2 gap-6 items-start">

          {/* Col esquerda */}
          <div className="flex flex-col gap-4">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded-full">
                <Trees size={13} /> Natureza no Centro de Niterói
              </span>
              <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                <Timer size={13} /> Entregas Jul/2027 e Ago/2028
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              Viva no coração de Niterói com<br className="hidden sm:block" /> natureza, lazer e conforto
            </h1>
            <p className="text-gray-600 text-base leading-relaxed">
              O <strong>Green Life</strong>, da Novolar/Grupo Patrimar, traz apartamentos de 2 quartos com suíte e varanda, mais de 30 itens de lazer e rooftop gourmet com vista para a cidade — tudo na <strong>Av. Washington Luiz, 1, no Centro de Niterói</strong>.
            </p>

            {/* Preço */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm text-gray-500 mb-0.5">A partir de</p>
              <p className="text-3xl font-bold text-green-700">{PRECO}<span className="text-base font-normal text-gray-500">*</span></p>
              <p className="text-xs text-gray-500 mt-1">{GL_AVISO_PRECO}</p>
            </div>

            {/* Pontos-chave */}
            <ul className="space-y-2">
              {[
                '2 quartos com suíte e varanda',
                'Mais de 30 itens de lazer — do térreo ao rooftop',
                'Rooftop gourmet com churrasqueira e forno de pizza',
                'Piscina com raia de 25 m + prainha',
                'Sustentabilidade: placas fotovoltaicas e recarga EV',
                'Bicicletas compartilhadas e aplicativo de condomínio',
                'A 4 min do Terminal Rodoviário de Niterói',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 size={16} className="text-green-600 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            {/* Fachada mobile */}
            <div className="lg:hidden rounded-xl overflow-hidden">
              <img
                src={img('fachada')}
                srcSet={`${img('fachada-800')} 800w, ${img('fachada')} 900w`}
                sizes="(max-width: 900px) 100vw, 900px"
                width={900} height={506}
                alt="Fachada do Green Life Niterói, da Novolar, na Av. Washington Luiz, Centro de Niterói"
                className="w-full h-auto max-h-72 object-cover object-center"
                loading="eager"
                fetchPriority="high"
              />
              <p className="text-xs text-center text-gray-400 mt-1 italic">Perspectiva ilustrativa.</p>
            </div>

            <button
              onClick={scrollForm}
              className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-xl transition text-base"
            >
              Quero consultar as unidades
            </button>
          </div>

          {/* Col direita: fachada desktop + formulário */}
          <div className="flex flex-col gap-4">
            <div className="hidden lg:block rounded-xl overflow-hidden">
              <img
                src={img('fachada')}
                srcSet={`${img('fachada-800')} 800w, ${img('fachada')} 900w`}
                sizes="900px"
                width={900} height={506}
                alt="Fachada do Green Life Niterói, da Novolar, na Av. Washington Luiz, Centro de Niterói"
                className="w-full max-h-80 object-cover object-center rounded-xl"
                loading="eager"
                fetchPriority="high"
              />
              <p className="text-xs text-center text-gray-400 mt-1 italic">Perspectiva ilustrativa.</p>
            </div>

            {/* Formulário hero */}
            <div ref={formRef} id="formulario" className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-1">Receba as plantas e consulte as unidades</h2>
              <p className="text-sm text-gray-500 mb-4">
                Preencha e o corretor entra em contato pelo WhatsApp.
              </p>
              <LeadForm
                confirmarGravacao
                pagina={SLUG}
                empreendimento={EMPREENDIMENTO}
                formId={FORM}
                ctaTexto="Quero consultar as unidades"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFÍCIOS ─────────────────────────────────────────────── */}
      <section className="bg-green-700 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-white text-2xl font-bold text-center mb-6">
            Um endereço que transforma sua rotina
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <MapPin size={22} />, titulo: 'Centro de Niterói', texto: 'Av. Washington Luiz, 1 — a 4 min do Terminal Rodoviário e perto do Praia Shopping.' },
              { icon: <Trees size={22} />, titulo: 'Natureza no condomínio', texto: 'Praça das Jabuticabeiras, paisagismo exuberante e rooftop verde com vista panorâmica.' },
              { icon: <Waves size={22} />, titulo: 'Lazer de clube', texto: 'Mais de 30 itens: piscinas, piscina com raia, gazebos, sauna, academia, crossfit e muito mais.' },
              { icon: <Flame size={22} />, titulo: 'Rooftop gourmet', texto: 'Churrasqueira e forno de pizza com uma das vistas mais bonitas que Niterói pode oferecer.' },
              { icon: <Leaf size={22} />, titulo: 'Sustentabilidade real', texto: 'Placas fotovoltaicas, recarga para carro elétrico e reuso de água incluídos no projeto.' },
              { icon: <Building2 size={22} />, titulo: 'Grupo Patrimar', texto: '+60 anos de história, +2,8 milhões de m² construídos e +37 mil unidades entregues no Brasil.' },
            ].map(item => (
              <div key={item.titulo} className="bg-white/10 rounded-xl p-5 text-white">
                <div className="mb-2 opacity-80">{item.icon}</div>
                <h3 className="font-bold text-base mb-1">{item.titulo}</h3>
                <p className="text-sm opacity-90 leading-relaxed">{item.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LAZER ──────────────────────────────────────────────────── */}
      <section className="bg-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Mais de 30 itens de lazer — do térreo ao rooftop
          </h2>
          <p className="text-gray-500 text-center text-sm mb-5 max-w-xl mx-auto">
            No Green Life, a diversão começa no térreo com as crianças e termina no rooftop com uma vista incrível de Niterói.
          </p>

          {/* Fotos do lazer */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {FOTOS_LAZER.map(foto => (
              <button
                key={foto.src}
                onClick={() => setModalFoto(foto)}
                className="rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-green-600"
                aria-label={`Ver foto: ${foto.label}`}
              >
                <img
                  src={foto.src}
                  width={foto.w} height={foto.h}
                  alt={foto.alt}
                  className="w-full h-72 object-cover hover:scale-105 transition duration-300"
                  loading="lazy"
                />
                <p className="text-xs text-center text-gray-400 py-1 italic">Perspectiva ilustrativa.</p>
              </button>
            ))}
          </div>

          {/* Lista de itens */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {LAZER_ITEMS.map(item => (
              <div key={item} className="flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2">
                <CheckCircle2 size={14} className="text-green-600 shrink-0" />
                <span className="text-xs text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUSTENTABILIDADE ───────────────────────────────────────── */}
      <section className="bg-green-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <Leaf size={24} className="text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Sustentabilidade, uma palavra de ordem</h2>
          </div>
          <p className="text-gray-600 text-sm mb-5 max-w-2xl">
            O Grupo Patrimar segue os Objetivos de Desenvolvimento Sustentável (ODS) da ONU. No Green Life, a sustentabilidade não é item extra — está no projeto.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUSTENTABILIDADE.map(item => (
              <div key={item.texto} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                <span className="text-green-600 mt-0.5 shrink-0">{item.icon}</span>
                <span className="text-sm text-gray-700">{item.texto}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLANTAS ────────────────────────────────────────────────── */}
      <section className="bg-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Plantas</h2>
          <p className="text-gray-500 text-center text-sm mb-6">Todas as unidades têm varanda e sala integrada.</p>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {PLANTAS.map(p => (
              <button
                key={p.id}
                onClick={() => setPlantaAtiva(p.id)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  plantaAtiva === p.id
                    ? 'bg-green-700 text-white border-green-700'
                    : 'border-gray-300 text-gray-700 hover:border-green-500'
                }`}
              >
                {p.label} — {p.area}
              </button>
            ))}
          </div>

          {/* Planta ativa */}
          <div className="max-w-sm mx-auto">
            <img
              key={plantaSel.id}
              src={plantaSel.src}
              width={plantaSel.w} height={plantaSel.h}
              alt={`Planta do apartamento ${plantaSel.label} do Green Life Niterói — ${plantaSel.area}`}
              className="w-full h-auto rounded-xl shadow"
              loading="lazy"
            />
            <p className="text-xs text-center text-gray-400 mt-1 italic">Perspectiva ilustrativa — sem escala.</p>
            <p className="text-sm text-gray-700 text-center mt-3">{plantaSel.desc}</p>
          </div>
        </div>
      </section>

      {/* ── APARTAMENTO ────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Espaços pensados para o conforto</h2>
          <p className="text-gray-500 text-center text-sm mb-5">Acabamentos de qualidade e detalhes que fazem diferença no dia a dia.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
            {DIFERENCIAIS_APT.map(d => (
              <div key={d} className="flex items-start gap-2 bg-white rounded-lg p-3 shadow-sm">
                <CheckCircle2 size={15} className="text-green-600 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-700">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMODIDADES ────────────────────────────────────────────── */}
      <section className="bg-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Comodidades inclusas no condomínio</h2>
          <p className="text-gray-500 text-center text-sm mb-5">Sua rotina mais fácil de um jeito que você nunca viu.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
            {COMODIDADES.map(c => (
              <div key={c} className="flex items-start gap-2 bg-green-50 rounded-lg p-3">
                <Star size={15} className="text-green-600 mt-0.5 shrink-0" />
                <span className="text-sm text-gray-700">{c}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">
            Sob demanda: Novomarket (mercadinho no condomínio), lavanderia e Hapi (carros compartilhados da Novolar).
          </p>
        </div>
      </section>

      {/* ── LOCALIZAÇÃO ────────────────────────────────────────────── */}
      <section className="bg-green-700 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-2 justify-center">
            <MapPin size={22} className="text-green-200" />
            <h2 className="text-white text-2xl font-bold">Localização privilegiada</h2>
          </div>
          <p className="text-green-100 text-center text-sm mb-5">
            Av. Washington Luiz, nº 1 — Centro, Niterói (RJ) · no coração do Novo Centro de Niterói
          </p>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { destaque: '4 min', local: 'Terminal Rodoviário de Niterói' },
              { destaque: '13 min', local: 'Praia do Icaraí' },
              { destaque: 'Perto', local: 'Praia Shopping e barcas para o Rio' },
            ].map(item => (
              <div key={item.local} className="bg-white/15 rounded-xl p-5 text-center text-white">
                <p className="text-2xl font-bold">{item.destaque}</p>
                <p className="text-sm opacity-90 mt-1">{item.local}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-green-200 text-center mt-4">
            Distâncias e tempos conforme informação da incorporadora. Sujeito a variações no trânsito.
          </p>

          {/* Mapa embed */}
          <div className="mt-8 rounded-xl overflow-hidden max-w-3xl mx-auto h-64">
            <iframe
              title="Localização do Green Life no Centro de Niterói"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.6!2d-43.1120!3d-22.8975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDUzJzUxLjIiUyA0M8KwMDYnNDMuMiJX!5e0!3m2!1spt-BR!2sbr!4v1700000000000"
              width="100%" height="100%" style={{ border: 0 }} loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* ── PRAZO DE ENTREGA ───────────────────────────────────────── */}
      <section className="bg-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <Timer size={22} className="text-green-700" />
            <h2 className="text-2xl font-bold text-gray-900">Prazo de entrega</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            <div className="border border-green-200 rounded-xl p-5 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Torre Palmeira</p>
              <p className="text-2xl font-bold text-green-700">Jul/2027</p>
            </div>
            <div className="border border-green-200 rounded-xl p-5 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Torres Ipê-rosa e Jabuticabeira</p>
              <p className="text-2xl font-bold text-green-700">Ago/2028</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center mt-3">
            Previsões informadas pelo corretor em 26/11/2026. Datas sujeitas a alterações conforme o cronograma de obra.
          </p>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-5">Perguntas frequentes</h2>
          <div className="space-y-3">
            {FAQ_GL.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex justify-between items-center gap-4 font-semibold text-gray-900 text-sm hover:bg-gray-50 transition"
                  aria-expanded={openFaq === i}
                >
                  <span>{faq.pergunta}</span>
                  <ChevronRight
                    size={16}
                    className={`shrink-0 transition-transform ${openFaq === i ? 'rotate-90' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.resposta}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORRETOR ───────────────────────────────────────────────── */}
      <section className="bg-white py-10">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <Award size={28} className="text-green-700 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Atendimento especializado</h2>
          <p className="text-gray-600 text-sm mb-1">
            <strong>Joel Marcos</strong> · CRECI 39.583F
          </p>
          <p className="text-gray-500 text-sm mb-4">
            Corretor credenciado, especialista em imóveis em Niterói, São Gonçalo e Itaboraí. Atendimento de segunda a sexta, das 9h às 17h.
          </p>
          <p className="text-xs text-gray-400">
            Dados conferidos em {GL_DATA_CONFERENCIA}. Fonte: book oficial Green Life da Novolar.
          </p>
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────────────────── */}
      <section className="bg-green-700 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-white text-2xl font-bold text-center mb-2">
            Plante seu novo lar no Centro de Niterói
          </h2>
          <p className="text-green-100 text-center text-sm mb-5">
            Preencha o formulário e receba as plantas, as unidades disponíveis e a simulação de financiamento direto no seu WhatsApp.
          </p>
          <div className="bg-white rounded-2xl p-6">
            <LeadForm
              confirmarGravacao
              pagina={SLUG}
              empreendimento={EMPREENDIMENTO}
              formId={`${FORM}_final`}
              ctaTexto="Quero consultar as unidades"
            />
          </div>
        </div>
      </section>

      {/* ── BREADCRUMB + LINKS INTERNOS ────────────────────────────── */}
      <section className="bg-gray-50 py-6">
        <div className="max-w-5xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-500 mb-4">
            <ol className="flex flex-wrap gap-1 items-center">
              <li><Link to="/" className="hover:underline">Início</Link></li>
              <li><ChevronRight size={12} /></li>
              <li><Link to="/niteroirj" className="hover:underline">Imóveis em Niterói</Link></li>
              <li><ChevronRight size={12} /></li>
              <li className="text-gray-700 font-medium">Green Life</li>
            </ol>
          </nav>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-500">Veja também:</span>
            {[
              { label: 'Orla Central', to: '/orla-central-niteroi' },
              { label: 'Green Open Residencial', to: '/green-open-residencial-niteroi' },
              { label: 'Niterói Open', to: '/niteroi-open-residence' },
              { label: 'Caminhos da Guanabara', to: '/caminhos-guanabara-niteroi' },
              { label: 'Todos os imóveis em Niterói', to: '/niteroirj' },
            ].map(l => (
              <Link
                key={l.to}
                to={l.to}
                className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 hover:border-green-500 transition"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── MODAL DE FOTO ──────────────────────────────────────────── */}
      {modalFoto && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setModalFoto(null)}
          role="dialog"
          aria-modal="true"
          aria-label={modalFoto.alt}
        >
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setModalFoto(null)}
              className="absolute -top-10 right-0 text-white opacity-80 hover:opacity-100"
              aria-label="Fechar"
            >
              <X size={28} />
            </button>
            <img
              src={modalFoto.src}
              width={modalFoto.w} height={modalFoto.h}
              alt={modalFoto.alt}
              className="w-full h-auto rounded-xl"
            />
            <p className="text-xs text-center text-gray-300 mt-2 italic">Perspectiva ilustrativa.</p>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
