import { reportIssues } from '../../lib/reports.js';

function escapeXml(value) {
  return String(value).replace(/[<>&"']/g, character => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;',
  })[character]);
}

function rssDate(iso) {
  return new Date(`${iso}T12:00:00Z`).toUTCString();
}

export async function GET(context) {
  const site = context.site;
  const items = reportIssues.map(report => {
    const url = new URL(report.path, site).href;
    const title = `${report.jur.shortName} processing-time changes — ${report.date}`;
    const description = `${report.changes.length} published values changed: ${report.longer.length} became longer and ${report.shorter.length} became shorter. ${report.unchanged.length} comparable values stayed the same.`;
    return `  <item>\n    <title>${escapeXml(title)}</title>\n    <link>${escapeXml(url)}</link>\n    <guid isPermaLink="true">${escapeXml(url)}</guid>\n    <pubDate>${rssDate(report.published)}</pubDate>\n    <description>${escapeXml(description)}</description>\n  </item>`;
  }).join('\n');
  const latest = reportIssues.map(report => report.published).sort().at(-1) || '2026-08-21';
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n<channel>\n  <title>GovWait processing-time change reports</title>\n  <link>${escapeXml(new URL('/reports/', site).href)}</link>\n  <description>Permanent, source-backed reports of changes in official government processing times.</description>\n  <language>en-us</language>\n  <lastBuildDate>${rssDate(latest)}</lastBuildDate>\n  <atom:link href="${escapeXml(new URL('/reports/feed.xml', site).href)}" rel="self" type="application/rss+xml" />\n${items}\n</channel>\n</rss>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
