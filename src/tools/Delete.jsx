import React, { useState } from "react";
import Dropzone from "../components/Dropzone";
import { downloadBlob } from "../utils/pdf";
import { deletePages } from "../utils/pdf";

export default function Delete(){
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState("1");
  const onFiles = (f)=> setFile(f[0]);

  const run = async () => {
    if (!file) return;
    const del = new Set(pages.split(",").map(s=>parseInt(s.trim(),10)-1).filter(n=>!Number.isNaN(n)));
    const out = await deletePages(file, del);
    downloadBlob(out, "clean.pdf");
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Delete pages</h1>
      <Dropzone multiple={false} onFiles={onFiles}/>
      <div className="mt-4 card p-4 flex items-center gap-3">
        <label className="w-40 text-sm">Pages to remove (e.g. 2,5)</label>
        <input className="border rounded-lg px-3 py-2" value={pages} onChange={e=>setPages(e.target.value)}/>
        <button className="btn btn-primary" onClick={run}>Delete</button>
      </div>
    </main>
  );
}
