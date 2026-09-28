/* Homepage language switcher (EN/CN).
   Preference persists in localStorage 'preferred-lang'; first visit falls back to browser language. */
document.addEventListener('DOMContentLoaded', function() {
  const enOption = document.getElementById('en-option');
  const cnOption = document.getElementById('cn-option');
  const switchIcon = document.getElementById('switch-icon');
  const enContent = document.getElementById('en-content');
  const cnContent = document.getElementById('cn-content');

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
