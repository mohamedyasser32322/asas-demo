/* ═══════════════════════════════════════════════
    ROUTER.JS — BookingManager SPA
    نظام إدارة العقارات
   ═══════════════════════════════════════════════ */

(function() {
  'use strict';

  const PAGE_MAP = {
    'dashboard':    { file: null,                    label: 'لوحة التحكم' },
    'projects':     { file: 'pages/projects.js',     label: 'المشاريع'    },
    'reservations': { file: 'pages/reservations.js', label: 'الحجوزات'    },
    'buyers':       { file: 'pages/buyers.js',       label: 'المشترين'     },
    'sellrequests': { file: 'pages/sellrequests.js', label: 'طلبات البيع' },
    'tickets':      { file: 'pages/tickets.js',      label: 'تذاكر الصيانة' },
  };

  /* مدير الحجوزات — بدون صلاحية حذف أو تخصيص مهندس */
  window.__canDelete = function() { return false; };

  const loadedModules = {};
  let   currentPage   = null;
  let   activeStyleEl = null;
  let   pageAbortController = null;

  /* ── load JS module ── */
  function loadPageModule(pageId) {
    return new Promise((resolve, reject) => {
      const info = PAGE_MAP[pageId];
      if (!info || !info.file) { resolve(); return; }
      if (loadedModules[pageId]) { resolve(); return; }
      const script = document.createElement('script');
      script.src = info.file + '?v=' + Date.now();
      script.onload  = () => { loadedModules[pageId] = true; resolve(); };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  /* ── inject page CSS ── */
  function injectCSS(pageId) {
    if (activeStyleEl) { activeStyleEl.remove(); activeStyleEl = null; }
    const page = window.__pages && window.__pages[pageId];
    if (!page) return;
    const css = page.getCSS ? page.getCSS() : '';
    if (!css) return;
    const style = document.createElement('style');
    style.id = 'page-style-' + pageId;
    style.textContent = css;
    document.head.appendChild(style);
    activeStyleEl = style;
  }

  /* ── get token (unified) ── */
  function getToken() {
    let token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) {
      try {
        const d = JSON.parse(localStorage.getItem('authData') || '{}');
        token = d.token || d.authToken;
      } catch {}
    }
    return token || null;
  }

  /* ══════════════════════════════════════
     MAIN navigate()
  ══════════════════════════════════════ */
  window.navigate = async function(pageId, pushState) {
    if (pushState === undefined) pushState = true;

    // ── Auth guard ──
    if (!getToken()) {
      window.location.href = '../login.html';
      return;
    }

    // ── Page guard ──
    if (!PAGE_MAP[pageId]) {
      window.navigate('dashboard', false);
      return;
    }

    if (pageId === currentPage) return;
    currentPage = pageId;

    if (pushState) history.pushState({ page: pageId }, '', '#' + pageId);
    try { sessionStorage.setItem('__lastPage', pageId); } catch {}

    // ── Sync header + drawer via Layout ──
    if (typeof window.__syncNav === 'function') {
      window.__syncNav(pageId);
    }

    const main = document.getElementById('app-main');
    if (main) {
      main.style.opacity    = '0';
      main.style.transition = 'opacity 0.15s ease';
    }

    // abort previous page
    if (pageAbortController) { pageAbortController.abort(); pageAbortController = null; }
    pageAbortController = new AbortController();
    window.__pageAbortSignal = pageAbortController.signal;

    try {
      await loadPageModule(pageId);
      injectCSS(pageId);

      // ── Clear main ──
      if (main) main.innerHTML = '';

      if (main) requestAnimationFrame(() => requestAnimationFrame(() => {
        main.style.opacity = '1';
      }));

      // ── Dashboard ──
      if (pageId === 'dashboard') {
        if (main) {
          main.innerHTML = window.__bmDashboardHTML || '<div class="page-header"><h1>لوحة التحكم</h1></div>';
        }
        if (typeof window.__bmLoadDashboard === 'function') {
          window.__bmLoadDashboard();
        }
        return;
      }

      // ── Other pages ──
      const page = window.__pages && window.__pages[pageId];
      if (page && typeof page.init === 'function') {
        await page.init();
      }

    } catch (e) {
      console.error('[Router] error loading page:', pageId, e);
      if (main) {
        main.style.opacity = '1';
        main.innerHTML = `<div style="padding:40px;text-align:center;color:#8fa3c0">فشل تحميل الصفحة</div>`;
      }
    }
  };

  /* ── browser back/forward ── */
  window.addEventListener('popstate', e => {
    const pageId = (e.state && e.state.page) || getPageFromHash() || 'dashboard';
    window.navigate(pageId, false);
  });

  function getPageFromHash() {
    const hash = location.hash.replace('#', '').toLowerCase();
    return PAGE_MAP[hash] ? hash : null;
  }

  // ── Real-time refresh: re-run current page load (bypasses same-page guard) ──
  window.__refreshCurrentPage = function() {
    if (!currentPage) return;
    const pid = currentPage;
    currentPage = null;
    window.navigate(pid, false);
  };

  /* ── kick off after layout is ready ── */
  window.__initRouter = function() {
    let start = getPageFromHash();
    if (!start) { try { const s = sessionStorage.getItem('__lastPage'); if (s && PAGE_MAP[s]) start = s; } catch {} }
    window.navigate(start || 'dashboard', false);
  };

  /* ── auto-start if DOMContentLoaded already fired ── */
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => window.__initRouter(), 0);
  } else {
    document.addEventListener('DOMContentLoaded', () => window.__initRouter());
  }

})();