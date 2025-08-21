import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function Tools() {
  const card = "rounded-xl border border-gray-200 p-5 hover:shadow-md transition block";
  return (
    <main className="mx-auto max-w-6xl p-6">
      <Helmet>
        <title>PDF Tools — OnDevicePDF</title>
        <link rel="canonical" href="https://ondevicepdf.com/tools" />
      </Helmet>

      <h1 className="text-2xl font-bold mb-4">Tools</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700">
        <Link to="/tools/merge" className={card}><h3 className="font-semibold">🧩 Merge</h3><p>Combine multiple PDFs.</p></Link>
        <Link to="/tools/split" className={card}><h3 className="font-semibold">✂️ Split</h3><p>Extract or split pages.</p></Link>
        <Link to="/tools/organize" className={card}><h3 className="font-semibold">🗂️ Organize</h3><p>Reorder, rotate, delete pages.</p></Link>
        <Link to="/tools/compress" className={card}><h3 className="font-semibold">Compress (Lite)</h3><p>Lightweight re-save optimization.</p></Link>
        <Link to="/tools/convert" className={card}><h3 className="font-semibold">Convert (Basic)</h3><p>Render pages to PNG.</p></Link>
        <Link to="/tools/rename" className={card}><h3 className="font-semibold">✏️ Rename</h3><p>Change filename & PDF Title.</p></Link>
        <Link to="/tools/stamp" className={card}><h3 className="font-semibold">🔖 Stamp</h3><p>Watermark & page numbers.</p></Link>
      <Link to="/tools/rotate" className={card}><h3 className="font-semibold">🔄 Rotate</h3><p>Rotate specific pages.</p></Link>
        <Link to="/tools/delete" className={card}><h3 className="font-semibold">🗑️ Delete</h3><p>Remove selected pages.</p></Link>
        <Link to="/tools/text" className={card}><h3 className="font-semibold">📝 Extract text</h3><p>Get plain text from your PDF.</p></Link>
      </div>
    </main>
  );
}
