import { navigation } from '@/lib/navigation';
import { DocsLayout } from 'fumadocs-ui/layouts/notebook';
import { baseOptions } from '@/lib/layout.shared';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DocsLayout tree={navigation} {...baseOptions()} nav={{ ...baseOptions().nav, mode: 'top' }} tabMode="navbar">{children}</DocsLayout>;
}
