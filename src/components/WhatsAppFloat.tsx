const WHATSAPP_URL =
  'https://wa.me/5521965928399?text=Ol%C3%A1%2C%20Joel!%20Tenho%20interesse%20em%20saber%20mais%20sobre%20o%20Minha%20Casa%20Minha%20Vida.';

export default function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com Joel no WhatsApp"
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        right: '1.25rem',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '3.5rem',
        height: '3.5rem',
        borderRadius: '9999px',
        backgroundColor: '#25D366',
        boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.1)';
        (e.currentTarget as HTMLAnchorElement).style.boxShadow =
          '0 6px 20px rgba(0,0,0,0.30)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
        (e.currentTarget as HTMLAnchorElement).style.boxShadow =
          '0 4px 14px rgba(0,0,0,0.25)';
      }}
    >
      {/* WhatsApp SVG icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="28"
        height="28"
        fill="white"
        aria-hidden="true"
      >
        <path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.738 5.472 2.027 7.774L0 32l8.436-2.012A15.934 15.934 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.26 13.26 0 0 1-6.75-1.844l-.484-.287-5.009 1.195 1.22-4.874-.316-.5A13.253 13.253 0 0 1 2.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.903c-.398-.199-2.355-1.162-2.72-1.295-.365-.133-.631-.199-.897.2-.266.398-1.03 1.295-1.263 1.561-.232.266-.465.299-.863.1-.398-.2-1.681-.619-3.202-1.977-1.183-1.056-1.982-2.361-2.214-2.76-.232-.398-.025-.613.175-.812.179-.178.398-.465.597-.697.199-.232.266-.398.398-.664.133-.266.067-.498-.033-.697-.1-.199-.897-2.161-1.229-2.96-.323-.776-.65-.671-.897-.683l-.764-.013c-.266 0-.697.1-1.063.498-.365.398-1.395 1.362-1.395 3.323s1.429 3.855 1.628 4.121c.199.266 2.812 4.293 6.814 6.021.952.411 1.695.656 2.274.84.955.303 1.825.26 2.512.158.767-.114 2.355-.963 2.688-1.893.332-.93.332-1.728.232-1.893-.099-.165-.365-.265-.763-.464z" />
      </svg>
    </a>
  );
}
