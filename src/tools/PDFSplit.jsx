import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";

function parseRanges(input, max) {
  const out = new Set();
  input.split(",").map(s => s.trim()).forEach(part => {
    if (!part) return;
    if (part.includes("-")) {
      let [a, b] = part.split("-").map(n => parseInt(n, 10));
      if (isNaN(a) || isNaN(b)) return;
      if (a > b) [a, b] = [b, a];
      for (let i = a; i <= b; i++) if (i >= 1 && i <= max) out.add(i - 1);
    } else {
      const n = parseInt(part, 10);
      if (!isNaN(n) && n >= 1 && n <= max) out.add(n - 1);
    }
  });
  return [...out].sort((x, y) => x - y);
}

import HowToUse from "../components/HowToUse";
import PageTitle from "../components/PageTitle";
import ThumbGrid from "../components/ThumbGrid";


export default function PDFSplit() {
  const [outputName, setOutputName] = useState("extract.pdf");
  const [file, setFile] = useState(null);
  const [ranges, setRanges] = useState("1-3,5,9-10");
  function handleThumbSelect(selectedIdxs){ const csv = selectedIdxs.map(n=>n+1).join(","); setRanges(csv);} 
  const [busy, setBusy] = useState(false);

  async function handleSplit() {
    if (!file) return;
    setBusy(true);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const src = await PDFDocument.load(bytes);
      const idx = parseRanges(ranges, src.getPageCount());
      if (!idx.length) return;

      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, idx);
      copied.forEach(p => out.addPage(p));
      const outBytes = await out.save();
      const blob = new Blob([outBytes], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = outputName.endsWith(".pdf") ? outputName : outputName + ".pdf";
      a.click();
      URL.revokeObjectURL(a.href);
    } finally {
      setBusy(false);
    }
  }

  function setPreset(type) {
    if (!file) return;
    (async () => {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const src = await PDFDocument.load(bytes);
      const pages = src.getPageCount();
      if (type === "odd") setRanges([...Array(pages)].map((_,i)=>i+1).filter(n=>n%2===1).join(","));
      if (type === "even") setRanges([...Array(pages)].map((_,i)=>i+1).filter(n=>n%2===0).join(","));
      if (type === "first") setRanges(`1-${Math.floor(pages/2) || 1}`);
      if (type === "second") setRanges(`${Math.floor(pages/2)+1}-${pages}`);
      if (type === "clear") setRanges("");
    })();
  }

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6 space-y-4">
      <PageTitle icon="✂️" title="Split / Extract Pages" />
      <HowToUse steps={["Drop one PDF.", "Enter ranges like 1-3,5 or use the preset buttons.", "Click \u201cExtract & Download\u201d."]} />

      

      <p className="text-gray-600">Extract selected page ranges from a PDF. Processing is 100% local.</p>

      

      <ThumbGrid file={file} selectable onChangeSelection={handleThumbSelect} className="mt-2"/>

      <input type="file" accept="application/pdf" onChange={(e)=> setFile(e.target.files[0])} />
      <div className="flex flex-wrap gap-2">
        <button className="px-3 py-1 border rounded" onClick={()=>setPreset("odd")}>Odd</button>
        <button className="px-3 py-1 border rounded" onClick={()=>setPreset("even")}>Even</button>
        <button className="px-3 py-1 border rounded" onClick={()=>setPreset("first")}>First half</button>
        <button className="px-3 py-1 border rounded" onClick={()=>setPreset("second")}>Second half</button>
        <button className="px-3 py-1 border rounded" onClick={()=>setPreset("clear")}>Clear</button>
      </div>
      <input
        className="border p-2 rounded w-full"
        placeholder="Ranges e.g., 1-3,5,9-10"
        value={ranges}
        onChange={(e)=> setRanges(e.target.value)}
      />
      <input className="border p-2 rounded w-full" placeholder="Output file name" value={outputName} onChange={e=>setOutputName(e.target.value)} />
      <button
        onClick={handleSplit}
        disabled={!file || busy}
        className="px-4 py-2 w-full sm:w-auto  rounded bg-black text-white disabled:opacity-50"
      >
        {busy ? "Working…" : "Extract & Download"}
      </button>
    </main>
  );
}