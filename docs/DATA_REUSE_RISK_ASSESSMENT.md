# GovWait data-reuse risk assessment

Last reviewed: 2026-09-08 (America/New_York)

This is an operational risk assessment, not legal advice. It does not replace
review by qualified counsel for a specific commercial use.

## Executive summary

Overall rating: **YELLOW / medium (6 of 25)**.

- Severity: **3 — Moderate**. A source complaint or licence mismatch could
  require changes to one source family, its public downloads or a commercial
  offering.
- Likelihood: **2 — Unlikely** with the current controls. GovWait publishes
  attributed factual values and provenance rather than copying government page
  prose, but the four governments do not use one uniform set of terms.
- Score: **3 × 2 = 6**.

The main risk is not the existence of the GovWait-created field model. It is
overstating that one blanket licence covers government information obtained from
sources with different reuse terms.

## Source position

| Source family | Current position | Main control |
|---|---|---|
| GOV.UK / UKVI / HM Passport Office | Most covered content is offered under Open Government Licence v3.0, subject to attribution and exceptions. | Keep source attribution and do not reuse excluded logos or third-party material. |
| Immigration New Zealand | Covered Crown website content is offered under CC BY 3.0 New Zealand, subject to its attribution instructions and exceptions. | Preserve INZ attribution and avoid excluded logos, design and third-party content. |
| Canada / IRCC | Canada.ca general terms and the Open Government Licence – Canada are distinct. The open licence applies only when the information is expressly distributed under it. | Do not label every IRCC page or file as open-licensed. Link the exact source and verify the applicable terms for commercial redistribution. |
| Norway / UDI | No explicit reuse licence has been identified on the tracked waiting-time pages. | Publish attributed factual values and links only, not copied UDI prose; confirm higher-risk commercial use separately. |

## Controls now in place

1. The public notice licenses only GovWait-owned organization, field definitions
   and explanatory metadata under CC BY 4.0, to the extent those rights exist.
2. GovWait explicitly does not relicense underlying government information.
3. Every record retains an originating agency and official `source_url`.
4. The source register publishes a source-specific reuse note.
5. CSV and JSON outputs preserve material qualifiers, including ranges,
   unavailable states, units and measure type.
6. UDI explanatory prose, government logos and page designs are not republished.
7. Commercial delivery, support or formatting is not described as ownership of
   underlying government facts.

## Residual risks and review triggers

Re-review before any of the following:

- publishing the MCP server or another package under a software licence;
- selling a bulk data licence, data feed or redistribution right;
- adding a source whose terms are missing, contradictory or account-gated;
- reproducing government prose, images, logos or database extracts beyond the
  current attributed factual fields;
- receiving a source-owner complaint or terms-change notice; or
- making a rights or exclusivity promise to a customer or directory.

If a source's position becomes unclear, fail closed for that source's new
publication while preserving the internal historical record and documenting the
reason. Contact: `contact@govwait.com`.
