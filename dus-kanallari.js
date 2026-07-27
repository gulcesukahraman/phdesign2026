/* =============================================
   DUŞ KANALLARI — dus-kanallari.js
   Sadece dus-kanallari.html sayfasına özgü slider mantığı.
   PREMIUM & SMARTLINE hero slider'ı yönetir.
   Ana script.js (splash, navbar, reveal) ile paralel çalışır.
============================================= */
(function () {
  'use strict';

  /* ─── DK SLIDER ────────────────────────────
     4 saniyede bir otomatik geçiş.
     Manuel: ok butonları + dot'lar + swipe.
  ─────────────────────────────────────────── */
  const slides   = document.querySelectorAll('.dk-slide');
  const dots     = document.querySelectorAll('.dk-dot');
  const btnPrev  = document.getElementById('dkPrev');
  const btnNext  = document.getElementById('dkNext');

  if (!slides.length) return; // Bu sayfa değilse dur

  const INTERVAL = 4000;
  let current = 0;
  let timer   = null;

  function goTo(index) {
    index = ((index % slides.length) + slides.length) % slides.length;
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    stopAuto();
    timer = setInterval(next, INTERVAL);
  }

  function stopAuto() {
    clearInterval(timer);
    timer = null;
  }

  // Ok butonları
  if (btnNext) btnNext.addEventListener('click', function () { next(); startAuto(); });
  if (btnPrev) btnPrev.addEventListener('click', function () { prev(); startAuto(); });

  // Dot butonları
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { goTo(i); startAuto(); });
  });

  // Klavye
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { next(); startAuto(); }
    if (e.key === 'ArrowLeft')  { prev(); startAuto(); }
  });

  // Touch/swipe
  const sliderEl = document.getElementById('dk-slider');
  let touchStartX = 0;
  if (sliderEl) {
    sliderEl.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    sliderEl.addEventListener('touchend', function (e) {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) next(); else prev();
        startAuto();
      }
    }, { passive: true });
    sliderEl.addEventListener('mouseenter', stopAuto);
    sliderEl.addEventListener('mouseleave', startAuto);
  }

  // Splash bittikten sonra otomatik başlat
  setTimeout(startAuto, 2500);

  /* ─── CTA SMOOTH SCROLL ─────────────────────
     "Seriyi İncele" butonları tıklanınca ilgili
     seri satırına smooth scroll + navbar offset.
  ─────────────────────────────────────────── */
  document.querySelectorAll('.dk-slide-cta').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navH = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '72'
        );
        const extraOffset = 24; // seri başlığı üstünde biraz nefes
        const top = target.getBoundingClientRect().top + window.scrollY - navH - extraOffset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── SERİ SATIRI ANCHOR SCROLL ────────────
     dk-row linkleri (#premium, #smartline vb.)
     tıklanınca navbar altına smooth scroll.
  ─────────────────────────────────────────── */
  document.querySelectorAll('.dk-row').forEach(function (row) {
    row.addEventListener('click', function (e) {
      // Sadece aynı sayfa içi anchor'lar için
      const href = this.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      // Sayfadaki #id'ye scroll et (navbar offset dahil)
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '72'
        );
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 24;
        window.scrollTo({ top, behavior: 'smooth' });
        history.replaceState(null, '', href);
      }
    });
  });

})();
