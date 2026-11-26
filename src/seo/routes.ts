import { FAQ_ORLA, ORLA_AVISO_PRECO, ORLA_PRECO_A_PARTIR } from '../data/orlaCentral';
import { FAQ_BOSQUE, BOSQUE_AVISO_PRECO, BOSQUE_PRECO_A_PARTIR } from '../data/bosqueResidence';
import { FAQ_GUANABARA, GUANABARA_AVISO_PRECO, GUANABARA_PRECO_A_PARTIR } from '../data/orlaGuanabara';
import { FAQ_SUNIN, SUNIN_AVISO_PRECO, SUNIN_PRECO_A_PARTIR } from '../data/sunInStudio';
import { FAQ_CAMINHOS, CAMINHOS_AVISO_PRECO, CAMINHOS_PRECO_A_PARTIR } from '../data/caminhosGuanabara';
import { FAQ_IMPERIO, IMPERIO_AVISO_PRECO, IMPERIO_PRECO_A_PARTIR } from '../data/imperioDoOuro';
import { FAQ_OPEN, OPEN_AVISO_PRECO, OPEN_PRECO_A_PARTIR } from '../data/niteroiOpen';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface AmenityItem {
  name: string;
  value: string;
}

export interface DevelopmentDetails {
  name: string;
  developer?: string;
  addressLocality: string;
  addressRegion: string;
  neighborhood?: string;
  numberOfBedrooms: number | string;
  image: string;
  commercialCondition: string;
  amenities: AmenityItem[];
  // Opcionais (usados no JSON-LD quando informados)
  url?: string;
  priceFrom?: number; // preço "a partir de", em BRL
  priceNote?: string; // aviso exibido junto ao preço
  numberOfUnits?: number;
  floorSizeMin?: number; // m²
  floorSizeMax?: number; // m²
}

export interface SeoRoute {
  path: string;
  title: string;
  description: string;
  h1: string;
  schemaType: 'WebSite' | 'CollectionPage' | 'Article' | 'ApartmentComplex' | 'Service' | 'AboutPage' | 'WebPage';
  priority?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  noindex?: boolean;
  nofollow?: boolean;
  outputFile?: string;
  breadcrumbs?: Array<{ name: string; path: string }>;
  faqs?: FaqItem[];
  development?: DevelopmentDetails;
}

export const CANONICAL_DOMAIN = 'https://queromeumcmv.com.br';

export const FRASE_ENTIDADE_OFICIAL =
  'Joel Marcos é corretor de imóveis (CRECI 39.583F) especialista no programa Minha Casa Minha Vida em Itaboraí-RJ, com atendimento também em São Gonçalo, Niterói e Maricá.';

export const BASE_ORGANIZATION_DATA = {
  '@type': 'RealEstateAgent',
  '@id': `${CANONICAL_DOMAIN}/#organization`,
  name: 'Joel Marcos - Corretor Minha Casa Minha Vida em Itaboraí',
  legalName: 'Joel Marcos da Silva',
  description: FRASE_ENTIDADE_OFICIAL,
  slogan: 'Especialista em Minha Casa Minha Vida em Itaboraí-RJ',
  url: `${CANONICAL_DOMAIN}/`,
  image: `${CANONICAL_DOMAIN}/capa-site-quero-meu-mcmv-open-graph.webp`,
  telephone: '+55 21 96592-8399',
  email: 'contato@queromeumcmv.com.br',
  priceRange: 'R$ 150.000 - R$ 600.000',
  openingHours: 'Mo-Fr 09:00-17:00',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rua H, nº 492, Retiro São Joaquim',
    addressLocality: 'Itaboraí',
    addressRegion: 'RJ',
    postalCode: '24813-066',
    addressCountry: 'BR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: -22.7444,
    longitude: -42.8597,
  },
  identifier: {
    '@type': 'PropertyValue',
    name: 'CRECI',
    value: '39.583F',
  },
  areaServed: [
    {
      '@type': 'City',
      name: 'Itaboraí',
      sameAs: 'https://pt.wikipedia.org/wiki/Itabora%C3%AD',
    },
    {
      '@type': 'City',
      name: 'São Gonçalo',
      sameAs: 'https://pt.wikipedia.org/wiki/S%C3%A3o_Gon%C3%A7alo_(Rio_de_Janeiro)',
    },
    {
      '@type': 'City',
      name: 'Niterói',
      sameAs: 'https://pt.wikipedia.org/wiki/Niter%C3%B3i',
    },
    {
      '@type': 'City',
      name: 'Maricá',
      sameAs: 'https://pt.wikipedia.org/wiki/Maric%C3%A1',
    },
  ],
  knowsAbout: [
    'Minha Casa Minha Vida em Itaboraí',
    'Programa Minha Casa Minha Vida',
    'Financiamento habitacional Caixa',
    'Subsídio habitacional',
    'Uso do FGTS na compra do imóvel',
    'Imóveis em Itaboraí-RJ',
  ],
  founder: {
    '@id': `${CANONICAL_DOMAIN}/#joel-marcos`,
  },
  sameAs: [
    'https://www.instagram.com/queromeumcmv/',
    'https://www.facebook.com/queromeumcmv',
    'https://g.page/r/CdJ6uC2_aKKAEBM',
  ],
};

export const ROUTES: SeoRoute[] = [
  {
    path: '/',
    title: 'Minha Casa Minha Vida em Itaboraí e Região | Quero Meu MCMV',
    description: 'Descubra quanto falta para sair do aluguel: apartamentos Minha Casa Minha Vida em Itaboraí, São Gonçalo e Niterói, com subsídio de até R$ 55 mil.',
    h1: 'Saia do aluguel! Seu apartamento Minha Casa Minha Vida em Itaboraí',
    schemaType: 'WebSite',
    priority: '1.0',
    changefreq: 'weekly',
    faqs: [
      {
        question: 'Posso compor renda com outra pessoa?',
        answer: 'Sim! Você pode juntar sua renda com familiares (cônjuge, pais, irmãos, filhos) ou até mesmo com amigos e namorado(a) para alcançar o valor necessário e aumentar suas chances de aprovação no financiamento.',
      },
      {
        question: 'Sou autônomo e não tenho carteira assinada. Posso participar?',
        answer: 'Com certeza! Trabalhadores informais, autônomos e MEIs podem comprar seu imóvel. Você pode comprovar sua renda através de extratos bancários de pessoa física dos últimos 6 meses e também declaração de Imposto de Renda.',
      },
      {
        question: 'Como funciona o uso do FGTS?',
        answer: 'Você pode utilizar o saldo do seu FGTS como parte do pagamento da entrada no imóvel, ajudando a diminuir o valor que você precisa pagar do próprio bolso. Também pode ser usado para abater o valor das parcelas do financiamento.',
      },
      {
        question: 'O que é o subsídio do governo?',
        answer: 'O subsídio é um benefício financeiro (um verdadeiro "desconto") dado pelo Governo Federal para ajudar na compra. Esse valor não precisa ser devolvido! O montante depende da sua renda familiar e região do imóvel, podendo chegar a até R$ 55.000 de desconto (conforme as regras vigentes do programa).',
      },
      {
        question: 'Quanto tempo demora a aprovação do banco?',
        answer: 'O tempo de análise costuma ser rápido. Eu ajudo você a organizar tudo. Com a documentação completa em mãos, a análise do crédito pela Caixa Econômica costuma ter a resposta preliminar em até 48 horas úteis (prazo médio que pode variar conforme a demanda do banco).',
      },
    ],
  },
  {
    path: '/minha-casa-minha-vida-itaborai',
    title: 'Apartamentos Minha Casa Minha Vida em Itaboraí: Lançamentos',
    description: 'Lançamentos MCMV em Itaboraí com condomínio fechado, lazer e parcela que pode ser menor que o aluguel. Compare os empreendimentos e descubra a sua condição.',
    h1: 'Apartamentos Minha Casa Minha Vida em Itaboraí: lançamentos 2026',
    schemaType: 'CollectionPage',
    priority: '0.9',
    changefreq: 'weekly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'Minha Casa Minha Vida Itaboraí', path: '/minha-casa-minha-vida-itaborai' },
    ],
    faqs: [
      {
        question: 'Quais imóveis estão disponíveis em Itaboraí?',
        answer: 'Temos diversas opções, como o Prime Club Itaboraí, Flores de Maio e Reserva dos Pássaros 2. Consulte nossa lista de empreendimentos para ver as plantas e metragens disponíveis.',
      },
      {
        question: 'Quais documentos são necessários?',
        answer: 'Geralmente exigimos RG, CPF, Certidão de Nascimento/Casamento, Comprovante de Residência, Carteira de Trabalho, Extrato do FGTS e os últimos 3 contracheques (ou extratos bancários para autônomos).',
      },
      {
        question: 'Como funciona a entrada?',
        answer: 'A entrada varia de acordo com a aprovação de crédito da Caixa, o valor do imóvel e o subsídio concedido. Em muitos lançamentos, parte da entrada pode ser parcelada direto com a construtora durante a obra — na simulação você descobre exatamente quanto precisa.',
      },
    ],
  },
  {
    path: '/minha-casa-minha-vida-sao-goncalo',
    title: 'Minha Casa Minha Vida em São Gonçalo: Lançamentos 2026',
    description: 'Apartamentos MCMV em Alcântara, Trindade, Vila Iara e perto do Shopping São Gonçalo. Compare os lançamentos e descubra a parcela que cabe no seu bolso.',
    h1: 'Minha Casa Minha Vida em São Gonçalo - RJ',
    schemaType: 'CollectionPage',
    priority: '0.9',
    changefreq: 'weekly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'Minha Casa Minha Vida São Gonçalo', path: '/minha-casa-minha-vida-sao-goncalo' },
    ],
    faqs: [
      {
        question: 'Existem apartamentos Minha Casa Minha Vida em São Gonçalo?',
        answer: 'Sim! Trabalhamos com diversas opções como o Solar da Trindade e o Residencial Florescer, que oferecem apartamentos de 2 e 3 quartos, suíte e varanda.',
      },
      {
        question: 'Posso usar meu FGTS na compra?',
        answer: 'Sim, o FGTS pode ser utilizado como parte do pagamento da entrada ou para reduzir o valor das parcelas do financiamento, desde que você tenha pelo menos 3 anos de trabalho sob regime do FGTS (somando todos os períodos trabalhados).',
      },
      {
        question: 'Como solicitar uma simulação?',
        answer: 'Basta clicar em qualquer botão de simulação no nosso site ou entrar em contato direto pelo WhatsApp. Faremos a sua análise de forma ágil e transparente.',
      },
    ],
  },
  {
    path: '/unicsaogoncalo',
    title: 'Unic São Gonçalo | Apartamentos 2 Quartos MCMV | Domma',
    description:
      'Lançamento Domma em São Gonçalo-RJ: 360 apartamentos de 2 quartos com varanda, piscina rooftop e condomínio de R$ 450. Financiamento Caixa MCMV. Simule já.',
    h1: 'Unic São Gonçalo — Apartamentos 2 Quartos com Lazer Rooftop',
    schemaType: 'ApartmentComplex',
    priority: '0.9',
    changefreq: 'weekly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'MCMV São Gonçalo', path: '/minha-casa-minha-vida-sao-goncalo' },
      { name: 'Unic São Gonçalo', path: '/unicsaogoncalo' },
    ],
    development: {
      name: 'Unic São Gonçalo',
      developer: 'Domma',
      addressLocality: 'São Gonçalo',
      addressRegion: 'RJ',
      neighborhood: 'Próximo ao Shopping São Gonçalo',
      numberOfBedrooms: 2,
      image: 'https://queromeumcmv.com.br/unic-sao-goncalo-fachada.webp',
      commercialCondition: 'Financiamento Caixa — Minha Casa Minha Vida',
      amenities: [
        { name: 'Piscinas', value: '2 (rooftop)' },
        { name: 'Academias', value: '2 (1 por torre)' },
        { name: 'Salões de Festas', value: '3' },
        { name: 'Churrasqueiras', value: '4' },
        { name: 'Cinema ao Ar Livre', value: '2' },
        { name: 'Saunas', value: '2' },
        { name: 'Playground', value: 'Sim' },
        { name: 'Pet Place', value: 'Sim' },
        { name: 'Área Kids', value: 'Sim' },
        { name: 'Vagas', value: '155 (43%)' },
      ],
    },
    faqs: [
      {
        question: 'O Unic São Gonçalo aceita financiamento pelo Minha Casa Minha Vida?',
        answer:
          'Sim. O Unic São Gonçalo é financiado pela Caixa Econômica Federal dentro do programa Minha Casa Minha Vida (Lei nº 14.620/2023). Dependendo da renda familiar, é possível obter subsídio e taxas de juros reduzidas.',
      },
      {
        question: 'Qual é o valor do condomínio no Unic São Gonçalo?',
        answer:
          'O condomínio estimado pelo incorporador é de R$ 450,00 por mês, valor competitivo para um condomínio com lazer completo em rooftop.',
      },
      {
        question: 'Como é a localização do Unic São Gonçalo?',
        answer:
          'O empreendimento fica na Rua Nova Jersey, a apenas 30 segundos do Shopping São Gonçalo. A Ponte Rio-Niterói é alcançada em 11 minutos, o Centro de Niterói em 15 minutos e o Centro do Rio de Janeiro em 29 minutos.',
      },
      {
        question: 'Quais as tipologias disponíveis no Unic São Gonçalo?',
        answer:
          'São apartamentos de 2 quartos a partir de 45 m², com varanda em todas as unidades. Há ainda opções PNE (acessíveis) e Garden (com área verde privativa no térreo).',
      },
      {
        question: 'Posso usar o FGTS na compra de um apartamento no Unic São Gonçalo?',
        answer:
          'Sim. O FGTS pode ser usado como parte da entrada ou para amortizar o financiamento, desde que você tenha pelo menos 3 anos de trabalho sob regime do FGTS, podendo somar períodos diferentes.',
      },
    ],
  },
  {
    path: '/orla-central-niteroi',
    title: 'Orla Central Niterói | Apartamentos no Centro a partir de R$ 331 mil',
    description:
      'Orla Central, da Cury, no Centro de Niterói: 1 a 3 quartos com varanda, rooftop com vista para a Baía e lazer completo. A partir de R$ 331 mil.',
    h1: 'Orla Central Niterói: apartamentos de 1 a 3 quartos com varanda no Centro, perto do Caminho Niemeyer',
    schemaType: 'ApartmentComplex',
    priority: '0.9',
    changefreq: 'weekly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'Imóveis em Niterói', path: '/niteroirj' },
      { name: 'Orla Central', path: '/orla-central-niteroi' },
    ],
    development: {
      name: 'Orla Central',
      developer: 'Cury',
      addressLocality: 'Niterói',
      addressRegion: 'RJ',
      neighborhood: 'Centro — próximo ao Caminho Niemeyer e às barcas',
      numberOfBedrooms: '1 a 3',
      image: 'https://queromeumcmv.com.br/orla-central-niteroi-fachada.webp',
      commercialCondition: 'Preço a partir de R$ 331.000 · consulte a disponibilidade com o corretor',
      url: 'https://queromeumcmv.com.br/orla-central-niteroi',
      priceFrom: ORLA_PRECO_A_PARTIR,
      priceNote: ORLA_AVISO_PRECO,
      numberOfUnits: 962,
      floorSizeMin: 31.3,
      floorSizeMax: 65.72,
      amenities: [
        { name: 'Piscinas adulto e infantil', value: 'Sim' },
        { name: 'Lounge rooftop', value: 'Sim' },
        { name: 'Espaço luau', value: 'Sim' },
        { name: 'Beach tennis', value: 'Sim' },
        { name: 'Academia', value: 'Sim' },
        { name: 'Fitness externo', value: 'Sim' },
        { name: 'Salão de festas', value: 'Sim' },
        { name: 'Churrasqueira gourmet', value: 'Sim' },
        { name: 'Sport bar', value: 'Sim' },
        { name: 'Salão de jogos', value: 'Sim' },
        { name: 'Playground', value: 'Sim' },
        { name: 'Brinquedoteca', value: 'Sim' },
        { name: 'Coworking', value: 'Sim' },
        { name: 'Pet care', value: 'Sim' },
        { name: 'Easy market', value: 'Sim' },
        { name: 'Lavanderia', value: 'Sim' },
        { name: 'Lojas no térreo', value: 'Sim' },
        { name: 'Vagas de automóvel', value: '102 (limitadas)' },
        { name: 'Bicicletário', value: '970 vagas' },
      ],
    },
    faqs: FAQ_ORLA.map((f) => ({ question: f.pergunta, answer: f.resposta })),
  },
  {
    path: '/bosque-residence-niteroi',
    title: 'Bosque Residence Fonseca Niterói | 2 Quartos a partir de R$ 324 mil',
    description:
      'Bosque Residence, da Crescer, no Fonseca (Niterói): 2 quartos com varanda, 8.000 m² de bosque privativo e piscina no rooftop. A partir de R$ 324 mil.',
    h1: 'Bosque Residence, no Fonseca: 2 quartos com varanda e 8.000 m² de bosque privativo em Niterói',
    schemaType: 'ApartmentComplex',
    priority: '0.9',
    changefreq: 'weekly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'Imóveis em Niterói', path: '/niteroirj' },
      { name: 'Bosque Residence', path: '/bosque-residence-niteroi' },
    ],
    development: {
      name: 'Meu Crescer Niterói | Bosque Residence',
      developer: 'Crescer Incorporadora e Construtora',
      addressLocality: 'Niterói',
      addressRegion: 'RJ',
      neighborhood: 'Av. Desembargador Lima Castro, 245 — Fonseca',
      numberOfBedrooms: '2 a 3',
      image: 'https://queromeumcmv.com.br/meu-crescer-niteroi-bosque-vista-do-morro.webp',
      commercialCondition: 'Financiamento CAIXA · preço a partir de R$ 324.000 · consulte a disponibilidade com o corretor',
      url: 'https://queromeumcmv.com.br/bosque-residence-niteroi',
      priceFrom: BOSQUE_PRECO_A_PARTIR,
      priceNote: BOSQUE_AVISO_PRECO,
      numberOfUnits: 163,
      floorSizeMin: 47,
      floorSizeMax: 144,
      amenities: [
        { name: 'Área verde privativa', value: '8.000 m²' },
        { name: 'Trilha para caminhada', value: 'Sim' },
        { name: 'Mirante / espaço zen', value: 'Sim' },
        { name: 'Redário', value: 'Sim' },
        { name: 'Horta', value: 'Sim' },
        { name: 'Orquidário', value: 'Sim' },
        { name: 'Espaço churrasco', value: 'Sim' },
        { name: 'Playground', value: 'Sim' },
        { name: 'Mini quadras', value: 'Sim' },
        { name: 'Pet place e pet care', value: 'Sim' },
        { name: 'Piscina adulto e infantil (rooftop)', value: 'Sim' },
        { name: 'Salão de festas', value: 'Sim' },
        { name: 'Espaço gourmet', value: 'Sim' },
        { name: 'Lounge / coworking', value: 'Sim' },
        { name: 'Brinquedoteca', value: 'Sim' },
        { name: 'Espaço fitness', value: 'Sim' },
        { name: 'Bicicletário', value: 'Sim' },
        { name: 'Carro e bicicleta compartilhados', value: 'Sim' },
        { name: 'Lojas na fachada', value: '4' },
      ],
    },
    faqs: FAQ_BOSQUE.map((f) => ({ question: f.pergunta, answer: f.resposta })),
  },
  {
    path: '/orla-guanabara-niteroi',
    title: 'Orla Guanabara Niterói | 2 Quartos MCMV a partir de R$ 299 mil',
    description:
      'Orla Guanabara, da Emccamp, perto do Caminho Niemeyer: 2 quartos com varanda, rooftop com vista para a Baía e Minha Casa Minha Vida. A partir de R$ 299 mil.',
    h1: 'Orla Guanabara: 2 quartos com varanda e rooftop com vista definitiva para a Baía de Guanabara, em Niterói',
    schemaType: 'ApartmentComplex',
    priority: '0.9',
    changefreq: 'weekly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'Imóveis em Niterói', path: '/niteroirj' },
      { name: 'Orla Guanabara', path: '/orla-guanabara-niteroi' },
    ],
    development: {
      name: 'Orla Guanabara by Emccamp',
      developer: 'Emccamp Residencial',
      addressLocality: 'Niterói',
      addressRegion: 'RJ',
      neighborhood: 'Rua Jornalista Rogério Coelho Neto, 250 — região do Caminho Niemeyer',
      numberOfBedrooms: 2,
      image: 'https://queromeumcmv.com.br/orla-guanabara-niteroi-vista-aerea-caminho-niemeyer.webp',
      commercialCondition: 'Minha Casa Minha Vida · preço a partir de R$ 299.000 · consulte a disponibilidade com o corretor',
      url: 'https://queromeumcmv.com.br/orla-guanabara-niteroi',
      priceFrom: GUANABARA_PRECO_A_PARTIR,
      priceNote: GUANABARA_AVISO_PRECO,
      numberOfUnits: 700,
      floorSizeMin: 40.54,
      floorSizeMax: 45.66,
      amenities: [
        { name: 'Rooftop com vista para a Baía de Guanabara', value: 'Um em cada torre' },
        { name: 'Piscina adulto e infantil', value: 'Sim' },
        { name: 'Quadra de areia', value: 'Sim' },
        { name: 'Playground', value: 'Sim' },
        { name: 'Brinquedoteca', value: 'Sim' },
        { name: 'Academias (cárdio, musculação e ginástica)', value: 'Sim' },
        { name: 'Salões de festas', value: '2' },
        { name: 'Espaço gourmet', value: 'Sim' },
        { name: 'Salão de jogos', value: 'Sim' },
        { name: 'Espaço pet', value: 'Sim' },
        { name: 'Espaço beleza', value: 'Sim' },
        { name: 'Lavanderia', value: 'Sim' },
        { name: 'Minimarket', value: 'Sim' },
        { name: 'Bicicletário', value: 'Sim' },
        { name: 'Vagas de carro', value: '22' },
      ],
    },
    faqs: FAQ_GUANABARA.map((f) => ({ question: f.pergunta, answer: f.resposta })),
  },
  {
    path: '/sun-in-studio-design-niteroi',
    title: 'Sun In Studio Design Niterói | Studios a partir de R$ 295 mil',
    description:
      'Sun In Studio Design, da RDR Engenharia, no Centro de Niterói: studios de 24 a 30 m² perto da UFF, rooftop com piscina e sky bar. A partir de R$ 295 mil.',
    h1: 'Sun In Studio Design: studios no Centro de Niterói com piscina e sky bar no rooftop, a poucos passos da UFF',
    schemaType: 'ApartmentComplex',
    priority: '0.9',
    changefreq: 'weekly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'Imóveis em Niterói', path: '/niteroirj' },
      { name: 'Sun In Studio Design', path: '/sun-in-studio-design-niteroi' },
    ],
    development: {
      name: 'Sun In Studio Design',
      developer: 'RDR Engenharia',
      addressLocality: 'Niterói',
      addressRegion: 'RJ',
      neighborhood: 'Rua São Sebastião — Centro',
      numberOfBedrooms: 'Studio',
      image: 'https://queromeumcmv.com.br/sun-in-studio-design-niteroi-piscina-rooftop.webp',
      commercialCondition: 'Financiamento CAIXA · preço a partir de R$ 295.000 · consulte a disponibilidade com o corretor',
      url: 'https://queromeumcmv.com.br/sun-in-studio-design-niteroi',
      ...(SUNIN_PRECO_A_PARTIR ? { priceFrom: SUNIN_PRECO_A_PARTIR, priceNote: SUNIN_AVISO_PRECO } : {}),
      numberOfUnits: 209,
      floorSizeMin: 24.03,
      floorSizeMax: 30.32,
      amenities: [
        { name: 'Piscina no rooftop', value: 'Sim' },
        { name: 'Sky bar', value: 'Sim' },
        { name: 'Academia', value: 'Sim' },
        { name: 'Spa e sauna', value: 'Sim' },
        { name: 'Espaço coliving', value: 'Sim' },
        { name: 'Espaço gourmet', value: 'Sim' },
        { name: 'Coworking e sala de reunião', value: 'Sim' },
        { name: 'Praça e pet place', value: 'Sim' },
        { name: 'Minimercado', value: 'Sim' },
        { name: 'Lavanderia', value: 'Sim' },
        { name: 'Espaço delivery', value: 'Sim' },
        { name: 'Bicicletário', value: '209 vagas' },
        { name: 'Vagas de garagem', value: '42' },
      ],
    },
    faqs: FAQ_SUNIN.map((f) => ({ question: f.pergunta, answer: f.resposta })),
  },
  {
    path: '/caminhos-guanabara-niteroi',
    title: 'Caminhos da Guanabara | 1 e 2 Quartos a partir de R$ 340 mil',
    description:
      'Caminhos da Guanabara, da Cury, no Caminho Niemeyer, Niterói: 1 e 2 quartos com varanda, lazer completo e rooftop com vista para a Baía. A partir de R$ 340 mil.',
    h1: 'Caminhos da Guanabara: 1 e 2 quartos no Caminho Niemeyer, com rooftop de frente para a Baía de Guanabara',
    schemaType: 'ApartmentComplex',
    priority: '0.9',
    changefreq: 'weekly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'Imóveis em Niterói', path: '/niteroirj' },
      { name: 'Caminhos da Guanabara', path: '/caminhos-guanabara-niteroi' },
    ],
    development: {
      name: 'Caminhos da Guanabara',
      developer: 'Cury',
      addressLocality: 'Niterói',
      addressRegion: 'RJ',
      neighborhood: 'Caminho Niemeyer — Centro',
      numberOfBedrooms: '1 e 2',
      image: 'https://queromeumcmv.com.br/caminhos-da-guanabara-niteroi-solario-rooftop.webp',
      commercialCondition: 'Preço a partir de R$ 340.000 · programa Cury Chega Mais · consulte a disponibilidade com o corretor',
      url: 'https://queromeumcmv.com.br/caminhos-guanabara-niteroi',
      priceFrom: CAMINHOS_PRECO_A_PARTIR,
      priceNote: CAMINHOS_AVISO_PRECO,
      numberOfUnits: 1068,
      floorSizeMin: 32.7,
      floorSizeMax: 51.3,
      amenities: [
        { name: 'Rooftop com solário e espaço gourmet', value: 'Sim' },
        { name: 'Piscinas adulto e infantil', value: 'Sim' },
        { name: 'Campo society', value: 'Sim' },
        { name: 'Quadra de areia', value: 'Sim' },
        { name: 'Academia interna e externa', value: 'Sim' },
        { name: 'Sauna', value: 'Sim' },
        { name: 'Salão de festas', value: 'Sim' },
        { name: 'Salão de jogos', value: 'Sim' },
        { name: 'Brinquedoteca e playground', value: 'Sim' },
        { name: 'Coworking', value: 'Sim' },
        { name: 'Pet care', value: 'Sim' },
        { name: 'Lavanderia', value: 'Sim' },
        { name: 'Bicicletário', value: 'Sim' },
        { name: 'Vagas de carro', value: '161' },
      ],
    },
    faqs: FAQ_CAMINHOS.map((f) => ({ question: f.pergunta, answer: f.resposta })),
  },
  {
    path: '/imperio-do-ouro-sg',
    title: 'Império do Ouro São Gonçalo | Pronto para Morar, R$ 259 mil',
    description:
      'Império do Ouro, da MRV, no Rio do Ouro em São Gonçalo: 2 quartos pronto para morar, com opção de suíte e varanda, piscina e lazer. A partir de R$ 259 mil.',
    h1: 'Império do Ouro: apartamento de 2 quartos pronto para morar no Rio do Ouro, em São Gonçalo',
    schemaType: 'ApartmentComplex',
    priority: '0.9',
    changefreq: 'weekly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'Imóveis em São Gonçalo', path: '/minha-casa-minha-vida-sao-goncalo' },
      { name: 'Império do Ouro', path: '/imperio-do-ouro-sg' },
    ],
    development: {
      name: 'Império do Ouro',
      developer: 'MRV',
      addressLocality: 'São Gonçalo',
      addressRegion: 'RJ',
      neighborhood: 'Rio do Ouro',
      numberOfBedrooms: '2',
      image: 'https://queromeumcmv.com.br/imperio-do-ouro-sg-portaria.webp',
      commercialCondition: 'Pronto para morar · preço a partir de R$ 259.490 · consulte a disponibilidade com o corretor',
      url: 'https://queromeumcmv.com.br/imperio-do-ouro-sg',
      priceFrom: IMPERIO_PRECO_A_PARTIR,
      priceNote: IMPERIO_AVISO_PRECO,
      numberOfUnits: 612,
      floorSizeMin: 46.05,
      floorSizeMax: 47.02,
      amenities: [
        { name: 'Piscina adulto e infantil', value: 'Sim' },
        { name: 'Salão de festas', value: 'Sim' },
        { name: 'Espaço gourmet', value: 'Sim' },
        { name: 'Espaço kids', value: 'Sim' },
        { name: 'Playground', value: 'Sim' },
        { name: 'Pet place', value: 'Sim' },
        { name: 'Bicicletário', value: 'Sim' },
        { name: 'Elevador', value: 'Sim' },
        { name: 'Energia solar parcial nas áreas comuns', value: 'Sim' },
        { name: 'Vagas de carro', value: '347' },
        { name: 'Vagas de moto', value: '53' },
      ],
    },
    faqs: FAQ_IMPERIO.map((f) => ({ question: f.pergunta, answer: f.resposta })),
  },
  {
    path: '/niteroi-open-residence',
    title: 'Niterói Open Residencial | Últimas Unidades, R$ 287 mil',
    description:
      'Niterói Open Residencial, da GPCON, no Fonseca: lofts e 2 quartos com varanda, piscina com prainha e coworking. Últimas unidades a partir de R$ 287 mil.',
    h1: 'Niterói Open Residencial: lofts e 2 quartos com varanda no Fonseca, perto de tudo e longe do aluguel',
    schemaType: 'ApartmentComplex',
    priority: '0.9',
    changefreq: 'weekly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'Imóveis em Niterói', path: '/niteroirj' },
      { name: 'Niterói Open Residencial', path: '/niteroi-open-residence' },
    ],
    development: {
      name: 'Niterói Open Residencial',
      developer: 'GPCON Realizações',
      addressLocality: 'Niterói',
      addressRegion: 'RJ',
      neighborhood: 'Bairro Chic — Fonseca',
      numberOfBedrooms: '1 a 3',
      image: 'https://queromeumcmv.com.br/niteroi-open-residencial-fachada.webp',
      commercialCondition: 'Últimas unidades · preço a partir de R$ 287.000 · consulte a disponibilidade com o corretor',
      url: 'https://queromeumcmv.com.br/niteroi-open-residence',
      priceFrom: OPEN_PRECO_A_PARTIR,
      priceNote: OPEN_AVISO_PRECO,
      numberOfUnits: 72,
      floorSizeMin: 45.1,
      floorSizeMax: 144,
      amenities: [
        { name: 'Piscina com prainha', value: 'Sim' },
        { name: 'Solarium com churrasqueira', value: 'Sim' },
        { name: 'Espaço gourmet com salão de festas', value: 'Sim' },
        { name: 'Espaço fitness', value: 'Sim' },
        { name: 'Coworking com sala de reunião', value: 'Sim' },
        { name: 'Espaço kids', value: 'Sim' },
        { name: 'Espaço pet shower', value: 'Sim' },
        { name: 'Bicicletário com recarga para bicicleta elétrica', value: 'Sim' },
        { name: 'Wi-Fi nas áreas comuns', value: 'Sim' },
        { name: 'Elevadores', value: '2' },
        { name: 'Vagas de garagem', value: '39' },
      ],
    },
    faqs: FAQ_OPEN.map((f) => ({ question: f.pergunta, answer: f.resposta })),
  },
  {
    path: '/mirante-boa-vista',
    title: 'Mirante Boa Vista | Apartamentos MCMV São Cristóvão Rio de Janeiro | Tenda',
    description:
      'Lançamento Tenda Mirante Boa Vista em São Cristóvão-RJ: 441 apartamentos 1 e 2 quartos a partir de R$ 295 mil, piscina adulto e infantil, academia, salão gourmet. Entrada R$ 499/mês. ITBI grátis.',
    h1: 'Mirante Boa Vista — Apartamentos 1 e 2 Quartos em São Cristóvão, Rio de Janeiro',
    noindex: true,
    schemaType: 'ApartmentComplex',
    priority: '0.9',
    changefreq: 'weekly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'MCMV Rio de Janeiro', path: '/minha-casa-minha-vida-sao-goncalo' },
      { name: 'Mirante Boa Vista', path: '/mirante-boa-vista' },
    ],
    development: {
      name: 'Mirante Boa Vista',
      developer: 'Tenda',
      addressLocality: 'São Cristóvão',
      addressRegion: 'RJ',
      neighborhood: 'Imperial de São Cristóvão — próximo à Quinta da Boa Vista',
      numberOfBedrooms: 2,
      image: 'https://queromeumcmv.com.br/capa-site-quero-meu-mcmv-open-graph.webp',
      commercialCondition: 'Financiamento Caixa — Minha Casa Minha Vida · ITBI e Registro grátis',
      amenities: [
        { name: 'Piscina Adulto e Infantil', value: 'Sim + Deck' },
        { name: 'Fitness (Academia)', value: 'Coberta' },
        { name: 'Salão de Festas Gourmet', value: 'Sim' },
        { name: 'Churrasqueiras Gourmet', value: '2' },
        { name: 'Quadra Streetball', value: 'Sim' },
        { name: 'Bicicletário', value: '450 vagas' },
        { name: 'Play Pet', value: 'Sim' },
        { name: 'Brinquedoteca', value: 'Sim' },
        { name: 'Play Kids + Play Baby', value: 'Sim' },
        { name: 'Espaço Office', value: 'Equipado' },
        { name: 'Mini Market', value: 'Sim' },
        { name: 'Espaço Delivery', value: 'Sim' },
        { name: 'Espaço Oficina', value: 'Sim' },
        { name: 'Múltipla Estação + Ducha', value: 'Externo' },
      ],
    },
    faqs: [
      {
        question: 'Qual o preço do Mirante Boa Vista?',
        answer:
          'Os apartamentos do Mirante Boa Vista começam a partir de R$ 295.000, com entrada parcelada a partir de R$ 499/mês. ITBI e registro em cartório são grátis.',
      },
      {
        question: 'O Mirante Boa Vista é pelo Minha Casa Minha Vida?',
        answer:
          'Sim. O Mirante Boa Vista, da Construtora Tenda, é enquadrado no programa Minha Casa Minha Vida, com financiamento pela Caixa Econômica Federal e subsídio de até R$ 55 mil para famílias com renda de até R$ 5.000 (Faixas 1 e 2).',
      },
      {
        question: 'Qual a localização do Mirante Boa Vista?',
        answer:
          'Rua Sabino Vieira, 70 — Imperial de São Cristóvão, Rio de Janeiro. A 180 m da Quinta da Boa Vista, 400 m do Bio Parque do Rio, 1,4 km da Estação São Cristóvão do metrô e 2,5 km do Maracanã.',
      },
      {
        question: 'Qual a previsão de entrega do Mirante Boa Vista?',
        answer:
          'Setembro de 2028. O Memorial de Incorporação está registrado sob R-55 da Matrícula 55.316 do 3° Registro de Imóveis do Rio de Janeiro/RJ.',
      },
      {
        question: 'Quantas unidades tem o Mirante Boa Vista?',
        answer:
          '441 unidades em 5 torres (Térreo + 6 pavimentos): 18 garden (36,22–36,54 m²), 114 com varanda (33,97–34,22 m²) e 14 adaptadas para PCD.',
      },
    ],
  },
  {
    path: '/vert-alcantara',
    title: 'Vert Alcântara Direcional: Apartamentos MCMV em São Gonçalo',
    description: 'Studio, 1 e 2 quartos de 36 a 77 m² no coração de Alcântara, com +15 itens de lazer e unidades garden. Descubra a sua parcela no Minha Casa Minha Vida.',
    h1: 'Direcional Vert Alcântara — Apartamentos MCMV em São Gonçalo com Padrão de Condomínio Clube',
    schemaType: 'ApartmentComplex',
    priority: '0.9',
    changefreq: 'weekly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'MCMV São Gonçalo', path: '/minha-casa-minha-vida-sao-goncalo' },
      { name: 'Vert Alcântara', path: '/vert-alcantara' },
    ],
    development: {
      name: 'Direcional Vert Alcântara',
      developer: 'Direcional Engenharia',
      addressLocality: 'São Gonçalo',
      addressRegion: 'RJ',
      neighborhood: 'Alcântara — Estrada dos Menezes, ao lado do Atacadão',
      numberOfBedrooms: '1 e 2',
      image: 'https://queromeumcmv.com.br/vert-alcantara-fachada.webp',
      commercialCondition: 'Financiamento Caixa — Minha Casa Minha Vida',
      amenities: [
        { name: 'Metragem', value: '36 m² a 77 m²' },
        { name: 'Piscina Adulto e Infantil', value: 'Sim' },
        { name: 'Coworking', value: 'Sim' },
        { name: 'Lavanderia Coletiva', value: 'Sim' },
        { name: 'Quadra de Areia', value: 'Sim' },
        { name: 'Fitness Externo', value: 'Sim' },
        { name: 'Salão de Festas Gourmet', value: 'Sim' },
        { name: 'Guarita Blindada', value: '24h' },
      ],
    },
    faqs: [
      {
        question: 'O que é o Direcional Vert Alcântara?',
        answer:
          'É um lançamento da Direcional Engenharia em Alcântara, São Gonçalo-RJ, com apartamentos de 36 a 77 m² (studio, 1 e 2 quartos, com varanda e opções garden), mais de 15 itens de lazer e elegível ao Minha Casa Minha Vida.',
      },
      {
        question: 'O Vert Alcântara é pelo Minha Casa Minha Vida?',
        answer:
          'Sim. É elegível ao MCMV, com financiamento pela Caixa, juros reduzidos, composição de renda com até 3 pessoas e uso do FGTS. Famílias com renda de até R$ 5.000 (Faixas 1 e 2) podem ainda receber subsídio.',
      },
      {
        question: 'Onde fica o Vert Alcântara?',
        answer:
          'Na Estrada dos Menezes, s/n, em Alcântara, São Gonçalo-RJ — ao lado do Atacadão Alcântara e próximo à RJ-104, a cerca de 15 minutos de Niterói.',
      },
      {
        question: 'Quais são as tipologias do Vert Alcântara?',
        answer:
          'Studio/1 quarto com varanda (incluindo PcD), 2 quartos tipo meio com varanda, 2 quartos tipo ponta e unidades garden com quintal privativo, de 36 a 77 m².',
      },
    ],
  },
  {
    path: '/apartamentos-mar-de-trindade',
    title: 'Residencial Mar de Trindade MRV: 2 Quartos MCMV em Alcântara',
    description: '2 quartos de 42 a 75,9 m² com suíte, varanda e garden em Alcântara, São Gonçalo, a partir de R$ 270.990. Veja as plantas e simule a sua parcela.',
    h1: 'Residencial Mar de Trindade — o primeiro de Alcântara com suíte, varanda e garden',
    schemaType: 'ApartmentComplex',
    priority: '0.9',
    changefreq: 'weekly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'MCMV São Gonçalo', path: '/minha-casa-minha-vida-sao-goncalo' },
      { name: 'Mar de Trindade', path: '/apartamentos-mar-de-trindade' },
    ],
    development: {
      name: 'Residencial Mar de Trindade',
      developer: 'MRV Engenharia',
      addressLocality: 'São Gonçalo',
      addressRegion: 'RJ',
      neighborhood: 'Alcântara — Estrada dos Menezes, ao lado do Atacadão',
      numberOfBedrooms: 2,
      image: 'https://queromeumcmv.com.br/mar-de-trindade-foto-aerea.webp',
      commercialCondition: 'A partir de R$ 270.990 — Financiamento Caixa, Minha Casa Minha Vida',
      amenities: [
        { name: 'Unidades', value: '504 em 3 torres' },
        { name: 'Metragem', value: '42 m² a 75,9 m²' },
        { name: 'Unidades Garden', value: '36' },
        { name: 'Piscina Adulto e Infantil', value: 'Sim' },
        { name: 'Academia', value: 'Sim' },
        { name: 'Quadra Poliesportiva', value: 'Sim' },
        { name: 'Salão de Festas', value: 'Sim' },
        { name: 'Espaço Kids', value: 'Sim' },
      ],
    },
    faqs: [
      {
        question: 'Qual o preço do Residencial Mar de Trindade?',
        answer:
          'Os apartamentos partem de R$ 270.990 para a planta de 42 m². Pelo Minha Casa Minha Vida, famílias com renda de até R$ 5.000 (Faixas 1 e 2) podem receber subsídio, e as demais faixas têm juros reduzidos pela Caixa e podem usar o FGTS.',
      },
      {
        question: 'Onde fica o Residencial Mar de Trindade?',
        answer:
          'Na Estrada dos Menezes, em Alcântara, São Gonçalo-RJ — ao lado do Atacadão e a 5 minutos do Shopping Pátio Alcântara e do Terminal Rodoviário, com acesso à RJ-104.',
      },
      {
        question: 'Quando o Residencial Mar de Trindade será entregue?',
        answer: 'A previsão de entrega é dezembro de 2028. O empreendimento foi lançado em agosto de 2025 pela MRV Engenharia.',
      },
      {
        question: 'O Residencial Mar de Trindade tem apartamento garden?',
        answer:
          'Sim. São 36 unidades garden no térreo, com áreas privativas externas de 19 m² a 31,86 m².',
      },
    ],
  },
  {
    path: '/niteroirj',
    title: 'Minha Casa Minha Vida em Niterói-RJ: Apartamentos 2026',
    description: 'Quer morar em Niterói ou a 15 minutos dela pagando parcela de Minha Casa Minha Vida? Veja as faixas de renda, o subsídio e as opções para o seu orçamento.',
    h1: 'Minha Casa Minha Vida em Niterói - RJ',
    schemaType: 'CollectionPage',
    priority: '0.8',
    changefreq: 'weekly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'MCMV Niterói', path: '/niteroirj' },
    ],
    faqs: [
      {
        question: 'Tem apartamento Minha Casa Minha Vida em Niterói?',
        answer: 'Sim. Niterói tem opções enquadradas no MCMV, especialmente em bairros como Pendotiba, Largo da Batalha e regiões com acesso ao centro. Consulte nossa carteira de imóveis disponíveis via WhatsApp para ver as opções atuais.',
      },
      {
        question: 'Qual a renda mínima para financiar em Niterói pelo MCMV?',
        answer: 'Não existe renda mínima: o programa atende famílias com renda bruta de até R$ 13.000, divididas em 4 faixas (até R$ 3.200, R$ 5.000, R$ 9.600 e R$ 13.000). Quem ganha até R$ 5.000 ainda pode receber subsídio. Trabalhadores formais, informais e MEIs podem participar, desde que comprovem renda conforme as exigências da Caixa Econômica Federal.',
      },
      {
        question: 'Joel Marcos atende presencialmente em Niterói?',
        answer: 'O atendimento inicial é consultivo, feito por WhatsApp, vídeo ou telefone. O deslocamento até Niterói para visitas e assinatura de documentos é combinado conforme andamento do processo.',
      },
      {
        question: 'Posso usar o FGTS na compra de imóvel em Niterói?',
        answer: 'Sim, desde que você tenha pelo menos 3 anos de trabalho com carteira assinada (somando todos os vínculos). O FGTS pode ser usado como entrada, para abater parcelas ou reduzir o saldo devedor.',
      },
    ],
  },
  {
    path: '/financiamento-minha-casa-minha-vida',
    title: 'Financiamento MCMV em Itaboraí e São Gonçalo: Guia 2026',
    description: 'Juros, prazo, entrada e FGTS explicados por um corretor da região. Descubra quanto você pode financiar antes de escolher o seu apartamento.',
    h1: 'Como funciona o Financiamento Minha Casa Minha Vida',
    schemaType: 'Article',
    priority: '0.9',
    changefreq: 'monthly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'Financiamento MCMV', path: '/financiamento-minha-casa-minha-vida' },
    ],
    faqs: [
      {
        question: 'Qual é a renda mínima para financiar pelo Minha Casa Minha Vida?',
        answer: 'O programa atende famílias com renda mensal bruta a partir de R$ 1.500 até R$ 9.600 ou mais nas faixas ampliadas. É permitida a composição de renda com cônjuge, familiares ou até amigos.',
      },
      {
        question: 'Qual é o prazo máximo de pagamento do financiamento Caixa?',
        answer: 'Pela Caixa Econômica Federal, o prazo do financiamento habitacional do MCMV pode chegar a até 35 anos (420 meses).',
      },
      {
        question: 'Como é calculada a taxa de juros do programa?',
        answer: 'As taxas de juros variam de acordo com a faixa de renda familiar, a região do imóvel e se o comprador é titular de conta vinculada do FGTS há pelo menos 3 anos.',
      },
      {
        question: 'Posso financiar um imóvel estando com nome negativado?',
        answer: 'A Caixa Econômica exige que o comprador esteja com o nome limpo no momento da contratação do financiamento habitacional. Joel Marcos orienta você sobre os passos para regularização.',
      },
      {
        question: 'O subsídio do governo precisa ser devolvido?',
        answer: 'Não! O subsídio habitacional é um desconto a fundo perdido concedido pelo Governo Federal para ajudar na aquisição do primeiro imóvel.',
      },
    ],
  },
  {
    path: '/subsidio-minha-casa-minha-vida',
    title: 'Subsídio MCMV 2026 em Itaboraí e Região: Quanto Você Recebe',
    description: 'Até R$ 55 mil que você não devolve: veja quem tem direito ao subsídio do Minha Casa Minha Vida em 2026 e quanto ele pode reduzir a sua entrada.',
    h1: 'Subsídio do Minha Casa Minha Vida 2026: quanto você recebe em Itaboraí e região',
    schemaType: 'Article',
    priority: '0.8',
    changefreq: 'monthly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'Subsídio MCMV', path: '/subsidio-minha-casa-minha-vida' },
    ],
    faqs: [
      {
        question: 'Quem tem direito ao subsídio do Minha Casa Minha Vida?',
        answer: 'Famílias enquadradas principalmente nas Faixas 1 e 2 do programa, que comprovem renda dentro dos limites vigentes e não possuam imóvel próprio.',
      },
      {
        question: 'Quanto posso receber de subsídio em Itaboraí e região?',
        answer: 'O valor do subsídio pode chegar a até R$ 55.000, calculado conforme a renda familiar bruta, o município do imóvel e a composição familiar.',
      },
      {
        question: 'O subsídio entra como abatimento na entrada?',
        answer: 'Sim, o subsídio é aplicado diretamente reduzindo o saldo do imóvel e o valor de entrada necessário.',
      },
    ],
  },
  {
    path: '/fgts-minha-casa-minha-vida',
    title: 'Como Usar o FGTS no Minha Casa Minha Vida em 2026',
    description: 'O seu FGTS pode virar a entrada do apartamento. Veja as regras de 2026, quem pode usar e como somar com o subsídio para comprar em Itaboraí e região.',
    h1: 'Como usar o FGTS no Minha Casa Minha Vida em 2026',
    schemaType: 'Article',
    priority: '0.8',
    changefreq: 'monthly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'FGTS no MCMV', path: '/fgts-minha-casa-minha-vida' },
    ],
    faqs: [
      {
        question: 'Posso usar o FGTS na entrada do financiamento?',
        answer: 'Sim! O saldo do FGTS pode ser utilizado como entrada ou parte dela, diminuindo o valor a desembolsar do próprio bolso.',
      },
      {
        question: 'Preciso ter quantos anos de carteira assinada para usar o FGTS?',
        answer: 'É necessário ter no mínimo 3 anos de trabalho sob regime do FGTS, somando todos os períodos trabalhados, consecutivos ou não.',
      },
      {
        question: 'Posso usar o FGTS para amortizar as parcelas futuras?',
        answer: 'Sim, o FGTS pode ser usado para abater até 80% do valor das prestações ou amortizar o saldo devedor ao longo do contrato.',
      },
    ],
  },
  {
    path: '/renda-minha-casa-minha-vida',
    title: 'Faixas de Renda do Minha Casa Minha Vida 2026: Qual É a Sua?',
    description: 'De R$ 3.200 a R$ 13.000: descubra em qual faixa do MCMV a sua família entra, o valor máximo do imóvel e os juros de cada uma.',
    h1: 'Faixas de renda do Minha Casa Minha Vida 2026: em qual a sua família entra?',
    schemaType: 'Article',
    priority: '0.8',
    changefreq: 'monthly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'Renda MCMV', path: '/renda-minha-casa-minha-vida' },
    ],
    faqs: [
      {
        question: 'Quais são as faixas de renda do Minha Casa Minha Vida em 2026?',
        answer: 'As faixas atendem desde a Faixa 1 (renda de até R$ 3.200), Faixa 2 (de R$ 3.200,01 até R$ 5.000), Faixa 3 (de R$ 5.000,01 até R$ 9.600) e a linha ampliada (para famílias com renda de até R$ 13.000).',
      },
      {
        question: 'Como comprovar renda sendo trabalhador autônomo ou MEI?',
        answer: 'Autônomos e MEIs podem comprovar renda através de extratos bancários de pessoa física dos últimos 6 meses, além de declaração de Imposto de Renda recente.',
      },
      {
        question: 'A renda familiar pode ser somada?',
        answer: 'Sim! Você pode somar sua renda com parentes de primeiro grau, cônjuge, namorado(a) ou amigos para alcançar a aprovação necessária.',
      },
    ],
  },
  {
    path: '/documentos-minha-casa-minha-vida',
    title: 'Documentos para o Minha Casa Minha Vida: Lista 2026 (Caixa)',
    description: 'CLT, autônomo, MEI ou renda composta: a lista completa de documentos que a Caixa pede no MCMV, para você não travar na análise de crédito.',
    h1: 'Documentos para o Minha Casa Minha Vida: a lista completa de 2026',
    schemaType: 'Article',
    priority: '0.8',
    changefreq: 'monthly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'Documentos MCMV', path: '/documentos-minha-casa-minha-vida' },
    ],
    faqs: [
      {
        question: 'Quais são os documentos básicos para o financiamento Caixa?',
        answer: 'Documento oficial com foto (RG/CNH), CPF, Certidão de Estado Civil (nascimento ou casamento), Comprovante de Residência recente, Carteira de Trabalho e comprovante de rendimentos.',
      },
      {
        question: 'Quais documentos o autônomo precisa apresentar?',
        answer: 'Extratos bancários dos últimos 6 meses da conta corrente de pessoa física e Declaração de Imposto de Renda com recibo de entrega.',
      },
      {
        question: 'Composição de renda exige documentos de todos os participantes?',
        answer: 'Sim, todos os participantes que forem compor renda deverão apresentar a documentação pessoal e de comprovação de renda completa.',
      },
    ],
  },
  {
    path: '/captacaodeimoveis',
    title: 'Avaliação Gratuita do Seu Imóvel em Itaboraí e Região',
    description: 'Quer vender seu imóvel em Itaboraí, São Gonçalo, Niterói ou Maricá? Receba avaliação gratuita com corretor CRECI 39.583F.',
    h1: 'Descubra quanto vale o seu imóvel em Itaboraí, gratuitamente',
    schemaType: 'Service',
    priority: '0.9',
    changefreq: 'weekly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'Avaliação de Imóveis', path: '/captacaodeimoveis' },
    ],
    faqs: [
      {
        question: 'Como funciona a avaliação gratuita do imóvel?',
        answer: 'Você preenche as características do seu imóvel no formulário e Joel Marcos analisa a localização, tamanho e o valor de mercado atualizado de Itaboraí e região atendida.',
      },
      {
        question: 'Preciso pagar alguma taxa pela avaliação?',
        answer: 'Não. A avaliação inicial de mercado é 100% gratuita e sem compromisso.',
      },
      {
        question: 'Quais cidades são atendidas na captação?',
        answer: 'Atendemos com especialidade em Itaboraí, e com atendimento também em São Gonçalo, Niterói e Maricá.',
      },
      {
        question: 'O corretor possui registro no CRECI?',
        answer: 'Sim! Joel Marcos é corretor devidamente credenciado no Conselho Regional de Corretores de Imóveis sob o CRECI 39.583F.',
      },
    ],
  },
  {
    path: '/sobre',
    title: 'Joel Marcos, Corretor de Imóveis em Itaboraí | CRECI 39.583F',
    description: 'Corretor de imóveis desde 2002, especialista em Minha Casa Minha Vida em Itaboraí, São Gonçalo e Niterói. Conheça quem vai cuidar da sua compra.',
    h1: 'Joel Marcos, Corretor de Imóveis em Itaboraí Especialista em Minha Casa Minha Vida',
    schemaType: 'AboutPage',
    priority: '0.8',
    changefreq: 'monthly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'Sobre', path: '/sobre' },
    ],
  },
  {
    path: '/reserva-dos-passaros-2',
    title: 'Reserva dos Pássaros 2, Itaboraí: Casas 2 Quartos MCMV',
    description: 'Casa própria em condomínio fechado em Itaboraí: 2 quartos, vaga e parcelas a partir de R$ 650*. Veja como o subsídio do MCMV reduz a sua entrada.',
    h1: 'Reserva dos Pássaros 2: Casas 2 Quartos em Condomínio Clube',
    schemaType: 'ApartmentComplex',
    priority: '0.8',
    changefreq: 'weekly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'MCMV Itaboraí', path: '/minha-casa-minha-vida-itaborai' },
      { name: 'Reserva dos Pássaros 2', path: '/reserva-dos-passaros-2' },
    ],
    development: {
      name: 'Reserva dos Pássaros 2',
      developer: 'Realiza Construtora',
      addressLocality: 'Itaboraí',
      addressRegion: 'RJ',
      neighborhood: 'Retiro São Joaquim / Vila Rica',
      numberOfBedrooms: 2,
      image: `${CANONICAL_DOMAIN}/fachada-da-casa-reserva-dos-passaros.webp`,
      commercialCondition: 'Parcelas a partir de R$ 650 e subsídio de até R$ 55 mil — Caixa, Minha Casa Minha Vida',
      amenities: [
        { name: 'Vaga de Garagem', value: 'True' },
        { name: 'Condomínio Fechado', value: 'True' },
        { name: 'Lazer Completo', value: 'True' },
        { name: 'Piscinas Climatizadas (Adulto e Infantil)', value: 'True' },
        { name: 'Salão de Festas com Churrasqueira', value: 'True' },
        { name: 'Academia', value: 'True' },
        { name: 'Pet Place', value: 'True' },
        { name: 'Segurança 24 horas', value: 'True' },
      ],
    },
    faqs: [
      {
        question: 'Onde fica localizado o condomínio Reserva dos Pássaros 2?',
        answer: 'O condomínio fechado Reserva dos Pássaros 2 está localizado no bairro Retiro São Joaquim (região da Vila Rica), em Itaboraí, RJ. Em apenas 10 minutos você chega ao Centro, com fácil acesso à Avenida 22 de Maio.',
      },
      {
        question: 'As casas no Reserva dos Pássaros 2 são geminadas?',
        answer: 'Não, as casas do Reserva dos Pássaros 2 são 100% independentes (não geminadas). Este é o grande diferencial da Realiza Construtora, com lotes privativos a partir de 150m² e amplo quintal.',
      },
      {
        question: 'Como comprar casa pelo Minha Casa Minha Vida em Itaboraí?',
        answer: 'Basta usar o programa Minha Casa Minha Vida da Caixa Econômica Federal. O Reserva dos Pássaros 2 é totalmente aprovado pela Caixa, permitindo usar o saldo do FGTS e subsídios de até R$ 55 mil.',
      },
      {
        question: 'Quais opções de lazer o condomínio clube oferece?',
        answer: 'O condomínio oferece piscinas climatizadas (adulto e infantil), academia, salão de festas com churrasqueira, playground, pet place, quadra de esportes, pomar, redário e minimercado autônomo 24 horas.',
      },
    ],
  },
  {
    path: '/prime-club-itaborai',
    title: 'Prime Clube Itaboraí: Apartamentos 2 Quartos MCMV',
    description: 'Condomínio clube em Itaboraí com 2 quartos, vaga e lazer completo. Entrada parcelada em até 72x e subsídio de até R$ 55 mil. Veja se você se encaixa.',
    h1: 'Prime Club Itaboraí: Apartamentos 2 Quartos com Lazer Completo',
    schemaType: 'ApartmentComplex',
    priority: '0.8',
    changefreq: 'weekly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'MCMV Itaboraí', path: '/minha-casa-minha-vida-itaborai' },
      { name: 'Prime Club Itaboraí', path: '/prime-club-itaborai' },
    ],
    development: {
      name: 'Prime Club Itaboraí',
      addressLocality: 'Itaboraí',
      addressRegion: 'RJ',
      numberOfBedrooms: 2,
      image: `${CANONICAL_DOMAIN}/capa-do-site-prime-club-itaborai.webp`,
      commercialCondition: 'Entrada parcelada em até 72x e subsídio de até R$ 55 mil — Caixa, Minha Casa Minha Vida',
      amenities: [
        { name: 'Vaga de Garagem', value: 'True' },
        { name: 'Condomínio Fechado', value: 'True' },
        { name: 'Lazer Completo', value: 'True' },
        { name: 'Piscina Adulto e Infantil', value: 'True' },
        { name: 'Salão de Festas com Churrasqueira', value: 'True' },
        { name: 'Academia Equipada', value: 'True' },
      ],
    },
    faqs: [
      {
        question: 'Onde fica localizado o condomínio Prime Club?',
        answer: 'O condomínio fechado Prime Club está estrategicamente localizado em Itaboraí, RJ, com acesso rápido a escolas e comércios da cidade.',
      },
      {
        question: 'Os apartamentos no Prime Club possuem vaga de garagem?',
        answer: 'Sim. O Prime Club oferece apartamentos de 2 quartos com direito a vaga de garagem, proporcionando mais segurança e conforto.',
      },
      {
        question: 'Como comprar apartamento pelo Minha Casa Minha Vida em Itaboraí?',
        answer: 'É muito simples. O Prime Club está aprovado pelo programa Minha Casa Minha Vida da Caixa Econômica Federal. Você pode utilizar seu FGTS como parte da entrada e garantir o subsídio do governo.',
      },
      {
        question: 'Quais opções de lazer o condomínio clube oferece?',
        answer: 'A área de lazer do condomínio é completa: piscinas adulto e infantil, academia equipada, salão de festas com churrasqueira, playground infantil, espaço pet e quadra de esportes.',
      },
    ],
  },
  {
    path: '/flores-de-maio',
    title: 'Flores de Maio, Itaboraí: Apartamentos 2 Quartos MCMV',
    description: 'A 5 minutos do Centro de Itaboraí, em Santo Expedito: 2 quartos com varanda, vaga e lazer em condomínio. Descubra quanto o subsídio reduz a sua entrada.',
    h1: 'Flores de Maio: Apartamentos 2 Quartos com Varanda em Condomínio',
    schemaType: 'ApartmentComplex',
    priority: '0.8',
    changefreq: 'weekly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'MCMV Itaboraí', path: '/minha-casa-minha-vida-itaborai' },
      { name: 'Flores de Maio', path: '/flores-de-maio' },
    ],
    development: {
      name: 'Flores de Maio',
      developer: 'RJ Incorporadora',
      addressLocality: 'Itaboraí',
      addressRegion: 'RJ',
      neighborhood: 'Santo Expedito',
      numberOfBedrooms: 2,
      image: `${CANONICAL_DOMAIN}/fachada-flores-de-maio.webp`,
      commercialCondition: 'Subsídio de até R$ 55 mil — Caixa, Minha Casa Minha Vida',
      amenities: [
        { name: 'Vaga de Garagem', value: 'True' },
        { name: 'Condomínio Fechado', value: 'True' },
        { name: 'Lazer Completo', value: 'True' },
        { name: 'Piscina', value: 'True' },
        { name: 'Churrasqueira', value: 'True' },
        { name: 'Playground', value: 'True' },
        { name: 'Varanda nas Unidades', value: 'True' },
      ],
    },
    faqs: [
      {
        question: 'Onde fica localizado o Flores de Maio?',
        answer: 'O Flores de Maio está estrategicamente localizado no bairro de Santo Expedito, a 5 minutos do centro de Itaboraí, RJ.',
      },
      {
        question: 'Os apartamentos possuem varanda?',
        answer: 'Sim. O Flores de Maio oferece apartamentos de 2 quartos com varanda, trazendo mais ventilação e conforto.',
      },
      {
        question: 'Como funciona o financiamento para o Flores de Maio?',
        answer: 'O financiamento é facilitado pela Caixa Econômica Federal dentro do programa Minha Casa Minha Vida.',
      },
      {
        question: 'Quem é a construtora responsável?',
        answer: 'O empreendimento é um projeto da RJ Incorporadora.',
      },
    ],
  },
  {
    path: '/residencial-florescer',
    title: 'Residencial Florescer, Vila Iara: 2 e 3 Quartos com Suíte',
    description: 'Lançamento em Vila Iara, São Gonçalo: 2 e 3 quartos com suíte e varanda gourmet, 1 ou 2 vagas e lazer completo. Conheça as plantas e as condições.',
    h1: 'Residencial Florescer: 2 e 3 Quartos com Suíte e Varanda Gourmet',
    schemaType: 'ApartmentComplex',
    priority: '0.8',
    changefreq: 'weekly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'MCMV São Gonçalo', path: '/minha-casa-minha-vida-sao-goncalo' },
      { name: 'Residencial Florescer', path: '/residencial-florescer' },
    ],
    development: {
      name: 'Residencial Florescer',
      developer: 'RJ Engenharia',
      addressLocality: 'São Gonçalo',
      addressRegion: 'RJ',
      neighborhood: 'Vila Iara',
      numberOfBedrooms: '2 e 3',
      image: `${CANONICAL_DOMAIN}/fachada-residencial-florescer.webp`,
      commercialCondition: 'Condições exclusivas de lançamento com financiamento facilitado pela Caixa',
      amenities: [
        { name: '1 ou 2 Vagas', value: 'True' },
        { name: 'Condomínio Fechado', value: 'True' },
        { name: 'Lazer Completo', value: 'True' },
        { name: 'Suíte e Varanda Gourmet', value: 'True' },
        { name: 'Piscina e Deck', value: 'True' },
        { name: 'Salão de Festas', value: 'True' },
      ],
    },
    faqs: [
      {
        question: 'Onde fica localizado o Residencial Florescer?',
        answer: 'O Residencial Florescer está estrategicamente localizado no bairro de Vila Iara, em São Gonçalo, RJ.',
      },
      {
        question: 'Os apartamentos possuem varanda?',
        answer: 'Sim. O Residencial Florescer dispõe de plantas de 2 e 3 quartos com suíte e varanda gourmet.',
      },
      {
        question: 'Como funciona o financiamento para o Residencial Florescer?',
        answer: 'Oferecemos condições personalizadas com financiamento inteligente pela Caixa Econômica Federal.',
      },
      {
        question: 'Quem é a construtora responsável?',
        answer: 'O empreendimento é um projeto da RJ Engenharia.',
      },
    ],
  },
  {
    path: '/solar-da-trindade',
    title: 'Solar da Trindade, São Gonçalo: MCMV Perto da Universo',
    description: 'A 300 m da Universo, em Trindade: 2 quartos com vaga em condomínio clube e entrada parcelada em até 100x. Veja se a parcela cabe no seu bolso.',
    h1: 'Solar da Trindade: Apartamentos 2 Quartos em Condomínio Clube',
    schemaType: 'ApartmentComplex',
    priority: '0.8',
    changefreq: 'weekly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'MCMV São Gonçalo', path: '/minha-casa-minha-vida-sao-goncalo' },
      { name: 'Solar da Trindade', path: '/solar-da-trindade' },
    ],
    development: {
      name: 'Solar da Trindade',
      developer: 'Tenda',
      addressLocality: 'São Gonçalo',
      addressRegion: 'RJ',
      neighborhood: 'Trindade',
      numberOfBedrooms: 2,
      image: `${CANONICAL_DOMAIN}/fachada-solar-trindade.webp`,
      commercialCondition: 'Entrada parcelada em até 100x e subsídio Caixa — Minha Casa Minha Vida',
      amenities: [
        { name: 'Vaga de Garagem', value: 'True' },
        { name: 'Condomínio Fechado', value: 'True' },
        { name: 'Lazer Completo', value: 'True' },
        { name: 'Churrasqueira', value: 'True' },
        { name: 'Playground', value: 'True' },
        { name: 'Fitness Externo', value: 'True' },
      ],
    },
    faqs: [
      {
        question: 'Onde fica localizado o Solar da Trindade?',
        answer: 'O Solar da Trindade está estrategicamente localizado no bairro de Trindade, em São Gonçalo, RJ, a cerca de 300 metros da Universidade Salgado de Oliveira (Universo).',
      },
      {
        question: 'Os apartamentos possuem vaga de garagem?',
        answer: 'O empreendimento conta com unidades com vaga de garagem, proporcionando mais segurança e comodidade.',
      },
      {
        question: 'Como funciona o financiamento para o Solar da Trindade?',
        answer: 'O financiamento é facilitado pela Caixa no Minha Casa Minha Vida, com entrada parcelada em até 100x durante a obra.',
      },
      {
        question: 'Quem é a construtora responsável?',
        answer: 'O empreendimento é realizado pela Tenda.',
      },
    ],
  },
  {
    path: '/conquista-oceanica',
    title: 'Conquista Oceânica, Maricá: Lançamento MCMV 1 e 2 Quartos',
    description: 'Lançamento em Maricá, a minutos das praias: 1 e 2 quartos com garden, vaga e lazer entregue equipado. Descubra a sua condição no Minha Casa Minha Vida.',
    h1: 'Conquista Oceânica: 1 e 2 Quartos a Minutos das Praias de Niterói',
    schemaType: 'ApartmentComplex',
    priority: '0.8',
    changefreq: 'weekly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'Conquista Oceânica', path: '/conquista-oceanica' },
    ],
    development: {
      name: 'Conquista Oceânica',
      developer: 'Direcional',
      addressLocality: 'Maricá',
      addressRegion: 'RJ',
      neighborhood: 'Divisa Niterói',
      numberOfBedrooms: '1 e 2',
      image: `${CANONICAL_DOMAIN}/fachada-conquista-oceanica.webp`,
      commercialCondition: 'Financiamento Caixa — Minha Casa Minha Vida',
      amenities: [
        { name: 'Vaga de Garagem', value: 'True' },
        { name: 'Condomínio Fechado', value: 'True' },
        { name: 'Lazer Completo', value: 'True' },
        { name: 'Piscina Adulto e Infantil', value: 'True' },
        { name: 'Salão de Festas', value: 'True' },
        { name: 'Espaço Fitness', value: 'True' },
        { name: 'Espaço Pet', value: 'True' },
      ],
    },
    faqs: [
      {
        question: 'Onde fica localizado o Conquista Oceânica?',
        answer: 'O Conquista Oceânica está localizado em Maricá - RJ, a minutos de distância das praias da Região Oceânica de Niterói.',
      },
      {
        question: 'Quais os tipos de apartamentos?',
        answer: 'O empreendimento oferece apartamentos de 1 e 2 quartos com opções de gardens.',
      },
      {
        question: 'O empreendimento tem área de lazer?',
        answer: 'Sim, possui lazer completo entregue equipado: piscina, salão de festas, fitness, espaço pet, churrasqueiras e playground.',
      },
      {
        question: 'Quais as formas de pagamento?',
        answer: 'O imóvel pode ser financiado pelo programa Minha Casa Minha Vida, permitindo uso do FGTS e entrada facilitada.',
      },
    ],
  },
  {
    path: '/politica-de-privacidade',
    title: 'Política de Privacidade (LGPD) | Quero Meu MCMV',
    description: 'Como tratamos seus dados pessoais conforme a LGPD (Lei 13.709/2018).',
    h1: 'Política de Privacidade',
    schemaType: 'WebPage',
    priority: '0.5',
    changefreq: 'monthly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'Política de Privacidade', path: '/politica-de-privacidade' },
    ],
  },
  {
    path: '/termos-de-uso',
    title: 'Termos de Uso | Quero Meu MCMV',
    description: 'Termos e condições de uso do site Quero Meu MCMV.',
    h1: 'Termos de Uso',
    schemaType: 'WebPage',
    priority: '0.5',
    changefreq: 'monthly',
    breadcrumbs: [
      { name: 'Início', path: '/' },
      { name: 'Termos de Uso', path: '/termos-de-uso' },
    ],
  },
  // Non-indexable pages (noindex)
  {
    path: '/obrigado',
    title: 'Recebemos seu interesse! | Quero Meu MCMV',
    description: 'Recebemos seu contato com sucesso. Em breve Joel Marcos entrará em contato com você pelo WhatsApp.',
    h1: 'Recebemos seu interesse! 🏡💚',
    schemaType: 'WebPage',
    noindex: true,
    nofollow: true,
    outputFile: 'obrigado.html',
  },
  {
    path: '/obrigado-imovel',
    title: 'Avaliação de Imóvel Solicitada | Quero Meu MCMV',
    description: 'Sua solicitação de avaliação de imóvel foi recebida com sucesso. Retornaremos em breve.',
    h1: 'Avaliação de Imóvel Solicitada',
    schemaType: 'WebPage',
    noindex: true,
    nofollow: true,
    outputFile: 'obrigado-imovel.html',
  },
  {
    path: '/obrigado.imoveis',
    title: 'Avaliação de Imóvel Solicitada | Quero Meu MCMV',
    description: 'Sua solicitação de avaliação de imóvel foi recebida com sucesso. Retornaremos em breve.',
    h1: 'Avaliação de Imóvel Solicitada',
    schemaType: 'WebPage',
    noindex: true,
    nofollow: true,
    outputFile: 'obrigado.imoveis.html',
  },
  {
    path: '/404',
    title: 'Página Não Encontrada | Quero Meu MCMV',
    description: 'A página que você está procurando não existe ou foi movida. Conheça as opções do Minha Casa Minha Vida.',
    h1: 'Página não encontrada',
    schemaType: 'WebPage',
    noindex: true,
    outputFile: '404.html',
  },
];

/**
 * Builds the Schema.org JSON-LD @graph for a route according to FASE 5
 */
export function buildSchemaGraph(route: SeoRoute): object {
  const graph: any[] = [
    {
      '@type': 'WebSite',
      '@id': `${CANONICAL_DOMAIN}/#website`,
      name: 'Quero Meu MCMV',
      url: `${CANONICAL_DOMAIN}/`,
      publisher: {
        '@id': `${CANONICAL_DOMAIN}/#organization`,
      },
    },
    {
      ...BASE_ORGANIZATION_DATA,
    },
    {
      '@type': 'Person',
      '@id': `${CANONICAL_DOMAIN}/#joel-marcos`,
      name: 'Joel Marcos',
      jobTitle: 'Corretor de imóveis especialista em Minha Casa Minha Vida em Itaboraí-RJ',
      description: FRASE_ENTIDADE_OFICIAL,
      worksFor: {
        '@id': `${CANONICAL_DOMAIN}/#organization`,
      },
      workLocation: {
        '@type': 'City',
        name: 'Itaboraí',
        sameAs: 'https://pt.wikipedia.org/wiki/Itabora%C3%AD',
      },
      knowsAbout: BASE_ORGANIZATION_DATA.knowsAbout,
      identifier: {
        '@type': 'PropertyValue',
        name: 'CRECI',
        value: '39.583F',
      },
      url: `${CANONICAL_DOMAIN}/sobre`,
      sameAs: [
        'https://www.instagram.com/queromeumcmv/',
        'https://www.facebook.com/queromeumcmv',
      ],
    },
  ];

  // BreadcrumbList for internal pages (Início > página)
  if (route.breadcrumbs && route.breadcrumbs.length > 0) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: route.breadcrumbs.map((crumb, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: crumb.name,
        item: crumb.path === '/' ? `${CANONICAL_DOMAIN}/` : `${CANONICAL_DOMAIN}${crumb.path}`,
      })),
    });
  }

  // ApartmentComplex for developments (FASE 5.4)
  if (route.development) {
    const dev = route.development;
    const complexObj: any = {
      '@type': 'ApartmentComplex',
      name: dev.name,
      description: route.description,
      address: {
        '@type': 'PostalAddress',
        addressLocality: dev.addressLocality,
        addressRegion: dev.addressRegion,
        addressCountry: 'BR',
        ...(dev.neighborhood ? { streetAddress: dev.neighborhood } : {}),
      },
      image: dev.image,
      numberOfBedrooms: dev.numberOfBedrooms,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'BRL',
        description: dev.commercialCondition,
        ...(dev.priceFrom
          ? {
              price: dev.priceFrom,
              availability: 'https://schema.org/InStock',
              seller: { '@id': `${CANONICAL_DOMAIN}/#organization` },
              priceSpecification: {
                '@type': 'PriceSpecification',
                minPrice: dev.priceFrom,
                priceCurrency: 'BRL',
                description: dev.priceNote || 'Preço a partir de; sujeito a alteração e disponibilidade.',
              },
            }
          : {}),
      },
    };

    if (dev.url) {
      complexObj['@id'] = `${dev.url}#empreendimento`;
      complexObj.url = dev.url;
    }
    if (dev.numberOfUnits) {
      complexObj.numberOfAccommodationUnits = dev.numberOfUnits;
    }
    if (dev.floorSizeMin && dev.floorSizeMax) {
      complexObj.floorSize = {
        '@type': 'QuantitativeValue',
        minValue: dev.floorSizeMin,
        maxValue: dev.floorSizeMax,
        unitCode: 'MTK',
      };
    }

    if (dev.developer) {
      complexObj.builder = {
        '@type': 'Organization',
        name: dev.developer,
      };
    }

    if (dev.amenities && dev.amenities.length > 0) {
      complexObj.amenityFeature = dev.amenities.map((a) => ({
        '@type': 'LocationFeatureSpecification',
        name: a.name,
        value: a.value,
      }));
    }

    graph.push(complexObj);
  }

  // FAQPage: single block for the page if FAQs exist (FASE 5.3)
  if (route.faqs && route.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      '@id': route.path === '/' ? `${CANONICAL_DOMAIN}/#faq` : `${CANONICAL_DOMAIN}${route.path}#faq`,
      mainEntity: route.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}
