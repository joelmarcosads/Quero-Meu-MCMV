const fs = require('fs');
const path = require('path');

const prerenderScript = fs.readFileSync('prerender.mjs', 'utf-8');

const injectionCode = `
    try {
      await page.waitForFunction('document.querySelector("title[data-rh=\\"true\\"]") !== null', { timeout: 10000 });
      await new Promise(r => setTimeout(r, 1000));
      
      let html = await page.content();
      
      // Strict regex replacement to strip duplicate titles and descriptions that are hardcoded without data-rh="true"
      html = html.replace(/<title>.*?<\\/title>/g, match => {
        if (match.includes('data-rh="true"')) return match;
        return '';
      });
      
      html = html.replace(/<meta name="description" content="[^"]*"(?:\\s*\\/?)>/g, match => {
        if (match.includes('data-rh="true"')) return match;
        return '';
      });
      
      const routeDir = route.path === '/' ? distDir : path.join(distDir, route.path.slice(1));
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      const filePath = path.join(routeDir, 'index.html');
      fs.writeFileSync(filePath, html);
      console.log(\`Saved \${filePath}\`);
      
    } catch (e) {
      console.log(\`Timeout waiting for title on \${route.path}, proceeding anyway...\`);
    }
`;

const modifiedScript = prerenderScript.replace(
  /try \{\s*await page\.waitForFunction\('document\.querySelector.*?console\.log\(`Saved \$\{filePath\}`\);\s*/s,
  injectionCode
);

fs.writeFileSync('prerender.mjs', modifiedScript);
console.log('Script updated with regex cleaner');
