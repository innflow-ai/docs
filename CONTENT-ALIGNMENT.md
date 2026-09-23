# Documentation alignment audit — September 23, 2026

This audit compares the local documentation with the current Innflow application source, including universal search, authoring contracts, execution handlers, navigation, and subscription limits. Application revision at review: `5ab764a564e371633b9cfc4166d84d69353a559c`. Documentation base: `43cc54675dffc41308dc89d5316062dac90312f1`.

## Implemented changes

Every item below has been implemented in this checkout. Paths under `src/` refer to the sibling Innflow application; `content/` paths refer to this documentation repository.

| # | Mismatch or gap | Documentation correction | Application evidence |
| --- | --- | --- | --- |
| 1 | No complete reference tied to universal search | Added a generated reference covering all 94 standard node entries and 309 exact operation IDs | `src/components/universal-search-items.ts`, `src/config/node-registry.ts`, `src/config/tool-operations-registry.ts` |
| 2 | Handwritten configuration summaries omitted many fields | Added complete shared configuration field lists, selectors, conditional-field notes, and secret-field guidance | `src/features/editor/lib/authoring/contracts.ts`, `src/tool-configs/` |
| 3 | No repeatable catalog drift check | Added `docs:sync` and `docs:check`; stale reference or operation lists fail verification | Same registry and authoring-contract sources as items 1–2 |
| 4 | Innflow Trigger had no dedicated guide | Added purpose, typed input, caller selection, and links to trigger/action configuration | `src/features/copilot/lib/trigger-authoring.ts`, `src/features/triggers/lib/entrypoint.ts` |
| 5 | Trigger guide required manual independent-trigger enablement | Replaced with automatic draft upgrade on second-trigger save; retained busy/deployed restrictions | `src/features/triggers/server/automatic-execution-version.ts`, `src/features/editor/hooks/use-add-node.ts` |
| 6 | Nodes/workflows/deployment lesson repeated retired trigger setup | Updated all three entry-point explanations; documented selected-path execution | `src/features/triggers/lib/entrypoint.ts`, `src/inngest/utils.ts` |
| 7 | Manual Trigger claimed to have no output variable/data | Documented variable-picker and active-trigger metadata instead of denying output | `src/features/triggers/lib/entrypoint.ts`, `src/features/copilot/lib/trigger-authoring.ts` |
| 8 | Condition guide described JavaScript expressions as the new-node configuration | Documented typed comparisons, AND/OR combinations, and fixed If/Else outputs; retained a legacy-mode explanation | `src/features/tools/components/condition/executor.ts`, `src/features/editor/lib/authoring/contracts.ts` |
| 9 | Branching lesson implied LLM Condition was the default current form | Distinguished typed new Conditions from saved legacy LLM configurations | Same evidence as item 8 |
| 10 | Router guide omitted first-match semantics | Described best-match and first-match routing, ordered rules, and Else fallback | `src/features/tools/components/router/executor.ts` |
| 11 | Code guide promised the last expression always becomes output | Documented expression/stdout parsing, Python JSON printing, result/log wrappers, and declared output fields | `src/features/tools/components/code/executor.ts`, `src/features/tools/components/code/lib/code-utils.ts` |
| 12 | HTTP Request guide used the wrong picker name and output paths | Added API label, all seven methods, auth/body choices, milliseconds timeout, and `httpResponse` paths | `src/tool-configs/http-request/block.ts`, `src/features/tools/components/http-request/executor.ts` |
| 13 | HTTP failures were not distinguished from HTTP status responses | Documented structured non-2xx responses versus transport/configuration failures | `src/features/tools/components/http-request/server/api-request.ts` |
| 14 | Transform Array described one generic expression for all operations | Documented map expressions, typed filters, aggregations, partial-result behavior, and result/count output | `src/features/tools/components/transform-array/types.ts`, `executor.ts` |
| 15 | Sleep guide omitted the current Wait label and date mode | Added duration/date-time modes and output timestamps | `src/features/tools/components/sleep/executor.ts`, `src/config/node-registry.ts` |
| 16 | Knowledge Base node documented search only | Added Upload, file fields, asynchronous processing, score threshold and correct search output paths | `src/features/tools/components/knowledge-base/executor.ts` |
| 17 | Knowledge Base feature page had an extra output wrapper | Corrected `kb_results.results` and explained upload readiness | Same evidence as item 16 |
| 18 | Variable examples taught a universal output prefix | Replaced with verified node-specific examples and qualified field-specific type handling | API, Code, Knowledge Base, Tavily, Label Fields and Transform Array executors |
| 19 | Quickstart repeated the universal output-prefix assumption | Uses a Tables example and directs readers to actual output schemas | `src/features/tools/components/tables/`, `src/features/editor/lib/authoring/specialized-outputs.ts` |
| 20 | Label Fields examples used `output.name` | Corrected to `extractedData.name` and `extractedData.email` | `src/features/tools/components/label-fields/executor.ts` |
| 21 | Tavily examples used `output.results` | Corrected to direct `results` | `src/features/tools/components/tavily-search/executor.ts` |
| 22 | AI Agent guide assumed a fixed output-text wrapper | Directs readers to the configured agent result and variable picker | `src/features/tools/components/ai-agent/executor.ts` |
| 23 | OpenRouter guide made an unmaintained numeric model-count claim | Defers available choices to the node's current selector | `src/config/node-registry.ts`, `src/features/copilot/lib/node-type-catalog.ts` |
| 24 | Copilot guide advertised per-message model selection | Clarified automatic Copilot model policy versus workflow AI-node model selectors | `src/features/copilot/server/model-experiment.ts`, `src/features/copilot/hooks/use-copilot-chat-go.ts` |
| 25 | Assistant page advertised a separate active chat runtime | Rewrote as retained settings; explained Home redirects and current Copilot usage | `src/app/(dashboard)/(rest)/assistant/page.tsx`, `chat/page.tsx`, `ARCHITECTURE.md` |
| 26 | Landing page repeated the active-Assistant claim | Updated the card to retained Assistant settings | Same evidence as item 25 |
| 27 | Edit Fields and tool-only nodes were described as standard new-node choices | Marked legacy/hidden visibility and gave supported authoring alternatives | `src/config/node-registry.ts`, `src/components/universal-search-items.ts` |
| 28 | Meta was presented as the picker choice | Uses Facebook/Instagram labels while retaining Meta connection terminology | `src/config/node-registry.ts` |
| 29 | Slack Create Canvas was presented as working | Explicitly identifies it as searchable but rejected by Innflow's current implementation; avoids claiming Slack lacks a public API | `src/tools/slack/actions/create-canvas.ts`, `src/features/tools/components/slack/executor.ts` |
| 30 | Slack configuration table listed only messaging operations | Included Create Canvas with the availability limitation above | Slack operation enum, block, and action sources |
| 31 | Calendar guide omitted List Calendars and Word omitted Write | Expanded exact operation lists and Word description | `src/config/tool-operations-registry.ts`, Google Calendar/Microsoft Word node configuration |
| 32 | Numerous integration guides showed partial or outdated operation names | Aligned 53 mapped guide sections with the exact search catalog; added complete reference links | `scripts/tool-operation-audit.json` records the old lists; `scripts/tool-guide-map.json` records each mapping |
| 33 | Basic was used as a current plan label | Updated workflow retention, execution logs, and tables to Pro | `src/config/pricing-tiers.ts`, `src/features/subscriptions/lib/subscription-limits.ts` |
| 34 | Team table claimed obsolete 5–15 seats and Free single-seat limits | Documented current workspace/invitation limits and separated them from billing seats | Same evidence as item 33 |
| 35 | Credentials instructions depended on an outdated settings hierarchy | Linked the actual `/credentials` application route | `src/features/credentials/components/credentials.tsx` |
| 36 | MCP guide used a generic output wrapper | Documented direct `content`/optional `structuredContent`, agentic `text`, and all four execution modes | `src/features/tools/components/mcp/executor.ts` (the older field tooltip still incorrectly says direct `result`) |
| 37 | Google Forms summary claimed metadata retrieval | Limited the action description to its actual Get Responses operation | `src/config/tool-operations-registry.ts`, Google Forms action configuration |

## Operation-by-operation change list

`scripts/tool-operation-audit.json` captures each of the 53 affected guide sections, its node type, previous operation text, and resulting operation count. It distinguishes an incomplete existing list from a previously missing list. The current exact values are in `scripts/tool-catalog.snapshot.json`.

Two source hints need runtime interpretation: the MCP field tooltip still advertises a direct `result` wrapper, and the Code tooltip overgeneralizes expression capture. The docs generator uses executor-backed wording for those fields rather than repeating the stale hints. This documentation task does not change those application tooltips.

The generated reference intentionally lists discoverability separately from operational readiness. Slack Create Canvas is the known discoverable-but-unimplemented action found in this review. AI Decision is documented separately as a gated capability. An operation appearing in search is not evidence of a successful external provider execution.

## Maintaining alignment

From this documentation repository, with the application dependencies installed in the sibling `innflow` checkout:

```sh
npm run docs:sync
npm run docs:check
npm run build
npm run verify
```

Set `INNFLOW_SOURCE=/absolute/path/to/innflow` if the application checkout is elsewhere. The sync reads source definitions without contacting providers, databases, or production. Review its diff; do not automatically publish changes. The check compares the generated reference with fresh application definitions and all 53 mapped operation lists. It also checks regression claims for triggers, output paths, Copilot and Assistant. The standalone verifier checks rendered pages, navigation, local links and fragments, every catalog anchor, search and 404 behavior.

The snapshot uses standard picker availability (AI Decision disabled), not production environment flags. Conditional fields and live selector options still require editor inspection. This change does not provision a vector index, ingest public MDX into Copilot, run provider actions, deploy the docs, or modify application behavior.

## Verification

- `npm run docs:check` passed: 94 standard nodes, 309 exact operation IDs, 53 mapped guide operation lists, and the regression claims.
- `npm run build` passed, including TypeScript checking and MDX compilation.
- `npm run verify` passed against the built standalone server: 60 content pages, navigation, 81 local targets, local fragments, all 94 reference anchors, Innflow Trigger search, Loop search, and unknown-route 404 behavior.
- `git diff --check` passed.
- 28 existing content pages changed and one complete reference page was added. The audit contains 37 implemented changes plus the 53-section operation change inventory.
- No deployment, provider execution, database change, or vector indexing was performed. These are local documentation and rendered-site results, not production verification.
