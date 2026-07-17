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
      const htmlKey = Object.keys(bundle).find(key => key.endsWith('.html'));
      if (htmlKey && cssCode) {
        const htmlFile = bundle[htmlKey];
        htmlFile.source = htmlFile.source.replace('</head>', `<style>${cssCode}</style></head>`);
        for (const cssKey of cssKeys) {
          const basename = cssKey.split('/').pop();
          if (basename) {
            const regex = new RegExp(`<link[^>]+href="[^"]*` + basename + `"[^>]*>`, 'g');
            htmlFile.source = htmlFile.source.replace(regex, '');
          }
          delete bundle[cssKey];
        }
      }
    }
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), inlineCssPlugin()],
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
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'motion-vendor': ['motion', 'motion-dom', 'framer-motion'],
            'lucide-vendor': ['lucide-react']
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
