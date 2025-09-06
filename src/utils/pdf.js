import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function readAsArrayBuffer(file) {
  return new Uint8Array(await file.arrayBuffer());
}

export async function mergePDFs(files) {
  const outPdf = await PDFDocument.create();
  for (const file of files) {
    const srcPdf = await PDFDocument.load(await file.arrayBuffer());
    const pages = await outPdf.copyPages(srcPdf, srcPdf.getPageIndices());
    for (const p of pages) outPdf.addPage(p);
  }
  const bytes = await outPdf.save();
  return new Blob([bytes], { type: "application/pdf" });
}

export async function splitPDF(file, ranges = [[1,1]]) {
  const src = await PDFDocument.load(await file.arrayBuffer());
  const outputs = [];
  for (const [start, end] of ranges) {
    const s = Math.max(1, start|0) - 1;
    const e = Math.min(src.getPageCount(), end|0) - 1;
    const out = await PDFDocument.create();
    const pages = await out.copyPages(src, Array.from({length: e-s+1}, (_,i)=>i+s));
    pages.forEach(p=>out.addPage(p));
    outputs.push(new Blob([await out.save()], {type:"application/pdf"}));
  }
  return outputs;
}

export async function reorderPages(file, order) {
  const src = await PDFDocument.load(await file.arrayBuffer());
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, order);
  pages.forEach(p=>out.addPage(p));
  return new Blob([await out.save()], {type:"application/pdf"});
}

export async function rotatePages(file, rotateMap) {
  const src = await PDFDocument.load(await file.arrayBuffer());
  const pages = src.getPages();
  for (const [index, degrees] of rotateMap) {
    const p = pages[index];
    p.setRotation((p.getRotation().angle + degrees) % 360);
  }
  return new Blob([await src.save()], {type:"application/pdf"});
}

export async function deletePages(file, toDelete) {
  const src = await PDFDocument.load(await file.arrayBuffer());
  const keep = [];
  for (let i=0; i<src.getPageCount(); i++) if (!toDelete.has(i)) keep.push(i);
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, keep);
  pages.forEach(p=>out.addPage(p));
  return new Blob([await out.save()], {type:"application/pdf"});
}

export async function compressLite(file) {
  // re-save with pdf-lib (often reduces size slightly due to xref re-write)
  const src = await PDFDocument.load(await file.arrayBuffer());
  const out = await src.save({ useObjectStreams: true });
  return new Blob([out], { type: "application/pdf" });
}

export async function convertToPages(file) {
  const src = await PDFDocument.load(await file.arrayBuffer());
  const outputs = [];
  for (let i=0; i<src.getPageCount(); i++) {
    const out = await PDFDocument.create();
    const [page] = await out.copyPages(src, [i]);
    out.addPage(page);
    outputs.push(new Blob([await out.save()], {type:"application/pdf"}));
  }
  return outputs;
}

export async function stampText(file, text, options={}) {
  const { x=50, y=50, size=36, color=[0.8,0.1,0.1] } = options;
  const src = await PDFDocument.load(await file.arrayBuffer());
  const font = await src.embedFont(StandardFonts.HelveticaBold);
  const [r,g,b] = color;
  src.getPages().forEach(p=>{
    p.drawText(text, { x, y, size, font, color: rgb(r,g,b), opacity: 0.6 });
  });
  return new Blob([await src.save()], { type:"application/pdf" });
}

export function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 5000);
}
