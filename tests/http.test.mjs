import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createApp} from '../server.mjs';
import {verifyAudit,createStore} from '../lib/store.mjs';

test('complete HTTP workflow: authentication, tenant isolation, CSRF, roles, persistence and export',async()=>{
  const dir=mkdtempSync(path.join(tmpdir(),'seatproof-test-')),file=path.join(dir,'test.sqlite');
  const {server,store}=createApp({dbFile:file});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base='http://127.0.0.1:'+server.address().port;let cookie='',csrf='';
  async function req(route,{method='GET',body,headers={},raw=false}={}){const res=await fetch(base+route,{method,headers:{Cookie:cookie,...(body!==undefined?{'Content-Type':'application/json','X-CSRF-Token':csrf}:{}),...headers},...(body!==undefined?{body:JSON.stringify(body)}:{})});const data=raw?await res.text():await res.json();return {res,data};}
  try{
    assert.equal((await req('/api/runs')).res.status,401);
    const setup=await req('/api/setup',{method:'POST',body:{name:'Demo Workspace',email:'owner@example.test',password:'safe-test-password-42'}});assert.equal(setup.res.status,200);cookie=setup.res.headers.get('set-cookie').split(';')[0];
    const session=(await req('/api/session')).data;csrf=session.csrf;assert.equal(session.role,'owner');
    assert.equal((await req('/api/setup',{method:'POST',body:{}})).res.status,409);
    assert.equal((await req('/api/demo',{method:'POST',body:{},headers:{'X-CSRF-Token':'wrong'}})).res.status,403);
    assert.equal((await req('/api/demo',{method:'POST',body:{},headers:{Origin:'https://evil.example'}})).res.status,403);
    assert.equal((await req('/api/demo',{method:'POST',body:{},headers:{'Content-Type':'text/plain'}})).res.status,415);
    const imported=await req('/api/demo',{method:'POST',body:{}});assert.equal(imported.res.status,201);let run=imported.data;
    assert.equal(run.result.totals.EUR.underbilled,7200);
    assert.equal((await req('/api/demo',{method:'POST',body:{}})).data.reused,true);
    const suggestion=await req(`/api/runs/${run.id}/suggest`,{method:'POST',body:{version:run.version,vendor_id:'V003'}});assert.equal(suggestion.res.status,200);run=suggestion.data;assert.equal(run.suggestions[0].mode,'offline-lexical');
    const mapped=await req(`/api/runs/${run.id}/mapping`,{method:'POST',body:{version:run.version,vendor_id:'V003',psa_id:'P003',reason:'Same edition checked in service catalogue'}});assert.equal(mapped.res.status,200);run=mapped.data;assert.equal(run.result.totals.EUR.underbilled,13600);
    assert.equal((await req(`/api/runs/${run.id}/decision`,{method:'POST',body:{version:1,id:'vendor:V001',disposition:'follow_up',note:'stale review'}})).res.status,409);
    const drafted=(await req(`/api/runs/${run.id}/export`)).data;assert.match(drafted.status,/DRAFT/);
    for(const f of run.result.findings.filter(x=>x.kind!=='aligned')){const result=await req(`/api/runs/${run.id}/decision`,{method:'POST',body:{version:run.version,id:f.id,disposition:'follow_up',note:'Synthetic test: verify contract before billing change.'}});assert.equal(result.res.status,200);run=result.data;}
    assert.equal(run.result.open,0);const final=(await req(`/api/runs/${run.id}/export`)).data;assert.match(final.status,/^REVIEWED/);assert.ok(final.run.sources.vendor.text);assert.equal(verifyAudit(final.audit),true);
    const tampered=structuredClone(final.audit);tampered[1].action='modified';assert.equal(verifyAudit(tampered),false);
    const csv=await req(`/api/runs/${run.id}/csv`,{raw:true});assert.equal(csv.res.status,200);assert.match(csv.data,/136|72\.00/);
    const ownerCookie=cookie,ownerCsrf=csrf;
    const account=await req('/api/users',{method:'POST',body:{email:'viewer@example.test',password:'viewer-password-42',role:'viewer'}});assert.equal(account.res.status,201);
    const login=await req('/api/login',{method:'POST',body:{email:'viewer@example.test',password:'viewer-password-42'}});cookie=login.res.headers.get('set-cookie').split(';')[0];csrf=(await req('/api/session')).data.csrf;
    assert.equal((await req(`/api/runs/${run.id}`)).res.status,200);assert.equal((await req('/api/demo',{method:'POST',body:{}})).res.status,403);assert.equal((await req('/api/users',{method:'POST',body:{}})).res.status,403);
    store.db.prepare('INSERT INTO orgs VALUES(?,?)').run('other-org','Other tenant');const other=store.addUser('other-org','other@example.test','other-password-42','owner');const os=store.session(other);cookie='seatproof='+os.token;csrf=os.csrf;
    for(const suffix of ['', '/export','/csv'])assert.equal((await req(`/api/runs/${run.id}${suffix}`)).res.status,404);
    assert.deepEqual((await req('/api/runs')).data,[]);assert.deepEqual((await req('/api/audit')).data,[]);
    assert.equal((await req(`/api/runs/${run.id}/unmap`,{method:'POST',body:{version:run.version,vendor_id:'V001'}})).res.status,404);
    cookie=ownerCookie;csrf=ownerCsrf;assert.equal((await req('/api/logout',{method:'POST',body:{}})).res.status,200);assert.equal((await req('/api/session')).res.status,401);
    const loginAgain=await req('/api/login',{method:'POST',body:{email:'owner@example.test',password:'safe-test-password-42'}});cookie=loginAgain.res.headers.get('set-cookie').split(';')[0];assert.equal((await req(`/api/runs/${run.id}`)).data.result.open,0);
    await new Promise(resolve=>server.close(resolve));store.close();
    const reopened=createStore(file);assert.equal(reopened.get(session.org_id,run.id).version,run.version);assert.equal(verifyAudit(reopened.events(session.org_id)),true);reopened.close();
  }finally{if(server.listening){await new Promise(resolve=>server.close(resolve));store.close();}if(dir.startsWith(path.join(tmpdir(),'seatproof-test-')))rmSync(dir,{recursive:true,force:true});}
});
