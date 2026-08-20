/* Nexora Digital entry/auth routing */
(function initHeaderAuth(){
  if(!window.supabase)return;

  const LOGIN_URL='./learn.html?login=1';

  /* Opening the public root should enter through the student login screen.
     Signed-in users will automatically see their portal on learn.html. */
  const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  if(current==='index.html'||current===''){
    window.location.replace(LOGIN_URL);
    return;
  }

  const loginLink=document.querySelector('#navLinks a[href^="learn.html"]');
  if(!loginLink)return;

  const client=window.supabase.createClient(
    'https://lzzujiyiltwfrvcwnrlh.supabase.co',
    'sb_publishable_Ui-w7uI27X5dEybtGozMTA_kuFyfM2R',
    {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}
  );

  let logoutHandler=null;

  function render(session){
    if(logoutHandler){
      loginLink.removeEventListener('click',logoutHandler);
      logoutHandler=null;
    }

    if(session?.user){
      loginLink.textContent='Sign out';
      loginLink.href='#';
      loginLink.setAttribute('aria-label','Sign out of Nexora Digital');
      logoutHandler=async event=>{
        event.preventDefault();
        loginLink.textContent='Signing out…';
        const {error}=await client.auth.signOut();
        if(error){
          loginLink.textContent='Sign out';
          return;
        }
        window.location.replace(LOGIN_URL);
      };
      loginLink.addEventListener('click',logoutHandler);
    }else{
      loginLink.textContent='Login';
      loginLink.href='learn.html?login=1';
      loginLink.setAttribute('aria-label','Login to Nexora Digital');
    }
  }

  client.auth.getSession().then(({data})=>render(data?.session||null));
  client.auth.onAuthStateChange((_event,session)=>render(session));
})();
