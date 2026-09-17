const fs = require('fs');
const path = require('path');

const prerenderScript = fs.readFileSync('prerender.mjs', 'utf-8');

const injectionCode = `
    try {
      await page.waitForFunction('document.querySelector("title[data-rh=\\"true\\"]") !== null', { timeout: 10000 });
      await new Promise(r => setTimeout(r, 500));
      await page.evaluate(() => {
        const head = document.head;
        const rhTitles = head.querySelectorAll('title[data-rh="true"]');
        const allTitles = head.querySelectorAll('title');
        if (rhTitles.length > 0 && allTitles.length > rhTitles.length) {
           allTitles.forEach(t => { if (!t.hasAttribute('data-rh')) t.remove(); });
        }
        const rhDescs = head.querySelectorAll('meta[name="description"][data-rh="true"]');
        const allDescs = head.querySelectorAll('meta[name="description"]');
        if (rhDescs.length > 0 && allDescs.length > rhDescs.length) {
           allDescs.forEach(t => { if (!t.hasAttribute('data-rh')) t.remove(); });
        }
        const rhCanons = head.querySelectorAll('link[rel="canonical"][data-rh="true"]');
        const allCanons = head.querySelectorAll('link[rel="canonical"]');
        if (rhCanons.length > 0 && allCanons.length > rhCanons.length) {
           allCanons.forEach(t => { if (!t.hasAttribute('data-rh')) t.remove(); });
        }
      });
    } catch (e) {
      console.log(\`Timeout waiting for title on \${route.path}, proceeding anyway...\`);
    }
`;

const modifiedScript = prerenderScript.replace(
  /try {\s*await page\.waitForFunction\('document\.title !== ""', { timeout: 10000 }\);\s*\/\/ Add a slight delay for any other JS\s*await new Promise\(r => setTimeout\(r, 500\)\);\s*} catch \(e\) {\s*console\.log\(`Timeout waiting for title on \${route\.path}, proceeding anyway\.\.\.`\);\s*}/,
  injectionCode
);

fs.writeFileSync('prerender.mjs', modifiedScript);
console.log('Script updated');
