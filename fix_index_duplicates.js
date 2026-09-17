const fs = require('fs');

function processHtml(filePath) {
    if (!fs.existsSync(filePath)) return;
    let html = fs.readFileSync(filePath, 'utf-8');
    
    // For Title
    const titleRegex = /<title[^>]*>.*?<\/title>/gi;
    const titles = html.match(titleRegex) || [];
    if (titles.length > 1) {
        // Find the one with data-rh="true" if it exists, otherwise keep the first one
        let keptTitle = titles.find(t => t.includes('data-rh="true"')) || titles[0];
        // Remove all titles first
        html = html.replace(titleRegex, '<!--TITLE_PLACEHOLDER-->');
        // Replace only the FIRST placeholder with our kept title, and remove the rest
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

const glob = require('glob');
glob('dist/**/*.html', (err, files) => {
    if (err) {
        console.error(err);
        return;
    }
    files.forEach(processHtml);
    
    // Finally create the tarball
    const { execSync } = require('child_process');
    console.log('Creating tarball...');
    execSync('tar -czf quero-meu-mcmv.tar.gz --exclude="node_modules" --exclude=".git" --exclude=".env*" --exclude="quero-meu-mcmv.tar.gz" .');
    console.log('Done');
});
