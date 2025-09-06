import React, { useState } from "react";
import Dropzone from "../components/Dropzone";
import { downloadBlob } from "../utils/pdf";
import { rotatePages } from "../utils/pdf";

export default function Rotate(){
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState("1");
  const [deg, setDeg] = useState(90);
  const onFiles = (f)=> setFile(f[0]);

  const run = async () => {
    if (!file) return;
    const list = pages.split(",").map(s=>parseInt(s.trim(),10)-1).filter(n=>!Number.isNaN(n));
    const map = list.map(i=>[i, deg]);
    const out = await rotatePages(file, map);
    downloadBlob(out, "rotated.pdf");
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Rotate pages</h1>
      <Dropzone multiple={false} onFiles={onFiles}/>
      <div className="mt-4 card p-4 flex items-center gap-3">
        <label className="w-40 text-sm">Pages (e.g. 1,2,3)</label>
        <input className="border rounded-lg px-3 py-2" value={pages} onChange={e=>setPages(e.target.value)}/>
        <select className="border rounded-lg px-3 py-2" value={deg} onChange={e=>setDeg(parseInt(e.target.value,10))}>
          <option value="90">Rotate 90°</option>
          <option value="180">Rotate 180°</option>
          <option value="270">Rotate 270°</option>
        </select>
        <button className="btn btn-primary" onClick={run}>Apply</button>
      </div>
    </main>
  );
}
