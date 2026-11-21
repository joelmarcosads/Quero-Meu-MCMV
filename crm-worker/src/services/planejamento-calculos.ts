/**
 * Serviço de cálculos do Módulo Planejamento Anual
 * Market Imobi CRM — feat/market-imobi-crm-staging
 */

// ─── Tipos internos ───────────────────────────────────────────────────────────

export interface ConfigCanal {
  canal_id: string;
  nome: string;
  peso: number;
  nucleo: number;
  mes_entrada_padrao: number;
  tipo_funil: 'leads' | 'social' | 'relacionamento';
  taxa_agenda: number;
  taxa_comparece: number;
  taxa_fecha: number;
  taxa_visita_social: number;
  taxa_fecha_social: number;
  divide_comissao: number;
  pct_divisao: number;
  icone: string;
  acoes: string; // JSON string
}

export interface ConfigCpl {
  id: number;
  faixa: number;
  ticket_ate: number | null;
  cpl_padrao: number;
  fator_metodo: number;
  cpl_com_metodo: number;
}

export interface PlanoAnual {
  id: number;
  usuario_id: number;
  ano_referencia: number;
  ano_base: number;
  tipo_corretor: 'autonomo' | 'imobiliaria';
  comissao_base: number;
  pct_comissao: number;
  ticket_medio: number;
  imoveis_base: number;
  meta_comissao: number;
  status: 'rascunho' | 'ativo' | 'concluido';
}

export interface PlanoCanal {
  id: number;
  plano_id: number;
  canal_id: string;
  ativo: number;
  imoveis_base: number;
  mes_entrada: number;
  meta_mensal_ajustada: number | null;
}

export interface ProgressoMes {
  mes: number;
  leads_recebidos: number;
  visitas_realizadas: number;
  imoveis_vendidos: number;
  comissao_recebida: number;
}

// ─── Bloco 1: Diagnóstico (Step 1 do wizard) ─────────────────────────────────

export interface DiagnosticoInput {
  comissao_base: number;   // R$ recebido no ano base
  pct_comissao: number;    // % cobrado (ex: 5)
  ticket_medio: number;    // R$ ticket médio
}

export interface DiagnosticoResult {
  imoveis_base: number;    // imóveis vendidos = comissao_base / (pct_comissao/100) / ticket_medio
  vgv_base: number;        // VGV gerado no ano base
}

export function calcDiagnostico(input: DiagnosticoInput): DiagnosticoResult {
  const vgv_base = input.comissao_base / (input.pct_comissao / 100);
  const imoveis_base = vgv_base / input.ticket_medio;
  return {
    imoveis_base: Math.round(imoveis_base * 100) / 100,
    vgv_base: Math.round(vgv_base * 100) / 100,
  };
}

// ─── Bloco 2: Health Score dos canais (Step 2 do wizard) ─────────────────────

export interface HealthScoreResult {
  canais_ativos: number;
  total_canais: number;
  score: number;           // (canais_ativos / 9) × 100
  classificacao: 'Dependente' | 'Em construção' | 'Saudável';
  cor: 'vermelho' | 'amarelo' | 'verde';
}

export function calcHealthScore(canaisAtivos: number): HealthScoreResult {
  const score = Math.round((canaisAtivos / 9) * 100);
  let classificacao: HealthScoreResult['classificacao'];
  let cor: HealthScoreResult['cor'];

  if (score < 34) {
    classificacao = 'Dependente';
    cor = 'vermelho';
  } else if (score < 67) {
    classificacao = 'Em construção';
    cor = 'amarelo';
  } else {
    classificacao = 'Saudável';
    cor = 'verde';
  }

  return { canais_ativos: canaisAtivos, total_canais: 9, score, classificacao, cor };
}

// ─── Bloco 3: Meta anual (Step 3 do wizard) ──────────────────────────────────

export interface MetaInput {
  meta_comissao: number;
  pct_comissao: number;
  ticket_medio: number;
  comissao_base: number;
}

export interface MetaResult {
  vgv_necessario: number;
  imoveis_meta_ano: number;         // ceil(vgv / ticket)
  crescimento_pct: number;          // ((meta - base) / base) × 100
  imoveis_adicionais: number;       // imoveis_meta - imoveis_base
}

export function calcMeta(input: MetaInput, imoveis_base: number): MetaResult {
  const vgv_necessario = input.meta_comissao / (input.pct_comissao / 100);
  const imoveis_meta_ano = Math.ceil(vgv_necessario / input.ticket_medio);
  const crescimento_pct =
    Math.round(((input.meta_comissao - input.comissao_base) / input.comissao_base) * 10000) / 100;
  const imoveis_adicionais = imoveis_meta_ano - imoveis_base;

  return {
    vgv_necessario: Math.round(vgv_necessario * 100) / 100,
    imoveis_meta_ano,
    crescimento_pct,
    imoveis_adicionais,
  };
}

// ─── Bloco 4: Distribuição por canal ─────────────────────────────────────────

export interface CanalDistribuicaoInput {
  canal_id: string;
  ativo: number;
  imoveis_base: number;
  mes_entrada: number;
  peso: number;
  meta_mensal_ajustada: number | null;
}

export interface CanalDistribuicaoResult {
  canal_id: string;
  imoveis_meta_canal: number;
  meta_mensal: number;    // imoveis_meta_canal / meses_ativos
  meses_ativos: number;   // 13 - mes_entrada
  peso_relativo: number;  // peso / soma(pesos_ativos)
}

export function calcDistribuicaoCanais(
  canais: CanalDistribuicaoInput[],
  imoveis_meta_ano: number,
  imoveis_base_total: number,
): CanalDistribuicaoResult[] {
  const canaisAtivos = canais.filter(c => c.ativo === 1);
  const somaPesos = canaisAtivos.reduce((s, c) => s + c.peso, 0);
  const imoveis_adicionais = imoveis_meta_ano - imoveis_base_total;

  return canais.map(canal => {
    const meses_ativos = Math.max(1, 13 - canal.mes_entrada);

    if (canal.ativo !== 1) {
      return {
        canal_id: canal.canal_id,
        imoveis_meta_canal: canal.imoveis_base,
        meta_mensal: canal.meta_mensal_ajustada ?? Math.round((canal.imoveis_base / 12) * 100) / 100,
        meses_ativos,
        peso_relativo: 0,
      };
    }

    const peso_relativo = somaPesos > 0 ? canal.peso / somaPesos : 0;
    const imoveis_adicionais_canal = imoveis_adicionais * peso_relativo;
    const imoveis_meta_canal =
      Math.round((canal.imoveis_base + imoveis_adicionais_canal) * 100) / 100;

    const meta_mensal =
      canal.meta_mensal_ajustada !== null
        ? canal.meta_mensal_ajustada
        : Math.round((imoveis_meta_canal / meses_ativos) * 100) / 100;

    return { canal_id: canal.canal_id, imoveis_meta_canal, meta_mensal, meses_ativos, peso_relativo };
  });
}

// ─── Bloco 5: Funil por canal (leads necessários / mês) ──────────────────────

export interface FunilResult {
  canal_id: string;
  tipo_funil: string;
  vendas_mes: number;
  leads_necessarios_mes: number | null;   // null se canal de relacionamento puro
  contatos_necessarios_mes: number | null;
}

export function calcFunilCanal(
  canal: ConfigCanal,
  meta_mensal: number,
): FunilResult {
  if (canal.tipo_funil === 'leads') {
    // leads_mes = vendas / taxa_agenda / taxa_comparece / taxa_fecha
    const leads =
      canal.taxa_agenda > 0 && canal.taxa_comparece > 0 && canal.taxa_fecha > 0
        ? Math.ceil(meta_mensal / canal.taxa_agenda / canal.taxa_comparece / canal.taxa_fecha)
        : null;
    return {
      canal_id: canal.canal_id,
      tipo_funil: canal.tipo_funil,
      vendas_mes: meta_mensal,
      leads_necessarios_mes: leads,
      contatos_necessarios_mes: null,
    };
  }

  if (canal.tipo_funil === 'social') {
    // contatos_mes = vendas / taxa_visita_social / taxa_fecha_social
    const contatos =
      canal.taxa_visita_social > 0 && canal.taxa_fecha_social > 0
        ? Math.ceil(meta_mensal / canal.taxa_visita_social / canal.taxa_fecha_social)
        : null;
    return {
      canal_id: canal.canal_id,
      tipo_funil: canal.tipo_funil,
      vendas_mes: meta_mensal,
      leads_necessarios_mes: null,
      contatos_necessarios_mes: contatos,
    };
  }

  // relacionamento — sem funil de leads/contatos explícito
  return {
    canal_id: canal.canal_id,
    tipo_funil: canal.tipo_funil,
    vendas_mes: meta_mensal,
    leads_necessarios_mes: null,
    contatos_necessarios_mes: null,
  };
}

// ─── Bloco 6: Investimento estimado (tráfego pago) ───────────────────────────

export interface InvestimentoResult {
  cpl_usado: number;
  investimento_mes: number;
  faixa_ticket: number;
}

export function calcInvestimentoMes(
  leads_necessarios_mes: number,
  ticket_medio: number,
  configCpls: ConfigCpl[],
  usar_cpl_metodo = true,
): InvestimentoResult {
  const faixa = configCpls.find(c => c.ticket_ate === null || ticket_medio <= c.ticket_ate);
  if (!faixa) {
    return { cpl_usado: 0, investimento_mes: 0, faixa_ticket: 0 };
  }
  const cpl_usado = usar_cpl_metodo ? faixa.cpl_com_metodo : faixa.cpl_padrao;
  const investimento_mes = Math.round(leads_necessarios_mes * cpl_usado * 100) / 100;
  return { cpl_usado, investimento_mes, faixa_ticket: faixa.faixa };
}

// ─── Bloco 7: Progresso realizado vs meta ────────────────────────────────────

export interface ProgressoResult {
  mes: number;
  meta_imoveis: number;
  realizado_imoveis: number;
  pct_atingimento: number;
  meta_comissao_mes: number;
  realizado_comissao: number;
  status: 'acima' | 'dentro' | 'abaixo';
}

export function calcProgressoMes(
  meta_mensal: number,
  pct_comissao: number,
  ticket_medio: number,
  progresso: ProgressoMes,
): ProgressoResult {
  const meta_comissao_mes = meta_mensal * ticket_medio * (pct_comissao / 100);
  const pct_atingimento =
    meta_mensal > 0
      ? Math.round((progresso.imoveis_vendidos / meta_mensal) * 10000) / 100
      : 0;

  let status: ProgressoResult['status'];
  if (pct_atingimento >= 110) status = 'acima';
  else if (pct_atingimento >= 80) status = 'dentro';
  else status = 'abaixo';

  return {
    mes: progresso.mes,
    meta_imoveis: meta_mensal,
    realizado_imoveis: progresso.imoveis_vendidos,
    pct_atingimento,
    meta_comissao_mes: Math.round(meta_comissao_mes * 100) / 100,
    realizado_comissao: progresso.comissao_recebida,
    status,
  };
}

// ─── Bloco 8: Resumo completo do plano (usado no GET /planejamento/:id) ──────

export interface PlanoResumoResult {
  plano: PlanoAnual;
  diagnostico: DiagnosticoResult;
  health_score: HealthScoreResult;
  meta: MetaResult;
  canais: Array<
    CanalDistribuicaoResult &
    FunilResult & {
      nome: string;
      icone: string;
      ativo: number;
      mes_entrada: number;
      investimento_mes: InvestimentoResult | undefined;
    }
  >;
  investimento_total_mes: number;
}

export function calcPlanoCompleto(
  plano: PlanoAnual,
  planoCanais: PlanoCanal[],
  configCanais: ConfigCanal[],
  configCpls: ConfigCpl[],
): PlanoResumoResult {
  const diagnostico = calcDiagnostico({
    comissao_base: plano.comissao_base,
    pct_comissao: plano.pct_comissao,
    ticket_medio: plano.ticket_medio,
  });

  const canaisAtivos = planoCanais.filter(c => c.ativo === 1).length;
  const health_score = calcHealthScore(canaisAtivos);

  const meta = calcMeta(
    {
      meta_comissao: plano.meta_comissao,
      pct_comissao: plano.pct_comissao,
      ticket_medio: plano.ticket_medio,
      comissao_base: plano.comissao_base,
    },
    diagnostico.imoveis_base,
  );

  // Build input para distribuição
  const distribInput: CanalDistribuicaoInput[] = planoCanais.map(pc => {
    const cfg = configCanais.find(c => c.canal_id === pc.canal_id);
    return {
      canal_id: pc.canal_id,
      ativo: pc.ativo,
      imoveis_base: pc.imoveis_base,
      mes_entrada: pc.mes_entrada,
      peso: cfg?.peso ?? 0,
      meta_mensal_ajustada: pc.meta_mensal_ajustada,
    };
  });

  const imoveis_base_total = planoCanais.reduce((s, c) => s + c.imoveis_base, 0);
  const distribuicao = calcDistribuicaoCanais(distribInput, meta.imoveis_meta_ano, imoveis_base_total);

  let investimento_total_mes = 0;

  const canais = distribuicao.map(d => {
    const pc = planoCanais.find(c => c.canal_id === d.canal_id)!;
    const cfg = configCanais.find(c => c.canal_id === d.canal_id)!;
    const funil = calcFunilCanal(cfg, d.meta_mensal);

    let investimento_mes: InvestimentoResult | undefined;
    if (cfg.canal_id === 'trafego_pago' && funil.leads_necessarios_mes !== null && pc.ativo === 1) {
      investimento_mes = calcInvestimentoMes(
        funil.leads_necessarios_mes,
        plano.ticket_medio,
        configCpls,
      );
      investimento_total_mes += investimento_mes.investimento_mes;
    }

    return {
      ...d,
      ...funil,
      nome: cfg.nome,
      icone: cfg.icone,
      ativo: pc.ativo,
      mes_entrada: pc.mes_entrada,
      investimento_mes,
    };
  });

  return {
    plano,
    diagnostico,
    health_score,
    meta,
    canais,
    investimento_total_mes: Math.round(investimento_total_mes * 100) / 100,
  };
}
