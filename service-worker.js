// Mude esta versão a cada deploy para forçar atualização automática
const CACHE_NAME = 'reset-emocional-v2';
const ASSETS = [
  '/projeto_reset/',
  '/projeto_reset/index.html',
  '/projeto_reset/manifest.json',
  '/projeto_reset/icon-192.png',
  '/projeto_reset/icon-512.png'
];

// INSTALL — baixa todos os assets na nova versão
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  // Ativa imediatamente sem esperar o app fechar
  self.skipWaiting();
});

// ACTIVATE — apaga caches antigos e assume controle imediato
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim()) // assume controle de todas as abas abertas
  );
});

// FETCH — rede primeiro, cache como fallback
// Isso garante que sempre tenta buscar a versão mais recente
self.addEventListener('fetch', event => {
  // Só intercepta GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Salva cópia fresca no cache
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Sem rede — usa cache
        return caches.match(event.request)
          .then(cached => cached || caches.match('/projeto_reset/'));
      })
  );
});

// Avisa o app quando uma nova versão foi ativada
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});
