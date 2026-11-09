/**
 * services/contact-resolver.ts
 *
 * Serviço centralizado de identificação e deduplicação de contatos.
 *
 * REGRA CENTRAL: UM CONTATO ÚNICO, MÚLTIPLOS INTERESSES, MÚLTIPLAS INTERAÇÕES.
 *
 * Resultado possível de `resolveContact`:
 *
 *  { kind: 'found',    contato_id }   → contato existente localizado pelo telefone ou email
 *  { kind: 'created',  contato_id }   → novo contato criado (telefone e email livres)
 *  { kind: 'conflict', message }      → telefone pertence a um contato, email a outro;
 *                                        não mesclar — devolver para revisão humana
 *
 * Tratamento de concorrência:
 *   D1 não suporta transações BEGIN/COMMIT via API, mas o índice UNIQUE parcial
 *   em contatos(telefone) garante que INSERT OR IGNORE é atômico:
 *   apenas um dos Workers concorrentes cria o registro; o outro ignora.
 *   O SELECT subsequente recupera o id correto independente de quem ganhou.
 *
 * Privacidade:
 *   - Nenhum dado pessoal (telefone, email) é logado em console.
 *   - A resposta 'conflict' NÃO revela se telefone ou email já estão cadastrados
 *     em endpoints públicos — o caller decide o que expor.
 */

// D1Database é um tipo global fornecido pelo @cloudflare/workers-types
// (declarado via tsconfig ou worker-configuration.d.ts gerado pelo wrangler).
// Não importar explicitamente para evitar conflito quando o pacote não está
// em node_modules (ex: container sem npm install).

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type ContactResolveResult =
  | {
      kind: 'found';
      contato_id: number;
      is_new: false;
      /**
       * true quando o contato foi localizado PELO EMAIL e o telefone
       * recebido difere do telefone cadastrado no contato.
       * O novo telefone NÃO é sobrescrito automaticamente — cabe ao caller
       * sinalizar a divergência no painel ou armazená-la em dados_extras_json.
       */
      phone_divergence?: boolean;
    }
  | { kind: 'created';  contato_id: number; is_new: true  }
  | { kind: 'conflict'; message: string;    tel_id: number; email_id: number };

export interface ResolveContactInput {
  /** Telefone já normalizado E.164 (ex: +5511999990001). Obrigatório. */
  telefone: string;
  /** Email já normalizado (lowercase + trim). Opcional. */
  email?: string | null;
  /** Nome do contato. Usado apenas na criação. */
  nome?: string | null;
  /** Cidade. Usada apenas na criação. */
  cidade?: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Normaliza email: lowercase + trim.
 * Retorna null para string vazia ou undefined.
 */
export function normalizeEmail(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const normalized = raw.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

// ─── Serviço ──────────────────────────────────────────────────────────────────

/**
 * Resolve ou cria um contato único a partir de telefone (+ email opcional).
 *
 * Algoritmo:
 *  1. Busca por telefone normalizado.
 *  2. Se email fornecido, busca por email normalizado.
 *  3. Se ambos retornam o MESMO contato (ou apenas um encontrado) → 'found'.
 *  4. Se telefone pertence a contato A e email a contato B → 'conflict'.
 *  5. Se nenhum encontrado → INSERT OR IGNORE + SELECT → 'created' ou 'found'
 *     (INSERT OR IGNORE garante que corridas de leitura-escrita são seguras).
 */
export async function resolveContact(
  db: D1Database,
  input: ResolveContactInput,
): Promise<ContactResolveResult> {
  const { telefone, email, nome, cidade } = input;
  const emailNorm = normalizeEmail(email);

  // ── 1. Busca por telefone ────────────────────────────────────────────────
  const byPhone = await db
    .prepare(
      `SELECT id FROM contatos
       WHERE telefone = ?
         AND deleted_at IS NULL
         AND anonimizado_at IS NULL
       LIMIT 1`,
    )
    .bind(telefone)
    .first<{ id: number }>();

  // ── 2. Busca por email (apenas se fornecido) ─────────────────────────────
  let byEmail: { id: number } | null = null;
  if (emailNorm) {
    byEmail = await db
      .prepare(
        `SELECT id FROM contatos
         WHERE lower(trim(email)) = ?
           AND deleted_at IS NULL
           AND anonimizado_at IS NULL
         LIMIT 1`,
      )
      .bind(emailNorm)
      .first<{ id: number }>();
  }

  // ── 3. Avaliação dos resultados ──────────────────────────────────────────

  // Conflito: telefone e email pertencem a contatos DIFERENTES
  if (byPhone && byEmail && byPhone.id !== byEmail.id) {
    return {
      kind: 'conflict',
      message:
        'Telefone e e-mail pertencem a contatos diferentes. ' +
        'Revisão manual necessária antes de prosseguir.',
      tel_id: byPhone.id,
      email_id: byEmail.id,
    };
  }

  // Encontrado pelo telefone (email pode coincidir ou não ter sido fornecido)
  if (byPhone) {
    return { kind: 'found', contato_id: byPhone.id, is_new: false };
  }

  // Encontrado apenas pelo email (telefone ainda não cadastrado).
  // Verifica se o telefone que chegou difere do telefone registrado no contato.
  // NÃO sobrescreve o telefone existente — apenas sinaliza divergência.
  if (byEmail) {
    const existingContact = await db
      .prepare(
        `SELECT telefone FROM contatos WHERE id = ? LIMIT 1`,
      )
      .bind(byEmail.id)
      .first<{ telefone: string }>();

    const phoneDivergence =
      !!existingContact && existingContact.telefone !== telefone;

    return {
      kind: 'found',
      contato_id: byEmail.id,
      is_new: false,
      // exactOptionalPropertyTypes: usar spread para omitir a chave quando false
      ...(phoneDivergence ? { phone_divergence: true as const } : {}),
    };
  }

  // ── 4. Nenhum encontrado → criar ─────────────────────────────────────────
  // contatos.nome é NOT NULL no schema D1 — usar fallback para evitar
  // falha no INSERT quando nome não é fornecido (ex: portal público).
  // 'Visitante' é um placeholder editável pelo corretor no painel.
  const nomeFinal = nome?.trim() || 'Visitante';

  // INSERT OR IGNORE: se houtra requisição concorrente ganhar a corrida com
  // o mesmo telefone, esta instrução ignora silenciosamente (UNIQUE parcial).
  await db
    .prepare(
      `INSERT OR IGNORE INTO contatos (telefone, nome, email, cidade)
       VALUES (?, ?, ?, ?)`,
    )
    .bind(telefone, nomeFinal, emailNorm, cidade?.trim() ?? null)
    .run();

  // SELECT garante que obtemos o id correto mesmo em caso de corrida
  const created = await db
    .prepare(
      `SELECT id FROM contatos
       WHERE telefone = ?
         AND deleted_at IS NULL
         AND anonimizado_at IS NULL
       LIMIT 1`,
    )
    .bind(telefone)
    .first<{ id: number }>();

  if (!created) {
    // Nunca deve ocorrer após INSERT OR IGNORE + SELECT
    throw new Error('[contact-resolver] falha ao recuperar contato após INSERT');
  }

  return { kind: 'created', contato_id: created.id, is_new: true };
}

/**
 * Verifica se já existe um lead com a mesma chave de idempotência.
 * Retorna o lead existente ou null.
 */
export async function findLeadByIdempotencyKey(
  db: D1Database,
  key: string,
): Promise<{ id: number; contato_id: number; origem: string; created_at: string } | null> {
  return db
    .prepare(
      `SELECT id, contato_id, origem, created_at
       FROM leads
       WHERE idempotency_key = ?
       LIMIT 1`,
    )
    .bind(key)
    .first<{ id: number; contato_id: number; origem: string; created_at: string }>();
}
