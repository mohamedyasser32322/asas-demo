const API_BASE = window.location.origin;

/* ══════════════════════════════════════
   1. AUTH CHECK
══════════════════════════════════════ */
function checkAuth() {
  try {
    const d     = JSON.parse(localStorage.getItem('authData') || '{}');
    const token = d.token || d.authToken
               || localStorage.getItem('token')
               || localStorage.getItem('authToken');
    if (!token)          { window.location.replace('/login');  return false; }
    if (d.role !== 'Admin') { window.location.replace('/Unauth'); return false; }
    return true;
  } catch {
    window.location.replace('/login');
    return false;
  }
}

/* ══════════════════════════════════════
   2. GLOBAL TOAST (يعمل في كل الصفحات)
══════════════════════════════════════ */
(function _initGlobalToast() {
  const STYLE_ID = 'g-toast-style';
  if (!document.getElementById(STYLE_ID)) {
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = `
      #g-toast-wrap {
        position:fixed; bottom:22px; left:50%; transform:translateX(-50%);
        z-index:99999; display:flex; flex-direction:column; align-items:center;
        gap:9px; pointer-events:none;
      }
      .g-toast {
        display:flex; align-items:center; gap:10px;
        padding:12px 20px; border-radius:12px;
        background:rgba(var(--bg-rgb),0.97); border:1px solid rgba(var(--fg-rgb), 0.1);
        color:#fff; font-family:'Tajawal',sans-serif; font-size:0.9rem; font-weight:600;
        box-shadow:0 8px 32px rgba(0,0,0,0.45);
        pointer-events:all; white-space:nowrap;
        animation:g-toast-in 0.28s cubic-bezier(0.34,1.56,0.64,1) both;
        max-width:420px; white-space:normal;
      }
      .g-toast.removing { animation:g-toast-out 0.22s ease forwards; }
      .g-toast.success  { border-color:rgba(52,199,89,0.5); }
      .g-toast.error    { border-color:rgba(255,59,48,0.5); }
      .g-toast.warning  { border-color:rgba(255,204,0,0.5); }
      .g-toast.info     { border-color:rgba(var(--accent-rgb),0.5); }
      .g-toast i { font-size:1.1rem; flex-shrink:0; }
      .g-toast.success i { color:#34c759; }
      .g-toast.error    i { color:#ff3b30; }
      .g-toast.warning  i { color:#ffcc00; }
      .g-toast.info     i { color:var(--accent); }
      @keyframes g-toast-in  { from{opacity:0;transform:translateY(14px) scale(.95)} to{opacity:1;transform:translateY(0) scale(1)} }
      @keyframes g-toast-out { from{opacity:1;transform:translateY(0) scale(1)}  to{opacity:0;transform:translateY(10px) scale(.95)} }
    `;
    document.head.appendChild(s);
  }
  const ICONS = { success:'ri-checkbox-circle-fill', error:'ri-error-warning-fill', warning:'ri-alert-fill', info:'ri-information-fill' };

  window.__showToast = function(msg, type = 'success', duration = 3500) {
    let wrap = document.getElementById('g-toast-wrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'g-toast-wrap';
      document.body.appendChild(wrap);
    }
    const el = document.createElement('div');
    el.className = `g-toast ${type}`;
    el.innerHTML = `<i class="${ICONS[type] || ICONS.info}"></i><span>${msg}</span>`;
    wrap.appendChild(el);
    setTimeout(() => {
      el.classList.add('removing');
      el.addEventListener('animationend', () => el.remove(), { once: true });
    }, duration);
  };
})();

/* ══════════════════════════════════════
   3. TOKEN EXPIRY DETECTION
══════════════════════════════════════ */
(function _initTokenWatch() {
  // فك تشفير JWT وإرجاع payload كامل
  function _decodeToken() {
    try {
      const d = localStorage.getItem('authData');
      if (!d) return null;
      const t = JSON.parse(d).token;
      if (!t) return null;
      return JSON.parse(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    } catch { return null; }
  }

  function _getExpiry() {
    const p = _decodeToken();
    return p?.exp ? p.exp * 1000 : null;
  }

  let _warnedExpiry  = false;
  let _refreshing    = false;
  let _refreshFailed = false;

  // محاولة تجديد التوكن تلقائياً قبل انتهائه
  async function _tryRefresh() {
    if (_refreshing || _refreshFailed) return;
    _refreshing = true;
    try {
      const stored   = JSON.parse(localStorage.getItem('authData') || '{}');
      const oldToken = stored.token;
      if (!oldToken) { _refreshing = false; return; }

      const res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method:  'POST',
        headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${oldToken}` },
        body:    JSON.stringify({ token: oldToken })
      });

      if (res.ok) {
        const data = await res.json().catch(() => null);
        const newToken = data?.token || data?.accessToken || data?.data?.token;
        if (newToken) {
          stored.token = newToken;
          localStorage.setItem('authData', JSON.stringify(stored));
          if (localStorage.getItem('token')) localStorage.setItem('token', newToken);
          _warnedExpiry = false;
          window.__showToast?.('تم تجديد جلستك تلقائياً', 'success', 2500);
        }
      } else if (res.status === 404 || res.status === 405) {
        // الباك مش بيدعم refresh — نوقف المحاولات المستقبلية
        _refreshFailed = true;
      }
    } catch {
      _refreshFailed = true;
    } finally {
      _refreshing = false;
    }
  }

  function _checkExpiry() {
    const exp = _getExpiry();
    if (!exp) return;
    const remaining = exp - Date.now();

    if (remaining <= 0) {
      window.__showToast?.('انتهت صلاحية جلستك، جارٍ تسجيل الخروج...', 'warning', 2500);
      setTimeout(handleLogout, 2000);
      return;
    }

    // محاولة تجديد تلقائية لو باقي أقل من 3 دقائق
    if (remaining < 3 * 60 * 1000 && !_refreshFailed) {
      _tryRefresh();
      return;
    }

    // تحذير لو باقي أقل من 5 دقائق ولم ينجح التجديد
    if (remaining < 5 * 60 * 1000 && !_warnedExpiry && _refreshFailed) {
      _warnedExpiry = true;
      const mins = Math.ceil(remaining / 60000);
      window.__showToast?.(`تنبيه: تنتهي جلستك خلال ${mins} دقيقة`, 'warning', 5000);
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') { _warnedExpiry = false; _checkExpiry(); }
  });

  setInterval(() => { if (document.visibilityState === 'visible') _checkExpiry(); }, 60_000);
  setTimeout(_checkExpiry, 3000);
})();

/* ══════════════════════════════════════
   3a. GLOBAL ERROR TRANSLATOR
   ترجمة رسائل الخطأ الإنجليزية للعربية
══════════════════════════════════════ */
window.__translateError = function(msg) {
  if (!msg) return 'حدث خطأ غير متوقع';
  const m = String(msg).toLowerCase();

  // أخطاء المصادقة
  if (m.includes('unauthorized') || m.includes('unauthenticated'))
    return 'غير مصرح — يرجى تسجيل الدخول';
  if (m.includes('forbidden') || m.includes('access denied'))
    return 'ليس لديك صلاحية هذا الإجراء';
  if (m.includes('token') && (m.includes('expire') || m.includes('invalid')))
    return 'انتهت صلاحية الجلسة';

  // أخطاء البيانات المكررة
  if (m.includes('email') && (m.includes('exist') || m.includes('taken') || m.includes('duplicate') || m.includes('unique')))
    return 'البريد الإلكتروني مستخدم مسبقاً';
  if ((m.includes('phone') || m.includes('mobile')) && (m.includes('exist') || m.includes('duplicate') || m.includes('unique')))
    return 'رقم الهاتف مستخدم مسبقاً';
  if ((m.includes('national') || m.includes('identity')) && (m.includes('exist') || m.includes('duplicate')))
    return 'رقم الهوية مسجل مسبقاً';
  if (m.includes('unit') && (m.includes('already') || m.includes('reserved') || m.includes('sold')))
    return 'هذه الوحدة محجوزة أو مباعة مسبقاً';
  if (m.includes('name') && m.includes('exist'))
    return 'هذا الاسم مستخدم مسبقاً';
  if (m.includes('unique') || m.includes('duplicate') || (m.includes('already') && m.includes('exist')) || m.includes('ix_') || m.includes('uq_'))
    return 'هذه البيانات مسجلة مسبقاً';

  // أخطاء البيانات المرتبطة
  if (m.includes('foreign key') || m.includes('reference') || m.includes('constraint') || m.includes('related') || m.includes('conflict'))
    return 'لا يمكن تنفيذ الإجراء — توجد بيانات مرتبطة';
  if ((m.includes('delete') || m.includes('remove')) && (m.includes('child') || m.includes('depend')))
    return 'لا يمكن الحذف — يوجد عناصر مرتبطة بهذا السجل';

  // أخطاء الشبكة والخادم
  if (m.includes('not found') || m.includes('404')) return 'العنصر غير موجود';
  if (m.includes('timeout')  || m.includes('timed out')) return 'انتهت مهلة الاتصال، حاول مرة أخرى';
  if (m.includes('network')  || m.includes('fetch')) return 'تعذر الاتصال بالخادم';
  if (m.includes('server error') || m.includes('500')) return 'خطأ داخلي في الخادم';
  if (m.includes('bad request') || m.includes('400')) return 'بيانات غير صحيحة';
  if (m.includes('validation')) return 'بيانات غير صالحة، تحقق من المدخلات';

  // إرجاع الرسالة كما هي إذا كانت عربية
  if (/[؀-ۿ]/.test(msg)) return msg;

  return msg; // إذا لم يتطابق شيء
};

/* ══════════════════════════════════════
   3b. API WRAPPER — مع Timeout وإشعارات
══════════════════════════════════════ */
window.apiFetch = async function(endpoint, options = {}) {
  const userData = getUserData();
  const token = userData?.token
             || localStorage.getItem('token')
             || localStorage.getItem('authToken');
  if (!token) { handleLogout(); return null; }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...(options.headers || {})
  };

  const TIMEOUT_MS  = options._timeout  || 15000;
  const MAX_RETRIES = options._retries  ?? (options.method === 'GET' || !options.method ? 2 : 0);
  const pageSignal  = options.signal || window.__pageAbortSignal;
  const { signal: _s, _timeout: _t, _retries: _r, ...fetchOpts } = options;

  let attempt = 0;

  while (attempt <= MAX_RETRIES) {
    // تجاهل لو الصفحة اتغيرت
    if (pageSignal?.aborted) return null;

    const timeoutCtrl = new AbortController();
    const timeoutId   = setTimeout(() => timeoutCtrl.abort('timeout'), TIMEOUT_MS);
    let   pageAborted = false;
    const onPageAbort = () => { pageAborted = true; timeoutCtrl.abort('page-change'); };
    pageSignal?.addEventListener('abort', onPageAbort, { once: true });

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...fetchOpts, headers, signal: timeoutCtrl.signal
      });
      clearTimeout(timeoutId);
      pageSignal?.removeEventListener('abort', onPageAbort);

      if (response.status === 401) {
        window.__showToast('انتهت صلاحية جلستك، جارٍ تسجيل الخروج...', 'warning', 2500);
        setTimeout(handleLogout, 2000);
        return null;
      }
      if (response.status === 403) {
        window.__showToast('ليس لديك صلاحية لهذا الإجراء', 'error');
        return null;
      }
      return response; // ✅ نجح

    } catch (err) {
      clearTimeout(timeoutId);
      pageSignal?.removeEventListener('abort', onPageAbort);

      if (pageAborted || pageSignal?.aborted) return null;

      if (err.name === 'AbortError') {
        if (attempt < MAX_RETRIES) {
          attempt++;
          await new Promise(r => setTimeout(r, 1000 * attempt)); // exponential backoff
          continue;
        }
        window.__showToast('انتهت مهلة الاتصال بالخادم، حاول مرة أخرى', 'error');
        return null;
      }

      // خطأ شبكة (offline أو فشل fetch)
      if (attempt < MAX_RETRIES) {
        attempt++;
        await new Promise(r => setTimeout(r, 1200 * attempt));
        continue;
      }
      window.__showToast('تعذر الاتصال بالخادم، تحقق من الشبكة', 'error');
      return null;
    }
  }
  return null;
};

/* ══════════════════════════════════════
   4. CONFIG
══════════════════════════════════════ */
const LAYOUT_CONFIG = {
  appName: 'منصة Asas',
  nav: [
    { id: 'dashboard', label: 'الرئيسية', icon: 'ri-dashboard-3-line' },
    {
      id: 'grp-ops', label: 'العمليات', icon: 'ri-building-4-line',
      children: [
        { id: 'projects',  label: 'المشاريع', icon: 'ri-building-4-line' },
        { id: 'buildings', label: 'البناء',   icon: 'ri-community-line'  },
      ]
    },
    {
      id: 'grp-sales', label: 'المبيعات', icon: 'ri-hand-coin-line',
      children: [
        { id: 'reservations', label: 'الحجوزات',     icon: 'ri-calendar-check-line' },
        { id: 'sellrequests', label: 'طلبات البيع',  icon: 'ri-hand-coin-line'      },
      ]
    },
    {
      id: 'grp-users', label: 'المستخدمين', icon: 'ri-group-line',
      children: [
        { id: 'users',  label: 'الفريق',  icon: 'ri-user-settings-line' },
        { id: 'buyers', label: 'العملاء', icon: 'ri-group-line'         },
      ]
    },
    {
      id: 'grp-maint', label: 'الصيانة', icon: 'ri-hammer-line',
      children: [
        { id: 'tickets',               label: 'البلاغات',           icon: 'ri-customer-service-2-line' },
        { id: 'maintenancecategories', label: 'تصنيفات الصيانة',   icon: 'ri-list-settings-line'      },
      ]
    },
  ],
  /* الإعدادات في الـ header-left كأيقونة بدل nav item */
  systemMenu: [
    { id: 'systemprofile', label: 'ملف النظام',  icon: 'ri-settings-4-line'   },
    { id: 'log',           label: 'سجل النشاط', icon: 'ri-file-list-3-line'  },
    { id: 'webhooks',      label: 'Webhooks',   icon: 'ri-webhook-line'      },
  ]
};

/* ══════════════════════════════════════
   5. HELPERS
══════════════════════════════════════ */
function getUserData() {
  try { const d = localStorage.getItem('authData'); return d ? JSON.parse(d) : null; }
  catch { return null; }
}

// ── Role helpers (global) ──
window.isAdmin = function() {
  const d = getUserData();
  return d?.role === 'Admin' || d?.role === '1';
};
window.getRole = function() {
  return getUserData()?.role || '';
};

// صلاحيات الصفحات لكل دور
const _PAGE_ROLES = {
  dashboard: ['Admin','BookingManager','SiteEngineer','1','2','3'],
  projects:  ['Admin','BookingManager','SiteEngineer','1','2','3'],
  buildings: ['Admin','SiteEngineer','1','3'],
  reservations: ['Admin','BookingManager','1','2'],
  users:     ['Admin','1'],
  buyers:    ['Admin','BookingManager','1','2'],
  log:          ['Admin','1'],
  sellrequests: ['Admin','BookingManager','1','2'],
  tickets:      ['Admin','BookingManager','1','2'],
  maintenancecategories: ['Admin','1'],
  webhooks: ['Admin','1'],
  warranty: ['Admin','1'],
  systemprofile: ['Admin','1'],
};

function handleLogout() {
  ['authData', 'token', 'authToken', 'rememberMe', 'savedEmail']
    .forEach(k => localStorage.removeItem(k));
  try { sessionStorage.clear(); } catch {}   // امسح آخر صفحة حتى يبدأ من الداشبورد دايماً
  document.body.style.transition = 'opacity 0.3s ease';
  document.body.style.opacity = '0';
  setTimeout(() => { location.href = '/login'; }, 300);
}

/* ══════════════════════════════════════
   5. CSS — header + drawer + responsive
══════════════════════════════════════ */
function injectStyles() {
  const styleId = 'layout-enhanced-styles';
  if (document.getElementById(styleId)) return;

  const css = `
    /* ── Page transitions ── */
    .page-content {
      animation: lyt-slide-in 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform, opacity;
    }
    @keyframes lyt-slide-in {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0);    }
    }
    ::view-transition-old(root) { animation: 0.25s ease-out both lyt-fade-out; }
    ::view-transition-new(root) { animation: 0.35s cubic-bezier(0.4,0,0.2,1) both lyt-page-in; }
    @keyframes lyt-page-in  { from { transform:translateX(24px); opacity:0; } to { transform:translateX(0); opacity:1; } }
    @keyframes lyt-fade-out { from { opacity:1; } to { opacity:0; } }

    /* ══════════════════════════════════════════════════
       HEADER — clean professional 3-zone layout
       Right(logo) | Center(nav) | Left(user + logout)
       ══════════════════════════════════════════════════ */
    #app-header {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      padding: 0 26px !important;
      gap: 0 !important;
    }

    /* ── Right: logo ── */
    .header-right { display:flex !important; align-items:center !important; flex-shrink:1 !important; padding-inline-start:6px !important; }
    .header-right .header-logo { font-size: 1.15rem !important; font-weight: 800 !important; color: #fff !important; text-decoration: none !important; white-space: nowrap !important; }

    /* ── Center: nav ── */
    .header-nav {
      display: flex !important; align-items: center !important;
      gap: 20px !important; flex: 1 1 auto !important;
      justify-content: center !important;
      overflow-x: clip !important; overflow-y: visible !important;
      min-width: 0 !important;
      padding: 0 32px !important;
    }
    .nav-tab, .header-nav .nav-tab {
      display: inline-flex !important; align-items: center !important; gap: 7px !important;
      padding: 8px 14px !important; border-radius: 10px !important;
      cursor: pointer !important; color: var(--text-muted) !important;
      font-size: 0.88rem !important; font-weight: 600 !important;
      border: 1px solid transparent !important;
      transition: all 0.18s ease !important; white-space: nowrap !important;
      background: none !important; font-family: 'Tajawal', sans-serif !important;
      text-decoration: none !important;
    }
    .nav-tab i, .header-nav .nav-tab i { font-size: 0.88rem !important; flex-shrink: 0 !important; }
    .nav-tab:hover { color: #fff !important; background: rgba(var(--fg-rgb), 0.06) !important; }
    .nav-tab.active { color: #fff !important; background: rgba(var(--fg-rgb),0.08) !important; border-color: rgba(var(--fg-rgb),0.12) !important; box-shadow: none !important; }

    /* ── Left: action cluster ── */
    .header-left {
      display: flex !important; align-items: center !important; gap: 10px !important;
      flex-shrink: 0 !important;
    }

    /* Action icons cluster (settings + bell) */
    .header-actions {
      display: flex !important; align-items: center !important; gap: 10px !important;
    }

    /* Vertical divider between action cluster and user pill */
    .header-divider-v {
      width: 1px; height: 26px;
      background: var(--border-hover);
      margin: 0 4px;
    }

    /* Universal header icon button (settings, bell, etc.) */
    .header-icon-wrap { position: relative; }
    .header-icon-btn {
      width: 38px; height: 38px; border-radius: 10px;
      background: var(--surface-tint) !important;
      border: 1px solid var(--border) !important;
      color: var(--light) !important;
      cursor: pointer;
      display: flex !important; align-items: center !important; justify-content: center !important;
      font-size: 1.1rem;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .header-icon-btn:hover {
      background: var(--hover-tint) !important;
      border-color: var(--border-hover) !important;
      transform: translateY(-1px);
    }
    .header-icon-btn.active {
      background: rgba(var(--accent-rgb),0.12) !important;
      border-color: rgba(var(--accent-rgb),0.35) !important;
      color: var(--accent) !important;
    }

    /* Settings dropdown */
    .header-icon-dd {
      display: none; position: absolute;
      top: calc(100% + 10px); left: 0;
      min-width: 244px;
      background: linear-gradient(180deg, color-mix(in srgb, var(--card-bg) 96%, #fff 4%), var(--card-bg));
      border: 1px solid var(--border-hover);
      border-radius: 16px; padding: 7px;
      box-shadow:
        0 0 0 1px rgba(0,0,0,.04),
        0 24px 56px rgba(0,0,0,.5),
        0 6px 16px rgba(0,0,0,.18);
      backdrop-filter: blur(30px) saturate(180%);
      -webkit-backdrop-filter: blur(30px) saturate(180%);
      z-index: 999;
    }
    .header-icon-dd::before {
      content: ''; position: absolute; top: -6px; left: 24px;
      width: 12px; height: 12px;
      background: color-mix(in srgb, var(--card-bg) 96%, #fff 4%);
      border-left: 1px solid var(--border-hover);
      border-top: 1px solid var(--border-hover);
      transform: rotate(45deg);
      border-radius: 3px 0 0 0;
    }
    .header-icon-dd.show { display: block; animation: nav-dd-in .2s cubic-bezier(.16,1,.3,1); }
    .header-icon-dd-item {
      display: flex; align-items: center; gap: 11px;
      width: 100%; padding: 10px 11px; border-radius: 11px;
      color: var(--light); font-family: 'Tajawal', inherit;
      font-size: .89rem; font-weight: 600; cursor: pointer;
      border: 1px solid transparent; background: none; text-align: right;
      transition: background .16s, color .16s, transform .16s, border-color .16s;
    }
    .header-icon-dd-item + .header-icon-dd-item { margin-top: 2px; }
    .header-icon-dd-item:hover { background: var(--hover-tint); transform: translateX(-3px); }
    .header-icon-dd-icon {
      width: 32px; height: 32px; border-radius: 9px;
      display: inline-flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      background: var(--surface-tint);
      border: 1px solid var(--border);
      color: var(--text-muted);
      transition: color .16s, background .16s, border-color .16s;
    }
    .header-icon-dd-icon i { font-size: 1.05rem; }
    .header-icon-dd-item:hover .header-icon-dd-icon { color: var(--accent); background: rgba(var(--accent-rgb),.1); border-color: rgba(var(--accent-rgb),.25); }

    /* Notification bell uses same base style */
    .header-left .notif-bell-wrap { margin: 0 !important; }
    .header-left .notif-bell-btn {
      width: 38px !important; height: 38px !important;
      background: var(--surface-tint) !important;
      border: 1px solid var(--border) !important;
    }
    .header-left .notif-bell-btn:hover {
      background: var(--hover-tint) !important;
      border-color: var(--border-hover) !important;
      transform: translateY(-1px);
    }

    /* User pill — compact, height matches icons (38px) */
    .header-left .header-user {
      display: flex !important; align-items: center !important; gap: 9px !important;
      height: 38px !important;
      padding: 0 14px 0 5px !important;
      background: var(--surface-tint) !important;
      border: 1px solid var(--border) !important;
      border-radius: 19px !important;
      transition: all 0.22s !important;
    }
    .header-left .header-user:hover {
      background: var(--hover-tint) !important;
      border-color: var(--border-hover) !important;
    }
    .header-left .user-avatar {
      width: 28px !important; height: 28px !important; border-radius: 50% !important;
      background: linear-gradient(135deg, var(--accent), var(--accent-dark)) !important;
      display: flex !important; align-items: center !important; justify-content: center !important;
      font-size: 0.78rem !important; font-weight: 800 !important; color: #fff !important;
      flex-shrink: 0 !important;
    }
    .header-left .user-name {
      font-size: 0.83rem !important; font-weight: 700 !important; color: var(--light) !important;
      white-space: nowrap !important; max-width: 130px !important;
      overflow: hidden !important; text-overflow: ellipsis !important;
      display: inline-block !important;
    }
    .header-left .header-role-badge { display: none !important; }

    /* User pill is now a dropdown trigger (logout lives inside) */
    .header-user-wrap { position: relative; flex-shrink: 0; }
    .header-left .header-user { cursor: pointer !important; }
    .header-user-arrow {
      font-size: 1rem !important; color: var(--text-muted) !important;
      margin-inline-start: -2px !important; flex-shrink: 0 !important;
      transition: transform .2s ease !important;
    }
    .header-user-wrap.open .header-user-arrow { transform: rotate(180deg) !important; }
    .header-user-wrap.open .header-user {
      background: var(--hover-tint) !important;
      border-color: var(--border-hover) !important;
    }

    .header-user-dd {
      display: none; position: absolute;
      top: calc(100% + 10px); left: 0;
      min-width: 232px;
      background: linear-gradient(180deg, color-mix(in srgb, var(--card-bg) 96%, #fff 4%), var(--card-bg));
      border: 1px solid var(--border-hover);
      border-radius: 16px; padding: 7px;
      box-shadow:
        0 0 0 1px rgba(0,0,0,.04),
        0 24px 56px rgba(0,0,0,.5),
        0 6px 16px rgba(0,0,0,.18);
      backdrop-filter: blur(30px) saturate(180%);
      -webkit-backdrop-filter: blur(30px) saturate(180%);
      z-index: 999;
    }
    .header-user-dd::before {
      content: ''; position: absolute; top: -6px; left: 26px;
      width: 12px; height: 12px;
      background: color-mix(in srgb, var(--card-bg) 96%, #fff 4%);
      border-left: 1px solid var(--border-hover);
      border-top: 1px solid var(--border-hover);
      transform: rotate(45deg); border-radius: 3px 0 0 0;
    }
    .header-user-dd.show { display: block; animation: nav-dd-in .2s cubic-bezier(.16,1,.3,1); }
    .header-user-dd-head {
      display: flex; align-items: center; gap: 11px;
      padding: 9px 10px 12px; margin-bottom: 6px;
      border-bottom: 1px solid var(--border);
    }
    .header-user-dd-head .user-avatar {
      width: 38px !important; height: 38px !important; border-radius: 50% !important;
      background: linear-gradient(135deg, var(--accent), var(--accent-dark)) !important;
      display: flex !important; align-items: center !important; justify-content: center !important;
      font-size: .85rem !important; font-weight: 800 !important; color: #fff !important; flex-shrink: 0 !important;
    }
    .header-user-dd-name {
      font-size: .88rem; font-weight: 700; color: var(--light);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px;
    }
    .header-user-dd-role { font-size: .72rem; color: var(--warning); margin-top: 2px; }
    .header-user-dd-logout {
      display: flex; align-items: center; gap: 10px;
      width: 100%; padding: 10px 12px; border-radius: 11px;
      background: rgba(255,59,48,0.08); color: #ff7066;
      border: 1px solid rgba(255,59,48,0.2);
      cursor: pointer; font-family: 'Tajawal', inherit;
      font-size: .88rem; font-weight: 700; text-align: right;
      transition: all .18s ease;
    }
    .header-user-dd-logout:hover { background: rgba(255,59,48,0.18); border-color: rgba(255,59,48,0.4); transform: translateY(-1px); }
    .header-user-dd-logout i { font-size: 1.1rem; }

    /* ── Nav items base size ── */
    .nav-tab, .header-nav .nav-tab {
      flex: 0 0 auto !important;
      padding: 6px 6px !important;
      font-size: 0.82rem !important;
      gap: 4px !important;
    }
    .header-nav .nav-tab i { font-size: 0.95rem !important; }
    .header-role-badge { display: none !important; }

    /* ── Responsive ── */

    /* Below 1200px: icons only — text simply won't fit */
    @media (max-width: 1200px) {
      .header-nav .nav-tab span { display: none !important; }
      .header-nav .nav-tab { padding: 8px 10px !important; gap: 0 !important; }
      .header-nav .nav-tab i { font-size: 1.1rem !important; }
      .header-nav { gap: 3px !important; }
      .header-left .user-name { max-width: 90px !important; font-size: 0.78rem !important; }
    }

    @media (max-width: 1000px) {
      .header-left .user-name { display: none !important; }
      .header-left .header-user { padding: 0 5px !important; }
    }

    /* ── Hamburger ── */
    .lyt-hamburger {
      display: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 5px;
      width: 38px; height: 38px;
      border-radius: 9px;
      background: rgba(var(--fg-rgb), 0.06);
      border: 1px solid rgba(var(--fg-rgb), 0.09);
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.2s ease;
    }
    .lyt-hamburger:hover {
      background: rgba(var(--fg-rgb), 0.11);
      border-color: rgba(var(--fg-rgb), 0.18);
    }
    .lyt-hamburger span {
      display: block;
      width: 18px; height: 2px;
      background: var(--light);
      border-radius: 2px;
      transition: all 0.28s cubic-bezier(0.4,0,0.2,1);
      transform-origin: center;
      pointer-events: none;
    }
    .lyt-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .lyt-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
    .lyt-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

    /* ── Drawer overlay ── */
    #lyt-overlay {
      display: none;
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.62);
      z-index: 1000;
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      opacity: 0;
      transition: opacity 0.28s ease;
    }
    #lyt-overlay.open { display: block; opacity: 1; }

    /* ── Drawer panel ── */
    #lyt-drawer {
      position: fixed;
      top: 0; right: 0; bottom: 0;
      width: 268px;
      max-width: 82vw;
      z-index: 1001;
      background: rgba(var(--bg-rgb),0.99);
      border-left: 1px solid rgba(var(--fg-rgb), 0.07);
      display: flex;
      flex-direction: column;
      transform: translateX(110%);
      transition: transform 0.32s cubic-bezier(0.4,0,0.2,1);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      overflow-y: auto;
    }
    #lyt-drawer.open { transform: translateX(0); }

    .lyt-d-head {
      padding: 18px 18px 14px;
      border-bottom: 1px solid rgba(var(--fg-rgb), 0.07);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }
    .lyt-d-logo {
      font-size: 1.05rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.2px;
    }
    .lyt-d-close {
      width: 30px; height: 30px;
      border-radius: 8px;
      background: rgba(var(--fg-rgb), 0.05);
      border: 1px solid rgba(var(--fg-rgb), 0.08);
      color: rgba(var(--fg-rgb), 0.45);
      cursor: pointer;
      font-size: 1.05rem;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.18s ease;
    }
    .lyt-d-close:hover { color: #fff; background: rgba(var(--fg-rgb), 0.1); }

    .lyt-d-user {
      padding: 14px 18px;
      border-bottom: 1px solid rgba(var(--fg-rgb), 0.07);
      display: flex;
      align-items: center;
      gap: 11px;
      flex-shrink: 0;
    }
    .lyt-d-avatar {
      width: 38px; height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--accent-dark));
      display: flex; align-items: center; justify-content: center;
      font-size: 0.85rem; font-weight: 800; color: #fff;
      border: 2px solid rgba(var(--fg-rgb), 0.14);
      flex-shrink: 0;
    }
    .lyt-d-uname {
      font-size: 0.88rem; font-weight: 700; color: #fff;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .lyt-d-role { font-size: 0.7rem; color: #ffcc00; margin-top: 2px; }

    .lyt-d-nav {
      flex: 1;
      padding: 10px 10px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .lyt-d-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 13px;
      border-radius: 11px;
      cursor: pointer;
      color: rgba(var(--fg-rgb), 0.5);
      font-size: 0.92rem;
      font-weight: 600;
      border: 1px solid transparent;
      transition: all 0.18s ease;
      background: none;
      font-family: 'Tajawal', inherit;
      width: 100%;
      text-align: right;
    }
    .lyt-d-item i {
      font-size: 1.1rem;
      flex-shrink: 0;
      width: 20px;
      text-align: center;
    }
    .lyt-d-item:hover {
      color: #fff;
      background: rgba(var(--fg-rgb), 0.06);
      border-color: rgba(var(--fg-rgb), 0.08);
    }
    .lyt-d-item.active {
      color: var(--accent);
      background: rgba(var(--accent-rgb),0.12);
      border-color: rgba(var(--accent-rgb),0.22);
    }

    .lyt-d-foot {
      padding: 12px 10px;
      border-top: 1px solid rgba(var(--fg-rgb), 0.07);
      flex-shrink: 0;
    }
    .lyt-d-logout {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 11px 13px;
      border-radius: 11px;
      background: rgba(255,59,48,0.08);
      color: #ff3b30;
      border: 1px solid rgba(255,59,48,0.18);
      cursor: pointer;
      font-family: 'Tajawal', inherit;
      font-size: 0.9rem;
      font-weight: 700;
      transition: all 0.18s ease;
      width: 100%;
    }
    .lyt-d-logout:hover { background: rgba(255,59,48,0.18); }
    .lyt-d-logout i { font-size: 1.05rem; }

    /* ── Tablet: hide nav labels ── */
    @media (max-width: 1100px) {
      .header-nav .nav-tab span { display: none; }
      .header-nav .nav-tab { padding: 8px 10px; }
    }

    /* ── Mobile: drawer mode ── */
    @media (max-width: 768px) {
      #app-header { padding: 0 14px !important; gap: 10px !important; }
      .header-nav        { display: none !important; }
      .user-name         { display: none !important; }
      .header-role-badge { display: none !important; }
      .header-user-wrap  { display: none !important; }   /* الأفاتار والخروج داخل الـ drawer */
      .header-divider-v  { display: none !important; }
      #header-settings-wrap { display: none !important; } /* الإعدادات داخل الـ drawer */
      .lyt-hamburger     { display: flex !important; }

      /* الهيدر على الموبايل = اللوجو + الجرس + الهامبرجر فقط */
      .header-left   { width: auto !important; flex-shrink: 0 !important; gap: 8px !important; }
      .header-actions { gap: 6px !important; }
      .header-right  { width: auto !important; min-width: 0 !important; flex: 1 1 auto !important; overflow: hidden !important; }
      .header-logo   { overflow: hidden !important; text-overflow: ellipsis !important; }
    }

    /* ── Large screens ≥ 1600px: allow content to breathe ── */
    @media (min-width: 1600px) {
      #app-main { padding: 32px 48px 80px !important; max-width: 1600px; margin-right: auto; margin-left: auto; }
    }
    @media (min-width: 2000px) {
      #app-main { max-width: 1900px; }
    }

    /* ── Nav Groups (dropdown) ── */
    .nav-group { position: relative; }
    .nav-grp-btn { display: inline-flex !important; align-items: center !important; gap: 4px !important; }
    .nav-grp-arrow {
      opacity: .55 !important;
      transition: transform .22s ease, opacity .22s ease !important;
      flex-shrink: 0 !important;
      margin-right: 2px !important;
    }
    .nav-group:hover .nav-grp-arrow { opacity: 1 !important; }
    .nav-group.open .nav-grp-arrow {
      transform: rotate(180deg) !important;
      opacity: 1 !important;
    }
    .nav-group.has-active > .nav-grp-btn {
      color: #fff !important;
      background: rgba(var(--fg-rgb),.08) !important;
      border-color: rgba(var(--fg-rgb),.12) !important;
      box-shadow: none !important;
    }
    @media (max-width: 1200px) { .nav-grp-arrow { display: none !important; } }

    .nav-dd {
      display: none; position: absolute;
      top: calc(100% + 10px); right: 0;
      min-width: 252px;
      background: linear-gradient(180deg, color-mix(in srgb, var(--card-bg) 96%, #fff 4%), var(--card-bg));
      border: 1px solid var(--border-hover);
      border-radius: 16px;
      padding: 7px;
      box-shadow:
        0 0 0 1px rgba(0,0,0,.04),
        0 24px 56px rgba(0,0,0,.5),
        0 6px 16px rgba(0,0,0,.18);
      backdrop-filter: blur(30px) saturate(180%);
      -webkit-backdrop-filter: blur(30px) saturate(180%);
      z-index: 600;
      transform-origin: top center;
    }
    /* connector arrow */
    .nav-dd::before {
      content: ''; position: absolute; top: -6px; right: 26px;
      width: 12px; height: 12px;
      background: color-mix(in srgb, var(--card-bg) 96%, #fff 4%);
      border-left: 1px solid var(--border-hover);
      border-top: 1px solid var(--border-hover);
      transform: rotate(45deg);
      border-radius: 3px 0 0 0;
    }
    .nav-dd.show {
      display: block;
      animation: nav-dd-in .2s cubic-bezier(.16,1,.3,1);
    }
    @keyframes nav-dd-in {
      from { opacity: 0; transform: translateY(-8px) scale(.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .nav-dd-item {
      display: flex; align-items: center; gap: 11px;
      width: 100%; padding: 10px 11px; border-radius: 11px;
      color: var(--light); font-family: 'Tajawal', inherit;
      font-size: .89rem; font-weight: 600; cursor: pointer;
      border: 1px solid transparent; background: none; text-align: right;
      transition: background .16s, color .16s, transform .16s, border-color .16s;
      white-space: nowrap; position: relative;
    }
    .nav-dd-item + .nav-dd-item { margin-top: 2px; }
    .nav-dd-item:hover {
      background: var(--hover-tint);
      color: var(--light);
      transform: translateX(-3px);
    }
    .nav-dd-item.active {
      background: rgba(var(--accent-rgb),.13) !important;
      border-color: rgba(var(--accent-rgb),.28) !important;
      color: var(--accent) !important;
    }
    .nav-dd-item.active::after {
      content: ''; position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
      width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
      box-shadow: 0 0 8px rgba(var(--accent-rgb),.7);
    }
    .nav-dd-item-icon {
      width: 32px; height: 32px; border-radius: 9px;
      display: inline-flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      background: var(--surface-tint);
      border: 1px solid var(--border);
      color: var(--text-muted);
      transition: color .16s, background .16s, border-color .16s;
    }
    .nav-dd-item-icon i { font-size: 1.05rem; }
    .nav-dd-item:hover .nav-dd-item-icon { color: var(--accent); background: rgba(var(--accent-rgb),.1); border-color: rgba(var(--accent-rgb),.25); }
    .nav-dd-item.active .nav-dd-item-icon { color: var(--accent); background: rgba(var(--accent-rgb),.16); border-color: rgba(var(--accent-rgb),.32); }

    /* ── Drawer groups ── */
    .lyt-d-grp-hdr {
      display: flex; align-items: center; gap: 12px;
      width: 100%; padding: 11px 13px; border-radius: 11px;
      color: rgba(var(--fg-rgb), .65); font-family: 'Tajawal', inherit;
      font-size: .9rem; font-weight: 700; cursor: pointer;
      border: none; background: none; text-align: right; transition: all .18s;
    }
    .lyt-d-grp-hdr:hover { color: #fff; background: rgba(var(--fg-rgb), .05); }
    .lyt-d-grp-hdr i:first-child { font-size: 1.05rem; width: 20px; text-align: center; flex-shrink: 0; }
    .lyt-d-garrow { margin-right: auto; transition: transform .22s ease; font-size: .88rem; opacity: .55; }
    .lyt-d-grp-items { display: none; padding-right: 16px; flex-direction: column; gap: 2px; }
    .lyt-d-grp-items.open { display: flex; }
    .lyt-d-child { font-size: .86rem !important; color: rgba(var(--fg-rgb), .48) !important; padding: 9px 13px !important; }
    .lyt-d-child.active { color: var(--accent) !important; background: rgba(var(--accent-rgb),.1) !important; border-color: rgba(var(--accent-rgb),.18) !important; }

    /* ── Drawer system-menu separator ── */
    .lyt-d-sys-sep {
      margin: 12px 13px 6px; padding-top: 12px;
      border-top: 1px solid rgba(var(--fg-rgb), .08);
      font-size: .68rem; font-weight: 800; letter-spacing: .5px;
      text-transform: uppercase; color: var(--text-muted);
    }

    /* ── Sell-requests nav badge ── */
    @keyframes sr-bdg-ring {
      0%,100% { box-shadow: 0 0 0 0 rgba(255,59,48,.75); }
      50%      { box-shadow: 0 0 0 5px rgba(255,59,48,0); }
    }
    .nav-sr-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 17px;
      height: 17px;
      padding: 0 4px;
      border-radius: 20px;
      background: #ff3b30;
      color: #fff;
      font-size: .62rem;
      font-weight: 800;
      margin-right: 5px;
      line-height: 1;
      animation: sr-bdg-ring 1.8s ease-in-out infinite;
      flex-shrink: 0;
    }
    .nav-sr-badge.hidden { display: none !important; }
    .lyt-d-item .nav-sr-badge { min-width: 19px; height: 19px; font-size: .68rem; margin-right: 0; margin-left: auto; }
    .nav-dd-item .nav-sr-badge { margin-right: 0; margin-left: auto; }

    /* ── Tickets nav badge (red pulse) ── */
    @keyframes tk-bdg-ring {
      0%,100% { box-shadow: 0 0 0 0 rgba(255,59,48,.75); }
      50%     { box-shadow: 0 0 0 5px rgba(255,59,48,0); }
    }
    .nav-tk-badge {
      display: inline-flex; align-items: center; justify-content: center;
      min-width: 17px; height: 17px; padding: 0 4px;
      border-radius: 20px; background: #ff3b30; color: #fff;
      font-size: .62rem; font-weight: 800; margin-right: 5px; line-height: 1;
      animation: tk-bdg-ring 1.8s ease-in-out infinite; flex-shrink: 0;
    }
    .nav-tk-badge.hidden { display: none !important; }
    .lyt-d-item .nav-tk-badge { min-width: 19px; height: 19px; font-size: .68rem; margin-right: 0; margin-left: auto; }
    .nav-dd-item .nav-tk-badge { margin-right: 0; margin-left: auto; }
  `;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = css;
  document.head.appendChild(style);
}

/* ══════════════════════════════════════
   6. DRAWER DOM BUILDER
══════════════════════════════════════ */
function _buildDrawer() {
  if (document.getElementById('lyt-drawer')) return;

  // Overlay
  const overlay = document.createElement('div');
  overlay.id = 'lyt-overlay';
  overlay.onclick = closeDrawer;
  document.body.appendChild(overlay);

  // Panel
  const panel = document.createElement('nav');
  panel.id = 'lyt-drawer';
  panel.innerHTML = `
    <div class="lyt-d-head">
      <span class="lyt-d-logo">${window.BRAND?.companyName || LAYOUT_CONFIG.appName}</span>
      <button class="lyt-d-close" onclick="closeDrawer()">
        <i class="ri-close-line"></i>
      </button>
    </div>
    <div class="lyt-d-user">
      <div class="lyt-d-avatar" id="lyt-d-avatar">؟</div>
      <div style="min-width:0">
        <div class="lyt-d-uname" id="lyt-d-uname">—</div>
        <div class="lyt-d-role"  id="lyt-d-role">—</div>
      </div>
    </div>
    <div class="lyt-d-nav" id="lyt-d-nav"></div>
    <div class="lyt-d-foot">
      <button class="lyt-d-logout" onclick="handleLogout()">
        <i class="ri-logout-box-r-line"></i> تسجيل الخروج
      </button>
    </div>
  `;
  document.body.appendChild(panel);

  // ESC to close
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
}

function _fillDrawer(userName, userRole, initials) {
  const av = document.getElementById('lyt-d-avatar');
  const un = document.getElementById('lyt-d-uname');
  const ur = document.getElementById('lyt-d-role');
  if (av) av.textContent = initials;
  if (un) un.textContent = userName;

  // عرض الدور بشكل مقروء
  const roleLabels = { Admin:'مدير النظام', '1':'مدير النظام', BookingManager:'مدير الحجوزات', '2':'مدير الحجوزات', SiteEngineer:'مهندس الموقع', '3':'مهندس الموقع' };
  if (ur) ur.textContent = roleLabels[userRole] || userRole;

  const nav = document.getElementById('lyt-d-nav');
  if (!nav) return;

  // فلترة حسب الدور في الـ drawer أيضاً
  const allowedItems = LAYOUT_CONFIG.nav.filter(item => {
    if (item.children) {
      return item.children.some(c => { const pr = _PAGE_ROLES[c.id]; return !pr || pr.includes(userRole); });
    }
    const pr = _PAGE_ROLES[item.id];
    return !pr || pr.includes(userRole);
  });

  nav.innerHTML = allowedItems.map(item => {
    if (!item.children) {
      return `<button class="lyt-d-item" data-page="${item.id}" onclick="window._lytNavDrawer('${item.id}')">
        <i class="${item.icon}"></i><span>${item.label}</span>
        ${item.id === 'sellrequests' ? '<span class="nav-sr-badge hidden" id="nav-sr-badge-drw"></span>' : ''}
        ${item.id === 'tickets'      ? '<span class="nav-tk-badge hidden" id="nav-tk-badge-drw"></span>' : ''}
      </button>`;
    }
    const visKids = item.children.filter(c => { const pr = _PAGE_ROLES[c.id]; return !pr || pr.includes(userRole); });
    if (!visKids.length) return '';
    const grpHasSr = visKids.some(c => c.id === 'sellrequests');
    const grpHasTk = visKids.some(c => c.id === 'tickets');
    return `<div class="lyt-d-grp">
      <button class="lyt-d-grp-hdr" onclick="_lytDrawerGrpToggle('${item.id}')">
        <i class="${item.icon}"></i><span>${item.label}</span>
        ${grpHasSr ? '<span class="nav-sr-badge hidden"></span>' : ''}
        ${grpHasTk ? '<span class="nav-tk-badge hidden"></span>' : ''}
        <i class="ri-arrow-down-s-line lyt-d-garrow" id="lyt-dg-arrow-${item.id}"></i>
      </button>
      <div class="lyt-d-grp-items" id="lyt-dg-${item.id}">
        ${visKids.map(c => `
          <button class="lyt-d-item lyt-d-child" data-page="${c.id}" onclick="window._lytNavDrawer('${c.id}')">
            <i class="${c.icon}"></i><span>${c.label}</span>
            ${c.id === 'sellrequests' ? '<span class="nav-sr-badge hidden"></span>' : ''}
            ${c.id === 'tickets' ? '<span class="nav-tk-badge hidden"></span>' : ''}
          </button>`).join('')}
      </div>
    </div>`;
  }).join('');

  /* ── System / settings menu (so mobile drawer shows ALL menus) ── */
  const sysItems = (LAYOUT_CONFIG.systemMenu || []).filter(m => {
    const pr = _PAGE_ROLES[m.id]; return !pr || pr.includes(userRole);
  });
  if (sysItems.length) {
    nav.innerHTML += `
      <div class="lyt-d-sys-sep">الإعدادات</div>
      ${sysItems.map(m => `
        <button class="lyt-d-item" data-page="${m.id}" onclick="window._lytNavDrawer('${m.id}')">
          <i class="${m.icon}"></i><span>${m.label}</span>
        </button>`).join('')}
    `;
  }
}

/* ══════════════════════════════════════
   7. DRAWER ACTIONS (global)
══════════════════════════════════════ */
window.openDrawer = function() {
  document.getElementById('lyt-drawer')?.classList.add('open');
  document.getElementById('lyt-overlay')?.classList.add('open');
  document.querySelector('.lyt-hamburger')?.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.closeDrawer = function() {
  document.getElementById('lyt-drawer')?.classList.remove('open');
  document.getElementById('lyt-overlay')?.classList.remove('open');
  document.querySelector('.lyt-hamburger')?.classList.remove('open');
  document.body.style.overflow = '';
};

window._lytNavDrawer = function(pageId) {
  closeDrawer();
  navigate(pageId);
};

function _syncDrawer(pageId) {
  document.querySelectorAll('.lyt-d-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === pageId);
  });
  // auto-expand the group that contains the active page
  document.querySelectorAll('.lyt-d-grp-items').forEach(panel => {
    if (panel.querySelector(`.lyt-d-item[data-page="${pageId}"]`)) {
      panel.classList.add('open');
      const arrow = document.getElementById(`lyt-dg-arrow-${panel.id.replace('lyt-dg-','')}`);
      if (arrow) arrow.style.transform = 'rotate(180deg)';
    }
  });
}

/* ══════════════════════════════════════
   8. INIT LAYOUT
══════════════════════════════════════ */
function initLayout() {
  if (!checkAuth()) return;

  injectStyles();
  _buildDrawer();

  const userData = getUserData();
  const _fn = userData?.firstName || userData?.first_name || userData?.FirstName || '';
  const _ln = userData?.lastName  || userData?.last_name  || userData?.LastName  || '';
  const userName = (_fn + ' ' + _ln).trim() || userData?.email?.split('@')[0] || '—';
  const userRole = userData?.role  || '—';
  const initials = (_fn.charAt(0) + _ln.charAt(0)).toUpperCase() || (userName !== '—' ? userName.slice(0, 2).toUpperCase() : '؟');

  _fillDrawer(userName, userRole, initials);

  const roleLabels = { Admin:'مدير النظام', BookingManager:'مدير الحجوزات', SiteEngineer:'مهندس الموقع' };
  const roleLabel = roleLabels[userRole] || userRole;

  // فلترة الصفحات بناءً على دور المستخدم
  const allowedNav = LAYOUT_CONFIG.nav.filter(item => {
    if (item.children) {
      return item.children.some(c => { const pr = _PAGE_ROLES[c.id]; return !pr || pr.includes(userRole); });
    }
    const pr = _PAGE_ROLES[item.id];
    return !pr || pr.includes(userRole);
  });

  const navHTML = allowedNav.map(item => {
    if (!item.children) {
      return `<button class="nav-tab" data-page="${item.id}" onclick="navigate('${item.id}')" title="${item.label}">
        <i class="${item.icon}"></i><span>${item.label}</span>
        ${item.id === 'sellrequests' ? '<span class="nav-sr-badge hidden" id="nav-sr-badge-hdr"></span>' : ''}
        ${item.id === 'tickets'      ? '<span class="nav-tk-badge hidden" id="nav-tk-badge-hdr"></span>' : ''}
      </button>`;
    }
    const visKids = item.children.filter(c => { const pr = _PAGE_ROLES[c.id]; return !pr || pr.includes(userRole); });
    if (!visKids.length) return '';
    const grpHasSr = visKids.some(c => c.id === 'sellrequests');
    const grpHasTk = visKids.some(c => c.id === 'tickets');
    return `<div class="nav-group" id="nav-grp-${item.id}" data-group="${item.id}">
      <button class="nav-tab nav-grp-btn" onclick="_lytGrpToggle('${item.id}')" title="${item.label}">
        <i class="${item.icon}"></i><span>${item.label}</span>
        ${grpHasSr ? '<span class="nav-sr-badge hidden"></span>' : ''}
        ${grpHasTk ? '<span class="nav-tk-badge hidden"></span>' : ''}
        <svg class="nav-grp-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
      <div class="nav-dd" id="nav-dd-${item.id}">
        ${visKids.map(c => `
          <button class="nav-dd-item" data-page="${c.id}" onclick="_lytDdGo('${c.id}')">
            <span class="nav-dd-item-icon"><i class="${c.icon}"></i></span>
            <span>${c.label}</span>
            ${c.id === 'sellrequests' ? '<span class="nav-sr-badge hidden"></span>' : ''}
            ${c.id === 'tickets' ? '<span class="nav-tk-badge hidden"></span>' : ''}
          </button>`).join('')}
      </div>
    </div>`;
  }).join('');

  const brandName = window.BRAND?.companyName || LAYOUT_CONFIG.appName;
  const logoContent = window.BRAND?.logoUrl
    ? `<img src="${window.BRAND.logoUrl}" alt="${brandName}" style="height:36px;max-width:160px;object-fit:contain;vertical-align:middle;">`
    : brandName;

  const headerHTML = `
    <div class="header-right">
      <a class="header-logo" href="#dashboard" onclick="navigate('dashboard');return false;">
        ${logoContent}
      </a>
    </div>

    <nav class="header-nav" id="header-nav">${navHTML}</nav>

    <div class="header-left">
      <div class="header-actions">
        <div class="header-icon-wrap" id="header-settings-wrap">
          <button class="header-icon-btn" id="header-settings-btn" title="الإعدادات">
            <i class="ri-settings-3-line"></i>
          </button>
          <div class="header-icon-dd" id="header-settings-dd">
            ${LAYOUT_CONFIG.systemMenu.map(m => `
              <button class="header-icon-dd-item" data-page="${m.id}" onclick="_lytSettingsGo('${m.id}')">
                <span class="header-icon-dd-icon"><i class="${m.icon}"></i></span>
                <span>${m.label}</span>
              </button>`).join('')}
          </div>
        </div>
        <!-- Notification bell injected here by initNotificationBell -->
      </div>

      <div class="header-divider-v"></div>

      <div class="header-user-wrap" id="header-user-wrap">
        <div class="header-user" id="header-user-btn" title="${userName} — ${roleLabel}">
          <div class="user-avatar">${initials}</div>
          <span class="user-name">${userName}</span>
          <i class="ri-arrow-down-s-line header-user-arrow"></i>
        </div>
        <div class="header-user-dd" id="header-user-dd">
          <div class="header-user-dd-head">
            <div class="user-avatar">${initials}</div>
            <div style="min-width:0">
              <div class="header-user-dd-name">${userName}</div>
              <div class="header-user-dd-role">${roleLabel}</div>
            </div>
          </div>
          <button class="header-user-dd-logout" onclick="handleLogout()">
            <i class="ri-logout-box-r-line"></i> تسجيل الخروج
          </button>
        </div>
      </div>

      <button class="lyt-hamburger" onclick="openDrawer()" aria-label="القائمة">
        <span></span><span></span><span></span>
      </button>
    </div>
  `;

  const header = document.getElementById('app-header');
  if (header) header.innerHTML = headerHTML;
  document.title = window.BRAND?.companyName || LAYOUT_CONFIG.appName;

  /* Expose LAYOUT_CONFIG globally for command-palette */
  window.LAYOUT_CONFIG = LAYOUT_CONFIG;

  /* Initialize notification bell (after header is rendered) */
  setTimeout(() => { window.initNotificationBell?.(); }, 100);

  /* Settings dropdown toggle + click outside */
  setTimeout(() => {
    const btn = document.getElementById('header-settings-btn');
    const dd  = document.getElementById('header-settings-dd');
    if (btn && dd) {
      btn.onclick = (e) => {
        e.stopPropagation();
        const willOpen = !dd.classList.contains('show');
        dd.classList.toggle('show');
        btn.classList.toggle('active', willOpen);
      };
      document.addEventListener('click', (e) => {
        if (!dd.contains(e.target) && !btn.contains(e.target)) {
          dd.classList.remove('show');
          btn.classList.remove('active');
        }
      });
    }

    /* User pill dropdown (logout) */
    const uWrap = document.getElementById('header-user-wrap');
    const uBtn  = document.getElementById('header-user-btn');
    const uDd   = document.getElementById('header-user-dd');
    if (uWrap && uBtn && uDd) {
      uBtn.onclick = (e) => {
        e.stopPropagation();
        const willOpen = !uDd.classList.contains('show');
        uDd.classList.toggle('show', willOpen);
        uWrap.classList.toggle('open', willOpen);
      };
      document.addEventListener('click', (e) => {
        if (!uDd.contains(e.target) && !uBtn.contains(e.target)) {
          uDd.classList.remove('show');
          uWrap.classList.remove('open');
        }
      });
    }
  }, 120);

  // تطبيق class للمستخدمين غير الأدمن — يخفي أزرار الحذف عبر CSS
  if (userRole !== 'Admin' && userRole !== '1') {
    document.body.classList.add('non-admin');
  } else {
    document.body.classList.remove('non-admin');
  }
}

/* ══════════════════════════════════════
   9. NAVIGATION SYNC (التنقل الفعلي في router.js)
   window.navigate مُعرَّفة في router.js وتُغطي هذه الدالة
══════════════════════════════════════ */
function _syncNav(pageId) {
  // standalone tabs
  document.querySelectorAll('.nav-tab:not(.nav-grp-btn)').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === pageId);
  });
  // dropdown items
  document.querySelectorAll('.nav-dd-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === pageId);
  });
  // group button — active if any child matches
  document.querySelectorAll('.nav-group').forEach(grp => {
    const hit = grp.querySelector(`.nav-dd-item[data-page="${pageId}"]`);
    grp.classList.toggle('has-active', !!hit);
  });
  _syncDrawer(pageId);
}

/* ══════════════════════════════════════
   10. KICK OFF
══════════════════════════════════════ */
/* ══════════════════════════════════════
   10a. NAV GROUP ACTIONS
══════════════════════════════════════ */
window._lytGrpToggle = function(groupId) {
  const grp = document.getElementById(`nav-grp-${groupId}`);
  const dd  = document.getElementById(`nav-dd-${groupId}`);
  if (!grp || !dd) return;
  const isOpen = grp.classList.contains('open');
  // close all
  document.querySelectorAll('.nav-group.open').forEach(g => {
    g.classList.remove('open');
    document.getElementById(`nav-dd-${g.dataset.group}`)?.classList.remove('show');
  });
  if (!isOpen) { grp.classList.add('open'); dd.classList.add('show'); }
};

window._lytDdGo = function(pageId) {
  document.querySelectorAll('.nav-group.open').forEach(g => {
    g.classList.remove('open');
    document.getElementById(`nav-dd-${g.dataset.group}`)?.classList.remove('show');
  });
  navigate(pageId);
};

window._lytDrawerGrpToggle = function(groupId) {
  const panel = document.getElementById(`lyt-dg-${groupId}`);
  const arrow = document.getElementById(`lyt-dg-arrow-${groupId}`);
  if (!panel) return;
  const open = panel.classList.toggle('open');
  if (arrow) arrow.style.transform = open ? 'rotate(180deg)' : '';
};

// close dropdown on outside click
document.addEventListener('click', function(e) {
  if (!e.target.closest('.nav-group')) {
    document.querySelectorAll('.nav-group.open').forEach(g => {
      g.classList.remove('open');
      document.getElementById(`nav-dd-${g.dataset.group}`)?.classList.remove('show');
    });
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  try { await (window.brandReady || Promise.resolve()); } catch {}
  initLayout();
});

/* ══════════════════════════════════════
   11. SELL-REQUESTS NAV BADGE (polling)
══════════════════════════════════════ */
(function _initSrNavBadge() {
  function _getToken() {
    try { return JSON.parse(localStorage.getItem('authData') || '{}').token || null; }
    catch { return null; }
  }

  async function _refreshBadge() {
    const token = _getToken();
    if (!token) return;
    try {
      const r = await fetch(`${API_BASE}/api/SellRequests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!r.ok) return;
      const data = await r.json().catch(() => []);
      const unread = Array.isArray(data) ? data.filter(s => !s.isRead).length : 0;
      document.querySelectorAll('.nav-sr-badge').forEach(el => {
        el.textContent = unread > 99 ? '99+' : String(unread);
        el.classList.toggle('hidden', unread === 0);
      });
    } catch {}
  }

  // مسح الـ badge لما المستخدم يفتح الصفحة
  const _origNavigate = window.navigate;
  window.navigate = function(pageId) {
    if (pageId === 'sellrequests') {
      document.querySelectorAll('.nav-sr-badge').forEach(el => {
        el.textContent = '0';
        el.classList.add('hidden');
      });
    }
    return _origNavigate?.apply(this, arguments);
  };

  // تحديث فوري عبر SignalR عند أي تغيير في طلبات البيع
  window.addEventListener('asas:entityChanged', (e) => {
    const ent = ((e.detail && e.detail.entity) || '').toLowerCase();
    if (ent.includes('sellrequest')) _refreshBadge();
  });

  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      _refreshBadge();
      setInterval(_refreshBadge, 45_000);
    }, 2000);
  });
})();

/* ══════════════════════════════════════
   12. MAINTENANCE TICKETS NAV BADGE
══════════════════════════════════════ */
(function _initTkNavBadge() {
  function _getToken() {
    try { return JSON.parse(localStorage.getItem('authData') || '{}').token || null; }
    catch { return null; }
  }
  async function _refreshTkBadge() {
    const token = _getToken();
    if (!token) return;
    try {
      const r = await fetch(`${API_BASE}/api/MaintenanceTickets`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!r.ok) return;
      const data = await r.json().catch(() => []);
      const items = Array.isArray(data) ? data : (data?.['$values'] || []);
      // Count tickets that need attention: Open + Reopened
      const need = items.filter(t => t.status === 'Open' || t.status === 'Reopened').length;
      document.querySelectorAll('.nav-tk-badge').forEach(el => {
        el.textContent = need > 99 ? '99+' : String(need);
        el.classList.toggle('hidden', need === 0);
      });
    } catch {}
  }
  // تحديث فوري عبر SignalR عند أي تغيير في تذاكر الصيانة
  window.addEventListener('asas:entityChanged', (e) => {
    const ent = ((e.detail && e.detail.entity) || '').toLowerCase();
    if (ent.includes('ticket') || ent.includes('maintenance')) _refreshTkBadge();
  });

  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      _refreshTkBadge();
      setInterval(_refreshTkBadge, 45_000);
    }, 2500);
  });
  // Expose for manual refresh after status change
  window.__refreshTkBadge = _refreshTkBadge;
})();

/* Settings dropdown navigation handler */
window._lytSettingsGo = function(pageId) {
  document.getElementById('header-settings-dd')?.classList.remove('show');
  document.getElementById('header-settings-btn')?.classList.remove('active');
  window.navigate?.(pageId);
};
