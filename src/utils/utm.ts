export interface UtmParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term?: string;
  utm_content?: string;
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

/**
 * Lê e persiste parâmetros UTM da URL em sessionStorage e localStorage.
 * Garante que parâmetros UTM (utm_source, utm_medium, utm_campaign) sejam
 * preservados em todas as páginas e navegações do site.
 */
export function captureUtmParams(): UtmParams {
  if (typeof window === 'undefined') {
    return { utm_source: '', utm_medium: '', utm_campaign: '' };
  }

  const urlParams = new URLSearchParams(window.location.search);
  const detected: Partial<UtmParams> = {};
  let hasAnyUtm = false;

  UTM_KEYS.forEach((key) => {
    const val = urlParams.get(key);
    if (val && val.trim() !== '') {
      detected[key] = val.trim();
      hasAnyUtm = true;
    }
  });

  // Se a URL atual tiver UTMs novas, salva no storage
  if (hasAnyUtm) {
    UTM_KEYS.forEach((key) => {
      const val = detected[key];
      if (val) {
        try {
          sessionStorage.setItem(key, val);
          localStorage.setItem(key, val);
        } catch (_) {}
      }
    });
  }

  // Recupera o valor atual (URL tem prioridade, depois sessionStorage, depois localStorage)
  const current: UtmParams = {
    utm_source:
      urlParams.get('utm_source') ||
      getStoredItem('utm_source') ||
      '',
    utm_medium:
      urlParams.get('utm_medium') ||
      getStoredItem('utm_medium') ||
      '',
    utm_campaign:
      urlParams.get('utm_campaign') ||
      getStoredItem('utm_campaign') ||
      '',
    utm_term:
      urlParams.get('utm_term') ||
      getStoredItem('utm_term') ||
      '',
    utm_content:
      urlParams.get('utm_content') ||
      getStoredItem('utm_content') ||
      '',
  };

  // Envia evento informativo para o dataLayer se houver UTMs ativas
  if (current.utm_source || current.utm_medium || current.utm_campaign) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'utm_identified',
      utm_source: current.utm_source,
      utm_medium: current.utm_medium,
      utm_campaign: current.utm_campaign,
      utm_term: current.utm_term || undefined,
      utm_content: current.utm_content || undefined,
      page_location: window.location.href,
    });
  }

  return current;
}

function getStoredItem(key: string): string {
  try {
    return sessionStorage.getItem(key) || localStorage.getItem(key) || '';
  } catch (_) {
    return '';
  }
}

export function getUtmParams(): UtmParams {
  return captureUtmParams();
}

/**
 * Anexa parâmetros UTM a um link de destino se não existirem
 */
export function appendUtmsToUrl(url: string): string {
  const utms = getUtmParams();
  if (!utms.utm_source && !utms.utm_medium && !utms.utm_campaign) {
    return url;
  }
  try {
    const [baseUrl, existingQuery] = url.split('?');
    const params = new URLSearchParams(existingQuery || '');
    if (utms.utm_source && !params.has('utm_source')) params.set('utm_source', utms.utm_source);
    if (utms.utm_medium && !params.has('utm_medium')) params.set('utm_medium', utms.utm_medium);
    if (utms.utm_campaign && !params.has('utm_campaign')) params.set('utm_campaign', utms.utm_campaign);
    const qs = params.toString();
    return qs ? `${baseUrl}?${qs}` : baseUrl;
  } catch (_) {
    return url;
  }
}
