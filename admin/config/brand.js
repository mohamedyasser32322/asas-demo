/**
 * brand.js — يُحمَّل بعد themes.js في كل صفحة
 * ─────────────────────────────────────────────
 * 1. يطبق Theme افتراضي فوراً (midnight) لمنع flash
 * 2. يجلب إعدادات الشركة من /api/Brand
 * 3. يطبق Theme المختار + Logo + اسم الشركة + Favicon
 * 4. لو النظام مش معد → redirect لـ /setup/
 */
(function () {
  'use strict';

  /* ─── Currency helpers (تُقرأ رمز/لغة العملة من بيانات الشركة) ─── */
  window.CUR       = function () { return (window.BRAND && window.BRAND.currency && window.BRAND.currency.symbol) || 'ر.س'; };
  window.CURLOCALE = function () { return (window.BRAND && window.BRAND.currency && window.BRAND.currency.locale) || 'en-US'; };
  // رقم مُنسَّق + رمز العملة. يرجّع '—' للقيم الفارغة.
  window.fmtMoney  = function (n) {
    if (n === null || n === undefined || n === '') return '—';
    const num = Number(n);
    if (isNaN(num)) return '—';
    return num.toLocaleString(window.CURLOCALE()) + ' ' + window.CUR();
  };

  /* ─── WhatsApp helpers (رقم الشركة من الهوية) ─── */
  window.WA_NUMBER = function () { return (window.BRAND && window.BRAND.whatsappNumber) || ''; };
  window.WA_LINK   = function (text) {
    const n = window.WA_NUMBER();
    return n ? ('https://wa.me/' + n + (text ? '?text=' + encodeURIComponent(text) : '')) : '';
  };

  const SETUP   = '/setup/';
  const isSetup = window.location.pathname.startsWith(SETUP);
  const isRoot  = window.location.pathname === '/' || window.location.pathname === '/index.html';

  /* ─── إخفاء الصفحة حتى تُطبَّق الهوية (يمنع flash) ─── */
  const preload = document.createElement('style');
  preload.id = 'brand-preload';
  preload.textContent = 'body{visibility:hidden!important;transition:none!important}';
  document.head.appendChild(preload);

  /* ─── تطبيق ثيم محفوظ/افتراضي فوراً (يمنع flash واختلاف الخلفية بين الصفحات) ─── */
  if (window.applyTheme) window.applyTheme(localStorage.getItem('asas_theme') || 'midnight');

  /* ─── Helper: set favicon ─── */
  function setFavicon(href, mime) {
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.type = mime;
    favicon.href = href;
  }

  /* ─── Fallback SVG favicon (clean letter avatar with accent bg) ─── */
  function setFallbackFavicon(companyName) {
    const letter = ((companyName || 'A').trim()[0] || 'A').toUpperCase();
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#4e8df5';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
      <rect width="64" height="64" rx="14" fill="${accent}"/>
      <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="system-ui, -apple-system, 'Segoe UI', Tajawal, sans-serif"
        font-size="34" font-weight="800" fill="white">${letter}</text>
    </svg>`;
    const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    setFavicon(dataUrl, 'image/svg+xml');
  }

  /* ─── تطبيق Logo + Favicon ─── */
  function applyLogo(logoUrl, companyName) {
    if (!logoUrl) {
      /* No logo uploaded — show a clean SVG letter avatar instead of browser default globe */
      setFallbackFavicon(companyName);
      return;
    }

    /* عناصر مخصصة بـ ID للـ login و headers اللي بتستخدم placeholder */
    const logoMark = document.getElementById('logoMark');
    if (logoMark) {
      logoMark.innerHTML = `<img src="${logoUrl}" alt="${companyName || 'logo'}" style="max-height:48px;max-width:160px;object-fit:contain;">`;
    }

    /* أي img بكلاس brand-logo-img */
    document.querySelectorAll('.brand-logo-img').forEach(el => {
      el.src = logoUrl;
      el.alt = companyName || 'logo';
    });

    /* favicon ديناميك من اللوجو */
    const ext = logoUrl.split('.').pop().toLowerCase();
    const mimeMap = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', svg: 'image/svg+xml', webp: 'image/webp' };
    const mime = mimeMap[ext] || 'image/png';
    setFavicon(logoUrl, mime);
  }

  /* ─── تطبيق اسم الشركة في كل العناصر ─── */
  function applyName(name) {
    if (!name) return;
    document.title = name;

    const logoName = document.getElementById('logoName');
    if (logoName) logoName.textContent = name;

    document.querySelectorAll('.brand-name').forEach(el => {
      el.textContent = name;
    });
  }

  /* ─── التطبيق الكامل للهوية ─── */
  function applyBrand(cfg) {
    window.BRAND = cfg;
    if (!cfg || !cfg.configured) return;

    if (window.applyTheme) window.applyTheme(cfg.themeName || 'midnight');
    try { localStorage.setItem('asas_theme', cfg.themeName || 'midnight'); } catch {}
    applyName(cfg.companyName);
    applyLogo(cfg.logoUrl, cfg.companyName);
  }

  function show() {
    document.getElementById('brand-preload')?.remove();
    document.dispatchEvent(new Event('brandLoaded'));
  }

  /* ─── جلب إعدادات الهوية من الـ API ─── */
  window.brandReady = fetch('/api/Brand')
    .then(r => r.json())
    .then(cfg => {
      applyBrand(cfg);

      if (cfg.configured && isSetup) {
        window.location.href = '/Admin/';
        return cfg;
      }
      if (!cfg.configured && !isSetup && !isRoot) {
        window.location.href = SETUP;
        return cfg;
      }

      show();
      /* DOMContentLoaded قد يكون عدى — عيد تطبيق اللوجو */
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          if (cfg.configured) {
            applyLogo(cfg.logoUrl, cfg.companyName);
            applyName(cfg.companyName);
          }
        });
      } else if (cfg.configured) {
        applyLogo(cfg.logoUrl, cfg.companyName);
        applyName(cfg.companyName);
      }
      return cfg;
    })
    .catch(() => {
      window.BRAND = { configured: false };
      if (!isSetup && !isRoot) {
        window.location.href = SETUP;
      } else {
        show();
      }
      return window.BRAND;
    });

  /* ─── تزامن الهوية/الثيم لحظياً عبر كل الداشبوردز ─── */
  // (1) تغيير الـ Brand من جهاز/مستخدم آخر (عبر SignalR) → أعد جلب الهوية وطبّقها فوراً
  window.addEventListener('asas:entityChanged', (e) => {
    const ent = ((e.detail && e.detail.entity) || '').toLowerCase();
    if (ent !== 'brand') return;
    fetch('/api/Brand')
      .then(r => r.ok ? r.json() : null)
      .then(cfg => { if (cfg) applyBrand(cfg); })
      .catch(() => {});
  });
  // (2) تغيير الثيم في تبويب آخر بنفس المتصفح → طبّقه فوراً (storage event)
  window.addEventListener('storage', (e) => {
    if (e.key === 'asas_theme' && e.newValue && window.applyTheme) {
      window.applyTheme(e.newValue);
      if (window.BRAND) window.BRAND.themeName = e.newValue;
    }
  });
})();
