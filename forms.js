const NEXORA_FORMS={
  url:'https://bcvtkdehflmqiyvloyiy.supabase.co',
  key:'sb_publishable_KgISTJ7-YKktjQXw3u0yuQ_KG6H1bFa'
};

async function submitNexoraRow(table,payload){
  const res=await fetch(`${NEXORA_FORMS.url}/rest/v1/${table}`,{
    method:'POST',
    headers:{
      apikey:NEXORA_FORMS.key,
      'Content-Type':'application/json',
      Prefer:'return=minimal'
    },
    body:JSON.stringify(payload)
  });
  if(!res.ok){
    const text=await res.text().catch(()=> '');
    throw new Error(text||`Request failed (${res.status})`);
  }
}

const enrollForm=document.getElementById('enrollForm');
if(enrollForm){
  enrollForm.addEventListener('submit',async e=>{
    e.preventDefault();
    e.stopImmediatePropagation();
    const btn=enrollForm.querySelector('button[type="submit"]');
    const msg=document.getElementById('enrollMessage');
    const honeypot=document.getElementById('enrollWebsite');
    if(honeypot?.value)return;
    const payload={
      full_name:document.getElementById('enrollName')?.value.trim(),
      email:document.getElementById('enrollEmail')?.value.trim(),
      track:document.getElementById('enrollTrack')?.value||'Support Program',
      level:document.getElementById('enrollLevel')?.value||'Beginner',
      goal:document.getElementById('enrollGoal')?.value.trim()||'',
      source:'NexoraTikTok'
    };
    try{
      if(btn){btn.disabled=true;btn.textContent='Sending…'}
      if(msg)msg.textContent='Sending your request…';
      await submitNexoraRow('nexora_enrollments',payload);
      enrollForm.reset();
      if(msg)msg.textContent='Enrollment request received ✓ We will review it and contact you using the email you provided.';
      if(typeof toast==='function')toast('Enrollment request sent ✓');
    }catch(err){
      console.error(err);
      if(msg)msg.textContent='Could not send right now. Please try again in a moment.';
      if(typeof toast==='function')toast('Could not send request');
    }finally{
      if(btn){btn.disabled=false;btn.textContent='Send enrollment request'}
    }
  },true);
}

const contactForm=document.getElementById('contactForm');
if(contactForm){
  contactForm.addEventListener('submit',async e=>{
    e.preventDefault();
    e.stopImmediatePropagation();
    const btn=contactForm.querySelector('button[type="submit"]');
    const msg=document.getElementById('contactFormMessage');
    const honeypot=document.getElementById('contactWebsite');
    if(honeypot?.value)return;
    const payload={
      full_name:document.getElementById('contactName')?.value.trim(),
      email:document.getElementById('contactEmail')?.value.trim(),
      message:document.getElementById('contactMessage')?.value.trim(),
      source:'NexoraTikTok'
    };
    try{
      if(btn){btn.disabled=true;btn.textContent='Sending…'}
      if(msg)msg.textContent='Sending your message…';
      await submitNexoraRow('nexora_contacts',payload);
      contactForm.reset();
      if(msg)msg.textContent='Message received ✓ Thanks for contacting Nexora Digital.';
      if(typeof toast==='function')toast('Message sent ✓');
    }catch(err){
      console.error(err);
      if(msg)msg.textContent='Could not send right now. Please try again in a moment.';
      if(typeof toast==='function')toast('Could not send message');
    }finally{
      if(btn){btn.disabled=false;btn.textContent='Send message'}
    }
  },true);
}
