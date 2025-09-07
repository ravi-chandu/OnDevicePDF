import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import Dropzone from '../components/Dropzone.jsx';
import StickyActionBar from '../components/StickyActionBar.jsx';
import HowToUse from '../components/HowToUse.jsx';
import SEO from '../components/SEO.jsx';
import FilenameInput from '../components/FilenameInput.jsx';
import SelectionToolbar from '../components/SelectionToolbar.jsx';
import pdfjsLib from '../utils/pdfjs.js';
import { parseRanges } from '../utils/range.js';

export default function PDFSplit(){
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [useSeparate, setUseSeparate] = useState(false);
  const [rangeText, setRangeText] = useState('');
  const [busy, setBusy] = useState(false);
  const [outName, setOutName] = useState(`extracted-${new Date().toISOString().slice(0,10)}.pdf`);
  const [baseName, setBaseName] = useState(`page`);

  async function onFiles([f]){
    setFile(f); setSelected(new Set()); setRangeText('');
    const buf=await f.arrayBuffer(); const pdf=await pdfjsLib.getDocument({data:buf}).promise;
    const items=[];
    for(let n=1;n<=pdf.numPages;n++){
      const page=await pdf.getPage(n); const vp=page.getViewport({scale:.2});
      const canvas=document.createElement('canvas'); const ctx=canvas.getContext('2d');
      canvas.width=vp.width; canvas.height=vp.height;
      await page.render({canvasContext:ctx,viewport:vp}).promise;
      items.push({index:n-1,img:canvas.toDataURL('image/png')});
    }
    setPages(items);
  }
  function toggle(i){ const s=new Set(selected); s.has(i)?s.delete(i):s.add(i); setSelected(s); }

  async function handleExtract(){
    if(!file) return;
    setBusy(true);
    try{
      const buf=await file.arrayBuffer();
      const src=await PDFDocument.load(buf);
      const total=src.getPageCount();
      let indices=[];
      if(selected.size>0){ indices=Array.from(selected).sort((a,b)=>a-b); }
      else if(rangeText.trim()){ indices=parseRanges(rangeText,total); }
      else { indices=Array.from({length:total},(_,i)=>i); }
      if(indices.length===0) return;

      if(useSeparate){
        // multiple downloads, no extra deps
        for(const idx of indices){
          const out=await PDFDocument.create();
          const [p]=await out.copyPages(src,[idx]); out.addPage(p);
          const bytes=await out.save();
          const a=document.createElement('a');
          a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
          a.download=`${baseName}-${idx+1}.pdf`; a.click(); URL.revokeObjectURL(a.href);
        }
      } else {
        const out=await PDFDocument.create();
        const pages=await out.copyPages(src, indices); pages.forEach(p=>out.addPage(p));
        const bytes=await out.save();
        const a=document.createElement('a');
        a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
        a.download=outName||'extracted.pdf'; a.click(); URL.revokeObjectURL(a.href);
      }
    } finally { setBusy(false); }
  }

  const btn  = "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50";
  const btn2 = "px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50";

  return (
    <div>
      <SEO title="Split / Extract Pages" canonical="https://www.ondevicepdf.com/tools/split" />
      <h1 className="text-2xl font-semibold mb-4">✂️ Split / Extract Pages</h1>
      <Dropzone onFiles={onFiles} multiple={false} />

      {pages.length>0 && (
        <>
          <SelectionToolbar total={pages.length} selected={selected} onChange={setSelected} />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-2">
            {pages.map(p=>(
              <div key={p.index}
                   className={'relative border rounded overflow-hidden ' + (selected.has(p.index)?'ring-2 ring-blue-600':'')}
                   onClick={()=>toggle(p.index)}>
                <img src={p.img} alt={'Page '+(p.index+1)} className="w-full block" />
                <div className="absolute top-1 left-1 text-xs bg-white/80 rounded px-1">{p.index+1}</div>
                <input type="checkbox" className="absolute top-1 right-1" checked={selected.has(p.index)} readOnly />
              </div>
            ))}
          </div>

          <div className="mt-4 border rounded p-3 bg-white shadow-sm flex flex-wrap gap-3 items-center">
            <label className="text-sm">Or enter ranges</label>
            <input className="border rounded px-3 py-2 flex-1 min-w-[220px]"
                   value={rangeText} onChange={e=>setRangeText(e.target.value)} placeholder="e.g. 1-3,5" />
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={useSeparate} onChange={e=>setUseSeparate(e.target.checked)} />
              Separate PDFs (multiple downloads)
            </label>
          </div>

          {!useSeparate ? (
            <div className="mt-3 border rounded p-3 bg-white shadow-sm">
              <FilenameInput value={outName} onChange={setOutName} />
            </div>
          ) : (
            <div className="mt-3 border rounded p-3 bg-white shadow-sm">
              <FilenameInput label="Base name" value={baseName} onChange={setBaseName} />
            </div>
          )}
        </>
      )}

      <HowToUse steps={[
        "Drop one PDF.",
        "Use selection presets (Odd/Even/Halves) or enter ranges like 1-3,5.",
        "Choose single output or separate PDFs.",
        "Click “Extract & Download”.",
        "Privacy: everything runs in your browser — files never leave your device."
      ]} />

      <StickyActionBar>
        <button className={btn} disabled={!file||busy} onClick={handleExtract}>
          {busy?'Extracting…':'Extract & Download'}
        </button>
        <button className={btn2} onClick={()=>{ setFile(null); setPages([]); setSelected(new Set()); setRangeText(''); }}>
          Clear
        </button>
      </StickyActionBar>
    </div>
  );
}
