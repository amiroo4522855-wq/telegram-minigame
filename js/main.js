/* ===== مدیریت اصلی — نسخه ۲٫۱ (آیکون SVG) ===== */
const GAMES = [
  {id:'memory', gi:'cards', name:'کاشی حافظه', desc:'تقویت حافظه و تمرکز', cls:'g1', sub:'تست حافظه • رکوردی', img:'images/memory.jpg', obj:()=>MemoryGame},
  {id:'ludo', gi:'dice', name:'منچ', desc:'رقابت کلاسیک با ربات', cls:'g2', sub:'کلاسیک و اعتیادآور', img:'images/ludo.jpg', obj:()=>LudoGame},
  {id:'chess', gi:'crown', name:'شطرنج', desc:'نبرد فکری با ربات', cls:'g3', sub:'کیش‌ومات کن!', img:'images/chess.jpg', obj:()=>ChessGame},
  {id:'sudoku', gi:'grid', name:'سودوکو', desc:'پازل اعداد حرفه‌ای', cls:'g5', sub:'منطق و تمرکز', img:'images/sudoku.jpg', obj:()=>SudokuGame},
  {id:'mines', gi:'bomb', name:'مین‌روب', desc:'پاکسازی میدان مین', cls:'g4', sub:'دقت و شجاعت', img:'images/mines.jpg', obj:()=>MinesGame},
  {id:'rps', gi:'scissors', name:'سنگ کاغذ قیچی', desc:'دوئل سریع با ربات', cls:'g2', sub:'سریع و هیجانی', img:'images/rps.jpg', obj:()=>RpsGame},
  {id:'quiz', gi:'quiz', name:'کوییز', desc:'۶ دسته سوال جذاب', cls:'g1', sub:'نابغه شو!', img:'images/quiz.jpg', obj:()=>QuizGame},
  {id:'dino', gi:'dino', name:'دایی ناصر', desc:'بدو، بپر، رکورد بزن!', cls:'g4', sub:'دونده بی‌پایان', img:'images/dino.jpg', obj:()=>DinoGame},
  {id:'g2048', gi:'tiles', name:'2048', desc:'کاشی‌ها رو قاطی کن', cls:'g5', sub:'پازل اعتیادآور', img:'images/g2048.jpg', obj:()=>G2048},
  {id:'doz', gi:'doz', name:'دوز', desc:'سه‌تایی بچین و ببر', cls:'g3', sub:'کلاسیک و سریع', img:'images/doz.jpg', obj:()=>DozGame},
  {id:'candy', gi:'candy', name:'آبنبات', desc:'۳تایی بچین و بترکون', cls:'g2', sub:'مچ‌۳ رنگارنگ', img:'images/candy.jpg', obj:()=>CandyGame},
  {id:'snakes', gi:'snake', name:'مار و پله', desc:'مسابقه تا خونه ۱۰۰', cls:'g4', sub:'شانس و هیجان', img:'images/snakes.jpg', obj:()=>SnakesGame},
  {id:'flags', gi:'flag', name:'حدس پرچم', desc:'اسم کشور رو حدس بزن', cls:'g1', sub:'چالش اطلاعات', img:'images/flags.jpg', obj:()=>FlagsGame},
  {id:'abdolah', gi:'cat', name:'حاج عبدالله', desc:'گربه‌تو بزرگ کن!', cls:'g2', sub:'حیوان خونگی', img:'images/abdolah.jpg', obj:()=>AbdolahGame},
  {id:'tower', gi:'tower', name:'تاور استک', desc:'برج بلندتر، امتیاز بیشتر', cls:'g5', sub:'دقت و سرعت', img:'images/tower.jpg', obj:()=>TowerGame},
  {id:'iceslide', gi:'snow', name:'آیس اسلاید', desc:'پنگوئن رو به ماهی برسون', cls:'g3', sub:'پازل یخی', img:'images/iceslide.jpg', obj:()=>IceSlideGame},
  {id:'escape', gi:'car', name:'اسکیپ', desc:'ماشین قرمز رو فراری بده!', cls:'g4', sub:'پازل پارکینگ', img:'images/escape.jpg', obj:()=>EscapeGame},
  {id:'ballrun', gi:'ball', name:'بال‌ران', desc:'توپ نئونی، فرار از موانع', cls:'g5', sub:'اکشن بی‌پایان', img:'images/ballrun.jpg', obj:()=>BallRunGame},
];
let currentGame=null, currentObj=null;
const gameIcon=(id,sz)=>(GAMES.find(g=>g.id===id)||{gi:'gamepad'}).gi ? icon((GAMES.find(g=>g.id===id)||{gi:'gamepad'}).gi, sz||22) : '';
const gameName=id=>(GAMES.find(g=>g.id===id)||{}).name||'بازی';

// --- جابه‌جایی صفحه ---
const SCREENS={home:'screen-home',missions:'screen-missions',profile:'screen-profile',settings:'screen-settings',game:'screen-game',more:'screen-more'};
function showScreen(name){
  if(name!=='game'&&currentObj?.stop){ try{currentObj.stop()}catch(e){} currentObj=null; currentGame=null; }
  Object.values(SCREENS).forEach(id=>$('#'+id).classList.remove('active'));
  $('#end-modal')?.classList.remove('show');
  $('#'+SCREENS[name]).classList.add('active');
  ['home','more','profile','settings'].forEach(n=>$('#nav-'+n)?.classList.toggle('active',n===name||(n==='more'&&name==='missions')));
  window.scrollTo(0,0);
  try{ tg?.BackButton?.hide(); }catch(e){}
  if(name!=='more'&&window.Hub) Hub.stop();
  if(name==='missions') renderMissions();
  if(name==='profile') renderProfile();
  if(name==='more') Hub.render();
}
function goHome(){ showScreen('home'); }
function openGame(id){
  const g=GAMES.find(x=>x.id===id); if(!g) return;
  if(currentObj?.stop){ try{currentObj.stop()}catch(e){} }
  $('#game-title').innerHTML = icon(g.gi,22)+' '+g.name;
  $('#game-sub').textContent=g.sub;
  Object.values(SCREENS).forEach(sid=>$('#'+sid).classList.remove('active'));
  $('#end-modal')?.classList.remove('show');
  $('#screen-game').classList.add('active');
  ['home','more','profile','settings'].forEach(n=>$('#nav-'+n)?.classList.remove('active'));
  window.scrollTo(0,0);
  try{ tg?.BackButton?.show(); }catch(e){}
  currentGame=id; currentObj=g.obj();
  haptic('medium'); SFX.tap();
  const diff=document.querySelector('.diff-btn.active')?.dataset.diff||'medium';
  currentObj.render(diff);
}

// --- کارت‌های بنری ---
(function(){
  const grid=$('#games-grid');
  GAMES.forEach(g=>{
    const best=store.get('best_'+g.id,null);
    const d=document.createElement('div');
    d.className=`gcard ${g.cls}`;
    d.innerHTML=`
      <div class="gimg" style="background-image:url('${g.img}')"></div>
      <div class="gbody">
        <div class="gname"><span class="g-ic">${icon(g.gi,20)}</span><div><h3>${g.name}</h3><small>${g.desc}</small></div></div>
        ${best?`<small class="best-tag" style="opacity:.9">${icon('star',12)} ${best}</small>`:''}
        <span class="gplay">${icon('play',20)}</span>
      </div>`;
    d.onclick=()=>openGame(g.id);
    grid.appendChild(d);
  });
  $('#games-count').textContent = fa(GAMES.length)+' بازی';
})();

// --- درجه سختی ---
$$('.diff-btn').forEach(b=>b.onclick=()=>{
  $$('.diff-btn').forEach(x=>x.classList.remove('active'));
  b.classList.add('active'); haptic('light'); SFX.tap();
  if(currentGame&&currentObj) currentObj.render(b.dataset.diff);
});

// --- ناوبری ---
$('#nav-home').onclick=()=>{haptic('light');SFX.tap();goHome();};
$('#nav-more').onclick=()=>{haptic('light');SFX.tap();Hub.render('menu');showScreen('more');};
$('#nav-profile').onclick=()=>{haptic('light');SFX.tap();showScreen('profile');};
$('#nav-settings').onclick=()=>{haptic('light');SFX.tap();showScreen('settings');};
$('#coins-chip').onclick=()=>{haptic('light');SFX.tap();showScreen('profile');};
$('#btn-back').onclick=()=>{haptic();goHome();};
$('#btn-help').onclick=()=>openHelp(currentGame);
$('#help-close').onclick=$('#help-ok').onclick=()=>$('#help-modal').classList.remove('show');
$('#help-modal').addEventListener('click',e=>{if(e.target.id==='help-modal')e.target.classList.remove('show');});

// --- ماموریت‌ها ---
function renderMissions(){
  const d=getDaily(), claimed=claimedList();
  $('#missions-sub').textContent=`امروز ${fa(d.played)} بازی و ${fa(d.wins)} برد داشتی — نیمه‌شب تازه می‌شن!`;
  const box=$('#missions-list'); box.innerHTML='';
  MISSIONS.forEach((m,i)=>{
    const prog=Math.min(d[m.metric]||0,m.target), done=prog>=m.target, got=claimed.includes(m.id);
    const el=document.createElement('div');
    el.className='m-card'+(done?' done':'')+(got?' claimed':'');
    el.style.animationDelay=(i*0.06)+'s';
    el.innerHTML=`
      <div class="m-ic">${icon(m.icon,26)}</div>
      <div class="m-info"><b>${m.title}</b>
        <small>${fa(prog)} / ${fa(m.target)} • جایزه ${icon('coin',13)} ${fa(m.reward)}</small>
        <div class="m-bar"><i style="width:${prog/m.target*100}%"></i></div>
      </div>
      <button class="btn ${got?'btn-ghost':done?'btn-gold':'btn-ghost'} m-claim" ${(!done||got)?'disabled':''}>${got?icon('check',16):done?'دریافت':icon('lock',16)}</button>`;
    if(done&&!got) el.querySelector('button').onclick=()=>{
      claimMission(m.id); haptic('medium'); addCoins(m.reward,'ماموریت');
      renderMissions();
    };
    box.appendChild(el);
  });
}
window.refreshMissionsDot=function(){
  const d=getDaily(), claimed=claimedList();
  const any=MISSIONS.some(m=>Math.min(d[m.metric]||0,m.target)>=m.target&&!claimed.includes(m.id));
  $('#m-dot').classList.toggle('show',any);
};
refreshMissionsDot();
try{ tg?.BackButton?.onClick(()=>{ haptic('light'); goHome(); }); }catch(e){}
document.querySelector('.bottomnav').addEventListener('contextmenu',e=>e.preventDefault());
document.querySelector('.topbar').addEventListener('contextmenu',e=>e.preventDefault());

// --- رتبه بر اساس سطح ---
function rankOf(lv){
  if(lv>=9) return {t:'افسانه',ic:'crown',c:'#fbbf24'};
  if(lv>=6) return {t:'استاد',ic:'medal',c:'#c4b5fd'};
  if(lv>=4) return {t:'حرفه‌ای',ic:'trophy',c:'#22d3ee'};
  if(lv>=2) return {t:'بازیکن',ic:'gamepad',c:'#34d399'};
  return {t:'تازه‌وارد',ic:'star',c:'#94a3b8'};
}
// کپی جایگزین برای محیط‌هایی که clipboard ندارن
function fallbackCopy(t){
  try{
    const ta=document.createElement('textarea');
    ta.value=t; ta.style.cssText='position:fixed;opacity:0;top:0';
    document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); ta.remove();
    toast('متن رکوردت کپی شد!');
  }catch(e){ toast('کپی نشد!'); }
}
// --- پروفایل + تاریخچه ---
function renderProfile(){
  const n=displayName(), wr=stats.played?Math.round(stats.wins/stats.played*100):0;
  const rk=rankOf(level()), R=44, C=2*Math.PI*R, off=C*(1-levelProg()/100);
  const BADGES=[
    {ic:'gamepad',t:'اولین قدم',d:'۱ بازی',ok:stats.played>=1},
    {ic:'trophy',t:'اولین برد',d:'۱ برد',ok:stats.wins>=1},
    {ic:'medal',t:'ده‌تایی',d:'۱۰ برد',ok:stats.wins>=10},
    {ic:'coin',t:'پس‌انداز',d:'۵۰۰ سکه',ok:coins>=500},
    {ic:'star',t:'ستاره',d:'۲۰۰۰ سکه',ok:coins>=2000},
    {ic:'flame',t:'آتشین',d:'۵ برد پیاپی',ok:store.get('rps_streak',0)>=5},
    {ic:'grid',t:'منطق‌دان',d:'حل سودوکو',ok:!!store.get('best_sudoku',null)},
    {ic:'crown',t:'شطرنج‌باز',d:'مات ربات',ok:!!store.get('best_chess',null)},
  ];
  const gotN=BADGES.filter(b=>b.ok).length;
  // نمودار ۷ روز از روی تاریخچه
  const WD=['۱شنبه','۲شنبه','۳شنبه','۴شنبه','۵شنبه','جمعه','شنبه'];
  const hAll=store.get('history',[]);
  const days=[...Array(7)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));return d;});
  const counts=days.map(d=>{const k=d.toDateString();return hAll.filter(x=>new Date(x.t).toDateString()===k).length;});
  const mx=Math.max(1,...counts);

  $('#profile-box').innerHTML=`
    <div class="pf-cover pf-sec" style="margin-top:4px">
      <div class="pf-ring">
        <svg viewBox="0 0 100 100">
          <defs><linearGradient id="pfGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#fbbf24"/><stop offset="1" stop-color="#f472b6"/>
          </linearGradient></defs>
          <circle class="ring-bg" cx="50" cy="50" r="${R}"/>
          <circle class="ring-fg" cx="50" cy="50" r="${R}" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}"/>
        </svg>
        <div class="pf-ava" style="background:${AVA_COLORS[0]}">${(()=>{const s=avatarSrc();return s?`<img src="${s}" alt="avatar">`:(n[0]||'•');})()}</div>
        <div class="pf-lv">سطح ${fa(level())}</div>
      </div>
      <div class="pf-name">${n}</div>
      <div class="pf-user">${tgUser?'@'+tgUser:'بازیکن مینی‌گیم'}</div>
      <div class="pf-rank" style="border-color:${rk.c}66;color:${rk.c}">${icon(rk.ic,15)} رتبه: ${rk.t}</div>
      <div class="pf-xp"><small>${fa(xp())} تجربه • تا سطح بعد ${fa(150-(xp()%150))}</small>
        <div class="pf-xpbar"><i style="width:${levelProg()}%"></i></div></div>
      <div class="pf-btns">
        <button class="btn btn-ghost" id="btn-editpf">${icon('sliders',15)} ویرایش</button>
        <button class="btn btn-gold" id="btn-share">${icon('star',15)} اشتراک رکورد</button>
      </div>
    </div>

    <div class="pf-sec" style="animation-delay:.08s">
      <div class="pf-sec-t">آمار <small>${fa(stats.played)} بازی تا امروز</small></div>
      <div class="pf-stats">
        <div class="pf-stat">${icon('coin',19)}<b>${fa(coins)}</b><small>سکه</small></div>
        <div class="pf-stat">${icon('gamepad',19)}<b>${fa(stats.played)}</b><small>بازی</small></div>
        <div class="pf-stat">${icon('trophy',19)}<b>${fa(stats.wins)}</b><small>برد</small></div>
        <div class="pf-stat">${icon('chart',19)}<b>${fa(wr)}٪</b><small>نرخ برد</small></div>
      </div>
    </div>

    <div class="pf-sec" style="animation-delay:.14s">
      <div class="pf-sec-t">مدال‌ها <small>${fa(gotN)} از ${fa(BADGES.length)} گرفته شده</small></div>
      <div class="pf-badges">
        ${BADGES.map(b=>`<div class="bdg ${b.ok?'ok':'lock'}"><div class="b-ic">${icon(b.ok?b.ic:'lock',21)}</div><b>${b.t}</b><small>${b.d}</small></div>`).join('')}
      </div>
    </div>

    <div class="pf-sec" style="animation-delay:.2s">
      <div class="pf-sec-t">فعالیت ۷ روز اخیر <small>تعداد بازی روزانه</small></div>
      <div class="pf-chart">
        ${days.map((d,i)=>`<div class="ch-col"><div class="ch-bar${i===6?' today':''}" style="height:${counts[i]?Math.max(12,counts[i]/mx*100):5}%"><span>${counts[i]?fa(counts[i]):''}</span></div><small>${i===6?'امروز':WD[d.getDay()]}</small></div>`).join('')}
      </div>
    </div>`;

  $('#btn-editpf').onclick=()=>{haptic('light');SFX.tap();showScreen('settings');};
  $('#btn-share').onclick=()=>{
    haptic('medium');SFX.tap();
    const txt=`من در مینی‌گیم خفن به سطح ${level()} و رتبه «${rk.t}» رسیدم با ${stats.wins} برد! تو هم بیا بازی کن!`;
    try{
      if(tg&&tg.openTelegramLink){ tg.openTelegramLink('https://t.me/share/url?url='+encodeURIComponent('https://t.me/')+'&text='+encodeURIComponent(txt)); }
      else if(navigator.clipboard){ navigator.clipboard.writeText(txt).then(()=>toast('متن رکوردت کپی شد!')).catch(()=>fallbackCopy(txt)); }
      else fallbackCopy(txt);
    }catch(e){ fallbackCopy(txt); }
  };

  // تاریخچه + فیلتر
  const f=window._hf||'all';
  const box=$('#history-list');
  const chips=[['all','همه'],['win','بردها'],['draw','مساوی'],['lose','باخت‌ها']]
    .map(([v,t])=>`<button class="hf${f===v?' on':''}" data-f="${v}">${t}</button>`).join('');
  const list=hAll.filter(it=>f==='all'||it.r===f);
  const RT={win:['برد','res-win'],lose:['باخت','res-lose'],draw:['مساوی','res-draw']};
  box.innerHTML=`<div class="hf-chips">${chips}</div>`+(list.length?list.map(it=>{
    const [t,cls]=RT[it.r]||RT.draw;
    return `<div class="h-row"><span class="h-ic">${gameIcon(it.g,20)}</span>
      <div class="ht"><b><span class="res-dot ${cls}"></span>${gameName(it.g)} • ${t}</b><small>${it.d||''}</small></div>
      <small style="color:var(--mut);font-size:10px;white-space:nowrap">${timeAgo(it.t)}</small></div>`;
  }).join(''):`<div class="h-empty">${f==='all'?'هنوز بازی نکردی! برو یه دست بزن تا تاریخچه‌ات پر بشه.':'تو این دسته چیزی نیست!'}</div>`);
  box.querySelectorAll('.hf').forEach(b=>b.onclick=()=>{window._hf=b.dataset.f;haptic('light');SFX.tap();renderProfile();});
}

// --- تنظیمات ---
function bindSeg(id, key, cb){
  const seg=$('#'+id);
  seg.querySelectorAll('button').forEach(b=>{
    b.classList.toggle('on', b.dataset.v===String(settings[key]));
    b.onclick=()=>{ settings[key]=b.dataset.v; saveSettings();
      seg.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
      haptic('light'); SFX.tap(); cb&&cb(); };
  });
}
bindSeg('seg-theme','theme',applyTheme);
bindSeg('seg-font','font',applyTheme);
[['sw-sound','sound'],['sw-haptic','haptic'],['sw-confetti','confetti']].forEach(([id,key])=>{
  const el=$('#'+id); el.checked=!!settings[key];
  el.onchange=()=>{ settings[key]=el.checked; saveSettings(); haptic('medium'); SFX.tap();
    toast(el.checked?'روشن شد':'خاموش شد'); };
});
$('#inp-name').value=settings.name||'';
$('#btn-name').onclick=()=>{
  settings.name=$('#inp-name').value.trim().slice(0,20); saveSettings();
  updateUserLabel(); haptic('medium'); SFX.good(); toast('نام ذخیره شد');
};
// انتخاب آواتار + گالری
(function(){
  const box=$('#ava-grid');
  function paint(){
    box.innerHTML='';
    AVATARS.forEach(a=>{
      const b=document.createElement('button');
      b.className='ava-pick'+(settings.avatarId===a.id?' on':'');
      b.title=a.t; b.innerHTML=`<img src="${a.src}" alt="${a.t}" loading="lazy">`;
      b.onclick=()=>{ settings.avatarId=a.id; saveSettings(); paint(); haptic('light'); SFX.tap(); toast('آواتار «'+a.t+'» ست شد!'); };
      box.appendChild(b);
    });
    const g=document.createElement('button');
    const custom=store.get('avatar_custom',null);
    const isC=settings.avatarId==='custom';
    g.className='ava-pick ava-gal'+(isC?' on':''); g.title='گالری';
    g.innerHTML=(isC&&custom)?`<img src="${custom}" alt="گالری">`:`<b>+</b><span>گالری</span>`;
    g.onclick=()=>$('#ava-file').click();
    box.appendChild(g);
  }
  paint();
  $('#ava-file').onchange=e=>{
    const f=e.target.files[0]; if(!f) return;
    if(!f.type.startsWith('image/')){ toast('فقط فایل عکس انتخاب کن!'); e.target.value=''; return; }
    const rd=new FileReader();
    rd.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        try{
          const S=160, cv=document.createElement('canvas'); cv.width=S; cv.height=S;
          const cx=cv.getContext('2d');
          const sc=Math.max(S/img.width,S/img.height), w=img.width*sc, h=img.height*sc;
          cx.drawImage(img,(S-w)/2,(S-h)/2,w,h);
          store.set('avatar_custom',cv.toDataURL('image/jpeg',0.85));
          settings.avatarId='custom'; saveSettings(); paint();
          haptic('medium'); SFX.good(); toast('عکس پروفایلت ست شد!');
        }catch(err){ toast('خطا! یه عکس دیگه امتحان کن'); }
      };
      img.onerror=()=>toast('خطا در خواندن عکس!');
      img.src=rd.result;
    };
    rd.onerror=()=>toast('خطا در خواندن فایل!');
    rd.readAsDataURL(f);
    e.target.value='';
  };
})();
$('#btn-reset').onclick=()=>askConfirm('پاک کردن همه‌چیز؟','سکه‌ها، رکوردها، تاریخچه و تنظیمات <b>برای همیشه</b> پاک می‌شن!','بله، پاک کن',()=>{
  Object.keys(localStorage).filter(k=>k.startsWith('mg_')).forEach(k=>localStorage.removeItem(k));
  location.reload();
});

// --- جایزه روزانه ---
(function(){
  const last=store.get('daily',''), today=todayStr(), btn=$('#daily-btn');
  if(last===today){btn.disabled=true;btn.textContent='دریافت شد';$('#daily-sub').textContent='فردا دوباره سر بزن!';}
  btn.onclick=()=>{
    store.set('daily',today);
    const d=getDaily(); d.daily=1; saveDaily(d);
    addCoins(50,'جایزه روزانه');
    btn.disabled=true;btn.textContent='دریافت شد';$('#daily-sub').textContent='فردا دوباره سر بزن!';
  };
})();
