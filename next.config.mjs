import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'standalone',
  turbopack: { root: process.cwd() },
  async redirects() { return [{ source: '/index', destination: '/', permanent: true }]; },
};

export default withMDX(config);
