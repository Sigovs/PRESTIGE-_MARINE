/* Prestige Marine — Inquire slides in from the right over frosted glass (Alex, 31 Oct 2026). One file for the home and the inner pages:
   the panel takes a copy of the page's own form, so its fields and boats are that page's. Without this file every Inquire still goes to the form on the page. */
(() => {
    const src = document.querySelector('[data-form]');
    if (!src || !window.HTMLDialogElement) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = document.documentElement;
    const OUT = 420;
    let box = null, form = null, opener = null, leaving = 0;

    const rules = {
        name: (v) => (v.trim() ? '' : 'Enter your name.'),
        phone: (v) => (v.replace(/\D/g, '').length >= 10 ? '' : 'Enter a phone number with at least 10 digits.'),
        email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Enter an email address like name@example.com.')
    };

    const makeForm = () => {
        const f = src.cloneNode(true);
        f.removeAttribute('data-form');
        f.reset();
        // the copy keeps nothing of the page form's state: not its ids, its scroll motion, its errors or a sent message
        [f, ...f.querySelectorAll('*')].forEach((el) => {
            el.removeAttribute('style');
            if (el.id) el.id = `q-${el.id}`;
            if (el.htmlFor) el.htmlFor = `q-${el.htmlFor}`;
            const by = el.getAttribute('aria-describedby');
            if (by) el.setAttribute('aria-describedby', `q-${by}`);
            el.removeAttribute('aria-invalid');
            el.classList.remove('is-invalid');
            if (!el.matches('.field__err, [data-form-done]')) el.hidden = false;
        });
        f.querySelectorAll('.field__err').forEach((p) => { p.hidden = true; p.textContent = ''; });
        f.querySelector('[data-form-done]').hidden = true;

        const check = (input) => {
            const msg = rules[input.name](input.value), err = document.getElementById(input.getAttribute('aria-describedby'));
            input.closest('.field').classList.toggle('is-invalid', !!msg);
            input.setAttribute('aria-invalid', msg ? 'true' : 'false');
            err.textContent = msg; err.hidden = !msg;
            return msg;
        };
        Object.keys(rules).forEach((n) => f.elements[n].addEventListener('blur', (e) => { if (e.target.value || e.target.getAttribute('aria-invalid')) check(e.target); }));
        f.querySelector('.form__send').addEventListener('mousedown', (e) => e.preventDefault());
        f.addEventListener('submit', (e) => {
            e.preventDefault();
            const bad = Object.keys(rules).map((n) => f.elements[n]).filter((i) => check(i));
            if (bad.length) { bad[0].focus(); return; }
            const done = f.querySelector('[data-form-done]');
            [...f.children].forEach((c) => { if (c !== done) c.hidden = true; });
            done.hidden = false; done.focus();
            f.dataset.sent = '';
        });
        [...f.children].forEach((c, i) => c.style.setProperty('--i', i + 1));
        return f;
    };

    const close = () => {
        if (!box.open || leaving) return;
        box.classList.remove('is-in');
        leaving = setTimeout(() => {
            leaving = 0;
            box.close();
            root.classList.remove('inq-open');
            window.__lenis?.start();
            opener?.focus({ preventScroll: true });
        }, reduce ? 0 : OUT);
    };

    const make = () => {
        box = document.createElement('dialog');
        box.className = 'inq';
        box.setAttribute('aria-labelledby', 'inq-h');
        box.setAttribute('data-lenis-prevent', '');
        box.innerHTML = '<div class="inq__in"><div class="inq__head"><h2 class="inq__h" id="inq-h">Inquire</h2>'
            + '<button class="inq__x" type="button" aria-label="Close"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19"/></svg></button></div></div>';
        document.body.append(box);
        box.querySelector('.inq__x').addEventListener('click', close);
        box.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
        // the frosted panel is the dialog itself, so a click outside it lands on the backdrop, left of its edge
        box.addEventListener('click', (e) => { if (e.target === box && e.clientX < box.getBoundingClientRect().left) close(); });
    };

    const open = (a) => {
        if (!box) make();
        if (leaving) { clearTimeout(leaving); leaving = 0; }
        if (!form || 'sent' in form.dataset) {
            form?.remove();
            form = makeForm();
            box.querySelector('.inq__in').append(form);
        }
        const name = a.dataset.enquire, sel = form.elements.interest;
        if (name && sel) {
            let opt = [...sel.options].find((o) => o.text === name);
            if (!opt) { opt = new Option(name); sel.add(opt, 1); }
            sel.value = opt.value;
        }
        opener = a;
        if (!box.open) {
            box.showModal();
            box.scrollTop = 0;
            void box.offsetWidth;
        }
        root.classList.add('inq-open');
        window.__lenis?.stop();
        box.classList.add('is-in');
    };

    // on the window, in capture, ahead of Lenis's own anchor jump
    window.addEventListener('click', (e) => {
        const a = e.target.closest?.('a[href="#contact"]');
        if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        e.stopPropagation();
        open(a);
    }, true);
})();
