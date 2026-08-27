# MAINTENANCE RUNBOOK

Target steady-state effort: **under 1 hour/week**. Most weeks: 5 minutes (glance at
the two green checkmarks). The pipeline is designed to fail loudly and publish
nothing rather than publish garbage — a red X never means bad data went live.

## Weekly checklist (≤10 min when green)

1. Open GitHub → Actions. Confirm the last two `refresh-data` runs are green.
2. Spot-open one entity page (e.g. `/canada/visitor-visa/from-india/`) — freshness
   stamp should be within ~10 days.
3. Glance at Search Console (once registered): impressions trending, no coverage errors.
4. That's it. Only a red X costs more time — see playbooks.

## Failure playbooks

The failed run's **job summary** names the source and check. Match it below.

### `[ircc-ptime] FETCH/PARSE FAILURE: HTTP 403/404`
- 404: IRCC moved the JSON. Open the [check processing times tool](https://www.canada.ca/en/immigration-refugees-citizenship/services/application/check-processing-times.html), open browser dev tools → Network, reload, find the new `data-ptime*.json` URL, update `URL` in `pipeline/sources/ircc.js`, run locally (`node pipeline/run.js --refresh`), commit.
- 403: canada.ca started blocking the bot UA. Do NOT spoof a browser UA. Check robots.txt manually; if policy changed, treat the source as closed and open the source-replacement play below.

### `[ircc-ptime] N parse error(s): unparseable duration`
IRCC introduced a new value shape (e.g. "less than 2 weeks"). Add a branch to
`pipeline/lib/normalize.js` with a test value, run locally, commit. 10 minutes.

### `[ircc-forward-looking] FETCH/PARSE FAILURE` / schema or coverage failure
- Confirm the official IRCC file still exists at `https://www.canada.ca/content/dam/ircc/documents/json/flpt-en.json` and check robots policy first. Never spoof a browser User-Agent.
- The parser intentionally checks all top-level and program keys exactly. A new or removed key is schema drift to review, not something to ignore. Update the 28-program mapping only after matching the official tool's labels and meaning.
- Preserve the time axes: `snapshot_date` is the IRCC update/publication date; `cohort_month` is the application submission month. Cohorts reaching back years are not old publication snapshots and must never be presented as such.
- Do not lower the floors of 28 headline projections and 3,500 cohort rows. The file is expected monthly and becomes stale at 62 days.
- Keep current projections, queue totals, people-ahead values, and cohort waits in `forward_estimates`; never merge them into backward-looking `observations` history.

### `[govuk-visa-times] FETCH/PARSE FAILURE` or `missing details.body`
gov.uk restructured the guidance page. Fetch `https://www.gov.uk/api/content/guidance/visa-processing-times-applications-outside-the-uk`, inspect `details.body`, adjust the table/heading regex in `pipeline/sources/govuk.js`. If the document moved, the API returns a `redirect` document — follow `redirects[0].destination`.

### `[inz-processing-times] FETCH/PARSE FAILURE` / selector count or name mismatch
- Open the official [INZ processing-time tool](https://www.immigration.govt.nz/process-to-apply/waiting-for-a-visa/processing-a-visa-application/how-long-it-takes-to-process-an-application/check-visa-application-processing-time/) and confirm it still renders.
- Check `robots.txt` first. Never spoof a browser or work around Imperva.
- The page must expose its complete `<visa-processing :visas="…">` selector. The pipeline follows only those listed IDs and caps the list at 145 to remain under the 150-request host ceiling.
- If INZ legitimately grows beyond 145 visas, redesign the refresh into bounded cohorts before raising any cap. Do not guess IDs or lower the 240-observation coverage floor.
- The endpoint has no update stamp. Keep first-observed/change-detection semantics and preserve `working days` as the source unit.

### `FAIL: staleness-<source>`
The source hasn't republished within its window (45d IRCC processing-time files /
62d IRCC forward-looking file / 120d gov.uk). Check the official page by hand: if
the agency genuinely paused updates, raise the window in `pipeline/validate.js`
with a dated comment; if they moved the data, treat as relocation (see above).

### `FAIL: coverage-<source>`
Fewer records than the floor — usually a partial parse after a page change. Never lower the floor to make it pass; fix the parser.

### `robots.txt DISALLOWS ...` / `robots.txt unreachable ... failing closed`
The source closed its doors. The source is dead to us (hard rule). Remove it from `SOURCES` in `pipeline/run.js`, adjust coverage floors, and start a replacement from the expansion list below.

## Adding a source (the growth loop — ~2-4 hours each)

1. Pick from the verified robots-permitted expansion list: **udi.no (Norway),
   migri.fi (Finland), migrationsverket.se (Sweden), ind.nl (Netherlands),
   nyidanmark.dk (Denmark)**. NZ passports remain blocked and are not a candidate.
2. Find the structured data: prefer a JSON/API endpoint (dev tools → Network tab on
   their processing-times tool); else a stable HTML table.
3. Copy `pipeline/sources/govuk.js` as a template. A source module exports
   `source` (metadata incl. license note) and `collect()` returning
   `{entities, observations, errors}`. A semantically distinct projection source
   may also return `forwardEstimates`, but only with its own schema, validation,
   export, API, and presentation labels.
4. Register it in `SOURCES` in `pipeline/run.js`; add coverage floor + staleness
   window in `validate.js`; add the jurisdiction to `JURISDICTIONS` in
   `site/src/lib/data.js` (slug + agency name).
5. Run `node pipeline/run.js --refresh`, then `node pipeline/build-api.js`, then
   `cd site && npx astro build`. All green → commit → push.

Blocked-source watchlist (re-check quarterly, by hand in a browser): travel.state.gov,
egov.uscis.gov, passports.govt.nz, ireland.ie, immi.homeaffairs.gov.au. The USCIS
developer portal currently offers no processing-times API. If a host opens up or
publishes a sanctioned dataset, it becomes a high-value expansion candidate.

## Expanding within existing sources
- IRCC's forward-looking permanent-residence projections are implemented. Inspect
  other official files behind the tool only when they add a genuinely distinct
  category or metric, and preserve their semantics rather than forcing them into
  the existing observation model.
- gov.uk has sibling guidance pages (in-UK processing times, passport processing)
  through the same Content API pattern.

## Dependency hygiene (quarterly, 15 min)
`cd site && npm outdated` / `cd machine/mcp-server && npm outdated`. Astro is pinned
to v4 (Node 20 on the build runner); bump both together only if needed. The pipeline
itself has zero dependencies by design.
