/* PAGE MODULE: buildings — Admin Edition (v3)
   ══════════════════════════════════════════════════════════════════
   القواعد الجديدة:
   1. المرحلة الأولى متاحة دائماً — وبعد اكتمال كل مرحلة تُفتح التالية
   2. الأدمن يقدر يحذف المرحلة الأخيرة المكتملة فقط (undo آخر خطوة)
   3. تناسق بيانات كامل مع صفحة المهندس (نفس stageName بالعربي)
   4. النقر على المرحلة يفتح modal موحد: تقرير + صور + تعديل
   5. loadStages دايماً من API مباشرة
   ══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  window.__pages = window.__pages || {};

  /* ══════════ STAGE DEFINITIONS ══════════ */
  const STAGE_DEFS = [
    { order:1, key:'SitePreparation',  label:'تجهيز الموقع والحفر', emoji:'⛏️', icon:'ri-hammer-line',
      desc:'فحص التربة وأعمال الحفر والإزالة' },
    { order:2, key:'Foundation',       label:'الأساسات', emoji:'🧱', icon:'ri-building-2-line',
      desc:'صب الخرسانة وتركيب حديد التسليح للأساسات' },
    { order:3, key:'Structure',        label:'الهيكل الإنشائي', emoji:'🏗️', icon:'ri-building-4-line',
      desc:'الأعمدة والأسقف والجسور الرئيسية' },
    { order:4, key:'MasonryAndWalls',  label:'المباني والحوائط', emoji:'🏠', icon:'ri-layout-3-line',
      desc:'أعمال الطوب والحوائط الداخلية والخارجية' },
    { order:5, key:'InitialFinishing', label:'التشطيبات الأولية', emoji:'🔌', icon:'ri-tools-line',
      desc:'المحارة والسباكة والكهرباء الخام' },
    { order:6, key:'FinalFinishing',   label:'التشطيبات النهائية', emoji:'🎨', icon:'ri-paint-brush-line',
      desc:'الأرضيات والدهانات والأبواب والشبابيك' },
    { order:7, key:'Handover',         label:'التسليم', emoji:'🔑', icon:'ri-checkbox-circle-line',
      desc:'الفحص النهائي الشامل وتسليم المفاتيح' },
  ];

  /* نفس الحقول اللي عند المهندس للتناسق */
  const RFIELDS = {
    SitePreparation:  [{id:'soilTest',type:'toggle',label:'اختبار التربة'},{id:'excavationDepth',type:'number',label:'عمق الحفر (م)'},{id:'soilType',type:'text',label:'نوع التربة'},{id:'notes',type:'textarea',label:'ملاحظات'}],
    Foundation:       [{id:'concreteType',type:'text',label:'نوع الخرسانة'},{id:'steelType',type:'text',label:'نوع الحديد'},{id:'insulationType',type:'text',label:'نوع العزل'},{id:'pressureTest',type:'toggle',label:'اختبار الضغط'},{id:'notes',type:'textarea',label:'ملاحظات'}],
    Structure:        [{id:'columnConcrete',type:'text',label:'خرسانة الأعمدة'},{id:'roofConcrete',type:'text',label:'خرسانة الأسقف'},{id:'floorsPouredCount',type:'number',label:'أدوار مصبوبة'},{id:'cubeTest',type:'toggle',label:'اختبار المكعبات'},{id:'notes',type:'textarea',label:'ملاحظات'}],
    MasonryAndWalls:  [{id:'blockType',type:'text',label:'نوع البلوك'},{id:'plastering',type:'toggle',label:'البياض'},{id:'waterproofing',type:'toggle',label:'العزل المائي'},{id:'notes',type:'textarea',label:'ملاحظات'}],
    InitialFinishing: [{id:'electrical',type:'toggle',label:'الكهربائية'},{id:'plumbing',type:'toggle',label:'السباكة'},{id:'tiling',type:'toggle',label:'التبليط'},{id:'notes',type:'textarea',label:'ملاحظات'}],
    FinalFinishing:   [{id:'painting',type:'toggle',label:'الدهان'},{id:'kitchens',type:'toggle',label:'المطابخ'},{id:'acInstalled',type:'toggle',label:'التكييف'},{id:'notes',type:'textarea',label:'ملاحظات'}],
    Handover:         [{id:'handoverDate',type:'date',label:'تاريخ التسليم'},{id:'snagsDone',type:'toggle',label:'حل الملاحظات'},{id:'keysHanded',type:'toggle',label:'تسليم المفاتيح'},{id:'notes',type:'textarea',label:'ملاحظات'}],
  };

  /* ══════════ CSS ══════════ */
  const _css = `
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:var(--primary-deep);--surface:var(--card-bg);--surface2:var(--primary-deep);--surface3:var(--card-hover);
      --border:rgba(var(--fg-rgb), .07);--border-h:rgba(var(--fg-rgb), .14);
      --text:var(--light);--text2:var(--text-muted);--muted:var(--text-muted);--muted2:var(--text-muted);
      --accent:#4e8df5;--accent-dim:rgba(var(--accent-rgb),.12);--accent-bd:rgba(var(--accent-rgb),.28);
      --success:#34c759;--success-dim:rgba(52,199,89,.11);--success-bd:rgba(52,199,89,.28);
      --warning:#ffcc00;--warning-dim:rgba(255,204,0,.11);--warning-bd:rgba(255,204,0,.3);
      --danger:#ff3b30;--danger-dim:rgba(255,59,48,.09);--danger-bd:rgba(255,59,48,.22);
      --r:14px;--r-sm:9px;--r-xs:6px;--tr:all .2s ease;
    }
    @keyframes cs-spin{to{transform:rotate(360deg)}}
    @keyframes cs-fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes cs-fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes cs-popIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
    @keyframes cs-barGrow{from{width:0}}
    @keyframes cs-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}

    .cs-page{padding:0 0 100px;max-width:1060px;margin:0 auto;animation:cs-fadeIn .3s ease}

    /* Header */
    .cs-hdr{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:24px;flex-wrap:wrap}
    .cs-hdr-l{display:flex;align-items:center;gap:12px}
    .cs-hdr-icon{width:44px;height:44px;border-radius:12px;background:var(--accent-dim);border:1px solid var(--accent-bd);display:flex;align-items:center;justify-content:center;color:var(--accent);font-size:1.2rem;flex-shrink:0}
    .cs-hdr-title{font-size:1.1rem;font-weight:800;color:var(--text)}
    .cs-hdr-sub{font-size:.74rem;color:var(--muted);margin-top:2px}

    /* Search */
    .cs-filters{display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap}
    .cs-search{flex:1;min-width:200px;display:flex;align-items:center;gap:8px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-sm);padding:0 12px;transition:border-color .2s}
    .cs-search:focus-within{border-color:var(--accent-bd)}
    .cs-search i{color:var(--muted);font-size:.9rem;flex-shrink:0}
    .cs-search input{flex:1;background:transparent;border:none;outline:none;padding:9px 0;color:var(--text);font-family:inherit;font-size:.88rem}
    .cs-search input::placeholder{color:var(--muted2)}

    /* Project Cards */
    .cs-proj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px}
    .cs-proj-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);cursor:pointer;transition:var(--tr);overflow:hidden;animation:cs-fadeUp .45s ease both;display:flex;flex-direction:column}
    .cs-proj-card:hover{border-color:var(--accent-bd);transform:translateY(-3px);box-shadow:0 10px 32px rgba(0,0,0,.3)}
    .cs-proj-top{padding:16px 18px;display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
    .cs-proj-letter{width:44px;height:44px;border-radius:11px;flex-shrink:0;background:linear-gradient(135deg,var(--accent-dim),rgba(var(--accent-rgb),.05));border:1px solid var(--accent-bd);display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:900;color:var(--accent)}
    .cs-proj-name{font-size:.96rem;font-weight:800;color:var(--text);line-height:1.3}
    .cs-proj-code{font-size:.72rem;color:var(--muted);margin-top:3px}
    .cs-proj-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:20px;font-size:.67rem;font-weight:700;flex-shrink:0}
    .cs-proj-badge.wip{background:var(--warning-dim);color:var(--warning);border:1px solid var(--warning-bd)}
    .cs-proj-badge.done{background:var(--success-dim);color:var(--success);border:1px solid var(--success-bd)}
    .cs-proj-prog{padding:0 18px 14px}
    .cs-proj-prog-hd{display:flex;justify-content:space-between;margin-bottom:6px;font-size:.72rem;color:var(--muted);font-weight:600}
    .cs-proj-prog-track{height:6px;background:rgba(var(--fg-rgb), .05);border-radius:6px;overflow:hidden}
    .cs-proj-prog-fill{height:100%;border-radius:6px;animation:cs-barGrow .9s ease both}
    .cs-proj-prog-fill.wip{background:linear-gradient(90deg,var(--warning),rgba(255,204,0,.6))}
    .cs-proj-prog-fill.done{background:linear-gradient(90deg,var(--success),rgba(52,199,89,.6))}
    .cs-proj-prog-fill.acc{background:linear-gradient(90deg,var(--accent),rgba(var(--accent-rgb),.6))}
    .cs-proj-foot{padding:10px 18px;border-top:1px solid var(--border);display:flex;gap:8px;flex-wrap:wrap;align-items:center}

    /* Stages View */
    .cs-stages-view{animation:cs-fadeIn .25s ease}
    .cs-back-bar{display:flex;align-items:center;gap:12px;margin-bottom:22px;padding:10px 14px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r);cursor:pointer;transition:var(--tr);width:fit-content}
    .cs-back-bar:hover{border-color:var(--accent-bd);background:var(--surface3)}
    .cs-back-bar i{color:var(--accent);font-size:1rem}
    .cs-back-bar span{font-size:.88rem;font-weight:700;color:var(--text2)}

    .cs-proj-banner{background:linear-gradient(135deg,var(--surface),var(--surface3));border:1px solid var(--border-h);border-radius:var(--r);padding:18px 20px;margin-bottom:20px}
    .cs-banner-top{display:flex;align-items:center;gap:16px;margin-bottom:14px}
    .cs-banner-icon{width:48px;height:48px;border-radius:13px;flex-shrink:0;background:var(--accent-dim);border:1px solid var(--accent-bd);display:flex;align-items:center;justify-content:center;font-size:1.3rem;color:var(--accent)}
    .cs-banner-info{flex:1;min-width:0}
    .cs-banner-name{font-size:1.05rem;font-weight:800;color:var(--text)}
    .cs-banner-sub{font-size:.78rem;color:var(--muted);margin-top:3px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
    .cs-banner-pct{font-size:1.6rem;font-weight:900;color:var(--accent);line-height:1}
    .cs-banner-pct-lbl{font-size:.65rem;color:var(--muted);font-weight:600;margin-top:2px}
    .cs-banner-prog-track{height:8px;background:rgba(var(--fg-rgb), .05);border-radius:8px;overflow:hidden}
    .cs-banner-prog-fill{height:100%;border-radius:8px;background:linear-gradient(90deg,#2563eb,var(--accent),#34d399);animation:cs-barGrow 1s ease both}
    .cs-banner-prog-lbl{display:flex;justify-content:space-between;font-size:.7rem;color:var(--muted);margin-top:5px}
    .cs-eng-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:20px;font-size:.7rem;font-weight:700;background:rgba(var(--accent-rgb),.1);color:var(--accent);border:1px solid var(--accent-bd)}

    /* Stage Cards — Timeline style */
    .cs-timeline{display:flex;flex-direction:column;gap:0;position:relative}
    .cs-tl-line{position:absolute;right:19px;top:0;bottom:0;width:2px;background:rgba(var(--fg-rgb), .06);z-index:0;border-radius:2px}
    .cs-stage-row{display:flex;gap:14px;align-items:flex-start;position:relative;z-index:1;margin-bottom:8px;animation:cs-fadeUp .4s ease both}
    .cs-dot-col{display:flex;flex-direction:column;align-items:center;flex-shrink:0;padding-top:14px}
    .cs-dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.78rem;font-weight:800;border:2px solid transparent;position:relative;z-index:2;background:var(--bg)}
    .cs-dot.done{border-color:var(--success);color:var(--success);background:#0a1a12}
    .cs-dot.active{border-color:var(--warning);color:var(--warning);background:#1a1500;box-shadow:0 0 0 5px rgba(255,204,0,.08)}
    .cs-dot.locked{border-color:rgba(var(--fg-rgb), .08);color:var(--muted2);background:var(--bg)}

    .cs-stage-card{flex:1;background:var(--surface);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;transition:border-color .2s}
    .cs-stage-card.done-card{border-color:var(--success-bd)}
    .cs-stage-card.active-card{border-color:var(--warning-bd);box-shadow:0 0 0 1px rgba(255,204,0,.1)}
    .cs-stage-card.locked-card{opacity:.5}

    .cs-stage-head{display:flex;align-items:center;gap:10px;padding:13px 16px;cursor:pointer;user-select:none;transition:background .2s}
    .cs-stage-head:hover{background:rgba(var(--fg-rgb), .02)}
    .cs-stage-card.locked-card .cs-stage-head{cursor:default}
    .cs-stage-icon-box{width:30px;height:30px;border-radius:8px;background:rgba(var(--fg-rgb), .04);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--text2);font-size:.9rem;flex-shrink:0}
    .cs-stage-info{flex:1;min-width:0}
    .cs-stage-name{font-size:.88rem;font-weight:700;color:var(--text)}
    .cs-stage-card.locked-card .cs-stage-name{color:var(--muted)}
    .cs-stage-meta{font-size:.7rem;color:var(--muted);margin-top:2px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
    .cs-stage-badge{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:14px;font-size:.65rem;font-weight:700}
    .cs-stage-badge.done{background:var(--success-dim);color:var(--success);border:1px solid var(--success-bd)}
    .cs-stage-badge.active{background:var(--warning-dim);color:var(--warning);border:1px solid var(--warning-bd)}
    .cs-stage-badge.locked{background:rgba(var(--fg-rgb), .03);color:var(--muted2);border:1px solid var(--border)}
    .cs-stage-chevron{color:var(--muted);font-size:.9rem;flex-shrink:0;transition:transform .2s}
    .cs-stage-card.open .cs-stage-chevron{transform:rotate(180deg)}
    .cs-stage-body{display:none;padding:0 16px 16px;border-top:1px solid var(--border);animation:cs-fadeUp .2s ease}
    .cs-stage-card.open .cs-stage-body{display:block}

    /* Checklist */
    .cs-checklist{margin:12px 0;background:rgba(var(--accent-rgb),.05);border:1px solid var(--accent-bd);border-radius:var(--r-sm);padding:12px 14px}
    .cs-check-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:5px;margin-top:8px}
    .cs-check-item{display:flex;align-items:center;gap:6px;font-size:.74rem;color:var(--text2)}
    .cs-check-item.chk{color:var(--success)}
    .cs-check-dot{width:17px;height:17px;border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:.62rem;flex-shrink:0}
    .cs-check-dot.chk{background:var(--success-dim);color:var(--success);border:1px solid var(--success-bd)}
    .cs-check-dot.unchk{background:rgba(var(--fg-rgb), .04);color:var(--muted);border:1px solid var(--border)}

    /* Report summary inside card */
    .cs-rep-summary{margin:10px 0;background:rgba(var(--fg-rgb), .02);border:1px solid var(--border);border-radius:var(--r-sm);padding:10px 12px}
    .cs-rep-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:6px;margin-top:8px}
    .cs-rep-field{background:rgba(var(--fg-rgb), .03);border:1px solid var(--border);border-radius:8px;padding:8px 10px}
    .cs-rep-label{font-size:.62rem;color:var(--muted2);margin-bottom:4px;font-weight:700;text-transform:uppercase;letter-spacing:.04em}
    .cs-chip{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:20px;font-size:.74rem;font-weight:700}
    .cs-cy{background:var(--success-dim);color:var(--success);border:1px solid var(--success-bd)}
    .cs-cn{background:var(--danger-dim);color:var(--danger);border:1px solid var(--danger-bd)}

    /* Photos strip in card */
    .cs-photos-strip{display:flex;flex-wrap:wrap;gap:7px;margin:10px 0}
    .cs-photo-thumb{width:70px;height:70px;border-radius:9px;object-fit:cover;border:1px solid var(--border-h);cursor:pointer;transition:var(--tr);display:block;background:var(--surface2)}
    .cs-photo-thumb:hover{border-color:var(--accent-bd);transform:scale(1.06)}

    /* Actions row */
    .cs-actions{display:flex;gap:8px;flex-wrap:wrap;padding-top:10px;border-top:1px solid var(--border);margin-top:4px}

    /* Buttons */
    .cs-btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:var(--r-sm);border:none;font-family:inherit;font-size:.82rem;font-weight:700;cursor:pointer;transition:var(--tr);white-space:nowrap}
    .cs-btn:disabled{opacity:.4;cursor:not-allowed}
    .cs-btn-p{background:var(--accent-dim);color:var(--accent);border:1px solid var(--accent-bd)}
    .cs-btn-p:hover:not(:disabled){background:rgba(var(--accent-rgb),.22)}
    .cs-btn-s{background:var(--success-dim);color:var(--success);border:1px solid var(--success-bd)}
    .cs-btn-s:hover:not(:disabled){background:rgba(52,199,89,.22)}
    .cs-btn-g{background:rgba(var(--fg-rgb), .04);color:var(--text2);border:1px solid var(--border-h)}
    .cs-btn-g:hover:not(:disabled){background:rgba(var(--fg-rgb), .09)}
    .cs-btn-w{background:var(--warning-dim);color:var(--warning);border:1px solid var(--warning-bd)}
    .cs-btn-w:hover:not(:disabled){background:rgba(255,204,0,.2)}
    .cs-btn-d{background:var(--danger-dim);color:var(--danger);border:1px solid var(--danger-bd)}
    .cs-btn-d:hover:not(:disabled){background:rgba(255,59,48,.18)}
    .cs-btn-sm{padding:5px 11px;font-size:.75rem;border-radius:7px}

    /* Modal */
    #cs-modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:1000;align-items:center;justify-content:center;backdrop-filter:blur(10px);padding:12px}
    #cs-modal.open{display:flex;animation:cs-fadeIn .18s ease}
    .cs-mbox{background:var(--card-bg);border:1px solid var(--border-h);border-radius:18px;max-width:660px;width:100%;max-height:92vh;overflow-y:auto;animation:cs-popIn .22s ease;box-shadow:0 36px 80px rgba(0,0,0,.7)}
    .cs-mbox::-webkit-scrollbar{width:5px}
    .cs-mbox::-webkit-scrollbar-thumb{background:rgba(var(--fg-rgb), .08);border-radius:4px}
    .cs-mhead{padding:15px 18px 13px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:flex-start;gap:10px;position:sticky;top:0;background:var(--card-bg);z-index:2;border-radius:18px 18px 0 0}
    .cs-mhead-title{font-size:.95rem;font-weight:800;color:var(--text)}
    .cs-mhead-sub{font-size:.72rem;color:var(--muted);margin-top:3px}
    .cs-mcls{background:rgba(var(--fg-rgb), .05);border:1px solid var(--border);color:var(--muted);cursor:pointer;width:30px;height:30px;display:flex;align-items:center;justify-content:center;border-radius:8px;font-size:.95rem;transition:var(--tr);flex-shrink:0}
    .cs-mcls:hover{color:var(--text);background:var(--danger-dim);border-color:var(--danger-bd)}
    .cs-mbody{padding:18px 20px}
    .cs-mfoot{padding:12px 18px 16px;border-top:1px solid var(--border);display:flex;gap:8px;flex-wrap:wrap}

    /* Form fields in modal */
    .cs-field{margin-bottom:12px}
    .cs-lbl{display:block;font-size:.69rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px}
    .cs-input{width:100%;padding:8px 11px;border-radius:var(--r-xs);background:rgba(var(--fg-rgb), .04);border:1px solid rgba(var(--fg-rgb), .09);color:var(--text);font-family:inherit;font-size:.84rem;transition:var(--tr)}
    .cs-input:focus{outline:none;background:var(--accent-dim);border-color:var(--accent-bd)}
    .cs-ta{width:100%;padding:8px 11px;border-radius:var(--r-xs);background:rgba(var(--fg-rgb), .04);border:1px solid rgba(var(--fg-rgb), .09);color:var(--text);font-family:inherit;font-size:.84rem;resize:vertical;min-height:68px;transition:var(--tr)}
    .cs-ta:focus{outline:none;background:var(--accent-dim);border-color:var(--accent-bd)}
    .cs-yn-row{display:flex;gap:8px}
    .cs-yn-btn{flex:1;padding:7px 0;border-radius:var(--r-xs);border:1px solid var(--border);background:rgba(var(--fg-rgb), .03);color:var(--muted);font-family:inherit;font-size:.82rem;font-weight:700;cursor:pointer;transition:var(--tr)}
    .cs-yn-btn.yes{background:var(--success-dim);color:var(--success);border-color:var(--success-bd)}
    .cs-yn-btn.no{background:var(--danger-dim);color:var(--danger);border-color:var(--danger-bd)}

    /* Photos in modal */
    .cs-modal-photos{display:flex;flex-wrap:wrap;gap:7px;margin:8px 0 12px}
    .cs-mphoto-wrap{position:relative}
    .cs-mphoto-thumb{width:80px;height:80px;border-radius:9px;object-fit:cover;border:1px solid var(--border-h);cursor:pointer;display:block;background:var(--surface2);transition:var(--tr)}
    .cs-mphoto-thumb:hover{border-color:var(--accent-bd);transform:scale(1.05)}
    .cs-mphoto-del{position:absolute;top:2px;right:2px;width:20px;height:20px;border-radius:50%;background:var(--danger);color:var(--light);font-size:.6rem;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;font-family:inherit;opacity:0;transition:opacity .2s}
    .cs-mphoto-wrap:hover .cs-mphoto-del{opacity:1}
    .cs-add-photo-btn{width:80px;height:80px;border-radius:9px;border:1.5px dashed var(--border-h);background:rgba(var(--fg-rgb), .02);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;cursor:pointer;color:var(--muted);font-size:.57rem;transition:var(--tr);flex-shrink:0}
    .cs-add-photo-btn:hover{border-color:var(--accent-bd);color:var(--accent);background:var(--accent-dim)}
    .cs-add-photo-btn i{font-size:1.1rem}

    /* Section title */
    .cs-sec-title{font-size:.7rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;display:flex;align-items:center;gap:7px}
    .cs-sec-title::after{content:'';flex:1;height:1px;background:var(--border)}

    /* Lightbox */
    #cs-lightbox{display:none;position:fixed;inset:0;background:rgba(0,0,0,.95);z-index:2000;align-items:center;justify-content:center;flex-direction:column;gap:14px}
    #cs-lightbox.open{display:flex;animation:cs-fadeIn .15s ease}
    #cs-lb-img{max-width:90vw;max-height:78vh;border-radius:10px;object-fit:contain;display:block}
    .cs-lb-bar{display:flex;gap:8px;align-items:center}
    .cs-lb-btn{padding:7px 14px;border-radius:8px;border:1px solid rgba(var(--fg-rgb), .12);background:rgba(var(--fg-rgb), .08);color:var(--light);font-size:.8rem;cursor:pointer;display:flex;align-items:center;gap:5px;font-family:inherit;font-weight:600;transition:var(--tr)}
    .cs-lb-btn:hover{background:rgba(var(--fg-rgb), .16)}
    .cs-lb-counter{font-size:.78rem;color:rgba(var(--fg-rgb), .4);text-align:center;min-width:60px}

    /* Assign modal */
    .cs-assign-list{display:flex;flex-direction:column;gap:7px;max-height:300px;overflow-y:auto}
    .cs-assign-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:var(--r-sm);background:var(--surface2);border:1px solid var(--border);cursor:pointer;transition:var(--tr)}
    .cs-assign-item:hover{border-color:var(--accent-bd)}
    .cs-assign-item input{accent-color:var(--accent);width:16px;height:16px;cursor:pointer}
    .cs-assign-item-name{font-size:.85rem;font-weight:700;color:var(--text);flex:1}
    .cs-assign-item-meta{font-size:.7rem;color:var(--muted)}

    /* Loaders */
    .cs-spin{width:32px;height:32px;border:3px solid rgba(var(--fg-rgb), .06);border-top-color:var(--accent);border-radius:50%;animation:cs-spin .75s linear infinite}
    .cs-loader-box{display:flex;align-items:center;justify-content:center;min-height:180px}
    .cs-skel{background:linear-gradient(90deg,rgba(var(--fg-rgb), .03) 25%,rgba(var(--fg-rgb), .07) 50%,rgba(var(--fg-rgb), .03) 75%);background-size:200% 100%;animation:cs-shimmer 1.5s infinite;border-radius:var(--r)}
    .cs-emp{text-align:center;padding:60px 20px;color:var(--muted2)}
    .cs-emp i{font-size:2.4rem;display:block;margin-bottom:12px;opacity:.2}
    .cs-emp p{font-size:.88rem;line-height:1.8}
    .cs-done-banner{text-align:center;padding:22px;background:var(--success-dim);border:1px solid var(--success-bd);border-radius:14px;margin-top:8px}
    .cs-done-banner .cs-done-emoji{font-size:2rem;display:block;margin-bottom:8px}
    .cs-done-banner p{color:var(--success);font-weight:800;font-size:.95rem}

    @media(max-width:640px){.cs-page{padding:0 0 80px}}
  `;

  /* ══════════ MODULE ══════════ */
  window.__pages['buildings'] = {
    getCSS: function () { return _css; },
    init: async function () {

      const container = document.getElementById('app-main');
      container.innerHTML = `
        <div id="cs-modal">
          <div class="cs-mbox" id="cs-mbox">
            <div class="cs-mhead" id="cs-mhead">
              <div>
                <div class="cs-mhead-title" id="cs-mTitle">—</div>
                <div class="cs-mhead-sub"  id="cs-mSub"></div>
              </div>
              <button class="cs-mcls" id="cs-mCls"><i class="ri-close-line"></i></button>
            </div>
            <div class="cs-mbody" id="cs-mBody"></div>
          </div>
        </div>
        <div id="cs-lightbox">
          <img id="cs-lb-img" src="" alt=""/>
          <div id="cs-lb-caption" style="color:rgba(var(--fg-rgb), .4);font-size:.78rem"></div>
          <div class="cs-lb-bar">
            <button class="cs-lb-btn" id="cs-lb-prev"><i class="ri-arrow-right-line"></i> السابقة</button>
            <span class="cs-lb-counter" id="cs-lb-cnt"></span>
            <button class="cs-lb-btn" id="cs-lb-close"><i class="ri-close-line"></i> إغلاق</button>
            <button class="cs-lb-btn" id="cs-lb-next">التالية <i class="ri-arrow-left-line"></i></button>
          </div>
        </div>
        <div class="cs-page" id="cs-root"></div>`;

      /* ── Auth ── */
      let authData = {};
      try { authData = JSON.parse(localStorage.getItem('authData') || '{}'); } catch {}

      /* ── API ── */
      const API_BASE = window.location.origin;

      function getToken() {
        let t = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!t) { try { const p = JSON.parse(localStorage.getItem('authData') || '{}'); t = p.token; } catch {} }
        return t || '';
      }

      function esc(s) {
        return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
      }

      function arr(v) {
        if (Array.isArray(v)) return v;
        if (v && typeof v === 'object') return v['$values'] || v.data || v.items || v.value || v.results || [];
        return [];
      }

      function fmtDate(d) {
        if (!d) return null;
        try { return new Date(d).toLocaleDateString('ar-SA', { calendar:'gregory', numberingSystem:'latn', year:'numeric', month:'long', day:'numeric' }); } catch { return null; }
      }

      async function apiReq(method, path, body) {
        const token = getToken();
        if (!token) { window.__showToast?.('يرجى تسجيل الدخول أولاً', 'error'); setTimeout(() => location.replace('/login'), 1400); return null; }
        const opts = { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` } };
        if (body !== undefined) opts.body = JSON.stringify(body);
        try {
          const r = await fetch(API_BASE + path, opts);
          if (r.status === 401) { window.__showToast?.('انتهت الجلسة', 'warning'); setTimeout(() => { ['authData','token','authToken'].forEach(k => localStorage.removeItem(k)); location.replace('/login'); }, 2000); return null; }
          if (r.status === 403) { window.__showToast?.('ليس لديك صلاحية', 'error'); return null; }
          if (!r.ok) { let m = `خطأ ${r.status}`; try { const b = await r.json(); m = b?.message || b?.title || m; } catch {} throw new Error(m); }
          if (r.status === 204) return true;
          const txt = await r.text().catch(() => '');
          if (!txt || !txt.trim()) return true;
          try { return JSON.parse(txt); } catch { return true; }
        } catch (err) {
          if (err.name !== 'AbortError') window.__showToast?.('تعذر الاتصال بالخادم', 'error');
          throw err;
        }
      }

      async function uploadFile(path, file, extra) {
        const token = getToken();
        const fd = new FormData();
        fd.append('file', file);
        if (extra) Object.entries(extra).forEach(([k,v]) => fd.append(k, v));
        const r = await fetch(API_BASE + path, { method:'POST', headers:{ 'Authorization':`Bearer ${token}` }, body:fd });
        if (!r.ok) throw new Error(`خطأ ${r.status}`);
        const txt = await r.text().catch(() => '');
        if (!txt || !txt.trim()) return null;
        try { return JSON.parse(txt); } catch { return null; }
      }

      const GET  = p      => apiReq('GET', p);
      const PUT  = (p, b) => apiReq('PUT', p, b);
      const POST = (p, b) => apiReq('POST', p, b);
      const DEL  = p      => apiReq('DELETE', p);

      /* ── Modal ── */
      const _modal  = document.getElementById('cs-modal');
      const _mTitle = document.getElementById('cs-mTitle');
      const _mSub   = document.getElementById('cs-mSub');
      const _mBody  = document.getElementById('cs-mBody');
      function openModal(title, sub, html) { _mTitle.textContent = title; _mSub.innerHTML = sub||''; _mBody.innerHTML = html; _modal.classList.add('open'); document.getElementById('cs-mbox')?.scrollTo(0,0); }
      function closeModal() { _modal.classList.remove('open'); _mBody.innerHTML = ''; }
      document.getElementById('cs-mCls').addEventListener('click', closeModal, { signal: window.__pageAbortSignal });
      _modal.addEventListener('click', e => { if (e.target === _modal) closeModal(); }, { signal: window.__pageAbortSignal });
      document.addEventListener('keydown', e => { if (e.key === 'Escape') { if (document.getElementById('cs-lightbox').classList.contains('open')) closeLb(); else if (_modal.classList.contains('open')) closeModal(); } }, { signal: window.__pageAbortSignal });

      /* ── Lightbox ── */
      let _lbImgs = [], _lbIdx = 0;
      function imgSrc(img) {
        let s = img?.imageUrl || img?.ImageUrl || img?.url || img?.src || img?.filePath || img?.path || '';
        if (s && !s.startsWith('http') && !s.startsWith('blob') && !s.startsWith('data')) s = `${API_BASE}/${s.replace(/^\/+/,'')}`;
        if (s && location.protocol === 'https:') s = s.replace(/^http:\/\//i, 'https://');
        return s;
      }
      function openLb(imgs, idx) { _lbImgs = imgs; _lbIdx = Math.min(idx, imgs.length-1); showLbFrame(); document.getElementById('cs-lightbox').classList.add('open'); }
      function closeLb() { document.getElementById('cs-lightbox').classList.remove('open'); }
      function showLbFrame() {
        const img = _lbImgs[_lbIdx];
        document.getElementById('cs-lb-img').src = imgSrc(img);
        document.getElementById('cs-lb-cnt').textContent = `${_lbIdx+1} / ${_lbImgs.length}`;
        document.getElementById('cs-lb-caption').textContent = img?.caption || '';
        document.getElementById('cs-lb-prev').style.opacity = _lbImgs.length > 1 ? '1' : '.3';
        document.getElementById('cs-lb-next').style.opacity = _lbImgs.length > 1 ? '1' : '.3';
      }
      document.getElementById('cs-lb-close').addEventListener('click', closeLb, { signal: window.__pageAbortSignal });
      document.getElementById('cs-lightbox').addEventListener('click', e => { if (e.target === document.getElementById('cs-lightbox')) closeLb(); }, { signal: window.__pageAbortSignal });
      document.getElementById('cs-lb-prev').addEventListener('click', () => { _lbIdx = (_lbIdx - 1 + _lbImgs.length) % _lbImgs.length; showLbFrame(); }, { signal: window.__pageAbortSignal });
      document.getElementById('cs-lb-next').addEventListener('click', () => { _lbIdx = (_lbIdx + 1) % _lbImgs.length; showLbFrame(); }, { signal: window.__pageAbortSignal });

      function spinHtml() { return `<span style="display:inline-block;width:14px;height:14px;border:2px solid rgba(var(--fg-rgb), .2);border-top-color:currentColor;border-radius:50%;animation:cs-spin .6s linear infinite;vertical-align:middle"></span>`; }

      /* ── State ── */
      const S = { allProjects:[], projects:[], search:'', currentProject:null, currentStages:[], currentImages:{}, allEngineers:[], assignedEngMap:{}, stagesMap:{} };

      /* ── Helpers ── */
      function projInitials(n) { if (!n) return '?'; const w = n.trim().split(' '); return (w[0]?.charAt(0)||'')+(w[1]?.charAt(0)||''); }

      function isUC(p) { const s = String(p.status||p.Status||''); return s==='1'||s.toLowerCase().replace(/\s/g,'')===('underconstruction'); }

      /* المرحلة موجودة في الـ DB؟ */
      function getDbStage(def) {
        return S.currentStages.find(s => {
          const sn = (s.stageName||'').trim();
          return sn === def.key || sn === def.label;
        }) || null;
      }

      function isDone(def) { const s = getDbStage(def); return !!(s?.isCompleted || s?.IsCompleted || s?.status === 'Completed'); }

      /* أول مرحلة غير مكتملة */
      function activeIdx() { for (let i=0;i<STAGE_DEFS.length;i++) { if (!isDone(STAGE_DEFS[i])) return i; } return -1; }

      /* هل المرحلة متاحة للتفاعل؟ المرحلة الأولى دايماً، وكل مرحلة بعد اكتمال اللي قبلها */
      function isUnlocked(idx) { if (idx === 0) return true; return isDone(STAGE_DEFS[idx-1]); }

      function stageImages(stageId) { return S.currentImages[stageId] || []; }

      /* آخر مرحلة مكتملة (للحذف) */
      function lastCompletedDef() {
        let last = null;
        for (const def of STAGE_DEFS) { if (isDone(def)) last = def; else break; }
        return last;
      }

      function pct() { return Math.round(STAGE_DEFS.filter(d => isDone(d)).length / STAGE_DEFS.length * 100); }

      /* ══════════════════════════════
         LOAD DATA
      ══════════════════════════════ */
      async function loadData() {
        const root = document.getElementById('cs-root');
        if (root) root.innerHTML = `<div class="cs-proj-grid">${[1,2,3,4,5,6].map((_,i)=>`<div class="cs-skel" style="height:185px;animation-delay:${i*60}ms"></div>`).join('')}</div>`;
        try {
          const raw = await GET('/api/Projects');
          S.allProjects = arr(raw).filter(p => !p.isDeleted && !p.IsDeleted);
          S.projects = S.allProjects.filter(p => isUC(p));

          try {
            const users = await GET('/api/Users');
            S.allEngineers = arr(users).filter(u => { const role=(u.roleName||u.role||'').toLowerCase().replace(/\s/g,''); const rid=Number(u.roleId||0); return role==='siteengineer'||role==='3'||rid===3; });
            S.assignedEngMap = {};
            S.allEngineers.forEach(eng => { arr(eng.assignedProjectIds||[]).forEach(pid => { if (!S.assignedEngMap[pid]) S.assignedEngMap[pid]=[]; const nm=`${eng.firstName||''} ${eng.lastName||''}`.trim(); if(nm) S.assignedEngMap[pid].push(nm); }); });
          } catch {}

          // fetch stages for all UC projects in parallel to show progress on cards
          S.stagesMap = {};
          await Promise.allSettled(S.projects.map(async p => {
            try {
              let data = null;
              try { data = await GET(`/api/ConstructionStages/project/${p.id}`); } catch {}
              if (!data) { try { data = await GET(`/api/ConstructionStages?projectId=${p.id}`); } catch {} }
              S.stagesMap[p.id] = arr(data).sort((a,b)=>(a.id||0)-(b.id||0));
            } catch { S.stagesMap[p.id] = []; }
          }));

          renderProjectsView();
        } catch(e) {
          const r2=document.getElementById('cs-root');
          if(r2) r2.innerHTML=`<div class="cs-emp"><i class="ri-wifi-off-line"></i><p>فشل تحميل المشاريع<br><small>${esc(e.message)}</small></p></div>`;
        }
      }

      /* ══════════════════════════════
         LOAD STAGES
      ══════════════════════════════ */
      async function loadStages(pid) {
        // تحديث بيانات المشروع من الـ API لاكتشاف أي تغيير في الحالة تلقائياً
        try {
          const freshProj = await GET(`/api/Projects/${pid}`);
          if (freshProj) {
            S.currentProject = freshProj;
            // تحديث قائمة المشاريع أيضاً
            const idx = S.projects.findIndex(p => String(p.id) === String(pid));
            if (idx !== -1) S.projects[idx] = freshProj;
          }
        } catch {}
        let data = null;
        try { data = await GET(`/api/ConstructionStages/project/${pid}`); } catch {}
        if (!data) { try { data = await GET(`/api/ConstructionStages?projectId=${pid}`); } catch {} }
        const stages = arr(data).sort((a,b) => (a.id||0)-(b.id||0));
        S.currentStages = stages;
        S.stagesMap[pid] = stages; // زامن كارت القائمة مع آخر مراحل محمّلة (يشمل المراحل المُنشأة لِتوّها وإكمالها)
        S.currentImages = {};
        await Promise.all(stages.map(async s => {
          if (!s.id) return;
          try { const imgs = await GET(`/api/StageImages?stageId=${s.id}`); S.currentImages[s.id] = arr(imgs); }
          catch { S.currentImages[s.id] = arr(s.images||s.Images||s.stageImages||[]); }
        }));
        return stages;
      }

      /* ══════════════════════════════
         PROJECT CARD
      ══════════════════════════════ */
      function renderProjCard(p, idx) {
        const _pStages = S.stagesMap[p.id] || [];
        // عدّ المراحل المكتملة مباشرة (أمتن من مطابقة الأسماء) مع دعم كل أشكال الحقول
        const _isStageDone = st => !!(st && (st.isCompleted || st.IsCompleted || st.status === 'Completed' || st.status === 2 || st.Status === 2));
        const _pct = _pStages.length
          ? Math.round(_pStages.filter(_isStageDone).length / 7 * 100)
          : Number(p.completionPercentage??0);
        const fillCls = _pct >= 100 ? 'done' : _pct > 0 ? 'wip' : 'acc';
        const pctColor = _pct >= 100 ? 'var(--success)' : _pct > 0 ? 'var(--warning)' : 'var(--accent)';
        const engNames = S.assignedEngMap[p.id] || [];
        return `
          <div class="cs-proj-card" data-pid="${p.id}" style="animation-delay:${idx*50}ms" tabindex="0" role="button">
            <div class="cs-proj-top">
              <div style="flex:1;min-width:0;display:flex;gap:10px;align-items:flex-start">
                <div class="cs-proj-letter">${esc(projInitials(p.name||'?'))}</div>
                <div style="flex:1;min-width:0">
                  <div class="cs-proj-name">${esc(p.name||'—')}</div>
                  ${p.location||p.address?`<div class="cs-proj-code"><i class="ri-map-pin-line"></i> ${esc(p.location||p.address)}</div>`:''}
                  ${engNames.length?`<div class="cs-proj-code" style="color:var(--accent)"><i class="ri-hard-hat-line"></i> ${esc(engNames.join('، '))}</div>`:''}
                </div>
              </div>
              <span class="cs-proj-badge wip"><i class="ri-tools-fill"></i> تحت الإنشاء</span>
            </div>
            <div class="cs-proj-prog">
              <div class="cs-proj-prog-hd">
                <span>نسبة الإنجاز</span>
                <span style="font-weight:900;color:${pctColor}">${_pct}%</span>
              </div>
              <div class="cs-proj-prog-track"><div class="cs-proj-prog-fill ${fillCls}" style="width:${_pct}%"></div></div>
            </div>
            <div class="cs-proj-foot">
              <button class="cs-btn cs-btn-p cs-btn-sm cs-assign-proj-btn" data-pid="${p.id}">
                <i class="ri-user-settings-line"></i> تخصيص مهندس
                ${engNames.length?`<span style="background:var(--accent);color:#fff;border-radius:10px;padding:1px 6px;font-size:.62rem">${engNames.length}</span>`:''}
              </button>
              <span style="margin-right:auto;font-size:.7rem;color:var(--accent);font-weight:700"><i class="ri-arrow-left-line"></i> عرض المراحل</span>
            </div>
          </div>`;
      }

      /* ══════════════════════════════
         PROJECTS VIEW
      ══════════════════════════════ */
      function renderProjectsView() {
        const root = document.getElementById('cs-root'); if (!root) return;
        const list = S.projects.filter(p => { if (!S.search) return true; const q=S.search.toLowerCase(); return (p.name||'').toLowerCase().includes(q)||(p.code||'').toLowerCase().includes(q); });
        root.innerHTML = `
          <div class="cs-hdr">
            <div class="cs-hdr-l">
              <div class="cs-hdr-icon"><i class="ri-building-4-line"></i></div>
              <div>
                <div class="cs-hdr-title">متابعة مراحل الإنشاء</div>
              </div>
            </div>
            <button class="cs-btn cs-btn-g cs-btn-sm" id="cs-refreshBtn"><i class="ri-refresh-line"></i> تحديث</button>
          </div>
          <div class="cs-filters">
            <div class="cs-search">
              <i class="ri-search-line"></i>
              <input type="text" id="cs-searchInp" placeholder="ابحث عن مشروع..." value="${esc(S.search)}"/>
            </div>
          </div>
          ${list.length
            ? `<div class="cs-proj-grid">${list.map((p,i)=>renderProjCard(p,i)).join('')}</div>`
            : `<div class="cs-emp"><i class="ri-building-4-line"></i><p>${S.allProjects.length?'لا توجد مشاريع تحت الإنشاء':'لا توجد مشاريع بعد'}</p></div>`}`;

        document.getElementById('cs-refreshBtn').addEventListener('click', loadData);
        document.getElementById('cs-searchInp').addEventListener('input', function(){ S.search=this.value; renderProjectsView(); });
        document.querySelectorAll('.cs-proj-card').forEach(card => {
          card.addEventListener('click', e => { if (e.target.closest('.cs-assign-proj-btn')) return; openProject(card.dataset.pid); });
          card.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') openProject(card.dataset.pid); });
        });
        document.querySelectorAll('.cs-assign-proj-btn').forEach(btn => { btn.addEventListener('click', e => { e.stopPropagation(); openAssignModal(Number(btn.dataset.pid)); }); });
      }

      /* ══════════════════════════════
         ASSIGN ENGINEERS
      ══════════════════════════════ */
      async function openAssignModal(pid) {
        const proj = S.allProjects.find(p => p.id === pid); if (!proj) return;
        if (!S.allEngineers.length) { window.__showToast?.('لا يوجد مهندسون مسجلون', 'warning'); return; }
        openModal(`👷 تخصيص مهندسين`, esc(proj.name||'—'), `
          <p style="font-size:.8rem;color:var(--muted);margin-bottom:14px">اختر المهندسين لمتابعة هذا المشروع</p>
          <div class="cs-assign-list" id="cs-assign-list">
            ${S.allEngineers.map(eng => {
              const has = (eng.assignedProjectIds||[]).includes(pid);
              const nm = `${eng.firstName||''} ${eng.lastName||''}`.trim();
              return `<label class="cs-assign-item">
                <input type="checkbox" value="${eng.id}" ${has?'checked':''}/>
                <div style="width:30px;height:30px;border-radius:8px;background:var(--accent-dim);border:1px solid var(--accent-bd);display:flex;align-items:center;justify-content:center;color:var(--accent);flex-shrink:0"><i class="ri-hard-hat-line" style="font-size:.85rem"></i></div>
                <div style="flex:1"><div class="cs-assign-item-name">${esc(nm||'—')}</div><div class="cs-assign-item-meta">${(eng.assignedProjectIds||[]).length} مشروع</div></div>
                ${has?`<span style="font-size:.65rem;color:var(--success);font-weight:700"><i class="ri-checkbox-circle-fill"></i></span>`:''}
              </label>`;
            }).join('')}
          </div>
          <div style="display:flex;gap:8px;margin-top:16px">
            <button class="cs-btn cs-btn-s" id="cs-assign-save" style="flex:1"><i class="ri-save-3-line"></i> حفظ التخصيص</button>
            <button class="cs-btn cs-btn-g" id="cs-assign-cancel"><i class="ri-close-line"></i> إلغاء</button>
          </div>`);
        document.getElementById('cs-assign-cancel').addEventListener('click', closeModal);
        document.getElementById('cs-assign-save').addEventListener('click', async () => {
          const checked = [...document.querySelectorAll('#cs-assign-list input:checked')].map(cb => Number(cb.value));
          const btn = document.getElementById('cs-assign-save');
          if (btn) { btn.disabled=true; btn.innerHTML=`${spinHtml()} جاري الحفظ...`; }
          let saved=0,failed=0;
          for (const eng of S.allEngineers) {
            const cur = new Set(eng.assignedProjectIds||[]);
            const should = checked.includes(eng.id);
            if (should === cur.has(pid)) continue;
            if (should) cur.add(pid); else cur.delete(pid);
            try { const ok=await PUT(`/api/Users/${eng.id}/assign-projects`,{projectIds:[...cur]}); if(ok!==null){eng.assignedProjectIds=[...cur];saved++;}else failed++; } catch{failed++;}
          }
          /* تحديث ENG marker في description المشروع */
          try {
            const ENG_RE = /<!--ENG:([\d,\s]*)-->/;
            const selectedEngIds = checked.map(String);
            const p = S.allProjects.find(x => x.id === pid);
            if (p) {
              const cleanDesc = (p.description||'').replace(ENG_RE,'').trim();
              const marker = selectedEngIds.length ? ('<!--ENG:' + selectedEngIds.join(',') + '-->') : '';
              const newDesc = marker ? (cleanDesc ? `${cleanDesc}\n${marker}` : marker) : cleanDesc;
              await PUT(`/api/Projects/${pid}`, {
                name: p.name, location: p.location, description: newDesc,
                status: isUC(p) ? 1 : 2,
                expectedDeliveryDate: p.expectedDeliveryDate || null
              });
              p.description = newDesc;
            }
          } catch {}
          S.assignedEngMap[pid] = S.allEngineers.filter(e=>(e.assignedProjectIds||[]).includes(pid)).map(e=>`${e.firstName||''} ${e.lastName||''}`.trim()).filter(Boolean);
          window.__showToast?.(failed===0?'تم تحديث التخصيص ✓':`تم حفظ ${saved} وفشل ${failed}`,failed===0?'success':'warning');
          closeModal(); renderProjectsView();
        });
      }

      /* ══════════════════════════════
         OPEN PROJECT
      ══════════════════════════════ */
      async function openProject(pid) {
        S.currentProject = S.projects.find(p => String(p.id) === String(pid));
        if (!S.currentProject) return;
        const root = document.getElementById('cs-root');
        if (root) root.innerHTML = `<div class="cs-loader-box"><div class="cs-spin"></div></div>`;
        const stages = await loadStages(pid);
        if (stages.length === 0) {
          if (root) root.innerHTML = `<div class="cs-loader-box" style="flex-direction:column;gap:14px;text-align:center"><div class="cs-spin"></div><p style="color:var(--muted);font-size:.85rem">جاري تهيئة مراحل المشروع...</p></div>`;
          let created=0;
          for (const def of STAGE_DEFS) {
            try {
              const ns = await POST('/api/ConstructionStages', { projectId:Number(pid), stageName:def.label, status:'Pending', isCompleted:false, notes:'', reportData:'{}', startDate:null, endDate:null });
              if (ns?.id) created++;
            } catch {}
          }
          if (created>0) { window.__showToast?.(created===7?'تم تهيئة 7 مراحل ✓':`تم إنشاء ${created} مراحل`,'success'); await loadStages(pid); }
          else { if(root) root.innerHTML=`<div class="cs-stages-view"><div class="cs-back-bar" id="cs-back-err"><i class="ri-arrow-right-line"></i><span>رجوع</span></div><div class="cs-emp"><i class="ri-tools-line"></i><p>لا توجد مراحل</p></div></div>`; document.getElementById('cs-back-err')?.addEventListener('click',()=>{S.currentProject=null;renderProjectsView();}); return; }
        }
        renderStagesView();
      }

      /* ══════════════════════════════
         STAGES VIEW
      ══════════════════════════════ */
      function renderStagesView() {
        const root = document.getElementById('cs-root');
        const p = S.currentProject;
        if (!root || !p) return;

        const doneCnt = STAGE_DEFS.filter(d => isDone(d)).length;
        const _pct = pct();
        const engNames = S.assignedEngMap[p.id] || [];
        const allDone = doneCnt === STAGE_DEFS.length;
        const lcd = lastCompletedDef(); // آخر مرحلة مكتملة (قابلة للحذف)

        // Build stage rows HTML
        let stageRowsHtml = '';
        STAGE_DEFS.forEach((def, idx) => {
          const dbStage = getDbStage(def);
          const done = isDone(def);
          const unlocked = isUnlocked(idx);
          const isActive = unlocked && !done;
          const isLast = lcd?.key === def.key; // هل دي آخر مكتملة؟

          const dotCls = done ? 'done' : isActive ? 'active' : 'locked';
          const dotContent = done ? '<i class="ri-check-line"></i>' : isActive ? '<i class="ri-play-fill"></i>' : `${idx+1}`;
          const cardCls = done ? 'done-card' : isActive ? 'active-card' : 'locked-card';

          const badgeHtml = done
            ? `<span class="cs-stage-badge done"><i class="ri-checkbox-circle-fill"></i> مكتملة</span>`
            : isActive
              ? `<span class="cs-stage-badge active"><i class="ri-record-circle-line"></i> جارية</span>`
              : `<span class="cs-stage-badge locked"><i class="ri-lock-line"></i> مقفلة</span>`;

          let imgs = dbStage ? stageImages(dbStage.id) : [];
          let answers = {};
          try { answers = JSON.parse(dbStage?.reportData||'{}'); } catch {}
          const hasReport = Object.values(answers).some(v => v);

          // Body content (only for unlocked stages)
          let bodyHtml = '';
          if (unlocked && dbStage) {
            // Quick report summary
            if (hasReport) {
              const fields = RFIELDS[def.key]||[];
              const rows = fields.filter(f=>f.id!=='notes'&&answers[f.id]!==undefined&&answers[f.id]!==''&&answers[f.id]!==null).slice(0,4);
              if (rows.length) {
                bodyHtml += `<div class="cs-rep-summary">
                  <div class="cs-sec-title"><i class="ri-file-text-line"></i> ملخص التقرير</div>
                  <div class="cs-rep-grid">
                    ${rows.map(f=>{
                      const v=answers[f.id];
                      let vh='';
                      if(f.type==='toggle') vh=(v===true||v==='true'||v===1)?`<span class="cs-chip cs-cy"><i class="ri-check-line"></i> نعم</span>`:`<span class="cs-chip cs-cn"><i class="ri-close-line"></i> لا</span>`;
                      else vh=`<span style="font-size:.82rem;font-weight:700;color:var(--text)">${esc(v)}</span>`;
                      return `<div class="cs-rep-field"><div class="cs-rep-label">${esc(f.label)}</div>${vh}</div>`;
                    }).join('')}
                  </div>
                </div>`;
              }
            }

            // Photos strip (max 5)
            if (imgs.length) {
              bodyHtml += `<div style="margin-top:10px">
                <div class="cs-sec-title"><i class="ri-image-line"></i> الصور (${imgs.length})</div>
                <div class="cs-photos-strip">
                  ${imgs.slice(0,5).map((img,i)=>`<img class="cs-photo-thumb" src="${esc(imgSrc(img))}" alt="صورة ${i+1}" loading="lazy" data-imgi="${i}" onerror="this.style.display='none'"/>`).join('')}
                  ${imgs.length>5?`<div style="width:70px;height:70px;border-radius:9px;background:var(--surface2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:.78rem;font-weight:700">+${imgs.length-5}</div>`:''}
                </div>
              </div>`;
            }

            // Actions
            bodyHtml += `<div class="cs-actions">
              <button class="cs-btn cs-btn-p cs-btn-sm cs-open-rep" data-defkey="${def.key}">
                <i class="ri-file-edit-line"></i> ${hasReport?'التقرير والصور':'إضافة تقرير'}
                ${imgs.length?`<span style="background:var(--accent);color:#fff;border-radius:10px;padding:1px 6px;font-size:.62rem">${imgs.length}</span>`:''}
              </button>
              ${!done
                ? `<button class="cs-btn cs-btn-s cs-btn-sm cs-mark-done" data-defkey="${def.key}"><i class="ri-checkbox-circle-line"></i> تحديد كمكتملة</button>`
                : `<button class="cs-btn cs-btn-w cs-btn-sm cs-undo-complete" data-defkey="${def.key}"><i class="ri-arrow-go-back-line"></i> إلغاء الاكتمال</button>`
              }
              ${(done && isLast && window.__canDelete?.())
                ? `<button class="cs-btn cs-btn-d cs-btn-sm cs-del-stage" data-defkey="${def.key}" style="margin-right:auto"><i class="ri-delete-bin-line"></i> حذف هذه المرحلة</button>`
                : ''
              }
            </div>`;
          } else if (unlocked && !dbStage) {
            // المرحلة متاحة لكن لم تُبدأ (مثلاً بعد الحذف) — زر إعادة البدء
            bodyHtml = `<div class="cs-actions" style="padding:10px 0">
              <button class="cs-btn cs-btn-s cs-btn-sm cs-start-stage" data-defkey="${def.key}">
                <i class="ri-play-circle-line"></i> بدء هذه المرحلة
              </button>
            </div>`;
          } else if (!unlocked) {
            bodyHtml = `<div style="padding:14px 0;text-align:center;color:var(--muted);font-size:.82rem"><i class="ri-lock-line" style="font-size:1.2rem;display:block;margin-bottom:6px;opacity:.3"></i>أكمل المرحلة السابقة أولاً لفتح هذه المرحلة</div>`;
          }

          const canExpand = unlocked;
          stageRowsHtml += `
            <div class="cs-stage-row" style="animation-delay:${idx*55}ms">
              <div class="cs-dot-col"><div class="cs-dot ${dotCls}">${dotContent}</div></div>
              <div class="cs-stage-card ${cardCls}" data-defkey="${def.key}">
                <div class="cs-stage-head" ${canExpand?`data-defkey="${def.key}"`:'style="cursor:default"'}>
                  <div class="cs-stage-icon-box"><i class="${def.icon}"></i></div>
                  <div class="cs-stage-info">
                    <div class="cs-stage-name">المرحلة ${def.order}: ${esc(def.label)}</div>
                    <div class="cs-stage-meta">
                      ${badgeHtml}
                      ${imgs.length?`<span><i class="ri-image-line"></i> ${imgs.length} صورة</span>`:''}
                      ${hasReport?`<span style="color:var(--accent)"><i class="ri-file-text-line"></i> يوجد تقرير</span>`:''}
                      ${done&&dbStage?.endDate?`<span><i class="ri-calendar-check-line"></i> ${fmtDate(dbStage.endDate)||''}</span>`:''}
                    </div>
                  </div>
                  ${canExpand?`<i class="ri-arrow-down-s-line cs-stage-chevron"></i>`:`<i class="ri-lock-line" style="color:var(--muted2);font-size:.85rem;flex-shrink:0"></i>`}
                </div>
                <div class="cs-stage-body">${bodyHtml}</div>
              </div>
            </div>`;
        });

        root.innerHTML = `
          <div class="cs-stages-view">
            <div class="cs-back-bar" id="cs-backBtn">
              <i class="ri-arrow-right-line"></i><span>العودة للمشاريع</span>
            </div>
            <div class="cs-proj-banner">
              <div class="cs-banner-top">
                <div class="cs-banner-icon"><i class="ri-building-4-line"></i></div>
                <div class="cs-banner-info">
                  <div class="cs-banner-name">${esc(p.name||'—')}</div>
                  <div class="cs-banner-sub">
                    ${isUC(p)
                      ? `<span class="cs-proj-badge wip"><i class="ri-tools-fill"></i> تحت الإنشاء</span>`
                      : `<span class="cs-proj-badge done"><i class="ri-checkbox-circle-line"></i> جاهز</span>`
                    }
                    ${p.location||p.address?`<span><i class="ri-map-pin-line"></i> ${esc(p.location||p.address)}</span>`:''}
                    ${engNames.length?`<span class="cs-eng-badge"><i class="ri-hard-hat-line"></i> ${esc(engNames.join('، '))}</span>`:''}
                  </div>
                </div>
                <div style="text-align:center;flex-shrink:0">
                  <div class="cs-banner-pct" id="cs-ov-pct">${_pct}%</div>
                  <div class="cs-banner-pct-lbl">نسبة الإنجاز</div>
                </div>
              </div>
              <div class="cs-banner-prog-track"><div class="cs-banner-prog-fill" style="width:${_pct}%"></div></div>
              <div class="cs-banner-prog-lbl">
                <span>${doneCnt} من 7 مراحل مكتملة</span>
                ${p.expectedDeliveryDate?`<span><i class="ri-calendar-line"></i> ${new Date(p.expectedDeliveryDate).toLocaleDateString('ar-EG')}</span>`:''}
              </div>
            </div>

            <div class="cs-timeline">
              <div class="cs-tl-line"></div>
              ${stageRowsHtml}
            </div>

            ${allDone?`<div class="cs-done-banner"><span class="cs-done-emoji">🎉</span><p>جميع مراحل البناء مكتملة بنجاح!</p></div>`:''}
          </div>`;

        // Events
        document.getElementById('cs-backBtn').addEventListener('click', () => { S.currentProject=null; S.currentStages=[]; renderProjectsView(); });

        // Accordion toggle
        document.querySelectorAll('.cs-stage-head[data-defkey]').forEach(head => {
          head.addEventListener('click', () => {
            const key = head.dataset.defkey;
            const card = head.closest('.cs-stage-card');
            const wasOpen = card.classList.contains('open');
            document.querySelectorAll('.cs-stage-card').forEach(c => c.classList.remove('open'));
            if (!wasOpen) card.classList.add('open');
          });
        });

        // Photos lightbox in strip
        document.querySelectorAll('.cs-photo-thumb').forEach(img => {
          img.addEventListener('click', e => {
            e.stopPropagation();
            const card = img.closest('.cs-stage-card');
            const def = STAGE_DEFS.find(d => d.key === card?.dataset.defkey);
            const dbStage = def ? getDbStage(def) : null;
            const imgs = dbStage ? stageImages(dbStage.id) : [];
            openLb(imgs, Number(img.dataset.imgi));
          });
        });

        // Open report modal
        document.querySelectorAll('.cs-open-rep').forEach(btn => {
          btn.addEventListener('click', e => { e.stopPropagation(); openReportModal(btn.dataset.defkey); });
        });

        // Mark done
        document.querySelectorAll('.cs-mark-done').forEach(btn => {
          btn.addEventListener('click', e => { e.stopPropagation(); openCompleteDateModal(btn.dataset.defkey); });
        });

        // Undo complete
        document.querySelectorAll('.cs-undo-complete').forEach(btn => {
          btn.addEventListener('click', e => {
            e.stopPropagation();
            const def = STAGE_DEFS.find(d => d.key === btn.dataset.defkey);
            if (def) undoComplete(def);
          });
        });

        // Delete stage (last completed only)
        document.querySelectorAll('.cs-del-stage').forEach(btn => {
          btn.addEventListener('click', e => { e.stopPropagation(); deleteLastStage(btn.dataset.defkey); });
        });

        // Start stage (after delete or first-time unlock)
        document.querySelectorAll('.cs-start-stage').forEach(btn => {
          btn.addEventListener('click', e => { e.stopPropagation(); startStage(btn.dataset.defkey); });
        });
      }

      /* ══════════════════════════════
         REPORT + PHOTOS MODAL (UNIFIED)
      ══════════════════════════════ */
      function openReportModal(defKey) {
        const def = STAGE_DEFS.find(d => d.key === defKey); if (!def) return;
        const dbStage = getDbStage(def); if (!dbStage) return;
        const imgs = stageImages(dbStage.id);
        const fields = RFIELDS[def.key] || [];
        let answers = {};
        const _rdRaw = dbStage.reportData || dbStage.ReportData || '{}';
        try { answers = JSON.parse(_rdRaw); } catch {}
        if (!answers.notes && (dbStage.notes || dbStage.Notes)) answers.notes = dbStage.notes || dbStage.Notes;

        /* حقول التقرير */
        let fh = '';
        fields.forEach(f => {
          const val = answers[f.id];
          if (f.type === 'toggle') {
            const y = val===true||val==='true'||val===1;
            fh += `<div class="cs-field">
              <span class="cs-lbl">${esc(f.label)}</span>
              <div class="cs-yn-row">
                <button type="button" class="cs-yn-btn ${y?'yes':''}" data-qid="${f.id}" data-val="true">نعم</button>
                <button type="button" class="cs-yn-btn ${!y?'no':''}" data-qid="${f.id}" data-val="false">لا</button>
              </div>
            </div>`;
          } else if (f.type === 'textarea') {
            fh += `<div class="cs-field"><span class="cs-lbl">${esc(f.label)}</span><textarea class="cs-ta" id="cs-rf-${f.id}" rows="2">${esc(String(val||''))}</textarea></div>`;
          } else {
            fh += `<div class="cs-field"><span class="cs-lbl">${esc(f.label)}</span><input type="${f.type}" class="cs-input" id="cs-rf-${f.id}" value="${esc(String(val||''))}" ${f.type==='date'?'dir="ltr"':''}></div>`;
          }
        });

        /* الصور */
        const photosHtml = `
          <div style="margin-top:4px">
            <div class="cs-sec-title"><i class="ri-image-line"></i> الصور (${imgs.length})</div>
            <div class="cs-modal-photos" id="cs-modal-photos">
              ${imgs.map((img,i) => {
                const s = imgSrc(img);
                return `<div class="cs-mphoto-wrap">
                  <img class="cs-mphoto-thumb" src="${esc(s)}" alt="صورة ${i+1}" loading="lazy" data-imgi="${i}" onerror="this.style.opacity='.3'"/>
                  <button type="button" class="cs-mphoto-del" data-imgid="${img.id||''}" data-imgi="${i}"><i class="ri-close-line"></i></button>
                </div>`;
              }).join('')}
              <div class="cs-add-photo-btn" id="cs-add-photo-btn">
                <i class="ri-image-add-line"></i><span>رفع صورة</span>
              </div>
              <input type="file" id="cs-photo-file" accept="image/*" multiple style="display:none"/>
            </div>
            <div id="cs-up-status" style="font-size:.7rem;color:var(--muted);margin-top:4px;display:none"></div>
          </div>`;

        openModal(`${def.emoji} ${def.label}`, def.desc, `
          <div id="cs-rep-form">
            ${fh}
            ${photosHtml}
          </div>
          <div class="cs-mfoot">
            <button class="cs-btn cs-btn-s" id="cs-rep-save"><i class="ri-save-3-line"></i> حفظ التقرير</button>
            <button class="cs-btn cs-btn-g" id="cs-rep-close" style="margin-right:auto"><i class="ri-close-line"></i> إغلاق</button>
          </div>`);

        // Y/N buttons
        document.querySelectorAll('#cs-rep-form .cs-yn-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const qid = btn.dataset.qid;
            document.querySelectorAll(`#cs-rep-form .cs-yn-btn[data-qid="${qid}"]`).forEach(b => b.classList.remove('yes','no'));
            btn.classList.add(btn.dataset.val==='true' ? 'yes' : 'no');
          });
        });

        // Lightbox
        document.querySelectorAll('#cs-modal-photos .cs-mphoto-thumb').forEach(img => {
          img.addEventListener('click', () => openLb(imgs, Number(img.dataset.imgi)));
        });

        // Delete photo
        document.querySelectorAll('#cs-modal-photos .cs-mphoto-del').forEach(btn => {
          btn.addEventListener('click', () => deletePhoto(btn.dataset.imgid, dbStage.id, Number(btn.dataset.imgi), defKey));
        });

        // Upload
        const addBtn = document.getElementById('cs-add-photo-btn');
        const fileInp = document.getElementById('cs-photo-file');
        addBtn?.addEventListener('click', () => { fileInp.value=''; fileInp.onchange=()=>handleUpload(dbStage.id, defKey, fileInp.files); fileInp.click(); });

        // Save
        document.getElementById('cs-rep-save').addEventListener('click', () => saveReport(def, dbStage));
        document.getElementById('cs-rep-close').addEventListener('click', closeModal);
      }

      /* ══════════════════════════════
         SAVE REPORT
      ══════════════════════════════ */
      async function saveReport(def, dbStage) {
        const answers = collectReportAnswers(def);
        const notes = answers.notes || '';
        const btn = document.getElementById('cs-rep-save');
        if (btn) { btn.disabled=true; btn.innerHTML=`${spinHtml()} جاري الحفظ...`; }
        try {
          await PUT(`/api/ConstructionStages/${dbStage.id}`, {
            projectId: Number(S.currentProject?.id),
            stageName: dbStage.stageName || dbStage.StageName || def.label,
            status: (dbStage.isCompleted||dbStage.IsCompleted)?'Completed':((dbStage.status||dbStage.Status||'InProgress')),
            isCompleted: !!(dbStage.isCompleted || dbStage.IsCompleted),
            notes, reportData: JSON.stringify(answers),
            startDate: dbStage.startDate || dbStage.StartDate || new Date().toISOString(),
            endDate: dbStage.endDate || dbStage.EndDate || null,
          });
          window.__showToast?.(`✓ تم حفظ تقرير «${def.label}»`, 'success');
          closeModal();
          await loadStages(S.currentProject.id);
          renderStagesView();
        } catch(e) {
          window.__showToast?.(e.message, 'error');
          if (btn) { btn.disabled=false; btn.innerHTML='<i class="ri-save-3-line"></i> حفظ التقرير'; }
        }
      }

      /* ══════════════════════════════
         COMPLETE DATE MODAL
      ══════════════════════════════ */
      function openCompleteDateModal(defKey) {
        const def = STAGE_DEFS.find(d => d.key === defKey); if (!def) return;
        const today = new Date().toISOString().split('T')[0];
        openModal('✅ إكمال المرحلة', esc(def.label), `
          <div style="padding:4px 0 8px">
            <div class="cs-field">
              <span class="cs-lbl">📅 تاريخ إنهاء المرحلة</span>
              <input type="date" class="cs-input" id="cs-comp-date" value="${today}" max="${today}" dir="ltr"/>
            </div>
            <div class="cs-mfoot" style="margin:16px -20px -18px;border-radius:0 0 18px 18px">
              <button class="cs-btn cs-btn-s" id="cs-comp-ok"><i class="ri-checkbox-circle-line"></i> تأكيد الاكتمال</button>
              <button class="cs-btn cs-btn-g" id="cs-comp-cancel"><i class="ri-close-line"></i> إلغاء</button>
            </div>
          </div>`);
        document.getElementById('cs-comp-cancel').addEventListener('click', closeModal);
        document.getElementById('cs-comp-ok').addEventListener('click', async () => {
          const dateVal = document.getElementById('cs-comp-date')?.value;
          closeModal();
          await doToggleComplete(def, true, dateVal?new Date(dateVal+'T23:59:59').toISOString():new Date().toISOString());
        });
      }

      /* ══════════════════════════════
         TOGGLE COMPLETE
      ══════════════════════════════ */
      async function doToggleComplete(def, newDone, endDate) {
        const dbStage = getDbStage(def); if (!dbStage) return;
        try {
          await PUT(`/api/ConstructionStages/${dbStage.id}`, {
            projectId: Number(S.currentProject?.id),
            stageName: dbStage.stageName || dbStage.StageName || def.label,
            status: newDone?'Completed':'InProgress',
            isCompleted: newDone,
            notes: dbStage.notes || dbStage.Notes || '',
            reportData: dbStage.reportData || dbStage.ReportData || '{}',
            startDate: dbStage.startDate || dbStage.StartDate || null,
            endDate: newDone?endDate:null,
          });
          window.__showToast?.(newDone?`✓ «${def.label}» مكتملة`:`تم إلغاء اكتمال «${def.label}»`, newDone?'success':'info');
          await loadStages(S.currentProject.id);
          renderStagesView();
        } catch(e) { window.__showToast?.(e.message,'error'); }
      }

      async function undoComplete(def) {
        // التحقق: هل دي آخر مكتملة؟
        const lcd = lastCompletedDef();
        if (lcd?.key !== def.key) { window.__showToast?.('لا يمكن إلغاء اكتمال هذه المرحلة — هناك مراحل مكتملة بعدها', 'warning'); return; }
        await doToggleComplete(def, false, null);
      }

      /* ══════════════════════════════
         START STAGE (بدء / إعادة بدء)
      ══════════════════════════════ */
      async function startStage(defKey) {
        const def = STAGE_DEFS.find(d => d.key === defKey); if (!def) return;
        // حماية: لا يُبدأ إلا لو المرحلة قبلها مكتملة (أو هي الأولى)
        const idx = STAGE_DEFS.indexOf(def);
        if (idx > 0 && !isDone(STAGE_DEFS[idx-1])) {
          window.__showToast?.('أكمل المرحلة السابقة أولاً', 'warning'); return;
        }
        // لو موجودة فعلاً ما نعيد إنشاءها
        if (getDbStage(def)) { window.__showToast?.('المرحلة موجودة بالفعل', 'info'); return; }
        try {
          const ns = await POST('/api/ConstructionStages', {
            projectId: Number(S.currentProject.id),
            stageName: def.label,
            status: 'InProgress',
            isCompleted: false,
            notes: '',
            reportData: '{}',
            startDate: new Date().toISOString(),
            endDate: null
          });
          if (ns?.id) {
            window.__showToast?.(`تم بدء «${def.label}» ✓`, 'success');
            await loadStages(S.currentProject.id);
            renderStagesView();
          } else {
            window.__showToast?.('لم يتم إنشاء المرحلة — تحقق من الاتصال', 'error');
          }
        } catch(e) {
          window.__showToast?.(e.message || 'خطأ في إنشاء المرحلة', 'error');
        }
      }

      /* ══════════════════════════════
         DELETE LAST COMPLETED STAGE
      ══════════════════════════════ */
      async function deleteLastStage(defKey) {
        const def = STAGE_DEFS.find(d => d.key === defKey); if (!def) return;
        const lcd = lastCompletedDef();
        if (lcd?.key !== def.key) { window.__showToast?.('يمكن حذف المرحلة الأخيرة المكتملة فقط', 'warning'); return; }
        const dbStage = getDbStage(def); if (!dbStage) return;

        openModal('🗑️ حذف المرحلة', `<span style="color:var(--danger)">${esc(def.label)}</span>`, `
          <div style="padding:8px 0">
            <div style="background:var(--danger-dim);border:1px solid var(--danger-bd);border-radius:10px;padding:14px;margin-bottom:16px;display:flex;align-items:flex-start;gap:10px">
              <i class="ri-error-warning-line" style="color:var(--danger);font-size:1.2rem;flex-shrink:0;margin-top:1px"></i>
              <div>
                <div style="font-size:.85rem;font-weight:700;color:var(--text);margin-bottom:4px">هل أنت متأكد؟</div>
                <div style="font-size:.78rem;color:var(--text2);line-height:1.7">سيتم حذف مرحلة <strong style="color:var(--danger)">${esc(def.label)}</strong> بشكل نهائي مع جميع بياناتها وصورها. لا يمكن التراجع عن هذا الإجراء.</div>
              </div>
            </div>
            <div class="cs-mfoot" style="margin:0 -20px -18px;border-radius:0 0 18px 18px">
              <button class="cs-btn cs-btn-d" id="cs-del-ok"><i class="ri-delete-bin-line"></i> حذف نهائي</button>
              <button class="cs-btn cs-btn-g" id="cs-del-cancel" style="margin-right:auto"><i class="ri-close-line"></i> إلغاء</button>
            </div>
          </div>`);

        document.getElementById('cs-del-cancel').addEventListener('click', closeModal);
        document.getElementById('cs-del-ok').addEventListener('click', async () => {
          const btn = document.getElementById('cs-del-ok');
          if (btn) { btn.disabled=true; btn.innerHTML=`${spinHtml()} جاري الحذف...`; }
          try {
            await DEL(`/api/ConstructionStages/${dbStage.id}`);
            window.__showToast?.(`تم حذف «${def.label}»`, 'info');
            closeModal();
            await loadStages(S.currentProject.id);
            renderStagesView();
          } catch(e) {
            window.__showToast?.(e.message, 'error');
            if (btn) { btn.disabled=false; btn.innerHTML='<i class="ri-delete-bin-line"></i> حذف نهائي'; }
          }
        });
      }

      /* ══════════════════════════════
         COLLECT REPORT ANSWERS (helper مشترك)
      ══════════════════════════════ */
      function collectReportAnswers(def) {
        const fields = RFIELDS[def.key] || [];
        const answers = {};
        fields.forEach(f => {
          if (f.type === 'toggle') {
            const sel = document.querySelector(`#cs-rep-form .cs-yn-btn[data-qid="${f.id}"].yes`)
                     || document.querySelector(`#cs-rep-form .cs-yn-btn[data-qid="${f.id}"].no`);
            if (sel) answers[f.id] = sel.dataset.val === 'true';
          } else {
            const el = document.getElementById(`cs-rf-${f.id}`);
            if (el) { if (f.type==='number') answers[f.id]=parseFloat(el.value)||0; else answers[f.id]=el.value.trim(); }
          }
        });
        return answers;
      }

      /* ══════════════════════════════
         PHOTO UPLOAD
      ══════════════════════════════ */
      async function handleUpload(stageId, defKey, files) {
        if (!files||!files.length) return;

        // حفظ بيانات التقرير الحالية قبل رفع الصور لعدم ضياعها
        const def = STAGE_DEFS.find(d => d.key === defKey);
        const dbStageSnap = def ? getDbStage(def) : null;
        if (def && dbStageSnap) {
          const answers = collectReportAnswers(def);
          const notes = answers.notes || '';
          try {
            await PUT(`/api/ConstructionStages/${dbStageSnap.id}`, {
              projectId: Number(S.currentProject?.id),
              stageName: dbStageSnap.stageName || dbStageSnap.StageName || def.label,
              status: (dbStageSnap.isCompleted||dbStageSnap.IsCompleted)?'Completed':((dbStageSnap.status||dbStageSnap.Status||'InProgress')),
              isCompleted: !!(dbStageSnap.isCompleted || dbStageSnap.IsCompleted),
              notes, reportData: JSON.stringify(answers),
              startDate: dbStageSnap.startDate || dbStageSnap.StartDate || new Date().toISOString(),
              endDate: dbStageSnap.endDate || dbStageSnap.EndDate || null,
            });
          } catch {}
        }

        const status = document.getElementById('cs-up-status');
        if (status) { status.style.display='block'; status.textContent='جاري رفع الصور...'; }
        let done=0, failed=0;
        for (const file of Array.from(files)) {
          try { await uploadFile('/api/StageImages/upload', file, {stageId:String(stageId),caption:''}); done++; }
          catch { failed++; }
          if (status) status.textContent=`رفع ${done+failed} من ${files.length}...`;
        }
        window.__showToast?.(failed===0?`✓ تم رفع ${done} صورة`:`تم رفع ${done} وفشل ${failed}`, failed===0?'success':'warning');
        await loadStages(S.currentProject.id);
        openReportModal(defKey); // أعد فتح المودال بالصور الجديدة
      }

      /* ══════════════════════════════
         DELETE PHOTO
      ══════════════════════════════ */
      async function deletePhoto(imgId, stageId, imgIdx, defKey) {
        if (!confirm('هل تريد حذف هذه الصورة؟')) return;
        if (imgId) { try { await DEL(`/api/StageImages/${imgId}`); } catch {} }
        window.__showToast?.('تم حذف الصورة', 'info');
        await loadStages(S.currentProject.id);
        openReportModal(defKey); // أعد فتح المودال
      }

      /* ── Boot ── */
      await loadData();
    }
  };
})();