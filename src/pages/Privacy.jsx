import SEO from '../components/SEO.jsx'

export default function Privacy(){
  return (
    <div className="container py-10">
      <SEO title="Privacy" canonical="https://www.ondevicepdf.com/privacy" />
      <h1 className="text-2xl font-semibold mb-4">Privacy</h1>
      <p className="text-slate-700 max-w-3xl">
        We do not upload, store, or view your PDFs. Analytics measure page views only and do not
        include your file contents. You may block analytics with your browser and the app remains fully functional.
      </p>
    </div>
  )
}
