import {DatabaseSync} from 'node:sqlite';
import {randomBytes,randomUUID,scryptSync,timingSafeEqual} from 'node:crypto';
import {mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {hash,assert} from './core.mjs';
const passwordHash=(password,salt)=>scryptSync(password,salt,64).toString('hex');
export function validPassword(p){assert(typeof p==='string'&&p.length>=12&&p.length<=128,'Use a password of 12–128 characters.');}
export function createStore(file){
  if(file!==':memory:')mkdirSync(dirname(file),{recursive:true});
  const db=new DatabaseSync(file);db.exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;');
  db.exec(`CREATE TABLE IF NOT EXISTS orgs(id TEXT PRIMARY KEY,name TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,org_id TEXT REFERENCES orgs(id),email TEXT UNIQUE NOT NULL,salt TEXT NOT NULL,password TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('owner','analyst','viewer')));
    CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id),csrf TEXT NOT NULL,expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS runs(id TEXT PRIMARY KEY,org_id TEXT REFERENCES orgs(id),version INTEGER NOT NULL,source_key TEXT NOT NULL,data TEXT NOT NULL,UNIQUE(org_id,source_key));
    CREATE TABLE IF NOT EXISTS audit(seq INTEGER PRIMARY KEY AUTOINCREMENT,org_id TEXT REFERENCES orgs(id),run_id TEXT,actor TEXT NOT NULL,action TEXT NOT NULL,at TEXT NOT NULL,details TEXT NOT NULL,previous_hash TEXT NOT NULL,event_hash TEXT NOT NULL);`);
  const tx=fn=>{db.exec('BEGIN IMMEDIATE');try{const r=fn();db.exec('COMMIT');return r;}catch(e){db.exec('ROLLBACK');throw e;}};
  function audit(org,run,actor,action,details={}){
    const previous=db.prepare('SELECT event_hash FROM audit WHERE org_id=? ORDER BY seq DESC LIMIT 1').get(org)?.event_hash||'GENESIS';
    const at=new Date().toISOString(),serialized=JSON.stringify(details),eventHash=hash({org,run,actor,action,at,details:serialized,previous});
    db.prepare('INSERT INTO audit(org_id,run_id,actor,action,at,details,previous_hash,event_hash) VALUES(?,?,?,?,?,?,?,?)').run(org,run,actor,action,at,serialized,previous,eventHash);
  }
  function addUser(org,email,password,role='analyst'){
    assert(typeof email==='string'&&/^[^\s@]{1,80}@[^\s@]{1,100}\.[^\s@]{2,30}$/.test(email),'Enter a valid email address.');validPassword(password);
    assert(['owner','analyst','viewer'].includes(role),'Unknown role.');
    const normalized=email.toLowerCase();assert(!db.prepare('SELECT id FROM users WHERE email=?').get(normalized),'An account with that email already exists.',409);
    const id=randomUUID(),salt=randomBytes(16).toString('hex');db.prepare('INSERT INTO users VALUES(?,?,?,?,?,?)').run(id,org,normalized,salt,passwordHash(password,salt),role);return {id,org_id:org,email:normalized,role};
  }
  return {db,tx,audit,addUser,
    needsSetup:()=>!db.prepare('SELECT id FROM users LIMIT 1').get(),
    setup(name,email,password){return tx(()=>{assert(!db.prepare('SELECT id FROM users LIMIT 1').get(),'Workspace already initialized.',409);assert(typeof name==='string'&&name.trim().length>=2&&name.length<=100,'Workspace name must have 2–100 characters.');const org=randomUUID();db.prepare('INSERT INTO orgs VALUES(?,?)').run(org,name.trim());const u=addUser(org,email,password,'owner');audit(org,null,u.id,'workspace_created');return u;});},
    login(email,password){assert(typeof email==='string'&&typeof password==='string'&&password.length<=128,'Invalid credentials.',401);const u=db.prepare('SELECT * FROM users WHERE email=?').get(email.toLowerCase());const salt=u?.salt||'00000000000000000000000000000000';const derived=passwordHash(password,salt);assert(u&&timingSafeEqual(Buffer.from(derived,'hex'),Buffer.from(u.password,'hex')),'Invalid credentials.',401);return u;},
    session(user){const token=randomBytes(32).toString('hex'),csrf=randomBytes(24).toString('hex'),expires=Date.now()+8*3600000;db.prepare('DELETE FROM sessions WHERE expires<?').run(Date.now());db.prepare('INSERT INTO sessions VALUES(?,?,?,?)').run(hash(token),user.id,csrf,expires);return {token,csrf,expires};},
    authenticate(token){if(!token)return null;return db.prepare('SELECT u.id,u.org_id,u.email,u.role,o.name AS workspace,s.csrf FROM sessions s JOIN users u ON u.id=s.user_id JOIN orgs o ON o.id=u.org_id WHERE s.token=? AND s.expires>?').get(hash(token),Date.now())||null;},
    logout(token){db.prepare('DELETE FROM sessions WHERE token=?').run(hash(token||''));},
    list(org){return db.prepare('SELECT id,version,data FROM runs WHERE org_id=? ORDER BY rowid DESC').all(org).map(r=>{const d=JSON.parse(r.data);return {id:r.id,version:r.version,name:d.name,created_at:d.created_at,vendor_count:d.vendor.length,psa_count:d.psa.length};});},
    get(org,id){const r=db.prepare('SELECT data FROM runs WHERE org_id=? AND id=?').get(org,id);assert(r,'Review not found.',404);return JSON.parse(r.data);},
    create(org,actor,data){return tx(()=>{const key=hash([data.sources.vendor.sha256,data.sources.psa.sha256]);const exists=db.prepare('SELECT data FROM runs WHERE org_id=? AND source_key=?').get(org,key);if(exists)return {run:JSON.parse(exists.data),reused:true};const run={...data,id:randomUUID()};db.prepare('INSERT INTO runs VALUES(?,?,?,?,?)').run(run.id,org,run.version,key,JSON.stringify(run));audit(org,run.id,actor,'imported',{vendor_hash:run.sources.vendor.sha256,psa_hash:run.sources.psa.sha256});return {run,reused:false};});},
    update(org,actor,id,version,mutate,action,details={}){return tx(()=>{const current=this.get(org,id);assert(current.version===version,'This review changed in another tab. Refresh before applying your decision.',409);mutate(current);current.version++;const result=db.prepare('UPDATE runs SET data=?,version=? WHERE org_id=? AND id=? AND version=?').run(JSON.stringify(current),current.version,org,id,version);assert(result.changes===1,'Concurrent modification; reload.',409);audit(org,id,actor,action,{...details,version:current.version});return current;});},
    events(org){return db.prepare('SELECT * FROM audit WHERE org_id=? ORDER BY seq').all(org);},
    close(){db.close();}
  };
}
export function verifyAudit(events){let previous='GENESIS';for(const e of events){if(e.previous_hash!==previous||e.event_hash!==hash({org:e.org_id,run:e.run_id,actor:e.actor,action:e.action,at:e.at,details:e.details,previous}))return false;previous=e.event_hash;}return true;}
