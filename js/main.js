(function () {
  'use strict';

  // Logo — show image when assets/logo.png is available
  document.querySelectorAll('.logo__img').forEach((img) => {
    const test = new Image();
    test.onload = () => {
      img.classList.add('logo__img--loaded');
    };
    test.onerror = () => {
      img.remove();
    };
    test.src = img.getAttribute('src');
  });

  // Hero video
  const heroVideo = document.getElementById('hero-video');
  const heroPoster = document.getElementById('hero-poster');

  if (heroVideo && heroPoster) {
    const showVideo = () => {
      heroVideo.classList.add('hero__video--ready');
      heroPoster.classList.add('hero__poster--hidden');
      heroVideo.play().catch(() => {});
    };

    heroVideo.addEventListener('loadeddata', showVideo, { once: true });
    heroVideo.addEventListener('canplay', showVideo, { once: true });
    heroVideo.addEventListener('error', () => {
      heroVideo.classList.remove('hero__video--ready');
      heroPoster.classList.remove('hero__poster--hidden');
    });

    heroVideo.load();
    showVideo();
  }

  // Mobile nav
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('nav--open');
      navToggle.classList.toggle('nav-toggle--open', open);
      navToggle.setAttribute('aria-expanded', open);
    });

    nav.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('nav--open');
        navToggle.classList.remove('nav-toggle--open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Quote modal
  const modal = document.getElementById('quote-modal');
  const quoteForm = document.getElementById('quote-form');
  const formStatus = document.getElementById('form-status');
  let lastFocus = null;

  function openQuoteModal() {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.classList.add('modal--open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input, textarea');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }

  function closeQuoteModal() {
    if (!modal) return;
    modal.classList.remove('modal--open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  document.querySelectorAll('[data-open-quote]').forEach((btn) => {
    btn.addEventListener('click', openQuoteModal);
  });

  document.querySelectorAll('[data-close-quote]').forEach((el) => {
    el.addEventListener('click', closeQuoteModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('modal--open')) {
      closeQuoteModal();
    }
  });

  if (new URLSearchParams(window.location.search).get('quote') === '1') {
    setTimeout(openQuoteModal, 300);
    history.replaceState(null, '', window.location.pathname);
  }

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formStatus.hidden = true;

      const required = quoteForm.querySelectorAll('[required]');
      let valid = true;

      required.forEach((field) => {
        field.classList.remove('error');
        if (field.type === 'radio') {
          const group = quoteForm.querySelectorAll(`[name="${field.name}"]`);
          const checked = [...group].some((r) => r.checked);
          if (!checked) valid = false;
        } else if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });

      if (!valid) {
        formStatus.textContent = 'Please fill in all required fields.';
        formStatus.className = 'form-note form-note--error';
        formStatus.hidden = false;
        return;
      }

      const data = new FormData(quoteForm);
      const subject = encodeURIComponent('Quote Request — Sunset Sky Landscape');
      const body = encodeURIComponent(
        [
          `Name: ${data.get('first_name')} ${data.get('last_name')}`,
          `Help Type: ${data.get('help_type')}`,
          `Contact Preference: ${data.get('contact_pref')}`,
          `Address: ${data.get('address')}`,
          `Email: ${data.get('email')}`,
          `Phone: ${data.get('phone')}`,
          '',
          'Message:',
          data.get('message'),
        ].join('\n')
      );

      window.location.href = `mailto:sunsetskylandscape@gmail.com?subject=${subject}&body=${body}`;

      formStatus.textContent = 'Thank you! Your email client should open — send the message to complete your request.';
      formStatus.className = 'form-note form-note--success';
      formStatus.hidden = false;
      quoteForm.reset();

      setTimeout(closeQuoteModal, 3000);
    });
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));

  // Mobile quote bar
  const mobileBar = document.createElement('div');
  mobileBar.className = 'mobile-quote-bar';
  mobileBar.innerHTML = '<button type="button" class="btn btn--primary" data-open-quote>Request a Free Quote</button>';
  document.body.appendChild(mobileBar);
  mobileBar.querySelector('[data-open-quote]').addEventListener('click', openQuoteModal);
})();
