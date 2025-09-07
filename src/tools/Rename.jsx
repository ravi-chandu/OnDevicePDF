import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import Dropzone from '../components/Dropzone.jsx';
import StickyActionBar from '../components/StickyActionBar.jsx';
import HowToUse from '../components/HowToUse.jsx';
import SEO from '../components/SEO.jsx';
import FilenameInput from '../components/FilenameInput.jsx';

export default function Rename(){
  const [file,setFile]=useState(null);
  const [outName,setOutName]=useState(`renamed-${new Date().toISOString().slice(0,10)}.pdf`);
  const [meta,setMeta]=useState({ title:'', author:'', subject:'', keywords:'' });
  const [busy,setBusy]=useState(false);

  async function onFiles([f]){ setFile(f); }

  async function handleApply(){
    if(!file) return;
    setBusy(true);
    try{
      const srcBytes=await file.arrayBuffer();
      const pdf=await PDFDocument.load(srcBytes);
      const { title, author, subject, keywords } = meta;
      if(title!==undefined) pdf.setTitle(title||undefined);
      if(author!==undefined) pdf.setAuthor(author||undefined);
      if(subject!==undefined) pdf.setSubject(subject||undefined);
      if(keywords!==undefined) pdf.setKeywords(keywords? keywords.split(',').map(s=>s.trim()) : undefined);
      const bytes=await pdf.save();
      const a=document.createElement('a');
      a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
      a.download=outName||'renamed.pdf'; a.click(); URL.revokeObjectURL(a.href);
    } finally { setBusy(false); }
  }

  const field = (label,key,ph='') => (
    <div className="flex items-center gap-2">
      <span className="w-28 text-sm">{label}</span>
      <input className="border rounded px-3 py-2 w-full" value={meta[key]||''}
             onChange={e=>setMeta(m=>({...m,[key]:e.target.value}))} placeholder={ph} />
    </div>
  );

  const btn  = "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50";

  return (
    <div className="pb-24">
      <SEO title="Rename & Edit PDF Metadata" canonical="https://www.ondevicepdf.com/tools/rename" />
      <h1 className="text-2xl font-semibold mb-4">✏️ Rename / PDF Title</h1>

      <Dropzone onFiles={onFiles} multiple={false} />

      {file && (
        <>
          <div className="mt-4 border rounded p-3 bg-white shadow-sm grid gap-3">
            {field('Title','title','Optional document title')}
            {field('Author','author','Optional author')}
            {field('Subject','subject','Optional subject')}
            {field('Keywords','keywords','comma,separated,keywords')}
          </div>

          <div className="mt-4 border rounded p-3 bg-white shadow-sm">
            <FilenameInput value={outName} onChange={setOutName} />
          </div>
        </>
      )}

      <StickyActionBar>
        <button className={btn} disabled={!file || busy} onClick={handleApply}>
          {busy ? 'Saving…' : 'Apply & Download'}
        </button>
      </StickyActionBar>

      <div className="mt-6">
        <HowToUse steps={[
          "Drop one PDF.",
          "Edit Title, Author, Subject, and Keywords.",
          "Set the output filename, then click “Apply & Download”.",
          "Privacy: everything runs in your browser — files never leave your device."
        ]} />
      </div>
    </div>
  );
}
