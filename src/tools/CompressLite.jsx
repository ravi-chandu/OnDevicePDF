import React from "react";
import Dropzone from "../components/Dropzone";
import { compressLite, downloadBlob } from "../utils/pdf";

export default function CompressLiteTool() {
  const [file, setFile] = React.useState(null);

  async function onFiles(fs) {
    setFile(fs[0]);
  }

  async function handleCompress() {
    if (!file) return;
    const blob = await compressLite(file);
    downloadBlob(blob, file.name.replace(/\.pdf$/i, "") + "-lite.pdf");
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <Dropzone onFiles={onFiles} />
      {file && (
        <button onClick={handleCompress} className="px-4 py-2 bg-blue-600 text-white rounded">
          Save Lite
        </button>
      )}
    </div>
  );
}
