/* Nexora Digital public-header auth state */
(function initHeaderAuth(){
  if(!window.supabase)return;

  const loginLink=document.querySelector('#navLinks a[href="learn.html"]');
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
        window.location.replace('./index.html');
      };
      loginLink.addEventListener('click',logoutHandler);
    }else{
      loginLink.textContent='Login';
      loginLink.href='learn.html';
      loginLink.setAttribute('aria-label','Login to Nexora Digital');
    }
  }

  client.auth.getSession().then(({data})=>render(data?.session||null));
  client.auth.onAuthStateChange((_event,session)=>render(session));
})();
