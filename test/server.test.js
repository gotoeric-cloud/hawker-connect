import test from 'node:test';
import assert from 'node:assert/strict';
import {server} from '../server.mjs';
test('HTTP server serves the app and modules with security headers',async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{
  const origin=`http://127.0.0.1:${server.address().port}`;
  const home=await fetch(origin);assert.equal(home.status,200);assert.match(await home.text(),/Hawker Connect/);assert.ok(home.headers.get('content-security-policy'));
  const module=await fetch(origin+'/app.js');assert.equal(module.status,200);assert.match(module.headers.get('content-type'),/javascript/);
  const health=await fetch(origin+'/health');assert.deepEqual(await health.json(),{status:'ok',mode:'demo'});
  assert.equal((await fetch(origin+'/missing-file')).status,404);
  assert.equal((await fetch(origin+'/%2e%2e%2fpackage.json')).status,403);
 }finally{await new Promise(resolve=>server.close(resolve))}
});
