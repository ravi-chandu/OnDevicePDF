// src/utils/pdf.js
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function readFileAsArrayBuffer(file) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result);
    fr.onerror = rej;
    fr.readAsArrayBuffer(file);
  });
}

export function downloadBlob(blob, filename = "output.pdf") {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// "1,3-5,8" -> [0, 2, 3, 4, 7] (zero-based)
export function parseRanges(ranges, pageCount) {
  const set = new Set();
  const chunks = (ranges || "").split(",").map(s => s.trim()).filter(Boolean);
  for (const chunk of chunks) {
    if (chunk.includes("-")) {
      const [a, b] = chunk.split("-").map(n => parseInt(n, 10));
      if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
      const start = Math.max(1, Math.min(a, b));
      const end = Math.min(pageCount, Math.max(a, b));
      for (let i = start; i <= end; i++) set.add(i - 1);
    } else {
      const n = parseInt(chunk, 10);
      if (Number.isFinite(n) && n >= 1 && n <= pageCount) set.add(n - 1);
    }
  }
  return [...set].sort((x, y) => x - y);
}

export async function mergeFiles(files) {
  const merged = await PDFDocument.create();
  for (const f of files) {
    const ab = await readFileAsArrayBuffer(f);
    const doc = await PDFDocument.load(ab);
    const pages = await merged.copyPages(doc, doc.getPageIndices());
    pages.forEach(p => merged.addPage(p));
  }
  return new Blob([await merged.save()], { type: "application/pdf" });
}

export async function extractPages(file, indices) {
  const ab = await readFileAsArrayBuffer(file);
  const src = await PDFDocument.load(ab);
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, indices);
  pages.forEach(p => out.addPage(p));
  return new Blob([await out.save()], { type: "application/pdf" });
}

export async function deletePages(file, indicesToDelete) {
  const ab = await readFileAsArrayBuffer(file);
  const src = await PDFDocument.load(ab);
  const keep = src.getPageIndices().filter(i => !indicesToDelete.includes(i));
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, keep);
  pages.forEach(p => out.addPage(p));
  return new Blob([await out.save()], { type: "application/pdf" });
}

export async function rotatePages(file, map) {
  // map: { [pageIndex]: degrees }
  const ab = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(ab);
  for (const [idxStr, deg] of Object.entries(map)) {
    const idx = Number(idxStr);
    if (!Number.isInteger(idx)) continue;
    const page = doc.getPage(idx);
    const current = page.getRotation().angle;
    page.setRotation(deg + current);
  }
  return new Blob([await doc.save()], { type: "application/pdf" });
}

export async function reorderPages(file, order) {
  // order: array of zero-based indices, length = pageCount
  const ab = await readFileAsArrayBuffer(file);
  const src = await PDFDocument.load(ab);
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, order);
  pages.forEach(p => out.addPage(p));
  return new Blob([await out.save()], { type: "application/pdf" });
}

export async function stampText(file, text, color = rgb(0.8,0.1,0.1), size = 36, opacity = 0.2) {
  const ab = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(ab);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);

  doc.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    page.drawText(text, {
      x: width / 2 - (text.length * size * 0.25),
      y: height / 2,
      size,
      color,
      opacity,
      rotate: { type: "degrees", angle: 30 },
      font
    });
  });

  return new Blob([await doc.save()], { type: "application/pdf" });
}

// Compress (Lite): just re-save (linearizes / strips)
export async function compressLite(file) {
  const ab = await readFileAsArrayBuffer(file);
  const doc = await PDFDocument.load(ab);
  return new Blob([await doc.save()], { type: "application/pdf" });
}

// Convert (Basic): split into one-PDF-per-page (returns array of {name,blob})
export async function convertBasic(file, baseName = "page") {
  const ab = await readFileAsArrayBuffer(file);
  const src = await PDFDocument.load(ab);
  const pages = src.getPageIndices();
  const outputs = [];
  for (let i of pages) {
    const out = await PDFDocument.create();
    const [p] = await out.copyPages(src, [i]);
    out.addPage(p);
    outputs.push({ name: `${baseName}-${i + 1}.pdf`, blob: new Blob([await out.save()], { type: "application/pdf" }) });
  }
  return outputs;
}
