/**
 * themes.js — Professional Theme System
 * ─────────────────────────────────────────────
 * 3 themes احترافية، كل ثيم بـ surface موحد + accent متناسق
 * 2 dark themes (midnight/charcoal) + 1 light theme (pearl)
 */
(function () {
  'use strict';

  window.THEMES = {

    /* ════════════════════════════════════════════
       1. MIDNIGHT — Navy classic
       ════════════════════════════════════════════ */
    midnight: {
      nameAr: 'الليل الأزرق',
      isDark: true,
      previewColors: ['#081830', '#112952', '#4e8df5'],
      vars: {
        '--primary':       '#0D2142',
        '--primary-deep':  '#081830',
        '--card-bg':       '#112952',
        '--card-hover':    '#163366',
        '--bg-rgb':        '8, 24, 48',
        '--light':         '#FFFFFF',
        '--fg-rgb':        '255, 255, 255',
        '--text-muted':    '#8fa3c0',
        '--border':        'rgba(255,255,255,0.08)',
        '--border-hover':  'rgba(255,255,255,0.20)',
        '--surface-tint':  'rgba(255,255,255,0.05)',
        '--hover-tint':    'rgba(255,255,255,0.09)',
        '--accent':        '#4e8df5',
        '--accent-dark':   '#3a7ae0',
        '--accent-rgb':    '78, 141, 245',
        '--success':       '#34c759',
        '--warning':       '#ffcc00',
        '--danger':        '#ff3b30',
        '--gold':          '#f5c842',
      },
    },

    /* ════════════════════════════════════════════
       2. CHARCOAL — Modern minimalist
       ════════════════════════════════════════════ */
    charcoal: {
      nameAr: 'الفحمي العصري',
      isDark: true,
      previewColors: ['#18181d', '#18181d', '#a78bfa'],
      vars: {
        '--primary':       '#18181d',
        '--primary-deep':  '#18181d',
        '--card-bg':       '#18181d',
        '--card-hover':    '#23232b',
        '--bg-rgb':        '24, 24, 29',
        '--light':         '#FFFFFF',
        '--fg-rgb':        '255, 255, 255',
        '--text-muted':    '#9ca0a8',
        '--border':        'rgba(255,255,255,0.07)',
        '--border-hover':  'rgba(255,255,255,0.18)',
        '--surface-tint':  'rgba(255,255,255,0.05)',
        '--hover-tint':    'rgba(255,255,255,0.09)',
        '--accent':        '#a78bfa',
        '--accent-dark':   '#8b5cf6',
        '--accent-rgb':    '167, 139, 250',
        '--success':       '#34c759',
        '--warning':       '#ffcc00',
        '--danger':        '#ff3b30',
        '--gold':          '#f5c842',
      },
    },

    /* ════════════════════════════════════════════
       3. PEARL — Clean white + deep blue
       ════════════════════════════════════════════ */
    pearl: {
      nameAr: 'اللؤلؤي الفاتح',
      isDark: false,
      previewColors: ['#E9EDF5', '#FBFCFF', '#2563eb'],
      vars: {
        '--primary':       '#E9EDF5',   /* canvas رمادي مائل أزرق ناعم */
        '--primary-deep':  '#E1E7F1',
        '--card-bg':       '#FBFCFF',    /* off-white ناعم — مش ناصع */
        '--card-hover':    '#F3F7FE',
        '--bg-rgb':        '233, 237, 245',
        '--light':         '#1e293b',
        '--fg-rgb':        '15, 23, 42',
        '--text-muted':    '#64748b',
        '--border':        'rgba(30,41,59,0.07)',
        '--border-hover':  'rgba(37,99,235,0.26)',
        '--surface-tint':  'rgba(37,99,235,0.045)',
        '--hover-tint':    'rgba(37,99,235,0.075)',
        '--accent':        '#2563eb',
        '--accent-dark':   '#1d4ed8',
        '--accent-rgb':    '37, 99, 235',
        '--success':       '#16a34a',
        '--warning':       '#d97706',
        '--danger':        '#dc2626',
        '--gold':          '#ca8a04',
      },
    },
  };

  /* ────────────────────────────────────────────
     applyTheme(name) — applies all CSS vars
     ──────────────────────────────────────────── */
  window.applyTheme = function (themeName) {
    const theme = window.THEMES[themeName] || window.THEMES.midnight;
    const root  = document.documentElement;
    Object.entries(theme.vars).forEach(([k, v]) => {
      root.style.setProperty(k, v);
    });
    root.setAttribute('data-theme', themeName);
    root.setAttribute('data-mode', theme.isDark ? 'dark' : 'light');
    return theme;
  };
})();
