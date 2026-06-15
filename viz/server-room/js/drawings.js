import { ROOM, DIM, LAYOUT, LOAD, PROJECT } from './config.js';

// ---- SVG 小工具 ----
const NS = 'http://www.w3.org/2000/svg';
const esc = s => String(s);
function el(tag, attr, kids){
  const a = Object.entries(attr||{}).map(([k,v])=>`${k}="${esc(v)}"`).join(' ');
  return `<${tag} ${a}>${kids||''}</${tag}>`;
}
function txt(x,y,s,o={}){
  return el('text',{x,y,fill:o.fill||'#cdd8d2','font-family':o.f||'JBMono, monospace',
    'font-size':o.s||12,'text-anchor':o.a||'start','font-weight':o.w||400,
    'letter-spacing':o.ls||0,transform:o.t||''}, esc(s));
}
function line(x1,y1,x2,y2,o={}){return el('line',{x1,y1,x2,y2,stroke:o.c||'#2a3a42',
  'stroke-width':o.w||1,'stroke-dasharray':o.d||'',opacity:o.o??1});}
function rect(x,y,w,h,o={}){return el('rect',{x,y,width:w,height:h,fill:o.f||'none',
  stroke:o.c||'#3a4a52','stroke-width':o.w||1,rx:o.r||0,'stroke-dasharray':o.d||'',opacity:o.o??1});}

// 尺寸线(带端点斜线)
function dim(x1,y1,x2,y2,label,o={}){
  const c=o.c||'#76b900', off=6;
  let ticks='';
  if(y1===y2){ ticks=line(x1,y1-off,x1,y1+off,{c})+line(x2,y2-off,x2,y2+off,{c}); }
  else { ticks=line(x1-off,y1,x1+off,y1,{c})+line(x2-off,y2,x2+off,y2,{c}); }
  const mx=(x1+x2)/2, my=(y1+y2)/2;
  const lab = y1===y2 ? txt(mx,my-5,label,{a:'middle',fill:c,s:11})
                      : txt(mx-5,my,label,{a:'middle',fill:c,s:11,t:`rotate(-90 ${mx-5} ${my})`});
  return line(x1,y1,x2,y2,{c,w:1})+ticks+lab;
}
// 图框 + 标题栏
function frame(W,H,title,code){
  const tbW=330, tbH=96, tx=W-tbW-12, ty=H-tbH-12;
  let s = rect(8,8,W-16,H-16,{c:'#3a4a52',w:1.5});
  s += rect(14,14,W-28,H-28,{c:'#1f2a30',w:.7});
  s += rect(tx,ty,tbW,tbH,{c:'#3a4a52',w:1.2,f:'#0a0f13'});
  s += line(tx,ty+30,tx+tbW,ty+30,{c:'#3a4a52'});
  s += line(tx,ty+63,tx+tbW,ty+63,{c:'#3a4a52'});
  s += line(tx+tbW*0.6,ty,tx+tbW*0.6,ty+63,{c:'#3a4a52'});
  s += txt(tx+12,ty+20,'DJCH · 机房工程',{fill:'#76b900',s:12,w:600,ls:1});
  s += txt(tx+12,ty+50,title,{fill:'#eafff0',s:14,w:600});
  s += txt(tx+tbW*0.6+10,ty+45,PROJECT.name.split('·')[1]?.trim()||'小型机房',{fill:'#6f8079',s:9});
  s += txt(tx+12,ty+82,`图号 ${code}`,{fill:'#6f8079',s:10});
  s += txt(tx+tbW*0.45,ty+82,`比例 ${PROJECT.scale}`,{fill:'#6f8079',s:10});
  s += txt(tx+tbW*0.72,ty+82,PROJECT.date,{fill:'#6f8079',s:10});
  return s;
}
function svg(W,H,body){return `<svg viewBox="0 0 ${W} ${H}" xmlns="${NS}">${body}</svg>`;}

// 区域填充图案
const HATCH = `<defs>
  <pattern id="hot" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#ff4d57" stroke-width="1.1" opacity=".5"/></pattern>
  <pattern id="cold" width="8" height="8" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
    <line x1="0" y1="0" x2="0" y2="8" stroke="#2fe0d6" stroke-width="1.1" opacity=".45"/></pattern>
  <pattern id="raised" width="14" height="14" patternUnits="userSpaceOnUse">
    <rect width="14" height="14" fill="none" stroke="#15242c" stroke-width=".7"/></pattern>
</defs>`;

// ============ 1. 平面图 ============
export function planSVG(){
  const S=0.11, OX=78, OY=64;
  const P=(z,x)=>[OX+z*S, OY+x*S];               // z=长(横), x=宽(纵)
  const W=1120, H=820;
  let b=HATCH;
  b+=frame(W,H,'机房平面布置图','DJCH-MDC-PL01');

  // 高架地板底
  const [rx0,ry0]=P(0,0),[rx1,ry1]=P(ROOM.L,ROOM.W);
  b+=rect(rx0,ry0,rx1-rx0,ry1-ry0,{f:'url(#raised)',c:'#3a4a52',w:1.6});
  // 墙体(双线)
  b+=rect(rx0-5,ry0-5,(rx1-rx0)+10,(ry1-ry0)+10,{c:'#5a6a72',w:2.5});

  // 区域填充
  const band=(x0,x1,fill,op=1)=>{const[a,y0]=P(0,x0),[,y1]=P(0,x1);
    return rect(rx0,y0,rx1-rx0,y1-y0,{f:fill,o:op});};
  b+=band(LAYOUT.hotAisle.x0,LAYOUT.hotAisle.x1,'url(#hot)');
  b+=band(LAYOUT.coldAisle.x0,LAYOUT.coldAisle.x1,'url(#cold)',.5);

  // 机柜行(机柜 / 行级空调 / 列头柜)
  for(const u of LAYOUT.units){
    const isAC=u.type==='inrow', isRpp=u.type==='rpp';
    const w = isAC?DIM.inrow.W:DIM.rack.W;
    const[x0,y0]=P(u.z,LAYOUT.rowDepth.x0);const[x1,y1]=P(u.z+w,LAYOUT.rowDepth.x1);
    const col=isAC?'#2fe0d6':'#76b900';
    const fill=isAC?'#0c2826':(isRpp?'#13251a':'#141d24');
    b+=rect(x0,y0,x1-x0,y1-y0,{f:fill,c:col,w:1.4});
    b+=line(x0,y1,x1,y1,{c:col,w:2.4});   // 正面线(朝冷通道)
    b+=txt((x0+x1)/2,(y0+y1)/2+4,u.tag,{a:'middle',fill:isAC?'#2fe0d6':'#eafff0',s:isAC?10:(isRpp?9:12),w:600,
      t:(isAC||isRpp)?`rotate(-90 ${(x0+x1)/2} ${(y0+y1)/2+4})`:''});
  }
  // 强电(进线/UPS/电池)—— 贴入口端墙(z=L)门左侧, 正面对齐朝室内
  const EP=LAYOUT.entryPower;
  for(const it of EP.items){
    const d=DIM[it.type];
    const[x0,y0]=P(EP.frontZ, it.x-d.W/2);const[x1,y1]=P(EP.frontZ+d.D, it.x+d.W/2);
    b+=rect(x0,y0,x1-x0,y1-y0,{f:'#1a1410',c:'#ffb020',w:1.3});
    b+=line(x0,y0,x0,y1,{c:'#ffb020',w:2.2});  // 正面线(朝室内, z 小侧)
    b+=txt((x0+x1)/2,(y0+y1)/2+3,it.tag,{a:'middle',fill:'#ffb020',s:9,w:600});
  }
  b+=txt(P(EP.frontZ,2100)[0], P(0,500)[1], '强电区',{fill:'#ffb020',s:9,a:'middle'});
  // 运维工作台(顶 z=0 墙横放: 长边沿 x)
  const wb=LAYOUT.workbench, wbW=DIM.workbench.W, wbD=DIM.workbench.D;
  const[wx0,wy0]=P(wb.z-wbD/2, wb.x-wbW/2),[wx1,wy1]=P(wb.z+wbD/2, wb.x+wbW/2);
  b+=rect(wx0,wy0,wx1-wx0,wy1-wy0,{f:'#101a10',c:'#76b900',w:1.2,r:2});
  b+=txt((wx0+wx1)/2,(wy0+wy1)/2+3,'工作台(双屏)',{a:'middle',fill:'#76b900',s:9,w:600});
  // 气体灭火 FM200: 控制盘(右墙近门)+ 顶部喷头◉ + 烟感○
  const FR=LAYOUT.fire;
  const[fpx,fpy]=P(FR.panel.z, FR.panel.x);
  b+=rect(fpx-7,fpy-15,14,30,{f:'#3a0c0e',c:'#ff4d57',w:1.5});
  b+=txt(fpx-12,fpy+3,'FM200',{a:'end',fill:'#ff4d57',s:8.5,w:600});
  for(const n of FR.nozzles){const[nx,ny]=P(n.z,n.x);
    b+=el('circle',{cx:nx,cy:ny,r:4.5,fill:'none',stroke:'#ff4d57','stroke-width':1.3})
     +el('circle',{cx:nx,cy:ny,r:1.6,fill:'#ff4d57'});}
  for(const s of FR.smoke){const[sx,sy]=P(s.z,s.x);
    b+=el('circle',{cx:sx,cy:sy,r:4,fill:'none',stroke:'#cdd8d2','stroke-width':1.1,'stroke-dasharray':'2 2'})
     +el('circle',{cx:sx,cy:sy,r:1.2,fill:'#ff4d57'});}
  // 屋顶冷凝器位(屋面, 虚线示意 + 注)
  for(const c of LAYOUT.roofCondensers){
    const[cx0]=P(0,c.x-DIM.condenser.W/2);
    b+=rect(rx0-36,cx0,22,DIM.condenser.W*S,{f:'none',c:'#6f8079',w:1,d:'4 3'});
  }
  b+=txt(rx0-46,OY+3000*S,'屋顶冷凝器 ×3(屋面)',{fill:'#6f8079',s:9,t:`rotate(-90 ${rx0-46} ${OY+3000*S})`});
  // 隔音门(右端墙)
  const[dx,dy]=P(ROOM.L,4400);
  b+=line(dx,dy,dx,dy-1100*S,{c:'#76b900',w:3});
  b+=el('path',{d:`M ${dx} ${dy} A ${1100*S} ${1100*S} 0 0 0 ${dx-1100*S} ${dy-1100*S}`,fill:'none',stroke:'#76b900','stroke-width':1,'stroke-dasharray':'4 3'});
  b+=txt(dx-30,dy+18,'隔音门',{fill:'#76b900',s:10});

  // 尺寸标注
  b+=dim(rx0,ry0-40,rx1,ry0-40,`总长 ${ROOM.L}`);
  b+=dim(rx0-44,ry0,rx0-44,ry1,`总宽 ${ROOM.W}`);
  const[hx0]=P(0,LAYOUT.hotAisle.x0),[hx1]=P(0,LAYOUT.hotAisle.x1);
  b+=dim(rx1+22,OY+LAYOUT.hotAisle.x0*S,rx1+22,OY+LAYOUT.hotAisle.x1*S,'热通道 800');
  b+=dim(rx1+22,OY+LAYOUT.rowDepth.x0*S,rx1+22,OY+LAYOUT.rowDepth.x1*S,'机柜 1200');
  b+=dim(rx1+22,OY+LAYOUT.coldAisle.x0*S,rx1+22,OY+LAYOUT.coldAisle.x1*S,'冷通道+检修');
  // 行长(含列头柜)
  const u0=LAYOUT.units[0], uN=LAYOUT.units[LAYOUT.units.length-1];
  const uNw = uN.type==='inrow'?DIM.inrow.W:DIM.rack.W;
  b+=dim(OX+u0.z*S, ry1+30, OX+(uN.z+uNw)*S, ry1+30, `机柜行 ${uN.z+uNw-u0.z}`);

  // 指北 + 图例
  b+=txt(rx1-8,ry0+18,'N↑',{fill:'#6f8079',s:13,a:'end',f:'Orbitron'});
  return svg(W,H,b);
}

// ============ 2. 剖面图 ============
export function sectionSVG(){
  const S=0.16, OX=120, OYbase=520;   // y 向上为正, base 为地坪
  const W=1120, H=620;
  const Yp = y => OYbase - y*S;        // mm 高度 -> px
  const Xp = x => OX + x*S;            // mm 宽 -> px
  let b=HATCH;
  b+=frame(W,H,'机房剖面图 (横剖)','DJCH-MDC-SC01');

  const wallL=Xp(0), wallR=Xp(ROOM.W);
  // 结构面
  b+=line(wallL,Yp(0),wallR,Yp(0),{c:'#5a6a72',w:2});                 // 结构地坪
  b+=rect(wallL-14,Yp(ROOM.H)-2,14,(ROOM.H)*S+2,{f:'#10171d',c:'#5a6a72',w:1.5}); // 左墙
  b+=rect(wallR,Yp(ROOM.H)-2,14,(ROOM.H)*S+2,{f:'#10171d',c:'#5a6a72',w:1.5});    // 右墙
  // 墙内岩棉填充示意
  b+=txt(wallL-7,Yp(ROOM.H/2),'隔',{a:'middle',fill:'#6f8079',s:8,t:`rotate(-90 ${wallL-7} ${Yp(ROOM.H/2)})`});

  // 高架地板
  b+=rect(wallL,Yp(ROOM.raisedFloor),wallR-wallL,ROOM.raisedFloor*S,{f:'url(#raised)',c:'#3a4a52',w:1.4});
  // 吊顶
  b+=rect(wallL,Yp(ROOM.H)-2,wallR-wallL,8,{f:'#0c1216',c:'#3a4a52',w:1.2});
  b+=line(wallL,Yp(ROOM.H)+10,wallR,Yp(ROOM.H)+10,{c:'#1f2a30',d:'3 3'}); // 屋面虚线(原木屋架)
  b+=txt(Xp(ROOM.W/2),Yp(ROOM.H)+24,'原木屋架(吊顶上保留,封闭)',{a:'middle',fill:'#6f8079',s:9});

  // 机柜剖面(在 row 区, x≈1000..2200)
  const cabH=DIM.rack.H, base=ROOM.raisedFloor;
  const cx0=Xp(LAYOUT.rowDepth.x0),cx1=Xp(LAYOUT.rowDepth.x1);
  b+=rect(cx0,Yp(base+cabH),cx1-cx0,cabH*S,{f:'#141d24',c:'#76b900',w:1.4});
  b+=txt((cx0+cx1)/2,Yp(base+cabH/2),'42U 机柜',{a:'middle',fill:'#eafff0',s:11,w:600});
  b+=txt((cx0+cx1)/2,Yp(base+cabH/2)+16,'2013 高',{a:'middle',fill:'#6f8079',s:9});
  // 热通道封闭顶(左侧 x 0..1000)
  const hx0=Xp(LAYOUT.hotAisle.x0),hx1=Xp(LAYOUT.rowDepth.x0);
  b+=rect(hx0,Yp(base+cabH)-2,hx1-hx0+2,4,{f:'#2fe0d6',o:.5});
  b+=el('rect',{x:hx0,y:Yp(base+cabH),width:hx1-hx0,height:cabH*S,fill:'url(#hot)',opacity:.4});
  b+=txt((hx0+hx1)/2,Yp(base+cabH/2),'热通道',{a:'middle',fill:'#ff4d57',s:9,t:`rotate(-90 ${(hx0+hx1)/2} ${Yp(base+cabH/2)})`});
  // 冷通道(右)
  b+=el('rect',{x:cx1,y:Yp(base),width:wallR-cx1,height:cabH*S,fill:'url(#cold)',opacity:.3});
  b+=txt((cx1+wallR)/2,Yp(base+300),'冷通道(送风)',{a:'middle',fill:'#2fe0d6',s:10});
  // 桥架
  b+=rect(cx0+6,Yp(ROOM.H-380),60,10,{f:'#1a242b',c:'#6f8079',w:1});
  b+=txt(cx0+40,Yp(ROOM.H-300),'桥架',{a:'middle',fill:'#6f8079',s:8});

  // 标高链(左侧)
  const elev=(y,t)=>line(wallL-40,Yp(y),wallL-8,Yp(y),{c:'#76b900'})+
    el('path',{d:`M ${wallL-26} ${Yp(y)-5} l 5 5 l -5 5 z`,fill:'none',stroke:'#76b900'})+
    txt(wallL-46,Yp(y)+3,t,{a:'end',fill:'#76b900',s:10});
  b+=line(wallL-40,Yp(0),wallL-40,Yp(ROOM.H),{c:'#2a3a42'});
  b+=elev(0,'±0.000');
  b+=elev(ROOM.raisedFloor,'+0.150 架空地板');
  b+=elev(base+cabH,'+2.163 柜顶');
  b+=elev(ROOM.H,'+2.850 吊顶');
  // 净高
  b+=dim(wallR+30,Yp(ROOM.H),wallR+30,Yp(ROOM.raisedFloor),'净高 2700');
  b+=dim(wallL,Yp(ROOM.raisedFloor)+40,Xp(ROOM.raisedFloor*0+ROOM.W),Yp(ROOM.raisedFloor)+40,'');
  return svg(W,H,b);
}

// ============ 3. 配电系统图(单线) ============
export function powerSVG(){
  const W=1120, H=620; let b='';
  b+=frame(W,H,'配电系统图 (单线)','DJCH-MDC-EE01');
  const box=(x,y,w,h,t1,t2,col)=>rect(x,y,w,h,{c:col||'#3a4a52',w:1.4,f:'#0c1216',r:4})+
    txt(x+w/2,y+h/2-3,t1,{a:'middle',fill:'#eafff0',s:12,w:600})+
    (t2?txt(x+w/2,y+h/2+15,t2,{a:'middle',fill:col||'#6f8079',s:10}):'');
  const wire=(x1,y1,x2,y2,c)=>line(x1,y1,x2,y2,{c:c||'#76b900',w:2});
  const cx=120;
  // 主链
  b+=box(cx,70,150,56,'三相市电进线','380/220V',  '#9aa7a0');
  b+=wire(cx+75,126,cx+75,160);
  b+=box(cx,160,150,56,`主开关 ${LOAD.mainBreakerA}A`,'三相五线','#ffb020');
  b+=wire(cx+75,216,cx+75,250);
  // 分两路: UPS路 + 制冷/照明路
  b+=wire(cx+75,250,cx+520,250);
  b+=box(cx,250,150,56,`UPS ${LOAD.upsKVA}kVA`,'在线双变换','#ffb020');
  b+=wire(cx+75,306,cx+75,340);
  b+=box(cx-40,340,90,46,'电池柜',`${LOAD.upsBackupMin}min`,'#2fe0d6');
  b+=wire(cx+75,306,cx+75,400);
  b+=box(cx,400,150,56,'强电列头柜 RPP','6 路 + 备用','#76b900');
  // 制冷/照明旁路
  b+=box(cx+450,250,150,56,'制冷 / 照明','市电直供','#9aa7a0');
  b+=txt(cx+525,330,'(不上 UPS)',{a:'middle',fill:'#6f8079',s:10});
  // 列头柜出线 -> 6 PDU
  const py=470, sx=cx-30;
  b+=wire(cx+75,456,cx+75,py);
  b+=wire(70,py,70+6*150,py);
  for(let i=0;i<6;i++){
    const x=72+i*150;
    b+=wire(x+55,py,x+55,py+24);
    b+=rect(x,py+24,110,60,{c:'#76b900',w:1.2,f:'#101a10',r:4});
    b+=txt(x+55,py+46,`R0${i+1} PDU`,{a:'middle',fill:'#76b900',s:11,w:600});
    b+=txt(x+55,py+64,`${LOAD.feederA}A·10kW`,{a:'middle',fill:'#6f8079',s:9});
  }
  // 旁注
  b+=txt(cx+260,200,`Σ IT ${LOAD.itKW}kW  ·  整机房 ≈${LOAD.totalFacilityKW}kW`,{fill:'#2fe0d6',s:12});
  b+=txt(cx+450,430,'PDU 型号: '+LOAD.pduModel,{fill:'#6f8079',s:10});
  b+=txt(cx+450,452,'⚠ 单组 UPS = 无 N+1 冗余(已知限制)',{fill:'#ff4d57',s:10});
  return svg(W,H,b);
}

// ============ 4. 气流 / 散热示意 ============
export function airflowSVG(){
  const W=1120, H=600; let b=HATCH;
  b+=frame(W,H,'气流组织 / 散热示意 (横剖)','DJCH-MDC-HV01');
  const S=0.142, OX=120, BASE=480;
  const Yp=y=>BASE-y*S, Xp=x=>OX+x*S;
  const base=ROOM.raisedFloor, cabH=DIM.rack.H;
  // 地/顶
  b+=line(Xp(0),Yp(0),Xp(ROOM.W),Yp(0),{c:'#5a6a72',w:2});
  b+=line(Xp(0),Yp(ROOM.H),Xp(ROOM.W),Yp(ROOM.H),{c:'#3a4a52',w:1.4});
  b+=txt(Xp(ROOM.W/2),Yp(ROOM.H)-8,'吊顶回风腔',{a:'middle',fill:'#6f8079',s:10});
  // 机柜
  const cx0=Xp(LAYOUT.rowDepth.x0),cx1=Xp(LAYOUT.rowDepth.x1);
  b+=rect(cx0,Yp(base+cabH),cx1-cx0,cabH*S,{f:'#141d24',c:'#76b900',w:1.4});
  b+=txt((cx0+cx1)/2,Yp(base+cabH/2),'机柜',{a:'middle',fill:'#eafff0',s:11,w:600});
  // 行级空调(贴机柜右, 取热排冷)
  const ax0=cx1+6,ax1=ax0+44;
  b+=rect(ax0,Yp(base+cabH),ax1-ax0,cabH*S,{f:'#0c2826',c:'#2fe0d6',w:1.4});
  b+=txt((ax0+ax1)/2,Yp(base+cabH/2),'AC',{a:'middle',fill:'#2fe0d6',s:10,w:600,t:`rotate(-90 ${(ax0+ax1)/2} ${Yp(base+cabH/2)})`});
  // 热通道(左, 封闭)
  const hx0=Xp(LAYOUT.hotAisle.x0),hx1=cx0;
  b+=el('rect',{x:hx0,y:Yp(base+cabH),width:hx1-hx0,height:cabH*S,fill:'url(#hot)',opacity:.4});
  b+=line(hx0,Yp(base+cabH)-2,ax1,Yp(base+cabH)-2,{c:'#2fe0d6',w:2.4}); // 封闭顶
  b+=txt((hx0+hx1)/2,Yp(base+cabH+220),'封闭热通道',{a:'middle',fill:'#ff4d57',s:10});
  // 冷通道(右)
  b+=el('rect',{x:ax1,y:Yp(base),width:Xp(ROOM.W)-ax1,height:cabH*S,fill:'url(#cold)',opacity:.3});
  b+=txt((ax1+Xp(ROOM.W))/2,Yp(base+cabH+220),'冷通道',{a:'middle',fill:'#2fe0d6',s:10});

  // 箭头
  const arrow=(x1,y1,x2,y2,c)=>{const ang=Math.atan2(y2-y1,x2-x1);
    return line(x1,y1,x2,y2,{c,w:2.4})+
    el('path',{d:`M ${x2} ${y2} L ${x2-10*Math.cos(ang-.4)} ${y2-10*Math.sin(ang-.4)} L ${x2-10*Math.cos(ang+.4)} ${y2-10*Math.sin(ang+.4)} z`,fill:c});};
  // 冷风: 空调出风(底/前)-> 冷通道 -> 机柜进风
  b+=arrow(ax1+50,Yp(base+400),cx1+6,Yp(base+cabH/2),'#2fe0d6');
  b+=arrow(ax1+90,Yp(base+900),ax1+40,Yp(base+cabH-200),'#2fe0d6');
  b+=txt(ax1+120,Yp(base+650),'冷风 ~22-24℃',{fill:'#2fe0d6',s:11});
  // 热风: 机柜出风 -> 热通道 -> 空调回风
  b+=arrow(cx0-6,Yp(base+cabH/2),hx0+30,Yp(base+cabH/2),'#ff4d57');
  b+=arrow(hx0+40,Yp(base+cabH-150),ax0+10,Yp(base+cabH-150),'#ff4d57');
  b+=txt((hx0+cx0)/2,Yp(base+cabH/2)-12,'热风',{a:'middle',fill:'#ff4d57',s:11});
  // 屋面 + 屋顶冷凝器(置于屋顶)
  const roofYpx = Yp(ROOM.H) - 16;
  b+=line(Xp(0)-20,roofYpx,Xp(ROOM.W)+20,roofYpx,{c:'#3a4a52',w:1.4,d:'3 2'});
  b+=txt(Xp(0)-8,roofYpx-6,'屋面 (屋顶)',{fill:'#6f8079',s:9});
  const condX=(ax0+ax1)/2;
  b+=rect(condX-58,roofYpx-44,116,36,{f:'#10171d',c:'#6f8079',w:1.2});
  b+=txt(condX,roofYpx-22,'屋顶冷凝器',{a:'middle',fill:'#9aa7a0',s:10,w:600});
  // 钢支架
  b+=line(condX-40,roofYpx-8,condX-40,roofYpx,{c:'#6f8079'})+line(condX+40,roofYpx-8,condX+40,roofYpx,{c:'#6f8079'});
  // 冷媒管: 行级空调 → 穿吊顶 → 屋顶冷凝器
  b+=arrow(condX,Yp(base+cabH-120),condX,roofYpx-6,'#9aa7a0');
  b+=txt(condX+10,Yp(ROOM.H-260),'冷媒管',{fill:'#9aa7a0',s:9});
  return svg(W,H,b);
}
