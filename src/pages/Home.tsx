import { Suspense } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import McmvRules from '../components/McmvRules';
import McmvHighlights from '../components/McmvHighlights';
import Steps from '../components/Steps';
import Properties from '../components/Properties';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "Quero Meu MCMV",
    "image": "https://queromeumcmv.com.br/capa-open-graph-facebook.jpg",
    "@id": "https://queromeumcmv.com.br/",
    "url": "https://queromeumcmv.com.br/",
    "telephone": "+55 21 96592-8399",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Rua H, nº 492, Retiro São Joaquim",
      "addressLocality": "Itaboraí",
      "addressRegion": "RJ",
      "postalCode": "24.813-066",
      "addressCountry": "BR"
    },
    "areaServed": ["Itaboraí", "São Gonçalo", "Niterói", "Maricá"],
    "identifier": [
      {
        "@type": "PropertyValue",
        "name": "CRECI",
        "value": "39.583F"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Minha Casa Minha Vida em Itaboraí e São Gonçalo | Quero Meu MCMV</title>
        <meta name="description" content="Encontre apartamentos Minha Casa Minha Vida em Itaboraí e São Gonçalo. Consulte empreendimentos, financiamento, FGTS, subsídio e condições disponíveis." />
        <link rel="canonical" href="https://queromeumcmv.com.br/" />
        <meta property="fb:app_id" content="966242223397117" />
        <meta property="og:title" content="Minha Casa Minha Vida em Itaboraí e São Gonçalo | Quero Meu MCMV" />
        <meta property="og:description" content="Encontre apartamentos Minha Casa Minha Vida em Itaboraí e São Gonçalo. Consulte empreendimentos, financiamento, FGTS, subsídio e condições disponíveis." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://queromeumcmv.com.br/" />
        <meta property="og:image" content="https://queromeumcmv.com.br/capa-open-graph-facebook.jpg" />
        <meta property="og:image:alt" content="Quero Meu MCMV - Apartamentos e Lançamentos em Itaboraí e São Gonçalo" />
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="Itaboraí, São Gonçalo" />
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      </Helmet>
      <Header />
      <main>
        <Hero />
        <McmvRules />
        <McmvHighlights />
        <Steps />
        <Properties />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
