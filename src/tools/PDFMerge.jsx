import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import Dropzone from '../components/Dropzone.jsx';
import StickyActionBar from '../components/StickyActionBar.jsx';
import HowToUse from '../components/HowToUse.jsx';
import SEO from '../components/SEO.jsx';
import FilenameInput from '../components/FilenameInput.jsx';

export default function PDFMerge(){
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [outName, setOutName] = useState(`merged-${new Date().toISOString().slice(0,10)}.pdf`);
  const dragIndex = useRef(null);

  function addFiles(sel){ setFiles(prev => [...prev, ...sel]); }
  function removeAt(i){ setFiles(prev => prev.filter((_,idx)=>idx!==i)); }
  function move(i, dir){
    setFiles(prev => {
      const arr=[...prev]; const j=i+dir; if(j<0||j>=arr.length) return prev;
      const [it]=arr.splice(i,1); arr.splice(j,0,it); return arr;
    });
  }
  function onDragStart(i){ return e=>{ dragIndex.current=i; e.dataTransfer.effectAllowed='move'; }; }
  function onDragOver(e){ e.preventDefault(); e.dataTransfer.dropEffect='move'; }
  function onDrop(i){ return e=>{ e.preventDefault(); const from=dragIndex.current; if(from==null||from===i) return;
    setFiles(prev=>{ const arr=[...prev]; const [it]=arr.splice(from,1); arr.splice(i,0,it); return arr; });
    dragIndex.current=null;
  };}

  async function handleMerge(){
    if(!files.length) return; setBusy(true);
    try {
      const out = await PDFDocument.create();
      for (const f of files){
        const buf = await f.arrayBuffer();
        const src = await PDFDocument.load(buf);
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach(p=>out.addPage(p));
      }
      const bytes = await out.save();
      const a=document.createElement('a');
      a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
      a.download=outName||'merged.pdf'; a.click(); URL.revokeObjectURL(a.href);
    } finally { setBusy(false); }
  }

  const btn  = "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50";
  const btn2 = "px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50";

  return (
    <div>
      <SEO title="Merge PDFs" canonical="https://www.ondevicepdf.com/tools/merge" />
      <h1 className="text-2xl font-semibold mb-4">🧩 Merge PDF Files</h1>
      <Dropzone onFiles={addFiles} multiple />
      {files.length>0 && (
        <div className="mt-4 border rounded p-3 bg-white shadow-sm">
          <h2 className="font-medium mb-2">Selected files</h2>
          <ul>
            {files.map((f,i)=>(
              <li key={i} draggable onDragStart={onDragStart(i)} onDragOver={onDragOver} onDrop={onDrop(i)}
                  className="flex items-center gap-3 py-2 border-b last:border-0">
                <span className="cursor-move select-none px-2">↕</span>
                <span className="truncate flex-1">{f.name}</span>
                <div className="flex gap-2">
                  <button className={btn2} onClick={()=>move(i,-1)} title="Move up">↑</button>
                  <button className={btn2} onClick={()=>move(i, 1)} title="Move down">↓</button>
                  <button className={btn2} onClick={()=>removeAt(i)} title="Remove">✖</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-4 border rounded p-3 bg-white shadow-sm">
        <FilenameInput value={outName} onChange={setOutName} />
      </div>

      <HowToUse steps={[
        "Drop or choose files.",
        "Reorder the list using drag or up/down.",
        "Click Merge & Download.",
        "Privacy: everything runs in your browser — files never leave your device."
      ]} />

      <StickyActionBar>
        <button className={btn} disabled={!files.length||busy} onClick={handleMerge}>
          {busy?'Merging…':'Merge & Download'}
        </button>
        <button className={btn2} onClick={()=>setFiles([])}>Clear</button>
      </StickyActionBar>
    </div>
  );
}
