import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import { CAMINHOS_AVISO_PRECO, CAMINHOS_DATA_CONFERENCIA, FAQ_CAMINHOS } from '../data/caminhosGuanabara';
import {
  MapPin,
  CheckCircle2,
  ChevronRight,
  X,
  Sun,
  Waves,
  Award,
  Users,
  Home,
  ShieldCheck,
  Building2,
  Landmark,
  ShoppingBag,
  Bike,
  GraduationCap,
  HeartPulse,
} from 'lucide-react';

// ─── Landing: Caminhos da Guanabara (Cury) — região do Caminho Niemeyer, Centro de Niterói ───
// Head (title/description/canonical/OG) e JSON-LD são gerados no build a partir de
// src/seo/routes.ts (rota /caminhos-guanabara-niteroi). O Helmet abaixo repete os dados para
// a navegação interna (SPA). Fonte dos dados: book oficial (ver src/data/caminhosGuanabara.ts).

const SLUG = '/caminhos-guanabara-niteroi';
const URL_PAGINA = `https://queromeumcmv.com.br${SLUG}`;
const EMPREENDIMENTO = 'Caminhos da Guanabara — Niterói';
const TITLE = 'Caminhos da Guanabara | 1 e 2 Quartos a partir de R$ 340 mil';
const DESCRIPTION =
  'Caminhos da Guanabara, da Cury, no Caminho Niemeyer, Niterói: 1 e 2 quartos com varanda, lazer completo e rooftop com vista para a Baía. A partir de R$ 340 mil.';
const PRECO = 'R$ 340.000';
const FORM = 'lead_caminhos_guanabara';

const img = (nome: string) => `/caminhos-da-guanabara-niteroi-${nome}.webp`;

type Foto = { src: string; alt: string; label: string; w: number; h: number };
const f = (nome: string, label: string, alt: string, w: number, h: number): Foto => ({ src: img(nome), label, alt, w, h });

const FOTOS_LAZER: Foto[] = [
  f('solario-rooftop', 'Solário no rooftop', 'Solário no rooftop do Caminhos da Guanabara com vista para a Baía de Guanabara', 1691, 1081),
  f('rooftop-espaco-gourmet', 'Espaço gourmet no rooftop', 'Espaço gourmet no rooftop do Caminhos da Guanabara com vista para a Baía', 1586, 999),
  f('piscina-adulto', 'Piscina adulto', 'Piscina adulto do Caminhos da Guanabara, Niterói', 1671, 1081),
  f('campo-society', 'Campo society', 'Campo society do Caminhos da Guanabara', 1678, 1083),
  f('quadra-de-areia', 'Quadra de areia', 'Quadra de areia do Caminhos da Guanabara', 1800, 1014),
  f('academia', 'Academia', 'Academia do Caminhos da Guanabara', 1675, 1083),
  f('academia-externa', 'Academia externa', 'Academia externa do Caminhos da Guanabara', 1661, 1080),
  f('salao-de-festas', 'Salão de festas', 'Salão de festas do Caminhos da Guanabara', 1800, 1014),
  f('apoio-salao-de-festas', 'Apoio salão de festas', 'Área de apoio do salão de festas do Caminhos da Guanabara', 1452, 940),
  f('churrasqueira', 'Churrasqueira', 'Espaço gourmet com churrasqueira do Caminhos da Guanabara', 1800, 1013),
  f('salao-de-jogos', 'Salão de jogos', 'Salão de jogos do Caminhos da Guanabara', 1493, 1013),
  f('brinquedoteca', 'Brinquedoteca', 'Brinquedoteca do Caminhos da Guanabara', 1779, 890),
  f('playground', 'Playground', 'Playground do Caminhos da Guanabara', 1800, 1014),
  f('praca-de-jogos', 'Praça de jogos', 'Praça de jogos do Caminhos da Guanabara', 1680, 1083),
  f('sauna', 'Sauna', 'Sauna do Caminhos da Guanabara', 1729, 1083),
  f('coworking', 'Coworking', 'Coworking do Caminhos da Guanabara', 1766, 971),
  f('pet-place', 'Pet care', 'Pet care do Caminhos da Guanabara', 1152, 1083),
  f('lavanderia', 'Lavanderia', 'Lavanderia do Caminhos da Guanabara', 1679, 1083),
];

const FOTOS_FACHADA: Foto[] = [
  f('fachada-noturna-baia', 'Fachada à noite', 'Torres do Caminhos da Guanabara à noite com a Baía de Guanabara ao fundo', 1214, 909),
  f('portaria', 'Portaria', 'Portaria do Caminhos da Guanabara, Centro de Niterói', 1800, 1014),
  f('loja-e-fachada', 'Fachada e lojas', 'Fachada do Caminhos da Guanabara com jardim e lojas', 1800, 1013),
  f('vista-aerea-caminho-niemeyer', 'Foto aérea da região', 'Foto aérea do Centro de Niterói com o Caminho Niemeyer e a Baía de Guanabara', 1800, 1015),
  f('implantacao-lazer', 'Implantação do lazer', 'Implantação do lazer do Caminhos da Guanabara com piscinas, campo society e rooftop', 1800, 1012),
  f('implantacao-terreo', 'Implantação do térreo', 'Implantação do térreo do Caminhos da Guanabara com guarita, acessos e estacionamento', 1800, 1012),
];

type Tipo = { id: string; grupo: '1q' | '2q' | '2qs'; nome: string; area: string; destaques: string[]; planta: Foto; quartos: '1 quarto' | '2 quartos' };
const p = (nome: string, label: string, w: number, h: number): Foto => ({
  src: img(`planta-${nome}`),
  label,
  alt: `Planta do apartamento ${label} do Caminhos da Guanabara, Niterói`,
  w,
  h,
});

const TIPOS: Tipo[] = [
  { id: '1q', grupo: '1q', quartos: '1 quarto', nome: '1 quarto com varanda', area: '32,70 m²', destaques: ['Varanda', 'Piso laminado no quarto'], planta: p('1-quarto-32m2', '1 quarto com varanda, 32,70 m²', 797, 912) },
  { id: '2q-4255', grupo: '2q', quartos: '2 quartos', nome: '2 quartos com varanda', area: '42,55 m²', destaques: ['Varanda', 'Piso laminado nos quartos'], planta: p('2-quartos-42-55m2', '2 quartos com varanda, 42,55 m²', 1297, 795) },
  { id: '2q-4289', grupo: '2q', quartos: '2 quartos', nome: '2 quartos com varanda', area: '42,89 m²', destaques: ['Varanda', 'Piso laminado nos quartos'], planta: p('2-quartos-42-89m2', '2 quartos com varanda, 42,89 m²', 1145, 862) },
  { id: '2q-4351', grupo: '2q', quartos: '2 quartos', nome: '2 quartos com varanda', area: '43,51 m²', destaques: ['Varanda', 'Piso laminado nos quartos'], planta: p('2-quartos-43-51m2', '2 quartos com varanda, 43,51 m²', 874, 869) },
  { id: '2q-4362', grupo: '2q', quartos: '2 quartos', nome: '2 quartos com varanda', area: '43,62 m²', destaques: ['Varanda', 'Piso laminado nos quartos'], planta: p('2-quartos-43-62m2', '2 quartos com varanda, 43,62 m²', 748, 801) },
  { id: '2qs', grupo: '2qs', quartos: '2 quartos', nome: '2 quartos com suíte e varanda', area: '51,30 m²', destaques: ['Suíte', 'Varanda', 'Piso laminado nos quartos'], planta: p('2-quartos-suite-51m2', '2 quartos com suíte e varanda, 51,30 m²', 1142, 715) },
];

const FILTROS: Array<{ id: 'todos' | Tipo['grupo']; label: string }> = [
  { id: 'todos', label: 'Todas' },
  { id: '1q', label: '1 quarto' },
  { id: '2q', label: '2 quartos' },
  { id: '2qs', label: '2 quartos com suíte' },
];

const PERTO = [
  { grupo: 'Mobilidade', icon: <Bike className="h-5 w-5" />, itens: ['Av. Feliciano Sodré', 'Av. Visconde do Rio Branco', 'Terminal João Goulart', 'CCR Barcas · Estação Araribóia'] },
  { grupo: 'Cultura', icon: <Landmark className="h-5 w-5" />, itens: ['Caminho Niemeyer', 'Teatro Popular Oscar Niemeyer', 'Memorial Roberto Silveira', 'Museu de Arte Contemporânea'] },
  { grupo: 'Compras', icon: <ShoppingBag className="h-5 w-5" />, itens: ['Shopping Bay Market', 'Plaza Shopping Niterói', 'Supermercado Guanabara'] },
  { grupo: 'Estudo e saúde', icon: <GraduationCap className="h-5 w-5" />, itens: ['UFF', 'Hospital Icaraí'] },
];

function Oferta({ claro = false }: { claro?: boolean }) {
  return (
    <div>
      <p className={`text-sm ${claro ? 'text-sky-50/90' : 'text-slate-600'}`}>A partir de</p>
      <p className={`text-3xl font-extrabold tracking-tight sm:text-4xl ${claro ? 'text-white' : 'text-[#123A47]'}`}>
        {PRECO}
        <span className="text-[#D9B45A]">*</span>
      </p>
      <p className={`mt-1 text-xs leading-snug ${claro ? 'text-sky-50/90' : 'text-slate-600'}`}>{CAMINHOS_AVISO_PRECO}</p>
    </div>
  );
}

type Modal = { tipo?: Tipo } | null;

export default function CaminhosGuanabaraNiteroi() {
  const [modal, setModal] = useState<Modal>(null);
  const [foto, setFoto] = useState<{ lista: Foto[]; i: number } | null>(null);
  const [filtro, setFiltro] = useState<'todos' | Tipo['grupo']>('todos');
  const [galeria, setGaleria] = useState<'lazer' | 'fachada'>('lazer');
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
  const fotosGaleria = galeria === 'lazer' ? FOTOS_LAZER : FOTOS_FACHADA;

  return (
    <div className="min-h-screen bg-[#F6F3EC] font-sans text-[#1F2A30] selection:bg-[#0E5A6B] selection:text-white">
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
        <meta property="og:image" content="https://queromeumcmv.com.br/og/caminhos-da-guanabara-niteroi.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="Niterói" />
        <link rel="preload" as="image" href={img('solario-rooftop-800')} media="(max-width: 767px)" fetchPriority="high" />
        <link rel="preload" as="image" href={img('solario-rooftop')} media="(min-width: 768px)" fetchPriority="high" />
      </Helmet>

      <Header />

      <main id="main-content">
        {/* ── PRIMEIRA DOBRA ── */}
        <section className="relative overflow-hidden text-white">
          <picture>
            <source media="(max-width: 767px)" srcSet={img('solario-rooftop-800')} />
            <img
              src={img('solario-rooftop')}
              alt="Solário no rooftop do Caminhos da Guanabara com vista para a Baía de Guanabara, em Niterói"
              width={1691}
              height={1081}
              fetchPriority="high"
              loading="eager"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#0B2A35]/95 via-[#0B2A35]/80 to-[#0B2A35]/45" />

          <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:py-14">
            <nav className="mb-3 text-sm text-sky-50/80 sm:mb-6" aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1">
                <li><Link to="/" className="hover:text-white">Início</Link></li>
                <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
                <li><Link to="/niteroirj" className="hover:text-white">Imóveis em Niterói</Link></li>
                <li aria-hidden="true"><ChevronRight className="h-3.5 w-3.5" /></li>
                <li className="font-semibold text-white" aria-current="page">Caminhos da Guanabara</li>
              </ol>
            </nav>

            <div className="grid gap-x-8 gap-y-5 lg:grid-cols-12 lg:items-center">
              <div className="order-1 space-y-3 sm:space-y-4 lg:col-span-7 lg:row-start-1 lg:space-y-5">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold tracking-widest">
                  LANÇAMENTO CURY · CAMINHO NIEMEYER
                </p>
                <h1 className="text-[1.4rem] font-extrabold leading-snug sm:text-3xl sm:leading-tight md:text-[2.6rem]">
                  Caminhos da Guanabara: 1 e 2 quartos no Caminho Niemeyer, com rooftop de frente para a Baía de Guanabara
                </h1>
                <p className="max-w-2xl text-[15px] leading-relaxed text-sky-50/90 sm:text-lg">
                  Onde todos os seus caminhos se encontram: barcas, terminal e shopping por perto, e o pôr do sol na Baía visto do
                  rooftop.
                </p>
                <p className="hidden items-start gap-2 text-sky-50/90 sm:flex">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#D9B45A]" />
                  Centro, Niterói – RJ · região do Caminho Niemeyer
                </p>
                <div className="max-w-xl rounded-2xl border border-white/15 bg-white/10 px-4 py-3 sm:p-5">
                  <Oferta claro />
                </div>
              </div>

              <div className="order-3 lg:col-span-7 lg:row-start-2">
                <ul className="grid max-w-xl gap-2 text-sm sm:grid-cols-2" aria-label="Destaques">
                  {['1 e 2 quartos, todos com varanda', 'Opção com suíte e com vaga', 'Lazer completo e rooftop', 'Piso laminado nos quartos'].map((t) => (
                    <li key={t} className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-[#D9B45A]" />{t}</li>
                  ))}
                </ul>
              </div>

              <aside id="formulario" className="order-2 scroll-mt-24 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1" aria-label="Formulário de consulta">
                <div className="rounded-2xl border-t-4 border-[#D9B45A] bg-white p-6 text-[#1F2A30] shadow-2xl">
                  <h2 className="text-xl font-extrabold leading-snug text-[#123A47]">Receba as plantas e consulte as unidades</h2>
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
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold tracking-[0.3em] text-[#0E5A6B]">POR QUE MORAR AQUI</p>
            <h2 className="mt-2 text-3xl font-bold text-[#123A47]">Lazer aqui dentro, diversão lá fora</h2>
            <p className="mt-3 max-w-3xl leading-relaxed text-slate-700">
              O Caminhos da Guanabara é um condomínio da Cury no Centro de Niterói, na região do Caminho Niemeyer, com 1.068
              apartamentos de 1 e 2 quartos em dois blocos, lazer completo entregue equipado e decorado e rooftop com vista para
              a Baía de Guanabara. A fachada é assinada pela A+ Arquitetura e o paisagismo, pela Rossin &amp; Tramontina.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: <Sun className="h-6 w-6" />,
                  t: 'A Baía de Guanabara como paisagem',
                  d: 'Solário, espaço gourmet e praça no rooftop do bloco 1, para receber os amigos com o pôr do sol de fundo.',
                },
                {
                  icon: <Waves className="h-6 w-6" />,
                  t: 'Um clube para a família inteira',
                  d: 'Piscinas adulto e infantil, campo society, quadra de areia, academia interna e externa, sauna e brinquedoteca.',
                },
                {
                  icon: <Building2 className="h-6 w-6" />,
                  t: 'O Centro a seus pés',
                  d: 'Terminal João Goulart, barcas, Bay Market e Plaza Shopping por perto. Coworking e lavanderia no condomínio.',
                },
              ].map((b) => (
                <div key={b.t} className="rounded-2xl border border-[#E4DCCB] bg-white p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#0E5A6B]/10 text-[#0E5A6B]">{b.icon}</span>
                  <h3 className="mt-4 text-lg font-bold text-[#123A47]">{b.t}</h3>
                  <p className="mt-2 leading-relaxed text-slate-700">{b.d}</p>
                </div>
              ))}
            </div>
            <dl className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ['Unidades', '1.068 apartamentos'],
                ['Blocos', '2 · térreo + garagem + PUC + 22 pavimentos'],
                ['Terreno', '5.624,66 m²'],
                ['Vagas', '161 de automóvel + bicicletário'],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-[#123A47] p-4 text-white">
                  <dt className="text-xs uppercase tracking-wide text-sky-100/80">{k}</dt>
                  <dd className="mt-1 font-bold">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 rounded-2xl border border-[#E4DCCB] bg-white p-6">
              <p className="font-bold text-[#123A47]">Programa Cury Chega Mais</p>
              <p className="mt-2 text-slate-700">
                Pagando em dia, você ganha vantagens: a cada 6 meses em dia, a Cury desconta uma parcela, além de descontos para
                antecipação e prioridade na vistoria e na entrega das chaves, conforme o regulamento da construtora.
              </p>
            </div>
          </div>
        </section>

        {/* ── PLANTAS ── */}
        <section className="bg-white py-16" id="plantas">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold tracking-[0.3em] text-[#0E5A6B]">PLANTAS</p>
            <h2 className="mt-2 text-3xl font-bold text-[#123A47]">1 e 2 quartos, todos com varanda</h2>
            <div role="group" aria-label="Filtrar plantas" className="mt-6 flex flex-wrap gap-2">
              {FILTROS.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  aria-pressed={filtro === x.id}
                  onClick={() => setFiltro(x.id)}
                  className={`min-h-[44px] rounded-full border px-4 text-sm font-semibold transition-colors ${
                    filtro === x.id ? 'border-[#123A47] bg-[#123A47] text-white' : 'border-slate-300 bg-white hover:border-[#123A47]'
                  }`}
                >
                  {x.label}
                </button>
              ))}
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tiposVisiveis.map((t) => (
                <article key={t.id} className="flex flex-col overflow-hidden rounded-2xl border border-[#E4DCCB] bg-[#FAF8F3]">
                  <button type="button" onClick={() => verFoto(TIPOS.map((x) => x.planta), TIPOS.indexOf(t))} className="flex h-56 items-center justify-center bg-white p-3" aria-label={`Ampliar planta: ${t.nome} ${t.area}`}>
                    <img src={t.planta.src} alt={t.planta.alt} width={t.planta.w} height={t.planta.h} loading="lazy" className="max-h-full max-w-full object-contain" />
                  </button>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#0E5A6B]">{t.quartos}</p>
                    <h3 className="text-lg font-bold text-[#123A47]">{t.nome} · {t.area}</h3>
                    <ul className="flex flex-wrap gap-1.5">
                      {t.destaques.map((d) => (
                        <li key={d} className="rounded-full border border-[#E4DCCB] bg-white px-2.5 py-1 text-xs">{d}</li>
                      ))}
                    </ul>
                    <button type="button" onClick={() => consultar(t)} className="mt-auto min-h-[48px] rounded-xl bg-[#0E5A6B] font-bold text-white hover:bg-[#0A4755]">
                      Consultar esta planta
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Decoração meramente ilustrativa; móveis e equipamentos não fazem parte do contrato. Construção em alvenaria
              estrutural: as paredes não podem ser removidas ou modificadas. Piso laminado nos quartos conforme memorial descritivo.
            </p>
          </div>
        </section>

        {/* ── GALERIA ── */}
        <section className="bg-[#123A47] py-16 text-white" id="galeria">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-bold tracking-[0.3em] text-[#D9B45A]">GALERIA</p>
            <h2 className="mt-2 text-3xl font-bold">Áreas comuns entregues equipadas e decoradas</h2>
            <div role="tablist" aria-label="Ambientes" className="mt-6 flex flex-wrap gap-2">
              {([
                ['lazer', 'Lazer e rooftop'],
                ['fachada', 'Fachada, região e implantação'],
              ] as const).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={galeria === id}
                  onClick={() => setGaleria(id)}
                  className={`min-h-[44px] rounded-full border px-4 text-sm font-semibold transition-colors ${
                    galeria === id ? 'border-white bg-white text-[#123A47]' : 'border-white/40 hover:border-white'
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
            <p className="mt-4 text-xs text-sky-50/70">
              Perspectivas ilustrativas. A vegetação representa a fase adulta das espécies; o empreendimento será entregue com
              mudas, conforme o projeto paisagístico. A lavanderia pode ser serviço terceirizado pago pelo uso (pay-per-use).
            </p>
          </div>
        </section>

        {/* ── LOCALIZAÇÃO ── */}
        <section className="py-16" id="localizacao">
          <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-xs font-bold tracking-[0.3em] text-[#0E5A6B]">LOCALIZAÇÃO</p>
              <h2 className="mt-2 text-3xl font-bold text-[#123A47]">Onde todos os seus caminhos se encontram</h2>
              <p className="mt-3 leading-relaxed text-slate-700">
                Entre a Baía de Guanabara e o Caminho Niemeyer, no encontro da natureza com o urbano.
              </p>
              <p className="mt-3 flex items-start gap-2 text-slate-700">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#0E5A6B]" />
                Rua Coronel PM Francisco Spargoli Rocha e Alameda Oscar Niemeyer — Centro, Niterói, RJ
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {PERTO.map((g) => (
                  <div key={g.grupo} className="rounded-xl border border-[#E4DCCB] bg-white p-4">
                    <p className="flex items-center gap-2 font-bold text-[#123A47]"><span className="text-[#0E5A6B]">{g.icon}</span>{g.grupo}</p>
                    <ul className="mt-2 space-y-1 text-sm text-slate-700">{g.itens.map((i) => <li key={i}>{i}</li>)}</ul>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-500">Pontos de referência indicados no book da construtora.</p>
            </div>
            <button type="button" onClick={() => verFoto(FOTOS_FACHADA, 3)} className="overflow-hidden rounded-2xl shadow-lg">
              <img src={img('vista-aerea-caminho-niemeyer')} alt={FOTOS_FACHADA[3].alt} width={1800} height={1015} loading="lazy" className="w-full" />
            </button>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-white py-16" id="duvidas">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-center text-3xl font-bold text-[#123A47]">Dúvidas frequentes sobre o Caminhos da Guanabara</h2>
            <div className="space-y-3">
              {FAQ_CAMINHOS.map((q, i) => (
                <details key={q.pergunta} open={i === 0} className="group rounded-xl border border-[#E4DCCB] bg-[#FAF8F3] p-5">
                  <summary className="flex cursor-pointer list-none justify-between gap-4 font-bold text-[#123A47]">
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
            <div className="grid items-center gap-6 rounded-2xl border border-[#E4DCCB] bg-white p-6 md:grid-cols-[160px_1fr] md:p-8">
              <img src="/joel-marcos-corretor-de-imoveis-itaborai.webp" alt="Joel Marcos, corretor de imóveis CRECI 39.583F" width={160} height={160} loading="lazy" className="mx-auto h-32 w-32 rounded-full object-cover md:h-40 md:w-40" />
              <div className="space-y-3">
                <p className="text-xs font-bold tracking-[0.3em] text-[#0E5A6B]">QUEM VAI TE ATENDER</p>
                <h2 className="text-2xl font-bold text-[#123A47]">Joel Marcos — Corretor de Imóveis · CRECI 39.583F</h2>
                <p className="leading-relaxed text-slate-700">
                  Corretor desde 2002, com atendimento em Itaboraí, São Gonçalo e Niterói. Envio as plantas, confiro a
                  disponibilidade com a construtora e acompanho a simulação e a análise de crédito.
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  <span className="flex items-center gap-1.5"><Award className="h-4 w-4 text-[#0E5A6B]" />24 anos de mercado</span>
                  <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-[#0E5A6B]" />Seg a sex, 9h às 17h</span>
                  <Link to="/sobre" className="text-[#0E5A6B] underline">Conheça o corretor</Link>
                </div>
                <p className="text-xs text-slate-500">
                  Informações extraídas do book oficial da Cury (abril de 2025), conferidas em {CAMINHOS_DATA_CONFERENCIA}. Preço
                  inicial informado pelo corretor.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="relative overflow-hidden py-16 text-white" id="contato">
          <img src={img('rooftop-espaco-gourmet')} alt="" aria-hidden="true" width={1586} height={999} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[#0B2A35]/85" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div className="space-y-5">
              <h2 className="text-3xl font-bold leading-tight md:text-4xl">Seu novo caminho começa com uma consulta.</h2>
              <Oferta claro />
              <ul className="space-y-2 text-sky-50/90">
                <li className="flex gap-2"><Home className="h-5 w-5 shrink-0 text-[#D9B45A]" />Plantas e unidades disponíveis</li>
                <li className="flex gap-2"><ShieldCheck className="h-5 w-5 shrink-0 text-[#D9B45A]" />Simulação de financiamento para a sua renda</li>
                <li className="flex gap-2"><HeartPulse className="h-5 w-5 shrink-0 text-[#D9B45A]" />Atendimento por corretor credenciado</li>
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
          <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {[
              ['/niteroirj', 'Imóveis em Niterói', 'Outras opções de apartamentos em Niterói.'],
              ['/orla-central-niteroi', 'Orla Central', 'Outro lançamento da Cury no Centro de Niterói.'],
              ['/orla-guanabara-niteroi', 'Orla Guanabara', 'Lançamento da Emccamp perto do Caminho Niemeyer.'],
              ['/sun-in-studio-design-niteroi', 'Sun In Studio Design', 'Studios no Centro de Niterói.'],
            ].map(([to, t, d]) => (
              <Link key={to} to={to} className="rounded-xl border border-[#E4DCCB] bg-white p-5 transition-all hover:border-[#0E5A6B] hover:shadow-md">
                <p className="font-bold text-[#123A47]">{t}</p>
                <p className="mt-1 text-sm text-slate-600">{d}</p>
              </Link>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-7xl px-4 text-xs leading-relaxed text-slate-500 sm:px-6 lg:px-8">
            {CAMINHOS_AVISO_PRECO} Imagens e plantas meramente ilustrativas. Incorporação, intermediação e construção: CCISA 101
            Incorporadora Ltda. (Cury). Incorporação prenotada em 30/01/2025, número 48356, no 2º Ofício de Registro de Imóveis de
            Niterói. O projeto contempla 161 vagas. Financiamento sujeito à análise e aprovação de crédito. Intermediação: Joel
            Marcos, corretor de imóveis, CRECI 39.583F.
          </p>
        </section>
      </main>

      {/* Barra fixa no celular (o WhatsApp fica no botão flutuante padrão do site, à direita) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white py-2.5 pl-3 pr-20 shadow-[0_-6px_18px_rgba(0,0,0,0.08)] lg:hidden">
        <a href="#formulario" className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-[#0E5A6B] font-extrabold text-white">
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
        aria-label="Consultar planta do Caminhos da Guanabara"
        className="m-auto w-full max-w-lg bg-transparent p-0 backdrop:bg-[#0B2A35]/70 max-sm:mb-0 max-sm:max-w-none"
      >
        {modal && (
          <div className="relative max-h-[92vh] overflow-y-auto rounded-2xl bg-white max-sm:rounded-b-none">
            <button type="button" onClick={fecharForm} aria-label="Fechar" className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200">
              <X className="h-5 w-5 text-[#123A47]" />
            </button>
            <div className="px-5 pr-16 pt-5">
              <p className="text-[11px] font-bold tracking-[0.25em] text-[#0E5A6B]">CAMINHOS DA GUANABARA · NITERÓI</p>
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
        aria-label="Galeria de imagens do Caminhos da Guanabara"
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
