function readStudentProfile(){
  try{return JSON.parse(localStorage.getItem(storageKey('profile'))||'{}')}catch{return{}}
}
function writeStudentProfile(profile){localStorage.setItem(storageKey('profile'),JSON.stringify(profile))}
function currentStudentProfile(){return{
  niche:document.getElementById('profileNiche')?.value.trim()||'',
  creator_goal:document.getElementById('profileGoal')?.value.trim()||'',
  creator_level:document.getElementById('profileLevel')?.value||'Beginner',
  preferred_language:document.getElementById('profileLanguage')?.value||'English',
  bio:document.getElementById('profileBio')?.value.trim()||''
}}
function restoreStudentProfile(){
  const p=readStudentProfile();
  if(document.getElementById('profileNiche'))document.getElementById('profileNiche').value=p.niche||'';
  if(document.getElementById('profileGoal'))document.getElementById('profileGoal').value=p.creator_goal||'';
  if(document.getElementById('profileLevel'))document.getElementById('profileLevel').value=p.creator_level||'Beginner';
  if(document.getElementById('profileLanguage'))document.getElementById('profileLanguage').value=p.preferred_language||'English';
  if(document.getElementById('profileBio'))document.getElementById('profileBio').value=p.bio||'';
  const niche=document.getElementById('portalMiniNiche');if(niche)niche.textContent=p.niche||'Set your creator niche';
  const avatar=document.getElementById('portalAvatar');const name=document.getElementById('portalName')?.textContent||'S';if(avatar)avatar.textContent=(name.trim()[0]||'S').toUpperCase();
}
document.getElementById('saveProfile')?.addEventListener('click',()=>{
  const p=currentStudentProfile();writeStudentProfile(p);restoreStudentProfile();
  const msg=document.getElementById('profileSaved');if(msg)msg.textContent='Saved ✓';
  if(typeof scheduleCloudSave==='function')scheduleCloudSave(100);
  if(typeof toast==='function')toast('Profile saved ✓');
  setTimeout(()=>{if(msg)msg.textContent=''},1500);
});
restoreStudentProfile();