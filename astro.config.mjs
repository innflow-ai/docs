import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { readFileSync } from 'node:fs';

const navigation = JSON.parse(readFileSync(new URL('./navigation.json', import.meta.url), 'utf8'));
const editBranch = process.env.VERCEL_GIT_COMMIT_REF || 'docs/self-hosted';

export default defineConfig({
  site: process.env.SITE_URL || 'https://docs.innflow.ai',
  redirects: { '/index': '/' },
  integrations: [starlight({
    title: 'Innflow Docs',
    description: 'Build, connect, and run your workflows with Innflow.',
    logo: { light: './src/assets/logo-light.svg', dark: './src/assets/logo-dark.svg', replacesTitle: true },
    favicon: '/favicon.svg',
    customCss: ['./src/styles/brand.css'],
    social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/innflow-ai/docs' }],
    editLink: { baseUrl: `https://github.com/innflow-ai/docs/edit/${editBranch}/` },
    credits: false,
    sidebar: navigation.tabs.map(tab => ({
      label: tab.tab,
      items: tab.groups.map(group => ({
        label: group.group,
        collapsed: !['Getting Started', 'Essentials', 'API Documentation'].includes(group.group),
        items: group.pages.map(slug => ({ slug: slug === 'index' ? '' : slug })),
      })),
    })),
  })],
});
