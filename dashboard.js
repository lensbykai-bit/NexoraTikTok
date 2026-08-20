const sb=window.nexoraSupabase;
const state={session:null,profile:null,courses:[],lessons:[],progress:[],enrollment:null,currentLesson:null};
const $=id=>document.getElementById(id);

function showMessage(id,text,type='info'){
  const el=$(id); if(!el)return; el.textContent=text||''; el.classList.toggle('show',Boolean(text)); el.dataset.type=type;
}
function esc(value=''){return String(value).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function lessonDone(slug){return state.progress.some(p=>p.lesson_slug===slug&&p.completed);}
function courseLessons(slug){return state.lessons.filter(l=>l.course_slug===slug).sort((a,b)=>a.sort_order-b.sort_order);}
function canOpen(lesson){return lesson.is_free_preview||state.profile?.access_level==='full'||state.profile?.role==='admin';}

async function requireSession(){
  if(!sb){location.href='login.html';return false;}
  const {data:{session}}=await sb.auth.getSession();
  if(!session){location.href='login.html';return false;}
  state.session=session; return true;
}

async function loadData(){
  const uid=state.session.user.id;
  const [profileRes,coursesRes,lessonsRes,progressRes,enrollRes]=await Promise.all([
    sb.from('profiles').select('*').eq('user_id',uid).single(),
    sb.from('courses').select('*').eq('published',true).order('sort_order'),
    sb.from('lessons').select('*').eq('published',true).order('sort_order'),
    sb.from('lesson_progress').select('*').eq('user_id',uid),
    sb.from('enrollments').select('*').eq('user_id',uid).maybeSingle()
  ]);
  if(profileRes.error)throw profileRes.error;
  state.profile=profileRes.data;
  state.courses=coursesRes.data||[];
  state.lessons=lessonsRes.data||[];
  state.progress=progressRes.data||[];
  state.enrollment=enrollRes.data||null;
  renderAll();
}

function renderAll(){
  $('welcomeName').textContent=state.profile.full_name||state.session.user.email?.split('@')[0]||'Creator';
  $('profileName').value=state.profile.full_name||'';
  $('profileNiche').value=state.profile.creator_niche||'';
  $('profileGoal').value=state.profile.creator_goal||'';
  $('profileLevel').value=state.profile.level||'beginner';
  $('adminLink').hidden=state.profile.role!=='admin';

  const full=state.profile.access_level==='full'||state.profile.role==='admin';
  $('accessLabel').textContent=full?'Full Access':'Starter Access';
  $('accessHelp').textContent=full?'All published lessons are unlocked.':'Free preview lessons are available while access is reviewed.';
  $('requestAccessBtn').hidden=full||state.enrollment?.status==='pending'||state.enrollment?.status==='approved';

  const completed=state.progress.filter(p=>p.completed).length;
  const total=state.lessons.length;
  const percent=total?Math.round(completed/total*100):0;
  $('progressPercent').textContent=`${percent}%`;
  $('progressBar').style.width=`${percent}%`;
  $('completedCount').textContent=completed;
  $('lessonTotal').textContent=`of ${total} lessons`;
  $('courseCount').textContent=state.courses.length;
  if(state.enrollment){
    $('enrollmentStatus').textContent=state.enrollment.status.charAt(0).toUpperCase()+state.enrollment.status.slice(1);
    $('enrollmentHelp').textContent=state.enrollment.status==='approved'?'Full access granted':state.enrollment.status==='pending'?'Waiting for review':'Request was not approved';
  }else{
    $('enrollmentStatus').textContent='None'; $('enrollmentHelp').textContent='No request yet';
  }
  renderCourses();
}

function renderCourses(){
  const list=$('courseList');
  list.innerHTML=state.courses.map(course=>{
    const lessons=courseLessons(course.slug);
    const done=lessons.filter(l=>lessonDone(l.slug)).length;
    return `<section class="course-block">
      <div class="course-block-head"><div><b>${esc(course.title)}</b><span>${esc(course.summary)}</span></div><div><b>${done}/${lessons.length}</b><span>complete</span></div></div>
      <div class="lesson-list">${lessons.map(lesson=>{
        const open=canOpen(lesson); const doneClass=lessonDone(lesson.slug)?' lesson-done':'';
        const badge=lesson.is_free_preview?'Preview':open?'Unlocked':'Locked';
        return `<div class="lesson-row${doneClass}"><div><h3>${esc(lesson.title)}</h3><p>${esc(lesson.summary)} · ${lesson.duration_minutes} min</p></div><span class="lesson-badge${open?'':' locked'}">${badge}</span><button class="lesson-open" data-lesson="${esc(lesson.slug)}" ${open?'':'disabled'}>${open?'Open':'Locked'}</button></div>`;
      }).join('')}</div>
    </section>`;
  }).join('')||'<div class="loading-card">No courses are published yet.</div>';
  list.querySelectorAll('[data-lesson]').forEach(btn=>btn.addEventListener('click',()=>openLesson(btn.dataset.lesson)));
}

async function openLesson(slug){
  const lesson=state.lessons.find(l=>l.slug===slug); if(!lesson||!canOpen(lesson))return;
  state.currentLesson=lesson;
  $('lessonCourse').textContent=state.courses.find(c=>c.slug===lesson.course_slug)?.title||'LESSON';
  $('lessonTitle').textContent=lesson.title;
  $('lessonMeta').textContent=`${lesson.duration_minutes} min · ${lesson.is_free_preview?'Free preview':'Full course lesson'}`;
  $('lessonBody').textContent='Loading lesson…'; $('lessonTask').textContent=''; showMessage('lessonMessage','');
  $('lessonDialog').showModal();
  const {data,error}=await sb.from('lesson_content').select('*').eq('lesson_slug',slug).maybeSingle();
  if(error||!data){
    $('lessonBody').textContent='This lesson is locked for your current access level.';
    $('lessonTask').textContent='Request Full Access from your dashboard to unlock paid lessons.';
    $('completeLessonBtn').hidden=true; return;
  }
  $('lessonBody').textContent=data.body;
  $('lessonTask').textContent=data.action_task;
  $('completeLessonBtn').hidden=false;
  $('completeLessonBtn').textContent=lessonDone(slug)?'Completed ✓':'Mark Complete';
}

async function markComplete(){
  if(!state.currentLesson)return;
  const slug=state.currentLesson.slug;
  const completed=!lessonDone(slug);
  const payload={user_id:state.session.user.id,lesson_slug:slug,completed,completed_at:completed?new Date().toISOString():null,updated_at:new Date().toISOString()};
  const {error}=await sb.from('lesson_progress').upsert(payload,{onConflict:'user_id,lesson_slug'});
  if(error){showMessage('lessonMessage',error.message,'error');return;}
  const existing=state.progress.find(p=>p.lesson_slug===slug);
  if(existing)Object.assign(existing,payload); else state.progress.push(payload);
  $('completeLessonBtn').textContent=completed?'Completed ✓':'Mark Complete';
  showMessage('lessonMessage',completed?'Lesson marked complete.':'Lesson marked incomplete.','success');
  renderAll();
}

async function saveProfile(e){
  e.preventDefault(); showMessage('profileMessage','Saving…');
  const {data,error}=await sb.rpc('update_my_profile',{
    p_full_name:$('profileName').value.trim(),
    p_creator_niche:$('profileNiche').value.trim(),
    p_creator_goal:$('profileGoal').value.trim(),
    p_level:$('profileLevel').value
  });
  if(error){showMessage('profileMessage',error.message,'error');return;}
  state.profile=Array.isArray(data)?data[0]:data;
  showMessage('profileMessage','Profile saved.','success'); renderAll();
}

async function requestAccess(){
  const btn=$('requestAccessBtn'); btn.disabled=true; btn.textContent='Sending…';
  const {data,error}=await sb.rpc('request_full_access');
  if(error){alert(error.message);btn.disabled=false;btn.textContent='Request Full Access';return;}
  state.enrollment=Array.isArray(data)?data[0]:data;
  btn.disabled=false; btn.textContent='Request Full Access'; renderAll();
}

async function init(){
  if(!await requireSession())return;
  $('logoutBtn').addEventListener('click',async()=>{await sb.auth.signOut();location.href='login.html';});
  $('refreshBtn').addEventListener('click',()=>loadData().catch(err=>alert(err.message)));
  $('profileForm').addEventListener('submit',saveProfile);
  $('requestAccessBtn').addEventListener('click',requestAccess);
  $('completeLessonBtn').addEventListener('click',markComplete);
  try{await loadData();}catch(err){$('courseList').innerHTML=`<div class="loading-card">${esc(err.message)}</div>`;}
}
init();