// The ONLY client JS on the site. Two features, no libraries, no polyfills.
// Contract is data-attributes only (§E.6, §E.8, §E.9) — never component internals.

// ---- 1. Table-of-contents scroll-spy -------------------------------------
const links = document.querySelectorAll<HTMLAnchorElement>('[data-toc] a');
if (links.length) {
  const byId = new Map<string, HTMLAnchorElement>();
  links.forEach((a) => byId.set(a.hash.slice(1), a));
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        links.forEach((l) => l.removeAttribute('aria-current'));
        byId.get(e.target.id)?.setAttribute('aria-current', 'true');
      }
    },
    { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
  );
  document.querySelectorAll('main section[id]').forEach((s) => io.observe(s));
}

// ---- 2. Flickering grid backdrop ----------------------------------------
// Vanilla port of the starfolio template's magicui <FlickeringGrid> React
// island. Same parameters (2px squares, 2px gaps, flickerChance 0.3,
// maxOpacity 0.3). Contract is `canvas[data-grid]` — see Background.astro.
const cv = document.querySelector<HTMLCanvasElement>('canvas[data-grid]');
const ctx = cv?.getContext('2d');
if (cv && ctx) {
  const SQ = 2;
  const GAP = 2;
  const STEP = SQ + GAP;
  const MAX_OPACITY = 0.3;
  const FLICKER = 0.3;
  const still = matchMedia('(prefers-reduced-motion: reduce)');

  let cols = 0;
  let rows = 0;
  let cells = new Float32Array(0);
  let dpr = 1;
  let raf = 0;
  let last = 0;

  /** Repaint one cell in place. Repainting only what changed keeps this at
   *  ~100 fillRects/frame instead of ~20 000 for a full clear-and-redraw. */
  const paint = (i: number) => {
    const x = ((i / rows) | 0) * STEP * dpr;
    const y = (i % rows) * STEP * dpr;
    const s = SQ * dpr;
    ctx.clearRect(x, y, s, s);
    ctx.globalAlpha = cells[i];
    ctx.fillRect(x, y, s, s);
  };

  const setup = () => {
    dpr = devicePixelRatio || 1;
    const w = cv.clientWidth;
    const h = cv.clientHeight;
    cv.width = w * dpr;
    cv.height = h * dpr;
    cols = Math.floor(w / STEP);
    rows = Math.floor(h / STEP);
    cells = new Float32Array(cols * rows);
    // Canvas state resets with the backing store, so restyle after resizing.
    ctx.fillStyle = getComputedStyle(cv).color;
    for (let i = 0; i < cells.length; i++) {
      cells[i] = Math.random() * MAX_OPACITY;
      paint(i);
    }
  };

  // Repaint at ~12fps, not 60. The effect is a slow random shimmer, so the extra
  // 48 frames a second are invisible — but they are the difference between a
  // page that settles to idle and one that pins a core forever.
  const TICK = 80;

  const frame = (t: number) => {
    raf = requestAnimationFrame(frame);
    const dt = t - last;
    if (dt < TICK) return;
    last = t;
    // Expected number of flickers this tick, rather than rolling a die per cell
    // — statistically the same, ~200x fewer Math.random() calls.
    const n = cells.length * FLICKER * Math.min(dt / 1000, 0.5);
    let k = n | 0;
    if (Math.random() < n - k) k++;
    while (k--) {
      const i = (Math.random() * cells.length) | 0;
      cells[i] = Math.random() * MAX_OPACITY;
      paint(i);
    }
  };

  let visible = true;

  const start = () => {
    cancelAnimationFrame(raf);
    setup();
    if (visible && !still.matches) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };

  start();
  addEventListener('resize', start);
  still.addEventListener('change', start);

  // The strip is only ~160px tall and scrolls away with the document, so on most
  // of the page it is animating pixels nobody can see. Stop when it leaves.
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) start();
    else cancelAnimationFrame(raf);
  }).observe(cv);
}

// ---- 3. Lightbox ---------------------------------------------------------
const dlg = document.getElementById('lightbox') as HTMLDialogElement | null;
if (dlg) {
  const img = dlg.querySelector('img') as HTMLImageElement;
  document.addEventListener('click', (ev) => {
    const btn = (ev.target as HTMLElement).closest<HTMLElement>('[data-enlarge]');
    if (btn) {
      img.src = btn.dataset.full!;
      img.alt = btn.dataset.alt ?? '';
      dlg.showModal();
    } else if (ev.target === dlg) {
      dlg.close(); // click on the backdrop
    }
  });
  dlg.addEventListener('close', () => {
    img.removeAttribute('src');
  });
}
