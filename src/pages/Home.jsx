import { Link } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
import StructuredData from '../components/StructuredData.jsx'

export default function Home(){
  const cards = [
    ['merge','🧩 Merge','Combine multiple PDFs.'],
    ['split','✂️ Split','Extract or split pages.'],
    ['organize','🗂️ Organize','Reorder, rotate, delete.'],
    ['stamp','🔖 Stamp','Watermark & page numbers.'],
    ['rotate','🔄 Rotate','Rotate specific pages.'],
    ['delete','🗑️ Delete','Remove selected pages.'],
    ['compress','🗜 Compress','Quick re-save optimization.'],
    ['convert','⇄ Convert','Pages → images (ZIP).'],
    ['text','📝 Extract text','Get plain text from PDF.'],
    ['rename','✏️ Rename','Change filename & metadata.']
  ]
  return (
    <div>
      <SEO />
      <StructuredData />
      <h1 className="text-3xl font-bold mb-2">All-in-one PDF tools</h1>
      <p className="text-slate-600 mb-6">Everything runs locally in your browser — your files never leave your device.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(([slug, icon, desc]) => (
          <Link key={slug} to={`/tools/${slug}`} className="card hover:shadow-md transition">
            <div className="font-semibold">{icon} {slug[0].toUpperCase()+slug.slice(1)}</div>
            <div className="text-slate-600 text-sm">{desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
