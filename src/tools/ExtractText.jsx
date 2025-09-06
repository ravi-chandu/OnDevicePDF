import React, { useState } from "react";
import Dropzone from "../components/Dropzone";

export default function ExtractText(){
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");

  const onFiles = (f)=> setFile(f[0]);

  const run = async () => {
    if (!file) return;
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf");
    const workerSrc = await import("pdfjs-dist/legacy/build/pdf.worker.min.js?url");
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc.default;

    const data = new Uint8Array(await file.arrayBuffer());
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;

    let out = [];
    for (let i=1; i<=pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      out.push(content.items.map(it=>it.str).join(" "));
    }
    setText(out.join("\n\n"));
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Extract text</h1>
      <Dropzone multiple={false} onFiles={onFiles}/>
      <div className="mt-4 card p-4 flex items-start gap-3">
        <button className="btn btn-primary" onClick={run}>Extract</button>
      </div>
      {text && (
        <pre className="mt-4 p-4 rounded-xl border border-slate-200 overflow-auto whitespace-pre-wrap">{text}</pre>
      )}
    </main>
  );
}
