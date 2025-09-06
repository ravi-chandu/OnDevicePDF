import React from "react";
import Dropzone from "../components/Dropzone";
import ThumbGrid from "../components/ThumbGrid";
import { deletePages, downloadBlob } from "../utils/pdf";

export default function DeletePages() {
  const [file, setFile] = React.useState(null);
  const [count, setCount] = React.useState(0);
  const [selected, setSelected] = React.useState(new Set());

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

  async function handleDelete() {
    if (!file) return;
    const toDel = [...selected].sort((a,b)=>a-b);
    const blob = await deletePages(file, toDel);
    downloadBlob(blob, "deleted-pages.pdf");
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <Dropzone onFiles={onFiles} />
      {count > 0 && (
        <>
          <ThumbGrid
            items={[...Array(count).keys()].map(i => ({ label: `Page ${i + 1}` }))}
            selectable
            selectedSet={selected}
            onToggle={toggle}
          />
          <button onClick={handleDelete} className="px-4 py-2 bg-blue-600 text-white rounded">
            Delete Selected
          </button>
        </>
      )}
    </div>
  );
}
