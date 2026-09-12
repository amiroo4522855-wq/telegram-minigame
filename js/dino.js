/* ===== دایی ناصر (دایناسور دونده) ===== */
const DinoGame = (()=>{
  const CONF={easy:{v0:360,max:660,bird:0.10},medium:{v0:460,max:800,bird:0.18},hard:{v0:550,max:950,bird:0.28}};
  const GRAV=2900, JUMPV=900;
  let cv,ctx,W=0,H=252,DPR=1,raf=0,last=0,diff='medium';
  let state='ready',paused=false,over=false;
  let speed,dist,scoreM,best,vy,y,duck,duckT,legPh,blinkT,dead,groundY,dMult=1;
  let obstacles=[],clouds=[],parts=[],popups=[],nextGap,stars=[];
  let lastHUD='';

  function reset(){
    const c=CONF[diff]||CONF.medium;
    speed=c.v0; dist=0; scoreM=0; vy=0; duck=false; duckT=0; legPh=0; blinkT=2; dead=false;
    dMult=1+upgLevel('dino_score')*0.15;
    groundY=H-42; y=groundY;
    obstacles=[];parts=[];popups=[];nextGap=500;
    if(!clouds.length) for(let i=0;i<4;i++) clouds.push({x:Math.random()*800,y:20+Math.random()*70,s:0.6+Math.random()*0.8});
    if(!stars.length) for(let i=0;i<40;i++) stars.push({x:Math.random()*1000,y:Math.random()*150,s:Math.random()*1.6+0.4});
  }
  function sizeCanvas(){
    if(!cv) return;
    const w=cv.parentElement.clientWidth;
    DPR=Math.min(2,window.devicePixelRatio||1);
    W=w; H=252;
    cv.width=w*DPR; cv.height=H*DPR;
    cv.style.width=w+'px'; cv.style.height=H+'px';
    ctx.setTransform(DPR,0,0,DPR,0,0);
    groundY=H-42; if(state==='ready') y=groundY;
  }

  function render(d){
    diff=d; stop();
    over=false;state='ready';paused=false;
    best=store.get('best_dino',0);
    reset();
    const box=$('#game-container');
    box.innerHTML=`<div class="panel">
      <div class="hud">
        <div class="h"><b id="d-score">۰</b><small>${icon('bolt',12)} متر${dMult>1?' ×'+dMult.toFixed(2).replace(/\.?0+$/,''):''}</small></div>
        <div class="h"><b id="d-best">${fa(best)}</b><small>${icon('trophy',12)} رکورد</small></div>
        <div class="h"><b id="d-speed">۰</b><small>${icon('chart',12)} سرعت</small></div>
      </div>
      <div class="dino-wrap"><canvas id="d-cv"></canvas>
        <button class="d-pause" id="d-pause">❚❚</button>
        <div class="dino-over" id="d-over"></div>
      </div>
      <div class="dino-btns">
        <button class="btn btn-ghost" id="d-duck">▼ خم شو</button>
        <button class="btn btn-primary" id="d-jump">▲ بپر!</button>
      </div></div>`;
    cv=$('#d-cv'); ctx=cv.getContext('2d');
    sizeCanvas();
    window.addEventListener('resize',sizeCanvas);
    window.addEventListener('keydown',onKeyD);
    window.addEventListener('keyup',onKeyU);
    document.addEventListener('visibilitychange',onVis);
    cv.addEventListener('pointerdown',onTap);
    let ty=0;
    cv.addEventListener('touchstart',e=>{ty=e.changedTouches[0].clientY;},{passive:true});
    cv.addEventListener('touchend',e=>{ if(e.changedTouches[0].clientY-ty>34&&state==='play'){duckT=0.4;} },{passive:true});
    $('#d-jump').addEventListener('pointerdown',e=>{e.preventDefault();pressJump();});
    const db=$('#d-duck');
    db.addEventListener('pointerdown',e=>{e.preventDefault();duck=true;});
    db.addEventListener('pointerup',()=>duck=false);
    db.addEventListener('pointerleave',()=>duck=false);
    $('#d-pause').onclick=()=>{ if(state!=='play')return; paused=!paused; SFX.tap(); drawPause(); };
    showReady();
    last=performance.now();
    raf=requestAnimationFrame(loop);
  }
  function onVis(){ if(document.hidden&&state==='play'&&!paused){paused=true;drawPause();} }
  function onKeyD(e){
    if([' ','ArrowUp','ArrowDown'].includes(e.key)) e.preventDefault();
    if(e.repeat) return;
    if(e.key===' '||e.key==='ArrowUp') pressJump();
    if(e.key==='ArrowDown') duck=true;
    if(e.key==='Enter'&&state!=='play') start();
  }
  function onKeyU(e){ if(e.key==='ArrowDown') duck=false; }
  function onTap(){ pressJump(); }
  function pressJump(){
    if(state==='ready'){ start(); return; }
    if(state!=='play'||paused) return;
    if(y>=groundY-1){ vy=-JUMPV; SFX.flip(); haptic('light');
      for(let i=0;i<6;i++) parts.push({x:56,y:groundY+4,vx:-60-Math.random()*80,vy:-Math.random()*120,r:2+Math.random()*3,a:1,c:'#c9bdf5'});
    }
  }
  function start(){
    reset(); state='play'; paused=false;
    $('#d-over').style.display='none';
    SFX.tap(); haptic('medium');
  }
  function showReady(){
    const o=$('#d-over'); o.style.display='grid';
    o.innerHTML=`<div class="d-msg"><b>🦕 دایی ناصر آماده‌ست!</b><small>بزن تا شروع کنه دویدن...</small>
      <button class="btn btn-primary" id="d-start">▶ شروع!</button></div>`;
    $('#d-start').onclick=e=>{e.stopPropagation();start();};
    o.onclick=()=>start();
  }
  function drawPause(){
    const o=$('#d-over');
    if(!paused){ o.style.display='none'; o.onclick=null; return; }
    o.style.display='grid';
    o.innerHTML=`<div class="d-msg"><b>متوقف شد ⏸</b><button class="btn btn-primary" id="d-res">ادامه ▶</button></div>`;
    $('#d-res').onclick=e=>{e.stopPropagation();paused=false;drawPause();};
    o.onclick=()=>{paused=false;drawPause();};
  }
  function gameOver(){
    state='over'; dead=true; SFX.bad(); haptic('heavy'); notify('error');
    const isBest=scoreM>best;
    if(isBest){best=scoreM;store.set('best_dino',best);store.set('best_dino_t',fa(best)+' متر');}
    const won=scoreM>=150;
    bumpStat(won);
    logHistory('dino',won?'win':'lose',`${fa(scoreM)} متر`);
    const reward=Math.min(130,12+Math.floor(scoreM/12));
    addCoins(reward,'دایی ناصر');
    const o=$('#d-over'); o.style.display='grid'; o.onclick=null;
    o.innerHTML=`<div class="d-msg"><b>دایی ناصر خورد زمین! 🦕💥</b>
      <small>مسافت: <b>${fa(scoreM)} متر</b>${isBest?' • 🏆 رکورد جدید!':''}<br>رکورد: ${fa(best)} متر<br>🪙 ${fa(reward)} سکه گرفتی!</small>
      <div class="end-btns"><button class="btn btn-primary" id="d-again">🔁 دوباره</button>
      <button class="btn btn-ghost" id="d-home">خانه</button></div></div>`;
    $('#d-again').onclick=e=>{e.stopPropagation();start();};
    $('#d-home').onclick=e=>{e.stopPropagation();goHome();};
  }

  function spawn(){
    const c=CONF[diff];
    const r=Math.random();
    if(r<c.bird){
      const hs=[groundY-26,groundY-56,groundY-88];
      obstacles.push({t:'bird',x:W+40,y:hs[Math.random()*3|0],w:36,h:24,ph:Math.random()*6});
    } else {
      const k=Math.random();
      if(k<0.4) obstacles.push({t:'c1',x:W+40,y:groundY-42,w:22,h:42});
      else if(k<0.75) obstacles.push({t:'c2',x:W+40,y:groundY-58,w:28,h:58});
      else obstacles.push({t:'c3',x:W+40,y:groundY-42,w:62,h:42});
    }
    nextGap=(300+Math.random()*340)*(520/speed);
  }

  function loop(t){
    if(over) return;
    const dt=Math.min(0.05,(t-last)/1000); last=t;
    if(!paused&&state==='play') update(dt);
    else if(state!=='play') idleAnim(dt);
    renderScene(dt);
    raf=requestAnimationFrame(loop);
  }
  function idleAnim(dt){ legPh+=dt*4; blinkT-=dt; if(blinkT<0)blinkT=2+Math.random()*2; }
  function update(dt){
    const c=CONF[diff];
    speed=Math.min(c.max,speed+dt*(6+speed*0.004));
    dist+=speed*dt;
    const m=Math.floor(dist/50*dMult);
    if(m>scoreM){
      scoreM=m;
      if(m%100===0){ popups.push({txt:fa(m)+' متر!',t:1.4}); SFX.good(); confetti(30); }
    }
    legPh+=dt*(6+speed/90);
    blinkT-=dt; if(blinkT<0)blinkT=2+Math.random()*3;
    // فیزیک پرش
    if(y<groundY||vy!==0){ y+=vy*dt; vy+=GRAV*dt;
      if(y>=groundY){ y=groundY;vy=0;
        for(let i=0;i<8;i++) parts.push({x:56,y:groundY+4,vx:-40-Math.random()*100,vy:-Math.random()*140,r:2+Math.random()*3,a:1,c:'#a89f91'});
      }
    }
    if(duckT>0)duckT-=dt;
    const ducking=duck||duckT>0;
    // گرد و خاک دویدن
    if(Math.random()<dt*8&&y>=groundY) parts.push({x:44,y:groundY+3,vx:-speed*0.4,vy:-30-Math.random()*40,r:1.5+Math.random()*2,a:0.7,c:'#b8b0a0'});
    // ابرها
    clouds.forEach(cl=>{ cl.x-=(20+speed*0.12)*dt; if(cl.x<-90){cl.x=W+90;cl.y=15+Math.random()*80;} });
    // موانع
    nextGap-=speed*dt;
    if(nextGap<=0) spawn();
    const dw=ducking?46:30, dh=ducking?22:36, dx=52, dy=y-dh;
    for(const o of obstacles){
      o.x-=speed*dt;
      if(o.t==='bird'){ o.ph+=dt*10; o.y+=Math.sin(o.ph*0.7)*8*dt; }
      // برخورد (با حاشیه امن)
      const pad=7;
      if(dx+pad<o.x+o.w-pad&&dx+dw-pad>o.x+pad&&dy+pad<o.y+o.h-pad&&dy+dh-pad>o.y+pad){ gameOver(); return; }
    }
    obstacles=obstacles.filter(o=>o.x+o.w>-20);
    // ذرات و پاپ‌آپ
    parts.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=500*dt;p.a-=dt*1.6;});
    parts=parts.filter(p=>p.a>0);
    popups.forEach(p=>p.t-=dt); popups=popups.filter(p=>p.t>0);
    // HUD
    const key=m+'|'+Math.round(speed/46);
    if(key!==lastHUD){ lastHUD=key;
      const s=$('#d-score'); if(s)s.textContent=fa(m);
      const v=$('#d-speed'); if(v)v.textContent=fa(Math.round(speed/46));
    }
  }

  // --- رندر صحنه ---
  function lerp(a,b,t){return a+(b-a)*t;}
  function mix(c1,c2,t){return [lerp(c1[0],c2[0],t)|0,lerp(c1[1],c2[1],t)|0,lerp(c1[2],c2[2],t)|0];}
  function rgb(c){return `rgb(${c[0]},${c[1]},${c[2]})`;}
  function sky(p){ // p: 0..1 چرخه روز
    const DAY=[[125,211,252],[224,242,254]], SUN=[[109,40,217],[251,146,60]], NIGHT=[[15,10,46],[46,16,101]];
    if(p<0.38) return {top:DAY[0],bot:DAY[1],star:0,sun:1,moon:0};
    if(p<0.5){const t=(p-0.38)/0.12;return{top:mix(DAY[0],SUN[0],t),bot:mix(DAY[1],SUN[1],t),star:0,sun:1-t*0.5,moon:0};}
    if(p<0.62){const t=(p-0.5)/0.12;return{top:mix(SUN[0],NIGHT[0],t),bot:mix(SUN[1],NIGHT[1],t),star:t,sun:0,moon:t};}
    if(p<0.85) return {top:NIGHT[0],bot:NIGHT[1],star:1,sun:0,moon:1};
    const t=(p-0.85)/0.15;return{top:mix(NIGHT[0],DAY[0],t),bot:mix(NIGHT[1],DAY[1],t),star:1-t,sun:t,moon:1-t};
  }
  function renderScene(dt){
    const p=((dist/60)%160)/160, s=sky(p);
    const g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,rgb(s.top)); g.addColorStop(1,rgb(s.bot));
    ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    // ستاره‌ها
    if(s.star>0.05){ ctx.fillStyle=`rgba(255,255,255,${0.9*s.star})`;
      stars.forEach(st=>{ const x=((st.x-dist*0.02)%(W+40)+(W+40))%(W+40)-20; ctx.fillRect(x,st.y,st.s,st.s); });
    }
    // خورشید/ماه
    if(s.sun>0.05){ ctx.globalAlpha=s.sun; ctx.fillStyle='#fde047';
      ctx.beginPath();ctx.arc(W-60,52,22,0,7);ctx.fill();
      ctx.globalAlpha=s.sun*0.35;ctx.beginPath();ctx.arc(W-60,52,32,0,7);ctx.fill();ctx.globalAlpha=1;
    }
    if(s.moon>0.05){ ctx.globalAlpha=s.moon; ctx.fillStyle='#f1f5f9';
      ctx.beginPath();ctx.arc(W-60,52,18,0,7);ctx.fill();
      ctx.fillStyle=rgb(s.top);ctx.beginPath();ctx.arc(W-54,47,15,0,7);ctx.fill();ctx.globalAlpha=1;
    }
    const night=s.star>0.4;
    // کوه‌های دور
    ctx.fillStyle=night?'#1e1b4b':'#a5b4fc';
    drawHills(dist*0.15,groundY,70,120);
    ctx.fillStyle=night?'#312e81':'#818cf8';
    drawHills(dist*0.35+300,groundY,46,80);
    // ابرها
    ctx.fillStyle=night?'rgba(255,255,255,.25)':'rgba(255,255,255,.9)';
    clouds.forEach(c=>{ ctx.beginPath();
      ctx.arc(c.x,c.y,12*c.s,0,7);ctx.arc(c.x+13*c.s,c.y+3*c.s,9*c.s,0,7);ctx.arc(c.x-13*c.s,c.y+4*c.s,8*c.s,0,7);ctx.fill(); });
    // زمین
    ctx.fillStyle=night?'#292524':'#e7d8b7'; ctx.fillRect(0,groundY,W,H-groundY);
    ctx.fillStyle=night?'#57534e':'#b8a888'; ctx.fillRect(0,groundY,W,3);
    ctx.fillStyle=night?'#44403c':'#a89f91';
    const off=dist%90;
    for(let x=-off;x<W;x+=90){ ctx.fillRect(x,groundY+12,26,3); ctx.fillRect(x+44,groundY+24,18,3); }
    // موانع
    obstacles.forEach(o=>{
      if(o.t.startsWith('c')) drawCactus(o);
      else drawBird(o);
    });
    // ذرات
    parts.forEach(pt=>{ ctx.globalAlpha=Math.max(0,pt.a); ctx.fillStyle=pt.c;
      ctx.beginPath();ctx.arc(pt.x,pt.y,pt.r,0,7);ctx.fill(); });
    ctx.globalAlpha=1;
    drawDino();
    // پاپ‌آپ
    popups.forEach(pp=>{
      ctx.globalAlpha=Math.min(1,pp.t);
      ctx.font='900 22px Vazirmatn,Tahoma';ctx.textAlign='center';
      ctx.fillStyle='#fbbf24';ctx.strokeStyle='rgba(0,0,0,.5)';ctx.lineWidth=4;
      ctx.strokeText(pp.txt,W/2,70);ctx.fillText(pp.txt,W/2,70);ctx.globalAlpha=1;
    });
  }
  function drawHills(off,base,h,per){
    ctx.beginPath();ctx.moveTo(0,base);
    const o=off%per;
    for(let x=-o-per;x<W+per;x+=per){ ctx.lineTo(x+per/2,base-h-((x/per|0)%2)*14);ctx.lineTo(x+per,base); }
    ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
  }
  function drawCactus(o){
    ctx.fillStyle='#15803d';
    const cx=o.x+o.w/2;
    if(o.t==='c3'){
      [[o.x,42],[o.x+20,58],[o.x+42,38]].forEach(([x,h])=>{
        ctx.fillStyle='#16a34a';rr(x,groundY-h,16,h,7);ctx.fill();
        ctx.fillStyle='#15803d';rr(x+3,groundY-h+8,4,14,2);ctx.fill();
      });
      return;
    }
    rr(o.x,groundY-o.h,o.w,o.h,9);ctx.fill();
    ctx.fillStyle='#16a34a';
    rr(o.x-9,groundY-o.h+14,9,20,4);ctx.fill();
    rr(o.x+o.w,groundY-o.h+22,9,16,4);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.25)';
    rr(o.x+4,groundY-o.h+6,4,o.h-12,2);ctx.fill();
  }
  function drawBird(o){
    const w=Math.sin(o.ph)*10;
    ctx.fillStyle='#44403c';
    ctx.beginPath();ctx.ellipse(o.x+o.w/2,o.y+o.h/2,o.w/2,o.h/3,0,0,7);ctx.fill();
    ctx.beginPath();ctx.arc(o.x+o.w-6,o.y+4,7,0,7);ctx.fill();
    ctx.fillStyle='#fbbf24';
    ctx.beginPath();ctx.moveTo(o.x+o.w+1,o.y+2);ctx.lineTo(o.x+o.w+9,o.y+5);ctx.lineTo(o.x+o.w+1,o.y+8);ctx.fill();
    ctx.fillStyle='#292524';
    ctx.beginPath();ctx.moveTo(o.x+8,o.y+10);ctx.lineTo(o.x+20,o.y+2-w);ctx.lineTo(o.x+26,o.y+12);ctx.fill();
    ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(o.x+o.w-7,o.y+2,2,0,7);ctx.fill();
    ctx.fillStyle='#000';ctx.beginPath();ctx.arc(o.x+o.w-7,o.y+2,1,0,7);ctx.fill();
  }
  function rr(x,y,w,h,r){ ctx.beginPath();ctx.roundRect(x,y,w,h,r); }
  function drawDino(){
    const ducking=(duck||duckT>0)&&y>=groundY;
    const x=52, body=dead?'#78716c':'#22c55e', dark=dead?'#57534e':'#15803d';
    const run=Math.sin(legPh)*6;
    ctx.lineWidth=2;
    if(ducking){
      // حالت خمیده
      ctx.fillStyle=body; rr(x-8,y-24,52,22,11); ctx.fill();
      ctx.fillStyle=body; rr(x+34,y-34,22,24,8); ctx.fill(); // سر جلو
      // دم
      ctx.fillStyle=body; ctx.beginPath();ctx.moveTo(x-8,y-20);ctx.lineTo(x-24,y-8);ctx.lineTo(x-8,y-6);ctx.fill();
      // پاها
      ctx.strokeStyle=dark;ctx.lineWidth=6;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(x+8,y-4);ctx.lineTo(x+8+run*0.5,y+1);ctx.moveTo(x+26,y-4);ctx.lineTo(x+26-run*0.5,y+1);ctx.stroke();
      // چشم
      if(dead){ ctx.strokeStyle='#1c1917';ctx.lineWidth=2;
        ctx.beginPath();ctx.moveTo(x+42,y-28);ctx.lineTo(x+48,y-22);ctx.moveTo(x+48,y-28);ctx.lineTo(x+42,y-22);ctx.stroke();
      } else if(blinkT<0.12){ ctx.strokeStyle=dark;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+42,y-25);ctx.lineTo(x+48,y-25);ctx.stroke(); }
      else { ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x+45,y-26,3.4,0,7);ctx.fill();ctx.fillStyle='#1c1917';ctx.beginPath();ctx.arc(x+46,y-26,1.6,0,7);ctx.fill(); }
    } else {
      // ایستاده
      ctx.fillStyle=body;
      ctx.beginPath();ctx.moveTo(x-6,y-34);ctx.lineTo(x-20,y-10);ctx.lineTo(x-4,y-8);ctx.fill(); // دم
      rr(x-8,y-36,30,30,10);ctx.fill(); // بدن
      ctx.fillStyle='#bbf7d0';rr(x-2,y-24,16,14,6);ctx.fill(); // شکم
      ctx.fillStyle=body;rr(x+2,y-58,26,26,9);ctx.fill(); // سر
      ctx.fillStyle=body;rr(x-2,y-52,10,20,4);ctx.fill(); // گردن
      // دست کوچولو
      ctx.strokeStyle=dark;ctx.lineWidth=4;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(x+20,y-26);ctx.lineTo(x+27,y-20);ctx.stroke();
      // پاها
      ctx.lineWidth=7;
      ctx.beginPath();ctx.moveTo(x+2,y-8);ctx.lineTo(x+2+run,y);ctx.moveTo(x+16,y-8);ctx.lineTo(x+16-run,y);ctx.stroke();
      // چشم و دهن
      if(dead){ ctx.strokeStyle='#1c1917';ctx.lineWidth=2.5;
        ctx.beginPath();ctx.moveTo(x+14,y-50);ctx.lineTo(x+20,y-44);ctx.moveTo(x+20,y-50);ctx.lineTo(x+14,y-44);ctx.stroke();
      } else if(blinkT<0.12){ ctx.strokeStyle=dark;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+14,y-47);ctx.lineTo(x+20,y-47);ctx.stroke(); }
      else { ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x+17,y-47,3.6,0,7);ctx.fill();ctx.fillStyle='#1c1917';ctx.beginPath();ctx.arc(x+18,y-47,1.7,0,7);ctx.fill(); }
      if(!dead){ ctx.strokeStyle=dark;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x+16,y-38,5,0.3,Math.PI-0.6);ctx.stroke(); }
    }
  }
  function stop(){
    over=true; try{cancelAnimationFrame(raf);}catch(e){}
    try{window.removeEventListener('resize',sizeCanvas);}catch(e){}
    try{window.removeEventListener('keydown',onKeyD);}catch(e){}
    try{window.removeEventListener('keyup',onKeyU);}catch(e){}
    try{document.removeEventListener('visibilitychange',onVis);}catch(e){}
  }
  return { render, stop };
})();
