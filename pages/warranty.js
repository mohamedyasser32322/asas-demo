/* ════════════════════════════════════════════════════════════
   PAGE MODULE: warranty — إعدادات مدد الضمان
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  window.__pages = window.__pages || {};

  const _css = `
    .wr-wrap { max-width: 720px; margin: 0 auto; padding: 24px 18px; }
    .wr-head { margin-bottom: 22px; }
    .wr-head h1 {
      font-size: 1.5rem; font-weight: 800; color: var(--light);
      display: flex; align-items: center; gap: 10px;
    }
    .wr-head h1 i { color: var(--accent); }
    .wr-head p { color: var(--text-muted); font-size: 0.9rem; margin-top: 5px; }

    .wr-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 16px;
    }

    .wr-row {
      display: flex; align-items: center; gap: 14px;
      padding: 14px 0;
      border-bottom: 1px solid var(--border);
    }
    .wr-row:last-child { border-bottom: none; }

    .wr-icon {
      width: 44px; height: 44px; border-radius: 12px;
      background: rgba(var(--accent-rgb), 0.12);
      color: var(--accent);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.2rem; flex-shrink: 0;
    }
    .wr-info { flex: 1; min-width: 0; }
    .wr-info h3 {
      font-size: 0.95rem; font-weight: 700;
      color: var(--light); margin-bottom: 2px;
    }
    .wr-info p { font-size: 0.78rem; color: var(--text-muted); }

    .wr-input-wrap {
      display: flex; align-items: center; gap: 6px;
      background: var(--surface-tint);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 4px;
      transition: border-color .18s;
    }
    .wr-input-wrap:focus-within { border-color: var(--accent); }
    .wr-input-wrap input {
      width: 60px;
      background: none; border: none; outline: none;
      color: var(--light);
      font-family: 'Tajawal', sans-serif;
      font-size: 0.95rem; font-weight: 700;
      text-align: center;
      padding: 6px 4px;
    }
    .wr-unit {
      color: var(--text-muted);
      font-size: 0.82rem;
      padding-left: 8px;
    }

    .wr-foot {
      display: flex; gap: 10px; justify-content: flex-end; margin-top: 18px;
    }
    .wr-btn {
      padding: 11px 24px; border-radius: 11px;
      font-family: 'Tajawal', sans-serif; font-size: 0.92rem; font-weight: 700;
      cursor: pointer; transition: all .2s;
      display: inline-flex; align-items: center; gap: 7px;
      border: none;
    }
    .wr-btn-save {
      background: var(--accent); color: #fff;
    }
    .wr-btn-save:hover {
      background: var(--accent-dark); transform: translateY(-1px);
    }
    .wr-btn-save:disabled { opacity: .5; cursor: not-allowed; transform: none; }

    .wr-note {
      display: flex; align-items: flex-start; gap: 10px;
      padding: 12px 14px;
      background: rgba(var(--accent-rgb), 0.08);
      border: 1px solid rgba(var(--accent-rgb), 0.2);
      border-radius: 10px;
      color: var(--light);
      font-size: 0.85rem; line-height: 1.6;
    }
    .wr-note i { color: var(--accent); font-size: 1.1rem; margin-top: 2px; flex-shrink: 0; }
  `;

  const items = [
    { key: 'elevatorYears',   label: 'المصعد',           desc: 'مدة ضمان المصاعد', icon: 'ri-store-2-line' },
    { key: 'plumbingYears',   label: 'السباكة',          desc: 'مدة ضمان أعمال السباكة', icon: 'ri-drop-line' },
    { key: 'electricalYears', label: 'الكهرباء',         desc: 'مدة ضمان أعمال الكهرباء', icon: 'ri-flashlight-line' },
    { key: 'structuralYears', label: 'الهيكل الإنشائي',  desc: 'مدة ضمان الهيكل والبنية', icon: 'ri-building-2-line' },
  ];

  function render() {
    const el = document.createElement('div');
    el.innerHTML = `
      <style>${_css}</style>
      <div class="wr-wrap">
        <div class="wr-head">
          <h1><i class="ri-shield-check-line"></i> إعدادات مدد الضمان</h1>
          <p>حدد مدة الضمان لكل نوع من الأعمال — تبدأ من تاريخ بيع الوحدة وجاهزية المشروع</p>
        </div>

        <div class="wr-card" id="wr-card">
          ${items.map(it => `
            <div class="wr-row">
              <div class="wr-icon"><i class="${it.icon}"></i></div>
              <div class="wr-info">
                <h3>${it.label}</h3>
                <p>${it.desc}</p>
              </div>
              <div class="wr-input-wrap">
                <input type="number" min="1" max="50" id="wr-${it.key}" value="3"/>
                <span class="wr-unit">سنة</span>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="wr-note">
          <i class="ri-information-line"></i>
          <div>التغييرات تنطبق على كل الحجوزات الجديدة والقديمة على حد سواء. الحد الأدنى 1 سنة، الأقصى 50 سنة.</div>
        </div>

        <div class="wr-foot">
          <button class="wr-btn wr-btn-save" id="wr-save-btn" onclick="window.__warrantySave()">
            <i class="ri-save-line"></i> حفظ التعديلات
          </button>
        </div>
      </div>
    `;
    return el;
  }

  async function init() {
    /* Load current values */
    try {
      const r = await fetch('/api/Brand');
      const cfg = await r.json();
      const w = cfg.warranty || {};
      items.forEach(it => {
        const input = document.getElementById('wr-' + it.key);
        if (input) input.value = w[it.key] || 3;
      });
    } catch {}
  }

  window.__warrantySave = async function () {
    const btn = document.getElementById('wr-save-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="ri-loader-4-line" style="animation:spin .7s linear infinite"></i> جاري الحفظ...';

    try {
      const cur = await (await fetch('/api/Brand')).json();
      const payload = {
        companyName: cur.companyName || 'Company',
        themeName:   cur.themeName   || 'midnight',
        logoUrl:     cur.logoUrl     || null,
        warrantyElevatorYears:   parseInt(document.getElementById('wr-elevatorYears').value)   || 3,
        warrantyPlumbingYears:   parseInt(document.getElementById('wr-plumbingYears').value)   || 3,
        warrantyElectricalYears: parseInt(document.getElementById('wr-electricalYears').value) || 3,
        warrantyStructuralYears: parseInt(document.getElementById('wr-structuralYears').value) || 10,
      };
      const token = JSON.parse(localStorage.getItem('authData') || '{}').token;
      const r = await fetch('/api/Brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!r.ok) throw new Error('فشل الحفظ');
      window.__showToast?.('تم حفظ إعدادات الضمان', 'success');
    } catch (e) {
      window.__showToast?.(e.message || 'حدث خطأ', 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="ri-save-line"></i> حفظ التعديلات';
    }
  };

  window.__pages.warranty = { render, init };
})();
