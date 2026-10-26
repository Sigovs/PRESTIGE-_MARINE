/* Prestige Marine — EXPLORE B "Day to Night" (26 Oct 2026).
   The scroll is the clock. One key table, written against the page's own chapters, drives everything
   that changes with the hour: the water's light (WebGL grade between two loops of the same water),
   the boat's pose, its shadow (long by golden hour, gone at dusk), its lights (on at dusk), the header
   and HUD tone. The pointer ripples the water. Every word, price and link is in the HTML without this.
   Lenis is the scroll layer (DNA90): one loop, driven from this file's rAF. */
(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const phoneQ = window.matchMedia('(max-width: 720px)');
    if (reduce) root.classList.add('rm');

    const $ = (s, el = document) => el.querySelector(s);
    const $$ = (s, el = document) => [...el.querySelectorAll(s)];
    const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const lerp = (a, b, t) => a + (b - a) * t;
    const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
    const ease = (t) => t * t * t * (t * (t * 6 - 15) + 10);   // smootherstep: holds at each chapter

    const hdr = $('[data-hdr]');
    const hud = $('[data-hud]');
    const hudTime = $('[data-hud-time]');
    const hudPhase = $('[data-hud-phase]');
    const hudDot = $('[data-hud-dot]');
    const voyage = $('[data-voyage]');
    const vessel = $('[data-vessel]');
    const dayV = $('[data-day]');
    const nightV = $('[data-night]');
    const canvas = $('[data-gl]');
    const foot = $('.foot');
    const chapters = $$('.voyage [data-chapter]');
    const nightHead = $('.night__head');
    const marques = $$('.marque');
    const dawnCard = $('.card--visit');

    /* ── Lenis ── */
    let lenis = null;
    const bootLenis = () => {
        if (reduce || !window.Lenis || lenis) return;
        lenis = new window.Lenis({ autoRaf: false, anchors: { offset: -72 } });
        window.__lenis = lenis;
    };
    if (window.Lenis) bootLenis(); else window.addEventListener('load', bootLenis, { once: true });

    /* ── the key table: scroll centre → hour, light, pose ──
       tod 0 = midday … .5 = golden hour … 1 = night; dawn 0 → 1 = first light; min = minutes since 00:00 */
    const POSE_D = [
        { x: .66, y: .55, r: -20, s: 1 },     // first screen: right of the headline
        { x: .52, y: .50, r: -10, s: 1 },     // 14:00
        { x: .50, y: .46, r: -6,  s: 1.02 },  // 16:30
        { x: .50, y: .44, r: -11, s: 1.04 },  // 18:40
        { x: .52, y: .42, r: -15, s: 1.06 },  // 20:15
        { x: .52, y: .40, r: -15, s: 1.06 }   // stage releases
    ];
    const POSE_M = [
        { x: .5, y: .53, r: -8, s: 1 },
        { x: .5, y: .36, r: -4, s: .82 },
        { x: .5, y: .36, r: -9, s: .82 },
        { x: .5, y: .36, r: -5, s: .82 },
        { x: .5, y: .36, r: -8, s: .82 },
        { x: .5, y: .34, r: -8, s: .82 }
    ];
    let keys = [];
    const centreY = (el) => { const r = el.getBoundingClientRect(); return r.top + window.scrollY + r.height / 2; };
    function buildKeys() {
        const vh = window.innerHeight;
        const vBottom = voyage.getBoundingClientRect().bottom + window.scrollY;
        const P = phoneQ.matches ? POSE_M : POSE_D;
        keys = [
            { y: vh / 2,                     tod: 0,   dawn: 0, min: 720,  pose: P[0] },
            { y: centreY(chapters[0]),       tod: .12, dawn: 0, min: 840,  pose: P[1] },
            { y: centreY(chapters[1]),       tod: .32, dawn: 0, min: 990,  pose: P[2] },
            { y: centreY(chapters[2]),       tod: .52, dawn: 0, min: 1120, pose: P[3] },
            { y: centreY(chapters[3]),       tod: .82, dawn: 0, min: 1215, pose: P[4] },
            { y: vBottom - vh / 2,           tod: .96, dawn: 0, min: 1260, pose: P[5] },
            { y: centreY(nightHead),         tod: 1,   dawn: 0, min: 1290, pose: P[5] },
            { y: centreY(marques[marques.length - 1]), tod: 1, dawn: 0, min: 1430, pose: P[5] },
            { y: centreY(dawnCard),          tod: 1,   dawn: 1, min: 1820, pose: P[5] }
        ];
    }
    function sample(yc) {
        if (yc <= keys[0].y) return { ...keys[0], ...keys[0].pose };
        for (let i = 1; i < keys.length; i++) {
            const a = keys[i - 1], b = keys[i];
            if (yc <= b.y) {
                const t = ease(clamp((yc - a.y) / Math.max(1, b.y - a.y)));
                const tl = clamp((yc - a.y) / Math.max(1, b.y - a.y));   // the clock runs evenly
                return {
                    tod: lerp(a.tod, b.tod, t), dawn: lerp(a.dawn, b.dawn, t), min: lerp(a.min, b.min, tl),
                    x: lerp(a.pose.x, b.pose.x, t), y: lerp(a.pose.y, b.pose.y, t),
                    r: lerp(a.pose.r, b.pose.r, t), s: lerp(a.pose.s, b.pose.s, t)
                };
            }
        }
        const z = keys[keys.length - 1];
        return { ...z, ...z.pose };
    }
    const phase = (m) => m < 760 ? 'Midday' : m < 900 ? 'High sun' : m < 1060 ? 'Afternoon' : m < 1150 ? 'Golden hour'
        : m < 1200 ? 'Sunset' : m < 1270 ? 'After dark' : m < 1720 ? 'Night' : 'First light';
    const hhmm = (m) => { const t = Math.round(m) % 1440; return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0'); };

    /* ── WebGL sea ── */
    const VERT = 'attribute vec2 p;varying vec2 vUv;void main(){vUv=p*.5+.5;vUv.y=1.-vUv.y;gl_Position=vec4(p,0.,1.);}';
    const FRAG = `precision highp float;
varying vec2 vUv;
uniform sampler2D uDay; uniform sampler2D uNight;
uniform vec2 uRes; uniform float uDayAsp; uniform float uNightAsp;
uniform float uTod; uniform float uDawn; uniform float uTime;
uniform vec2 uBoat; uniform float uAng; uniform vec2 uHalf; uniform float uWash; uniform float uBoatOn;
uniform vec4 uRip[16];
vec2 cover(vec2 uv, float ta){ float sa = uRes.x / uRes.y; vec2 s = sa > ta ? vec2(1., ta / sa) : vec2(sa / ta, 1.); return (uv - .5) * s + .5; }
float luma(vec3 c){ return dot(c, vec3(.2126, .7152, .0722)); }
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1., 0.)), f.x), mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), f.x), f.y); }
void main(){
  vec2 px = vUv * uRes;
  vec2 disp = vec2(0.); float shade = 0.;
  for (int i = 0; i < 16; i++) {
    vec4 r = uRip[i];
    if (r.w <= 0.) continue;
    vec2 d = px - r.xy; float dist = length(d);
    float x = dist - r.z * 230.;
    float env = exp(-x * x / 2600.) * exp(-r.z * 1.5) * r.w;
    float w = sin(x * .12) * env;
    disp += d / (dist + 1.) * w * 10.;
    shade += cos(x * .12) * env;
  }
  vec2 s = (px + disp) / uRes;
  vec3 day = texture2D(uDay, cover(s, uDayAsp)).rgb;
  vec3 nt = texture2D(uNight, cover(s, uNightAsp)).rgb;
  float ld = luma(day);

  /* afternoon → golden hour: the same water, the light warms and lowers; the glints turn gold */
  float g = smoothstep(.16, .5, uTod) * (1. - smoothstep(.62, .82, uTod));
  vec3 gold = mix(day * vec3(1.03, .92, .8), day * vec3(.9, .97, 1.), smoothstep(.5, .82, ld)) + vec3(1., .6, .22) * pow(ld, 6.) * 1.6;
  /* the low sun is in the west (screen right): a warm sheen lies across that side of the water only */
  /* on the open water only — the sand bars stay cool, so the light warms and the ground never turns beige */
  float sheen = smoothstep(.25, 1.1, s.x) * (1. - smoothstep(.5, .8, ld));
  gold += vec3(.95, .55, .2) * sheen * .13;
  vec3 c = mix(day, gold, g * .9);
  c *= 1. - .14 * smoothstep(.08, .52, uTod);
  /* dusk: a violet hour between the gold and the night */
  float dk = smoothstep(.52, .7, uTod) * (1. - smoothstep(.8, .96, uTod));
  c = mix(c, c * vec3(.7, .66, .92), dk * .65);

  /* night: the moonlit loop, graded down to ink blue; caustics gone, moon glints twinkle upper right */
  float n = smoothstep(.55, .9, uTod);
  float ln = luma(nt);
  vec3 ngt = nt * vec3(.36, .58, .8) * .86;
  vec2 cell = floor(px / 2.5);
  float tw = .5 + .5 * sin(uTime * (1.6 + hash(cell) * 3.5) + hash(cell + 3.1) * 6.283);
  float moon = smoothstep(1.05, .05, length((s - vec2(.8, .18)) * vec2(1., 1.5)));
  ngt += vec3(.84, .92, 1.) * smoothstep(.42, .64, ln) * tw * (.25 + moon * 1.1) * .55;
  ngt *= mix(1., .6, smoothstep(.35, .95, length((s - .5) * vec2(1.15, 1.))));
  c = mix(c, ngt, n);

  /* the ripple's ring catches the light */
  c += vec3(.86, .95, 1.) * shade * mix(.11, .16, n);

  /* underwater lights and the stern's wash, in boat space (bow = -y) */
  if (uBoatOn > 0.) {
    vec2 q = px - uBoat; float ca = cos(-uAng), sn = sin(-uAng);
    q = vec2(ca * q.x - sn * q.y, sn * q.x + ca * q.y);
    float a = max(uHalf.y - uHalf.x, 0.);
    float sd = length(q - vec2(0., clamp(q.y, -a, a))) - uHalf.x;
    float stern = smoothstep(-.5, .95, q.y / uHalf.y);
    float glow = exp(-max(sd, 0.) / (uHalf.x * .8)) * mix(.25, 1., stern);
    vec3 lightC = vec3(.3, .9, 1.);
    c += lightC * glow * n * (.3 + 1.2 * ln) * .9 * uBoatOn;
    float behind = q.y - uHalf.y * .9;
    if (behind > 0.) {
      float spread = uHalf.x * (.85 + behind / uHalf.y * .6);
      float lat = 1. - smoothstep(spread * .35, spread, abs(q.x));
      float fade = exp(-behind / (uHalf.y * .85));
      float foam = noise(vec2(q.x * .06, q.y * .035 - uTime * 2.2)) * .6 + noise(vec2(q.x * .16, q.y * .09 - uTime * 3.4)) * .4;
      float wsh = lat * fade * smoothstep(.38, .8, foam) * uWash * uBoatOn;
      c = mix(c, mix(vec3(.92, .99, 1.), lightC * .95, n), wsh * .55);
    }
  }

  /* first light: the day water, cooled and quiet, before the surf */
  vec3 dawn = mix(vec3(ld), day, .5) * vec3(.88, .93, 1.04) * .9 + vec3(1., .82, .92) * pow(ld, 3.) * .16;
  c = mix(c, dawn, uDawn);
  gl_FragColor = vec4(c, 1.);
}`;

    let gl = null, prog = null, U = {}, texDay = null, texNight = null;
    const lastT = new WeakMap();
    function initGL() {
        try {
            gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false, powerPreference: 'high-performance', preserveDrawingBuffer: true });
        } catch (e) { gl = null; }
        if (!gl) return false;
        const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; } return s; };
        const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
        if (!vs || !fs) { gl = null; return false; }
        prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { gl = null; return false; }
        gl.useProgram(prog);
        const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        ['uDay', 'uNight', 'uRes', 'uDayAsp', 'uNightAsp', 'uTod', 'uDawn', 'uTime', 'uBoat', 'uAng', 'uHalf', 'uWash', 'uBoatOn', 'uRip']
            .forEach((n) => { U[n] = gl.getUniformLocation(prog, n); });
        const mk = (unit) => { const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([14, 94, 106])); return t; };
        texDay = mk(0); texNight = mk(1);
        gl.uniform1i(U.uDay, 0); gl.uniform1i(U.uNight, 1);
        canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); root.classList.remove('gl'); gl = null; });
        return true;
    }
    const upload = (v, tex, unit) => {
        if (v.readyState < 2) return;
        const t = v.currentTime;
        if (lastT.get(v) === t) return;
        lastT.set(v, t);
        gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, v);
    };
    let dpr = 1;
    function sizeCanvas() {
        dpr = Math.min(window.devicePixelRatio || 1, phoneQ.matches ? 2 : 1.5);
        canvas.width = Math.round(window.innerWidth * dpr);
        canvas.height = Math.round(window.innerHeight * dpr);
        if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
    }
    const glOK = initGL();
    if (glOK) root.classList.add('gl');
    sizeCanvas();

    /* ── ripples under the pointer (not under reduced motion) ── */
    const RIP = new Float32Array(16 * 4); const ripT = new Float64Array(16); let ripI = 0;
    let lastRip = { x: -999, y: -999, t: 0 };
    const addRipple = (x, y, amp) => {
        RIP[ripI * 4] = x; RIP[ripI * 4 + 1] = y; RIP[ripI * 4 + 3] = amp; ripT[ripI] = performance.now(); ripI = (ripI + 1) % 16;
    };
    if (glOK && !reduce) {
        window.addEventListener('pointermove', (e) => {
            const now = performance.now(); const dx = e.clientX - lastRip.x, dy = e.clientY - lastRip.y; const d = Math.hypot(dx, dy);
            if (d < 16 || now - lastRip.t < 28) return;
            const speed = d / Math.max(16, now - lastRip.t);
            addRipple(e.clientX, e.clientY, clamp(.25 + speed * .35, .25, 1));
            lastRip = { x: e.clientX, y: e.clientY, t: now };
        }, { passive: true });
        window.addEventListener('pointerdown', (e) => addRipple(e.clientX, e.clientY, 1.3), { passive: true });
    }

    /* ── videos: the night loop runs only while it can be seen ── */
    if (reduce) { [dayV, nightV].forEach((v) => { v.removeAttribute('autoplay'); v.pause(); }); }
    else dayV.play().catch(() => {});
    const want = (v, on) => { if (reduce) return; if (on && v.paused) v.play().catch(() => {}); else if (!on && !v.paused) v.pause(); };

    /* ── the frame ── */
    let lastY = window.scrollY, lastNow = performance.now(), wash = 0, tone = 'day';
    const vstyle = vessel.style;
    function frame(now) {
        if (lenis) lenis.raf(now);
        const vw = window.innerWidth, vh = window.innerHeight, y = window.scrollY;
        const st = sample(y + vh / 2);
        const tod = st.tod, dawn = st.dawn;

        // pose: under reduced motion the boat holds its first-screen pose
        const P = reduce ? (phoneQ.matches ? POSE_M[0] : POSE_D[0]) : st;
        const bh = vessel.offsetHeight, bw = vessel.offsetWidth;
        const stageOff = Math.min(0, voyage.getBoundingClientRect().bottom - vh);
        const bx = P.x * vw, by = P.y * vh;
        vstyle.setProperty('--x', bx.toFixed(1) + 'px');
        vstyle.setProperty('--y', by.toFixed(1) + 'px');
        vstyle.setProperty('--r', P.r.toFixed(2) + 'deg');
        vstyle.setProperty('--s', P.s.toFixed(4));

        // the sun: shadow lengthens toward golden hour and is gone at dusk; world-fixed, written in boat space
        const sunLow = smooth(0, .55, tod);
        const len = lerp(.1, .75, sunLow) * bw;
        const ang = lerp(42, 16, sunLow) * Math.PI / 180;
        const wx = Math.cos(ang) * len, wy = Math.sin(ang) * len;
        const rr = -P.r * Math.PI / 180;
        vstyle.setProperty('--sx', ((wx * Math.cos(rr) - wy * Math.sin(rr)) / P.s).toFixed(1) + 'px');
        vstyle.setProperty('--sy', ((wx * Math.sin(rr) + wy * Math.cos(rr)) / P.s).toFixed(1) + 'px');
        vstyle.setProperty('--so', (lerp(.62, .66, sunLow) * (1 - smooth(.56, .74, tod))).toFixed(3));
        vstyle.setProperty('--sb', lerp(7, 14, sunLow).toFixed(1) + 'px');
        const night = smooth(.55, .85, tod) * (1 - dawn);
        vstyle.setProperty('--night', night.toFixed(3));
        vstyle.setProperty('--lamps', (smooth(.62, .76, tod) * (1 - dawn)).toFixed(3));

        // header and HUD: re-toned, never hidden
        const t2 = tod > .6 && dawn < .55 ? 'night' : 'day';
        if (t2 !== tone) { tone = t2; hdr.dataset.tone = tone; }
        hudTime.textContent = hhmm(st.min);
        hudPhase.textContent = phase(st.min);
        hudDot.style.setProperty('--p', (clamp((st.min - 720) / 1100) * 120).toFixed(1) + 'px');
        
        // the stern wash follows the visitor's own speed
        const dt = Math.max(1, now - lastNow);
        const v = Math.abs(y - lastY) / dt * 1000;
        wash += (clamp(v / 1400) - wash) * .08;
        lastY = y; lastNow = now;

        const seaVisible = foot.getBoundingClientRect().top > 0;
        want(dayV, seaVisible && (tod < .97 || dawn > .01));
        want(nightV, seaVisible && tod > .3 && dawn < .99);

        if (gl && seaVisible) {
            if (canvas.width !== Math.round(vw * dpr) || canvas.height !== Math.round(vh * dpr)) sizeCanvas();
            if (tod < .97 || dawn > .01) upload(dayV, texDay, 0);
            if (tod > .3) upload(nightV, texNight, 1);
            gl.uniform2f(U.uRes, vw, vh);
            gl.uniform1f(U.uDayAsp, dayV.videoWidth ? dayV.videoWidth / dayV.videoHeight : 16 / 9);
            gl.uniform1f(U.uNightAsp, nightV.videoWidth ? nightV.videoWidth / nightV.videoHeight : 16 / 9);
            gl.uniform1f(U.uTod, tod); gl.uniform1f(U.uDawn, dawn);
            gl.uniform1f(U.uTime, reduce ? 0 : now / 1000);
            gl.uniform2f(U.uBoat, bx, by + stageOff);
            gl.uniform1f(U.uAng, P.r * Math.PI / 180);
            gl.uniform2f(U.uHalf, bw * P.s / 2, bh * P.s / 2);
            gl.uniform1f(U.uWash, reduce ? 0 : wash);
            gl.uniform1f(U.uBoatOn, stageOff > -vh ? 1 : 0);
            for (let i = 0; i < 16; i++) {
                const age = (now - ripT[i]) / 1000;
                if (RIP[i * 4 + 3] > 0 && age > 2.8) RIP[i * 4 + 3] = 0;
                RIP[i * 4 + 2] = age;
            }
            gl.uniform4fv(U.uRip, RIP);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        } else if (!gl) {
            nightV.style.opacity = smooth(.55, .9, tod) * (1 - dawn);
        }
        requestAnimationFrame(frame);
    }

    buildKeys();
    window.addEventListener('resize', () => { buildKeys(); sizeCanvas(); });
    window.addEventListener('load', buildKeys);
    if (document.fonts) document.fonts.ready.then(buildKeys);
    phoneQ.addEventListener?.('change', buildKeys);
    requestAnimationFrame(frame);

    /* ── chapters arrive in steps, once ── */
    const arrivals = $$('[data-chapter]');
    if ('IntersectionObserver' in window && !reduce) {
        const io = new IntersectionObserver((es) => es.forEach((e) => {
            if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
        }), { rootMargin: '0px 0px -18% 0px', threshold: .12 });
        arrivals.forEach((a) => io.observe(a));
    } else arrivals.forEach((a) => a.classList.add('is-in'));

    /* ── the surf loads on approach ── */
    const surf = $('[data-surf]');
    if (surf && 'IntersectionObserver' in window) {
        new IntersectionObserver((es) => es.forEach((e) => {
            if (!e.isIntersecting) { surf.pause(); return; }
            const src = surf.querySelectorAll('source[data-src]');
            if (src.length) { src.forEach((s) => { s.src = s.dataset.src; s.removeAttribute('data-src'); }); surf.load(); }
            if (!reduce) surf.play().catch(() => {});
        }), { rootMargin: '400px 0px' }).observe(surf);
    }

    /* ── menu: the page behind it is inert while it is open ── */
    const menu = $('[data-menu]'), toggle = $('[data-menu-toggle]'), label = $('[data-menu-label]');
    const behind = [$('#main'), foot];
    const setMenu = (open) => {
        menu.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
        label.textContent = open ? 'Close' : 'Menu';
        root.classList.toggle('menu-open', open);
        behind.forEach((el) => { el.inert = open; });
        if (lenis) open ? lenis.stop() : lenis.start();
        if (open) menu.querySelector('a').focus();
    };
    toggle.addEventListener('click', () => setMenu(menu.hidden));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); } });
    $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
})();
