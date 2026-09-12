/* ===== سودوکو ===== */
const SudokuGame = (()=>{
  let sol=[], puz=[], lives=3, hints=3, sel=null, secs=0, timer=null, mistakes=0, over=false, diff='medium';
  const REMOVE={easy:36,medium:46,hard:54};

  function solvedBoard(){
    const g=Array.from({length:9},()=>Array(9).fill(0));
    function ok(r,c,n){
      for(let i=0;i<9;i++) if(g[r][i]===n||g[i][c]===n) return false;
      const br=r-r%3,bc=c-c%3;
      for(let i=0;i<3;i++)for(let j=0;j<3;j++)if(g[br+i][bc+j]===n)return false;
      return true;
    }
    function fill(i=0){
      if(i===81) return true;
      const r=(i/9)|0,c=i%9;
      const nums=[1,2,3,4,5,6,7,8,9].sort(()=>Math.random()-.5);
      for(const n of nums){ if(ok(r,c,n)){g[r][c]=n; if(fill(i+1))return true; g[r][c]=0;} }
      return false;
    }
    fill(); return g;
  }

  function render(d){
    diff=d; stop(); over=false;
    lives=3; hints=3; sel=null; secs=0; mistakes=0;
    sol=solvedBoard(); puz=sol.map(r=>[...r]);
    let rem=REMOVE[d]||46;
    while(rem>0){ const r=Math.random()*9|0,c=Math.random()*9|0;
      if(puz[r][c]!==0){puz[r][c]=0;rem--;} }
    const box=$('#game-container');
    box.innerHTML=`
      <div class="panel">
        <div class="hud">
          <div class="h"><b id="s-lives">${icon('heart',16)} ۳</b><small>جون</small></div>
          <div class="h"><b id="s-time">۰:۰۰</b><small>${icon('clock',12)} زمان</small></div>
          <div class="h"><b id="s-left">${fa(countEmpty())}</b><small>${icon('grid',12)} خونه خالی</small></div>
        </div>
        <div class="sud-grid" id="sud-grid"></div>
        <div class="num-pad" id="num-pad">${[1,2,3,4,5,6,7,8,9].map(n=>`<button data-n="${n}">${'۱۲۳۴۵۶۷۸۹'[n-1]}</button>`).join('')}</div>
        <div class="sud-tools">
          <button class="btn btn-ghost" id="s-erase">${icon('eraser',16)} پاک‌کن</button>
          <button class="btn btn-gold" id="s-hint">${icon('bulb',16)} راهنمایی (${fa(hints)})</button>
          <button class="btn btn-primary" id="s-new">${icon('refresh',16)} جدید</button>
        </div>
      </div>`;
    draw();
    timer=setInterval(()=>{secs++;
      const m=(secs/60)|0,s=secs%60;
      const el=$('#s-time'); if(el) el.textContent=fa(m)+':'+String(s).padStart(2,'0').replace(/\d/g,x=>'۰۱۲۳۴۵۶۷۸۹'[x]);
    },1000);
    $$('#num-pad button').forEach(b=>b.onclick=()=>putNum(+b.dataset.n));
    $('#s-erase').onclick=erase; $('#s-hint').onclick=hint; $('#s-new').onclick=()=>{haptic();render(diff);};
  }
  function countEmpty(){ let n=0; puz.forEach(r=>r.forEach(v=>{if(!v)n++})); return n; }
  function draw(){
    const g=$('#sud-grid'); if(!g) return; g.innerHTML='';
    puz.forEach((row,r)=>row.forEach((v,c)=>{
      const d=document.createElement('div');
      let cls='sud-cell '+(v?(isGiven(r,c)?'given':'user'):'');
      if(sel&&sel.r===r&&sel.c===c) cls+=' sel';
      else if(sel&&(sel.r===r||sel.c===c||(sel.r-sel.r%3===r-r%3&&sel.c-sel.c%3===c-c%3))) cls+=' rel';
      if(sel&&v&&v===puz[sel.r][sel.c]) cls+=' same';
      d.className=cls; d.textContent=v?'۱۲۳۴۵۶۷۸۹'[v-1]:'';
      d.onclick=()=>{ if(over)return; SFX.tap(); haptic('light'); sel={r,c}; draw(); };
      g.appendChild(d);
    }));
  }
  const givens=(()=> {
    // isGiven بر اساس مقایسه با وضعیت اولیه — ذخیره جدا
    let g0=null;
    return {
      set(p){g0=p.map(r=>r.map(v=>v!==0));},
      is(r,c){return g0&&g0[r][c];}
    };
  })();
  // ست کردن givens بعد از ساخت
  const _render = render;
  function isGiven(r,c){ return givens.is(r,c); }

  function putNum(n){
    if(over||!sel) { if(!sel) toast('👆 اول یه خونه رو انتخاب کن!'); return; }
    const {r,c}=sel;
    if(isGiven(r,c)){toast('🔒 این خونه ثابته!');return;}
    if(puz[r][c]!==0&&puz[r][c]===n) return;
    haptic('light');
    if(sol[r][c]===n){
      puz[r][c]=n; SFX.good();
      $('#s-left').textContent=fa(countEmpty());
      draw();
      if(countEmpty()===0) win();
    } else {
      mistakes++; lives--;
      SFX.bad(); haptic('heavy'); notify('error');
      $('#s-lives').innerHTML=icon('heart',16)+' '+fa(Math.max(0,lives));
      const cells=$$('#sud-grid .sud-cell'); const cell=cells[r*9+c];
      cell.classList.add('err'); cell.textContent='۱۲۳۴۵۶۷۸۹'[n-1];
      setTimeout(draw,600);
      if(lives<=0) lose();
      else toast(`❌ اشتباه! ${fa(lives)} جون مونده`);
    }
  }
  function erase(){
    if(over||!sel) return;
    const {r,c}=sel;
    if(isGiven(r,c)){toast('🔒 این خونه ثابته!');return;}
    puz[r][c]=0; SFX.tap(); draw();
  }
  function hint(){
    if(over) return;
    if(hints<=0){toast('💡 راهنمایی‌هات تموم شد!');return;}
    const empt=[];
    puz.forEach((row,r)=>row.forEach((v,c)=>{if(!v)empt.push({r,c});}));
    if(!empt.length) return;
    hints--; SFX.good(); haptic('medium');
    const p=empt[Math.random()*empt.length|0];
    puz[p.r][p.c]=sol[p.r][p.c]; sel=p;
    $('#s-hint').innerHTML=icon('bulb',16)+` راهنمایی (${fa(hints)})`;
    $('#s-left').textContent=fa(countEmpty());
    draw();
    if(countEmpty()===0) win();
  }
  function win(){
    over=true; stop();
    const reward=(diff==='hard'?100:diff==='medium'?60:35)+Math.max(5,50-((secs/10)|0))-mistakes*3;
    bumpStat(true,'sudoku');
    logHistory('sudoku','win',`${fa(secs)} ثانیه • ${fa(mistakes)} اشتباه`);
    store.set('best_sudoku', fa(secs)+' ثانیه 🧠');
    addCoins(Math.max(15,reward),'سودوکو 🔢');
    showEnd(true,'استاد سودوکو! 🧠',`جدول رو توی <b>${fa(secs)} ثانیه</b> با <b>${fa(mistakes)} اشتباه</b> حل کردی!<br>🪙 <b>${fa(Math.max(15,reward))} سکه</b> گرفتی!`,()=>render(diff));
  }
  function lose(){
    over=true; stop();
    bumpStat(false,'sudoku'); addCoins(5,'تلاش در سودوکو 💪');
    logHistory('sudoku','lose','جون‌ها تموم شد');
    showEnd(false,'جون‌هات تموم شد! 😢',`اشکال نداره، استادها هم می‌بازن!<br>یه دست دیگه بزن 💪`,()=>render(diff));
  }
  function stop(){ clearInterval(timer); timer=null; }

  // هوک کردن render برای ثبت givens
  return {
    render(d){ _render(d); givens.set(puz); draw(); },
    stop
  };
})();
