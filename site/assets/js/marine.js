/* Prestige Marine — homepage behaviour (26 Oct 2026).
   Lenis is the scroll layer (DNA90); nothing else drives motion. The hull and the sand tide
   are in normal flow; the only scroll-linked property is the hero's opacity as the bow
   crosses it. Everything works, and every word is readable, without this file. */
(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;

    /* Lenis — not constructed under reduced motion */
    let lenis = null;
    const boot = () => {
        if (reduce || !window.Lenis || lenis) return;
        lenis = new window.Lenis({ anchors: { offset: -64 }, autoRaf: true });
        window.__lenis = lenis;
        lenis.on('scroll', onScroll);
    };
    if (window.Lenis) boot(); else window.addEventListener('load', boot, { once: true });

    /* header: over the water it is transparent; through the passage it stays away so the
       hull is never cut by a bar; after that it returns on scroll-up as a sand bar */
    const hdr = document.querySelector('[data-hdr]');
    const hero = document.querySelector('[data-hero]');
    const passage = document.querySelector('[data-passage]');
    const hull = document.querySelector('[data-hull]');
    const brands = document.getElementById('brands');
    let lastY = window.scrollY;

    function onScroll() {
        const y = window.scrollY;
        const vh = window.innerHeight;
        const passTop = passage.getBoundingClientRect().top + y;
        const brandsTop = brands.getBoundingClientRect().top + y;

        // the H1 fades as the bow climbs through it (opacity + a few px of rise; no blur)
        if (!reduce) {
            const bow = hull.getBoundingClientRect().top;
            const h1 = hero.querySelector('h1').getBoundingClientRect();
            const t = Math.min(1, Math.max(0, (bow - h1.top) / (vh * 0.45)));
            hero.style.opacity = t.toFixed(3);
            hero.style.transform = `translateY(${((1 - t) * -12).toFixed(1)}px)`;
            hero.classList.toggle('is-gone', t < 0.2);
        }

        // header states
        const inPassage = y > vh * 0.35 && y < brandsTop - vh * 0.6;
        const onWater = y < passTop - vh * 0.6;
        hdr.dataset.tone = onWater ? 'water' : 'sand';
        if (root.classList.contains('menu-open')) { lastY = y; return; }
        if (inPassage) hdr.classList.add('is-hidden');
        else if (y > lastY + 4 && y > vh) hdr.classList.add('is-hidden');
        else if (y < lastY - 4 || y < vh * 0.35) hdr.classList.remove('is-hidden');
        lastY = y;
    }
    if (!lenis) window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    /* the four facts arrive once, by opacity (≈240 ms), when their part is in view */
    const facts = document.querySelectorAll('.fact');
    if ('IntersectionObserver' in window && !reduce) {
        const io = new IntersectionObserver((es) => es.forEach((e) => {
            if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
        }), { rootMargin: '0px 0px -18% 0px' });
        facts.forEach((f) => io.observe(f));
    } else facts.forEach((f) => f.classList.add('is-in'));

    /* loops: play only while on screen; lazy sources load on approach */
    const loadSrc = (v) => {
        v.querySelectorAll('source[data-src]').forEach((s) => { s.src = s.dataset.src; s.removeAttribute('data-src'); });
        if (v.dataset.src) { v.src = v.dataset.src; v.removeAttribute('data-src'); }
        v.load();
    };
    const play = (v) => { if (!reduce) v.play().catch(() => {}); };
    const water = document.querySelector('[data-loop]');
    if (reduce && water) { water.removeAttribute('autoplay'); water.pause(); }

    const surf = document.querySelector('[data-surf]');
    if (surf && 'IntersectionObserver' in window) {
        new IntersectionObserver((es) => es.forEach((e) => {
            if (e.isIntersecting) {
                if (surf.querySelector('source[data-src]')) loadSrc(surf);
                play(surf);
            } else surf.pause();
        }), { rootMargin: '400px 0px' }).observe(surf);
    }

    /* brands: the row in the middle of the screen owns the sticky frame; only its loop plays */
    const rows = [...document.querySelectorAll('[data-brand]')];
    const items = [...document.querySelectorAll('[data-frame-item]')];
    const setBrand = (k) => {
        rows.forEach((r, i) => r.classList.toggle('is-on', i === k));
        items.forEach((it, i) => {
            const on = i === k;
            it.classList.toggle('is-on', on);
            const v = it.querySelector('video');
            if (!v) return;
            if (on) { if (v.dataset.src) loadSrc(v); play(v); } else v.pause();
        });
    };
    if (rows.length && 'IntersectionObserver' in window && window.matchMedia('(min-width: 721px)').matches) {
        const brandIO = new IntersectionObserver((es) => es.forEach((e) => {
            if (e.isIntersecting) setBrand(+e.target.dataset.brand);
        }), { rootMargin: '-45% 0px -45% 0px' });
        rows.forEach((r) => brandIO.observe(r));
    }
    // pause the frame's loop when the whole section is off screen
    const frame = document.querySelector('[data-frame]');
    if (frame && 'IntersectionObserver' in window) {
        new IntersectionObserver(([e]) => {
            const v = frame.querySelector('.frame__item.is-on video');
            if (!v) return;
            if (e.isIntersecting) { if (v.dataset.src) loadSrc(v); play(v); } else v.pause();
        }).observe(frame);
    }

    /* menu */
    const menu = document.querySelector('[data-menu]');
    const toggle = document.querySelector('[data-menu-toggle]');
    const label = document.querySelector('[data-menu-label]');
    const setMenu = (open) => {
        menu.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
        label.textContent = open ? 'Close' : 'Menu';
        root.classList.toggle('menu-open', open);
        if (lenis) open ? lenis.stop() : lenis.start();
        if (open) menu.querySelector('a').focus();
    };
    toggle.addEventListener('click', () => setMenu(menu.hidden));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); } });
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

    /* "Watch full video": the brand's own film, streamed from the brand, in a dialog */
    const box = document.querySelector('[data-film-box]');
    const vid = document.querySelector('[data-film-video]');
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
    document.querySelector('[data-film-close]').addEventListener('click', closeFilm);
    box.addEventListener('cancel', (e) => { e.preventDefault(); closeFilm(); });
    box.addEventListener('click', (e) => { if (e.target === box) closeFilm(); });

    /* enquiry: "Enquire" on the stern plate arrives with that boat chosen */
    const form = document.querySelector('[data-form]');
    document.querySelectorAll('[data-enquire]').forEach((a) => a.addEventListener('click', () => {
        const sel = form.elements.interest;
        const opt = [...sel.options].find((o) => o.text === a.dataset.enquire);
        if (opt) sel.value = opt.value;
    }));

    /* the form is a mock-up (not connected): validate, then confirm locally */
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
