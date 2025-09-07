import { useState, useRef } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import Dropzone from '../components/Dropzone.jsx';
import StickyActionBar from '../components/StickyActionBar.jsx';
import HowToUse from '../components/HowToUse.jsx';
import SEO from '../components/SEO.jsx';
import SelectionToolbar from '../components/SelectionToolbar.jsx';
import FilenameInput from '../components/FilenameInput.jsx';
import pdfjsLib from '../utils/pdfjs.js';

export default function Organize(){
  const [file,setFile]=useState(null);
  const [thumbs,setThumbs]=useState([]);   // [{index,img}]
  const [order,setOrder]=useState([]);     // visual order of page indices
  const [selected,setSelected]=useState(new Set());
  const [busy,setBusy]=useState(false);
  const [outName,setOutName]=useState(`organized-${new Date().toISOString().slice(0,10)}.pdf`);
  const dragFrom = useRef(null);

  async function onFiles([f]){
    setFile(f); setSelected(new Set());
    const buf=await f.arrayBuffer(); const pdf=await pdfjsLib.getDocument({data:buf}).promise;
    const items=[];
    for(let n=1;n<=pdf.numPages;n++){
      const page=await pdf.getPage(n); const vp=page.getViewport({scale:.2});
      const canvas=document.createElement('canvas'); const ctx=canvas.getContext('2d');
      canvas.width=vp.width; canvas.height=vp.height;
      await page.render({canvasContext:ctx,viewport:vp}).promise;
      items.push({index:n-1,img:canvas.toDataURL('image/png')});
    }
    setThumbs(items); setOrder(items.map(p=>p.index));
  }
  function toggle(idx){ const s=new Set(selected); s.has(idx)?s.delete(idx):s.add(idx); setSelected(s); }

  function onDragStart(idx){ return e=>{ dragFrom.current=idx; e.dataTransfer.effectAllowed='move'; }; }
  function onDragOver(e){ e.preventDefault(); e.dataTransfer.dropEffect='move'; }
  function onDrop(idx){ return e=>{ e.preventDefault(); const from=dragFrom.current; if(from==null||from===idx) return;
    setOrder(prev=>{ const arr=[...prev]; const i=arr.indexOf(from); const j=arr.indexOf(idx);
      if(i<0||j<0) return prev; const [v]=arr.splice(i,1); arr.splice(j,0,v); return arr; });
    dragFrom.current=null;
  };}

  async function applyRotate(deg){
    if(!file) return; setBusy(true);
    try{
      const buf=await file.arrayBuffer(), src=await PDFDocument.load(buf), out=await PDFDocument.create();
      for(const srcIndex of order){
        const [p]=await out.copyPages(src,[srcIndex]);
        if(selected.size===0 || selected.has(srcIndex)) p.setRotation(degrees(deg));
        out.addPage(p);
      }
      const bytes=await out.save();
      const a=document.createElement('a');
      a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
      a.download=outName||'organized.pdf'; a.click(); URL.revokeObjectURL(a.href);
    } finally { setBusy(false); }
  }

  async function applyDelete(){
    if(!file) return; setBusy(true);
    try{
      const buf=await file.arrayBuffer(), src=await PDFDocument.load(buf), out=await PDFDocument.create();
      const keep = order.filter(i=>!selected.has(i));
      const pages=await out.copyPages(src, keep); pages.forEach(p=>out.addPage(p));
      const bytes=await out.save();
      const a=document.createElement('a');
      a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
      a.download=outName||'organized.pdf'; a.click(); URL.revokeObjectURL(a.href);
    } finally { setBusy(false); }
  }

  const btn  = "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50";

  return (
    <div>
      <SEO title="Organize Pages" canonical="https://www.ondevicepdf.com/tools/organize" />
      <h1 className="text-2xl font-semibold mb-4">🗂️ Organize Pages</h1>
      <Dropzone onFiles={onFiles} multiple={false} />

      {order.length>0 && (
        <>
          <SelectionToolbar total={order.length} selected={selected} onChange={setSelected} />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-2">
            {order.map(idx=>{
              const p=thumbs.find(t=>t.index===idx);
              return (
                <div key={idx} draggable onDragStart={onDragStart(idx)} onDragOver={onDragOver} onDrop={onDrop(idx)}
                  className={'relative border rounded overflow-hidden '+(selected.has(idx)?'ring-2 ring-blue-600':'')}
                  onClick={()=>toggle(idx)}>
                  <img src={p.img} alt={'Page '+(idx+1)} className="w-full block" />
                  <div className="absolute top-1 left-1 text-xs bg-white/80 rounded px-1">{order.indexOf(idx)+1}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 border rounded p-3 bg-white shadow-sm">
            <FilenameInput value={outName} onChange={setOutName} />
          </div>
        </>
      )}

      <HowToUse steps={[
        "Drop one PDF to see thumbnails.",
        "Drag to reorder; click to select; use Rotate/Delete with presets.",
        "Click “Save as PDF”.",
        "Privacy: everything runs in your browser — files never leave your device."
      ]} />

      <StickyActionBar>
        <button className={btn} disabled={!order.length||busy} onClick={()=>applyRotate(90)}>Rotate 90°</button>
        <button className={btn} disabled={!order.length||busy} onClick={applyDelete}>Delete selected</button>
      </StickyActionBar>
    </div>
  );
}
