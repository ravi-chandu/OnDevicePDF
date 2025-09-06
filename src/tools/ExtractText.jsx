import { useState } from 'react'
import pdfjsLib from '../utils/pdfjs.js'
import Dropzone from '../components/Dropzone.jsx'
import StickyBar from '../components/StickyBar.jsx'
import HowToUse from '../components/HowToUse.jsx'
import SEO from '../components/SEO.jsx'

export default function ExtractText(){
  const [file,setFile]=useState(null); const [text,setText]=useState(''); const [busy,setBusy]=useState(false)
  async function onFiles([f]){
    setFile(f); setBusy(true); try {
      const buf=await f.arrayBuffer(); const pdf=await pdfjsLib.getDocument({data:buf}).promise
      let out=''; for(let n=1;n<=pdf.numPages;n++){ const page=await pdf.getPage(n); const tc=await page.getTextContent(); out+=tc.items.map(i=>i.str).join(' ')+'\n\n' } setText(out.trim())
    } finally { setBusy(false) }
  }
  function downloadTxt(){ const blob=new Blob([text],{type:'text/plain'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`extracted-${Date.now()}.txt`; a.click(); URL.revokeObjectURL(a.href) }
  return (
    <div>
      <SEO title="Extract Text" canonical="https://www.ondevicepdf.com/tools/text" />
      <h1 className="text-2xl font-semibold mb-4">📝 Extract Text</h1>
      <Dropzone onFiles={onFiles} multiple={false} />
      <div className="card mt-4"><textarea className="w-full h-60 border rounded p-3" value={text} onChange={e=>setText(e.target.value)} /></div>
      <HowToUse steps={["Drop one PDF.","See extracted text below.","Download as .txt or copy."]} />
      <StickyBar>
        <button className="btn" disabled={!text} onClick={downloadTxt}>Download .txt</button>
        <button className="btn-secondary" onClick={()=>{setFile(null); setText('')}}>Clear</button>
      </StickyBar>
    </div>
  )
}
