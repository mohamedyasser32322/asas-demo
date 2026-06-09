/* ════════════════════════════════════════════════════════════
   PAGE MODULE: systemprofile — ملف النظام
   تخصيص: اسم النظام · اللوجو · لون/هوية النظام · مدد الضمان
   Admin only.
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  window.__pages = window.__pages || {};

  const CSS = `
    .sp-wrap { max-width: 760px; margin: 0 auto; padding: 24px 18px 60px; }
    .sp-head { margin-bottom: 22px; }
    .sp-head h1 {
      font-size: 1.5rem; font-weight: 800; color: var(--light);
      display: flex; align-items: center; gap: 10px;
    }
    .sp-head h1 i { color: var(--accent); }
    .sp-head p { color: var(--text-muted); font-size: 0.9rem; margin-top: 5px; }

    .sp-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 22px 24px;
      margin-bottom: 16px;
    }
    .sp-card-title {
      font-size: 0.95rem; font-weight: 800; color: var(--light);
      display: flex; align-items: center; gap: 9px; margin-bottom: 4px;
    }
    .sp-card-title i { color: var(--accent); }
    .sp-card-desc { color: var(--text-muted); font-size: 0.82rem; margin-bottom: 18px; line-height: 1.5; }

    .sp-input {
      width: 100%; background: var(--surface-tint);
      border: 1px solid var(--border); border-radius: 10px;
      padding: 11px 14px; color: var(--light); font-family: 'Tajawal', sans-serif;
      font-size: 0.95rem; font-weight: 600; outline: none;
      transition: border-color .18s, box-shadow .18s;
    }
    .sp-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(var(--accent-rgb), 0.12); }

    /* Logo */
    .sp-logo-area {
      border: 2px dashed var(--border-hover); border-radius: 14px;
      padding: 24px 18px; text-align: center; cursor: pointer;
      transition: all .2s; position: relative; overflow: hidden;
    }
    .sp-logo-area:hover, .sp-logo-area.drag { border-color: var(--accent); background: rgba(var(--accent-rgb), 0.05); }
    .sp-logo-area input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
    .sp-logo-area i { font-size: 2rem; color: var(--accent); display: block; margin-bottom: 8px; }
    .sp-logo-area .t { font-size: 0.88rem; font-weight: 700; color: var(--light); margin-bottom: 4px; }
    .sp-logo-area .h { font-size: 0.76rem; color: var(--text-muted); }

    .sp-logo-preview { display: none; flex-direction: column; align-items: center; gap: 12px; }
    .sp-logo-preview.show { display: flex; }
    .sp-logo-preview img {
      max-height: 64px; max-width: 220px; object-fit: contain;
      border-radius: 8px; background: var(--surface-tint); padding: 10px;
    }
    .sp-logo-remove {
      background: rgba(255,59,48,0.12); border: 1px solid rgba(255,59,48,0.25); color: #ff6b62;
      border-radius: 9px; padding: 6px 16px; font-family: inherit; font-size: 0.8rem; font-weight: 700;
      cursor: pointer; transition: all .18s;
    }
    .sp-logo-remove:hover { background: rgba(255,59,48,0.22); }

    /* Theme cards */
    .sp-theme-grid { display: grid; grid-template-columns: 1fr; gap: 11px; }
    .sp-theme-card {
      position: relative; cursor: pointer;
      background: var(--surface-tint);
      border: 2px solid var(--border); border-radius: 13px;
      padding: 13px; transition: all .2s;
      display: flex; align-items: center; gap: 14px;
    }
    .sp-theme-card:hover { border-color: var(--border-hover); }
    .sp-theme-card.selected { border-color: var(--accent); box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.12); }
    .sp-theme-card.selected::after {
      content: '✓'; position: absolute; top: 10px; left: 10px;
      width: 22px; height: 22px; border-radius: 50%;
      background: var(--accent); color: #fff;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.8rem; font-weight: 900;
    }
    .sp-theme-preview {
      flex-shrink: 0; width: 86px; height: 58px;
      border-radius: 9px; overflow: hidden; position: relative;
      border: 1px solid var(--border);
    }
    .sp-tp-bg { position: absolute; inset: 0; }
    .sp-tp-card { position: absolute; top: 10px; right: 7px; left: 20px; bottom: 10px; border-radius: 4px; }
    .sp-tp-accent { position: absolute; bottom: 15px; left: 24px; width: 20px; height: 7px; border-radius: 2px; }
    .sp-theme-name { font-size: 0.92rem; font-weight: 800; color: var(--light); display: flex; align-items: center; gap: 8px; }
    .sp-theme-tag { font-size: 0.62rem; font-weight: 800; padding: 2px 8px; border-radius: 7px; text-transform: uppercase; letter-spacing: .4px; }
    .sp-theme-tag.dark  { background: rgba(78,141,245,.18); color: #7ab3ff; }
    .sp-theme-tag.light { background: rgba(245,200,66,.18); color: #ffd84d; }

    /* Warranty rows */
    .sp-wr-row {
      display: flex; align-items: center; gap: 14px;
      padding: 13px 0; border-bottom: 1px solid var(--border);
    }
    .sp-wr-row:last-child { border-bottom: none; }
    .sp-wr-icon {
      width: 42px; height: 42px; border-radius: 11px;
      background: rgba(var(--accent-rgb), 0.12); color: var(--accent);
      display: flex; align-items: center; justify-content: center;
      font-size: 1.15rem; flex-shrink: 0;
    }
    .sp-wr-info { flex: 1; min-width: 0; }
    .sp-wr-info h3 { font-size: 0.92rem; font-weight: 700; color: var(--light); margin-bottom: 2px; }
    .sp-wr-info p { font-size: 0.76rem; color: var(--text-muted); }
    .sp-wr-input {
      display: flex; align-items: center; gap: 6px;
      background: var(--surface-tint); border: 1px solid var(--border);
      border-radius: 10px; padding: 4px; transition: border-color .18s;
    }
    .sp-wr-input:focus-within { border-color: var(--accent); }
    .sp-wr-input input {
      width: 56px; background: none; border: none; outline: none;
      color: var(--light); font-family: 'Tajawal', sans-serif;
      font-size: 0.95rem; font-weight: 700; text-align: center; padding: 6px 4px;
    }
    .sp-wr-input span { color: var(--text-muted); font-size: 0.8rem; padding-left: 8px; }

    .sp-note {
      display: flex; align-items: flex-start; gap: 10px;
      padding: 12px 14px; background: rgba(var(--accent-rgb), 0.08);
      border: 1px solid rgba(var(--accent-rgb), 0.2); border-radius: 10px;
      color: var(--light); font-size: 0.83rem; line-height: 1.6;
    }
    .sp-note i { color: var(--accent); font-size: 1.1rem; margin-top: 2px; flex-shrink: 0; }

    .sp-foot {
      position: sticky; bottom: 0;
      display: flex; gap: 10px; justify-content: flex-end;
      padding: 16px 0 0; margin-top: 8px;
    }
    .sp-save {
      padding: 12px 28px; border-radius: 11px;
      background: var(--accent); color: #fff;
      font-family: 'Tajawal', sans-serif; font-size: 0.95rem; font-weight: 800;
      border: none; cursor: pointer; transition: all .2s;
      display: inline-flex; align-items: center; gap: 7px;
    }
    .sp-save:hover { background: var(--accent-dark); transform: translateY(-1px); }
    .sp-save:disabled { opacity: .55; cursor: not-allowed; transform: none; }
  `;

  const WR_ITEMS = [
    { key: 'elevatorYears',   label: 'المصعد',          desc: 'مدة ضمان المصاعد',          icon: 'ri-store-2-line',    def: 3 },
    { key: 'plumbingYears',   label: 'السباكة',         desc: 'مدة ضمان أعمال السباكة',    icon: 'ri-drop-line',       def: 3 },
    { key: 'electricalYears', label: 'الكهرباء',        desc: 'مدة ضمان أعمال الكهرباء',   icon: 'ri-flashlight-line', def: 3 },
    { key: 'structuralYears', label: 'الهيكل الإنشائي', desc: 'مدة ضمان الهيكل والبنية',   icon: 'ri-building-2-line', def: 10 },
  ];

  window.__pages['systemprofile'] = {
    getCSS() { return CSS; },

    async init() {
      const main = document.getElementById('app-main');
      if (!main) return;

      const BASE = (window.location.protocol === 'https:' ? '' : 'http://' + window.location.hostname + ':5256');
      const tok = () => { try { const a = JSON.parse(localStorage.getItem('authData') || '{}'); return a.token || ''; } catch { return ''; } };
      const isAdmin = () => { try { const a = JSON.parse(localStorage.getItem('authData') || '{}'); return a.role === 'Admin' || a.role === '1'; } catch { return false; } };

      if (!isAdmin()) {
        main.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted)">هذه الصفحة متاحة لمدير النظام فقط</div>`;
        return;
      }

      let cfg = {};
      try { cfg = await (await fetch(BASE + '/api/Brand')).json() || {}; } catch {}
      const w = cfg.warranty || {};
      const cur = cfg.currency || {};
      const CUR_PRESETS = [
        { symbol: 'ر.س', locale: 'en-US', label: 'ريال سعودي (ر.س)' },
        { symbol: 'ج.م', locale: 'en-US', label: 'جنيه مصري (ج.م)' },
        { symbol: 'د.إ', locale: 'en-US', label: 'درهم إماراتي (د.إ)' },
        { symbol: 'د.ك', locale: 'en-US', label: 'دينار كويتي (د.ك)' },
        { symbol: 'د.ب', locale: 'en-US', label: 'دينار بحريني (د.ب)' },
        { symbol: 'ر.ق', locale: 'en-US', label: 'ريال قطري (ر.ق)' },
        { symbol: 'ر.ع', locale: 'en-US', label: 'ريال عُماني (ر.ع)' },
        { symbol: 'د.أ', locale: 'en-US', label: 'دينار أردني (د.أ)' },
        { symbol: '$',   locale: 'en-US', label: 'دولار أمريكي ($)' },
        { symbol: '€',   locale: 'en-US', label: 'يورو (€)' },
      ];
      const curSelected = cur.symbol || 'ر.س';
      let selectedTheme = cfg.themeName || 'midnight';
      let logoUrl = cfg.logoUrl || null;   // الحالي على السيرفر
      let logoFile = null;                  // ملف جديد لم يُرفع بعد
      let logoCleared = false;              // المستخدم أزال اللوجو

      const THEMES = window.THEMES || {};
      const themeCards = Object.entries(THEMES).map(([key, t]) => {
        const [bg, card, accent] = t.previewColors;
        return `
          <div class="sp-theme-card ${key === selectedTheme ? 'selected' : ''}" data-theme="${key}">
            <div class="sp-theme-preview">
              <div class="sp-tp-bg" style="background:${bg}"></div>
              <div class="sp-tp-card" style="background:${card}"></div>
              <div class="sp-tp-accent" style="background:${accent}"></div>
            </div>
            <div class="sp-theme-name">${t.nameAr}
              <span class="sp-theme-tag ${t.isDark ? 'dark' : 'light'}">${t.isDark ? 'داكن' : 'فاتح'}</span>
            </div>
          </div>`;
      }).join('');

      main.innerHTML = `
        <div class="sp-wrap">
          <div class="sp-head">
            <h1><i class="ri-settings-4-line"></i> ملف النظام</h1>
            <p>تحكم في هوية النظام كاملة — الاسم، الشعار، اللون، ومدد الضمان</p>
          </div>

          <div class="sp-card">
            <div class="sp-card-title"><i class="ri-building-4-line"></i> اسم النظام</div>
            <div class="sp-card-desc">يظهر في الهيدر وعنوان المتصفح وكل صفحات النظام</div>
            <input type="text" class="sp-input" id="sp-name" maxlength="80" autocomplete="off"
              value="${(cfg.companyName || '').replace(/"/g, '&quot;')}" placeholder="اسم الشركة"/>
          </div>

          <div class="sp-card">
            <div class="sp-card-title"><i class="ri-whatsapp-line"></i> رقم واتساب الشركة</div>
            <div class="sp-card-desc">يظهر كزر تواصل عائم في صفحة الواجهة. بصيغة دولية بدون + (مثال: 9665XXXXXXXX) — اتركه فارغاً لإخفاء الزر</div>
            <input type="tel" class="sp-input" id="sp-whatsapp" inputmode="numeric" maxlength="18" autocomplete="off" dir="ltr" style="text-align:left"
              value="${(cfg.whatsappNumber || '').replace(/"/g, '&quot;')}" placeholder="9665XXXXXXXX"/>
          </div>

          <div class="sp-card">
            <div class="sp-card-title"><i class="ri-money-dollar-circle-line"></i> عملة النظام</div>
            <div class="sp-card-desc">اختر عملة البلد — يظهر رمزها تلقائياً بجانب كل الأسعار والمبالغ في النظام كله</div>
            <select class="sp-input" id="sp-cur-preset">
              ${CUR_PRESETS.map(p => `<option value="${p.symbol}|${p.locale}" ${curSelected === p.symbol ? 'selected' : ''}>${p.label}</option>`).join('')}
            </select>
          </div>

          <div class="sp-card">
            <div class="sp-card-title"><i class="ri-image-line"></i> شعار النظام</div>
            <div class="sp-card-desc">يظهر في الهيدر وصفحة تسجيل الدخول وأيقونة المتصفح — يُفضل PNG/SVG بخلفية شفافة</div>
            <div class="sp-logo-area" id="sp-logo-area">
              <input type="file" id="sp-logo-file" accept=".png,.jpg,.jpeg,.svg,.webp"/>
              <i class="ri-upload-cloud-2-line"></i>
              <div class="t">اضغط لاختيار الشعار أو اسحبه هنا</div>
              <div class="h">PNG · SVG · JPG · WebP · حد أقصى 5 MB</div>
            </div>
            <div class="sp-logo-preview" id="sp-logo-preview">
              <img id="sp-logo-img" src="" alt="logo"/>
              <button class="sp-logo-remove" id="sp-logo-remove"><i class="ri-delete-bin-line"></i> إزالة الشعار</button>
            </div>
          </div>

          <div class="sp-card">
            <div class="sp-card-title"><i class="ri-palette-line"></i> لون وهوية النظام</div>
            <div class="sp-card-desc">يحدد ألوان النظام بالكامل — الخلفية، الكروت، الأزرار، النصوص</div>
            <div class="sp-theme-grid" id="sp-theme-grid">${themeCards}</div>
          </div>

          <div class="sp-card">
            <div class="sp-card-title"><i class="ri-shield-check-line"></i> مدد الضمان</div>
            <div class="sp-card-desc">تنطبق على كل الحجوزات الجديدة والقديمة. الحد الأدنى 1 سنة، الأقصى 50 سنة</div>
            ${WR_ITEMS.map(it => `
              <div class="sp-wr-row">
                <div class="sp-wr-icon"><i class="${it.icon}"></i></div>
                <div class="sp-wr-info"><h3>${it.label}</h3><p>${it.desc}</p></div>
                <div class="sp-wr-input">
                  <input type="number" min="1" max="50" id="sp-wr-${it.key}" value="${w[it.key] || it.def}"/>
                  <span>سنة</span>
                </div>
              </div>`).join('')}
          </div>

          <div class="sp-note">
            <i class="ri-information-line"></i>
            <div>تغييرات اللون تُطبَّق فوراً لكل المستخدمين عند الحفظ. يظهر العرض الصحيح للضمانات للعملاء وكل المستخدمين حسب المدد المحددة هنا.</div>
          </div>

          <div class="sp-foot">
            <button class="sp-save" id="sp-save"><i class="ri-save-line"></i> حفظ التغييرات</button>
          </div>
        </div>`;

      /* ── Logo current preview ── */
      const area = main.querySelector('#sp-logo-area');
      const prevWrap = main.querySelector('#sp-logo-preview');
      const prevImg = main.querySelector('#sp-logo-img');
      const fileInput = main.querySelector('#sp-logo-file');

      function showPreview(src) {
        prevImg.src = src;
        prevWrap.classList.add('show');
        area.style.display = 'none';
      }
      function hidePreview() {
        prevWrap.classList.remove('show');
        area.style.display = '';
      }
      if (logoUrl) showPreview(BASE + logoUrl);

      fileInput.addEventListener('change', function () {
        const f = this.files[0]; if (!f) return;
        if (f.size > 5 * 1024 * 1024) { window.__showToast?.('حجم الملف يتجاوز 5 MB', 'error'); return; }
        logoFile = f; logoCleared = false;
        const reader = new FileReader();
        reader.onload = e => showPreview(e.target.result);
        reader.readAsDataURL(f);
      });
      area.addEventListener('dragover', e => { e.preventDefault(); area.classList.add('drag'); });
      area.addEventListener('dragleave', () => area.classList.remove('drag'));
      area.addEventListener('drop', e => {
        e.preventDefault(); area.classList.remove('drag');
        if (e.dataTransfer.files[0]) { fileInput.files = e.dataTransfer.files; fileInput.dispatchEvent(new Event('change')); }
      });
      main.querySelector('#sp-logo-remove').addEventListener('click', () => {
        logoFile = null; logoCleared = true; fileInput.value = '';
        hidePreview();
      });

      /* ── Theme cards: اختيار فقط — لا يُطبَّق إلا بعد الحفظ ── */
      main.querySelectorAll('.sp-theme-card').forEach(card => {
        card.addEventListener('click', () => {
          selectedTheme = card.dataset.theme;
          main.querySelectorAll('.sp-theme-card').forEach(c => c.classList.toggle('selected', c === card));
        });
      });

      /* ── Save ── */
      const saveBtn = main.querySelector('#sp-save');
      saveBtn.addEventListener('click', async () => {
        const name = main.querySelector('#sp-name').value.trim();
        if (!name) { window.__showToast?.('اسم النظام مطلوب', 'error'); main.querySelector('#sp-name').focus(); return; }

        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="ri-loader-4-line" style="animation:spin .7s linear infinite"></i> جاري الحفظ...';

        try {
          /* 1) رفع اللوجو لو فيه ملف جديد */
          let finalLogo = logoCleared ? null : logoUrl;
          if (logoFile) {
            const fd = new FormData();
            fd.append('file', logoFile);
            const lr = await fetch(BASE + '/api/Brand/logo', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${tok()}` },
              body: fd
            });
            if (!lr.ok) { const e = await lr.json().catch(() => ({})); throw new Error(e.message || 'فشل رفع الشعار'); }
            finalLogo = (await lr.json()).logoUrl;
          }

          /* 2) حفظ بقية الإعدادات */
          const [curSymbol, curLocale] = (main.querySelector('#sp-cur-preset').value || 'ر.س|en-US').split('|');
          const whatsappNumber = (main.querySelector('#sp-whatsapp')?.value || '').replace(/\D/g, '');
          const payload = {
            companyName: name,
            themeName: selectedTheme,
            logoUrl: finalLogo,
            whatsappNumber,
            currencySymbol: curSymbol,
            currencyLocale: curLocale,
            warrantyElevatorYears:   parseInt(main.querySelector('#sp-wr-elevatorYears').value)   || 3,
            warrantyPlumbingYears:   parseInt(main.querySelector('#sp-wr-plumbingYears').value)   || 3,
            warrantyElectricalYears: parseInt(main.querySelector('#sp-wr-electricalYears').value) || 3,
            warrantyStructuralYears: parseInt(main.querySelector('#sp-wr-structuralYears').value) || 10,
          };
          const r = await fetch(BASE + '/api/Brand', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tok()}` },
            body: JSON.stringify(payload)
          });
          if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.message || 'فشل الحفظ'); }

          /* 3) تحديث الهوية الحية */
          logoUrl = finalLogo; logoFile = null; logoCleared = false;
          if (window.BRAND) { window.BRAND.companyName = name; window.BRAND.themeName = selectedTheme; window.BRAND.logoUrl = finalLogo; window.BRAND.whatsappNumber = whatsappNumber; window.BRAND.currency = { symbol: curSymbol, locale: curLocale }; }
          if (window.applyTheme) window.applyTheme(selectedTheme);
          document.title = name;
          document.querySelectorAll('.brand-name').forEach(el => el.textContent = name);
          const logoName = document.getElementById('logoName'); if (logoName) logoName.textContent = name;

          window.__showToast?.('تم حفظ ملف النظام بنجاح', 'success');
        } catch (e) {
          window.__showToast?.(e.message || 'حدث خطأ', 'error');
        } finally {
          saveBtn.disabled = false;
          saveBtn.innerHTML = '<i class="ri-save-line"></i> حفظ التغييرات';
        }
      });
    }
  };
})();
