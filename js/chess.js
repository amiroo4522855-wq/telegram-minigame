/* ===== شطرنج vs ربات (قلعه، آنپاسان، ارتقا) ===== */
const ChessGame = (()=>{
  const VAL={p:100,n:320,b:330,r:500,q:900,k:20000};
  const GL={k:'♚',q:'♛',r:'♜',b:'♝',n:'♞',p:'♟'};
  const FILES='abcdefgh';
  let B,turn,cast,ep,half,sel,legalCache,last,over,diff,movesN,thinking,fullmoves;

  const opp=c=>c==='w'?'b':'w';
  const inB=(r,c)=>r>=0&&r<8&&c>=0&&c<8;

  function newBoard(){
    const back=['r','n','b','q','k','b','n','r'];
    B=Array.from({length:8},()=>Array(8).fill(null));
    for(let c=0;c<8;c++){
      B[0][c]={t:back[c],c:'b'}; B[1][c]={t:'p',c:'b'};
      B[6][c]={t:'p',c:'w'}; B[7][c]={t:back[c],c:'w'};
    }
  }
  function clone(b){ return b.map(row=>row.map(p=>p?{t:p.t,c:p.c}:null)); }

  function attacked(b,r,c,by){
    // سرباز
    const dr = by==='w'?1:-1;
    for(const dc of[-1,1]){ const p=b[r+dr]?.[c+dc]; if(p&&p.c===by&&p.t==='p') return true; }
    // اسب
    for(const[or,oc]of[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]){
      const p=inB(r+or,c+oc)&&b[r+or][c+oc]; if(p&&p.c===by&&p.t==='n') return true; }
    // شاه
    for(let or=-1;or<=1;or++)for(let oc=-1;oc<=1;oc++){
      if(!or&&!oc)continue; const p=inB(r+or,c+oc)&&b[r+or][c+oc]; if(p&&p.c===by&&p.t==='k') return true; }
    // لغزنده‌ها
    for(const[dirs,ts]of[[[[-1,0],[1,0],[0,-1],[0,1]],['r','q']],[[[-1,-1],[-1,1],[1,-1],[1,1]],['b','q']]]){
      for(const[dr2,dc2]of dirs){ let nr=r+dr2,nc=c+dc2;
        while(inB(nr,nc)){ const p=b[nr][nc];
          if(p){ if(p.c===by&&ts.includes(p.t)) return true; break; }
          nr+=dr2;nc+=dc2; } } }
    return false;
  }
  function kingPos(b,color){ for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=b[r][c];if(p&&p.t==='k'&&p.c===color)return[r,c];} return[0,0]; }

  function pseudo(b,r,c,castSt,epSq){
    const p=b[r][c]; if(!p) return [];
    const ms=[],me=p.c,fo=opp(me);
    const add=(tr,tc,extra={})=>{ if(inB(tr,tc)) ms.push(Object.assign({fr:r,fc:c,tr,tc},extra)); };
    if(p.t==='p'){
      const d=me==='w'?-1:1, start=me==='w'?6:1, lastR=me==='w'?0:7;
      if(inB(r+d,c)&&!b[r+d][c]){
        if(r+d===lastR) for(const pr of['q','r','b','n']) add(r+d,c,{promo:pr});
        else { add(r+d,c); if(r===start&&!b[r+2*d][c]) add(r+2*d,c,{double:true}); }
      }
      for(const dc of[-1,1]){
        const tr=r+d,tc=c+dc; if(!inB(tr,tc))continue;
        const q=b[tr][tc];
        if(q&&q.c===fo){ if(tr===lastR) for(const pr of['q','r','b','n']) add(tr,tc,{promo:pr}); else add(tr,tc); }
        else if(epSq&&epSq[0]===tr&&epSq[1]===tc) add(tr,tc,{ep:true});
      }
    } else if(p.t==='n'||p.t==='k'){
      const steps=p.t==='n'?[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]:[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
      for(const[dr2,dc2]of steps){ const tr=r+dr2,tc=c+dc2; if(!inB(tr,tc))continue; const q=b[tr][tc]; if(!q||q.c===fo) add(tr,tc); }
      if(p.t==='k'){
        const home=me==='w'?7:0;
        if(r===home&&c===4){
          const K=me==='w'?'wK':'bK',Q=me==='w'?'wQ':'bQ';
          if(castSt[K]&&!b[home][5]&&!b[home][6]&&!attacked(b,home,4,fo)&&!attacked(b,home,5,fo)&&!attacked(b,home,6,fo)) add(home,6,{castle:'K'});
          if(castSt[Q]&&!b[home][1]&&!b[home][2]&&!b[home][3]&&!attacked(b,home,4,fo)&&!attacked(b,home,3,fo)&&!attacked(b,home,2,fo)) add(home,2,{castle:'Q'});
        }
      }
    } else {
      const dirs=p.t==='r'?[[-1,0],[1,0],[0,-1],[0,1]]:p.t==='b'?[[-1,-1],[-1,1],[1,-1],[1,1]]:[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]];
      for(const[dr2,dc2]of dirs){ let tr=r+dr2,tc=c+dc2;
        while(inB(tr,tc)){ const q=b[tr][tc];
          if(!q) add(tr,tc); else { if(q.c===fo) add(tr,tc); break; }
          tr+=dr2;tc+=dc2; } }
    }
    return ms;
  }

  // اعمال حرکت روی بورد + وضعیت؛ برمی‌گردونه {cap, prevCast, prevEp, prevHalf}
  function applyOn(b,m,castSt){
    const p=b[m.fr][m.fc];
    const prev={ep:ep?[...ep]:null, half, cast:{...castSt}};
    let cap=null;
    if(m.ep) cap=b[m.fr][m.tc], b[m.fr][m.tc]=null;
    else cap=b[m.tr][m.tc];
    b[m.tr][m.tc]=b[m.fr][m.fc]; b[m.fr][m.fc]=null;
    if(m.promo) b[m.tr][m.tc]={t:m.promo,c:p.c};
    if(m.castle){ const home=p.c==='w'?7:0;
      if(m.castle==='K'){ b[home][5]=b[home][7]; b[home][7]=null; } else { b[home][3]=b[home][0]; b[home][0]=null; } }
    if(p.t==='k'){ if(p.c==='w'){castSt.wK=castSt.wQ=false;}else{castSt.bK=castSt.bQ=false;} }
    if(p.t==='r'){ if(m.fr===7&&m.fc===0)castSt.wQ=false; if(m.fr===7&&m.fc===7)castSt.wK=false;
                   if(m.fr===0&&m.fc===0)castSt.bQ=false; if(m.fr===0&&m.fc===7)castSt.bK=false; }
    if(cap&&cap.t==='r'){ if(m.tr===7&&m.tc===0)castSt.wQ=false; if(m.tr===7&&m.tc===7)castSt.wK=false;
                          if(m.tr===0&&m.tc===0)castSt.bQ=false; if(m.tr===0&&m.tc===7)castSt.bK=false; }
    return {cap,prev};
  }

  function legalFor(r,c){
    const p=B[r][c]; if(!p) return [];
    return pseudo(B,r,c,cast,ep).filter(m=>{
      const nb=clone(B), nc={...cast};
      applyOn(nb,m,nc);
      const[kR,kC]=p.t==='k'?[m.tr,m.tc]:kingPos(nb,p.c);
      return !attacked(nb,kR,kC,opp(p.c));
    });
  }
  function allLegal(color){
    const out=[];
    for(let r=0;r<8;r++)for(let c=0;c<8;c++){ const p=B[r][c]; if(!p||p.c!==color)continue;
      for(const m of pseudo(B,r,c,cast,ep)){
        const nb=clone(B),nc={...cast}; applyOn(nb,m,nc);
        const[kR,kC]=p.t==='k'?[m.tr,m.tc]:kingPos(nb,color);
        if(!attacked(nb,kR,kC,opp(color))) out.push(m);
      } }
    return out;
  }

  // --- ارزیابی و جستجو ---
  function evaluate(b){
    let s=0;
    for(let r=0;r<8;r++)for(let c=0;c<8;c++){ const p=b[r][c]; if(!p)continue;
      let v=VAL[p.t];
      if(p.t==='p') v+=(p.c==='w'?(6-r):(r-1))*8;         // سرباز جلو رفته
      if(p.t==='n') v+=(3-Math.abs(3.5-r)-Math.abs(3.5-c))*6; // اسب وسط
      s+=p.c==='w'?v:-v;
    }
    return s;
  }
  function orderMoves(b,ms){
    return ms.map(m=>{ const q=b[m.tr][m.tc]; let s=q?VAL[q.t]-VAL[b[m.fr][m.fc].t]/10:0; if(m.promo)s+=800; return[m,s]; })
      .sort((a,b2)=>b2[1]-a[1]).map(x=>x[0]);
  }
  function legalOn(b,color,castSt,epSq){
    const out=[];
    for(let r=0;r<8;r++)for(let c=0;c<8;c++){ const p=b[r][c]; if(!p||p.c!==color)continue;
      for(const m of pseudo(b,r,c,castSt,epSq)){
        const nb=clone(b),nc={...castSt};
        // نسخه سبک اعمال
        let cap=null;
        if(m.ep){cap=nb[m.fr][m.tc];nb[m.fr][m.tc]=null;}else cap=nb[m.tr][m.tc];
        nb[m.tr][m.tc]=nb[m.fr][m.fc];nb[m.fr][m.fc]=null;
        if(m.promo)nb[m.tr][m.tc]={t:m.promo,c:p.c};
        if(m.castle){const home=p.c==='w'?7:0;
          if(m.castle==='K'){nb[home][5]=nb[home][7];nb[home][7]=null;}else{nb[home][3]=nb[home][0];nb[home][0]=null;}}
        if(p.t==='k'){if(p.c==='w'){nc.wK=nc.wQ=false;}else{nc.bK=nc.bQ=false;}}
        const[kR,kC]=p.t==='k'?[m.tr,m.tc]:kingPos(nb,color);
        if(!attacked(nb,kR,kC,opp(color))) out.push(m);
      } }
    return out;
  }
  function searchRoot(depth){
    const ms=orderMoves(B,legalOn(B,'b',cast,ep));
    if(!ms.length) return null;
    let best=ms[0],bestS=-1e9;
    const noise=diff==='hard'?18:70;
    for(const m of ms){
      const nb=clone(B),nc={...cast};
      simApply(nb,m,nc);
      let s=-negamax(nb,depth-1,-1e9,1e9,'w',nc,m.double?[(m.fr+m.tr)/2,m.fc]:null)+(Math.random()*noise);
      if(s>bestS){bestS=s;best=m;}
    }
    return best;
  }
  function simApply(nb,m,nc){
    const p=nb[m.fr][m.fc];
    if(m.ep) nb[m.fr][m.tc]=null;
    nb[m.tr][m.tc]=p;nb[m.fr][m.fc]=null;
    if(m.promo)nb[m.tr][m.tc]={t:m.promo,c:p.c};
    if(m.castle){const home=p.c==='w'?7:0;
      if(m.castle==='K'){nb[home][5]=nb[home][7];nb[home][7]=null;}else{nb[home][3]=nb[home][0];nb[home][0]=null;}}
    if(p.t==='k'){if(p.c==='w'){nc.wK=nc.wQ=false;}else{nc.bK=nc.bQ=false;}}
  }
  function negamax(b,depth,alpha,beta,color,castSt,epSq){
    if(depth===0) return (color==='w'?1:-1)*evaluate(b);
    const ms=orderMoves(b,legalOn(b,color,castSt,epSq));
    if(!ms.length){
      const[kR,kC]=kingPos(b,color);
      return attacked(b,kR,kC,opp(color))?-(100000+depth*100):0; // مات یا پات
    }
    let best=-1e9;
    for(const m of ms){
      const nb=clone(b),nc={...castSt};
      simApply(nb,m,nc);
      const s=-negamax(nb,depth-1,-beta,-alpha,opp(color),nc,m.double?[(m.fr+m.tr)/2,m.fc]:null);
      if(s>best)best=s;
      if(best>alpha)alpha=best;
      if(alpha>=beta)break;
    }
    return best;
  }
  function botPick(){
    const ms=allLegal('b');
    if(!ms.length) return null;
    if(diff==='easy'){
      const caps=ms.filter(m=>B[m.tr][m.tc]||m.ep);
      if(caps.length&&Math.random()<.45) return caps[Math.random()*caps.length|0];
      return ms[Math.random()*ms.length|0];
    }
    if(diff==='medium'){
      let best=ms[0],bs=-1e9;
      for(const m of orderMoves(B,ms).slice(0,24)){
        const nb=clone(B),nc={...cast}; simApply(nb,m,nc);
        const s=-evaluate(nb)+Math.random()*90;
        if(s>bs){bs=s;best=m;}
      }
      return best;
    }
    return searchRoot(2)||ms[0];
  }

  function insufficient(){
    const ps=[];
    for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=B[r][c];if(p&&p.t!=='k')ps.push(p.t);}
    return ps.length===0||(ps.length===1&&(ps[0]==='b'||ps[0]==='n'));
  }

  // --- رابط کاربری ---
  function render(d){
    diff=d; newBoard();
    turn='w'; cast={wK:true,wQ:true,bK:true,bQ:true}; ep=null; half=0;
    sel=null; legalCache=[]; last=null; over=false; thinking=false; fullmoves=1;
    $('#game-container').innerHTML=`
      <div class="panel">
        <div class="chess-side" id="ch-bot"><span class="who">${icon('bot',17)} ربات</span><span class="caps" id="ch-caps-b"></span><span class="mat" id="ch-mat"></span></div>
        <div style="position:relative" id="ch-wrap"><div class="chess-board" id="ch-board"></div></div>
        <div class="chess-side" id="ch-me" style="margin-top:8px;margin-bottom:0"><span class="who">${icon('user',17)} تو (سفید)</span><span class="caps" id="ch-caps-w"></span></div>
        <div class="chess-msg" id="ch-msg">نوبت توست — یک مهره را انتخاب کن</div>
        <div class="row-btns">
          <button class="btn btn-ghost" id="ch-resign">${icon('flag',16)} تسلیم</button>
          <button class="btn btn-primary" id="ch-new">${icon('refresh',16)} بازی جدید</button>
        </div>
      </div>`;
    try{ const cb=$('#ch-board'); if(cb&&window.Hub) cb.className='chess-board '+Hub.skinClass('chess'); }catch(e){}
    draw();
    $('#ch-resign').onclick=()=>{ if(over||thinking)return;
      askConfirm('تسلیم می‌شوی؟','بازی را واگذار می‌کنی و ربات برنده می‌شود!','تسلیم',()=>end('lose','تسلیم شدی')); };
    $('#ch-new').onclick=()=>{haptic();render(diff);};
    window.onresize=fitPieces; fitPieces();
  }
  function fitPieces(){
    const b=$('#ch-board'); if(!b) return;
    const s=b.clientWidth/8*0.74;
    b.querySelectorAll('.pc').forEach(e=>e.style.fontSize=s+'px');
  }
  function captured(){
    const start={p:8,n:2,b:2,r:2,q:1};
    const count={w:{...start},b:{...start}};
    for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=B[r][c];if(p&&p.t!=='k')count[p.c][p.t]--;}
    const missW=[],missB=[];
    for(const t in start){ for(let i=0;i<count.w[t];i++)missB.push(t); for(let i=0;i<count.b[t];i++)missW.push(t); }
    // missW = مهره‌های سیاهی که سفید گرفته
    const ord={q:0,r:1,b:2,n:3,p:4};
    missW.sort((a,b2)=>ord[a]-ord[b2]); missB.sort((a,b2)=>ord[a]-ord[b2]);
    let mat=0; missW.forEach(t=>mat+=VAL[t]); missB.forEach(t=>mat-=VAL[t]);
    return {missW,missB,mat:Math.round(mat/100)};
  }
  function draw(){
    const b=$('#ch-board'); if(!b) return;
    const {missW,missB,mat}=captured();
    $('#ch-caps-w').textContent=missW.map(t=>GL[t]).join('');
    $('#ch-caps-b').textContent=missB.map(t=>GL[t]).join('');
    $('#ch-mat').textContent=mat>0?`+${fa(mat)} تو`:mat<0?`+${fa(-mat)} ربات`:'';
    $('#ch-me').classList.toggle('turn',turn==='w'&&!over);
    $('#ch-bot').classList.toggle('turn',turn==='b'&&!over);
    const wk=kingPos(B,'w'),bk=kingPos(B,'b');
    const wCheck=attacked(B,wk[0],wk[1],'b'),bCheck=attacked(B,bk[0],bk[1],'w');
    b.innerHTML='';
    for(let r=0;r<8;r++)for(let c=0;c<8;c++){
      const d=document.createElement('div');
      let cls='cs '+(((r+c)%2===0)?'L':'D');
      if(sel&&sel[0]===r&&sel[1]===c) cls+=' sel';
      if(last&&((last.fr===r&&last.fc===c)||(last.tr===r&&last.tc===c))) cls+=' last';
      if((wCheck&&wk[0]===r&&wk[1]===c)||(bCheck&&bk[0]===r&&bk[1]===c)) cls+=' check';
      d.className=cls;
      const t=legalCache.find(m=>m.tr===r&&m.tc===c);
      if(sel&&t) d.innerHTML+= B[r][c]||t.ep?'<span class="dotcap"></span>':'<span class="dotmv"></span>';
      const p=B[r][c];
      if(p) d.innerHTML+=`<span class="pc ${p.c}">${GL[p.t]}</span>`;
      if(r===7) d.innerHTML+=`<span class="co f">${FILES[c]}</span>`;
      if(c===0) d.innerHTML+=`<span class="co r">${8-r}</span>`;
      d.onclick=()=>tap(r,c);
      b.appendChild(d);
    }
    fitPieces();
  }
  function tap(r,c){
    if(over||thinking||turn!=='w') return;
    const p=B[r][c];
    if(sel){
      const opts=legalCache.filter(m=>m.tr===r&&m.tc===c);
      if(opts.length){
        if(opts[0].promo){ showPromo(opts); return; }
        playerMove(opts[0]); return;
      }
    }
    if(p&&p.c==='w'){ sel=[r,c]; legalCache=legalFor(r,c); SFX.tap(); haptic('light'); draw(); }
    else { sel=null; legalCache=[]; draw(); }
  }
  function showPromo(opts){
    const w=$('#ch-wrap');
    const o=document.createElement('div'); o.className='promo-wrap'; o.id='promo';
    o.innerHTML=`<div class="promo-box"><b>♟️➡️👑 ارتقا به چی؟</b><div class="pr">
      ${['q','r','b','n'].map(t=>`<button data-t="${t}">${GL[t]}</button>`).join('')}</div></div>`;
    w.appendChild(o);
    o.querySelectorAll('button').forEach(btn=>btn.onclick=()=>{
      const m=opts.find(x=>x.promo===btn.dataset.t);
      o.remove(); playerMove(m);
    });
  }
  function afterMove(mover){
    last=arguments[2]||last;
    const fo=opp(mover);
    const[kR,kC]=kingPos(B,fo);
    const chk=attacked(B,kR,kC,mover);
    const ms=allLegal(fo);
    if(!ms.length){
      if(chk){ end(mover==='w'?'win':'lose', mover==='w'?'کیش‌ومات! 👑⚡':'مات شدی! ♟️'); }
      else end('draw','پات! 🤝');
      return true;
    }
    if(half>=100){ end('draw','مساوی (۵۰ حرکت)! 🤝'); return true; }
    if(insufficient()){ end('draw','مساوی (کمبود مهره)! 🤝'); return true; }
    if(chk){ SFX.check(); haptic('heavy'); }
    return false;
  }
  function playerMove(m){
    sel=null; legalCache=[];
    const wasCap=B[m.tr][m.tc]||m.ep, wasPawn=B[m.fr][m.fc].t==='p';
    applyOn(B,m,cast);
    if(wasPawn||wasCap) half=0; else half++;
    ep=m.double?[(m.fr+m.tr)/2,m.fc]:null;
    last=m; turn='b';
    wasCap?SFX.capture():SFX.move(); haptic('medium');
    draw();
    if(afterMove('w',null,m)) return;
    thinking=true;
    $('#ch-msg').textContent='ربات در حال فکر کردن…';
    setTimeout(()=>{
      if(over){thinking=false;return;}
      const bm=botPick();
      thinking=false;
      if(!bm){ end('draw','پات! 🤝'); return; }
      const c2=B[bm.tr][bm.tc]||bm.ep, p2=B[bm.fr][bm.fc].t==='p';
      applyOn(B,bm,cast);
      if(p2||c2) half=0; else half++;
      ep=bm.double?[(bm.fr+bm.tr)/2,bm.fc]:null;
      last=bm; turn='w'; fullmoves++;
      c2?SFX.capture():SFX.move();
      draw();
      if(afterMove('b',null,bm)) return;
      const[kR,kC]=kingPos(B,'w');
      $('#ch-msg').textContent = attacked(B,kR,kC,'b')?'کیش! شاهت زیر ضربه است':'نوبت توست';
    }, 450+Math.random()*600);
  }
  function end(kind,title){
    over=true; thinking=false; draw();
    $('#ch-msg').textContent = kind==='win'?'بردت مبارک!':kind==='lose'?'باختی — تلاش دوباره':'مساوی شد';
    bumpStat(kind==='win');
    logHistory('chess',kind,`${fa(fullmoves)} حرکت`);
    if(kind==='win'){
      const reward=(diff==='hard'?110:diff==='medium'?70:40)+Math.max(5,30-fullmoves);
      store.set('best_chess',fa(fullmoves)+' حرکت 👑');
      addCoins(reward,'شطرنج ♟️');
      showEnd(true,title+ ' بردی!',`� رو توی <b>${fa(fullmoves)} حرکت</b> مات کردی! 🧠👑<br>🪙 <b>${fa(reward)} سکه</b> گرفتی!`,()=>render(diff));
    } else if(kind==='lose'){
      addCoins(8,'تلاش در شطرنج 💪');
      showEnd(false,title,`${title.includes('تسلیم')?'اشکال نداره قهرمان!':'ربات زرنگ بود!'} یه دست دیگه بزن 💪<br>🪙 ۸ سکه دلداری گرفتی!`,()=>render(diff));
    } else {
      addCoins(15,'مساوی شطرنج 🤝');
      showEnd(null,'مساوی شد! 🤝',`بازی توی <b>${fa(fullmoves)} حرکت</b> مساوی تموم شد!<br>🪙 <b>۱۵ سکه</b> گرفتی!`,()=>render(diff));
    }
  }
  return { render, stop(){over=true;thinking=false;} };
})();
