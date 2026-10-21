import { Suspense } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import McmvRules from '../components/McmvRules';
import McmvHighlights from '../components/McmvHighlights';
import Steps from '../components/Steps';
import Properties from '../components/Properties';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://queromeumcmv.com.br/#website",
        "url": "https://queromeumcmv.com.br/",
        "name": "Quero Meu MCMV",
        "description": "Encontre apartamentos Minha Casa Minha Vida em Itaboraí e São Gonçalo. Consulte empreendimentos, financiamento, FGTS, subsídio e condições disponíveis.",
        "publisher": {
          "@id": "https://queromeumcmv.com.br/#organization"
        }
      },
      {
        "@type": "RealEstateAgent",
        "@id": "https://queromeumcmv.com.br/#organization",
        "name": "Joel Marcos - Corretor de Imóveis MCMV",
        "legalName": "Joel Marcos dos Santos",
        "image": "https://queromeumcmv.com.br/capa-site-quero-meu-mcmv-open-graph.webp",
        "url": "https://queromeumcmv.com.br/",
        "telephone": "+55 21 96592-8399",
        "priceRange": "R$ 150.000 - R$ 350.000",
        "openingHours": "Mo-Sa 08:00-20:00",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Rua H, nº 492, Retiro São Joaquim",
          "addressLocality": "Itaboraí",
          "addressRegion": "RJ",
          "postalCode": "24.813-066",
          "addressCountry": "BR"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": -22.7444,
          "longitude": -42.8597
        },
        "areaServed": ["Itaboraí", "São Gonçalo", "Niterói", "Maricá", "Rio de Janeiro"],
        "knowsAbout": [
          "Minha Casa Minha Vida",
          "Financiamento Caixa Econômica Federal",
          "Subsídio Habitacional",
          "FGTS na Compra do Imóvel",
          "Apartamentos em Itaboraí e São Gonçalo"
        ],
        "identifier": [
          {
            "@type": "PropertyValue",
            "name": "CRECI",
            "value": "39.583F"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://queromeumcmv.com.br/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Posso compor renda com outra pessoa?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sim! Você pode juntar sua renda com familiares (cônjuge, pais, irmãos, filhos) ou até mesmo com amigos e namorado(a) para alcançar o valor necessário e aumentar suas chances de aprovação no financiamento Caixa."
            }
          },
          {
            "@type": "Question",
            "name": "Sou autônomo e não tenho carteira assinada. Posso participar?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Com certeza! Trabalhadores informais, autônomos e MEIs podem comprar seu imóvel. A comprovação de renda é feita através de extratos bancários de pessoa física dos últimos 6 meses e declaração de Imposto de Renda."
            }
          },
          {
            "@type": "Question",
            "name": "Como funciona o uso do FGTS?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Você pode utilizar o saldo do seu FGTS como parte do pagamento da entrada no imóvel, ajudando a diminuir o valor necessário à vista, ou para abater o saldo devedor e parcelas do financiamento."
            }
          },
          {
            "@type": "Question",
            "name": "O que é o subsídio do governo?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "O subsídio é um benefício financeiro (desconto a fundo perdido) concedido pelo Governo Federal para ajudar famílias de menor renda. O desconto pode chegar a até R$ 55.000, conforme a renda familiar e o município do imóvel."
            }
          },
          {
            "@type": "Question",
            "name": "Quanto tempo demora a aprovação do banco?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Com a documentação completa em mãos, a resposta preliminar de análise de crédito pela Caixa Econômica Federal costuma sair em até 48 horas úteis."
            }
          }
        ]
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
        <meta property="og:site_name" content="Quero Meu MCMV" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:title" content="Minha Casa Minha Vida em Itaboraí e São Gonçalo | Quero Meu MCMV" />
        <meta property="og:description" content="Encontre apartamentos Minha Casa Minha Vida em Itaboraí e São Gonçalo. Consulte empreendimentos, financiamento, FGTS, subsídio e condições disponíveis." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://queromeumcmv.com.br/" />
        <meta property="og:image" content="https://queromeumcmv.com.br/capa-site-quero-meu-mcmv-open-graph.webp" />
        <meta property="og:image:alt" content="Quero Meu MCMV - Apartamentos e Lançamentos em Itaboraí e São Gonçalo" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Minha Casa Minha Vida em Itaboraí e São Gonçalo | Quero Meu MCMV" />
        <meta name="twitter:description" content="Encontre apartamentos Minha Casa Minha Vida em Itaboraí e São Gonçalo. Consulte empreendimentos, financiamento, FGTS, subsídio e condições disponíveis." />
        <meta name="twitter:image" content="https://queromeumcmv.com.br/capa-site-quero-meu-mcmv-open-graph.webp" />
        <meta name="geo.region" content="BR-RJ" />
        <meta name="geo.placename" content="Itaboraí, São Gonçalo" />
        <link rel="preload" as="image" href="/imperio-do-ouro-mrv-mobile.webp" media="(max-width: 600px)" fetchPriority="high" />
        <link rel="preload" as="image" href="/imperio-do-ouro-mrv-desktop.webp" media="(min-width: 601px)" fetchPriority="high" />
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
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
