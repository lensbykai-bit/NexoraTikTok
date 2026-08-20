(()=>{
  const API='https://bcvtkdehflmqiyvloyiy.supabase.co/rest/v1/nexora_prompts';
  const KEY='sb_publishable_KgISTJ7-YKktjQXw3u0yuQ_KG6H1bFa';
  const input=document.getElementById('promptSearch');
  const count=document.getElementById('promptCount');
  const empty=document.getElementById('promptEmpty');
  const grid=document.getElementById('promptGrid');
  const toolbar=document.getElementById('promptToolbar');
  const status=document.getElementById('promptLibraryStatus');
  const modal=document.getElementById('promptModal');
  const modalTitle=document.getElementById('modalTitle');
  const modalCategory=document.getElementById('modalCategory');
  const modalPrompt=document.getElementById('modalPrompt');
  const modalMedia=document.getElementById('promptModalMedia')||document.querySelector('.prompt-modal-media');
  if(!grid)return;
  let prompts=[],active='all',activePrompt='';
  const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const slug=v=>String(v||'').trim().toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

  function buildToolbar(){
    const categories=[...new Set(prompts.map(p=>p.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
    toolbar.innerHTML='<button class="filter-chip active" data-filter="all">ALL</button>'+categories.map(c=>`<button class="filter-chip" data-filter="${esc(slug(c))}">${esc(c)}</button>`).join('');
    toolbar.querySelectorAll('.filter-chip').forEach(btn=>btn.addEventListener('click',()=>{
      toolbar.querySelectorAll('.filter-chip').forEach(x=>x.classList.remove('active'));
      btn.classList.add('active');active=btn.dataset.filter||'all';render();
    }));
  }

  function mediaHTML(p){
    const src=(p.image_url||'').trim();
    if(!src)return '<div class="prompt-media">CLICK TO VIEW</div>';
    return `<div class="prompt-media prompt-media-image" style="background-image:url('${esc(src)}')"><span>CLICK TO VIEW</span></div>`;
  }

  function openPrompt(p){
    activePrompt=p.prompt_text||'';
    if(modalTitle)modalTitle.textContent=p.title||'Prompt';
    if(modalCategory)modalCategory.textContent=p.category||'PROMPT';
    if(modalPrompt)modalPrompt.textContent=activePrompt;
    if(modalMedia){
      const src=(p.image_url||'').trim();
      modalMedia.style.backgroundImage=src?`url("${src.replace(/"/g,'')}")`:'';
      modalMedia.style.backgroundSize=src?'cover':'';
      modalMedia.style.backgroundPosition=src?'center':'';
      modalMedia.textContent=src?'':'PROMPT PREVIEW';
    }
    modal?.classList.add('open');document.body.style.overflow='hidden';
  }

  function wireCopy(){
    let old=document.getElementById('copyPrompt');
    let btn;
    if(old){btn=old.cloneNode(true);old.replaceWith(btn)}else if(modalPrompt){btn=document.createElement('button');btn.id='copyPrompt';btn.className='prompt-copy';btn.type='button';btn.textContent='Copy prompt';modalPrompt.insertAdjacentElement('afterend',btn)}
    btn?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(activePrompt);window.toast?.('Prompt copied ✓')}catch{window.toast?.('Copy was blocked by the browser')}});
  }

  function render(){
    const q=(input?.value||'').trim().toLowerCase();
    const rows=prompts.filter(p=>{
      const cat=slug(p.category),hay=`${p.title||''} ${p.category||''} ${p.prompt_text||''}`.toLowerCase();
      return (active==='all'||cat===active)&&(!q||hay.includes(q));
    });
    grid.innerHTML=rows.map(p=>`<article class="prompt-card" tabindex="0" role="button" data-id="${p.id}">${mediaHTML(p)}<div class="prompt-body"><small>${esc(p.category)}</small><h3>${esc(p.title)}</h3></div></article>`).join('');
    if(count)count.textContent=String(rows.length);
    empty?.classList.toggle('hidden',rows.length!==0);
    grid.querySelectorAll('.prompt-card').forEach(card=>{
      const p=prompts.find(x=>String(x.id)===card.dataset.id);if(!p)return;
      card.addEventListener('click',()=>openPrompt(p));
      card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openPrompt(p)}});
    });
  }

  async function load(){
    if(status)status.textContent='Loading prompt library…';
    try{
      const url=`${API}?select=id,slug,title,category,prompt_text,image_url,sort_order&is_active=eq.true&order=sort_order.asc,created_at.asc`;
      const res=await fetch(url,{headers:{apikey:KEY}});
      if(!res.ok)throw new Error(`Prompt library request failed (${res.status})`);
      prompts=await res.json();
      if(status)status.textContent=`Live library · ${prompts.length} prompts`;
      buildToolbar();render();wireCopy();
    }catch(err){
      console.error(err);prompts=[];if(status)status.textContent='Prompt library is temporarily unavailable. Please try again shortly.';render();
    }
  }
  input?.addEventListener('input',render);input?.addEventListener('search',render);
  load();
})();