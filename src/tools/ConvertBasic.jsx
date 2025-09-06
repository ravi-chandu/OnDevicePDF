import { useState } from 'react'
import JSZip from 'jszip'
import pdfjsLib from '../utils/pdfjs.js'
import Dropzone from '../components/Dropzone.jsx'
import StickyBar from '../components/StickyBar.jsx'
import HowToUse from '../components/HowToUse.jsx'
import SEO from '../components/SEO.jsx'

export default function ConvertBasic(){
  const [file,setFile]=useState(null); const [pages,setPages]=useState(0); const [busy,setBusy]=useState(false); const [mode,setMode]=useState('png')
  async function onFiles([f]){ setFile(f); const buf=await f.arrayBuffer(); const pdf=await pdfjsLib.getDocument({data:buf}).promise; setPages(pdf.numPages) }
  async function exportImages(){
    if(!file) return; setBusy(true); try {
      const zip=new JSZip(); const buf=await file.arrayBuffer(); const pdf=await pdfjsLib.getDocument({data:buf}).promise
      for(let n=1;n<=pdf.numPages;n++){ const page=await pdf.getPage(n); const vp=page.getViewport({scale:2}); const canvas=document.createElement('canvas'); const ctx=canvas.getContext('2d'); canvas.width=vp.width; canvas.height=vp.height; await page.render({canvasContext:ctx,viewport:vp}).promise
        const mime=mode==='jpg'?'image/jpeg':'image/png'; const dataUrl=canvas.toDataURL(mime,0.92); const base64=dataUrl.split(',')[1]; zip.file(`page-${n}.${mode}`, base64, {base64:true}) }
      const zipBlob=await zip.generateAsync({type:'blob'}); const a=document.createElement('a'); a.href=URL.createObjectURL(zipBlob); a.download=`images-${Date.now()}.zip`; a.click(); URL.revokeObjectURL(a.href)
    } finally { setBusy(false) }
  }
  return (
    <div>
      <SEO title="Convert (Basic)" canonical="https://www.ondevicepdf.com/tools/convert" />
      <h1 className="text-2xl font-semibold mb-4">⇄ Convert (Basic)</h1>
      <Dropzone onFiles={onFiles} multiple={false} />{pages>0 && <p className="mt-2 text-sm text-slate-600">Pages: {pages}</p>}
      <div className="card mt-4 flex items-center gap-3"><label className="text-sm">Export as</label>
        <select className="border rounded px-2 py-2" value={mode} onChange={e=>setMode(e.target.value)}><option value="png">Images (PNG)</option><option value="jpg">Images (JPG)</option></select>
      </div>
      <HowToUse steps={["Drop one PDF.","Choose output format (images).","Click to export as ZIP."]} />
      <StickyBar>
        <button className="btn" disabled={!file||busy} onClick={exportImages}>{busy?'Exporting…':'Export as ZIP'}</button>
        <button className="btn-secondary" onClick={()=>{setFile(null); setPages(0)}}>Clear</button>
      </StickyBar>
    </div>
  )
}
