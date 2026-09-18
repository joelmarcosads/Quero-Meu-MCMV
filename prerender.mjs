import puppeteer from 'puppeteer';
import { preview } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const routes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/politica-de-privacidade', priority: '0.5', changefreq: 'monthly' },
  { path: '/termos-de-uso', priority: '0.5', changefreq: 'monthly' },
  { path: '/reserva-dos-passaros-2', priority: '0.8', changefreq: 'weekly' },
  { path: '/prime-club-itaborai', priority: '0.8', changefreq: 'weekly' },
  { path: '/flores-de-maio', priority: '0.8', changefreq: 'weekly' },
  { path: '/solar-da-trindade', priority: '0.8', changefreq: 'weekly' },
  { path: '/residencial-florescer', priority: '0.8', changefreq: 'weekly' },
  { path: '/conquista-oceanica', priority: '0.8', changefreq: 'weekly' },
  { path: '/minha-casa-minha-vida-itaborai', priority: '0.9', changefreq: 'weekly' },
  { path: '/minha-casa-minha-vida-sao-goncalo', priority: '0.9', changefreq: 'weekly' },
  { path: '/financiamento-minha-casa-minha-vida', priority: '0.9', changefreq: 'monthly' },
  { path: '/sobre', priority: '0.8', changefreq: 'monthly' }
];

function cleanHtmlTags(html) {
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
            let keptTag = matches.find(t => t.includes('data-rh')) || matches[matches.length - 1];
            html = html.replace(tagConfig.regex, `<!--PLACEHOLDER_${tagConfig.name}-->`);
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
    return html;
}

async function prerender() {
  console.log('Starting preview server...');
  const server = await preview({
    preview: {
      port: 5000,
      host: 'localhost',
    }
  });
  console.log('Server started. Launching Puppeteer...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const distDir = path.resolve(__dirname, 'dist');
  let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  try {
    for (const route of routes) {
      const page = await browser.newPage();
      const actualPort = server.httpServer.address().port;
      const url = `http://localhost:${actualPort}${route.path}`;
      console.log(`Prerendering ${route.path}...`);
      
      await page.goto(url, { waitUntil: 'networkidle0' });
      
      try {
        // Wait for React to render (root div not empty) and Helmet to inject the title
        await page.waitForFunction(
          'document.title !== "" && document.querySelector("#root").childElementCount > 0', 
          { timeout: 10000 }
        );
      } catch (e) {
        console.log(`Timeout waiting for app to render on ${route.path}, proceeding anyway...`);
      }

      // Remove runtime GTM scripts serialized by Puppeteer
      await page.evaluate(() => {
        document
          .querySelectorAll('script[src*="googletagmanager.com/gtm.js"]')
          .forEach((script) => script.remove());
      });

      let html = await page.content();
      html = cleanHtmlTags(html);

      const routeDir = route.path === '/' ? distDir : path.join(distDir, route.path.slice(1));
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }

      const isRoot = route.path === '/';
      const filePath = isRoot ? path.join(distDir, 'index.prerendered.html') : path.join(routeDir, 'index.html');
      fs.writeFileSync(filePath, html);
      console.log(`Saved ${filePath}`);
      
      const siteUrl = route.path === '/' ? 'https://queromeumcmv.com.br/' : `https://queromeumcmv.com.br${route.path}`;
      sitemapXML += `  <url>\n    <loc>${siteUrl}</loc>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>\n`;
      
      await page.close();
    }
    
    sitemapXML += `</urlset>`;
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXML);
    console.log('Saved sitemap.xml');

    if (fs.existsSync(path.join(distDir, 'index.prerendered.html'))) {
      fs.renameSync(path.join(distDir, 'index.prerendered.html'), path.join(distDir, 'index.html'));
    }
    
    console.log('Prerendering complete!');
  } finally {
    console.log('Closing browser and server...');
    await browser.close();
    server.httpServer.close();
  }
}

prerender().catch(err => {
  console.error('Prerender error:', err);
  process.exit(1);
});
