import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function prerender() {
  console.log('🚀 Starting Static Site Generation (SSG) Pre-rendering...');

  const distDir = path.resolve(rootDir, 'dist');
  const distSsrDir = path.resolve(rootDir, 'dist-ssr');
  const templatePath = path.resolve(distDir, 'index.html');

  if (!fs.existsSync(templatePath)) {
    console.error('❌ dist/index.html not found. Run "vite build" first.');
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, 'utf-8');

  // Load SSR bundle
  const serverEntryPath = path.resolve(distSsrDir, 'entry-server.js');
  if (!fs.existsSync(serverEntryPath)) {
    console.error(`❌ SSR bundle not found at ${serverEntryPath}. Run "vite build --ssr" first.`);
    process.exit(1);
  }

  const { render, ALL_ROUTES, getSeoMetadataForRoute } = await import(pathToFileURL(serverEntryPath).href);

  console.log(`📋 Found ${ALL_ROUTES.length} routes to pre-render into static HTML.`);

  for (const route of ALL_ROUTES) {
    try {
      console.log(`  ⚙️ Pre-rendering: ${route}`);
      const { html: appHtml } = render(route);
      const meta = getSeoMetadataForRoute(route);

      // Inject rendered app HTML into root div
      let pageHtml = template.replace(
        '<div id="root"><!--app-html--></div>',
        `<div id="root">${appHtml}</div>`
      );
      if (pageHtml === template) {
        pageHtml = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
      }

      // Replace Title
      pageHtml = pageHtml.replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`);

      // Replace / Update Meta Description
      if (pageHtml.includes('name="description"')) {
        pageHtml = pageHtml.replace(
          /<meta name="description" content=".*?" \/>/,
          `<meta name="description" content="${meta.description}" />`
        );
      } else {
        pageHtml = pageHtml.replace('</head>', `  <meta name="description" content="${meta.description}" />\n</head>`);
      }

      // Replace / Update Canonical
      if (pageHtml.includes('rel="canonical"')) {
        pageHtml = pageHtml.replace(
          /<link rel="canonical" href=".*?" \/>/,
          `<link rel="canonical" href="${meta.canonical}" />`
        );
      } else {
        pageHtml = pageHtml.replace('</head>', `  <link rel="canonical" href="${meta.canonical}" />\n</head>`);
      }

      // Replace Open Graph tags
      pageHtml = pageHtml.replace(
        /<meta property="og:title" content=".*?" \/>/,
        `<meta property="og:title" content="${meta.title}" />`
      );
      pageHtml = pageHtml.replace(
        /<meta property="og:description" content=".*?" \/>/,
        `<meta property="og:description" content="${meta.description}" />`
      );
      pageHtml = pageHtml.replace(
        /<meta property="og:url" content=".*?" \/>/,
        `<meta property="og:url" content="${meta.canonical}" />`
      );
      pageHtml = pageHtml.replace(
        /<meta property="og:type" content=".*?" \/>/,
        `<meta property="og:type" content="${meta.ogType}" />`
      );
      pageHtml = pageHtml.replace(
        /<meta property="og:image" content=".*?" \/>/,
        `<meta property="og:image" content="${meta.ogImage}" />`
      );

      // Replace Twitter card tags
      pageHtml = pageHtml.replace(
        /<meta name="twitter:title" content=".*?" \/>/,
        `<meta name="twitter:title" content="${meta.title}" />`
      );
      pageHtml = pageHtml.replace(
        /<meta name="twitter:description" content=".*?" \/>/,
        `<meta name="twitter:description" content="${meta.description}" />`
      );
      pageHtml = pageHtml.replace(
        /<meta name="twitter:url" content=".*?" \/>/,
        `<meta name="twitter:url" content="${meta.canonical}" />`
      );
      pageHtml = pageHtml.replace(
        /<meta name="twitter:image" content=".*?" \/>/,
        `<meta name="twitter:image" content="${meta.ogImage}" />`
      );

      // Inject JSON-LD structured data scripts
      const schemaScripts = meta.schemas
        .map(
          (schema, i) =>
            `  <script type="application/ld+json" data-seo-jsonld="schema-${i}">\n${JSON.stringify(
              schema,
              null,
              2
            )}\n  </script>`
        )
        .join('\n');

      pageHtml = pageHtml.replace('</head>', `${schemaScripts}\n</head>`);

      // Determine output directory
      let outFilePath;
      if (route === '/' || route === '') {
        outFilePath = path.resolve(distDir, 'index.html');
      } else {
        const routeSubdir = path.resolve(distDir, route.replace(/^\//, ''));
        if (!fs.existsSync(routeSubdir)) {
          fs.mkdirSync(routeSubdir, { recursive: true });
        }
        outFilePath = path.resolve(routeSubdir, 'index.html');
      }

      fs.writeFileSync(outFilePath, pageHtml, 'utf-8');
      console.log(`    ✅ Wrote static HTML to: ${path.relative(rootDir, outFilePath)}`);
    } catch (err) {
      console.error(`    ❌ Error pre-rendering route ${route}:`, err);
    }
  }

  // Ensure robots.txt and sitemap.xml in dist
  const publicRobots = path.resolve(rootDir, 'public', 'robots.txt');
  const distRobots = path.resolve(distDir, 'robots.txt');
  if (fs.existsSync(publicRobots)) {
    fs.copyFileSync(publicRobots, distRobots);
  }

  const publicSitemap = path.resolve(rootDir, 'public', 'sitemap.xml');
  const distSitemap = path.resolve(distDir, 'sitemap.xml');
  if (fs.existsSync(publicSitemap)) {
    fs.copyFileSync(publicSitemap, distSitemap);
  }

  // Ensure /dashboard fallback static file exists to prevent 404 on refresh
  const dashboardDir = path.resolve(distDir, 'dashboard');
  if (!fs.existsSync(dashboardDir)) {
    fs.mkdirSync(dashboardDir, { recursive: true });
  }
  fs.copyFileSync(templatePath, path.resolve(dashboardDir, 'index.html'));
  console.log('    ✅ Wrote static fallback for client route: dist/dashboard/index.html');

  // Copy _redirects if exists
  const publicRedirects = path.resolve(rootDir, 'public', '_redirects');
  if (fs.existsSync(publicRedirects)) {
    fs.copyFileSync(publicRedirects, path.resolve(distDir, '_redirects'));
  }

  // Clean up temporary SSR bundle
  if (fs.existsSync(distSsrDir)) {
    fs.rmSync(distSsrDir, { recursive: true, force: true });
  }

  console.log('\n✨ Pre-rendering successfully completed for all routes!');
}

prerender().catch(err => {
  console.error('Fatal error during pre-rendering:', err);
  process.exit(1);
});
