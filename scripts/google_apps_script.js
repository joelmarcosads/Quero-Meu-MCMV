/**
 * Google Apps Script - Receptor do Formulário de Avaliação de Imóvel (Proprietários)
 * 
 * Sequência exata de colunas da planilha configurada:
 * 1. data_hora
 * 2. external_id
 * 3. status
 * 4. nome
 * 5. whatsapp
 * 6. link_whatsapp
 * 7. finalidade
 * 8. tipo
 * 9. metragem
 * 10. quartos
 * 11. suites
 * 12. banheiros
 * 13. vagas
 * 14. diferenciais
 * 15. valor
 * 16. cep
 * 17. rua
 * 18. numero
 * 19. complemento
 * 20. bairro
 * 21. cidade
 * 22. uf
 * 23. referencia
 * 24. estado_imovel
 * 25. situacao
 * 26. autorizacao
 * 27. consentimento_lgpd
 * 28. utm_source
 * 29. utm_medium
 * 30. utm_campaign
 * 31. pagina
 * 
 * ======================================================================================
 * COMO ATUALIZAR NO GOOGLE PLANILHAS (Passo a Passo):
 * 1. Abra a sua planilha de captação no Google Planilhas.
 * 2. Clique no menu superior em: "Extensões" > "Apps Script".
 * 3. Substitua TODO o código do editor por este arquivo completo.
 * 4. Clique em "Salvar" (ícone do disquete ou Ctrl+S).
 * 5. AUTORIZAÇÃO DE E-MAIL (Muito importante):
 *    - Selecione a função "testarGravacao" no menu superior e clique em "Executar".
 *    - O Google solicitará: "Autorização necessária". Clique em "Revisar permissões".
 *    - Escolha a sua conta Google (joelmarcos123@gmail.com).
 *    - Clique em "Avançado" (canto inferior esquerdo) e depois em "Acessar (não seguro)".
 *    - Clique em "Permitir". O e-mail de teste chegará na sua caixa de entrada!
 * 6. Clique no botão azul no canto superior direito: "Implantar" > "Gerenciar implantações".
 * 7. Clique no ícone de lápis (Editar) da sua implantação ativa (Web App).
 * 8. Em "Versão", selecione obrigatoriamente: "Nova versão".
 * 9. Certifique-se de manter:
 *    - Executar como: "Eu (seu e-mail)"
 *    - Quem pode acessar: "Qualquer pessoa" (Anyone)
 * 10. Clique em "Implantar".
 * ======================================================================================
 */

// E-mail do corretor para receber notificações em tempo real
var NOTIFY_EMAIL = 'joelmarcos123@gmail.com';

// Definição das 31 colunas exatas da sua planilha e todos os seus possíveis apelidos/variações
var SEQUENCIA_PLANILHA = [
  { key: 'data_hora', header: 'data_hora', aliases: ['data_hora', 'data hora', 'data/hora', 'data', 'hora', 'timestamp'] },
  { key: 'external_id', header: 'external_id', aliases: ['external_id', 'id_lead', 'id lead', 'lead id', 'id', 'codigo'] },
  { key: 'status', header: 'status', aliases: ['status', 'status do lead', 'situacao do lead', 'fase'] },
  { key: 'nome', header: 'nome', aliases: ['nome', 'nome completo', 'proprietario', 'cliente'] },
  { key: 'whatsapp', header: 'whatsapp', aliases: ['whatsapp', 'telefone', 'celular', 'fone', 'contato', 'tel'] },
  { key: 'link_whatsapp', header: 'link_whatsapp', aliases: ['link_whatsapp', 'link whatsapp', 'whatsapp link', 'link wa', 'conversa whatsapp'] },
  { key: 'finalidade', header: 'finalidade', aliases: ['finalidade', 'objetivo', 'momento', 'momento / objetivo', 'pretensao', 'pretensão', 'objetivo principal'] },
  { key: 'tipo', header: 'tipo', aliases: ['tipo', 'tipo_imovel', 'tipo do imovel', 'tipo do imóvel', 'tipo de imovel', 'tipo de imóvel'] },
  { key: 'metragem', header: 'metragem', aliases: ['metragem', 'area', 'área', 'area (m²)', 'área (m²)', 'm2', 'area privativa'] },
  { key: 'quartos', header: 'quartos', aliases: ['quartos', 'qtd quartos', 'quantidade de quartos', 'dormitorios', 'dormitórios'] },
  { key: 'suites', header: 'suites', aliases: ['suites', 'suítes', 'qtd suites', 'quantidade de suites', 'quantidade de suítes'] },
  { key: 'banheiros', header: 'banheiros', aliases: ['banheiros', 'qtd banheiros', 'quantidade de banheiros'] },
  { key: 'vagas', header: 'vagas', aliases: ['vagas', 'vagas de garagem', 'garagem', 'qtd vagas'] },
  { key: 'diferenciais', header: 'diferenciais', aliases: ['diferenciais', 'diferenciais do imovel', 'comodidades', 'lazer', 'destaques'] },
  { key: 'valor', header: 'valor', aliases: ['valor', 'preco', 'preço', 'valor estimado', 'faixa de valor', 'valor pedido'] },
  { key: 'cep', header: 'cep', aliases: ['cep', 'codigo postal'] },
  { key: 'rua', header: 'rua', aliases: ['rua', 'endereco', 'endereço', 'logradouro', 'endereco do imovel'] },
  { key: 'numero', header: 'numero', aliases: ['numero', 'número', 'num', 'numero / complemento', 'numero/complemento'] },
  { key: 'complemento', header: 'complemento', aliases: ['complemento', 'compl'] },
  { key: 'bairro', header: 'bairro', aliases: ['bairro'] },
  { key: 'cidade', header: 'cidade', aliases: ['cidade', 'municipio', 'município'] },
  { key: 'uf', header: 'uf', aliases: ['uf', 'estado uf', 'sigla estado'] },
  { key: 'referencia', header: 'referencia', aliases: ['referencia', 'referência', 'ponto de referencia', 'ponto de referência', 'referencia da localizacao', 'referência da localização'] },
  { key: 'estado_imovel', header: 'estado_imovel', aliases: ['estado_imovel', 'estado do imovel', 'estado do imóvel', 'estado de conservacao', 'estado de conservação', 'conservacao', 'conservação'] },
  { key: 'situacao', header: 'situacao', aliases: ['situacao', 'situação', 'situacao_imovel', 'situação do imóvel', 'status do imovel', 'ocupado / desocupado', 'ocupado', 'desocupado'] },
  { key: 'autorizacao', header: 'autorizacao', aliases: ['autorizacao', 'autorização', 'autorizacao contato'] },
  { key: 'consentimento_lgpd', header: 'consentimento_lgpd', aliases: ['consentimento_lgpd', 'consentimento lgpd', 'lgpd', 'termo', 'autorizo'] },
  { key: 'utm_source', header: 'utm_source', aliases: ['utm_source', 'origem'] },
  { key: 'utm_medium', header: 'utm_medium', aliases: ['utm_medium', 'midia', 'mídia'] },
  { key: 'utm_campaign', header: 'utm_campaign', aliases: ['utm_campaign', 'campanha'] },
  { key: 'pagina', header: 'pagina', aliases: ['pagina', 'página', 'url', 'pagina de origem'] }
];

function doGet(e) {
  return ContentService.createTextOutput("Receptor do formulário de proprietários ativo e operacional.")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    var p = extrairParametros(e);

    // 1. Proteção contra bots (honeypot)
    if (p.website && p.website.toString().trim() !== '') {
      return respostaJson({ ok: true, descartado: 'honeypot' });
    }

    // 2. Validação básica de contato
    var nome = (p.nome || '').toString().trim();
    var whatsapp = (p.whatsapp || p.whatsapp_raw || '').toString().trim();
    if (!nome || !whatsapp || nome.length < 2 || whatsapp.replace(/\D/g, '').length < 8) {
      return respostaJson({ ok: false, erro: 'dados_obrigatorios_ausentes' });
    }

    // 3. Localização da planilha ativa
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Proprietarios') ||
                ss.getSheetByName('Proprietários') ||
                ss.getSheetByName('Avaliacoes') ||
                ss.getSheetByName('Avaliações') ||
                ss.getSheetByName('Leads') ||
                ss.getActiveSheet();

    // 4. Mapeia e sincroniza colunas da Linha 1
    var headersInfo = sincronizarCabecalhos(sheet);

    // 5. Verificação de duplicidade por external_id (últimas 100 linhas)
    var externalId = (p.external_id || p.id_lead || '').toString().trim();
    if (externalId && sheet.getLastRow() > 1 && headersInfo.indices.external_id !== undefined) {
      var colIdNum = headersInfo.indices.external_id + 1; // 1-based
      var startRow = Math.max(2, sheet.getLastRow() - 100);
      var numRows = sheet.getLastRow() - startRow + 1;
      var ids = sheet.getRange(startRow, colIdNum, numRows, 1).getValues();
      for (var i = 0; i < ids.length; i++) {
        if (ids[i][0] && ids[i][0].toString() === externalId) {
          return respostaJson({ ok: true, duplicado: true });
        }
      }
    }

    // 6. Prepara os valores com suporte total aos nomes de campos informados
    var mapaValores = prepararMapaValores(p, externalId);

    // 7. Monta a linha correspondente exatamente aos cabeçalhos existentes
    var novaLinha = new Array(headersInfo.totalColunas);
    for (var colIdx = 0; colIdx < headersInfo.totalColunas; colIdx++) {
      var chave = headersInfo.mapaColunas[colIdx];
      if (chave && mapaValores[chave] !== undefined) {
        novaLinha[colIdx] = mapaValores[chave];
      } else {
        novaLinha[colIdx] = '';
      }
    }

    // 8. Grava a linha na planilha
    sheet.appendRow(novaLinha);

    // 9. Envia notificação por e-mail para o corretor
    avisar_(mapaValores);

    return respostaJson({ ok: true, mensagem: 'lead_gravado_com_sucesso' });
  } catch (err) {
    return respostaJson({ ok: false, erro: err.toString() });
  }
}

/**
 * Extrai todos os parâmetros enviados via URLSearchParams, Form URL-encoded ou JSON
 */
function extrairParametros(e) {
  var p = {};
  if (!e) return p;

  if (e.parameter) {
    for (var k in e.parameter) {
      p[k] = e.parameter[k];
    }
  }

  if (e.postData && e.postData.contents) {
    var raw = e.postData.contents;
    try {
      var json = JSON.parse(raw);
      if (json && typeof json === 'object') {
        for (var jk in json) {
          if (p[jk] === undefined || p[jk] === '') {
            p[jk] = json[jk];
          }
        }
      }
    } catch (_) {
      if (typeof raw === 'string' && raw.indexOf('=') !== -1) {
        var pairs = raw.split('&');
        for (var i = 0; i < pairs.length; i++) {
          var pair = pairs[i];
          var eqIdx = pair.indexOf('=');
          if (eqIdx !== -1) {
            var chaveDec = decodeURIComponent(pair.substring(0, eqIdx).replace(/\+/g, ' '));
            var valorDec = decodeURIComponent(pair.substring(eqIdx + 1).replace(/\+/g, ' '));
            if (p[chaveDec] === undefined || p[chaveDec] === '') {
              p[chaveDec] = valorDec;
            }
          }
        }
      }
    }
  }

  return p;
}

/**
 * Remove acentos, pontuações (; , - _) e normaliza para minúsculas
 */
function normalizarTexto(txt) {
  if (!txt) return '';
  return txt.toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .trim().replace(/\s+/g, ' ');
}

/**
 * Identifica a chave padrão correspondente a partir do texto do cabeçalho
 */
function identificarChaveColuna(headerTexto) {
  var norm = normalizarTexto(headerTexto);
  if (!norm) return null;

  // 1. Prioridade: Comparação exata com os aliases
  for (var i = 0; i < SEQUENCIA_PLANILHA.length; i++) {
    var col = SEQUENCIA_PLANILHA[i];
    for (var a = 0; a < col.aliases.length; a++) {
      var aliasNorm = normalizarTexto(col.aliases[a]);
      if (norm === aliasNorm) {
        return col.key;
      }
    }
  }

  // 2. Fallback: Comparação por inclusão (evita conflitos entre 'uf' e 'estado_imovel')
  for (var j = 0; j < SEQUENCIA_PLANILHA.length; j++) {
    var item = SEQUENCIA_PLANILHA[j];
    if (item.key === 'uf' && norm !== 'uf') continue; // UF exige correspondência exata
    for (var b = 0; b < item.aliases.length; b++) {
      var aNorm = normalizarTexto(item.aliases[b]);
      if (norm.indexOf(aNorm) !== -1 || aNorm.indexOf(norm) !== -1) {
        return item.key;
      }
    }
  }

  return null;
}

/**
 * Sincroniza os cabeçalhos da Linha 1. Se estiver vazia, cria a sequência de 31 colunas.
 * Se já tiver colunas, mapeia cada uma pelo nome do cabeçalho.
 */
function sincronizarCabecalhos(sheet) {
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();

  // Caso 1: Planilha vazia (cria todas as 31 colunas exatamente na ordem da sua planilha)
  if (lastRow === 0 || lastCol === 0) {
    var cabecalhosExatos = SEQUENCIA_PLANILHA.map(function(c) { return c.header; });
    sheet.appendRow(cabecalhosExatos);
    sheet.setFrozenRows(1);
    var rangeNovo = sheet.getRange(1, 1, 1, cabecalhosExatos.length);
    rangeNovo.setFontWeight('bold');
    rangeNovo.setBackground('#F5EFEB');
    lastCol = cabecalhosExatos.length;
  }

  // Lê os cabeçalhos atuais da Linha 1
  var headersRow = sheet.getRange(1, 1, 1, Math.max(lastCol, 1)).getValues()[0];

  var indicesPorChave = {};
  var mapaColunasPorIndice = {};

  for (var c = 0; c < headersRow.length; c++) {
    var txt = headersRow[c];
    var chave = identificarChaveColuna(txt);
    if (chave) {
      if (indicesPorChave[chave] === undefined) {
        indicesPorChave[chave] = c;
      }
      mapaColunasPorIndice[c] = chave;
    }
  }

  // Auto-correção: se faltar alguma das colunas principais (tipo, metragem, rua, situacao), adiciona
  var colunasFaltantes = [];
  for (var i = 0; i < SEQUENCIA_PLANILHA.length; i++) {
    var colPadrao = SEQUENCIA_PLANILHA[i];
    if (indicesPorChave[colPadrao.key] === undefined) {
      colunasFaltantes.push(colPadrao);
    }
  }

  if (colunasFaltantes.length > 0) {
    var colInicio = headersRow.length + 1;
    for (var f = 0; f < colunasFaltantes.length; f++) {
      var missing = colunasFaltantes[f];
      var idxNovo = headersRow.length;
      var cell = sheet.getRange(1, colInicio + f);
      cell.setValue(missing.header);
      cell.setFontWeight('bold');
      indicesPorChave[missing.key] = idxNovo;
      mapaColunasPorIndice[idxNovo] = missing.key;
      headersRow.push(missing.header);
    }
  }

  return {
    totalColunas: headersRow.length,
    indices: indicesPorChave,
    mapaColunas: mapaColunasPorIndice
  };
}

/**
 * Formata telefone brasileiro com apóstrofo para evitar notação científica no Google Sheets
 */
function formatarTelefone(tel) {
  if (!tel) return '';
  var limpo = tel.toString().replace(/\D/g, '');
  if (limpo.length === 11) {
    return "'" + '(' + limpo.substring(0, 2) + ') ' + limpo.substring(2, 7) + '-' + limpo.substring(7);
  }
  if (limpo.length === 10) {
    return "'" + '(' + limpo.substring(0, 2) + ') ' + limpo.substring(2, 6) + '-' + limpo.substring(6);
  }
  return "'" + tel.toString().trim();
}

/**
 * Prepara o objeto de dados limpo com suporte aos campos solicitados:
 * Tipo, Metragem, Rua, Situação, Finalidade, Link WhatsApp, etc.
 */
function prepararMapaValores(p, externalId) {
  var agora = new Date();

  // 1. Tipo do Imóvel (suporta tipo, tipo_imovel)
  var tipoFinal = (p.tipo || p.tipo_imovel || '').toString().trim();

  // 2. Metragem / Área (suporta metragem, area, area_privativa)
  var metragemFinal = (p.metragem || p.area || '').toString().trim();

  // 3. Rua / Endereço (suporta rua, endereco, logradouro)
  var ruaFinal = (p.rua || p.endereco || '').toString().trim();

  // 4. Situação do Imóvel: Ocupado / Desocupado (suporta situacao, situacao_imovel)
  var situacaoFinal = (p.situacao || p.situacao_imovel || '').toString().trim();

  // 5. Finalidade / Momento (suporta finalidade, objetivo)
  var finalidadeFinal = (p.finalidade || p.objetivo || '').toString().trim();

  // Diferenciais combinados
  var listaDif = [];
  if (p.diferenciais) {
    listaDif.push(p.diferenciais.toString().trim());
  }
  if (p.outros_diferenciais && p.outros_diferenciais.toString().trim() !== '') {
    var outro = p.outros_diferenciais.toString().trim();
    if (listaDif.indexOf(outro) === -1) {
      listaDif.push(outro);
    }
  }
  var diferenciaisFinal = listaDif.join(', ');

  // Link direto para falar com o proprietário no WhatsApp com um clique na planilha
  var telLimpo = (p.whatsapp || p.whatsapp_raw || '').toString().replace(/\D/g, '');
  var nomeCliente = (p.nome || '').toString().trim();
  var linkWhatsapp = '';
  if (telLimpo) {
    var waMsg = 'Olá ' + nomeCliente + '! Sou o Joel Marcos, Corretor de Imóveis. Recebi os dados do seu imóvel (' + tipoFinal + ') para avaliação.';
    linkWhatsapp = 'https://wa.me/55' + telLimpo + '?text=' + encodeURIComponent(waMsg);
  } else if (p.link_whatsapp) {
    linkWhatsapp = p.link_whatsapp.toString().trim();
  }

  return {
    data_hora: agora,
    external_id: externalId,
    status: (p.status || 'Novo Lead').toString().trim(),
    nome: nomeCliente,
    whatsapp: formatarTelefone(p.whatsapp || p.whatsapp_raw),
    link_whatsapp: linkWhatsapp,
    finalidade: finalidadeFinal,
    tipo: tipoFinal,
    metragem: metragemFinal,
    quartos: (p.quartos || '').toString().trim(),
    suites: (p.suites || '').toString().trim(),
    banheiros: (p.banheiros || '').toString().trim(),
    vagas: (p.vagas || '').toString().trim(),
    diferenciais: diferenciaisFinal,
    valor: (p.valor || 'Sob consulta').toString().trim(),
    cep: (p.cep || '').toString().trim(),
    rua: ruaFinal,
    numero: (p.numero || '').toString().trim(),
    complemento: (p.complemento || '').toString().trim(),
    bairro: (p.bairro || '').toString().trim(),
    cidade: (p.cidade || '').toString().trim(),
    uf: (p.uf || 'RJ').toString().trim(),
    referencia: (p.referencia || '').toString().trim(),
    estado_imovel: (p.estado_imovel || '').toString().trim(),
    situacao: situacaoFinal,
    autorizacao: (p.autorizacao || 'Sim').toString().trim(),
    consentimento_lgpd: (p.consentimento_lgpd || 'Sim').toString().trim(),
    utm_source: (p.utm_source || '').toString().trim(),
    utm_medium: (p.utm_medium || '').toString().trim(),
    utm_campaign: (p.utm_campaign || '').toString().trim(),
    pagina: (p.pagina || '').toString().trim()
  };
}

function respostaJson(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Envia notificação por e-mail para o corretor imediatamente a cada novo imóvel cadastrado
 */
function avisar_(d) {
  if (!NOTIFY_EMAIL) return;
  try {
    MailApp.sendEmail(
      NOTIFY_EMAIL,
      'Novo imóvel cadastrado: ' + d.tipo + ' em ' + d.bairro + ' (' + d.finalidade + ')',
      'Nome: ' + d.nome + '\nWhatsApp: ' + d.link_whatsapp + '\nFinalidade: ' + d.finalidade +
      '\nImóvel: ' + d.tipo + ', ' + d.metragem + ' m², ' + d.bairro + ' - ' + d.cidade +
      '\nSituação: ' + d.situacao + '\nStatus: ' + d.status
    );
  } catch (err) {
    Logger.log('Erro ao enviar e-mail: ' + err.toString());
  }
}

/**
 * Função de Teste Local:
 * Selecione "testarGravacao" no editor do Google Apps Script e clique em "Executar".
 * Todas as 31 colunas (incluindo Tipo, Metragem, Rua e Situação) serão gravadas!
 */
function testarGravacao() {
  var mockEvent = {
    parameter: {
      formulario: 'proprietario',
      form_tipo: 'avaliacao_proprietario',
      external_id: 'teste-' + new Date().getTime(),
      status: 'Novo Lead',
      nome: 'Teste Joel Marcos Corretor',
      whatsapp: '(21) 96592-8399',
      whatsapp_raw: '21965928399',
      finalidade: 'Quero vender agora',
      tipo: 'Apartamento',
      tipo_imovel: 'Apartamento',
      metragem: '75 m²',
      area: '75 m²',
      quartos: '2 quartos',
      suites: '1 suíte',
      banheiros: '2 banheiros',
      vagas: '1 vaga',
      diferenciais: 'Piscina, Varanda / Sacada',
      outros_diferenciais: 'Armários planejados',
      valor: 'Sob consulta',
      cep: '24813-066',
      rua: 'Rua H',
      endereco: 'Rua H',
      numero: '492',
      complemento: 'Apto 101',
      bairro: 'Retiro São Joaquim',
      cidade: 'Itaboraí',
      uf: 'RJ',
      referencia: 'Próximo à Praça Principal',
      estado_imovel: 'Reformado',
      situacao: 'Desocupado',
      situacao_imovel: 'Desocupado',
      autorizacao: 'Sim',
      consentimento_lgpd: 'Sim',
      utm_source: 'teste_apps_script',
      utm_medium: 'editor',
      utm_campaign: 'teste_31_colunas',
      pagina: 'https://queromeumcmv.com.br/'
    }
  };

  var resultado = doPost(mockEvent);
  Logger.log(resultado.getContent());
  return resultado.getContent();
}
