import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFileSync} from 'node:fs';
import {createApp} from '../server.mjs';
import {createRun} from '../lib/core.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
if(process.env.HOST&&process.env.HOST!=='127.0.0.1')throw new Error('The known-credential demo is restricted to loopback. Use the normal server for private accounts.');
const port=Number(process.env.PORT||4317),origin=`http://127.0.0.1:${port}`;
const {server,store}=createApp({dbFile:path.join(root,'data/demo.sqlite'),origin,aiOptions:{enabled:false}});
if(store.needsSetup()){
  const user=store.setup('Northstar IT · synthetic workspace','demo@example.test','SeatProof-demo-2026');
  store.create(user.org_id,user.id,createRun(readFileSync(path.join(root,'samples/vendor.csv'),'utf8'),readFileSync(path.join(root,'samples/psa.csv'),'utf8'),'October 2026 · synthetic demo'));
}
server.listen(port,'127.0.0.1',()=>console.log(`SeatProof demo: ${origin}\nSynthetic local-only credentials: demo@example.test / SeatProof-demo-2026\nOffline lexical adapter; no external model calls.`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>{store.close();process.exit(0);}));
