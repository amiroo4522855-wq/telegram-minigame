/* ===== اسکیپ: فرار از پارکینگ ===== */
const EscapeGame = (()=>{
  const N=6;
  const RAW=[{"cars":[[2,2,2,0],[1,5,2,1],[1,0,3,1],[5,0,2,0],[0,3,2,0],[3,3,2,1]],"par":2,"sol":[[1,-1,1],[0,1,2]]},{"cars":[[2,2,2,0],[1,5,2,1],[5,2,3,0],[4,0,3,0],[1,0,2,0],[0,1,2,0]],"par":2,"sol":[[1,-1,1],[0,1,2]]},{"cars":[[2,1,2,0],[1,4,2,1],[3,1,2,0],[3,3,2,0],[4,4,2,1],[5,2,2,0]],"par":2,"sol":[[1,-1,1],[0,1,3]]},{"cars":[[2,0,2,0],[1,5,3,1],[1,3,2,1],[1,0,2,0],[0,1,3,0],[3,4,3,1]],"par":3,"sol":[[1,1,2],[2,1,2],[0,1,4]]},{"cars":[[2,2,2,0],[2,5,3,1],[4,0,2,1],[0,4,2,0],[1,4,2,1],[3,1,2,0]],"par":3,"sol":[[1,1,1],[4,1,2],[0,1,2]]},{"cars":[[2,2,2,0],[1,4,2,1],[3,3,2,0],[3,2,3,1],[2,1,2,1],[0,4,2,0]],"par":3,"sol":[[5,-1,2],[1,-1,1],[0,1,2]]},{"cars":[[2,2,2,0],[1,4,3,1],[4,0,2,0],[3,1,2,0],[0,3,2,1],[1,5,2,1]],"par":3,"sol":[[1,1,2],[5,-1,1],[0,1,2]]},{"cars":[[2,2,2,0],[2,4,3,1],[2,0,2,0],[3,0,2,0],[0,4,2,0],[5,3,3,0]],"par":3,"sol":[[5,-1,2],[1,1,1],[0,1,2]]},{"cars":[[2,2,2,0],[1,4,3,1],[3,1,2,1],[1,0,2,1],[5,4,2,0],[5,2,2,0]],"par":4,"sol":[[5,-1,2],[4,-1,2],[1,1,2],[0,1,2]]},{"cars":[[2,2,2,0],[0,5,3,1],[3,0,3,0],[0,1,3,1],[3,4,2,0],[5,2,2,0],[4,4,2,0]],"par":4,"sol":[[4,-1,1],[6,-1,1],[1,1,3],[0,1,2]]},{"cars":[[2,1,2,0],[1,4,3,1],[3,2,2,1],[0,5,2,1],[1,3,2,1],[3,3,3,1],[2,5,3,1]],"par":4,"sol":[[1,1,2],[4,-1,1],[6,1,1],[0,1,3]]},{"cars":[[2,0,2,0],[1,3,3,1],[1,1,2,0],[4,1,2,0],[2,5,2,1],[4,3,2,0],[3,1,2,0]],"par":4,"sol":[[4,-1,2],[5,1,1],[1,1,2],[0,1,4]]},{"cars":[[2,1,2,0],[2,3,2,1],[4,1,2,1],[2,4,3,1],[1,5,2,1],[3,0,2,0],[0,2,2,1]],"par":4,"sol":[[1,-1,2],[3,1,1],[4,-1,1],[0,1,3]]},{"cars":[[2,0,2,0],[2,2,2,1],[0,3,3,1],[0,4,2,1],[2,4,2,1],[5,0,2,0],[4,3,3,0]],"par":5,"sol":[[1,-1,2],[6,-1,3],[2,1,3],[4,1,1],[0,1,4]]},{"cars":[[2,2,2,0],[2,5,2,1],[4,0,2,0],[0,2,2,1],[5,3,3,0],[4,2,2,1],[1,4,3,1]],"par":5,"sol":[[1,-1,2],[5,-1,1],[4,-1,2],[6,1,2],[0,1,2]]},{"cars":[[2,2,2,0],[0,5,3,1],[5,3,2,0],[0,1,3,1],[4,2,2,1],[0,2,3,0],[1,4,3,1]],"par":5,"sol":[[1,1,3],[4,-1,1],[2,-1,1],[6,1,2],[0,1,2]]},{"cars":[[2,1,2,0],[1,5,3,1],[5,3,2,0],[2,4,3,1],[2,0,2,1],[0,3,3,1],[0,0,2,0]],"par":5,"sol":[[1,1,2],[2,-1,2],[3,1,1],[5,1,3],[0,1,3]]},{"cars":[[2,0,2,0],[1,3,2,1],[1,5,3,1],[5,0,2,0],[5,4,2,0],[0,3,3,0],[0,0,2,0],[1,2,3,1]],"par":5,"sol":[[1,1,2],[4,-1,1],[2,1,2],[7,1,2],[0,1,4]]},{"cars":[[2,1,2,0],[1,5,3,1],[0,4,3,1],[3,2,3,0],[0,2,2,1],[4,3,2,0],[1,3,2,1],[5,0,3,0]],"par":6,"sol":[[1,1,2],[3,-1,1],[5,-1,1],[2,1,3],[6,-1,1],[0,1,3]]},{"cars":[[2,0,2,0],[1,4,2,1],[1,2,3,1],[0,4,2,0],[4,2,2,0],[3,1,2,1],[3,0,3,1],[0,1,2,0]],"par":6,"sol":[[4,1,1],[2,1,2],[7,-1,1],[3,-1,2],[1,-1,1],[0,1,4]]},{"cars":[[2,0,2,0],[1,2,3,1],[1,4,2,1],[5,1,2,0],[1,5,2,1],[4,0,2,0],[3,4,3,1],[2,3,2,1]],"par":6,"sol":[[2,-1,1],[3,-1,1],[1,1,2],[4,-1,1],[7,-1,2],[0,1,4]]},{"cars":[[2,1,2,0],[0,5,3,1],[1,3,3,1],[1,1,2,0],[5,3,2,0],[0,0,2,0],[2,0,2,1],[3,4,2,0]],"par":6,"sol":[[2,-1,1],[4,-1,2],[7,-1,3],[1,1,3],[2,1,3],[0,1,3]]},{"cars":[[2,1,2,0],[1,4,2,1],[2,5,3,1],[5,3,2,0],[4,2,2,1],[0,0,2,1],[0,2,3,0],[1,3,3,1]],"par":6,"sol":[[1,1,2],[2,1,1],[4,-1,1],[3,-1,2],[7,1,2],[0,1,3]]},{"cars":[[2,0,2,0],[2,4,2,1],[1,2,3,1],[2,5,2,1],[1,3,2,1],[5,1,2,0],[4,1,2,0],[3,0,2,0]],"par":7,"sol":[[1,-1,2],[3,-1,2],[4,-1,1],[5,-1,1],[6,-1,1],[2,1,2],[0,1,4]]},{"cars":[[2,0,2,0],[1,3,3,1],[1,2,2,1],[1,4,2,1],[0,4,2,0],[3,4,2,1],[5,1,3,0],[0,1,2,0]],"par":7,"sol":[[2,1,2],[6,-1,1],[1,1,2],[7,-1,1],[4,-1,2],[3,-1,1],[0,1,4]]},{"cars":[[2,0,2,0],[0,3,3,1],[1,5,2,1],[4,3,2,0],[3,5,3,1],[5,1,2,0],[1,4,3,1],[3,1,3,0],[3,0,2,1]],"par":7,"sol":[[2,-1,1],[3,-1,2],[6,1,2],[8,1,1],[7,-1,1],[1,1,3],[0,1,4]]},{"cars":[[2,0,2,0],[2,3,3,1],[0,5,3,1],[0,2,2,0],[3,0,3,1],[1,1,3,0],[3,4,2,0],[5,1,2,0],[4,1,2,0]],"par":7,"sol":[[3,-1,1],[5,-1,1],[1,-1,2],[6,-1,3],[1,1,3],[2,1,3],[0,1,4]]},{"cars":[[2,0,2,0],[2,5,3,1],[2,2,3,1],[2,3,3,1],[4,0,2,0],[2,4,2,1],[1,4,2,0],[5,1,2,0],[4,4,2,1]],"par":7,"sol":[[1,1,1],[3,1,1],[6,-1,2],[5,-1,2],[7,-1,1],[2,1,1],[0,1,4]]},{"cars":[[2,2,2,0],[2,4,2,1],[0,5,3,1],[5,3,3,0],[3,3,2,1],[4,4,2,0],[4,1,2,0],[0,2,2,1],[1,1,2,1]],"par":8,"sol":[[1,-1,2],[3,-1,1],[8,-1,1],[0,-1,1],[4,-1,3],[5,-1,1],[2,1,3],[0,1,3]]},{"cars":[[2,0,2,0],[2,3,2,1],[2,4,2,1],[1,2,2,1],[0,2,2,0],[0,0,2,1],[4,2,2,1],[4,3,2,0],[1,4,2,0]],"par":8,"sol":[[4,1,1],[3,-1,1],[6,-1,2],[7,-1,3],[1,1,1],[2,1,1],[6,1,1],[0,1,4]]},{"cars":[[2,2,2,0],[1,5,2,1],[0,4,3,1],[2,1,2,1],[4,0,3,0],[3,2,2,0],[3,4,2,0],[2,0,2,1],[5,4,2,0]],"par":8,"sol":[[1,-1,1],[3,-1,1],[7,-1,1],[5,-1,2],[6,-1,2],[8,-1,2],[2,1,3],[0,1,2]]},{"cars":[[2,2,2,0],[2,5,2,1],[0,4,3,1],[0,1,2,1],[3,3,2,1],[5,2,3,0],[0,3,2,1],[4,4,2,0],[0,5,2,1]],"par":8,"sol":[[0,-1,1],[4,-1,1],[5,-1,1],[7,-1,3],[1,1,1],[2,1,3],[4,1,1],[0,1,3]]},{"cars":[[2,0,2,0],[0,3,3,1],[2,2,2,1],[0,4,2,0],[2,5,2,1],[4,3,3,0],[1,0,3,0],[2,4,2,1],[5,3,2,0]],"par":8,"sol":[[5,-1,3],[4,1,1],[7,1,1],[8,-1,2],[1,1,3],[6,1,3],[2,-1,2],[0,1,4]]},{"cars":[[2,2,2,0],[2,4,3,1],[1,5,2,1],[2,0,2,1],[5,4,2,0],[3,1,2,0],[4,0,2,0],[1,1,2,1],[3,3,3,1],[1,2,2,0]],"par":8,"sol":[[2,-1,1],[7,-1,1],[0,-1,1],[8,-1,1],[4,-1,3],[1,1,1],[8,1,1],[0,1,3]]},{"cars":[[2,0,2,0],[1,4,2,1],[1,3,2,1],[0,5,3,1],[0,2,2,0],[4,4,2,0],[4,2,2,1],[1,2,2,1],[3,4,2,0],[1,0,2,0]],"par":8,"sol":[[1,-1,1],[4,-1,2],[2,-1,1],[5,-1,1],[7,-1,1],[8,-1,1],[3,1,3],[0,1,4]]},{"cars":[[2,1,2,0],[1,3,2,1],[0,4,3,1],[1,5,3,1],[0,1,2,0],[5,2,2,0],[3,1,3,1],[3,3,2,0],[1,0,2,1],[5,4,2,0]],"par":9,"sol":[[1,-1,1],[0,1,1],[6,-1,1],[5,-1,2],[7,-1,1],[9,-1,2],[2,1,3],[3,1,2],[0,1,2]]},{"cars":[[2,0,2,0],[1,2,2,1],[0,5,2,1],[1,3,2,1],[0,0,2,0],[3,1,3,1],[4,4,2,0],[5,3,2,0],[0,2,3,0],[3,2,3,1]],"par":9,"sol":[[2,1,1],[3,1,2],[8,1,1],[1,-1,1],[0,1,3],[1,1,1],[8,-1,1],[2,-1,1],[0,1,1]]},{"cars":[[2,0,2,0],[1,3,2,1],[0,5,2,1],[2,2,2,1],[3,4,2,0],[4,2,3,0],[0,0,2,0],[4,5,2,1],[0,2,3,0],[3,0,2,0]],"par":10,"sol":[[2,1,1],[5,-1,2],[1,1,2],[8,1,1],[3,-1,2],[0,1,3],[3,1,1],[8,-1,1],[2,-1,1],[0,1,1]]},{"cars":[[2,0,2,0],[2,2,2,1],[1,3,2,1],[1,5,3,1],[4,1,3,0],[5,2,2,0],[1,0,3,0],[3,0,2,1],[0,2,3,0],[3,4,2,1]],"par":10,"sol":[[2,1,1],[3,1,2],[6,1,3],[8,1,1],[1,-1,2],[0,1,1],[7,-1,1],[4,-1,1],[2,1,1],[0,1,3]]},{"cars":[[2,0,2,0],[0,5,3,1],[0,3,2,1],[0,4,2,1],[0,1,2,0],[5,0,3,0],[3,4,2,0],[1,2,3,1],[4,3,2,1],[3,0,2,1]],"par":10,"sol":[[8,-1,1],[5,1,3],[7,1,2],[0,1,3],[7,-1,1],[5,-1,3],[8,1,1],[6,-1,1],[1,1,3],[0,1,1]]},{"cars":[[2,1,2,0],[2,5,2,1],[1,4,2,1],[2,3,2,1],[0,2,2,0],[4,3,3,0],[3,2,2,1],[4,0,2,1],[3,1,2,1],[0,1,2,1]],"par":10,"sol":[[0,-1,1],[4,1,2],[3,-1,2],[6,-1,3],[0,1,2],[8,-1,1],[5,-1,2],[1,1,1],[2,1,2],[0,1,2]]},{"cars":[[2,0,2,0],[1,3,2,1],[2,5,2,1],[0,4,3,1],[3,0,3,1],[5,1,2,0],[1,0,2,0],[0,5,2,1],[3,2,2,0],[4,3,2,1],[5,4,2,0]],"par":10,"sol":[[0,1,1],[1,-1,1],[2,1,1],[4,-1,1],[5,-1,1],[8,-1,1],[9,-1,1],[10,-1,2],[3,1,3],[0,1,3]]},{"cars":[[2,0,2,0],[2,4,2,1],[2,2,3,1],[3,5,3,1],[5,2,3,0],[1,2,2,0],[1,0,2,0],[0,1,2,0],[5,0,2,0],[2,3,2,1],[3,0,2,1]],"par":10,"sol":[[1,-1,2],[3,-1,1],[4,1,1],[2,1,1],[9,1,1],[0,1,3],[2,-1,1],[4,-1,1],[3,1,1],[0,1,1]]},{"cars":[[2,0,2,0],[0,4,3,1],[1,5,2,1],[1,2,2,1],[4,3,3,0],[5,3,3,0],[1,3,2,1],[3,1,2,1],[0,2,2,0],[3,0,2,1],[0,1,2,1]],"par":11,"sol":[[1,1,1],[5,-1,2],[8,1,2],[3,-1,1],[6,-1,1],[0,1,2],[7,-1,1],[4,-1,2],[1,1,2],[2,1,2],[0,1,2]]},{"cars":[[2,0,2,0],[1,5,2,1],[1,3,3,1],[2,4,2,1],[4,4,2,0],[0,1,2,1],[3,2,2,1],[5,4,2,0],[4,0,2,1],[0,4,2,0],[1,2,2,1]],"par":11,"sol":[[2,1,2],[10,-1,1],[0,1,2],[5,1,3],[0,-1,2],[10,1,1],[9,-1,4],[1,-1,1],[3,-1,2],[10,-1,1],[0,1,4]]},{"cars":[[2,1,2,0],[1,3,2,1],[3,4,2,1],[2,5,2,1],[5,3,3,0],[3,1,2,0],[4,1,2,0],[0,2,2,1],[3,0,2,1],[0,3,3,0],[3,3,2,1]],"par":11,"sol":[[3,1,1],[8,-1,3],[0,-1,1],[5,-1,1],[6,-1,1],[7,1,3],[0,1,1],[8,1,1],[9,-1,3],[1,-1,1],[0,1,3]]},{"cars":[[2,0,2,0],[2,5,2,1],[0,4,2,1],[0,2,3,1],[3,0,2,0],[4,5,2,1],[4,2,3,0],[1,3,2,1],[5,2,3,0],[1,0,2,0],[3,3,2,0]],"par":11,"sol":[[1,-1,2],[5,-1,2],[6,1,1],[7,-1,1],[8,1,1],[3,1,3],[0,1,3],[3,-1,2],[6,-1,1],[5,1,1],[0,1,1]]},{"cars":[[2,0,2,0],[1,2,2,1],[1,3,3,1],[0,4,3,1],[4,2,2,1],[0,0,2,0],[3,0,3,1],[3,1,2,1],[5,3,3,0],[0,2,2,0],[1,5,2,1]],"par":11,"sol":[[3,1,1],[4,-1,1],[9,1,1],[1,-1,1],[0,1,1],[6,-1,1],[8,-1,3],[2,1,2],[3,1,2],[10,-1,1],[0,1,3]]},{"cars":[[2,1,2,0],[1,4,3,1],[1,3,3,1],[1,5,3,1],[3,2,2,1],[5,4,2,0],[3,0,2,1],[4,3,3,0],[1,0,2,1],[0,1,2,1],[0,2,2,0]],"par":12,"sol":[[5,-1,3],[8,-1,1],[0,-1,1],[10,1,1],[4,-1,3],[0,1,1],[6,-1,1],[7,-1,3],[1,1,2],[2,1,2],[3,1,2],[0,1,3]]},{"cars":[[2,0,2,0],[1,2,2,1],[2,3,3,1],[1,4,2,1],[3,0,3,1],[5,3,3,0],[1,5,2,1],[0,0,2,1],[0,1,3,0],[3,2,2,1],[3,5,2,1],[3,1,2,1]],"par":12,"sol":[[3,1,2],[8,1,2],[1,-1,1],[0,1,1],[4,-1,1],[5,-1,3],[2,1,1],[0,1,2],[1,1,1],[8,-1,1],[6,-1,1],[0,1,1]]}];
  const LEVELS=RAW.map(L=>({cars:L.cars.map(a=>({r:a[0],c:a[1],len:a[2],vert:!!a[3]})),par:L.par,sol:L.sol}));
  const COLS=['#f59e0b','#3b82f6','#22c55e','#a855f7','#ec4899','#14b8c4','#f97316','#84cc36','#6366f1','#eab308','#fb7185'];
  let diff,lv,cars,moves,undoStack,busy,over,starMap,drag;
  function free(cars,i){
    const g=Array.from({length:N},()=>Array(N).fill(-1));
    cars.forEach((c,j)=>{for(let k=0;k<c.len;k++)g[c.vert?c.r+k:c.r][c.vert?c.c:c.c+k]=j;});
    const c=cars[i];let neg=0,pos=0;
    if(c.vert){for(let r=c.r-1;r>=0&&g[r][c.c]===-1;r--)neg++;for(let r=c.r+c.len;r<N&&g[r][c.c]===-1;r++)pos++;}
    else{for(let cc=c.c-1;cc>=0&&g[c.r][cc]===-1;cc--)neg++;for(let cc=c.c+c.len;cc<N&&g[c.r][cc]===-1;cc++)pos++;}
    return[neg,pos];
  }
  function render(d){ diff=d; stop(); over=false; starMap=store.get('esc_stars',{}); showSelect(); }
  function unlockedGet(){ return store.get('esc_unlocked',1); }
  function totalStars(){ return Object.values(starMap||{}).reduce((a,b)=>a+b,0); }
  function showSelect(){
    stop(); over=false;
    const un=unlockedGet(), tot=totalStars();
    const box=$('#game-container');
    box.innerHTML=`<div class="panel">
      <div class="is-head"><b>🚗 اسکیپ</b><small>ماشین قرمز رو از پارکینگ بیرون ببر! 🔴</small></div>
      <div class="is-total"><span>⭐ ${fa(tot)}/${fa(LEVELS.length*3)}</span><div class="is-prog"><i style="width:${tot/(LEVELS.length*3)*100}%"></i></div></div>
      <div class="is-grid">${LEVELS.map((L,i)=>{
        const lock=i+1>un, st=starMap[i]||0;
        return `<button class="is-lv${lock?' lock':''}" data-i="${i}" ${lock?'disabled':''}><b>${fa(i+1)}</b><small>${lock?'🔒':'★'.repeat(st)+'☆'.repeat(3-st)}</small><em>پار ${fa(L.par)}</em></button>`;
      }).join('')}</div>
      <div class="t-hint">ماشین‌ها رو بکش! قرمز باید برسه به خروجی ➡️</div>
    </div>`;
    box.querySelectorAll('.is-lv:not(.lock)').forEach(b=>b.onclick=()=>{ SFX.tap(); haptic('light'); play(+b.dataset.i); });
  }
  function pct(v){ return (v*100/N)+'%'; }
  function carSVG(c,i){
    const S=60,W=c.len*S,H=S,red=i===0;
    const truck=c.len===3&&!red;
    const tail=red?'#7f1d1d':'#dc2626';
    const cx0=W*0.30,cw=W*0.40,cy0=13,ch=H-26;
    let bed='';
    if(truck){
      const bw=W-78;
      bed=`<rect x="10" y="14" width="${bw}" height="${H-28}" rx="6" fill="#0b1120" opacity=".72"/>`;
      for(let sx=30;sx<10+bw-8;sx+=26) bed+=`<rect x="${sx}" y="16" width="4" height="${H-32}" rx="2" fill="#fff" opacity=".14"/>`;
      bed+=`<rect x="10" y="12" width="${bw}" height="4" rx="2" fill="#fff" opacity=".25"/><rect x="10" y="${H-16}" width="${bw}" height="4" rx="2" fill="#000" opacity=".3"/>`;
      bed+=`<rect x="${W-64}" y="13" width="50" height="${H-26}" rx="9" fill="#000" opacity=".30"/>`;
      bed+=`<polygon points="${W-32},15 ${W-19},15 ${W-22},${H-15} ${W-35},${H-15}" fill="#e8f4ff"/>`;
      bed+=`<rect x="${W-30}" y="17" width="3.5" height="${H-34}" rx="1.7" fill="#fff" opacity=".55"/>`;
    }
    const cabin=truck?bed:`<rect x="${cx0}" y="${cy0}" width="${cw}" height="${ch}" rx="9" fill="#000" opacity=".30"/>
      <polygon points="${cx0+4},15 ${cx0+16},15 ${cx0+13},${H-15} ${cx0+1},${H-15}" fill="#dbeafe" opacity=".75"/>
      <polygon points="${cx0+cw-16},15 ${cx0+cw-4},15 ${cx0+cw-1},${H-15} ${cx0+cw-13},${H-15}" fill="#e8f4ff"/>
      <rect x="${cx0+cw-13}" y="17" width="3.5" height="${H-34}" rx="1.7" fill="#fff" opacity=".55"/>`;
    const hr=red?8:6, ho=red?0.4:0.28;
    const star=`<path d="M0,-8 L2.4,-2.5 L7.6,-2.5 L3.8,1.2 L5.5,6.5 L0,3 L-5.5,6.5 L-3.8,1.2 L-7.6,-2.5 L-2.4,-2.5 Z" transform="translate(${(cx0+cw/2).toFixed(1)},${H/2})" fill="#fff" opacity=".95" stroke="#b45309" stroke-width="1"/>`;
    const shapes=`
      <rect x="12" y="1" width="18" height="11" rx="4" fill="#111827" stroke="#4b5563"/>
      <rect x="${W-30}" y="1" width="18" height="11" rx="4" fill="#111827" stroke="#4b5563"/>
      <rect x="12" y="${H-12}" width="18" height="11" rx="4" fill="#111827" stroke="#4b5563"/>
      <rect x="${W-30}" y="${H-12}" width="18" height="11" rx="4" fill="#111827" stroke="#4b5563"/>
      <rect x="3" y="7" width="${W-6}" height="${H-14}" rx="13" style="fill:var(--cc)"/>
      <rect x="3" y="7" width="${W-6}" height="${H-14}" rx="13" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="2"/>
      <rect x="11" y="10" width="${W-22}" height="9" rx="4.5" fill="#fff" opacity=".22"/>
      <rect x="11" y="${H-19}" width="${W-22}" height="9" rx="4.5" fill="#000" opacity=".16"/>
      ${cabin}
      <rect x="4" y="12" width="5" height="7" rx="2" fill="${tail}"/>
      <rect x="4" y="${H-19}" width="5" height="7" rx="2" fill="${tail}"/>
      <circle cx="${W-5}" cy="15.5" r="${hr}" fill="#fefce8" opacity="${ho}"/>
      <circle cx="${W-5}" cy="${H-15.5}" r="${hr}" fill="#fefce8" opacity="${ho}"/>
      <rect x="${W-9}" y="12" width="7" height="7" rx="2" fill="#fefce8"/>
      <rect x="${W-9}" y="${H-19}" width="7" height="7" rx="2" fill="#fefce8"/>
      ${red?`<rect x="8" y="${H/2-6}" width="${W-16}" height="3.6" rx="1.8" fill="#fff" opacity=".85"/><rect x="8" y="${H/2+2.4}" width="${W-16}" height="3.6" rx="1.8" fill="#fff" opacity=".85"/>`:''}
      ${red?star:''}`;
    if(!c.vert) return `<svg viewBox="0 0 ${W} ${H}">${shapes}</svg>`;
    const t=(i%2===0)?`translate(0,${W}) rotate(-90)`:`translate(${H},0) rotate(90)`;
    return `<svg viewBox="0 0 ${H} ${W}"><g transform="${t}">${shapes}</g></svg>`;
  }
  function carHTML(c,i){
    const red=i===0;
    return `<div class="esc-car${red?' red':''}${c.vert?' vert':''}" data-i="${i}"
      style="left:${pct(c.c)};top:${pct(c.r)};width:${c.vert?pct(1):pct(c.len)};height:${c.vert?pct(c.len):pct(1)};--cc:${red?'#ef4444':COLS[(i-1)%COLS.length]}">${carSVG(c,i)}</div>`;
  }
  function play(i){
    stop();
    lv=i; over=false; busy=false; moves=0; undoStack=[]; drag=null;
    cars=LEVELS[lv].cars.map(c=>({...c}));
    const L=LEVELS[lv];
    const box=$('#game-container');
    box.innerHTML=`<div class="panel">
      <div class="is-top"><button class="btn btn-ghost is-back" id="esc-back">‹ مرحله‌ها</button>
        <b>مرحله ${fa(lv+1)}</b>
        <span class="is-mv">حرکت <b id="esc-moves">۰</b> / پار ${fa(L.par)}</span></div>
      <div class="is-sub"><span class="is-theme">🚗 ${fa(cars.length)} ماشین</span><span class="is-stars s3" id="esc-stars">★★★</span></div>
      <div class="esc-board" id="esc-board">${cars.map(carHTML).join('')}<div class="esc-exit">➡️<small>خروجی</small></div></div>
      <div class="row-btns"><button class="btn btn-ghost" id="esc-undo">↩️ برگرد</button><button class="btn btn-gold" id="esc-re">🔁 از اول</button></div>
    </div>`;
    toast(`مرحله ${fa(lv+1)} • پار ${fa(L.par)}`);
    box.querySelectorAll('.esc-car').forEach(el=>{
      el.addEventListener('pointerdown',onDown);
    });
    $('#esc-undo').onclick=undo;
    $('#esc-re').onclick=()=>{ haptic(); play(lv); };
    $('#esc-back').onclick=()=>{ SFX.tap(); showSelect(); };
    updHud();
  }
  function cellPx(){ const bd=$('#esc-board'); return bd?bd.clientWidth/N:50; }
  function onDown(e){
    if(over||busy) return;
    const el=e.currentTarget, i=+el.dataset.i;
    e.preventDefault();
    try{ el.setPointerCapture(e.pointerId); }catch(err){}
    const [neg,pos]=free(cars,i);
    drag={i,el,sx:e.clientX,sy:e.clientY,neg,pos,moved:false,vert:cars[i].vert};
    el.classList.add('drag');
    el.addEventListener('pointermove',onMove);
    el.addEventListener('pointerup',onUp,{once:true});
    el.addEventListener('pointercancel',onUp,{once:true});
  }
  function onMove(e){
    if(!drag) return;
    const cp=cellPx();
    const d=drag.vert?e.clientY-drag.sy:e.clientX-drag.sx;
    const cells=d/cp;
    const cl=Math.max(-drag.neg,Math.min(drag.pos,cells));
    drag.cur=cl;
    if(Math.abs(cl)>0.08) drag.moved=true;
    drag.el.style.transform=drag.vert?`translateY(${cl*cp}px)`:`translateX(${cl*cp}px)`;
  }
  function onUp(e){
    if(!drag) return;
    const d=drag; drag=null;
    d.el.classList.remove('drag');
    d.el.removeEventListener('pointermove',onMove);
    const steps=Math.round(d.cur||0);
    d.el.style.transform='';
    if(!d.moved||steps===0){
      if(Math.abs(d.cur||0)>0.15){ d.el.classList.add('shake'); d.el.addEventListener('animationend',()=>d.el.classList.remove('shake'),{once:true}); beep(160,.05,'square'); }
      renderCars(); return;
    }
    undoStack.push(cars.map(c=>({r:c.r,c:c.c})));
    if(cars[d.i].vert) cars[d.i].r+=steps; else cars[d.i].c+=steps;
    moves++; updHud();
    beep(300+moves*10,.06,'square'); haptic('light');
    renderCars();
    if(cars[0].c===4) setTimeout(()=>{ if(!over) winGame(); },300);
  }
  function renderCars(){
    const bd=$('#esc-board'); if(!bd) return;
    cars.forEach((c,i)=>{
      const el=bd.querySelector(`.esc-car[data-i="${i}"]`); if(!el) return;
      el.style.left=pct(c.c); el.style.top=pct(c.r);
    });
  }
  function starNow(){
    const L=LEVELS[lv];
    return moves<=L.par?3:moves<=L.par+4?2:1;
  }
  function updHud(){
    const m=$('#esc-moves'); if(m) m.textContent=fa(moves);
    const st=$('#esc-stars'), n=starNow();
    if(st){ st.textContent='★'.repeat(n)+'☆'.repeat(3-n); st.className='is-stars s'+n; }
  }
  function undo(){
    if(over||busy) return;
    if(!undoStack.length){ toast('حرکتی برای برگشت نیست!'); return; }
    const prev=undoStack.pop();
    prev.forEach((p,i)=>{ cars[i].r=p.r; cars[i].c=p.c; });
    renderCars(); SFX.tap();
  }
  function winGame(){
    over=true; busy=true;
    const L=LEVELS[lv];
    const red=document.querySelector('.esc-car[data-i="0"]');
    if(red){ red.style.transition='left .5s ease-in'; red.style.left='112%'; }
    beep(500,.15,'sawtooth'); setTimeout(()=>beep(700,.2,'sawtooth'),150);
    setTimeout(()=>{
      const st=moves<=L.par?3:moves<=L.par+4?2:1;
      starMap[lv]=Math.max(starMap[lv]||0,st); store.set('esc_stars',starMap);
      if(lv+1<LEVELS.length) store.set('esc_unlocked',Math.max(unlockedGet(),lv+2));
      const reward=8+st*4;
      bumpStat(true);
      logHistory('escape','win',`مرحله ${fa(lv+1)} • ${'★'.repeat(st)}`);
      const bPrev=store.get('best_escape',0);
      if(lv+1>bPrev){ store.set('best_escape',lv+1); store.set('best_escape_t','مرحله '+fa(lv+1)); }
      addCoins(reward,'اسکیپ'); confetti(100); SFX.good();
      const hasNext=lv+1<LEVELS.length;
      showEnd(true,`${'⭐'.repeat(st)} فرار موفق!`,
        `ماشین قرمز با <b>${fa(moves)}</b> حرکت بیرون رفت! (پار ${fa(L.par)})<br>🪙 <b>${fa(reward)} سکه</b> گرفتی!`+(hasNext?'':'<br>🏆 همه مراحل تموم شد! راننده افسانه‌ای!'),
        ()=>{ hasNext?play(lv+1):render(diff); });
      const rb=$('#end-retry');
      if(rb) rb.innerHTML=hasNext?'⏭️ مرحله بعد':'🔁 دوباره';
    },550);
  }
  function stop(){ over=true; busy=false; drag=null; }
  /* --- هوک‌های تست --- */
  function probe(){
    for(let i=0;i<cars.length;i++){
      const[neg,pos]=free(cars,i);
      if(neg>0) return {i,vert:cars[i].vert,dir:-1};
      if(pos>0) return {i,vert:cars[i].vert,dir:1};
    }
    return null;
  }
  function testDrive(sol){
    if(over) return;
    (sol||[]).forEach(([i,dir,d])=>{
      if(cars[i].vert) cars[i].r+=dir*d; else cars[i].c+=dir*d;
      moves++;
    });
    renderCars(); updHud();
    if(cars[0].c===4) winGame();
  }
  return { render, stop, levels:()=>LEVELS, solution:lv=>LEVELS[lv].sol, probe, testDrive };
})();
