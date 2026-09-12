/* ===== آیس اسلاید ===== */
const IceSlideGame = (()=>{
  function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
  const DIRS=[[0,1],[0,-1],[1,0],[-1,0]];
  const THEMES=['یخ کلاسیک ❄️','شفق قطبی 🌌','آب‌نبات 🍬','اقیانوس عمیق 🌊'];
  function solve(L){
    const N=L.N,g=L.grid,s=L.start[0]*N+L.start[1],gl=L.goal[0]*N+L.goal[1];
    if(s===gl) return 0;
    const slide=(r,c,dr,dc)=>{ while(g[r+dr]!==undefined&&g[r+dr][c+dc]!==undefined&&g[r+dr][c+dc]!=='#'){r+=dr;c+=dc;} return r*N+c; };
    const seen=new Set([s]);
    let q=[[s,0]];
    while(q.length){
      const nq=[];
      for(const [st,d] of q){
        const r=(st/N)|0,c=st%N;
        for(const [dr,dc] of DIRS){
          const ns=slide(r,c,dr,dc);
          if(ns===gl) return d+1;
          if(!seen.has(ns)){ seen.add(ns); nq.push([ns,d+1]); }
        }
      }
      q=nq;
    }
    return null;
  }
  function buildCandidate(lv,att){
    const rng=mulberry32(lv*7919+13+att*101);
    const N=lv<7?7:lv<13?8:9;
    const g=Array.from({length:N},(_,r)=>Array.from({length:N},(_,c)=>(r===0||c===0||r===N-1||c===N-1)?'#':(rng()<0.15?'#':'.')));
    const isW=(r,c)=>r<0||c<0||r>=N||c>=N||g[r][c]==='#';
    const free=[]; for(let r=1;r<N-1;r++)for(let c=1;c<N-1;c++)if(g[r][c]==='.')free.push([r,c]);
    const goal=free[(rng()*free.length)|0];
    let gd=DIRS.filter(([dr,dc])=>isW(goal[0]+dr,goal[1]+dc)&&!isW(goal[0]-dr,goal[1]-dc));
    if(!gd.length){
      const opts=DIRS.filter(([dr,dc])=>!isW(goal[0]-dr,goal[1]-dc));
      if(!opts.length){ const d=DIRS[(rng()*4)|0]; g[goal[0]+d[0]][goal[1]+d[1]]='.'; }
      else { const d=opts[(rng()*opts.length)|0],nr=goal[0]+d[0],nc=goal[1]+d[1];
        if(nr>0&&nc>0&&nr<N-1&&nc<N-1) g[nr][nc]='#'; }
      gd=DIRS.filter(([dr,dc])=>isW(goal[0]+dr,goal[1]+dc)&&!isW(goal[0]-dr,goal[1]-dc));
      if(!gd.length) return null;
    }
    const K=4+Math.min(lv,10);
    let cur=goal.slice(),steps=0;
    for(let k=0;k<K;k++){
      const ds=DIRS.filter(([dr,dc])=>isW(cur[0]+dr,cur[1]+dc)&&!isW(cur[0]-dr,cur[1]-dc));
      if(!ds.length) break;
      const d=ds[(rng()*ds.length)|0];
      const run=[]; let r=cur[0]-d[0],c=cur[1]-d[1];
      while(!isW(r,c)){ run.push([r,c]); r-=d[0]; c-=d[1]; }
      if(!run.length) break;
      cur=run[(rng()*run.length)|0]; steps++;
    }
    if(steps>=2&&(cur[0]!==goal[0]||cur[1]!==goal[1]))
      return {N,grid:g.map(r=>r.join('')),start:cur,goal,par:steps};
    return null;
  }
  function genLevel(lv){
    const want=lv<4?2:lv<7?3:lv<13?4:5;
    let best=null,bestOpt=-1;
    for(let att=0;att<100;att++){
      const c=buildCandidate(lv,att);
      if(!c) continue;
      const opt=solve(c);
      if(opt===null||opt<1) continue;
      if(opt>bestOpt){ bestOpt=opt; best=c; }
      if(opt>=want&&opt<=16) break;
    }
    if(best){ best.par=bestOpt; return best; }
    return {N:6,grid:['######','#S..G#','#....#','#....#','#....#','######'],start:[1,1],goal:[1,4],par:1};
  }
  function parseHand(N,rows,par){
    let start,goal;
    const grid=rows.map((row,r)=>[...row].map((ch,c)=>{ if(ch==='S'){start=[r,c];return '.';} if(ch==='G'){goal=[r,c];return '.';} return ch; }).join(''));
    return {N,grid,start,goal,par};
  }
  const GEN50=[{"N":8,"grid":["########","##.....#","#....#.#","#......#","##.#.###","#...#..#","#......#","########"],"start":[5,2],"goal":[6,5],"par":5},{"N":8,"grid":["########","#...#..#","#......#","#.....##","#...#..#","#...##.#","#.#.#..#","########"],"start":[3,4],"goal":[6,5],"par":5},{"N":8,"grid":["########","#..#...#","#......#","#......#","#....#.#","#......#","#.#..#.#","########"],"start":[2,5],"goal":[2,3],"par":5},{"N":8,"grid":["########","#....#.#","#..#...#","#...#..#","#.....##","##..#..#","#.#...##","########"],"start":[4,3],"goal":[3,5],"par":5},{"N":8,"grid":["########","#.#.#.##","#...#..#","#....#.#","#.#....#","#.....##","#..#...#","########"],"start":[3,2],"goal":[6,5],"par":5},{"N":9,"grid":["#########","#.......#","#.......#","#..#..#.#","#..#.#..#","#...#.#.#","#...#.###","##....#.#","#########"],"start":[2,5],"goal":[7,5],"par":5},{"N":9,"grid":["#########","#.#..#..#","#.......#","#..#....#","#.....#.#","###.....#","#......##","##.#....#","#########"],"start":[2,6],"goal":[2,3],"par":5},{"N":9,"grid":["#########","#.......#","#......##","##......#","#.......#","#...#...#","#.......#","##......#","#########"],"start":[6,5],"goal":[1,6],"par":5},{"N":9,"grid":["#########","#...#.#.#","#.......#","#..#...##","#....#..#","#.#.....#","#.....#.#","#.......#","#########"],"start":[6,2],"goal":[5,6],"par":5},{"N":9,"grid":["#########","#....##.#","#.....###","#...#...#","#.#.....#","#......##","#.#.....#","#..#....#","#########"],"start":[4,6],"goal":[7,2],"par":5},{"N":9,"grid":["#########","#.##....#","#.......#","#.#.....#","#.#.##..#","##..#..##","#.....#.#","#.#.....#","#########"],"start":[6,2],"goal":[4,1],"par":5},{"N":9,"grid":["#########","#.#...###","#.##....#","#....#..#","#.......#","#...#...#","##.#....#","##......#","#########"],"start":[4,3],"goal":[2,5],"par":5},{"N":9,"grid":["#########","##...####","#.#.#...#","##......#","#.......#","#..##...#","##..##..#","#.#.#..##","#########"],"start":[4,5],"goal":[7,5],"par":5},{"N":9,"grid":["#########","#....#..#","##......#","#...#...#","#.......#","#.#..#..#","#.......#","#...#...#","#########"],"start":[4,6],"goal":[2,4],"par":6},{"N":9,"grid":["#########","#.......#","##.#..#.#","#.##....#","#.......#","#..##..##","##.#..#.#","#..#....#","#########"],"start":[4,6],"goal":[6,5],"par":6},{"N":9,"grid":["#########","#...#..##","#.##..#.#","#....#..#","##..#...#","#.......#","#.......#","#.......#","#########"],"start":[6,2],"goal":[1,6],"par":6},{"N":9,"grid":["#########","#.......#","#....##.#","##......#","#.#.....#","#..###..#","##......#","#.....#.#","#########"],"start":[5,7],"goal":[6,5],"par":6},{"N":9,"grid":["#########","#...#...#","##.#....#","#....#..#","###..#..#","##..#...#","##......#","#..#....#","#########"],"start":[3,7],"goal":[5,3],"par":6},{"N":9,"grid":["#########","#.#.....#","#.......#","#..#.#..#","##......#","#..#..###","#.......#","#.......#","#########"],"start":[7,6],"goal":[3,1],"par":6},{"N":9,"grid":["#########","##....#.#","#....##.#","#...#..##","###.#...#","#.....#.#","#....#.##","#.......#","#########"],"start":[5,3],"goal":[5,7],"par":6},{"N":9,"grid":["#########","#.#.....#","#......##","##...#..#","#..#....#","#.#....##","#..#..#.#","#....#..#","#########"],"start":[5,1],"goal":[5,3],"par":6},{"N":9,"grid":["#########","#....#..#","##......#","##....#.#","#.#.....#","#.......#","###.#.#.#","#.....#.#","#########"],"start":[6,7],"goal":[1,4],"par":6},{"N":9,"grid":["#########","#..#.#..#","#....####","##...#.##","#.##.##.#","#....#..#","#.##....#","#..#..#.#","#########"],"start":[5,7],"goal":[6,5],"par":6},{"N":9,"grid":["#########","##..#...#","##......#","##.##...#","#.#..####","#.#...#.#","#...#...#","#.......#","#########"],"start":[7,2],"goal":[5,3],"par":6},{"N":9,"grid":["#########","##......#","#.....#.#","#.....###","#.....#.#","#..#....#","#......##","#...#..##","#########"],"start":[3,2],"goal":[4,7],"par":6},{"N":9,"grid":["#########","#.#.....#","#....##.#","#..#....#","##......#","###..#..#","#...#...#","#.......#","#########"],"start":[1,5],"goal":[2,2],"par":6},{"N":9,"grid":["#########","#.#..##.#","#.#..#..#","#..##..##","#.#...#.#","#.......#","#..#.#..#","#....#.##","#########"],"start":[6,1],"goal":[5,6],"par":6},{"N":9,"grid":["#########","#......##","#.###...#","#.....#.#","#.#....##","#...#...#","#.#.....#","#..#....#","#########"],"start":[2,1],"goal":[6,4],"par":7},{"N":9,"grid":["#########","#..#...##","#.....#.#","#.#.#...#","##......#","#......##","#..#..#.#","#.....#.#","#########"],"start":[4,6],"goal":[3,1],"par":7},{"N":9,"grid":["#########","##..#..##","#....#..#","####.##.#","#.......#","#.......#","###...###","###...#.#","#########"],"start":[6,4],"goal":[1,5],"par":7}];
  const LEVELS=[
    parseHand(6,['######','#S..G#','#....#','#....#','#....#','######'],1),
    parseHand(6,['######','#S..##','#...##','##..G#','#....#','######'],4),
    ...Array.from({length:18},(_,i)=>genLevel(i+2)),
    ...GEN50,
  ];
  /* مرتب‌سازی صعودی مرحله‌های ۲ تا ۲۰ برای منحنی سختی صاف (مرحله آموزشی اول سر جاش) */
  LEVELS.splice(1,19,...LEVELS.slice(1,20).sort((a,b)=>a.par-b.par));
  let diff,lv,pos,moves,undoStack,busy,over,starMap,slideT,keyH;
  function totalStars(){ return Object.values(starMap||{}).reduce((a,b)=>a+b,0); }
  function render(d){
    diff=d; stop(); over=false;
    starMap=store.get('is_stars',{});
    showSelect();
  }
  function unlockedGet(){ return store.get('is_unlocked',1); }
  function showSelect(){
    stop(); over=false;
    const un=unlockedGet(), tot=totalStars();
    const box=$('#game-container');
    box.innerHTML=`<div class="panel">
      <div class="is-head"><b>🧊 آیس اسلاید</b><small>پنگوئن رو به ماهی برسون! 🐧🐟</small></div>
      <div class="is-total"><span>⭐ ${fa(tot)}/${fa(LEVELS.length*3)}</span><div class="is-prog"><i style="width:${tot/(LEVELS.length*3)*100}%"></i></div></div>
      <div class="is-grid">${LEVELS.map((L,i)=>{
        const lock=i+1>un, st=starMap[i]||0;
        return `<button class="is-lv${lock?' lock':''}" data-i="${i}" ${lock?'disabled':''}><b>${fa(i+1)}</b><small>${lock?'🔒':'★'.repeat(st)+'☆'.repeat(3-st)}</small><em>${THEMES[i%4].split(' ')[0]}</em></button>`;
      }).join('')}</div>
      <div class="t-hint">بکش تا سر بخوره! به دیوار که بخوره وایمیسته 🧊</div>
    </div>`;
    box.querySelectorAll('.is-lv:not(.lock)').forEach(b=>b.onclick=()=>{ SFX.tap(); haptic('light'); play(+b.dataset.i); });
  }
  function pct(v,N){ return (v*100/N)+'%'; }
  function play(i){
    stop();
    lv=i; over=false; busy=false; moves=0; undoStack=[];
    const L=LEVELS[lv]; pos=L.start.slice();
    const th=lv%4, rng=mulberry32(lv*331+7);
    const box=$('#game-container');
    let walls='';
    L.grid.forEach((row,r)=>[...row].forEach((ch,c)=>{
      if(ch==='#') walls+=`<div class="is-wall" style="left:${pct(c,L.N)};top:${pct(r,L.N)};width:${100/L.N}%;height:${100/L.N}%"></div>`;
    }));
    let snow='';
    for(let k=0;k<10;k++){
      const sr=1+rng()*(L.N-2), sc=1+rng()*(L.N-2);
      snow+=`<span class="is-snow" style="left:${pct(sc,L.N)};top:${pct(sr,L.N)};font-size:${9+rng()*9}px;animation-delay:${(rng()*2).toFixed(1)}s">❄</span>`;
    }
    box.innerHTML=`<div class="panel">
      <div class="is-top"><button class="btn btn-ghost is-back" id="is-back">‹ مرحله‌ها</button>
        <b>مرحله ${fa(lv+1)}</b>
        <span class="is-mv">حرکت <b id="is-moves">۰</b> / پار ${fa(L.par)}</span></div>
      <div class="is-sub"><span class="is-theme">${THEMES[th]}</span><span class="is-stars" id="is-stars">★★★</span></div>
      <div class="is-board is-th${th}" id="is-board">${walls}${snow}<div class="is-pond" style="left:${pct(L.goal[1],L.N)};top:${pct(L.goal[0],L.N)};width:${100/L.N}%;height:${100/L.N}%"></div><div class="is-goal" id="is-goal" style="left:${pct(L.goal[1],L.N)};top:${pct(L.goal[0],L.N)};width:${100/L.N}%;height:${100/L.N}%">🐟</div><div class="is-p" id="is-p">🐧</div></div>
      <div class="row-btns"><button class="btn btn-ghost" id="is-undo">↩️ برگرد</button><button class="btn btn-gold" id="is-re">🔁 از اول</button></div>
      <div class="is-pad"><span></span><button data-d="-1,0">▲</button><span></span><button data-d="0,-1">◀</button><button data-d="1,0">▼</button><button data-d="0,1">▶</button></div>
    </div>`;
    toast(`مرحله ${fa(lv+1)} • پار ${fa(L.par)} • ${THEMES[th]}`);
    const p=$('#is-p');
    p.style.width=(100/L.N)+'%'; p.style.height=(100/L.N)+'%';
    setPPos(false);
    const bd=$('#is-board');
    const fs=Math.max(18,bd.clientWidth/L.N*0.66);
    p.style.fontSize=fs+'px'; $('#is-goal').style.fontSize=fs+'px';
    let sx=0,sy=0,down=false;
    bd.addEventListener('touchstart',e=>{ const t=e.touches[0]; sx=t.clientX; sy=t.clientY; },{passive:true});
    bd.addEventListener('touchend',e=>{
      const t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;
      if(Math.hypot(dx,dy)>24){
        if(Math.abs(dx)>Math.abs(dy)) tryMove(0,dx>0?1:-1); else tryMove(dy>0?1:-1,0);
      }
    });
    bd.addEventListener('mousedown',e=>{ down=true; sx=e.clientX; sy=e.clientY; });
    bd.addEventListener('mouseup',e=>{ if(!down) return; down=false;
      const dx=e.clientX-sx,dy=e.clientY-sy;
      if(Math.hypot(dx,dy)>24){
        if(Math.abs(dx)>Math.abs(dy)) tryMove(0,dx>0?1:-1); else tryMove(dy>0?1:-1,0);
      }
    });
    box.querySelectorAll('.is-pad button').forEach(b=>b.onclick=()=>{ const [dr,dc]=b.dataset.d.split(',').map(Number); tryMove(dr,dc); });
    keyH=e=>{
      if(e.key==='ArrowUp'){e.preventDefault();tryMove(-1,0);} else if(e.key==='ArrowDown'){e.preventDefault();tryMove(1,0);}
      else if(e.key==='ArrowLeft'){e.preventDefault();tryMove(0,-1);} else if(e.key==='ArrowRight'){e.preventDefault();tryMove(0,1);}
    };
    document.addEventListener('keydown',keyH);
    $('#is-undo').onclick=undo;
    $('#is-re').onclick=()=>{ haptic(); play(lv); };
    $('#is-back').onclick=()=>{ SFX.tap(); showSelect(); };
    updMoves();
  }
  function setPPos(){
    const L=LEVELS[lv], p=$('#is-p'); if(!p) return;
    p.style.left=pct(pos[1],L.N); p.style.top=pct(pos[0],L.N);
  }
  function starNow(){
    const L=LEVELS[lv];
    return moves<=L.par?3:moves<=L.par+3?2:1;
  }
  function updMoves(){
    const m=$('#is-moves'); if(m) m.textContent=fa(moves);
    const st=$('#is-stars'), n=starNow();
    if(st){ st.textContent='★'.repeat(n)+'☆'.repeat(3-n); st.className='is-stars s'+n; }
  }
  function tryMove(dr,dc){
    if(over||busy) return;
    const L=LEVELS[lv];
    const [r,c]=pos;
    let nr=r,nc=c;
    while(L.grid[nr+dr]&&L.grid[nr+dr][nc+dc]&&L.grid[nr+dr][nc+dc]!=='#'){ nr+=dr; nc+=dc; }
    if(nr===r&&nc===c){ bump(false); return; }
    undoStack.push(pos.slice());
    busy=true; moves++; updMoves();
    const dist=Math.abs(nr-r)+Math.abs(nc-c);
    const p=$('#is-p');
    p.style.transitionDuration=(dist*85)+'ms';
    pos=[nr,nc]; setPPos();
    SFX.move(); trail(r,c,nr,nc);
    slideT=setTimeout(()=>{
      busy=false; bump(true);
      if(nr===L.goal[0]&&nc===L.goal[1]) setTimeout(()=>{ if(!over) winGame(); },250);
    },dist*85+40);
  }
  function trail(r1,c1,r2,c2){
    const bd=$('#is-board'),L=LEVELS[lv]; if(!bd) return;
    const steps=Math.max(Math.abs(r2-r1),Math.abs(c2-c1));
    for(let i=0;i<=steps;i++){
      const r=r1+(r2-r1)*i/steps, c=c1+(c2-c1)*i/steps;
      const s=document.createElement('span');
      s.className='is-trail'; s.textContent='❄';
      s.style.left=pct(c,L.N); s.style.top=pct(r,L.N);
      s.style.width=(100/L.N)+'%'; s.style.height=(100/L.N)+'%';
      bd.appendChild(s); setTimeout(()=>s.remove(),700);
    }
  }
  function bump(soft){
    const p=$('#is-p'); if(!p) return;
    p.classList.remove('bump'); void p.offsetWidth; p.classList.add('bump');
    beep(soft?200:150,.07,'square'); haptic('light');
  }
  function undo(){
    if(over||busy) return;
    if(!undoStack.length){ toast('حرکتی برای برگشت نیست!'); return; }
    pos=undoStack.pop();
    const p=$('#is-p'); p.style.transitionDuration='120ms'; setPPos(); SFX.tap();
  }
  function winGame(){
    over=true;
    const L=LEVELS[lv];
    const st=moves<=L.par?3:moves<=L.par+3?2:1;
    starMap[lv]=Math.max(starMap[lv]||0,st); store.set('is_stars',starMap);
    if(lv+1<LEVELS.length) store.set('is_unlocked',Math.max(unlockedGet(),lv+2));
    const reward=8+st*4;
    bumpStat(true);
    logHistory('iceslide','win',`مرحله ${fa(lv+1)} • ${'★'.repeat(st)}`);
    const bPrev=store.get('best_iceslide',0);
    if(lv+1>bPrev){ store.set('best_iceslide',lv+1); store.set('best_iceslide_t','مرحله '+fa(lv+1)); }
    addCoins(reward,'آیس اسلاید'); confetti(100); SFX.good();
    const hasNext=lv+1<LEVELS.length;
    showEnd(true,`${'⭐'.repeat(st)} مرحله ${fa(lv+1)}!`,
      `با <b>${fa(moves)}</b> حرکت تمومش کردی! (پار ${fa(L.par)})<br>🪙 <b>${fa(reward)} سکه</b> گرفتی!`+(hasNext?'':'<br>🏆 همه مراحل تموم شد! افسانه‌ای!'),
      ()=>{ hasNext?play(lv+1):render(diff); });
    const rb=$('#end-retry');
    if(rb) rb.innerHTML=hasNext?'⏭️ مرحله بعد':'🔁 دوباره';
  }
  function stop(){
    over=true; busy=false;
    if(slideT){ clearTimeout(slideT); slideT=null; }
    if(keyH){ document.removeEventListener('keydown',keyH); keyH=null; }
  }
  return { render, stop, levels:()=>LEVELS };
})();
