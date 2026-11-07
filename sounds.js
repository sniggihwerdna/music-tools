// Music Tools shared sounds: recorded piano (Salamander Grand, CC-BY 3.0) and an acoustic drum kit.
// Usage: await MTS.start(); MTS.piano(midi, time, dur, vel, dest); MTS.drum("kick", time, vel, dest)
(function(){
const PIANO=["A1","C2","Ds2","Fs2","A2","C3","Ds3","Fs3","A3","C4","Ds4","Fs4","A4","C5","Ds5","Fs5","A5","C6"];
const NAME2MIDI=n=>{ const m=n.match(/^([A-G])(s?)(\d)$/); return {C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]]+(m[2]?1:0)+12*(+m[3]+1); };
const DRUMS=["kick","snare","hihat"];
const base=(()=>{ const s=document.currentScript&&document.currentScript.src; return s?s.replace(/[^/]*$/,""):""; })();
const MTS={ctx:null,out:null,piano:null,drum:null,ready:false,buf:{piano:[],drums:{}},silentEl:null,wake:null};
function silentWavURL(){
  const sr=8000,n=4000,b=new ArrayBuffer(44+n*2),v=new DataView(b),w=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i));};
  w(0,"RIFF");v.setUint32(4,36+n*2,true);w(8,"WAVE");w(12,"fmt ");v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);
  v.setUint32(24,sr,true);v.setUint32(28,sr*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);w(36,"data");v.setUint32(40,n*2,true);
  return URL.createObjectURL(new Blob([b],{type:"audio/wav"}));
}
async function decode(url){ const r=await fetch(url); const a=await r.arrayBuffer();
  return await new Promise((res,rej)=>{ const p=MTS.ctx.decodeAudioData(a,res,rej); if(p&&p.then) p.then(res,rej); }); }
let loading=null;
function load(){ if(loading) return loading;
  loading=Promise.all([
    ...PIANO.map(async n=>{ try{ MTS.buf.piano.push({midi:NAME2MIDI(n),b:await decode(base+"sounds/piano/"+n+".mp3")}); }catch(e){} }),
    ...DRUMS.map(async d=>{ try{ MTS.buf.drums[d]=await decode(base+"sounds/drums/"+d+".mp3"); }catch(e){} })
  ]).then(()=>{ MTS.buf.piano.sort((a,b)=>a.midi-b.midi); MTS.ready=MTS.buf.piano.length>0; });
  return loading; }
// Call from a tap. Sets up iOS audio (plays through the silent switch) and loads the samples.
MTS.start=async function(){
  try{ if(navigator.audioSession) navigator.audioSession.type="playback"; }catch(e){}
  try{ if(!MTS.silentEl){ MTS.silentEl=new Audio(silentWavURL()); MTS.silentEl.loop=true; } await MTS.silentEl.play(); }catch(e){}
  if(!MTS.ctx){ MTS.ctx=new (window.AudioContext||window.webkitAudioContext)();
    const c=MTS.ctx.createDynamicsCompressor(); c.threshold.value=-10; c.ratio.value=3; c.connect(MTS.ctx.destination); MTS.out=c; }
  if(MTS.ctx.state!=="running") await MTS.ctx.resume();
  await load(); return MTS.ctx;
};
// One piano note. dur = how long the key is held; vel 0..1.
MTS.piano=function(midi,t,dur,vel,dest){ const ctx=MTS.ctx; if(!ctx||!MTS.buf.piano.length) return null;
  let best=MTS.buf.piano[0]; for(const s of MTS.buf.piano) if(Math.abs(s.midi-midi)<Math.abs(best.midi-midi)) best=s;
  const src=ctx.createBufferSource(); src.buffer=best.b; src.playbackRate.value=Math.pow(2,(midi-best.midi)/12);
  const g=ctx.createGain(), v=Math.max(0.02,vel==null?0.7:vel);
  // softer notes sound darker
  const lp=ctx.createBiquadFilter(); lp.type="lowpass"; lp.frequency.value=1800+9000*v;
  const rel=0.25, len=Math.min(dur, best.b.duration/src.playbackRate.value-rel);
  g.gain.setValueAtTime(v*v*0.9+0.1*v,t); g.gain.setValueAtTime(v*v*0.9+0.1*v,t+Math.max(0.02,len)); g.gain.exponentialRampToValueAtTime(0.0005,t+Math.max(0.02,len)+rel);
  src.connect(lp); lp.connect(g); g.connect(dest||MTS.out); src.start(t); src.stop(t+Math.max(0.02,len)+rel+0.05); return src; };
MTS.chord=function(midis,t,dur,vel,dest){ const out=[]; midis.forEach((m,i)=>{ const n=MTS.piano(m,t+i*0.008,dur,vel*(0.9+Math.random()*0.1),dest); if(n) out.push(n); }); return out; };
MTS.drum=function(name,t,vel,dest){ const ctx=MTS.ctx, b=MTS.buf.drums[name]; if(!ctx||!b) return null;
  const src=ctx.createBufferSource(); src.buffer=b; const g=ctx.createGain(); g.gain.value=(vel==null?0.8:vel);
  src.connect(g); g.connect(dest||MTS.out); src.start(t); return src; };
MTS.keepAwake=async function(on){ try{
  if(on && "wakeLock" in navigator && !MTS.wake){ MTS.wake=await navigator.wakeLock.request("screen"); MTS.wake.addEventListener("release",()=>{ MTS.wake=null; }); }
  else if(!on && MTS.wake){ await MTS.wake.release(); MTS.wake=null; } }catch(e){} };
document.addEventListener("visibilitychange",()=>{ if(!document.hidden && MTS.wantAwake) MTS.keepAwake(true); });
window.MTS=MTS;
})();
