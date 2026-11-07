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
import { handlePublicLeads } from './routes/public-leads';
import { handleMetaWebhook } from './routes/webhook-meta';

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
    // O Vite build gera os arquivos na RAIZ de dist/ (index.html, assets/…).
    // O ASSETS binding serve pelo path da URL — mas o browser pede /admin/…
    // Precisamos reescrever /admin → / e /admin/leads → /leads antes de
    // passar ao binding. Arquivos estáticos (*.js, *.css, *.ico, etc.) são
    // servidos pelo path reescrito; qualquer rota SPA desconhecida recebe
    // o index.html raiz para o BrowserRouter do React tratar.
    if (path === '/admin' || path.startsWith('/admin/')) {
      if (!env.ASSETS) {
        return new Response('Admin panel não disponível (assets não configurados)', { status: 503 });
      }

      // Strip do prefixo /admin; / quando caminho exato /admin ou /admin/
      const stripped = path.replace(/^\/admin/, '') || '/';
      const assetUrl = new URL(request.url);
      assetUrl.pathname = stripped;

      // Tenta servir o arquivo estático (JS/CSS/fontes/ícones)
      const assetReq = new Request(assetUrl.toString(), request);
      let resp = await env.ASSETS.fetch(assetReq);

      // Se não encontrado (rota SPA como /leads, /contatos/5…) → serve index.html
      if (resp.status === 404) {
        const indexUrl = new URL(request.url);
        indexUrl.pathname = '/';
        resp = await env.ASSETS.fetch(new Request(indexUrl.toString(), request));
      }

      return resp;
    }

    // ── Health check (sem autenticação) ───────────────────────────────────
    if (path === '/health' || path === '/api/v1/health') {
      return Response.json({
        status: 'ok',
        environment: env.ENVIRONMENT,
        timestamp: new Date().toISOString(),
      });
    }

    // ── Rota pública de ingestão de leads do portal (sem CF Access) ───────
    // POST /api/v1/public/leads — recebe leads do LeadForm.jsx
    // Protegida por honeypot, validação e idempotência (sem JWT)
    if (path === '/api/v1/public/leads') {
      return await handlePublicLeads(request, env, _ctx);
    }

    // ── Webhook Meta Lead Ads (sem CF Access) ────────────────────────────
    // GET  /api/v1/webhook/meta — verificação do token (Meta Developer Platform)
    // POST /api/v1/webhook/meta — recebe eventos leadgen; segurança via X-Hub-Signature-256
    // IMPORTANTE: esta rota deve ter "Bypass" na CF Access policy
    if (path === '/api/v1/webhook/meta') {
      return await handleMetaWebhook(request, env, _ctx);
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
