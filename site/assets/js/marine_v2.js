/* Prestige Marine — homepage v2 behaviour (26 Oct 2026).
   Lenis is the scroll layer (DNA90). The only scroll-linked property is the hero layer's opacity:
   it fades out before the bow reaches the buttons, uncovering the flats the hull sails on.
   Every word, price and link is in the HTML without this file. */
(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;

    let lenis = null;
    const boot = () => {
        if (reduce || !window.Lenis || lenis) return;
        lenis = new window.Lenis({ anchors: { offset: -64 }, autoRaf: true });
        window.__lenis = lenis;
        lenis.on('scroll', onScroll);
        window.removeEventListener('scroll', onScroll);
    };

    const hdr = document.querySelector('[data-hdr]');
    const hero = document.querySelector('[data-hero]');
    const heroVid = document.querySelector('[data-hero-video]');
    const cta = hero.querySelector('.hero__cta');
    const words = hero.querySelector('.hero__words');
    const hull = document.querySelector('[data-hull]');
    const brands = document.getElementById('brands');
    let lastY = window.scrollY;
    let heroPlaying = true;

    function onScroll() {
        const y = window.scrollY;
        const vh = window.innerHeight;
        const brandsTop = brands.getBoundingClientRect().top + y;

        // the buttons are gone by the time the bow reaches them; the water and the headline fade while
        // the bow climbs through the headline and are gone when it reaches its top (DESIGN-READ-v2 §3)
        if (!reduce) {
            const bow = hull.getBoundingClientRect().top;
            const bow0 = bow + y;
            const ctaB = cta.getBoundingClientRect().bottom;
            const wordsT = words.getBoundingClientRect().top;
            const tc = Math.min(1, Math.max(0, (bow - ctaB) / Math.max(1, bow0 - ctaB)));
            const t = Math.min(1, Math.max(0, (bow - wordsT) / Math.max(1, bow0 - wordsT)));
            cta.style.opacity = tc.toFixed(3);
            cta.style.visibility = tc < 0.1 ? 'hidden' : '';
            hero.style.opacity = t.toFixed(3);
            hero.classList.toggle('is-gone', t < 0.15);
            if (t === 0 && heroPlaying) { heroVid.pause(); heroPlaying = false; }
            else if (t > 0 && !heroPlaying) { heroVid.play().catch(() => {}); heroPlaying = true; }
        }

        // header: always on screen (Alex, 26 Oct: it must not disappear). Transparent with ink over the
        // water, a shallows-white bar once the page leaves the water
        if (root.classList.contains('menu-open')) { lastY = y; return; }
        hdr.classList.remove('is-hidden');
        hdr.dataset.tone = y > brandsTop - vh * 0.25 ? 'ground' : 'water';
        lastY = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    if (window.Lenis) boot(); else window.addEventListener('load', boot, { once: true });
    onScroll();

    /* facts arrive once, by opacity */
    const facts = document.querySelectorAll('.fact');
    if ('IntersectionObserver' in window && !reduce) {
        const io = new IntersectionObserver((es) => es.forEach((e) => {
            if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
        }), { rootMargin: '0px 0px -18% 0px' });
        facts.forEach((f) => io.observe(f));
    } else facts.forEach((f) => f.classList.add('is-in'));

    /* loops: the hero and flats autoplay (not under reduced motion); the surf loads on approach */
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

    /* brands: the row in the middle of the screen owns the sticky frame */
    const rows = [...document.querySelectorAll('[data-brand]')];
    const frames = [...document.querySelectorAll('[data-frame-item]')];
    if (rows.length && 'IntersectionObserver' in window && window.matchMedia('(min-width: 721px)').matches) {
        const io = new IntersectionObserver((es) => es.forEach((e) => {
            if (!e.isIntersecting) return;
            const k = +e.target.dataset.brand;
            rows.forEach((r, i) => r.classList.toggle('is-on', i === k));
            frames.forEach((f, i) => f.classList.toggle('is-on', i === k));
        }), { rootMargin: '-45% 0px -45% 0px' });
        rows.forEach((r) => io.observe(r));
    }
    // the phone rail scrolls sideways under its own finger, not Lenis's
    const rail = document.querySelector('[data-brands]');
    if (rail && window.matchMedia('(max-width: 720px)').matches) rail.setAttribute('data-lenis-prevent', '');

    /* inventory: the side elevations load when the section is within a screen */
    const inv = document.getElementById('inventory');
    if ('IntersectionObserver' in window) {
        new IntersectionObserver((es, o) => es.forEach((e) => {
            if (!e.isIntersecting) return;
            inv.querySelectorAll('img[data-src]').forEach((im) => { im.src = im.dataset.src; im.removeAttribute('data-src'); });
            o.disconnect();
        }), { rootMargin: '100% 0px' }).observe(inv);
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
        if (open) menu.querySelector('a').focus();
    };
    toggle.addEventListener('click', () => setMenu(menu.hidden));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); } });
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

    /* "Watch full video": the brand's own film, streamed from the brand */
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

    /* Enquire on a plate or a slip arrives with that boat chosen */
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
