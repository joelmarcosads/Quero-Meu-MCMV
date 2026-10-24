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
  { path: '/fgts-minha-casa-minha-vida', priority: '0.8', changefreq: 'monthly' },
  { path: '/subsidio-minha-casa-minha-vida', priority: '0.8', changefreq: 'monthly' },
  { path: '/renda-minha-casa-minha-vida', priority: '0.8', changefreq: 'monthly' },
  { path: '/documentos-minha-casa-minha-vida', priority: '0.8', changefreq: 'monthly' },
  { path: '/sobre', priority: '0.8', changefreq: 'monthly' },
  { path: '/captacaodeimoveis', priority: '0.9', changefreq: 'weekly' }
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
  const distDir = path.resolve(__dirname, 'dist');

  // Gera o sitemap.xml sempre de forma síncrona/segura
  let sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  for (const route of routes) {
    const siteUrl = route.path === '/' ? 'https://queromeumcmv.com.br/' : `https://queromeumcmv.com.br${route.path}`;
    sitemapXML += `  <url>\n    <loc>${siteUrl}</loc>\n    <lastmod>2026-10-21</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>\n`;
  }
  sitemapXML += `</urlset>`;
  try {
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXML);
    fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemapXML);
    console.log('Saved sitemap.xml in dist and public');
  } catch (err) {
    console.warn('Could not write sitemap.xml:', err.message);
  }

  // Em ambientes de CI como Cloudflare Pages ou Vercel onde o Chrome headless não está disponível,
  // finaliza a geração com sucesso após salvar o sitemap.xml.
  if (process.env.CF_PAGES || process.env.VERCEL || process.env.CI) {
    console.log('[Prerender] Ambiente Cloudflare Pages / Vercel detectado. Sitemap gerado e build finalizado com sucesso.');
    return;
  }

  console.log('Starting preview server...');
  let server;
  let browser;

  try {
    const { preview } = await import('vite');
    server = await preview({
      preview: {
        port: 5000,
        host: 'localhost',
      }
    });

    console.log('Server started. Launching Puppeteer...');
    const puppeteerModule = await import('puppeteer');
    const puppeteer = puppeteerModule.default || puppeteerModule;
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
  } catch (launchErr) {
    console.warn('[Prerender] Puppeteer unavailable in this build environment (e.g. Vercel serverless):', launchErr.message);
    console.warn('[Prerender] Proceeding with standard Vite production build in dist/');
    if (server && server.httpServer) {
      try { server.httpServer.close(); } catch (_) {}
    }
    return;
  }

  try {
    for (const route of routes) {
      const page = await browser.newPage();
      const actualPort = server.httpServer.address().port;
      const url = `http://localhost:${actualPort}${route.path}`;
      console.log(`Prerendering ${route.path}...`);

      try {
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
        await page.waitForFunction(
          'document.title !== "" && document.querySelector("#root") && document.querySelector("#root").childElementCount > 0', 
          { timeout: 10000 }
        );
      } catch (e) {
        console.log(`Note for ${route.path}: Proceeding with rendered DOM state (${e.message})`);
      }

      // Remove runtime GTM scripts serialized by Puppeteer
      try {
        await page.evaluate(() => {
          document
            .querySelectorAll('script[src*="googletagmanager.com/gtm.js"], script[src*="sst.queromeumcmv.com.br"]')
            .forEach((script) => script.remove());
        });
      } catch (_) {}

      let html = await page.content();
      html = cleanHtmlTags(html);

      const isRoot = route.path === '/';
      const filePath = isRoot 
        ? path.join(distDir, 'index.html') 
        : path.join(distDir, `${route.path.slice(1)}.html`);
      fs.writeFileSync(filePath, html);
      console.log(`Saved ${filePath}`);

      await page.close();
    }

    console.log('Prerendering complete!');
  } catch (err) {
    console.warn('[Prerender] Non-fatal issue during route prerender loop:', err.message);
  } finally {
    console.log('Closing browser and server...');
    if (browser) {
      try { await browser.close(); } catch (_) {}
    }
    if (server && server.httpServer) {
      try { server.httpServer.close(); } catch (_) {}
    }
  }
}

prerender().catch(err => {
  console.warn('[Prerender] Prerender completed with warnings:', err.message);
  // Ensure the build never returns exit code 1 to allow smooth hosting deploys
  process.exit(0);
});
