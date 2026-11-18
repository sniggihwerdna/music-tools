// Music Tools offline cache. Bump VERSION when you upload new files so phones pick them up.
const VERSION="music-tools-v21";
const FILES=["./","time-trainers/advanced-tempo-trainer.html","index.html","vocal-exercises/audio-mirror.html","sound-organization/inversion-trainer.html","odd-meters/odd-meter-trainer.html","sound-organization/retrograde-trainer.html","time-trainers/rhythm-trainer.html","vocal-exercises/vocal-exercise-patterns.html","vocal-exercises/wide-interval-trainer.html","odd-meters/five-four-groove.html","odd-meters/odd-grooves.html","time-trainers/tempo-drift.html","odd-meters/over-the-bar-line.html","odd-meters/irrational-meters.html","sound-organization/chord-player.html","vocal-exercises/microtonal-ear-trainer.html","sounds.js","sounds/piano/A1.mp3","sounds/piano/A2.mp3","sounds/piano/A3.mp3","sounds/piano/A4.mp3","sounds/piano/A5.mp3","sounds/piano/C2.mp3","sounds/piano/C3.mp3","sounds/piano/C4.mp3","sounds/piano/C5.mp3","sounds/piano/C6.mp3","sounds/piano/Ds2.mp3","sounds/piano/Ds3.mp3","sounds/piano/Ds4.mp3","sounds/piano/Ds5.mp3","sounds/piano/Fs2.mp3","sounds/piano/Fs3.mp3","sounds/piano/Fs4.mp3","sounds/piano/Fs5.mp3","sounds/drums/hihat.mp3","sounds/drums/kick.mp3","sounds/drums/snare.mp3","manifest.webmanifest","icon-180.png","icon-192.png","icon-512.png","odd-meter-trainer.html","irrational-meters.html","five-four-groove.html","odd-grooves.html","over-the-bar-line.html","vocal-exercise-patterns.html","wide-interval-trainer.html","audio-mirror.html","microtonal-ear-trainer.html","retrograde-trainer.html","inversion-trainer.html","chord-player.html","sound-organization/call-and-response-improv.html","Call & Response Improv.html","rhythm-trainer.html","advanced-tempo-trainer.html","tempo-drift.html","time-trainers/off-grid-rhythm-trainer.html","Off-Grid Rhythm Trainer.html"];
self.addEventListener("install",e=>{ e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
// Pages: get the newest copy when online (so updates show right away); fall back to the saved copy offline.
// Icons and other files: saved copy first, refreshed in the background.
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;
  const isPage = e.request.mode==="navigate" || e.request.destination==="document";
  e.respondWith(caches.open(VERSION).then(async c=>{
    if(isPage){
      try{ const r=await fetch(e.request,{cache:"no-store"}); if(r && r.ok) c.put(e.request,r.clone()); return r; }
      catch(err){ return (await c.match(e.request,{ignoreSearch:true})) || (await c.match("./")) || Response.error(); }
    }
    const hit=await c.match(e.request,{ignoreSearch:true});
    const net=fetch(e.request).then(r=>{ if(r && (r.ok||r.type==="opaque")) c.put(e.request,r.clone()); return r; }).catch(()=>hit);
    return hit||net;
  }));
});
