/* Nexora DIGI signup verification: email + password -> 6-digit signup code -> verified account. */
(function initSignupOtp(){
  const form=document.getElementById('emailSignupForm');
  const signupBox=document.getElementById('signupBox');
  const msg=document.getElementById('signupMessage');
  if(!form||!signupBox)return;

  let signupEmail='';
  const authClient=typeof sb!=='undefined'?sb:null;
  if(!authClient)return;

  const verifyStep=document.createElement('div');
  verifyStep.id='signupVerifyStep';
  verifyStep.className='hidden';
  verifyStep.innerHTML=`
    <span class="section-kicker">VERIFY EMAIL</span>
    <h2>Enter verification code</h2>
    <p class="portal-status" style="margin-top:0">We sent a 6-digit code to <strong id="signupVerifyEmail"></strong>.</p>
    <form class="auth-form" id="signupVerifyForm">
      <label>Verification code
        <input id="signupVerifyCode" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" placeholder="6-digit code" required>
      </label>
      <button class="auth-btn" type="submit">Verify account</button>
    </form>
    <p id="signupVerifyMessage" class="portal-status"></p>
    <div class="auth-switch" style="display:flex;gap:16px;justify-content:center;flex-wrap:wrap">
      <button id="signupResendCode" type="button">Resend code</button>
      <button id="signupChangeEmail" type="button">Change email</button>
    </div>`;
  signupBox.parentNode.insertBefore(verifyStep,signupBox.nextSibling);

  function showVerifyStep(email){
    signupEmail=email;
    signupBox.classList.add('hidden');
    verifyStep.classList.remove('hidden');
    const out=document.getElementById('signupVerifyEmail');
    if(out)out.textContent=email;
    const code=document.getElementById('signupVerifyCode');
    if(code){code.value='';setTimeout(()=>code.focus(),30)}
  }

  function showSignupStep(){
    verifyStep.classList.add('hidden');
    signupBox.classList.remove('hidden');
    const verifyMsg=document.getElementById('signupVerifyMessage');
    if(verifyMsg)verifyMsg.textContent='';
  }

  form.addEventListener('submit',async e=>{
    e.preventDefault();
    e.stopImmediatePropagation();
    const name=document.getElementById('signupName')?.value.trim()||'';
    const email=document.getElementById('signupEmail')?.value.trim()||'';
    const password=document.getElementById('signupPassword')?.value||'';
    if(!email||password.length<6)return;
    if(msg)msg.textContent='Sending verification code…';

    const {data,error}=await authClient.auth.signUp({
      email,
      password,
      options:{data:{full_name:name}}
    });

    if(error){if(msg)msg.textContent=error.message;return}
    if(msg)msg.textContent='';

    if(data?.session){
      location.reload();
      return;
    }
    showVerifyStep(email);
  },true);

  document.getElementById('signupVerifyForm')?.addEventListener('submit',async e=>{
    e.preventDefault();
    const code=(document.getElementById('signupVerifyCode')?.value||'').trim();
    const verifyMsg=document.getElementById('signupVerifyMessage');
    if(!/^\d{6}$/.test(code)){
      if(verifyMsg)verifyMsg.textContent='Enter the 6-digit verification code.';
      return;
    }
    if(!signupEmail)return;
    if(verifyMsg)verifyMsg.textContent='Verifying code…';
    const {data,error}=await authClient.auth.verifyOtp({
      email:signupEmail,
      token:code,
      type:'signup'
    });
    if(error){if(verifyMsg)verifyMsg.textContent=error.message;return}
    if(verifyMsg)verifyMsg.textContent='Email verified ✓';
    if(data?.session){setTimeout(()=>location.reload(),350)}
  });

  document.getElementById('signupResendCode')?.addEventListener('click',async()=>{
    const verifyMsg=document.getElementById('signupVerifyMessage');
    if(!signupEmail)return;
    if(verifyMsg)verifyMsg.textContent='Sending a new code…';
    const {error}=await authClient.auth.resend({type:'signup',email:signupEmail});
    if(verifyMsg)verifyMsg.textContent=error?error.message:'A new verification code was sent ✓';
  });

  document.getElementById('signupChangeEmail')?.addEventListener('click',showSignupStep);
})();
