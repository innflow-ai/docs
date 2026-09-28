# REST API reference review — September 28, 2026

## Scope and evidence

Extended the existing Fumadocs API section with authentication/workspace guidance, workflows, executions, authoring, errors/retries, a complete endpoint index, endpoint pages, and a downloadable OpenAPI reference snapshot. Preserved existing introduction and CLI URLs.

Reviewed application source at `3782e045` in `/Users/julianpatrick/Developer/innflow`: all customer-facing `/api/v1` route handlers, shared API contracts, bearer/workspace authentication, proxy limits, response replay, and authoring operation receipts. Coverage is 25 HTTP operations. The portal event service-ingestion route and non-public application routes are outside customer API coverage.

Live read-only checks found the application OpenAPI endpoint reachable and serving the core subset. This is not an authenticated end-to-end test of every endpoint or proof that gated authoring is enabled in production.

## Corrections

- Explicit workspace selection: `personal` restricts personal resources; omission retains legacy user-owned scope.
- Core create/import/duplicate/execute response replay is distinct from authoring transaction receipts. Deploy/undeploy do not have API-key response replay.
- Execution dispatch is not completion; use the returned execution ID.
- Read graph connections differ from import index-based edges.
- Rate-limit proxy errors differ from application error envelopes.

## Validation

- `npm run api:source-check`: passed, all 25 operations and recorded source fingerprints.
- `npm run check`: passed.
- `npm run build`: passed.
- `npm run verify`: passed, 91 content pages and 113 local targets, navigation, search, and 404 behavior.
- `git diff --check`: passed.
- `npm run docs:check`: existing generated integration-tool reference/snapshot drift against current app source. The REST reference does not change that catalog; no unrelated tool catalog regeneration was included.

Public MDX is not an input to the app's current Copilot retrieval corpus. No Qdrant update or application deployment is required for these documentation changes.
