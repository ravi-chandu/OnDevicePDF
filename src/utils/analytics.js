// src/utils/analytics.js
const GA_ID = 'G-EN0MPKLVQ5'; // your GA4 measurement ID

let scriptInjected = false;
let pending = [];

// Inject gtag <script> once
export function initGA() {
  if (typeof window === 'undefined' || scriptInjected) return;

  // Create the dataLayer + gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(){ window.dataLayer.push(arguments); };

  // JS tag
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  s.onload = () => {
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { send_page_view: false });

    // flush queued calls
    pending.forEach(fn => fn());
    pending = [];
  };

  document.head.appendChild(s);
  scriptInjected = true;
}

// Pageview helper (SPA)
export function sendPageView(path, title) {
  const run = () => window.gtag('config', GA_ID, {
    page_path: path || (location.pathname + location.search),
    page_title: title || document.title,
  });

  if (!window.gtag) {
    initGA();
    pending.push(run);
  } else {
    run();
  }
}

// Generic event helper
export function sendEvent(name, params = {}) {
  const run = () => window.gtag('event', name, params);
  if (!window.gtag) {
    initGA();
    pending.push(run);
  } else {
    run();
  }
}
