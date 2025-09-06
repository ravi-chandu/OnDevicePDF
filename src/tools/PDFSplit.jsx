import SEO from '../components/SEO.jsx'
import Dropzone from '../components/Dropzone.jsx'

export default function PDFSplit() {
  return (
    <div className="container py-10">
      <SEO title="PDF Split" canonical="https://www.ondevicepdf.com/tools/split" />
      <h1 className="text-2xl font-semibold mb-6">Split PDF (placeholder – implement in next iteration)</h1>
      <Dropzone onFiles={(files)=>console.log('files', files)} />
    </div>
  )
}
