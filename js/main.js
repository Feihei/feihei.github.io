/* Homepage language switcher (EN/CN) + slide navigation dots +
   slide-gated card entrance + film grain overlay.
   Language preference persists in localStorage 'preferred-lang'; first visit
   falls back to browser language. Slides use CSS scroll-snap; the dots mirror
   the slides of the active language. */
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function() {
  const enOption = document.getElementById('en-option');
  const cnOption = document.getElementById('cn-option');
  const switchIcon = document.getElementById('switch-icon');
  const enContent = document.getElementById('en-content');
  const cnContent = document.getElementById('cn-content');
  const slidesNav = document.getElementById('slide-nav');

  let slideObserver = null;
  const reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getActiveScroller() {
    return document.querySelector('.content-section.active');
  }

  function getActiveSlides() {
    const scroller = getActiveScroller();
    return scroller ? Array.from(scroller.querySelectorAll('.slide')) : [];
  }

  // Build one dot per slide of the active language; highlight follows scrolling.
  // Also flips .slide-active on slides entering the viewport, so the CSS card
  // entrance runs when the slide is actually seen instead of once on page load.
  function buildDots() {
    if (!slidesNav) return;
    slidesNav.innerHTML = '';
    if (slideObserver) slideObserver.disconnect();

    const slides = getActiveSlides();
    slides.forEach(function(slide, i) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'slide-dot';
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', function() {
        slide.scrollIntoView({ behavior: 'smooth' });
      });
      slidesNav.appendChild(dot);
    });

    if (!slides.length) return;
    if (!('IntersectionObserver' in window)) {
      // Old browsers: no entrance gating, just show everything
      slides.forEach(function(slide) { slide.classList.add('slide-active'); });
      return;
    }
    const dots = slidesNav.querySelectorAll('.slide-dot');
    slideObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('slide-active');
        const idx = slides.indexOf(entry.target);
        dots.forEach(function(dot, i) {
          dot.classList.toggle('active', i === idx);
        });
      });
    }, { root: getActiveScroller(), threshold: 0.6 });
    slides.forEach(function(slide) { slideObserver.observe(slide); });
  }

  /* ---------- Language switching ---------- */

  function applyLanguage(lang) {
    if (lang === 'en') {
      enOption.classList.add('active');
      cnOption.classList.remove('active');
      enContent.classList.add('active');
      cnContent.classList.remove('active');
      switchIcon.classList.add('flipped');
    } else {
      enOption.classList.remove('active');
      cnOption.classList.add('active');
      enContent.classList.remove('active');
      cnContent.classList.add('active');
      switchIcon.classList.remove('flipped');
    }
    document.documentElement.lang = (lang === 'en') ? 'en' : 'zh-CN';
    // Rebuild dots for the new language and start from the intro slide
    const scroller = getActiveScroller();
    if (scroller) scroller.scrollTop = 0;
    buildDots();
  }

  function switchLanguage(lang, persist) {
    // Cross-fade via the View Transition API when available (skipped for
    // reduced-motion users); falls back to an instant switch.
    if (!reduceMotion && document.startViewTransition) {
      document.startViewTransition(function() { applyLanguage(lang); });
    } else {
      applyLanguage(lang);
    }
    if (persist) {
      try { localStorage.setItem('preferred-lang', lang); } catch (e) { /* private mode */ }
    }
  }

  // Initial language: saved preference first, then browser language, default EN
  var savedLang = null;
  try { savedLang = localStorage.getItem('preferred-lang'); } catch (e) { /* private mode */ }
  var initialLang = savedLang ||
    ((navigator.language || '').toLowerCase().indexOf('zh') === 0 ? 'cn' : 'en');
  applyLanguage(initialLang);

  enOption.addEventListener('click', function() {
    switchLanguage('en', true);
  });

  cnOption.addEventListener('click', function() {
    switchLanguage('cn', true);
  });

  // Icon click toggles too
  switchIcon.addEventListener('click', function() {
    if (enOption.classList.contains('active')) {
      switchLanguage('cn', true);
    } else {
      switchLanguage('en', true);
    }
  });

  /* ---------- Film grain overlay ---------- */

  function initFilmGrain() {
    const canvas = document.getElementById('film-grain');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Pre-render one noise tile, then stamp it at a random offset per frame —
    // far cheaper than regenerating full-screen noise every frame.
    const TILE = 160;
    const tile = document.createElement('canvas');
    tile.width = TILE;
    tile.height = TILE;
    const tctx = tile.getContext('2d');
    const noise = tctx.createImageData(TILE, TILE);
    for (let i = 0; i < noise.data.length; i += 4) {
      const v = Math.random() * 255;
      noise.data[i] = v;      // R
      noise.data[i + 1] = v;  // G
      noise.data[i + 2] = v;  // B
      // Sparse grain: most pixels fully transparent, a few faint specks
      noise.data[i + 3] = Math.random() < 0.82 ? 0 : Math.random() * 22;
    }
    tctx.putImageData(noise, 0, 0);

    let pattern = null;
    let glitch = null; // active stray line: { horizontal, pos, life }

    function draw() {
      if (!pattern) return;
      const ox = Math.floor(Math.random() * TILE);
      const oy = Math.floor(Math.random() * TILE);
      ctx.save();
      ctx.translate(-ox, -oy);
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, canvas.width + TILE, canvas.height + TILE);
      ctx.restore();
      // Occasional stray horizontal/vertical lines for the old CRT glitch feel
      if (glitch) {
        ctx.fillStyle = 'rgba(255,255,255,0.22)';
        if (glitch.horizontal) {
          ctx.fillRect(0, glitch.pos, canvas.width, 1);
        } else {
          ctx.fillRect(glitch.pos, 0, 1, canvas.height);
        }
        if (--glitch.life <= 0) glitch = null;
      } else if (Math.random() < 0.02) {
        const horizontal = Math.random() < 0.4;
        glitch = {
          horizontal: horizontal,
          pos: Math.floor(Math.random() *
            (horizontal ? canvas.height : canvas.width)),
          life: 2 + Math.floor(Math.random() * 4)
        };
      }
      // Keep overall opacity low and nearly constant — heavy jitter reads as
      // page flicker; grain stays a faint texture under the glitch lines
      canvas.style.opacity = (0.18 + Math.random() * 0.03).toFixed(3);
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      pattern = ctx.createPattern(tile, 'repeat');
      draw();
    }

    resize();
    window.addEventListener('resize', resize);

    if (reduceMotion) return; // static single frame, no animation

    // Step at ~12fps (not 60) for the chunky old-film judder; pause when hidden
    let last = 0;
    (function loop(ts) {
      if (!document.hidden && ts - last >= 85) {
        last = ts;
        draw();
      }
      requestAnimationFrame(loop);
    })(0);
  }
  initFilmGrain();
});
