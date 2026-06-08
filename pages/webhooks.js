/* ════════════════════════════════════════════════
   webhooks.js — Admin / إدارة الـ Webhooks
   ════════════════════════════════════════════════ */
(function () {
  'use strict';
  window.__pages = window.__pages || {};

  // ── CSS ──────────────────────────────────────────────────────────────────
  const CSS = `
    .wh-wrap { padding: 12px 0 60px; animation: wh-fade .3s ease; }
    @keyframes wh-fade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
    @keyframes spin { to { transform:rotate(360deg) } }
    @keyframes wh-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.85)} }
    @keyframes wh-glow  { 0%,100%{box-shadow:0 0 18px rgba(78,141,245,.18)} 50%{box-shadow:0 0 32px rgba(78,141,245,.38)} }

    .wh-head { display:flex; align-items:center; justify-content:space-between; gap:14px; margin-bottom:28px; }
    .wh-title { font-size:1.45rem; font-weight:800; color:var(--light); display:flex; align-items:center; gap:10px; }
    .wh-title i { color:#4e8df5; }

    .wh-btn { display:inline-flex; align-items:center; gap:8px; padding:10px 20px; border-radius:12px; font-family:inherit; font-size:.86rem; font-weight:700; cursor:pointer; border:none; transition:all .2s; white-space:nowrap; }
    .wh-btn-primary { background:linear-gradient(135deg,#4e8df5,#3a6fd4); color:#fff; box-shadow:0 4px 18px rgba(78,141,245,.35); }
    .wh-btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(78,141,245,.5); }
    .wh-btn-ghost { background:rgba(var(--fg-rgb), .05); color:var(--light); border:1.5px solid rgba(var(--fg-rgb), .1); }
    .wh-btn-ghost:hover { background:rgba(var(--fg-rgb), .1); }
    .wh-btn:disabled { opacity:.5; cursor:not-allowed; transform:none !important; }

    /* ════ CARDS GRID ════ */
    .wh-grid {
      display:grid;
      grid-template-columns:repeat(auto-fill,minmax(340px,1fr));
      gap:18px;
    }

    .wh-card {
      position:relative;
      border-radius:16px;
      overflow:hidden;
      background:var(--card-bg);
      border:1px solid rgba(var(--fg-rgb), .07);
      transition:transform .25s ease, box-shadow .25s ease, border-color .25s ease;
      display:flex; flex-direction:column;
    }
    .wh-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(0,0,0,.4); border-color:rgba(78,141,245,.28); }
    .wh-card.active-card { animation:wh-glow 3s ease-in-out infinite; }
    .wh-card.inactive { opacity:.5; filter:grayscale(.5); }

    /* ── Card Header ── */
    .wh-card-hd {
      padding:18px 18px 14px;
      background:linear-gradient(135deg,rgba(78,141,245,.12) 0%,rgba(167,139,250,.06) 100%);
      border-bottom:1px solid rgba(var(--fg-rgb), .05);
      display:flex; align-items:center; gap:14px;
    }
    .wh-ev-icon {
      width:44px; height:44px; border-radius:13px; flex-shrink:0;
      background:linear-gradient(135deg,#4e8df5,#a78bfa);
      display:flex; align-items:center; justify-content:center;
      font-size:1.25rem; color:var(--light);
      box-shadow:0 6px 18px rgba(78,141,245,.35);
    }
    .wh-card.inactive .wh-ev-icon { background:rgba(var(--fg-rgb), .1); box-shadow:none; }
    .wh-hd-info { flex:1; min-width:0; }
    .wh-card-name {
      font-size:.95rem; font-weight:800; color:#e8f0ff;
      white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
      margin-bottom:4px;
    }
    .wh-event-tag {
      display:inline-flex; align-items:center; gap:5px;
      font-size:.67rem; font-weight:700; color:#7eb3ff;
      background:rgba(78,141,245,.12); border:1px solid rgba(78,141,245,.2);
      padding:2px 9px; border-radius:20px; letter-spacing:.2px;
    }

    .wh-status-pill {
      flex-shrink:0; display:flex; align-items:center; gap:5px;
      padding:4px 11px; border-radius:20px;
      font-size:.7rem; font-weight:800;
    }
    .wh-status-pill.on  { background:rgba(52,199,89,.12); color:#34c759; border:1px solid rgba(52,199,89,.22); }
    .wh-status-pill.off { background:rgba(140,160,180,.07); color:#6a82a0; border:1px solid rgba(140,160,180,.14); }
    .wh-pulse-dot { width:6px; height:6px; border-radius:50%; background:currentColor; flex-shrink:0; }
    .on .wh-pulse-dot { animation:wh-pulse 1.8s ease-in-out infinite; }

    /* ── Card Body ── */
    .wh-card-bd { padding:14px 18px; flex:1; display:flex; flex-direction:column; gap:10px; }

    .wh-card-url {
      display:flex; align-items:center; gap:8px;
      padding:8px 12px; border-radius:10px;
      background:rgba(0,0,0,.2); border:1px solid rgba(var(--fg-rgb), .05);
    }
    .wh-card-url i { color:#4e8df5; font-size:.85rem; flex-shrink:0; }
    .wh-card-url span {
      font-family:monospace; font-size:.74rem; color:#6d8fb0;
      overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
    }

    /* ── Stats row ── */
    .wh-stats {
      display:grid; grid-template-columns:repeat(3,1fr);
      border:1px solid rgba(var(--fg-rgb), .05); border-radius:11px; overflow:hidden;
    }
    .wh-stat {
      padding:10px 8px; text-align:center;
      border-left:1px solid rgba(var(--fg-rgb), .05);
    }
    .wh-stat:last-child { border-left:none; }
    .wh-stat-val { font-size:.82rem; font-weight:800; color:#c8d8f0; }
    .wh-stat-lbl { font-size:.62rem; color:#48607a; margin-top:2px; }

    /* ── Card Footer ── */
    .wh-card-ft {
      padding:10px 18px 12px;
      border-top:1px solid rgba(var(--fg-rgb), .05);
      display:flex; gap:7px;
    }
    .wh-act {
      flex:1; display:inline-flex; align-items:center; justify-content:center; gap:5px;
      padding:7px 6px; border-radius:9px;
      border:1px solid rgba(var(--fg-rgb), .07);
      background:rgba(var(--fg-rgb), .03);
      color:rgba(var(--fg-rgb), .5); font-family:inherit;
      font-size:.74rem; font-weight:700; cursor:pointer; transition:all .18s;
      white-space:nowrap;
    }
    .wh-act:hover { background:rgba(var(--fg-rgb), .09); color:var(--light); }
    .wh-act-test { color:#34c759; border-color:rgba(52,199,89,.2); background:rgba(52,199,89,.04); }
    .wh-act-test:hover { background:rgba(52,199,89,.12); }
    .wh-act-del  { color:#ff3b30; border-color:rgba(255,59,48,.18); background:rgba(255,59,48,.03); }
    .wh-act-del:hover  { background:rgba(255,59,48,.12); }

    /* ── Empty ── */
    .wh-empty { text-align:center; padding:70px 20px; color:#8fa3c0; }
    .wh-empty-icon-wrap {
      width:80px; height:80px; border-radius:22px;
      background:linear-gradient(135deg,rgba(78,141,245,.1),rgba(167,139,250,.08));
      border:1px solid rgba(78,141,245,.18);
      display:flex; align-items:center; justify-content:center; margin:0 auto 20px;
      box-shadow:0 0 30px rgba(78,141,245,.1);
    }
    .wh-empty-icon-wrap i { font-size:2.2rem; color:#4e8df5; opacity:.7; }
    .wh-empty h3 { font-size:.95rem; font-weight:700; color:#c8d8f0; }

    /* ── Delete confirm ── */
    .wh-del-confirm {
      background:rgba(255,59,48,.06); border:1px solid rgba(255,59,48,.2);
      border-radius:10px; padding:11px 16px; margin:0 20px 14px;
      display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;
    }
    .wh-del-q { color:#ff3b30; font-size:.8rem; font-weight:700; display:flex; align-items:center; gap:6px; }
    .wh-del-acts { display:flex; gap:7px; }
    .wh-del-no  { padding:6px 14px; border-radius:8px; border:1px solid rgba(var(--fg-rgb), .1); background:rgba(var(--fg-rgb), .05); color:var(--light); font-family:inherit; font-size:.78rem; font-weight:700; cursor:pointer; }
    .wh-del-yes { padding:6px 14px; border-radius:8px; border:none; background:#ff3b30; color:#fff; font-family:inherit; font-size:.78rem; font-weight:800; cursor:pointer; display:flex; align-items:center; gap:5px; }

    /* ── Modal ── */
    .wh-mask { position:fixed; inset:0; background:rgba(0,0,0,.7); backdrop-filter:blur(8px); z-index:9000; display:none; align-items:center; justify-content:center; padding:20px; }
    .wh-mask.show { display:flex; animation:wh-fade .2s; }
    .wh-modal { background:linear-gradient(160deg,var(--primary),var(--primary-deep)); border:1px solid rgba(var(--fg-rgb), .1); border-radius:22px; max-width:560px; width:100%; max-height:92vh; overflow-y:auto; box-shadow:0 24px 80px rgba(0,0,0,.6); }
    .wh-mhead { padding:22px 26px; border-bottom:1px solid rgba(var(--fg-rgb), .07); display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; background:linear-gradient(160deg,var(--primary),var(--primary-deep)); z-index:1; }
    .wh-mhead h3 { color:var(--light); font-size:1.1rem; font-weight:800; display:flex; align-items:center; gap:9px; }
    .wh-mhead h3 i { color:#4e8df5; }
    .wh-mclose { background:rgba(var(--fg-rgb), .06); border:1px solid rgba(var(--fg-rgb), .08); color:#8fa3c0; width:32px; height:32px; border-radius:8px; cursor:pointer; font-size:1.1rem; display:flex; align-items:center; justify-content:center; transition:all .18s; }
    .wh-mclose:hover { background:rgba(var(--fg-rgb), .12); color:var(--light); }
    .wh-mbody { padding:24px 26px; display:flex; flex-direction:column; gap:18px; }
    .wh-field label { display:block; font-size:.78rem; font-weight:700; color:#94aac8; margin-bottom:7px; letter-spacing:.2px; }
    .wh-field input, .wh-field textarea, .wh-field select {
      width:100%; padding:11px 14px; border-radius:11px;
      background:rgba(var(--fg-rgb), .04); border:1.5px solid rgba(var(--fg-rgb), .08);
      color:var(--light); font-family:inherit; font-size:.88rem; transition:all .2s; direction:rtl; box-sizing:border-box;
    }
    .wh-field input:focus, .wh-field textarea:focus, .wh-field select:focus {
      outline:none; border-color:#4e8df5; background:rgba(78,141,245,.07);
      box-shadow:0 0 0 3px rgba(78,141,245,.12);
    }
    .wh-field textarea { min-height:75px; resize:vertical; }
    .wh-field select { color-scheme:dark; }
    .wh-field select option { background:var(--primary); color:var(--light); }
    .wh-event-desc { font-size:.75rem; color:#5a9ff5; margin-top:7px; padding:8px 12px; background:rgba(78,141,245,.07); border-radius:9px; border:1px solid rgba(78,141,245,.14); display:flex; align-items:center; gap:7px; }
    .wh-event-desc::before { content:'ℹ'; font-size:.8rem; }
    .wh-toggle-row { display:flex; align-items:center; justify-content:space-between; padding:13px 15px; background:rgba(var(--fg-rgb), .03); border-radius:12px; border:1.5px solid rgba(var(--fg-rgb), .07); }
    .wh-toggle-row span { color:#c8d8f0; font-size:.88rem; font-weight:600; display:flex; align-items:center; gap:7px; }
    .wh-toggle-row span i { color:#34c759; }
    .wh-toggle-row input { width:18px; height:18px; accent-color:#4e8df5; cursor:pointer; }
    .wh-mfoot { padding:16px 26px 24px; display:flex; justify-content:flex-end; gap:10px; border-top:1px solid rgba(var(--fg-rgb), .06); }

    @media(max-width:700px) {
      .wh-grid { grid-template-columns:1fr; }
      .wh-head { flex-direction:column; align-items:stretch; }
      .wh-card-hd { flex-wrap:wrap; }
    }
  `;

  // ── State ────────────────────────────────────────────────────────────────
  let S = { hooks: [], events: [], editId: null };

  // ── API Helpers ───────────────────────────────────────────────────────────
  function getToken() {
    try { return JSON.parse(localStorage.getItem('authData') || '{}').token || ''; } catch { return ''; }
  }
  async function api(method, path, body) {
    const opts = { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` } };
    if (body !== undefined) opts.body = JSON.stringify(body);
    const r = await fetch(window.location.origin + path, opts);
    if (r.status === 401) { location.replace('/login'); return null; }
    if (r.status === 204) return true;
    const txt = await r.text();
    const data = txt ? JSON.parse(txt) : null;
    if (!r.ok) throw new Error(data?.message || `خطأ ${r.status}`);
    return data;
  }

  // ── Render ────────────────────────────────────────────────────────────────
  function renderPage() {
    const c = document.getElementById('app-main');
    if (!c) return;
    c.innerHTML = `
      <div class="wh-wrap">
        <div class="wh-head">
          <div class="wh-title"><i class="ri-webhook-line"></i> Webhooks</div>
          <button class="wh-btn wh-btn-primary" onclick="whOpenCreate()">
            <i class="ri-add-line"></i> إضافة Webhook
          </button>
        </div>
        <div id="wh-list"></div>
      </div>

      <!-- Modal -->
      <div class="wh-mask" id="wh-mask">
        <div class="wh-modal">
          <div class="wh-mhead">
            <h3 id="wh-modal-title"><i class="ri-webhook-line"></i> Webhook جديد</h3>
            <button class="wh-mclose" onclick="whCloseModal()">×</button>
          </div>
          <div class="wh-mbody">
            <div class="wh-field">
              <label>الاسم <span style="color:#ff3b30">*</span></label>
              <input id="wh-inp-name" maxlength="100" />
            </div>
            <div class="wh-field">
              <label>الحدث <span style="color:#ff3b30">*</span></label>
              <select id="wh-inp-event" onchange="whOnEventChange()">
                <option value="">— اختر الحدث —</option>
              </select>
              <div id="wh-event-desc" class="wh-event-desc" style="display:none"></div>
            </div>
            <div class="wh-field">
              <label>الـ URL <span style="color:#ff3b30">*</span></label>
              <input id="wh-inp-url" type="url" />
            </div>
            <div class="wh-field">
              <label>Secret Key</label>
              <input id="wh-inp-secret" maxlength="200" dir="ltr" style="font-family:monospace" />
            </div>
            <div class="wh-field">
              <label>الوصف</label>
              <textarea id="wh-inp-desc"></textarea>
            </div>
            <div class="wh-toggle-row">
              <span><i class="ri-checkbox-circle-line"></i> مفعّل</span>
              <input type="checkbox" id="wh-inp-active" checked />
            </div>
          </div>
          <div class="wh-mfoot">
            <button class="wh-btn wh-btn-primary" id="wh-save-btn" onclick="whSave()">
              <i class="ri-save-line"></i> حفظ
            </button>
            <button class="wh-btn wh-btn-ghost" onclick="whCloseModal()">إلغاء</button>
          </div>
        </div>
      </div>
    `;
    renderList();
  }

  function renderList() {
    const el = document.getElementById('wh-list');
    if (!el) return;
    if (!S.hooks.length) {
      el.innerHTML = `
        <div class="wh-empty">
          <div class="wh-empty-icon-wrap"><i class="ri-webhook-line"></i></div>
          <h3>لا يوجد Webhooks مضافة</h3>
        </div>`;
      return;
    }
    el.innerHTML = `<div class="wh-grid">${S.hooks.map(renderCard).join('')}</div>`;
  }

  function renderCard(h) {
    const fired = h.lastFiredAt
      ? new Date(h.lastFiredAt).toLocaleDateString('ar-EG')
      : '—';
    const toggleIcon  = h.isActive ? 'ri-toggle-fill' : 'ri-toggle-line';
    const toggleLabel = h.isActive ? 'تعطيل' : 'تفعيل';
    const creator     = (h.createdByName || '—').split(' ')[0]; // first name only

    return `
      <div class="wh-card ${h.isActive ? 'active-card' : 'inactive'}" id="wh-card-${h.id}">

        <!-- Header -->
        <div class="wh-card-hd">
          <div class="wh-ev-icon"><i class="ri-flashlight-fill"></i></div>
          <div class="wh-hd-info">
            <div class="wh-card-name">${escHtml(h.name)}</div>
            <span class="wh-event-tag">${escHtml(h.eventLabelAr || h.event)}</span>
          </div>
          <div class="wh-status-pill ${h.isActive ? 'on' : 'off'}">
            <span class="wh-pulse-dot"></span>
            ${h.isActive ? 'مفعّل' : 'معطّل'}
          </div>
        </div>

        <!-- Body -->
        <div class="wh-card-bd">
          <div class="wh-card-url">
            <i class="ri-links-line"></i>
            <span title="${escHtml(h.url)}">${escHtml(h.url)}</span>
          </div>
          <div class="wh-stats">
            <div class="wh-stat">
              <div class="wh-stat-val">${h.fireCount ?? 0}</div>
              <div class="wh-stat-lbl">إطلاقات</div>
            </div>
            <div class="wh-stat">
              <div class="wh-stat-val">${fired}</div>
              <div class="wh-stat-lbl">آخر إطلاق</div>
            </div>
            <div class="wh-stat">
              <div class="wh-stat-val" style="font-size:.75rem">${escHtml(creator)}</div>
              <div class="wh-stat-lbl">بواسطة</div>
            </div>
          </div>
        </div>

        <!-- Footer actions -->
        <div class="wh-card-ft">
          <button class="wh-act" onclick="whOpenEdit(${h.id})">
            <i class="ri-edit-line"></i> تعديل
          </button>
          <button class="wh-act" onclick="whToggle(${h.id})">
            <i class="${toggleIcon}"></i> ${toggleLabel}
          </button>
          <button class="wh-act wh-act-test" onclick="whTest(${h.id})">
            <i class="ri-send-plane-2-line"></i> اختبار
          </button>
          <button class="wh-act wh-act-del" onclick="whAskDelete(${h.id})">
            <i class="ri-delete-bin-6-line"></i> حذف
          </button>
        </div>
        <div id="wh-del-${h.id}"></div>
      </div>`;
  }

  function escHtml(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Populate event select ──────────────────────────────────────────────
  function populateEvents(selected) {
    const sel = document.getElementById('wh-inp-event');
    if (!sel) return;
    sel.innerHTML = `<option value="">— اختر الحدث —</option>` +
      S.events.map(e =>
        `<option value="${e.value}" ${e.value === selected ? 'selected' : ''}>${e.labelAr} (${e.value})</option>`
      ).join('');
    if (selected) whOnEventChange();
  }

  // ── Modal open/close ──────────────────────────────────────────────────────
  window.whOpenCreate = function() {
    S.editId = null;
    document.getElementById('wh-modal-title').innerHTML = '<i class="ri-webhook-line"></i> Webhook جديد';
    document.getElementById('wh-inp-name').value = '';
    document.getElementById('wh-inp-url').value = '';
    document.getElementById('wh-inp-secret').value = '';
    document.getElementById('wh-inp-desc').value = '';
    document.getElementById('wh-inp-active').checked = true;
    document.getElementById('wh-event-desc').style.display = 'none';
    populateEvents('');
    document.getElementById('wh-mask').classList.add('show');
    setTimeout(() => document.getElementById('wh-inp-name').focus(), 100);
  };

  window.whOpenEdit = function(id) {
    const h = S.hooks.find(x => x.id === id);
    if (!h) return;
    S.editId = id;
    document.getElementById('wh-modal-title').innerHTML = '<i class="ri-edit-line"></i> تعديل Webhook';
    document.getElementById('wh-inp-name').value = h.name;
    document.getElementById('wh-inp-url').value = h.url;
    document.getElementById('wh-inp-secret').value = h.secretKey || '';
    document.getElementById('wh-inp-desc').value = h.description || '';
    document.getElementById('wh-inp-active').checked = h.isActive;
    populateEvents(h.event);
    document.getElementById('wh-mask').classList.add('show');
  };

  window.whCloseModal = function() {
    document.getElementById('wh-mask').classList.remove('show');
    S.editId = null;
  };

  window.whOnEventChange = function() {
    const val  = document.getElementById('wh-inp-event')?.value;
    const desc = document.getElementById('wh-event-desc');
    if (!desc) return;
    const ev = S.events.find(e => e.value === val);
    if (ev) { desc.textContent = ev.descriptionAr; desc.style.display = 'flex'; }
    else     { desc.style.display = 'none'; }
  };

  // ── Save ──────────────────────────────────────────────────────────────────
  window.whSave = async function() {
    const name   = document.getElementById('wh-inp-name').value.trim();
    const event  = document.getElementById('wh-inp-event').value;
    const url    = document.getElementById('wh-inp-url').value.trim();
    const secret = document.getElementById('wh-inp-secret').value.trim();
    const desc   = document.getElementById('wh-inp-desc').value.trim();
    const active = document.getElementById('wh-inp-active').checked;

    if (!name)  { window.__showToast('أدخل اسماً للـ Webhook', 'error'); return; }
    if (!event) { window.__showToast('اختر الحدث', 'error'); return; }
    if (!url)   { window.__showToast('أدخل الـ URL', 'error'); return; }

    const btn = document.getElementById('wh-save-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="ri-loader-4-line" style="animation:spin .8s linear infinite"></i> جاري الحفظ...';

    try {
      const body = { name, event, url, secretKey: secret || null, description: desc || null, allowedRoles: [], isActive: active };
      if (S.editId) {
        await api('PUT', `/api/webhooks/${S.editId}`, body);
        window.__showToast('تم تحديث الـ Webhook', 'success');
      } else {
        await api('POST', '/api/webhooks', body);
        window.__showToast('تم إضافة الـ Webhook بنجاح', 'success');
      }
      whCloseModal();
      await loadData();
      renderList();
    } catch (e) {
      window.__showToast(e.message || 'حدث خطأ', 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="ri-save-line"></i> حفظ';
    }
  };

  // ── Toggle active ─────────────────────────────────────────────────────────
  window.whToggle = async function(id) {
    try {
      await api('PATCH', `/api/webhooks/${id}/toggle`);
      const h = S.hooks.find(x => x.id === id);
      if (h) h.isActive = !h.isActive;
      renderList();
      window.__showToast('تم تغيير حالة الـ Webhook', 'success');
    } catch (e) {
      window.__showToast(e.message || 'حدث خطأ', 'error');
    }
  };

  // ── Test ──────────────────────────────────────────────────────────────────
  window.whTest = async function(id) {
    try {
      await api('POST', `/api/webhooks/${id}/test`);
      window.__showToast('تم إرسال الطلب التجريبي ✓', 'success');
    } catch (e) {
      window.__showToast(e.message || 'فشل الإرسال', 'error');
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  window.whAskDelete = function(id) {
    const el = document.getElementById(`wh-del-${id}`);
    if (!el) return;
    el.innerHTML = `
      <div class="wh-del-confirm">
        <div class="wh-del-q"><i class="ri-error-warning-line"></i> هل أنت متأكد من حذف هذا الـ Webhook؟</div>
        <div class="wh-del-acts">
          <button class="wh-del-yes" onclick="whConfirmDelete(${id})"><i class="ri-delete-bin-6-line"></i> حذف</button>
          <button class="wh-del-no" onclick="document.getElementById('wh-del-${id}').innerHTML=''">إلغاء</button>
        </div>
      </div>`;
  };

  window.whConfirmDelete = async function(id) {
    try {
      await api('DELETE', `/api/webhooks/${id}`);
      S.hooks = S.hooks.filter(h => h.id !== id);
      renderList();
      window.__showToast('تم حذف الـ Webhook', 'success');
    } catch (e) {
      window.__showToast(e.message || 'حدث خطأ', 'error');
    }
  };

  // ── Load data ─────────────────────────────────────────────────────────────
  async function loadData() {
    const [hooks, events] = await Promise.all([
      api('GET', '/api/webhooks'),
      api('GET', '/api/webhooks/events')
    ]);
    S.hooks  = hooks  || [];
    S.events = events || [];
  }

  // ── Module export ─────────────────────────────────────────────────────────
  window.__pages['webhooks'] = {
    getCSS: () => CSS,
    init: async function() {
      renderPage();
      try {
        await loadData();
        renderList();
      } catch (e) {
        window.__showToast('تعذر تحميل الـ Webhooks', 'error');
      }
    }
  };
})();
