/* PAGE MODULE: reservations — SPA v3 */
(function () {
  window.__pages = window.__pages || {};

  const _css = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --border:rgba(var(--fg-rgb), 0.08); --border-hover:rgba(var(--fg-rgb), 0.2);
      --light:#FFFFFF; --text-muted:#8fa3c0;
      --success:#34c759; --warning:#ffcc00; --danger:#ff3b30; --accent:#4e8df5;
      --transition:all 0.3s cubic-bezier(0.4,0,0.2,1);
    }
    @keyframes res-spin      { to { transform: rotate(360deg); } }
    @keyframes res-fadeUp    { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
    @keyframes res-fadeIn    { from { opacity:0; } to { opacity:1; } }
    @keyframes res-slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
    /* يحافظ على التمركز translateX(-50%) أثناء الظهور حتى لا ينزاح يميناً */
    @keyframes res-bulk-in { from { opacity:0; transform:translateX(-50%) translateY(12px) scale(.98); } to { opacity:1; transform:translateX(-50%) translateY(0) scale(1); } }

    /* ── ROW ENTER ANIMATION ── */
    @keyframes res-rowReveal {
      from { opacity:0; transform:translateX(18px); }
      to   { opacity:1; transform:translateX(0); }
    }
    .res-row-enter {
      opacity:0;
      animation: res-rowReveal 0.38s cubic-bezier(0.22,1,0.36,1) forwards;
    }

    #res-page ::-webkit-scrollbar { width:5px; height:5px; }
    #res-page ::-webkit-scrollbar-track { background:var(--primary-deep); }
    #res-page ::-webkit-scrollbar-thumb { background:rgba(var(--fg-rgb), 0.12); border-radius:6px; }
    #res-page select option { background-color:#0d2040; color:#dde8ff; }
    #res-page select { color-scheme:dark; transition:all 0.25s ease; color:#dde8ff; }
    #res-page select:disabled { opacity:0.5; cursor:not-allowed; }
    .res-custom-select-wrap select { transition:border-color 0.25s, background 0.25s; color:#dde8ff; }
    #res-page select:focus { animation:res-dropdown-open 0.18s cubic-bezier(0.4,0,0.2,1); }
    @keyframes res-dropdown-open { from{opacity:0.7;transform:scaleY(0.97);}to{opacity:1;transform:scaleY(1);} }

    .res-toolbar-wrapper {
      position:sticky; top:0; z-index:100;
      display:flex; align-items:center; justify-content:space-between;
      padding:12px 24px; background:rgba(var(--bg-rgb),0.97);
      backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
      border-bottom:1px solid var(--border);
      margin:-36px -36px 20px; flex-wrap:wrap; gap:10px;
    }
    @media(max-width:1024px){ .res-toolbar-wrapper{ margin:-24px -16px 16px; padding:10px 16px; } }

    .res-toolbar-right { display:flex; align-items:center; gap:10px; }
    .res-csv-btn { display:flex; align-items:center; gap:7px; padding:9px 18px; border-radius:10px; background:rgba(52,199,89,0.12); border:1px solid rgba(52,199,89,0.3); color:var(--success); font-family:inherit; font-size:0.85rem; font-weight:700; cursor:pointer; transition:var(--transition); white-space:nowrap; }
    .res-csv-btn:hover { background:rgba(52,199,89,0.22); transform:translateY(-1px); box-shadow:0 6px 20px rgba(52,199,89,0.2); }
    .res-add-btn { display:flex; align-items:center; gap:7px; padding:9px 20px; border-radius:10px; background:var(--accent); color:#fff; border:none; font-family:inherit; font-size:0.88rem; font-weight:700; cursor:pointer; transition:var(--transition); white-space:nowrap; }
    .res-add-btn:hover { background:#3a7de4; transform:translateY(-2px); box-shadow:0 8px 24px rgba(78,141,245,0.35); }

    .res-dropdown-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:16px; animation:res-fadeUp 0.35s 0.05s ease both; }
    .res-custom-select-wrap { position:relative; background:var(--card-bg); border:1px solid var(--border); border-radius:12px; transition:var(--transition); }
    .res-custom-select-wrap:hover { border-color:var(--border-hover); }
    .res-custom-select-wrap .res-select-icon { position:absolute; right:16px; top:50%; transform:translateY(-50%); color:var(--text-muted); font-size:1.1rem; pointer-events:none; z-index:1; }
    .res-custom-select-wrap .res-chevron { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--text-muted); font-size:1rem; pointer-events:none; }
    .res-custom-select-wrap select { width:100%; padding:13px 44px 13px 38px; background:transparent; border:none; outline:none; color:#dde8ff; font-family:'Tajawal',sans-serif; font-size:0.92rem; font-weight:600; cursor:pointer; appearance:none; }
    .res-custom-select-wrap:focus-within { border-color:var(--accent); box-shadow:0 0 0 3px rgba(78,141,245,0.1); }

    .res-filter-search-row { display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:16px; animation:res-fadeUp 0.35s 0.1s ease both; }
    .res-filter-pills { display:flex; gap:7px; flex-wrap:wrap; }
    .res-pill { padding:7px 18px; border-radius:20px; background:rgba(var(--fg-rgb), 0.05); border:1px solid var(--border); color:var(--text-muted); font-family:inherit; font-size:0.83rem; font-weight:700; cursor:pointer; transition:var(--transition); user-select:none; }
    .res-pill:hover { background:rgba(var(--fg-rgb), 0.09); color:var(--light); border-color:rgba(var(--fg-rgb), 0.18); }
    .res-pill.active { background:rgba(var(--fg-rgb), 0.13); border-color:rgba(var(--fg-rgb), 0.32); color:var(--light); }
    .res-pill.p-reserved.active { background:rgba(255,204,0,0.10); border-color:var(--warning); color:var(--warning); }
    .res-pill.p-sold.active { background:rgba(255,59,48,0.12); border-color:var(--danger); color:var(--danger); }

    .res-search-wrap { position:relative; display:flex; align-items:center; flex:1; min-width:200px; max-width:380px; margin-right:auto; }
    .res-search-input { background:rgba(var(--fg-rgb), 0.06); border:1.5px solid var(--border); color:var(--light); font-family:inherit; font-size:0.9rem; padding:10px 14px 10px 40px; border-radius:12px; width:100%; transition:var(--transition); }
    .res-search-input:focus { outline:none; background:rgba(var(--fg-rgb), 0.1); border-color:var(--accent); box-shadow:0 0 0 3px rgba(78,141,245,0.12); }
    .res-search-input::placeholder { color:var(--text-muted); }
    .res-search-icon { position:absolute; left:13px; color:var(--text-muted); font-size:1.05rem; pointer-events:none; }

    .res-results-count { font-size:0.8rem; color:var(--text-muted); margin-bottom:12px; text-align:left; }
    .res-table-container { background:var(--card-bg); border:1px solid var(--border); border-radius:16px; overflow:hidden; animation:res-fadeUp 0.4s 0.15s ease both; }
    .res-table-scroll { overflow-x:auto; }
    #res-page table { width:100%; border-collapse:collapse; min-width:700px; }
    #res-page thead tr { background:rgba(var(--fg-rgb), 0.025); border-bottom:1px solid var(--border); }
    #res-page thead th { padding:13px 16px; text-align:right; font-size:0.73rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; white-space:nowrap; }
    #res-page tbody tr { border-bottom:1px solid rgba(var(--fg-rgb), 0.04); transition:background 0.18s ease; }
    #res-page tbody tr:last-child { border-bottom:none; }
    #res-page tbody tr:hover { background:rgba(var(--fg-rgb), 0.028); }
    #res-page tbody td { padding:13px 16px; font-size:0.88rem; vertical-align:middle; }

    .res-unit-num { font-size:1rem; font-weight:800; color:var(--light); }
    .res-badge { display:inline-flex; align-items:center; gap:5px; padding:4px 12px; border-radius:8px; font-size:0.76rem; font-weight:700; white-space:nowrap; }
    .res-badge::before { content:''; width:6px; height:6px; border-radius:50%; }
    .badge-reserved { background:rgba(255,204,0,0.11); color:var(--warning); }
    .badge-reserved::before { background:var(--warning); }
    .badge-sold { background:rgba(255,59,48,0.13); color:var(--danger); }
    .badge-sold::before { background:var(--danger); }

    .res-buyer-cell { display:flex; align-items:center; gap:9px; }
    .res-buyer-avatar { width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg,#4e8df5,#2a6dd4); display:flex; align-items:center; justify-content:center; font-size:0.72rem; font-weight:800; color:#fff; flex-shrink:0; }
    .res-buyer-name { font-weight:600; font-size:0.87rem; color:var(--light); }
    .res-buyer-empty { color:var(--text-muted); font-size:0.85rem; }

    /* ── زرار عرض تفاصيل العميل (في الجدول وفي المودال) ── */
    .res-buyer-detail-btn {
      display:inline-flex; align-items:center; gap:4px;
      padding:3px 9px; border-radius:7px; font-size:0.72rem; font-weight:700;
      background:rgba(78,141,245,0.12); color:var(--accent);
      border:1px solid rgba(78,141,245,0.25);
      cursor:pointer; transition:var(--transition); white-space:nowrap;
      font-family:inherit;
    }
    .res-buyer-detail-btn:hover {
      background:rgba(78,141,245,0.25); border-color:var(--accent);
      transform:translateY(-1px);
    }
    .res-buyer-detail-btn i { font-size:0.8rem; }

    /* ── بطاقة العميل داخل مودال التفاصيل ── */
    .res-buyer-card {
      display:flex; align-items:center; gap:14px;
      padding:14px 16px; background:rgba(78,141,245,0.07);
      border:1px solid rgba(78,141,245,0.18); border-radius:12px;
      margin-bottom:4px;
    }
    .res-buyer-card-avatar {
      width:44px; height:44px; border-radius:50%;
      background:linear-gradient(135deg,#4e8df5,#3a7de4);
      display:flex; align-items:center; justify-content:center;
      font-size:1rem; font-weight:800; color:var(--light); flex-shrink:0;
    }
    .res-buyer-card-name  { font-size:0.95rem; font-weight:800; color:var(--light); }
    .res-buyer-card-phone { font-size:0.78rem; color:var(--text-muted); margin-top:2px; direction:ltr; display:inline-block; }
    .res-buyer-card-email { font-size:0.76rem; color:var(--text-muted); margin-top:1px; }

    .res-money { font-weight:700; font-size:0.87rem; color:var(--light); direction:ltr; display:inline-block; }
    .res-type-tag { color:var(--text-muted); font-size:0.85rem; font-weight:600; }

    .res-row-actions { display:flex; gap:5px; align-items:center; justify-content:flex-end; }
    .res-action-btn { position:relative; width:30px; height:30px; border-radius:7px; border:1px solid var(--border); background:transparent; color:var(--text-muted); cursor:pointer; transition:var(--transition); display:flex; align-items:center; justify-content:center; font-size:0.92rem; flex-shrink:0; }
    .res-action-btn:hover { transform:translateY(-1px); }
    .res-action-btn[data-tip]:hover::after { content:attr(data-tip); position:absolute; bottom:calc(100% + 6px); left:50%; transform:translateX(-50%); background:rgba(var(--bg-rgb),0.97); color:var(--light); font-size:0.7rem; font-weight:600; padding:4px 8px; border-radius:6px; white-space:nowrap; pointer-events:none; border:1px solid rgba(var(--fg-rgb), 0.1); z-index:99; font-family:'Tajawal',sans-serif; }
    .res-action-btn.view:hover { background:rgba(var(--fg-rgb), 0.08); border-color:rgba(var(--fg-rgb), 0.22); color:var(--light); }
    .res-action-btn.edit { border-color:rgba(78,141,245,0.25); color:var(--accent); }
    .res-action-btn.edit:hover { background:rgba(78,141,245,0.18); border-color:var(--accent); box-shadow:0 4px 12px rgba(78,141,245,0.2); }
    .res-action-btn.del { border-color:rgba(255,59,48,0.2); color:var(--danger); }
    .res-action-btn.del:hover { background:rgba(255,59,48,0.15); border-color:var(--danger); box-shadow:0 4px 12px rgba(255,59,48,0.18); }

    .res-loader-box { display:flex; align-items:center; justify-content:center; min-height:360px; }
    .res-spinner { width:48px; height:48px; border:4px solid rgba(var(--fg-rgb), 0.1); border-top-color:var(--accent); border-radius:50%; animation:res-spin 0.8s linear infinite; }
    .res-empty-msg { text-align:center; padding:70px 20px; color:var(--text-muted); font-size:1rem; }
    .res-empty-msg i { font-size:2.8rem; display:block; margin-bottom:12px; opacity:0.35; }

    #res-pagination { display:flex; justify-content:center; gap:7px; margin-top:24px; }
    .res-pg-btn { padding:7px 14px; border-radius:8px; background:rgba(var(--fg-rgb), 0.05); border:1px solid var(--border); color:var(--text-muted); font-family:inherit; font-size:0.84rem; font-weight:600; cursor:pointer; transition:var(--transition); }
    .res-pg-btn:hover:not(:disabled) { background:rgba(var(--fg-rgb), 0.1); color:var(--light); }
    .res-pg-btn.active { background:var(--accent); color:#fff; border-color:var(--accent); }
    .res-pg-btn:disabled { opacity:0.35; cursor:not-allowed; }

    /* ── MODAL (single modal, two layers via z-index) ── */
    #res-modal {
      display:none; position:fixed; inset:0;
      background:rgba(0,0,0,0.65); z-index:1000;
      align-items:center; justify-content:center;
      backdrop-filter:blur(5px);
    }
    #res-buyer-modal {
      display:none; position:fixed; inset:0;
      background:rgba(0,0,0,0.55); z-index:1100;
      align-items:center; justify-content:center;
      backdrop-filter:blur(3px);
    }
    .res-modal-content { background:var(--card-bg); backdrop-filter:blur(24px); border:1px solid rgba(var(--fg-rgb), 0.1); border-radius:20px; max-width:560px; width:93%; max-height:88vh; overflow-y:auto; box-shadow:0 30px 60px rgba(0,0,0,0.5),inset 0 1px 0 rgba(var(--fg-rgb), 0.07); animation:res-slideDown 0.22s ease; }
    .res-buyer-modal-content { background:var(--card-bg); border:1px solid rgba(78,141,245,0.25); border-radius:20px; max-width:480px; width:93%; max-height:85vh; overflow-y:auto; box-shadow:0 30px 60px rgba(0,0,0,0.6); animation:res-slideDown 0.22s ease; }
    .res-modal-header { padding:22px 26px 16px; border-bottom:1px solid rgba(var(--fg-rgb), 0.08); display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; background:var(--card-bg); z-index:2; }
    #res-modal-title, #res-buyer-modal-title { font-size:1.1rem; font-weight:800; color:var(--light); }
    .res-modal-close { background:none; border:none; color:var(--text-muted); font-size:1.35rem; cursor:pointer; transition:all 0.25s; }
    .res-modal-close:hover { color:var(--light); transform:rotate(90deg); }
    .res-modal-body { padding:22px 26px; }
    .res-modal-footer { padding:16px 26px; border-top:1px solid rgba(var(--fg-rgb), 0.1); display:flex; gap:9px; justify-content:flex-end; background:linear-gradient(0deg, var(--primary-deep) 0%, var(--primary) 100%); position:sticky; bottom:0; border-radius:0 0 20px 20px; box-shadow:0 -4px 16px rgba(0,0,0,.3); }

    .res-form-group { margin-bottom:14px; }
    .res-form-label { display:block; font-size:0.84rem; font-weight:700; margin-bottom:6px; color:var(--light); }
    .res-form-input,.res-form-select { width:100%; padding:10px 13px; border-radius:10px; background:var(--card-bg); border:1.5px solid rgba(var(--fg-rgb), 0.12); color:var(--light); font-family:inherit; font-size:0.89rem; transition:all 0.25s ease; }
    .res-form-select { appearance:none; background-image:url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238fa3c0' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); background-repeat:no-repeat; background-position:left 10px center; background-size:16px; padding-left:34px; cursor:pointer; color-scheme:dark; }
    .res-form-select option { background-color:#0a1e42; color:#dde8ff; }
    .res-form-input:focus,.res-form-select:focus { outline:none; background:#0f2450; border-color:var(--accent); box-shadow:0 0 0 3px rgba(78,141,245,0.13); }
    .res-form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    .res-section-label { font-size:0.72rem; text-transform:uppercase; letter-spacing:0.5px; color:var(--text-muted); margin-bottom:10px; font-weight:700; }
    .res-form-section { padding:14px 16px; border-radius:10px; margin-bottom:14px; }
    .res-form-section.unit-sec { background:rgba(var(--fg-rgb), 0.04); border:1px solid var(--border); }
    .res-form-section.book-sec { background:rgba(78,141,245,0.05); border:1px solid rgba(78,141,245,0.15); }
    .res-form-section.book-sec .res-section-label { color:var(--accent); opacity:0.9; }

    .res-btn-primary { display:flex; align-items:center; gap:6px; padding:10px 22px; border-radius:10px; background:linear-gradient(135deg,#4e8df5 0%,#3472dc 100%); color:#fff; border:none; font-family:inherit; font-size:0.88rem; font-weight:700; cursor:pointer; transition:all 0.25s; box-shadow:0 4px 14px rgba(78,141,245,0.28); }
    .res-btn-primary:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 22px rgba(78,141,245,0.38); }
    .res-btn-primary:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
    .res-btn-secondary { padding:10px 20px; border-radius:10px; background:rgba(var(--fg-rgb), 0.05); color:var(--light); border:1px solid rgba(var(--fg-rgb), 0.12); font-family:inherit; font-size:0.88rem; font-weight:600; cursor:pointer; transition:all 0.25s; }
    .res-btn-secondary:hover { background:rgba(var(--fg-rgb), 0.09); }
    .res-btn-danger { display:flex; align-items:center; gap:6px; padding:10px 18px; border-radius:10px; background:var(--danger); color:var(--light); border:none; font-family:inherit; font-size:0.88rem; font-weight:700; cursor:pointer; transition:var(--transition); }
    .res-btn-danger:hover { background:#e62c21; transform:translateY(-1px); }

    .res-confirm-box { text-align:center; padding:8px 0; }
    .res-confirm-icon { font-size:2.8rem; margin-bottom:14px; }
    .res-confirm-msg { font-size:0.9rem; color:var(--text-muted); line-height:1.65; margin-bottom:22px; }
    .res-confirm-actions { display:flex; gap:12px; justify-content:center; }

    /* detail grid */
    .res-detail-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
    .res-detail-block { background:rgba(var(--fg-rgb), 0.04); padding:12px; border-radius:10px; border:1px solid var(--border); }
    .res-detail-block.full { grid-column:1/-1; }
    .res-detail-label { font-size:0.7rem; color:var(--text-muted); margin-bottom:4px; text-transform:uppercase; letter-spacing:0.4px; }
    .res-detail-value { font-size:0.92rem; font-weight:700; color:var(--light); }
    @media(max-width:480px){ .res-detail-grid{ grid-template-columns:1fr; } }

    #res-toast-container { position:fixed; bottom:22px; right:22px; z-index:2000; display:flex; flex-direction:column; gap:10px; pointer-events:none; }
    .res-toast { display:flex; align-items:center; gap:9px; padding:12px 16px; border-radius:10px; background:rgba(var(--bg-rgb),0.97); border:1px solid rgba(var(--fg-rgb), 0.08); color:var(--light); font-size:0.86rem; font-weight:600; animation:res-slideDown 0.25s ease; box-shadow:0 8px 24px rgba(0,0,0,0.35); pointer-events:all; }
    .res-toast.success { border-color:rgba(52,199,89,0.4); }
    .res-toast.error   { border-color:rgba(255,59,48,0.4); }

    @media(max-width:768px){ .res-dropdown-row,.res-form-row{ grid-template-columns:1fr; } .res-filter-search-row{ flex-direction:column; align-items:stretch; } .res-search-wrap{ max-width:100%; margin-right:0; } }
    @media(max-width:480px){ .res-toolbar-right{ flex-wrap:wrap; gap:6px; } .res-filter-pills{ flex-wrap:wrap; } }

    .badge-available { background:rgba(52,199,89,0.11); color:var(--success); }
    .badge-available::before { background:var(--success); }
    .badge-locked { background:rgba(143,163,192,0.12); color:var(--text-muted); }
    .badge-locked::before { background:var(--text-muted); }
    .res-pill.p-available.active { background:rgba(52,199,89,0.10); border-color:var(--success); color:var(--success); }
    .res-pill.p-locked.active { background:rgba(143,163,192,0.10); border-color:var(--text-muted); color:var(--text-muted); }

    /* ── fixed bottom bulk bar (مثل projects) ── */
    #res-fixed-bulk-bar { display:none;position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:600;background:var(--card-bg);border:1px solid rgba(78,141,245,.35);border-radius:14px;padding:10px 16px;backdrop-filter:blur(16px);box-shadow:0 8px 32px rgba(0,0,0,.5);align-items:center;gap:8px;flex-wrap:nowrap;overflow-x:auto;animation:res-bulk-in .28s cubic-bezier(.16,1,.3,1);max-width:calc(100vw - 48px); }
    #res-fixed-bulk-bar.show { display:flex; }
    .res-bulk-count-lbl { font-size:.88rem;font-weight:800;color:var(--light);white-space:nowrap; }
    .res-bulk-divider { width:1px;height:24px;background:rgba(var(--fg-rgb), .1);flex-shrink:0; }
    .res-bulk-lbl { font-size:.78rem;color:var(--text-muted);white-space:nowrap; }
    .res-bulk-st-btn { display:inline-flex;align-items:center;gap:4px;padding:7px 13px;border-radius:8px;font-family:inherit;font-size:.8rem;font-weight:700;cursor:pointer;border:1px solid;transition:var(--transition);white-space:nowrap; }
    .res-bulk-st-btn.avail  { background:rgba(52,199,89,.12); color:var(--success);  border-color:rgba(52,199,89,.35);  } .res-bulk-st-btn.avail:hover  { background:rgba(52,199,89,.25);  }
    .res-bulk-st-btn.resrv  { background:rgba(255,204,0,.12);  color:var(--warning);  border-color:rgba(255,204,0,.35);  } .res-bulk-st-btn.resrv:hover  { background:rgba(255,204,0,.25);  }
    .res-bulk-st-btn.closed { background:rgba(143,163,192,.12);color:var(--text-muted);border-color:rgba(143,163,192,.35);} .res-bulk-st-btn.closed:hover { background:rgba(143,163,192,.2); }
    .res-bulk-cancel { padding:7px 13px;border-radius:8px;font-family:inherit;font-size:.8rem;font-weight:700;cursor:pointer;border:1px solid var(--border);background:rgba(var(--fg-rgb), .05);color:var(--text-muted);transition:var(--transition);display:inline-flex;align-items:center;gap:4px; } .res-bulk-cancel:hover { color:var(--light); }
    .res-bulk-apply-btn { display:inline-flex;align-items:center;gap:4px;padding:5px 10px;border-radius:7px;font-family:inherit;font-size:.76rem;font-weight:700;cursor:pointer;border:1px solid rgba(78,141,245,.35);background:rgba(78,141,245,.12);color:var(--accent);transition:var(--transition);white-space:nowrap; } .res-bulk-apply-btn:hover { background:rgba(78,141,245,.25); }
    .res-bulk-sel-all  { display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:7px;font-family:inherit;font-size:.76rem;font-weight:700;cursor:pointer;border:1px solid rgba(78,141,245,.35);background:rgba(78,141,245,.12);color:var(--accent);transition:var(--transition);white-space:nowrap; } .res-bulk-sel-all:hover  { background:rgba(78,141,245,.25); }
    .res-bulk-desel-all{ display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:7px;font-family:inherit;font-size:.76rem;font-weight:700;cursor:pointer;border:1px solid var(--border);background:rgba(var(--fg-rgb), .05);color:var(--text-muted);transition:var(--transition);white-space:nowrap; } .res-bulk-desel-all:hover { background:rgba(var(--fg-rgb), .1);color:var(--light); }
    /* row selection */
    #res-page tbody tr.sel-row { background:rgba(78,141,245,0.09)!important; }
    #res-page tbody tr { cursor:pointer; }
    .res-row-checkbox { width:15px;height:15px;cursor:pointer;accent-color:var(--accent); }
    /* keep old standalone btn */
    .res-sel-all-btn { padding:6px 14px;border-radius:8px;border:1px solid rgba(78,141,245,0.3);background:rgba(78,141,245,0.08);color:var(--accent);font-family:inherit;font-size:0.82rem;font-weight:700;cursor:pointer;transition:var(--transition);white-space:nowrap; }
    .res-sel-all-btn:hover { background:rgba(78,141,245,0.18); }

    /* ── Custom Searchable Dropdown ── */
    .csd-wrap { position:relative; }
    .csd-input { width:100%; padding:10px 34px 10px 13px; border-radius:10px; background:var(--card-bg); border:1.5px solid rgba(var(--fg-rgb), 0.12); color:#dde8ff; font-family:'Tajawal',sans-serif; font-size:0.89rem; transition:all 0.25s ease; outline:none; }
    .csd-input:focus { background:#0f2450; border-color:var(--accent); box-shadow:0 0 0 3px rgba(78,141,245,0.13); }
    .csd-input::placeholder { color:var(--text-muted); }
    .csd-arrow { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--text-muted); pointer-events:none; font-size:1.05rem; }
    .csd-dropdown { position:absolute; top:calc(100% + 4px); left:0; right:0; background:var(--card-bg); border:1.5px solid rgba(78,141,245,0.35); border-radius:10px; max-height:210px; overflow-y:auto; z-index:500; box-shadow:0 8px 28px rgba(0,0,0,0.55); display:none; }
    .csd-dropdown.open { display:block; animation:res-slideDown 0.16s ease; }
    .csd-option { padding:9px 14px; font-size:0.88rem; color:#dde8ff; cursor:pointer; transition:background 0.15s; }
    .csd-option:hover { background:rgba(78,141,245,0.18); }
    .csd-option.selected { background:rgba(78,141,245,0.12); color:var(--accent); font-weight:700; }
    .csd-option.hidden { display:none; }
    .csd-empty { padding:10px 14px; font-size:0.85rem; color:var(--text-muted); text-align:center; }

    /* ── Standalone select-all button ── */
    .res-sel-standalone-btn { display:flex; align-items:center; gap:6px; padding:7px 16px; border-radius:20px; border:1px solid rgba(78,141,245,0.35); background:rgba(78,141,245,0.08); color:var(--accent); font-family:inherit; font-size:0.82rem; font-weight:700; cursor:pointer; transition:var(--transition); white-space:nowrap; }
    .res-sel-standalone-btn:hover { background:rgba(78,141,245,0.18); border-color:var(--accent); }
  `;

  window.__pages['reservations'] = {
    getCSS: function () { return _css; },
    init: async function () {

      const container = document.getElementById('app-main');
      container.innerHTML = `
        <div id="res-page" style="padding:28px 28px 80px;max-width:1380px;margin:0 auto">

          <!-- Main modal -->
          <div id="res-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:1000;align-items:center;justify-content:center;backdrop-filter:blur(5px)">
            <div class="res-modal-content">
              <div class="res-modal-header">
                <h2 id="res-modal-title"></h2>
                <button class="res-modal-close" onclick="window.closeModal()"><i class="ri-close-line"></i></button>
              </div>
              <div id="res-modal-content"></div>
            </div>
          </div>

          <!-- Buyer detail modal (nested, higher z-index) -->
          <div id="res-buyer-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:1100;align-items:center;justify-content:center;backdrop-filter:blur(3px)">
            <div class="res-buyer-modal-content">
              <div class="res-modal-header" style="border-radius:20px 20px 0 0;background:var(--card-bg)">
                <h2 id="res-buyer-modal-title">تفاصيل العميل</h2>
                <button class="res-modal-close" onclick="window.closeBuyerModal()"><i class="ri-close-line"></i></button>
              </div>
              <div id="res-buyer-modal-content"></div>
            </div>
          </div>

          <div id="res-toast-container"></div>

          <div class="res-toolbar-wrapper">
            <div id="res-breadcrumb" style="display:flex;align-items:center;gap:8px;font-size:0.83rem;color:var(--text-muted);flex:1">
              <span style="color:var(--light);font-weight:700">إدارة الحجوزات والمبيعات</span>
            </div>
            <div class="res-toolbar-right">
              <button class="res-csv-btn" onclick="window.exportCSV()"><i class="ri-download-2-line"></i> تصدير CSV</button>
              <button class="res-add-btn" onclick="window.openAddBooking()"><i class="ri-add-line"></i> حجز وحدة</button>
            </div>
          </div>

          <div class="res-dropdown-row">
            <div class="res-custom-select-wrap">
              <i class="res-select-icon ri-home-4-line"></i>
              <select id="projectFilter" onchange="window.S_res.selectedProject=this.value;window.populateBuildingDropdown();window.applyFilter();window._saveResState&&window._saveResState()">
                <option value="">— كل المشاريع —</option>
              </select>
              <i class="res-chevron ri-arrow-down-s-line"></i>
            </div>
            <div class="res-custom-select-wrap">
              <i class="res-select-icon ri-building-2-line"></i>
              <select id="buildingFilter" onchange="window.S_res.selectedBuilding=this.value;window.applyFilter();window._saveResState&&window._saveResState()">
                <option value="">— كل المباني —</option>
              </select>
              <i class="res-chevron ri-arrow-down-s-line"></i>
            </div>
          </div>

          <div class="res-filter-search-row">
            <div class="res-filter-pills">
              <button class="res-pill active" data-cls="res-pill" onclick="window.setFilter('all',this)">الكل</button>
              <button class="res-pill p-available" data-cls="res-pill p-available" onclick="window.setFilter('available',this)">متاح</button>
              <button class="res-pill p-reserved" data-cls="res-pill p-reserved" onclick="window.setFilter('reserved',this)">محجوز</button>
              <button class="res-pill p-sold" data-cls="res-pill p-sold" onclick="window.setFilter('sold',this)">مباع</button>
              <button class="res-pill p-locked" data-cls="res-pill p-locked" onclick="window.setFilter('closed',this)">مقفول</button>
              <button class="res-sel-standalone-btn" onclick="window._resSelectAll()"><i class="ri-checkbox-multiple-line"></i> تحديد الكل</button>
            </div>
            <div class="res-search-wrap">
              <i class="res-search-icon ri-search-line"></i>
              <input type="text" id="searchInput" class="res-search-input"
                     placeholder="ابحث برقم الوحدة، العميل، المبنى..."
                     oninput="window.handleSearch()">
            </div>
          </div>

          <div class="res-date-filter-row" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px;padding:12px 14px;background:rgba(78,141,245,0.05);border:1px solid rgba(78,141,245,0.15);border-radius:12px;animation:res-fadeUp 0.35s 0.12s ease both">
            <i class="ri-calendar-line" style="color:var(--accent);font-size:1rem;flex-shrink:0"></i>
            <span style="font-size:0.8rem;font-weight:700;color:var(--text-muted);white-space:nowrap">فلتر التاريخ (ميلادي):</span>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;flex:1">
              <div style="display:flex;align-items:center;gap:6px">
                <label style="font-size:0.78rem;color:var(--text-muted);white-space:nowrap">من</label>
                <input type="date" id="res-dateFrom" oninput="window.applyFilter()" style="background:var(--card-bg);border:1.5px solid rgba(var(--fg-rgb), 0.12);color:#dde8ff;font-family:'Tajawal',sans-serif;font-size:0.84rem;padding:7px 10px;border-radius:8px;outline:none;transition:all 0.2s;color-scheme:dark;cursor:pointer">
              </div>
              <div style="display:flex;align-items:center;gap:6px">
                <label style="font-size:0.78rem;color:var(--text-muted);white-space:nowrap">إلى</label>
                <input type="date" id="res-dateTo" oninput="window.applyFilter()" style="background:var(--card-bg);border:1.5px solid rgba(var(--fg-rgb), 0.12);color:#dde8ff;font-family:'Tajawal',sans-serif;font-size:0.84rem;padding:7px 10px;border-radius:8px;outline:none;transition:all 0.2s;color-scheme:dark;cursor:pointer">
              </div>
              <button onclick="window.clearDateFilter()" id="res-dateClearBtn" style="display:none;align-items:center;gap:4px;padding:6px 12px;border-radius:8px;background:rgba(255,59,48,0.1);border:1px solid rgba(255,59,48,0.25);color:#ff3b30;font-family:'Tajawal',sans-serif;font-size:0.78rem;font-weight:700;cursor:pointer;transition:all 0.2s;white-space:nowrap">
                <i class="ri-close-circle-line"></i> مسح التاريخ
              </button>
            </div>
          </div>

          <!-- fixed bottom bulk bar -->
          <div id="res-fixed-bulk-bar">
            <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
              <span class="res-bulk-count-lbl" id="res-bulk-count">0 وحدة</span>
              <button class="res-bulk-sel-all"  onclick="window._resSelectAll()"><i class="ri-checkbox-multiple-line"></i>الكل</button>
              <button class="res-bulk-desel-all" onclick="window._resClearSel()"><i class="ri-checkbox-blank-line"></i>إلغاء</button>
            </div>
            <div class="res-bulk-divider"></div>
            <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
              <span class="res-bulk-lbl">الحالة:</span>
              <button class="res-bulk-st-btn avail"  onclick="window._resBulkChangeStatus(1)"><i class="ri-checkbox-circle-line"></i>متاح</button>
              <button class="res-bulk-st-btn closed" onclick="window._resBulkChangeStatus(4)"><i class="ri-lock-line"></i>مقفول</button>
            </div>
            <div class="res-bulk-divider"></div>
            <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
              <span class="res-bulk-lbl">السعر:</span>
              <input type="number" id="res-bulk-price-inp" min="0" step="1000" placeholder="${window.CUR()}" style="height:32px;width:110px;background:rgba(var(--fg-rgb), .06);color:var(--light);border:1px solid rgba(var(--fg-rgb), .12);padding:0 8px;border-radius:8px;font-family:inherit;font-size:.82rem;font-weight:600;outline:none;-moz-appearance:textfield" oninput="this.style.borderColor=''">
              <button class="res-bulk-apply-btn" onclick="window._resBulkChangePrice()"><i class="ri-check-line"></i>تطبيق</button>
            </div>
            <div class="res-bulk-divider"></div>
            <button class="res-bulk-cancel" onclick="window._resClearSel()"><i class="ri-close-line"></i>إلغاء</button>
          </div>

          <div class="res-results-count" id="resultsCount"></div>
          <div id="tableWrap"><div class="res-loader-box"><div class="res-spinner"></div></div></div>
          <div id="res-pagination"></div>
        </div>
      `;

      /* ── modal events ── */
      document.getElementById('res-modal').addEventListener('click', e => {
        if (e.target === document.getElementById('res-modal')) closeModal();
      }, { signal: window.__pageAbortSignal });
      document.getElementById('res-buyer-modal').addEventListener('click', e => {
        if (e.target === document.getElementById('res-buyer-modal')) closeBuyerModal();
      }, { signal: window.__pageAbortSignal });
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          if (document.getElementById('res-buyer-modal').style.display === 'flex') closeBuyerModal();
          else closeModal();
        }
      }, { signal: window.__pageAbortSignal });

      const API_BASE = window.location.origin;
      const PER_PAGE = 15;

      const S = {
        page:1, units:[], bookings:[], merged:[], filtered:[],
        filter:'all', projects:[], buildings:[], floors:[], buyers:[],
        selectedProject:'', selectedBuilding:'', sel:new Set(),
        dateSort:'desc'   // 'desc'=الأحدث أولاً , 'asc'=الأقدم أولاً
      };
      window.S_res = S;

      function getAuthToken() {
        let token=localStorage.getItem('token')||localStorage.getItem('authToken');
        if(!token){const d=localStorage.getItem('authData');if(d){try{const p=JSON.parse(d);token=p.token||p.authToken;}catch{}}}
        return token||'';
      }

      async function api(method,path,body){
        const token=getAuthToken();
        if(!token){
          window.__showToast?.('يرجى تسجيل الدخول أولاً','error');
          setTimeout(()=>{ window.location.replace('/login'); }, 1500);
          return null;
        }
        const opts={method,headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`}};
        if(body) opts.body=JSON.stringify(body);
        try{
          const r=await fetch(API_BASE+path,opts);
          if(!r.ok){
            if(r.status===401){
              window.__showToast?.('انتهت صلاحية جلستك، جارٍ تسجيل الخروج...','warning',2500);
              setTimeout(()=>{
                ['authData','token','authToken','rememberMe','savedEmail'].forEach(k=>localStorage.removeItem(k));
                window.location.replace('/login');
              }, 2000);
              return null;
            }
            if(r.status===403){
              window.__showToast?.('ليس لديك صلاحية لهذا الإجراء','error');
              return null;
            }
            let errMsg=`خطأ ${r.status}`;
            try{const j=await r.json();errMsg=j.message||j.title||j.detail||j.error||(j.errors?Object.values(j.errors).flat().join(', '):null)||errMsg;}catch{}
            throw new Error(errMsg);
          }
          if(method!=='GET') window.__noteLocalChange?.(); // امنع صدى realtime المزدوج بعد تعديل محلي
          if(r.status===204) return null;
          return r.json().catch(()=>null);
        }catch(e){
          if(e.name==='AbortError') return null;
          if(e.message && !e.message.includes('fetch')) throw e;
          window.__showToast?.('تعذر الاتصال بالخادم','error');
          throw e;
        }
      }

      const GET    = p     => api('GET',p);
      const POST   = (p,b) => api('POST',p,b);
      const PUT    = (p,b) => api('PUT',p,b);
      const DELETE = p     => api('DELETE',p);
      function arr(v){return Array.isArray(v)?v:(v?.['$values']||v?.data||v?.items||v?.value||[]);}
      function bNameStr(b){if(!b)return'—';return(b.fullName||b.FullName||`${b.firstName||''} ${b.lastName||''}`.trim())||'—';}

      function toast(msg,type='success'){
        const el=document.createElement('div');el.className=`res-toast ${type}`;
        el.innerHTML=`<i class="${type==='success'?'ri-checkbox-circle-line':'ri-error-warning-line'}" style="color:${type==='success'?'var(--success)':'var(--danger)'}"></i><span>${msg}</span>`;
        const tc=document.getElementById('res-toast-container');if(tc)tc.appendChild(el);
        setTimeout(()=>el.remove(),3200);
      }

      function openModal(title,html){
        document.getElementById('res-modal-title').textContent=title;
        document.getElementById('res-modal-content').innerHTML=html;
        document.getElementById('res-modal').style.display='flex';
      }
      function closeModal(){
        document.getElementById('res-modal').style.display='none';
        document.getElementById('res-modal-content').innerHTML='';
      }
      window.closeModal=closeModal;

      function closeBuyerModal(){
        document.getElementById('res-buyer-modal').style.display='none';
        document.getElementById('res-buyer-modal-content').innerHTML='';
      }
      window.closeBuyerModal=closeBuyerModal;

      // استخدم المترجم الشامل من Layout.js، مع fallback محلي
      function translateError(msg){
        return (window.__translateError && window.__translateError(msg)) || msg || 'حدث خطأ غير متوقع';
      }

      function typeLabel(type){
        if(type===2||type===3) return 'روف';
        if(typeof type==='string'){const t=type.toLowerCase();if(t==='roof') return 'روف';}
        return 'شقة';
      }

      function v(id){const el=document.getElementById(id);return el?el.value.trim():'';}
      function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
      function fmtDate(d){if(!d)return'—';try{const dt=new Date(d);const day=String(dt.getDate()).padStart(2,'0');const month=String(dt.getMonth()+1).padStart(2,'0');return`${day}/${month}/${dt.getFullYear()}`;}catch{return'—';}}
      function fmtMoney(n){return window.fmtMoney(n);}
      function initials(name){if(!name)return'؟';const p=name.trim().split(' ');return((p[0]||'').charAt(0)+(p[1]||'').charAt(0)).toUpperCase()||'؟';}
      function setBusy(id,busy,label='حفظ'){const el=document.getElementById(id);if(!el)return;el.disabled=busy;el.innerHTML=busy?'<i class="ri-loader-4-line" style="animation:res-spin 0.8s linear infinite;display:inline-block"></i> جاري...':`<i class="ri-save-line"></i> ${label}`;}
      function showLoader(){const w=document.getElementById('tableWrap');if(w)w.innerHTML='<div class="res-loader-box"><div class="res-spinner"></div></div>';const p=document.getElementById('res-pagination');if(p)p.innerHTML='';}

      function toStatus(val){
        if(val===null||val===undefined) return 4;
        if(typeof val==='number') return val;
        const map={'available':1,'reserved':2,'sold':3,'closed':4,'Available':1,'Reserved':2,'Sold':3,'Closed':4};
        return map[val]??4;
      }

      const UNIT_STATUS_AR   ={1:'متاح',2:'محجوز',3:'مباع',4:'مقفول'};
      const UNIT_STATUS_BADGE={1:'badge-available',2:'badge-reserved',3:'badge-sold',4:'badge-locked'};

      // ── PROJECT STATUS LABELS (مضاف بعد نقل الحالة من Building إلى Project) ──
      const PROJECT_STATUS_AR={1:'تحت الإنشاء',2:'مكتمل',3:'متوقف',4:'مخطط'};

      function populateProjectDropdown(){
        const sel=document.getElementById('projectFilter');if(!sel)return;
        sel.innerHTML='<option value="">— كل المشاريع —</option>';
        S.projects.filter(p=>!p.isDeleted).forEach(p=>{sel.innerHTML+=`<option value="${p.id}" ${String(p.id)===S.selectedProject?'selected':''}>${p.name||''}</option>`;});
      }
      window.populateBuildingDropdown=function(){
        const sel=document.getElementById('buildingFilter');if(!sel)return;
        sel.innerHTML='<option value="">— كل المباني —</option>';
        let list=S.buildings.filter(b=>!b.isDeleted);
        if(S.selectedProject) list=list.filter(b=>String(b.projectId)===S.selectedProject);
        list.forEach(b=>{sel.innerHTML+=`<option value="${b.id}" ${String(b.id)===S.selectedBuilding?'selected':''}>${b.name||''}</option>`;});
      };

      // ══════════════════════════════════════════════════════
      // mergeData — التعديل الرئيسي:
      // - إزالة أي استخدام لـ building.status أو building.expectedDeliveryDate
      // - إضافة projectStatus و projectStatusAr و projectExpectedDelivery
      //   من كائن الـ Project مباشرة
      // ══════════════════════════════════════════════════════
      function mergeData(){
        // نعرض جميع الوحدات غير المحذوفة (بما فيها المقفولة في أي مبنى)
        S.merged=[];
        S.units.forEach(u=>{
          if(u.isDeleted) return;
          const unitStatus=toStatus(u.status);
          const booking=S.bookings.find(b=>Number(b.unitId)===Number(u.id)&&!b.isDeleted&&b.status!==3&&b.status!=='Cancelled')||null;
          const floor   =S.floors.find(f=>f.id===u.floorId);
          const building=floor?S.buildings.find(b=>b.id===floor.buildingId):null;
          const project =building?S.projects.find(p=>p.id===building.projectId):null;
          let buyerName='—'; let buyerId=null;
          if(u.buyerId){
            const buyer=S.buyers.find(b=>Number(b.id)===Number(u.buyerId));
            if(buyer){buyerName=bNameStr(buyer); buyerId=u.buyerId;}
          } else if(booking?.buyerId){
            const buyer=S.buyers.find(b=>Number(b.id)===Number(booking.buyerId));
            if(buyer){buyerName=bNameStr(buyer); buyerId=booking.buyerId;}
          }
          // ── حالة المشروع وموعد التسليم الآن من Project مباشرة (مش من Building) ──
          const projectStatus         = project?.status ?? null;
          const projectStatusAr       = project?.statusAr || PROJECT_STATUS_AR[projectStatus] || '—';
          const projectExpectedDelivery = project?.expectedDeliveryDate || null;

          S.merged.push({
            ...u, booking, buyerName, buyerId,
            projectName: project?.name||'—', projectId: project?.id,
            projectStatus, projectStatusAr, projectExpectedDelivery,
            buildingName: building?.name||'—', buildingId: building?.id,
            floorNumber: floor?.floorNumber||'—', realStatus: unitStatus
          });
        });
        _sortMerged();
      }
      function _getUnitDate(u){ return new Date(u.booking?.bookingDate||u.booking?.createdAt||u.updatedAt||u.createdAt||0).getTime(); }
      function _sortMerged(){
        S.merged.sort((a,b)=> S.dateSort==='asc' ? _getUnitDate(a)-_getUnitDate(b) : _getUnitDate(b)-_getUnitDate(a));
      }
      window._resToggleDateSort=function(){
        S.dateSort= S.dateSort==='desc'?'asc':'desc';
        _sortMerged();
        S.filtered=[...S.filtered].sort((a,b)=> S.dateSort==='asc'?_getUnitDate(a)-_getUnitDate(b):_getUnitDate(b)-_getUnitDate(a));
        S.page=1; renderTable();
      };

      const FILTER_MAP={'all':null,'available':[1],'reserved':[2],'sold':[3],'closed':[4]};

      // ── حفظ واستعادة حالة الفلاتر ──
      function _saveResState() {
        window.__savePageState?.('reservations', {
          filter:  S.filter,
          page:    S.page,
          proj:    S.selectedProject,
          bldg:    S.selectedBuilding,
          search:  document.getElementById('searchInput')?.value || '',
          dateFrom:document.getElementById('res-dateFrom')?.value || '',
          dateTo:  document.getElementById('res-dateTo')?.value   || '',
        });
      }

      function _restoreResState() {
        const sv = window.__loadPageState?.('reservations');
        if (!sv) return;
        S.filter = sv.filter || 'all';
        S.selectedProject  = sv.proj  || '';
        S.selectedBuilding = sv.bldg  || '';
        S.page = sv.page || 1;
        // استعادة حقول البحث والتاريخ
        const si = document.getElementById('searchInput');
        if (si && sv.search)   si.value = sv.search;
        const df = document.getElementById('res-dateFrom');
        if (df && sv.dateFrom) df.value = sv.dateFrom;
        const dt = document.getElementById('res-dateTo');
        if (dt && sv.dateTo)   dt.value = sv.dateTo;
        // استعادة الـ dropdown
        const projSel = document.getElementById('projectFilter');
        if (projSel && sv.proj) { projSel.value = sv.proj; S.selectedProject = sv.proj; }
        const bldgSel = document.getElementById('buildingFilter');
        if (bldgSel && sv.bldg) { bldgSel.value = sv.bldg; S.selectedBuilding = sv.bldg; }
        // استعادة الـ pill النشطة
        document.querySelectorAll('.res-pill').forEach(b => {
          b.className = b.dataset.cls || 'res-pill';
          if ((b.dataset.filter || b.getAttribute('onclick')?.match(/'(\w+)'/)?.[1]) === sv.filter) b.classList.add('active');
        });
      }

      let _searchTimer=null;
      window.handleSearch=function(){
        clearTimeout(_searchTimer);
        _searchTimer=setTimeout(()=>{ applyFilter(); _saveResState(); }, 160);
      };
      window.setFilter=function(f,btn){
        S.filter=f;
        document.querySelectorAll('.res-pill').forEach(b=>{b.className=b.dataset.cls||'res-pill';});
        btn.classList.add('active');
        applyFilter(); _saveResState();
      };
      window.clearDateFilter=function(){
        const df=document.getElementById('res-dateFrom');const dt=document.getElementById('res-dateTo');
        if(df)df.value='';if(dt)dt.value='';
        const cb=document.getElementById('res-dateClearBtn');if(cb)cb.style.display='none';
        applyFilter(); _saveResState();
      };

      function applyFilter(){
        S.sel.clear();
        const q=(document.getElementById('searchInput')?.value||'').toLowerCase().trim();
        const dateFrom=document.getElementById('res-dateFrom')?.value||'';
        const dateTo  =document.getElementById('res-dateTo')?.value||'';
        const clearBtn=document.getElementById('res-dateClearBtn');
        if(clearBtn) clearBtn.style.display=(dateFrom||dateTo)?'flex':'none';
        const fromTs=dateFrom?new Date(dateFrom).setHours(0,0,0,0):null;
        const toTs  =dateTo  ?new Date(dateTo).setHours(23,59,59,999):null;
        S.filtered=S.merged.filter(u=>{
          const mf=S.filter==='all'||FILTER_MAP[S.filter].includes(u.realStatus);
          const mp=!S.selectedProject||String(u.projectId)===S.selectedProject;
          const mb=!S.selectedBuilding||String(u.buildingId)===S.selectedBuilding;
          const ms=!q||(u.unitNumber||'').toLowerCase().includes(q)||(u.buyerName||'').toLowerCase().includes(q)||(u.buildingName||'').toLowerCase().includes(q)||(u.projectName||'').toLowerCase().includes(q)||String(u.id).includes(q);
          let md=true;
          if(fromTs||toTs){
            const rawDate=u.booking?.bookingDate||u.booking?.createdAt||u.updatedAt||u.createdAt;
            if(!rawDate){md=false;}else{const ts=new Date(rawDate).getTime();md=(!fromTs||ts>=fromTs)&&(!toTs||ts<=toTs);}
          }
          return mf&&mp&&mb&&ms&&md;
        });
        S.page=1; renderTable(); _resUpdateBar();
      }
      window.applyFilter=applyFilter;

      /* ════ renderTable — مع staggered row animation ════ */
      function renderTable(){
        const wrap=document.getElementById('tableWrap');
        const pag =document.getElementById('res-pagination');
        const cnt =document.getElementById('resultsCount');
        if(!wrap) return;
        if(cnt) cnt.textContent=`النتائج: ${S.filtered.length}`;
        if(!S.filtered.length){
          wrap.innerHTML='<div class="res-empty-msg"><i class="ri-calendar-check-line"></i><p>لا توجد وحدات مطابقة</p></div>';
          if(pag) pag.innerHTML=''; return;
        }
        const start=(S.page-1)*PER_PAGE;
        const page=S.filtered.slice(start,start+PER_PAGE);
        const pageIds=page.map(u=>u.id);
        const allPageSel=pageIds.length>0&&pageIds.every(id=>S.sel.has(id));
        wrap.innerHTML=`
          <div class="res-table-container"><div class="res-table-scroll"><table>
            <thead><tr>
              <th style="width:42px;text-align:center;padding-right:8px"><input type="checkbox" class="res-row-checkbox" id="res-check-all" ${allPageSel?'checked':''} onchange="window._resTogglePageAll(this)" title="تحديد الصفحة"></th>
              <th>الوحدة</th>
              <th>الموقع</th>
              <th>الحالة</th>
              <th>العميل</th>
              <th>السعر الإجمالي</th>
              <th onclick="window._resToggleDateSort()" style="cursor:pointer;user-select:none;white-space:nowrap">
                تاريخ الحجز <i class="ri-arrow-${S.dateSort==='desc'?'down':'up'}-line" style="font-size:.75rem;opacity:.6"></i>
              </th>
              <th style="width:90px;text-align:center">إجراء</th>
            </tr></thead>
            <tbody>${page.map((u,i)=>{
              const stAr =UNIT_STATUS_AR[u.realStatus]||'مجهول';
              const stBdg=UNIT_STATUS_BADGE[u.realStatus]||'badge-locked';
              const hasBuyer=u.buyerName&&u.buyerName!=='—';
              const bDate=fmtDate(u.booking?.bookingDate||u.booking?.createdAt||u.updatedAt);
              const isSel=S.sel.has(u.id);
              return `<tr class="res-row-enter${isSel?' sel-row':''}" data-uid="${u.id}" style="animation-delay:${i*45}ms" onclick="window._resToggleRow(${u.id},event)">
                <td style="text-align:center;padding-right:8px" onclick="event.stopPropagation()">
                  <input type="checkbox" class="res-row-checkbox" ${isSel?'checked':''} onchange="window._resToggleRow(${u.id},event)">
                </td>
                <td>
                  <div style="display:flex;align-items:center;gap:8px">
                    <div style="width:36px;height:36px;border-radius:9px;background:rgba(78,141,245,0.1);border:1px solid rgba(78,141,245,0.2);display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:800;color:var(--accent);flex-shrink:0">${u.unitNumber||'—'}</div>
                    <span style="font-size:0.75rem;color:var(--text-muted);font-weight:600">${typeLabel(u.type)}</span>
                  </div>
                </td>
                <td>
                  <div style="font-weight:700;font-size:0.85rem;color:var(--accent);line-height:1.3">${u.projectName}</div>
                  <div style="font-size:0.76rem;color:var(--text-muted);margin-top:2px">${u.buildingName} · دور ${u.floorNumber}</div>
                </td>
                <td><span class="res-badge ${stBdg}">${stAr}</span></td>
                <td>${hasBuyer
                  ? `<div class="res-buyer-cell">
                       <div class="res-buyer-avatar">${initials(u.buyerName)}</div>
                       <div>
                         <div class="res-buyer-name">${esc(u.buyerName)}</div>
                         ${(()=>{const b=S.buyers.find(x=>Number(x.id)===Number(u.buyerId));return b&&b.phoneNumber?`<div style="font-size:0.72rem;color:var(--text-muted);direction:ltr;text-align:right">${esc(b.phoneNumber)}</div>`:'';})()}
                       </div>
                     </div>`
                  : '<span class="res-buyer-empty">—</span>'}
                </td>
                <td><span class="res-money">${fmtMoney(u.price)}</span></td>
                <td style="color:var(--text-muted);font-size:0.82rem;white-space:nowrap">${bDate}</td>
                <td onclick="event.stopPropagation()">
                  <div class="res-row-actions">
                    <button class="res-action-btn view" data-tip="تفاصيل" onclick="window.openDetailsModal(${u.id})"><i class="ri-eye-line"></i></button>
                    <button class="res-action-btn edit" data-tip="تعديل" onclick="window.openEditModal(${u.id})"><i class="ri-edit-line"></i></button>
                    ${u.booking?`<button class="res-action-btn del" data-tip="إلغاء الحجز" onclick="window.deleteBooking(${u.booking.id},'${u.unitNumber}')"><i class="ri-delete-bin-line"></i></button>`:''}
                  </div>
                </td>
              </tr>`;
            }).join('')}</tbody>
          </table></div></div>`;

        const pages=Math.ceil(S.filtered.length/PER_PAGE);
        if(!pag) return;
        if(pages<=1){pag.innerHTML='';return;}
        let h=`<button class="res-pg-btn" onclick="window.goPage(${S.page-1})" ${S.page===1?'disabled':''}>السابق</button>`;
        for(let i=1;i<=pages;i++) h+=`<button class="res-pg-btn ${S.page===i?'active':''}" onclick="window.goPage(${i})">${i}</button>`;
        h+=`<button class="res-pg-btn" onclick="window.goPage(${S.page+1})" ${S.page===pages?'disabled':''}>التالي</button>`;
        pag.innerHTML=h;
      }
      window.goPage=function(p){S.page=p;renderTable();_saveResState();window.scrollTo({top:0,behavior:'smooth'});};
      window._saveResState = _saveResState;

      async function loadAll(){
        showLoader();
        try{
          const[unitsData,bookingsData,projectsData,buildingsData,floorsData,buyersData]=await Promise.all([
            GET('/api/Units'),GET('/api/Bookings').catch(()=>[]),GET('/api/Projects').catch(()=>[]),
            GET('/api/Buildings').catch(()=>[]),GET('/api/Floors').catch(()=>[]),GET('/api/Buyers').catch(()=>[]),
          ]);
          S.units    =arr(unitsData);S.bookings=arr(bookingsData);S.projects=arr(projectsData);
          S.buildings=arr(buildingsData);S.floors=arr(floorsData);S.buyers=arr(buyersData);
          mergeData();S.filtered=[...S.merged];
          populateProjectDropdown();window.populateBuildingDropdown();
          // استعادة حالة الفلاتر السابقة
          _restoreResState();
          applyFilter(); renderTable();_resUpdateBar();
        }catch(e){
          console.error('loadAll:',e);toast(translateError(e.message)||'فشل تحميل البيانات','error');
          const w=document.getElementById('tableWrap');if(w)w.innerHTML='<div class="res-empty-msg"><i class="ri-wifi-off-line"></i><p>فشل الاتصال بالخادم</p></div>';
        }
      }

      /* ════ openBuyerDetailModal — مودال تفاصيل العميل المنبثق ════ */
      window.openBuyerDetailModal=function(buyerId){
        const buyer=S.buyers.find(b=>Number(b.id)===Number(buyerId));
        if(!buyer){toast('لم يتم العثور على بيانات العميل','error');return;}
        const fullName=bNameStr(buyer);
        const buyerUnits=S.units.filter(u=>Number(u.buyerId)===Number(buyerId)&&toStatus(u.status)!==1&&toStatus(u.status)!==4);
        document.getElementById('res-buyer-modal-title').textContent=`تفاصيل العميل`;
        document.getElementById('res-buyer-modal-content').innerHTML=`
          <div class="res-modal-body">
            <div style="display:flex;align-items:center;gap:16px;padding:18px;background:rgba(78,141,245,.08);border-radius:14px;border:1px solid rgba(78,141,245,.2);margin-bottom:20px">
              <div style="width:54px;height:54px;border-radius:50%;background:linear-gradient(135deg,#4e8df5,#3a7de4);display:flex;align-items:center;justify-content:center;font-size:1.25rem;font-weight:800;color:#fff;flex-shrink:0">
                ${initials(fullName)}
              </div>
              <div>
                <div style="font-size:1.05rem;font-weight:800;color:var(--light)">${esc(fullName)}</div>
                <div style="font-size:0.78rem;color:var(--text-muted);margin-top:2px">${esc(buyer.email||'')}</div>
              </div>
            </div>
            <div class="res-detail-grid" style="margin-bottom:18px">
              <div class="res-detail-block">
                <div class="res-detail-label">رقم الهاتف</div>
                <div class="res-detail-value" style="direction:ltr;text-align:right">${esc(buyer.phoneNumber||'—')}</div>
              </div>
              <div class="res-detail-block">
                <div class="res-detail-label">الرقم الوطني</div>
                <div class="res-detail-value" style="font-family:monospace">${esc(buyer.nationalId||'—')}</div>
              </div>
              ${buyer.address?`<div class="res-detail-block full"><div class="res-detail-label">العنوان</div><div class="res-detail-value">${esc(buyer.address)}</div></div>`:''}
              <div class="res-detail-block">
                <div class="res-detail-label">تاريخ التسجيل</div>
                <div class="res-detail-value">${fmtDate(buyer.createdAt)}</div>
              </div>
              <div class="res-detail-block">
                <div class="res-detail-label">عدد الوحدات</div>
                <div class="res-detail-value" style="color:var(--accent)">${buyerUnits.length} وحدة</div>
              </div>
            </div>
          </div>
          <div class="res-modal-footer" style="border-radius:0 0 20px 20px;background:rgba(0,0,0,.15)">
            <button class="res-btn-secondary" onclick="window.closeBuyerModal()">إغلاق</button>
          </div>
        `;
        document.getElementById('res-buyer-modal').style.display='flex';
      };

      // ══════════════════════════════════════════════════════
      // openDetailsModal — التعديل:
      // - إضافة حالة المشروع وموعد التسليم التقديري
      //   (مصدرهم u.projectStatusAr و u.projectExpectedDelivery)
      // - إزالة أي إشارة لـ building.status أو building.expectedDeliveryDate
      // ══════════════════════════════════════════════════════
      window.openDetailsModal=function(unitId){
        const u=S.merged.find(x=>Number(x.id)===Number(unitId));if(!u)return;
        const stAr =UNIT_STATUS_AR[u.realStatus]||'مجهول';
        const stBdg=UNIT_STATUS_BADGE[u.realStatus]||'badge-locked';
        const hasBuyer=u.buyerName&&u.buyerName!=='—'&&u.buyerId;

        const buyerSection=hasBuyer
          ? `<div class="res-buyer-card">
               <div class="res-buyer-card-avatar">${initials(u.buyerName)}</div>
               <div style="flex:1;min-width:0">
                 <div class="res-buyer-card-name">${esc(u.buyerName)}</div>
                 ${(()=>{const b=S.buyers.find(x=>Number(x.id)===Number(u.buyerId));return b?`<div class="res-buyer-card-phone">${esc(b.phoneNumber||'')}</div><div class="res-buyer-card-email">${esc(b.email||'')}</div>`:'';})()}
               </div>
               <button class="res-buyer-detail-btn" onclick="window.openBuyerDetailModal(${u.buyerId})">
                 <i class="ri-user-search-line"></i> تفاصيل
               </button>
             </div>`
          : `<div style="text-align:center;padding:14px;color:var(--text-muted);background:rgba(var(--fg-rgb), .02);border-radius:10px;font-size:0.85rem">لا يوجد عميل مرتبط</div>`;

        openModal(`تفاصيل الوحدة: ${u.unitNumber}`,`
          <div class="res-modal-body">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
              <span class="res-badge ${stBdg}" style="font-size:0.92rem;padding:6px 14px">${stAr}</span>
              <span style="color:var(--text-muted);font-size:0.82rem">تاريخ الحجز: ${fmtDate(u.booking?.bookingDate||u.booking?.createdAt)}</span>
            </div>

            <div class="res-detail-grid" style="margin-bottom:18px">
              <div class="res-detail-block"><div class="res-detail-label">المشروع</div><div class="res-detail-value" style="color:var(--accent)">${esc(u.projectName)}</div></div>
              <div class="res-detail-block"><div class="res-detail-label">حالة المشروع</div><div class="res-detail-value">${esc(u.projectStatusAr||'—')}</div></div>
              <div class="res-detail-block"><div class="res-detail-label">موعد التسليم</div><div class="res-detail-value">${fmtDate(u.projectExpectedDelivery)}</div></div>
              <div class="res-detail-block"><div class="res-detail-label">المبنى</div><div class="res-detail-value">${esc(u.buildingName)}</div></div>
              <div class="res-detail-block"><div class="res-detail-label">الدور</div><div class="res-detail-value">${esc(String(u.floorNumber))}</div></div>
              <div class="res-detail-block"><div class="res-detail-label">النوع</div><div class="res-detail-value" style="color:var(--accent)">${typeLabel(u.type)}</div></div>
              <div class="res-detail-block"><div class="res-detail-label">الغرف</div><div class="res-detail-value">${(()=>{const r=u.rooms??u.unitRooms??u.Rooms??u.numberOfRooms; return (r!=null && Number(r)>0) ? Number(r) : '—'; })()}</div></div>
              <div class="res-detail-block"><div class="res-detail-label">المساحة</div><div class="res-detail-value">${(()=>{const a=u.area??u.unitArea??u.Area; return (a!=null && Number(a)>0) ? Number(a)+' م²' : '—'; })()}</div></div>
              <div class="res-detail-block full">
                <div class="res-detail-label">السعر الإجمالي</div>
                <div class="res-detail-value" style="color:var(--success);font-size:1.1rem">${fmtMoney(u.price)}</div>
              </div>
            </div>

            <div style="margin-bottom:8px">
              <div style="font-size:0.72rem;text-transform:uppercase;letter-spacing:0.5px;color:var(--text-muted);font-weight:700;margin-bottom:10px;display:flex;align-items:center;gap:6px">
                <i class="ri-user-line" style="color:var(--accent)"></i> العميل
              </div>
              ${buyerSection}
            </div>
          </div>
          <div class="res-modal-footer">
            <button class="res-btn-primary" onclick="window.closeModal();window.openEditModal(${u.id})"><i class="ri-edit-line"></i> تعديل</button>
            <button class="res-btn-secondary" onclick="window.closeModal()">إغلاق</button>
          </div>
        `);
      };

      window.openEditModal=async function(unitId){
        const unit=S.merged.find(u=>Number(u.id)===Number(unitId));if(!unit)return;
        const statusOpts=[{val:1,label:'متاح'},{val:2,label:'محجوز'},{val:3,label:'مباع'},{val:4,label:'مقفول'}]
          .map(o=>`<option value="${o.val}" ${unit.realStatus===o.val?'selected':''}>${o.label}</option>`).join('');
        const currentBuyerId=String(unit.buyerId||unit.booking?.buyerId||'');
        const currentBuyer=currentBuyerId?S.buyers.find(b=>String(b.id)===currentBuyerId):null;
        const currentBuyerLabel=currentBuyer?bNameStr(currentBuyer):'';
        const buyerCSDOptions=S.buyers.map(b=>({value:String(b.id),label:bNameStr(b)}));
        const needsBuyer=(unit.realStatus===2||unit.realStatus===3);
        openModal(`تعديل بيانات: وحدة ${unit.unitNumber}`,`
          <div class="res-modal-body">
            <div class="res-form-section unit-sec">
              <div class="res-section-label">تحديث الوحدة</div>
              <div class="res-form-row">
                <div class="res-form-group"><label class="res-form-label">حالة الوحدة</label>
                  <select id="f-edit-status" class="res-form-select" onchange="window._onEditStatusChange(this.value)">${statusOpts}</select>
                </div>
                <div class="res-form-group"><label class="res-form-label">إجمالي السعر (${window.CUR()})</label><input id="f-price" class="res-form-input" type="number" step="1000" min="0" value="${unit.price||''}"></div>
              </div>
            </div>
            <div class="res-form-section book-sec" id="f-buyer-section" style="${needsBuyer?'':'display:none'}">
              <div class="res-section-label">العميل</div>
              <div class="res-form-group">
                <label class="res-form-label">تخصيص العميل <span id="f-buyer-required" style="color:var(--danger);${needsBuyer?'':'display:none'}">*</span></label>
                ${_buildCSD('f-buyer', buyerCSDOptions, '— ابحث عن العميل —')}
              </div>
            </div>
          </div>
          <div class="res-modal-footer">
            <button class="res-btn-primary" id="submitBtn" onclick="window.submitEditUnit(${unit.id},${unit.booking?.id||'null'})"><i class="ri-save-line"></i> حفظ التعديلات</button>
            <button class="res-btn-secondary" onclick="window.closeModal()">إلغاء</button>
          </div>
        `);
        // set click handler on each CSD option
        setTimeout(()=>{
          const d=document.getElementById('f-buyer-dropdown');
          if(d) d.querySelectorAll('.csd-option').forEach(el=>{
            el.addEventListener('mousedown',e=>{e.preventDefault();window._csdSelect('f-buyer',el.dataset.value,el.dataset.label);});
          });
          if(currentBuyerId) window._csdInitValue('f-buyer',currentBuyerId,currentBuyerLabel);
        },0);
      };
      window._onEditStatusChange=function(val){
        const n=Number(val);
        const sec=document.getElementById('f-buyer-section');
        const req=document.getElementById('f-buyer-required');
        const needsBuyer=n===2||n===3;
        if(sec) sec.style.display=needsBuyer?'':'none';
        if(req) req.style.display=needsBuyer?'':'none';
        /* highlight price field as required when selling */
        const priceInput=document.getElementById('f-price');
        const priceLabel=priceInput&&priceInput.closest('.res-form-group')&&priceInput.closest('.res-form-group').querySelector('.res-form-label');
        if(priceInput){
          if(n===3){
            priceInput.style.borderColor='rgba(255,59,48,.4)';
            if(priceLabel&&!priceLabel.querySelector('.price-req')) priceLabel.insertAdjacentHTML('beforeend','<span class="price-req" style="color:var(--danger);margin-right:4px"> *مطلوب</span>');
          } else {
            priceInput.style.borderColor='';
            const pr=priceLabel&&priceLabel.querySelector('.price-req');
            if(pr) pr.remove();
          }
        }
      };

      window.submitEditUnit=async function(id,existingBookingId){
        const status =Number(v('f-edit-status'));
        const price  =parseFloat(v('f-price'))||0;
        const buyerId=v('f-buyer')||null;
        const needsBuyer=status===2||status===3;
        if(status===3&&(!price||price<=0)){toast('يجب تحديد سعر البيع للوحدة قبل إتمام عملية البيع','error');return;}
        if(needsBuyer&&!buyerId){toast('يجب تخصيص عميل للوحدة قبل إتمام الحجز أو البيع','error');return;}
        setBusy('submitBtn',true,'حفظ التعديلات');
        try{
          // نداء واحد ذرّي: الباك-إند يتولّى الحالة + الربط + الـ booking + العدّادات
          await PUT(`/api/Units/${id}/reservation`,{ status, buyerId: needsBuyer?Number(buyerId):null, price });
          toast('تم حفظ التعديلات بنجاح');closeModal();await loadAll();
        }catch(e){console.error('submitEditUnit:',e);toast(translateError(e.message)||'فشل حفظ التعديلات','error');}
        setBusy('submitBtn',false,'حفظ التعديلات');
      };

      window.openAddBooking=function(){
        const activeProjects=S.projects.filter(p=>!p.isDeleted);
        if(!activeProjects.length){toast('لا توجد مشاريع متاحة','error');return;}
        const projectOpts='<option value="">— اختر المشروع —</option>'+activeProjects.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
        const buyerCSDOptions=S.buyers.map(b=>({value:String(b.id),label:bNameStr(b)}));
        openModal('حجز وحدة',`
          <div class="res-modal-body">
            <div class="res-form-section unit-sec">
              <div class="res-section-label">تحديد الوحدة</div>
              <div class="res-form-row">
                <div class="res-form-group"><label class="res-form-label">المشروع *</label><select id="f-book-project" class="res-form-select" onchange="window.onBookProjectChange()">${projectOpts}</select></div>
                <div class="res-form-group"><label class="res-form-label">المبنى *</label><select id="f-book-building" class="res-form-select" onchange="window.onBookBuildingChange()" disabled><option value="">— اختر المشروع أولاً —</option></select></div>
              </div>
              <div class="res-form-group"><label class="res-form-label">الوحدة (المتاحة فقط) *</label><select id="f-unit" class="res-form-select" disabled><option value="">— اختر المبنى أولاً —</option></select></div>
            </div>
            <div class="res-form-section book-sec">
              <div class="res-section-label">تفاصيل الإجراء</div>
              <div class="res-form-row">
                <div class="res-form-group"><label class="res-form-label">المشتري *</label>${_buildCSD('f-buyer',buyerCSDOptions,'— ابحث عن المشتري —')}</div>
                <div class="res-form-group"><label class="res-form-label">نوع الإجراء *</label><select id="f-action-type" class="res-form-select" onchange="window._onActionTypeChange(this.value)"><option value="reserved" selected>حجز (مبدئي)</option><option value="sold">بيع (نهائي)</option></select></div>
              </div>
              <div class="res-form-group" id="f-price-group" style="display:none">
                <label class="res-form-label">سعر البيع (${window.CUR()}) <span style="color:var(--danger)">* مطلوب للبيع</span></label>
                <input id="f-add-price" class="res-form-input" type="number" step="1000" min="1" placeholder="أدخل سعر البيع...">
              </div>
            </div>
          </div>
          <div class="res-modal-footer">
            <button class="res-btn-primary" id="submitBtn" onclick="window.submitAddBooking()"><i class="ri-save-line"></i> تأكيد العملية</button>
            <button class="res-btn-secondary" onclick="window.closeModal()">إلغاء</button>
          </div>
        `);
        setTimeout(()=>{
          const d=document.getElementById('f-buyer-dropdown');
          if(d) d.querySelectorAll('.csd-option').forEach(el=>{
            el.addEventListener('mousedown',e=>{e.preventDefault();window._csdSelect('f-buyer',el.dataset.value,el.dataset.label);});
          });
        },0);
      };

      window.onBookProjectChange=function(){
        const projId=document.getElementById('f-book-project').value;
        const bldSel=document.getElementById('f-book-building');
        const unitSel=document.getElementById('f-unit');
        unitSel.innerHTML='<option value="">— اختر المبنى أولاً —</option>';unitSel.disabled=true;
        if(!projId){bldSel.innerHTML='<option value="">— اختر المشروع أولاً —</option>';bldSel.disabled=true;return;}
        const buildings=S.buildings.filter(b=>!b.isDeleted&&String(b.projectId)===String(projId));
        if(!buildings.length){bldSel.innerHTML='<option value="">— لا توجد مباني —</option>';bldSel.disabled=true;return;}
        bldSel.innerHTML='<option value="">— اختر المبنى —</option>'+buildings.map(b=>`<option value="${b.id}">${b.name}</option>`).join('');
        bldSel.disabled=false;
      };

      window.onBookBuildingChange=function(){
        const bldId=document.getElementById('f-book-building').value;
        const unitSel=document.getElementById('f-unit');
        if(!bldId){unitSel.innerHTML='<option value="">— اختر المبنى أولاً —</option>';unitSel.disabled=true;return;}
        const allUnits=S.units.filter(u=>{
          const floor=S.floors.find(f=>f.id===u.floorId);
          return floor&&String(floor.buildingId)===String(bldId)&&toStatus(u.status)===1;
        });
        if(!allUnits.length){unitSel.innerHTML='<option value="">— لا توجد وحدات متاحة —</option>';unitSel.disabled=true;return;}
        allUnits.sort((a,b)=>String(a.unitNumber).localeCompare(String(b.unitNumber),undefined,{numeric:true}));
        unitSel.innerHTML='<option value="">— اختر الوحدة —</option>'+allUnits.map(u=>`<option value="${u.id}" data-floor="${u.floorId}">وحدة ${u.unitNumber} (${typeLabel(u.type)})</option>`).join('');
        unitSel.disabled=false;
      };

      window._onActionTypeChange=function(val){
        const pg=document.getElementById('f-price-group');
        if(pg) pg.style.display=val==='sold'?'':'none';
      };

      window.submitAddBooking=async function(){
        const sel=document.getElementById('f-unit');
        const unitId=Number(sel.value);
        const buyerId=Number(v('f-buyer'));
        const actionType=v('f-action-type');
        const salePrice=actionType==='sold'?(parseFloat(document.getElementById('f-add-price')?.value)||0):0;
        if(!unitId||!buyerId){toast('اختر الوحدة والمشتري','error');return;}
        if(actionType==='sold'&&(!salePrice||salePrice<=0)){toast('يجب تحديد سعر البيع للوحدة قبل إتمام عملية البيع','error');return;}
        const floorId=sel.options[sel.selectedIndex].getAttribute('data-floor');
        const targetUnitStatus=actionType==='sold'?3:2;
        const targetBookingStatus=actionType==='sold'?2:1;
        setBusy('submitBtn',true,'تأكيد العملية');
        try{
          // نداء واحد ذرّي: الباك-إند يتولّى الحالة + الربط + الـ booking + العدّادات
          await PUT(`/api/Units/${unitId}/reservation`,{ status: targetUnitStatus, buyerId, price: salePrice||null });
          toast(actionType==='sold'?'تم بيع الوحدة بنجاح':'تم حجز الوحدة بنجاح');
          closeModal();await loadAll();
        }catch(e){console.error('submitAddBooking:',e);toast(translateError(e.message)||'فشل العملية','error');}
        setBusy('submitBtn',false,'تأكيد العملية');
      };

      window.deleteBooking=function(bookingId,unitNum){
        openModal('إلغاء الحجز',`
          <div class="res-modal-body"><div class="res-confirm-box">
            <div class="res-confirm-icon">🗑️</div>
            <p class="res-confirm-msg">هل أنت متأكد من إلغاء الحجز للوحدة <strong>${unitNum}</strong>؟<br>هذا سيعيد الوحدة كـ "متاحة" للبيع.</p>
            <div class="res-confirm-actions">
              <button class="res-btn-danger" id="submitBtn" onclick="window.confirmDeleteBooking(${bookingId})"><i class="ri-delete-bin-line"></i> نعم، إلغاء الحجز</button>
              <button class="res-btn-secondary" onclick="window.closeModal()">تراجع</button>
            </div>
          </div></div>
        `);
      };

      window.confirmDeleteBooking=async function(bookingId){
        const btn=document.getElementById('submitBtn');
        if(btn){btn.disabled=true;btn.innerHTML='<i class="ri-loader-4-line"></i> جاري...';}
        try{await DELETE(`/api/Bookings/${bookingId}`);toast('تم الإلغاء وتحرير الوحدة بنجاح');closeModal();await loadAll();}
        catch(e){console.error('confirmDeleteBooking:',e);toast('فشل الإلغاء','error');}
        if(btn){btn.disabled=false;btn.innerHTML='<i class="ri-delete-bin-line"></i> نعم، إلغاء الحجز';}
      };

      window.exportCSV=function(){
        if(!S.filtered.length){toast('لا توجد بيانات للتصدير','error');return;}
        const headers=['المشروع','حالة المشروع','موعد التسليم','المبنى','الدور','رقم الوحدة','النوع','المساحة','السعر','الحالة','المشتري','تاريخ الحجز'];
        const rows=S.filtered.map(u=>[
          u.projectName||'',
          u.projectStatusAr||'—',
          fmtDate(u.projectExpectedDelivery),
          u.buildingName||'',
          u.floorNumber||'',
          u.unitNumber||'',
          typeLabel(u.type),
          u.area??'',
          u.price||0,
          UNIT_STATUS_AR[u.realStatus]||'',
          u.buyerName!=='—'?u.buyerName:'',
          fmtDate(u.booking?.bookingDate||u.booking?.createdAt)
        ]);
        const csv='\uFEFF'+[headers,...rows].map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
        const a=document.createElement('a');a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);a.download=`الحجوزات_${new Date().toISOString().split('T')[0]}.csv`;a.click();
        toast('تم تصدير الملف بنجاح');
      };

      /* ════ Custom Searchable Dropdown helpers ════ */
      function _buildCSD(id, options, placeholder, onChange){
        // options: [{value, label}]
        const optHtml=options.map(o=>`<div class="csd-option" data-value="${o.value}" data-label="${esc(o.label)}">${esc(o.label)}</div>`).join('')||`<div class="csd-empty">لا توجد نتائج</div>`;
        return `<div class="csd-wrap" id="${id}-wrap">
          <input type="text" class="csd-input" id="${id}-input" placeholder="${esc(placeholder)}" autocomplete="off"
            oninput="window._csdFilter('${id}')"
            onfocus="window._csdOpen('${id}')"
            onblur="setTimeout(()=>window._csdClose('${id}'),220)"
          >
          <input type="hidden" id="${id}" value="">
          <i class="ri-arrow-down-s-line csd-arrow"></i>
          <div class="csd-dropdown" id="${id}-dropdown">${optHtml}</div>
        </div>`;
      }
      window._buildCSD=_buildCSD;

      function _csdInitValue(id, value, label){
        const h=document.getElementById(id); const i=document.getElementById(id+'-input');
        if(h) h.value=value||'';
        if(i) i.value=label||'';
        if(value){
          const d=document.getElementById(id+'-dropdown');
          if(d) d.querySelectorAll('.csd-option').forEach(el=>el.classList.toggle('selected',el.dataset.value===String(value)));
        }
      }
      window._csdInitValue=_csdInitValue;

      window._csdOpen=function(id){
        const d=document.getElementById(id+'-dropdown');
        if(d){d.classList.add('open');d.querySelectorAll('.csd-option').forEach(el=>el.classList.remove('hidden'));}
      };
      window._csdClose=function(id){
        const d=document.getElementById(id+'-dropdown');if(d) d.classList.remove('open');
      };
      window._csdFilter=function(id){
        const q=(document.getElementById(id+'-input')?.value||'').toLowerCase().trim();
        const d=document.getElementById(id+'-dropdown');
        if(!d) return;
        d.classList.add('open');
        let any=false;
        d.querySelectorAll('.csd-option').forEach(el=>{
          const match=el.dataset.label.toLowerCase().includes(q);
          el.classList.toggle('hidden',!match);
          if(match) any=true;
        });
        let emp=d.querySelector('.csd-empty-dyn');
        if(!any){if(!emp){emp=document.createElement('div');emp.className='csd-empty csd-empty-dyn';emp.textContent='لا توجد نتائج';d.appendChild(emp);}}
        else{if(emp) emp.remove();}
        // clear hidden value if user typed something different
        document.getElementById(id).value='';
      };
      window._csdSelect=function(id, value, label){
        const h=document.getElementById(id);const i=document.getElementById(id+'-input');
        if(h) h.value=value;
        if(i) i.value=label;
        const d=document.getElementById(id+'-dropdown');
        if(d){d.classList.remove('open');d.querySelectorAll('.csd-option').forEach(el=>el.classList.toggle('selected',el.dataset.value===String(value)));}
      };

      /* ════ Bulk selection helpers ════ */
      function _resUpdateBar(){
        const bar=document.getElementById('res-fixed-bulk-bar');
        const cnt=document.getElementById('res-bulk-count');
        if(!bar) return;
        if(S.sel.size>0){
          bar.classList.add('show');
          if(cnt) cnt.textContent=`${S.sel.size} وحدة`;
        } else {
          bar.classList.remove('show');
        }
      }
      window._resToggleRow=function(id,event){
        // don't toggle when clicking action buttons
        if(event?.target?.closest('.res-row-actions')) return;
        id=Number(id);
        if(S.sel.has(id))S.sel.delete(id);else S.sel.add(id);
        const row=document.querySelector(`#res-page tbody tr[data-uid="${id}"]`);
        if(row){
          row.classList.toggle('sel-row',S.sel.has(id));
          const cb=row.querySelector('.res-row-checkbox');
          if(cb) cb.checked=S.sel.has(id);
        }
        _resUpdateBar();
        const start=(S.page-1)*PER_PAGE;
        const pageIds=S.filtered.slice(start,start+PER_PAGE).map(u=>u.id);
        const allChecked=pageIds.length>0&&pageIds.every(pid=>S.sel.has(pid));
        const hCb=document.getElementById('res-check-all');if(hCb)hCb.checked=allChecked;
      };
      window._resTogglePageAll=function(cb){
        const start=(S.page-1)*PER_PAGE;
        const pageIds=S.filtered.slice(start,start+PER_PAGE).map(u=>u.id);
        if(cb.checked)pageIds.forEach(id=>S.sel.add(id));
        else pageIds.forEach(id=>S.sel.delete(id));
        renderTable();_resUpdateBar();
      };
      window._resSelectAll=function(){
        S.filtered.forEach(u=>S.sel.add(u.id));
        renderTable();_resUpdateBar();
      };
      window._resClearSel=function(){
        S.sel.clear();
        renderTable();_resUpdateBar();
      };

      async function _doResBulkChange(newStatus){
        const label=({1:'متاح',2:'محجوز',4:'مقفول'})[newStatus]||'';
        const ids=[...S.sel];
        const bar=document.getElementById('res-fixed-bulk-bar');
        if(bar){bar.style.opacity='.5';bar.style.pointerEvents='none';}
        let done=0,failed=0;
        for(const id of ids){
          const u=S.units.find(x=>Number(x.id)===id);
          if(!u){failed++;continue;}
          const updatePayload={...u,status:newStatus};
          if(newStatus===1){updatePayload.buyerId=null;}
          try{await PUT(`/api/Units/${id}`,updatePayload);done++;}
          catch(e){console.error('bulk unit',id,e);failed++;}
        }
        if(bar){bar.style.opacity='';bar.style.pointerEvents='';}
        if(done>0) toast(`تم تغيير حالة ${done} وحدة إلى "${label}"${failed>0?` (${failed} فشلت)`:''}`);
        else toast('فشل تغيير الحالة','error');
        S.sel.clear();
        await loadAll();
      }

      window._resBulkChangeStatus=async function(newStatus){
        if(!S.sel.size){toast('اختر وحدات أولاً','error');return;}
        if(newStatus===3){toast('لا يمكن البيع الجماعي — يجب تحديد سعر وعميل لكل وحدة بشكل منفرد','error');return;}
        const ids=[...S.sel];
        const label=({1:'متاح',2:'محجوز',4:'مقفول'})[newStatus]||'';
        /* تحذير popups عند إعادة وحدات محجوزة/مباعة إلى حالة أخرى */
        const sensitiveUnits=ids.filter(id=>{const u=S.units.find(x=>Number(x.id)===id);return u&&(toStatus(u.status)===2||toStatus(u.status)===3);});
        if(sensitiveUnits.length>0){
          const soldCount=sensitiveUnits.filter(id=>{const u=S.units.find(x=>Number(x.id)===id);return u&&toStatus(u.status)===3;}).length;
          const resCount=sensitiveUnits.filter(id=>{const u=S.units.find(x=>Number(x.id)===id);return u&&toStatus(u.status)===2;}).length;
          const details=[];
          if(soldCount>0) details.push(`<strong style="color:var(--danger)">${soldCount} وحدة مباعة</strong>`);
          if(resCount>0)  details.push(`<strong style="color:var(--warning)">${resCount} وحدة محجوزة</strong>`);
          openModal('تأكيد التغيير الجماعي',`
            <div class="res-modal-body"><div class="res-confirm-box">
              <div class="res-confirm-icon" style="font-size:2.5rem">⚠️</div>
              <p class="res-confirm-msg">
                من الوحدات المحددة: ${details.join(' و ')} ستُعاد إلى <strong>"${label}"</strong>
                ${newStatus===1?'<br>وسيتم تحرير ارتباطها بالعميل ':''}
                <br><span style="font-size:0.8rem;opacity:0.7">تأكد أنك ألغيت الحجوزات المرتبطة أولاً</span>
              </p>
              <div class="res-confirm-actions">
                <button class="res-btn-primary" onclick="window._resConfirmBulkChange(${newStatus})"><i class="ri-checkbox-circle-line"></i> نعم، متابعة</button>
                <button class="res-btn-secondary" onclick="window.closeModal()">تراجع</button>
              </div>
            </div></div>
          `);
          return;
        }
        await _doResBulkChange(newStatus);
      };
      window._resConfirmBulkChange=async function(newStatus){
        closeModal();
        await _doResBulkChange(newStatus);
      };

      /* ════ Bulk price change ════ */
      window._resBulkChangePrice=async function(){
        if(!S.sel.size){ toast('اختر وحدات أولاً','error'); return; }
        const inp=document.getElementById('res-bulk-price-inp');
        const val=(inp?.value??'').trim();
        if(val===''){ inp.style.borderColor='rgba(255,59,48,.5)'; toast('أدخل السعر','error'); return; }
        const priceNum=Number(val);
        if(isNaN(priceNum)||priceNum<0){ inp.style.borderColor='rgba(255,59,48,.5)'; toast('سعر غير صالح','error'); return; }
        const ids=[...S.sel];
        const bar=document.getElementById('res-fixed-bulk-bar');
        if(bar){bar.style.opacity='.5';bar.style.pointerEvents='none';}
        let done=0,failed=0;
        for(const id of ids){
          const u=S.units.find(x=>Number(x.id)===id);
          if(!u){failed++;continue;}
          try{ await PUT(`/api/Units/${id}`,{...u,price:priceNum}); done++; }
          catch(e){ console.error('bulk price',id,e); failed++; }
        }
        if(bar){bar.style.opacity='';bar.style.pointerEvents='';}
        if(done>0) toast(`تم تحديث السعر لـ ${done} وحدة${failed>0?` (${failed} فشلت)`:''}`);
        else toast('فشل تحديث السعر','error');
        S.sel.clear();
        if(inp) inp.value='';
        await loadAll();
      };

      await loadAll();
    }
  };
})();