import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import Dropzone from '../components/Dropzone.jsx'
import StickyBar from '../components/StickyBar.jsx'
import HowToUse from '../components/HowToUse.jsx'
import SEO from '../components/SEO.jsx'
import { parseRanges } from '../utils/range.js'

export default function PDFSplit(){
  const [file, setFile] = useState(null)
  const [ranges, setRanges] = useState('1-3,5')
  const [busy, setBusy] = useState(false)
  async function handleExtract(){
    if (!file) return; setBusy(true); try {
      const inBuf=await file.arrayBuffer(), src=await PDFDocument.load(inBuf), out=await PDFDocument.create()
      const selected=parseRanges(ranges, src.getPageCount()); if(!selected.length) return
      const pages=await out.copyPages(src, selected); pages.forEach(p=>out.addPage(p))
      const bytes=await out.save(); const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'})); a.download=`extracted-${Date.now()}.pdf`; a.click(); URL.revokeObjectURL(a.href)
    } finally { setBusy(false) }
  }
  return (
    <div>
      <SEO title="Split / Extract Pages" canonical="https://www.ondevicepdf.com/tools/split" />
      <h1 className="text-2xl font-semibold mb-4">✂️ Split / Extract Pages</h1>
      <Dropzone onFiles={([f])=>setFile(f)} multiple={false} />
      <div className="card mt-4 flex gap-3 items-center">
        <label className="text-sm">Ranges</label>
        <input className="border rounded px-3 py-2 flex-1" value={ranges} onChange={e=>setRanges(e.target.value)} placeholder="e.g. 1-3,5" />
        <button className="btn-secondary" onClick={()=>setRanges('1-')}>All</button>
        <button className="btn-secondary" onClick={()=>setRanges('1')}>First</button>
      </div>
      <HowToUse steps={["Drop one PDF.","Enter ranges like 1-3,5 or use the preset buttons.","Click “Extract & Download”."]} />
      <StickyBar>
        <button className="btn" disabled={!file||busy} onClick={handleExtract}>{busy?'Extracting…':'Extract & Download'}</button>
        <button className="btn-secondary" onClick={()=>{setFile(null); setRanges('1-3,5')}}>Clear</button>
      </StickyBar>
    </div>
  )
}
