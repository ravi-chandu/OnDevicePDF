import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

import HowToUse from "../components/HowToUse";
import PageTitle from "../components/PageTitle";

export default function ExtractText() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleExtract() {
    if (!file) return;
    setBusy(true);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      let out = [];
      for (let i=1;i<=pdf.numPages;i++) {
        const page = await pdf.getPage(i);
        const tc = await page.getTextContent();
        const pageText = tc.items.map(it => it.str).join(" ");
        out.push(`--- Page ${i} ---\n` + pageText);
      }
      setText(out.join("\n\n"));
    } finally { setBusy(false); }
  }

  function downloadTxt() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
    a.download = "extracted.txt"; a.click(); URL.revokeObjectURL(a.href);
  }

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6 space-y-4">
      <PageTitle icon="📝" title="Extract Text" />
      <HowToUse steps={["Drop one PDF.", "Click \u201cExtract\u201d to preview text.", "Click \u201cDownload .txt\u201d to save it."]} />

      

      <input type="file" accept="application/pdf" onChange={e=>setFile(e.target.files[0])} />
      <button onClick={handleExtract} disabled={!file || busy} className="px-4 py-2 w-full sm:w-auto  bg-black text-white rounded disabled:opacity-50">{busy ? "Extracting…" : "Extract"}</button>
      {text && <div>
        <div className="text-sm text-gray-500 mb-2">Preview (download for full text)</div>
        <textarea className="w-full h-80 border rounded p-2" value={text} readOnly />
        <button onClick={downloadTxt} className="mt-2 px-4 py-2 w-full sm:w-auto  bg-black text-white rounded">Download .txt</button>
      </div>}
    </main>
  );
}