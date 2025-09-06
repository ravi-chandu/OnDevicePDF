const CACHE='ondevicepdf-v6';
const ASSETS=['/','/index.html','/manifest.json','/icon-192.png','/icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(url.hostname.includes('googletagmanager.com')||url.hostname.includes('google-analytics.com'))return;
  if(e.request.method!=='GET')return;
  if(e.request.mode==='navigate'&&url.origin===location.origin){
    e.respondWith(fetch(e.request).catch(()=>caches.match('/index.html')));return;
  }
  if(url.origin===location.origin){
    e.respondWith(caches.match(e.request).then(hit=>fetch(e.request).then(res=>{
      if(res&&res.ok&&res.type!=='opaque')caches.open(CACHE).then(c=>c.put(e.request,res.clone()));
      return res;
    }).catch(()=>hit)));
  }
});
