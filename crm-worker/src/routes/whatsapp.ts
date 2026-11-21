/**
 * routes/whatsapp.ts
 *
 * Módulo WhatsApp Cloud API — Market Imobi CRM
 * Fase 1: envio manual controlado para destinatário de teste.
 * Isolado da Missão 6 (webhook-meta.ts).
 *
 * ─── Endpoints ───────────────────────────────────────────────────────────────
 *   POST /api/v1/whatsapp/send-test    — envia hello_world para destinatário autorizado
 *   GET  /api/v1/whatsapp/log          — lista últimos 50 registros de envio
 *   GET  /api/v1/whatsapp/status       — verifica configuração do ambiente
 *
 * ─── Segurança ───────────────────────────────────────────────────────────────
 *   - Todas as rotas exigem CF Access JWT (autenticação via handleWhatsapp recebe 'user')
 *   - /send-test restrita a perfil 'admin' em produção
 *   - Destinatários de teste devem estar registrados no Meta App Developer
 *   - Nenhuma automação a leads reais nesta fase
 *
 * ─── Idempotência ────────────────────────────────────────────────────────────
 *   - Cliente envia X-Idempotency-Key (UUID) no header
 *   - Mesmo UUID → retorna resultado anterior sem re-enviar
 *   - Sem header → gera UUID v4 determinístico (data + destinatário + template)
 */

import type { Env, AuthenticatedUser } from '../types';
import { jsonError } from '../utils';
import { enviarMensagemWa, normalizeWaPhone } from '../services/whatsapp';

// ─── Handler principal ────────────────────────────────────────────────────────

export async function handleWhatsapp(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
): Promise<Response> {
  const url = new URL(request.url);
  const parts = url.pathname.split('/').filter(Boolean);
  // parts: ['api','v1','whatsapp', sub]
  const sub = parts[3] ?? '';

  try {
    switch (sub) {
      case 'send-test': return await handleSendTest(request, env, user);
      case 'log':       return await handleLog(request, env);
      case 'status':    return await handleStatus(env);
      default:
        return jsonError(`Sub-rota '/api/v1/whatsapp/${sub}' não encontrada`, 404);
    }
  } catch (err) {
    console.error('[whatsapp] Erro não tratado:', err);
    return jsonError('Erro interno do módulo WhatsApp', 500);
  }
}

// ─── POST /api/v1/whatsapp/send-test ─────────────────────────────────────────

interface SendTestBody {
  destinatario: string;      // número do destinatário (deve estar cadastrado no App)
  idempotency_key?: string;  // UUID fornecido pelo cliente para deduplicação
  // Fase 1 apenas: template hello_world (en_US) — sem parâmetros variáveis
  // Fase 2+: templates pt_BR com parâmetros (lead_name, etc.)
}

async function handleSendTest(
  request: Request,
  env: Env,
  user: AuthenticatedUser,
): Promise<Response> {

  if (request.method !== 'POST') {
    return jsonError('Método não permitido', 405);
  }

  // Apenas admins podem disparar envios de teste
  if (user.perfil !== 'admin') {
    return jsonError('Acesso negado — apenas administradores podem enviar mensagens de teste', 403);
  }

  // Parse do body
  let body: SendTestBody;
  try {
    body = await request.json() as SendTestBody;
  } catch {
    return jsonError('Body JSON inválido', 400);
  }

  if (!body.destinatario) {
    return jsonError('Campo obrigatório: destinatario', 400);
  }

  // Normalizar número
  const destinatario = normalizeWaPhone(body.destinatario);
  if (!destinatario) {
    return jsonError(
      `Número inválido: "${body.destinatario}". Use formato E.164 (+5521XXXXXXXXX) ou apenas DDD+número.`,
      400,
    );
  }

  // Gerar idempotency_key se não fornecida
  const idempotencyKey = body.idempotency_key
    ?? await generateIdempotencyKey(destinatario, 'hello_world', env);

  // Verificar se WA está configurado antes de tentar
  const configured = isWaConfigured(env);
  if (!configured) {
    return Response.json(
      {
        success: false,
        error: 'Módulo WhatsApp não configurado neste ambiente.',
        instrucoes: [
          '1. Acesse developers.facebook.com → seu App → WhatsApp → Getting Started',
          '2. Copie o "Phone number ID" e o "Temporary access token"',
          '3. Configure via: wrangler secret put WA_PHONE_NUMBER_ID --env staging',
          '4. Configure via: wrangler secret put WA_ACCESS_TOKEN --env staging',
          '5. Registre seu número (+5521XXXXXXXXX) como destinatário de teste no App',
          '6. Faça deploy e tente novamente',
        ],
      },
      { status: 503 },
    );
  }

  // Enviar
  const result = await enviarMensagemWa(
    {
      destinatario,
      tipo: 'test',
      template_name: 'hello_world',
      template_lang: 'en_US',
      idempotency_key: idempotencyKey,
      enviado_por: user.id,
    },
    env,
  );

  return Response.json(
    {
      success: result.ok,
      idempotent: result.idempotent,
      data: {
        log_id: result.log_id,
        destinatario,
        template: 'hello_world',
        wa_message_id: result.wa_message_id,
        idempotency_key: idempotencyKey,
      },
      error: result.error,
    },
    { status: result.ok ? 200 : (result.error?.includes('não configurados') ? 503 : 422) },
  );
}

// ─── GET /api/v1/whatsapp/log ─────────────────────────────────────────────────

async function handleLog(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'GET') return jsonError('Método não permitido', 405);

  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50', 10), 100);
  const status = url.searchParams.get('status'); // filtro opcional

  const whereClause = status ? 'WHERE status = ?' : '';
  const params = status ? [status, limit] : [limit];

  const rows = await env.DB.prepare(`
    SELECT
      id, idempotency_key, destinatario, tipo,
      template_name, template_lang, status,
      wa_message_id, error_code, error_message,
      enviado_por, lead_id, created_at, updated_at
    FROM whatsapp_mensagens
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT ?
  `).bind(...params).all();

  return Response.json({ success: true, data: rows.results });
}

// ─── GET /api/v1/whatsapp/status ─────────────────────────────────────────────

async function handleStatus(env: Env): Promise<Response> {
  const configured = isWaConfigured(env);
  const phoneId = (env as unknown as Record<string, string>).WA_PHONE_NUMBER_ID;

  // Contar mensagens por status
  const stats = await env.DB.prepare(`
    SELECT status, COUNT(*) as total
    FROM whatsapp_mensagens
    GROUP BY status
  `).all<{ status: string; total: number }>();

  const statusMap: Record<string, number> = {};
  for (const row of stats.results ?? []) {
    statusMap[row.status] = row.total;
  }

  return Response.json({
    success: true,
    data: {
      configured,
      phone_number_id: configured ? `...${phoneId?.slice(-6)}` : null,
      mensagens: statusMap,
      fase: 'Fase 1 — Envio manual controlado (staging)',
      restricoes: [
        'Apenas destinatários registrados no Meta App Developer',
        'Template: hello_world (en_US)',
        'Apenas perfil admin pode disparar',
        'Nenhuma automação a leads reais nesta fase',
      ],
    },
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isWaConfigured(env: Env): boolean {
  const e = env as unknown as Record<string, string>;
  return Boolean(e.WA_PHONE_NUMBER_ID && e.WA_ACCESS_TOKEN);
}

/** Gera chave determinística para evitar duplicatas acidentais */
async function generateIdempotencyKey(
  destinatario: string,
  template: string,
  _env: Env,
): Promise<string> {
  const raw = `${destinatario}:${template}:${Date.now()}`;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
  const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  return hex.slice(0, 32);
}
