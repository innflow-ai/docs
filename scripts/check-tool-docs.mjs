import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
execFileSync(process.execPath,[resolve(root,'scripts/sync-tool-reference.mjs'),'--check'],{cwd:root,stdio:'inherit'});
const catalog=JSON.parse(readFileSync(resolve(root,'scripts/tool-catalog.snapshot.json'),'utf8'));
const mapping=JSON.parse(readFileSync(resolve(root,'scripts/tool-guide-map.json'),'utf8'));
const byType=new Map(catalog.nodes.map(node=>[node.nodeType,node]));
const section=(text,heading)=>{
 const start=text.indexOf(`## ${heading}\n`);
 assert.ok(start>=0,`Missing section ${heading}`);
 const next=text.indexOf('\n## ',start+3);
 return text.slice(start,next<0?text.length:next);
};
for(const item of mapping){
 const text=readFileSync(resolve(root,item.file),'utf8');
 const body=section(text,item.heading);
 const listed=[...body.matchAll(/^- \*\*[^\n]+?\*\* \(`([^`]+)`\)/gm)].map(match=>match[1]).sort();
 const expected=byType.get(item.nodeType).operations.map(op=>op.value).sort();
 assert.deepEqual(listed,expected,`${item.file} ${item.heading}: operation list differs from universal search`);
}
const checks=[
 ['content/docs/triggers.mdx',['## Innflow Trigger','No independent-trigger setting is required'],['NEXT_PUBLIC_MULTI_TRIGGER_ENABLED','Enable independent triggers']],
 ['content/docs/essentials/variables.mdx',['{{api.httpResponse.data}}','{{code.result}}','{{kb.results}}'],['{{http_response.output.data}}']],
 ['content/docs/features/copilot.mdx',['configured model automatically'],['- Model selection','choose a chat model']],
 ['content/docs/features/assistant.mdx',['not separate active chat runtimes'],['Exclusive → Assistant']],
];
for(const [file,required,forbidden] of checks){
 const text=readFileSync(resolve(root,file),'utf8');
 for(const value of required)assert.ok(text.includes(value),`${file}: missing ${value}`);
 for(const value of forbidden)assert.ok(!text.includes(value),`${file}: obsolete ${value}`);
}
console.log(`Checked ${mapping.length} guide operation lists and regression claims.`);
