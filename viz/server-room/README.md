# DJCH 农村房改造小机房 · 设计可视化

参考 NVIDIA Air 暗色科技风的交互式机房设计交付物:**3D 效果图 + 施工图**(平面 / 剖面 / 配电单线 / 气流)+ 设备清单/设计依据。纯本地零运行时依赖(three.js 本地内置,字体本地化,规避 GFW)。

## 启动预览
```bash
cd ~/server-room-design
python3 -m http.server 8137 --bind 0.0.0.0
# 浏览器打开 http://<本机IP>:8137
```

## 核心设计参数
| 项 | 取值 |
|---|---|
| 房间 | 6.0×9.0m = 54㎡,吊顶净高 2.85m,高架地板 150mm |
| IT 机柜 | 6 × 42U 800×1200 APC,每柜 10kW(IT 共 60kW) |
| 制冷 | 3 × APC InRow RD(DX 风冷)N+1,热通道封闭 |
| 配电 | 三相进线 200A → 80kVA UPS → 强电列头柜 → 6× Panduit 0U PDU |
| 结构 | 墙体岩棉+双层石膏隔音、窗全封堵、矿棉吊顶 |

## 文件
- `index.html` — 单页 6 个分区
- `js/config.js` — 全部参数(改这里,图全联动)
- `js/scene.js` — Three.js 3D 效果图
- `js/drawings.js` — SVG 施工图生成
- `js/app.js` — 导航 / 表格 / 3D 生命周期
- `vendor/` — three.js + OrbitControls(本地)
- `assets/fonts/` — Orbitron/Rajdhani/JetBrains Mono(本地 woff2)

> 示意级设计可视化(方案深化),非报建蓝图。尺寸按现场照片估算,落地需持证设计院校核。
