import { source } from '@/lib/source';
export function GET() { return new Response('# Innflow Documentation\n\n' + source.getPages().map(p => `- [${p.data.title}](${p.url}): ${p.data.description || ''}`).join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }); }
