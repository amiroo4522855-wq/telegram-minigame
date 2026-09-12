/* ===== منچ مدرن (دایره‌ای) ===== */
const LudoGame = (()=>{
  const TRACK=32, HOME=4, FINISH=36;
  const NAMES=['تو','قرمز','سبز','زرد'];
  const PCOL=['#3b82f6','#ef4444','#22c55e','#f59e0b'];
  const SAFE=new Set([0,4,8,12,16,20,24,28]);
  let players=[], turn=0, dice=0, rolled=false, busy=false, over=false, diff='medium';

  const startOf = p => p*8;
  function trackPos(i){ const a=(i/TRACK)*Math.PI*2 - Math.PI/2;
    return {x:50+41*Math.cos(a), y:50+41*Math.sin(a)}; }
  function homePos(p,j){ const s=trackPos(startOf(p)), t=(j+1)/5.2;
    return {x:s.x+(50-s.x)*t, y:s.y+(50-s.y)*t}; }
  const BASES=[{x:80,y:80},{x:20,y:20},{x:20,y:80},{x:80,y:20}];
  function basePos(p,k){ const b=BASES[p], o=[[-4,-4],[4,-4],[-4,4],[4,4]][k];
    return {x:b.x+o[0], y:b.y+o[1]}; }
  function tokenPos(p,k){
    const t=players[p].tokens[k];
    if(t===-1) return basePos(p,k);
    if(t>=32&&t<36) return homePos(p,t-32);
    if(t>=36) return {x:50+(p-1.5)*4, y:50+(k-1.5)*4};
    return trackPos((startOf(p)+t)%TRACK);
  }
  function absIdx(p,t){ return (startOf(p)+t)%TRACK; }

  function render(d){
    diff=d; busy=false; over=false; rolled=false; dice=0; turn=0;
    const n = d==='easy'?2 : d==='medium'?3 : 4;
    players = Array.from({length:n},()=>({tokens:[-1,-1,-1,-1]}));
    const box=$('#game-container');
    box.innerHTML=`
      <div class="panel ludo-wrap">
        <div class="ludo-players" id="lp-row">${players.map((_,i)=>`<div class="lp" id="lp${i}"><span class="cdot" style="background:${PCOL[i]};color:${PCOL[i]}"></span>${NAMES[i]}</div>`).join('')}</div>
        <div class="ludo-msg" id="ludo-msg">تاس بنداز!</div>
        <div class="ludo-board" id="ludo-board"></div>
        <div class="dice ready" id="dice">${diceFace(6)}</div>
        <div class="row-btns"><button class="btn btn-primary" id="l-new">${icon('refresh',16)} بازی جدید</button></div>
      </div>`;
    drawBoard();
    $('#dice').onclick=()=>humanRoll();
    $('#l-new').onclick=()=>{haptic();render(diff);};
    updateTurn();
  }
  function drawBoard(){
    const b=$('#ludo-board'); b.innerHTML='';
    for(let i=0;i<TRACK;i++){
      const p=trackPos(i), d=document.createElement('div');
      d.className='ludo-cell'+(SAFE.has(i)?' safe':'');
      d.style.left=p.x+'%'; d.style.top=p.y+'%';
      if(SAFE.has(i)) d.innerHTML='<small style="font-size:9px">⭐</small>';
      b.appendChild(d);
    }
    players.forEach((_,p)=>{ for(let j=0;j<HOME;j++){
      const q=homePos(p,j), d=document.createElement('div');
      d.className='ludo-cell homec'; d.style.left=q.x+'%'; d.style.top=q.y+'%';
      d.style.borderColor=PCOL[p]; d.style.background=PCOL[p]+'33';
      b.appendChild(d);
    }});
    const c=document.createElement('div');
    c.innerHTML='🏆'; c.style.cssText='position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:30px;filter:drop-shadow(0 4px 10px rgba(0,0,0,.6))';
    b.appendChild(c);
    drawTokens();
  }
  function drawTokens(movable=[]){
    document.querySelectorAll('.token').forEach(e=>e.remove());
    const b=$('#ludo-board');
    players.forEach((pl,p)=>pl.tokens.forEach((t,k)=>{
      const pos=tokenPos(p,k), d=document.createElement('div');
      d.className=`token t${p}`+(movable.includes(k)&&p===turn?' movable':'');
      d.style.left=pos.x+'%'; d.style.top=pos.y+'%';
      d.textContent = t>=36?'✓':(k+1);
      d.style.fontSize='11px'; d.style.fontWeight='900';
      if(movable.includes(k)&&p===turn&&p===0){ d.onclick=()=>humanMove(k); }
      b.appendChild(d);
    }));
    players.forEach((pl,p)=>{
      const done=pl.tokens.filter(t=>t>=36).length;
      const el=$('#lp'+p); if(el) el.innerHTML=`<span class="cdot" style="background:${PCOL[p]};color:${PCOL[p]}"></span>${NAMES[p]} • ${fa(done)}/۴`;
    });
  }
  function updateTurn(){
    players.forEach((_,i)=>$('#lp'+i)?.classList.toggle('turn',i===turn));
    if(over) return;
    if(turn===0){
      $('#ludo-msg').textContent = rolled? 'یک مهره روشن را انتخاب کن' : 'نوبت توست — تاس بنداز';
      $('#dice').style.opacity='1';
    } else {
      $('#ludo-msg').textContent = `نوبت ${NAMES[turn]}...`;
      $('#dice').style.opacity='.5';
      if(!busy){ busy=true; setTimeout(botPlay, 900+Math.random()*700); }
    }
  }
  function movable(p,dv){
    const out=[];
    players[p].tokens.forEach((t,k)=>{
      if(t===-1){ if(dv===6) out.push(k); }
      else if(t<36 && t+dv<=36) out.push(k);
    });
    return out;
  }
  function rollDiceAnim(cb){
    const el=$('#dice');
    dice=(turn===0)?luckyDie('ludo'):1+Math.random()*6|0;
    animateDice(el,dice,()=>{ cb&&cb(); });
  }
  function humanRoll(){
    if(over||turn!==0||rolled||busy) return;
    busy=true;
    rollDiceAnim(()=>{
      busy=false; rolled=true;
      const mv=movable(0,dice);
      if(!mv.length){
        $('#ludo-msg').textContent = 'حرکتی نداری — نوبت بعدی!';
        SFX.bad();
        setTimeout(nextTurn, 1100);
      } else { updateTurn(); drawTokens(mv); }
    });
  }
  function humanMove(k){
    if(over||turn!==0||!rolled) return;
    rolled=false; SFX.tap(); haptic();
    doMove(0,k);
  }
  function botPlay(){
    if(over) return;
    rollDiceAnim(()=>{
      const mv=movable(turn,dice);
      if(!mv.length){ setTimeout(()=>{busy=false;nextTurn();},600); return; }
      const pick=botPick(turn,mv,dice);
      setTimeout(()=>{ doMove(turn,pick); busy=false; },500);
    });
  }
  function botPick(p,mv,dv){
    const rnd=a=>a[Math.random()*a.length|0];
    if(diff==='easy') return rnd(mv);
    // امتیازدهی
    let best=mv[0], bs=-1e9;
    mv.forEach(k=>{
      const t=players[p].tokens[k]; let s=Math.random()*(diff==='hard'?4:14);
      if(t===-1) s+=30;
      else {
        const nt=t+dv;
        if(nt===36) s+=60;                       // تمام کردن
        else if(nt>=32) s+=35;                   // ورود به خونه
        else {
          const ai=absIdx(p,nt);
          // زدن حریف؟
          let cap=false;
          players.forEach((q,qi)=>{ if(qi===p)return;
            q.tokens.forEach(ot=>{ if(ot>=0&&ot<32&&absIdx(qi,ot)===ai&&!SAFE.has(ai)) cap=true; });
          });
          if(cap) s+= diff==='hard'?55:40;
          if(SAFE.has(ai)) s+=15;
          // خطر؟
          let danger=false;
          players.forEach((q,qi)=>{ if(qi===p)return;
            q.tokens.forEach(ot=>{ if(ot>=0&&ot<32){ for(let dd=1;dd<=6;dd++){
              if((absIdx(qi,ot)===((ai-dd)%TRACK+TRACK)%TRACK)&&!SAFE.has(ai)) danger=true; }}});
          });
          if(danger) s-= diff==='hard'?18:6;
          s+= nt*0.4; // جلوتر بهتر
        }
      }
      if(s>bs){bs=s;best=k;}
    });
    return best;
  }
  function doMove(p,k){
    const t=players[p].tokens[k];
    let nt = t===-1?0:t+dice;
    if(nt>36) nt=36;
    players[p].tokens[k]=nt;
    SFX.tap();
    let captured=false, finished=(nt===36&&t!==36);
    if(nt<32){
      const ai=absIdx(p,nt);
      if(!SAFE.has(ai)){
        players.forEach((q,qi)=>{ if(qi===p)return;
          q.tokens.forEach((ot,ok)=>{ if(ot>=0&&ot<32&&absIdx(qi,ot)===ai){ q.tokens[ok]=-1; captured=true; }});
        });
      }
    }
    drawTokens();
    if(captured){ SFX.bad(); haptic('heavy'); toast('💥 زدی ترکوندی!'); }
    if(finished){ SFX.good(); }
    // برد؟
    if(players[p].tokens.every(x=>x>=36)){ endGame(p); return; }
    const extra = dice===6||captured||finished;
    if(p===0){
      if(extra){ rolled=false; $('#ludo-msg').textContent='جایزه! دوباره تاس بنداز'; updateTurn(); }
      else setTimeout(nextTurn,700);
    } else {
      if(extra){ setTimeout(()=>{ if(!over) botPlay(); },700); }
      else setTimeout(()=>{busy=false;nextTurn();},700);
    }
  }
  function nextTurn(){
    if(over) return;
    turn=(turn+1)%players.length; rolled=false;
    drawTokens(); updateTurn();
  }
  function endGame(winner){
    over=true;
    const humanWon = winner===0;
    bumpStat(humanWon,'ludo');
    logHistory('ludo',humanWon?'win':'lose',humanWon?'قهرمانی 🏠':NAMES[winner]+' برد');
    if(humanWon){
      store.set('best_ludo','🏆 قهرمان!');
      const reward = diff==='hard'?120:diff==='medium'?80:50;
      addCoins(reward,'قهرمانی منچ 🎲');
      showEnd(true,'قهرمان منچ! 🎉',`همه مهره‌هات رسیدن خونه! 🏠<br>🪙 <b>${fa(reward)} سکه</b> جایزه گرفتی!`,()=>render(diff));
    } else {
      addCoins(10,'تلاش در منچ 💪');
      showEnd(false,`${NAMES[winner]} برد! 🤖`,`حریف زودتر تموم کرد...<br>یه دست دیگه بزن، حتماً می‌بری! 💪<br>🪙 ۱۰ سکه دلداری گرفتی!`,()=>render(diff));
    }
  }
  return { render, stop(){over=true;} };
})();
