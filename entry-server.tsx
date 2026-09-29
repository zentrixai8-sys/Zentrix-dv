import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { AppContent } from './App';
import { ALL_ROUTES, getSeoMetadataForRoute } from './seoConfig';

export function render(url: string) {
  const html = renderToString(
    <MemoryRouter initialEntries={[url]}>
      <AppContent />
    </MemoryRouter>
  );
  return { html };
}

export { ALL_ROUTES, getSeoMetadataForRoute };
