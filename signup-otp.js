/* Nexora DIGI signup verification: email + password -> 8-digit email OTP -> set password -> verified account. */
(function initSignupOtp(){
  const form=document.getElementById('emailSignupForm');
  const signupBox=document.getElementById('signupBox');
  const msg=document.getElementById('signupMessage');
  if(!form||!signupBox)return;

  let signupEmail='';
  let signupName='';
  let signupPassword='';
  const authClient=typeof sb!=='undefined'?sb:null;
  if(!authClient)return;

  const verifyStep=document.createElement('div');
  verifyStep.id='signupVerifyStep';
  verifyStep.className='hidden';
  verifyStep.innerHTML=`
    <span class="section-kicker">VERIFY EMAIL</span>
    <h2>Enter verification code</h2>
    <p class="portal-status" style="margin-top:0">We sent an 8-digit code to <strong id="signupVerifyEmail"></strong>.</p>
    <form class="auth-form" id="signupVerifyForm">
      <label>Verification code
        <input id="signupVerifyCode" type="text" inputmode="numeric" autocomplete="one-time-code" maxlength="8" pattern="[0-9]{8}" placeholder="8-digit code" required>
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

  async function sendSignupCode(){
    return authClient.auth.signInWithOtp({
      email:signupEmail,
      options:{
        shouldCreateUser:true,
        data:{full_name:signupName}
      }
    });
  }

  form.addEventListener('submit',async e=>{
    e.preventDefault();
    e.stopImmediatePropagation();

    signupName=document.getElementById('signupName')?.value.trim()||'';
    signupEmail=document.getElementById('signupEmail')?.value.trim()||'';
    signupPassword=document.getElementById('signupPassword')?.value||'';

    if(!signupEmail||signupPassword.length<6)return;
    if(msg)msg.textContent='Sending verification code…';

    const {error}=await sendSignupCode();
    if(error){if(msg)msg.textContent=error.message;return}

    if(msg)msg.textContent='';
    showVerifyStep(signupEmail);
  },true);

  document.getElementById('signupVerifyForm')?.addEventListener('submit',async e=>{
    e.preventDefault();
    const code=(document.getElementById('signupVerifyCode')?.value||'').trim();
    const verifyMsg=document.getElementById('signupVerifyMessage');

    if(!/^\d{8}$/.test(code)){
      if(verifyMsg)verifyMsg.textContent='Enter the 8-digit verification code.';
      return;
    }
    if(!signupEmail||!signupPassword)return;

    if(verifyMsg)verifyMsg.textContent='Verifying code…';
    const {data,error}=await authClient.auth.verifyOtp({
      email:signupEmail,
      token:code,
      type:'email'
    });

    if(error){if(verifyMsg)verifyMsg.textContent=error.message;return}
    if(!data?.session){if(verifyMsg)verifyMsg.textContent='Verification succeeded, but no session was created.';return}

    const {error:updateError}=await authClient.auth.updateUser({
      password:signupPassword,
      data:{full_name:signupName}
    });

    if(updateError){if(verifyMsg)verifyMsg.textContent=updateError.message;return}

    signupPassword='';
    if(verifyMsg)verifyMsg.textContent='Account verified ✓';
    setTimeout(()=>location.reload(),350);
  });

  document.getElementById('signupResendCode')?.addEventListener('click',async()=>{
    const verifyMsg=document.getElementById('signupVerifyMessage');
    if(!signupEmail)return;
    if(verifyMsg)verifyMsg.textContent='Sending a new code…';
    const {error}=await sendSignupCode();
    if(verifyMsg)verifyMsg.textContent=error?error.message:'A new verification code was sent ✓';
  });

  document.getElementById('signupChangeEmail')?.addEventListener('click',()=>{
    signupPassword='';
    showSignupStep();
  });
})();

/* Reliable password login after reset.
   Replace the original login form to remove the older submit listener and prevent browsers
   from silently reusing a stale saved password after the student changes it. */
(function initReliableLogin(){
  const oldForm=document.getElementById('emailLoginForm');
  const authClient=typeof sb!=='undefined'?sb:null;
  if(!oldForm||!authClient)return;

  const form=oldForm.cloneNode(true);
  oldForm.replaceWith(form);

  const email=form.querySelector('#loginEmail');
  const password=form.querySelector('#loginPassword');
  const button=form.querySelector('button[type="submit"]');
  const msg=document.getElementById('loginMessage');
  if(!email||!password)return;

  form.setAttribute('autocomplete','off');
  password.setAttribute('autocomplete','off');
  password.setAttribute('data-lpignore','true');
  password.setAttribute('data-1p-ignore','true');

  let userEditedPassword=false;
  password.addEventListener('input',()=>{userEditedPassword=true});

  function clearStalePassword(){
    if(userEditedPassword||document.activeElement===password)return;
    password.value='';
  }

  clearStalePassword();
  setTimeout(clearStalePassword,120);
  setTimeout(clearStalePassword,650);
  window.addEventListener('pageshow',()=>setTimeout(clearStalePassword,50));

  form.addEventListener('submit',async e=>{
    e.preventDefault();
    e.stopImmediatePropagation();

    const loginEmail=email.value.trim();
    const loginPassword=password.value;
    if(!loginEmail||!loginPassword)return;

    if(button){button.disabled=true;button.textContent='Signing in…'}
    if(msg)msg.textContent='';

    const {error}=await authClient.auth.signInWithPassword({
      email:loginEmail,
      password:loginPassword
    });

    if(error){
      if(button){button.disabled=false;button.textContent='Sign In'}
      if(error.code==='invalid_credentials'||/invalid login credentials/i.test(error.message||'')){
        password.value='';
        userEditedPassword=false;
        if(msg)msg.textContent='Incorrect email or password. Type your latest password. If you recently reset it, do not use the browser-saved password.';
        password.focus();
      }else if(msg){
        msg.textContent=error.message||'Unable to sign in.';
      }
      return;
    }

    if(msg)msg.textContent='Signed in successfully ✓';
    window.location.replace('./learn.html?login=1&signed=1');
  },true);
})();
