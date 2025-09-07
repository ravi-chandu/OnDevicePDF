// src/utils/analytics.js

/**
 * Lightweight GA4 helpers.
 * Assumes the gtag snippet is present in index.html:
 *   <script async src="https://www.googletagmanager.com/gtag/js?id=G-EN0MPKLVQ5"></script>
 *   <script>window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-EN0MPKLVQ5');</script>
 */

export const GA_ID = 'G-EN0MPKLVQ5';

/** Safe read of gtag */
function gtagSafe(...args) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  }
}

/** Send a page_view for SPA route changes */
export function pageview(path) {
  // path like "/tools/merge"
  gtagSafe('event', 'page_view', {
    page_path: path,
    page_location: typeof window !== 'undefined' ? window.location.href : undefined,
    send_to: GA_ID,
  });
}

/** Generic event tracker */
export function track(event, params = {}) {
  gtagSafe('event', event, { send_to: GA_ID, ...params });
}

/** Convenience helpers for common actions (optional) */
export const trackUploadStart = (tool) =>
  track('upload_start', { tool });

export const trackDownload = (tool, pages) =>
  track('download', { tool, pages_count: pages });

export const trackError = (tool, message) =>
  track('exception', { tool, description: message, fatal: false });
