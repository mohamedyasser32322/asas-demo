/* ═══════════════════════════════════════════
   LAYOUT.JS — Buyer Panel Shell
   نظام إدارة العقارات — Buyer Panel
   ═══════════════════════════════════════════ */

function getUserData() {
  try { return JSON.parse(localStorage.getItem('authData')) || {}; } catch { return {}; }
}

function getToken() {
  const d = getUserData();
  return d.token || '';
}

function handleLogout() {
  localStorage.removeItem('authData');
  try { sessionStorage.clear(); } catch {}
  window.location.href = '../login.html';
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

function initLayout() {
  const u         = getUserData();
  const firstName = u.firstName || u.first_name || u.FirstName || '';
  const lastName  = u.lastName  || u.last_name  || u.LastName  || '';
  const name      = (firstName + ' ' + lastName).trim()
                  || (u.email || '').split('@')[0]
                  || 'مشتري';
  const initials  = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || name.slice(0, 2).toUpperCase();

  const NAV = [
    { id: 'my-units',  label: 'وحداتي',    icon: 'ri-home-heart-line' },
    { id: 'tickets',   label: 'البلاغات',  icon: 'ri-customer-service-2-line' },
  ];

  const header = document.getElementById('app-header');
  if (!header) return;

  const brandName = window.BRAND?.companyName || 'نظام إدارة العقارات';
  const logoContent = window.BRAND?.logoUrl
    ? `<img src="${window.BRAND.logoUrl}" alt="${brandName}" style="height:36px;max-width:160px;object-fit:contain;vertical-align:middle;">`
    : brandName;

  header.innerHTML = `
    <div class="header-right">
      <a class="header-logo" onclick="navigate('my-units')">${logoContent}</a>
    </div>

    <nav class="header-nav">
      ${NAV.map(n => `
        <button class="nav-tab" data-page="${n.id}" onclick="navigate('${n.id}')">
          <i class="${n.icon}"></i><span>${n.label}</span>
        </button>`).join('')}
    </nav>

    <div class="header-left">
      <!-- جرس الإشعارات يُحقن هنا تلقائياً -->
      <div class="header-user">
        <span class="user-avatar">${initials}</span>
        <span class="user-name">${name}</span>
      </div>
      <button class="logout-btn" onclick="handleLogout()">
        <i class="ri-logout-box-r-line"></i><span>خروج</span>
      </button>
      <button class="hamburger" aria-label="القائمة" onclick="openDrawer()">
        <span></span><span></span><span></span>
      </button>
    </div>
  `;

  /* drawer user info */
  const da = document.getElementById('drawer-avatar');
  const du = document.getElementById('drawer-username');
  const dr = document.getElementById('drawer-role');
  if (da) da.textContent = initials;
  if (du) du.textContent = name;
  if (dr) dr.textContent = 'مشتري';

  /* drawer nav */
  const dn = document.getElementById('drawer-nav');
  if (dn) {
    dn.innerHTML = NAV.map(n => `
      <button class="drawer-nav-item" data-page="${n.id}" onclick="navigateDrawer('${n.id}')">
        <i class="${n.icon}"></i><span>${n.label}</span>
      </button>`).join('');
  }

  setTimeout(() => { window.initNotificationBell?.(); }, 100);
}

function navigateDrawer(pageId) {
  if (typeof closeDrawer === 'function') closeDrawer();
  if (typeof navigate === 'function') navigate(pageId);
}
window.navigateDrawer = navigateDrawer;