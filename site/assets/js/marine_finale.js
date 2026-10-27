/* Prestige Marine — homepage FINALE (26 Oct 2026): v2's page on the sea of explore/a.
   One fixed WebGL sea under the page (the approved azure loop held saturated, deep pools dug under
   white type, rings under the pointer, a wake astern of the hull while the page moves). Lenis is the
   scroll layer (DNA90). Every word, price and link is in the HTML without this file. */
(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const phone = window.matchMedia('(max-width: 720px)');
    const root = document.documentElement;
    const $ = (s) => document.querySelector(s);
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

    let lenis = null;
    const boot = () => {
        if (reduce || !window.Lenis || lenis) return;
        lenis = new window.Lenis({ anchors: { offset: -64 }, autoRaf: true });
        window.__lenis = lenis;
    };
    if (window.Lenis) boot(); else window.addEventListener('load', boot, { once: true });

    /* header: always on screen. Bare over the first screen; once the page moves the section row folds
       away and the bar takes the ground of whatever is under it (deep glass over water, white over a
       panel, navy over the land band and the footer), so its type never crosses live content */
    const hdr = $('[data-hdr]');
    const grounds = [...document.querySelectorAll('.panel, .land, .foot')];
    const toneHdr = () => {
        const y = hdr.querySelector('.hdr__bar').offsetHeight;
        hdr.classList.toggle('is-compact', window.scrollY > 40);
        if (window.scrollY <= 40) { hdr.dataset.tone = 'water'; return; }
        const under = grounds.find((el) => { const r = el.getBoundingClientRect(); return r.top < y && r.bottom > y * 0.5; });
        hdr.dataset.tone = !under ? 'deep' : under.classList.contains('land') ? 'dark' : 'light';
    };
    window.addEventListener('scroll', toneHdr, { passive: true }); toneHdr();

    /* ── the sea ── */
    const canvas = $('[data-sea]');
    const video = $('[data-sea-video]');
    const hull = $('[data-hull]');
    const sea = initSea();
    const ripples = [];
    let lastScroll = window.scrollY, vel = 0, cruise = 0;
    function frame(now) {
        const y = window.scrollY;
        const dy = y - lastScroll; lastScroll = y;
        vel += (Math.abs(dy) - vel) * 0.08;
        if (!reduce) placeHull(now);
        const r = hull.getBoundingClientRect();
        const boat = [r.left + r.width / 2, r.top + r.height / 2, 0, r.height];
        // the boat is under way: while it is in view the water streams astern on its own, and the sea
        // follows the page at only a fifth of its speed, so the hull visibly overtakes the water
        const inView = r.bottom > 0 && r.top < innerHeight;
        const dt = Math.min(0.05, (now - (frame.t || now)) / 1000); frame.t = now;
        cruise += ((inView && !reduce ? 1 : 0) - cruise) * 0.04;
        const drift = -cruise * 46 * dt;
        if (sea) sea.draw({ now, dy: dy * 0.2 + drift, boat, wake: reduce ? 0 : clamp(0.38 * cruise + vel / 12, 0, 1) * (inView ? 1 : 0), ripples });
        if (!reduce) { stepCards(); requestAnimationFrame(frame); }
    }
    window.addEventListener('resize', () => { if (sea) sea.resize(); if (reduce) frame(performance.now()); });
    if (reduce) { frame(performance.now()); window.addEventListener('scroll', () => requestAnimationFrame(frame), { passive: true }); }
    else requestAnimationFrame(frame);

    if (!reduce && sea) {
        let lx = -999, ly = -999, lt = 0;
        window.addEventListener('pointermove', (e) => {
            if (e.pointerType === 'touch') return;
            const now = performance.now();
            const dist = Math.hypot(e.clientX - lx, e.clientY - ly);
            if (dist < 28 || now - lt < 70) return;
            ripples.push([e.clientX, e.clientY, now / 1000, clamp(dist / 90, 0.35, 1)]);
            if (ripples.length > 8) ripples.shift();
            lx = e.clientX; ly = e.clientY; lt = now;
        }, { passive: true });
        window.addEventListener('pointerdown', (e) => {
            ripples.push([e.clientX, e.clientY, performance.now() / 1000, 1.2]);
            if (ripples.length > 8) ripples.shift();
        }, { passive: true });
    }

    /* ── the hull sails up its lane over the whole stage, and rocks a little: it is in full view on the
       first screen (where the lane's --start puts its bow) and has left by the top when the stage ends ── */
    const stage = $('.stage');
    const hero = $('.hero');
    const lane = $('.lane');
    const fig = hull.parentElement;
    let swapY = 0;   // the boat switch: how far the hull is off its course while one boat leaves and the next arrives
    function placeHull(now) {
        const vh = innerHeight;
        const st = stage.getBoundingClientRect();
        const hh = hull.offsetHeight;
        const start = parseFloat(getComputedStyle(lane).getPropertyValue('--start')) || 0.2;
        // desktop: the whole stage, slow at first so the hull stays beside its facts; phone: the first
        // screen only, so the facts can take the full width behind it
        const qq = phone.matches
            ? clamp(-st.top / Math.max(1, hero.offsetHeight * 0.9), 0, 1)
            : Math.pow(clamp(-st.top / Math.max(1, st.height - vh), 0, 1), 1.6);
        const yImg = (1 - qq) * vh * start + qq * (-hh - vh * 0.05);
        const top = fig.getBoundingClientRect().top;                   // where the sticky lane is now
        const t = now / 1000;
        const roll = Math.sin(t * 0.9) * 0.7 + Math.sin(t * 0.37) * 0.25;
        const sway = Math.sin(t * 0.55) * 3;
        hull.style.transform = `translate3d(${sway.toFixed(2)}px, ${(yImg - top + swapY).toFixed(1)}px, 0) rotate(${roll.toFixed(3)}deg)`;
    }

    /* ── the plate and the facts arrive one by one, each on its own stretch of the passage; the rail
       fills with the stage and the counter names the fact on show ── */
    const passage = $('.passage');
    let cards = [...document.querySelectorAll('.voyage__cards .rise')];
    const plate = $('.voyage__plate');
    const switcher = $('.passage .bswitch');
    const railFill = $('[data-rail]');
    const count = $('[data-count]');
    function stepCards() {
        const r = passage.getBoundingClientRect();
        // 0 when the passage top reaches 70% of the screen, 1 when its bottom is a screen away
        const p = clamp((innerHeight * 0.7 - r.top) / Math.max(1, r.height - innerHeight * 0.3), 0, 1);
        const shown = Math.floor(p * (cards.length + 0.6));
        cards.forEach((c, i) => c.classList.toggle('is-in', i < shown));
        plate.classList.toggle('is-in', p > 0.01); switcher.classList.toggle('is-in', p > 0.01);
        const st = stage.getBoundingClientRect();
        railFill.style.transform = `scaleY(${clamp(-st.top / Math.max(1, st.height - innerHeight), 0, 1).toFixed(3)})`;
        count.textContent = String(clamp(shown, 1, cards.length)).padStart(2, '0');
        countOf.textContent = '/ ' + String(cards.length).padStart(2, '0');
    }
    const countOf = $('[data-count-of]');

    /* ── several boats (27 Oct, as on blue): one per brand with a hull seen from directly above. The brand row
       on the first screen and the switch on the plate choose it, kept in sync; the last boat sails off the
       top before the next rises from below, and the plate and its facts take the new boat's words ── */
    const BOATS = {
        tecnomar: {
            line: 'The boat you deserve starts here.',
            img: ['assets/img/gen-tecnomar63-top.webp', 750, 2499, 'A Tecnomar for Lamborghini 63 in Giallo yellow with black carbon, seen from directly above (generated artwork).'],
            kicker: 'The flagship we represent', name: 'Tecnomar for Lamborghini 63', price: 'Request price', status: 'In stock: 2022, Verde Gea, 96 hours',
            facts: [['Lineage', 'Conceived in synergy between Automobili Lamborghini and The Italian Sea Group. Terzo Millennio and Sián FKP 37 are its main inspirations.'],
                ['Power', 'Two MAN V12 engines, 2,000 hp each.'], ['Build', 'Carbon fibre keeps her among the ultralight boats: 24 tons for 63 feet.'],
                ['Hard top', 'Inspired by Lamborghini’s roadster models.'], ['Size', '<span class="num">63′ × 17′8″</span>']],
            link: 'https://www.prestigemarine.co/boats-for-sale/2022-tecnomar-lamborghini-63-north-miami-beach-florida-10360903/', enquire: '2022 Tecnomar Lamborghini 63'
        },
        midnight: {
            line: 'Miami-built, family-owned.',
            img: ['assets/img/me52-hull.webp', 324, 1236, 'The 2026 Midnight Express 52 Vitesse from directly above: Grigio Lynx hull, camel seating, carbon hard top, outboards at the stern.'],
            kicker: 'In stock now', name: '2026 Midnight Express 52 Vitesse', price: '$2,500,000', status: 'Available now · as listed 26 Oct 2026',
            facts: [['Bow', 'Custom painted hull in Lamborghini Grigio Lynx, with camel seating.'], ['Hard top', 'Carbon exposed hard top. Midnight Express infusion construction, paired with select carbon fiber sections.'],
                ['Amidships', 'The first Seakeeper 10, designed for much larger yachts, installed on a Midnight Express.'], ['Stern', 'Mercury Racing 500R outboards, painted the colour of the hull.']],
            link: 'https://www.prestigemarine.co/boats-for-sale/2026-midnight-express-52-vitesse-north-miami-beach-florida-10173015/', enquire: '2026 Midnight Express 52 Vitesse'
        },
        vandutch: {
            line: 'Essential lines, refined power.',
            img: ['assets/img/vd402-hull.webp', 268, 927, 'The 2021 VanDutch 40.2 from directly above: Super Jet Black hull with a Pagani Silver bootstripe, teak deck.'],
            kicker: 'In stock now', name: '2021 VanDutch 40.2', price: '$698,500', status: 'As listed 26 Oct 2026 · Miami Beach, Florida',
            facts: [['Hull', 'Super Jet Black, with a Pagani Silver bootstripe.'], ['Power', 'Twin Volvo Penta D6, 440 hp each, with joystick control.'],
                ['Hours', 'Under 140.'], ['Length × beam', '<span class="num">40′11″ × 11′5″</span>']],
            link: 'https://www.prestigemarine.co/boats-for-sale/2021-vandutch-402-miami-beach-florida-10308760/', enquire: '2021 VanDutch 40.2'
        }
    };
    const P = (k) => passage.querySelector(`[data-p="${k}"]`);
    const h1 = $('#h1');
    const choosers = [...document.querySelectorAll('[data-boat]')];
    let current = 'tecnomar', busy = false;
    const tween = (from, to, ms, ease) => new Promise((done) => {
        const t0 = performance.now();
        const tick = (now) => { const k = clamp((now - t0) / ms, 0, 1); swapY = from + (to - from) * ease(k); k < 1 ? requestAnimationFrame(tick) : done(); };
        requestAnimationFrame(tick);
    });
    const easeIn = (k) => k * k * k, easeOut = (k) => 1 - Math.pow(1 - k, 4);
    function fill(b) {
        P('kicker').textContent = b.kicker; P('name').textContent = b.name; P('price').textContent = b.price; P('status').textContent = b.status;
        P('link').href = b.link; P('enquire').dataset.enquire = b.enquire;
        P('facts').innerHTML = b.facts.map(([k, v]) => `<li class="ice card rise"><span class="card__k">${k}</span>${v}</li>`).join('');
        cards = [...P('facts').children];
        if (reduce) cards.forEach((c) => c.classList.add('is-in'));   // otherwise the next frame raises them again, one by one
    }
    async function choose(key) {
        if (key === current || busy || !BOATS[key]) return;
        busy = true; current = key;
        choosers.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.boat === key)));
        const b = BOATS[key];
        const pre = new Image(); pre.src = b.img[0];
        // the headline changes in place: out, then in, never two lines at once
        (async () => {
            if (!reduce) await h1.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-10px)' }], { duration: 220, easing: 'ease-in', fill: 'forwards' }).finished;
            h1.textContent = b.line;
            if (!reduce) h1.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' });
        })();
        if (!reduce) await tween(0, -1.1 * innerHeight - hull.offsetHeight * 0.5, 650, easeIn);   // the boat sails off the top
        try { await pre.decode(); } catch (e) { /* the swap still happens */ }
        hull.src = b.img[0]; hull.setAttribute('width', b.img[1]); hull.setAttribute('height', b.img[2]); hull.alt = b.img[3];
        fill(b);
        if (!reduce) await tween(1.1 * innerHeight, 0, 1300, easeOut);   // the next one sails in from below
        busy = false;
    }
    choosers.forEach((c) => c.addEventListener('click', () => choose(c.dataset.boat)));

    if (reduce) { cards.forEach((c) => c.classList.add('is-in')); plate.classList.add('is-in'); switcher.classList.add('is-in'); }
    else { window.addEventListener('scroll', stepCards, { passive: true }); stepCards(); }

    /* ── the catalogue's tiles and cards rise as their row arrives, one after another ── */
    const risers = [...document.querySelectorAll('.tile.rise, .boat.rise')];
    if (reduce || !('IntersectionObserver' in window)) risers.forEach((el) => el.classList.add('is-in'));
    else {
        const io = new IntersectionObserver((es) => es.forEach((e) => {
            if (!e.isIntersecting) return;
            const sibs = [...e.target.parentElement.children];
            e.target.style.transitionDelay = `${(sibs.indexOf(e.target) % 4) * 0.09}s`;
            e.target.classList.add('is-in');
            io.unobserve(e.target);
        }), { rootMargin: '0px 0px -12% 0px' });
        risers.forEach((el) => io.observe(el));
    }

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

    /* ── brands: on the phone the tiles are a swipe rail, kept out of Lenis ── */
    const rail = $('[data-brands]');
    if (rail && phone.matches) rail.setAttribute('data-lenis-prevent', '');

    /* ── inventory: side elevations load when the section is near ── */
    const inv = document.getElementById('inventory');
    if ('IntersectionObserver' in window) {
        new IntersectionObserver((es, o) => es.forEach((e) => {
            if (!e.isIntersecting) return;
            inv.querySelectorAll('img[data-src]').forEach((im) => { im.src = im.dataset.src; im.removeAttribute('data-src'); });
            o.disconnect();
        }), { rootMargin: '100% 0px' }).observe(inv);
    }

    /* ── the Brands list in the section row ── */
    const dropT = $('.hdr__droptgl');
    if (dropT) {
        dropT.addEventListener('click', () => dropT.setAttribute('aria-expanded', String(dropT.getAttribute('aria-expanded') !== 'true')));
        document.addEventListener('click', (e) => { if (!e.target.closest('.hdr__drop')) dropT.setAttribute('aria-expanded', 'false'); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && dropT.getAttribute('aria-expanded') === 'true') { dropT.setAttribute('aria-expanded', 'false'); dropT.focus(); } });
    }

    /* ── menu (the page behind it is inert) ── */
    const menu = $('[data-menu]');
    const toggle = $('[data-menu-toggle]');
    const label = $('[data-menu-label]');
    const behind = [$('[data-main]'), $('.foot')];
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

    /* ── form (mock-up) ── */
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
       The sea shader, from explore/a (the chart's graticule and course left out). The approved azure
       loop is the surface; a colour ramp holds it saturated (pale shallows become light azure, never
       white); three staggered reads of one tile, cross-faded, make it one continuous sea; every
       [data-pool] gets a deep pool dug under it so white type holds AA; the pointer leaves rings; the
       hull leaves a wake while the page moves.
       ════════════════════════════════════════════════════════ */
    function initSea() {
        let gl = null;
        try { gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false }); } catch (e) { gl = null; }
        if (!gl) { root.classList.add('no-gl'); return null; }
        const vs = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }';
        const fs = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes; uniform float uDpr;
uniform vec2 uCenter; uniform vec2 uTile;
uniform float uTime;
uniform vec4 uRip[8];
uniform vec4 uBoat; uniform float uWake;
uniform vec4 uPool[8];
uniform float uReady;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float a = .5, s = 0.; for (int i = 0; i < 4; i++){ s += a*n(p); p = p*2.03 + 17.1; a *= .5; } return s; }
float ew(vec2 f){ vec2 e = min(f, 1. - f); return smoothstep(0., .2, min(e.x, e.y)) + .0001; }
vec3 tap(vec2 u){
  vec2 a = fract(u), b = fract(u + vec2(.5, .5)), c = fract(u + vec2(.25, .75));
  float wa = ew(a), wb = ew(b), wc = ew(c);
  return (texture2D(uTex, a).rgb * wa + texture2D(uTex, b).rgb * wb + texture2D(uTex, c).rgb * wc) / (wa + wb + wc);
}
float luma(vec3 c){ return dot(c, vec3(.299, .587, .114)); }
vec3 ramp(float t){
  // the approved azure (Alex, 27 Oct: "the water as it was" — the finale's own ramp)
  vec3 d2 = vec3(.020, .330, .392);
  vec3 d  = vec3(.031, .478, .541);
  vec3 m  = vec3(.078, .690, .745);
  vec3 s  = vec3(.400, .847, .839);
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
  vec2 world = uCenter + (q - uRes * .5);
  vec2 warp = vec2(fbm(world / 1500. + 3.1), fbm(world / 1500. - 7.7)) - .5;
  vec2 uv = (world + warp * 320.) / uTile;
  vec3 c = tap(uv);
  vec2 o = 10. / uTile;
  vec3 m = (tap(uv + vec2(o.x, 0.)) + tap(uv - vec2(o.x, 0.)) + tap(uv + vec2(0., o.y)) + tap(uv - vec2(0., o.y))) * .25;
  float L = luma(c), M = luma(m);
  float hi = max(L - M, 0.);
  float vt = smoothstep(.40, .90, M);
  float ft = smoothstep(.28, .72, fbm(world / 1100. + 40.));
  float t = mix(ft, vt, .8);
  t = mix(.42, t, uReady);
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
  col += hi * 1.7 * (1. - pool * .7) * vec3(.85, 1., 1.) * uReady;
  col += sh * .08;
  if (uWake > .01){
    vec2 f = vec2(0., -1.);
    vec2 S = uBoat.xy - f * uBoat.w * .47;
    vec2 qq = p - S; float a = dot(qq, -f); float b = qq.x;
    if (a > 0.){
      float len = uBoat.w;
      float spread = a * .34 + len * .1;
      float edge = exp(-pow((abs(b) - spread) / (5. + a * .05), 2.)) * exp(-a / (len * 1.5));
      float trail = exp(-pow(b / (len * .07 + a * .09), 2.)) * exp(-a / (len * 1.05));
      float churn = .55 + .45 * fbm(vec2(a * .05 - uTime * 2.2, b * .08));
      col = mix(col, vec3(.94, 1., 1.), clamp((edge * .45 + trail * .8 * churn) * uWake, 0., .82));
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
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, 'p');
        gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        const U = {}; ['uTex', 'uRes', 'uDpr', 'uCenter', 'uTile', 'uTime', 'uRip', 'uBoat', 'uWake', 'uPool', 'uReady'].forEach((k) => { U[k] = gl.getUniformLocation(prog, k); });
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array([20, 176, 190]));
        let ready = 0, srcW = 1600, srcH = 900, frameDirty = false;
        const poster = new Image();
        poster.src = phone.matches ? 'assets/img/gen-azure-topdown-m2-poster.jpg' : 'assets/img/gen-azure-topdown-poster.jpg';
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
        function fit() { const s = Math.max(W / srcW, H / srcH); tile = [srcW * s, srcH * s]; }
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
                out.set([r.left, r.top, r.right, r.bottom], k * 4); k++;
            });
            return out;
        };
        function draw(s) {
            if (ready === 2 && frameDirty && video.readyState >= 2) {
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
                frameDirty = false;
            }
            center[1] += s.dy;   // the sea's own travel (a fraction of the page's, plus the boat's way)
            const rip = new Float32Array(32);
            s.ripples.forEach((r, i) => rip.set(r, i * 4));
            gl.uniform1i(U.uTex, 0);
            gl.uniform2f(U.uRes, W, H); gl.uniform1f(U.uDpr, dpr);
            gl.uniform2f(U.uCenter, center[0], center[1]);
            gl.uniform2f(U.uTile, tile[0], tile[1]);
            gl.uniform1f(U.uTime, s.now / 1000);
            gl.uniform4fv(U.uRip, rip);
            gl.uniform4f(U.uBoat, s.boat[0], s.boat[1], s.boat[2], s.boat[3]);
            gl.uniform1f(U.uWake, s.wake);
            gl.uniform4fv(U.uPool, pools());
            gl.uniform1f(U.uReady, ready ? 1 : 0);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
        return { draw, resize };
    }
})();
