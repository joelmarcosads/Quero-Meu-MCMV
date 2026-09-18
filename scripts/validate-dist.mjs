import fs from 'fs';
import path from 'path';

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

let hasErrors = false;

const files = findHtmlFiles('dist');
for (const file of files) {
    const html = fs.readFileSync(file, 'utf-8');
    let route = file.replace('dist/', '').replace('/index.html', '').replace('index.html', '/');
    if (!route.startsWith('/')) route = '/' + route;
    
    console.log(`[VALIDATING] ${route}`);
    
    // Check for GTM
    const gtmId = 'GTM-TQ6T5V7K';
    const hasGtmBootstrap = html.includes(gtmId);
    const hasGtmNoscript = html.includes('ns.html?id=GTM-TQ6T5V7K');
    const gtmScripts = [...html.matchAll(/<script[^>]*src="[^"]*googletagmanager\.com\/gtm\.js[^"]*"[^>]*>/gi)].length;
    
    console.log(`  GTM ID: ${hasGtmBootstrap}`);
    console.log(`  noscript: ${hasGtmNoscript}`);
    console.log(`  serialized scripts: ${gtmScripts}`);
    
    if (!hasGtmBootstrap || !hasGtmNoscript || gtmScripts > 0) {
        hasErrors = true;
        console.error(`  ERROR: GTM integration is incorrect on ${route}`);
    }
    
    // Check tags uniqueness
    const tagsToCheck = [
        { regex: /<title[^>]*>.*?<\/title>/gi, name: 'Title' },
        { regex: /<meta[^>]*name="description"[^>]*>/gi, name: 'Description' },
        { regex: /<link[^>]*rel="canonical"[^>]*>/gi, name: 'Canonical' },
        { regex: /<meta[^>]*property="og:title"[^>]*>/gi, name: 'og:title' },
        { regex: /<meta[^>]*property="og:description"[^>]*>/gi, name: 'og:description' },
        { regex: /<meta[^>]*property="og:url"[^>]*>/gi, name: 'og:url' },
        { regex: /<h1[^>]*>([\s\S]*?)<\/h1>/gi, name: 'H1' },
    ];
    
    let ogUrl = null;
    let canonical = null;
    
    tagsToCheck.forEach(tagConfig => {
        const matches = [...html.matchAll(tagConfig.regex)];
        console.log(`  ${tagConfig.name}: ${matches.length}`);
        if (matches.length !== 1) {
            hasErrors = true;
            console.error(`  ERROR: ${tagConfig.name} found ${matches.length} times on ${route}`);
        } else {
            if (tagConfig.name === 'Canonical') {
                const hrefMatch = matches[0][0].match(/href="([^"]+)"/i);
                if (hrefMatch) canonical = hrefMatch[1];
            } else if (tagConfig.name === 'og:url') {
                const contentMatch = matches[0][0].match(/content="([^"]+)"/i);
                if (contentMatch) ogUrl = contentMatch[1];
            }
        }
    });
    
    const expectedCanonical = `https://queromeumcmv.com.br${route === '/' ? '' : route}`;
    if (canonical && canonical !== expectedCanonical) {
        if (!(route === '/' && canonical === 'https://queromeumcmv.com.br/')) {
            hasErrors = true;
            console.error(`  ERROR: Canonical mismatch. Expected ${expectedCanonical}, got ${canonical}`);
        }
    }
    
    if (ogUrl && ogUrl !== canonical) {
        hasErrors = true;
        console.error(`  ERROR: og:url mismatch. Expected ${canonical}, got ${ogUrl}`);
    }
    
    
    // Check visual breadcrumbs for Maricá
    if (route === '/conquista-oceanica' && html.includes('MCMV São Gonçalo')) {
       if (html.indexOf('MCMV São Gonçalo') < html.indexOf('<main>') || html.indexOf('MCMV São Gonçalo') > html.indexOf('</main>')) {
           // allow in footer/header
       } else {
           hasErrors = true;
           console.error(`  ERROR: Conquista Oceânica HTML contains São Gonçalo in main content`);
       }
    }

    // JSON-LD
    const schemaMatches = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
    for (const match of schemaMatches) {
        try {
            const schema = JSON.parse(match[1]);
            // check breadcrumbs
            if (schema['@graph']) {
                const breadcrumb = schema['@graph'].find(item => item['@type'] === 'BreadcrumbList');
                if (breadcrumb) {
                    const badSlugs = ['/primeclubitaborai', '/floresdemaio', '/reservadospassaros2', '/residencialflorescer', '/conquistaoceanica'];
                    const hasBadSlug = breadcrumb.itemListElement.some(item => 
                        badSlugs.some(bad => item.item && item.item.includes(bad))
                    );
                    if (hasBadSlug) {
                        hasErrors = true;
                        console.error(`  ERROR: Breadcrumb contains old/bad slug on ${route}`);
                    }
                    if (route === '/conquista-oceanica') {
                         const hasSaoGoncalo = breadcrumb.itemListElement.some(item => item.name && item.name.includes('São Gonçalo'));
                         if (hasSaoGoncalo) {
                             hasErrors = true;
                             console.error(`  ERROR: Conquista Oceânica breadcrumb contains São Gonçalo`);
                         }
                    }
                }
            }
        } catch (e) {
            hasErrors = true;
            console.error(`  ERROR: Invalid JSON-LD Schema on ${route}:`, e.message);
        }
    }
    console.log("-".repeat(40));
}

if (hasErrors) {
    console.error("VALIDATION FAILED!");
    process.exit(1);
} else {
    console.log("VALIDATION PASSED!");
}
