(function(){
  if(document.getElementById('nexora-khmer-theme-v18')) return;

  var GOLD='#e8bd61', GOLD2='#ffd978', TEAL='#24d2b5', INK='#020807', JADE='#062a25';
  var style=document.createElement('style');
  style.id='nexora-khmer-theme-v18';
  style.textContent=`
  :root{--nx-gold:${GOLD};--nx-gold2:${GOLD2};--nx-teal:${TEAL};--nx-ink:${INK};--nx-jade:${JADE}}
  html,body{background:#020706!important}
  .app{background:#020706!important}
  .screen{inset:0 0 calc(82px + env(safe-area-inset-bottom)) 0!important}
  .home{background:#000!important}

  .home-top{grid-template-columns:58px minmax(0,1fr) 42px!important;gap:7px!important;padding:calc(8px + env(safe-area-inset-top)) 7px 7px!important;background:linear-gradient(180deg,rgba(0,0,0,.84),rgba(2,14,12,.42),transparent)!important;align-items:center!important}
  .khmer-brand{width:56px;display:grid;place-items:center;color:var(--nx-teal);font-weight:900;letter-spacing:.7px;font-size:7px;line-height:1.05;text-align:center;text-shadow:0 0 15px rgba(36,210,181,.35)}
  .khmer-brand svg{width:27px;height:25px;display:block;filter:drop-shadow(0 0 5px rgba(36,210,181,.36))}
  .khmer-brand b{font-size:7.4px;margin-top:1px}
  .feed-tabs{min-width:0!important;gap:20px!important;justify-content:flex-start!important;overflow-x:auto!important;white-space:nowrap!important;scrollbar-width:none!important;-ms-overflow-style:none!important;padding:0 3px!important}
  .feed-tabs::-webkit-scrollbar{display:none!important}
  .feed-tabs button{font-size:11px!important;font-weight:800!important;letter-spacing:.22px!important;padding:10px 0 9px!important;flex:0 0 auto!important;white-space:nowrap!important;color:#aaa8a9!important;text-shadow:0 1px 6px #000!important}
  .feed-tabs button.active{color:var(--nx-gold2)!important}
  .feed-tabs button.active:after{left:15%!important;right:15%!important;height:2px!important;background:linear-gradient(90deg,transparent,var(--nx-gold2),transparent)!important;box-shadow:0 0 8px rgba(255,217,120,.7)!important}
  .circlebtn.search{width:38px!important;height:38px!important;background:radial-gradient(circle at 35% 30%,rgba(36,210,181,.18),rgba(2,12,10,.90))!important;border:1px solid rgba(232,189,97,.64)!important;color:#fff!important;box-shadow:0 0 0 2px rgba(36,210,181,.06),0 0 18px rgba(36,210,181,.18)!important}
  .circlebtn.search svg{width:19px;height:19px}

  .video-card:after{content:'';position:absolute;inset:0;pointer-events:none;z-index:2;background:linear-gradient(180deg,rgba(0,0,0,.06) 0%,transparent 48%,rgba(0,8,6,.18) 64%,rgba(0,0,0,.72) 100%)}
  .content{z-index:6!important;left:16px!important;right:88px!important;bottom:20px!important}
  .name-row{font-size:15px!important;text-shadow:0 2px 10px #000}
  .verified{color:var(--nx-teal)!important}
  .follow-pill{border:1px solid var(--nx-gold)!important;background:rgba(3,19,16,.80)!important;color:var(--nx-gold2)!important;border-radius:10px!important;padding:5px 12px!important;box-shadow:inset 0 0 12px rgba(36,210,181,.07)!important}
  .follow-pill.on{background:linear-gradient(135deg,#ad7c2d,#f0c86b)!important;color:#0b0b08!important}
  .caption{font-size:13.5px!important;line-height:1.48!important;text-shadow:0 2px 9px #000}
  .tags{color:var(--nx-teal)!important;text-shadow:0 0 10px rgba(36,210,181,.16)}
  .sound{color:#e7e1d0!important}.disc-mini{border-color:#6b5424!important;background:var(--nx-gold)!important;box-shadow:0 0 8px rgba(232,189,97,.34)}

  .actions{right:6px!important;bottom:10px!important;width:74px!important;padding:13px 7px 11px!important;gap:10px!important;display:flex!important;background:linear-gradient(180deg,rgba(4,39,34,.93),rgba(1,10,9,.96))!important;border:1px solid rgba(232,189,97,.82)!important;border-radius:40px 40px 32px 32px!important;box-shadow:0 18px 34px rgba(0,0,0,.58),0 0 0 2px rgba(36,210,181,.05),inset 0 0 24px rgba(36,210,181,.035)!important}
  .actions:before{content:'';position:absolute;inset:6px;border:1px solid rgba(232,189,97,.18);border-radius:34px 34px 27px 27px;pointer-events:none}
  .actions:after{content:'◆';position:absolute;top:-8px;left:50%;transform:translateX(-50%);font-size:9px;color:var(--nx-gold);text-shadow:0 0 8px rgba(232,189,97,.55)}
  .avatar-wrap{z-index:2}.avatar{width:50px!important;height:50px!important;border:2px solid var(--nx-gold2)!important;background:radial-gradient(circle at 30% 25%,#2ed8bb,#08766a 58%,#1b241c)!important;color:#fff!important;box-shadow:0 0 0 3px rgba(232,189,97,.12),0 0 17px rgba(36,210,181,.22)!important}
  .plus{background:linear-gradient(135deg,#0db9a0,#f0b84e)!important;color:#fff!important;box-shadow:0 0 0 2px #03221d!important}
  .act{z-index:2!important;min-width:58px!important;color:#fff!important}
  .act .ico{width:47px!important;height:47px!important;margin:auto!important;border-radius:50%!important;display:grid!important;place-items:center!important;background:radial-gradient(circle at 38% 27%,rgba(36,210,181,.13),rgba(2,10,9,.90))!important;border:1px solid rgba(232,189,97,.80)!important;color:var(--nx-gold2)!important;box-shadow:0 0 0 3px rgba(232,189,97,.055),inset 0 0 14px rgba(36,210,181,.06)!important;text-shadow:none!important}
  .act .ico svg{width:24px;height:24px;filter:drop-shadow(0 0 5px rgba(232,189,97,.25))}
  .act small{display:inline-block!important;margin-top:-1px!important;padding:2px 6px!important;border-radius:9px!important;background:rgba(1,12,10,.86)!important;border:1px solid rgba(232,189,97,.28)!important;color:#f4ead3!important;font-size:10.5px!important;line-height:1.15!important}
  .act.liked .ico{color:#ff7d90!important;border-color:#ff8fa0!important;box-shadow:0 0 14px rgba(255,104,132,.28)!important}
  .disc{z-index:2!important;width:47px!important;height:47px!important;border:5px solid #151b18!important;background:radial-gradient(circle,var(--nx-gold2) 0 11%,#113832 12% 25%,#020706 26% 48%,#1aa58f 49% 56%,#020706 57%)!important;box-shadow:0 0 0 1px var(--nx-gold),0 0 14px rgba(36,210,181,.26)!important}

  .bottom{left:5px!important;right:5px!important;bottom:0!important;height:calc(82px + env(safe-area-inset-bottom))!important;padding:3px 6px env(safe-area-inset-bottom)!important;background:linear-gradient(180deg,rgba(6,45,39,.98),rgba(1,14,12,.99))!important;border:1px solid rgba(232,189,97,.88)!important;border-bottom:0!important;border-radius:25px 25px 0 0!important;box-shadow:0 -10px 30px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,217,120,.10)!important;overflow:visible!important}
  .bottom:before{content:'◇ ◆ ◇';position:absolute;left:50%;top:-8px;transform:translateX(-50%);color:var(--nx-gold);font-size:8px;letter-spacing:4px;text-shadow:0 0 8px rgba(232,189,97,.5);white-space:nowrap}
  .nav{position:relative!important;border:0!important;background:none!important;color:#b6aaa0!important;padding:8px 2px 2px!important;font-size:10px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important;overflow:visible!important}
  .nav em{font-style:normal;font-size:10px;line-height:1;color:inherit}
  .khmer-nav-ico{width:29px;height:29px;display:grid;place-items:center;color:inherit;transition:.2s}
  .khmer-nav-ico svg{width:26px;height:26px;filter:drop-shadow(0 2px 4px #000)}
  .nav.active{color:var(--nx-gold2)!important;font-weight:800!important;text-shadow:0 0 10px rgba(232,189,97,.24)!important}
  .nav.active .khmer-nav-ico{filter:drop-shadow(0 0 8px rgba(232,189,97,.28))}
  .nav[data-go='create']{transform:translateY(-14px)!important;color:var(--nx-gold2)!important}
  .khmer-post{position:relative;width:62px;height:62px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle,#0c4e44 0 46%,#031b17 47% 62%,#020706 63%);border:2px solid var(--nx-gold2);box-shadow:0 0 0 5px rgba(232,189,97,.08),0 0 22px rgba(36,210,181,.30),inset 0 0 14px rgba(255,217,120,.08)}
  .khmer-post:before{content:'';position:absolute;inset:-8px;border-radius:50%;background:conic-gradient(from 0deg,transparent 0 7deg,rgba(232,189,97,.9) 7deg 12deg,transparent 12deg 37deg,rgba(232,189,97,.9) 37deg 42deg,transparent 42deg 67deg,rgba(232,189,97,.9) 67deg 72deg,transparent 72deg 97deg,rgba(232,189,97,.9) 97deg 102deg,transparent 102deg 127deg,rgba(232,189,97,.9) 127deg 132deg,transparent 132deg 157deg,rgba(232,189,97,.9) 157deg 162deg,transparent 162deg 187deg,rgba(232,189,97,.9) 187deg 192deg,transparent 192deg 217deg,rgba(232,189,97,.9) 217deg 222deg,transparent 222deg 247deg,rgba(232,189,97,.9) 247deg 252deg,transparent 252deg 277deg,rgba(232,189,97,.9) 277deg 282deg,transparent 282deg 307deg,rgba(232,189,97,.9) 307deg 312deg,transparent 312deg);-webkit-mask:radial-gradient(circle,transparent 0 60%,#000 61% 100%);mask:radial-gradient(circle,transparent 0 60%,#000 61% 100%)}
  .khmer-post svg{width:29px;height:29px;position:relative;z-index:2;filter:drop-shadow(0 0 5px rgba(255,217,120,.55))}
  .nav[data-go='create'] em{margin-top:-1px;color:var(--nx-gold2)!important;font-weight:800}

  .screen:not(.home){background:radial-gradient(circle at 15% 0%,rgba(16,93,79,.18),transparent 34%),linear-gradient(180deg,#061915,#020706 70%)!important}
  .page-head{background:linear-gradient(180deg,#082a24f5,#03110ff5)!important;border-bottom:1px solid rgba(232,189,97,.48)!important}
  .page-head b{color:var(--nx-gold2)!important}
  .searchbox,.upload-card,.panel,.progress-card,.shop-card{background:linear-gradient(145deg,rgba(8,43,37,.88),rgba(2,14,12,.94))!important;border:1px solid rgba(232,189,97,.28)!important;box-shadow:inset 0 0 22px rgba(36,210,181,.025)!important}
  .chip{background:#06231f!important;border-color:rgba(232,189,97,.30)!important;color:#ded5c4!important}
  .btn.primary{background:linear-gradient(135deg,#0d9d87,#c49543)!important;color:#fff!important;box-shadow:0 6px 18px rgba(36,210,181,.12)!important}
  .btn.dark{background:#09231f!important;border:1px solid rgba(232,189,97,.22)!important;color:#f2e6cf!important}
  .profile-avatar{background:linear-gradient(135deg,var(--nx-teal),var(--nx-gold))!important}
  .progress i{background:linear-gradient(90deg,var(--nx-teal),var(--nx-gold2))!important}
  .sheet{background:linear-gradient(180deg,#08251f,#020b09)!important;border-top:1px solid rgba(232,189,97,.42)!important}
  .toast{background:linear-gradient(135deg,#f4d77c,#21b9a2)!important;color:#06100e!important}
  @media(max-width:370px){.feed-tabs{gap:16px!important}.feed-tabs button{font-size:10px!important}.khmer-brand{width:52px}.home-top{grid-template-columns:52px minmax(0,1fr) 40px!important}.actions{width:68px!important}.content{right:81px!important}}
  `;
  document.head.appendChild(style);

  function svg(paths,fill){return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="'+(fill||'none')+'" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+paths+'</svg>'}
  function lotusSvg(){return '<svg viewBox="0 0 48 42" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.6"><path d="M24 4c-5 6-7 12-5 18 1 4 3 7 5 9 2-2 4-5 5-9 2-6 0-12-5-18Z"/><path d="M17 12c-6 2-10 6-11 11 4 0 8 1 12 4 2 2 4 4 6 7"/><path d="M31 12c6 2 10 6 11 11-4 0-8 1-12 4-2 2-4 4-6 7"/><path d="M9 25c2 7 7 11 15 13 8-2 13-6 15-13"/></g></svg>'}

  var top=document.querySelector('.home-top');
  if(top){
    var old=top.querySelector('.circlebtn:not(.search)'); if(old) old.remove();
    var tabs=top.querySelector('.feed-tabs');
    if(!top.querySelector('.khmer-brand')){
      var brand=document.createElement('div'); brand.className='khmer-brand';
      brand.innerHTML=lotusSvg()+'<b>NEXORA<br>TOK</b>';
      top.insertBefore(brand,tabs||top.firstChild);
    }
    if(tabs){
      tabs.innerHTML='<button onclick="feedTab(this,\'STEM\')">STEM</button><button onclick="feedTab(this,\'COMMUNITY\')">COMMUNITY</button><button onclick="feedTab(this,\'LOCAL\')">LOCAL</button><button onclick="feedTab(this,\'FOLLOWING\')">FOLLOWING</button><button class="active" onclick="feedTab(this,\'FOR YOU\')">FOR YOU</button>';
    }
    var search=top.querySelector('.search');
    if(search) search.innerHTML=svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>');
  }

  var actionSvgs=[
    svg('<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/>'),
    svg('<path d="M21 15a4 4 0 0 1-4 4H8l-5 3 1.7-4.2A7 7 0 0 1 3 13V9a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/>'),
    svg('<path d="M12 3.8 14.5 9l5.7.8-4.1 4 1 5.7-5.1-2.7-5.1 2.7 1-5.7-4.1-4L9.5 9Z"/>'),
    svg('<path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/><path d="m16 6-4-4-4 4M12 2v13"/>')
  ];
  document.querySelectorAll('.actions').forEach(function(actions){
    var buttons=actions.querySelectorAll('.act');
    buttons.forEach(function(btn,i){var ico=btn.querySelector('.ico'); if(ico&&actionSvgs[i]) ico.innerHTML=actionSvgs[i];});
  });

  var navIcons={
    home:svg('<path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/>'),
    friends:svg('<circle cx="9" cy="8" r="3"/><path d="M3.8 20v-2a5.2 5.2 0 0 1 10.4 0v2"/><circle cx="17" cy="9" r="2.3"/><path d="M16 14.2a4.6 4.6 0 0 1 4.2 4.6V20"/>'),
    inbox:svg('<path d="M4 6h16v12H4z"/><path d="m4 8 8 6 8-6"/>'),
    profile:svg('<circle cx="12" cy="8" r="3.4"/><path d="M5 21v-2.2A7 7 0 0 1 19 18.8V21"/>'),
    plus:svg('<path d="M12 5v14M5 12h14"/>')
  };
  function setNav(go,label,icon){var n=document.querySelector('.nav[data-go="'+go+'"]');if(n)n.innerHTML='<span class="khmer-nav-ico">'+icon+'</span><em>'+label+'</em>';}
  setNav('home','Home',navIcons.home); setNav('friends','Friend',navIcons.friends); setNav('inbox','Inbox',navIcons.inbox); setNav('profile','Profile',navIcons.profile);
  var post=document.querySelector('.nav[data-go="create"]');
  if(post) post.innerHTML='<span class="khmer-post">'+navIcons.plus+'</span><em>Post</em>';

  var home=document.getElementById('home');
  if(home&&!home.dataset.swipeProfile){
    home.dataset.swipeProfile='1'; var sx=0,sy=0,st=0;
    home.addEventListener('touchstart',function(e){if(e.touches.length!==1||e.target.closest('.feed-tabs,.modal,button,input,textarea')){st=0;return;}sx=e.touches[0].clientX;sy=e.touches[0].clientY;st=Date.now();},{passive:true});
    home.addEventListener('touchend',function(e){if(!st||!e.changedTouches||!e.changedTouches.length)return;var dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy,dt=Date.now()-st;st=0;if(dx<-75&&Math.abs(dx)>Math.abs(dy)*1.25&&dt<650&&typeof go==='function')go('profile');},{passive:true});
  }

  window.NexoraShare=function(){if(window.NexoraNative)window.NexoraNative.share('Nexora Tok','Check this video on Nexora Tok');};
})();
