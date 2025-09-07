import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import Dropzone from '../components/Dropzone.jsx';
import StickyActionBar from '../components/StickyActionBar.jsx';
import HowToUse from '../components/HowToUse.jsx';
import SEO from '../components/SEO.jsx';
import FilenameInput from '../components/FilenameInput.jsx';
import pdfjsLib from '../utils/pdfjs.js';

export default function ConvertBasic(){
  const [file,setFile]=useState(null);
  const [dpi,setDpi]=useState(144); // rasterize to PDF
  const [busy,setBusy]=useState(false);
  const [outName,setOutName]=useState(`rasterized-${new Date().toISOString().slice(0,10)}.pdf`);

  async function onFiles([f]){ setFile(f); }

  // Convert PDF pages to raster images and embed back to a new PDF
  async function handleConvert(){
    if(!file) return;
    setBusy(true);
    try{
      const buf=await file.arrayBuffer();
      const pdf=await pdfjsLib.getDocument({data:buf}).promise;

      const out=await PDFDocument.create();

      for(let n=1;n<=pdf.numPages;n++){
        const page=await pdf.getPage(n);
        // pdf.js base is ~96dpi → scale = dpi/96
        const scale = Math.max(0.25, dpi/96);
        const vp=page.getViewport({scale});
        const canvas=document.createElement('canvas'); const ctx=canvas.getContext('2d');
        canvas.width=vp.width; canvas.height=vp.height;
        await page.render({canvasContext:ctx,viewport:vp}).promise;
        const png = canvas.toDataURL('image/png');
        const pngBytes = await (await fetch(png)).arrayBuffer();
        const img = await out.embedPng(pngBytes);
        const pg = out.addPage([img.width, img.height]);
        pg.drawImage(img, {x:0, y:0, width: img.width, height: img.height});
      }

      const bytes=await out.save();
      const a=document.createElement('a');
      a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
      a.download=outName||'rasterized.pdf'; a.click(); URL.revokeObjectURL(a.href);
    } finally { setBusy(false); }
  }

  const btn  = "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50";

  return (
    <div className="pb-24">
      <SEO title="Convert (Basic)" canonical="https://www.ondevicepdf.com/tools/convert" />
      <h1 className="text-2xl font-semibold mb-4">🖼️ Convert (Basic)</h1>

      <Dropzone onFiles={onFiles} multiple={false} />

      {file && (
        <>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-sm w-24">DPI</span>
            <select className="border rounded px-3 py-2" value={dpi} onChange={e=>setDpi(parseInt(e.target.value,10))}>
              <option value={72}>72 (smallest)</option>
              <option value={96}>96</option>
              <option value={144}>144</option>
              <option value={300}>300 (largest)</option>
            </select>
            <span className="text-xs text-slate-500">Higher DPI = bigger file, better clarity.</span>
          </div>

          <div className="mt-4 border rounded p-3 bg-white shadow-sm">
            <FilenameInput value={outName} onChange={setOutName} />
          </div>
        </>
      )}

      <StickyActionBar>
        <button className={btn} disabled={!file || busy} onClick={handleConvert}>
          {busy ? 'Converting…' : 'Convert to Rasterized PDF'}
        </button>
      </StickyActionBar>

      <div className="mt-6">
        <HowToUse steps={[
          "Drop one PDF.",
          "Choose DPI (image quality).",
          "Click “Convert to Rasterized PDF”.",
          "Tip: Rasterizing can shrink size with lower DPI, but text becomes non-selectable."
        ]} />
      </div>
    </div>
  );
}
