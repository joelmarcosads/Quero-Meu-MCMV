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
  
  // Create sitemap
  let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  const today = new Date().toISOString().split('T')[0];

  for (const route of routes) {
    const page = await browser.newPage();
    const url = `http://localhost:5000${route.path}`;
    console.log(`Prerendering ${route.path}...`);
    
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    // Wait for react-helmet-async to finish its work
    // We check if title is not empty, since we removed the original one.
    // If it takes too long, we timeout and proceed, but it should happen fast.
    try {
      await page.waitForFunction('document.title !== ""', { timeout: 10000 });
      // Add a slight delay for any other JS
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.log(`Timeout waiting for title on ${route.path}, proceeding anyway...`);
    }

    let html = await page.content();

    // The route can be `/` or `/something`
    const routeDir = route.path === '/' ? distDir : path.join(distDir, route.path.slice(1));
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }

    const filePath = path.join(routeDir, 'index.html');
    fs.writeFileSync(filePath, html);
    console.log(`Saved ${filePath}`);
    
    // Add to sitemap
    const siteUrl = route.path === '/' ? 'https://queromeumcmv.com.br/' : `https://queromeumcmv.com.br${route.path}`;
    sitemapXML += `  <url>\n    <loc>${siteUrl}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>\n`;
    
    await page.close();
  }

  sitemapXML += `</urlset>`;
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXML);
  console.log('Saved sitemap.xml');

  await browser.close();
  server.httpServer.close();
  console.log('Prerendering complete!');
}

prerender().catch(err => {
  console.error('Prerender error:', err);
  process.exit(1);
});
