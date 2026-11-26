// Dados compartilhados entre a página /niteroi-open-residence e o JSON-LD (src/seo/routes.ts).
// Fonte: book digital oficial "Niterói Open Residencial" da GPCON (julho de 2023), conferido em
// 26/11/2026 — págs. 2 e 8 (fachada e portaria), 4–6 (localização), 10 (ficha técnica), 14–21 (lazer),
// 22–23 (diferenciais), 24 (quadro de áreas), 25–37 (plantas), 39–42 (decorado), 43–45 (memorial
// descritivo), 46 (construtora) e 49 (registro da incorporação).
// Preço inicial e "últimas unidades" informados pelo corretor em 26/11/2026 (o book não traz preço).

export const OPEN_PRECO_A_PARTIR = 287000;
export const OPEN_AVISO_PRECO =
  '*Os valores podem sofrer alterações sem prévio aviso. Consulte a disponibilidade com o corretor.';
export const OPEN_DATA_CONFERENCIA = '26/11/2026';

export const FAQ_OPEN = [
  {
    pergunta: 'Quanto custa um apartamento no Niterói Open Residencial?',
    resposta:
      'As unidades do Niterói Open Residencial partem de R$ 287.000. O valor varia conforme a planta, o andar e a vaga de garagem. Restam as últimas unidades; os valores podem sofrer alterações sem prévio aviso e a disponibilidade deve ser consultada com o corretor.',
  },
  {
    pergunta: 'Onde fica o Niterói Open Residencial?',
    resposta:
      'Na Rua Antônio Silva, 7, esquina com a Rua Capitão Dalvo Rabello Sampaio, no Bairro Chic, Fonseca, Niterói (RJ), CEP 24130-175. Segundo a incorporadora, fica a 1 minuto da Alameda São Boaventura, a 5 minutos da Ponte Rio–Niterói, a 10 minutos do Centro de Niterói e a poucos passos do Horto do Fonseca.',
  },
  {
    pergunta: 'Quem é a construtora do Niterói Open Residencial?',
    resposta:
      'A incorporação e a construção são da GPCON Incorporações e Construções Ltda. (GPCON Realizações), empresa fundada em 1985, com certificações ISO 9001 e PBQP-H, segundo o book do empreendimento.',
  },
  {
    pergunta: 'Quais são as plantas do Niterói Open Residencial?',
    resposta:
      'Lofts de 45,10 m² (inclusive 2 adaptados para PcD), apartamentos de 2 quartos de 50,40 m² a 53,50 m², apartamentos de 2 quartos com suíte e varanda gourmet de 54,50 m² e 2 coberturas lineares de 3 quartos, com 142 m² e 144 m², todas em área privativa.',
  },
  {
    pergunta: 'Quais são as áreas de lazer do Niterói Open Residencial?',
    resposta:
      'Piscina com prainha, solarium com churrasqueira, espaço gourmet integrado ao salão de festas, lounge externo, espaço fitness, coworking com sala de reunião, espaço kids, espaço pet shower e bicicletário com tomada para bicicletas elétricas. As áreas comuns têm Wi-Fi e tomadas USB.',
  },
  {
    pergunta: 'O Niterói Open Residencial tem vaga de garagem?',
    resposta:
      'O condomínio tem 39 vagas numeradas e definidas na escritura para 72 unidades. Há unidades com vaga e sem vaga, conforme a coluna; o corretor informa quais das últimas unidades disponíveis têm vaga.',
  },
  {
    pergunta: 'Como funciona o financiamento?',
    resposta:
      'Segundo o book, a obra é financiada com a garantia da Caixa Econômica Federal. O financiamento do comprador é sujeito à análise de crédito, e o FGTS pode ser usado conforme as regras do fundo. O corretor faz a simulação conforme a sua renda.',
  },
  {
    pergunta: 'Posso visitar o apartamento decorado?',
    resposta:
      'O book indica o apartamento decorado na Rua Antônio Silva, 7, no Bairro Chic. Preencha o formulário e o corretor agenda a sua visita, de segunda a sexta, das 9h às 17h.',
  },
  {
    pergunta: 'Como consulto as unidades disponíveis do Niterói Open?',
    resposta:
      'Preencha o formulário desta página. O corretor Joel Marcos (CRECI 39.583F) envia pelo WhatsApp as plantas, as últimas unidades disponíveis e a simulação de financiamento.',
  },
];
