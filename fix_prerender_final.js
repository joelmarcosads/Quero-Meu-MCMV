const fs = require('fs');
let code = fs.readFileSync('prerender.mjs', 'utf-8');

const injection = `
    try {
      await page.waitForFunction('document.querySelector("title[data-rh=\\"true\\"]") !== null', { timeout: 10000 });
      await new Promise(r => setTimeout(r, 1000));
      
      let html = await page.content();
      
      html = html.replace(/<title[^>]*>.*?<\\/title>/gi, (match) => {
         return match.includes('data-rh') ? match : '';
      });
      html = html.replace(/<meta[^>]*name="description"[^>]*>/gi, (match) => {
         return match.includes('data-rh') ? match : '';
      });
      html = html.replace(/<link[^>]*rel="canonical"[^>]*>/gi, (match) => {
         return match.includes('data-rh') ? match : '';
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

code = code.replace(
  /try \{\s*await page\.waitForFunction\('document\.title !== ""'.*?console\.log\(`Saved \$\{filePath\}`\);\s*/s,
  injection
);

fs.writeFileSync('prerender.mjs', code);
