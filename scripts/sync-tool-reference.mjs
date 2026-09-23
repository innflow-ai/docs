import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const appRoot = resolve(process.env.INNFLOW_SOURCE ?? resolve(docsRoot, '../innflow'));
const moduleUrl = path => JSON.stringify(pathToFileURL(resolve(appRoot, path)).href);
const program = `
import {buildUniversalSearchItems} from ${moduleUrl('src/components/universal-search-items.ts')};
import {getAuthoringContract} from ${moduleUrl('src/features/editor/lib/authoring/contracts.ts')};
import {NODE_REGISTRY} from ${moduleUrl('src/config/node-registry.ts')};
const items=buildUniversalSearchItems().map(({icon,...item})=>item);
const nodes=items.filter(i=>i.category!=="operations").map(item=>({
 ...item, contract:getAuthoringContract(item.nodeType),
 operations:items.filter(i=>i.category==="operations"&&i.nodeType===item.nodeType).map(i=>({label:i.label,value:i.operationValue,description:i.description})),
}));
console.log(JSON.stringify({nodes,searchItemCount:items.length,operationCount:items.filter(i=>i.category==="operations").length,
 hiddenTypes:Object.entries(NODE_REGISTRY).filter(([,value])=>value.pickerVisible===false).map(([type])=>type).sort()}));`;
const catalog = JSON.parse(execFileSync(resolve(appRoot, 'node_modules/.bin/tsx'), ['--tsconfig='+resolve(appRoot, 'tsconfig.json'), '--eval', program], {cwd:appRoot, encoding:'utf8', maxBuffer:20*1024*1024, env:{...process.env, NEXT_PUBLIC_JEV_NODE_ENABLED:'false'}}));
// A searchable operation can still be an unimplemented application path.
// This exception is based on Innflow source, not a claim about Slack's public API.
const canvasSource=readFileSync(resolve(appRoot,'src/tools/slack/actions/create-canvas.ts'),'utf8');
if(!canvasSource.includes('throw new NonRetriableError(')) throw new Error('Re-review Slack Canvas availability: implementation changed.');
const operationDescription=(node,op)=>node.nodeType==='SLACK' && op.value==='CREATE_CANVAS'
 ? 'Listed in search, but the current Innflow implementation rejects this operation.' : op.description;
const escape = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('{','&#123;').replaceAll('}','&#125;').replaceAll('|','&#124;').replaceAll('\n',' ');
const auth = {oauth:'Connect the account requested by the node.',api_key:'Configure the API credential requested by the node.',platform:'Uses a platform-managed connection.',none:'No account connection declared.',connection:'Select the connection requested by the node.'};
const lines = ['---','title: "Tool and operation reference"','description: "Every standard node and operation available in universal search, with configuration fields from the application."','---','','This reference lists the standard universal-search catalog. Availability can also depend on your plan and workspace. [AI Decision](/tools/ai-decision) is separately controlled and is not included in the standard catalog.','','Search includes **'+catalog.nodes.length+' node entries** and **'+catalog.operationCount+' operations**. The category guides explain common workflows; use this reference for the complete operation list.','','Configuration fields may appear only after selecting an operation, account, or mode. Required fields depend on that selection. Account selectors load live choices; do not invent their IDs. Output fields can also depend on configuration and the response from a service—inspect an execution before referencing a value.',''];
for (const node of catalog.nodes) {
 lines.push(`<a id="${node.nodeType.toLowerCase().replaceAll('_','-')}" />`, '', `## ${escape(node.label)}`, '', escape(node.description), '', `Node type: \`${node.nodeType}\`.`, '', auth[node.contract.authMode] ?? 'Follow the connection controls shown in the editor.', '');
 if (node.operations.length) {
  lines.push('### Operations','','| Operation | Configuration value | Description |','| --- | --- | --- |');
  for (const op of node.operations) lines.push(`| ${escape(op.label)} | \`${op.value}\` | ${escape(operationDescription(node,op))} |`);
  lines.push('');
 }
 if (node.contract.fields.length) {
  lines.push('### Configuration','','Fields are listed across available modes. Conditional fields are only applicable when the matching operation or mode is selected.','','| Field | Configuration key | Details |','| --- | --- | --- |');
  for (const field of node.contract.fields) {
   const description = node.nodeType === "CODE" && field.name === "code" ? "Read upstream data through context. For Python scripts, print JSON as the last output for a structured result. Use return only inside a function. Captured expression results are used when the runner provides them." : node.nodeType === "MCP" && field.name === "variableName" ? "Reference name.text for agentic responses; direct tool calls expose name.content and optional name.structuredContent. Resource and prompt modes expose the returned server payload." : field.description;
   const details = [description,field.readOnly?'Read only.':null,field.secret?'Secret; enter through the secure configuration control.':null,field.dynamicOptions?'Choose from options loaded in the editor.':null,field.options?.length?'Choices: '+field.options.map(o=>o.label).join(', '):field.enum?.length?'Choices: '+field.enum.join(', '):null,field.condition!==undefined?'Conditional field.':null].filter(Boolean).join(' ');
   lines.push(`| ${escape(field.label ?? field.name)} | \`${field.name}\` | ${escape(details)} |`);
  }
  lines.push('');
 } else lines.push('Open this node in the editor for its setup controls. No editable field list is declared in the shared configuration catalog.','');
}
const rendered=lines.join('\n')+'\n';
const outputs = [[resolve(docsRoot,'content/docs/tools/reference.mdx'),rendered],[resolve(docsRoot,'scripts/tool-catalog.snapshot.json'),JSON.stringify(catalog,null,2)+'\n']];
if(process.argv.includes('--check')) {
 const stale=outputs.filter(([file,value])=>readFileSync(file,'utf8')!==value).map(([file])=>file);
 if(stale.length) throw new Error('Tool reference differs from application source: '+stale.join(', '));
} else for(const [file,value] of outputs) writeFileSync(file,value);
console.log(`Verified ${catalog.nodes.length} node entries and ${catalog.operationCount} exact operation IDs against universal search.`);
