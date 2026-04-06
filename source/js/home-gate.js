(function () {
  var gate = document.getElementById('gateOverlay');
  var enterBtn = document.getElementById('gateEnter');
  var body = document.body;
  var sessionKey = 'haicheng-home-gate-v4-seen';
  var touchStartY = null;
  var gateDismissed = false;
  var params = new URLSearchParams(window.location.search);
  var forceGate = params.get('gate') === '1';

  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.14,
      rootMargin: '0px 0px -40px 0px'
    });

    items.forEach(function (item, index) {
      item.style.transitionDelay = Math.min(index * 0.05, 0.24) + 's';
      observer.observe(item);
    });
  }

  function initClickableCards() {
    var cards = document.querySelectorAll('.click-card[data-url]');
    cards.forEach(function (card) {
      var url = card.getAttribute('data-url');
      if (!url || url === '#') return;

      card.setAttribute('tabindex', '0');

      card.addEventListener('click', function (e) {
        if (e.target.closest('a, button')) return;
        window.location.assign(url);
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.assign(url);
        }
      });
    });
  }

  function initNavFallback() {
    document.querySelectorAll('.navlinks a').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href) return;
        if (href === '#') return;
        e.preventDefault();
        window.location.assign(href);
      });
    });
  }

  function hideGateInstantly() {
    if (!gate) return;
    gate.classList.add('is-hidden');
    gate.setAttribute('aria-hidden', 'true');
    body.classList.remove('gate-locked');
  }

  function dismissGate() {
    if (!gate || gateDismissed) return;
    gateDismissed = true;
    gate.classList.add('is-leaving');
    gate.setAttribute('aria-hidden', 'true');
    body.classList.remove('gate-locked');
    sessionStorage.setItem(sessionKey, '1');

    setTimeout(function () {
      gate.classList.add('is-hidden');
    }, 820);
  }

  initReveal();
  initClickableCards();
  initNavFallback();

  if (!gate) return;

  if (!forceGate && sessionStorage.getItem(sessionKey) === '1') {
    hideGateInstantly();
    return;
  }

  body.classList.add('gate-locked');

  if (enterBtn) {
    enterBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      dismissGate();
    });
  }

  gate.addEventListener('click', function () {
    dismissGate();
  });

  window.addEventListener('wheel', function (e) {
    if (!gate || gate.classList.contains('is-hidden')) return;
    if (e.deltaY > 8) dismissGate();
  }, { passive: true });

  window.addEventListener('keydown', function (e) {
    if (!gate || gate.classList.contains('is-hidden')) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
      dismissGate();
    }
  });

  window.addEventListener('touchstart', function (e) {
    if (!gate || gate.classList.contains('is-hidden')) return;
    if (!e.touches || !e.touches.length) return;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', function (e) {
    if (!gate || gate.classList.contains('is-hidden')) return;
    if (touchStartY === null) return;
    if (!e.changedTouches || !e.changedTouches.length) return;

    var endY = e.changedTouches[0].clientY;
    var delta = touchStartY - endY;
    if (delta > 48) dismissGate();
    touchStartY = null;
  }, { passive: true });
})();
