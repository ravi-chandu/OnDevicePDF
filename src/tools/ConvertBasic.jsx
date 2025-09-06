import React from "react";
import Dropzone from "../components/Dropzone";
import { convertBasic, downloadBlob } from "../utils/pdf";

export default function ConvertBasic() {
  const [file, setFile] = React.useState(null);
  const [downloading, setDownloading] = React.useState(false);

  async function onFiles(fs) {
    setFile(fs[0]);
  }

  async function handleConvert() {
    if (!file) return;
    setDownloading(true);
    const base = file.name.replace(/\.pdf$/i, "");
    const outs = await convertBasic(file, base);
    for (const { name, blob } of outs) downloadBlob(blob, name);
    setDownloading(false);
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <Dropzone onFiles={onFiles} />
      {file && (
        <button disabled={downloading} onClick={handleConvert} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60">
          {downloading ? "Exporting…" : "Export each page"}
        </button>
      )}
    </div>
  );
}
