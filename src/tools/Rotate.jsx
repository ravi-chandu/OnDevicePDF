import { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import Dropzone from '../components/Dropzone.jsx';
import StickyActionBar from '../components/StickyActionBar.jsx';
import HowToUse from '../components/HowToUse.jsx';
import SEO from '../components/SEO.jsx';
import SelectionToolbar from '../components/SelectionToolbar.jsx';
import FilenameInput from '../components/FilenameInput.jsx';
import pdfjsLib from '../utils/pdfjs.js';

export default function Rotate(){
  const [file,setFile]=useState(null);
  const [pages,setPages]=useState([]);
  const [selected,setSelected]=useState(new Set());
  const [deg,setDeg]=useState(90);
  const [busy,setBusy]=useState(false);
  const [outName,setOutName]=useState(`rotate-${new Date().toISOString().slice(0,10)}.pdf`);

  async function onFiles([f]){
    setFile(f);
    const buf=await f.arrayBuffer(); const pdf=await pdfjsLib.getDocument({data:buf}).promise;
    const items=[];
    for(let n=1;n<=pdf.numPages;n++){
      const page=await pdf.getPage(n); const vp=page.getViewport({scale:.2});
      const canvas=document.createElement('canvas'); const ctx=canvas.getContext('2d');
      canvas.width=vp.width; canvas.height=vp.height;
      await page.render({canvasContext:ctx,viewport:vp}).promise;
      items.push({index:n-1,img:canvas.toDataURL('image/png')});
    }
    setPages(items); setSelected(new Set());
  }
  function toggle(i){ const s=new Set(selected); s.has(i)?s.delete(i):s.add(i); setSelected(s); }

  async function applyRotate(){
    if(!file) return; setBusy(true);
    try{
      const buf=await file.arrayBuffer(), src=await PDFDocument.load(buf), out=await PDFDocument.create();
      const total=pages.length;
      const targets = selected.size? Array.from(selected).sort((a,b)=>a-b) : Array.from({length:total},(_,i)=>i);
      for(let i=0;i<total;i++){
        const [p]=await out.copyPages(src,[i]);
        if(targets.includes(i)) p.setRotation(degrees(parseInt(deg,10)||0));
        out.addPage(p);
      }
      const bytes=await out.save();
      const a=document.createElement('a');
      a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
      a.download=outName||'rotate.pdf'; a.click(); URL.revokeObjectURL(a.href);
    } finally { setBusy(false); }
  }

  const btn  = "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50";
  const btn2 = "px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50";

  return (
    <div>
      <SEO title="Rotate Pages" canonical="https://www.ondevicepdf.com/tools/rotate" />
      <h1 className="text-2xl font-semibold mb-4">🔄 Rotate Pages</h1>
      <Dropzone onFiles={onFiles} multiple={false} />

      {pages.length>0 && (
        <>
          <SelectionToolbar total={pages.length} selected={selected} onChange={setSelected} />
          <div className="mb-3 flex items-center gap-3 text-sm">
            <label className="inline-flex items-center gap-2"><input type="radio" name="deg" checked={deg===90} onChange={()=>setDeg(90)} /> 90°</label>
            <label className="inline-flex items-center gap-2"><input type="radio" name="deg" checked={deg===180} onChange={()=>setDeg(180)} /> 180°</label>
            <label className="inline-flex items-center gap-2"><input type="radio" name="deg" checked={deg===270} onChange={()=>setDeg(270)} /> 270°</label>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-2">
            {pages.map(p=>(
              <div key={p.index}
                   className={'relative border rounded overflow-hidden '+(selected.has(p.index)?'ring-2 ring-blue-600':'')}
                   onClick={()=>toggle(p.index)}>
                <img src={p.img} alt={'Page '+(p.index+1)} className="w-full block" />
                <div className="absolute top-1 left-1 text-xs bg-white/80 rounded px-1">{p.index+1}</div>
                <input type="checkbox" className="absolute top-1 right-1" checked={selected.has(p.index)} readOnly />
              </div>
            ))}
          </div>

          <div className="mt-4 border rounded p-3 bg-white shadow-sm">
            <FilenameInput value={outName} onChange={setOutName} />
          </div>
        </>
      )}

      <HowToUse steps={[
        "Drop one PDF.",
        "Use selection presets or click thumbnails.",
        "Choose 90/180/270°.",
        "Click “Apply & Download”.",
        "Privacy: everything runs in your browser — files never leave your device."
      ]} />

      <StickyActionBar>
        <button className={btn} disabled={!pages.length||busy} onClick={applyRotate}>
          {busy?'Applying…':'Apply & Download'}
        </button>
        <button className={btn2} onClick={()=>setSelected(new Set())}>Clear selection</button>
      </StickyActionBar>
    </div>
  );
}
