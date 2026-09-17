const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findHtmlFiles(filePath, fileList);
    } else if (filePath.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function processHtml(filePath) {
    if (!fs.existsSync(filePath)) return;
    let html = fs.readFileSync(filePath, 'utf-8');
    
    const tagsToClean = [
        { regex: /<title[^>]*>.*?<\/title>/gi, name: 'Title' },
        { regex: /<meta[^>]*name="description"[^>]*>/gi, name: 'Description' },
        { regex: /<link[^>]*rel="canonical"[^>]*>/gi, name: 'Canonical' },
        { regex: /<meta[^>]*property="og:title"[^>]*>/gi, name: 'og:title' },
        { regex: /<meta[^>]*property="og:description"[^>]*>/gi, name: 'og:description' },
        { regex: /<meta[^>]*property="og:url"[^>]*>/gi, name: 'og:url' },
        { regex: /<meta[^>]*property="og:image"[^>]*>/gi, name: 'og:image' },
        { regex: /<meta[^>]*property="og:image:alt"[^>]*>/gi, name: 'og:image:alt' },
        { regex: /<meta[^>]*name="geo\.region"[^>]*>/gi, name: 'geo.region' },
        { regex: /<meta[^>]*name="geo\.placename"[^>]*>/gi, name: 'geo.placename' },
    ];

    tagsToClean.forEach(tagConfig => {
        const matches = html.match(tagConfig.regex) || [];
        if (matches.length > 1) {
            // Find the one with data-rh="true", if not found, use the last one since Helmet appends
            let keptTag = matches.find(t => t.includes('data-rh')) || matches[matches.length - 1];
            
            // First pass: replace all tags with a unique placeholder
            html = html.replace(tagConfig.regex, `<!--PLACEHOLDER_${tagConfig.name}-->`);
            
            // Second pass: replace the FIRST placeholder with our kept tag, and remove the others
            let first = true;
            html = html.replace(new RegExp(`<!--PLACEHOLDER_${tagConfig.name}-->`, 'g'), () => {
                if (first) {
                    first = false;
                    return keptTag;
                }
                return '';
            });
        }
    });

    fs.writeFileSync(filePath, html);
    console.log(`Cleaned ${filePath}`);
}

const files = findHtmlFiles('dist');
files.forEach(processHtml);

console.log('Creating tarball...');
execSync('tar -czf quero-meu-mcmv.tar.gz --exclude="node_modules" --exclude=".git" --exclude=".env*" --exclude="quero-meu-mcmv.tar.gz" .');
console.log('Done');
