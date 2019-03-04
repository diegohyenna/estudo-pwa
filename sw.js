importScripts('js/sw-util.js');

const STATIC_CACHE = 'static-v1.2';
const INMUTABLE_CACHE = 'inmutable-v1';
const DYNAMIC_CACHE = 'dynamic-v1.3';

const APP_SHELL = [
  // '/',
  'index.html',
  // 'css/style.css',
  'img/favicon.ico',
  'img/avatars/hulk.jpg',
  'img/avatars/ironman.jpg',
  'img/avatars/spiderman.jpg',
  'img/avatars/thor.jpg',
  'img/avatars/wolverine.jpg',
  'js/app.js',
  'js/sw-util.js'
];

const APP_SHELL_INMUTABLE = [
  'https://fonts.googleapis.com/css?family=Quicksand:300,400',
  'https://fonts.googleapis.com/css?family=Lato:400,300',
  'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
  'css/animate.css',
  'js/libs/jquery.js'
];

self.addEventListener('install', e => {

  const cacheStatic = caches.open(STATIC_CACHE)
    .then( cache => {
      cache.addAll(APP_SHELL);
    })

  const cacheInmutable = caches.open(INMUTABLE_CACHE)
    .then( cache => {
      cache.addAll(APP_SHELL_INMUTABLE);
    })

  e.waitUntil(Promise.all([
    cacheStatic,
    cacheInmutable
  ]));

});

self.addEventListener('activate', e => {

  const resposta = caches.keys().then( keys => {
    keys.forEach( key => {
      if(key !== STATIC_CACHE && key.includes('static')){
        caches.delete(key);
      }

      if(key !== DYNAMIC_CACHE && key.includes('dynamic')){
        caches.delete(key);
      }
    });
    return caches;
  });

  e.waitUntil( resposta );

});

self.addEventListener('fetch', e => {
  const resposta = caches.match(e.request)
    .then( res => {
      if(res){
        return res;
      }else{
        return fetch(e.request)
          .then( newRes => {
            return atualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);
          })
      }
    })

  e.respondWith( resposta );
});