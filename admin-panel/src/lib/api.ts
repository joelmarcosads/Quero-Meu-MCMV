/**
 * lib/api.ts
 *
 * Cliente HTTP para o Worker. Auth via cookie CF_Authorization (injetado pelo
 * CF Access automaticamente no browser — sem service tokens no frontend).
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`;

  const res = await fetch(url, {
    ...init,
    credentials: 'include', // envia cookie CF_Authorization
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  const json = await res.json() as { success: boolean; data?: T; error?: string };

  if (!res.ok || !json.success) {
    throw new ApiError(res.status, json.error ?? `HTTP ${res.status}`);
  }

  return json.data as T;
}

// ─── Me ───────────────────────────────────────────────────────────────────────
export const api = {
  me: () => request('/me'),

  // Dashboard
  dashboard: {
    stats: () => request('/dashboard/stats'),
    analytics: (period: '7' | '30' | '90' = '30') =>
      request(`/dashboard/analytics?period=${period}`),
  },

  // Leads
  leads: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request(`/leads${qs}`);
    },
    get: (id: number) => request(`/leads/${id}`),
  },

  // Contatos
  contatos: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request(`/contatos${qs}`);
    },
    get: (id: number) => request(`/contatos/${id}`),
    patch: (id: number, body: Record<string, unknown>) =>
      request(`/contatos/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  },

  // Oportunidades
  oportunidades: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request(`/oportunidades${qs}`);
    },
    get: (id: number) => request(`/oportunidades/${id}`),
    create: (body: Record<string, unknown>) =>
      request('/oportunidades', { method: 'POST', body: JSON.stringify(body) }),
    patch: (id: number, body: Record<string, unknown>) =>
      request(`/oportunidades/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
    patchEstagio: (id: number, body: Record<string, unknown>) =>
      request(`/oportunidades/${id}/estagio`, { method: 'PATCH', body: JSON.stringify(body) }),
  },

  // Interações
  interacoes: {
    list: (params: Record<string, string>) => {
      const qs = '?' + new URLSearchParams(params).toString();
      return request(`/interacoes${qs}`);
    },
    create: (body: Record<string, unknown>) =>
      request('/interacoes', { method: 'POST', body: JSON.stringify(body) }),
  },

  // Usuários
  usuarios: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request(`/usuarios${qs}`);
    },
  },

  // Conflitos de identidade
  conflitos: {
    list: (params?: Record<string, string>) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request(`/conflitos${qs}`);
    },
    resolver: (id: number, body: { escolha: 'tel' | 'email'; empreendimento_id?: number; tipologia_id?: number }) =>
      request(`/conflitos/${id}/resolver`, { method: 'POST', body: JSON.stringify(body) }),
  },
};
