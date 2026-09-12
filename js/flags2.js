/* ===== بانک پرچم ۲: آسیا و اروپا (۴۸ پرچم) ===== */
const FLAGS2=(()=>{
  const SW=inner=>`<svg viewBox="0 0 60 40">${inner}</svg>`;
  const R=(x,y,w,h,f,o)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"${o?` opacity="${o}"`:''}/>`;
  const h3=(a,b,c)=>R(0,0,60,13.4,a)+R(0,13.3,60,13.4,b)+R(0,26.6,60,13.4,c);
  const v3=(a,b,c)=>R(0,0,20.1,40,a)+R(19.9,0,20.2,40,b)+R(39.9,0,20.1,40,c);
  const triH=(c,x=20)=>`<polygon points="0,0 ${x},20 0,40" fill="${c}"/>`;
  function starPts(cx,cy,r,rot,n){let p='';for(let i=0;i<n*2;i++){const rr=i%2?r*0.42:r,a=(rot+i*180/n)*Math.PI/180;p+=`${(cx+rr*Math.cos(a)).toFixed(2)},${(cy+rr*Math.sin(a)).toFixed(2)} `;}return p;}
  const star=(cx,cy,r,rot,n,f)=>`<polygon points="${starPts(cx,cy,r,rot,n)}" fill="${f}"/>`;
  const star5=(cx,cy,r,rot,f)=>star(cx,cy,r,rot,5,f);
  const cres=(cx,cy,r,fg,bg)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fg}"/><circle cx="${(cx+r*0.32).toFixed(1)}" cy="${cy}" r="${(r*0.82).toFixed(1)}" fill="${bg}"/>`;
  function serr(n,x0,dep){let d=`M0 0H${x0}`;for(let i=0;i<n;i++){const y0=i*40/n,ym=y0+20/n,y1=y0+40/n;d+=`L${x0+dep} ${ym.toFixed(1)}L${x0} ${y1.toFixed(1)}`;}return `<path d="${d}L0 40Z" fill="#ffffff"/>`;}
  const nordic=(bg,c1,c2)=>{let s=R(0,0,60,40,bg)+R(17,0,9,40,c1)+R(0,15.5,60,9,c1);if(c2)s+=R(19,0,5,40,c2)+R(0,17.5,60,5,c2);return SW(s);};
  function rays(cx,cy,r1,r2,n,f,w){let s='';for(let i=0;i<n;i++){const a=i*360/n*Math.PI/180;s+=`<line x1="${(cx+r1*Math.cos(a)).toFixed(1)}" y1="${(cy+r1*Math.sin(a)).toFixed(1)}" x2="${(cx+r2*Math.cos(a)).toFixed(1)}" y2="${(cy+r2*Math.sin(a)).toFixed(1)}" stroke="${f}" stroke-width="${w}"/>`;}return s;}
  return [
    {id:'ps',fa:'فلسطین',en:['palestine'],svg:SW(h3('#111111','#ffffff','#007A3D')+triH('#EE1C25'))},
    {id:'ae',fa:'امارات',en:['uae','emirates','unitedarabemirates'],svg:SW(R(0,0,17,40,'#FF0000')+R(17,0,43,13.4,'#00732F')+R(17,13.3,43,13.4,'#ffffff')+R(17,26.6,43,13.4,'#000000'))},
    {id:'qa',fa:'قطر',en:['qatar'],svg:SW(R(0,0,60,40,'#6A1A2B')+serr(9,22,7))},
    {id:'bh',fa:'بحرین',en:['bahrain'],svg:SW(R(0,0,60,40,'#CE1126')+serr(5,18,9))},
    {id:'kw',fa:'کویت',en:['kuwait'],svg:SW(h3('#007A3D','#ffffff','#CE1126')+'<polygon points="0,0 17,12 17,28 0,40" fill="#000000"/>')},
    {id:'sy',fa:'سوریه',en:['syria'],svg:SW(h3('#CE1126','#ffffff','#000000')+star5(23,20,3,-90,'#007A3D')+star5(37,20,3,-90,'#007A3D'))},
    {id:'lb',fa:'لبنان',en:['lebanon'],svg:SW(R(0,0,60,10,'#ED1C24')+R(0,10,60,20,'#ffffff')+R(0,30,60,10,'#ED1C24')+'<g fill="#00A651"><polygon points="30,10 25,17 35,17"/><polygon points="30,14 23.5,22 36.5,22"/><polygon points="30,18 22,26 38,26"/>'+R(28.7,25,2.6,4,'#00A651')+'</g>')},
    {id:'jo',fa:'اردن',en:['jordan'],svg:SW(h3('#000000','#ffffff','#007A3D')+triH('#CE1126')+star(10,20,2.6,-90,7,'#ffffff'))},
    {id:'ye',fa:'یمن',en:['yemen'],svg:SW(h3('#CE1126','#ffffff','#000000'))},
    {id:'az',fa:'آذربایجان',en:['azerbaijan'],svg:SW(h3('#00B5E2','#EF3340','#509E2F')+cres(29,20,4.5,'#ffffff','#EF3340')+star5(33.5,20,1.6,-90,'#ffffff'))},
    {id:'am',fa:'ارمنستان',en:['armenia'],svg:SW(h3('#D90012','#0033A0','#F2A800'))},
    {id:'ge',fa:'گرجستان',en:['georgia'],svg:SW(R(0,0,60,40,'#ffffff')+R(27,0,6,40,'#FF0000')+R(0,17,60,6,'#FF0000')+[[15,8.5],[45,8.5],[15,31.5],[45,31.5]].map(([x,y])=>R(x-1.2,y-4,2.4,8,'#FF0000')+R(x-4,y-1.2,8,2.4,'#FF0000')).join(''))},
    {id:'pk',fa:'پاکستان',en:['pakistan'],svg:SW(R(0,0,60,40,'#01411C')+R(0,0,15,40,'#ffffff')+cres(38,20,7,'#ffffff','#01411C')+star5(41.5,20,2.2,-90,'#ffffff'))},
    {id:'uz',fa:'ازبکستان',en:['uzbekistan'],svg:SW(R(0,0,60,12,'#0099B5')+R(0,12,60,1.5,'#CE1126')+R(0,13.5,60,13,'#ffffff')+R(0,26.5,60,1.5,'#CE1126')+R(0,28,60,12,'#1EB53A')+cres(10,7,4.5,'#ffffff','#0099B5')+[3,4,5].map((n,r)=>{let s='';for(let i=0;i<n;i++)s+=star5(17+i*3.5,3.2+r*3.5,1,-90,'#ffffff');return s;}).join(''))},
    {id:'kg',fa:'قرقیزستان',en:['kyrgyzstan'],svg:SW(R(0,0,60,40,'#E8112D')+rays(30,20,7,10.5,24,'#FFEF00',1.1)+'<circle cx="30" cy="20" r="5.5" fill="#E8112D" stroke="#FFEF00" stroke-width="1.6"/><path d="M25 20 Q30 14 35 20 M25 20 Q30 26 35 20" stroke="#FFEF00" stroke-width="1.2" fill="none"/>')},
    {id:'bd',fa:'بنگلادش',en:['bangladesh'],svg:SW(R(0,0,60,40,'#006A4E')+'<circle cx="27" cy="20" r="8" fill="#F42A41"/>')},
    {id:'np',fa:'نپال',en:['nepal'],svg:SW('<polygon points="18,3 38,14 24,14 42,27 18,37" fill="#003893"/><polygon points="20.5,6.5 34,14.5 25.5,14.5 37.5,25.5 20.5,33.5" fill="#DC143C"/><circle cx="25" cy="13" r="2.6" fill="#ffffff"/><circle cx="25" cy="12" r="2.6" fill="#DC143C"/>'+rays(25,26.5,3.4,4.8,8,'#ffffff',0.8)+'<circle cx="25" cy="26.5" r="3" fill="#ffffff"/>')},
    {id:'mv',fa:'مالدیو',en:['maldives'],svg:SW(R(0,0,60,40,'#D21034')+R(12,10,36,20,'#007E3A')+cres(30,20,5.5,'#ffffff','#007E3A'))},
    {id:'mm',fa:'میانمار',en:['myanmar','burma'],svg:SW(h3('#FECB00','#34B233','#EA2839')+star5(30,20,4,-90,'#ffffff'))},
    {id:'la',fa:'لائوس',en:['laos'],svg:SW(R(0,0,60,10,'#CE1126')+R(0,10,60,20,'#002868')+R(0,30,60,10,'#CE1126')+'<circle cx="30" cy="20" r="6" fill="#ffffff"/>')},
    {id:'tw',fa:'تایوان',en:['taiwan'],svg:SW(R(0,0,60,40,'#FE0000')+R(0,0,30,20,'#000095')+rays(15,10,4,7,12,'#ffffff',1.6)+'<circle cx="15" cy="10" r="3.4" fill="#ffffff"/><circle cx="15" cy="10" r="2.2" fill="#000095"/>')},
    {id:'kp',fa:'کره شمالی',en:['northkorea'],svg:SW(R(0,0,60,6,'#024FA2')+R(0,6,60,2,'#ffffff')+R(0,8,60,24,'#ED1C27')+R(0,32,60,2,'#ffffff')+R(0,34,60,6,'#024FA2')+'<circle cx="16" cy="20" r="7" fill="#ffffff"/>'+star5(16,20,4,-90,'#ED1C27'))},
    {id:'vn',fa:'ویتنام',en:['vietnam'],svg:SW(R(0,0,60,40,'#DA251D')+star5(30,20,7,-90,'#FFDE00'))},
    {id:'th',fa:'تایلند',en:['thailand'],svg:SW(R(0,0,60,6.7,'#A51931')+R(0,6.7,60,6.6,'#ffffff')+R(0,13.3,60,13.4,'#2D2A4A')+R(0,26.7,60,6.6,'#ffffff')+R(0,33.3,60,6.7,'#A51931'))},
    {id:'my',fa:'مالزی',en:['malaysia'],svg:(()=>{let s='';for(let i=0;i<14;i++)s+=R(0,(i*40/14).toFixed(2),60,(40/14+0.1).toFixed(2),i%2?'#ffffff':'#CC0001');return SW(s+R(0,0,32,22.9,'#010066')+cres(13,11.5,7,'#FFCC00','#010066')+star(21,11.5,3.5,-90,14,'#FFCC00'));})()},
    {id:'id',fa:'اندونزی',en:['indonesia'],svg:SW(R(0,0,60,20,'#FF0000')+R(0,20,60,20,'#ffffff'))},
    {id:'ph',fa:'فیلیپین',en:['philippines'],svg:SW(R(0,0,60,20,'#0038A8')+R(0,20,60,20,'#CE1126')+'<polygon points="0,0 26,20 0,40" fill="#ffffff"/>'+rays(11,20,2.6,4,8,'#FCD116',0.9)+'<circle cx="11" cy="20" r="2.2" fill="#FCD116"/>'+star5(3.5,4.5,1.6,-90,'#FCD116')+star5(3.5,35.5,1.6,-90,'#FCD116')+star5(21.5,20,1.6,-90,'#FCD116'))},
    {id:'sg',fa:'سنگاپور',en:['singapore'],svg:SW(R(0,0,60,20,'#EF3340')+R(0,20,60,20,'#ffffff')+cres(11,10,5.5,'#ffffff','#EF3340')+[90,162,234,306,18].map(a=>{const r=a*Math.PI/180;return star5(19+3.2*Math.cos(r),10-3.2*Math.sin(r),1.2,-90,'#ffffff');}).join(''))},
    {id:'be',fa:'بلژیک',en:['belgium'],svg:SW(v3('#000000','#FDDA24','#EF3340'))},
    {id:'ch',fa:'سوئیس',en:['switzerland','swiss'],svg:SW(R(0,0,60,40,'#DA291C')+R(25,8,10,24,'#ffffff')+R(18,15,24,10,'#ffffff'))},
    {id:'at',fa:'اتریش',en:['austria'],svg:SW(h3('#EF3340','#ffffff','#EF3340'))},
    {id:'pl',fa:'لهستان',en:['poland'],svg:SW(R(0,0,60,20,'#ffffff')+R(0,20,60,20,'#DC143C'))},
    {id:'cz',fa:'چک',en:['czech','czechia'],svg:SW(R(0,0,60,20,'#ffffff')+R(0,20,60,20,'#D7141A')+triH('#114B9C'))},
    {id:'hu',fa:'مجارستان',en:['hungary'],svg:SW(h3('#CE1126','#ffffff','#477050'))},
    {id:'ro',fa:'رومانی',en:['romania','chad'],svg:SW(v3('#002B7F','#FCD116','#CE1126'))},
    {id:'bg',fa:'بلغارستان',en:['bulgaria'],svg:SW(h3('#ffffff','#00966E','#D62612'))},
    {id:'ba',fa:'بوسنی',en:['bosnia','bosniaandherzegovina'],svg:SW(R(0,0,60,40,'#002395')+'<polygon points="18,0 52,40 18,40" fill="#FECB00"/>'+[0,1,2,3,4,5,6].map(i=>{const t=i/6;return star5(23+t*22,5+t*30,1.4,-90,'#ffffff');}).join(''))},
    {id:'mk',fa:'مقدونیه',en:['macedonia','northmacedonia'],svg:SW(R(0,0,60,40,'#D20000')+[0,1,2,3,4,5,6,7].map(i=>{const a=i*45*Math.PI/180;return `<line x1="${(30+5*Math.cos(a)).toFixed(1)}" y1="${(20+5*Math.sin(a)).toFixed(1)}" x2="${(30+30*Math.cos(a)).toFixed(1)}" y2="${(20+30*Math.sin(a)).toFixed(1)}" stroke="#FFE600" stroke-width="${i%2?2:3}"/>`;}).join('')+'<circle cx="30" cy="20" r="5" fill="#FFE600"/>')},
    {id:'no',fa:'نروژ',en:['norway'],svg:nordic('#BA0C2F','#ffffff','#00205B')},
    {id:'dk',fa:'دانمارک',en:['denmark'],svg:nordic('#C8102E','#ffffff')},
    {id:'fi',fa:'فنلاند',en:['finland'],svg:nordic('#ffffff','#002F6C')},
    {id:'is',fa:'ایسلند',en:['iceland'],svg:nordic('#02529C','#ffffff','#DC1E35')},
    {id:'ie',fa:'ایرلند',en:['ireland'],svg:SW(v3('#169B62','#ffffff','#FF883E'))},
    {id:'ee',fa:'استونی',en:['estonia'],svg:SW(h3('#0072CE','#000000','#ffffff'))},
    {id:'lv',fa:'لتونی',en:['latvia'],svg:SW(R(0,0,60,16,'#9D2235')+R(0,16,60,8,'#ffffff')+R(0,24,60,16,'#9D2235'))},
    {id:'lt',fa:'لیتوانی',en:['lithuania'],svg:SW(h3('#FDB913','#006A44','#C1272D'))},
    {id:'mc',fa:'موناکو',en:['monaco'],svg:'<svg viewBox="0 0 32 40"><rect width="32" height="20" fill="#E30613"/><rect y="20" width="32" height="20" fill="#ffffff"/></svg>'},
    {id:'lu',fa:'لوکزامبورگ',en:['luxembourg'],svg:SW(h3('#EF3340','#ffffff','#00A1DE'))},
  ];
})();
if(typeof FlagsGame!=='undefined'&&FlagsGame.addFlags) FlagsGame.addFlags(FLAGS2);
