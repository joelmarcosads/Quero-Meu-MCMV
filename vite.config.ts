import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

function inlineCssPlugin() {
  return {
    name: 'inline-css',
    enforce: 'post' as const,
    generateBundle(options: any, bundle: any) {
      let cssCode = '';
      const cssKeys: string[] = [];
      for (const key in bundle) {
        if (bundle[key].type === 'asset' && bundle[key].fileName.endsWith('.css')) {
          cssCode += bundle[key].source;
          cssKeys.push(key);
        }
      }
      const htmlKeys = Object.keys(bundle).filter((key) => key.endsWith('.html'));
      if (htmlKeys.length && cssCode) {
        for (const htmlKey of htmlKeys) {
          const htmlFile = bundle[htmlKey];
          if (htmlFile && typeof htmlFile.source === 'string') {
            htmlFile.source = htmlFile.source.replace('</head>', `<style>${cssCode}</style></head>`);
            for (const cssKey of cssKeys) {
              const basename = cssKey.split('/').pop();
              if (basename) {
                const regex = new RegExp(`<link[^>]+href="[^"]*` + basename + `"[^>]*>`, 'g');
                htmlFile.source = htmlFile.source.replace(regex, '');
              }
            }
          }
        }
        for (const cssKey of cssKeys) {
          delete bundle[cssKey];
        }
      }
    }
  };
}

function obrigadoMiddlewarePlugin() {
  return {
    name: 'obrigado-middleware',
    configureServer(server: any) {
      server.middlewares.use((req: any, _res: any, next: any) => {
        if (req.url) {
          const urlObj = new URL(req.url, 'http://localhost');
          if (
            urlObj.pathname === '/obrigado.imoveis' ||
            urlObj.pathname === '/obrigado.imoveis/'
          ) {
            req.url = '/obrigado.imoveis.html' + urlObj.search;
          } else if (
            urlObj.pathname === '/obrigado' ||
            urlObj.pathname === '/obrigado/'
          ) {
            req.url = '/obrigado.html' + urlObj.search;
          }
        }
        next();
      });
    },
    configurePreviewServer(server: any) {
      server.middlewares.use((req: any, _res: any, next: any) => {
        if (req.url) {
          const urlObj = new URL(req.url, 'http://localhost');
          if (
            urlObj.pathname === '/obrigado.imoveis' ||
            urlObj.pathname === '/obrigado.imoveis/'
          ) {
            req.url = '/obrigado.imoveis.html' + urlObj.search;
          } else if (
            urlObj.pathname === '/obrigado' ||
            urlObj.pathname === '/obrigado/'
          ) {
            req.url = '/obrigado.html' + urlObj.search;
          }
        }
        next();
      });
    }
  };
}

export default defineConfig(({mode, isSsrBuild}) => {
  const env = loadEnv(mode, '.', '');
  return {
    appType: 'spa',
    plugins: [react(), tailwindcss(), inlineCssPlugin(), obrigadoMiddlewarePlugin()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        input: isSsrBuild
          ? undefined
          : {
              main: path.resolve(__dirname, 'index.html'),
            },
        output: isSsrBuild
          ? {}
          : {
              manualChunks: {
                'react-vendor': ['react', 'react-dom']
              }
            }
      }
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
