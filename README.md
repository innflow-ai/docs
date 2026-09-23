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

## Publishing and domain cutover

This change is local. Before switching the live site:

1. Deploy a preview from this project using `npm ci`, `npm run build`, and `npm start` (or a compatible Next.js host).
2. Check the preview's routes, search, mobile menu, theme, and assets.
3. Check the existing Git publishing integration before merging: the old Mintlify integration expects root-level MDX files and must be disconnected or reconfigured as part of cutover.
4. Configure the documentation domain on the chosen host and verify HTTPS before changing DNS.
5. Switch `docs.innflow.ai`, verify key existing URLs, then retire the old hosting. Keep the previous Git revision and old hosting available for rollback until the new site is verified.

Git-triggered automatic deployment must be configured on the chosen host; this repository does not change DNS or cancel Mintlify.
