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
  openingHours: 'Mo-Sa 08:00-20:00',
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
  ],
};

export const ROUTES: SeoRoute[] = [
  {
    path: '/',
    title: 'Minha Casa Minha Vida em Itaboraí-RJ | Quero Meu MCMV',
    description: 'Joel Marcos, corretor especialista em Minha Casa Minha Vida em Itaboraí-RJ. Atende também São Gonçalo, Niterói e Maricá. Sinal a partir de R$ 500.',
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
    title: 'Minha Casa Minha Vida em Itaboraí: Apartamentos 2026',
    description: 'Apartamentos MCMV em Itaboraí com corretor especialista local. Sinal a partir de R$ 1.000, condomínio fechado e lazer. Veja e simule.',
    h1: 'Minha Casa Minha Vida em Itaboraí - RJ',
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
        answer: 'A entrada varia de acordo com a aprovação de crédito da Caixa, o valor do imóvel e o subsídio concedido. Em alguns lançamentos, é possível dar um sinal a partir de R$ 500 ou R$ 1.000 e parcelar o restante da entrada direto com a construtora.',
      },
    ],
  },
  {
    path: '/minha-casa-minha-vida-sao-goncalo',
    title: 'Minha Casa Minha Vida em São Gonçalo: Apartamentos 2026',
    description: 'Apartamentos MCMV em São Gonçalo, perto da Universo e com entrada facilitada. Atendimento com corretor CRECI. Simule seu financiamento.',
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
    path: '/financiamento-minha-casa-minha-vida',
    title: 'Financiamento Minha Casa Minha Vida: Como Funciona em 2026',
    description: 'Entenda como funciona o financiamento MCMV pela Caixa: juros, prazo, entrada, uso do FGTS e composição de renda. Simule grátis.',
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
    title: 'Subsídio Minha Casa Minha Vida 2026: Quanto Você Recebe',
    description: 'Saiba quem tem direito ao subsídio do MCMV, como é calculado e quanto pode chegar a receber em Itaboraí e região.',
    h1: 'O que é o Subsídio do Minha Casa Minha Vida?',
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
    title: 'Como Usar o FGTS no Minha Casa Minha Vida',
    description: 'Veja como usar o saldo do FGTS na entrada e nas parcelas do MCMV, quais as regras e quem pode usar.',
    h1: 'Como usar o FGTS no Minha Casa Minha Vida',
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
    title: 'Faixas de Renda do Minha Casa Minha Vida 2026',
    description: 'Confira as faixas 1, 2, 3 e 4 do MCMV em 2026, o limite de renda e o valor máximo do imóvel em cada uma.',
    h1: 'A Renda no Minha Casa Minha Vida',
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
    title: 'Documentos para o Minha Casa Minha Vida (Caixa)',
    description: 'Lista completa de documentos para financiar pelo MCMV na Caixa: CLT, autônomo, MEI e composição de renda.',
    h1: 'Documentos necessários para o Financiamento',
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
    title: 'Joel Marcos, Corretor MCMV em Itaboraí | CRECI 39.583F',
    description: 'Joel Marcos é corretor de imóveis especialista no Minha Casa Minha Vida em Itaboraí-RJ, com atendimento em São Gonçalo, Niterói e Maricá.',
    h1: 'Joel Marcos, Corretor Especialista em Minha Casa Minha Vida em Itaboraí',
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
    title: 'Reserva dos Pássaros 2, Itaboraí: MCMV 2 Quartos',
    description: 'Apartamentos de 2 quartos com vaga no Reserva dos Pássaros 2, em Itaboraí. Sinal de R$ 1.000 e parcelas a partir de R$ 650.',
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
      commercialCondition: 'Sinal a partir de R$ 1.000, parcelas a partir de R$ 650 e subsídio de até R$ 55 mil Caixa',
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
    title: 'Prime Club Itaboraí: Apartamentos MCMV 2 Quartos',
    description: 'Prime Club Itaboraí: 2 quartos, vaga, condomínio fechado e lazer completo. Entrada facilitada em até 72x. Simule.',
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
      commercialCondition: 'Sinal a partir de R$ 1.000, entrada facilitada em até 72x e subsídio de até R$ 55 mil Caixa',
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
    title: 'Flores de Maio, Santo Expedito, Itaboraí: MCMV',
    description: 'Flores de Maio, a 5 min do centro de Itaboraí: 2 quartos, vaga e lazer. Sinal a partir de R$ 1.000 + subsídio.',
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
      commercialCondition: 'Sinal a partir de R$ 1.000 com subsídio de até R$ 55 mil Caixa',
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
    title: 'Residencial Florescer, Vila Iara, São Gonçalo',
    description: 'Lançamento em Vila Iara, São Gonçalo: 2 e 3 quartos com suíte, 1 ou 2 vagas, condomínio fechado e lazer completo.',
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
    title: 'Solar da Trindade, São Gonçalo: MCMV perto da Universo',
    description: 'A 300 m da Universo: 2 quartos com vaga no Solar da Trindade. Sinal a partir de R$ 500 e entrada em até 100x.',
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
      commercialCondition: 'Sinal a partir de R$ 500 e entrada parcelada em até 100x com subsídio Caixa',
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
        answer: 'O financiamento é facilitado pela Caixa no Minha Casa Minha Vida, com sinal a partir de R$ 500 e entrada parcelada em até 100x.',
      },
      {
        question: 'Quem é a construtora responsável?',
        answer: 'O empreendimento é realizado pela Tenda.',
      },
    ],
  },
  {
    path: '/conquista-oceanica',
    title: 'Conquista Oceânica, Maricá: Lançamento MCMV',
    description: 'Lançamento MCMV em Maricá: 1 e 2 quartos, vaga, condomínio fechado e lazer. Sinal a partir de R$ 1.000.',
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
      commercialCondition: 'Sinal a partir de R$ 1.000 e financiamento pelo Minha Casa Minha Vida',
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
        answer: 'O imóvel pode ser financiado pelo programa Minha Casa Minha Vida, permitindo uso do FGTS e sinal facilitado.',
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
      },
    };

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
