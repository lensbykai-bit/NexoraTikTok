const INTAKE_CONFIG={url:'https://bcvtkdehflmqiyvloyiy.supabase.co',key:'sb_publishable_KgISTJ7-YKktjQXw3u0yuQ_KG6H1bFa'};
const IMAGE_BUCKET='prompt-images';
const MAX_IMAGE_BYTES=8*1024*1024;
const ALLOWED_IMAGE_TYPES=new Set(['image/jpeg','image/png','image/webp','image/gif']);
const sb=window.supabase?.createClient(INTAKE_CONFIG.url,INTAKE_CONFIG.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>[...r.querySelectorAll(s)];
const login=q('#intakeLogin'),app=q('#intakeApp'),list=q('#intakeList'),statusEl=q('#intakeStatus'),tpl=q('#intakeRowTemplate');
let rows=[];

function slugify(v=''){return String(v).trim().toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,160)}
function setStatus(t){if(statusEl)statusEl.textContent=t}
function pad(n){return String(n).padStart(2,'0')}
function safeName(v='prompt'){return slugify(v)||'prompt'}
function extensionFor(file){const byType={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif'};return byType[file?.type]||'jpg'}
function randomPart(){try{return crypto.randomUUID().replace(/-/g,'').slice(0,10)}catch{return Math.random().toString(36).slice(2,12)}}
function publicPathFromUrl(url=''){const marker=`/storage/v1/object/public/${IMAGE_BUCKET}/`;const i=String(url).indexOf(marker);return i>=0?decodeURIComponent(String(url).slice(i+marker.length)):''}

async function checkAdmin(){
  if(!sb)return false;
  const{data:{session}}=await sb.auth.getSession();
  if(!session){login?.classList.remove('hidden');app?.classList.add('hidden');return false}
  const{data,error}=await sb.from('admin_users').select('role').eq('user_id',session.user.id).maybeSingle();
  if(error||!data){
    await sb.auth.signOut();
    login?.classList.remove('hidden');app?.classList.add('hidden');
    q('#intakeLoginMessage').textContent='This account is not authorized for Nexora Admin.';
    return false;
  }
  q('#intakeIdentity').textContent=`${session.user.email||'Admin'} · ${data.role}`;
  login?.classList.add('hidden');app?.classList.remove('hidden');
  if(!rows.length)addRows(5);
  return true;
}

q('#intakeLoginForm')?.addEventListener('submit',async e=>{
  e.preventDefault();
  const m=q('#intakeLoginMessage');m.textContent='Signing in…';
  const{error}=await sb.auth.signInWithPassword({email:q('#intakeEmail').value.trim(),password:q('#intakePassword').value});
  if(error){m.textContent=error.message;return}
  m.textContent='Checking admin access…';
  await checkAdmin();
});
q('#intakeLogout')?.addEventListener('click',async()=>{await sb.auth.signOut();location.reload()});

function readRow(el){
  return{
    title:q('[data-field="title"]',el).value.trim(),
    category:q('[data-field="category"]',el).value.trim(),
    image_url:q('[data-field="image_url"]',el).value.trim(),
    image_file:q('[data-field="image_file"]',el)?.files?.[0]||null,
    sort_order:Math.max(0,Number(q('[data-field="sort_order"]',el).value)||0),
    prompt_text:q('[data-field="prompt_text"]',el).value.trim()
  };
}
function snapshot(){rows=qa('.intake-row',list).map(readRow)}
function isRowEmpty(r){return !r.title&&!r.prompt_text&&!r.image_file&&!r.image_url}

function setRowSaveState(el,text='Save row',disabled=false){
  const btn=q('[data-action="save-row"]',el);
  if(btn){btn.textContent=text;btn.disabled=disabled}
}

function resetImagePreview(el){
  const input=q('[data-field="image_file"]',el),urlInput=q('[data-field="image_url"]',el),preview=q('[data-image-preview]',el),img=q('img',preview),placeholder=q('span',preview),name=q('[data-image-name]',el),remove=q('[data-action="remove-image"]',el),choose=q('[data-action="choose-image"]',el);
  if(input)input.value='';
  if(urlInput)urlInput.value='';
  if(img){img.src='';img.hidden=true}
  if(placeholder)placeholder.hidden=false;
  if(name)name.textContent='No image selected';
  if(choose)choose.textContent='Upload image';
  remove?.classList.add('hidden');
  el.classList.remove('has-image');
}

function showImagePreview(el,file){
  const preview=q('[data-image-preview]',el),img=q('img',preview),placeholder=q('span',preview),name=q('[data-image-name]',el),remove=q('[data-action="remove-image"]',el),choose=q('[data-action="choose-image"]',el);
  if(!file)return resetImagePreview(el);
  if(!ALLOWED_IMAGE_TYPES.has(file.type)){setStatus('Please choose JPG, PNG, WEBP or GIF images only.');resetImagePreview(el);return}
  if(file.size>MAX_IMAGE_BYTES){setStatus('Image is too large. Maximum size is 8 MB.');resetImagePreview(el);return}
  const objectUrl=URL.createObjectURL(file);
  img.onload=()=>URL.revokeObjectURL(objectUrl);
  img.src=objectUrl;img.hidden=false;
  if(placeholder)placeholder.hidden=true;
  if(name)name.textContent=`${file.name} · ${(file.size/1024/1024).toFixed(1)} MB`;
  if(choose)choose.textContent='Change image';
  remove?.classList.remove('hidden');
  el.classList.add('has-image');
  el.classList.remove('is-saved','has-error');
  setRowSaveState(el,'Save row');
  setStatus('Image selected. Fill the title + prompt, then click Save row.');
}

function markRowDirty(el){
  if(!el)return;
  el.classList.remove('is-saved','has-error');
  setRowSaveState(el,el.dataset.promptId?'Update row':'Save row');
}

function bindImagePicker(el){
  const input=q('[data-field="image_file"]',el),choose=q('[data-action="choose-image"]',el),remove=q('[data-action="remove-image"]',el),save=q('[data-action="save-row"]',el);
  choose?.addEventListener('click',()=>input?.click());
  input?.addEventListener('change',()=>showImagePreview(el,input.files?.[0]||null));
  remove?.addEventListener('click',()=>{resetImagePreview(el);markRowDirty(el);setStatus('Image removed from this row. Click Save row to keep the change.')});
  save?.addEventListener('click',()=>saveSingleRow(el));
}

function makeRow(data={},index=0){
  const el=tpl.content.firstElementChild.cloneNode(true);
  q('.intake-index',el).textContent=pad(index+1);
  const defaults={title:'',category:q('#defaultCategory')?.value||'AI PROMPT',image_url:'',sort_order:(Number(q('#startOrder')?.value)||100)+index,prompt_text:'',...data};
  Object.entries(defaults).forEach(([k,v])=>{const input=q(`[data-field="${k}"]`,el);if(input&&input.type!=='file')input.value=v});
  bindImagePicker(el);
  qa('input:not([type="file"]),textarea',el).forEach(input=>input.addEventListener('input',()=>markRowDirty(el)));
  q('[data-action="remove"]',el).addEventListener('click',()=>{el.remove();renumber()});
  q('[data-action="duplicate"]',el).addEventListener('click',()=>{
    const copy=readRow(el);delete copy.image_file;copy.image_url='';
    const newEl=makeRow(copy,qa('.intake-row',list).length);
    el.after(newEl);renumber();
    setStatus('Row duplicated. Choose the image again for the duplicated row.');
  });
  return el;
}

function addRows(count=5){
  if(q('.intake-empty',list))list.innerHTML='';
  const start=qa('.intake-row',list).length;
  for(let i=0;i<count;i++)list.appendChild(makeRow({},start+i));
  renumber();
}
function renumber(){
  qa('.intake-row',list).forEach((el,i)=>{q('.intake-index',el).textContent=pad(i+1)});
  if(!qa('.intake-row',list).length)list.innerHTML='<div class="intake-empty">No prompt rows yet. Use “+ 5 rows” to start.</div>';
}

q('#addFive')?.addEventListener('click',()=>addRows(5));
q('#clearRows')?.addEventListener('click',()=>{if(confirm('Clear all unsaved prompt rows?')){list.innerHTML='';rows=[];renumber();setStatus('Rows cleared.')}});
q('#applyDefaults')?.addEventListener('click',()=>{
  const cat=q('#defaultCategory').value.trim()||'AI PROMPT',start=Math.max(0,Number(q('#startOrder').value)||100);
  qa('.intake-row',list).forEach((el,i)=>{const c=q('[data-field="category"]',el),s=q('[data-field="sort_order"]',el);if(!c.value.trim())c.value=cat;s.value=start+i;markRowDirty(el)});
  setStatus('Defaults applied.');
});

async function existingSlugs(slugs){
  if(!slugs.length)return new Set();
  const{data,error}=await sb.from('nexora_prompts').select('slug').in('slug',slugs);
  if(error)throw error;
  return new Set((data||[]).map(x=>x.slug));
}

async function uploadImage(item,position=1,total=1){
  const file=item.file;
  if(!file)return null;
  if(!ALLOWED_IMAGE_TYPES.has(file.type))throw new Error(`Row ${item.index}: unsupported image type.`);
  if(file.size>MAX_IMAGE_BYTES)throw new Error(`Row ${item.index}: image exceeds 8 MB.`);
  const ext=extensionFor(file),sort=String(item.row.sort_order||item.index).padStart(4,'0'),path=`prompts/${sort}-${safeName(item.row.slug)}-${Date.now()}-${randomPart()}.${ext}`;
  setStatus(total>1?`Uploading image ${position}/${total}: ${file.name}`:`Uploading ${file.name}…`);
  const{error}=await sb.storage.from(IMAGE_BUCKET).upload(path,file,{cacheControl:'31536000',upsert:false,contentType:file.type});
  if(error)throw error;
  const{data}=sb.storage.from(IMAGE_BUCKET).getPublicUrl(path);
  if(!data?.publicUrl){await sb.storage.from(IMAGE_BUCKET).remove([path]);throw new Error(`Could not create public URL for row ${item.index}.`)}
  item.row.image_url=data.publicUrl;
  item.uploadPath=path;
  q('[data-field="image_url"]',item.el).value=data.publicUrl;
  return path;
}

function prepareRow(el,index){
  const r=readRow(el);
  if(isRowEmpty(r))return{empty:true};
  if(r.title.length<2)throw new Error(`Row ${index}: add a title.`);
  if(r.prompt_text.length<10)throw new Error(`Row ${index}: add the full prompt.`);
  if(r.image_file&&!ALLOWED_IMAGE_TYPES.has(r.image_file.type))throw new Error(`Row ${index}: use JPG, PNG, WEBP or GIF.`);
  if(r.image_file&&r.image_file.size>MAX_IMAGE_BYTES)throw new Error(`Row ${index}: image must be under 8 MB.`);
  const sort=Number.isFinite(Number(r.sort_order))?Math.max(0,Number(r.sort_order)):((Number(q('#startOrder').value)||100)+(index-1));
  return{empty:false,el,file:r.image_file,index,row:{title:r.title,category:r.category||'AI PROMPT',prompt_text:r.prompt_text,slug:slugify(r.title),image_url:r.image_url||'',sort_order:sort,is_active:true,updated_at:new Date().toISOString()},uploadPath:null};
}

async function savePreparedItem(item,{batch=false,position=1,total=1}={}){
  const el=item.el,currentId=el.dataset.promptId||'';
  const oldImageUrl=q('[data-field="image_url"]',el)?.value||'';
  let uploadedPath='';
  el.classList.remove('has-error','is-saved');el.classList.add('is-uploading');
  setRowSaveState(el,batch?'Saving…':'Saving…',true);
  try{
    if(!currentId){
      const dupes=await existingSlugs([item.row.slug]);
      if(dupes.has(item.row.slug))throw new Error(`Row ${item.index}: this title already exists. Rename it before saving.`);
    }
    if(item.file)uploadedPath=await uploadImage(item,position,total)||'';
    let result;
    if(currentId){
      result=await sb.from('nexora_prompts').update(item.row).eq('id',currentId).select('id').single();
    }else{
      result=await sb.from('nexora_prompts').insert(item.row).select('id').single();
    }
    if(result.error)throw result.error;
    if(result.data?.id)el.dataset.promptId=String(result.data.id);
    if(uploadedPath&&oldImageUrl&&oldImageUrl!==item.row.image_url){const oldPath=publicPathFromUrl(oldImageUrl);if(oldPath)await sb.storage.from(IMAGE_BUCKET).remove([oldPath])}
    const fileInput=q('[data-field="image_file"]',el);if(fileInput)fileInput.value='';
    const name=q('[data-image-name]',el);if(name&&item.row.image_url)name.textContent='Image saved ✓';
    el.classList.add('is-saved');
    setRowSaveState(el,'Saved ✓');
    setTimeout(()=>setRowSaveState(el,'Update row'),1200);
    return true;
  }catch(err){
    console.error(err);
    if(uploadedPath)await sb.storage.from(IMAGE_BUCKET).remove([uploadedPath]);
    el.classList.add('has-error');
    setRowSaveState(el,currentId?'Update row':'Save row');
    throw err;
  }finally{
    el.classList.remove('is-uploading');
    const btn=q('[data-action="save-row"]',el);if(btn)btn.disabled=false;
  }
}

async function saveSingleRow(el){
  const index=qa('.intake-row',list).indexOf(el)+1;
  try{
    const item=prepareRow(el,index);
    if(item.empty){setStatus(`Row ${index} is empty.`);return}
    setStatus(`Saving row ${index}…`);
    await savePreparedItem(item);
    setStatus(`Row ${index} saved ✓. You can open Prompt Book to review it.`);
  }catch(err){
    setStatus(err?.message||`Could not save row ${index}.`);
  }
}

q('#saveBatch')?.addEventListener('click',async()=>{
  const els=qa('.intake-row',list);
  if(!els.length){setStatus('Add prompt rows first.');return}
  const btn=q('#saveBatch');btn.disabled=true;btn.textContent='Saving…';
  let saved=0,skipped=0,failed=0;
  try{
    const items=[];
    for(let i=0;i<els.length;i++){
      try{
        const item=prepareRow(els[i],i+1);
        if(item.empty){skipped++;continue}
        items.push(item);
      }catch(err){els[i].classList.add('has-error');failed++;setStatus(err.message)}
    }
    if(failed){setStatus(`${failed} row(s) need attention before batch save.`);return}
    if(!items.length){setStatus('Nothing to save yet.');return}
    for(let i=0;i<items.length;i++){
      setStatus(`Saving row ${i+1}/${items.length}…`);
      try{await savePreparedItem(items[i],{batch:true,position:i+1,total:items.length});saved++}catch(err){failed++;setStatus(err?.message||`Could not save row ${items[i].index}.`)}
    }
    if(failed)setStatus(`Saved ${saved} row(s). ${failed} row(s) need attention.`);
    else setStatus(`Saved ${saved} prompt(s) ✓${skipped?` · ${skipped} empty row(s) skipped.`:''}`);
  }finally{
    btn.disabled=false;btn.textContent='Save batch';
  }
});

document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){e.preventDefault();q('#saveBatch')?.click()}});
checkAdmin();
