// Custom sitemap endpoint with real lastmod signals:
// entity pages use the source's own effective_date; hubs use the max of their
// children; guides/home use the dataset generation date. No external deps.
import { records, services, stats, JURISDICTIONS } from '../lib/data.js';

export async function GET(context) {
  const site = context.site;
  const genDate = stats.generated_at.slice(0, 10);
  const urls = []; // {path, lastmod}

  urls.push({ path: '/', lastmod: genDate });
  urls.push({ path: '/about/', lastmod: genDate });
  urls.push({ path: '/api-docs/', lastmod: genDate });
  urls.push({ path: '/guides/', lastmod: genDate });
  for (const slug of ['how-canada-processing-times-work', 'canada-visitor-visa-by-country', 'uk-visa-processing-standards']) {
    urls.push({ path: `/guides/${slug}/`, lastmod: genDate });
  }
  for (const [code, jur] of Object.entries(JURISDICTIONS)) {
    const svcMap = services[code];
    const jurLastmod = [...svcMap.values()].map(s => s.latestEffective).sort().at(-1);
    urls.push({ path: `/${jur.slug}/`, lastmod: jurLastmod });
    for (const svc of svcMap.values()) {
      urls.push({ path: `/${jur.slug}/${svc.slug}/`, lastmod: svc.latestEffective });
    }
  }
  for (const r of records) {
    if (r.applicantSlug) urls.push({ path: `/${r.jur.slug}/${r.serviceSlug}/${r.applicantSlug}/`, lastmod: r.effective_date });
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u =>
    `  <url><loc>${new URL(u.path, site).href}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
