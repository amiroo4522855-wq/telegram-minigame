/* ===== بال‌ران: توپ نئونی ===== */
const BallRunGame = (()=>{
  const CONF={easy:{sp:.85},medium:{sp:1},hard:{sp:1.2}};
  let diff,spMul,W,H,cv,ctx,raf,lastT,over;
  let ballX,targetX,ballY,score,coinsGet,lives,best,speed,dist,spawnT;
  let obstacles,items,parts,trail,starsBg,invT,shield,doubleT,shakeT,flashT,keys,mile,vig,magnetR=25;
  const BR=13;
  function render(d){
    diff=d; stop(); over=false;
    spMul=(CONF[d]||CONF.medium).sp;
    score=0;coinsGet=0;lives=3;dist=0;spawnT=.5;invT=1;shield=upgLevel('ball_magnet')>=3;magnetR=BR+12+upgLevel('ball_magnet')*8;doubleT=0;shakeT=0;flashT=0;mile=0;
    obstacles=[];items=[];parts=[];trail=[];
    keys={};
    starsBg=Array.from({length:40},()=>({x:Math.random(),y:Math.random(),r:.5+Math.random()*1.5,sp:.3+Math.random()}));
    best=store.get('best_ballrun',0);
    const box=$('#game-container');
    box.innerHTML=`<div class="panel">
      <div class="br-hud">
        <div><small>❤️</small><b id="br-lives">۳</b></div>
        <div class="br-score"><small>امتیاز</small><b id="br-score">۰</b></div>
        <div><small>🪙</small><b id="br-coins">۰</b></div>
        <div><small>رکورد</small><b id="br-best">${fa(best)}</b></div>
      </div>
      <div class="br-wrap"><canvas id="br-cv"></canvas><div class="tw-hint" id="br-hint">👆 انگشتت رو بکش تا توپ حرکت کنه!</div></div>
      <div class="t-hint">از موانع فرار کن، سکه جمع کن! 🪙</div>
    </div>`;
    cv=$('#br-cv'); ctx=cv.getContext('2d');
    sizeCv();
    ballX=W/2; targetX=W/2; ballY=H-150;
    window.addEventListener('resize',sizeCv);
    cv.addEventListener('pointerdown',pDown);
    cv.addEventListener('pointermove',pMove);
    document.addEventListener('keydown',keyD);
    document.addEventListener('keyup',keyU);
    lastT=performance.now();
    raf=requestAnimationFrame(loop);
  }
  function sizeCv(){
    const wrap=cv.parentElement;
    W=wrap.clientWidth; H=Math.round(W*1.35);
    const dpr=Math.min(2,window.devicePixelRatio||1);
    cv.width=W*dpr; cv.height=H*dpr; cv.style.height=H+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ballY=H-150;
    vig=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*0.35,W/2,H/2,Math.max(W,H)*0.75);
    vig.addColorStop(0,'rgba(0,0,0,0)');vig.addColorStop(1,'rgba(0,0,0,.45)');
  }
  function pDown(e){ hideHint(); pMove(e); }
  function pMove(e){
    if(over) return;
    const r=cv.getBoundingClientRect();
    targetX=Math.max(BR+8,Math.min(W-BR-8,e.clientX-r.left));
  }
  function keyD(e){
    if(e.key==='ArrowLeft'||e.key==='a')keys.l=true;
    if(e.key==='ArrowRight'||e.key==='d')keys.r=true;
    if(e.key.startsWith('Arrow'))e.preventDefault();
    hideHint();
  }
  function keyU(e){
    if(e.key==='ArrowLeft'||e.key==='a')keys.l=false;
    if(e.key==='ArrowRight'||e.key==='d')keys.r=false;
  }
  function hideHint(){ const h=$('#br-hint'); if(h)h.style.display='none'; }
  function tier(){ return dist<400?0:dist<1200?1:dist<2500?2:3; }
  function spawn(){
    const t=tier(), gap=90-t*8;
    const roll=Math.random();
    if(roll<0.62){
      const r2=Math.random();
      const kind=t>=2&&r2<.3?'mover':(t>=1&&r2<.5?'wall':(t>=1&&r2<.7?'spike':'block'));
      if(kind==='block'){
        const w=50+Math.random()*70;
        obstacles.push({x:Math.random()*(W-w),y:-40,w,h:34,kind:'block'});
      } else if(kind==='spike'){
        const w=70+Math.random()*60;
        obstacles.push({x:Math.random()*(W-w),y:-46,w,h:40,kind:'spike'});
      } else if(kind==='wall'){
        const gx=30+Math.random()*(W-60-gap);
        obstacles.push({x:0,y:-40,w:gx,h:34,kind:'block'});
        obstacles.push({x:gx+gap,y:-40,w:W-gx-gap,h:34,kind:'block'});
      } else {
        const w=70;
        obstacles.push({x:Math.random()*(W-w),y:-40,w,h:30,kind:'mover',vx:(Math.random()<.5?-1:1)*(80+t*30),ph:Math.random()*6});
      }
    } else if(roll<0.85){
      const n=3+((Math.random()*3)|0), cx=30+Math.random()*(W-60);
      for(let i=0;i<n;i++) items.push({x:cx,y:-30-i*42,kind:'coin',ph:Math.random()*6});
    } else {
      const x=30+Math.random()*(W-60);
      const k=lives<3&&Math.random()<.3?'heart':(shield?1:Math.random()<.4?'shield':'star2x');
      items.push({x,y:-30,kind:typeof k==='string'?k:'star2x',ph:0});
    }
  }
  function circleRect(cx,cy,r,rx,ry,rw,rh){
    const nx=Math.max(rx,Math.min(cx,rx+rw)), ny=Math.max(ry,Math.min(cy,ry+rh));
    return (cx-nx)*(cx-nx)+(cy-ny)*(cy-ny)<r*r;
  }
  function burst(x,y,col,n,spd){
    for(let i=0;i<n;i++){
      const a=Math.random()*6.28, s=(spd||120)*(0.4+Math.random());
      parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-40,life:.4+Math.random()*.4,t:0,col,r:1.5+Math.random()*2.5});
    }
  }
  function updHud(){
    const s=$('#br-score'); if(s)s.textContent=fa(Math.floor(score));
    const c=$('#br-coins'); if(c)c.textContent=fa(coinsGet);
    const l=$('#br-lives'); if(l)l.textContent=fa(lives);
  }
  function loop(t){
    if(over) return;
    const dt=Math.min(.05,(t-lastT)/1000); lastT=t;
    const tm=t/1000;
    speed=(250+Math.min(420,dist*0.12))*spMul;
    if(keys.l)targetX-=380*dt;
    if(keys.r)targetX+=380*dt;
    targetX=Math.max(BR+8,Math.min(W-BR-8,targetX));
    ballX+=(targetX-ballX)*Math.min(1,dt*14);
    trail.push({x:ballX,y:ballY});
    if(trail.length>16)trail.shift();
    dist+=speed*dt;
    score+=dt*speed*0.05*(doubleT>0?2:1);
    if(doubleT>0)doubleT-=dt;
    if(invT>0)invT-=dt;
    if(shakeT>0)shakeT-=dt;
    if(flashT>0)flashT-=dt;
    mileCheck();
    spawnT-=dt;
    if(spawnT<=0){ spawn(); spawnT=Math.max(.32,.85-dist*0.00012)/spMul; }
    obstacles.forEach(o=>{
      o.y+=speed*dt;
      if(o.kind==='mover'){ o.x+=o.vx*dt; if(o.x<0||o.x+o.w>W)o.vx*=-1; }
    });
    obstacles=obstacles.filter(o=>o.y<H+60);
    items.forEach(it=>{ it.y+=speed*dt; it.ph+=dt*5; });
    items=items.filter(it=>it.y<H+40);
    parts=parts.filter(p=>{ p.t+=dt; p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=200*dt; return p.t<p.life; });
    starsBg.forEach(s=>{ s.y+=s.sp*dt*0.15; if(s.y>1)s.y=0; });
    // برخورد سکه/آیتم
    for(let i=items.length-1;i>=0;i--){
      const it=items[i];
      if(Math.hypot(it.x-ballX,it.y-ballY)<magnetR){
        items.splice(i,1);
        if(it.kind==='coin'){ coinsGet++; score+=10; burst(it.x,it.y,'#fbbf24',8); beep(800+coinsGet*5,.06,'square'); }
        else if(it.kind==='heart'){ lives=Math.min(3,lives+1); burst(it.x,it.y,'#fb7185',12); toast('❤️ جون گرفتی!'); SFX.good(); }
        else if(it.kind==='shield'){ shield=true; burst(it.x,it.y,'#22d3ee',12); toast('🛡️ سپر گرفتی!'); SFX.good(); }
        else { doubleT=8; burst(it.x,it.y,'#f0abfc',12); toast('⭐ امتیاز دوبرابر!'); SFX.good(); }
        updHud();
      }
    }
    // برخورد مانع
    if(invT<=0){
      for(let i=obstacles.length-1;i>=0;i--){
        const o=obstacles[i];
        const hit=o.kind==='spike'
          ?circleRect(ballX,ballY,BR-3,o.x+4,o.y+10,o.w-8,o.h-10)
          :circleRect(ballX,ballY,BR-3,o.x,o.y,o.w,o.h);
        if(hit){
          obstacles.splice(i,1);
          if(shield){
            shield=false; burst(o.x+o.w/2,o.y,'#22d3ee',16,200);
            beep(400,.15,'sawtooth'); toast('سپر نجاتت داد! 🛡️');
          } else {
            lives--; flashT=.25; shakeT=.3; invT=1.5;
            burst(ballX,ballY,'#ef4444',18,220);
            SFX.bad(); haptic('heavy'); updHud();
            if(lives<=0){ endGame(); return; }
          }
          break;
        }
      }
    }
    draw(tm);
    raf=requestAnimationFrame(loop);
  }
  function mileCheck(){
    const m=score>=3000?3:score>=1500?2:score>=500?1:0;
    if(m>mile){ mile=m; toast(['','🔥 ۵۰۰ امتیاز!','⚡ ۱۵۰۰ امتیاز!','🚀 ۳۰۰۰ امتیاز!'][m]); SFX.good(); }
  }
  function drawBlock(o){
    ctx.save();
    ctx.shadowColor='#ef4444';ctx.shadowBlur=14;
    const og=ctx.createLinearGradient(o.x,o.y,o.x,o.y+o.h);
    og.addColorStop(0,'#7f1d1d');og.addColorStop(.5,'#b91c1c');og.addColorStop(1,'#7f1d1d');
    ctx.fillStyle=og;
    ctx.beginPath();ctx.roundRect(o.x,o.y,o.w,o.h,8);ctx.fill();
    ctx.shadowBlur=0;
    ctx.save();
    ctx.beginPath();ctx.roundRect(o.x,o.y,o.w,o.h,8);ctx.clip();
    ctx.fillStyle='rgba(0,0,0,.35)';
    for(let sx=o.x-o.h;sx<o.x+o.w;sx+=16){
      ctx.beginPath();ctx.moveTo(sx,o.y);ctx.lineTo(sx+8,o.y);ctx.lineTo(sx+8+o.h,o.y+o.h);ctx.lineTo(sx+o.h,o.y+o.h);ctx.closePath();ctx.fill();
    }
    ctx.fillStyle='rgba(255,255,255,.28)';
    ctx.fillRect(o.x+5,o.y+4,o.w-10,4);
    ctx.restore();
    ctx.fillStyle='#fecaca';
    [[o.x+8,o.y+8],[o.x+o.w-8,o.y+8],[o.x+8,o.y+o.h-8],[o.x+o.w-8,o.y+o.h-8]].forEach(([px,py])=>{ctx.beginPath();ctx.arc(px,py,2.2,0,7);ctx.fill();});
    ctx.restore();
  }
  function drawSpikes(o){
    ctx.save();
    ctx.shadowColor='#ef4444';ctx.shadowBlur=12;
    ctx.fillStyle='#991b1b';
    ctx.fillRect(o.x,o.y,o.w,10);
    const n=Math.max(2,Math.round(o.w/22)), sw=o.w/n;
    const sg=ctx.createLinearGradient(0,o.y,0,o.y+o.h);
    sg.addColorStop(0,'#fca5a5');sg.addColorStop(1,'#dc2626');
    ctx.fillStyle=sg;
    for(let k=0;k<n;k++){
      const x0=o.x+k*sw;
      ctx.beginPath();ctx.moveTo(x0+1,o.y+10);ctx.lineTo(x0+sw/2,o.y+o.h);ctx.lineTo(x0+sw-1,o.y+10);ctx.closePath();ctx.fill();
    }
    ctx.shadowBlur=0;
    ctx.fillStyle='rgba(255,255,255,.5)';
    for(let k=0;k<n;k++){const x0=o.x+k*sw;ctx.fillRect(x0+sw/2-1.5,o.y+14,3,Math.max(2,o.h-20));}
    ctx.restore();
  }
  function drawMover(o,tm){
    ctx.save();
    ctx.shadowColor='#f0abfc';ctx.shadowBlur=14;
    const og=ctx.createLinearGradient(o.x,o.y,o.x,o.y+o.h);
    og.addColorStop(0,'#f0abfc');og.addColorStop(1,'#a21caf');
    ctx.fillStyle=og;
    ctx.beginPath();ctx.roundRect(o.x,o.y,o.w,o.h,10);ctx.fill();
    ctx.shadowBlur=0;ctx.fillStyle='rgba(255,255,255,.35)';
    ctx.fillRect(o.x+6,o.y+4,o.w-12,4);
    const pw=o.w*(0.3+0.2*Math.sin(tm*6+(o.ph||0)));
    ctx.fillStyle='rgba(255,255,255,.55)';
    ctx.fillRect(o.x+o.w/2-pw/2,o.y+o.h/2-2,pw,4);
    ctx.restore();
  }
  function drawHeart(x,y,s){
    ctx.save();ctx.translate(x,y);ctx.scale(s/20,s/20);
    ctx.shadowColor='#fb7185';ctx.shadowBlur=12;ctx.fillStyle='#fb7185';
    ctx.beginPath();ctx.moveTo(0,6);
    ctx.bezierCurveTo(-11,-3,-6,-12,0,-6);
    ctx.bezierCurveTo(6,-12,11,-3,0,6);
    ctx.fill();ctx.shadowBlur=0;
    ctx.fillStyle='rgba(255,255,255,.7)';
    ctx.beginPath();ctx.arc(-3.5,-6,1.8,0,7);ctx.fill();
    ctx.restore();
  }
  function drawShieldIc(x,y,s){
    ctx.save();ctx.translate(x,y);ctx.scale(s/20,s/20);
    ctx.shadowColor='#22d3ee';ctx.shadowBlur=12;
    ctx.fillStyle='#0e7490';
    ctx.beginPath();ctx.moveTo(0,-9);ctx.lineTo(7,-6);ctx.lineTo(7,0);ctx.quadraticCurveTo(7,6,0,9);ctx.quadraticCurveTo(-7,6,-7,0);ctx.lineTo(-7,-6);ctx.closePath();ctx.fill();
    ctx.shadowBlur=0;ctx.strokeStyle='#a5f3fc';ctx.lineWidth=1.6;ctx.stroke();
    ctx.strokeStyle='#fff';ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(-3,0);ctx.lineTo(-0.5,2.5);ctx.lineTo(3.5,-2.5);ctx.stroke();
    ctx.restore();
  }
  function drawStarIc(x,y,s,rot){
    ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);
    ctx.shadowColor='#f0abfc';ctx.shadowBlur=12;ctx.fillStyle='#f0abfc';
    ctx.beginPath();
    for(let k=0;k<10;k++){const r=k%2?s*0.22:s*0.5,a=-Math.PI/2+k*Math.PI/5;
      ctx[k?'lineTo':'moveTo'](Math.cos(a)*r,Math.sin(a)*r);}
    ctx.closePath();ctx.fill();ctx.shadowBlur=0;
    ctx.fillStyle='rgba(255,255,255,.85)';
    ctx.beginPath();ctx.arc(0,0,s*0.12,0,7);ctx.fill();
    ctx.restore();
  }
  function draw(tm){
    ctx.save();
    if(shakeT>0)ctx.translate((Math.random()-.5)*10*shakeT*4,(Math.random()-.5)*8*shakeT*4);
    const g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,'#12082e');g.addColorStop(.55,'#1e1040');g.addColorStop(1,'#0b0518');
    ctx.fillStyle=g; ctx.fillRect(-12,-12,W+24,H+24);
    starsBg.forEach(s=>{
      ctx.globalAlpha=.3+.5*Math.abs(Math.sin(tm*2+s.x*9));
      ctx.fillStyle='#fff'; ctx.fillRect(s.x*W,s.y*H,s.r,s.r);
    });
    ctx.globalAlpha=1;
    // ریل‌های نئونی
    const dash=(tm*speed*0.5)%44;
    ctx.save();
    ctx.shadowColor='#a855f7';ctx.shadowBlur=14;
    ctx.fillStyle='#7c3aed';
    ctx.fillRect(2,0,5,H);ctx.fillRect(W-7,0,5,H);
    ctx.shadowBlur=0;ctx.fillStyle='#e9d5ff';
    for(let y=-44+dash;y<H;y+=44){ ctx.fillRect(3,y,3,20); ctx.fillRect(W-6,y,3,20); }
    ctx.restore();
    // خطوط مسیر
    ctx.fillStyle='rgba(168,85,247,.25)';
    for(let i=1;i<5;i++){
      const x=W*i/5;
      for(let y=-40+((tm*speed*0.7)%80);y<H;y+=80) ctx.fillRect(x-2,y,4,26);
    }
    // خطوط سرعت
    if(dist>1200){
      ctx.strokeStyle='rgba(196,181,253,.22)';ctx.lineWidth=2;
      for(let k=0;k<8;k++){
        const lx=((k*97+tm*260)%(W+80))-40, ly=((k*173+tm*speed*1.3)%(H+60))-30;
        ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(lx,ly+34);ctx.stroke();
      }
    }
    // آیتم‌ها
    items.forEach(it=>{
      if(it.kind==='coin'){
        const sq=Math.abs(Math.cos(it.ph));
        ctx.save();
        ctx.strokeStyle='rgba(251,191,36,.45)';ctx.lineWidth=2;
        ctx.beginPath();ctx.arc(it.x,it.y,12+2*Math.sin(it.ph),0,7);ctx.stroke();
        ctx.shadowColor='#fbbf24';ctx.shadowBlur=12;
        ctx.fillStyle='#fbbf24';
        ctx.beginPath();ctx.ellipse(it.x,it.y,9,9*(0.35+0.65*sq),0,0,7);ctx.fill();
        ctx.shadowBlur=0;ctx.fillStyle='#92400e';
        ctx.beginPath();ctx.ellipse(it.x,it.y,4,4*(0.35+0.65*sq),0,0,7);ctx.fill();
        ctx.restore();
      } else {
        const iy=it.y+Math.sin(it.ph)*3;
        const ring=it.kind==='heart'?'#fb7185':it.kind==='shield'?'#22d3ee':'#f0abfc';
        ctx.save();
        ctx.shadowColor=ring;ctx.shadowBlur=14;
        ctx.fillStyle='rgba(10,6,24,.9)';
        ctx.beginPath();ctx.arc(it.x,iy,14,0,7);ctx.fill();
        ctx.shadowBlur=0;ctx.strokeStyle=ring;ctx.lineWidth=2;
        ctx.beginPath();ctx.arc(it.x,iy,14,0,7);ctx.stroke();
        ctx.restore();
        if(it.kind==='heart')drawHeart(it.x,iy,20);
        else if(it.kind==='shield')drawShieldIc(it.x,iy,20);
        else drawStarIc(it.x,iy,22,it.ph);
      }
    });
    // موانع
    obstacles.forEach(o=>{
      if(o.kind==='spike')drawSpikes(o);
      else if(o.kind==='mover')drawMover(o,tm);
      else drawBlock(o);
    });
    // ذرات
    parts.forEach(p=>{
      ctx.save();ctx.globalAlpha=1-p.t/p.life;ctx.fillStyle=p.col;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill();ctx.restore();
    });
    // دنباله نوری توپ
    for(let k=0;k<trail.length;k++){
      const p=trail[k], f=(k+1)/trail.length;
      ctx.fillStyle=doubleT>0?`rgba(240,171,252,${f*0.3})`:`rgba(34,211,238,${f*0.3})`;
      ctx.beginPath();ctx.arc(p.x,p.y,BR*f*0.9,0,7);ctx.fill();
    }
    // توپ
    const blink=invT>0&&((tm*12)|0)%2===0;
    if(!blink){
      ctx.save();
      const bs=(window.Hub&&Hub.ballColors(equippedGet('ball')))||null;
      const bMid=doubleT>0?'#f0abfc':(bs?bs.m:'#67e8f9'), bRim=doubleT>0?'#a21caf':(bs?bs.r:'#0e7490');
      ctx.shadowColor=doubleT>0?'#f0abfc':(bs?bs.g:'#22d3ee');ctx.shadowBlur=22;
      const bg=ctx.createRadialGradient(ballX-4,ballY-5,2,ballX,ballY,BR);
      bg.addColorStop(0,(bs&&doubleT<=0)?bs.c:'#fff');bg.addColorStop(.4,bMid);bg.addColorStop(1,bRim);
      ctx.fillStyle=bg;
      ctx.beginPath();ctx.arc(ballX,ballY,BR,0,7);ctx.fill();
      ctx.restore();
      ctx.strokeStyle='rgba(255,255,255,.65)';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.arc(ballX,ballY,BR-1,0,7);ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,.85)';
      ctx.beginPath();ctx.arc(ballX-4,ballY-5,2.6,0,7);ctx.fill();
      const sa=tm*4;
      ctx.fillStyle='rgba(255,255,255,.9)';
      ctx.beginPath();ctx.arc(ballX+Math.cos(sa)*6.5,ballY+Math.sin(sa)*6.5,1.8,0,7);ctx.fill();
      if(shield){
        ctx.save();ctx.strokeStyle='rgba(34,211,238,.85)';ctx.lineWidth=2.5;
        ctx.setLineDash([8,6]);ctx.lineDashOffset=-tm*40;
        ctx.beginPath();ctx.arc(ballX,ballY,BR+7,0,7);ctx.stroke();ctx.restore();
      }
    }
    if(vig){ ctx.fillStyle=vig; ctx.fillRect(-12,-12,W+24,H+24); }
    if(flashT>0){ ctx.fillStyle=`rgba(239,68,68,${flashT*1.6})`; ctx.fillRect(-12,-12,W+24,H+24); }
    ctx.restore();
  }
  function endGame(){
    over=true;
    const sc=Math.floor(score);
    if(sc>best){best=sc;store.set('best_ballrun',best);store.set('best_ballrun_t',fa(best)+' امتیاز');}
    const won=sc>=600;
    bumpStat(won);
    logHistory('ballrun',won?'win':'lose',`${fa(sc)} امتیاز • 🪙${fa(coinsGet)}`);
    const reward=Math.min(130,10+Math.floor(sc/12));
    if(reward>0)addCoins(reward,'بال‌ران'); SFX.bad();
    showEnd(won,won?'🟣 استاد بال‌ران!':'💥 ترکیدی!',
      `امتیاز: <b>${fa(sc)}</b> (رکورد: ${fa(best)})<br>🪙 ${fa(coinsGet)} سکه جمع کردی!<br>${won?'':'۶۰۰ امتیاز برای برد لازمه! 💪<br>'}🪙 <b>${fa(reward)} سکه</b> گرفتی!`,
      ()=>render(diff));
  }
  function stop(){
    over=true;
    if(raf)cancelAnimationFrame(raf);raf=null;
    window.removeEventListener('resize',sizeCv);
    cv?.removeEventListener('pointerdown',pDown);
    cv?.removeEventListener('pointermove',pMove);
    document.removeEventListener('keydown',keyD);
    document.removeEventListener('keyup',keyU);
  }
  return { render, stop, debug:()=>({score:Math.floor(score||0),lives:typeof lives==='number'?lives:0,x:Math.round(ballX||0)}), forceOver:()=>{ if(!over){lives=0;endGame();} }, testItem:(kind,dy)=>{ if(!over&&ballX!=null)items.push({x:ballX,y:ballY-(dy||60),kind:kind||'coin',ph:0}); }, testObs:(kind)=>{ if(!over&&W!=null){const k=kind||'spike';obstacles.push({x:W/2-70,y:120,w:140,h:k==='spike'?42:34,kind:k,vx:120,ph:0});} } };
})();
