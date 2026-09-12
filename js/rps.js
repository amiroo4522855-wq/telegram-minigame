/* ===== سنگ کاغذ قیچی ===== */
const RpsGame = (()=>{
  const E={rock:'✊',paper:'✋',scissors:'✌️'};
  const N={rock:'سنگ',paper:'کاغذ',scissors:'قیچی'};
  const WIN={rock:'scissors',paper:'rock',scissors:'paper'}; // چیزی که می‌بره
  const TARGET={easy:3,medium:5,hard:5};
  let ps=0,bs=0,diff='medium',over=false,hist=[],streak=0,best=0;

  function render(d){
    diff=d; ps=0;bs=0;over=false;hist=[];streak=0;
    best=store.get('rps_streak',0);
    const t=TARGET[d]||5;
    $('#game-container').innerHTML=`
      <div class="panel">
        <div class="rps-score">
          <div><span class="who">${icon('user',14)} تو</span><b id="r-ps" style="color:#34d399">۰</b><small style="color:var(--mut);font-size:10px">هدف: ${fa(t)}</small></div>
          <div><span class="who">${icon('bot',14)} ربات</span><b id="r-bs" style="color:#f87171">۰</b><small style="color:var(--mut);font-size:10px">رکورد پیاپی: ${fa(best)}</small></div>
        </div>
        <div class="rps-arena">
          <div class="rps-hand"><span class="emoji" id="r-p">✊</span><small>تو</small></div>
          <div class="vs">VS</div>
          <div class="rps-hand"><span class="emoji" id="r-b">✊</span><small>ربات</small></div>
        </div>
        <div class="rps-result" id="r-msg">انتخاب کن! 👇</div>
        <div class="rps-choices">
          <button data-m="rock">✊<small>سنگ</small></button>
          <button data-m="paper">✋<small>کاغذ</small></button>
          <button data-m="scissors">✌️<small>قیچی</small></button>
        </div>
        <div class="row-btns"><button class="btn btn-primary" id="r-new">${icon('refresh',16)} از اول</button></div>
      </div>`;
    $$('.rps-choices button').forEach(b=>b.onclick=()=>play(b.dataset.m));
    $('#r-new').onclick=()=>{haptic();render(diff);};
  }
  function botMove(){
    const opts=['rock','paper','scissors'];
    if(diff==='easy'){
      // ناشی: ۴۰٪ شانسی، ۶۰٪ حرکتی که به آخرین حرکت ما می‌بازه!
      if(hist.length&&Math.random()<.6){
        const last=hist[hist.length-1].p;
        return WIN[WIN[last]]; // چیزی که last می‌بردش → ما می‌بریم
      }
      return opts[Math.random()*3|0];
    }
    if(diff==='medium') return opts[Math.random()*3|0];
    // سخت: الگو رو حدس می‌زنه
    if(hist.length>=2){
      const last=hist[hist.length-1].p;
      // اگه بازیکن تکرار کرده، حدس بزن دوباره تکرار می‌کنه و ضدشو بزن
      if(hist[hist.length-1].p===hist[hist.length-2].p && Math.random()<.7){
        return counter(last);
      }
      // اگه بازیکن بعد از باخت عوض می‌کنه...
      const lastRes=hist[hist.length-1].res;
      if(lastRes==='lose'&&Math.random()<.55){
        const others=opts.filter(o=>o!==last);
        return counter(others[Math.random()*2|0]);
      }
    }
    // کمی هم ضدِ محتمل‌ترین حرکت
    if(hist.length>=4&&Math.random()<.4){
      const freq={rock:0,paper:0,scissors:0};
      hist.slice(-5).forEach(h=>freq[h.p]++);
      const fav=Object.entries(freq).sort((a,b)=>b[1]-a[1])[0][0];
      return counter(fav);
    }
    return opts[Math.random()*3|0];
  }
  function counter(m){ return Object.keys(WIN).find(k=>WIN[k]===m); }
  function play(p){
    if(over) return;
    const b=botMove();
    const pe=$('#r-p'),be=$('#r-b'),msg=$('#r-msg');
    pe.textContent='✊';be.textContent='✊';
    pe.classList.add('play');be.classList.add('play');
    msg.textContent='...';
    haptic('medium'); SFX.dice();
    $$('.rps-choices button').forEach(x=>x.disabled=true);
    setTimeout(()=>{
      pe.classList.remove('play');be.classList.remove('play');
      pe.textContent=E[p];be.textContent=E[b];
      let res;
      if(p===b){res='draw';msg.innerHTML='🤝 مساوی شد!';SFX.tap();}
      else if(WIN[p]===b){res='win';ps++;streak++;
        msg.innerHTML=`✅ ${N[p]} ${N[b]} رو می‌زنه! آفرین!`;
        SFX.good();haptic('medium');
        if(streak>best){best=streak;store.set('rps_streak',best);}
      }
      else{res='lose';bs++;streak=0;
        msg.innerHTML=`❌ ${N[b]} ${N[p]} رو می‌زنه!`;
        SFX.bad();
      }
      hist.push({p,res});
      $('#r-ps').textContent=fa(ps);$('#r-bs').textContent=fa(bs);
      $$('.rps-choices button').forEach(x=>x.disabled=false);
      const t=TARGET[diff]||5;
      if(ps>=t||bs>=t) setTimeout(()=>end(ps>=t),700);
    },950);
  }
  function end(won){
    over=true;
    bumpStat(won,'rps');
    logHistory('rps',won?'win':'lose',`${fa(ps)} - ${fa(bs)}`);
    if(won){
      store.set('best_rps', fa(ps)+'-'+fa(bs)+' ✅');
      const reward=(diff==='hard'?70:diff==='medium'?45:25)+streak*5;
      addCoins(reward,'سنگ کاغذ قیچی ✊');
      showEnd(true,'ترکوندی! 🎉',`با نتیجه <b>${fa(ps)} - ${fa(bs)}</b> ربات رو بردی! 🤖💥<br>🔥 ${fa(streak)} برد پیاپی!<br>🪙 <b>${fa(reward)} سکه</b> گرفتی!`,()=>render(diff));
    } else {
      addCoins(8,'تلاش ✊');
      showEnd(false,'ربات برد! 🤖',`نتیجه <b>${fa(ps)} - ${fa(bs)}</b> شد...<br>یه دست دیگه! انتقام! 😤`,()=>render(diff));
    }
  }
  return { render, stop(){over=true;} };
})();
