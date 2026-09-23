import { source } from './source';
import type { Root } from 'fumadocs-core/page-tree';

// Give the documentation sections peer roots while keeping the original page URLs.
const tree = source.getPageTree();
const sections = tree.children.filter(node => node.type === 'folder' && node.root);
const documentation = tree.children.filter(node => !(node.type === 'folder' && node.root));
export const navigation: Root = {
  name: 'Innflow',
  children: [
    { type: 'folder', name: 'Documentation', root: true, index: documentation.find(node => node.type === 'page' && node.url === '/') as Extract<(typeof documentation)[number], { type: 'page' }> | undefined, children: documentation },
    ...sections.filter(node => node.name === 'API Reference'),
    ...sections.filter(node => node.name === 'MCP Reference'),
    ...sections.filter(node => node.name === 'Academy'),
  ],
};
