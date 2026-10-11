const V = "card-v6";
const SHELL = ["./", "./index.html"];
const LIB = ["cdn.jsdelivr.net", "unpkg.com"];

self.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(V);
    for (const url of SHELL) {
      try { await c.add(url); } catch (_) { /* одна битая ссылка не роняет install */ }
    }
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== V).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET") return;
  let u; try { u = new URL(r.url); } catch (_) { return; }

  if (LIB.includes(u.hostname)) {
    e.respondWith((async () => {
      const c = await caches.open(V);
      const hit = await c.match(r);
      const net = fetch(r).then((x) => { if (x && x.ok) c.put(r, x.clone()); return x; }).catch(() => hit);
      return hit || net;
    })());
    return;
  }

  if (r.mode === "navigate") {
    e.respondWith((async () => {
      try {
        const x = await fetch(r);
        const c = await caches.open(V);
        c.put("./index.html", x.clone()).catch(() => {});
        return x;
      } catch (_) {
        const c = await caches.open(V);
        return (await c.match("./index.html")) || (await c.match("./")) || Response.error();
      }
    })());
    return;
  }

  if (u.origin === self.location.origin) {
    e.respondWith((async () => {
      const c = await caches.open(V);
      const hit = await c.match(r);
      if (hit) return hit;
      try {
        const x = await fetch(r);
        if (x && x.ok) c.put(r, x.clone()).catch(() => {});
        return x;
      } catch (_) { return hit || Response.error(); }
    })());
  }
});
