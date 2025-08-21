import React, { useEffect, useState } from "react";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf";

/** Reorder a list of PDF files (first-page preview). */
export default function FileListReorder({ files, onChange, onRemove }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const out = [];
      for (const f of files) {
        try {
          const ab = await f.arrayBuffer();
          const pdf = await pdfjs.getDocument({ data: new Uint8Array(ab) }).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: window.innerWidth < 640 ? 0.25 : 0.32 });
          const canvas = document.createElement("canvas");
          canvas.width = viewport.width; canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");
          await page.render({ canvasContext: ctx, viewport }).promise;
          out.push({ file: f, thumb: canvas.toDataURL() });
        } catch {
          out.push({ file: f, thumb: null });
        }
      }
      if (!cancelled) setItems(out);
    })();
    return () => { cancelled = true; };
  }, [files]);

  function commit(arr) { setItems(arr); onChange?.(arr.map(x=>x.file)); }

  function onDragStart(e, from) { if (navigator.maxTouchPoints===0) e.dataTransfer.setData("from", String(from)); }
  function onDrop(e, to) {
    if (navigator.maxTouchPoints>0) return;
    const from = parseInt(e.dataTransfer.getData("from"),10);
    if (!Number.isInteger(from) || from===to) return;
    const arr = [...items]; const [m] = arr.splice(from,1); arr.splice(to,0,m); commit(arr);
    e.preventDefault();
  }

  return (
    <div className="space-y-4">
      {items.map((it, i) => (
        <div key={i}
          className="relative flex items-center gap-4 p-3 rounded bg-gray-100"
          draggable={navigator.maxTouchPoints===0}
          onDragStart={(e)=>onDragStart(e, i)}
          onDrop={(e)=>onDrop(e, i)}
          onDragOver={(e)=>navigator.maxTouchPoints===0 && e.preventDefault()}>
          <div className="w-16 h-16 border rounded overflow-hidden bg-white">
            {it.thumb ? <img src={it.thumb} alt="" className="w-full h-full object-contain"/> :
              <div className="w-full h-full grid place-items-center text-xs text-gray-500">PDF</div>}
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm">{it.file.name}</div>
            <div className="text-xs text-gray-500">{(it.file.size/1024).toFixed(1)} KB</div>
          </div>

          {navigator.maxTouchPoints>0 && (
            <div className="flex flex-col gap-1">
              <button className="text-xs bg-white rounded px-2 py-1 shadow"
                onClick={()=>{ if(i>0){ const arr=[...items]; const [m]=arr.splice(i,1); arr.splice(i-1,0,m); commit(arr);} }}>↑</button>
              <button className="text-xs bg-white rounded px-2 py-1 shadow"
                onClick={()=>{ if(i<items.length-1){ const arr=[...items]; const [m]=arr.splice(i,1); arr.splice(i+1,0,m); commit(arr);} }}>↓</button>
            </div>
          )}

          <button className="absolute right-3 top-3 text-gray-500" onClick={()=>{
            const arr = items.filter((_,idx)=>idx!==i); commit(arr);
            onRemove?.(i);
          }}>✕</button>
        </div>
      ))}
    </div>
  );
}
