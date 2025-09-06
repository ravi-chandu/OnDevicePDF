import SEO from '../components/SEO.jsx'
import Dropzone from '../components/Dropzone.jsx'

export default function Delete() {
  return (
    <div className="container py-10">
      <SEO title="Delete" canonical="https://www.ondevicepdf.com/tools/delete" />
      <h1 className="text-2xl font-semibold mb-6">Delete pages placeholder</h1>
      <Dropzone onFiles={(files)=>console.log('files', files)} />
    </div>
  )
}
