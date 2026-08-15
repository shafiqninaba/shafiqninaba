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

// ---- 2. Lightbox ---------------------------------------------------------
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
