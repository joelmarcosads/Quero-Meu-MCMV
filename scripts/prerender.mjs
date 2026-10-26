import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const distServerDir = path.resolve(rootDir, 'dist-server');
const distServerEntry = path.resolve(distServerDir, 'entry-server.js');

function escapeAttr(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeText(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function runPrerender() {
  console.log('[Prerender] Starting build-time static rendering (SSG)...');

  if (!fs.existsSync(distServerEntry)) {
    throw new Error(`Server entry file not found at ${distServerEntry}. Run 'vite build --ssr src/entry-server.tsx --outDir dist-server' first.`);
  }

  const templateHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(templateHtmlPath)) {
    throw new Error(`Template index.html not found at ${templateHtmlPath}. Run 'vite build' first.`);
  }

  const template = fs.readFileSync(templateHtmlPath, 'utf-8');

  // Load compiled server bundle
  const { render, ROUTES, buildSchemaGraph, CANONICAL_DOMAIN } = await import(
    pathToFileURL(distServerEntry).href
  );

  console.log(`[Prerender] Found ${ROUTES.length} routes to process.`);

  for (const route of ROUTES) {
    const isRoot = route.path === '/';
    const canonicalUrl = isRoot ? `${CANONICAL_DOMAIN}/` : `${CANONICAL_DOMAIN}${route.path}`;
    
    // Per requirement 1.2: URLs have no trailing slash (ex: /sobre).
    // Generate dist/index.html for "/" and dist/<slug>.html for each route (ex: dist/sobre.html).
    // DO NOT generate dist/sobre/index.html.
    const targetFile = route.outputFile
      ? path.join(distDir, route.outputFile)
      : isRoot
      ? path.join(distDir, 'index.html')
      : path.join(distDir, `${route.path.replace(/^\//, '')}.html`);

    console.log(`[Prerender] Rendering route: ${route.path} -> ${path.relative(rootDir, targetFile)}`);

    // 1. Render application React tree
    const { html: appHtml } = render(route.path);

    // 2. Strip hoisted head metadata and clean any static opacity:0 inline styles from motion SSR
    const cleanedAppHtml = appHtml
      .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '')
      .replace(/<meta[^>]*>/gi, '')
      .replace(/<link[^>]*>/gi, '')
      .replace(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/style="[^"]*opacity:\s*0[^"]*"/g, (match) => {
        const cleaned = match
          .replace(/opacity:\s*0;?/g, '')
          .replace(/transform:[^;"]*;?/g, '')
          .replace(/style="\s*"/, '');
        return cleaned;
      });

    // 3. Clean existing template head meta tags to ensure complete uniqueness
    let pageHtml = template;

    pageHtml = pageHtml
      .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '')
      .replace(/<meta[^>]*name="description"[^>]*>/gi, '')
      .replace(/<link[^>]*rel="canonical"[^>]*>/gi, '')
      .replace(/<meta[^>]*property="og:title"[^>]*>/gi, '')
      .replace(/<meta[^>]*property="og:description"[^>]*>/gi, '')
      .replace(/<meta[^>]*property="og:url"[^>]*>/gi, '')
      .replace(/<meta[^>]*property="og:type"[^>]*>/gi, '')
      .replace(/<meta[^>]*property="og:image"[^>]*>/gi, '')
      .replace(/<meta[^>]*property="og:image:alt"[^>]*>/gi, '')
      .replace(/<meta[^>]*property="og:site_name"[^>]*>/gi, '')
      .replace(/<meta[^>]*property="og:locale"[^>]*>/gi, '')
      .replace(/<meta[^>]*name="twitter:card"[^>]*>/gi, '')
      .replace(/<meta[^>]*name="twitter:title"[^>]*>/gi, '')
      .replace(/<meta[^>]*name="twitter:description"[^>]*>/gi, '')
      .replace(/<meta[^>]*name="twitter:image"[^>]*>/gi, '')
      .replace(/<meta[^>]*name="robots"[^>]*>/gi, '')
      .replace(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, '');

    // 4. Build exact, canonical head tags
    const robotsContent = route.noindex
      ? route.nofollow
        ? 'noindex, nofollow'
        : 'noindex'
      : null;

    const headTags = [
      `<title>${escapeText(route.title)}</title>`,
      `<meta name="description" content="${escapeAttr(route.description)}" />`,
      ...(robotsContent ? [`<meta name="robots" content="${robotsContent}" />`] : []),
      `<link rel="canonical" href="${canonicalUrl}" />`,
      `<meta property="og:type" content="${route.schemaType === 'Article' ? 'article' : 'website'}" />`,
      `<meta property="og:url" content="${canonicalUrl}" />`,
      `<meta property="og:title" content="${escapeAttr(route.title)}" />`,
      `<meta property="og:description" content="${escapeAttr(route.description)}" />`,
      `<meta property="og:image" content="${CANONICAL_DOMAIN}/capa-site-quero-meu-mcmv-open-graph.webp" />`,
      `<meta property="og:site_name" content="Quero Meu MCMV" />`,
      `<meta property="og:locale" content="pt_BR" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`,
      `<meta name="twitter:description" content="${escapeAttr(route.description)}" />`,
      `<meta name="twitter:image" content="${CANONICAL_DOMAIN}/capa-site-quero-meu-mcmv-open-graph.webp" />`,
      ...(route.noindex ? [] : [`<script type="application/ld+json">${JSON.stringify(buildSchemaGraph(route))}</script>`]),
    ].join('\n    ');

    // Inject head tags right before </head>
    pageHtml = pageHtml.replace('</head>', `    ${headTags}\n  </head>`);

    // Inject prerendered content into <div id="root">
    pageHtml = pageHtml.replace(
      /<div id="root">[\s\S]*?<\/div>/,
      `<div id="root">${cleanedAppHtml}</div>`
    );

    // Ensure target directory exists and write dist/<slug>.html
    const targetDir = path.dirname(targetFile);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(targetFile, pageHtml, 'utf-8');
  }

  // 5. Build sitemap.xml
  console.log('[Prerender] Generating sitemap.xml...');
  const indexableRoutes = ROUTES.filter((r) => !r.noindex && r.path !== '/404');
  console.log(`[Prerender] Found ${indexableRoutes.length} indexable routes for sitemap.`);

  const today = new Date().toISOString().split('T')[0];
  let sitemapXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemapXml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const route of indexableRoutes) {
    const loc = route.path === '/' ? `${CANONICAL_DOMAIN}/` : `${CANONICAL_DOMAIN}${route.path}`;
    const priority = route.priority || (route.path === '/' ? '1.0' : '0.8');
    const changefreq = route.changefreq || 'weekly';

    sitemapXml += '  <url>\n';
    sitemapXml += `    <loc>${loc}</loc>\n`;
    sitemapXml += `    <lastmod>${today}</lastmod>\n`;
    sitemapXml += `    <changefreq>${changefreq}</changefreq>\n`;
    sitemapXml += `    <priority>${priority}</priority>\n`;
    sitemapXml += '  </url>\n';
  }
  sitemapXml += '</urlset>\n';

  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8');

  // Copy llms.txt and robots.txt to dist if present in public
  const publicDir = path.join(rootDir, 'public');
  for (const fileName of ['llms.txt', 'robots.txt', '_headers']) {
    const src = path.join(publicDir, fileName);
    const dest = path.join(distDir, fileName);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  }

  // 6. Clean up temporary dist-server directory
  try {
    if (fs.existsSync(distServerDir)) {
      fs.rmSync(distServerDir, { recursive: true, force: true });
      console.log('[Prerender] Cleaned up dist-server.');
    }
  } catch (err) {
    console.warn('[Prerender] Warning while cleaning dist-server:', err.message);
  }

  console.log('[Prerender] Prerendering finished successfully!');
}

runPrerender().catch((err) => {
  console.error('[Prerender] FATAL ERROR:', err);
  process.exit(1);
});
