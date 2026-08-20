const NEXORA_SUPABASE_URL='https://lzzujiyiltwfrvcwnrlh.supabase.co';
const NEXORA_SUPABASE_KEY='sb_publishable_Ui-w7uI27X5dEybtGozMTA_kuFyfM2R';

const nexoraSupabase=window.supabase?.createClient(NEXORA_SUPABASE_URL,NEXORA_SUPABASE_KEY,{
  auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
});
window.nexoraSupabase=nexoraSupabase;

function setAuthMessage(message,type='info'){
  const el=document.getElementById('loginMessage'); if(!el)return;
  el.textContent=message||''; el.classList.toggle('show',Boolean(message)); el.dataset.type=type;
}
function setAuthBusy(busy,label){
  const btn=document.querySelector('.login-submit'); if(!btn)return;
  if(busy){btn.dataset.original=btn.textContent;btn.textContent=label||'Please wait…';btn.disabled=true;}
  else{btn.textContent=btn.dataset.original||'Sign In';btn.disabled=false;}
}
function getLoginMode(){return document.body.dataset.authMode||'login';}
function setLoginMode(mode){
  document.body.dataset.authMode=mode;
  const title=document.getElementById('authTitle'),subtitle=document.getElementById('authSubtitle'),nameWrap=document.getElementById('nameFieldWrap'),submit=document.querySelector('.login-submit'),switchText=document.getElementById('authSwitchText'),switchBtn=document.getElementById('authSwitchBtn'),forgot=document.getElementById('forgotPasswordBtn'),passwordLabel=document.getElementById('passwordLabelText'),password=document.getElementById('password'),confirmWrap=document.getElementById('confirmFieldWrap');
  setAuthMessage('');
  if(mode==='signup'){
    if(title)title.textContent='Create Account'; if(subtitle)subtitle.textContent='Create your Nexora student account.'; if(nameWrap)nameWrap.hidden=false; if(confirmWrap)confirmWrap.hidden=false; if(submit)submit.textContent='Create Account'; if(switchText)switchText.textContent='Already have an account?'; if(switchBtn){switchBtn.textContent='Sign In';switchBtn.hidden=false;} if(forgot)forgot.hidden=true; if(passwordLabel)passwordLabel.textContent='Password'; if(password)password.autocomplete='new-password';
  }else if(mode==='reset'){
    if(title)title.textContent='Set New Password'; if(subtitle)subtitle.textContent='Choose a new password for your account.'; if(nameWrap)nameWrap.hidden=true; if(confirmWrap)confirmWrap.hidden=false; if(submit)submit.textContent='Update Password'; if(switchText)switchText.textContent=''; if(switchBtn){switchBtn.textContent='';switchBtn.hidden=true;} if(forgot)forgot.hidden=true; if(passwordLabel)passwordLabel.textContent='New Password'; if(password)password.autocomplete='new-password';
  }else{
    if(title)title.textContent='Student Log In'; if(subtitle)subtitle.textContent='Enter your details below.'; if(nameWrap)nameWrap.hidden=true; if(confirmWrap)confirmWrap.hidden=true; if(submit)submit.textContent='Sign In'; if(switchText)switchText.textContent='New to Nexora?'; if(switchBtn){switchBtn.textContent='Create Account';switchBtn.hidden=false;} if(forgot)forgot.hidden=false; if(passwordLabel)passwordLabel.textContent='Password'; if(password)password.autocomplete='current-password';
  }
}

async function handleLoginPage(){
  if(!nexoraSupabase)return;
  const form=document.getElementById('loginForm'); if(!form)return;
  const params=new URLSearchParams(location.search);
  if(params.get('recovery')==='1')setLoginMode('reset');
  else if(params.get('mode')==='signup')setLoginMode('signup');
  else setLoginMode('login');
  const {data:{session}}=await nexoraSupabase.auth.getSession();
  if(session&&getLoginMode()==='login'){
    setAuthMessage(`Signed in as ${session.user.email}. You can continue to your private student area.`,'success');
    const submit=document.querySelector('.login-submit'); if(submit)submit.textContent='Continue'; form.dataset.session='active';
  }
  document.getElementById('authSwitchBtn')?.addEventListener('click',()=>setLoginMode(getLoginMode()==='signup'?'login':'signup'));
  document.getElementById('forgotPasswordBtn')?.addEventListener('click',async()=>{
    const email=document.getElementById('email')?.value.trim();
    if(!email){setAuthMessage('Enter your email first, then choose Forgot password.','error');return;}
    const redirectTo=`${location.origin}${location.pathname}?recovery=1`;
    const {error}=await nexoraSupabase.auth.resetPasswordForEmail(email,{redirectTo});
    setAuthMessage(error?error.message:'Password reset email sent. Check your inbox.',error?'error':'success');
  });
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    if(form.dataset.session==='active'){location.href='dashboard.html';return;}
    const mode=getLoginMode(),email=document.getElementById('email')?.value.trim(),password=document.getElementById('password')?.value||'',confirm=document.getElementById('confirmPassword')?.value||'',fullName=document.getElementById('fullName')?.value.trim()||'';
    if(!email||!password){setAuthMessage('Please enter your email and password.','error');return;}
    if((mode==='signup'||mode==='reset')&&password!==confirm){setAuthMessage('Passwords do not match.','error');return;}
    if(password.length<6){setAuthMessage('Password must be at least 6 characters.','error');return;}
    setAuthBusy(true,mode==='signup'?'Creating account…':mode==='reset'?'Updating password…':'Signing in…');
    try{
      if(mode==='signup'){
        const emailRedirectTo=`${location.origin}${location.pathname}`;
        const {data,error}=await nexoraSupabase.auth.signUp({email,password,options:{emailRedirectTo,data:{full_name:fullName}}});
        if(error)throw error;
        if(data.session){setAuthMessage('Account created. Opening your private student area…','success');setTimeout(()=>location.href='dashboard.html',650);}
        else{setAuthMessage('Account created. Check your email to confirm your account, then sign in.','success');setLoginMode('login');}
      }else if(mode==='reset'){
        const {error}=await nexoraSupabase.auth.updateUser({password}); if(error)throw error;
        setAuthMessage('Password updated. Opening your private student area…','success'); setTimeout(()=>location.href='dashboard.html',650);
      }else{
        const {error}=await nexoraSupabase.auth.signInWithPassword({email,password}); if(error)throw error;
        setAuthMessage('Signed in successfully. Opening your private student area…','success'); setTimeout(()=>location.href='dashboard.html',500);
      }
    }catch(err){setAuthMessage(err?.message||'Authentication failed. Please try again.','error');}
    finally{setAuthBusy(false);const submit=document.querySelector('.login-submit');if(submit&&mode==='signup')submit.textContent='Create Account';if(submit&&mode==='reset')submit.textContent='Update Password';}
  });
  nexoraSupabase.auth.onAuthStateChange(event=>{if(event==='PASSWORD_RECOVERY')setLoginMode('reset');});
}

async function updateHeaderAuth(){
  document.querySelectorAll('.nav-actions a[href="dashboard.html"]').forEach(link=>link.remove());
}
handleLoginPage();
updateHeaderAuth();
