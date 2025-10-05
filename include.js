<!-- include.js -->
<script>
  async function include(selector, file) {
    const host = document.querySelector(selector);
    if (!host) return;
    try {
      const res = await fetch(file, { cache: "no-store" });
      host.innerHTML = await res.text();
      if (selector === '[data-include="header"]') activateNav(); // 
    } catch (e) {
      console.error("Include failed:", file, e);
    }
  }

  function activateNav() {
    const links = document.querySelectorAll('nav .nav-links a');
    const path = location.pathname.replace(/index\.html$/, '/'); // see /index.html as /
    const current = (path === '/' ? '/index.html' : path);

    links.forEach(a => {
      const href = a.getAttribute('href');
      // only compare paths (ignore #hash）
      const cleanHref = (href || '').split('#')[0] || '/';
      if (cleanHref === current) a.classList.add('active');
      // 
      if ((current === '/index.html' || current === '/') && href.startsWith('/index.html#')) {
        if (location.hash && href.endsWith(location.hash)) a.classList.add('active');
      }
    });
  }

  (async () => {
    await include('[data-include="header"]', '/header.html');
    await include('[data-include="footer"]', '/footer.html');
  })();
</script>
