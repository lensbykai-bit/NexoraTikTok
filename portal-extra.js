const forgotBtn=document.getElementById('forgotPassword');
const recoveryBox=document.getElementById('recoveryBox');
const loginBoxExtra=document.getElementById('loginBox');
const signupBoxExtra=document.getElementById('signupBox');
const resetBox=document.getElementById('resetBox');

/* Keep student authentication intentionally simple: email + password only. */
(function simplifyStudentAuth(){
  document.getElementById('googleLogin')?.remove();
  document.getElementById('googleSignup')?.remove();
  document.querySelectorAll('#loginBox .divider,#signupBox .divider').forEach(el=>el.remove());
  const loginIntro=document.querySelector('#loginBox h2 + p');
  const signupIntro=document.querySelector('#signupBox h2 + p');
  loginIntro?.remove();
  signupIntro?.remove();
})();

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
