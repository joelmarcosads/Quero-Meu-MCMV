/**
 * index.ts — Cloudflare Worker principal
 * Market Imobi CRM — staging
 *
 * Todas as rotas exigem autenticação via Cloudflare Access (JWT RS256).
 * X-Test-Cf-Sub NÃO existe nesta implementação.
 */

import type { Env } from './types';
import { authenticate, AuthError } from './auth';
import { jsonError } from './utils';
import { handleEmpreendimentos } from './routes/empreendimentos';
import { handleLeads } from './routes/leads';
import { handleOportunidades } from './routes/oportunidades';
import { handleDashboard } from './routes/dashboard';
import { handleContatos } from './routes/contatos';
import { handleInteracoes } from './routes/interacoes';
import { handleUsuarios, handleMe } from './routes/usuarios';

// ─── Handler principal ────────────────────────────────────────────────────────
export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // ── CORS preflight ────────────────────────────────────────────────────
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Cf-Access-Jwt-Assertion',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // ── Admin Panel SPA (servido via Static Assets) ───────────────────────
    // Rotas /admin/* são entregues pelo ASSETS binding (Vite build).
    // CF Access protege o painel no nível de rota via policy — sem auth Worker aqui.
    if (path === '/admin' || path.startsWith('/admin/')) {
      if (env.ASSETS) {
        return env.ASSETS.fetch(request);
      }
      return new Response('Admin panel não disponível (assets não configurados)', { status: 503 });
    }

    // ── Health check (sem autenticação) ───────────────────────────────────
    if (path === '/health' || path === '/api/v1/health') {
      return Response.json({
        status: 'ok',
        environment: env.ENVIRONMENT,
        timestamp: new Date().toISOString(),
      });
    }

    // ── Todas as demais rotas exigem autenticação ─────────────────────────
    let user;
    try {
      user = await authenticate(request, env);
    } catch (err) {
      if (err instanceof AuthError) {
        return jsonError(err.message, err.statusCode);
      }
      return jsonError('Erro de autenticação', 401);
    }

    // ── Roteamento ────────────────────────────────────────────────────────
    // Normaliza path: /api/v1/leads/123/estagio → ['', 'api', 'v1', 'leads', '123', 'estagio']
    const pathParts = path.split('/');
    const resource = pathParts[3]; // leads, empreendimentos, oportunidades…

    if (!path.startsWith('/api/v1/')) {
      return jsonError('Rota não encontrada', 404);
    }

    try {
      switch (resource) {
        case 'me':
          return await handleMe(request, env, user);

        case 'empreendimentos':
          return await handleEmpreendimentos(request, env, user, pathParts);

        case 'leads':
          return await handleLeads(request, env, user, pathParts);

        case 'oportunidades':
          return await handleOportunidades(request, env, user, pathParts);

        case 'dashboard':
          return await handleDashboard(request, env, user, pathParts);

        case 'contatos':
          return await handleContatos(request, env, user, pathParts);

        case 'interacoes':
          return await handleInteracoes(request, env, user);

        case 'usuarios':
          return await handleUsuarios(request, env, user);

        default:
          return jsonError(`Recurso '${resource}' não encontrado`, 404);
      }
    } catch (err) {
      console.error('[worker] Erro não tratado:', err);
      return jsonError('Erro interno do servidor', 500);
    }
  },
} satisfies ExportedHandler<Env>;
