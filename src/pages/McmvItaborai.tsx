import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LeadForm from '../components/LeadForm';
import { CheckCircle2, MapPin, TrendingDown, Home, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthorProfile from '../components/AuthorProfile';

/* ─────────────────────────────────────────────
   JSON-LD Schema Graph (DEO)
───────────────────────────────────────────── */
const schemaGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'RealEstateAgent',
      '@id': 'https://queromeumcmv.com.br/#agent',
      name: 'Quero Meu MCMV – Joel Marcos',
      description:
        'Corretor de imóveis especialista no programa Minha Casa Minha Vida em Itaboraí-RJ, São Gonçalo e Niterói. Aprovação de crédito Caixa Econômica Federal e subsídios MCMV.',
      identifier: 'CRECI 39.583F',
      telephone: '+55-21-96592-8399',
      url: 'https://queromeumcmv.com.br',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Rua H, nº 492, Retiro São Joaquim',
        addressLocality: 'Itaboraí',
        addressRegion: 'RJ',
        postalCode: '24813-066',
        addressCountry: 'BR',
      },
      areaServed: [
        { '@type': 'City', name: 'Itaboraí' },
        { '@type': 'City', name: 'São Gonçalo' },
        { '@type': 'City', name: 'Niterói' },
      ],
    },
    {
      '@type': 'CollectionPage',
      '@id': 'https://queromeumcmv.com.br/minha-casa-minha-vida-itaborai#page',
      url: 'https://queromeumcmv.com.br/minha-casa-minha-vida-itaborai',
      name: 'Apartamentos Minha Casa Minha Vida em Itaboraí 2026 | Lançamentos e Simulação',
      description:
        'Compare os 4 lançamentos MCMV em Itaboraí 2026: Prime Club, Reserva dos Pássaros 2, Flores de Maio e Solar de Manilha. Renda mínima, subsídio, FGTS e simulação gratuita.',
      inLanguage: 'pt-BR',
      author: { '@id': 'https://queromeumcmv.com.br/#agent' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://queromeumcmv.com.br/' },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'MCMV Itaboraí',
            item: 'https://queromeumcmv.com.br/minha-casa-minha-vida-itaborai',
          },
        ],
      },
    },
    {
      '@type': 'ItemList',
      '@id': 'https://queromeumcmv.com.br/minha-casa-minha-vida-itaborai#empreendimentos',
      name: 'Lançamentos Minha Casa Minha Vida em Itaboraí 2026',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          url: 'https://queromeumcmv.com.br/prime-club-itaborai',
          name: 'Prime Club Itaboraí',
        },
        {
          '@type': 'ListItem',
          position: 2,
          url: 'https://queromeumcmv.com.br/reserva-dos-passaros-2',
          name: 'Reserva dos Pássaros 2',
        },
        {
          '@type': 'ListItem',
          position: 3,
          url: 'https://queromeumcmv.com.br/flores-de-maio',
          name: 'Flores de Maio',
        },
        {
          '@type': 'ListItem',
          position: 4,
          url: 'https://queromeumcmv.com.br/solar-manilha-itaborai',
          name: 'Solar de Manilha',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://queromeumcmv.com.br/minha-casa-minha-vida-itaborai#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Quais os melhores bairros para comprar imóvel MCMV em Itaboraí?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Os principais bairros com lançamentos MCMV em Itaboraí em 2026 são: Outeiro das Pedras (Prime Club Itaboraí), Caluge (Reserva dos Pássaros 2), Santo Expedito (Flores de Maio) e Santo Antônio/Manilha (Solar de Manilha). Cada bairro tem perfil de mobilidade e custo de vida diferente.',
          },
        },
        {
          '@type': 'Question',
          name: 'Qual a renda mínima para o Minha Casa Minha Vida em Itaboraí em 2026?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A renda mínima familiar para participar do MCMV em Itaboraí em 2026 é de R$ 2.500/mês. Famílias com renda entre R$ 2.500 e R$ 4.400 (Faixa 1) têm acesso ao maior subsídio — até R$ 55 mil da Caixa Econômica Federal.',
          },
        },
        {
          '@type': 'Question',
          name: 'Qual o valor do subsídio do governo federal no MCMV em 2026?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Em 2026, o subsídio do Governo Federal pelo programa Minha Casa Minha Vida pode chegar a R$ 55 mil para famílias na Faixa 1 (renda até R$ 4.400/mês). O valor exato depende da renda, composição familiar e empreendimento escolhido.',
          },
        },
        {
          '@type': 'Question',
          name: 'Como funciona o parcelamento da entrada e uso do FGTS na Caixa?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No MCMV em Itaboraí, a entrada pode ser parcelada diretamente com a construtora durante a obra — em alguns lançamentos em até 72 vezes. O saldo do FGTS pode ser usado para abater a entrada ou reduzir o valor das parcelas mensais do financiamento junto à Caixa Econômica Federal.',
          },
        },
        {
          '@type': 'Question',
          name: 'Apartamento ou casa em condomínio: qual é melhor no MCMV em Itaboraí?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Depende do perfil familiar. Casas como a Reserva dos Pássaros 2 (Caluge) oferecem quintal, privacidade e lotes a partir de 150 m². Apartamentos como Prime Club e Flores de Maio oferecem lazer compartilhado (piscina, academia), segurança 24h e menor custo de manutenção individual.',
          },
        },
        {
          '@type': 'Question',
          name: 'Quais imóveis MCMV estão disponíveis em Itaboraí em 2026?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Em 2026, os lançamentos MCMV em Itaboraí disponíveis são: Prime Club Itaboraí (Outeiro das Pedras), Reserva dos Pássaros 2 (Caluge), Flores de Maio (Santo Expedito) e Solar de Manilha (Santo Antônio/Manilha). Todos com financiamento pela Caixa Econômica Federal.',
          },
        },
      ],
    },
  ],
};

/* ─────────────────────────────────────────────
   DADOS DOS EMPREENDIMENTOS (tabela comparativa)
───────────────────────────────────────────── */
const empreendimentos = [
  {
    nome: 'Prime Club Itaboraí',
    bairro: 'Outeiro das Pedras',
    tipo: 'Apartamento 2 quartos (suíte reversível)',
    destaque: 'A 3 min da Av. 22 de Maio e entrada parcelada em até 72x',
    parcela: 'Consulte',
    subsidio: 'Até R$ 55 mil',
    fgts: true,
    link: '/prime-club-itaborai',
  },
  {
    nome: 'Reserva dos Pássaros 2',
    bairro: 'Caluge',
    tipo: 'Casa não geminada 2 quartos com quintal',
    destaque: 'Lotes a partir de 150 m², acesso rápido à BR-101 e parcelas a partir de R$ 650',
    parcela: 'A partir de R$ 650/mês',
    subsidio: 'Até R$ 55 mil',
    fgts: true,
    link: '/reserva-dos-passaros-2',
  },
  {
    nome: 'Flores de Maio',
    bairro: 'Santo Expedito',
    tipo: 'Apartamento 2 quartos com varanda',
    destaque: 'A 5 min do Centro de Itaboraí, rua residencial tranquila e alto subsídio',
    parcela: 'Consulte',
    subsidio: 'Até R$ 55 mil',
    fgts: true,
    link: '/flores-de-maio',
  },
  {
    nome: 'Solar de Manilha',
    bairro: 'Santo Antônio (Manilha)',
    tipo: 'Apartamento 2 quartos e opções com garden',
    destaque: 'Na porta da BR-101 sentido Niterói/Rio e polo comercial completo',
    parcela: 'Consulte',
    subsidio: 'Até R$ 55 mil',
    fgts: true,
    link: '/solar-manilha-itaborai',
  },
];

export default function McmvItaborai() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Apartamentos Minha Casa Minha Vida em Itaboraí 2026 | Lançamentos e Simulação</title>
        <meta
          name="description"
          content="Compare os 4 lançamentos MCMV em Itaboraí 2026: Prime Club, Reserva dos Pássaros 2, Flores de Maio e Solar de Manilha. Renda a partir de R$ 2.500, subsídio até R$ 55 mil e simulação gratuita."
        />
        <link rel="canonical" href="https://queromeumcmv.com.br/minha-casa-minha-vida-itaborai" />
        <meta property="og:site_name" content="Quero Meu MCMV" />
        <meta property="og:locale" content="pt_BR" />
        <meta
          property="og:title"
          content="Apartamentos Minha Casa Minha Vida em Itaboraí 2026 | Lançamentos e Simulação"
        />
        <meta
          property="og:description"
          content="Compare os 4 lançamentos MCMV em Itaboraí 2026: Prime Club, Reserva dos Pássaros 2, Flores de Maio e Solar de Manilha. Renda a partir de R$ 2.500, subsídio até R$ 55 mil."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://queromeumcmv.com.br/minha-casa-minha-vida-itaborai"
        />
        <meta
          property="og:image"
          content="https://queromeumcmv.com.br/capa-site-quero-meu-mcmv-open-graph.webp"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Apartamentos Minha Casa Minha Vida em Itaboraí 2026 | Lançamentos"
        />
        <meta
          name="twitter:description"
          content="4 lançamentos MCMV em Itaboraí 2026. Renda a partir de R$ 2.500, subsídio até R$ 55 mil. Simulação gratuita."
        />
        <meta
          name="twitter:image"
          content="https://queromeumcmv.com.br/capa-site-quero-meu-mcmv-open-graph.webp"
        />
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="Itaboraí" />
        <meta name="geo.position" content="-22.7667;-42.8619" />
        <script type="application/ld+json">{JSON.stringify(schemaGraph)}</script>
      </Helmet>

      <Header />

      <main id="main-content">
        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="text-sm font-medium text-slate-400 mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <span className="mx-2">&gt;</span>
                </li>
                <li className="text-orange-300" aria-current="page">
                  MCMV Itaboraí
                </li>
              </ol>
            </nav>

            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
              Apartamentos Minha Casa Minha Vida em Itaboraí 2026
            </h1>
            <p className="text-lg text-slate-300 max-w-3xl leading-relaxed mb-8">
              Troque o aluguel perdido pela chave de um apartamento seu — em condomínio fechado, com
              lazer e parcelas que a partir de R$ 650/mês com subsídio do Governo Federal de até
              R$ 55 mil. Compare os 4 lançamentos disponíveis em Itaboraí-RJ e descubra qual cabe
              na sua renda.
            </p>

            {/* Gatilhos rápidos — ancoragem e aversão à perda */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <TrendingDown className="w-5 h-5" />, label: 'Subsídio', value: 'Até R$ 55 mil' },
                { icon: <Home className="w-5 h-5" />, label: 'Renda mínima', value: 'R$ 2.500/mês' },
                { icon: <Clock className="w-5 h-5" />, label: 'Entrada', value: 'Parcelada em até 72x' },
                { icon: <MapPin className="w-5 h-5" />, label: 'Lançamentos', value: '4 em Itaboraí' },
              ].map((item) => (
                <div key={item.label} className="bg-white/10 rounded-xl p-4 text-center">
                  <div className="text-accent flex justify-center mb-1">{item.icon}</div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">{item.label}</p>
                  <p className="font-bold text-white text-sm mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── O QUE É O MCMV / FGTS ───────────────────────── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                O que é o Minha Casa Minha Vida em 2026?
              </h2>
              {/* Bloco Answer-First (GEO/AEO) */}
              <p className="text-slate-600 text-sm bg-slate-50 border-l-4 border-accent p-4 rounded-r-lg mb-6 leading-relaxed">
                O <strong>Minha Casa Minha Vida 2026</strong> é o programa habitacional do Governo
                Federal operado pela <strong>Caixa Econômica Federal</strong>. Oferece juros
                reduzidos (3,99% a 8,16% a.a.) e subsídio direto no valor do imóvel para famílias
                com renda até R$ 8.000/mês em <strong>Itaboraí-RJ</strong>.
              </p>

              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Quem pode participar em Itaboraí?
              </h2>
              <ul className="space-y-3 mb-6">
                {[
                  'Renda familiar bruta a partir de R$ 2.500/mês (Faixa 1) até R$ 8.000/mês (Faixa 3).',
                  'Brasileiro nato ou naturalizado, maior de 18 anos.',
                  'Sem imóvel residencial registrado em nome do titular ou cônjuge.',
                  'CLT, servidor público, autônomo ou aposentado — todos podem participar.',
                ].map((item) => (
                  <li key={item} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-success mr-2 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Como funciona a entrada parcelada e o FGTS?
              </h2>
              {/* Bloco Answer-First */}
              <p className="text-slate-600 text-sm bg-white border border-slate-200 p-4 rounded-lg mb-4 leading-relaxed">
                Nos lançamentos MCMV de <strong>Itaboraí-RJ</strong>, a entrada pode ser
                parcelada diretamente com a construtora durante a obra — em alguns casos em até
                72 vezes sem juros. O <strong>FGTS</strong> pode ser usado para abater o valor
                de entrada ou reduzir parcelas mensais no financiamento da{' '}
                <strong>Caixa Econômica Federal</strong>.
              </p>
              <p className="text-slate-700 mb-4 leading-relaxed">
                O financiamento pode ser em até 35 anos (420 meses). Quanto menor a renda, menor a
                taxa de juros — famílias na Faixa 1 (até R$ 4.400/mês) pagam apenas 4,75% a.a.
              </p>
              <Link
                to="/financiamento-minha-casa-minha-vida"
                className="text-primary font-bold hover:underline"
              >
                Ler guia completo sobre Financiamento e FGTS →
              </Link>
            </div>
          </div>
        </section>

        {/* ── LINKS DE CONTEÚDO INFORMACIONAL ────────────── */}
        <section className="py-12 bg-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  to: '/renda-minha-casa-minha-vida',
                  title: 'Faixas de Renda',
                  desc: 'Descubra sua faixa e os limites de aprovação para Itaboraí em 2026.',
                },
                {
                  to: '/subsidio-minha-casa-minha-vida',
                  title: 'Subsídio MCMV',
                  desc: 'Entenda como conseguir até R$ 55 mil de desconto no seu apartamento.',
                },
                {
                  to: '/fgts-minha-casa-minha-vida',
                  title: 'Uso do FGTS',
                  desc: 'Saiba como abater a entrada usando seu saldo do Fundo de Garantia.',
                },
                {
                  to: '/documentos-minha-casa-minha-vida',
                  title: 'Documentos',
                  desc: 'Veja o que separar para aprovar seu crédito imobiliário na Caixa.',
                },
              ].map((card) => (
                <Link
                  key={card.to}
                  to={card.to}
                  className="bg-white p-6 rounded-xl border border-slate-200 hover:border-primary hover:shadow-md transition-all"
                >
                  <h3 className="font-bold text-slate-900 mb-2">{card.title}</h3>
                  <p className="text-sm text-slate-600">{card.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── TABELA COMPARATIVA DOS 4 EMPREENDIMENTOS ───── */}
        <section className="py-16 bg-white" id="comparativo">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">
              Compare os 4 Lançamentos MCMV em Itaboraí
            </h2>
            <p className="text-slate-500 text-center max-w-2xl mx-auto mb-10">
              Todos financiados pela Caixa Econômica Federal com possibilidade de subsídio do
              Governo Federal e uso do FGTS. Clique no empreendimento para ver plantas e detalhes.
            </p>

            {/* Tabela responsiva */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="text-left p-4 font-semibold w-1/4">Empreendimento</th>
                    <th className="text-left p-4 font-semibold">Bairro</th>
                    <th className="text-left p-4 font-semibold">Tipo</th>
                    <th className="text-left p-4 font-semibold">Destaque</th>
                    <th className="text-center p-4 font-semibold">FGTS</th>
                    <th className="text-center p-4 font-semibold">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {empreendimentos.map((e, i) => (
                    <tr
                      key={e.nome}
                      className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                    >
                      <td className="p-4 font-bold text-slate-900">
                        <Link to={e.link} className="hover:text-primary transition-colors">
                          {e.nome}
                        </Link>
                      </td>
                      <td className="p-4 text-slate-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                          {e.bairro}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600">{e.tipo}</td>
                      <td className="p-4 text-slate-700">{e.destaque}</td>
                      <td className="p-4 text-center">
                        {e.fgts && (
                          <CheckCircle2 className="w-5 h-5 text-success mx-auto" />
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex flex-col gap-2 items-center">
                          <Link
                            to={e.link}
                            className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-blue-700 transition-colors whitespace-nowrap"
                          >
                            Ver detalhes
                          </Link>
                          <a
                            href="#simulacao"
                            className="bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-orange-600 transition-colors whitespace-nowrap"
                          >
                            Simular agora
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-400 mt-3 text-center">
              * Parcelas, subsídio e condições sujeitos à análise de crédito da Caixa Econômica
              Federal e regras vigentes do programa MCMV em 2026.
            </p>
          </div>
        </section>

        {/* ── CARDS DOS EMPREENDIMENTOS ────────────────────── */}
        <section className="py-16 bg-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
              Lançamentos MCMV disponíveis em Itaboraí agora
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {empreendimentos.map((e) => (
                <div
                  key={e.nome}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                >
                  <div className="p-5 flex-1">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full mb-3">
                      <MapPin className="w-3 h-3" />
                      {e.bairro}
                    </span>
                    <h3 className="font-bold text-slate-900 text-lg mb-1">{e.nome}</h3>
                    <p className="text-slate-500 text-sm mb-3">{e.tipo}</p>
                    <p className="text-slate-700 text-sm leading-relaxed">{e.destaque}</p>
                  </div>
                  <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
                    <Link
                      to={e.link}
                      className="bg-primary text-white text-sm font-bold py-2 rounded-xl text-center hover:bg-blue-700 transition-colors"
                    >
                      Ver plantas e condições
                    </Link>
                    <a
                      href="#simulacao"
                      className="bg-accent text-white text-sm font-bold py-2 rounded-xl text-center hover:bg-orange-600 transition-colors"
                    >
                      Simular financiamento
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── GUIA DE BAIRROS (SEO Local / GEO) ───────────── */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">
              Onde morar em Itaboraí pelo Minha Casa Minha Vida?
            </h2>
            <p className="text-slate-500 text-center max-w-2xl mx-auto mb-10">
              Cada bairro tem um perfil diferente de mobilidade, comércio e custo de vida. Veja
              qual combina mais com o seu dia a dia.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Outeiro das Pedras */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                    1
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    Outeiro das Pedras — Prime Club Itaboraí
                  </h3>
                </div>
                {/* Answer-First */}
                <p className="text-slate-700 leading-relaxed text-sm mb-3">
                  Bairro com melhor infraestrutura urbana de Itaboraí. A 3 minutos da{' '}
                  <strong>Av. 22 de Maio</strong>, onde estão bancos, Correios, Hospital Municipal
                  São Judas Tadeu, farmácias e o maior comércio da cidade. Ideal para quem depende
                  de transporte público ou quer tudo perto.
                </p>
                <Link to="/prime-club-itaborai" className="text-primary font-semibold text-sm hover:underline">
                  Ver Prime Club Itaboraí →
                </Link>
              </div>

              {/* Caluge */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                    2
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    Caluge — Reserva dos Pássaros 2
                  </h3>
                </div>
                {/* Answer-First */}
                <p className="text-slate-700 leading-relaxed text-sm mb-3">
                  Privacidade de casa com quintal em bairro tranquilo e contato com o verde.
                  Acesso rápido à <strong>BR-101</strong> para quem trabalha em São Gonçalo,
                  Niterói ou Rio de Janeiro. Lotes a partir de 150 m² — a única opção de{' '}
                  <strong>casa não geminada</strong> no portfólio MCMV de Itaboraí.
                </p>
                <Link to="/reserva-dos-passaros-2" className="text-primary font-semibold text-sm hover:underline">
                  Ver Reserva dos Pássaros 2 →
                </Link>
              </div>

              {/* Santo Expedito */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                    3
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    Santo Expedito — Flores de Maio
                  </h3>
                </div>
                {/* Answer-First */}
                <p className="text-slate-700 leading-relaxed text-sm mb-3">
                  Sossego residencial a 5 minutos do <strong>Centro de Itaboraí</strong>, em rua
                  tranquila com fácil acesso a escolas públicas, transporte e serviços essenciais.
                  Apartamento com varanda, ventilação natural e um dos maiores subsídios disponíveis
                  — ideal para família de primeira viagem.
                </p>
                <Link to="/flores-de-maio" className="text-primary font-semibold text-sm hover:underline">
                  Ver Flores de Maio →
                </Link>
              </div>

              {/* Manilha */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                    4
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    Santo Antônio / Manilha — Solar de Manilha
                  </h3>
                </div>
                {/* Answer-First */}
                <p className="text-slate-700 leading-relaxed text-sm mb-3">
                  Melhor logística de acesso a toda a Baixada Fluminense: na porta da{' '}
                  <strong>BR-101</strong> sentido Niterói, São Gonçalo, Alcântara e Ponte
                  Rio-Niterói. Polo comercial independente na porta do condomínio — mercado,
                  farmácia, escolas e transporte. Opções de apartamento com{' '}
                  <strong>garden exclusivo</strong>.
                </p>
                <Link to="/solar-manilha-itaborai" className="text-primary font-semibold text-sm hover:underline">
                  Ver Solar de Manilha →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── TABELA COMPARATIVA APT vs CASA ──────────────── */}
        <section className="py-16 bg-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">
              Apartamento vs. Casa em Condomínio: qual escolher no MCMV em Itaboraí?
            </h2>
            {/* Answer-First */}
            <p className="text-slate-600 text-center max-w-2xl mx-auto mb-8 text-sm bg-white border border-slate-200 p-4 rounded-xl leading-relaxed">
              A escolha entre apartamento e casa no <strong>Minha Casa Minha Vida em Itaboraí</strong>{' '}
              depende do perfil familiar. Casas como a Reserva dos Pássaros 2 (Caluge) oferecem
              quintal e privacidade; apartamentos como Prime Club e Flores de Maio têm lazer
              compartilhado e segurança 24h. Ambos são elegíveis ao subsídio da{' '}
              <strong>Caixa Econômica Federal</strong> e ao uso do FGTS.
            </p>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
              <table className="w-full text-sm border-collapse bg-white">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="text-left p-4 font-semibold">Critério</th>
                    <th className="text-center p-4 font-semibold">🏢 Apartamento</th>
                    <th className="text-center p-4 font-semibold">🏡 Casa com Quintal</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Privacidade', 'Média (vizinhos próximos)', 'Alta (quintal exclusivo)'],
                    ['Área externa', 'Áreas comuns do condomínio', 'Quintal e varanda privativos'],
                    ['Segurança 24h', '✅ Sim', '✅ Sim'],
                    ['Lazer', 'Piscina, academia, playground', 'Espaço próprio no lote'],
                    ['Custo de condomínio', 'Dividido com vários condôminos', 'Menor (menos unidades)'],
                    ['Manutenção', 'Coletiva (síndico)', 'Individual'],
                    ['Ideal para', 'Casais, jovens, 1ª compra urbana', 'Famílias com filhos, pets'],
                    ['Exemplo em Itaboraí', 'Prime Club, Flores de Maio, Solar de Manilha', 'Reserva dos Pássaros 2'],
                  ].map(([criterio, apto, casa], i) => (
                    <tr key={criterio} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="p-4 font-semibold text-slate-900">{criterio}</td>
                      <td className="p-4 text-slate-700 text-center">{apto}</td>
                      <td className="p-4 text-slate-700 text-center">{casa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────── */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
              Dúvidas Frequentes sobre MCMV em Itaboraí 2026
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: 'Quais os melhores bairros para comprar imóvel MCMV em Itaboraí?',
                  a: 'Os principais bairros com lançamentos MCMV em Itaboraí em 2026 são Outeiro das Pedras (Prime Club), Caluge (Reserva dos Pássaros 2), Santo Expedito (Flores de Maio) e Santo Antônio/Manilha (Solar de Manilha). Cada um tem um perfil diferente de mobilidade e custo de vida — veja o guia de bairros acima.',
                },
                {
                  q: 'Qual a renda mínima e valor do subsídio MCMV em Itaboraí em 2026?',
                  a: 'A renda mínima é R$ 2.500/mês (Faixa 1). Famílias com renda entre R$ 2.500 e R$ 4.400 podem receber subsídio de até R$ 55 mil da Caixa Econômica Federal. Entre R$ 4.400 e R$ 8.000 (Faixas 2 e 3), o subsídio é menor mas os juros ainda são reduzidos — de 5% a 8,16% a.a.',
                },
                {
                  q: 'Apartamento ou casa em condomínio: qual é melhor no MCMV em Itaboraí?',
                  a: 'Depende do seu perfil. Casas (Reserva dos Pássaros 2) oferecem quintal e privacidade. Apartamentos (Prime Club, Flores de Maio, Solar de Manilha) têm lazer coletivo, segurança 24h e menor manutenção individual. Ambos são elegíveis ao subsídio e ao FGTS.',
                },
                {
                  q: 'Como funciona o parcelamento da entrada e uso do FGTS na Caixa?',
                  a: 'A entrada pode ser parcelada diretamente com a construtora durante a obra — em lançamentos como o Prime Club, em até 72 vezes. O saldo do FGTS pode abater a entrada ou reduzir parcelas mensais. O financiamento pode ser feito em até 35 anos pela Caixa Econômica Federal.',
                },
                {
                  q: 'Quais imóveis MCMV estão disponíveis em Itaboraí em 2026?',
                  a: 'Os 4 lançamentos ativos são: Prime Club Itaboraí (Outeiro das Pedras), Reserva dos Pássaros 2 (Caluge), Flores de Maio (Santo Expedito) e Solar de Manilha (Santo Antônio/Manilha). Faça a simulação gratuita abaixo para saber qual cabe na sua renda.',
                },
                {
                  q: 'Qual a documentação necessária para financiar pelo MCMV em Itaboraí?',
                  a: 'Você vai precisar de RG, CPF, Certidão de Nascimento ou Casamento, comprovante de residência, Carteira de Trabalho (ou extratos bancários para autônomos), extrato do FGTS e os 3 últimos contracheques. Veja a lista completa em nosso guia de documentos.',
                },
              ].map((faq) => (
                <div key={faq.q} className="border-b border-slate-100 pb-6">
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{faq.q}</h3>
                  <p className="text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FORMULÁRIO DE SIMULAÇÃO ─────────────────────── */}
        <section
          className="py-16 bg-slate-100 border-t border-slate-200"
          id="simulacao"
          aria-label="Simulação gratuita MCMV"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <p className="text-accent font-semibold uppercase tracking-wide text-sm mb-2">
                Simulação gratuita e sem compromisso em menos de 1 minuto
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3">
                Troque o aluguel pela chave do seu apartamento
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Preencha abaixo e receba no WhatsApp as melhores opções MCMV em Itaboraí com
                valores reais, subsídio calculado e condições de entrada — sem enrolação.
              </p>
            </div>
            <div className="max-w-xl mx-auto shadow-xl rounded-2xl overflow-hidden">
              <LeadForm />
            </div>
            <p className="text-xs text-slate-400 text-center mt-4">
              🔒 Seus dados estão protegidos pela LGPD. Simulações são estimativas sujeitas à análise
              de crédito da Caixa Econômica Federal.
            </p>
          </div>
        </section>

        {/* ── AUTOR / E-E-A-T ─────────────────────────────── */}
        <section className="py-12 bg-slate-50 border-t border-slate-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mt-0 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img
                src="/joel-marcos-corretor-minha-casa-minha-vida-itaborai.webp"
                alt="Joel Marcos, corretor especialista em Minha Casa Minha Vida em Itaboraí – CRECI 39.583F"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full flex-shrink-0 object-cover object-top border-2 border-primary/20"
                loading="lazy"
                decoding="async"
              />
              <div>
                <div className="text-sm font-semibold text-accent mb-1">Conteúdo preparado por:</div>
                <h3 className="font-bold text-slate-900 text-lg">Joel Marcos — CRECI 39.583F</h3>
                <p className="text-sm text-slate-500 mb-3">
                  Corretor de Imóveis com 24 anos de mercado • Especialista MCMV Itaboraí-RJ
                </p>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Joel Marcos é corretor de imóveis credenciado (CRECI 39.583F) com mais de 24 anos
                  de experiência no mercado imobiliário. Especialista em aprovação de crédito junto à
                  Caixa Econômica Federal e cálculo de subsídios do programa Minha Casa Minha Vida
                  em Itaboraí-RJ, com atendimento presencial no Retiro São Joaquim e suporte também
                  em São Gonçalo e Niterói.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
