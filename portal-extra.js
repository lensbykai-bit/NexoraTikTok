const forgotBtn=document.getElementById('forgotPassword');
const recoveryBox=document.getElementById('recoveryBox');
const loginBoxExtra=document.getElementById('loginBox');
const signupBoxExtra=document.getElementById('signupBox');
const resetBox=document.getElementById('resetBox');
let recoveryEmail='';
let passwordResetMode=false;

/* Keep student authentication simple: email + password only. */
(function simplifyStudentAuth(){
  document.getElementById('googleLogin')?.remove();
  document.getElementById('googleSignup')?.remove();
  document.querySelectorAll('#loginBox .divider,#signupBox .divider').forEach(el=>el.remove());
  const loginIntro=document.querySelector('#loginBox h2 + p');
  const signupIntro=document.querySelector('#signupBox h2 + p');
  loginIntro?.remove();
  signupIntro?.remove();
})();

/* Password recovery uses the same 8-digit email OTP length configured in Nexora DIGI Auth. */
if(recoveryBox){
  recoveryBox.innerHTML=`
    <span class="section-kicker">PASSWORD RECOVERY</span>
    <h2>Reset your password</h2>
    <p id="recoveryIntro">Enter your account email and we will send a verification code.</p>

    <div id="recoveryEmailStep">
      <form class="auth-form" id="recoveryCodeRequestForm">
        <label>Email
          <input id="recoveryEmail" type="email" autocomplete="email" placeholder="you@example.com" required>
        </label>
        <button class="auth-btn" type="submit">Send verification code</button>
      </form>
      <p id="recoveryMessage" class="portal-status"></p>
      <div class="auth-switch"><button id="recoveryBack" type="button">← Back to sign in</button></div>
    </div>

    <div id="recoveryCodeStep" class="hidden">
      <p class="portal-status" style="margin-top:0">Code sent to <strong id="recoveryEmailDisplay"></strong></p>
      <form class="auth-form" id="recoveryVerifyForm">
        <label>Verification code
          <input id="recoveryCode" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="8" pattern="[0-9]{8}" placeholder="8-digit code" required>
        </label>
        <button class="auth-btn" type="submit">Verify code</button>
      </form>
      <p id="recoveryVerifyMessage" class="portal-status"></p>
      <div class="auth-switch" style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
        <button id="recoveryResend" type="button">Resend code</button>
        <button id="recoveryChangeEmail" type="button">Change email</button>
      </div>
    </div>`;
}

if(resetBox){
  const kicker=resetBox.querySelector('.section-kicker');
  const title=resetBox.querySelector('h2');
  const intro=resetBox.querySelector('h2 + p');
  if(kicker)kicker.textContent='VERIFIED ACCOUNT';
  if(title)title.textContent='Create a new password';
  if(intro)intro.textContent='Your verification code is confirmed. Choose a new password below.';
}

function showLoginFromRecovery(){
  passwordResetMode=false;
  recoveryEmail='';
  recoveryBox?.classList.add('hidden');
  resetBox?.classList.add('hidden');
  signupBoxExtra?.classList.add('hidden');
  loginBoxExtra?.classList.remove('hidden');
}

function forceResetUi(){
  if(!passwordResetMode)return;
  document.getElementById('authPage')?.style.setProperty('display','grid');
  document.getElementById('portal')?.classList.remove('show');
  loginBoxExtra?.classList.add('hidden');
  signupBoxExtra?.classList.add('hidden');
  recoveryBox?.classList.add('hidden');
  resetBox?.classList.remove('hidden');
}

forgotBtn?.addEventListener('click',()=>{
  passwordResetMode=false;
  loginBoxExtra?.classList.add('hidden');
  signupBoxExtra?.classList.add('hidden');
  resetBox?.classList.add('hidden');
  recoveryBox?.classList.remove('hidden');
  document.getElementById('recoveryEmailStep')?.classList.remove('hidden');
  document.getElementById('recoveryCodeStep')?.classList.add('hidden');
  const msg=document.getElementById('recoveryMessage');
  if(msg)msg.textContent='';
});

document.getElementById('recoveryBack')?.addEventListener('click',showLoginFromRecovery);
document.getElementById('recoveryChangeEmail')?.addEventListener('click',()=>{
  document.getElementById('recoveryCodeStep')?.classList.add('hidden');
  document.getElementById('recoveryEmailStep')?.classList.remove('hidden');
  const code=document.getElementById('recoveryCode');
  if(code)code.value='';
});

async function sendRecoveryCode(){
  const msg=document.getElementById('recoveryMessage');
  const verifyMsg=document.getElementById('recoveryVerifyMessage');
  if(!sb||!recoveryEmail)return false;
  if(msg)msg.textContent='Sending verification code…';
  if(verifyMsg)verifyMsg.textContent='';
  const {error}=await sb.auth.signInWithOtp({
    email:recoveryEmail,
    options:{shouldCreateUser:false}
  });
  if(error){
    if(msg)msg.textContent=error.message;
    return false;
  }
  if(msg)msg.textContent='Verification code sent ✓';
  document.getElementById('recoveryEmailStep')?.classList.add('hidden');
  document.getElementById('recoveryCodeStep')?.classList.remove('hidden');
  const display=document.getElementById('recoveryEmailDisplay');
  if(display)display.textContent=recoveryEmail;
  document.getElementById('recoveryCode')?.focus();
  return true;
}

document.getElementById('recoveryCodeRequestForm')?.addEventListener('submit',async e=>{
  e.preventDefault();
  recoveryEmail=document.getElementById('recoveryEmail')?.value.trim()||'';
  if(!recoveryEmail)return;
  await sendRecoveryCode();
});

document.getElementById('recoveryResend')?.addEventListener('click',async()=>{
  const msg=document.getElementById('recoveryVerifyMessage');
  if(msg)msg.textContent='Sending a new code…';
  const ok=await sendRecoveryCode();
  if(ok&&msg)msg.textContent='A new verification code was sent ✓';
});

document.getElementById('recoveryVerifyForm')?.addEventListener('submit',async e=>{
  e.preventDefault();
  const code=(document.getElementById('recoveryCode')?.value||'').trim();
  const msg=document.getElementById('recoveryVerifyMessage');
  if(!sb||!recoveryEmail)return;
  if(!/^\d{8}$/.test(code)){
    if(msg)msg.textContent='Enter the 8-digit verification code.';
    return;
  }
  if(msg)msg.textContent='Verifying code…';
  passwordResetMode=true;
  const {error}=await sb.auth.verifyOtp({email:recoveryEmail,token:code,type:'email'});
  if(error){
    passwordResetMode=false;
    if(msg)msg.textContent=error.message;
    return;
  }
  if(msg)msg.textContent='Code verified ✓';
  forceResetUi();
  setTimeout(forceResetUi,80);
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
  if(error){if(msg)msg.textContent=error.message;return}
  if(msg)msg.textContent='Password updated ✓ Redirecting to homepage…';
  passwordResetMode=false;
  window.location.replace('./index.html?password=updated');
});

if(sb){
  sb.auth.onAuthStateChange(()=>{
    if(passwordResetMode){
      forceResetUi();
      setTimeout(forceResetUi,0);
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
