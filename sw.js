// Diário da Carteira: funciona sem internet. Versão 202611021849
const CACHE="carteira-202611021849";
const BASE=["./","index.html","chart.umd.min.js","manifest.webmanifest","icon-192.png","icon-512.png","maskable-512.png","apple-180.png"];
self.addEventListener("install",e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(BASE)).then(()=>self.skipWaiting())); });
self.addEventListener("activate",e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET") return;
  const u=new URL(r.url);
  if(u.origin===location.origin){
    // a página: tenta a versão nova e, sem internet, usa a guardada
    if(r.mode==="navigate"){ e.respondWith(fetch(r).then(res=>{ const c=res.clone(); caches.open(CACHE).then(k=>k.put("index.html",c)); return res; }).catch(()=>caches.match("index.html"))); return; }
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{ const c=res.clone(); caches.open(CACHE).then(k=>k.put(r,c)); return res; })));
    return;
  }
  // fontes do Google: guarda para usar sem internet
  if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{ const c=res.clone(); caches.open(CACHE).then(k=>k.put(r,c)); return res; }).catch(()=>new Response("",{status:200,headers:{"Content-Type":"text/css"}}))));
  }
});
