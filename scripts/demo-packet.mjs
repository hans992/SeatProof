import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRun,approveMapping,reconcile,reviewFinding,packet,findingsCSV} from '../lib/core.mjs';
import {suggest} from '../lib/matching.mjs';
import {createStore} from '../lib/store.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),out=path.join(root,'artifacts');mkdirSync(out,{recursive:true});
const store=createStore(':memory:'),u=store.setup('Synthetic evidence example','demo@example.test','Synthetic-only-password-42');
let run=store.create(u.org_id,u.id,createRun(readFileSync(path.join(root,'samples/vendor.csv'),'utf8'),readFileSync(path.join(root,'samples/psa.csv'),'utf8'),'October 2026 · synthetic demo')).run;
const {result,trace}=await suggest(run,'V003',{enabled:false});
run=store.update(u.org_id,u.id,run.id,run.version,r=>{r.suggestions.push(result);r.traces.push(trace);},'suggestion_created',{mode:'offline-lexical'});
run=store.update(u.org_id,u.id,run.id,run.version,r=>approveMapping(r,'V003','P003','Synthetic example: both descriptions identify Office 365 E3.'),'mapping_approved',{vendor_id:'V003',psa_id:'P003'});
for(const f of reconcile(run).findings.filter(f=>f.kind!=='aligned')){
 const notes={held:'Held: obtain comparable period/currency/unit records; no amount claimed.',unmatched:'Investigate supplier-only service; no selling price inferred.',orphan:'Check whether this is a legitimate standalone managed service.',underbilled:'Follow up: check signed minimums and customer terms before adjusting.',overbilled:'Follow up: verify billed commitment before considering any credit.'};
 run=store.update(u.org_id,u.id,run.id,run.version,r=>reviewFinding(r,f.id,'follow_up',notes[f.kind]||'Investigate margin and contract terms.','Synthetic reviewer'),'finding_reviewed',{finding:f.id});
}
writeFileSync(path.join(out,'demo-evidence-packet.json'),JSON.stringify(packet(run,store.events(u.org_id)),null,2));writeFileSync(path.join(out,'demo-findings.csv'),findingsCSV(run));store.close();console.log(JSON.stringify(reconcile(run).totals));
