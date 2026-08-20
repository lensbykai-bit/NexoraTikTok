const PORTAL_CLOUD={
  url:'https://bcvtkdehflmqiyvloyiy.supabase.co/functions/v1/portal-sync',
  apikey:'sb_publishable_KgISTJ7-YKktjQXw3u0yuQ_KG6H1bFa'
};

let portalCloudTimer=null;
let portalCloudBusy=false;
let portalCloudReady=false;

function ensureCloudStatus(){
  let el=document.getElementById('cloudSyncState');
  if(el)return el;
  const anchor=document.getElementById('lessonCount');
  if(!anchor)return null;
  el=document.createElement('span');
  el.id='cloudSyncState';
  el.className='cloud-sync-state local';
  el.textContent='Local backup ready';
  anchor.insertAdjacentElement('afterend',el);
  return el;
}

function setCloudStatus(text,state='local'){
  const el=ensureCloudStatus();
  if(!el)return;
  el.textContent=text;
  el.className=`cloud-sync-state ${state}`;
}

async function cloudSession(){
  if(typeof sb==='undefined'||!sb)return null;
  const {data,error}=await sb.auth.getSession();
  if(error)return null;
  return data.session||null;
}

async function portalCloudRequest(action,state){
  const session=await cloudSession();
  if(!session?.access_token)return null;
  const res=await fetch(PORTAL_CLOUD.url,{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      apikey:PORTAL_CLOUD.apikey,
      Authorization:`Bearer ${session.access_token}`
    },
    body:JSON.stringify({action,state})
  });
  if(!res.ok)throw new Error(`Cloud sync failed (${res.status})`);
  return res.json();
}

function portalLocalSnapshot(){
  const completed=typeof getCompleted==='function'?getCompleted():[];
  const note=document.getElementById('noteArea')?.value||localStorage.getItem(storageKey('note'))||'';
  const t=typeof loadTime==='function'?loadTime():{total:0,today:0,date:'',lastVisit:'',streak:1};
  return{
    completed,
    note,
    total_seconds:Number(t.total)||0,
    today_seconds:Number(t.today)||0,
    time_date:t.date||null,
    last_visit:t.lastVisit||null,
    streak:Number(t.streak)||1
  };
}

function mergeCloudIntoLocal(remote){
  if(!remote)return;
  const local=portalLocalSnapshot();
  const completed=[...new Set([...(local.completed||[]),...(Array.isArray(remote.completed)?remote.completed:[])])];
  localStorage.setItem(storageKey('completed'),JSON.stringify(completed));

  const remoteNote=typeof remote.note==='string'?remote.note:'';
  const chosenNote=remoteNote.trim()?remoteNote:local.note;
  localStorage.setItem(storageKey('note'),chosenNote||'');

  const sameDate=remote.time_date&&local.time_date&&remote.time_date===local.time_date;
  const mergedTime={
    total:Math.max(Number(local.total_seconds)||0,Number(remote.total_seconds)||0),
    today:sameDate?Math.max(Number(local.today_seconds)||0,Number(remote.today_seconds)||0):(Number(local.today_seconds)||0),
    date:local.time_date||remote.time_date||dateKey(),
    lastVisit:local.last_visit||remote.last_visit||dateKey(),
    streak:Math.max(Number(local.streak)||1,Number(remote.streak)||1)
  };
  localStorage.setItem(storageKey('time'),JSON.stringify(mergedTime));

  if(typeof restorePortalState==='function')restorePortalState();
  if(typeof updateLessonCount==='function')updateLessonCount();
}

async function portalCloudLoad(){
  if(portalCloudBusy)return;
  portalCloudBusy=true;
  setCloudStatus('Syncing account…','syncing');
  try{
    const result=await portalCloudRequest('load');
    if(!result){setCloudStatus('Sign in to enable cloud sync','local');return}
    if(result.state)mergeCloudIntoLocal(result.state);
    portalCloudReady=true;
    await portalCloudSave(true);
    setCloudStatus('Cloud sync on ✓','synced');
  }catch(err){
    console.warn('Nexora cloud sync load:',err);
    setCloudStatus('Saved on this device','local');
  }finally{
    portalCloudBusy=false;
  }
}

async function portalCloudSave(force=false){
  if(portalCloudBusy&&!force)return;
  const session=await cloudSession();
  if(!session)return;
  if(!navigator.onLine){setCloudStatus('Offline · local copy saved','local');return}
  if(!force)setCloudStatus('Saving…','syncing');
  try{
    await portalCloudRequest('save',portalLocalSnapshot());
    portalCloudReady=true;
    setCloudStatus('Cloud sync on ✓','synced');
  }catch(err){
    console.warn('Nexora cloud sync save:',err);
    setCloudStatus('Saved on this device','local');
  }
}

function scheduleCloudSave(delay=350){
  clearTimeout(window.__nexoraCloudSaveDelay);
  window.__nexoraCloudSaveDelay=setTimeout(()=>portalCloudSave(),delay);
}

ensureCloudStatus();
if(typeof sb!=='undefined'&&sb){
  sb.auth.getSession().then(({data})=>{
    if(data.session)portalCloudLoad();
    else setCloudStatus('Sign in to enable cloud sync','local');
  });
  sb.auth.onAuthStateChange((event,session)=>{
    if(session&&(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'))portalCloudLoad();
    if(event==='SIGNED_OUT')setCloudStatus('Signed out','local');
  });
}

document.querySelectorAll('[data-complete]').forEach(btn=>btn.addEventListener('click',()=>scheduleCloudSave(500)));
document.getElementById('saveNote')?.addEventListener('click',()=>scheduleCloudSave(250));
window.addEventListener('online',()=>portalCloudSave(true));
window.addEventListener('offline',()=>setCloudStatus('Offline · local copy saved','local'));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')portalCloudSave(true)});
portalCloudTimer=setInterval(()=>{if(document.getElementById('portal')?.classList.contains('show'))portalCloudSave()},60000);
