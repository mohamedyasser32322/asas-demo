/* ════════════════════════════════════════════════
   tickets.js — Buyer / تذاكر الصيانة
   ════════════════════════════════════════════════ */
(function () {
  'use strict';
  window.__pages = window.__pages || {};

  const STATUSES = [
    { v: 'Open',       ar: 'مفتوحة',         cls: 'btk-st-open', icon: 'ri-mail-open-line' },
    { v: 'InProgress', ar: 'قيد المعالجة',  cls: 'btk-st-prog', icon: 'ri-loader-2-line' },
    { v: 'Resolved',   ar: 'تم الحل',        cls: 'btk-st-res',  icon: 'ri-check-double-line' },
    { v: 'Closed',     ar: 'مغلقة',          cls: 'btk-st-clos', icon: 'ri-archive-line' },
    { v: 'Reopened',   ar: 'أُعيد فتحها',    cls: 'btk-st-reop', icon: 'ri-refresh-line' }
  ];

  const CSS = `
    .btk-wrap { animation: btk-fade .3s ease; padding-bottom:60px; }
    @keyframes btk-fade { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
    @keyframes spin { to { transform:rotate(360deg) } }
    .btk-wrap select option, .btk-mask select option { background:var(--primary); color:var(--light); }

    .btk-head { display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap; margin-bottom:20px; }
    .btk-h-title { font-size:1.5rem; font-weight:800; color:var(--light); display:flex; align-items:center; gap:10px; letter-spacing:-.4px; }
    .btk-h-title i { color:var(--accent); }
    .btk-h-sub { color:var(--text-muted); font-size:.86rem; margin-top:5px; }

    .btk-btn { display:inline-flex; align-items:center; gap:8px; padding:11px 19px; border-radius:12px; font-family:inherit; font-size:.9rem; font-weight:800; cursor:pointer; border:none; transition:all .22s; white-space:nowrap; }
    .btk-btn-primary { background:linear-gradient(135deg,var(--accent),var(--accent-dark)); color:#fff; box-shadow:0 4px 14px rgba(var(--accent-rgb),.3); }
    .btk-btn-primary:hover { transform:translateY(-1px); box-shadow:0 8px 22px rgba(var(--accent-rgb),.45); }
    .btk-btn-ghost { background:var(--surface-tint); color:var(--light); border:1.5px solid var(--border); }
    .btk-btn-ghost:hover { background:var(--hover-tint); }
    .btk-btn-danger { background:rgba(255,59,48,.12); color:var(--danger); border:1.5px solid rgba(255,59,48,.3); }

    .btk-list { display:flex; flex-direction:column; gap:12px; }

    .btk-row {
      background:linear-gradient(160deg,var(--card-hover),var(--card-bg));
      border:1px solid var(--border);
      border-radius:14px;
      padding:14px 18px;
      cursor:pointer;
      transition:all .25s;
      display:grid;
      grid-template-columns: 1.2fr 2fr 1fr auto;
      gap:14px;
      align-items:center;
    }
    .btk-row:hover { border-color:rgba(var(--accent-rgb),.35); transform:translateY(-2px); box-shadow:0 8px 22px rgba(0,0,0,.24); }

    /* العمود 1: الرقم + الحالة */
    .btk-r-col1 { display:flex; flex-direction:column; gap:6px; min-width:0; }
    .btk-tn { font-family:'Consolas',monospace; font-weight:800; color:var(--accent); font-size:.92rem; letter-spacing:.4px; }

    /* العمود 2: التصنيف + الوحدة */
    .btk-r-col2 { display:flex; flex-direction:column; gap:4px; min-width:0; }
    .btk-r-cat { color:var(--light); font-size:.95rem; font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    .btk-r-meta { color:var(--text-muted); font-size:.76rem; display:flex; flex-wrap:wrap; gap:10px; align-items:center; }
    .btk-r-meta i { font-size:.85rem; color:var(--text-muted); opacity:.8; }
    .btk-r-meta span { display:inline-flex; align-items:center; gap:4px; }

    /* العمود 3: التاريخ */
    .btk-r-col3 { display:flex; flex-direction:column; gap:4px; }
    .btk-r-date { color:var(--light); font-size:.74rem; font-family:'Consolas','Segoe UI',monospace; letter-spacing:.3px; direction:ltr; text-align:left; }
    .btk-r-date-lbl { color:var(--text-muted); font-size:.66rem; font-weight:700; text-transform:uppercase; letter-spacing:.3px; }

    /* العمود 4: السهم */
    .btk-r-arrow { color:var(--accent); font-size:1.3rem; opacity:.5; transition:all .2s; }
    .btk-row:hover .btk-r-arrow { opacity:1; transform:translateX(-3px); }

    .btk-paid-tag-inline { display:inline-flex; align-items:center; gap:3px; padding:2px 7px; border-radius:10px; font-size:.65rem; font-weight:800; background:rgba(255,149,0,.12); color:#ff9500; border:1px solid rgba(255,149,0,.3); margin-right:6px; }

    @media(max-width:780px) {
      .btk-row { grid-template-columns: 1fr; gap:8px; }
      .btk-r-arrow { display:none; }
    }

    .btk-st { display:inline-flex; align-items:center; gap:5px; padding:5px 11px; border-radius:18px; font-size:.74rem; font-weight:800; white-space:nowrap; }
    .btk-st-open { background:rgba(var(--accent-rgb),.15);  color:var(--accent); }
    .btk-st-prog { background:rgba(255,204,0,.15);   color:#ffcc00; }
    .btk-st-res  { background:rgba(52,199,89,.15);   color:#34c759; }
    .btk-st-clos { background:var(--surface-tint); color:var(--text-muted); }
    .btk-st-reop { background:rgba(255,149,0,.15);   color:#ff9500; }
    .btk-paid-tag { display:inline-flex; align-items:center; gap:4px; padding:4px 10px; border-radius:14px; font-size:.7rem; font-weight:800; background:rgba(255,149,0,.12); color:#ff9500; border:1px solid rgba(255,149,0,.3); }

    .btk-empty { text-align:center; padding:80px 20px; color:var(--text-muted); }
    .btk-empty i { font-size:3.5rem; opacity:.4; display:block; margin-bottom:14px; }

    /* ── Modal & Drawer ─────────────────── */
    .btk-mask { position:fixed; inset:0; background:rgba(0,0,0,.72); backdrop-filter:blur(8px); z-index:9000; display:none; align-items:center; justify-content:center; padding:20px; }
    .btk-mask.show { display:flex; animation:btk-fade .2s; }
    .btk-mask.drawer { justify-content:flex-start; align-items:stretch; padding:0; }
    .btk-modal { background:linear-gradient(160deg,var(--card-bg),var(--primary-deep)); border:1px solid var(--border-hover); border-radius:20px; max-width:640px; width:100%; max-height:92vh; overflow-y:auto; }
    .btk-mask.drawer .btk-modal { max-width:680px; border-radius:0; max-height:none; height:100vh; }

    .btk-mhead { padding:18px 22px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:flex-start; gap:10px; position:sticky; top:0; background:rgba(var(--bg-rgb),.97); backdrop-filter:blur(10px); z-index:5; }
    .btk-mhead h3 { color:var(--light); font-size:1rem; font-weight:800; display:flex; align-items:center; gap:8px; flex-wrap:wrap; line-height:1.5; }
    .btk-mhead h3 i { color:var(--accent); }
    .btk-mclose { background:none; border:none; color:var(--text-muted); font-size:1.5rem; cursor:pointer; padding:4px; }
    .btk-mclose:hover { color:var(--light); }
    .btk-mbody { padding:22px; display:flex; flex-direction:column; gap:16px; }

    .btk-field label { display:block; font-size:.82rem; font-weight:700; color:var(--light); margin-bottom:7px; }
    .btk-field select, .btk-field textarea {
      width:100%; padding:11px 14px; border-radius:11px;
      background:var(--surface-tint); border:1.5px solid var(--border);
      color:var(--light); font-family:inherit; font-size:.9rem; transition:all .2s; direction:rtl;
    }
    .btk-field select:focus, .btk-field textarea:focus { outline:none; border-color:var(--accent); background:rgba(var(--accent-rgb),.06); }
    .btk-field textarea { min-height:110px; resize:vertical; line-height:1.7; }

    .btk-warning { background:rgba(255,149,0,.08); border:1px solid rgba(255,149,0,.3); border-radius:11px; padding:12px 15px; color:#ff9500; font-size:.86rem; display:flex; align-items:flex-start; gap:10px; line-height:1.7; }
    .btk-warning i { font-size:1.15rem; margin-top:2px; }

    /* ── Upload zone ─────────────────────── */
    .btk-up { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
    .btk-up label {
      display:flex; flex-direction:column; align-items:center; justify-content:center; gap:7px;
      padding:18px 14px; border-radius:13px; border:2px dashed var(--border-hover);
      background:var(--surface-tint); color:var(--text-muted); font-size:.85rem; cursor:pointer; transition:all .2s; text-align:center;
    }
    .btk-up label:hover { border-color:var(--accent); background:rgba(var(--accent-rgb),.05); color:var(--light); }
    .btk-up label i { font-size:1.7rem; color:var(--accent); }
    .btk-up input[type=file] { display:none; }

    .btk-up-preview { display:grid; grid-template-columns:repeat(auto-fill,minmax(90px,1fr)); gap:8px; margin-top:10px; }
    .btk-up-thumb { position:relative; aspect-ratio:1/1; border-radius:10px; overflow:hidden; background:#000; border:1px solid var(--border); }
    .btk-up-thumb img, .btk-up-thumb video { width:100%; height:100%; object-fit:cover; }
    .btk-up-thumb .btk-up-del { position:absolute; top:3px; left:3px; background:rgba(255,59,48,.85); color:var(--light); border:none; width:22px; height:22px; border-radius:50%; cursor:pointer; font-size:.8rem; display:flex; align-items:center; justify-content:center; }
    .btk-up-thumb .btk-up-badge { position:absolute; bottom:3px; right:3px; background:rgba(0,0,0,.7); color:#fff; font-size:.62rem; font-weight:800; padding:2px 7px; border-radius:8px; }

    .btk-mfoot { padding:14px 22px 22px; display:flex; justify-content:flex-end; gap:10px; }

    /* ── Detail Drawer Body ──────────────── */
    .btk-section { background:var(--surface-tint); border:1px solid var(--border); border-radius:13px; padding:14px 16px; }
    .btk-sec-h { font-size:.78rem; font-weight:800; color:var(--light); text-transform:uppercase; letter-spacing:.5px; margin-bottom:10px; display:flex; align-items:center; gap:7px; }
    .btk-sec-h i { color:var(--accent); }
    .btk-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:12px 16px; }
    @media(max-width:520px){ .btk-grid2 { grid-template-columns:1fr; } }
    .btk-kv { display:flex; flex-direction:column; gap:4px; min-width:0; padding:8px 10px; background:var(--surface-tint); border-radius:8px; border:1px solid var(--border); }
    .btk-kv label { font-size:.7rem; color:var(--text-muted); font-weight:700; display:block; letter-spacing:.3px; }
    .btk-kv span { color:var(--light); font-size:.85rem; font-weight:600; word-break:break-word; overflow-wrap:anywhere; }
    .btk-kv span[dir="ltr"] { font-family:'Consolas','Segoe UI',monospace; letter-spacing:.4px; }
    .btk-desc { color:var(--light); font-size:.9rem; line-height:1.7; white-space:pre-wrap; word-break:break-word; }

    .btk-tl { position:relative; padding-right:24px; }
    .btk-tl::before { content:''; position:absolute; right:7px; top:6px; bottom:6px; width:2px; background:var(--border); }
    .btk-tl-item { position:relative; padding:0 0 14px; }
    .btk-tl-item:last-child { padding-bottom:0; }
    .btk-tl-dot { position:absolute; right:-21px; top:5px; width:16px; height:16px; border-radius:50%; background:var(--accent); border:3px solid var(--card-bg); box-shadow:0 0 0 2px rgba(var(--accent-rgb),.2); }
    .btk-tl-head { display:flex; flex-wrap:wrap; gap:8px; align-items:center; font-size:.82rem; color:var(--light); font-weight:700; }
    .btk-tl-meta { font-size:.72rem; color:var(--text-muted); margin-top:3px; }
    .btk-tl-note { font-size:.82rem; color:var(--light); margin-top:5px; padding:7px 11px; background:var(--surface-tint); border-radius:8px; line-height:1.55; }

    .btk-atts { display:grid; grid-template-columns:repeat(auto-fill,minmax(100px,1fr)); gap:8px; }
    .btk-att { position:relative; aspect-ratio:1/1; border-radius:11px; overflow:hidden; cursor:pointer; transition:all .2s; }
    .btk-att:hover { transform:scale(1.04); }
    .btk-att img, .btk-att video { width:100%; height:100%; object-fit:cover; }
    .btk-att .badge { position:absolute; top:5px; right:5px; padding:2px 7px; border-radius:9px; background:rgba(0,0,0,.7); color:#fff; font-size:.65rem; font-weight:800; }

    .btk-lb { position:fixed; inset:0; background:rgba(0,0,0,.95); z-index:10000; display:none; align-items:center; justify-content:center; padding:20px; }
    .btk-lb.show { display:flex; }
    .btk-lb img, .btk-lb video { max-width:96vw; max-height:92vh; border-radius:10px; }
    .btk-lb-close { position:absolute; top:18px; left:18px; background:rgba(var(--fg-rgb), .1); border:none; color:#fff; width:42px; height:42px; border-radius:50%; cursor:pointer; font-size:1.4rem; }
  `;

  window.__pages['tickets'] = {
    getCSS() { return CSS; },

    async init() {
      const main = document.getElementById('app-main');
      if (!main) return;

      const BASE = window.__API_BASE || (window.location.protocol==='https:'?'':'http://'+location.hostname+':5256');
      const tok = window.__getToken;
      const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
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

      async function api(method, path, body) {
        const opts = { method, headers: { 'Authorization': 'Bearer ' + tok() } };
        if (body !== undefined) { opts.headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(body); }
        const r = await fetch(BASE + path, opts);
        if (r.status === 401) { window.location.href = '/login'; return null; }
        if (!r.ok) {
          let msg = `خطأ ${r.status}`;
          try { const e = await r.json(); msg = e.message || msg; } catch {}
          throw new Error(msg);
        }
        if (r.status === 204) return null;
        return r.json().catch(() => null);
      }
      async function uploadFile(ticketId, file, type) {
        const fd = new FormData();
        fd.append('mediaType', type);
        fd.append('file', file);
        const r = await fetch(`${BASE}/api/MaintenanceTickets/${ticketId}/attachments`, {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + tok() },
          body: fd
        });
        if (!r.ok) { let m=`خطأ ${r.status}`; try{const e=await r.json();m=e.message||m;}catch{} throw new Error(m); }
        return r.json();
      }

      main.innerHTML = `
        <div class="btk-wrap">
          <div class="btk-head">
            <div>
              <div class="btk-h-title"><i class="ri-customer-service-2-line"></i> تذاكر الصيانة</div>
              <div class="btk-h-sub">تابع حالة طلبات الصيانة الخاصة بوحداتك</div>
            </div>
            <button class="btk-btn btk-btn-primary" id="btk-new"><i class="ri-add-circle-line"></i> تذكرة جديدة</button>
          </div>
          <div id="btk-list-wrap"></div>
        </div>

        <div class="btk-mask" id="btk-new-mask"></div>
        <div class="btk-mask" id="btk-det-mask"></div>
        <div class="btk-lb" id="btk-lb">
          <button class="btk-lb-close" id="btk-lb-close"><i class="ri-close-line"></i></button>
          <div id="btk-lb-body"></div>
        </div>
      `;

      const listWrap = document.getElementById('btk-list-wrap');

      function statusBadge(s) {
        const st = STATUSES.find(x => x.v === s) || STATUSES[0];
        return `<span class="btk-st ${st.cls}"><i class="${st.icon}"></i>${st.ar}</span>`;
      }

      // ── Load tickets list ──
      async function load() {
        listWrap.innerHTML = `<div class="btk-empty"><i class="ri-loader-4-line" style="animation:spin 1s linear infinite"></i><div>جارٍ التحميل…</div></div>`;
        try {
          const data = await api('GET', '/api/MaintenanceTickets');
          const items = Array.isArray(data) ? data : (data?.['$values'] || []);
          if (!items.length) {
            listWrap.innerHTML = `<div class="btk-empty"><i class="ri-inbox-line"></i><div>لا توجد تذاكر بعد</div><p style="font-size:.84rem;margin-top:6px">اضغط "تذكرة جديدة" لإنشاء أول طلب صيانة</p></div>`;
            return;
          }
          listWrap.innerHTML = `<div class="btk-list">${items.map(t => `
            <div class="btk-row" data-id="${t.id}">
              <div class="btk-r-col1">
                <span class="btk-tn">${esc(t.ticketNumber)}</span>
                ${statusBadge(t.status)}
              </div>
              <div class="btk-r-col2">
                <div class="btk-r-cat">
                  ${t.isPaidMaintenance ? `<span class="btk-paid-tag-inline"><i class="ri-money-dollar-circle-line"></i>مدفوعة</span>` : ''}
                  ${esc(t.categoryName)}
                </div>
                <div class="btk-r-meta">
                  <span><i class="ri-building-line"></i>${esc(t.projectName)}</span>
                  <span><i class="ri-home-4-line"></i>وحدة ${esc(t.unitNumber)}</span>
                </div>
              </div>
              <div class="btk-r-col3">
                <span class="btk-r-date-lbl">تاريخ الفتح</span>
                <span class="btk-r-date">${fmtDate(t.createdAt)}</span>
              </div>
              <i class="ri-arrow-left-s-line btk-r-arrow"></i>
            </div>
          `).join('')}</div>`;
          listWrap.querySelectorAll('.btk-row').forEach(r => r.addEventListener('click', () => openDetail(+r.dataset.id)));
        } catch (e) {
          listWrap.innerHTML = `<div class="btk-empty"><i class="ri-error-warning-line"></i><div>${esc(e.message)}</div></div>`;
        }
      }

      // ── New Ticket Modal ──
      const newMask = document.getElementById('btk-new-mask');
      const detMask = document.getElementById('btk-det-mask');
      const preUnit = sessionStorage.getItem('__pre_unit'); // قادم من صفحة "وحداتي"
      sessionStorage.removeItem('__pre_unit');

      async function openNewModal(presetUnitId) {
        newMask.innerHTML = `
          <div class="btk-modal">
            <div class="btk-mhead">
              <h3><i class="ri-add-circle-line"></i> تذكرة صيانة جديدة</h3>
              <button class="btk-mclose"><i class="ri-close-line"></i></button>
            </div>
            <div class="btk-mbody">
              <div class="btk-field">
                <label>الوحدة *</label>
                <select id="btk-f-unit"><option value="">— جارٍ التحميل —</option></select>
              </div>
              <div class="btk-field">
                <label>تصنيف الصيانة *</label>
                <select id="btk-f-cat"><option value="">— جارٍ التحميل —</option></select>
              </div>
              <div id="btk-warn-area"></div>
              <div class="btk-field">
                <label>الوصف *</label>
                <textarea id="btk-f-desc" maxlength="4000" placeholder="اشرح المشكلة بالتفصيل..."></textarea>
              </div>
              <div class="btk-field">
                <label>مرفقات (صور / فيديو) — اختياري</label>
                <div class="btk-up">
                  <label><input type="file" id="btk-up-img" accept="image/jpeg,image/png,image/webp" multiple><i class="ri-image-add-line"></i>اضغط لاختيار صور</label>
                  <label><input type="file" id="btk-up-vid" accept="video/mp4,video/webm,video/quicktime"><i class="ri-video-add-line"></i>اضغط لاختيار فيديو</label>
                </div>
                <div class="btk-up-preview" id="btk-up-prev"></div>
              </div>
            </div>
            <div class="btk-mfoot">
              <button class="btk-btn btk-btn-ghost" id="btk-cancel">إلغاء</button>
              <button class="btk-btn btk-btn-primary" id="btk-submit"><i class="ri-send-plane-line"></i> إرسال التذكرة</button>
            </div>
          </div>
        `;
        newMask.classList.add('show');

        const unitSel = document.getElementById('btk-f-unit');
        const catSel  = document.getElementById('btk-f-cat');
        const desc    = document.getElementById('btk-f-desc');
        const warnArea = document.getElementById('btk-warn-area');
        const prev    = document.getElementById('btk-up-prev');
        const pendingFiles = []; // {file, type}

        function renderPreviews() {
          prev.innerHTML = pendingFiles.map((p, i) => {
            const url = URL.createObjectURL(p.file);
            return `<div class="btk-up-thumb">
              ${p.type === 'video' ? `<video src="${url}" muted></video>` : `<img src="${url}">`}
              <span class="btk-up-badge">${p.type === 'video' ? 'فيديو' : 'صورة'}</span>
              <button class="btk-up-del" data-i="${i}"><i class="ri-close-line"></i></button>
            </div>`;
          }).join('');
          prev.querySelectorAll('.btk-up-del').forEach(b => b.addEventListener('click', () => {
            pendingFiles.splice(+b.dataset.i, 1);
            renderPreviews();
          }));
        }
        document.getElementById('btk-up-img').addEventListener('change', e => {
          Array.from(e.target.files).forEach(f => pendingFiles.push({ file: f, type: 'image' }));
          e.target.value = '';
          renderPreviews();
        });
        document.getElementById('btk-up-vid').addEventListener('change', e => {
          Array.from(e.target.files).forEach(f => pendingFiles.push({ file: f, type: 'video' }));
          e.target.value = '';
          renderPreviews();
        });

        // load units + categories
        let units = [], cats = [];
        try {
          [units, cats] = await Promise.all([
            api('GET', '/api/buyer-portal/my-units'),
            api('GET', '/api/MaintenanceCategories')
          ]);
          units = Array.isArray(units) ? units : (units?.['$values'] || []);
          cats  = Array.isArray(cats)  ? cats  : (cats?.['$values']  || []);
          // الوحدات المؤهلة فقط: المشروع جاهز وبدأ الضمان — الوحدات تحت الإنشاء لا تظهر أصلاً
          const eligibleUnits = units.filter(u => u.warrantyStarted);
          if (!eligibleUnits.length) {
            unitSel.innerHTML = '<option value="">— لا توجد وحدات مؤهلة —</option>';
            unitSel.disabled = true;
            warnArea.innerHTML = `<div class="btk-warning" style="background:rgba(var(--accent-rgb),.07);border-color:rgba(var(--accent-rgb),.3);color:var(--accent)"><i class="ri-information-line"></i><div>لا توجد لديك وحدات مؤهلة لطلب الصيانة حالياً — تصبح الوحدة مؤهلة بعد تسليم المشروع وبدء فترة الضمان.</div></div>`;
          } else {
            unitSel.innerHTML = '<option value="">— اختر الوحدة —</option>' + eligibleUnits.map(u =>
              `<option value="${u.unitId}">${esc(u.projectName)} — ${esc(u.buildingName)} — وحدة ${esc(u.unitNumber)}</option>`
            ).join('');
          }
          catSel.innerHTML = '<option value="">— اختر التصنيف —</option>' + cats.filter(c => c.isActive).map(c =>
            `<option value="${c.id}" data-scope="${c.warrantyScope}">${esc(c.nameAr)}</option>`
          ).join('');

          if (presetUnitId && eligibleUnits.some(u => String(u.unitId) === String(presetUnitId))) {
            unitSel.value = String(presetUnitId); checkWarranty();
          }
        } catch (e) {
          window.showBToast?.(e.message, 'error');
        }

        // عطّل/فعّل زر الإرسال — يُستخدم لمنع طلب صيانة لمشروع تحت الإنشاء
        function setSubmitBlocked(blocked) {
          const btn = document.getElementById('btk-submit');
          if (!btn) return;
          btn.disabled = blocked;
          btn.style.opacity = blocked ? '.5' : '';
          btn.style.cursor  = blocked ? 'not-allowed' : '';
        }

        function checkWarranty() {
          const unitId = +unitSel.value;
          warnArea.innerHTML = '';
          setSubmitBlocked(false);
          if (!unitId) return;
          const u = units.find(x => x.unitId === unitId);
          if (!u) return;

          // المشروع لا يزال تحت الإنشاء — لا يُسمح بطلب صيانة (ستكون مدفوعة) قبل التسليم
          if (!u.warrantyStarted) {
            warnArea.innerHTML = `<div class="btk-warning" style="background:rgba(255,59,48,.08);border-color:rgba(255,59,48,.3);color:#ff6b6b"><i class="ri-close-circle-line"></i><div>هذا المشروع لا يزال <strong>تحت الإنشاء</strong> ولم يُسلَّم بعد، لذلك <strong>لا يمكن طلب صيانة</strong> عليه في هذه المرحلة. يمكنك طلب الصيانة بعد تسليم المشروع وبدء فترة الضمان.</div></div>`;
            setSubmitBlocked(true);
            return;
          }

          const catOpt = catSel.options[catSel.selectedIndex];
          const scope = catOpt?.dataset.scope;
          if (!scope || scope === 'None') return;
          const w = (u.warranties || []).find(w => w.scope === scope);
          if (w && !w.isActive) {
            warnArea.innerHTML = `<div class="btk-warning"><i class="ri-error-warning-line"></i><div><strong>تنبيه:</strong> ضمان ${esc(w.scopeAr)} منتهي منذ ${w.daysExpired} يوم. هذه الصيانة ستكون <strong>مدفوعة</strong> ولا تغطيها الشركة.</div></div>`;
          } else if (w && w.daysRemaining <= 90) {
            warnArea.innerHTML = `<div class="btk-warning" style="background:rgba(var(--accent-rgb),.07);border-color:rgba(var(--accent-rgb),.3);color:var(--accent)"><i class="ri-information-line"></i><div>ضمان ${esc(w.scopeAr)} لا يزال ساري لمدة ${w.daysRemaining} يوم — هذه الصيانة <strong>مغطاة بالضمان</strong>.</div></div>`;
          }
        }
        unitSel.addEventListener('change', checkWarranty);
        catSel.addEventListener('change', checkWarranty);

        document.querySelector('#btk-new-mask .btk-mclose').addEventListener('click', closeNewModal);
        document.getElementById('btk-cancel').addEventListener('click', closeNewModal);
        newMask.addEventListener('click', e => { if (e.target === newMask) closeNewModal(); });

        document.getElementById('btk-submit').addEventListener('click', async () => {
          const unitId = +unitSel.value;
          const catId  = +catSel.value;
          const d      = desc.value.trim();
          if (!unitId) { window.showBToast?.('اختر الوحدة', 'error'); return; }
          const selUnit = units.find(x => x.unitId === unitId);
          if (selUnit && !selUnit.warrantyStarted) { window.showBToast?.('لا يمكن طلب صيانة لمشروع لا يزال تحت الإنشاء', 'error'); return; }
          if (!catId)  { window.showBToast?.('اختر التصنيف', 'error'); return; }
          if (d.length < 5) { window.showBToast?.('الوصف يجب أن يكون 5 أحرف على الأقل', 'error'); return; }

          const btn = document.getElementById('btk-submit');
          btn.disabled = true; btn.innerHTML = `<i class="ri-loader-4-line" style="animation:spin 1s linear infinite"></i> جارٍ الإرسال…`;

          try {
            const created = await api('POST', '/api/MaintenanceTickets', { unitId, categoryId: catId, description: d });
            // upload attachments
            for (const p of pendingFiles) {
              try { await uploadFile(created.id, p.file, p.type); }
              catch (e) { window.showBToast?.(`فشل رفع ${p.file.name}: ${e.message}`, 'error'); }
            }
            window.showBToast?.(`تم إنشاء التذكرة ${created.ticketNumber}`, 'success');
            closeNewModal();
            load();
          } catch (e) {
            window.showBToast?.(e.message, 'error');
            btn.disabled = false; btn.innerHTML = `<i class="ri-send-plane-line"></i> إرسال التذكرة`;
          }
        });
      }
      function closeNewModal() { newMask.classList.remove('show'); newMask.innerHTML = ''; }
      document.getElementById('btk-new').addEventListener('click', () => openNewModal(null));

      // ── Detail Drawer ──
      async function openDetail(id) {
        detMask.innerHTML = `<div class="btk-modal"><div class="btk-empty"><i class="ri-loader-4-line" style="animation:spin 1s linear infinite"></i><div>جارٍ التحميل…</div></div></div>`;
        detMask.classList.add('show');

        let t;
        try { t = await api('GET', `/api/MaintenanceTickets/${id}`); }
        catch (e) { detMask.innerHTML = `<div class="btk-modal"><div class="btk-empty"><i class="ri-error-warning-line"></i><div>${esc(e.message)}</div></div></div>`; return; }
        if (!t) return;

        const canReopen = t.status === 'Closed' || t.status === 'Resolved';

        detMask.innerHTML = `
          <div class="btk-modal">
            <div class="btk-mhead">
              <h3>
                <span class="btk-tn">${esc(t.ticketNumber)}</span>
                ${statusBadge(t.status)}
                ${t.isPaidMaintenance ? `<span class="btk-paid-tag"><i class="ri-money-dollar-circle-line"></i> مدفوعة</span>` : ''}
              </h3>
              <button class="btk-mclose"><i class="ri-close-line"></i></button>
            </div>
            <div class="btk-mbody">
              <div class="btk-section">
                <div class="btk-sec-h"><i class="ri-information-line"></i> البيانات</div>
                <div class="btk-grid2">
                  <div class="btk-kv"><label>التصنيف</label><span>${esc(t.categoryName)}</span></div>
                  <div class="btk-kv"><label>نطاق الضمان</label><span>${esc(t.warrantyScopeAr)}</span></div>
                  <div class="btk-kv"><label>المشروع</label><span>${esc(t.projectName)}</span></div>
                  <div class="btk-kv"><label>الوحدة</label><span>${esc(t.buildingName)} — ${esc(t.unitNumber)}</span></div>
                  <div class="btk-kv"><label>تاريخ الفتح</label><span>${fmtDate(t.createdAt)}</span></div>
                  <div class="btk-kv"><label>آخر تحديث</label><span>${fmtDate(t.updatedAt)}</span></div>
                </div>
              </div>

              ${t.warrantyNote ? `<div class="btk-warning"><i class="ri-error-warning-line"></i><div>${esc(t.warrantyNote)}</div></div>` : ''}

              <div class="btk-section">
                <div class="btk-sec-h"><i class="ri-file-text-line"></i> الوصف</div>
                <div class="btk-desc">${esc(t.description)}</div>
              </div>

              ${t.attachments?.length ? `
                <div class="btk-section">
                  <div class="btk-sec-h"><i class="ri-attachment-2"></i> المرفقات (${t.attachments.length})</div>
                  <div class="btk-atts">
                    ${t.attachments.map(a => `
                      <div class="btk-att" data-url="${esc(a.fileUrl)}" data-type="${esc(a.mediaType)}">
                        ${a.mediaType === 'Video'
                          ? `<video src="${esc(a.fileUrl)}" muted></video><span class="badge"><i class="ri-play-circle-line"></i></span>`
                          : `<img src="${esc(a.fileUrl)}" loading="lazy"><span class="badge"><i class="ri-image-line"></i></span>`}
                      </div>
                    `).join('')}
                  </div>
                </div>` : ''}

              <div class="btk-section">
                <div class="btk-sec-h"><i class="ri-time-line"></i> الرحلة</div>
                <div class="btk-tl">
                  ${(t.history || []).map(h => `
                    <div class="btk-tl-item">
                      <div class="btk-tl-dot"></div>
                      <div class="btk-tl-head">
                        ${h.fromStatusAr ? `<span style="color:var(--text-muted)">${esc(h.fromStatusAr)}</span><i class="ri-arrow-left-line" style="color:var(--text-muted)"></i>` : ''}
                        ${statusBadge(h.toStatus)}
                      </div>
                      <div class="btk-tl-meta">${esc(h.changedByName || '—')} • ${fmtDate(h.changedAt)}</div>
                      ${h.note ? `<div class="btk-tl-note">${esc(h.note)}</div>` : ''}
                    </div>
                  `).join('') || '<div style="color:var(--text-muted);font-size:.82rem">لا يوجد سجل</div>'}
                </div>
              </div>

              ${canReopen ? `
                <div class="btk-section" id="btk-reopen-box">
                  <div class="btk-sec-h"><i class="ri-refresh-line"></i> إعادة فتح التذكرة</div>
                  <div class="btk-field" style="margin-bottom:10px">
                    <label>سبب إعادة الفتح (اختياري)</label>
                    <textarea id="btk-reopen-note" rows="3" placeholder="اشرح سبب إعادة الفتح…"></textarea>
                  </div>
                  <button class="btk-btn btk-btn-primary" id="btk-reopen" style="width:100%"><i class="ri-refresh-line"></i> إعادة فتح التذكرة</button>
                </div>
              ` : ''}
            </div>
          </div>
        `;

        document.querySelector('#btk-det-mask .btk-mclose').addEventListener('click', closeDetail);
        detMask.querySelectorAll('.btk-att').forEach(el => el.addEventListener('click', () => openLb(el.dataset.url, el.dataset.type)));

        const reopenBtn = document.getElementById('btk-reopen');
        if (reopenBtn) reopenBtn.addEventListener('click', async () => {
          const noteEl = document.getElementById('btk-reopen-note');
          const note = noteEl ? noteEl.value.trim() : '';
          reopenBtn.disabled = true;
          reopenBtn.innerHTML = `<i class="ri-loader-4-line" style="animation:spin 1s linear infinite"></i> جارٍ المعالجة…`;
          try {
            await api('POST', `/api/MaintenanceTickets/${id}/reopen`, { note: note || null });
            window.showBToast?.('تمت إعادة فتح التذكرة', 'success');
            closeDetail();
            await load();
          } catch (e) {
            window.showBToast?.(e.message, 'error');
            reopenBtn.disabled = false;
            reopenBtn.innerHTML = `<i class="ri-refresh-line"></i> إعادة فتح التذكرة`;
          }
        });
      }
      function closeDetail() { detMask.classList.remove('show'); detMask.innerHTML = ''; }
      detMask.addEventListener('click', e => { if (e.target === detMask) closeDetail(); });

      // ── Lightbox ──
      const lb = document.getElementById('btk-lb');
      function openLb(url, type) {
        document.getElementById('btk-lb-body').innerHTML = type === 'Video'
          ? `<video src="${esc(url)}" controls autoplay></video>`
          : `<img src="${esc(url)}">`;
        lb.classList.add('show');
      }
      document.getElementById('btk-lb-close').addEventListener('click', () => { lb.classList.remove('show'); document.getElementById('btk-lb-body').innerHTML = ''; });

      // ── boot ──
      await load();
      if (preUnit) openNewModal(+preUnit);
    }
  };
})();
