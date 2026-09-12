/* ===== مار و پله ===== */
const SnakesGame = (()=>{
  const SNAKES={16:6,47:26,49:11,56:53,62:19,64:60,87:24,93:73,95:75,98:78};
  const LADDERS={1:38,4:14,9:31,21:42,28:84,36:44,51:67,71:91,80:100};
  const NAMES=['تو','قرمز','سبز','زرد'];
  const PCOL=['#3b82f6','#ef4444','#22c55e','#f59e0b'];
  let n, pos, turn, dice, rolling, over, busy, diff, rolls, toks;

  // مختصات خونه n بر حسب درصد (مارپیچی)
  function cellRC(n){ const r=(n-1)/10|0; let c=(n-1)%10; if(r%2===1) c=9-c; return {r:9-r, c}; }
  function cellXY(n){ const {r,c}=cellRC(n); return {x:(c+0.5)*10, y:(r+0.5)*10}; }

  function render(d){
    diff=d; stop();
    over=false;busy=false;rolling=false;turn=0;dice=0;rolls=0;toks=[];
    n = d==='easy'?2 : d==='medium'?3 : 4;
    pos=Array(n).fill(0); // 0 = پشت خط
    const box=$('#game-container');
    const cells=[];
    for(let r=0;r<10;r++)for(let c=0;c<10;c++){
      const row=9-r; let num;
      const rr=9-row; // سطر واقعی از پایین
      num = rr%2===0 ? rr*10+c+1 : rr*10+(9-c)+1;
      const sp=SNAKES[num]?' sp-s':LADDERS[num]?' sp-l':num===100?' sp-w':'';
      cells.push(`<div class="sn-cell${(r+c)%2?' alt':''}${sp}">${num===100?'🏆':fa(num)}</div>`);
    }
    box.innerHTML=`<div class="panel">
      <div class="ludo-players">${pos.map((_,i)=>`<div class="lp${i===0?' turn':''}" id="sp${i}"><span class="cdot" style="background:${PCOL[i]};color:${PCOL[i]}"></span>${NAMES[i]} <small id="spn${i}">بیرون</small></div>`).join('')}</div>
      <div class="ludo-msg" id="sn-msg">تاس بنداز تا شروع کنی!</div>
      <div class="sn-wrap"><div class="sn-board">${cells.join('')}</div>
        <svg class="sn-svg" id="sn-svg" viewBox="0 0 100 100" preserveAspectRatio="none"></svg>
        <div id="sn-tokens"></div>
      </div>
      <div id="sn-tray"></div>
      <div class="dice ready" id="sn-dice">${diceFace(6)}</div>
      <div class="row-btns"><button class="btn btn-primary" id="sn-new">${icon('refresh',16)} بازی جدید</button></div>
    </div>`;
    const tb=$('#sn-tokens');
    for(let i=0;i<n;i++){
      const el=document.createElement('div');
      el.className='sn-tok'; el.id='snt'+i;
      el.style.background=`linear-gradient(135deg,${PCOL[i]},${PCOL[i]}88)`;
      el.style.borderColor='#fff';
      el.textContent=i===0?'★':(i+1);
      tb.appendChild(el); toks.push(el);
    }
    drawLinks(); drawTokens();
    $('#sn-dice').onclick=humanRoll;
    $('#sn-new').onclick=()=>{haptic();render(diff);};
  }
  /* مسیر موج‌دار بدن مار */
  function snakeD(p1,p2){
    const dx=p2.x-p1.x, dy=p2.y-p1.y, len=Math.hypot(dx,dy)||1, nx=-dy/len, ny=dx/len;
    const w=Math.min(3,len*0.11);
    let d=`M${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
    const segs=5;
    for(let i=1;i<=segs;i++){
      const t=i/segs;
      const off=(i===segs)?0:Math.sin(t*Math.PI*2.2)*w;
      d+=` L${(p1.x+dx*t+nx*off).toFixed(1)} ${(p1.y+dy*t+ny*off).toFixed(1)}`;
    }
    return {d,nx,ny};
  }
  function drawLinks(){
    const svg=$('#sn-svg'); if(!svg) return;
    let h='';
    for(const a in SNAKES){
      const b=SNAKES[a], p1=cellXY(+a), p2=cellXY(b);
      const {d,nx,ny}=snakeD(p1,p2);
      h+=`<path d="${d}" fill="none" stroke="#14532d" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/>`;
      h+=`<path d="${d}" fill="none" stroke="#4ade80" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
      // سر مار روی خونه شروع (جایی که نیش می‌زنه)
      const tx=(p2.x-p1.x), ty=(p2.y-p1.y), tl=Math.hypot(tx,ty)||1, ux=tx/tl, uy=ty/tl;
      h+=`<circle cx="${p1.x}" cy="${p1.y}" r="2.2" fill="#22c55e" stroke="#14532d" stroke-width="0.5"/>`;
      h+=`<circle cx="${(p1.x+ux*1.2-nx*0.9).toFixed(1)}" cy="${(p1.y+uy*1.2-ny*0.9).toFixed(1)}" r="0.62" fill="#fff"/><circle cx="${(p1.x+ux*1.2+nx*0.9).toFixed(1)}" cy="${(p1.y+uy*1.2+ny*0.9).toFixed(1)}" r="0.62" fill="#fff"/>`;
      h+=`<circle cx="${(p1.x+ux*1.35-nx*0.9).toFixed(1)}" cy="${(p1.y+uy*1.35-ny*0.9).toFixed(1)}" r="0.3" fill="#111"/><circle cx="${(p1.x+ux*1.35+nx*0.9).toFixed(1)}" cy="${(p1.y+uy*1.35+ny*0.9).toFixed(1)}" r="0.3" fill="#111"/>`;
      h+=`<line x1="${(p1.x+ux*2.1).toFixed(1)}" y1="${(p1.y+uy*2.1).toFixed(1)}" x2="${(p1.x+ux*3.6).toFixed(1)}" y2="${(p1.y+uy*3.6).toFixed(1)}" stroke="#ef4444" stroke-width="0.55" stroke-linecap="round"/>`;
    }
    for(const a in LADDERS){
      const b=LADDERS[a], p1=cellXY(+a), p2=cellXY(b);
      const dx=p2.x-p1.x, dy=p2.y-p1.y, len=Math.hypot(dx,dy)||1, nx=-dy/len*1.15, ny=dx/len*1.15;
      // سایه
      h+=`<line x1="${(p1.x+nx+0.45).toFixed(1)}" y1="${(p1.y+ny+0.45).toFixed(1)}" x2="${(p2.x+nx+0.45).toFixed(1)}" y2="${(p2.y+ny+0.45).toFixed(1)}" stroke="rgba(0,0,0,.35)" stroke-width="1.3" stroke-linecap="round"/>`;
      h+=`<line x1="${(p1.x-nx+0.45).toFixed(1)}" y1="${(p1.y-ny+0.45).toFixed(1)}" x2="${(p2.x-nx+0.45).toFixed(1)}" y2="${(p2.y-ny+0.45).toFixed(1)}" stroke="rgba(0,0,0,.35)" stroke-width="1.3" stroke-linecap="round"/>`;
      // میله‌ها: قاب تیره + مغز روشن
      h+=`<line x1="${(p1.x+nx).toFixed(1)}" y1="${(p1.y+ny).toFixed(1)}" x2="${(p2.x+nx).toFixed(1)}" y2="${(p2.y+ny).toFixed(1)}" stroke="#92400e" stroke-width="1.3" stroke-linecap="round"/>`;
      h+=`<line x1="${(p1.x-nx).toFixed(1)}" y1="${(p1.y-ny).toFixed(1)}" x2="${(p2.x-nx).toFixed(1)}" y2="${(p2.y-ny).toFixed(1)}" stroke="#92400e" stroke-width="1.3" stroke-linecap="round"/>`;
      h+=`<line x1="${(p1.x+nx).toFixed(1)}" y1="${(p1.y+ny).toFixed(1)}" x2="${(p2.x+nx).toFixed(1)}" y2="${(p2.y+ny).toFixed(1)}" stroke="#fcd34d" stroke-width="0.55" stroke-linecap="round"/>`;
      h+=`<line x1="${(p1.x-nx).toFixed(1)}" y1="${(p1.y-ny).toFixed(1)}" x2="${(p2.x-nx).toFixed(1)}" y2="${(p2.y-ny).toFixed(1)}" stroke="#fcd34d" stroke-width="0.55" stroke-linecap="round"/>`;
      const steps=Math.max(2,Math.round(len/5.5));
      for(let i=1;i<steps;i++){ const t=i/steps;
        h+=`<line x1="${(p1.x+dx*t+nx).toFixed(1)}" y1="${(p1.y+dy*t+ny).toFixed(1)}" x2="${(p1.x+dx*t-nx).toFixed(1)}" y2="${(p1.y+dy*t-ny).toFixed(1)}" stroke="#fbbf24" stroke-width="0.85" stroke-linecap="round"/>`;
      }
    }
    svg.innerHTML=h;
  }
  function drawTokens(){
    const box=$('#sn-tokens'); if(!box) return;
    pos.forEach((p,i)=>{
      const el=toks[i]; if(!el) return;
      if(p===0){ el.style.display='none'; }
      else {
        el.style.display='grid';
        const same=pos.slice(0,i).filter(q=>q===p).length;
        const c=cellXY(p);
        el.style.left=(c.x+(same%2?2.4:0)-(same>1?1.2:0))+'%';
        el.style.top=(c.y-(same>1?2.6:0))+'%';
      }
      $('#sp'+i)?.classList.toggle('turn',i===turn);
      const sn=$('#spn'+i); if(sn) sn.textContent=p===0?'بیرون':fa(p);
    });
    const tray=$('#sn-tray');
    if(tray){
      const w=pos.map((p,i)=>p===0?i:-1).filter(i=>i>=0);
      tray.innerHTML=w.length?'<span>پشت خط:</span>'+w.map(i=>`<span class="sn-tray-tok" style="background:linear-gradient(135deg,${PCOL[i]},${PCOL[i]}88)">${i===0?'★':i+1}</span>`).join(''):'';
    }
  }
  function setMsg(t){ const m=$('#sn-msg'); if(m) m.textContent=t; }
  function setDiceState(){
    const el=$('#sn-dice'); if(!el) return;
    el.classList.toggle('ready',!over&&!busy&&turn===0);
    el.classList.toggle('dim',over||turn!==0);
  }
  function humanRoll(){
    if(over||busy||rolling||turn!==0) return;
    doRoll();
  }
  function doRoll(){
    const el=$('#sn-dice');
    if(!el||el._rolling) return;
    rolling=true; busy=true;
    el.classList.remove('ready');
    dice=(turn===0)?luckyDie('snakes'):1+Math.random()*6|0;
    animateDice(el,dice,()=>{
      rolling=false;
      if(turn===0) rolls++;
      setDiceState();
      stepMove();
    });
  }
  function stepMove(){
    if(pos[turn]+dice>100){
      setMsg(`${NAMES[turn]}: ${fa(dice)} آورد ولی رد شد! باید دقیق بشینی 😅`);
      SFX.bad();
      setTimeout(nextTurn,1100);
      return;
    }
    // حرکت قدم‌به‌قدم با پرش
    let s=0;
    const iv=setInterval(()=>{
      if(over){clearInterval(iv);return;}
      pos[turn]++; s++; beep(400+s*30,.05,'triangle');
      const el=toks[turn];
      if(el){ el.classList.remove('hop'); void el.offsetWidth; el.classList.add('hop'); }
      drawTokens();
      if(s>=dice){
        clearInterval(iv);
        setTimeout(afterLand,320);
      }
    },190);
  }
  function afterLand(){
    if(over) return;
    const p=pos[turn];
    if(SNAKES[p]||LADDERS[p]){
      const dest=SNAKES[p]||LADDERS[p];
      const isSnake=!!SNAKES[p];
      setMsg(isSnake?`🐍 ${NAMES[turn]} رو مار گزید! از ${fa(p)} افتاد به ${fa(dest)}!`:`🪜 ${NAMES[turn]} از نردبون رفت بالا! ${fa(p)} ← ${fa(dest)} 🎉`);
      isSnake?SFX.bad():SFX.good(); haptic(isSnake?'heavy':'medium');
      setTimeout(()=>{
        if(over) return;
        const el=toks[turn];
        if(el) el.classList.add('glide');
        pos[turn]=dest; drawTokens();
        setTimeout(()=>{
          if(el) el.classList.remove('glide');
          if(pos[turn]===100){ winGame(turn); return; }
          nextTurn();
        },850);
      },450);
    }
    else if(p===100){ winGame(turn); return; }
    else nextTurn();
  }
  function nextTurn(){
    if(over) return;
    const extra=(dice===6);
    if(!extra) turn=(turn+1)%n;
    drawTokens();
    busy=false;
    setDiceState();
    if(turn===0) setMsg(extra?'۶ آوردی! دوباره تاس بنداز 🎁':'نوبت توست — تاس بنداز!');
    else { setMsg(`نوبت ${NAMES[turn]}…`); busy=true; setDiceState(); setTimeout(()=>{ if(!over) doRoll(); },900); }
  }
  function winGame(w){
    over=true;
    setDiceState();
    const humanWon=(w===0);
    bumpStat(humanWon);
    if(humanWon){
      const prev=store.get('best_snakes',9999);
      if(rolls<prev){store.set('best_snakes',rolls);store.set('best_snakes_t',fa(rolls)+' تاس');}
      logHistory('snakes','win',`${fa(rolls)} تاس`);
      const reward=diff==='hard'?110:diff==='medium'?75:50;
      addCoins(reward,'مار و پله');
      showEnd(true,'رسیدی به ۱۰۰! 🏆',`تو فقط با <b>${fa(rolls)} تاس</b> تمومش کردی!<br>🪙 <b>${fa(reward)} سکه</b> گرفتی!`,()=>render(diff));
    } else {
      logHistory('snakes','lose',NAMES[w]+' برد');
      addCoins(10,'تلاش در مار و پله');
      showEnd(false,`${NAMES[w]} برد! 🤖`,`حریف زودتر به ۱۰۰ رسید...<br>یه دست دیگه! 💪`,()=>render(diff));
    }
  }
  function stop(){ over=true; }
  return { render, stop };
})();
