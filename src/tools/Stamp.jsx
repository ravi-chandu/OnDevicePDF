import { useEffect, useMemo, useState } from 'react';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import Dropzone from '../components/Dropzone.jsx';
import StickyActionBar from '../components/StickyActionBar.jsx'; // or StickyBar.jsx
import HowToUse from '../components/HowToUse.jsx';
import SEO from '../components/SEO.jsx';
import FilenameInput from '../components/FilenameInput.jsx';
import pdfjsLib from '../utils/pdfjs.js';
import { parseRanges } from '../utils/range.js';

function toRoman(n, upper=true){
  if(n<=0) return ''+n;
  const map = [
    [1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],
    [100,'C'],[90,'XC'],[50,'L'],[40,'XL'],
    [10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']
  ];
  let out=''; for(const [v,s] of map){ while(n>=v){ out+=s; n-=v; } }
  return upper? out : out.toLowerCase();
}
function formatNumber(n, style){
  switch(style){
    case '1': return String(n);
    case '01': return String(n).padStart(2,'0');
    case '001': return String(n).padStart(3,'0');
    case 'i': return toRoman(n,false);
    case 'I': return toRoman(n,true);
    default: return String(n);
  }
}
const positions = [
  {key:'tl', x: (w,m)=>m,            y:(h,m)=>h-m,        anchor:'left'},
  {key:'tc', x: (w,m)=>w/2,          y:(h,m)=>h-m,        anchor:'center'},
  {key:'tr', x: (w,m)=>w-m,          y:(h,m)=>h-m,        anchor:'right'},
  {key:'ml', x: (w,m)=>m,            y:(h,m)=>h/2,        anchor:'left'},
  {key:'mc', x: (w,m)=>w/2,          y:(h,m)=>h/2,        anchor:'center'},
  {key:'mr', x: (w,m)=>w-m,          y:(h,m)=>h/2,        anchor:'right'},
  {key:'bl', x: (w,m)=>m,            y:(h,m)=>m,          anchor:'left'},
  {key:'bc', x: (w,m)=>w/2,          y:(h,m)=>m,          anchor:'center'},
  {key:'br', x: (w,m)=>w-m,          y:(h,m)=>m,          anchor:'right'},
];

export default function Stamp(){
  const [file,setFile]=useState(null);
  const [previewImg,setPreviewImg]=useState(null); // dataURL for page 1
  const [busy,setBusy]=useState(false);
  const [outName,setOutName]=useState(`stamped-${new Date().toISOString().slice(0,10)}.pdf`);

  // Toggles
  const [useNumbers,setUseNumbers]=useState(true);
  const [useWatermark,setUseWatermark]=useState(false);

  // Page number options
  const [numStart,setNumStart]=useState(1);
  const [numStyle,setNumStyle]=useState('1'); // '1','01','001','i','I'
  const [numPos,setNumPos]=useState('br');
  const [numMargin,setNumMargin]=useState(24);
  const [numPrefix,setNumPrefix]=useState('');
  const [numSuffix,setNumSuffix]=useState('');
  const [numRangeText,setNumRangeText]=useState(''); // blank = all

  // Watermark options
  const [wmText,setWmText]=useState('CONFIDENTIAL');
  const [wmOpacity,setWmOpacity]=useState(0.35);
  const [wmSize,setWmSize]=useState(32);
  const [wmRotate,setWmRotate]=useState(30);
  const [wmColor,setWmColor]=useState('#666666');
  const [wmPos,setWmPos]=useState('mc');
  const [wmMargin,setWmMargin]=useState(0);
  const [wmRangeText,setWmRangeText]=useState(''); // blank = all

  useEffect(()=>{
    (async ()=>{
      if(!file){ setPreviewImg(null); return; }
      const buf=await file.arrayBuffer();
      const pdf=await pdfjsLib.getDocument({data:buf}).promise;
      const page=await pdf.getPage(1);
      const vp=page.getViewport({scale:.3});
      const canvas=document.createElement('canvas');
      const ctx=canvas.getContext('2d');
      canvas.width=vp.width; canvas.height=vp.height;
      await page.render({canvasContext:ctx,viewport:vp}).promise;
      setPreviewImg(canvas.toDataURL('image/png'));
    })();
  },[file]);

  function hexToRgb(hex){
    const m = hex.replace('#','');
    const n = parseInt(m,16);
    const r = ((n>>16)&255)/255, g=((n>>8)&255)/255, b=(n&255)/255;
    return rgb(r,g,b);
  }

  async function handleApply(){
    if(!file) return;
    setBusy(true);
    try{
      const buf=await file.arrayBuffer();
      const src=await PDFDocument.load(buf);
      const out=await PDFDocument.create();
      const font = await out.embedFont(StandardFonts.Helvetica);

      const total = src.getPageCount();
      const numTargets = new Set(numRangeText.trim()? parseRanges(numRangeText,total) : Array.from({length:total},(_,i)=>i));
      const wmTargets  = new Set(wmRangeText.trim()?  parseRanges(wmRangeText,total)  : Array.from({length:total},(_,i)=>i));

      for(let i=0;i<total;i++){
        const [p]=await out.copyPages(src,[i]);
        const { width:w, height:h } = p.getSize();

        if(useNumbers){
          if(numTargets.has(i)){
            const cfg = positions.find(x=>x.key===numPos) || positions[8];
            const x = cfg.x(w, numMargin);
            const y = cfg.y(h, numMargin);
            const pageNum = formatNumber(numStart + i, numStyle);
            const text = `${numPrefix||''}${pageNum}${numSuffix||''}`;
            const size = 10;
            const textWidth = font.widthOfTextAtSize(text, size);
            let drawX = x;
            if(cfg.anchor==='center') drawX = x - textWidth/2;
            if(cfg.anchor==='right')  drawX = x - textWidth;
            p.drawText(text, { x: drawX, y, size, font, color: rgb(0,0,0) });
          }
        }
        if(useWatermark && wmText.trim()){
          if(wmTargets.has(i)){
            const cfg = positions.find(x=>x.key===wmPos) || positions[4];
            const x = cfg.x(w, wmMargin);
            const y = cfg.y(h, wmMargin);
            const size = wmSize;
            const textWidth = font.widthOfTextAtSize(wmText, size);
            let drawX = x;
            if(cfg.anchor==='center') drawX = x - textWidth/2;
            if(cfg.anchor==='right')  drawX = x - textWidth;
            p.drawText(wmText, {
              x: drawX,
              y,
              size,
              font,
              color: hexToRgb(wmColor),
              rotate: degrees(wmRotate),
              opacity: Math.min(1, Math.max(0, wmOpacity))
            });
          }
        }

        out.addPage(p);
      }

      const bytes=await out.save();
      const a=document.createElement('a');
      a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
      a.download=outName||'stamped.pdf'; a.click(); URL.revokeObjectURL(a.href);
    } finally { setBusy(false); }
  }

  // simple live preview overlay (first page only)
  const previewOverlay = useMemo(()=>{
    if(!previewImg) return null;
    return (
      <div className="relative inline-block border rounded overflow-hidden bg-white">
        <img src={previewImg} alt="Preview" />
        {/* numbers preview */}
        {useNumbers && (
          <PreviewDot label={(numPrefix||'') + formatNumber(numStart, numStyle) + (numSuffix||'')} posKey={numPos} />
        )}
        {/* watermark preview */}
        {useWatermark && wmText.trim() && (
          <PreviewDot label={wmText} posKey={wmPos} rotate={wmRotate} opacity={wmOpacity} large />
        )}
      </div>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[previewImg,useNumbers,numPrefix,numStart,numStyle,numSuffix,numPos,useWatermark,wmText,wmPos,wmRotate,wmOpacity]);

  const btn  = "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50";
  const btn2 = "px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50";
  const chip = (k,cur,set)=>(
    <button type="button"
      className={'px-2.5 py-1 rounded border text-sm '+(cur===k?'bg-slate-800 text-white border-slate-800':'border-slate-300 hover:bg-slate-50')}
      onClick={()=>set(k)}>{k.toUpperCase()}</button>
  );

  return (
    <div className="pb-24">
      <SEO title="Page Numbers / Watermark" canonical="https://www.ondevicepdf.com/tools/stamp" />
      <h1 className="text-2xl font-semibold mb-4">🔖 Add Page Numbers / Watermark</h1>

      <Dropzone onFiles={([f])=>setFile(f)} multiple={false} />

      {file && (
        <>
          {/* preview */}
          <div className="mt-4">{previewOverlay}</div>

          {/* Numbers */}
          <div className="mt-4 border rounded p-3 bg-white shadow-sm">
            <label className="inline-flex items-center gap-2 font-medium">
              <input type="checkbox" checked={useNumbers} onChange={e=>setUseNumbers(e.target.checked)} />
              Page Numbers
            </label>
            {useNumbers && (
              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-28 text-sm">Start at</span>
                  <input type="number" min={1} className="border rounded px-3 py-2 w-full" value={numStart} onChange={e=>setNumStart(parseInt(e.target.value||'1',10))} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-28 text-sm">Style</span>
                  <select className="border rounded px-3 py-2 w-full" value={numStyle} onChange={e=>setNumStyle(e.target.value)}>
                    <option value="1">1,2,3</option>
                    <option value="01">01,02,03</option>
                    <option value="001">001,002,003</option>
                    <option value="i">i, ii, iii</option>
                    <option value="I">I, II, III</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-28 text-sm">Prefix</span>
                  <input className="border rounded px-3 py-2 w-full" value={numPrefix} onChange={e=>setNumPrefix(e.target.value)} placeholder="Page " />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-28 text-sm">Suffix</span>
                  <input className="border rounded px-3 py-2 w-full" value={numSuffix} onChange={e=>setNumSuffix(e.target.value)} placeholder=" of %t (optional)" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-28 text-sm">Position</span>
                  <PositionGrid current={numPos} onChange={setNumPos} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-28 text-sm">Margin</span>
                  <input type="range" min={0} max={64} value={numMargin} onChange={e=>setNumMargin(parseInt(e.target.value,10))} />
                  <span className="text-sm w-10">{numMargin}px</span>
                </div>
                <div className="sm:col-span-2 flex items-center gap-2">
                  <span className="w-28 text-sm">Pages</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {chip('all', numRangeText || 'all', v=> setNumRangeText(v==='all' ? '' : v))}
                    {chip('odd', numRangeText, setNumRangeText)}
                    {chip('even', numRangeText, setNumRangeText)}
                    {chip('half1', numRangeText, setNumRangeText)}
                    {chip('half2', numRangeText, setNumRangeText)}
                    <input className="border rounded px-3 py-2"
                      placeholder="e.g. 1-3,5"
                      value={numRangeText}
                      onChange={e=>setNumRangeText(e.target.value)} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Watermark */}
          <div className="mt-4 border rounded p-3 bg-white shadow-sm">
            <label className="inline-flex items-center gap-2 font-medium">
              <input type="checkbox" checked={useWatermark} onChange={e=>setUseWatermark(e.target.checked)} />
              Watermark
            </label>
            {useWatermark && (
              <div className="mt-3 grid sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 sm:col-span-2">
                  <span className="w-28 text-sm">Text</span>
                  <input className="border rounded px-3 py-2 w-full" value={wmText} onChange={e=>setWmText(e.target.value)} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-28 text-sm">Opacity</span>
                  <input type="range" min={0.1} max={0.9} step={0.05} value={wmOpacity} onChange={e=>setWmOpacity(parseFloat(e.target.value))} />
                  <span className="text-sm w-12">{Math.round(wmOpacity*100)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-28 text-sm">Font size</span>
                  <input type="range" min={12} max={72} value={wmSize} onChange={e=>setWmSize(parseInt(e.target.value,10))} />
                  <span className="text-sm w-10">{wmSize}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-28 text-sm">Rotation</span>
                  <input type="range" min={-60} max={60} value={wmRotate} onChange={e=>setWmRotate(parseInt(e.target.value,10))} />
                  <span className="text-sm w-10">{wmRotate}°</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-28 text-sm">Color</span>
                  <input type="color" value={wmColor} onChange={e=>setWmColor(e.target.value)} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-28 text-sm">Position</span>
                  <PositionGrid current={wmPos} onChange={setWmPos} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-28 text-sm">Margin</span>
                  <input type="range" min={0} max={64} value={wmMargin} onChange={e=>setWmMargin(parseInt(e.target.value,10))} />
                  <span className="text-sm w-10">{wmMargin}px</span>
                </div>
                <div className="sm:col-span-2 flex items-center gap-2">
                  <span className="w-28 text-sm">Pages</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {chip('all', wmRangeText || 'all', v=> setWmRangeText(v==='all' ? '' : v))}
                    {chip('odd', wmRangeText, setWmRangeText)}
                    {chip('even', wmRangeText, setWmRangeText)}
                    {chip('half1', wmRangeText, setWmRangeText)}
                    {chip('half2', wmRangeText, setWmRangeText)}
                    <input className="border rounded px-3 py-2"
                      placeholder="e.g. 1-3,5"
                      value={wmRangeText}
                      onChange={e=>setWmRangeText(e.target.value)} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Filename */}
          <div className="mt-4 border rounded p-3 bg-white shadow-sm">
            <FilenameInput value={outName} onChange={setOutName} />
          </div>
        </>
      )}

      <StickyActionBar>
        <button className={btn} disabled={!file || busy} onClick={handleApply}>
          {busy ? 'Applying…' : 'Apply & Download'}
        </button>
      </StickyActionBar>

      <div className="mt-6">
        <HowToUse steps={[
          "Drop one PDF.",
          "Enable Page Numbers and/or Watermark. Pick position, margin, and (optionally) ranges (e.g., 1-3,5 or presets).",
          "Tune style: number format (1 / 01 / 001 / i / I), start number, prefix/suffix; watermark opacity/size/rotation/color.",
          "Use the live preview to confirm placement on the first page.",
          "Click “Apply & Download”. Privacy: everything runs in your browser — files never leave your device."
        ]} />
      </div>
    </div>
  );
}

function PositionGrid({ current, onChange }){
  const cell = (k, label) => (
    <button type="button"
      key={k}
      onClick={()=>onChange(k)}
      className={
        'h-8 w-8 text-[10px] grid place-items-center border '+
        (current===k ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-300 hover:bg-slate-50')
      }>
      {label}
    </button>
  );
  return (
    <div className="grid grid-cols-3 gap-1">
      {cell('tl','TL')}{cell('tc','TC')}{cell('tr','TR')}
      {cell('ml','ML')}{cell('mc','MC')}{cell('mr','MR')}
      {cell('bl','BL')}{cell('bc','BC')}{cell('br','BR')}
    </div>
  );
}

function PreviewDot({ label, posKey, rotate=0, opacity=0.8, large=false }){
  // Simple overlay approximation; not exact PDF metrics, but good guidance.
  const place = {
    tl: 'top-2 left-2',   tc: 'top-2 left-1/2 -translate-x-1/2',   tr: 'top-2 right-2',
    ml: 'top-1/2 -translate-y-1/2 left-2', mc: 'top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2', mr: 'top-1/2 -translate-y-1/2 right-2',
    bl: 'bottom-2 left-2',bc: 'bottom-2 left-1/2 -translate-x-1/2', br: 'bottom-2 right-2'
  }[posKey] || 'bottom-2 right-2';
  return (
    <div className={`absolute ${place} pointer-events-none`}
         style={{opacity, transform: `translate(var(--tw-translate-x,0), var(--tw-translate-y,0)) rotate(${rotate}deg)`}}>
      <span className={`inline-block ${large?'text-base':'text-xs'} bg-yellow-300/80 px-1.5 py-0.5 rounded`}>
        {label}
      </span>
    </div>
  );
}
