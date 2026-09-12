/* جنراتور مرحله‌های ۲۱..۵۰ آیس‌اسلاید — آفلاین، خروجی دیتای آماده */
const fs = require('fs');
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const DIRS=[[0,1],[0,-1],[1,0],[-1,0]];
function solve(L){
  const N=L.N,g=L.grid,s=L.start[0]*N+L.start[1],gl=L.goal[0]*N+L.goal[1];
  if(s===gl) return 0;
  const slide=(r,c,dr,dc)=>{ while(g[r+dr]!==undefined&&g[r+dr][c+dc]!==undefined&&g[r+dr][c+dc]!=='#'){r+=dr;c+=dc;} return r*N+c; };
  const seen=new Set([s]);
  let q=[[s,0]];
  while(q.length){
    const nq=[];
    for(const [st,d] of q){
      const r=(st/N)|0,c=st%N;
      for(const [dr,dc] of DIRS){
        const ns=slide(r,c,dr,dc);
        if(ns===gl) return d+1;
        if(!seen.has(ns)){ seen.add(ns); nq.push([ns,d+1]); }
      }
    }
    q=nq;
  }
  return null;
}
function buildCandidate(lv,att){
  const rng=mulberry32(lv*7919+13+att*101);
  const N=lv<25?8:9;
  const wallP=0.14+Math.min(0.05,lv*0.001);
  const g=Array.from({length:N},(_,r)=>Array.from({length:N},(_,c)=>(r===0||c===0||r===N-1||c===N-1)?'#':(rng()<wallP?'#':'.')));
  const isW=(r,c)=>r<0||c<0||r>=N||c>=N||g[r][c]==='#';
  const free=[]; for(let r=1;r<N-1;r++)for(let c=1;c<N-1;c++)if(g[r][c]==='.')free.push([r,c]);
  const goal=free[(rng()*free.length)|0];
  let gd=DIRS.filter(([dr,dc])=>isW(goal[0]+dr,goal[1]+dc)&&!isW(goal[0]-dr,goal[1]-dc));
  if(!gd.length){
    const opts=DIRS.filter(([dr,dc])=>!isW(goal[0]-dr,goal[1]-dc));
    if(!opts.length){ const d=DIRS[(rng()*4)|0]; g[goal[0]+d[0]][goal[1]+d[1]]='.'; }
    else { const d=opts[(rng()*opts.length)|0],nr=goal[0]+d[0],nc=goal[1]+d[1];
      if(nr>0&&nc>0&&nr<N-1&&nc<N-1) g[nr][nc]='#'; }
    gd=DIRS.filter(([dr,dc])=>isW(goal[0]+dr,goal[1]+dc)&&!isW(goal[0]-dr,goal[1]-dc));
    if(!gd.length) return null;
  }
  const K=6+Math.min(lv,20);
  let cur=goal.slice(),steps=0;
  for(let k=0;k<K;k++){
    const ds=DIRS.filter(([dr,dc])=>isW(cur[0]+dr,cur[1]+dc)&&!isW(cur[0]-dr,cur[1]-dc));
    if(!ds.length) break;
    const d=ds[(rng()*ds.length)|0];
    const run=[]; let r=cur[0]-d[0],c=cur[1]-d[1];
    while(!isW(r,c)){ run.push([r,c]); r-=d[0]; c-=d[1]; }
    if(!run.length) break;
    cur=run[(rng()*run.length)|0]; steps++;
  }
  if(steps>=2&&(cur[0]!==goal[0]||cur[1]!==goal[1]))
    return {N,grid:g.map(r=>r.join('')),start:cur,goal,par:steps};
  return null;
}
function wantFor(lv){ return lv<28?5:lv<38?6:lv<46?7:8; }
const out=[];
for(let lv=20;lv<50;lv++){
  const want=wantFor(lv);
  let best=null,bestScore=1e9;
  for(let att=0;att<400;att++){
    const c=buildCandidate(lv,att);
    if(!c) continue;
    const opt=solve(c);
    if(opt===null||opt<1||opt>14) continue;
    const score=opt<want?(want-opt)*4+1:(opt-want);
    if(score<bestScore){ bestScore=score; best=c; best.par=opt; }
    if(score===0) break;
  }
  if(!best){ console.error('FAILED lv',lv); process.exit(1); }
  out.push(best);
  console.log(`L${lv+1} want=${want} par=${best.par} N=${best.N}`);
}
fs.writeFileSync(__dirname+'/is50.json',JSON.stringify(out));
console.log('pars:',out.map(L=>L.par).join(','));
console.log('OK saved tools/is50.json');
