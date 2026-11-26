// Dados compartilhados entre a página /sun-in-studio-design-niteroi e o JSON-LD (src/seo/routes.ts).
// Fonte: apresentação oficial "Sun In Studio Design" da RDR Engenharia (SUN-0015-25, meeting
// investidor), conferida em 26/11/2026 — págs. 1 (marca), 5–7 (localização e informações gerais),
// 8–24 (lazer e studio decorado), 26–35 (plantas e implantações), 36 (Niterói) e 47–48
// (condições comerciais e financiamento CAIXA). Projeções de rentabilidade da apresentação
// (págs. 38–45) NÃO são usadas na página.
//
// PREÇO: "a partir de R$ 295.000" confirmado pelo corretor em 26/11/2026. Os R$ 220.000 usados
// nas análises da apresentação (págs. 42–45) eram o preço de lançamento, já desatualizado.
export const SUNIN_PRECO_A_PARTIR: number | null = 295000;
export const SUNIN_AVISO_PRECO =
  '*Os valores podem sofrer alterações sem prévio aviso. Consulte a disponibilidade com o corretor.';
export const SUNIN_DATA_CONFERENCIA = '26/11/2026';

const formatarPreco = (v: number) => `R$ ${v.toLocaleString('pt-BR')}`;

const respostaPreco = () =>
  SUNIN_PRECO_A_PARTIR
    ? `Os studios do Sun In Studio Design partem de ${formatarPreco(SUNIN_PRECO_A_PARTIR)}. O valor de cada unidade varia conforme a planta, o andar e a posição. Os valores podem sofrer alterações sem prévio aviso; consulte a disponibilidade com o corretor.`
    : 'O valor de cada studio varia conforme a planta, o andar e a posição. Preencha o formulário desta página para receber a tabela atualizada e as unidades disponíveis com o corretor.';

export const FAQ_SUNIN = [
  {
    pergunta: 'Quanto custa um studio no Sun In Studio Design, em Niterói?',
    resposta: respostaPreco(),
  },
  {
    pergunta: 'Onde fica o Sun In Studio Design?',
    resposta:
      'Na Rua São Sebastião, no Centro de Niterói (RJ), a poucos passos da UFF (Campus Valonguinho) e do Plaza Shopping. Segundo a incorporadora, o Terminal das Barcas fica a 5 minutos e a Praia das Flechas, a 3 minutos de bicicleta.',
  },
  {
    pergunta: 'Quem é a incorporadora do Sun In Studio Design?',
    resposta:
      'O Sun In Studio Design é da RDR Engenharia, com financiamento pela CAIXA, sujeito à análise de crédito.',
  },
  {
    pergunta: 'Quais são as plantas e metragens dos studios?',
    resposta:
      'Todas as unidades são studios, de 24,03 m² a 30,32 m²: finais 01 a 04 e 11 a 14 a partir de 24,21 m², finais 05 e 06 a partir de 24,03 m², finais 07 e 08 a partir de 24,80 m² e finais 09 e 10 a partir de 30,32 m².',
  },
  {
    pergunta: 'Quais são as áreas de lazer do Sun In?',
    resposta:
      'No rooftop: piscina, deck, sky bar, academia, spa, sauna, espaço coliving e gourmet interno. No térreo: praça, pet place, coworking, sala de reunião, minimercado, lavanderia, espaço delivery e bicicletário.',
  },
  {
    pergunta: 'O Sun In Studio Design tem vaga de garagem?',
    resposta:
      'O empreendimento tem 42 vagas de garagem para 209 studios, além de 209 vagas para bicicletas. A maioria das unidades não tem vaga de carro; consulte o corretor sobre a disponibilidade.',
  },
  {
    pergunta: 'Vale a pena comprar um studio no Sun In para investir?',
    resposta:
      'A apresentação da incorporadora destaca a localização perto da UFF, do Plaza Shopping e das barcas e o potencial de locação para turistas. Rentabilidade não é garantida e depende de ocupação, diárias e custos; o corretor apresenta o estudo de mercado da incorporadora para você avaliar.',
  },
  {
    pergunta: 'Como funcionam as condições de compra?',
    resposta:
      'Segundo a incorporadora, há compra direta, com saldo em até 30 parcelas, e compra financiada pela CAIXA, com parcelas durante a obra em até 36 vezes. O corretor detalha as condições vigentes e faz a simulação.',
  },
  {
    pergunta: 'Como consulto os studios disponíveis?',
    resposta:
      'Preencha o formulário desta página. O corretor Joel Marcos (CRECI 39.583F) envia as plantas, as unidades disponíveis e as condições pelo WhatsApp, de segunda a sexta, das 9h às 17h.',
  },
];
