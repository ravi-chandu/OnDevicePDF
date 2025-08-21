import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import PageTitle from "../components/PageTitle";
import HowToUse from "../components/HowToUse";
import FileListReorder from "../components/FileListReorder";

export default function PDFMerge() {
  const [files, setFiles] = useState([]);
  const [outputName, setOutputName] = useState("merged.pdf");
  const [busy, setBusy] = useState(false);

  function onPick(e){ setFiles(prev => [...prev, ...Array.from(e.target.files||[])]); }
  function clear(){ setFiles([]); }

  async function handleMerge() {
    if (files.length === 0) return;
    setBusy(true);
    try {
      const outPdf = await PDFDocument.create();
      for (const f of files) {
        const src = await PDFDocument.load(await f.arrayBuffer());
        const pages = await outPdf.copyPages(src, src.getPageIndices());
        pages.forEach(p => outPdf.addPage(p));
      }
      const bytes = await outPdf.save();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
      a.download = outputName.endsWith(".pdf") ? outputName : outputName + ".pdf";
      a.click();
      URL.revokeObjectURL(a.href);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6 space-y-4">
      <PageTitle icon="🧩" title="Merge PDF Files" />
      <HowToUse steps={["Drop or choose files.", "Reorder the list if needed.", "Click Merge & Download."]} />
      <div className="border-2 border-dashed rounded p-6 text-center text-gray-600">
        Drop PDF files here or <label className="underline cursor-pointer"><input type="file" accept="application/pdf" multiple onChange={onPick} className="hidden" />choose files</label>
      </div>

      <FileListReorder
        files={files}
        onChange={(ordered)=> setFiles(ordered)}
        onRemove={(i)=> setFiles(prev => prev.filter((_,idx)=>idx!==i))}
      />

      <input className="border p-2 rounded w-full" placeholder="Output name" value={outputName} onChange={e=>setOutputName(e.target.value)} />

      <div className="flex gap-3">
        <button disabled={busy || files.length===0} onClick={handleMerge} className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50">
          {busy ? "Merging..." : "Merge & Download"}
        </button>
        <button onClick={clear} className="px-4 py-2 bg-gray-200 rounded">Clear</button>
      </div>
    </main>
  );
}
