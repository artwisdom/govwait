// Shared sitemap helpers. lastmod discipline: data-driven URLs use the newest
// source effective/first-observed date that affects them; editorial URLs use a
// real substantive publish/modified date. Neither uses the build clock.
import { records, services, dataLastmod, JURISDICTIONS } from './data.js';
import { reportIssues } from './reports.js';

export function urlset(site, urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u =>
    `  <url><loc>${new URL(u.path, site).href}</loc><lastmod>${u.lastmod}</lastmod></url>`).join('\n')}\n</urlset>\n`;
}

export function hubUrls() {
  const phaseOnePublished = '2026-08-23';
  const norwayPublished = '2026-08-30';
  const growthPhasePublished = '2026-09-04';
  const urls = [
    { path: '/', lastmod: growthPhasePublished },
    { path: '/about/', lastmod: dataLastmod },
    { path: '/about/editorial-policy/', lastmod: phaseOnePublished },
    { path: '/about/research-desk/', lastmod: phaseOnePublished },
    { path: '/api-docs/', lastmod: dataLastmod },
    { path: '/guides/', lastmod: growthPhasePublished },
    { path: '/guides/how-canada-processing-times-work/', lastmod: dataLastmod },
    { path: '/guides/canada-visitor-visa-by-country/', lastmod: dataLastmod },
    { path: '/guides/canada-study-permit-from-india/', lastmod: growthPhasePublished },
    { path: '/guides/canada-study-permit-from-nigeria/', lastmod: dataLastmod },
    { path: '/guides/canada-visitor-visa-from-india/', lastmod: dataLastmod },
    { path: '/guides/canada-visitor-visa-from-philippines/', lastmod: dataLastmod },
    { path: '/guides/canada-work-permit-from-mexico/', lastmod: dataLastmod },
    { path: '/guides/uk-visa-processing-standards/', lastmod: dataLastmod },
    { path: '/guides/uk-spouse-visa-processing-time/', lastmod: dataLastmod },
    { path: '/guides/uk-standard-visitor-processing-time/', lastmod: growthPhasePublished },
    { path: '/guides/how-new-zealand-visa-processing-times-work/', lastmod: dataLastmod },
    { path: '/guides/new-zealand-2021-resident-visa-processing-time/', lastmod: growthPhasePublished },
    { path: '/guides/new-zealand-aewv-processing-time/', lastmod: dataLastmod },
    { path: '/guides/new-zealand-student-visa-processing-time/', lastmod: dataLastmod },
    { path: '/guides/how-norway-udi-waiting-times-work/', lastmod: norwayPublished },
    { path: '/reports/', lastmod: reportIssues.map(issue => issue.published).sort().at(-1) || phaseOnePublished },
    { path: '/reports/canada-processing-time-changes/', lastmod: growthPhasePublished },
    { path: '/reports/uk-visa-processing-time-changes/', lastmod: dataLastmod },
    { path: '/reports/new-zealand-visa-processing-time-changes/', lastmod: dataLastmod },
    { path: '/reports/norway-processing-time-changes/', lastmod: norwayPublished },
  ];
  for (const issue of reportIssues) urls.push({ path: issue.path, lastmod: issue.published });
  for (const [code, jur] of Object.entries(JURISDICTIONS)) {
    const svcMap = services[code];
    const jurisdictionLastmod = code === 'NZ'
      ? [growthPhasePublished, ...[...svcMap.values()].map(s => s.latestEffective)].sort().at(-1)
      : [...svcMap.values()].map(s => s.latestEffective).sort().at(-1);
    urls.push({ path: `/${jur.slug}/`, lastmod: jurisdictionLastmod });
    // UK service pages are their own template family and sitemap so Search
    // Console can report their indexing separately from general hubs.
    if (code === 'GB' || code === 'NZ' || code === 'NO') continue;
    for (const svc of svcMap.values()) {
      if (!svc.published) continue;
      urls.push({ path: `/${jur.slug}/${svc.slug}/`, lastmod: svc.latestEffective });
    }
  }
  return urls;
}

export function serviceUrls(jurCode) {
  const jur = JURISDICTIONS[jurCode];
  return [...services[jurCode].values()]
    .filter(svc => svc.published)
    .map(svc => ({ path: `/${jur.slug}/${svc.slug}/`, lastmod: svc.latestEffective }));
}

export function newestLastmod(urls) {
  return urls.map(u => u.lastmod).filter(Boolean).sort().at(-1);
}

export function entityUrls(jurCode) {
  return records
    // Keep official "unavailable" states accessible to people and AI agents,
    // but do not ask search engines to index a country page until it contains
    // a published value. A route automatically graduates on its first value.
    .filter(r => r.applicantSlug && r.jurisdiction === jurCode && r.status === 'ok')
    .map(r => ({ path: `/${r.jur.slug}/${r.serviceSlug}/${r.applicantSlug}/`, lastmod: r.effective_date }));
}
