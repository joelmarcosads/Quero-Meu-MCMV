/**
 * Declarações mínimas de tipos para Cloudflare Workers
 * (substitui @cloudflare/workers-types quando o pacote não está disponível localmente)
 */

// ─── D1 Database ──────────────────────────────────────────────────────────────
declare interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<D1Result>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  raw<T = unknown[]>(): Promise<T[]>;
}

declare interface D1Result<T = Record<string, unknown>> {
  results: T[];
  success: boolean;
  meta: Record<string, unknown>;
}

declare interface D1Database {
  prepare(query: string): D1PreparedStatement;
  exec(query: string): Promise<D1Result>;
  batch<T = Record<string, unknown>>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  dump(): Promise<ArrayBuffer>;
}

// ─── KV Namespace ─────────────────────────────────────────────────────────────
declare interface KVNamespacePutOptions {
  expiration?: number;
  expirationTtl?: number;
  metadata?: Record<string, unknown>;
}

declare interface KVNamespace {
  get(key: string, options?: { type?: string }): Promise<string | null>;
  put(key: string, value: string, options?: KVNamespacePutOptions): Promise<void>;
  delete(key: string): Promise<void>;
  list(options?: { prefix?: string; limit?: number }): Promise<{ keys: Array<{ name: string }> }>;
}

// ─── Worker globals ───────────────────────────────────────────────────────────
declare interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

declare interface ExportedHandler<Env = unknown> {
  fetch(request: Request, env: Env, ctx: ExecutionContext): Response | Promise<Response>;
  scheduled?(event: ScheduledEvent, env: Env, ctx: ExecutionContext): void | Promise<void>;
}

declare interface ScheduledEvent {
  scheduledTime: number;
  cron: string;
}

// ─── Crypto (Workers runtime) ─────────────────────────────────────────────────
declare interface Crypto {
  randomUUID(): `${string}-${string}-${string}-${string}-${string}`;
  subtle: SubtleCrypto;
  getRandomValues<T extends ArrayBufferView>(array: T): T;
}

declare const crypto: Crypto;
