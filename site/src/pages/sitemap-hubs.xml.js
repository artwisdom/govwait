import { urlset, hubUrls } from '../lib/sitemap.js';
export async function GET(context) {
  return new Response(urlset(context.site, hubUrls()), { headers: { 'Content-Type': 'application/xml' } });
}
