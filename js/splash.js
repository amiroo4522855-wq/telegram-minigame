/* ===== لودینگ سینمایی + پیش‌بارگذاری واقعی ===== */
(function(){
  const TIPS=[
    '🏆 هر روز ماموریت‌ها رو کامل کن و سکه بگیر!',
    '🧠 حافظه‌ات رو با کاشی‌ها قوی کن...',
    '♟️ شطرنج سخت؟ ربات ۲ حرکت جلوتر رو می‌بینه!',
    '🎲 توی منچ، خونه‌های طلایی امن هستن...',
    '💣 توی مین‌روب از گوشه‌ها شروع کن!',
    '🎁 جایزه روزانه‌ات رو یادت نره!'
  ];
  const IMGS=['logo','memory','ludo','chess','sudoku','mines','rps','quiz','dino','g2048','doz','candy','snakes','flags','abdolah','tower','iceslide','escape','ballrun','av1','av2','av3','av4','av5','av6','av7','av8'].map(n=>'images/'+n+'.jpg');
  const MIN_TIME=2100;
  const t0=Date.now();
  let loaded=0, shown=0, target=0, finished=false, tipI=0;
  const total=IMGS.length+1; // + فونت
  const sp=document.getElementById('splash');
  if(!sp){ document.body.classList.add('ready'); return; }
  const fill=document.getElementById('sp-fill'), pct=document.getElementById('sp-pct'), tip=document.getElementById('sp-tip');
  const faN=n=>Math.round(n).toLocaleString('fa-IR');

  // ذرات شناور
  (function(){
    const box=document.getElementById('sp-particles');
    const cols=['#8b5cf6','#22d3ee','#f472b6','#fbbf24'];
    for(let i=0;i<26;i++){
      const s=document.createElement('i'), sz=3+Math.random()*7, c=cols[i%4];
      s.style.cssText=`left:${Math.random()*100}%;width:${sz}px;height:${sz}px;background:${c};`+
        `box-shadow:0 0 ${sz*2}px ${c};animation-duration:${4+Math.random()*6}s;animation-delay:${-Math.random()*8}s;opacity:.8`;
      box.appendChild(s);
    }
  })();

  // چرخش نکته‌ها
  const tipIv=setInterval(()=>{ if(finished){clearInterval(tipIv);return;}
    tipI=(tipI+1)%TIPS.length; tip.style.opacity=0;
    setTimeout(()=>{tip.textContent=TIPS[tipI];tip.style.opacity=1;},300);
  },1400);
  tip.textContent=TIPS[0];

  function bump(){ loaded++; target=Math.min(99,Math.round(loaded/total*100)); maybeFinish(); }
  IMGS.forEach(src=>{ const im=new Image(); im.onload=bump; im.onerror=bump; im.src=src; });
  // فونت
  try{
    if(document.fonts&&document.fonts.ready) document.fonts.ready.then(bump).catch(bump);
    else bump();
  }catch(e){ bump(); }

  // نوار نرم با lerp
  (function tick(){
    shown += (target-shown)*0.12;
    if(target-shown<0.4) shown=target;
    fill.style.width=shown+'%';
    pct.textContent=faN(shown)+'٪';
    if(!finished) requestAnimationFrame(tick);
  })();

  function maybeFinish(){
    if(finished||loaded<total) return;
    const wait=Math.max(0,MIN_TIME-(Date.now()-t0));
    setTimeout(finish,wait);
  }
  function finish(){
    if(finished) return; finished=true;
    target=100; shown=100; fill.style.width='100%'; pct.textContent=faN(100)+'٪';
    setTimeout(()=>{
      sp.classList.add('done');
      document.body.classList.add('ready');
      try{ navigator.vibrate&&navigator.vibrate(20); }catch(e){}
      setTimeout(()=>sp.remove(),750);
    },350);
  }
  // رد کردن با لمس (وقتی لود تموم شده)
  sp.addEventListener('click',()=>{ if(loaded>=total&&Date.now()-t0>900) finish(); });
})();
