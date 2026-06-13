/* PAGE MODULE: sellrequests — BookingManager Panel
   طلبات البيع
   ══════════════════════════════════════════════════ */
(function () {
  'use strict';
  window.__pages = window.__pages || {};

  const _css = `
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    @keyframes sr-fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes sr-spin{to{transform:rotate(360deg)}}
    @keyframes sr-pulse{0%,100%{opacity:1}50%{opacity:.4}}

    .sr-page{padding:0 0 80px;animation:sr-fadeUp .3s ease both}

    /* header */
    .sr-header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:24px;flex-wrap:wrap}
    .sr-title{font-size:1.35rem;font-weight:800;color:var(--light);display:flex;align-items:center;gap:9px}
    .sr-title i{color:var(--accent);font-size:1.4rem}
    .sr-badge{display:inline-flex;align-items:center;gap:5px;padding:3px 10px;border-radius:20px;font-size:.75rem;font-weight:700;background:rgba(255,59,48,.12);color:#ff3b30;border:1px solid rgba(255,59,48,.28);margin-right:4px}
    .sr-badge.zero{background:rgba(52,199,89,.1);color:#34c759;border-color:rgba(52,199,89,.25)}

    /* filters */
    .sr-filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px}
    .sr-filter-btn{padding:7px 16px;border-radius:9px;border:1px solid rgba(var(--fg-rgb), .1);background:rgba(var(--fg-rgb), .04);color:var(--text-muted);font-family:'Tajawal',sans-serif;font-size:.82rem;font-weight:600;cursor:pointer;transition:all .2s}
    .sr-filter-btn:hover{background:rgba(var(--fg-rgb), .08);color:var(--light)}
    .sr-filter-btn.active{background:rgba(var(--accent-rgb),.15);color:var(--accent);border-color:rgba(var(--accent-rgb),.35)}
    .sr-sel-filter{padding:6px 12px;border-radius:9px;border:1px solid rgba(var(--fg-rgb), .1);background:rgba(var(--fg-rgb), .04);color:var(--text-muted);font-family:'Tajawal',sans-serif;font-size:.82rem;font-weight:600;cursor:pointer;transition:all .2s;outline:none;direction:rtl}
    .sr-sel-filter:hover{background:rgba(var(--fg-rgb), .08);color:var(--light)}
    .sr-sel-filter:focus{border-color:rgba(var(--accent-rgb),.35);color:var(--accent)}
    .sr-sel-filter option{background:var(--primary);color:var(--light)}

    /* table wrapper */
    .sr-table-wrap{overflow-x:auto;border-radius:16px;border:1px solid rgba(var(--fg-rgb), .07);background:var(--card-bg)}
    table.sr-table{width:100%;border-collapse:collapse;min-width:700px}
    .sr-table th{padding:13px 16px;text-align:right;font-size:.76rem;font-weight:700;color:var(--text-muted);border-bottom:1px solid rgba(var(--fg-rgb), .07);white-space:nowrap;background:var(--primary)}
    .sr-table td{padding:13px 16px;font-size:.83rem;color:var(--light);border-bottom:1px solid rgba(var(--fg-rgb), .05);vertical-align:middle}
    .sr-table tr:last-child td{border-bottom:none}
    .sr-table tr.unread td{background:rgba(var(--accent-rgb),.04)}
    .sr-table tr:hover td{background:rgba(var(--fg-rgb), .03)}

    /* unread dot */
    .sr-unread-dot{width:8px;height:8px;border-radius:50%;background:var(--accent);display:inline-block;margin-left:6px;animation:sr-pulse 2s infinite;flex-shrink:0}

    /* buyer name cell */
    .sr-buyer-cell{display:flex;align-items:center;gap:8px}
    .sr-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#f5c842,#e6a800);display:flex;align-items:center;justify-content:center;font-size:.82rem;font-weight:800;color:var(--primary-deep);flex-shrink:0}

    /* price */
    .sr-price{font-weight:700;color:#34c759;white-space:nowrap}

    /* stage badge */
    .sr-stage{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:.73rem;font-weight:700;background:rgba(var(--accent-rgb),.1);color:var(--accent);border:1px solid rgba(var(--accent-rgb),.18)}

    /* date */
    .sr-date{color:var(--text-muted);font-size:.78rem;white-space:nowrap}

    /* actions */
    .sr-mark-btn{padding:5px 12px;border-radius:7px;border:1px solid rgba(52,199,89,.3);background:rgba(52,199,89,.08);color:#34c759;font-family:'Tajawal',sans-serif;font-size:.76rem;font-weight:700;cursor:pointer;transition:all .2s;white-space:nowrap}
    .sr-mark-btn:hover{background:rgba(52,199,89,.2)}
    .sr-mark-btn:disabled{opacity:.4;cursor:not-allowed}
    .sr-read-label{color:var(--text-muted);font-size:.76rem;display:flex;align-items:center;gap:4px}
    .sr-read-label i{color:#34c759}

    /* empty / loading */
    .sr-empty{text-align:center;padding:60px 20px;color:var(--text-muted)}
    .sr-empty i{font-size:2.5rem;display:block;margin-bottom:12px;opacity:.3}
    .sr-spinner{width:36px;height:36px;border:3px solid rgba(var(--fg-rgb), .07);border-top-color:var(--accent);border-radius:50%;animation:sr-spin .75s linear infinite;margin:60px auto}

    /* ── MODAL ── */
    #sr-modal{display:none;position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:1000;align-items:center;justify-content:center;backdrop-filter:blur(5px)}
    #sr-modal.open{display:flex}
    .sr-modal-box{background:var(--card-bg);border:1px solid rgba(var(--fg-rgb), .1);border-radius:20px;max-width:580px;width:94%;max-height:88vh;overflow-y:auto;box-shadow:0 30px 60px rgba(0,0,0,.5);animation:sr-slideDown .22s ease}
    @keyframes sr-slideDown{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:translateY(0)}}
    .sr-modal-head{padding:20px 24px 14px;border-bottom:1px solid rgba(var(--fg-rgb), .08);display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;background:var(--card-bg);z-index:2;border-radius:20px 20px 0 0}
    .sr-modal-title{font-size:1.05rem;font-weight:800;color:var(--light)}
    .sr-modal-close{background:none;border:none;color:var(--text-muted);font-size:1.3rem;cursor:pointer;transition:all .2s;line-height:1}
    .sr-modal-close:hover{color:var(--light);transform:rotate(90deg)}
    .sr-modal-body{padding:20px 24px 24px}
    .sr-dg{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px}
    .sr-db{background:rgba(var(--fg-rgb), .04);border:1px solid rgba(var(--fg-rgb), .08);border-radius:10px;padding:11px 14px}
    .sr-db.full{grid-column:1/-1}
    .sr-dl{font-size:.69rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.4px;margin-bottom:4px;font-weight:700}
    .sr-dv{font-size:.9rem;font-weight:700;color:var(--light)}
    .sr-modal-sep{font-size:.68rem;font-weight:800;color:rgba(143,163,192,.6);text-transform:uppercase;letter-spacing:.6px;margin:14px 0 10px;display:flex;align-items:center;gap:7px}
    .sr-modal-sep span{flex:1;height:1px;background:rgba(var(--fg-rgb), .07)}
    .sr-buyer-card{display:flex;align-items:center;gap:12px;padding:12px 14px;background:rgba(var(--accent-rgb),.07);border:1px solid rgba(var(--accent-rgb),.18);border-radius:12px;margin-bottom:14px}
    .sr-buyer-av{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#f5c842,#e6a800);display:flex;align-items:center;justify-content:center;font-size:1.1rem;font-weight:800;color:var(--primary-deep);flex-shrink:0}
    .sr-buyer-nm{font-size:.95rem;font-weight:800;color:var(--light)}
    .sr-buyer-ph{font-size:.78rem;color:var(--text-muted);margin-top:2px;direction:ltr;display:inline-block}

    /* ── NOTIFICATION BANNER ── */
    @keyframes sr-glow-pulse{0%,100%{box-shadow:0 0 0 0 rgba(52,199,89,.7),0 0 0 0 rgba(52,199,89,.3);border-color:rgba(52,199,89,.8)}50%{box-shadow:0 0 0 8px rgba(52,199,89,.2),0 0 22px 4px rgba(52,199,89,.25);border-color:rgba(52,199,89,1)}}
    @keyframes sr-banner-in{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:translateY(0)}}
    #sr-new-banner{display:none;position:sticky;top:8px;z-index:90;align-items:center;gap:10px;padding:11px 18px;margin-bottom:16px;background:rgba(52,199,89,.1);border:1.5px solid rgba(52,199,89,.5);border-radius:12px;cursor:pointer;animation:sr-glow-pulse 1.6s ease-in-out infinite,sr-banner-in .3s ease}
    #sr-new-banner.show{display:flex}
    #sr-new-banner i{color:#34c759;font-size:1.1rem}
    #sr-new-banner span{color:#34c759;font-size:.88rem;font-weight:700;flex:1}
    #sr-new-banner button{background:none;border:none;color:#34c759;font-size:1rem;cursor:pointer;opacity:.7;transition:opacity .18s}
    #sr-new-banner button:hover{opacity:1}
    .sr-table-wrap.sr-table-glow{animation:sr-tglow 1.8s ease forwards}
    @keyframes sr-tglow{0%{box-shadow:0 0 0 0 rgba(52,199,89,0)}30%{box-shadow:0 0 0 4px rgba(52,199,89,.5),0 0 20px 4px rgba(52,199,89,.18)}100%{box-shadow:0 0 0 0 rgba(52,199,89,0)}}

    @media(max-width:600px){
      .sr-title{font-size:1.1rem}
      .sr-table th,.sr-table td{padding:10px 12px}
    }
  `;

  window.__pages['sellrequests'] = {
    getCSS: function() { return _css; },
    init: async function() {
      const container = document.getElementById('app-main');
      const API_BASE  = window.location.origin;
      const getToken  = () => {
        let t = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!t) { try { const d = JSON.parse(localStorage.getItem('authData')||'{}'); t = d.token||d.authToken; } catch {} }
        return t || '';
      };

      container.innerHTML = `
        <!-- Detail Modal -->
        <div id="sr-modal">
          <div class="sr-modal-box">
            <div class="sr-modal-head">
              <div class="sr-modal-title" id="sr-modal-title">تفاصيل طلب البيع</div>
              <button class="sr-modal-close" id="sr-modal-close"><i class="ri-close-line"></i></button>
            </div>
            <div class="sr-modal-body" id="sr-modal-body"></div>
          </div>
        </div>

        <div class="sr-page">
          <!-- New Order Notification Banner -->
          <div id="sr-new-banner" id="sr-new-banner">
            <i class="ri-notification-3-fill"></i>
            <span id="sr-new-msg">وصل طلب بيع جديد! اضغط للتحديث</span>
            <button id="sr-banner-close" title="إغلاق"><i class="ri-close-line"></i></button>
          </div>

          <div class="sr-header">
            <div class="sr-title"><i class="ri-hand-coin-line"></i> طلبات البيع <span id="sr-unread-badge" class="sr-badge" style="display:none"></span></div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
              <button class="sr-filter-btn active" data-filter="all">الكل</button>
              <button class="sr-filter-btn" data-filter="unread">غير مقروءة</button>
              <button class="sr-filter-btn" data-filter="read">مقروءة</button>
              <select id="sr-sel-project" class="sr-sel-filter" title="تصفية بالمشروع"><option value="">كل المشاريع</option></select>
              <select id="sr-sel-building" class="sr-sel-filter" title="تصفية بالمبنى"><option value="">كل المباني</option></select>
              <select id="sr-sel-floor" class="sr-sel-filter" title="تصفية بالدور"><option value="">كل الأدوار</option></select>
            </div>
          </div>
          <div class="sr-table-wrap" id="sr-table-wrap">
            <table class="sr-table">
              <thead>
                <tr>
                  <th>المشتري</th>
                  <th>الوحدة</th>
                  <th>المشروع</th>
                  <th>سعر الشراء</th>
                  <th>السعر المتوقع للبيع</th>
                  <th>تاريخ الحجز</th>
                  <th>المرحلة</th>
                  <th>تاريخ الطلب</th>
                  <th>الإجراء</th>
                </tr>
              </thead>
              <tbody id="sr-tbody"><tr><td colspan="9"><div class="sr-spinner"></div></td></tr></tbody>
            </table>
          </div>
        </div>`;

      let _allRows = [];
      let _filter  = 'all';
      let _filterProject  = '';
      let _filterBuilding = '';
      let _filterFloor    = '';

      function fmtDate(d) {
        if (!d) return '—';
        try {
          const ksa = new Date(new Date(d).getTime() + 3*60*60*1000);
          const day = String(ksa.getUTCDate()).padStart(2,'0');
          const mon = String(ksa.getUTCMonth()+1).padStart(2,'0');
          return `${day}/${mon}/${ksa.getUTCFullYear()}`;
        } catch { return '—'; }
      }
      function fmtPrice(n) {
        if (!n && n !== 0) return '—';
        return window.fmtMoney(n);
      }
      function esc(s) { return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
      function initials(name) { const w = (name||'').trim().split(/\s+/); return w.length >= 2 ? w[0][0]+w[1][0] : (w[0]||'?')[0]; }

      function updateBadge() {
        const unread = _allRows.filter(r => !r.isRead).length;

        // داخل الصفحة
        const badge = document.getElementById('sr-unread-badge');
        if (badge) {
          if (unread > 0) {
            badge.textContent = unread + ' غير مقروءة';
            badge.style.display = 'inline-flex';
            badge.className = 'sr-badge';
          } else {
            badge.style.display = 'none';
          }
        }

        // الـ nav badge في الـ header والـ drawer — يتحدث فوراً بدون انتظار الـ poll
        document.querySelectorAll('.nav-sr-badge').forEach(el => {
          el.textContent = unread > 99 ? '99+' : String(unread);
          el.classList.toggle('hidden', unread === 0);
        });
      }

      function populateSelects() {
        const selP = document.getElementById('sr-sel-project');
        const selB = document.getElementById('sr-sel-building');
        const selF = document.getElementById('sr-sel-floor');
        if (!selP || !selB || !selF) return;

        const projects  = [...new Set(_allRows.map(r => r.projectName).filter(Boolean))].sort();
        const buildings = [...new Set(_allRows.map(r => r.buildingName).filter(Boolean))].sort();
        const floors    = [...new Set(_allRows.map(r => r.floorNumber).filter(f => f != null))].sort((a,b)=>a-b);

        const keepP = selP.value, keepB = selB.value, keepF = selF.value;
        selP.innerHTML = `<option value="">كل المشاريع</option>` + projects.map(p=>`<option value="${esc(p)}">${esc(p)}</option>`).join('');
        selB.innerHTML = `<option value="">كل المباني</option>`  + buildings.map(b=>`<option value="${esc(b)}">${esc(b)}</option>`).join('');
        selF.innerHTML = `<option value="">كل الأدوار</option>`  + floors.map(f=>`<option value="${f}">الدور ${f}</option>`).join('');
        selP.value = keepP; selB.value = keepB; selF.value = keepF;
      }

      function renderRows() {
        const tbody = document.getElementById('sr-tbody');
        if (!tbody) return;
        let rows = _filter === 'all' ? _allRows
                 : _filter === 'unread' ? _allRows.filter(r => !r.isRead)
                 : _allRows.filter(r => r.isRead);
        if (_filterProject)  rows = rows.filter(r => r.projectName  === _filterProject);
        if (_filterBuilding) rows = rows.filter(r => r.buildingName === _filterBuilding);
        if (_filterFloor)    rows = rows.filter(r => String(r.floorNumber) === _filterFloor);

        if (!rows.length) {
          tbody.innerHTML = `<tr><td colspan="9">
            <div class="sr-empty">
              <i class="ri-hand-coin-line"></i>
              <p>${_filter === 'unread' ? 'لا توجد طلبات غير مقروءة' : 'لا توجد طلبات بيع حتى الآن'}</p>
            </div></td></tr>`;
          return;
        }

        tbody.innerHTML = rows.map(r => `
          <tr class="${r.isRead?'':'unread'}" id="sr-row-${r.id}" style="cursor:pointer" onclick="window._srOpenDetail(${r.id})">
            <td>
              <div class="sr-buyer-cell">
                ${!r.isRead ? '<span class="sr-unread-dot"></span>' : ''}
                <div class="sr-avatar">${esc(initials(r.buyerName))}</div>
                <div>
                  <div style="font-weight:700">${esc(r.buyerName||'—')}</div>
                  <div style="font-size:.74rem;color:var(--text-muted);margin-top:2px">${esc(r.buyerPhone||'')}</div>
                </div>
              </div>
            </td>
            <td>
              <div style="font-weight:700;color:var(--accent)">وحدة ${esc(r.unitNumber||'—')}</div>
            </td>
            <td><span style="font-size:.85rem;color:var(--light)">${esc(r.projectName||'—')}</span></td>
            <td><span class="sr-price">${fmtPrice(r.unitPrice)}</span></td>
            <td>${r.expectedPrice ? `<span class="sr-price" style="color:#f5c842;border:1px solid rgba(245,200,66,.25);background:rgba(245,200,66,.08);padding:2px 8px;border-radius:8px;font-size:.8rem">${fmtPrice(r.expectedPrice)}</span>` : '<span style="color:var(--text-muted);font-size:.78rem">—</span>'}</td>
            <td><span class="sr-date">${fmtDate(r.bookingDate)}</span></td>
            <td><span class="sr-stage">${esc(r.stageLabel||r.stageKey||'—')}</span></td>
            <td><span class="sr-date">${fmtDate(r.createdAt)}</span></td>
            <td onclick="event.stopPropagation()">
              ${r.isRead
                ? `<span class="sr-read-label"><i class="ri-check-double-line"></i> تمت القراءة</span>`
                : `<button class="sr-mark-btn" data-id="${r.id}"><i class="ri-eye-line"></i> تحديد كمقروء</button>`
              }
            </td>
          </tr>`).join('');

        /* bind mark-as-read buttons */
        tbody.querySelectorAll('.sr-mark-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const id = parseInt(btn.dataset.id);
            btn.disabled = true;
            btn.innerHTML = '<i class="ri-loader-4-line" style="animation:sr-spin .75s linear infinite"></i>';
            try {
              const res = await fetch(`${API_BASE}/api/SellRequests/${id}/read`, {
                method: 'PATCH',
                headers: { 'Authorization': 'Bearer ' + getToken() }
              });
              if (res.ok) {
                const row = _allRows.find(r => r.id === id);
                if (row) row.isRead = true;
                updateBadge();
                renderRows();
              } else {
                btn.disabled = false;
                btn.innerHTML = '<i class="ri-eye-line"></i> تحديد كمقروء';
              }
            } catch(e) {
              btn.disabled = false;
              btn.innerHTML = '<i class="ri-eye-line"></i> تحديد كمقروء';
              console.error(e);
            }
          });
        });
      }

      /* ── Modal open/close ── */
      const modal     = document.getElementById('sr-modal');
      const modalBody = document.getElementById('sr-modal-body');
      const modalTitle= document.getElementById('sr-modal-title');
      document.getElementById('sr-modal-close').addEventListener('click', ()=>{ modal.classList.remove('open'); });
      modal.addEventListener('click', e=>{ if(e.target===modal) modal.classList.remove('open'); });
      document.addEventListener('keydown', e=>{ if(e.key==='Escape') modal.classList.remove('open'); });

      window._srOpenDetail = function(id) {
        const r = _allRows.find(x=>x.id===id);
        if(!r) return;
        if(modalTitle) modalTitle.textContent = `طلب بيع — وحدة ${r.unitNumber||'—'}`;
        if(modalBody) modalBody.innerHTML = `
          <div class="sr-buyer-card">
            <div class="sr-buyer-av">${esc(initials(r.buyerName))}</div>
            <div>
              <div class="sr-buyer-nm">${esc(r.buyerName||'—')}</div>
              ${r.buyerPhone?`<div class="sr-buyer-ph">${esc(r.buyerPhone)}</div>`:''}
              ${r.buyerEmail?`<div style="font-size:.74rem;color:var(--text-muted);margin-top:1px">${esc(r.buyerEmail)}</div>`:''}
            </div>
          </div>

          <div class="sr-modal-sep"><span></span><i class="ri-home-4-line"></i> بيانات الوحدة <span></span></div>
          <div class="sr-dg">
            <div class="sr-db">
              <div class="sr-dl">رقم الوحدة</div>
              <div class="sr-dv" style="color:var(--accent)">وحدة ${esc(r.unitNumber||'—')}</div>
            </div>
            <div class="sr-db">
              <div class="sr-dl">النوع</div>
              <div class="sr-dv">${esc(r.unitType||'—')}</div>
            </div>
            <div class="sr-db">
              <div class="sr-dl">المشروع</div>
              <div class="sr-dv">${esc(r.projectName||'—')}</div>
            </div>
            <div class="sr-db">
              <div class="sr-dl">المبنى</div>
              <div class="sr-dv">${esc(r.buildingName||'—')}</div>
            </div>
            <div class="sr-db">
              <div class="sr-dl">الدور</div>
              <div class="sr-dv">${esc(String(r.floorNumber||'—'))}</div>
            </div>
            <div class="sr-db">
              <div class="sr-dl">الواجهة</div>
              <div class="sr-dv">${(r.unitFacing && r.unitFacing !== '0' && r.unitFacing !== 0) ? esc(String(r.unitFacing)) : '—'}</div>
            </div>
            <div class="sr-db">
              <div class="sr-dl">المساحة</div>
              <div class="sr-dv">${r.unitArea ? esc(String(r.unitArea)) + ' م²' : '—'}</div>
            </div>
            <div class="sr-db">
              <div class="sr-dl">عدد الغرف</div>
              <div class="sr-dv">${(r.unitRooms != null && r.unitRooms !== 0) ? esc(String(r.unitRooms)) : '—'}</div>
            </div>
            <div class="sr-db">
              <div class="sr-dl">المرحلة</div>
              <div class="sr-dv" style="color:var(--accent)">${esc(r.stageLabel||r.stageKey||'—')}</div>
            </div>
            <div class="sr-db">
              <div class="sr-dl">الحالة</div>
              <div class="sr-dv">${r.isRead?'<span style="color:#34c759">✓ مقروء</span>':'<span style="color:#ff3b30">● غير مقروء</span>'}</div>
            </div>
          </div>

          <div class="sr-modal-sep"><span></span><i class="ri-money-dollar-circle-line"></i> التسعير <span></span></div>
          <div class="sr-dg">
            <div class="sr-db">
              <div class="sr-dl">سعر الشراء</div>
              <div class="sr-dv" style="color:#34c759">${fmtPrice(r.unitPrice)}</div>
            </div>
            <div class="sr-db">
              <div class="sr-dl">السعر المتوقع للبيع</div>
              <div class="sr-dv" style="color:#f5c842">${fmtPrice(r.expectedPrice)}</div>
            </div>
          </div>

          <div class="sr-modal-sep"><span></span><i class="ri-calendar-line"></i> التواريخ <span></span></div>
          <div class="sr-dg">
            <div class="sr-db">
              <div class="sr-dl">تاريخ الحجز</div>
              <div class="sr-dv">${fmtDate(r.bookingDate)}</div>
            </div>
            <div class="sr-db">
              <div class="sr-dl">تاريخ الطلب</div>
              <div class="sr-dv">${fmtDate(r.createdAt)}</div>
            </div>
          </div>

          <div class="sr-modal-sep"><span></span><i class="ri-sticky-note-line"></i> ملاحظات <span></span></div>
          <div class="sr-db full" style="background:rgba(255,204,0,.05);border-color:rgba(255,204,0,.18)">
            <div class="sr-dl">ملاحظات المشتري</div>
            ${r.notes
              ? `<div style="font-size:.88rem;color:var(--light);line-height:1.7;margin-top:4px">${esc(r.notes)}</div>`
              : `<div style="font-size:.85rem;color:var(--text-muted);margin-top:4px;font-style:italic">لا يوجد ملاحظات</div>`
            }
          </div>
        `;
        modal.classList.add('open');
      };

      /* ── Notification banner ── */
      const banner  = document.getElementById('sr-new-banner');
      const bannerMsg = document.getElementById('sr-new-msg');
      const tableWrap = document.getElementById('sr-table-wrap');
      document.getElementById('sr-banner-close')?.addEventListener('click', e=>{
        e.stopPropagation();
        banner?.classList.remove('show');
      });
      banner?.addEventListener('click', async ()=>{
        banner.classList.remove('show');
        await loadData();
      });

      let _lastIds = new Set();
      function _snapshotIds(){ _lastIds = new Set(_allRows.map(r=>r.id)); }

      async function _pollNew(){
        try{
          const res = await fetch(`${API_BASE}/api/SellRequests`,{headers:{'Authorization':'Bearer '+getToken()}});
          if(!res.ok) return;
          const raw  = await res.json();
          const data = Array.isArray(raw)?raw:(raw?.['$values']||raw?.data||raw?.items||raw?.value||[]);
          const newOnes = data.filter(r=>!_lastIds.has(r.id));
          if(newOnes.length>0){
            if(bannerMsg) bannerMsg.textContent = newOnes.length===1?'وصل طلب بيع جديد! اضغط للتحديث':`وصلت ${newOnes.length} طلبات بيع جديدة! اضغط للتحديث`;
            banner?.classList.add('show');
            if(tableWrap){ tableWrap.classList.remove('sr-table-glow'); void tableWrap.offsetWidth; tableWrap.classList.add('sr-table-glow'); }
          }
        }catch{}
      }

      let _pollTimer = null;
      function _startPoll(){
        if(_pollTimer) clearInterval(_pollTimer);
        _pollTimer = setInterval(_pollNew, 45000);
      }

      /* filter buttons */
      container.querySelectorAll('.sr-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('.sr-filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          _filter = btn.dataset.filter;
          renderRows();
        });
      });

      /* select filters */
      container.querySelector('#sr-sel-project')?.addEventListener('change', e => {
        _filterProject = e.target.value; renderRows();
      });
      container.querySelector('#sr-sel-building')?.addEventListener('change', e => {
        _filterBuilding = e.target.value; renderRows();
      });
      container.querySelector('#sr-sel-floor')?.addEventListener('change', e => {
        _filterFloor = e.target.value; renderRows();
      });

      /* load data */
      async function loadData() {
        try {
          const res = await fetch(`${API_BASE}/api/SellRequests`, {
            headers: { 'Authorization': 'Bearer ' + getToken() }
          });
          if (!res.ok) throw new Error(res.status);
          const raw  = await res.json();
          const data = Array.isArray(raw) ? raw : (raw?.['$values'] || raw?.data || raw?.items || raw?.value || []);
          _allRows = data;
          updateBadge();
          populateSelects();
          renderRows();
          _snapshotIds();
        } catch(e) {
          const tbody = document.getElementById('sr-tbody');
          if (tbody) tbody.innerHTML = `<tr><td colspan="9">
            <div class="sr-empty">
              <i class="ri-wifi-off-line"></i>
              <p>فشل تحميل طلبات البيع</p>
            </div></td></tr>`;
          console.error('[sellrequests]', e);
        }
      }

      await loadData();
      _startPoll();
    }
  };
})();
