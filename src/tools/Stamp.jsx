
import React, { useState } from "react";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";

import HowToUse from "../components/HowToUse";
import PageTitle from "../components/PageTitle";

export default function Stamp() {
  const [outputName, setOutputName] = useState("stamped.pdf");
  const [file, setFile] = useState(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [addPageNumbers, setAddPageNumbers] = useState(true);
  const [range, setRange] = useState(""); // blank = all
  const [position, setPosition] = useState("bottom-center");
  const [fontSize, setFontSize] = useState(14);
  const [opacity, setOpacity] = useState(0.6);
  const [angle, setAngle] = useState(0);
  const [busy, setBusy] = useState(false);

  const positionOptions = [
    ["top-left","Top left"],["top-center","Top center"],["top-right","Top right"],
    ["mid-left","Middle left"],["mid-center","Middle center"],["mid-right","Middle right"],
    ["bottom-left","Bottom left"],["bottom-center","Bottom center"],["bottom-right","Bottom right"],
  ];

  function parseRanges(input, max) {
    if (!input) return null;
    const out = new Set();
    input.split(",").map(s=>s.trim()).forEach(part=>{
      if (!part) return;
      if (part.includes("-")) {
        let [a,b]=part.split("-").map(n=>parseInt(n,10));
        if (isNaN(a)||isNaN(b)) return;
        if (a>b) [a,b]=[b,a];
        for(let i=a;i<=b;i++) if(i>=1 && i<=max) out.add(i-1);
      } else {
        const n=parseInt(part,10);
        if(!isNaN(n) && n>=1 && n<=max) out.add(n-1);
      }
    });
    return Array.from(out).sort((a,b)=>a-b);
  }

  async function handleApply() {
    if (!file) return;
    setBusy(true);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const pdf = await PDFDocument.load(bytes);
      const font = await pdf.embedFont(StandardFonts.Helvetica);

      const selected = parseRanges(range, pdf.getPageCount());

      for (let i=0;i<pdf.getPageCount();i++) {
        if (selected && !selected.includes(i)) continue;
        const page = pdf.getPage(i);
        const { width, height } = page.getSize();

        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const textHeight = fontSize;

        let x = 0, y = 0;
        const [v,h] = position.split("-");
        if (h === "left") x = 36;
        if (h === "center") x = (width - textWidth)/2;
        if (h === "right") x = width - textWidth - 36;

        if (v === "top") y = height - 36 - textHeight;
        if (v === "mid") y = (height - textHeight)/2;
        if (v === "bottom") y = 36;

        page.drawText(text, {
          x, y,
          size: fontSize,
          font,
          color: rgb(0,0,0),
          opacity,
          rotate: degrees(angle)
        });

        if (addPageNumbers) {
          const pgText = `Page ${i+1} of ${pdf.getPageCount()}`;
          const pgW = font.widthOfTextAtSize(pgText, 10);
          page.drawText(pgText, { x: width - pgW - 36, y: 18, size: 10, font, color: rgb(0,0,0), opacity: 0.7 });
        }
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
      <PageTitle icon="🔖" title="Add Page Numbers / Watermark" />
      <HowToUse steps={["Drop one PDF.", "Choose position, range, and text.", "Optionally add page numbers.", "Click “Apply & Download”."]} />

      <input type="file" accept="application/pdf" onChange={(e)=> setFile(e.target.files[0])} />

      <div className="grid sm:grid-cols-2 gap-3">
        <input className="border p-2 rounded w-full" placeholder="Watermark text" value={text} onChange={(e)=> setText(e.target.value)} />
        <select className="border p-2 rounded w-full" value={position} onChange={(e)=> setPosition(e.target.value)}>
          {positionOptions.map(([v,l])=> <option key={v} value={v}>{l}</option>)}
        </select>
        <input className="border p-2 rounded w-full" placeholder="Pages to apply (blank = all, e.g., 1-3,5)" value={range} onChange={(e)=> setRange(e.target.value)} />
        <label className="flex items-center gap-2"><input type="checkbox" checked={addPageNumbers} onChange={()=> setAddPageNumbers(v=>!v)} /> Add page numbers</label>
        <label className="flex items-center gap-2">Font size <input type="number" className="border p-2 rounded w-full" min="8" max="64" value={fontSize} onChange={e=>setFontSize(parseInt(e.target.value||"14",10))} /></label>
        <label className="flex items-center gap-2">Opacity <input type="range" min="0" max="1" step="0.05" value={opacity} onChange={e=>setOpacity(parseFloat(e.target.value))} /></label>
        <label className="flex items-center gap-2">Angle <input type="number" className="border p-2 rounded w-full" min="-90" max="90" value={angle} onChange={e=>setAngle(parseInt(e.target.value||"0",10))} /></label>
      </div>

      <input className="border p-2 rounded w-full" placeholder="Output file name" value={outputName} onChange={e=>setOutputName(e.target.value)} />
      <button disabled={busy || !file} onClick={handleApply} className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-50 w-full sm:w-auto">{busy ? "Working..." : "Apply & Download"}</button>
    </main>
  );
}
