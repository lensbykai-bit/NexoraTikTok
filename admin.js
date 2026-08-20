const adminSb=window.nexoraSupabase;
const adminState={session:null,profile:null,profiles:[],enrollments:[],progress:[]};
const byId=id=>document.getElementById(id);
const safe=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

async function checkAdmin(){
  if(!adminSb){location.href='login.html';return false;}
  const {data:{session}}=await adminSb.auth.getSession();
  if(!session){location.href='login.html';return false;}
  adminState.session=session;
  const {data,error}=await adminSb.from('profiles').select('*').eq('user_id',session.user.id).single();
  if(error||!data||data.role!=='admin'){
    const gate=byId('adminGate'); gate.classList.add('denied');
    gate.innerHTML='<span>ADMIN ACCESS</span><h1>Admin role required.</h1><p>This page is protected. Your signed-in account is not currently assigned the admin role.</p><p><a class="btn btn-primary" href="dashboard.html">Back to Dashboard</a></p>';
    return false;
  }
  adminState.profile=data; byId('adminGate').hidden=true; byId('adminApp').hidden=false; return true;
}

async function loadAdmin(){
  const [profiles,enrollments,progress]=await Promise.all([
    adminSb.from('profiles').select('*').order('created_at',{ascending:false}),
    adminSb.from('enrollments').select('*').order('created_at',{ascending:false}),
    adminSb.from('lesson_progress').select('user_id,lesson_slug,completed').eq('completed',true)
  ]);
  if(profiles.error)throw profiles.error; if(enrollments.error)throw enrollments.error; if(progress.error)throw progress.error;
  adminState.profiles=profiles.data||[]; adminState.enrollments=enrollments.data||[]; adminState.progress=progress.data||[]; renderAdmin();
}

function renderAdmin(){
  byId('metricStudents').textContent=adminState.profiles.filter(p=>p.role==='student').length;
  byId('metricFull').textContent=adminState.profiles.filter(p=>p.access_level==='full').length;
  byId('metricPending').textContent=adminState.enrollments.filter(e=>e.status==='pending').length;
  byId('metricCompleted').textContent=adminState.progress.length;
  const profileMap=new Map(adminState.profiles.map(p=>[p.user_id,p]));
  byId('enrollmentRows').innerHTML=adminState.enrollments.map(e=>{
    const p=profileMap.get(e.user_id)||{};
    const created=new Date(e.created_at).toLocaleDateString();
    return `<tr><td>${safe(p.full_name||'Student')}</td><td>${safe(e.plan)}</td><td><span class="status-pill">${safe(e.status)}</span></td><td>${created}</td><td><div class="action-group"><button class="action-btn approve" data-status="approved" data-id="${e.id}">Approve</button><button class="action-btn" data-status="pending" data-id="${e.id}">Pending</button><button class="action-btn" data-status="rejected" data-id="${e.id}">Reject</button></div></td></tr>`;
  }).join('')||'<tr><td colspan="5">No enrollment requests yet.</td></tr>';
  byId('studentRows').innerHTML=adminState.profiles.map(p=>`<tr><td>${safe(p.full_name||'Unnamed student')}</td><td>${safe(p.creator_niche||'—')}</td><td>${safe(p.level)}</td><td><span class="status-pill">${safe(p.access_level)}</span></td><td>${safe(p.role)}</td></tr>`).join('')||'<tr><td colspan="5">No students yet.</td></tr>';
  document.querySelectorAll('[data-status][data-id]').forEach(btn=>btn.addEventListener('click',()=>setEnrollmentStatus(btn.dataset.id,btn.dataset.status,btn)));
}

async function setEnrollmentStatus(id,status,button){
  button.disabled=true;
  const {error}=await adminSb.from('enrollments').update({status,updated_at:new Date().toISOString()}).eq('id',id);
  if(error){alert(error.message);button.disabled=false;return;}
  await loadAdmin();
}

async function initAdmin(){
  byId('adminLogout').addEventListener('click',async()=>{await adminSb.auth.signOut();location.href='login.html';});
  if(!await checkAdmin())return;
  byId('adminRefresh').addEventListener('click',()=>loadAdmin().catch(err=>alert(err.message)));
  try{await loadAdmin();}catch(err){alert(err.message);}
}
initAdmin();