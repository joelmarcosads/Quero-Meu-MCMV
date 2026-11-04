/**
 * routes/dashboard.ts
 *
 * GET /api/v1/dashboard/stats → indicadores consolidados (admin/assistente)
 */

import type { Env, AuthenticatedUser } from '../types';
import { jsonOk } from '../utils';

export async function handleDashboard(
  _request: Request,
  env: Env,
  _user: AuthenticatedUser,
  pathParts: string[],
): Promise<Response> {
  const sub = pathParts[4]; // /api/v1/dashboard/stats

  if (sub === 'stats') {
    return await getDashboardStats(env);
  }

  return jsonOk({ message: 'Dashboard OK' });
}

async function getDashboardStats(env: Env): Promise<Response> {
  const [
    totalLeads,
    leadsHoje,
    totalContatos,
    oportunidadesAbertas,
    oportunidadesFechadas,
    leadsPorOrigem,
    leadsPorEstagio,
  ] = await Promise.all([
    env.DB.prepare(`SELECT COUNT(*) AS total FROM leads`).first<{ total: number }>(),
    env.DB.prepare(
      `SELECT COUNT(*) AS total FROM leads WHERE date(created_at) = date('now')`,
    ).first<{ total: number }>(),
    env.DB.prepare(
      `SELECT COUNT(*) AS total FROM contatos WHERE deleted_at IS NULL AND anonimizado_at IS NULL`,
    ).first<{ total: number }>(),
    env.DB.prepare(
      `SELECT COUNT(*) AS total FROM oportunidades WHERE fechada_at IS NULL`,
    ).first<{ total: number }>(),
    env.DB.prepare(
      `SELECT estagio, COUNT(*) AS total
       FROM oportunidades
       WHERE estagio IN ('fechado_ganho','fechado_perdido')
         AND fechada_at >= date('now','-30 days')
       GROUP BY estagio`,
    ).all<{ estagio: string; total: number }>(),
    env.DB.prepare(
      `SELECT origem, COUNT(*) AS total FROM leads
       WHERE created_at >= date('now','-30 days')
       GROUP BY origem ORDER BY total DESC LIMIT 6`,
    ).all<{ origem: string; total: number }>(),
    env.DB.prepare(
      `SELECT estagio, COUNT(*) AS total FROM oportunidades
       WHERE fechada_at IS NULL
       GROUP BY estagio ORDER BY total DESC`,
    ).all<{ estagio: string; total: number }>(),
  ]);

  const ganhas = oportunidadesFechadas.results.find(r => r.estagio === 'fechado_ganho')?.total ?? 0;
  const perdidas = oportunidadesFechadas.results.find(r => r.estagio === 'fechado_perdido')?.total ?? 0;

  return jsonOk({
    leads: {
      total: totalLeads?.total ?? 0,
      hoje: leadsHoje?.total ?? 0,
    },
    contatos: {
      total: totalContatos?.total ?? 0,
    },
    oportunidades: {
      abertas: oportunidadesAbertas?.total ?? 0,
      fechadas_30d: { ganhas, perdidas },
    },
    leads_por_origem_30d: leadsPorOrigem.results,
    pipeline: leadsPorEstagio.results,
  });
}
