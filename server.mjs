import http from 'node:http';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createStore} from './lib/store.mjs';
import {AppError,assert,createRun,reconcile,approveMapping,reviewFinding,packet,findingsCSV} from './lib/core.mjs';
import {suggest,retrieve} from './lib/matching.mjs';
const ROOT=path.dirname(fileURLToPath(import.meta.url));
const publicFiles={'/':'index.html','/app.js':'app.js','/style.css':'style.css','/research':'research.html','/research.js':'research.js','/research-data.json':'research-data.json'};
const cookies=req=>Object.fromEntries((req.headers.cookie||'').split(';').filter(x=>x.includes('=')).map(x=>{const i=x.indexOf('=');return [x.slice(0,i).trim(),x.slice(i+1).trim()];}));
async function body(req){assert(req.headers['content-type']?.split(';')[0]==='application/json','Content-Type must be application/json.',415);let data='',bytes=0;for await(const chunk of req){bytes+=chunk.length;assert(bytes<=1600000,'Request exceeds 1.6 MB.',413);data+=chunk;}try{return JSON.parse(data);}catch{throw new AppError('Malformed JSON.');}}
export function createApp({dbFile=path.join(ROOT,'data/seatproof.sqlite'),origin,aiOptions={}}={}){
  const store=createStore(dbFile),attempts=new Map(),inflight=new Set();
  function rate(key,max,windowMs){const now=Date.now();for(const [k,v]of attempts)if(v.until<now)attempts.delete(k);const a=attempts.get(key)||{count:0,until:now+windowMs};a.count++;attempts.set(key,a);assert(a.count<=max,'Rate limit reached. Try again later.',429);}
  const server=http.createServer(async(req,res)=>{
    const expected=origin||`http://127.0.0.1:${server.address().port}`;
    const send=(status,data,headers={})=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8',...headers});res.end(typeof data==='string'?data:JSON.stringify(data));};
    res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Cache-Control','no-store');res.setHeader('X-Frame-Options','DENY');
    res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
    res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
    try{
      assert(req.headers.host===new URL(expected).host,'Unrecognized host.',403);
      if(req.headers.origin)assert(req.headers.origin===expected,'Cross-origin request rejected.',403);
      const url=new URL(req.url,expected),route=url.pathname,method=req.method;
      if(method==='GET'&&route==='/health')return send(200,{ok:true,version:'0.1.0'});
      if(method==='GET'&&publicFiles[route]){const f=publicFiles[route];return send(200,readFileSync(path.join(ROOT,'public',f),'utf8'),{'Content-Type':f.endsWith('.html')?'text/html; charset=utf-8':f.endsWith('.js')?'text/javascript; charset=utf-8':f.endsWith('.css')?'text/css; charset=utf-8':'application/json; charset=utf-8'});}
      if(method==='GET'&&route==='/api/config')return send(200,{setup:store.needsSetup(),mode:(aiOptions.enabled??process.env.SEATPROOF_AI_ENABLED==='1')?'live-openai':'offline-lexical',external_ai_available:!!(aiOptions.key||process.env.SEATPROOF_API_KEY)});
      if(method==='GET'&&/^\/samples\/(vendor|psa)\.csv$/.test(route))return send(200,readFileSync(path.join(ROOT,route.slice(1)),'utf8'),{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="'+path.basename(route)+'"'});
      if(method==='POST'&&['/api/setup','/api/login'].includes(route)){
        rate('login:'+req.socket.remoteAddress,10,60000);const b=await body(req);
        const u=route==='/api/setup'?store.setup(b.name,b.email,b.password):store.login(b.email,b.password),s=store.session(u);
        return send(200,{ok:true},{'Set-Cookie':`seatproof=${s.token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${expected.startsWith('https:')?'; Secure':''}`});
      }
      const token=cookies(req).seatproof,u=store.authenticate(token);assert(u,'Sign in to continue.',401);
      if(method==='GET'&&route==='/api/session')return send(200,u);
      if(method!=='GET'){assert(req.headers['x-csrf-token']===u.csrf,'Invalid request token. Reload and try again.',403);if(route!=='/api/logout')assert(u.role!=='viewer','Viewer accounts cannot modify reviews.',403);}
      if(method==='POST'&&route==='/api/logout'){store.logout(token);return send(200,{ok:true},{'Set-Cookie':'seatproof=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'});}
      if(method==='POST'&&route==='/api/users'){assert(u.role==='owner','Only workspace owners can add users.',403);const b=await body(req);assert(['analyst','viewer'].includes(b.role),'Choose analyst or viewer.');const added=store.tx(()=>{const user=store.addUser(u.org_id,b.email,b.password,b.role);store.audit(u.org_id,null,u.id,'user_created',{user_id:user.id,role:user.role});return user;});return send(201,{id:added.id,role:added.role,email:added.email});}
      if(method==='GET'&&route==='/api/audit')return send(200,store.events(u.org_id));
      if(method==='GET'&&route==='/api/runs')return send(200,store.list(u.org_id));
      if(method==='POST'&&['/api/runs','/api/demo'].includes(route)){
        rate('import:'+u.id,30,3600000);const b=await body(req);
        const vendor=route==='/api/demo'?readFileSync(path.join(ROOT,'samples/vendor.csv'),'utf8'):b.vendor;
        const psa=route==='/api/demo'?readFileSync(path.join(ROOT,'samples/psa.csv'),'utf8'):b.psa;
        const name=route==='/api/demo'?'October 2026 · synthetic demo':b.name;
        assert(typeof name==='string'&&name.trim().length>=2&&name.length<=100,'Name your review (2–100 characters).');
        const created=store.create(u.org_id,u.id,createRun(vendor,psa,name.trim()));return send(created.reused?200:201,{...created.run,reused:created.reused,result:reconcile(created.run)});
      }
      const match=route.match(/^\/api\/runs\/([a-f0-9-]+)(?:\/(suggest|mapping|unmap|decision|export|csv))?$/);assert(match,'Route not found.',404);
      const [,id,action]=match;let run=store.get(u.org_id,id);
      if(method==='GET'&&!action)return send(200,{...run,result:reconcile(run),candidates:Object.fromEntries(run.vendor.filter(v=>!run.mappings.some(m=>m.vendor_id===v.row_id)).map(v=>[v.row_id,retrieve(run,v.row_id).map(x=>({id:x.row.row_id,product:x.row.product,score:x.score}))]))});
      if(method==='GET'&&action==='export')return send(200,packet(run,store.events(u.org_id)),{'Content-Disposition':'attachment; filename="seatproof-'+id+'.json"'});
      if(method==='GET'&&action==='csv')return send(200,findingsCSV(run),{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="seatproof-'+id+'.csv"'});
      assert(method==='POST'&&action,'Method not allowed.',405);const b=await body(req);assert(Number.isInteger(b.version),'Review version is required.');assert(b.version===run.version,'Review changed. Refresh before continuing.',409);
      if(action==='suggest'){
        rate('suggest:'+u.id,20,3600000);assert(!inflight.has(u.org_id+id),'A suggestion is already running.',409);inflight.add(u.org_id+id);
        try{const {result,trace}=await suggest(run,b.vendor_id,aiOptions);run=store.update(u.org_id,u.id,id,b.version,r=>{r.suggestions=r.suggestions.filter(s=>s.vendor_id!==b.vendor_id);r.suggestions.push(result);r.traces.push(trace);},'suggestion_created',{vendor_id:b.vendor_id,mode:trace.mode,input_hash:trace.input_hash});}
        catch(e){if(e.trace)store.update(u.org_id,u.id,id,b.version,r=>r.traces.push(e.trace),'suggestion_failed',{vendor_id:b.vendor_id,error:e.trace.error});throw e;}
        finally{inflight.delete(u.org_id+id);}
      }else if(action==='mapping')run=store.update(u.org_id,u.id,id,b.version,r=>approveMapping(r,b.vendor_id,b.psa_id,b.reason),'mapping_approved',{vendor_id:b.vendor_id,psa_id:b.psa_id});
      else if(action==='unmap')run=store.update(u.org_id,u.id,id,b.version,r=>{assert(r.mappings.some(m=>m.vendor_id===b.vendor_id),'Mapping not found.');r.mappings=r.mappings.filter(m=>m.vendor_id!==b.vendor_id);r.decisions={};},'mapping_removed',{vendor_id:b.vendor_id});
      else if(action==='decision')run=store.update(u.org_id,u.id,id,b.version,r=>reviewFinding(r,b.id,b.disposition,b.note,u.email),'finding_reviewed',{finding:b.id,disposition:b.disposition});
      else throw new AppError('Action not found.',404);
      return send(200,{...run,result:reconcile(run)});
    }catch(e){if(res.headersSent)return res.end();if(!(e instanceof AppError))console.error('Request failed:',e.name);return send(e.status||500,{error:e instanceof AppError?e.message:'Unexpected server error. Your last saved review is preserved.'});}
  });
  server.requestTimeout=30000;server.headersTimeout=10000;
  return {server,store};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const port=Number(process.env.PORT||4317),host=process.env.HOST||'127.0.0.1',origin=process.env.PUBLIC_ORIGIN||`http://127.0.0.1:${port}`;
  const {server,store}=createApp({dbFile:process.env.SEATPROOF_DB||path.join(ROOT,'data/seatproof.sqlite'),origin});
  server.listen(port,host,()=>console.log(`SeatProof Local: ${origin}\nMode: ${process.env.SEATPROOF_AI_ENABLED==='1'?'live OpenAI (requires explicit key)':'offline lexical adapter — no model inference'}\nCreate the first workspace at the local URL.`));
  const stop=()=>server.close(()=>{store.close();process.exit(0);});process.on('SIGINT',stop);process.on('SIGTERM',stop);
}
