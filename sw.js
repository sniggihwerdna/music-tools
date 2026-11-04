// Music Tools offline cache. Bump VERSION when you upload new files so phones pick them up.
const VERSION="music-tools-v1";
const FILES=["./","advanced-tempo-trainer.html","index.html","odd-meter-trainer.html","retrograde-trainer.html","rhythm-trainer.html","vocal-exercise-patterns.html","manifest.webmanifest","icon-180.png","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{ e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
// Show the saved copy right away (works offline), and refresh it in the background for next time.
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  e.respondWith(caches.open(VERSION).then(async c=>{
    const hit=await c.match(e.request,{ignoreSearch:true});
    const net=fetch(e.request).then(r=>{ if(r && (r.ok||r.type==="opaque")) c.put(e.request,r.clone()); return r; }).catch(()=>hit);
    return hit||net;
  }));
});
