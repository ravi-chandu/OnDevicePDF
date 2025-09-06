import { useState } from 'react'
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib'
import Dropzone from '../components/Dropzone.jsx'
import StickyBar from '../components/StickyBar.jsx'
import HowToUse from '../components/HowToUse.jsx'
import SEO from '../components/SEO.jsx'
import pdfjsLib from '../utils/pdfjs.js'

export default function Stamp(){
  const [file,setFile]=useState(null); const [text,setText]=useState('CONFIDENTIAL'); const [pos,setPos]=useState('center')
  const [opacity,setOpacity]=useState(0.2); const [fontSize,setFontSize]=useState(36); const [diagonal,setDiagonal]=useState(true)
  const [numbers,setNumbers]=useState(false); const [busy,setBusy]=useState(false); const [pages,setPages]=useState([])

  async function onFiles([f]){
    setFile(f); const buf=await f.arrayBuffer(); const pdf=await pdfjsLib.getDocument({data:buf}).promise
    const items=[]; for(let n=1;n<=pdf.numPages;n++){ const page=await pdf.getPage(n); const vp=page.getViewport({scale:.2}); const canvas=document.createElement('canvas'); const ctx=canvas.getContext('2d'); canvas.width=vp.width; canvas.height=vp.height; await page.render({canvasContext:ctx,viewport:vp}).promise; items.push({index:n-1,img:canvas.toDataURL('image/png')}) }
    setPages(items)
  }
  async function apply(){
    if(!file) return; setBusy(true); try {
      const buf=await file.arrayBuffer(); const doc=await PDFDocument.load(buf); const font=await doc.embedFont(StandardFonts.HelveticaBold)
      const count=doc.getPageCount()
      for(let i=0;i<count;i++){
        const page=doc.getPage(i); const {width,height}=page.getSize(); const content=numbers?`Page ${i+1}`:text
        const x=pos.includes('left')?40:pos.includes('right')?width-40:width/2; const y=pos.includes('bottom')?40:pos.includes('top')?height-40:height/2
        const opts={x:x-(numbers?0:(content.length*fontSize*0.2)), y, size:fontSize, font, color:rgb(0.2,0.2,0.2), opacity}
        if(diagonal) opts.rotate = degrees(315)
        page.drawText(content, opts)
      }
      const bytes=await doc.save(); const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'})); a.download=`stamped-${Date.now()}.pdf`; a.click(); URL.revokeObjectURL(a.href)
    } finally { setBusy(false) }
  }
  return (
    <div>
      <SEO title="Page Numbers / Watermark" canonical="https://www.ondevicepdf.com/tools/stamp" />
      <h1 className="text-2xl font-semibold mb-4">🔖 Add Page Numbers / Watermark</h1>
      <Dropzone onFiles={onFiles} multiple={false} />
      <div className="card mt-4 grid sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2"><label className="w-32 text-sm">Text</label><input className="border rounded px-3 py-2 w-full" value={text} onChange={e=>setText(e.target.value)} disabled={numbers} /></div>
          <div className="flex items-center gap-2"><label className="w-32 text-sm">Position</label>
            <select className="border rounded px-2 py-2" value={pos} onChange={e=>setPos(e.target.value)}>
              <option value="top-left">Top left</option><option value="top">Top center</option><option value="top-right">Top right</option>
              <option value="center">Center</option><option value="bottom-left">Bottom left</option><option value="bottom">Bottom center</option>
              <option value="bottom-right">Bottom right</option>
            </select></div>
          <div className="flex items-center gap-2"><label className="w-32 text-sm">Font size</label><input type="number" min="8" max="144" className="border rounded px-3 py-2 w-28" value={fontSize} onChange={e=>setFontSize(+e.target.value)} /></div>
          <div className="flex items-center gap-2"><label className="w-32 text-sm">Opacity</label><input type="range" min="0.05" max="1" step="0.05" value={opacity} onChange={e=>setOpacity(parseFloat(e.target.value))} /><span className="text-sm">{opacity}</span></div>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={diagonal} onChange={e=>setDiagonal(e.target.checked)} /> Diagonal</label>
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={numbers} onChange={e=>setNumbers(e.target.checked)} /> Use page numbers</label>
          </div>
        </div>
        <div>
          {pages.length>0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {pages.map(p=>(
                <div key={p.index} className="relative border rounded overflow-hidden">
                  <img src={p.img} className="w-full block" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-xs bg-white/60 px-1 rounded">{numbers?`Page ${p.index+1}`:text}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (<p className="text-sm text-slate-600">Drop a PDF to see preview.</p>)}
        </div>
      </div>
      <HowToUse steps={["Drop one PDF.","Choose position, range, and text.","Optionally add page numbers.","Click “Apply & Download”."]} />
      <StickyBar>
        <button className="btn" disabled={!file||busy} onClick={apply}>{busy?'Applying…':'Apply & Download'}</button>
        <button className="btn-secondary" onClick={()=>{setFile(null); setPages([])}}>Clear</button>
      </StickyBar>
    </div>
  )
}
