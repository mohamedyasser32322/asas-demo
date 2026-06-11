/* Scroll Lock — يقفل تمرير الصفحة الخلفية كلما فُتح مودال/overlay فعّال.
   يراقب الـ DOM ويكتشف أي overlay ظاهر يغطّي معظم الشاشة ثم يضيف كلاس
   على <html>/<body> يمنع التمرير. يعمل مع كل المودالات بلا تعديلها. */
(function () {
  'use strict';
  if (window.__scrollLockInit) return;
  window.__scrollLockInit = true;

  const STYLE_ID = 'scroll-lock-style';
  if (!document.getElementById(STYLE_ID)) {
    const s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent = `
      html.__modal-open, body.__modal-open { overflow: hidden !important; }
      html.__modal-open { scrollbar-gutter: stable; }
    `;
    (document.head || document.documentElement).appendChild(s);
  }

  const SEL = [
    '[id*="modal"]','[id*="mask"]','[id*="overlay"]','[id*="popup"]','[id*="drawer"]',
    '[class*="modal"]','[class*="mask"]','[class*="overlay"]','[class*="popup"]','[class*="backdrop"]',
    'dialog'
  ].join(',');

  function isActiveOverlay(el) {
    if (!el || !el.isConnected) return false;
    if (el.getAttribute('aria-hidden') === 'true') return false;
    const cs = getComputedStyle(el);
    if (cs.position !== 'fixed') return false;
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    if (parseFloat(cs.opacity) === 0) return false;
    // overlay غير قابل للتفاعل = مقفول (أُخفي عبر pointer-events أثناء الإغلاق)
    if (cs.pointerEvents === 'none') return false;
    const r = el.getBoundingClientRect();
    // تجاهل العناصر المنزاحة خارج الشاشة (drawer مقفول عبر translateX)
    const intersects = r.bottom > 0 && r.right > 0 &&
                       r.top < window.innerHeight && r.left < window.innerWidth;
    if (!intersects) return false;
    // overlay حقيقي = يغطّي معظم الشاشة وهو ظاهر داخلها
    return r.width >= window.innerWidth * 0.6 && r.height >= window.innerHeight * 0.6;
  }

  function anyOverlayOpen() {
    const nodes = document.querySelectorAll(SEL);
    for (let i = 0; i < nodes.length; i++) {
      if (isActiveOverlay(nodes[i])) return true;
    }
    return false;
  }

  function apply() {
    const locked = anyOverlayOpen();
    document.documentElement.classList.toggle('__modal-open', locked);
    document.body && document.body.classList.toggle('__modal-open', locked);
  }

  let scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; apply(); });
  }

  window.__refreshScrollLock = schedule;

  function start() {
    const obs = new MutationObserver(schedule);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style', 'class', 'open', 'hidden', 'aria-hidden'],
      childList: true,
      subtree: true
    });
    window.addEventListener('resize', schedule, { passive: true });
    // إعادة فحص عند محاولة التمرير لتحرير أي قفل عالق فوراً
    window.addEventListener('touchstart', schedule, { passive: true });
    document.addEventListener('visibilitychange', schedule);
    schedule();
  }

  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
