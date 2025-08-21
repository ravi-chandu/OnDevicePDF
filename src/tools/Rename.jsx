import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";

import HowToUse from "../components/HowToUse";
import PageTitle from "../components/PageTitle";

export default function Rename() {
  const [file, setFile] = useState(null);
  const [newName, setNewName] = useState("renamed.pdf");
  const [title, setTitle] = useState("");

  async function handleRename() {
    if (!file) return;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const pdf = await PDFDocument.load(bytes);
    if (title) pdf.setTitle(title);
    const out = await pdf.save();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([out], { type: "application/pdf" }));
    a.download = newName.endsWith(".pdf") ? newName : newName + ".pdf";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6 space-y-4">
      <PageTitle icon="✏️" title="Rename PDF" />
      <HowToUse steps={["Drop one PDF.", "Enter new filename and optional Title metadata.", "Click \u201cSave\u201d."]} />

      

      <input type="file" accept="application/pdf" onChange={(e)=> setFile(e.target.files[0])} />
      <input className="border p-2 rounded w-full" placeholder="New filename (e.g., myfile.pdf)" value={newName} onChange={(e)=> setNewName(e.target.value)} />
      <input className="border p-2 rounded w-full" placeholder="Optional: PDF Title metadata" value={title} onChange={(e)=> setTitle(e.target.value)} />
      <button onClick={handleRename} disabled={!file} className="px-4 py-2 w-full sm:w-auto  bg-black text-white rounded disabled:opacity-50">Save</button>
    </main>
  );
}