# Innflow Docs

Innflow's documentation, built with Astro and Starlight. The site produces static HTML, CSS, JavaScript, fonts, and a Pagefind search index. It runs without a Mintlify subscription or a hosted search service.

## Local Development

Use Node.js 24 LTS and npm:

```bash
npm ci
npm run dev
```

Open http://localhost:4321. Edit pages in `src/content/docs/` and sidebar groups in `navigation.json`. The original 37 MDX pages retain their public paths. The homepage is `/`, with `/index` redirected there. Product prose was migrated unchanged; product accuracy still needs editorial review.

Validate and preview the production build:

```bash
npm run check
npm run build
npm run verify
npm run preview
```

`verify` checks every content page, navigation entry, local asset/link, search index, and the 404 output. GitHub Actions builds and uploads `dist/` on pull requests and pushes to main.

## Publishing

Publish `dist/` to a static host. Build command: `npm run build && npm run verify`. Output directory: `dist`. Set `SITE_URL` at build time if the canonical hostname differs from `https://docs.innflow.ai`.

### Run on your own server

```bash
docker compose up -d --build
```

The unprivileged Nginx container serves the site on `127.0.0.1:8080`. Put the server's HTTPS reverse proxy in front of that address. It must preserve directory routes and return the provided 404 page with HTTP 404 for unknown paths.

### Move the live domain from Mintlify

1. Deploy this migration branch to the chosen host and verify its preview, search, mobile navigation, and representative deep links.
2. Configure `docs.innflow.ai` on that host and follow its DNS/TLS instructions.
3. Switch DNS, then verify the public hostname and its old page URLs.
4. Disable Mintlify's repository integration and merge the migration branch. Keep the previous service available until the domain has been verified.
5. Cancel Mintlify only after the replacement is healthy.

Production remains on Mintlify until the hostname is explicitly switched.

The replacement is deployed at https://innflow-docs.vercel.app from branch `docs/self-hosted` (migration PR #6). GitHub build checks pass. The current cutover blocker is that `docs.innflow.ai` is assigned to Mintlify's Vercel project; release that custom domain in Mintlify before attaching it to the new `flowlabs-inc/innflow-docs` project. Keep the migration PR unmerged while the original Mintlify site is serving the domain.

## Structure

- `src/content/docs/` contains the MDX documentation.
- `navigation.json` controls the sidebar.
- `src/components/` supports the existing cards, columns, steps, and callouts.
- `src/styles/brand.css` and `src/assets/` contain brand styles and canonical Innflow logos.
- `public/` contains images and the favicon.
- `docs.json` retains the previous Mintlify configuration for migration reference; it does not drive the new site.
