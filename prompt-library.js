(()=>{
  const API='https://bcvtkdehflmqiyvloyiy.supabase.co/rest/v1/nexora_prompts';
  const KEY='sb_publishable_KgISTJ7-YKktjQXw3u0yuQ_KG6H1bFa';
  const PAGE_SIZE=8;
  const input=document.getElementById('promptSearch');
  const clearBtn=document.getElementById('promptClear');
  const count=document.getElementById('promptCount');
  const empty=document.getElementById('promptEmpty');
  const grid=document.getElementById('promptGrid');
  const toolbar=document.getElementById('promptToolbar');
  const status=document.getElementById('promptLibraryStatus');
  const showMore=document.getElementById('promptShowMore');
  const retry=document.getElementById('promptRetry');
  const modal=document.getElementById('promptModal');
  const modalTitle=document.getElementById('modalTitle');
  const modalCategory=document.getElementById('modalCategory');
  const modalPrompt=document.getElementById('modalPrompt');
  const modalMedia=document.getElementById('promptModalMedia')||document.querySelector('.prompt-modal-media');
  if(!grid)return;
  let prompts=[],active='all',activePrompt='',visibleCount=PAGE_SIZE,failed=false;
  const esc=v=>String(v??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
  const slug=v=>String(v||'').trim().toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const safeSrc=v=>{const s=String(v||'').trim();return /^(https?:\/\/|images\/|assets\/)/i.test(s)?s:''};

  function buildToolbar(){
    const categories=[...new Set(prompts.map(p=>p.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
    toolbar.innerHTML='<button class="filter-chip active" data-filter="all" aria-pressed="true">ALL</button>'+categories.map(c=>`<button class="filter-chip" data-filter="${esc(slug(c))}" aria-pressed="false">${esc(c)}</button>`).join('');
    toolbar.querySelectorAll('.filter-chip').forEach(btn=>btn.addEventListener('click',()=>{
      toolbar.querySelectorAll('.filter-chip').forEach(x=>{x.classList.remove('active');x.setAttribute('aria-pressed','false')});
      btn.classList.add('active');btn.setAttribute('aria-pressed','true');active=btn.dataset.filter||'all';visibleCount=PAGE_SIZE;render();
    }));
  }

  function placeholder(index){return `<div class="prompt-media prompt-media-placeholder"><span class="prompt-slot">${String(index+1).padStart(2,'0')}</span><div><b>IMAGE SLOT</b><small>Add preview later</small></div><em>VIEW PROMPT</em></div>`}
  function mediaHTML(p,index){
    const src=safeSrc(p.image_url);
    if(!src)return placeholder(index);
    return `<div class="prompt-media prompt-media-image"><img src="${esc(src)}" alt="Preview for ${esc(p.title||'prompt')}" loading="lazy" decoding="async"><span>VIEW PROMPT</span></div>`;
  }
  function modalPlaceholder(p){return `<div class="prompt-modal-placeholder"><span>N</span><div><b>IMAGE PREVIEW COMING SOON</b><small>${esc(p.title||'Prompt')}</small></div></div>`}

  function openPrompt(p){
    activePrompt=p.prompt_text||'';
    if(modalTitle)modalTitle.textContent=p.title||'Prompt';
    if(modalCategory)modalCategory.textContent=p.category||'PROMPT';
    if(modalPrompt)modalPrompt.textContent=activePrompt;
    if(modalMedia){
      const src=safeSrc(p.image_url);
      modalMedia.innerHTML=src?`<img src="${esc(src)}" alt="Preview for ${esc(p.title||'prompt')}">`:modalPlaceholder(p);
      const img=modalMedia.querySelector('img');if(img)img.addEventListener('error',()=>{modalMedia.innerHTML=modalPlaceholder(p)},{once:true});
    }
    modal?.classList.add('open');document.body.style.overflow='hidden';
  }

  function wireCopy(){
    let old=document.getElementById('copyPrompt'),btn;
    if(old){btn=old.cloneNode(true);old.replaceWith(btn)}else if(modalPrompt){btn=document.createElement('button');btn.id='copyPrompt';btn.className='prompt-copy';btn.type='button';btn.textContent='Copy prompt';modalPrompt.insertAdjacentElement('afterend',btn)}
    btn?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(activePrompt);window.toast?.('Prompt copied ✓')}catch{window.toast?.('Copy was blocked by the browser')}});
  }

  function filtered(){const q=(input?.value||'').trim().toLowerCase();return prompts.filter(p=>{const cat=slug(p.category),hay=`${p.title||''} ${p.category||''} ${p.prompt_text||''}`.toLowerCase();return (active==='all'||cat===active)&&(!q||hay.includes(q))})}
  function render(){
    const rows=filtered(),shown=rows.slice(0,visibleCount);
    grid.innerHTML=shown.map((p,i)=>`<article class="prompt-card" tabindex="0" role="button" aria-label="Open prompt: ${esc(p.title||'Prompt')}" data-id="${p.id}">${mediaHTML(p,i)}<div class="prompt-body"><small>${esc(p.category)}</small><h3>${esc(p.title)}</h3><span>Open prompt →</span></div></article>`).join('');
    grid.querySelectorAll('.prompt-media-image img').forEach(img=>img.addEventListener('error',()=>{const card=img.closest('.prompt-card'),p=prompts.find(x=>String(x.id)===card?.dataset.id),idx=[...grid.children].indexOf(card);img.closest('.prompt-media').outerHTML=placeholder(Math.max(0,idx));if(p)p.image_url=''} ,{once:true}));
    if(count)count.textContent=String(rows.length);
    empty?.classList.toggle('hidden',rows.length!==0||failed);
    showMore?.classList.toggle('hidden',shown.length>=rows.length||rows.length===0);
    if(showMore)showMore.textContent=`Show more prompts · ${rows.length-shown.length} remaining`;
    clearBtn?.classList.toggle('hidden',!(input?.value||'').trim());
    grid.querySelectorAll('.prompt-card').forEach(card=>{const p=prompts.find(x=>String(x.id)===card.dataset.id);if(!p)return;card.addEventListener('click',()=>openPrompt(p));card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openPrompt(p)}})});
  }

  async function load(){
    failed=false;retry?.classList.add('hidden');if(status)status.textContent='Loading prompt library…';grid.setAttribute('aria-busy','true');
    try{
      const url=`${API}?select=id,slug,title,category,prompt_text,image_url,sort_order&is_active=eq.true&order=sort_order.asc,created_at.asc`;
      const res=await fetch(url,{headers:{apikey:KEY}});if(!res.ok)throw new Error(`Prompt library request failed (${res.status})`);
      prompts=await res.json();visibleCount=PAGE_SIZE;if(status)status.textContent=`Live library · ${prompts.length} prompt${prompts.length===1?'':'s'} available`;buildToolbar();render();wireCopy();
    }catch(err){console.error(err);prompts=[];failed=true;if(status)status.textContent='Prompt library is temporarily unavailable.';grid.innerHTML='<div class="prompt-load-error"><strong>Could not load the prompt library.</strong><span>Your connection or the content service may be temporarily unavailable.</span></div>';retry?.classList.remove('hidden');showMore?.classList.add('hidden');if(count)count.textContent='0'}finally{grid.setAttribute('aria-busy','false')}
  }
  input?.addEventListener('input',()=>{visibleCount=PAGE_SIZE;render()});input?.addEventListener('search',()=>{visibleCount=PAGE_SIZE;render()});
  clearBtn?.addEventListener('click',()=>{if(input){input.value='';input.focus()}visibleCount=PAGE_SIZE;render()});
  showMore?.addEventListener('click',()=>{visibleCount+=PAGE_SIZE;render();showMore?.focus()});retry?.addEventListener('click',load);
  load();
})();