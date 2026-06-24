(function () {
  'use strict';

  const GALLERY_IMAGES = window.GALLERY_IMAGES || [];
  const galleryGrid = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');
  let currentImageIndex = 0;

  // Mobile nav
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

  // Build gallery
  if (!galleryGrid) return;

  GALLERY_IMAGES.forEach((src, i) => {
    const item = document.createElement('div');
    item.className = 'gallery__item';

    const image = document.createElement('img');
    image.src = src;
    image.alt = `Sunset Sky Landscape project ${i + 1}`;
    image.loading = i < 12 ? 'eager' : 'lazy';
    image.decoding = 'async';

    item.appendChild(image);
    item.addEventListener('click', () => openLightbox(i));
    galleryGrid.appendChild(item);
  });

  function openLightbox(index) {
    currentImageIndex = index;
    lightboxImage.src = GALLERY_IMAGES[index];
    lightbox.classList.add('lightbox--open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('lightbox--open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function navigateLightbox(dir) {
    currentImageIndex = (currentImageIndex + dir + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
    lightboxImage.src = GALLERY_IMAGES[currentImageIndex];
  }

  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
  document.getElementById('lightbox-next').addEventListener('click', () => navigateLightbox(1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('lightbox--open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
})();
