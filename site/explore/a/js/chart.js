/* Prestige Marine — EXPLORE A · "The Chart" (26 Oct 2026).
   One function, course(y), steers everything: the vessel's lateral position and heading, the camera
   altitude (zoom), the plotted course on the chart, and the HUD's position / heading / next-waypoint
   readout. The sea is one fixed WebGL surface that moves 1:1 with the scroll, so the notes in the
   document read as sitting ON it. Every word, price and link is in the HTML without this file. */
(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;
    const wide = window.matchMedia('(min-width: 1100px)');
    const phone = window.matchMedia('(max-width: 720px)');
    root.classList.add('js-rise');
    if (!reduce) root.classList.add('sail');

    /* ── Lenis (DNA90): not constructed under reduced motion; no GSAP here, so autoRaf ── */
    let lenis = null;
    const boot = () => {
        if (reduce || !window.Lenis || lenis) return;
        lenis = new window.Lenis({ anchors: { offset: -120 }, autoRaf: true });
        window.__lenis = lenis;
    };
    if (window.Lenis) boot(); else window.addEventListener('load', boot, { once: true });

    /* ── the course ───────────────────────────────────────── */
    const acts = [...document.querySelectorAll('[data-wp]')];
    const main = document.querySelector('[data-main]');
    const svg = document.querySelector('[data-course]');
    const vessel = document.querySelector('[data-vessel]');
    const foot = document.querySelector('[data-foot]');
    let vw = 0, vh = 0, docH = 0, legs = [], moorY = 0, anchorV = 0.54, baseLen = 0;

    // chart frame: latitude falls 1′ (= 1 nm) per `pxPerNm` of course; the voyage ends at 25°55′N 080°08′W
    const LAT_END = 25 + 55 / 60, LON_END = 80 + 8 / 60;
    let pxPerNm = 1;

    const sstep = (t) => t * t * (3 - 2 * t);
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

    function measure() {
        vw = document.documentElement.clientWidth;
        vh = window.innerHeight;
        docH = main.offsetHeight;
        const d = wide.matches;
        anchorV = d ? 0.54 : 0.72;
        baseLen = d ? vh * 0.74 : Math.min(vh * 0.5, vw * 1.45);
        legs = acts.map((el, i) => {
            const top = el.offsetTop, h = el.offsetHeight;
            const lane = +(d ? el.dataset.lane : el.dataset.laneM);
            const zoom = +(d ? el.dataset.zoom : el.dataset.zoomM);
            const drift = +(d ? el.dataset.drift : el.dataset.driftM);
            // hold: the stretch of the act where the vessel keeps its lane and altitude
            // the legs between holds run through each act's open water (its padding-top), never under a note
            const pad = parseFloat(getComputedStyle(el).paddingTop) || 0;
            const y0 = i === 0 ? 0 : top + pad * 0.82;
            const y1 = el.hasAttribute('data-moor') ? top + pad + vh * 0.12 : top + h - vh * 0.04;
            return { el, top, h, lane, zoom, drift, y0, y1: Math.max(y1, y0 + 1), name: el.dataset.name };
        });
        const last = legs[legs.length - 1];
        moorY = last.y1;
        pxPerNm = (moorY - vh * anchorV) / 4.2;   // 4.2 nm of passage, top of page to the mooring
        drawCourse();
    }

    // lateral position (fraction of width) and altitude at a document y
    function course(y) {
        const L = legs;
        if (!L.length) return { x: 0.5, z: 1 };
        for (let i = 0; i < L.length; i++) {
            const a = L[i];
            if (y <= a.y1) {
                if (y >= a.y0 || i === 0) {
                    const t = clamp((y - a.y0) / vh, 0, (a.y1 - a.y0) / vh);
                    return { x: a.lane + a.drift * t, z: a.zoom };
                }
                // the leg between the previous hold and this one
                const p = L[i - 1];
                const px = p.lane + p.drift * ((p.y1 - p.y0) / vh);
                // climb first (the camera rises), then cross: a smaller hull at a gentler angle
                const t = clamp((y - p.y1) / (a.y0 - p.y1), 0, 1);
                const kz = sstep(clamp(t * 2.2, 0, 1));
                const kx = sstep(clamp(t * 1.35 - 0.35, 0, 1));
                return { x: px + (a.lane - px) * kx, z: p.zoom + (a.zoom - p.zoom) * kz };
            }
        }
        const a = L[L.length - 1];
        return { x: a.lane + a.drift * ((a.y1 - a.y0) / vh), z: a.zoom };
    }
    function bearing(y) {
        const dx = (course(y + 6).x - course(y - 6).x) * vw;
        let b = Math.atan2(dx, -12) * 180 / Math.PI;   // screen down = south; atan2(east, north)
        return (b + 360) % 360;
    }

    const NS = 'http://www.w3.org/2000/svg';
    let trackClip = null;
    function drawCourse() {
        svg.setAttribute('viewBox', `0 0 ${vw} ${docH}`);
        svg.style.height = docH + 'px';
        const pts = [];
        const y0 = vh * anchorV;
        for (let y = y0; y <= moorY; y += 16) pts.push([(course(y).x * vw).toFixed(1), y.toFixed(1)]);
        pts.push([(course(moorY).x * vw).toFixed(1), moorY.toFixed(1)]);
        const d = 'M' + pts.map((p) => p.join(' ')).join(' L');
        let marks = '';
        legs.forEach((l, i) => {
            if (i === 0) return;
            const y = l.y0, x = course(y).x * vw;
            marks += `<circle class="course__wp" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9"/><circle class="course__wp-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.5"/>`;
        });
        svg.innerHTML = `<defs><clipPath id="trk"><rect x="0" y="0" width="${vw}" height="0"/></clipPath></defs>
            <path class="course__ahead" d="${d}"/><path class="course__track" d="${d}" clip-path="url(#trk)"/>${marks}`;
        trackClip = svg.querySelector('#trk rect');
    }

    /* ── HUD ─────────────────────────────────────────────── */
    const hudLinks = [...document.querySelectorAll('[data-hud-link]')];
    const $ = (s) => document.querySelector(s);
    const hud = {
        lat: $('[data-hud-lat]'), lon: $('[data-hud-lon]'), hdg: $('[data-hud-hdg]'), next: $('[data-hud-next]'),
        wpS: $('[data-hud-wp-short]'), nameS: $('[data-hud-name-short]'), hdgS: $('[data-hud-hdg-short]'),
        bar: $('[data-scale-bar]')
    };
    const hudEl = $('[data-hud]');
    const fmt = (deg, w) => { const d = Math.floor(deg); const m = (deg - d) * 60; return `${String(d).padStart(w, '0')}°${m.toFixed(2).padStart(5, '0')}′`; };
    let lastHud = '';
    function updateHud(yDoc, hdg, cur, len) {
        const nmLeft = Math.max(0, (moorY - yDoc) / pxPerNm);
        const lat = LAT_END + nmLeft / 60;
        const lon = LON_END + (legs[legs.length - 1].lane - course(yDoc).x) * 3 / 60;
        const nxt = legs[cur + 1];
        const nextTxt = nxt ? `WP 0${cur + 2} · ${Math.max(0, (nxt.y0 - yDoc) / pxPerNm).toFixed(1)} nm` : 'Moored';
        const h = Math.round(hdg).toString().padStart(3, '0');
        const key = `${lat.toFixed(4)}|${lon.toFixed(4)}|${h}|${cur}|${nextTxt}`;
        if (key !== lastHud) {
            lastHud = key;
            hud.lat.textContent = fmt(lat, 2) + 'N';
            hud.lon.textContent = fmt(lon, 3) + 'W';
            hud.hdg.textContent = `${h}° T`;
            hud.next.textContent = nextTxt;
            hud.wpS.textContent = `WP 0${cur + 1}`;
            hud.nameS.textContent = legs[cur].name;
            hud.hdgS.textContent = nxt ? `HDG ${h}°` : 'Moored';
            hudLinks.forEach((a, i) => (i === cur ? a.setAttribute('aria-current', 'step') : a.removeAttribute('aria-current')));
        }
        // the scale bar is the vessel: 63 ft drawn at the vessel's rendered length
        const ppf = len / 63;   // px per foot, from the 63 ft hull as drawn
        const ft = [10, 20, 25, 50, 63, 100, 200, 500].filter((f) => f * ppf <= 110).pop() || 10;
        hud.bar.style.width = Math.round(ft * ppf) + 'px';
        hud.bar.nextElementSibling.textContent = `${ft} ft`;
        hudEl.classList.toggle('is-hero', cur === 0 && yDoc < vh * 0.9);
    }

    /* ── header tone ── */
    const hdr = $('[data-hdr]');

    /* ── the sea (WebGL) ─────────────────────────────────── */
    const canvas = $('[data-sea]');
    const video = $('[data-sea-video]');
    const sea = initSea();

    /* ── frame loop ──────────────────────────────────────── */
    let lastScroll = window.scrollY, vel = 0, t0 = performance.now(), lastY = -1;
    const ripples = [];
    function frame(now) {
        const y = window.scrollY;
        const dy = y - lastScroll; lastScroll = y;
        vel += (Math.abs(dy) - vel) * 0.08;
        const yDoc = Math.min(y + vh * anchorV, moorY);
        const c = course(yDoc);
        const hdg = bearing(yDoc);
        const len = baseLen * c.z;
        const screenY = yDoc - y;
        let cur = 0;
        legs.forEach((l, i) => { if (yDoc >= l.y0 - vh * 0.3) cur = i; });

        if (!reduce) {
            vessel.style.setProperty('--len', len.toFixed(1) + 'px');
            const w = len * 0.3001;
            vessel.style.transform = `translate3d(${(c.x * vw - w / 2).toFixed(1)}px, ${(screenY - len / 2).toFixed(1)}px, 0)`;
            vessel.querySelector('img').style.transform = `rotate(${hdg.toFixed(2)}deg)`;
        }
        if (trackClip) trackClip.setAttribute('height', yDoc.toFixed(0));
        updateHud(yDoc, hdg, cur, reduce ? baseLen : len);
        const ft = foot.getBoundingClientRect().top;
        hdr.dataset.tone = ft < vh * 0.35 ? 'shore' : 'sea';
        root.classList.toggle('ashore', ft < vh * 0.62);

        if (sea) sea.draw({ now, dy, zoom: c.z, boat: [c.x * vw, screenY, hdg * Math.PI / 180, len], wake: reduce ? 0 : clamp(vel / 14, 0, 1), ripples });
        if (!reduce) requestAnimationFrame(frame);
        lastY = y;
    }

    /* the rotation sits on the hull, not on the shadow wrapper, so the sun stays put */
    if (!reduce) {
        const img = vessel.querySelector('img');
        img.style.transformOrigin = '50% 50%';
    }

    measure();
    window.addEventListener('resize', () => { measure(); if (sea) sea.resize(); if (reduce) frame(performance.now()); });
    window.addEventListener('load', measure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    if (reduce) {
        // still: draw the sea and the readout on scroll only, no loop, no ripple, no wake
        frame(performance.now());
        window.addEventListener('scroll', () => requestAnimationFrame(frame), { passive: true });
    } else requestAnimationFrame(frame);

    /* ripples: the pointer drags a soft ring through the water (never under reduced motion) */
    if (!reduce && sea) {
        let lx = -999, ly = -999, lt = 0;
        window.addEventListener('pointermove', (e) => {
            if (e.pointerType === 'touch') return;
            const now = performance.now();
            const dist = Math.hypot(e.clientX - lx, e.clientY - ly);
            if (dist < 28 || now - lt < 70) return;
            const amp = clamp(dist / 90, 0.35, 1);
            ripples.push([e.clientX, e.clientY, now / 1000, amp]);
            if (ripples.length > 8) ripples.shift();
            lx = e.clientX; ly = e.clientY; lt = now;
        }, { passive: true });
        window.addEventListener('pointerdown', (e) => {
            ripples.push([e.clientX, e.clientY, performance.now() / 1000, 1.2]);
            if (ripples.length > 8) ripples.shift();
        }, { passive: true });
    }

    /* ── notes float up when their waypoint is reached ── */
    const notes = [...document.querySelectorAll('.rise')];
    if ('IntersectionObserver' in window && !reduce) {
        let batch = [], timer = 0;
        const io = new IntersectionObserver((es) => {
            es.forEach((e) => { if (e.isIntersecting) { batch.push(e.target); io.unobserve(e.target); } });
            clearTimeout(timer);
            timer = setTimeout(() => {
                batch.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top || a.getBoundingClientRect().left - b.getBoundingClientRect().left);
                batch.forEach((n, i) => { n.style.setProperty('--d', `${i * 160}ms`); n.classList.add('is-in'); });
                batch = [];
            }, 30);
        }, { rootMargin: '0px 0px -16% 0px' });
        notes.forEach((n) => io.observe(n));
    } else notes.forEach((n) => n.classList.add('is-in'));

    /* ── the surf loads on approach ── */
    const surf = $('[data-surf]');
    if (surf && !reduce && 'IntersectionObserver' in window) {
        new IntersectionObserver((es) => es.forEach((e) => {
            if (e.isIntersecting) {
                const src = surf.querySelectorAll('source[data-src]');
                if (src.length) { src.forEach((s) => { s.src = s.dataset.src; s.removeAttribute('data-src'); }); surf.load(); }
                surf.play().catch(() => {});
            } else surf.pause();
        }), { rootMargin: '400px 0px' }).observe(surf);
    }

    /* ── menu ── */
    const menu = $('[data-menu]');
    const toggle = $('[data-menu-toggle]');
    const label = $('[data-menu-label]');
    const behind = [main, foot, $('[data-hud]')];
    const setMenu = (open) => {
        menu.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
        label.textContent = open ? 'Close' : 'Menu';
        root.classList.toggle('menu-open', open);
        behind.forEach((el) => { if (el) el.inert = open; });
        if (lenis) open ? lenis.stop() : lenis.start();
        if (open) menu.querySelector('a').focus();
    };
    toggle.addEventListener('click', () => setMenu(menu.hidden));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
        if (e.key === 'Tab' && !menu.hidden) {   // keep focus inside the header + menu while open
            const f = [...hdr.querySelectorAll('a, button'), ...menu.querySelectorAll('a')].filter((n) => n.offsetParent !== null);
            const i = f.indexOf(document.activeElement);
            if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
            else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
        }
    });
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

    /* ── films ── */
    const box = $('[data-film-box]');
    const vid = $('[data-film-video]');
    let opener = null;
    const closeFilm = () => { vid.pause(); vid.removeAttribute('src'); vid.load(); if (box.open) box.close(); if (lenis) lenis.start(); opener?.focus(); };
    document.querySelectorAll('[data-film]').forEach((b) => b.addEventListener('click', () => {
        if (!box.showModal) { window.open(b.dataset.film, '_blank', 'noopener'); return; }
        opener = b;
        box.setAttribute('aria-label', b.dataset.filmTitle || 'Film');
        vid.src = b.dataset.film;
        if (lenis) lenis.stop();
        box.showModal();
        vid.play().catch(() => {});
    }));
    $('[data-film-close]').addEventListener('click', closeFilm);
    box.addEventListener('cancel', (e) => { e.preventDefault(); closeFilm(); });
    box.addEventListener('click', (e) => { if (e.target === box) closeFilm(); });

    /* ── form (mock-up): Enquire arrives with the boat chosen; validate, then confirm locally ── */
    const form = $('[data-form]');
    document.querySelectorAll('[data-enquire]').forEach((a) => a.addEventListener('click', () => {
        const sel = form.elements.interest;
        const opt = [...sel.options].find((o) => o.text === a.dataset.enquire);
        if (opt) sel.value = opt.value;
    }));
    const rules = {
        name: (v) => (v.trim() ? '' : 'Enter your name.'),
        phone: (v) => (v.replace(/\D/g, '').length >= 10 ? '' : 'Enter a phone number with at least 10 digits.'),
        email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter an email address like name@example.com.')
    };
    const check = (input) => {
        const msg = rules[input.name](input.value);
        const err = document.getElementById(input.getAttribute('aria-describedby'));
        input.closest('.field').classList.toggle('is-invalid', !!msg);
        input.setAttribute('aria-invalid', msg ? 'true' : 'false');
        err.textContent = msg; err.hidden = !msg;
        return msg;
    };
    Object.keys(rules).forEach((n) => form.elements[n].addEventListener('blur', (e) => { if (e.target.value || e.target.getAttribute('aria-invalid')) check(e.target); }));
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const bad = Object.keys(rules).map((n) => form.elements[n]).filter((i) => check(i));
        if (bad.length) { bad[0].focus(); return; }
        const done = form.querySelector('[data-form-done]');
        [...form.children].forEach((c) => { if (c !== done) c.hidden = true; });
        done.hidden = false; done.focus();
    });

    /* ════════════════════════════════════════════════════════
       The sea shader. The approved azure loop is the surface texture; a colour ramp holds it saturated
       (the pale shallows become light azure, never white), low-frequency noise and a domain warp make
       the tiled loop one continuous seascape, the graticule is drawn in sea coordinates, the pointer
       leaves rings, the hull leaves a wake while it moves, and every [data-pool] text gets a deep
       pool dug under it so white type holds AA on the composited render.
       ════════════════════════════════════════════════════════ */
    function initSea() {
        let gl = null;
        try { gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false, preserveDrawingBuffer: true }); } catch (e) { gl = null; }
        if (!gl) { root.classList.add('no-gl'); return null; }

        const vs = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;
        const fs = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes; uniform float uDpr;
uniform vec2 uCenter; uniform float uZoom; uniform vec2 uTile;
uniform float uTime;
uniform vec4 uRip[8];
uniform vec4 uBoat; uniform float uWake;
uniform vec4 uPool[8];
uniform float uReady;

float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float a = .5, s = 0.; for (int i = 0; i < 4; i++){ s += a*n(p); p = p*2.03 + 17.1; a *= .5; } return s; }
// one tile, read three times at staggered offsets and cross-faded away from each read's seams,
// so the repeated loop shows no edge and no mirror chevron
float ew(vec2 f){ vec2 e = min(f, 1. - f); return smoothstep(0., .2, min(e.x, e.y)) + .0001; }
vec3 tap(vec2 u){
  vec2 a = fract(u), b = fract(u + vec2(.5, .5)), c = fract(u + vec2(.25, .75));
  float wa = ew(a), wb = ew(b), wc = ew(c);
  return (texture2D(uTex, a).rgb * wa + texture2D(uTex, b).rgb * wb + texture2D(uTex, c).rgb * wc) / (wa + wb + wc);
}
float luma(vec3 c){ return dot(c, vec3(.299, .587, .114)); }
vec3 ramp(float t){
  vec3 d2 = vec3(.020, .330, .392);   // pool    #05545F
  vec3 d  = vec3(.031, .478, .541);   // deep    #087A8A
  vec3 m  = vec3(.078, .690, .745);   // mid     #14B0BE
  vec3 s  = vec3(.400, .847, .839);   // shoal   #66D8D6
  if (t < 0.) return mix(d, d2, clamp(-t / .3, 0., 1.));
  if (t < .5) return mix(d, m, t / .5);
  return mix(m, s, (t - .5) / .5);
}
void main(){
  vec2 p = vec2(gl_FragCoord.x, uRes.y * uDpr - gl_FragCoord.y) / uDpr;
  vec2 disp = vec2(0.); float sh = 0.;
  for (int i = 0; i < 8; i++){
    vec4 r = uRip[i]; float age = uTime - r.z;
    if (r.w <= 0. || age < 0. || age > 3.2) continue;
    vec2 d = p - r.xy; float dist = length(d) + .001;
    float env = exp(-pow((dist - age * 240.) / 95., 2.)) * exp(-age * 1.15) * r.w;
    float w = sin(dist * .085 - age * 10.) * env;
    disp += d / dist * w * 9.; sh += w;
  }
  vec2 q = p + disp;
  vec2 world = uCenter + (q - uRes * .5) / uZoom;
  vec2 warp = vec2(fbm(world / 1500. + 3.1), fbm(world / 1500. - 7.7)) - .5;
  vec2 wv = world + warp * 320.;
  vec2 uv = wv / uTile;
  vec3 c = tap(uv);
  vec2 o = 10. / uZoom / uTile;
  vec3 m = (tap(uv + vec2(o.x, 0.)) + tap(uv - vec2(o.x, 0.)) + tap(uv + vec2(0., o.y)) + tap(uv - vec2(0., o.y))) * .25;
  float L = luma(c), M = luma(m);
  float hi = max(L - M, 0.);
  float vt = smoothstep(.40, .90, M);
  float ft = smoothstep(.28, .72, fbm(world / 1100. + 40.));
  float t = mix(ft, vt, mix(.35, .8, smoothstep(.45, .95, uZoom)));
  t = mix(.42, t, uReady);
  // deep pools under white type
  float pool = 0.;
  for (int i = 0; i < 8; i++){
    vec4 r = uPool[i]; if (r.z <= r.x) continue;
    vec2 c0 = (r.xy + r.zw) * .5, hs = (r.zw - r.xy) * .5 + 20.;
    vec2 dd = abs(p - c0) - hs;
    float sd = length(max(dd, 0.)) + min(max(dd.x, dd.y), 0.);
    sd += (fbm(world / 220.) - .5) * 70.;
    pool = max(pool, 1. - smoothstep(-24., 120., sd));
  }
  t = mix(t, -.3, pool);
  vec3 col = ramp(t);
  float spark = mix(.5, 1.7, smoothstep(.3, .85, uZoom)) * (1. - pool * .7);
  col += hi * spark * vec3(.85, 1., 1.) * uReady;
  col += sh * .08;
  // graticule, in sea coordinates: one line every 420 sea units
  vec2 g = abs(fract(world / 420.) - .5);
  float gd = (.5 - max(g.x, g.y)) * 420. * uZoom;
  float line = 1. - smoothstep(.4, 1.3, gd);
  col = mix(col, vec3(1.), line * .14 * (1. - pool));
  // wake: a Kelvin wedge and a churned trail astern, only while the vessel moves
  if (uWake > .01){
    vec2 f = vec2(sin(uBoat.z), -cos(uBoat.z));
    vec2 S = uBoat.xy - f * uBoat.w * .47;
    vec2 qq = p - S; float a = dot(qq, -f); float b = dot(qq, vec2(-f.y, f.x));
    if (a > 0.){
      float len = uBoat.w;
      float spread = a * .34 + len * .1;
      float edge = exp(-pow((abs(b) - spread) / (5. + a * .05), 2.)) * exp(-a / (len * 1.5));
      float trail = exp(-pow(b / (len * .07 + a * .09), 2.)) * exp(-a / (len * 1.05));
      float churn = .55 + .45 * fbm(vec2(a * .05 - uTime * 2.2, b * .08));
      float wk = (edge * .45 + trail * .8 * churn) * uWake;
      col = mix(col, vec3(.94, 1., 1.), clamp(wk, 0., .82));
    }
  }
  gl_FragColor = vec4(col, 1.);
}`;
        const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; } return s; };
        const prog = gl.createProgram();
        const v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
        if (!v || !f) { root.classList.add('no-gl'); return null; }
        gl.attachShader(prog, v); gl.attachShader(prog, f); gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { root.classList.add('no-gl'); return null; }
        gl.useProgram(prog);
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, 'p');
        gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        const U = {}; ['uTex', 'uRes', 'uDpr', 'uCenter', 'uZoom', 'uTile', 'uTime', 'uRip', 'uBoat', 'uWake', 'uPool', 'uReady'].forEach((k) => { U[k] = gl.getUniformLocation(prog, k); });

        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([20, 176, 190]));
        let ready = 0, srcW = 1600, srcH = 900, frameDirty = false;

        // the still: the poster, uploaded once (it is the reduced-motion sea and the first frame)
        const poster = new Image();
        poster.src = phone.matches ? '../../assets/img/gen-azure-topdown-m2-poster.jpg' : '../../assets/img/gen-azure-topdown-poster.jpg';
        poster.onload = () => {
            if (ready === 2) return;
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, poster);
            srcW = poster.naturalWidth; srcH = poster.naturalHeight; ready = 1; fit();
            root.classList.add('gl-on');
            if (reduce) requestAnimationFrame(frame);
        };
        if (!reduce) {
            video.play().catch(() => {});
            const onFrame = () => { frameDirty = true; if (video.requestVideoFrameCallback) video.requestVideoFrameCallback(onFrame); };
            if (video.requestVideoFrameCallback) video.requestVideoFrameCallback(onFrame);
            video.addEventListener('playing', () => { srcW = video.videoWidth; srcH = video.videoHeight; ready = 2; fit(); frameDirty = true; });
        }

        let dpr = 1, W = 0, H = 0, tile = [1600, 900];
        const center = [0, 0];
        function fit() {
            // one tile covers the first screen at altitude 1, exactly like the approved hero
            const s = Math.max(W / srcW, H / srcH);
            tile = [srcW * s, srcH * s];
        }
        function resize() {
            dpr = Math.min(window.devicePixelRatio || 1, phone.matches ? 2 : 1.5);
            W = canvas.clientWidth; H = canvas.clientHeight;
            canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
            gl.viewport(0, 0, canvas.width, canvas.height);
            fit();
        }
        resize();
        center[0] = tile[0] / 2; center[1] = tile[1] / 2 + window.scrollY;

        const pools = () => {
            const out = new Float32Array(32);
            let k = 0;
            document.querySelectorAll('[data-pool]').forEach((el) => {
                if (k >= 8) return;
                const r = el.getBoundingClientRect();
                if (r.bottom < -200 || r.top > H + 200 || r.width === 0) return;
                const op = parseFloat(getComputedStyle(el.closest('.rise') || el).opacity);
                if (op < 0.02 && el.closest('.rise')) return;
                out.set([r.left, r.top, r.right, r.bottom], k * 4); k++;
            });
            return out;
        };

        let lastZoom = 1;
        function draw(s) {
            if (ready === 2 && frameDirty && video.readyState >= 2) {
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
                frameDirty = false;
            }
            // the sea moves 1:1 with the page in screen pixels, whatever the altitude
            center[1] += s.dy / s.zoom;
            lastZoom = s.zoom;
            const time = s.now / 1000;
            const rip = new Float32Array(32);
            s.ripples.forEach((r, i) => rip.set(r, i * 4));
            gl.uniform1i(U.uTex, 0);
            gl.uniform2f(U.uRes, W, H); gl.uniform1f(U.uDpr, dpr);
            gl.uniform2f(U.uCenter, center[0], center[1]);
            gl.uniform1f(U.uZoom, s.zoom);
            gl.uniform2f(U.uTile, tile[0], tile[1]);
            gl.uniform1f(U.uTime, time);
            gl.uniform4fv(U.uRip, rip);
            gl.uniform4f(U.uBoat, s.boat[0], s.boat[1], s.boat[2], s.boat[3]);
            gl.uniform1f(U.uWake, s.wake);
            gl.uniform4fv(U.uPool, pools());
            gl.uniform1f(U.uReady, ready ? 1 : 0);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
        // in reduced motion the sea is re-drawn on scroll, so the scroll delta is still applied
        return { draw, resize };
    }
})();
