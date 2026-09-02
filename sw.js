/* Bodhi Classes — service worker
   नियम: पन्ने (HTML) व सूची-फ़ाइलें हमेशा network-first (ताज़ा), नेटवर्क न हो तो cache से;
   assets (logo, watermark, fonts) stale-while-revalidate। खोले गए टेस्ट अपने-आप cache में —
   यानी एक बार खुला टेस्ट कमज़ोर नेटवर्क में भी दोबारा खुलेगा। */
var VERSION = "bodhi-v1";
var CORE = ["/", "/index.html", "/files.json", "/meta.json", "/404.html", "/manifest.webmanifest",
            "/assets/bodhi-logo.png", "/assets/bodhi-watermark.js", "/assets/icon-192.png"];

self.addEventListener("install", function(e){
  e.waitUntil(caches.open(VERSION).then(function(c){
    return Promise.all(CORE.map(function(u){ return c.add(u).catch(function(){}); }));
  }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== VERSION; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});

var OFFLINE_HTML = '<!DOCTYPE html><html lang="hi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ऑफ़लाइन — Bodhi Classes</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#F6F1E4;color:#20180A;font-family:system-ui,sans-serif;text-align:center;padding:24px}h1{font-weight:600;font-size:26px;margin:0 0 10px}p{color:#5A5343;margin:0 0 22px}a{display:inline-block;background:#9A7223;color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:700}</style></head><body><div><div style="font-size:44px">🪔</div><h1>अभी इंटरनेट नहीं है</h1><p>यह पन्ना पहले नहीं खोला गया था, इसलिए ऑफ़लाइन उपलब्ध नहीं। नेटवर्क आते ही दोबारा खोलें।</p><a href="/">मुखपृष्ठ</a></div></body></html>';

function isDoc(req){
  return req.mode === "navigate" || (req.headers.get("accept") || "").indexOf("text/html") !== -1;
}
self.addEventListener("fetch", function(e){
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  var same = url.origin === location.origin;
  var isFont = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!same && !isFont) return;

  var fresh = same && (isDoc(req) || /\/(files|meta)\.json$/.test(url.pathname) || url.pathname === "/sw.js");
  if (fresh) {
    e.respondWith(fetch(req).then(function(res){
      if (res && res.ok) { var copy = res.clone(); caches.open(VERSION).then(function(c){ c.put(req, copy); }); }
      return res;
    }).catch(function(){
      return caches.match(req, { ignoreSearch: true }).then(function(hit){
        if (hit) return hit;
        if (isDoc(req)) return new Response(OFFLINE_HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } });
        return Response.error();
      });
    }));
    return;
  }
  /* assets / fonts: stale-while-revalidate */
  e.respondWith(caches.match(req).then(function(hit){
    var net = fetch(req).then(function(res){
      if (res && (res.ok || res.type === "opaque")) { var copy = res.clone(); caches.open(VERSION).then(function(c){ c.put(req, copy); }); }
      return res;
    }).catch(function(){ return hit; });
    return hit || net;
  }));
});
