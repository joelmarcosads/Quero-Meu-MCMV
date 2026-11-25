import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import { BOSQUE_AVISO_PRECO, BOSQUE_DATA_CONFERENCIA, FAQ_BOSQUE } from '../data/bosqueResidence';
import {
  MapPin,
  CheckCircle2,
  ChevronRight,
  X,
  Trees,
  Waves,
  Car,
  Sun,
  Award,
  Users,
  Clock,
  Home,
  ShieldCheck,
} from 'lucide-react';

// ─── Landing: Meu Crescer Niterói | Bosque Residence (Crescer) — Fonseca, Niterói ───
// Head (title/description/canonical/OG) e JSON-LD são gerados no build a partir de
// src/seo/routes.ts (rota /bosque-residence-niteroi). O Helmet abaixo repete os dados
// para a navegação interna (SPA). Fonte dos dados: book oficial (ver src/data/bosqueResidence.ts).

const SLUG = '/bosque-residence-niteroi';
const URL_PAGINA = `https://queromeumcmv.com.br${SLUG}`;
const NOME = 'Meu Crescer Niterói | Bosque Residence';
const EMPREENDIMENTO = 'Bosque Residence — Niterói';
const TITLE = 'Bosque Residence Fonseca Niterói | 2 Quartos a partir de R$ 324 mil';
const DESCRIPTION =
  'Bosque Residence, da Crescer, no Fonseca (Niterói): 2 quartos com varanda, 8.000 m² de bosque privativo e piscina no rooftop. A partir de R$ 324 mil.';
const PRECO = 'R$ 324.000';
const FORM = 'lead_bosque_residence';

const img = (nome: string) => `/meu-crescer-niteroi-bosque-${nome}.webp`;

type Foto = { src: string; alt: string; label: string; w: number; h: number };
const f = (nome: string, label: string, alt: string, w = 1191, h = 842): Foto => ({ src: img(nome), label, alt, w, h });

const FOTOS_BOSQUE: Foto[] = [
  f('area-verde-privativa', '8.000 m² de área verde', 'Área verde privativa de 8.000 m² do Bosque Residence, no Fonseca, Niterói'),
  f('mirante', 'Mirante', 'Mirante no bosque privativo do Bosque Residence com vista para a mata', 1800, 636),
  f('trilha', 'Trilha para caminhada', 'Trilha para caminhada no bosque do Bosque Residence, Niterói'),
  f('redario', 'Redário', 'Redário com redes entre as árvores do Bosque Residence'),
  f('horta', 'Horta', 'Horta coletiva do Bosque Residence, no Fonseca'),
  f('orquidario', 'Orquidário', 'Orquidário sob pergolado no Bosque Residence'),
  f('churrasqueira', 'Espaço churrasco', 'Espaço churrasco com pergolado no bosque do Bosque Residence'),
  f('playground', 'Playground', 'Playground no bosque do Bosque Residence, Niterói'),
  f('mini-quadra', 'Mini quadra', 'Mini quadra do Bosque Residence', 1149, 842),
  f('pet-place', 'Pet place', 'Pet place no bosque do Bosque Residence'),
  f('mirante-por-do-sol', 'Mirante e espaço zen', 'Mirante e espaço zen ao entardecer no Bosque Residence'),
];

const FOTOS_ROOFTOP: Foto[] = [
  f('piscina-rooftop', 'Piscina no rooftop', 'Piscina adulto e infantil no rooftop do Bosque Residence, Niterói', 1800, 636),
  f('salao-de-festas', 'Salão de festas', 'Salão de festas no rooftop do Bosque Residence'),
  f('espaco-gourmet', 'Espaço gourmet', 'Espaço gourmet no rooftop do Bosque Residence'),
  f('lounge-coworking', 'Lounge / coworking', 'Lounge e coworking no rooftop do Bosque Residence'),
  f('espaco-kids', 'Brinquedoteca', 'Brinquedoteca (espaço kids) no rooftop do Bosque Residence'),
  f('espaco-fitness', 'Espaço fitness', 'Espaço fitness do Bosque Residence'),
  f('pet-care', 'Pet care', 'Pet care do Bosque Residence', 1148, 842),
];

const FOTOS_APTO: Foto[] = [
  f('sala-apartamento-tipo', 'Sala — apartamento tipo', 'Sala decorada do apartamento tipo de 2 quartos do Bosque Residence'),
  f('varanda-apartamento-tipo', 'Varanda — apartamento tipo', 'Varanda do apartamento tipo com vista para o verde no Bosque Residence', 1135, 842),
  f('sala-apartamento-frontal', 'Sala — apartamento frontal', 'Sala do apartamento frontal com suíte do Bosque Residence'),
  f('varanda-apartamento-frontal', 'Varanda — apartamento frontal', 'Varanda do apartamento frontal do Bosque Residence'),
  f('cozinha', 'Cozinha', 'Cozinha do apartamento do Bosque Residence', 1189, 842),
  f('quarto-suite', 'Suíte', 'Quarto suíte do apartamento do Bosque Residence'),
  f('quarto-solteiro', 'Quarto', 'Segundo quarto do apartamento do Bosque Residence', 1157, 842),
  f('terraco-cobertura', 'Terraço da cobertura', 'Terraço da cobertura do Bosque Residence'),
  f('sala-cobertura', 'Sala da cobertura', 'Sala da cobertura do Bosque Residence', 1187, 842),
];

const FACHADA: Foto[] = [
  f('vista-do-morro', 'Fachada e bosque', 'Torres do Bosque Residence cercadas pelo morro e pela mata no Fonseca, Niterói'),
  f('fachada-principal', 'Fachada principal', 'Fachada principal do Bosque Residence, na Av. Desembargador Lima Castro, Fonseca'),
  f('fachada-lojas', 'Lojas na fachada', 'Lojas comerciais na fachada do Bosque Residence'),
  f('fachada-rua', 'Acesso', 'Acesso e calçada do Bosque Residence, em frente ao Detran do Fonseca'),
];

type Tipo = {
  id: string;
  grupo: 'tipo' | 'suite' | 'pcd' | 'cobertura';
  nome: string;
  area: string;
  quartos: '2 quartos' | '3 quartos';
  destaques: string[];
  unidades: string;
  plantas: Foto[];
};

const p = (nome: string, label: string, w: number, h: number): Foto => ({
  src: img(`planta-${nome}`),
  label,
  alt: `Planta do ${label} do Bosque Residence, Niterói`,
  w,
  h,
});

const TIPOS: Tipo[] = [
  {
    id: 'frontal',
    grupo: 'suite',
    nome: 'Frontal com suíte',
    area: '52 m²',
    quartos: '2 quartos',
    destaques: ['Suíte e varanda', 'Vaga privativa', 'Azulejo até o teto'],
    unidades: '40 unidades · blocos 01 e 02, colunas 01 e 02',
    plantas: [p('2-quartos-suite-frontal-coluna-01', 'apartamento frontal (coluna 01), 52 m²', 843, 715), p('2-quartos-suite-frontal-coluna-02', 'apartamento frontal (coluna 02), 52 m²', 843, 710)],
  },
  {
    id: 'vista-bosque',
    grupo: 'tipo',
    nome: 'Vista Bosque',
    area: '48,63 m² e 50,53 m²',
    quartos: '2 quartos',
    destaques: ['Varanda voltada para o verde', 'Vaga compartilhada'],
    unidades: '40 unidades · blocos 01 e 02, coluna 05',
    plantas: [p('2-quartos-vista-bosque', 'apartamento Vista Bosque', 775, 689)],
  },
  {
    id: 'lateral-suite',
    grupo: 'suite',
    nome: 'Lateral com suíte',
    area: '51,27 m²',
    quartos: '2 quartos',
    destaques: ['Suíte e varanda', 'Vaga compartilhada'],
    unidades: '10 unidades · bloco 01, coluna 04',
    plantas: [p('2-quartos-suite-lateral', 'apartamento lateral com suíte, 51,27 m²', 999, 625)],
  },
  {
    id: 'lateral',
    grupo: 'tipo',
    nome: 'Lateral',
    area: '47 m²',
    quartos: '2 quartos',
    destaques: ['Varanda', 'Vaga compartilhada'],
    unidades: '58 unidades · blocos 01 e 02, colunas 07 e 08',
    plantas: [p('2-quartos-lateral-coluna-07', 'apartamento lateral (coluna 07), 47 m²', 1038, 629), p('2-quartos-lateral-coluna-08', 'apartamento lateral (coluna 08), 47 m²', 1038, 630)],
  },
  {
    id: 'lateral-2-varandas',
    grupo: 'tipo',
    nome: 'Lateral com 2 varandas',
    area: '50,37 m²',
    quartos: '2 quartos',
    destaques: ['Duas varandas', 'Vaga compartilhada'],
    unidades: '2 unidades · bloco 02, aptos 1203 e 1204',
    plantas: [p('2-quartos-lateral-2-varandas', 'apartamento lateral com 2 varandas, 50,37 m²', 1022, 599)],
  },
  {
    id: 'pcd',
    grupo: 'pcd',
    nome: 'Lateral adaptado (PCD)',
    area: '56,30 m²',
    quartos: '2 quartos',
    destaques: ['Adaptado para PCD', 'Varanda', 'Vaga compartilhada'],
    unidades: '10 unidades · bloco 01, coluna 03',
    plantas: [p('2-quartos-pcd-lateral', 'apartamento lateral adaptado (PCD), 56,30 m²', 1052, 614)],
  },
  {
    id: 'cobertura-vista-bosque',
    grupo: 'cobertura',
    nome: 'Cobertura Vista Bosque',
    area: '116 m²',
    quartos: '3 quartos',
    destaques: ['3 quartos com suíte', 'Terraço', '1 vaga privativa'],
    unidades: 'Bloco 02',
    plantas: [p('cobertura-vista-bosque-116m2', 'cobertura Vista Bosque, 116 m²', 973, 525)],
  },
  {
    id: 'cobertura-lateral',
    grupo: 'cobertura',
    nome: 'Cobertura Lateral',
    area: '140 m²',
    quartos: '2 quartos',
    destaques: ['2 quartos com suíte', 'Terraço', '2 vagas privativas'],
    unidades: 'Bloco 02',
    plantas: [p('cobertura-lateral-140m2', 'cobertura lateral, 140 m²', 1073, 254)],
  },
  {
    id: 'cobertura-frontal',
    grupo: 'cobertura',
    nome: 'Cobertura Frontal',
    area: '144 m²',
    quartos: '2 quartos',
    destaques: ['2 quartos com suíte', 'Terraço', '2 vagas privativas'],
    unidades: 'Bloco 02',
    plantas: [p('cobertura-frontal-144m2', 'cobertura frontal, 144 m²', 963, 710)],
  },
];

const FILTROS: Array<{ id: 'todos' | Tipo['grupo']; label: string }> = [
  { id: 'todos', label: 'Todas' },
  { id: 'tipo', label: '2 quartos' },
  { id: 'suite', label: '2 quartos com suíte' },
  { id: 'pcd', label: 'Adaptado (PCD)' },
  { id: 'cobertura', label: 'Coberturas' },
];

const TEMPOS: Array<[string, string]> = [
  ['Prezunic Fonseca', '2 min'],
  ['Hospital Estadual Azevedo Lima', '4 min'],
  ['Horto do Fonseca', '5 min de bicicleta'],
  ['Jardim Icaraí', '7 min'],
  ['Campo de São Bento', '8 min'],
  ['Ponte Rio-Niterói', '8 min'],
  ['Terminal Rodoviário João Goulart', '9 min'],
  ['Hospital Universitário Antônio Pedro', '9 min'],
  ['Mercado Municipal', '10 min'],
  ['Barcas', '10 min'],
  ['Plaza Shopping', '14 min'],
  ['Praia de Icaraí', '15 min'],
  ['Museu de Arte', '15 min'],
];

function Oferta({ claro = false }: { claro?: boolean }) {
  return (
    <div>
      <p className={`text-sm ${claro ? 'text-emerald-50/90' : 'text-slate-600'}`}>A partir de</p>
      <p className={`text-4xl font-extrabold tracking-tight ${claro ? 'text-white' : 'text-[#1E3B2C]'}`}>
        {PRECO}
        <span className="text-[#D9A066]">*</span>
      </p>
      <p className={`mt-1 text-xs leading-snug ${claro ? 'text-emerald-50/90' : 'text-slate-600'}`}>{BOSQUE_AVISO_PRECO}</p>
    </div>
  );
}

type Modal = { tipo?: Tipo } | null;

export default function BosqueResidenceNiteroi() {
  const [modal, setModal] = useState<Modal>(null);
  const [foto, setFoto] = useState<{ lista: Foto[]; i: number } | null>(null);
  const [filtro, setFiltro] = useState<'todos' | Tipo['grupo']>('todos');
  const [galeria, setGaleria] = useState<'bosque' | 'rooftop' | 'apto'>('bosque');
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
  const fotosGaleria = galeria === 'bosque' ? FOTOS_BOSQUE : galeria === 'rooftop' ? FOTOS_ROOFTOP : FOTOS_APTO;

  return (
    <div className="min-h-screen bg-[#F5F0E6] font-sans text-[#23302A] selection:bg-[#3E6B48] selection:text-white">
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
        <meta property="og:image" content="https://queromeumcmv.com.br/og/meu-crescer-niteroi-bosque.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="Niterói" />
        <link rel="preload" as="image" href={img('vista-do-morro-800')} media="(max-width: 767px)" fetchPriority="high" />
        <link rel="preload" as="image" href={img('vista-do-morro')} media="(min-width: 768px)" fetchPriority="high" />
      </Helmet>

      <Header />

      <main id="main-content">
        {/* ── PRIMEIRA DOBRA ── */}
        <section className="relative overflow-hidden text-white">
          <picture>
            <source media="(max-width: 767px)" srcSet={img('vista-do-morro-800')} />
            <img
              src={img('vista-do-morro')}
              alt="Torres do Bosque Residence cercadas pela mata no Fonseca, Niterói"
              width={1191}
              height={842}
              fetchPriority="high"
              loading="eager"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </picture>
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#12261B]/95 via-[#12261B]/80 to-[#12261B]/55" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10 lg:py-14">
            <nav className="text-sm text-emerald-50/80 mb-6" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1">
                <li><Link to="/" className="hover:text-white">Início</Link></li>
                <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5" /></li>
                <li><Link to="/niteroirj" className="hover:text-white">Imóveis em Niterói</Link></li>
                <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5" /></li>
                <li className="font-semibold text-white" aria-current="page">Bosque Residence</li>
              </ol>
            </nav>

            <div className="grid lg:grid-cols-12 gap-x-8 gap-y-6 lg:items-center">
              <div className="lg:col-span-7 lg:row-start-1 space-y-4 lg:space-y-5 order-1">
                <p className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-bold tracking-widest">
                  LANÇAMENTO · FINANCIAMENTO CAIXA
                </p>
                <h1 className="text-[1.75rem] sm:text-3xl md:text-[2.6rem] font-extrabold leading-tight">
                  Bosque Residence, no Fonseca: 2 quartos com varanda e 8.000 m² de bosque privativo em Niterói
                </h1>
                <p className="text-base sm:text-lg text-emerald-50/90 leading-relaxed max-w-2xl">
                  Trilha, mirante e redário dentro do condomínio, piscina no rooftop e a Ponte Rio-Niterói a 8 minutos.
                  A calma da natureza sem abrir mão da cidade.
                </p>
                <p className="flex items-start gap-2 text-emerald-50/90">
                  <MapPin className="w-5 h-5 text-[#D9A066] shrink-0 mt-0.5" />
                  Av. Desembargador Lima Castro, 245 · Fonseca, Niterói – RJ (em frente ao Detran)
                </p>
                <div className="rounded-2xl bg-white/10 border border-white/15 p-4 sm:p-5 max-w-xl">
                  <Oferta claro />
                </div>
              </div>

              <div className="lg:col-span-7 lg:row-start-2 order-3">
                <ul className="grid sm:grid-cols-2 gap-2 text-sm max-w-xl" aria-label="Destaques">
                  {['2 quartos de 47 m² a 56,30 m²', 'Opções com suíte', 'Coberturas de 116 a 144 m²', 'Piscina adulto e infantil no rooftop'].map((t) => (
                    <li key={t} className="flex gap-2"><CheckCircle2 className="w-5 h-5 text-[#D9A066] shrink-0" />{t}</li>
                  ))}
                </ul>
              </div>

              <aside id="formulario" className="lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:row-span-2 order-2 scroll-mt-24" aria-label="Formulário de consulta">
                <div className="rounded-2xl bg-white text-[#23302A] shadow-2xl border-t-4 border-[#D9A066] p-6">
                  <h2 className="text-xl font-extrabold text-[#1E3B2C] leading-snug">Receba as plantas e consulte as unidades</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Você recebe pelo WhatsApp as plantas, as unidades disponíveis e a simulação de financiamento.
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
            <p className="text-xs font-bold tracking-[0.3em] text-[#8B5A3C]">POR QUE MORAR AQUI</p>
            <h2 className="mt-2 text-3xl font-bold text-[#1E3B2C]">A natureza bate à sua porta</h2>
            <p className="mt-3 max-w-3xl text-slate-700 leading-relaxed">
              O {NOME} é um condomínio residencial da Crescer Incorporadora e Construtora no Fonseca, em Niterói, com 160
              apartamentos de 2 quartos e 3 coberturas em duas torres de 10 pavimentos, 4 lojas na fachada e 8.000 m² de área
              verde privativa.
            </p>
            <div className="mt-8 grid md:grid-cols-3 gap-5">
              {[
                {
                  icon: <Trees className="w-6 h-6" />,
                  t: 'Um bosque só dos moradores',
                  d: 'Comece o dia na trilha, descanse no redário e colha da horta coletiva. São 8.000 m² de mata preservada dentro do condomínio.',
                },
                {
                  icon: <Waves className="w-6 h-6" />,
                  t: 'Lazer completo no rooftop',
                  d: 'Piscina adulto e infantil com deck, salão de festas, espaço gourmet, lounge/coworking e brinquedoteca no alto do prédio.',
                },
                {
                  icon: <Car className="w-6 h-6" />,
                  t: 'Rotina mais prática',
                  d: 'Carro e bicicleta compartilhados, pet care, oficina de ferramentas, aplicativo do condomínio e enxoval do condomínio incluso.',
                },
              ].map((b) => (
                <div key={b.t} className="rounded-2xl bg-white border border-[#E3DACB] p-6">
                  <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-[#3E6B48]/10 text-[#3E6B48]">{b.icon}</span>
                  <h3 className="mt-4 text-lg font-bold text-[#1E3B2C]">{b.t}</h3>
                  <p className="mt-2 text-slate-700 leading-relaxed">{b.d}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                ['Unidades', '160 aptos + 3 coberturas'],
                ['Torres', '2 · 10 pavimentos · 8 aptos por andar'],
                ['Entre os blocos', 'Espaço amplo de 12 m'],
                ['Comércio', '4 lojas na fachada'],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-[#1E3B2C] text-white p-4">
                  <p className="text-xs uppercase tracking-wide text-emerald-100/80">{k}</p>
                  <p className="mt-1 font-bold">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PLANTAS ── */}
        <section className="py-16 bg-white" id="plantas">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold tracking-[0.3em] text-[#8B5A3C]">PLANTAS</p>
            <h2 className="mt-2 text-3xl font-bold text-[#1E3B2C]">Escolha a sua planta — todas com varanda</h2>
            <div role="group" aria-label="Filtrar plantas" className="mt-6 flex flex-wrap gap-2">
              {FILTROS.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  aria-pressed={filtro === x.id}
                  onClick={() => setFiltro(x.id)}
                  className={`min-h-[44px] px-4 rounded-full text-sm font-semibold border transition-colors ${
                    filtro === x.id ? 'bg-[#1E3B2C] border-[#1E3B2C] text-white' : 'bg-white border-slate-300 hover:border-[#1E3B2C]'
                  }`}
                >
                  {x.label}
                </button>
              ))}
            </div>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tiposVisiveis.map((t) => (
                <article key={t.id} className="flex flex-col rounded-2xl border border-[#E3DACB] bg-[#FBF8F2] overflow-hidden">
                  <button
                    type="button"
                    onClick={() => verFoto(t.plantas, 0)}
                    className="h-52 bg-white flex items-center justify-center p-3"
                    aria-label={`Ampliar planta: ${t.nome}`}
                  >
                    <img src={t.plantas[0].src} alt={t.plantas[0].alt} width={t.plantas[0].w} height={t.plantas[0].h} loading="lazy" className="max-h-full max-w-full object-contain" />
                  </button>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#8B5A3C]">{t.quartos}</p>
                    <h3 className="text-lg font-bold text-[#1E3B2C]">{t.nome} · {t.area}</h3>
                    <ul className="flex flex-wrap gap-1.5">
                      {t.destaques.map((d) => (
                        <li key={d} className="rounded-full bg-white border border-[#E3DACB] px-2.5 py-1 text-xs">{d}</li>
                      ))}
                    </ul>
                    <p className="text-xs text-slate-500">{t.unidades}{t.plantas.length > 1 ? ` · ${t.plantas.length} plantas` : ''}</p>
                    <button
                      type="button"
                      onClick={() => consultar(t)}
                      className="mt-auto min-h-[48px] rounded-xl bg-[#3E6B48] hover:bg-[#2F5538] text-white font-bold"
                    >
                      Consultar esta planta
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Plantas ilustrativas conforme o book da incorporadora. Metragens e acabamentos conforme memorial descritivo.
            </p>
          </div>
        </section>

        {/* ── GALERIA ── */}
        <section className="py-16 bg-[#1E3B2C] text-white" id="galeria">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold tracking-[0.3em] text-[#D9A066]">GALERIA</p>
            <h2 className="mt-2 text-3xl font-bold">Do bosque ao rooftop</h2>
            <div role="tablist" aria-label="Ambientes" className="mt-6 flex flex-wrap gap-2">
              {([
                ['bosque', 'Bosque privativo'],
                ['rooftop', 'Rooftop e áreas comuns'],
                ['apto', 'Apartamentos'],
              ] as const).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={galeria === id}
                  onClick={() => setGaleria(id)}
                  className={`min-h-[44px] px-4 rounded-full text-sm font-semibold border transition-colors ${
                    galeria === id ? 'bg-white text-[#1E3B2C] border-white' : 'border-white/40 hover:border-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
              {fotosGaleria.map((ft, i) => (
                <button key={ft.src} type="button" onClick={() => verFoto(fotosGaleria, i)} className="group relative aspect-[4/3] overflow-hidden rounded-xl text-left">
                  <img src={ft.src} alt={ft.alt} width={ft.w} height={ft.h} loading="lazy" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 py-2 text-sm font-semibold">{ft.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-10 grid lg:grid-cols-2 gap-5">
              <button type="button" onClick={() => verFoto([f('masterplan-bosque', 'Masterplan do bosque', 'Masterplan do bosque privativo do Bosque Residence', 1800, 622)], 0)} className="rounded-xl bg-white p-2">
                <img src={img('masterplan-bosque')} alt="Masterplan do bosque privativo do Bosque Residence com trilha, mirante, horta e lazer" width={1800} height={622} loading="lazy" className="w-full" />
              </button>
              <button type="button" onClick={() => verFoto([f('masterplan-rooftop', 'Masterplan do rooftop', 'Masterplan do rooftop do Bosque Residence', 1800, 596)], 0)} className="rounded-xl bg-white p-2">
                <img src={img('masterplan-rooftop')} alt="Masterplan do rooftop do Bosque Residence com piscina, salão de festas e espaço gourmet" width={1800} height={596} loading="lazy" className="w-full" />
              </button>
            </div>
            <p className="mt-4 text-xs text-emerald-50/70">Imagens meramente ilustrativas.</p>
          </div>
        </section>

        {/* ── LOCALIZAÇÃO ── */}
        <section className="py-16" id="localizacao">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-[#8B5A3C]">LOCALIZAÇÃO</p>
              <h2 className="mt-2 text-3xl font-bold text-[#1E3B2C]">A calma que você busca, com a proximidade que você precisa</h2>
              <p className="mt-3 flex items-start gap-2 text-slate-700">
                <MapPin className="w-5 h-5 text-[#8B5A3C] shrink-0 mt-0.5" />
                Av. Desembargador Lima Castro, 245 — Fonseca, Niterói – RJ, em frente ao Detran.
              </p>
              <button type="button" onClick={() => verFoto(FACHADA, 1)} className="mt-6 block w-full overflow-hidden rounded-2xl">
                <img src={img('fachada-principal')} alt={FACHADA[1].alt} width={1191} height={842} loading="lazy" className="w-full h-64 object-cover" />
              </button>
            </div>
            <div>
              <ul className="grid sm:grid-cols-2 gap-3">
                {TEMPOS.map(([lugar, tempo]) => (
                  <li key={lugar} className="flex items-center justify-between gap-3 rounded-xl bg-white border border-[#E3DACB] px-4 py-3">
                    <span className="text-sm font-medium">{lugar}</span>
                    <span className="flex items-center gap-1 text-sm font-bold text-[#3E6B48] whitespace-nowrap"><Clock className="w-4 h-4" />{tempo}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-slate-500">Tempos aproximados de carro (Horto do Fonseca: de bicicleta), conforme o book da incorporadora, fonte Google Maps.</p>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-16 bg-white" id="duvidas">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-center text-3xl font-bold text-[#1E3B2C]">Dúvidas frequentes sobre o Bosque Residence</h2>
            <div className="space-y-3">
              {FAQ_BOSQUE.map((q, i) => (
                <details key={q.pergunta} open={i === 0} className="group rounded-xl border border-[#E3DACB] bg-[#FBF8F2] p-5">
                  <summary className="flex cursor-pointer list-none justify-between gap-4 font-bold text-[#1E3B2C]">
                    <h3 className="text-base">{q.pergunta}</h3>
                    <ChevronRight className="w-5 h-5 shrink-0 transition-transform group-open:rotate-90" />
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
            <div className="grid md:grid-cols-[160px_1fr] gap-6 items-center rounded-2xl bg-white border border-[#E3DACB] p-6 md:p-8">
              <img src="/joel-marcos-corretor-de-imoveis-itaborai.webp" alt="Joel Marcos, corretor de imóveis CRECI 39.583F" width={160} height={160} loading="lazy" className="mx-auto h-32 w-32 rounded-full object-cover md:h-40 md:w-40" />
              <div className="space-y-3">
                <p className="text-xs font-bold tracking-[0.3em] text-[#8B5A3C]">QUEM VAI TE ATENDER</p>
                <h2 className="text-2xl font-bold text-[#1E3B2C]">Joel Marcos — Corretor de Imóveis · CRECI 39.583F</h2>
                <p className="leading-relaxed text-slate-700">
                  Corretor desde 2002, com atendimento em Itaboraí, São Gonçalo e Niterói. Envio as plantas, confiro a
                  disponibilidade com a incorporadora e acompanho a simulação e a análise de crédito na CAIXA.
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-[#8B5A3C]" />24 anos de mercado</span>
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-[#8B5A3C]" />Seg a sex, 9h às 17h</span>
                  <Link to="/sobre" className="text-[#3E6B48] underline">Conheça o corretor</Link>
                </div>
                <p className="text-xs text-slate-500">
                  Informações extraídas do book oficial da Crescer Incorporadora e Construtora, conferidas em {BOSQUE_DATA_CONFERENCIA}.
                  Preço inicial informado pelo corretor.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="relative overflow-hidden py-16 text-white" id="contato">
          <img src={img('area-verde-privativa')} alt="" aria-hidden="true" width={1191} height={842} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#12261B]/85" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">Seu apartamento cercado de verde, a 8 minutos da Ponte.</h2>
              <Oferta claro />
              <ul className="space-y-2 text-emerald-50/90">
                <li className="flex gap-2"><Home className="w-5 h-5 text-[#D9A066] shrink-0" />Plantas e unidades disponíveis</li>
                <li className="flex gap-2"><ShieldCheck className="w-5 h-5 text-[#D9A066] shrink-0" />Simulação de financiamento CAIXA</li>
                <li className="flex gap-2"><Sun className="w-5 h-5 text-[#D9A066] shrink-0" />Atendimento por corretor credenciado</li>
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              ['/niteroirj', 'Imóveis em Niterói', 'Outras opções de apartamentos em Niterói.'],
              ['/orla-central-niteroi', 'Orla Central', 'Lançamento da Cury no Centro de Niterói.'],
              ['/financiamento-minha-casa-minha-vida', 'Como funciona o financiamento', 'Entenda a análise de crédito e as parcelas.'],
              ['/documentos-minha-casa-minha-vida', 'Documentos para financiar', 'Lista do que separar para a CAIXA.'],
            ].map(([to, t, d]) => (
              <Link key={to} to={to} className="rounded-xl border border-[#E3DACB] bg-white p-5 transition-all hover:border-[#3E6B48] hover:shadow-md">
                <p className="font-bold text-[#1E3B2C]">{t}</p>
                <p className="mt-1 text-sm text-slate-600">{d}</p>
              </Link>
            ))}
          </div>
          <p className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 text-xs leading-relaxed text-slate-500">
            {BOSQUE_AVISO_PRECO} Imagens e plantas meramente ilustrativas. Metragens e acabamentos conforme memorial descritivo.
            Financiamento CAIXA sujeito à análise e aprovação de crédito. Registro do Memorial de Incorporação prenotado sob o
            nº 95605 no 14º Ofício de Notas e Registro de Imóveis de Niterói. Construtora: Crescer Incorporadora e Construtora.
            Intermediação: Joel Marcos, corretor de imóveis, CRECI 39.583F.
          </p>
        </section>
      </main>

      {/* Barra fixa no celular (o WhatsApp fica no botão flutuante padrão do site, à direita) */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white py-2.5 pl-3 pr-20 shadow-[0_-6px_18px_rgba(0,0,0,0.08)]">
        <a href="#formulario" className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#3E6B48] font-extrabold text-white">
          Consultar as unidades
        </a>
      </div>
      <div className="lg:hidden h-20" aria-hidden="true" />

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
        aria-label="Consultar planta do Bosque Residence"
        className="m-auto w-full max-w-lg bg-transparent p-0 backdrop:bg-[#12261B]/70 max-sm:mb-0 max-sm:max-w-none"
      >
        {modal && (
          <div className="relative max-h-[92vh] overflow-y-auto rounded-2xl bg-white max-sm:rounded-b-none">
            <button type="button" onClick={fecharForm} aria-label="Fechar" className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200">
              <X className="h-5 w-5 text-[#1E3B2C]" />
            </button>
            <div className="px-5 pt-5 pr-16">
              <p className="text-[11px] font-bold tracking-[0.25em] text-[#8B5A3C]">BOSQUE RESIDENCE · NITERÓI</p>
              {modal.tipo && (
                <p className="mt-1 text-sm text-slate-600">Planta: <strong>{modal.tipo.nome} · {modal.tipo.area}</strong></p>
              )}
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
        aria-label="Galeria de imagens do Bosque Residence"
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
