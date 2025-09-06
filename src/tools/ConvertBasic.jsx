import React, { useState } from "react";
import Dropzone from "../components/Dropzone";
import { downloadBlob } from "../utils/pdf";
import { convertToPages, downloadBlob } from "../utils/pdf";

export default function ConvertBasic(){
  const [file, setFile] = useState(null);
  const onFiles = (f)=> setFile(f[0]);
  const run = async () => {
    if (!file) return;
    const outs = await convertToPages(file);
    outs.forEach((b,i)=> downloadBlob(b, `page-${i+1}.pdf`));
  };
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Convert (Basic)</h1>
      <Dropzone multiple={false} onFiles={onFiles}/>
      <div className="mt-4 card p-4">
        <button className="btn btn-primary" onClick={run}>Export pages as PDFs</button>
      </div>
    </main>
  );
}
