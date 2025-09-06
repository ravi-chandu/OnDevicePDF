import { Link } from 'react-router-dom'
import SEO from '../components/SEO.jsx'

export default function Home(){
  return (
    <main>
      <SEO />
      <section className="container py-10">
        <h1 className="text-3xl font-bold mb-3">All-in-one PDF tools</h1>
        <p className="text-slate-600 mb-8">
          Everything runs locally in your browser — your files never leave your device.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Link to="/tools/merge" className="card hover:shadow-md transition">
            <h3 className="font-semibold">🧩 Merge</h3>
            <p className="text-slate-600">Combine multiple PDFs.</p>
          </Link>
          <Link to="/tools/split" className="card hover:shadow-md transition">
            <h3 className="font-semibold">✂️ Split</h3>
            <p className="text-slate-600">Extract or split pages.</p>
          </Link>
          <Link to="/tools/organize" className="card hover:shadow-md transition">
            <h3 className="font-semibold">🗂 Organize</h3>
            <p className="text-slate-600">Reorder & delete pages.</p>
          </Link>
        </div>
      </section>
    </main>
  )
}
