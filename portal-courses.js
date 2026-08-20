const PORTAL_COURSES={url:'https://bcvtkdehflmqiyvloyiy.supabase.co/functions/v1/course-content',apikey:'sb_publishable_KgISTJ7-YKktjQXw3u0yuQ_KG6H1bFa'};
let portalCourseData={courses:[],lessons:[],totals:{},access:'starter'};
function pcEsc(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function ensureAccessRefresh(){const badge=document.getElementById('portalAccessBadge');if(!badge||document.getElementById('portalAccessRefresh'))return;const btn=document.createElement('button');btn.id='portalAccessRefresh';btn.type='button';btn.className='pill outline portal-access-refresh';btn.textContent='Refresh access';btn.addEventListener('click',async()=>{btn.disabled=true;btn.textContent='Checking…';await loadPortalCourses();btn.disabled=false;btn.textContent='Refresh access'});badge.insertAdjacentElement('afterend',btn)}
async function loadPortalCourses(){
  const root=document.getElementById('portalCourseList');
  const status=document.getElementById('portalCourseStatus');
  if(!root||typeof sb==='undefined'||!sb)return;
  ensureAccessRefresh();
  try{
    if(status)status.textContent='Loading your lessons…';
    const {data:{session}}=await sb.auth.getSession();
    if(!session?.access_token){if(status)status.textContent='Sign in to load lessons.';return}
    const res=await fetch(PORTAL_COURSES.url,{method:'POST',headers:{'Content-Type':'application/json',apikey:PORTAL_COURSES.apikey,Authorization:`Bearer ${session.access_token}`},body:'{}'});
    if(!res.ok)throw new Error(`Course access failed (${res.status})`);
    portalCourseData=await res.json();
    renderPortalCourses();
  }catch(err){console.error(err);if(status)status.textContent='Could not load lessons right now.';root.innerHTML='<div class="course-live-empty">Please refresh the page or try again shortly.</div>'}
}
function renderPortalCourses(){
  const {courses=[],lessons=[],totals={},access='starter'}=portalCourseData;
  const root=document.getElementById('portalCourseList'),status=document.getElementById('portalCourseStatus'),badge=document.getElementById('portalAccessBadge');
  if(!root)return;
  ensureAccessRefresh();
  if(badge){badge.textContent=access==='full'?'Full course access':'Starter access';badge.className=`portal-access-badge ${access==='full'?'full':''}`}
  const grouped=lessons.reduce((m,l)=>{(m[l.course_id]||(m[l.course_id]=[])).push(l);return m},{});
  root.innerHTML=courses.map(c=>{
    const list=grouped[c.id]||[],total=Number(totals[c.id]||list.length),locked=Math.max(0,total-list.length);
    return `<section class="portal-course-group"><div class="portal-course-summary"><div><small>${pcEsc(c.track)}</small><h3>${pcEsc(c.title)}</h3><p>${pcEsc(c.description)}</p></div><span class="portal-chip">${list.length}/${total} available</span></div><div>${list.map(l=>`<div class="portal-lesson-row" data-item="lesson:${pcEsc(l.slug)}"><div><h4>${pcEsc(l.title)}</h4><p>${pcEsc(l.summary)} · ${pcEsc(l.duration_minutes)} min${l.is_preview?' · Preview':''}</p></div><div class="portal-lesson-actions"><button class="pill outline" type="button" data-open-lesson="${l.id}">Open</button><button class="pill outline" type="button" data-complete>Mark complete</button></div></div>`).join('')}</div>${locked?`<div class="lesson-lock-note">${locked} lesson${locked===1?'':'s'} in this track require full course access. Approved enrollments unlock automatically; you can also press Refresh access after approval.</div>`:''}</section>`;
  }).join('')||'<div class="course-live-empty">No active courses are available yet.</div>';
  if(status)status.textContent=`${lessons.length} lesson${lessons.length===1?'':'s'} available across ${courses.length} track${courses.length===1?'':'s'}.`;
  root.querySelectorAll('[data-open-lesson]').forEach(btn=>btn.addEventListener('click',()=>openPortalLesson(btn.dataset.openLesson)));
  root.querySelectorAll('[data-complete]').forEach(btn=>btn.addEventListener('click',()=>{const row=btn.closest('[data-item]');if(typeof markComplete==='function')markComplete(row);if(typeof updateLessonCount==='function')updateLessonCount();if(typeof scheduleCloudSave==='function')scheduleCloudSave(250)}));
  if(typeof updateProgress==='function')updateProgress();
  if(typeof updateLessonCount==='function')updateLessonCount();
  if(typeof renderStudentDashboard==='function')renderStudentDashboard();
}
function openPortalLesson(id){
  const l=portalCourseData.lessons.find(x=>String(x.id)===String(id));
  const viewer=document.getElementById('lessonViewer');if(!l||!viewer)return;
  document.getElementById('lessonViewerKicker').textContent=l.is_preview?'FREE PREVIEW':'COURSE LESSON';
  document.getElementById('lessonViewerTitle').textContent=l.title;
  document.getElementById('lessonViewerMeta').textContent=`${l.duration_minutes} min · ${l.slug}`;
  document.getElementById('lessonViewerText').textContent=l.lesson_text||l.summary||'';
  const task=document.getElementById('lessonViewerTask');task.textContent=l.task_text?`Action: ${l.task_text}`:'No task has been added for this lesson yet.';
  const video=document.getElementById('lessonViewerVideo');video.innerHTML=l.video_url?`<a href="${pcEsc(l.video_url)}" target="_blank" rel="noopener">Open lesson video ↗</a>`:'';
  viewer.classList.remove('hidden');viewer.scrollIntoView({behavior:'smooth',block:'start'});
}
document.getElementById('lessonViewerClose')?.addEventListener('click',()=>document.getElementById('lessonViewer')?.classList.add('hidden'));
ensureAccessRefresh();
if(typeof sb!=='undefined'&&sb){sb.auth.getSession().then(({data})=>{if(data.session)loadPortalCourses()});sb.auth.onAuthStateChange((event,session)=>{if(session&&(event==='SIGNED_IN'||event==='INITIAL_SESSION'))loadPortalCourses()})}
function addPortalAsset(type,path,marker,onload){if(document.querySelector(`[data-${marker}]`)){onload?.();return}const el=document.createElement(type==='style'?'link':'script');if(type==='style'){el.rel='stylesheet';el.href=path}else{el.src=path;el.defer=true;if(onload)el.onload=onload}el.dataset[marker]='1';(type==='style'?document.head:document.body).appendChild(el)}
if(document.getElementById('portal')){addPortalAsset('style','student-notifications.css','nexoraNotificationsCss');addPortalAsset('style','student-dashboard.css','nexoraDashboardCss');addPortalAsset('script','student-notifications.js','nexoraNotifications',()=>addPortalAsset('script','student-dashboard.js','nexoraDashboard'))}
