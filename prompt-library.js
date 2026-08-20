(()=>{
  const input=document.getElementById('promptSearch');
  const count=document.getElementById('promptCount');
  const empty=document.getElementById('promptEmpty');
  const cards=[...document.querySelectorAll('.prompt-card')];
  const chips=[...document.querySelectorAll('.filter-chip')];
  if(!cards.length)return;
  let active='all';
  function apply(){
    const q=(input?.value||'').trim().toLowerCase();
    let shown=0;
    cards.forEach(card=>{
      const category=(card.dataset.category||'').toLowerCase();
      const title=(card.dataset.title||'').toLowerCase();
      const body=(card.dataset.prompt||'').toLowerCase();
      const categoryOK=active==='all'||category===active;
      const searchOK=!q||title.includes(q)||category.replaceAll('-',' ').includes(q)||body.includes(q);
      const yes=categoryOK&&searchOK;
      card.style.display=yes?'block':'none';
      if(yes)shown++;
    });
    if(count)count.textContent=String(shown);
    empty?.classList.toggle('hidden',shown!==0);
  }
  chips.forEach(chip=>chip.addEventListener('click',()=>{active=chip.dataset.filter||'all';apply()}));
  input?.addEventListener('input',apply);
  input?.addEventListener('search',apply);
  apply();
})();