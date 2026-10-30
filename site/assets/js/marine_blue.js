/* Prestige Marine — BLUE layout (27 Oct 2026). The finale's own system (one WebGL sea under the page, the
   header that takes the ground under it, the ice, the catalogue) on the storyboard's layout: before the page
   moves the pills choose the boat — one at a time, the last sails off the top before the next rises, and no
   word on the screen moves; as the page moves the promise leaves upward, the boat sails up to its stern with
   a wake, and its plate arrives fact by fact; then the plate leaves upward and the catalogue rises.
   Every word of the default boat is in the HTML without this file. */
(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const phone = window.matchMedia('(max-width: 720px)');
    const root = document.documentElement;
    const $ = (s) => document.querySelector(s);
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const seg = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
    const smooth = (t) => t * t * (3 - 2 * t);

    let lenis = null;
    const boot = () => { if (reduce || !window.Lenis || lenis) return; lenis = new window.Lenis({ anchors: { offset: -64 }, autoRaf: true }); window.__lenis = lenis; };
    if (window.Lenis) boot(); else window.addEventListener('load', boot, { once: true });

    /* header: always on screen. Bare over the first screen; once the page moves the section row folds
       away and the bar takes the ground of whatever is under it */
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

    /* ── the boats: one per brand that has a hull seen from directly above; ft draws them to one scale ── */
    const BOATS = {
        tecnomar: {
            line: 'The boat you deserve starts here.',
            ft: 63, img: ['assets/img/gen-tecnomar63-top.webp', 750, 2499, 'A Tecnomar for Lamborghini 63 in Giallo yellow with black carbon, seen from directly above (generated artwork).'],
            kicker: 'The flagship we represent', name: 'Tecnomar for Lamborghini 63', price: 'Request price', status: 'In stock: 2022, Verde Gea, 96 hours',
            facts: [['Lineage', 'Conceived in synergy between Automobili Lamborghini and The Italian Sea Group. Terzo Millennio and Sián FKP 37 are its main inspirations.'],
                ['Power', 'Two MAN V12 engines, 2,000 hp each.'], ['Build', 'Carbon fibre keeps her among the ultralight boats: 24 tons for 63 feet.'], ['Hard top', 'Inspired by Lamborghini’s roadster models.']],
            link: 'https://www.prestigemarine.co/boats-for-sale/2022-tecnomar-lamborghini-63-north-miami-beach-florida-10360903/', enquire: '2022 Tecnomar Lamborghini 63'
        },
        midnight: {
            line: 'Miami-built, family-owned.',
            ft: 52, img: ['assets/img/me52-hull.webp', 324, 1236, 'The 2026 Midnight Express 52 Vitesse from directly above: Grigio Lynx hull, camel seating, carbon hard top, outboards at the stern.'],
            kicker: 'In stock now', name: '2026 Midnight Express 52 Vitesse', price: '$2,500,000', status: 'Available now · as listed 26 Oct 2026',
            facts: [['Bow', 'Custom painted hull in Lamborghini Grigio Lynx, with camel seating.'], ['Hard top', 'Carbon exposed hard top. Midnight Express infusion construction, paired with select carbon fiber sections.'],
                ['Amidships', 'The first Seakeeper 10, designed for much larger yachts, installed on a Midnight Express.'], ['Stern', 'Mercury Racing 500R outboards, painted the colour of the hull.']],
            link: 'https://www.prestigemarine.co/boats-for-sale/2026-midnight-express-52-vitesse-north-miami-beach-florida-10173015/', enquire: '2026 Midnight Express 52 Vitesse'
        },
        vandutch: {
            line: 'Essential lines, refined power.',
            ft: 40.92, img: ['assets/img/vd402-hull.webp', 268, 927, 'The 2021 VanDutch 40.2 from directly above: Super Jet Black hull with a Pagani Silver bootstripe, teak deck.'],
            kicker: 'In stock now', name: '2021 VanDutch 40.2', price: '$698,500', status: 'As listed 26 Oct 2026 · Miami Beach, Florida',
            facts: [['Hull', 'Super Jet Black, with a Pagani Silver bootstripe.'], ['Power', 'Twin Volvo Penta D6, 440 hp each, with joystick control.'],
                ['Hours', 'Under 140.'], ['Length × beam', '40′11″ × 11′5″.']],
            link: 'https://www.prestigemarine.co/boats-for-sale/2021-vandutch-402-miami-beach-florida-10308760/', enquire: '2021 VanDutch 40.2'
        }
    };

    const hull = $('[data-hull]');
    const lane = $('[data-lane]');
    const plate = $('[data-plate]');
    const P = (k) => plate.querySelector(`[data-p="${k}"]`);
    const scale = (b) => { hull.style.setProperty('--nat', `${b.img[2]}px`);  };
    scale(BOATS.tecnomar);
    let steps = [...plate.querySelectorAll('.step')];
    const railFill = $('[data-rail]'), countEl = $('[data-count]'), countOf = $('[data-count-of]'), railBox = $('[data-rail-box]');
    function fill(b) {
        P('kicker').textContent = b.kicker; P('name').textContent = b.name; P('price').textContent = b.price; P('status').textContent = b.status;
        P('facts').innerHTML = b.facts.map(([k, v]) => `<li class="ice card step"><span class="card__k">${k}</span>${v}</li>`).join('');
        P('enquire').dataset.enquire = b.enquire;
        steps = [...plate.querySelectorAll('.step')];
        if (reduce) steps.forEach((s) => { s.style.opacity = 1; });
    }

    const intro = $('[data-intro]');
    const pills = [...document.querySelectorAll('[data-boat]')];
    let current = 'tecnomar', busy = false;
    async function choose(key) {
        if (key === current || busy) return;
        busy = true; current = key;
        pills.forEach((p) => p.setAttribute('aria-pressed', String(p.dataset.boat === key)));
        const b = BOATS[key];
        const pre = new Image(); pre.src = b.img[0];
        // the headline changes in place: out, then in, never two lines at once
        const h1 = intro.querySelector('.hero__h1');
        const swapLine = async () => {
            if (!reduce) await h1.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-10px)' }], { duration: 220, easing: 'ease-in', fill: 'forwards' }).finished;
            h1.textContent = b.line;
            if (!reduce) h1.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' });
        };
        swapLine();
        if (!reduce) await lane.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(-110vh)', opacity: 1 }], { duration: 650, easing: 'cubic-bezier(.55,0,.75,.2)', fill: 'forwards' }).finished;   // the boat sails off the top
        try { await pre.decode(); } catch (e) { /* the swap still happens */ }
        hull.src = b.img[0]; hull.setAttribute('width', b.img[1]); hull.setAttribute('height', b.img[2]); hull.alt = b.img[3];
        scale(b); fill(b);
        if (!reduce) await lane.animate([{ transform: 'translateY(110vh)', opacity: 1 }, { transform: 'none', opacity: 1 }], { duration: 1300, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' }).finished;   // the next one sails in from below
        busy = false;
    }
    pills.forEach((p) => p.addEventListener('click', () => choose(p.dataset.boat)));

    // the plate keeps one size for all three boats: each part is measured with every boat's words, the largest is held
    function holdPlate() {
        const card = plate.querySelector('.bplate__card'), st = plate.style, all = Object.values(BOATS);
        ['--name-h', '--card-h', '--facts-h'].forEach((k) => st.removeProperty(k));
        let n = 0, c = 0, f = 0;
        all.forEach((b) => { fill(b); n = Math.max(n, P('name').offsetHeight); });
        st.setProperty('--name-h', `${n}px`);
        all.forEach((b) => { fill(b); c = Math.max(c, card.offsetHeight); f = Math.max(f, P('facts').offsetHeight); });
        fill(BOATS[current]);
        st.setProperty('--card-h', `${c}px`); st.setProperty('--facts-h', `${f}px`);
    }
    holdPlate();
    if (document.fonts) document.fonts.ready.then(holdPlate);
    let holdT = 0;
    window.addEventListener('resize', () => { clearTimeout(holdT); holdT = setTimeout(holdPlate, 120); }, { passive: true });

    /* ── the held stage, drawn every frame with the sea ── */
    const stage = $('[data-stage]');
    const canvas = $('[data-sea]');
    const video = $('[data-sea-video]');
    const ripples = [];
    let sea = null, lastScroll = window.scrollY, vel = 0, cruise = 0, wakeV = 0.6, armV = 0, trailOn = 1;
    const brandsEl = document.getElementById('brands');
    let tilt = 0, tiltA = 0, tiltTo = 0, pitch = 0, pitchA = 0, pitchTo = 0;
    if (!reduce) {
        hull.addEventListener('pointermove', (e) => {
            if (e.pointerType !== 'mouse') return;
            const q = hull.getBoundingClientRect();
            tiltTo = clamp((e.clientX - (q.left + q.width / 2)) / (q.width / 2), -1, 1);
            const top = Math.max(q.top, 0), bot = Math.min(q.bottom, innerHeight);   // the part of the hull on screen
            pitchTo = clamp((e.clientY - (top + bot) / 2) / Math.max(1, (bot - top) / 2), -1, 1);
        });
        hull.addEventListener('pointerleave', () => { tiltTo = 0; pitchTo = 0; });
    }
    function placeStage(now) {
        const vh = innerHeight;
        const r = stage.getBoundingClientRect();
        const p = clamp(-r.top / Math.max(1, r.height - 2 * vh), 0, 1);   // the last screen of the hold is the brands panel sliding over it
        // the promise leaves upward, whole and sharp, before the plate comes in
        const a = smooth(seg(p, 0, 0.2));
        intro.style.transform = `translate3d(0, ${(-a * 80).toFixed(2)}vh, 0)`;
        intro.style.opacity = (1 - seg(p, 0.12, 0.2)).toFixed(3);
        intro.style.visibility = p > 0.2 ? 'hidden' : '';
        // the plate rises fact by fact, holds, then leaves upward the same way
        // ... and leaves the same way, one by one from the top: each line rises and fades in turn
        // as in the finale: the plate first, then the facts one by one, each on its own stretch, like steps
        const n = steps.length;
        let shown = 0;
        steps.forEach((s, i) => {
            const t = smooth(seg(p, 0.16 + i * 0.09, 0.24 + i * 0.09));
            const o = smooth(seg(p, 0.8 + i * (0.12 / n), 0.86 + i * (0.12 / n)));
            if (i > 0 && t > 0.5) shown = i;
            s.style.opacity = (t * (1 - o)).toFixed(3);
            s.style.transform = `translate3d(0, ${((1 - t) * 56 - o * 90).toFixed(1)}px, 0)`;
        });
        // the rail fills with the facts and the counter names the one on show
        const facts = n - 1;
        railFill.style.transform = `scaleY(${clamp(seg(p, 0.16, 0.16 + facts * 0.09 + 0.08), 0, 1).toFixed(3)})`;
        countEl.textContent = String(Math.max(1, shown)).padStart(2, '0');
        countOf.textContent = '/ ' + String(facts).padStart(2, '0');
        railBox.style.opacity = (seg(p, 0.12, 0.2) * (1 - seg(p, 0.84, 0.94))).toFixed(3);
        plate.classList.toggle('is-live', p > 0.3 && p < 0.85);
        // the boat sails up from its bow to its stern, rocking a little
        const hh = hull.offsetHeight;
        // before the page moves: the bow just above the pills (the phone: under the buttons), the stern off the
        // bottom, never under the header bar; as the page moves the ocean stays and the boat sails up and away
        const pills = intro.querySelector('.pills'), cta = intro.querySelector('.hero__cta');
        const bar = hdr.querySelector('.hdr__bar').offsetHeight;
        const y0 = phone.matches ? cta.offsetTop + cta.offsetHeight + vh * 0.05 : Math.max(bar + vh * 0.04, pills.offsetTop - vh * 0.07);
        const y1 = Math.min(y0, vh * 0.93 - hh);   // the stern comes into view near the bottom while the plate is read
        // then, as the plate leaves and the brands slide over, the boat keeps going up and off the top
        const run = Math.max(1, r.height - 2 * vh);
        const tail = clamp((-r.top - run * 0.8) / (run * 0.2 + vh * 0.7), 0, 1);
        const y = reduce ? y0 : y0 + (y1 - y0) * smooth(seg(p, 0.02, 0.78)) + (-hh - vh * 0.1 - y1) * smooth(tail);
        const x = phone.matches && !reduce ? (smooth(seg(p, 0.1, 0.3)) - smooth(seg(p, 0.88, 0.98))) * 125 : 0;   // on the phone it slips out of the plate's way
        const t = now / 1000;
        const roll = reduce ? 0 : Math.sin(t * 0.9) * 0.6 + Math.sin(t * 0.37) * 0.2;
        // on hover the boat turns toward the pointer: it heels, pitches and yaws a little, through two stages of
        // smoothing so it starts and stops softly, like something heavy on water, and settles back when it leaves
        tiltA += (tiltTo - tiltA) * 0.035; tilt += (tiltA - tilt) * 0.045;
        pitchA += (pitchTo - pitchA) * 0.035; pitch += (pitchA - pitch) * 0.045;
        hull.style.transform = `translate3d(${x.toFixed(1)}%, ${y.toFixed(1)}px, 0) perspective(2400px) rotateX(${(pitch * -4).toFixed(3)}deg) rotateY(${(tilt * 7).toFixed(3)}deg) rotate(${(roll + tilt * 2.4).toFixed(3)}deg)`;
    }
    /* a school of fish passes under the surface now and then, along the edge of the first scene, away from the
       words; it scatters from the pointer and closes up again */
    const fishC = document.createElement('canvas');
    const fx = fishC.getContext('2d');
    // two kinds take turns; every pass draws its own count, size and spacing
    const FISH = [
        { n: [18, 44], len: [26, 40], dens: [0.75, 1.35], spread: 0.5, speed: 205, wide: 0.066, fin: 0.1, flex: 0.5, wag: 11, soft: 1.1 },
        { n: [3, 7], len: [56, 84], dens: [0.85, 1.4], spread: 0.7, speed: 140, wide: 0.082, fin: 0.1, flex: 0.4, wag: 5, soft: 1.8 }
    ];
    const pick = (r) => r[0] + Math.random() * (r[1] - r[0]);
    /* one fish from above, drawn along a flexing spine: a round head, wide shoulders with swept pectoral fins, then a
       long taper into a thin tail; the swimming wave grows towards the tail */
    const FS = 0.75, SPINE = 15, sx = new Float32Array(SPINE), sy = new Float32Array(SPINE), nx = new Float32Array(SPINE), ny = new Float32Array(SPINE), hw = new Float32Array(SPINE);
    function drawFish(f, type, t) {
        const L = f.len, W = L * type.wide, ds = L / (SPINE - 1);
        let x = L * 0.3, y = 0;
        for (let i = 0; i < SPINE; i++) {
            const q = i / (SPINE - 1);
            const th = type.flex * Math.pow(q, 1.5) * Math.sin(t * type.wag + f.ph - q * 4.6) + f.bend * q;
            sx[i] = x; sy[i] = y; nx[i] = -Math.sin(th); ny[i] = Math.cos(th);
            hw[i] = W * (q < 0.24 ? Math.sqrt(Math.sin((q / 0.24) * Math.PI / 2)) : Math.pow(1 - (q - 0.24) / 0.76, 1.55));
            x -= Math.cos(th) * ds; y -= Math.sin(th) * ds;
        }
        fx.beginPath();
        fx.moveTo(sx[0], sy[0]);
        for (let i = 1; i < SPINE; i++) fx.lineTo(sx[i] + nx[i] * hw[i], sy[i] + ny[i] * hw[i]);
        for (let i = SPINE - 1; i > 0; i--) fx.lineTo(sx[i] - nx[i] * hw[i], sy[i] - ny[i] * hw[i]);
        fx.closePath();
        // pectoral fins from the shoulders, swept back, opening and closing a little with the stroke
        const a = 3, b = 5, open = 1 + 0.2 * Math.sin(t * type.wag * 0.5 + f.ph), fl = L * type.fin;
        for (const side of [1, -1]) {
            fx.moveTo(sx[a] + side * nx[a] * hw[a], sy[a] + side * ny[a] * hw[a]);
            fx.lineTo(sx[b] + side * nx[b] * (hw[b] + fl * 0.62 * open) - fl * 0.5, sy[b] + side * ny[b] * (hw[b] + fl * 0.62 * open));
            fx.lineTo(sx[b] + side * nx[b] * hw[b], sy[b] + side * ny[b] * hw[b]);
            fx.closePath();
        }
        fx.fill();
    }
    const school = { kind: 1, on: false, next: performance.now() + 2500 + Math.random() * 1500, fish: [], t0: 0, dur: 11000, route: null };
    let ptrX = -9999, ptrY = -9999;
    if (!reduce) window.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') { ptrX = e.clientX; ptrY = e.clientY; } }, { passive: true });
    function spawnSchool(now) {
        const w = innerWidth, h = innerHeight, k = clamp(w / 1440, 0.62, 1.2);
        fishC.width = Math.ceil(w * FS); fishC.height = Math.ceil(h * FS);
        school.kind = (school.kind + 1) % FISH.length;
        const type = FISH[school.kind];
        const n = Math.max(3, Math.round(pick(type.n) * (phone.matches ? 0.65 : 1)));
        const L = pick(type.len) * k, rx = type.spread * Math.sqrt(n) * L * pick(type.dens), ry = rx * 0.38, off = rx + L + 40;
        // in from the corners and edges, on any line that keeps clear of the words
        const routes = [
            [[-off, h * 0.87], [w * 0.5, h * 0.93], [w + off, h * 0.82]],
            [[w + off, h * 0.83], [w * 0.5, h * 0.93], [-off, h * 0.87]],
            [[-off, h * 0.82], [w * 0.3, h * 0.9], [w * 0.62, h + off]],
            [[w + off, h * 0.8], [w * 0.72, h * 0.9], [w * 0.4, h + off]],
            [[-off, h * 0.3], [w * 0.45, h * 0.2], [w + off, h * 0.27]],
            [[w + off, h * 0.27], [w * 0.45, h * 0.2], [-off, h * 0.3]],
            [[-off, h * 0.3], [w * 0.3, h * 0.18], [w * 0.62, -off]],
            [[w + off, h * 0.35], [w * 0.7, h * 0.18], [w * 0.38, -off]]
        ];
        const onPlate = intro.style.visibility === 'hidden';
        const rects = (onPlate ? ['.bplate__card', '.bfacts'] : ['.pills__label', '.hero__h1', '.hero__cta']).map((c) => stage.querySelector(c)?.getBoundingClientRect()).filter(Boolean);
        const clear = (r) => {
            for (let i = 0; i <= 16; i++) {
                const q = i / 16, m = 1 - q, x = m * m * r[0][0] + 2 * m * q * r[1][0] + q * q * r[2][0], y = m * m * r[0][1] + 2 * m * q * r[1][1] + q * q * r[2][1];
                if (rects.some((b) => x > b.left - rx && x < b.right + rx && y > b.top - ry && y < b.bottom + ry)) return false;
            }
            return true;
        };
        const open = routes.map((r, i) => i).filter((i) => i !== school.last && clear(routes[i]));
        school.last = open.length ? open[Math.floor(Math.random() * open.length)] : (school.last === 0 ? 1 : 0);
        school.route = routes[school.last];
        const [a, b, c] = school.route, way = Math.hypot(b[0] - a[0], b[1] - a[1]) + Math.hypot(c[0] - b[0], c[1] - b[1]);
        school.dur = (way / (type.speed * k * pick([0.85, 1.2]))) * 1000;
        school.soft = type.soft;
        school.t0 = now; school.on = true;
        const [sx, sy] = a;
        school.fish = Array.from({ length: n }, (_, i) => {
            // an even packing, a little loosened, so they read as one close body and not as a scatter
            const ang = i * 2.39996 + Math.random() * 0.5, r = Math.sqrt((i + 0.5) / n);
            const ox = Math.cos(ang) * r * rx, oy = Math.sin(ang) * r * ry;
            return { x: sx + ox, y: sy + oy, vx: 0, vy: 0, ox, oy, ph: Math.random() * 6.28, len: L * (0.85 + Math.random() * 0.3), a: 0.86 + Math.random() * 0.14, ang: null, bend: 0 };
        });
    }
    function stepSchool(now, dt, seaFrac) {
        if (reduce) return null;
        if (!school.on) {
            if (now > school.next && seaFrac > 0.5) spawnSchool(now);
            if (!school.on) return null;
        }
        if (seaFrac <= 0) { school.on = false; school.next = now; return null; }   // the panel has covered the water
        const raw = (now - school.t0) / school.dur, s = clamp(raw, 0, 1), m = 1 - s, [a, b, c] = school.route;
        const lx = m * m * a[0] + 2 * m * s * b[0] + s * s * c[0], ly = m * m * a[1] + 2 * m * s * b[1] + s * s * c[1];
        const dx = 2 * m * (b[0] - a[0]) + 2 * s * (c[0] - b[0]), dy = 2 * m * (b[1] - a[1]) + 2 * s * (c[1] - b[1]);
        const lvx = dx / (school.dur / 1000), lvy = dy / (school.dur / 1000);
        const hd = Math.atan2(dy, dx), cs = Math.cos(hd), sn = Math.sin(hd), t = now / 1000;
        const fade = seg(seaFrac, 0.1, 0.5);
        fx.setTransform(FS, 0, 0, FS, 0, 0);
        fx.clearRect(0, 0, innerWidth, innerHeight);
        let visible = false;
        const type = FISH[school.kind];
        school.fish.forEach((f) => {
            const sw = 1 + 0.08 * Math.sin(t * 0.8 + f.ph);          // the school breathes
            const tx = lx + (f.ox * cs - f.oy * sn) * sw, ty = ly + (f.ox * sn + f.oy * cs) * sw;
            let ax = (tx - f.x) * 6 + (lvx - f.vx) * 3.4, ay = (ty - f.y) * 6 + (lvy - f.vy) * 3.4;
            const px = f.x - ptrX, py = f.y - ptrY, d = Math.hypot(px, py);
            if (d < 210 && d > 0.1) { const push = (1 - d / 210) * 2600; ax += (px / d) * push; ay += (py / d) * push; }
            f.vx += ax * dt; f.vy += ay * dt;
            f.x += f.vx * dt; f.y += f.vy * dt;
            if (f.x > -60 && f.x < innerWidth + 60 && f.y > -60 && f.y < innerHeight + 60) visible = true;
            const want = Math.atan2(f.vy, f.vx);
            if (f.ang === null) f.ang = hd;
            const turn = Math.atan2(Math.sin(want - f.ang), Math.cos(want - f.ang));
            f.ang += turn * Math.min(1, dt * 7);
            f.bend += (clamp(turn * 1.4, -0.7, 0.7) - f.bend) * Math.min(1, dt * 5);   // it curves into a turn
            fx.save();
            fx.translate(f.x, f.y); fx.rotate(f.ang);
            fx.fillStyle = `rgba(0,0,0,${(f.a * fade).toFixed(3)})`;
            drawFish(f, type, t);
            fx.restore();
        });
        if (raw > 1 && !visible) {
            school.on = false;
            school.next = now + (3000 + Math.random() * 2000) * (phone.matches ? 1.4 : 1);   // often: nobody stays on this screen for long
            return null;
        }
        return fishC;
    }
    function frame(now) {
        if (!reduce) placeStage(now);
        const y = window.scrollY; const dy = y - lastScroll; lastScroll = y;
        vel += (Math.abs(dy) - vel) * 0.08;
        const hr = hull.getBoundingClientRect();
        const sr0 = stage.getBoundingClientRect();
        const inView = hr.bottom > 0 && hr.top < innerHeight;
        const dt = Math.min(0.05, (now - (frame.t || now)) / 1000); frame.t = now;
        cruise += ((!reduce && sr0.bottom > 0 && brandsEl.getBoundingClientRect().top > 0 ? 1 : 0) - cruise) * 0.04;
        void inView;
        const by = hr.top; const bv = Math.abs(by - (frame.by ?? by)); frame.by = by;
        const sr = stage.getBoundingClientRect();
        // the trail stays in the water after the boat has sailed off the top, for as long as the sea is on screen
        // the trail fades with the scroll, continuously, as the brands panel rises over the water — never cut
        const bt = brandsEl.getBoundingClientRect().top;
        const seaFrac = clamp(bt / innerHeight, 0, 1);
        trailOn = seaFrac * seaFrac * (3 - 2 * seaFrac);
        const target = sr.bottom > 0 ? clamp(0.55 + bv / 6 + vel / 30, 0, 1.25) : 0;   // under way all through the stage, harder when it speeds
        wakeV += (target - wakeV) * (target > wakeV ? 0.12 : 0.03);
        const armT = clamp(bv / 2 + vel / 10, 0, 1);   // the side waves rise while the boat moves and settle when it stops
        armV += (armT - armV) * (armT > armV ? 0.2 : 0.04);
        const br = brandsEl.getBoundingClientRect(); const shore = br.top < innerHeight + 160 ? br.top + 30 : 99999;   // the surf line runs along the panel's wavy edge
        const glass = [];
        document.querySelectorAll('[data-glass]').forEach((el) => {
            if (glass.length >= 12) return;
            const q = el.getBoundingClientRect();
            if (q.bottom < 0 || q.top > innerHeight || q.width === 0) return;
            let o = 1; for (let x = el; x && x !== document.body; x = x.parentElement) o *= parseFloat(getComputedStyle(x).opacity);
            if (o < 0.02) return;
            glass.push([q.left, q.top, q.right, q.bottom, parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, o]);
        });
        const fishCanvas = sea ? stepSchool(now, dt, seaFrac) : null;
        if (sea) sea.draw({ now, glass, fish: fishCanvas, fishSoft: school.soft, dy: 0,   // the ocean is locked: only its own waves, the wake and the rings move
            boat: [hr.left + hr.width / 2, hr.top + hr.height / 2, 0, hr.height], shore,
            wake: reduce ? 0 : clamp(Math.max(0.55, 0.38 * cruise + vel / 12), 0, 1) * trailOn, arm: reduce ? 0 : armV, ripples });
        if (!reduce) requestAnimationFrame(frame);
    }
    if (reduce) steps.forEach((s) => { s.style.opacity = 1; });

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
uniform vec4 uBoat; uniform float uWake; uniform float uShore; uniform float uArm; uniform sampler2D uFish; uniform float uFishOn;
uniform vec4 uPool[8];
uniform vec4 uGlass[12]; uniform float uGlassR[12]; uniform float uGlassO[12];
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
float sdRR(vec2 p, vec2 c0, vec2 hs, float rad){
  vec2 dd = abs(p - c0) - hs + rad;
  return length(max(dd, 0.)) + min(max(dd.x, dd.y), 0.) - rad;
}
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
  // glass (round 2): each card is a thick lens laid on the sea. Its bevel bends the water hard toward the
  // centre, its body magnifies a little, it is smoked so white type reads, it is lit along the top edge and
  // throws a soft shadow on the water below. No outline: the edge is the light on the bevel.
  vec2 gp = p; float inG = 0., spec = 0., shade = 0., shadow = 0.;
  for (int i = 0; i < 12; i++){
    vec4 r = uGlass[i]; float o = uGlassO[i]; if (r.z <= r.x || o <= 0.) continue;
    vec2 c0 = (r.xy + r.zw) * .5, hs = (r.zw - r.xy) * .5;
    float rad = min(uGlassR[i], min(hs.x, hs.y));
    float sd = sdRR(p, c0, hs, rad);
    float bez = min(hs.y * .9, 28.), pull = min(hs.y * .55, 22.);
    shadow = max(shadow, o * .18 * exp(-max(sdRR(p - vec2(0., 6.), c0, hs, rad), 0.) / 12.) * step(0., sd));
    if (sd < 0.){
      vec2 g = vec2(sdRR(p + vec2(1., 0.), c0, hs, rad) - sd, sdRR(p + vec2(0., 1.), c0, hs, rad) - sd);
      vec2 n = normalize(g + 1e-5);
      float e = smoothstep(-bez, 0., sd);            // 0 in the body, 1 at the rim
      vec2 bent = c0 + (p - c0) * .92 - n * pow(e, 2.4) * pull;
      gp = mix(p, bent, o);
      inG = o;
      float lit = clamp(-n.y * .85 - n.x * .4 + .15, 0., 1.);   // light from the top left
      spec = o * (pow(e, 22.) * (.18 + .62 * lit) + pow(e, 6.) * .07 * lit + .07 * smoothstep(0., 1., (c0.y - p.y) / hs.y));
      shade = o * pow(e, 8.) * clamp(n.y * .8 + n.x * .3, 0., 1.) * .18;
    }
  }
  vec2 q = gp + disp;
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
  if (uFishOn > 0.){
    vec2 fq = q + vec2(sin(q.y * .04 + uTime * 1.3), cos(q.x * .035 + uTime * 1.1)) * 2.5;   // seen through moving water
    vec2 fr = vec2(uFishOn * uRes.y / 900.) / uRes, fp = fq / uRes;
    float fm = texture2D(uFish, fp).a * .2
      + (texture2D(uFish, fp + vec2(fr.x, 0.)).a + texture2D(uFish, fp - vec2(fr.x, 0.)).a + texture2D(uFish, fp + vec2(0., fr.y)).a + texture2D(uFish, fp - vec2(0., fr.y)).a) * .12
      + (texture2D(uFish, fp + fr * .7).a + texture2D(uFish, fp - fr * .7).a + texture2D(uFish, fp + fr * vec2(.7, -.7)).a + texture2D(uFish, fp + fr * vec2(-.7, .7)).a) * .08;
    col = mix(col, vec3(.012, .17, .215), fm * .66);
  }
  col += hi * 1.7 * (1. - pool * .7) * vec3(.85, 1., 1.) * uReady;
  col += sh * .08;
  col *= 1. - shadow;
  col = mix(col, col * 1.06 + vec3(.03, .045, .05), inG);   // clear glass: a touch brighter than the sea
  col *= 1. - shade;
  col += spec * vec3(.95, 1., 1.);
  if (uWake > .01){
    vec2 f = vec2(0., -1.);
    vec2 S = uBoat.xy - f * uBoat.w * .47;
    vec2 qq = p - S; float a = dot(qq, -f); float b = qq.x;
    if (a > 0.){
      float len = uBoat.w;
      float spread = a * .34 + len * .1;
      float edge = exp(-pow((abs(b) - spread) / (5. + a * .05), 2.)) * exp(-a / (len * 1.5));
      float trail = exp(-pow(b / (len * .08 + a * .09), 2.)) * exp(-a / (len * 1.4));
      float churn = .55 + .45 * fbm(vec2(a * .05 - uTime * 2.2, b * .08));
      col = mix(col, vec3(.94, 1., 1.), clamp(trail * 1.25 * churn * uWake, 0., .92)   /* no diagonal arms (Alex, 27 Oct) */   /* the diagonal arms only while the page moves */);
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
        const U = {}; ['uTex', 'uRes', 'uDpr', 'uCenter', 'uTile', 'uTime', 'uRip', 'uBoat', 'uWake', 'uShore', 'uArm', 'uFish', 'uFishOn', 'uPool', 'uGlass', 'uGlassR', 'uGlassO', 'uReady'].forEach((k) => { U[k] = gl.getUniformLocation(prog, k); });
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
        let fishTex = null;
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
            gl.uniform1f(U.uShore, 99999);
            gl.uniform1f(U.uArm, s.arm ?? 0);
            gl.uniform1i(U.uFish, 1);
            gl.uniform1f(U.uFishOn, s.fish ? s.fishSoft : 0);
            if (s.fish) {
                gl.activeTexture(gl.TEXTURE1);
                if (!fishTex) {
                    fishTex = gl.createTexture();
                    gl.bindTexture(gl.TEXTURE_2D, fishTex);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                } else gl.bindTexture(gl.TEXTURE_2D, fishTex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, s.fish);
                gl.activeTexture(gl.TEXTURE0);
            }
            gl.uniform4fv(U.uPool, pools());
            const gr = new Float32Array(48), gR = new Float32Array(12), gO = new Float32Array(12);
            (s.glass || []).slice(0, 12).forEach((g, i) => { gr.set(g.slice(0, 4), i * 4); gR[i] = g[4]; gO[i] = g[5]; });
            gl.uniform4fv(U.uGlass, gr); gl.uniform1fv(U.uGlassR, gR); gl.uniform1fv(U.uGlassO, gO);
            gl.uniform1f(U.uReady, ready ? 1 : 0);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
        return { draw, resize };
    }

    sea = initSea();
    window.addEventListener('resize', () => { if (sea) sea.resize(); if (reduce) frame(performance.now()); });
    if (reduce) { placeStage(0); frame(performance.now()); window.addEventListener('scroll', () => requestAnimationFrame(frame), { passive: true }); }
    else requestAnimationFrame(frame);
    if (!reduce && sea) {
        let lx = -999, ly = -999, lt = 0;
        window.addEventListener('pointermove', (e) => {
            if (e.pointerType === 'touch') return;
            const now = performance.now(); const dist = Math.hypot(e.clientX - lx, e.clientY - ly);
            if (dist < 28 || now - lt < 70) return;
            ripples.push([e.clientX, e.clientY, now / 1000, clamp(dist / 90, 0.35, 1)]); if (ripples.length > 8) ripples.shift();
            lx = e.clientX; ly = e.clientY; lt = now;
        }, { passive: true });
        window.addEventListener('pointerdown', (e) => { ripples.push([e.clientX, e.clientY, performance.now() / 1000, 1.2]); if (ripples.length > 8) ripples.shift(); }, { passive: true });
    }

    /* ── brands: the row in the middle of the screen owns the picture; on the phone, a swipe rail ── */
    const rows = [...document.querySelectorAll('[data-brand]')];
    const frames = [...document.querySelectorAll('[data-frame-item]')];
    if (rows.length && 'IntersectionObserver' in window && !phone.matches) {
        const io = new IntersectionObserver((es) => es.forEach((e) => {
            if (!e.isIntersecting) return;
            const k = +e.target.dataset.brand;
            rows.forEach((r, i) => r.classList.toggle('is-on', i === k));
            frames.forEach((f, i) => f.classList.toggle('is-on', i === k));
        }), { rootMargin: '-45% 0px -45% 0px' });
        rows.forEach((r) => io.observe(r));
    }
    const rail = $('[data-brands]');
    if (rail && phone.matches) rail.setAttribute('data-lenis-prevent', '');

    /* ── the inventory cards rise as their row arrives ── */
    const risers = [...document.querySelectorAll('.boat.rise')];
    if (reduce || !('IntersectionObserver' in window)) risers.forEach((el) => el.classList.add('is-in'));
    else {
        const io = new IntersectionObserver((es) => es.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.style.transitionDelay = `${([...e.target.parentElement.children].indexOf(e.target) % 4) * 0.09}s`;
            e.target.classList.add('is-in'); io.unobserve(e.target);
        }), { rootMargin: '0px 0px -12% 0px' });
        risers.forEach((el) => io.observe(el));
    }

    /* ── inventory side elevations, and the surf, load on approach ── */
    const inv = document.getElementById('inventory');
    const surf = $('[data-surf]');
    if ('IntersectionObserver' in window) {
        new IntersectionObserver((es, o) => es.forEach((e) => {
            if (!e.isIntersecting) return;
            inv.querySelectorAll('img[data-src]').forEach((im) => { im.src = im.dataset.src; im.removeAttribute('data-src'); });
            o.disconnect();
        }), { rootMargin: '100% 0px' }).observe(inv);
        if (surf && !reduce) new IntersectionObserver((es) => es.forEach((e) => {
            if (e.isIntersecting) {
                const src = surf.querySelectorAll('source[data-src]');
                if (src.length) { src.forEach((s) => { s.src = s.dataset.src; s.removeAttribute('data-src'); }); surf.load(); }
                surf.play().catch(() => {});
            } else surf.pause();
        }), { rootMargin: '400px 0px' }).observe(surf);
    }

    /* ── the Brands list in the section row also opens on click and closes on Escape ── */
    const dropT = $('.hdr__droptgl');
    if (dropT) {
        dropT.addEventListener('click', () => dropT.setAttribute('aria-expanded', String(dropT.getAttribute('aria-expanded') !== 'true')));
        document.addEventListener('click', (e) => { if (!e.target.closest('.hdr__drop')) dropT.setAttribute('aria-expanded', 'false'); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && dropT.getAttribute('aria-expanded') === 'true') { dropT.setAttribute('aria-expanded', 'false'); dropT.focus(); } });
    }

    /* ════════════════════════════════════════════════════════
       Text in motion (Alex, 27 Oct). On load the header and the hero arrive: the header's cells and the
       section row drop in, then the pills, the headline (word by word, sliding up out of a mask) and the
       actions. On scroll, everywhere below the stage, headings slide in word by word and paragraphs
       appear word by word as they rise into view — and leave the same way, in order, as they go off the
       top. Scrubbed by the scroll, so it runs backwards too. Words are wrapped once; the text stays in the
       DOM as text, and reduced motion leaves it all still.
       ════════════════════════════════════════════════════════ */
    const wrapWords = (el, cls) => {
        if (el.dataset.split) return [...el.querySelectorAll('.' + cls)];
        const out = [];
        const walk = (node) => {
            [...node.childNodes].forEach((n) => {
                if (n.nodeType === 3) {
                    const parts = n.textContent.split(/(\s+)/);
                    const frag = document.createDocumentFragment();
                    parts.forEach((t) => {
                        if (!t) return;
                        if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(t)); return; }
                        const outer = document.createElement('span'); outer.className = cls;
                        const inner = document.createElement('span'); inner.className = cls + '__in'; inner.textContent = t;
                        outer.appendChild(inner); frag.appendChild(outer); out.push(outer);
                    });
                    n.replaceWith(frag);
                } else if (n.nodeType === 1 && !/^(SVG|BR|INPUT|SELECT|TEXTAREA)$/i.test(n.tagName)) walk(n);
            });
        };
        walk(el); el.dataset.split = '1';
        return out;
    };

    /* ── intro: header and hero ── */
    if (!reduce) {
        const intro = [];
        hdr.querySelectorAll('.hdr__cell, .hdr__logo, .hdr__nav > a, .hdr__nav > .hdr__drop').forEach((el, i) => intro.push([el, 120 + i * 45, 'drop']));
        const heroIntro = $('[data-intro]');
        heroIntro.querySelectorAll('.pills__label, .pill').forEach((el, i) => intro.push([el, 380 + i * 70, 'up']));
        const h1 = heroIntro.querySelector('.hero__h1');
        const h1Text = h1.textContent;
        const h1Words = wrapWords(h1, 'tw');
        heroIntro.querySelectorAll('.hero__cta > *').forEach((el, i) => intro.push([el, 900 + h1Words.length * 120 + i * 90, 'up']));
        intro.forEach(([el, delay, kind]) => el.animate(
            kind === 'drop' ? [{ opacity: 0, transform: 'translateY(-14px)' }, { opacity: 1, transform: 'none' }] : [{ opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'none' }],
            { duration: 900, delay, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'backwards' }));
        let left = h1Words.length;
        h1Words.forEach((w, i) => {
            const a = w.firstChild.animate([{ opacity: 0, transform: 'translateX(1.1em)' }, { opacity: 1, transform: 'none' }], { duration: 1000, delay: 620 + i * 120, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'backwards' });
            a.onfinish = () => { if (--left === 0 && h1.dataset.split) { h1.textContent = h1Text; delete h1.dataset.split; } };   // back to plain text: kerning, and the boat swap
        });
    }

    /* ── scroll: headings slide in, paragraphs appear, both leave in order ── */
    const SCOPE = 'main > section:not(.bstage)';
    const heads = [...document.querySelectorAll(`${SCOPE} .h2, ${SCOPE} .brow__name, ${SCOPE} .sold__h, ${SCOPE} .boat__name, .foot__k`)];
    const paras = [...document.querySelectorAll(`${SCOPE} .lede, ${SCOPE} .brow__fact, ${SCOPE} .land__copy > p, ${SCOPE} .sold__run, ${SCOPE} .contact__info > p, ${SCOPE} .hours, ${SCOPE} .boat__paint, .foot__col p`)];
    if (!reduce) {
        const items = [
            ...heads.map((el) => ({ el, kind: 'head', words: wrapWords(el, 'tw') })),
            ...paras.map((el) => ({ el, kind: 'para', words: wrapWords(el, 'pw') }))
        ];
        const live = new Set();
        const io = new IntersectionObserver((es) => es.forEach((e) => { const it = items.find((x) => x.el === e.target); if (e.isIntersecting) live.add(it); else { live.delete(it); paint(it); } }), { rootMargin: '25% 0px 25% 0px' });
        items.forEach((it) => io.observe(it.el));
        const paint = (it) => {
            const r = it.el.getBoundingClientRect(), vh = innerHeight, n = it.words.length;
            // in: from the moment the block's top passes 95% of the screen until it reaches 62%;
            // out: from the moment its bottom passes 22% of the screen until it reaches the top
            const fin = clamp((vh * 0.95 - r.top) / (vh * 0.33), 0, 1);
            const fout = clamp((vh * 0.22 - r.bottom) / (vh * 0.22), 0, 1);
            const k = it.kind === 'head' ? 1.1 : 5;   // headings step in a word at a time; paragraphs flow
            it.words.forEach((w, i) => {
                const a = clamp((fin * (n + k) - i) / k, 0, 1), b = clamp((fout * (n + k) - i) / k, 0, 1);
                const ea = a * a * (3 - 2 * a), eb = b * b * (3 - 2 * b);
                if (it.kind === 'head') { w.firstChild.style.opacity = (ea * (1 - eb)).toFixed(3); w.firstChild.style.transform = `translate3d(${((1 - ea) * 1.2 - eb * 1.2).toFixed(3)}em, 0, 0)`; }
                else { w.style.opacity = (0.06 + 0.94 * ea * (1 - eb)).toFixed(3); w.style.transform = `translate3d(0, ${((1 - ea) * 1.1 - eb * 0.6).toFixed(2)}em, 0)`; }
            });
        };
        const tick = () => { live.forEach(paint); requestAnimationFrame(tick); };
        items.forEach(paint);
        requestAnimationFrame(tick);
    }

    /* ── the About us film loads and plays only while it is near the screen; reduced motion keeps the poster ── */
    const landFilm = $('[data-land-film]');
    if (landFilm && !reduce && 'IntersectionObserver' in window) {
        new IntersectionObserver((es) => es.forEach((e) => {
            if (e.isIntersecting) {
                const src = landFilm.querySelectorAll('source[data-src]');
                if (src.length) { src.forEach((s) => { s.src = s.dataset.src; s.removeAttribute('data-src'); }); landFilm.load(); }
                landFilm.play().catch(() => {});
            } else landFilm.pause();
        }), { rootMargin: '300px 0px' }).observe(landFilm);
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
        opener = b; box.setAttribute('aria-label', b.dataset.filmTitle || 'Film'); vid.src = b.dataset.film;
        if (lenis) lenis.stop(); box.showModal(); vid.play().catch(() => {});
    }));
    $('[data-film-close]').addEventListener('click', closeFilm);
    box.addEventListener('cancel', (e) => { e.preventDefault(); closeFilm(); });
    box.addEventListener('click', (e) => { if (e.target === box) closeFilm(); });

    /* ── form (mock-up) ── */
    const form = $('[data-form]');
    document.addEventListener('click', (e) => {
        const a = e.target.closest('[data-enquire]'); if (!a) return;
        const sel = form.elements.interest;
        const opt = [...sel.options].find((o) => o.text === a.dataset.enquire);
        if (opt) sel.value = opt.value;
    });
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
})();
