import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";

import HowToUse from "../components/HowToUse";
import PageTitle from "../components/PageTitle";
import ThumbGrid from "../components/ThumbGrid";


export default function DeletePages() {
  const [outputName, setOutputName] = useState("deleted.pdf");
  const [file, setFile] = useState(null);
  const [ranges, setRanges] = useState("1");
  function handleThumbSelect(selectedIdxs){ const csv = selectedIdxs.map(n=>n+1).join(","); setRanges(csv);} 

  function parseRanges(input, max) {
    const out = new Set();
    input.split(",").map(s=>s.trim()).forEach(part => {
      if (!part) return;
      if (part.includes("-")) {
        let [a,b] = part.split("-").map(n=>parseInt(n,10));
        if (isNaN(a) || isNaN(b)) return;
        if (a>b) [a,b]=[b,a];
        for (let i=a;i<=b;i++) if (i>=1 && i<=max) out.add(i-1);
      } else {
        const n = parseInt(part,10);
        if (!isNaN(n) && n>=1 && n<=max) out.add(n-1);
      }
    });
    return [...out].sort((x,y)=>x-y);
  }

  async function handleDelete() {
    if (!file) return;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const src = await PDFDocument.load(bytes);
    const all = src.getPageIndices();
    const del = parseRanges(ranges, all.length);
    const keep = all.filter(i => !del.includes(i));
    const out = await PDFDocument.create();
    const copied = await out.copyPages(src, keep);
    copied.forEach(p=>out.addPage(p));
    const outBytes = await out.save();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([outBytes], { type: "application/pdf" }));
    a.download = outputName.endsWith(".pdf") ? outputName : outputName + ".pdf"; a.click(); URL.revokeObjectURL(a.href);
  }

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6 space-y-4">
      <PageTitle icon="🗑️" title="Delete Pages" />
      <HowToUse steps={["Drop one PDF.", "Enter pages to delete (e.g., 1-3,5).", "Click \u201cDelete & Download\u201d."]} />

      

      <ThumbGrid file={file} selectable onChangeSelection={handleThumbSelect} className="mt-2"/>

      <input type="file" accept="application/pdf" onChange={e=>setFile(e.target.files[0])} />
      <input className="border rounded p-2 w-full" placeholder="Pages to delete (e.g., 1-3,5)" value={ranges} onChange={e=>setRanges(e.target.value)} />
      <input className="border p-2 rounded w-full" placeholder="Output file name" value={outputName} onChange={e=>setOutputName(e.target.value)} />
      <button className="px-4 py-2 w-full sm:w-auto  bg-red-600 text-white rounded" onClick={handleDelete}>Delete & Download</button>
    </main>
  );
}