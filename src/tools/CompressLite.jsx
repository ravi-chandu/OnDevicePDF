import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";

import HowToUse from "../components/HowToUse";
import PageTitle from "../components/PageTitle";

export default function CompressLite() {
  const [outputName, setOutputName] = useState("compressed.pdf");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("Lightweight re-save to strip metadata. For heavy image compression we’ll add an advanced mode.");

  async function handleCompress() {
    if (!file) return;
    setBusy(true);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const pdf = await PDFDocument.load(bytes);
      // Strip metadata
      pdf.setTitle("");
      pdf.setAuthor("");
      const out = await pdf.save({ useObjectStreams: false });
      const blob = new Blob([out], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = outputName.endsWith(".pdf") ? outputName : outputName + ".pdf";
      a.click();
      URL.revokeObjectURL(a.href);
    } finally { setBusy(false); }
  }

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6 space-y-4">
      <PageTitle icon="🗜️" title="Compress PDF (Lite)" />
      <HowToUse steps={["Drop one PDF.", "This re-saves and strips metadata (quick & safe).", "Click \u201cRe-save & Download\u201d."]} />

      

      <p className="text-gray-600">{note}</p>

      

      <input type="file" accept="application/pdf" onChange={(e)=> setFile(e.target.files[0])} />
      <input className="border p-2 rounded w-full" placeholder="Output file name" value={outputName} onChange={e=>setOutputName(e.target.value)} />
      <button onClick={handleCompress} disabled={!file || busy} className="px-4 py-2 w-full sm:w-auto  bg-black text-white rounded disabled:opacity-50">
        {busy ? "Optimizing…" : "Re-save & Download"}
      </button>
    </main>
  );
}