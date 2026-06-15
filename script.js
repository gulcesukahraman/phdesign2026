/* =============================================
   PH DİZAYN — SCRIPT.JS
   İçerik:
     1. Splash Screen
     2. Navbar Scroll Durumu
     3. Burger Menü (Mobil)
     4. Hero Slider (Otomatik + Manuel)
     5. Scroll Reveal Animasyonu
     6. Smooth Scroll (#products geçişi)
     7. Ürün Kartı Görsel Placeholder Yönetimi
============================================= */

(function () {
  'use strict';

  /* ─────────────────────────────────────────
     1. SPLASH SCREEN
     Sayfa yüklendikten 2 saniye sonra kapanır,
     sonra body scroll açılır.
  ───────────────────────────────────────── */
  const splash = document.getElementById('splash');

  // Body scroll kilitli başlasın
  document.body.style.overflow = 'hidden';

  window.addEventListener('load', function () {
    const minSplashTime = 2200; // ms — splash en az bu kadar açık kalır
    const start = Date.now();

    function hideSplash() {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, minSplashTime - elapsed);

      setTimeout(function () {
        splash.classList.add('hidden');
        document.body.style.overflow = '';

        // Splash tamamen kapandıktan sonra DOM'dan kaldır
        splash.addEventListener('transitionend', function () {
          splash.remove();
        }, { once: true });
      }, remaining);
    }

    hideSplash();
  });


  /* ─────────────────────────────────────────
     2. NAVBAR SCROLL DURUMU
     Sayfa 60px aşağı scroll edilince navbar
     arka planı belirir.
  ───────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();


  /* ─────────────────────────────────────────
     3. BURGER MENÜ (MOBİL)
  ───────────────────────────────────────── */
  const burger = document.getElementById('navBurger');
  const navLinks = document.querySelector('.nav-links');

  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('active');
      navLinks.classList.toggle('open');
      // Menü açıkken body scroll kilitle
      document.body.style.overflow =
        navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Menü linkine tıklayınca kapat
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        burger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }


  /* ─────────────────────────────────────────
     4. HERO SLIDER
     - Otomatik: 5 saniyede bir ilerler
     - Manuel: ok butonları ve dot'larla
     - Her slide geçişinde animasyon sıfırlanır
  ───────────────────────────────────────── */
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let sliderTimer  = null;
  const SLIDE_INTERVAL = 5000; // ms

  function goToSlide(index) {
    // Sınır kontrolü
    index = ((index % slides.length) + slides.length) % slides.length;

    // Mevcut slide'ı devre dışı bırak
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    // Yeni slide'ı etkinleştir
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() { goToSlide(currentSlide + 1); }
  function prevSlide() { goToSlide(currentSlide - 1); }

  function startAutoSlide() {
    stopAutoSlide();
    sliderTimer = setInterval(nextSlide, SLIDE_INTERVAL);
  }

  function stopAutoSlide() {
    if (sliderTimer) {
      clearInterval(sliderTimer);
      sliderTimer = null;
    }
  }

  // Ok butonları
  const btnNext = document.getElementById('slideNext');
  const btnPrev = document.getElementById('slidePrev');

  if (btnNext) {
    btnNext.addEventListener('click', function () {
      nextSlide();
      startAutoSlide(); // Tıklamadan sonra sayacı sıfırla
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', function () {
      prevSlide();
      startAutoSlide();
    });
  }

  // Dot butonları
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      goToSlide(i);
      startAutoSlide();
    });
  });

  // Klavye navigasyonu (erişilebilirlik)
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { nextSlide(); startAutoSlide(); }
    if (e.key === 'ArrowLeft')  { prevSlide(); startAutoSlide(); }
  });

  // Touch/swipe desteği
  let touchStartX = 0;
  const sliderEl = document.getElementById('slider');

  if (sliderEl) {
    sliderEl.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderEl.addEventListener('touchend', function (e) {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
        startAutoSlide();
      }
    }, { passive: true });

    // Slider üzerine gelince otomatik durdur
    sliderEl.addEventListener('mouseenter', stopAutoSlide);
    sliderEl.addEventListener('mouseleave', startAutoSlide);
  }

  // Otoplay başlat (splash bittikten sonra)
  setTimeout(startAutoSlide, 2500);


  /* ─────────────────────────────────────────
     5. SCROLL REVEAL ANİMASYONU
     .reveal class'ına sahip elementler
     viewport'a girince .visible class alır.
  ───────────────────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseInt(el.getAttribute('data-delay') || '0', 10);

        setTimeout(function () {
          el.classList.add('visible');
        }, delay);

        // Bir kez göster, tekrar izleme
        revealObserver.unobserve(el);
      }
    });
  }, {
    threshold:  0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });


  /* ─────────────────────────────────────────
     6. SMOOTH SCROLL — #products GEÇİŞİ
     Slider'daki scroll-hint tıklanınca
     products bölümüne scroll edilir.
  ───────────────────────────────────────── */
  const scrollHint = document.getElementById('scrollHint');
  const productsSection = document.getElementById('products');

  if (scrollHint && productsSection) {
    scrollHint.addEventListener('click', function () {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    });
    scrollHint.style.cursor = 'pointer';
  }

  // Navbar linkleri için smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '72'
        );
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ─────────────────────────────────────────
     7. ÜRÜN KARTI GÖRSEL PLACEHOLDER YÖNETİMİ
     Görsel yüklenemezse placeholder görünür.
     Görsel yüklenince placeholder gizlenir.
  ───────────────────────────────────────── */
  document.querySelectorAll('.card-image img').forEach(function (img) {
    // Görsel yüklenince placeholder'ı gizle
    img.addEventListener('load', function () {
      this.parentElement.classList.remove('img-placeholder');
    });

    // Görsel yüklenemezse placeholder'ı göster
    img.addEventListener('error', function () {
      this.parentElement.classList.add('img-placeholder');
    });

    // Sayfa yüklendiğinde zaten hata durumunda olanları yakala
    if (img.complete && img.naturalWidth === 0) {
      img.parentElement.classList.add('img-placeholder');
    }
  });


  /* ─────────────────────────────────────────
     YARDIMCI: Parallax hissi (isteğe bağlı)
     Slider arka planlarına hafif parallax.
     Performans için requestAnimationFrame kullanır.
  ───────────────────────────────────────── */
  let ticking = false;

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        const scrollY = window.scrollY;

        // Slider bölümü görünürse parallax uygula
        document.querySelectorAll('.slide-bg').forEach(function (bg) {
          // Çok hızlı kayma için düşük katsayı (0.15)
          bg.style.transform = 'scale(1.05) translateY(' + (scrollY * 0.08) + 'px)';
        });

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

})();
