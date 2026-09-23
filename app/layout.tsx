import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import './global.css';
export const metadata: Metadata = { metadataBase: new URL(process.env.SITE_URL || 'https://docs.innflow.ai'), title: { default: 'Innflow Docs', template: '%s | Innflow Docs' }, description: 'Learn to build, connect, and operate workflows with Innflow.', icons: { icon: '/favicon.svg' } };
export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="en" suppressHydrationWarning><body><a href="#nd-page" className="skip-link">Skip to content</a><RootProvider theme={{ defaultTheme: 'light' }}>{children}</RootProvider></body></html>; }
