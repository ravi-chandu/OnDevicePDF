import React from "react";
import Dropzone from "../components/Dropzone";
import ThumbGrid from "../components/ThumbGrid";
import { reorderPages, downloadBlob } from "../utils/pdf";

export default function Organize() {
  const [file, setFile] = React.useState(null);
  const [order, setOrder] = React.useState([]);

  async function onFiles(fs) {
    const f = fs[0];
    setFile(f);
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(await f.arrayBuffer());
    const c = doc.getPageCount();
    setOrder([...Array(c).keys()]);
  }

  const moveUp = (i) => setOrder(prev => i <= 0 ? prev : prev.map((n, idx) =>
    idx === i - 1 ? prev[i] : idx === i ? prev[i - 1] : n));
  const moveDown = (i) => setOrder(prev => i >= prev.length - 1 ? prev : prev.map((n, idx) =>
    idx === i + 1 ? prev[i] : idx === i ? prev[i + 1] : n));
  const remove = (i) => setOrder(prev => prev.filter((_, idx) => idx !== i));

  async function handleExport() {
    if (!file || !order.length) return;
    const blob = await reorderPages(file, order);
    downloadBlob(blob, "reordered.pdf");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Dropzone onFiles={onFiles} />
      {order.length > 0 && (
        <>
          <ThumbGrid
            items={order.map((n) => ({ label: `Page ${n + 1}` }))}
            onMoveUp={moveUp}
            onMoveDown={moveDown}
            onRemove={remove}
          />
          <button onClick={handleExport} className="px-4 py-2 bg-blue-600 text-white rounded">
            Export Reordered PDF
          </button>
        </>
      )}
    </div>
  );
}
