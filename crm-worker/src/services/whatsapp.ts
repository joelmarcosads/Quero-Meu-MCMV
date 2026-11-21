/**
 * services/whatsapp.ts
 *
 * Serviço de envio WhatsApp Cloud API — Market Imobi CRM
 * Isolado da Missão 6 (webhook-meta.ts). Não compartilha credenciais de
 * página Meta — usa Phone Number ID e Access Token próprios do módulo WA.
 *
 * ─── Fase 1: Envio manual controlado (staging only) ─────────────────────────
 *   - Apenas destinatários registrados no Meta App Developer como teste
 *   - Template 'hello_world' (en_US) — pré-aprovado sem WABA verificada
 *   - Idempotência via idempotency_key → tabela whatsapp_mensagens
 *   - Nenhum envio automático a leads reais nesta fase
 *
 * ─── Referências oficiais Meta ───────────────────────────────────────────────
 *   - Graph API v21.0 — POST /{phone_number_id}/messages
 *   - Número de teste: developers.facebook.com → App → WhatsApp → Getting Started
 *   - Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/messages/template-messages
 */

import type { Env } from '../types';
import { jsonError } from '../utils';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface WaEnvioInput {
  destinatario: string;         // E.164 sem espaços: +5521XXXXXXXXX
  tipo: 'test' | 'lead_new' | 'visit_reminder';
  template_name: string;        // nome exato do template aprovado Meta
  template_lang: string;        // ex: 'pt_BR' ou 'en_US'
  template_components?: WaTemplateComponent[];
  idempotency_key: string;      // UUID ou chave única gerada pelo cliente
  lead_id?: number;
  enviado_por?: number;
}

export interface WaTemplateComponent {
  type: 'body' | 'header' | 'button';
  parameters?: Array<{
    type: 'text' | 'currency' | 'date_time';
    text?: string;
  }>;
}

export interface WaEnvioResult {
  ok: boolean;
  idempotent: boolean;           // true = já enviado antes, resultado reutilizado
  log_id: number;
  wa_message_id: string | undefined;
  error: string | undefined;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Normaliza número para E.164 brasileiro.
 * Aceita: "21965928399", "5521965928399", "+5521965928399"
 * Rejeita: vazio, não-numérico
 */
export function normalizeWaPhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  // Já tem DDI 55
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    return '+' + digits;
  }
  // Apenas DDD + número (10 ou 11 dígitos)
  if (digits.length === 10 || digits.length === 11) {
    return '+55' + digits;
  }
  return null;
}

/** Constrói o payload JSON para a Cloud API v21.0 */
function buildPayload(input: WaEnvioInput): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    messaging_product: 'whatsapp',
    to: input.destinatario,
    type: 'template',
    template: {
      name: input.template_name,
      language: { code: input.template_lang },
    },
  };

  if (input.template_components && input.template_components.length > 0) {
    (payload.template as Record<string, unknown>).components = input.template_components;
  }

  return payload;
}

// ─── Função principal de envio ────────────────────────────────────────────────

export async function enviarMensagemWa(
  input: WaEnvioInput,
  env: Env,
): Promise<WaEnvioResult> {

  // 1. Verificar variáveis de ambiente obrigatórias
  const phoneId = (env as unknown as Record<string, string>).WA_PHONE_NUMBER_ID;
  const token   = (env as unknown as Record<string, string>).WA_ACCESS_TOKEN;

  if (!phoneId || !token) {
    return {
      ok: false,
      idempotent: false,
      log_id: 0,
      wa_message_id: undefined,
      error: 'WA_PHONE_NUMBER_ID ou WA_ACCESS_TOKEN não configurados neste ambiente',
    };
  }

  // 2. Verificar idempotência — já enviado?
  const existing = await env.DB.prepare(
    'SELECT id, status, wa_message_id FROM whatsapp_mensagens WHERE idempotency_key = ?'
  ).bind(input.idempotency_key).first<{ id: number; status: string; wa_message_id: string | null }>();

  if (existing) {
    return {
      ok: existing.status === 'sent',
      idempotent: true,
      log_id: existing.id,
      wa_message_id: existing.wa_message_id ?? undefined,
      error: undefined,
    };
  }

  // 3. Construir payload
  const payload = buildPayload(input);
  const payloadJson = JSON.stringify(payload);

  // 4. Registrar no log com status 'pending' antes de enviar
  const baseUrl = (env as unknown as Record<string, string>).GRAPH_API_BASE_URL
    ?? 'https://graph.facebook.com';

  const inserted = await env.DB.prepare(`
    INSERT INTO whatsapp_mensagens
      (idempotency_key, destinatario, tipo, template_name, template_lang,
       payload_json, status, enviado_por, lead_id)
    VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)
    RETURNING id
  `).bind(
    input.idempotency_key,
    input.destinatario,
    input.tipo,
    input.template_name,
    input.template_lang,
    payloadJson,
    input.enviado_por ?? null,
    input.lead_id ?? null,
  ).first<{ id: number }>();

  const logId = inserted?.id ?? 0;

  // 5. Chamar a Graph API
  let waMessageId: string | undefined;
  let errorCode: number | undefined;
  let errorMsg: string | undefined;
  let success = false;

  try {
    const url = `${baseUrl}/v21.0/${phoneId}/messages`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: payloadJson,
    });

    const body = await res.json() as Record<string, unknown>;

    if (res.ok && body.messages) {
      const msgs = body.messages as Array<{ id: string }>;
      waMessageId = msgs[0]?.id;
      success = true;
    } else {
      // Estrutura de erro Meta: { error: { code, message, ... } }
      const err = (body.error ?? {}) as { code?: number; message?: string };
      errorCode = err.code;
      errorMsg  = err.message ?? `HTTP ${res.status}`;
    }
  } catch (e) {
    errorMsg = e instanceof Error ? e.message : 'Erro de rede';
  }

  // 6. Atualizar o log com o resultado
  await env.DB.prepare(`
    UPDATE whatsapp_mensagens SET
      status      = ?,
      wa_message_id = ?,
      error_code    = ?,
      error_message = ?,
      updated_at    = strftime('%Y-%m-%dT%H:%M:%SZ', 'now')
    WHERE id = ?
  `).bind(
    success ? 'sent' : 'failed',
    waMessageId ?? null,
    errorCode ?? null,
    errorMsg ?? null,
    logId,
  ).run();

  return {
    ok: success,
    idempotent: false,
    log_id: logId,
    wa_message_id: waMessageId,
    error: success ? undefined : errorMsg,
  };
}

// ─── Resposta de erro padronizada ─────────────────────────────────────────────
export { jsonError };
