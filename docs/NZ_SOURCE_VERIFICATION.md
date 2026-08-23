# Immigration New Zealand source verification

_Live-verified 2026-08-23 with `DataMoatEngineBot/0.1 (contact: contact@govwait.com)`._

## Primary source and permission checks

- Human source: Immigration New Zealand's official visa application processing-time tool.
- The current page publishes a complete 133-entry visa selector in its rendered component data. GovWait follows only those IDs; it does not scan or guess numeric IDs.
- Data endpoint: `POST /processing-time-api/v1/getTimeline/` with multipart field `visaID`.
- `robots.txt` disallows `/admin`, `/Security/`, `/_search/`, `/_visa-search/`, and `/_list-collection-search/`; neither the human processing-time page nor the timeline endpoint is disallowed.
- The site copyright page licenses Crown-owned website content under CC BY 3.0 New Zealand, subject to its stated third-party and logo exceptions. GovWait extracts factual values, uses written attribution, and reproduces no logos or page design.

## Live response contract

Visitor Visa (`visaID=1`) returned `Name`, `Percent50=7`, `Percent80=11`, `AverageWait`, and `MostWaitTime`. The official page states that the 50% and 80% figures use working days, excluding Saturdays, Sundays and public holidays.

The complete live pass returned:

- 133 listed visa types
- 266 metric entities (one 50% and one 80% entity per visa)
- zero fetch, JSON, name-match, range, or percentile-order errors

The API provides no update timestamp. GovWait therefore creates a dated observation only when a value changes, using the date the changed value was first observed. It never converts an official working-day count into a guessed calendar duration.

## Publication controls

- All 266 metric entities are available through static JSON and the MCP server.
- The first human release contains 25 reviewed visa service pages, one New Zealand hub and one explainer: 27 new indexable pages total.
- Each visa's 50% and 80% entities render together on one page.
- Future human-page cohorts are explicitly capped at 30 service keys per release in `site/src/lib/publication.js`.
- Validation blocks publication below 240 recorded INZ observations or if the official selector falls outside the reviewed 120–145 range.
