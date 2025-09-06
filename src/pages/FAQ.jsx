import SEO from '../components/SEO.jsx'
import StructuredData from '../components/StructuredData.jsx'
export default function FAQ(){
  return (
    <article className="prose max-w-none">
      <SEO title="FAQ" canonical="https://www.ondevicepdf.com/faq" />
      <StructuredData type="FAQPage" />
      <h1>Frequently Asked Questions</h1>
      <h3>Do my PDFs upload to a server?</h3><p>No. All tools run entirely in your browser.</p>
      <h3>Is it free?</h3><p>Yes. No sign-up required, and we don’t add watermarks.</p>
      <h3>Can I use it offline?</h3><p>Yes. Install OnDevicePDF; most tools work offline.</p>
      <h3>Is my data tracked?</h3><p>We collect basic usage analytics (page views) when enabled. PDFs are never uploaded or inspected.</p>
      <h3>How do I install?</h3><p>When you see the install prompt, tap it. Or use your browser menu → “Add to Home Screen”.</p>
    </article>
  )
}
