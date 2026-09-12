/* ===== کوییز ===== */
const QuizGame = (()=>{
  const CATS=[
    {id:'gen',name:'اطلاعات عمومی',ic:'auto'},
    {id:'sci',name:'علم',ic:'bulb'},
    {id:'his',name:'تاریخ',ic:'history'},
    {id:'geo',name:'جغرافیا',ic:'globe'},
    {id:'spo',name:'ورزش',ic:'trophy'},
    {id:'tec',name:'تکنولوژی',ic:'bot'},
  ];
  // [سوال، [گزینه‌ها]، ایندکس درست]
  const Q={
  gen:[
    ['پایتخت ایران کجاست؟',['تهران','اصفهان','مشهد','شیراز'],0],
    ['بزرگ‌ترین اقیانوس جهان؟',['آرام','اطلس','هند','منجمد شمالی'],0],
    ['منظومه شمسی چند سیاره دارد؟',['۸','۷','۹','۱۰'],0],
    ['کدام حیوان پستاندار است؟',['دلفین','کوسه','اختاپوس','تمساح'],0],
    ['کدام رنگ در پرچم ایران نیست؟',['آبی','سبز','سفید','قرمز'],0],
    ['واحد پول ژاپن چیست؟',['ین','یوان','وون','دلار'],0],
    ['بلندترین کوه جهان؟',['اورست','دماوند','کلیمانجارو','آرارات'],0],
    ['دانه‌های کدام میوه بیرون آن است؟',['توت‌فرنگی','سیب','هلو','موز'],0],
    ['الفبای فارسی چند حرف دارد؟',['۳۲','۲۸','۳۰','۳۳'],0],
    ['پر‌جمعیت‌ترین کشور جهان؟',['هند','چین','آمریکا','اندونزی'],0],
  ],
  sci:[
    ['فرمول شیمیایی آب؟',['H2O','CO2','O2','NaCl'],0],
    ['به کدام سیاره «سیاره سرخ» می‌گویند؟',['مریخ','زهره','مشتری','عطارد'],0],
    ['گیاهان برای فتوسنتز کدام گاز را جذب می‌کنند؟',['دی‌اکسید کربن','اکسیژن','نیتروژن','هیدروژن'],0],
    ['واحد اندازه‌گیری نیرو؟',['نیوتن','وات','ژول','ولت'],0],
    ['کدام ذره بار منفی دارد؟',['الکترون','پروتون','نوترون','فوتون'],0],
    ['قلب انسان چند حفره دارد؟',['۴','۲','۳','۵'],0],
    ['نزدیک‌ترین ستاره به زمین؟',['خورشید','پروکسیما','مشتری','ماه'],0],
    ['دمای جوش آب در سطح دریا؟',['۱۰۰ درجه','۹۰ درجه','۱۲۰ درجه','۸۰ درجه'],0],
    ['کدام ویتامین با نور خورشید ساخته می‌شود؟',['D','C','A','B12'],0],
    ['سرعت نور تقریباً چقدر است؟',['۳۰۰ هزار کیلومتر بر ثانیه','۳۰ هزار کیلومتر بر ثانیه','۳ میلیون کیلومتر بر ثانیه','۱۵۰ هزار کیلومتر بر ثانیه'],0],
  ],
  his:[
    ['بنیان‌گذار شاهنشاهی هخامنشی؟',['کوروش بزرگ','داریوش','خشایارشا','اسکندر'],0],
    ['جنگ جهانی دوم چه سالی تمام شد؟',['۱۹۴۵','۱۹۳۹','۱۹۱۸','۱۹۵۰'],0],
    ['اولین انسانی که روی ماه قدم زد؟',['نیل آرمسترانگ','باز آلدرین','یوری گاگارین','مایکل کالینز'],0],
    ['پایتخت امپراتوری روم باستان؟',['رم','آتن','قسطنطنیه','اسکندریه'],0],
    ['تخت‌جمشید را کدام سلسله ساخت؟',['هخامنشیان','ساسانیان','اشکانیان','صفویان'],0],
    ['انقلاب اسلامی ایران در چه سالی بود؟',['۱۳۵۷','۱۳۴۲','۱۳۶۰','۱۳۲۰'],0],
    ['کاشف قاره آمریکا؟',['کریستف کلمب','ماژلان','واسکو دوگاما','کاپیتان کوک'],0],
    ['اهرام ثلاثه در کدام کشور است؟',['مصر','مکزیک','پرو','سودان'],0],
    ['تمدن مصر باستان کنار کدام رود شکل گرفت؟',['نیل','فرات','دجله','سند'],0],
    ['اولین المپیک مدرن کجا برگزار شد؟',['آتن','پاریس','لندن','رم'],0],
  ],
  geo:[
    ['بزرگ‌ترین کشور جهان از نظر مساحت؟',['روسیه','کانادا','چین','آمریکا'],0],
    ['پایتخت فرانسه؟',['پاریس','لیون','مارسی','نیس'],0],
    ['بزرگ‌ترین صحرای گرم جهان؟',['صحرا','گبی','کالاهاری','تکله‌مکان'],0],
    ['پایتخت استرالیا؟',['کانبرا','سیدنی','ملبورن','پرث'],0],
    ['کدام کشور جزیره نیست؟',['برزیل','ژاپن','ماداگاسکار','انگلستان'],0],
    ['بلندترین قله ایران؟',['دماوند','علم‌کوه','سبلان','تفتان'],0],
    ['تنگه هرمز بین ایران و کدام کشور است؟',['عمان','امارات','قطر','بحرین'],0],
    ['کدام شهر روی دو قاره قرار دارد؟',['استانبول','مسکو','قاهره','مادرید'],0],
    ['طولانی‌ترین رود جهان؟',['نیل','آمازون','یانگ‌تسه','می‌سی‌سی‌پی'],0],
    ['کدام دریاچه در ایران است؟',['ارومیه','وان','بایکال','مرده'],0],
  ],
  spo:[
    ['هر تیم فوتبال چند بازیکن دارد؟',['۱۱','۱۰','۹','۱۲'],0],
    ['المپیک هر چند سال برگزار می‌شود؟',['۴','۲','۳','۵'],0],
    ['هر تیم والیبال چند بازیکن دارد؟',['۶','۵','۷','۴'],0],
    ['کدام تیم بیشترین قهرمانی جام جهانی را دارد؟',['برزیل','آلمان','ایتالیا','آرژانتین'],0],
    ['هر تیم بسکتبال چند بازیکن دارد؟',['۵','۶','۴','۷'],0],
    ['مسافت دوی ماراتن؟',['۴۲ کیلومتر','۳۰ کیلومتر','۵۰ کیلومتر','۲۵ کیلومتر'],0],
    ['هر بازیکن شطرنج چند مهره دارد؟',['۱۶','۱۲','۱۴','۲۰'],0],
    ['کدام ورزش بدون راکت انجام می‌شود؟',['فوتبال','تنیس','بدمینتون','اسکواش'],0],
    ['دروازه‌بان فقط در کدام ناحیه می‌تواند توپ را با دست بگیرد؟',['محوطه جریمه','میانه میدان','محوطه دروازه','هر جای زمین'],0],
    ['پرافتخارترین رشته ایران در المپیک؟',['کشتی','وزنه‌برداری','تکواندو','جودو'],0],
  ],
  tec:[
    ['بنیان‌گذار مایکروسافت؟',['بیل گیتس','استیو جابز','ایلان ماسک','مارک زاکربرگ'],0],
    ['HTML برای چه کاری استفاده می‌شود؟',['طراحی صفحات وب','ساخت بازی سه‌بعدی','هوش مصنوعی','امنیت شبکه'],0],
    ['کدام واحد از مگابایت کوچک‌تر است؟',['کیلوبایت','گیگابایت','ترابایت','پتابایت'],0],
    ['سیستم‌عامل موبایل گوگل؟',['اندروید','iOS','ویندوز','لینوکس'],0],
    ['RAM چه نوع حافظه‌ای است؟',['موقت','دائمی','خارجی','نوری'],0],
    ['علامت @ در ایمیل چه نامیده می‌شود؟',['ات‌ساین','هشتگ','دالر','درصد'],0],
    ['وای‌فای چه کار می‌کند؟',['اتصال بی‌سیم به اینترنت','شارژ گوشی','افزایش سرعت پردازنده','خنک کردن گوشی'],0],
    ['کدام شرکت آیفون می‌سازد؟',['اپل','سامسونگ','شیائومی','گوگل'],0],
    ['مغز کامپیوتر کدام قطعه است؟',['CPU','RAM','هارد','کارت گرافیک'],0],
    ['کدام مرورگر ساخت گوگل است؟',['کروم','فایرفاکس','سافاری','اج'],0],
  ]};
  const CONF={easy:{n:6,time:20,help:2},medium:{n:8,time:15,help:1},hard:{n:10,time:8,help:0}};
  const LET=['الف','ب','ج','د'];
  let diff='medium',deck=[],idx=0,score=0,streak=0,correct=0,helps=0,left=0,timer=null,lock=false,over=false,catId='gen',catName='',qMax=15;

  const sh=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;};

  function render(d){
    diff=d; stop(); over=false;
    const box=$('#game-container');
    box.innerHTML=`<div class="panel">
      <div class="quiz-head">${icon('quiz',22)} <b>یه دسته انتخاب کن!</b></div>
      <div class="quiz-cats">${CATS.map(c=>{
        const best=store.get('best_quiz_'+c.id,0);
        return `<button class="qcat" data-c="${c.id}"><span class="qc-ic">${icon(c.ic,26)}</span>
          <b>${c.name}</b><small>${fa(Q[c.id].length)} سوال${best?` • رکورد ${fa(best)}`:''}</small></button>`;
      }).join('')}</div></div>`;
    box.querySelectorAll('.qcat').forEach(b=>b.onclick=()=>{haptic('medium');SFX.tap();start(b.dataset.c);});
  }
  function start(cid){
    catId=cid; catName=(CATS.find(c=>c.id===cid)||{}).name||'';
    const c=CONF[diff]||CONF.medium;
    const bank=sh(Q[cid]).slice(0,Math.min(c.n,Q[cid].length));
    deck=bank.map(([q,opts,ci])=>{
      const order=sh([0,1,2,3]);
      return {q, opts:order.map(i=>opts[i]), c:order.indexOf(ci)};
    });
    idx=0;score=0;streak=0;correct=0;helps=c.help;over=false;
    renderQ();
  }
  function renderQ(){
    stopTimer();
    const c=CONF[diff], q=deck[idx];
    qMax=c.time+upgLevel('quiz_time')*2;
    left=qMax;
    const box=$('#game-container');
    box.innerHTML=`<div class="panel">
      <div class="quiz-top"><small>سوال ${fa(idx+1)} از ${fa(deck.length)} • ${catName}</small>
        <button class="btn btn-ghost" id="q-quit" style="padding:6px 12px;font-size:11px">انصراف</button></div>
      <div class="quiz-prog"><i style="width:${idx/deck.length*100}%"></i></div>
      <div class="hud">
        <div class="h"><b id="q-score">${fa(score)}</b><small>${icon('star',12)} امتیاز</small></div>
        <div class="h"><b id="q-streak">${icon('flame',15)} ${fa(streak)}</b><small>کمبو</small></div>
        <div class="h"><b id="q-time">${fa(left)}</b><small>${icon('clock',12)} ثانیه</small></div>
      </div>
      <div class="quiz-timer"><i id="q-bar" style="width:100%"></i></div>
      <div class="quiz-q">${q.q}</div>
      <div class="quiz-opts">${q.opts.map((o,i)=>`<button class="qopt" data-i="${i}"><span class="qo-let">${LET[i]}</span><span>${o}</span></button>`).join('')}</div>
      <div class="row-btns">
        <button class="btn btn-gold" id="q-5050" ${helps>0?'':'disabled'}>${icon('check',15)} حذف ۲ گزینه (${fa(helps)})</button>
      </div></div>`;
    lock=false;
    box.querySelectorAll('.qopt').forEach(b=>b.onclick=()=>answer(+b.dataset.i));
    $('#q-quit').onclick=()=>{haptic();render(diff);};
    $('#q-5050').onclick=use5050;
    timer=setInterval(()=>{
      left-=0.1;
      const bar=$('#q-bar'), tx=$('#q-time');
      if(!bar){stopTimer();return;}
      bar.style.width=Math.max(0,left/qMax*100)+'%';
      bar.classList.toggle('low',left<5);
      if(tx) tx.textContent=fa(Math.max(0,Math.ceil(left)));
      if(left<=0){ stopTimer(); answer(-1); }
    },100);
  }
  function use5050(){
    if(lock||helps<=0) return;
    helps--; SFX.flip(); haptic('medium');
    const q=deck[idx], wrongs=[0,1,2,3].filter(i=>i!==q.c);
    sh(wrongs).slice(0,2).forEach(i=>{
      const b=document.querySelector(`.qopt[data-i="${i}"]`);
      if(b){b.disabled=true;b.classList.add('off');}
    });
    const btn=$('#q-5050');
    btn.innerHTML=`${icon('check',15)} حذف ۲ گزینه (${fa(helps)})`;
    if(!helps) btn.disabled=true;
  }
  function answer(i){
    if(lock||over) return;
    lock=true; stopTimer();
    const q=deck[idx], ok=(i===q.c);
    q.u=i;
    document.querySelectorAll('.qopt').forEach(b=>{b.disabled=true;});
    const cb=document.querySelector(`.qopt[data-i="${q.c}"]`);
    if(cb) cb.classList.add('good');
    if(ok){
      correct++; streak++;
      const pts=100+Math.max(0,Math.ceil(left))*5+streak*25;
      score+=pts;
      SFX.good(); haptic('medium'); confetti(25);
      toast(`آفرین! +${fa(pts)}`);
    } else {
      streak=0; SFX.bad(); haptic('heavy'); notify('error');
      if(i>=0){ const wb=document.querySelector(`.qopt[data-i="${i}"]`); if(wb) wb.classList.add('bad'); }
      else toast('وقت تموم شد!');
    }
    const sc=$('#q-score'); if(sc) sc.textContent=fa(score);
    const st=$('#q-streak'); if(st) st.innerHTML=`${icon('flame',15)} ${fa(streak)}`;
    setTimeout(()=>{ if(over) return; idx++; idx<deck.length?renderQ():end(); },1100);
  }
  function end(){
    over=true; stopTimer();
    const won=correct/deck.length>=0.6;
    const box=$('#game-container');
    box.innerHTML=`<div class="panel">
      <div class="quiz-head">${icon('check',22)} <b>مرور جواب‌ها</b></div>
      <div class="hud">
        <div class="h"><b>${fa(score)}</b><small>${icon('star',12)} امتیاز</small></div>
        <div class="h"><b>${fa(correct)}/${fa(deck.length)}</b><small>${icon('check',12)} درست</small></div>
        <div class="h"><b>${fa(Math.round(correct/deck.length*100))}٪</b><small>${icon('chart',12)} درصد</small></div>
      </div>
      <div class="quiz-review">${deck.map((q,i)=>{
        const ok=q.u===q.c;
        return `<div class="qr-item ${ok?'ok':'no'}"><b>${fa(i+1)}. ${q.q}</b>
          <small>جواب تو: ${q.u<0?'— (وقت تموم شد)':q.opts[q.u]}</small>
          ${ok?'':`<small class="qr-true">جواب درست: ${q.opts[q.c]}</small>`}</div>`;
      }).join('')}</div>
      <div class="row-btns"><button class="btn btn-primary" id="q-finish">${icon('trophy',16)} مشاهده نتیجه</button></div>
    </div>`;
    $('#q-finish').onclick=()=>finish(won);
  }
  function finish(won){
    bumpStat(won);
    logHistory('quiz',won?'win':'lose',`${catName} • ${fa(correct)}/${fa(deck.length)}`);
    const prevBest=store.get('best_quiz_'+catId,0);
    if(score>prevBest) store.set('best_quiz_'+catId,score);
    const gPrev=store.get('best_quiz',0);
    if(score>gPrev){ store.set('best_quiz',score); store.set('best_quiz_t',fa(score)+' امتیاز'); }
    if(won){
      const reward=Math.min(130,25+Math.floor(score/12)+(diff==='hard'?20:diff==='medium'?10:0));
      addCoins(reward,'کوییز');
      showEnd(true,'نابغه! 🧠',`${catName}: <b>${fa(correct)} از ${fa(deck.length)}</b> درست!<br>امتیاز: <b>${fa(score)}</b><br>🪙 <b>${fa(reward)} سکه</b> گرفتی!`,()=>render(diff));
    } else {
      addCoins(8,'تلاش در کوییز');
      showEnd(false,'نشد این دست! 😢',`${catName}: فقط <b>${fa(correct)} از ${fa(deck.length)}</b> درست بود.<br>بالای ۶۰٪ بزن تا ببری! 💪`,()=>render(diff));
    }
  }
  function stopTimer(){ clearInterval(timer); timer=null; }
  function stop(){ over=true; stopTimer(); }
  return { render, stop, Qs:()=>Q, addBank(m){ for(const k in m) if(Q[k]) Q[k].push(...m[k]); } };
})();
