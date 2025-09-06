import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import Dropzone from '../components/Dropzone.jsx'
import StickyBar from '../components/StickyBar.jsx'
import HowToUse from '../components/HowToUse.jsx'
import SEO from '../components/SEO.jsx'

export default function PDFMerge(){
  const [files, setFiles] = useState([])
  const [busy, setBusy] = useState(false)
  async function handleMerge(){
    setBusy(true); try {
      const out = await PDFDocument.create()
      for (const f of files){ const buf=await f.arrayBuffer(); const src=await PDFDocument.load(buf); const pages=await out.copyPages(src, src.getPageIndices()); pages.forEach(p=>out.addPage(p)) }
      const bytes = await out.save()
      const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'})); a.download=`merged-${Date.now()}.pdf`; a.click(); URL.revokeObjectURL(a.href)
    } finally { setBusy(false) }
  }
  return (
    <div>
      <SEO title="Merge PDFs" canonical="https://www.ondevicepdf.com/tools/merge" />
      <h1 className="text-2xl font-semibold mb-4">🧩 Merge PDF Files</h1>
      <Dropzone onFiles={(sel)=>setFiles([...files, ...sel])} multiple />
      {files.length>0 && <div className="card mt-4"><h2 className="font-medium mb-2">Selected files</h2><ol className="list-decimal pl-5 space-y-1">{files.map((f,i)=><li key={i} className="truncate">{f.name}</li>)}</ol></div>}
      <HowToUse steps={["Drop or choose files.","Reorder the list if needed.","Click Merge & Download."]} />
      <StickyBar>
        <button className="btn" disabled={!files.length||busy} onClick={handleMerge}>{busy?'Merging…':'Merge & Download'}</button>
        <button className="btn-secondary" onClick={()=>setFiles([])}>Clear</button>
      </StickyBar>
    </div>
  )
}
