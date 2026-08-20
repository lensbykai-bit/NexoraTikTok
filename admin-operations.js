const OPS_CONFIG={url:'https://bcvtkdehflmqiyvloyiy.supabase.co',key:'sb_publishable_KgISTJ7-YKktjQXw3u0yuQ_KG6H1bFa'};
const opsSb=window.supabase?.createClient(OPS_CONFIG.url,OPS_CONFIG.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const O=(s,r=document)=>r.querySelector(s),OO=(s,r=document)=>[...r.querySelectorAll(s)];
let opsStudents=[],opsEnrollments=[],opsNotifications=[],opsActivity=[],opsCurrentEnrollment=null;
function oe(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function od(v){if(!v)return '—';try{return new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'}).format(new Date(v))}catch{return v}}
function norm(v=''){return String(v).trim().toLowerCase()}
function setOpsStatus(v){if(O('#opsStatus'))O('#opsStatus').textContent=v}
async function checkOpsAdmin(){
  if(!opsSb)return false;const{data:{session}}=await opsSb.auth.getSession();if(!session){showOpsLogin();return false}
  const{data,error}=await opsSb.from('admin_users').select('role').eq('user_id',session.user.id).maybeSingle();
  if(error||!data){await opsSb.auth.signOut();showOpsLogin('This account is not authorized for Nexora operations.');return false}
  O('#opsIdentity').textContent=`${session.user.email||'Admin'} · ${data.role}`;O('#opsLogin')?.classList.add('hidden');O('#opsApp')?.classList.remove('hidden');await loadOps();return true
}
function showOpsLogin(message=''){O('#opsApp')?.classList.add('hidden');O('#opsLogin')?.classList.remove('hidden');if(O('#opsLoginMessage'))O('#opsLoginMessage').textContent=message}
O('#opsLoginForm')?.addEventListener('submit',async e=>{e.preventDefault();const m=O('#opsLoginMessage');if(m)m.textContent='Signing in…';const{error}=await opsSb.auth.signInWithPassword({email:O('#opsEmail').value.trim(),password:O('#opsPassword').value});if(error){if(m)m.textContent=error.message;return}await checkOpsAdmin()});
O('#opsLogout')?.addEventListener('click',async()=>{await opsSb.auth.signOut();location.reload()});O('#opsRefresh')?.addEventListener('click',loadOps);
async function loadOps(){
  setOpsStatus('Loading operations…');
  const[s,e,n,a]=await Promise.all([
    opsSb.from('nexora_portal_state').select('external_user_id,email,display_name,course_access,admin_status,updated_at').order('updated_at',{ascending:false}),
    opsSb.from('nexora_enrollments').select('*').order('created_at',{ascending:false}),
    opsSb.from('nexora_student_notifications').select('id,external_user_id,is_read,created_at').order('created_at',{ascending:false}).limit(500),
    opsSb.from('nexora_admin_activity').select('*').order('created_at',{ascending:false}).limit(150)
  ]);
  if(s.error||e.error||n.error||a.error){console.error(s.error||e.error||n.error||a.error);setOpsStatus('Could not load operations data.');return}
  opsStudents=s.data||[];opsEnrollments=e.data||[];opsNotifications=n.data||[];opsActivity=a.data||[];renderOpsMetrics();renderOpsStudentOptions();renderOpsEnrollments();renderOpsActivity();setOpsStatus(`Updated ${new Date().toLocaleTimeString()}`)
}
function studentForEnrollment(e){return opsStudents.find(s=>s.external_user_id===e.matched_user_id)||opsStudents.find(s=>norm(s.email)===norm(e.email))||null}
function renderOpsMetrics(){
  const now=Date.now(),day=86400000;O('#opPending').textContent=opsEnrollments.filter(e=>!['approved','closed'].includes(e.status)).length;
  O('#opUnmatched').textContent=opsEnrollments.filter(e=>e.status==='approved'&&!studentForEnrollment(e)).length;
  O('#opFull').textContent=opsStudents.filter(s=>s.course_access==='full').length;
  O('#opUnread').textContent=opsNotifications.filter(n=>!n.is_read).length;
  O('#opActivity').textContent=opsActivity.filter(a=>now-new Date(a.created_at).getTime()<=day).length;
}
function renderOpsStudentOptions(){const sel=O('#opsNotifyStudent');if(!sel)return;const old=sel.value;sel.innerHTML='<option value="">Choose student</option>'+opsStudents.map(s=>`<option value="${oe(s.external_user_id)}">${oe(s.display_name||'Student')} · ${oe(s.email||'')}</option>`).join('');if([...sel.options].some(o=>o.value===old))sel.value=old}
function enrollmentMatchLabel(e){const s=studentForEnrollment(e);if(s)return `${s.display_name||'Student'} · ${s.course_access||'starter'}`;return e.status==='approved'?'Waiting for matching account':'Not matched yet'}
function renderOpsEnrollments(){
  const root=O('#opsEnrollmentList');if(!root)return;const q=norm(O('#opsEnrollmentSearch')?.value),f=O('#opsEnrollmentFilter')?.value||'all';
  const rows=opsEnrollments.filter(e=>{const search=!q||[e.full_name,e.email,e.track,e.goal,e.payment_reference].join(' ').toLowerCase().includes(q);let filter=true;if(f==='unmatched')filter=e.status==='approved'&&!studentForEnrollment(e);else if(f==='payment_pending')filter=e.payment_status==='pending';else if(f!=='all')filter=e.status===f;return search&&filter});
  if(!rows.length){root.innerHTML='<div class="ops-empty">No matching enrollments.</div>';return}
  root.innerHTML=rows.map(e=>{const matched=studentForEnrollment(e),payment=e.payment_status||'not_required';const cls=matched?'good':(e.status==='approved'?'warn':'');return `<article class="ops-row"><div><strong>${oe(e.full_name)}</strong><span>${oe(e.email)}</span></div><div><strong>${oe(e.track)}</strong><small>${oe(enrollmentMatchLabel(e))}</small></div><div><span class="ops-state ${cls}">${oe(e.status)} · ${oe(payment)}</span></div><button type="button" data-enrollment-id="${e.id}">Manage</button></article>`}).join('');
  root.querySelectorAll('[data-enrollment-id]').forEach(b=>b.addEventListener('click',()=>openOpsEnrollment(b.dataset.enrollmentId)))
}
O('#opsEnrollmentSearch')?.addEventListener('input',renderOpsEnrollments);O('#opsEnrollmentFilter')?.addEventListener('change',renderOpsEnrollments);
function detail(label,value){return `<div class="admin-detail"><small>${oe(label)}</small><div>${oe(value||'—')}</div></div>`}
function openOpsEnrollment(id){
  opsCurrentEnrollment=opsEnrollments.find(e=>String(e.id)===String(id));if(!opsCurrentEnrollment)return;const e=opsCurrentEnrollment,s=studentForEnrollment(e);O('#opsEnrollmentTitle').textContent=e.full_name||'Enrollment';O('#opsEnrollmentDetails').innerHTML=[['Email',e.email],['Track',e.track],['Level',e.level],['Student match',s?`${s.display_name||'Student'} · ${s.email}`:'No matching portal account yet'],['Current access',s?.course_access||'—'],['Approved',od(e.approved_at)],['Matched',od(e.matched_at)],['Created',od(e.created_at)]].map(x=>detail(...x)).join('');O('#opsEditStatus').value=e.status||'new';O('#opsEditPayment').value=e.payment_status||'not_required';O('#opsEditPaymentRef').value=e.payment_reference||'';O('#opsEditNote').value=e.admin_note||'';O('#opsEnrollmentMessage').textContent='';O('#opsEnrollmentModal').classList.remove('hidden')
}
function closeOpsEnrollment(){O('#opsEnrollmentModal')?.classList.add('hidden');opsCurrentEnrollment=null}O('#opsEnrollmentClose')?.addEventListener('click',closeOpsEnrollment);O('#opsEnrollmentCancel')?.addEventListener('click',closeOpsEnrollment);O('#opsEnrollmentModal')?.addEventListener('click',e=>{if(e.target===O('#opsEnrollmentModal'))closeOpsEnrollment()});
O('#opsSaveEnrollment')?.addEventListener('click',async()=>{
  if(!opsCurrentEnrollment)return;const status=O('#opsEditStatus').value,payment=O('#opsEditPayment').value,msg=O('#opsEnrollmentMessage'),btn=O('#opsSaveEnrollment');
  if(status==='approved'&&payment==='pending'){msg.textContent='Payment is still pending. Mark it paid, waived, or not_required before approval.';return}
  btn.disabled=true;btn.textContent='Saving…';const payload={status,payment_status:payment,payment_reference:O('#opsEditPaymentRef').value.trim(),admin_note:O('#opsEditNote').value.trim(),updated_at:new Date().toISOString()};const{error}=await opsSb.from('nexora_enrollments').update(payload).eq('id',opsCurrentEnrollment.id);btn.disabled=false;btn.textContent='Save workflow';if(error){msg.textContent=error.message;return}msg.textContent=status==='approved'?'Saved. Automatic account matching/access grant is running ✓':'Workflow saved ✓';await loadOps();setTimeout(closeOpsEnrollment,700)
});
O('#opsSendNotification')?.addEventListener('click',async()=>{
  const uid=O('#opsNotifyStudent').value,title=O('#opsNotifyTitle').value.trim(),body=O('#opsNotifyBody').value.trim(),msg=O('#opsNotifyMessage'),btn=O('#opsSendNotification');const student=opsStudents.find(s=>s.external_user_id===uid);if(!student||title.length<2||body.length<2){msg.textContent='Choose a student and add a title and message.';return}
  btn.disabled=true;btn.textContent='Sending…';const row={external_user_id:student.external_user_id,email:student.email||'',type:O('#opsNotifyType').value,title,body,action_label:O('#opsNotifyActionLabel').value.trim(),action_url:O('#opsNotifyActionUrl').value.trim()};const{error}=await opsSb.from('nexora_student_notifications').insert(row);btn.disabled=false;btn.textContent='Send notification';if(error){msg.textContent=error.message;return}msg.textContent='Notification sent ✓';O('#opsNotifyTitle').value='';O('#opsNotifyBody').value='';await loadOps()
});
function renderOpsActivity(){
  const root=O('#opsActivityList');if(!root)return;const q=norm(O('#opsActivitySearch')?.value),type=O('#opsActivityType')?.value||'all';const rows=opsActivity.filter(a=>(type==='all'||a.entity_type===type)&&(!q||[a.actor_email,a.action,a.entity_type,a.entity_id,a.summary].join(' ').toLowerCase().includes(q))).slice(0,100);if(!rows.length){root.innerHTML='<div class="ops-empty">No matching activity.</div>';return}root.innerHTML=rows.map(a=>`<div class="ops-activity"><code>${oe(a.action)}</code><span>${oe(a.entity_type.replace('nexora_',''))}</span><span>${oe(a.summary||a.entity_id||'System update')}</span><small>${oe(od(a.created_at))}${a.actor_email?` · ${oe(a.actor_email)}`:''}</small></div>`).join('')
}
O('#opsActivitySearch')?.addEventListener('input',renderOpsActivity);O('#opsActivityType')?.addEventListener('change',renderOpsActivity);document.addEventListener('keydown',e=>{if(e.key==='Escape')closeOpsEnrollment()});opsSb?.auth.onAuthStateChange(event=>{if(event==='SIGNED_OUT')showOpsLogin()});checkOpsAdmin();
