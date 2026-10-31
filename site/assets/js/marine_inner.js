/* Prestige Marine — inner pages (30 Oct 2026). Everything is bound to a role and runs only where the page has it, so one
   file serves every template: the shell (header, menu, films, form, surf, text in motion), a film hero, chapters, a page bar.
   Every word is in the HTML without this file. */
(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const phone = window.matchMedia('(max-width: 720px)');
    const root = document.documentElement;
    const $ = (s) => document.querySelector(s);
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const seg = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
    const smooth = (t) => t * t * (3 - 2 * t);

    let lenis = null;
    const boot = () => { if (reduce || !window.Lenis || lenis) return; lenis = new window.Lenis({ anchors: { offset: -64 }, autoRaf: true }); };
    if (window.Lenis) boot(); else window.addEventListener('load', boot, { once: true });

    /* header: always on screen; bare on the water, then it takes the ground of whatever is under it */
    const hdr = $('[data-hdr]');
    const grounds = [...document.querySelectorAll('.panel, .foot')];
    const toneHdr = () => {
        const y = hdr.querySelector('.hdr__bar').offsetHeight;
        hdr.classList.toggle('is-compact', window.scrollY > 40);
        if (window.scrollY <= 40) { hdr.dataset.tone = hdr.dataset.top || 'water'; return; }
        const under = grounds.find((el) => { const r = el.getBoundingClientRect(); return r.top < y && r.bottom > y * 0.5; });
        hdr.dataset.tone = under ? 'light' : 'deep';
    };
    window.addEventListener('scroll', toneHdr, { passive: true }); toneHdr();

    /* ── films on the page: each plays its stretch of footage, only while near the screen; reduced motion keeps the poster ── */
    const films = [...document.querySelectorAll('[data-film-loop]')];
    const startFilm = (v) => {
        const src = v.querySelectorAll('source[data-src]');
        if (src.length) { src.forEach((s) => { s.src = s.dataset.src; s.removeAttribute('data-src'); }); v.load(); }
        v.play().catch(() => {});
    };
    films.forEach((v) => {
        const from = +v.dataset.from, to = +v.dataset.to;
        v.addEventListener('loadedmetadata', () => { if (v.duration > to) v.currentTime = from; });
        v.addEventListener('timeupdate', () => { if (v.duration > to && v.currentTime >= to) v.currentTime = from; });
        v.addEventListener('ended', () => { v.currentTime = 0; v.play().catch(() => {}); });
    });
    if (!reduce && 'IntersectionObserver' in window) films.forEach((v) => new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting) startFilm(v); else v.pause();
    }), { rootMargin: '40% 0px' }).observe(v));

    /* ── the hero's words leave upward as the panel rises; the film drifts; each chapter settles back as the next rides over it ── */
    const vhero = $('[data-vhero]'), chaps = [...document.querySelectorAll('[data-chap]')];
    if (!reduce && (vhero || chaps.length)) {
        const copy = $('[data-vhero-copy]'), film = vhero && vhero.querySelector('video, img');
        const parts = chaps.map((c) => ({ el: c, frame: c.querySelector('.chap__frame'), vid: c.querySelector('[data-chap-media]'), line: c.querySelector('.chap__line') }));
        const draw = () => {
            const vh = innerHeight;
            if (vhero) {
                const r = vhero.getBoundingClientRect(), p = clamp(-r.top / Math.max(1, vh), 0, 1);
                if (r.bottom > 0) {
                    copy.style.transform = `translate3d(0, ${(-p * 22).toFixed(2)}vh, 0)`;
                    copy.style.opacity = (1 - seg(p, 0.25, 0.7)).toFixed(3);
                    film.style.transform = `scale(${(1.02 + p * 0.1).toFixed(4)})`;
                }
            }
            parts.forEach((c, i) => {
                const next = parts[i + 1], k = next ? clamp(1 - next.el.getBoundingClientRect().top / vh, 0, 1) : 0;
                c.frame.style.transform = `scale(${(1 - smooth(k) * 0.06).toFixed(4)}) translate3d(0, ${(-smooth(k) * 6).toFixed(2)}vh, 0)`;
                // the words drive up as the chapter lands, stay a moment, then drive away upward before the next one arrives
                const top = c.el.getBoundingClientRect().top, own = clamp(top / vh, 0, 1), t = -top / vh;
                c.vid.style.transform = `scale(${(1.04 + own * 0.1).toFixed(4)})`;
                const y = t < 0 ? smooth(clamp(-t, 0, 1)) * 34 : -smooth(seg(t, 0.14, 0.62)) * 72;
                c.line.style.transform = `translate3d(0, ${y.toFixed(2)}vh, 0)`;
                c.line.style.opacity = (t < 0 ? 1 - seg(-t, 0.1, 0.55) : 1 - seg(t, 0.3, 0.6)).toFixed(3);
            });
            requestAnimationFrame(draw);
        };
        requestAnimationFrame(draw);
    }

    /* ── about: the three words on navy, the film opening behind them from a slit to the whole screen, scrubbed; without the script or with reduced motion the film simply stands behind the words ── */
    const abi = $('[data-abintro]');
    if (abi && !reduce) {
        const media = $('[data-abmedia]'), vid = media.querySelector('video'), words = [...$('[data-abwords]').children], hint = $('[data-abhint]');
        const draw = () => {
            const r = abi.getBoundingClientRect(), vh = innerHeight;
            if (r.bottom > 0) {
                const p = clamp(-r.top / Math.max(1, r.height - 2 * vh), 0, 1), o = smooth(seg(p, 0, 0.75));
                const iy = (1 - o) * 46, ix = (1 - o) * 30;
                media.style.clipPath = `inset(${iy.toFixed(2)}% ${ix.toFixed(2)}% round ${((1 - o) * 10).toFixed(1)}px)`;
                vid.style.transform = `scale(${(1.3 - o * 0.3).toFixed(4)})`;
                // the lines start closed up around the slit and stand apart as it opens
                words.forEach((w, i) => { w.style.transform = `translate3d(0, ${((i - 1) * o * 10).toFixed(2)}vh, 0)`; });
                hint.style.opacity = (1 - seg(p, 0, 0.2)).toFixed(3);
            }
            requestAnimationFrame(draw);
        };
        requestAnimationFrame(draw);
    }

    /* ── the range: with several models the page holds while they pass sideways; each picture drifts in its frame ── */
    const reel = $('[data-reel]');
    if (reel && !reel.classList.contains('range--one')) {
        const pin = $('[data-reel-pin]'), head = $('[data-reel-head]'), track = $('[data-reel-track]'), line = $('[data-reel-line]');
        let dist = 0, on = false, lastP = -1;
        const fit = () => {
            on = !reduce && !phone.matches;
            reel.classList.toggle('is-pin', on);
            if (on) {
                track.removeAttribute('data-lenis-prevent');
                pin.style.setProperty('--head-w', `${head.offsetWidth + head.offsetLeft + 56}px`);
                const end = track.lastElementChild;
                dist = Math.max(0, track.offsetLeft + end.offsetLeft + end.offsetWidth + head.offsetLeft - innerWidth);
                reel.style.height = `${innerHeight + dist * 1.1}px`;
                lastP = -1;
            } else {
                reel.style.height = '';
                [head, track].forEach((el) => { el.style.transform = ''; });
                track.setAttribute('data-lenis-prevent', '');
            }
        };
        const tick = () => {
            if (on) {
                const r = reel.getBoundingClientRect();
                if (r.top < innerHeight && r.bottom > 0) {
                    const p = clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1);
                    if (p !== lastP) {
                        lastP = p;
                        const x = -p * dist;
                        track.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
                        head.style.transform = `translate3d(${x.toFixed(1)}px, -50%, 0)`;
                        line.style.transform = `scaleX(${p.toFixed(4)})`;
                    }
                }
            }
            requestAnimationFrame(tick);
        };
        fit();
        if (document.fonts) document.fonts.ready.then(fit);
        window.addEventListener('load', fit, { once: true });
        let fitT = 0;
        window.addEventListener('resize', () => { clearTimeout(fitT); fitT = setTimeout(fit, 120); }, { passive: true });
        requestAnimationFrame(tick);
        track.addEventListener('focusin', (e) => {
            if (!on) return;
            pin.scrollLeft = 0;
            const item = e.target.closest('.model'), q = (item.offsetLeft - (innerWidth - item.offsetWidth) / 2) / Math.max(1, dist);
            window.scrollTo(0, reel.getBoundingClientRect().top + window.scrollY + clamp(q, 0, 1) * (reel.offsetHeight - innerHeight));
        });
    }

    /* ── pictures, cards and blocks slide in as they arrive, from the side or from below, and float away upward as they leave,
       scrubbed by the scroll. Neighbours on one row start a beat apart, so they come one by one. Nothing is hidden while it
       is in the middle of the screen. ── */
    if (!reduce) {
        const views = [...document.querySelectorAll('.view img')];
        const floats = [...document.querySelectorAll('.view img, .range--one .model__img, .range--one .model__body, .boat, .sold, .others__grid > li, .inv__none, .others .h2, .absplit__img, .absplit__copy, .abpara--wide, .vdg, .vdabout__lists > div')].filter((el) => !el.closest('.chap')).filter((el) => !el.closest('.inv--list') && !(phone.matches && el.closest('.vdmore'))).map((el) => {
            el.classList.remove('rise', 'is-in');
            const sibs = [...el.parentElement.children];
            const v = views.indexOf(el);
            // within a group: the first from the left, the next from the right a step later; the last picture from below
            let side = v < 0 ? 0 : v === 4 ? 0 : v % 2 ? 1 : -1;
            if (el.matches('.range--one .model__img, .others .h2, .sold, .absplit:not(.absplit--flip) .absplit__img, .absplit--flip .absplit__copy')) side = -1;
            if (el.matches('.range--one .model__body, .absplit:not(.absplit--flip) .absplit__copy, .absplit--flip .absplit__img')) side = 1;
            const g = el.matches('.vdg') ? sibs.indexOf(el) % 5 : -1;   // the photos go in steps: the first from below, then a pair at a time, the second a beat later
            if (g > 0) side = g % 2 ? -1 : 1;
            return { el, ty: 0, side, lag: g >= 0 ? (g === 2 || g === 4 ? 0.12 : 0) : v >= 0 ? (v % 2 ? 0.14 : 0) : el.matches('.boat, li') ? (sibs.indexOf(el) % 4) * 0.07 : el.matches('.model__body, .absplit__copy') ? 0.1 : 0 };
        });
        const float = () => {
            const vh = innerHeight, reach = phone.matches ? 0.22 : 0.09;
            floats.forEach((f) => {
                const r = f.el.getBoundingClientRect(), top = r.top - f.ty, bot = r.bottom - f.ty;   // its place on the page, without its own travel
                if (bot < -vh * 0.4 || top > vh * 1.4) return;
                const inn = smooth(clamp((top - vh * (0.6 - f.lag)) / (vh * 0.36), 0, 1));
                const out = smooth(clamp((vh * (0.28 - f.lag * 0.5) - bot) / (vh * 0.3), 0, 1));
                f.ty = (inn * (f.side ? 0.04 : 0.18) - out * 0.14) * vh;
                f.el.style.transform = `translate3d(${(inn * f.side * reach * innerWidth).toFixed(1)}px, ${f.ty.toFixed(1)}px, 0)`;
                f.el.style.opacity = (clamp(1 - inn * 1.35, 0, 1) * (1 - out)).toFixed(3);   // nearly clear before it reaches its place, so nothing readable hangs off the edge
            });
            requestAnimationFrame(float);
        };
        requestAnimationFrame(float);
    }

    /* ── the page's bar: on from the first panel, off where the form or the footer takes over; it names the section on show ── */
    const pbar = $('[data-pbar]');
    if (pbar) {
        const hero = $('[data-vhero]'), contact = document.getElementById('contact');
        const links = [...pbar.querySelectorAll('[data-pbar-link]')], placed = links.map((a) => document.querySelector(a.getAttribute('href')));
        const update = () => {
            const vh = innerHeight, on = hero.getBoundingClientRect().top < -vh * 0.25 && contact.getBoundingClientRect().top > vh * 0.55;
            pbar.classList.toggle('is-on', on);
            placed.forEach((sec, i) => { const r = sec.getBoundingClientRect(); if (r.top < vh * 0.5 && r.bottom > vh * 0.5) links[i].setAttribute('aria-current', 'true'); else links[i].removeAttribute('aria-current'); });
        };
        window.addEventListener('scroll', update, { passive: true });
        const measure = () => { const r = $('[data-reel]'); if (r) r.style.setProperty('--pbar-w', `${phone.matches ? 0 : pbar.offsetWidth}px`); };
        window.addEventListener('resize', () => { measure(); update(); }, { passive: true });
        measure(); update();
    }

    /* ── the side views of the stock cards and the surf load on approach ── */
    if ('IntersectionObserver' in window) {
        const start = (v) => {
            const src = v.querySelectorAll('source[data-src]');
            if (src.length) { src.forEach((s) => { s.src = s.dataset.src; s.removeAttribute('data-src'); }); v.load(); }
            v.play().catch(() => {});
        };
        if (!reduce) document.querySelectorAll('[data-surf]').forEach((v) => new IntersectionObserver((es) => es.forEach((e) => {
            if (e.isIntersecting) start(v); else v.pause();
        }), { rootMargin: '300px 300px' }).observe(v));
    }

    const inv = document.getElementById('inventory');
    if (inv && 'IntersectionObserver' in window) new IntersectionObserver((es, o) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        inv.querySelectorAll('img[data-src]').forEach((im) => { im.src = im.dataset.src; im.removeAttribute('data-src'); });
        o.disconnect();
    }), { rootMargin: '100% 0px' }).observe(inv);

    /* ── cards rise as they arrive ── */
    const risers = [...document.querySelectorAll('.rise')];
    if (reduce || !('IntersectionObserver' in window)) risers.forEach((el) => el.classList.add('is-in'));
    else {
        const io = new IntersectionObserver((es) => es.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.style.transitionDelay = `${([...e.target.parentElement.children].indexOf(e.target) % 4) * 0.09}s`;
            e.target.classList.add('is-in'); io.unobserve(e.target);
        }), { rootMargin: '0px 0px -12% 0px' });
        risers.forEach((el) => io.observe(el));
    }

    /* ── Brands list ── */
    const dropT = $('.hdr__droptgl');
    if (dropT) {
        dropT.addEventListener('click', () => dropT.setAttribute('aria-expanded', String(dropT.getAttribute('aria-expanded') !== 'true')));
        document.addEventListener('click', (e) => { if (!e.target.closest('.hdr__drop')) dropT.setAttribute('aria-expanded', 'false'); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && dropT.getAttribute('aria-expanded') === 'true') { dropT.setAttribute('aria-expanded', 'false'); dropT.focus(); } });
    }

    /* ── text in motion, as on the home page: headings step in word by word, paragraphs flow, scrubbed by the scroll ── */
    const wrapWords = (el, cls) => {
        const out = [];
        const walk = (node) => {
            [...node.childNodes].forEach((n) => {
                if (n.nodeType === 3) {
                    const frag = document.createDocumentFragment();
                    n.textContent.split(/(\s+)/).forEach((t) => {
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
        walk(el);
        return out;
    };
    if (!reduce) {
        const stageIntro = $('[data-vhero-copy]');
        if (stageIntro) {
            hdr.querySelectorAll('.hdr__cell, .hdr__logo, .hdr__nav > a, .hdr__nav > .hdr__drop').forEach((el, i) => el.animate([{ opacity: 0, transform: 'translateY(-14px)' }, { opacity: 1, transform: 'none' }], { duration: 900, delay: 120 + i * 45, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'backwards' }));
            stageIntro.querySelectorAll('.crumbs, .vhero__h1, .vhero__sub, .vhero__cta > *').forEach((el, i) => el.animate([{ opacity: 0, transform: 'translateY(22px)' }, { opacity: 1, transform: 'none' }], { duration: 1000, delay: 380 + i * 130, easing: 'cubic-bezier(.16, 1, .3, 1)', fill: 'backwards' }));
        }
        const SCOPE = 'main > section:not(.vhero), main > .chaps';
        const list = (q) => [...document.querySelectorAll(q.split(', ').flatMap((c) => SCOPE.split(', ').map((s) => `${s} ${c}`)).join(', '))];
        const items = [
            ...list('.h2:not(.chap__line), .sold__h').map((el) => ({ el, kind: 'head', words: wrapWords(el, 'tw') })),
            ...list('.sold__run, .contact__info > p, .hours').filter((el) => !el.closest('.contact--page')).map((el) => ({ el, kind: 'para', words: wrapWords(el, 'pw') }))
        ];
        const paint = (it) => {
            const r = it.el.getBoundingClientRect(), vh = innerHeight, n = it.words.length;
            const fin = clamp((vh * (phone.matches ? 0.99 : 0.95) - r.top) / (vh * (phone.matches ? 0.14 : 0.33)), 0, 1), fout = clamp((vh * 0.22 - r.bottom) / (vh * 0.22), 0, 1);
            const k = it.kind === 'head' ? 1.1 : 5;
            it.words.forEach((w, i) => {
                const a = clamp((fin * (n + k) - i) / k, 0, 1), b = clamp((fout * (n + k) - i) / k, 0, 1);
                const ea = a * a * (3 - 2 * a), eb = b * b * (3 - 2 * b);
                if (it.kind === 'head') { w.firstChild.style.opacity = (ea * (1 - eb)).toFixed(3); w.firstChild.style.transform = `translate3d(${((1 - ea) * 1.2 - eb * 1.2).toFixed(3)}em, 0, 0)`; }
                else { w.style.opacity = (0.06 + 0.94 * ea * (1 - eb)).toFixed(3); w.style.transform = `translate3d(0, ${((1 - ea) * 1.1 - eb * 0.6).toFixed(2)}em, 0)`; }
            });
        };
        const live = new Set();
        const io = new IntersectionObserver((es) => es.forEach((e) => { const it = items.find((x) => x.el === e.target); if (e.isIntersecting) live.add(it); else { live.delete(it); paint(it); } }), { rootMargin: '25% 0px 25% 0px' });
        items.forEach((it) => { io.observe(it.el); paint(it); });
        const tick = () => { live.forEach(paint); requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
    }

    /* ── menu (the page behind it is inert) ── */
    const menu = $('[data-menu]'), toggle = $('[data-menu-toggle]'), label = $('[data-menu-label]'), behind = [$('[data-main]'), $('.foot')];
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
    const box = $('[data-film-box]'), vid = $('[data-film-video]');
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

    /* ── inventory: a short search (year, make, length, price) and a sort; sold: a row of makes. Without the script every boat simply stands in its order ── */
    const invBox = $('[data-inv]');
    if (invBox) {
        const list = invBox.querySelector('[data-inv-list]'), none = invBox.querySelector('[data-inv-none]'), cards = [...list.children];
        const search = invBox.querySelector('[data-search]'), foot = invBox.querySelector('[data-search-foot]'), tools = invBox.querySelector('[data-inv-tools]');
        const sort = invBox.querySelector('[data-inv-sort]');
        const btns = tools ? [...tools.querySelectorAll('[data-inv-brand]')] : [];
        let brand = '', pass = () => true, after = () => {};
        const apply = () => {
            if (sort) {
                const [k, way] = sort.value.split('-'), sign = way === 'asc' ? 1 : -1;
                // a boat on request sorts last, whichever way the prices run
                const val = (c) => { const v = +(k === 'price' ? c.dataset.price : c.dataset.len); return v === 0 ? null : v; };
                [...cards].sort((a, b) => { const x = val(a), y = val(b); if (x === null) return 1; if (y === null) return -1; return (x - y) * sign; }).forEach((c) => list.appendChild(c));
            }
            let n = 0;
            cards.forEach((c) => { c.hidden = !pass(c); if (!c.hidden) n++; });
            none.hidden = n > 0;
            after(n);
        };
        if (tools) {
            tools.hidden = false;
            pass = (c) => !brand || c.dataset.brand === brand;
            after = () => btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.invBrand === brand)));
            btns.forEach((b) => b.addEventListener('click', () => { brand = b.dataset.invBrand; apply(); }));
        }
        let clear = () => { brand = ''; };
        if (search) {
            search.hidden = false; foot.hidden = false;
            const year = search.querySelector('[data-s-year]'), make = search.querySelector('[data-s-make]'), count = foot.querySelector('[data-s-count]'), clearBtn = foot.querySelector('[data-s-clear]');
            const uniq = (f) => [...new Set(cards.map(f))];
            uniq((c) => c.dataset.year).sort((a, b) => b - a).forEach((y) => year.add(new Option(y, y)));
            uniq((c) => c.dataset.brand).sort().forEach((m) => make.add(new Option(m, m)));
            const money = (v) => `$${Number(v).toLocaleString('en-US')}`;
            const range = (box, label, fmt, vals, step) => {
                const [lo, hi] = box.querySelectorAll('input');
                const min = Math.floor(Math.min(...vals) / step) * step, max = Math.ceil(Math.max(...vals) / step) * step;
                [lo, hi].forEach((i) => { i.min = min; i.max = max; });
                const show = () => {
                    box.style.setProperty('--a', `${((lo.value - min) / (max - min)) * 100}%`);
                    box.style.setProperty('--b', `${((hi.value - min) / (max - min)) * 100}%`);
                    label.textContent = `${fmt(lo.value)} to ${fmt(hi.value)}`;
                };
                const reset = () => { lo.value = min; hi.value = max; show(); };
                lo.addEventListener('input', () => { if (+lo.value > +hi.value) lo.value = hi.value; show(); apply(); });
                hi.addEventListener('input', () => { if (+hi.value < +lo.value) hi.value = lo.value; show(); apply(); });
                reset();
                return { lo, hi, reset, moved: () => +lo.value !== min || +hi.value !== max };
            };
            const len = range(search.querySelector('[data-s-len]'), search.querySelector('[data-s-len-val]'), (v) => `${v} ft`, cards.map((c) => +c.dataset.len), 1);
            const priced = cards.map((c) => +c.dataset.price).filter(Boolean);
            const price = range(search.querySelector('[data-s-price]'), search.querySelector('[data-s-price-val]'), money, priced, 25000);
            pass = (c) => {
                const p = +c.dataset.price, l = +c.dataset.len;
                if (year.value && c.dataset.year !== year.value) return false;
                if (make.value && c.dataset.brand !== make.value) return false;
                if (l < +len.lo.value || l > +len.hi.value) return false;
                // a boat with its price on request stays until the price is actually narrowed
                if (price.moved() && (!p || p < +price.lo.value || p > +price.hi.value)) return false;
                return true;
            };
            after = (n) => {
                count.textContent = n === 1 ? '1 boat' : `${n} boats`;
                clearBtn.hidden = !(year.value || make.value || len.moved() || price.moved());
            };
            clear = () => { year.value = ''; make.value = ''; len.reset(); price.reset(); };
            [year, make].forEach((s) => s.addEventListener('change', apply));
            clearBtn.addEventListener('click', () => { clear(); apply(); });
        }
        if (sort) sort.addEventListener('change', apply);
        invBox.querySelector('[data-inv-clear]').addEventListener('click', () => { clear(); apply(); });
        apply();
    }

    /* ── specifications: a card opens and closes softly, its height and its contents moving together; a click mid-way simply turns it round ── */
    document.querySelectorAll('.spec').forEach((d) => {
        const head = d.querySelector('summary'), body = d.querySelector('summary ~ *');
        let run = null, closing = false;
        const EASE = 'cubic-bezier(.22, .61, .36, 1)';
        const go = (from, to, onEnd) => {
            const a = d.animate({ height: [`${from}px`, `${to}px`] }, { duration: 520, easing: EASE });
            run = a;
            a.onfinish = () => { if (run === a) { run = null; onEnd(); } };
        };
        head.addEventListener('click', (e) => {
            if (reduce || !d.animate) return;
            e.preventDefault();
            const now = d.offsetHeight;   // where it is right now, mid-way or not
            if (run) { const old = run; run = null; old.cancel(); }
            if (d.open && !closing) {
                closing = true;
                body.animate({ opacity: [1, 0], transform: ['none', 'translateY(-6px)'] }, { duration: 260, easing: 'ease-in', fill: 'forwards' });
                head.querySelector('.ico').style.transform = '';
                d.classList.add('is-closing');
                go(now, head.offsetHeight + 2, () => { d.open = false; closing = false; d.classList.remove('is-closing'); body.getAnimations().forEach((a) => a.cancel()); });
            } else {
                closing = false; d.classList.remove('is-closing');
                d.open = true;
                body.getAnimations().forEach((a) => a.cancel());
                const full = d.offsetHeight;
                body.animate({ opacity: [0, 1], transform: ['translateY(10px)', 'none'] }, { duration: 460, delay: 90, easing: EASE, fill: 'backwards' });
                go(now, full, () => {});
            }
        });
    });

    /* ── on the phone only the first spec group stands open: the rest are a tap away ── */
    if (phone.matches) document.querySelectorAll('.vdspecs .spec').forEach((d, i) => { if (i) d.open = false; });

    /* ── boat first screen: the arrows move through the photos; the last picture leaves before the next arrives, never two boats at once ── */
    const heroImg = $('[data-hero-img]');
    if (heroImg) {
        const list = [...document.querySelectorAll('.vdg img')].map((im) => im.getAttribute('src'));
        const prev = $('[data-hero-prev]'), next = $('[data-hero-next]');
        if (list.length > 1) {
            prev.hidden = false; next.hidden = false;
            let at = 0, want = 0, busy = false;
            const load = (src) => { const im = new Image(); im.src = src; return im.decode ? im.decode().catch(() => {}) : Promise.resolve(); };
            const swap = async () => {
                if (busy) return;
                busy = true;
                while (at !== want) {
                    at = want;
                    const src = list[at];
                    await load(src);
                    if (!reduce) await heroImg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240, easing: 'ease-in', fill: 'forwards' }).finished;
                    heroImg.src = src;
                    if (!reduce) { heroImg.getAnimations().forEach((a) => a.cancel()); await heroImg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 520, easing: 'cubic-bezier(.22, .61, .36, 1)' }).finished; }
                }
                busy = false;
                load(list[(at + 1) % list.length]);
            };
            const step = (d) => { want = (want + d + list.length) % list.length; swap(); };
            prev.addEventListener('click', () => step(-1));
            next.addEventListener('click', () => step(1));
            load(list[1]);
        }
    }

    /* ── boat page: every photo opens full size; arrows, Escape and a swipe move through them ── */
    const lb = $('[data-lb]');
    if (lb && lb.showModal) {
        const shots = [...document.querySelectorAll('.vdg img')].map((im) => ({ src: im.getAttribute('src'), alt: im.alt }));
        const pic = lb.querySelector('[data-lb-img]'), cnt = lb.querySelector('[data-lb-count]');
        let at = 0, back = null, x0 = null;
        const show = (i) => {
            at = (i + shots.length) % shots.length;
            pic.src = shots[at].src; pic.alt = shots[at].alt;
            cnt.textContent = `${at + 1} / ${shots.length}`;
            if (!reduce) pic.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, easing: 'ease-out' });
            const n = new Image(); n.src = shots[(at + 1) % shots.length].src;
        };
        const open = (i, from) => { back = from; show(i); if (lenis) lenis.stop(); lb.showModal(); };
        const close = () => { lb.close(); };
        lb.addEventListener('close', () => { if (lenis) lenis.start(); if (back) back.focus(); });
        document.querySelectorAll('[data-lb-open]').forEach((b) => b.addEventListener('click', () => open(+b.dataset.lbOpen, b)));
        lb.querySelector('[data-lb-close]').addEventListener('click', close);
        lb.querySelector('[data-lb-prev]').addEventListener('click', () => show(at - 1));
        lb.querySelector('[data-lb-next]').addEventListener('click', () => show(at + 1));
        lb.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') show(at - 1); if (e.key === 'ArrowRight') show(at + 1); });
        lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
        lb.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
        lb.addEventListener('pointerup', (e) => { if (x0 === null) return; const d = e.clientX - x0; x0 = null; if (Math.abs(d) > 50 && !e.target.closest('button')) show(at + (d < 0 ? 1 : -1)); });
    }

    /* ── contact: today's row and whether the showroom is open now, on Miami's clock ── */
    const hoursBox = $('[data-hours]'), hoursNow = $('[data-hours-now]');
    if (hoursBox && hoursNow) {
        const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', weekday: 'short', hour: 'numeric', hour12: false }).formatToParts(new Date());
        const day = parts.find((x) => x.type === 'weekday').value, hour = +parts.find((x) => x.type === 'hour').value % 24;
        const row = day === 'Sun' ? 2 : day === 'Sat' ? 1 : 0, open = row === 0 ? hour >= 9 && hour < 19 : row === 1 ? hour >= 10 && hour < 18 : false;
        hoursBox.querySelectorAll('dt')[row].classList.add('is-today'); hoursBox.querySelectorAll('dd')[row].classList.add('is-today');
        hoursNow.textContent = open ? `Open now, until ${row === 0 ? '7:00 pm' : '6:00 pm'}` : 'Closed now';
        hoursNow.classList.toggle('is-closed', !open);
        hoursNow.hidden = false;
    }

    /* ── form (mock-up) ── */
    const form = $('[data-form]');
    if (form) {
        document.addEventListener('click', (e) => {
            const a = e.target.closest('[data-enquire]'); if (!a) return;
            const sel = form.elements.interest, opt = [...sel.options].find((o) => o.text === a.dataset.enquire);
            if (opt) sel.value = opt.value;
        });
        const rules = {
            name: (v) => (v.trim() ? '' : 'Enter your name.'),
            phone: (v) => (v.replace(/\D/g, '').length >= 10 ? '' : 'Enter a phone number with at least 10 digits.'),
            email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter an email address like name@example.com.')
        };
        const check = (input) => {
            const msg = rules[input.name](input.value), err = document.getElementById(input.getAttribute('aria-describedby'));
            input.closest('.field').classList.toggle('is-invalid', !!msg);
            input.setAttribute('aria-invalid', msg ? 'true' : 'false');
            err.textContent = msg; err.hidden = !msg;
            return msg;
        };
        Object.keys(rules).forEach((n) => form.elements[n].addEventListener('blur', (e) => { if (e.target.value || e.target.getAttribute('aria-invalid')) check(e.target); }));
        // the button keeps its place under the pointer: no blur, so no error line closes and moves it mid-click
        form.querySelector('.form__send').addEventListener('mousedown', (e) => e.preventDefault());
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const bad = Object.keys(rules).map((n) => form.elements[n]).filter((i) => check(i));
            if (bad.length) { bad[0].focus(); return; }
            const done = form.querySelector('[data-form-done]');
            [...form.children].forEach((c) => { if (c !== done) c.hidden = true; });
            done.hidden = false; done.focus();
        });
    }
})();
