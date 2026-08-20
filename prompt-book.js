const promptSb=window.nexoraSupabase;
const promptState={items:[],filtered:[],current:null};
const p$=id=>document.getElementById(id);
const pEsc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

async function loadPrompts(){
  if(!promptSb){p$('promptGrid').innerHTML='<div class="prompt-empty">Prompt service unavailable.</div>';return;}
  const {data,error}=await promptSb.from('prompts').select('*').eq('published',true).order('sort_order').order('created_at');
  if(error){p$('promptGrid').innerHTML=`<div class="prompt-empty">${pEsc(error.message)}</div>`;return;}
  promptState.items=data||[]; promptState.filtered=[...promptState.items]; buildCategories(); renderPrompts();
}
function buildCategories(){
  const select=p$('promptCategory');
  [...new Set(promptState.items.map(x=>x.category).filter(Boolean))].sort().forEach(cat=>{const o=document.createElement('option');o.value=cat;o.textContent=cat;select.appendChild(o);});
}
function filterPrompts(){
  const q=(p$('promptSearch').value||'').trim().toLowerCase(); const cat=p$('promptCategory').value;
  promptState.filtered=promptState.items.filter(item=>{
    const categoryOk=cat==='all'||item.category===cat;
    const hay=`${item.title} ${item.category} ${item.description} ${item.prompt_text}`.toLowerCase();
    return categoryOk&&(!q||hay.includes(q));
  }); renderPrompts();
}
function renderPrompts(){
  const grid=p$('promptGrid');
  if(!promptState.filtered.length){grid.innerHTML='<div class="prompt-empty">No prompts match your search.</div>';return;}
  grid.innerHTML=promptState.filtered.map(item=>`<article class="prompt-card"><span>${pEsc(item.category)}</span><h2>${pEsc(item.title)}</h2><p>${pEsc(item.description)}</p><button type="button" data-prompt="${item.id}">Open prompt →</button></article>`).join('');
  grid.querySelectorAll('[data-prompt]').forEach(btn=>btn.addEventListener('click',()=>openPrompt(btn.dataset.prompt)));
}
function openPrompt(id){
  const item=promptState.items.find(x=>x.id===id); if(!item)return; promptState.current=item;
  p$('modalCategory').textContent=item.category.toUpperCase(); p$('modalTitle').textContent=item.title; p$('modalDescription').textContent=item.description; p$('modalPrompt').textContent=item.prompt_text; p$('copyStatus').textContent=''; p$('promptDialog').showModal();
}
p$('promptSearch')?.addEventListener('input',filterPrompts);p$('promptCategory')?.addEventListener('change',filterPrompts);p$('closePrompt')?.addEventListener('click',()=>p$('promptDialog').close());
p$('copyPrompt')?.addEventListener('click',async()=>{if(!promptState.current)return;try{await navigator.clipboard.writeText(promptState.current.prompt_text);p$('copyStatus').textContent='Copied to clipboard ✓';}catch{p$('copyStatus').textContent='Copy failed. Select the prompt text manually.';}});
loadPrompts();