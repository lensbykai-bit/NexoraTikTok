const CONFIG={
  supabaseUrl:'https://lzzujiyiltwfrvcwnrlh.supabase.co',
  supabaseKey:'sb_publishable_Ui-w7uI27X5dEybtGozMTA_kuFyfM2R'
};

const $=(s,r=document)=>r.querySelector(s);const $$=(s,r=document)=>[...r.querySelectorAll(s)];
function toast(message){let el=$('#toast');if(!el){el=document.createElement('div');el.id='toast';el.className='toast';document.body.appendChild(el)}el.textContent=message;el.classList.add('show');clearTimeout(window.__nexToast);window.__nexToast=setTimeout(()=>el.classList.remove('show'),2200)}

/* Shared site assets and production polish */
(function ensureSharedAssets(){
  const head=document.head;
  if(head&&!head.querySelector('link[rel="icon"]')){const l=document.createElement('link');l.rel='icon';l.href='assets/logo.svg';l.type='image/svg+xml';head.appendChild(l)}
  if(head&&!head.querySelector('link[rel="manifest"]')){const l=document.createElement('link');l.rel='manifest';l.href='site.webmanifest';head.appendChild(l)}
  if(head&&!head.querySelector('link[href="extras.css"]')){const l=document.createElement('link');l.rel='stylesheet';l.href='extras.css';head.appendChild(l)}
  document.querySelectorAll('.copyright').forEach(el=>{el.innerHTML=el.innerHTML.replace(/©\s*\d{4}/,`© ${new Date().getFullYear()}`)})
  $$('a[href="#"]').forEach(a=>{if(a.closest('.site-footer')){a.setAttribute('aria-disabled','true');a.classList.add('disabled-link');a.addEventListener('click',e=>e.preventDefault())}});
  if(!document.body.classList.contains('no-floating-support')&&!$('.floating-support')){const a=document.createElement('a');a.href='contact.html';a.className='floating-support';a.setAttribute('aria-label','Contact Nexora support');a.innerHTML='<span>?</span> Support';document.body.appendChild(a)}
})();

/* Offline-safe PWA runtime */
(function initPwa(){
  if('serviceWorker' in navigator&&location.protocol==='https:'){
    window.addEventListener('load',()=>{
      navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{});
    },{once:true});
  }
  let ready=false;
  window.addEventListener('load',()=>{ready=true},{once:true});
  window.addEventListener('offline',()=>{if(ready)toast('Offline mode · some public pages still work')});
  window.addEventListener('online',()=>{if(ready)toast('Back online ✓')});
})();

const menuToggle=$('#menuToggle'),navLinks=$('#navLinks');menuToggle?.setAttribute('aria-expanded','false');menuToggle?.addEventListener('click',()=>{const open=navLinks?.classList.toggle('open');menuToggle.setAttribute('aria-expanded',open?'true':'false')});$$('#navLinks a').forEach(a=>a.addEventListener('click',()=>{navLinks?.classList.remove('open');menuToggle?.setAttribute('aria-expanded','false')}));
const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();$$('#navLinks a').forEach(a=>{const href=(a.getAttribute('href')||'').toLowerCase();if(href===page)a.classList.add('active')});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&navLinks?.classList.contains('open')){navLinks.classList.remove('open');menuToggle?.setAttribute('aria-expanded','false')}});

if('IntersectionObserver'in window){const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('show')}),{threshold:.12});$$('.reveal').forEach(el=>obs.observe(el))}else{$$('.reveal').forEach(el=>el.classList.add('show'))}

/* Prompt Book */
const chips=$$('.filter-chip'),promptCards=$$('.prompt-card');chips.forEach(chip=>chip.addEventListener('click',()=>{chips.forEach(x=>x.classList.remove('active'));chip.classList.add('active');const f=chip.dataset.filter;promptCards.forEach(card=>card.style.display=(f==='all'||card.dataset.category===f)?'block':'none')}));
const promptModal=$('#promptModal'),modalTitle=$('#modalTitle'),modalCategory=$('#modalCategory'),modalPrompt=$('#modalPrompt');let activePrompt='';
if(promptModal&&modalPrompt){let copy=$('#copyPrompt');if(!copy){copy=document.createElement('button');copy.id='copyPrompt';copy.className='prompt-copy';copy.type='button';copy.textContent='Copy prompt';modalPrompt.insertAdjacentElement('afterend',copy)}copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(activePrompt);toast('Prompt copied ✓')}catch{toast('Copy was blocked by the browser')}})}
promptCards.forEach(card=>{card.setAttribute('tabindex','0');card.setAttribute('role','button');const open=()=>{if(!promptModal)return;activePrompt=card.dataset.prompt||'Prompt content will be added here.';if(modalTitle)modalTitle.textContent=card.dataset.title||'Prompt';if(modalCategory)modalCategory.textContent=(card.dataset.category||'PROMPT').replaceAll('-',' ').toUpperCase();if(modalPrompt)modalPrompt.textContent=activePrompt;promptModal.classList.add('open');document.body.style.overflow='hidden'};card.addEventListener('click',open);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}})});
function closePromptModal(){promptModal?.classList.remove('open');document.body.style.overflow=''}$('#closePromptModal')?.addEventListener('click',closePromptModal);promptModal?.addEventListener('click',e=>{if(e.target===promptModal)closePromptModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closePromptModal()});

/* Supabase Auth */
let sb=null;if(window.supabase){sb=window.supabase.createClient(CONFIG.supabaseUrl,CONFIG.supabaseKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}})}
let currentUserKey='guest';const authPage=$('#authPage'),portal=$('#portal'),portalName=$('#portalName'),portalEmail=$('#portalEmail');
function getProfile(user){const m=user?.user_metadata||{};return{name:m.full_name||m.name||user?.email?.split('@')[0]||'Student',email:user?.email||'',key:user?.id||user?.email||'guest'}}
function storageKey(name){return`nexora_${currentUserKey}_${name}`}
function showPortal(session){const user=session?.user;if(!authPage||!portal)return;if(user){const p=getProfile(user);currentUserKey=p.key;authPage.style.display='none';portal.classList.add('show');if(portalName)portalName.textContent=p.name;if(portalEmail)portalEmail.textContent=p.email;restorePortalState()}else{currentUserKey='guest';authPage.style.display='grid';portal.classList.remove('show')}}
async function initAuth(){if(!sb)return;const{data}=await sb.auth.getSession();showPortal(data.session);sb.auth.onAuthStateChange((_event,session)=>showPortal(session))}initAuth();
$('#emailLoginForm')?.addEventListener('submit',async e=>{e.preventDefault();if(!sb)return;const email=$('#loginEmail')?.value.trim(),password=$('#loginPassword')?.value||'',msg=$('#loginMessage');if(msg)msg.textContent='Signing in…';const{error}=await sb.auth.signInWithPassword({email,password});if(msg)msg.textContent=error?error.message:'Signed in successfully.'});
$('#emailSignupForm')?.addEventListener('submit',async e=>{e.preventDefault();if(!sb)return;const name=$('#signupName')?.value.trim(),email=$('#signupEmail')?.value.trim(),password=$('#signupPassword')?.value||'',msg=$('#signupMessage');if(msg)msg.textContent='Creating account…';const{error}=await sb.auth.signUp({email,password,options:{data:{full_name:name}}});if(msg)msg.textContent=error?error.message:''});
$('#logoutPortal')?.addEventListener('click',async()=>{if(sb)await sb.auth.signOut();location.href='learn.html'});
$('#showSignup')?.addEventListener('click',()=>{$('#loginBox')?.classList.add('hidden');$('#signupBox')?.classList.remove('hidden')});$('#showLogin')?.addEventListener('click',()=>{$('#signupBox')?.classList.add('hidden');$('#loginBox')?.classList.remove('hidden')});

/* Portal tabs */
const tabButtons=$$('.tab-btn'),tabPanels=$$('.tab-panel');tabButtons.forEach(btn=>btn.addEventListener('click',()=>{tabButtons.forEach(x=>x.classList.remove('active'));tabPanels.forEach(x=>x.classList.remove('active'));btn.classList.add('active');$('#'+btn.dataset.tab)?.classList.add('active')}));

/* Portal progress, tasks, notes and time */
let timerTick=null;
function getCompleted(){try{return JSON.parse(localStorage.getItem(storageKey('completed'))||'[]')}catch{return[]}}
function setCompleted(ids){localStorage.setItem(storageKey('completed'),JSON.stringify(ids))}
function allCourseItems(){return $$('#courseTab [data-item]')}
function updateProgress(){const completed=getCompleted(),items=allCourseItems(),total=items.length,done=items.filter(x=>completed.includes(x.dataset.item)).length,pct=total?Math.round(done/total*100):0;if($('#progressPercent'))$('#progressPercent').textContent=pct+'%';if($('#progressBar'))$('#progressBar').style.width=pct+'%';$$('[data-item]').forEach(row=>{const btn=$('[data-complete]',row);if(!btn)return;const yes=completed.includes(row.dataset.item);btn.disabled=yes;btn.textContent=yes?'Completed ✓':(row.closest('#tasksTab')?'Done':'Mark complete')})}
function markComplete(row){const id=row?.dataset.item;if(!id)return;const completed=getCompleted();if(!completed.includes(id)){completed.push(id);setCompleted(completed);updateProgress();toast('Progress saved ✓')}}
$$('[data-complete]').forEach(btn=>btn.addEventListener('click',()=>markComplete(btn.closest('[data-item]'))));
const noteArea=$('#noteArea');function restoreNote(){if(noteArea)noteArea.value=localStorage.getItem(storageKey('note'))||''}$('#saveNote')?.addEventListener('click',()=>{if(!noteArea)return;localStorage.setItem(storageKey('note'),noteArea.value);if($('#noteSaved'))$('#noteSaved').textContent='Saved ✓';toast('Note saved');setTimeout(()=>{if($('#noteSaved'))$('#noteSaved').textContent=''},1500)});
function dateKey(d=new Date()){return d.toISOString().slice(0,10)}
function dayDiff(a,b){const x=new Date(a+'T00:00:00Z'),y=new Date(b+'T00:00:00Z');return Math.round((y-x)/86400000)}
function loadTime(){let t={total:0,today:0,date:dateKey(),lastVisit:'',streak:1};try{t={...t,...JSON.parse(localStorage.getItem(storageKey('time'))||'{}')}}catch{}const today=dateKey();if(t.date!==today){t.today=0;t.date=today}if(t.lastVisit!==today){if(t.lastVisit){const diff=dayDiff(t.lastVisit,today);t.streak=diff===1?(Number(t.streak)||1)+1:1}else t.streak=1;t.lastVisit=today;saveTime(t)}return t}
function saveTime(t){localStorage.setItem(storageKey('time'),JSON.stringify(t))}
function renderTime(){const t=loadTime();if($('#totalTime'))$('#totalTime').textContent=Math.floor(t.total/60)+' m';if($('#todayTime'))$('#todayTime').textContent=Math.floor(t.today/60)+' m';if($('#dayStreak'))$('#dayStreak').textContent=t.streak||1}
function startTimer(){clearInterval(timerTick);timerTick=setInterval(()=>{if(!portal?.classList.contains('show'))return;const t=loadTime();t.total+=15;t.today+=15;saveTime(t);renderTime()},15000)}
function restorePortalState(){restoreNote();updateProgress();renderTime();startTimer()}
