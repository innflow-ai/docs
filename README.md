# Innflow Docs

This repository contains the public documentation site for Innflow, built with Mintlify.

## Local Development

Install the Mintlify CLI:

```bash
npm i -g mint
```

Preview the docs from this directory:

```bash
mint dev
```

The local preview runs at `http://localhost:3000`.

## Publishing

Mintlify is connected to this GitHub repository. Updates are deployed automatically after changes are pushed to the default branch.

## Structure

- `docs.json` controls navigation, theme, logos, footer links, and global anchors.
- `index.mdx` is the documentation homepage.
- `quickstart.mdx` is the first-run guide.
- `essentials/` covers workflow concepts.
- `tools/` covers workflow action nodes.
- `features/` covers product surfaces such as credentials, billing, teams, tables, and Copilot.
- `api-reference/` contains API documentation.
