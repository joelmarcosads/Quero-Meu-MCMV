import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import { IMPERIO_AVISO_PRECO, IMPERIO_DATA_CONFERENCIA, FAQ_IMPERIO } from '../data/imperioDoOuro';
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
  Bike,
  HeartPulse,
  KeyRound,
  Car,
} from 'lucide-react';

// ─── Landing: Império do Ouro (MRV) — Rio do Ouro, São Gonçalo · pronto para morar ───
// Head (title/description/canonical/OG) e JSON-LD são gerados no build a partir de
// src/seo/routes.ts (rota /imperio-do-ouro-sg). O Helmet abaixo repete os dados para a
// navegação interna (SPA). Fonte dos dados: book oficial (ver src/data/imperioDoOuro.ts).

const SLUG = '/imperio-do-ouro-sg';
const URL_PAGINA = `https://queromeumcmv.com.br${SLUG}`;
const EMPREENDIMENTO = 'Império do Ouro — São Gonçalo';
const TITLE = 'Império do Ouro São Gonçalo | Pronto para Morar, R$ 259 mil';
const DESCRIPTION =
  'Império do Ouro, da MRV, no Rio do Ouro em São Gonçalo: 2 quartos pronto para morar, com opção de suíte e varanda, piscina e lazer. A partir de R$ 259 mil.';
const PRECO = 'R$ 259.490';
const FORM = 'lead_imperio_do_ouro';

const img = (nome: string) => `/imperio-do-ouro-sg-${nome}.webp`;

type Foto = { src: string; alt: string; label: string; w: number; h: number };
const f = (nome: string, label: string, alt: string, w = 1800, h = 1246): Foto => ({ src: img(nome), label, alt, w, h });

const FOTOS_LAZER: Foto[] = [
  f('piscina', 'Piscina adulto e infantil', 'Piscina adulto e infantil do Império do Ouro, condomínio da MRV em São Gonçalo'),
  f('piscina-noturna', 'Piscina à noite', 'Piscina do Império do Ouro iluminada à noite'),
  f('espaco-gourmet', 'Espaço gourmet', 'Espaço gourmet com churrasqueira do Império do Ouro'),
  f('salao-de-festas', 'Salão de festas', 'Salão de festas do Império do Ouro'),
  f('espaco-kids', 'Espaço kids', 'Espaço kids do Império do Ouro'),
  f('playground', 'Playground', 'Playground do Império do Ouro'),
  f('pet-place', 'Pet place', 'Pet place do Império do Ouro', 1068, 1260),
  f('bicicletario', 'Bicicletário', 'Bicicletário do Império do Ouro'),
  f('bicicletario-jardim', 'Bicicletário e jardim', 'Bicicletário e área verde do Império do Ouro'),
  f('implantacao-lazer', 'Vista do lazer', 'Vista aérea ilustrativa do lazer do Império do Ouro com piscina, salão e playground', 1800, 965),
];

const FOTOS_APTO: Foto[] = [
  f('sala', 'Sala', 'Sala de estar e jantar decorada de apartamento do Império do Ouro'),
  f('cozinha', 'Cozinha', 'Cozinha decorada de apartamento do Império do Ouro'),
  f('quarto-suite', 'Quarto com suíte', 'Quarto com suíte decorado do Império do Ouro'),
  f('quarto', 'Quarto', 'Segundo quarto decorado do Império do Ouro'),
  f('varanda', 'Varanda', 'Varanda de apartamento do Império do Ouro'),
  f('varanda-fachada', 'Varandas na fachada', 'Fachada do Império do Ouro com as varandas dos apartamentos'),
  f('area-privativa', 'Área privativa', 'Área privativa (quintal) de apartamento térreo do Império do Ouro'),
];

const FOTOS_FACHADA: Foto[] = [
  f('portaria', 'Portaria', 'Portaria do Império do Ouro, condomínio da MRV no Rio do Ouro, São Gonçalo'),
  f('fachada-diurna', 'Fachada', 'Torres do Império do Ouro em São Gonçalo'),
  f('fachada-noturna', 'Fachada à noite', 'Fachada do Império do Ouro ao entardecer'),
  f('implantacao-condominio', 'Visão geral do condomínio', 'Vista ilustrativa do condomínio Império do Ouro com as torres, a portaria e o lazer', 1760, 1365),
  f('vista-aerea-rio-do-ouro', 'Região do Rio do Ouro', 'Vista aérea da região do Rio do Ouro, em São Gonçalo, com a localização do Império do Ouro', 1800, 895),
];

type Tipo = { id: string; grupo: '2q' | '2qs' | 'terreo'; nome: string; detalhe: string; destaques: string[]; planta: Foto; quartos: '2 quartos' };
const p = (nome: string, label: string, w: number, h: number): Foto => ({
  src: img(`planta-${nome}`),
  label,
  alt: `Planta do apartamento ${label} do Império do Ouro, São Gonçalo`,
  w,
  h,
});

const TIPOS: Tipo[] = [
  { id: 'v207', grupo: '2q', quartos: '2 quartos', nome: '2 quartos com varanda', detalhe: 'Apto 207 · Torre 03', destaques: ['Varanda', 'Piso laminado nos quartos'], planta: p('2-quartos-varanda-apto-207', '2 quartos com varanda (apto 207, torre 03)', 1800, 850) },
  { id: 's211', grupo: '2qs', quartos: '2 quartos', nome: '2 quartos com suíte e varanda', detalhe: 'Apto 211 · Torre 03 · 47,02 m²', destaques: ['Suíte', 'Varanda', 'Piso laminado nos quartos'], planta: p('2-quartos-suite-varanda-apto-211', '2 quartos com suíte e varanda (apto 211, torre 03)', 1800, 1140) },
  { id: 't101', grupo: 'terreo', quartos: '2 quartos', nome: '2 quartos com suíte e área privativa', detalhe: 'Apto 101 · Torre 03 · térreo', destaques: ['Suíte', 'Quintal privativo'], planta: p('2-quartos-suite-area-privativa-apto-101', '2 quartos com suíte e área privativa (apto 101, torre 03)', 1800, 998) },
  { id: 't103', grupo: 'terreo', quartos: '2 quartos', nome: '2 quartos com área privativa', detalhe: 'Apto 103 · Torre 03 · térreo', destaques: ['Quintal privativo'], planta: p('2-quartos-area-privativa-apto-103', '2 quartos com área privativa (apto 103, torre 03)', 1800, 837) },
  { id: 't102', grupo: '2qs', quartos: '2 quartos', nome: '2 quartos com suíte', detalhe: 'Apto 102 · Torre 02 · térreo', destaques: ['Suíte', '2 banheiros'], planta: p('2-quartos-suite-terreo-apto-102', '2 quartos com suíte (apto 102, torre 02)', 1800, 1100) },
  { id: 't104', grupo: '2q', quartos: '2 quartos', nome: '2 quartos', detalhe: 'Apto 104 · Torre 02 · térreo', destaques: ['Área de serviço', 'Estar e jantar integrados'], planta: p('2-quartos-terreo-apto-104', '2 quartos (apto 104, torre 02)', 1800, 857) },
];

const FILTROS: Array<{ id: 'todos' | Tipo['grupo']; label: string }> = [
  { id: 'todos', label: 'Todas' },
  { id: '2q', label: '2 quartos' },
  { id: '2qs', label: 'Com suíte' },
  { id: 'terreo', label: 'Com área privativa' },
];

const PERTO = [
  { grupo: 'Acessos', icon: <Car className="h-5 w-5" />, itens: ['RJ-106 (Rodovia Amaral Peixoto)', 'RJ-104: centro de São Gonçalo e Niterói', 'Estrada Velha de Maricá: Região Oceânica', 'BR-101 e RJ-100'] },
  { grupo: 'No dia a dia', icon: <ShoppingBag className="h-5 w-5" />, itens: ['Ao lado do supermercado Rede Economia', 'Lojas de conveniência', 'Padarias', 'Igreja'] },
  { grupo: 'Saúde', icon: <HeartPulse className="h-5 w-5" />, itens: ['Hospitais na região'] },
  { grupo: 'Destinos', icon: <MapPin className="h-5 w-5" />, itens: ['Fácil acesso a Niterói', 'Fácil acesso a Maricá'] },
];

function Oferta({ claro = false }: { claro?: boolean }) {
  return (
    <div>
      <p className={`text-sm ${claro ? 'text-amber-50/90' : 'text-slate-600'}`}>A partir de</p>
      <p className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${claro ? 'text-white' : 'text-[#1F4E3D]'}`}>
        {PRECO}
        <span className="text-[#F2B233]">*</span>
      </p>
      <p className={`mt-1 text-xs leading-snug ${claro ? 'text-amber-50/90' : 'text-slate-600'}`}>{IMPERIO_AVISO_PRECO}</p>
    </div>
  );
}

type Modal = { tipo?: Tipo } | null;

export default function ImperioDoOuroSG() {
  const [modal, setModal] = useState<Modal>(null);
  const [foto, setFoto] = useState<{ lista: Foto[]; i: number } | null>(null);
  const [filtro, setFiltro] = useState<'todos' | Tipo['grupo']>('todos');
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
    push({ event: 'unidade_click', empreendimento: EMPREENDIMENTO, unidade_interesse: tipo.nome });
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
    <div className="min-h-screen bg-[#F7F4EC] font-sans text-[#1F2A26] selection:bg-[#1F6B4F] selection:text-white">
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
        <meta property="og:image" content="https://queromeumcmv.com.br/og/imperio-do-ouro-sg.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="São Gonçalo" />
        <link rel="preload" as="image" href={img('portaria-800')} media="(max-width: 767px)" fetchPriority="high" />
        <link rel="preload" as="image" href={img('portaria')} media="(min-width: 768px)" fetchPriority="high" />
      </Helmet>

      <Header />

      <main id="main-content">
        {/* ── PRIMEIRA DOBRA ── */}
        <section className="relative overflow-hidden text-white">
          <picture>
            <source media="(max-width: 767px)" srcSet={img('portaria-800')} />
            <img
              src={img('portaria')}
              alt="Portaria do Império do Ouro, condomínio pronto para morar da MRV no Rio do Ouro, em São Gonçalo"
              width={1800}
              height={1246}
              fetchPriority="high"
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#10291F]/95 via-[#10291F]/80 to-[#10291F]/40" />

          <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:py-14">
            <nav className="mb-3 text-sm text-amber-50/80 sm:mb-6" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1">
                <li><Link to="/" className="hover:text-white">Início</Link></li>
                <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
                <li><Link to="/minha-casa-minha-vida-sao-goncalo" className="hover:text-white">Imóveis em São Gonçalo</Link></li>
                <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
                <li className="font-semibold text-white" aria-current="page">Império do Ouro</li>
              </ol>
            </nav>

            <div className="grid gap-x-8 gap-y-5 lg:grid-cols-12 lg:items-center">
              <div className="order-1 space-y-3 sm:space-y-4 lg:col-span-7 lg:row-start-1 lg:space-y-5">
                <p className="inline-flex items-center gap-2 rounded-full bg-[#F2B233] px-3 py-1 text-xs font-extrabold tracking-widest text-[#10291F]">
                  <KeyRound className="h-4 w-4" /> PRONTO PARA MORAR · MRV
                </p>
                <h1 className="text-[1.4rem] font-extrabold leading-snug sm:text-3xl sm:leading-tight md:text-[2.6rem]">
                  Império do Ouro: apartamento de 2 quartos pronto para morar no Rio do Ouro, em São Gonçalo
                </h1>
                <p className="max-w-2xl text-[15px] leading-relaxed text-amber-50/90 sm:text-lg">
                  Chega de aluguel e de esperar obra: condomínio com piscina e lazer prontos, opção de suíte e varanda, e as chaves
                  logo depois da aprovação do financiamento.
                </p>
                <p className="hidden items-start gap-2 text-amber-50/90 sm:flex">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#F2B233]" />
                  Av. Abdias José dos Santos · Rio do Ouro, São Gonçalo – RJ
                </p>
                <div className="max-w-xl rounded-2xl border border-white/15 bg-white/10 px-4 py-3 sm:p-5">
                  <Oferta claro />
                </div>
              </div>

              <div className="order-3 lg:col-span-7 lg:row-start-2">
                <ul className="grid max-w-xl gap-2 text-sm sm:grid-cols-2" aria-label="Destaques">
                  {['Pronto para morar', '2 quartos, com opção de suíte e varanda', 'Piscina, salão de festas e espaço gourmet', 'Ao lado do supermercado Rede Economia'].map((t) => (
                    <li key={t} className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#F2B233]" />{t}</li>
                  ))}
                </ul>
              </div>

              <aside id="formulario" className="order-2 scroll-mt-24 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1" aria-label="Formulário de consulta">
                <div className="rounded-2xl border-t-4 border-[#F2B233] bg-white p-6 text-[#1F2A26] shadow-2xl">
                  <h2 className="text-xl font-extrabold leading-snug text-[#1F4E3D]">Receba as plantas e agende sua visita</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Você recebe pelo WhatsApp as plantas, as unidades disponíveis e a simulação de financiamento.
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
            <p className="text-xs font-bold tracking-[0.3em] text-[#1F6B4F]">POR QUE MORAR AQUI</p>
            <h2 className="mt-2 text-3xl font-bold text-[#1F4E3D]">O que você vê é o que você leva</h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-slate-700">
              O Império do Ouro é um condomínio da MRV no bairro Rio do Ouro, em São Gonçalo, com 612 apartamentos de 2 quartos,
              opção de suíte e varanda, lazer equipado e pronto para morar. Em vez de comprar na planta, você conhece o
              condomínio construído antes de decidir.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: <KeyRound className="h-6 w-6" />,
                  t: 'Sem esperar obra',
                  d: 'Com o financiamento aprovado e o contrato assinado, você recebe as chaves e troca o aluguel pela parcela do que é seu.',
                },
                {
                  icon: <Waves className="h-6 w-6" />,
                  t: 'Lazer pronto para a família',
                  d: 'Piscina adulto e infantil, salão de festas, espaço gourmet, espaço kids, playground, pet place e bicicletário.',
                },
                {
                  icon: <Building2 className="h-6 w-6" />,
                  t: 'Condomínio com economia',
                  d: 'Elevador, energia solar parcial e lâmpadas de baixo consumo nas áreas comuns, economizadores de água e preparação para medição individual de água.',
                },
              ].map((b) => (
                <div key={b.t} className="rounded-2xl border border-[#E6DDC8] bg-white p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#1F6B4F]/10 text-[#1F6B4F]">{b.icon}</span>
                  <h3 className="mt-4 text-lg font-bold text-[#1F4E3D]">{b.t}</h3>
                  <p className="mt-2 leading-relaxed text-slate-700">{b.d}</p>
                </div>
              ))}
            </div>
            <dl className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Unidades', '612 apartamentos'],
                ['Terreno', '17.667,81 m²'],
                ['Vagas', '347 de carro + 53 de moto'],
                ['Construtora', 'MRV'],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-[#1F4E3D] p-4 text-white">
                  <dt className="text-xs uppercase tracking-wide text-amber-50/80">{k}</dt>
                  <dd className="mt-1 font-bold">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 rounded-2xl border border-[#E6DDC8] bg-white p-6">
              <p className="font-bold text-[#1F4E3D]">No seu apartamento</p>
              <ul className="mt-3 grid gap-2 text-slate-700 sm:grid-cols-2">
                {[
                  'Piso laminado nos quartos (exceto apartamentos do térreo)',
                  'Opção de suíte e opção de varanda',
                  'Tanque em mármore sintético',
                  'Revestimento parcial em cerâmica nas áreas molhadas',
                  'Preparação para ar-condicionado na suíte ou no quarto principal',
                  'Previsão para Wi-Fi nas áreas de lazer',
                ].map((t) => (
                  <li key={t} className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#1F6B4F]" />{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── PLANTAS ── */}
        <section className="bg-white py-16" id="plantas">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold tracking-[0.3em] text-[#1F6B4F]">PLANTAS</p>
            <h2 className="mt-2 text-3xl font-bold text-[#1F4E3D]">2 quartos com opção de suíte, varanda ou quintal</h2>
            <p className="mt-3 max-w-3xl text-slate-700">
              Área total de 46,05 m² ou 46,48 m² nos 2 quartos, 47,02 m² no 2 quartos com suíte e varanda e 46,48 m² no 1 quarto
              adaptado (PCD). As unidades do térreo têm área privativa de 11,10 m² a 35,50 m² (valores aproximados).
            </p>
            <div role="group" aria-label="Filtrar plantas" className="mt-6 flex flex-wrap gap-2">
              {FILTROS.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  aria-pressed={filtro === x.id}
                  onClick={() => setFiltro(x.id)}
                  className={`min-h-[44px] rounded-full border px-4 text-sm font-semibold transition-colors ${
                    filtro === x.id ? 'border-[#1F4E3D] bg-[#1F4E3D] text-white' : 'border-slate-300 bg-white hover:border-[#1F4E3D]'
                  }`}
                >
                  {x.label}
                </button>
              ))}
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tiposVisiveis.map((t) => (
                <article key={t.id} className="flex flex-col overflow-hidden rounded-2xl border border-[#E6DDC8] bg-[#FBF9F4]">
                  <button type="button" onClick={() => verFoto(TIPOS.map((x) => x.planta), TIPOS.indexOf(t))} className="flex h-56 items-center justify-center bg-white p-3" aria-label={`Ampliar planta: ${t.nome}, ${t.detalhe}`}>
                    <img src={t.planta.src} alt={t.planta.alt} width={t.planta.w} height={t.planta.h} loading="lazy" className="max-h-full max-w-full object-contain" />
                  </button>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#1F6B4F]">{t.detalhe}</p>
                    <h3 className="text-lg font-bold text-[#1F4E3D]">{t.nome}</h3>
                    <ul className="flex flex-wrap gap-1.5">
                      {t.destaques.map((d) => (
                        <li key={d} className="rounded-full border border-[#E6DDC8] bg-white px-2.5 py-1 text-xs">{d}</li>
                      ))}
                    </ul>
                    <button type="button" onClick={() => consultar(t)} className="mt-auto min-h-[48px] rounded-xl bg-[#1F6B4F] font-bold text-white hover:bg-[#185740]">
                      Consultar esta planta
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Plantas de unidades de referência indicadas no book. Decoração meramente ilustrativa; móveis e equipamentos não fazem
              parte do contrato. Infraestrutura para ar-condicionado e Wi-Fi: aparelhos e instalação não inclusos. Consulte o memorial
              descritivo.
            </p>
          </div>
        </section>

        {/* ── GALERIA ── */}
        <section className="bg-[#1F4E3D] py-16 text-white" id="galeria">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold tracking-[0.3em] text-[#F2B233]">GALERIA</p>
            <h2 className="mt-2 text-3xl font-bold">Conheça o condomínio por dentro</h2>
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
                    galeria === id ? 'border-white bg-white text-[#1F4E3D]' : 'border-white/40 hover:border-white'
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
            <p className="mt-4 text-xs text-amber-50/70">
              Perspectivas ilustrativas com sugestão de decoração. Os móveis, objetos, revestimentos e demais acabamentos não fazem
              parte do contrato. Imagens sujeitas a alterações.
            </p>
          </div>
        </section>

        {/* ── LOCALIZAÇÃO ── */}
        <section className="py-16" id="localizacao">
          <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-[#1F6B4F]">LOCALIZAÇÃO</p>
              <h2 className="mt-2 text-3xl font-bold text-[#1F4E3D]">Rio do Ouro: perto de Niterói e de Maricá</h2>
              <p className="mt-3 flex items-start gap-2 text-slate-700">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#1F6B4F]" />
                Avenida Abdias José dos Santos (lado ímpar) — Rio do Ouro, São Gonçalo, RJ
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {PERTO.map((g) => (
                  <div key={g.grupo} className="rounded-xl border border-[#E6DDC8] bg-white p-4">
                    <p className="flex items-center gap-2 font-bold text-[#1F4E3D]"><span className="text-[#1F6B4F]">{g.icon}</span>{g.grupo}</p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-700">{g.itens.map((i) => <li key={i}>{i}</li>)}</ul>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">Pontos de referência indicados no book da construtora.</p>
            </div>
            <button type="button" onClick={() => verFoto(FOTOS_FACHADA, 4)} className="overflow-hidden rounded-2xl shadow-lg">
              <img src={img('vista-aerea-rio-do-ouro')} alt={FOTOS_FACHADA[4].alt} width={1800} height={895} loading="lazy" className="w-full" />
            </button>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-white py-16" id="duvidas">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-center text-3xl font-bold text-[#1F4E3D]">Dúvidas frequentes sobre o Império do Ouro</h2>
            <div className="space-y-3">
              {FAQ_IMPERIO.map((q, i) => (
                <details key={q.pergunta} open={i === 0} className="group rounded-xl border border-[#E6DDC8] bg-[#FBF9F4] p-5">
                  <summary className="flex cursor-pointer list-none justify-between gap-4 font-bold text-[#1F4E3D]">
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
            <div className="grid items-center gap-6 rounded-2xl border border-[#E6DDC8] bg-white p-6 md:grid-cols-[160px_1fr] md:p-8">
              <img src="/joel-marcos-corretor-de-imoveis-itaborai.webp" alt="Joel Marcos, corretor de imóveis CRECI 39.583F" width={160} height={160} loading="lazy" className="mx-auto h-32 w-32 rounded-full object-cover md:h-40 md:w-40" />
              <div className="space-y-3">
                <p className="text-xs font-bold tracking-[0.3em] text-[#1F6B4F]">QUEM VAI TE ATENDER</p>
                <h2 className="text-2xl font-bold text-[#1F4E3D]">Joel Marcos — Corretor de Imóveis · CRECI 39.583F</h2>
                <p className="leading-relaxed text-slate-700">
                  Corretor desde 2002, com atendimento em Itaboraí, São Gonçalo e Niterói. Envio as plantas, confiro a
                  disponibilidade com a construtora, agendo a sua visita e acompanho a simulação e a análise de crédito.
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1.5"><Award className="h-4 w-4 text-[#1F6B4F]" />24 anos de mercado</span>
                  <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-[#1F6B4F]" />Seg a sex, 9h às 17h</span>
                  <Link to="/sobre" className="text-[#1F6B4F] underline">Conheça o corretor</Link>
                </div>
                <p className="text-xs text-slate-500">
                  Informações extraídas do book oficial da MRV, conferidas em {IMPERIO_DATA_CONFERENCIA}. Preço inicial e status
                  pronto para morar informados pelo corretor.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="relative overflow-hidden py-16 text-white" id="contato">
          <img src={img('piscina')} alt="" aria-hidden="true" width={1800} height={1246} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#10291F]/85" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="space-y-5">
              <h2 className="text-3xl font-bold leading-tight md:text-4xl">Pronto para morar: só falta você escolher o seu.</h2>
              <Oferta claro />
              <ul className="space-y-2 text-amber-50/90">
                <li className="flex gap-2"><Home className="h-5 w-5 shrink-0 text-[#F2B233]" />Plantas e unidades disponíveis</li>
                <li className="flex gap-2"><ShieldCheck className="h-5 w-5 shrink-0 text-[#F2B233]" />Simulação de financiamento para a sua renda</li>
                <li className="flex gap-2"><Bike className="h-5 w-5 shrink-0 text-[#F2B233]" />Visita ao condomínio com o corretor</li>
              </ul>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <LeadForm
                confirmarGravacao
                idPrefix="final-"
                titulo="Receba as plantas e agende sua visita"
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
              ['/minha-casa-minha-vida-sao-goncalo', 'Imóveis em São Gonçalo', 'Outras opções de apartamentos em São Gonçalo.'],
              ['/unicsaogoncalo', 'Unic São Gonçalo', 'Outro condomínio em São Gonçalo.'],
              ['/financiamento-minha-casa-minha-vida', 'Financiamento', 'Como funciona o financiamento do seu imóvel.'],
              ['/niteroirj', 'Imóveis em Niterói', 'Lançamentos em Niterói.'],
            ].map(([to, t, d]) => (
              <Link key={to} to={to} className="rounded-xl border border-[#E6DDC8] bg-white p-5 transition-all hover:border-[#1F6B4F] hover:shadow-md">
                <p className="font-bold text-[#1F4E3D]">{t}</p>
                <p className="mt-1 text-sm text-slate-600">{d}</p>
              </Link>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-7xl px-4 text-xs leading-relaxed text-slate-500 sm:px-6 lg:px-8">
            {IMPERIO_AVISO_PRECO} Imagens e plantas meramente ilustrativas. Empreendimento Império do Ouro, da MRV, na Avenida
            Abdias José dos Santos, Rio do Ouro, São Gonçalo – RJ. Energia solar parcial nas áreas comuns: o funcionamento depende
            das condições climáticas. Financiamento sujeito à análise e aprovação de crédito. Intermediação: Joel Marcos, corretor de
            imóveis, CRECI 39.583F.
          </p>
        </section>
      </main>

      {/* Barra fixa no celular (o WhatsApp fica no botão flutuante padrão do site, à direita) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white py-2.5 pl-3 pr-20 shadow-[0_-6px_18px_rgba(0,0,0,0.08)] lg:hidden">
        <a href="#formulario" className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#1F6B4F] font-extrabold text-white">
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
        aria-label="Consultar planta do Império do Ouro"
        className="m-auto w-full max-w-lg bg-transparent p-0 backdrop:bg-[#10291F]/70 max-sm:mb-0 max-sm:max-w-none"
      >
        {modal && (
          <div className="relative max-h-[92vh] overflow-y-auto rounded-2xl bg-white max-sm:rounded-b-none">
            <button type="button" onClick={fecharForm} aria-label="Fechar" className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200">
              <X className="h-5 w-5 text-[#1F4E3D]" />
            </button>
            <div className="px-5 pr-16 pt-5">
              <p className="text-[11px] font-bold tracking-[0.25em] text-[#1F6B4F]">IMPÉRIO DO OURO · SÃO GONÇALO</p>
              {modal.tipo && <p className="mt-1 text-sm text-slate-600">Planta: <strong>{modal.tipo.nome}</strong></p>}
            </div>
            <LeadForm
              key={modal.tipo?.id || 'geral'}
              confirmarGravacao
              idPrefix="popup-"
              titulo="Receba esta planta e consulte as unidades"
              subtitulo="Envio a planta e as unidades disponíveis pelo WhatsApp."
              empreendimento={EMPREENDIMENTO}
              cidadeFixa="São Gonçalo"
              quartosInicial={modal.tipo?.quartos || ''}
              unidadeInteresse={modal.tipo ? modal.tipo.nome : ''}
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
        aria-label="Galeria de imagens do Império do Ouro"
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
