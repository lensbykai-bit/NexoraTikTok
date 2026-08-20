const CACHE_VERSION='nexora-v2.6.2';
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

function isCodeAsset(request){
  return request.destination==='script'||request.destination==='style';
}

function isCacheableAsset(request){
  return ['script','style','image','font'].includes(request.destination);
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
    await Promise.all(
      names
        .filter(name=>name.startsWith('nexora-')&&!keep.has(name))
        .map(name=>caches.delete(name))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;

  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(isPrivatePath(url.pathname))return;

  if(request.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const response=await fetch(request,{cache:'no-store'});
        if(response.ok){
          const cache=await caches.open(PAGE_CACHE);
          cache.put(request,response.clone());
        }
        return response;
      }catch{
        return (await caches.match(request,{ignoreSearch:true}))||
               (await caches.match('./offline.html'))||
               Response.error();
      }
    })());
    return;
  }

  if(isCodeAsset(request)){
    event.respondWith((async()=>{
      try{
        const response=await fetch(request,{cache:'no-store'});
        if(response.ok){
          const cache=await caches.open(STATIC_CACHE);
          cache.put(request,response.clone());
        }
        return response;
      }catch{
        return (await caches.match(request))||Response.error();
      }
    })());
    return;
  }

  if(isCacheableAsset(request)){
    event.respondWith((async()=>{
      const cached=await caches.match(request);
      const fresh=fetch(request).then(async response=>{
        if(response.ok){
          const cache=await caches.open(STATIC_CACHE);
          cache.put(request,response.clone());
        }
        return response;
      }).catch(()=>null);
      return cached||(await fresh)||Response.error();
    })());
  }
});
