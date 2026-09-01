// Sitemap INDEX — points at per-template-family child sitemaps so GSC reports
// indexing coverage per section and Google fetches only changed files.
import { hubUrls, entityUrls, serviceUrls, newestLastmod } from '../lib/sitemap.js';

export async function GET(context) {
  const site = context.site;
  const children = [
    { name: 'sitemap-hubs.xml', urls: hubUrls() },
    { name: 'sitemap-ca.xml', urls: entityUrls('CA') },
    { name: 'sitemap-gb.xml', urls: serviceUrls('GB') },
    { name: 'sitemap-nz.xml', urls: serviceUrls('NZ') },
    { name: 'sitemap-no.xml', urls: serviceUrls('NO') },
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${children.map(c =>
    `  <sitemap><loc>${new URL('/' + c.name, site).href}</loc><lastmod>${newestLastmod(c.urls)}</lastmod></sitemap>`).join('\n')}\n</sitemapindex>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
