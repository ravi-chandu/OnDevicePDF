import SEO from '../components/SEO.jsx'
import Dropzone from '../components/Dropzone.jsx'

export default function Stamp() {
  return (
    <div className="container py-10">
      <SEO title="Stamp" canonical="https://www.ondevicepdf.com/tools/stamp" />
      <h1 className="text-2xl font-semibold mb-6">Stamp/watermark placeholder</h1>
      <Dropzone onFiles={(files)=>console.log('files', files)} />
    </div>
  )
}
