import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import { FAQ_ORLA, ORLA_AVISO_PRECO } from '../data/orlaCentral';
import {
  MapPin,
  MessageCircle,
  Building2,
  Home,
  Waves,
  Dumbbell,
  PartyPopper,
  Baby,
  Bike,
  GraduationCap,
  ShoppingBag,
  Landmark,
  HeartPulse,
  Sun,
  Key,
  TrendingDown,
  Store,
  CheckCircle2,
  ChevronRight,
  X,
  Award,
  Users,
  ArrowRight,
} from 'lucide-react';

// ─── Landing do lançamento Orla Central (Cury) — Centro de Niterói ───────────
// Head (title/description/canonical/OG) e JSON-LD são gerados no build a partir
// de src/seo/routes.ts (rota /orla-central-niteroi). O Helmet abaixo só mantém
// os mesmos dados na navegação interna (SPA).

const SLUG = '/orla-central-niteroi';
const URL_PAGINA = `https://queromeumcmv.com.br${SLUG}`;
const EMPREENDIMENTO = 'Orla Central — Niterói';
const TITLE = 'Orla Central Niterói | Apartamentos no Centro a partir de R$ 331 mil';
const DESCRIPTION =
  'Orla Central, da Cury, no Centro de Niterói: 1 a 3 quartos com varanda, rooftop com vista para a Baía e lazer completo. A partir de R$ 331 mil.';

const PRECO = 'R$ 331.000';
const AVISO_PRECO = ORLA_AVISO_PRECO;

const WHATSAPP_URL =
  'https://wa.me/5521965928399?text=' +
  encodeURIComponent('Olá, Joel! Vi o Orla Central no Centro de Niterói e quero receber os valores e as plantas disponíveis.');
const COMPARTILHAR_URL =
  'https://wa.me/?text=' + encodeURIComponent(`Olha esse apartamento no Centro de Niterói: ${URL_PAGINA}`);

const img = (nome: string) => `/orla-central-niteroi-${nome}.webp`;

type Foto = { src: string; alt: string; label: string };

const GALERIA: Foto[] = [
  { src: img('fachada'), alt: 'Fachada do Orla Central ao entardecer, no Centro de Niterói, com o Caminho Niemeyer ao fundo', label: 'Fachada' },
  { src: img('lounge-rooftop'), alt: 'Lounge no rooftop do Orla Central com vista para a Baía de Guanabara', label: 'Lounge rooftop' },
  { src: img('piscina-adulto-infantil'), alt: 'Piscinas adulto e infantil do Orla Central, em Niterói', label: 'Piscinas adulto e infantil' },
  { src: img('vista-aerea-centro-niteroi'), alt: 'Vista aérea do Centro de Niterói com a localização do Orla Central perto do Caminho Niemeyer', label: 'Vista aérea' },
  { src: img('espaco-luau'), alt: 'Espaço luau no rooftop do Orla Central, Centro de Niterói', label: 'Espaço luau' },
  { src: img('portaria'), alt: 'Portaria do Orla Central, da Cury, no Centro de Niterói', label: 'Portaria' },
  { src: img('lojas-terreo'), alt: 'Lojas no térreo do Orla Central, em Niterói', label: 'Lojas no térreo' },
  { src: img('beach-tennis'), alt: 'Quadra de beach tennis do Orla Central, Niterói', label: 'Beach tennis' },
  { src: img('academia'), alt: 'Academia do Orla Central, no Centro de Niterói', label: 'Academia' },
  { src: img('fitness-externo'), alt: 'Fitness externo do Orla Central, Niterói', label: 'Fitness externo' },
  { src: img('salao-de-festas'), alt: 'Salão de festas do Orla Central, no Centro de Niterói', label: 'Salão de festas' },
  { src: img('apoio-festas'), alt: 'Área de apoio do salão de festas do Orla Central', label: 'Apoio festas' },
  { src: img('churrasqueira'), alt: 'Churrasqueira do Orla Central, Niterói', label: 'Churrasqueira' },
  { src: img('churrasqueira-gourmet'), alt: 'Churrasqueira gourmet do Orla Central com vista para a Baía', label: 'Churrasqueira gourmet' },
  { src: img('sport-bar'), alt: 'Sport bar do Orla Central, no Centro de Niterói', label: 'Sport bar' },
  { src: img('salao-de-jogos'), alt: 'Salão de jogos do Orla Central, Niterói', label: 'Salão de jogos' },
  { src: img('playground'), alt: 'Playground do Orla Central, no Centro de Niterói', label: 'Playground' },
  { src: img('brinquedoteca'), alt: 'Brinquedoteca do Orla Central, Niterói', label: 'Brinquedoteca' },
  { src: img('oficina'), alt: 'Oficina do Orla Central, Niterói', label: 'Oficina' },
  { src: img('coworking'), alt: 'Coworking do Orla Central para trabalhar de casa no Centro de Niterói', label: 'Coworking' },
  { src: img('pet-care'), alt: 'Pet care do Orla Central, Niterói', label: 'Pet care' },
  { src: img('easy-market'), alt: 'Easy market dentro do condomínio Orla Central', label: 'Easy market' },
  { src: img('delivery'), alt: 'Espaço delivery do Orla Central', label: 'Espaço delivery' },
  { src: img('lavanderia'), alt: 'Lavanderia do Orla Central, no Centro de Niterói', label: 'Lavanderia' },
  { src: img('masterplan'), alt: 'Masterplan com a implantação das duas torres do Orla Central', label: 'Implantação' },
];

type Tipologia = {
  id: string;
  nome: string;
  quartos: '1 quarto' | '2 quartos' | '3 quartos';
  filtro: '1q' | '2q' | '2qs' | '3qs';
  areas: string;
  plantas: Foto[];
  beneficios: string[];
};

const TIPOLOGIAS: Tipologia[] = [
  {
    id: '1q',
    nome: '1 quarto com varanda',
    quartos: '1 quarto',
    filtro: '1q',
    areas: '31,30 m² e 32,44 m²',
    plantas: [
      { src: img('planta-1-quarto-31m2'), alt: 'Planta do apartamento de 1 quarto com varanda, 31,30 m², do Orla Central', label: '1 quarto · 31,30 m²' },
      { src: img('planta-1-quarto-32m2'), alt: 'Planta do apartamento de 1 quarto com varanda, 32,44 m², do Orla Central', label: '1 quarto · 32,44 m²' },
    ],
    beneficios: ['Compacto e prático para morar sozinho ou a dois', 'Perfil procurado por estudantes e profissionais do Centro'],
  },
  {
    id: '2q',
    nome: '2 quartos com varanda',
    quartos: '2 quartos',
    filtro: '2q',
    areas: '36,12 m² e 38,61 m²',
    plantas: [
      { src: img('planta-2-quartos-36m2'), alt: 'Planta do apartamento de 2 quartos com varanda, 36,12 m², do Orla Central', label: '2 quartos · 36,12 m²' },
      { src: img('planta-2-quartos-38m2'), alt: 'Planta do apartamento de 2 quartos com varanda, 38,61 m², do Orla Central', label: '2 quartos · 38,61 m²' },
    ],
    beneficios: ['O segundo quarto vira quarto das crianças ou home office', 'Varanda para o café da manhã com brisa da Baía'],
  },
  {
    id: '2qs',
    nome: '2 quartos com suíte e varanda',
    quartos: '2 quartos',
    filtro: '2qs',
    areas: '52,89 m²',
    plantas: [
      { src: img('planta-2-quartos-suite-52m2'), alt: 'Planta do apartamento de 2 quartos com suíte e varanda, 52,89 m², do Orla Central', label: '2 quartos com suíte · 52,89 m²' },
    ],
    beneficios: ['Suíte para o casal e mais privacidade na rotina', 'Sala ampla para receber a família'],
  },
  {
    id: '3qs',
    nome: '3 quartos com suíte e varanda',
    quartos: '3 quartos',
    filtro: '3qs',
    areas: '65,11 m², 65,49 m² e 65,72 m²',
    plantas: [
      { src: img('planta-3-quartos-suite-65m2-a'), alt: 'Planta do apartamento de 3 quartos com suíte e varanda, 65,11 m², do Orla Central', label: '3 quartos com suíte · 65,11 m²' },
      { src: img('planta-3-quartos-suite-65m2-b'), alt: 'Planta do apartamento de 3 quartos com suíte e varanda, 65,49 m², do Orla Central', label: '3 quartos com suíte · 65,49 m²' },
      { src: img('planta-3-quartos-suite-65m2-c'), alt: 'Planta do apartamento de 3 quartos com suíte e varanda, 65,72 m², do Orla Central', label: '3 quartos com suíte · 65,72 m²' },
    ],
    beneficios: ['Um quarto para cada filho e suíte para o casal', 'A maior planta do empreendimento, para a família crescer'],
  },
];

const FILTROS: Array<{ id: 'todos' | Tipologia['filtro']; label: string }> = [
  { id: 'todos', label: 'Todos' },
  { id: '1q', label: '1 quarto' },
  { id: '2q', label: '2 quartos' },
  { id: '2qs', label: '2 quartos com suíte' },
  { id: '3qs', label: '3 quartos com suíte' },
];

const LAZER_GRUPOS: Array<{ titulo: string; icon: ReactNode; itens: Foto[] }> = [
  {
    titulo: 'Relaxar',
    icon: <Sun className="w-5 h-5" />,
    itens: [img('lounge-rooftop'), img('espaco-luau'), img('piscina-adulto-infantil')].map((src) => GALERIA.find((g) => g.src === src)!),
  },
  {
    titulo: 'Se movimentar',
    icon: <Dumbbell className="w-5 h-5" />,
    itens: [img('academia'), img('fitness-externo'), img('beach-tennis')].map((src) => GALERIA.find((g) => g.src === src)!),
  },
  {
    titulo: 'Receber',
    icon: <PartyPopper className="w-5 h-5" />,
    itens: [img('salao-de-festas'), img('churrasqueira-gourmet'), img('sport-bar'), img('churrasqueira'), img('apoio-festas')].map(
      (src) => GALERIA.find((g) => g.src === src)!
    ),
  },
  {
    titulo: 'Família e rotina',
    icon: <Baby className="w-5 h-5" />,
    itens: [img('playground'), img('brinquedoteca'), img('salao-de-jogos'), img('coworking'), img('pet-care'), img('oficina')].map(
      (src) => GALERIA.find((g) => g.src === src)!
    ),
  },
];

const PERTO = [
  {
    grupo: 'Mobilidade',
    icon: <Bike className="w-5 h-5" />,
    itens: ['CCR Barcas', 'Terminal Rodoviário João Goulart', 'Av. Visconde do Rio Branco', 'Av. Feliciano Sodré', 'Bicicletário com 970 vagas'],
  },
  {
    grupo: 'Cultura e lazer',
    icon: <Landmark className="w-5 h-5" />,
    itens: ['Caminho Niemeyer', 'Teatro Popular Oscar Niemeyer', 'Concha Acústica', 'Espaço Cultural Correios', 'Praça São João', 'Parque das Águas'],
  },
  {
    grupo: 'Compras',
    icon: <ShoppingBag className="w-5 h-5" />,
    itens: ['Plaza Shopping Niterói', 'Shopping Bay Market', 'Barcas Shopping', 'Princesa Supermercados'],
  },
  {
    grupo: 'Educação',
    icon: <GraduationCap className="w-5 h-5" />,
    itens: ['UFF', 'Faculdade Anhanguera', 'Faculdade de Odontologia UNIAN', 'Colégio São Lucas'],
  },
  { grupo: 'Saúde', icon: <HeartPulse className="w-5 h-5" />, itens: ['Hospital Icaraí'] },
];

function PrecoBox({ claro = false }: { claro?: boolean }) {
  return (
    <div>
      <p className={`text-sm ${claro ? 'text-sky-100' : 'text-slate-500'}`}>A partir de</p>
      <p className={`font-extrabold tracking-tight text-4xl ${claro ? 'text-white' : 'text-[#0F2A4A]'}`}>
        {PRECO}
        <span className="text-[#B86A4B]">*</span>
      </p>
      <p className={`mt-1 text-xs leading-snug ${claro ? 'text-sky-100' : 'text-slate-600'}`}>{AVISO_PRECO}</p>
    </div>
  );
}

type Contexto = { objetivo: '' | 'Morar' | 'Investir'; tipologia?: Tipologia };

export default function OrlaCentralNiteroi() {
  const [modal, setModal] = useState<Contexto | null>(null);
  const [foto, setFoto] = useState<{ lista: Foto[]; i: number } | null>(null);
  const [filtro, setFiltro] = useState<'todos' | Tipologia['filtro']>('todos');
  const [aba, setAba] = useState<'morar' | 'investir'>('morar');
  const dlgForm = useRef<HTMLDialogElement>(null);
  const dlgFoto = useRef<HTMLDialogElement>(null);

  // Abre/fecha os <dialog> nativos conforme o estado
  useEffect(() => {
    const d = dlgForm.current;
    if (!d) return;
    if (modal && !d.open) {
      d.showModal();
      try {
        const w = window as any;
        w.dataLayer = w.dataLayer || [];
        w.dataLayer.push({ event: 'form_open', form_name: 'lead_orla_central', empreendimento: EMPREENDIMENTO });
      } catch (_) {}
    }
    if (!modal && d.open) d.close();
  }, [modal]);

  useEffect(() => {
    const d = dlgFoto.current;
    if (!d) return;
    if (foto && !d.open) d.showModal();
    if (!foto && d.open) d.close();
  }, [foto]);

  const abrir = (ctx: Contexto) => {
    if (ctx.tipologia) {
      try {
        const w = window as any;
        w.dataLayer = w.dataLayer || [];
        w.dataLayer.push({ event: 'unidade_click', empreendimento: EMPREENDIMENTO, unidade_interesse: ctx.tipologia.nome });
      } catch (_) {}
    }
    setModal(ctx);
  };

  const fecharForm = () => {
    try {
      const w = window as any;
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ event: 'form_close', form_name: 'lead_orla_central', empreendimento: EMPREENDIMENTO });
    } catch (_) {}
    setModal(null);
  };

  const verFoto = (lista: Foto[], i: number) => setFoto({ lista, i });
  const passo = (d: number) =>
    setFoto((f) => (f ? { lista: f.lista, i: (f.i + d + f.lista.length) % f.lista.length } : f));

  const tipologiasVisiveis = TIPOLOGIAS.filter((t) => filtro === 'todos' || t.filtro === filtro);

  return (
    <div className="min-h-screen bg-[#F7F3EA] font-sans text-[#22262B] selection:bg-[#1565A8] selection:text-white">
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href={URL_PAGINA} />
        <meta property="og:site_name" content="Quero Meu MCMV" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={URL_PAGINA} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:image" content="https://queromeumcmv.com.br/og/orla-central-niteroi-fachada.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="Niterói" />
        <link rel="preload" as="image" href={img('fachada')} fetchPriority="high" />
      </Helmet>

      <Header />

      <main id="main-content">
        {/* ── PRIMEIRA DOBRA ── */}
        <section className="relative overflow-hidden bg-[#0F2A4A] text-white">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-60"
            style={{ background: 'radial-gradient(1200px 500px at 10% -10%, #1565A8 0%, transparent 60%), radial-gradient(900px 500px at 100% 110%, #5FA8D8 0%, transparent 55%)' }}
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 lg:pb-16">
            <nav className="text-sm text-sky-100/80 mb-5" aria-label="Breadcrumb">
              <ol className="flex items-center flex-wrap gap-1">
                <li><Link to="/" className="hover:text-white">Início</Link></li>
                <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5" /></li>
                <li><Link to="/niteroirj" className="hover:text-white">Imóveis em Niterói</Link></li>
                <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5" /></li>
                <li className="text-white font-semibold" aria-current="page">Orla Central</li>
              </ol>
            </nav>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Galeria + título */}
              <div className="lg:col-span-7 space-y-5">
                <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-[260px] sm:h-[360px] lg:h-[400px] relative">
                  <button type="button" onClick={() => verFoto(GALERIA, 0)} className="col-span-4 sm:col-span-2 row-span-2 relative group">
                    <img
                      src={img('fachada')}
                      alt={GALERIA[0].alt}
                      width={1600}
                      height={774}
                      fetchPriority="high"
                      loading="eager"
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                    />
                  </button>
                  {[1, 2, 3].map((i) => (
                    <button key={i} type="button" onClick={() => verFoto(GALERIA, i)} className="hidden sm:block relative group">
                      <img src={GALERIA[i].src} alt={GALERIA[i].alt} width={800} height={387} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </button>
                  ))}
                  <button type="button" onClick={() => verFoto(GALERIA, 4)} className="hidden sm:block relative group">
                    <img src={GALERIA[4].src} alt={GALERIA[4].alt} width={800} height={387} loading="lazy" className="w-full h-full object-cover" />
                    <span className="absolute inset-0 bg-[#0F2A4A]/60 flex items-center justify-center font-bold text-sm">+{GALERIA.length - 5} fotos</span>
                  </button>
                  <div className="absolute top-3 left-3 flex gap-2 pointer-events-none">
                    <span className="bg-[#0F2A4A] text-white text-[11px] font-bold tracking-widest px-2.5 py-1 rounded-md">LANÇAMENTO</span>
                    <span className="bg-white text-[#0F2A4A] text-[11px] font-bold tracking-widest px-2.5 py-1 rounded-md">CURY</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => verFoto(GALERIA, 0)}
                    className="absolute right-3 bottom-3 bg-white text-[#0F2A4A] text-sm font-semibold px-3.5 py-2 rounded-lg shadow-lg"
                  >
                    Ver todas as {GALERIA.length} fotos
                  </button>
                </div>
                <p className="text-[11px] text-sky-100/70 -mt-3">Perspectivas ilustrativas.</p>

                <p className="font-serif italic text-sky-200 text-lg">O lugar onde Niterói nasceu agora renasce para você.</p>
                <h1 className="text-3xl md:text-[2.6rem] font-extrabold leading-tight">
                  Orla Central Niterói: apartamentos de 1 a 3 quartos com varanda no Centro, perto do Caminho Niemeyer
                </h1>
                <p className="flex items-center gap-2 text-sky-100">
                  <MapPin className="w-4 h-4 text-[#E9A27F]" /> Centro, Niterói – RJ · próximo às barcas e ao Caminho Niemeyer
                </p>
                <ul className="flex flex-wrap gap-2 text-sm" aria-label="Características">
                  {['1, 2 e 3 quartos', '31 a 65 m²', 'Varanda em todas', 'Suíte nos 2 e 3 quartos', 'Rooftop', 'Lojas no térreo'].map((c) => (
                    <li key={c} className="bg-white/10 border border-white/20 rounded-full px-3 py-1.5">{c}</li>
                  ))}
                </ul>
              </div>

              {/* Card de captação */}
              <aside className="lg:col-span-5 lg:sticky lg:top-24" aria-label="Valores e atendimento">
                <div className="bg-white text-[#22262B] rounded-2xl shadow-2xl border-t-4 border-[#B86A4B] p-6 space-y-5">
                  <PrecoBox />
                  <div>
                    <p className="font-bold text-[#0F2A4A] text-lg">Você procura um apartamento para:</p>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <button
                        type="button"
                        onClick={() => abrir({ objetivo: 'Morar' })}
                        className="min-h-[56px] rounded-xl border-2 border-[#1565A8] text-[#0F2A4A] font-bold flex items-center justify-center gap-2 hover:bg-[#1565A8] hover:text-white transition-colors"
                      >
                        <Home className="w-5 h-5" /> Morar
                      </button>
                      <button
                        type="button"
                        onClick={() => abrir({ objetivo: 'Investir' })}
                        className="min-h-[56px] rounded-xl border-2 border-[#1565A8] text-[#0F2A4A] font-bold flex items-center justify-center gap-2 hover:bg-[#1565A8] hover:text-white transition-colors"
                      >
                        <Key className="w-5 h-5" /> Investir
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => abrir({ objetivo: '' })}
                    className="w-full min-h-[54px] rounded-xl bg-[#B86A4B] hover:bg-[#9E5638] text-white font-extrabold text-lg transition-colors"
                  >
                    Receber valores e plantas disponíveis
                  </button>
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener"
                    className="w-full min-h-[48px] rounded-xl border-2 border-green-600 text-green-700 font-bold flex items-center justify-center gap-2 hover:bg-green-50"
                  >
                    <MessageCircle className="w-5 h-5" /> Falar no WhatsApp
                  </a>
                  <p className="text-xs text-slate-500 text-center">
                    Corretor Joel Marcos · CRECI 39.583F · seg a sex, 9h às 17h
                  </p>
                  <a href={COMPARTILHAR_URL} target="_blank" rel="noopener" className="block text-center text-sm text-[#1565A8] underline">
                    Enviar este imóvel para quem vai decidir comigo
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ── AUTORIDADE ── */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              ['962', 'apartamentos'],
              ['2', 'torres de 16 pavimentos'],
              ['+20', 'itens de lazer e serviços'],
              ['Cury', 'construtora'],
            ].map(([n, t]) => (
              <div key={t}>
                <p className="text-3xl font-extrabold text-[#0F2A4A]">{n}</p>
                <p className="text-sm text-slate-600">{t}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── VISÃO GERAL / FATOS-CHAVE ── */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              <p className="tracking-[0.3em] text-xs font-bold text-[#B86A4B]">VISÃO GERAL</p>
              <h2 className="text-3xl font-bold text-[#0F2A4A]">O que é o Orla Central</h2>
              <p className="leading-relaxed text-slate-700">
                O Orla Central é um condomínio residencial da Cury no Centro de Niterói (RJ), próximo ao Caminho Niemeyer e à
                estação das barcas. O empreendimento tem 962 apartamentos de 1, 2 e 3 quartos, de 31,30 m² a 65,72 m²,
                distribuídos em duas torres, todos com varanda, com lojas no térreo e mais de 20 espaços de lazer e serviços.
                Os preços partem de R$ 331.000, sujeitos a alteração e disponibilidade.
              </p>
              <p className="leading-relaxed text-slate-700">
                É a chance de morar onde a história da cidade começou: atravessar para o Rio de barca, caminhar até o Teatro
                Popular e terminar o dia no rooftop, olhando o pôr do sol sobre a Baía de Guanabara.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-2xl overflow-hidden text-sm border border-slate-200">
                <caption className="text-left font-bold text-[#0F2A4A] pb-3">Ficha técnica</caption>
                <tbody>
                  {[
                    ['Construtora', 'Cury'],
                    ['Bairro / cidade', 'Centro, Niterói – RJ'],
                    ['Terreno', '7.216 m²'],
                    ['Unidades', '962 apartamentos'],
                    ['Torres', '2 (térreo + PUC + 16 pavimentos)'],
                    ['Tipologias', '1 quarto, 2 quartos, 2 quartos com suíte e 3 quartos com suíte'],
                    ['Metragens', '31,30 m² a 65,72 m²'],
                    ['Varanda', 'Em todas as unidades'],
                    ['Vagas de automóvel', '102 (limitadas)'],
                    ['Bicicletário', '970 vagas'],
                    ['Preço inicial', `${PRECO}*`],
                  ].map(([k, val]) => (
                    <tr key={k} className="border-b border-slate-100 last:border-0">
                      <th scope="row" className="text-left font-medium text-slate-500 px-4 py-3 w-2/5">{k}</th>
                      <td className="px-4 py-3 font-semibold">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-slate-500 mt-2">{AVISO_PRECO}</p>
            </div>
          </div>
        </section>

        {/* ── MORAR OU INVESTIR ── */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[#0F2A4A] text-center">Para morar ou para investir?</h2>
            <div role="tablist" aria-label="Objetivo" className="flex justify-center gap-2 mt-6">
              {(['morar', 'investir'] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  role="tab"
                  aria-selected={aba === a}
                  onClick={() => setAba(a)}
                  className={`min-h-[44px] px-6 rounded-full font-bold border-2 transition-colors ${
                    aba === a ? 'bg-[#0F2A4A] border-[#0F2A4A] text-white' : 'border-slate-300 text-slate-700 hover:border-[#0F2A4A]'
                  }`}
                >
                  {a === 'morar' ? 'Quero morar' : 'Quero investir'}
                </button>
              ))}
            </div>
            <div hidden={aba !== 'morar'} role="tabpanel">
              <div className="mt-8 grid md:grid-cols-2 gap-8 items-center">
                <img src={img('lounge-rooftop')} alt="Lounge rooftop do Orla Central com vista para a Baía de Guanabara" width={1600} height={774} loading="lazy" className="rounded-2xl w-full h-64 object-cover" />
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-[#0F2A4A]">Viva onde a cidade acontece</h3>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-[#1565A8] shrink-0 mt-0.5" />Barca para o Rio, comércio, faculdades e cultura por perto</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-[#1565A8] shrink-0 mt-0.5" />Lazer de clube para a família, do playground ao rooftop</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-[#1565A8] shrink-0 mt-0.5" />Easy market, lavanderia e espaço delivery para facilitar a rotina</li>
                  </ul>
                  <button type="button" onClick={() => abrir({ objetivo: 'Morar' })} className="mt-2 inline-flex items-center gap-2 bg-[#B86A4B] hover:bg-[#9E5638] text-white font-bold px-6 py-3 rounded-xl">
                    Quero morar no Orla Central <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div hidden={aba !== 'investir'} role="tabpanel">
              <div className="mt-8 grid md:grid-cols-2 gap-8 items-center">
                <img src={img('coworking')} alt="Coworking do Orla Central, no Centro de Niterói" width={1600} height={774} loading="lazy" className="rounded-2xl w-full h-64 object-cover" />
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-[#0F2A4A]">Patrimônio no endereço mais histórico de Niterói</h3>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-[#1565A8] shrink-0 mt-0.5" />Plantas compactas de 1 e 2 quartos, de 31 a 38 m²</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-[#1565A8] shrink-0 mt-0.5" />A poucos passos de UFF, Anhanguera, UNIAN, barcas e terminal rodoviário</li>
                    <li className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-[#1565A8] shrink-0 mt-0.5" />27% dos moradores da região vivem de aluguel (IBGE, conforme estudo de mercado da incorporadora)</li>
                  </ul>
                  <button type="button" onClick={() => abrir({ objetivo: 'Investir' })} className="mt-2 inline-flex items-center gap-2 bg-[#B86A4B] hover:bg-[#9E5638] text-white font-bold px-6 py-3 rounded-xl">
                    Quero investir no Orla Central <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TIPOLOGIAS ── */}
        <section className="py-16" id="plantas">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="tracking-[0.3em] text-xs font-bold text-[#B86A4B]">PLANTAS</p>
            <h2 className="text-3xl font-bold text-[#0F2A4A] mt-2">Encontre a sua planta — todas com varanda</h2>
            <div role="group" aria-label="Filtrar por tipologia" className="flex flex-wrap gap-2 mt-6">
              {FILTROS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={filtro === f.id}
                  onClick={() => setFiltro(f.id)}
                  className={`min-h-[44px] px-4 rounded-full text-sm font-semibold border transition-colors ${
                    filtro === f.id ? 'bg-[#0F2A4A] border-[#0F2A4A] text-white' : 'bg-white border-slate-300 hover:border-[#0F2A4A]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
              {tipologiasVisiveis.map((t) => (
                <article key={t.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
                  <button type="button" onClick={() => verFoto(t.plantas, 0)} className="bg-slate-50 h-48 flex items-center justify-center p-3" aria-label={`Ampliar planta: ${t.nome}`}>
                    <img src={t.plantas[0].src} alt={t.plantas[0].alt} width={800} height={600} loading="lazy" className="max-h-full max-w-full object-contain" />
                  </button>
                  <div className="p-5 flex flex-col gap-2 flex-1">
                    <h3 className="font-bold text-lg text-[#0F2A4A]">{t.nome}</h3>
                    <p className="text-sm text-slate-600">{t.areas}{t.plantas.length > 1 ? ` · ${t.plantas.length} plantas` : ''}</p>
                    <ul className="text-sm text-slate-700 space-y-1">
                      {t.beneficios.map((b) => (
                        <li key={b} className="flex gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#1565A8] shrink-0 mt-0.5" />{b}</li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => abrir({ objetivo: '', tipologia: t })}
                      className="mt-auto min-h-[48px] rounded-xl bg-[#B86A4B] hover:bg-[#9E5638] text-white font-bold"
                    >
                      Consultar valor e disponibilidade
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4">Plantas ilustrativas. Metragens conforme o book da incorporadora. {AVISO_PRECO}</p>
          </div>
        </section>

        {/* ── LAZER ── */}
        <section className="py-16 bg-[#0F2A4A] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-6 items-end">
              <div>
                <p className="tracking-[0.3em] text-xs font-bold text-[#E9A27F]">LAZER COMPLETO</p>
                <h2 className="text-3xl md:text-4xl font-bold mt-2">Um clube inteiro, sem sair de casa</h2>
              </div>
              <p className="text-sky-100 leading-relaxed">
                Fim de tarde: você sobe ao rooftop, o sol se põe atrás da Baía de Guanabara e o dia termina no espaço luau.
                No fim de semana, beach tennis de manhã, piscina com as crianças à tarde e churrasco com os amigos à noite.
              </p>
            </div>
            <div className="mt-10 space-y-10">
              {LAZER_GRUPOS.map((g) => (
                <div key={g.titulo}>
                  <h3 className="flex items-center gap-2 font-bold text-lg text-[#E9A27F]">{g.icon}{g.titulo}</h3>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {g.itens.map((f, i) => (
                      <button key={f.src} type="button" onClick={() => verFoto(g.itens, i)} className="relative rounded-xl overflow-hidden aspect-video group text-left">
                        <img src={f.src} alt={f.alt} width={800} height={387} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 py-2 text-sm font-semibold">{f.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 bg-white/10 rounded-2xl p-6 grid md:grid-cols-4 gap-4">
              <p className="md:col-span-4 font-bold text-lg">Serviços que facilitam a vida</p>
              {[
                [<ShoppingBag key="i" className="w-5 h-5" />, 'Easy market'],
                [<Building2 key="i" className="w-5 h-5" />, 'Espaço delivery'],
                [<Waves key="i" className="w-5 h-5" />, 'Lavanderia'],
                [<Store key="i" className="w-5 h-5" />, 'Lojas no térreo'],
              ].map(([icon, t]) => (
                <p key={t as string} className="flex items-center gap-2 text-sky-100">{icon}{t}</p>
              ))}
            </div>
            <p className="text-xs text-sky-100/70 mt-4">Perspectivas ilustrativas.</p>
          </div>
        </section>

        {/* ── LOCALIZAÇÃO ── */}
        <section className="py-16" id="localizacao">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="tracking-[0.3em] text-xs font-bold text-[#B86A4B]">LOCALIZAÇÃO</p>
            <h2 className="text-3xl font-bold text-[#0F2A4A] mt-2">Onde Niterói começou</h2>
            <p className="text-slate-700 mt-3 max-w-3xl leading-relaxed">
              No Centro de Niterói, entre o Caminho Niemeyer e as avenidas Visconde do Rio Branco e Feliciano Sodré. Barca e
              ônibus na porta, faculdades, shoppings e cultura ao redor.
            </p>
            <div className="grid lg:grid-cols-2 gap-8 mt-8">
              <button type="button" onClick={() => verFoto(GALERIA, 3)} className="rounded-2xl overflow-hidden">
                <img src={img('vista-aerea-centro-niteroi')} alt="Vista aérea do Centro de Niterói com o Orla Central, o Caminho Niemeyer e as barcas" width={1600} height={900} loading="lazy" className="w-full h-full object-cover" />
              </button>
              <div className="grid sm:grid-cols-2 gap-4">
                {PERTO.map((p) => (
                  <div key={p.grupo} className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="flex items-center gap-2 font-bold text-[#0F2A4A]">
                      <span className="text-[#1565A8]">{p.icon}</span>{p.grupo}
                    </p>
                    <ul className="mt-2 text-sm text-slate-700 space-y-1">
                      {p.itens.map((i) => <li key={i}>{i}</li>)}
                    </ul>
                  </div>
                ))}
                <div className="bg-[#0F2A4A] text-white rounded-xl p-4">
                  <p className="font-bold">Quem mora na região</p>
                  <ul className="mt-2 text-sm space-y-1 text-sky-100">
                    <li>Renda média de R$ 5.020</li>
                    <li>67,8% moram em apartamento</li>
                    <li>27% moram de aluguel</li>
                  </ul>
                  <p className="text-[11px] text-sky-200/80 mt-2">Fonte: IBGE, conforme estudo de mercado da incorporadora.</p>
                </div>
              </div>
            </div>
            <div className="mt-8 grid lg:grid-cols-2 gap-8 items-center">
              <img src={img('masterplan')} alt="Masterplan do Orla Central com as duas torres e o lazer" width={1300} height={846} loading="lazy" className="w-full rounded-2xl bg-white p-2 border border-slate-200" />
              <div>
                <h3 className="text-2xl font-bold text-[#0F2A4A]">Implantação</h3>
                <p className="text-slate-700 mt-2 leading-relaxed">
                  Duas torres em um terreno de 7.216 m², com lojas no térreo voltadas para a rua e o lazer distribuído entre o
                  térreo e o rooftop.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── ALUGUEL x PATRIMÔNIO + COMO COMPRAR ── */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[#0F2A4A] text-center">Aluguel ou patrimônio?</h2>
            <div className="grid md:grid-cols-2 gap-5 mt-8">
              <div className="rounded-2xl bg-slate-100 p-6">
                <p className="flex items-center gap-2 font-bold text-slate-600"><TrendingDown className="w-5 h-5" />Pagando aluguel</p>
                <ul className="mt-3 space-y-2 text-slate-700 list-disc pl-5">
                  <li>Dinheiro que não volta</li>
                  <li>Reajuste todo ano</li>
                  <li>Mudança quando o dono pedir</li>
                </ul>
              </div>
              <div className="rounded-2xl bg-[#0F2A4A] text-white p-6">
                <p className="flex items-center gap-2 font-bold text-[#E9A27F]"><Key className="w-5 h-5" />Com o Orla Central</p>
                <ul className="mt-3 space-y-2 list-disc pl-5">
                  <li>Cada parcela vira patrimônio</li>
                  <li>Endereço seu no Centro de Niterói</li>
                  <li>Simulação de financiamento conforme a sua renda</li>
                </ul>
              </div>
            </div>
            <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
              {[
                'Você conta seu objetivo e sua renda',
                'Recebe valores e plantas disponíveis',
                'Simulação e análise de crédito',
                'Escolha da unidade e assinatura do contrato',
              ].map((t, i) => (
                <li key={t} className="flex gap-3 items-start">
                  <span className="w-9 h-9 shrink-0 rounded-full bg-[#B86A4B] text-white font-extrabold flex items-center justify-center">{i + 1}</span>
                  <span className="pt-1.5 text-slate-700">{t}</span>
                </li>
              ))}
            </ol>
            <div className="text-center mt-10">
              <button type="button" onClick={() => abrir({ objetivo: 'Morar' })} className="inline-flex items-center gap-2 bg-[#B86A4B] hover:bg-[#9E5638] text-white font-extrabold px-7 py-4 rounded-xl">
                Quero saber quanto fica a minha parcela <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ── CORRETOR (E-E-A-T) ── */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 grid md:grid-cols-[160px_1fr] gap-6 items-center">
              <img src="/joel-marcos-corretor-de-imoveis-itaborai.webp" alt="Joel Marcos, corretor de imóveis CRECI 39.583F" width={160} height={160} loading="lazy" className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mx-auto" />
              <div className="space-y-3">
                <p className="tracking-[0.3em] text-xs font-bold text-[#B86A4B]">QUEM VAI TE ATENDER</p>
                <h2 className="text-2xl font-bold text-[#0F2A4A]">Joel Marcos — Corretor de Imóveis · CRECI 39.583F</h2>
                <p className="text-slate-700 leading-relaxed">
                  Corretor desde 2002, especialista em Minha Casa Minha Vida e lançamentos em Itaboraí, São Gonçalo e Niterói.
                  Acompanho você da simulação à entrega das chaves.
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-1.5 text-slate-600"><Award className="w-4 h-4 text-[#B86A4B]" />24 anos de mercado</span>
                  <span className="flex items-center gap-1.5 text-slate-600"><Users className="w-4 h-4 text-[#B86A4B]" />Atendimento online e pelo WhatsApp</span>
                  <Link to="/sobre" className="text-[#1565A8] underline">Conheça o corretor</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16 bg-white" id="duvidas">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[#0F2A4A] text-center mb-8">Dúvidas frequentes sobre o Orla Central</h2>
            <div className="space-y-3">
              {FAQ_ORLA.map((f, i) => (
                <details key={f.pergunta} open={i === 0} className="bg-[#F7F3EA] rounded-xl border border-slate-200 p-5 group">
                  <summary className="font-bold text-[#0F2A4A] cursor-pointer list-none flex justify-between gap-4">
                    <h3 className="text-base">{f.pergunta}</h3>
                    <ChevronRight className="w-5 h-5 shrink-0 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-slate-700 leading-relaxed">{f.resposta}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL + FORMULÁRIO ── */}
        <section className="relative py-16 text-white overflow-hidden" id="contato">
          <img src={img('fachada')} alt="" aria-hidden="true" width={1600} height={774} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0F2A4A]/85" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">Comece o seu novo capítulo em Niterói.</h2>
              <PrecoBox claro />
              <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3.5 rounded-xl">
                <MessageCircle className="w-5 h-5" /> Falar no WhatsApp
              </a>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <LeadForm
                empreendimento={EMPREENDIMENTO}
                cidadeFixa="Niterói"
                formName="lead_orla_central"
                titulo="Receba os valores do Orla Central"
                subtitulo="Leva menos de 1 minuto. Envio pelo WhatsApp os valores, as plantas e as unidades disponíveis."
              />
            </div>
          </div>
        </section>

        {/* ── LINKS INTERNOS ── */}
        <section className="py-12 bg-[#F7F3EA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              ['/niteroirj', 'Imóveis em Niterói', 'Outras opções de apartamentos em Niterói.'],
              ['/unicsaogoncalo', 'Unic São Gonçalo', 'Lançamento com lazer rooftop ao lado do São Gonçalo Shopping.'],
              ['/financiamento-minha-casa-minha-vida', 'Como funciona o financiamento', 'Entenda a análise de crédito e as parcelas.'],
              ['/documentos-minha-casa-minha-vida', 'Documentos para financiar', 'Lista completa para aprovar seu crédito.'],
            ].map(([to, t, d]) => (
              <Link key={to} to={to} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-[#1565A8] hover:shadow-md transition-all">
                <p className="font-bold text-[#0F2A4A]">{t}</p>
                <p className="text-sm text-slate-600 mt-1">{d}</p>
              </Link>
            ))}
          </div>
          <p className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-slate-500 mt-8 leading-relaxed">
            {AVISO_PRECO} Imagens, plantas e perspectivas meramente ilustrativas. Metragens e acabamentos conforme memorial
            descritivo. Financiamento sujeito à análise e aprovação de crédito. Empreendimento da Cury; intermediação: Joel
            Marcos, corretor de imóveis, CRECI 39.583F.
          </p>
        </section>
      </main>

      {/* Barra fixa no celular */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 p-2.5 grid grid-cols-2 gap-2.5 shadow-[0_-6px_18px_rgba(0,0,0,0.08)]">
        <button type="button" onClick={() => abrir({ objetivo: '' })} className="min-h-[48px] rounded-xl bg-[#B86A4B] text-white font-extrabold">
          Receber valores
        </button>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener" className="min-h-[48px] rounded-xl bg-green-600 text-white font-bold flex items-center justify-center gap-2">
          <MessageCircle className="w-5 h-5" /> WhatsApp
        </a>
      </div>
      <div className="lg:hidden h-20" aria-hidden="true" />

      <Footer />

      {/* ── POP-UP DO FORMULÁRIO (abre só por clique) ── */}
      <dialog
        ref={dlgForm}
        onClose={() => setModal(null)}
        onCancel={(e) => {
          e.preventDefault();
          fecharForm();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) fecharForm();
        }}
        aria-label="Receber valores do Orla Central"
        className="p-0 bg-transparent backdrop:bg-[#0F2A4A]/70 w-full max-w-lg m-auto max-sm:mb-0 max-sm:max-w-none"
      >
        {modal && (
          <div className="relative bg-white rounded-2xl max-sm:rounded-b-none max-h-[92vh] overflow-y-auto">
            <button
              type="button"
              onClick={fecharForm}
              aria-label="Fechar"
              className="absolute right-3 top-3 z-10 w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
            >
              <X className="w-5 h-5 text-[#0F2A4A]" />
            </button>
            <div className="px-5 pt-5 pr-16">
              <p className="tracking-[0.25em] text-[11px] font-bold text-[#B86A4B]">ORLA CENTRAL · NITERÓI</p>
              {modal.tipologia && <p className="text-sm text-slate-600 mt-1">Interesse: <strong>{modal.tipologia.nome}</strong></p>}
              {modal.objetivo && <p className="text-sm text-slate-600 mt-1">Objetivo: <strong>{modal.objetivo}</strong></p>}
            </div>
            <LeadForm
              key={`${modal.objetivo}-${modal.tipologia?.id || 'geral'}`}
              empreendimento={EMPREENDIMENTO}
              cidadeFixa="Niterói"
              quartosInicial={modal.tipologia?.quartos || ''}
              unidadeInteresse={modal.tipologia?.nome || ''}
              objetivo={modal.objetivo}
              formName="lead_orla_central"
              titulo="Falta pouco para receber os valores"
              subtitulo="Respondo pelo WhatsApp com valores, plantas e unidades disponíveis."
            />
          </div>
        )}
      </dialog>

      {/* ── LIGHTBOX DE FOTOS ── */}
      <dialog
        ref={dlgFoto}
        onClose={() => setFoto(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setFoto(null);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') passo(1);
          if (e.key === 'ArrowLeft') passo(-1);
        }}
        aria-label="Galeria de fotos do Orla Central"
        className="p-0 bg-transparent backdrop:bg-black/90 max-w-6xl w-[95vw] m-auto"
      >
        {foto && (
          <figure className="relative">
            <img
              src={foto.lista[foto.i].src}
              alt={foto.lista[foto.i].alt}
              className="w-full max-h-[82vh] object-contain rounded-lg bg-white"
            />
            <figcaption className="text-white text-sm mt-3 flex justify-between gap-4">
              <span>{foto.lista[foto.i].label} · Perspectiva ilustrativa</span>
              <span>{foto.i + 1}/{foto.lista.length}</span>
            </figcaption>
            <button type="button" onClick={() => setFoto(null)} aria-label="Fechar galeria" className="absolute right-2 top-2 w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center">
              <X className="w-5 h-5" />
            </button>
            {foto.lista.length > 1 && (
              <>
                <button type="button" onClick={() => passo(-1)} aria-label="Foto anterior" className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center">
                  <ChevronRight className="w-6 h-6 rotate-180" />
                </button>
                <button type="button" onClick={() => passo(1)} aria-label="Próxima foto" className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 text-white flex items-center justify-center">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </figure>
        )}
      </dialog>
    </div>
  );
}
