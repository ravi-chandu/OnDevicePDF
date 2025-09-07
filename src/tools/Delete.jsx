import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import Dropzone from '../components/Dropzone.jsx';
import StickyActionBar from '../components/StickyActionBar.jsx'; // or StickyBar.jsx
import HowToUse from '../components/HowToUse.jsx';
import SEO from '../components/SEO.jsx';
import SelectionToolbar from '../components/SelectionToolbar.jsx';
import FilenameInput from '../components/FilenameInput.jsx';
import pdfjsLib from '../utils/pdfjs.js';

export default function DeletePages(){
  const [file,setFile]=useState(null);
  // pages: [{ srcIndex, img, removed }]
  const [pages,setPages]=useState([]);
  const [selected,setSelected]=useState(new Set()); // selection by position 0..n-1
  const [busy,setBusy]=useState(false);
  const [outName,setOutName]=useState(`delete-${new Date().toISOString().slice(0,10)}.pdf`);

  async function onFiles([f]){
    setFile(f);
    const buf=await f.arrayBuffer(); const pdf=await pdfjsLib.getDocument({data:buf}).promise;
    const items=[];
    for(let n=1;n<=pdf.numPages;n++){
      const page=await pdf.getPage(n); const vp=page.getViewport({scale:.2});
      const canvas=document.createElement('canvas'); const ctx=canvas.getContext('2d');
      canvas.width=vp.width; canvas.height=vp.height;
      await page.render({canvasContext:ctx,viewport:vp}).promise;
      items.push({ srcIndex:n-1, img:canvas.toDataURL('image/png'), removed:false });
    }
    setPages(items); setSelected(new Set());
  }
  function toggle(i){ const s=new Set(selected); s.has(i)?s.delete(i):s.add(i); setSelected(s); }

  function previewDeleteSelected(){
    if(!selected.size) return;
    setPages(prev => prev.map((p,idx)=> selected.has(idx)? {...p, removed:true} : p));
    setSelected(new Set());
  }
  function restoreAll(){
    setPages(prev => prev.map(p=>({...p, removed:false})));
    setSelected(new Set());
  }

  async function handleSave(){
    if(!file) return;
    const keep = pages.filter(p=>!p.removed).map(p=>p.srcIndex);
    if(keep.length===0){ alert('Nothing to save. All pages are marked as deleted.'); return; }
    setBusy(true);
    try{
      const buf=await file.arrayBuffer(), src=await PDFDocument.load(buf), out=await PDFDocument.create();
      const copied=await out.copyPages(src, keep); copied.forEach(p=>out.addPage(p));
      const bytes=await out.save();
      const a=document.createElement('a');
      a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
      a.download=outName||'delete.pdf'; a.click(); URL.revokeObjectURL(a.href);
    } finally { setBusy(false); }
  }

  const total = pages.length;
  const deletedCount = pages.filter(p=>p.removed).length;
  const remaining = total - deletedCount;

  const btn  = "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50";
  const btn2 = "px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50";

  return (
    <div className="pb-24">
      <SEO title="Delete Pages" canonical="https://www.ondevicepdf.com/tools/delete" />
      <h1 className="text-2xl font-semibold mb-4">🗑️ Delete Pages</h1>

      <Dropzone onFiles={onFiles} multiple={false} />

      {total>0 && (
        <>
          <SelectionToolbar total={total} selected={selected} onChange={setSelected} />

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700 mb-2">
            <span>Remaining: <b>{remaining}</b> of <b>{total}</b></span>
            {deletedCount>0 && <span>Deleted (preview): <b>{deletedCount}</b></span>}
            {deletedCount>0 && <button className={btn2} onClick={restoreAll}>Restore all</button>}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {pages.map((p,idx)=>(
              <div key={p.srcIndex}
                   className={
                     'relative border rounded overflow-hidden ' +
                     (p.removed ? 'opacity-50 grayscale ' : '') +
                     (selected.has(idx) ? ' ring-2 ring-blue-600' : '')
                   }
                   onClick={()=>toggle(idx)}>
                <img src={p.img} alt={'Page '+(idx+1)} className="w-full block" />
                <div className="absolute top-1 left-1 text-xs bg-white/80 rounded px-1">{idx+1}</div>
                <input type="checkbox" className="absolute top-1 right-1" checked={selected.has(idx)} readOnly />
                {p.removed && (
                  <div className="absolute bottom-1 left-1 text-[11px] bg-red-600 text-white px-1.5 py-0.5 rounded">
                    Deleted
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 border rounded p-3 bg-white shadow-sm">
            <FilenameInput value={outName} onChange={setOutName} />
          </div>
        </>
      )}

      <StickyActionBar>
        <button className={btn2} disabled={!selected.size} onClick={previewDeleteSelected} title="Mark selected pages as deleted (preview)">
          Delete selected (preview)
        </button>
        <button className={btn} disabled={!total || remaining===0 || busy} onClick={handleSave} title="Export without preview-deleted pages">
          {busy ? 'Saving…' : 'Save & Download'}
        </button>
      </StickyActionBar>

      <div className="mt-6">
        <HowToUse steps={[
          "Drop one PDF.",
          "Select pages to remove (use Odd/Even/Halves/All/None/Invert), then click “Delete selected (preview)”.",
          "Review the grid: deleted pages are dimmed and labeled.",
          "If needed, click “Restore all”. When satisfied, click “Save & Download”.",
          "Privacy: everything runs in your browser — files never leave your device."
        ]} />
      </div>
    </div>
  );
}
