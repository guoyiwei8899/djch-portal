import { planSVG, sectionSVG, powerSVG, airflowSVG } from './drawings.js';
import { ROOM, DIM, LOAD, BOM, PROJECT, LAYOUT } from './config.js';

// ---- 注入施工图 ----
document.getElementById('sheet-plan').innerHTML    = planSVG();
document.getElementById('sheet-section').innerHTML = sectionSVG();
document.getElementById('sheet-power').innerHTML   = powerSVG();
document.getElementById('sheet-air').innerHTML     = airflowSVG();

// ---- KPI 卡片 ----
const kpis = [
  ['房间面积', ROOM.area, '㎡', `${ROOM.W/1000}×${ROOM.L/1000}m 净高${ROOM.H/1000}m`, ''],
  ['IT 机柜', LOAD.rackCount, '台', '42U 800×1200 APC', ''],
  ['单柜功率', LOAD.rackKW, 'kW', '高密度', ''],
  ['IT 总负载', LOAD.itKW, 'kW', `≈${(LOAD.itKW/ROOM.area).toFixed(1)} kW/㎡`, 'cy'],
  ['行级空调', LOAD.coolerCount, '台', `InRow DX · 单台${LOAD.coolerKW}kW · N+1`, 'cy'],
  ['UPS', LOAD.upsKVA, 'kVA', `后备 ${LOAD.upsBackupMin}min`, 'am'],
  ['进线主开关', LOAD.mainBreakerA, 'A', `整机房≈${LOAD.totalFacilityKW}kW`, 'am'],
  ['高架地板', ROOM.raisedFloor, 'mm', '防静电架空走线', ''],
];
document.getElementById('kpi').innerHTML = kpis.map(([k,v,u,x,c])=>
  `<div class="card ${c}"><div class="k">${k}</div><div class="v">${v}<small>${u}</small></div><div class="x">${x}</div></div>`
).join('');

// ---- BOM 表 ----
document.getElementById('bom-body').innerHTML = BOM.map((r,i)=>
  `<tr><td style="color:#6f8079">${String(i+1).padStart(2,'0')}</td><td style="color:#eafff0">${r[0]}</td>
   <td>${r[1]}</td><td><span class="q">${r[2]}</span></td><td style="color:#6f8079">${r[3]}</td></tr>`
).join('');

// ---- 导航切换 ----
const views = [...document.querySelectorAll('section.view')];
const btns  = [...document.querySelectorAll('nav button')];
let sceneReady = false, sceneMod = null;

async function ensureScene(){
  if(sceneReady) return;
  document.getElementById('loadmsg').textContent = '⟳ 初始化 3D 引擎…';
  sceneMod = await import('./scene.js');
  sceneMod.initScene();
  sceneReady = true;
  document.getElementById('loadmsg').style.display = 'none';
  // 控制按钮
  document.getElementById('b-light').onclick= e=>{ const on=sceneMod.toggleLights(); e.target.textContent= on?'💡 关灯':'💡 开灯'; };
  document.getElementById('b-spin').onclick = e=>{ const on=sceneMod.toggleSpin(); e.target.textContent= on?'⏸ 暂停旋转':'▶ 自动旋转'; };
  document.getElementById('b-label').onclick= e=>{ const on=sceneMod.toggleLabels(); e.target.textContent= on?'🏷 隐藏标签':'🏷 显示标签'; };
  document.getElementById('b-reset').onclick= ()=> sceneMod.resetView();
  document.getElementById('b-top').onclick  = ()=> sceneMod.topView();
}

async function show(id){
  views.forEach(v=>v.classList.toggle('on', v.id===id));
  btns.forEach(b=>b.classList.toggle('on', b.dataset.t===id));
  if(id==='view-3d'){ await ensureScene(); sceneMod.startScene(); }
  else if(sceneReady){ sceneMod.stopScene(); }
}
btns.forEach(b=> b.onclick=()=>show(b.dataset.t));

// 默认进入 3D 效果图
show('view-3d');
