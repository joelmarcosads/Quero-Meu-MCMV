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

declare interface D1ResultMeta {
  duration: number;
  size_after: number;
  rows_read: number;
  rows_written: number;
  last_row_id: number;
  changed_db: boolean;
  changes: number;
}

declare interface D1Result<T = Record<string, unknown>> {
  results: T[];
  success: boolean;
  meta: D1ResultMeta;
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

// ─── SubtleCrypto ─────────────────────────────────────────────────────────────
declare interface SubtleCrypto {
  importKey(
    format: string,
    keyData: ArrayBuffer | JsonWebKey,
    algorithm: AlgorithmIdentifier | RsaHashedImportParams | EcKeyImportParams,
    extractable: boolean,
    keyUsages: KeyUsage[],
  ): Promise<CryptoKey>;
  verify(
    algorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams,
    key: CryptoKey,
    signature: BufferSource,
    data: BufferSource,
  ): Promise<boolean>;
  sign(
    algorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams,
    key: CryptoKey,
    data: BufferSource,
  ): Promise<ArrayBuffer>;
  digest(
    algorithm: AlgorithmIdentifier,
    data: BufferSource,
  ): Promise<ArrayBuffer>;
}

declare type KeyUsage = 'encrypt' | 'decrypt' | 'sign' | 'verify' | 'deriveKey' | 'deriveBits' | 'wrapKey' | 'unwrapKey';
declare type AlgorithmIdentifier = string | Algorithm;
declare interface Algorithm { name: string; }
declare interface RsaHashedImportParams { name: string; hash: AlgorithmIdentifier; }
declare interface EcKeyImportParams { name: string; namedCurve: string; }
declare interface RsaPssParams { name: string; saltLength: number; }
declare interface EcdsaParams { name: string; hash: AlgorithmIdentifier; }
declare type BufferSource = ArrayBuffer | ArrayBufferView;
declare type JsonWebKey = Record<string, unknown>;

declare interface CryptoKey {
  readonly type: string;
  readonly extractable: boolean;
  readonly algorithm: KeyAlgorithm;
  readonly usages: KeyUsage[];
}
declare interface KeyAlgorithm { name: string; }

// ─── Web Globals (Workers runtime) ───────────────────────────────────────────
declare function atob(data: string): string;
declare function btoa(data: string): string;
declare function fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;

declare type RequestInfo = Request | string;

declare interface RequestInit {
  method?: string;
  headers?: HeadersInit;
  body?: BodyInit | null;
  redirect?: RequestRedirect;
  cf?: Record<string, unknown>;
}
declare type HeadersInit = Headers | Record<string, string> | [string, string][];
declare type BodyInit = string | ArrayBuffer | ArrayBufferView | ReadableStream | FormData | URLSearchParams | null;
declare type RequestRedirect = 'follow' | 'manual' | 'error';

declare class Headers {
  constructor(init?: HeadersInit);
  get(name: string): string | null;
  set(name: string, value: string): void;
  has(name: string): boolean;
  append(name: string, value: string): void;
  delete(name: string): void;
  entries(): IterableIterator<[string, string]>;
  forEach(callback: (value: string, key: string) => void): void;
}

declare class Request {
  constructor(input: RequestInfo, init?: RequestInit);
  readonly method: string;
  readonly url: string;
  readonly headers: Headers;
  readonly cf?: Record<string, unknown>;
  json<T = unknown>(): Promise<T>;
  text(): Promise<string>;
  arrayBuffer(): Promise<ArrayBuffer>;
  clone(): Request;
}

declare interface ResponseInit {
  status?: number;
  statusText?: string;
  headers?: HeadersInit;
}

declare class Response {
  constructor(body?: BodyInit | null, init?: ResponseInit);
  readonly status: number;
  readonly statusText: string;
  readonly headers: Headers;
  readonly ok: boolean;
  json<T = unknown>(): Promise<T>;
  text(): Promise<string>;
  arrayBuffer(): Promise<ArrayBuffer>;
  clone(): Response;
  static json(data: unknown, init?: ResponseInit): Response;
}

declare class URL {
  constructor(url: string, base?: string);
  readonly href: string;
  readonly origin: string;
  readonly protocol: string;
  readonly hostname: string;
  readonly port: string;
  readonly pathname: string;
  readonly search: string;
  readonly searchParams: URLSearchParams;
  readonly hash: string;
}

declare class URLSearchParams {
  constructor(init?: string | Record<string, string> | URLSearchParams);
  get(name: string): string | null;
  getAll(name: string): string[];
  set(name: string, value: string): void;
  has(name: string): boolean;
  append(name: string, value: string): void;
  delete(name: string): void;
  toString(): string;
  entries(): IterableIterator<[string, string]>;
  forEach(callback: (value: string, key: string) => void): void;
}

declare class TextDecoder {
  constructor(label?: string, options?: { fatal?: boolean; ignoreBOM?: boolean });
  decode(input?: ArrayBuffer | ArrayBufferView | null): string;
}

declare class TextEncoder {
  encode(input?: string): Uint8Array;
}

// Console (available in Workers runtime)
declare const console: {
  log(...args: unknown[]): void;
  error(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  info(...args: unknown[]): void;
  debug(...args: unknown[]): void;
};

declare interface ReadableStream<R = unknown> {
  readonly locked: boolean;
  cancel(reason?: unknown): Promise<void>;
  getReader(): ReadableStreamDefaultReader<R>;
  pipeThrough<T>(transform: ReadableWritablePair<T, R>, options?: StreamPipeOptions): ReadableStream<T>;
  pipeTo(destination: WritableStream<R>, options?: StreamPipeOptions): Promise<void>;
  tee(): [ReadableStream<R>, ReadableStream<R>];
}
declare interface ReadableStreamDefaultReader<R = unknown> {
  readonly closed: Promise<undefined>;
  cancel(reason?: unknown): Promise<void>;
  read(): Promise<ReadableStreamReadResult<R>>;
  releaseLock(): void;
}
declare interface ReadableStreamReadResult<T> { done: boolean; value: T | undefined; }
declare interface WritableStream<W = unknown> { readonly locked: boolean; }
declare interface ReadableWritablePair<R = unknown, W = unknown> {
  readable: ReadableStream<R>;
  writable: WritableStream<W>;
}
declare interface StreamPipeOptions { signal?: AbortSignal; }
declare interface AbortSignal { readonly aborted: boolean; }
declare class FormData {
  get(name: string): string | null;
  set(name: string, value: string): void;
  has(name: string): boolean;
  append(name: string, value: string): void;
}
// ArrayBufferView já declarado em lib.es5.d.ts
