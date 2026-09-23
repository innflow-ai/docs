import { source } from '@/lib/source';
import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap { const base = process.env.SITE_URL || 'https://docs.innflow.ai'; return source.getPages().map(p => ({ url: new URL(p.url, base).href })); }
