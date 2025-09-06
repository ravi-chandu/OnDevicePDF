import React, { useState } from "react";
import Dropzone from "../components/Dropzone";
import { downloadBlob } from "../utils/pdf";
import { mergePDFs } from "../utils/pdf";

export default function PDFMerge(){
  const [files, setFiles] = useState([]);
  const onFiles = (f)=> setFiles(prev => [...prev, ...f]);
  const merge = async () => {
    if (!files.length) return;
    const out = await mergePDFs(files);
    downloadBlob(out, "merged.pdf");
  };
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Merge PDFs</h1>
      <Dropzone onFiles={onFiles}/>
      {files.length>0 && (
        <div className="mt-4 card p-4">
          <p className="text-sm text-slate-600 mb-3">{files.length} files selected</p>
          <button className="btn btn-primary" onClick={merge}>Merge & Download</button>
        </div>
      )}
    </main>
  );
}
