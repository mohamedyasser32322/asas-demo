/* ════════════════════════════════════════════════════════════
   Command Palette — Ctrl+K / Cmd+K
   ─────────────────────────────────────────────────────────────
   بحث سريع + تنقل فوري عبر النظام بالكيبورد
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Style ── */
  const STYLE_ID = 'cmd-palette-style';
  if (!document.getElementById(STYLE_ID)) {
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = `
      #cmd-mask {
        position:fixed; inset:0; z-index:99998;
        background:rgba(0,0,0,.55); backdrop-filter:blur(8px);
        display:none; align-items:flex-start; justify-content:center;
        padding-top:14vh; padding-left:16px; padding-right:16px;
        animation:cmd-fadein .18s ease;
      }
      #cmd-mask.show { display:flex; }
      @keyframes cmd-fadein { from{opacity:0} to{opacity:1} }
      @keyframes cmd-pop { from{opacity:0;transform:translateY(-10px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }

      #cmd-panel {
        width:100%; max-width:620px;
        background:var(--card-bg, #112952);
        border:1px solid var(--border-hover, rgba(var(--fg-rgb), .2));
        border-radius:16px; overflow:hidden;
        box-shadow:0 25px 70px rgba(0,0,0,.5);
        animation:cmd-pop .22s cubic-bezier(.4,0,.2,1);
        display:flex; flex-direction:column; max-height:min(70vh, 600px);
      }
      .cmd-search {
        display:flex; align-items:center; gap:10px;
        padding:14px 18px; border-bottom:1px solid var(--border, rgba(var(--fg-rgb), .08));
      }
      .cmd-search i { font-size:1.2rem; color:var(--text-muted, #8fa3c0); flex-shrink:0; }
      .cmd-search input {
        flex:1; background:transparent; border:none; outline:none;
        color:var(--light, #fff); font-family:'Tajawal', sans-serif;
        font-size:1rem; font-weight:600;
        direction:rtl;
      }
      .cmd-search input::placeholder { color:var(--text-muted, #8fa3c0); font-weight:400; }
      .cmd-kbd {
        background:rgba(var(--bg-rgb, 8,24,48),.6);
        border:1px solid var(--border, rgba(var(--fg-rgb), .1));
        border-radius:6px; padding:2px 8px; font-size:.72rem;
        font-weight:700; color:var(--text-muted, #8fa3c0);
        font-family:'Consolas', monospace;
      }

      .cmd-results { flex:1; overflow-y:auto; padding:8px 0; }
      .cmd-results::-webkit-scrollbar { width:5px; }
      .cmd-results::-webkit-scrollbar-thumb { background:rgba(var(--fg-rgb), .1); border-radius:4px; }

      .cmd-section-h {
        padding:8px 18px 4px;
        font-size:.7rem; font-weight:800;
        color:var(--text-muted, #8fa3c0);
        text-transform:uppercase; letter-spacing:.6px;
      }
      .cmd-item {
        display:flex; align-items:center; gap:12px;
        padding:10px 18px; cursor:pointer;
        transition:background .12s;
      }
      .cmd-item:hover, .cmd-item.active {
        background:rgba(var(--accent-rgb, 78,141,245),.12);
      }
      .cmd-item-icon {
        width:34px; height:34px; border-radius:9px;
        background:rgba(var(--accent-rgb, 78,141,245),.15);
        color:var(--accent, #4e8df5);
        display:flex; align-items:center; justify-content:center;
        font-size:1.05rem; flex-shrink:0;
      }
      .cmd-item-text { flex:1; min-width:0; }
      .cmd-item-ttl {
        font-size:.92rem; font-weight:700;
        color:var(--light, #fff); line-height:1.3;
      }
      .cmd-item-desc {
        font-size:.74rem; color:var(--text-muted, #8fa3c0);
        margin-top:2px;
      }
      .cmd-item-shortcut {
        font-size:.72rem; color:var(--text-muted, #8fa3c0);
        font-weight:600;
      }
      .cmd-empty {
        padding:30px 18px; text-align:center;
        color:var(--text-muted, #8fa3c0); font-size:.88rem;
      }
      .cmd-empty i { font-size:2rem; opacity:.3; display:block; margin-bottom:6px; }

      .cmd-footer {
        display:flex; align-items:center; gap:14px;
        padding:10px 18px; border-top:1px solid var(--border, rgba(var(--fg-rgb), .08));
        font-size:.74rem; color:var(--text-muted, #8fa3c0);
      }
      .cmd-footer-key {
        display:inline-flex; align-items:center; gap:4px;
      }
      .cmd-footer-key span {
        background:rgba(var(--bg-rgb, 8,24,48),.6);
        border:1px solid var(--border, rgba(var(--fg-rgb), .1));
        border-radius:4px; padding:1px 6px; font-family:'Consolas', monospace;
        font-weight:700;
      }
    `;
    document.head.appendChild(s);
  }

  /* ── Commands Registry ── */
  // المصدر الأساسي: LAYOUT_CONFIG.nav من Admin/Layout.js
  function buildCommands() {
    const cmds = [];

    /* Navigation commands */
    const config = window.LAYOUT_CONFIG || (typeof LAYOUT_CONFIG !== 'undefined' ? LAYOUT_CONFIG : null);
    if (config?.nav) {
      const flatten = (items, parentLabel) => {
        items.forEach(item => {
          if (item.children) {
            flatten(item.children, item.label);
          } else {
            cmds.push({
              id: item.id,
              type: 'nav',
              title: item.label,
              desc: parentLabel ? `الانتقال إلى ${parentLabel} / ${item.label}` : `الانتقال إلى ${item.label}`,
              icon: item.icon,
              action: () => window.navigate?.(item.id),
              keywords: [item.label, item.id].join(' ').toLowerCase()
            });
          }
        });
      };
      flatten(config.nav);
    }

    /* Quick actions */
    cmds.push(
      { id:'action-logout', type:'action', title:'تسجيل الخروج', desc:'إنهاء الجلسة', icon:'ri-logout-box-r-line',
        action: () => window.handleLogout?.(), keywords:'تسجيل خروج logout' },
      { id:'action-reload', type:'action', title:'تحديث الصفحة', desc:'إعادة تحميل البيانات', icon:'ri-refresh-line',
        action: () => location.reload(), keywords:'تحديث reload refresh' }
    );

    return cmds;
  }

  /* ── State ── */
  let _commands = [];
  let _filtered = [];
  let _activeIdx = 0;

  function buildResults(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      _filtered = _commands.slice(0, 12);
    } else {
      _filtered = _commands.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q) ||
        c.keywords.includes(q)
      ).slice(0, 12);
    }
    _activeIdx = 0;
    renderResults();
  }

  function renderResults() {
    const wrap = document.getElementById('cmd-results-list');
    if (!wrap) return;
    if (_filtered.length === 0) {
      wrap.innerHTML = '<div class="cmd-empty"><i class="ri-search-line"></i>لا توجد نتائج</div>';
      return;
    }

    /* Group by type */
    const grouped = {};
    _filtered.forEach(c => {
      if (!grouped[c.type]) grouped[c.type] = [];
      grouped[c.type].push(c);
    });

    const typeLabels = { nav:'التنقل', action:'إجراءات' };

    let html = '';
    let idx = 0;
    Object.entries(grouped).forEach(([type, items]) => {
      html += `<div class="cmd-section-h">${typeLabels[type] || type}</div>`;
      items.forEach(c => {
        html += `
          <div class="cmd-item ${idx === _activeIdx ? 'active' : ''}" data-idx="${idx}">
            <div class="cmd-item-icon"><i class="${c.icon}"></i></div>
            <div class="cmd-item-text">
              <div class="cmd-item-ttl">${c.title}</div>
              <div class="cmd-item-desc">${c.desc}</div>
            </div>
          </div>
        `;
        idx++;
      });
    });

    wrap.innerHTML = html;

    /* attach click handlers */
    wrap.querySelectorAll('.cmd-item').forEach(el => {
      el.addEventListener('click', () => {
        const i = parseInt(el.dataset.idx);
        execute(_filtered[i]);
      });
      el.addEventListener('mouseenter', () => {
        _activeIdx = parseInt(el.dataset.idx);
        wrap.querySelectorAll('.cmd-item').forEach((x,i) =>
          x.classList.toggle('active', i === _activeIdx));
      });
    });
  }

  function execute(cmd) {
    if (!cmd) return;
    close();
    setTimeout(() => cmd.action?.(), 80);
  }

  function open() {
    _commands = buildCommands();
    let mask = document.getElementById('cmd-mask');
    if (!mask) {
      mask = document.createElement('div');
      mask.id = 'cmd-mask';
      mask.innerHTML = `
        <div id="cmd-panel" onclick="event.stopPropagation()">
          <div class="cmd-search">
            <i class="ri-search-line"></i>
            <input id="cmd-input" type="text" placeholder="ابحث أو اكتب أمراً..." autocomplete="off" spellcheck="false"/>
            <span class="cmd-kbd">ESC</span>
          </div>
          <div class="cmd-results" id="cmd-results-list"></div>
          <div class="cmd-footer">
            <span class="cmd-footer-key"><span>↑</span><span>↓</span> للتنقل</span>
            <span class="cmd-footer-key"><span>↵</span> للاختيار</span>
            <span class="cmd-footer-key"><span>esc</span> للإغلاق</span>
          </div>
        </div>
      `;
      mask.addEventListener('click', close);
      document.body.appendChild(mask);
    }
    mask.classList.add('show');
    const input = document.getElementById('cmd-input');
    if (input) {
      input.value = '';
      buildResults('');
      setTimeout(() => input.focus(), 60);
      input.oninput = (e) => buildResults(e.target.value);
    }
  }

  function close() {
    const mask = document.getElementById('cmd-mask');
    if (mask) mask.classList.remove('show');
  }

  /* ── Keyboard handlers ── */
  document.addEventListener('keydown', (e) => {
    /* Open: Ctrl+K or Cmd+K */
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const mask = document.getElementById('cmd-mask');
      if (mask?.classList.contains('show')) close(); else open();
      return;
    }

    /* When open */
    const mask = document.getElementById('cmd-mask');
    if (!mask?.classList.contains('show')) return;

    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      _activeIdx = Math.min(_activeIdx + 1, _filtered.length - 1);
      renderResults();
      scrollActiveIntoView();
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      _activeIdx = Math.max(_activeIdx - 1, 0);
      renderResults();
      scrollActiveIntoView();
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      execute(_filtered[_activeIdx]);
      return;
    }
  });

  function scrollActiveIntoView() {
    const wrap = document.getElementById('cmd-results-list');
    const active = wrap?.querySelector('.cmd-item.active');
    active?.scrollIntoView({ block: 'nearest' });
  }

  /* Expose */
  window.openCommandPalette = open;
  window.closeCommandPalette = close;
})();
