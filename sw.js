/* RAMQ Radar — service worker
   Cache versionné : incrémentez CACHE_NAME à chaque déploiement,
   sinon les navigateurs qui ont déjà installé l'app garderont l'ancienne version. */

const CACHE_NAME = "ramq-radar-v6";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./favicon.ico",
  "./icon-32.png",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-192.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png",
  "./og-image.png",
  "./vulnerabilite.json",
  "./actes_inclus.json",
];

self.addEventListener("install", (event) => {
  // cache.addAll() est tout-ou-rien : un seul fichier manquant fait échouer
  // l'installation entière et le mode hors ligne casse silencieusement.
  // On met donc chaque ressource en cache indépendamment.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(
        ASSETS.map((url) => cache.add(url).catch((err) => {
          console.warn("[sw] ressource ignorée :", url, err);
        }))
      ))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Les polices Google : cache-first, mise en cache opportuniste.
  if (url.origin.includes("fonts.googleapis.com") || url.origin.includes("fonts.gstatic.com")) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        return res;
      }).catch(() => hit))
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Navigation : réseau d'abord, repli sur le cache (permet le hors ligne).
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put("./index.html", copy));
          return res;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Ressources : cache d'abord.
  event.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res && res.status === 200 && res.type === "basic") {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(req, copy));
      }
      return res;
    }))
  );
});
