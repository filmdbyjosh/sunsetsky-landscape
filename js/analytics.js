/**
 * Google Analytics 4 — Sunset Sky Landscape & Design
 * Measurement ID from Google tag (gtag.js)
 */
(function () {
  'use strict';

  const GA_MEASUREMENT_ID = 'G-G90RJMZ3ZV';

  if (!GA_MEASUREMENT_ID) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);
})();
