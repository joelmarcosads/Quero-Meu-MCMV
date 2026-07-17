import glob
import re

files = glob.glob('src/**/*.tsx', recursive=True)

for file in files:
    with open(file, 'r') as f:
        content = f.read()
    
    # We want to add loading="lazy" to <img> tags that don't already have it,
    # except maybe the hero background image.
    
    # Find all <img ... /> or <img ...>
    # Note: React uses self-closing <img ... /> or regular <img ...>
    # But in TSX it's always self-closing or <img ...>...</img (not valid HTML for img)>
    
    # Simple replace: if it's an <img> tag without loading="lazy", add it.
    if 'Hero.tsx' not in file:
        content = re.sub(r'<img(?![^>]*loading=[\'"]lazy[\'"])([^>]*)>', r'<img loading="lazy"\1>', content)
        with open(file, 'w') as f:
            f.write(content)
