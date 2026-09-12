/* ===== ابزارهای مشترک — نسخه ۲ ===== */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

// فارسی‌سازی اعداد (اول فایل تا همه‌جا در دسترس باشه)
const fa = n => Number(n).toLocaleString('fa-IR');

// --- تلگرام ---
const tg = window.Telegram?.WebApp || null;
let tgName='', tgUser='';
if (tg) {
  try {
    tg.ready(); tg.expand();
    const u = tg.initDataUnsafe?.user;
    if (u) { tgName=u.first_name||''; tgUser=u.username||''; }
  } catch(e){}
}

// --- ذخیره‌سازی ---
const store = {
  get(k,d){ try{ const v=localStorage.getItem('mg_'+k); return v===null?d:JSON.parse(v);}catch(e){return d} },
  set(k,v){ try{localStorage.setItem('mg_'+k,JSON.stringify(v))}catch(e){} }
};

// --- تنظیمات ---
let settings = Object.assign({theme:'auto',font:'m',sound:true,haptic:true,confetti:true,name:'',ava:0}, store.get('settings',{}));
function saveSettings(){ store.set('settings',settings); }
const AVA_COLORS=['linear-gradient(135deg,#8b5cf6,#ec4899)','linear-gradient(135deg,#06b6d4,#6366f1)','linear-gradient(135deg,#22c55e,#0d9488)','linear-gradient(135deg,#f59e0b,#ef4444)','linear-gradient(135deg,#ec4899,#8b5cf6)','linear-gradient(135deg,#64748b,#1e293b)'];
// آواتارهای آماده
const AVATARS=[
  {id:'av1',src:'images/av1.jpg',t:'پسر گیمر'},
  {id:'av2',src:'images/av2.jpg',t:'پسر ورزشکار'},
  {id:'av3',src:'images/av3.jpg',t:'دختر گیمر'},
  {id:'av4',src:'images/av4.jpg',t:'دختر فضانورد'},
  {id:'av5',src:'images/av5.jpg',t:'ربات'},
  {id:'av6',src:'images/av6.jpg',t:'گربه نینجا'},
  {id:'av7',src:'images/av7.jpg',t:'پسر فضانورد'},
  {id:'av8',src:'images/av8.jpg',t:'آدم فضایی'},
];
if(!settings.avatarId) settings.avatarId='av5';
function avatarSrc(){
  if(settings.avatarId==='custom') return store.get('avatar_custom',null)||AVATARS[4].src;
  return (AVATARS.find(a=>a.id===settings.avatarId)||AVATARS[4]).src;
}

function resolveTheme(){
  if(settings.theme!=='auto') return settings.theme;
  try{ return matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'; }catch(e){ return 'dark'; }
}
function applyTheme(){
  const t=resolveTheme();
  document.documentElement.dataset.theme=t;
  document.documentElement.dataset.font=settings.font;
  const hc = t==='light' ? '#e9edff' : '#0b0620';
  try{ tg?.setHeaderColor(hc); tg?.setBackgroundColor(hc); }catch(e){}
  const mt=document.querySelector('meta[name="theme-color"]'); if(mt) mt.content=hc;
}
try{ matchMedia('(prefers-color-scheme: light)').addEventListener('change',()=>{ if(settings.theme==='auto') applyTheme(); }); }catch(e){}
applyTheme();

// --- نام نمایشی ---
function displayName(){ return settings.name || tgName || 'مهمان'; }
function updateUserLabel(){
  const n=displayName();
  $('#user-label').textContent = tgUser? `سلام ${n} • @${tgUser}` : `سلام ${n}`;
}
updateUserLabel();

// --- لرزش ---
function haptic(type='light'){
  if(!settings.haptic) return;
  try{ tg?.HapticFeedback?.impactOccurred(type); }catch(e){}
  if(!tg && navigator.vibrate) navigator.vibrate(type==='heavy'?60:25);
}
function notify(type='success'){ if(!settings.haptic) return; try{ tg?.HapticFeedback?.notificationOccurred(type); }catch(e){} }

// --- ستاره‌ها ---
(function(){
  const box = $('#stars');
  for(let i=0;i<40;i++){ const s=document.createElement('i');
    s.style.cssText=`top:${Math.random()*100}%;left:${Math.random()*100}%;animation-delay:${Math.random()*3}s`; box.appendChild(s); }
})();

// --- صدا ---
let AC=null;
function beep(freq=600, dur=0.08, type='sine', vol=0.15){
  if(!settings.sound) return;
  try{
    AC = AC || new (window.AudioContext||window.webkitAudioContext)();
    if(AC.state==='suspended') AC.resume();
    const o=AC.createOscillator(), g=AC.createGain();
    o.type=type; o.frequency.value=freq; g.gain.value=vol;
    o.connect(g); g.connect(AC.destination); o.start();
    g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime+dur); o.stop(AC.currentTime+dur);
  }catch(e){}
}
const SFX = {
  tap(){beep(500,.06)}, flip(){beep(700,.07,'triangle')}, good(){beep(660,.09);setTimeout(()=>beep(880,.12),90)},
  bad(){beep(220,.2,'sawtooth',.08)}, win(){[523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,.15,'triangle'),i*130))},
  coin(){beep(1200,.08,'square',.06);setTimeout(()=>beep(1600,.12,'square',.05),80)}, dice(){[1,2,3].forEach(i=>setTimeout(()=>beep(300+Math.random()*400,.05),i*70))},
  move(){beep(440,.06,'triangle')}, capture(){beep(300,.12,'sawtooth',.1);setTimeout(()=>beep(520,.1),80)}, check(){beep(880,.15,'square',.08);setTimeout(()=>beep(880,.15,'square',.08),180)}
};

// --- سکه ---
let coins = store.get('coins', 100);
function renderCoins(){ $('#coins-val').textContent = coins.toLocaleString('fa-IR'); }
function addCoins(n, why=''){
  coins += n; store.set('coins', coins); renderCoins();
  const chip=$('#coins-chip'); chip.classList.remove('pop'); void chip.offsetWidth; chip.classList.add('pop');
  if(n>0){ const d=getDaily(); d.coins+=n; saveDaily(d); SFX.coin(); toast(`🪙 +${n} سکه${why?' • '+why:''}`); confetti(n>=30?120:50); if(window.refreshMissionsDot) refreshMissionsDot(); }
}
function getCoins(){ return coins; }
function spendCoins(n){
  if(coins<n) return false;
  coins-=n; store.set('coins',coins); renderCoins();
  const chip=$('#coins-chip'); chip.classList.remove('pop'); void chip.offsetWidth; chip.classList.add('pop');
  return true;
}
renderCoins();

// --- شمارنده روزانه ---
function todayStr(){ return new Date().toDateString(); }
function getDaily(){
  let d=store.get('dailyCount',{date:'',played:0,wins:0,coins:0,daily:0});
  if(d.date!==todayStr()){ d={date:todayStr(),played:0,wins:0,coins:0,daily:0}; store.set('dailyCount',d); }
  return d;
}
function saveDaily(d){ store.set('dailyCount',d); }

// --- آمار + سطح ---
let stats = store.get('stats', {played:0,wins:0});
function bumpStat(win=false){
  stats.played++; if(win) stats.wins++;
  store.set('stats', stats);
  const d=getDaily(); d.played++; if(win) d.wins++; saveDaily(d);
  renderStats(); if(window.refreshMissionsDot) refreshMissionsDot();
}
function xp(){ return stats.played*10 + stats.wins*25; }
function level(){ return 1+Math.floor(xp()/150); }
function levelProg(){ return Math.round((xp()%150)/150*100); }

/* ===== هاب: آیتم‌ها، اسکین‌ها، ارتقاء ===== */
function itemsGet(){ return store.get('items',[]); }
function itemsHas(id){ return itemsGet().includes(id); }
function itemsAdd(id){ const a=itemsGet(); if(!a.includes(id)){a.push(id);store.set('items',a);} }
function itemsDel(id){
  store.set('items',itemsGet().filter(x=>x!==id));
  const eq=store.get('equipped',{}); let ch=false;
  for(const s in eq) if(eq[s]===id){ delete eq[s]; ch=true; }
  if(ch) store.set('equipped',eq);
}
function equippedGet(slot){ return (store.get('equipped',{})[slot])||''; }
function equippedSet(slot,id){ const eq=store.get('equipped',{}); if(id)eq[slot]=id; else delete eq[slot]; store.set('equipped',eq); }
function upgLevel(id){ return store.get('upgrades',{})[id]||0; }
function upgSet(id,lv){ const u=store.get('upgrades',{}); u[id]=lv; store.set('upgrades',u); }
/* تاس شانس‌دار: هر سطح شانس، احتمال ۶ رو بالاتر می‌بره */
function luckyDie(game){
  const lv=upgLevel(game==='ludo'?'ludo_luck':'snakes_luck');
  if(Math.random()<1/6+lv*0.035) return 6;
  return 1+(Math.random()*5|0);
}
function renderStats(){
  $('#stat-played').textContent = stats.played.toLocaleString('fa-IR');
  $('#stat-wins').textContent = stats.wins.toLocaleString('fa-IR');
  const sl=$('#stat-level'); if(sl) sl.textContent=fa(level());
}
renderStats();

// --- تاریخچه ---
function logHistory(g, r, d){
  let h=store.get('history',[]);
  h.unshift({g,r,d,t:Date.now()});
  if(h.length>30) h=h.slice(0,30);
  store.set('history',h);
}
function timeAgo(ts){
  const s=(Date.now()-ts)/1000|0;
  if(s<60) return 'همین الان';
  const m=s/60|0; if(m<60) return fa(m)+' دقیقه پیش';
  const h=m/60|0; if(h<24) return fa(h)+' ساعت پیش';
  return fa(h/24|0)+' روز پیش';
}

// --- ماموریت‌ها ---
const MISSIONS=[
  {id:'m_play3',icon:'gamepad',title:'۳ بازی انجام بده',target:3,metric:'played',reward:30},
  {id:'m_win2',icon:'trophy',title:'۲ برد به دست بیار',target:2,metric:'wins',reward:50},
  {id:'m_coins',icon:'coin',title:'۱۵۰ سکه جمع کن',target:150,metric:'coins',reward:40},
  {id:'m_play6',icon:'flame',title:'۶ بازی انجام بده',target:6,metric:'played',reward:70},
  {id:'m_daily',icon:'calendar',title:'جایزه روزانه رو بگیر',target:1,metric:'daily',reward:20},
];
function claimedList(){ const c=store.get('mclaimed',{date:'',ids:[]}); return c.date===todayStr()?c.ids:[]; }
function claimMission(id){ let c=store.get('mclaimed',{date:'',ids:[]}); if(c.date!==todayStr())c={date:todayStr(),ids:[]}; c.ids.push(id); store.set('mclaimed',c); }

// --- تست ---
let toastT=null;
function toast(msg){
  const t=$('#toast'); t.textContent=msg; t.classList.add('show');
  clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),2200);
}

// --- بارش جشن ---
function confetti(n=80){
  if(!settings.confetti) return;
  const c=$('#confetti'), x=c.getContext('2d');
  c.width=innerWidth; c.height=innerHeight;
  const colors=['#8b5cf6','#22d3ee','#f472b6','#fbbf24','#34d399','#fff'];
  const ps=Array.from({length:n},()=>({x:Math.random()*c.width,y:-20-Math.random()*100,
    w:5+Math.random()*7,h:8+Math.random()*8,c:colors[Math.random()*colors.length|0],
    vy:2+Math.random()*4,vx:-2+Math.random()*4,r:Math.random()*Math.PI,vr:-.1+Math.random()*.2}));
  let f=0;
  (function tick(){
    x.clearRect(0,0,c.width,c.height);
    ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.w/2,-p.h/2,p.w,p.h);x.restore();});
    if(++f<140) requestAnimationFrame(tick); else x.clearRect(0,0,c.width,c.height);
  })();
}

// --- مودال پایان ---
function showEnd(win, title, desc, onRetry){
  const m=$('#end-modal');
  const badge=$('#end-badge');
  const cls = win===null?'draw':win?'win':'lose';
  badge.className='end-badge '+cls;
  badge.innerHTML = icon(win===null?'medal':win?'trophy':'sad', 46);
  $('#end-title').textContent=title; $('#end-desc').innerHTML=desc;
  const _rb=$('#end-retry'); if(_rb) _rb.innerHTML='🔁 دوباره';
  m.classList.add('show');
  $('#end-retry').onclick=()=>{ m.classList.remove('show'); haptic(); onRetry&&onRetry(); };
  $('#end-home').onclick=()=>{ m.classList.remove('show'); goHome(); };
  if(win){ SFX.win(); notify('success'); confetti(140); } else if(win===false){ SFX.bad(); notify('error'); } else { SFX.good(); }
}

// --- مودال تأیید ---
function askConfirm(title,desc,yesTxt,onYes){
  $('#confirm-title').textContent=title; $('#confirm-desc').innerHTML=desc;
  $('#confirm-yes').textContent=yesTxt||'بله';
  $('#confirm-modal').classList.add('show');
  $('#confirm-yes').onclick=()=>{$('#confirm-modal').classList.remove('show');onYes&&onYes();};
  $('#confirm-no').onclick=()=>$('#confirm-modal').classList.remove('show');
}

// --- راهنماها ---
const HELP = {
  memory:{t:'🃏 راهنمای کاشی (حافظه)', h:`
    🎯 <b>هدف:</b> همه جفت‌کاشی‌های هم‌شکل رو پیدا کن!<br>
    👆 روی یه کاشی بزن تا برگرده، بعد دومی رو حدس بزن.<br>
    ✅ اگه جفت باشن می‌مونن، وگرنه دوباره برمی‌گردن.<br>
    <span class="lv">😊 <b>آسان:</b> ۱۲ کاشی (۶ جفت)</span>
    <span class="lv">😐 <b>متوسط:</b> ۱۶ کاشی (۸ جفت)</span>
    <span class="lv">😈 <b>سخت:</b> ۲۴ کاشی (۱۲ جفت) 🧠</span>
    💡 با حرکت کمتر تموم کن تا سکه بیشتری بگیری!`},
  ludo:{t:'🎲 راهنمای منچ', h:`
    🎯 <b>هدف:</b> هر ۴ مهره‌ات رو زودتر از حریف به خونه برسون!<br>
    🎲 روی <b>تاس</b> بزن. برای بیرون اومدن از پایگاه باید <b>۶</b> بیاری.<br>
    👆 بعد از تاس، روی <b>مهره چشمک‌زن</b> بزن تا حرکت کنه.<br>
    💥 اگه روی خونه حریف فرود بیای، اونو می‌فرستی سر خونه اولش!<br>
    ⭐ خونه‌های <b>طلایی</b> امن هستن.<br>
    🎁 با ۶، زدن حریف و رسوندن مهره به خونه، پرتاب <b>جایزه</b> می‌گیری.<br>
    <span class="lv">😊 <b>آسان:</b> ۱ حریف ناشی 🤖</span>
    <span class="lv">😐 <b>متوسط:</b> ۲ حریف معمولی</span>
    <span class="lv">😈 <b>سخت:</b> ۳ حریف باهوش 🔥</span>`},
  sudoku:{t:'🔢 راهنمای سودوکو', h:`
    🎯 جدول ۹×۹ رو طوری پر کن که هر <b>سطر، ستون و مربع ۳×۳</b> اعداد ۱ تا ۹ رو داشته باشه.<br>
    👆 روی خونه خالی بزن، بعد از صفحه‌کلید عدد رو انتخاب کن.<br>
    ❤️ فقط <b>۳ جون</b> داری!<br>
    💡 <b>راهنمایی</b> یه خونه رو پر می‌کنه (۳ بار). 🩹 <b>پاک‌کن</b> عددت رو پاک می‌کنه.<br>
    <span class="lv">😊 <b>آسان:</b> خونه‌های پر بیشتر</span>
    <span class="lv">😐 <b>متوسط:</b> چالش متعادل</span>
    <span class="lv">😈 <b>سخت:</b> برای استادها! 🧠⚡</span>`},
  mines:{t:'💣 راهنمای مین‌روب', h:`
    🎯 همه خونه‌های امن رو باز کن بدون اینکه روی مین بری!<br>
    👆 <b>کاوش ⛏️:</b> بزن تا باز بشه. عدد = تعداد مین‌های دورش.<br>
    🚩 <b>پرچم:</b> جاهای مشکوک رو علامت بزن (یا لمس طولانی).<br>
    <span class="lv">😊 <b>آسان:</b> ۸×۸ با ۱۰ مین</span>
    <span class="lv">😐 <b>متوسط:</b> ۱۰×۱۰ با ۲۰ مین</span>
    <span class="lv">😈 <b>سخت:</b> ۱۲×۱۲ با ۳۵ مین ☠️</span>`},
  rps:{t:'✊ راهنمای سنگ کاغذ قیچی', h:`
    🎯 سنگ ✊ قیچی ✌️ رو می‌شکنه، قیچی کاغذ ✋ رو می‌بره، کاغذ سنگ رو می‌پیچونه!<br>
    🏆 هرکی زودتر به <b>امتیاز هدف</b> برسه برنده‌ست. 🔥 برد پیاپی = سکه بیشتر!<br>
    <span class="lv">😊 <b>آسان:</b> ربات ناشی — تا ۳ امتیاز</span>
    <span class="lv">😐 <b>متوسط:</b> ربات معمولی — تا ۵ امتیاز</span>
    <span class="lv">😈 <b>سخت:</b> رباتی که دستتو حدس می‌زنه! 🧠</span>`},
  chess:{t:'♟️ راهنمای شطرنج', h:`
    🎯 <b>هدف:</b> شاه حریف رو <b>کیش‌ومات</b> کن! 👑<br>
    👆 روی مهره‌ات بزن تا خونه‌های مجاز با <b>نقطه</b> نشون داده بشن، بعد مقصد رو بزن.<br>
    ♟️ سرباز به آخر صفحه برسه <b>ارتقا</b> پیدا می‌کنه (وزیر، رخ، فیل یا اسب).<br>
    🏰 <b>قلعه</b> (کوتاه و بلند) و <b>آنپاسان</b> هم پشتیبانی می‌شن!<br>
    🤝 پات، تکرار کمبود مهره و قانون ۵۰ حرکت = <b>مساوی</b>.<br>
    🏳️ اگه اوضاع خرابه، دکمه <b>تسلیم</b> هست!<br>
    <span class="lv">😊 <b>آسان:</b> ربات تازه‌کار، اشتباه زیاد می‌کنه</span>
    <span class="lv">😐 <b>متوسط:</b> ربات حسابگر، طمع‌کار! 🤑</span>
    <span class="lv">😈 <b>سخت:</b> ربات ۲ حرکت جلوتر رو می‌بینه 🧠⚡</span>`},
  quiz:{t:'❓ راهنمای کوییز', h:`
    🎯 <b>هدف:</b> به سوال‌ها درست جواب بده و امتیاز جمع کن!<br>
    👆 اول یه <b>دسته‌بندی</b> انتخاب کن: عمومی، علم، تاریخ، جغرافیا، ورزش یا تکنولوژی.<br>
    📚 هر دسته <b>۵۰۰ سوال</b> داره — هر دست سوال‌های جدید و تکراری‌نشده!<br>
    ⏱️ برای هر سوال <b>وقت محدود</b> داری — هرچی سریع‌تر جواب بدی امتیاز بیشتری می‌گیری!<br>
    🔥 جواب‌های درست پشت سر هم = <b>کمبو</b> و امتیاز چندبرابر.<br>
    ✂️ دکمه <b>۵۰-۵۰</b> دو گزینه غلط رو حذف می‌کنه (محدود!).<br>
    <span class="lv">😊 <b>آسان:</b> ۶ سوال • ۲۰ ثانیه • ۲ جون کمکی</span>
    <span class="lv">😐 <b>متوسط:</b> ۸ سوال • ۱۵ ثانیه • ۱ جون کمکی</span>
    <span class="lv">😈 <b>سخت:</b> ۱۰ سوال • ۱۰ ثانیه • بدون کمکی! 🧠</span>
    💡 بالای ۶۰٪ درست بزنی بردی و سکه می‌گیری!`},
  dino:{t:'🦕 راهنمای دایی ناصر', h:`
    🎯 <b>هدف:</b> دایی ناصر رو تا جایی که می‌تونی جلو ببر بدون اینکه به چیزی بخوره!<br>
    👆 <b>بپر:</b> روی صفحه بزن، دکمه پرش، یا Space.<br>
    ⬇️ <b>خم شو:</b> دکمه خم شدن رو نگه دار (برای رد شدن از زیر پرنده‌ها!).<br>
    🌵 از روی <b>کاکتوس‌ها</b> بپر و از زیر <b>کرکس‌ها</b> رد شو.<br>
    🌅 هرچی جلوتر بری <b>سریع‌تر</b> می‌شه و هوا از روز به غروب و شب می‌ره!<br>
    <span class="lv">😊 <b>آسان:</b> شروع آروم، پرنده کمتر</span>
    <span class="lv">😐 <b>متوسط:</b> سرعت نرمال</span>
    <span class="lv">😈 <b>سخت:</b> وحشی! سریع و پرنده زیاد 🔥</span>
    💡 هر ۱۰۰ متر رکورد جدید = جشن و امتیاز!`},
  g2048:{t:'🔢 راهنمای 2048', h:`
    🎯 <b>هدف:</b> کاشی‌ها رو به هم بچسبون تا به عدد هدف برسی!<br>
    👆 روی صفحه <b>سوایپ</b> کن (بالا/پایین/چپ/راست) یا از دکمه‌های جهت استفاده کن.<br>
    ➕ دو کاشی هم‌عدد که به هم بخورن <b>جمع</b> می‌شن: ۲+۲=۴، ۴+۴=۸ ...<br>
    ↩️ دکمه <b>برگرد</b> حرکت آخرت رو برمی‌گردونه (محدود!).<br>
    ☠️ اگه صفحه پر بشه و حرکتی نمونه، بازی تمومه!<br>
    <span class="lv">😊 <b>آسان:</b> هدف ۵۱۲ • ۵ برگشت</span>
    <span class="lv">😐 <b>متوسط:</b> هدف ۱۰۲۴ • ۳ برگشت</span>
    <span class="lv">😈 <b>سخت:</b> هدف ۲۰۴۸ • فقط ۱ برگشت! 🧠</span>
    💡 <b>ترفند استادها:</b> بزرگ‌ترین کاشی رو یه گوشه نگه دار!`},
  doz:{t:'❌ راهنمای دوز', h:`
    🎯 <b>هدف:</b> اول سه‌تا ❌ پشت سر هم (افقی، عمودی یا قطری) بچین!<br>
    🏆 بازی <b>۳ رانده</b> — هرکی ۲ راند ببره، قهرمان مسابقه‌ست!<br>
    <span class="lv">😊 <b>آسان:</b> ربات گاهی سوتی می‌ده</span>
    <span class="lv">😐 <b>متوسط:</b> حمله و دفاع می‌کنه</span>
    <span class="lv">😈 <b>سخت:</b> مینی‌مکس! عملاً شکست‌ناپذیر 🧠</span>
    💡 همیشه اول <b>وسط</b> رو بگیر — قوی‌ترین خونه‌ست!`},
  candy:{t:'🍬 راهنمای آبنبات', h:`
    🎯 <b>هدف:</b> به امتیاز هدف برس، قبل از اینکه حرکت‌هات تموم بشن!<br>
    👆 آبنبات‌ها رو <b>سوایپ</b> کن (یا اول یکیش، بعد بغلیش رو بزن) تا ۳تا یا بیشتر هم‌رنگ بشن و بترکن!<br>
    ⚡ <b>۴تایی = بمب خطی</b> 💥 که کل سطر و ستون رو می‌ترکونه<br>
    🌈 <b>۵تایی = هم‌زن رنگ!</b> باهاش یه آبنبات رو عوض کن تا همه هم‌رنگاش بترکن!<br>
    🔥 واکنش زنجیره‌ای = امتیاز چندبرابر!<br>
    <span class="lv">😊 <b>آسان:</b> هدف ۲۰۰۰ امتیاز • ۲۵ حرکت</span>
    <span class="lv">😐 <b>متوسط:</b> هدف ۳۵۰۰ • ۲۲ حرکت</span>
    <span class="lv">😈 <b>سخت:</b> هدف ۵۵۰۰ • فقط ۲۰ حرکت!</span>
    💡 اگه حرکتی نمی‌بینی، دکمه <b>راهنما</b> ✨ رو بزن!`},
  snakes:{t:'🐍 راهنمای مار و پله', h:`
    🎯 <b>هدف:</b> اول به خونه <b>۱۰۰</b> برس!<br>
    🎲 تاس بنداز و جلو برو — <b>۶ بیاری یه پرتاب اضافه</b> داری!<br>
    🪜 <b>نردبون = پرواز به بالا!</b> 🐍 <b>مار = سقوط به پایین!</b><br>
    ⚠️ برای برد باید <b>دقیقاً روی ۱۰۰</b> وایسی، وگرنه سرجات می‌مونی.<br>
    <span class="lv">😊 <b>آسان:</b> ۱ حریف رباتی</span>
    <span class="lv">😐 <b>متوسط:</b> ۲ حریف</span>
    <span class="lv">😈 <b>سخت:</b> ۳ حریف! 🐍🐍🐍</span>
    💡 نردبون خونه ۲۸ تا ۸۴ می‌رسونه — گنج واقعیه! 🪜`},
  flags:{t:'🚩 راهنمای حدس پرچم', h:`
    🎯 <b>هدف:</b> اسم کشور صاحب پرچم رو بنویس! فارسی یا انگلیسی، فرقی نداره ⌨️<br>
    😊 دو پرچم اول <b>آسونه</b>، از سومی به بعد <b>سخت</b> می‌شه! 😈<br>
    ❌ فقط <b>یه اشتباه = باخت!</b> پس مطمئن شو بعد ثبت کن!<br>
    💡 اگه نشناختی، دکمه <b>لامپ</b> رو بزن: حرف اول ۵۰ سکه، حرف دوم ۱۰۰، حرف سوم ۱۵۰!<br>
    🔥 هر ۵ پرچم پشت سر هم = <b>۳۰ سکه جایزه</b>!<br>
    ⏱️ برای هر پرچم وقت محدود داری — عجله کن!`},
  abdolah:{t:'🐱 راهنمای حاج عبدالله', h:`
    😻 <b>حاج عبدالله</b> گربه توئه! باید بزرگش کنی: غذا بده، باهاش بازی کن، بذار بخوابه و حمومش کن!<br>
    📊 چهار تا نیاز داره: <b>🍗 سیری، 🎮 شادی، ⚡ انرژی، 🛁 تمیزی</b> — اگه خالی بشن حاجی ناراحت می‌شه!<br>
    🍖 دکمه غذا چرخه‌ایه: مرغ، ماهی، شیر... و هر چند وقت یه <b>کباب ویژه</b> (۱۵ سکه)!<br>
    🐭 دکمه بازی = شکار موش! موش‌ها رو سریع بگیر تا شادی حاجی بره بالا!<br>
    ❤️ روی خود حاجی بزن تا نازش کنی و خرخر کنه!<br>
    📿 با مراقبت، امتیاز می‌گیری و حاجی بزرگ می‌شه: گردنبند، سبیل، عینک، کلاه و تسبیح! 👑<br>
    💾 پیشرفتت ذخیره می‌شه — ولی اگه چند روز سر نزنی، دلتنگت می‌شه! 😿<br>
    🤒 حاجی ممکنه مریض بشه! با دکمه <b>دارو</b> 💊 (۲۵ سکه) خوبش کن.<br>
    🫧 حموم واقعی: اول بهش <b>کف</b> بزن (۶ بار بزنش!) بعد <b>آب بگیر</b> 🚿<br>
    🎁 با <b>کادو</b> (۲۰ سکه) حاجی رو ذوق‌زده کن!<br>
    🛍️ از <b>فروشگاه</b> میوه، گوشت و <b>شامپو</b> 🧴 بخر (از سکه‌هات کم می‌شه)!<br>
    🍗 دکمه غذا از انبارت خرج می‌کنه؛ بدون شامپو حموم فقط ۸۵٪ تمیز می‌کنه!`},
  tower:{t:'🏗️ راهنمای تاور استک', h:`
    🎯 <b>هدف:</b> بلندترین برج رو بساز! بلوک متحرک رو دقیق بنداز روی قبلی.<br>
    👆 هرجا بزنی (یا Space) بلوک میفته — اضافه‌هاش می‌ریزه پایین!<br>
    ✨ اگه <b>دقیق</b> بندازی کمبو می‌گیری و بلوک باریک نمی‌شه! 🔥<br>
    🌌 هرچی بالاتر بری آسمون عوض می‌شه: شب، طلوع، روز، غروب، فضا! ☄️<br>
    ☠️ اگه کامل خطا بری، بلوک میفته و بازی تمومه!<br>
    🏆 ۱۲ طبقه به بالا = برد حرفه‌ای!`},
  iceslide:{t:'🧊 راهنمای آیس اسلاید', h:`
    🎯 <b>هدف:</b> پنگوئن 🐧 رو با سر خوردن روی یخ به ماهی 🐟 برسون!<br>
    👆 <b>سوایپ</b> کن (یا دکمه‌های جهت) — پنگوئن تا به دیوار نخوره واینیسته!<br>
    ⭐ هر مرحله یه <b>پار</b> داره: ستاره‌ای که می‌گیری رو زنده می‌بینی!<br>
    ↩️ اشتباه کردی؟ دکمه <b>برگرد</b> هست! بعد از برد دکمه <b>مرحله بعد</b> ⏭️ میاد!<br>
    🗺️ <b>۵۰ مرحله</b> با ۴ تم (یخ، شفق، آب‌نبات، اقیانوس) — پیشرفتت ذخیره می‌شه!`},
  escape:{t:'🚗 راهنمای اسکیپ', h:`
    🎯 <b>هدف:</b> ماشین <b style="color:#f87171">قرمز ⭐</b> رو به <b>خروجی</b> سمت راست برسون!<br>
    👆 ماشین‌ها رو با انگشت <b>بکش</b> — هر کدوم فقط تو مسیر خودش (افقی یا عمودی) حرکت می‌کنه.<br>
    ⭐ هر مرحله یه <b>پار</b> داره: با حرکت کمتر تموم کن تا ۳ ستاره بگیری!<br>
    ↩️ دکمه <b>برگرد</b> حرکت آخر رو برمی‌گردونه. 🔁 <b>از اول</b> مرحله رو ریست می‌کنه.<br>
    🗺️ <b>۵۰ مرحله</b> از آسون تا جهنمی — پیشرفتت ذخیره می‌شه!`},
  ballrun:{t:'🟣 راهنمای بال‌ران', h:`
    🎯 <b>هدف:</b> توپ نئونی رو زنده نگه دار و رکورد بزن!<br>
    👆 <b>انگشتت رو بکش</b> (یا ← →) تا توپ چپ و راست بره.<br>
    🪙 سکه جمع کن! ❤️ جون، 🛡️ سپر و ⭐ امتیاز دوبرابر هم میاد.<br>
    ❤️ فقط <b>۳ جون</b> داری — هرچی جلوتر بری سرعت و موانع بیشتر می‌شن!<br>
    🏆 <b>۶۰۰ امتیاز</b> به بالا = برد!`}
};
/* Pretty 3D dice face — 9 <i> pips, .on = filled */
function diceFace(v,cls){
  const P={1:[4],2:[2,6],3:[2,4,6],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
  v=Math.min(6,Math.max(1,v|0||1));
  let d=''; for(let i=0;i<9;i++) d+=`<i class="${P[v].includes(i)?'on':''}"></i>`;
  const skin=equippedGet('dice');
  return `<span class="pdice${skin?' '+skin:''}${cls?' '+cls:''}">${d}</span>`;
}
/* پرتاب نرم تاس: قاب ثابت می‌لرزه، خال‌ها با ریتم کندشونده عوض می‌شن */
function animateDice(el,value,done){
  if(!el||el._rolling) return;
  el._rolling=true;
  const seq=[60,65,70,80,95,110,135,170,220];
  const total=seq.reduce((a,b)=>a+b,0);
  el.style.setProperty('--roll-dur',total+'ms');
  el.classList.remove('pop','ready');
  void el.offsetWidth;
  el.classList.add('rolling');
  SFX.dice(); haptic('medium');
  let i=0,last=0;
  const tick=()=>{
    if(!el.isConnected){ el._rolling=false; return; }
    if(i<seq.length){
      let v; do{ v=1+Math.random()*6|0; }while(v===last);
      last=v; el.innerHTML=diceFace(v);
      setTimeout(tick,seq[i++]);
    } else {
      el.innerHTML=diceFace(value);
      el.classList.remove('rolling');
      void el.offsetWidth;
      el.classList.add('pop');
      setTimeout(()=>{ if(el.isConnected) el.classList.remove('pop'); },380);
      el._rolling=false;
      if(done) done();
    }
  };
  setTimeout(tick,seq[i++]);
}
function openHelp(game){
  const h=HELP[game]; if(!h) return;
  const HICONS={memory:'cards',ludo:'dice',sudoku:'grid',mines:'bomb',rps:'scissors',chess:'crown',quiz:'quiz',dino:'dino',g2048:'tiles',doz:'doz',candy:'candy',snakes:'snake',flags:'flag',abdolah:'cat',tower:'tower',iceslide:'snow',escape:'car',ballrun:'ball'};
  $('#help-title').innerHTML=icon(HICONS[game]||'info',22)+' '+h.t.split(' ').slice(1).join(' ');
  $('#help-body').innerHTML=h.h;
  $('#help-modal').classList.add('show'); SFX.tap();
}

