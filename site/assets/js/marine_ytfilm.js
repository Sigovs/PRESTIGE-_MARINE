/* Prestige Marine — the About film stays on YouTube, as on the client's current site: silent, no controls, the whole film running and starting over, while it is near the screen. YouTube draws its own title and icons whenever playback starts or restarts, so the poster covers those moments. Without scripts, or with reduced motion, the poster stands. Watch full video opens it whole with sound. */
(() => {
    const films = [...document.querySelectorAll('[data-yt]')];
    if (!films.length || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const CLEAR = 3200;   // how long YouTube's own title stays up after playback starts
    // the film is silent here: a viewer's YouTube caption setting must not print over it
    const noCaptions = (p) => { try { p.unloadModule('captions'); p.unloadModule('cc'); } catch (e) { /* older player */ } };
    let api;
    const loadApi = () => api || (api = new Promise((done) => {
        window.onYouTubeIframeAPIReady = () => done(window.YT);
        const s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api'; document.head.append(s);
    }));
    films.forEach((el) => {
        let player = null, near = false, lift = 0;
        const cover = () => { clearTimeout(lift); lift = 0; el.classList.remove('is-on'); };
        const uncover = () => { clearTimeout(lift); lift = setTimeout(() => el.classList.add('is-on'), CLEAR); };
        const start = async () => {
            const YT = await loadApi();
            const slot = document.createElement('div'); el.append(slot);
            player = new YT.Player(slot, {
                host: 'https://www.youtube-nocookie.com', videoId: el.dataset.yt,
                playerVars: { autoplay: 1, mute: 1, controls: 0, playsinline: 1, rel: 0, modestbranding: 1, disablekb: 1, fs: 0, iv_load_policy: 3, cc_load_policy: 0, start: +el.dataset.from },
                events: {
                    onReady: (e) => { e.target.getIframe().tabIndex = -1; e.target.mute(); noCaptions(e.target); if (near) e.target.playVideo(); },
                    onStateChange: (e) => {
                        if (e.data !== YT.PlayerState.PLAYING) return;
                        noCaptions(e.target);
                        if (!el.classList.contains('is-on') && !lift) uncover();
                    },
                },
            });
            // before the film's closing logos the poster comes back, and behind it the film starts over
            setInterval(() => {
                if (!near || !player.getCurrentTime) return;
                const t = player.getCurrentTime(), end = +el.dataset.to;
                if (t >= end - 1) cover();
                if (t >= end) { player.seekTo(0, true); uncover(); }
                else if (t < end - 1 && !lift && !el.classList.contains('is-on') && player.getPlayerState() === YT.PlayerState.PLAYING) uncover();
            }, 400);
        };
        new IntersectionObserver((es) => es.forEach((e) => {
            near = e.isIntersecting;
            if (near && !player) start();
            else if (player && player.playVideo) {
                if (near) player.playVideo();
                else { player.pauseVideo(); cover(); }
            }
        }), { rootMargin: '200px 0px' }).observe(el);
    });
})();
