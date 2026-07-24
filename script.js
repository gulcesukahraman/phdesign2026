/* ============================================================
   PH DİZAYN — main.js  v2
   Cursor · Nav · Slider · Reveal · Tilt · Sticky tabs
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     CUSTOM CURSOR
  ───────────────────────────────────────── */
  const cur  = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');

  if (cur && ring) {
    let mx=0, my=0, rx=0, ry=0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx+'px'; cur.style.top = my+'px';
    });
    (function tick(){
      rx += (mx-rx)*0.11; ry += (my-ry)*0.11;
      ring.style.left = rx+'px'; ring.style.top = ry+'px';
      requestAnimationFrame(tick);
    })();
    document.querySelectorAll('a,button,.prod-card,.siphon-card,.tech-cell,.proj-cell,.slider-arrow')
      .forEach(el => {
        el.addEventListener('mouseenter', () => { cur.classList.add('big'); ring.classList.add('big'); });
        el.addEventListener('mouseleave', () => { cur.classList.remove('big'); ring.classList.remove('big'); });
      });
  }

  /* ─────────────────────────────────────────
     PROGRESS BAR
  ───────────────────────────────────────── */
  const pbar = document.getElementById('progressBar');
  if (pbar) {
    window.addEventListener('scroll', () => {
      const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
      pbar.style.width = pct + '%';
    }, { passive:true });
  }

  /* ─────────────────────────────────────────
     NAV SCROLL STATE
  ───────────────────────────────────────── */
  const nav = document.getElementById('mainNav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
  }

  /* ─────────────────────────────────────────
     MOBILE NAV BURGER
  ───────────────────────────────────────── */
  const burger   = document.getElementById('navBurger');
  const mobileNav = document.getElementById('mobileNav');
  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
    // close on link click
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
  }

  /* ─────────────────────────────────────────
     SMOOTH ANCHOR LINKS
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH - 4;
        window.scrollTo({ top, behavior:'smooth' });
      }
    });
  });

  /* ─────────────────────────────────────────
     HERO SLIDER
  ───────────────────────────────────────── */
  const slides   = document.querySelectorAll('.slide');
  const dots     = document.querySelectorAll('.slider-dot');
  const counter  = document.getElementById('sliderCounter');
  const progressEl = document.getElementById('slideProgress');
  let current    = 0;
  let autoTimer  = null;
  const INTERVAL = 5000;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
    if (counter) counter.textContent = String(current+1).padStart(2,'0') + ' / ' + String(slides.length).padStart(2,'0');
    // restart progress bar animation
    if (progressEl) {
      progressEl.style.animation = 'none';
      progressEl.offsetHeight; // reflow
      progressEl.style.animation = '';
    }
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current+1), INTERVAL);
  }

  if (slides.length) {
    goTo(0);
    startAuto();

    document.getElementById('sliderPrev')?.addEventListener('click', () => { goTo(current-1); startAuto(); });
    document.getElementById('sliderNext')?.addEventListener('click', () => { goTo(current+1); startAuto(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goTo(i); startAuto(); });
    });

    // Swipe
    let tx=0;
    const hero = document.querySelector('.hero-slider');
    if (hero) {
      hero.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, {passive:true});
      hero.addEventListener('touchend',   e => {
        const dx = e.changedTouches[0].clientX - tx;
        if (Math.abs(dx) > 40) { goTo(dx < 0 ? current+1 : current-1); startAuto(); }
      }, {passive:true});
    }
  }

  /* ─────────────────────────────────────────
     SCROLL REVEAL
  ───────────────────────────────────────── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold:0.1, rootMargin:'0px 0px -40px 0px' });

  document.querySelectorAll('.reveal,.reveal-l,.reveal-r')
    .forEach(el => revealObs.observe(el));

  /* ─────────────────────────────────────────
     SCENE NAV DOTS (right side)
  ───────────────────────────────────────── */
  const sceneDots  = document.querySelectorAll('.snav-dot');
  const sectionIds = ['hero','channels','floor-drains','siphons','technology','contact'];

  sceneDots.forEach(d => {
    d.addEventListener('click', () => {
      const el = document.getElementById(d.dataset.target);
      if (el) el.scrollIntoView({ behavior:'smooth' });
    });
  });

  if (sceneDots.length) {
    const sectionObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const idx = sectionIds.indexOf(e.target.id);
          sceneDots.forEach((d,i) => d.classList.toggle('active', i === idx));
        }
      });
    }, { threshold:0.3 });

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) sectionObs.observe(el);
    });
  }

  /* ─────────────────────────────────────────
     STICKY CATEGORY TABS
     Scroll to section when tab clicked
  ───────────────────────────────────────── */
  const stickyTabs = document.querySelectorAll('.sticky-tab');
  stickyTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      stickyTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = document.querySelector(tab.dataset.target);
      if (target) {
        const navH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
        const stickyH = document.querySelector('.sticky-cat')?.offsetHeight || 44;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - stickyH - 8;
        window.scrollTo({ top, behavior:'smooth' });
      }
    });
  });

  // Highlight tab on scroll
  if (stickyTabs.length) {
    const channelSections = document.querySelectorAll('.channel-block');
    const tabObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id;
          stickyTabs.forEach(t => t.classList.toggle('active', t.dataset.target === '#'+id));
        }
      });
    }, { threshold:0.35, rootMargin:'-80px 0px -50% 0px' });
    channelSections.forEach(s => tabObs.observe(s));
  }

  /* ─────────────────────────────────────────
     PRODUCT CARD 3D TILT
  ───────────────────────────────────────── */
  document.querySelectorAll('.prod-card, .siphon-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x*5}deg) rotateX(${-y*3.5}deg) scale(1.012)`;
      card.style.transition = 'box-shadow .4s, transform .05s';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'box-shadow .4s, transform .55s cubic-bezier(0.16,1,0.3,1)';
    });
  });

  /* ─────────────────────────────────────────
     FINISH DOT SWITCHER
  ───────────────────────────────────────── */
  document.querySelectorAll('.prod-card, .featured-hero').forEach(card => {
    const dots = card.querySelectorAll('.fdot');
    const svg  = card.querySelector('.prod-svg');
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        dots.forEach(d => { d.style.outline=''; d.style.outlineOffset=''; });
        dot.style.outline      = '2px solid var(--gold)';
        dot.style.outlineOffset = '2px';
        if (!svg) return;
        if      (dot.classList.contains('steel')) svg.style.filter = 'none';
        else if (dot.classList.contains('black')) svg.style.filter = 'grayscale(1) brightness(.28)';
        else if (dot.classList.contains('gold'))  svg.style.filter = 'sepia(1) saturate(2.2) hue-rotate(-8deg) brightness(.88)';
      });
    });
  });

  /* ─────────────────────────────────────────
     HERO PARALLAX (subtle)
  ───────────────────────────────────────── */
  const heroBg = document.querySelector('.hero-slider');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < window.innerHeight) {
        heroBg.style.transform = `translateY(${window.scrollY * 0.12}px)`;
      }
    }, { passive:true });
  }

});
