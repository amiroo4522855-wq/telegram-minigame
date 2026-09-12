/* ===== هاب «بیشتر»: منو، لیدربرد، فروشگاه، آیتم‌ها، ارتقاء ===== */
const Hub=(()=>{
  let tab='menu', shopFilter='all', boardTab='coins', iv=null, giftSel={};

  const SLOTS={dice:{t:'تاس',ic:'dice'},chess:{t:'شطرنج',ic:'crown'},ball:{t:'توپ بال‌ران',ic:'ball'}};

  const SHOP=[
    {id:'dice_gold',slot:'dice',name:'تاس طلایی',desc:'خال‌های مشکی روی طلای ناب',price:2500},
    {id:'dice_shadow',slot:'dice',name:'تاس سایه',desc:'مشکی مات با خال‌های سرخ',price:1800},
    {id:'dice_silver',slot:'dice',name:'تاس نقره‌ای',desc:'نقره براق با خال سرمه‌ای',price:1500},
    {id:'dice_crimson',slot:'dice',name:'تاس سرخ',desc:'قرمز آتشی با خال سفید',price:1200},
    {id:'dice_ocean',slot:'dice',name:'تاس اقیانوس',desc:'آبی عمیق با خال فیروزه‌ای',price:1200},
    {id:'dice_ghost',slot:'dice',name:'تاس روح',desc:'سفید نورانی با خال یخی',price:1000},
    {id:'th_royal',slot:'chess',name:'صفحه سلطنتی',desc:'بنفش و طلایی، مخصوص شاهان',price:2800},
    {id:'th_midnight',slot:'chess',name:'صفحه نیمه‌شب',desc:'سرمه‌ای عمیق و مهتابی',price:2200},
    {id:'th_emerald',slot:'chess',name:'صفحه زمرد',desc:'سبز جنگلی و کرم',price:2000},
    {id:'th_crimson',slot:'chess',name:'صفحه سرخ',desc:'زرشکی و شنی',price:1800},
    {id:'ball_fire',slot:'ball',name:'توپ آتش',desc:'گلوله آتشی توی تونل',price:2200},
    {id:'ball_gold',slot:'ball',name:'توپ طلایی',desc:'درخشش طلایی خالص',price:2000},
    {id:'ball_ghost',slot:'ball',name:'توپ روح',desc:'سفید مه‌آلود',price:1800},
    {id:'ball_venom',slot:'ball',name:'توپ سمی',desc:'سبز سمی خطرناک',price:1600},
  ];
  const BALL_COLORS={
    ball_fire:{c:'#fff7ed',m:'#fb923c',r:'#c2410c',g:'#fb923c'},
    ball_gold:{c:'#fffbeb',m:'#fbbf24',r:'#92400e',g:'#fbbf24'},
    ball_ghost:{c:'#ffffff',m:'#e9d5ff',r:'#7e22ce',g:'#d8b4fe'},
    ball_venom:{c:'#f0fdf4',m:'#4ade80',r:'#14532d',g:'#4ade80'},
  };
  const UPGS=[
    {id:'ludo_luck',game:'منچ',gi:'dice',ic:'clover',name:'شانس منچ',desc:'احتمال ۶ آوردن بیشتر می‌شه!',costs:[300,600,1000,1500,2200],fx:lv=>`شانس ۶: ٪${fa(Math.round((1/6+lv*0.035)*100))}`},
    {id:'snakes_luck',game:'مار و پله',gi:'snake',ic:'clover',name:'شانس مار و پله',desc:'تاس‌های بهتر، صعود سریع‌تر!',costs:[300,600,1000,1500,2200],fx:lv=>`شانس ۶: ٪${fa(Math.round((1/6+lv*0.035)*100))}`},
    {id:'dino_score',game:'دایی ناصر',gi:'dino',ic:'dino',name:'موتور دایی ناصر',desc:'هر قدم، امتیاز بیشتر!',costs:[400,800,1300,1900,2600],fx:lv=>'×'+(1+lv*0.15).toFixed(2).replace(/\.?0+$/,'')+' امتیاز'},
    {id:'ball_magnet',game:'بال‌ران',gi:'ball',ic:'magnet',name:'مگنت توپ',desc:'سکه‌ها از دور جذب می‌شن! سطح ۳: شروع با سپر 🛡️',costs:[350,700,1100,1600,2200],fx:lv=>`شعاع جذب +${fa(lv*8)}`},
    {id:'quiz_time',game:'کوییز',gi:'quiz',ic:'clock',name:'وقت اضافه کوییز',desc:'برای هر سوال وقت بیشتر!',costs:[300,600,900,1300,1800],fx:lv=>`+${fa(lv*2)} ثانیه هر سوال`},
  ];
  const FRIENDS=[{n:'آرش',c:'#f472b6'},{n:'سارا',c:'#22d3ee'},{n:'رادین',c:'#a3e635'}];
  const BNAMES=[['شاه مینی‌گیم',265],['شبح شب',230],['نابغه',160],['پرو پلیر',200],['آقای رکورد',45],['ستاره',300],['گردباد',190],['عقاب',140],['شیر',30],['اژدها',0],['روباه',20],['گرگ',250],['پلنگ',100],['شاهین',210],['نهنگ',240],['ببر',15],['فیل',280],['جغد',180],['کلاغ',260],['موشک',320],['شهاب',55],['رعد',195],['طوفان',175],['آذرخش',40]];

  function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
  function ballColors(id){ return BALL_COLORS[id]||null; }
  function skinClass(slot){ return equippedGet(slot)||''; }
  function stop(){ if(iv){clearInterval(iv);iv=null;} }

  /* ---------- پیش‌نمایش‌ها ---------- */
  function dicePrev(skin){
    const P6=[0,2,3,5,6,8];
    let d=''; for(let i=0;i<9;i++) d+=`<i class="${P6.includes(i)?'on':''}"></i>`;
    return `<span class="pdice ${skin} pv-static">${d}</span>`;
  }
  function chessPrev(cls){
    let d=''; for(let r=0;r<4;r++)for(let c=0;c<4;c++) d+=`<div class="cs ${((r+c)%2===0)?'L':'D'}"></div>`;
    return `<div class="pv-chess ${cls}">${d}</div>`;
  }
  function ballPrev(id){
    const b=BALL_COLORS[id]||{c:'#fff',m:'#67e8f9',r:'#0e7490',g:'#22d3ee'};
    return `<div class="pv-ball" style="--b1:${b.c};--b2:${b.m};--b3:${b.r};--bg:${b.g}"></div>`;
  }
  function preview(it){
    if(it.slot==='dice') return dicePrev(it.id);
    if(it.slot==='chess') return chessPrev(it.id);
    return ballPrev(it.id);
  }

  /* ---------- منو ---------- */
  function claimable(){
    const d=getDaily(), cl=claimedList();
    return MISSIONS.some(m=>Math.min(d[m.metric]||0,m.target)>=m.target&&!cl.includes(m.id));
  }
  function menuHTML(){
    const nI=itemsGet().length, lvT=UPGS.reduce((a,u)=>a+upgLevel(u.id),0);
    const cards=[
      {go:'board',cls:'c-gold',ic:'podium',t:'لیدربرد جهانی',s:'با همه رقابت کن!',badge:'🌍'},
      {go:'shop',cls:'c-pink',ic:'bag',t:'فروشگاه',s:`${fa(SHOP.length)} اسکین خفن منتظرته`,badge:fa(SHOP.length)},
      {go:'__missions',cls:'c-blue',ic:'target',t:'ماموریت روزانه',s:'انجام بده، سکه بگیر',dot:claimable()},
      {go:'items',cls:'c-green',ic:'pack',t:'آیتم‌های من',s:'اسکین‌هات اینجان',badge:fa(nI)},
      {go:'upgrades',cls:'c-violet',ic:'up',t:'ارتقاء',s:'قوی‌تر شو، بیشتر ببر',badge:lvT?('Lv '+fa(lvT)):''},
    ];
    return `<section class="page-head hub-head">
        <h2>${icon('grid2',24)} گزینه‌های بیشتر</h2>
        <p>فروشگاه، لیدربرد، آیتم‌ها و ارتقاء — همه اینجان!</p></section>
      <div class="hub-menu">${cards.map(c=>`
        <button class="hub-card ${c.cls}" data-go="${c.go}">
          <span class="hub-ic">${icon(c.ic,30)}</span>
          <span class="hub-tx"><b>${c.t}</b><small>${c.s}</small></span>
          ${c.badge?`<span class="hub-pill">${c.badge}</span>`:''}
          ${c.dot?'<i class="hub-dot"></i>':''}
          <span class="hub-arrow">‹</span>
        </button>`).join('')}</div>
      <div style="height:100px"></div>`;
  }

  /* ---------- لیدربرد ---------- */
  function boardData(key){
    const P=key==='coins'?coins:key==='wins'?stats.wins:level();
    let h=7; const ss=todayStr()+key;
    for(const ch of ss) h=(Math.imul(h,31)+ch.charCodeAt(0))|0;
    const rng=mulberry32(h);
    const top=key==='coins'?Math.max(8000,Math.round(P*2.2)):key==='wins'?Math.max(120,P*2+8):Math.max(15,P+6);
    const arr=BNAMES.map(([n,hue],i)=>{
      const f=Math.pow(1-(i+0.5)/BNAMES.length,1.6);
      let v=Math.round(top*(0.08+0.92*f)*(0.9+rng()*0.2));
      if(key==='level') v=Math.max(1,Math.min(30,v));
      return {n,hue,v,me:false};
    });
    arr.push({n:displayName(),hue:-1,v:P,me:true});
    arr.sort((a,b)=>b.v-a.v);
    return {arr,online:1200+Math.floor(rng()*600)};
  }
  function resetIn(){
    const n=new Date(), d=new Date(n);
    d.setDate(n.getDate()+((8-n.getDay())%7||7)); d.setHours(0,0,0,0);
    let s=Math.max(0,((d-n)/1000)|0);
    const dd=(s/86400)|0; s%=86400, hh=(s/3600)|0, mm=((s%3600)/60)|0;
    return dd>0?`${fa(dd)} روز و ${fa(hh)} ساعت`:`${fa(hh)} ساعت و ${fa(mm)} دقیقه`;
  }
  function boardHTML(){
    const tabs=[['coins','coin','ثروت'],['wins','trophy','برد'],['level','bolt','سطح']];
    const {arr,online}=boardData(boardTab);
    const meRank=arr.findIndex(p=>p.me)+1;
    const unit=boardTab==='coins'?'🪙':boardTab==='wins'?'🏆':'⚡';
    const top3=arr.slice(0,3), rest=arr.slice(3);
    const medal=['🥇','🥈','🥉'];
    const ava=p=>p.me
      ?`<span class="lb-av me">${(()=>{const s=avatarSrc();return s?`<img src="${s}">`:(displayName()[0]||'•');})()}</span>`
      :`<span class="lb-av" style="background:hsl(${p.hue},70%,45%)">${p.n[0]}</span>`;
    return `${subHead('podium','لیدربرد جهانی')}
      <div class="lb-tabs">${tabs.map(([k,ic,t])=>`<button class="${k===boardTab?'on':''}" data-bt="${k}">${icon(ic,15)} ${t}</button>`).join('')}</div>
      <div class="lb-live"><span class="pulse"></span> ${fa(online)} بازیکن آنلاین • ریست لیگ: <b id="lb-reset">${resetIn()}</b></div>
      <div class="lb-me">رتبه شما: <b>#${fa(meRank)}</b> از ${fa(arr.length)} • ${unit} ${fa(boardTab==='coins'?coins:boardTab==='wins'?stats.wins:level())}</div>
      <div class="podium">${[top3[1],top3[0],top3[2]].map((p,i)=>{
        const rank=i===0?2:i===1?1:3;
        return `<div class="pod p${rank} ${p.me?'me':''}">${ava(p)}<b>${p.me?'شما':p.n}</b><small>${unit} ${fa(p.v)}</small><span class="pod-med">${medal[rank-1]}</span></div>`;
      }).join('')}</div>
      <div class="lb-list">${rest.map((p,i)=>`
        <div class="lb-row ${p.me?'me':''}"><span class="lb-rk">${fa(i+4)}</span>${ava(p)}
          <b>${p.me?'شما 🌟':p.n}</b><span class="lb-v">${unit} ${fa(p.v)}</span></div>`).join('')}</div>
      <div style="height:100px"></div>`;
  }

  /* ---------- فروشگاه ---------- */
  function shopHTML(){
    const list=SHOP.filter(it=>shopFilter==='all'||it.slot===shopFilter);
    const chips=[['all','همه'],['dice','تاس'],['chess','شطرنج'],['ball','توپ']];
    return `${subHead('bag','فروشگاه')}
      <div class="shop-bal">${icon('coin',20)} <b>${fa(coins)}</b> <small>موجودی</small></div>
      <div class="lb-tabs">${chips.map(([k,t])=>`<button class="${k===shopFilter?'on':''}" data-sf="${k}">${t}</button>`).join('')}</div>
      <div class="shop-grid">${list.map(it=>{
        const owned=itemsHas(it.id), eq=equippedGet(it.slot)===it.id;
        return `<div class="shop-card ${owned?'owned':''}">
          <div class="shop-pv">${preview(it)}</div>
          <b>${it.name}</b><small>${it.desc}</small>
          <div class="shop-row"><span class="slot-tag">${icon(SLOTS[it.slot].ic,12)} ${SLOTS[it.slot].t}</span>
          ${owned?(eq?'<span class="own-tag on">✅ فعاله</span>':'<span class="own-tag">دارمش ✓</span>')
            :`<button class="btn btn-gold buy-btn" data-buy="${it.id}">${icon('coin',14)} ${fa(it.price)}</button>`}</div>
        </div>`;
      }).join('')}</div>
      <div style="height:100px"></div>`;
  }

  /* ---------- آیتم‌ها ---------- */
  function itemsHTML(){
    const owned=SHOP.filter(it=>itemsHas(it.id));
    if(!owned.length) return `${subHead('pack','آیتم‌های من')}
      <div class="empty-box"><div class="empty-ic">${icon('pack',54)}</div>
      <b>هنوز آیتمی نداری!</b><small>از فروشگاه اسکین بخر تا این قسمت پر بشه 🛍️</small>
      <button class="btn btn-gold" data-go="shop">${icon('bag',17)} رفتن به فروشگاه</button></div>
      <div style="height:100px"></div>`;
    return `${subHead('pack','آیتم‌های من')}
      <div class="inv-list">${owned.map(it=>{
        const eq=equippedGet(it.slot)===it.id;
        const gs=giftSel[it.id];
        return `<div class="inv-card">
          <div class="inv-pv">${preview(it)}</div>
          <div class="inv-tx"><b>${it.name}</b><small>${icon(SLOTS[it.slot].ic,12)} ${SLOTS[it.slot].t} ${eq?'• <span class="own-tag on">فعال ✅</span>':''}</small></div>
          <div class="inv-btns">
            ${eq?`<button class="btn btn-ghost sm" data-uneq="${it.slot}">برداشتن</button>`
               :`<button class="btn btn-primary sm" data-eq="${it.id}">انتخاب</button>`}
            <button class="btn btn-ghost sm" data-gift="${it.id}">${icon('gift',14)} هدیه</button>
          </div>
          ${gs?`<div class="gift-row"><small>به کی هدیه بدی؟</small>${FRIENDS.map(f=>`
            <button class="friend" data-gf="${it.id}|${f.n}"><span class="f-av" style="background:${f.c}">${f.n[0]}</span>${f.n}</button>`).join('')}</div>`:''}
        </div>`;
      }).join('')}</div>
      <div style="height:100px"></div>`;
  }

  /* ---------- ارتقاء ---------- */
  function upgHTML(){
    return `${subHead('up','ارتقاء')}
      <div class="shop-bal">${icon('coin',20)} <b>${fa(coins)}</b> <small>موجودی</small></div>
      <div class="upg-list">${UPGS.map(u=>{
        const lv=upgLevel(u.id), maxed=lv>=u.costs.length;
        const pips=Array.from({length:u.costs.length},(_,i)=>`<i class="${i<lv?'on':''}"></i>`).join('');
        return `<div class="upg-card ${maxed?'maxed':''}">
          <span class="upg-ic">${icon(u.ic,30)}</span>
          <div class="upg-tx"><b>${u.name} <span class="slot-tag">${icon(u.gi,12)} ${u.game}</span></b>
            <small>${u.desc}</small>
            <div class="upg-pips">${pips}</div>
            <div class="upg-fx">✨ ${u.fx(lv)}${!maxed?` <span class="upg-next">← ${u.fx(lv+1)}</span>`:''}</div>
          </div>
          ${maxed?'<span class="own-tag on">MAX 👑</span>'
            :`<button class="btn btn-gold buy-btn" data-upg="${u.id}">${icon('coin',14)} ${fa(u.costs[lv])}</button>`}
        </div>`;
      }).join('')}</div>
      <div style="height:100px"></div>`;
  }

  function subHead(ic,t){
    return `<section class="page-head hub-sub">
      <button class="icon-btn" id="hub-back">${icon('back',20)}</button>
      <h2>${icon(ic,24)} ${t}</h2><span style="width:42px"></span></section>`;
  }

  /* ---------- رندر + بایند ---------- */
  function render(t){
    stop();
    if(t) tab=t;
    const box=$('#more-body');
    if(!box) return;
    box.innerHTML = tab==='menu'?menuHTML():tab==='board'?boardHTML():tab==='shop'?shopHTML():tab==='items'?itemsHTML():upgHTML();
    hydrateIcons(box);
    box.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{ SFX.tap(); haptic('light');
      const g=b.dataset.go;
      if(g==='__missions'){ showScreen('missions'); } else render(g);
    });
    const bk=$('#hub-back'); if(bk) bk.onclick=()=>{ SFX.tap(); render('menu'); };
    box.querySelectorAll('[data-bt]').forEach(b=>b.onclick=()=>{ SFX.tap(); boardTab=b.dataset.bt; render('board'); });
    box.querySelectorAll('[data-sf]').forEach(b=>b.onclick=()=>{ SFX.tap(); shopFilter=b.dataset.sf; render('shop'); });
    box.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>buyItem(b.dataset.buy));
    box.querySelectorAll('[data-eq]').forEach(b=>b.onclick=()=>{
      const it=SHOP.find(x=>x.id===b.dataset.eq);
      equippedSet(it.slot,it.id); SFX.good(); haptic('medium');
      toast(`«${it.name}» فعال شد! ✨`); render('items');
    });
    box.querySelectorAll('[data-uneq]').forEach(b=>b.onclick=()=>{ equippedSet(b.dataset.uneq,null); SFX.tap(); render('items'); });
    box.querySelectorAll('[data-gift]').forEach(b=>b.onclick=()=>{
      const id=b.dataset.gift;
      giftSel[id]=!giftSel[id]; SFX.tap(); render('items');
    });
    box.querySelectorAll('[data-gf]').forEach(b=>b.onclick=()=>{
      const [id,fn]=b.dataset.gf.split('|');
      const it=SHOP.find(x=>x.id===id);
      askConfirm(`هدیه به ${fn}؟`,`«${it.name}» رو به ${fn} هدیه می‌دی؟ ${fn} برات <b>۸۰ سکه</b> کادوی برگشتی می‌فرسته! 🎁`,'بده بره!',()=>{
        itemsDel(id); addCoins(80,'کادوی برگشتی 🎁');
        toast(`${fn}: مرسی رفیق! 🥰`); SFX.good(); render('items');
      });
    });
    box.querySelectorAll('[data-upg]').forEach(b=>b.onclick=()=>buyUpg(b.dataset.upg));
    if(tab==='board'){
      iv=setInterval(()=>{ const r=$('#lb-reset'); if(r) r.textContent=resetIn(); },30000);
    }
    box.scrollTop=0; window.scrollTo(0,0);
  }

  function buyItem(id){
    const it=SHOP.find(x=>x.id===id);
    if(itemsHas(id)) return;
    if(coins<it.price){ SFX.bad(); toast(`سکه کم داری! ${fa(it.price-coins)} سکه دیگه لازم داری 🪙`); return; }
    askConfirm(it.name,`${it.desc}<br>قیمت: <b>${fa(it.price)} سکه</b> 🪙<br>می‌ره تو آیتم‌هات و می‌تونی فعالش کنی!`,'می‌خرم!',()=>{
      if(!spendCoins(it.price)){ toast('سکه کم داری!'); return; }
      itemsAdd(id); SFX.good(); confetti(120);
      toast(`«${it.name}» مال تو شد! رفت تو آیتم‌ها 🎒`);
      render('shop');
    });
  }
  function buyUpg(id){
    const u=UPGS.find(x=>x.id===id), lv=upgLevel(id);
    if(lv>=u.costs.length) return;
    const c=u.costs[lv];
    if(coins<c){ SFX.bad(); toast(`سکه کم داری! ${fa(c-coins)} سکه دیگه لازم داری 🪙`); return; }
    askConfirm(u.name,`ارتقاء به سطح <b>${fa(lv+1)}</b><br>${u.fx(lv)} ← <b>${u.fx(lv+1)}</b><br>قیمت: <b>${fa(c)} سکه</b> 🪙`,'ارتقاء بده!',()=>{
      if(!spendCoins(c)){ toast('سکه کم داری!'); return; }
      upgSet(id,lv+1); SFX.good(); confetti(100);
      toast(`«${u.name}» شد سطح ${fa(lv+1)}! ⬆️🔥`);
      render('upgrades');
    });
  }

  return { render, stop, ballColors, skinClass, tab:()=>tab };
})();
window.Hub=Hub;
