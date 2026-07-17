import os
import re
import glob

def check_file(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Find all imports like: import name from '../assets/filename.webp'
    imports = re.findall(r"import\s+\w+\s+from\s+['\"](.*?)['\"]", content)
    
    for imp in imports:
        if 'assets' in imp:
            # Resolve path relative to file
            base_dir = os.path.dirname(file_path)
            resolved_path = os.path.normpath(os.path.join(base_dir, imp))
            if not os.path.exists(resolved_path):
                print(f"Error in {file_path}: Import {imp} resolves to {resolved_path}, which does not exist!")

files = glob.glob('src/**/*.tsx', recursive=True)
for f in files:
    check_file(f)
print("Finished checking imports.")
