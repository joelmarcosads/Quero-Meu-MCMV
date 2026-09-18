import re

with open('src/pages/SolarDaTrindade.tsx', 'r') as f:
    content = f.read()

# Replace Schema
old_schema = """        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "RealEstateListing",
              "name": "Solar da Trindade",
              "description": "Apartamentos de 2 Quartos em São Gonçalo",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "São Gonçalo",
                "addressRegion": "RJ",
                "addressCountry": "BR"
              },
              "offers": {
                "@type": "Offer",
                "priceCurrency": "BRL",
                "description": "Sinal a partir de R$ 1.000 com subsídio de até R$ 55 mil"
              }
            }
          `}
        </script>"""
        
new_schema = """        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "name": "Home",
                      "item": "https://queromeumcmv.com.br/"
                    },
                    {
                      "@type": "ListItem",
                      "position": 2,
                      "name": "MCMV São Gonçalo",
                      "item": "https://queromeumcmv.com.br/minha-casa-minha-vida-sao-goncalo"
                    },
                    {
                      "@type": "ListItem",
                      "position": 3,
                      "name": "Solar da Trindade",
                      "item": "https://queromeumcmv.com.br/solar-da-trindade"
                    }
                  ]
                },
                {
                  "@type": "RealEstateListing",
                  "name": "Solar da Trindade",
                  "description": "Apartamentos de 2 Quartos em São Gonçalo",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "São Gonçalo",
                    "addressRegion": "RJ",
                    "addressCountry": "BR"
                  },
                  "offers": {
                    "@type": "Offer",
                    "priceCurrency": "BRL",
                    "description": "Consulte condições, sujeito à análise de crédito"
                  }
                }
              ]
            }
          `}
        </script>"""

content = content.replace(old_schema, new_schema)

# Replace Hero
old_hero = """          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 w-full">
            <div className="max-w-3xl">
              
              <div className="inline-flex items-center space-x-2 bg-accent/20 border border-accent/50 text-orange-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">"""

new_hero = """          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 w-full">
            <div className="max-w-3xl">
              
              <nav className="text-sm font-medium text-slate-300 mb-6" aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center space-x-2">
                  <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                  <li><span className="mx-2">&gt;</span></li>
                  <li><a href="/minha-casa-minha-vida-sao-goncalo" className="hover:text-white transition-colors">São Gonçalo</a></li>
                  <li><span className="mx-2">&gt;</span></li>
                  <li className="text-orange-300" aria-current="page">Solar da Trindade</li>
                </ol>
              </nav>

              <div className="inline-flex items-center space-x-2 bg-accent/20 border border-accent/50 text-orange-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">"""
              
content = content.replace(old_hero, new_hero)

# Fix LCP img
content = content.replace('className="w-full h-full object-cover opacity-50"', 'className="w-full h-full object-cover opacity-50"\n              fetchPriority="high"')

with open('src/pages/SolarDaTrindade.tsx', 'w') as f:
    f.write(content)
