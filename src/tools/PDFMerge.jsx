import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import Dropzone from '../components/Dropzone.jsx'
import SEO from '../components/SEO.jsx'

export default function PDFMerge(){
  const [files, setFiles] = useState([])
  const [busy, setBusy] = useState(false)

  async function handleMerge(){
    setBusy(true)
    try {
      const out = await PDFDocument.create()
      for (const file of files){
        const bytes = await file.arrayBuffer()
        const src = await PDFDocument.load(bytes)
        const pages = await out.copyPages(src, src.getPageIndices())
        pages.forEach(p => out.addPage(p))
      }
      const merged = await out.save()
      const blob = new Blob([merged], { type: 'application/pdf' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `merged-${Date.now()}.pdf`
      a.click()
      URL.revokeObjectURL(a.href)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="container py-10">
      <SEO title="Merge PDFs" canonical="https://www.ondevicepdf.com/tools/merge" />
      <h1 className="text-2xl font-semibold mb-6">Merge PDFs</h1>
      <Dropzone onFiles={(sel)=>setFiles([...files, ...sel])} />
      {files.length > 0 && (
        <div className="mt-6 card">
          <h2 className="font-medium mb-4">Selected files</h2>
          <ol className="list-decimal pl-5 space-y-1">
            {files.map((f, i) => <li key={i} className="truncate">{f.name}</li>)}
          </ol>
          <button className="btn mt-5" disabled={busy} onClick={handleMerge}>
            {busy ? 'Merging…' : 'Merge & Download'}
          </button>
        </div>
      )}
    </div>
  )
}
