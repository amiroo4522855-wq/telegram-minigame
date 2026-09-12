/* ===== بازی کاشی (حافظه) ===== */
const MemoryGame = (()=>{
  const EMOJIS = ['🍕','🚀','🦄','🐼','🍩','⚽','🎧','🌈','🐙','🍉','🦁','🎮','🐝','🌵','🍦','👾','🐬','🔥','🎸','🍓','🦋','🤖','🍀','⭐'];
  const CONF = { easy:{pairs:6,cols:3}, medium:{pairs:8,cols:4}, hard:{pairs:12,cols:4} };
  let first=null, lock=false, matched=0, moves=0, secs=0, timer=null, total=0, started=false;

  function render(diff){
    const c = CONF[diff]||CONF.medium;
    stop();
    first=null; lock=false; matched=0; moves=0; secs=0; total=c.pairs; started=false;
    const deck = [...EMOJIS].sort(()=>Math.random()-.5).slice(0,c.pairs);
    const cards = [...deck,...deck].sort(()=>Math.random()-.5);
    const box = $('#game-container');
    box.innerHTML = `
      <div class="panel">
        <div class="hud">
          <div class="h"><b id="m-moves">۰</b><small>${icon('pointer',12)} حرکت</small></div>
          <div class="h"><b id="m-match">۰/${fa(total)}</b><small>${icon('check',12)} جفت</small></div>
          <div class="h"><b id="m-time">۰:۰۰</b><small>${icon('clock',12)} زمان</small></div>
        </div>
        <div class="mem-grid" id="mem-grid" style="grid-template-columns:repeat(${c.cols},1fr)"></div>
        <div class="row-btns">
          <button class="btn btn-primary" id="m-new">${icon('refresh',16)} از اول</button>
          <button class="btn btn-ghost" id="m-peek">${icon('eye',16)} نگاه سریع</button>
        </div>
      </div>`;
    const grid = $('#mem-grid');
    cards.forEach(e=>{
      const d=document.createElement('div');
      d.className='tile'; d.dataset.e=e;
      d.innerHTML=`<div class="face front"></div><div class="face back">${e}</div>`;
      d.onclick=()=>flip(d);
      grid.appendChild(d);
    });
    $('#m-new').onclick=()=>{haptic();render(diff);};
    $('#m-peek').onclick=(ev)=>{
      if(started){toast('👀 فقط قبل از شروع!');return;}
      haptic(); SFX.flip();
      $$('#mem-grid .tile').forEach(t=>t.classList.add('flip'));
      setTimeout(()=>$$('#mem-grid .tile').forEach(t=>t.classList.remove('flip')),900);
      ev.currentTarget.disabled=true;
    };
  }
  function tick(){
    secs++;
    const m=Math.floor(secs/60), s=secs%60;
    $('#m-time').textContent = fa(m)+':'+String(s).padStart(2,'0').replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
  }
  function flip(d){
    if(lock||d.classList.contains('flip')) return;
    if(!started){started=true;timer=setInterval(tick,1000);}
    haptic('light'); SFX.flip();
    d.classList.add('flip');
    if(!first){first=d;return;}
    moves++; $('#m-moves').textContent=fa(moves);
    if(first.dataset.e===d.dataset.e){
      setTimeout(()=>{first.classList.add('done');d.classList.add('done');SFX.good();haptic('medium');},250);
      first=null; matched++;
      $('#m-match').textContent=fa(matched)+'/'+fa(total);
      if(matched===total) setTimeout(win,600);
    } else {
      lock=true;
      const a=first; first=null;
      setTimeout(()=>{a.classList.add('wrong');d.classList.add('wrong');},250);
      setTimeout(()=>{a.classList.remove('flip','wrong');d.classList.remove('flip','wrong');lock=false;},950);
    }
  }
  function win(){
    stop();
    const diff = currentDiff();
    const bonus = diff==='hard'?60:diff==='medium'?35:20;
    const timeBonus = Math.max(5, 60-Math.floor(secs/2));
    const moveBonus = Math.max(5, (total*3)-moves);
    const reward = bonus+timeBonus+moveBonus;
    bumpStat(true,'memory');
    logHistory('memory','win',`${fa(moves)} حرکت • ${fa(secs)} ثانیه`);
    store.set('best_memory', fa(moves)+' حرکت ⚡');
    addCoins(reward,'حافظه 🃏');
    showEnd(true,'آفرین! 🧠',`همه جفت‌ها رو توی <b>${fa(moves)} حرکت</b> و <b>${fa(secs)} ثانیه</b> پیدا کردی!<br>🪙 <b>${fa(reward)} سکه</b> گرفتی!`,()=>render(diff));
  }
  function stop(){ clearInterval(timer); timer=null; }
  function currentDiff(){ return document.querySelector('.diff-btn.active')?.dataset.diff||'medium'; }
  return { render, stop };
})();
