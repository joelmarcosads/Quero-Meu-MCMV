import os

files_to_update = {
    'src/components/Properties.tsx': {
        'imports': [
            "import imgReserva from '../assets/Reserva-dos-passaros-2-card.webp';",
            "import imgPrime from '../assets/capa-do-site-prime-club-itaborai.webp';",
            "import imgFlores from '../assets/fachada-flores-de-maio.webp';",
            "import imgResidencial from '../assets/Fachada-Residencial-Florescer.webp';",
            "import imgSolar from '../assets/fachada-do-predio-entrada.webp';",
            "import imgConquista from '../assets/FACHADA-CONQUISTA-OCEANICA.webp';"
        ],
        'replacements': [
            ('image: "/reserva-dos-passaros-2/Reserva-dos-passaros-2-card.webp",', 'image: imgReserva,'),
            ('image: "/prime-club-itaborai/capa-do-site-prime-club-itaborai.webp",', 'image: imgPrime,'),
            ('image: "/flores-de-maio/fachada-flores-de-maio.webp",', 'image: imgFlores,'),
            ('image: "/residencial-florescer/Fachada-Residencial-Florescer.webp",', 'image: imgResidencial,'),
            ('image: "/solar-da-trindade/fachada-do-predio-entrada.webp",', 'image: imgSolar,'),
            ('image: "/conquista-oceanica/FACHADA-CONQUISTA-OCEANICA.webp",', 'image: imgConquista,')
        ]
    },
    'src/components/Hero.tsx': {
        'imports': [
            "import imgHeroBg from '../assets/bg-imperio-do-ouro-varanda.webp';"
        ],
        'replacements': [
            ('src="/home/bg-imperio-do-ouro-varanda.webp?v=2"', 'src={imgHeroBg}')
        ]
    }
}

for file_path, data in files_to_update.items():
    if not os.path.exists(file_path):
        continue
        
    with open(file_path, 'r') as f:
        content = f.read()
        
    # Insert imports after the last import statement
    lines = content.split('\n')
    last_import_idx = -1
    for i, line in enumerate(lines):
        if line.startswith('import '):
            last_import_idx = i
            
    if last_import_idx != -1:
        for imp in reversed(data['imports']):
            lines.insert(last_import_idx + 1, imp)
            
    new_content = '\n'.join(lines)
    
    # Replace src strings
    for old, new in data['replacements']:
        new_content = new_content.replace(old, new)
        
    with open(file_path, 'w') as f:
        f.write(new_content)

print("Components updated")
