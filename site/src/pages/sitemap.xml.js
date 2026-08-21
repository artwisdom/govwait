// Custom sitemap endpoint — enumerates every page, no external deps.
import { records, services, JURISDICTIONS } from '../lib/data.js';

export async function GET(context) {
  const site = context.site;
  const urls = ['/', '/about/', '/api-docs/'];
  for (const jur of Object.values(JURISDICTIONS)) urls.push(`/${jur.slug}/`);
  for (const [code, svcMap] of Object.entries(services)) {
    for (const svc of svcMap.values()) urls.push(`/${JURISDICTIONS[code].slug}/${svc.slug}/`);
  }
  for (const r of records) {
    if (r.applicantSlug) urls.push(`/${r.jur.slug}/${r.serviceSlug}/${r.applicantSlug}/`);
  }
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${new URL(u, site).href}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
