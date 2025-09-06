import React from "react";
import Dropzone from "../components/Dropzone";
import ThumbGrid from "../components/ThumbGrid";
import { rotatePages, downloadBlob } from "../utils/pdf";

export default function RotatePages() {
  const [file, setFile] = React.useState(null);
  const [count, setCount] = React.useState(0);
  const [selected, setSelected] = React.useState(new Set());
  const [degrees, setDegrees] = React.useState(90);

  async function onFiles(fs) {
    const f = fs[0];
    setFile(f);
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(await f.arrayBuffer());
    setCount(doc.getPageCount());
    setSelected(new Set());
  }

  function toggle(i) {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });
  }

  async function handleRotate() {
    if (!file || selected.size === 0) return;
    const map = {};
    for (const idx of selected) map[idx] = degrees;
    const blob = await rotatePages(file, map);
    downloadBlob(blob, "rotated.pdf");
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <Dropzone onFiles={onFiles} />
      {count > 0 && (
        <>
          <label className="block">
            <span className="font-medium">Degrees</span>
            <select className="mt-1 border rounded p-2" value={degrees} onChange={e => setDegrees(Number(e.target.value))}>
              <option value={90}>90°</option>
              <option value={180}>180°</option>
              <option value={270}>270°</option>
            </select>
          </label>
          <ThumbGrid
            items={[...Array(count).keys()].map(i => ({ label: `Page ${i + 1}` }))}
            selectable
            selectedSet={selected}
            onToggle={toggle}
          />
          <button onClick={handleRotate} className="px-4 py-2 bg-blue-600 text-white rounded">
            Rotate Selected
          </button>
        </>
      )}
    </div>
  );
}
