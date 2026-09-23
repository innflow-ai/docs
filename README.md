# Innflow Docs and Academy

Self-hostable documentation built with Next.js, Fumadocs, and MDX. No Mintlify account, database, paid search service, or API key is needed to run it.

## Develop

```sh
npm ci
npm run dev
```

Open http://localhost:3000/academy for the Academy, `/` for documentation, or `/api-reference/introduction` for the API reference.

## Verify and run

```sh
npm run types:check
npm run build
npm start
```

`npm start` serves the production build. Set `PORT` as needed. Set `SITE_URL` at build time for canonical URLs, the sitemap, and robots.txt; it defaults to https://docs.innflow.ai. Any host that runs a supported Node.js version and Next.js can serve this application. Search runs locally using Fumadocs/Orama. No external search account is required.

## Content

- `content/docs/mcp/`: MCP connection, tool, workflow-node, operator configuration, and troubleshooting reference.
- `content/docs/academy/`: 15 original lessons and exercises, grouped by workflows, AI, workspace resources, and use cases.
- `content/docs/`: all 37 former Mintlify pages at their original public routes, plus the new AI Decision reference.
- `meta.json` files control navigation order and section roots.
- `components/mdx.tsx` provides MDX components, including compatibility for existing cards, steps, columns, and callouts.
- `public/` contains served logos, images, and favicon.
- `docs.json` is the previous Mintlify configuration retained as a migration reference; Fumadocs uses the content metadata instead.
- `/api/search`, `/sitemap.xml`, `/robots.txt`, and `/llms.txt` are generated from the same content source.

Add an MDX page with `title` and `description` frontmatter, then add its filename (without extension) to its folder's `meta.json`. Check links and run the build before publishing. The Academy is written instruction; no video course is claimed or embedded.

## Content accuracy

The Academy is newly written and selected behavior was checked against the application source. The migrated reference pages are preserved content, not a claim that every old instruction, price, or integration option has been reverified. See `MIGRATION.md` for evidence and the remaining content review.

## Publishing

The existing repository deployment notes identify `flowlabs-inc/innflow-docs` as the Vercel project for `docs.innflow.ai`, with production publishing from `main`. This merge retains that setup and changes its checked-in framework configuration to Next.js. It does not change DNS or deploy anything itself. Confirm the project has no dashboard override still forcing Astro or `dist` before publishing.

The earlier migration recorded the domain cutover on 2026-09-18 and preserved Mintlify on `archive/mintlify`. See `CONTENT-REVIEW.md` for that historical record; this local merge has not reverified live hosting or subscription state.

GitHub Actions runs `npm ci`, `npm run check`, `npm run build`, and `npm run verify`. Verification starts the built standalone server and checks content routes, navigation, local links/assets, search, and the 404 response. Artifacts contain the standalone server, static chunks, and public assets; they are not a static HTML export.

### Run on your own server

```sh
docker compose up -d --build
```

The unprivileged Node container runs the standalone Next.js server on `127.0.0.1:8080` through the existing Compose port mapping. Place your HTTPS reverse proxy in front of it. Search requires the server runtime; do not serve this build with the previous static Nginx configuration.

The default `npm start` command also runs the built application from a complete checkout. For a standalone bundle, copy `public/` and `.next/static/` into their corresponding locations under `.next/standalone/`, then run its `server.js`.


## Keep tool documentation aligned with Innflow

See [the September 23 alignment audit](CONTENT-ALIGNMENT.md) for corrected behavior,
source evidence, and the operation-level change list. With the application checkout
at `../innflow` (or `INNFLOW_SOURCE` set to its path), run:

```sh
npm run docs:sync
npm run docs:check
npm run build
npm run verify
```

`docs:sync` regenerates the complete tool reference and source snapshot.
`docs:check` compares them with the current application and checks the operation
lists in the handwritten guides. If a guide fails, update that guide to match the
new operation contract before publishing. Review generated changes as well as
handwritten guidance; a listed operation does not guarantee provider readiness.
