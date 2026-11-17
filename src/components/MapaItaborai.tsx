/**
 * Mapa de localização — Itaboraí-RJ
 * Coordenadas: Rua H, nº 492, Retiro São Joaquim, Itaboraí-RJ (-22.7444, -42.8597)
 */
export default function MapaItaborai() {
  return (
    <section
      aria-label="Localização do corretor Joel Marcos em Itaboraí-RJ"
      style={{ width: '100%', background: '#f1f5f9', padding: '2.5rem 1rem' }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h2
          style={{
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#1e293b',
            marginBottom: '0.5rem',
          }}
        >
          Onde nos encontrar
        </h2>
        <p
          style={{
            textAlign: 'center',
            color: '#475569',
            marginBottom: '1.25rem',
            fontSize: '0.95rem',
          }}
        >
          Rua H, nº 492 — Retiro São Joaquim, Itaboraí-RJ · CEP 24813-066
        </p>
        <div
          style={{
            borderRadius: '0.75rem',
            overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
          }}
        >
          <iframe
            title="Localização Joel Marcos MCMV Itaboraí"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3686.2!2d-42.8597!3d-22.7444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDQ0JzM5LjgiUyA0MsKwNTEnMzQuOSJX!5e0!3m2!1spt-BR!2sbr!4v1700000000000"
            width="100%"
            height="340"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
