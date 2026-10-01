<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

This site runs with Node.js 24, matching `.github/workflows/docs.yml` and the Dockerfile. The Cloud Agent image can put an older `node` earlier on `PATH` (`/exec-daemon/node`). Select Node 24 with nvm before install, dev, or CI checks:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
nvm use 24
export PATH="$(dirname "$(nvm which 24)"):$PATH"
```

- Install with `npm ci`. No database, API key, or external search account is required. Search is local Fumadocs/Orama.
- Dev server: `npm run dev -- --hostname 0.0.0.0 --port 3000`. Docs are `/`, Academy is `/academy`, and the API reference is `/api-reference/introduction`.
- CI checks: `npm run check`, `npm run build`, then `npm run verify`. `verify` starts the standalone server and checks content routes, navigation, local links, search, and the 404 response.
- `npm run docs:check` compares tool guides with the sibling Innflow checkout (`../innflow` or `INNFLOW_SOURCE`) and needs that repo's dependencies, including `tsx`. It is not required to build or serve this site.
