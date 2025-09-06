import React from "react";
import Dropzone from "../components/Dropzone";
import { compressLite, downloadBlob } from "../utils/pdf";

export default function Rename() {
  const [file, setFile] = React.useState(null);
  const [name, setName] = React.useState("renamed.pdf");

  async function onFiles(fs) {
    setFile(fs[0]);
  }

  async function handleRename() {
    if (!file) return;
    const blob = await compressLite(file);
    downloadBlob(blob, name.endsWith(".pdf") ? name : `${name}.pdf`);
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <Dropzone onFiles={onFiles} />
      {file && (
        <>
          <label className="block">
            <span className="font-medium">New filename</span>
            <input className="mt-1 border rounded p-2 w-full" value={name} onChange={e => setName(e.target.value)} />
          </label>
          <button onClick={handleRename} className="px-4 py-2 bg-blue-600 text-white rounded">
            Download as new name
          </button>
        </>
      )}
    </div>
  );
}
