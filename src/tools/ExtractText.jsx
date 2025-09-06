import SEO from '../components/SEO.jsx'
import Dropzone from '../components/Dropzone.jsx'

export default function ExtractText() {
  return (
    <div className="container py-10">
      <SEO title="ExtractText" canonical="https://www.ondevicepdf.com/tools/extracttext" />
      <h1 className="text-2xl font-semibold mb-6">Extract text placeholder</h1>
      <Dropzone onFiles={(files)=>console.log('files', files)} />
    </div>
  )
}
