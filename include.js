<!-- include.js -->
<script>
(async function () {
  // Inject header/footer
  async function inject(sel, file){
    const host = document.querySelector(sel);
    if(!host) return;
    const res = await fetch(file, {cache: 'no-store'});
    host.innerHTML = await res.text();
  }
  await inject('[data-include="header"]', '/header.html');
  await inject('[data-include="footer"]', '/footer.html');

  // After header is in the DOM:
  activateNav();
  enableSmoothScroll();
  jumpIfHasHash();

  // Highlight current tab
  function activateNav(){
    const aList = document.querySelectorAll('nav .nav-links a');
    // Treat /index.html and / as the same
    const path = location.pathname.replace(/\/$/, '/index.html');
    aList.forEach(a => {
      const href = a.getAttribute('href');
      const hrefPath = (href || '').split('#')[0] || '';
      if (!hrefPath) return;

      // Exact page matches (cv.html, portfolio.html, research.html, publications.html)
      if (hrefPath === path) a.classList.add('active');

      // When we are on index and an anchor is present, allow About/Research/etc. to be active
      if ((path === '/index.html') && href.startsWith('/index.html#')) {
        if (location.hash && href.endsWith(location.hash)) a.classList.add('active');
      }
    });
  }

  // Smooth-scrolling when already on the homepage
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
        // update active state
        document.querySelectorAll('nav .nav-links a').forEach(x => x.classList.remove('active'));
        a.classList.add('active');
      }
    });
  }

  // If lands with a hash from another page, jump to section
  function jumpIfHasHash(){
    if (location.hash){
      const id = location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({behavior:'instant'});
    }
  }
})();
</script>
