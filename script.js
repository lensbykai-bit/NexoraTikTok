const menuToggle=document.getElementById('menuToggle');
const navLinks=document.getElementById('navLinks');
if(menuToggle&&navLinks){menuToggle.addEventListener('click',()=>navLinks.classList.toggle('open'));navLinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('open')))}

const togglePassword=document.getElementById('togglePassword');
const password=document.getElementById('password');
if(togglePassword&&password){togglePassword.addEventListener('click',()=>{const show=password.type==='password';password.type=show?'text':'password';togglePassword.textContent=show?'◌':'◉';togglePassword.setAttribute('aria-label',show?'Hide password':'Show password')})}

const loginForm=document.getElementById('loginForm');
const loginMessage=document.getElementById('loginMessage');
if(loginForm){loginForm.addEventListener('submit',e=>{e.preventDefault();if(loginMessage){loginMessage.textContent='Login design is ready. Secure account authentication will be connected to the backend next.';loginMessage.classList.add('show')}})}
