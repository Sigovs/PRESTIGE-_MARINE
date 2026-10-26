/* Prestige Marine — EXPLORE C · "The Showroom" behaviour (26 Oct 2026).
   Lenis is the scroll layer (DNA90): not constructed under reduced motion, anchors on, autoRaf.
   One scroll input drives the showroom: the window opens to the frame, the Tecnomar levels off and
   drifts, and the four cards rise one after another like steps. The floor (inventory) moves its
   elements at different rates. Every word, price and link is in the HTML without this file. */
(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const phoneQ = window.matchMedia('(max-width: 720px)');
    const root = document.documentElement;
    const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const lerp = (a, b, t) => a + (b - a) * t;
    const span = (p, a, b) => clamp((p - a) / (b - a));
    const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const easeSoft = (t) => 1 - Math.pow(1 - t, 4);

    if (!reduce) root.classList.add('fx');

    /* ── Lenis ── */
    let lenis = null;
    const boot = () => {
        if (reduce || !window.Lenis || lenis) return;
        lenis = new window.Lenis({ anchors: { offset: -64 }, autoRaf: true });
        window.__lenis = lenis;
        lenis.on('scroll', tick);
    };

    /* ── the showroom ── */
    const show = document.querySelector('[data-show]');
    const first = show.querySelector('.show__first');
    const splits = [...show.querySelectorAll('.show__first [data-split]')];
    const title = show.querySelector('[data-title]');
    const cards = [...show.querySelectorAll('[data-card]')];
    let G = null;   // geometry for the current viewport

    function measure() {
        const vw = window.innerWidth, vh = window.innerHeight;
        const phone = phoneQ.matches;
        const hdr = phone ? 64 : 72;
        const gutter = phone ? 16 : clamp(vw * 0.0445, 16, 64);
        // mirrors the static values in c.css (.show__first)
        const wt = phone ? Math.max(0.42 * vh, 304) : Math.max(0.40 * vh, hdr + 250), wb = phone ? 16 : 24;
        const wl = phone ? gutter : gutter + (vw - 2 * gutter + 24) / 4;
        const bw = phone ? Math.min(vw * 0.36, (0.58 * vh - 16) * 0.29) : Math.min(vw * 0.7, 1000, (0.6 * vh - 24) * 2.2);
        const wc = (wt + vh - wb) / 2;
        const chan = phone ? 0.34 : 0.44;              // where each loop keeps its deep channel
        G = {
            vw, vh, phone, hdr, gutter,
            w0: { t: wt, s: gutter, l: wl, b: wb }, w1: { t: hdr, s: 0, l: 0, b: 0 },
            dx0: phone ? 0 : wl + 0.37 * bw - vw / 2,
            my0: wc - chan * vh, my1: 0,
            by0: wc,
            br0: phone ? -4 : -3, br1: 0, br2: phone ? 1.5 : 1.2,
            bs0: 1,
            dx2: phone ? 0 : vw * 0.03,
            dx1: phone ? vw * 0.17 : 0,
            run: show.offsetHeight - vh
        };
        // the deck needs to know each card's height to lift the earlier ones a step
        cards.forEach((c) => { c._h = c.offsetHeight; });
        // the yacht's final size and place: it fits the band between the name and the highest card,
        // so nothing ever sits on the hull (it shrinks on short screens rather than being covered)
        const n = cards.length;
        if (!phone) {
            const top = title.offsetTop + title.offsetHeight + 20;
            const step = parseFloat(getComputedStyle(root).getPropertyValue('--step')) || 0;
            const cardsTop = Math.min(...cards.map((c, i) => vh - 24 - i * step - c._h)) - 20;
            const beam = bw * 750 / 2499;
            G.bs1 = Math.min(1.06, (cardsTop - top) / beam);
            G.by1 = (top + cardsTop) / 2;
        } else {
            const top = hdr + 16;
            const deckTop = vh - 16 - cards[n - 1]._h - (n - 1) * 40 - 14;
            const len = bw * 2499 / 750;
            G.bs1 = Math.min(0.92, (deckTop - top) / len);
            G.by1 = (top + deckTop) / 2;
        }
    }

    function paintShow(p) {
        const g = G, s = first.style;
        const open = easeIO(span(p, 0.02, 0.30));                  // window → frame, yacht levels off
        const drift = easeIO(span(p, 0.30, 1));                    // then a slow drift to the end
        s.setProperty('--wt', lerp(g.w0.t, g.w1.t, open).toFixed(1) + 'px');
        s.setProperty('--ws', lerp(g.w0.s, g.w1.s, open).toFixed(1) + 'px');
        s.setProperty('--wb', lerp(g.w0.b, g.w1.b, open).toFixed(1) + 'px');
        s.setProperty('--wl', lerp(g.w0.l, g.w1.l, open).toFixed(1) + 'px');
        s.setProperty('--my', lerp(g.my0, g.my1, open).toFixed(1) + 'px');
        s.setProperty('--by', lerp(g.by0, g.by1, open).toFixed(1) + 'px');
        s.setProperty('--br', (open < 1 ? lerp(g.br0, g.br1, open) : lerp(g.br1, g.br2, drift)).toFixed(2) + 'deg');
        s.setProperty('--bs', lerp(g.bs0, g.bs1, open).toFixed(3));
        s.setProperty('--dx', (lerp(g.dx0, g.dx1, open) + lerp(0, g.dx2, drift)).toFixed(1) + 'px');

        // the first screen's words leave in pieces, each at its own rate
        splits.forEach((el, i) => {
            const t = easeIO(span(p, 0.0 + i * 0.025, 0.16 + i * 0.03));
            el.style.transform = `translate3d(0, ${(-t * (70 + i * 34)).toFixed(1)}px, 0)`;
            el.style.opacity = (1 - t).toFixed(3);
            el.style.visibility = t > 0.98 ? 'hidden' : '';
        });

        // the model name settles in at the top
        const tt = easeSoft(span(p, 0.29, 0.42));   // only once the yacht has settled below it
        title.style.opacity = tt.toFixed(3);
        title.style.transform = `translate3d(0, ${((1 - tt) * 48).toFixed(1)}px, 0)`;

        // the cards rise from below, one after another
        const n = cards.length;
        const arrive = (i) => easeSoft(span(p, 0.36 + i * 0.12, 0.56 + i * 0.12));
        if (!g.phone) {
            cards.forEach((c, i) => {
                const t = arrive(i), op = clamp(t * 1.6);
                c.style.transform = `translate3d(0, ${((1 - t) * g.vh * 0.62).toFixed(1)}px, 0)`;
                c.style.opacity = op.toFixed(3);
                c.style.visibility = op < 0.02 ? 'hidden' : '';
            });
        } else {
            // phone deck: the newest card stands in front; each earlier one is lifted so that only its
            // label shows above it, one step per card — a staircase of what has already been said
            const STEP = 40;
            const ts = cards.map((_, i) => arrive(i));
            cards.forEach((c, i) => {
                const t = ts[i], op = clamp(t * 1.6);
                let lift = 0, back = 0;
                for (let k = i + 1; k < n; k++) {
                    // as card k arrives, this card climbs to sit one step above k's top
                    const want = c._h - cards[k]._h - (k - i) * STEP;
                    const prev = k === i + 1 ? 0 : (c._h - cards[k - 1]._h - (k - 1 - i) * STEP);
                    lift += (want - prev) * ts[k];
                    back = Math.max(back, ts[k]);
                }
                const y = (1 - t) * g.vh * 0.5 + lift;
                c.style.zIndex = String(i + 1);
                c.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
                c.style.opacity = op.toFixed(3);
                c.style.visibility = op < 0.02 ? 'hidden' : '';
                c.querySelectorAll(':scope > :not(.card__k)').forEach((el) => { el.style.opacity = (1 - back).toFixed(3); });
            });
        }
    }

    /* ── the floor: elements at different rates ── */
    const lots = [...document.querySelectorAll('[data-lot]')];
    function paintFloor() {
        const vh = G.vh, phone = G.phone;
        lots.forEach((lot) => {
            const r = lot.getBoundingClientRect();
            if (r.bottom < -200 || r.top > vh + 200) return;
            const k = clamp((r.top + r.height / 2 - vh / 2) / vh, -1.2, 1.2);   // −1 above … +1 below
            const dir = lot.classList.contains('lot--flip') ? -1 : 1;
            lot.style.setProperty('--px', (phone ? 0 : k * 90 * dir).toFixed(1) + 'px');
            lot.style.setProperty('--py', (k * (phone ? 10 : 36)).toFixed(1) + 'px');
            lot.style.setProperty('--sy', (k * (phone ? 34 : 110)).toFixed(1) + 'px');
            lot.style.setProperty('--sx', (k * (phone ? 0 : 28) * dir).toFixed(1) + 'px');
        });
    }

    /* ── header: always visible; tone follows the section under it ── */
    const hdr = document.querySelector('[data-hdr]');
    const toned = [...document.querySelectorAll('[data-hdr-tone]')];
    function paintHdr() {
        if (root.classList.contains('menu-open')) return;
        const line = G.hdr / 2;
        let tone = 'ground';
        for (const s of toned) { const r = s.getBoundingClientRect(); if (r.top <= line && r.bottom > line) { tone = s.dataset.hdrTone; break; } }
        if (hdr.dataset.tone !== tone) hdr.dataset.tone = tone;
    }

    function tick() {
        if (!G) measure();
        if (!reduce) {
            const top = show.getBoundingClientRect().top;
            paintShow(clamp(-top / Math.max(1, G.run)));
            paintFloor();
        }
        paintHdr();
    }

    measure();
    window.addEventListener('scroll', () => { if (!lenis) tick(); }, { passive: true });
    window.addEventListener('resize', () => { measure(); tick(); });
    phoneQ.addEventListener('change', () => { measure(); tick(); });
    if (window.Lenis) boot(); else window.addEventListener('load', boot, { once: true });
    tick();

    // keyboard: focusing a card's link before it has risen brings the scroll to where it stands
    show.addEventListener('focusin', (e) => {
        if (reduce || !e.target.closest('[data-card]')) return;
        const y = show.offsetTop + G.run * 0.92;
        if (Math.abs(window.scrollY - y) > 4) { lenis ? lenis.scrollTo(y, { immediate: true }) : window.scrollTo(0, y); tick(); }
    });

    /* lots: spec cards rise in steps when the lot arrives */
    if ('IntersectionObserver' in window && !reduce) {
        const io = new IntersectionObserver((es) => es.forEach((e) => {
            if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
        }), { rootMargin: '0px 0px -22% 0px' });
        lots.forEach((l) => io.observe(l));
    } else lots.forEach((l) => l.classList.add('is-in'));

    /* loops: autoplay only with motion; the surf loads on approach */
    if (reduce) document.querySelectorAll('video[autoplay]').forEach((v) => { v.removeAttribute('autoplay'); v.pause(); });
    const surf = document.querySelector('[data-surf]');
    if (surf && !reduce && 'IntersectionObserver' in window) {
        new IntersectionObserver((es) => es.forEach((e) => {
            if (e.isIntersecting) {
                const src = surf.querySelectorAll('source[data-src]');
                if (src.length) { src.forEach((s) => { s.src = s.dataset.src; s.removeAttribute('data-src'); }); surf.load(); }
                surf.play().catch(() => {});
            } else surf.pause();
        }), { rootMargin: '400px 0px' }).observe(surf);
    }

    /* water ripple on the water panels (hover; tap on touch) */
    if (!reduce && window.PMRipple) {
        const hero = document.querySelector('.show__media[data-water]');
        const foot = document.querySelector('.foot__water[data-water]');
        if (hero) window.__rHero = new window.PMRipple(hero, { position: [0.5, 0.5] });
        if (foot) window.__rFoot = new window.PMRipple(foot, { position: [0.5, 1], cell: 10 });
    }

    /* menu: the page behind it is inert while it is open */
    const menu = document.querySelector('[data-menu]');
    const toggle = document.querySelector('[data-menu-toggle]');
    const label = document.querySelector('[data-menu-label]');
    const behind = [document.querySelector('[data-main]'), document.querySelector('.foot')];
    const setMenu = (open) => {
        menu.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
        label.textContent = open ? 'Close' : 'Menu';
        root.classList.toggle('menu-open', open);
        behind.forEach((el) => { el.inert = open; });
        if (lenis) open ? lenis.stop() : lenis.start();
        if (open) menu.querySelector('a').focus(); else paintHdr();
    };
    toggle.addEventListener('click', () => setMenu(menu.hidden));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); } });
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
})();
