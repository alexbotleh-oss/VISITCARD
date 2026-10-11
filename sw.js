const V="card-v4", SHELL=["./","./index.html"], LIB=["cdn.jsdelivr.net","unpkg.com"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET")return;
  let u; try{u=new URL(r.url);}catch(_){return;}
  if(LIB.includes(u.hostname)){ e.respondWith(caches.open(V).then(async c=>{const h=await c.match(r);const n=fetch(r).then(x=>{if(x&&x.ok)c.put(r,x.clone());return x;}).catch(()=>h);return h||n;})); return; }
  if(r.mode==="navigate"){ e.respondWith(fetch(r).then(x=>{const cp=x.clone();caches.open(V).then(c=>c.put("./index.html",cp)).catch(()=>{});return x;}).catch(()=>caches.match("./index.html").then(x=>x||caches.match("./")))); return; }
  if(u.origin===self.location.origin){ e.respondWith(caches.match(r).then(h=>h||fetch(r).then(x=>{if(x&&x.ok){const cp=x.clone();caches.open(V).then(c=>c.put(r,cp)).catch(()=>{});}return x;}).catch(()=>h))); }
});
