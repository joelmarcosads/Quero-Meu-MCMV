import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import { GREEN_AVISO_PRECO, GREEN_DATA_CONFERENCIA, FAQ_GREEN } from '../data/greenOpen';
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
  Leaf,
  Droplets,
  Zap,
  Bike,
  Flame,
  Recycle,
} from 'lucide-react';

// ─── Landing: Green Open Residencial (GPCON) — Rua São Geraldo, Fonseca, Niterói · inovação e sustentabilidade ───
// Head (title/description/canonical/OG) e JSON-LD são gerados no build a partir de
// src/seo/routes.ts (rota /green-open-residencial-niteroi). O Helmet abaixo repete os dados para a
// navegação interna (SPA). Fonte dos dados: book oficial (ver src/data/greenOpen.ts).

const SLUG = '/green-open-residencial-niteroi';
const URL_PAGINA = `https://queromeumcmv.com.br${SLUG}`;
const EMPREENDIMENTO = 'Green Open Residencial — Fonseca';
const TITLE = 'Green Open Residencial | Niterói, a partir de R$ 272 mil';
const DESCRIPTION =
  'Green Open Residencial, da GPCON, no Fonseca: studios, 2 quartos e gardens com inovação e sustentabilidade e piscina no rooftop. A partir de R$ 272 mil.';
const PRECO = 'R$ 272.000';
const FORM = 'lead_green_open';

const img = (nome: string) => `/green-open-residencial-niteroi-${nome}.webp`;

type Foto = { src: string; alt: string; label: string; w: number; h: number };
const f = (nome: string, label: string, alt: string, w = 1800, h = 1014): Foto => ({ src: img(nome), label, alt, w, h });

const FOTOS_LAZER: Foto[] = [
  f('piscina-rooftop', 'Piscina no rooftop', 'Piscina com prainha no rooftop do Green Open Residencial, no Fonseca, Niterói', 1800, 1013),
  f('solarium-churrasqueira', 'Solarium com churrasqueira', 'Solarium com churrasqueira no rooftop do Green Open Residencial'),
  f('terraco-gourmet', 'Terraço gourmet', 'Terraço gourmet do Green Open Residencial', 1800, 1013),
  f('espaco-gourmet', 'Espaço gourmet', 'Espaço gourmet do Green Open Residencial'),
  f('espaco-fitness', 'Espaço fitness', 'Espaço fitness do Green Open Residencial', 1800, 1012),
  f('coworking', 'Coworking', 'Coworking do Green Open Residencial', 1800, 1013),
  f('playground', 'Playground', 'Playground do Green Open Residencial'),
  f('espaco-kids', 'Espaço kids', 'Espaço kids do Green Open Residencial', 1000, 565),
  f('pet-park', 'Pet park', 'Pet park do Green Open Residencial', 1800, 1013),
  f('pet-shower', 'Pet shower', 'Pet shower do Green Open Residencial'),
  f('bicicletario', 'Bicicletário', 'Bicicletário com ponto de recarga para bicicletas elétricas do Green Open Residencial'),
  f('point-delivery', 'Point delivery', 'Point delivery para encomendas do Green Open Residencial'),
];

const FOTOS_APTO: Foto[] = [
  f('sala', 'Sala', 'Sala do apartamento decorado do Green Open Residencial'),
  f('varanda-gourmet', 'Varanda gourmet', 'Varanda gourmet do apartamento decorado do Green Open Residencial', 1800, 1615),
  f('dormitorio', 'Dormitório', 'Dormitório do apartamento decorado do Green Open Residencial'),
  f('dormitorio-infantil', 'Dormitório infantil', 'Dormitório infantil do apartamento decorado do Green Open Residencial'),
];

const FOTOS_FACHADA: Foto[] = [
  f('fachada', 'Fachada', 'Fachada do Green Open Residencial, da GPCON, na Rua São Geraldo, Fonseca, Niterói', 1800, 1577),
  f('fachada-noturna', 'Fachada à noite', 'Fachada do Green Open Residencial ao anoitecer', 1800, 1386),
  f('vista-aerea-horto-do-fonseca', 'Horto do Fonseca', 'Vista aérea do Horto do Fonseca e da localização do Green Open Residencial', 1800, 1350),
  f('vista-aerea-fonseca', 'Vista aérea', 'Vista aérea ilustrativa do Green Open Residencial no Fonseca', 1800, 1108),
  f('mapa-aereo-regiao', 'Pontos da região', 'Foto aérea do Fonseca com pontos de referência próximos ao Green Open Residencial', 1800, 1238),
];

type Grupo = 'studio' | '2q' | 'garden' | 'cob';
type Tipo = { id: string; grupo: Grupo; nome: string; area: string; detalhe: string; destaques: string[]; planta: Foto; quartos: string };
const p = (nome: string, label: string, w: number, h: number): Foto => ({
  src: img(`planta-${nome}`),
  label,
  alt: `Planta ${label} do Green Open Residencial, Fonseca, Niterói`,
  w,
  h,
});

const TIPOS: Tipo[] = [
  { id: 's14', grupo: 'studio', quartos: '1 quarto', nome: 'Studio com varanda', area: '34,53 m²', detalhe: 'Coluna 14', destaques: ['Varanda', 'Ideal para investir'], planta: p('studio-34m2', 'do studio com varanda (34,53 m²)', 1074, 906) },
  { id: 't01', grupo: '2q', quartos: '2 quartos', nome: '2 quartos com varanda', area: '48,93 m²', detalhe: 'Coluna 1', destaques: ['Varanda', 'Quarto reversível'], planta: p('2-quartos-48m2', 'do 2 quartos com varanda (48,93 m², coluna 1)', 1035, 927) },
  { id: 't02', grupo: '2q', quartos: '2 quartos', nome: '2 quartos com suíte e varanda', area: '54,12 m²', detalhe: 'Coluna 2', destaques: ['Suíte', 'Varanda'], planta: p('2-quartos-suite-54m2', 'do 2 quartos com suíte (54,12 m², coluna 2)', 998, 1049) },
  { id: 't07', grupo: '2q', quartos: '2 quartos', nome: '2 quartos com suíte e varanda', area: '56,26 m²', detalhe: 'Coluna 7 · maior 2 quartos', destaques: ['Suíte', 'Varanda'], planta: p('2-quartos-suite-56m2', 'do 2 quartos com suíte (56,26 m², coluna 7)', 734, 1059) },
  { id: 'g114', grupo: 'garden', quartos: '1 quarto', nome: 'Studio garden', area: '53,08 m²', detalhe: 'Apto 114 · térreo', destaques: ['Espaço garden', 'Térreo'], planta: p('studio-garden-53m2', 'do studio garden (53,08 m², apto 114)', 1495, 890) },
  { id: 'g102', grupo: 'garden', quartos: '2 quartos', nome: '2 quartos garden com suíte', area: '93,88 m²', detalhe: 'Apto 102 · térreo', destaques: ['Suíte', 'Garden', 'Terraço'], planta: p('garden-2-quartos-suite-93m2', 'do 2 quartos garden com suíte (93,88 m², apto 102)', 755, 836) },
  { id: 'g113', grupo: 'garden', quartos: '2 quartos', nome: '2 quartos garden', area: '99,49 m²', detalhe: 'Apto 113 · térreo', destaques: ['Garden amplo', 'Térreo'], planta: p('garden-2-quartos-99m2', 'do 2 quartos garden (99,49 m², apto 113)', 1169, 1002) },
  { id: 'c901', grupo: 'cob', quartos: '2 quartos', nome: 'Cobertura com suíte e terraço', area: '129,39 m²', detalhe: 'Cobertura 901', destaques: ['Suíte', 'Terraço descoberto'], planta: p('cobertura-901-129m2', 'da cobertura 901 (129,39 m²)', 1275, 1031) },
  { id: 'c902', grupo: 'cob', quartos: '2 quartos', nome: 'Cobertura com suíte e terraço', area: '123,39 m²', detalhe: 'Cobertura 902', destaques: ['Suíte', 'Terraço descoberto'], planta: p('cobertura-902-123m2', 'da cobertura 902 (123,39 m²)', 1593, 952) },
];

const FILTROS: Array<{ id: 'todos' | Grupo; label: string }> = [
  { id: 'todos', label: 'Todas' },
  { id: 'studio', label: 'Studio' },
  { id: '2q', label: '2 quartos' },
  { id: 'garden', label: 'Garden' },
  { id: 'cob', label: 'Coberturas' },
];

const SUSTENTAVEL = [
  { icon: <Wifi className="h-6 w-6" />, t: 'Wi-Fi nas áreas de lazer', d: 'Ponto de conexão para uso comum no lazer: trabalhe no coworking ou no terraço.' },
  { icon: <Bike className="h-6 w-6" />, t: 'Recarga para bicicleta elétrica', d: 'Ponto de recarga no bicicletário, para quem troca o carro pela bike no dia a dia.' },
  { icon: <Zap className="h-6 w-6" />, t: 'Tomadas USB no lazer', d: 'Nos espaços gourmet, coworking, kids e fitness.' },
  { icon: <Droplets className="h-6 w-6" />, t: 'Água medida por apartamento', d: 'Previsão para hidrômetro individual: cada um paga o que consome.' },
  { icon: <Flame className="h-6 w-6" />, t: 'Gás individual', d: 'Previsão para medidor de gás individual em cada unidade.' },
  { icon: <Recycle className="h-6 w-6" />, t: 'Reúso de águas cinzas', d: 'Reservatório para águas cinzas tratadas e reservatório de retardo previstos no memorial.' },
];

const PERTO = [
  { grupo: 'Natureza', icon: <Trees className="h-5 w-5" />, itens: ['A poucos passos do Horto do Fonseca', 'Rua sem saída, 100% residencial'] },
  { grupo: 'No dia a dia', icon: <ShoppingBag className="h-5 w-5" />, itens: ['3 min de escolas, farmácias e supermercados', 'Amplo comércio nos arredores'] },
  { grupo: 'Mobilidade', icon: <Car className="h-5 w-5" />, itens: ['Entre a Alameda São Boaventura e a Rua Des. Lima Castro', '15 min da Ponte Rio–Niterói', '20 min de Icaraí e do Centro de Niterói'] },
  { grupo: 'Praias', icon: <Waves className="h-5 w-5" />, itens: ['25 min da orla de São Francisco', '30 min das Praias Oceânicas'] },
];

function Oferta({ claro = false }: { claro?: boolean }) {
  return (
    <div>
      <p className={`text-sm ${claro ? 'text-lime-50/90' : 'text-slate-600'}`}>A partir de</p>
      <p className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${claro ? 'text-white' : 'text-[#1E4D2B]'}`}>
        {PRECO}
        <span className="text-[#A6D15A]">*</span>
      </p>
      <p className={`mt-1 text-xs leading-snug ${claro ? 'text-lime-50/90' : 'text-slate-600'}`}>{GREEN_AVISO_PRECO}</p>
    </div>
  );
}

type Modal = { tipo?: Tipo } | null;

export default function GreenOpenResidencialNiteroi() {
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
    <div className="min-h-screen bg-[#F4F7F0] font-sans text-[#1F2A22] selection:bg-[#2F6B3A] selection:text-white">
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
        <meta property="og:image" content="https://queromeumcmv.com.br/og/green-open-residencial-niteroi.jpg" />
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
              alt="Fachada do Green Open Residencial, da GPCON, com jardins verticais, no Fonseca, em Niterói"
              width={1800}
              height={1577}
              fetchPriority="high"
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover object-[50%_40%]"
            />
          </picture>
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#10301B]/95 via-[#10301B]/80 to-[#10301B]/40" />

          <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:py-14">
            <nav className="mb-3 text-sm text-lime-50/80 sm:mb-6" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1">
                <li><Link to="/" className="hover:text-white">Início</Link></li>
                <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
                <li><Link to="/niteroirj" className="hover:text-white">Imóveis em Niterói</Link></li>
                <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
                <li className="font-semibold text-white" aria-current="page">Green Open Residencial</li>
              </ol>
            </nav>

            <div className="grid gap-x-8 gap-y-5 lg:grid-cols-12 lg:items-center">
              <div className="order-1 space-y-3 sm:space-y-4 lg:col-span-7 lg:row-start-1 lg:space-y-5">
                <p className="inline-flex items-center gap-2 rounded-full bg-[#A6D15A] px-3 py-1 text-xs font-extrabold tracking-widest text-[#10301B]">
                  <Leaf className="h-4 w-4" /> INOVAÇÃO E SUSTENTABILIDADE
                </p>
                <h1 className="text-[1.4rem] font-extrabold leading-snug sm:text-3xl sm:leading-tight md:text-[2.6rem]">
                  Green Open Residencial: viva ao lado do Horto do Fonseca, com inovação e sustentabilidade em Niterói
                </h1>
                <p className="max-w-2xl text-[15px] leading-relaxed text-lime-50/90 sm:text-lg">
                  Studios, 2 quartos, gardens e coberturas em rua sem saída e 100% residencial, com piscina no rooftop, Wi-Fi no
                  lazer e recarga para bicicleta elétrica.
                </p>
                <p className="hidden items-start gap-2 text-lime-50/90 sm:flex">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#A6D15A]" />
                  Rua São Geraldo, 75 · Fonseca – Niterói, RJ
                </p>
                <div className="max-w-xl rounded-2xl border border-white/15 bg-white/10 px-4 py-3 sm:p-5">
                  <Oferta claro />
                </div>
              </div>

              <div className="order-3 lg:col-span-7 lg:row-start-2">
                <ul className="grid max-w-xl gap-2 text-sm sm:grid-cols-2" aria-label="Destaques">
                  {['Inovação e sustentabilidade', 'Todos os apês com varanda ou garden', 'Lazer completo do térreo ao rooftop', 'Obra financiada com garantia da CAIXA'].map((t) => (
                    <li key={t} className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#A6D15A]" />{t}</li>
                  ))}
                </ul>
              </div>

              <aside id="formulario" className="order-2 scroll-mt-24 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1" aria-label="Formulário de consulta">
                <div className="rounded-2xl border-t-4 border-[#A6D15A] bg-white p-6 text-[#1F2A22] shadow-2xl">
                  <h2 className="text-xl font-extrabold leading-snug text-[#1E4D2B]">Receba as plantas e consulte as unidades</h2>
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

        {/* ── INOVAÇÃO E SUSTENTABILIDADE (destaque da campanha) ── */}
        <section className="py-16" id="sustentabilidade">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold tracking-[0.3em] text-[#2F6B3A]">INOVAÇÃO E SUSTENTABILIDADE</p>
            <h2 className="mt-2 text-3xl font-bold text-[#1E4D2B]">Um condomínio pensado para gastar menos e viver melhor</h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-slate-700">
              Batizado em homenagem ao Horto do Fonseca, o Green Open Residencial é um condomínio compacto da GPCON, com 112
              unidades em uma torre, 2 elevadores e lazer do térreo ao rooftop. A tecnologia está a serviço da rotina e da economia
              de cada morador.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SUSTENTAVEL.map((b) => (
                <div key={b.t} className="flex gap-4 rounded-2xl border border-[#DDE6D3] bg-white p-5">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#2F6B3A]/10 text-[#2F6B3A]">{b.icon}</span>
                  <div>
                    <h3 className="font-bold text-[#1E4D2B]">{b.t}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-700">{b.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Construção em alvenaria estrutural autoportante, que reduz o uso de aço, concreto e madeira (paredes não podem ser
              removidas). Hidrômetro e medidor de gás individuais: o custo dos medidores e da instalação fica a cargo do adquirente;
              o plano de internet do Wi-Fi é contratado pelo condomínio. Conforme book e memorial descritivo.
            </p>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: <Trees className="h-6 w-6" />,
                  t: 'O verde na porta de casa',
                  d: 'A poucos passos do Horto do Fonseca, um dos maiores parques de Niterói, numa rua sem saída e 100% residencial.',
                },
                {
                  icon: <Waves className="h-6 w-6" />,
                  t: 'Lazer no rooftop',
                  d: 'Piscina com prainha, solarium com churrasqueira, espaço gourmet com terraço, fitness, coworking, kids e playground.',
                },
                {
                  icon: <Building2 className="h-6 w-6" />,
                  t: 'Plantas que cabem a sua vida',
                  d: 'De studios para investir a gardens e coberturas para a família, todos com varanda ou espaço externo.',
                },
              ].map((b) => (
                <div key={b.t} className="rounded-2xl border border-[#DDE6D3] bg-white p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#2F6B3A]/10 text-[#2F6B3A]">{b.icon}</span>
                  <h3 className="mt-4 text-lg font-bold text-[#1E4D2B]">{b.t}</h3>
                  <p className="mt-2 leading-relaxed text-slate-700">{b.d}</p>
                </div>
              ))}
            </div>
            <dl className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Unidades', '112 em 1 torre'],
                ['Pavimentos', 'Térreo + 7 tipo + cobertura'],
                ['Elevadores', '2'],
                ['Vagas', '37 (3 para PcD)'],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-[#1E4D2B] p-4 text-white">
                  <dt className="text-xs uppercase tracking-wide text-lime-50/80">{k}</dt>
                  <dd className="mt-1 font-bold">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── PLANTAS ── */}
        <section className="bg-white py-16" id="plantas">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold tracking-[0.3em] text-[#2F6B3A]">PLANTAS</p>
            <h2 className="mt-2 text-3xl font-bold text-[#1E4D2B]">Do studio à cobertura, com varanda ou garden</h2>
            <p className="mt-3 max-w-3xl text-slate-700">
              Áreas privativas de 34,53 m² a 129,39 m². Veja algumas das plantas do book e consulte as unidades disponíveis.
            </p>
            <div role="group" aria-label="Filtrar plantas" className="mt-6 flex flex-wrap gap-2">
              {FILTROS.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  aria-pressed={filtro === x.id}
                  onClick={() => setFiltro(x.id)}
                  className={`min-h-[44px] rounded-full border px-4 text-sm font-semibold transition-colors ${
                    filtro === x.id ? 'border-[#1E4D2B] bg-[#1E4D2B] text-white' : 'border-slate-300 bg-white hover:border-[#1E4D2B]'
                  }`}
                >
                  {x.label}
                </button>
              ))}
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tiposVisiveis.map((t) => (
                <article key={t.id} className="flex flex-col overflow-hidden rounded-2xl border border-[#DDE6D3] bg-[#F8FAF5]">
                  <button type="button" onClick={() => verFoto(TIPOS.map((x) => x.planta), TIPOS.indexOf(t))} className="flex h-56 items-center justify-center bg-white p-3" aria-label={`Ampliar planta: ${t.nome} ${t.area}`}>
                    <img src={t.planta.src} alt={t.planta.alt} width={t.planta.w} height={t.planta.h} loading="lazy" className="max-h-full max-w-full object-contain" />
                  </button>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#2F6B3A]">{t.detalhe}</p>
                    <h3 className="text-lg font-bold text-[#1E4D2B]">{t.nome} · {t.area}</h3>
                    <ul className="flex flex-wrap gap-1.5">
                      {t.destaques.map((d) => (
                        <li key={d} className="rounded-full border border-[#DDE6D3] bg-white px-2.5 py-1 text-xs">{d}</li>
                      ))}
                    </ul>
                    <button type="button" onClick={() => consultar(t)} className="mt-auto min-h-[48px] rounded-xl bg-[#2F6B3A] font-bold text-white hover:bg-[#245530]">
                      Consultar esta planta
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Áreas privativas conforme o quadro de áreas do book. No memorial de incorporação, o segundo quarto dos apartamentos de
              2 quartos consta como cômodo reversível. Decoração ilustrativa; móveis e equipamentos não fazem parte do contrato.
            </p>
          </div>
        </section>

        {/* ── GALERIA ── */}
        <section className="bg-[#1E4D2B] py-16 text-white" id="galeria">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold tracking-[0.3em] text-[#A6D15A]">GALERIA</p>
            <h2 className="mt-2 text-3xl font-bold">Conforto, modernidade e um toque de natureza</h2>
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
                    galeria === id ? 'border-white bg-white text-[#1E4D2B]' : 'border-white/40 hover:border-white'
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
            <p className="mt-4 text-xs text-lime-50/70">
              Perspectivas e fotos ilustrativas. Decoração, equipamentos, mobiliário e paisagismo são sugestões e não fazem parte das
              obrigações de entrega do imóvel.
            </p>
          </div>
        </section>

        {/* ── LOCALIZAÇÃO ── */}
        <section className="py-16" id="localizacao">
          <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-[#2F6B3A]">LOCALIZAÇÃO</p>
              <h2 className="mt-2 text-3xl font-bold text-[#1E4D2B]">Entre o Horto e a Zona Sul de Niterói</h2>
              <p className="mt-3 flex items-start gap-2 text-slate-700">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#2F6B3A]" />
                Rua São Geraldo, 75 — Fonseca, Niterói, RJ · CEP 24120-430
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {PERTO.map((g) => (
                  <div key={g.grupo} className="rounded-xl border border-[#DDE6D3] bg-white p-4">
                    <p className="flex items-center gap-2 font-bold text-[#1E4D2B]"><span className="text-[#2F6B3A]">{g.icon}</span>{g.grupo}</p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-700">{g.itens.map((i) => <li key={i}>{i}</li>)}</ul>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Tempos de deslocamento informados no book da incorporadora. Stand de vendas: Rua Desembargador Lima Castro, 154 –
                Fonseca.
              </p>
            </div>
            <button type="button" onClick={() => verFoto(FOTOS_FACHADA, 2)} className="overflow-hidden rounded-2xl shadow-lg">
              <img src={img('vista-aerea-horto-do-fonseca')} alt={FOTOS_FACHADA[2].alt} width={1800} height={1350} loading="lazy" className="w-full" />
            </button>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-white py-16" id="duvidas">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-center text-3xl font-bold text-[#1E4D2B]">Dúvidas frequentes sobre o Green Open Residencial</h2>
            <div className="space-y-3">
              {FAQ_GREEN.map((q, i) => (
                <details key={q.pergunta} open={i === 0} className="group rounded-xl border border-[#DDE6D3] bg-[#F8FAF5] p-5">
                  <summary className="flex cursor-pointer list-none justify-between gap-4 font-bold text-[#1E4D2B]">
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
            <div className="grid items-center gap-6 rounded-2xl border border-[#DDE6D3] bg-white p-6 md:grid-cols-[160px_1fr] md:p-8">
              <img src="/joel-marcos-corretor-de-imoveis-itaborai.webp" alt="Joel Marcos, corretor de imóveis CRECI 39.583F" width={160} height={160} loading="lazy" className="mx-auto h-32 w-32 rounded-full object-cover md:h-40 md:w-40" />
              <div className="space-y-3">
                <p className="text-xs font-bold tracking-[0.3em] text-[#2F6B3A]">QUEM VAI TE ATENDER</p>
                <h2 className="text-2xl font-bold text-[#1E4D2B]">Joel Marcos — Corretor de Imóveis · CRECI 39.583F</h2>
                <p className="leading-relaxed text-slate-700">
                  Corretor desde 2002, com atendimento em Itaboraí, São Gonçalo e Niterói. Envio as plantas, confiro a
                  disponibilidade com a construtora, agendo a visita ao decorado e acompanho a simulação e a análise de crédito.
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1.5"><Award className="h-4 w-4 text-[#2F6B3A]" />24 anos de mercado</span>
                  <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-[#2F6B3A]" />Seg a sex, 9h às 17h</span>
                  <Link to="/sobre" className="text-[#2F6B3A] underline">Conheça o corretor</Link>
                </div>
                <p className="text-xs text-slate-500">
                  Informações extraídas do book digital oficial da GPCON (dezembro de 2024), conferidas em {GREEN_DATA_CONFERENCIA}.
                  Preço inicial informado pelo corretor.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="relative overflow-hidden py-16 text-white" id="contato">
          <img src={img('piscina-rooftop')} alt="" aria-hidden="true" width={1800} height={1013} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#10301B]/85" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="space-y-5">
              <p className="inline-flex items-center gap-2 rounded-full bg-[#A6D15A] px-3 py-1 text-xs font-extrabold tracking-widest text-[#10301B]">
                <Leaf className="h-4 w-4" /> INOVAÇÃO E SUSTENTABILIDADE
              </p>
              <h2 className="text-3xl font-bold leading-tight md:text-4xl">Mais espaço para sonhar, perto do verde.</h2>
              <Oferta claro />
              <ul className="space-y-2 text-lime-50/90">
                <li className="flex gap-2"><Home className="h-5 w-5 shrink-0 text-[#A6D15A]" />Plantas e unidades disponíveis</li>
                <li className="flex gap-2"><ShieldCheck className="h-5 w-5 shrink-0 text-[#A6D15A]" />Simulação de financiamento para a sua renda</li>
                <li className="flex gap-2"><Building2 className="h-5 w-5 shrink-0 text-[#A6D15A]" />Visita ao stand e ao decorado</li>
              </ul>
            </div>
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <LeadForm
                confirmarGravacao
                idPrefix="final-"
                titulo="Receba as plantas e consulte as unidades"
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
              ['/niteroi-open-residence', 'Niterói Open Residencial', 'Outro condomínio da GPCON no Fonseca.'],
              ['/caminhos-guanabara-niteroi', 'Caminhos da Guanabara', 'Lançamento da Cury no Caminho Niemeyer.'],
              ['/financiamento-minha-casa-minha-vida', 'Financiamento', 'Como funciona o financiamento do seu imóvel.'],
            ].map(([to, t, d]) => (
              <Link key={to} to={to} className="rounded-xl border border-[#DDE6D3] bg-white p-5 transition-all hover:border-[#2F6B3A] hover:shadow-md">
                <p className="font-bold text-[#1E4D2B]">{t}</p>
                <p className="mt-1 text-sm text-slate-600">{d}</p>
              </Link>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-7xl px-4 text-xs leading-relaxed text-slate-500 sm:px-6 lg:px-8">
            {GREEN_AVISO_PRECO} Imagens e plantas meramente ilustrativas. Registro da incorporação prenotado na matrícula nº 27937
            no Registro de Imóveis do 14º Ofício de Justiça de Niterói, sob o nº 95169, em 27/09/2024. Incorporação e construção:
            GPCON (GPCON Green Open Residencial SPE Ltda.). Projeto aprovado na PMN (99000033305/2023). Financiamento sujeito à
            análise e aprovação de crédito. Intermediação: Joel Marcos, corretor de imóveis, CRECI 39.583F.
          </p>
        </section>
      </main>

      {/* Barra fixa no celular (o WhatsApp fica no botão flutuante padrão do site, à direita) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white py-2.5 pl-3 pr-20 shadow-[0_-6px_18px_rgba(0,0,0,0.08)] lg:hidden">
        <a href="#formulario" className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#2F6B3A] font-extrabold text-white">
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
        aria-label="Consultar planta do Green Open Residencial"
        className="m-auto w-full max-w-lg bg-transparent p-0 backdrop:bg-[#10301B]/70 max-sm:mb-0 max-sm:max-w-none"
      >
        {modal && (
          <div className="relative max-h-[92vh] overflow-y-auto rounded-2xl bg-white max-sm:rounded-b-none">
            <button type="button" onClick={fecharForm} aria-label="Fechar" className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200">
              <X className="h-5 w-5 text-[#1E4D2B]" />
            </button>
            <div className="px-5 pr-16 pt-5">
              <p className="text-[11px] font-bold tracking-[0.25em] text-[#2F6B3A]">GREEN OPEN · FONSECA</p>
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
        aria-label="Galeria de imagens do Green Open Residencial"
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
