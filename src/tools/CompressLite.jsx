import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import Dropzone from '../components/Dropzone.jsx';
import StickyActionBar from '../components/StickyActionBar.jsx';
import HowToUse from '../components/HowToUse.jsx';
import SEO from '../components/SEO.jsx';
import FilenameInput from '../components/FilenameInput.jsx';

export default function CompressLite(){
  const [file,setFile]=useState(null);
  const [removeMeta,setRemoveMeta]=useState(true);
  const [outName,setOutName]=useState(`compressed-${new Date().toISOString().slice(0,10)}.pdf`);
  const [busy,setBusy]=useState(false);
  const [sizes,setSizes]=useState(null); // {before, after}

  async function onFiles([f]){ setFile(f); setSizes(null); }

  async function handleSave(){
    if(!file) return;
    setBusy(true);
    try{
      const before = file.size;
      const srcBytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(srcBytes);
      if(removeMeta){
        pdf.setTitle(undefined);
        pdf.setAuthor(undefined);
        pdf.setSubject(undefined);
        pdf.setKeywords(undefined);
        pdf.setProducer(undefined);
        pdf.setCreator(undefined);
        pdf.setCreationDate(undefined);
        pdf.setModificationDate(undefined);
      }
      const bytes=await pdf.save();
      const after = bytes.length;
      setSizes({before, after});
      const a=document.createElement('a');
      a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
      a.download=outName||'compressed.pdf'; a.click(); URL.revokeObjectURL(a.href);
    } finally { setBusy(false); }
  }

  const btn  = "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50";

  return (
    <div className="pb-24">
      <SEO title="Compress (Lite)" canonical="https://www.ondevicepdf.com/tools/compress" />
      <h1 className="text-2xl font-semibold mb-4">🗜️ Compress (Lite)</h1>

      <Dropzone onFiles={onFiles} multiple={false} />

      {file && (
        <>
          <p className="text-sm text-slate-600 mt-3">
            Lite compression re-saves your PDF and can strip metadata. This is lossless (no image recompression).
          </p>

          <label className="inline-flex items-center gap-2 mt-3 text-sm">
            <input type="checkbox" checked={removeMeta} onChange={e=>setRemoveMeta(e.target.checked)} />
            Remove metadata (Title, Author, etc.)
          </label>

          {sizes && (
            <p className="text-sm text-slate-700 mt-2">
              Size: {(sizes.before/1024).toFixed(1)} KB → {(sizes.after/1024).toFixed(1)} KB
            </p>
          )}

          <div className="mt-4 border rounded p-3 bg-white shadow-sm">
            <FilenameInput value={outName} onChange={setOutName} />
          </div>
        </>
      )}

      <StickyActionBar>
        <button className={btn} disabled={!file || busy} onClick={handleSave}>
          {busy ? 'Re-saving…' : 'Re-save & Download'}
        </button>
      </StickyActionBar>

      <div className="mt-6">
        <HowToUse steps={[
          "Drop one PDF.",
          "Optionally remove metadata for a smaller file without quality loss.",
          "Click “Re-save & Download”.",
          "Need smaller? Use Convert (Basic) to rasterize pages (lossy)."
        ]} />
      </div>
    </div>
  );
}
