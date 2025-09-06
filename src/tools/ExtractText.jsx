import React from "react";
import Dropzone from "../components/Dropzone";
import { readFileAsArrayBuffer } from "../utils/pdf";

export default function ExtractText() {
  const [file, setFile] = React.useState(null);
  const [text, setText] = React.useState("");

  async function onFiles(fs) {
    setFile(fs[0]);
    setText("");
  }

  async function handleExtract() {
    const [pdfjsLib, workerSrc] = await Promise.all([
      import("pdfjs-dist/legacy/build/pdf"),
      import("pdfjs-dist/legacy/build/pdf.worker.min.js?url"),
    ]);
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc.default;

    const ab = await readFileAsArrayBuffer(file);
    const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
    let out = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      out += content.items.map(it => it.str).join(" ") + "\\n\\n";
    }
    setText(out.trim());
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <Dropzone onFiles={onFiles} />
      {file && (
        <button onClick={handleExtract} className="px-4 py-2 bg-blue-600 text-white rounded">
          Extract Text
        </button>
      )}
      {text && (
        <textarea className="w-full h-80 border rounded p-3" value={text} readOnly />
      )}
    </div>
  );
}
