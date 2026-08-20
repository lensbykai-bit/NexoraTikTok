const forgotBtn=document.getElementById('forgotPassword');
const recoveryBox=document.getElementById('recoveryBox');
const loginBoxExtra=document.getElementById('loginBox');
const signupBoxExtra=document.getElementById('signupBox');
const resetBox=document.getElementById('resetBox');

forgotBtn?.addEventListener('click',()=>{
  loginBoxExtra?.classList.add('hidden');
  signupBoxExtra?.classList.add('hidden');
  recoveryBox?.classList.remove('hidden');
});

document.getElementById('recoveryBack')?.addEventListener('click',()=>{
  recoveryBox?.classList.add('hidden');
  loginBoxExtra?.classList.remove('hidden');
});

document.getElementById('recoveryForm')?.addEventListener('submit',async e=>{
  e.preventDefault();
  const email=document.getElementById('recoveryEmail')?.value.trim();
  const msg=document.getElementById('recoveryMessage');
  if(!sb||!email)return;
  if(msg)msg.textContent='Sending reset link…';
  const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:CONFIG.googleRedirect});
  if(msg)msg.textContent=error?error.message:'Reset link sent. Check your email.';
});

document.getElementById('resetPasswordForm')?.addEventListener('submit',async e=>{
  e.preventDefault();
  const password=document.getElementById('newPassword')?.value||'';
  const confirm=document.getElementById('confirmPassword')?.value||'';
  const msg=document.getElementById('resetPasswordMessage');
  if(password.length<6){if(msg)msg.textContent='Use at least 6 characters.';return}
  if(password!==confirm){if(msg)msg.textContent='Passwords do not match.';return}
  if(!sb)return;
  if(msg)msg.textContent='Updating password…';
  const {error}=await sb.auth.updateUser({password});
  if(msg)msg.textContent=error?error.message:'Password updated ✓';
  if(!error)setTimeout(()=>location.href='learn.html',900);
});

if(sb){
  sb.auth.onAuthStateChange((event)=>{
    if(event==='PASSWORD_RECOVERY'){
      document.getElementById('authPage')?.style.setProperty('display','grid');
      document.getElementById('portal')?.classList.remove('show');
      loginBoxExtra?.classList.add('hidden');
      signupBoxExtra?.classList.add('hidden');
      recoveryBox?.classList.add('hidden');
      resetBox?.classList.remove('hidden');
    }
  });
}

function updateLessonCount(){
  const items=[...document.querySelectorAll('#courseTab [data-item]')];
  const completed=typeof getCompleted==='function'?getCompleted():[];
  const done=items.filter(x=>completed.includes(x.dataset.item)).length;
  const el=document.getElementById('lessonCount');
  if(el)el.textContent=`${done} of ${items.length} lessons completed`;
}
updateLessonCount();
document.querySelectorAll('[data-complete]').forEach(btn=>btn.addEventListener('click',()=>setTimeout(updateLessonCount,0)));

/* Direct Google Identity Services login.
   This signs the Google ID token into Supabase directly, so the browser no longer
   has to pass through the Supabase-hosted Google OAuth redirect page. */
const NEXORA_GOOGLE_CLIENT_ID='642427514508-66l4jp0qodv3gl30nnh28h2i1hmo5pf6.apps.googleusercontent.com';
let nexoraGoogleNonce='';

function nexoraLoadGoogleIdentity(){
  return new Promise((resolve,reject)=>{
    if(window.google?.accounts?.id){resolve();return}
    let script=document.querySelector('script[data-nexora-gsi]');
    if(!script){
      script=document.createElement('script');
      script.src='https://accounts.google.com/gsi/client';
      script.async=true;
      script.defer=true;
      script.dataset.nexoraGsi='1';
      document.head.appendChild(script);
    }
    const done=()=>window.google?.accounts?.id?resolve():reject(new Error('Google Sign-In did not load'));
    script.addEventListener('load',done,{once:true});
    script.addEventListener('error',()=>reject(new Error('Google Sign-In could not load')),{once:true});
    setTimeout(()=>{if(window.google?.accounts?.id)resolve()},1200);
  });
}

async function nexoraCreateNonce(){
  const bytes=crypto.getRandomValues(new Uint8Array(32));
  const raw=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(raw));
  const hashed=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
  return {raw,hashed};
}

function nexoraGoogleStatus(text){
  const visible=signupBoxExtra&&!signupBoxExtra.classList.contains('hidden')
    ? document.getElementById('signupMessage')
    : document.getElementById('loginMessage');
  if(visible)visible.textContent=text||'';
}

async function nexoraHandleGoogleCredential(response){
  if(!sb||!response?.credential)return;
  nexoraGoogleStatus('Signing in with Google…');
  const {error}=await sb.auth.signInWithIdToken({
    provider:'google',
    token:response.credential,
    nonce:nexoraGoogleNonce
  });
  if(error){
    console.error('Nexora Google sign-in:',error);
    nexoraGoogleStatus(error.message||'Google sign-in failed.');
    return;
  }
  nexoraGoogleStatus('Signed in successfully ✓');
}

function nexoraReplaceGoogleButton(id){
  const old=document.getElementById(id);
  if(!old)return null;
  const width=Math.min(400,Math.max(280,Math.round(old.getBoundingClientRect().width||360)));
  const host=document.createElement('div');
  host.id=id;
  host.className='nexora-google-host';
  host.style.cssText='width:100%;min-height:44px;display:flex;justify-content:center;align-items:center;margin:0;';
  old.replaceWith(host);
  google.accounts.id.renderButton(host,{
    type:'standard',
    theme:'outline',
    size:'large',
    text:'continue_with',
    shape:'rectangular',
    logo_alignment:'left',
    width
  });
  return host;
}

async function nexoraInitDirectGoogle(){
  if(!sb)return;
  try{
    await nexoraLoadGoogleIdentity();
    const nonce=await nexoraCreateNonce();
    nexoraGoogleNonce=nonce.raw;
    google.accounts.id.initialize({
      client_id:NEXORA_GOOGLE_CLIENT_ID,
      callback:nexoraHandleGoogleCredential,
      nonce:nonce.hashed,
      ux_mode:'popup',
      auto_select:false,
      cancel_on_tap_outside:true
    });
    nexoraReplaceGoogleButton('googleLogin');
    nexoraReplaceGoogleButton('googleSignup');
  }catch(err){
    console.warn('Nexora direct Google login unavailable:',err);
    nexoraGoogleStatus('Google Sign-In is temporarily unavailable. Email sign-in still works.');
  }
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',nexoraInitDirectGoogle,{once:true});
else nexoraInitDirectGoogle();

/* Load account cloud-sync layer after the base portal is ready. */
if(!document.querySelector('link[data-nexora-cloud-style]')){
  const style=document.createElement('link');
  style.rel='stylesheet';
  style.href='portal-cloud.css';
  style.dataset.nexoraCloudStyle='1';
  document.head.appendChild(style);
}
if(!document.querySelector('script[data-nexora-cloud]')){
  const cloud=document.createElement('script');
  cloud.src='portal-cloud.js';
  cloud.defer=true;
  cloud.dataset.nexoraCloud='1';
  document.body.appendChild(cloud);
}
