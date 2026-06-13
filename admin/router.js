/* ═══════════════════════════════════════════════
    ROUTER.JS — SPA Navigation Engine (Secured)
    نظام إدارة العقارات
   ═══════════════════════════════════════════════ */

(function() {
  'use strict';

  // ── تنظيف الـ URL عند أول تحميل (إزالة index.html) ──
  (function cleanInitialUrl() {
    const raw = location.href;
    const cleaned = raw.replace(/index\.html/, '');
    if (cleaned !== raw) history.replaceState(null, '', cleaned);
  })();

  // ── State Persistence ──
  window.__savePageState = function(pageId, state) {
    try { sessionStorage.setItem('__ps_' + pageId, JSON.stringify(state)); } catch {}
  };
  window.__loadPageState = function(pageId) {
    try { const s = sessionStorage.getItem('__ps_' + pageId); return s ? JSON.parse(s) : null; } catch { return null; }
  };
  window.__clearPageState = function(pageId) {
    try { sessionStorage.removeItem('__ps_' + pageId); } catch {}
  };

  // تعريف الصفحات مع تحديد الأدوار المسموح لها بالدخول
  // Admin=مدير النظام | BookingManager=مدير الحجوزات | SiteEngineer=مهندس الموقع
  const PAGE_MAP = {
    'dashboard':    { file: null,                    label: 'لوحة التحكم', roles: ['Admin','BookingManager','SiteEngineer','1','2','3'] },
    'projects':     { file: 'pages/projects.js',     label: 'المشاريع',    roles: ['Admin','BookingManager','SiteEngineer','1','2','3'] },
    'buildings':    { file: 'pages/buildings.js',    label: 'البناء',      roles: ['Admin','BookingManager','SiteEngineer','1','2','3'] },
    'reservations': { file: 'pages/reservations.js', label: 'الحجوزات',    roles: ['Admin','BookingManager','1','2'] },
    'users':        { file: 'pages/users.js',        label: 'المستخدمين',  roles: ['Admin','1'] },
    'buyers':       { file: 'pages/buyers.js',       label: 'المشترين',    roles: ['Admin','BookingManager','1','2'] },
    'log':          { file: 'pages/log.js',          label: 'السجل',       roles: ['Admin','1'] },
    'sellrequests': { file: 'pages/sellrequests.js', label: 'طلبات البيع', roles: ['Admin','BookingManager','1','2'] },
    'tickets':      { file: 'pages/tickets.js',      label: 'تذاكر الصيانة', roles: ['Admin','BookingManager','1','2'] },
    'maintenancecategories': { file: 'pages/maintenancecategories.js', label: 'تصنيفات الصيانة', roles: ['Admin','1'] },
    'webhooks':              { file: 'pages/webhooks.js',              label: 'Webhooks',         roles: ['Admin','1'] },
    'warranty':              { file: 'pages/warranty.js',              label: 'مدد الضمان',       roles: ['Admin','1'] },
    'systemprofile':         { file: 'pages/systemprofile.js',         label: 'ملف النظام',       roles: ['Admin','1'] },
  };

  // حماية الحذف: فقط Admin يملك صلاحية الحذف في الواجهة
  window.__canDelete = function() {
    try {
      const d = JSON.parse(localStorage.getItem('authData') || '{}');
      return d.role === 'Admin' || d.role === '1';
    } catch { return false; }
  };

  const loadedModules = {};
  let currentPage   = null;
  let activeStyleEl = null;
  let pageAbortController = null;

  function loadPageModule(pageId) {
    return new Promise((resolve, reject) => {
      const info = PAGE_MAP[pageId];
      if (!info || !info.file) { resolve(); return; }
      if (loadedModules[pageId]) { resolve(); return; }
      const script = document.createElement('script');
      script.src = info.file + '?v=' + Date.now(); // Cache busting
      script.onload  = () => { loadedModules[pageId] = true; resolve(); };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

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

  function setPageHTML(pageId) {
    const main = document.getElementById('app-main');
    if (!main) return;
    main.innerHTML = '';

    if (pageId === 'dashboard') {
      main.innerHTML = window.__dashboardHTML || '<div class="page-header"><h1>لوحة المعلومات</h1></div>';
      return;
    }

    const selfInjectPages = ['projects', 'buildings', 'buyers', 'reservations', 'sellrequests', 'tickets', 'maintenancecategories', 'webhooks', 'warranty', 'systemprofile'];
    if (selfInjectPages.includes(pageId)) return;

    const staticHTML = window.__pageHTML && window.__pageHTML[pageId];
    if (staticHTML) main.innerHTML = staticHTML;
  }

  function updateNav(pageId) {
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.page === pageId);
    });
    const info = PAGE_MAP[pageId];
    const titleEl = document.getElementById('header-page-title');
    if (titleEl && info) titleEl.textContent = info.label;
  }

  window.navigate = async function(pageId, pushState) {
    if (pushState === undefined) pushState = true;

    // ── حماية المسارات (Security Guard) ──
    const authData = JSON.parse(localStorage.getItem('authData'));
    
    // 1. التأكد من تسجيل الدخول
    if (!authData || !authData.token) {
        window.location.href = '../login.html';
        return;
    }

    // 2. التأكد من الصلاحية (Role Check)
    const info = PAGE_MAP[pageId];
    if (info && info.roles && !info.roles.includes(authData.role)) {
        window.__showToast?.('ليس لديك صلاحية الوصول لهذه الصفحة', 'error');
        if (pageId !== 'dashboard') window.navigate('dashboard', false);
        return;
    }

    if (pageId === currentPage) return;
    currentPage = pageId;

    // حفظ آخر صفحة في الـ session
    try { sessionStorage.setItem('__lastPage', pageId); } catch {}

    // ── Clean URL: بدون index.html ──
    if (pushState) {
      const base = location.href.split('#')[0].replace(/index\.html$/, '');
      history.pushState({ page: pageId }, '', base + '#' + pageId);
    }

    updateNav(pageId);

    const main = document.getElementById('app-main');

    // ── انيميشن الخروج (opacity فقط — بدون transform حتى لا تتكسر المودالز) ──
    if (main) {
      main.style.transition = 'opacity 0.18s ease';
      main.style.opacity    = '0';
    }

    if (pageAbortController) { pageAbortController.abort(); pageAbortController = null; }
    pageAbortController = new AbortController();
    window.__pageAbortSignal = pageAbortController.signal;

    // انتظر نهاية انيميشن الخروج قبل تحميل المحتوى الجديد
    await new Promise(r => setTimeout(r, 160));

    // ── Skeleton loader أثناء تحميل الموديول ──
    const _wasLoaded = loadedModules[pageId];
    if (main && !_wasLoaded) {
      main.style.opacity = '1';
      main.innerHTML = `
        <div style="padding:32px 0;display:flex;flex-direction:column;gap:18px;animation:__sk-fade .3s ease">
          <div style="height:48px;width:55%;border-radius:12px;background:rgba(var(--fg-rgb), 0.05);animation:__sk-pulse 1.4s ease infinite"></div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px">
            ${[1,2,3,4].map(()=>`<div style="height:100px;border-radius:14px;background:rgba(var(--fg-rgb), 0.04);animation:__sk-pulse 1.4s ease infinite"></div>`).join('')}
          </div>
          <div style="height:300px;border-radius:16px;background:rgba(var(--fg-rgb), 0.04);animation:__sk-pulse 1.4s ease infinite"></div>
        </div>
        <style>
          @keyframes __sk-fade  { from{opacity:0} to{opacity:1} }
          @keyframes __sk-pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        </style>`;
    }

    try {
      await loadPageModule(pageId);
      injectCSS(pageId);
      setPageHTML(pageId);

      // ── انيميشن الدخول (opacity فقط — transform يكسر position:fixed للمودالز) ──
      if (main) {
        main.style.opacity = '0';
        requestAnimationFrame(() => requestAnimationFrame(() => {
          main.style.transition = 'opacity 0.28s cubic-bezier(0.22,1,0.36,1)';
          main.style.opacity    = '1';
        }));
      }

      const page = window.__pages && window.__pages[pageId];
      if (page && typeof page.init === 'function') {
        await page.init();
      }

    } catch (e) {
      if (main) {
        main.style.opacity = '1';
        main.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;gap:16px;text-align:center;padding:40px">
            <i class="ri-error-warning-line" style="font-size:3rem;color:#ff3b30;opacity:0.7"></i>
            <div style="font-size:1.1rem;font-weight:700;color:#fff">فشل تحميل الصفحة</div>
            <div style="font-size:0.88rem;color:#8fa3c0">${e.message || 'خطأ غير متوقع'}</div>
            <button onclick="window.navigate('${pageId}',false)" style="margin-top:8px;padding:9px 22px;border-radius:10px;background:#4e8df5;color:#fff;border:none;font-family:inherit;font-size:0.88rem;font-weight:700;cursor:pointer">
              <i class="ri-refresh-line"></i> إعادة المحاولة
            </button>
          </div>`;
      }
    }
  };

  window.addEventListener('popstate', e => {
    const pageId = (e.state && e.state.page) || getPageFromHash() || 'dashboard';
    window.navigate(pageId, false);
  });

  function getPageFromHash() {
    const hash = location.hash.replace('#', '').trim().toLowerCase();
    return PAGE_MAP[hash] ? hash : null;
  }

  // ── Real-time refresh: re-run the current page's load (bypasses the
  //    same-page guard in navigate so live entity changes take effect) ──
  window.__refreshCurrentPage = function() {
    if (!currentPage) return;
    const pid = currentPage;
    currentPage = null;
    window.navigate(pid, false);
  };

  window.__initRouter = function() {
    // استعد آخر صفحة من الـ hash (أو الجلسة) بدل الرجوع الإجباري للداشبورد
    let start = getPageFromHash();
    if (!start) { try { const s = sessionStorage.getItem('__lastPage'); if (s && PAGE_MAP[s]) start = s; } catch {} }
    window.navigate(start || 'dashboard', false);
  };

})();