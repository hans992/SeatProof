import {createHash} from 'node:crypto';
export const hash=x=>createHash('sha256').update(typeof x==='string'?x:JSON.stringify(x)).digest('hex');
export class AppError extends Error { constructor(message,status=400){super(message);this.status=status;} }
export const assert=(ok,message,status=400)=>{if(!ok)throw new AppError(message,status);};
export const columns=['row_id','customer_id','customer','product','sku','quantity','unit_price','currency','period_start','period_end','unit','basis'];
export const normalize=x=>String(x).normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
export const suspicious=x=>/ignore\s+(all|previous|prior)|system\s+prompt|<\/?(?:script|system)|https?:\/\/|\bexecute\b|\boverride\s+instructions/i.test(x);

export function parseCSV(text){
  assert(typeof text==='string'&&text.length>0,'CSV is empty.');
  assert(Buffer.byteLength(text)<=750000,'CSV exceeds 750 KB.');
  text=text.replace(/^\uFEFF/,'');
  let rows=[],row=[],cell='',quoted=false,closed=false;
  const pushCell=()=>{row.push(cell);cell='';closed=false;};
  const pushRow=()=>{pushCell();if(row.some(x=>x!==''))rows.push(row);row=[];};
  for(let i=0;i<text.length;i++){
    const ch=text[i];
    if(quoted){if(ch==='"'){if(text[i+1]==='"'){cell+='"';i++;}else{quoted=false;closed=true;}}else cell+=ch;continue;}
    if(ch==='"'){assert(cell===''&&!closed,'Malformed CSV quote.');quoted=true;}
    else if(ch===',')pushCell();
    else if(ch==='\n'||ch==='\r'){if(ch==='\r'&&text[i+1]==='\n')i++;pushRow();}
    else {assert(!closed,'Unexpected characters after quoted CSV field.');cell+=ch;}
  }
  assert(!quoted,'Unclosed CSV quote.');
  if(cell!==''||row.length||closed)pushRow();
  assert(rows.length>=2,'CSV needs a header and at least one data row.');
  assert(rows.length<=1001,'Maximum 1,000 data rows per file.');
  const header=rows.shift().map(x=>x.trim().toLowerCase());
  assert(new Set(header).size===header.length,'Duplicate CSV headers.');
  assert(columns.every(x=>header.includes(x)),'Required columns: '+columns.join(', '));
  assert(header.length===columns.length,'Unexpected CSV columns. Use the supplied template.');
  return rows.map((r,i)=>{assert(r.length===header.length,`CSV row ${i+2} has ${r.length} cells; expected ${header.length}.`);return Object.fromEntries(header.map((h,j)=>[h,r[j].trim()]));});
}
export function cents(text){
  assert(/^-?\d{1,7}(?:\.\d{1,2})?$/.test(text),'unit_price must use a decimal dot, at most two decimals and no currency symbol.');
  const sign=text.startsWith('-')?-1:1,[a,b='']=text.replace('-','').split('.');
  return sign*(Number(a)*100+Number(b.padEnd(2,'0')));
}
function validDate(s){return /^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;}
export function ingest(text,side){
  const rows=parseCSV(text),ids=new Set();
  return rows.map((r,i)=>{
    for(const key of columns)assert(r[key].length<=240,`${key} is too long on row ${i+2}.`);
    for(const key of ['row_id','customer_id','customer','product','unit','basis'])assert(r[key],`${key} is required on row ${i+2}.`);
    assert(/^[\w.-]{1,80}$/.test(r.row_id),'row_id must contain only letters, digits, underscores, dots or hyphens.');
    assert(!ids.has(r.row_id),'Duplicate row_id: '+r.row_id);ids.add(r.row_id);
    assert(/^-?\d{1,6}$/.test(r.quantity),'quantity must be a whole number with at most six digits.');
    assert(Math.abs(Number(r.quantity))<=100000&&Math.abs(cents(r.unit_price))<=10000000,'Local MVP limit: 100,000 units and 100,000.00 unit price per row.');
    assert(['EUR','USD','GBP','CAD','AUD'].includes(r.currency),'Supported currencies: EUR, USD, GBP, CAD, AUD.');
    assert(validDate(r.period_start)&&validDate(r.period_end)&&r.period_start<=r.period_end,'Invalid service period on row '+(i+2));
    return {...r,quantity:Number(r.quantity),price_cents:cents(r.unit_price),unit:normalize(r.unit),basis:normalize(r.basis),side,line:i+2,source_hash:hash(r)};
  });
}
export function comparable(a,b){
  const reasons=[];
  if(a.customer_id!==b.customer_id)reasons.push('Different customer identifiers');
  if(a.currency!==b.currency)reasons.push('Currency mismatch');
  if(a.unit!==b.unit||!['seat','device','server'].includes(a.unit))reasons.push('Unit mismatch or unsupported metering');
  if(a.basis!=='monthly'||b.basis!=='monthly')reasons.push('Bundle, annual or non-monthly billing basis');
  if(a.period_start!==b.period_start||a.period_end!==b.period_end)reasons.push('Service periods differ');
  const fullMonth=r=>r.period_start.endsWith('-01')&&new Date(Date.parse(r.period_end)+86400000).getUTCDate()===1&&r.period_start.slice(0,7)===r.period_end.slice(0,7);
  if(!fullMonth(a)||!fullMonth(b))reasons.push('Partial month / proration requires manual calculation');
  if(a.quantity<0||b.quantity<0||a.price_cents<=0||b.price_cents<=0)reasons.push('Credit or zero-price line requires manual review');
  if(suspicious(a.product)||suspicious(b.product))reasons.push('Instruction-like source text is quarantined');
  return reasons;
}
function exactPairs(vendor,psa){
  const key=r=>r.sku?JSON.stringify([r.customer_id,r.sku]):null;
  const vm=new Map(),pm=new Map();
  for(const [rows,map] of [[vendor,vm],[psa,pm]])for(const r of rows){const k=key(r);if(k)map.set(k,[...(map.get(k)||[]),r]);}
  return vendor.flatMap(v=>{const k=key(v),matches=pm.get(k)||[];return k&&vm.get(k).length===1&&matches.length===1?[{vendor_id:v.row_id,psa_id:matches[0].row_id,method:'exact customer + SKU'}]:[];});
}
export function createRun(vendorCSV,psaCSV,name='Monthly review'){
  const vendor=ingest(vendorCSV,'vendor'),psa=ingest(psaCSV,'psa');
  return {name,version:1,created_at:new Date().toISOString(),vendor,psa,sources:{vendor:{sha256:hash(vendorCSV),text:vendorCSV},psa:{sha256:hash(psaCSV),text:psaCSV}},mappings:exactPairs(vendor,psa),suggestions:[],decisions:{},traces:[]};
}
export function reconcile(run){
  const findings=[],used=new Set();
  for(const v of run.vendor){
    const m=run.mappings.find(x=>x.vendor_id===v.row_id),p=m&&run.psa.find(x=>x.row_id===m.psa_id);
    if(!p){findings.push({id:'vendor:'+v.row_id,vendor:v,psa:null,kind:'unmatched',title:'No approved PSA match',reasons:['Map this line or record why it should stay unmatched.'],amount_cents:null,currency:v.currency});continue;}
    used.add(p.row_id);
    const reasons=comparable(v,p),delta=v.quantity-p.quantity;
    const kind=reasons.length?'held':delta>0?'underbilled':delta<0?'overbilled':p.price_cents<v.price_cents?'margin':'aligned';
    findings.push({id:'vendor:'+v.row_id,vendor:v,psa:p,method:m.method,kind,title:({held:'Not safely comparable',underbilled:'Supplier quantity exceeds billed quantity',overbilled:'Billed quantity exceeds supplier quantity',aligned:'Quantities agree',margin:'Selling price below supplier unit cost'})[kind],reasons,delta,amount_cents:['underbilled','overbilled'].includes(kind)?Math.abs(delta)*p.price_cents:null,currency:v.currency});
  }
  for(const p of run.psa)if(!used.has(p.row_id))findings.push({id:'psa:'+p.row_id,vendor:null,psa:p,kind:'orphan',title:'PSA line has no supplier match',reasons:['May be a valid standalone service; do not remove automatically.'],amount_cents:null,currency:p.currency});
  for(const f of findings){f.fingerprint=hash({v:f.vendor?.source_hash,p:f.psa?.source_hash,kind:f.kind,method:f.method});const d=run.decisions[f.id];f.decision=d?.fingerprint===f.fingerprint?d:null;}
  const totals={};
  for(const f of findings)if(f.amount_cents!==null){totals[f.currency]??={underbilled:0,overbilled:0};totals[f.currency][f.kind]+=f.amount_cents;}
  return {findings,totals,open:findings.filter(f=>f.kind!=='aligned'&&!f.decision).length,held:findings.filter(f=>['held','unmatched','orphan'].includes(f.kind)).length};
}
export function approveMapping(run,vendorId,psaId,reason){
  const v=run.vendor.find(x=>x.row_id===vendorId),p=run.psa.find(x=>x.row_id===psaId);
  assert(v&&p,'Unknown source row.');
  assert(v.customer_id===p.customer_id,'Cross-customer mapping is prohibited.');
  assert(!suspicious(v.product)&&!suspicious(p.product),'Quarantined source text cannot be mapped.');
  assert(!run.mappings.some(x=>x.psa_id===psaId&&x.vendor_id!==vendorId),'PSA row already has a mapping.');
  assert(typeof reason==='string'&&reason.trim().length>=5&&reason.length<=500,'A review reason of 5–500 characters is required.');
  run.mappings=run.mappings.filter(x=>x.vendor_id!==vendorId);
  run.mappings.push({vendor_id:vendorId,psa_id:psaId,method:'human approved',reason:reason.trim()});
  // A mapping changes the interpretation of both sides: invalidate prior dispositions.
  run.decisions={};
  return run;
}
export function reviewFinding(run,id,disposition,note,actor){
  assert(['follow_up','accepted','excluded'].includes(disposition),'Invalid disposition.');
  assert(typeof note==='string'&&note.trim().length>=5&&note.length<=1000,'A review note of 5–1,000 characters is required.');
  const f=reconcile(run).findings.find(x=>x.id===id);assert(f&&f.kind!=='aligned','Finding does not need a review.');
  run.decisions[id]={disposition,note:note.trim(),actor,at:new Date().toISOString(),fingerprint:f.fingerprint};
}
export function packet(run,audit=[]){
  const result=reconcile(run);
  return {format:'seatproof-evidence-v1',generated_at:new Date().toISOString(),status:result.open?'DRAFT — unresolved review items':'REVIEWED — no external actions taken',notice:'Synthetic demo unless you imported your own records. Quantity exposure is not recovered revenue or authority to bill. Contracts, minimums and tax require separate review.',run,summary:result,audit};
}
export function csvCell(x){let s=String(x??'');if(/^[\s]*[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';}
export function findingsCSV(run){const {findings}=reconcile(run);return [['finding','kind','customer','supplier_row','psa_row','quantity_delta','indicative_amount','currency','disposition','note'],...findings.map(f=>[f.id,f.kind,(f.vendor||f.psa).customer,f.vendor?.row_id,f.psa?.row_id,f.delta,f.amount_cents===null?'':(f.amount_cents/100).toFixed(2),f.currency,f.decision?.disposition||'unreviewed',f.decision?.note||f.reasons.join('; ')])].map(r=>r.map(csvCell).join(',')).join('\r\n');}
