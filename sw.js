const CACHE_VERSION='nexora-v2.6.15';
const STATIC_CACHE=`${CACHE_VERSION}-static`;
const PAGE_CACHE=`${CACHE_VERSION}-pages`;

const PUBLIC_PAGES=[
  './',
  './index.html',
  './free-lessons.html',
  './courses.html',
  './curriculum.html',
  './support-program.html',
  './services.html',
  './prompt-book.html',
  './results.html',
  './faq.html',
  './contact.html',
  './legal.html',
  './verify-certificate.html',
  './offline.html'
];

const STATIC_ASSETS=[
  './styles.css',
  './extras.css',
  './home-v2.css',
  './course-library.css',
  './prompt-library.css',
  './certificate-verify.css',
  './app.js',
  './header-auth.js',
  './forms.js',
  './course-library.js',
  './prompt-library.js',
  './certificate-verify.js',
  './assets/logo.svg',
  './site.webmanifest'
];

const PRIVATE_PATHS=[
  '/admin',
  '/learn.html',
  '/certificate.html',
  '/enroll.html'
];

function isPrivatePath(pathname){
  return PRIVATE_PATHS.some(part=>pathname.includes(part));
}

function isStaticAsset(request){
  const dest=request.destination;
  return ['style','script','image','font'].includes(dest);
}

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const staticCache=await caches.open(STATIC_CACHE);
    const pageCache=await caches.open(PAGE_CACHE);
    await Promise.all([
      staticCache.addAll(STATIC_ASSETS),
      pageCache.addAll(PUBLIC_PAGES)
    ]);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keep=new Set([STATIC_CACHE,PAGE_CACHE]);
    const names=await caches.keys();
    await Promise.all(names.filter(name=>name.startsWith('nexora-')&&!keep.has(name)).map(name=>caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;

  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;

  if(request.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const response=await fetch(request);
        if(response.ok&&!isPrivatePath(url.pathname)){
          const cache=await caches.open(PAGE_CACHE);
          cache.put(request,response.clone());
        }
        return response;
      }catch{
        if(!isPrivatePath(url.pathname)){
          const cached=await caches.match(request,{ignoreSearch:true});
          if(cached)return cached;
        }
        return (await caches.match('./offline.html'))||Response.error();
      }
    })());
    return;
  }

  if(isPrivatePath(url.pathname))return;

  if(isStaticAsset(request)){
    event.respondWith((async()=>{
      const cached=await caches.match(request);
      const freshPromise=fetch(request).then(async response=>{
        if(response.ok){
          const cache=await caches.open(STATIC_CACHE);
          cache.put(request,response.clone());
        }
        return response;
      }).catch(()=>null);
      return cached||(await freshPromise)||Response.error();
    })());
  }
});
