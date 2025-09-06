import SEO from '../components/SEO.jsx'

export default function FAQ(){
  return (
    <div className="container py-10">
      <SEO title="FAQ" canonical="https://www.ondevicepdf.com/faq" />
      <h1 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h1>
      <div className="space-y-4 max-w-3xl">
        <details className="card">
          <summary className="font-medium">Do my files ever leave my device?</summary>
          <p className="text-slate-700 mt-2">No. All processing happens in your browser.</p>
        </details>
        <details className="card">
          <summary className="font-medium">Is it free?</summary>
          <p className="text-slate-700 mt-2">Yes. No login required.</p>
        </details>
      </div>
    </div>
  )
}
