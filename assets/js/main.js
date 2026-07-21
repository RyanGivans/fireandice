(() => {
  const RESERVATION_URL = 'https://www.opentable.com/r/fire-and-ice-restaurant-reservations-springfield?lang=en-US&ot_source=Restaurant+website&restref=15517';
  const current = document.body.dataset.page || 'home';

  const navItems = [
    ['home', 'Home', 'index.html'],
    ['menu', 'Menus', 'menu.html'],
    ['experiences', 'Experiences', 'experiences.html'],
    ['gallery', 'Gallery', 'gallery.html'],
    ['events', 'Private Dining', 'private-dining.html'],
    ['about', 'Our Story', 'about.html'],
    ['contact', 'Visit', 'contact.html']
  ];

  const wordmark = `
    <span class="wordmark-main"><span class="fire">FIRE</span> <span aria-hidden="true">&amp;</span> <span class="ice">ICE</span></span>
    <span class="wordmark-sub">Restaurant &amp; Bar</span>`;

  const links = navItems.map(([id, label, href]) =>
    `<a href="${href}" ${current === id ? 'aria-current="page"' : ''}>${label}</a>`
  ).join('');

  const headerTarget = document.querySelector('[data-site-header]');
  if (headerTarget) {
    headerTarget.innerHTML = `
      <header class="site-header" id="site-header">
        <div class="header-inner">
          <a class="wordmark" href="index.html" aria-label="Fire and Ice Restaurant and Bar home">${wordmark}</a>
          <nav class="desktop-nav" aria-label="Primary navigation">${links}</nav>
          <div class="header-actions">
            <a class="btn" href="${RESERVATION_URL}" target="_blank" rel="noopener">Reserve a table</a>
            <button class="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span></button>
          </div>
        </div>
      </header>
      <div class="mobile-panel" id="mobile-menu" aria-hidden="true">
        <nav class="mobile-nav" aria-label="Mobile navigation">${links}</nav>
        <div class="mobile-panel-meta"><a href="tel:+14175227711">(417) 522-7711</a><span>Springfield, Missouri</span></div>
      </div>`;
  }

  const footerTarget = document.querySelector('[data-site-footer]');
  if (footerTarget) {
    footerTarget.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <a class="wordmark" href="index.html">${wordmark}</a>
              <p>Flame-driven cuisine, ice-cold cocktails, and hospitality designed to make every visit feel like an occasion.</p>
            </div>
            <div>
              <p class="footer-title">Explore</p>
              <div class="footer-links">
                <a href="menu.html">Menus</a><a href="experiences.html">The Experience</a><a href="gallery.html">Gallery</a><a href="private-dining.html">Private Dining</a>
              </div>
            </div>
            <div>
              <p class="footer-title">Visit</p>
              <div class="footer-links">
                <a href="contact.html">Hours &amp; Location</a><a href="tel:+14175227711">(417) 522-7711</a><a href="mailto:info@oasisfireandice.com">Email Us</a><a href="https://springfieldoasis.com/" target="_blank" rel="noopener">Oasis Hotel</a>
              </div>
            </div>
            <div class="footer-reserve">
              <p class="footer-title">Your table is waiting</p>
              <p>Whether it is a date night, celebration, business dinner, or an evening at the ice bar, make it memorable.</p>
              <a class="btn solid" href="${RESERVATION_URL}" target="_blank" rel="noopener">Reserve a table</a>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© ${new Date().getFullYear()} Fire &amp; Ice Restaurant &amp; Bar</span>
            <div class="social-row">
              <a href="https://www.instagram.com/oasisfireandice/" target="_blank" rel="noopener">Instagram</a>
              <a href="https://www.facebook.com/fireandicerestaurant" target="_blank" rel="noopener">Facebook</a>
              <a href="https://www.tiktok.com/@oasisfireandice" target="_blank" rel="noopener">TikTok</a>
            </div>
          </div>
        </div>
      </footer>
      <a class="mobile-reserve" href="${RESERVATION_URL}" target="_blank" rel="noopener">Reserve a table</a>`;
  }

  document.body.insertAdjacentHTML('afterbegin', '<a class="skip-link" href="#main-content">Skip to content</a><div class="noise" aria-hidden="true"></div>');

  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const panel = document.querySelector('.mobile-panel');
  const setHeader = () => header?.classList.toggle('scrolled', window.scrollY > 28);
  setHeader();
  addEventListener('scroll', setHeader, { passive: true });

  function closeMenu() {
    toggle?.classList.remove('active');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'Open menu');
    panel?.classList.remove('open');
    panel?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  }
  toggle?.addEventListener('click', () => {
    const open = !panel.classList.contains('open');
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    panel.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
  });
  panel?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  // Reveals
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -45px' });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Lightweight parallax
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const parallax = [...document.querySelectorAll('[data-parallax]')];
    let ticking = false;
    const drawParallax = () => {
      const viewport = innerHeight;
      parallax.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < viewport) {
          const progress = (rect.top + rect.height / 2 - viewport / 2) / viewport;
          const amount = Number(el.dataset.parallax || 22);
          el.style.transform = `translate3d(0, ${progress * amount}px, 0) scale(1.04)`;
        }
      });
      ticking = false;
    };
    addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(drawParallax); ticking = true; }
    }, { passive: true });
    drawParallax();
  }

  // Subtle ember / crystal particulate field for the homepage hero.
  const canvas = document.getElementById('element-canvas');
  if (canvas && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let width, height, dpr;
    let particles = [];
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      width = canvas.clientWidth; height = canvas.clientHeight;
      canvas.width = width * dpr; canvas.height = height * dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      const count = Math.min(74, Math.max(34, Math.floor(width / 22)));
      particles = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.3 + .25,
        vy: -(Math.random() * .22 + .05),
        vx: (Math.random() - .5) * .08,
        alpha: Math.random() * .38 + .08,
        phase: Math.random() * Math.PI * 2,
        cold: Math.random() > .54
      }));
    };
    const frame = t => {
      ctx.clearRect(0,0,width,height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.cold ? -p.vy * .22 : p.vy;
        p.phase += .008;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        const edgeBias = p.x / width;
        const useCold = p.cold || edgeBias > .62;
        ctx.beginPath();
        ctx.fillStyle = useCold
          ? `rgba(185,224,239,${p.alpha * (.72 + Math.sin(p.phase)*.2)})`
          : `rgba(225,126,57,${p.alpha * (.72 + Math.sin(p.phase)*.2)})`;
        if (useCold) {
          ctx.rect(p.x, p.y, p.r * 1.1, p.r * 1.1);
        } else {
          ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        }
        ctx.fill();
      });
      requestAnimationFrame(frame);
    };
    resize(); addEventListener('resize', resize); requestAnimationFrame(frame);
  }

  // Gallery lightbox and filters.
  const gallery = document.querySelector('[data-gallery]');
  if (gallery) {
    const cards = [...gallery.querySelectorAll('.gallery-card')];
    const filters = document.querySelectorAll('[data-gallery-filter]');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox?.querySelector('img');
    const caption = lightbox?.querySelector('.lightbox-caption');
    const close = () => { lightbox?.classList.remove('open'); document.body.classList.remove('menu-open'); };
    filters.forEach(button => button.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      const filter = button.dataset.galleryFilter;
      cards.forEach(card => card.hidden = filter !== 'all' && card.dataset.category !== filter);
    }));
    cards.forEach(card => card.addEventListener('click', () => {
      if (!lightbox || !lightboxImg) return;
      const img = card.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      caption.textContent = card.dataset.caption || img.alt;
      lightbox.classList.add('open');
      document.body.classList.add('menu-open');
    }));
    lightbox?.querySelector('.lightbox-close')?.addEventListener('click', close);
    lightbox?.addEventListener('click', e => { if (e.target === lightbox) close(); });
    addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  // Static-host-friendly event inquiry: prepare a detailed email locally.
  const inquiry = document.querySelector('[data-inquiry-form]');
  inquiry?.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(inquiry);
    const subject = encodeURIComponent(`Private Dining Inquiry — ${data.get('eventType') || 'Fire & Ice'}`);
    const body = encodeURIComponent([
      `Name: ${data.get('name') || ''}`,
      `Email: ${data.get('email') || ''}`,
      `Phone: ${data.get('phone') || ''}`,
      `Event type: ${data.get('eventType') || ''}`,
      `Preferred date: ${data.get('date') || ''}`,
      `Guest count: ${data.get('guests') || ''}`,
      '', 'Event details:', data.get('message') || ''
    ].join('\n'));
    location.href = `mailto:info@oasisfireandice.com?subject=${subject}&body=${body}`;
  });
})();
