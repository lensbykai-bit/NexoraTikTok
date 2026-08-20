function loadStyleOnce(href,id){
  if(document.getElementById(id))return;
  const link=document.createElement('link');
  link.id=id;
  link.rel='stylesheet';
  link.href=href;
  document.head.appendChild(link);
}

loadStyleOnce('nav-enhance.css','nexora-nav-enhance');

const temporarilyClosedPages=new Set([
  'courses.html',
  'tools.html',
  'resources.html',
  'success-stories.html'
]);

const currentPage=(location.pathname.split('/').pop()||'index.html').toLowerCase();
if(temporarilyClosedPages.has(currentPage)){
  location.replace(`temporarily-closed.html?page=${encodeURIComponent(currentPage)}`);
}

const publicNavItems=[
  ['index.html','Home'],
  ['pricing.html','Pricing'],
  ['about.html','About']
];

const navLinks=document.getElementById('navLinks');
const menuToggle=document.getElementById('menuToggle');
if(navLinks){
  navLinks.innerHTML=publicNavItems.map(([href,label])=>`<a${currentPage===href?' class="active"':''} href="${href}">${label}</a>`).join('');
}

const navActions=document.querySelector('.nav-actions');
if(navActions&&!document.body.classList.contains('login-body')){
  navActions.innerHTML='<a class="btn btn-ghost" href="login.html">Log In</a><a class="btn btn-primary" href="login.html?mode=signup">Sign Up</a>';
}

if(menuToggle&&navLinks){
  menuToggle.addEventListener('click',()=>navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('open')));
}

const togglePassword=document.getElementById('togglePassword');
const password=document.getElementById('password');
if(togglePassword&&password){
  togglePassword.addEventListener('click',()=>{
    const show=password.type==='password';
    password.type=show?'text':'password';
    togglePassword.textContent=show?'◌':'◉';
    togglePassword.setAttribute('aria-label',show?'Hide password':'Show password');
  });
}

function loadScriptOnce(src,id,onload){
  if(document.getElementById(id)){onload?.();return;}
  const s=document.createElement('script');
  s.id=id;
  s.src=src;
  s.onload=()=>onload?.();
  s.onerror=()=>console.warn(`Could not load ${src}`);
  document.head.appendChild(s);
}

if(!document.body.classList.contains('login-body')){
  const loadAuth=()=>loadScriptOnce('auth.js','nexora-auth-script');
  if(window.supabase)loadAuth();
  else loadScriptOnce('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2','nexora-supabase-sdk',loadAuth);
}
