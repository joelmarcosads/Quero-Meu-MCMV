import os
import glob
from bs4 import BeautifulSoup
import json

files = glob.glob('dist/**/*.html', recursive=True)
results = []

for file in files:
    with open(file, 'r') as f:
        html = f.read()
    
    soup = BeautifulSoup(html, 'html.parser')
    
    title = soup.title.string if soup.title else 'MISSING'
    h1 = soup.h1.text.strip() if soup.h1 else 'MISSING'
    canonical = soup.find('link', rel='canonical')
    canonical = canonical['href'] if canonical else 'MISSING'
    desc = soup.find('meta', attrs={'name': 'description'})
    desc = desc['content'] if desc else 'MISSING'
    og_url = soup.find('meta', attrs={'property': 'og:url'})
    og_url = og_url['content'] if og_url else 'MISSING'
    og_image = soup.find('meta', attrs={'property': 'og:image'})
    og_image = og_image['content'] if og_image else 'MISSING'
    
    schema_tags = soup.find_all('script', type='application/ld+json')
    schema = 'VALID' if schema_tags else 'MISSING'
    for tag in schema_tags:
        try:
            json.loads(tag.string)
        except:
            schema = 'INVALID'
            
    # GTM check
    gtm_head = 'GTM-TQ6T5V7K' in html
    
    # 404 behavior - the file should represent a route, if not it's just index.html
    # but we are checking generated routes.
    
    route = file.replace('dist/', '').replace('/index.html', '').replace('index.html', '/')
    if not route.startswith('/'): route = '/' + route
    
    results.append({
        'Route': route,
        'File': file,
        'Title': title,
        'H1': h1,
        'Canonical': canonical,
        'OG_URL': og_url,
        'Schema': schema,
        'GTM': gtm_head
    })

for r in results:
    print(f"[{r['Route']}]")
    print(f"Title: {r['Title']}")
    print(f"H1: {r['H1']}")
    print(f"Canonical: {r['Canonical']}")
    print(f"OG URL: {r['OG_URL']}")
    print(f"Schema: {r['Schema']}")
    print(f"GTM: {r['GTM']}")
    print("-" * 40)
