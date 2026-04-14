(function () {
  var gate = document.getElementById('gateOverlay');
  var enterBtn = document.getElementById('gateEnter');
  var body = document.body;

  var drawer = document.getElementById('projectDrawer');
  var drawerMask = document.getElementById('drawerMask');
  var drawerTrigger = document.getElementById('projectTrigger');
  var drawerClose = document.getElementById('drawerClose');

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
    document.querySelectorAll('.click-card[data-url]').forEach(function (card) {
      var url = card.getAttribute('data-url');
      if (!url || url === '#') return;

      card.setAttribute('tabindex', '0');

      card.addEventListener('click', function (e) {
        if (e.target.closest('a, button')) return;
        window.location.href = url;
      });

      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.href = url;
        }
      });
    });
  }

  function dismissGate() {
    if (!gate) return;
    gate.classList.add('is-leaving');
    gate.setAttribute('aria-hidden', 'true');
    body.classList.remove('gate-locked');

    setTimeout(function () {
      gate.classList.add('is-hidden');
    }, 820);
  }

  function openDrawer() {
    if (!drawer || !drawerMask) return;
    drawer.classList.add('is-open');
    drawerMask.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    drawerMask.setAttribute('aria-hidden', 'false');
    body.classList.add('drawer-open');
  }

  function closeDrawer() {
    if (!drawer || !drawerMask) return;
    drawer.classList.remove('is-open');
    drawerMask.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    drawerMask.setAttribute('aria-hidden', 'true');
    body.classList.remove('drawer-open');
  }

  initReveal();
  initClickableCards();

  if (drawerTrigger) {
    drawerTrigger.addEventListener('click', function () {
      if (drawer && drawer.classList.contains('is-open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }

  if (drawerMask) {
    drawerMask.addEventListener('click', closeDrawer);
  }

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeDrawer();
    }
  });

  if (!gate) return;

  body.classList.add('gate-locked');

  if (enterBtn) {
    enterBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      dismissGate();
    });
  }
})();
