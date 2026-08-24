(function(){
  if(document.getElementById('nexora-touch-theme-v18')) return;

  var style=document.createElement('style');
  style.id='nexora-touch-theme-v18';
  style.textContent=`
    .actions{
      background:linear-gradient(180deg,rgba(8,58,51,.62),rgba(2,18,15,.72))!important;
      border-color:rgba(232,189,97,.46)!important;
      box-shadow:0 16px 30px rgba(0,0,0,.45),inset 0 0 26px rgba(36,210,181,.035)!important;
    }
    .act{transition:transform .16s ease,filter .16s ease!important}
    .act .ico{
      background:radial-gradient(circle at 36% 28%,rgba(36,210,181,.10),rgba(2,12,10,.72))!important;
      border-color:rgba(232,189,97,.48)!important;
      color:#d8c893!important;
      box-shadow:inset 0 0 12px rgba(36,210,181,.045),0 5px 14px rgba(0,0,0,.22)!important;
      transition:transform .16s ease,background .16s ease,box-shadow .16s ease,color .16s ease,border-color .16s ease!important;
    }
    .act small{opacity:.84!important;transition:.16s ease!important}
    .act:active,.act.nx-pressed{transform:scale(1.08)!important;filter:brightness(1.08)!important}
    .act:active .ico,.act.nx-pressed .ico{
      background:linear-gradient(145deg,#e4b444,#118b7c)!important;
      color:#fff7d7!important;
      border-color:#ffe29a!important;
      box-shadow:0 0 8px rgba(255,218,128,.85),0 0 22px rgba(36,210,181,.68),inset 0 0 14px rgba(255,255,255,.18)!important;
      transform:translateY(-2px) scale(1.07)!important;
    }
    .act:active small,.act.nx-pressed small{opacity:1!important;color:#fff2c7!important;border-color:rgba(255,218,128,.72)!important}
    .act.liked .ico{
      background:linear-gradient(145deg,#d5a13a,#9e3f4a)!important;
      color:#fff5df!important;
      border-color:#f6d37b!important;
      box-shadow:0 0 17px rgba(232,189,97,.50)!important;
    }

    .bottom{
      background:linear-gradient(180deg,rgba(8,62,54,.72),rgba(3,20,17,.90))!important;
      border-color:rgba(232,189,97,.52)!important;
      box-shadow:0 -8px 26px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,217,120,.08),inset 0 0 26px rgba(36,210,181,.025)!important;
    }
    .nav{
      border-radius:16px!important;
      background:linear-gradient(180deg,rgba(232,189,97,.035),rgba(36,210,181,.025))!important;
      transition:transform .16s ease,background .16s ease,box-shadow .16s ease,color .16s ease!important;
    }
    .khmer-nav-ico{transition:transform .16s ease,filter .16s ease!important}
    .nav:active,.nav.nx-pressed{
      transform:translateY(-3px) scale(1.05)!important;
      color:#fff0bd!important;
      background:linear-gradient(180deg,rgba(228,178,60,.36),rgba(15,139,124,.34))!important;
      box-shadow:0 0 17px rgba(232,189,97,.30),inset 0 0 16px rgba(36,210,181,.08)!important;
    }
    .nav:active .khmer-nav-ico,.nav.nx-pressed .khmer-nav-ico{
      transform:scale(1.10)!important;
      filter:drop-shadow(0 0 8px rgba(255,217,120,.75)) drop-shadow(0 0 10px rgba(36,210,181,.35))!important;
    }
    .nav.active{
      color:#ffd978!important;
      background:linear-gradient(180deg,rgba(232,189,97,.18),rgba(36,210,181,.13))!important;
      box-shadow:inset 0 0 14px rgba(232,189,97,.08),0 0 12px rgba(36,210,181,.10)!important;
    }
    .nav.active .khmer-nav-ico{filter:drop-shadow(0 0 7px rgba(255,217,120,.55))!important}
    .khmer-post{
      background:radial-gradient(circle,#0f5c50 0 44%,#06352e 45% 60%,#03110f 61%)!important;
      box-shadow:0 0 0 5px rgba(232,189,97,.07),0 0 17px rgba(36,210,181,.23),inset 0 0 12px rgba(255,217,120,.06)!important;
      transition:transform .16s ease,background .16s ease,box-shadow .16s ease!important;
    }
    .nav[data-go='create']:active .khmer-post,.nav[data-go='create'].nx-pressed .khmer-post{
      transform:scale(1.12)!important;
      background:radial-gradient(circle at 36% 30%,#fff0a0 0 18%,#dfa83a 19% 48%,#119887 49% 72%,#03110f 73%)!important;
      box-shadow:0 0 0 6px rgba(232,189,97,.16),0 0 28px rgba(255,217,120,.68),0 0 34px rgba(36,210,181,.40)!important;
    }
  `;
  document.head.appendChild(style);

  function addPressFx(selector){
    document.querySelectorAll(selector).forEach(function(el){
      if(el.dataset.nxTouchFx) return;
      el.dataset.nxTouchFx='1';
      var pop=function(){
        el.classList.add('nx-pressed');
        clearTimeout(el._nxPressTimer);
        el._nxPressTimer=setTimeout(function(){el.classList.remove('nx-pressed');},280);
      };
      el.addEventListener('click',pop);
      el.addEventListener('touchstart',function(){el.classList.add('nx-pressed');},{passive:true});
      el.addEventListener('touchend',function(){setTimeout(function(){el.classList.remove('nx-pressed');},170);},{passive:true});
      el.addEventListener('touchcancel',function(){el.classList.remove('nx-pressed');},{passive:true});
    });
  }

  addPressFx('.actions .act');
  addPressFx('.bottom .nav');
})();
