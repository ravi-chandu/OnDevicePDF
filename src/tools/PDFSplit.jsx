import { useEffect, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import Dropzone from '../components/Dropzone.jsx';
import StickyActionBar from '../components/StickyActionBar.jsx';
import HowToUse from '../components/HowToUse.jsx';
import SEO from '../components/SEO.jsx';
import SelectionToolbar from '../components/SelectionToolbar.jsx';
import FilenameInput from '../components/FilenameInput.jsx';
import pdfjsLib from '../utils/pdfjs.js';

// Self-contained range parser (1-based input -> 0-based indices)
function parseRanges(text, total){
  const s = new Set();
  const parts = text.split(',').map(t=>t.trim()).filter(Boolean);
  for(const part of parts){
    const m = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if(m){
      let a=+m[1], b=+m[2];
      if(a>b) [a,b]=[b,a];
      for(let n=a;n<=b;n++){
        if(n>=1 && n<=total) s.add(n-1);
      }
    }else{
      const n=+part;
      if(Number.isInteger(n) && n>=1 && n<=total) s.add(n-1);
    }
  }
  return [...s].sort((a,b)=>a-b);
}

export default function PDFSplit(){
  const [file,setFile]=useState(null);
  const [pages,setPages]=useState([]); // [{img}]
  const [selected,setSelected]=useState(new Set()); // positions
  const [rangeText,setRangeText]=useState('');
  const [busy,setBusy]=useState(false);
  const [outName,setOutName]=useState(`split-${new Date().toISOString().slice(0,10)}.pdf`);

  async function onFiles([f]){
    setFile(f); setSelected(new Set()); setRangeText('');
    const buf=await f.arrayBuffer();
    const pdf=await pdfjsLib.getDocument({data:buf}).promise;
    const arr=[];
    for(let n=1;n<=pdf.numPages;n++){
      const p=await pdf.getPage(n);
      const vp=p.getViewport({scale:.2});
      const canvas=document.createElement('canvas'); const ctx=canvas.getContext('2d');
      canvas.width=vp.width; canvas.height=vp.height;
      await p.render({canvasContext:ctx,viewport:vp}).promise;
      arr.push({img:canvas.toDataURL('image/png')});
    }
    setPages(arr);
  }

  // reflect manual ranges to selection
  useEffect(()=>{
    if(!pages.length) return;
    if(!rangeText.trim()){ setSelected(new Set()); return; }
    try{
      const idxs = parseRanges(rangeText, pages.length);
      setSelected(new Set(idxs));
    }catch{}
  }, [rangeText, pages.length]);

  function onSelectChange(setNew){
    setRangeText('');
    setSelected(new Set(setNew));
  }

  async function handleExtract(){
    if(!file || !selected.size) return;
    setBusy(true);
    try{
      const keep = Array.from(selected).sort((a,b)=>a-b);
      const buf=await file.arrayBuffer();
      const src=await PDFDocument.load(buf);
      const out=await PDFDocument.create();
      const copied=await out.copyPages(src, keep);
      copied.forEach(p=>out.addPage(p));
      const bytes=await out.save();
      const a=document.createElement('a');
      a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
      a.download=outName||'split.pdf'; a.click(); URL.revokeObjectURL(a.href);
    } finally { setBusy(false); }
  }

  const total = pages.length;
  const count = selected.size;

  const btn  = "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50";
  const btn2 = "px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50";

  return (
    <div className="pb-24">
      <SEO title="Split / Extract Pages" canonical="https://www.ondevicepdf.com/tools/split" />
      <h1 className="text-2xl font-semibold mb-4">✂️ Split / Extract Pages</h1>

      <Dropzone onFiles={onFiles} multiple={false} />

      {total>0 && (
        <>
          <div className="flex flex-col gap-2 mt-3">
            <SelectionToolbar total={total} selected={selected} onChange={onSelectChange} />
            <div className="flex items-center gap-2">
              <span className="text-sm w-24">Ranges</span>
              <input className="border rounded px-3 py-2 w-full" placeholder="e.g. 1-3,5,9-11"
                     value={rangeText} onChange={e=>setRangeText(e.target.value)} />
            </div>
            <div className="text-sm text-slate-700">Extracting <b>{count}</b> of <b>{total}</b> pages.</div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-2">
            {pages.map((p,i)=>(
              <div key={i}
                   className={'relative border rounded overflow-hidden '+(selected.has(i)?'':'opacity-40')}
                   onClick={()=>{
                     const s=new Set(selected);
                     s.has(i)?s.delete(i):s.add(i);
                     onSelectChange(s);
                   }}>
                <img src={p.img} alt={'Page '+(i+1)} className="w-full block" />
                <div className="absolute top-1 left-1 text-xs bg-white/80 rounded px-1">{i+1}</div>
                <input type="checkbox" className="absolute top-1 right-1" checked={selected.has(i)} readOnly />
              </div>
            ))}
          </div>

          <div className="mt-4 border rounded p-3 bg-white shadow-sm">
            <FilenameInput value={outName} onChange={setOutName} />
          </div>
        </>
      )}

      <StickyActionBar>
        <button className={btn} disabled={!count || busy} onClick={handleExtract}>
          {busy ? 'Extracting…' : 'Extract & Download'}
        </button>
      </StickyActionBar>

      <div className="mt-6">
        <HowToUse steps={[
          "Drop one PDF.",
          "Use Odd/Even/Halves presets or type ranges like 1-3,5,9-11.",
          "Tap tiles to fine-tune; non-selected pages are dimmed.",
          "Click “Extract & Download”.",
          "Privacy: everything runs in your browser — files never leave your device."
        ]} />
      </div>
    </div>
  );
}
