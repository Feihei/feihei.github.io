/* Homepage language switcher (EN/CN) + slide navigation dots.
   Language preference persists in localStorage 'preferred-lang'; first visit falls back to browser language.
   Slides use CSS scroll-snap; the dots mirror the slides of the active language. */
document.addEventListener('DOMContentLoaded', function() {
  const enOption = document.getElementById('en-option');
  const cnOption = document.getElementById('cn-option');
  const switchIcon = document.getElementById('switch-icon');
  const enContent = document.getElementById('en-content');
  const cnContent = document.getElementById('cn-content');
  const slidesNav = document.getElementById('slide-nav');

  let slideObserver = null;

  function getActiveScroller() {
    return document.querySelector('.content-section.active');
  }

  function getActiveSlides() {
    const scroller = getActiveScroller();
    return scroller ? Array.from(scroller.querySelectorAll('.slide')) : [];
  }

  // Build one dot per slide of the active language; highlight follows scrolling
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

    if (!slides.length || !('IntersectionObserver' in window)) return;
    const dots = slidesNav.querySelectorAll('.slide-dot');
    slideObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        const idx = slides.indexOf(entry.target);
        dots.forEach(function(dot, i) {
          dot.classList.toggle('active', i === idx);
        });
      });
    }, { root: getActiveScroller(), threshold: 0.6 });
    slides.forEach(function(slide) { slideObserver.observe(slide); });
  }

  function switchLanguage(lang, persist) {
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
    if (persist) {
      try { localStorage.setItem('preferred-lang', lang); } catch (e) { /* private mode */ }
    }
    // Rebuild dots for the new language and start from the intro slide
    const scroller = getActiveScroller();
    if (scroller) scroller.scrollTop = 0;
    buildDots();
  }

  // Initial language: saved preference first, then browser language, default EN
  var savedLang = null;
  try { savedLang = localStorage.getItem('preferred-lang'); } catch (e) { /* private mode */ }
  var initialLang = savedLang ||
    ((navigator.language || '').toLowerCase().indexOf('zh') === 0 ? 'cn' : 'en');
  switchLanguage(initialLang, false);

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
});
