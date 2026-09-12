/* ===== حاج عبدالله: گربه‌داری ایرانی ===== */
const AbdolahGame = (()=>{
  const LV=[{xp:0,n:'بچه گربه 🍼'},{xp:30,n:'گربه نوجوون 😼'},{xp:80,n:'گربه بالغ 😺'},{xp:150,n:'حاج عبدالله 📿'},{xp:250,n:'حاج عبدالله اعظم 👑'}];
  const SHOP=[
    {id:'apple',e:'🍎',n:'سیب',p:10,v:12,sec:'میوه‌ها 🍎'},
    {id:'banana',e:'🍌',n:'موز',p:12,v:14},
    {id:'grape',e:'🍇',n:'انگور',p:15,v:16},
    {id:'melon',e:'🍉',n:'هندوانه',p:20,v:22},
    {id:'milk',e:'🥛',n:'شیر',p:12,v:12,sec:'غذا و گوشت 🍗'},
    {id:'fish',e:'🐟',n:'ماهی',p:20,v:20},
    {id:'chicken',e:'🍗',n:'مرغ',p:28,v:28},
    {id:'meat',e:'🥩',n:'گوشت',p:35,v:35},
    {id:'kebab',e:'🍖',n:'کباب ویژه',p:50,v:50},
    {id:'sh',e:'🧴',n:'شامپو',p:25,sh:true,sec:'بهداشت 🧴'},
  ];
  const GIFTS=[{e:'🧸',n:'عروسک'},{e:'⚽',n:'توپ'},{e:'🧶',n:'کلاف'}];
  const FOAM_POS=[[30,32],[45,27],[60,32],[35,46],[55,46],[45,58],[30,58],[62,52]];
  const MSGS={
    hungry:['حاجی گشنمه! کباب بده! 🍖','شکمم داره قار و قور می‌کنه... 😿','یه لقمه نون هم راضیم... 🥖'],
    sleepy:['چشمام داره بسته می‌شه... 😴','یه چرت بزنم؟ 🥱'],
    dirty:['بو میدم! حمومم کن! 🛁','پشمام به هم ریخته! 😾'],
    bored:['حوصلم سر رفته... بازی! 🎮','بیا موش بگیریم! 🐭'],
    sleep:['خررر... پففف... 💤'],
    sick:['حالام خوب نیست... 🤒','دکتر! دارو می‌خوام! 💊','سرم گیج می‌ره... 😷'],
    love:['حاجی حالت خوبه؟ من که عالیم! 😻','میو میو! عاشقتم! ❤️'],
    idle:['میو.','کباب... 😋','بشین بغل حاجی.','امروز چه خبر؟ 📰','تسبیحمو دیدی؟ 📿','هوا خوبه، نه؟ 🌤️','یه سر به فروشگاه بزن! 🛍️']
  };
  let S,tick,giftIdx,sleepOn,busy,over,cd,lastKey,timers,washPhase,foamN,shopOpen;

  function load(){
    const now=Date.now();
    S=Object.assign({sat:70,fun:70,nrg:70,cln:70,hlth:85,xp:0,last:now,born:now},store.get('abdolah',{}));
    if(!S.inv){ S.inv={milk:2,chicken:1}; S.shampoo=1; }
    if(S.shampoo===undefined) S.shampoo=0;
    const mins=Math.min(480,(now-(S.last||now))/60000);
    S._away=false;
    if(mins>2){ const k=mins/5;
      S.sat=Math.max(5,S.sat-k*1); S.fun=Math.max(5,S.fun-k*1.2);
      S.nrg=Math.max(5,S.nrg-k*0.8); S.cln=Math.max(5,S.cln-k*0.6);
      S.hlth=Math.max(10,S.hlth-k*0.5);
      S._away=true;
    }
  }
  function save(){ S.last=Date.now(); const {_away,...rest}=S; store.set('abdolah',rest); }
  function lvl(){ let l=0; LV.forEach((L,i)=>{ if(S.xp>=L.xp) l=i; }); return l; }
  function stock(){ return SHOP.filter(i=>!i.sh).reduce((a,i)=>a+(S.inv[i.id]||0),0); }
  function ageStr(){
    const h=(Date.now()-S.born)/3600000;
    if(h<1) return 'نوزاد 🍼';
    if(h<24) return `${fa(Math.floor(h))} ساعته`;
    return `${fa(Math.floor(h/24))} روزه`;
  }

  function eyes(m){
    const L=82,Rr=118,Y=70;
    const shut=`<path d="M${L-8} ${Y} Q${L} ${Y+4} ${L+8} ${Y}" stroke="#3a2a1a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M${Rr-8} ${Y} Q${Rr} ${Y+4} ${Rr+8} ${Y}" stroke="#3a2a1a" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    if(m==='sleep'||m==='sleepy'||m==='sick') return shut+((m==='sick')?`<path d="M141 48 q7 9 0 14 q-7 -5 0 -14" fill="#7dd3fc"/>`:'');
    if(m==='love') return [L,Rr].map(x=>`<g transform="translate(${x} ${Y}) scale(1.3)"><path d="M0 3 C0 0 -3 -1.5 -4.5 0 C-6 1.5 -4.5 4 0 7 C4.5 4 6 1.5 4.5 0 C3 -1.5 0 0 0 3" fill="#ef4444"/></g>`).join('');
    const pr=m==='hungry'?3.6:2.8, py=m==='bored'?Y+3:Y+1;
    return [L,Rr].map(x=>`<g class="ab-eye"><ellipse cx="${x}" cy="${Y}" rx="8.5" ry="10" fill="#ffffff"/><circle cx="${x}" cy="${py}" r="6" fill="#2f9e44"/><circle cx="${x}" cy="${py}" r="4" fill="#1e7a34"/><circle cx="${x}" cy="${py}" r="${pr}" fill="#141414"/><circle cx="${x-2.2}" cy="${py-2.4}" r="1.5" fill="#ffffff"/><circle cx="${x+1.8}" cy="${py+2}" r="0.8" fill="#ffffff" opacity=".8"/></g>`).join('');
  }
  function mouth(m){
    const st='stroke="#3a2a1a" stroke-width="2.5" fill="none" stroke-linecap="round"';
    if(m==='sick') return `<path d="M92 96 Q100 93 108 96" ${st}/><g><line x1="112" y1="92" x2="126" y2="78" stroke="#94a3b8" stroke-width="4.5" stroke-linecap="round"/><circle cx="112" cy="92" r="3.5" fill="#ef4444"/><line x1="114" y1="90" x2="122" y2="82" stroke="#ef4444" stroke-width="2"/></g>`;
    if(m==='hungry') return `<ellipse cx="100" cy="94" rx="5" ry="6.5" fill="#7c2d12"/><ellipse cx="100" cy="96" rx="2.5" ry="3" fill="#e8738a"/>`;
    if(m==='sleep') return `<path d="M94 92 Q100 95 106 92" ${st}/>`;
    if(m==='dirty'||m==='bored'||m==='sleepy') return `<path d="M92 95 Q100 91 108 95" ${st}/>`;
    if(m==='love') return `<path d="M88 90 Q100 102 112 90" ${st}/>`;
    return `<path d="M100 91 Q100 97 93 98 M100 91 Q100 97 107 98" ${st}/>`;
  }
  function extras(l){
    let s='';
    if(l>=1) s+=`<rect x="70" y="103" width="60" height="10" rx="5" fill="#dc2626"/><rect x="70" y="103" width="60" height="4" rx="2" fill="#f87171" opacity=".7"/><circle cx="100" cy="114" r="4.5" fill="#fbbf24"/><circle cx="100" cy="114" r="1.5" fill="#92400e"/>`;
    if(l>=2) s+=`<path d="M100 93 C90 87 77 89 70 98 C79 101 92 100 100 95 C108 100 121 101 130 98 C123 89 110 87 100 93" fill="#4a3220"/>`;
    if(l>=3) s+=`<g stroke="#1f2937" stroke-width="2.5" fill="rgba(255,255,255,.15)"><circle cx="82" cy="70" r="11"/><circle cx="118" cy="70" r="11"/><path d="M93 70 H107" fill="none"/><path d="M71 68 L60 62 M129 68 L140 62" fill="none"/></g>`;
    if(l>=4){
      s+=`<g transform="rotate(-8 128 30)"><ellipse cx="128" cy="34" rx="20" ry="6" fill="#14532d"/><path d="M112 34 Q112 13 128 13 Q144 13 144 34" fill="#166534"/><path d="M112 34 Q112 13 128 13 Q144 13 144 34" fill="url(#abHat)" opacity=".5"/><circle cx="128" cy="13" r="3" fill="#fbbf24"/></g>`;
      let beads=''; for(let i=0;i<8;i++){ const a=i*45*Math.PI/180; beads+=`<circle cx="${(152+8*Math.cos(a)).toFixed(1)}" cy="${(160+8*Math.sin(a)).toFixed(1)}" r="2.6" fill="#92400e"/>`; }
      s+=`<circle cx="152" cy="160" r="8" fill="none" stroke="#b45309" stroke-width="1.2"/>${beads}<line x1="152" y1="168" x2="152" y2="176" stroke="#b45309" stroke-width="1.5"/>`;
    }
    return s;
  }
  function catSVG(m,l){
    return `<svg viewBox="0 0 200 195" class="ab-cat${m==='sick'?' sick':''}">
      <defs>
        <radialGradient id="abFur" cx="40%" cy="32%" r="80%"><stop offset="0" stop-color="#FBC87E"/><stop offset=".55" stop-color="#F6A04D"/><stop offset="1" stop-color="#DD8434"/></radialGradient>
        <radialGradient id="abBelly" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#FDE9C8"/><stop offset="1" stop-color="#F5C48A"/></radialGradient>
        <linearGradient id="abEar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F9A8A8"/><stop offset="1" stop-color="#E8738A"/></linearGradient>
        <linearGradient id="abHat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".4"/><stop offset=".5" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></linearGradient>
      </defs>
      <path class="ab-tail" d="M148 155 Q188 148 180 105" stroke="url(#abFur)" stroke-width="16" fill="none" stroke-linecap="round"/>
      <path d="M172 138 l12 -3 M176 124 l11 -4 M178 111 l10 -5" stroke="#C9762A" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="100" cy="148" rx="50" ry="40" fill="url(#abFur)"/>
      <ellipse cx="100" cy="158" rx="26" ry="26" fill="url(#abBelly)"/>
      <path d="M52 130 l14 -4 M50 145 l15 -2 M54 160 l13 1 M148 126 l-14 -4 M150 141 l-15 -2 M146 156 l-13 1" stroke="#C9762A" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="78" cy="182" rx="13" ry="8" fill="#E8933C"/><ellipse cx="122" cy="182" rx="13" ry="8" fill="#E8933C"/>
      <path d="M73 179 v5 M78 178 v6 M83 179 v5 M117 179 v5 M122 178 v6 M127 179 v5" stroke="#B96A28" stroke-width="1.6" stroke-linecap="round"/>
      <polygon points="64,48 58,8 96,30" fill="url(#abFur)"/><polygon points="136,48 142,8 104,30" fill="url(#abFur)"/>
      <polygon points="66,42 63,18 86,31" fill="url(#abEar)"/><polygon points="134,42 137,18 114,31" fill="url(#abEar)"/>
      <circle cx="100" cy="72" r="44" fill="url(#abFur)"/>
      <polygon points="58,80 48,86 58,88 50,96 60,94" fill="url(#abFur)"/><polygon points="142,80 152,86 142,88 150,96 140,94" fill="url(#abFur)"/>
      <path d="M88 32 l3 10 M100 30 l0 11 M112 32 l-3 10" stroke="#C9762A" stroke-width="4" stroke-linecap="round"/>
      ${eyes(m)}
      <ellipse cx="66" cy="86" rx="7" ry="4.5" fill="#F9A8A8" opacity=".8"/><ellipse cx="134" cy="86" rx="7" ry="4.5" fill="#F9A8A8" opacity=".8"/>
      <polygon points="95,88 105,88 100,94" fill="#E8738A"/><circle cx="98" cy="89.5" r="1.2" fill="#fff" opacity=".8"/>
      ${mouth(m)}
      <g stroke="#ffffff" stroke-width="1.6" opacity=".9"><path d="M58 84 L34 78 M58 90 L35 90 M59 96 L37 102"/><path d="M142 84 L166 78 M142 90 L165 90 M141 96 L163 102"/></g>
      ${extras(l)}
    </svg>`;
  }

  function render(d){
    stop();
    load();
    over=false;busy=false;sleepOn=false;giftIdx=0;cd={};timers=[];lastKey='';washPhase='idle';foamN=0;shopOpen=false;
    const box=$('#game-container');
    box.innerHTML=`<div class="panel">
      <div class="ab-title">حاج عبدالله</div>
      <div class="ab-sub">گربه‌داری ایرانی 😻 • <span id="ab-lvl"></span> • <span id="ab-age"></span></div>
      <div class="quiz-prog"><i id="ab-xp" style="width:0%"></i></div>
      <div class="ab-stage" id="ab-stage">
        <div class="ab-bubble" id="ab-bubble"></div>
        <div id="ab-cat"></div>
        <div class="ab-fx" id="ab-fx"></div>
        <div class="ab-bowl" id="ab-bowl">🍲<b id="ab-food"></b></div>
        <div class="ab-zzz" id="ab-zzz">💤<span>Z</span><span>Z</span><span>Z</span></div>
        <div class="ab-shower" id="ab-shower"></div>
      </div>
      <div class="ab-stats">
        <div class="ab-stat"><span>🍗</span><div class="ab-track"><i id="ab-sat"></i></div><b id="ab-sat-n"></b></div>
        <div class="ab-stat"><span>🎮</span><div class="ab-track"><i id="ab-fun"></i></div><b id="ab-fun-n"></b></div>
        <div class="ab-stat"><span>⚡</span><div class="ab-track"><i id="ab-nrg"></i></div><b id="ab-nrg-n"></b></div>
        <div class="ab-stat"><span>🛁</span><div class="ab-track"><i id="ab-cln"></i></div><b id="ab-cln-n"></b></div>
        <div class="ab-stat"><span>💊</span><div class="ab-track"><i id="ab-hlth"></i></div><b id="ab-hlth-n"></b></div>
      </div>
      <div class="ab-coins">🪙 <b id="ab-coins">${fa(getCoins())}</b> سکه</div>
      <div class="ab-btns">
        <button class="btn btn-primary" id="ab-feed">🍗 غذا</button>
        <button class="btn btn-gold" id="ab-play">🎮 بازی</button>
        <button class="btn btn-ghost" id="ab-sleep">😴 خواب</button>
        <button class="btn btn-ghost" id="ab-wash">🛁 حموم</button>
        <button class="btn btn-ghost" id="ab-med">💊 دارو</button>
        <button class="btn btn-ghost" id="ab-gift">🎁 کادو</button>
        <button class="btn btn-ghost" id="ab-shopbtn">🛍️ فروشگاه</button>
      </div>
      <div class="t-hint">روی حاجی بزن نازش کنی! ❤️</div>
      <div class="ab-shop" id="ab-shop" style="display:none"><div class="ab-shop-card">
        <div class="ab-shop-head"><b>🛍️ فروشگاه حاجی</b><span class="ab-shop-coins">🪙 <span id="ab-shop-coins"></span></span><button class="ab-shop-x" id="ab-shop-x">✕</button></div>
        <div id="ab-shop-list"></div>
      </div></div>
    </div>`;
    $('#ab-feed').onclick=feed;
    $('#ab-play').onclick=startGame;
    $('#ab-sleep').onclick=toggleSleep;
    $('#ab-wash').onclick=washBtn;
    $('#ab-med').onclick=medicine;
    $('#ab-gift').onclick=gift;
    $('#ab-shopbtn').onclick=openShop;
    $('#ab-shop-x').onclick=closeShop;
    $('#ab-shop').onclick=e=>{ if(e.target.id==='ab-shop') closeShop(); };
    $('#ab-stage').onclick=stageTap;
    updateHUD(true);
    if(S._away) setTimeout(()=>toast('حاجی دلتنگت بود! 😿'),600);
    tick=setInterval(gameTick,5000);
  }
  function mood(){
    if(sleepOn) return 'sleep';
    if(S.hlth<30) return 'sick';
    if(S.sat<=25) return 'hungry';
    if(S.nrg<=25) return 'sleepy';
    if(S.cln<=25) return 'dirty';
    if(S.fun<=25) return 'bored';
    if(Math.min(S.sat,S.fun,S.nrg,S.cln)>70) return 'love';
    return 'idle';
  }
  function drawCat(){
    const key=mood()+':'+lvl();
    if(key===lastKey) return;
    lastKey=key;
    const c=$('#ab-cat'); if(c) c.innerHTML=catSVG(mood(),lvl());
  }
  function bar(id,v){ const b=$(id); if(!b) return; b.style.width=Math.max(0,Math.min(100,v))+'%'; b.className=v<=25?'low':v<=55?'mid':''; }
  function updateHUD(first){
    bar('#ab-sat',S.sat); bar('#ab-fun',S.fun); bar('#ab-nrg',S.nrg); bar('#ab-cln',S.cln); bar('#ab-hlth',S.hlth);
    const set=(id,v)=>{ const e=$(id); if(e) e.textContent=fa(Math.round(v)); };
    set('#ab-sat-n',S.sat); set('#ab-fun-n',S.fun); set('#ab-nrg-n',S.nrg); set('#ab-cln-n',S.cln); set('#ab-hlth-n',S.hlth);
    const l=lvl(), nx=LV[l+1]?LV[l+1].xp:300;
    const lv=$('#ab-lvl'); if(lv) lv.textContent=LV[l].n;
    const ag=$('#ab-age'); if(ag) ag.textContent=ageStr();
    const xp=$('#ab-xp'); if(xp) xp.style.width=Math.min(100,S.xp/nx*100)+'%';
    const cn=$('#ab-coins'); if(cn) cn.textContent=fa(getCoins());
    const sc=$('#ab-shop-coins'); if(sc) sc.textContent=fa(getCoins());
    const sl=$('#ab-sleep'); if(sl) sl.innerHTML=sleepOn?'☀️ بیدار':'😴 خواب';
    const fb=$('#ab-feed'); if(fb) fb.innerHTML=`🍗 غذا (${fa(stock())})`;
    const wb=$('#ab-wash'); if(wb) wb.innerHTML=washPhase==='foam'?`🫧 کف ${fa(foamN)}/۶`:washPhase==='rinse'?'🚿 آب بگیر':`🛁 حموم${S.shampoo>0?' 🧴':''}`;
    const st=$('#ab-stage'); if(st) st.classList.toggle('sleeping',sleepOn);
    drawCat();
    const m=mood(), bb=$('#ab-bubble');
    if(bb&&(first||washPhase!=='idle'||Math.random()<0.6)){
      if(washPhase==='foam') bb.textContent=`به حاجی کف بزن! (${fa(foamN)}/۶) 🫧`;
      else if(washPhase==='rinse') bb.textContent='حالا آب بگیر! 🚿';
      else { const arr=MSGS[m]; bb.textContent=arr[Math.random()*arr.length|0]; }
    }
  }
  function gameTick(){
    if(over) return;
    const sick=S.hlth<30, mult=sick?1.5:1;
    if(sleepOn){ S.nrg=Math.min(100,S.nrg+7); S.sat=Math.max(0,S.sat-0.4*mult); S.fun=Math.max(0,S.fun-0.5*mult); S.cln=Math.max(0,S.cln-0.3*mult); }
    else { S.sat=Math.max(0,S.sat-1*mult); S.fun=Math.max(0,S.fun-1.2*mult); S.nrg=Math.max(0,S.nrg-0.8*mult); S.cln=Math.max(0,S.cln-0.6*mult); }
    S.hlth=Math.max(0,S.hlth-0.5-(S.cln<20?1:0)-([S.sat,S.fun,S.nrg].some(v=>v<=0)?1:0));
    const wasSick=lastKey.startsWith('sick');
    updateHUD(); save();
    if(!wasSick&&S.hlth<30){ SFX.bad(); toast('حاجی مریض شد! دارو بده! 🤒💊'); }
  }
  function addXP(n){
    if(S.hlth<30) return updateHUD();
    const before=lvl();
    S.xp+=n;
    const after=lvl();
    if(after>before){ confetti(120); SFX.good(); toast(`حاجی بزرگ شد! ${LV[after].n} 🎉`); }
    updateHUD(); save();
  }
  function cdOk(k,s){ const n=Date.now(); if(cd[k]&&n-cd[k]<s*1000){ toast('یه کم صبر کن! ⏳'); return false; } cd[k]=n; return true; }
  function later(fn,ms){ timers.push(setTimeout(()=>{ if(!over) fn(); },ms)); }
  function fx(e,n){
    const box=$('#ab-fx'); if(!box) return;
    for(let i=0;i<n;i++){
      const s=document.createElement('span');
      s.className='ab-fx-i'; s.textContent=e;
      s.style.right=(8+Math.random()*80)+'%'; s.style.top=(15+Math.random()*50)+'%';
      s.style.animationDelay=(Math.random()*0.3)+'s';
      box.appendChild(s);
      setTimeout(()=>s.remove(),1400);
    }
  }
  function blocked(){
    if(shopOpen) return true;
    if(washPhase!=='idle'){ toast('اول حموم تموم شه! 🛁'); return true; }
    if(sleepOn){ toast('حاجی خوابه! Shhh 😴'); return true; }
    return false;
  }
  /* --- فروشگاه --- */
  function openShop(){
    if(over||busy) return;
    shopOpen=true;
    SFX.tap();
    const o=$('#ab-shop'); if(o) o.style.display='flex';
    renderShopList(); updateHUD();
  }
  function closeShop(){
    shopOpen=false;
    const o=$('#ab-shop'); if(o) o.style.display='none';
  }
  function renderShopList(){
    const list=$('#ab-shop-list'); if(!list) return;
    list.innerHTML=SHOP.map(it=>{
      const own=it.sh?S.shampoo:(S.inv[it.id]||0);
      return `${it.sec?`<div class="ab-sec">${it.sec}</div>`:''}<div class="ab-item"><span class="e">${it.e}</span>
        <span class="inf"><b>${it.n}</b><small>${it.sh?'حموم ویژه + شادی ✨':'سیری +'+fa(it.v)}</small>
        <span class="ab-own">داری: ${fa(own)}</span></small></span>
        <button class="btn btn-gold ab-buy" data-id="${it.id}">🪙 ${fa(it.p)}</button></div>`;
    }).join('');
    list.querySelectorAll('.ab-buy').forEach(b=>b.onclick=()=>buyItem(b.dataset.id));
    const sc=$('#ab-shop-coins'); if(sc) sc.textContent=fa(getCoins());
  }
  function buyItem(id){
    const it=SHOP.find(i=>i.id===id); if(!it) return;
    if(getCoins()<it.p){ toast('سکه کافی نداری! 🪙'); SFX.bad(); return; }
    spendCoins(it.p);
    if(it.sh) S.shampoo++;
    else S.inv[it.id]=(S.inv[it.id]||0)+1;
    SFX.good(); haptic('light');
    toast(`${it.e} ${it.n} خریدی!`);
    renderShopList(); updateHUD(); save();
  }
  function feed(){
    if(over||busy||blocked()) return;
    if(!cdOk('feed',3)) return;
    const owned=SHOP.filter(i=>!i.sh&&(S.inv[i.id]>0)).sort((a,b)=>b.v-a.v)[0];
    if(!owned){ toast('غذایی نداری! از فروشگاه بخر! 🛍️'); openShop(); return; }
    S.inv[owned.id]--;
    S.sat=Math.min(100,S.sat+owned.v); addXP(2);
    const b=$('#ab-bowl'),fe=$('#ab-food');
    if(b){ b.classList.add('show'); fe.textContent=owned.e; later(()=>b.classList.remove('show'),1400); }
    beep(300,.07,'square'); setTimeout(()=>beep(250,.07,'square'),120); setTimeout(()=>beep(350,.09,'square'),240);
    toast(`${owned.e} ${owned.n}! (+${fa(owned.v)} سیری)`);
    updateHUD(); save();
  }
  function medicine(){
    if(over||busy||blocked()) return;
    if(S.hlth>=100&&S.hlth>=30){ toast('حاجی سالمه! نیازی نیست 💪'); return; }
    if(getCoins()<25){ toast('سکه کافی نداری! 🪙'); SFX.bad(); return; }
    spendCoins(25);
    S.hlth=Math.min(100,S.hlth+60); addXP(3);
    fx('💊',3); fx('❤️',3); SFX.good();
    toast('حاجی خوب شد! 💪✨');
    updateHUD(); save();
  }
  function gift(){
    if(over||busy||blocked()) return;
    if(!cdOk('gift',8)) return;
    if(getCoins()<20){ toast('سکه کافی نداری! 🪙'); SFX.bad(); return; }
    spendCoins(20);
    const g=GIFTS[giftIdx++%GIFTS.length];
    S.fun=Math.min(100,S.fun+30); addXP(5);
    fx(g.e,4); SFX.good(); confetti(40);
    toast(`یه ${g.n} ${g.e} برای حاجی!`);
    updateHUD(); save();
  }
  function toggleSleep(){
    if(over||busy||washPhase!=='idle'||shopOpen) return;
    sleepOn=!sleepOn;
    SFX.tap(); haptic('light');
    toast(sleepOn?'شب بخیر حاجی! 🌙':'صبح بخیر! ☀️');
    updateHUD(); save();
  }
  function stageTap(){
    if(shopOpen) return;
    if(washPhase==='foam'){ addFoam(); return; }
    pet();
  }
  function pet(){
    if(over||busy||sleepOn||washPhase!=='idle') return;
    if(!cdOk('pet',1)) return;
    S.fun=Math.min(100,S.fun+3); addXP(1);
    fx('❤️',3);
    beep(180,.09,'sawtooth',.05); setTimeout(()=>beep(160,.09,'sawtooth',.05),110); setTimeout(()=>beep(200,.1,'sawtooth',.05),220);
    updateHUD(); save();
  }
  function washBtn(){
    if(over||busy||sleepOn||shopOpen) return;
    if(washPhase==='idle'){
      washPhase='foam'; foamN=0;
      SFX.flip(); toast(S.shampoo>0?'شامپو داری! به حاجی کف بزن! 🫧🧴':'به حاجی کف بزن! ۶ بار بزنش! 🫧');
      updateHUD();
    } else if(washPhase==='rinse'){
      doRinse();
    }
  }
  function addFoam(){
    if(washPhase!=='foam'||foamN>=FOAM_POS.length) return;
    const st=$('#ab-stage'); if(!st) return;
    const [rx,ty]=FOAM_POS[foamN];
    const d=document.createElement('span');
    d.className='ab-foam'; d.innerHTML='<i></i><i></i><i></i>';
    d.style.right=rx+'%'; d.style.top=ty+'%';
    st.appendChild(d);
    foamN++;
    beep(400+foamN*60,.06,'sine'); haptic('light');
    if(foamN>=6){ washPhase='rinse'; toast('آفرین! حالا دکمه «آب بگیر» رو بزن! 🚿'); SFX.good(); }
    updateHUD();
  }
  function doRinse(){
    washPhase='done';
    const fancy=S.shampoo>0;
    if(fancy) S.shampoo--;
    const st=$('#ab-stage'); if(st) st.classList.add('rinsing');
    beep(300,.3,'sine');
    const foams=[...document.querySelectorAll('.ab-foam')];
    foams.forEach((f,i)=>later(()=>{ f.classList.add('out'); fx('💧',1); setTimeout(()=>f.remove(),350); },300+i*220));
    later(()=>{
      if(st) st.classList.remove('rinsing');
      washPhase='idle'; foamN=0;
      if(fancy){ S.cln=100; S.fun=Math.min(100,S.fun+10); addXP(6); fx('✨',8); SFX.good(); confetti(40); toast('با شامپو تمیز شدی حاجی! 🧴✨'); }
      else { S.cln=Math.max(S.cln,85); addXP(4); fx('✨',5); SFX.good(); toast('تمیز شد! (بدون شامپو ۸۵٪) 🧴 از فروشگاه بخر!'); }
      updateHUD(); save();
    },400+foams.length*220);
    updateHUD();
  }
  function startGame(){
    if(over||busy||blocked()) return;
    if(!cdOk('play',10)) return;
    busy=true;
    let score=0,left=5;
    toast('موش‌ها رو بگیر! 🐭');
    const step=()=>{
      if(over){ busy=false; return; }
      if(left<=0){
        busy=false;
        S.fun=Math.min(100,S.fun+score*5); addXP(score*2);
        toast(score>=4?'آفرین حاجی! شکارچی شدی! 🏆':`+${fa(score*5)} شادی!`);
        updateHUD(); save();
        return;
      }
      const st=$('#ab-stage'); if(!st){ busy=false; return; }
      const m=document.createElement('div');
      m.className='ab-mouse'; m.textContent='🐭';
      m.style.right=(5+Math.random()*72)+'%'; m.style.top=(22+Math.random()*52)+'%';
      m.onclick=e=>{ e.stopPropagation(); if(m.dead) return; m.dead=true;
        score++; left--; beep(700+score*80,.08,'square'); haptic('light'); fx('💥',1); m.remove(); step(); };
      st.appendChild(m);
      timers.push(setTimeout(()=>{ if(m.dead||over) return; m.dead=true; left--;
        m.classList.add('bye'); setTimeout(()=>m.remove(),200); step(); },1400));
    };
    step();
  }
  function stop(){ over=true; busy=false; shopOpen=false; if(tick){clearInterval(tick);tick=null;} (timers||[]).forEach(clearTimeout); timers=[]; washPhase='idle'; if(S) save(); }
  return { render, stop };
})();
