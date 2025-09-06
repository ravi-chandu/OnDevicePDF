import SEO from '../components/SEO.jsx'

export default function About(){
  return (
    <div className="container py-10">
      <SEO title="About" canonical="https://www.ondevicepdf.com/about" />
      <h1 className="text-2xl font-semibold mb-4">About OnDevicePDF</h1>
      <p className="text-slate-700 max-w-3xl">
        OnDevicePDF provides fast, private, and free PDF tools that run entirely in your browser.
        No uploads, no servers touching your files — everything happens locally using WebAssembly
        and modern JavaScript libraries.
      </p>
    </div>
  )
}
