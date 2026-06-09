/* ════════════════════════════════════════════════════════════
   Notification Bell — جرس الإشعارات الداخلية
   ─────────────────────────────────────────────────────────────
   يقرأ من /api/Notifications — رسائل من الإدارة للموظفين
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const STYLE_ID = 'notif-bell-style';
  if (!document.getElementById(STYLE_ID)) {
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = `
      .notif-bell-wrap { position:relative; margin-left:8px; }
      .notif-bell-btn {
        width:38px; height:38px; border-radius:10px;
        background:rgba(var(--fg-rgb), .05);
        border:1px solid var(--border, rgba(var(--fg-rgb), .08));
        color:var(--light, #fff); cursor:pointer;
        display:flex; align-items:center; justify-content:center;
        position:relative; transition:all .2s;
        font-size:1.1rem; flex-shrink:0;
      }
      .notif-bell-btn:hover { background:rgba(var(--fg-rgb), .1); border-color:var(--border-hover); }
      .notif-bell-badge {
        position:absolute; top:-3px; left:-3px;
        min-width:18px; height:18px; border-radius:9px;
        background:#ff3b30; color:#fff;
        font-size:.65rem; font-weight:900;
        display:flex; align-items:center; justify-content:center;
        padding:0 4px; box-shadow:0 0 0 2px var(--card-bg, #112952);
        animation:notif-pulse 2s ease-in-out infinite;
      }
      .notif-bell-badge.hidden { display:none; }
      @keyframes notif-pulse {
        0%,100% { transform:scale(1); box-shadow:0 0 0 2px var(--card-bg, #112952), 0 0 0 0 rgba(255,59,48,.5); }
        50%     { transform:scale(1.08); box-shadow:0 0 0 2px var(--card-bg, #112952), 0 0 0 6px rgba(255,59,48,0); }
      }
      @keyframes notif-dropin { from{opacity:0;transform:translateY(-8px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }

      .notif-panel {
        position:fixed; top:64px; left:24px;
        width:380px; max-width:calc(100vw - 32px); max-height:520px;
        background:var(--card-bg, #112952);
        border:1px solid var(--border-hover, rgba(var(--fg-rgb), .2));
        border-radius:14px; overflow:hidden;
        box-shadow:0 24px 60px rgba(0,0,0,.5);
        z-index:9999; display:none; flex-direction:column;
        animation:notif-dropin .2s cubic-bezier(.4,0,.2,1);
      }
      .notif-panel.show { display:flex; }
      .notif-h {
        display:flex; align-items:center; justify-content:space-between;
        padding:14px 18px; border-bottom:1px solid var(--border, rgba(var(--fg-rgb), .08));
      }
      .notif-h-ttl {
        font-size:.95rem; font-weight:800; color:var(--light, #fff);
        display:flex; align-items:center; gap:8px;
      }
      .notif-h-ttl i { color:var(--accent); }
      .notif-h-clear {
        background:none; border:none; color:var(--text-muted, #8fa3c0);
        font-size:.78rem; font-weight:700; cursor:pointer; font-family:inherit;
        padding:4px 10px; border-radius:6px; transition:all .2s;
      }
      .notif-h-clear:hover { background:rgba(var(--fg-rgb), .05); color:var(--light, #fff); }

      .notif-list { flex:1; overflow-y:auto; }
      .notif-list::-webkit-scrollbar { width:5px; }
      .notif-list::-webkit-scrollbar-thumb { background:rgba(var(--fg-rgb), .1); border-radius:4px; }

      .notif-item {
        display:flex; gap:11px; padding:13px 18px;
        border-bottom:1px solid var(--border, rgba(var(--fg-rgb), .06));
        transition:background .15s; position:relative;
      }
      .notif-item:hover { background:rgba(var(--fg-rgb), .03); }
      .notif-item:last-child { border-bottom:none; }
      .notif-item.unread { background:rgba(var(--accent-rgb), .06); }
      .notif-item.unread::before {
        content:''; position:absolute; right:0; top:0; bottom:0;
        width:3px; background:var(--accent);
      }
      .notif-icon {
        width:36px; height:36px; border-radius:50%;
        background:rgba(var(--accent-rgb), .15); color:var(--accent);
        display:flex; align-items:center; justify-content:center;
        font-size:1rem; flex-shrink:0;
      }
      .notif-item { cursor:pointer; }
      .notif-c { flex:1; min-width:0; }
      .notif-title {
        font-size:.9rem; color:var(--light, #fff);
        line-height:1.45; font-weight:800;
        overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
      }
      .notif-preview {
        font-size:.8rem; color:var(--text-muted, #8fa3c0);
        line-height:1.4; font-weight:500; margin-top:3px;
        display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;
        overflow:hidden; word-break:break-word;
      }
      .notif-msg {
        font-size:.88rem; color:var(--light, #fff);
        line-height:1.5; font-weight:600;
        word-break:break-word;
        display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;
        overflow:hidden;
      }
      .notif-chevron {
        align-self:center; color:var(--text-muted, #8fa3c0);
        font-size:1.1rem; flex-shrink:0; opacity:.5; transition:opacity .15s, transform .15s;
      }
      .notif-item:hover .notif-chevron { opacity:1; transform:translateX(-2px); }

      /* ── Full-notification modal ── */
      #notif-modal {
        position:fixed; inset:0; z-index:100000;
        background:rgba(0,0,0,.6); backdrop-filter:blur(8px);
        display:none; align-items:center; justify-content:center; padding:16px;
        animation:notif-dropin .2s ease;
      }
      #notif-modal.show { display:flex; }
      .notif-modal-box {
        width:100%; max-width:480px;
        background:var(--card-bg, #112952);
        border:1px solid var(--border-hover, rgba(var(--fg-rgb), .2));
        border-radius:16px; overflow:hidden;
        box-shadow:0 30px 80px rgba(0,0,0,.55);
        animation:notif-dropin .24s cubic-bezier(.4,0,.2,1);
        display:flex; flex-direction:column; max-height:80vh;
      }
      .notif-modal-h {
        padding:18px 20px; border-bottom:1px solid var(--border, rgba(var(--fg-rgb), .08));
        display:flex; align-items:flex-start; gap:12px;
      }
      .notif-modal-icon {
        width:40px; height:40px; border-radius:11px; flex-shrink:0;
        background:rgba(var(--accent-rgb), .15); color:var(--accent);
        display:flex; align-items:center; justify-content:center; font-size:1.15rem;
      }
      .notif-modal-htext { flex:1; min-width:0; }
      .notif-modal-title { font-size:1.02rem; font-weight:800; color:var(--light, #fff); line-height:1.4; word-break:break-word; }
      .notif-modal-time { font-size:.74rem; color:var(--text-muted, #8fa3c0); margin-top:4px; display:flex; align-items:center; gap:5px; }
      .notif-modal-close {
        width:30px; height:30px; border-radius:8px; flex-shrink:0;
        background:rgba(var(--fg-rgb), .05); border:1px solid var(--border);
        color:var(--text-muted); cursor:pointer;
        display:flex; align-items:center; justify-content:center; transition:all .2s;
      }
      .notif-modal-close:hover { background:rgba(255,59,48,.1); color:#ff7066; }
      .notif-modal-body {
        padding:20px; overflow-y:auto;
        font-size:.92rem; line-height:1.8; color:var(--light, #fff);
        white-space:pre-wrap; word-break:break-word; font-weight:500;
      }
      .notif-meta {
        display:flex; align-items:center; gap:8px;
        font-size:.72rem; color:var(--text-muted, #8fa3c0);
        margin-top:5px;
      }
      .notif-meta i { font-size:.78rem; }

      .notif-empty {
        padding:50px 18px; text-align:center;
        color:var(--text-muted, #8fa3c0); font-size:.88rem;
      }
      .notif-empty i { font-size:2.4rem; opacity:.3; display:block; margin-bottom:10px; }
      .notif-empty p { margin-top:6px; font-size:.78rem; opacity:.7; }

      .notif-footer {
        padding:10px 14px; border-top:1px solid var(--border, rgba(var(--fg-rgb), .08));
        display:flex; gap:8px; justify-content:flex-end;
      }
      .notif-send-btn {
        padding:7px 14px; border-radius:8px;
        background:var(--accent);
        border:none; color:#fff; font-family:inherit;
        font-size:.78rem; font-weight:700; cursor:pointer;
        transition:all .2s; display:inline-flex; align-items:center; gap:6px;
      }
      .notif-send-btn:hover { background:var(--accent-dark); transform:translateY(-1px); }
      .notif-send-btn i { font-size:.9rem; }
    `;
    document.head.appendChild(s);
  }

  let _notifications = [];

  async function fetchNotifications() {
    const token = JSON.parse(localStorage.getItem('authData') || '{}').token;
    if (!token) return { items: [], unread: 0 };

    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [listRes, countRes] = await Promise.all([
        fetch('/api/Notifications?page=1&pageSize=20', { headers }),
        fetch('/api/Notifications/unread-count', { headers })
      ]);
      const list  = listRes.ok ? await listRes.json() : { items: [] };
      const count = countRes.ok ? await countRes.json() : { count: 0 };
      const items = list.items || list.data || (Array.isArray(list) ? list : []);
      return { items, unread: count.count || 0 };
    } catch {
      return { items: [], unread: 0 };
    }
  }

  function formatTime(dateStr) {
    if (!dateStr) return 'الآن';
    // Backend sends UTC. Append Z if timezone marker missing (defensive)
    const s = (typeof dateStr === 'string' && !/[zZ]|[+-]\d\d:?\d\d$/.test(dateStr))
      ? dateStr + 'Z' : dateStr;
    const d = new Date(s);
    let diff = (Date.now() - d.getTime()) / 1000;
    if (diff < 0) diff = 0;
    if (diff < 60)     return 'الآن';
    if (diff < 3600)   return `منذ ${Math.floor(diff/60)} دقيقة`;
    if (diff < 86400)  return `منذ ${Math.floor(diff/3600)} ساعة`;
    if (diff < 604800) return `منذ ${Math.floor(diff/86400)} يوم`;
    return d.toLocaleDateString('ar-SA', { calendar:'gregory', numberingSystem:'latn', day:'numeric', month:'short' });
  }

  function updateBadge(unread) {
    const badge = document.getElementById('notif-badge');
    if (!badge) return;
    if (unread > 0) {
      badge.textContent = unread > 9 ? '9+' : String(unread);
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  function renderPanel() {
    const list = document.getElementById('notif-list');
    if (!list) return;

    if (_notifications.length === 0) {
      list.innerHTML = `
        <div class="notif-empty">
          <i class="ri-notification-off-line"></i>
          <div>لا توجد إشعارات</div>
        </div>`;
      return;
    }

    list.innerHTML = _notifications.map(n => {
      const hasTitle = n.title && String(n.title).trim();
      const head = hasTitle ? n.title : n.message;
      const bodyBlock = hasTitle
        ? `<div class="notif-title">${escapeHtml(head)}</div>
           <div class="notif-preview">${escapeHtml(n.message)}</div>`
        : `<div class="notif-msg">${escapeHtml(n.message)}</div>`;
      return `
      <div class="notif-item ${n.isRead ? '' : 'unread'}" data-id="${n.id}">
        <div class="notif-icon"><i class="ri-mail-line"></i></div>
        <div class="notif-c">
          ${bodyBlock}
          <div class="notif-meta">
            <i class="ri-time-line"></i>
            <span>${formatTime(n.createdAt)}</span>
          </div>
        </div>
        <i class="ri-arrow-left-s-line notif-chevron"></i>
      </div>`;
    }).join('');

    /* Click → open full notification in a modal + mark as read */
    list.querySelectorAll('.notif-item').forEach(el => {
      el.addEventListener('click', async () => {
        const id = el.dataset.id;
        const n  = _notifications.find(x => String(x.id) === String(id));
        if (n) openNotifModal(n);

        const token = JSON.parse(localStorage.getItem('authData') || '{}').token;
        if (!token || (n && n.isRead)) return;
        try {
          await fetch(`/api/Notifications/${id}/read`, {
            method:'PATCH',
            headers:{ 'Authorization':`Bearer ${token}` }
          });
          if (n) n.isRead = true;
          el.classList.remove('unread');
          const r = await fetch('/api/Notifications/unread-count', { headers:{ 'Authorization':`Bearer ${token}` }});
          if (r.ok) { const j = await r.json(); updateBadge(j.count || 0); }
        } catch {}
      });
    });
  }

  /* ── Full-notification modal ── */
  function openNotifModal(n) {
    let modal = document.getElementById('notif-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'notif-modal';
      modal.innerHTML = `
        <div class="notif-modal-box" onclick="event.stopPropagation()">
          <div class="notif-modal-h">
            <div class="notif-modal-icon"><i class="ri-notification-3-fill"></i></div>
            <div class="notif-modal-htext">
              <div class="notif-modal-title" id="notif-modal-title"></div>
              <div class="notif-modal-time"><i class="ri-time-line"></i><span id="notif-modal-time"></span></div>
            </div>
            <button class="notif-modal-close" onclick="window.closeNotifModal()"><i class="ri-close-line"></i></button>
          </div>
          <div class="notif-modal-body" id="notif-modal-body"></div>
        </div>`;
      modal.addEventListener('click', () => closeNotifModal());
      document.body.appendChild(modal);
    }
    const hasTitle = n.title && String(n.title).trim();
    document.getElementById('notif-modal-title').textContent = hasTitle ? n.title : 'إشعار';
    document.getElementById('notif-modal-time').textContent  = formatTime(n.createdAt);
    document.getElementById('notif-modal-body').textContent  = n.message || '';
    modal.classList.add('show');
    closePanel();
  }
  function closeNotifModal() {
    document.getElementById('notif-modal')?.classList.remove('show');
  }
  window.closeNotifModal = closeNotifModal;
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNotifModal(); });

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, c =>
      ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function togglePanel() {
    const panel = document.getElementById('notif-panel');
    if (!panel) return;
    if (panel.classList.contains('show')) closePanel();
    else panel.classList.add('show');
  }
  function closePanel() {
    document.getElementById('notif-panel')?.classList.remove('show');
  }

  async function markAllRead() {
    const token = JSON.parse(localStorage.getItem('authData') || '{}').token;
    if (!token) return;
    try {
      await fetch('/api/Notifications/read-all', {
        method:'PATCH',
        headers:{ 'Authorization':`Bearer ${token}` }
      });
      _notifications.forEach(n => n.isRead = true);
      renderPanel();
      updateBadge(0);
      window.__showToast?.('تم تعليم الكل كمقروء', 'success', 2000);
    } catch {}
  }

  /* Click outside to close */
  document.addEventListener('click', (e) => {
    const panel = document.getElementById('notif-panel');
    const btn   = document.getElementById('notif-bell-btn');
    if (!panel?.classList.contains('show')) return;
    if (!panel.contains(e.target) && !btn?.contains(e.target)) closePanel();
  });

  /* ── Real-time push (from central realtime.js via window event) ── */
  function onRealtimeNotification(notif) {
    if (!notif) return;
    /* Prepend the new notification */
    _notifications = [{
      id:        notif.id,
      title:     notif.title || null,
      message:   notif.message,
      createdAt: notif.createdAt,
      isRead:    false
    }, ..._notifications].slice(0, 20);

    renderPanel();
    updateBadge(_notifications.filter(n => !n.isRead).length);

    const head    = (notif.title && String(notif.title).trim()) ? notif.title : notif.message;
    const preview = String(head).slice(0, 60);
    const more    = String(head).length > 60 ? '…' : '';
    window.__showToast?.(`🔔 ${preview}${more}`, 'info', 4000);
  }
  window.addEventListener('asas:notification', (e) => onRealtimeNotification(e.detail));

  /* ── Public init ── */
  window.initNotificationBell = async function() {
    const headerLeft = document.querySelector('.header-left');
    if (!headerLeft || document.getElementById('notif-bell-wrap')) return;

    /* Check role — only show "إرسال" button for Admin */
    const userData = JSON.parse(localStorage.getItem('authData') || '{}');
    const isAdmin = userData.role === 'Admin' || userData.role === '1' || userData.role === 1;

    const wrap = document.createElement('div');
    wrap.id = 'notif-bell-wrap';
    wrap.className = 'notif-bell-wrap';
    wrap.innerHTML = `
      <button class="notif-bell-btn" id="notif-bell-btn" title="الإشعارات">
        <i class="ri-notification-3-line"></i>
        <span class="notif-bell-badge hidden" id="notif-badge">0</span>
      </button>
    `;
    /* Prefer the action-icons cluster so the bell sits next to settings.
       Fall back to placing it before the user pill (handles both the
       wrapped `.header-user-wrap` and a bare `.header-user`). */
    const actions = headerLeft.querySelector('.header-actions');
    if (actions) {
      actions.appendChild(wrap);
    } else {
      let ref = headerLeft.querySelector('.header-user-wrap') || headerLeft.querySelector('.header-user');
      while (ref && ref.parentElement && ref.parentElement !== headerLeft) ref = ref.parentElement;
      if (ref && ref.parentElement === headerLeft) headerLeft.insertBefore(wrap, ref);
      else headerLeft.prepend(wrap);
    }

    if (!document.getElementById('notif-panel')) {
      const panel = document.createElement('div');
      panel.id = 'notif-panel';
      panel.className = 'notif-panel';
      panel.innerHTML = `
        <div class="notif-h">
          <div class="notif-h-ttl"><i class="ri-notification-3-line"></i> الإشعارات</div>
          <button class="notif-h-clear" onclick="window._notifMarkAllRead()">تعليم الكل كمقروء</button>
        </div>
        <div class="notif-list" id="notif-list"></div>
        ${isAdmin ? `
        <div class="notif-footer">
          <button class="notif-send-btn" onclick="window.openSendNotification?.()">
            <i class="ri-send-plane-line"></i> إرسال إشعار
          </button>
        </div>` : ''}
      `;
      document.body.appendChild(panel);
    }

    document.getElementById('notif-bell-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      togglePanel();
    });

    /* Initial load */
    const { items, unread } = await fetchNotifications();
    _notifications = items;
    renderPanel();
    updateBadge(unread);

    /* Real-time push handled by central realtime.js (asas:notification event) */
    window.AsasRealtime?.start?.();

    /* Fallback polling every 5 minutes (low frequency since SignalR handles live) */
    setInterval(async () => {
      const r = await fetchNotifications();
      _notifications = r.items;
      renderPanel();
      updateBadge(r.unread);
    }, 300_000);
  };

  window._notifMarkAllRead = markAllRead;
  window.closeNotifPanel = closePanel;
  window.refreshNotifications = async () => {
    const r = await fetchNotifications();
    _notifications = r.items;
    renderPanel();
    updateBadge(r.unread);
  };
})();
