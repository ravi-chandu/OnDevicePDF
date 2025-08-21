import React, { useEffect, useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

/**
 * ThumbGrid
 * - Renders page thumbnails for a given File (PDF)
 * - Optional selection (click) and drag-reorder (desktop) / up-down controls (touch)
 * Props:
 *   file: File
 *   selectable?: boolean (default false)
 *   reorder?: boolean (default false)
 *   onChangeSelection?: (selectedIndices:number[]) => void
 *   onChangeOrder?: (zeroBasedOrder:number[]) => void
 *   className?: string
 */
export default function ThumbGrid({ file, selectable=false, reorder=false, onChangeSelection, onChangeOrder, className="" }) {
  const [thumbs, setThumbs] = useState([]); // {index, url, selected}

  useEffect(() => {
    let cancelled = false;
    async function gen() {
      if (!file) { setThumbs([]); return; }
      const ab = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(ab) }).promise;
      const t = [];
      for (let i=1;i<=pdf.numPages;i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: window.innerWidth < 640 ? 0.25 : 0.3 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        await page.render({ canvasContext: ctx, viewport }).promise;
        t.push({ index: i-1, url: canvas.toDataURL(), selected: false });
      }
      if (!cancelled) setThumbs(t);
    }
    gen();
    return () => { cancelled = true; };
  }, [file]);

  const toggle = useCallback((idx) => {
    if (!selectable) return;
    setThumbs(prev => {
      const arr = prev.map(x => ({...x}));
      arr[idx].selected = !arr[idx].selected;
      onChangeSelection?.(arr.filter(x=>x.selected).map(x=>x.index));
      return arr;
    });
  }, [selectable, onChangeSelection]);

  function onDragStart(e, fromIdx) {
    if (!reorder || navigator.maxTouchPoints > 0) return; // drag only desktop
    e.dataTransfer.setData("from", String(fromIdx));
  }
  function onDrop(e, toIdx) {
    if (!reorder || navigator.maxTouchPoints > 0) return;
    const from = parseInt(e.dataTransfer.getData("from"),10);
    if (Number.isInteger(from) && from !== toIdx) {
      setThumbs(prev => {
        const arr = prev.map(x => ({...x}));
        const [m] = arr.splice(from,1);
        arr.splice(toIdx,0,m);
        onChangeOrder?.(arr.map(x=>x.index));
        return arr;
      });
    }
    e.preventDefault();
  }
  function onDragOver(e){ if (reorder && navigator.maxTouchPoints===0) e.preventDefault(); }

  // touch helpers
  function move(idx, delta) {
    setThumbs(prev => {
      const arr = prev.map(x => ({...x}));
      const to = idx + delta;
      if (to < 0 || to >= arr.length) return arr;
      const [m] = arr.splice(idx,1);
      arr.splice(to,0,m);
      onChangeOrder?.(arr.map(x=>x.index));
      return arr;
    });
  }

  return (
    <div className={"grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 " + className}>
      {thumbs.map((t,i)=>(
        <div key={i}
             className={"relative border rounded overflow-hidden " + (t.selected ? "ring-2 ring-indigo-500" : "")}
             draggable={reorder && navigator.maxTouchPoints===0}
             onDragStart={(e)=>onDragStart(e,i)}
             onDrop={(e)=>onDrop(e,i)}
             onDragOver={onDragOver}
             onClick={()=>toggle(i)}>
          <img src={t.url} alt={"Page " + (t.index+1)} className="block w-full h-auto"/>
          {selectable && (
            <span className="absolute top-1 left-1 bg-white/80 text-xs px-1 rounded">{t.index+1}</span>
          )}
          {reorder && navigator.maxTouchPoints > 0 && (
            <div className="absolute right-1 top-1 flex flex-col gap-1">
              <button type="button" className="rounded bg-white/90 text-xs px-2 py-1 shadow"
                onClick={(e)=>{ e.stopPropagation(); move(i,-1); }}>↑</button>
              <button type="button" className="rounded bg-white/90 text-xs px-2 py-1 shadow"
                onClick={(e)=>{ e.stopPropagation(); move(i,1); }}>↓</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
