/* ===== بانک پرچم ۳: آفریقا، آمریکا و اقیانوسیه (۵۵ پرچم) ===== */
const FLAGS3=(()=>{
  const SW=inner=>`<svg viewBox="0 0 60 40">${inner}</svg>`;
  const R=(x,y,w,h,f)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"/>`;
  const h3=(a,b,c)=>R(0,0,60,13.4,a)+R(0,13.3,60,13.4,b)+R(0,26.6,60,13.4,c);
  const v3=(a,b,c)=>R(0,0,20.1,40,a)+R(19.9,0,20.2,40,b)+R(39.9,0,20.1,40,c);
  const triH=(c,x=20)=>`<polygon points="0,0 ${x},20 0,40" fill="${c}"/>`;
  function starPts(cx,cy,r,rot,n){let p='';for(let i=0;i<n*2;i++){const rr=i%2?r*0.42:r,a=(rot+i*180/n)*Math.PI/180;p+=`${(cx+rr*Math.cos(a)).toFixed(2)},${(cy+rr*Math.sin(a)).toFixed(2)} `;}return p;}
  const star=(cx,cy,r,rot,n,f)=>`<polygon points="${starPts(cx,cy,r,rot,n)}" fill="${f}"/>`;
  const star5=(cx,cy,r,rot,f)=>star(cx,cy,r,rot,5,f);
  const cres=(cx,cy,r,fg,bg)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fg}"/><circle cx="${(cx+r*0.32).toFixed(1)}" cy="${cy}" r="${(r*0.82).toFixed(1)}" fill="${bg}"/>`;
  function crescentP(cx,cy,r,fill){const t=0.9,x1=cx+r*Math.cos(-t),y1=cy+r*Math.sin(-t),x2=cx+r*Math.cos(t),y2=cy+r*Math.sin(t),ri=r*0.85;return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 1 0 ${x2.toFixed(1)} ${y2.toFixed(1)} A${ri.toFixed(1)} ${ri.toFixed(1)} 0 1 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="${fill}"/>`;}
  function rays(cx,cy,r1,r2,n,f,w){let s='';for(let i=0;i<n;i++){const a=i*360/n*Math.PI/180;s+=`<line x1="${(cx+r1*Math.cos(a)).toFixed(1)}" y1="${(cy+r1*Math.sin(a)).toFixed(1)}" x2="${(cx+r2*Math.cos(a)).toFixed(1)}" y2="${(cy+r2*Math.sin(a)).toFixed(1)}" stroke="${f}" stroke-width="${w}"/>`;}return s;}
  const UKI='<rect width="60" height="40" fill="#012169"/><path d="M0 0L60 40M60 0L0 40" stroke="#ffffff" stroke-width="8"/><path d="M0 0L60 40M60 0L0 40" stroke="#C8102E" stroke-width="2.6"/><rect x="25" width="10" height="40" fill="#fff"/><rect y="15" width="60" height="10" fill="#fff"/><rect x="27" width="6" height="40" fill="#C8102E"/><rect y="17" width="60" height="6" fill="#C8102E"/>';
  const miniUK=(x,y,w,h)=>`<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 60 40">${UKI}</svg>`;
  const LEAF=[[0,-10],[2.2,-6.5],[6,-7.5],[4.5,-4],[9.5,-3],[5.5,-0.5],[7,3],[3.5,2.5],[2.5,6.5],[1.2,6.5],[1.2,10],[-1.2,10],[-1.2,6.5],[-2.5,6.5],[-3.5,2.5],[-7,3],[-5.5,-0.5],[-9.5,-3],[-4.5,-4],[-6,-7.5],[-2.2,-6.5]];
  const leaf=(cx,cy,s,f)=>`<polygon points="${LEAF.map(([x,y])=>`${(cx+x*s).toFixed(1)},${(cy+y*s).toFixed(1)}`).join(' ')}" fill="${f}"/>`;
  return [
    {id:'ma',fa:'مراکش',en:['morocco'],svg:SW(R(0,0,60,40,'#C1272D')+`<polygon points="${starPts(30,20,6,-90,5)}" fill="none" stroke="#006233" stroke-width="1.6"/>`)},
    {id:'dz',fa:'الجزایر',en:['algeria'],svg:SW(R(0,0,30,40,'#006633')+R(30,0,30,40,'#ffffff')+crescentP(30,20,6,'#D21034')+star5(32.5,20,1.8,-90,'#D21034'))},
    {id:'tn',fa:'تونس',en:['tunisia'],svg:SW(R(0,0,60,40,'#E70013')+'<circle cx="30" cy="20" r="8" fill="#ffffff"/>'+cres(30,20,4.5,'#E70013','#ffffff')+star5(32.5,20,1.8,-90,'#E70013'))},
    {id:'ly',fa:'لیبی',en:['libya'],svg:SW(R(0,0,60,10,'#E70013')+R(0,10,60,20,'#000000')+R(0,30,60,10,'#239E46')+cres(30,20,4,'#ffffff','#000000')+star5(32.5,20,1.5,-90,'#ffffff'))},
    {id:'sd',fa:'سودان',en:['sudan'],svg:SW(h3('#D21034','#ffffff','#000000')+triH('#007229'))},
    {id:'so',fa:'سومالی',en:['somalia'],svg:SW(R(0,0,60,40,'#4189DD')+star5(30,20,7,-90,'#ffffff'))},
    {id:'ng',fa:'نیجریه',en:['nigeria'],svg:SW(v3('#008751','#ffffff','#008751'))},
    {id:'gh',fa:'غنا',en:['ghana'],svg:SW(h3('#CE1126','#FCD116','#006B3F')+star5(30,20,3.5,-90,'#000000'))},
    {id:'sn',fa:'سنگال',en:['senegal'],svg:SW(v3('#00853F','#FDEF42','#E40521')+star5(30,20,3,-90,'#00853F'))},
    {id:'cm',fa:'کامرون',en:['cameroon'],svg:SW(v3('#007A5E','#CE1126','#FCD116')+star5(30,20,3,-90,'#FCD116'))},
    {id:'ci',fa:'ساحل عاج',en:['ivorycoast','cotedivoire'],svg:SW(v3('#F77F00','#ffffff','#009E60'))},
    {id:'ml',fa:'مالی',en:['mali'],svg:SW(v3('#14B53A','#FCD116','#CE1126'))},
    {id:'bf',fa:'بورکینافاسو',en:['burkinafaso','burkina'],svg:SW(R(0,0,60,20,'#EF2B2D')+R(0,20,60,20,'#009E60')+star5(30,20,3.5,-90,'#FCD116'))},
    {id:'ne',fa:'نیجر',en:['niger'],svg:SW(h3('#E05206','#ffffff','#0DB02B')+'<circle cx="30" cy="20" r="4" fill="#E05206"/>')},
    {id:'td',fa:'چاد',en:['chad','romania'],svg:SW(v3('#002654','#FECB00','#CE1126'))},
    {id:'mg',fa:'ماداگاسکار',en:['madagascar'],svg:SW(R(0,0,20,40,'#ffffff')+R(20,0,40,20,'#FC3D32')+R(20,20,40,20,'#007E3A'))},
    {id:'sl',fa:'سیرالئون',en:['sierraleone'],svg:SW(h3('#1EB53A','#ffffff','#007DB5'))},
    {id:'gn',fa:'گینه',en:['guinea'],svg:SW(v3('#CE1126','#FCD116','#009460'))},
    {id:'gm',fa:'گامبیا',en:['gambia'],svg:SW(R(0,0,60,12,'#CE1126')+R(0,12,60,2.5,'#ffffff')+R(0,14.5,60,11,'#0C1EAA')+R(0,25.5,60,2.5,'#ffffff')+R(0,28,60,12,'#009460'))},
    {id:'mr',fa:'موریتانی',en:['mauritania'],svg:SW(R(0,0,60,8,'#D01C1F')+R(0,8,60,24,'#00A95C')+R(0,32,60,8,'#D01C1F')+'<circle cx="30" cy="21.5" r="5" fill="#FFD100"/><circle cx="30" cy="19" r="4.2" fill="#00A95C"/>'+star5(30,14,1.8,-90,'#FFD100'))},
    {id:'rw',fa:'رواندا',en:['rwanda'],svg:SW(R(0,0,60,20,'#00A1DE')+R(0,20,60,10,'#FAD201')+R(0,30,60,10,'#00A651')+rays(48,10,3.5,5.5,12,'#FAD201',1)+'<circle cx="48" cy="10" r="3" fill="#FAD201"/>')},
    {id:'bw',fa:'بوتسوانا',en:['botswana'],svg:SW(R(0,0,60,40,'#75AADB')+R(0,14,60,12,'#ffffff')+R(0,17,60,6,'#000000'))},
    {id:'tz',fa:'تانزانیا',en:['tanzania'],svg:SW('<polygon points="0,0 60,0 0,40" fill="#1EB53A"/><polygon points="60,0 60,40 0,40" fill="#00A1DE"/><line x1="0" y1="40" x2="60" y2="0" stroke="#FCD116" stroke-width="9"/><line x1="0" y1="40" x2="60" y2="0" stroke="#000000" stroke-width="5.5"/>')},
    {id:'cg',fa:'کنگو',en:['congo','republicofcongo'],svg:SW('<polygon points="0,0 60,0 60,40" fill="#009543"/><polygon points="0,0 0,40 60,40" fill="#DC241F"/><line x1="0" y1="0" x2="60" y2="40" stroke="#FBDE4A" stroke-width="7"/>'+star5(11,8,2,-90,'#FBDE4A'))},
    {id:'cd',fa:'کنگوی دموکراتیک',en:['drcongo','democraticrepublicofcongo'],svg:SW(R(0,0,60,40,'#007FFF')+'<line x1="0" y1="40" x2="60" y2="0" stroke="#F7D618" stroke-width="9"/><line x1="0" y1="40" x2="60" y2="0" stroke="#CE1021" stroke-width="5.5"/>'+star5(11,9,2.5,-90,'#F7D618'))},
    {id:'ga',fa:'گابن',en:['gabon'],svg:SW(h3('#009E60','#FCD116','#3A75C4'))},
    {id:'mu',fa:'موریس',en:['mauritius'],svg:SW(R(0,0,60,10,'#EA2839')+R(0,10,60,10,'#0A3161')+R(0,20,60,10,'#FEDF00')+R(0,30,60,10,'#00A651'))},
    {id:'za',fa:'آفریقای جنوبی',en:['southafrica'],svg:SW(R(0,0,60,40,'#ffffff')+R(0,0,60,13,'#E03C31')+R(0,27,60,13,'#001489')+R(0,15,24,10,'#ffffff')+'<polygon points="20,15 62,-4 62,4 22,23" fill="#ffffff"/><polygon points="20,25 62,44 62,36 22,17" fill="#ffffff"/>'+R(0,17,22,6,'#007749')+'<polygon points="20,17 62,-2 62,2 22,21" fill="#007749"/><polygon points="20,23 62,42 62,38 22,19" fill="#007749"/><polygon points="0,8 19,20 0,32" fill="#FCB514"/><polygon points="0,11 14.5,20 0,29" fill="#000000"/>')},
    {id:'dj',fa:'جیبوتی',en:['djibouti'],svg:SW(R(0,0,60,20,'#6AB2E7')+R(0,20,60,20,'#12AD2B')+triH('#ffffff')+star5(10,20,2.5,-90,'#D21034'))},
    {id:'ss',fa:'سودان جنوبی',en:['southsudan'],svg:SW(R(0,0,60,11,'#000000')+R(0,11,60,3,'#ffffff')+R(0,14,60,12,'#DA121A')+R(0,26,60,3,'#ffffff')+R(0,29,60,11,'#009A44')+triH('#0F47AF')+star5(9,20,2.6,-90,'#FCDD09'))},
    {id:'sc',fa:'سیشل',en:['seychelles'],svg:SW('<polygon points="0,40 0,0 18,0" fill="#003DA5"/><polygon points="0,40 18,0 36,0" fill="#FEDF00"/><polygon points="0,40 36,0 54,0" fill="#D62828"/><polygon points="0,40 54,0 60,10" fill="#ffffff"/><polygon points="0,40 60,10 60,40" fill="#007A5E"/>')},
    {id:'lr',fa:'لیبریا',en:['liberia'],svg:(()=>{let s='';for(let i=0;i<11;i++)s+=R(0,(i*40/11).toFixed(2),60,(40/11+0.1).toFixed(2),i%2?'#ffffff':'#BF0A30');return SW(s+R(0,0,22,18.2,'#002868')+star5(11,9,3.5,-90,'#ffffff'));})()},
    {id:'tg',fa:'توگو',en:['togo'],svg:SW(R(0,0,60,8,'#006A4F')+R(0,8,60,8,'#FFCE00')+R(0,16,60,8,'#006A4F')+R(0,24,60,8,'#FFCE00')+R(0,32,60,8,'#006A4F')+R(0,0,24,24,'#006A4F')+star5(12,12,2.8,-90,'#FFCE00'))},
    {id:'ca',fa:'کانادا',en:['canada'],svg:SW(R(0,0,15,40,'#FF0000')+R(15,0,30,40,'#ffffff')+R(45,0,15,40,'#FF0000')+leaf(30,20,0.95,'#FF0000'))},
    {id:'br',fa:'برزیل',en:['brazil'],svg:SW(R(0,0,60,40,'#009B3A')+'<polygon points="30,4 56,20 30,36 4,20" fill="#FFDF00"/><circle cx="30" cy="20" r="7" fill="#002776"/><path d="M23.6 17.5 Q30 21.5 36.4 17.5" stroke="#ffffff" stroke-width="1.8" fill="none"/><circle cx="27" cy="18" r="0.6" fill="#fff"/><circle cx="31" cy="22.5" r="0.6" fill="#fff"/><circle cx="33.5" cy="19" r="0.5" fill="#fff"/><circle cx="28" cy="23" r="0.5" fill="#fff"/><circle cx="30" cy="17" r="0.5" fill="#fff"/>')},
    {id:'cl',fa:'شیلی',en:['chile'],svg:SW(R(0,0,60,20,'#ffffff')+R(0,20,60,20,'#D52B1E')+R(0,0,20,20,'#0039A6')+star5(10,10,3.5,-90,'#ffffff'))},
    {id:'pe',fa:'پرو',en:['peru'],svg:SW(v3('#D91023','#ffffff','#D91023'))},
    {id:'co',fa:'کلمبیا',en:['colombia'],svg:SW(R(0,0,60,20,'#FCD116')+R(0,20,60,10,'#003893')+R(0,30,60,10,'#CE1126'))},
    {id:'ve',fa:'ونزوئلا',en:['venezuela'],svg:SW(h3('#FCD116','#003893','#CE1126')+[0,1,2,3,4,5,6,7].map(i=>star5(14+i*36/7,20-3.5*Math.sin(i/7*Math.PI),1.1,-90,'#ffffff')).join(''))},
    {id:'bo',fa:'بولیوی',en:['bolivia'],svg:SW(h3('#D52B1E','#F9E300','#007934'))},
    {id:'uy',fa:'اروگوئه',en:['uruguay'],svg:(()=>{let s='';for(let i=0;i<9;i++)s+=R(0,(i*40/9).toFixed(2),60,(40/9+0.1).toFixed(2),i%2?'#0038A8':'#ffffff');return SW(s+R(0,0,26,17.8,'#ffffff')+rays(13,9,3,5,16,'#FCD116',0.8)+'<circle cx="13" cy="9" r="2.6" fill="#FCD116"/>');})()},
    {id:'cu',fa:'کوبا',en:['cuba'],svg:SW(R(0,0,60,8,'#002A8F')+R(0,8,60,8,'#ffffff')+R(0,16,60,8,'#002A8F')+R(0,24,60,8,'#ffffff')+R(0,32,60,8,'#002A8F')+triH('#CF142B')+star5(8.5,20,2.6,-90,'#ffffff'))},
    {id:'pa',fa:'پاناما',en:['panama'],svg:SW(R(0,0,30,20,'#ffffff')+R(30,0,30,20,'#D21034')+R(0,20,30,20,'#005293')+R(30,20,30,20,'#ffffff')+star5(15,10,2.5,-90,'#005293')+star5(45,30,2.5,-90,'#D21034'))},
    {id:'jm',fa:'جامائیکا',en:['jamaica'],svg:SW(R(0,0,60,40,'#009B3A')+'<path d="M0 0L60 40M60 0L0 40" stroke="#FED100" stroke-width="9"/><path d="M0 0L60 40M60 0L0 40" stroke="#000000" stroke-width="4"/>')},
    {id:'tt',fa:'ترینیداد',en:['trinidad','trinidadandtobago'],svg:SW(R(0,0,60,40,'#CE1126')+'<line x1="0" y1="0" x2="60" y2="40" stroke="#ffffff" stroke-width="10"/><line x1="0" y1="0" x2="60" y2="40" stroke="#000000" stroke-width="6.2"/>')},
    {id:'bs',fa:'باهاما',en:['bahamas'],svg:SW(R(0,0,60,13.4,'#00A9CE')+R(0,13.3,60,13.4,'#FFC72C')+R(0,26.6,60,13.4,'#00A9CE')+triH('#000000'))},
    {id:'pr',fa:'پورتوریکو',en:['puertorico'],svg:SW(R(0,0,60,8,'#EF3340')+R(0,8,60,8,'#ffffff')+R(0,16,60,8,'#EF3340')+R(0,24,60,8,'#ffffff')+R(0,32,60,8,'#EF3340')+triH('#0050A4')+star5(8.5,20,2.6,-90,'#ffffff'))},
    {id:'au',fa:'استرالیا',en:['australia'],svg:SW(R(0,0,60,40,'#00247D')+miniUK(0,0,30,20)+star(15,30,3.5,-90,7,'#ffffff')+star(45,8,2.5,-90,7,'#ffffff')+star(45,30,2.5,-90,7,'#ffffff')+star(36,19,2.5,-90,7,'#ffffff')+star(52,19,2.5,-90,7,'#ffffff')+star(47,24,2,-90,7,'#ffffff'))},
    {id:'nz',fa:'نیوزیلند',en:['newzealand'],svg:SW(R(0,0,60,40,'#00247D')+miniUK(0,0,30,20)+star(45,8,2.5,-90,5,'#CC142B')+star(45,30,2.5,-90,5,'#CC142B')+star(36,19,2.5,-90,5,'#CC142B')+star(52,19,2.5,-90,5,'#CC142B'))},
    {id:'ws',fa:'ساموآ',en:['samoa'],svg:SW(R(0,0,60,40,'#CE1126')+R(0,0,30,20,'#002B7F')+star5(8,5,1.6,-90,'#ffffff')+star5(22,5,1.6,-90,'#ffffff')+star5(15,10,1.6,-90,'#ffffff')+star5(8,15,1.6,-90,'#ffffff')+star5(22,15,1.6,-90,'#ffffff'))},
    {id:'to',fa:'تونگا',en:['tonga'],svg:SW(R(0,0,60,40,'#C10000')+R(0,0,24,20,'#ffffff')+R(9.5,3,5,14,'#C10000')+R(5,7.5,14,5,'#C10000'))},
    {id:'km',fa:'کومور',en:['comoros'],svg:SW(R(0,0,60,10,'#FFC61E')+R(0,10,60,10,'#ffffff')+R(0,20,60,10,'#CE1126')+R(0,30,60,10,'#3A75C4')+'<polygon points="0,0 24,20 0,40" fill="#009E60"/>'+cres(9,20,4.5,'#ffffff','#009E60')+star5(15,12,1,-90,'#ffffff')+star5(15,17.3,1,-90,'#ffffff')+star5(15,22.7,1,-90,'#ffffff')+star5(15,28,1,-90,'#ffffff'))},
    {id:'mw',fa:'مالاوی',en:['malawi'],svg:SW(R(0,0,60,13.4,'#000000')+R(0,13.3,60,13.4,'#CE1126')+R(0,26.6,60,13.4,'#009E60')+rays(30,6.7,3.5,6,16,'#CE1126',1)+'<circle cx="30" cy="6.7" r="3" fill="#CE1126"/>')},
    {id:'cf',fa:'آفریقای مرکزی',en:['centralafricanrepublic','centralafrica'],svg:SW(R(0,0,60,10,'#003082')+R(0,10,60,10,'#ffffff')+R(0,20,60,10,'#009E60')+R(0,30,60,10,'#FFCE00')+R(26,0,8,40,'#D21034')+star5(13,5,1.8,-90,'#FFCE00'))},
    {id:'bj',fa:'بنین',en:['benin'],svg:SW(R(0,0,24,40,'#008751')+R(24,0,36,20,'#FCD116')+R(24,20,36,20,'#E9090B'))},
    {id:'gw',fa:'گینه بیسائو',en:['guineabissau'],svg:SW(R(0,0,20,40,'#CE1126')+R(20,0,40,20,'#FCD116')+R(20,20,40,20,'#009460')+star5(10,20,2.5,-90,'#000000'))},
  ];
})();
if(typeof FlagsGame!=='undefined'&&FlagsGame.addFlags) FlagsGame.addFlags(FLAGS3);
