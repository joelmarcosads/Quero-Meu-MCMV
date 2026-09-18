import glob
import re

files = glob.glob('src/pages/*.tsx')

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    # Skip files that are not properties
    if "RealEstateListing" not in content or "BreadcrumbList" in content:
        continue
    
    # 1. Update Schema
    # Parse city and name
    city = "Itaboraí" if "Itaboraí" in content else "São Gonçalo"
    city_slug = "itaborai" if city == "Itaboraí" else "sao-goncalo"
    
    name_match = re.search(r'"name":\s*"([^"]+)"', content)
    name = name_match.group(1) if name_match else "Empreendimento"
    
    # We will just replace RealEstateListing block with a @graph block
    graph_replacement = f"""              "@graph": [
                {{
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    {{
                      "@type": "ListItem",
                      "position": 1,
                      "name": "Home",
                      "item": "https://queromeumcmv.com.br/"
                    }},
                    {{
                      "@type": "ListItem",
                      "position": 2,
                      "name": "MCMV {city}",
                      "item": "https://queromeumcmv.com.br/minha-casa-minha-vida-{city_slug}"
                    }},
                    {{
                      "@type": "ListItem",
                      "position": 3,
                      "name": "{name}",
                      "item": "https://queromeumcmv.com.br{file.replace('src/pages', '').replace('.tsx', '').lower()}"
                    }}
                  ]
                }},
                {{
                  "@type": "RealEstateListing","""
                  
    content = content.replace('"@type": "RealEstateListing",', graph_replacement)
    
    # Ensure it ends with ] correctly in the script block
    content = content.replace('}\n            }\n          `}\n        </script>', '}\n              ]\n            }\n          `}\n        </script>')
    content = content.replace('}\n          `}\n        </script>', '}\n              ]\n            }\n          `}\n        </script>')

    # 2. Add Visual Breadcrumb
    breadcrumb_html = f"""              <nav className="text-sm font-medium text-slate-300 mb-6" aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center space-x-2">
                  <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                  <li><span className="mx-2">&gt;</span></li>
                  <li><a href="/minha-casa-minha-vida-{city_slug}" className="hover:text-white transition-colors">MCMV {city}</a></li>
                  <li><span className="mx-2">&gt;</span></li>
                  <li className="text-orange-300" aria-current="page">{name}</li>
                </ol>
              </nav>\n\n              <div className="inline-flex"""
    content = content.replace('<div className="inline-flex', breadcrumb_html)
    
    # 3. Fix LCP
    content = content.replace('className="w-full h-full object-cover opacity-50"\n            />', 'className="w-full h-full object-cover opacity-50"\n              fetchPriority="high"\n            />')
    content = content.replace('className="w-full h-full object-cover opacity-50"/>', 'className="w-full h-full object-cover opacity-50" fetchPriority="high"/>')

    with open(file, 'w') as f:
        f.write(content)
        
    print(f"Fixed {file}")
