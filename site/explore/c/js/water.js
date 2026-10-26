/* Prestige Marine — EXPLORE C · water ripple (Alex's note 7; reference: the 21st.dev water-ripple image).
   A height-field wave simulation on the CPU (one cell ≈ 9 css px), uploaded each frame as a texture;
   a WebGL pass refracts the live loop through it and adds a soft light on the wave faces.
   The <video> stays the source; the canvas sits over it and only draws while its panel is on screen.
   Not constructed under reduced motion. If WebGL is missing, nothing changes: the video stays visible. */
(() => {
    const VS = `attribute vec2 p; varying vec2 vUv;
void main(){ vUv = vec2(p.x * .5 + .5, .5 - p.y * .5); gl_Position = vec4(p, 0., 1.); }`;
    const FS = `precision mediump float;
varying vec2 vUv;
uniform sampler2D uVid; uniform sampler2D uH;
uniform vec2 uTexel; uniform vec4 uCover; uniform float uStr;
void main(){
  float l = texture2D(uH, vUv - vec2(uTexel.x, 0.)).r;
  float r = texture2D(uH, vUv + vec2(uTexel.x, 0.)).r;
  float u = texture2D(uH, vUv - vec2(0., uTexel.y)).r;
  float d = texture2D(uH, vUv + vec2(0., uTexel.y)).r;
  vec2 g = vec2(r - l, d - u);
  vec2 uv = clamp(vUv + g * uStr, 0.001, .999);
  vec3 c = texture2D(uVid, uv * uCover.xy + uCover.zw).rgb;
  float lit = dot(g, vec2(-.7, -.7));            /* light from the upper left, as the yacht's shadow */
  c += vec3(.9, 1., 1.) * clamp(lit * 2.2, -.06, .16);
  gl_FragColor = vec4(c, 1.);
}`;

    class Ripple {
        constructor(host, opts = {}) {
            this.host = host;
            this.video = host.querySelector('video');
            this.fit = opts.position || [0.5, 0.5];      // object-position of the source video
            this.cell = opts.cell || 9;
            const cv = document.createElement('canvas');
            cv.className = 'water__fx';
            cv.setAttribute('aria-hidden', 'true');
            const gl = cv.getContext('webgl', { alpha: false, antialias: false, premultipliedAlpha: false, preserveDrawingBuffer: false });
            if (!gl) { this.dead = true; return; }
            this.cv = cv; this.gl = gl;
            host.appendChild(cv);
            this.prog = this.program(VS, FS);
            if (!this.prog) { cv.remove(); this.dead = true; return; }
            gl.useProgram(this.prog);
            const buf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
            const loc = gl.getAttribLocation(this.prog, 'p');
            gl.enableVertexAttribArray(loc);
            gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
            this.u = {};
            ['uVid', 'uH', 'uTexel', 'uCover', 'uStr'].forEach((n) => { this.u[n] = gl.getUniformLocation(this.prog, n); });
            this.tVid = this.tex(); this.tH = this.tex();
            gl.uniform1i(this.u.uVid, 0); gl.uniform1i(this.u.uH, 1);
            gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

            this.visible = false; this.energy = 0; this.last = null;
            this.resize();
            new ResizeObserver(() => this.resize()).observe(host);
            new IntersectionObserver((es) => { this.visible = es[0].isIntersecting; if (this.visible) this.kick(); }, { rootMargin: '100px 0px' }).observe(host);
            this.onMove = this.onMove.bind(this);
            window.addEventListener('pointermove', this.onMove, { passive: true });
            window.addEventListener('pointerdown', this.onMove, { passive: true });
            this.frame = this.frame.bind(this);
        }

        program(vs, fs) {
            const gl = this.gl;
            const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
            const v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
            if (!v || !f) return null;
            const p = gl.createProgram(); gl.attachShader(p, v); gl.attachShader(p, f); gl.linkProgram(p);
            return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
        }

        tex() {
            const gl = this.gl, t = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, t);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            return t;
        }

        resize() {
            const w = this.host.clientWidth, h = this.host.clientHeight;
            if (!w || !h) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            this.cv.width = Math.round(w * dpr); this.cv.height = Math.round(h * dpr);
            this.cw = w; this.ch = h;
            this.gw = Math.max(16, Math.round(w / this.cell)); this.gh = Math.max(16, Math.round(h / this.cell));
            this.a = new Float32Array(this.gw * this.gh); this.b = new Float32Array(this.gw * this.gh);
            this.bytes = new Uint8Array(this.gw * this.gh).fill(128);
            this.gl.viewport(0, 0, this.cv.width, this.cv.height);
        }

        onMove(e) {
            if (!this.visible) return;
            const r = this.host.getBoundingClientRect();
            const x = e.clientX - r.left, y = e.clientY - r.top;
            if (x < 0 || y < 0 || x > r.width || y > r.height) { this.last = null; return; }
            // only where the panel actually shows water (the window's clip), if the host says so
            if (this.host.dataset.clipTest && !window.__waterHit?.(e.clientX, e.clientY)) { this.last = null; return; }
            const speed = this.last ? Math.hypot(x - this.last[0], y - this.last[1]) : 14;
            this.last = [x, y];
            const amp = Math.min(1.6, 0.35 + speed * 0.045) * (e.type === 'pointerdown' ? 2 : 1);
            this.drop(x / r.width * this.gw, y / r.height * this.gh, amp);
            this.kick();
        }

        drop(gx, gy, amp) {
            const R = 3, w = this.gw, h = this.gh;
            for (let j = -R; j <= R; j++) for (let i = -R; i <= R; i++) {
                const x = Math.round(gx) + i, y = Math.round(gy) + j;
                if (x < 1 || y < 1 || x >= w - 1 || y >= h - 1) continue;
                const d = Math.hypot(i, j) / R;
                if (d <= 1) this.a[y * w + x] -= amp * (0.5 + 0.5 * Math.cos(d * Math.PI));
            }
            this.energy = 1;
        }

        step() {
            const w = this.gw, h = this.gh, a = this.a, b = this.b;
            let e = 0;
            for (let y = 1; y < h - 1; y++) {
                const row = y * w;
                for (let x = 1; x < w - 1; x++) {
                    const i = row + x;
                    let v = (a[i - 1] + a[i + 1] + a[i - w] + a[i + w]) * 0.5 - b[i];
                    v *= 0.972;
                    b[i] = v;
                    e += v < 0 ? -v : v;
                }
            }
            this.a = b; this.b = a;
            this.energy = e;
            const by = this.bytes, cur = this.a;
            for (let i = 0; i < cur.length; i++) { const q = 128 + cur[i] * 70; by[i] = q < 0 ? 0 : q > 255 ? 255 : q; }
        }

        kick() { if (!this.running) { this.running = true; requestAnimationFrame(this.frame); } }

        frame() {
            const v = this.video;
            if (!this.visible || !v || v.readyState < 2) { this.running = false; if (v && this.visible) v.addEventListener('loadeddata', () => this.kick(), { once: true }); return; }
            const gl = this.gl;
            this.step();
            gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.tVid);
            try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, v); } catch (err) { this.running = false; return; }
            gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.tH);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, this.gw, this.gh, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, this.bytes);
            // object-fit: cover, at the video's own object-position
            const va = v.videoWidth / v.videoHeight, ca = this.cw / this.ch;
            let sx = 1, sy = 1;
            if (ca > va) sy = va / ca; else sx = ca / va;
            gl.uniform4f(this.u.uCover, sx, sy, (1 - sx) * this.fit[0], (1 - sy) * this.fit[1]);
            gl.uniform2f(this.u.uTexel, 1 / this.gw, 1 / this.gh);
            gl.uniform1f(this.u.uStr, 0.11);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            // the canvas is only shown while the water is disturbed; at rest the video itself shows
            const live = this.energy > 0.5;
            if (live !== this.live) { this.live = live; this.cv.classList.toggle('is-live', live); }
            if (live || this.cv.classList.contains('is-live')) requestAnimationFrame(this.frame);
            else { this.running = false; }
        }
    }
    window.PMRipple = Ripple;
})();
