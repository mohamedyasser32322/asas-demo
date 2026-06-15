const API_BASE = window.location.origin;

/* ══════════════════════════════════════
   1. AUTH CHECK
══════════════════════════════════════ */
function checkAuth() {
  try {
    const d = JSON.parse(localStorage.getItem('authData') || '{}');
    if (!getToken())                    { window.location.replace('../login.html');  return false; }
    if (d.role !== 'BookingManager')    { window.location.replace('../login.html'); return false; }
    return true;
  } catch {
    window.location.replace('../login.html');
    return false;
  }
}

/* ══════════════════════════════════════
   2. API WRAPPER
══════════════════════════════════════ */
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

window.apiFetch = async function(endpoint, options = {}) {
  const token = getToken();
  if (!token) { handleLogout(); return null; }
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...(options.headers || {})
  };
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    if (response.status === 401) { handleLogout(); return null; }
    if (response.status === 403) { window.location.replace('../login.html'); return null; }
    return response;
  } catch (err) {
    console.error('API Connection Error:', err);
    return null;
  }
};

/* ══════════════════════════════════════
   3. CONFIG
══════════════════════════════════════ */
const LAYOUT_CONFIG = {
  appName: 'منصة Asas',
  nav: [
    { id: 'dashboard', label: 'الرئيسية', icon: 'ri-dashboard-3-line' },
    { id: 'projects',  label: 'المشاريع', icon: 'ri-building-4-line'  },
    {
      id: 'grp-sales', label: 'المبيعات', icon: 'ri-hand-coin-line',
      children: [
        { id: 'reservations', label: 'الحجوزات',    icon: 'ri-calendar-check-line' },
        { id: 'sellrequests', label: 'طلبات البيع', icon: 'ri-hand-coin-line'      },
      ]
    },
    { id: 'buyers',  label: 'المشترين',  icon: 'ri-group-line'             },
    { id: 'tickets', label: 'البلاغات', icon: 'ri-customer-service-2-line' },
  ]
};

/* ══════════════════════════════════════
   4. HELPERS
══════════════════════════════════════ */
function getUserData() {
  try { const d = localStorage.getItem('authData'); return d ? JSON.parse(d) : null; }
  catch { return null; }
}

function handleLogout() {
  ['authData', 'token', 'authToken', 'rememberMe', 'savedEmail']
    .forEach(k => localStorage.removeItem(k));
  try { sessionStorage.clear(); } catch {}
  location.href = '../login.html';
}
window.handleLogout = handleLogout;

/* ══════════════════════════════════════
   TOKEN AUTO-REFRESH
══════════════════════════════════════ */
function _decodeToken() {
  try {
    const token = getToken();
    if (!token) return null;
    return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
  } catch { return null; }
}

function _getExpiry() {
  const p = _decodeToken();
  return p?.exp ? p.exp * 1000 : null;
}

let _warnedExpiry  = false;
let _refreshing    = false;
let _refreshFailed = false;

async function _tryRefresh() {
  if (_refreshing || _refreshFailed) return;
  _refreshing = true;
  try {
    const stored   = JSON.parse(localStorage.getItem('authData') || '{}');
    const oldToken = stored.token;
    if (!oldToken) { _refreshing = false; return; }

    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${oldToken}` },
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

  if (remaining < 3 * 60 * 1000 && !_refreshFailed) {
    _tryRefresh();
    return;
  }

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

/* ══════════════════════════════════════
   5. CSS
══════════════════════════════════════ */
function injectStyles() {
  const styleId = 'layout-bm-styles';
  if (document.getElementById(styleId)) return;
  const css = `
    .page-content {
      animation: lyt-slide-in 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      will-change: transform, opacity;
    }
    @keyframes lyt-slide-in {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0);    }
    }
    #app-header {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      gap: 12px !important;
    }
    .header-right { display:flex; align-items:center; gap:14px; flex-shrink:0; min-width:0; }
    .header-nav { display:flex; align-items:center; gap:20px; flex:1; justify-content:center; padding:0 32px; }
    .nav-tab, .header-nav .nav-tab { padding:8px 14px !important; font-size:0.88rem !important; gap:7px !important; }

    /* ── Nav Groups (dropdown) ── */
    .nav-group { position: relative; }
    .nav-grp-btn { display: inline-flex !important; align-items: center !important; gap: 6px !important; }
    .nav-grp-arrow {
      opacity: .55; transition: transform .22s ease, opacity .22s ease;
      flex-shrink: 0; margin-right: 2px;
    }
    .nav-group:hover .nav-grp-arrow { opacity: 1; }
    .nav-group.open .nav-grp-arrow { transform: rotate(180deg); opacity: 1; }

    .nav-dd {
      display: none; position: absolute;
      top: calc(100% + 8px); right: 0;
      min-width: 240px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px; padding: 6px;
      box-shadow:
        0 0 0 1px rgba(0,0,0,.05),
        0 20px 50px rgba(0,0,0,.4),
        0 4px 14px rgba(0,0,0,.15);
      backdrop-filter: blur(28px) saturate(180%);
      -webkit-backdrop-filter: blur(28px) saturate(180%);
      z-index: 600;
    }
    .nav-dd.show { display: block; animation: nav-dd-in .18s cubic-bezier(.16,1,.3,1); }
    @keyframes nav-dd-in {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .nav-dd-item {
      display: flex; align-items: center; gap: 12px;
      width: 100%; padding: 9px 10px; border-radius: 8px;
      color: var(--light); font-family: 'Tajawal', inherit;
      font-size: .89rem; font-weight: 600; cursor: pointer;
      border: none; background: none; text-align: right;
      transition: background .14s, color .14s;
      white-space: nowrap; position: relative;
    }
    .nav-dd-item + .nav-dd-item { margin-top: 1px; }
    .nav-dd-item:hover { background: var(--hover-tint); }
    .nav-dd-item.active {
      background: rgba(var(--accent-rgb),.13) !important;
      color: var(--accent) !important;
    }
    .nav-dd-item-icon {
      width: 28px; height: 28px;
      display: inline-flex; align-items: center; justify-content: center;
      flex-shrink: 0; color: var(--text-muted); transition: color .14s;
    }
    .nav-dd-item-icon i { font-size: 1.05rem; }
    .nav-dd-item:hover .nav-dd-item-icon,
    .nav-dd-item.active .nav-dd-item-icon { color: var(--accent); }
    .header-left { display:flex; align-items:center; gap:10px; flex-shrink:0; }

    /* Hamburger */
    .lyt-hamburger {
      display:none; flex-direction:column; justify-content:center; align-items:center;
      gap:5px; width:38px; height:38px; border-radius:9px;
      background:rgba(var(--fg-rgb), 0.06); border:1px solid rgba(var(--fg-rgb), 0.09);
      cursor:pointer; flex-shrink:0; transition:all 0.2s ease;
    }
    .lyt-hamburger:hover { background:rgba(var(--fg-rgb), 0.11); border-color:rgba(var(--fg-rgb), 0.18); }
    .lyt-hamburger span {
      display:block; width:18px; height:2px; background:var(--light);
      border-radius:2px; transition:all 0.28s cubic-bezier(0.4,0,0.2,1);
      transform-origin:center; pointer-events:none;
    }
    .lyt-hamburger.open span:nth-child(1) { transform:translateY(7px) rotate(45deg); }
    .lyt-hamburger.open span:nth-child(2) { opacity:0; transform:scaleX(0); }
    .lyt-hamburger.open span:nth-child(3) { transform:translateY(-7px) rotate(-45deg); }

    /* Drawer */
    #lyt-overlay {
      display:none; position:fixed; inset:0; background:rgba(0,0,0,0.62);
      z-index:1000; backdrop-filter:blur(4px); opacity:0; transition:opacity 0.28s ease;
    }
    #lyt-overlay.open { display:block; opacity:1; }
    #lyt-drawer {
      position:fixed; top:0; right:0; bottom:0; width:268px; max-width:82vw;
      z-index:1001; background:rgba(var(--bg-rgb),0.99);
      border-left:1px solid rgba(var(--fg-rgb), 0.07);
      display:flex; flex-direction:column;
      transform:translateX(110%); transition:transform 0.32s cubic-bezier(0.4,0,0.2,1);
      backdrop-filter:blur(24px); overflow-y:auto;
    }
    #lyt-drawer.open { transform:translateX(0); }
    .lyt-d-head {
      padding:18px 18px 14px; border-bottom:1px solid rgba(var(--fg-rgb), 0.07);
      display:flex; align-items:center; justify-content:space-between; flex-shrink:0;
    }
    .lyt-d-logo { font-size:1.05rem; font-weight:800; color:#fff; max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .lyt-d-close {
      width:30px; height:30px; border-radius:8px;
      background:rgba(var(--fg-rgb), 0.05); border:1px solid rgba(var(--fg-rgb), 0.08);
      color:rgba(var(--fg-rgb), 0.45); cursor:pointer; font-size:1.05rem;
      display:flex; align-items:center; justify-content:center; transition:all 0.18s ease;
    }
    .lyt-d-close:hover { color:#fff; background:rgba(var(--fg-rgb), 0.1); }
    .lyt-d-user {
      padding:14px 18px; border-bottom:1px solid rgba(var(--fg-rgb), 0.07);
      display:flex; align-items:center; gap:11px; flex-shrink:0;
    }
    .lyt-d-avatar {
      width:38px; height:38px; border-radius:50%;
      background:linear-gradient(135deg,var(--accent),var(--accent-dark));
      display:flex; align-items:center; justify-content:center;
      font-size:0.85rem; font-weight:800; color:#fff;
      border:2px solid rgba(var(--fg-rgb), 0.14); flex-shrink:0;
    }
    .lyt-d-uname { font-size:0.88rem; font-weight:700; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .lyt-d-role  { font-size:0.7rem; color:#ffcc00; margin-top:2px; }
    .lyt-d-nav { flex:1; padding:10px; display:flex; flex-direction:column; gap:3px; }
    .lyt-d-item {
      display:flex; align-items:center; gap:12px; padding:11px 13px;
      border-radius:11px; cursor:pointer; color:rgba(var(--fg-rgb), 0.5);
      font-size:0.92rem; font-weight:600; border:1px solid transparent;
      transition:all 0.18s ease; background:none;
      font-family:'Tajawal',inherit; width:100%; text-align:right;
    }
    /* User pill = dropdown trigger (logout inside) — موحّد مع الأدمن */
    .header-user-wrap { position:relative; flex-shrink:0; }
    .header-user {
      display:flex; align-items:center; gap:9px; height:38px;
      padding:0 12px 0 5px;
      background:var(--surface-tint); border:1px solid var(--border);
      border-radius:19px; cursor:pointer; transition:all .22s;
    }
    .header-user:hover, .header-user-wrap.open .header-user {
      background:var(--hover-tint); border-color:var(--border-hover);
    }
    .header-user .user-avatar { width:28px; height:28px; font-size:.78rem; }
    .header-user-arrow { font-size:1rem; color:var(--text-muted); flex-shrink:0; transition:transform .2s ease; }
    .header-user-wrap.open .header-user-arrow { transform:rotate(180deg); }
    .header-user-dd {
      display:none; position:absolute; top:calc(100% + 10px); left:0; min-width:232px;
      background:linear-gradient(180deg, color-mix(in srgb, var(--card-bg) 96%, #fff 4%), var(--card-bg));
      border:1px solid var(--border-hover); border-radius:16px; padding:7px;
      box-shadow:0 0 0 1px rgba(0,0,0,.04), 0 24px 56px rgba(0,0,0,.5), 0 6px 16px rgba(0,0,0,.18);
      backdrop-filter:blur(30px) saturate(180%); -webkit-backdrop-filter:blur(30px) saturate(180%); z-index:999;
    }
    .header-user-dd::before {
      content:''; position:absolute; top:-6px; left:26px; width:12px; height:12px;
      background:color-mix(in srgb, var(--card-bg) 96%, #fff 4%);
      border-left:1px solid var(--border-hover); border-top:1px solid var(--border-hover);
      transform:rotate(45deg); border-radius:3px 0 0 0;
    }
    .header-user-dd.show { display:block; }
    .header-user-dd-head { display:flex; align-items:center; gap:11px; padding:9px 10px 12px; margin-bottom:6px; border-bottom:1px solid var(--border); }
    .header-user-dd-head .user-avatar { width:38px; height:38px; font-size:.85rem; }
    .header-user-dd-name { font-size:.88rem; font-weight:700; color:var(--light); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:150px; }
    .header-user-dd-role { font-size:.72rem; color:#ffcc00; margin-top:2px; }
    .header-user-dd-logout {
      display:flex; align-items:center; gap:10px; width:100%; padding:10px 12px; border-radius:11px;
      background:rgba(255,59,48,0.08); color:#ff7066; border:1px solid rgba(255,59,48,0.2);
      cursor:pointer; font-family:'Tajawal',inherit; font-size:.88rem; font-weight:700; text-align:right; transition:all .18s ease;
    }
    .header-user-dd-logout:hover { background:rgba(255,59,48,0.18); border-color:rgba(255,59,48,0.4); }
    .header-user-dd-logout i { font-size:1.1rem; }
    .lyt-d-item i { font-size:1.1rem; flex-shrink:0; width:20px; text-align:center; }
    .lyt-d-item:hover { color:#fff; background:rgba(var(--fg-rgb), 0.06); border-color:rgba(var(--fg-rgb), 0.08); }
    .lyt-d-item.active { color:var(--accent); background:rgba(var(--accent-rgb),0.12); border-color:rgba(var(--accent-rgb),0.22); }
    .lyt-d-foot { padding:12px 10px; border-top:1px solid rgba(var(--fg-rgb), 0.07); flex-shrink:0; }
    .lyt-d-logout {
      display:flex; align-items:center; gap:10px; padding:11px 13px; border-radius:11px;
      background:rgba(255,59,48,0.08); color:#ff3b30; border:1px solid rgba(255,59,48,0.18);
      cursor:pointer; font-family:'Tajawal',inherit; font-size:0.9rem; font-weight:700;
      transition:all 0.18s ease; width:100%;
    }
    .lyt-d-logout:hover { background:rgba(255,59,48,0.18); }
    .bm-role-badge {
      display:inline-flex; align-items:center; gap:5px; font-size:0.72rem; font-weight:700;
      color:#ffcc00; background:rgba(255,204,0,0.1); border:1px solid rgba(255,204,0,0.28);
      padding:3px 10px; border-radius:20px; white-space:nowrap;
    }
    @media(max-width:1100px) {
      .header-nav .nav-tab span { display:none; }
      .header-nav .nav-tab { padding:8px 10px; }
    }
    @media(max-width:768px) {
      #app-header { padding:0 14px !important; gap:8px !important; }
      .header-nav,.header-user-wrap { display:none !important; }
      .lyt-hamburger { display:flex !important; }
      .header-right { width:auto !important; min-width:0 !important; }
      .header-left  { width:auto !important; flex-shrink:1 !important; }
    }
    @media(min-width:1600px) {
      #app-main { max-width:1600px; margin-right:auto; margin-left:auto; }
    }
    @media(min-width:2000px) {
      #app-main { max-width:1900px; }
    }

    /* ── Sell-requests nav badge ── */
    @keyframes sr-bdg-ring {
      0%,100% { box-shadow:0 0 0 0 rgba(255,59,48,.75); }
      50%      { box-shadow:0 0 0 5px rgba(255,59,48,0); }
    }
    .nav-sr-badge {
      display:inline-flex; align-items:center; justify-content:center;
      min-width:17px; height:17px; padding:0 4px;
      border-radius:20px; background:#ff3b30; color:#fff;
      font-size:.62rem; font-weight:800; margin-right:5px; line-height:1;
      animation:sr-bdg-ring 1.8s ease-in-out infinite; flex-shrink:0;
    }
    .nav-sr-badge.hidden { display:none !important; }
    .lyt-d-item .nav-sr-badge { min-width:19px; height:19px; font-size:.68rem; margin-right:0; margin-left:auto; }

    /* ── Tickets nav badge ── */
    @keyframes tk-bdg-pulse {
      0%,100% { box-shadow:0 0 0 0 rgba(255,59,48,.75); }
      50%      { box-shadow:0 0 0 5px rgba(255,59,48,0); }
    }
    .nav-tk-badge {
      display:inline-flex; align-items:center; justify-content:center;
      min-width:17px; height:17px; padding:0 4px;
      border-radius:20px; background:#ff3b30; color:#fff;
      font-size:.62rem; font-weight:800; margin-right:5px; line-height:1;
      animation:tk-bdg-pulse 1.8s ease-in-out infinite; flex-shrink:0;
    }
    .nav-tk-badge.hidden { display:none !important; }
    .lyt-d-item .nav-tk-badge { min-width:19px; height:19px; font-size:.68rem; margin-right:0; margin-left:auto; }
  `;
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = css;
  document.head.appendChild(style);
}

/* ══════════════════════════════════════
   6. DRAWER
══════════════════════════════════════ */
function _buildDrawer() {
  if (document.getElementById('lyt-drawer')) return;
  const overlay = document.createElement('div');
  overlay.id = 'lyt-overlay';
  overlay.onclick = closeDrawer;
  document.body.appendChild(overlay);
  const panel = document.createElement('nav');
  panel.id = 'lyt-drawer';
  panel.innerHTML = `
    <div class="lyt-d-head">
      <span class="lyt-d-logo">${window.BRAND?.companyName || LAYOUT_CONFIG.appName}</span>
      <button class="lyt-d-close" onclick="closeDrawer()"><i class="ri-close-line"></i></button>
    </div>
    <div class="lyt-d-user">
      <div class="lyt-d-avatar" id="lyt-d-avatar">؟</div>
      <div style="min-width:0">
        <div class="lyt-d-uname" id="lyt-d-uname">—</div>
        <div class="lyt-d-role">مدير الحجوزات</div>
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
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
}

function _fillDrawer(userName, initials) {
  const av = document.getElementById('lyt-d-avatar');
  const un = document.getElementById('lyt-d-uname');
  if (av) av.textContent = initials;
  if (un) un.textContent = userName;
  const nav = document.getElementById('lyt-d-nav');
  if (!nav) return;
  nav.innerHTML = LAYOUT_CONFIG.nav.map(item => `
    <button class="lyt-d-item" data-page="${item.id}" onclick="window._lytNavDrawer('${item.id}')">
      <i class="${item.icon}"></i><span>${item.label}</span>
      ${item.id === 'sellrequests' ? '<span class="nav-sr-badge hidden" id="nav-sr-badge-drw"></span>' : ''}
      ${item.id === 'tickets'      ? '<span class="nav-tk-badge hidden" id="nav-tk-badge-drw"></span>'  : ''}
    </button>
  `).join('');
}

/* ══════════════════════════════════════
   7. DRAWER ACTIONS
══════════════════════════════════════ */
window.openDrawer  = function() {
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
  window.navigate(pageId);   // يستخدم navigate من router.js
};

/* ══════════════════════════════════════
   8. SYNC NAV (يُستدعى من router.js)
══════════════════════════════════════ */
window.__syncNav = function(pageId) {
  // Header tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.page === pageId);
  });
  // Drawer items
  document.querySelectorAll('.lyt-d-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === pageId);
  });
  // Title
  const info = LAYOUT_CONFIG.nav.find(n => n.id === pageId);
  const titleEl = document.getElementById('header-page-title');
  if (titleEl && info) titleEl.textContent = info.label;
};

/* ══════════════════════════════════════
   9. BUILD HEADER
══════════════════════════════════════ */
function initLayout() {
  if (!checkAuth()) return;
  injectStyles();
  _buildDrawer();

  const userData  = getUserData();
  const _fn       = userData?.firstName || userData?.first_name || userData?.FirstName || '';
  const _ln       = userData?.lastName  || userData?.last_name  || userData?.LastName  || '';
  const userName  = (_fn + ' ' + _ln).trim()
                 || (userData?.email ? userData.email.split('@')[0] : '—');
  const initials  = (_fn.charAt(0) + _ln.charAt(0)).toUpperCase()
                 || (userName !== '—' ? userName.slice(0, 2).toUpperCase() : '؟');

  _fillDrawer(userName, initials);

  const navHTML = LAYOUT_CONFIG.nav.map(item => {
    if (!item.children) {
      return `<button class="nav-tab" data-page="${item.id}" onclick="window.navigate('${item.id}')" title="${item.label}">
        <i class="${item.icon}"></i><span>${item.label}</span>
        ${item.id === 'sellrequests' ? '<span class="nav-sr-badge hidden" id="nav-sr-badge-hdr"></span>' : ''}
        ${item.id === 'tickets'      ? '<span class="nav-tk-badge hidden" id="nav-tk-badge-hdr"></span>' : ''}
      </button>`;
    }
    return `<div class="nav-group" id="nav-grp-${item.id}" data-group="${item.id}">
      <button class="nav-tab nav-grp-btn" onclick="_lytGrpToggle('${item.id}')" title="${item.label}">
        <i class="${item.icon}"></i><span>${item.label}</span>
        <svg class="nav-grp-arrow" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
      <div class="nav-dd" id="nav-dd-${item.id}">
        ${item.children.map(c => `
          <button class="nav-dd-item" data-page="${c.id}" onclick="_lytDdGo('${c.id}')">
            <span class="nav-dd-item-icon"><i class="${c.icon}"></i></span>
            <span>${c.label}</span>
            ${c.id === 'sellrequests' ? '<span class="nav-sr-badge hidden" id="nav-sr-badge-hdr"></span>' : ''}
            ${c.id === 'tickets'      ? '<span class="nav-tk-badge hidden" id="nav-tk-badge-hdr"></span>' : ''}
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
      <a class="header-logo" href="#dashboard" onclick="window.navigate('dashboard');return false;">
        ${logoContent}
      </a>
    </div>
    <nav class="header-nav" id="header-nav">${navHTML}</nav>
    <div class="header-left">
      <div class="header-user-wrap" id="header-user-wrap">
        <div class="header-user" id="header-user-btn" title="${userName} — مدير الحجوزات">
          <div class="user-avatar">${initials}</div>
          <span class="user-name">${userName}</span>
          <i class="ri-arrow-down-s-line header-user-arrow"></i>
        </div>
        <div class="header-user-dd" id="header-user-dd">
          <div class="header-user-dd-head">
            <div class="user-avatar">${initials}</div>
            <div style="min-width:0">
              <div class="header-user-dd-name">${userName}</div>
              <div class="header-user-dd-role">مدير الحجوزات</div>
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

  /* Initialize notification bell after header rendered */
  setTimeout(() => { window.initNotificationBell?.(); }, 100);

  /* User pill dropdown (logout) */
  setTimeout(() => {
    const uWrap = document.getElementById('header-user-wrap');
    const uBtn  = document.getElementById('header-user-btn');
    const uDd   = document.getElementById('header-user-dd');
    if (uWrap && uBtn && uDd) {
      uBtn.onclick = (e) => {
        e.stopPropagation();
        const open = !uDd.classList.contains('show');
        uDd.classList.toggle('show', open);
        uWrap.classList.toggle('open', open);
      };
      document.addEventListener('click', (e) => {
        if (!uDd.contains(e.target) && !uBtn.contains(e.target)) {
          uDd.classList.remove('show'); uWrap.classList.remove('open');
        }
      });
    }
  }, 120);
}

window.addEventListener('DOMContentLoaded', async () => {
  try { await (window.brandReady || Promise.resolve()); } catch {}
  initLayout();
});

/* ══════════════════════════════════════
   10. SELL-REQUESTS NAV BADGE (polling)
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

  // مسح الـ badge لما المستخدم يفتح صفحة طلبات البيع
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
   11. TICKETS NAV BADGE (polling)
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
      const list  = Array.isArray(data) ? data : (data?.['$values'] ?? []);
      const open  = list.filter(t => t.status === 'Open' || t.status === 0).length;
      document.querySelectorAll('.nav-tk-badge').forEach(el => {
        el.textContent = open > 99 ? '99+' : String(open);
        el.classList.toggle('hidden', open === 0);
      });
    } catch {}
  }

  window.__refreshTkBadge = _refreshTkBadge;

  // مسح الـ badge لما المستخدم يفتح صفحة تذاكر الصيانة
  const _origNavBm = window.navigate;
  window.navigate = function(pageId) {
    if (pageId === 'tickets') {
      document.querySelectorAll('.nav-tk-badge').forEach(el => {
        el.textContent = '0'; el.classList.add('hidden');
      });
    }
    return _origNavBm?.apply(this, arguments);
  };

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
})();
/* ── Nav group dropdown handlers ── */
window._lytGrpToggle = function(groupId) {
  const grp = document.getElementById('nav-grp-' + groupId);
  const dd  = document.getElementById('nav-dd-' + groupId);
  if (!grp || !dd) return;
  document.querySelectorAll('.nav-group').forEach(g => {
    if (g.id !== grp.id) {
      g.classList.remove('open');
      document.getElementById('nav-dd-' + g.dataset.group)?.classList.remove('show');
    }
  });
  grp.classList.toggle('open');
  dd.classList.toggle('show');
};

window._lytDdGo = function(pageId) {
  document.querySelectorAll('.nav-group').forEach(g => {
    g.classList.remove('open');
    document.getElementById('nav-dd-' + g.dataset.group)?.classList.remove('show');
  });
  window.navigate?.(pageId);
};

document.addEventListener('click', e => {
  if (!e.target.closest('.nav-group')) {
    document.querySelectorAll('.nav-group').forEach(g => {
      g.classList.remove('open');
      document.getElementById('nav-dd-' + g.dataset.group)?.classList.remove('show');
    });
  }
});

