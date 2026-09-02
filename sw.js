/* Bodhi Classes — यह service worker अब बंद है।
   जिन ब्राउज़रों में पुराना version रजिस्टर हो चुका है, वे यही फ़ाइल उठाएँगे:
   यह अपना सारा cache मिटाकर स्वयं को हटा देता है और पन्ने reload करा देता है,
   ताकि साइट सीधे नेटवर्क से (पहले जैसी तेज़) चले। */
self.addEventListener("install", function(){ self.skipWaiting(); });
self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys()
      .then(function(keys){ return Promise.all(keys.map(function(k){ return caches.delete(k); })); })
      .then(function(){ return self.registration.unregister(); })
      .then(function(){ return self.clients.matchAll({ type: "window" }); })
      .then(function(cs){ cs.forEach(function(c){ try { c.navigate(c.url); } catch(e){} }); })
      .catch(function(){})
  );
});
/* कोई request पकड़ो मत — सब सीधे नेटवर्क से */
