/**
 * utils.ts — Helpers compartilhados
 */

import type { ApiResponse } from './types';

// ─── Normalização E.164 ───────────────────────────────────────────────────────
export function normalizePhone(raw: string): string | null {
  // Remove tudo que não é dígito
  const digits = raw.replace(/\D/g, '');

  // Brasil: +55 + 10 ou 11 dígitos (DDD + número)
  // Aceita: 11999990001, 011999990001, 5511999990001
  let national = digits;
  if (digits.startsWith('55') && digits.length >= 12) {
    national = digits.slice(2);
  } else if (digits.startsWith('0') && digits.length >= 11) {
    national = digits.slice(1);
  }

  if (national.length < 10 || national.length > 11) {
    return null;
  }

  return `+55${national}`;
}

// ─── Respostas JSON padronizadas ──────────────────────────────────────────────
export function jsonOk<T>(data: T, status = 200): Response {
  const body: ApiResponse<T> = { success: true, data };
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function jsonCreated<T>(data: T): Response {
  return jsonOk(data, 201);
}

export function jsonError(message: string, status: number): Response {
  const body: ApiResponse = { success: false, error: message };
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function jsonIdempotent<T>(data: T): Response {
  const body: ApiResponse<T> = { success: true, data, idempotent: true };
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// ─── Gerador de UUID v4 (Web Crypto) ─────────────────────────────────────────
export function uuidv4(): string {
  return crypto.randomUUID();
}

// ─── Sanitização de IP (truncar para /16) ────────────────────────────────────
export function sanitizeIp(ip: string | null): string | null {
  if (!ip) return null;
  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.0.0`;
  }
  // IPv6: retornar primeiros 4 blocos
  const ipv6parts = ip.split(':');
  return ipv6parts.slice(0, 4).join(':') + '::/64';
}

// ─── Audit log ────────────────────────────────────────────────────────────────
interface AuditParams {
  db: D1Database;
  usuarioId: number;
  tabela: string;
  registroId: number;
  /**
   * Deve corresponder ao CHECK constraint do schema D1:
   *   CHECK(acao IN ('INSERT','UPDATE','DELETE'))
   * Não usar 'SELECT' ou 'ANONIMIZAR' — não estão no schema e causariam
   * falha silenciosa no D1.
   */
  acao: 'INSERT' | 'UPDATE' | 'DELETE';
  dadosAnt?: Record<string, unknown> | null;
  dadosNov?: Record<string, unknown> | null;
  ip?: string | null;
}

/**
 * Registra auditoria no audit_log.
 * Falhas de auditoria são logadas mas NÃO propagadas — a operação principal
 * não deve ser interrompida por uma falha de log.
 */
export async function writeAudit(params: AuditParams): Promise<void> {
  const { db, usuarioId, tabela, registroId, acao, dadosAnt, dadosNov, ip } = params;

  // Sanitizar contatos: remover PII, manter apenas id
  function sanitize(data: Record<string, unknown> | null | undefined) {
    if (!data) return null;
    if (tabela === 'contatos') {
      return JSON.stringify({ id: data['id'], _sanitizado: true });
    }
    return JSON.stringify(data);
  }

  const sanitizedIp = sanitizeIp(ip ?? null);

  try {
    await db.prepare(
      `INSERT INTO audit_log (usuario_id, tabela, registro_id, acao, dados_anteriores, dados_novos, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      usuarioId,
      tabela,
      registroId,
      acao,
      sanitize(dadosAnt),
      sanitize(dadosNov),
      sanitizedIp,
    ).run();
  } catch (err) {
    // Falha de auditoria não deve interromper a operação principal.
    // Log mínimo sem dados pessoais.
    console.error('[writeAudit] falha ao gravar audit_log:', tabela, registroId, acao);
  }
}

// ─── Extrair IP do request ────────────────────────────────────────────────────
export function getClientIp(request: Request): string | null {
  return request.headers.get('CF-Connecting-IP') ??
         request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ??
         null;
}

// ─── Parser de corpo JSON ─────────────────────────────────────────────────────
export async function parseJsonBody<T>(request: Request): Promise<T> {
  const contentType = request.headers.get('Content-Type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new Error('Content-Type deve ser application/json');
  }
  try {
    return await request.json() as T;
  } catch {
    throw new Error('JSON inválido no corpo da requisição');
  }
}
