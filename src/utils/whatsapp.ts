export const WHATSAPP_SIMULACAO_URL =
  'https://wa.me/5521965928399?text=Ol%C3%A1%2C%20Joel!%20Vim%20pelo%20site%20e%20quero%20simular%20meu%20Minha%20Casa%20Minha%20Vida.';

export function gerarLinkWhatsApp(nomeDaPagina: string, textoDoBotao: string): string {
  // Retorna a URL canônica solicitada para simulação via WhatsApp
  return WHATSAPP_SIMULACAO_URL;
}
