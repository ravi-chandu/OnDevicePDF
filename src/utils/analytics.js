export const GA_ID = 'G-EN0MPKLVQ5';

export function pageview(path, title) {
  if (!window.gtag) return;
  window.gtag('event', 'page_view', {
    page_title: title || document.title,
    page_location: window.location.href,
    page_path: path,
  });
}

export function gaEvent(action, params = {}) {
  if (!window.gtag) return;
  window.gtag('event', action, params);
}
