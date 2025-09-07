// src/utils/analytics.js

// IMPORTANT: In your public/index.html, load GA and disable auto page_view:
// <script async src="https://www.googletagmanager.com/gtag/js?id=G-EN0MPKLVQ5"></script>
// <script>
//   window.dataLayer = window.dataLayer || [];
//   function gtag(){ dataLayer.push(arguments); }
//   gtag('js', new Date());
//   // SPA: we will send page_view manually from React
//   gtag('config', 'G-EN0MPKLVQ5', { send_page_view: false });
// </script>

export const GA_ID = 'G-EN0MPKLVQ5';

function gtagSafe(...args) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  }
}

/** Send a page_view on route changes (SPA) */
export function pageview(path, title) {
  gtagSafe('event', 'page_view', {
    page_title: title || (typeof document !== 'undefined' ? document.title : undefined),
    page_location: typeof window !== 'undefined' ? window.location.href : undefined,
    page_path: path,
    send_to: GA_ID,
  });
}

/** Alias to match existing imports in App.jsx */
export function sendPageView(path, title) {
  return pageview(path, title);
}

/** Generic event helper */
export function track(event, params = {}) {
  gtagSafe('event', event, { send_to: GA_ID, ...params });
}

// Optional convenience helpers
export const trackUploadStart = (tool) =>
  track('upload_start', { tool });

export const trackDownload = (tool, pages) =>
  track('download', { tool, pages_count: pages });

export const trackError = (tool, message) =>
  track('exception', { tool, description: message, fatal: false });
