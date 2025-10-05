// include.js (pure JS - no <script> tags here)
(async function () {
  // --- helpers ---
  async function fetchText(url) {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
    return await res.text();
  }

  async function inject(selector, candidates) {
    const host = document.querySelector(selector);
    if (!host) return;
    let lastErr;
    for (const url of candidates) {
      try {
        const html = await fetchText(`${url}?cb=${Date.now()}`);
        host.innerHTML = html;
        return true;
      } catch (e) {
        lastErr = e;
        console.warn("Include failed, trying next:", e.message);
      }
    }
    console.error("All include candidates failed for", selector, lastErr);
    // Optional: visible hint on page
    host.innerHTML = `<div style="padding:10px;border:1px solid #f00;color:#900;background:#fee">
      Failed to load ${selector.replace('[data-include="','').replace('"]','')} — check file path & names.</div>`;
    return false;
  }

  // --- try absolute first, then relative as fallback ---
  const abs = (p) => `${location.origin}${p}`;
  const rel = (p) => p.replace(/^\//, ""); // remove leading slash

  await inject('[data-include="header"]', [abs("/header.html"), rel("/header.html")]);
  await inject('[data-include="footer"]', [abs("/footer.html"), rel("/footer.html")]);

  // --- after header is in the DOM, run behavior ---
  activateNav();
  enableSmoothScroll();
  jumpIfHasHash();

  function activateNav(){
    const aList = document.querySelectorAll('nav .nav-links a');
    // Treat / and /index.html the same
    const path = location.pathname === "/" ? "/index.html" : location.pathname;
    aList.forEach(a => {
      const href = a.getAttribute('href') || "";
      const hrefPath = href.split('#')[0];

      // page matches (cv.html, portfolio.html, research.html, publications.html)
      if (hrefPath && hrefPath === path) a.classList.add('active');

      // homepage anchors
      if (path === "/index.html" && href.startsWith("/index.html#")) {
        if (location.hash && href.endsWith(location.hash)) a.classList.add('active');
      }
    });
  }

  function enableSmoothScroll(){
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="/index.html#"]');
      if (!a) return;

      const id = a.getAttribute('href').split('#')[1];
      const onHome = (location.pathname === '/' || location.pathname === '/index.html');
      const target = document.getElementById(id);

      if (onHome && target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth'});
        history.replaceState(null, '', '/index.html#' + id);
        document.querySelectorAll('nav .nav-links a').forEach(x => x.classList.remove('active'));
        a.classList.add('active');
      }
    });
  }

  function jumpIfHasHash(){
    if (location.hash){
      const id = location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({behavior:'instant'});
    }
  }
})();
