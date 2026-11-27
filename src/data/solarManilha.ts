/**
 * Solar Manilha — dados comerciais e de SEO
 * Fonte: material comercial da incorporadora / conferência do corretor
 * Data de conferência: 2026-11-27
 * Autor: Market Local Digital
 */

export interface FaqItaborai {
  pergunta: string;
  resposta: string;
}

export const SOLAR_MANILHA_PRECO_A_PARTIR = 180000; // R$ 180.000 — confirmar com incorporadora
export const SOLAR_MANILHA_AVISO_PRECO =
  'Preço inicial sujeito a confirmação; consulte disponibilidade e condições com o corretor. Valor de referência para fins de simulação.';

export const FAQ_SOLAR_MANILHA: FaqItaborai[] = [
  {
    pergunta: 'O Solar Manilha é pelo Minha Casa Minha Vida?',
    resposta:
      'Sim. O Solar Manilha é enquadrado no programa Minha Casa Minha Vida, com financiamento pela Caixa Econômica Federal. Dependendo da renda familiar, é possível obter subsídio de até R$ 55 mil e taxas de juros reduzidas.',
  },
  {
    pergunta: 'Onde fica o Solar Manilha em Itaboraí?',
    resposta:
      'O Solar Manilha está localizado em Manilha, Itaboraí-RJ, bairro com boa infraestrutura comercial, próximo a escolas, supermercados e com acesso facilitado à BR-493 (Arco Metropolitano) e à RJ-116.',
  },
  {
    pergunta: 'Quais são as tipologias do Solar Manilha?',
    resposta:
      'O empreendimento oferece apartamentos de 2 quartos em condomínio fechado com área de lazer. Consulte o corretor para verificar disponibilidade de plantas específicas, metragens e unidades com vaga.',
  },
  {
    pergunta: 'Posso usar FGTS na compra do Solar Manilha?',
    resposta:
      'Sim. O saldo do FGTS pode ser utilizado como parte da entrada ou para reduzir as parcelas mensais, desde que você tenha pelo menos 3 anos de trabalho sob regime do FGTS, somando todos os períodos.',
  },
];
