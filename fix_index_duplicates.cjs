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
    
    // For Title
    const titleRegex = /<title[^>]*>.*?<\/title>/gi;
    const titles = html.match(titleRegex) || [];
    if (titles.length > 1) {
        // Find the one with data-rh="true" if it exists, otherwise keep the first one
        let keptTitle = titles.find(t => t.includes('data-rh="true"')) || titles[0];
        html = html.replace(titleRegex, '<!--TITLE_PLACEHOLDER-->');
        let first = true;
        html = html.replace(/<!--TITLE_PLACEHOLDER-->/g, () => {
            if (first) {
                first = false;
                return keptTitle;
            }
            return '';
        });
    }

    // For Description
    const descRegex = /<meta[^>]*name="description"[^>]*>/gi;
    const descs = html.match(descRegex) || [];
    if (descs.length > 1) {
        let keptDesc = descs.find(t => t.includes('data-rh="true"')) || descs[0];
        html = html.replace(descRegex, '<!--DESC_PLACEHOLDER-->');
        let first = true;
        html = html.replace(/<!--DESC_PLACEHOLDER-->/g, () => {
            if (first) {
                first = false;
                return keptDesc;
            }
            return '';
        });
    }
    
    // For Canonical
    const canonRegex = /<link[^>]*rel="canonical"[^>]*>/gi;
    const canons = html.match(canonRegex) || [];
    if (canons.length > 1) {
        let keptCanon = canons.find(t => t.includes('data-rh="true"')) || canons[0];
        html = html.replace(canonRegex, '<!--CANON_PLACEHOLDER-->');
        let first = true;
        html = html.replace(/<!--CANON_PLACEHOLDER-->/g, () => {
            if (first) {
                first = false;
                return keptCanon;
            }
            return '';
        });
    }

    fs.writeFileSync(filePath, html);
    console.log(`Cleaned ${filePath}`);
}

const files = findHtmlFiles('dist');
files.forEach(processHtml);

console.log('Creating tarball...');
execSync('tar -czf quero-meu-mcmv.tar.gz --exclude="node_modules" --exclude=".git" --exclude=".env*" --exclude="quero-meu-mcmv.tar.gz" .');
console.log('Done');
