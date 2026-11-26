import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import { OPEN_AVISO_PRECO, OPEN_DATA_CONFERENCIA, FAQ_OPEN } from '../data/niteroiOpen';
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
  ShoppingBag,
  Car,
  Trees,
  Wifi,
  Clock,
} from 'lucide-react';

// ─── Landing: Niterói Open Residencial (GPCON) — Bairro Chic, Fonseca, Niterói · últimas unidades ───
// Head (title/description/canonical/OG) e JSON-LD são gerados no build a partir de
// src/seo/routes.ts (rota /niteroi-open-residence). O Helmet abaixo repete os dados para a
// navegação interna (SPA). Fonte dos dados: book oficial (ver src/data/niteroiOpen.ts).

const SLUG = '/niteroi-open-residence';
const URL_PAGINA = `https://queromeumcmv.com.br${SLUG}`;
const EMPREENDIMENTO = 'Niterói Open Residencial — Fonseca';
const TITLE = 'Niterói Open Residencial | Últimas Unidades, R$ 287 mil';
const DESCRIPTION =
  'Niterói Open Residencial, da GPCON, no Fonseca: lofts e 2 quartos com varanda, piscina com prainha e coworking. Últimas unidades a partir de R$ 287 mil.';
const PRECO = 'R$ 287.000';
const FORM = 'lead_niteroi_open';

const img = (nome: string) => `/niteroi-open-residencial-${nome}.webp`;

type Foto = { src: string; alt: string; label: string; w: number; h: number };
const f = (nome: string, label: string, alt: string, w = 1800, h = 1012): Foto => ({ src: img(nome), label, alt, w, h });

const FOTOS_LAZER: Foto[] = [
  f('piscina-com-prainha', 'Piscina com prainha', 'Piscina com prainha do Niterói Open Residencial, no Fonseca'),
  f('solarium-churrasqueira', 'Solarium com churrasqueira', 'Solarium com churrasqueira do Niterói Open Residencial'),
  f('espaco-gourmet-salao-de-festas', 'Espaço gourmet com salão', 'Espaço gourmet integrado ao salão de festas do Niterói Open Residencial'),
  f('espaco-fitness', 'Espaço fitness', 'Espaço fitness do Niterói Open Residencial'),
  f('coworking', 'Coworking', 'Coworking com sala de reunião do Niterói Open Residencial'),
  f('espaco-kids', 'Espaço kids', 'Espaço kids do Niterói Open Residencial'),
  f('espaco-pet-shower', 'Pet shower', 'Espaço pet shower do Niterói Open Residencial'),
  f('bicicletario', 'Bicicletário', 'Bicicletário com recarga para bicicletas elétricas do Niterói Open Residencial'),
];

const FOTOS_APTO: Foto[] = [
  f('sala-conceito-aberto', 'Sala em conceito aberto', 'Sala e cozinha em conceito aberto do apartamento decorado do Niterói Open Residencial', 1800, 1013),
  f('varanda-gourmet', 'Varanda gourmet', 'Varanda gourmet das unidades das colunas 1 e 10 do Niterói Open Residencial'),
  f('suite', 'Suíte', 'Suíte decorada do Niterói Open Residencial'),
  f('dormitorio-infantil', 'Dormitório infantil', 'Dormitório infantil decorado do Niterói Open Residencial'),
];

const FOTOS_FACHADA: Foto[] = [
  f('fachada', 'Fachada', 'Fachada do Niterói Open Residencial, prédio da GPCON no Bairro Chic, Fonseca, Niterói', 1200, 1080),
  f('portaria', 'Portaria', 'Portaria do Niterói Open Residencial'),
  f('vista-aerea-fonseca', 'Vista aérea do Fonseca', 'Vista aérea ilustrativa do Niterói Open Residencial no bairro do Fonseca, em Niterói'),
];

type Grupo = 'loft' | '2q' | '2qs' | 'cob';
type Tipo = { id: string; grupo: Grupo; nome: string; area: string; detalhe: string; destaques: string[]; planta: Foto; quartos: string };
const p = (nome: string, label: string, w: number, h: number): Foto => ({
  src: img(`planta-${nome}`),
  label,
  alt: `Planta ${label} do Niterói Open Residencial, Fonseca, Niterói`,
  w,
  h,
});

const TIPOS: Tipo[] = [
  { id: 't1', grupo: '2qs', quartos: '2 quartos', nome: '2 quartos com suíte e varanda gourmet', area: '54,50 m²', detalhe: 'Colunas 1 e 10 · com vaga', destaques: ['Suíte', 'Varanda gourmet', 'Infra para split na sala'], planta: p('tipo-1-2-quartos-suite-54m2', 'do 2 quartos com suíte e varanda gourmet (54,50 m²)', 1479, 1041) },
  { id: 't2', grupo: '2q', quartos: '2 quartos', nome: '2 quartos com varanda', area: '53,50 m²', detalhe: 'Colunas 2 e 9', destaques: ['Varanda', 'Conceito aberto'], planta: p('tipo-2-2-quartos-53m2', 'do 2 quartos com varanda (53,50 m², colunas 2 e 9)', 1479, 1041) },
  { id: 't4', grupo: '2q', quartos: '2 quartos', nome: '2 quartos com varanda', area: '53,50 m²', detalhe: 'Colunas 4 e 7', destaques: ['Varanda', 'Conceito aberto'], planta: p('tipo-4-2-quartos-53m2', 'do 2 quartos com varanda (53,50 m², colunas 4 e 7)', 1479, 1041) },
  { id: 't8', grupo: '2q', quartos: '2 quartos', nome: '2 quartos com varanda', area: '52,10 m²', detalhe: 'Coluna 8', destaques: ['Varanda', 'Varanda de serviço'], planta: p('tipo-8-2-quartos-52m2', 'do 2 quartos com varanda (52,10 m², coluna 8)', 1144, 1041) },
  { id: 't5', grupo: '2q', quartos: '2 quartos', nome: '2 quartos com varanda', area: '50,40 m²', detalhe: 'Colunas 5 e 6 · sem vaga', destaques: ['Varanda', 'Varanda de serviço'], planta: p('tipo-5-2-quartos-50m2', 'do 2 quartos com varanda (50,40 m², colunas 5 e 6)', 1479, 1041) },
  { id: 'loft', grupo: 'loft', quartos: '1 quarto', nome: 'Loft com varanda', area: '45,10 m²', detalhe: 'Coluna 3', destaques: ['Salão adaptável', 'Varanda'], planta: p('loft-45m2', 'do loft com varanda (45,10 m²)', 1144, 1041) },
  { id: 'loft-pcd', grupo: 'loft', quartos: '1 quarto', nome: 'Loft adaptado (PcD)', area: '45,10 m²', detalhe: 'Aptos 203 e 303 · com vaga', destaques: ['Adaptado para PcD', 'Varanda'], planta: p('loft-pcd-45m2', 'do loft adaptado para PcD (45,10 m²)', 1144, 1041) },
  { id: 'cob1', grupo: 'cob', quartos: '3 quartos', nome: 'Cobertura linear 3 quartos', area: '144,00 m²', detalhe: 'Cobertura 901 · 1 vaga', destaques: ['Suíte', 'Terraço com espaço gourmet', 'Previsão para piscina'], planta: p('cobertura-1-144m2', 'da cobertura linear 901 (144 m²)', 1461, 904) },
  { id: 'cob2', grupo: 'cob', quartos: '3 quartos', nome: 'Cobertura linear 3 quartos', area: '142,00 m²', detalhe: 'Cobertura 902 · 1 vaga', destaques: ['Suíte', 'Terraço com espaço gourmet', 'Previsão para piscina'], planta: p('cobertura-2-142m2', 'da cobertura linear 902 (142 m²)', 1461, 946) },
];

const FILTROS: Array<{ id: 'todos' | Grupo; label: string }> = [
  { id: 'todos', label: 'Todas' },
  { id: 'loft', label: 'Lofts' },
  { id: '2q', label: '2 quartos' },
  { id: '2qs', label: '2 quartos com suíte' },
  { id: 'cob', label: 'Coberturas' },
];

const PERTO = [
  { grupo: 'Mobilidade', icon: <Car className="h-5 w-5" />, itens: ['1 min da Alameda São Boaventura', '5 min da Ponte Rio–Niterói', '10 min do Centro de Niterói', '30 min do Centro do Rio'] },
  { grupo: 'No dia a dia', icon: <ShoppingBag className="h-5 w-5" />, itens: ['3 min de escolas, supermercados e farmácias'] },
  { grupo: 'Natureza', icon: <Trees className="h-5 w-5" />, itens: ['A poucos passos do Horto do Fonseca'] },
  { grupo: 'Praias', icon: <Waves className="h-5 w-5" />, itens: ['15 min da Praia de Icaraí', '20 min da orla de São Francisco', '25 min das Praias Oceânicas'] },
];

function Oferta({ claro = false }: { claro?: boolean }) {
  return (
    <div>
      <p className={`text-sm ${claro ? 'text-rose-50/90' : 'text-slate-600'}`}>A partir de</p>
      <p className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${claro ? 'text-white' : 'text-[#1B2A5C]'}`}>
        {PRECO}
        <span className="text-[#F26B5B]">*</span>
      </p>
      <p className={`mt-1 text-xs leading-snug ${claro ? 'text-rose-50/90' : 'text-slate-600'}`}>{OPEN_AVISO_PRECO}</p>
    </div>
  );
}

type Modal = { tipo?: Tipo } | null;

export default function NiteroiOpenResidence() {
  const [modal, setModal] = useState<Modal>(null);
  const [foto, setFoto] = useState<{ lista: Foto[]; i: number } | null>(null);
  const [filtro, setFiltro] = useState<'todos' | Grupo>('todos');
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
  const tiposVisiveis = TIPOS.filter((t) => filtro === 'todos' || t.grupo === filtro);
  const fotosGaleria = galeria === 'lazer' ? FOTOS_LAZER : galeria === 'apto' ? FOTOS_APTO : FOTOS_FACHADA;

  return (
    <div className="min-h-screen bg-[#F6F4F1] font-sans text-[#1E2433] selection:bg-[#B3243A] selection:text-white">
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
        <meta property="og:image" content="https://queromeumcmv.com.br/og/niteroi-open-residencial.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="Niterói" />
        <link rel="preload" as="image" href={img('fachada-800')} media="(max-width: 767px)" fetchPriority="high" />
        <link rel="preload" as="image" href={img('fachada')} media="(min-width: 768px)" fetchPriority="high" />
      </Helmet>

      <Header />

      <main id="main-content">
        {/* ── PRIMEIRA DOBRA ── */}
        <section className="relative overflow-hidden text-white">
          <picture>
            <source media="(max-width: 767px)" srcSet={img('fachada-800')} />
            <img
              src={img('fachada')}
              alt="Fachada do Niterói Open Residencial, da GPCON, no Bairro Chic, Fonseca, em Niterói"
              width={1200}
              height={1080}
              fetchPriority="high"
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
            />
          </picture>
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#141F45]/95 via-[#141F45]/80 to-[#141F45]/40" />

          <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:py-14">
            <nav className="mb-3 text-sm text-rose-50/80 sm:mb-6" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1">
                <li><Link to="/" className="hover:text-white">Início</Link></li>
                <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
                <li><Link to="/niteroirj" className="hover:text-white">Imóveis em Niterói</Link></li>
                <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
                <li className="font-semibold text-white" aria-current="page">Niterói Open Residencial</li>
              </ol>
            </nav>

            <div className="grid gap-x-8 gap-y-5 lg:grid-cols-12 lg:items-center">
              <div className="order-1 space-y-3 sm:space-y-4 lg:col-span-7 lg:row-start-1 lg:space-y-5">
                <p className="inline-flex items-center gap-2 rounded-full bg-[#E63946] px-3 py-1 text-xs font-extrabold tracking-widest text-white">
                  <Clock className="h-4 w-4" /> ÚLTIMAS UNIDADES!
                </p>
                <h1 className="text-[1.4rem] font-extrabold leading-snug sm:text-3xl sm:leading-tight md:text-[2.6rem]">
                  Niterói Open Residencial: lofts e 2 quartos com varanda no Fonseca, perto de tudo e longe do aluguel
                </h1>
                <p className="max-w-2xl text-[15px] leading-relaxed text-rose-50/90 sm:text-lg">
                  A 1 minuto da Alameda São Boaventura e a 5 da Ponte Rio–Niterói, com piscina com prainha, coworking e espaço
                  fitness no condomínio.
                </p>
                <p className="hidden items-start gap-2 text-rose-50/90 sm:flex">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#F26B5B]" />
                  Rua Antônio Silva, 7 · Bairro Chic, Fonseca – Niterói, RJ
                </p>
                <div className="max-w-xl rounded-2xl border border-white/15 bg-white/10 px-4 py-3 sm:p-5">
                  <Oferta claro />
                </div>
              </div>

              <div className="order-3 lg:col-span-7 lg:row-start-2">
                <ul className="grid max-w-xl gap-2 text-sm sm:grid-cols-2" aria-label="Destaques">
                  {['Últimas unidades disponíveis', 'Lofts, 2 quartos e coberturas', 'Opções com e sem vaga de garagem', 'Obra financiada com garantia da CAIXA'].map((t) => (
                    <li key={t} className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#F26B5B]" />{t}</li>
                  ))}
                </ul>
              </div>

              <aside id="formulario" className="order-2 scroll-mt-24 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1" aria-label="Formulário de consulta">
                <div className="rounded-2xl border-t-4 border-[#E63946] bg-white p-6 text-[#1E2433] shadow-2xl">
                  <h2 className="text-xl font-extrabold leading-snug text-[#1B2A5C]">Garanta uma das últimas unidades</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Você recebe pelo WhatsApp as plantas, as unidades que ainda restam e a simulação de financiamento.
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
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold tracking-[0.3em] text-[#B3243A]">POR QUE MORAR AQUI</p>
            <h2 className="mt-2 text-3xl font-bold text-[#1B2A5C]">Perto de tudo e longe do aluguel</h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-slate-700">
              O Niterói Open Residencial é um condomínio compacto da GPCON no Bairro Chic, no Fonseca, em Niterói: uma torre com 72
              unidades entre lofts, apartamentos de 2 quartos com ou sem suíte e 2 coberturas de 3 quartos, com 2 elevadores e lazer
              completo. Restam as últimas unidades.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: <Car className="h-6 w-6" />,
                  t: 'Saída rápida para Niterói e o Rio',
                  d: 'A 1 minuto da Alameda São Boaventura, a 5 da Ponte Rio–Niterói e a 10 do Centro de Niterói, segundo a incorporadora.',
                },
                {
                  icon: <Waves className="h-6 w-6" />,
                  t: 'Lazer para descansar sem sair de casa',
                  d: 'Piscina com prainha, solarium com churrasqueira, espaço gourmet com salão de festas, fitness, espaço kids e pet shower.',
                },
                {
                  icon: <Wifi className="h-6 w-6" />,
                  t: 'Rotina 2.0',
                  d: 'Coworking com sala de reunião, Wi-Fi e tomadas USB nas áreas comuns e recarga para bicicletas elétricas no bicicletário.',
                },
              ].map((b) => (
                <div key={b.t} className="rounded-2xl border border-[#E7E0DA] bg-white p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#B3243A]/10 text-[#B3243A]">{b.icon}</span>
                  <h3 className="mt-4 text-lg font-bold text-[#1B2A5C]">{b.t}</h3>
                  <p className="mt-2 leading-relaxed text-slate-700">{b.d}</p>
                </div>
              ))}
            </div>
            <dl className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Unidades', '72 em 1 torre'],
                ['Pavimentos', 'Térreo + jirau + 7 tipo + cobertura'],
                ['Elevadores', '2'],
                ['Vagas', '39 numeradas na escritura'],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-[#1B2A5C] p-4 text-white">
                  <dt className="text-xs uppercase tracking-wide text-rose-50/80">{k}</dt>
                  <dd className="mt-1 font-bold">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 rounded-2xl border border-[#E7E0DA] bg-white p-6">
              <p className="font-bold text-[#1B2A5C]">No seu apartamento</p>
              <ul className="mt-3 grid gap-2 text-slate-700 sm:grid-cols-2">
                {[
                  'Sala e cozinha em conceito aberto',
                  'Varanda em todas as unidades tipo',
                  'Pontos e vãos para ar-condicionado nos quartos e na sala',
                  'Infra para split na sala das colunas 1 e 10 e nas coberturas',
                  'Bancada em granito ou mármore sintético com cuba inox',
                  'DPS e dispositivo DR em todos os apartamentos',
                ].map((t) => (
                  <li key={t} className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#B3243A]" />{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── PLANTAS ── */}
        <section className="bg-white py-16" id="plantas">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold tracking-[0.3em] text-[#B3243A]">PLANTAS</p>
            <h2 className="mt-2 text-3xl font-bold text-[#1B2A5C]">Do loft à cobertura de 3 quartos</h2>
            <p className="mt-3 max-w-3xl text-slate-700">
              Áreas privativas de 45,10 m² a 144 m². Como restam poucas unidades, consulte quais plantas ainda estão disponíveis.
            </p>
            <div role="group" aria-label="Filtrar plantas" className="mt-6 flex flex-wrap gap-2">
              {FILTROS.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  aria-pressed={filtro === x.id}
                  onClick={() => setFiltro(x.id)}
                  className={`min-h-[44px] rounded-full border px-4 text-sm font-semibold transition-colors ${
                    filtro === x.id ? 'border-[#1B2A5C] bg-[#1B2A5C] text-white' : 'border-slate-300 bg-white hover:border-[#1B2A5C]'
                  }`}
                >
                  {x.label}
                </button>
              ))}
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tiposVisiveis.map((t) => (
                <article key={t.id} className="flex flex-col overflow-hidden rounded-2xl border border-[#E7E0DA] bg-[#FAF8F6]">
                  <button type="button" onClick={() => verFoto(TIPOS.map((x) => x.planta), TIPOS.indexOf(t))} className="flex h-56 items-center justify-center bg-white p-3" aria-label={`Ampliar planta: ${t.nome} ${t.area}`}>
                    <img src={t.planta.src} alt={t.planta.alt} width={t.planta.w} height={t.planta.h} loading="lazy" className="max-h-full max-w-full object-contain" />
                  </button>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#B3243A]">{t.detalhe}</p>
                    <h3 className="text-lg font-bold text-[#1B2A5C]">{t.nome} · {t.area}</h3>
                    <ul className="flex flex-wrap gap-1.5">
                      {t.destaques.map((d) => (
                        <li key={d} className="rounded-full border border-[#E7E0DA] bg-white px-2.5 py-1 text-xs">{d}</li>
                      ))}
                    </ul>
                    <button type="button" onClick={() => consultar(t)} className="mt-auto min-h-[48px] rounded-xl bg-[#B3243A] font-bold text-white hover:bg-[#961E31]">
                      Consultar esta planta
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Áreas privativas conforme o quadro de áreas do book. As cotas correspondem à área útil e podem variar até 5% na
              execução. Decoração ilustrativa; móveis e equipamentos não fazem parte do contrato. Construção em alvenaria estrutural
              autoportante.
            </p>
          </div>
        </section>

        {/* ── GALERIA ── */}
        <section className="bg-[#1B2A5C] py-16 text-white" id="galeria">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold tracking-[0.3em] text-[#F26B5B]">GALERIA</p>
            <h2 className="mt-2 text-3xl font-bold">Para reunir, relaxar e trabalhar</h2>
            <div role="tablist" aria-label="Ambientes" className="mt-6 flex flex-wrap gap-2">
              {([
                ['lazer', 'Lazer'],
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
                    galeria === id ? 'border-white bg-white text-[#1B2A5C]' : 'border-white/40 hover:border-white'
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
            <p className="mt-4 text-xs text-rose-50/70">
              Imagens meramente ilustrativas. A varanda gourmet existe nas unidades das colunas 1 e 10. Decoração, equipamentos,
              mobiliário e paisagismo são sugestões e não fazem parte do contrato.
            </p>
          </div>
        </section>

        {/* ── LOCALIZAÇÃO ── */}
        <section className="py-16" id="localizacao">
          <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-[#B3243A]">LOCALIZAÇÃO</p>
              <h2 className="mt-2 text-3xl font-bold text-[#1B2A5C]">Fonseca: perto da ponte, do Centro e do Horto</h2>
              <p className="mt-3 flex items-start gap-2 text-slate-700">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#B3243A]" />
                Rua Antônio Silva, 7, esquina com a Rua Capitão Dalvo Rabello Sampaio — Bairro Chic, Fonseca, Niterói, RJ
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {PERTO.map((g) => (
                  <div key={g.grupo} className="rounded-xl border border-[#E7E0DA] bg-white p-4">
                    <p className="flex items-center gap-2 font-bold text-[#1B2A5C]"><span className="text-[#B3243A]">{g.icon}</span>{g.grupo}</p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-700">{g.itens.map((i) => <li key={i}>{i}</li>)}</ul>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">Tempos de deslocamento informados no book da incorporadora.</p>
            </div>
            <button type="button" onClick={() => verFoto(FOTOS_FACHADA, 2)} className="overflow-hidden rounded-2xl shadow-lg">
              <img src={img('vista-aerea-fonseca')} alt={FOTOS_FACHADA[2].alt} width={1800} height={1012} loading="lazy" className="w-full" />
            </button>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-white py-16" id="duvidas">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-center text-3xl font-bold text-[#1B2A5C]">Dúvidas frequentes sobre o Niterói Open Residencial</h2>
            <div className="space-y-3">
              {FAQ_OPEN.map((q, i) => (
                <details key={q.pergunta} open={i === 0} className="group rounded-xl border border-[#E7E0DA] bg-[#FAF8F6] p-5">
                  <summary className="flex cursor-pointer list-none justify-between gap-4 font-bold text-[#1B2A5C]">
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
            <div className="grid items-center gap-6 rounded-2xl border border-[#E7E0DA] bg-white p-6 md:grid-cols-[160px_1fr] md:p-8">
              <img src="/joel-marcos-corretor-de-imoveis-itaborai.webp" alt="Joel Marcos, corretor de imóveis CRECI 39.583F" width={160} height={160} loading="lazy" className="mx-auto h-32 w-32 rounded-full object-cover md:h-40 md:w-40" />
              <div className="space-y-3">
                <p className="text-xs font-bold tracking-[0.3em] text-[#B3243A]">QUEM VAI TE ATENDER</p>
                <h2 className="text-2xl font-bold text-[#1B2A5C]">Joel Marcos — Corretor de Imóveis · CRECI 39.583F</h2>
                <p className="leading-relaxed text-slate-700">
                  Corretor desde 2002, com atendimento em Itaboraí, São Gonçalo e Niterói. Envio as plantas, confiro com a
                  construtora quais unidades ainda restam, agendo a visita ao decorado e acompanho a simulação e a análise de crédito.
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1.5"><Award className="h-4 w-4 text-[#B3243A]" />24 anos de mercado</span>
                  <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-[#B3243A]" />Seg a sex, 9h às 17h</span>
                  <Link to="/sobre" className="text-[#B3243A] underline">Conheça o corretor</Link>
                </div>
                <p className="text-xs text-slate-500">
                  Informações extraídas do book digital oficial da GPCON (julho de 2023), conferidas em {OPEN_DATA_CONFERENCIA}.
                  Preço inicial e disponibilidade informados pelo corretor.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="relative overflow-hidden py-16 text-white" id="contato">
          <img src={img('piscina-com-prainha')} alt="" aria-hidden="true" width={1800} height={1012} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#141F45]/85" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="space-y-5">
              <p className="inline-flex items-center gap-2 rounded-full bg-[#E63946] px-3 py-1 text-xs font-extrabold tracking-widest">
                <Clock className="h-4 w-4" /> ÚLTIMAS UNIDADES!
              </p>
              <h2 className="text-3xl font-bold leading-tight md:text-4xl">Consulte agora quais unidades ainda restam.</h2>
              <Oferta claro />
              <ul className="space-y-2 text-rose-50/90">
                <li className="flex gap-2"><Home className="h-5 w-5 shrink-0 text-[#F26B5B]" />Plantas e unidades disponíveis</li>
                <li className="flex gap-2"><ShieldCheck className="h-5 w-5 shrink-0 text-[#F26B5B]" />Simulação de financiamento para a sua renda</li>
                <li className="flex gap-2"><Building2 className="h-5 w-5 shrink-0 text-[#F26B5B]" />Visita ao apartamento decorado</li>
              </ul>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <LeadForm
                confirmarGravacao
                idPrefix="final-"
                titulo="Garanta uma das últimas unidades"
                subtitulo="Responda em menos de 1 minuto e envio tudo pelo WhatsApp."
                empreendimento={EMPREENDIMENTO}
                formName={FORM}
                textoBotao="Quero consultar as unidades"
              />
            </div>
          </div>
        </section>

        {/* ── LINKS INTERNOS + AVISOS ── */}
        <section className="py-12">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {[
              ['/niteroirj', 'Imóveis em Niterói', 'Outras opções de apartamentos em Niterói.'],
              ['/caminhos-guanabara-niteroi', 'Caminhos da Guanabara', 'Lançamento da Cury no Caminho Niemeyer.'],
              ['/orla-central-niteroi', 'Orla Central', 'Apartamentos no Centro de Niterói.'],
              ['/financiamento-minha-casa-minha-vida', 'Financiamento', 'Como funciona o financiamento do seu imóvel.'],
            ].map(([to, t, d]) => (
              <Link key={to} to={to} className="rounded-xl border border-[#E7E0DA] bg-white p-5 transition-all hover:border-[#B3243A] hover:shadow-md">
                <p className="font-bold text-[#1B2A5C]">{t}</p>
                <p className="mt-1 text-sm text-slate-600">{d}</p>
              </Link>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-7xl px-4 text-xs leading-relaxed text-slate-500 sm:px-6 lg:px-8">
            {OPEN_AVISO_PRECO} Imagens e plantas meramente ilustrativas. Registro da incorporação prenotado no Registro de Imóveis do
            14º Ofício de Justiça de Niterói, sob o nº 92130, em 30/05/2023. Incorporação e construção: GPCON Incorporações e
            Construções Ltda. Projeto aprovado na PMN (650/000018/2022). Financiamento sujeito à análise e aprovação de crédito.
            Intermediação: Joel Marcos, corretor de imóveis, CRECI 39.583F.
          </p>
        </section>
      </main>

      {/* Barra fixa no celular (o WhatsApp fica no botão flutuante padrão do site, à direita) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white py-2.5 pl-3 pr-20 shadow-[0_-6px_18px_rgba(0,0,0,0.08)] lg:hidden">
        <a href="#formulario" className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#B3243A] font-extrabold text-white">
          Consultar as últimas unidades
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
        aria-label="Consultar planta do Niterói Open Residencial"
        className="m-auto w-full max-w-lg bg-transparent p-0 backdrop:bg-[#141F45]/70 max-sm:mb-0 max-sm:max-w-none"
      >
        {modal && (
          <div className="relative max-h-[92vh] overflow-y-auto rounded-2xl bg-white max-sm:rounded-b-none">
            <button type="button" onClick={fecharForm} aria-label="Fechar" className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200">
              <X className="h-5 w-5 text-[#1B2A5C]" />
            </button>
            <div className="px-5 pr-16 pt-5">
              <p className="text-[11px] font-bold tracking-[0.25em] text-[#B3243A]">NITERÓI OPEN · FONSECA</p>
              {modal.tipo && <p className="mt-1 text-sm text-slate-600">Planta: <strong>{modal.tipo.nome} · {modal.tipo.area}</strong></p>}
            </div>
            <LeadForm
              key={modal.tipo?.id || 'geral'}
              confirmarGravacao
              idPrefix="popup-"
              titulo="Receba esta planta e consulte as unidades"
              subtitulo="Envio a planta e as unidades disponíveis pelo WhatsApp."
              empreendimento={EMPREENDIMENTO}
              cidadeFixa="Niterói"
              quartosInicial={modal.tipo?.quartos || ''}
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
        aria-label="Galeria de imagens do Niterói Open Residencial"
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
