/* ════════════════════════════════════════════════════════════
   Send Notification — Modal للإدمن يبعت إشعار لموظف/مجموعة/الكل
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const STYLE_ID = 'snd-notif-style';
  if (!document.getElementById(STYLE_ID)) {
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = `
      @keyframes snd-fade { from{opacity:0} to{opacity:1} }
      @keyframes snd-pop  { from{opacity:0;transform:translateY(-12px) scale(.96)} to{opacity:1;transform:translateY(0) scale(1)} }

      #snd-mask {
        position:fixed; inset:0; z-index:99997;
        background:rgba(0,0,0,.6); backdrop-filter:blur(8px);
        display:none; align-items:center; justify-content:center;
        padding:24px 16px;
        animation:snd-fade .2s ease;
      }
      #snd-mask.show { display:flex; }
      #snd-panel {
        width:100%; max-width:560px;
        max-height:calc(100vh - 48px);
        display:flex; flex-direction:column;
        background:var(--card-bg, #112952);
        border:1px solid var(--border-hover, rgba(var(--fg-rgb), .2));
        border-radius:18px; overflow:hidden;
        box-shadow:0 30px 80px rgba(0,0,0,.55);
        animation:snd-pop .24s cubic-bezier(.4,0,.2,1);
      }
      .snd-h {
        padding:18px 22px; border-bottom:1px solid var(--border);
        display:flex; align-items:center; justify-content:space-between;
        flex-shrink:0;
      }
      .snd-h-ttl {
        font-size:1.05rem; font-weight:800; color:var(--light);
        display:flex; align-items:center; gap:9px;
      }
      .snd-h-ttl i { color:var(--accent); font-size:1.15rem; }
      .snd-close {
        width:30px; height:30px; border-radius:8px;
        background:rgba(var(--fg-rgb), .05); border:1px solid var(--border);
        color:var(--text-muted); cursor:pointer;
        display:flex; align-items:center; justify-content:center;
        transition:all .2s;
      }
      .snd-close:hover { background:rgba(255,59,48,.1); color:#ff7066; }

      .snd-body { padding:22px; display:flex; flex-direction:column; gap:16px; overflow-y:auto; flex:1 1 auto; min-height:0; }
      .snd-body::-webkit-scrollbar { width:6px; }
      .snd-body::-webkit-scrollbar-thumb { background:rgba(var(--fg-rgb), .15); border-radius:4px; }

      .snd-field label {
        display:block; font-size:.82rem; font-weight:700;
        color:var(--light); margin-bottom:7px;
      }
      .snd-field label .req { color:#ff7066; }

      .snd-target-tabs { display:flex; flex-wrap:wrap; gap:8px; }
      .snd-tab {
        flex:1 1 auto; min-width:30%;
        padding:9px 10px; border-radius:10px;
        background:var(--surface-tint); border:1.5px solid var(--border);
        color:var(--text-muted); font-family:inherit; font-size:.8rem; font-weight:700;
        cursor:pointer; transition:all .2s; white-space:nowrap;
        display:flex; align-items:center; justify-content:center; gap:6px;
      }
      .snd-tab:hover { color:var(--light); border-color:var(--border-hover); }
      .snd-tab.active { background:rgba(var(--accent-rgb),.15); border-color:var(--accent); color:var(--accent); }
      .snd-tab i { font-size:1rem; }

      .snd-target-content { display:none; }
      .snd-target-content.active { display:block; }

      .snd-select, .snd-textarea {
        width:100%; padding:11px 14px; border-radius:10px;
        background:var(--surface-tint); border:1.5px solid var(--border);
        color:var(--light); font-family:'Tajawal', sans-serif; font-size:.92rem;
        outline:none; transition:border-color .2s; direction:rtl;
      }
      .snd-select:focus, .snd-textarea:focus { border-color:var(--accent); }
      .snd-textarea { min-height:110px; resize:vertical; line-height:1.6; }
      .snd-select option { background:var(--card-bg); color:var(--light); }

      /* User checklist */
      .snd-users-list {
        max-height:220px; overflow-y:auto;
        border:1.5px solid var(--border); border-radius:10px;
        background:var(--surface-tint);
      }
      .snd-users-list::-webkit-scrollbar { width:5px; }
      .snd-users-list::-webkit-scrollbar-thumb { background:rgba(var(--fg-rgb), .1); border-radius:4px; }
      .snd-user-row {
        display:flex; align-items:center; gap:10px; padding:9px 14px;
        cursor:pointer; transition:background .15s;
        border-bottom:1px solid var(--border);
      }
      .snd-user-row:last-child { border-bottom:none; }
      .snd-user-row:hover { background:var(--hover-tint); }
      .snd-user-row input[type="checkbox"] {
        width:17px; height:17px; accent-color:var(--accent); cursor:pointer;
      }
      .snd-user-info { flex:1; min-width:0; }
      .snd-user-name {
        font-size:.88rem; font-weight:700; color:var(--light);
        overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
      }
      .snd-user-role {
        font-size:.7rem; color:var(--text-muted);
        margin-top:2px;
      }
      .snd-users-empty {
        padding:20px; text-align:center;
        color:var(--text-muted); font-size:.85rem;
      }

      .snd-broadcast-box {
        padding:18px; border-radius:11px;
        background:rgba(255,204,0,.07);
        border:1px solid rgba(255,204,0,.2);
        display:flex; gap:12px; align-items:flex-start;
      }
      .snd-broadcast-box i { color:#ffcc00; font-size:1.2rem; margin-top:2px; flex-shrink:0; }
      .snd-broadcast-box-text { font-size:.85rem; color:var(--light); line-height:1.6; }
      .snd-broadcast-box-text strong { color:#ffd84d; }

      .snd-foot {
        padding:14px 22px; border-top:1px solid var(--border);
        display:flex; gap:10px; justify-content:flex-end;
        flex-shrink:0;
      }
      .snd-btn {
        padding:10px 22px; border-radius:10px;
        font-family:'Tajawal', sans-serif; font-size:.9rem; font-weight:700;
        cursor:pointer; transition:all .2s;
        display:inline-flex; align-items:center; gap:7px;
        border:none;
      }
      .snd-btn-cancel {
        background:rgba(var(--fg-rgb), .06); border:1px solid var(--border);
        color:var(--text-muted);
      }
      .snd-btn-cancel:hover { background:rgba(var(--fg-rgb), .1); color:var(--light); }
      .snd-btn-send {
        background:var(--accent); color:#fff;
      }
      .snd-btn-send:hover { background:var(--accent-dark); transform:translateY(-1px); }
      .snd-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; }
    `;
    document.head.appendChild(s);
  }

  let _users = [];
  let _buyers = [];
  let _buyersLoaded = false;
  let _activeTarget = 'specific';  // 'specific' | 'role' | 'all' | 'buyer' | 'allBuyers'
  let _selectedUserIds = new Set();
  let _selectedBuyerIds = new Set();

  async function loadUsers() {
    const token = JSON.parse(localStorage.getItem('authData') || '{}').token;
    if (!token) return [];
    try {
      const r = await fetch('/api/Users', { headers: { 'Authorization': `Bearer ${token}` }});
      if (!r.ok) return [];
      const j = await r.json();
      return Array.isArray(j) ? j : (j.items || j.data || []);
    } catch { return []; }
  }

  async function loadBuyers() {
    const token = JSON.parse(localStorage.getItem('authData') || '{}').token;
    if (!token) return [];
    try {
      const r = await fetch('/api/Buyers', { headers: { 'Authorization': `Bearer ${token}` }});
      if (!r.ok) return [];
      const j = await r.json();
      return Array.isArray(j) ? j : (j.items || j.data || j.value || []);
    } catch { return []; }
  }

  function renderBuyersList(filter = '') {
    const wrap = document.getElementById('snd-buyers-list');
    if (!wrap) return;

    const q = filter.trim().toLowerCase();
    const filtered = _buyers.filter(b => {
      if (!q) return true;
      return String(b.fullName || '').toLowerCase().includes(q)
          || String(b.phoneNumber || '').includes(q);
    });

    if (filtered.length === 0) {
      wrap.innerHTML = `<div class="snd-users-empty">${_buyers.length ? 'لا توجد نتائج' : 'لا يوجد عملاء'}</div>`;
      return;
    }

    wrap.innerHTML = filtered.map(b => {
      const name = b.fullName || `عميل #${b.id}`;
      const phone = b.phoneNumber || '';
      const checked = _selectedBuyerIds.has(b.id) ? 'checked' : '';
      return `
        <label class="snd-user-row">
          <input type="checkbox" data-bid="${b.id}" ${checked}/>
          <div class="snd-user-info">
            <div class="snd-user-name">${escapeHtml(name)}</div>
            <div class="snd-user-role" style="direction:ltr;text-align:right">${escapeHtml(phone)}</div>
          </div>
        </label>
      `;
    }).join('');

    wrap.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        const id = parseInt(cb.dataset.bid);
        if (cb.checked) _selectedBuyerIds.add(id);
        else _selectedBuyerIds.delete(id);
      });
    });
  }

  function renderUsersList(filterRole = '') {
    const wrap = document.getElementById('snd-users-list');
    if (!wrap) return;

    const userData = JSON.parse(localStorage.getItem('authData') || '{}');
    const myId = userData.id;

    const filtered = _users.filter(u => {
      if (u.id === myId) return false;
      if (filterRole && (u.role || u.roleName) !== filterRole) return false;
      return true;
    });

    if (filtered.length === 0) {
      wrap.innerHTML = '<div class="snd-users-empty">لا يوجد موظفين</div>';
      return;
    }

    wrap.innerHTML = filtered.map(u => {
      const name = `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email || `موظف #${u.id}`;
      const role = u.role || u.roleName || '';
      const checked = _selectedUserIds.has(u.id) ? 'checked' : '';
      return `
        <label class="snd-user-row">
          <input type="checkbox" data-uid="${u.id}" ${checked}/>
          <div class="snd-user-info">
            <div class="snd-user-name">${escapeHtml(name)}</div>
            <div class="snd-user-role">${escapeHtml(role)}</div>
          </div>
        </label>
      `;
    }).join('');

    wrap.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        const id = parseInt(cb.dataset.uid);
        if (cb.checked) _selectedUserIds.add(id);
        else _selectedUserIds.delete(id);
      });
    });
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, c =>
      ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  async function setActiveTarget(target) {
    _activeTarget = target;
    document.querySelectorAll('.snd-tab').forEach(t =>
      t.classList.toggle('active', t.dataset.tab === target));
    document.querySelectorAll('.snd-target-content').forEach(c =>
      c.classList.toggle('active', c.dataset.content === target));

    /* Lazy-load customers the first time the buyer tab is opened */
    if (target === 'buyer' && !_buyersLoaded) {
      const wrap = document.getElementById('snd-buyers-list');
      if (wrap) wrap.innerHTML = '<div class="snd-users-empty">جاري التحميل…</div>';
      _buyers = await loadBuyers();
      _buyersLoaded = true;
      const search = document.getElementById('snd-buyer-search');
      renderBuyersList(search ? search.value : '');
    }
  }

  async function open() {
    if (_users.length === 0) {
      _users = await loadUsers();
    }
    _selectedUserIds.clear();
    _selectedBuyerIds.clear();

    let mask = document.getElementById('snd-mask');
    if (!mask) {
      mask = document.createElement('div');
      mask.id = 'snd-mask';
      mask.innerHTML = `
        <div id="snd-panel" onclick="event.stopPropagation()">
          <div class="snd-h">
            <div class="snd-h-ttl"><i class="ri-send-plane-fill"></i> إرسال إشعار</div>
            <button class="snd-close" onclick="window.closeSendNotification()"><i class="ri-close-line"></i></button>
          </div>

          <div class="snd-body">
            <div class="snd-field">
              <label>المُستلِم <span class="req">*</span></label>
              <div class="snd-target-tabs">
                <button class="snd-tab active" data-tab="specific" onclick="window._sndSetTarget('specific')">
                  <i class="ri-user-line"></i> موظف محدد
                </button>
                <button class="snd-tab" data-tab="role" onclick="window._sndSetTarget('role')">
                  <i class="ri-team-line"></i> صلاحية
                </button>
                <button class="snd-tab" data-tab="all" onclick="window._sndSetTarget('all')">
                  <i class="ri-group-line"></i> كل الموظفين
                </button>
                <button class="snd-tab" data-tab="buyer" onclick="window._sndSetTarget('buyer')">
                  <i class="ri-user-star-line"></i> عميل محدد
                </button>
                <button class="snd-tab" data-tab="allBuyers" onclick="window._sndSetTarget('allBuyers')">
                  <i class="ri-megaphone-line"></i> كل العملاء
                </button>
              </div>
            </div>

            <!-- Specific users -->
            <div class="snd-target-content active" data-content="specific">
              <div class="snd-field">
                <label>اختر الموظفين</label>
                <div class="snd-users-list" id="snd-users-list"></div>
              </div>
            </div>

            <!-- By role -->
            <div class="snd-target-content" data-content="role">
              <div class="snd-field">
                <label>اختر الصلاحية</label>
                <select class="snd-select" id="snd-role-select">
                  <option value="">— اختر —</option>
                  <option value="Admin">Admin</option>
                  <option value="BookingManager">مدير الحجوزات</option>
                  <option value="SiteEngineer">مهندس الموقع</option>
                </select>
              </div>
            </div>

            <!-- Broadcast all staff -->
            <div class="snd-target-content" data-content="all">
              <div class="snd-broadcast-box">
                <i class="ri-alert-line"></i>
                <div class="snd-broadcast-box-text">
                  <strong>تنبيه:</strong> سيتم إرسال الإشعار لـ <strong>كل الموظفين</strong> في النظام (ما عدا حسابك) — دون العملاء.
                </div>
              </div>
            </div>

            <!-- Specific buyer -->
            <div class="snd-target-content" data-content="buyer">
              <div class="snd-field">
                <label>اختر العملاء</label>
                <input type="text" class="snd-select" id="snd-buyer-search" placeholder="بحث بالاسم أو الجوال..." style="margin-bottom:8px">
                <div class="snd-users-list" id="snd-buyers-list"></div>
              </div>
            </div>

            <!-- Broadcast all buyers -->
            <div class="snd-target-content" data-content="allBuyers">
              <div class="snd-broadcast-box">
                <i class="ri-alert-line"></i>
                <div class="snd-broadcast-box-text">
                  <strong>تنبيه:</strong> سيتم إرسال الإشعار لـ <strong>كل العملاء</strong> المسجّلين في النظام.
                </div>
              </div>
            </div>

            <div class="snd-field">
              <label>عنوان الإشعار <span class="req">*</span></label>
              <input type="text" class="snd-select" id="snd-title" placeholder="عنوان مختصر يظهر في القائمة" maxlength="120">
            </div>

            <div class="snd-field">
              <label>نص الإشعار <span class="req">*</span></label>
              <textarea class="snd-textarea" id="snd-message" placeholder="اكتب التفاصيل الكاملة للإشعار..." maxlength="1000"></textarea>
            </div>
          </div>

          <div class="snd-foot">
            <button class="snd-btn snd-btn-send" id="snd-send-btn" onclick="window._sndSubmit()">
              <i class="ri-send-plane-fill"></i> إرسال
            </button>
            <button class="snd-btn snd-btn-cancel" onclick="window.closeSendNotification()">إلغاء</button>
          </div>
        </div>
      `;
      mask.addEventListener('click', () => closeSend());
      document.body.appendChild(mask);
    }

    mask.classList.add('show');
    renderUsersList();
    if (_buyersLoaded) renderBuyersList('');
    setActiveTarget('specific');
    setTimeout(() => document.getElementById('snd-title')?.focus(), 100);

    /* Role select handler */
    const roleSelect = document.getElementById('snd-role-select');
    if (roleSelect) roleSelect.onchange = () => renderUsersList(roleSelect.value);

    /* Buyer search handler */
    const buyerSearch = document.getElementById('snd-buyer-search');
    if (buyerSearch) { buyerSearch.value = ''; buyerSearch.oninput = () => renderBuyersList(buyerSearch.value); }
  }

  function closeSend() {
    document.getElementById('snd-mask')?.classList.remove('show');
  }

  async function submit() {
    const title = document.getElementById('snd-title').value.trim();
    const msg   = document.getElementById('snd-message').value.trim();
    if (!title) {
      window.__showToast?.('يرجى كتابة عنوان الإشعار', 'warning');
      return;
    }
    if (!msg) {
      window.__showToast?.('يرجى كتابة نص الإشعار', 'warning');
      return;
    }

    const payload = { title, message: msg };

    if (_activeTarget === 'specific') {
      const ids = Array.from(_selectedUserIds);
      if (ids.length === 0) {
        window.__showToast?.('اختر موظف واحد على الأقل', 'warning');
        return;
      }
      payload.recipientUserIds = ids;
    } else if (_activeTarget === 'role') {
      const role = document.getElementById('snd-role-select').value;
      if (!role) {
        window.__showToast?.('اختر صلاحية', 'warning');
        return;
      }
      payload.targetRole = role;
    } else if (_activeTarget === 'all') {
      payload.broadcastAll = true;
    } else if (_activeTarget === 'buyer') {
      const ids = Array.from(_selectedBuyerIds);
      if (ids.length === 0) {
        window.__showToast?.('اختر عميل واحد على الأقل', 'warning');
        return;
      }
      payload.recipientBuyerIds = ids;
    } else if (_activeTarget === 'allBuyers') {
      payload.broadcastAllBuyers = true;
    }

    const btn = document.getElementById('snd-send-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="ri-loader-4-line" style="animation:spin .7s linear infinite"></i> جاري الإرسال...';

    const token = JSON.parse(localStorage.getItem('authData') || '{}').token;
    try {
      const r = await fetch('/api/Notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        throw new Error(err.message || 'فشل الإرسال');
      }
      const result = await r.json();
      window.__showToast?.(`تم إرسال الإشعار إلى ${result.sent} مستلم`, 'success');
      document.getElementById('snd-title').value = '';
      document.getElementById('snd-message').value = '';
      closeSend();
      window.refreshNotifications?.();
    } catch (e) {
      window.__showToast?.(e.message || 'حدث خطأ غير متوقع', 'error');
      btn.disabled = false;
      btn.innerHTML = '<i class="ri-send-plane-fill"></i> إرسال';
    }
  }

  /* Public API */
  window.openSendNotification  = open;
  window.closeSendNotification = closeSend;
  window._sndSetTarget = setActiveTarget;
  window._sndSubmit = submit;
})();
