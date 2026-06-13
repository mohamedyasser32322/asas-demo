(function () {
  window.__pages = window.__pages || {};

  const _css = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --border:rgba(var(--fg-rgb), 0.08); --border-hover:rgba(var(--fg-rgb), 0.2);
      --light:#FFFFFF; --text-muted:#8fa3c0;
      --success:#34c759; --warning:#ffcc00; --danger:#ff3b30; --accent:#4e8df5;
      --tr:all 0.25s cubic-bezier(0.4,0,0.2,1);
    }
    @keyframes spin    { to { transform:rotate(360deg); } }
    @keyframes fadeUp  { from { opacity:0;transform:translateY(14px); } to { opacity:1;transform:translateY(0); } }
    @keyframes slideDown { from { opacity:0;transform:translateY(-12px) scale(.985); } to { opacity:1;transform:translateY(0) scale(1); } }
    @keyframes rowIn   { from { opacity:0;transform:translateX(14px); } to { opacity:1;transform:translateX(0); } }
    ::-webkit-scrollbar{width:5px;height:5px}
    ::-webkit-scrollbar-track{background:var(--primary-deep)}
    ::-webkit-scrollbar-thumb{background:rgba(var(--fg-rgb), 0.15);border-radius:6px}

    .by-bar {
      position:sticky; top:0; z-index:100;
      background:rgba(var(--bg-rgb),0.97); backdrop-filter:blur(16px);
      border-bottom:1px solid var(--border);
      padding:11px 24px;
      display:flex; align-items:center; gap:10px; flex-wrap:wrap;
      margin:-36px -36px 0;
    }
    @media(max-width:1024px){ .by-bar{ margin:-24px -16px 0; padding:10px 16px; } }
    .by-bar-title { font-size:1rem; font-weight:800; color:var(--light); display:flex; align-items:center; gap:7px; white-space:nowrap; }
    .by-bar-title i { color:var(--accent); }
    .by-search-wrap { position:relative; flex:1; min-width:160px; max-width:340px; }
    .by-search-wrap i.by-si { position:absolute; right:10px; top:50%; transform:translateY(-50%); color:var(--text-muted); font-size:.95rem; pointer-events:none; }
    .by-search {
      width:100%; padding:8px 34px 8px 32px;
      background:rgba(var(--fg-rgb), 0.06); border:1.5px solid var(--border);
      border-radius:9px; color:var(--light); font-family:inherit; font-size:.86rem;
      transition:var(--tr); direction:rtl;
    }
    .by-search:focus { outline:none; background:rgba(var(--fg-rgb), 0.1); border-color:var(--accent); box-shadow:0 0 0 3px rgba(var(--accent-rgb),.12); }
    .by-search::placeholder { color:var(--text-muted); }
    .by-s-clr { position:absolute; left:9px; top:50%; transform:translateY(-50%); background:none; border:none; color:var(--text-muted); font-size:.88rem; cursor:pointer; opacity:0; pointer-events:none; transition:opacity .18s,color .18s; padding:2px; line-height:1; }
    .by-s-clr.vis { opacity:.6; pointer-events:all; }
    .by-s-clr.vis:hover { opacity:1; color:var(--light); }
    .by-bar-spacer { flex:1; }
    .by-btn {
      display:flex; align-items:center; gap:6px; padding:8px 15px; border-radius:9px;
      font-family:inherit; font-size:.84rem; font-weight:700; cursor:pointer; transition:var(--tr); border:none; white-space:nowrap;
    }
    .by-btn-primary { background:var(--accent); color:#fff; }
    .by-btn-primary:hover { background:var(--accent-dark); transform:translateY(-1px); box-shadow:0 5px 16px rgba(var(--accent-rgb),.3); }
    .by-btn-ghost { background:rgba(var(--fg-rgb), .06); color:var(--light); border:1.5px solid var(--border); }
    .by-btn-ghost:hover { background:rgba(var(--fg-rgb), .11); border-color:var(--border-hover); }
    .by-btn-csv { background:rgba(52,199,89,.1); color:var(--success); border:1.5px solid rgba(52,199,89,.25); }
    .by-btn-csv:hover { background:rgba(52,199,89,.2); border-color:var(--success); }
    .filter-badge {
      display:inline-flex; align-items:center; justify-content:center;
      min-width:18px; height:18px; padding:0 5px;
      background:var(--accent); color:#fff; border-radius:9px; font-size:.68rem; font-weight:800;
    }

    .by-fp {
      background:rgba(var(--fg-rgb), .025); border:1px solid var(--border);
      border-radius:14px; padding:0; margin:0 0 10px;
      overflow:hidden; max-height:0; opacity:0;
      transition:max-height .34s cubic-bezier(0.4,0,0.2,1), opacity .22s ease, margin .24s ease;
    }
    .by-fp.fp-open { max-height:740px; opacity:1; margin:14px 0 10px; }
    .by-fp-body { padding:14px 16px 10px; display:flex; flex-direction:column; gap:10px; }
    .by-fr { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
    .by-flabel { font-size:.67rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:.5px; min-width:48px; flex-shrink:0; }
    .by-pills { display:flex; gap:4px; flex-wrap:wrap; }
    .by-pill {
      padding:4px 11px; border-radius:20px;
      border:1px solid var(--border); background:transparent;
      color:var(--text-muted); font-family:inherit; font-size:.76rem; font-weight:700;
      cursor:pointer; transition:var(--tr); user-select:none;
      display:inline-flex; align-items:center; gap:4px; white-space:nowrap;
    }
    .by-pill:hover { border-color:var(--border-hover); color:var(--light); }
    .by-pill.on      { background:rgba(var(--fg-rgb), .1);  border-color:rgba(var(--fg-rgb), .3);  color:var(--light); }
    .by-pill.on-g    { background:rgba(52,199,89,.12);   border-color:rgba(52,199,89,.5);    color:#34c759; }
    .by-pill.on-a    { background:rgba(255,204,0,.1);    border-color:rgba(255,204,0,.5);    color:#ffcc00; }
    .by-pill.on-r    { background:rgba(255,59,48,.1);    border-color:rgba(255,59,48,.5);    color:#ff3b30; }
    .by-pill.on-b    { background:rgba(var(--accent-rgb),.12);  border-color:rgba(var(--accent-rgb),.5);   color:var(--accent); }
    .by-pill.on-t    { background:rgba(45,212,191,.1);   border-color:rgba(45,212,191,.5);   color:#2dd4bf; }
    .by-pill.on-p    { background:rgba(175,82,222,.12);  border-color:rgba(175,82,222,.5);   color:#af52de; }
    .by-pill.on-c    { background:rgba(255,149,0,.1);    border-color:rgba(255,149,0,.5);    color:#ff9500; }
    .by-dot { width:6px; height:6px; border-radius:50%; flex-shrink:0; }
    .dg{background:#34c759} .da{background:#ffcc00} .dr{background:#ff3b30}
    .db{background:var(--accent)} .dt{background:#2dd4bf} .dp{background:#af52de} .dc{background:#ff9500}
    .by-fp-foot { display:flex; align-items:center; justify-content:flex-end; padding:8px 16px 12px; }
    .by-clear { font-size:.74rem; color:var(--accent); background:none; border:none; font-family:inherit; cursor:pointer; font-weight:700; }
    .by-clear:hover { text-decoration:underline; }

    .by-rbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
    .by-rcount { font-size:.8rem; color:var(--text-muted); }
    .by-rcount strong { color:var(--light); }
    .by-sort-wrap { display:flex; align-items:center; gap:6px; }
    .by-sort-lbl { font-size:.73rem; color:var(--text-muted); }
    .by-sort-sel {
      font-size:.77rem; color:var(--light); background:rgba(var(--fg-rgb), .07);
      border:1px solid var(--border); border-radius:8px; padding:5px 9px;
      font-family:inherit; cursor:pointer; color-scheme:dark;
    }
    .by-sort-sel option { background:var(--card-bg); }

    .by-list { display:flex; flex-direction:column; gap:6px; }
    .by-card {
      background:var(--card-bg); border:1px solid var(--border); border-radius:13px;
      padding:12px 14px; display:flex; align-items:center; gap:11px;
      transition:var(--tr); cursor:pointer; animation:rowIn .35s ease both;
    }
    .by-card:hover { border-color:var(--border-hover); background:var(--card-hover); transform:translateY(-1px); box-shadow:0 4px 16px rgba(0,0,0,.2); }
    .by-card.st-sold { border-right:3px solid rgba(255,59,48,.55); }
    .by-card.st-res  { border-right:3px solid rgba(255,204,0,.5); }
    .by-card.st-new  { border-right:3px solid rgba(var(--accent-rgb),.35); }
    .by-av { width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,var(--accent),var(--accent-dark)); display:flex; align-items:center; justify-content:center; font-size:.8rem; font-weight:800; color:#fff; flex-shrink:0; }
    .by-info { flex:1; min-width:0; }
    .by-name { font-size:.88rem; font-weight:700; color:var(--light); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .by-meta { font-size:.7rem; color:var(--text-muted); margin-top:2px; display:flex; align-items:center; gap:5px; flex-wrap:wrap; }
    .by-sep { color:rgba(var(--fg-rgb), .2); }
    .by-bgs { display:flex; gap:4px; align-items:center; flex-shrink:0; flex-wrap:wrap; justify-content:flex-end; }
    .by-bg { display:inline-flex; align-items:center; gap:3px; padding:3px 8px; border-radius:20px; font-size:.68rem; font-weight:700; }
    .bg-sold { background:rgba(255,59,48,.1);  color:#ff3b30; border:1px solid rgba(255,59,48,.2); }
    .bg-res  { background:rgba(255,204,0,.1);  color:#ffcc00; border:1px solid rgba(255,204,0,.2); }
    .bg-new  { background:rgba(var(--fg-rgb), .05);color:var(--text-muted); border:1px solid var(--border); }
    .bg-cash { background:rgba(52,199,89,.1);  color:#34c759; border:1px solid rgba(52,199,89,.2); }
    .bg-bank { background:rgba(255,204,0,.1);  color:#ffcc00; border:1px solid rgba(255,204,0,.2); }
    .bg-src  { background:rgba(175,82,222,.1); color:#af52de; border:1px solid rgba(175,82,222,.2); }
    .bg-doc  { background:rgba(45,212,191,.1); color:#2dd4bf; border:1px solid rgba(45,212,191,.2); }
    .by-acts { display:flex; gap:3px; flex-shrink:0; }
    .by-ib { width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center; border:1px solid var(--border); background:rgba(var(--fg-rgb), .03); color:var(--text-muted); cursor:pointer; font-size:.86rem; transition:var(--tr); }
    .by-ib.v:hover  { background:rgba(52,199,89,.15);  color:var(--success); border-color:var(--success); }
    .by-ib.e:hover  { background:rgba(var(--accent-rgb),.15); color:var(--accent);  border-color:var(--accent); }
    .by-ib.d:hover  { background:rgba(255,59,48,.15);  color:var(--danger);  border-color:var(--danger); }
    .by-ib.lk:hover { background:rgba(175,82,222,.15); color:#af52de; border-color:#af52de; }

    .by-loader { display:flex; align-items:center; justify-content:center; min-height:280px; }
    .spinner { width:40px; height:40px; border:3px solid rgba(var(--fg-rgb), .07); border-top-color:var(--accent); border-radius:50%; animation:spin .7s linear infinite; }
    .by-empty { text-align:center; padding:56px 20px; color:var(--text-muted); font-size:.9rem; }
    .by-empty i { font-size:2.2rem; display:block; margin-bottom:10px; opacity:.25; }

    .by-pag { display:flex; justify-content:center; gap:6px; margin-top:18px; flex-wrap:wrap; }
    .pg-btn { padding:6px 12px; border-radius:8px; background:rgba(var(--fg-rgb), .05); border:1px solid var(--border); color:var(--text-muted); font-family:inherit; font-size:.82rem; font-weight:600; cursor:pointer; transition:var(--tr); }
    .pg-btn:hover:not(:disabled) { background:rgba(var(--fg-rgb), .1); color:var(--light); }
    .pg-btn.on { background:var(--accent); color:#fff; border-color:var(--accent); }
    .pg-btn:disabled { opacity:.35; cursor:not-allowed; }

    #by-modal { display:none; position:fixed; inset:0; background:rgba(0,0,0,.78); z-index:1000; align-items:flex-start; justify-content:center; backdrop-filter:blur(8px); padding:24px 16px; overflow-y:auto; }
    .by-mb { background:var(--card-bg); border:1px solid rgba(var(--fg-rgb), .13); border-radius:18px; max-width:680px; width:100%; box-shadow:0 28px 70px rgba(0,0,0,.65); margin:auto; display:flex; flex-direction:column; animation:slideDown .3s cubic-bezier(0.16,1,0.3,1); max-height:calc(100vh - 48px); overflow:hidden; }
    .by-mh { padding:16px 22px 13px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; background:var(--card-bg); border-radius:18px 18px 0 0; flex-shrink:0; }
    .by-mt { font-size:1rem; font-weight:800; color:var(--light); display:flex; align-items:center; gap:7px; }
    .by-mt i { color:var(--accent); }
    .by-mx { background:none; border:none; color:var(--text-muted); font-size:1.25rem; cursor:pointer; transition:var(--tr); line-height:1; }
    .by-mx:hover { color:var(--light); transform:rotate(90deg); }
    .by-mbody { padding:18px 22px 24px; flex:1; overflow-y:auto; }
    .by-mf { padding:13px 22px; border-top:1px solid var(--border); display:flex; gap:8px; justify-content:flex-end; flex-wrap:wrap; background:rgba(0,0,0,.22); border-radius:0 0 18px 18px; flex-shrink:0; }

    .by-sec { margin-bottom:14px; }
    .by-sec-t { font-size:.68rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:.5px; margin-bottom:10px; padding-bottom:7px; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:6px; }
    .by-sec-t i { color:var(--accent); font-size:.88rem; }
    .fg { margin-bottom:11px; }
    .fl { display:block; font-size:.82rem; font-weight:700; margin-bottom:5px; color:var(--light); }
    .fl .opt { font-weight:400; color:var(--text-muted); font-size:.72rem; margin-right:3px; }
    .fi, .fsel {
      width:100%; padding:9px 12px; border-radius:9px;
      background:rgba(var(--fg-rgb), .05); border:1.5px solid rgba(var(--fg-rgb), .1);
      color:var(--light); font-family:inherit; font-size:.87rem; transition:var(--tr);
    }
    .fi::placeholder { color:var(--text-muted); }
    .fi:focus, .fsel:focus { outline:none; background:rgba(var(--fg-rgb), .09); border-color:var(--accent); box-shadow:0 0 0 3px rgba(var(--accent-rgb),.12); }
    .fsel { appearance:none; cursor:pointer; color-scheme:dark; color:var(--light); background-image:url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238fa3c0' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e"); background-repeat:no-repeat; background-position:left 10px center; background-size:15px; padding-left:32px; }
    .fsel option { background:var(--card-bg); color:var(--light); }
    .fsel:disabled { opacity:.4; cursor:not-allowed; }
    .fr  { display:grid; grid-template-columns:1fr 1fr; gap:11px; }
    .fr3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:11px; }
    @media(max-width:520px){ .fr,.fr3{ grid-template-columns:1fr; } }
    .btn-primary { display:flex; align-items:center; gap:5px; padding:9px 20px; border-radius:9px; background:var(--accent); color:#fff; border:none; font-family:inherit; font-size:.87rem; font-weight:700; cursor:pointer; transition:var(--tr); }
    .btn-primary:hover:not(:disabled) { background:var(--accent-dark); transform:translateY(-1px); }
    .btn-primary:disabled { opacity:.55; cursor:not-allowed; }
    .btn-ghost { padding:9px 18px; border-radius:9px; background:rgba(var(--fg-rgb), .06); color:var(--light); border:1px solid rgba(var(--fg-rgb), .12); font-family:inherit; font-size:.87rem; font-weight:600; cursor:pointer; transition:var(--tr); }
    .btn-ghost:hover { background:rgba(var(--fg-rgb), .1); }
    .btn-danger { display:flex; align-items:center; gap:5px; padding:9px 18px; border-radius:9px; background:var(--danger); color:var(--light); border:none; font-family:inherit; font-size:.87rem; font-weight:700; cursor:pointer; transition:var(--tr); }
    .btn-danger:hover { background:#e62c21; }
    .btn-warn { display:flex; align-items:center; gap:5px; padding:9px 18px; border-radius:9px; background:rgba(255,204,0,.12); color:var(--warning); border:1px solid rgba(255,204,0,.3); font-family:inherit; font-size:.87rem; font-weight:700; cursor:pointer; transition:var(--tr); }
    .btn-warn:hover { background:rgba(255,204,0,.22); }
    .ferr { font-size:.73rem; color:var(--danger); margin-top:4px; display:none; align-items:center; gap:3px; }
    .ferr.show { display:flex; }

    .bh { display:flex; align-items:center; gap:12px; padding:14px; background:rgba(var(--accent-rgb),.07); border-radius:12px; border:1px solid rgba(var(--accent-rgb),.18); margin-bottom:14px; }
    .bh-av { width:48px; height:48px; border-radius:50%; background:linear-gradient(135deg,var(--accent),var(--accent-dark)); display:flex; align-items:center; justify-content:center; font-size:1.1rem; font-weight:800; color:#fff; flex-shrink:0; }
    .bh-name { font-size:.98rem; font-weight:800; color:var(--light); }
    .bh-sub  { font-size:.74rem; color:var(--text-muted); margin-top:2px; }
    .dg-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:13px; }
    .db-block { background:rgba(var(--fg-rgb), .04); padding:10px 12px; border-radius:9px; border:1px solid var(--border); }
    .db-block.full { grid-column:1/-1; }
    .db-label { font-size:.67rem; color:var(--text-muted); margin-bottom:3px; text-transform:uppercase; letter-spacing:.3px; }
    .db-val   { font-size:.9rem; font-weight:700; color:var(--light); }
    @media(max-width:520px){ .dg-grid{ grid-template-columns:1fr; } }
    .uc { background:rgba(var(--bg-rgb),.5); border:1px solid rgba(var(--accent-rgb),.15); border-radius:11px; padding:12px; margin-bottom:8px; }
    .uc-h { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; padding-bottom:8px; border-bottom:1px dashed rgba(var(--fg-rgb), .07); }
    .uc-g { display:grid; grid-template-columns:1fr 1fr; gap:6px; }
    .uc-c { background:rgba(var(--fg-rgb), .05); border:1px solid var(--border); padding:7px 10px; border-radius:8px; }
    .uc-l { font-size:.66rem; color:var(--text-muted); margin-bottom:2px; }
    .uc-v { font-size:.85rem; font-weight:700; color:var(--light); }
    .sec-title { font-size:.68rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:.5px; margin-bottom:8px; display:flex; align-items:center; gap:6px; }

    .lu-step { background:rgba(var(--fg-rgb), .02); border:1px solid var(--border); border-radius:11px; padding:14px; margin-bottom:10px; }
    .lu-step-t { font-size:.73rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:.4px; margin-bottom:10px; }
    .lu-action-row { display:flex; gap:7px; }
    .lu-ab { flex:1; padding:9px 12px; border-radius:9px; border:1.5px solid var(--border); background:rgba(var(--fg-rgb), .03); color:var(--text-muted); font-family:inherit; font-size:.83rem; font-weight:700; cursor:pointer; transition:var(--tr); display:flex; align-items:center; justify-content:center; gap:5px; }
    .lu-ab.sel-res  { background:rgba(255,204,0,.1);  border-color:var(--warning); color:var(--warning); }
    .lu-ab.sel-sale { background:rgba(255,59,48,.1);  border-color:var(--danger);  color:var(--danger);  }
    .unit-tbadge { font-size:.66rem; font-weight:700; padding:2px 7px; border-radius:7px; }
    .unit-tbadge.apt  { background:rgba(var(--accent-rgb),.12); color:var(--accent); border:1px solid rgba(var(--accent-rgb),.25); }
    .unit-tbadge.roof { background:rgba(175,82,222,.12); color:#af52de; border:1px solid rgba(175,82,222,.25); }
    .lu-preview { margin-top:8px; background:rgba(var(--accent-rgb),.05); border:1px solid rgba(var(--accent-rgb),.15); border-radius:9px; padding:11px 13px; display:none; }

    .cfm { text-align:center; padding:6px 0; }
    .cfm-icon { font-size:2.6rem; margin-bottom:12px; }
    .cfm-msg { font-size:.88rem; color:var(--text-muted); line-height:1.7; margin-bottom:18px; }

    .rp-wrap { background:rgba(255,204,0,.04); border:1px solid rgba(255,204,0,.15); border-radius:11px; padding:14px; }
    .rp-note { font-size:.78rem; color:var(--text-muted); margin-bottom:11px; display:flex; align-items:center; gap:6px; }
    .rp-note i { color:var(--warning); }

    /* DOC UPLOAD */
    .doc-upload-zone { display:none; }
    .doc-upload-btn {
      display:inline-flex; align-items:center; gap:8px;
      padding:9px 18px; border-radius:10px; cursor:pointer;
      font-family:inherit; font-size:.85rem; font-weight:700;
      border:1.5px solid rgba(45,212,191,.4);
      background:rgba(45,212,191,.08); color:#2dd4bf;
      transition:var(--tr); margin-bottom:10px; width:100%; justify-content:center;
    }
    .doc-upload-btn:hover { background:rgba(45,212,191,.18); border-color:rgba(45,212,191,.7); }
    .doc-upload-btn i { font-size:1.05rem; }
    .doc-upload-btn input[type=file] { display:none; }
    .doc-item {
      display:flex; align-items:center; gap:9px; padding:9px 12px;
      background:rgba(45,212,191,.04); border:1px solid rgba(45,212,191,.12);
      border-radius:9px; margin-bottom:6px;
    }
    .doc-item i.icon { color:#2dd4bf; flex-shrink:0; font-size:1rem; }
    .doc-item-info { flex:1; min-width:0; }
    .doc-item-name { font-size:.82rem; font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:var(--light); }
    .doc-item-date { font-size:.68rem; color:var(--text-muted); margin-top:1px; }
    .doc-item-acts { display:flex; gap:5px; flex-shrink:0; }
    .doc-btn-view { font-size:.73rem; color:var(--accent); text-decoration:none; padding:3px 9px; border-radius:7px; border:1px solid rgba(var(--accent-rgb),.25); background:rgba(var(--accent-rgb),.07); transition:var(--tr); }
    .doc-btn-view:hover { background:rgba(var(--accent-rgb),.15); }
    .doc-btn-del { width:26px; height:26px; border-radius:7px; display:flex; align-items:center; justify-content:center; border:1px solid rgba(255,59,48,.2); background:rgba(255,59,48,.05); color:rgba(255,59,48,.5); cursor:pointer; font-size:.8rem; transition:var(--tr); }
    .doc-btn-del:hover { background:rgba(255,59,48,.15); color:var(--danger); border-color:var(--danger); }
    .doc-uploading { display:flex; align-items:center; gap:8px; padding:9px 12px; background:rgba(var(--accent-rgb),.05); border:1px solid rgba(var(--accent-rgb),.15); border-radius:9px; font-size:.8rem; color:var(--text-muted); margin-bottom:6px; }

    /* LINK-AFTER-CREATE PROMPT */
    .lac-wrap { text-align:center; padding:8px 0 4px; }
    .lac-icon { font-size:2.4rem; margin-bottom:10px; }
    .lac-title { font-size:.98rem; font-weight:800; color:var(--light); margin-bottom:6px; }
    .lac-sub { font-size:.82rem; color:var(--text-muted); margin-bottom:20px; }
    .lac-btns { display:flex; gap:10px; justify-content:center; flex-wrap:wrap; }

    #by-toast { position:fixed; bottom:20px; left:20px; z-index:9999; display:flex; flex-direction:column; gap:7px; pointer-events:none; }
    .t-item { display:flex; align-items:center; gap:9px; padding:10px 15px; border-radius:10px; background:rgba(8,18,38,.97); border:1px solid var(--border); color:#fff; font-size:.84rem; font-weight:600; animation:slideDown .22s ease; box-shadow:0 7px 22px rgba(0,0,0,.3); pointer-events:all; max-width:280px; }
    .t-item.ok  { border-color:rgba(52,199,89,.4); }
    .t-item.err { border-color:rgba(255,59,48,.4); }
    .t-item i { font-size:1.05rem; flex-shrink:0; }
    .t-item.ok  i { color:var(--success); }
    .t-item.err i { color:var(--danger); }

    @media(max-width:768px){ .by-bgs{ display:none; } }
    @media(max-width:500px){ .by-bar-spacer{ display:none; } .by-bar{ flex-wrap:wrap; } }
  `;

  window.__pages['buyers'] = {
    getCSS: () => _css,
    init: async function () {
      const root = document.getElementById('app-main');
      root.innerHTML = `
        <div id="by-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:1000;align-items:flex-start;justify-content:center;backdrop-filter:blur(6px);padding:24px 16px;overflow-y:auto">
          <div class="by-mb">
            <div class="by-mh">
              <div class="by-mt" id="bmt"></div>
              <button class="by-mx" onclick="window._byClose()"><i class="ri-close-line"></i></button>
            </div>
            <div id="bmbody" class="by-mbody"></div>
            <div id="bmfoot" class="by-mf" style="display:none"></div>
          </div>
        </div>
        <div id="by-toast"></div>

        <div class="by-bar">
          <div class="by-bar-title"><i class="ri-group-line"></i>المشترين</div>
          <div class="by-search-wrap">
            <i class="ri-search-line by-si"></i>
            <input type="text" id="by-s" class="by-search" placeholder="بحث بالاسم أو الجوال..." oninput="window._bySearch()">
            <button class="by-s-clr" id="by-s-clr" onclick="window._bySrchClr()" type="button"><i class="ri-close-circle-fill"></i></button>
          </div>
          <div class="by-bar-spacer"></div>
          <button class="by-btn by-btn-ghost" id="by-filter-btn" onclick="window._byToggleFilter()">
            <i class="ri-filter-3-line"></i>فلترة<span id="by-fbadge" style="display:none" class="filter-badge">0</span>
          </button>
          <button class="by-btn by-btn-csv" onclick="window._byCSV()"><i class="ri-file-excel-2-line"></i>CSV</button>
          <button class="by-btn by-btn-primary" onclick="window._byOpenAdd()"><i class="ri-add-line"></i>إضافة مشتري</button>
        </div>

        <div style="padding-top:14px">
          <div class="by-fp" id="by-fp">
            <div class="by-fp-body">
              <div class="by-fr">
                <span class="by-flabel">الحالة</span>
                <div class="by-pills">
                  <span class="by-pill on" data-g="st" data-v="all"      onclick="window._bySt(this)">الكل</span>
                  <span class="by-pill"    data-g="st" data-v="sold"     onclick="window._bySt(this)"><span class="by-dot dr"></span>مباع</span>
                  <span class="by-pill"    data-g="st" data-v="reserved" onclick="window._bySt(this)"><span class="by-dot da"></span>محجوز</span>
                  <span class="by-pill"    data-g="st" data-v="new"      onclick="window._bySt(this)"><span class="by-dot db"></span>جديد</span>
                </div>
              </div>
              <div class="by-fr">
                <span class="by-flabel">السداد</span>
                <div class="by-pills">
                  <span class="by-pill on" data-g="pay" data-v="all"  onclick="window._byAllPill(this,'pay')" >الكل</span>
                  <span class="by-pill"    data-g="pay" data-v="Cash" onclick="window._byToggle(this,'g')"><span class="by-dot dg"></span>كاش</span>
                  <span class="by-pill"    data-g="pay" data-v="Bank" onclick="window._byToggle(this,'a')"><span class="by-dot da"></span>بنك</span>
                </div>
              </div>
              <div class="by-fr">
                <span class="by-flabel">المصدر</span>
                <div class="by-pills">
                  <span class="by-pill on" data-g="src" data-v="all"               onclick="window._byAllPill(this,'src')">الكل</span>
                  <span class="by-pill"    data-g="src" data-v="Snapchat"           onclick="window._byToggle(this,'p')">سناب</span>
                  <span class="by-pill"    data-g="src" data-v="Instagram"          onclick="window._byToggle(this,'p')">انستجرام</span>
                  <span class="by-pill"    data-g="src" data-v="TikTok"             onclick="window._byToggle(this,'p')">تيكتوك</span>
                  <span class="by-pill"    data-g="src" data-v="ExternalAgent"      onclick="window._byToggle(this,'b')">مندوب خارجي</span>
                  <span class="by-pill"    data-g="src" data-v="IndividualBroker"   onclick="window._byToggle(this,'b')">وسيط فرد</span>
                  <span class="by-pill"    data-g="src" data-v="BuildingGuard"      onclick="window._byToggle(this,'b')">حارس عمارة</span>
                  <span class="by-pill"    data-g="src" data-v="ProjectOwner"       onclick="window._byToggle(this,'b')">مالك مشروع</span>
                  <span class="by-pill"    data-g="src" data-v="RealEstateCompany"  onclick="window._byToggle(this,'b')">شركة عقارية</span>
                  <span class="by-pill"    data-g="src" data-v="BuyoutApp"          onclick="window._byToggle(this,'t')">بيوت</span>
                  <span class="by-pill"    data-g="src" data-v="HarajApp"           onclick="window._byToggle(this,'t')">حراج</span>
                  <span class="by-pill"    data-g="src" data-v="AqarApp"            onclick="window._byToggle(this,'t')">عقار</span>
                  <span class="by-pill"    data-g="src" data-v="Website"            onclick="window._byToggle(this,'t')">موقع</span>
                  <span class="by-pill"    data-g="src" data-v="PersonalRelations"  onclick="window._byToggle(this,'c')">علاقات شخصية</span>
                  <span class="by-pill"    data-g="src" data-v="ProjectBoard"       onclick="window._byToggle(this,'c')">لوحة</span>
                  <span class="by-pill"    data-g="src" data-v="PreviousClient"     onclick="window._byToggle(this,'a')">مشتري سابق</span>
                </div>
              </div>
              <div class="by-fr">
                <span class="by-flabel">الوثائق</span>
                <div class="by-pills">
                  <span class="by-pill on" data-g="doc" data-v="all"  onclick="window._byAllPill(this,'doc')" >الكل</span>
                  <span class="by-pill"    data-g="doc" data-v="has"  onclick="window._byToggle(this,'t')"><span class="by-dot dt"></span>لديه</span>
                  <span class="by-pill"    data-g="doc" data-v="none" onclick="window._byToggle(this,'r')"><span class="by-dot dr"></span>بدون</span>
                </div>
              </div>
              <div class="by-fr">
                <span class="by-flabel">التاريخ</span>
                <div class="by-pills">
                  <span class="by-pill on" data-g="dt" data-v="all"   onclick="window._byDt(this)">الكل</span>
                  <span class="by-pill"    data-g="dt" data-v="week"  onclick="window._byDt(this)">أسبوع</span>
                  <span class="by-pill"    data-g="dt" data-v="month" onclick="window._byDt(this)">شهر</span>
                  <span class="by-pill"    data-g="dt" data-v="q"     onclick="window._byDt(this)">3 شهور</span>
                  <span class="by-pill"    data-g="dt" data-v="year"  onclick="window._byDt(this)">سنة</span>
                </div>
              </div>
            </div>
            <div class="by-fp-foot">
              <button class="by-clear" onclick="window._byClear()">مسح الفلاتر</button>
            </div>
          </div>

          <div class="by-rbar">
            <span class="by-rcount" id="by-cnt"></span>
            <div class="by-sort-wrap">
              <span class="by-sort-lbl">ترتيب:</span>
              <select class="by-sort-sel" id="by-sort" onchange="window._bySearch()">
                <option value="newest">الأحدث</option>
                <option value="name">الاسم</option>
                <option value="status">الحالة</option>
              </select>
            </div>
          </div>

          <div id="by-wrap"><div class="by-loader"><div class="spinner"></div></div></div>
          <div class="by-pag" id="by-pag"></div>
        </div>
      `;

      const modal = document.getElementById('by-modal');
      modal.addEventListener('click', e => { if (e.target === modal) _byClose(); }, { signal: window.__pageAbortSignal });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') _byClose(); }, { signal: window.__pageAbortSignal });

      const BASE = window.location.origin;
      const PER  = 15;

      const S = {
        page:1, data:[], filtered:[],
        units:[], bookings:[], projects:[], buildings:[], floors:[], docs:[],
        st:'all', pay:new Set(), src:new Set(), doc:new Set(), dt:'all',
        fpOpen: false
      };

      function tok() {
        let t = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!t) { try { const a = JSON.parse(localStorage.getItem('authData') || '{}'); t = a.token || a.authToken; } catch {} }
        return t || '';
      }
      async function api(method, path, body) {
        const t = tok();
        if (!t) {
          window.__showToast?.('يرجى تسجيل الدخول أولاً','error');
          setTimeout(()=>{ window.location.replace('/login'); }, 1500);
          return null;
        }
        const opts = { method, headers: { 'Content-Type':'application/json', 'Authorization':`Bearer ${t}` } };
        if (body !== undefined) opts.body = JSON.stringify(body);
        try {
          const r = await fetch(BASE + path, opts);
          if (!r.ok) {
            if (r.status === 401) {
              window.__showToast?.('انتهت صلاحية جلستك، جارٍ تسجيل الخروج...','warning',2500);
              setTimeout(()=>{ ['authData','token','authToken','rememberMe','savedEmail'].forEach(k=>localStorage.removeItem(k)); window.location.replace('/login'); }, 2000);
              return null;
            }
            if (r.status === 403) { window.__showToast?.('ليس لديك صلاحية لهذا الإجراء','error'); return null; }
            let msg = `خطأ ${r.status}`;
            try { const e = await r.json(); msg = e.message || e.title || msg; } catch {}
            throw new Error(msg);
          }
          if (r.status === 204) return null;
          return r.json().catch(() => null);
        } catch(err) {
          if(err.name==='AbortError') return null;
          if(err.message && !err.message.includes('fetch')) throw err;
          window.__showToast?.('تعذر الاتصال بالخادم','error');
          throw err;
        }
      }
      async function uploadFile(path, formData) {
        const t = tok();
        if (!t) { toast('يرجى تسجيل الدخول أولاً', 'err'); return null; }
        const r = await fetch(BASE + path, { method:'POST', headers:{ 'Authorization':`Bearer ${t}` }, body: formData });
        if (!r.ok) {
          let msg = `خطأ ${r.status}`;
          try { const e = await r.json(); msg = e.message || e.title || msg; } catch {}
          throw new Error(msg);
        }
        return r.json().catch(() => null);
      }
      const GET = p => api('GET', p);
      const POST = (p,b) => api('POST', p, b);
      const PUT  = (p,b) => api('PUT',  p, b);
      const DEL  = p => api('DELETE', p);
      const arr  = v => Array.isArray(v) ? v : (v?.data || v?.items || v?.value || []);

      function toast(msg, type = 'ok') {
        const el = document.createElement('div'); el.className = `t-item ${type}`;
        el.innerHTML = `<i class="ri-${type === 'ok' ? 'checkbox-circle' : 'error-warning'}-line"></i><span>${msg}</span>`;
        document.getElementById('by-toast').appendChild(el);
        setTimeout(() => { el.style.opacity='0'; el.style.transition='.3s'; setTimeout(() => el.remove(), 310); }, 3000);
      }

      function openModal(title, body, foot = '') {
        document.getElementById('bmt').innerHTML = title;
        document.getElementById('bmbody').innerHTML = body;
        const f = document.getElementById('bmfoot');
        if (foot) { f.innerHTML = foot; f.style.display = 'flex'; } else f.style.display = 'none';
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        setTimeout(() => { if (modal) modal.scrollTop = 0; }, 40);
      }
      function _byClose() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        document.getElementById('bmbody').innerHTML = '';
        document.getElementById('bmfoot').innerHTML = '';
        document.getElementById('bmfoot').style.display = 'none';
      }
      window._byClose = _byClose;

      const gv  = id => { const e = document.getElementById(id); return e ? e.value.trim() : ''; };
      const gvn = id => { const v = gv(id); return v === '' ? null : v; };
      const esc = s => String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      const fmtD = d => { if(!d)return'—'; try{const dt=new Date(d);const day=String(dt.getDate()).padStart(2,'0');const month=String(dt.getMonth()+1).padStart(2,'0');return`${day}/${month}/${dt.getFullYear()}`;}catch{return'—';} };
      const ini  = n => { if (!n) return '؟'; const p = n.trim().split(' '); return ((p[0]||'').charAt(0)+(p[1]||'').charAt(0)).toUpperCase()||'؟'; };
      function setBusy(id, busy, lbl='حفظ') { const e = document.getElementById(id); if (!e) return; e.disabled=busy; e.innerHTML=busy?'<i class="ri-loader-4-line" style="animation:spin .8s linear infinite;display:inline-block"></i> جاري...':`<i class="ri-save-line"></i> ${lbl}`; }
      function showErr(id, msg) { const e = document.getElementById(id); if (!e) return; e.classList.add('show'); const s = e.querySelector('span'); if (s) s.textContent = msg; }
      function clrErrs() { document.querySelectorAll('.ferr').forEach(e => e.classList.remove('show')); }
      function toSt(v) { if (v===null||v===undefined) return 4; if (typeof v==='number') return v; const m={available:1,reserved:2,sold:3,closed:4,Available:1,Reserved:2,Sold:3,Closed:4}; return m[v]??4; }
      const isRoof = t => t===2||t===3||String(t||'').toLowerCase()==='roof';
      function xErr(msg) {
        return (window.__translateError && window.__translateError(msg)) || msg || 'حدث خطأ غير متوقع';
      }

      const SRC_L = { BuildingGuard:'حارس عمارة', ProjectOwner:'مالك مشروع', PreviousClient:'مشتري سابق', RealEstateCompany:'شركة عقارية', ExternalAgent:'مندوب خارجي', IndividualBroker:'وسيط فرد', ProjectBoard:'لوحة مشروع', PersonalRelations:'علاقات شخصية', BuyoutApp:'تطبيق بيوت', HarajApp:'تطبيق حراج', AqarApp:'تطبيق عقار', Website:'موقع إلكتروني', Snapchat:'سناب شات', Instagram:'انستجرام', TikTok:'تيكتوك' };
      const PM_L  = { Cash:'كاش', Bank:'بنك' };
      const MS_L  = { Single:'أعزب', Married:'متزوج' };
      const srcL = s => SRC_L[s]||s||'—';
      const pmL  = s => PM_L[s]||s||'—';
      const msL  = s => MS_L[s]||s||'—';

      function buyerUnits(id) { return S.units.filter(u => Number(u.buyerId)===Number(id) && !u.isDeleted && toSt(u.status)!==1 && toSt(u.status)!==4); }
      function buyerSt(id) { const u = buyerUnits(id); if (!u.length) return 'new'; if (u.some(x => toSt(x.status)===3)) return 'sold'; return 'reserved'; }
      function buyerDocs(id) { return (S.docs||[]).filter(d => Number(d.buyerId)===Number(id) && !d.isDeleted); }
      function hasDoc(id) { return buyerDocs(id).length > 0; }
      function unitLoc(u) {
        const fl = S.floors.find(f => f.id===u.floorId);
        const bl = S.buildings.find(b => b.id===fl?.buildingId);
        const pr = S.projects.find(p => p.id===bl?.projectId);
        return [pr?.name||'', bl?.name||'', fl?.floorNumber ? `دور ${fl.floorNumber}` : ''].filter(Boolean).join(' · ');
      }

      window._byToggleFilter = function () {
        S.fpOpen = !S.fpOpen;
        document.getElementById('by-fp').classList.toggle('fp-open', S.fpOpen);
        document.getElementById('by-filter-btn').classList.toggle('by-btn-ghost', !S.fpOpen);
      };

      function updBadge() {
        const n = [S.st!=='all'?1:0, S.pay.size, S.src.size, S.doc.size, S.dt!=='all'?1:0].reduce((a,b)=>a+b,0);
        const badge = document.getElementById('by-fbadge');
        if (!badge) return;
        badge.style.display = n > 0 ? 'inline-flex' : 'none';
        badge.textContent = n;
      }

      window._bySt = function (el) {
        document.querySelectorAll('[data-g="st"]').forEach(p => p.className = 'by-pill');
        el.classList.add('on'); S.st = el.dataset.v; S.page=1; applyF(); updBadge();
      };
      window._byAllPill = function (el, g) {
        document.querySelectorAll(`[data-g="${g}"]`).forEach(p => p.className = 'by-pill');
        el.classList.add('on'); S[g] = new Set(); S.page=1; applyF(); updBadge();
      };
      window._byToggle = function (el, color) {
        const g = el.dataset.g, v = el.dataset.v;
        const set = S[g];
        if (set.has(v)) { set.delete(v); el.className = 'by-pill'; }
        else { set.add(v); el.className = `by-pill on-${color}`; }
        const allPill = document.querySelector(`[data-g="${g}"][data-v="all"]`);
        if (allPill) allPill.className = set.size === 0 ? 'by-pill on' : 'by-pill';
        S.page=1; applyF(); updBadge();
      };
      window._byDt = function (el) {
        document.querySelectorAll('[data-g="dt"]').forEach(p => p.className = 'by-pill');
        el.classList.add('on'); S.dt = el.dataset.v; S.page=1; applyF(); updBadge();
      };
      window._byClear = function () {
        document.querySelectorAll('[data-g="st"]').forEach(p => p.className='by-pill');
        document.querySelector('[data-g="st"][data-v="all"]').className = 'by-pill on';
        ['pay','src','doc'].forEach(g => { S[g]=new Set(); document.querySelectorAll(`[data-g="${g}"]`).forEach(p=>p.className='by-pill'); document.querySelector(`[data-g="${g}"][data-v="all"]`).className='by-pill on'; });
        document.querySelectorAll('[data-g="dt"]').forEach(p=>p.className='by-pill');
        document.querySelector('[data-g="dt"][data-v="all"]').className='by-pill on';
        S.st='all'; S.dt='all'; document.getElementById('by-s').value='';
        document.getElementById('by-s-clr')?.classList.remove('vis');
        S.page=1; applyF(); updBadge();
      };

      const now = new Date();
      function inRange(d, r) {
        if (r==='all') return true;
        const diff = (now - new Date(d)) / 86400000;
        if (r==='week') return diff<=7;
        if (r==='month') return diff<=30;
        if (r==='q') return diff<=90;
        if (r==='year') return diff<=365;
        return true;
      }
      function applyF() {
        const q = (document.getElementById('by-s')?.value||'').toLowerCase().trim();
        const sort = document.getElementById('by-sort')?.value||'newest';
        let list = S.data.filter(b => {
          if (q && !(b.fullName||'').toLowerCase().includes(q) && !(b.phoneNumber||'').includes(q) && !(b.nationalId||'').includes(q) && !(b.employer||'').toLowerCase().includes(q)) return false;
          if (S.st!=='all' && buyerSt(b.id)!==S.st) return false;
          if (S.pay.size>0 && (!b.paymentMethod || !S.pay.has(b.paymentMethod))) return false;
          if (S.src.size>0 && !S.src.has(b.clientSource)) return false;
          if (S.doc.size>0) {
            const hd = hasDoc(b.id);
            if (S.doc.has('has') && S.doc.has('none')) {}
            else if (S.doc.has('has') && !hd) return false;
            else if (S.doc.has('none') && hd) return false;
          }
          if (!inRange(b.createdAt, S.dt)) return false;
          return true;
        });
        if (sort==='name') list.sort((a,b)=>(a.fullName||'').localeCompare(b.fullName||'','ar'));
        else if (sort==='status') { const o={sold:0,reserved:1,new:2}; list.sort((a,b)=>(o[buyerSt(a.id)]??3)-(o[buyerSt(b.id)]??3)); }
        else list.sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0));
        S.filtered = list;
        const cnt = document.getElementById('by-cnt');
        if (cnt) cnt.innerHTML = `<strong>${list.length}</strong> مشتري`;
        renderList();
      }
      let _st = null;
      function _bySearch() {
        clearTimeout(_st); _st = setTimeout(applyF, 160);
        const q = document.getElementById('by-s')?.value || '';
        document.getElementById('by-s-clr')?.classList.toggle('vis', q.length > 0);
      }
      window._bySearch = _bySearch;
      window._bySrchClr = function() {
        const inp = document.getElementById('by-s');
        if (inp) { inp.value = ''; inp.focus(); }
        document.getElementById('by-s-clr')?.classList.remove('vis');
        applyF();
      };

      function renderList() {
        const wrap = document.getElementById('by-wrap');
        const pag  = document.getElementById('by-pag');
        if (!wrap) return;
        if (!S.filtered.length) {
          wrap.innerHTML = '<div class="by-empty"><i class="ri-search-line"></i>لا توجد نتائج مطابقة</div>';
          if (pag) pag.innerHTML = ''; return;
        }
        const page = S.filtered.slice((S.page-1)*PER, S.page*PER);
        const stBg = { sold:['bg-sold','مباع'], reserved:['bg-res','محجوز'], new:['bg-new','جديد'] };
        const stCls = { sold:'st-sold', reserved:'st-res', new:'st-new' };
        wrap.innerHTML = `<div class="by-list">${page.map((b,i) => {
          const st = buyerSt(b.id);
          const [sc, sl] = stBg[st]||['bg-new','—'];
          const hd = hasDoc(b.id);
          return `<div class="by-card ${stCls[st]||''}" style="animation-delay:${i*30}ms">
            <div class="by-av">${ini(b.fullName)}</div>
            <div class="by-info">
              <div class="by-name">${esc(b.fullName||'—')}</div>
              <div class="by-meta">
                <span style="direction:ltr;display:inline-block"><i class="ri-phone-line" style="opacity:.5;font-size:.8rem"></i> ${esc(b.phoneNumber||'—')}</span>
                ${b.nationalId?`<span class="by-sep">·</span><span style="font-family:monospace;font-size:.78rem;opacity:.75">${esc(b.nationalId)}</span>`:''}
              </div>
            </div>
            <div class="by-acts">
              <div class="by-ib lk" onclick="event.stopPropagation();window._byLink(${b.id},'${esc(b.fullName)}')" title="ربط وحدة"><i class="ri-link"></i></div>
              <div class="by-ib v"  onclick="event.stopPropagation();window._byView(${b.id})" title="عرض"><i class="ri-eye-line"></i></div>
              <div class="by-ib e"  onclick="event.stopPropagation();window._byEdit(${b.id})" title="تعديل"><i class="ri-edit-line"></i></div>
              ${window.__canDelete?.()?`<div class="by-ib d"  onclick="event.stopPropagation();window._byDel(${b.id},'${esc(b.fullName)}')" title="حذف"><i class="ri-delete-bin-line"></i></div>`:''}
            </div>
          </div>`;
        }).join('')}</div>`;

        if (!pag) return;
        const pages = Math.ceil(S.filtered.length / PER);
        if (pages<=1) { pag.innerHTML=''; return; }
        let h = `<button class="pg-btn" onclick="window._byPage(${S.page-1})" ${S.page===1?'disabled':''}>السابق</button>`;
        const start = Math.max(1, S.page-2), end = Math.min(pages, start+4);
        if (start>1) h += `<button class="pg-btn" onclick="window._byPage(1)">1</button>${start>2?'<span style="color:var(--text-muted);padding:0 4px">...</span>':''}`;
        for (let i=start; i<=end; i++) h += `<button class="pg-btn ${S.page===i?'on':''}" onclick="window._byPage(${i})">${i}</button>`;
        if (end<pages) h += `${end<pages-1?'<span style="color:var(--text-muted);padding:0 4px">...</span>':''}<button class="pg-btn" onclick="window._byPage(${pages})">${pages}</button>`;
        h += `<button class="pg-btn" onclick="window._byPage(${S.page+1})" ${S.page===pages?'disabled':''}>التالي</button>`;
        pag.innerHTML = h;
      }
      // ── حفظ واستعادة حالة الفلاتر ──
      function _saveBuyersState() {
        window.__savePageState?.('buyers', {
          st: S.st, dt: S.dt, page: S.page,
          pay: [...S.pay], src: [...S.src], doc: [...S.doc],
          search: document.getElementById('by-s')?.value || '',
        });
      }
      function _restoreBuyersState() {
        const sv = window.__loadPageState?.('buyers');
        if (!sv) return;
        S.st   = sv.st   || 'all';
        S.dt   = sv.dt   || 'all';
        S.page = sv.page || 1;
        S.pay  = new Set(sv.pay  || []);
        S.src  = new Set(sv.src  || []);
        S.doc  = new Set(sv.doc  || []);
        const si = document.getElementById('by-s');
        if (si && sv.search) si.value = sv.search;
        // تطبيق الحالة على الـ pills (مرئياً) بعد render
        setTimeout(() => {
          ['st','dt'].forEach(g => {
            const val = S[g];
            document.querySelectorAll(`[data-g="${g}"]`).forEach(p => {
              p.className = p.dataset.v === val ? 'by-pill on' : 'by-pill';
            });
          });
          ['pay','src','doc'].forEach(g => {
            document.querySelectorAll(`[data-g="${g}"]`).forEach(p => {
              if (p.dataset.v === 'all') {
                p.className = S[g].size === 0 ? 'by-pill on' : 'by-pill';
              } else {
                p.className = S[g].has(p.dataset.v) ? `by-pill on-blue` : 'by-pill';
              }
            });
          });
        }, 50);
      }

      // ربط الحفظ بكل دوال الفلترة الموجودة
      const _origBySt = window._bySt;
      window._bySt = function(el) { _origBySt(el); _saveBuyersState(); };
      const _origByToggle = window._byToggle;
      window._byToggle = function(el, color) { _origByToggle(el, color); _saveBuyersState(); };
      const _origByDt = window._byDt;
      window._byDt = function(el) { _origByDt(el); _saveBuyersState(); };
      const _origByClear = window._byClear;
      window._byClear = function() { _origByClear(); window.__clearPageState?.('buyers'); };

      window._byPage = p => { S.page=p; renderList(); _saveBuyersState(); window.scrollTo({top:0,behavior:'smooth'}); };

      async function loadAll() {
        const wrap = document.getElementById('by-wrap');
        if (wrap) wrap.innerHTML = '<div class="by-loader"><div class="spinner"></div></div>';
        try {
          const [bd,ud,bkd,pd,bld,fd,docd] = await Promise.all([
            GET('/api/Buyers'),
            GET('/api/Units').catch(()=>[]),
            GET('/api/Bookings').catch(()=>[]),
            GET('/api/Projects').catch(()=>[]),
            GET('/api/Buildings').catch(()=>[]),
            GET('/api/Floors').catch(()=>[]),
            GET('/api/BuyerDocuments').catch(()=>[]),
          ]);
          S.data      = arr(bd).sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0));
          S.units     = arr(ud);
          S.bookings  = arr(bkd);
          S.projects  = arr(pd);
          S.buildings = arr(bld);
          S.floors    = arr(fd);
          S.docs      = arr(docd);
          S.filtered  = [...S.data];
          const cnt = document.getElementById('by-cnt');
          if (cnt) cnt.innerHTML = `<strong>${S.data.length}</strong> مشتري`;
          _restoreBuyersState();
          applyF();
        } catch(e) {
          console.error(e); toast('فشل تحميل البيانات', 'err');
          const wrap = document.getElementById('by-wrap');
          if (wrap) wrap.innerHTML = '<div class="by-empty"><i class="ri-wifi-off-line"></i>فشل الاتصال بالخادم</div>';
        }
      }

      function srcOpts(sel='') { return Object.entries(SRC_L).map(([k,l])=>`<option value="${k}" ${sel===k?'selected':''}>${l}</option>`).join(''); }
      window._byFamily = function(p) { const ms=document.getElementById(`${p}-ms`)?.value; const fg=document.getElementById(`fg-fam-${p}`); if(fg) fg.style.display=ms==='Married'?'block':'none'; };

      function buyerForm(prefix, b={}) {
        const isEdit = !!b.id;
        return `
          <div class="by-sec">
            <div class="by-sec-t"><i class="ri-user-line"></i>البيانات الأساسية</div>
            <div class="fg"><label class="fl">الاسم الرباعي *</label>
              <input id="${prefix}-fn" class="fi" placeholder="مثال: محمد أحمد العتيبي" value="${esc(b.fullName||'')}">
              <div class="ferr" id="err-${prefix}-fn"><i class="ri-error-warning-line"></i><span></span></div>
            </div>
            <div class="fr">
              <div class="fg"><label class="fl">رقم الجوال *</label>
                <input id="${prefix}-ph" class="fi" placeholder="05XXXXXXXX" style="direction:ltr;text-align:right" value="${esc(b.phoneNumber||'')}">
                <div class="ferr" id="err-${prefix}-ph"><i class="ri-error-warning-line"></i><span></span></div>
              </div>
              <div class="fg"><label class="fl">رقم الهوية *</label>
                <input id="${prefix}-ni" class="fi" placeholder="1XXXXXXXXX" style="direction:ltr;text-align:right" value="${esc(b.nationalId||'')}">
                <div class="ferr" id="err-${prefix}-ni"><i class="ri-error-warning-line"></i><span></span></div>
              </div>
            </div>
            ${!isEdit?`<div class="fg"><label class="fl">كلمة المرور *</label>
              <input id="${prefix}-pw" class="fi" type="password" placeholder="6 أحرف أو أكثر">
              <div class="ferr" id="err-${prefix}-pw"><i class="ri-error-warning-line"></i><span></span></div>
            </div>`:''}
          </div>
          <div class="by-sec">
            <div class="by-sec-t"><i class="ri-map-pin-2-line"></i>المصدر وطريقة السداد</div>
            <div class="fr">
              <div class="fg"><label class="fl">مصدر المشتري <span class="opt">(اختياري)</span></label>
                <select id="${prefix}-src" class="fsel"><option value="">— اختر —</option>${srcOpts(b.clientSource||'')}</select>
              </div>
              <div class="fg"><label class="fl">طريقة السداد <span class="opt">(اختياري)</span></label>
                <select id="${prefix}-pm" class="fsel">
                  <option value="">— اختر —</option>
                  <option value="Cash" ${b.paymentMethod==='Cash'?'selected':''}>كاش</option>
                  <option value="Bank" ${b.paymentMethod==='Bank'?'selected':''}>بنك</option>
                </select>
              </div>
            </div>
          </div>
          <div class="by-sec">
            <div class="by-sec-t"><i class="ri-briefcase-line"></i>البيانات الوظيفية</div>
            <div class="fr">
              <div class="fg"><label class="fl">جهة العمل <span class="opt">(اختياري)</span></label>
                <input id="${prefix}-emp" class="fi" placeholder="مثال: وزارة الصحة" value="${esc(b.employer||'')}">
              </div>
              <div class="fg"><label class="fl">المسمى الوظيفي <span class="opt">(اختياري)</span></label>
                <input id="${prefix}-jt" class="fi" placeholder="مثال: مهندس ميداني" value="${esc(b.jobTitle||'')}">
              </div>
            </div>
            <div class="fg"><label class="fl">الراتب (${window.CUR()}) <span class="opt">(اختياري)</span></label>
              <input id="${prefix}-sal" class="fi" type="number" min="0" placeholder="مثال: 8000" value="${b.salary!=null?b.salary:''}">
            </div>
          </div>
          <div class="by-sec" style="margin-bottom:0">
            <div class="by-sec-t"><i class="ri-heart-line"></i>الحالة الاجتماعية</div>
            <div class="fr">
              <div class="fg"><label class="fl">الحالة <span class="opt">(اختياري)</span></label>
                <select id="${prefix}-ms" class="fsel" onchange="window._byFamily('${prefix}')">
                  <option value="">— اختر —</option>
                  <option value="Single"  ${b.maritalStatus==='Single'? 'selected':''}>أعزب</option>
                  <option value="Married" ${b.maritalStatus==='Married'?'selected':''}>متزوج</option>
                </select>
              </div>
              <div class="fg" id="fg-fam-${prefix}" ${b.maritalStatus==='Married'?'':'style="display:none"'}>
                <label class="fl">أفراد الأسرة</label>
                <input id="${prefix}-fam" class="fi" type="number" min="1" max="20" placeholder="مثال: 4" value="${b.familyMembersCount!=null?b.familyMembersCount:''}">
              </div>
            </div>
          </div>
          ${isEdit ? `<div class="by-sec" style="margin-top:14px;margin-bottom:0">${docSection(b.id)}</div>` : ''}`;
      }

      function formFoot(prefix, b={}) {
        const isEdit = !!b.id;
        return `<button class="btn-primary" id="${prefix}-sb" onclick="window.${isEdit?`_bySubmitEdit(${b.id},'${prefix}')`:`_bySubmitAdd('${prefix}')`}"><i class="ri-save-line"></i> ${isEdit?'حفظ التعديلات':'إضافة المشتري'}</button><button class="btn-ghost" onclick="window._byClose()">إلغاء</button>`;
      }

      window._byOpenAdd = function () { openModal('<i class="ri-user-add-line"></i> إضافة مشتري', buyerForm('add'), formFoot('add')); };

      window._bySubmitAdd = async function(prefix) {
        clrErrs();
        const fn=gv(`${prefix}-fn`), ph=gv(`${prefix}-ph`), ni=gvn(`${prefix}-ni`), pw=gvn(`${prefix}-pw`);
        let ok=true;
        if (!fn) { showErr(`err-${prefix}-fn`,'الاسم مطلوب'); ok=false; }
        else if (fn.trim().split(/\s+/).filter(Boolean).length < 4) { showErr(`err-${prefix}-fn`,'الاسم يجب أن يكون رباعياً (4 أجزاء)'); ok=false; }
        else if (S.data.find(b=>b.fullName&&b.fullName.trim().toLowerCase()===fn.trim().toLowerCase())) { showErr(`err-${prefix}-fn`,'هذا الاسم مسجل مسبقاً'); ok=false; }
        if (!ph) { showErr(`err-${prefix}-ph`,'رقم الجوال مطلوب'); ok=false; }
        else if (!/^05\d{8}$/.test(ph)) { showErr(`err-${prefix}-ph`,'صيغة غير صحيحة — مثال: 0512345678'); ok=false; }
        else if (S.data.find(b=>b.phoneNumber===ph)) { showErr(`err-${prefix}-ph`,'رقم الجوال مسجل مسبقاً'); ok=false; }
        if (!ni) { showErr(`err-${prefix}-ni`,'رقم الهوية مطلوب'); ok=false; }
        else if (!/^[12]\d{9}$/.test(ni)) { showErr(`err-${prefix}-ni`,'هوية غير صحيحة — 10 أرقام تبدأ بـ 1 أو 2'); ok=false; }
        else if (S.data.find(b=>b.nationalId&&b.nationalId===ni)) { showErr(`err-${prefix}-ni`,'رقم الهوية مسجل مسبقاً'); ok=false; }
        if (!pw) { showErr(`err-${prefix}-pw`,'كلمة المرور مطلوبة'); ok=false; }
        else if (pw.length<6) { showErr(`err-${prefix}-pw`,'كلمة المرور 6 أحرف على الأقل'); ok=false; }
        if (!ok) return;
        setBusy(`${prefix}-sb`,true);
        try {
          const payload = { fullName:fn, phoneNumber:ph, nationalId:ni, password:pw, clientSource:gvn(`${prefix}-src`)||null, paymentMethod:gvn(`${prefix}-pm`)||null, employer:gvn(`${prefix}-emp`)||null, jobTitle:gvn(`${prefix}-jt`)||null, salary:gvn(`${prefix}-sal`)?Number(gv(`${prefix}-sal`)):null, maritalStatus:gvn(`${prefix}-ms`)||null, familyMembersCount:gvn(`${prefix}-fam`)?Number(gv(`${prefix}-fam`)):null };
          const newBuyer = await POST('/api/Buyers', payload);
          await loadAll();
          toast('تم إضافة المشتري بنجاح');
          _showLinkPrompt(newBuyer?.id || null, fn);
        } catch(e) {
          const m=(e.message||'').toLowerCase();
          if (m.includes('phone')||m.includes('هاتف')) showErr(`err-${prefix}-ph`,'رقم الجوال مسجل مسبقاً');
          else if (m.includes('national')||m.includes('nationalid')) showErr(`err-${prefix}-ni`,'رقم الهوية مسجل مسبقاً');
          else toast(`فشل الإضافة: ${xErr(e.message)}`,'err');
          setBusy(`${prefix}-sb`,false,'إضافة المشتري');
        }
      };

      function _showLinkPrompt(buyerId, buyerName) {
        openModal(
          '<i class="ri-checkbox-circle-line" style="color:var(--success)"></i> تم إنشاء المشتري',
          `<div class="lac-wrap">
            <div class="lac-icon">✅</div>
            <div class="lac-title">تم إنشاء <strong>${esc(buyerName)}</strong> بنجاح</div>
            <div class="lac-sub">ماذا تريد أن تفعل الآن؟</div>
            <div class="lac-btns">
              <button class="btn-primary" onclick="window._byClose();${buyerId?`window._byLink(${buyerId},'${esc(buyerName)}')`:'window._byClose()'}"><i class="ri-link"></i>ربط وحدة</button>
              ${buyerId?`<button class="btn-ghost" style="background:rgba(45,212,191,.1);color:#2dd4bf;border-color:rgba(45,212,191,.25)" onclick="window._byClose();window._byEdit(${buyerId})"><i class="ri-file-add-line"></i>رفع وثيقة</button>`:''}
              <button class="btn-ghost" onclick="window._byClose()">تخطي</button>
            </div>
          </div>`
        );
      }

      window._byEdit = async function(id) {
        try { const b = await GET(`/api/Buyers/${id}`); openModal('<i class="ri-edit-line"></i> تعديل المشتري', buyerForm('ed',b), formFoot('ed',b)); }
        catch { toast('فشل تحميل بيانات المشتري','err'); }
      };
      window._bySubmitEdit = async function(id, prefix) {
        clrErrs();
        const fn=gv(`${prefix}-fn`), ph=gv(`${prefix}-ph`), ni=gvn(`${prefix}-ni`), pw=gvn(`${prefix}-pw`);
        let ok=true;
        if (!fn) { showErr(`err-${prefix}-fn`,'الاسم مطلوب'); ok=false; }
        else if (fn.trim().split(/\s+/).filter(Boolean).length < 4) { showErr(`err-${prefix}-fn`,'الاسم يجب أن يكون رباعياً (4 أجزاء)'); ok=false; }
        else if (S.data.find(b=>b.id!==id&&b.fullName&&b.fullName.trim().toLowerCase()===fn.trim().toLowerCase())) { showErr(`err-${prefix}-fn`,'هذا الاسم مسجل مسبقاً'); ok=false; }
        if (!ph) { showErr(`err-${prefix}-ph`,'رقم الجوال مطلوب'); ok=false; }
        else if (!/^05\d{8}$/.test(ph)) { showErr(`err-${prefix}-ph`,'صيغة غير صحيحة — مثال: 0512345678'); ok=false; }
        else if (S.data.find(b=>b.id!==id&&b.phoneNumber===ph)) { showErr(`err-${prefix}-ph`,'رقم الجوال مسجل مسبقاً'); ok=false; }
        if (!ni) { showErr(`err-${prefix}-ni`,'رقم الهوية مطلوب'); ok=false; }
        else if (!/^[12]\d{9}$/.test(ni)) { showErr(`err-${prefix}-ni`,'هوية غير صحيحة — 10 أرقام تبدأ بـ 1 أو 2'); ok=false; }
        else if (S.data.find(b=>b.id!==id&&b.nationalId&&b.nationalId===ni)) { showErr(`err-${prefix}-ni`,'رقم الهوية مسجل مسبقاً'); ok=false; }
        if (!ok) return;
        setBusy(`${prefix}-sb`,true,'حفظ التعديلات');
        try {
          const payload = { fullName:fn, phoneNumber:ph, nationalId:ni, clientSource:gvn(`${prefix}-src`)||null, paymentMethod:gvn(`${prefix}-pm`)||null, employer:gvn(`${prefix}-emp`)||null, jobTitle:gvn(`${prefix}-jt`)||null, salary:gvn(`${prefix}-sal`)?Number(gv(`${prefix}-sal`)):null, maritalStatus:gvn(`${prefix}-ms`)||null, familyMembersCount:gvn(`${prefix}-fam`)?Number(gv(`${prefix}-fam`)):null };
          await PUT(`/api/Buyers/${id}`, payload);
          toast('تم تعديل بيانات المشتري'); _byClose(); await loadAll();
        } catch(e) {
          const m=(e.message||'').toLowerCase();
          if (m.includes('phone')||m.includes('هاتف')) showErr(`err-${prefix}-ph`,'رقم الجوال مسجل مسبقاً');
          else if (m.includes('national')||m.includes('nationalid')) showErr(`err-${prefix}-ni`,'رقم الهوية مسجل مسبقاً');
          else toast(`فشل التعديل: ${xErr(e.message)}`,'err');
          setBusy(`${prefix}-sb`,false,'حفظ التعديلات');
        }
      };

      /* DOCUMENT UPLOAD */
      window._byTriggerUpload = function(buyerId) {
        const inp = document.getElementById(`doc-file-${buyerId}`);
        if (inp) inp.click();
      };
      window._byUploadDoc = async function(buyerId, input) {
        const file = input.files[0];
        if (!file) return;
        const MAX = 10 * 1024 * 1024;
        if (file.size > MAX) { toast('حجم الملف يتجاوز 10MB','err'); input.value=''; return; }
        const zone = document.getElementById(`doc-zone-${buyerId}`);
        const list = document.getElementById(`doc-list-${buyerId}`);
        if (list) {
          const loading = document.createElement('div');
          loading.className = 'doc-uploading';
          loading.innerHTML = `<i class="ri-loader-4-line" style="animation:spin .8s linear infinite;display:inline-block;flex-shrink:0"></i><span>جاري رفع: ${esc(file.name)}</span>`;
          list.prepend(loading);
        }
        if (zone) zone.style.opacity = '0.4';
        try {
          const fd = new FormData();
          fd.append('file', file);
          const doc = await uploadFile(`/api/BuyerDocuments/${buyerId}`, fd);
          S.docs.push({...doc, isDeleted:false});
          await _byRefreshDocList(buyerId);
          toast('تم رفع الوثيقة بنجاح');
        } catch(e) {
          toast(`فشل الرفع: ${xErr(e.message)}`,'err');
          await _byRefreshDocList(buyerId);
        }
        input.value = '';
        if (zone) zone.style.opacity = '';
      };
      window._byDeleteDoc = async function(docId, buyerId) {
        if (!confirm('هل تريد حذف هذه الوثيقة؟')) return;
        try {
          await DEL(`/api/BuyerDocuments/${docId}`);
          S.docs = S.docs.filter(d => d.id !== docId);
          await _byRefreshDocList(buyerId);
          toast('تم حذف الوثيقة');
        } catch(e) { toast(`فشل الحذف: ${xErr(e.message)}`,'err'); }
      };

      // فتح وثيقة عبر المسار المحمي — fetch بالـ token ثم blob (الوصول الثابت محظور)
      window._byViewDoc = async function(url) {
        if (!url) return;
        const absUrl = url.startsWith('http') ? url : (BASE + url);
        try {
          toast('جاري فتح الملف...');
          const r = await fetch(absUrl, { headers: { 'Authorization': `Bearer ${tok()}` } });
          if (!r.ok) throw new Error(r.status);
          const burl = URL.createObjectURL(await r.blob());
          const t = window.open(burl, '_blank');
          if (!t) window.location.href = burl;
          setTimeout(() => URL.revokeObjectURL(burl), 60000);
        } catch(e) { toast('فشل فتح الملف','err'); }
      };

      async function _byRefreshDocList(buyerId) {
        try {
          const fresh = arr(await GET(`/api/BuyerDocuments/buyer/${buyerId}`));
          S.docs = S.docs.filter(d => Number(d.buyerId) !== Number(buyerId));
          S.docs.push(...fresh);
        } catch {}
        const list = document.getElementById(`doc-list-${buyerId}`);
        if (list) list.innerHTML = buildDocList(buyerId);
      }

      function buildDocList(buyerId) {
        const docs = buyerDocs(buyerId);
        if (!docs.length) return `<div style="text-align:center;padding:12px;color:var(--text-muted);background:rgba(var(--fg-rgb), .02);border-radius:9px;border:1px dashed rgba(var(--fg-rgb), .07);font-size:.8rem">لا توجد وثائق مرفوعة</div>`;
        return docs.map(d => `
          <div class="doc-item">
            <i class="ri-file-check-line icon"></i>
            <div class="doc-item-info">
              <div class="doc-item-name">${esc(d.fileName||'وثيقة')}</div>
              <div class="doc-item-date">${fmtD(d.createdAt)}</div>
            </div>
            <div class="doc-item-acts">
              <a href="javascript:void(0)" onclick="window._byViewDoc('${esc(d.fileUrl||'')}')" class="doc-btn-view"><i class="ri-eye-line"></i> عرض</a>
              ${window.__canDelete?.()?`<div class="doc-btn-del" onclick="window._byDeleteDoc(${d.id},${buyerId})" title="حذف"><i class="ri-delete-bin-line"></i></div>`:''}
            </div>
          </div>`).join('');
      }

      function docSection(buyerId) {
        const docs = buyerDocs(buyerId);
        return `
          <div style="margin-bottom:13px">
            <div class="sec-title">
              <i class="ri-file-list-line" style="color:#2dd4bf"></i>
              العنوان الوظيفي
              ${docs.length?`<span style="font-size:.68rem;background:rgba(45,212,191,.1);color:#2dd4bf;padding:2px 8px;border-radius:20px;border:1px solid rgba(45,212,191,.2)">${docs.length} وثيقة</span>`:''}
            </div>
            <label class="doc-upload-btn">
              <input type="file" id="doc-file-${buyerId}" accept=".pdf,.jpg,.jpeg,.png" onchange="window._byUploadDoc(${buyerId},this)">
              <i class="ri-upload-cloud-2-line" id="doc-zone-${buyerId}"></i>
              رفع العنوان الوظيفي
            </label>
            <div id="doc-list-${buyerId}">${buildDocList(buyerId)}</div>
          </div>`;
      }

      /* LINK UNIT */
      window._byLink = function(buyerId, buyerName) {
        const projs = S.projects.filter(p=>!p.isDeleted);
        if (!projs.length) { toast('لا توجد مشاريع متاحة','err'); return; }
        const projOpts = '<option value="">— اختر المشروع —</option>' + projs.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('');
        openModal(
          `<i class="ri-link"></i> ربط وحدة — ${esc(buyerName)}`,
          `<div class="lu-step">
            <div class="lu-step-t">نوع العملية</div>
            <div class="lu-action-row">
              <button type="button" class="lu-ab sel-res" id="lu-res" onclick="window._byLuAction('reserved')"><i class="ri-calendar-check-line"></i> حجز</button>
              <button type="button" class="lu-ab" id="lu-sale" onclick="window._byLuAction('sold')"><i class="ri-trophy-line"></i> بيع نهائي</button>
            </div>
            <input type="hidden" id="lu-act" value="reserved">
          </div>
          <div class="lu-step">
            <div class="lu-step-t">اختر الوحدة</div>
            <div class="fg"><label class="fl">المشروع *</label>
              <select class="fsel" id="lu-proj" onchange="window._byLuProj()">${projOpts}</select>
            </div>
            <div class="fr">
              <div class="fg"><label class="fl">المبنى *</label>
                <select class="fsel" id="lu-bld" onchange="window._byLuBld()" disabled><option value="">— اختر المشروع —</option></select>
              </div>
              <div class="fg"><label class="fl">الطابق *</label>
                <select class="fsel" id="lu-fl" onchange="window._byLuFl()" disabled><option value="">— اختر المبنى —</option></select>
              </div>
            </div>
            <div class="fg"><label class="fl">الوحدة المتاحة *</label>
              <select class="fsel" id="lu-unit" disabled><option value="">— اختر الطابق —</option></select>
            </div>
            <div class="lu-preview" id="lu-prev"></div>
          </div>`,
          `<button class="btn-primary" id="lu-sb" onclick="window._byLuConfirm(${buyerId})"><i class="ri-link"></i> تأكيد</button><button class="btn-ghost" onclick="window._byClose()">إلغاء</button>`
        );
      };
      window._byLuAction = function(a) {
        document.getElementById('lu-act').value = a;
        document.getElementById('lu-res').className  = 'lu-ab'+(a==='reserved'?' sel-res':'');
        document.getElementById('lu-sale').className = 'lu-ab'+(a==='sold'?' sel-sale':'');
      };
      window._byLuProj = function() {
        const pid = document.getElementById('lu-proj').value;
        const bs=document.getElementById('lu-bld'), fs=document.getElementById('lu-fl'), us=document.getElementById('lu-unit');
        fs.innerHTML='<option value="">—</option>'; fs.disabled=true;
        us.innerHTML='<option value="">—</option>'; us.disabled=true;
        document.getElementById('lu-prev').style.display='none';
        if (!pid) { bs.innerHTML='<option value="">— اختر المشروع —</option>'; bs.disabled=true; return; }
        const blds = S.buildings.filter(b=>!b.isDeleted&&String(b.projectId)===pid);
        bs.innerHTML = '<option value="">— اختر المبنى —</option>'+blds.map(b=>`<option value="${b.id}">${esc(b.name)}</option>`).join('');
        bs.disabled = !blds.length;
      };
      window._byLuBld = function() {
        const bid = document.getElementById('lu-bld').value;
        const fs=document.getElementById('lu-fl'), us=document.getElementById('lu-unit');
        us.innerHTML='<option value="">—</option>'; us.disabled=true;
        document.getElementById('lu-prev').style.display='none';
        if (!bid) { fs.innerHTML='<option value="">—</option>'; fs.disabled=true; return; }
        const floors = S.floors.filter(f=>!f.isDeleted&&String(f.buildingId)===bid).sort((a,b)=>Number(a.floorNumber)-Number(b.floorNumber));
        fs.innerHTML = '<option value="">— اختر الطابق —</option>'+floors.map(f=>`<option value="${f.id}">دور ${f.floorNumber}</option>`).join('');
        fs.disabled = !floors.length;
      };
      window._byLuFl = function() {
        const fid = document.getElementById('lu-fl').value;
        const us = document.getElementById('lu-unit');
        document.getElementById('lu-prev').style.display='none';
        if (!fid) { us.innerHTML='<option value="">—</option>'; us.disabled=true; return; }
        const avail = S.units.filter(u=>!u.isDeleted&&String(u.floorId)===fid&&toSt(u.status)===1).sort((a,b)=>String(a.unitNumber).localeCompare(String(b.unitNumber),undefined,{numeric:true}));
        if (!avail.length) { us.innerHTML='<option value="">— لا توجد وحدات متاحة —</option>'; us.disabled=true; return; }
        us.innerHTML = '<option value="">— اختر الوحدة —</option>'+avail.map(u=>`<option value="${u.id}">وحدة ${u.unitNumber} · ${isRoof(u.type)?'روف':'شقة'}${u.area?' · '+u.area+' م²':''}</option>`).join('');
        us.disabled=false;
        us.onchange = function() {
          const uid=us.value; const prev=document.getElementById('lu-prev');
          if (!uid) { prev.style.display='none'; return; }
          const u=S.units.find(x=>String(x.id)===uid); if (!u) return;
          const t=isRoof(u.type)?'روف':'شقة'; const loc=unitLoc(u);
          prev.style.display='block';
          prev.innerHTML=`<div style="display:flex;align-items:center;gap:10px">
            <div style="width:36px;height:36px;border-radius:8px;background:rgba(var(--accent-rgb),.1);border:1px solid rgba(var(--accent-rgb),.2);display:flex;align-items:center;justify-content:center;font-size:.76rem;font-weight:800;color:var(--accent);flex-shrink:0">${u.unitNumber}</div>
            <div style="flex:1">
              <div style="font-weight:800;font-size:.86rem;color:var(--light)">وحدة ${esc(String(u.unitNumber))} <span class="unit-tbadge ${isRoof(u.type)?'roof':'apt'}">${t}</span></div>
              <div style="font-size:.72rem;color:var(--text-muted);margin-top:2px">${esc(loc||'—')}</div>
            </div>
            <div style="font-weight:700;color:var(--success);font-size:.83rem;flex-shrink:0">${u.price?window.fmtMoney(u.price):'—'}</div>
          </div>`;
        };
      };
      window._byLuConfirm = async function(buyerId) {
        const unitId = document.getElementById('lu-unit')?.value;
        const action = document.getElementById('lu-act')?.value;
        if (!unitId) { toast('اختر الوحدة أولاً','err'); return; }
        setBusy('lu-sb',true,'تأكيد');
        try {
          // الباك إند يدير حالة الوحدة والعدّادات تلقائياً عبر الحجز —
          // لا نغيّر حالة الوحدة يدوياً وإلا فشل التحقق "وحدة غير متاحة".
          const tBk = action==='sold'?2:1; // مبيع → Confirmed، حجز → Pending
          const exBk = S.bookings.find(bk=>Number(bk.unitId)===Number(unitId)&&!bk.isDeleted&&bk.status!==3&&bk.status!=='Cancelled');
          if (exBk) await DEL(`/api/Bookings/${exBk.id}`);
          await POST('/api/Bookings', {unitId:Number(unitId), buyerId:Number(buyerId), amountPaid:0, remainingAmount:0, status:tBk});
          toast(action==='sold'?'تم تسجيل البيع':'تم تسجيل الحجز');
          _byClose(); await loadAll();
        } catch(e) { toast(`فشل العملية: ${xErr(e.message)}`,'err'); setBusy('lu-sb',false,'تأكيد'); }
      };

      /* VIEW */
      window._byView = async function(id) {
        try {
          const b = await GET(`/api/Buyers/${id}`);
          const bUnits = buyerUnits(id);
          const unitsHtml = bUnits.length ? bUnits.map(u=>{
            const sn=toSt(u.status); const sAr=sn===3?'مباع':'محجوز'; const sCol=sn===3?'var(--danger)':'var(--warning)';
            const loc=unitLoc(u); const t=isRoof(u.type)?'روف':'شقة';
            return `<div class="uc">
              <div class="uc-h">
                <div>
                  <div style="font-size:.9rem;font-weight:800;display:flex;align-items:center;gap:7px">
                    <i class="ri-home-office-line" style="color:var(--accent)"></i>
                    وحدة ${esc(String(u.unitNumber||'—'))}
                    <span class="unit-tbadge ${isRoof(u.type)?'roof':'apt'}">${t}</span>
                  </div>
                  <div style="font-size:.7rem;color:var(--text-muted);margin-top:3px">${esc(loc||'—')}</div>
                </div>
                <span style="font-size:.69rem;font-weight:700;padding:3px 10px;border-radius:20px;border:1px solid ${sCol}40;color:${sCol}">${sAr}</span>
              </div>
              <div class="uc-g">
                <div class="uc-c"><div class="uc-l">السعر</div><div class="uc-v">${u.price?window.fmtMoney(u.price):'—'}</div></div>
                <div class="uc-c"><div class="uc-l">المساحة</div><div class="uc-v">${u.area?u.area+' م²':'—'}</div></div>
              </div>
            </div>`;
          }).join('') : `<div style="text-align:center;padding:14px;color:var(--text-muted);background:rgba(var(--fg-rgb), .02);border-radius:9px;border:1px dashed rgba(var(--fg-rgb), .07);font-size:.82rem"><i class="ri-home-line" style="display:block;font-size:1.5rem;margin-bottom:5px;opacity:.25"></i>لا توجد وحدات مرتبطة</div>`;

          openModal(`<i class="ri-user-line"></i> تفاصيل المشتري`,
            `<div class="bh">
              <div class="bh-av">${ini(b.fullName)}</div>
              <div>
                <div class="bh-name">${esc(b.fullName||'—')}</div>
                <div class="bh-sub">${b.jobTitle?esc(b.jobTitle)+(b.employer?' — '+esc(b.employer):''):esc(b.employer||'')}</div>
              </div>
            </div>
            <div class="dg-grid">
              <div class="db-block"><div class="db-label">رقم الجوال</div><div class="db-val" style="direction:ltr;text-align:right">${esc(b.phoneNumber||'—')}</div></div>
              <div class="db-block"><div class="db-label">رقم الهوية</div><div class="db-val" style="font-family:monospace">${esc(b.nationalId||'—')}</div></div>
              <div class="db-block"><div class="db-label">مصدر المشتري</div><div class="db-val">${esc(b.clientSourceAr||srcL(b.clientSource)||'—')}</div></div>
              <div class="db-block"><div class="db-label">طريقة السداد</div><div class="db-val">${esc(b.paymentMethodAr||pmL(b.paymentMethod)||'—')}</div></div>
              <div class="db-block"><div class="db-label">الراتب</div><div class="db-val">${b.salary!=null?window.fmtMoney(b.salary):'—'}</div></div>
              <div class="db-block"><div class="db-label">الحالة الاجتماعية</div><div class="db-val">${esc(b.maritalStatusAr||msL(b.maritalStatus)||'—')}${b.familyMembersCount?` (${b.familyMembersCount} أفراد)`:''}</div></div>
              <div class="db-block"><div class="db-label">تاريخ التسجيل</div><div class="db-val">${fmtD(b.createdAt)}</div></div>
              <div class="db-block"><div class="db-label">المعرّف</div><div class="db-val" style="color:var(--text-muted)">#${b.id}</div></div>
            </div>
            ${docSection(id)}
            <div>
              <div class="sec-title"><i class="ri-home-office-line" style="color:var(--accent)"></i>الوحدات${bUnits.length?`<span style="font-size:.68rem;background:rgba(52,199,89,.1);color:var(--success);padding:2px 8px;border-radius:20px;border:1px solid rgba(52,199,89,.2)">${bUnits.length} وحدة</span>`:''}</div>
              <div style="max-height:220px;overflow-y:auto">${unitsHtml}</div>
            </div>`,
            `<button class="btn-primary" onclick="window._byClose();window._byLink(${b.id},'${esc(b.fullName)}')"><i class="ri-link"></i>ربط وحدة</button>
            <button class="btn-warn" onclick="window._byClose();window._byResetPw(${b.id},'${esc(b.fullName)}')"><i class="ri-lock-password-line"></i>تغيير كلمة المرور</button>
            <button class="btn-ghost" style="background:rgba(var(--accent-rgb),.1);color:var(--accent);border-color:rgba(var(--accent-rgb),.25)" onclick="window._byClose();window._byEdit(${b.id})"><i class="ri-edit-line"></i>تعديل</button>
            <button class="btn-ghost" onclick="window._byClose()">إغلاق</button>`
          );
        } catch { toast('فشل تحميل بيانات المشتري','err'); }
      };

      /* RESET PASSWORD */
      window._byResetPw = function(id, name) {
        openModal('<i class="ri-lock-password-line"></i> تغيير كلمة المرور',
          `<div class="rp-wrap">
            <div class="rp-note"><i class="ri-information-line"></i>تغيير كلمة مرور المشتري: <strong>${esc(name)}</strong></div>
            <div class="fg"><label class="fl">كلمة المرور الجديدة *</label>
              <input id="rp-pw" class="fi" type="password" placeholder="6 أحرف على الأقل">
              <div class="ferr" id="err-rp-pw"><i class="ri-error-warning-line"></i><span></span></div>
            </div>
          </div>`,
          `<button class="btn-warn" id="rp-sb" onclick="window._byResetPwSubmit(${id})"><i class="ri-lock-password-line"></i>تأكيد التغيير</button><button class="btn-ghost" onclick="window._byClose()">إلغاء</button>`
        );
      };
      window._byResetPwSubmit = async function(id) {
        clrErrs();
        const pw = gv('rp-pw');
        if (!pw || pw.length < 6) { showErr('err-rp-pw','كلمة المرور يجب أن تكون 6 أحرف على الأقل'); return; }
        const btn = document.getElementById('rp-sb');
        if (btn) { btn.disabled=true; btn.innerHTML='<i class="ri-loader-4-line" style="animation:spin .8s linear infinite;display:inline-block"></i> جاري...'; }
        try {
          await PUT(`/api/Buyers/${id}/reset-password`, { newPassword: pw });
          toast('تم تغيير كلمة المرور بنجاح'); _byClose();
        } catch(e) {
          toast(`فشل: ${xErr(e.message)}`,'err');
          if (btn) { btn.disabled=false; btn.innerHTML='<i class="ri-lock-password-line"></i>تأكيد التغيير'; }
        }
      };

      /* DELETE */
      window._byDel = function(id, name) {
        openModal('<i class="ri-delete-bin-line"></i> حذف المشتري',
          `<div class="cfm">
            <div class="cfm-icon">🗑️</div>
            <p class="cfm-msg">هل أنت متأكد من حذف <strong>${esc(name)}</strong>؟<br>سيتم تحرير جميع الوحدات المرتبطة.<br><span style="color:var(--danger);font-size:.8rem">لا يمكن التراجع عن هذا الإجراء.</span></p>
            <div style="display:flex;gap:10px;justify-content:center">
              <button class="btn-danger" id="del-sb" onclick="window._byDelConfirm(${id})"><i class="ri-delete-bin-line"></i>نعم، احذف</button>
              <button class="btn-ghost" onclick="window._byClose()">إلغاء</button>
            </div>
          </div>`
        );
      };
      window._byDelConfirm = async function(id) {
        const btn=document.getElementById('del-sb');
        if (btn) { btn.disabled=true; btn.innerHTML='<i class="ri-loader-4-line" style="animation:spin .8s linear infinite;display:inline-block"></i> جاري...'; }
        try { await DEL(`/api/Buyers/${id}`); toast('تم حذف المشتري بنجاح'); _byClose(); await loadAll(); }
        catch(e) { toast(`فشل الحذف: ${xErr(e.message)}`,'err'); if (btn) { btn.disabled=false; btn.innerHTML='<i class="ri-delete-bin-line"></i>نعم، احذف'; } }
      };

      /* CSV */
      window._byCSV = function() {
        if (!S.filtered.length) { toast('لا توجد بيانات للتصدير','err'); return; }
        const headers = ['الاسم','رقم الجوال','رقم الهوية','مصدر المشتري','طريقة السداد','جهة العمل','المسمى الوظيفي','الراتب','الحالة الاجتماعية','أفراد الأسرة','الحالة','عدد الوحدات','وحدات مباعة','وحدات محجوزة','لديه وثيقة','تاريخ التسجيل'];
        const rows = S.filtered.map(b=>{
          const u=buyerUnits(b.id), sold=u.filter(x=>toSt(x.status)===3).length, res=u.filter(x=>toSt(x.status)===2).length;
          const st={sold:'مباع',reserved:'محجوز',new:'جديد'}[buyerSt(b.id)]||'';
          return [b.fullName||'',b.phoneNumber||'',b.nationalId||'',b.clientSourceAr||srcL(b.clientSource)||'',b.paymentMethodAr||pmL(b.paymentMethod)||'',b.employer||'',b.jobTitle||'',b.salary!=null?b.salary:'',b.maritalStatusAr||msL(b.maritalStatus)||'',b.familyMembersCount!=null?b.familyMembersCount:'',st,u.length,sold,res,hasDoc(b.id)?'نعم':'لا',b.createdAt?new Date(b.createdAt).toLocaleDateString('en-US'):'']
            .map(c=>{const s=String(c);return (s.includes(',')||s.includes('"'))?`"${s.replace(/"/g,'""')}"`:`${s}`;});
        });
        const csv='﻿'+[headers,...rows].map(r=>r.join(',')).join('\n');
        const a=document.createElement('a');
        a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));
        a.download=`buyers_${new Date().toLocaleDateString('en-CA')}.csv`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        toast(`تم تصدير ${S.filtered.length} مشترٍ`);
      };

      await loadAll();
    }
  };
})();
