import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import { LazyMotion, domAnimation } from 'motion/react';
import { AppRoutes } from './App';

export function render(url: string): { html: string } {
  const helmetContext = {};

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <LazyMotion features={domAnimation}>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </LazyMotion>
    </HelmetProvider>
  );

  return { html };
}

export { ROUTES, buildSchemaGraph, CANONICAL_DOMAIN } from './seo/routes';
