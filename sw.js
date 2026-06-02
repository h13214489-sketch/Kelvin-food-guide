// 鍏冩湕缇庨鍏ㄩ泦 - Service Worker v1.0
const CACHE = "yuenlongfood-v1";
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./yuen-long-food.html"
];

// 瀹夎锛氶爯鍏堝揩鍙栭棞閸佃硣婧?self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE_URLS))
  );
});

// 鍟熷嫊锛氭竻鐞嗚垔蹇彇
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
});

// 鏀旀埅璜嬫眰锛氬厛寰炵恫璺彇锛屽け鏁楀墖鐢ㄥ揩鍙?self.addEventListener("fetch", (e) => {
  // 鍙檿鐞嗗悓婧愯珛姹?  if (!e.request.url.startsWith(self.location.origin)) return;
  // 璺抽亷闈?GET 璜嬫眰
  if (e.request.method !== "GET") return;

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // 鎴愬姛鏅傛洿鏂板揩鍙?        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});