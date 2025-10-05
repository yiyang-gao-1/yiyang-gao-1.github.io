// include.js
(async function () {
  async function inject(sel, file){
    const host = document.querySelector(sel);
    if(!host) return;
    const res = await fetch(file, {cache: 'no-store'});
    host.innerHTML = await res.text();
  }
  await inject('[data-include="header"]', '/header.html');
  await inject('[data-include="footer"]', '/footer.html');

  activateNav();
  enableSmoothScroll();
  jumpIfHasHash();

  function activateNav(){
    const aList = document.querySelectorAll('nav .nav-links a');
    const path = location.pathname.replace(/\/$/, '/index.html');
    aList.forEach(a => {
      const href = a.getAttribute('href');
      const hrefPath = (href || '').split('#')[0] || '';
      if (!hrefPath) return;
      if (hrefPath === path) a.classList.add('active');
      if ((path === '/index.html') && href.startsWith('/index.html#')) {
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
