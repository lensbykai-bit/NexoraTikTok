const adminSb=window.nexoraSupabase;
const adminState={session:null,profile:null,profiles:[],enrollments:[],progress:[],courses:[],lessons:[],prompts:[]};
const byId=id=>document.getElementById(id);
const safe=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

async function checkAdmin(){
  if(!adminSb){location.href='login.html';return false;}
  const {data:{session}}=await adminSb.auth.getSession();
  if(!session){location.href='login.html';return false;}
  adminState.session=session;
  const {data,error}=await adminSb.from('profiles').select('*').eq('user_id',session.user.id).single();
  if(error||!data||data.role!=='admin'){
    const gate=byId('adminGate');gate.classList.add('denied');gate.innerHTML='<span>ADMIN ACCESS</span><h1>Admin role required.</h1><p>This page is protected. Your signed-in account is not currently assigned the admin role.</p><p><a class="btn btn-primary" href="dashboard.html">Back to Dashboard</a></p>';return false;
  }
  adminState.profile=data;byId('adminGate').hidden=true;byId('adminApp').hidden=false;return true;
}

async function loadAdmin(){
  const [profiles,enrollments,progress,courses,lessons,prompts]=await Promise.all([
    adminSb.from('profiles').select('*').order('created_at',{ascending:false}),
    adminSb.from('enrollments').select('*').order('created_at',{ascending:false}),
    adminSb.from('lesson_progress').select('user_id,lesson_slug,completed').eq('completed',true),
    adminSb.from('courses').select('slug,published'),
    adminSb.from('lessons').select('slug,published'),
    adminSb.from('prompts').select('id,published')
  ]);
  for(const res of [profiles,enrollments,progress,courses,lessons,prompts])if(res.error)throw res.error;
  adminState.profiles=profiles.data||[];adminState.enrollments=enrollments.data||[];adminState.progress=progress.data||[];adminState.courses=courses.data||[];adminState.lessons=lessons.data||[];adminState.prompts=prompts.data||[];renderAdmin();
}

function renderAdmin(){
  const students=adminState.profiles.filter(p=>p.role==='student');
  const completedByUser=new Map();
  adminState.progress.forEach(p=>completedByUser.set(p.user_id,(completedByUser.get(p.user_id)||0)+1));
  const totalPossible=Math.max(1,students.length*adminState.lessons.filter(l=>l.published).length);
  const rate=Math.round(adminState.progress.length/totalPossible*100);
  byId('metricStudents').textContent=students.length;
  byId('metricFull').textContent=adminState.profiles.filter(p=>p.access_level==='full').length;
  byId('metricPending').textContent=adminState.enrollments.filter(e=>e.status==='pending').length;
  byId('metricCompleted').textContent=adminState.progress.length;
  byId('metricCourses').textContent=adminState.courses.filter(c=>c.published).length;
  byId('metricLessons').textContent=adminState.lessons.filter(l=>l.published).length;
  byId('metricPrompts').textContent=adminState.prompts.filter(p=>p.published).length;
  byId('metricCompletionRate').textContent=`${rate}%`;
  const profileMap=new Map(adminState.profiles.map(p=>[p.user_id,p]));
  byId('enrollmentRows').innerHTML=adminState.enrollments.map(e=>{const p=profileMap.get(e.user_id)||{};const created=new Date(e.created_at).toLocaleDateString();return `<tr><td>${safe(p.full_name||'Student')}</td><td>${safe(e.plan)}</td><td><span class="status-pill">${safe(e.status)}</span></td><td>${created}</td><td><div class="action-group"><button class="action-btn approve" data-status="approved" data-id="${e.id}">Approve</button><button class="action-btn" data-status="pending" data-id="${e.id}">Pending</button><button class="action-btn" data-status="rejected" data-id="${e.id}">Reject</button></div></td></tr>`;}).join('')||'<tr><td colspan="5">No enrollment requests yet.</td></tr>';
  byId('studentRows').innerHTML=adminState.profiles.map(p=>`<tr><td>${safe(p.full_name||'Unnamed student')}</td><td>${safe(p.creator_niche||'—')}</td><td>${safe(p.level)}</td><td><span class="status-pill">${safe(p.access_level)}</span></td><td>${safe(p.role)}</td><td>${completedByUser.get(p.user_id)||0}</td></tr>`).join('')||'<tr><td colspan="6">No students yet.</td></tr>';
  document.querySelectorAll('[data-status][data-id]').forEach(btn=>btn.addEventListener('click',()=>setEnrollmentStatus(btn.dataset.id,btn.dataset.status,btn)));
}

async function setEnrollmentStatus(id,status,button){button.disabled=true;const {error}=await adminSb.from('enrollments').update({status,updated_at:new Date().toISOString()}).eq('id',id);if(error){alert(error.message);button.disabled=false;return;}await loadAdmin();}
async function initAdmin(){byId('adminLogout').addEventListener('click',async()=>{await adminSb.auth.signOut();location.href='login.html';});if(!await checkAdmin())return;byId('adminRefresh').addEventListener('click',()=>loadAdmin().catch(err=>alert(err.message)));try{await loadAdmin();}catch(err){alert(err.message);}}
initAdmin();