import React, { useState } from "react";
import Dropzone from "../components/Dropzone";
import { downloadBlob } from "../utils/pdf";
import { compressLite } from "../utils/pdf";

export default function CompressLite(){
  const [file, setFile] = useState(null);
  const onFiles = (f)=> setFile(f[0]);
  const run = async () => {
    if (!file) return;
    const out = await compressLite(file);
    downloadBlob(out, "compressed.pdf");
  };
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Compress (Lite)</h1>
      <Dropzone multiple={false} onFiles={onFiles}/>
      <div className="mt-4 card p-4">
        <button className="btn btn-primary" onClick={run}>Re-save & Download</button>
      </div>
    </main>
  );
}
