/* ════════════════════════════════════════════════
   tickets.js — Admin / تذاكر الصيانة
   (يستخدمه أيضاً BookingManager — يفلتر بناءً على الـ role)
   ════════════════════════════════════════════════ */
(function () {
  'use strict';
  window.__pages = window.__pages || {};

  const STATUSES = [
    { v: 'Open',       ar: 'مفتوحة',         cls: 'tk-st-open', icon: 'ri-mail-open-line' },
    { v: 'InProgress', ar: 'قيد المعالجة',  cls: 'tk-st-prog', icon: 'ri-loader-2-line' },
    { v: 'Resolved',   ar: 'تم الحل',        cls: 'tk-st-res',  icon: 'ri-check-double-line' },
    { v: 'Closed',     ar: 'مغلقة',          cls: 'tk-st-clos', icon: 'ri-archive-line' },
    { v: 'Reopened',   ar: 'أُعيد فتحها',    cls: 'tk-st-reop', icon: 'ri-refresh-line' }
  ];

  // الانتقالات المسموحة من حالة → حالة (مطابقة للـ backend)
  const TRANSITIONS = {
    Open: ['InProgress', 'Closed'],
    InProgress: ['Resolved', 'Closed'],
    Resolved: ['InProgress', 'Closed'],
    Closed: [],
    Reopened: ['InProgress', 'Resolved', 'Closed']
  };

  const CSS = `
    .tk-wrap { padding: 12px 0 60px; animation: tk-fade .3s ease; }
    @keyframes tk-fade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
    @keyframes spin { to { transform:rotate(360deg) } }
    select { color-scheme: dark !important; }
    select option { background:var(--primary) !important; color:var(--light) !important; }

    .tk-head { display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap; margin-bottom:18px; }
    .tk-title { font-size:1.45rem; font-weight:800; color:var(--light); display:flex; align-items:center; gap:10px; }
    .tk-title i { color:#4e8df5; }
    .tk-sub { color:var(--text-muted); font-size:.85rem; margin-top:4px; }

    .tk-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:12px; margin-bottom:18px; }
    .tk-stat { background:linear-gradient(160deg,var(--card-bg),var(--primary)); border:1px solid rgba(var(--fg-rgb), .06); border-radius:14px; padding:14px 16px; }
    .tk-stat-num { font-size:1.5rem; font-weight:800; color:var(--light); }
    .tk-stat-lbl { font-size:.76rem; color:var(--text-muted); font-weight:700; margin-top:2px; }
    .tk-stat.open .tk-stat-num { color:#4e8df5; }
    .tk-stat.prog .tk-stat-num { color:#ffcc00; }
    .tk-stat.res  .tk-stat-num { color:#34c759; }
    .tk-stat.paid .tk-stat-num { color:#ff9500; }

    .tk-filters { background:rgba(var(--fg-rgb), .03); border:1px solid rgba(var(--fg-rgb), .06); border-radius:14px; padding:12px 14px; margin-bottom:14px; display:flex; flex-wrap:wrap; gap:8px; align-items:center; }
    .tk-flbl { font-size:.72rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; }
    .tk-pill { padding:5px 12px; border-radius:18px; border:1px solid rgba(var(--fg-rgb), .1); background:transparent; color:var(--text-muted); font-family:inherit; font-size:.76rem; font-weight:700; cursor:pointer; transition:all .2s; }
    .tk-pill:hover { color:var(--light); }
    .tk-pill.on { background:rgba(78,141,245,.15); border-color:#4e8df5; color:#4e8df5; }
    .tk-search { flex:1; min-width:160px; max-width:260px; padding:7px 12px; background:rgba(var(--fg-rgb), .05); border:1.5px solid rgba(var(--fg-rgb), .08); border-radius:9px; color:var(--light); font-family:inherit; font-size:.84rem; direction:rtl; }
    .tk-search:focus { outline:none; border-color:#4e8df5; }

    /* ── List (table-style rows) ────────── */
    .tk-list { display:flex; flex-direction:column; gap:8px; }
    .tk-list-head {
      display:grid; grid-template-columns:130px 1.6fr 2fr 110px 130px 175px;
      gap:12px; padding:10px 16px; background:rgba(var(--fg-rgb), .02); border:1px solid rgba(var(--fg-rgb), .05);
      border-radius:11px; font-size:.72rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:.4px;
    }
    .tk-row {
      background:linear-gradient(160deg,var(--card-bg),var(--primary)); border:1px solid rgba(var(--fg-rgb), .07); border-radius:13px;
      padding:12px 16px;
      display:grid; grid-template-columns:130px 1.6fr 2fr 110px 130px 175px;
      gap:12px; align-items:center;
      cursor:pointer; transition:all .2s;
    }
    .tk-row:hover { border-color:#4e8df5; background:linear-gradient(160deg,var(--card-hover),var(--primary)); box-shadow:0 6px 18px rgba(0,0,0,.22); }
    .tk-tn { font-family:'Consolas',monospace; font-weight:800; color:#4e8df5; font-size:.9rem; }
    .tk-cat-cell { display:flex; flex-direction:column; gap:3px; min-width:0; }
    .tk-cat-cell .name { color:var(--light); font-weight:700; font-size:.88rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .tk-cat-cell .buyer { color:var(--text-muted); font-size:.74rem; display:flex; align-items:center; gap:4px; }
    .tk-unit-cell { display:flex; flex-direction:column; gap:3px; min-width:0; font-size:.78rem; }
    .tk-unit-cell .project { color:#cbd6e8; font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .tk-unit-cell .loc { color:var(--text-muted); font-size:.72rem; display:flex; flex-wrap:wrap; gap:8px; }
    .tk-unit-cell .loc strong { color:#4e8df5; font-weight:800; }
    .tk-tag-cell { min-width:78px; }

    .tk-st { display:inline-flex; align-items:center; gap:5px; padding:5px 11px; border-radius:18px; font-size:.74rem; font-weight:800; white-space:nowrap; }
    .tk-st-open { background:rgba(78,141,245,.15);  color:#4e8df5; }
    .tk-st-prog { background:rgba(255,204,0,.15);   color:#ffcc00; }
    .tk-st-res  { background:rgba(52,199,89,.15);   color:#34c759; }
    .tk-st-clos { background:rgba(140,160,180,.12); color:var(--text-muted); }
    .tk-st-reop { background:rgba(255,149,0,.15);   color:#ff9500; }

    .tk-paid-tag { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:13px; font-size:.7rem; font-weight:800; background:rgba(255,149,0,.12); color:#ff9500; border:1px solid rgba(255,149,0,.3); }

    .tk-date { color:var(--text-muted); font-size:.74rem; text-align:left; white-space:nowrap; direction:ltr; font-family:'Consolas','Segoe UI',monospace; letter-spacing:.3px; }

    /* ── Modal / Detail (centered, not drawer) ───────────────── */
    .tk-mask { position:fixed; inset:0; background:rgba(0,0,0,.72); backdrop-filter:blur(6px); z-index:9000; display:none; align-items:center; justify-content:center; padding:24px; }
    .tk-mask.show { display:flex; animation:tk-fade .18s ease; }
    .tk-drawer {
      background:linear-gradient(165deg,var(--primary),var(--primary-deep)); border:1px solid rgba(var(--fg-rgb), .1);
      width:min(820px,100%); max-height:90vh; overflow-y:auto; border-radius:18px;
      display:flex; flex-direction:column; box-shadow:0 24px 60px rgba(0,0,0,.5);
      will-change: transform; contain: content;
    }
    .tk-dhead { padding:18px 22px; border-bottom:1px solid rgba(var(--fg-rgb), .08); display:flex; justify-content:space-between; align-items:flex-start; gap:10px; position:sticky; top:0; background:rgba(var(--bg-rgb),.97); backdrop-filter:blur(10px); z-index:5; }
    .tk-dhead h3 { color:var(--light); font-size:1rem; font-weight:800; display:flex; align-items:center; gap:8px; line-height:1.5; }
    .tk-dhead .tn { font-family:'Consolas',monospace; color:#4e8df5; }
    .tk-mclose { background:none; border:none; color:var(--text-muted); font-size:1.5rem; cursor:pointer; padding:4px; }
    .tk-mclose:hover { color:var(--light); }
    .tk-dbody { padding:20px 22px; display:flex; flex-direction:column; gap:18px; }

    .tk-section { background:rgba(var(--fg-rgb), .03); border:1px solid rgba(var(--fg-rgb), .06); border-radius:13px; padding:14px 16px; }
    .tk-sec-h { font-size:.78rem; font-weight:800; color:#cbd6e8; text-transform:uppercase; letter-spacing:.5px; margin-bottom:10px; display:flex; align-items:center; gap:7px; }
    .tk-sec-h i { color:#4e8df5; }

    .tk-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:14px 18px; }
    .tk-kv { display:flex; flex-direction:column; gap:4px; min-width:0; padding:8px 10px; background:rgba(var(--fg-rgb), .02); border-radius:8px; border:1px solid rgba(var(--fg-rgb), .04); }
    .tk-kv label { font-size:.7rem; color:var(--text-muted); font-weight:700; letter-spacing:.3px; }
    .tk-kv span { color:var(--light); font-size:.86rem; font-weight:600; word-break:break-word; overflow-wrap:anywhere; }
    .tk-kv span[dir="ltr"] { font-family:'Consolas','Segoe UI',monospace; letter-spacing:.5px; }

    .tk-desc { color:var(--light); font-size:.9rem; line-height:1.7; white-space:pre-wrap; word-break:break-word; }
    .tk-warning { background:rgba(255,149,0,.08); border:1px solid rgba(255,149,0,.3); border-radius:10px; padding:11px 14px; color:#ff9500; font-size:.84rem; display:flex; align-items:flex-start; gap:9px; line-height:1.6; }
    .tk-warning i { font-size:1.1rem; margin-top:2px; }

    /* ── Timeline ───────────────────────── */
    .tk-tl { position:relative; padding-right:24px; }
    .tk-tl::before { content:''; position:absolute; right:7px; top:6px; bottom:6px; width:2px; background:rgba(var(--fg-rgb), .08); }
    .tk-tl-item { position:relative; padding:0 0 14px; }
    .tk-tl-item:last-child { padding-bottom:0; }
    .tk-tl-dot { position:absolute; right:-21px; top:5px; width:16px; height:16px; border-radius:50%; background:#4e8df5; border:3px solid var(--primary); box-shadow:0 0 0 2px rgba(78,141,245,.2); }
    .tk-tl-head { display:flex; flex-wrap:wrap; gap:8px; align-items:center; font-size:.83rem; color:var(--light); font-weight:700; }
    .tk-tl-meta { font-size:.72rem; color:var(--text-muted); margin-top:3px; }
    .tk-tl-note { font-size:.82rem; color:#cbd6e8; margin-top:5px; line-height:1.55; padding:7px 11px; background:rgba(var(--fg-rgb), .04); border-radius:8px; }

    /* ── Attachments ────────────────────── */
    .tk-atts { display:grid; grid-template-columns:repeat(auto-fill,minmax(110px,1fr)); gap:10px; }
    .tk-att { position:relative; aspect-ratio:1/1; border-radius:11px; overflow:hidden; background:rgba(var(--fg-rgb), .04); border:1px solid rgba(var(--fg-rgb), .07); cursor:pointer; transition:all .2s; }
    .tk-att:hover { transform:scale(1.04); border-color:#4e8df5; }
    .tk-att img, .tk-att video { width:100%; height:100%; object-fit:cover; display:block; }
    .tk-att-badge { position:absolute; top:5px; right:5px; padding:2px 7px; border-radius:9px; background:rgba(0,0,0,.65); color:#fff; font-size:.65rem; font-weight:800; display:flex; align-items:center; gap:3px; }

    /* ── Action box ──────────────────────── */
    .tk-action-box { background:linear-gradient(135deg,rgba(78,141,245,.08),rgba(78,141,245,.02)); border:1px solid rgba(78,141,245,.2); border-radius:13px; padding:14px 16px; }
    .tk-action-row { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px; }
    .tk-act-btn { padding:8px 14px; border-radius:9px; border:1px solid rgba(var(--fg-rgb), .1); background:rgba(var(--fg-rgb), .04); color:var(--light); font-family:inherit; font-size:.82rem; font-weight:700; cursor:pointer; transition:all .2s; display:flex; align-items:center; gap:6px; }
    .tk-act-btn:hover { background:rgba(78,141,245,.18); border-color:#4e8df5; }
    .tk-act-note { width:100%; padding:9px 12px; background:rgba(0,0,0,.2); border:1.5px solid rgba(var(--fg-rgb), .08); border-radius:9px; color:#fff; font-family:inherit; font-size:.84rem; min-height:60px; resize:vertical; direction:rtl; }
    .tk-act-note:focus { outline:none; border-color:#4e8df5; }

    .tk-empty { text-align:center; padding:60px 20px; color:var(--text-muted); }
    .tk-empty i { font-size:3rem; opacity:.4; display:block; margin-bottom:12px; }

    /* ── Lightbox ────────────────────────── */
    .tk-lb { position:fixed; inset:0; background:rgba(0,0,0,.95); z-index:10000; display:none; align-items:center; justify-content:center; padding:20px; }
    .tk-lb.show { display:flex; }
    .tk-lb img, .tk-lb video { max-width:96vw; max-height:92vh; border-radius:10px; }
    .tk-lb-close { position:absolute; top:18px; left:18px; background:rgba(var(--fg-rgb), .1); border:none; color:#fff; width:42px; height:42px; border-radius:50%; cursor:pointer; font-size:1.4rem; }

    /* ── Inline confirm box ─────────────── */
    .tk-confirm-box {
      background:rgba(255,59,48,.07); border:1px solid rgba(255,59,48,.3);
      border-radius:12px; padding:14px 16px;
      display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;
    }
    .tk-confirm-box .msg { color:#ff3b30; font-size:.86rem; font-weight:700; display:flex; align-items:center; gap:8px; }
    .tk-confirm-box .msg i { font-size:1.15rem; }
    .tk-confirm-actions { display:flex; gap:8px; }
    .tk-conf-yes { padding:8px 16px; border-radius:9px; border:none; background:#ff3b30; color:#fff; font-family:inherit; font-size:.84rem; font-weight:800; cursor:pointer; transition:all .18s; }
    .tk-conf-yes:hover { background:#e0302a; }
    .tk-conf-no  { padding:8px 14px; border-radius:9px; border:1px solid rgba(var(--fg-rgb), .12); background:rgba(var(--fg-rgb), .05); color:var(--light); font-family:inherit; font-size:.84rem; font-weight:700; cursor:pointer; transition:all .18s; }
    .tk-conf-no:hover { background:rgba(var(--fg-rgb), .1); }

    @media(max-width:1100px) {
      .tk-list-head { display:none; }
      .tk-row { grid-template-columns:auto 1fr auto; gap:10px; align-items:start; }
      .tk-row .tk-tag-cell, .tk-row .tk-date { grid-column: 2; padding-top:4px; font-size:.72rem; }
      .tk-row .tk-date { color:var(--text-muted); }
    }
    @media(max-width:600px) {
      .tk-row { grid-template-columns:1fr; gap:8px; }
      .tk-date { text-align:right; }
      .tk-grid2 { grid-template-columns:1fr; }
    }
  `;

  window.__pages['tickets'] = {
    getCSS() { return CSS; },

    async init() {
      const main = document.getElementById('app-main');
      if (!main) return;

      const BASE = window.location.origin;
      const tok = () => { try { const a = JSON.parse(localStorage.getItem('authData') || '{}'); return a.token || ''; } catch { return ''; } };

      async function api(method, path, body) {
        const t = tok();
        if (!t) { window.location.href = '/login'; return null; }
        const opts = { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${t}` } };
        if (body !== undefined) opts.body = JSON.stringify(body);
        const r = await fetch(BASE + path, opts);
        if (r.status === 401) { localStorage.removeItem('authData'); window.location.href = '/login'; return null; }
        if (r.status === 403) { window.__showToast?.('ليس لديك صلاحية', 'error'); return null; }
        if (!r.ok) {
          let msg = `خطأ ${r.status}`;
          try { const e = await r.json(); msg = e.message || msg; } catch {}
          throw new Error(msg);
        }
        if (r.status === 204) return null;
        return r.json().catch(() => null);
      }
      const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
      // ─── تنسيق التاريخ والوقت ─── إنجليزي / DD/MM/YYYY / 24h / توقيت السعودية ──
      const fmtDate = d => {
        if (!d) return '—';
        const dt = new Date(d);
        const day  = dt.toLocaleDateString('en-GB', { day:'2-digit', month:'2-digit', year:'numeric', timeZone:'Asia/Riyadh' });
        const time = dt.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit', hour12:false, timeZone:'Asia/Riyadh' });
        return `${day} • ${time}`;
      };
      const fmtDay = d => {
        if (!d) return '—';
        return new Date(d).toLocaleDateString('en-GB', { day:'2-digit', month:'2-digit', year:'numeric', timeZone:'Asia/Riyadh' });
      };

      main.innerHTML = `
        <div class="tk-wrap">
          <div class="tk-head">
            <div>
              <div class="tk-title"><i class="ri-customer-service-2-line"></i> تذاكر الصيانة</div>
              <div class="tk-sub">إدارة طلبات الصيانة الواردة من المشترين</div>
            </div>
          </div>

          <div class="tk-stats" id="tk-stats"></div>

          <div class="tk-filters">
            <span class="tk-flbl">الحالة:</span>
            <button class="tk-pill on" data-flt="status" data-v="all">الكل</button>
            ${STATUSES.map(s => `<button class="tk-pill" data-flt="status" data-v="${s.v}">${s.ar}</button>`).join('')}
            <span class="tk-flbl" style="margin-right:auto">النوع:</span>
            <button class="tk-pill on" data-flt="paid" data-v="all">الكل</button>
            <button class="tk-pill" data-flt="paid" data-v="warranty">ضمان</button>
            <button class="tk-pill" data-flt="paid" data-v="paid">مدفوعة</button>
            <input type="text" class="tk-search" id="tk-search" placeholder="🔍 بحث برقم/اسم/وحدة...">
          </div>

          <div class="tk-list" id="tk-list">
            <div class="tk-empty"><i class="ri-loader-4-line" style="animation:spin 1s linear infinite"></i><div>جارٍ التحميل…</div></div>
          </div>
        </div>

        <div class="tk-mask" id="tk-mask">
          <div class="tk-drawer" id="tk-drawer"></div>
        </div>

        <div class="tk-lb" id="tk-lb">
          <button class="tk-lb-close" id="tk-lb-close"><i class="ri-close-line"></i></button>
          <div id="tk-lb-body"></div>
        </div>
      `;

      const state = { items: [], filter: { status: 'all', paid: 'all', q: '' } };

      function applyFilters() {
        let f = state.items;
        if (state.filter.status !== 'all') f = f.filter(t => t.status === state.filter.status);
        if (state.filter.paid === 'paid')    f = f.filter(t => t.isPaidMaintenance);
        if (state.filter.paid === 'warranty') f = f.filter(t => !t.isPaidMaintenance);
        if (state.filter.q) {
          const q = state.filter.q.toLowerCase();
          f = f.filter(t =>
            (t.ticketNumber || '').toLowerCase().includes(q) ||
            (t.buyerFullName || '').toLowerCase().includes(q) ||
            (t.unitNumber || '').toLowerCase().includes(q) ||
            (t.projectName || '').toLowerCase().includes(q)
          );
        }
        renderList(f);
        renderStats(state.items);
      }

      function renderStats(items) {
        const total = items.length;
        const open  = items.filter(t => t.status === 'Open' || t.status === 'Reopened').length;
        const prog  = items.filter(t => t.status === 'InProgress').length;
        const res   = items.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
        const paid  = items.filter(t => t.isPaidMaintenance).length;
        document.getElementById('tk-stats').innerHTML = `
          <div class="tk-stat"><div class="tk-stat-num">${total}</div><div class="tk-stat-lbl">الإجمالي</div></div>
          <div class="tk-stat open"><div class="tk-stat-num">${open}</div><div class="tk-stat-lbl">مفتوحة / أُعيد فتحها</div></div>
          <div class="tk-stat prog"><div class="tk-stat-num">${prog}</div><div class="tk-stat-lbl">قيد المعالجة</div></div>
          <div class="tk-stat res"><div class="tk-stat-num">${res}</div><div class="tk-stat-lbl">تم الحل / مغلقة</div></div>
          <div class="tk-stat paid"><div class="tk-stat-num">${paid}</div><div class="tk-stat-lbl">مدفوعة</div></div>
        `;
      }

      function statusBadge(s) {
        const st = STATUSES.find(x => x.v === s) || STATUSES[0];
        return `<span class="tk-st ${st.cls}"><i class="${st.icon}"></i>${st.ar}</span>`;
      }

      function renderList(items) {
        const list = document.getElementById('tk-list');
        if (!items.length) {
          list.innerHTML = `<div class="tk-empty"><i class="ri-inbox-line"></i><div>لا توجد تذاكر مطابقة</div></div>`;
          return;
        }
        const head = `
          <div class="tk-list-head">
            <div>الرقم</div>
            <div>التصنيف / العميل</div>
            <div>المشروع — المبنى / الوحدة</div>
            <div>النوع</div>
            <div>الحالة</div>
            <div>تاريخ الفتح</div>
          </div>`;
        const rows = items.map(t => `
          <div class="tk-row" data-id="${t.id}">
            <div class="tk-tn">${esc(t.ticketNumber)}</div>
            <div class="tk-cat-cell">
              <div class="name">${esc(t.categoryName)}</div>
              <div class="buyer"><i class="ri-user-line"></i>${esc(t.buyerFullName)}</div>
            </div>
            <div class="tk-unit-cell">
              <div class="project"><i class="ri-building-4-line"></i> ${esc(t.projectName)}</div>
              <div class="loc">
                <span>عمارة: <strong>${esc(t.buildingName)}</strong></span>
                <span>دور: <strong>${t.floorNumber}</strong></span>
                <span>وحدة: <strong>${esc(t.unitNumber)}</strong></span>
              </div>
            </div>
            <div class="tk-tag-cell">${t.isPaidMaintenance ? `<span class="tk-paid-tag"><i class="ri-money-dollar-circle-line"></i>مدفوعة</span>` : `<span style="color:#34c759;font-size:.72rem;font-weight:800"><i class="ri-shield-check-line"></i> ضمان</span>`}</div>
            <div>${statusBadge(t.status)}</div>
            <span class="tk-date">${fmtDate(t.createdAt)}</span>
          </div>
        `).join('');
        list.innerHTML = head + rows;
        list.querySelectorAll('.tk-row').forEach(r => r.addEventListener('click', () => openDetail(+r.dataset.id)));
      }

      // ── Detail Drawer ────────────────────────────
      async function openDetail(id) {
        const drawer = document.getElementById('tk-drawer');
        const mask = document.getElementById('tk-mask');
        drawer.innerHTML = `<div class="tk-empty"><i class="ri-loader-4-line" style="animation:spin 1s linear infinite"></i><div>جارٍ التحميل…</div></div>`;
        mask.classList.add('show');

        let t;
        try { t = await api('GET', `/api/MaintenanceTickets/${id}`); }
        catch (e) { drawer.innerHTML = `<div class="tk-empty"><i class="ri-error-warning-line"></i><div>${esc(e.message)}</div></div>`; return; }
        if (!t) return;

        const allowed = TRANSITIONS[t.status] || [];

        const role = (()=>{try{return JSON.parse(localStorage.getItem('authData')||'{}').role;}catch{return '';}})();
        const isAdmin = role === 'Admin' || role === '1';

        drawer.innerHTML = `
          <div class="tk-dhead">
            <h3>
              <span class="tn">${esc(t.ticketNumber)}</span>
              ${statusBadge(t.status)}
              ${t.isPaidMaintenance ? `<span class="tk-paid-tag"><i class="ri-money-dollar-circle-line"></i>مدفوعة</span>` : ''}
            </h3>
            <div style="display:flex;gap:6px;align-items:center">
              ${isAdmin ? `<button class="tk-mclose" id="tk-ddel" title="حذف التذكرة" style="color:#ff6b62"><i class="ri-delete-bin-line"></i></button>` : ''}
              <button class="tk-mclose" id="tk-dclose"><i class="ri-close-line"></i></button>
            </div>
          </div>
          <div class="tk-dbody">

            <div class="tk-section">
              <div class="tk-sec-h"><i class="ri-information-line"></i> بيانات التذكرة</div>
              <div class="tk-grid2">
                <div class="tk-kv"><label>التصنيف</label><span>${esc(t.categoryName)} <small style="color:var(--text-muted)">(${esc(t.warrantyScopeAr)})</small></span></div>
                <div class="tk-kv"><label>المشتري</label><span>${esc(t.buyerFullName)}</span></div>
                <div class="tk-kv"><label>الجوال</label><span dir="ltr">${esc(t.buyerPhone || '—')}</span></div>
                <div class="tk-kv"><label>المشروع</label><span>${esc(t.projectName)}</span></div>
                <div class="tk-kv"><label>العمارة / الدور</label><span>${esc(t.buildingName)} — الدور ${t.floorNumber}</span></div>
                <div class="tk-kv"><label>الوحدة</label><span>${esc(t.unitNumber)}</span></div>
                <div class="tk-kv"><label>تاريخ الفتح</label><span>${fmtDate(t.createdAt)}</span></div>
                <div class="tk-kv"><label>آخر تحديث</label><span>${fmtDate(t.updatedAt)}</span></div>
              </div>
            </div>

            ${t.currentWarranty ? (() => {
              const w = t.currentWarranty;
              const cls = !w.isActive ? 'exp' : (w.daysRemaining <= 90 ? 'warn' : 'act');
              const colors = { act:'#34c759', warn:'#ff9500', exp:'#ff3b30' };
              const bgs    = { act:'rgba(52,199,89,.08)', warn:'rgba(255,149,0,.08)', exp:'rgba(255,59,48,.08)' };
              const labels = { act:'الضمان ساري', warn:'الضمان قارب على الانتهاء', exp:'الضمان منتهي' };
              const remaining = w.isActive
                ? `متبقي <strong>${w.daysRemaining}</strong> يوم (${Math.round(w.daysRemaining/30)} شهر تقريباً)`
                : `منتهي منذ <strong>${w.daysExpired}</strong> يوم`;
              return `
                <div class="tk-section" style="background:${bgs[cls]};border-color:${colors[cls]}40">
                  <div class="tk-sec-h" style="color:${colors[cls]}"><i class="ri-shield-check-line"></i> حالة ضمان "${esc(t.warrantyScopeAr)}"</div>
                  <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px">
                    <div style="font-size:.92rem;font-weight:800;color:${colors[cls]}">${labels[cls]}</div>
                    <div style="font-size:.84rem;color:#cbd6e8">${remaining}</div>
                  </div>
                  <div style="height:6px;background:rgba(var(--fg-rgb), .06);border-radius:6px;overflow:hidden">
                    <div style="height:100%;width:${Math.min(100,w.elapsedPercent)}%;background:${colors[cls]};border-radius:6px"></div>
                  </div>
                  <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:.74rem;color:var(--text-muted)">
                    <span>تاريخ البيع: ${fmtDay(w.startDate)}</span>
                    <span>ينتهي: ${fmtDay(w.endDate)}</span>
                  </div>
                </div>`;
            })() : ''}
            ${t.warrantyNote ? `<div class="tk-warning"><i class="ri-error-warning-line"></i><div>${esc(t.warrantyNote)}</div></div>` : ''}

            <div class="tk-section">
              <div class="tk-sec-h"><i class="ri-file-text-line"></i> الوصف</div>
              <div class="tk-desc">${esc(t.description)}</div>
            </div>

            ${t.attachments?.length ? `
              <div class="tk-section">
                <div class="tk-sec-h"><i class="ri-attachment-2"></i> المرفقات (${t.attachments.length})</div>
                <div class="tk-atts">
                  ${t.attachments.map(a => `
                    <div class="tk-att" data-url="${esc(a.fileUrl)}" data-type="${esc(a.mediaType)}">
                      ${a.mediaType === 'Video'
                        ? `<video src="${esc(a.fileUrl)}" muted></video><span class="tk-att-badge"><i class="ri-play-circle-line"></i>فيديو</span>`
                        : `<img src="${esc(a.fileUrl)}" loading="lazy"><span class="tk-att-badge"><i class="ri-image-line"></i>صورة</span>`}
                    </div>
                  `).join('')}
                </div>
              </div>` : ''}

            ${allowed.length ? `
              <div class="tk-action-box">
                <div class="tk-sec-h" style="margin-bottom:9px"><i class="ri-edit-2-line"></i> تحديث الحالة</div>
                <textarea class="tk-act-note" id="tk-note" placeholder="ملاحظة (اختياري) — تظهر في سجل التذكرة"></textarea>
                <div class="tk-action-row" style="margin-top:10px">
                  ${allowed.map(v => {
                    const st = STATUSES.find(x => x.v === v);
                    return `<button class="tk-act-btn" data-to="${v}"><i class="${st.icon}"></i> ${st.ar}</button>`;
                  }).join('')}
                </div>
              </div>` : `<div class="tk-warning"><i class="ri-lock-line"></i><div>التذكرة في حالة نهائية ولا يمكن تغيير حالتها.</div></div>`}

            <div class="tk-section">
              <div class="tk-sec-h"><i class="ri-time-line"></i> سجل الحالات</div>
              <div class="tk-tl">
                ${(t.history || []).map(h => `
                  <div class="tk-tl-item">
                    <div class="tk-tl-dot"></div>
                    <div class="tk-tl-head">
                      ${h.fromStatusAr ? `<span style="color:var(--text-muted)">${esc(h.fromStatusAr)}</span><i class="ri-arrow-left-line" style="color:var(--text-muted)"></i>` : ''}
                      ${statusBadge(h.toStatus)}
                    </div>
                    <div class="tk-tl-meta">${esc(h.changedByName || '—')} • ${fmtDate(h.changedAt)}</div>
                    ${h.note ? `<div class="tk-tl-note">${esc(h.note)}</div>` : ''}
                  </div>
                `).join('') || '<div style="color:var(--text-muted);font-size:.82rem">لا يوجد سجل</div>'}
              </div>
            </div>

            <div id="tk-confirm-area"></div>
          </div>
        `;

        document.getElementById('tk-dclose').addEventListener('click', closeDrawer);

        const delBtn = document.getElementById('tk-ddel');
        if (delBtn) delBtn.addEventListener('click', () => {
          const confirmArea = document.getElementById('tk-confirm-area');
          if (!confirmArea) return;
          // إذا كان مربع التأكيد مفتوحاً بالفعل — أغلقه
          if (confirmArea.innerHTML) { confirmArea.innerHTML = ''; return; }
          confirmArea.innerHTML = `
            <div class="tk-confirm-box">
              <span class="msg"><i class="ri-error-warning-line"></i>هل تريد حذف التذكرة <strong>${esc(t.ticketNumber)}</strong>؟ لا يمكن التراجع.</span>
              <div class="tk-confirm-actions">
                <button class="tk-conf-no" id="tk-conf-no">إلغاء</button>
                <button class="tk-conf-yes" id="tk-conf-yes"><i class="ri-delete-bin-line"></i> نعم، احذف</button>
              </div>
            </div>
          `;
          confirmArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          document.getElementById('tk-conf-no').addEventListener('click', () => { confirmArea.innerHTML = ''; });
          document.getElementById('tk-conf-yes').addEventListener('click', async () => {
            const yesBtn = document.getElementById('tk-conf-yes');
            if (yesBtn) { yesBtn.disabled = true; yesBtn.innerHTML = `<i class="ri-loader-4-line" style="animation:spin 1s linear infinite"></i>`; }
            try {
              await api('DELETE', `/api/MaintenanceTickets/${id}`);
              window.__showToast?.('تم حذف التذكرة', 'success');
              closeDrawer();
              load();
              window.__refreshTkBadge?.();
            } catch (e) {
              window.__showToast?.(e.message, 'error');
              confirmArea.innerHTML = '';
            }
          });
        });

        drawer.querySelectorAll('.tk-att').forEach(el => el.addEventListener('click', () => openLightbox(el.dataset.url, el.dataset.type)));

        drawer.querySelectorAll('.tk-act-btn').forEach(btn => btn.addEventListener('click', async () => {
          const to = btn.dataset.to;
          const note = document.getElementById('tk-note').value.trim();
          btn.disabled = true;
          try {
            await api('PUT', `/api/MaintenanceTickets/${id}/status`, { status: to, note: note || null });
            window.__showToast?.('تم تحديث الحالة', 'success');
            await load();
            window.__refreshTkBadge?.();
            openDetail(id);
          } catch (e) {
            window.__showToast?.(e.message, 'error');
          } finally { btn.disabled = false; }
        }));
      }

      function closeDrawer() {
        document.getElementById('tk-mask').classList.remove('show');
      }
      document.getElementById('tk-mask').addEventListener('click', e => {
        if (e.target.id === 'tk-mask') closeDrawer();
      });

      // ── Lightbox ───────────────────────
      function openLightbox(url, type) {
        const lb = document.getElementById('tk-lb');
        document.getElementById('tk-lb-body').innerHTML = type === 'Video'
          ? `<video src="${esc(url)}" controls autoplay></video>`
          : `<img src="${esc(url)}">`;
        lb.classList.add('show');
      }
      document.getElementById('tk-lb-close').addEventListener('click', () => {
        document.getElementById('tk-lb').classList.remove('show');
        document.getElementById('tk-lb-body').innerHTML = '';
      });

      // ── Filters wiring ─────────────────
      document.querySelectorAll('.tk-pill').forEach(p => p.addEventListener('click', () => {
        const flt = p.dataset.flt;
        document.querySelectorAll(`.tk-pill[data-flt="${flt}"]`).forEach(x => x.classList.remove('on'));
        p.classList.add('on');
        state.filter[flt] = p.dataset.v;
        applyFilters();
      }));
      document.getElementById('tk-search').addEventListener('input', e => {
        state.filter.q = e.target.value.trim();
        applyFilters();
      });

      // ── Load ───────────────────────────
      async function load() {
        try {
          const data = await api('GET', '/api/MaintenanceTickets');
          state.items = Array.isArray(data) ? data : (data?.data || []);
          applyFilters();
        } catch (e) {
          document.getElementById('tk-list').innerHTML = `<div class="tk-empty"><i class="ri-error-warning-line"></i><div>${esc(e.message)}</div></div>`;
        }
      }
      load();
    }
  };
})();
