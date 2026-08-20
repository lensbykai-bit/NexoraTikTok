const COURSE_PUBLIC={
  url:'https://bcvtkdehflmqiyvloyiy.supabase.co',
  key:'sb_publishable_KgISTJ7-YKktjQXw3u0yuQ_KG6H1bFa'
};

function courseEsc(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
async function courseRest(table,query){
  const res=await fetch(`${COURSE_PUBLIC.url}/rest/v1/${table}?${query}`,{headers:{apikey:COURSE_PUBLIC.key,Accept:'application/json'}});
  if(!res.ok)throw new Error(`Could not load ${table} (${res.status})`);
  return res.json();
}
function courseGroup(lessons){
  return lessons.reduce((m,l)=>{(m[l.course_id]||(m[l.course_id]=[])).push(l);return m},{});
}
function courseImageStyle(url){return url?` style="background-image:url('${courseEsc(url)}');background-size:cover;background-position:center"`:''}

async function initPublicCourses(){
  const courseGrid=document.getElementById('courseGrid');
  const curriculumList=document.getElementById('curriculumList');
  if(!courseGrid&&!curriculumList)return;
  const status=document.getElementById('courseLibraryStatus');
  try{
    const [courses,lessons]=await Promise.all([
      courseRest('nexora_courses','select=id,title,track,description,level,image_url,sort_order&is_active=eq.true&order=sort_order.asc'),
      courseRest('nexora_lessons','select=id,course_id,slug,title,summary,duration_minutes,is_preview,sort_order&is_active=eq.true&is_preview=eq.true&order=course_id.asc,sort_order.asc')
    ]);
    const grouped=courseGroup(lessons);
    if(courseGrid){
      courseGrid.innerHTML=courses.map((c,i)=>{
        const previews=grouped[c.id]||[];
        return `<article class="course-live-card ${i===0?'featured':''}">
          <div class="course-live-cover"${courseImageStyle(c.image_url)}><span>${courseEsc(c.track)}</span><b>${String(i+1).padStart(2,'0')}</b></div>
          <div class="course-live-body">
            <div class="course-live-meta"><span>${courseEsc(c.level)}</span><span>${previews.length} free preview${previews.length===1?'':'s'}</span></div>
            <h3>${courseEsc(c.title)}</h3><p>${courseEsc(c.description)}</p>
            <div class="course-preview-list">${previews.length?previews.map(l=>`<div><b>${courseEsc(l.title)}</b><small>${courseEsc(l.duration_minutes)} min preview</small></div>`).join(''):'<div><b>Full track</b><small>Sign in for available lessons</small></div>'}</div>
            <div class="actions"><a class="pill gradient" href="learn.html">Open student portal</a><a class="pill outline" href="enroll.html">Request access</a></div>
          </div>
        </article>`;
      }).join('');
    }
    if(curriculumList){
      let n=0;
      curriculumList.innerHTML=courses.map(c=>{
        const previews=grouped[c.id]||[];
        return `<section class="curriculum-live-group"><div class="curriculum-live-head"><span>${courseEsc(c.track)}</span><div><h3>${courseEsc(c.title)}</h3><p>${courseEsc(c.description)}</p></div></div>${previews.length?previews.map(l=>{n++;return `<article class="module"><span>${String(n).padStart(2,'0')}</span><div><h3>${courseEsc(l.title)}</h3><p>${courseEsc(l.summary)}</p><small>${courseEsc(l.duration_minutes)} min · FREE PREVIEW</small></div></article>`}).join(''):'<div class="course-live-empty">No public preview lessons in this track yet.</div>'}</section>`;
      }).join('');
    }
    if(status)status.textContent=`${courses.length} learning tracks · ${lessons.length} free preview lessons`;
  }catch(err){
    console.error(err);
    if(status)status.textContent='Course catalog is temporarily unavailable. Please try again shortly.';
    if(courseGrid)courseGrid.innerHTML='<div class="course-live-empty">Could not load the live course catalog.</div>';
    if(curriculumList)curriculumList.innerHTML='<div class="course-live-empty">Could not load the live curriculum preview.</div>';
  }
}
initPublicCourses();