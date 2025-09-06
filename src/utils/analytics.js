export function sendPageView(path) {
  if (typeof window === 'undefined' || !window.gtag) return
  const id = import.meta.env.VITE_GOOGLE_TAG_ID || import.meta.env.VITE_GA_MEASUREMENT_ID
  if (!id) return
  window.gtag('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href,
    page_path: path
  })
}
