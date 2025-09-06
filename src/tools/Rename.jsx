import SEO from '../components/SEO.jsx'
import Dropzone from '../components/Dropzone.jsx'

export default function Rename() {
  return (
    <div className="container py-10">
      <SEO title="Rename" canonical="https://www.ondevicepdf.com/tools/rename" />
      <h1 className="text-2xl font-semibold mb-6">Rename PDF metadata placeholder</h1>
      <Dropzone onFiles={(files)=>console.log('files', files)} />
    </div>
  )
}
