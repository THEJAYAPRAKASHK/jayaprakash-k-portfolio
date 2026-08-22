/* =========================================================
   JAYAPRAKASH K — PERSONAL WEBSITE
   script.js — all interactivity. No frameworks, no dependencies.
   Organised by feature so any block can be edited independently.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------
     1. LOADING ANIMATION
  ----------------------------------------------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('is-hidden'), 350);
  });
  setTimeout(() => loader && loader.classList.add('is-hidden'), 2200);


  /* -----------------------------------------------------
     2. STICKY NAV — border on scroll + hide on scroll-down
  ----------------------------------------------------- */
  const nav = document.getElementById('siteNav');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 12);
    if (y > lastScrollY && y > 300) nav.classList.add('is-hidden');
    else nav.classList.remove('is-hidden');
    lastScrollY = y;
  }, { passive: true });


  /* -----------------------------------------------------
     3. MOBILE MENU
  ----------------------------------------------------- */
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });


  /* -----------------------------------------------------
     4. ACTIVE NAV LINK + ASCENT RAIL PROGRESS
  ----------------------------------------------------- */
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navAnchors = Array.from(document.querySelectorAll('.nav__links a'));
  const ascentFill = document.getElementById('ascentFill');

  function updateScrollProgress() {
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    let currentId = sections[0] && sections[0].id;
    for (const sec of sections) {
      if (sec.offsetTop <= scrollPos) currentId = sec.id;
    }
    navAnchors.forEach(a => {
      const active = a.getAttribute('href') === '#' + currentId;
      a.classList.toggle('is-active', active);
      if (active) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    if (ascentFill) ascentFill.style.height = Math.min(100, Math.max(0, progress)) + '%';
  }
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();


  /* -----------------------------------------------------
     4b. GRID STAGGER — cascading fade/slide for card grids
     Marks each direct child of a grid as revealable and gives it an
     incremental delay, so groups of cards animate in as a wave
     rather than all at once. Purely additive — safe to extend by
     adding more selectors to the list below.
  ----------------------------------------------------- */
  const staggerGrids = document.querySelectorAll(
    '.skill-grid, .values-grid, .project-grid, .volunteer-grid, ' +
    '.achievement-strip, .interest-grid, .goals__grid'
  );
  staggerGrids.forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      child.classList.add('reveal');
      child.style.transitionDelay = Math.min(i * 70, 420) + 'ms';
    });
  });


  /* -----------------------------------------------------
     4c. HERO PARALLAX — subtle background drift on scroll.
     Skipped entirely when the user prefers reduced motion.
  ----------------------------------------------------- */
  const heroBg = document.querySelector('.hero__bg');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroBg && !prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        heroBg.style.transform = `translateY(${y * 0.12}px)`;
      }
    }, { passive: true });
  }


  /* -----------------------------------------------------
     5. SCROLL REVEAL ANIMATIONS
  ----------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));


  /* -----------------------------------------------------
     6. DARK MODE TOGGLE (persisted)
  ----------------------------------------------------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  if (localStorage.getItem('jk-theme') === 'dark') root.setAttribute('data-theme', 'dark');

  themeToggle.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) { root.removeAttribute('data-theme'); localStorage.setItem('jk-theme', 'light'); }
    else { root.setAttribute('data-theme', 'dark'); localStorage.setItem('jk-theme', 'dark'); }
  });


  /* -----------------------------------------------------
     7. SEARCH BAR
  ----------------------------------------------------- */
  const searchToggle = document.getElementById('searchToggle');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const searchClose = document.getElementById('searchClose');

  const searchIndex = sections.map(sec => {
    const title = sec.querySelector('.section-title, .hero__name');
    const label = title ? title.textContent.trim().replace(/\s+/g, ' ') : sec.id;
    return { id: sec.id, label };
  });

  function openSearch() { searchOverlay.classList.add('is-open'); setTimeout(() => searchInput.focus(), 100); }
  function closeSearch() { searchOverlay.classList.remove('is-open'); searchInput.value = ''; searchResults.innerHTML = ''; }

  searchToggle.addEventListener('click', openSearch);
  searchClose.addEventListener('click', closeSearch);
  searchOverlay.addEventListener('click', (e) => { if (e.target === searchOverlay) closeSearch(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault(); openSearch();
    }
    if (e.key === 'Escape') { closeSearch(); closeLightbox(); }
  });

  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    searchResults.innerHTML = '';
    if (!q) return;
    const matches = searchIndex.filter(item => item.label.toLowerCase().includes(q) || item.id.toLowerCase().includes(q));
    matches.forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + item.id;
      a.textContent = item.label;
      a.addEventListener('click', closeSearch);
      li.appendChild(a);
      searchResults.appendChild(li);
    });
    if (matches.length === 0) {
      const li = document.createElement('li');
      li.innerHTML = '<a href="#" style="pointer-events:none;opacity:.5;">No matching section</a>';
      searchResults.appendChild(li);
    }
  });


  /* -----------------------------------------------------
     8. BACK TO TOP
  ----------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('is-visible', window.scrollY > 600);
  }, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


  /* -----------------------------------------------------
     8b. EMAIL PICKER — any "email" trigger asks which
     address to use (Personal / Professional) before opening.
     Reused for the Contact section's social row icon and the
     floating Contact button.
  ----------------------------------------------------- */
  function setupEmailPicker(btnId, menuId) {
    const btn = document.getElementById(btnId);
    const menu = document.getElementById(menuId);
    if (!btn || !menu) return;
    function closeEmailMenu() {
      menu.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = menu.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && e.target !== btn && !btn.contains(e.target)) closeEmailMenu();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeEmailMenu(); });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeEmailMenu));
  }
  setupEmailPicker('socialEmailBtn', 'socialEmailMenu');
  setupEmailPicker('fabContact', 'fabEmailMenu');


  /* -----------------------------------------------------
     10. LIGHTBOX — click-to-enlarge for certificates & gallery
  ----------------------------------------------------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, caption) {
    lightboxImg.src = src;
    lightboxImg.alt = caption || 'Enlarged preview';
    lightboxCaption.textContent = caption || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  window.closeLightbox = function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-lightbox]').forEach(el => {
    el.addEventListener('click', (e) => {
      // Skip triggering when the underlying image failed to load (placeholder state)
      const imgWrap = el.querySelector('.cert-card__img, img');
      const failed = imgWrap && imgWrap.classList && imgWrap.classList.contains('img-fallback');
      if (failed || el.classList.contains('img-fallback')) return;
      e.preventDefault();
      openLightbox(el.getAttribute('data-lightbox'), el.getAttribute('data-title') || '');
    });
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });


  /* -----------------------------------------------------
     12. QR BIO — real, scannable QR code + PNG download
     Uses the QRCode.js library loaded in index.html. If that
     library fails to load (e.g. offline), falls back to a
     simple placeholder pattern so the layout never breaks.
  ----------------------------------------------------- */
  const qrBox = document.getElementById('qrBox');
  const qrDownloadBtn = document.getElementById('qrDownloadBtn');
  const siteUrl = (window.location && window.location.href) ? window.location.href.split('#')[0] : '';

  if (qrBox && siteUrl) {
    if (typeof QRCode !== 'undefined') {
      new QRCode(qrBox, {
        text: siteUrl,
        width: 130,
        height: 130,
        colorDark: '#0D1F3C',
        colorLight: '#FFFFFF',
        correctLevel: QRCode.CorrectLevel.M
      });
    } else {
      renderSimpleQR(qrBox, siteUrl);
    }
  }

  if (qrDownloadBtn) {
    qrDownloadBtn.addEventListener('click', () => {
      const canvas = qrBox.querySelector('canvas');
      const img = qrBox.querySelector('img');
      const source = canvas || img;
      if (!source) return;

      const link = document.createElement('a');
      link.download = 'Jayaprakash-K-QR-Code.png';
      if (canvas) {
        link.href = canvas.toDataURL('image/png');
      } else {
        // img fallback (QRCode.js sometimes renders <img> after <canvas> is hidden)
        link.href = img.src;
      }
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  }


  /* -----------------------------------------------------
     14. FOOTER YEAR
  ----------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* -----------------------------------------------------
     15. MAGNETIC BUTTONS — subtle cursor-follow effect on
     primary/ghost buttons and the contact FAB, desktop only.
  ----------------------------------------------------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion) {
    document.querySelectorAll('.btn, .fab-contact').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }


  /* -----------------------------------------------------
     16. CONTACT DETAILS LOCK — password gate for the
     contact info block. Client-side only: a privacy
     speed-bump against casual scraping/bots, not real
     security (view-source still shows the details).
  ----------------------------------------------------- */
  const contactDetails = document.getElementById('contactDetails');
  const contactLockBtn = document.getElementById('contactLockBtn');
  const contactLockInput = document.getElementById('contactLockInput');
  const contactLockError = document.getElementById('contactLockError');
  const CONTACT_PASSWORD = 'victory';

  // Some browsers (file:// previews, in-app viewers) block sessionStorage
  // and throw instead of just failing quietly — never let that stop the
  // unlock button itself from being wired up.
  function safeSessionGet(key) {
    try { return sessionStorage.getItem(key); } catch (err) { return null; }
  }
  function safeSessionSet(key, value) {
    try { sessionStorage.setItem(key, value); } catch (err) { /* ignore */ }
  }

  if (contactDetails && contactLockBtn && contactLockInput) {
    if (safeSessionGet('contactUnlocked') === 'true') {
      contactDetails.classList.remove('contact__details--locked');
    }

    function tryUnlockContact() {
      const entered = contactLockInput.value.trim().toLowerCase();
      if (entered === CONTACT_PASSWORD) {
        contactDetails.classList.remove('contact__details--locked');
        if (contactLockError) contactLockError.textContent = '';
        safeSessionSet('contactUnlocked', 'true');
      } else {
        if (contactLockError) contactLockError.textContent = 'Incorrect password. Please try again.';
        contactLockInput.value = '';
        contactLockInput.focus();
      }
    }

    // No <form> involved on purpose — a plain button click and an
    // Enter keypress, so there is nothing for a restrictive webview
    // to intercept as a page navigation.
    contactLockBtn.addEventListener('click', tryUnlockContact);
    contactLockInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        tryUnlockContact();
      }
    });
  }

});


/* =========================================================
   FALLBACK QR RENDERER
   Used only if the QRCode.js library (loaded from cdnjs) fails
   to load, e.g. no internet connection. Not a real scannable
   code — purely a visual placeholder so the layout still works.
   ========================================================= */
function renderSimpleQR(container, text) {
  const size = 21;
  let seed = 0;
  for (let i = 0; i < text.length; i++) seed = (seed * 31 + text.charCodeAt(i)) >>> 0;
  function rand() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967295; }

  const canvas = document.createElement('canvas');
  const scale = 8;
  canvas.width = size * scale;
  canvas.height = size * scale;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0D1F3C';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#FFFFFF';

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const isFinder = (x < 7 && y < 7) || (x > size - 8 && y < 7) || (x < 7 && y > size - 8);
      if (isFinder) continue;
      if (rand() > 0.55) ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }

  function drawFinder(px, py) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(px * scale, py * scale, 7 * scale, 7 * scale);
    ctx.fillStyle = '#0D1F3C';
    ctx.fillRect((px + 1) * scale, (py + 1) * scale, 5 * scale, 5 * scale);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect((px + 2) * scale, (py + 2) * scale, 3 * scale, 3 * scale);
    ctx.fillStyle = '#C9A227';
    ctx.fillRect((px + 2.5) * scale, (py + 2.5) * scale, 2 * scale, 2 * scale);
  }
  drawFinder(0, 0);
  drawFinder(size - 7, 0);
  drawFinder(0, size - 7);

  container.innerHTML = '';
  container.appendChild(canvas);
}
