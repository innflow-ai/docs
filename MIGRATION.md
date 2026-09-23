# Documentation migration evidence

Reference structure: https://docs.sim.ai/academy (inspected 2026-09-23). The implementation adopts separate documentation/academy navigation, topic groups, lesson objectives, article outlines, and sequential reading links. Copy and lessons are original Innflow material.

## Current scope

- 37 original MDX pages migrated, with original public paths preserved.
- 15 new Academy pages including two practical exercises.
- One new AI Decision reference with availability caveat.
- Self-hostable Next.js/Fumadocs site with local full-text search.
- Original Mintlify MDX components adapted to React/Fumadocs components.

## Source checks for new or corrected material

Application repository: `../innflow`.

| Topic | Evidence |
| --- | --- |
| Application, workspace, files, tables, knowledge base, credentials, public API boundaries | `ARCHITECTURE.md` |
| Loop items, result expression, error handling, iteration bounds | `src/tool-configs/loop/block.ts` |
| Rule and LLM conditions | `src/tool-configs/condition/block.ts` |
| Tables operations and output path | `src/tool-configs/tables/block.ts` |
| Multiple trigger authoring remains gated | `src/features/triggers/lib/entrypoint.ts` and editor callers |
| AI Decision questions, review path, and rollout restrictions | `docs/ai-decision/README.md` |

This verifies source behavior, not production enablement or an end-to-end product acceptance run.

## Follow-up content review

The original reference is not fully refreshed. Before treating the entire reference as current, check all node families against registered and visible blocks; check per-operation fields and outputs; verify plans/limits and service availability; refresh UI instructions and screenshots; verify API and CLI examples against current contracts; distinguish deployed behavior from disabled features. Existing migrated pages retain their earlier content unless explicitly corrected above.

No DNS changes, remote publish, or subscription cancellation occurred as part of this local build.

## Local verification

- `npm run types:check` and `npm run build` passed.
- All 53 content routes returned HTTP 200 from the local production server; sitemap, robots, llms index, and legacy `/index` redirect also passed (57 checks).
- Content link scan found no missing local destination paths.
- Production search returned results for Loop; browser search selection opened the Loop lesson.
- Browser checks covered section navigation, light/dark themes, and a 390px mobile sidebar with document width equal to viewport width.
- No browser console errors were observed in the final Academy preview.

These are local checks, not a claim of deployment or a complete content accuracy audit.

## Brand and MCP reference addition

- Header assets copied unchanged from `../innflow/public/assets/innflow/innflow-{black,white}-full.svg`; the black full SVG is used by `src/features/auth/components/auth-showcase.tsx`. Favicon copied from `public/logos/innflow-icon-black.svg`.
- Six MCP pages checked against `../mcp/src/config.ts`, `src/server.ts`, `src/tools/innflow/{workflows,executions,authoring}.ts`, and application `src/features/mcp-servers/{components/mcp-servers-settings.tsx,server/routers.ts}`, `src/tool-configs/mcp/block.ts`, and `src/features/tools/components/mcp/{mcp-client,executor}.ts`.
- Current source overrides older MCP skill/README statements: the service has product API tools and gated authoring, and the application settings form currently exposes bearer credentials rather than a general OAuth connection flow.
- MCP endpoint defaults are documented as configuration values; no live authentication or production enablement claim is made.
