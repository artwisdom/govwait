export const EDITORIAL_AUTHOR = Object.freeze({
  name: 'GovWait Research Desk',
  path: '/about/research-desk/',
});

export const EDITORIAL_POLICY_PATH = '/about/editorial-policy/';

export function newestDate(...dates) {
  return dates.filter(Boolean).sort().at(-1);
}

export function articleJsonLd({
  site,
  path,
  title,
  description,
  datePublished,
  dateModified,
  section,
  about = [],
  citations = [],
}) {
  const url = new URL(path, site).href;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: title,
    description,
    url,
    mainEntityOfPage: url,
    datePublished,
    dateModified: dateModified || datePublished,
    articleSection: section,
    isAccessibleForFree: true,
    author: {
      '@type': 'Organization',
      name: EDITORIAL_AUTHOR.name,
      url: new URL(EDITORIAL_AUTHOR.path, site).href,
    },
    publisher: { '@id': `${new URL('/', site).href}#organization` },
    about: about.map(name => ({ '@type': 'Thing', name })),
    citation: citations,
  };
}

export function breadcrumbJsonLd({ site, sectionName, sectionPath, pageName, pagePath }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: new URL('/', site).href },
      { '@type': 'ListItem', position: 2, name: sectionName, item: new URL(sectionPath, site).href },
      { '@type': 'ListItem', position: 3, name: pageName, item: new URL(pagePath, site).href },
    ],
  };
}
