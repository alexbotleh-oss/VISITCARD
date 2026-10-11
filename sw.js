const V="card-v6";
const SHELL=["./","./index.html"];
const LIB=["cdn.jsdelivr.net","unpkg.com","fastly.jsdelivr.net","cdnjs.cloudflare.com"];
const PREFETCH=["https://fastly.jsdelivr.net/npm/bwip-js@4.5.1/dist/bwipjs-lite.min.js","https://cdn.jsdelivr.net/npm/bwip-js@4.5.1/dist/bwipjs-lite.min.js","https://unpkg.com/bwip-js@4.5.1/dist/bwipjs-lite.min.js","https://fastly.jsdelivr.net/npm/@zxing/library@0.18.4/umd/index.min.js"];
self.addEventListener("install",e=>{e.waitUntil((async()=>{const c=await caches.open(V);for(const u of SHELL){try{await c.add(u);}catch(_){}}for(const u of PREFETCH){try{await c.add(u);}catch(_){}}await self.skipWaiting();})());});
self.addEventListener("activate",e=>{e.waitUntil((async()=>{const k=await caches.keys();await Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)));await self.clients.claim();})());});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;let u;try{u=new URL(r.url);}catch(_){return;}
if(LIB.includes(u.hostname)){e.respondWith((async()=>{const c=await caches.open(V);const hit=await c.match(r);try{const net=await fetch(r);if(net&&net.ok)c.put(r,net.clone()).catch(()=>{});return net;}catch(_){return hit||Response.error();}})());return;}
if(r.mode==="navigate"){e.respondWith((async()=>{try{const x=await fetch(r);const c=await caches.open(V);c.put("./index.html",x.clone()).catch(()=>{});return x;}catch(_){const c=await caches.open(V);return(await c.match("./index.html"))||(await c.match("./"))||Response.error();}})());return;}
if(u.origin===self.location.origin){e.respondWith((async()=>{const c=await caches.open(V);const hit=await c.match(r);if(hit)return hit;try{const x=await fetch(r);if(x&&x.ok)c.put(r,x.clone()).catch(()=>{});return x;}catch(_){return hit||Response.error();}})());}});