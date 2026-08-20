const menuToggle=document.getElementById('menuToggle');
const navLinks=document.getElementById('navLinks');
if(menuToggle&&navLinks){
  menuToggle.addEventListener('click',()=>navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('open')));
}

const togglePassword=document.getElementById('togglePassword');
const password=document.getElementById('password');
if(togglePassword&&password){
  togglePassword.addEventListener('click',()=>{
    const show=password.type==='password';
    password.type=show?'text':'password';
    togglePassword.textContent=show?'◌':'◉';
    togglePassword.setAttribute('aria-label',show?'Hide password':'Show password');
  });
}
