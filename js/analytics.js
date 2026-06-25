/**
 * Google Analytics 4
 * Replace G-XXXXXXXXXX with your Measurement ID from analytics.google.com
 * https://analytics.google.com → Admin → Data Streams → your site → Measurement ID
 */
(function () {
  'use strict';

  const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return;

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
