/* ════════════════════════════════════════════════
   maintenancecategories.js — Admin / تصنيفات الصيانة
   ════════════════════════════════════════════════ */
(function () {
  'use strict';
  window.__pages = window.__pages || {};

  const SCOPES = [
    { v: 'None',       ar: '—',                cls: 'mc-sc-none' },
    { v: 'Elevator',   ar: 'المصعد',           cls: 'mc-sc-elv' },
    { v: 'Plumbing',   ar: 'السباكة',          cls: 'mc-sc-plb' },
    { v: 'Electrical', ar: 'الكهرباء',         cls: 'mc-sc-elc' },
    { v: 'Structural', ar: 'الهيكل الإنشائي', cls: 'mc-sc-str' }
  ];

  const CSS = `
    .mc-wrap { padding: 12px 0 60px; animation: mc-fade .3s ease; }
    @keyframes mc-fade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
    @keyframes spin { to { transform:rotate(360deg) } }

    .mc-head { display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap; margin-bottom:18px; }
    .mc-title { font-size:1.45rem; font-weight:800; color:var(--light); display:flex; align-items:center; gap:10px; }
    .mc-title i { color:var(--accent); }
    .mc-sub { color:var(--text-muted); font-size:.85rem; margin-top:4px; }

    .mc-btn { display:inline-flex; align-items:center; gap:8px; padding:10px 18px; border-radius:11px; font-family:inherit; font-size:.86rem; font-weight:700; cursor:pointer; border:none; transition:all .2s; white-space:nowrap; }
    .mc-btn-primary { background:linear-gradient(135deg,var(--accent),var(--accent-dark)); color:#fff; box-shadow:0 4px 14px rgba(var(--accent-rgb),.3); }
    .mc-btn-primary:hover { transform:translateY(-1px); box-shadow:0 6px 18px rgba(var(--accent-rgb),.45); }
    .mc-btn-ghost { background:rgba(var(--fg-rgb), .05); color:var(--light); border:1.5px solid rgba(var(--fg-rgb), .1); }
    .mc-btn-ghost:hover { background:rgba(var(--fg-rgb), .1); }
    .mc-btn-danger { background:rgba(255,59,48,.12); color:#ff3b30; border:1.5px solid rgba(255,59,48,.3); }
    .mc-btn-danger:hover { background:rgba(255,59,48,.2); }

    .mc-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(330px,1fr)); gap:16px; }
    .mc-card { background:linear-gradient(160deg,var(--card-bg),var(--primary)); border:1px solid rgba(var(--fg-rgb), .08); border-radius:16px; padding:16px; transition:all .25s; position:relative; display:flex; flex-direction:column; }
    .mc-card:hover { transform:translateY(-3px); border-color:rgba(var(--accent-rgb),.3); box-shadow:0 12px 32px rgba(0,0,0,.3); }
    .mc-card.inactive { opacity:.6; }
    .mc-card-top { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:12px; }
    .mc-card-id { display:flex; align-items:center; gap:11px; min-width:0; }
    .mc-card-icon { width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.2rem; flex-shrink:0; }
    .mc-card-name { font-size:1rem; font-weight:800; color:var(--light); line-height:1.3; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .mc-card-desc { font-size:.82rem; color:var(--text-muted); line-height:1.55; margin-bottom:12px; }

    .mc-scope-badge { display:inline-flex; align-items:center; gap:5px; padding:2px 9px; border-radius:12px; font-size:.68rem; font-weight:800; margin-top:5px; }
    .mc-sc-none { background:rgba(var(--fg-rgb), .06); color:var(--text-muted); }
    .mc-sc-elv  { background:rgba(var(--accent-rgb),.15);  color:var(--accent); }
    .mc-sc-plb  { background:rgba(45,212,191,.15);  color:#2dd4bf; }
    .mc-sc-elc  { background:rgba(255,204,0,.15);   color:#ffcc00; }
    .mc-sc-str  { background:rgba(175,82,222,.15);  color:#af52de; }

    .mc-status-tag { display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:14px; font-size:.7rem; font-weight:800; }
    .mc-status-tag.on  { background:rgba(52,199,89,.15);  color:#34c759; }
    .mc-status-tag.off { background:rgba(140,160,180,.12); color:var(--text-muted); }

    .mc-card-meta { display:flex; justify-content:space-between; align-items:center; gap:8px; padding-top:12px; margin-top:auto; border-top:1px solid rgba(var(--fg-rgb), .06); font-size:.75rem; color:var(--text-muted); }
    .mc-card-meta strong { color:var(--light); }
    .mc-card-meta i { font-size:.85rem; opacity:.65; margin-left:4px; }
    .mc-card-actions { display:flex; gap:7px; margin-top:14px; }
    .mc-card-actions button { flex:1; padding:8px; border-radius:9px; border:1px solid rgba(var(--fg-rgb), .08); background:rgba(var(--fg-rgb), .04); color:var(--light); font-family:inherit; font-size:.78rem; font-weight:700; cursor:pointer; transition:all .2s; display:flex; align-items:center; justify-content:center; gap:5px; }
    .mc-card-actions button:hover { background:rgba(var(--fg-rgb), .1); }
    .mc-card-actions .del { color:#ff3b30; border-color:rgba(255,59,48,.2); }
    .mc-card-actions .del:hover { background:rgba(255,59,48,.15); }

    .mc-empty { grid-column:1/-1; text-align:center; padding:60px 20px; color:var(--text-muted); }
    .mc-empty i { font-size:3rem; opacity:.4; display:block; margin-bottom:12px; }

    /* ── Modal ─────────────────────────────── */
    .mc-mask { position:fixed; inset:0; background:rgba(0,0,0,.65); backdrop-filter:blur(6px); z-index:9000; display:none; align-items:center; justify-content:center; padding:20px; }
    .mc-mask.show { display:flex; animation:mc-fade .2s; }
    .mc-modal { background:linear-gradient(160deg,var(--primary),var(--primary-deep)); border:1px solid rgba(var(--fg-rgb), .1); border-radius:20px; max-width:520px; width:100%; max-height:90vh; overflow-y:auto; }
    .mc-mhead { padding:20px 24px; border-bottom:1px solid rgba(var(--fg-rgb), .08); display:flex; justify-content:space-between; align-items:center; }
    .mc-mhead h3 { color:var(--light); font-size:1.05rem; font-weight:800; display:flex; align-items:center; gap:8px; }
    .mc-mhead h3 i { color:var(--accent); }
    .mc-mclose { background:none; border:none; color:var(--text-muted); font-size:1.4rem; cursor:pointer; padding:4px; }
    .mc-mclose:hover { color:var(--light); }
    .mc-mbody { padding:22px 24px; display:flex; flex-direction:column; gap:14px; }
    .mc-field label { display:block; font-size:.78rem; font-weight:700; color:var(--light); margin-bottom:6px; }
    .mc-field input, .mc-field textarea, .mc-field select {
      width:100%; padding:10px 13px; border-radius:10px;
      background:rgba(var(--fg-rgb), .04); border:1.5px solid rgba(var(--fg-rgb), .08);
      color:var(--light); font-family:inherit; font-size:.88rem; transition:all .2s; direction:rtl;
    }
    .mc-field input:focus, .mc-field textarea:focus, .mc-field select:focus { outline:none; border-color:var(--accent); background:rgba(var(--accent-rgb),.06); }
    .mc-field textarea { min-height:80px; resize:vertical; }
    .mc-field select { color-scheme: dark; }
    .mc-field select option { background:var(--primary) !important; color:var(--light) !important; padding:8px; }
    .mc-toggle { display:flex; align-items:center; gap:10px; padding:10px 12px; background:rgba(var(--fg-rgb), .04); border-radius:10px; border:1px solid rgba(var(--fg-rgb), .06); cursor:pointer; }
    .mc-toggle input { width:18px; height:18px; accent-color:var(--accent); cursor:pointer; }
    .mc-toggle span { color:var(--light); font-size:.86rem; }
    .mc-mfoot { padding:16px 24px 22px; display:flex; justify-content:flex-end; gap:10px; }

    /* ── Inline delete confirm ─────────────────── */
    .mc-del-confirm { background:rgba(255,59,48,.07); border:1px solid rgba(255,59,48,.28); border-radius:10px; padding:12px 14px; margin-top:12px; display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; }
    .mc-del-confirm .q { color:#ff3b30; font-size:.8rem; font-weight:700; display:flex; align-items:center; gap:6px; }
    .mc-del-confirm .q i { font-size:1rem; }
    .mc-del-acts { display:flex; gap:7px; }
    .mc-del-no  { padding:6px 13px; border-radius:8px; border:1px solid rgba(var(--fg-rgb), .1); background:rgba(var(--fg-rgb), .05); color:var(--light); font-family:inherit; font-size:.78rem; font-weight:700; cursor:pointer; }
    .mc-del-yes { padding:6px 13px; border-radius:8px; border:none; background:#ff3b30; color:#fff; font-family:inherit; font-size:.78rem; font-weight:800; cursor:pointer; display:flex; align-items:center; gap:5px; }

    @media(max-width:520px) {
      .mc-grid { grid-template-columns:1fr; }
      .mc-head { flex-direction:column; align-items:stretch; }
    }
  `;

  window.__pages['maintenancecategories'] = {
    getCSS() { return CSS; },

    async init() {
      const main = document.getElementById('app-main');
      if (!main) return;

      const BASE = (window.location.protocol==='https:'?'':'http://'+window.location.hostname+':5256');
      const tok = () => { try { const a = JSON.parse(localStorage.getItem('authData') || '{}'); return a.token || ''; } catch { return ''; } };

      async function api(method, path, body) {
        const t = tok();
        if (!t) { window.location.href = '/login'; return null; }
        const opts = { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${t}` } };
        if (body !== undefined) opts.body = JSON.stringify(body);
        const r = await fetch(BASE + path, opts);
        if (r.status === 401) { localStorage.removeItem('authData'); window.location.href = '/login'; return null; }
        if (r.status === 403) { window.__showToast?.('ليس لديك صلاحية لهذا الإجراء', 'error'); return null; }
        if (!r.ok) {
          let msg = `خطأ ${r.status}`;
          try { const e = await r.json(); msg = e.message || msg; } catch {}
          throw new Error(msg);
        }
        if (r.status === 204) return null;
        return r.json().catch(() => null);
      }
      const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

      const isAdmin = () => { try { const a = JSON.parse(localStorage.getItem('authData') || '{}'); return a.role === 'Admin' || a.role === '1'; } catch { return false; } };

      main.innerHTML = `
        <div class="mc-wrap">
          <div class="mc-head">
            <div>
              <div class="mc-title"><i class="ri-tools-line"></i> تصنيفات الصيانة</div>
              <div class="mc-sub">إدارة تصنيفات تذاكر الصيانة التي يستخدمها المشترون</div>
            </div>
            ${isAdmin() ? `<button class="mc-btn mc-btn-primary" id="mc-new"><i class="ri-add-line"></i> تصنيف جديد</button>` : ''}
          </div>
          <div class="mc-grid" id="mc-grid">
            <div class="mc-empty"><i class="ri-loader-4-line" style="animation:spin 1s linear infinite"></i><div>جارٍ التحميل…</div></div>
          </div>
        </div>

        <div class="mc-mask" id="mc-mask">
          <div class="mc-modal">
            <div class="mc-mhead">
              <h3><i class="ri-edit-line"></i> <span id="mc-mtitle">تصنيف</span></h3>
              <button class="mc-mclose" id="mc-mclose"><i class="ri-close-line"></i></button>
            </div>
            <div class="mc-mbody">
              <div class="mc-field"><label>الاسم بالعربية *</label><input id="mc-f-name" maxlength="150" placeholder="مثال: تسرب مياه"></div>
              <div class="mc-field"><label>الوصف</label><textarea id="mc-f-desc" maxlength="500" placeholder="وصف اختياري للتصنيف"></textarea></div>
              <div class="mc-field">
                <label>نطاق الضمان</label>
                <select id="mc-f-scope">
                  ${SCOPES.map(s => `<option value="${s.v}">${s.ar}</option>`).join('')}
                </select>
                <div style="font-size:.72rem;color:var(--text-muted);margin-top:5px">عند انتهاء ضمان هذا النطاق، التذكرة تصبح صيانة مدفوعة تلقائياً.</div>
              </div>
              <label class="mc-toggle"><input type="checkbox" id="mc-f-active" checked><span>تصنيف نشط (مرئي للمشترين)</span></label>
            </div>
            <div class="mc-mfoot">
              <button class="mc-btn mc-btn-primary" id="mc-save"><i class="ri-save-line"></i> حفظ</button>
              <button class="mc-btn mc-btn-ghost" id="mc-cancel">إلغاء</button>
            </div>
          </div>
        </div>
      `;

      const grid = document.getElementById('mc-grid');
      const mask = document.getElementById('mc-mask');
      const fName = document.getElementById('mc-f-name');
      const fDesc = document.getElementById('mc-f-desc');
      const fScope = document.getElementById('mc-f-scope');
      const fActive = document.getElementById('mc-f-active');
      const mTitle = document.getElementById('mc-mtitle');
      let editingId = null;

      const scopeOf = v => SCOPES.find(s => s.v === v) || SCOPES[0];

      function render(items) {
        if (!items.length) {
          grid.innerHTML = `<div class="mc-empty"><i class="ri-folder-open-line"></i><div>لا توجد تصنيفات بعد</div></div>`;
          return;
        }
        grid.innerHTML = items.map(c => {
          const sc = scopeOf(c.warrantyScope);
          return `
            <div class="mc-card ${c.isActive ? '' : 'inactive'}">
              <div class="mc-card-top">
                <div class="mc-card-id">
                  <div class="mc-card-icon ${sc.cls}"><i class="ri-shield-check-line"></i></div>
                  <div style="min-width:0">
                    <div class="mc-card-name">${esc(c.nameAr)}</div>
                    <span class="mc-scope-badge ${sc.cls}">${sc.ar}</span>
                  </div>
                </div>
                <span class="mc-status-tag ${c.isActive ? 'on' : 'off'}">
                  <i class="ri-${c.isActive ? 'checkbox-circle' : 'pause-circle'}-line"></i>
                  ${c.isActive ? 'نشط' : 'متوقف'}
                </span>
              </div>
              ${c.description ? `<div class="mc-card-desc">${esc(c.description)}</div>` : ''}
              <div class="mc-card-meta">
                <span><i class="ri-ticket-2-line"></i>التذاكر: <strong>${c.ticketsCount || 0}</strong></span>
                <span><i class="ri-calendar-line"></i><bdi>${new Date(c.createdAt).toLocaleDateString('ar-SA', { calendar:'gregory', numberingSystem:'latn', timeZone: 'Asia/Riyadh' })}</bdi></span>
              </div>
              ${isAdmin() ? `
                <div class="mc-card-actions">
                  <button data-id="${c.id}" class="edit"><i class="ri-pencil-line"></i> تعديل</button>
                  <button data-id="${c.id}" class="del"><i class="ri-delete-bin-line"></i> حذف</button>
                </div>
              ` : ''}
            </div>
          `;
        }).join('');

        grid.querySelectorAll('.edit').forEach(b => b.addEventListener('click', () => openEdit(+b.dataset.id, items)));
        grid.querySelectorAll('.del').forEach(b => b.addEventListener('click', () => doDelete(+b.dataset.id, items)));
      }

      async function load() {
        try {
          const data = await api('GET', '/api/MaintenanceCategories');
          render(Array.isArray(data) ? data : (data?.data || []));
        } catch (e) {
          grid.innerHTML = `<div class="mc-empty"><i class="ri-error-warning-line"></i><div>${esc(e.message)}</div></div>`;
        }
      }

      function openModal(title) {
        mTitle.textContent = title;
        mask.classList.add('show');
        setTimeout(() => fName.focus(), 50);
      }
      function closeModal() {
        mask.classList.remove('show');
        editingId = null;
        fName.value = ''; fDesc.value = ''; fScope.value = 'None'; fActive.checked = true;
      }

      function openEdit(id, items) {
        const c = items.find(x => x.id === id);
        if (!c) return;
        editingId = id;
        fName.value = c.nameAr;
        fDesc.value = c.description || '';
        fScope.value = c.warrantyScope || 'None';
        fActive.checked = !!c.isActive;
        openModal('تعديل تصنيف');
      }

      function doDelete(id, items) {
        const c = items.find(x => x.id === id);
        if (!c) return;
        // إيجاد كارد التصنيف وإظهار مربع التأكيد داخله
        const card = grid.querySelector(`.del[data-id="${id}"]`)?.closest('.mc-card');
        if (!card) return;
        // لو مربع التأكيد مفتوح بالفعل — أغلقه
        const existing = card.querySelector('.mc-del-confirm');
        if (existing) { existing.remove(); return; }
        const box = document.createElement('div');
        box.className = 'mc-del-confirm';
        box.innerHTML = `
          <span class="q"><i class="ri-error-warning-line"></i> حذف "<strong>${esc(c.nameAr)}</strong>" نهائياً؟</span>
          <div class="mc-del-acts">
            <button class="mc-del-no">إلغاء</button>
            <button class="mc-del-yes"><i class="ri-delete-bin-line"></i> نعم</button>
          </div>
        `;
        card.appendChild(box);
        box.querySelector('.mc-del-no').addEventListener('click', () => box.remove());
        box.querySelector('.mc-del-yes').addEventListener('click', async () => {
          const yesBtn = box.querySelector('.mc-del-yes');
          yesBtn.disabled = true;
          yesBtn.innerHTML = `<i class="ri-loader-4-line" style="animation:spin 1s linear infinite"></i>`;
          try {
            await api('DELETE', `/api/MaintenanceCategories/${id}`);
            window.__showToast?.('تم الحذف', 'success');
            load();
          } catch (e) {
            window.__showToast?.(e.message, 'error');
            box.remove();
          }
        });
      }

      document.getElementById('mc-new')?.addEventListener('click', () => openModal('تصنيف جديد'));
      document.getElementById('mc-mclose').addEventListener('click', closeModal);
      document.getElementById('mc-cancel').addEventListener('click', closeModal);
      mask.addEventListener('click', e => { if (e.target === mask) closeModal(); });

      document.getElementById('mc-save').addEventListener('click', async () => {
        const name = fName.value.trim();
        if (!name) { window.__showToast?.('الاسم مطلوب', 'warning'); return; }
        const payload = {
          nameAr: name,
          description: fDesc.value.trim() || null,
          warrantyScope: fScope.value,
          isActive: fActive.checked
        };
        try {
          if (editingId) {
            await api('PUT', `/api/MaintenanceCategories/${editingId}`, payload);
            window.__showToast?.('تم التحديث', 'success');
          } else {
            await api('POST', '/api/MaintenanceCategories', payload);
            window.__showToast?.('تمت الإضافة', 'success');
          }
          closeModal();
          load();
        } catch (e) {
          window.__showToast?.(e.message, 'error');
        }
      });

      load();
    }
  };
})();
