import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import { FAQ_SUNIN, SUNIN_AVISO_PRECO, SUNIN_DATA_CONFERENCIA, SUNIN_PRECO_A_PARTIR } from '../data/sunInStudio';
import {
  MapPin,
  CheckCircle2,
  ChevronRight,
  X,
  Sun,
  Bike,
  Key,
  Award,
  Users,
  Clock,
  Home,
  ShieldCheck,
  Building2,
  TrendingUp,
} from 'lucide-react';

// ─── Landing: Sun In Studio Design (RDR Engenharia) — Centro de Niterói ───
// Head (title/description/canonical/OG) e JSON-LD são gerados no build a partir de
// src/seo/routes.ts (rota /sun-in-studio-design-niteroi). O Helmet abaixo repete os dados
// para a navegação interna (SPA). Fonte dos dados: apresentação oficial (ver src/data/sunInStudio.ts).

const SLUG = '/sun-in-studio-design-niteroi';
const URL_PAGINA = `https://queromeumcmv.com.br${SLUG}`;
const EMPREENDIMENTO = 'Sun In Studio Design — Niterói';
const TITLE = 'Sun In Studio Design Niterói | Studios a partir de R$ 295 mil';
const DESCRIPTION =
  'Sun In Studio Design, da RDR Engenharia, no Centro de Niterói: studios de 24 a 30 m² perto da UFF, rooftop com piscina e sky bar. A partir de R$ 295 mil.';
const FORM = 'lead_sun_in_studio';

const img = (nome: string) => `/sun-in-studio-design-niteroi-${nome}.webp`;
const PRECO = SUNIN_PRECO_A_PARTIR ? `R$ ${SUNIN_PRECO_A_PARTIR.toLocaleString('pt-BR')}` : null;

type Foto = { src: string; alt: string; label: string; w: number; h: number };
const f = (nome: string, label: string, alt: string, w: number, h: number): Foto => ({ src: img(nome), label, alt, w, h });

const FOTOS_ROOFTOP: Foto[] = [
  f('piscina-rooftop', 'Piscina no rooftop', 'Piscina no rooftop do Sun In Studio Design com vista para Niterói', 1367, 710),
  f('sky-bar', 'Sky bar', 'Sky bar no rooftop do Sun In Studio Design, Centro de Niterói', 1200, 658),
  f('terraco-rooftop', 'Deck', 'Deck do rooftop do Sun In Studio Design', 661, 533),
  f('academia', 'Academia', 'Academia no rooftop do Sun In Studio Design', 1312, 664),
  f('spa', 'Spa', 'Spa no rooftop do Sun In Studio Design', 821, 608),
  f('sauna', 'Sauna', 'Sauna no rooftop do Sun In Studio Design', 486, 685),
  f('coliving', 'Espaço coliving', 'Espaço coliving no rooftop do Sun In Studio Design', 1203, 601),
  f('espaco-gourmet', 'Espaço gourmet', 'Espaço gourmet do Sun In Studio Design', 1217, 607),
];

const FOTOS_TERREO: Foto[] = [
  f('portaria', 'Portaria', 'Portaria do Sun In Studio Design, na Rua São Sebastião, Centro de Niterói', 1374, 652),
  f('hall-elevadores', 'Hall com 2 elevadores', 'Hall com dois elevadores da torre única do Sun In Studio Design', 1150, 710),
  f('praca', 'Praça', 'Praça do Sun In Studio Design', 1385, 676),
  f('pet-place', 'Pet place', 'Pet place do Sun In Studio Design', 1354, 676),
  f('coworking', 'Coworking', 'Coworking do Sun In Studio Design', 1273, 655),
  f('sala-de-reuniao', 'Sala de reunião', 'Sala de reunião do Sun In Studio Design', 1273, 655),
  f('minimercado', 'Minimercado', 'Minimercado do Sun In Studio Design', 506, 661),
  f('delivery', 'Espaço delivery', 'Espaço delivery do Sun In Studio Design', 529, 661),
  f('lavanderia', 'Lavanderia', 'Lavanderia do Sun In Studio Design', 1173, 627),
  f('bicicletario', 'Bicicletário', 'Bicicletário com 209 vagas do Sun In Studio Design', 1173, 627),
];

const FOTOS_STUDIO: Foto[] = [
  f('studio-decorado', 'Studio decorado', 'Studio decorado do Sun In Studio Design, em Niterói', 1190, 642),
  f('fachada-torre', 'Torre única', 'Torre única do Sun In Studio Design no Centro de Niterói', 462, 719),
];

type Planta = { id: string; finais: string; area: string; foto: Foto };
const PLANTAS: Planta[] = [
  { id: '01-04', finais: 'Finais 01, 02, 03 e 04', area: 'a partir de 24,21 m²', foto: f('planta-studio-final-01-02-03-04', 'Studio finais 01 a 04', 'Planta do studio finais 01, 02, 03 e 04, a partir de 24,21 m², do Sun In Studio Design', 1061, 405) },
  { id: '05-06', finais: 'Finais 05 e 06', area: 'a partir de 24,03 m²', foto: f('planta-studio-final-05-06', 'Studio finais 05 e 06', 'Planta do studio finais 05 e 06, a partir de 24,03 m², do Sun In Studio Design', 1111, 411) },
  { id: '07-08', finais: 'Finais 07 e 08', area: 'a partir de 24,80 m²', foto: f('planta-studio-final-07-08', 'Studio finais 07 e 08', 'Planta do studio finais 07 e 08, a partir de 24,80 m², do Sun In Studio Design', 1128, 430) },
  { id: '09-10', finais: 'Finais 09 e 10', area: 'a partir de 30,32 m²', foto: f('planta-studio-final-09-10', 'Studio finais 09 e 10', 'Planta do studio finais 09 e 10, a partir de 30,32 m², do Sun In Studio Design', 815, 432) },
  { id: '11-14', finais: 'Finais 11, 12, 13 e 14', area: 'a partir de 24,21 m²', foto: f('planta-studio-final-11-12-13-14', 'Studio finais 11 a 14', 'Planta do studio finais 11, 12, 13 e 14, a partir de 24,21 m², do Sun In Studio Design', 827, 390) },
];

const PERTO: Array<[string, string]> = [
  ['UFF — Campus Valonguinho', 'a poucos passos'],
  ['Plaza Shopping', 'a poucos passos'],
  ['Praia das Flechas', '3 min de bicicleta'],
  ['Terminal das Barcas', '5 min de bicicleta'],
];

function Oferta({ claro = false }: { claro?: boolean }) {
  if (!PRECO) {
    return (
      <div>
        <p className={`text-lg font-extrabold ${claro ? 'text-white' : 'text-[#1E2A44]'}`}>Studios de 24 a 30 m² no Centro de Niterói</p>
        <p className={`mt-1 text-sm ${claro ? 'text-orange-50/90' : 'text-slate-600'}`}>Receba a tabela atualizada e as unidades disponíveis com o corretor.</p>
      </div>
    );
  }
  return (
    <div>
      <p className={`text-sm ${claro ? 'text-orange-50/90' : 'text-slate-600'}`}>A partir de</p>
      <p className={`text-4xl font-extrabold tracking-tight ${claro ? 'text-white' : 'text-[#1E2A44]'}`}>
        {PRECO}
        <span className="text-[#F5A25D]">*</span>
      </p>
      <p className={`mt-1 text-xs leading-snug ${claro ? 'text-orange-50/90' : 'text-slate-600'}`}>{SUNIN_AVISO_PRECO}</p>
    </div>
  );
}

type Modal = { planta?: Planta } | null;

export default function SunInStudioDesignNiteroi() {
  const [modal, setModal] = useState<Modal>(null);
  const [foto, setFoto] = useState<{ lista: Foto[]; i: number } | null>(null);
  const [galeria, setGaleria] = useState<'rooftop' | 'terreo' | 'studio'>('rooftop');
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

  const consultar = (planta: Planta) => {
    push({ event: 'unidade_click', empreendimento: EMPREENDIMENTO, unidade_interesse: `Studio ${planta.finais}` });
    setModal({ planta });
  };
  const fecharForm = () => {
    push({ event: 'form_close', form_name: FORM, empreendimento: EMPREENDIMENTO });
    setModal(null);
  };
  const verFoto = (lista: Foto[], i: number) => setFoto({ lista, i });
  const passo = (d: number) => setFoto((x) => (x ? { lista: x.lista, i: (x.i + d + x.lista.length) % x.lista.length } : x));
  const fotosGaleria = galeria === 'rooftop' ? FOTOS_ROOFTOP : galeria === 'terreo' ? FOTOS_TERREO : FOTOS_STUDIO;

  return (
    <div className="min-h-screen bg-[#FBF6EF] font-sans text-[#23262E] selection:bg-[#C25A12] selection:text-white">
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
        <meta property="og:image" content="https://queromeumcmv.com.br/og/sun-in-studio-design-niteroi.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="Niterói" />
        <link rel="preload" as="image" href={img('piscina-rooftop-800')} media="(max-width: 767px)" fetchPriority="high" />
        <link rel="preload" as="image" href={img('piscina-rooftop')} media="(min-width: 768px)" fetchPriority="high" />
      </Helmet>

      <Header />

      <main id="main-content">
        {/* ── PRIMEIRA DOBRA ── */}
        <section className="relative overflow-hidden text-white">
          <picture>
            <source media="(max-width: 767px)" srcSet={img('piscina-rooftop-800')} />
            <img
              src={img('piscina-rooftop')}
              alt="Piscina no rooftop do Sun In Studio Design com vista para o mar e a cidade de Niterói"
              width={1367}
              height={710}
              fetchPriority="high"
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#1E2A44]/95 via-[#1E2A44]/80 to-[#1E2A44]/45" />

          <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:py-14">
            <nav className="mb-4 text-sm text-orange-50/80 sm:mb-6" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1">
                <li><Link to="/" className="hover:text-white">Início</Link></li>
                <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
                <li><Link to="/niteroirj" className="hover:text-white">Imóveis em Niterói</Link></li>
                <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
                <li className="font-semibold text-white" aria-current="page">Sun In Studio Design</li>
              </ol>
            </nav>

            <div className="grid gap-x-8 gap-y-6 lg:grid-cols-12 lg:items-center">
              <div className="order-1 space-y-3 sm:space-y-4 lg:col-span-7 lg:row-start-1 lg:space-y-5">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold tracking-widest">
                  RDR ENGENHARIA · FINANCIAMENTO CAIXA
                </p>
                <h1 className="text-[1.6rem] font-extrabold leading-tight sm:text-3xl md:text-[2.6rem]">
                  Sun In Studio Design: studios no Centro de Niterói com piscina e sky bar no rooftop, a poucos passos da UFF
                </h1>
                <p className="max-w-2xl text-base leading-relaxed text-orange-50/90 sm:text-lg">
                  Para morar perto de tudo ou investir em um endereço com procura o ano todo: UFF e Plaza Shopping a pé, barcas a
                  5 minutos de bicicleta.
                </p>
                <p className="flex items-start gap-2 text-orange-50/90">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#F5A25D]" />
                  Rua São Sebastião · Centro, Niterói – RJ
                </p>
                <div className="max-w-xl rounded-2xl border border-white/15 bg-white/10 p-4 sm:p-5">
                  <Oferta claro />
                </div>
              </div>

              <div className="order-3 lg:col-span-7 lg:row-start-2">
                <ul className="grid max-w-xl gap-2 text-sm sm:grid-cols-2" aria-label="Destaques">
                  {['Studios de 24,03 a 30,32 m²', 'Piscina, sky bar e spa no rooftop', 'Coworking e coliving', 'Minimercado e lavanderia'].map((t) => (
                    <li key={t} className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#F5A25D]" />{t}</li>
                  ))}
                </ul>
              </div>

              <aside id="formulario" className="order-2 scroll-mt-24 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1" aria-label="Formulário de consulta">
                <div className="rounded-2xl border-t-4 border-[#E8792B] bg-white p-6 text-[#23262E] shadow-2xl">
                  <h2 className="text-xl font-extrabold leading-snug text-[#1E2A44]">Receba as plantas e consulte os studios</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Você recebe pelo WhatsApp as plantas, os studios disponíveis e as condições de compra.
                  </p>
                  <div className="mt-4">
                    <LeadForm
                      semMoldura
                      confirmarGravacao
                      idPrefix="hero-"
                      titulo=""
                      subtitulo=""
                      empreendimento={EMPREENDIMENTO}
                      formName={FORM}
                      textoBotao="Quero consultar os studios"
                    />
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ── BENEFÍCIOS ── */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold tracking-[0.3em] text-[#C25A12]">POR QUE O SUN IN</p>
            <h2 className="mt-2 text-3xl font-bold text-[#1E2A44]">Sua vida gira aqui</h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-slate-700">
              O Sun In Studio Design é um empreendimento da RDR Engenharia na Rua São Sebastião, no Centro de Niterói, com 209
              studios em torre única de 19 pavimentos, lazer na cobertura com vista mar e serviços no térreo. Financiamento pela
              CAIXA.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: <Sun className="h-6 w-6" />,
                  t: 'Lazer na cobertura',
                  d: 'Piscina com deck, sky bar, academia, spa e sauna no rooftop. O fim de tarde com vista para o mar sem sair do prédio.',
                },
                {
                  icon: <Bike className="h-6 w-6" />,
                  t: 'Tudo perto, sem depender de carro',
                  d: 'UFF e Plaza Shopping a pé, barcas e Praia das Flechas de bicicleta, e uma vaga de bike para cada studio.',
                },
                {
                  icon: <Building2 className="h-6 w-6" />,
                  t: 'Serviços no dia a dia',
                  d: 'Minimercado, lavanderia, espaço delivery, coworking e sala de reunião no térreo para a rotina andar sozinha.',
                },
              ].map((b) => (
                <div key={b.t} className="rounded-2xl border border-[#EADCC8] bg-white p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8792B]/10 text-[#C25A12]">{b.icon}</span>
                  <h3 className="mt-4 text-lg font-bold text-[#1E2A44]">{b.t}</h3>
                  <p className="mt-2 leading-relaxed text-slate-700">{b.d}</p>
                </div>
              ))}
            </div>
            <dl className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Unidades', '209 studios'],
                ['Torre', 'Única · 19 pavimentos · 2 elevadores'],
                ['Apartamentos', 'Em 15 pavimentos'],
                ['Vagas', '42 de garagem + 209 de bike'],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-[#1E2A44] p-4 text-white">
                  <dt className="text-xs uppercase tracking-wide text-orange-100/80">{k}</dt>
                  <dd className="mt-1 font-bold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── PLANTAS ── */}
        <section className="bg-white py-16" id="plantas">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold tracking-[0.3em] text-[#C25A12]">PLANTAS</p>
            <h2 className="mt-2 text-3xl font-bold text-[#1E2A44]">Studios de 24,03 m² a 30,32 m²</h2>
            <p className="mt-3 max-w-3xl text-slate-700">
              Ambientes integrados e bem resolvidos: cozinha, estar e dormitório em um só espaço, com banheiro privativo.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {PLANTAS.map((p) => (
                <article key={p.id} className="flex flex-col overflow-hidden rounded-2xl border border-[#EADCC8] bg-[#FDFAF5]">
                  <button type="button" onClick={() => verFoto(PLANTAS.map((x) => x.foto), PLANTAS.indexOf(p))} className="flex h-44 items-center justify-center bg-white p-3" aria-label={`Ampliar planta: studio ${p.finais}`}>
                    <img src={p.foto.src} alt={p.foto.alt} width={p.foto.w} height={p.foto.h} loading="lazy" className="max-h-full max-w-full object-contain" />
                  </button>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#C25A12]">Studio</p>
                    <h3 className="text-lg font-bold text-[#1E2A44]">{p.finais}</h3>
                    <p className="text-sm text-slate-600">{p.area}</p>
                    <button type="button" onClick={() => consultar(p)} className="mt-auto min-h-[48px] rounded-xl bg-[#C25A12] font-bold text-white hover:bg-[#A84B0D]">
                      Consultar esta planta
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500">Plantas e imagens meramente ilustrativas, conforme a apresentação da incorporadora. Metragens a partir de.</p>
          </div>
        </section>

        {/* ── PARA INVESTIR ── */}
        <section className="py-16">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <button type="button" onClick={() => verFoto(FOTOS_STUDIO, 0)} className="overflow-hidden rounded-2xl shadow-lg">
              <img src={img('studio-decorado')} alt="Studio decorado do Sun In Studio Design, em Niterói" width={1190} height={642} loading="lazy" className="h-72 w-full object-cover" />
            </button>
            <div className="space-y-4">
              <p className="text-xs font-bold tracking-[0.3em] text-[#C25A12]">PARA MORAR OU INVESTIR</p>
              <h2 className="text-3xl font-bold text-[#1E2A44]">Um studio com procura de quem estuda, trabalha e visita Niterói</h2>
              <ul className="space-y-2 text-slate-700">
                <li className="flex gap-2"><TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-[#C25A12]" />O aluguel em Niterói subiu cerca de 10,6% em um ano (QuintoAndar, publicado por O Globo em agosto de 2024).</li>
                <li className="flex gap-2"><Key className="mt-0.5 h-5 w-5 shrink-0 text-[#C25A12]" />Potencial de locação para turistas e para quem estuda na UFF, segundo a incorporadora.</li>
                <li className="flex gap-2"><Home className="mt-0.5 h-5 w-5 shrink-0 text-[#C25A12]" />Coliving, coworking e lavanderia no prédio, serviços que o hóspede e o morador valorizam.</li>
              </ul>
              <p className="text-xs text-slate-500">Rentabilidade não é garantida: depende de ocupação, diárias e custos. O corretor apresenta o estudo de mercado da incorporadora.</p>
              <button type="button" onClick={() => setModal({})} className="inline-flex min-h-[48px] items-center rounded-xl bg-[#1E2A44] px-6 font-bold text-white hover:bg-[#151E33]">
                Quero receber o estudo e os valores
              </button>
            </div>
          </div>
        </section>

        {/* ── GALERIA ── */}
        <section className="bg-[#1E2A44] py-16 text-white" id="galeria">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold tracking-[0.3em] text-[#F5A25D]">GALERIA</p>
            <h2 className="mt-2 text-3xl font-bold">Mais de 10 itens de lazer e conveniência</h2>
            <div role="tablist" aria-label="Ambientes" className="mt-6 flex flex-wrap gap-2">
              {([
                ['rooftop', 'Rooftop'],
                ['terreo', 'Térreo e serviços'],
                ['studio', 'Studio e fachada'],
              ] as const).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={galeria === id}
                  onClick={() => setGaleria(id)}
                  className={`min-h-[44px] rounded-full border px-4 text-sm font-semibold transition-colors ${
                    galeria === id ? 'border-white bg-white text-[#1E2A44]' : 'border-white/40 hover:border-white'
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
            <div className="mt-10 grid gap-4 text-sm md:grid-cols-2">
              <div className="rounded-xl bg-white/10 p-4">
                <p className="font-bold text-[#F5A25D]">Rooftop</p>
                <p className="mt-1 text-orange-50/90">Piscina, deck, sky bar, academia, spa, sauna, espaço coliving, gourmet interno e banheiro acessível.</p>
              </div>
              <div className="rounded-xl bg-white/10 p-4">
                <p className="font-bold text-[#F5A25D]">Térreo</p>
                <p className="mt-1 text-orange-50/90">Portaria, loja, praça, pet place, coworking, sala de reunião, minimercado, lavanderia, espaço delivery e bicicletário.</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-orange-50/70">Imagens meramente ilustrativas.</p>
          </div>
        </section>

        {/* ── LOCALIZAÇÃO ── */}
        <section className="py-16" id="localizacao">
          <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-[#C25A12]">LOCALIZAÇÃO</p>
              <h2 className="mt-2 text-3xl font-bold text-[#1E2A44]">No Centro de Niterói, entre a UFF, o Plaza e o mar</h2>
              <p className="mt-3 flex items-start gap-2 text-slate-700">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#C25A12]" />
                Rua São Sebastião — Centro, Niterói, RJ
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {PERTO.map(([lugar, tempo]) => (
                  <li key={lugar} className="flex items-center justify-between gap-3 rounded-xl border border-[#EADCC8] bg-white px-4 py-3">
                    <span className="text-sm font-medium">{lugar}</span>
                    <span className="flex items-center gap-1 whitespace-nowrap text-sm font-bold text-[#C25A12]"><Clock className="h-4 w-4" />{tempo}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-slate-500">Distâncias informadas na apresentação da incorporadora.</p>
            </div>
            <button type="button" onClick={() => verFoto([f('mapa-localizacao', 'Mapa de localização', 'Mapa de localização do Sun In Studio Design no Centro de Niterói', 1136, 679)], 0)} className="overflow-hidden rounded-2xl border border-[#EADCC8] bg-white">
              <img src={img('mapa-localizacao')} alt="Mapa com o Sun In Studio Design na Rua São Sebastião, perto do Plaza Shopping, da UFF, das barcas e da Praia das Flechas" width={1136} height={679} loading="lazy" className="w-full" />
            </button>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-white py-16" id="duvidas">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-center text-3xl font-bold text-[#1E2A44]">Dúvidas frequentes sobre o Sun In Studio Design</h2>
            <div className="space-y-3">
              {FAQ_SUNIN.map((q, i) => (
                <details key={q.pergunta} open={i === 0} className="group rounded-xl border border-[#EADCC8] bg-[#FDFAF5] p-5">
                  <summary className="flex cursor-pointer list-none justify-between gap-4 font-bold text-[#1E2A44]">
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
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-6 rounded-2xl border border-[#EADCC8] bg-white p-6 md:grid-cols-[160px_1fr] md:p-8">
              <img src="/joel-marcos-corretor-de-imoveis-itaborai.webp" alt="Joel Marcos, corretor de imóveis CRECI 39.583F" width={160} height={160} loading="lazy" className="mx-auto h-32 w-32 rounded-full object-cover md:h-40 md:w-40" />
              <div className="space-y-3">
                <p className="text-xs font-bold tracking-[0.3em] text-[#C25A12]">QUEM VAI TE ATENDER</p>
                <h2 className="text-2xl font-bold text-[#1E2A44]">Joel Marcos — Corretor de Imóveis · CRECI 39.583F</h2>
                <p className="leading-relaxed text-slate-700">
                  Corretor desde 2002, com atendimento em Itaboraí, São Gonçalo e Niterói. Envio as plantas, confiro a
                  disponibilidade com a incorporadora e acompanho a simulação e a análise de crédito na CAIXA.
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1.5"><Award className="h-4 w-4 text-[#C25A12]" />24 anos de mercado</span>
                  <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-[#C25A12]" />Seg a sex, 9h às 17h</span>
                  <Link to="/sobre" className="text-[#C25A12] underline">Conheça o corretor</Link>
                </div>
                <p className="text-xs text-slate-500">
                  Informações extraídas da apresentação oficial da RDR Engenharia, conferidas em {SUNIN_DATA_CONFERENCIA}.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="relative overflow-hidden py-16 text-white" id="contato">
          <img src={img('sky-bar')} alt="" aria-hidden="true" width={1200} height={658} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#1E2A44]/85" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="space-y-5">
              <h2 className="text-3xl font-bold leading-tight md:text-4xl">Seu studio no Centro de Niterói, com o mar no rooftop.</h2>
              <Oferta claro />
              <ul className="space-y-2 text-orange-50/90">
                <li className="flex gap-2"><Home className="h-5 w-5 shrink-0 text-[#F5A25D]" />Plantas e studios disponíveis</li>
                <li className="flex gap-2"><ShieldCheck className="h-5 w-5 shrink-0 text-[#F5A25D]" />Condições de compra direta e financiamento CAIXA</li>
                <li className="flex gap-2"><Sun className="h-5 w-5 shrink-0 text-[#F5A25D]" />Atendimento por corretor credenciado</li>
              </ul>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <LeadForm
                confirmarGravacao
                idPrefix="final-"
                titulo="Receba as plantas e consulte os studios"
                subtitulo="Responda em menos de 1 minuto e envio tudo pelo WhatsApp."
                empreendimento={EMPREENDIMENTO}
                formName={FORM}
                textoBotao="Quero consultar os studios"
              />
            </div>
          </div>
        </section>

        {/* ── LINKS INTERNOS + AVISOS ── */}
        <section className="py-12">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {[
              ['/niteroirj', 'Imóveis em Niterói', 'Outras opções de apartamentos em Niterói.'],
              ['/orla-guanabara-niteroi', 'Orla Guanabara', 'Lançamento da Emccamp perto do Caminho Niemeyer.'],
              ['/orla-central-niteroi', 'Orla Central', 'Lançamento da Cury no Centro de Niterói.'],
              ['/bosque-residence-niteroi', 'Bosque Residence', 'Lançamento da Crescer no Fonseca.'],
            ].map(([to, t, d]) => (
              <Link key={to} to={to} className="rounded-xl border border-[#EADCC8] bg-white p-5 transition-all hover:border-[#C25A12] hover:shadow-md">
                <p className="font-bold text-[#1E2A44]">{t}</p>
                <p className="mt-1 text-sm text-slate-600">{d}</p>
              </Link>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-7xl px-4 text-xs leading-relaxed text-slate-500 sm:px-6 lg:px-8">
            {PRECO ? `${SUNIN_AVISO_PRECO} ` : ''}Imagens e plantas meramente ilustrativas. Por se tratar de empreendimento a ser
            construído, o projeto poderá sofrer alterações. Financiamento CAIXA sujeito à análise e aprovação de crédito.
            Rentabilidade não garantida. Incorporadora: RDR Engenharia. Intermediação: Joel Marcos, corretor de imóveis, CRECI
            39.583F.
          </p>
        </section>
      </main>

      {/* Barra fixa no celular (o WhatsApp fica no botão flutuante padrão do site, à direita) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white py-2.5 pl-3 pr-20 shadow-[0_-6px_18px_rgba(0,0,0,0.08)] lg:hidden">
        <a href="#formulario" className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#C25A12] font-extrabold text-white">
          Consultar os studios
        </a>
      </div>
      <div className="h-20 lg:hidden" aria-hidden="true" />

      <Footer />

      {/* ── POP-UP (abre só por clique) ── */}
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
        aria-label="Consultar studios do Sun In Studio Design"
        className="m-auto w-full max-w-lg bg-transparent p-0 backdrop:bg-[#1E2A44]/70 max-sm:mb-0 max-sm:max-w-none"
      >
        {modal && (
          <div className="relative max-h-[92vh] overflow-y-auto rounded-2xl bg-white max-sm:rounded-b-none">
            <button type="button" onClick={fecharForm} aria-label="Fechar" className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200">
              <X className="h-5 w-5 text-[#1E2A44]" />
            </button>
            <div className="px-5 pr-16 pt-5">
              <p className="text-[11px] font-bold tracking-[0.25em] text-[#C25A12]">SUN IN STUDIO DESIGN · NITERÓI</p>
              {modal.planta && <p className="mt-1 text-sm text-slate-600">Planta: <strong>Studio {modal.planta.finais} · {modal.planta.area}</strong></p>}
            </div>
            <LeadForm
              key={modal.planta?.id || 'geral'}
              confirmarGravacao
              idPrefix="popup-"
              titulo={modal.planta ? 'Receba esta planta e consulte os studios' : 'Receba o estudo e os valores'}
              subtitulo="Envio as informações pelo WhatsApp."
              empreendimento={EMPREENDIMENTO}
              cidadeFixa="Niterói"
              unidadeInteresse={modal.planta ? `Studio ${modal.planta.finais}` : ''}
              objetivo={modal.planta ? '' : 'Investir'}
              formName={FORM}
              textoBotao="Quero consultar os studios"
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
        aria-label="Galeria de imagens do Sun In Studio Design"
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
