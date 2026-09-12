/* جنراتور ۵۰ مرحله اسکیپ — نسخه ۲: برد تصادفی مسدود + تپه‌نوردی + BFS با مسیر */
const fs = require('fs');
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const N = 6;
function gridOf(cars){
  const g = Array.from({length:N},()=>Array(N).fill(-1));
  cars.forEach((c,j)=>{ for(let k=0;k<c.len;k++) g[c.vert?c.r+k:c.r][c.vert?c.c:c.c+k]=j; });
  return g;
}
function keyOf(cars){ return cars.map(c=>c.r+','+c.c).join(';'); }
function tryPlace(cars,len,vert,r,c){
  const g=gridOf(cars);
  for(let k=0;k<len;k++){ if(g[vert?r+k:r][vert?c:c+k]!==-1) return false; }
  cars.push({r,c,len,vert});
  return true;
}
function exitBlocked(board){
  const g=gridOf(board);
  for(let cc=board[0].c+2;cc<N;cc++) if(g[2][cc]!==-1) return true;
  return false;
}
/* برد تصادفی: قرمز عقب + مسدودکننده‌های ردیف خروج */
function randomBoard(nCars,nBlock,rng){
  for(let rs=0;rs<120;rs++){
    const redC=(rng()*3)|0;
    const cars=[{r:2,c:redC,len:2,vert:false}];
    let ok=true;
    const cols=[];
    for(let cc=redC+2;cc<N;cc++) cols.push(cc);
    for(let b=0;b<nBlock;b++){
      let placed=false;
      for(let t=0;t<80&&!placed;t++){
        const len=rng()<0.5?2:3;
        const c=cols.length?cols[(rng()*cols.length)|0]:(rng()*N)|0;
        const rMin=Math.max(0,3-len), r=rMin+((rng()*(3-rMin))|0);
        if(r+len>N) continue;
        placed=tryPlace(cars,len,true,r,c);
      }
      if(!placed){ ok=false; break; }
    }
    if(!ok) continue;
    for(let n=cars.length;n<nCars;n++){
      let placed=false;
      for(let t=0;t<150&&!placed;t++){
        const len=rng()<0.68?2:3, vert=rng()<0.5;
        const r=(rng()*(vert?N-len+1:N))|0, c=(rng()*(vert?N:N-len+1))|0;
        placed=tryPlace(cars,len,vert,r,c);
      }
      if(!placed){ ok=false; break; }
    }
    if(!ok) continue;
    if(!exitBlocked(cars)) continue;
    return cars;
  }
  return null;
}
function allMoves(cars){
  const g=gridOf(cars), out=[];
  for(let i=0;i<cars.length;i++){
    const c=cars[i];
    let neg=0,pos=0;
    if(c.vert){ for(let r=c.r-1;r>=0&&g[r][c.c]===-1;r--)neg++; for(let r=c.r+c.len;r<N&&g[r][c.c]===-1;r++)pos++; }
    else{ for(let cc=c.c-1;cc>=0&&g[c.r][cc]===-1;cc--)neg++; for(let cc=c.c+c.len;cc<N&&g[c.r][cc]===-1;cc++)pos++; }
    for(let d=1;d<=neg;d++) out.push([i,-1,d]);
    for(let d=1;d<=pos;d++) out.push([i,1,d]);
  }
  return out;
}
function mutate(cars,rng,steps){
  const st=cars.map(c=>({...c}));
  for(let s=0;s<steps;s++){
    const mv=allMoves(st);
    if(!mv.length) return null;
    const [i,dir,d]=mv[(rng()*mv.length)|0];
    if(i===0&&st[0].c+dir*d>=4) continue;
    if(st[i].vert) st[i].r+=dir*d; else st[i].c+=dir*d;
  }
  return st[0].c===4?null:st;
}
/* BFS بهینه با مسیر؛ null = حل‌نشدنی یا عمیق‌تر از سقف */
function solveBoard(cars,cap){
  const n=cars.length;
  const LEN=cars.map(c=>c.len), VERT=cars.map(c=>c.vert?1:0);
  const R0=cars.map(c=>c.r), C0=cars.map(c=>c.c);
  if(C0[0]===4) return {par:0,path:[]};
  const key=(R,C)=>{ let s=''; for(let i=0;i<n;i++) s+=R[i]+','+C[i]+';'; return s; };
  const startK=key(R0,C0);
  const prev=new Map();
  prev.set(startK,null);
  let frontier=[[R0,C0]];
  let depth=0;
  const g=new Int8Array(36);
  while(frontier.length){
    depth++;
    const next=[];
    for(const [R,C] of frontier){
      g.fill(-1);
      for(let i=0;i<n;i++){
        const r=R[i],c=C[i],l=LEN[i];
        if(VERT[i]){ for(let k=0;k<l;k++) g[(r+k)*6+c]=i; }
        else{ for(let k=0;k<l;k++) g[r*6+c+k]=i; }
      }
      const pk=key(R,C);
      for(let i=0;i<n;i++){
        const r=R[i],c=C[i],l=LEN[i];
        let neg=0,pos=0;
        if(VERT[i]){ for(let rr=r-1;rr>=0&&g[rr*6+c]===-1;rr--)neg++; for(let rr=r+l;rr<6&&g[rr*6+c]===-1;rr++)pos++; }
        else{ for(let cc=c-1;cc>=0&&g[r*6+cc]===-1;cc--)neg++; for(let cc=c+l;cc<6&&g[r*6+cc]===-1;cc++)pos++; }
        for(let s=0;s<2;s++){
          const dir=s===0?-1:1, mx=s===0?neg:pos;
          for(let d=1;d<=mx;d++){
            const R2=R.slice(),C2=C.slice();
            if(VERT[i]) R2[i]+=dir*d; else C2[i]+=dir*d;
            const k=key(R2,C2);
            if(prev.has(k)) continue;
            prev.set(k,[pk,i,dir,d]);
            if(C2[0]===4){
              const path=[[i,dir,d]];
              let ck=pk;
              while(true){ const e=prev.get(ck); if(!e) break; path.push([e[1],e[2],e[3]]); ck=e[0]; }
              path.reverse();
              return {par:depth,path};
            }
            next.push([R2,C2]);
            if(prev.size>=cap) return null;
          }
        }
      }
    }
    frontier=next;
  }
  return null;
}
function verifyLegal(cars,sol){
  const st=cars.map(c=>({...c}));
  for(const [i,dir,d] of sol){
    let neg=0,pos=0;
    const g=gridOf(st), c=st[i];
    if(c.vert){ for(let r=c.r-1;r>=0&&g[r][c.c]===-1;r--)neg++; for(let r=c.r+c.len;r<N&&g[r][c.c]===-1;r++)pos++; }
    else{ for(let cc=c.c-1;cc>=0&&g[c.r][cc]===-1;cc--)neg++; for(let cc=c.c+c.len;cc<N&&g[c.r][cc]===-1;cc++)pos++; }
    if((dir<0&&neg<d)||(dir>0&&pos<d)) return false;
    if(st[i].vert) st[i].r+=dir*d; else st[i].c+=dir*d;
  }
  return st[0].c===4;
}
const rng=mulberry32(777123);
const targets=Array.from({length:50},(_,i)=>Math.round(2+i*10/49));
const used=new Set(), picked=[];
for(let li=0;li<50;li++){
  const t0=Date.now();
  const t=targets[li];
  const nCars=6+Math.floor(li*6/49);
  const nBlock=1+Math.floor(li/17);
  const deep=t>8;
  const cap=t<=8?250000:t<=10?700000:1500000;
  const R=deep?25:400;
  let cands=[];
  for(let round=0;round<4&&!cands.length;round++){
    for(let r=0;r<R;r++){
      const cars=randomBoard(nCars,nBlock,rng);
      if(!cars) continue;
      const k=keyOf(cars);
      if(used.has(k)) continue;
      const res=solveBoard(cars,cap);
      if(!res||res.par<2) continue;
      cands.push({cars,par:res.par,path:res.path,key:k,score:Math.abs(res.par-t)});
    }
  }
  cands.sort((a,b)=>a.score-b.score);
  const pool=cands.slice(0,deep?2:1);
  if(deep){
    for(const c of pool){
      for(let it=0;it<15;it++){
        if(c.score===0) break;
        const m=mutate(c.cars,rng,1+((rng()*2)|0));
        if(!m) continue;
        const k=keyOf(m);
        if(used.has(k)) continue;
        const r2=solveBoard(m,cap);
        if(!r2||r2.par<2) continue;
        const s2=Math.abs(r2.par-t);
        if(s2<c.score){ c.cars=m; c.par=r2.par; c.path=r2.path; c.key=k; c.score=s2; }
      }
    }
    pool.sort((a,b)=>a.score-b.score);
  }
  const tol=t<=6?1:2;
  const best=pool.find(c=>c.score<=tol)||pool[0];
  if(!best){ console.error('FAILED level',li,'target',t); process.exit(1); }
  if(!verifyLegal(best.cars,best.path)){ console.error('ILLEGAL',li); process.exit(1); }
  used.add(best.key);
  picked.push(best);
  console.log(`L${li+1} target=${t} par=${best.par} cars=${best.cars.length} (cands=${cands.length},${Date.now()-t0}ms)`);
}
picked.sort((a,b)=>a.par-b.par);
const out=picked.map(L=>({cars:L.cars.map(c=>[c.r,c.c,c.len,c.vert?1:0]),par:L.par,sol:L.path}));
fs.writeFileSync(__dirname+'/esc50.json',JSON.stringify(out));
fs.writeFileSync(__dirname+'/esc50raw.txt','const RAW='+JSON.stringify(out)+';');
console.log('pars:',picked.map(L=>L.par).join(','));
console.log('OK saved tools/esc50.json + esc50raw.txt');
