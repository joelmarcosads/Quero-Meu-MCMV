import glob
import re

files = glob.glob('src/pages/*.tsx')

for file in files:
    with open(file, 'r') as f:
        content = f.read()

    # The first image is the LCP. Let's find the first <img tag and replace loading="lazy" with fetchPriority="high"
    # Actually, let's just find the first occurrence of <img loading="lazy" and replace it with <img fetchPriority="high"
    content = content.replace('<img loading="lazy"', '<img fetchPriority="high"', 1)
    
    with open(file, 'w') as f:
        f.write(content)
        
    print(f"Fixed {file}")
