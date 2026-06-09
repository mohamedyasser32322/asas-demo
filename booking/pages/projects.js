/* PAGE MODULE: projects — SPA v3 (Admin) — PATCHED v2 */
(function () {
  window.__pages = window.__pages || {};

  const _css = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --border:rgba(var(--fg-rgb), 0.08); --light:#FFFFFF; --text-muted:#8fa3c0;
      --success:#34c759; --warning:#ff9500; --danger:#ff3b30; --accent:#4e8df5;
      --closed:#6b7a8d; --construction:#f59e0b; --completed:#34c759;
      --transition:all 0.25s cubic-bezier(0.4,0,0.2,1);
    }
    @keyframes spin    { to { transform:rotate(360deg); } }
    @keyframes fadeUp  { from { opacity:0;transform:translateY(16px); } to { opacity:1;transform:translateY(0); } }
    @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
    @keyframes scaleIn { from { opacity:0;transform:scale(.95); } to { opacity:1;transform:scale(1); } }
    @keyframes slideDown { from { opacity:0;transform:translateY(-8px); } to { opacity:1;transform:translateY(0); } }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
    ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:var(--primary-deep)}::-webkit-scrollbar-thumb{background:rgba(var(--fg-rgb), 0.12);border-radius:6px}

    .toolbar-wrapper{display:flex;align-items:center;justify-content:space-between;padding:14px 24px;background:rgba(var(--fg-rgb), 0.02);border-bottom:1px solid var(--border);margin-bottom:20px;border-radius:12px}
    #breadcrumb{display:flex;align-items:center;gap:8px;flex:1;font-size:0.83rem;color:var(--text-muted)}
    .bc-item{cursor:pointer;color:var(--accent);transition:opacity 0.2s}.bc-item:hover{opacity:.75}
    .bc-sep{opacity:.3}.bc-current{color:var(--light);font-weight:700}
    #addBtn{display:flex;align-items:center;gap:7px;padding:9px 20px;border-radius:10px;background:var(--accent);color:#fff;border:none;font-family:inherit;font-size:.88rem;font-weight:700;cursor:pointer;transition:var(--transition);white-space:nowrap}
    #addBtn:hover{background:#3a7de4;transform:translateY(-1px);box-shadow:0 6px 20px rgba(78,141,245,.35)}

    .search-container{display:flex;justify-content:center;margin:0 0 20px;width:100%}
    .search-wrap{position:relative;display:flex;align-items:center;width:100%;max-width:480px}
    .search-input{background:rgba(var(--fg-rgb), .06);border:1.5px solid var(--border);color:var(--light);font-family:inherit;font-size:.95rem;padding:12px 46px 12px 16px;border-radius:12px;width:100%;transition:var(--transition)}
    .search-input:focus{outline:none;background:rgba(var(--fg-rgb), .1);border-color:var(--accent);box-shadow:0 0 0 3px rgba(78,141,245,.12)}
    .search-input::placeholder{color:var(--text-muted)}.search-icon{position:absolute;left:14px;color:var(--text-muted);font-size:1.15rem;pointer-events:none}

    #filterBar{display:none;gap:10px;flex-wrap:wrap;margin-bottom:20px;align-items:center;padding:14px 18px;background:rgba(var(--bg-rgb),.55);border:1px solid rgba(var(--fg-rgb), .09);border-radius:16px}
    .filter-section-label{font-size:.72rem;color:var(--text-muted);font-weight:700;white-space:nowrap;letter-spacing:.5px}
    .filter-divider{width:1px;height:26px;background:rgba(var(--fg-rgb), .1);margin:0 6px;flex-shrink:0}
    .filter-select-sm{height:34px;background:rgba(var(--fg-rgb), .06);color:var(--light);border:1px solid rgba(var(--fg-rgb), .12);padding:0 10px 0 28px;border-radius:9px;cursor:pointer;font-family:inherit;font-weight:600;font-size:.82rem;outline:none;appearance:none;-webkit-appearance:none;background-image:url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238fa3c0' stroke-width='2.5'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");background-repeat:no-repeat;background-position:left 7px center;background-size:11px;color-scheme:dark;min-width:110px;transition:border-color .2s}
    .filter-select-sm:focus{border-color:rgba(78,141,245,.5)}
    .filter-select-sm option{background:var(--primary)}
    .filter-price-wrap{display:flex;align-items:center;gap:6px}
    .filter-price-input{height:34px;width:110px;background:rgba(var(--fg-rgb), .06);color:var(--light);border:1px solid rgba(var(--fg-rgb), .12);padding:0 10px;border-radius:9px;font-family:inherit;font-size:.82rem;font-weight:600;outline:none;transition:border-color .2s;-moz-appearance:textfield}
    .filter-price-input::-webkit-outer-spin-button,.filter-price-input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
    .filter-price-input:focus{border-color:rgba(78,141,245,.5)}
    .filter-price-input::placeholder{color:var(--text-muted);font-weight:400}
    .filter-price-sep{color:var(--text-muted);font-size:.78rem;white-space:nowrap}
    .filter-clear-btn{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:8px;background:rgba(255,59,48,.08);color:var(--danger);border:1px solid rgba(255,59,48,.25);font-family:inherit;font-size:.75rem;font-weight:700;cursor:pointer;transition:var(--transition);white-space:nowrap}
    .filter-clear-btn:hover{background:rgba(255,59,48,.18)}
    #projFilterBar{display:none;gap:10px;flex-wrap:wrap;margin-bottom:18px;align-items:center;padding:12px 18px;background:rgba(var(--bg-rgb),.55);border:1px solid rgba(var(--fg-rgb), .09);border-radius:16px}
    .pill{padding:6px 14px;border-radius:20px;background:rgba(var(--fg-rgb), .05);border:1px solid var(--border);color:var(--text-muted);font-family:inherit;font-size:.8rem;font-weight:600;cursor:pointer;transition:var(--transition);white-space:nowrap}
    .pill:hover{background:rgba(var(--fg-rgb), .09);color:var(--light)}
    .pill.active{background:rgba(var(--fg-rgb), .1);border-color:rgba(var(--fg-rgb), .25);color:var(--light)}
    .pill.p-avail.active{background:rgba(52,199,89,.13);border-color:var(--success);color:var(--success)}
    .pill.p-resrv.active{background:rgba(255,149,0,.12);border-color:var(--warning);color:var(--warning)}
    .pill.p-sold.active{background:rgba(255,59,48,.13);border-color:var(--danger);color:var(--danger)}
    .pill.p-closed.active{background:rgba(107,122,141,.15);border-color:var(--closed);color:var(--closed)}

    .sel-toggle{display:none;align-items:center;gap:6px;padding:8px 14px;border-radius:9px;background:rgba(var(--fg-rgb), .05);border:1px solid var(--border);color:var(--text-muted);font-family:inherit;font-size:.84rem;font-weight:700;cursor:pointer;transition:var(--transition);white-space:nowrap}
    .sel-toggle:hover{background:rgba(var(--fg-rgb), .09);color:var(--light)}
    .sel-toggle.active{background:rgba(78,141,245,.15);border-color:var(--accent);color:var(--accent)}
    #bulk-bar{display:none;position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:500;background:var(--card-bg);border:1px solid rgba(78,141,245,.35);border-radius:14px;padding:12px 18px;backdrop-filter:blur(16px);box-shadow:0 8px 32px rgba(0,0,0,.5);align-items:center;gap:10px;flex-wrap:wrap;min-width:300px;animation:slideDown .25s ease}
    #bulk-bar.show{display:flex}
    .bulk-count{font-size:.88rem;font-weight:800;color:var(--light);white-space:nowrap}
    .bulk-lbl{font-size:.78rem;color:var(--text-muted);white-space:nowrap}
    .bulk-st-btn{padding:7px 13px;border-radius:8px;font-family:inherit;font-size:.8rem;font-weight:700;cursor:pointer;border:1px solid;transition:var(--transition);white-space:nowrap}
    .bulk-st-btn.avail{background:rgba(52,199,89,.12);color:var(--success);border-color:rgba(52,199,89,.35)}.bulk-st-btn.avail:hover{background:rgba(52,199,89,.25)}
    .bulk-st-btn.resrv{background:rgba(255,149,0,.12);color:var(--warning);border-color:rgba(255,149,0,.35)}.bulk-st-btn.resrv:hover{background:rgba(255,149,0,.25)}
    .bulk-st-btn.sold{background:rgba(255,59,48,.12);color:var(--danger);border-color:rgba(255,59,48,.35)}.bulk-st-btn.sold:hover{background:rgba(255,59,48,.25)}
    .bulk-st-btn.closed{background:rgba(107,122,141,.12);color:var(--closed);border-color:rgba(107,122,141,.35)}.bulk-st-btn.closed:hover{background:rgba(107,122,141,.25)}
    .bulk-cancel{padding:7px 13px;border-radius:8px;font-family:inherit;font-size:.8rem;font-weight:700;cursor:pointer;border:1px solid var(--border);background:rgba(var(--fg-rgb), .05);color:var(--text-muted);transition:var(--transition)}.bulk-cancel:hover{color:var(--light)}
    .bulk-apply-btn{display:inline-flex;align-items:center;gap:4px;padding:5px 10px;border-radius:7px;font-family:inherit;font-size:.76rem;font-weight:700;cursor:pointer;border:1px solid rgba(78,141,245,.35);background:rgba(78,141,245,.12);color:var(--accent);transition:var(--transition);white-space:nowrap}.bulk-apply-btn:hover{background:rgba(78,141,245,.25)}
    .bulk-divider{width:1px;height:24px;background:rgba(var(--fg-rgb), .1);flex-shrink:0}
    .bulk-sel-all,.bulk-desel-all{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:7px;font-family:inherit;font-size:.76rem;font-weight:700;cursor:pointer;transition:var(--transition);border:1px solid;white-space:nowrap}
    .bulk-sel-all{background:rgba(78,141,245,.12);color:var(--accent);border-color:rgba(78,141,245,.35)}.bulk-sel-all:hover{background:rgba(78,141,245,.25)}
    .bulk-desel-all{background:rgba(var(--fg-rgb), .05);color:var(--text-muted);border-color:var(--border)}.bulk-desel-all:hover{background:rgba(var(--fg-rgb), .1);color:var(--light)}
    .unit-box.selecting{cursor:default}
    .unit-box.sel-on:hover{transform:scale(1.03)}
    .u-chk{position:absolute;top:6px;right:6px;width:18px;height:18px;border-radius:5px;border:1.5px solid rgba(var(--fg-rgb), .2);background:rgba(var(--bg-rgb),.7);display:none;align-items:center;justify-content:center;transition:var(--transition)}
    .sel-mode .u-chk{display:flex}
    .unit-box.selected-unit .u-chk{background:var(--accent);border-color:var(--accent)}
    .unit-box.selected-unit{outline:2px solid var(--accent);outline-offset:2px}
    .bwiz-preview{margin-top:14px;padding:11px 14px;border-radius:9px;background:rgba(78,141,245,.07);border:1px solid rgba(78,141,245,.2);font-size:.83rem;color:var(--text-muted);display:flex;align-items:center;gap:8px}
    .bwiz-preview i{color:var(--accent);font-size:1rem}
    .bwiz-preview strong{color:var(--light)}

    .wiz-header{display:flex;align-items:center;justify-content:center;gap:0;padding:16px 26px 14px;border-bottom:1px solid rgba(var(--fg-rgb), .07);background:rgba(var(--fg-rgb), .01)}
    .wiz-dot{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.78rem;font-weight:800;transition:all .3s ease;flex-shrink:0;border:2px solid transparent}
    .wiz-dot.done{background:var(--success);color:var(--light);border-color:var(--success)}
    .wiz-dot.active{background:var(--accent);color:#fff;border-color:var(--accent);box-shadow:0 0 14px rgba(78,141,245,.4)}
    .wiz-dot.pending{background:rgba(var(--fg-rgb), .06);color:var(--text-muted);border-color:rgba(var(--fg-rgb), .1)}
    .wiz-lbl{font-size:.7rem;color:var(--text-muted);margin-top:4px;white-space:nowrap;text-align:center}
    .wiz-dot-wrap{display:flex;flex-direction:column;align-items:center;gap:0}
    .wiz-dot-wrap .wiz-lbl.active{color:var(--accent)}
    .wiz-dot-wrap .wiz-lbl.done{color:var(--success)}
    .wiz-line{flex:1;height:2px;border-radius:2px;margin:0 8px;margin-bottom:14px;transition:background .35s ease;max-width:80px}
    .wiz-line.pending{background:rgba(var(--fg-rgb), .08)}
    .wiz-line.done{background:var(--success)}
    .wiz-bld-card{border:1px solid rgba(255,149,0,.2);border-radius:12px;background:rgba(255,149,0,.025);overflow:hidden;transition:border-color .2s}
    .wiz-bld-card:hover{border-color:rgba(255,149,0,.35)}
    .wiz-bld-card-header{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(255,149,0,.05);border-bottom:1px solid rgba(255,149,0,.12)}
    .wiz-bld-title{font-size:.85rem;font-weight:700;color:var(--warning);display:flex;align-items:center;gap:6px}
    .wiz-bld-letter{background:rgba(255,149,0,.12);color:var(--warning);border:1px solid rgba(255,149,0,.35);border-radius:7px;padding:3px 10px;font-family:inherit;font-size:.95rem;font-weight:800;cursor:pointer;outline:none;color-scheme:dark;transition:var(--transition)}
    .wiz-bld-letter:hover{background:rgba(255,149,0,.2)}
    .wiz-bld-del{width:26px;height:26px;border-radius:6px;border:1px solid rgba(255,59,48,.3);background:rgba(255,59,48,.06);color:var(--danger);cursor:pointer;font-size:.85rem;display:flex;align-items:center;justify-content:center;transition:var(--transition);padding:0}
    .wiz-bld-del:hover{background:rgba(255,59,48,.2);border-color:var(--danger)}
    #wiz-bld-list:has(.wiz-bld-card:only-child) .wiz-bld-del{display:none!important}
    .wiz-bld-card-body{padding:13px 14px;display:flex;flex-direction:column;gap:10px}
    .wiz-bld-summary{font-size:.74rem;color:var(--text-muted);padding:6px 10px;border-radius:7px;background:rgba(var(--fg-rgb), .03);border:1px solid rgba(var(--fg-rgb), .06)}
    .wiz-bld-summary strong{color:var(--light)}
    .wiz-add-bld-btn{width:100%;padding:12px;border-radius:10px;background:rgba(78,141,245,.04);border:1.5px dashed rgba(78,141,245,.3);color:rgba(78,141,245,.65);font-family:inherit;font-size:.84rem;font-weight:700;cursor:pointer;transition:var(--transition);margin-top:4px;display:flex;align-items:center;justify-content:center;gap:7px}
    .wiz-add-bld-btn:hover:not(:disabled){background:rgba(78,141,245,.12);border-color:var(--accent);color:var(--accent);transform:translateY(-1px)}
    .wiz-add-bld-btn:disabled{opacity:.35;cursor:not-allowed}
    .wiz-total-bar{display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:9px;background:rgba(52,199,89,.06);border:1px solid rgba(52,199,89,.2);font-size:.82rem;color:var(--text-muted);margin-top:6px}
    .wiz-total-bar i{color:var(--success)}
    .wiz-total-bar strong{color:var(--success)}
    .wiz-roof-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
    .wiz-roof-inp{width:70px;padding:5px 8px;border-radius:7px;background:rgba(var(--fg-rgb), .04);border:1.5px solid rgba(155,89,182,.3);color:var(--light);font-family:inherit;font-size:.82rem;outline:none;transition:all .2s;display:inline-block}
    .wiz-roof-inp:focus{border-color:#9b59b6;background:rgba(var(--fg-rgb), .07)}


    .loader-box{display:flex;align-items:center;justify-content:center;min-height:380px}
    .spinner{width:44px;height:44px;border:3px solid rgba(var(--fg-rgb), .08);border-top-color:var(--accent);border-radius:50%;animation:spin .75s linear infinite}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}
    .empty-msg{text-align:center;padding:60px 20px;color:var(--text-muted);font-size:.95rem}
    .empty-msg i{font-size:2.5rem;display:block;margin-bottom:12px;opacity:.35}

    .p-card{background:var(--card-bg);border:1px solid var(--border);border-radius:16px;cursor:pointer;opacity:0;animation:fadeUp .4s ease forwards;transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease;position:relative;overflow:hidden}
    .p-card-ribbon{height:3px;background:linear-gradient(90deg,var(--accent),#7ab3ff);border-radius:16px 16px 0 0}
    .p-card-ribbon.under{background:linear-gradient(90deg,var(--construction),#fcd34d)}
    .p-card-ribbon.completed{background:linear-gradient(90deg,var(--success),#6ee7a0)}
    .p-card-body{padding:18px 22px 20px}
    .p-card:hover{transform:translateY(-5px) scale(1.02);border-color:rgba(78,141,245,.35);box-shadow:0 20px 40px rgba(var(--bg-rgb),.5)}
    .p-card-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px}
    .p-card-title-wrap{flex:1}
    .p-card-title{font-size:1.05rem;font-weight:800;color:var(--light)}
    .p-card-actions{display:flex;gap:5px;opacity:0;transition:opacity .2s ease}
    .p-card:hover .p-card-actions{opacity:1}
    .icon-btn{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;border:1px solid var(--border);background:rgba(var(--fg-rgb), .04);color:var(--text-muted);cursor:pointer;font-size:.85rem;transition:var(--transition)}
    .icon-btn.edit:hover{background:rgba(78,141,245,.18);color:var(--accent);border-color:var(--accent)}
    .icon-btn.del:hover{background:rgba(255,59,48,.18);color:var(--danger);border-color:var(--danger)}
    .p-card-loc{font-size:.8rem;color:var(--text-muted);margin-bottom:8px;display:flex;align-items:center;gap:4px}

    .p-card-status-row{display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap}
    .p-status-badge{display:inline-flex;align-items:center;gap:5px;font-size:.7rem;font-weight:700;padding:4px 10px;border-radius:20px;white-space:nowrap}
    .p-status-badge.under{background:rgba(245,158,11,.12);color:var(--construction);border:1px solid rgba(245,158,11,.3)}
    .p-status-badge.completed{background:rgba(52,199,89,.12);color:var(--completed);border:1px solid rgba(52,199,89,.3)}
    .p-delivery-badge{display:inline-flex;align-items:center;gap:4px;font-size:.68rem;color:var(--text-muted);background:rgba(var(--fg-rgb), .04);border:1px solid var(--border);padding:4px 9px;border-radius:20px}

    .p-card-stats{display:flex;justify-content:space-between;border-top:1px solid var(--border);padding-top:13px}
    .ps-box{text-align:center;flex:1}
    .ps-num{font-weight:800;font-size:1rem;margin-bottom:2px;font-variant-numeric:tabular-nums;direction:ltr;display:block}
    .ps-lbl{font-size:.62rem;text-transform:uppercase;letter-spacing:.5px}
    .ps-total .ps-num{color:var(--light)}.ps-total .ps-lbl{color:var(--text-muted)}
    .ps-avail .ps-num{color:var(--success)}.ps-avail .ps-lbl{color:var(--success)}
    .ps-resrv .ps-num{color:var(--warning)}.ps-resrv .ps-lbl{color:var(--warning)}
    .ps-sold  .ps-num{color:var(--danger)}.ps-sold  .ps-lbl{color:var(--danger)}
    .ps-closed .ps-num{color:var(--closed)}.ps-closed .ps-lbl{color:var(--closed)}
    .p-card-footer{display:flex;align-items:center;justify-content:space-between;margin-top:13px;padding-top:11px;border-top:1px solid var(--border)}
    .p-card-date{font-size:.73rem;color:var(--text-muted)}

    .b-card{background:var(--card-bg);border:1px solid var(--border);border-radius:16px;cursor:pointer;opacity:0;animation:fadeUp .4s ease forwards;transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease;position:relative;overflow:hidden}
    .b-card-ribbon{height:3px;background:linear-gradient(90deg,var(--warning),#ffd966);border-radius:16px 16px 0 0}
    .b-card-body{padding:18px 22px 20px}
    .b-card:hover{transform:translateY(-5px) scale(1.02);border-color:rgba(255,149,0,.35);box-shadow:0 20px 40px rgba(var(--bg-rgb),.5)}
    .b-card-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px}
    .b-card-title-wrap{flex:1;min-width:0}
    .b-card-name-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:2px}
    .b-card-code{display:inline-flex;align-items:center;font-size:.88rem;font-weight:800;padding:4px 12px;border-radius:8px;background:rgba(255,149,0,.12);color:var(--warning);border:1px solid rgba(255,149,0,.3);letter-spacing:.5px;white-space:nowrap;flex-shrink:0}
    .b-card-actions{display:flex;gap:5px;opacity:0;transition:opacity .2s ease;flex-shrink:0;margin-right:4px}
    .b-card:hover .b-card-actions{opacity:1}

    .b-card-warranty{display:flex;align-items:center;gap:8px;margin-top:12px;padding:9px 13px;border-radius:9px;background:rgba(var(--fg-rgb), .03);border:1px solid rgba(var(--fg-rgb), .08);color:var(--text-muted);font-size:.75rem;cursor:pointer;transition:var(--transition)}
    .b-card-warranty:hover{background:rgba(78,141,245,.06);border-color:rgba(78,141,245,.3);color:var(--light)}
    .b-card-warranty i.w-icon{font-size:.95rem;color:var(--text-muted);transition:color .2s;flex-shrink:0}
    .b-card-warranty:hover i.w-icon{color:var(--accent)}
    .b-card-warranty .w-label{flex:1;font-weight:600}
    .b-card-warranty .w-count-badge{display:inline-flex;align-items:center;gap:4px;font-size:.68rem;padding:3px 8px;border-radius:6px;background:rgba(78,141,245,.15);color:var(--accent);border:1px solid rgba(78,141,245,.3);font-weight:700;white-space:nowrap}
    .b-card-warranty .w-count-badge i{font-size:.7rem}
    .b-card-warranty .w-upload-hint{font-size:.68rem;color:rgba(139,163,192,.55);font-style:italic}
    .b-card-warranty .w-arrow{font-size:.85rem;opacity:.4;transition:opacity .2s,transform .2s}
    .b-card-warranty:hover .w-arrow{opacity:.8;transform:translateX(-2px)}

    .wdocs-list{display:flex;flex-direction:column;gap:8px;margin-bottom:16px;max-height:300px;overflow-y:auto}
    .wdoc-item{display:flex;align-items:center;gap:10px;padding:11px 13px;border-radius:10px;background:rgba(var(--fg-rgb), .04);border:1px solid var(--border);transition:var(--transition)}
    .wdoc-item:hover{background:rgba(var(--fg-rgb), .07)}
    .wdoc-icon{width:36px;height:36px;border-radius:8px;background:rgba(255,59,48,.12);border:1px solid rgba(255,59,48,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .wdoc-icon i{color:#ff6b6b;font-size:1.1rem}
    .wdoc-info{flex:1;min-width:0}
    .wdoc-name{font-size:.82rem;font-weight:700;color:var(--light);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .wdoc-meta{font-size:.68rem;color:var(--text-muted);margin-top:2px}
    .wdoc-actions{display:flex;gap:5px;flex-shrink:0}
    .wdoc-btn{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;border:1px solid var(--border);background:rgba(var(--fg-rgb), .04);color:var(--text-muted);cursor:pointer;font-size:.85rem;transition:var(--transition);text-decoration:none}
    .wdoc-btn.view:hover{background:rgba(78,141,245,.15);color:var(--accent);border-color:var(--accent)}
    .wdoc-btn.download:hover{background:rgba(52,199,89,.15);color:var(--success);border-color:var(--success)}
    .wdoc-btn.del:hover{background:rgba(255,59,48,.15);color:var(--danger);border-color:var(--danger)}
    .wdocs-empty{text-align:center;padding:28px 16px;color:var(--text-muted);font-size:.82rem}
    .wdocs-empty i{font-size:2rem;display:block;margin-bottom:10px;opacity:.3}

    .wpdf-viewer{display:none;margin-top:12px;border-radius:10px;overflow:hidden;border:1px solid var(--border);background:#000}
    .wpdf-viewer iframe{width:100%;height:420px;border:none;display:block}
    .wpdf-viewer-header{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:rgba(var(--fg-rgb), .04);border-bottom:1px solid var(--border)}
    .wpdf-viewer-title{font-size:.78rem;font-weight:600;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .wpdf-close-btn{width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;border:1px solid var(--border);background:none;color:var(--text-muted);cursor:pointer;font-size:.8rem;flex-shrink:0;transition:var(--transition)}
    .wpdf-close-btn:hover{background:rgba(255,59,48,.15);color:var(--danger);border-color:var(--danger)}

    .wupload-zone{border:2px dashed rgba(78,141,245,.3);border-radius:12px;padding:28px 20px;text-align:center;cursor:pointer;background:rgba(78,141,245,.03);transition:var(--transition);position:relative}
    .wupload-zone:hover,.wupload-zone.drag-over{background:rgba(78,141,245,.08);border-color:rgba(78,141,245,.6)}
    .wupload-zone input[type=file]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
    .wupload-zone .wdz-icon{font-size:2rem;color:rgba(78,141,245,.5);margin-bottom:8px}
    .wupload-zone .wdz-title{font-size:.88rem;font-weight:700;color:var(--text-muted);margin-bottom:4px}
    .wupload-zone .wdz-sub{font-size:.73rem;color:rgba(139,163,192,.6)}
    .wupload-selected{display:flex;align-items:center;gap:8px;padding:10px 13px;border-radius:9px;background:rgba(52,199,89,.08);border:1px solid rgba(52,199,89,.25);margin-top:10px;font-size:.8rem;color:var(--success);display:none}
    .wupload-selected i{font-size:.9rem}
    .wupload-desc{margin-top:10px}
    .wupload-progress{margin-top:10px;display:none}
    .wupload-progress-bar{height:4px;background:rgba(var(--fg-rgb), .08);border-radius:4px;overflow:hidden}
    .wupload-progress-fill{height:100%;background:var(--accent);border-radius:4px;width:0;transition:width .3s ease;animation:pulse 1s infinite}

    .floor-map{display:flex;flex-direction:column;gap:16px}
    .floor-row{background:var(--card-bg);border:1px solid var(--border);border-radius:14px;overflow:hidden;opacity:0;animation:fadeUp .4s ease forwards}
    .floor-row.is-roof{border-color:rgba(155,89,182,.3)}
    .floor-header{display:flex;align-items:center;justify-content:space-between;padding:12px 18px;background:rgba(var(--fg-rgb), .025);border-bottom:1px solid var(--border)}
    .floor-lbl{font-size:.9rem;font-weight:800;color:var(--light);display:flex;align-items:center;gap:8px}
    .floor-lbl::before{content:'';display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--accent)}
    .floor-row.is-roof .floor-lbl::before{background:#9b59b6}
    .roof-badge{font-size:.65rem;padding:2px 7px;border-radius:5px;background:rgba(155,89,182,.2);color:#c39bd3;border:1px solid rgba(155,89,182,.3);font-weight:700}
    .floor-count{font-size:.73rem;color:var(--text-muted);background:rgba(var(--fg-rgb), .05);padding:3px 10px;border-radius:20px;font-variant-numeric:tabular-nums;direction:ltr}
    .units-wrap{display:flex;flex-wrap:wrap;gap:12px;padding:16px 20px;direction:rtl;justify-content:flex-start;align-items:stretch}

    .unit-box{flex:0 0 158px;width:158px;height:130px;border-radius:16px;cursor:pointer;border:2px solid rgba(var(--fg-rgb), .1);background:rgba(var(--fg-rgb), .03);transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease;position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:14px 10px 12px;text-align:center}
    .u-num{font-weight:900;font-size:1.35rem;line-height:1;font-variant-numeric:tabular-nums;direction:ltr;margin-bottom:2px}
    .u-status-badge{display:inline-block;padding:4px 16px;border-radius:20px;font-size:.72rem;font-weight:700;white-space:nowrap}
    .u-type-lbl{font-size:.7rem;color:var(--text-muted);margin-top:1px;font-weight:600}
    .u-client-row{font-size:.63rem;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:flex;align-items:center;gap:3px;max-width:130px}
    .u-client-row i{font-size:.65rem;flex-shrink:0}
    .u-price-lbl{font-size:.62rem;color:var(--text-muted);direction:ltr;font-variant-numeric:tabular-nums}
    /* legacy — kept for detail modal compat */
    .u-type-badge{display:inline-block;font-size:.6rem;padding:2px 7px;border-radius:20px;font-weight:700;white-space:nowrap;line-height:1.4}
    .u-type-apt{background:rgba(78,141,245,.15);color:rgba(120,170,255,.9);border:1px solid rgba(78,141,245,.3)}
    .u-type-roof{background:rgba(155,89,182,.2);color:#c39bd3;border:1px solid rgba(155,89,182,.35)}
    .u-info-row{display:flex;align-items:center;gap:4px;font-size:.7rem;color:var(--text-muted);margin-bottom:3px}
    .u-info-row i{font-size:.72rem}
    .u-facing-row{display:flex;align-items:center;gap:4px;font-size:.68rem;color:var(--text-muted);margin-bottom:2px}
    .u-facing-row i{font-size:.7rem}

    .unit-box.st-available{border-color:rgba(52,199,89,.45);background:rgba(52,199,89,.09)}
    .unit-box.st-available .u-num{color:var(--success)}
    .unit-box.st-available .u-status-badge{background:rgba(52,199,89,.18);color:var(--success);border:1px solid rgba(52,199,89,.35)}
    .unit-box.st-available:hover{border-color:var(--success);transform:scale(1.06);box-shadow:0 10px 28px rgba(52,199,89,.22)}
    .unit-box.st-reserved{border-color:rgba(255,149,0,.45);background:rgba(255,149,0,.09)}
    .unit-box.st-reserved .u-num{color:var(--warning)}
    .unit-box.st-reserved .u-status-badge{background:rgba(255,149,0,.18);color:var(--warning);border:1px solid rgba(255,149,0,.35)}
    .unit-box.st-reserved:hover{border-color:var(--warning);transform:scale(1.06);box-shadow:0 10px 28px rgba(255,149,0,.2)}
    .unit-box.st-sold{border-color:rgba(255,59,48,.45);background:rgba(255,59,48,.09)}
    .unit-box.st-sold .u-num{color:var(--danger)}
    .unit-box.st-sold .u-status-badge{background:rgba(255,59,48,.18);color:var(--danger);border:1px solid rgba(255,59,48,.35)}
    .unit-box.st-sold:hover{border-color:var(--danger);transform:scale(1.06);box-shadow:0 10px 28px rgba(255,59,48,.2)}
    .unit-box.st-closed{border-color:rgba(107,122,141,.3);background:rgba(107,122,141,.06)}
    .unit-box.st-closed .u-num{color:var(--text-muted)}
    .unit-box.st-closed .u-status-badge{background:rgba(107,122,141,.14);color:var(--text-muted);border:1px solid rgba(107,122,141,.25)}
    .unit-box.st-closed:hover{border-color:var(--closed);transform:scale(1.04);box-shadow:0 6px 18px rgba(0,0,0,.18)}

    .u-actions{position:absolute;top:5px;left:5px;display:flex;gap:3px;opacity:0;transform:scale(.85);transition:opacity .18s,transform .18s}
    .unit-box:hover .u-actions{opacity:1;transform:scale(1)}
    .u-icon-btn{width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(var(--fg-rgb), .12);background:rgba(var(--bg-rgb),.75);color:var(--light);cursor:pointer;font-size:.72rem;transition:var(--transition);padding:0}
    .u-icon-btn.edit:hover{background:rgba(78,141,245,.5);color:var(--accent);border-color:var(--accent)}
    .u-icon-btn.del:hover{background:rgba(255,59,48,.5);color:var(--danger);border-color:var(--danger)}

    .floor-add-btn{flex:1 1 110px;max-width:150px;min-height:100px;padding:12px 10px;border-radius:11px;background:rgba(78,141,245,.06);border:1.5px dashed rgba(78,141,245,.35);color:rgba(78,141,245,.65);font-family:inherit;font-size:.8rem;font-weight:700;cursor:pointer;transition:var(--transition);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}
    .floor-add-btn i{font-size:1rem}
    .floor-add-btn:hover{background:rgba(78,141,245,.14);border-color:var(--accent);color:var(--accent);transform:scale(1.03)}
    .legend{display:flex;gap:14px;flex-wrap:wrap;padding:9px 18px;border-top:1px solid var(--border);background:rgba(var(--fg-rgb), .01)}
    .legend-item{display:flex;align-items:center;gap:5px;font-size:.72rem;color:var(--text-muted);font-variant-numeric:tabular-nums}
    .legend-dot{width:7px;height:7px;border-radius:50%}

    #pagination{display:flex;justify-content:center;gap:7px;margin-top:28px}
    .pg-btn{padding:7px 13px;border-radius:8px;background:rgba(var(--fg-rgb), .05);border:1px solid var(--border);color:var(--text-muted);font-family:inherit;font-size:.84rem;font-weight:600;cursor:pointer;transition:var(--transition)}
    .pg-btn:hover:not(:disabled){background:rgba(var(--fg-rgb), .1);color:var(--light)}.pg-btn.active{background:var(--accent);color:#fff;border-color:var(--accent)}.pg-btn:disabled{opacity:.35;cursor:not-allowed}

    #proj-modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:1000;align-items:center;justify-content:center;backdrop-filter:blur(5px)}
    .modal-content{background:var(--card-bg);backdrop-filter:blur(20px);border:1px solid rgba(var(--fg-rgb), .1);border-radius:18px;max-width:500px;width:92%;max-height:90vh;overflow-y:auto;box-shadow:0 24px 48px rgba(0,0,0,.45);animation:scaleIn .25s cubic-bezier(0.34,1.56,0.64,1)}
    .modal-wide{max-width:580px}
    .modal-header{padding:24px 26px 18px;border-bottom:1px solid rgba(var(--fg-rgb), .08);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:var(--card-bg);z-index:2}
    #proj-modal-title{font-size:1.15rem;font-weight:800;color:var(--light)}
    .modal-close{background:none;border:none;color:var(--text-muted);font-size:1.35rem;cursor:pointer;transition:all .25s}
    .modal-close:hover{color:var(--light);transform:rotate(90deg)}
    .modal-body{padding:24px 26px}
    .modal-footer{padding:18px 26px;border-top:1px solid rgba(var(--fg-rgb), .08);display:flex;gap:10px;justify-content:flex-end;background:rgba(0,0,0,.15);position:sticky;bottom:0;border-radius:0 0 18px 18px}

    .form-group{margin-bottom:15px}.form-label{display:block;font-size:.86rem;font-weight:700;margin-bottom:7px;color:var(--light)}
    .form-input,.form-select{width:100%;padding:11px 13px;border-radius:9px;background:rgba(var(--fg-rgb), .04);border:1.5px solid rgba(var(--fg-rgb), .1);color:#dde8ff;font-family:inherit;font-size:.88rem;transition:all .22s}
    .form-select{appearance:none;cursor:pointer;color-scheme:dark;color:#dde8ff;background-image:url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");background-repeat:no-repeat;background-position:right 10px center;background-size:16px;padding-right:36px}
    .form-select option{background:var(--primary);color:#dde8ff}
    .form-input:focus,.form-select:focus{outline:none;background:rgba(var(--fg-rgb), .08);border-color:var(--accent);box-shadow:0 0 0 3px rgba(78,141,245,.13)}
    .form-row{display:grid;grid-template-columns:1fr 1fr;gap:11px}
    .form-error{font-size:.75rem;color:var(--danger);margin-top:4px;display:none}
    .form-hint{font-size:.72rem;color:var(--text-muted);margin-top:4px}
    .delivery-section{margin-top:4px;display:none}

    .client-search-wrap{position:relative;margin-bottom:12px}
    .client-search-input{width:100%;padding:10px 36px 10px 12px;border-radius:9px;background:rgba(var(--fg-rgb), .04);border:1.5px solid rgba(var(--fg-rgb), .1);color:var(--light);font-family:inherit;font-size:.88rem;transition:all .22s}
    .client-search-input:focus{outline:none;border-color:var(--accent);background:rgba(var(--fg-rgb), .08)}
    .client-search-icon{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text-muted);font-size:1rem;pointer-events:none}
    .client-list{max-height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:6px}
    .client-item{display:flex;align-items:center;gap:12px;padding:10px 13px;border-radius:9px;border:1.5px solid var(--border);cursor:pointer;transition:var(--transition)}
    .client-item:hover{background:rgba(78,141,245,.08);border-color:rgba(78,141,245,.3)}
    .client-item.selected{background:rgba(78,141,245,.15);border-color:var(--accent)}
    .client-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#4e8df5,#3a7de4);display:flex;align-items:center;justify-content:center;font-size:.85rem;font-weight:800;color:#fff;flex-shrink:0}
    .client-info-name{font-size:.88rem;font-weight:700;color:var(--light)}
    .client-info-sub{font-size:.72rem;color:var(--text-muted)}
    .client-empty{text-align:center;padding:24px;color:var(--text-muted);font-size:.85rem}
    .client-picker-label{font-size:.82rem;font-weight:700;color:var(--light);margin-bottom:8px;display:flex;align-items:center;gap:6px}
    .client-picker-label i{color:var(--accent)}

    .status-badge{display:inline-block;padding:5px 12px;border-radius:8px;font-size:.78rem;font-weight:700}
    .sb-available{background:rgba(52,199,89,.18);color:var(--success)}.sb-reserved{background:rgba(255,149,0,.14);color:var(--warning)}
    .sb-sold{background:rgba(255,59,48,.18);color:var(--danger)}.sb-closed{background:rgba(107,122,141,.15);color:var(--closed)}
    .unit-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .ud-block{background:rgba(var(--fg-rgb), .04);padding:12px;border-radius:9px}
    .ud-label{font-size:.73rem;color:var(--text-muted);margin-bottom:4px}.ud-value{font-size:.97rem;font-weight:700;color:var(--light);font-variant-numeric:tabular-nums}
    .client-info-box{border-radius:10px;padding:14px 16px;margin-top:14px;display:flex;align-items:center;gap:12px}
    .client-info-box.reserved{background:rgba(255,149,0,.08);border:1px solid rgba(255,149,0,.25)}
    .client-info-box.sold{background:rgba(255,59,48,.08);border:1px solid rgba(255,59,48,.25)}
    .ci-avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#4e8df5,#3a7de4);display:flex;align-items:center;justify-content:center;font-size:.95rem;font-weight:800;color:#fff;flex-shrink:0}
    .ci-label{font-size:.72rem;color:var(--text-muted);margin-bottom:2px}
    .ci-name{font-size:.95rem;font-weight:800;color:var(--light)}
    .ci-sub{font-size:.75rem;color:var(--text-muted)}

    .btn-submit{display:flex;align-items:center;gap:6px;padding:10px 22px;border-radius:9px;background:var(--accent);color:#fff;border:none;font-family:inherit;font-size:.88rem;font-weight:700;cursor:pointer;transition:all .22s;box-shadow:0 4px 14px rgba(78,141,245,.28)}
    .btn-submit:hover:not(:disabled){background:#3a7de4;transform:translateY(-1px)}.btn-submit:disabled{opacity:.6;cursor:not-allowed}
    .btn-cancel{padding:10px 20px;border-radius:9px;background:rgba(var(--fg-rgb), .05);color:var(--light);border:1px solid rgba(var(--fg-rgb), .12);font-family:inherit;font-size:.88rem;font-weight:600;cursor:pointer;transition:all .22s}
    .btn-cancel:hover{background:rgba(var(--fg-rgb), .09)}
    .btn-danger{display:flex;align-items:center;gap:6px;padding:10px 18px;border-radius:9px;background:var(--danger);color:var(--light);border:none;font-family:inherit;font-size:.88rem;font-weight:700;cursor:pointer;transition:var(--transition)}
    .btn-danger:hover{background:#e62c21}
    .btn-success{display:flex;align-items:center;gap:6px;padding:10px 18px;border-radius:9px;background:var(--success);color:var(--light);border:none;font-family:inherit;font-size:.88rem;font-weight:700;cursor:pointer;transition:var(--transition)}
    .btn-success:hover:not(:disabled){background:#28a745;transform:translateY(-1px)}.btn-success:disabled{opacity:.6;cursor:not-allowed}
    .confirm-box{text-align:center;padding:8px}.confirm-icon{font-size:2.8rem;margin-bottom:14px}
    .confirm-msg{font-size:.92rem;color:var(--text-muted);line-height:1.65;margin-bottom:22px}
    .confirm-actions{display:flex;gap:12px;justify-content:center}

    #proj-toast-container{position:fixed;bottom:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;pointer-events:none}
    .proj-toast{display:flex;align-items:center;gap:10px;padding:13px 17px;border-radius:9px;background:rgba(5,18,42,.97);border:1px solid rgba(var(--fg-rgb), .08);color:#fff;font-size:.88rem;font-weight:600;animation:slideDown .28s ease;box-shadow:0 8px 24px rgba(0,0,0,.35);pointer-events:all}
    .proj-toast.success{border-color:rgba(52,199,89,.4)}.proj-toast.error{border-color:rgba(255,59,48,.4)}

    @media(max-width:768px){.form-row{grid-template-columns:1fr}.unit-detail-grid{grid-template-columns:1fr}.unit-box{flex:0 0 130px;width:130px;height:115px}.u-num{font-size:1.1rem}#filterBar{flex-direction:column;align-items:flex-start}}

    /* ── Custom Searchable Dropdown ── */
    .csd-wrap{position:relative}
    .csd-input{width:100%;padding:11px 34px 11px 13px;border-radius:9px;background:rgba(var(--fg-rgb), .04);border:1.5px solid rgba(var(--fg-rgb), .1);color:#dde8ff;font-family:inherit;font-size:.88rem;transition:all .22s;outline:none}
    .csd-input:focus{background:rgba(var(--fg-rgb), .08);border-color:var(--accent);box-shadow:0 0 0 3px rgba(78,141,245,.13)}
    .csd-input::placeholder{color:var(--text-muted)}
    .csd-arrow{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:var(--text-muted);pointer-events:none;font-size:1.05rem}
    .csd-dropdown{position:absolute;top:calc(100% + 4px);left:0;right:0;background:var(--card-bg);border:1.5px solid rgba(78,141,245,.35);border-radius:9px;max-height:210px;overflow-y:auto;z-index:500;box-shadow:0 8px 28px rgba(0,0,0,.55);display:none}
    .csd-dropdown.open{display:block;animation:slideDown .16s ease}
    .csd-option{padding:9px 14px;font-size:.88rem;color:#dde8ff;cursor:pointer;transition:background .15s}
    .csd-option:hover{background:rgba(78,141,245,.18)}
    .csd-option.selected{background:rgba(78,141,245,.12);color:var(--accent);font-weight:700}
    .csd-option.hidden{display:none}
    .csd-empty{padding:10px 14px;font-size:.85rem;color:var(--text-muted);text-align:center}
  `;

  window.__pages['projects'] = {
    getCSS: function () { return _css; },
    init: async function () {

      const container = document.getElementById('app-main');
      container.innerHTML = `
        <div id="proj-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:1000;align-items:center;justify-content:center;backdrop-filter:blur(5px)">
          <div class="modal-content" id="modalBox">
            <div class="modal-header">
              <h2 id="proj-modal-title"></h2>
              <button class="modal-close" onclick="window.closeModal()"><i class="ri-close-line"></i></button>
            </div>
            <div id="proj-modal-content"></div>
          </div>
        </div>
        <div id="proj-toast-container"></div>
        <div class="toolbar-wrapper">
          <div id="breadcrumb"><span class="bc-current">المشاريع</span></div>
          <div style="display:flex;align-items:center;gap:8px">
            <button id="selToggleBtn" class="sel-toggle" onclick="window._toggleSelectMode()" style="display:none"><i class="ri-checkbox-multiple-line"></i>تحديد</button>
            <div id="toolbar-divider" style="display:none;width:1px;height:22px;background:rgba(var(--fg-rgb), .12);margin:0 2px"></div>
            <button id="addBtn" onclick="window.openAddProject()"><i class="ri-add-line"></i>إضافة مشروع</button>
          </div>
        </div>
        <div id="bulk-bar">
          <!-- معلومات التحديد -->
          <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
            <span class="bulk-count" id="bulk-count-txt">0 وحدة</span>
            <button id="bulk-sel-all-btn" class="bulk-sel-all" onclick="window._bulkSelectAll()"><i class="ri-checkbox-multiple-line"></i>الكل</button>
            <button id="bulk-desel-all-btn" class="bulk-desel-all" onclick="window._bulkDeselectAll()"><i class="ri-checkbox-blank-line"></i>إلغاء</button>
          </div>
          <div class="bulk-divider"></div>
          <!-- تغيير الحالة -->
          <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
            <span class="bulk-lbl">الحالة:</span>
            <button class="bulk-st-btn avail" onclick="window._bulkChangeStatus(1)">متاح</button>
            <button class="bulk-st-btn closed" onclick="window._bulkChangeStatus(4)">مقفول</button>
          </div>
          <div class="bulk-divider"></div>
          <!-- تغيير الواجهة -->
          <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
            <span class="bulk-lbl">الواجهة:</span>
            <select id="bulk-facing-sel" class="filter-select-sm" style="min-width:100px">
              <option value="">— اختر —</option>
              <option value="0">غير محدد</option>
              <option value="1">على شارع</option>
              <option value="2">على شارعين</option>
              <option value="3">خلفي</option>
            </select>
            <button class="bulk-apply-btn" onclick="window._bulkChangeFacing()"><i class="ri-check-line"></i>تطبيق</button>
          </div>
          <div class="bulk-divider"></div>
          <!-- تغيير الغرف -->
          <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
            <span class="bulk-lbl">الغرف:</span>
            <input type="number" id="bulk-rooms-inp" class="filter-price-input" style="width:64px" placeholder="عدد" min="0" max="20">
            <button class="bulk-apply-btn" onclick="window._bulkChangeRooms()"><i class="ri-check-line"></i>تطبيق</button>
          </div>
          <div class="bulk-divider"></div>
          <!-- تغيير السعر -->
          <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
            <span class="bulk-lbl">السعر:</span>
            <input type="number" id="bulk-price-inp" class="filter-price-input" style="width:110px" placeholder="${window.CUR()}" min="0">
            <button class="bulk-apply-btn" onclick="window._bulkChangePrice()"><i class="ri-check-line"></i>تطبيق</button>
          </div>
          <div class="bulk-divider"></div>
          <button class="bulk-cancel" onclick="window._toggleSelectMode()"><i class="ri-close-line"></i>إلغاء</button>
        </div>
        <div id="searchContainer" class="search-container">
          <div class="search-wrap">
            <i class="search-icon ri-search-line"></i>
            <input type="text" id="searchInput" class="search-input" placeholder="ابحث عن مشروع..." oninput="window.handleSearch()">
          </div>
        </div>
        <div id="filterBar">
          <select id="statusFilterSel" class="filter-select-sm" onchange="window.setFilter()" style="min-width:120px">
            <option value="0">الحالة: الكل</option>
            <option value="1">متاح</option>
            <option value="2">محجوز</option>
            <option value="3">مباع</option>
            <option value="4">مقفول</option>
          </select>
          <select id="typeFilterSel" class="filter-select-sm" onchange="window.setTypeFilter()" style="min-width:110px">
            <option value="0">النوع: الكل</option>
            <option value="1">شقة</option>
            <option value="2">روف</option>
          </select>
          <select id="facingFilterSel" class="filter-select-sm" onchange="window.setFacingFilter()" style="min-width:130px">
            <option value="0">الواجهة: الكل</option>
            <option value="1">على شارع</option>
            <option value="2">على شارعين</option>
            <option value="3">خلفي</option>
          </select>
          <select id="roomsFilterSel" class="filter-select-sm" onchange="window.setRoomsFilter()" style="min-width:120px">
            <option value="0">الغرف: الكل</option>
            <option value="1">1 غرفة</option>
            <option value="2">2 غرفة</option>
            <option value="3">3 غرف</option>
            <option value="4">4 غرف</option>
            <option value="5">5+ غرف</option>
          </select>
          <div class="filter-price-wrap">
            <input type="number" id="priceMinInp" class="filter-price-input" placeholder="سعر من" min="0" oninput="window.setPriceFilter()">
            <span class="filter-price-sep">—</span>
            <input type="number" id="priceMaxInp" class="filter-price-input" placeholder="إلى" min="0" oninput="window.setPriceFilter()">
          </div>
          <button class="filter-clear-btn" onclick="window.clearAllFilters()" id="filterClearBtn" style="display:none"><i class="ri-close-circle-line"></i>مسح الكل</button>
        </div>
        <div id="mainView" style="min-height:400px"></div>
        <div id="pagination"></div>
      `;

      document.getElementById('proj-modal').addEventListener('click', e => {
        if (e.target === document.getElementById('proj-modal')) closeModal();
      }, { signal: window.__pageAbortSignal });
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && document.getElementById('proj-modal')?.style.display !== 'none') closeModal();
      }, { signal: window.__pageAbortSignal });

      const API_BASE = window.location.origin;
      const PER_PAGE = 12;
      const BUILDING_LETTERS = ['A','B','C','D','E','F','G','H'];
      const JEDDAH_HOODS = ['حي أبحر الجنوبية','حي أبحر الشمالية','حي أبو النور','حي أبو الجدول','حي الأجاويد','حي الأجواد','حي الأسيل','حي الأمير عبدالمجيد','حي الأمير فواز الجنوبي','حي الأمير فواز الشمالي','حي الأندلس','حي إسكان النزهة','حي البساتين','حي البشائر','حي البغدادية الشرقية','حي البغدادية الغربية','حي البلد','حي البوادي','حي التيسير','حي الثغر','حي الجامعة','حي الجوهرة','حي الحمدانية','حي الحمراء','حي الحرمين','حي الخالدية','حي الخمرة','حي الربوة','حي الرحاب','حي الرحمة','حي الرضوان','حي الروضة','حي الرويس','حي الريان','حي الزهراء','حي الزيمة','حي السامر','حي السرورية','حي السلامة','حي السليمانية','حي الشاطئ','حي الشرفية','حي الشروق','حي الصالحية','حي الصفاء','حي الصواري','حي الضاحية','حي العدل','حي العزيزية','حي العمارية','حي العوالي','حي الغليل','حي الفلاح','حي الفيحاء','حي الفيصلية','حي القريات','حي القوزين','حي الكوثر','حي اللؤلؤ','حي المحجر','حي المحمدية','حي المرجان','حي المروة','حي المصيف','حي المنار','حي المنتزهات','حي المنطقة الصناعية','حي الموج','حي النخيل','حي النزهة','حي النسيم','حي النعيم','حي النهضة','حي النور','حي النورس','حي الورود','حي الهنداوية','حي الوزيرية','حي الياقوت','حي بحرة','حي بني مالك','حي تهامة','حي ذهبان','حي رياض البحر','حي طيبة','حي عكاظ','حي قويزة','حي كيلو 14','حي مشرفة','حي مطار الملك عبدالعزيز','حي ملكان','حي مريخ','حي وادي جودة'];
      function hoodSelect(id, val){
        return _buildCSD(id, JEDDAH_HOODS, '— اختر أو ابحث عن الحي —', val);
      }
      const STATUS_AR   = {1:'متاح',2:'محجوز',3:'مباع',4:'مقفول'};
      const STATUS_CSS  = {1:'st-available',2:'st-reserved',3:'st-sold',4:'st-closed'};
      const STATUS_BADGE= {1:'sb-available',2:'sb-reserved',3:'sb-sold',4:'sb-closed'};
      const TYPE_AR     = {1:'شقة',2:'روف'};
      const FACING_AR   = {0:'غير محدد',1:'أمامي على شارع',2:'أمامي على شارعين',3:'خلفي'};

      // PROJECT STATUS ENUM: 1 = UnderConstruction, 2 = Completed
      const PROJ_STATUS_MAP = {
        1:'UnderConstruction', 'UnderConstruction':1,
        2:'Completed',         'Completed':2
      };

      const S = {
        view:'projects', page:1, filter:0, typeFilter:0, facingFilter:0,
        roomsFilter:0, priceMin:0, priceMax:0,
        projLocation:'',
        data:[], filtered:[], params:{}, buyers:[], _busy:false,
        selecting:false, selected:new Set()
      };

      function getAuthToken(){
        let t=localStorage.getItem('token')||localStorage.getItem('authToken');
        if(!t){try{const a=JSON.parse(localStorage.getItem('authData')||'{}');t=a.token||a.authToken;}catch{}}
        return t||'';
      }

      async function api(method, path, body){
        const token = getAuthToken();
        if(!token){
          window.__showToast?.('يرجى تسجيل الدخول أولاً','error');
          setTimeout(()=>{ window.location.replace('/login'); }, 1500);
          return null;
        }
        const opts = { method, headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`} };
        if(body !== undefined) opts.body = JSON.stringify(body);
        try {
          const r = await fetch(API_BASE + path, opts);
          if(!r.ok){
            if(r.status === 401){
              window.__showToast?.('انتهت صلاحية جلستك، جارٍ تسجيل الخروج...','warning',2500);
              setTimeout(()=>{
                ['authData','token','authToken','rememberMe','savedEmail'].forEach(k=>localStorage.removeItem(k));
                window.location.replace('/login');
              }, 2000);
              return null;
            }
            if(r.status === 403){
              window.__showToast?.('ليس لديك صلاحية لهذا الإجراء','error');
              return null;
            }
            let msg = `خطأ ${r.status}`;
            try{
              const e = await r.json();
              msg = e.message || e.title || e.errors?.[Object.keys(e.errors)[0]]?.[0] || msg;
            }catch{}
            throw new Error(msg);
          }
          if(r.status===204) return null;
          return r.json().catch(()=>null);
        } catch(err) {
          if(err.name === 'AbortError') return null;
          // إذا كان خطأ throw من if(!r.ok) نمرره
          if(err.message && !err.message.includes('fetch')) throw err;
          window.__showToast?.('تعذر الاتصال بالخادم','error');
          throw err;
        }
      }

      async function apiUpload(path, formData){
        const token = getAuthToken();
        if(!token){ toast('يرجى تسجيل الدخول أولاً','error'); return null; }
        const r = await fetch(API_BASE + path, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
        if(!r.ok){
          let msg = `خطأ ${r.status}`;
          try{ const e = await r.json(); msg = e.message||e.title||msg; }catch{}
          throw new Error(msg);
        }
        return r.json().catch(()=>null);
      }

      const GET    = p     => api('GET',    p);
      const POST   = (p,b) => api('POST',   p,b);
      const PUT    = (p,b) => api('PUT',    p,b);
      const DELETE = p     => api('DELETE', p);
      function arr(v){ return Array.isArray(v)?v:(v?.['$values']||v?.data||v?.items||v?.value||[]); }

      function toEn(n){
        if(n==null||n===''||n==='—') return n;
        // Always return English/ASCII digits
        return String(n).replace(/[٠-٩]/g, d=>String.fromCharCode(d.charCodeAt(0)-1632+48));
      }
      function fmtPrice(n){
        if(!n||Number(n)===0) return '—';
        return window.fmtMoney(n);
      }

      function translateError(msg) {
        return (window.__translateError && window.__translateError(msg)) || msg || 'حدث خطأ غير متوقع';
      }
      // استبدال رسائل الخطأ الإنجليزية تلقائياً في كل catch block
      function errToast(e) { toast(translateError(e?.message || String(e)), 'error'); }

      function toast(msg, type='success'){
        const el = document.createElement('div');
        el.className = `proj-toast ${type}`;
        el.innerHTML = `<i class="${type==='success'?'ri-checkbox-circle-line':'ri-error-warning-line'}" style="color:${type==='success'?'var(--success)':'var(--danger)'}"></i><span>${msg}</span>`;
        document.getElementById('proj-toast-container').appendChild(el);
        setTimeout(()=>el.remove(), 3200);
      }
      function openModal(title, html, wide=false){
        document.getElementById('proj-modal-title').textContent = title;
        document.getElementById('proj-modal-content').innerHTML = html;
        document.getElementById('modalBox').classList.toggle('modal-wide', wide);
        document.getElementById('proj-modal').style.display = 'flex';
      }
      function closeModal(){
        document.getElementById('proj-modal').style.display = 'none';
        document.getElementById('proj-modal-content').innerHTML = '';
      }
      window.closeModal = closeModal;

      const sleep = ms => new Promise(r=>setTimeout(r,ms));
      function v(id){ const el=document.getElementById(id); return el?el.value.trim():''; }
      function esc(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

      /* ════ Custom Searchable Dropdown ════ */
      function _buildCSD(id, options, placeholder, selectedValue){
        // options: array of strings OR [{value,label}]
        const normalized = options.map(o=>typeof o==='string'?{value:o,label:o}:o);
        const optHtml = normalized.map(o=>`<div class="csd-option${selectedValue&&String(selectedValue)===String(o.value)?' selected':''}" data-value="${esc(o.value)}" data-label="${esc(o.label)}">${esc(o.label)}</div>`).join('');
        return `<div class="csd-wrap" id="${id}-wrap">
          <input type="text" class="csd-input" id="${id}-input" placeholder="${esc(placeholder)}" autocomplete="off"
            value="${selectedValue?esc(normalized.find(o=>String(o.value)===String(selectedValue))?.label||''):''}"
            oninput="window._pCsdFilter('${id}')"
            onfocus="window._pCsdOpen('${id}')"
            onblur="setTimeout(()=>window._pCsdClose('${id}'),220)"
          >
          <input type="hidden" id="${id}" value="${selectedValue?esc(String(selectedValue)):''}">
          <i class="ri-arrow-down-s-line csd-arrow"></i>
          <div class="csd-dropdown" id="${id}-dropdown">${optHtml||'<div class="csd-empty">لا توجد خيارات</div>'}</div>
        </div>`;
      }
      window._pCsdOpen=function(id){
        const d=document.getElementById(id+'-dropdown');if(d){d.classList.add('open');d.querySelectorAll('.csd-option').forEach(el=>el.classList.remove('hidden'));}
      };
      window._pCsdClose=function(id){const d=document.getElementById(id+'-dropdown');if(d)d.classList.remove('open');};
      window._pCsdFilter=function(id){
        const q=(document.getElementById(id+'-input')?.value||'').toLowerCase().trim();
        const d=document.getElementById(id+'-dropdown');if(!d)return;
        d.classList.add('open');
        let any=false;
        d.querySelectorAll('.csd-option').forEach(el=>{const m=el.dataset.label.toLowerCase().includes(q);el.classList.toggle('hidden',!m);if(m)any=true;});
        let emp=d.querySelector('.csd-empty-dyn');
        if(!any){if(!emp){emp=document.createElement('div');emp.className='csd-empty csd-empty-dyn';emp.textContent='لا توجد نتائج';d.appendChild(emp);}}
        else{if(emp)emp.remove();}
        document.getElementById(id).value='';
      };
      window._pCsdSelect=function(id,value,label){
        const h=document.getElementById(id);const i=document.getElementById(id+'-input');
        if(h)h.value=value;if(i)i.value=label;
        const d=document.getElementById(id+'-dropdown');
        if(d){d.classList.remove('open');d.querySelectorAll('.csd-option').forEach(el=>el.classList.toggle('selected',el.dataset.value===String(value)));}
      };
      function _csdAttach(id){
        setTimeout(()=>{
          const d=document.getElementById(id+'-dropdown');
          if(d) d.querySelectorAll('.csd-option').forEach(el=>{
            el.addEventListener('mousedown',e=>{e.preventDefault();window._pCsdSelect(id,el.dataset.value,el.dataset.label);});
          });
        },0);
      }

      function fmtDate(d){
        if(!d) return '—';
        try{
          const dt=new Date(d);
          const day=String(dt.getDate()).padStart(2,'0');
          const month=String(dt.getMonth()+1).padStart(2,'0');
          return `${day}/${month}/${dt.getFullYear()}`;
        }catch{ return '—'; }
      }

      function fmtDateInput(d){ if(!d)return''; try{ return new Date(d).toISOString().split('T')[0]; }catch{return'';} }
      function fmtFileSize(bytes){ if(!bytes)return'—'; if(bytes<1024)return toEn(bytes)+' B'; if(bytes<1024*1024)return toEn((bytes/1024).toFixed(1))+' KB'; return toEn((bytes/(1024*1024)).toFixed(1))+' MB'; }
      function initials(fn,ln){
        // Support both {firstName,lastName} and {fullName} API shapes
        const full = (typeof fn==='object'&&fn!==null) ? (fn.fullName||fn.FullName||'') : '';
        if(full){ const parts=full.trim().split(/\s+/); return(parts[0].charAt(0)+(parts[1]?.charAt(0)||'')).toUpperCase()||'؟'; }
        return((fn||'').charAt(0)+(ln||'').charAt(0)).toUpperCase()||'؟';
      }
      function setBusy(id, busy, lbl='حفظ'){
        const el = document.getElementById(id); if(!el)return;
        el.disabled = busy;
        el.innerHTML = busy ? '<i class="ri-loader-4-line" style="animation:spin .8s linear infinite;display:inline-block"></i> جاري...' : `<i class="ri-save-line"></i>${lbl}`;
      }
      function showLoader(){
        const vw = document.getElementById('mainView'); if(vw) vw.innerHTML='<div class="loader-box"><div class="spinner"></div></div>';
        const p = document.getElementById('pagination'); if(p) p.innerHTML='';
      }
      async function swap(fn){
        if(S._busy)return; S._busy=true;
        const vw = document.getElementById('mainView'); if(!vw){S._busy=false;return;}
        vw.style.transition='opacity .2s ease,transform .2s ease'; vw.style.opacity='0'; vw.style.transform='translateY(8px)';
        await sleep(180); fn(); vw.style.opacity='1'; vw.style.transform='translateY(0)'; await sleep(180); S._busy=false;
      }

      function toStatus(val){
        if(val===null||val===undefined) return 4;
        if(typeof val==='number') return val;
        return {'available':1,'reserved':2,'sold':3,'closed':4,'Available':1,'Reserved':2,'Sold':3,'Closed':4}[val]??4;
      }
      function toType(val){
        if(val===null||val===undefined) return 1;
        if(typeof val==='number') return val;
        return {'apartment':1,'Apartment':1,'roof':2,'Roof':2,'typicalfloor':1,'TypicalFloor':1,'groundfloor':1,'GroundFloor':1}[val]??1;
      }
      function toFacing(val){
        if(val===null||val===undefined||val===0||val==='0') return 0;
        if(typeof val==='number') return val;
        return {'frontonstreet':1,'frontonestreet':1,'FrontOneStreet':1,'fronttwostreets':2,'FrontTwoStreets':2,'back':3,'Back':3}[val]??1;
      }

      // ══ تحويل حالة المشروع — القيم الجاية من الـ API مباشرة ══
      function toProjStatus(val){
        if(val===null||val===undefined) return 2;
        if(typeof val==='number') return val;
        return {'underConstruction':1,'UnderConstruction':1,'completed':2,'Completed':2}[val]??2;
      }

      function computeStats(units){
        return { total:units.length, avail:units.filter(u=>toStatus(u.status)===1).length, resrv:units.filter(u=>toStatus(u.status)===2).length, sold:units.filter(u=>toStatus(u.status)===3).length, closed:units.filter(u=>toStatus(u.status)===4).length };
      }

      async function ensureBuyers(){
        if(S.buyers.length>0) return;
        try{ const d=await GET('/api/Buyers'); S.buyers=arr(d); }catch{ S.buyers=[]; }
      }
      function buyerById(id){ if(!id)return null; return S.buyers.find(b=>b.id===id||b.id===Number(id)||String(b.id)===String(id))||null; }
      function buyerName(b){ if(!b)return'—'; return (b.fullName||b.FullName||`${b.firstName||''} ${b.lastName||''}`.trim())||'—'; }
      function buyerInitials(b){ if(!b)return'؟'; const n=(b.fullName||b.FullName||`${b.firstName||''} ${b.lastName||''}`).trim(); const parts=n.split(/\s+/); return((parts[0]?.charAt(0)||'')+(parts[1]?.charAt(0)||'')).toUpperCase()||'؟'; }

      let _st = null;
      function handleSearch(){ clearTimeout(_st); _st=setTimeout(doSearch,150); }
      window.setFilter = function setFilter(){
        S.filter = Number(document.getElementById('statusFilterSel')?.value||0);
        _updateFilterClearBtn(); doSearch();
      };
      window.setTypeFilter = function(){
        S.typeFilter = Number(document.getElementById('typeFilterSel')?.value||0);
        _updateFilterClearBtn(); doSearch();
      };
      window.setFacingFilter = function(){
        S.facingFilter = Number(document.getElementById('facingFilterSel')?.value||0);
        _updateFilterClearBtn(); doSearch();
      };
      window.setRoomsFilter = function(){
        S.roomsFilter = Number(document.getElementById('roomsFilterSel')?.value||0);
        _updateFilterClearBtn(); doSearch();
      };
      window.setPriceFilter = function(){
        S.priceMin = Number(document.getElementById('priceMinInp')?.value||0);
        S.priceMax = Number(document.getElementById('priceMaxInp')?.value||0);
        _updateFilterClearBtn(); doSearch();
      };
      window.clearAllFilters = function(){
        S.filter=0; S.typeFilter=0; S.facingFilter=0; S.roomsFilter=0; S.priceMin=0; S.priceMax=0;
        ['statusFilterSel','typeFilterSel','facingFilterSel','roomsFilterSel'].forEach(id=>{
          const el=document.getElementById(id); if(el) el.value='0';
        });
        const mn=document.getElementById('priceMinInp'); if(mn)mn.value='';
        const mx=document.getElementById('priceMaxInp'); if(mx)mx.value='';
        _updateFilterClearBtn(); doSearch();
      };
      function _updateFilterClearBtn(){
        const hasFilter=(S.filter!==0||S.typeFilter!==0||S.facingFilter!==0||S.roomsFilter!==0||S.priceMin>0||S.priceMax>0);
        const btn=document.getElementById('filterClearBtn'); if(btn)btn.style.display=hasFilter?'inline-flex':'none';
      }
      window.setProjLocation = function(){
        S.projLocation = document.getElementById('projLocSel')?.value||'';
        doSearch();
      };
      function getFloorUnits(floorId){
        return (S.params.units||[]).filter(u=>{
          if(Number(u.floorId)!==Number(floorId)) return false;
          if(S.filter!==0 && toStatus(u.status)!==S.filter) return false;
          if(S.typeFilter!==0 && toType(u.type)!==S.typeFilter) return false;
          if(S.facingFilter!==0 && toFacing(u.facing)!==S.facingFilter) return false;
          if(S.roomsFilter!==0){
            const r=Number(u.rooms||u.numberOfRooms||0);
            if(S.roomsFilter===5?r<5:r!==S.roomsFilter) return false;
          }
          if(S.priceMin>0 && Number(u.price||0)<S.priceMin) return false;
          if(S.priceMax>0 && Number(u.price||0)>S.priceMax) return false;
          return true;
        });
      }
      function doSearch(){
        const q = (document.getElementById('searchInput')?.value||'').toLowerCase().trim();
        const loc = S.projLocation;
        if(S.view==='projects'){
          S.filtered=S.data.filter(p=>{
            if(q && !((p.name||'').toLowerCase().includes(q)||(p.location||'').toLowerCase().includes(q))) return false;
            if(loc && (p.location||'').trim()!==loc) return false;
            return true;
          });
        }
        else if(S.view==='buildings') S.filtered=[...S.data];
        else if(S.view==='units'){
          const anyFilter=(S.filter!==0||S.typeFilter!==0||S.facingFilter!==0||S.roomsFilter!==0||S.priceMin>0||S.priceMax>0);
          S.filtered=anyFilter?[...S.data].filter(f=>getFloorUnits(f.id).length>0):[...S.data];
        }
        S.page=1; swap(renderView);
      }
      function renderPag(total){
        const pages=Math.ceil(total/PER_PAGE), d=document.getElementById('pagination');
        if(!d||pages<=1){ if(d)d.innerHTML=''; return; }
        let h=`<button class="pg-btn" onclick="window.goPage(${S.page-1})" ${S.page===1?'disabled':''}>السابق</button>`;
        for(let i=1;i<=pages;i++) h+=`<button class="pg-btn ${S.page===i?'active':''}" onclick="window.goPage(${i})">${toEn(i)}</button>`;
        h+=`<button class="pg-btn" onclick="window.goPage(${S.page+1})" ${S.page===pages?'disabled':''}>التالي</button>`;
        d.innerHTML=h;
      }
      function goPage(p){ S.page=p; swap(renderView); window.scrollTo({top:0,behavior:'smooth'}); }

      function renderView(){
        const start=(S.page-1)*PER_PAGE, page=S.filtered.slice(start,start+PER_PAGE), c=document.getElementById('mainView');
        if(!c) return;

        /* ══════════════════════════════════════════
           PROJECTS VIEW
           الحالة وتاريخ التسليم يجوا من الـ project مباشرة
        ══════════════════════════════════════════ */
        if(S.view==='projects'){
          if(!page.length){ c.innerHTML='<div class="empty-msg"><i class="ri-building-2-line"></i>لا توجد مشاريع</div>'; renderPag(0); return; }
          c.innerHTML='<div class="grid">'+page.map((p,i)=>{
            const pUnits=(S.params.allUnits||[]).filter(u=>u._projectId===p.id);
            const st=pUnits.length?computeStats(pUnits):{total:p.totalUnits??0,avail:p.availableUnits??0,resrv:p.reservedUnits??0,sold:p.soldUnits??0,closed:p.closedUnits??0};

            // ══ قراءة الحالة من المشروع مباشرة ══
            const projStatus = toProjStatus(p.status);
            const isUnder    = projStatus === 1;
            const ribbonCls  = isUnder ? 'under' : 'completed';
            const statusCls  = isUnder ? 'under' : 'completed';
            const statusLabel= isUnder ? 'تحت الإنشاء' : 'مكتمل';
            const statusIcon = isUnder ? 'ri-tools-line' : 'ri-checkbox-circle-line';

            let deliveryHtml = '';
            if(isUnder && p.expectedDeliveryDate){
              const formatted = fmtDate(p.expectedDeliveryDate);
              if(formatted && formatted !== '—'){
                deliveryHtml = `<span class="p-delivery-badge"><i class="ri-calendar-event-line"></i>تسليم: ${formatted}</span>`;
              }
            }

            return `<div class="p-card" style="animation-delay:${i*50}ms" onclick="window.showBuildings(${p.id},'${esc(p.name)}','${esc(p.code||'')}')">
              <div class="p-card-ribbon ${ribbonCls}"></div>
              <div class="p-card-body">
                <div class="p-card-header">
                  <div class="p-card-title-wrap"><div class="p-card-title">${esc(p.name)}</div></div>
                  <div class="p-card-actions">
                    <button class="icon-btn edit" onclick="event.stopPropagation();window.editProject(${p.id})"><i class="ri-edit-line"></i></button>
                    ${window.__canDelete?.()?`<button class="icon-btn del" onclick="event.stopPropagation();window.deleteProject(${p.id},'${esc(p.name)}')"><i class="ri-delete-bin-line"></i></button>`:''}
                  </div>
                </div>
                <div class="p-card-loc"><i class="ri-map-pin-line"></i>${esc(p.location)}</div>
                <div class="p-card-status-row">
                  <span class="p-status-badge ${statusCls}"><i class="${statusIcon}"></i>${statusLabel}</span>
                  ${deliveryHtml}
                </div>
                ${(()=>{ const d=stripEng(p.description); return d?`<div style="font-size:.75rem;color:var(--text-muted);margin-bottom:12px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${esc(d)}</div>`:''; })()}
                <div class="p-card-stats">
                  <div class="ps-box ps-total"><span class="ps-num">${toEn(st.total)}</span><div class="ps-lbl">وحدات</div></div>
                  <div class="ps-box ps-avail"><span class="ps-num">${toEn(st.avail)}</span><div class="ps-lbl">متاح</div></div>
                  <div class="ps-box ps-resrv"><span class="ps-num">${toEn(st.resrv)}</span><div class="ps-lbl">محجوز</div></div>
                  <div class="ps-box ps-sold"><span class="ps-num">${toEn(st.sold)}</span><div class="ps-lbl">مباع</div></div>
                  <div class="ps-box ps-closed"><span class="ps-num">${toEn(st.closed)}</span><div class="ps-lbl">مقفول</div></div>
                </div>
                <div class="p-card-footer"><div class="p-card-date"><i class="ri-calendar-line"></i> ${fmtDate(p.createdAt)}</div></div>
              </div>
            </div>`;
          }).join('')+'</div>';
          renderPag(S.filtered.length);
        }

        /* ══════════════════════════════════════════
           BUILDINGS VIEW
           شالت منها status و expectedDeliveryDate
        ══════════════════════════════════════════ */
        else if(S.view==='buildings'){
          if(!page.length){ c.innerHTML='<div class="empty-msg"><i class="ri-building-3-line"></i>لا توجد مبانٍ</div>'; renderPag(0); return; }
          c.innerHTML='<div class="grid">'+page.map((b,i)=>{
            const bUnits=(S.params.allUnits||[]).filter(u=>u._buildingId===b.id);
            const st=bUnits.length?computeStats(bUnits):{total:b.totalUnits??0,avail:b.availableUnits??0,resrv:b.reservedUnits??0,sold:b.soldUnits??0,closed:b.closedUnits??0};
            const pCode=S.params.projectCode||'';
            const bLabel=pCode?`${pCode}-${b.name}`:b.name;
            const warrantyCount=(b.warrantyDocuments||[]).length;
            const warrantyStrip = warrantyCount > 0
              ? `<div class="w-count-badge"><i class="ri-file-pdf-2-line"></i>${toEn(warrantyCount)} ملف</div>`
              : `<span class="w-upload-hint">لا توجد ملفات — اضغط لإضافة</span>`;
            const warrantyStripWrapped = `<span id="wstrip-${b.id}">${warrantyStrip}</span>`;

            return `<div class="b-card" style="animation-delay:${i*50}ms" onclick="window.showUnits(${b.id},'${esc(b.name)}','${esc(b.name)}')">
              <div class="b-card-ribbon"></div>
              <div class="b-card-body">
                <div class="b-card-header">
                  <div class="b-card-title-wrap">
                    <div class="b-card-name-row">
                      <span class="b-card-code">${esc(bLabel)}</span>
                    </div>
                  </div>
                  <div class="b-card-actions">
                    <div class="icon-btn edit" onclick="event.stopPropagation();window.editBuilding(${b.id})"><i class="ri-edit-line"></i></div>
                    ${window.__canDelete?.()?`<div class="icon-btn del" onclick="event.stopPropagation();window.deleteBuilding(${b.id},'${esc(b.name)}')"><i class="ri-delete-bin-line"></i></div>`:''}
                  </div>
                </div>
                <div class="p-card-stats" style="margin-top:12px">
                  <div class="ps-box ps-total"><span class="ps-num">${toEn(st.total)}</span><div class="ps-lbl">وحدات</div></div>
                  <div class="ps-box ps-avail"><span class="ps-num">${toEn(st.avail)}</span><div class="ps-lbl">متاح</div></div>
                  <div class="ps-box ps-resrv"><span class="ps-num">${toEn(st.resrv)}</span><div class="ps-lbl">محجوز</div></div>
                  <div class="ps-box ps-sold"><span class="ps-num">${toEn(st.sold)}</span><div class="ps-lbl">مباع</div></div>
                  <div class="ps-box ps-closed"><span class="ps-num">${toEn(st.closed)}</span><div class="ps-lbl">مقفول</div></div>
                </div>
                <div class="p-card-footer"><div class="p-card-date"><i class="ri-calendar-line"></i> ${fmtDate(b.createdAt)}</div></div>
                <div class="b-card-warranty" onclick="event.stopPropagation();window.openWarrantyModal('${esc(b.name)}',${b.id})">
                  <i class="w-icon ri-shield-check-line"></i>
                  <span class="w-label">ملف الضمانات</span>
                  ${warrantyStripWrapped}
                  <i class="w-arrow ri-arrow-left-s-line"></i>
                </div>
              </div>
            </div>`;
          }).join('')+'</div>';
          renderPag(S.filtered.length);
        }

        /* ══════════════════════════════════════════
           UNITS VIEW — بدون تغيير
        ══════════════════════════════════════════ */
        else if(S.view==='units'){
          const floorsToShow=S.filter===0?S.data:S.data.filter(f=>getFloorUnits(f.id).length>0);
          const sortedFloors=[...floorsToShow].sort((a,b)=>(b.floorNumber??0)-(a.floorNumber??0));
          if(!sortedFloors.length){ c.innerHTML='<div class="empty-msg"><i class="ri-layout-2-line"></i>لا توجد وحدات مطابقة</div>'; renderPag(0); return; }
          const pagFloors=sortedFloors.slice((S.page-1)*PER_PAGE, S.page*PER_PAGE);
          let h='<div class="floor-map">';
          pagFloors.forEach((f,fi)=>{
            const fu=getFloorUnits(f.id);
            const isRoof=!!(f.isRoof||f.type===3||String(f.type).toLowerCase()==='roof');
            const floorLabel=isRoof?`الدور ${toEn(f.floorNumber)} <span class="roof-badge">روف</span>`:`الدور ${toEn(f.floorNumber)}`;
            const avail=fu.filter(u=>toStatus(u.status)===1).length;
            const resrv=fu.filter(u=>toStatus(u.status)===2).length;
            const sold=fu.filter(u=>toStatus(u.status)===3).length;
            const closed=fu.filter(u=>toStatus(u.status)===4).length;
            h+=`<div class="floor-row${isRoof?' is-roof':''}" style="animation-delay:${fi*50}ms">
              <div class="floor-header">
                <div class="floor-lbl">${floorLabel}</div>
                <span class="floor-count">${toEn(fu.length)} وحدة</span>
              </div>
              <div class="units-wrap">`;
            fu.forEach(u=>{
              const st=toStatus(u.status), tp=toType(u.type);
              const css=STATUS_CSS[st]||'st-closed', stAr=STATUS_AR[st]||'—';
              const isUnitRoof=tp===2;
              const typeBadgeText=isUnitRoof?'روف':'شقة';
              const hasClient=!!(u.buyerId);
              h+=`<div class="unit-box ${css}${S.selected.has(u.id)?' selected-unit':''}" data-uid="${u.id}" onclick="window._unitClick(${u.id},this)">
                <div class="u-chk"><i class="ri-check-line" style="font-size:.8rem;color:var(--light);${S.selected.has(u.id)?'':'display:none'}"></i></div>
                <div class="u-actions">
                  <button class="u-icon-btn edit" onclick="event.stopPropagation();window.editUnit(${u.id})"><i class="ri-edit-line"></i></button>
                  ${window.__canDelete?.()?`<button class="u-icon-btn del" onclick="event.stopPropagation();window.deleteUnit(${u.id},'${esc(String(u.unitNumber))}')"><i class="ri-delete-bin-line"></i></button>`:''}
                </div>
                ${hasClient?`<span style="position:absolute;top:6px;right:7px;font-size:.6rem;color:var(--warning);opacity:.8"><i class="ri-user-fill"></i></span>`:''}
                <div class="u-num">${toEn(u.unitNumber)}</div>
                <div class="u-status-badge">${stAr}</div>
                <div class="u-type-lbl">${typeBadgeText}</div>
              </div>`;
            });
            h+=`<button class="floor-add-btn" onclick="window.openAddUnit(${f.id},${f.floorNumber},${isRoof})"><i class="ri-add-line"></i><span>وحدة</span></button></div>`;
            if(fu.length>0) h+=`<div class="legend">
              ${avail>0?`<span class="legend-item"><span class="legend-dot" style="background:var(--success)"></span>متاح (${toEn(avail)})</span>`:''}
              ${resrv>0?`<span class="legend-item"><span class="legend-dot" style="background:var(--warning)"></span>محجوز (${toEn(resrv)})</span>`:''}
              ${sold>0?`<span class="legend-item"><span class="legend-dot" style="background:var(--danger)"></span>مباع (${toEn(sold)})</span>`:''}
              ${closed>0?`<span class="legend-item"><span class="legend-dot" style="background:var(--closed)"></span>مقفول (${toEn(closed)})</span>`:''}
            </div>`;
            h+='</div>';
          });
          h+='</div>'; c.innerHTML=h; renderPag(sortedFloors.length);
        }
      }

      function setBreadcrumb(items){
        const el=document.getElementById('breadcrumb'); if(!el)return;
        el.innerHTML=items.map((it,i)=>{ const last=i===items.length-1;
          return last?`<span class="bc-current">${esc(it.label)}</span>`:`<span class="bc-item" onclick="${it.fn}">${esc(it.label)}</span><span class="bc-sep">/</span>`;
        }).join('');
      }
      function setAddBtn(label, oc){ const el=document.getElementById('addBtn'); if(!el)return; el.innerHTML=`<i class="ri-add-line"></i>${label}`; el.setAttribute('onclick',oc); }
      function showSearchBar(show){ const el=document.getElementById('searchContainer'); if(el)el.style.display=show?'flex':'none'; }
      function showFilterBar(show){
        const el=document.getElementById('filterBar'); if(!el)return;
        el.style.display=show?'flex':'none';
        if(show){
          ['statusFilterSel','typeFilterSel','facingFilterSel','roomsFilterSel'].forEach(id=>{
            const sel=document.getElementById(id); if(sel) sel.value='0';
          });
          const mn=document.getElementById('priceMinInp'); if(mn)mn.value='';
          const mx=document.getElementById('priceMaxInp'); if(mx)mx.value='';
          const cb=document.getElementById('filterClearBtn'); if(cb)cb.style.display='none';
          S.filter=0; S.typeFilter=0; S.facingFilter=0; S.roomsFilter=0; S.priceMin=0; S.priceMax=0;
        }
      }
      function showProjFilterBar(show, locations=[]){
        // Remove any existing inline district filter
        const oldSel = document.getElementById('projLocSelWrap');
        if (oldSel) oldSel.remove();

        const bar = document.getElementById('projFilterBar');
        if (bar) bar.style.display = 'none';

        if (!show) return;

        // Inject district selector directly into the search container, next to the search input
        const sc = document.getElementById('searchContainer');
        if (!sc) return;

        const locs = [...new Set(locations.filter(Boolean))].sort();
        const wrap = document.createElement('div');
        wrap.id = 'projLocSelWrap';
        wrap.style.cssText = 'display:flex;align-items:center;gap:7px;flex-shrink:0';
        wrap.innerHTML = `
        <div style="width:1px;height:28px;background:rgba(var(--fg-rgb), 0.12);flex-shrink:0;align-self:center"></div>
        <select id="projLocSel" class="filter-select-sm" onchange="window.setProjLocation()" style="min-width:130px">
          <option value="">الحي: الكل</option>
          ${locs.map(l => `<option value="${esc(l)}">${esc(l)}</option>`).join('')}
        </select>`;
        sc.appendChild(wrap);
        S.projLocation = '';
      }
      function showSelToggle(show){
        const btn=document.getElementById('selToggleBtn'); if(btn) btn.style.display=show?'flex':'none';
        const div=document.getElementById('toolbar-divider'); if(div) div.style.display=show?'block':'none';
      }

      /* ════════ WARRANTY MODAL ════════ */
      async function openWarrantyModal(buildingName, buildingId){
        openModal(`ضمانات عمارة ${buildingName}`, `<div class="modal-body"><div class="loader-box" style="min-height:120px"><div class="spinner"></div></div></div>`, true);
        let docs = [];
        try{ docs = arr(await GET(`/api/WarrantyDocuments/building/${buildingId}`)); }catch{ toast('فشل تحميل الضمانات','error'); }

        const docsHtml = docs.length
          ? docs.map(d=>`
            <div class="wdoc-item" id="wdoc-${d.id}">
              <div class="wdoc-icon"><i class="ri-file-pdf-2-line"></i></div>
              <div class="wdoc-info">
                <div class="wdoc-name" title="${esc(d.fileName)}">${esc(d.fileName)}</div>
                <div class="wdoc-meta">${fmtFileSize(d.fileSizeBytes)} &bull; ${fmtDate(d.uploadedAt)}${d.description?` &bull; ${esc(d.description)}`:''}</div>
              </div>
              <div class="wdoc-actions">
                <button class="wdoc-btn view" onclick="window.previewWarrantyDoc('${esc(d.fileUrl)}','${esc(d.fileName)}')" title="معاينة"><i class="ri-eye-line"></i></button>
                <button class="wdoc-btn download" onclick="window.downloadWarrantyDoc('${API_BASE}${d.fileUrl}','${esc(d.fileName)}')" title="تحميل مباشر"><i class="ri-download-2-line"></i></button>
                <button class="wdoc-btn del" onclick="window.deleteWarrantyDoc(${d.id},'${esc(d.fileName)}')" title="حذف"><i class="ri-delete-bin-line"></i></button>
              </div>
            </div>`).join('')
          : `<div class="wdocs-empty"><i class="ri-shield-line"></i>لا توجد ملفات ضمانات بعد</div>`;

        const countSummary = docs.length
          ? `<div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;padding:9px 12px;border-radius:8px;background:rgba(78,141,245,.07);border:1px solid rgba(78,141,245,.2)">
               <i class="ri-shield-check-line" style="color:var(--accent);font-size:1rem"></i>
               <span style="font-size:.82rem;color:var(--text-muted)">إجمالي الملفات المرفوعة:</span>
               <strong style="color:var(--accent);font-size:.88rem;font-variant-numeric:tabular-nums">${toEn(docs.length)} ملف</strong>
             </div>`
          : '';

        document.getElementById('proj-modal-content').innerHTML = `
          <div class="modal-body">
            ${countSummary}
            <div class="wdocs-list">${docsHtml}</div>
            <div class="wpdf-viewer" id="wPdfViewer">
              <div class="wpdf-viewer-header">
                <span class="wpdf-viewer-title" id="wPdfViewerTitle"></span>
                <button class="wpdf-close-btn" onclick="window.closePdfViewer()" title="إغلاق المعاينة"><i class="ri-close-line"></i></button>
              </div>
              <iframe id="wPdfFrame" src="" allowfullscreen></iframe>
            </div>
            <div class="wupload-zone" id="wUploadZone">
              <input type="file" accept=".pdf" id="wFileInput" onchange="window._onWarrantyFileSelect(this)">
              <div class="wdz-icon"><i class="ri-upload-cloud-2-line"></i></div>
              <div class="wdz-title">اسحب ملف PDF هنا أو اضغط للاختيار</div>
              <div class="wdz-sub">PDF فقط — حد أقصى 20 ميجا</div>
            </div>
            <div class="wupload-selected" id="wSelectedFile">
              <i class="ri-file-pdf-2-line"></i>
              <span id="wSelectedFileName"></span>
            </div>
            <div class="wupload-desc">
              <input type="text" id="wDocDesc" class="form-input" placeholder="وصف الملف (اختياري)" style="margin-top:10px">
            </div>
            <div class="wupload-progress" id="wProgress">
              <div style="font-size:.75rem;color:var(--text-muted);margin-bottom:6px">جاري الرفع...</div>
              <div class="wupload-progress-bar"><div class="wupload-progress-fill" id="wProgressFill"></div></div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-success" id="wUploadBtn" onclick="window.submitWarrantyUpload(${buildingId})" disabled>
              <i class="ri-upload-2-line"></i>رفع الملف
            </button>
            <button class="btn-cancel" onclick="window.closeModal()">إغلاق</button>
          </div>`;

        const zone = document.getElementById('wUploadZone');
        zone.addEventListener('dragover', e=>{ e.preventDefault(); zone.classList.add('drag-over'); });
        zone.addEventListener('dragleave', ()=>zone.classList.remove('drag-over'));
        zone.addEventListener('drop', e=>{
          e.preventDefault(); zone.classList.remove('drag-over');
          const file = e.dataTransfer.files[0];
          if(file){ window._onWarrantyFileSelect(null, file); }
        });
      }
      window.openWarrantyModal = openWarrantyModal;

      window._wPreviewBlobUrl = null;
      window.previewWarrantyDoc = async function(fileUrl, fileName){
        const viewer = document.getElementById('wPdfViewer');
        const frame  = document.getElementById('wPdfFrame');
        const title  = document.getElementById('wPdfViewerTitle');
        if(!viewer||!frame) return;
        // المسار محمي بالـ token الآن — نجلب الملف ثم نعرضه كـ blob (الـ iframe لا يرسل الترويسة)
        try {
          const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${API_BASE}${fileUrl}`;
          const res = await fetch(fullUrl, { headers: { 'Authorization': `Bearer ${getAuthToken()}` } });
          if(!res.ok) throw new Error(res.status);
          if(window._wPreviewBlobUrl) URL.revokeObjectURL(window._wPreviewBlobUrl);
          window._wPreviewBlobUrl = URL.createObjectURL(await res.blob());
          frame.src = window._wPreviewBlobUrl;
          if(title) title.textContent = fileName;
          viewer.style.display = 'block';
          viewer.scrollIntoView({ behavior:'smooth', block:'nearest' });
        } catch(e) { toast('فشل فتح الملف','error'); }
      };
      window.closePdfViewer = function(){
        const viewer = document.getElementById('wPdfViewer');
        const frame  = document.getElementById('wPdfFrame');
        if(frame) frame.src = '';
        if(window._wPreviewBlobUrl){ URL.revokeObjectURL(window._wPreviewBlobUrl); window._wPreviewBlobUrl = null; }
        if(viewer) viewer.style.display = 'none';
      };

      window._warrantyFile = null;
      window._onWarrantyFileSelect = function(input, droppedFile){
        const file = droppedFile || (input && input.files[0]);
        if(!file) return;
        if(!file.name.toLowerCase().endsWith('.pdf')){ toast('يُسمح برفع PDF فقط','error'); return; }
        if(file.size > 20*1024*1024){ toast('حجم الملف يتجاوز 20 ميجا','error'); return; }
        window._warrantyFile = file;
        const sel = document.getElementById('wSelectedFile');
        const nm = document.getElementById('wSelectedFileName');
        if(sel) sel.style.display='flex';
        if(nm) nm.textContent = file.name + ' (' + fmtFileSize(file.size) + ')';
        const btn = document.getElementById('wUploadBtn');
        if(btn){ btn.disabled=false; }
      };

      window.submitWarrantyUpload = async function(buildingId){
        const file = window._warrantyFile;
        if(!file){ toast('يرجى اختيار ملف أولاً','error'); return; }
        const desc = v('wDocDesc');
        const btn = document.getElementById('wUploadBtn');
        const prog = document.getElementById('wProgress');
        const fill = document.getElementById('wProgressFill');
        if(btn){ btn.disabled=true; btn.innerHTML='<i class="ri-loader-4-line" style="animation:spin .8s linear infinite;display:inline-block"></i> جاري الرفع...'; }
        if(prog) prog.style.display='block';
        if(fill){ fill.style.width='0'; setTimeout(()=>fill.style.width='60%',100); }
        try{
          const fd = new FormData();
          fd.append('file', file);
          fd.append('description', desc);
          fd.append('buildingId', buildingId);
          const uploadedDoc = await apiUpload(`/api/WarrantyDocuments/upload/${buildingId}`, fd);
          if(fill) fill.style.width='100%';
          await sleep(300);
          const bld = S.data.find(b=>b.id===buildingId);
          if(bld){ bld.warrantyDocuments = bld.warrantyDocuments||[]; if(uploadedDoc) bld.warrantyDocuments.push(uploadedDoc); else bld.warrantyDocuments.push({}); }
          const newCount = (bld?.warrantyDocuments||[]).length;
          // update badge on card without re-render
          const stripEl = document.getElementById(`wstrip-${buildingId}`);
          if(stripEl) stripEl.innerHTML = `<div class="w-count-badge"><i class="ri-file-pdf-2-line"></i>${toEn(newCount)} ملف</div>`;
          toast(`تم رفع الملف — إجمالي الضمانات: ${toEn(newCount)} ملف`);
          window._warrantyFile = null;
          const bldName = S.data.find(b=>b.id===buildingId)?.name||'';
          openWarrantyModal(bldName, buildingId);
        }catch(e){
          if(fill) fill.style.width='0';
          if(prog) prog.style.display='none';
          if(btn){ btn.disabled=false; btn.innerHTML='<i class="ri-upload-2-line"></i>رفع الملف'; }
          toast(`فشل الرفع: ${e.message}`,'error');
        }
      };

      window.downloadWarrantyDoc = async function(url, fileName) {
        try {
          const token = getAuthToken();
          const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
          const blob = await res.blob();
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = fileName;
          a.click();
          URL.revokeObjectURL(a.href);
        } catch(e) {
          toast('فشل التحميل: ' + e.message, 'error');
        }
      };

      window.deleteWarrantyDoc = function(docId, fileName){
        openModal('حذف ملف الضمانات', `<div class="modal-body"><div class="confirm-box">
          <div class="confirm-icon">🗑️</div>
          <p class="confirm-msg">هل أنت متأكد من حذف ملف <strong>${esc(fileName)}</strong>؟</p>
          <div class="confirm-actions">
            <button class="btn-danger" id="submitBtn" onclick="window.confirmDeleteWarrantyDoc(${docId})"><i class="ri-delete-bin-line"></i>نعم، احذف</button>
            <button class="btn-cancel" onclick="window.closeModal()">إلغاء</button>
          </div></div></div>`);
      };
      window.confirmDeleteWarrantyDoc = async function(docId){
        setBusy('submitBtn',true,'احذف');
        try{
          await DELETE(`/api/WarrantyDocuments/${docId}`);
          toast('تم حذف الملف');
          const item=document.getElementById(`wdoc-${docId}`);
          if(item) item.remove();
          closeModal();
        }catch(e){ errToast(e); }
        setBusy('submitBtn',false,'احذف');
      };

      /* ══════════════════════════════════════════
         LOAD FUNCTIONS
      ══════════════════════════════════════════ */
      async function showProjects(){
        S.view='projects'; S.page=1; S.filter=0; S.params={};
        if(S.selecting) _exitSelectMode();
        window.__savePageState?.('projects', { view:'projects' });
        setBreadcrumb([{label:'المشاريع'}]);
        setAddBtn('إضافة مشروع','window.openAddProject()');
        showSearchBar(true); showFilterBar(false); showProjFilterBar(false); showSelToggle(false); showLoader();
        try{
          const [projData, allUnitsData, floorsData, bldData] = await Promise.all([
            GET('/api/Projects'), GET('/api/Units'), GET('/api/Floors'), GET('/api/Buildings')
          ]);
          S.data = arr(projData);
          const floors = arr(floorsData), buildings = arr(bldData);
          S.params.allUnits = arr(allUnitsData).map(u=>{
            const floor = floors.find(f=>Number(f.id)===Number(u.floorId));
            const bld   = floor ? buildings.find(b=>Number(b.id)===Number(floor.buildingId)) : null;
            return {...u, _projectId: bld?.projectId, _buildingId: bld?.id};
          });
          S.filtered = [...S.data];
          const locations = S.data.map(p=>p.location).filter(Boolean);
          if(locations.length>0) showProjFilterBar(true, locations);
          swap(renderView);
        }catch(e){ console.error(e); toast('فشل تحميل المشاريع','error'); }
      }

      async function showBuildings(projectId, projectName, projectCode){
        S.view='buildings'; S.page=1; S.filter=0;
        if(S.selecting) _exitSelectMode();
        S.params = {projectId:Number(projectId), projectName, projectCode:projectCode||''};
        window.__savePageState?.('projects', { view:'buildings', projectId:Number(projectId), projectName, projectCode:projectCode||'' });
        setBreadcrumb([{label:'المشاريع',fn:'window.showProjects()'},{label:projectName}]);
        setAddBtn('إضافة مبنى',`window.openAddBuilding(${projectId})`);
        showSearchBar(false); showFilterBar(false); showProjFilterBar(false); showSelToggle(false); showLoader();
        try{
          const [bldData, allUnitsData, floorsData] = await Promise.all([
            GET('/api/Buildings'), GET('/api/Units'), GET('/api/Floors')
          ]);
          S.data = arr(bldData).filter(b=>Number(b.projectId)===Number(projectId));
          // fetch warranty doc counts for all buildings in parallel
          S.data.forEach(b => { b.warrantyDocuments = arr(b.warrantyDocuments); });
          await Promise.allSettled(S.data.map(async b => {
            try {
              const wdocs = arr(await GET(`/api/WarrantyDocuments/building/${b.id}`));
              b.warrantyDocuments = wdocs;
            } catch { /* keep existing array */ }
          }));
          const floors = arr(floorsData);
          S.params.allUnits = arr(allUnitsData).map(u=>{
            const floor = floors.find(f=>Number(f.id)===Number(u.floorId));
            return {...u, _buildingId: floor?.buildingId};
          });
          S.filtered = [...S.data];
          swap(renderView);
        }catch(e){ console.error(e); toast('فشل تحميل المباني','error'); }
      }

      async function showUnits(buildingId, buildingName, buildingCode){
        S.view='units'; S.page=1; S.filter=0;
        if(S.selecting) _exitSelectMode();
        const {projectId, projectName, projectCode} = S.params;
        S.params = {...S.params, buildingId:Number(buildingId), buildingName, buildingCode:buildingCode||''};
        window.__savePageState?.('projects', { view:'units', projectId, projectName, projectCode:projectCode||'', buildingId:Number(buildingId), buildingName, buildingCode:buildingCode||'' });
        setBreadcrumb([
          {label:'المشاريع',fn:'window.showProjects()'},
          {label:projectName,fn:`window.showBuildings(${projectId},'${esc(projectName)}','${esc(projectCode||'')}')`},
          {label:buildingName}
        ]);
        setAddBtn('إضافة دور',`window.openAddFloor(${buildingId})`);
        showSearchBar(false); showFilterBar(true); showSelToggle(true); showLoader();
        await ensureBuyers();
        try{
          const [floorsData, unitsData] = await Promise.all([GET('/api/Floors'), GET('/api/Units')]);
          const floors = arr(floorsData).filter(f=>Number(f.buildingId)===Number(buildingId)).sort((a,b)=>(a.floorNumber??0)-(b.floorNumber??0));
          const units  = arr(unitsData).filter(u=>floors.some(f=>Number(f.id)===Number(u.floorId))).sort((a,b)=>Number(a.unitNumber)-Number(b.unitNumber));
          S.data=[...floors]; S.filtered=[...floors]; S.params.units=units;
          swap(renderView);
        }catch(e){ console.error(e); toast('فشل تحميل الوحدات','error'); }
      }

      /* ══════════════════════════════════════════
         PROJECTS CRUD
         إضافة status و expectedDeliveryDate
      ══════════════════════════════════════════ */
      function projectStatusFormFields(currentStatus=2, currentDelivery=''){
        const isUnder = currentStatus === 1;
        return `
          <div class="form-group">
            <label class="form-label">حالة المشروع *</label>
            <select id="f-pstatus" class="form-select" onchange="window._toggleProjDeliveryDate(this)">
              <option value="2" ${!isUnder?'selected':''}>مكتمل</option>
              <option value="1" ${isUnder?'selected':''}>تحت الإنشاء</option>
            </select>
          </div>
          <div class="form-group" id="projDeliverySection" style="display:${isUnder?'block':'none'}">
            <label class="form-label"><i class="ri-calendar-event-line" style="color:var(--construction)"></i> تاريخ التسليم المتوقع</label>
            <input type="date" id="f-pdelivery" class="form-input" value="${currentDelivery}" style="color-scheme:dark">
            <div class="form-hint">اختياري — يظهر في كارد المشروع</div>
          </div>`;
      }
      window._toggleProjDeliveryDate = function(sel){
        const isUnder = Number(sel.value) === 1;
        const sec = document.getElementById('projDeliverySection');
        if(sec) sec.style.display = isUnder ? 'block' : 'none';
        const engWrap = document.getElementById('eng-section-wrap');
        if(engWrap) engWrap.style.display = (isUnder && window.__canDelete?.()) ? 'block' : 'none';
      };


      /* ══════════════════════════════════════════
         PROJECT WIZARD — 3 خطوات
         خطوة 1: بيانات المشروع + تعيين المهندسين
         خطوة 2: إضافة المباني + الأدوار + الوحدات
         خطوة 3: معاينة وإنشاء
      ══════════════════════════════════════════ */
      let _wiz = { name:'', location:'', description:'', status:2, delivery:'', engineers:[], buildings:[] };

      function _wizDefBld(){
        const used = _wiz.buildings.map(b=>b.letter);
        const letter = BUILDING_LETTERS.find(l=>!used.includes(l)) || 'A';
        return { letter, floors:5, upc:2, hasRoof:false, roofUpc:1, price:0, area:0 };
      }

      function _wizTotalUnits(){
        return _wiz.buildings.reduce((s,b)=>s+b.floors*b.upc+(b.hasRoof?b.roofUpc:0), 0);
      }

      function _wizStepBar(step){
        const s1=step===1?'active':'done', s2=step===1?'pending':(step===2?'active':'done'), s3=step<3?'pending':'active';
        const l1=step===1?'pending':'done', l2=step<3?'pending':'done';
        return `<div class="wiz-header">
          <div class="wiz-dot-wrap"><div class="wiz-dot ${s1}">${s1==='done'?'✓':'1'}</div><div class="wiz-lbl ${s1}">بيانات المشروع</div></div>
          <div class="wiz-line ${l1}"></div>
          <div class="wiz-dot-wrap"><div class="wiz-dot ${s2}">${s2==='done'?'✓':'2'}</div><div class="wiz-lbl ${s2}">المباني والوحدات</div></div>
          <div class="wiz-line ${l2}"></div>
          <div class="wiz-dot-wrap"><div class="wiz-dot ${s3}">3</div><div class="wiz-lbl ${s3}">معاينة وإنشاء</div></div>
        </div>`;
      }

      function _wizBldCardRoofExtra(b, i){
        return b.hasRoof
          ? `<input class="wiz-roof-inp" type="number" min="1" max="10" value="${b.roofUpc}" title="عدد وحدات الروف" oninput="window._wizUpdBld(${i},'roofUpc',Number(this.value)||1)"><span style="font-size:.73rem;color:rgba(195,155,211,.7)">وحدة روف</span>`
          : '';
      }

      function _wizBldCard(b, i){
        const usedByOthers = _wiz.buildings.filter((_,j)=>j!==i).map(x=>x.letter);
        const total = b.floors*b.upc+(b.hasRoof?b.roofUpc:0);
        const letterOpts = BUILDING_LETTERS.map(l=>`<option value="${l}" ${b.letter===l?'selected':''} ${usedByOthers.includes(l)?'disabled':''} style="${usedByOthers.includes(l)?'opacity:.35':''}">مبنى ${l}</option>`).join('');
        return `<div class="wiz-bld-card" data-bld-i="${i}">
          <div class="wiz-bld-card-header">
            <span class="wiz-bld-title"><i class="ri-building-2-line"></i> مبنى</span>
            <div style="display:flex;align-items:center;gap:6px">
              <select class="wiz-bld-letter" onchange="window._wizUpdBld(${i},'letter',this.value)">${letterOpts}</select>
              <button class="wiz-bld-del" onclick="window._wizDelBld(${i})" title="حذف"><i class="ri-close-line"></i></button>
            </div>
          </div>
          <div class="wiz-bld-card-body">
            <div class="form-row" style="gap:8px">
              <div class="form-group" style="margin-bottom:0"><label class="form-label">عدد الأدوار</label><input class="form-input" type="number" min="1" max="30" value="${b.floors}" oninput="window._wizUpdBld(${i},'floors',Number(this.value)||1)"></div>
              <div class="form-group" style="margin-bottom:0"><label class="form-label">وحدات/دور</label><input class="form-input" type="number" min="1" max="20" value="${b.upc}" oninput="window._wizUpdBld(${i},'upc',Number(this.value)||1)"></div>
            </div>
            <div class="form-row" style="gap:8px">
              <div class="form-group" style="margin-bottom:0"><label class="form-label">سعر افتراضي <span style="color:var(--text-muted);font-weight:400">(${window.CUR()})</span></label><input class="form-input" type="number" min="0" step="1000" placeholder="0" value="${b.price||''}" oninput="window._wizUpdBld(${i},'price',Number(this.value)||0)"></div>
              <div class="form-group" style="margin-bottom:0"><label class="form-label">مساحة افتراضية <span style="color:var(--text-muted);font-weight:400">(م²)</span></label><input class="form-input" type="number" min="0" step="0.5" placeholder="0" value="${b.area||''}" oninput="window._wizUpdBld(${i},'area',Number(this.value)||0)"></div>
            </div>
            <div class="wiz-roof-row">
              <label style="display:flex;align-items:center;gap:7px;cursor:pointer;font-size:.83rem;color:var(--text-muted)">
                <input type="checkbox" ${b.hasRoof?'checked':''} style="width:14px;height:14px;accent-color:#9b59b6" onchange="window._wizUpdBld(${i},'hasRoof',this.checked)">
                <span id="wiz-roof-lbl-${i}" style="${b.hasRoof?'color:#c39bd3':''}">دور روف</span>
              </label>
              <span id="wiz-roof-extra-${i}">${_wizBldCardRoofExtra(b,i)}</span>
            </div>
            <div class="wiz-bld-summary" id="wiz-bld-sum-${i}">إجمالي: <strong>${toEn(total)}</strong> وحدة — حالة: <strong>مقفول</strong></div>
          </div>
        </div>`;
      }

      function _wizSumCard(i){
        const b=_wiz.buildings[i]; if(!b)return;
        const total=b.floors*b.upc+(b.hasRoof?b.roofUpc:0);
        const el=document.getElementById(`wiz-bld-sum-${i}`);
        if(el) el.innerHTML=`إجمالي: <strong>${toEn(total)}</strong> وحدة — حالة: <strong>مقفول</strong>`;
        const totEl=document.getElementById('wiz-total-bar-txt');
        if(totEl){ const t=_wiz.buildings.reduce((s,b)=>s+(b.floors*b.upc+(b.hasRoof?b.roofUpc:0)),0); totEl.innerHTML=`${toEn(_wiz.buildings.length)} مبنى — إجمالي: <strong>${toEn(t)} وحدة</strong> — الحالة الافتراضية: <strong>مقفول</strong>`; }
      }

      function _wizRenderStep1(){
        return `${_wizStepBar(1)}
        <div class="modal-body" style="max-height:62vh;overflow-y:auto">
          <div class="form-group">
            <label class="form-label">اسم المشروع *</label>
            <input id="wiz-pname" class="form-input" placeholder="مثال: مشروع 1" value="${esc(_wiz.name)}">
            <div id="err-wiz-pname" class="form-error">الاسم موجود مسبقاً في النظام</div>
          </div>
          <div class="form-group">
            <label class="form-label">الموقع *</label>
            ${hoodSelect('wiz-ploc', _wiz.location)}
          </div>
          <div class="form-group">
            <label class="form-label">الوصف <span style="color:var(--text-muted);font-weight:400">(اختياري)</span></label>
            <textarea id="wiz-pdesc" class="form-input" rows="2" style="resize:none;padding:10px" placeholder="وصف مختصر عن المشروع">${esc(_wiz.description)}</textarea>
          </div>
          ${projectStatusFormFields(_wiz.status, _wiz.delivery)}
        </div>
        <div class="modal-footer">
          <button class="btn-submit" onclick="window._wizGoStep2()"><i class="ri-arrow-left-line"></i>التالي: المباني</button>
          <button class="btn-cancel" onclick="window.closeModal()">إلغاء</button>
        </div>`;
      }

      function _wizRenderStep2(){
        const total = _wizTotalUnits();
        const canAdd = _wiz.buildings.length < BUILDING_LETTERS.length;
        return `${_wizStepBar(2)}
        <div class="modal-body" id="wiz-bld-scroll" style="max-height:58vh;overflow-y:auto;padding-bottom:8px">
          <div id="wiz-bld-list" style="display:flex;flex-direction:column;gap:10px;margin-bottom:10px">
            ${_wiz.buildings.map((b,i)=>_wizBldCard(b,i)).join('')}
          </div>
          <button class="wiz-add-bld-btn" id="wiz-add-bld-btn" onclick="window._wizAddBld()" ${!canAdd?'disabled':''}>
            <i class="ri-add-line"></i>${canAdd?'إضافة مبنى آخر':'تم استخدام جميع الحروف'}
          </button>
          <div class="wiz-total-bar">
            <i class="ri-building-2-line"></i>
            <span id="wiz-total-bar-txt">${toEn(_wiz.buildings.length)} مبنى — إجمالي: <strong>${toEn(total)} وحدة</strong> — الحالة الافتراضية: <strong>مقفول</strong></span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-submit" onclick="window._wizGoStep3()"><i class="ri-arrow-left-line"></i>التالي: معاينة</button>
          <button class="btn-cancel" style="gap:5px" onclick="window._wizGoStep1Back()"><i class="ri-arrow-right-line"></i>رجوع</button>
        </div>`;
      }

      function _wizRenderStep3(){
        const total = _wizTotalUnits();
        const totalFloors = _wiz.buildings.reduce((s,b)=>s+b.floors+(b.hasRoof?1:0),0);
        const statusLabel = _wiz.status===1?'تحت الإنشاء':'مكتمل';
        const statusColor = _wiz.status===1?'var(--warning)':'var(--success)';
        const bldCards = _wiz.buildings.map(b=>{
          const bTotal = b.floors*b.upc+(b.hasRoof?b.roofUpc:0);
          const bFloors = b.floors+(b.hasRoof?1:0);
          return `<div style="padding:11px 14px;border-radius:10px;background:rgba(255,149,0,.04);border:1px solid rgba(255,149,0,.18);display:flex;align-items:center;gap:12px;flex-wrap:wrap">
            <div style="width:36px;height:36px;border-radius:9px;background:rgba(255,149,0,.12);border:1px solid rgba(255,149,0,.3);display:flex;align-items:center;justify-content:center;font-size:1rem;font-weight:800;color:var(--warning);flex-shrink:0">${b.letter}</div>
            <div style="flex:1;min-width:0">
              <div style="font-weight:700;font-size:.87rem;color:var(--light)">مبنى ${b.letter}</div>
              <div style="font-size:.74rem;color:var(--text-muted);margin-top:2px">${toEn(bFloors)} دور · ${toEn(b.upc)} وحدة/دور${b.hasRoof?` · روف (${toEn(b.roofUpc)} وحدة)`:''}</div>
            </div>
            <div style="display:flex;gap:10px;flex-shrink:0">
              ${b.price?`<div style="text-align:center"><div style="font-size:.72rem;color:var(--text-muted)">السعر</div><div style="font-size:.82rem;font-weight:700;color:var(--success);direction:ltr">${window.fmtMoney(b.price)}</div></div>`:''}
              ${b.area?`<div style="text-align:center"><div style="font-size:.72rem;color:var(--text-muted)">المساحة</div><div style="font-size:.82rem;font-weight:700;color:var(--accent)">${toEn(b.area)} م²</div></div>`:''}
              <div style="text-align:center"><div style="font-size:.72rem;color:var(--text-muted)">الوحدات</div><div style="font-size:.9rem;font-weight:800;color:var(--light)">${toEn(bTotal)}</div></div>
            </div>
          </div>`;
        }).join('');
        return `${_wizStepBar(3)}
        <div class="modal-body" style="max-height:60vh;overflow-y:auto">
          <div style="padding:14px 16px;border-radius:12px;background:rgba(78,141,245,.06);border:1px solid rgba(78,141,245,.18);margin-bottom:14px">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
              <div style="width:42px;height:42px;border-radius:10px;background:rgba(78,141,245,.12);border:1px solid rgba(78,141,245,.25);display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0">🏗️</div>
              <div style="flex:1;min-width:0">
                <div style="font-size:1rem;font-weight:800;color:var(--light)">${esc(_wiz.name)}</div>
                <div style="font-size:.78rem;color:var(--text-muted);margin-top:2px"><i class="ri-map-pin-line"></i> ${esc(_wiz.location)}</div>
              </div>
              <span style="padding:4px 12px;border-radius:20px;font-size:.74rem;font-weight:700;background:rgba(var(--fg-rgb), .05);border:1px solid;border-color:${statusColor};color:${statusColor};flex-shrink:0">${statusLabel}</span>
            </div>
            ${_wiz.delivery?`<div style="font-size:.76rem;color:var(--text-muted);margin-bottom:4px"><i class="ri-calendar-line"></i> موعد التسليم: <strong style="color:var(--light)">${_wiz.delivery}</strong></div>`:''}
            ${_wiz.description?`<div style="font-size:.76rem;color:var(--text-muted);margin-top:4px;line-height:1.5">${esc(_wiz.description)}</div>`:''}
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px">
            <div style="text-align:center;padding:12px 8px;border-radius:10px;background:rgba(var(--fg-rgb), .04);border:1px solid rgba(var(--fg-rgb), .07)"><div style="font-size:1.5rem;font-weight:800;color:var(--accent)">${toEn(_wiz.buildings.length)}</div><div style="font-size:.74rem;color:var(--text-muted);margin-top:3px">مبنى</div></div>
            <div style="text-align:center;padding:12px 8px;border-radius:10px;background:rgba(var(--fg-rgb), .04);border:1px solid rgba(var(--fg-rgb), .07)"><div style="font-size:1.5rem;font-weight:800;color:var(--warning)">${toEn(totalFloors)}</div><div style="font-size:.74rem;color:var(--text-muted);margin-top:3px">دور</div></div>
            <div style="text-align:center;padding:12px 8px;border-radius:10px;background:rgba(var(--fg-rgb), .04);border:1px solid rgba(var(--fg-rgb), .07)"><div style="font-size:1.5rem;font-weight:800;color:var(--success)">${toEn(total)}</div><div style="font-size:.74rem;color:var(--text-muted);margin-top:3px">وحدة</div></div>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <div style="font-size:.72rem;text-transform:uppercase;letter-spacing:.5px;color:var(--text-muted);font-weight:700;margin-bottom:2px">تفاصيل المباني</div>
            ${bldCards}
          </div>
          <div style="margin-top:12px;padding:10px 14px;border-radius:9px;background:rgba(52,199,89,.05);border:1px solid rgba(52,199,89,.18);font-size:.78rem;color:var(--text-muted);display:flex;align-items:center;gap:7px">
            <i class="ri-information-line" style="color:var(--success);font-size:1rem"></i>
            كل الوحدات ستُنشأ بحالة <strong style="color:var(--light)">مقفول</strong> — يمكنك تحديث الحالة والأسعار لاحقاً
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-submit" id="wiz-create-btn" onclick="window._wizCreate()"><i class="ri-check-line"></i>إنشاء المشروع</button>
          <button class="btn-cancel" style="gap:5px" onclick="window._wizGoStep2Back()"><i class="ri-arrow-right-line"></i>السابق</button>
        </div>`;
      }

      /* ══ دوال التنقل بين خطوات الـ wizard ══ */
      window._wizGoStep2 = function(){
        const name = document.getElementById('wiz-pname')?.value.trim()||'';
        const loc  = document.getElementById('wiz-ploc')?.value.trim()||'';
        const desc = document.getElementById('wiz-pdesc')?.value.trim()||'';
        if(!name||!loc){ toast('يرجى إدخال اسم المشروع والموقع','error'); return; }
        const errEl = document.getElementById('err-wiz-pname');
        if(S.data.find(p=>p.name.trim().toLowerCase()===name.toLowerCase())){
          if(errEl) errEl.style.display='block'; return;
        }
        if(errEl) errEl.style.display='none';
        _wiz.name        = name;
        _wiz.location    = loc;
        _wiz.description = desc;
        _wiz.status      = Number(document.getElementById('f-pstatus')?.value||2);
        _wiz.delivery    = _wiz.status===1?(document.getElementById('f-pdelivery')?.value||''):'';
        if(!_wiz.buildings.length) _wiz.buildings.push(_wizDefBld());
        document.getElementById('proj-modal-content').innerHTML = _wizRenderStep2();
      };
      window._wizGoStep1Back = function(){
        document.getElementById('proj-modal-content').innerHTML = _wizRenderStep1();
        setTimeout(()=>{ _csdAttach('wiz-ploc'); }, 0);
      };
      window._wizGoStep3 = function(){
        if(!_wiz.buildings.length){ toast('أضف مبنى واحداً على الأقل','error'); return; }
        document.getElementById('proj-modal-content').innerHTML = _wizRenderStep3();
      };
      window._wizGoStep2Back = function(){
        document.getElementById('proj-modal-content').innerHTML = _wizRenderStep2();
      };
      window._wizAddBld = function(){
        if(_wiz.buildings.length>=BUILDING_LETTERS.length) return;
        _wiz.buildings.push(_wizDefBld());
        document.getElementById('proj-modal-content').innerHTML = _wizRenderStep2();
      };
      window._wizDelBld = function(i){
        if(_wiz.buildings.length<=1) return;
        _wiz.buildings.splice(i,1);
        document.getElementById('proj-modal-content').innerHTML = _wizRenderStep2();
      };
      window._wizUpdBld = function(i, key, val){
        if(!_wiz.buildings[i]) return;
        _wiz.buildings[i][key] = val;
        _wizSumCard(i);
        if(key==='hasRoof'){
          const lblEl=document.getElementById(`wiz-roof-lbl-${i}`);
          const extEl=document.getElementById(`wiz-roof-extra-${i}`);
          if(lblEl) lblEl.style.color=val?'#c39bd3':'';
          if(extEl) extEl.innerHTML=_wizBldCardRoofExtra(_wiz.buildings[i],i);
        }
      };
      window._wizCreate = async function(){
        const btn=document.getElementById('wiz-create-btn');
        if(btn){ btn.disabled=true; btn.innerHTML='<i class="ri-loader-4-line" style="animation:spin .8s linear infinite;display:inline-block"></i> جاري الإنشاء...'; }
        try{
          /* 1 — إنشاء المشروع */
          const description = _wiz.description || '';
          const projRes = await POST('/api/Projects',{
            name:_wiz.name, location:_wiz.location, description,
            status:_wiz.status, expectedDeliveryDate:_wiz.delivery||null
          });
          const projectId = projRes?.id ?? projRes?.projectId;
          if(!projectId) throw new Error('فشل الحصول على رقم المشروع');

          /* 2 — إنشاء المباني + الأدوار + الوحدات */
          for(const b of _wiz.buildings){
            const bRes = await POST('/api/Buildings',{ name:b.letter, projectId:Number(projectId) });
            const buildingId = bRes?.id ?? bRes?.buildingId;
            if(!buildingId) continue;
            for(let fi=1; fi<=b.floors; fi++){
              const fRes = await POST('/api/Floors',{ buildingId:Number(buildingId), floorNumber:fi, isRoof:false, type:2 });
              const floorId = fRes?.id ?? fRes?.floorId;
              if(!floorId) continue;
              const tasks=[];
              for(let j=1;j<=b.upc;j++) tasks.push(POST('/api/Units',{ unitNumber:`${fi}${String(j).padStart(2,'0')}`, type:1, status:4, facing:0, area:Number(b.area)||0, rooms:0, price:Number(b.price)||0, floorId:Number(floorId) }));
              await Promise.allSettled(tasks);
            }
            if(b.hasRoof){
              const roofNum=b.floors+1;
              const rRes=await POST('/api/Floors',{ buildingId:Number(buildingId), floorNumber:roofNum, isRoof:true, type:3 });
              const roofFloorId=rRes?.id??rRes?.floorId;
              if(roofFloorId){
                const rTasks=[];
                for(let j=1;j<=b.roofUpc;j++) rTasks.push(POST('/api/Units',{ unitNumber:`R${String(j).padStart(2,'0')}`, type:2, status:4, facing:0, area:Number(b.area)||0, rooms:0, price:Number(b.price)||0, floorId:Number(roofFloorId) }));
                await Promise.allSettled(rTasks);
              }
            }
          }
          const totalU=_wizTotalUnits();
          toast(`🎉 تم إنشاء "${_wiz.name}" — ${toEn(_wiz.buildings.length)} مبنى · ${toEn(totalU)} وحدة`);
          closeModal();
          await showProjects();
        }catch(e){
          if(btn){ btn.disabled=false; btn.innerHTML='<i class="ri-check-line"></i>إنشاء المشروع'; }
          errToast(e);
        }
      };

      /* ENGINEER ASSIGNMENT — encoded in description field as <!--ENG:1,4,5--> */
      const ENG_RE = /<!--ENG:([\d,\s]*)-->/;
      const parseEng = d => { const m = (d||'').match(ENG_RE); return m ? m[1].split(',').map(s=>s.trim()).filter(Boolean) : []; };
      const stripEng = d => (d||'').replace(ENG_RE,'').trim();
      const attachEng = (d, ids) => {
        const clean = stripEng(d);
        const list = (ids||[]).map(String).filter(Boolean);
        if (list.length === 0) return clean;
        const marker = '<!--ENG:' + list.join(',') + '-->';
        return clean ? clean + '\n' + marker : marker;
      };

      let engineersList = [];
      async function ensureEngineers(){
        if (engineersList.length > 0) return;
        try {
          const data = await GET('/api/Users');
          const all = Array.isArray(data) ? data : (data && (data.data || data.users)) || [];
          engineersList = all.filter(u => {
            const role = u.role || String(u.roleId || '');
            return (role === 'SiteEngineer' || role === '3') && u.isActive !== false;
          });
        } catch { engineersList = []; }
      }

      function buildEngineersUI(selectedIds){
        selectedIds = selectedIds || [];
        const sel = new Set(selectedIds.map(String));
        if (engineersList.length === 0) {
          return '<div class="form-group">' +
            '<label class="form-label"><i class="ri-user-settings-line"></i> المهندسون المخصصون</label>' +
            '<div style="padding:14px;background:rgba(255,204,0,.08);border:1px solid rgba(255,204,0,.25);border-radius:10px;color:#ffcc00;font-size:.82rem;text-align:center">' +
            '<i class="ri-information-line"></i> لا يوجد مهندسون نشطون. أضف مهندسين من صفحة المستخدمين أولاً.' +
            '</div></div>';
        }
        const chips = engineersList.map(eng => {
          const checked = sel.has(String(eng.id));
          const fullName = ((eng.firstName||'') + ' ' + (eng.lastName||'')).trim() || eng.email || ('#' + eng.id);
          const bg = checked ? 'rgba(78,141,245,.18)' : 'rgba(var(--fg-rgb), .04)';
          const bd = checked ? 'var(--accent)' : 'rgba(var(--fg-rgb), .1)';
          const cl = checked ? 'var(--accent)' : 'var(--text-muted)';
          return '<label class="eng-chip" style="display:inline-flex;align-items:center;gap:7px;padding:7px 13px;border-radius:20px;cursor:pointer;font-size:.83rem;font-weight:600;user-select:none;transition:var(--transition);background:'+bg+';border:1px solid '+bd+';color:'+cl+'">' +
                 '<input type="checkbox" data-eng="'+eng.id+'" '+(checked?'checked':'')+' style="width:14px;height:14px;cursor:pointer;accent-color:var(--accent);margin:0">' +
                 '<i class="ri-user-line" style="font-size:.92rem"></i>'+esc(fullName) +
                 '</label>';
        }).join('');
        return '<div class="form-group">' +
          '<label class="form-label"><i class="ri-user-settings-line"></i> المهندسون المخصصون <span style="color:var(--text-muted);font-weight:400;font-size:.78rem">(اختيار متعدد)</span></label>' +
          '<div id="eng-chips" style="display:flex;flex-wrap:wrap;gap:7px;padding:12px;background:rgba(var(--fg-rgb), .04);border:1px solid rgba(var(--fg-rgb), .1);border-radius:10px;max-height:180px;overflow-y:auto">' +
          chips +
          '</div>' +
          '<div style="font-size:.74rem;color:var(--text-muted);margin-top:7px;display:flex;align-items:center;gap:5px">' +
          '<i class="ri-information-line"></i> كل مهندس مختار سيرى هذا المشروع فقط في لوحته' +
          '</div></div>';
      }

      function bindEngineerChips(){
        document.querySelectorAll('#eng-chips input[type=checkbox][data-eng]').forEach(cb => {
          cb.addEventListener('change', () => {
            const lbl = cb.closest('.eng-chip');
            if (!lbl) return;
            if (cb.checked) {
              lbl.style.background = 'rgba(78,141,245,.18)';
              lbl.style.borderColor = 'var(--accent)';
              lbl.style.color = 'var(--accent)';
            } else {
              lbl.style.background = 'rgba(var(--fg-rgb), .04)';
              lbl.style.borderColor = 'rgba(var(--fg-rgb), .1)';
              lbl.style.color = 'var(--text-muted)';
            }
          });
        });
      }

      function getSelectedEngineerIds(){
        return Array.from(document.querySelectorAll('#eng-chips input[type=checkbox][data-eng]:checked')).map(c => c.dataset.eng);
      }

      async function openAddProject(){
        _wiz = { name:'', location:'', description:'', status:2, delivery:'', engineers:[], buildings:[] };
        openModal('إضافة مشروع جديد', _wizRenderStep1(), true);
        setTimeout(()=>{ _csdAttach('wiz-ploc'); }, 0);
      }
      async function submitAddProject(){
        const name=v('f-pname'),location=v('f-ploc'),userDesc=v('f-pdesc');
        const statusVal=Number(document.getElementById('f-pstatus')?.value||2);
        const delivery=statusVal===1?v('f-pdelivery'):'';
        document.getElementById('err-pname').style.display='none';
        if(!name||!location){toast('يرجى ملء الحقول الإلزامية','error');return;}
        if(S.data.find(p=>p.name.trim().toLowerCase()===name.toLowerCase())){document.getElementById('err-pname').style.display='block';return;}
        const description = userDesc;
        setBusy('submitBtn',true);
        try{
          await POST('/api/Projects',{name,location,description,status:statusVal,expectedDeliveryDate:delivery||null});
          toast('تم إضافة المشروع');closeModal();await showProjects();
        }catch(e){toast('فشل: ' + e.message,'error');}
        setBusy('submitBtn',false);
      }
      async function editProject(id){
        try{
          const p=await GET(`/api/Projects/${id}`);
          const cleanDesc = stripEng(p.description || '');
          const curStatus = toProjStatus(p.status);
          const curDelivery = p.expectedDeliveryDate ? fmtDateInput(p.expectedDeliveryDate) : '';
          openModal('تعديل المشروع',
            '<div class="modal-body">' +
            '<input type="hidden" id="f-existing-desc" value="' + esc(p.description||'') + '">' +
            '<div class="form-group"><label class="form-label">اسم المشروع *</label><input id="f-pname" class="form-input" value="' + esc(p.name||'') + '"><div id="err-pname" class="form-error">الاسم موجود مسبقاً</div></div>' +
            '<div class="form-group"><label class="form-label">الموقع *</label>' + hoodSelect('f-ploc', p.location||'') + '</div>' +
            '<div class="form-group"><label class="form-label">وصف المشروع <span style="color:var(--text-muted);font-weight:400">(اختياري)</span></label><textarea id="f-pdesc" class="form-input" rows="2" style="resize:none;padding:10px">' + esc(cleanDesc) + '</textarea></div>' +
            projectStatusFormFields(curStatus, curDelivery) +
            '</div>' +
            '<div class="modal-footer">' +
            '<button class="btn-submit" id="submitBtn" onclick="window.submitEditProject(' + id + ')"><i class="ri-save-line"></i>حفظ</button>' +
            '<button class="btn-cancel" onclick="window.closeModal()">إلغاء</button>' +
            '</div>');
          setTimeout(()=>{ _csdAttach('f-ploc'); }, 0);
        }catch{toast('فشل تحميل البيانات','error');}
      }
      async function submitEditProject(id){
        const name=v('f-pname'),location=v('f-ploc'),userDesc=v('f-pdesc');
        const statusVal=Number(document.getElementById('f-pstatus')?.value||2);
        const delivery=statusVal===1?v('f-pdelivery'):'';
        if(!name||!location){toast('يرجى ملء الحقول الإلزامية','error');return;}
        /* preserve existing engineer assignments stored in description */
        const existingRaw = document.getElementById('f-existing-desc')?.value || '';
        const description = attachEng(userDesc, parseEng(existingRaw));
        setBusy('submitBtn',true);
        try{
          await PUT(`/api/Projects/${id}`,{name,location,description,status:statusVal,expectedDeliveryDate:delivery||null});
          toast('تم التعديل');closeModal();await showProjects();
        }catch(e){toast('فشل: ' + e.message,'error');}
        setBusy('submitBtn',false);
      }
            function deleteProject(id, name){
        openModal('حذف المشروع',`<div class="modal-body"><div class="confirm-box">
          <div class="confirm-icon">🗑️</div>
          <p class="confirm-msg">هل أنت متأكد من حذف مشروع <strong>${esc(name)}</strong>؟<br>سيتم حذف جميع المباني والوحدات المرتبطة.</p>
          <div class="confirm-actions">
            <button class="btn-danger" id="submitBtn" onclick="window.confirmDeleteProject(${id})"><i class="ri-delete-bin-line"></i>نعم، احذف</button>
            <button class="btn-cancel" onclick="window.closeModal()">إلغاء</button>
          </div></div></div>`);
      }
      async function confirmDeleteProject(id){
        setBusy('submitBtn',true,'احذف');
        try{ await DELETE(`/api/Projects/${id}`); toast('تم الحذف'); closeModal(); await showProjects(); }
        catch(e){ errToast(e); }
        setBusy('submitBtn',false,'احذف');
      }

      /* ══════════════════════════════════════════
         BUILDINGS CRUD
         شالت منها status و expectedDeliveryDate
      ══════════════════════════════════════════ */
      function openAddBuilding(projectId){
        const usedCodes = S.data.map(b=>(b.name||'').toUpperCase().trim());
        const availLetters = BUILDING_LETTERS.filter(l=>!usedCodes.includes(l));
        openModal('إضافة مبنى جديد',`<div class="modal-body">
          <div class="form-group">
            <label class="form-label">حرف المبنى *</label>
            ${availLetters.length > 0
              ? `<select id="f-bcode" class="form-select">${availLetters.map(l=>`<option value="${l}">${l}</option>`).join('')}</select>`
              : `<div style="padding:12px 14px;background:rgba(255,59,48,.08);border:1px solid rgba(255,59,48,.25);border-radius:9px;font-size:.85rem;color:var(--danger);display:flex;align-items:center;gap:8px"><i class="ri-error-warning-line"></i>تم استخدام جميع الحروف المتاحة (A – H)</div><input type="hidden" id="f-bcode" value="">`}
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">عدد الأدوار *</label>
              <input id="f-bfloors" class="form-input" type="number" min="1" max="30" value="5" oninput="window._bwizPreview()">
            </div>
            <div class="form-group">
              <label class="form-label">وحدات في كل دور *</label>
              <input id="f-bupc" class="form-input" type="number" min="1" max="20" value="2" oninput="window._bwizPreview()">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" style="display:flex;align-items:center;gap:10px;cursor:pointer">
              <input type="checkbox" id="f-broof" style="width:15px;height:15px;accent-color:var(--accent)" onchange="window._bwizPreview()">
              إضافة دور روف
            </label>
            <div id="f-roofcount-wrap" style="display:none;margin-top:10px">
              <label class="form-label">عدد وحدات الروف</label>
              <input id="f-broofupc" class="form-input" type="number" min="1" max="20" value="1" oninput="window._bwizPreview()">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">السعر الافتراضي <span style="color:var(--text-muted);font-weight:400">(اختياري)</span></label>
              <input id="f-bprice" class="form-input" type="number" min="0" step="1000" placeholder="0" oninput="window._bwizPreview()">
            </div>
            <div class="form-group">
              <label class="form-label">المساحة الافتراضية م² <span style="color:var(--text-muted);font-weight:400">(اختياري)</span></label>
              <input id="f-barea" class="form-input" type="number" min="0" step="0.5" placeholder="0">
            </div>
          </div>
          <div class="bwiz-preview" id="bwiz-preview-box">
            <i class="ri-information-line"></i>
            <span id="bwiz-preview-txt">سيتم إنشاء <strong>10</strong> وحدة بحالة: <strong>مقفول</strong></span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-submit" id="submitBtn" onclick="window.submitAddBuilding(${projectId})"><i class="ri-building-line"></i>إنشاء المبنى</button>
          <button class="btn-cancel" onclick="window.closeModal()">إلغاء</button>
        </div>`);
        document.getElementById('f-broof').addEventListener('change', function(){
          document.getElementById('f-roofcount-wrap').style.display = this.checked ? 'block' : 'none';
        });
        window._bwizPreview();
      }
      window._bwizPreview = function(){
        const floors=Math.max(1,Number(document.getElementById('f-bfloors')?.value)||5);
        const upc=Math.max(1,Number(document.getElementById('f-bupc')?.value)||2);
        const hasRoof=document.getElementById('f-broof')?.checked||false;
        const roofUpc=Math.max(1,Number(document.getElementById('f-broofupc')?.value)||1);
        const total=floors*upc+(hasRoof?roofUpc:0);
        const price=Number(document.getElementById('f-bprice')?.value)||0;
        const priceNote=price>0?` — سعر: <strong>${window.fmtMoney(price)}</strong>`:'';
        const txt=document.getElementById('bwiz-preview-txt');
        if(txt) txt.innerHTML=`سيتم إنشاء <strong>${toEn(total)}</strong> وحدة بحالة: <strong>مقفول</strong>${priceNote}`;
      };

      async function submitAddBuilding(projectId){
        const code      = v('f-bcode');
        const floors    = Math.max(1, Number(v('f-bfloors')) || 5);
        const upc       = Math.max(1, Number(v('f-bupc')) || 2);
        const hasRoof   = document.getElementById('f-broof')?.checked || false;
        const roofUpc   = Math.max(1, Number(v('f-broofupc')) || 1);
        const defPrice  = Number(v('f-bprice')) || 0;
        const defArea   = Number(v('f-barea')) || 0;
        if(!code){ toast('يرجى اختيار حرف المبنى','error'); return; }
        if(floors < 1 || floors > 30){ toast('عدد الطوابق يجب أن يكون بين 1 و 30','error'); return; }
        if(upc < 1 || upc > 20){ toast('عدد الوحدات في الطابق يجب أن يكون بين 1 و 20','error'); return; }
        if(defPrice < 0){ toast('سعر الوحدة لا يمكن أن يكون سالباً','error'); return; }
        if(defArea < 0){ toast('مساحة الوحدة لا يمكن أن تكون سالبة','error'); return; }
        setBusy('submitBtn',true,'إنشاء المبنى');
        try{
          const res = await POST('/api/Buildings',{ name:code, projectId:Number(projectId) });
          const buildingId = res?.id || res?.buildingId;
          if(buildingId){
            for(let i=1; i<=floors; i++){
              const floorRes = await POST('/api/Floors',{buildingId:Number(buildingId), floorNumber:i, isRoof:false, type:2});
              const floorId  = floorRes?.id || floorRes?.floorId;
              if(floorId){
                const tasks=[];
                for(let j=1;j<=upc;j++) tasks.push(POST('/api/Units',{unitNumber:`${i}${String(j).padStart(2,'0')}`,type:1,status:4,facing:0,area:defArea,rooms:0,price:defPrice,floorId:Number(floorId)}));
                await Promise.allSettled(tasks);
              }
            }
            if(hasRoof){
              const roofNum = floors+1;
              const roofRes = await POST('/api/Floors',{buildingId:Number(buildingId), floorNumber:roofNum, isRoof:true, type:3});
              const roofFloorId = roofRes?.id || roofRes?.floorId;
              if(roofFloorId){
                const roofTasks=[];
                for(let j=1;j<=roofUpc;j++) roofTasks.push(POST('/api/Units',{unitNumber:`R${String(j).padStart(2,'0')}`,type:2,status:4,facing:0,area:defArea,rooms:0,price:defPrice,floorId:Number(roofFloorId)}));
                await Promise.allSettled(roofTasks);
              }
            }
          }
          const total=floors*upc+(hasRoof?roofUpc:0);
          toast(`تم إنشاء مبنى ${code} — ${toEn(floors)} دور، ${toEn(total)} وحدة`); closeModal();
          await showBuildings(S.params.projectId, S.params.projectName, S.params.projectCode);
        }catch(e){ errToast(e); }
        setBusy('submitBtn',false);
      }

      async function editBuilding(id){
        try{
          const b = await GET(`/api/Buildings/${id}`);
          openModal('تعديل المبنى',`<div class="modal-body">
            <div class="form-group">
              <label class="form-label">حرف المبنى</label>
              <div style="padding:10px 14px;background:rgba(var(--fg-rgb), .04);border:1px solid rgba(var(--fg-rgb), .1);border-radius:9px;font-weight:700;font-size:1rem">${esc(b.name)}</div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-submit" id="submitBtn" onclick="window.submitEditBuilding(${id},'${esc(b.name)}')"><i class="ri-save-line"></i>حفظ</button>
            <button class="btn-cancel" onclick="window.closeModal()">إلغاء</button>
          </div>`);
        }catch{ toast('فشل تحميل البيانات','error'); }
      }

      async function submitEditBuilding(id, name){
        setBusy('submitBtn',true);
        try{
          await PUT(`/api/Buildings/${id}`,{ name, projectId:S.params.projectId });
          toast('تم التعديل'); closeModal();
          await showBuildings(S.params.projectId, S.params.projectName, S.params.projectCode);
        }catch(e){ errToast(e); }
        setBusy('submitBtn',false);
      }

      function deleteBuilding(id, name){
        openModal('حذف المبنى',`<div class="modal-body"><div class="confirm-box">
          <div class="confirm-icon">🗑️</div>
          <p class="confirm-msg">هل أنت متأكد من حذف مبنى <strong>${esc(name)}</strong>؟</p>
          <div class="confirm-actions">
            <button class="btn-danger" id="submitBtn" onclick="window.confirmDeleteBuilding(${id})"><i class="ri-delete-bin-line"></i>نعم، احذف</button>
            <button class="btn-cancel" onclick="window.closeModal()">إلغاء</button>
          </div></div></div>`);
      }
      async function confirmDeleteBuilding(id){
        setBusy('submitBtn',true,'احذف');
        try{
          await DELETE(`/api/Buildings/${id}`); toast('تم الحذف'); closeModal();
          await showBuildings(S.params.projectId, S.params.projectName, S.params.projectCode);
        }catch(e){ errToast(e); }
        setBusy('submitBtn',false,'احذف');
      }

      /* ══ FLOORS CRUD ══ */
      function openAddFloor(buildingId){
        const existNums = S.data.map(f=>f.floorNumber);
        const hasRoofFloor = S.data.some(f=>f.isRoof||f.type===3||String(f.type).toLowerCase()==='roof');
        const nextFloor = (existNums.length ? Math.max(...existNums) : 0) + 1;
        openModal('إضافة دور جديد',`<div class="modal-body">
          <div class="form-row">
            <div class="form-group"><label class="form-label">رقم الدور *</label><input id="f-fnum" class="form-input" type="number" min="1" value="${nextFloor}"></div>
            <div class="form-group"><label class="form-label">عدد الوحدات *</label><input id="f-fupc" class="form-input" type="number" min="1" max="20" value="2"></div>
          </div>
          <div class="form-group">
            <label class="form-label" style="display:flex;align-items:center;gap:10px;cursor:pointer">
              <input type="checkbox" id="f-fisroof" style="width:15px;height:15px;accent-color:var(--accent)" ${hasRoofFloor?'disabled':''}>
              دور روف ${hasRoofFloor?'<span style="color:var(--text-muted);font-weight:400;font-size:.78rem">(موجود مسبقاً)</span>':''}
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-submit" id="submitBtn" onclick="window.submitAddFloor(${buildingId})"><i class="ri-save-line"></i>إضافة</button>
          <button class="btn-cancel" onclick="window.closeModal()">إلغاء</button>
        </div>`);
      }
      async function submitAddFloor(buildingId){
        const floorNumber = Number(v('f-fnum'));
        const upc = Math.max(1, Number(v('f-fupc')) || 2);
        const isRoof = document.getElementById('f-fisroof')?.checked || false;
        const ftype = isRoof ? 3 : 2;
        const unitType = isRoof ? 2 : 1;
        if(!floorNumber||floorNumber<1){ toast('يرجى إدخال رقم دور صحيح','error'); return; }
        if(S.data.find(f=>f.floorNumber===floorNumber)){ toast('رقم الدور موجود مسبقاً','error'); return; }
        setBusy('submitBtn',true);
        try{
          const floorRes = await POST('/api/Floors',{buildingId:Number(buildingId), floorNumber, isRoof, type:ftype});
          const floorId  = floorRes?.id || floorRes?.floorId;
          if(floorId){
            const prefix = isRoof ? 'R' : String(floorNumber);
            const tasks = [];
            for(let j=1;j<=upc;j++) tasks.push(POST('/api/Units',{unitNumber:`${prefix}${String(j).padStart(2,'0')}`,type:unitType,status:4,facing:0,area:0,rooms:0,price:0,floorId:Number(floorId)}));
            await Promise.allSettled(tasks);
          }
          toast(`تم إضافة الدور${isRoof?' (روف)':''} مع ${toEn(upc)} وحدات`); closeModal();
          await showUnits(buildingId, S.params.buildingName, S.params.buildingCode);
        }catch(e){ errToast(e); }
        setBusy('submitBtn',false);
      }

      /* ══ UNITS CRUD ══ */
      let _selectedBuyerId = null;
      function buildClientPicker(selectedId=null){
        _selectedBuyerId = selectedId || null;
        return `<div class="client-search-wrap">
          <i class="client-search-icon ri-search-line"></i>
          <input type="text" id="clientSearchInput" class="client-search-input" placeholder="ابحث باسم العميل أو رقمه..." oninput="window._filterClients()">
        </div><div class="client-list" id="clientList"></div>`;
      }
      function renderClientList(q=''){
        const el = document.getElementById('clientList'); if(!el) return;
        const filtered = S.buyers.filter(b=>{
          const name = buyerName(b).toLowerCase();
          return name.includes(q.toLowerCase())||(b.phoneNumber||'').includes(q)||(b.nationalId||'').includes(q)||(b.email||'').toLowerCase().includes(q.toLowerCase());
        });
        if(!filtered.length){ el.innerHTML=`<div class="client-empty"><i class="ri-user-search-line" style="font-size:1.5rem;display:block;margin-bottom:8px;opacity:.4"></i>لا يوجد عملاء مطابقون</div>`; return; }
        el.innerHTML=filtered.map(b=>{
          const sel = String(_selectedBuyerId)===String(b.id);
          return `<div class="client-item${sel?' selected':''}" onclick="window._selectClient(${b.id},this)">
            <div class="client-avatar">${buyerInitials(b)}</div>
            <div><div class="client-info-name">${esc(buyerName(b))}</div><div class="client-info-sub">${esc(b.phoneNumber||b.email||'')}</div></div>
          </div>`;
        }).join('');
      }
      window._filterClients = ()=>renderClientList(document.getElementById('clientSearchInput')?.value||'');
      window._selectClient  = (id,el)=>{
        _selectedBuyerId = id;
        document.querySelectorAll('.client-item').forEach(i=>i.classList.remove('selected'));
        if(el) el.classList.add('selected');
      };

      function uStatusOpts(sel=1){ const selNum=toStatus(sel); return [{v:1,l:'متاح'},{v:2,l:'محجوز'},{v:3,l:'مباع'},{v:4,l:'مقفول'}].map(o=>`<option value="${o.v}" ${selNum===o.v?'selected':''}>${o.l}</option>`).join(''); }
      function uTypeOpts(sel=1){ const selNum=toType(sel); return [{v:1,l:'شقة'},{v:2,l:'روف'}].map(o=>`<option value="${o.v}" ${selNum===o.v?'selected':''}>${o.l}</option>`).join(''); }
      function uFacingOpts(sel=0){ const selNum=toFacing(sel); return [{v:0,l:'غير محدد'},{v:1,l:'أمامي على شارع'},{v:2,l:'أمامي على شارعين'},{v:3,l:'خلفي'}].map(o=>`<option value="${o.v}" ${selNum===o.v?'selected':''}>${o.l}</option>`).join(''); }

      window.handleUnitStatusChange = function(sel){
        const section=document.getElementById('clientPickerSection'); if(!section)return;
        const st=Number(sel.value);
        const prevSt=Number(sel.dataset.prev||sel.getAttribute('data-prev')||0);
        if((prevSt===3||prevSt===2)&&(st===1||st===4)){
          const action=prevSt===3?'مباعة':'محجوزة';
          if(!confirm(`تنبيه: هذه الوحدة ${action}. تغيير حالتها سيلغي ارتباطها بالعميل الحالي. هل أنت متأكد؟`)){
            sel.value=String(prevSt); return;
          }
        }
        sel.dataset.prev=String(st);
        if(st===2||st===3){
          section.style.display='block';
          const txt=document.getElementById('cPickerText'); if(txt)txt.textContent=(st===3?'مباع لـ':'محجوز لـ');
          const priceInp=document.getElementById('f-uprice');
          if(priceInp) priceInp.style.borderColor=st===3?'rgba(255,59,48,.4)':'';
        }else{
          section.style.display='none'; _selectedBuyerId=null;
          const priceInp=document.getElementById('f-uprice');
          if(priceInp) priceInp.style.borderColor='';
        }
      };

      let _addFloorId = null;
      async function openAddUnit(floorId, floorNumber, isRoof=false){
        _addFloorId = floorId;
        const existingInFloor = (S.params.units||[]).filter(u=>Number(u.floorId)===Number(floorId));
        const prefix = isRoof ? 'R' : String(floorNumber);
        const suggestedNum = `${prefix}${String(existingInFloor.length+1).padStart(2,'0')}`;
        const defaultType  = isRoof ? 2 : 1;
        openModal('إضافة وحدة',`<div class="modal-body">
          <div class="form-row">
            <div class="form-group"><label class="form-label">رقم الوحدة *</label><input id="f-unum" class="form-input" value="${suggestedNum}"><div id="err-unum" class="form-error">الرقم موجود في هذا الدور</div></div>
            <div class="form-group"><label class="form-label">نوع الوحدة</label><select id="f-utype" class="form-select">${uTypeOpts(defaultType)}</select></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">الحالة</label><select id="f-ustatus" class="form-select" onchange="window.handleUnitStatusChange(this)">${uStatusOpts(4)}</select></div>
            <div class="form-group"><label class="form-label">السعر (${window.CUR()})</label><input id="f-uprice" class="form-input" type="number" min="0" step="1000" placeholder="0"></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label class="form-label">الواجهة</label><select id="f-ufacing" class="form-select">${uFacingOpts(0)}</select></div>
            <div class="form-group"><label class="form-label">عدد الغرف</label><input id="f-urooms" class="form-input" type="number" min="0" max="20" step="1" placeholder="0" value="0"></div>
          </div>
          <div class="form-group">
            <label class="form-label">المساحة (م²) <span style="color:var(--text-muted);font-weight:400">(اختياري)</span></label>
            <input id="f-uarea" class="form-input" type="number" step="0.5" placeholder="0">
          </div>
          <div id="clientPickerSection" style="display:none">
            <div class="client-picker-label"><i class="ri-user-line"></i>اختر العميل *</div>${buildClientPicker(null)}
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-submit" id="submitBtn" onclick="window.submitAddUnit()"><i class="ri-save-line"></i>حفظ</button>
          <button class="btn-cancel" onclick="window.closeModal()">إلغاء</button>
        </div>`);
        setTimeout(()=>renderClientList(''),50);
      }
      async function submitAddUnit(){
        const floorId    = _addFloorId;
        const unitNumber = v('f-unum');
        const utype      = Number(v('f-utype'));
        const status     = Number(v('f-ustatus'));
        const facing     = Number(v('f-ufacing')||0);
        const rooms      = Number(v('f-urooms'))||0;
        const area       = Number(v('f-uarea'))||0;
        const price      = Number(v('f-uprice'))||0;
        if(!unitNumber||!floorId){ toast('يرجى إدخال رقم الوحدة','error'); return; }
        const dup = (S.params.units||[]).find(u=>Number(u.floorId)===Number(floorId)&&String(u.unitNumber).trim()===unitNumber);
        if(dup){ document.getElementById('err-unum').style.display='block'; return; }
        if(status===3&&(!price||price<=0)){ toast('يجب تحديد سعر البيع للوحدة قبل إتمام عملية البيع','error'); return; }
        if(price<0){ toast('سعر الوحدة لا يمكن أن يكون سالباً','error'); return; }
        if((status===2||status===3)&&!_selectedBuyerId){ toast('يرجى اختيار عميل للحجز أو البيع','error'); return; }
        setBusy('submitBtn',true);
        try{
          const backendStatus = (status===2||status===3) ? 1 : status;
          const newUnit = await POST('/api/Units',{unitNumber,type:utype,status:backendStatus,facing,area,rooms,price,floorId:Number(floorId),buyerId:null});
          const unitId  = newUnit?.id || newUnit?.unitId;
          if(unitId && (status===2||status===3)){
            await POST('/api/Bookings',{status:status===3?2:1,amountPaid:0,remainingAmount:0,buyerId:_selectedBuyerId,unitId});
            // Booking service auto-updates unit status & buyerId, no extra PUT needed
          }
          toast('تم إضافة الوحدة'); closeModal();
          await showUnits(S.params.buildingId, S.params.buildingName, S.params.buildingCode);
        }catch(e){ errToast(e); }
        setBusy('submitBtn',false);
      }

      let _editUnitFacing = 0, _editUnitRooms = 0;
      async function editUnit(id){
        await ensureBuyers();
        try{
          const u = await GET(`/api/Units/${id}`);
          const currStatus = toStatus(u.status), currType = toType(u.type);
          _editUnitFacing = toFacing(u.facing);
          _editUnitRooms  = Number(u.rooms)||0;
          const bookingIdFromApi = u.bookingId || null;
          openModal('تعديل الوحدة',`<div class="modal-body">
            <div class="form-row">
              <div class="form-group"><label class="form-label">رقم الوحدة *</label><input id="f-unum" class="form-input" value="${esc(String(u.unitNumber||''))}"></div>
              <div class="form-group"><label class="form-label">نوع الوحدة</label><select id="f-utype" class="form-select">${uTypeOpts(currType)}</select></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label class="form-label">الحالة</label><select id="f-ustatus" class="form-select" data-prev="${currStatus}" onchange="window.handleUnitStatusChange(this)">${uStatusOpts(currStatus)}</select></div>
              <div class="form-group"><label class="form-label">السعر (${window.CUR()})</label><input id="f-uprice" class="form-input" type="number" min="0" step="1000" value="${u.price||0}"></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label class="form-label">الواجهة</label><select id="f-ufacing" class="form-select">${uFacingOpts(_editUnitFacing)}</select></div>
              <div class="form-group"><label class="form-label">عدد الغرف</label><input id="f-urooms" class="form-input" type="number" min="0" max="20" step="1" value="${_editUnitRooms}"></div>
            </div>
            <div class="form-group">
              <label class="form-label">المساحة (م²) <span style="color:var(--text-muted);font-weight:400">(اختياري)</span></label>
              <input id="f-uarea" class="form-input" type="number" step="0.5" value="${u.area||0}">
            </div>
            <div id="clientPickerSection" style="display:${currStatus===2||currStatus===3?'block':'none'}">
              <div class="client-picker-label"><i class="ri-user-line"></i><span id="cPickerText">${currStatus===3?'مباع لـ':'محجوز لـ'}</span> *</div>
              ${buildClientPicker(u.buyerId||null)}
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-submit" id="submitBtn" onclick="window.submitEditUnit(${id},${u.floorId},${currStatus},${bookingIdFromApi||'null'})"><i class="ri-save-line"></i>حفظ</button>
            <button class="btn-cancel" onclick="window.closeModal()">إلغاء</button>
          </div>`, true);
          _selectedBuyerId = u.buyerId || null;
          setTimeout(()=>{ renderClientList(''); }, 50);
        }catch(e){ console.error(e); toast('فشل تحميل بيانات الوحدة','error'); }
      }

      async function submitEditUnit(id, floorId, oldStatus, existingBookingId){
        const unitNumber = v('f-unum');
        const utype      = Number(v('f-utype'));
        const status     = Number(v('f-ustatus'));
        const facing     = Number(v('f-ufacing')||0);
        const rooms      = Number(v('f-urooms'))||0;
        const area       = Number(v('f-uarea'))||0;
        const price      = Number(v('f-uprice'))||0;
        if(!unitNumber){ toast('يرجى إدخال رقم الوحدة','error'); return; }
        if(status===3&&(!price||price<=0)){ toast('يجب تحديد سعر البيع للوحدة قبل إتمام عملية البيع','error'); return; }
        if(price<0){ toast('سعر الوحدة لا يمكن أن يكون سالباً','error'); return; }
        if((status===2||status===3)&&!_selectedBuyerId){ toast('يرجى اختيار عميل للحجز أو البيع','error'); return; }
        setBusy('submitBtn',true);
        try{
          const isNowBooked = (status===2||status===3);
          const wasBooked   = (oldStatus===2||oldStatus===3);
          const bookingStatusId = status===3 ? 2 : 1;
          const newBuyerId  = isNowBooked ? _selectedBuyerId : null;
          await PUT(`/api/Units/${id}`,{unitNumber,type:utype,status,facing,area,rooms,price,floorId:Number(floorId),buyerId:newBuyerId});
          if(isNowBooked&&!wasBooked){
            await POST('/api/Bookings',{status:bookingStatusId,amountPaid:0,remainingAmount:0,buyerId:_selectedBuyerId,unitId:id});
          } else if(isNowBooked&&wasBooked&&existingBookingId&&existingBookingId!=='null'){
            await PUT(`/api/Bookings/${existingBookingId}`,{status:bookingStatusId,amountPaid:0,remainingAmount:0,buyerId:_selectedBuyerId,unitId:id});
          } else if(!isNowBooked&&wasBooked&&existingBookingId&&existingBookingId!=='null'){
            await DELETE(`/api/Bookings/${existingBookingId}`);
          }
          toast('تم التعديل بنجاح'); closeModal();
          await showUnits(S.params.buildingId, S.params.buildingName, S.params.buildingCode);
        }catch(e){ errToast(e); }
        setBusy('submitBtn',false);
      }

      function deleteUnit(id, num){
        openModal('حذف الوحدة',`<div class="modal-body"><div class="confirm-box">
          <div class="confirm-icon">🗑️</div>
          <p class="confirm-msg">هل أنت متأكد من حذف وحدة رقم <strong>${esc(String(num))}</strong>؟</p>
          <div class="confirm-actions">
            <button class="btn-danger" id="submitBtn" onclick="window.confirmDeleteUnit(${id})"><i class="ri-delete-bin-line"></i>نعم، احذف</button>
            <button class="btn-cancel" onclick="window.closeModal()">إلغاء</button>
          </div></div></div>`);
      }
      async function confirmDeleteUnit(id){
        setBusy('submitBtn',true,'احذف');
        try{
          await DELETE(`/api/Units/${id}`); toast('تم الحذف'); closeModal();
          await showUnits(S.params.buildingId, S.params.buildingName, S.params.buildingCode);
        }catch(e){ errToast(e); }
        setBusy('submitBtn',false,'احذف');
      }

      async function openUnitDetail(unitId){
        if(S.selecting) return;
        await ensureBuyers();
        let u = (S.params.units||[]).find(x=>Number(x.id)===Number(unitId));
        if(!u){ try{ u=await GET(`/api/Units/${unitId}`); }catch{ toast('فشل تحميل بيانات الوحدة','error'); return; } }
        if(!u) return;
        const st = toStatus(u.status), tp = toType(u.type);
        const bc = STATUS_BADGE[st]||'sb-closed', stAr = STATUS_AR[st]||'—';
        const typeLabel = TYPE_AR[tp]||'شقة';
        const price   = u.price&&Number(u.price)>0 ? fmtPrice(u.price) : '—';
        const area    = u.area&&Number(u.area)>0   ? toEn(u.area)+' م²'       : '—';
        const facingN = toFacing(u.facing);
        const facingLabel = FACING_AR[facingN]||'—';
        const roomsLabel  = Number(u.rooms)>0 ? toEn(u.rooms)+' غرف' : '—';
        const {projectCode, buildingCode} = S.params;
        const unitRef = projectCode&&buildingCode ? `${projectCode}-${buildingCode}-${u.unitNumber}` : String(u.unitNumber);
        const buyer = buyerById(u.buyerId), showClient = st===2||st===3;
        const clientHtml = showClient
          ? `<div class="client-info-box ${st===3?'sold':'reserved'}">
               <div class="ci-avatar">${buyer?buyerInitials(buyer):'؟'}</div>
               <div>
                 <div class="ci-label">${st===3?'مباع لـ':'محجوز لـ'}</div>
                 <div class="ci-name">${buyer?esc(buyerName(buyer)):'غير محدد'}</div>
                 ${buyer?.phoneNumber?`<div class="ci-sub">${esc(buyer.phoneNumber)}</div>`:''}
                 ${buyer?.email?`<div class="ci-sub">${esc(buyer.email)}</div>`:''}
               </div></div>` : '';
        openModal(`وحدة ${esc(toEn(unitRef))}`,`<div class="modal-body">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;flex-wrap:wrap">
            <span class="status-badge ${bc}">${stAr}</span>
            <span style="font-size:.78rem;padding:4px 10px;border-radius:8px;background:rgba(var(--fg-rgb), .06);color:var(--text-muted)">${typeLabel}</span>
          </div>
          <div class="unit-detail-grid">
            <div class="ud-block"><div class="ud-label">رقم الوحدة</div><div class="ud-value">${toEn(u.unitNumber)}</div></div>
            <div class="ud-block"><div class="ud-label">المساحة</div><div class="ud-value">${area}</div></div>
            <div class="ud-block"><div class="ud-label">السعر</div><div class="ud-value">${price}</div></div>
            <div class="ud-block"><div class="ud-label">النوع</div><div class="ud-value">${typeLabel}</div></div>
            <div class="ud-block"><div class="ud-label">الواجهة</div><div class="ud-value">${facingLabel}</div></div>
            <div class="ud-block"><div class="ud-label">الغرف</div><div class="ud-value">${roomsLabel}</div></div>
            <div class="ud-block"><div class="ud-label">الرمز الكامل</div><div class="ud-value" style="font-size:.82rem;color:var(--accent)">${toEn(esc(unitRef))}</div></div>
            <div class="ud-block"><div class="ud-label">تاريخ الإضافة</div><div class="ud-value">${fmtDate(u.createdAt)}</div></div>
          </div>${clientHtml}
        </div>
        <div class="modal-footer">
          <button class="btn-submit" onclick="window.closeModal();window.editUnit(${u.id})"><i class="ri-edit-line"></i>تعديل</button>
          <button class="btn-cancel" onclick="window.closeModal()">إغلاق</button>
        </div>`);
      }

      function _exitSelectMode(){
        S.selecting=false; S.selected.clear();
        document.getElementById('selToggleBtn')?.classList.remove('active');
        document.getElementById('bulk-bar')?.classList.remove('show');
        document.getElementById('mainView')?.classList.remove('sel-mode');
        swap(renderView);
        _updateBulkBar();
      }
      function _updateBulkBar(){
        const bar=document.getElementById('bulk-bar');
        const cnt=document.getElementById('bulk-count-txt');
        const allUnits=S.params.units||[];
        if(cnt) cnt.textContent=`${toEn(S.selected.size)} وحدة`;
        // update button states
        const selAllBtn=document.getElementById('bulk-sel-all-btn');
        const deselAllBtn=document.getElementById('bulk-desel-all-btn');
        if(selAllBtn) selAllBtn.style.display=S.selected.size===allUnits.length&&allUnits.length>0?'none':'inline-flex';
        if(deselAllBtn) deselAllBtn.style.display=S.selected.size===0?'none':'inline-flex';
        if(bar) bar.classList.toggle('show', S.selecting);
      }
      window._bulkSelectAll = function(){
        const allUnits=S.params.units||[];
        allUnits.forEach(u=>S.selected.add(Number(u.id)));
        // update checkboxes visually
        document.querySelectorAll('.unit-box').forEach(box=>{
          const uid=Number(box.dataset.uid);
          if(S.selected.has(uid)){ box.classList.add('selected-unit'); const chk=box.querySelector('.u-chk i'); if(chk) chk.style.display=''; }
        });
        _updateBulkBar();
      };
      window._bulkDeselectAll = function(){
        S.selected.clear();
        document.querySelectorAll('.unit-box').forEach(box=>{
          box.classList.remove('selected-unit');
          const chk=box.querySelector('.u-chk i'); if(chk) chk.style.display='none';
        });
        _updateBulkBar();
      };
      window._unitClick = function(id, el){ if(S.selecting) window._toggleUnitSel(id, el); else window.openUnitDetail(id); };
      window._toggleSelectMode = function(){
        if(S.selecting){ _exitSelectMode(); return; }
        S.selecting=true; S.selected.clear();
        document.getElementById('selToggleBtn')?.classList.add('active');
        document.getElementById('mainView')?.classList.add('sel-mode');
        swap(renderView);
        _updateBulkBar();
      };
      window._toggleUnitSel = function(unitId, el){
        const id=Number(unitId);
        if(S.selected.has(id)) S.selected.delete(id);
        else S.selected.add(id);
        const box=el.closest?el.closest('.unit-box'):el;
        if(box){
          box.classList.toggle('selected-unit', S.selected.has(id));
          const chk=box.querySelector('.u-chk i');
          if(chk) chk.style.display=S.selected.has(id)?'':'none';
        }
        _updateBulkBar();
      };
      window._bulkChangeStatus = async function(newStatus){
        if(!S.selected.size){ toast('لم تحدد أي وحدات','error'); return; }
        const ids=[...S.selected];
        const stAr=STATUS_AR[newStatus]||'';
        const units=S.params.units||[];
        // تجاهل الوحدات المحجوزة أو المباعة — تحتاج إلغاء حجز أولاً
        const eligible = ids.filter(uid=>{
          const u=units.find(x=>Number(x.id)===uid);
          if(!u) return false;
          const st=toStatus(u.status);
          return st!==2&&st!==3; // ليست محجوزة أو مباعة
        });
        if(!eligible.length){ toast('الوحدات المحددة محجوزة أو مباعة — لا يمكن تغييرها من هنا','error'); return; }
        const skipped=ids.length-eligible.length;
        const bar=document.getElementById('bulk-bar');
        if(bar){ bar.style.opacity='.5'; bar.style.pointerEvents='none'; }
        let done=0, failed=0;
        for(const uid of eligible){
          const u=units.find(x=>Number(x.id)===uid);
          if(!u){ failed++; continue; }
          try{
            await PUT(`/api/Units/${uid}`,{
              unitNumber:u.unitNumber, type:toType(u.type), status:newStatus,
              facing:toFacing(u.facing), area:Number(u.area)||0, rooms:Number(u.rooms)||0,
              price:Number(u.price)||0, floorId:Number(u.floorId), buyerId:u.buyerId||null
            });
            done++;
          }catch{ failed++; }
        }
        if(bar){ bar.style.opacity=''; bar.style.pointerEvents=''; }
        const skipMsg = skipped>0 ? ` · تم تخطي ${toEn(skipped)} محجوزة/مباعة` : '';
        toast(`تم تغيير ${toEn(done)} وحدة إلى "${stAr}"${failed>0?` (${toEn(failed)} فشل)`:''}${skipMsg}`);
        _exitSelectMode();
        await showUnits(S.params.buildingId, S.params.buildingName, S.params.buildingCode);
      };

      function _bulkEligible(ids, units){
        return ids.filter(uid=>{
          const u=units.find(x=>Number(x.id)===uid);
          if(!u) return false;
          const st=toStatus(u.status);
          return st!==2&&st!==3;
        });
      }
      async function _doBulkUpdate(eligible, units, patchFn, successMsg){
        const bar=document.getElementById('bulk-bar');
        if(bar){ bar.style.opacity='.5'; bar.style.pointerEvents='none'; }
        let done=0, failed=0;
        for(const uid of eligible){
          const u=units.find(x=>Number(x.id)===uid);
          if(!u){ failed++; continue; }
          try{
            await PUT(`/api/Units/${uid}`, patchFn(u));
            done++;
          }catch{ failed++; }
        }
        if(bar){ bar.style.opacity=''; bar.style.pointerEvents=''; }
        toast(`${successMsg}: ${toEn(done)} وحدة${failed>0?` (${toEn(failed)} فشل)`:''}`);
        _exitSelectMode();
        await showUnits(S.params.buildingId, S.params.buildingName, S.params.buildingCode);
      }
      function _unitPayload(u, overrides){
        return {
          unitNumber:u.unitNumber, type:toType(u.type), status:toStatus(u.status),
          facing:toFacing(u.facing), area:Number(u.area)||0, rooms:Number(u.rooms)||0,
          price:Number(u.price)||0, floorId:Number(u.floorId), buyerId:u.buyerId||null,
          ...overrides
        };
      }
      window._bulkChangeFacing = async function(){
        if(!S.selected.size){ toast('لم تحدد أي وحدات','error'); return; }
        const sel=document.getElementById('bulk-facing-sel');
        if(!sel||sel.value==='') { toast('اختر واجهة أولاً','error'); return; }
        const facingNum=Number(sel.value);
        const ids=[...S.selected];
        const units=S.params.units||[];
        const eligible=_bulkEligible(ids,units);
        if(!eligible.length){ toast('الوحدات المحددة محجوزة أو مباعة — لا يمكن تعديلها','error'); return; }
        const skipped=ids.length-eligible.length;
        const skipMsg=skipped>0?` · تم تخطي ${toEn(skipped)} محجوزة/مباعة`:'';
        await _doBulkUpdate(eligible, units, u=>_unitPayload(u,{facing:facingNum}), `تم تحديث الواجهة${skipMsg}`);
      };
      window._bulkChangeRooms = async function(){
        if(!S.selected.size){ toast('لم تحدد أي وحدات','error'); return; }
        const inp=document.getElementById('bulk-rooms-inp');
        const val=(inp?.value??'').trim();
        if(val==='') { toast('أدخل عدد الغرف','error'); return; }
        const roomsNum=Number(val);
        if(isNaN(roomsNum)||roomsNum<0||roomsNum>20) { toast('عدد غرف غير صالح (0–20)','error'); return; }
        const ids=[...S.selected];
        const units=S.params.units||[];
        const eligible=_bulkEligible(ids,units);
        if(!eligible.length){ toast('الوحدات المحددة محجوزة أو مباعة — لا يمكن تعديلها','error'); return; }
        const skipped=ids.length-eligible.length;
        const skipMsg=skipped>0?` · تم تخطي ${toEn(skipped)} محجوزة/مباعة`:'';
        await _doBulkUpdate(eligible, units, u=>_unitPayload(u,{rooms:roomsNum}), `تم تحديث عدد الغرف${skipMsg}`);
      };
      window._bulkChangePrice = async function(){
        if(!S.selected.size){ toast('لم تحدد أي وحدات','error'); return; }
        const inp=document.getElementById('bulk-price-inp');
        const val=(inp?.value??'').trim();
        if(val==='') { toast('أدخل السعر','error'); return; }
        const priceNum=Number(val);
        if(isNaN(priceNum)||priceNum<0) { toast('سعر غير صالح','error'); return; }
        const ids=[...S.selected];
        const units=S.params.units||[];
        const eligible=_bulkEligible(ids,units);
        if(!eligible.length){ toast('الوحدات المحددة محجوزة أو مباعة — لا يمكن تعديلها','error'); return; }
        const skipped=ids.length-eligible.length;
        const skipMsg=skipped>0?` · تم تخطي ${toEn(skipped)} محجوزة/مباعة`:'';
        await _doBulkUpdate(eligible, units, u=>_unitPayload(u,{price:priceNum}), `تم تحديث السعر${skipMsg}`);
      };

      Object.assign(window, {
        showProjects, showBuildings, showUnits,
        openAddProject, submitAddProject, editProject, submitEditProject, deleteProject, confirmDeleteProject,
        openAddBuilding, submitAddBuilding, editBuilding, submitEditBuilding, deleteBuilding, confirmDeleteBuilding,
        openAddFloor, submitAddFloor,
        openAddUnit, submitAddUnit, editUnit, submitEditUnit, deleteUnit, confirmDeleteUnit,
        openUnitDetail, handleSearch, setFilter, goPage,
      });

      // ── استعادة آخر موضع تصفح داخل صفحة المشاريع ──
      const _saved = window.__loadPageState?.('projects');
      if (_saved?.view === 'units' && _saved.buildingId && _saved.projectId) {
        S.params = { projectId: _saved.projectId, projectName: _saved.projectName, projectCode: _saved.projectCode };
        await showUnits(_saved.buildingId, _saved.buildingName, _saved.buildingCode);
      } else if (_saved?.view === 'buildings' && _saved.projectId) {
        await showBuildings(_saved.projectId, _saved.projectName, _saved.projectCode);
      } else {
        await showProjects();
      }
    }
  };
})();