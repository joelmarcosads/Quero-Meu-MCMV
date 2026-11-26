import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import { FAQ_GUANABARA, GUANABARA_AVISO_PRECO, GUANABARA_DATA_CONFERENCIA } from '../data/orlaGuanabara';
import {
  MapPin,
  CheckCircle2,
  ChevronRight,
  X,
  Sun,
  Waves,
  ShoppingCart,
  Award,
  Users,
  Clock,
  Home,
  ShieldCheck,
  Building2,
} from 'lucide-react';

// ─── Landing: Orla Guanabara by Emccamp — região do Caminho Niemeyer, Niterói ───
// Head (title/description/canonical/OG) e JSON-LD são gerados no build a partir de
// src/seo/routes.ts (rota /orla-guanabara-niteroi). O Helmet abaixo repete os dados para
// a navegação interna (SPA). Fonte dos dados: book oficial (ver src/data/orlaGuanabara.ts).

const SLUG = '/orla-guanabara-niteroi';
const URL_PAGINA = `https://queromeumcmv.com.br${SLUG}`;
const EMPREENDIMENTO = 'Orla Guanabara — Niterói';
const TITLE = 'Orla Guanabara Niterói | 2 Quartos MCMV a partir de R$ 299 mil';
const DESCRIPTION =
  'Orla Guanabara, da Emccamp, perto do Caminho Niemeyer: 2 quartos com varanda, rooftop com vista para a Baía e Minha Casa Minha Vida. A partir de R$ 299 mil.';
const PRECO = 'R$ 299.000';
const FORM = 'lead_orla_guanabara';

const img = (nome: string) => `/orla-guanabara-niteroi-${nome}.webp`;

type Foto = { src: string; alt: string; label: string; w: number; h: number };
const f = (nome: string, label: string, alt: string, w: number, h: number): Foto => ({ src: img(nome), label, alt, w, h });

const FOTOS_LAZER: Foto[] = [
  f('rooftop', 'Rooftop com vista para a Baía', 'Rooftop do Orla Guanabara com vista para a Baía de Guanabara, em Niterói', 1800, 616),
  f('piscina', 'Piscina adulto e infantil', 'Piscina adulto e infantil com deck no Orla Guanabara, Niterói', 1800, 1274),
  f('salao-de-festas', 'Salão de festas', 'Salão de festas do Orla Guanabara', 1800, 1274),
  f('espaco-gourmet', 'Espaço gourmet', 'Espaço gourmet no rooftop do Orla Guanabara', 1051, 762),
  f('academia-musculacao', 'Academia — musculação', 'Academia de musculação no rooftop do Orla Guanabara', 1800, 1274),
  f('academia-cardio', 'Academia — cárdio', 'Academia cárdio no rooftop do Orla Guanabara', 1800, 1274),
  f('academia-de-ginastica', 'Academia de ginástica', 'Academia de ginástica do Orla Guanabara', 1052, 762),
  f('quadra-de-areia', 'Quadra de areia', 'Quadra de areia do Orla Guanabara, Niterói', 1051, 1540),
  f('playground', 'Playground', 'Playground do Orla Guanabara', 1051, 762),
  f('brinquedoteca', 'Brinquedoteca', 'Brinquedoteca do Orla Guanabara', 1051, 762),
  f('salao-de-jogos', 'Salão de jogos', 'Salão de jogos no rooftop do Orla Guanabara', 1051, 762),
  f('espaco-pet', 'Espaço pet', 'Espaço pet do Orla Guanabara', 1051, 767),
  f('espaco-beleza', 'Espaço beleza', 'Espaço beleza do Orla Guanabara', 1101, 764),
  f('lavanderia', 'Lavanderia', 'Lavanderia do Orla Guanabara', 1101, 762),
];

const FOTOS_APTO: Foto[] = [
  f('living-integrado', 'Living integrado', 'Living decorado do apartamento de 2 quartos do Orla Guanabara', 1400, 1689),
  f('living-varanda', 'Living e varanda', 'Living com acesso à varanda no Orla Guanabara', 1800, 1274),
  f('living-2', 'Sala de estar e jantar', 'Sala de estar e jantar decorada do Orla Guanabara', 1800, 1236),
  f('living-3', 'Cozinha integrada', 'Cozinha integrada à sala no apartamento do Orla Guanabara', 1800, 1274),
  f('cozinha', 'Cozinha', 'Cozinha do apartamento do Orla Guanabara', 1194, 1688),
  f('suite', 'Suíte', 'Suíte do apartamento de 2 quartos do Orla Guanabara', 1800, 1274),
  f('quarto', 'Quarto', 'Segundo quarto do apartamento do Orla Guanabara', 1195, 1689),
  f('banheiro', 'Banheiro', 'Banheiro do apartamento do Orla Guanabara', 1195, 1689),
];

const FOTOS_FACHADA: Foto[] = [
  f('vista-aerea-caminho-niemeyer', 'Vista aérea', 'Vista aérea do Orla Guanabara perto do Caminho Niemeyer e da Baía de Guanabara, Niterói', 1800, 983),
  f('fachada-lojas', 'Fachada com lojas', 'Fachada do Orla Guanabara com lojas no térreo, na Rua Jornalista Rogério Coelho Neto', 1800, 1274),
  f('fachada-torres', 'Torres', 'As duas torres de 24 pavimentos do Orla Guanabara, em Niterói', 1121, 1132),
  f('vista-baia-de-guanabara', 'Baía de Guanabara', 'Vista da região do Caminho Niemeyer e da Baía de Guanabara, em Niterói', 1800, 822),
  f('implantacao', 'Implantação', 'Implantação do Orla Guanabara com térreo e rooftops dos blocos 01 e 02', 1800, 1273),
];

type Tipo = {
  id: string;
  nome: string;
  area: string;
  destaques: string[];
  plantas: Foto[];
};

const TIPOS: Tipo[] = [
  {
    id: '2q-suite',
    nome: '2 quartos com suíte e varanda',
    area: '45,66 m²',
    destaques: ['Suíte', 'Varanda com ponto para grill', 'Paredes removíveis'],
    plantas: [
      f('planta-2-quartos-suite-45m2', '2 quartos com suíte · 45,66 m²', 'Planta do apartamento de 2 quartos com suíte e varanda, 45,66 m², do Orla Guanabara', 1100, 784),
      f('planta-3d-2-quartos-suite', 'Planta 3D · 2 quartos com suíte', 'Planta 3D decorada do apartamento de 2 quartos com suíte do Orla Guanabara', 1106, 1235),
    ],
  },
  {
    id: '2q',
    nome: '2 quartos com varanda',
    area: '40,54 m²',
    destaques: ['Varanda com ponto para grill', 'Paredes removíveis'],
    plantas: [f('planta-2-quartos-40m2', '2 quartos · 40,54 m²', 'Planta do apartamento de 2 quartos com varanda, 40,54 m², do Orla Guanabara', 976, 801)],
  },
];

const TEMPOS: Array<[string, string]> = [
  ['Terminal João Goulart', '3 a 5 min'],
  ['Shopping Bay Market', '3 a 5 min'],
  ['Estação das Barcas', '5 a 8 min'],
  ['Plaza Niterói', '5 a 10 min'],
  ['UFF — Campus do Gragoatá', '10 a 15 min'],
  ['Hospital Universitário Antônio Pedro', '10 a 15 min'],
];

function Oferta({ claro = false }: { claro?: boolean }) {
  return (
    <div>
      <p className={`text-sm ${claro ? 'text-cyan-50/90' : 'text-slate-600'}`}>A partir de</p>
      <p className={`text-4xl font-extrabold tracking-tight ${claro ? 'text-white' : 'text-[#0B3B44]'}`}>
        {PRECO}
        <span className="text-[#F2B23A]">*</span>
      </p>
      <p className={`mt-1 text-xs leading-snug ${claro ? 'text-cyan-50/90' : 'text-slate-600'}`}>{GUANABARA_AVISO_PRECO}</p>
    </div>
  );
}

type Modal = { tipo?: Tipo } | null;

export default function OrlaGuanabaraNiteroi() {
  const [modal, setModal] = useState<Modal>(null);
  const [foto, setFoto] = useState<{ lista: Foto[]; i: number } | null>(null);
  const [galeria, setGaleria] = useState<'lazer' | 'apto' | 'fachada'>('lazer');
  const dlgForm = useRef<HTMLDialogElement>(null);
  const dlgFoto = useRef<HTMLDialogElement>(null);

  const push = (obj: Record<string, unknown>) => {
    try {
      const w = window as any;
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push(obj);
    } catch (_) {}
  };

  useEffect(() => {
    const d = dlgForm.current;
    if (!d) return;
    if (modal && !d.open) {
      d.showModal();
      push({ event: 'form_open', form_name: FORM, empreendimento: EMPREENDIMENTO });
    }
    if (!modal && d.open) d.close();
  }, [modal]);

  useEffect(() => {
    const d = dlgFoto.current;
    if (!d) return;
    if (foto && !d.open) d.showModal();
    if (!foto && d.open) d.close();
  }, [foto]);

  const consultar = (tipo: Tipo) => {
    push({ event: 'unidade_click', empreendimento: EMPREENDIMENTO, unidade_interesse: `${tipo.nome} ${tipo.area}` });
    setModal({ tipo });
  };
  const fecharForm = () => {
    push({ event: 'form_close', form_name: FORM, empreendimento: EMPREENDIMENTO });
    setModal(null);
  };
  const verFoto = (lista: Foto[], i: number) => setFoto({ lista, i });
  const passo = (d: number) => setFoto((x) => (x ? { lista: x.lista, i: (x.i + d + x.lista.length) % x.lista.length } : x));

  const fotosGaleria = galeria === 'lazer' ? FOTOS_LAZER : galeria === 'apto' ? FOTOS_APTO : FOTOS_FACHADA;

  return (
    <div className="min-h-screen bg-[#F3F7F7] font-sans text-[#1F2D30] selection:bg-[#0F6E78] selection:text-white">
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
        <meta property="og:image" content="https://queromeumcmv.com.br/og/orla-guanabara-niteroi.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="Niterói" />
        <link rel="preload" as="image" href={img('vista-aerea-caminho-niemeyer-800')} media="(max-width: 767px)" fetchPriority="high" />
        <link rel="preload" as="image" href={img('vista-aerea-caminho-niemeyer')} media="(min-width: 768px)" fetchPriority="high" />
      </Helmet>

      <Header />

      <main id="main-content">
        {/* ── PRIMEIRA DOBRA ── */}
        <section className="relative overflow-hidden text-white">
          <picture>
            <source media="(max-width: 767px)" srcSet={img('vista-aerea-caminho-niemeyer-800')} />
            <img
              src={img('vista-aerea-caminho-niemeyer')}
              alt="Vista aérea do Orla Guanabara perto do Caminho Niemeyer, com a Baía de Guanabara ao fundo"
              width={1800}
              height={983}
              fetchPriority="high"
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#062B32]/95 via-[#062B32]/80 to-[#062B32]/50" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 lg:py-14">
            <nav className="mb-6 text-sm text-cyan-50/80" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1">
                <li><Link to="/" className="hover:text-white">Início</Link></li>
                <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
                <li><Link to="/niteroirj" className="hover:text-white">Imóveis em Niterói</Link></li>
                <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
                <li className="font-semibold text-white" aria-current="page">Orla Guanabara</li>
              </ol>
            </nav>

            <div className="grid gap-x-8 gap-y-6 lg:grid-cols-12 lg:items-center">
              <div className="order-1 space-y-4 lg:col-span-7 lg:row-start-1 lg:space-y-5">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold tracking-widest">
                  LANÇAMENTO EMCCAMP · MINHA CASA MINHA VIDA
                </p>
                <h1 className="text-[1.75rem] font-extrabold leading-tight sm:text-3xl md:text-[2.6rem]">
                  Orla Guanabara: 2 quartos com varanda e rooftop com vista definitiva para a Baía de Guanabara, em Niterói
                </h1>
                <p className="max-w-2xl text-base leading-relaxed text-cyan-50/90 sm:text-lg">
                  Perto do Caminho Niemeyer, com Terminal João Goulart e Bay Market a poucos minutos. Termine o dia no rooftop,
                  com a Baía à sua frente.
                </p>
                <p className="flex items-start gap-2 text-cyan-50/90">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#F2B23A]" />
                  Rua Jornalista Rogério Coelho Neto, 250 · Niterói – RJ
                </p>
                <div className="max-w-xl rounded-2xl border border-white/15 bg-white/10 p-4 sm:p-5">
                  <Oferta claro />
                </div>
              </div>

              <div className="order-3 lg:col-span-7 lg:row-start-2">
                <ul className="grid max-w-xl gap-2 text-sm sm:grid-cols-2" aria-label="Destaques">
                  {['2 quartos de 40,54 m² e 45,66 m²', 'Opção com suíte', 'Rooftop em cada torre', 'Piscina, academia e minimarket'].map((t) => (
                    <li key={t} className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#F2B23A]" />{t}</li>
                  ))}
                </ul>
              </div>

              <aside
                id="formulario"
                className="order-2 scroll-mt-24 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1"
                aria-label="Formulário de consulta"
              >
                <div className="rounded-2xl border-t-4 border-[#F2B23A] bg-white p-6 text-[#1F2D30] shadow-2xl">
                  <h2 className="text-xl font-extrabold leading-snug text-[#0B3B44]">Receba as plantas e consulte as unidades</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Você recebe pelo WhatsApp as plantas, as unidades disponíveis e a simulação do Minha Casa Minha Vida.
                  </p>
                  <div className="mt-4">
                    <LeadForm
                      compacto
                      semMoldura
                      confirmarGravacao
                      idPrefix="hero-"
                      titulo=""
                      subtitulo=""
                      empreendimento={EMPREENDIMENTO}
                      cidadeFixa="Niterói"
                      formName={FORM}
                      textoBotao="Quero consultar as unidades"
                    />
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ── BENEFÍCIOS ── */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold tracking-[0.3em] text-[#0F6E78]">POR QUE MORAR AQUI</p>
            <h2 className="mt-2 text-3xl font-bold text-[#0B3B44]">Um novo horizonte para morar em Niterói</h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-slate-700">
              O Orla Guanabara é um condomínio residencial da Emccamp na Rua Jornalista Rogério Coelho Neto, 250, na região do
              Caminho Niemeyer, em Niterói. São 700 apartamentos de 2 quartos em duas torres de 24 pavimentos, com lojas no
              térreo, lazer completo e um rooftop em cada torre com vista para a Baía de Guanabara. O empreendimento é enquadrado
              no Minha Casa Minha Vida.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: <Sun className="h-6 w-6" />,
                  t: 'A Baía como paisagem',
                  d: 'Dois rooftops, um em cada torre, com vista definitiva para a Baía de Guanabara. Para o café de domingo e o pôr do sol depois do trabalho.',
                },
                {
                  icon: <Waves className="h-6 w-6" />,
                  t: 'Lazer para todas as idades',
                  d: 'Piscina adulto e infantil, quadra de areia, playground, brinquedoteca, três academias, salões de festas e de jogos e espaço gourmet.',
                },
                {
                  icon: <ShoppingCart className="h-6 w-6" />,
                  t: 'Praticidade no dia a dia',
                  d: 'Minimarket, lavanderia, espaço beleza e bicicletário no condomínio. No apartamento, gás e água individualizados.',
                },
              ].map((b) => (
                <div key={b.t} className="rounded-2xl border border-[#D5E3E4] bg-white p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F6E78]/10 text-[#0F6E78]">{b.icon}</span>
                  <h3 className="mt-4 text-lg font-bold text-[#0B3B44]">{b.t}</h3>
                  <p className="mt-2 leading-relaxed text-slate-700">{b.d}</p>
                </div>
              ))}
            </div>
            <dl className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Unidades', '700 apartamentos'],
                ['Torres', '2 · 24 pavimentos'],
                ['Terreno', '4.691,02 m²'],
                ['Vagas', '22 de carro + bicicletário'],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-[#0B3B44] p-4 text-white">
                  <dt className="text-xs uppercase tracking-wide text-cyan-100/80">{k}</dt>
                  <dd className="mt-1 font-bold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── PLANTAS ── */}
        <section className="bg-white py-16" id="plantas">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold tracking-[0.3em] text-[#0F6E78]">PLANTAS</p>
            <h2 className="mt-2 text-3xl font-bold text-[#0B3B44]">Duas plantas de 2 quartos, as duas com varanda</h2>
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {TIPOS.map((t) => (
                <article key={t.id} className="flex flex-col overflow-hidden rounded-2xl border border-[#D5E3E4] bg-[#F7FAFA]">
                  <button type="button" onClick={() => verFoto(t.plantas, 0)} className="flex h-72 items-center justify-center bg-white p-4" aria-label={`Ampliar planta: ${t.nome}`}>
                    <img src={t.plantas[0].src} alt={t.plantas[0].alt} width={t.plantas[0].w} height={t.plantas[0].h} loading="lazy" className="max-h-full max-w-full object-contain" />
                  </button>
                  <div className="flex flex-1 flex-col gap-3 p-6">
                    <h3 className="text-xl font-bold text-[#0B3B44]">{t.nome} · {t.area}</h3>
                    <ul className="flex flex-wrap gap-1.5">
                      {t.destaques.map((d) => (
                        <li key={d} className="rounded-full border border-[#D5E3E4] bg-white px-2.5 py-1 text-xs">{d}</li>
                      ))}
                    </ul>
                    {t.plantas.length > 1 && (
                      <button type="button" onClick={() => verFoto(t.plantas, 1)} className="self-start text-sm font-semibold text-[#0F6E78] underline">
                        Ver a planta 3D decorada
                      </button>
                    )}
                    <button type="button" onClick={() => consultar(t)} className="mt-auto min-h-[48px] rounded-xl bg-[#0F6E78] font-bold text-white hover:bg-[#0B5860]">
                      Consultar esta planta
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-8 rounded-2xl bg-[#0B3B44] p-6 text-white">
              <p className="font-bold">Em todos os apartamentos</p>
              <ul className="mt-3 grid gap-2 text-sm text-cyan-50/90 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  'Previsão para instalação de ar-condicionado',
                  'Paredes removíveis, conforme plantas de contrato',
                  'Ponto para grill na varanda',
                  'Gás canalizado e individualizado',
                  'Água individualizada',
                  'Chuveiro a gás',
                ].map((t) => (
                  <li key={t} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-[#F2B23A]" />{t}</li>
                ))}
              </ul>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Plantas ilustrativas, com layout sugerido. As medidas podem sofrer alteração de até 5%, conforme o book da
              incorporadora. Itens conforme memorial descritivo; equipamentos e medidor de gás a cargo do proprietário.
            </p>
          </div>
        </section>

        {/* ── GALERIA ── */}
        <section className="bg-[#0B3B44] py-16 text-white" id="galeria">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold tracking-[0.3em] text-[#F2B23A]">GALERIA</p>
            <h2 className="mt-2 text-3xl font-bold">Lazer completo, do térreo aos rooftops</h2>
            <div role="tablist" aria-label="Ambientes" className="mt-6 flex flex-wrap gap-2">
              {([
                ['lazer', 'Lazer e áreas comuns'],
                ['apto', 'Apartamento decorado'],
                ['fachada', 'Fachada e região'],
              ] as const).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={galeria === id}
                  onClick={() => setGaleria(id)}
                  className={`min-h-[44px] rounded-full border px-4 text-sm font-semibold transition-colors ${
                    galeria === id ? 'border-white bg-white text-[#0B3B44]' : 'border-white/40 hover:border-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
              {fotosGaleria.map((ft, i) => (
                <button key={ft.src} type="button" onClick={() => verFoto(fotosGaleria, i)} className="group relative aspect-[4/3] overflow-hidden rounded-xl text-left">
                  <img src={ft.src} alt={ft.alt} width={ft.w} height={ft.h} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 py-2 text-sm font-semibold">{ft.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-10 grid gap-4 text-sm md:grid-cols-3">
              <div className="rounded-xl bg-white/10 p-4">
                <p className="font-bold text-[#F2B23A]">Térreo</p>
                <p className="mt-1 text-cyan-50/90">Piscina adulto e infantil com deck, quadra de areia, playground, espaço pet, espaço beleza, lavanderia, minimarket, bicicletário e lojas.</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4">
                <p className="font-bold text-[#F2B23A]">Rooftop · bloco 01</p>
                <p className="mt-1 text-cyan-50/90">Academia cárdio, academia de musculação, academia de ginástica, brinquedoteca e rooftop.</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4">
                <p className="font-bold text-[#F2B23A]">Rooftop · bloco 02</p>
                <p className="mt-1 text-cyan-50/90">Dois salões de festas, espaço gourmet, salão de jogos e rooftop.</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-cyan-50/70">Imagens meramente ilustrativas. Layout sugerido; as áreas comuns serão entregues conforme o memorial descritivo.</p>
          </div>
        </section>

        {/* ── LOCALIZAÇÃO ── */}
        <section className="py-16" id="localizacao">
          <div className="max-w-7xl mx-auto grid items-start gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-[#0F6E78]">LOCALIZAÇÃO</p>
              <h2 className="mt-2 text-3xl font-bold text-[#0B3B44]">Viva Niterói de um novo ângulo</h2>
              <p className="mt-3 leading-relaxed text-slate-700">
                Na região do Caminho Niemeyer, onde arte, arquitetura e a Baía de Guanabara se encontram, numa área que vive a
                revitalização do Centro de Niterói.
              </p>
              <p className="mt-3 flex items-start gap-2 text-slate-700">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#0F6E78]" />
                Rua Jornalista Rogério Coelho Neto, 250 — Niterói, RJ
              </p>
              <button type="button" onClick={() => verFoto(FOTOS_FACHADA, 3)} className="mt-6 block w-full overflow-hidden rounded-2xl">
                <img src={img('vista-baia-de-guanabara')} alt={FOTOS_FACHADA[3].alt} width={1800} height={822} loading="lazy" className="h-64 w-full object-cover" />
              </button>
            </div>
            <div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {TEMPOS.map(([lugar, tempo]) => (
                  <li key={lugar} className="flex items-center justify-between gap-3 rounded-xl border border-[#D5E3E4] bg-white px-4 py-3">
                    <span className="text-sm font-medium">{lugar}</span>
                    <span className="flex items-center gap-1 whitespace-nowrap text-sm font-bold text-[#0F6E78]"><Clock className="h-4 w-4" />{tempo}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-slate-500">Tempos aproximados informados no book da incorporadora.</p>
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[#D5E3E4] bg-white p-5">
                <Building2 className="mt-0.5 h-6 w-6 shrink-0 text-[#0F6E78]" />
                <p className="text-sm leading-relaxed text-slate-700">
                  <strong className="text-[#0B3B44]">Emccamp Residencial:</strong> mais de 49 anos de experiência, mais de 75 mil
                  unidades entregues e em construção e atuação em mais de 16 cidades de SP, MG e RJ, segundo a construtora.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-white py-16" id="duvidas">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-center text-3xl font-bold text-[#0B3B44]">Dúvidas frequentes sobre o Orla Guanabara</h2>
            <div className="space-y-3">
              {FAQ_GUANABARA.map((q, i) => (
                <details key={q.pergunta} open={i === 0} className="group rounded-xl border border-[#D5E3E4] bg-[#F7FAFA] p-5">
                  <summary className="flex cursor-pointer list-none justify-between gap-4 font-bold text-[#0B3B44]">
                    <h3 className="text-base">{q.pergunta}</h3>
                    <ChevronRight className="h-5 w-5 shrink-0 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 leading-relaxed text-slate-700">{q.resposta}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CORRETOR (E-E-A-T) ── */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-6 rounded-2xl border border-[#D5E3E4] bg-white p-6 md:grid-cols-[160px_1fr] md:p-8">
              <img src="/joel-marcos-corretor-de-imoveis-itaborai.webp" alt="Joel Marcos, corretor de imóveis CRECI 39.583F" width={160} height={160} loading="lazy" className="mx-auto h-32 w-32 rounded-full object-cover md:h-40 md:w-40" />
              <div className="space-y-3">
                <p className="text-xs font-bold tracking-[0.3em] text-[#0F6E78]">QUEM VAI TE ATENDER</p>
                <h2 className="text-2xl font-bold text-[#0B3B44]">Joel Marcos — Corretor de Imóveis · CRECI 39.583F</h2>
                <p className="leading-relaxed text-slate-700">
                  Corretor desde 2002, especialista em Minha Casa Minha Vida, com atendimento em Itaboraí, São Gonçalo e Niterói.
                  Envio as plantas, confiro a disponibilidade com a construtora e acompanho a simulação e a análise de crédito.
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1.5"><Award className="h-4 w-4 text-[#0F6E78]" />24 anos de mercado</span>
                  <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-[#0F6E78]" />Seg a sex, 9h às 17h</span>
                  <Link to="/sobre" className="text-[#0F6E78] underline">Conheça o corretor</Link>
                </div>
                <p className="text-xs text-slate-500">
                  Informações extraídas do book oficial da Emccamp (material provisório, outubro de 2026), conferidas em{' '}
                  {GUANABARA_DATA_CONFERENCIA}. Preço inicial informado pelo corretor.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="relative overflow-hidden py-16 text-white" id="contato">
          <img src={img('rooftop')} alt="" aria-hidden="true" width={1800} height={616} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#062B32]/85" />
          <div className="relative max-w-6xl mx-auto grid items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="space-y-5">
              <h2 className="text-3xl font-bold leading-tight md:text-4xl">Seu novo horizonte começa com uma consulta.</h2>
              <Oferta claro />
              <ul className="space-y-2 text-cyan-50/90">
                <li className="flex gap-2"><Home className="h-5 w-5 shrink-0 text-[#F2B23A]" />Plantas e unidades disponíveis</li>
                <li className="flex gap-2"><ShieldCheck className="h-5 w-5 shrink-0 text-[#F2B23A]" />Simulação do Minha Casa Minha Vida</li>
                <li className="flex gap-2"><Sun className="h-5 w-5 shrink-0 text-[#F2B23A]" />Atendimento por corretor credenciado</li>
              </ul>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <LeadForm
                compacto
                confirmarGravacao
                idPrefix="final-"
                titulo="Receba as plantas e consulte as unidades"
                subtitulo="Preencha seus dados e envio tudo pelo WhatsApp."
                empreendimento={EMPREENDIMENTO}
                cidadeFixa="Niterói"
                formName={FORM}
                textoBotao="Quero consultar as unidades"
              />
            </div>
          </div>
        </section>

        {/* ── LINKS INTERNOS + AVISOS ── */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto grid gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {[
              ['/niteroirj', 'Imóveis em Niterói', 'Outras opções de apartamentos em Niterói.'],
              ['/orla-central-niteroi', 'Orla Central', 'Lançamento da Cury no Centro de Niterói.'],
              ['/bosque-residence-niteroi', 'Bosque Residence', 'Lançamento da Crescer no Fonseca.'],
              ['/financiamento-minha-casa-minha-vida', 'Financiamento Minha Casa Minha Vida', 'Entenda renda, subsídio e parcelas.'],
            ].map(([to, t, d]) => (
              <Link key={to} to={to} className="rounded-xl border border-[#D5E3E4] bg-white p-5 transition-all hover:border-[#0F6E78] hover:shadow-md">
                <p className="font-bold text-[#0B3B44]">{t}</p>
                <p className="mt-1 text-sm text-slate-600">{d}</p>
              </Link>
            ))}
          </div>
          <p className="max-w-7xl mx-auto mt-8 px-4 text-xs leading-relaxed text-slate-500 sm:px-6 lg:px-8">
            {GUANABARA_AVISO_PRECO} Imagens e plantas meramente ilustrativas, com layout sugerido. Por se tratar de empreendimento a
            ser construído, o projeto poderá sofrer alterações sem aviso prévio; prevalece o Memorial de Incorporação registrado.
            Financiamento sujeito à análise e aprovação de crédito. Construtora: Emccamp Residencial. Intermediação: Joel Marcos,
            corretor de imóveis, CRECI 39.583F.
          </p>
        </section>
      </main>

      {/* Barra fixa no celular (o WhatsApp fica no botão flutuante padrão do site, à direita) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white py-2.5 pl-3 pr-20 shadow-[0_-6px_18px_rgba(0,0,0,0.08)] lg:hidden">
        <a href="#formulario" className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#0F6E78] font-extrabold text-white">
          Consultar as unidades
        </a>
      </div>
      <div className="h-20 lg:hidden" aria-hidden="true" />

      <Footer />

      {/* ── POP-UP: consultar planta (abre só por clique) ── */}
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
        aria-label="Consultar planta do Orla Guanabara"
        className="m-auto w-full max-w-lg bg-transparent p-0 backdrop:bg-[#062B32]/70 max-sm:mb-0 max-sm:max-w-none"
      >
        {modal && (
          <div className="relative max-h-[92vh] overflow-y-auto rounded-2xl bg-white max-sm:rounded-b-none">
            <button type="button" onClick={fecharForm} aria-label="Fechar" className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200">
              <X className="h-5 w-5 text-[#0B3B44]" />
            </button>
            <div className="px-5 pt-5 pr-16">
              <p className="text-[11px] font-bold tracking-[0.25em] text-[#0F6E78]">ORLA GUANABARA · NITERÓI</p>
              {modal.tipo && <p className="mt-1 text-sm text-slate-600">Planta: <strong>{modal.tipo.nome} · {modal.tipo.area}</strong></p>}
            </div>
            <LeadForm
              key={modal.tipo?.id || 'geral'}
              compacto
              confirmarGravacao
              idPrefix="popup-"
              titulo="Receba esta planta e consulte as unidades"
              subtitulo="Envio a planta e as unidades disponíveis pelo WhatsApp."
              empreendimento={EMPREENDIMENTO}
              cidadeFixa="Niterói"
              quartosInicial="2 quartos"
              unidadeInteresse={modal.tipo ? `${modal.tipo.nome} ${modal.tipo.area}` : ''}
              formName={FORM}
              textoBotao="Quero consultar as unidades"
            />
          </div>
        )}
      </dialog>

      {/* ── LIGHTBOX ── */}
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
        aria-label="Galeria de imagens do Orla Guanabara"
        className="m-auto w-[95vw] max-w-6xl bg-transparent p-0 backdrop:bg-black/90"
      >
        {foto && (
          <figure className="relative">
            <img src={foto.lista[foto.i].src} alt={foto.lista[foto.i].alt} className="max-h-[82vh] w-full rounded-lg bg-white object-contain" />
            <figcaption className="mt-3 flex justify-between gap-4 text-sm text-white">
              <span>{foto.lista[foto.i].label} · Imagem meramente ilustrativa</span>
              <span>{foto.i + 1}/{foto.lista.length}</span>
            </figcaption>
            <button type="button" onClick={() => setFoto(null)} aria-label="Fechar galeria" className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white">
              <X className="h-5 w-5" />
            </button>
            {foto.lista.length > 1 && (
              <>
                <button type="button" onClick={() => passo(-1)} aria-label="Imagem anterior" className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white">
                  <ChevronRight className="h-6 w-6 rotate-180" />
                </button>
                <button type="button" onClick={() => passo(1)} aria-label="Próxima imagem" className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </figure>
        )}
      </dialog>
    </div>
  );
}
