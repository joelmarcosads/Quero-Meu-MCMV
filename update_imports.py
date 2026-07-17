import os
import re

files_to_update = {
    'src/pages/ConquistaOceanica.tsx': {
        'imports': [
            "import imgFachada from '../assets/FACHADA-CONQUISTA-OCEANICA.webp';",
            "import imgPiscina from '../assets/PISCINA-CONQUISTA-OCEANICA.webp';",
            "import imgChurrasqueira from '../assets/CHURRASQUEIRA-CONQUISTA-OCEANICA.webp';"
        ],
        'replacements': [
            ('src="/conquista-oceanica/FACHADA-CONQUISTA-OCEANICA.webp"', 'src={imgFachada}'),
            ('src="/conquista-oceanica/PISCINA-CONQUISTA-OCEANICA.webp"', 'src={imgPiscina}'),
            ('src="/conquista-oceanica/CHURRASQUEIRA-CONQUISTA-OCEANICA.webp"', 'src={imgChurrasqueira}')
        ]
    },
    'src/pages/FloresDeMaio.tsx': {
        'imports': [
            "import imgFachada from '../assets/fachada-flores-de-maio.webp';",
            "import imgMapa from '../assets/mapa-da-localizacao-flores-de-maio.webp';"
        ],
        'replacements': [
            ('src="/flores-de-maio/fachada-flores-de-maio.webp"', 'src={imgFachada}'),
            ('src="/flores-de-maio/mapa-da-localizacao-flores-de-maio.webp"', 'src={imgMapa}')
        ]
    },
    'src/pages/PrimeClubItaborai.tsx': {
        'imports': [
            "import imgCapa from '../assets/capa-do-site-prime-club-itaborai.webp';",
            "import imgPiscina from '../assets/area-de-lazer-com-piscina-prime-club-itaborai.webp';",
            "import imgLocalizacao from '../assets/localizacao-prime-club-itaborai.webp';"
        ],
        'replacements': [
            ('src="/prime-club-itaborai/capa-do-site-prime-club-itaborai.webp"', 'src={imgCapa}'),
            ('src="/prime-club-itaborai/area-de-lazer-com-piscina-prime-club-itaborai.webp"', 'src={imgPiscina}'),
            ('src="/prime-club-itaborai/localizacao-prime-club-itaborai.webp"', 'src={imgLocalizacao}')
        ]
    },
    'src/pages/ReservaDosPassaros2.tsx': {
        'imports': [
            "import imgFachada from '../assets/Fachada-da-casa-Reserva-dos-Passaros.webp';",
            "import imgPiscina from '../assets/Piscina-Reserva-dos-Passaros-2.webp';",
            "import imgMapa from '../assets/Mapa-Reserva-dos-Passaros-2.webp';"
        ],
        'replacements': [
            ('src="/reserva-dos-passaros-2/Fachada-da-casa-Reserva-dos-Passaros.webp"', 'src={imgFachada}'),
            ('src="/reserva-dos-passaros-2/Piscina-Reserva-dos-Passaros-2.webp"', 'src={imgPiscina}'),
            ('src="/reserva-dos-passaros-2/Mapa-Reserva-dos-Passaros-2.webp"', 'src={imgMapa}')
        ]
    },
    'src/pages/ResidencialFlorescer.tsx': {
        'imports': [
            "import imgFachada from '../assets/Fachada-Residencial-Florescer.webp';",
            "import imgSala from '../assets/Sala-de-tv_1.webp';",
            "import imgShopping from '../assets/Shooping-Partage.jpg';"
        ],
        'replacements': [
            ('src="/residencial-florescer/Fachada-Residencial-Florescer.webp"', 'src={imgFachada}'),
            ('src="/shared/Sala-de-tv_1.webp"', 'src={imgSala}'),
            ('src="/shared/Shooping-Partage.jpg"', 'src={imgShopping}')
        ]
    },
    'src/pages/SolarDaTrindade.tsx': {
        'imports': [
            "import imgFachada from '../assets/fachada-do-predio-entrada.webp';",
            "import imgMapa from '../assets/mapa-da-regiao.webp';"
        ],
        'replacements': [
            ('src="/solar-da-trindade/fachada-do-predio-entrada.webp"', 'src={imgFachada}'),
            ('src="/solar-da-trindade/mapa-da-regiao.webp"', 'src={imgMapa}')
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

print("Update complete")
