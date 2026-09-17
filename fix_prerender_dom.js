const fs = require('fs');

const prerenderScript = fs.readFileSync('prerender.mjs', 'utf-8');

const injectionCode = `
    try {
      await page.waitForFunction('document.querySelector("title[data-rh=\\"true\\"]") !== null', { timeout: 10000 });
      await new Promise(r => setTimeout(r, 1000));
      
      // Strict DOM evaluation to delete all tags in head that do not have data-rh="true" IF there is at least one tag of that type WITH data-rh="true"
      await page.evaluate(() => {
        const head = document.head;
        const allTitles = Array.from(head.querySelectorAll('title'));
        const rhTitles = allTitles.filter(t => t.hasAttribute('data-rh'));
        if (rhTitles.length > 0) {
           allTitles.forEach(t => { if (!t.hasAttribute('data-rh')) t.remove(); });
        } else if (allTitles.length > 1) {
           // fallback: if no data-rh (like home), keep only the last one
           allTitles.slice(0, allTitles.length - 1).forEach(t => t.remove());
        }
        
        const allDescs = Array.from(head.querySelectorAll('meta[name="description"]'));
        const rhDescs = allDescs.filter(t => t.hasAttribute('data-rh'));
        if (rhDescs.length > 0) {
           allDescs.forEach(t => { if (!t.hasAttribute('data-rh')) t.remove(); });
        } else if (allDescs.length > 1) {
           allDescs.slice(0, allDescs.length - 1).forEach(t => t.remove());
        }
        
        const allCanons = Array.from(head.querySelectorAll('link[rel="canonical"]'));
        const rhCanons = allCanons.filter(t => t.hasAttribute('data-rh'));
        if (rhCanons.length > 0) {
           allCanons.forEach(t => { if (!t.hasAttribute('data-rh')) t.remove(); });
        } else if (allCanons.length > 1) {
           allCanons.slice(0, allCanons.length - 1).forEach(t => t.remove());
        }
      });
      
    } catch (e) {
      console.log(\`Timeout waiting for title on \${route.path}, proceeding anyway...\`);
    }
`;

const modifiedScript = prerenderScript.replace(
  /try \{\s*await page\.waitForFunction\('document\.title !== ""', \{ timeout: 10000 \}\);\s*\/\/[^\n]*\s*await new Promise[^}]*\} catch \(e\) \{\s*console\.log[^}]*\}/s,
  injectionCode
);

fs.writeFileSync('prerender.mjs', modifiedScript);
console.log('Script updated successfully');
