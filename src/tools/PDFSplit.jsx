import React, { useState } from "react";
import Dropzone from "../components/Dropzone";
import { downloadBlob } from "../utils/pdf";
import { splitPDF } from "../utils/pdf";

export default function PDFSplit(){
  const [file, setFile] = useState(null);
  const [range, setRange] = useState("1-1");

  const onFiles = (f)=> setFile(f[0]);
  const run = async () => {
    if (!file) return;
    const parts = range.split(",").map(r=>r.trim()).filter(Boolean);
    const ranges = parts.map(p=>{
      const [a,b] = p.split("-").map(n=>parseInt(n,10));
      return [a||1, b||a||1];
    });
    const outs = await splitPDF(file, ranges);
    outs.forEach((b, i)=> downloadBlob(b, `split-${i+1}.pdf`));
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Split PDF</h1>
      <Dropzone multiple={false} onFiles={onFiles}/>
      <div className="mt-4 card p-4 flex items-center gap-3">
        <label className="text-sm w-40">Page ranges (e.g. 1-1, 2-3)</label>
        <input className="border rounded-lg px-3 py-2 w-full" value={range} onChange={e=>setRange(e.target.value)}/>
        <button className="btn btn-primary" onClick={run}>Split</button>
      </div>
    </main>
  );
}
