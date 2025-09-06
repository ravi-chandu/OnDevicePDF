import { Link } from 'react-router-dom'
import SEO from '../components/SEO.jsx'
const entries=[
  ['merge','🧩 Merge','Combine PDFs'],['split','✂️ Split','Extract/split pages'],['organize','🗂️ Organize','Reorder & delete'],
  ['stamp','🔖 Stamp','Watermark & page numbers'],['rotate','🔄 Rotate','Rotate pages'],['delete','🗑️ Delete','Remove pages'],
  ['compress','🗜 Compress','Re-save optimization'],['convert','⇄ Convert','Pages → images'],['text','📝 Extract text','Plain text from PDF'],
  ['rename','✏️ Rename','Filename & metadata']
]
export default function Tools(){
  return (
    <div>
      <SEO title="All tools" canonical="https://www.ondevicepdf.com/tools" />
      <h1 className="text-2xl font-semibold mb-6">All tools</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map(([slug,title,desc])=>(
          <Link key={slug} to={`/tools/${slug}`} className="card hover:shadow-md transition">
            <div className="font-medium">{title}</div><div className="text-slate-600 text-sm">{desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
