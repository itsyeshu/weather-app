const version = 'v1.0.0';

const staticCacheName = 'STATIC_' + version;

const assets = [
    '/public/img/favicon.png',
    '/public/img/globe/rotating_earth_globe.gif',
    '/public/img/day_image.jpg',
    '/public/img/night_image.jpg',
    'https://fonts.gstatic.com/s/opensans/v34/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-muw.woff2',
    'https://fonts.gstatic.com/s/righteous/v13/1cXxaUPXBpj2rGoU7C9WiHGF.woff2',
    // '/public/css/style.css',
    // '/public/js/preload_script.js',
    // '/public/js/script.js',
];

// Install service worker
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(staticCacheName).then(cache => {
            cache.addAll(assets);
        })
    );
});

// Activate event
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName)
                .map(key => caches.delete(key))
            )
        }).catch(err => console.log(err))
    );
});

// Fetch event
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(cacheRes => {
            return cacheRes || fetch(e.request)
        }).catch(() => caches.match("/gallery/myLittleVader.jpg"))
    );
});

