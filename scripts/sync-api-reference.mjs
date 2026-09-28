import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { catalog } from './api/catalog.mjs';
const check = process.argv.includes('--check');
const sourceCheck = process.argv.includes('--source-check');
const sourceRoot = resolve(process.env.INNFLOW_SOURCE ?? '../innflow');
const output = (file, value) => {
  if (check || sourceCheck) { if (readFileSync(file, 'utf8') !== value) throw new Error(`Stale generated API reference: ${file}`); }
  else writeFileSync(file, value);
};
const json = value => JSON.stringify(value, null, 2) + '\n';
const code = (language, value) => '\n```' + language + '\n' + value + '\n```\n';
const permission = entry => entry.permission ?? `${entry.group === 'Executions' ? 'executions' : 'workflows'}:${entry.method === 'GET' ? 'read' : 'write'}`;
const workspace = { name:'X-Innflow-Workspace', in:'header', description:'Organization ID, or personal. Set explicitly; omission uses legacy user-owned resource scope.', schema:{type:'string'} };
const idempotency = required => ({name:'Idempotency-Key',in:'header',required,description:required ? 'Required operation key: 1–200 letters, digits, dots, colons, underscores or hyphens.' : 'Optional replay key, at most 200 characters. Same request and key replay for 24 hours.',schema:{type:'string',maxLength:200,...(required?{minLength:1,pattern:'^[A-Za-z0-9_.:-]+$'}:{})}});
const document = {openapi:'3.1.0',info:{title:'Innflow REST API',version:'2026-09-28',description:'Customer REST API reference. Authoring operations depend on authoring availability. Internal portal event ingestion is not a customer API.'},servers:[{url:'https://app.innflow.ai/api/v1'}],security:[{bearerAuth:[]}],components:{securitySchemes:{bearerAuth:{type:'http',scheme:'bearer',description:'Innflow API key. Keep credentials on the server.'}}},paths:{}};
mkdirSync('content/docs/api-reference/endpoints',{recursive:true});
const index = [];
for (const entry of catalog) {
 const parameters = [...entry.path.matchAll(/\{(\w+)\}/g)].map(match=>({name:match[1],in:'path',required:true,schema:{type:'string'}}));
 if (!entry.public) parameters.push(workspace);
 if(entry.idempotency) parameters.push(idempotency(entry.idempotency === 'required'));
 parameters.push(...(entry.query??[]));
 const status = String(entry.status??200);
 const operation = {operationId:entry.id,summary:entry.title,description:[entry.description,entry.notes].filter(Boolean).join('\n\n'),tags:[entry.group],...(entry.public?{security:[]}:{}),parameters,responses:{[status]:{description:entry.response,content:{'application/json':{schema:{type:'object',additionalProperties:true}}}}}};
 if(entry.body) operation.requestBody = {required:!!entry.bodyRequired,content:{'application/json':{schema:entry.body,...(entry.example?{example:entry.example}:{})}}};
 if(!entry.public) operation.responses.default={description:'Error response. See authentication and errors guide; proxy rate-limit responses may not have this envelope.',content:{'application/json':{schema:{type:'object',properties:{error:{type:'string'},code:{type:'string'},requestId:{type:'string'},details:{}},required:['error']}}}};
 (document.paths[entry.path]??={})[entry.method.toLowerCase()]=operation;
 const url = 'https://app.innflow.ai/api/v1'+entry.path.replace(/\{(\w+)\}/g,(_,key)=>key === 'nodeType' ? 'MANUAL_TRIGGER' : key.replace(/[A-Z]/g,s=>'_'+s.toLowerCase()));
 const requiredQuery = (entry.query??[]).filter(p=>p.required).map(p=>`${p.name}=${p.name === 'provider'?'provider_id':p.name === 'field'?'field_name':'node_id'}`).join('&');
 const curl = [`curl --request ${entry.method} '${url}${requiredQuery?'?'+requiredQuery:''}'`,...(!entry.public?['  --header "Authorization: Bearer $INNFLOW_API_KEY"']:[]),...(entry.idempotency?['  --header "Idempotency-Key: unique-request-001"']:[]),...(entry.body?['  --header "Content-Type: application/json"',`  --data '${JSON.stringify(entry.example??{},null,2)}'`]:[])].join(' \\\n');
 let page = `---\ntitle: '${entry.title}'\ndescription: '${entry.method} ${entry.path}'\n---\n\n${entry.description}\n\n`+code('http',`${entry.method} /api/v1${entry.path}`);
 page += entry.public ? '\nNo authentication required.\n' : `\n**Permission:** \`${permission(entry)}\`. Write endpoints also require a workspace role that permits changes. See [authentication](/api-reference/authentication) and [errors](/api-reference/errors).\n`;
 if(entry.notes) page += '\n'+entry.notes+'\n';
 page += '\n## Request\n'+code('bash',curl)+'\nExamples use placeholder IDs. Set `INNFLOW_API_KEY` in your shell and replace IDs with your own before sending a request.\n';
 if(parameters.length) page += '\n## Parameters\n\n| Name | In | Required | Details |\n| --- | --- | --- | --- |\n'+parameters.map(p=>`| \`${p.name}\` | ${p.in} | ${p.required?'Yes':'No'} | ${p.description??'Resource identifier.'} |`).join('\n')+'\n';
 if(entry.body) page+='\n## JSON body\n\n'+(entry.bodyRequired?'Required JSON body.':'Optional JSON body.')+code('json',JSON.stringify(entry.body,null,2));
 page+='\n## Response\n\n**HTTP '+status+'** — '+entry.response+'\n\nSee [OpenAPI download](/openapi.json) for the machine-readable request contract and [errors](/api-reference/errors) for errors and retry behavior.\n';
 output(`content/docs/api-reference/endpoints/${entry.id}.mdx`,page);
 index.push(`| \`${entry.method}\` | \`${entry.path}\` | [${entry.title}](/api-reference/endpoints/${entry.id}) |`);
}
output('public/openapi.json',json(document));
const groups = [...new Set(catalog.map(entry=>entry.group))];
output('content/docs/api-reference/endpoints/meta.json',json({title:'Endpoints',pages:['index', ...groups.flatMap(group=>[`---${group}---`,...catalog.filter(entry=>entry.group===group).map(entry=>entry.id)])]}));
output('content/docs/api-reference/endpoints/index.mdx',`---\ntitle: 'REST endpoints'\ndescription: '${catalog.length} REST operations for workflows, executions, workspaces and authoring'\n---\n\nBase URL: \`https://app.innflow.ai/api/v1\`.\n\n[Authentication](/api-reference/authentication) · [Authoring guide](/api-reference/authoring) · [Download OpenAPI 3.1](/openapi.json)\n\n${groups.map(group=>'## '+group+'\n\n| Method | Path | Reference |\n| --- | --- | --- |\n'+catalog.map((entry,i)=>entry.group===group?index[i]:null).filter(Boolean).join('\n')).join('\n\n')}\n\n## Scope\n\nThis reference covers every customer-facing route under \`/api/v1\`, including authoring and discovery. \`/api/v1/portal-events\` is service-to-service ingestion and does not accept customer API keys. Provider callbacks, internal service APIs, browser-session routes and tRPC are separate interfaces, not general customer REST endpoints. See [triggers](/triggers) for workflow-specific webhook setup and [MCP](/mcp) for the MCP interface.\n`);
if(sourceCheck){
 const walk = dir => readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(resolve(dir,entry.name)):[resolve(dir,entry.name)]);
 const root = resolve(sourceRoot,'src/app/api/v1');
 const actual=[];
 for(const file of walk(root).filter(file=>file.endsWith('/route.ts'))){
  const path='/'+relative(root,file).replace(/\/route.ts$/,'').replace(/\[([^\]]+)\]/g,'{$1}');
  if(path==='/portal-events')continue;
  for(const match of readFileSync(file,'utf8').matchAll(/export (?:const|async function|function) (GET|POST|PATCH|DELETE|PUT|OPTIONS|HEAD)\b/g)) actual.push(match[1]+' '+path);
 }
 const documented=catalog.map(entry=>entry.method+' '+entry.path);
 if(JSON.stringify(actual.sort())!==JSON.stringify(documented.sort()))throw new Error('Route coverage mismatch: '+JSON.stringify({actual,documented}));
 const baseline=JSON.parse(readFileSync('scripts/api/source-manifest.json','utf8'));
 for(const [file,hash] of Object.entries(baseline.files))if(createHash('sha256').update(readFileSync(resolve(sourceRoot,file))).digest('hex')!==hash)throw new Error('Review changed API source: '+file);
}
console.log(`${check||sourceCheck?'Checked':'Generated'} ${catalog.length} REST operations, endpoint pages and OpenAPI 3.1.`);
