import { useState } from 'react'
import { PDFDocument, degrees } from 'pdf-lib'
import Dropzone from '../components/Dropzone.jsx'
import StickyBar from '../components/StickyBar.jsx'
import HowToUse from '../components/HowToUse.jsx'
import SEO from '../components/SEO.jsx'
import pdfjsLib from '../utils/pdfjs.js'

export default function Rotate(){
  const [file,setFile]=useState(null); const [pages,setPages]=useState([]); const [selected,setSelected]=useState(new Set()); const [deg,setDeg]=useState(90); const [busy,setBusy]=useState(false)
  async function onFiles([f]){
    setFile(f); const buf=await f.arrayBuffer(); const pdf=await pdfjsLib.getDocument({data:buf}).promise
    const items=[]; for(let n=1;n<=pdf.numPages;n++){ const page=await pdf.getPage(n); const vp=page.getViewport({scale:.2}); const canvas=document.createElement('canvas'); const ctx=canvas.getContext('2d'); canvas.width=vp.width; canvas.height=vp.height; await page.render({canvasContext:ctx,viewport:vp}).promise; items.push({index:n-1,img:canvas.toDataURL('image/png')}) }
    setPages(items); setSelected(new Set())
  }
  function toggle(i){ const s=new Set(selected); s.has(i)?s.delete(i):s.add(i); setSelected(s) }
  async function applyRotate(){
    if(!file) return; setBusy(true); try {
      const buf=await file.arrayBuffer(), src=await PDFDocument.load(buf), out=await PDFDocument.create()
      const all=pages.map(p=>p.index)
      for(const idx of all){ const [p]=await out.copyPages(src,[idx]); if(selected.size===0||selected.has(idx)) p.setRotation(degrees(deg)); out.addPage(p) }
      const bytes=await out.save(); const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'})); a.download=`rotate-${deg}-${Date.now()}.pdf`; a.click(); URL.revokeObjectURL(a.href)
    } finally { setBusy(false) }
  }
  return (
    <div>
      <SEO title="Rotate Pages" canonical="https://www.ondevicepdf.com/tools/rotate" />
      <h1 className="text-2xl font-semibold mb-4">🔄 Rotate Pages</h1>
      <Dropzone onFiles={onFiles} multiple={false} />
      <div className="card mt-4 flex items-center gap-3">
        <label className="text-sm">Degrees</label>
        <select className="border rounded px-2 py-1" value={deg} onChange={e=>setDeg(parseInt(e.target.value))}>
          <option value={90}>90°</option><option value={180}>180°</option><option value={270}>270°</option>
        </select>
        <span className="text-sm text-slate-600">Select pages or leave none selected for all.</span>
      </div>
      {pages.length>0&&<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-4">
        {pages.map(p=>(
          <div key={p.index} className={'relative border rounded overflow-hidden '+(selected.has(p.index)?'ring-2 ring-blue-600':'')} onClick={()=>toggle(p.index)}>
            <img src={p.img} alt={'Page '+(p.index+1)} className="w-full block" />
            <div className="absolute top-1 left-1 text-xs bg-white/80 rounded px-1">{p.index+1}</div>
            <input type="checkbox" className="absolute top-1 right-1" checked={selected.has(p.index)} readOnly />
          </div>
        ))}
      </div>}
      <HowToUse steps={["Drop one PDF.","Pick degrees and (optionally) page ranges or click thumbnails to fill ranges.","Click “Apply & Download”."]} />
      <StickyBar>
        <button className="btn" disabled={!pages.length||busy} onClick={applyRotate}>{busy?'Applying…':'Apply & Download'}</button>
        <button className="btn-secondary" onClick={()=>{setFile(null); setPages([]); setSelected(new Set())}}>Clear</button>
      </StickyBar>
    </div>
  )
}
