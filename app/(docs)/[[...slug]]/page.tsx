import { source } from '@/lib/source';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/notebook/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
type Props = { params: Promise<{ slug?: string[] }> };
export default async function Page({ params }: Props) {
 const { slug } = await params; const page = source.getPage(slug); if (!page) notFound(); const MDX = page.data.body;
 return <DocsPage toc={page.data.toc} full={page.data.full}><div className="page-eyebrow">{slug?.[0] === 'academy' ? 'INNFLOW ACADEMY' : slug?.[0] === 'mcp' ? 'MCP REFERENCE' : slug?.[0] === 'api-reference' ? 'DEVELOPER REFERENCE' : 'INNFLOW DOCUMENTATION'}</div><DocsTitle>{page.data.title}</DocsTitle><DocsDescription>{page.data.description}</DocsDescription><DocsBody><MDX components={getMDXComponents()} /></DocsBody></DocsPage>;
}
export async function generateStaticParams() { return source.generateParams(); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const page = source.getPage((await params).slug); if (!page) notFound(); return { title: page.data.title, description: page.data.description, alternates: { canonical: page.url } }; }
