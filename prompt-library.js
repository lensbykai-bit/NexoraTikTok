(()=>{
  const input=document.getElementById('promptSearch');
  const count=document.getElementById('promptCount');
  const empty=document.getElementById('promptEmpty');
  const cards=[...document.querySelectorAll('.prompt-card')];
  const chips=[...document.querySelectorAll('.filter-chip')];
  const modalMedia=document.querySelector('.prompt-modal-media');
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

  function activateCardImage(card,index){
    const media=card.querySelector('.prompt-media');
    if(!media)return;
    const fallback=`images/prompts/prompt-${String(index+1).padStart(2,'0')}.jpg`;
    const src=card.dataset.image||fallback;
    const img=new Image();
    img.onload=()=>{
      card.dataset.loadedImage=src;
      media.textContent='';
      media.style.backgroundImage=`url("${src}")`;
      media.style.backgroundSize='cover';
      media.style.backgroundPosition='center';
    };
    img.onerror=()=>{
      delete card.dataset.loadedImage;
      media.style.backgroundImage='';
      if(!media.textContent.trim())media.textContent='CLICK TO VIEW';
    };
    img.src=src;
  }

  function syncModalImage(card){
    if(!modalMedia)return;
    const src=card.dataset.loadedImage;
    if(src){
      modalMedia.textContent='';
      modalMedia.style.backgroundImage=`url("${src}")`;
      modalMedia.style.backgroundSize='cover';
      modalMedia.style.backgroundPosition='center';
    }else{
      modalMedia.style.backgroundImage='';
      modalMedia.textContent='PROMPT PREVIEW';
    }
  }

  cards.forEach((card,index)=>{
    activateCardImage(card,index);
    card.addEventListener('click',()=>syncModalImage(card));
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')syncModalImage(card)});
  });

  chips.forEach(chip=>chip.addEventListener('click',()=>{active=chip.dataset.filter||'all';apply()}));
  input?.addEventListener('input',apply);
  input?.addEventListener('search',apply);
  apply();
})();