const STUDENT_NOTIFICATIONS={url:'https://bcvtkdehflmqiyvloyiy.supabase.co/functions/v1/student-notifications',apikey:'sb_publishable_KgISTJ7-YKktjQXw3u0yuQ_KG6H1bFa'};
let nexoraNotifications=[];
function snEsc(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function installNotificationUI(){
  if(!document.querySelector('link[href="student-notifications.css"]')){const l=document.createElement('link');l.rel='stylesheet';l.href='student-notifications.css';document.head.appendChild(l)}
  const tabs=document.querySelector('.tabs'),supportBtn=document.querySelector('.tab-btn[data-tab="supportTab"]');
  if(tabs&&!document.getElementById('notificationsTabButton')){
    const b=document.createElement('button');b.className='tab-btn notification-tab-btn';b.id='notificationsTabButton';b.dataset.tab='notificationsTab';b.innerHTML='Notifications <span id="notificationBadge" class="notification-badge hidden">0</span>';
    tabs.insertBefore(b,supportBtn||null);
    b.addEventListener('click',()=>{document.querySelectorAll('.tab-btn').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.tab-panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');document.getElementById('notificationsTab')?.classList.add('active');loadStudentNotifications()});
  }
  if(!document.getElementById('notificationsTab')){
    const support=document.getElementById('supportTab');
    const panel=document.createElement('div');panel.className='tab-panel';panel.id='notificationsTab';panel.innerHTML=`<div class="portal-card"><div class="portal-card-head"><div><h3 style="font:700 22px 'Space Grotesk'">Notifications</h3><p style="color:#7b8394;font-size:12px">Course access, enrollment and support updates for this account.</p></div><button class="pill outline" id="markAllNotificationsRead" type="button">Mark all read</button></div><p class="notification-status" id="notificationStatus">Loading notifications…</p><div class="notification-list" id="notificationList"></div></div>`;
    support?.parentNode?.insertBefore(panel,support);
    document.getElementById('markAllNotificationsRead')?.addEventListener('click',markAllNotificationsRead);
  }
}
async function notificationSession(){if(typeof sb==='undefined'||!sb)return null;const{data}=await sb.auth.getSession();return data.session||null}
async function notificationRequest(action,payload={}){
  const session=await notificationSession();if(!session?.access_token)return null;
  const res=await fetch(STUDENT_NOTIFICATIONS.url,{method:'POST',headers:{'Content-Type':'application/json',apikey:STUDENT_NOTIFICATIONS.apikey,Authorization:`Bearer ${session.access_token}`},body:JSON.stringify({action,...payload})});
  if(!res.ok)throw new Error(`Notifications failed (${res.status})`);return res.json();
}
function notificationTime(v){try{return new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'}).format(new Date(v))}catch{return v||''}}
function renderStudentNotifications(){
  const root=document.getElementById('notificationList'),status=document.getElementById('notificationStatus'),badge=document.getElementById('notificationBadge');if(!root)return;
  const unread=nexoraNotifications.filter(n=>!n.is_read).length;
  if(badge){badge.textContent=String(unread);badge.classList.toggle('hidden',unread===0)}
  if(!nexoraNotifications.length){root.innerHTML='<div class="notification-empty">No notifications yet.</div>';if(status)status.textContent='You are all caught up.';return}
  root.innerHTML=nexoraNotifications.map(n=>`<article class="notification-item ${n.is_read?'':'unread'}" data-notification-id="${n.id}"><div class="notification-icon ${snEsc(n.type)}">${n.type==='success'?'✓':n.type==='course'?'▶':n.type==='support'?'?':'i'}</div><div class="notification-copy"><div class="notification-title-row"><strong>${snEsc(n.title)}</strong><small>${snEsc(notificationTime(n.created_at))}</small></div><p>${snEsc(n.body)}</p><div class="notification-actions">${n.action_url?`<a class="text-link" href="${snEsc(n.action_url)}">${snEsc(n.action_label||'Open')} →</a>`:''}${n.is_read?'':`<button type="button" data-mark-read="${n.id}">Mark read</button>`}</div></div></article>`).join('');
  root.querySelectorAll('[data-mark-read]').forEach(btn=>btn.addEventListener('click',()=>markNotificationRead(btn.dataset.markRead)));
  if(status)status.textContent=`${unread} unread · ${nexoraNotifications.length} total`;
}
async function loadStudentNotifications(){
  installNotificationUI();const status=document.getElementById('notificationStatus');try{if(status)status.textContent='Loading notifications…';const data=await notificationRequest('list');if(!data){if(status)status.textContent='Sign in to view notifications.';return}nexoraNotifications=data.notifications||[];renderStudentNotifications()}catch(err){console.warn(err);if(status)status.textContent='Could not load notifications right now.'}
}
async function markNotificationRead(id){try{await notificationRequest('mark_read',{id:Number(id)});const n=nexoraNotifications.find(x=>String(x.id)===String(id));if(n)n.is_read=true;renderStudentNotifications()}catch(err){console.warn(err)}}
async function markAllNotificationsRead(){try{await notificationRequest('mark_all_read');nexoraNotifications.forEach(n=>n.is_read=true);renderStudentNotifications();if(typeof toast==='function')toast('Notifications marked read ✓')}catch(err){console.warn(err)}}
installNotificationUI();
if(typeof sb!=='undefined'&&sb){sb.auth.getSession().then(({data})=>{if(data.session)loadStudentNotifications()});sb.auth.onAuthStateChange((event,session)=>{if(session&&(event==='SIGNED_IN'||event==='INITIAL_SESSION'||event==='TOKEN_REFRESHED'))loadStudentNotifications()})}
setInterval(()=>{if(document.getElementById('portal')?.classList.contains('show'))loadStudentNotifications()},90000);
