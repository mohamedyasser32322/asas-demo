/* PAGE MODULE: Users (المستخدمين) — SPA v4 */
(function () {
  'use strict';
  window.__pages = window.__pages || {};

  /* ─────────────────────────────────────────────
     CSS
  ───────────────────────────────────────────── */
  const _css = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --border:      rgba(var(--fg-rgb), 0.08);
      --border-h:    rgba(var(--fg-rgb), 0.18);
      --light:       #FFFFFF;
      --text-muted:  #8fa3c0;
      --success:     #34c759;
      --warning:     #ffcc00;
      --danger:      #ff3b30;
      --accent:      #4e8df5;
      --transition:  all 0.3s cubic-bezier(0.4,0,0.2,1);
    }

    /* ── keyframes ── */
    @keyframes us-fadeIn    { from{opacity:0}              to{opacity:1} }
    @keyframes us-fadeUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes us-spin      { to{transform:rotate(360deg)} }
    @keyframes us-slideDown { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes us-popIn     { from{opacity:0;transform:scale(.94)} to{opacity:1;transform:scale(1)} }
    @keyframes us-rowReveal { from{opacity:0;transform:translateX(14px)} to{opacity:1;transform:translateX(0)} }
    @keyframes us-shimmer   {
      0%  { background-position: -600px 0; }
      100%{ background-position:  600px 0; }
    }

    ::-webkit-scrollbar { width:5px }
    ::-webkit-scrollbar-track { background:var(--primary-deep) }
    ::-webkit-scrollbar-thumb { background:rgba(var(--fg-rgb), .15); border-radius:6px }

    /* ────────────────────────────────────
       TOOLBAR (sticky)
    ──────────────────────────────────── */
    .us-toolbar {
      position:sticky; top:0; z-index:100;
      background:rgba(var(--bg-rgb),0.97);
      backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px);
      border-bottom:1px solid var(--border);
      padding:12px 24px;
      display:flex; align-items:center; justify-content:space-between;
      gap:12px; flex-wrap:wrap;
      margin:-36px -36px 0;
    }
    @media(max-width:1024px){ .us-toolbar{ margin:-24px -16px 0; padding:10px 16px; } }

    .us-toolbar-left  { display:flex; align-items:center; gap:10px; flex:1; min-width:0; }
    .us-toolbar-right { display:flex; align-items:center; gap:8px; flex-shrink:0; flex-wrap:wrap; }

    .us-title {
      font-size:1.05rem; font-weight:800; color:var(--light);
      display:flex; align-items:center; gap:8px; white-space:nowrap;
    }
    .us-title i { color:var(--accent); font-size:1.2rem; }

    .us-count-badge {
      display:inline-flex; align-items:center; justify-content:center;
      min-width:22px; height:22px; padding:0 7px;
      background:rgba(78,141,245,.22); border:1px solid rgba(78,141,245,.4);
      color:var(--accent); border-radius:20px;
      font-size:.72rem; font-weight:800;
    }

    /* search */
    .us-search-wrap {
      position:relative; flex:1; max-width:280px;
    }
    .us-search-wrap i {
      position:absolute; right:11px; top:50%; transform:translateY(-50%);
      color:var(--text-muted); font-size:.95rem; pointer-events:none;
    }
    .us-search-input {
      width:100%; padding:8px 34px 8px 12px; border-radius:10px;
      background:rgba(var(--fg-rgb), .06); border:1.5px solid rgba(var(--fg-rgb), .1);
      color:var(--light); font-family:inherit; font-size:.85rem;
      transition:var(--transition);
      direction:rtl;
    }
    .us-search-input::placeholder { color:var(--text-muted); }
    .us-search-input:focus {
      outline:none; background:rgba(var(--fg-rgb), .09);
      border-color:var(--accent); box-shadow:0 0 0 3px rgba(78,141,245,.13);
    }

    .us-add-btn {
      display:flex; align-items:center; gap:7px; padding:9px 18px; border-radius:10px;
      background:var(--accent); color:#fff; border:none;
      font-family:inherit; font-size:.88rem; font-weight:700;
      cursor:pointer; transition:var(--transition); white-space:nowrap;
    }
    .us-add-btn:hover {
      background:#3a7de4; transform:translateY(-1px);
      box-shadow:0 6px 18px rgba(78,141,245,.35);
    }

    /* ────────────────────────────────────
       FILTER BAR
    ──────────────────────────────────── */
    .us-filter-bar {
      display:flex; align-items:center; gap:8px; flex-wrap:wrap;
      padding:12px 0 10px;
      margin-top:12px;
      border-bottom:1px solid var(--border);
      margin-bottom:0;
    }
    .us-filter-label { font-size:.78rem; color:var(--text-muted); font-weight:600; margin-left:4px; white-space:nowrap; }

    .us-pill {
      padding:5px 14px; border-radius:20px;
      border:1.5px solid var(--border); background:rgba(var(--fg-rgb), .04);
      color:var(--text-muted); font-family:inherit; font-size:.78rem; font-weight:700;
      cursor:pointer; transition:var(--transition); white-space:nowrap;
    }
    .us-pill:hover { border-color:var(--accent); color:var(--accent); background:rgba(78,141,245,.08); }
    .us-pill.active { background:var(--accent); border-color:var(--accent); color:#fff; }
    .us-pill.active-status { background:var(--success); border-color:var(--success); color:var(--light); }
    .us-pill.inactive-status { background:var(--danger); border-color:var(--danger); color:var(--light); }

    .us-filter-sep { width:1px; height:20px; background:var(--border); }

    /* ────────────────────────────────────
       STATS BAR
    ──────────────────────────────────── */
    .us-stats-bar {
      display:flex; gap:10px; flex-wrap:wrap;
      padding:14px 0 2px;
      animation:us-fadeUp .4s ease both;
    }
    .us-stat-chip {
      display:flex; align-items:center; gap:7px;
      padding:7px 14px; border-radius:10px;
      background:rgba(var(--fg-rgb), .04); border:1px solid var(--border);
      font-size:.78rem; color:var(--text-muted); white-space:nowrap;
      transition:var(--transition);
    }
    .us-stat-chip:hover { border-color:var(--border-h); background:rgba(var(--fg-rgb), .07); }
    .us-stat-chip i { font-size:.9rem; }
    .us-stat-chip strong { color:var(--light); font-size:.9rem; font-variant-numeric:tabular-nums; }

    .us-stat-chip.total   i { color:var(--accent); }
    .us-stat-chip.active  i { color:var(--success); }
    .us-stat-chip.inactive i{ color:var(--danger); }
    .us-stat-chip.admin   i { color:#ffb300; }
    .us-stat-chip.booking i { color:var(--accent); }
    .us-stat-chip.engineer i{ color:var(--success); }

    /* ────────────────────────────────────
       TABLE
    ──────────────────────────────────── */
    .us-table-wrap {
      background:var(--card-bg); border:1px solid var(--border);
      border-radius:16px; overflow:hidden;
      margin-top:14px;
      animation:us-fadeUp .45s ease both;
    }
    .us-table-scroll { overflow-x:auto; }
    .us-table { width:100%; border-collapse:collapse; min-width:640px; }
    .us-table thead tr { background:rgba(var(--fg-rgb), .025); border-bottom:1px solid var(--border); }
    .us-table thead th {
      padding:12px 16px; text-align:right;
      font-size:.72rem; font-weight:800; color:var(--text-muted);
      text-transform:uppercase; letter-spacing:.5px; white-space:nowrap;
    }
    .us-table tbody tr {
      border-bottom:1px solid var(--border);
      transition:background .15s;
      cursor:default;
    }
    .us-table tbody tr:last-child { border-bottom:none; }
    .us-table tbody tr:hover { background:rgba(78,141,245,.055); }
    .us-table tbody td { padding:12px 16px; font-size:.87rem; color:var(--light); vertical-align:middle; }

    .us-row-enter {
      opacity:0;
      animation:us-rowReveal .38s cubic-bezier(.22,1,.36,1) forwards;
    }

    /* avatar */
    .us-user-cell { display:flex; align-items:center; gap:12px; }
    .us-avatar {
      width:40px; height:40px; border-radius:50%;
      display:flex; align-items:center; justify-content:center;
      color:var(--light); font-weight:800; font-size:.95rem; flex-shrink:0;
      letter-spacing:.5px;
    }
    .us-avatar-admin    { background:linear-gradient(135deg,#f5a623,#e8880a); }
    .us-avatar-booking  { background:linear-gradient(135deg,#4e8df5,#2a6de0); }
    .us-avatar-engineer { background:linear-gradient(135deg,#34c759,#1a9c3e); }
    .us-avatar-default  { background:linear-gradient(135deg,#667eea,#764ba2); }

    .us-name  { font-weight:700; font-size:.9rem; }
    .us-email { font-size:.73rem; color:var(--text-muted); margin-top:1px; direction:ltr; text-align:right; }

    /* role badge */
    .us-role-badge {
      display:inline-flex; align-items:center; gap:5px;
      padding:3px 10px; border-radius:20px;
      font-size:.72rem; font-weight:800; white-space:nowrap;
    }
    .us-role-admin    { background:rgba(255,176,0,.12);  color:#ffb300; border:1px solid rgba(255,176,0,.3); }
    .us-role-booking  { background:rgba(78,141,245,.12); color:#4e8df5; border:1px solid rgba(78,141,245,.3); }
    .us-role-engineer { background:rgba(52,199,89,.12);  color:#34c759; border:1px solid rgba(52,199,89,.3); }

    /* status badge */
    .us-status-badge {
      display:inline-flex; align-items:center; gap:5px;
      padding:3px 10px; border-radius:20px; font-size:.72rem; font-weight:800;
    }
    .us-status-active   { background:rgba(52,199,89,.12); color:#34c759; border:1px solid rgba(52,199,89,.3); }
    .us-status-inactive { background:rgba(255,59,48,.12); color:#ff3b30; border:1px solid rgba(255,59,48,.3); }

    /* actions */
    .us-actions { display:flex; gap:6px; justify-content:flex-end; }
    .us-action-btn {
      width:30px; height:30px; border-radius:8px;
      border:1px solid var(--border); background:rgba(var(--fg-rgb), .05);
      color:var(--text-muted); cursor:pointer; font-size:.88rem;
      display:flex; align-items:center; justify-content:center;
      transition:var(--transition);
    }
    .us-action-btn:hover     { background:rgba(78,141,245,.18); color:var(--accent); border-color:var(--accent); }
    .us-action-btn.del:hover { background:rgba(255,59,48,.18);  color:var(--danger);  border-color:var(--danger); }

    /* ────────────────────────────────────
       SKELETON ROWS
    ──────────────────────────────────── */
    .us-skel-cell {
      height:14px; border-radius:6px;
      background:linear-gradient(90deg, rgba(var(--fg-rgb), .04) 25%, rgba(var(--fg-rgb), .09) 50%, rgba(var(--fg-rgb), .04) 75%);
      background-size:600px 100%;
      animation:us-shimmer 1.4s ease-in-out infinite;
    }

    /* ────────────────────────────────────
       EMPTY STATE
    ──────────────────────────────────── */
    .us-empty {
      text-align:center; padding:64px 24px; color:var(--text-muted);
      animation:us-fadeIn .3s ease;
    }
    .us-empty-icon {
      width:64px; height:64px; border-radius:50%;
      background:rgba(78,141,245,.08); border:1px solid rgba(78,141,245,.15);
      display:flex; align-items:center; justify-content:center;
      margin:0 auto 16px;
    }
    .us-empty-icon i { font-size:1.8rem; color:var(--accent); opacity:.5; }
    .us-empty-title { font-size:.98rem; font-weight:700; color:var(--light); opacity:.55; margin-bottom:6px; }
    .us-empty-sub   { font-size:.82rem; color:var(--text-muted); }

    /* ────────────────────────────────────
       MODALS
    ──────────────────────────────────── */
    .us-overlay {
      display:none; position:fixed; inset:0;
      background:rgba(0,0,0,.68); z-index:1000;
      align-items:center; justify-content:center;
      backdrop-filter:blur(7px); -webkit-backdrop-filter:blur(7px);
      animation:us-fadeIn .18s ease;
    }
    .us-overlay.open { display:flex; }

    .us-modal-box {
      background:var(--card-bg); border:1px solid rgba(var(--fg-rgb), .13);
      border-radius:20px; max-width:500px; width:94%;
      max-height:90vh; overflow-y:auto;
      box-shadow:0 28px 64px rgba(0,0,0,.55);
      animation:us-popIn .22s cubic-bezier(.34,1.3,.64,1);
    }
    .us-modal-box.wide { max-width:560px; }

    .us-modal-head {
      padding:20px 24px 15px; border-bottom:1px solid var(--border);
      display:flex; justify-content:space-between; align-items:center;
      position:sticky; top:0; background:var(--card-bg); z-index:2;
      border-radius:20px 20px 0 0;
    }
    .us-modal-title { font-size:1.02rem; font-weight:800; color:var(--light); }
    .us-modal-close {
      background:rgba(var(--fg-rgb), .06); border:1px solid var(--border);
      color:var(--text-muted); font-size:1.1rem; cursor:pointer;
      width:30px; height:30px; border-radius:8px;
      display:flex; align-items:center; justify-content:center;
      transition:var(--transition);
    }
    .us-modal-close:hover { color:var(--light); background:rgba(255,59,48,.15); border-color:rgba(255,59,48,.3); transform:rotate(90deg); }
    .us-modal-body   { padding:20px 24px; }
    .us-modal-footer {
      padding:14px 24px; border-top:1px solid var(--border);
      display:flex; gap:10px; justify-content:flex-end; flex-wrap:wrap;
      background:rgba(0,0,0,.18); border-radius:0 0 20px 20px;
      position:sticky; bottom:0;
    }

    /* ────────────────────────────────────
       FORM ELEMENTS
    ──────────────────────────────────── */
    .us-fg { margin-bottom:14px; }
    .us-fl { display:block; font-size:.82rem; font-weight:700; margin-bottom:6px; color:var(--light); }
    .us-fi, .us-fsel {
      width:100%; padding:10px 13px; border-radius:10px;
      background:rgba(var(--fg-rgb), .05); border:1.5px solid rgba(var(--fg-rgb), .1);
      color:var(--light); font-family:inherit; font-size:.88rem; transition:var(--transition);
    }
    .us-fi::placeholder { color:var(--text-muted); }
    .us-fi:focus, .us-fsel:focus {
      outline:none; background:rgba(var(--fg-rgb), .08);
      border-color:var(--accent); box-shadow:0 0 0 3px rgba(78,141,245,.13);
    }
    .us-fsel {
      appearance:none; cursor:pointer; color-scheme:dark; color:#dde8ff;
      background-image:url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat:no-repeat; background-position:left 12px center; background-size:15px; padding-left:34px;
    }
    .us-fsel option { background:var(--card-bg); color:#dde8ff; }

    .us-fr { display:grid; grid-template-columns:1fr 1fr; gap:12px; }

    .us-status-toggle {
      display:flex; align-items:center; justify-content:space-between;
      padding:12px 14px; background:rgba(var(--fg-rgb), .03);
      border-radius:10px; border:1px solid rgba(var(--fg-rgb), .08); margin-bottom:14px;
    }
    .us-status-toggle-label { display:flex; align-items:center; gap:8px; font-weight:600; font-size:.86rem; color:var(--light); }
    .us-status-text { font-size:.84rem; font-weight:800; min-width:42px; text-align:left; }
    .us-toggle-cb { width:18px; height:18px; cursor:pointer; accent-color:var(--accent); }

    /* pw strength */
    .us-pw-wrap { position:relative; }
    .us-pw-eye {
      position:absolute; left:11px; top:50%; transform:translateY(-50%);
      background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:1rem;
      display:flex; align-items:center; padding:2px; transition:var(--transition);
    }
    .us-pw-eye:hover { color:var(--accent); }

    .us-pw-strength {
      margin-top:6px; display:flex; gap:4px;
    }
    .us-pw-bar {
      flex:1; height:3px; border-radius:2px; background:rgba(var(--fg-rgb), .08);
      transition:background .3s;
    }
    .us-pw-bar.s1 { background:var(--danger); }
    .us-pw-bar.s2 { background:var(--warning); }
    .us-pw-bar.s3 { background:var(--accent); }
    .us-pw-bar.s4 { background:var(--success); }

    /* inline error */
    .us-field-err { font-size:.74rem; color:var(--danger); margin-top:4px; display:none; align-items:center; gap:4px; }
    .us-field-err.show { display:flex; }
    .us-field-err i { font-size:.82rem; flex-shrink:0; }

    /* change-password section inside edit modal */
    .us-pw-section {
      margin-top:4px; padding:12px 14px; border-radius:10px;
      border:1px dashed rgba(78,141,245,.3); background:rgba(78,141,245,.04);
    }
    .us-pw-section-title {
      font-size:.78rem; font-weight:700; color:var(--accent);
      margin-bottom:10px; display:flex; align-items:center; gap:6px;
    }

    /* ────────────────────────────────────
       BUTTONS
    ──────────────────────────────────── */
    .btn-submit {
      display:flex; align-items:center; gap:6px; padding:10px 22px; border-radius:10px;
      background:var(--accent); color:#fff; border:none;
      font-family:inherit; font-size:.88rem; font-weight:700;
      cursor:pointer; transition:var(--transition); box-shadow:0 4px 14px rgba(78,141,245,.3);
    }
    .btn-submit:hover:not(:disabled) { background:#3a7de4; transform:translateY(-1px); }
    .btn-submit:disabled { opacity:.55; cursor:not-allowed; transform:none; }

    .btn-cancel {
      padding:10px 20px; border-radius:10px;
      background:rgba(var(--fg-rgb), .06); color:var(--light);
      border:1px solid rgba(var(--fg-rgb), .12);
      font-family:inherit; font-size:.88rem; font-weight:600;
      cursor:pointer; transition:var(--transition);
    }
    .btn-cancel:hover { background:rgba(var(--fg-rgb), .1); }

    .btn-danger {
      display:flex; align-items:center; gap:6px; padding:10px 20px; border-radius:10px;
      background:var(--danger); color:var(--light); border:none;
      font-family:inherit; font-size:.88rem; font-weight:700;
      cursor:pointer; transition:var(--transition);
    }
    .btn-danger:hover:not(:disabled) { background:#e62c21; }
    .btn-danger:disabled { opacity:.55; cursor:not-allowed; }

    .btn-warning {
      display:flex; align-items:center; gap:6px; padding:8px 16px; border-radius:9px;
      background:rgba(255,204,0,.12); color:var(--warning); border:1px solid rgba(255,204,0,.3);
      font-family:inherit; font-size:.82rem; font-weight:700;
      cursor:pointer; transition:var(--transition);
    }
    .btn-warning:hover { background:rgba(255,204,0,.2); }

    /* ────────────────────────────────────
       CONFIRM MODAL BODY
    ──────────────────────────────────── */
    .confirm-box    { text-align:center; padding:8px 0 4px; }
    .confirm-icon   { font-size:2.6rem; margin-bottom:12px; }
    .confirm-msg    { font-size:.9rem; color:var(--text-muted); line-height:1.75; margin-bottom:20px; }
    .confirm-msg strong { color:var(--light); }
    .confirm-actions { display:flex; gap:12px; justify-content:center; }

    /* ────────────────────────────────────
       TOAST
    ──────────────────────────────────── */
    #us-toast {
      position:fixed; bottom:22px; right:22px; z-index:9999;
      display:flex; flex-direction:column; gap:8px; pointer-events:none;
    }
    .us-toast {
      display:flex; align-items:center; gap:10px; padding:11px 16px; border-radius:12px;
      background:rgba(8,18,40,.97); border:1px solid var(--border);
      color:var(--light); font-size:.86rem; font-weight:600;
      animation:us-slideDown .22s ease; box-shadow:0 8px 28px rgba(0,0,0,.4);
      pointer-events:all; max-width:320px;
    }
    .us-toast.success { border-color:rgba(52,199,89,.4); }
    .us-toast.error   { border-color:rgba(255,59,48,.4); }
    .us-toast i { font-size:1.05rem; flex-shrink:0; }
    .us-toast.success i { color:var(--success); }
    .us-toast.error   i { color:var(--danger); }

    /* ────────────────────────────────────
       RESPONSIVE
    ──────────────────────────────────── */
    @media(max-width:768px) {
      .us-table { min-width:520px; }
      .us-stats-bar { gap:6px; }
    }
    @media(max-width:580px) {
      .us-fr { grid-template-columns:1fr; }
      .us-toolbar-left { gap:6px; }
      .us-filter-sep { display:none; }
    }
  `;

  /* ─────────────────────────────────────────────
     MODULE
  ───────────────────────────────────────────── */
  window.__pages['users'] = {
    getCSS: function () { return _css; },

    init: async function () {
      const container = document.getElementById('app-main');
      const API_BASE  = window.location.origin;

      /* ── state ── */
      let allUsers     = [];
      let searchQ      = '';
      let filterRole   = 'all';   // 'all' | 'Admin' | 'BookingManager' | 'SiteEngineer'
      let filterStatus = 'all';   // 'all' | 'active' | 'inactive'

      /* ── helpers ── */
      function esc(s) {
        return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      }
      function v(id) { return (document.getElementById(id)?.value || '').trim(); }

      function fmtDate(d) {
        if (!d) return '—';
        try{ const dt=new Date(d); const day=String(dt.getDate()).padStart(2,'0'); const month=String(dt.getMonth()+1).padStart(2,'0'); return`${day}/${month}/${dt.getFullYear()}`; }catch{ return '—'; }
      }

      /* role helpers */
      const ROLE_MAP = {
        'Admin':          { name:'مدير النظام',    cls:'us-role-admin',    avatar:'us-avatar-admin',    icon:'ri-shield-star-line' },
        'BookingManager': { name:'مدير الحجوزات', cls:'us-role-booking',  avatar:'us-avatar-booking',  icon:'ri-calendar-check-line' },
        'SiteEngineer':   { name:'مهندس الموقع',  cls:'us-role-engineer', avatar:'us-avatar-engineer', icon:'ri-building-4-line' },
        '1':              { name:'مدير النظام',    cls:'us-role-admin',    avatar:'us-avatar-admin',    icon:'ri-shield-star-line' },
        '2':              { name:'مدير الحجوزات', cls:'us-role-booking',  avatar:'us-avatar-booking',  icon:'ri-calendar-check-line' },
        '3':              { name:'مهندس الموقع',  cls:'us-role-engineer', avatar:'us-avatar-engineer', icon:'ri-building-4-line' },
      };
      function getRole(u) {
        const key = u.role || String(u.roleId || '');
        return ROLE_MAP[key] || { name:'غير معروف', cls:'', avatar:'us-avatar-default', icon:'ri-user-line' };
      }
      function getInitials(f, l) { return ((f?.[0] || '') + (l?.[0] || '')).toUpperCase() || '?'; }

      /* normalise role string for filtering */
      function rawRole(u) { return u.role || String(u.roleId || ''); }

      /* ── error translation ── */
      function translateError(msg) {
        if (!msg) return 'حدث خطأ غير معروف';
        const m = msg.toLowerCase();
        if (m.includes('email') || m.includes('بريد') || m.includes('مسجل'))        return 'البريد الإلكتروني مسجل مسبقاً';
        if (m.includes('phone') || m.includes('هاتف'))                               return 'رقم الهاتف مسجل مسبقاً';
        if (m.includes('unique') || m.includes('duplicate') || m.includes('already exist') || m.includes('ix_') || m.includes('uq_'))
          return 'هذه البيانات مسجلة مسبقاً';
        if (m.includes('foreign key') || m.includes('reference'))                    return 'لا يمكن تنفيذ العملية — توجد بيانات مرتبطة';
        if (m.includes('not found') || m.includes('404'))                            return 'العنصر غير موجود';
        if (m.includes('unauthorized') || m.includes('401'))                         return 'غير مصرح — يرجى تسجيل الدخول';
        if (m.includes('forbidden') || m.includes('403'))                            return 'ليس لديك صلاحية لهذه العملية';
        if (m.includes('password') || m.includes('كلمة مرور'))                      return 'كلمة المرور غير صحيحة أو قصيرة جداً';
        return msg;
      }

      /* ── auth ── */
      function getAuthToken() {
        let t = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!t) { try { const d = JSON.parse(localStorage.getItem('authData')); t = d?.token; } catch {} }
        return t || '';
      }

      /* ── api ── */
      async function api(method, path, body) {
        const token = getAuthToken();
        if (!token) {
          window.__showToast?.('يرجى تسجيل الدخول أولاً','error');
          setTimeout(()=>{ window.location.replace('/login'); }, 1500);
          return null;
        }
        const opts  = { method, headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${token}` } };
        if (body !== undefined) opts.body = JSON.stringify(body);
        try {
          const r = await fetch(API_BASE + path, opts);
          if (!r.ok) {
            if (r.status === 401) {
              window.__showToast?.('انتهت صلاحية جلستك، جارٍ تسجيل الخروج...','warning',2500);
              setTimeout(()=>{ ['authData','token','authToken','rememberMe','savedEmail'].forEach(k=>localStorage.removeItem(k)); window.location.replace('/login'); }, 2000);
              return null;
            }
            if (r.status === 403) { window.__showToast?.('ليس لديك صلاحية لهذا الإجراء','error'); return null; }
            let errMsg = `خطأ ${r.status}`;
            try {
              const j = await r.json();
              errMsg = j.message || j.title || j.detail || j.error ||
                (j.errors ? Object.values(j.errors).flat().join(', ') : null) || errMsg;
            } catch {}
            const err = new Error(errMsg);
            err.status = r.status;
            throw err;
          }
          return r.status === 204 ? null : r.json();
        } catch(err) {
          if(err.name==='AbortError') return null;
          if(err.status) throw err; // خطأ HTTP نمرره
          window.__showToast?.('تعذر الاتصال بالخادم','error');
          throw err;
        }
      }
      const GET    = p      => api('GET',    p);
      const POST   = (p, b) => api('POST',   p, b);
      const PUT    = (p, b) => api('PUT',    p, b);
      const DELETE = p      => api('DELETE', p);

      /* ── toast ── */
      function toast(msg, type = 'success') {
        const el = document.createElement('div');
        el.className = `us-toast ${type}`;
        el.innerHTML = `<i class="ri-${type === 'success' ? 'checkbox-circle-fill' : 'error-warning-fill'}"></i><span>${msg}</span>`;
        document.getElementById('us-toast').appendChild(el);
        setTimeout(() => {
          el.style.cssText += 'opacity:0;transform:translateY(4px);transition:.3s';
          setTimeout(() => el.remove(), 330);
        }, 3500);
      }

      /* ── field error helpers ── */
      function showErr(id, msg) {
        const el = document.getElementById(id);
        if (!el) return;
        el.classList.add('show');
        el.querySelector('span').textContent = msg;
      }
      function clearErrs() {
        document.querySelectorAll('.us-field-err').forEach(e => e.classList.remove('show'));
      }

      /* ── busy button ── */
      function setBusy(id, busy, label) {
        const btn = document.getElementById(id);
        if (!btn) return;
        btn.disabled = busy;
        if (busy) btn.innerHTML = '<i class="ri-loader-4-line" style="animation:us-spin 1s linear infinite"></i> جاري...';
        else if (label) btn.innerHTML = label;
      }

      /* ────────────────────────────────────
         INJECT SKELETON HTML
      ──────────────────────────────────── */
      container.innerHTML = `
        <!-- Main modal -->
        <div id="us-modal" class="us-overlay">
          <div class="us-modal-box" id="us-modal-box">
            <div class="us-modal-head">
              <div class="us-modal-title" id="us-modal-title"></div>
              <button class="us-modal-close" id="us-modal-close"><i class="ri-close-line"></i></button>
            </div>
            <div id="us-modal-body"></div>
          </div>
        </div>

        <!-- Password modal -->
        <div id="us-pw-modal" class="us-overlay">
          <div class="us-modal-box" id="us-pw-modal-box">
            <div class="us-modal-head">
              <div class="us-modal-title">تغيير كلمة المرور</div>
              <button class="us-modal-close" id="us-pw-modal-close"><i class="ri-close-line"></i></button>
            </div>
            <div id="us-pw-modal-body"></div>
          </div>
        </div>

        <!-- Confirm modal -->
        <div id="us-confirm-modal" class="us-overlay">
          <div class="us-modal-box" id="us-confirm-modal-box">
            <div class="us-modal-head">
              <div class="us-modal-title" id="us-confirm-title">تأكيد</div>
              <button class="us-modal-close" id="us-confirm-close"><i class="ri-close-line"></i></button>
            </div>
            <div id="us-confirm-body"></div>
          </div>
        </div>

        <!-- Toast container -->
        <div id="us-toast"></div>

        <!-- ── Toolbar ── -->
        <div class="us-toolbar">
          <div class="us-toolbar-left">
            <div class="us-title">
              <i class="ri-team-line"></i>إدارة المستخدمين
              <span class="us-count-badge" id="us-total-badge">0</span>
            </div>
          </div>
          <div class="us-toolbar-right">
            <div class="us-search-wrap">
              <i class="ri-search-line"></i>
              <input class="us-search-input" id="us-search" type="text" placeholder="بحث بالاسم أو البريد...">
            </div>
            <button class="us-add-btn" id="us-add-btn">
              <i class="ri-user-add-line"></i>مستخدم جديد
            </button>
          </div>
        </div>

        <!-- ── Filter bar ── -->
        <div class="us-filter-bar">
          <span class="us-filter-label">الدور:</span>
          <button class="us-pill active" data-role="all">الكل</button>
          <button class="us-pill" data-role="Admin">مدير</button>
          <button class="us-pill" data-role="BookingManager">حجوزات</button>
          <button class="us-pill" data-role="SiteEngineer">مهندس</button>
          <div class="us-filter-sep"></div>
          <span class="us-filter-label">الحالة:</span>
          <button class="us-pill" data-status="all">الكل</button>
          <button class="us-pill" data-status="active">نشط</button>
          <button class="us-pill" data-status="inactive">معطل</button>
        </div>

        <!-- ── Stats bar ── -->
        <div class="us-stats-bar" id="us-stats-bar">
          <div class="us-stat-chip total">
            <i class="ri-group-line"></i><span>الإجمالي</span><strong id="st-total">—</strong>
          </div>
          <div class="us-stat-chip active">
            <i class="ri-checkbox-circle-line"></i><span>نشط</span><strong id="st-active">—</strong>
          </div>
          <div class="us-stat-chip inactive">
            <i class="ri-close-circle-line"></i><span>معطل</span><strong id="st-inactive">—</strong>
          </div>
          <div class="us-stat-chip admin">
            <i class="ri-shield-star-line"></i><span>مدراء</span><strong id="st-admin">—</strong>
          </div>
          <div class="us-stat-chip booking">
            <i class="ri-calendar-check-line"></i><span>حجوزات</span><strong id="st-booking">—</strong>
          </div>
          <div class="us-stat-chip engineer">
            <i class="ri-building-4-line"></i><span>مهندسون</span><strong id="st-engineer">—</strong>
          </div>
        </div>

        <!-- ── Table ── -->
        <div class="us-table-wrap">
          <div class="us-table-scroll">
            <table class="us-table">
              <thead>
                <tr>
                  <th>المستخدم</th>
                  <th>الدور</th>
                  <th>الحالة</th>
                  <th>تاريخ الانضمام</th>
                  <th style="text-align:left">الإجراءات</th>
                </tr>
              </thead>
              <tbody id="us-tbody"></tbody>
            </table>
          </div>
        </div>
      `;

      /* ────────────────────────────────────
         MODAL OPEN / CLOSE
      ──────────────────────────────────── */
      function openModal(title, bodyHTML) {
        document.getElementById('us-modal-title').textContent = title;
        document.getElementById('us-modal-body').innerHTML    = bodyHTML;
        document.getElementById('us-modal').classList.add('open');
      }
      function closeModal() {
        document.getElementById('us-modal').classList.remove('open');
      }

      function openPwModal(bodyHTML) {
        document.getElementById('us-pw-modal-body').innerHTML = bodyHTML;
        document.getElementById('us-pw-modal').classList.add('open');
      }
      function closePwModal() {
        document.getElementById('us-pw-modal').classList.remove('open');
      }

      function openConfirm(title, bodyHTML) {
        document.getElementById('us-confirm-title').textContent = title;
        document.getElementById('us-confirm-body').innerHTML    = bodyHTML;
        document.getElementById('us-confirm-modal').classList.add('open');
      }
      function closeConfirm() {
        document.getElementById('us-confirm-modal').classList.remove('open');
      }

      /* wire close buttons */
      document.getElementById('us-modal-close').addEventListener('click',   closeModal);
      document.getElementById('us-pw-modal-close').addEventListener('click', closePwModal);
      document.getElementById('us-confirm-close').addEventListener('click',  closeConfirm);

      /* click outside overlay */
      document.getElementById('us-modal').addEventListener('click', e => {
        if (e.target.id === 'us-modal') closeModal();
      });
      document.getElementById('us-pw-modal').addEventListener('click', e => {
        if (e.target.id === 'us-pw-modal') closePwModal();
      });
      document.getElementById('us-confirm-modal').addEventListener('click', e => {
        if (e.target.id === 'us-confirm-modal') closeConfirm();
      });

      /* escape key */
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') { closeModal(); closePwModal(); closeConfirm(); }
      }, { signal: window.__pageAbortSignal });

      /* ────────────────────────────────────
         STATS
      ──────────────────────────────────── */
      function updateStats() {
        const total    = allUsers.length;
        const active   = allUsers.filter(u => u.isActive).length;
        const inactive = total - active;
        const admins   = allUsers.filter(u => rawRole(u) === 'Admin'    || rawRole(u) === '1').length;
        const booking  = allUsers.filter(u => rawRole(u) === 'BookingManager' || rawRole(u) === '2').length;
        const engineer = allUsers.filter(u => rawRole(u) === 'SiteEngineer'   || rawRole(u) === '3').length;

        const set = (id, val) => {
          const el = document.getElementById(id);
          if (el) el.textContent = val.toLocaleString('en-US');
        };
        set('st-total',    total);
        set('st-active',   active);
        set('st-inactive', inactive);
        set('st-admin',    admins);
        set('st-booking',  booking);
        set('st-engineer', engineer);
        const badge = document.getElementById('us-total-badge');
        if (badge) badge.textContent = total.toLocaleString('en-US');
      }

      /* ────────────────────────────────────
         FILTER & RENDER
      ──────────────────────────────────── */
      function getFiltered() {
        const q = searchQ.toLowerCase();
        return allUsers.filter(u => {
          /* search */
          if (q) {
            const name  = `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase();
            const email = (u.email || '').toLowerCase();
            if (!name.includes(q) && !email.includes(q)) return false;
          }
          /* role filter — match both string and numeric forms */
          if (filterRole !== 'all') {
            const r = rawRole(u);
            const map = { 'Admin':'1', 'BookingManager':'2', 'SiteEngineer':'3' };
            if (r !== filterRole && r !== map[filterRole]) return false;
          }
          /* status filter */
          if (filterStatus === 'active'   && !u.isActive) return false;
          if (filterStatus === 'inactive' &&  u.isActive) return false;
          return true;
        });
      }

      function renderSkeleton() {
        const rows = Array.from({ length: 5 }, (_, i) => `
          <tr style="animation-delay:${i * 60}ms; animation:us-fadeIn .3s ease both">
            <td><div style="display:flex;align-items:center;gap:12px">
              <div style="width:40px;height:40px;border-radius:50%" class="us-skel-cell"></div>
              <div style="flex:1">
                <div class="us-skel-cell" style="width:120px;margin-bottom:6px"></div>
                <div class="us-skel-cell" style="width:160px;height:11px"></div>
              </div>
            </div></td>
            <td><div class="us-skel-cell" style="width:90px;height:22px;border-radius:20px"></div></td>
            <td><div class="us-skel-cell" style="width:60px;height:22px;border-radius:20px"></div></td>
            <td><div class="us-skel-cell" style="width:80px"></div></td>
            <td><div style="display:flex;gap:6px;justify-content:flex-end">
              <div class="us-skel-cell" style="width:30px;height:30px;border-radius:8px"></div>
              <div class="us-skel-cell" style="width:30px;height:30px;border-radius:8px"></div>
            </div></td>
          </tr>
        `).join('');
        document.getElementById('us-tbody').innerHTML = rows;
      }

      function renderUsers() {
        const tbody    = document.getElementById('us-tbody');
        const filtered = getFiltered();

        if (!filtered.length) {
          const noData = allUsers.length === 0
            ? { icon:'ri-team-line',  title:'لا يوجد مستخدمون بعد',   sub:'ابدأ بإضافة مستخدم جديد' }
            : { icon:'ri-search-line', title:'لا توجد نتائج مطابقة', sub:'جرب تغيير كلمة البحث أو الفلاتر' };
          tbody.innerHTML = `
            <tr><td colspan="5">
              <div class="us-empty">
                <div class="us-empty-icon"><i class="${noData.icon}"></i></div>
                <div class="us-empty-title">${noData.title}</div>
                <div class="us-empty-sub">${noData.sub}</div>
              </div>
            </td></tr>`;
          return;
        }

        tbody.innerHTML = filtered.map((u, i) => {
          const role = getRole(u);
          return `
            <tr class="us-row-enter" style="animation-delay:${i * 40}ms">
              <td>
                <div class="us-user-cell">
                  <div class="us-avatar ${role.avatar}">${getInitials(u.firstName, u.lastName)}</div>
                  <div>
                    <div class="us-name">${esc(u.firstName)} ${esc(u.lastName)}</div>
                    <div class="us-email">${esc(u.email)}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="us-role-badge ${role.cls}">
                  <i class="${role.icon}"></i>${role.name}
                </span>
              </td>
              <td>
                <span class="us-status-badge ${u.isActive ? 'us-status-active' : 'us-status-inactive'}">
                  <i class="ri-${u.isActive ? 'checkbox-circle' : 'close-circle'}-line"></i>
                  ${u.isActive ? 'نشط' : 'معطل'}
                </span>
              </td>
              <td style="color:var(--text-muted);font-size:.8rem;font-variant-numeric:tabular-nums">
                ${fmtDate(u.createdAt)}
              </td>
              <td>
                <div class="us-actions">
                  <button class="us-action-btn" data-edit="${u.id}" title="تعديل">
                    <i class="ri-edit-line"></i>
                  </button>
                  <button class="us-action-btn del" data-del="${u.id}" data-name="${esc((u.firstName || '') + ' ' + (u.lastName || ''))}" title="حذف">
                    <i class="ri-delete-bin-line"></i>
                  </button>
                </div>
              </td>
            </tr>
          `;
        }).join('');
      }

      /* ────────────────────────────────────
         LOAD DATA
      ──────────────────────────────────── */
      async function loadUsers() {
        renderSkeleton();
        try {
          const data = await GET('/api/Users');
          allUsers   = Array.isArray(data) ? data : (data?.data || data?.users || []);
          updateStats();
          renderUsers();
        } catch (e) {
          toast(translateError(e.message), 'error');
          document.getElementById('us-tbody').innerHTML = `
            <tr><td colspan="5">
              <div class="us-empty">
                <div class="us-empty-icon"><i class="ri-wifi-off-line"></i></div>
                <div class="us-empty-title">فشل تحميل البيانات</div>
                <div class="us-empty-sub">${esc(e.message)}</div>
              </div>
            </td></tr>`;
        }
      }

      /* ────────────────────────────────────
         USER FORM
      ──────────────────────────────────── */
      function buildStatusText(checked) {
        return checked
          ? `<span style="color:var(--success)">نشط</span>`
          : `<span style="color:var(--danger)">معطل</span>`;
      }

      function buildUserForm(u = null) {
        const isEdit   = !!u;
        const roleVal  = u ? (u.role || String(u.roleId || '')) : '';

        /* map role string to select value (1/2/3) */
        const roleSelectVal = (r => {
          if (r === 'Admin'          || r === '1') return '1';
          if (r === 'BookingManager' || r === '2') return '2';
          if (r === 'SiteEngineer'   || r === '3') return '3';
          return '';
        })(roleVal);

        return `
          <div class="us-modal-body">
            <div class="us-fr">
              <div class="us-fg">
                <label class="us-fl">الاسم الأول <span style="color:var(--danger)">*</span></label>
                <input id="us-fn" class="us-fi" value="${esc(u?.firstName || '')}" placeholder="الاسم الأول" autocomplete="off">
                <div class="us-field-err" id="us-err-fn"><i class="ri-error-warning-line"></i><span></span></div>
              </div>
              <div class="us-fg">
                <label class="us-fl">الاسم الأخير <span style="color:var(--danger)">*</span></label>
                <input id="us-ln" class="us-fi" value="${esc(u?.lastName || '')}" placeholder="اسم العائلة" autocomplete="off">
                <div class="us-field-err" id="us-err-ln"><i class="ri-error-warning-line"></i><span></span></div>
              </div>
            </div>

            <div class="us-fg">
              <label class="us-fl">البريد الإلكتروني <span style="color:var(--danger)">*</span></label>
              <input id="us-em" class="us-fi" type="email" style="direction:ltr;text-align:left"
                value="${esc(u?.email || '')}" placeholder="example@domain.com" autocomplete="off">
              <div class="us-field-err" id="us-err-em"><i class="ri-error-warning-line"></i><span></span></div>
            </div>

            ${!isEdit ? `
            <div class="us-fg">
              <label class="us-fl">كلمة المرور <span style="color:var(--danger)">*</span></label>
              <div class="us-pw-wrap">
                <input id="us-pw" class="us-fi" type="password" placeholder="6 أحرف على الأقل" autocomplete="new-password" style="padding-left:38px">
                <button type="button" class="us-pw-eye" id="us-pw-eye"><i class="ri-eye-off-line"></i></button>
              </div>
              <div class="us-pw-strength" id="us-pw-strength">
                <div class="us-pw-bar" id="us-pb1"></div>
                <div class="us-pw-bar" id="us-pb2"></div>
                <div class="us-pw-bar" id="us-pb3"></div>
                <div class="us-pw-bar" id="us-pb4"></div>
              </div>
              <div class="us-field-err" id="us-err-pw"><i class="ri-error-warning-line"></i><span></span></div>
            </div>` : ''}

            <div class="us-fg">
              <label class="us-fl">الدور الوظيفي <span style="color:var(--danger)">*</span></label>
              <select id="us-role" class="us-fsel">
                <option value="">— اختر الدور —</option>
                <option value="1" ${roleSelectVal === '1' ? 'selected' : ''}>مدير النظام</option>
                <option value="2" ${roleSelectVal === '2' ? 'selected' : ''}>مدير الحجوزات</option>
                <option value="3" ${roleSelectVal === '3' ? 'selected' : ''}>مهندس الموقع</option>
              </select>
              <div class="us-field-err" id="us-err-role"><i class="ri-error-warning-line"></i><span></span></div>
            </div>

            <div class="us-status-toggle">
              <div class="us-status-toggle-label"><i class="ri-shield-check-line"></i> حالة الحساب</div>
              <div style="display:flex;align-items:center;gap:10px">
                <span id="us-status-text" class="us-status-text">${buildStatusText(!isEdit || (u?.isActive ?? true))}</span>
                <input type="checkbox" id="us-active" class="us-toggle-cb" ${(!isEdit || (u?.isActive ?? true)) ? 'checked' : ''}>
              </div>
            </div>
          </div>

          <div class="us-modal-footer">
            ${isEdit ? `<button class="btn-warning" id="us-changepw-btn" data-uid="${u.id}" data-uname="${esc((u.firstName || '') + ' ' + (u.lastName || ''))}">
              <i class="ri-key-2-line"></i>تغيير كلمة المرور
            </button>` : ''}
            <button class="btn-submit" id="us-submitBtn">
              <i class="ri-save-line"></i>${isEdit ? 'حفظ التعديلات' : 'إضافة المستخدم'}
            </button>
            <button class="btn-cancel" id="us-cancelBtn">إلغاء</button>
          </div>
        `;
      }

      /* ────────────────────────────────────
         OPEN USER MODAL
      ──────────────────────────────────── */
      function openUserModal(id = null) {
        const u = id ? allUsers.find(x => x.id === id) : null;
        if (id && !u) { toast('المستخدم غير موجود', 'error'); return; }

        openModal(u ? 'تعديل بيانات المستخدم' : 'مستخدم جديد', buildUserForm(u));

        /* wire submit / cancel */
        document.getElementById('us-submitBtn').addEventListener('click', () => submitUserForm(id));
        document.getElementById('us-cancelBtn').addEventListener('click', closeModal);

        /* wire change-pw button (edit only) */
        const pwBtn = document.getElementById('us-changepw-btn');
        if (pwBtn) {
          pwBtn.addEventListener('click', () => {
            const uid   = parseInt(pwBtn.dataset.uid);
            const uname = pwBtn.dataset.uname;
            openPasswordModal(uid, uname);
          });
        }

        /* password eye toggle */
        const eye = document.getElementById('us-pw-eye');
        const pwField = document.getElementById('us-pw');
        if (eye && pwField) {
          eye.addEventListener('click', () => {
            const show = pwField.type === 'password';
            pwField.type = show ? 'text' : 'password';
            eye.innerHTML = `<i class="ri-eye${show ? '' : '-off'}-line"></i>`;
          });
          pwField.addEventListener('input', () => updatePwStrength(pwField.value));
        }

        /* status toggle live text */
        const cb  = document.getElementById('us-active');
        const txt = document.getElementById('us-status-text');
        if (cb && txt) {
          cb.addEventListener('change', () => {
            txt.innerHTML = buildStatusText(cb.checked);
          });
        }
      }

      /* ── password strength indicator ── */
      function updatePwStrength(pw) {
        let score = 0;
        if (pw.length >= 6)  score++;
        if (pw.length >= 10) score++;
        if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
        if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
        const bars = ['us-pb1','us-pb2','us-pb3','us-pb4'];
        const cls  = ['s1','s2','s3','s4'];
        bars.forEach((id, idx) => {
          const el = document.getElementById(id);
          if (!el) return;
          el.className = 'us-pw-bar' + (idx < score ? ` ${cls[score - 1]}` : '');
        });
      }

      /* ────────────────────────────────────
         SUBMIT USER FORM
      ──────────────────────────────────── */
      async function submitUserForm(id) {
        clearErrs();
        const fn   = v('us-fn');
        const ln   = v('us-ln');
        const em   = v('us-em');
        const pw   = v('us-pw');
        const role = v('us-role');
        const isEdit = id !== null && id !== undefined;

        let ok = true;
        if (!fn)  { showErr('us-err-fn',   'الاسم الأول مطلوب');          ok = false; }
        if (!ln)  { showErr('us-err-ln',   'اسم العائلة مطلوب');          ok = false; }
        if (!em)  { showErr('us-err-em',   'البريد الإلكتروني مطلوب');    ok = false; }
        else if (!/\S+@\S+\.\S+/.test(em)) { showErr('us-err-em', 'صيغة البريد غير صحيحة'); ok = false; }
        if (!isEdit) {
          if (!pw)         { showErr('us-err-pw', 'كلمة المرور مطلوبة');            ok = false; }
          else if (pw.length < 6) { showErr('us-err-pw', '6 أحرف على الأقل'); ok = false; }
        }
        if (!role) { showErr('us-err-role', 'الدور الوظيفي مطلوب'); ok = false; }
        if (!ok)   return;

        const ROLE_STRINGS = { '1':'Admin', '2':'BookingManager', '3':'SiteEngineer' };
        const payload = {
          firstName: fn,
          lastName:  ln,
          email:     em,
          role:      ROLE_STRINGS[role],
          roleId:    parseInt(role),
          isActive:  document.getElementById('us-active')?.checked ?? true,
        };
        if (!isEdit) payload.password = pw;

        setBusy('us-submitBtn', true);
        try {
          if (isEdit) await PUT(`/api/Users/${id}`, payload);
          else         await POST('/api/Users', payload);
          toast(isEdit ? 'تم تعديل بيانات المستخدم بنجاح' : 'تم إضافة المستخدم بنجاح');
          closeModal();
          await loadUsers();
        } catch (e) {
          const translated = translateError(e.message || '');
          const m          = (e.message || '').toLowerCase();
          if (m.includes('بريد') || m.includes('email') || m.includes('مسجل')) {
            showErr('us-err-em', translated);
          } else {
            toast(`فشل: ${translated}`, 'error');
          }
          setBusy('us-submitBtn', false, `<i class="ri-save-line"></i>${isEdit ? 'حفظ التعديلات' : 'إضافة المستخدم'}`);
        }
      }

      /* ────────────────────────────────────
         PASSWORD CHANGE MODAL
      ──────────────────────────────────── */
      function openPasswordModal(uid, uname) {
        openPwModal(`
          <div class="us-modal-body">
            <div style="margin-bottom:16px;padding:10px 14px;border-radius:10px;background:rgba(78,141,245,.08);border:1px solid rgba(78,141,245,.2);font-size:.82rem;color:var(--text-muted)">
              <i class="ri-user-line" style="color:var(--accent);margin-left:4px"></i>
              تغيير كلمة مرور: <strong style="color:var(--light)">${esc(uname)}</strong>
            </div>

            <div class="us-fg">
              <label class="us-fl">كلمة المرور الجديدة <span style="color:var(--danger)">*</span></label>
              <div class="us-pw-wrap">
                <input id="pw-new" class="us-fi" type="password" placeholder="6 أحرف على الأقل" autocomplete="new-password" style="padding-left:38px">
                <button type="button" class="us-pw-eye" id="pw-new-eye"><i class="ri-eye-off-line"></i></button>
              </div>
              <div class="us-pw-strength">
                <div class="us-pw-bar" id="pw-pb1"></div>
                <div class="us-pw-bar" id="pw-pb2"></div>
                <div class="us-pw-bar" id="pw-pb3"></div>
                <div class="us-pw-bar" id="pw-pb4"></div>
              </div>
              <div class="us-field-err" id="pw-err-new"><i class="ri-error-warning-line"></i><span></span></div>
            </div>

            <div class="us-fg">
              <label class="us-fl">تأكيد كلمة المرور <span style="color:var(--danger)">*</span></label>
              <div class="us-pw-wrap">
                <input id="pw-confirm" class="us-fi" type="password" placeholder="أعد كتابة كلمة المرور" autocomplete="new-password" style="padding-left:38px">
                <button type="button" class="us-pw-eye" id="pw-confirm-eye"><i class="ri-eye-off-line"></i></button>
              </div>
              <div class="us-field-err" id="pw-err-confirm"><i class="ri-error-warning-line"></i><span></span></div>
            </div>
          </div>
          <div class="us-modal-footer">
            <button class="btn-submit" id="pw-submit-btn">
              <i class="ri-key-2-line"></i>تغيير كلمة المرور
            </button>
            <button class="btn-cancel" id="pw-cancel-btn">إلغاء</button>
          </div>
        `);

        /* eye toggles */
        [['pw-new-eye', 'pw-new'], ['pw-confirm-eye', 'pw-confirm']].forEach(([eyeId, inputId]) => {
          document.getElementById(eyeId)?.addEventListener('click', () => {
            const inp  = document.getElementById(inputId);
            const show = inp.type === 'password';
            inp.type   = show ? 'text' : 'password';
            document.getElementById(eyeId).innerHTML = `<i class="ri-eye${show ? '' : '-off'}-line"></i>`;
          });
        });

        /* strength on new pw */
        document.getElementById('pw-new')?.addEventListener('input', e => {
          const pw  = e.target.value;
          let score = 0;
          if (pw.length >= 6)  score++;
          if (pw.length >= 10) score++;
          if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
          if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
          const cls = ['s1','s2','s3','s4'];
          ['pw-pb1','pw-pb2','pw-pb3','pw-pb4'].forEach((id, idx) => {
            const el = document.getElementById(id);
            if (el) el.className = 'us-pw-bar' + (idx < score ? ` ${cls[score - 1]}` : '');
          });
        });

        document.getElementById('pw-cancel-btn')?.addEventListener('click', closePwModal);
        document.getElementById('pw-submit-btn')?.addEventListener('click', () => submitPasswordChange(uid));
      }

      async function submitPasswordChange(uid) {
        /* clear pw-modal errors */
        ['pw-err-new','pw-err-confirm'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.classList.remove('show');
        });

        const newPw  = (document.getElementById('pw-new')?.value || '').trim();
        const confPw = (document.getElementById('pw-confirm')?.value || '').trim();

        let ok = true;
        if (!newPw)          { showErr('pw-err-new', 'كلمة المرور الجديدة مطلوبة'); ok = false; }
        else if (newPw.length < 6) { showErr('pw-err-new', '6 أحرف على الأقل'); ok = false; }
        if (!confPw)         { showErr('pw-err-confirm', 'تأكيد كلمة المرور مطلوب'); ok = false; }
        else if (ok && newPw !== confPw) { showErr('pw-err-confirm', 'كلمتا المرور غير متطابقتين'); ok = false; }
        if (!ok) return;

        setBusy('pw-submit-btn', true);
        try {
          await PUT(`/api/Users/${uid}/reset-password`, { newPassword: newPw });
          toast('تم تغيير كلمة المرور بنجاح');
          closePwModal();
        } catch (e) {
          toast(`فشل تغيير كلمة المرور: ${translateError(e.message)}`, 'error');
          setBusy('pw-submit-btn', false, '<i class="ri-key-2-line"></i>تغيير كلمة المرور');
        }
      }

      /* ────────────────────────────────────
         DELETE (confirm modal)
      ──────────────────────────────────── */
      function promptDeleteUser(id, name) {
        openConfirm('حذف المستخدم', `
          <div class="us-modal-body">
            <div class="confirm-box">
              <div class="confirm-icon">🗑️</div>
              <p class="confirm-msg">
                هل أنت متأكد من حذف المستخدم<br>
                <strong>${esc(name)}</strong>؟<br>
                <span style="font-size:.8rem">لا يمكن التراجع عن هذا الإجراء.</span>
              </p>
              <div class="confirm-actions">
                <button class="btn-danger" id="us-confirm-del-btn">
                  <i class="ri-delete-bin-line"></i>نعم، احذف
                </button>
                <button class="btn-cancel" id="us-confirm-cancel-btn">إلغاء</button>
              </div>
            </div>
          </div>
        `);
        document.getElementById('us-confirm-cancel-btn').addEventListener('click', closeConfirm);
        document.getElementById('us-confirm-del-btn').addEventListener('click', () => confirmDeleteUser(id));
      }

      async function confirmDeleteUser(id) {
        setBusy('us-confirm-del-btn', true);
        try {
          await DELETE(`/api/Users/${id}`);
          toast('تم حذف المستخدم بنجاح');
          closeConfirm();
          await loadUsers();
        } catch (e) {
          toast(`فشل الحذف: ${translateError(e.message)}`, 'error');
          setBusy('us-confirm-del-btn', false, '<i class="ri-delete-bin-line"></i>نعم، احذف');
        }
      }

      /* ────────────────────────────────────
         EVENT DELEGATION (table actions)
      ──────────────────────────────────── */
      document.getElementById('us-tbody').addEventListener('click', e => {
        const editBtn = e.target.closest('[data-edit]');
        const delBtn  = e.target.closest('[data-del]');
        if (editBtn) {
          openUserModal(parseInt(editBtn.dataset.edit));
        } else if (delBtn) {
          promptDeleteUser(parseInt(delBtn.dataset.del), delBtn.dataset.name);
        }
      });

      /* add button */
      document.getElementById('us-add-btn').addEventListener('click', () => openUserModal());

      /* ────────────────────────────────────
         SEARCH
      ──────────────────────────────────── */
      let searchTimer = null;
      document.getElementById('us-search').addEventListener('input', e => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
          searchQ = e.target.value.trim();
          renderUsers();
        }, 180);
      });

      /* ────────────────────────────────────
         FILTER PILLS
      ──────────────────────────────────── */
      document.querySelectorAll('.us-pill[data-role]').forEach(pill => {
        pill.addEventListener('click', () => {
          document.querySelectorAll('.us-pill[data-role]').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          filterRole = pill.dataset.role;
          renderUsers();
        });
      });

      document.querySelectorAll('.us-pill[data-status]').forEach(pill => {
        pill.addEventListener('click', () => {
          document.querySelectorAll('.us-pill[data-status]').forEach(p => {
            p.classList.remove('active', 'active-status', 'inactive-status');
          });
          const s = pill.dataset.status;
          filterStatus = s;
          if (s === 'all')      pill.classList.add('active');
          else if (s === 'active')   pill.classList.add('active-status');
          else if (s === 'inactive') pill.classList.add('inactive-status');
          renderUsers();
        });
      });

      /* set initial "all" pills active */
      document.querySelector('.us-pill[data-role="all"]')?.classList.add('active');
      document.querySelector('.us-pill[data-status="all"]')?.classList.add('active');

      /* ── BOOT ── */
      await loadUsers();
    }
  };
})();
