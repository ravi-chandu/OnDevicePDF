import SEO from '../components/SEO.jsx'

export default function Blog(){
  return (
    <div className="container py-10">
      <SEO title="Blog" canonical="https://www.ondevicepdf.com/blog" />
      <h1 className="text-2xl font-semibold mb-4">Blog</h1>
      <p className="text-slate-700">Coming soon: tips, release notes, and case studies.</p>
    </div>
  )
}
