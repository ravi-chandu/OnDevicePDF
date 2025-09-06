import { Link } from 'react-router-dom'
import SEO from '../components/SEO.jsx'

const entries = [
  ['merge', '🧩 Merge', 'Combine PDFs'],
  ['split', '✂️ Split', 'Extract or split pages'],
  ['organize', '🗂 Organize', 'Reorder & delete'],
  ['compress', 'Compress (Lite)', 'Quick re-save optimization'],
  ['convert', 'Convert (Basic)', 'Prep for images/ZIP'],
  ['rename', '✏️ Rename', 'Filename & PDF Title'],
  ['stamp', '🔖 Stamp', 'Watermark & page numbers'],
  ['rotate', '🔄 Rotate', 'Rotate specific pages'],
  ['delete', '🗑 Delete', 'Remove pages'],
  ['text', '📝 Extract text', 'Plain text from PDF'],
]

export default function Tools(){
  return (
    <div className="container py-10">
      <SEO title="Tools" canonical="https://www.ondevicepdf.com/tools" />
      <h1 className="text-2xl font-semibold mb-6">All tools</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {entries.map(([slug, title, desc]) => (
          <Link key={slug} to={`/tools/${slug}`} className="card hover:shadow-md transition">
            <h3 className="font-medium">{title}</h3>
            <p className="text-slate-600">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
