/* ===== حدس پرچم ===== */
const FlagsGame = (()=>{
  // --- کمک‌های SVG ---
  function star5(cx,cy,r,rot,fill){
    let p='';
    for(let i=0;i<10;i++){
      const rr=i%2?r*0.42:r, a=(rot+i*36)*Math.PI/180;
      p+=`${(cx+rr*Math.cos(a)).toFixed(2)},${(cy+rr*Math.sin(a)).toFixed(2)} `;
    }
    return `<polygon points="${p}" fill="${fill}"/>`;
  }
  function trigram(cx,cy,rot,pats,fill){
    let bars='';
    pats.forEach((s,i)=>{
      const y=((i-1)*2.9-0.8).toFixed(1);
      if(s) bars+=`<rect x="-4" y="${y}" width="8" height="1.6" rx="0.5"/>`;
      else bars+=`<rect x="-4" y="${y}" width="3.4" height="1.6" rx="0.5"/><rect x="0.6" y="${y}" width="3.4" height="1.6" rx="0.5"/>`;
    });
    return `<g transform="translate(${cx} ${cy}) rotate(${rot})" fill="${fill}">${bars}</g>`;
  }
  const SW=inner=>`<svg viewBox="0 0 60 40">${inner}</svg>`;
  const h3=(a,b,c)=>SW(`<rect width="60" height="13.4" fill="${a}"/><rect y="13.3" width="60" height="13.4" fill="${b}"/><rect y="26.6" width="60" height="13.4" fill="${c}"/>`);
  const v3=(a,b,c)=>SW(`<rect width="20.1" height="40" fill="${a}"/><rect x="19.9" width="20.2" height="40" fill="${b}"/><rect x="39.9" width="20.1" height="40" fill="${c}"/>`);

  function usaSVG(){
    let s='';
    for(let i=0;i<13;i++) s+=`<rect y="${(i*40/13).toFixed(2)}" width="60" height="${(40/13+0.15).toFixed(2)}" fill="${i%2?'#ffffff':'#B22234'}"/>`;
    const cw=24, ch=40/13*7;
    s+=`<rect width="${cw}" height="${ch.toFixed(2)}" fill="#3C3B6E"/>`;
    for(let r=0;r<9;r++){
      const n=r%2?5:6, y=ch*(r+1)/10;
      for(let i=0;i<n;i++){
        const x=r%2?cw*(i+1)/6:cw*(i+0.5)/6;
        s+=star5(x,y,1.5,-90,'#fff');
      }
    }
    return SW(s);
  }
  function iranSVG(){
    let s=`<rect width="60" height="13.4" fill="#239F40"/><rect y="13.3" width="60" height="13.4" fill="#ffffff"/><rect y="26.6" width="60" height="13.4" fill="#DA0000"/>`;
    for(let i=0;i<11;i++){ const x=(3+i*5.4).toFixed(1);
      s+=`<rect x="${x}" y="12" width="2.4" height="1.7" fill="#fff" opacity=".92"/><rect x="${x}" y="26.3" width="2.4" height="1.7" fill="#fff" opacity=".92"/>`; }
    s+=`<g stroke="#DA0000" fill="none" stroke-linecap="round">
      <path d="M30 11.5 L31.6 19 L30 28.5 L28.4 19 Z" fill="#DA0000" stroke="none"/>
      <path d="M28 15 A7 7 0 0 0 28 25" stroke-width="1.6"/>
      <path d="M32 15 A7 7 0 0 1 32 25" stroke-width="1.6"/>
      <path d="M26.5 13.5 Q30 16.5 33.5 13.5" stroke-width="1.3"/>
      <path d="M26.5 26.5 Q30 23.5 33.5 26.5" stroke-width="1.3"/></g>`;
    return SW(s);
  }
  function chinaSVG(){
    let s=`<rect width="60" height="40" fill="#DE2910"/>`;
    s+=star5(10,10,6,-90,'#FFDE00');
    [[20,4],[24,8],[24,15],[20,19]].forEach(([x,y])=>{
      s+=star5(x,y,2,Math.atan2(10-y,10-x)*180/Math.PI,'#FFDE00');
    });
    return SW(s);
  }
  function indiaSVG(){
    let s=`<rect width="60" height="13.4" fill="#FF9933"/><rect y="13.3" width="60" height="13.4" fill="#ffffff"/><rect y="26.6" width="60" height="13.4" fill="#138808"/>`;
    s+=`<circle cx="30" cy="20" r="5" fill="none" stroke="#06038D" stroke-width="1"/>`;
    for(let i=0;i<24;i++){ const a=i*15*Math.PI/180;
      s+=`<line x1="30" y1="20" x2="${(30+5*Math.cos(a)).toFixed(2)}" y2="${(20+5*Math.sin(a)).toFixed(2)}" stroke="#06038D" stroke-width="0.3"/>`; }
    return SW(s+`<circle cx="30" cy="20" r="0.9" fill="#06038D"/>`);
  }
  function argentinaSVG(){
    let s=`<rect width="60" height="13.4" fill="#74ACDF"/><rect y="13.3" width="60" height="13.4" fill="#ffffff"/><rect y="26.6" width="60" height="13.4" fill="#74ACDF"/>`;
    for(let i=0;i<16;i++){ const a=i*22.5*Math.PI/180, r2=i%2?5.6:6.6;
      s+=`<line x1="${(30+4.2*Math.cos(a)).toFixed(2)}" y1="${(20+4.2*Math.sin(a)).toFixed(2)}" x2="${(30+r2*Math.cos(a)).toFixed(2)}" y2="${(20+r2*Math.sin(a)).toFixed(2)}" stroke="#F6B40E" stroke-width="0.7"/>`; }
    return SW(s+`<circle cx="30" cy="20" r="3.6" fill="#F6B40E" stroke="#d19406" stroke-width="0.5"/>`);
  }
  function koreaSVG(){
    let s=`<rect width="60" height="40" fill="#ffffff"/>`;
    s+=`<circle cx="30" cy="20" r="7" fill="#0047A0"/>`;
    s+=`<path d="M23 20 A7 7 0 0 1 37 20 A3.5 3.5 0 0 1 30 20 A3.5 3.5 0 0 0 23 20 Z" fill="#CD2E3A"/>`;
    s+=trigram(15,11,-45,[1,1,1],'#111')+trigram(45,11,45,[0,1,0],'#111')+trigram(15,29,45,[1,0,1],'#111')+trigram(45,29,-45,[0,0,0],'#111');
    return SW(s);
  }
  function greeceSVG(){
    let s='';
    for(let i=0;i<9;i++) s+=`<rect y="${(i*40/9).toFixed(2)}" width="60" height="${(40/9+0.15).toFixed(2)}" fill="${i%2?'#ffffff':'#0D5EAF'}"/>`;
    const cw=5*40/9, ch=5*40/9, t=40/9;
    s+=`<rect width="${cw.toFixed(2)}" height="${ch.toFixed(2)}" fill="#0D5EAF"/>`;
    s+=`<rect x="${(cw/2-t/2).toFixed(2)}" width="${t.toFixed(2)}" height="${ch.toFixed(2)}" fill="#fff"/>`;
    s+=`<rect y="${(ch/2-t/2).toFixed(2)}" width="${cw.toFixed(2)}" height="${t.toFixed(2)}" fill="#fff"/>`;
    return SW(s);
  }

  const FLAGS=[
    {id:'ir',fa:'ایران',en:['iran','ir'],easy:true,svg:iranSVG},
    {id:'us',fa:'آمریکا',en:['usa','us','america','unitedstates'],easy:true,svg:usaSVG},
    {id:'fr',fa:'فرانسه',en:['france','fr'],easy:true,svg:()=>v3('#0055A4','#ffffff','#EF4135')},
    {id:'jp',fa:'ژاپن',en:['japan','jp'],easy:true,svg:()=>SW('<rect width="60" height="40" fill="#ffffff"/><circle cx="30" cy="20" r="12" fill="#BC002D"/>')},
    {id:'de',fa:'آلمان',en:['germany','de','deutschland'],easy:true,svg:()=>h3('#000000','#DD0000','#FFCE00')},
    {id:'uk',fa:'بریتانیا',en:['britain','uk','england','greatbritain','انگلیس'],easy:true,svg:()=>SW('<rect width="60" height="40" fill="#012169"/><path d="M0 0L60 40M60 0L0 40" stroke="#ffffff" stroke-width="8"/><path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" stroke-width="2.6"/><rect x="25" width="10" height="40" fill="#fff"/><rect y="15" width="60" height="10" fill="#fff"/><rect x="27" width="6" height="40" fill="#C8102E"/><rect y="17" width="60" height="6" fill="#C8102E"/>')},
    {id:'it',fa:'ایتالیا',en:['italy','it'],svg:()=>v3('#009246','#ffffff','#CE2B37')},
    {id:'tr',fa:'ترکیه',en:['turkey','tr','turkiye'],svg:()=>SW('<rect width="60" height="40" fill="#E30A17"/><circle cx="20" cy="20" r="10" fill="#fff"/><circle cx="21.6" cy="20" r="8" fill="#E30A17"/>'+star5(27.5,20,3.4,-90,'#fff'))},
    {id:'ru',fa:'روسیه',en:['russia','ru'],svg:()=>h3('#ffffff','#0039A6','#D52B1E')},
    {id:'es',fa:'اسپانیا',en:['spain','es'],svg:()=>SW('<rect width="60" height="10" fill="#AA151B"/><rect y="10" width="60" height="20" fill="#F1BF00"/><rect y="30" width="60" height="10" fill="#AA151B"/>')},
    {id:'cn',fa:'چین',en:['china','cn'],svg:chinaSVG},
    {id:'in',fa:'هند',en:['india','in','هندوستان'],svg:indiaSVG},
    {id:'ua',fa:'اوکراین',en:['ukraine','ua'],svg:()=>SW('<rect width="60" height="20" fill="#005BBB"/><rect y="20" width="60" height="20" fill="#FFD500"/>')},
    {id:'ar',fa:'آرژانتین',en:['argentina','ar'],svg:argentinaSVG},
    {id:'kr',fa:'کره جنوبی',en:['korea','southkorea'],svg:koreaSVG},
    {id:'nl',fa:'هلند',en:['netherlands','holland','dutch'],svg:()=>h3('#AE1C28','#ffffff','#21468B')},
    {id:'gr',fa:'یونان',en:['greece','gr'],svg:greeceSVG},
    {id:'se',fa:'سوئد',en:['sweden','se'],svg:()=>SW('<rect width="60" height="40" fill="#006AA7"/><rect x="18.75" width="7.5" height="40" fill="#FECC00"/><rect y="16.25" width="60" height="7.5" fill="#FECC00"/>')},
  ];
  FLAGS.forEach(f=>{ if(f.easy===undefined) f.easy=false; });

  const CONF={easy:{time:30},medium:{time:22},hard:{time:15}};
  let diff,over,busy,streak,best,cur,easyQ,hardQ,asked,rev,timer,tLeft,tTotal;

  const norm=s=>(s||'').toString().toLowerCase()
    .replace(/[ي]/g,'ی').replace(/[ك]/g,'ک').replace(/آ/g,'ا')
    .replace(/ة/g,'ه').replace(/ؤ/g,'و').replace(/ئ]/g,'ی')
    .replace(/[\s\u200c\-_.'ʼ"«»]/g,'');
  function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];} return a; }

  function render(d){
    diff=d; stop();
    over=false;busy=false;streak=0;asked=0;rev=[];
    best=store.get('best_flags',0);
    easyQ=shuffle(FLAGS.filter(f=>f.easy)); hardQ=shuffle(FLAGS.filter(f=>!f.easy));
    const box=$('#game-container');
    box.innerHTML=`<div class="panel">
      <div class="flag-head"><b>🚩 حدس پرچم</b>
        <div class="flag-stats"><span>🔥 <b id="f-streak">۰</b></span><span>🏆 <b id="f-best">${fa(best)}</b></span><span>🪙 <b id="f-coins">${fa(getCoins())}</b></span></div>
      </div>
      <div class="flag-timer"><div class="ftrack"><i id="f-tbar"></i></div><b id="f-tnum"></b></div>
      <div class="flag-frame" id="f-flag" data-fid=""></div>
      <div class="flag-blanks" id="f-blanks"></div>
      <div class="flag-row">
        <input id="f-in" class="flag-in" placeholder="اسم کشور... (فارسی یا English)" maxlength="24" enterkeyhint="go" autocomplete="off">
        <button class="btn btn-primary" id="f-ok">${icon('check',16)}</button>
        <button class="flag-hint" id="f-hint" title="راهنمایی حرف">${icon('bulb',18)}<small id="f-cost">۵۰</small></button>
      </div>
      <div class="t-hint">دو پرچم اول آسونه، بعدش سخت می‌شه! 😈 اشتباه = باخت!</div>
      <div class="row-btns"><button class="btn btn-gold" id="f-new">${icon('refresh',16)} از اول</button></div>
    </div>`;
    $('#f-ok').onclick=submit;
    $('#f-in').addEventListener('keydown',e=>{ if(e.key==='Enter') submit(); });
    $('#f-hint').onclick=hint;
    $('#f-new').onclick=()=>{haptic();render(diff);};
    nextQ();
  }
  function pick(){
    let pool;
    if(asked<2){ if(!easyQ.length) easyQ=shuffle(FLAGS.filter(f=>f.easy)); pool=easyQ; }
    else { if(!hardQ.length) hardQ=shuffle(FLAGS.filter(f=>!f.easy)); pool=hardQ; }
    return pool.pop();
  }
  function nextQ(){
    if(over) return;
    cur=pick(); rev=cur.fa.split('').map(ch=>ch===' ');
    busy=false;
    const fl=$('#f-flag'); fl.dataset.fid=cur.id;
    fl.innerHTML=(typeof cur.svg==='function'?cur.svg():cur.svg);
    fl.classList.remove('good','bad','deal'); void fl.offsetWidth; fl.classList.add('deal');
    setTimeout(()=>fl.classList&&fl.classList.remove('deal'),450);
    drawBlanks(); updHint();
    const inp=$('#f-in'); inp.value=''; inp.classList.remove('good');
    startTimer();
  }
  function drawBlanks(){
    const b=$('#f-blanks'); if(!b) return;
    b.innerHTML=cur.fa.split('').map((ch,i)=>{
      if(ch===' ') return '<span class="gap"></span>';
      return rev[i]?`<span>${ch}</span>`:'<span class="hide">؟</span>';
    }).join('');
  }
  function nRev(){ return cur.fa.split('').filter((ch,i)=>ch!==' '&&rev[i]).length; }
  function updHint(){
    const h=$('#f-hint'),c=$('#f-cost'); if(!h) return;
    const n=nRev();
    if(n>=3){ h.classList.add('off'); c.textContent='✕'; }
    else { h.classList.remove('off'); c.textContent=fa((n+1)*50); }
  }
  function updCoins(){ const e=$('#f-coins'); if(e) e.textContent=fa(getCoins()); }
  function submit(){
    if(over||busy) return;
    const inp=$('#f-in'), a=norm(inp.value);
    if(!a){ toast('یه چیزی بنویس! ✍️'); inp.focus(); return; }
    busy=true; stopTimer();
    const ok=(norm(cur.fa)===a)||cur.en.includes(a);
    if(ok){
      streak++; asked++;
      $('#f-streak').textContent=fa(streak);
      inp.classList.add('good'); $('#f-flag').classList.add('good');
      beep(600,.08,'triangle'); setTimeout(()=>beep(880,.1,'triangle'),90);
      haptic('light'); confetti(25);
      if(streak%5===0){ addCoins(30,'کمبو پرچم 🔥'); updCoins(); }
      if(streak>best){ best=streak; store.set('best_flags',best); store.set('best_flags_t',fa(best)+' پرچم'); $('#f-best').textContent=fa(best); }
      setTimeout(()=>{ if(!over) nextQ(); },700);
    } else lose(false);
  }
  function hint(){
    if(over||busy) return;
    if(nRev()>=3){ toast('دیگه حرفی برای راهنمایی نیست!'); return; }
    const cost=(nRev()+1)*50;
    if(getCoins()<cost){ toast('سکه کافی نداری! 🪙'); SFX.bad(); return; }
    spendCoins(cost); updCoins();
    const letters=cur.fa.split('').map((ch,i)=>({ch,i})).filter(o=>o.ch!==' ');
    rev[letters[nRev()].i]=true;
    drawBlanks(); updHint(); SFX.good(); haptic('light');
    toast(`حرف ${fa(nRev())} باز شد! (${fa(cost)} سکه) 💡`);
  }
  function startTimer(){
    stopTimer();
    tTotal=(CONF[diff]||CONF.medium).time; tLeft=tTotal; updT();
    timer=setInterval(()=>{
      tLeft-=0.1;
      if(tLeft<=0){ tLeft=0; updT(); stopTimer(); if(!over&&!busy){ busy=true; lose(true); } }
      else updT();
    },100);
  }
  function updT(){
    const b=$('#f-tbar'),n=$('#f-tnum'); if(!b) return;
    b.style.width=(tLeft/tTotal*100)+'%';
    b.classList.toggle('low',tLeft<=5);
    if(n) n.textContent=fa(Math.ceil(tLeft));
  }
  function stopTimer(){ if(timer){clearInterval(timer);timer=null;} }
  function lose(timeout){
    over=true; stopTimer();
    const fl=$('#f-flag'); if(fl) fl.classList.add('bad');
    const won=streak>=5;
    bumpStat(won);
    logHistory('flags',won?'win':'lose',`${fa(streak)} پرچم`);
    const reward=Math.min(150,10+streak*8);
    addCoins(reward,'حدس پرچم');
    showEnd(false,timeout?'وقت تموم شد! ⏱️':'باختی! 😢',
      `جواب درست: <b>${cur.fa}</b> (${cur.en[0]})<br>رکورد این دست: <b>${fa(streak)} پرچم</b> 🔥<br>🪙 <b>${fa(reward)} سکه</b> گرفتی!`,
      ()=>render(diff));
  }
  function stop(){ over=true; stopTimer(); }
  function addFlags(arr){ if(Array.isArray(arr)) arr.forEach(f=>{ if(f&&f.id&&!FLAGS.some(x=>x.id===f.id)) FLAGS.push(f); }); }
  return { render, stop, addFlags };
})();
