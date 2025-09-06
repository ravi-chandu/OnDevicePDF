import SEO from '../components/SEO.jsx'
import Dropzone from '../components/Dropzone.jsx'

export default function Rotate() {
  return (
    <div className="container py-10">
      <SEO title="Rotate" canonical="https://www.ondevicepdf.com/tools/rotate" />
      <h1 className="text-2xl font-semibold mb-6">Rotate pages placeholder</h1>
      <Dropzone onFiles={(files)=>console.log('files', files)} />
    </div>
  )
}
