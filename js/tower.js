/* ===== تاور استک ===== */
const TowerGame = (()=>{
  const CONF={easy:{sp:150,w:150},medium:{sp:200,w:130},hard:{sp:260,w:110}};
  const BH=26,PERFECT=7;
  const SKY=[[0,'#160b2e','#4b2a7d',1],[8,'#3b1f5e','#c65b7c',.45],[14,'#2f6bd8','#aee7ff',.12],[24,'#5b2a86','#ff7b54',.35],[34,'#0a1030','#3f6fd8',.65],[46,'#030110','#241257',1]];
  const BCOL=['#22d3ee','#a78bfa','#f472b6','#fbbf24','#34d399','#fb7185','#60a5fa'];
  function hx(c){return [parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)];}
  function mix(a,b,t){const A=hx(a),B=hx(b);return `rgb(${A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')})`;}
  function skyAt(s){
    let i=0;while(i<SKY.length-2&&s>=SKY[i+1][0])i++;
    const A=SKY[i],B=SKY[i+1],t=Math.max(0,Math.min(1,(s-A[0])/(B[0]-A[0])));
    return {top:mix(A[1],B[1],t),bot:mix(A[2],B[2],t),night:A[3]+(B[3]-A[3])*t};
  }
  function shade(c,p){let v;if(c[0]==='#')v=hx(c);else{const m=c.match(/[\d.]+/g);v=[+m[0],+m[1],+m[2]];}v=v.map(x=>Math.max(0,Math.min(255,Math.round(x+p))));return `rgb(${v.join(',')})`;}
  let diff,sp0,W0,blocks,cur,dir,speed,pos,cy,cyT,score,best,combo,over,raf,lastT,cv,ctx,W,H,msgT;
  let stars,clouds,parts,fallP,shakeT,popTxt,started,meteorT,meteor;
  function render(d){
    diff=d; stop(); over=false;
    const c=CONF[d]||CONF.medium; sp0=c.sp; W0=c.w;
    score=0;combo=0;started=false;shakeT=0;meteorT=6;meteor=null;cy=0;cyT=0;
    stars=Array.from({length:80},()=>({x:Math.random(),y:Math.random()*.75,r:.5+Math.random()*1.4,ph:Math.random()*6.28,sp:.5+Math.random()*2}));
    clouds=Array.from({length:5},(_,i)=>({x:Math.random(),y:.08+Math.random()*.4,s:.5+Math.random()*.9,v:.004+Math.random()*.008}));
    parts=[];fallP=null;popTxt=null;
    best=store.get('best_tower',0);
    blocks=[{x:0,w:W0,y:0,perf:false}];
    const box=$('#game-container');
    box.innerHTML=`<div class="panel">
      <div class="tw-hud">
        <div><small>رکورد</small><b id="tw-best">${fa(best)}</b></div>
        <div class="tw-score"><small>طبقه</small><b id="tw-score">۰</b></div>
        <div><small>کمبو</small><b id="tw-combo">×۰</b></div>
      </div>
      <div class="tw-wrap"><canvas id="tw-cv"></canvas><div id="tw-pop"></div><div class="tw-hint" id="tw-hint">👆 بزن تا بلوک بیفته!</div></div>
      <div class="row-btns"><button class="btn btn-gold" id="tw-re">🔁 از اول</button></div>
    </div>`;
    cv=$('#tw-cv'); ctx=cv.getContext('2d');
    sizeCv();
    newBlock();
    window.addEventListener('resize',sizeCv);
    cv.addEventListener('pointerdown',drop);
    document.addEventListener('keydown',keyH);
    $('#tw-re').onclick=()=>{haptic();render(diff);};
    lastT=performance.now();
    raf=requestAnimationFrame(loop);
  }
  function sizeCv(){
    const wrap=cv.parentElement;
    W=wrap.clientWidth; H=Math.round(W*1.25);
    const dpr=Math.min(2,window.devicePixelRatio||1);
    cv.width=W*dpr; cv.height=H*dpr; cv.style.height=H+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function keyH(e){ if(e.code==='Space'||e.key===' '){ e.preventDefault(); drop(); } }
  function baseY(){ return H-30; }
  function newBlock(){
    const prev=blocks[blocks.length-1];
    const fromLeft=Math.random()<.5;
    dir=fromLeft?1:-1;
    const mm=W/2+prev.w/2+40;
    pos=fromLeft?-mm:mm;
    speed=sp0+score*7;
    cur={w:prev.w,y:prev.y+BH};
  }
  function drop(){
    if(over||!cur) return;
    if(!started){started=true; const h=$('#tw-hint'); if(h)h.style.display='none';}
    const prev=blocks[blocks.length-1];
    const px=prev.x, cx=pos;
    const overlap=Math.min(px+prev.w/2,cx+cur.w/2)-Math.max(px-prev.w/2,cx-cur.w/2);
    if(overlap<=0){
      fallP={x:cx,w:cur.w,y:cur.y,vy:0,rot:0,vr:(Math.random()<.5?-1:1)*3,col:BCOL[score%BCOL.length]};
      cur=null; SFX.bad(); haptic('heavy');
      setTimeout(()=>{ if(!over) endGame(false); },700);
      return;
    }
    const off=cx-px;
    if(Math.abs(off)<PERFECT){
      combo++;
      blocks.push({x:px,w:prev.w,y:cur.y,perf:true});
      pop(score%5===4?'🔥 کمبو '+fa(combo)+'!':'✨ عالی!',true);
      burst(px,cur.y,'#fbbf24',14,true);
      SFX.good(); haptic('medium');
    } else {
      combo=0;
      const nx=(Math.max(px-prev.w/2,cx-cur.w/2)+Math.min(px+prev.w/2,cx+cur.w/2))/2;
      const cutL=cx<px;
      const cutW=cur.w-overlap;
      const cutX=cutL?cx-cur.w/2+cutW/2:cx+cur.w/2-cutW/2;
      fallP={x:cutX,w:cutW,y:cur.y,vy:0,rot:0,vr:(cutL?-1:1)*4,col:BCOL[score%BCOL.length]};
      blocks.push({x:nx,w:overlap,y:cur.y,perf:false});
      burst(nx,cur.y,'#ffffff',7,false);
      shakeT=.14; beep(300+score*12,.06,'square'); haptic('light');
    }
    score++;
    updHud();
    cyT=Math.max(0,(blocks.length-1)*BH-(H-160));
    newBlock();
  }
  function burst(x,y,col,n,rise){
    const bx=W/2+x;
    for(let i=0;i<n;i++) parts.push({x:bx+(Math.random()-.5)*30,y:baseY()-y-cy,vx:(Math.random()-.5)*(rise?60:130),vy:rise?-60-Math.random()*90:-20-Math.random()*60,life:.5+Math.random()*.4,t:0,col,r:1.5+Math.random()*2.5});
  }
  function pop(txt,good){
    const el=$('#tw-pop'); if(!el) return;
    const s=document.createElement('div');
    s.className='tw-pop-i'+(good?' good':''); s.textContent=txt;
    el.appendChild(s); setTimeout(()=>s.remove(),1000);
  }
  function updHud(){
    const s=$('#tw-score'); if(s)s.textContent=fa(score);
    const cb=$('#tw-combo'); if(cb)cb.textContent='×'+fa(combo);
  }
  function rr(x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);
    ctx.closePath();
  }
  function block(x,y,w,perf,col){
    if(!isFinite(x)||!isFinite(y)||!isFinite(w)||!isFinite(H)||!isFinite(W))return;
    const bx=W/2+x-w/2, by=baseY()-y-BH;
    ctx.save();
    ctx.shadowColor=perf?'rgba(251,191,36,.9)':'rgba(0,0,0,.35)';
    ctx.shadowBlur=perf?18:8; ctx.shadowOffsetY=3;
    const g=ctx.createLinearGradient(0,by,0,by+BH);
    g.addColorStop(0,shade(col,45));g.addColorStop(.35,col);g.addColorStop(1,shade(col,-45));
    rr(bx,by,w,BH,5); ctx.fillStyle=g; ctx.fill();
    ctx.shadowColor='transparent';
    rr(bx+2,by+2,w-4,6,3); ctx.fillStyle='rgba(255,255,255,.45)'; ctx.fill();
    rr(bx+2,by+BH-6,w-4,4,2); ctx.fillStyle='rgba(0,0,0,.25)'; ctx.fill();
    if(perf){ rr(bx-1,by-1,w+2,BH+2,6); ctx.strokeStyle='rgba(251,191,36,.9)'; ctx.lineWidth=1.5; ctx.stroke(); }
    ctx.restore();
  }
  function ridge(baseYp,amp,f,col){
    ctx.fillStyle=col; ctx.beginPath(); ctx.moveTo(0,H);
    for(let x=0;x<=W;x+=8) ctx.lineTo(x,baseYp+Math.sin(x*f+1.7)*amp+Math.sin(x*f*2.7)*amp*.4);
    ctx.lineTo(W,H); ctx.closePath(); ctx.fill();
  }
  function loop(t){
    if(over) return;
    const dt=Math.min(.05,(t-lastT)/1000); lastT=t;
    const tm=t/1000;
    if(shakeT>0)shakeT-=dt;
    if(cur){ pos+=dir*speed*dt; const m=W/2+cur.w/2+40; if(pos>m){pos=m;dir=-1;} if(pos<-m){pos=-m;dir=1;} }
    cy+=(cyT-cy)*Math.min(1,dt*4);
    if(fallP){ fallP.vy+=1400*dt; fallP.y-=fallP.vy*dt; fallP.rot+=fallP.vr*dt; if(baseY()-fallP.y-cy>H+80)fallP=null; }
    parts=parts.filter(p=>{ p.t+=dt; p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=160*dt; return p.t<p.life; });
    clouds.forEach(c=>{ c.x+=c.v*dt; if(c.x>1.3)c.x=-.3; });
    meteorT-=dt;
    if(meteorT<=0){ meteor={x:Math.random()*W*.7+W*.2,y:-20,vx:-260-Math.random()*160,vy:200+Math.random()*120,life:.8,t:0}; meteorT=5+Math.random()*7; }
    if(meteor){ meteor.t+=dt; meteor.x+=meteor.vx*dt; meteor.y+=meteor.vy*dt; if(meteor.t>meteor.life)meteor=null; }
    draw(tm);
    raf=requestAnimationFrame(loop);
  }
  function draw(tm){
    const sk=skyAt(score);
    ctx.save();
    if(shakeT>0)ctx.translate((Math.random()-.5)*5*shakeT*8,(Math.random()-.5)*4*shakeT*8);
    const g=ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,sk.top);g.addColorStop(.6,sk.bot);g.addColorStop(1,shade(sk.bot,-25));
    ctx.fillStyle=g; ctx.fillRect(-10,-10,W+20,H+20);
    stars.forEach(s=>{
      const a=sk.night*(.35+.65*Math.abs(Math.sin(tm*s.sp+s.ph)));
      ctx.globalAlpha=Math.max(0,Math.min(1,a));
      ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(s.x*W,(s.y*H-cy*.05%H+H)%H,s.r,0,7); ctx.fill();
    });
    ctx.globalAlpha=1;
    if(meteor&&sk.night>.3){
      ctx.save();ctx.globalAlpha=(1-meteor.t/meteor.life)*sk.night;
      const mg=ctx.createLinearGradient(meteor.x,meteor.y,meteor.x+70,meteor.y-50);
      mg.addColorStop(0,'rgba(255,255,255,.95)');mg.addColorStop(1,'rgba(255,255,255,0)');
      ctx.strokeStyle=mg;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(meteor.x,meteor.y);ctx.lineTo(meteor.x+70,meteor.y-50);ctx.stroke();ctx.restore();
    }
    // خورشید و ماه
    const cxm=W-56,cym=70;
    ctx.save();ctx.globalAlpha=1-sk.night;
    ctx.shadowColor='#fde68a';ctx.shadowBlur=30;ctx.fillStyle='#fde047';
    ctx.beginPath();ctx.arc(cxm,cym,22,0,7);ctx.fill();ctx.restore();
    ctx.save();ctx.globalAlpha=sk.night;
    ctx.shadowColor='#fef9c3';ctx.shadowBlur=26;ctx.fillStyle='#fef9c3';
    ctx.beginPath();ctx.arc(cxm,cym,20,0,7);ctx.fill();
    ctx.shadowBlur=0;ctx.fillStyle='rgba(180,170,150,.5)';
    ctx.beginPath();ctx.arc(cxm-6,cym-4,4,0,7);ctx.arc(cxm+5,cym+6,3,0,7);ctx.arc(cxm+7,cym-7,2.2,0,7);ctx.fill();ctx.restore();
    clouds.forEach(c=>{
      ctx.save();ctx.globalAlpha=.28+.3*(1-sk.night);
      ctx.fillStyle='#ffffff';
      const px=c.x*W,py=c.y*H-cy*.08;
      ctx.beginPath();
      ctx.ellipse(px,py,44*c.s,15*c.s,0,0,7);ctx.ellipse(px-28*c.s,py+5*c.s,26*c.s,11*c.s,0,0,7);ctx.ellipse(px+28*c.s,py+5*c.s,28*c.s,12*c.s,0,0,7);
      ctx.fill();ctx.restore();
    });
    ridge(H-46-cy*.12,14,.02,'rgba(30,20,60,.55)');
    ridge(H-24-cy*.2,10,.035,'rgba(20,12,40,.7)');
    const gy=baseY();
    ctx.fillStyle='rgba(0,0,0,.4)';
    ctx.fillRect(0,gy,W,H-gy);
    ctx.fillStyle='rgba(255,255,255,.14)';
    ctx.fillRect(0,gy,W,3);
    blocks.forEach((b,i)=>{ if(i===0&&false)return; block(b.x,b.y-cy,b.w,b.perf,i===0?'#8b7cf6':BCOL[(i-1)%BCOL.length]); });
    if(cur)block(pos,cur.y-cy,cur.w,false,BCOL[score%BCOL.length]);
    if(fallP){
      ctx.save();ctx.globalAlpha=Math.max(0,1-(fallP.y<0?-fallP.y/400:0));
      ctx.translate(W/2+fallP.x,baseY()-fallP.y-cy-BH/2);ctx.rotate(fallP.rot);
      ctx.fillStyle=fallP.col;rr(-fallP.w/2,-BH/2,fallP.w,BH,5);ctx.fill();
      ctx.restore();
    }
    parts.forEach(p=>{
      ctx.save();ctx.globalAlpha=1-p.t/p.life;ctx.fillStyle=p.col;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill();ctx.restore();
    });
    ctx.restore();
  }
  function endGame(won){
    over=true;
    if(score>best){best=score;store.set('best_tower',best);store.set('best_tower_t',fa(best)+' طبقه');}
    const realWon=score>=12;
    bumpStat(realWon);
    logHistory('tower',realWon?'win':'lose',`${fa(score)} طبقه`);
    const reward=realWon?Math.min(120,10+score*4):Math.min(30,score*2);
    if(reward>0)addCoins(reward,'تاور استک');
    showEnd(realWon,realWon?'🏗️ معمار افسانه‌ای!':'💥 برج فرو ریخت!',
      `${fa(score)} طبقه ساختی! (رکورد: ${fa(best)})<br>${realWon?'':'۱۲ طبقه برای برد لازمه! 💪<br>'}🪙 <b>${fa(reward)} سکه</b> گرفتی!`,
      ()=>render(diff));
  }
  function stop(){
    over=true;cur=null;
    if(raf)cancelAnimationFrame(raf);raf=null;
    if(msgT){clearTimeout(msgT);msgT=null;}
    window.removeEventListener('resize',sizeCv);
    document.removeEventListener('keydown',keyH);
  }
  return { render, stop };
})();
