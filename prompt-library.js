(()=>{
  const API='https://bcvtkdehflmqiyvloyiy.supabase.co/rest/v1/nexora_prompts';
  const KEY='sb_publishable_KgISTJ7-YKktjQXw3u0yuQ_KG6H1bFa';
  const PAGE_SIZE=8;

  const input=document.getElementById('promptSearch');
  const clearBtn=document.getElementById('promptClear');
  const count=document.getElementById('promptCount');
  const empty=document.getElementById('promptEmpty');
  const grid=document.getElementById('promptGrid');
  const showMore=document.getElementById('promptShowMore');
  const retry=document.getElementById('promptRetry');
  const modal=document.getElementById('promptModal');
  const closeBtn=document.getElementById('closePromptModal');
  const modalTitle=document.getElementById('modalTitle');
  const modalCategory=document.getElementById('modalCategory');
  const modalPrompt=document.getElementById('modalPrompt');
  const modalMedia=document.getElementById('promptModalMedia')||document.querySelector('.prompt-modal-media');

  if(!grid)return;

  let prompts=[];
  let activePrompt='';
  let visibleCount=PAGE_SIZE;
  let failed=false;

  const esc=v=>String(v??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
  const safeSrc=v=>{const s=String(v||'').trim();return /^(https?:\/\/|images\/|assets\/)/i.test(s)?s:''};
  const isDirectUpload=p=>/^https?:\/\//i.test(String(p?.image_url||'').trim());

  function placeholder(index){
    return `<div class="prompt-media prompt-media-placeholder"><span class="prompt-slot">${String(index+1).padStart(2,'0')}</span><div><b>IMAGE SLOT</b><small>Add preview later</small></div><em>VIEW PROMPT</em></div>`;
  }

  function mediaHTML(p,index){
    const src=safeSrc(p.image_url);
    if(!src)return placeholder(index);
    return `<div class="prompt-media prompt-media-image"><img src="${esc(src)}" alt="Preview for ${esc(p.title||'prompt')}" loading="lazy" decoding="async"><span>VIEW PROMPT</span></div>`;
  }

  function modalPlaceholder(p){
    return `<div class="prompt-modal-placeholder"><span>N</span><div><b>IMAGE PREVIEW COMING SOON</b><small>${esc(p.title||'Prompt')}</small></div></div>`;
  }

  function openPrompt(p){
    if(!p||!modal)return;
    activePrompt=p.prompt_text||'';
    if(modalTitle)modalTitle.textContent=p.title||'Prompt';
    if(modalCategory)modalCategory.textContent=p.category||'PROMPT';
    if(modalPrompt)modalPrompt.textContent=activePrompt;

    if(modalMedia){
      const src=safeSrc(p.image_url);
      modalMedia.innerHTML=src
        ? `<img src="${esc(src)}" alt="Preview for ${esc(p.title||'prompt')}">`
        : modalPlaceholder(p);
      const img=modalMedia.querySelector('img');
      if(img)img.addEventListener('error',()=>{modalMedia.innerHTML=modalPlaceholder(p)},{once:true});
    }

    modal.classList.add('open');
    document.body.style.overflow='hidden';
    closeBtn?.focus({preventScroll:true});
  }

  function closePrompt(){
    if(!modal)return;
    modal.classList.remove('open');
    document.body.style.overflow='';
  }

  function ensureCopyButton(){
    if(!modalPrompt)return;
    let btn=document.getElementById('copyPrompt');
    if(!btn){
      btn=document.createElement('button');
      btn.id='copyPrompt';
      btn.className='prompt-copy';
      btn.type='button';
      btn.textContent='Copy prompt';
      modalPrompt.insertAdjacentElement('afterend',btn);
    }
    btn.onclick=async()=>{
      try{
        await navigator.clipboard.writeText(activePrompt);
        window.toast?.('Prompt copied ✓');
      }catch{
        window.toast?.('Copy was blocked by the browser');
      }
    };
  }

  function filtered(){
    const q=(input?.value||'').trim().toLowerCase();
    return prompts.filter(p=>{
      const hay=`${p.title||''} ${p.category||''} ${p.prompt_text||''}`.toLowerCase();
      return !q||hay.includes(q);
    });
  }

  function render(){
    const rows=filtered();
    const shown=rows.slice(0,visibleCount);

    grid.innerHTML=shown.map((p,i)=>`
      <article class="prompt-card" tabindex="0" role="button" aria-label="Open prompt: ${esc(p.title||'Prompt')}" data-id="${esc(p.id)}">
        ${mediaHTML(p,i)}
        <div class="prompt-body"><small>${esc(p.category)}</small><h3>${esc(p.title)}</h3><span>Open prompt →</span></div>
      </article>
    `).join('');

    if(count)count.textContent=String(rows.length);
    empty?.classList.toggle('hidden',rows.length!==0||failed);
    showMore?.classList.toggle('hidden',shown.length>=rows.length||rows.length===0);
    if(showMore)showMore.textContent=`Show more prompts · ${rows.length-shown.length} remaining`;
    clearBtn?.classList.toggle('hidden',!(input?.value||'').trim());
  }

  function promptFromCard(card){
    if(!card)return null;
    return prompts.find(p=>String(p.id)===String(card.dataset.id))||null;
  }

  grid.addEventListener('click',event=>{
    const card=event.target.closest('.prompt-card');
    if(!card||!grid.contains(card))return;
    openPrompt(promptFromCard(card));
  });

  grid.addEventListener('keydown',event=>{
    if(event.key!=='Enter'&&event.key!==' ')return;
    const card=event.target.closest('.prompt-card');
    if(!card||!grid.contains(card))return;
    event.preventDefault();
    openPrompt(promptFromCard(card));
  });

  grid.addEventListener('error',event=>{
    const img=event.target;
    if(!(img instanceof HTMLImageElement)||!img.closest('.prompt-media-image'))return;
    const card=img.closest('.prompt-card');
    const idx=[...grid.children].indexOf(card);
    const media=img.closest('.prompt-media');
    if(media)media.outerHTML=placeholder(Math.max(0,idx));
  },true);

  closeBtn?.addEventListener('click',closePrompt);
  modal?.addEventListener('click',event=>{if(event.target===modal)closePrompt()});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&modal?.classList.contains('open'))closePrompt()});

  async function load(){
    failed=false;
    retry?.classList.add('hidden');
    grid.setAttribute('aria-busy','true');
    try{
      const url=`${API}?select=id,slug,title,category,prompt_text,image_url,sort_order&is_active=eq.true&order=sort_order.asc,created_at.asc`;
      const res=await fetch(url,{headers:{apikey:KEY},cache:'no-store'});
      if(!res.ok)throw new Error(`Prompt library request failed (${res.status})`);
      const raw=await res.json();
      prompts=[...raw.filter(isDirectUpload),...raw.filter(p=>!isDirectUpload(p))];
      visibleCount=PAGE_SIZE;
      render();
      ensureCopyButton();
    }catch(err){
      console.error(err);
      prompts=[];
      failed=true;
      grid.innerHTML='<div class="prompt-load-error"><strong>Could not load the prompt library.</strong><span>Your connection or the content service may be temporarily unavailable.</span></div>';
      retry?.classList.remove('hidden');
      showMore?.classList.add('hidden');
      if(count)count.textContent='0';
    }finally{
      grid.setAttribute('aria-busy','false');
    }
  }

  input?.addEventListener('input',()=>{visibleCount=PAGE_SIZE;render()});
  input?.addEventListener('search',()=>{visibleCount=PAGE_SIZE;render()});
  clearBtn?.addEventListener('click',()=>{if(input){input.value='';input.focus()}visibleCount=PAGE_SIZE;render()});
  showMore?.addEventListener('click',()=>{visibleCount+=PAGE_SIZE;render();showMore?.focus()});
  retry?.addEventListener('click',load);

  load();
})();
