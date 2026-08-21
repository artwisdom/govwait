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

### `[govuk-visa-times] FETCH/PARSE FAILURE` or `missing details.body`
gov.uk restructured the guidance page. Fetch `https://www.gov.uk/api/content/guidance/visa-processing-times-applications-outside-the-uk`, inspect `details.body`, adjust the table/heading regex in `pipeline/sources/govuk.js`. If the document moved, the API returns a `redirect` document — follow `redirects[0].destination`.

### `FAIL: staleness-<source>`
The source hasn't republished within the window (45d IRCC / 120d gov.uk). Check the official page by hand: if the agency genuinely paused updates, raise the window in `pipeline/validate.js` with a dated comment; if they moved the data, treat as relocation (see above).

### `FAIL: coverage-<source>`
Fewer records than the floor — usually a partial parse after a page change. Never lower the floor to make it pass; fix the parser.

### `robots.txt DISALLOWS ...` / `robots.txt unreachable ... failing closed`
The source closed its doors. The source is dead to us (hard rule). Remove it from `SOURCES` in `pipeline/run.js`, adjust coverage floors, and start a replacement from the expansion list below.

## Adding a source (the growth loop — ~2-4 hours each)

1. Pick from the verified robots-permitted expansion list: **immigration.govt.nz,
   dia.govt.nz (NZ passports), migrationsverket.se (SE), ind.nl (NL), nyidanmark.dk (DK)**.
2. Find the structured data: prefer a JSON/API endpoint (dev tools → Network tab on
   their processing-times tool); else a stable HTML table.
3. Copy `pipeline/sources/govuk.js` as a template. A source module exports
   `source` (metadata incl. license note) and `collect()` returning
   `{entities, observations, errors}`.
4. Register it in `SOURCES` in `pipeline/run.js`; add coverage floor + staleness
   window in `validate.js`; add the jurisdiction to `JURISDICTIONS` in
   `site/src/lib/data.js` (slug + agency name).
5. Run `node pipeline/run.js --refresh`, then `node pipeline/build-api.js`, then
   `cd site && npx astro build`. All green → commit → push.

Blocked-source watchlist (re-check quarterly, by hand in a browser): travel.state.gov,
egov.uscis.gov (official USCIS Torch developer API exists — free signup, owner
decision), ireland.ie, immi.homeaffairs.gov.au. If any opens up (or publishes an
official API/dataset), it is the single highest-value expansion available.

## Expanding within existing sources
- IRCC publishes more categories (citizenship, PR cards, family sponsorship beyond
  children) in other JSON files behind the same tool — capture URLs from dev tools.
- gov.uk has sibling guidance pages (in-UK processing times, passport processing)
  through the same Content API pattern.

## Dependency hygiene (quarterly, 15 min)
`cd site && npm outdated` / `cd machine/mcp-server && npm outdated`. Astro is pinned
to v4 (Node 20 on the build runner); bump both together only if needed. The pipeline
itself has zero dependencies by design.
