import { useEffect, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import Dropzone from '../components/Dropzone.jsx';
import StickyActionBar from '../components/StickyActionBar.jsx';
import HowToUse from '../components/HowToUse.jsx';
import SEO from '../components/SEO.jsx';
import FilenameInput from '../components/FilenameInput.jsx';
import pdfjsLib from '../utils/pdfjs.js';

export default function PDFMerge(){
  const [files, setFiles] = useState([]); // [{file, name, pages}]
  const [busy, setBusy]   = useState(false);
  const [outName, setOutName] = useState(`merged-${new Date().toISOString().slice(0,10)}.pdf`);
  const [reorderMode, setReorderMode] = useState(false);

  function onDrop(newFiles){
    const items = [...newFiles].map(f => ({ file:f, name:f.name, pages:null }));
    setFiles(prev => [...prev, ...items]);
  }

  // lazily compute page counts for badges
  useEffect(()=>{
    (async ()=>{
      for(const it of files){
        if(it.pages != null) continue;
        try{
          const buf = await it.file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({data:buf}).promise;
          it.pages = pdf.numPages;
          setFiles(prev => prev.map(x => x.file===it.file ? it : x));
        }catch{}
      }
    })();
  }, [files]);

  function removeAt(i){ setFiles(prev=> prev.filter((_,idx)=>idx!==i)); }
  function move(i, delta){
    setFiles(prev=>{
      const a=[...prev];
      const n=Math.max(0, Math.min(a.length-1, i+delta));
      if(n===i) return a;
      const [x]=a.splice(i,1); a.splice(n,0,x);
      return a;
    });
  }

  async function handleMerge(){
    if(files.length<2) return;
    setBusy(true);
    try{
      const out = await PDFDocument.create();
      for(const {file} of files){
        const srcBytes = await file.arrayBuffer();
        const src = await PDFDocument.load(srcBytes);
        const copied = await out.copyPages(src, src.getPageIndices());
        copied.forEach(p => out.addPage(p));
      }
      const bytes = await out.save();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([bytes], {type:'application/pdf'}));
      a.download = outName || 'merged.pdf';
      a.click(); URL.revokeObjectURL(a.href);
    } finally { setBusy(false); }
  }

  const btn  = "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50";
  const btn2 = "px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50";

  return (
    <div className="pb-24">
      <SEO title="Merge PDF Files" canonical="https://www.ondevicepdf.com/tools/merge" />
      <h1 className="text-2xl font-semibold mb-4">🧩 Merge PDF Files</h1>

      <Dropzone onFiles={onDrop} multiple />

      {files.length>0 && (
        <>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm text-slate-600">{files.length} file(s)</span>
            <button className={btn2 + (reorderMode ? ' bg-slate-100' : '')} onClick={()=>setReorderMode(v=>!v)}>
              {reorderMode ? '✔ Reorder mode' : 'Reorder mode'}
            </button>
          </div>

          <ul className="mt-3 divide-y border rounded bg-white">
            {files.map((f, i)=>(
              <li key={i} className="flex items-center justify-between gap-2 px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate font-medium">{f.name}</p>
                  <p className="text-xs text-slate-500">{f.pages!=null ? `${f.pages} page(s)` : 'reading…'}</p>
                </div>
                <div className="flex items-center gap-2">
                  {reorderMode && (
                    <>
                      <button className={btn2} onClick={()=>move(i,-1)} title="Move up">↑</button>
                      <button className={btn2} onClick={()=>move(i, 1)} title="Move down">↓</button>
                    </>
                  )}
                  <button className={btn2} onClick={()=>removeAt(i)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 border rounded p-3 bg-white shadow-sm">
            <FilenameInput value={outName} onChange={setOutName} />
          </div>
        </>
      )}

      <StickyActionBar>
        <button className={btn} disabled={files.length<2 || busy} onClick={handleMerge}>
          {busy ? 'Merging…' : 'Merge & Download'}
        </button>
      </StickyActionBar>

      <div className="mt-6">
        <HowToUse steps={[
          "Drop or choose multiple PDFs.",
          "Reorder files (use Reorder mode on mobile) or remove any file.",
          "Click “Merge & Download”.",
          "Privacy: everything runs in your browser — files never leave your device."
        ]}/>
      </div>
    </div>
  );
}
