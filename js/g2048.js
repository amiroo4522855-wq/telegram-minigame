/* ===== 2048 ===== */
const G2048 = (()=>{
  const CONF={easy:{target:512,undo:5},medium:{target:1024,undo:3},hard:{target:2048,undo:1}};
  const COLS={2:['#eee4da','#776e65'],4:['#ede0c8','#776e65'],8:['#f2b179','#fff'],16:['#f59563','#fff'],32:['#f67c5f','#fff'],64:['#f65e3b','#fff'],128:['#edcf72','#fff'],256:['#edcc61','#fff'],512:['#edc850','#fff'],1024:['#edc53f','#fff'],2048:['#edc22e','#fff']};
  const N=4, GAP=8, PAD=8;
  let grid,score,best,undos,target,over,won,diff,idSeq,hist=[],loggedEnd;

  function col(v){ return COLS[v]||['#3c3a32','#fff']; }
  function emptyCells(){ const o=[]; grid.forEach((row,r)=>row.forEach((c,cc)=>{if(!c)o.push([r,cc]);})); return o; }
  function spawn(){
    const e=emptyCells(); if(!e.length) return;
    const [r,c]=e[Math.random()*e.length|0];
    grid[r][c]={v:Math.random()<0.9?2:4, id:++idSeq, fresh:true};
  }
  function cellPos(bw,r,c){ const cell=(bw-PAD*2-GAP*(N-1))/N; return {cell, x:PAD+c*(cell+GAP), y:PAD+r*(cell+GAP)}; }

  function render(d){
    diff=d; stop();
    const c=CONF[d]||CONF.medium;
    target=c.target; undos=c.undo; score=0; over=false; won=false; idSeq=0; hist=[]; loggedEnd=false;
    best=store.get('best_2048',0);
    grid=Array.from({length:N},()=>Array(N).fill(null));
    spawn(); spawn();
    const box=$('#game-container');
    box.innerHTML=`<div class="panel">
      <div class="hud">
        <div class="h"><b id="t-score">۰</b><small>${icon('star',12)} امتیاز</small></div>
        <div class="h"><b id="t-best">${fa(best)}</b><small>${icon('trophy',12)} رکورد</small></div>
        <div class="h"><b id="t-goal">${fa(target)}</b><small>${icon('target',12)} هدف</small></div>
      </div>
      <div class="t2048" id="t-board">
        ${Array.from({length:16},()=>'<div class="t-bg"></div>').join('')}
        <div id="t-tiles"></div>
        <div class="t-over" id="t-over" style="display:none"></div>
      </div>
      <div class="t-hint">سوایپ کن تا کاشی‌ها قاطی بشن!</div>
      <div class="dpad">
        <span></span><button data-m="up">▲</button><span></span>
        <button data-m="left">▶</button><button data-m="down">▼</button><button data-m="right">◀</button>
      </div>
      <div class="row-btns">
        <button class="btn btn-gold" id="t-undo">${icon('refresh',15)} برگشت (${fa(undos)})</button>
        <button class="btn btn-primary" id="t-new">${icon('refresh',16)} از اول</button>
      </div></div>`;
    draw(false);
    const bd=$('#t-board');
    let sx=0,sy=0;
    bd.addEventListener('touchstart',e=>{const t=e.changedTouches[0];sx=t.clientX;sy=t.clientY;},{passive:true});
    bd.addEventListener('touchend',e=>{
      const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;
      if(Math.hypot(dx,dy)<24) return;
      move(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'));
    },{passive:true});
    bd.addEventListener('mousedown',e=>{sx=e.clientX;sy=e.clientY;});
    bd.addEventListener('mouseup',e=>{
      const dx=e.clientX-sx,dy=e.clientY-sy;
      if(Math.hypot(dx,dy)<24) return;
      move(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'));
    });
    box.querySelectorAll('.dpad button').forEach(b=>b.onclick=()=>move(b.dataset.m));
    $('#t-new').onclick=()=>{haptic();render(diff);};
    $('#t-undo').onclick=undo;
    window.addEventListener('keydown',keys);
  }
  function keys(e){
    const m={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right',W:'up',S:'down',A:'left',D:'right'}[e.key];
    if(m){ e.preventDefault(); move(m); }
  }
  function draw(from){
    const sc=$('#t-score'); if(sc) sc.textContent=fa(score);
    if(score>best){best=score;store.set('best_2048',best);}
    const bs=$('#t-best'); if(bs) bs.textContent=fa(best);
    const layer=$('#t-tiles'), bd=$('#t-board');
    if(!layer||!bd) return;
    layer.innerHTML='';
    const bw=bd.clientWidth;
    grid.forEach((row,r)=>row.forEach((t,c)=>{
      if(!t) return;
      const [bg,fg]=col(t.v);
      const {cell,x,y}=cellPos(bw,r,c);
      const d=document.createElement('div');
      d.className='t-tile'+(t.fresh?' fresh':'')+(t.pop?' pop':'');
      d.style.cssText=`width:${cell}px;height:${cell}px;background:${bg};color:${fg};font-size:${t.v<100?30:t.v<1000?26:20}px;`;
      d.textContent=fa(t.v);
      t.fresh=false; t.pop=false;
      if(from&&from[t.id]){ d.style.transform=from[t.id]; d.style.transition='none'; layer.appendChild(d);
        void d.offsetWidth; d.style.transition=''; d.style.transform=`translate(${x}px,${y}px)`;
      } else { d.style.transform=`translate(${x}px,${y}px)`; layer.appendChild(d); }
    }));
  }
  function slide(line){
    const arr=line.filter(Boolean).map(t=>({v:t.v,id:t.id}));
    let gained=0;
    for(let i=0;i<arr.length-1;i++){
      if(arr[i].v===arr[i+1].v){
        arr[i]={v:arr[i].v*2,id:arr[i].id,pop:true};
        arr.splice(i+1,1); gained+=arr[i].v;
      }
    }
    while(arr.length<N) arr.push(null);
    return {arr,gained};
  }
  function move(dir){
    if(over) return;
    const bd=$('#t-board'); if(!bd) return;
    const bw=bd.clientWidth;
    const from={};
    grid.forEach((row,r)=>row.forEach((t,c)=>{ if(t){ const {x,y}=cellPos(bw,r,c); from[t.id]=`translate(${x}px,${y}px)`; } }));
    const beforeGrid=grid.map(row=>row.map(c=>c?{v:c.v,id:c.id}:null));
    const beforeScore=score;
    const beforeStr=JSON.stringify(beforeGrid.map(r=>r.map(c=>c?c.v:0)));
    let gained=0;
    for(let i=0;i<N;i++){
      let line;
      if(dir==='left') line=[grid[i][0],grid[i][1],grid[i][2],grid[i][3]];
      else if(dir==='right') line=[grid[i][3],grid[i][2],grid[i][1],grid[i][0]];
      else if(dir==='up') line=[grid[0][i],grid[1][i],grid[2][i],grid[3][i]];
      else line=[grid[3][i],grid[2][i],grid[1][i],grid[0][i]];
      const sl=slide(line), arr=sl.arr; gained+=sl.gained;
      for(let j=0;j<N;j++){
        if(dir==='left') grid[i][j]=arr[j];
        else if(dir==='right') grid[i][N-1-j]=arr[j];
        else if(dir==='up') grid[j][i]=arr[j];
        else grid[N-1-j][i]=arr[j];
      }
    }
    const afterStr=JSON.stringify(grid.map(r=>r.map(c=>c?c.v:0)));
    if(beforeStr===afterStr) return;
    hist.push({g:beforeGrid,s:beforeScore});
    if(hist.length>5) hist.shift();
    score+=gained;
    if(gained>0){ const lv=Math.round(Math.log2(Math.max(2,gained))); beep(280+lv*55,.1,'triangle'); haptic('light'); }
    else SFX.tap();
    spawn();
    draw(from);
    updateUndo();
    const mx=maxTile();
    if(!won&&mx>=target){ won=true; winGame(); return; }
    if(isOver()){ over=true; loseGame(); }
  }
  function maxTile(){ let m=0; grid.forEach(r=>r.forEach(c=>{if(c&&c.v>m)m=c.v;})); return m; }
  function undo(){
    if(!hist.length||undos<=0){ toast(undos<=0?'برگشتی نمونده!':'حرکتی برای برگشت نیست!'); return; }
    undos--;
    const h=hist.pop();
    grid=h.g.map(row=>row.map(c=>c?{v:c.v,id:c.id}:null)); score=h.s; over=false;
    const o=$('#t-over'); if(o) o.style.display='none';
    SFX.flip(); haptic('medium'); draw(false); updateUndo();
  }
  function updateUndo(){ const b=$('#t-undo'); if(b) b.innerHTML=`${icon('refresh',15)} برگشت (${fa(undos)})`; }
  function isOver(){
    if(emptyCells().length) return false;
    for(let r=0;r<N;r++)for(let c=0;c<N;c++){
      const v=grid[r][c].v;
      if(c+1<N&&grid[r][c+1].v===v) return false;
      if(r+1<N&&grid[r+1][c].v===v) return false;
    }
    return true;
  }
  function overlay(html){ const o=$('#t-over'); o.innerHTML=html; o.style.display='grid'; }
  function winGame(){
    const reward=(diff==='hard'?110:diff==='medium'?70:40)+Math.floor(score/120);
    store.set('best_g2048',fa(maxTile()));
    if(!loggedEnd){ loggedEnd=true; bumpStat(true); logHistory('g2048','win',`کاشی ${fa(maxTile())}`); }
    addCoins(reward,'2048');
    SFX.win(); confetti(120);
    overlay(`<div class="t-msg"><b>رسیدی به ${fa(target)}! 🎉</b><small>امتیاز ${fa(score)} • 🪙 ${fa(reward)} سکه گرفتی!</small>
      <div class="end-btns"><button class="btn btn-primary" id="t-cont">ادامه بده 🔥</button>
      <button class="btn btn-ghost" id="t-again">از اول</button></div></div>`);
    $('#t-cont').onclick=()=>{$('#t-over').style.display='none';SFX.tap();};
    $('#t-again').onclick=()=>render(diff);
  }
  function loseGame(){
    if(!loggedEnd){ loggedEnd=true; bumpStat(won); logHistory('g2048',won?'win':'lose',`کاشی ${fa(maxTile())} • ${fa(score)}`); }
    const consolation=Math.min(30,Math.floor(score/150));
    if(consolation>0) addCoins(consolation,'تلاش 2048');
    SFX.bad();
    overlay(`<div class="t-msg"><b>بازی تموم شد! 😢</b><small>بزرگ‌ترین کاشی: ${fa(maxTile())} • امتیاز ${fa(score)}</small>
      <div class="end-btns"><button class="btn btn-primary" id="t-again2">🔁 دوباره</button></div></div>`);
    $('#t-again2').onclick=()=>render(diff);
  }
  function stop(){ over=true; try{window.removeEventListener('keydown',keys);}catch(e){} }
  return { render, stop };
})();
