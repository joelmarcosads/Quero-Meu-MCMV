import os
import glob

files = glob.glob('src/pages/*.tsx')

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    new_content = content.replace('capa-open-graph-facebook.jpg', 'capa-site-quero-meu-mcmv-open-graph.webp')
    
    if new_content != content:
        with open(file, 'w') as f:
            f.write(new_content)
        print(f"Updated {file}")
