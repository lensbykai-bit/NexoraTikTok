const modal = document.getElementById('trialModal');
const openBtn = document.getElementById('openTrial');
const closeBtn = document.getElementById('closeTrial');
const startBtn = document.getElementById('startTrial');
const toast = document.getElementById('toast');

function showModal(){ modal.classList.add('show'); }
function hideModal(){ modal.classList.remove('show'); }
function showToast(text){ toast.textContent=text; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),1800); }

openBtn?.addEventListener('click', showModal);
closeBtn?.addEventListener('click', hideModal);
modal?.addEventListener('click', e=>{ if(e.target===modal) hideModal(); });
startBtn?.addEventListener('click', ()=>{ hideModal(); showToast('Free preview started — demo'); });

document.querySelectorAll('.nav-item').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active');
}));
