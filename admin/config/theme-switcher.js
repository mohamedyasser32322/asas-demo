/* ════════════════════════════════════════════════════════════
   Theme Switcher — تبديل الثيم live من الـ header
   ─────────────────────────────────────────────────────────────
   Admin only. يظهر زر palette في header-left بجانب الـ settings.
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const STYLE_ID = 'theme-switcher-style';
  if (!document.getElementById(STYLE_ID)) {
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = `
      .ts-wrap { position: relative; }
      .ts-btn {
        width: 38px; height: 38px; border-radius: 10px;
        background: var(--surface-tint);
        border: 1px solid var(--border);
        color: var(--light);
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        font-size: 1.1rem;
        transition: all 0.2s;
        flex-shrink: 0;
      }
      .ts-btn:hover {
        background: var(--hover-tint);
        border-color: var(--border-hover);
        transform: translateY(-1px);
      }
      .ts-btn.active {
        background: rgba(var(--accent-rgb), 0.14);
        border-color: rgba(var(--accent-rgb), 0.4);
        color: var(--accent);
      }

      .ts-dd {
        display: none; position: absolute;
        top: calc(100% + 8px); left: 0;
        width: 280px;
        background: var(--card-bg);
        border: 1px solid var(--border);
        border-radius: 14px; padding: 10px;
        box-shadow:
          0 0 0 1px rgba(0,0,0,.05),
          0 20px 50px rgba(0,0,0,.4),
          0 4px 14px rgba(0,0,0,.15);
        backdrop-filter: blur(28px) saturate(180%);
        -webkit-backdrop-filter: blur(28px) saturate(180%);
        z-index: 999;
      }
      .ts-dd.show {
        display: block;
        animation: ts-in .18s cubic-bezier(.16,1,.3,1);
      }
      @keyframes ts-in {
        from { opacity: 0; transform: translateY(-6px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .ts-dd-title {
        padding: 4px 8px 10px;
        font-size: 0.72rem; font-weight: 800;
        color: var(--text-muted);
        text-transform: uppercase; letter-spacing: 0.5px;
      }
      .ts-row {
        display: flex; align-items: center; gap: 10px;
        padding: 8px;
        border-radius: 9px; cursor: pointer;
        transition: background .14s;
        position: relative;
      }
      .ts-row + .ts-row { margin-top: 2px; }
      .ts-row:hover { background: var(--hover-tint); }
      .ts-row.active {
        background: rgba(var(--accent-rgb), 0.12);
      }
      .ts-row.active::after {
        content: '✓';
        position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
        color: var(--accent);
        font-weight: 900; font-size: 0.95rem;
      }
      .ts-preview {
        width: 56px; height: 36px;
        border-radius: 8px; overflow: hidden;
        position: relative; flex-shrink: 0;
        border: 1px solid var(--border);
      }
      .ts-preview .bg { position: absolute; inset: 0; }
      .ts-preview .card {
        position: absolute; top: 7px; right: 5px; left: 14px; bottom: 7px;
        border-radius: 3px;
      }
      .ts-preview .accent {
        position: absolute; bottom: 10px; left: 18px;
        width: 14px; height: 5px; border-radius: 2px;
      }
      .ts-info { flex: 1; min-width: 0; }
      .ts-name {
        font-size: .86rem; font-weight: 700;
        color: var(--light);
        display: flex; align-items: center; gap: 7px;
      }
      .ts-tag {
        font-size: .62rem; font-weight: 800; padding: 2px 7px;
        border-radius: 6px;
        text-transform: uppercase; letter-spacing: 0.4px;
      }
      .ts-tag.dark  { background: rgba(78,141,245,.15); color: #7ab3ff; }
      .ts-tag.light { background: rgba(245,200,66,.18); color: #ffd84d; }
    `;
    document.head.appendChild(s);
  }

  /* ── Apply + save ── */
  async function applyAndSave(themeName) {
    /* Apply locally first for instant feedback */
    if (window.applyTheme) window.applyTheme(themeName);
    /* Persist */
    const token = JSON.parse(localStorage.getItem('authData') || '{}').token;
    if (!token) return;
    try {
      const r = await fetch('/api/Brand/theme', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ themeName })
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        throw new Error(err.message || 'فشل حفظ الثيم');
      }
      if (window.BRAND) window.BRAND.themeName = themeName;
      try { localStorage.setItem('asas_theme', themeName); } catch {}
      window.__showToast?.('تم تطبيق الثيم بنجاح', 'success', 2000);
    } catch (e) {
      window.__showToast?.(e.message || 'فشل حفظ الثيم', 'error');
    }
  }

  function renderDropdown() {
    const themes = window.THEMES || {};
    const currentTheme = window.BRAND?.themeName || 'midnight';
    let html = `<div class="ts-dd-title">اختر هوية النظام</div>`;
    Object.entries(themes).forEach(([key, theme]) => {
      const [bg, card, accent] = theme.previewColors;
      html += `
        <div class="ts-row ${key === currentTheme ? 'active' : ''}" data-theme="${key}">
          <div class="ts-preview">
            <div class="bg" style="background:${bg}"></div>
            <div class="card" style="background:${card}"></div>
            <div class="accent" style="background:${accent}"></div>
          </div>
          <div class="ts-info">
            <div class="ts-name">
              ${theme.nameAr}
              <span class="ts-tag ${theme.isDark ? 'dark' : 'light'}">${theme.isDark ? 'داكن' : 'فاتح'}</span>
            </div>
          </div>
        </div>
      `;
    });
    return html;
  }

  /* ── Public init — call from Layout after header rendered ── */
  window.initThemeSwitcher = function () {
    const userData = JSON.parse(localStorage.getItem('authData') || '{}');
    const isAdmin = userData.role === 'Admin' || userData.role === '1' || userData.role === 1;
    if (!isAdmin) return; /* Only Admin can switch themes */

    const headerActions = document.querySelector('.header-actions');
    if (!headerActions || document.getElementById('ts-wrap')) return;

    const wrap = document.createElement('div');
    wrap.id = 'ts-wrap';
    wrap.className = 'ts-wrap';
    wrap.innerHTML = `
      <button class="ts-btn" id="ts-btn" title="تبديل الثيم">
        <i class="ri-palette-line"></i>
      </button>
      <div class="ts-dd" id="ts-dd"></div>
    `;
    headerActions.appendChild(wrap);

    const btn = document.getElementById('ts-btn');
    const dd  = document.getElementById('ts-dd');

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !dd.classList.contains('show');
      dd.innerHTML = renderDropdown();
      dd.classList.toggle('show');
      btn.classList.toggle('active', willOpen);

      /* Bind row clicks */
      dd.querySelectorAll('.ts-row').forEach(row => {
        row.addEventListener('click', () => {
          const themeName = row.dataset.theme;
          dd.classList.remove('show');
          btn.classList.remove('active');
          applyAndSave(themeName);
        });
      });
    });

    document.addEventListener('click', (e) => {
      if (!dd.contains(e.target) && !btn.contains(e.target)) {
        dd.classList.remove('show');
        btn.classList.remove('active');
      }
    });
  };
})();
