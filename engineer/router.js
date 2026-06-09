/* ═══════════════════════════════════════════════
   ROUTER.JS — SPA Navigation Engine
   نظام مهندس الموقع
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  const PAGE_MAP = {
    'dashboard': { file: null,                 label: 'لوحة التحكم',  roles: ['Admin', 'SiteEngineer'] },
    'buildings': { file: 'pages/building.js', label: 'مراحل البناء', roles: ['Admin', 'SiteEngineer'] },
  };

  const loadedModules    = {};
  let currentPage        = null;
  let activeStyleEl      = null;
  let pageAbortController = null;

  function loadPageModule(pageId) {
    return new Promise((resolve, reject) => {
      const info = PAGE_MAP[pageId];
      if (!info || !info.file) { resolve(); return; }
      if (loadedModules[pageId]) { resolve(); return; }
      const script = document.createElement('script');
      script.src    = info.file + '?v=' + Date.now();
      script.onload  = () => { loadedModules[pageId] = true; resolve(); };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function injectCSS(pageId) {
    if (activeStyleEl) { activeStyleEl.remove(); activeStyleEl = null; }
    const page = window.__pages?.[pageId];
    if (!page) return;
    const css = page.getCSS?.();
    if (!css) return;
    const style       = document.createElement('style');
    style.id          = 'page-style-' + pageId;
    style.textContent = css;
    document.head.appendChild(style);
    activeStyleEl = style;
  }

  function setPageHTML(pageId) {
    const main = document.getElementById('app-main');
    if (!main) return;
    main.innerHTML = '';

    if (pageId === 'dashboard') {
      main.innerHTML = window.__dashboardHTML || '<div><h1>لوحة المعلومات</h1></div>';
      return;
    }

    /* buildings page injects its own HTML via init() */
  }

  function updateNav(pageId) {
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.page === pageId);
    });
    document.querySelectorAll('.lyt-d-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === pageId);
    });
    const info    = PAGE_MAP[pageId];
    const titleEl = document.getElementById('header-page-title');
    if (titleEl && info) titleEl.textContent = info.label;
  }

  window.navigate = async function (pageId, pushState) {
    if (pushState === undefined) pushState = true;

    /* ── Security Guard ── */
    let authData;
    try { authData = JSON.parse(localStorage.getItem('authData')); } catch {}
    if (!authData?.token) { window.location.href = '/login'; return; }

    const info = PAGE_MAP[pageId];
    if (!info) { window.navigate('dashboard', false); return; }
    if (info.roles && !info.roles.includes(authData.role)) {
      console.warn(`Access denied: ${authData.role} → ${pageId}`);
      if (pageId !== 'dashboard') window.navigate('dashboard', false);
      return;
    }

    if (pageId === currentPage) return;
    currentPage = pageId;

    if (pushState) history.pushState({ page: pageId }, '', '#' + pageId);
    try { sessionStorage.setItem('__lastPage', pageId); } catch {}
    updateNav(pageId);

    const main = document.getElementById('app-main');
    if (main) { main.style.opacity = '0'; main.style.transition = 'opacity 0.15s ease'; }

    /* abort previous page */
    if (pageAbortController) { pageAbortController.abort(); pageAbortController = null; }
    pageAbortController            = new AbortController();
    window.__pageAbortSignal = pageAbortController.signal;

    try {
      await loadPageModule(pageId);
      injectCSS(pageId);
      setPageHTML(pageId);

      if (main) requestAnimationFrame(() => requestAnimationFrame(() => { main.style.opacity = '1'; }));

      const page = window.__pages?.[pageId];
      if (page && typeof page.init === 'function') await page.init();

    } catch (e) {
      console.error('[Router] error:', pageId, e);
      if (main) {
        main.style.opacity = '1';
        main.innerHTML = `<div style="color:var(--danger);padding:40px;text-align:center">فشل تحميل الصفحة: ${e.message || e}</div>`;
      }
    }
  };

  window.addEventListener('popstate', e => {
    const pageId = (e.state?.page) || getPageFromHash() || 'dashboard';
    window.navigate(pageId, false);
  });

  function getPageFromHash() {
    const hash = location.hash.replace('#', '').toLowerCase();
    return PAGE_MAP[hash] ? hash : null;
  }

  /* loadPage hook (called by updatePageContent in Layout.js) */
  window.loadPage = async function (pageId) {
    if (pageId === 'dashboard') {
      const main = document.getElementById('app-main');
      if (main) main.innerHTML = window.__dashboardHTML || '';
      if (typeof loadDashboard === 'function') setTimeout(loadDashboard, 60);
      return;
    }
    await window.navigate(pageId, false);
  };

  // ── Real-time refresh: re-run current page load (bypasses same-page guard) ──
  window.__refreshCurrentPage = function () {
    if (!currentPage) return;
    const pid = currentPage;
    currentPage = null;
    window.navigate(pid, false);
  };

  window.__initRouter = function () {
    let start = getPageFromHash();
    if (!start) { try { const s = sessionStorage.getItem('__lastPage'); if (s && PAGE_MAP[s]) start = s; } catch {} }
    window.navigate(start || 'dashboard', false);
  };

})();