import React, { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import { degrees } from "pdf-lib";

import HowToUse from "../components/HowToUse";
import PageTitle from "../components/PageTitle";

export default function Organize() {
  const [outputName, setOutputName] = useState("organized.pdf");
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]); // {index, rotation:0|90|180|270, selected:false, thumbURL}
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!file) return;
    let isCancelled = false;
    (async () => {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const arr = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.25 }); // small thumbs
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: ctx, viewport }).promise;
        const url = canvas.toDataURL("image/png");
        arr.push({ index: i - 1, rotation: 0, selected: false, thumbURL: url });
      }
      if (!isCancelled) setPages(arr);
    })();
    return () => { isCancelled = true };
  }, [file]);

  function onDragStart(e, idx) {
    e.dataTransfer.setData("text/plain", idx);
  }
  function onDrop(e, idx) {
    const from = parseInt(e.dataTransfer.getData("text/plain"), 10);
    if (isNaN(from)) return;
    const arr = [...pages];
    const [moved] = arr.splice(from, 1);
    arr.splice(idx, 0, moved);
    setPages(arr);
    e.preventDefault();
  }
  function onDragOver(e) { e.preventDefault(); }

  function toggleSelect(i) {
    const arr = [...pages];
    arr[i].selected = !arr[i].selected;
    setPages(arr);
  }
  function rotateSelected() {
    const arr = pages.map(p => p.selected ? { ...p, rotation: (p.rotation + 90) % 360 } : p);
    setPages(arr);
  }
  function deleteSelected() {
    setPages(pages.filter(p => !p.selected));
  }

  async function saveReordered() {
    if (!file || !pages.length) return;
    setBusy(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const src = await PDFDocument.load(bytes);
      const indices = pages.map(p => p.index);
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, indices);
      copied.forEach((pg, i) => { pg.setRotation(toDegrees(pages[i].rotation)); out.addPage(pg); });
      const outBytes = await out.save();
      const blob = new Blob([outBytes], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = outputName.endsWith(".pdf") ? outputName : outputName + ".pdf";
      a.click();
      URL.revokeObjectURL(a.href);
    } finally { setBusy(false); }
  }

  function toDegrees(deg) { return degrees(deg); }

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6 space-y-4">
      <PageTitle icon="🗂️" title="Organize Pages" />
      <HowToUse steps={["Drop one PDF to see thumbnails.", "Drag to reorder; click to select; use Rotate/Delete.", "Click \u201cSave as PDF\u201d."]} />

      

      <p className="text-gray-600">Drag to reorder, select to rotate or delete. Processing stays on your device.</p>

      

      <input type="file" accept="application/pdf" onChange={(e)=> setFile(e.target.files[0])} />
      <div className="flex gap-2">
        <button onClick={rotateSelected} className="px-3 py-2 border rounded">Rotate 90°</button>
        <button onClick={deleteSelected} className="px-3 py-2 border rounded">Delete selected</button>
        <button onClick={saveReordered} disabled={!file || !pages.length || busy} className="px-3 py-2 bg-black text-white rounded disabled:opacity-50">
          {busy ? "Saving…" : "Save as PDF"}
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {pages.map((p, i) => (
          <div key={i}
            draggable
            onDragStart={(e)=>onDragStart(e, i)}
            onDragOver={onDragOver}
            onDrop={(e)=>onDrop(e, i)}
            onClick={()=>toggleSelect(i)}
            className={"border rounded p-1 cursor-move " + (p.selected ? "ring-2 ring-indigo-500" : "")}>
            <img src={p.thumbURL} alt={"p"+(p.index+1)} className="w-full block" />
            <div className="text-xs text-center py-1">Page {p.index+1} {p.rotation?`• ${p.rotation}°`: ""}</div>
          </div>
        ))}
      </div>
    </main>
  );
}