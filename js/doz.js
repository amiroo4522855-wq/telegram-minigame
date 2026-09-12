/* ===== دوز (بازی XO) ===== */
const DozGame = (()=>{
  const LINES=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const TARGET=3; // اول به ۳ برد
  let board,turn,px,po,dr,round,starter,diff,over,thinking;

  function winner(b){
    for(const L of LINES){ const [a,c,d]=L;
      if(b[a]&&b[a]===b[c]&&b[a]===b[d]) return {w:b[a],line:L}; }
    return b.every(x=>x)?{w:'D',line:null}:null;
  }
  function minimax(b,me,depth,isMax){
    const r=winner(b);
    if(r){ if(r.w==='D')return 0; return (r.w===me?10-depth:depth-10); }
    const other=me==='X'?'O':'X';
    let best=isMax?-99:99;
    for(let i=0;i<9;i++){
      if(b[i])continue;
      b[i]=isMax?me:other;
      const s=minimax(b,me,depth+1,!isMax);
      b[i]=null;
      best=isMax?Math.max(best,s):Math.min(best,s);
    }
    return best;
  }
  function botMove(){
    const empt=board.map((v,i)=>v?null:i).filter(v=>v!==null);
    if(diff==='easy'){
      // ۲۵٪ هوشمند، بقیه شانسی
      if(Math.random()<0.25){ const s=smart(); if(s!==null&&s!==undefined) return s; }
      return empt[Math.random()*empt.length|0];
    }
    if(diff==='medium'){
      const s=smart(); if(s!==null&&s!==undefined) return s;
      if(!board[4]&&Math.random()<0.6) return 4;
      return empt[Math.random()*empt.length|0];
    }
    // سخت: مینی‌مکس کامل
    let bestS=-99,bestM=empt[0];
    for(const i of empt){
      board[i]='O';
      const s=minimax(board,'O',0,false);
      board[i]=null;
      if(s>bestS+(Math.random()*0.5)){bestS=s;bestM=i;}
    }
    return bestM;
  }
  function smart(){
    // ببر اگه می‌تونی، وگرنه دفاع کن
    for(const p of['O','X']){
      for(let i=0;i<9;i++){
        if(board[i])continue;
        board[i]=p;
        const r=winner(board);
        board[i]=null;
        if(r&&r.w===p) return i;
      }
    }
    return null;
  }

  function render(d){
    diff=d; stop();
    over=false;thinking=false;px=0;po=0;dr=0;round=1;starter='X';
    newRound();
  }
  function newRound(){
    board=Array(9).fill(null); turn=starter; thinking=false;
    const box=$('#game-container');
    box.innerHTML=`<div class="panel">
      <div class="doz-score">
        <div class="${turn==='X'?'on':''}" id="dz-px"><b>✕ تو</b><span>${fa(px)}</span></div>
        <div class="dz-round">دست ${fa(round)}<small>اول به ${fa(TARGET)}</small></div>
        <div class="${turn==='O'?'on':''}" id="dz-po"><b>○ ربات</b><span>${fa(po)}</span></div>
      </div>
      <div class="doz-msg" id="dz-msg">${turn==='X'?'نوبت توست!':'ربات داره فکر می‌کنه…'}</div>
      <div class="doz-board" id="dz-b">${board.map((_,i)=>`<button class="dz-cell" data-i="${i}"></button>`).join('')}
        <svg class="dz-win" id="dz-win" viewBox="0 0 300 300"></svg>
      </div>
      <div class="row-btns"><button class="btn btn-primary" id="dz-new">${icon('refresh',16)} مسابقه جدید</button></div>
    </div>`;
    box.querySelectorAll('.dz-cell').forEach(c=>c.onclick=()=>tap(+c.dataset.i));
    $('#dz-new').onclick=()=>{haptic();render(diff);};
    if(turn==='O') botTurn();
  }
  function tap(i){
    if(over||thinking||turn!=='X'||board[i]) return;
    place(i,'X');
  }
  function place(i,p){
    board[i]=p; SFX.tap(); haptic('light');
    drawCell(i,p);
    const r=winner(board);
    if(r){ endRound(r); return; }
    turn=p==='X'?'O':'X';
    $('#dz-px').classList.toggle('on',turn==='X');
    $('#dz-po').classList.toggle('on',turn==='O');
    $('#dz-msg').textContent=turn==='X'?'نوبت توست!':'ربات داره فکر می‌کنه…';
    if(turn==='O') botTurn();
  }
  function botTurn(){
    thinking=true;
    setTimeout(()=>{
      if(over) return;
      thinking=false;
      place(botMove(),'O');
    },450+Math.random()*500);
  }
  function drawCell(i,p){
    const c=document.querySelector(`.dz-cell[data-i="${i}"]`);
    if(!c) return;
    c.innerHTML = p==='X'
      ? `<svg viewBox="0 0 60 60"><path d="M14 14l32 32M46 14L14 46" class="dz-x"/></svg>`
      : `<svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="17" class="dz-o"/></svg>`;
    c.classList.add('filled');
  }
  function endRound(r){
    round++;
    const cells={X:'✕',O:'○'};
    if(r.w==='D'){ dr++; SFX.flip(); toast('این دست مساوی شد!'); }
    else{
      if(r.w==='X'){px++;SFX.good();haptic('medium');}else{po++;SFX.bad();}
      drawWinLine(r.line,r.w);
      toast(r.w==='X'?'این دست رو بردی!':'ربات این دست رو برد!');
    }
    setTimeout(()=>{
      if(over) return;
      if(px>=TARGET||po>=TARGET) endMatch(px>=TARGET);
      else { starter=starter==='X'?'O':'X'; newRound(); updScoreOnly(); }
    },1300);
  }
  function updScoreOnly(){ /* امتیازها در newRound رندر می‌شن */ }
  function drawWinLine(line,w){
    const svg=$('#dz-win'); if(!svg||!line) return;
    const c=i=>({x:(i%3)*100+50,y:((i/3)|0)*100+50});
    const a=c(line[0]),b=c(line[2]);
    svg.innerHTML=`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="${w==='X'?'wl-x':'wl-o'}"/>`;
  }
  function endMatch(won){
    over=true;
    bumpStat(won);
    logHistory('doz',won?'win':'lose',`${fa(px)} - ${fa(po)}`);
    if(won){
      const reward=(diff==='hard'?90:diff==='medium'?60:35)+dr*3;
      store.set('best_doz',fa(px)+'-'+fa(po));
      addCoins(reward,'دوز');
      showEnd(true,'قهرمان دوز! 🏆',`با نتیجه <b>${fa(px)} - ${fa(po)}</b> بردی!${dr?`<br>${fa(dr)} دست هم مساوی شد.`:''}<br>🪙 <b>${fa(reward)} سکه</b> گرفتی!`,()=>render(diff));
    } else {
      addCoins(8,'تلاش در دوز');
      showEnd(false,'ربات برد! 🤖',`نتیجه <b>${fa(px)} - ${fa(po)}</b> شد.<br>یه مسابقه دیگه؟ انتقام! 😤`,()=>render(diff));
    }
  }
  function stop(){ over=true; }
  return { render, stop };
})();
