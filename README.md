# GovWait

[GovWait](https://govwait.com/) records processing and wait times published by
government agencies, with a source URL, an honest date and append-only history.
It currently covers immigration, visa, permit, sponsorship, resettlement and
passport routes from Canada, the United Kingdom, New Zealand and Norway.

GovWait is independent and is not affiliated with any government. It does not
create case-specific estimates or provide legal or immigration advice.

## Use the public dataset

- [Dataset hub and CSV downloads](https://govwait.com/data/)
- [Current routes CSV](https://govwait.com/api/v1/downloads/latest.csv)
- [Append-only history CSV](https://govwait.com/api/v1/downloads/history.csv)
- [IRCC forward-looking CSV](https://govwait.com/api/v1/downloads/forward-looking.csv)
- [Source register CSV](https://govwait.com/api/v1/downloads/sources.csv)
- [Dataset metadata](https://govwait.com/api/v1/dataset.json)
- [JSON API documentation](https://govwait.com/api-docs/)
- [OpenAPI 3.1 specification](https://govwait.com/api/v1/openapi.yaml)
- [Processing-time change reports](https://govwait.com/reports/) and [RSS feed](https://govwait.com/reports/feed.xml)
- [Machine-readable site guide](https://govwait.com/llms.txt)

Example:

```sh
curl https://govwait.com/api/v1/entities/ca-visitor-visa--in.json
```

## Why the history matters

Government pages commonly replace an earlier processing-time value with the
current one. GovWait stores a new observation when a published value changes
and preserves the earlier record. It also keeps different measure types—such as
backward-looking statistics, forward projections, service standards and
percentiles—explicitly separate.

Current publication status, source dates and retrieval timestamps remain
distinct. A successful build or search-engine submission is not presented as
proof of indexing, traffic, demand or revenue.

## Repository map

- `pipeline/` — polite source collectors, validation, export and static API generation
- `data/exports/` — versioned latest, history, projection and summary exports
- `site/` — static Astro website and discoverability audit
- `machine/openapi.yaml` — public API contract
- `machine/mcp-server/` — local stdio MCP server for AI tools
- `docs/` — architecture, QA, discoverability and operating notes
- `handoff/` — product research, project state and roadmap

## Local verification

The cached pipeline path makes no network request:

```sh
node pipeline/run.js
node pipeline/build-api.js
cp machine/openapi.yaml site/public/api/v1/openapi.yaml
cd site
npm ci
npm run build
npm run audit:seo
```

MCP server:

```sh
cd machine/mcp-server
npm ci
npm run build
npm run smoke
```

The MCP package currently reads this repository's `data/exports` directory. It
is a working source package, not yet a self-contained npm release.

## Collection safeguards

- Official primary sources only; values and provenance, not copied pages.
- Honest bot identity with a contact address.
- `robots.txt` is checked and a blocked or ambiguous source fails closed.
- At least three seconds between requests to the same host, with caching and
  per-host caps.
- No browser impersonation or WAF bypass.
- Append-only history and blocking validation floors.
- No personal application data.

See [the methodology](https://govwait.com/about/) and
[`MAINTENANCE_RUNBOOK.md`](MAINTENANCE_RUNBOOK.md) before changing collection or
history behavior.

## Reuse and licensing

GovWait's original organization, field definitions and explanatory metadata are
available under CC BY 4.0 where GovWait owns the rights. Underlying government
information is not relicensed by GovWait; preserve the originating agency's
attribution and follow its source-specific terms. Read the full
[data reuse and licensing notice](https://govwait.com/data-license/).

This repository does not yet grant a repository-wide software licence. That
decision is intentionally separate from the data notice.

Questions and corrections: [contact@govwait.com](mailto:contact@govwait.com).
