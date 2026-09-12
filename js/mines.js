/* ===== مین‌روب ===== */
const MinesGame = (()=>{
  const CONF={easy:{r:8,c:8,m:10},medium:{r:10,c:10,m:20},hard:{r:12,c:12,m:35}};
  let R=8,C=8,M=10,grid=[],open=0,flags=0,over=false,win_=false,secs=0,timer=null,started=false,mode='dig',diff='medium';

  function render(d){
    diff=d; stop();
    const c=CONF[d]||CONF.medium; R=c.r;C=c.c;M=c.m;
    grid=[];open=0;flags=0;over=false;win_=false;secs=0;started=false;mode='dig';
    const box=$('#game-container');
    box.innerHTML=`
      <div class="panel">
        <div class="mines-bar">
          <div class="hud" style="flex:2;margin:0">
            <div class="h"><b id="mn-mines">${icon('bomb',16)} ${fa(M)}</b><small>مین</small></div>
            <div class="h"><b id="mn-time">۰:۰۰</b><small>${icon('clock',12)} زمان</small></div>
          </div>
        </div>
        <div class="mode-toggle" style="margin-bottom:12px">
          <button id="mode-dig" class="on">${icon('search',16)} کاوش</button>
          <button id="mode-flag">${icon('flag',16)} پرچم</button>
        </div>
        <div class="mines-grid" id="mn-grid" style="grid-template-columns:repeat(${C},1fr)"></div>
        <div class="row-btns"><button class="btn btn-primary" id="mn-new">${icon('refresh',16)} بازی جدید</button></div>
      </div>`;
    build();
    $('#mn-new').onclick=()=>{haptic();render(diff);};
    $('#mode-dig').onclick=e=>setMode('dig');
    $('#mode-flag').onclick=e=>setMode('flag');
  }
  function setMode(m){ mode=m; SFX.tap(); haptic('light');
    $('#mode-dig').classList.toggle('on',m==='dig');
    $('#mode-flag').classList.toggle('on',m==='flag');
  }
  function build(){
    grid=Array.from({length:R},()=>Array.from({length:C},()=>({m:false,o:false,f:false,n:0})));
    // مین‌ها بعد از اولین کلیک گذاشته می‌شن (خونه اول همیشه امن)
    draw();
  }
  function placeMines(sr,sc){
    let p=M;
    while(p>0){
      const r=Math.random()*R|0,c=Math.random()*C|0;
      if(grid[r][c].m||(Math.abs(r-sr)<=1&&Math.abs(c-sc)<=1)) continue;
      grid[r][c].m=true; p--;
    }
    for(let r=0;r<R;r++)for(let c=0;c<C;c++){
      if(grid[r][c].m) continue;
      let n=0;
      for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
        const nr=r+dr,nc=c+dc;
        if(nr>=0&&nr<R&&nc>=0&&nc<C&&grid[nr][nc].m) n++;
      }
      grid[r][c].n=n;
    }
  }
  function draw(){
    const g=$('#mn-grid'); if(!g) return; g.innerHTML='';
    grid.forEach((row,r)=>row.forEach((cell,c)=>{
      const b=document.createElement('button');
      b.className='mcell'; b.dataset.r=r; b.dataset.c=c;
      if(cell.o){
        b.classList.add('open');
        if(cell.m){b.textContent='💥';b.classList.add('boom');}
        else if(cell.n>0){b.textContent='۱۲۳۴۵۶۷۸'[cell.n-1]||cell.n;b.classList.add('c'+cell.n);}
      } else if(cell.f){ b.textContent='🚩'; b.classList.add('flagged'); }
      b.onclick=()=>tap(r,c);
      b.oncontextmenu=e=>{e.preventDefault();flag(r,c);};
      // لمس طولانی = پرچم
      let lt=null;
      b.ontouchstart=()=>{lt=setTimeout(()=>{flag(r,c);lt=null;},450);};
      b.ontouchend=()=>{if(lt){clearTimeout(lt);}};
      b.ontouchmove=()=>{if(lt){clearTimeout(lt);lt=null;}};
      g.appendChild(b);
    }));
    $('#mn-mines').innerHTML=icon('bomb',16)+' '+fa(M-flags);
  }
  function tick(){ secs++;
    const m=(secs/60)|0,s=secs%60;
    const el=$('#mn-time'); if(el) el.textContent=fa(m)+':'+String(s).padStart(2,'0').replace(/\d/g,x=>'۰۱۲۳۴۵۶۷۸۹'[x]);
  }
  function tap(r,c){
    if(over) return;
    const cell=grid[r][c];
    if(mode==='flag'){ flag(r,c); return; }
    if(cell.f||cell.o) return;
    haptic('light');
    if(!started){ started=true; placeMines(r,c); timer=setInterval(tick,1000); }
    if(cell.m){ boom(r,c); return; }
    flood(r,c); SFX.tap(); draw();
    checkWin();
  }
  function flag(r,c){
    if(over) return;
    const cell=grid[r][c];
    if(cell.o) return;
    cell.f=!cell.f; flags+=cell.f?1:-1;
    SFX.flip(); haptic('medium'); draw();
  }
  function flood(r,c){
    const st=[[r,c]];
    while(st.length){
      const [a,b]=st.pop(), cell=grid[a]?.[b];
      if(!cell||cell.o||cell.f||cell.m) continue;
      cell.o=true; open++;
      if(cell.n===0){
        for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
          const na=a+dr,nb=b+dc;
          if(na>=0&&na<R&&nb>=0&&nb<C&&!grid[na][nb].o) st.push([na,nb]);
        }
      }
    }
  }
  function boom(r,c){
    over=true; stop(); SFX.bad(); haptic('heavy'); notify('error');
    grid.forEach(row=>row.forEach(cell=>{ if(cell.m) cell.o=true; }));
    draw();
    bumpStat(false,'mines'); addCoins(5,'تلاش در مین‌روب 💪');
    logHistory('mines','lose','انفجار 💥');
    setTimeout(()=>showEnd(false,'بوم! 💥','روی مین رفتی! دفعه بعد با دقت‌تر... 🧐<br>نکته: از اعداد کمک بگیر!',()=>render(diff)),800);
  }
  function checkWin(){
    if(open===R*C-M){
      over=true; win_=true; stop();
      SFX.win(); haptic('medium');
      const reward=(diff==='hard'?100:diff==='medium'?60:35)+Math.max(5,40-((secs/5)|0));
      bumpStat(true,'mines');
      store.set('best_mines', fa(secs)+' ثانیه 🏅');
      addCoins(reward,'مین‌روب 💣');
      grid.forEach(row=>row.forEach(cell=>{if(cell.m)cell.f=true;})); draw();
      setTimeout(()=>showEnd(true,'میدان پاکسازی شد! 🏅',`توی <b>${fa(secs)} ثانیه</b> همه مین‌ها رو پیدا کردی!<br>🪙 <b>${fa(reward)} سکه</b> گرفتی!`,()=>render(diff)),600);
    }
  }
  function stop(){ clearInterval(timer); timer=null; }
  return { render, stop };
})();
