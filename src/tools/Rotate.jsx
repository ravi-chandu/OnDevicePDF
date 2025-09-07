import { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import Dropzone from '../components/Dropzone.jsx';
import StickyActionBar from '../components/StickyActionBar.jsx';
import HowToUse from '../components/HowToUse.jsx';
import SEO from '../components/SEO.jsx';
import SelectionToolbar from '../components/SelectionToolbar.jsx';
import FilenameInput from '../components/FilenameInput.jsx';
import pdfjsLib from '../utils/pdfjs.js';

export default function RotatePages(){
  // pages: [{img, rotate:number}]
  const [file,setFile]=useState(null);
  const [pages,setPages]=useState([]);
  const [selected,setSelected]=useState(new Set());
  const [busy,setBusy]=useState(false);
  const [outName,setOutName]=useState(`rotate-${new Date().toISOString().slice(0,10)}.pdf`);

  async function onFiles([f]){
    setFile(f); setSelected(new Set());
    const buf=await f.arrayBuffer();
    const pdf=await pdfjsLib.getDocument({data:buf}).promise;
    const arr=[];
    for(let n=1;n<=pdf.numPages;n++){
      const p=await pdf.getPage(n); const vp=p.getViewport({scale:.2});
      const canvas=document.createElement('canvas'); const ctx=canvas.getContext('2d');
      canvas.width=vp.width; canvas.height=vp.height;
      await p.render({canvasContext:ctx,viewport:vp}).promise;
      arr.push({img:canvas.toDataURL('image/png'), rotate:0});
    }
    setPages(arr);
  }

  function rotatePreview(delta){
    if(!selected.size) return;
    setPages(prev => prev.map((p,i)=> selected.has(i) ? {...p, rotate: ((p.rotate+delta)%360+360)%360 } : p));
  }

  async function handleSave(){
    if(!file) return;
    setBusy(true);
    try{
      const buf=await file.arrayBuffer();
      const src=await PDFDocument.load(buf);
      const out=await PDFDocument.create();
      const total = src.getPageCount();
      for(let i=0;i<total;i++){
        const [cp]=await out.copyPages(src,[i]);
        const r = pages[i]?.rotate || 0;
        if(r) cp.setRotation(degrees(r));
        out.addPage(cp);
      }
      const bytes=await out.save();
      const a=document.createElement('a');
      a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
      a.download=outName||'rotate.pdf'; a.click(); URL.revokeObjectURL(a.href);
    } finally { setBusy(false); }
  }

  const total = pages.length;
  const selectedCount = selected.size;
  const btn  = "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50";
  const btn2 = "px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50";

  return (
    <div className="pb-24">
      <SEO title="Rotate Pages" canonical="https://www.ondevicepdf.com/tools/rotate" />
      <h1 className="text-2xl font-semibold mb-4">🔄 Rotate Pages</h1>

      <Dropzone onFiles={onFiles} multiple={false} />

      {total>0 && (
        <>
          <div className="flex items-center gap-2 mt-3">
            <SelectionToolbar total={total} selected={selected} onChange={setSelected} />
            <div className="flex items-center gap-2 ml-auto">
              <button className={btn2} disabled={!selectedCount} onClick={()=>rotatePreview(-90)}>⟲ Rotate Left</button>
              <button className={btn2} disabled={!selectedCount} onClick={()=>rotatePreview(90)}>⟳ Rotate Right</button>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-2">
            {pages.map((p,i)=>(
              <div key={i}
                   className={'relative border rounded overflow-hidden '+(selected.has(i)?' ring-2 ring-blue-600':'')}
                   onClick={()=>{ const s=new Set(selected); s.has(i)?s.delete(i):s.add(i); setSelected(s); }}>
                <img src={p.img} alt={'Page '+(i+1)} className="w-full block" />
                <div className="absolute top-1 left-1 text-xs bg-white/80 rounded px-1">{i+1}</div>
                {p.rotate!==0 && (
                  <div className="absolute bottom-1 left-1 text-[11px] bg-amber-500 text-white px-1.5 py-0.5 rounded">
                    Rotated {p.rotate}°
                  </div>
                )}
                <input type="checkbox" className="absolute top-1 right-1" checked={!!selected.has(i)} readOnly />
              </div>
            ))}
          </div>

          <div className="mt-4 border rounded p-3 bg-white shadow-sm">
            <FilenameInput value={outName} onChange={setOutName} />
          </div>
        </>
      )}

      <StickyActionBar>
        <button className={btn} disabled={!total || busy} onClick={handleSave}>
          {busy ? 'Applying…' : 'Apply & Download'}
        </button>
      </StickyActionBar>

      <div className="mt-6">
        <HowToUse steps={[
          "Drop one PDF.",
          "Select pages (or use presets), then rotate left/right — rotation is previewed on tiles.",
          "Click “Apply & Download” to save changes.",
          "Privacy: everything runs in your browser — files never leave your device."
        ]} />
      </div>
    </div>
  );
}
