// Sitemap INDEX — points at per-template-family child sitemaps so GSC reports
// indexing coverage per section and Google fetches only changed files.
import { dataLastmod } from '../lib/data.js';

export async function GET(context) {
  const site = context.site;
  const children = ['sitemap-hubs.xml', 'sitemap-ca.xml'];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${children.map(c =>
    `  <sitemap><loc>${new URL('/' + c, site).href}</loc><lastmod>${dataLastmod}</lastmod></sitemap>`).join('\n')}\n</sitemapindex>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
