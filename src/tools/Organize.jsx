import { useRef, useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import Dropzone from '../components/Dropzone.jsx';
import StickyActionBar from '../components/StickyActionBar.jsx'; // if your file is StickyBar.jsx, swap the import
import HowToUse from '../components/HowToUse.jsx';
import SEO from '../components/SEO.jsx';
import SelectionToolbar from '../components/SelectionToolbar.jsx';
import FilenameInput from '../components/FilenameInput.jsx';
import pdfjsLib from '../utils/pdfjs.js';

export default function Organize(){
  // pages: [{ srcIndex, img, removed:boolean, rotate:number }]
  const [pages, setPages] = useState([]);
  const [file, setFile] = useState(null);
  const [selectedSrc, setSelectedSrc] = useState(new Set()); // selection by srcIndex (stable across reorder)
  const [outName, setOutName] = useState(`organized-${new Date().toISOString().slice(0,10)}.pdf`);
  const [busy, setBusy] = useState(false);
  const dragFrom = useRef(null);

  async function onFiles([f]){
    setFile(f);
    setSelectedSrc(new Set());
    const buf = await f.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    const items = [];
    for(let n=1; n<=pdf.numPages; n++){
      const page = await pdf.getPage(n);
      const vp = page.getViewport({ scale: .2 });
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = vp.width; canvas.height = vp.height;
      await page.render({ canvasContext: ctx, viewport: vp }).promise;
      items.push({ srcIndex: n-1, img: canvas.toDataURL('image/png'), removed:false, rotate:0 });
    }
    setPages(items);
  }

  // --- selection helpers (adapter to SelectionToolbar which uses positions) ---
  const selectedPositions = new Set(pages.map((p,i)=> selectedSrc.has(p.srcIndex) ? i : null).filter(v=>v!==null));
  function onPositionsChange(posSet){
    const s = new Set(Array.from(posSet).map(i => pages[i]?.srcIndex).filter(v=>v!==undefined));
    setSelectedSrc(s);
  }

  // --- drag reordering (positions reorder the pages array) ---
  function onDragStart(pos){ return e=>{ dragFrom.current = pos; e.dataTransfer.effectAllowed = 'move'; }; }
  function onDragOver(e){ e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }
  function onDrop(pos){ return e=>{
    e.preventDefault();
    const from = dragFrom.current;
    if(from==null || from===pos) return;
    setPages(prev=>{
      const arr=[...prev];
      const [it]=arr.splice(from,1);
      arr.splice(pos,0,it);
      return arr;
    });
    dragFrom.current = null;
  };}

  function toggleByPos(pos){
    const src = pages[pos].srcIndex;
    const s = new Set(selectedSrc);
    s.has(src) ? s.delete(src) : s.add(src);
    setSelectedSrc(s);
  }

  // --- preview actions ---
  function previewRotate(delta){
    if(!selectedSrc.size) return;
    setPages(prev => prev.map(p => selectedSrc.has(p.srcIndex) ? {...p, rotate: ((p.rotate + delta) % 360 + 360) % 360} : p));
  }
  function previewDeleteSelected(){
    if(!selectedSrc.size) return;
    setPages(prev => prev.map(p => selectedSrc.has(p.srcIndex) ? {...p, removed:true} : p));
    setSelectedSrc(new Set());
  }
  function restoreAll(){
    setPages(prev => prev.map(p => ({...p, removed:false, rotate:p.rotate})));
    setSelectedSrc(new Set());
  }

  async function handleSave(){
    if(!file) return;
    const keep = pages.filter(p => !p.removed);
    if(keep.length===0){ alert('Nothing to save. All pages are marked deleted.'); return; }
    setBusy(true);
    try{
      const buf = await file.arrayBuffer();
      const src = await PDFDocument.load(buf);
      const out = await PDFDocument.create();
      for(const p of keep){
        const [cp] = await out.copyPages(src, [p.srcIndex]);
        if((p.rotate||0) !== 0) cp.setRotation(degrees(p.rotate));
        out.addPage(cp);
      }
      const bytes = await out.save();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([bytes], {type:'application/pdf'}));
      a.download = outName || 'organized.pdf';
      a.click();
      URL.revokeObjectURL(a.href);
    } finally { setBusy(false); }
  }

  const total = pages.length;
  const deletedCount = pages.filter(p=>p.removed).length;
  const remaining = total - deletedCount;

  const btn = "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50";
  const btn2 = "px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50";

  return (
    <div className="pb-24">
      <SEO title="Organize Pages" canonical="https://www.ondevicepdf.com/tools/organize" />
      <h1 className="text-2xl font-semibold mb-4">🗂️ Organize Pages</h1>

      <Dropzone onFiles={onFiles} multiple={false} />

      {total>0 && (
        <>
          {/* Top toolbar: rotate/delete (preview) */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <SelectionToolbar total={total} selected={selectedPositions} onChange={onPositionsChange} />
            <div className="flex flex-wrap gap-2 ml-auto">
              <button className={btn2} disabled={!selectedSrc.size} onClick={()=>previewRotate(-90)} title="Rotate left">⟲ Rotate Left</button>
              <button className={btn2} disabled={!selectedSrc.size} onClick={()=>previewRotate(90)} title="Rotate right">⟳ Rotate Right</button>
              <button className={btn2} disabled={!selectedSrc.size} onClick={previewDeleteSelected} title="Mark selected as deleted (preview)">Delete selected (preview)</button>
              {deletedCount>0 && <button className={btn2} onClick={restoreAll}>Restore all</button>}
            </div>
          </div>

          {/* Counts */}
          <div className="text-sm text-slate-700 mt-2 mb-1">
            Remaining: <b>{remaining}</b> of <b>{total}</b>
            {deletedCount>0 && <> • Deleted (preview): <b>{deletedCount}</b></>}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-2">
            {pages.map((p, pos)=>(
              <div key={p.srcIndex}
                   draggable
                   onDragStart={onDragStart(pos)}
                   onDragOver={onDragOver}
                   onDrop={onDrop(pos)}
                   className={
                     'relative border rounded overflow-hidden ' +
                     (p.removed ? 'opacity-50 grayscale ' : '') +
                     (selectedSrc.has(p.srcIndex) ? ' ring-2 ring-blue-600 ' : '')
                   }
                   onClick={()=>toggleByPos(pos)}
              >
                <img src={p.img} alt={`Page ${pos+1}`} className="w-full block select-none" />
                <div className="absolute top-1 left-1 text-xs bg-white/80 rounded px-1">{pos+1}</div>
                {p.rotate!==0 && (
                  <div className="absolute bottom-1 left-1 text-[11px] bg-amber-500 text-white px-1.5 py-0.5 rounded">
                    Rotated {p.rotate}°
                  </div>
                )}
                {p.removed && (
                  <div className="absolute bottom-1 right-1 text-[11px] bg-red-600 text-white px-1.5 py-0.5 rounded">
                    Deleted
                  </div>
                )}
                <span className="absolute top-1 right-1 text-xs bg-white/80 rounded px-1 cursor-move select-none">↕</span>
              </div>
            ))}
          </div>

          {/* Filename */}
          <div className="mt-4 border rounded p-3 bg-white shadow-sm">
            <FilenameInput value={outName} onChange={setOutName} />
          </div>
        </>
      )}

      <StickyActionBar>
        <button className={btn} disabled={!total || remaining===0 || busy} onClick={handleSave}>
          {busy ? 'Saving…' : 'Save & Download'}
        </button>
      </StickyActionBar>

      <div className="mt-6">
        <HowToUse steps={[
          "Drop one PDF to see thumbnails.",
          "Drag to reorder; click to select; use Rotate/Delete (preview only).",
          "Check labels: rotated pages show the angle; deleted pages are dimmed and tagged.",
          "When satisfied, click “Save & Download”.",
          "Privacy: everything runs in your browser — files never leave your device."
        ]} />
      </div>
    </div>
  );
}
