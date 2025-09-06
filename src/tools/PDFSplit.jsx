import React from "react";
import Dropzone from "../components/Dropzone";
import { extractPages, parseRanges, downloadBlob } from "../utils/pdf";

export default function PDFSplit() {
  const [file, setFile] = React.useState(null);
  const [ranges, setRanges] = React.useState("1-1");

  async function onFiles(fs) {
    const f = fs[0];
    setFile(f);
  }

  async function handleSplit() {
    if (!file) return;
    const buf = await file.arrayBuffer();
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(buf);
    const count = doc.getPageCount();
    const indices = parseRanges(ranges, count);
    if (!indices.length) return alert("No valid page indices.");

    const out = await extractPages(file, indices);
    downloadBlob(out, "split.pdf");
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <Dropzone onFiles={onFiles} />
      {file && (
        <>
          <label className="block">
            <span className="font-medium">Pages to extract (e.g. 1,3-5,8)</span>
            <input
              className="mt-1 w-full rounded border p-2"
              value={ranges}
              onChange={e => setRanges(e.target.value)}
              placeholder="1-3"
            />
          </label>
          <button onClick={handleSplit} className="px-4 py-2 bg-blue-600 text-white rounded">
            Extract
          </button>
        </>
      )}
    </div>
  );
}
