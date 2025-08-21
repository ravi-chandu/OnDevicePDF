import React, { useEffect, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import JSZip from "jszip";

import HowToUse from "../components/HowToUse";
import PageTitle from "../components/PageTitle";

export default function ConvertBasic() {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]); // dataURLs
  const [zipMode, setZipMode] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!file) { setImages([]); return; }
    let cancelled = false;
    (async () => {
      setBusy(true);
      const bytes = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const out = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: ctx, viewport }).promise;
        out.push(canvas.toDataURL("image/png"));
      }
      if (!cancelled) setImages(out);
      setBusy(false);
    })();
    return () => { cancelled = true; };
  }, [file]);

  async function download(dataURL, i) {
    if (!zipMode) {
      const a = document.createElement("a");
      a.href = dataURL;
      a.download = `${prefix||'page'}-${i+1}.png`;
      a.click();
      return;
    }
    const zip = new JSZip();
    images.forEach((url, idx) => {
      const base64 = url.split(",")[1];
      zip.file(`${prefix||'page'}-${idx+1}.png`, base64, { base64: true });
    });
    const content = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(content);
    a.download = (prefix || 'images') + '.zip';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6 space-y-4">
      <PageTitle icon="🖼️" title="Convert PDF to Images" />
      <HowToUse steps={["Drop one PDF.", "Set filename prefix; enable ZIP to get a single .zip with all pages.", "Click download."]} />

      

      <p className="text-gray-600">Renders pages to PNG. Download individual images or enable ZIP to download all pages as a single archive.</p>

      

      <input type="file" accept="application/pdf" onChange={(e)=> setFile(e.target.files[0])} />
      <input className="border p-2 rounded w-full max-w-md" placeholder="Filename prefix (optional)" value={prefix} onChange={(e)=> setPrefix(e.target.value)} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={zipMode} onChange={()=> setZipMode(!zipMode)} /> Package as ZIP (off = separate image files)</label>
      {busy && <div className="text-gray-500">Rendering…</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((url, i) => (
          <div key={i} className="border rounded p-2">
            <img src={url} alt={"Page "+(i+1)} className="w-full" />
            <button onClick={()=>download(url, i)} className="mt-2 px-3 py-1 bg-black text-white rounded">Download PNG</button>
          </div>
        ))}
      </div>
    </main>
  );
}