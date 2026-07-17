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
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white">
      <Helmet>
        <title>Imóveis Minha Casa Minha Vida no RJ | São Gonçalo, Itaboraí e Maricá</title>
        <meta name="description" content="Saia do aluguel com o Minha Casa Minha Vida! Conheça os melhores apartamentos e casas em São Gonçalo, Itaboraí e Maricá com condições especiais e subsídio." />
        <meta name="keywords" content="Minha casa minha vida, apartamentos, São Gonçalo, Itaboraí, Maricá, imóveis, financiamento Caixa, subsídio" />
        <link rel="canonical" href="https://www.queromeumcmv.com.br/" />
        <meta property="og:title" content="Imóveis Minha Casa Minha Vida no RJ | Saia do Aluguel" />
        <meta property="og:description" content="Conheça os melhores apartamentos e casas em São Gonçalo, Itaboraí e Maricá com o programa Minha Casa Minha Vida. Subsídio da Caixa e condições exclusivas." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.queromeumcmv.com.br/shared/CAPA-OPEN-GRAPH.webp" />
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="Rio de Janeiro" />
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
