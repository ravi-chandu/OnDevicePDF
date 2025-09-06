// src/components/Dropzone.jsx
import React from "react";

export default function Dropzone({ onFiles, accept = ".pdf" }) {
  const inputRef = React.useRef(null);

  function onDrop(e) {
    e.preventDefault();
    const files = [...e.dataTransfer.files].filter(f => f.type === "application/pdf" || f.name.endsWith(".pdf"));
    if (files.length) onFiles(files);
  }
  function onPick(e) {
    const files = [...e.target.files];
    if (files.length) onFiles(files);
  }

  return (
    <div
      onDragOver={e => e.preventDefault()}
      onDrop={onDrop}
      className="border-2 border-dashed rounded-xl p-6 text-center hover:bg-gray-50 cursor-pointer"
      onClick={() => inputRef.current?.click()}
    >
      <p className="font-medium">Drop PDF files here or click to select</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        hidden
        onChange={onPick}
      />
    </div>
  );
}
