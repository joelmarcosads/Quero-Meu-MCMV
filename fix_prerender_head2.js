const fs = require('fs');

const prerenderScript = fs.readFileSync('prerender.mjs', 'utf-8');

const injectionCode = `
    try {
      await page.waitForFunction('document.querySelector("title[data-rh=\\"true\\"]") !== null', { timeout: 10000 });
      await new Promise(r => setTimeout(r, 1000));
      
      // Strict cleanup of ANY duplicate titles or descriptions that don't have data-rh="true"
      await page.evaluate(() => {
        const head = document.head;
        const allTitles = Array.from(head.querySelectorAll('title'));
        const rhTitles = allTitles.filter(t => t.hasAttribute('data-rh'));
        if (rhTitles.length > 0) {
           allTitles.forEach(t => { if (!t.hasAttribute('data-rh')) t.remove(); });
        }
        
        const allDescs = Array.from(head.querySelectorAll('meta[name="description"]'));
        const rhDescs = allDescs.filter(t => t.hasAttribute('data-rh'));
        if (rhDescs.length > 0) {
           allDescs.forEach(t => { if (!t.hasAttribute('data-rh')) t.remove(); });
        }
        
        const allCanons = Array.from(head.querySelectorAll('link[rel="canonical"]'));
        const rhCanons = allCanons.filter(t => t.hasAttribute('data-rh'));
        if (rhCanons.length > 0) {
           allCanons.forEach(t => { if (!t.hasAttribute('data-rh')) t.remove(); });
        }
        
        // Remove trailing VITE injected generic title if present
        const endTitles = Array.from(head.querySelectorAll('title'));
        if(endTitles.length > 1) {
           // keep only the first one
           endTitles.slice(1).forEach(t => t.remove());
        }
      });
      
    } catch (e) {
      console.log(\`Timeout waiting for title on \${route.path}, proceeding anyway...\`);
    }
`;

const modifiedScript = prerenderScript.replace(
  /try \{\s*await page\.waitForFunction\('document\.querySelector[^}]*\} catch \(e\) \{\s*console\.log\(`Timeout waiting for title on \${route\.path}, proceeding anyway\.\.\.`\);\s*\}/s,
  injectionCode
);

fs.writeFileSync('prerender.mjs', modifiedScript);
console.log('Script updated successfully');
