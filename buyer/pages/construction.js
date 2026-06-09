/* PAGE MODULE: construction — Buyer Panel (Read-Only)
   بوابة المشتري
   ══════════════════════════════════════════════════ */
(function () {
  'use strict';
  window.__pages = window.__pages || {};

  const _css = `
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    /* ألوان مشتقة من ثيم النظام (themes.js) لتأخذ نفس هوية الأدمن */
    .bc-page, #bc-modal, #bc-sell-modal, #bc-lb{
      --bg:var(--primary-deep); --surface:var(--card-bg); --surface2:var(--card-hover);
      --border-h:var(--border-hover);
      --text:var(--light); --text2:var(--text-muted); --muted:var(--text-muted); --muted2:var(--text-muted);
      --accent-dim:rgba(var(--accent-rgb), .12); --accent-border:rgba(var(--accent-rgb), .28);
      --gold:var(--accent); --gold-dim:rgba(var(--accent-rgb), .1); --gold-border:rgba(var(--accent-rgb), .28);
      --success-dim:rgba(52,199,89,.12); --success-border:rgba(52,199,89,.28);
      --warning-dim:rgba(255,204,0,.12); --warning-border:rgba(255,204,0,.3);
      --r:12px; --tr:all .22s ease;
    }
    @keyframes bc-spin   { to{transform:rotate(360deg)} }
    @keyframes bc-fadeUp { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
    @keyframes bc-fadeIn { from{opacity:0}to{opacity:1} }
    @keyframes bc-pulse  { 0%,100%{opacity:1}50%{opacity:.35} }
    @keyframes bc-popIn  { from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)} }

    /* ── PAGE ── */
    .bc-page{padding:0 0 100px;max-width:860px;margin:0 auto}

    /* ── TOPBAR ── */
    .bc-topbar{
      display:flex;align-items:flex-start;justify-content:space-between;gap:12px;
      padding:14px 0 20px;border-bottom:1px solid var(--border);margin-bottom:24px;
      animation:bc-fadeUp .3s ease both;flex-wrap:wrap;
    }
    .bc-back-btn{
      display:flex;align-items:center;gap:7px;padding:8px 14px;border-radius:10px;
      background:rgba(var(--fg-rgb), .05);border:1px solid var(--border);
      color:var(--text2);font-family:'Tajawal',sans-serif;font-size:.85rem;font-weight:600;
      cursor:pointer;transition:var(--tr);flex-shrink:0;margin-top:2px;
    }
    .bc-back-btn:hover{color:var(--text);background:rgba(var(--fg-rgb), .09);border-color:var(--border-h)}

    /* header info block */
    .bc-hdr-info{flex:1;min-width:0}
    .bc-hdr-title{font-size:1.1rem;font-weight:800;color:var(--text);display:flex;align-items:center;gap:8px;margin-bottom:10px}
    .bc-hdr-title i{color:var(--accent)}
    .bc-hdr-chips{display:flex;flex-wrap:wrap;gap:6px}
    .bc-hdr-chip{
      display:inline-flex;align-items:center;gap:5px;
      font-size:.75rem;font-weight:600;padding:4px 11px;border-radius:8px;
      background:rgba(var(--fg-rgb), .05);border:1px solid var(--border);color:var(--text2);
      white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:160px;
    }
    .bc-hdr-chip i{font-size:.8rem;color:var(--accent);opacity:.8;flex-shrink:0}

    /* ── PROGRESS CARD ── */
    .bc-prog-card{
      background:var(--surface);border:1px solid var(--border);
      border-radius:16px;padding:20px 24px;margin-bottom:20px;
      display:flex;align-items:center;gap:20px;animation:bc-fadeUp .35s ease both;
    }
    @media(max-width:560px){.bc-prog-card{flex-direction:column;gap:14px;padding:16px}}
    .bc-prog-ring{position:relative;width:80px;height:80px;flex-shrink:0}
    .bc-prog-ring svg{transform:rotate(-90deg)}
    .bc-ring-bg  {fill:none;stroke:rgba(var(--fg-rgb), .06);stroke-width:8}
    .bc-ring-fill{fill:none;stroke-width:8;stroke-linecap:round;transition:stroke-dashoffset 1.2s ease}
    .bc-ring-label{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
    .bc-ring-pct{font-size:1.2rem;font-weight:800;color:var(--text);line-height:1}
    .bc-ring-sub{font-size:.6rem;color:var(--muted);margin-top:2px}
    .bc-prog-info{flex:1;min-width:0;width:100%}
    .bc-prog-name{font-size:1rem;font-weight:800;color:var(--text);margin-bottom:8px;
      white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .bc-prog-track{height:5px;background:rgba(var(--fg-rgb), .06);border-radius:5px;overflow:hidden;margin-bottom:8px}
    .bc-prog-bar{height:100%;border-radius:5px;transition:width 1.2s ease}
    .bc-prog-pips{display:flex;gap:3px}
    .bc-prog-pip{flex:1;height:3px;border-radius:3px;background:rgba(var(--fg-rgb), .07);transition:background .4s}
    .bc-prog-pip.done{background:var(--success)}
    .bc-prog-pip.curr{background:var(--accent);animation:bc-pulse 2s infinite}
    .bc-prog-detail{font-size:.72rem;color:var(--muted);margin-top:7px}

    /* ── TIMELINE ── */
    .bc-timeline{display:flex;flex-direction:column;position:relative}
    .bc-tl-line{position:absolute;right:17px;top:0;bottom:0;width:2px;background:rgba(var(--fg-rgb), .05);z-index:0;border-radius:2px}
    .bc-stage-row{display:flex;gap:14px;align-items:flex-start;position:relative;z-index:1;margin-bottom:8px;animation:bc-fadeUp .3s ease both}

    /* dot */
    .bc-dot-wrap{display:flex;flex-direction:column;align-items:center;flex-shrink:0;padding-top:14px}
    .bc-dot{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;border:2px solid transparent;position:relative;z-index:2;background:var(--bg)}
    .bc-dot.done{border-color:var(--success);color:var(--success);background:var(--surface)}
    .bc-dot.curr{border-color:var(--accent);color:var(--accent);background:var(--surface);box-shadow:0 0 0 5px rgba(var(--accent-rgb),.1)}
    .bc-dot.pend{border-color:rgba(var(--fg-rgb), .1);color:var(--muted2)}

    /* stage card */
    .bc-sr{flex:1;min-width:0;border-radius:var(--r);border:1px solid var(--border);background:var(--surface);overflow:hidden;transition:border-color .2s,background .2s}
    .bc-sr.done{border-color:var(--success-border)}
    .bc-sr.curr{border-color:var(--accent-border);background:var(--card-hover)}
    .bc-sr.pend{opacity:.45}

    /* ── STAGE HEADER — responsive fix ── */
    .bc-sr-h{
      display:flex;flex-direction:column;gap:10px;padding:14px 16px;
    }
    /* top row: name + badge */
    .bc-sr-top{
      display:flex;align-items:flex-start;justify-content:space-between;gap:8px;
    }
    .bc-sr-l{display:flex;align-items:flex-start;gap:10px;flex:1;min-width:0}
    .bc-sr-nm{font-size:.92rem;font-weight:700;color:var(--text);line-height:1.4;word-break:break-word}
    .bc-sr-nm.mu{color:var(--muted);font-weight:400}
    .bc-sr-sub{font-size:.7rem;color:var(--muted2);margin-top:4px;display:flex;align-items:center;gap:4px;flex-wrap:wrap}
    .bc-sr-sub.done{color:var(--success)}
    .bc-sr-sub.curr{color:var(--accent)}
    .bc-badge-wrap{flex-shrink:0}

    /* bottom row: action buttons */
    .bc-sr-actions{
      display:flex;gap:7px;flex-wrap:wrap;
    }

    .bc-badge{padding:3px 9px;border-radius:20px;font-size:.68rem;font-weight:700;white-space:nowrap}
    .bc-b-d{background:var(--success-dim);color:var(--success);border:1px solid var(--success-border)}
    .bc-b-c{background:var(--accent-dim);color:var(--accent);border:1px solid var(--accent-border)}
    .bc-b-p{background:rgba(var(--fg-rgb), .04);color:var(--muted);border:1px solid var(--border)}

    /* SPINNER inside current stage dot */
    .bc-dot-spinner{
      width:14px;height:14px;
      border:2px solid rgba(var(--accent-rgb),.3);
      border-top-color:var(--accent);
      border-radius:50%;
      animation:bc-spin .7s linear infinite;
      display:inline-block;
    }

    /* action buttons */
    .bc-action-btn{
      display:inline-flex;align-items:center;gap:5px;
      padding:7px 13px;border-radius:8px;
      font-family:'Tajawal',sans-serif;font-size:.78rem;font-weight:700;
      cursor:pointer;transition:var(--tr);border:1px solid;
      white-space:nowrap;
    }
    .bc-btn-report{background:rgba(255,204,0,.08);color:var(--warning);border-color:rgba(255,204,0,.28)}
    .bc-btn-report:hover{background:rgba(255,204,0,.18)}
    .bc-btn-photos{background:var(--accent-dim);color:var(--accent);border-color:var(--accent-border)}
    .bc-btn-photos:hover{background:rgba(var(--accent-rgb),.22)}
    .bc-btn-sell{background:rgba(52,199,89,.08);color:var(--success);border-color:rgba(52,199,89,.28)}
    .bc-btn-sell:hover{background:rgba(52,199,89,.18)}

    /* ── SELL CONFIRM MODAL ── */
    #bc-sell-modal{
      display:none;position:fixed;inset:0;
      background:rgba(0,0,0,.7);z-index:2100;
      align-items:center;justify-content:center;
      backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);
      padding:12px;
    }
    #bc-sell-modal.open{display:flex;animation:bc-fadeIn .18s ease}
    .bc-sell-box{
      background:var(--surface);border:1px solid rgba(255,59,48,.3);
      border-radius:18px;max-width:460px;width:100%;
      animation:bc-popIn .22s ease;box-shadow:0 32px 80px rgba(0,0,0,.6);
      padding:24px;
    }
    .bc-sell-icon{text-align:center;font-size:2.2rem;margin-bottom:12px}
    .bc-sell-title{text-align:center;font-size:1rem;font-weight:800;color:var(--text);margin-bottom:6px}
    .bc-sell-sub{text-align:center;font-size:.82rem;color:var(--text2);margin-bottom:18px;line-height:1.6}
    .bc-sell-info{background:rgba(var(--fg-rgb), .04);border:1px solid var(--border);border-radius:10px;padding:12px 14px;margin-bottom:16px;display:flex;flex-direction:column;gap:6px}
    .bc-sell-row{display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:.82rem}
    .bc-sell-row span:first-child{color:var(--muted)}
    .bc-sell-row span:last-child{color:var(--text);font-weight:700}
    .bc-sell-field-label{font-size:.78rem;color:var(--text2);margin-bottom:6px;font-weight:600}
    .bc-sell-price-wrap{position:relative;margin-bottom:14px}
    .bc-sell-price-input{width:100%;background:rgba(var(--fg-rgb), .04);border:1px solid var(--border);border-radius:8px;color:var(--text);font-family:'Tajawal',sans-serif;font-size:.9rem;font-weight:700;padding:9px 40px 9px 12px;outline:none;transition:border-color .2s;direction:ltr;text-align:right;-moz-appearance:textfield}
    .bc-sell-price-input::-webkit-outer-spin-button,.bc-sell-price-input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
    .bc-sell-price-input:focus{border-color:rgba(52,199,89,.4)}
    .bc-sell-price-unit{position:absolute;left:10px;top:50%;transform:translateY(-50%);font-size:.75rem;color:var(--muted);pointer-events:none}
    .bc-sell-notes-input{width:100%;background:rgba(var(--fg-rgb), .04);border:1px solid var(--border);border-radius:8px;color:var(--text);font-family:'Tajawal',sans-serif;font-size:.83rem;padding:9px 12px;resize:vertical;min-height:70px;outline:none;transition:border-color .2s;margin-bottom:14px}
    .bc-sell-notes-input:focus{border-color:rgba(52,199,89,.4)}
    .bc-sell-btns{display:flex;gap:8px}
    .bc-sell-cancel{flex:1;padding:10px;border-radius:10px;background:rgba(var(--fg-rgb), .05);border:1px solid var(--border);color:var(--text2);font-family:'Tajawal',sans-serif;font-size:.85rem;font-weight:700;cursor:pointer;transition:var(--tr)}
    .bc-sell-cancel:hover{background:rgba(var(--fg-rgb), .1);color:var(--text)}
    .bc-sell-confirm{flex:2;padding:10px;border-radius:10px;background:rgba(52,199,89,.15);border:1px solid rgba(52,199,89,.35);color:var(--success);font-family:'Tajawal',sans-serif;font-size:.85rem;font-weight:800;cursor:pointer;transition:var(--tr);display:flex;align-items:center;justify-content:center;gap:6px}
    .bc-sell-confirm:hover:not(:disabled){background:rgba(52,199,89,.28);border-color:var(--success)}
    .bc-sell-confirm:disabled{opacity:.5;cursor:not-allowed}

    /* ── MODAL OVERLAY ── */
    #bc-modal{
      display:none;position:fixed;inset:0;
      background:rgba(0,0,0,.7);z-index:2000;
      align-items:center;justify-content:center;
      backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);
      padding:12px;
    }
    #bc-modal.open{display:flex;animation:bc-fadeIn .18s ease}
    .bc-mbox{
      background:var(--surface);border:1px solid var(--border-h);
      border-radius:18px;max-width:580px;width:100%;
      max-height:88vh;overflow-y:auto;
      animation:bc-popIn .22s ease;box-shadow:0 32px 80px rgba(0,0,0,.6);
    }
    .bc-mbox.wide{max-width:820px}
    .bc-mhead{
      padding:14px 16px 12px;border-bottom:1px solid var(--border);
      display:flex;justify-content:space-between;align-items:center;
      position:sticky;top:0;background:var(--surface);z-index:2;border-radius:18px 18px 0 0;
      gap:10px;
    }
    .bc-mhead h2{font-size:.92rem;font-weight:700;color:var(--text);font-family:'Tajawal',sans-serif;
      word-break:break-word;flex:1;min-width:0}
    .bc-mcls{
      background:rgba(var(--fg-rgb), .05);border:1px solid var(--border);
      color:var(--muted);font-size:.9rem;cursor:pointer;
      width:28px;height:28px;min-width:28px;display:flex;align-items:center;justify-content:center;
      border-radius:7px;transition:var(--tr);
    }
    .bc-mcls:hover{color:var(--text);background:rgba(255,59,48,.1);border-color:rgba(255,59,48,.3)}
    .bc-mbody{padding:16px}

    /* report field grid in modal */
    .bc-rep-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;margin:14px 0}
    .bc-rep-field{background:rgba(var(--fg-rgb), .03);border:1px solid var(--border);border-radius:8px;padding:9px 11px}
    .bc-rep-label{font-size:.62rem;color:var(--muted2);margin-bottom:4px;font-weight:700;text-transform:uppercase;letter-spacing:.04em}
    .bc-chip{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:20px;font-size:.74rem;font-weight:700}
    .bc-cy{background:var(--success-dim);color:var(--success);border:1px solid var(--success-border)}
    .bc-cn{background:rgba(255,59,48,.1);color:var(--danger);border:1px solid rgba(255,59,48,.22)}
    .bc-tbg{display:inline-block;padding:2px 8px;border-radius:20px;background:var(--accent-dim);color:var(--accent);border:1px solid rgba(var(--accent-rgb),.18);font-size:.76rem;word-break:break-word}
    .bc-notes{margin-top:10px;font-size:.83rem;color:var(--text-muted);line-height:1.75;background:var(--surface-tint);border:1px solid var(--border);padding:10px 13px;border-radius:8px;word-break:break-word}
    .bc-comp-badge{display:inline-flex;align-items:center;gap:5px;background:var(--success-dim);color:var(--success);border:1px solid var(--success-border);padding:3px 10px;border-radius:20px;font-size:.73rem;font-weight:700;margin-bottom:12px;flex-wrap:wrap}
    .bc-no-data{padding:20px;text-align:center;color:var(--muted);font-size:.85rem}

    /* photo gallery in modal */
    .bc-photo-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:8px;margin-top:4px}
    .bc-photo-thumb{
      aspect-ratio:4/3;border-radius:10px;overflow:hidden;
      border:1px solid var(--border);cursor:pointer;
      transition:border-color .2s,transform .2s;background:var(--surface2);
    }
    .bc-photo-thumb:hover{border-color:var(--accent);transform:scale(1.03)}
    .bc-photo-thumb img{width:100%;height:100%;object-fit:cover;display:block}
    .bc-no-photos{padding:30px;text-align:center;color:var(--muted);font-size:.85rem;display:flex;flex-direction:column;align-items:center;gap:8px}
    .bc-no-photos i{font-size:2rem;opacity:.25}

    /* ── LIGHTBOX (full screen inside modal) ── */
    #bc-lb{
      display:none;position:fixed;inset:0;
      background:rgba(0,0,0,.95);z-index:3000;
      align-items:center;justify-content:center;flex-direction:column;gap:14px;
      padding:16px;
    }
    #bc-lb.open{display:flex;animation:bc-fadeIn .18s ease}
    #bc-lb-img{max-width:88vw;max-height:76vh;object-fit:contain;border-radius:10px;display:block}
    .bc-lb-cap{color:rgba(var(--fg-rgb), .4);font-size:.78rem}
    .bc-lb-bar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center}
    .bc-lb-btn{padding:8px 16px;border-radius:8px;border:1px solid rgba(var(--fg-rgb), .12);background:rgba(var(--fg-rgb), .08);color:var(--light);font-size:.8rem;cursor:pointer;display:flex;align-items:center;gap:6px;font-family:'Tajawal',sans-serif;font-weight:600;transition:var(--tr)}
    .bc-lb-btn:hover{background:rgba(var(--fg-rgb), .15)}
    #bc-lb-prev{position:fixed;top:50%;transform:translateY(-50%);right:12px;background:rgba(var(--fg-rgb), .07);border:1px solid rgba(var(--fg-rgb), .12);color:var(--light);width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1.1rem;transition:var(--tr)}
    #bc-lb-next{position:fixed;top:50%;transform:translateY(-50%);left:12px;background:rgba(var(--fg-rgb), .07);border:1px solid rgba(var(--fg-rgb), .12);color:var(--light);width:42px;height:42px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1.1rem;transition:var(--tr)}
    #bc-lb-prev:hover,#bc-lb-next:hover{background:rgba(var(--fg-rgb), .15)}

    /* DONE BANNER */
    .bc-done-banner{text-align:center;padding:24px;margin-top:16px;background:var(--success-dim);border:1px solid var(--success-border);border-radius:16px;animation:bc-fadeUp .4s ease both}
    .bc-done-emoji{font-size:2rem;display:block;margin-bottom:8px}
    .bc-done-banner p{color:var(--success);font-weight:800;font-size:.95rem}
    .bc-done-sub{color:var(--muted);font-size:.8rem;margin-top:4px}

    /* SPINNER PAGE */
    .bc-spin-wrap{display:flex;align-items:center;justify-content:center;min-height:300px}
    .bc-spinner{width:40px;height:40px;border:3px solid rgba(var(--fg-rgb), .07);border-top-color:var(--accent);border-radius:50%;animation:bc-spin .75s linear infinite}

    /* ── MOBILE BREAKPOINTS ── */
    @media(max-width:480px){
      .bc-page{padding:0 0 80px}
      .bc-topbar{padding:10px 0 16px;gap:8px}
      .bc-back-btn{padding:7px 11px;font-size:.8rem}
      .bc-hdr-title{font-size:1rem}
      .bc-hdr-chip{font-size:.7rem;padding:3px 9px;max-width:130px}

      .bc-prog-card{flex-direction:column;gap:12px;padding:14px}
      .bc-prog-ring{width:70px;height:70px}
      .bc-prog-ring svg{width:70px;height:70px}
      .bc-ring-pct{font-size:1.05rem}
      .bc-prog-info{width:100%}

      .bc-sr-nm{font-size:.85rem}
      .bc-sr-sub{font-size:.67rem}
      .bc-badge{font-size:.64rem;padding:3px 7px}
      .bc-action-btn{font-size:.74rem;padding:6px 10px}

      .bc-rep-grid{grid-template-columns:1fr 1fr}
      .bc-photo-grid{grid-template-columns:repeat(auto-fill,minmax(85px,1fr));gap:6px}

      .bc-mbox{border-radius:14px}
      .bc-mhead{padding:12px 14px}
      .bc-mbody{padding:12px}

      #bc-lb-prev{right:6px;width:36px;height:36px;font-size:.95rem}
      #bc-lb-next{left:6px;width:36px;height:36px;font-size:.95rem}
    }

    @media(max-width:360px){
      .bc-hdr-chips{gap:4px}
      .bc-hdr-chip{font-size:.65rem;padding:3px 7px;max-width:110px}
      .bc-sr-actions{gap:5px}
      .bc-action-btn{font-size:.7rem;padding:5px 8px;gap:3px}
    }

    /* ── WARRANTY DOCS SECTION ── */
    .bc-warranty-section{
      margin-top:24px;border-radius:16px;border:1px solid var(--gold-border);
      background:var(--gold-dim);padding:18px 20px;animation:bc-fadeUp .4s ease both;
    }
    .bc-warranty-title{
      display:flex;align-items:center;gap:8px;font-size:.88rem;font-weight:800;
      color:var(--gold);margin-bottom:12px;
    }
    .bc-warranty-title i{font-size:1rem}
    .bc-warranty-list{display:flex;flex-direction:column;gap:8px}
    .bc-warranty-item{
      display:flex;align-items:center;justify-content:space-between;gap:10px;
      background:var(--surface-tint);border:1px solid rgba(var(--accent-rgb),.15);
      border-radius:10px;padding:10px 14px;
    }
    .bc-warranty-info{display:flex;align-items:center;gap:9px;min-width:0;flex:1}
    .bc-warranty-icon{color:var(--gold);font-size:1.1rem;flex-shrink:0}
    .bc-warranty-name{font-size:.83rem;font-weight:700;color:var(--text);
      white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .bc-warranty-dl{
      display:inline-flex;align-items:center;gap:6px;padding:6px 12px;
      border-radius:8px;border:1px solid rgba(var(--accent-rgb),.35);
      background:rgba(var(--accent-rgb),.1);color:var(--gold);
      font-family:inherit;font-size:.78rem;font-weight:700;
      cursor:pointer;text-decoration:none;flex-shrink:0;transition:var(--tr);
    }
    .bc-warranty-dl:hover{background:rgba(var(--accent-rgb),.2);border-color:var(--gold)}
    .bc-warranty-empty{text-align:center;padding:20px;color:var(--muted);font-size:.83rem;display:flex;align-items:center;gap:6px;justify-content:center}
  `;

  const STAGE_DEFS = [
    { key:'SitePreparation',  emoji:'⛏️', label:'تجهيز الموقع والحفر' },
    { key:'Foundation',       emoji:'🧱', label:'الأساسات' },
    { key:'Structure',        emoji:'🏗️', label:'الهيكل الإنشائي' },
    { key:'MasonryAndWalls',  emoji:'🏠', label:'المباني والحوائط' },
    { key:'InitialFinishing', emoji:'🔨', label:'التشطيبات الأولية' },
    { key:'FinalFinishing',   emoji:'🎨', label:'التشطيبات النهائية' },
    { key:'Handover',         emoji:'🔑', label:'التسليم' },
  ];

  const REPORT_FIELDS = {
    SitePreparation:  [{id:'soilTest',type:'toggle',label:'اختبار التربة'},{id:'excavationDepth',type:'number',label:'عمق الحفر (م)'},{id:'soilType',type:'text',label:'نوع التربة'},{id:'notes',type:'textarea',label:'ملاحظات'}],
    Foundation:       [{id:'concreteType',type:'text',label:'نوع الخرسانة'},{id:'steelType',type:'text',label:'نوع الحديد'},{id:'insulationType',type:'text',label:'نوع العزل'},{id:'pressureTest',type:'toggle',label:'اختبار الضغط'},{id:'notes',type:'textarea',label:'ملاحظات'}],
    Structure:        [{id:'columnConcrete',type:'text',label:'خرسانة الأعمدة'},{id:'roofConcrete',type:'text',label:'خرسانة الأسقف'},{id:'floorsPouredCount',type:'number',label:'أدوار مصبوبة'},{id:'cubeTest',type:'toggle',label:'اختبار المكعبات'},{id:'notes',type:'textarea',label:'ملاحظات'}],
    MasonryAndWalls:  [{id:'blockType',type:'text',label:'نوع البلوك'},{id:'plastering',type:'toggle',label:'البياض'},{id:'waterproofing',type:'toggle',label:'العزل المائي'},{id:'notes',type:'textarea',label:'ملاحظات'}],
    InitialFinishing: [{id:'electrical',type:'toggle',label:'الكهربائية'},{id:'plumbing',type:'toggle',label:'السباكة'},{id:'tiling',type:'toggle',label:'التبليط'},{id:'notes',type:'textarea',label:'ملاحظات'}],
    FinalFinishing:   [{id:'painting',type:'toggle',label:'الدهان'},{id:'kitchens',type:'toggle',label:'المطابخ'},{id:'acInstalled',type:'toggle',label:'التكييف'},{id:'notes',type:'textarea',label:'ملاحظات'}],
    Handover:         [{id:'handoverDate',type:'date',label:'تاريخ التسليم'},{id:'snagsDone',type:'toggle',label:'حل الملاحظات'},{id:'keysHanded',type:'toggle',label:'تسليم المفاتيح'},{id:'notes',type:'textarea',label:'ملاحظات'}],
  };

  window.__pages['construction'] = {
    getCSS: function() { return _css; },
    init: async function() {

      const container = document.getElementById('app-main');
      const API_BASE  = window.location.origin;
      const getToken  = window.__getToken || (()=>'');
      const target    = window.__constructionTarget || {};

      container.innerHTML = `
        <!-- lightbox -->
        <div id="bc-lb">
          <img id="bc-lb-img" src="" alt=""/>
          <div class="bc-lb-cap" id="bc-lb-cap"></div>
          <div class="bc-lb-bar">
            <button class="bc-lb-btn" id="bc-lb-prev"><i class="ri-arrow-right-line"></i></button>
            <button class="bc-lb-btn" id="bc-lb-close"><i class="ri-close-line"></i> إغلاق</button>
            <button class="bc-lb-btn" id="bc-lb-next"><i class="ri-arrow-left-line"></i></button>
          </div>
        </div>

        <!-- modal -->
        <div id="bc-modal">
          <div class="bc-mbox" id="bc-mbox">
            <div class="bc-mhead">
              <h2 id="bc-mtitle">—</h2>
              <button class="bc-mcls" id="bc-mcls"><i class="ri-close-line"></i></button>
            </div>
            <div class="bc-mbody" id="bc-mbody"></div>
          </div>
        </div>

        <!-- sell confirm modal -->
        <div id="bc-sell-modal">
          <div class="bc-sell-box">
            <div class="bc-sell-icon">🏷️</div>
            <div class="bc-sell-title">طلب رغبة بالبيع</div>
            <div class="bc-sell-sub">سيصل طلبك لمدير المبيعات وسيتواصل معك في أقرب وقت</div>
            <div class="bc-sell-info" id="bc-sell-info"></div>
            <div class="bc-sell-field-label">السعر المتوقع للبيع</div>
            <div class="bc-sell-price-wrap">
              <input type="number" class="bc-sell-price-input" id="bc-sell-price" placeholder="0" min="0" step="1000"/>
              <span class="bc-sell-price-unit">${window.CUR()}</span>
            </div>
            <div class="bc-sell-field-label">ملاحظات</div>
            <textarea class="bc-sell-notes-input" id="bc-sell-notes" placeholder="أضف أي تفاصيل إضافية هنا..."></textarea>
            <div class="bc-sell-btns">
              <button class="bc-sell-cancel" id="bc-sell-cancel">إلغاء</button>
              <button class="bc-sell-confirm" id="bc-sell-confirm"><i class="ri-send-plane-line"></i> إرسال الطلب</button>
            </div>
          </div>
        </div>

        <div class="bc-page">
          <!-- topbar -->
          <div class="bc-topbar">
            <button class="bc-back-btn" id="bc-back"><i class="ri-arrow-right-line"></i> العودة</button>
            <div class="bc-hdr-info">
              <div class="bc-hdr-title"><i class="ri-building-4-line"></i> مراحل البناء</div>
              <div class="bc-hdr-chips">
                ${target.projectName  ? `<span class="bc-hdr-chip"><i class="ri-map-pin-2-line"></i>${target.projectName}</span>`    : ''}
                ${target.buildingName ? `<span class="bc-hdr-chip"><i class="ri-building-2-line"></i>${target.buildingName}</span>` : ''}
                ${target.floorNum    ? `<span class="bc-hdr-chip"><i class="ri-stack-line"></i>الدور ${target.floorNum}</span>`       : ''}
                ${target.unitNum     ? `<span class="bc-hdr-chip"><i class="ri-home-4-line"></i>وحدة ${target.unitNum}</span>`        : ''}
              </div>
            </div>
          </div>
          <div id="bc-content"><div class="bc-spin-wrap"><div class="bc-spinner"></div></div></div>
        </div>`;

      /* ── helpers ── */
      function toArr(v) { return Array.isArray(v)?v:(v?.['$values']||v?.data||v?.items||v?.value||v?.results||[]); }
      function esc(s)   { return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

      /* ── DATE HELPERS — Gregorian (en-GB style, Arabic labels) ── */
      function fmtDate(d) {
        if(!d) return null;
        try {
          return new Date(d).toLocaleDateString('ar', {
            calendar: 'gregory',
            year: 'numeric', month: 'long', day: 'numeric',
            numberingSystem: 'latn'
          });
        } catch { return null; }
      }
      function fmtDateShort(d) {
        if(!d) return null;
        try {
          return new Date(d).toLocaleDateString('ar', {
            calendar: 'gregory',
            year: 'numeric', month: 'short', day: 'numeric',
            numberingSystem: 'latn'
          });
        } catch { return null; }
      }

      function imgSrc(img) {
        if(!img)return '';
        let src=img.imageUrl||img.ImageUrl||img.url||img.Url||img.filePath||img.FilePath||img.path||img.Path||'';
        if(!src&&typeof img==='string')src=img;
        if(src&&!src.startsWith('http')&&!src.startsWith('blob')&&!src.startsWith('data'))
          src=`${API_BASE}/${src.replace(/^\/+/,'')}`;
        src=src.replace(/^(https?:\/\/[^/]+)\/(https?:\/\/)/,'$2');
        if(src && location.protocol==='https:') src=src.replace(/^http:\/\//i,'https://');
        return src;
      }
      function getStageImages(stage) {
        if(!stage)return[];
        for(const f of['images','stageImages','photos','Images','StageImages','Photos']){
          const a=toArr(stage[f]); if(a.length)return a;
        }
        return[];
      }
      async function apiFetch(path) {
        const r=await fetch(API_BASE+path,{headers:{'Authorization':'Bearer '+getToken()}});
        if(!r.ok)throw new Error(r.status);
        return r.json().catch(()=>null);
      }

      /* ── lightbox ── */
      let lbImages=[], lbIdx=0;
      function openLb(imgs,idx){ lbImages=imgs; lbIdx=idx; showLbImg(); document.getElementById('bc-lb').classList.add('open'); }
      function showLbImg(){
        document.getElementById('bc-lb-img').src=imgSrc(lbImages[lbIdx]);
        document.getElementById('bc-lb-cap').textContent=`${lbIdx+1} / ${lbImages.length}`;
      }
      function closeLb(){ document.getElementById('bc-lb').classList.remove('open'); }
      document.getElementById('bc-lb').addEventListener('click', e=>{ if(e.target===document.getElementById('bc-lb'))closeLb(); },{signal:window.__pageAbortSignal});
      document.getElementById('bc-lb-close').addEventListener('click',closeLb,{signal:window.__pageAbortSignal});
      document.getElementById('bc-lb-prev').addEventListener('click',()=>{ if(lbImages.length<2)return; lbIdx=(lbIdx-1+lbImages.length)%lbImages.length; showLbImg(); },{signal:window.__pageAbortSignal});
      document.getElementById('bc-lb-next').addEventListener('click',()=>{ if(lbImages.length<2)return; lbIdx=(lbIdx+1)%lbImages.length; showLbImg(); },{signal:window.__pageAbortSignal});

      /* ── modal ── */
      function openModal(title, html, wide=false){
        document.getElementById('bc-mtitle').textContent=title;
        document.getElementById('bc-mbody').innerHTML=html;
        document.getElementById('bc-mbox').classList.toggle('wide',wide);
        document.getElementById('bc-modal').classList.add('open');
      }
      function closeModal(){ document.getElementById('bc-modal').classList.remove('open'); document.getElementById('bc-mbody').innerHTML=''; }
      document.getElementById('bc-mcls').addEventListener('click',closeModal,{signal:window.__pageAbortSignal});
      document.getElementById('bc-modal').addEventListener('click',e=>{ if(e.target===document.getElementById('bc-modal'))closeModal(); },{signal:window.__pageAbortSignal});

      /* ── sell modal ── */
      let _sellTarget = null; // { stageKey, stageLabel }
      function openSellModal(stageKey, stageLabel){
        _sellTarget = { stageKey, stageLabel };
        const info = document.getElementById('bc-sell-info');
        info.innerHTML = [
          ['الوحدة',   target.unitNum    || '—'],
          ['المبنى',   target.buildingName || '—'],
          ['المشروع',  target.projectName  || '—'],
          ['المرحلة',  stageLabel],
        ].map(([k,v])=>`<div class="bc-sell-row"><span>${k}</span><span>${v}</span></div>`).join('');
        document.getElementById('bc-sell-notes').value = '';
        document.getElementById('bc-sell-price').value = '';
        const btn = document.getElementById('bc-sell-confirm');
        btn.disabled = false;
        btn.innerHTML = '<i class="ri-send-plane-line"></i> إرسال الطلب';
        document.getElementById('bc-sell-modal').classList.add('open');
      }
      function closeSellModal(){ document.getElementById('bc-sell-modal').classList.remove('open'); _sellTarget=null; }
      document.getElementById('bc-sell-cancel').addEventListener('click', closeSellModal, {signal:window.__pageAbortSignal});
      document.getElementById('bc-sell-modal').addEventListener('click', e=>{ if(e.target===document.getElementById('bc-sell-modal'))closeSellModal(); },{signal:window.__pageAbortSignal});
      document.getElementById('bc-sell-confirm').addEventListener('click', async ()=>{
        if(!_sellTarget) return;
        const unitId = target.unitId;
        if(!unitId){ closeSellModal(); return; }
        const notes         = (document.getElementById('bc-sell-notes').value||'').trim();
        const priceRaw      = document.getElementById('bc-sell-price').value;
        const expectedPrice = priceRaw && Number(priceRaw) > 0 ? Number(priceRaw) : null;
        const btn    = document.getElementById('bc-sell-confirm');
        btn.disabled = true;
        btn.innerHTML= '<i class="ri-loader-4-line" style="animation:bc-spin .75s linear infinite"></i> جاري الإرسال...';
        try {
          const res = await fetch(`${API_BASE}/api/SellRequests`, {
            method: 'POST',
            headers: { 'Authorization':'Bearer '+getToken(), 'Content-Type':'application/json' },
            body: JSON.stringify({
              unitId: parseInt(unitId),
              stageKey: _sellTarget.stageKey,
              stageLabel: _sellTarget.stageLabel,
              notes: notes||null,
              expectedPrice
            })
          });
          closeSellModal();
          if(res.ok || res.status===201){
            /* tiny success toast via parent page */
            if(typeof window.showBToast === 'function') window.showBToast('تم إرسال طلبك بنجاح ✓','success');
            else alert('تم إرسال طلبك بنجاح');
          } else {
            const errText = await res.text().catch(()=>'');
            if(typeof window.showBToast === 'function') window.showBToast('تعذّر الإرسال — حاول مجدداً','error');
            else alert('تعذّر الإرسال');
            console.error('[sell-request]', res.status, errText);
          }
        } catch(e) {
          closeSellModal();
          if(typeof window.showBToast === 'function') window.showBToast('خطأ في الاتصال','error');
          console.error('[sell-request]', e);
        }
      },{signal:window.__pageAbortSignal});

      /* keyboard */
      document.addEventListener('keydown',e=>{
        if(document.getElementById('bc-lb').classList.contains('open')){
          if(e.key==='Escape')closeLb();
          if(e.key==='ArrowRight')document.getElementById('bc-lb-prev').click();
          if(e.key==='ArrowLeft') document.getElementById('bc-lb-next').click();
        } else if(document.getElementById('bc-modal').classList.contains('open')){
          if(e.key==='Escape')closeModal();
        } else if(document.getElementById('bc-sell-modal').classList.contains('open')){
          if(e.key==='Escape')closeSellModal();
        }
      },{signal:window.__pageAbortSignal});

      /* ── back ── */
      document.getElementById('bc-back').addEventListener('click',()=>{ window.__constructionTarget=null; navigate('my-units'); },{signal:window.__pageAbortSignal});

      /* ── open report modal ── */
      function openReportModal(def, stage){
        const rd = (() => { try{ return JSON.parse(stage?.reportData||'{}'); }catch{return {};} })();
        const completionDate = stage?.endDate||stage?.completionDate||rd?.completionDate||null;
        const fields = REPORT_FIELDS[def.key]||[];
        const hasData = fields.some(f => rd[f.id]!==undefined && rd[f.id]!==null && rd[f.id]!=='');

        let html = '';
        if(completionDate) html+=`<div><span class="bc-comp-badge"><i class="ri-calendar-check-line"></i> تاريخ الاكتمال: ${fmtDate(completionDate)}</span></div>`;

        if(hasData){
          html+=`<div class="bc-rep-grid">`;
          fields.filter(f=>f.id!=='notes').forEach(f=>{
            const val=rd[f.id]; if(val===undefined||val===null||val==='')return;
            let vh='';
            if(f.type==='toggle') vh=(val===true||val==='true'||val===1)?`<span class="bc-chip bc-cy"><i class="ri-check-line"></i> نعم</span>`:`<span class="bc-chip bc-cn"><i class="ri-close-line"></i> لا</span>`;
            else if(f.type==='number') vh=`<span style="font-size:.9rem;font-weight:700;color:var(--text)">${esc(val)}</span>`;
            else if(f.type==='date')   vh=`<span class="bc-tbg"><i class="ri-calendar-line"></i> ${fmtDateShort(val)||esc(val)}</span>`;
            else vh=`<span class="bc-tbg">${esc(val)}</span>`;
            html+=`<div class="bc-rep-field"><div class="bc-rep-label">${esc(f.label)}</div>${vh}</div>`;
          });
          html+='</div>';
          if(rd.notes) html+=`<div class="bc-notes"><i class="ri-sticky-note-line" style="opacity:.4;margin-left:4px"></i>${esc(rd.notes)}</div>`;
        } else {
          html+=`<div class="bc-no-data"><i class="ri-file-search-line" style="margin-left:6px"></i>لا توجد بيانات تقرير بعد</div>`;
        }
        openModal(`${def.emoji} تقرير — ${def.label}`, html);
      }

      /* ── open photos modal ── */
      function openPhotosModal(def, stage){
        const imgs = getStageImages(stage);
        let html = '';
        if(!imgs.length){
          html=`<div class="bc-no-photos"><i class="ri-image-add-line"></i><span>لا توجد صور لهذه المرحلة حتى الآن</span></div>`;
        } else {
          html=`<div class="bc-photo-grid">`;
          imgs.forEach((img,ii)=>{
            const src=imgSrc(img); if(!src)return;
            html+=`<div class="bc-photo-thumb" data-idx="${ii}">
              <img src="${esc(src)}" alt="" loading="lazy" onerror="this.closest('.bc-photo-thumb').style.display='none'"/>
            </div>`;
          });
          html+='</div>';
        }
        openModal(`${def.emoji} صور — ${def.label}`, html, true);

        /* bind thumbs to lightbox */
        setTimeout(()=>{
          document.querySelectorAll('.bc-photo-thumb').forEach(th=>{
            th.addEventListener('click',()=>{ closeModal(); openLb(imgs, parseInt(th.dataset.idx,10)); });
          });
        },50);
      }

      /* ── load & render ── */
      const buildingId = target.buildingId;
      const projectId  = target.projectId;
      if(!buildingId && !projectId){
        document.getElementById('bc-content').innerHTML=`<div style="text-align:center;padding:60px;color:var(--muted)"><i class="ri-information-line" style="font-size:2.5rem;display:block;margin-bottom:12px;opacity:.3"></i><p>ارجع لصفحة «وحداتي» واختر وحدتك</p></div>`;
        return;
      }

      try {
        const stagesPath = projectId
          ? `/api/ConstructionStages/project/${projectId}`
          : `/api/ConstructionStages?buildingId=${buildingId}`;
        const data = await apiFetch(stagesPath);
        let stages  = toArr(data);

        /* fetch images if missing */
        await Promise.all(stages.filter(s=>!getStageImages(s).length&&s.id).map(async s=>{
          try{ const imgs=await apiFetch(`/api/StageImages?stageId=${s.id}`); const a=toArr(imgs); if(a.length)s.images=a; }catch{}
        }));

        render(stages);
      } catch(e){
        console.error(e);
        document.getElementById('bc-content').innerHTML=`<div style="text-align:center;padding:60px;color:#ff7b72"><i class="ri-wifi-off-line" style="font-size:2.5rem;display:block;margin-bottom:12px;opacity:.5"></i><p>فشل تحميل مراحل البناء</p></div>`;
      }

      function getStage(key){
        const def=STAGE_DEFS.find(d=>d.key===key);
        const label=def?.label||'';
        return window.__bcStages?.find(s=>{
          const sn=(s.stageName||s.StageName||'').trim();
          return sn===key||sn===label;
        })||null;
      }
      function isDone(key){ const s=getStage(key); return s?(s.isCompleted===true||s.status==='Completed'):false; }
      function currIdx(){ for(let i=0;i<STAGE_DEFS.length;i++){if(!isDone(STAGE_DEFS[i].key))return i;} return -1; }
      function pct(){ return Math.round(STAGE_DEFS.filter(d=>isDone(d.key)).length/STAGE_DEFS.length*100); }

      function render(stages){
        window.__bcStages = stages;
        const content = document.getElementById('bc-content'); if(!content)return;

        const p=pct(), ci=currIdx(), doneCount=STAGE_DEFS.filter(d=>isDone(d.key)).length;
        const circ=2*Math.PI*32, off=circ-(p/100)*circ;
        const barColor = p===100?'linear-gradient(90deg,var(--success),#28a745)':'linear-gradient(90deg,var(--accent),var(--accent-dark))';
        const ringColor= p===100?'var(--success)':'var(--accent)';

        const pips=STAGE_DEFS.map((d,i)=>{
          const cls=isDone(d.key)?'done':(i===ci?'curr':'');
          return `<div class="bc-prog-pip ${cls}"></div>`;
        }).join('');

        let html=`
          <div class="bc-prog-card">
            <div class="bc-prog-ring">
              <svg viewBox="0 0 80 80" width="80" height="80">
                <circle class="bc-ring-bg"   cx="40" cy="40" r="32"/>
                <circle class="bc-ring-fill" cx="40" cy="40" r="32"
                  stroke="${ringColor}" stroke-dasharray="${circ}" stroke-dashoffset="${off}"/>
              </svg>
              <div class="bc-ring-label"><div class="bc-ring-pct">${p}%</div><div class="bc-ring-sub">مكتمل</div></div>
            </div>
            <div class="bc-prog-info">
              <div class="bc-prog-name">${esc(target.buildingName||'المبنى')}</div>
              <div class="bc-prog-track"><div class="bc-prog-bar" style="width:${p}%;background:${barColor}"></div></div>
              <div class="bc-prog-pips">${pips}</div>
              <div class="bc-prog-detail">${doneCount} من ${STAGE_DEFS.length} مراحل مكتملة</div>
            </div>
          </div>
          <div class="bc-timeline"><div class="bc-tl-line"></div>`;

        STAGE_DEFS.forEach((def,idx)=>{
          const done  =isDone(def.key);
          const isCurr=!done&&idx===ci;
          const stCls =done?'done':isCurr?'curr':'pend';
          const dotCls=done?'done':isCurr?'curr':'pend';
          const stage =getStage(def.key);
          const rd    = (()=>{try{return JSON.parse(stage?.reportData||'{}');}catch{return {};}})();
          const completionDate=stage?.endDate||stage?.completionDate||rd?.completionDate||null;
          const imgs  =getStageImages(stage);

          /* dot content — spinner for current */
          const dotContent = done
            ? '<i class="ri-check-line"></i>'
            : isCurr
              ? '<span class="bc-dot-spinner"></span>'
              : `${idx+1}`;

          let subHtml='';
          if(done)        subHtml=`<div class="bc-sr-sub done"><i class="ri-calendar-check-line"></i> اكتملت ${fmtDateShort(completionDate)||''}</div>`;
          else if(isCurr) subHtml=`<div class="bc-sr-sub curr"><i class="ri-record-circle-line"></i> المرحلة الجارية</div>`;
          else            subHtml=`<div class="bc-sr-sub"><i class="ri-time-line"></i> لم تبدأ بعد</div>`;

          let badgeHtml='';
          if(done)        badgeHtml=`<span class="bc-badge bc-b-d"><i class="ri-check-line"></i> مكتملة</span>`;
          else if(isCurr) badgeHtml=`<span class="bc-badge bc-b-c"><i class="ri-record-circle-line"></i> جارية</span>`;
          else            badgeHtml=`<span class="bc-badge bc-b-p">${idx+1}</span>`;

          /* action buttons for done/curr only */
          let actionsHtml='';
          if(done||isCurr){
            actionsHtml=`
              <button class="bc-action-btn bc-btn-report" data-key="${def.key}">
                <i class="ri-file-list-3-line"></i> التقرير
              </button>
              <button class="bc-action-btn bc-btn-photos" data-key="${def.key}">
                <i class="ri-image-2-line"></i> الصور
                ${imgs.length?`<span style="background:rgba(var(--accent-rgb),.2);padding:1px 6px;border-radius:20px;font-size:.68rem">${imgs.length}</span>`:''}
              </button>
              <button class="bc-action-btn bc-btn-sell" data-key="${def.key}" data-label="${def.emoji} ${def.label}">
                <i class="ri-hand-coin-line"></i> أرغب بالبيع في هذه المرحلة
              </button>`;
          }

          html+=`
            <div class="bc-stage-row" style="animation-delay:${idx*45}ms">
              <div class="bc-dot-wrap"><div class="bc-dot ${dotCls}">${dotContent}</div></div>
              <div class="bc-sr ${stCls}">
                <div class="bc-sr-h">
                  <div class="bc-sr-top">
                    <div class="bc-sr-l">
                      <div>
                        <div class="bc-sr-nm${!done&&!isCurr?' mu':''}">${def.emoji} ${def.label}</div>
                        ${subHtml}
                      </div>
                    </div>
                    <div class="bc-badge-wrap">${badgeHtml}</div>
                  </div>
                  ${actionsHtml ? `<div class="bc-sr-actions">${actionsHtml}</div>` : ''}
                </div>
              </div>
            </div>`;
        });

        html+='</div>';
        if(ci===-1) html+=`<div class="bc-done-banner"><span class="bc-done-emoji">🎉</span><p>جميع مراحل البناء مكتملة!</p><div class="bc-done-sub">نتطلع إلى تسليمك الوحدة في أفضل حال</div></div>`;

        content.innerHTML=html;

        /* bind report buttons */
        content.querySelectorAll('.bc-btn-report').forEach(btn=>{
          btn.addEventListener('click',()=>{
            const def=STAGE_DEFS.find(d=>d.key===btn.dataset.key);
            if(def) openReportModal(def, getStage(def.key));
          });
        });

        /* bind photos buttons */
        content.querySelectorAll('.bc-btn-photos').forEach(btn=>{
          btn.addEventListener('click',()=>{
            const def=STAGE_DEFS.find(d=>d.key===btn.dataset.key);
            if(def) openPhotosModal(def, getStage(def.key));
          });
        });

        /* bind sell buttons */
        content.querySelectorAll('.bc-btn-sell').forEach(btn=>{
          btn.addEventListener('click',()=>{
            openSellModal(btn.dataset.key, btn.dataset.label);
          });
        });

        /* ── Warranty Docs Section ── */
        loadWarrantyDocs(buildingId);
      }

      async function loadWarrantyDocs(bldId){
        if(!bldId) return;
        const content=document.getElementById('bc-content'); if(!content) return;

        /* placeholder */
        const section=document.createElement('div');
        section.className='bc-warranty-section';
        section.id='bc-warranty';
        section.innerHTML=`<div class="bc-warranty-title"><i class="ri-shield-check-line"></i>وثائق الضمان</div>
          <div class="bc-warranty-list"><div class="bc-warranty-empty"><i class="ri-loader-4-line" style="animation:bc-spin .75s linear infinite"></i> جاري التحميل...</div></div>`;
        content.appendChild(section);

        try{
          const data=await apiFetch(`/api/WarrantyDocuments/building/${bldId}`);
          const docs=toArr(data);
          const list=section.querySelector('.bc-warranty-list');
          if(!list)return;

          if(!docs||docs.length===0){
            list.innerHTML=`<div class="bc-warranty-empty"><i class="ri-file-info-line"></i>لا توجد وثائق ضمان مرفوعة حتى الآن</div>`;
            return;
          }

          const _apiBase=window.location.origin;
          function _absUrl(u){ if(!u)return u; if(u.startsWith('http'))return u; return _apiBase+(u.startsWith('/')?u:'/'+u); }
          list.innerHTML=docs.map(doc=>{
            const name=doc.fileName||doc.name||doc.originalFileName||'وثيقة ضمان';
            const rawUrl=doc.fileUrl||doc.url||doc.filePath||(doc.id?`${_apiBase}/api/WarrantyDocuments/${doc.id}/download`:null);
            if(!rawUrl) return '';
            const url=_absUrl(rawUrl);
            const ext=(name.split('.').pop()||'').toLowerCase();
            const icon=ext==='pdf'?'ri-file-pdf-2-line':'ri-file-image-line';
            const safeU=url.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
            const safeN=name.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
            return `<div class="bc-warranty-item">
              <div class="bc-warranty-info">
                <i class="${icon} bc-warranty-icon"></i>
                <div class="bc-warranty-name" title="${esc(name)}">${esc(name)}</div>
              </div>
              <button onclick="window.__previewWarranty('${safeU}','${safeN}')" class="bc-warranty-dl" style="margin-left:6px">
                <i class="ri-eye-line"></i> معاينة
              </button>
              <button onclick="window.__downloadWarranty('${safeU}','${safeN}')" class="bc-warranty-dl">
                <i class="ri-download-2-line"></i> تحميل
              </button>
            </div>`;
          }).join('');
        }catch(e){
          console.error('[warranty]',e);
          const list=section.querySelector('.bc-warranty-list');
          if(list) list.innerHTML=`<div class="bc-warranty-empty"><i class="ri-error-warning-line"></i>تعذّر تحميل وثائق الضمان</div>`;
        }
      }
    }
  };
})();