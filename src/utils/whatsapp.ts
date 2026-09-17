export function gerarLinkWhatsApp(nomeDaPagina: string, textoDoBotao: string): string {
  const numero = "5521965928399";
  let mensagem = "";
  
  const textoBotaoLower = textoDoBotao.toLowerCase();

  if (textoBotaoLower.includes("simulação") || textoBotaoLower.includes("simular")) {
    mensagem = `Olá! Vi o *${nomeDaPagina}* no site e gostaria de fazer uma simulação de financiamento para ele. 🏦\nVocês conseguem me ajudar a ver os prazos e as condições de entrada?`;
  } 
  else if (textoBotaoLower.includes("agora") || textoBotaoLower.includes("rápida")) {
    mensagem = `Olá, tudo bem? Gostei muito do *${nomeDaPagina}* e quero simular as parcelas dele agora. 🏠💨\nQuais dados vocês precisam para fazer esse cálculo rápido para mim?`;
  } 
  else if (textoBotaoLower.includes("disponibilidade") || textoBotaoLower.includes("valores") || textoBotaoLower.includes("consultar")) {
    mensagem = `Olá! Tenho interesse no *${nomeDaPagina}*. 🗺️\nGostaria de consultar os valores atuais e saber se ele ainda está disponível. Como posso receber a tabela?`;
  } 
  else {
    // Fallback genérico seguindo a sua estrutura
    mensagem = `Olá! Estava navegando nas informações sobre *${nomeDaPagina}* e me interessei pela opção "${textoDoBotao}". 🏠\nPoderiam me dar mais detalhes sobre isso?`;
  }
  
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}
