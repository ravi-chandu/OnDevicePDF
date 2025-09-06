import { useState } from 'react'
import { PDFDocument, degrees } from 'pdf-lib'
import Dropzone from '../components/Dropzone.jsx'
import StickyBar from '../components/StickyBar.jsx'
import HowToUse from '../components/HowToUse.jsx'
import SEO from '../components/SEO.jsx'
import pdfjsLib from '../utils/pdfjs.js'

export default function Organize(){
  const [file,setFile]=useState(null); const [pages,setPages]=useState([]); const [order,setOrder]=useState([]); const [selected,setSelected]=useState(new Set()); const [busy,setBusy]=useState(false)
  async function onFiles([f]){
    setFile(f); const buf=await f.arrayBuffer(); const pdf=await pdfjsLib.getDocument({data:buf}).promise
    const items=[]; for(let n=1;n<=pdf.numPages;n++){ const page=await pdf.getPage(n); const vp=page.getViewport({scale:.2}); const canvas=document.createElement('canvas'); const ctx=canvas.getContext('2d'); canvas.width=vp.width; canvas.height=vp.height; await page.render({canvasContext:ctx,viewport:vp}).promise; items.push({index:n-1,img:canvas.toDataURL('image/png')}) }
    setPages(items); setOrder(items.map(p=>p.index)); setSelected(new Set())
  }
  function toggle(i){ const s=new Set(selected); s.has(i)?s.delete(i):s.add(i); setSelected(s) }
  function move(from, to){ const arr=[...order]; const idx=arr.indexOf(from); if(idx<0) return; arr.splice(idx,1); arr.splice(to,0,from); setOrder(arr) }
  async function applyRotate(deg){
    if(!file) return; setBusy(true); try {
      const buf=await file.arrayBuffer(), src=await PDFDocument.load(buf), out=await PDFDocument.create()
      const toKeep=order; for(let i=0;i<toKeep.length;i++){ const srcIndex=toKeep[i]; const [p]=await out.copyPages(src,[srcIndex]); if(selected.has(srcIndex)) p.setRotation(degrees(deg)); out.addPage(p) }
      const bytes=await out.save(); const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'})); a.download=`organized-rot${deg}-${Date.now()}.pdf`; a.click(); URL.revokeObjectURL(a.href)
    } finally { setBusy(false) }
  }
  async function applyDelete(){
    if(!file) return; setBusy(true); try {
      const buf=await file.arrayBuffer(), src=await PDFDocument.load(buf), out=await PDFDocument.create()
      const toKeep=order.filter(i=>!selected.has(i)); const pages=await out.copyPages(src,toKeep); pages.forEach(p=>out.addPage(p)); const bytes=await out.save()
      const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'})); a.download=`organized-del-${Date.now()}.pdf`; a.click(); URL.revokeObjectURL(a.href)
    } finally { setBusy(false) }
  }
  return (
    <div>
      <SEO title="Organize Pages" canonical="https://www.ondevicepdf.com/tools/organize" />
      <h1 className="text-2xl font-semibold mb-4">🗂️ Organize Pages</h1>
      <Dropzone onFiles={onFiles} multiple={false} />
      {pages.length>0 && <div className="mt-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {order.map((idx,pos)=>{ const p=pages.find(x=>x.index===idx); return (
            <div key={idx} className={'relative border rounded overflow-hidden '+(selected.has(idx)?'ring-2 ring-blue-600':'')} onClick={()=>toggle(idx)}>
              <img src={p.img} alt={'Page '+(idx+1)} className="w-full block" />
              <div className="absolute top-1 left-1 text-xs bg-white/80 rounded px-1">{pos+1}</div>
              <div className="absolute bottom-1 right-1 flex gap-1">
                <button className="text-xs bg-white/80 rounded px-1" onClick={(e)=>{e.stopPropagation(); move(idx, Math.max(0,pos-1))}}>←</button>
                <button className="text-xs bg-white/80 rounded px-1" onClick={(e)=>{e.stopPropagation(); move(idx, Math.min(order.length-1,pos+1))}}>→</button>
              </div>
            </div>
          )})}
        </div>
      </div>}
      <HowToUse steps={["Drop one PDF to see thumbnails.","Drag (or use arrows) to reorder; click to select; use Rotate/Delete.","Click “Save as PDF”."]} />
      <StickyBar>
        <button className="btn" disabled={!pages.length||busy} onClick={()=>applyRotate(90)}>Rotate 90°</button>
        <button className="btn" disabled={!pages.length||busy} onClick={()=>applyRotate(180)}>Rotate 180°</button>
        <button className="btn" disabled={!pages.length||busy||!selected.size} onClick={applyDelete}>Delete selected</button>
      </StickyBar>
    </div>
  )
}
