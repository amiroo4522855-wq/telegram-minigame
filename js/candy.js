/* ===== آبنبات (مچ-۳) ===== */
const CandyGame = (()=>{
  const N=8, TYPES=6;
  const CONF={easy:{target:2000,moves:25},medium:{target:3500,moves:22},hard:{target:5500,moves:20}};
  let grid,score,moves,target,hints,diff,over,busy,sel,idSeq,nodes;
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const rnd=()=>Math.random()*TYPES|0;

  function render(d){
    diff=d; stop();
    const c=CONF[d]||CONF.medium;
    target=c.target;moves=c.moves;score=0;hints=3;over=false;busy=false;sel=null;idSeq=0;nodes={};
    newBoard();
    const box=$('#game-container');
    box.innerHTML=`<div class="panel">
      <div class="candy-top"><small>هدف: ${fa(target)} امتیاز</small><b id="c-score">${fa(score)}</b></div>
      <div class="quiz-prog"><i id="c-prog" style="width:0%"></i></div>
      <div class="hud">
        <div class="h"><b id="c-moves">${fa(moves)}</b><small>${icon('bolt',12)} حرکت</small></div>
        <div class="h"><b id="c-hints">${fa(hints)}</b><small>${icon('bulb',12)} راهنما</small></div>
      </div>
      <div class="candy-board" id="c-board"><div id="c-layer"></div></div>
      <div class="t-hint">بکش تا جابه‌جا بشن! ۴تایی = انفجار خطی 💥</div>
      <div class="row-btns">
        <button class="btn btn-gold" id="c-hint">${icon('bulb',15)} راهنمایی</button>
        <button class="btn btn-primary" id="c-new">${icon('refresh',16)} از اول</button>
      </div></div>`;
    draw(null);
    bindInput();
    $('#c-new').onclick=()=>{haptic();render(diff);};
    $('#c-hint').onclick=showHint;
  }
  function newBoard(){
    grid=[];
    for(let r=0;r<N;r++){grid.push([]);
      for(let c=0;c<N;c++){
        let t;
        do{ t=rnd(); }while(
          (c>=2&&grid[r][c-1].t===t&&grid[r][c-2].t===t)||
          (r>=2&&grid[r-1][c].t===t&&grid[r-2][c].t===t));
        grid[r].push({t,id:++idSeq});
      }
    }
  }
  function bw(){ const l=$('#c-layer'); return l?l.clientWidth:300; }
  function cellXY(r,c){ const w=bw(),s=w/N; return {s,x:c*s,y:r*s}; }
  /* رندر با نودهای ماندگار: جابه‌جایی و سقوط انیمیشن نرم دارن */
  function draw(falls){
    const layer=$('#c-layer'); if(!layer) return;
    const seen=new Set();
    grid.forEach((row,r)=>row.forEach((cell,c)=>{
      if(!cell) return;
      seen.add(cell.id);
      const {s,x,y}=cellXY(r,c);
      let d=nodes[cell.id];
      if(!d){
        d=document.createElement('div');
        d.innerHTML='<i></i>';
        d.style.width=s+'px'; d.style.height=s+'px';
        d.className='candy cd'+cell.t;
        d.dataset.r=r; d.dataset.c=c;
        const startY=(falls&&falls[cell.id]!==undefined)?falls[cell.id]:(y-s*1.5);
        d.style.transition='none';
        d.style.transform=`translate(${x}px,${startY}px)`;
        layer.appendChild(d);
        nodes[cell.id]=d;
        void d.offsetWidth;
        d.style.transition='';
        d.style.transform=`translate(${x}px,${y}px)`;
      } else {
        d.style.width=s+'px'; d.style.height=s+'px';
        const cls='candy cd'+cell.t+(cell.pop?' popping':'')+(sel&&sel.r===r&&sel.c===c?' sel':'');
        if(d.className!==cls&&!d.className.includes('shake')&&!d.className.includes('hot')) d.className=cls;
        else { d.classList.toggle('sel',!!(sel&&sel.r===r&&sel.c===c)); d.classList.toggle('popping',!!cell.pop); }
        d.dataset.r=r; d.dataset.c=c;
        d.style.transform=`translate(${x}px,${y}px)`;
      }
    }));
    for(const id in nodes){ if(!seen.has(+id)){ nodes[id].remove(); delete nodes[id]; } }
  }
  function bindInput(){
    const bd=$('#c-board');
    let sx=0,sy=0,sr=0,sc=0,down=false;
    const pos=e=>{ const rect=bd.getBoundingClientRect(); const t=e.touches?e.touches[0]:e;
      return {r:Math.floor((t.clientY-rect.top)/(rect.width/N)), c:Math.floor((t.clientX-rect.left)/(rect.width/N)), x:t.clientX, y:t.clientY}; };
    const swipe=(dx,dy)=>{
      if(Math.hypot(dx,dy)>20){
        const dr=Math.abs(dy)>Math.abs(dx)?(dy>0?1:-1):0;
        const dc=Math.abs(dx)>=Math.abs(dy)?(dx>0?1:-1):0;
        trySwap(sr,sc,sr+dr,sc+dc);
      } else tapCell(sr,sc);
    };
    bd.addEventListener('touchstart',e=>{ if(busy||over)return; const p=pos(e); if(p.r<0||p.r>=N||p.c<0||p.c>=N)return; down=true;sr=p.r;sc=p.c;sx=p.x;sy=p.y; },{passive:true});
    bd.addEventListener('touchend',e=>{ e.preventDefault(); if(!down||busy||over)return; down=false;
      const t=e.changedTouches[0]; swipe(t.clientX-sx,t.clientY-sy); },{passive:false});
    bd.addEventListener('mousedown',e=>{ if(busy||over)return; const p=pos(e); if(p.r<0||p.r>=N||p.c<0||p.c>=N)return; down=true;sr=p.r;sc=p.c;sx=p.x;sy=p.y; });
    bd.addEventListener('mouseup',e=>{ if(!down||busy||over)return; down=false; swipe(e.clientX-sx,e.clientY-sy); });
  }
  function tapCell(r,c){
    if(sel&&sel.r===r&&sel.c===c){ sel=null; draw(null); return; }
    if(sel&&Math.abs(sel.r-r)+Math.abs(sel.c-c)===1){ const s=sel; sel=null; trySwap(s.r,s.c,r,c); return; }
    sel={r,c}; draw(null);
    SFX.tap();
  }
  function inB(r,c){ return r>=0&&r<N&&c>=0&&c<N; }
  function findMatches(){
    const out=[];
    for(let r=0;r<N;r++){ let c=0;
      while(c<N){
        if(!grid[r][c]){c++;continue;}
        let len=1; while(c+len<N&&grid[r][c+len]&&grid[r][c+len].t===grid[r][c].t) len++;
        if(len>=3){ const cells=[]; for(let i=0;i<len;i++)cells.push([r,c+i]); out.push({cells,dir:'h'}); }
        c+=len;
      }
    }
    for(let c=0;c<N;c++){ let r=0;
      while(r<N){
        if(!grid[r][c]){r++;continue;}
        let len=1; while(r+len<N&&grid[r+len][c]&&grid[r+len][c].t===grid[r][c].t) len++;
        if(len>=3){ const cells=[]; for(let i=0;i<len;i++)cells.push([r+i,c]); out.push({cells,dir:'v'}); }
        r+=len;
      }
    }
    return out;
  }
  function matchAt(r,c){
    if(!grid[r]||!grid[r][c]) return false;
    const t=grid[r][c].t;
    const hor=(grid[r][c-1]?.t===t&&grid[r][c-2]?.t===t)||(grid[r][c+1]?.t===t&&grid[r][c+2]?.t===t)||(grid[r][c-1]?.t===t&&grid[r][c+1]?.t===t);
    const ver=(grid[r-1]?.[c]?.t===t&&grid[r-2]?.[c]?.t===t)||(grid[r+1]?.[c]?.t===t&&grid[r+2]?.[c]?.t===t)||(grid[r-1]?.[c]?.t===t&&grid[r+1]?.[c]?.t===t);
    return hor||ver;
  }
  function findMove(){
    for(let r=0;r<N;r++)for(let c=0;c<N;c++){
      for(const[dr,dc]of[[0,1],[1,0]]){
        const r2=r+dr,c2=c+dc;
        if(!inB(r2,c2))continue;
        [grid[r][c],grid[r2][c2]]=[grid[r2][c2],grid[r][c]];
        const ok=matchAt(r,c)||matchAt(r2,c2);
        [grid[r][c],grid[r2][c2]]=[grid[r2][c2],grid[r][c]];
        if(ok) return [[r,c],[r2,c2]];
      }
    }
    return null;
  }
  async function trySwap(r1,c1,r2,c2){
    if(over||busy||!inB(r1,c1)||!inB(r2,c2)) return;
    busy=true; sel=null;
    [grid[r1][c1],grid[r2][c2]]=[grid[r2][c2],grid[r1][c1]];
    SFX.flip(); draw(null);
    await sleep(230); if(over) return;
    if(!findMatches().length){
      [grid[r1][c1],grid[r2][c2]]=[grid[r2][c2],grid[r1][c1]];
      draw(null); await sleep(230); if(over) return;
      shakeCells([[r1,c1],[r2,c2]]); haptic('light');
      busy=false; return;
    }
    moves--; updHUD();
    let chain=0;
    for(;;){
      const ms=findMatches();
      if(!ms.length) break;
      chain++;
      await crush(ms,chain);
      if(over) return;
    }
    if(chain>=2){ toast(`کمبو ×${fa(chain)}! 🔥`); }
    if(score>=target){ winGame(); return; }
    if(moves<=0){ loseGame(); return; }
    if(!findMove()){ shuffleBoard(); toast('حرکتی نبود — قاطی شد! 🔀'); }
    busy=false;
  }
  function shakeCells(cells){
    cells.forEach(([r,c])=>{
      const cell=grid[r]&&grid[r][c]; if(!cell) return;
      const el=nodes[cell.id]; if(!el) return;
      el.classList.add('shake');
      setTimeout(()=>el.classList&&el.classList.remove('shake'),320);
    });
  }
  async function crush(ms,chain){
    const kill=new Set();
    let bonus=0;
    ms.forEach(m=>{
      m.cells.forEach(([r,c])=>kill.add(r*N+c));
      if(m.cells.length>=5){ // پاک کردن کل اون رنگ
        const [r,c]=m.cells[0], t=grid[r][c].t;
        grid.forEach((row,rr)=>row.forEach((cell,cc)=>{if(cell&&cell.t===t)kill.add(rr*N+cc);}));
        bonus+=300; popups(`پاکسازی رنگ! +${fa(300*chain)}`);
      } else if(m.cells.length===4){ // انفجار صلیبی
        const [r,c]=m.cells[Math.floor(m.cells.length/2)];
        for(let i=0;i<N;i++){kill.add(r*N+i);kill.add(i*N+c);}
        bonus+=120; popups(`انفجار! +${fa(120*chain)}`);
      }
    });
    const n=kill.size;
    score+=(n*20+bonus)*chain;
    updHUD();
    beep(400+chain*120,.12,'triangle'); haptic('light');
    kill.forEach(k=>{ const r=(k/N)|0,c=k%N; if(grid[r][c]) grid[r][c].pop=true; });
    draw(null);
    await sleep(260); if(over) return;
    kill.forEach(k=>{ const r=(k/N)|0,c=k%N; grid[r][c]=null; });
    // سقوط + آبنبات‌های تازه از بالا
    const beforeMax=idSeq;
    for(let c=0;c<N;c++){
      let write=N-1;
      for(let r=N-1;r>=0;r--){
        if(grid[r][c]){ if(write!==r){ grid[write][c]=grid[r][c]; grid[r][c]=null; } write--; }
      }
      for(let r=write;r>=0;r--) grid[r][c]={t:rnd(),id:++idSeq};
    }
    const falls={}, s=bw()/N;
    grid.forEach((row,r)=>row.forEach((cell,c)=>{
      if(cell&&cell.id>beforeMax) falls[cell.id]=r*s-(r+2.5)*s;
    }));
    draw(falls);
    await sleep(300);
  }
  function popups(txt){ toast(txt); }
  function shuffleBoard(){
    const all=[];
    grid.forEach(row=>row.forEach(c=>all.push(c.t)));
    do{
      for(let i=all.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[all[i],all[j]]=[all[j],all[i]];}
      grid.forEach((row,r)=>row.forEach((c,cc)=>grid[r][cc]={t:all[r*N+cc],id:++idSeq}));
    }while(findMatches().length||!findMove());
    draw(null);
  }
  function showHint(){
    if(over||busy) return;
    if(hints<=0){toast('راهنمایی نمونده!');return;}
    const m=findMove();
    if(!m){shuffleBoard();return;}
    hints--; updHUD(); SFX.flip();
    m.forEach(([r,c])=>{
      const cell=grid[r][c]; if(!cell) return;
      const el=nodes[cell.id];
      if(el) el.classList.add('hot');
    });
    setTimeout(()=>{ $$('.candy.hot').forEach(e=>e.classList.remove('hot')); },1400);
  }
  function updHUD(){
    const s=$('#c-score'); if(s)s.textContent=fa(score);
    const p=$('#c-prog'); if(p)p.style.width=Math.min(100,score/target*100)+'%';
    const m=$('#c-moves'); if(m){m.textContent=fa(moves);m.classList.toggle('low',moves<=5);}
    const h=$('#c-hints'); if(h)h.textContent=fa(hints);
  }
  function winGame(){
    over=true;
    const reward=(diff==='hard'?110:diff==='medium'?70:40)+Math.floor(score/60);
    store.set('best_candy',fa(score));
    bumpStat(true); logHistory('candy','win',`${fa(score)} امتیاز`);
    addCoins(reward,'آبنبات');
    showEnd(true,'شیرین مثل آبنبات! 🍬',`به هدف <b>${fa(target)}</b> رسیدی!<br>امتیاز: <b>${fa(score)}</b><br>🪙 <b>${fa(reward)} سکه</b> گرفتی!`,()=>render(diff));
  }
  function loseGame(){
    over=true;
    bumpStat(false); logHistory('candy','lose',`${fa(score)} امتیاز`);
    addCoins(8,'تلاش در آبنبات');
    showEnd(false,'حرکت‌ها تموم شد! 😢',`امتیازت <b>${fa(score)}</b> شد، هدف <b>${fa(target)}</b> بود.<br>۴تایی بچین تا بترکونی! 💥`,()=>render(diff));
  }
  function stop(){ over=true; busy=false; }
  return { render, stop };
})();
