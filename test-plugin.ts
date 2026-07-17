export function inlineCssPlugin() {
  return {
    name: 'inline-css',
    enforce: 'post',
    generateBundle(options, bundle) {
      let cssCode = '';
      const cssKeys = [];
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
          const regex = new RegExp(`<link[^>]+href="[^"]*` + basename + `"[^>]*>`, 'g');
          htmlFile.source = htmlFile.source.replace(regex, '');
          delete bundle[cssKey];
        }
      }
    }
  };
}
