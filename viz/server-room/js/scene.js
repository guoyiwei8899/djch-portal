import * as THREE from 'three';
import { OrbitControls } from '../vendor/OrbitControls.js';
import { ROOM, DIM, LAYOUT, LOAD, C } from './config.js';

// mm(房间坐标 x:0..6000 z:0..9000 y:up) -> three(m, 居中)
const m = v => v / 1000;
const X = x => (x - ROOM.W / 2) / 1000;
const Z = z => (z - ROOM.L / 2) / 1000;

let renderer, scene, camera, controls, raf, running = false;
let spin = true, labelsVisible = true, lightsOn = true;
const labels = [];
let hemi, amb;
const dimmables = [];          // {l, on, off} 可调光源
const ceilStripMats = [];      // 吊顶灯条材质
function reg(l, on, off){ l.intensity = on; dimmables.push({l, on, off}); return l; }

// ---------- 纹理 ----------
function rackTex(){
  const cv = document.createElement('canvas'); cv.width = 128; cv.height = 512;
  const g = cv.getContext('2d');
  g.fillStyle = '#0c1014'; g.fillRect(0,0,128,512);
  for(let i=0;i<42;i++){
    const y = 14 + i*11.6;
    g.fillStyle = i%2 ? '#11171d' : '#0e141a'; g.fillRect(8,y,112,10);
    g.strokeStyle = '#05080a'; g.lineWidth=1; g.strokeRect(8,y,112,10);
    // 槽内细节 + LED
    if(Math.random()>0.25){
      g.fillStyle = '#080c0f'; g.fillRect(12,y+2,104,6);
      const on = Math.random();
      g.fillStyle = on>0.7 ? '#76b900' : on>0.4 ? '#2fe0d6' : '#ffb020';
      g.fillRect(14,y+3.5,3,3);
      g.fillStyle = '#1c262c';
      for(let k=0;k<6;k++) g.fillRect(30+k*13,y+3,7,4);
    }
  }
  // 侧边竖向理线槽暗影
  g.fillStyle='rgba(0,0,0,.4)'; g.fillRect(0,0,8,512); g.fillRect(120,0,8,512);
  const t = new THREE.CanvasTexture(cv); t.anisotropy = 4; return t;
}
function grilleTex(color){
  const cv = document.createElement('canvas'); cv.width=64; cv.height=256;
  const g = cv.getContext('2d');
  g.fillStyle='#0b0f13'; g.fillRect(0,0,64,256);
  g.strokeStyle='#161e24'; g.lineWidth=2;
  for(let y=6;y<256;y+=9){ g.beginPath(); g.moveTo(4,y); g.lineTo(60,y); g.stroke(); }
  g.fillStyle=color; g.globalAlpha=.9; g.fillRect(8,230,48,5); // 底部状态条
  const t = new THREE.CanvasTexture(cv); return t;
}
// APC 穿孔前门(黑色冲孔网 + 透光 LED + 把手 + APC 铭牌)
function apcDoorTex(){
  const cv=document.createElement('canvas'); cv.width=140; cv.height=560; const g=cv.getContext('2d');
  const grd=g.createLinearGradient(0,0,140,0); grd.addColorStop(0,'#0b0e11'); grd.addColorStop(.5,'#141a1f'); grd.addColorStop(1,'#090c0f');
  g.fillStyle=grd; g.fillRect(0,0,140,560);
  for(let y=44;y<540;y+=7){ for(let x=18;x<118;x+=7){
    g.fillStyle='#05080a'; g.beginPath(); g.arc(x,y,1.7,0,7); g.fill();
    if(Math.random()>0.94){ g.fillStyle= Math.random()>.5?'#76b900':Math.random()>.5?'#2fe0d6':'#ffb020';
      g.beginPath(); g.arc(x,y,2.3,0,7); g.fill(); }
  }}
  g.strokeStyle='#1c2228'; g.lineWidth=4; g.strokeRect(7,7,126,546);
  // 把手
  g.fillStyle='#2a323a'; g.fillRect(120,150,8,250); g.fillStyle='#454f57'; g.fillRect(122,150,3,250);
  // APC 铭牌
  g.fillStyle='#070a0c'; g.fillRect(42,16,56,18);
  g.fillStyle='#76b900'; g.font='700 14px Orbitron, sans-serif'; g.textAlign='center'; g.fillText('APC',70,30);
  const t=new THREE.CanvasTexture(cv); t.anisotropy=4; return t;
}
// 百叶通风面板(UPS/电池柜)
function louverTex(accent){
  const cv=document.createElement('canvas'); cv.width=120; cv.height=440; const g=cv.getContext('2d');
  g.fillStyle='#0c1014'; g.fillRect(0,0,120,440);
  g.strokeStyle='#1b2229'; g.lineWidth=3;
  for(let y=12;y<432;y+=8){ g.beginPath(); g.moveTo(10,y); g.lineTo(110,y); g.stroke();
    g.strokeStyle='#05080a'; g.beginPath(); g.moveTo(10,y+2); g.lineTo(110,y+2); g.stroke(); g.strokeStyle='#1b2229'; }
  g.fillStyle='#070a0c'; g.fillRect(30,10,60,18); g.fillStyle=accent; g.font='700 15px Orbitron, sans-serif'; g.textAlign='center'; g.fillText('APC',60,25);
  const t=new THREE.CanvasTexture(cv); return t;
}
// UPS 图形 LCD
function upsDisplayTex(){
  const cv=document.createElement('canvas'); cv.width=220; cv.height=150; const g=cv.getContext('2d');
  g.fillStyle='#041009'; g.fillRect(0,0,220,150); g.strokeStyle='#0d3a22'; g.lineWidth=2; g.strokeRect(4,4,212,142);
  g.fillStyle='#76b900'; g.font='700 18px Orbitron, sans-serif'; g.textAlign='left'; g.fillText('APC',14,30);
  g.fillStyle='#2fe0d6'; g.font='600 12px JBMono, monospace'; g.fillText('80kVA · ONLINE',14,52);
  g.fillStyle='#0c2a18'; g.fillRect(14,64,192,18); g.fillStyle='#76b900'; g.fillRect(14,64,192*0.75,18);
  g.fillStyle='#9fe6b0'; g.font='11px JBMono, monospace'; g.fillText('LOAD  75%',14,104);
  g.fillStyle='#2fe0d6'; g.fillText('BATT  100%   12 min', 14,124);
  const t=new THREE.CanvasTexture(cv); return t;
}
// 列头柜断路器面板
function breakerTex(){
  const cv=document.createElement('canvas'); cv.width=200; cv.height=320; const g=cv.getContext('2d');
  g.fillStyle='#0a0e11'; g.fillRect(0,0,200,320);
  g.strokeStyle='#15351f'; g.lineWidth=2; g.strokeRect(4,4,192,312);
  for(let r=0;r<6;r++){ for(let c=0;c<6;c++){
    const x=18+c*29, y=20+r*48;
    g.fillStyle='#11171d'; g.fillRect(x,y,22,38); g.strokeStyle='#05080a'; g.strokeRect(x,y,22,38);
    g.fillStyle='#1c2630'; g.fillRect(x+5,y+6,12,16);  // 开关拨杆
    g.fillStyle= Math.random()>.5?'#76b900':'#2fe0d6'; g.fillRect(x+8,y+27,6,4); // 指示灯
  }}
  const t=new THREE.CanvasTexture(cv); return t;
}
// 冷通道穿孔架空地砖
function perfTileTex(){
  const cv=document.createElement('canvas'); cv.width=256; cv.height=256; const g=cv.getContext('2d');
  g.fillStyle='#0a160f'; g.fillRect(0,0,256,256);
  g.strokeStyle='#1f7a3e'; g.lineWidth=3; g.globalAlpha=.7; g.strokeRect(3,3,250,250); g.globalAlpha=1;
  for(let y=24;y<232;y+=18){ for(let x=24;x<232;x+=14){
    g.fillStyle='#04110a'; g.fillRect(x,y,7,12);
    g.fillStyle='rgba(47,224,214,.10)'; g.fillRect(x,y,7,3);
  }}
  const t=new THREE.CanvasTexture(cv); t.wrapS=t.wrapT=THREE.RepeatWrapping; return t;
}
function labelTex(text, sub, accent){
  const cv = document.createElement('canvas'); cv.width=256; cv.height=128;
  const g = cv.getContext('2d');
  g.fillStyle='rgba(8,12,15,.82)'; roundRect(g,4,30,248,66,8); g.fill();
  g.strokeStyle=accent; g.lineWidth=2; roundRect(g,4,30,248,66,8); g.stroke();
  g.fillStyle='#eafff0'; g.font='600 30px Rajdhani, sans-serif'; g.textAlign='center';
  g.fillText(text,128,66);
  if(sub){ g.fillStyle=accent; g.font='400 17px JBMono, monospace'; g.fillText(sub,128,88); }
  const t = new THREE.CanvasTexture(cv); return t;
}
function roundRect(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();}

function addLabel(text, sub, accent, pos){
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTex(text,sub,accent), depthTest:false, transparent:true }));
  sp.position.copy(pos); sp.scale.set(1.1,0.55,1); sp.renderOrder = 999;
  scene.add(sp); labels.push(sp); return sp;
}

// ---------- 构件 ----------
const matBody = new THREE.MeshStandardMaterial({ color:0x141b21, roughness:.55, metalness:.55 });
const matDark = new THREE.MeshStandardMaterial({ color:0x0c1115, roughness:.7, metalness:.3 });

function rack(u){
  const grp = new THREE.Group();
  const d=m(DIM.rack.D), w=m(DIM.rack.W), h=m(DIM.rack.H);
  // APC NetShelter 黑色框体
  const body = new THREE.Mesh(new THREE.BoxGeometry(d,h,w),
    new THREE.MeshStandardMaterial({ color:0x0b0e11, roughness:.5, metalness:.6 }));
  body.castShadow = body.receiveShadow = true; grp.add(body);
  // 穿孔前门(+x), 略凸出
  const door = new THREE.Mesh(new THREE.PlaneGeometry(w*0.965,h*0.985),
    new THREE.MeshStandardMaterial({ map:apcDoorTex(), roughness:.55, metalness:.4,
      emissive:0x0b1206, emissiveIntensity:.5 }));
  door.rotation.y = Math.PI/2; door.position.set(d/2+0.006,0,0); grp.add(door);
  // 门把手(竖向金属)
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.02,h*0.34,0.024),
    new THREE.MeshStandardMaterial({ color:0x3a444c, roughness:.32, metalness:.9 }));
  handle.position.set(d/2+0.022,0,-w*0.40); grp.add(handle);
  // 顶帽(APC roof, 略大) + 走线刷口
  const hat = new THREE.Mesh(new THREE.BoxGeometry(d*1.02,0.03,w*1.02),
    new THREE.MeshStandardMaterial({ color:0x14181c, roughness:.5, metalness:.55 }));
  hat.position.y=h/2+0.015; grp.add(hat);
  const brush = new THREE.Mesh(new THREE.BoxGeometry(d*0.34,0.012,w*0.5),
    new THREE.MeshStandardMaterial({ color:0x05080a, roughness:.9 }));
  brush.position.set(0,h/2+0.031,0); grp.add(brush);
  // 顶部状态灯条(绿)
  const led = new THREE.Mesh(new THREE.BoxGeometry(d*0.5,0.02,w*0.62),
    new THREE.MeshStandardMaterial({ color:C.nv, emissive:0x76b900, emissiveIntensity:1.6 }));
  led.position.set(0,h/2+0.04,0); grp.add(led);
  // 底踢脚
  const kick = new THREE.Mesh(new THREE.BoxGeometry(d*0.99,0.05,w*0.99),
    new THREE.MeshStandardMaterial({ color:0x05080a, roughness:.85, metalness:.3 }));
  kick.position.y=-h/2+0.025; grp.add(kick);
  grp.position.set(X(LAYOUT.rowDepth.x0+DIM.rack.D/2), m(ROOM.raisedFloor)+h/2, Z(u.z+DIM.rack.W/2));
  return grp;
}
function inrow(u){
  const grp = new THREE.Group();
  const d=m(DIM.inrow.D), w=m(DIM.inrow.W), h=m(DIM.inrow.H);
  const body = new THREE.Mesh(new THREE.BoxGeometry(d,h,w),
    new THREE.MeshStandardMaterial({ color:0x10171d, roughness:.5, metalness:.6 }));
  body.castShadow = body.receiveShadow = true; grp.add(body);
  const grille = new THREE.Mesh(new THREE.PlaneGeometry(w*0.8,h*0.9),
    new THREE.MeshStandardMaterial({ map:grilleTex(C.cyan), roughness:.6, emissive:0x06201e, emissiveIntensity:.8 }));
  grille.rotation.y = Math.PI/2; grille.position.set(d/2+0.002,0,0); grp.add(grille);
  // 顶青色冷光
  const led = new THREE.Mesh(new THREE.BoxGeometry(d*0.7,0.04,w*0.8),
    new THREE.MeshStandardMaterial({ color:C.cyan, emissive:0x2fe0d6, emissiveIntensity:1.8 }));
  led.position.set(0,h/2+0.02,0); grp.add(led);
  grp.position.set(X(LAYOUT.rowDepth.x0+DIM.inrow.D/2), m(ROOM.raisedFloor)+h/2, Z(u.z+DIM.inrow.W/2));
  return grp;
}
function powerCab(type, z){
  const D=DIM[type]; const grp=new THREE.Group();
  const d=m(D.D), w=m(D.W), h=m(D.H);
  const accent = type==='ups'?0xffb020 : type==='rpp'?0x76b900 : type==='batt'?0x2fe0d6 : 0x9aa7a0;
  // APC 黑色柜体(UPS/电池/进线/列头 同高 2000, 排成整齐一列)
  const body = new THREE.Mesh(new THREE.BoxGeometry(d,h,w),
    new THREE.MeshStandardMaterial({ color:0x0b0e11, roughness:.5, metalness:.58 }));
  body.castShadow=body.receiveShadow=true; grp.add(body);
  const hat = new THREE.Mesh(new THREE.BoxGeometry(d*1.02,0.03,w*1.02),
    new THREE.MeshStandardMaterial({ color:0x14181c, roughness:.5, metalness:.55 }));
  hat.position.y=h/2+0.015; grp.add(hat);
  const fx = -d/2-0.005;   // 正面(朝室内 -x)
  if(type==='ups'){
    const louv=new THREE.Mesh(new THREE.PlaneGeometry(w*0.74,h*0.5),
      new THREE.MeshStandardMaterial({ map:louverTex('#ffb020'), roughness:.6, metalness:.35 }));
    louv.rotation.y=-Math.PI/2; louv.position.set(fx,-h*0.19,0); grp.add(louv);
    const disp=new THREE.Mesh(new THREE.PlaneGeometry(w*0.52,h*0.2),
      new THREE.MeshStandardMaterial({ map:upsDisplayTex(), emissive:0x1a5030, emissiveIntensity:1.0, roughness:.3 }));
    disp.rotation.y=-Math.PI/2; disp.position.set(fx,h*0.28,0); grp.add(disp);
  } else if(type==='batt'){
    const louv=new THREE.Mesh(new THREE.PlaneGeometry(w*0.82,h*0.86),
      new THREE.MeshStandardMaterial({ map:louverTex('#2fe0d6'), roughness:.6, metalness:.35 }));
    louv.rotation.y=-Math.PI/2; louv.position.set(fx,0,0); grp.add(louv);
  } else {
    // 进线柜 / 列头柜: 柜门 + 观察窗 + 把手
    const dr=new THREE.Mesh(new THREE.PlaneGeometry(w*0.86,h*0.92),
      new THREE.MeshStandardMaterial({ color:0x12171c, roughness:.5, metalness:.5 }));
    dr.rotation.y=-Math.PI/2; dr.position.set(fx,0,0); grp.add(dr);
    const win=new THREE.Mesh(new THREE.PlaneGeometry(w*0.55,h*0.15),
      new THREE.MeshStandardMaterial({ color:0x081014, emissive:accent, emissiveIntensity:.6, roughness:.3 }));
    win.rotation.y=-Math.PI/2; win.position.set(fx-0.002,h*0.26,0); grp.add(win);
    const handle=new THREE.Mesh(new THREE.BoxGeometry(0.02,h*0.22,0.022),
      new THREE.MeshStandardMaterial({ color:0x3a444c, roughness:.32, metalness:.9 }));
    handle.position.set(fx-0.012,-h*0.04,w*0.32); grp.add(handle);
  }
  return { grp, accent };   // 由调用方定位/旋转
}

// 列头柜(列头, 与 APC 机柜同尺寸, 置于机柜行头) — rack 外形 + 断路器面板
function rpp(u){
  const grp=new THREE.Group();
  const d=m(DIM.rpp.D), w=m(DIM.rpp.W), h=m(DIM.rpp.H);
  const body=new THREE.Mesh(new THREE.BoxGeometry(d,h,w),
    new THREE.MeshStandardMaterial({color:0x0b0e11,roughness:.5,metalness:.6}));
  body.castShadow=body.receiveShadow=true; grp.add(body);
  // 前门(深色) + 断路器观察窗
  const door=new THREE.Mesh(new THREE.PlaneGeometry(w*0.95,h*0.97),
    new THREE.MeshStandardMaterial({color:0x12171c,roughness:.5,metalness:.5}));
  door.rotation.y=Math.PI/2; door.position.set(d/2+0.006,0,0); grp.add(door);
  const win=new THREE.Mesh(new THREE.PlaneGeometry(w*0.62,h*0.52),
    new THREE.MeshStandardMaterial({map:breakerTex(),emissive:0x0c2a14,emissiveIntensity:.75,roughness:.4}));
  win.rotation.y=Math.PI/2; win.position.set(d/2+0.009,h*0.04,0); grp.add(win);
  const handle=new THREE.Mesh(new THREE.BoxGeometry(0.02,h*0.3,0.024),
    new THREE.MeshStandardMaterial({color:0x3a444c,roughness:.32,metalness:.9}));
  handle.position.set(d/2+0.022,0,-w*0.4); grp.add(handle);
  // 顶帽 + 绿灯条(RPP)
  const hat=new THREE.Mesh(new THREE.BoxGeometry(d*1.02,0.03,w*1.02),
    new THREE.MeshStandardMaterial({color:0x14181c,roughness:.5,metalness:.55}));
  hat.position.y=h/2+0.015; grp.add(hat);
  const led=new THREE.Mesh(new THREE.BoxGeometry(d*0.5,0.02,w*0.62),
    new THREE.MeshStandardMaterial({color:C.nv,emissive:0x76b900,emissiveIntensity:1.6}));
  led.position.set(0,h/2+0.04,0); grp.add(led);
  const kick=new THREE.Mesh(new THREE.BoxGeometry(d*0.99,0.05,w*0.99),
    new THREE.MeshStandardMaterial({color:0x05080a,roughness:.85,metalness:.3}));
  kick.position.y=-h/2+0.025; grp.add(kick);
  grp.position.set(X(LAYOUT.rowDepth.x0+DIM.rpp.D/2), m(ROOM.raisedFloor)+h/2, Z(u.z+DIM.rpp.W/2));
  return grp;
}

function condenser(px, pz){
  const D=DIM.condenser; const grp=new THREE.Group();
  const body=new THREE.Mesh(new THREE.BoxGeometry(m(D.W),m(D.H),m(D.D)),
    new THREE.MeshStandardMaterial({color:0x1a2228,roughness:.6,metalness:.5}));
  body.castShadow=true; grp.add(body);
  // 顶部风扇(朝上)
  for(const off of [-0.24,0.24]){
    const ring=new THREE.Mesh(new THREE.TorusGeometry(0.2,0.025,8,24),
      new THREE.MeshStandardMaterial({color:0x0c1216,roughness:.7}));
    ring.rotation.x=Math.PI/2; ring.position.set(off,m(D.H)/2+0.02,0); grp.add(ring);
    const fan=new THREE.Mesh(new THREE.CircleGeometry(0.18,20),
      new THREE.MeshStandardMaterial({color:0x10171d,roughness:.8,side:THREE.DoubleSide}));
    fan.rotation.x=-Math.PI/2; fan.position.set(off,m(D.H)/2+0.01,0); grp.add(fan);
  }
  // 钢支架
  const legMat=new THREE.MeshStandardMaterial({color:0x2a3640,roughness:.5,metalness:.7});
  for(const sx of [-0.45,0.45]) for(const sz of [-0.18,0.18]){
    const leg=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.3,0.04),legMat);
    leg.position.set(sx,-m(D.H)/2-0.15,sz); grp.add(leg);
  }
  const roofY = m(ROOM.H)+0.28+0.04;
  grp.position.set(X(px), roofY+0.3+m(D.H)/2, Z(pz));
  return grp;
}

// ---------- 主装配 ----------
export function initScene(){
  const canvas = document.getElementById('c3d');
  renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070a0d);
  scene.fog = new THREE.Fog(0x070a0d, 14, 30);

  camera = new THREE.PerspectiveCamera(48, 2, 0.1, 200);
  camera.position.set(6.4, 4.4, 7.2);

  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.dampingFactor = .08;
  controls.target.set(0, 1.0, 0);
  controls.minDistance = 4.5; controls.maxDistance = 22;
  controls.maxPolarAngle = Math.PI/2.04;
  controls.autoRotate = true; controls.autoRotateSpeed = 0.55;

  // 灯光(默认更亮;开灯/关灯可调)
  hemi = new THREE.HemisphereLight(0x53707f, 0x0d1116, 1.25); scene.add(hemi);
  amb  = new THREE.AmbientLight(0x283a47, 1.15); scene.add(amb);
  const key = new THREE.DirectionalLight(0xeaf6ff, 1.35);
  key.position.set(8,12,6); key.castShadow=true;
  key.shadow.mapSize.set(2048,2048); key.shadow.camera.near=1; key.shadow.camera.far=40;
  key.shadow.camera.left=-8; key.shadow.camera.right=8; key.shadow.camera.top=8; key.shadow.camera.bottom=-8;
  key.shadow.bias=-0.0004; scene.add(key); reg(key,1.35,0.35);
  // 室内吊顶灯补光(沿机柜行 + 工作区)
  for(const zz of [-3.0,-1.0,1.0,3.0]){
    const il = new THREE.PointLight(0xeaf4ff, 15, 9, 2); il.position.set(0.2,2.62,zz); scene.add(il); reg(il,15,1.6);
  }
  const wl = new THREE.PointLight(0xfff0d8, 11, 8, 2); wl.position.set(0.4,2.5,-3.6); scene.add(wl); reg(wl,11,1.2); // 工作台区补光
  // 设备辉光(关灯也保留, 像通电指示)
  const nvGlow = new THREE.PointLight(0x76b900, 18, 8, 2); nvGlow.position.set(-1.3,2.1,1.2); scene.add(nvGlow);
  const cyGlow = new THREE.PointLight(0x2fe0d6, 13, 7, 2); cyGlow.position.set(-1.3,2.1,-2.0); scene.add(cyGlow);

  buildRoom();
  buildEquipment();

  addEventListener('resize', onResize); onResize();
}

function buildRoom(){
  const W=m(ROOM.W), L=m(ROOM.L), H=m(ROOM.H), rf=m(ROOM.raisedFloor);
  // 底板
  const base = new THREE.Mesh(new THREE.BoxGeometry(W,0.1,L),
    new THREE.MeshStandardMaterial({color:0x05080a,roughness:1}));
  base.position.y=-0.05; base.receiveShadow=true; scene.add(base);
  // 高架地板
  const floor = new THREE.Mesh(new THREE.BoxGeometry(W,rf,L),
    new THREE.MeshStandardMaterial({color:0x0c1217,roughness:.85,metalness:.2}));
  floor.position.y=rf/2; floor.receiveShadow=true; scene.add(floor);
  // 地板砖缝网格
  const grid = new THREE.GridHelper(Math.max(W,L), Math.round(Math.max(W,L)/0.6), 0x1d3a16, 0x14232a);
  grid.position.y=rf+0.002; grid.material.opacity=.5; grid.material.transparent=true;
  // 裁到房间范围: 用一个略大网格即可
  scene.add(grid);
  // 冷通道穿孔架空地砖(发光透板)
  const ct=perfTileTex(); ct.repeat.set(2,9);
  const cold = new THREE.Mesh(new THREE.PlaneGeometry(m(1400), L*0.62),
    new THREE.MeshStandardMaterial({map:ct,color:0x9fdcb0,emissive:0x123d16,emissiveIntensity:.5,roughness:.6}));
  cold.rotation.x=-Math.PI/2; cold.position.set(X(2900),rf+0.004,0); scene.add(cold);

  // 墙(隔音封闭, 无窗) — 半透明"玻璃外壳", 任意角度可看进室内
  const wallMat = new THREE.MeshStandardMaterial({color:0x18323e,roughness:.6,metalness:.1,
    side:THREE.DoubleSide,transparent:true,opacity:.14,depthWrite:false});
  const mkWall=(w,h,pos,roty)=>{const ws=new THREE.Mesh(new THREE.PlaneGeometry(w,h),wallMat);
    ws.position.copy(pos); ws.rotation.y=roty; ws.receiveShadow=true; scene.add(ws);
    // 墙脚 NVIDIA 绿灯带
    const t=new THREE.Mesh(new THREE.BoxGeometry(w,0.03,0.03),
      new THREE.MeshStandardMaterial({color:C.nv,emissive:0x3d6000,emissiveIntensity:1.2}));
    t.position.set(pos.x,rf+0.04,pos.z); t.rotation.y=roty; scene.add(t); return ws;};
  mkWall(L,H,new THREE.Vector3(-W/2,H/2,0),Math.PI/2);   // 后墙(机柜背靠/外接冷凝)
  mkWall(L,H,new THREE.Vector3(W/2,H/2,0),Math.PI/2);    // 强电侧墙
  mkWall(W,H,new THREE.Vector3(0,H/2,-L/2),0);           // 端墙
  // 前端墙留隔音门(用两段)
  mkWall(W*0.62,H,new THREE.Vector3(-W*0.19,H/2,L/2),0);
  // 隔音门
  const door=new THREE.Mesh(new THREE.BoxGeometry(m(1100),m(2200),0.08),
    new THREE.MeshStandardMaterial({color:0x182026,roughness:.5,metalness:.6,emissive:0x0a1f0a,emissiveIntensity:.3}));
  door.position.set(X(4800),rf+m(1100),L/2); scene.add(door);

  // 吊顶(半透明, 不挡视线)
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W,L),
    new THREE.MeshStandardMaterial({color:0x0a0f13,roughness:1,side:THREE.DoubleSide,
      transparent:true,opacity:.10,depthWrite:false}));
  ceil.rotation.x=Math.PI/2; ceil.position.y=H; scene.add(ceil);
  const cg = new THREE.GridHelper(Math.max(W,L), Math.round(Math.max(W,L)/0.6), 0x12202a, 0x0e1820);
  cg.position.y=H-0.01; cg.material.opacity=.4; cg.material.transparent=true; scene.add(cg);
  // 吊顶灯带
  for(const zz of [-3,-1.5,0,1.5,3]){
    const mat=new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xcfecff,emissiveIntensity:1.5});
    const lp=new THREE.Mesh(new THREE.BoxGeometry(W*0.72,0.05,0.16),mat);
    lp.position.set(0,H-0.05,zz); scene.add(lp); ceilStripMats.push(mat);
  }
  // 桥架(机柜行上方)
  const tray=new THREE.Mesh(new THREE.BoxGeometry(m(500),0.06,L*0.62),
    new THREE.MeshStandardMaterial({color:0x1a242b,roughness:.6,metalness:.6}));
  tray.position.set(X(1600),H-m(380),0); scene.add(tray);

  // 屋面板(吊顶之上, 承屋顶冷凝器)
  const roofY=H+0.28;
  const roof=new THREE.Mesh(new THREE.BoxGeometry(W+0.3,0.06,L+0.3),
    new THREE.MeshStandardMaterial({color:0x16202a,roughness:.9,metalness:.1,
      transparent:true,opacity:.4,depthWrite:false}));
  roof.position.set(0,roofY,0); scene.add(roof);
  // 女儿墙
  const par=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(W,0.4,L)),
    new THREE.LineBasicMaterial({color:0x2a3a42,transparent:true,opacity:.5}));
  par.position.set(0,roofY+0.2,0); scene.add(par);
}

function buildEquipment(){
  const rf=m(ROOM.raisedFloor), rh=m(DIM.rack.H);
  // 机柜 + 行级空调 + 列头柜
  for(const u of LAYOUT.units){
    if(u.type==='rack'){ const g=rack(u); scene.add(g);
      addLabel(u.tag,'10kW','#76b900',new THREE.Vector3(g.position.x+m(700),rf+rh+0.45,g.position.z)); }
    else if(u.type==='rpp'){ const g=rpp(u); scene.add(g);
      addLabel(u.tag,'RPP · 列头','#76b900',new THREE.Vector3(g.position.x+m(700),rf+rh+0.45,g.position.z)); }
    else { const g=inrow(u); scene.add(g);
      addLabel(u.tag,'InRow 30kW','#2fe0d6',new THREE.Vector3(g.position.x+m(700),rf+rh+0.45,g.position.z)); }
  }
  // 热通道封闭(顶盖 + 端门, 半透明)
  const hcMat=new THREE.MeshPhysicalMaterial({color:0x2fe0d6,transparent:true,opacity:.12,
    roughness:.1,metalness:0,transmission:.6,side:THREE.DoubleSide});
  const hx=X((LAYOUT.hotAisle.x0+LAYOUT.hotAisle.x1)/2);
  const zlen=L62();
  const roof=new THREE.Mesh(new THREE.BoxGeometry(m(900),0.02,zlen),hcMat);
  roof.position.set(hx,rf+rh+0.02,0); scene.add(roof);
  // 封闭框边线
  const edge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(m(900),rh,zlen)),
    new THREE.LineBasicMaterial({color:0x2fe0d6,transparent:true,opacity:.4}));
  edge.position.set(hx,rf+rh/2,0); scene.add(edge);
  addLabel('热通道','HOT AISLE 封闭','#ff4d57',new THREE.Vector3(hx,rf+rh+0.5,Z(7600)));
  addLabel('冷通道','COLD AISLE','#2fe0d6',new THREE.Vector3(X(2900),rf+0.6,Z(8200)));

  // 强电(进线/UPS/电池)—— 贴入口端墙(z=L)门左侧, 正面朝室内
  const EP=LAYOUT.entryPower;
  for(const it of EP.items){
    const D=DIM[it.type]; const {grp,accent}=powerCab(it.type);
    grp.rotation.y = -Math.PI/2;                       // 正面转朝 -z(室内)
    grp.position.set(X(it.x), rf+m(D.H)/2, Z(EP.frontZ + D.D/2));
    scene.add(grp);
    addLabel(it.tag,'', '#'+accent.toString(16).padStart(6,'0'),
      new THREE.Vector3(grp.position.x, rf+m(D.H)+0.22, grp.position.z-m(400)));
  }
  addLabel('强电区','POWER · 进线/UPS/电池','#ffb020',new THREE.Vector3(X(2100),rf+m(2300),Z(8600)));

  // 气体灭火 FM200: 控制盘(右墙) + 顶部喷头 + 烟感
  buildFireSuppression();

  // 屋顶冷凝器 + 冷媒管竖管
  const roofY=m(ROOM.H)+0.28+0.04;
  for(const c of LAYOUT.roofCondensers){ scene.add(condenser(c.x, 4500)); }
  addLabel('屋顶冷凝器','ROOF · ×3 DX','#9aa7a0',new THREE.Vector3(X(3000),roofY+m(1300)+0.5,Z(4500)));
  // 冷媒管: 行级空调 → 穿吊顶 → 屋顶冷凝器
  const pipeMat=new THREE.MeshStandardMaterial({color:0x3a4650,roughness:.4,metalness:.7});
  for(const u of LAYOUT.units){ if(u.type!=='inrow') continue;
    const cx=X(LAYOUT.rowDepth.x0+DIM.inrow.D/2), cz=Z(u.z+DIM.inrow.W/2);
    const pipe=new THREE.Mesh(new THREE.CylinderGeometry(0.035,0.035, roofY-(rf+rh)+0.3, 10),pipeMat);
    pipe.position.set(cx, (rf+rh+roofY)/2, cz); scene.add(pipe);
  }

  // 运维工作台(顶墙横放 + 双显示器支架)
  scene.add(workbench());
  addLabel('工作台','OPS DESK · 双屏','#76b900',new THREE.Vector3(X(LAYOUT.workbench.x),rf+1.45,Z(LAYOUT.workbench.z)));
}
function L62(){ return m(ROOM.L)*0.62; }

// 运维工作台: 顶墙横放(长边沿 x), 双显示器支架(立柱 + 横臂 + 2 屏)
function workbench(){
  const grp=new THREE.Group(); const D=DIM.workbench;
  const w=m(D.W), d=m(D.D), h=m(D.H);     // w=长(x), d=深(z)
  const top=new THREE.Mesh(new THREE.BoxGeometry(w,0.04,d),
    new THREE.MeshStandardMaterial({color:0x1c252b,roughness:.4,metalness:.5}));
  top.position.y=h; top.castShadow=top.receiveShadow=true; grp.add(top);
  const legMat=new THREE.MeshStandardMaterial({color:0x121a20,roughness:.5,metalness:.65});
  for(const sx of [-w/2+0.06,w/2-0.06]) for(const sz of [-d/2+0.06,d/2-0.06]){
    const leg=new THREE.Mesh(new THREE.BoxGeometry(0.05,h,0.05),legMat); leg.position.set(sx,h/2,sz); grp.add(leg);
  }
  // 后挡板(贴墙侧 -z)
  const back=new THREE.Mesh(new THREE.BoxGeometry(w,0.16,0.02),legMat);
  back.position.set(0,h+0.08,-d/2+0.02); grp.add(back);
  // 显示器支架: 立柱 + 横臂(金属)
  const armMat=new THREE.MeshStandardMaterial({color:0x222a32,roughness:.35,metalness:.85});
  const pole=new THREE.Mesh(new THREE.CylinderGeometry(0.018,0.024,0.52,12),armMat);
  pole.position.set(0,h+0.26,-d/2+0.09); grp.add(pole);
  const cross=new THREE.Mesh(new THREE.BoxGeometry(w*0.62,0.024,0.03),armMat);
  cross.position.set(0,h+0.44,-d/2+0.09); grp.add(cross);
  // 双屏(屏朝 +z 操作员侧, 微仰)
  for(const sx of [-0.30,0.30]){
    const arm=new THREE.Mesh(new THREE.BoxGeometry(0.04,0.022,0.17),armMat);
    arm.position.set(sx,h+0.44,-d/2+0.17); grp.add(arm);
    const mon=new THREE.Mesh(new THREE.BoxGeometry(0.54,0.33,0.028),
      new THREE.MeshStandardMaterial({color:0x0a0e12,roughness:.4,metalness:.6}));
    mon.position.set(sx,h+0.45,-d/2+0.27); mon.rotation.x=-0.13; grp.add(mon);
    const scr=new THREE.Mesh(new THREE.PlaneGeometry(0.50,0.29),
      new THREE.MeshStandardMaterial({color:0x0a1a14,emissive:0x1f7a40,emissiveIntensity:1.25,roughness:.3}));
    scr.position.set(sx,h+0.45,-d/2+0.285); scr.rotation.x=-0.13; grp.add(scr);
  }
  // 键盘
  const kb=new THREE.Mesh(new THREE.BoxGeometry(0.44,0.015,0.16),
    new THREE.MeshStandardMaterial({color:0x12181d,roughness:.6,metalness:.4}));
  kb.position.set(0,h+0.012,0.07); grp.add(kb);
  grp.position.set(X(LAYOUT.workbench.x), m(ROOM.raisedFloor), Z(LAYOUT.workbench.z));
  return grp;
}

// 气体灭火 FM200: 控制盘(右墙近门)+ 钢瓶 + 顶部喷头 + 烟感
function buildFireSuppression(){
  const rf=m(ROOM.raisedFloor), H=m(ROOM.H), F=LAYOUT.fire, p=F.panel;
  // 控制盘(贴右墙, 朝 -x)
  const panel=new THREE.Group();
  panel.add(new THREE.Mesh(new THREE.BoxGeometry(0.12,0.6,0.46),
    new THREE.MeshStandardMaterial({color:0x7a1418,roughness:.5,metalness:.5,emissive:0x3a0608,emissiveIntensity:.35})));
  const scr=new THREE.Mesh(new THREE.PlaneGeometry(0.3,0.18),
    new THREE.MeshStandardMaterial({color:0x1a0a0a,emissive:0xff4d57,emissiveIntensity:.9}));
  scr.rotation.y=-Math.PI/2; scr.position.set(-0.062,0.1,0); panel.add(scr);
  const lamp=new THREE.Mesh(new THREE.SphereGeometry(0.04,12,8),
    new THREE.MeshStandardMaterial({color:0xff4d57,emissive:0xff2030,emissiveIntensity:2}));
  lamp.position.set(-0.06,0.34,0); panel.add(lamp);
  panel.position.set(X(p.x)-0.07, rf+1.4, Z(p.z)); scene.add(panel);
  addLabel('FM200','灭火控制盘','#ff4d57',new THREE.Vector3(X(p.x)-0.3,rf+1.95,Z(p.z)));
  // 七氟丙烷钢瓶组(控制盘旁)
  for(const off of [0,0.32]){
    const cyl=new THREE.Mesh(new THREE.CylinderGeometry(0.13,0.13,0.92,16),
      new THREE.MeshStandardMaterial({color:0x8a1a1e,roughness:.5,metalness:.55}));
    cyl.position.set(X(p.x)-0.2, rf+0.46, Z(p.z)-0.4-off); scene.add(cyl);
  }
  // 顶部气体喷头(朝下)
  for(const n of F.nozzles){
    const base=new THREE.Mesh(new THREE.CylinderGeometry(0.05,0.05,0.03,12),
      new THREE.MeshStandardMaterial({color:0x8a1a1e,roughness:.5,metalness:.6}));
    base.position.set(X(n.x),H-0.04,Z(n.z)); scene.add(base);
    const noz=new THREE.Mesh(new THREE.ConeGeometry(0.055,0.09,12),
      new THREE.MeshStandardMaterial({color:0xb02028,roughness:.4,metalness:.7,emissive:0x3a0608,emissiveIntensity:.5}));
    noz.position.set(X(n.x),H-0.10,Z(n.z)); noz.rotation.x=Math.PI; scene.add(noz);
  }
  addLabel('气体喷头','FM200 NOZZLE','#ff4d57',new THREE.Vector3(X(F.nozzles[2].x),H+0.12,Z(F.nozzles[2].z)));
  // 烟感探测器
  for(const s of F.smoke){
    const det=new THREE.Mesh(new THREE.CylinderGeometry(0.075,0.08,0.03,16),
      new THREE.MeshStandardMaterial({color:0xe2e8e4,roughness:.7,metalness:.15}));
    det.position.set(X(s.x),H-0.02,Z(s.z)); scene.add(det);
    const led=new THREE.Mesh(new THREE.SphereGeometry(0.013,8,6),
      new THREE.MeshStandardMaterial({color:0xff4d57,emissive:0xff3040,emissiveIntensity:2}));
    led.position.set(X(s.x),H-0.05,Z(s.z)); scene.add(led);
  }
  addLabel('烟感','SMOKE DET','#cdd8d2',new THREE.Vector3(X(F.smoke[0].x),H+0.1,Z(F.smoke[0].z)));
}

function onResize(){
  const s=document.getElementById('stage'); if(!s) return;
  const w=s.clientWidth||innerWidth, h=s.clientHeight||innerHeight;
  renderer.setSize(w,h,false); camera.aspect=w/h; camera.updateProjectionMatrix();
}

function loop(){
  raf=requestAnimationFrame(loop);
  controls.update();
  for(const l of labels) l.visible = labelsVisible;
  renderer.render(scene,camera);
}

export function startScene(){ if(running) return; running=true; onResize(); loop(); }
export function stopScene(){ running=false; if(raf) cancelAnimationFrame(raf); }
export function toggleSpin(){ spin=!spin; controls.autoRotate=spin; return spin; }
export function toggleLabels(){ labelsVisible=!labelsVisible; return labelsVisible; }
export function toggleLights(){
  lightsOn=!lightsOn;
  hemi.intensity = lightsOn?1.25:0.22;
  amb.intensity  = lightsOn?1.15:0.28;
  for(const d of dimmables) d.l.intensity = lightsOn? d.on : d.off;
  for(const mt of ceilStripMats) mt.emissiveIntensity = lightsOn?1.5:0.06;
  scene.background.set(lightsOn?0x070a0d:0x04060a);
  return lightsOn;
}
export function resetView(){ camera.position.set(6.4,4.4,7.2); controls.target.set(0,1.05,0); }
export function topView(){ camera.position.set(0.01,14,0.01); controls.target.set(0,0,0); }
