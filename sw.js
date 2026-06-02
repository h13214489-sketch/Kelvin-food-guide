// 元朗美食全集 - Service Worker v1.0
const CACHE = "yuenlongfood-v1";
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./yuen-long-food.html"
];

// 安裝：預先快取關鍵資源
self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE_URLS))
  );
});

// 啟動：清理舊快取
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
});

// 攔截請求：先從網路取，失敗則用快取
self.addEventListener("fetch", (e) => {
  // 只處理同源請求
  if (!e.request.url.startsWith(self.location.origin)) return;
  // 跳過非 GET 請求
  if (e.request.method !== "GET") return;

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // 成功時更新快取
        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});