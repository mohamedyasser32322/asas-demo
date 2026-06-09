/* ════════════════════════════════════════════════
   my-units.js — Buyer / الصفحة الرئيسية الموحّدة
   وحداتي + الإحصائيات + حالة الضمان + وثائق الضمان
   + بوابة الدخول لمراحل البناء وطلب الصيانة
   ════════════════════════════════════════════════ */
(function () {
  'use strict';
  window.__pages = window.__pages || {};

  const SCOPE_META = {
    Elevator:   { ar: 'المصعد',           icon: 'ri-arrow-up-down-line',       color: 'var(--accent)' },
    Plumbing:   { ar: 'السباكة',          icon: 'ri-drop-line',                color: '#2dd4bf' },
    Electrical: { ar: 'الكهرباء',         icon: 'ri-flashlight-line',          color: '#ffcc00' },
    Structural: { ar: 'الهيكل الإنشائي', icon: 'ri-building-3-line',          color: '#af52de' }
  };

  const CSS = `
    .mu-wrap { animation: mu-fade .35s ease; padding-bottom:60px; }
    @keyframes mu-fade { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
    @keyframes spin { to { transform:rotate(360deg) } }
    @keyframes barFill { from{width:0} }

    /* ── Hero greeting ──────────────────── */
    .mu-hero { position:relative; overflow:hidden; background:linear-gradient(135deg,rgba(var(--accent-rgb),.14),rgba(var(--accent-rgb),.03) 60%),var(--card-bg); border:1px solid rgba(var(--accent-rgb),.2); border-radius:22px; padding:26px 30px; margin-bottom:20px; }
    .mu-hero::after { content:''; position:absolute; top:-45%; left:-8%; width:280px; height:280px; border-radius:50%; background:radial-gradient(circle,rgba(var(--accent-rgb),.18),transparent 70%); pointer-events:none; }
    .mu-hero h2 { font-size:1.5rem; font-weight:800; margin-bottom:6px; letter-spacing:-.4px; color:var(--light); }
    .mu-hero p  { color:var(--text-muted); font-size:.9rem; }

    /* ── Stats ──────────────────────────── */
    .mu-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:14px; margin-bottom:20px; }
    .mu-stat { background:var(--card-bg); border:1px solid var(--border); border-radius:18px; padding:18px 20px; display:flex; align-items:center; gap:14px; transition:all .3s; animation:mu-fade .5s ease both; }
    .mu-stat:nth-child(2){animation-delay:.06s} .mu-stat:nth-child(3){animation-delay:.12s} .mu-stat:nth-child(4){animation-delay:.18s}
    .mu-stat:hover { transform:translateY(-3px); border-color:var(--border-hover); box-shadow:0 14px 34px rgba(0,0,0,.22); }
    .mu-stat-icon { width:46px; height:46px; border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:1.3rem; flex-shrink:0; }
    .mu-stat-icon.accent { background:rgba(var(--accent-rgb),.15); color:var(--accent); }
    .mu-stat-icon.green  { background:rgba(52,199,89,.15); color:var(--success); }
    .mu-stat-icon.orange { background:rgba(255,149,0,.15); color:#ff9500; }
    .mu-stat-icon.purple { background:rgba(175,82,222,.15); color:#c77dff; }
    .mu-stat-num { font-size:1.7rem; font-weight:800; line-height:1; color:var(--light); }
    .mu-stat-lbl { font-size:.74rem; color:var(--text-muted); margin-top:4px; font-weight:600; }

    .mu-banner { background:linear-gradient(135deg,rgba(var(--accent-rgb),.14),rgba(var(--accent-rgb),.04)); border:1px solid rgba(var(--accent-rgb),.25); border-radius:14px; padding:13px 17px; color:var(--text-muted); font-size:.86rem; margin-bottom:20px; display:flex; align-items:flex-start; gap:10px; line-height:1.7; }
    .mu-banner i { color:var(--accent); font-size:1.15rem; margin-top:2px; }

    .mu-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(420px,1fr)); gap:20px; align-items:start; }
    @media(max-width:680px){ .mu-grid { grid-template-columns:1fr; } }

    /* ── Card ──────────────────────────── */
    .mu-card { background:linear-gradient(165deg,var(--card-hover),var(--card-bg)); border:1px solid var(--border); border-radius:20px; overflow:hidden; transition:all .3s; box-shadow:0 6px 20px rgba(0,0,0,.16); animation:mu-fade .5s ease both; }
    .mu-card:nth-child(2){animation-delay:.05s} .mu-card:nth-child(3){animation-delay:.1s} .mu-card:nth-child(4){animation-delay:.15s} .mu-card:nth-child(5){animation-delay:.2s} .mu-card:nth-child(6){animation-delay:.25s}
    .mu-card:hover { transform:translateY(-3px); box-shadow:0 16px 40px rgba(0,0,0,.28); border-color:rgba(var(--accent-rgb),.3); }

    /* ── Collapsible header (collapsed = unit number only) ── */
    .mu-card-head { width:100%; display:flex; align-items:center; gap:13px; padding:15px 18px; background:linear-gradient(135deg,rgba(var(--accent-rgb),.1),transparent); border:none; cursor:pointer; font-family:'Tajawal',inherit; text-align:right; transition:background .2s; }
    .mu-card-head:hover { background:linear-gradient(135deg,rgba(var(--accent-rgb),.18),transparent); }
    .mu-unit-badge { width:48px; height:48px; border-radius:14px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:1.15rem; font-weight:800; color:#fff; background:linear-gradient(135deg,var(--accent),var(--accent-dark)); box-shadow:0 4px 12px rgba(var(--accent-rgb),.35); }
    .mu-head-text { flex:1; min-width:0; }
    .mu-unit-title { font-size:1.08rem; font-weight:800; color:var(--light); line-height:1.2; }
    .mu-h-tag { display:inline-flex; align-items:center; gap:5px; margin-top:6px; padding:3px 10px; border-radius:20px; font-size:.67rem; font-weight:800; }
    .mu-h-tag i { font-size:.85rem; }
    .mu-h-tag.act { background:rgba(52,199,89,.15); color:var(--success); }
    .mu-h-tag.uc  { background:rgba(255,149,0,.15); color:#ff9500; }
    .mu-h-tag.rsv { background:rgba(175,82,222,.15); color:#c77dff; }
    .mu-card-caret { color:var(--text-muted); font-size:1.5rem; flex-shrink:0; transition:transform .25s ease; }
    .mu-card.open .mu-card-caret { transform:rotate(180deg); color:var(--accent); }

    .mu-card-body { display:none; border-top:1px solid var(--border); }
    .mu-card.open .mu-card-body { display:block; animation:mu-fade .25s ease; }

    /* ── Detail sections inside body ── */
    .mu-sec { padding:14px 18px; border-bottom:1px solid var(--border); }
    .mu-sec:last-child { border-bottom:none; }
    .mu-sec-h { font-size:.74rem; font-weight:800; color:var(--light); text-transform:uppercase; letter-spacing:.5px; margin-bottom:12px; display:flex; align-items:center; gap:7px; flex-wrap:wrap; }
    .mu-sec-h i { color:var(--accent); }
    .mu-sec-h small { font-size:.68rem; color:var(--text-muted); font-weight:600; }

    /* project header (section title = project name) */
    .mu-proj-head { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
    .mu-proj-ico { width:42px; height:42px; border-radius:12px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:1.25rem; color:var(--accent); background:rgba(var(--accent-rgb),.13); border:1px solid rgba(var(--accent-rgb),.25); }
    .mu-proj-name { font-size:1.05rem; font-weight:800; color:var(--light); line-height:1.3; }
    .mu-c-loc { color:var(--text-muted); font-size:.78rem; margin-top:3px; display:flex; align-items:center; gap:4px; }

    /* spec table */
    .mu-spec { display:grid; grid-template-columns:repeat(2,1fr); gap:1px; background:var(--border); border:1px solid var(--border); border-radius:12px; overflow:hidden; }
    .mu-spec-item { background:var(--card-bg); padding:10px 13px; display:flex; flex-direction:column; gap:3px; }
    .mu-spec-lbl { font-size:.65rem; color:var(--text-muted); font-weight:700; }
    .mu-spec-val { font-size:.88rem; color:var(--light); font-weight:800; }

    /* key facts (price + purchase date) */
    .mu-keyfacts { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
    .mu-kf { display:flex; align-items:center; gap:10px; padding:11px 12px; background:var(--surface-tint); border:1px solid var(--border); border-radius:12px; }
    .mu-kf-ico { width:36px; height:36px; border-radius:10px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:1.05rem; }
    .mu-kf-ico.price { background:rgba(var(--accent-rgb),.13); color:var(--accent); }
    .mu-kf-ico.date  { background:rgba(52,199,89,.13); color:var(--success); }
    .mu-kf-txt { min-width:0; }
    .mu-kf-lbl { font-size:.65rem; color:var(--text-muted); font-weight:700; }
    .mu-kf-val { font-size:.9rem; color:var(--light); font-weight:800; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

    /* ── Warranty items ── */
    .mu-w-startdate { font-size:.72rem; color:var(--text-muted); font-weight:600; margin:-4px 0 10px; }
    .mu-w-item { padding:9px 0; border-bottom:1px dashed var(--border); }
    .mu-w-item:last-child { border-bottom:none; padding-bottom:0; }
    .mu-w-row { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:6px; }
    .mu-w-name { display:flex; align-items:center; gap:7px; font-size:.84rem; font-weight:700; color:var(--light); }
    .mu-w-name i { font-size:1.05rem; }
    .mu-w-st { display:inline-flex; align-items:center; gap:4px; padding:3px 9px; border-radius:12px; font-size:.69rem; font-weight:800; white-space:nowrap; }
    .mu-w-st.act  { background:rgba(52,199,89,.15);  color:var(--success); }
    .mu-w-st.warn { background:rgba(255,149,0,.15);  color:#ff9500; }
    .mu-w-st.exp  { background:rgba(255,59,48,.15);  color:var(--danger); }

    .mu-w-bar-wrap { height:5px; background:var(--surface-tint); border-radius:6px; overflow:hidden; position:relative; }
    .mu-w-bar { height:100%; border-radius:6px; transition:width 1s cubic-bezier(.22,1,.36,1); animation:barFill 1.2s cubic-bezier(.22,1,.36,1); }

    /* ── Documents Section ──────────────── */
    .mu-docs-h { font-size:.74rem; font-weight:800; color:var(--light); text-transform:uppercase; letter-spacing:.5px; margin-bottom:12px; display:flex; align-items:center; gap:7px; }
    .mu-docs-h i { color:var(--accent); }
    .mu-docs-h .mu-doc-badge { font-size:.66rem; padding:2px 8px; border-radius:6px; background:rgba(var(--accent-rgb),.15); color:var(--accent); border:1px solid rgba(var(--accent-rgb),.3); font-weight:700; }
    .mu-doc-row { display:flex; align-items:center; gap:8px; padding:9px 11px; border-radius:10px; background:var(--surface-tint); border:1px solid var(--border); margin-bottom:7px; }
    .mu-doc-row:last-child { margin-bottom:0; }
    .mu-doc-name { flex:1; font-size:.8rem; font-weight:600; color:var(--light); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; display:flex; align-items:center; gap:6px; }
    .mu-doc-name i { color:#ff6b6b; flex-shrink:0; }
    .mu-doc-size { font-size:.68rem; color:var(--text-muted); flex-shrink:0; }
    .mu-doc-btn { display:inline-flex; align-items:center; gap:4px; padding:5px 10px; border-radius:7px; font-family:'Tajawal',sans-serif; font-size:.72rem; font-weight:700; cursor:pointer; border:1px solid; transition:all .2s; white-space:nowrap; flex-shrink:0; }
    .mu-doc-btn.preview { background:rgba(var(--accent-rgb),.1); color:var(--accent); border-color:rgba(var(--accent-rgb),.3); }
    .mu-doc-btn.preview:hover { background:rgba(var(--accent-rgb),.22); }
    .mu-doc-btn.download { background:rgba(52,199,89,.1); color:var(--success); border-color:rgba(52,199,89,.3); }
    .mu-doc-btn.download:hover { background:rgba(52,199,89,.22); }
    .mu-doc-empty, .mu-doc-loading { font-size:.78rem; color:var(--text-muted); opacity:.65; display:flex; align-items:center; gap:6px; padding:2px 0; }

    /* ── Footer / actions ───────────────── */
    .mu-c-foot { padding:14px 18px; background:var(--surface-tint); }
    .mu-req-btn { width:100%; padding:11px; border-radius:11px; border:none; background:linear-gradient(135deg,var(--accent),var(--accent-dark)); color:#fff; font-family:inherit; font-size:.92rem; font-weight:800; cursor:pointer; transition:all .22s; display:flex; align-items:center; justify-content:center; gap:7px; box-shadow:0 4px 14px rgba(var(--accent-rgb),.3); }
    .mu-req-btn:hover:not([disabled]) { transform:translateY(-1px); box-shadow:0 7px 20px rgba(var(--accent-rgb),.45); }
    .mu-req-btn[disabled] { background:var(--surface-tint); color:var(--text-muted); border:1.5px solid var(--border); cursor:not-allowed; box-shadow:none; font-size:.85rem; }
    .mu-req-btn[disabled] i { color:#ff9500; }
    .mu-req-btn i { font-size:1.1rem; }

    /* مراحل البناء — زر ثانوي مفرّغ */
    .mu-constr-btn { width:100%; padding:11px; border-radius:11px; background:rgba(var(--accent-rgb),.1); color:var(--accent); border:1px solid rgba(var(--accent-rgb),.3); font-family:inherit; font-size:.9rem; font-weight:800; cursor:pointer; transition:all .22s; display:flex; align-items:center; justify-content:center; gap:7px; }
    .mu-constr-btn:hover { background:rgba(var(--accent-rgb),.2); border-color:var(--accent); transform:translateY(-1px); }
    .mu-constr-btn i { font-size:1.1rem; }

    .mu-empty { text-align:center; padding:80px 20px; color:var(--text-muted); }
    .mu-empty i { font-size:3.5rem; opacity:.4; display:block; margin-bottom:14px; }
    .mu-empty p { font-size:.92rem; }
  `;

  window.__pages['my-units'] = {
    getCSS() { return CSS; },

    async init() {
      const main = document.getElementById('app-main');
      if (!main) return;

      const BASE = window.__API_BASE || (window.location.protocol==='https:'?'':'http://'+location.hostname+':5256');
      const tok = window.__getToken;
      const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
      const fmtPrice = n => window.fmtMoney(n || 0);
      const fmtDate = d => d ? new Date(d).toLocaleDateString('ar-SA', { calendar:'gregory', numberingSystem:'latn', year:'numeric', month:'short', day:'numeric', timeZone: 'Asia/Riyadh' }) : '—';
      const yearsAr = n => { n = +n || 0; if (n === 1) return 'سنة واحدة'; if (n === 2) return 'سنتان'; if (n >= 3 && n <= 10) return `${n} سنوات`; return `${n} سنة`; };

      /* اسم المشتري للترحيب */
      const ud   = (() => { try { return JSON.parse(localStorage.getItem('authData') || '{}'); } catch { return {}; } })();
      const _fn  = ud.firstName || ud.first_name || ud.FirstName || '';
      const _ln  = ud.lastName  || ud.last_name  || ud.LastName  || '';
      const name = (_fn + ' ' + _ln).trim() || (ud.email || '').split('@')[0] || 'مشتري';

      /* مدد الضمان المخصّصة من الإدارة (brand.json) — تُعرض في البانر */
      let WC = { elevatorYears: 3, plumbingYears: 3, electricalYears: 3, structuralYears: 10 };
      try {
        const br = await fetch(BASE + '/api/Brand');
        if (br.ok) { const bj = await br.json(); if (bj && bj.warranty) WC = { ...WC, ...bj.warranty }; }
      } catch {}

      main.innerHTML = `
        <div class="mu-wrap">
          <div class="mu-hero">
            <h2>أهلاً، ${esc(name)} 👋</h2>
            <p>تابع وحداتك وضماناتك من هنا</p>
          </div>

          <div class="mu-stats" id="mu-stats">
            ${Array(4).fill('<div class="skel" style="height:80px;border-radius:18px"></div>').join('')}
          </div>

          <div class="mu-banner">
            <i class="ri-shield-check-line"></i>
            <div>
              مدد الضمان: المصعد <strong style="color:var(--light)">${yearsAr(WC.elevatorYears)}</strong> · السباكة <strong style="color:var(--light)">${yearsAr(WC.plumbingYears)}</strong> · الكهرباء <strong style="color:var(--light)">${yearsAr(WC.electricalYears)}</strong> · الهيكل <strong style="color:var(--light)">${yearsAr(WC.structuralYears)}</strong>. يبدأ عند استلام المشروع.
            </div>
          </div>

          <div id="mu-content"></div>
        </div>
      `;

      const content = document.getElementById('mu-content');
      content.innerHTML = `<div class="mu-empty"><i class="ri-loader-4-line" style="animation:spin 1s linear infinite"></i><p>جارٍ تحميل وحداتك…</p></div>`;

      try {
        const r = await fetch(BASE + '/api/buyer-portal/my-units', { headers: { 'Authorization': 'Bearer ' + tok() } });
        if (r.status === 401) { window.location.href = '/login'; return; }
        if (!r.ok) throw new Error('فشل في تحميل البيانات');
        const data = await r.json();
        const items = Array.isArray(data) ? data : (data?.['$values'] || []);

        /* ── الإحصائيات ── */
        const total    = items.length;
        const ready    = items.filter(u => u.warrantyStarted).length;
        const reserved = items.filter(u => u.isReserved).length;
        const uc       = total - ready - reserved; // مباعة لكن المشروع لسه تحت الإنشاء
        const statsEl = document.getElementById('mu-stats');
        if (statsEl) statsEl.innerHTML = `
          <div class="mu-stat">
            <div class="mu-stat-icon accent"><i class="ri-home-4-line"></i></div>
            <div><div class="mu-stat-num">${total}</div><div class="mu-stat-lbl">إجمالي وحداتك</div></div>
          </div>
          <div class="mu-stat">
            <div class="mu-stat-icon green"><i class="ri-shield-check-line"></i></div>
            <div><div class="mu-stat-num">${ready}</div><div class="mu-stat-lbl">ضمانات سارية</div></div>
          </div>
          <div class="mu-stat">
            <div class="mu-stat-icon purple"><i class="ri-bookmark-line"></i></div>
            <div><div class="mu-stat-num">${reserved}</div><div class="mu-stat-lbl">محجوزة</div></div>
          </div>
          <div class="mu-stat">
            <div class="mu-stat-icon orange"><i class="ri-hammer-line"></i></div>
            <div><div class="mu-stat-num">${uc}</div><div class="mu-stat-lbl">تحت الإنشاء</div></div>
          </div>`;

        if (!items.length) {
          content.innerHTML = `<div class="mu-empty"><i class="ri-inbox-line"></i><p>لا توجد وحدات مسجلة باسمك حتى الآن.</p></div>`;
          return;
        }

        content.innerHTML = `<div class="mu-grid">${items.map(renderCard).join('')}</div>`;

        /* طلب صيانة → صفحة البلاغات مع تمرير الوحدة */
        content.querySelectorAll('.mu-req-btn[data-unit]').forEach(btn => {
          btn.addEventListener('click', () => {
            sessionStorage.setItem('__pre_unit', String(+btn.dataset.unit));
            window.navigate('tickets');
          });
        });

        /* عرض مراحل البناء → صفحة فرعية drill-down */
        content.querySelectorAll('.mu-constr-btn[data-bid]').forEach(btn => {
          btn.addEventListener('click', () => {
            window.__constructionTarget = {
              buildingId:   btn.dataset.bid,
              buildingName: btn.dataset.bname,
              projectName:  btn.dataset.pname,
              projectId:    btn.dataset.pid,
              floorNum:     btn.dataset.fnum,
              unitNum:      btn.dataset.unum,
              unitId:       btn.dataset.uid,
            };
            window.navigate('construction');
          });
        });

        /* طيّ/فتح الكارت — والوثائق تُحمّل عند أول فتح فقط (lazy) */
        content.querySelectorAll('.mu-card-head').forEach(btn => {
          btn.addEventListener('click', () => {
            const card = btn.closest('.mu-card');
            const opening = !card.classList.contains('open');
            card.classList.toggle('open');
            if (opening) {
              const docSec = card.querySelector('.mu-docs[data-bid]');
              if (docSec && !docSec.dataset.loaded) {
                docSec.dataset.loaded = '1';
                loadBuildingDocs(docSec.dataset.bid, docSec);
              }
            }
          });
        });

      } catch (e) {
        content.innerHTML = `<div class="mu-empty"><i class="ri-error-warning-line"></i><p>${esc(e.message)}</p></div>`;
      }

      /* ── تحميل وثائق الضمان (PDF) لعمارة ── */
      async function loadBuildingDocs(bid, sec) {
        const list = sec.querySelector('.mu-docs-list');
        const hdr  = sec.querySelector('.mu-docs-h');
        if (!list) return;
        try {
          const resp = await fetch(BASE + `/api/WarrantyDocuments/building/${bid}`, { headers: { 'Authorization': 'Bearer ' + tok() } });
          if (!resp.ok) throw new Error(resp.status);
          const data = await resp.json().catch(() => null);
          const docs = Array.isArray(data) ? data : (data?.['$values'] || data?.data || data?.items || []);
          if (!docs || !docs.length) {
            list.innerHTML = `<div class="mu-doc-empty"><i class="ri-file-info-line"></i> لا توجد وثائق ضمان بعد</div>`;
            return;
          }
          if (hdr) hdr.innerHTML = `<i class="ri-folder-shield-2-line"></i> وثائق الضمان <span class="mu-doc-badge">${docs.length} ملف</span>`;
          list.innerHTML = docs.map(doc => {
            const fname  = doc.fileName || doc.name || doc.originalFileName || 'وثيقة ضمان';
            const rawUrl = doc.fileUrl || doc.url || doc.filePath || '';
            if (!rawUrl) return '';
            const sz = doc.fileSizeBytes ? (doc.fileSizeBytes > 1048576 ? (doc.fileSizeBytes/1048576).toFixed(1)+' MB' : (doc.fileSizeBytes/1024).toFixed(0)+' KB') : '';
            const url   = rawUrl.startsWith('http') ? rawUrl : BASE + (rawUrl.startsWith('/') ? rawUrl : '/' + rawUrl);
            const safeU = url.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
            const safeF = String(fname).replace(/\\/g,'\\\\').replace(/'/g,"\\'");
            return `<div class="mu-doc-row">
              <span class="mu-doc-name" title="${esc(fname)}"><i class="ri-file-pdf-2-line"></i>${esc(fname)}</span>
              ${sz ? `<span class="mu-doc-size">${sz}</span>` : ''}
              <button onclick="window.__previewWarranty('${safeU}','${safeF}')" class="mu-doc-btn preview"><i class="ri-eye-line"></i>معاينة</button>
              <button onclick="window.__downloadWarranty('${safeU}','${safeF}')" class="mu-doc-btn download"><i class="ri-download-2-line"></i>تحميل</button>
            </div>`;
          }).join('');
        } catch (e) {
          list.innerHTML = `<div class="mu-doc-empty"><i class="ri-error-warning-line"></i> تعذّر تحميل الوثائق</div>`;
        }
      }

      function warrantyItem(w) {
        const meta = SCOPE_META[w.scope] || { ar: w.scopeAr, icon: 'ri-shield-line', color: 'var(--text-muted)' };
        let cls = 'act', label, barColor;
        if (!w.isActive) {
          cls = 'exp';
          label = `منتهي منذ ${w.daysExpired} يوم`;
          barColor = 'var(--danger)';
        } else if (w.daysRemaining <= 90) {
          cls = 'warn';
          label = `${w.daysRemaining} يوم متبقي`;
          barColor = '#ff9500';
        } else {
          label = `${w.daysRemaining} يوم متبقي`;
          barColor = 'var(--success)';
        }
        const pct = Math.min(100, Math.max(0, w.elapsedPercent));
        return `
          <div class="mu-w-item" title="${esc(meta.ar)} (${w.totalYears} سنين): ${fmtDate(w.startDate)} ← ${fmtDate(w.endDate)}">
            <div class="mu-w-row">
              <div class="mu-w-name"><i class="${meta.icon}" style="color:${meta.color}"></i>${esc(meta.ar)}</div>
              <span class="mu-w-st ${cls}"><i class="ri-${cls === 'act' ? 'checkbox-circle' : cls === 'warn' ? 'alarm-warning' : 'close-circle'}-line"></i>${label}</span>
            </div>
            <div class="mu-w-bar-wrap"><div class="mu-w-bar" style="width:${pct}%;background:${barColor}"></div></div>
          </div>
        `;
      }

      function renderCard(u) {
        const isReady    = u.warrantyStarted;
        const isReserved = !!u.isReserved;
        const warr       = u.warranties || [];

        const tag = isReserved
          ? `<span class="mu-h-tag rsv"><i class="ri-bookmark-line"></i> محجوزة</span>`
          : isReady
            ? `<span class="mu-h-tag act"><i class="ri-shield-check-line"></i> الضمان سارٍ</span>`
            : `<span class="mu-h-tag uc"><i class="ri-time-line"></i> تحت الإنشاء</span>`;

        /* قسم الضمان + الوثائق (يظهر داخل الـ body بعد الضغط) */
        const warrantyBlock = isReady
          ? `<div class="mu-sec">
              <div class="mu-sec-h"><i class="ri-shield-check-line"></i> حالة الضمانات</div>
              <div class="mu-w-startdate">بداية الضمان: ${fmtDate(u.warrantyStartDate)}</div>
              ${warr.map(warrantyItem).join('')}
            </div>
            <div class="mu-sec mu-docs" data-bid="${u.buildingId}">
              <div class="mu-docs-h"><i class="ri-folder-shield-2-line"></i> وثائق الضمان</div>
              <div class="mu-docs-list">
                <div class="mu-doc-loading"><i class="ri-loader-4-line" style="animation:spin .8s linear infinite"></i> جاري التحميل...</div>
              </div>
            </div>`
          : isReserved
          ? `<div class="mu-sec">
              <div style="background:rgba(175,82,222,.08);border:1px solid rgba(175,82,222,.25);border-radius:12px;padding:12px 16px;display:flex;align-items:center;gap:10px;color:#c77dff;font-size:.85rem;font-weight:700;">
                <i class="ri-bookmark-line" style="font-size:1.3rem;flex-shrink:0"></i>
                هذه الوحدة محجوزة — يبدأ الضمان بعد إتمام البيع وتسليم المشروع
              </div>
            </div>`
          : `<div class="mu-sec">
              <div style="background:rgba(255,149,0,.08);border:1px solid rgba(255,149,0,.2);border-radius:12px;padding:12px 16px;display:flex;align-items:center;gap:10px;color:#ff9500;font-size:.85rem;font-weight:700;">
                <i class="ri-time-line" style="font-size:1.3rem;flex-shrink:0"></i>
                الضمان يبدأ بعد استلام المشروع
              </div>
            </div>`;

        const action = isReady
          ? `<button class="mu-req-btn" data-unit="${u.unitId}"><i class="ri-tools-line"></i> طلب صيانة لهذه الوحدة</button>`
          : `<button class="mu-constr-btn"
               data-bid="${u.buildingId}" data-bname="${esc(u.buildingName)}"
               data-pname="${esc(u.projectName)}" data-pid="${u.projectId}"
               data-fnum="${u.floorNumber}" data-unum="${esc(u.unitNumber)}" data-uid="${u.unitId}">
               <i class="ri-building-4-line"></i> عرض مراحل البناء</button>`;

        return `
          <div class="mu-card">
            <button class="mu-card-head" type="button">
              <div class="mu-unit-badge">${esc(u.unitNumber)}</div>
              <div class="mu-head-text">
                <div class="mu-unit-title">وحدة ${esc(u.unitNumber)}</div>
                ${tag}
              </div>
              <i class="ri-arrow-down-s-line mu-card-caret"></i>
            </button>

            <div class="mu-card-body">
              <div class="mu-sec">
                <div class="mu-proj-head">
                  <div class="mu-proj-ico"><i class="ri-building-4-line"></i></div>
                  <div style="min-width:0">
                    <div class="mu-proj-name">${esc(u.projectName)}</div>
                    <div class="mu-c-loc"><i class="ri-map-pin-line"></i>${esc(u.projectLocation)}</div>
                  </div>
                </div>
                <div class="mu-spec">
                  <div class="mu-spec-item"><span class="mu-spec-lbl">العمارة</span><span class="mu-spec-val">${esc(u.buildingName)}</span></div>
                  <div class="mu-spec-item"><span class="mu-spec-lbl">الدور</span><span class="mu-spec-val">${u.floorNumber}</span></div>
                  <div class="mu-spec-item"><span class="mu-spec-lbl">النوع</span><span class="mu-spec-val">${esc(u.typeAr)}${u.rooms > 0 ? ` · ${u.rooms} غرف` : ''}</span></div>
                  <div class="mu-spec-item"><span class="mu-spec-lbl">المساحة</span><span class="mu-spec-val">${u.area ? `${u.area} م²` : '—'}</span></div>
                </div>
              </div>

              <div class="mu-sec mu-keyfacts">
                <div class="mu-kf">
                  <div class="mu-kf-ico price"><i class="ri-price-tag-3-line"></i></div>
                  <div class="mu-kf-txt"><div class="mu-kf-lbl">قيمة الوحدة</div><div class="mu-kf-val">${fmtPrice(u.price)}</div></div>
                </div>
                <div class="mu-kf">
                  <div class="mu-kf-ico date"><i class="ri-calendar-check-line"></i></div>
                  <div class="mu-kf-txt"><div class="mu-kf-lbl">${isReserved ? 'تاريخ الحجز' : 'تاريخ الشراء'}</div><div class="mu-kf-val">${fmtDate(u.saleDate)}</div></div>
                </div>
              </div>

              ${warrantyBlock}

              <div class="mu-c-foot">${action}</div>
            </div>
          </div>
        `;
      }
    }
  };
})();
