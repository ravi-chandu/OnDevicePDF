import React, { useState } from "react";
import Dropzone from "../components/Dropzone";
import { downloadBlob } from "../utils/pdf";
import { stampText } from "../utils/pdf";

export default function Stamp(){
  const [file, setFile] = useState(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const onFiles = (f)=> setFile(f[0]);

  const run = async () => {
    if (!file) return;
    const out = await stampText(file, text, { x: 80, y: 80, size: 36, color:[0.85,0.1,0.1]});
    downloadBlob(out, "stamped.pdf");
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Stamp (text watermark)</h1>
      <Dropzone multiple={false} onFiles={onFiles}/>
      <div className="mt-4 card p-4 flex items-center gap-3">
        <label className="w-40 text-sm">Text</label>
        <input className="border rounded-lg px-3 py-2 w-full" value={text} onChange={e=>setText(e.target.value)}/>
        <button className="btn btn-primary" onClick={run}>Apply</button>
      </div>
    </main>
  );
}
