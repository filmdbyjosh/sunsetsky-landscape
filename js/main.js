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

  // Homepage "Our Work" preview — fill only if markup is empty (static HTML is preferred)
  const workPreview = document.getElementById('work-gallery-preview');
  if (
    workPreview &&
    !workPreview.children.length &&
    Array.isArray(window.GALLERY_IMAGES) &&
    window.GALLERY_IMAGES.length
  ) {
    window.GALLERY_IMAGES.slice(0, 6).forEach((src, i) => {
      const item = document.createElement('div');
      item.className = 'gallery__item';

      const image = document.createElement('img');
      const displaySrc = src.replace(/\.webp$/, '-960.webp');
      image.src = displaySrc;
      image.srcset = `${displaySrc} 960w, ${src} 1600w`;
      image.sizes = '(max-width: 768px) 100vw, 360px';
      image.alt = (window.GALLERY_ALTS && window.GALLERY_ALTS[i]) || `Sunset Sky Landscape project ${i + 1}`;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.fetchPriority = 'low';

      item.appendChild(image);
      workPreview.appendChild(item);
    });
  }

  // Hero video
  const heroVideo = document.getElementById('hero-video');
  const heroPoster = document.getElementById('hero-poster');

  if (heroVideo && heroPoster) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const showVideo = () => {
      heroVideo.classList.add('hero__video--ready');
      heroPoster.classList.add('hero__poster--hidden');
      heroVideo.play().catch(() => {});
    };

    heroVideo.addEventListener('error', () => {
      heroVideo.classList.remove('hero__video--ready');
      heroPoster.classList.remove('hero__poster--hidden');
    });

    if (!reduceMotion) {
      const startHero = () => {
        heroVideo.muted = true;
        heroVideo.playsInline = true;
        heroVideo.preload = 'metadata';
        heroVideo.src = 'assets/hero-optimized.mp4';
        heroVideo.addEventListener('loadeddata', showVideo, { once: true });
        heroVideo.addEventListener('canplay', showVideo, { once: true });
        heroVideo.load();
      };

      if (document.readyState === 'complete') {
        window.setTimeout(startHero, 0);
      } else {
        window.addEventListener('load', () => window.setTimeout(startHero, 0), { once: true });
      }
    }
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
  const formSuccess = document.getElementById('form-success');
  let lastFocus = null;

  function hideFormSuccess() {
    if (!formSuccess) return;
    formSuccess.hidden = true;
  }

  function showFormSuccess() {
    if (!formSuccess) return;
    formSuccess.hidden = false;
  }

  function openQuoteModal() {
    if (!modal) return;
    hideFormSuccess();
    if (formStatus) formStatus.hidden = true;
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
    hideFormSuccess();
    if (formStatus) formStatus.hidden = true;
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
    const submitBtn = quoteForm.querySelector('button[type="submit"]');

    quoteForm.addEventListener('submit', async (e) => {
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

      const formId = window.FORMSPREE_FORM_ID;
      if (!formId) {
        formStatus.textContent = 'Form is not connected yet. Please contact us at (520) 664-7057.';
        formStatus.className = 'form-note form-note--error';
        formStatus.hidden = false;
        return;
      }

      const data = new FormData(quoteForm);
      const payload = {
        first_name: data.get('first_name'),
        last_name: data.get('last_name'),
        name: `${data.get('first_name')} ${data.get('last_name')}`,
        email: data.get('email'),
        phone: data.get('phone'),
        address: data.get('address'),
        help_type: data.get('help_type'),
        contact_pref: data.get('contact_pref'),
        message: data.get('message'),
        _replyto: data.get('email'),
        _subject: 'New Quote Request — Sunset Sky Landscape',
      };

      const defaultLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      try {
        const response = await fetch(`https://formspree.io/f/${formId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Submit failed');
        }

        quoteForm.reset();
        showFormSuccess();
        setTimeout(closeQuoteModal, 5000);
      } catch (err) {
        formStatus.textContent = 'Something went wrong. Please call us at (520) 664-7057.';
        formStatus.className = 'form-note form-note--error';
        formStatus.hidden = false;
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = defaultLabel;
        }
      }
    });
  }

  // Scroll reveal — only hide content after observer is ready (avoids blank page if JS fails)
  const revealEls = document.querySelectorAll('.reveal');
  const showReveal = (el) => el.classList.add('reveal--visible');

  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            showReveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' }
    );

    // Mark in-view sections visible before enabling hide, so first paint never blanks
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    revealEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < viewportH && rect.bottom > 0) showReveal(el);
      observer.observe(el);
    });
    document.documentElement.classList.add('js-reveal');

    // Safety: never leave sections permanently hidden
    window.setTimeout(() => {
      revealEls.forEach((el) => {
        if (!el.classList.contains('reveal--visible')) showReveal(el);
      });
    }, 2000);
  } else {
    revealEls.forEach(showReveal);
  }

  // Mobile quote bar
  const mobileBar = document.createElement('div');
  mobileBar.className = 'mobile-quote-bar';
  mobileBar.innerHTML = '<button type="button" class="btn btn--primary" data-open-quote>Request a Free Quote</button>';
  document.body.appendChild(mobileBar);
  mobileBar.querySelector('[data-open-quote]').addEventListener('click', openQuoteModal);
})();
