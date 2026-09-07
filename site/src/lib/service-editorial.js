// Hand-reviewed, source-backed additions for service pages with demonstrated
// Search Console demand. Keep this list deliberately small: these blocks add
// route-specific information, not boilerplate across the whole dataset.
const workdays = record => Math.round(record.value_days);

export const SERVICE_EDITORIAL = Object.freeze({
  'nz-skilled-migrant-category-resident-visa': {
    modified: '2026-09-06',
    title: (p50, p80) => `NZ Skilled Migrant visa processing time: 50% ${workdays(p50)}, 80% ${workdays(p80)} working days`,
    description: (p50, p80) => `INZ reports 50% of Skilled Migrant Category Resident Visa applications in ${workdays(p50)} working days and 80% in ${workdays(p80)}. See where this wait fits after the EOI stage.`,
    heading: 'Where this wait fits in the Skilled Migrant route',
    paragraphs: [
      'INZ’s current Skilled Migrant Category route begins with an expression of interest (EOI). Its official guidance says a person needs a skilled job or job offer from an accredited employer and must qualify under one of the current pathways. If INZ accepts the EOI, it invites the person to submit the resident-visa application.',
      'The 50% and 80% figures above describe the visa-processing distribution represented in INZ’s processing-time tool. They are not a combined timeline for finding a qualifying job, building eligible work experience, submitting an EOI, receiving an invitation and then receiving a visa decision. GovWait does not add guessed durations for those separate steps.',
    ],
    sourceUrl: 'https://www.immigration.govt.nz/visas/skilled-migrant-category-resident-visa/',
    sourceLabel: 'INZ Skilled Migrant Category Resident Visa guidance',
  },
  'nz-specific-purpose-work-visa': {
    modified: '2026-09-06',
    title: (p50, p80) => `NZ Specific Purpose Work Visa processing time: 50% ${workdays(p50)}, 80% ${workdays(p80)} working days`,
    description: (p50, p80) => `INZ reports 50% of Specific Purpose Work Visa applications in ${workdays(p50)} working days and 80% in ${workdays(p80)}. See what this decision-time measure does and does not cover.`,
    heading: 'What the Specific Purpose Work Visa clock covers',
    paragraphs: [
      'INZ describes this current work visa as a route for a specific purpose or event. Depending on that purpose, an applicant may need evidence such as a job offer, letter of invitation, event schedule, qualifications or relevant experience. The permitted stay depends on the time needed for the approved purpose or event.',
      'The 50% and 80% figures above measure represented visa decisions; they do not describe how long the work or event may last. INZ also says a partner or dependent child cannot be included in the same application, although they may be able to make their own application based on the relationship.',
    ],
    callout: {
      lead: 'Different route:',
      body: 'this current work visa is not the historical Critical Purpose Visitor Visa used during COVID-19 border restrictions.',
      path: '/guides/new-zealand-critical-purpose-visitor-visa-processing-time/',
      label: 'Read the closed-route status and historical timeline',
    },
    sourceUrl: 'https://www.immigration.govt.nz/visas/specific-purpose-work-visa/',
    sourceLabel: 'INZ Specific Purpose Work Visa guidance',
  },
  'nz-dependent-child-resident-visa': {
    modified: '2026-09-06',
    title: (p50, p80) => `NZ Dependent Child visa processing time: 50% ${workdays(p50)}, 80% ${workdays(p80)} working days`,
    description: (p50, p80) => `INZ reports 50% of Dependent Child Resident Visa applications in ${workdays(p50)} working days and 80% in ${workdays(p80)}. See the route and measurement boundaries.`,
    heading: 'Which dependent-child route this time describes',
    paragraphs: [
      'INZ describes this resident visa as a route for a New Zealand citizen or resident living in New Zealand to bring an eligible dependent child to live there. Its current page says the child must be 24 or younger, single and financially dependent, alongside the route’s other requirements.',
      'These processing figures belong to the Dependent Child Resident Visa. They are not the time for a Dependent Child Student Visa, citizenship confirmation, or a child included in another residence application. INZ notes that some children of citizens or residents may already be New Zealand citizens and would not need this residence visa; the official route page is the authority for an individual situation.',
    ],
    sourceUrl: 'https://www.immigration.govt.nz/visas/dependent-child-resident-visa/',
    sourceLabel: 'INZ Dependent Child Resident Visa guidance',
  },
});

export function serviceEditorialLastmod(serviceKey, dataLastmod) {
  const editorialDate = SERVICE_EDITORIAL[serviceKey]?.modified;
  return [dataLastmod, editorialDate].filter(Boolean).sort().at(-1);
}
