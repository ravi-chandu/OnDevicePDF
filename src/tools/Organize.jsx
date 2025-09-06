import React, { useState } from "react";
import Dropzone from "../components/Dropzone";
import { downloadBlob } from "../utils/pdf";
import { reorderPages } from "../utils/pdf";

export default function Organize(){
  const [file, setFile] = useState(null);
  const [order, setOrder] = useState([]);

  const onFiles = (f)=> {
    setFile(f[0]);
    // initial order guess for 10 pages
    setOrder(Array.from({length: 10}, (_,i)=>i).map(n=>n));
  };

  const swap = (a,b)=> setOrder(o=>{
    const copy = [...o];
    const tmp = copy[a]; copy[a]=copy[b]; copy[b]=tmp;
    return copy;
  });

  const run = async () => {
    if (!file) return;
    const out = await reorderPages(file, order);
    downloadBlob(out, "reordered.pdf");
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Organize pages</h1>
      <Dropzone multiple={false} onFiles={onFiles}/>
      <p className="mt-4 text-sm text-slate-600">Tip: this demo uses a simple order list (0‑based). Replace with thumbnails if desired.</p>
      <div className="mt-3 card p-4">
        <div className="flex flex-wrap gap-2">
          {order.map((n,i)=>(
            <span key={i} className="badge">page {n+1}</span>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <button className="btn btn-outline" onClick={()=>swap(0,1)}>Swap 1 & 2</button>
          <button className="btn btn-primary" onClick={run}>Reorder & Download</button>
        </div>
      </div>
    </main>
  );
}
