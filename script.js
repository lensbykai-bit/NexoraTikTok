function loadStyleOnce(href,id){
  if(document.getElementById(id))return;
  const link=document.createElement('link');
  link.id=id;
  link.rel='stylesheet';
  link.href=href;
  document.head.appendChild(link);
}

loadStyleOnce('nav-enhance.css','nexora-nav-enhance');

const publicNavItems=[
  ['index.html','Home'],
  ['courses.html','Courses'],
  ['tools.html','Tools'],
  ['resources.html','Resources'],
  ['success-stories.html','Success Stories'],
  ['pricing.html','Pricing'],
  ['about.html','About']
];

const navLinks=document.getElementById('navLinks');
const menuToggle=document.getElementById('menuToggle');
if(navLinks){
  const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  navLinks.innerHTML=publicNavItems.map(([href,label])=>`<a${current===href?' class="active"':''} href="${href}">${label}</a>`).join('');
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
