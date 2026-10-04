// Hand-reviewed, source-backed additions for service pages with demonstrated
// Search Console demand. Keep this list deliberately small: these blocks add
// route-specific information, not boilerplate across the whole dataset.
const workdays = record => Math.round(record.value_days);
const phaseSevenChecked = 'October 2, 2026';

const residentRouteCallout = {
  lead: 'Different closed route:',
  body: 'these current percentiles do not describe an application under the one-off 2021 Resident Visa.',
  path: '/guides/new-zealand-2021-resident-visa-processing-time/',
  label: 'NZ 2021 Resident Visa processing time — route closed',
};

export const SERVICE_EDITORIAL = Object.freeze({
  'nz-skilled-migrant-category-resident-visa': {
    modified: '2026-10-02',
    checked: phaseSevenChecked,
    title: (p50, p80) => `NZ Skilled Migrant Processing: 50% in ${workdays(p50)}, 80% in ${workdays(p80)} Workdays`,
    description: (p50, p80) => `INZ reports 50% of Skilled Migrant Category Resident Visa applications in ${workdays(p50)} working days and 80% in ${workdays(p80)}. See where this wait fits after the EOI stage.`,
    heading: 'Where this wait fits in the Skilled Migrant route',
    paragraphs: [
      'INZ’s current Skilled Migrant Category route begins with an expression of interest (EOI). Its official guidance says a person needs a skilled job or job offer from an accredited employer and must qualify under one of the current pathways. If INZ accepts the EOI, it invites the person to submit the resident-visa application.',
      'The 50% and 80% figures above describe the visa-processing distribution represented in INZ’s processing-time tool. They are not a combined timeline for finding a qualifying job, building eligible work experience, submitting an EOI, receiving an invitation and then receiving a visa decision. GovWait does not add guessed durations for those separate steps.',
    ],
    callout: residentRouteCallout,
    sourceUrl: 'https://www.immigration.govt.nz/visas/skilled-migrant-category-resident-visa/',
    sourceLabel: 'INZ Skilled Migrant Category Resident Visa guidance',
  },
  'nz-specific-purpose-work-visa': {
    modified: '2026-10-02',
    checked: phaseSevenChecked,
    title: (p50, p80) => `NZ Specific Purpose Processing: 50% in ${workdays(p50)}, 80% in ${workdays(p80)} Workdays`,
    description: (p50, p80) => `INZ reports 50% of Specific Purpose Work Visa applications within ${workdays(p50)} working days and 80% within ${workdays(p80)}. This is not the closed Critical Purpose Visitor Visa.`,
    heading: 'What the Specific Purpose Work Visa clock covers',
    paragraphs: [
      'INZ describes this current work visa as a route for a specific purpose or event. Depending on that purpose, an applicant may need evidence such as a job offer, letter of invitation, event schedule, qualifications or relevant experience. The permitted stay depends on the time needed for the approved purpose or event.',
      'The 50% and 80% figures above measure represented visa decisions; they do not describe how long the work or event may last. INZ also says a partner or dependent child cannot be included in the same application, although they may be able to make their own application based on the relationship.',
    ],
    callout: {
      lead: 'Different route:',
      body: 'this current work visa is not the historical Critical Purpose Visitor Visa used during COVID-19 border restrictions.',
      path: '/guides/new-zealand-critical-purpose-visitor-visa-processing-time/',
      label: 'NZ Critical Purpose Visitor Visa processing time — route closed',
    },
    sourceUrl: 'https://www.immigration.govt.nz/visas/specific-purpose-work-visa/',
    sourceLabel: 'INZ Specific Purpose Work Visa guidance',
  },
  'nz-straight-to-residence-visa': {
    modified: '2026-10-02',
    checked: phaseSevenChecked,
    title: (p50, p80) => `NZ Straight to Residence: 50% in ${workdays(p50)}, 80% in ${workdays(p80)} Workdays`,
    description: (p50, p80) => `INZ reports 50% of Straight to Residence Visa applications within ${workdays(p50)} working days and 80% within ${workdays(p80)}. See the Green List route and official history.`,
    heading: 'Which residence route this time describes',
    paragraphs: [
      'These figures belong only to the current Straight to Residence Visa entry in INZ’s processing-time tool. They do not describe the one-off 2021 Resident Visa, the Work to Residence Visa or another residence category.',
      'GovWait keeps the 50% and 80% working-day measures separate because they describe different points in the official distribution. Neither point is a promised decision date for one application.',
    ],
    callout: residentRouteCallout,
    sourceUrl: 'https://www.immigration.govt.nz/visas/straight-to-residence-visa/',
    sourceLabel: 'INZ Straight to Residence Visa guidance',
  },
  'nz-work-to-residence-visa': {
    modified: '2026-10-02',
    checked: phaseSevenChecked,
    title: (p50, p80) => `NZ Work to Residence: 50% in ${workdays(p50)}, 80% in ${workdays(p80)} Workdays`,
    description: (p50, p80) => `INZ reports 50% of Work to Residence Visa applications within ${workdays(p50)} working days and 80% within ${workdays(p80)}. See the Green List route and official history.`,
    heading: 'Which Work to Residence wait this page tracks',
    paragraphs: [
      'These figures belong to the current Work to Residence Visa entry in INZ’s processing-time tool. They do not measure time spent becoming eligible, completing qualifying work or preparing an application.',
      'This current route is also separate from the closed 2021 Resident Visa. Similar residence wording is not a reason to transfer one route’s published wait to another.',
    ],
    callout: residentRouteCallout,
    sourceUrl: 'https://www.immigration.govt.nz/visas/work-to-residence-visa/',
    sourceLabel: 'INZ Work to Residence Visa guidance',
  },
  'nz-visitor-visa': {
    modified: '2026-10-02',
    checked: phaseSevenChecked,
    title: (p50, p80) => `NZ Visitor Visa Processing: 50% in ${workdays(p50)}, 80% in ${workdays(p80)} Workdays`,
    description: (p50, p80) => `INZ reports 50% of Visitor Visa applications within ${workdays(p50)} working days and 80% within ${workdays(p80)}. This route is separate from the closed Critical Purpose Visitor Visa.`,
    heading: 'Which visitor-visa time this page reports',
    paragraphs: [
      'These current percentiles belong to the general Visitor Visa entry in INZ’s processing-time tool. They do not describe the historical Critical Purpose Visitor Visa used during COVID-19 border restrictions.',
      'The two figures are working-day distribution points, not a promise that every application will finish by the 80% point. GovWait preserves both values without converting them into a guessed calendar date.',
    ],
    callout: {
      lead: 'Looking for the historical route?',
      body: 'the Critical Purpose Visitor Visa is closed and has no current universal processing-time figure.',
      path: '/guides/new-zealand-critical-purpose-visitor-visa-processing-time/',
      label: 'NZ Critical Purpose Visitor Visa processing time — route closed',
    },
    sourceUrl: 'https://www.immigration.govt.nz/visas/visitor-visa/',
    sourceLabel: 'INZ Visitor Visa guidance',
  },
  'nz-permanent-resident-visa': {
    modified: '2026-10-02',
    checked: phaseSevenChecked,
    title: (p50, p80) => `NZ Permanent Resident: 50% in ${workdays(p50)}, 80% in ${workdays(p80)} Workdays`,
    description: (p50, p80) => `INZ reports 50% of Permanent Resident Visa applications within ${workdays(p50)} working days and 80% within ${workdays(p80)}. This is separate from the closed 2021 Resident Visa.`,
    heading: 'Permanent Resident Visa is a distinct current route',
    paragraphs: [
      'These figures belong to the current Permanent Resident Visa entry in INZ’s processing-time tool. They cannot be substituted for a resident-visa application under another category.',
      'In particular, these percentiles do not describe an older 2021 Resident Visa file. GovWait keeps the route names and official cohorts separate instead of blending their waits.',
    ],
    callout: residentRouteCallout,
    sourceUrl: 'https://www.immigration.govt.nz/visas/permanent-resident-visa/',
    sourceLabel: 'INZ Permanent Resident Visa guidance',
  },
  'nz-pathway-student-visa': {
    modified: '2026-10-02',
    checked: phaseSevenChecked,
    title: (p50, p80) => `NZ Pathway Student Visa: 50% in ${workdays(p50)}, 80% in ${workdays(p80)} Workdays`,
    description: (p50, p80) => `INZ reports 50% of Pathway Student Visa applications within ${workdays(p50)} working days and 80% within ${workdays(p80)}. See what this route covers and compare student visa times.`,
    heading: 'Pathway Student Visa is one student route',
    paragraphs: [
      'These figures belong specifically to the Pathway Student Visa entry in INZ’s processing-time tool. They should not be presented as the universal wait for every New Zealand student visa.',
      'The broader student-visa guide compares the reviewed routes while preserving each route’s own 50% and 80% working-day values.',
    ],
    callout: {
      lead: 'Compare student routes:',
      body: 'the broader guide separates Fee Paying and Pathway Student Visa processing figures.',
      path: '/guides/new-zealand-student-visa-processing-time/',
      label: 'New Zealand student visa processing times',
    },
    sourceUrl: 'https://www.immigration.govt.nz/visas/pathway-student-visa/',
    sourceLabel: 'INZ Pathway Student Visa guidance',
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
