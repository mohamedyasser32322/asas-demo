/* PAGE MODULE: log — SPA v3 | PERFORMANCE OPTIMIZED */
(function () {
  window.__pages = window.__pages || {};

  const _css = `
    :root {
      --log-bg:#060f1e;--log-surface:#0b1a2e;--log-card:#0f2244;--log-card2:#132a54;
      --log-border:rgba(var(--fg-rgb), 0.07);--log-border2:rgba(var(--fg-rgb), 0.15);
      --log-text:#e8edf5;--log-muted:#5a7499;--log-muted2:#8099bb;
      --log-accent:#3b7ff5;--log-accent2:#5b9bff;
      --log-green:#22c55e;--log-yellow:#eab308;--log-red:#ef4444;--log-purple:#8b5cf6;
    }
    @keyframes log-fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes log-fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes log-spin{to{transform:rotate(360deg)}}
    @keyframes log-shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}
    @keyframes log-modalIn{from{opacity:0;transform:translateY(-22px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
    #log-page ::-webkit-scrollbar{width:5px}
    #log-page ::-webkit-scrollbar-track{background:transparent}
    #log-page ::-webkit-scrollbar-thumb{background:rgba(var(--fg-rgb), .1);border-radius:10px}

    .log-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:11px;padding:20px 0;border-bottom:1px solid var(--log-border);margin-bottom:16px}
    .log-stat{background:var(--log-card);border:1px solid var(--log-border);border-radius:13px;padding:15px 16px;display:flex;align-items:center;gap:12px;opacity:0;animation:log-fadeUp .45s ease forwards;transition:.2s}
    .log-stat:hover{border-color:var(--log-border2);transform:translateY(-2px)}
    .log-stat:nth-child(1){animation-delay:.04s}.log-stat:nth-child(2){animation-delay:.09s}
    .log-stat:nth-child(3){animation-delay:.14s}.log-stat:nth-child(4){animation-delay:.19s}
    .log-stat-ico{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.05rem;flex-shrink:0}
    .log-ico-b{background:rgba(59,127,245,.14);color:var(--log-accent2)}
    .log-ico-g{background:rgba(34,197,94,.14);color:var(--log-green)}
    .log-ico-y{background:rgba(234,179,8,.12);color:var(--log-yellow)}
    .log-ico-r{background:rgba(239,68,68,.12);color:var(--log-red)}
    .log-stat-num{font-size:1.65rem;font-weight:900;line-height:1;letter-spacing:-.03em}
    .log-stat-lbl{font-size:.7rem;color:var(--log-muted2);margin-top:3px;font-weight:500}

    .log-controls{display:flex;align-items:center;gap:9px;padding:14px 0;border-bottom:1px solid var(--log-border);flex-wrap:wrap;margin-bottom:16px}
    .log-search-wrap{position:relative;flex:1;min-width:190px;max-width:360px}
    .log-search-ico{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:var(--log-muted);font-size:.9rem;pointer-events:none}
    .log-search-input{width:100%;background:var(--log-card);border:1.5px solid var(--log-border);color:var(--log-text);font-family:'Tajawal',sans-serif;font-size:.86rem;padding:9px 38px 9px 13px;border-radius:9px;transition:.18s}
    .log-search-input:focus{outline:none;border-color:var(--log-accent);background:var(--log-card2)}
    .log-search-input::placeholder{color:var(--log-muted)}
    .log-fsel{background:var(--log-card);border:1.5px solid var(--log-border);color:#e8edf5;font-family:'Tajawal',sans-serif;font-size:.82rem;padding:9px 12px 9px 30px;border-radius:9px;cursor:pointer;transition:border-color .18s,background .18s;appearance:none;background-image:url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235a7499' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");background-repeat:no-repeat;background-position:left 6px center;background-size:13px;min-width:135px;color-scheme:dark}
    .log-fsel:focus{outline:none;border-color:var(--log-accent);background:var(--log-card2)}
    .log-fsel option{background:var(--card-bg);color:#e8edf5}
    .log-cnt-badge{margin-left:auto;font-size:.76rem;color:var(--log-muted2);background:var(--log-card);border:1px solid var(--log-border);padding:5px 11px;border-radius:8px;white-space:nowrap}
    .log-refresh-btn{display:inline-flex;align-items:center;gap:7px;padding:8px 17px;border-radius:9px;font-family:'Tajawal',sans-serif;font-size:.84rem;font-weight:700;cursor:pointer;transition:.18s;border:1.5px solid rgba(59,127,245,.35);background:rgba(59,127,245,.14);color:var(--log-accent2)}
    .log-refresh-btn:hover{background:rgba(59,127,245,.24);border-color:var(--log-accent2)}

    #log-page table{width:100%;border-collapse:separate;border-spacing:0 5px}
    #log-page thead th{font-size:.68rem;font-weight:700;color:var(--log-muted);text-transform:uppercase;letter-spacing:.06em;padding:0 13px 9px;text-align:right;border-bottom:1px solid var(--log-border)}
    #log-page thead th:first-child{padding-right:16px}
    .log-tr{background:var(--log-card);border-radius:11px;cursor:pointer;opacity:0;animation:log-fadeUp .3s ease forwards;transition:background .14s,transform .14s,box-shadow .14s}
    .log-tr:hover{background:var(--log-card2);transform:translateX(3px);box-shadow:0 4px 20px rgba(0,0,0,.35)}
    .log-tr td{padding:12px 13px;border-top:1px solid var(--log-border);border-bottom:1px solid var(--log-border);vertical-align:middle;font-size:.84rem}
    .log-tr td:first-child{border-right:1px solid var(--log-border);border-radius:11px 0 0 11px;padding-right:16px}
    .log-tr td:last-child{border-left:1px solid var(--log-border);border-radius:0 11px 11px 0;padding:0 11px}
    .log-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:6px;font-size:.7rem;font-weight:700}
    .log-badge i{font-size:.74rem}
    .lb-create{background:rgba(34,197,94,.11);color:var(--log-green);border:1px solid rgba(34,197,94,.24)}
    .lb-update{background:rgba(234,179,8,.1);color:var(--log-yellow);border:1px solid rgba(234,179,8,.24)}
    .lb-delete{background:rgba(239,68,68,.11);color:var(--log-red);border:1px solid rgba(239,68,68,.22)}
    .lb-login{background:rgba(59,127,245,.11);color:var(--log-accent2);border:1px solid rgba(59,127,245,.24)}
    .lb-other{background:rgba(var(--fg-rgb), .06);color:var(--log-muted2);border:1px solid var(--log-border)}
    .log-user-cell{display:flex;align-items:center;gap:8px}
    .log-ava{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,rgba(59,127,245,.25),rgba(139,92,246,.25));border:1px solid rgba(59,127,245,.25);display:flex;align-items:center;justify-content:center;font-size:.63rem;font-weight:800;color:var(--log-accent2);flex-shrink:0}
    .log-u-name{font-size:.82rem;font-weight:700}
    .log-u-sub{font-size:.7rem;color:var(--log-muted2);margin-top:1px}
    .log-t-main{font-size:.82rem;font-weight:700}
    .log-t-sub{font-size:.68rem;color:var(--log-muted2);margin-top:2px;display:flex;align-items:center;gap:3px}
    .log-id-pill{font-size:.7rem;font-weight:700;color:var(--log-muted);background:rgba(var(--fg-rgb), .05);padding:2px 7px;border-radius:5px;font-family:monospace}
    .log-ent-tag{font-size:.78rem;font-weight:700;color:rgba(var(--fg-rgb), .8)}
    .log-diff-hint{display:flex;align-items:center;gap:3px;font-size:.62rem;color:var(--log-muted);margin-top:3px}
    .log-row-btn{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;background:none;border:1.5px solid var(--log-border);color:var(--log-muted);cursor:pointer;transition:.18s;font-size:.9rem}
    .log-row-btn:hover{background:rgba(59,127,245,.12);border-color:var(--log-accent);color:var(--log-accent2)}

    /* prefetch indicator — subtle dot on next/prev pg buttons */
    .log-pg-btn.prefetched::after{content:'';display:inline-block;width:5px;height:5px;border-radius:50%;background:var(--log-green);margin-right:4px;opacity:.7}

    .log-skel-wrap{display:flex;flex-direction:column;gap:5px;padding:10px 0}
    .log-skel-row{height:58px;border-radius:11px;background:linear-gradient(90deg,var(--log-card) 0%,var(--log-card2) 50%,var(--log-card) 100%);background-size:800px 100%;animation:log-shimmer 1.5s infinite}
    .log-empty{text-align:center;padding:70px 20px;color:var(--log-muted)}
    .log-empty i{font-size:2.8rem;display:block;margin-bottom:12px;opacity:.25}

    .log-pg-wrap{display:flex;justify-content:center;align-items:center;gap:5px;padding:18px 0 44px;flex-wrap:wrap}
    .log-pg-btn{padding:6px 12px;border-radius:8px;background:var(--log-card);border:1px solid var(--log-border);color:var(--log-muted2);font-family:'Tajawal',sans-serif;font-size:.8rem;font-weight:600;cursor:pointer;transition:.16s;min-width:36px;text-align:center}
    .log-pg-btn:hover:not(:disabled){background:var(--log-card2);color:var(--log-text);border-color:var(--log-border2)}
    .log-pg-btn.active{background:var(--log-accent);color:var(--light);border-color:var(--log-accent)}
    .log-pg-btn:disabled{opacity:.3;cursor:not-allowed}
    .log-pg-info{font-size:.75rem;color:var(--log-muted2);padding:0 8px;white-space:nowrap}

    #log-modal-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.72);z-index:900;backdrop-filter:blur(8px);align-items:center;justify-content:center;padding:20px}
    #log-modal-overlay.open{display:flex;animation:log-fadeIn .2s ease}
    .log-modal{background:var(--log-surface);border:1px solid var(--log-border2);border-radius:18px;width:100%;max-width:800px;max-height:90vh;display:flex;flex-direction:column;animation:log-modalIn .25s cubic-bezier(.34,1.3,.64,1)}
    .log-m-head{padding:20px 24px 16px;border-bottom:1px solid var(--log-border);display:flex;align-items:center;gap:14px;flex-shrink:0}
    .log-m-head-ico{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.15rem;flex-shrink:0}
    .log-m-head-info{flex:1;min-width:0}
    .log-m-head-title{font-size:1rem;font-weight:800;line-height:1.3}
    .log-m-head-sub{font-size:.74rem;color:var(--log-muted2);margin-top:3px}
    .log-m-close{width:36px;height:36px;border-radius:9px;background:rgba(var(--fg-rgb), .05);border:1px solid var(--log-border);color:var(--log-muted2);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.1rem;transition:.18s;flex-shrink:0}
    .log-m-close:hover{background:rgba(var(--fg-rgb), .12);color:var(--log-text);transform:rotate(90deg)}
    .log-m-body{padding:20px 24px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:20px}
    .log-meta-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
    .log-meta-card{background:var(--log-card);border:1px solid var(--log-border);border-radius:12px;padding:13px 15px}
    .log-meta-lbl{font-size:.62rem;font-weight:700;color:var(--log-muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px;display:flex;align-items:center;gap:4px}
    .log-meta-lbl i{font-size:.72rem}
    .log-meta-val{font-size:.88rem;font-weight:700}
    .log-meta-sub{font-size:.72rem;color:var(--log-muted2);margin-top:3px}
    .log-sec-lbl{font-size:.66rem;font-weight:700;color:var(--log-muted);text-transform:uppercase;letter-spacing:.08em;display:flex;align-items:center;gap:5px;margin-bottom:10px}
    .log-sec-lbl i{font-size:.78rem}
    .log-chg-count{margin-right:auto;font-size:.62rem;font-weight:700;padding:3px 8px;border-radius:5px}
    .log-chg-count.c-yellow{color:var(--log-yellow);background:rgba(234,179,8,.1)}
    .log-chg-count.c-green{color:var(--log-green);background:rgba(34,197,94,.1)}
    .log-chg-count.c-red{color:var(--log-red);background:rgba(239,68,68,.1)}
    .log-diff-table{width:100%;border-collapse:collapse;border-radius:12px;overflow:hidden;border:1px solid var(--log-border)}
    .log-diff-table thead th{background:var(--log-card2);padding:9px 14px;font-size:.65rem;font-weight:700;color:var(--log-muted);text-transform:uppercase;letter-spacing:.07em;text-align:right}
    .log-diff-table thead .th-old{color:rgba(239,68,68,.85);border-right:1px solid var(--log-border);border-left:1px solid var(--log-border)}
    .log-diff-table thead .th-new{color:rgba(34,197,94,.85)}
    .log-diff-table tbody tr{border-top:1px solid var(--log-border)}
    .log-diff-table tbody tr:hover{background:rgba(var(--fg-rgb), .025)}
    .log-diff-table td{padding:10px 14px;font-size:.82rem;vertical-align:top}
    .log-td-field{color:var(--log-muted2);font-weight:700;font-size:.75rem;white-space:nowrap;min-width:120px}
    .log-td-old{color:var(--log-red);background:rgba(239,68,68,.05);border-right:1px solid rgba(239,68,68,.15);border-left:1px solid rgba(239,68,68,.15);text-decoration:line-through;opacity:.85}
    .log-td-new{color:var(--log-green);background:rgba(34,197,94,.05)}
    .log-td-same{color:#2a3d55}
    .log-td-only{font-weight:600}
    .log-raw-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .log-raw-box{border-radius:12px;overflow:hidden;border:1px solid var(--log-border)}
    .log-raw-box.old-box{border-color:rgba(239,68,68,.25)}
    .log-raw-box.new-box{border-color:rgba(34,197,94,.25)}
    .log-raw-header{padding:9px 14px;display:flex;align-items:center;gap:7px;font-size:.66rem;font-weight:800;text-transform:uppercase;letter-spacing:.07em}
    .log-raw-box.old-box .log-raw-header{background:rgba(239,68,68,.1);color:rgba(239,68,68,.9)}
    .log-raw-box.new-box .log-raw-header{background:rgba(34,197,94,.1);color:rgba(34,197,94,.9)}
    .log-raw-body{padding:12px 14px;background:rgba(0,0,0,.25)}
    .log-raw-row{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;padding:5px 0;border-bottom:1px solid var(--log-border)}
    .log-raw-row:last-child{border-bottom:none}
    .log-rv-key{font-size:.71rem;color:var(--log-muted2);font-weight:700;flex-shrink:0;padding-top:1px}
    .log-rv-val{font-size:.8rem;font-weight:700;text-align:left;word-break:break-word}
    .log-rv-val.old-color{color:rgba(239,68,68,.9)}
    .log-rv-val.new-color{color:rgba(34,197,94,.9)}
    .log-info-card{background:var(--log-card);border:1px solid var(--log-border);border-radius:12px;overflow:hidden}
    .log-info-row{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:10px 15px;border-bottom:1px solid var(--log-border)}
    .log-info-row:last-child{border-bottom:none}
    .log-i-lbl{font-size:.73rem;color:var(--log-muted2);flex-shrink:0;padding-top:1px}
    .log-i-val{font-size:.84rem;font-weight:700;text-align:left;word-break:break-word}
    .log-i-val.mono{font-family:monospace;font-size:.77rem;color:#7eb8ff}

    #log-toast-container{position:fixed;bottom:18px;left:18px;z-index:2000;display:flex;flex-direction:column;gap:7px;pointer-events:none}
    .log-toast{display:flex;align-items:center;gap:9px;padding:11px 15px;border-radius:10px;background:rgba(8,18,42,.97);border:1px solid rgba(var(--fg-rgb), .09);color:var(--log-text);font-size:.83rem;font-weight:600;animation:log-fadeUp .28s ease;box-shadow:0 8px 28px rgba(0,0,0,.45);pointer-events:all}
    .log-toast.ok{border-color:rgba(34,197,94,.38)}.log-toast.ok i{color:var(--log-green)}
    .log-toast.err{border-color:rgba(239,68,68,.38)}.log-toast.err i{color:var(--log-red)}

    .log-col-sm-hide{display:table-cell}

    @media(max-width:900px){.log-stats{grid-template-columns:repeat(2,1fr)}}
    @media(max-width:680px){
      .log-col-sm-hide{display:none}
      .log-meta-row{grid-template-columns:1fr 1fr}
      .log-raw-grid{grid-template-columns:1fr}
      .log-controls{flex-direction:column;align-items:stretch}
      .log-search-wrap{max-width:100%}
    }
    @media(max-width:480px){
      .log-stats{grid-template-columns:1fr 1fr}
      .log-fsel{min-width:unset;width:100%}
    }
  `;

  window.__pages['log'] = {
    getCSS: function () { return _css; },
    init: async function () {

      const container = document.getElementById('app-main');
      container.innerHTML = `
        <div id="log-page" style="padding:20px 28px 80px;max-width:1400px;margin:0 auto;color:var(--log-text,#e8edf5)">

          <div id="log-toast-container"></div>

          <div id="log-modal-overlay">
            <div class="log-modal" id="log-modal">
              <div class="log-m-head">
                <div class="log-m-head-ico" id="log-m-head-ico"></div>
                <div class="log-m-head-info">
                  <div class="log-m-head-title" id="log-m-head-title">تفاصيل السجل</div>
                  <div class="log-m-head-sub" id="log-m-head-sub"></div>
                </div>
                <button class="log-m-close" onclick="window.closeLogModal()"><i class="ri-close-line"></i></button>
              </div>
              <div class="log-m-body" id="log-m-body"></div>
            </div>
          </div>

          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;padding:24px 0 20px;border-bottom:1px solid var(--log-border);margin-bottom:0;animation:log-fadeUp .3s ease">
            <div style="display:flex;align-items:center;gap:14px">
              <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg,var(--log-accent),var(--log-purple));display:flex;align-items:center;justify-content:center;font-size:1.1rem;color:#fff;box-shadow:0 6px 20px rgba(59,127,245,.3)">
                <i class="ri-file-list-3-line"></i>
              </div>
              <div>
                <div style="font-size:1.05rem;font-weight:800;letter-spacing:-.02em;color:var(--log-text)">سجل النشاطات</div>
                <div style="font-size:.73rem;color:var(--log-muted2);margin-top:2px">جميع العمليات على النظام</div>
              </div>
            </div>
            <button class="log-refresh-btn" onclick="window.loadLogs(1,true)">
              <i class="ri-refresh-line" id="log-refresh-ico"></i> تحديث
            </button>
          </div>

          <div class="log-stats">
            <div class="log-stat"><div class="log-stat-ico log-ico-b"><i class="ri-file-list-3-line"></i></div><div><div class="log-stat-num" id="log-sTotal">0</div><div class="log-stat-lbl">إجمالي السجلات</div></div></div>
            <div class="log-stat"><div class="log-stat-ico log-ico-g"><i class="ri-add-circle-line"></i></div><div><div class="log-stat-num" id="log-sCreate">0</div><div class="log-stat-lbl">إضافة</div></div></div>
            <div class="log-stat"><div class="log-stat-ico log-ico-y"><i class="ri-edit-line"></i></div><div><div class="log-stat-num" id="log-sUpdate">0</div><div class="log-stat-lbl">تعديل</div></div></div>
            <div class="log-stat"><div class="log-stat-ico log-ico-r"><i class="ri-delete-bin-line"></i></div><div><div class="log-stat-num" id="log-sDelete">0</div><div class="log-stat-lbl">حذف</div></div></div>
          </div>

          <div class="log-controls">
            <div class="log-search-wrap">
              <i class="log-search-ico ri-search-line"></i>
              <input id="log-sInput" class="log-search-input" type="text" placeholder="بحث..." oninput="window.handleLogSearch()"/>
            </div>
            <select id="log-aFilter" class="log-fsel" onchange="window.applyLogFilters()">
              <option value="all">جميع الإجراءات</option>
              <option value="create">إضافة</option>
              <option value="update">تعديل</option>
              <option value="delete">حذف</option>
              <option value="other">أخرى</option>
            </select>
            <select id="log-eFilter" class="log-fsel" onchange="window.applyLogFilters()">
              <option value="all">جميع الكيانات</option>
            </select>
            <span class="log-cnt-badge" id="log-resCount">0 سجل</span>
          </div>

          <div style="display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:16px;padding:11px 14px;background:rgba(59,127,245,0.06);border:1px solid rgba(59,127,245,0.18);border-radius:10px;animation:log-fadeUp .3s ease">
            <i class="ri-calendar-line" style="color:var(--log-accent2);font-size:.95rem;flex-shrink:0"></i>
            <span style="font-size:.77rem;font-weight:700;color:var(--log-muted2);white-space:nowrap">فلتر التاريخ:</span>
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
              <label style="font-size:.75rem;color:var(--log-muted2)">من</label>
              <input type="date" id="log-dateFrom" oninput="window.applyLogDateFilter()" style="background:var(--log-card);border:1.5px solid var(--log-border);color:var(--log-text);font-family:'Tajawal',sans-serif;font-size:.81rem;padding:6px 10px;border-radius:8px;outline:none;transition:.18s;color-scheme:dark;cursor:pointer">
              <label style="font-size:.75rem;color:var(--log-muted2)">إلى</label>
              <input type="date" id="log-dateTo" oninput="window.applyLogDateFilter()" style="background:var(--log-card);border:1.5px solid var(--log-border);color:var(--log-text);font-family:'Tajawal',sans-serif;font-size:.81rem;padding:6px 10px;border-radius:8px;outline:none;transition:.18s;color-scheme:dark;cursor:pointer">
              <button id="log-dateClearBtn" onclick="window.clearLogDateFilter()" style="display:none;align-items:center;gap:4px;padding:5px 11px;border-radius:7px;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);color:var(--log-red);font-family:'Tajawal',sans-serif;font-size:.76rem;font-weight:700;cursor:pointer;transition:.18s;white-space:nowrap">
                <i class="ri-close-circle-line"></i> مسح
              </button>
            </div>
          </div>

          <div id="log-tableArea"></div>
          <div class="log-pg-wrap" id="log-pgWrap"></div>
        </div>
      `;

      document.getElementById('log-modal-overlay').addEventListener('click', e => {
        if (e.target === document.getElementById('log-modal-overlay')) closeLogModal();
      }, { signal: window.__pageAbortSignal });
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeLogModal();
      }, { signal: window.__pageAbortSignal });

      /* ══════════════════════════════════════
         CONFIG
      ══════════════════════════════════════ */
      const API_BASE = window.location.origin;
      const PER_PAGE = 20;

      /* ══════════════════════════════════════
         STATE
      ══════════════════════════════════════ */
      let currentPage  = 1;
      let totalCount   = 0;
      let totalPages   = 1;
      let isLoading    = false;
      let searchQuery  = '';
      let actionFilter = 'all';
      let entityFilter = 'all';
      let logDateFrom  = '';
      let logDateTo    = '';

      // ── PREFETCH CACHE ──
      // key: "page|search|action|entity|from|to"  →  { logs, meta, totalPages }
      const _cache = new Map();
      const CACHE_TTL = 90_000; // 90s بعدين يُعاد الجلب

      function _cacheKey(page) {
        return `${page}|${searchQuery}|${actionFilter}|${entityFilter}|${logDateFrom}|${logDateTo}`;
      }
      function _cacheSet(page, payload) {
        _cache.set(_cacheKey(page), { ...payload, _ts: Date.now() });
      }
      function _cacheGet(page) {
        const entry = _cache.get(_cacheKey(page));
        if (!entry) return null;
        if (Date.now() - entry._ts > CACHE_TTL) { _cache.delete(_cacheKey(page)); return null; }
        return entry;
      }
      function _cacheClear() { _cache.clear(); }

      /* ══════════════════════════════════════
         MAPS & HELPERS
      ══════════════════════════════════════ */
      const ACTION_MAP = {
        create:{ label:'إضافة', icon:'ri-add-circle-line' },
        update:{ label:'تعديل', icon:'ri-edit-line' },
        delete:{ label:'حذف',   icon:'ri-delete-bin-line' },
        login: { label:'دخول',  icon:'ri-login-circle-line' },
        other: { label:'نشاط',  icon:'ri-information-line' },
      };
      const ENTITY_AR = {
        project:'مشروع',projects:'مشروع',building:'مبنى',buildings:'مبنى',
        floor:'دور',floors:'دور',unit:'وحدة',units:'وحدة',
        booking:'حجز',bookings:'حجز',buyer:'عميل',buyers:'عميل',
        user:'مستخدم',users:'مستخدم',notification:'إشعار',notifications:'إشعارات',
        constructionstage:'مرحلة بناء',buildingimage:'صورة مبنى',
        stageimage:'صورة مرحلة',auth:'المصادقة',activitylog:'سجل النشاط',
      };
      const STAGE_AR = {
        SitePreparation:'تجهيز الموقع',Foundation:'الأساسات',
        Structure:'الهيكل الإنشائي',MasonryAndWalls:'المباني والحوائط',
        InitialFinishing:'التشطيبات الأولية',FinalFinishing:'التشطيبات النهائية',Handover:'التسليم',
      };
      const FIELD_AR = {
        stageName:'المرحلة',status:'الحالة',isCompleted:'مكتملة',notes:'ملاحظات',
        endDate:'تاريخ الاكتمال',startDate:'تاريخ البدء',buildingName:'العمارة',
        projectName:'المشروع',buildingId:'رقم العمارة',name:'الاسم',location:'الموقع',
        totalUnits:'إجمالي الوحدات',floorCount:'عدد الأدوار',unitCount:'عدد الوحدات',
        unitNumber:'رقم الوحدة',floorId:'رقم الدور',area:'المساحة',price:'السعر',
        unitId:'رقم الوحدة',buyerId:'رقم العميل',bookingDate:'تاريخ الحجز',
        firstName:'الاسم الأول',lastName:'الاسم الأخير',email:'البريد الإلكتروني',
        phone:'الهاتف',roleId:'الدور الوظيفي',projectId:'رقم المشروع',
        floorNumber:'رقم الدور',caption:'التعليق',description:'الوصف',phoneNumber:'الهاتف',
      };
      const SKIP = new Set(['reportData','imageUrl','id','createdAt','updatedAt','hashPassword','passwordHash']);

      function toAr(n) {
        // Returns English digits (renamed but keeping function for compatibility)
        if (n === null || n === undefined) return '0';
        return String(n);
      }
      function arNum(n) {
        if (n === null || n === undefined) return '0';
        try { return Number(n).toLocaleString('en-US'); } catch { return String(n); }
      }
      function normalizeKeys(obj) {
        if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj;
        const result = {};
        for (const [k, v] of Object.entries(obj)) {
          result[k.charAt(0).toLowerCase() + k.slice(1)] = v;
        }
        return result;
      }
      function esc(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
      function getToken() {
        let t = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (t) return t;
        try { const p = JSON.parse(localStorage.getItem('authData') || '{}'); t = p.token || p.authToken; if (t) return t; } catch {}
        const m = document.cookie.match(/(?:^|;\s*)(?:token|authToken)=([^;]+)/);
        return m ? decodeURIComponent(m[1]) : '';
      }
      function resolveAction(log) {
        const r = (log.action || log.actionType || log.type || '').toLowerCase();
        if (/create|add|insert|إضاف|إنشاء/.test(r)) return 'create';
        if (/update|edit|modify|تعديل|تحديث/.test(r)) return 'update';
        if (/delete|remove|حذف/.test(r)) return 'delete';
        if (/login|auth|تسجيل/.test(r)) return 'login';
        return 'other';
      }
      function resolveEntity(log) {
        const r = log.entityName || log.entity || log.tableName || log.module || '';
        return ENTITY_AR[r.toLowerCase()] || r || '—';
      }
      function resolveUser(log) {
        const n = (log.userName || log.performedBy || '').trim();
        if (n && n !== 'null null' && n !== 'null') return n;
        if (log.userEmail) return log.userEmail.split('@')[0];
        if (log.userId) return `مستخدم #${log.userId}`;
        // ── أنشطة مرتبطة بالمشتري — استخرج اسمه من الوصف ──
        const desc = (log.description || '').trim();
        const m1 = desc.match(/من العميل\s+(.+?)(?:\s*$|\s+—|\s+\(|$)/);
        if (m1) return `العميل: ${m1[1].trim()}`;
        const entity = (log.entityName || log.entity || '').toLowerCase();
        if (entity.includes('تذكرة') || entity.includes('مرفق')) return 'العميل';
        return 'مجهول';
      }
      function initials(n) {
        if (!n || n === 'مجهول') return '؟';
        if (n.startsWith('مستخدم #')) return '#';
        const p = n.trim().split(/\s+/);
        if (p.length >= 2) return String.fromCodePoint(p[0].codePointAt(0)) + String.fromCodePoint(p[1].codePointAt(0));
        return n.slice(0, 2);
      }
      function fmtDate(d) {
        if (!d) return '—';
        try { const dt=new Date(d); const day=String(dt.getDate()).padStart(2,'0'); const month=String(dt.getMonth()+1).padStart(2,'0'); return`${day}/${month}/${dt.getFullYear()}`; } catch { return '—'; }
      }
      function fmtTime(d) {
        if (!d) return '';
        try { return new Date(d).toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true }); } catch { return ''; }
      }
      function fmtShort(d) {
        if (!d) return '—';
        try {
          const dt = new Date(d), now = new Date();
          if (dt.toDateString() === now.toDateString()) return 'اليوم';
          if (new Date(now - 86400000).toDateString() === dt.toDateString()) return 'أمس';
          return `${String(dt.getDate()).padStart(2,'0')}/${String(dt.getMonth()+1).padStart(2,'0')}`;
        } catch { return '—'; }
      }
      function timeAgo(d) {
        if (!d) return '';
        try {
          const diff = Date.now() - new Date(d).getTime();
          const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000), dy = Math.floor(diff / 86400000);
          if (m < 1)  return 'الآن';
          if (m < 60) return `منذ ${m} دقيقة`;
          if (h < 24) return `منذ ${h} ساعة`;
          if (dy < 30) return `منذ ${dy} يوم`;
          return fmtDate(d);
        } catch { return ''; }
      }
      function fmtVal(key, val) {
        if (val === null || val === undefined || val === '') return '<span style="opacity:.35;font-size:.75rem">—</span>';
        const kl = key.toLowerCase();
        if (kl === 'stagename') return esc(STAGE_AR[val] || val);
        if (kl === 'reportdata') return '<span style="opacity:.3;font-size:.72rem">بيانات تقنية</span>';
        if (kl === 'imageurl') return `<span style="font-size:.69rem;opacity:.55">${esc(String(val).split('/').pop() || val)}</span>`;
        if (typeof val === 'boolean' || val === 'true' || val === 'false')
          return (val === true || val === 'true') ? '<span style="color:var(--log-green)">✓ نعم</span>' : '<span style="color:var(--log-red)">✗ لا</span>';
        if ((kl.includes('date') || kl.includes('at')) && typeof val === 'string' && val.includes('T'))
          try { return esc(fmtDate(val)); } catch {}
        if ((kl === 'price' || kl === 'area' || kl === 'totalunits' || kl === 'floorcount' || kl === 'unitcount') && !isNaN(Number(val)))
          return esc(arNum(val));
        if (/^\d+(\.\d+)?$/.test(String(val))) return esc(arNum(val));
        return esc(String(val));
      }

      /* ══════════════════════════════════════
         DIFF BUILDERS
      ══════════════════════════════════════ */
      function buildDiffSection(oldJson, newJson, action) {
        let o = {}, n = {};
        try { o = normalizeKeys(JSON.parse(oldJson || '{}')); } catch {}
        try { n = normalizeKeys(JSON.parse(newJson || '{}')); } catch {}
        const isC = action === 'create', isD = action === 'delete';
        const src = isC ? n : (isD ? o : null);
        let keys = src
          ? Object.keys(src).filter(k => !SKIP.has(k))
          : [...new Set([...Object.keys(o), ...Object.keys(n)])].filter(k => !SKIP.has(k));
        if (!keys.length) return '';
        if (isC) {
          let rows = ''; keys.forEach(k => { rows += `<tr><td class="log-td-field">${esc(FIELD_AR[k]||k)}</td><td class="log-td-only" style="color:var(--log-green)">${fmtVal(k,n[k])}</td></tr>`; });
          return `<div><div class="log-sec-lbl"><i class="ri-git-diff-line"></i>البيانات المُضافة<span class="log-chg-count c-green">${toAr(keys.length)} حقل</span></div><table class="log-diff-table"><thead><tr><th>الحقل</th><th class="th-new">القيمة</th></tr></thead><tbody>${rows}</tbody></table></div>`;
        }
        if (isD) {
          let rows = ''; keys.forEach(k => { rows += `<tr><td class="log-td-field">${esc(FIELD_AR[k]||k)}</td><td class="log-td-only" style="color:var(--log-red);text-decoration:line-through">${fmtVal(k,o[k])}</td></tr>`; });
          return `<div><div class="log-sec-lbl"><i class="ri-git-diff-line"></i>البيانات المحذوفة<span class="log-chg-count c-red">${toAr(keys.length)} حقل</span></div><table class="log-diff-table"><thead><tr><th>الحقل</th><th class="th-old">القيمة المحذوفة</th></tr></thead><tbody>${rows}</tbody></table></div>`;
        }
        const changedKeys = keys.filter(k => JSON.stringify(o[k]) !== JSON.stringify(n[k]));
        const unchangedKeys = keys.filter(k => !changedKeys.includes(k));
        let rows = '';
        [...changedKeys, ...unchangedKeys].forEach(k => {
          const changed = changedKeys.includes(k);
          rows += `<tr><td class="log-td-field">${esc(FIELD_AR[k]||k)}${changed ? '<span style="color:var(--log-yellow);margin-right:5px;font-size:.6rem">●</span>' : ''}</td><td class="log-td-old ${changed?'':'log-td-same'}">${fmtVal(k,o[k])}</td><td class="log-td-new ${changed?'':'log-td-same'}">${fmtVal(k,n[k])}</td></tr>`;
        });
        return `<div><div class="log-sec-lbl"><i class="ri-git-diff-line"></i>التغييرات<span class="log-chg-count c-yellow">${toAr(changedKeys.length)} حقل تغيّر</span></div><table class="log-diff-table"><thead><tr><th>الحقل</th><th class="th-old">قبل التعديل</th><th class="th-new">بعد التعديل</th></tr></thead><tbody>${rows}</tbody></table></div>`;
      }
      function buildRawValuesSection(oldJson, newJson, action) {
        let o = {}, n = {};
        try { o = normalizeKeys(JSON.parse(oldJson || '{}')); } catch {}
        try { n = normalizeKeys(JSON.parse(newJson || '{}')); } catch {}
        const hasOld = Object.keys(o).length > 0, hasNew = Object.keys(n).length > 0;
        if (!hasOld && !hasNew) return '';
        const isC = action === 'create', isD = action === 'delete';
        function buildRows(obj, colorClass) {
          const ks = Object.keys(obj).filter(k => !SKIP.has(k));
          if (!ks.length) return '<div style="font-size:.75rem;color:var(--log-muted);padding:4px 0">لا توجد بيانات</div>';
          return ks.map(k => `<div class="log-raw-row"><span class="log-rv-key">${esc(FIELD_AR[k]||k)}</span><span class="log-rv-val ${colorClass}">${fmtVal(k,obj[k])}</span></div>`).join('');
        }
        if (isC) return `<div><div class="log-sec-lbl"><i class="ri-database-2-line"></i>القيم المُضافة</div><div class="log-raw-grid" style="grid-template-columns:1fr"><div class="log-raw-box new-box"><div class="log-raw-header"><i class="ri-add-circle-line"></i> القيم الجديدة</div><div class="log-raw-body">${buildRows(n,'new-color')}</div></div></div></div>`;
        if (isD) return `<div><div class="log-sec-lbl"><i class="ri-database-2-line"></i>القيم المحذوفة</div><div class="log-raw-grid" style="grid-template-columns:1fr"><div class="log-raw-box old-box"><div class="log-raw-header"><i class="ri-delete-bin-line"></i> القيم قبل الحذف</div><div class="log-raw-body">${buildRows(o,'old-color')}</div></div></div></div>`;
        return `<div><div class="log-sec-lbl"><i class="ri-database-2-line"></i>القيم القديمة والجديدة</div><div class="log-raw-grid"><div class="log-raw-box old-box"><div class="log-raw-header"><i class="ri-history-line"></i> قبل التعديل</div><div class="log-raw-body">${buildRows(o,'old-color')}</div></div><div class="log-raw-box new-box"><div class="log-raw-header"><i class="ri-check-double-line"></i> بعد التعديل</div><div class="log-raw-body">${buildRows(n,'new-color')}</div></div></div></div>`;
      }

      /* ══════════════════════════════════════
         STATS
      ══════════════════════════════════════ */
      let _statsSet = false;
      function updateStats(meta) {
        if (_statsSet) return; // الإحصائيات تتحدث مرة واحدة فقط (من الصفحة الأولى)
        _statsSet = true;
        animNum('log-sTotal',  meta.totalCount  ?? 0);
        animNum('log-sCreate', meta.createCount ?? 0);
        animNum('log-sUpdate', meta.updateCount ?? 0);
        animNum('log-sDelete', meta.deleteCount ?? 0);
      }
      function animNum(id, target) {
        const el = document.getElementById(id); if (!el) return;
        const dur = 650, start = performance.now();
        const from = parseInt(el.textContent) || 0;
        function step(now) {
          const t = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - t, 3); // cubic ease-out
          el.textContent = arNum(Math.round(from + (target - from) * ease));
          if (t < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }
      function resetStats() { _statsSet = false; }

      /* ══════════════════════════════════════
         FILTERS
      ══════════════════════════════════════ */
      let _st;
      window.handleLogSearch = function () {
        clearTimeout(_st);
        _st = setTimeout(() => { searchQuery = document.getElementById('log-sInput')?.value || ''; _cacheClear(); resetStats(); window.loadLogs(1); }, 350);
      };
      window.applyLogFilters = function () {
        actionFilter = document.getElementById('log-aFilter')?.value || 'all';
        entityFilter = document.getElementById('log-eFilter')?.value || 'all';
        _cacheClear(); resetStats(); window.loadLogs(1);
      };
      window.applyLogDateFilter = function () {
        logDateFrom = document.getElementById('log-dateFrom')?.value || '';
        logDateTo   = document.getElementById('log-dateTo')?.value   || '';
        const cb = document.getElementById('log-dateClearBtn');
        if (cb) cb.style.display = (logDateFrom || logDateTo) ? 'flex' : 'none';
        _cacheClear(); resetStats(); window.loadLogs(1);
      };
      window.clearLogDateFilter = function () {
        const df = document.getElementById('log-dateFrom'); if (df) df.value = '';
        const dt = document.getElementById('log-dateTo');   if (dt) dt.value = '';
        logDateFrom = ''; logDateTo = '';
        const cb = document.getElementById('log-dateClearBtn'); if (cb) cb.style.display = 'none';
        _cacheClear(); resetStats(); window.loadLogs(1);
      };

      /* ══════════════════════════════════════
         API FETCH (قابل للـ cache)
      ══════════════════════════════════════ */
      async function fetchPage(page) {
        const token = getToken();
        if (!token) throw new Error('NO_TOKEN');
        const params = new URLSearchParams({ PageNumber: page, PageSize: PER_PAGE });
        if (searchQuery)            params.set('Search',   searchQuery);
        if (actionFilter !== 'all') params.set('Action',   actionFilter);
        if (entityFilter !== 'all') params.set('Entity',   entityFilter);
        if (logDateFrom)            params.set('DateFrom', logDateFrom);
        if (logDateTo)              params.set('DateTo',   logDateTo);

        const res = await fetch(`${API_BASE}/api/ActivityLogs?${params.toString()}`, {
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });
        if (res.status === 401) {
          window.__showToast?.('انتهت صلاحية جلستك، جارٍ تسجيل الخروج...','warning',2500);
          setTimeout(()=>{ ['authData','token','authToken','rememberMe','savedEmail'].forEach(k=>localStorage.removeItem(k)); window.location.replace('/login'); }, 2000);
          throw new Error('AUTH');
        }
        if (res.status === 403) {
          window.__showToast?.('ليس لديك صلاحية لعرض السجل','error');
          throw new Error('FORBIDDEN');
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        let logs = [];
        const meta = { totalCount:0, createCount:0, updateCount:0, deleteCount:0 };
        let pages = 1;

        if (Array.isArray(data)) {
          logs = data;
          meta.totalCount = data.length;
          pages = Math.ceil(data.length / PER_PAGE) || 1;
          data.forEach(l => {
            const a = resolveAction(l);
            if (a === 'create') meta.createCount++;
            else if (a === 'update') meta.updateCount++;
            else if (a === 'delete') meta.deleteCount++;
          });
        } else {
          logs  = data.items || data.data || [];
          meta.totalCount  = data.totalCount  || 0;
          meta.createCount = data.createCount || 0;
          meta.updateCount = data.updateCount || 0;
          meta.deleteCount = data.deleteCount || 0;
          pages = data.totalPages || 1;
        }
        return { logs, meta, totalPages: pages };
      }

      /* ══════════════════════════════════════
         PREFETCH  — يشتغل بعد render الصفحة الحالية
      ══════════════════════════════════════ */
      let _prefetchTimer = null;
      function schedulePrefetch(page) {
        clearTimeout(_prefetchTimer);
        _prefetchTimer = setTimeout(() => {
          const neighbors = [page - 1, page + 1].filter(p => p >= 1 && p <= totalPages);
          neighbors.forEach(p => {
            if (_cacheGet(p)) return; // موجود بالفعل
            fetchPage(p)
              .then(payload => {
                _cacheSet(p, payload);
                // mark الأزرار إذا وجدت
                document.querySelectorAll(`.log-pg-btn[data-pg="${p}"]`).forEach(btn => btn.classList.add('prefetched'));
              })
              .catch(() => {}); // صامت — الـ prefetch مش ضروري يظهر خطأ
          });
        }, 300); // prefetch بعد 300ms من الرندر
      }

      /* ══════════════════════════════════════
         RENDER
      ══════════════════════════════════════ */
      const REG = {};
      let regIdx = 0;

      function renderCount(total) {
        const el = document.getElementById('log-resCount');
        if (el) el.textContent = `${arNum(total)} سجل`;
      }
      function showSkeleton() {
        const el = document.getElementById('log-tableArea'); if (!el) return;
        let h = '<div class="log-skel-wrap">';
        for (let i = 0; i < 10; i++) h += `<div class="log-skel-row" style="animation-delay:${i*75}ms"></div>`;
        el.innerHTML = h + '</div>';
      }
      function renderTable(logs) {
        const el = document.getElementById('log-tableArea'); if (!el) return;
        if (!logs.length) { el.innerHTML = `<div class="log-empty"><i class="ri-file-list-3-line"></i><p>لا توجد نتائج مطابقة</p></div>`; return; }
        Object.keys(REG).forEach(k => delete REG[k]); regIdx = 0;
        let h = `<div style="overflow-x:auto"><table><thead><tr>
          <th class="log-col-sm-hide">#</th>
          <th>الإجراء</th><th>الكيان</th><th>المستخدم</th>
          <th class="log-col-sm-hide">الوصف</th>
          <th>الوقت</th><th></th>
        </tr></thead><tbody>`;
        logs.forEach((log, i) => {
          const idx = regIdx++; REG[idx] = log;
          const act = resolveAction(log);
          const info = ACTION_MAP[act];
          const ent = resolveEntity(log);
          const uname = resolveUser(log);
          const urole = log.userRole || log.roleName || log.role || '';
          const dateRaw = log.createdAt || log.timestamp || log.date || null;
          const desc = log.details || log.description || log.message || '—';
          const hasDiff = !!(log.oldValues || log.newValues);
          h += `<tr class="log-tr" style="animation-delay:${i*28}ms" onclick="window.openLogModal(${idx})">
            <td class="log-col-sm-hide"><span class="log-id-pill">${toAr(log.id)||'—'}</span></td>
            <td>
              <span class="log-badge lb-${act}"><i class="${info.icon}"></i>${info.label}</span>
              ${hasDiff?`<div class="log-diff-hint"><i class="ri-git-diff-line"></i>تغييرات</div>`:''}
            </td>
            <td><span class="log-ent-tag">${esc(ent)}</span></td>
            <td>
              <div class="log-user-cell">
                <div class="log-ava">${initials(uname)}</div>
                <div><div class="log-u-name">${esc(uname)}</div><div class="log-u-sub">${esc(urole||'')}</div></div>
              </div>
            </td>
            <td class="log-col-sm-hide" style="max-width:230px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--log-muted2);font-size:.81rem" title="${esc(desc)}">${esc(desc)}</td>
            <td>
              <div class="log-t-main">${fmtShort(dateRaw)}</div>
              <div class="log-t-sub"><i class="ri-time-line"></i>${fmtTime(dateRaw)}</div>
            </td>
            <td><button class="log-row-btn" title="عرض التفاصيل" onclick="event.stopPropagation();window.openLogModal(${idx})"><i class="ri-eye-line"></i></button></td>
          </tr>`;
        });
        el.innerHTML = h + '</tbody></table></div>';
      }
      function renderPaging() {
        const wrap = document.getElementById('log-pgWrap'); if (!wrap) return;
        if (totalPages <= 1) { wrap.innerHTML = ''; return; }
        let h = '';
        h += `<button class="log-pg-btn" data-pg="${currentPage-1}" onclick="window.goLogPage(${currentPage-1})" ${currentPage===1?'disabled':''}><i class="ri-arrow-right-s-line"></i></button>`;
        for (let i = 1; i <= totalPages; i++) {
          if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 2) {
            const cached = _cacheGet(i) ? 'prefetched' : '';
            h += `<button class="log-pg-btn ${i===currentPage?'active':''} ${cached}" data-pg="${i}" onclick="window.goLogPage(${i})">${toAr(i)}</button>`;
          } else if (Math.abs(i - currentPage) === 3) {
            h += `<span style="color:var(--log-muted);padding:0 2px">···</span>`;
          }
        }
        h += `<button class="log-pg-btn" data-pg="${currentPage+1}" onclick="window.goLogPage(${currentPage+1})" ${currentPage===totalPages?'disabled':''}><i class="ri-arrow-left-s-line"></i></button>`;
        h += `<span class="log-pg-info">صفحة ${toAr(currentPage)} من ${toAr(totalPages)}</span>`;
        wrap.innerHTML = h;
      }
      function populateEntityFilter(entities) {
        const sel = document.getElementById('log-eFilter'); if (!sel) return;
        const cur = sel.value;
        sel.innerHTML = '<option value="all">جميع الكيانات</option>' +
          entities.map(e => `<option value="${e}" ${e===cur?'selected':''}>${ENTITY_AR[e.toLowerCase()]||e}</option>`).join('');
      }

      /* ══════════════════════════════════════
         MODAL
      ══════════════════════════════════════ */
      const HERO_STYLE = {
        create:'background:rgba(34,197,94,.15);color:var(--log-green)',
        update:'background:rgba(234,179,8,.13);color:var(--log-yellow)',
        delete:'background:rgba(239,68,68,.15);color:var(--log-red)',
        login: 'background:rgba(59,127,245,.15);color:var(--log-accent2)',
        other: 'background:rgba(var(--fg-rgb), .07);color:var(--log-muted2)',
      };
      window.openLogModal = function (idx) {
        const log = REG[idx]; if (!log) { toast('تعذّر فتح التفاصيل','err'); return; }
        const act = resolveAction(log);
        const info = ACTION_MAP[act];
        const ent = resolveEntity(log);
        const uname = resolveUser(log);
        const uemail = log.userEmail || '';
        const urole = log.userRole || log.roleName || log.role || '';
        const dateRaw = log.createdAt || log.timestamp || log.date || null;
        const desc = log.details || log.description || log.message || '—';
        const hasDiff = !!(log.oldValues || log.newValues);
        const headIco = document.getElementById('log-m-head-ico');
        headIco.setAttribute('style', HERO_STYLE[act]);
        headIco.innerHTML = `<i class="${info.icon}" style="font-size:1.15rem"></i>`;
        document.getElementById('log-m-head-title').textContent = `سجل #${toAr(log.id)||'—'} — ${info.label} ${ent}`;
        document.getElementById('log-m-head-sub').textContent = `${fmtDate(dateRaw)}  •  ${fmtTime(dateRaw)||''}`;
        const diffHtml    = hasDiff ? buildDiffSection(log.oldValues, log.newValues, act) : '';
        const rawValsHtml = hasDiff ? buildRawValuesSection(log.oldValues, log.newValues, act) : '';
        document.getElementById('log-m-body').innerHTML = `
          <div class="log-meta-row">
            <div class="log-meta-card">
              <div class="log-meta-lbl"><i class="ri-user-line"></i>المستخدم</div>
              <div style="display:flex;align-items:center;gap:8px">
                <div class="log-ava" style="width:34px;height:34px;font-size:.72rem">${initials(uname)}</div>
                <div><div class="log-meta-val">${esc(uname)}</div><div class="log-meta-sub">${esc(urole||uemail||'')}</div></div>
              </div>
            </div>
            <div class="log-meta-card">
              <div class="log-meta-lbl"><i class="ri-database-2-line"></i>الكيان</div>
              <div class="log-meta-val">${esc(ent)}</div>
              ${log.entityId?`<div class="log-meta-sub">معرّف: <span style="font-family:monospace;color:var(--log-accent2)">${toAr(log.entityId)}</span></div>`:''}
            </div>
            <div class="log-meta-card">
              <div class="log-meta-lbl"><i class="ri-time-line"></i>الوقت</div>
              <div class="log-meta-val" style="color:var(--log-accent2)">${fmtTime(dateRaw)||'—'}</div>
              <div class="log-meta-sub">${timeAgo(dateRaw)}</div>
            </div>
          </div>
          ${desc&&desc!=='—'?`<div class="log-info-card"><div class="log-info-row"><span class="log-i-lbl">الوصف</span><span class="log-i-val">${esc(desc)}</span></div></div>`:''}
          ${rawValsHtml}
          ${diffHtml}
          <div>
            <div class="log-sec-lbl"><i class="ri-fingerprint-line"></i>المعرّفات</div>
            <div class="log-info-card">
              <div class="log-info-row"><span class="log-i-lbl">رقم السجل</span><span class="log-i-val mono">${toAr(log.id)||'—'}</span></div>
              ${log.entityId?`<div class="log-info-row"><span class="log-i-lbl">معرّف الكيان</span><span class="log-i-val mono">${toAr(log.entityId)}</span></div>`:''}
              ${log.userId?`<div class="log-info-row"><span class="log-i-lbl">معرّف المستخدم</span><span class="log-i-val mono">${toAr(log.userId)}</span></div>`:''}
              ${uemail?`<div class="log-info-row"><span class="log-i-lbl">البريد الإلكتروني</span><span class="log-i-val">${esc(uemail)}</span></div>`:''}
            </div>
          </div>`;
        document.getElementById('log-modal-overlay').classList.add('open');
        document.body.style.overflow = 'hidden';
      };
      function closeLogModal() {
        document.getElementById('log-modal-overlay').classList.remove('open');
        document.body.style.overflow = '';
      }
      window.closeLogModal = closeLogModal;

      /* ══════════════════════════════════════
         TOAST
      ══════════════════════════════════════ */
      function toast(msg, type = 'ok') {
        const el = document.createElement('div');
        el.className = `log-toast ${type}`;
        el.innerHTML = `<i class="${type==='ok'?'ri-checkbox-circle-fill':'ri-error-warning-fill'}"></i><span>${msg}</span>`;
        const tc = document.getElementById('log-toast-container'); if (tc) tc.appendChild(el);
        setTimeout(() => { el.style.cssText += 'opacity:0;transform:translateY(4px);transition:.3s'; setTimeout(() => el.remove(), 320); }, 3500);
      }

      /* ══════════════════════════════════════
         MAIN LOAD  ★ PREFETCH-AWARE ★
      ══════════════════════════════════════ */
      window.loadLogs = async function (page = 1, forceRefresh = false) {
        if (isLoading) return;
        isLoading = true;
        currentPage = page;

        const ico = document.getElementById('log-refresh-ico');

        // ── هل الصفحة في الكاش؟ ──
        if (!forceRefresh) {
          const cached = _cacheGet(page);
          if (cached) {
            // عرض فوري بدون spinner ولا skeleton
            const { logs, meta, totalPages: tp } = cached;
            totalPages = tp;
            if (page === 1) updateStats(meta);
            renderCount(meta.totalCount);
            renderTable(logs);
            renderPaging();
            isLoading = false;
            schedulePrefetch(page);
            return; // خلاص — مافيش حاجة تانية
          }
        } else {
          _cacheClear();
          resetStats();
        }

        // ── مفيش كاش — نشغّل الـ spinner + skeleton ──
        if (ico) ico.style.animation = 'log-spin .8s linear infinite';
        showSkeleton();

        try {
          const payload = await fetchPage(page);
          _cacheSet(page, payload);

          const { logs, meta, totalPages: tp } = payload;
          totalPages = tp;

          if (page === 1 && entityFilter === 'all') {
            const ents = [...new Set(logs.map(l => l.entityName || l.entity || l.tableName || l.module || '').filter(Boolean))];
            if (ents.length > 0) populateEntityFilter(ents);
          }

          updateStats(meta);
          renderCount(meta.totalCount);
          renderTable(logs);
          renderPaging();
          schedulePrefetch(page);

        } catch (e) {
          if (e.message === 'NO_TOKEN') { toast('يرجى تسجيل الدخول أولاً','err'); }
          else if (e.message !== 'AUTH') {
            console.error(e);
            toast(`فشل الاتصال: ${e.message}`,'err');
            const el = document.getElementById('log-tableArea');
            if (el) el.innerHTML = '<div class="log-empty"><i class="ri-error-warning-line"></i><p>فشل في تحميل البيانات — تحقق من الاتصال</p></div>';
          }
        } finally {
          isLoading = false;
          if (ico) ico.style.animation = '';
        }
      };

      window.goLogPage = function (p) {
        if (p < 1 || p > totalPages || isLoading) return;
        window.loadLogs(p);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };

      await window.loadLogs(1);
    }
  };
})();