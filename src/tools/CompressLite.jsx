import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import Dropzone from '../components/Dropzone.jsx'
import StickyBar from '../components/StickyBar.jsx'
import HowToUse from '../components/HowToUse.jsx'
import SEO from '../components/SEO.jsx'

export default function CompressLite(){
  const [file,setFile]=useState(null); const [busy,setBusy]=useState(false); const [sizeIn,setSizeIn]=useState(null); const [sizeOut,setSizeOut]=useState(null)
  async function onFiles([f]){ setFile(f); setSizeIn(f.size) }
  async function apply(){
    if(!file) return; setBusy(true); try {
      const buf=await file.arrayBuffer(); const doc=await PDFDocument.load(buf); const bytes=await doc.save({ useObjectStreams:true })
      setSizeOut(bytes.byteLength); const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'})); a.download=`compressed-${Date.now()}.pdf`; a.click(); URL.revokeObjectURL(a.href)
    } finally { setBusy(false) }
  }
  return (
    <div>
      <SEO title="Compress (Lite)" canonical="https://www.ondevicepdf.com/tools/compress" />
      <h1 className="text-2xl font-semibold mb-4">🗜 Compress (Lite)</h1>
      <Dropzone onFiles={onFiles} multiple={false} />
      <div className="mt-3 text-sm text-slate-600">{sizeIn && <span>Original: {(sizeIn/1024/1024).toFixed(2)} MB</span>}{sizeOut && <span className="ml-4">After: {(sizeOut/1024/1024).toFixed(2)} MB</span>}</div>
      <HowToUse steps={["Drop one PDF.","Click Apply to re-save with lite optimization.","Download the result."]} />
      <StickyBar>
        <button className="btn" disabled={!file||busy} onClick={apply}>{busy?'Applying…':'Apply & Download'}</button>
        <button className="btn-secondary" onClick={()=>{setFile(null); setSizeIn(null); setSizeOut(null)}}>Clear</button>
      </StickyBar>
    </div>
  )
}
