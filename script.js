/* =============================================
   PH DİZAYN — SCRIPT.JS
============================================= */

(function () {
  'use strict';

  const splash = document.getElementById('splash');
  const navbar = document.getElementById('navbar');
  const burger = document.getElementById('navBurger');
  const navLinks = document.querySelector('.nav-links');

  document.body.style.overflow = 'hidden';

  window.addEventListener('load', function () {
    setTimeout(function () {
      if (splash) {
        splash.classList.add('hidden');

        splash.addEventListener('transitionend', function () {
          splash.remove();
        }, { once: true });
      }

      document.body.style.overflow = '';
    }, 2200);
  });

  function updateNavbar() {
    if (!navbar) return;

    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('active');
      navLinks.classList.toggle('open');

      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        burger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const btnNext = document.getElementById('slideNext');
  const btnPrev = document.getElementById('slidePrev');
  const sliderEl = document.getElementById('slider');

  let currentSlide = 0;
  let sliderTimer = null;
  const SLIDE_INTERVAL = 5000;

  function goToSlide(index) {
    if (!slides.length || !dots.length) return;

    index = ((index % slides.length) + slides.length) % slides.length;

    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    currentSlide = index;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startAutoSlide() {
    stopAutoSlide();

    if (slides.length > 1) {
      sliderTimer = setInterval(nextSlide, SLIDE_INTERVAL);
    }
  }

  function stopAutoSlide() {
    if (sliderTimer) {
      clearInterval(sliderTimer);
      sliderTimer = null;
    }
  }

  if (btnNext) {
    btnNext.addEventListener('click', function () {
      nextSlide();
      startAutoSlide();
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', function () {
      prevSlide();
      startAutoSlide();
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      goToSlide(index);
      startAutoSlide();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      nextSlide();
      startAutoSlide();
    }

    if (e.key === 'ArrowLeft') {
      prevSlide();
      startAutoSlide();
    }
  });

  let touchStartX = 0;

  if (sliderEl) {
    sliderEl.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderEl.addEventListener('touchend', function (e) {
      const diff = touchStartX - e.changedTouches[0].screenX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }

        startAutoSlide();
      }
    }, { passive: true });

    sliderEl.addEventListener('mouseenter', stopAutoSlide);
    sliderEl.addEventListener('mouseleave', startAutoSlide);
  }

  setTimeout(startAutoSlide, 2500);

  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.getAttribute('data-delay') || '0', 10);

          setTimeout(function () {
            el.classList.add('visible');
          }, delay);

          revealObserver.unobserve(el);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  const scrollHint = document.getElementById('scrollHint');
  const productsSection = document.getElementById('products');

  if (scrollHint && productsSection) {
    scrollHint.addEventListener('click', function () {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    });

    scrollHint.style.cursor = 'pointer';
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');

      if (targetId === '#') return;

      const target = document.querySelector(targetId);

      if (target) {
        e.preventDefault();

        const navHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-h') || '72',
          10
        );

        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({
          top: top,
          behavior: 'smooth'
        });
      }
    });
  });

  document.querySelectorAll('.card-image img').forEach(function (img) {
    img.addEventListener('load', function () {
      this.parentElement.classList.remove('img-placeholder');
    });

    img.addEventListener('error', function () {
      this.parentElement.classList.add('img-placeholder');
    });

    if (img.complete && img.naturalWidth === 0) {
      img.parentElement.classList.add('img-placeholder');
    }
  });

  let ticking = false;

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        const scrollY = window.scrollY;

        document.querySelectorAll('.slide.active .slide-bg').forEach(function (bg) {
          bg.style.transform = 'scale(1.05) translateY(' + scrollY * 0.06 + 'px)';
        });

        ticking = false;
      });

      ticking = true;
    }
  }, { passive: true });

})();
