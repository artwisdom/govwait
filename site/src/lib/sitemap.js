// Shared sitemap helpers. lastmod discipline: a URL's lastmod is the newest
// official effective_date that affects it — never the build timestamp — so Google
// can verify it against real content changes.
import { records, services, dataLastmod, JURISDICTIONS } from './data.js';

export function urlset(site, urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u =>
    `  <url><loc>${new URL(u.path, site).href}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}\n</urlset>\n`;
}

export function hubUrls() {
  const urls = [
    { path: '/', lastmod: dataLastmod },
    { path: '/about/', lastmod: dataLastmod },
    { path: '/api-docs/', lastmod: dataLastmod },
    { path: '/guides/', lastmod: dataLastmod },
    { path: '/guides/how-canada-processing-times-work/', lastmod: dataLastmod },
    { path: '/guides/canada-visitor-visa-by-country/', lastmod: dataLastmod },
    { path: '/guides/uk-visa-processing-standards/', lastmod: dataLastmod },
  ];
  for (const [code, jur] of Object.entries(JURISDICTIONS)) {
    const svcMap = services[code];
    urls.push({ path: `/${jur.slug}/`, lastmod: [...svcMap.values()].map(s => s.latestEffective).sort().at(-1) });
    for (const svc of svcMap.values()) {
      urls.push({ path: `/${jur.slug}/${svc.slug}/`, lastmod: svc.latestEffective });
    }
  }
  return urls;
}

export function entityUrls(jurCode) {
  return records
    .filter(r => r.applicantSlug && r.jurisdiction === jurCode)
    .map(r => ({ path: `/${r.jur.slug}/${r.serviceSlug}/${r.applicantSlug}/`, lastmod: r.effective_date }));
}
