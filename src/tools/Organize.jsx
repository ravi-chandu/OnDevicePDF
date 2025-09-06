import SEO from '../components/SEO.jsx'
import Dropzone from '../components/Dropzone.jsx'

export default function Organize() {
  return (
    <div className="container py-10">
      <SEO title="Organize" canonical="https://www.ondevicepdf.com/tools/organize" />
      <h1 className="text-2xl font-semibold mb-6">Organize pages (placeholder – reorder/delete UI next iteration)</h1>
      <Dropzone onFiles={(files)=>console.log('files', files)} />
    </div>
  )
}
