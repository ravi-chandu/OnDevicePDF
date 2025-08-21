
import React, { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import HowToUse from "../components/HowToUse";
import PageTitle from "../components/PageTitle";
import ThumbGrid from "../components/ThumbGrid";

function parseRanges(input, max) {
  if (!input) return null; // null => all pages
  const out = new Set();
  input.split(",").map(s=>s.trim()).forEach(part=>{
    if (!part) return;
    if (part.includes("-")) {
      let [a,b] = part.split("-").map(n=>parseInt(n,10));
      if (isNaN(a)||isNaN(b)) return;
      if (a>b) [a,b] = [b,a];
      for (let i=a;i<=b;i++) if (i>=1 && i<=max) out.add(i-1);
    } else {
      const n = parseInt(part,10);
      if (!isNaN(n) && n>=1 && n<=max) out.add(n-1);
    }
  });
  return Array.from(out).sort((a,b)=>a-b);
}

export default function RotatePages() {
  const [outputName, setOutputName] = useState("rotated.pdf");
  const [file, setFile] = useState(null);
  const [ranges, setRanges] = useState(""); // blank = all
  const [deg, setDeg] = useState(90);
  const [busy, setBusy] = useState(false);

  function handleThumbSelect(selectedIdxs) {
    // selectedIdxs are zero-based; convert to 1-based csv and push into ranges
    const csv = selectedIdxs.map(n => n+1).join(",");
    setRanges(csv);
  }

  async function applyRotate() {
    if (!file) return;
    setBusy(true);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const pdf = await PDFDocument.load(bytes);

      const selected = parseRanges(ranges, pdf.getPageCount()); // null or array
      for (let i=0;i<pdf.getPageCount();i++) {
        if (selected && !selected.includes(i)) continue;
        const p = pdf.getPage(i);
        p.setRotation(degrees(Number(deg)));
      }

      const out = await pdf.save();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([out], { type: "application/pdf" }));
      a.download = outputName.endsWith(".pdf") ? outputName : outputName + ".pdf";
      a.click();
      URL.revokeObjectURL(a.href);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6 space-y-4">
      <PageTitle icon="🔄" title="Rotate Pages" />
      <HowToUse steps={[
        "Drop one PDF.",
        "Pick degrees and (optionally) page ranges or click thumbnails to fill ranges.",
        "Click “Apply & Download”.",
      ]} />

      <input type="file" accept="application/pdf" onChange={e=>setFile(e.target.files[0])} />

      {/* Thumbnails to preview/select pages (selection fills the ranges input) */}
      <ThumbGrid file={file} selectable onChangeSelection={handleThumbSelect} className="mt-2" />

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="flex gap-2">
          <select className="border rounded p-2" value={deg} onChange={e=>setDeg(e.target.value)}>
            <option value={90}>90°</option>
            <option value={180}>180°</option>
            <option value={270}>270°</option>
          </select>
          <input className="border rounded p-2 flex-1" placeholder="Pages to rotate (blank = all, e.g., 1-3,5)"
                 value={ranges} onChange={e=>setRanges(e.target.value)} />
        </div>
        <input className="border p-2 rounded w-full" placeholder="Output file name"
               value={outputName} onChange={e=>setOutputName(e.target.value)} />
      </div>

      <button disabled={busy || !file} className="px-4 py-2 w-full sm:w-auto bg-black text-white rounded disabled:opacity-50"
              onClick={applyRotate}>
        {busy ? "Working..." : "Apply & Download"}
      </button>
    </main>
  );
}
