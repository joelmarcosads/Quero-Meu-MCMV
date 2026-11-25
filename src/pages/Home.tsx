import Header from '../components/Header';
import Hero from '../components/Hero';
import McmvRules from '../components/McmvRules';
import McmvHighlights from '../components/McmvHighlights';
import Steps from '../components/Steps';
import Properties from '../components/Properties';
import FAQ from '../components/FAQ';
import MapaItaborai from '../components/MapaItaborai';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Minha Casa Minha Vida em Itaboraí e Região | Quero Meu MCMV</title>
        <meta name="description" content="Descubra quanto falta para sair do aluguel: apartamentos Minha Casa Minha Vida em Itaboraí, São Gonçalo e Niterói, com subsídio de até R$ 55 mil." />
        <link rel="canonical" href="https://queromeumcmv.com.br/" />
<meta property="og:site_name" content="Quero Meu MCMV" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:title" content="Minha Casa Minha Vida em Itaboraí e Região | Quero Meu MCMV" />
        <meta property="og:description" content="Descubra quanto falta para sair do aluguel: apartamentos Minha Casa Minha Vida em Itaboraí, São Gonçalo e Niterói, com subsídio de até R$ 55 mil." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://queromeumcmv.com.br/" />
        <meta property="og:image" content="https://queromeumcmv.com.br/capa-site-quero-meu-mcmv-open-graph.webp" />
        <meta property="og:image:alt" content="Quero Meu MCMV - Apartamentos e Lançamentos Minha Casa Minha Vida em Itaboraí" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Minha Casa Minha Vida em Itaboraí e Região | Quero Meu MCMV" />
        <meta name="twitter:description" content="Descubra quanto falta para sair do aluguel: apartamentos Minha Casa Minha Vida em Itaboraí, São Gonçalo e Niterói, com subsídio de até R$ 55 mil." />
        <meta name="twitter:image" content="https://queromeumcmv.com.br/capa-site-quero-meu-mcmv-open-graph.webp" />
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="Itaboraí" />
        <link rel="preload" as="image" href="/imperio-do-ouro-mrv-mobile.webp" media="(max-width: 600px)" fetchPriority="high" />
        <link rel="preload" as="image" href="/imperio-do-ouro-mrv-desktop.webp" media="(min-width: 601px)" fetchPriority="high" />
      </Helmet>
      <Header />
      <main id="main-content">
        <Hero />
        <McmvRules />
        <McmvHighlights />
        <Steps />
        <Properties />
        <FAQ />
        <MapaItaborai />
      </main>
      <Footer />
    </div>
  );
}
