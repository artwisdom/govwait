import { urlset, serviceUrls } from '../lib/sitemap.js';

export async function GET(context) {
  return new Response(urlset(context.site, serviceUrls('NO')), {
    headers: { 'Content-Type': 'application/xml' },
  });
}
