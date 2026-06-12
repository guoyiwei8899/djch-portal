/* ===== djch portal — shared: icons, theme, data ===== */
window.ICONS = {
  cpu: '<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/>',
  "hard-drive": '<rect x="3" y="13" width="18" height="7" rx="2"/><path d="M5.5 13 8 4.5h8L18.5 13"/><circle cx="8" cy="16.5" r="1"/><line x1="12" y1="16.5" x2="16" y2="16.5"/>',
  globe: '<circle cx="12" cy="12" r="9"/><line x1="3" y1="12" x2="21" y2="12"/><path d="M12 3c2.5 2.5 3.8 5.7 3.8 9S14.5 18.5 12 21"/><path d="M12 3C9.5 5.5 8.2 8.7 8.2 12S9.5 18.5 12 21"/>',
  hexagon: '<path d="M12 2.5l7.5 4.3v8.4L12 19.5 4.5 15.2V6.8z"/><circle cx="12" cy="11" r="2.4"/>',
  server: '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><circle cx="7" cy="7.5" r=".8" fill="currentColor" stroke="none"/><circle cx="7" cy="16.5" r=".8" fill="currentColor" stroke="none"/>',
  shield: '<path d="M12 3l7.5 3v5.5c0 4.2-3.2 7.6-7.5 9.5-4.3-1.9-7.5-5.3-7.5-9.5V6z"/>',
  book: '<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z"/><path d="M5 19.5V21h13"/>',
  activity: '<polyline points="3 12 7 12 10 5 14 19 17 12 21 12"/>',
  monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="16" x2="12" y2="20"/>',
  sliders: '<line x1="4" y1="8" x2="20" y2="8"/><line x1="4" y1="16" x2="20" y2="16"/><circle cx="9" cy="8" r="2.2" fill="var(--card)"/><circle cx="15" cy="16" r="2.2" fill="var(--card)"/>',
  "bar-chart": '<rect x="3" y="11" width="4" height="9" rx="1" fill="currentColor" stroke="none"/><rect x="10" y="5" width="4" height="15" rx="1" fill="currentColor" stroke="none"/><rect x="17" y="14" width="4" height="6" rx="1" fill="currentColor" stroke="none"/>',
  grid: '<rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/>',
  search: '<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4.5"/><line x1="12" y1="19.5" x2="12" y2="22"/><line x1="2" y1="12" x2="4.5" y2="12"/><line x1="19.5" y1="12" x2="22" y2="12"/><line x1="4.9" y1="4.9" x2="6.7" y2="6.7"/><line x1="17.3" y1="17.3" x2="19.1" y2="19.1"/><line x1="4.9" y1="19.1" x2="6.7" y2="17.3"/><line x1="17.3" y1="6.7" x2="19.1" y2="4.9"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  "arrow-left": '<line x1="20" y1="12" x2="4.5" y2="12"/><polyline points="10.5 5.5 4 12 10.5 18.5"/>',
  external: '<path d="M14 4h6v6"/><line x1="20" y1="4" x2="11" y2="13"/><path d="M18 13v5.5A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H11"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  layers: '<path d="M12 2.5L2.5 7.5 12 12.5l9.5-5z"/><path d="M2.5 12L12 17l9.5-5"/><path d="M2.5 16.5L12 21.5l9.5-5"/>',
  "log-out": '<path d="M9 21H5.5A1.5 1.5 0 0 1 4 19.5v-15A1.5 1.5 0 0 1 5.5 3H9"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  box: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.3 7 12 12 20.7 7"/><line x1="12" y1="22" x2="12" y2="12"/>',
  terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>'
};

window.svgIcon = function (name, cls) {
  const inner = window.ICONS[name] || window.ICONS.grid;
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" ' +
    'stroke-linecap="round" stroke-linejoin="round" class="' + (cls || 'ic') + '">' + inner + '</svg>';
};

/* ---- theme (light/dark) ---- */
window.initTheme = function () {
  const saved = localStorage.getItem('portal-theme');
  const dark = saved ? saved === 'dark' : true; // dark-first
  document.documentElement.classList.toggle('dark', dark);
};
window.toggleTheme = function () {
  const dark = !document.documentElement.classList.contains('dark');
  document.documentElement.classList.toggle('dark', dark);
  localStorage.setItem('portal-theme', dark ? 'dark' : 'light');
  document.dispatchEvent(new CustomEvent('themechange', { detail: { dark } }));
};
window.themeIcon = function () {
  return window.svgIcon(document.documentElement.classList.contains('dark') ? 'sun' : 'moon');
};

window.loadPortal = function () {
  // portal.json sits behind SSO while the shell is public: any failure here
  // (302→auth blocked by CORS, expired session, non-200) means "not signed in"
  return fetch('portal.json?_=' + Date.now())
    .then(r => { if (!r.ok) throw 0; return r.json(); })
    .catch(() => { location.replace('login.html'); return new Promise(() => {}); });
};

/* ---- animated background engine: Drift / Flow / Lines / Aurora / Off ----
   zero-dep raw Canvas/WebGL (web-design skill ports), theme-aware, 🎨 cycles,
   choice persists in localStorage('portal-bg'). */
(function () {
  var QUAD = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isDark = () => document.documentElement.classList.contains('dark');
  function prog(gl, vs, fs) {
    var p = gl.createProgram();
    function sh(t, s) {
      var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o);
      if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(o));
      return o;
    }
    gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { console.warn(gl.getProgramInfoLog(p)); return null; }
    return p;
  }
  function quadAttr(gl, p, name) {
    var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, QUAD, gl.STATIC_DRAW);
    var lp = gl.getAttribLocation(p, name); gl.enableVertexAttribArray(lp); gl.vertexAttribPointer(lp, 2, gl.FLOAT, false, 0, 0);
  }
  function mkCanvas(host) { var c = document.createElement('canvas'); host.appendChild(c); return c; }

  /* — Drift: 2d drifting neon blobs (v2 original look) — */
  function bgDrift(host) {
    var c = mkCanvas(host), ctx = c.getContext('2d');
    var PAL = ['#ff4d9d', '#21d4fd', '#8b5cf6', '#2fe39a', '#ffb224'];
    var W, H, blobs = [], run = true;
    function resize() {
      W = c.width = innerWidth; H = c.height = innerHeight;
      blobs = PAL.map((col, i) => ({
        col, r: Math.min(W, H) * (0.34 + 0.10 * (i % 3)),
        x: Math.random() * W, y: Math.random() * H * 0.9,
        vx: (Math.random() - .5) * .26, vy: (Math.random() - .5) * .2
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var dark = isDark();
      ctx.globalCompositeOperation = dark ? 'lighter' : 'source-over';
      var a = dark ? 0.17 : 0.10;
      for (var b of blobs) {
        b.x += b.vx; b.y += b.vy;
        if (b.x < -b.r * .4 || b.x > W + b.r * .4) b.vx *= -1;
        if (b.y < -b.r * .4 || b.y > H + b.r * .4) b.vy *= -1;
        var g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, b.col + Math.round(a * 255).toString(16).padStart(2, '0'));
        g.addColorStop(1, b.col + '00');
        ctx.fillStyle = g; ctx.fillRect(b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
      }
    }
    function fr() { if (!run) return; draw(); if (!reduced) requestAnimationFrame(fr); }
    resize(); addEventListener('resize', resize); requestAnimationFrame(fr);
    return function () { run = false; removeEventListener('resize', resize); };
  }

  /* — Flow: WebGL1 fbm domain-warp fluid; light theme = inverted pastel — */
  function bgFlow(host) {
    var c = mkCanvas(host), gl = c.getContext('webgl') || c.getContext('experimental-webgl');
    if (!gl) return bgDrift(host);
    var run = true;
    function size() { c.width = innerWidth; c.height = innerHeight; gl.viewport(0, 0, c.width, c.height); }
    addEventListener('resize', size);
    var fs = ['precision highp float;uniform vec2 r;uniform float t;uniform float uL;',
      'float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}',
      'float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);',
      'return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);}',
      'float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<3;i++){v+=a*n(p);p*=2.;a*=.5;}return v;}',
      'void main(){vec2 uv=gl_FragCoord.xy/r;vec2 p=uv;p.x*=r.x/r.y;float tt=t*.05;',
      'vec2 q=vec2(fbm(p+vec2(0.,tt)),fbm(p+vec2(5.2,1.3-tt)));',
      'vec2 w=vec2(fbm(p+4.*q+vec2(1.7,9.2)+tt),fbm(p+4.*q+vec2(8.3,2.8)-tt));',
      'float f=fbm(p+4.*w);vec3 col=vec3(.07,.08,.15);',
      'col=mix(col,vec3(.45,.27,.75),clamp(f*f*1.7,0.,1.));',
      'col=mix(col,vec3(.16,.45,.85),clamp(length(q)*.9,0.,1.));',
      'col=mix(col,vec3(.90,.28,.58),clamp(w.x*.6,0.,1.));',
      'col*=.5+.6*f;col*=1.-.45*length(uv-.5);',
      'if(uL>.5){col=vec3(.97,.98,1.)-col*.92;}',
      'gl_FragColor=vec4(col,1.);}'].join('');
    var p = prog(gl, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}', fs);
    if (!p) return bgDrift(host);
    gl.useProgram(p); quadAttr(gl, p, 'p');
    var ur = gl.getUniformLocation(p, 'r'), ut = gl.getUniformLocation(p, 't'), ul = gl.getUniformLocation(p, 'uL');
    size();
    function fr(t) {
      if (!run) return;
      gl.uniform2f(ur, c.width, c.height); gl.uniform1f(ut, t * .001); gl.uniform1f(ul, isDark() ? 0 : 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!reduced) requestAnimationFrame(fr);
    }
    requestAnimationFrame(fr);
    return function () { run = false; removeEventListener('resize', size); var e = gl.getExtension('WEBGL_lose_context'); if (e) e.loseContext(); };
  }

  /* — Lines: WebGL1 floating glow waves (reactbits port), cursor bend + parallax — */
  var FL_FS = [
    'precision highp float;uniform float iTime;uniform vec3 iResolution;uniform vec2 iMouse;',
    'uniform float uBend;uniform vec2 uPar;uniform float uL;',
    'const vec3 PINK=vec3(0.914,0.278,0.961);const vec3 BLUE=vec3(0.184,0.294,0.635);',
    'mat2 rot(float r){return mat2(cos(r),sin(r),-sin(r),cos(r));}',
    'vec3 bgc(vec2 uv){vec3 col=vec3(0.);float y=sin(uv.x-.2)*.3-.1;float m=uv.y-y;',
    'col+=mix(BLUE,vec3(0.),smoothstep(0.,1.,abs(m)));col+=mix(PINK,vec3(0.),smoothstep(0.,1.,abs(m-.8)));return col*.5;}',
    'float wave(vec2 uv,float off,vec2 suv,vec2 muv){float tm=iTime;float y=sin(uv.x+off+tm*.1)*(sin(off+tm*.2)*.3);',
    'vec2 d=suv-muv;float inf=exp(-dot(d,d)*5.);y+=(muv.y-suv.y)*inf*-.5*uBend;',
    'float m=uv.y-y;return .0175/max(abs(m)+.01,1e-3)+.01;}',
    'void main(){vec2 buv=(2.*gl_FragCoord.xy-iResolution.xy)/iResolution.y;buv.y*=-1.;buv+=uPar;',
    'vec3 col=vec3(0.);vec3 b=bgc(buv);vec2 muv=(2.*iMouse-iResolution.xy)/iResolution.y;muv.y*=-1.;',
    'for(int i=0;i<6;++i){float fi=float(i);',
    'vec2 r1=buv*rot(-1.*log(length(buv)+1.));col+=b*wave(r1+vec2(.001*fi+2.,-.7),1.5+.2*fi,buv,muv)*.2;',
    'vec2 r2=buv*rot(.2*log(length(buv)+1.));col+=b*wave(r2+vec2(.001*fi+5.,0.),2.+.15*fi,buv,muv);',
    'vec2 r3=buv*rot(-.4*log(length(buv)+1.));r3.x*=-1.;col+=b*wave(r3+vec2(.05*fi+10.,.5),1.+.2*fi,buv,muv)*.1;}',
    'vec3 lc=mix(vec3(.955,.965,.995),col*1.15,clamp(length(col)*1.25,0.,1.));',
    'vec3 oc=mix(col,lc,uL);gl_FragColor=vec4(oc,1.);}'].join('');
  function bgLines(host) {
    var c = mkCanvas(host), gl = c.getContext('webgl') || c.getContext('experimental-webgl');
    if (!gl) return bgFlow(host);
    var run = true, dpr = Math.min(devicePixelRatio || 1, 1.5);
    function size() { c.width = Math.round(innerWidth * dpr); c.height = Math.round(innerHeight * dpr); gl.viewport(0, 0, c.width, c.height); }
    addEventListener('resize', size);
    var p = prog(gl, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}', FL_FS);
    if (!p) return bgFlow(host);
    gl.useProgram(p); quadAttr(gl, p, 'p');
    var u = n => gl.getUniformLocation(p, n);
    var uT = u('iTime'), uR = u('iResolution'), uM = u('iMouse'), uB = u('uBend'), uP = u('uPar'), uL = u('uL');
    var D = .05, tmx = -1e3, tmy = -1e3, cmx = -1e3, cmy = -1e3, ti = 0, ci = 0, tpx = 0, tpy = 0, cpx = 0, cpy = 0;
    function move(e) {
      tmx = e.clientX * dpr; tmy = (innerHeight - e.clientY) * dpr; ti = 1;
      tpx = ((e.clientX - innerWidth / 2) / innerWidth) * .2; tpy = (-(e.clientY - innerHeight / 2) / innerHeight) * .2;
    }
    function leave() { ti = 0; }
    addEventListener('pointermove', move); addEventListener('pointerleave', leave); size();
    function fr(t) {
      if (!run) return;
      cmx += (tmx - cmx) * D; cmy += (tmy - cmy) * D; ci += (ti - ci) * D; cpx += (tpx - cpx) * D; cpy += (tpy - cpy) * D;
      gl.uniform1f(uT, t * .001); gl.uniform3f(uR, c.width, c.height, 1); gl.uniform2f(uM, cmx, cmy);
      gl.uniform1f(uB, ci); gl.uniform2f(uP, cpx, cpy); gl.uniform1f(uL, isDark() ? 0 : 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!reduced) requestAnimationFrame(fr);
    }
    requestAnimationFrame(fr);
    return function () {
      run = false; removeEventListener('resize', size); removeEventListener('pointermove', move); removeEventListener('pointerleave', leave);
      var e = gl.getExtension('WEBGL_lose_context'); if (e) e.loseContext();
    };
  }

  /* — Aurora: WebGL2 simplex ribbon (reactbits port), transparent blend — */
  var AU_V = '#version 300 es\nin vec2 position;void main(){gl_Position=vec4(position,0.,1.);}';
  var AU_F = ['#version 300 es', 'precision highp float;',
    'uniform float uTime;uniform vec3 uStops[3];uniform vec2 uRes;',
    'out vec4 fragColor;',
    'vec3 permute(vec3 x){return mod(((x*34.)+1.)*x,289.);}',
    'float snoise(vec2 v){const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);',
    'vec2 i=floor(v+dot(v,C.yy));vec2 x0=v-i+dot(i,C.xx);vec2 i1=(x0.x>x0.y)?vec2(1.,0.):vec2(0.,1.);',
    'vec4 x12=x0.xyxy+C.xxzz;x12.xy-=i1;i=mod(i,289.);',
    'vec3 p=permute(permute(i.y+vec3(0.,i1.y,1.))+i.x+vec3(0.,i1.x,1.));',
    'vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);m=m*m;m=m*m;',
    'vec3 x=2.*fract(p*C.www)-1.;vec3 h=abs(x)-.5;vec3 ox=floor(x+.5);vec3 a0=x-ox;',
    'm*=1.79284291400159-.85373472095314*(a0*a0+h*h);vec3 g;g.x=a0.x*x0.x+h.x*x0.y;g.yz=a0.yz*x12.xz+h.yz*x12.yw;return 130.*dot(m,g);}',
    'void main(){vec2 uv=gl_FragCoord.xy/uRes;',
    'vec3 ramp=uv.x<.5?mix(uStops[0],uStops[1],uv.x*2.):mix(uStops[1],uStops[2],uv.x*2.-1.);',
    'float hgt=snoise(vec2(uv.x*2.+uTime*.1,uTime*.25))*.5;hgt=exp(hgt);hgt=(uv.y*2.-hgt+.2);',
    'float inten=.6*hgt;float a=smoothstep(-.05,.45,inten);',
    'fragColor=vec4(inten*ramp*a,a);}'].join('\n');
  function bgAurora(host) {
    var c = mkCanvas(host), gl = c.getContext('webgl2', { alpha: true, premultipliedAlpha: true });
    if (!gl) return bgFlow(host);
    var run = true, dpr = Math.min(devicePixelRatio || 1, 1.5);
    gl.clearColor(0, 0, 0, 0); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    var p = prog(gl, AU_V, AU_F);
    if (!p) return bgFlow(host);
    gl.useProgram(p); quadAttr(gl, p, 'position');
    var uT = gl.getUniformLocation(p, 'uTime'), uR = gl.getUniformLocation(p, 'uRes'), uS = gl.getUniformLocation(p, 'uStops');
    var DARK = new Float32Array([1, .30, .62, .55, .36, .96, .13, .83, .99]);
    var LIGHT = new Float32Array([.91, .20, .50, .55, .36, .96, .04, .66, .84]);
    function size() { c.width = Math.round(innerWidth * dpr); c.height = Math.round(innerHeight * dpr); gl.viewport(0, 0, c.width, c.height); gl.uniform2f(uR, c.width, c.height); }
    addEventListener('resize', size); size();
    function fr(t) {
      if (!run) return;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uT, t * .001); gl.uniform3fv(uS, isDark() ? DARK : LIGHT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!reduced) requestAnimationFrame(fr);
    }
    requestAnimationFrame(fr);
    return function () { run = false; removeEventListener('resize', size); var e = gl.getExtension('WEBGL_lose_context'); if (e) e.loseContext(); };
  }

  /* — Topo: signature design — infrastructure network topology.
     drifting server nodes, proximity links, data-packet pulses traveling edges,
     arrival ping rings, cursor proximity highlight. canvas 2d, theme-aware. */
  function bgTopo(host) {
    var c = mkCanvas(host), ctx = c.getContext('2d');
    var W, H, nodes = [], packets = [], rings = [], run = true;
    var mx = -1e4, my = -1e4;
    var LINK = 150, LINK2 = LINK * LINK;
    function resize() {
      W = c.width = innerWidth; H = c.height = innerHeight;
      var n = Math.min(90, Math.round(W * H / 16000));
      nodes = [];
      for (var i = 0; i < n; i++) nodes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
        r: 1.4 + Math.random() * 1.4, hub: Math.random() < .12
      });
      packets = []; rings = [];
    }
    function move(e) { mx = e.clientX; my = e.clientY; }
    function leave() { mx = -1e4; my = -1e4; }
    function spawnPacket() {
      // pick a random connected pair to ride
      for (var tries = 0; tries < 12; tries++) {
        var a = nodes[Math.random() * nodes.length | 0], b = nodes[Math.random() * nodes.length | 0];
        if (a === b) continue;
        var dx = a.x - b.x, dy = a.y - b.y;
        if (dx * dx + dy * dy < LINK2) { packets.push({ a, b, t: 0, sp: .008 + Math.random() * .012 }); return; }
      }
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var dark = isDark();
      var nodeCol  = dark ? '#38bdf8' : '#5b6cf2';
      var hubCol   = dark ? '#ff5da2' : '#e8347f';
      var pktCol   = dark ? '#21d4fd' : '#8b4fe8';
      var linkRGB  = dark ? '146,168,255' : '70,90,150';
      var linkBase = dark ? .17 : .13;
      // move nodes
      for (var nd of nodes) {
        nd.x += nd.vx; nd.y += nd.vy;
        if (nd.x < 0 || nd.x > W) nd.vx *= -1;
        if (nd.y < 0 || nd.y > H) nd.vy *= -1;
      }
      // links (+ cursor proximity boost)
      ctx.lineWidth = 1;
      for (var i = 0; i < nodes.length; i++) for (var j = i + 1; j < nodes.length; j++) {
        var a = nodes[i], b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 > LINK2) continue;
        var w = 1 - d2 / LINK2;
        var cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
        var md = Math.hypot(cx - mx, cy - my);
        var boost = md < 160 ? (1 - md / 160) * .5 : 0;
        ctx.strokeStyle = 'rgba(' + linkRGB + ',' + (w * linkBase + boost).toFixed(3) + ')';
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      // nodes
      for (var nd of nodes) {
        var col = nd.hub ? hubCol : nodeCol;
        ctx.globalAlpha = dark ? .9 : .75;
        if (nd.hub) { ctx.shadowColor = col; ctx.shadowBlur = 10; }
        ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(nd.x, nd.y, nd.hub ? nd.r + 1.2 : nd.r, 0, 6.2832); ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;
      // packets
      if (packets.length < 9 && Math.random() < .06) spawnPacket();
      for (var k = packets.length - 1; k >= 0; k--) {
        var p = packets[k]; p.t += p.sp;
        if (p.t >= 1) {
          if (Math.random() < .5) rings.push({ x: p.b.x, y: p.b.y, r: 2, a: dark ? .5 : .4 });
          packets.splice(k, 1); continue;
        }
        var px = p.a.x + (p.b.x - p.a.x) * p.t, py = p.a.y + (p.b.y - p.a.y) * p.t;
        ctx.shadowColor = pktCol; ctx.shadowBlur = 12; ctx.fillStyle = pktCol;
        ctx.globalAlpha = .95;
        ctx.beginPath(); ctx.arc(px, py, 2.2, 0, 6.2832); ctx.fill();
        // short trail
        ctx.globalAlpha = .3;
        var tx = p.a.x + (p.b.x - p.a.x) * Math.max(0, p.t - .06), ty = p.a.y + (p.b.y - p.a.y) * Math.max(0, p.t - .06);
        ctx.strokeStyle = pktCol; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(px, py); ctx.stroke();
        ctx.shadowBlur = 0; ctx.globalAlpha = 1;
      }
      // arrival ping rings
      for (var k2 = rings.length - 1; k2 >= 0; k2--) {
        var rg = rings[k2]; rg.r += .8; rg.a -= .012;
        if (rg.a <= 0) { rings.splice(k2, 1); continue; }
        ctx.strokeStyle = 'rgba(' + (dark ? '33,212,253' : '139,79,232') + ',' + rg.a.toFixed(3) + ')';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(rg.x, rg.y, rg.r, 0, 6.2832); ctx.stroke();
      }
    }
    function fr() { if (!run) return; draw(); if (!reduced) requestAnimationFrame(fr); }
    resize(); addEventListener('resize', resize);
    addEventListener('pointermove', move); addEventListener('pointerleave', leave);
    requestAnimationFrame(fr);
    return function () {
      run = false; removeEventListener('resize', resize);
      removeEventListener('pointermove', move); removeEventListener('pointerleave', leave);
    };
  }

  var MODES = [['Topo', bgTopo], ['Drift', bgDrift], ['Flow', bgFlow], ['Lines', bgLines], ['Aurora', bgAurora], ['Off', null]];
  window.initBackground = function () {
    var host = document.createElement('div'); host.className = 'bg-host'; document.body.prepend(host);
    var btn = document.createElement('button'); btn.className = 'bg-btn'; btn.type = 'button';
    btn.setAttribute('aria-label', 'Switch background'); document.body.appendChild(btn);
    var stop = null, saved = localStorage.getItem('portal-bg'), idx = 0;
    MODES.forEach((m, i) => { if (m[0] === saved) idx = i; });
    function apply() {
      if (stop) { stop(); stop = null; }
      host.innerHTML = '';
      var r = MODES[idx][1]; if (r) stop = r(host);
      localStorage.setItem('portal-bg', MODES[idx][0]);
      btn.textContent = '🎨 ' + MODES[idx][0];
    }
    btn.onclick = () => { idx = (idx + 1) % MODES.length; apply(); };
    document.addEventListener('themechange', apply);            // re-init with new palette
    document.addEventListener('visibilitychange', () => {       // save GPU when tab hidden
      if (document.hidden) { if (stop) { stop(); stop = null; } } else apply();
    });
    apply();
  };
})();

// apply theme ASAP to avoid flash
window.initTheme();
