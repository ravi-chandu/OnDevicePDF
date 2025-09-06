import React from "react";
import Dropzone from "../components/Dropzone";
import ThumbGrid from "../components/ThumbGrid";
import { mergeFiles, downloadBlob } from "../utils/pdf";

export default function PDFMerge() {
  const [files, setFiles] = React.useState([]);

  function add(filesNew) {
    setFiles(prev => [...prev, ...filesNew]);
  }
  const moveUp = (i) => setFiles(prev => i <= 0 ? prev : prev.map((f, idx) =>
    idx === i - 1 ? prev[i] : idx === i ? prev[i - 1] : f));
  const moveDown = (i) => setFiles(prev => i >= prev.length - 1 ? prev : prev.map((f, idx) =>
    idx === i + 1 ? prev[i] : idx === i ? prev[i + 1] : f));
  const remove = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  async function handleMerge() {
    if (!files.length) return;
    const blob = await mergeFiles(files);
    downloadBlob(blob, "merged.pdf");
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Dropzone onFiles={add} />
      {files.length > 0 && (
        <>
          <ThumbGrid
            items={files.map((f, i) => ({ name: f.name }))}
            onMoveUp={moveUp}
            onMoveDown={moveDown}
            onRemove={remove}
          />
          <button onClick={handleMerge} className="px-4 py-2 bg-blue-600 text-white rounded">
            Merge PDFs
          </button>
        </>
      )}
    </div>
  );
}
