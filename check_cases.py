import os
import glob
import re

files = glob.glob('src/**/*.tsx', recursive=True)
assets = os.listdir('src/assets')
assets_lower = {a.lower(): a for a in assets}

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Find all imports from assets
    imports = re.findall(r"import\s+(\w+)\s+from\s+['\"](.*?)['\"]", content)
    for name, imp in imports:
        if 'assets' in imp:
            basename = os.path.basename(imp)
            # Check if this exact file exists
            resolved_path = os.path.normpath(os.path.join(os.path.dirname(file_path), imp))
            if not os.path.exists(resolved_path):
                print(f"CASE WARNING in {file_path}:")
                print(f"  Import: '{imp}'")
                print(f"  Resolved path: '{resolved_path}' does not exist.")
                if basename.lower() in assets_lower:
                    correct_name = assets_lower[basename.lower()]
                    print(f"  Did you mean: '{correct_name}'?")
                print("-" * 40)

print("Finished checking case-sensitivity.")
