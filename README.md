# Innflow Docs

Innflow's documentation, built with Astro and Starlight. The site produces static HTML, CSS, JavaScript, fonts, and a Pagefind search index. It runs without a Mintlify subscription or a hosted search service.

## Local Development

Use Node.js 24 LTS and npm:

```bash
npm ci
npm run dev
```

Open http://localhost:4321. Edit pages in `src/content/docs/` and sidebar groups in `navigation.json`. The original 37 MDX pages retain their public paths. The homepage is `/`, with `/index` redirected there. The initial migration preserved product prose; subsequent content reviews are recorded in `CONTENT-REVIEW.md`.

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

### Production deployment

https://docs.innflow.ai is served by the `flowlabs-inc/innflow-docs` Vercel project. GitHub pushes to `main` publish production; pull requests receive previews. Edit `src/content/docs/`, open a pull request, and merge after the build checks pass.

The custom domain was released from Mintlify on 2026-09-18 and its CNAME now points to `bbc5a1816ac40fb3.vercel-dns-016.com.`. The alternate address is https://innflow-docs.vercel.app.

The previous Mintlify source is preserved on `archive/mintlify` at commit `4afb04a83863782c328882501e15654dc56ff338`. Mintlify tracks that archive branch instead of main. Its account and subscription were not deleted or cancelled. Rolling back the hostname requires releasing it from this Vercel project, attaching it in Mintlify, and restoring Mintlify's DNS target; changing DNS alone is insufficient.

## Structure

- `src/content/docs/` contains the MDX documentation.
- `navigation.json` controls the sidebar.
- `src/components/` supports the existing cards, columns, steps, and callouts.
- `src/styles/brand.css` and `src/assets/` contain brand styles and canonical Innflow logos.
- `public/` contains images and the favicon.
- `docs.json` retains the previous Mintlify configuration for migration reference; it does not drive the new site.
