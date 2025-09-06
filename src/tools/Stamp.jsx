import React from "react";
import Dropzone from "../components/Dropzone";
import { stampText, downloadBlob } from "../utils/pdf";

export default function Stamp() {
  const [file, setFile] = React.useState(null);
  const [text, setText] = React.useState("CONFIDENTIAL");
  const [size, setSize] = React.useState(36);
  const [opacity, setOpacity] = React.useState(0.2);

  async function onFiles(fs) {
    setFile(fs[0]);
  }

  async function handleStamp() {
    const blob = await stampText(file, text, undefined, Number(size), Number(opacity));
    downloadBlob(blob, file.name.replace(/\.pdf$/i, "") + "-stamped.pdf");
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <Dropzone onFiles={onFiles} />
      {file && (
        <>
          <label className="block">
            <span className="font-medium">Text</span>
            <input className="mt-1 border rounded p-2 w-full" value={text} onChange={e => setText(e.target.value)} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="font-medium">Size</span>
              <input type="number" min="8" className="mt-1 border rounded p-2 w-full" value={size} onChange={e => setSize(e.target.value)} />
            </label>
            <label className="block">
              <span className="font-medium">Opacity</span>
              <input type="number" min="0.05" step="0.05" max="1" className="mt-1 border rounded p-2 w-full" value={opacity} onChange={e => setOpacity(e.target.value)} />
            </label>
          </div>
          <button onClick={handleStamp} className="px-4 py-2 bg-blue-600 text-white rounded">
            Apply Stamp
          </button>
        </>
      )}
    </div>
  );
}
