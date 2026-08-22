import { urlset, entityUrls } from '../lib/sitemap.js';
export async function GET(context) {
  return new Response(urlset(context.site, entityUrls('CA')), { headers: { 'Content-Type': 'application/xml' } });
}
