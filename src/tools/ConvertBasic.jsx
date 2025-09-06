import SEO from '../components/SEO.jsx'
import Dropzone from '../components/Dropzone.jsx'

export default function ConvertBasic() {
  return (
    <div className="container py-10">
      <SEO title="ConvertBasic" canonical="https://www.ondevicepdf.com/tools/convertbasic" />
      <h1 className="text-2xl font-semibold mb-6">Convert (basic) placeholder</h1>
      <Dropzone onFiles={(files)=>console.log('files', files)} />
    </div>
  )
}
