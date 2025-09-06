import { Link } from "react-router-dom";

export default function Home(){
  return (
    <main className="container">
      <h1 className="h1">All-in-one PDF tools — fast & private</h1>
      <p className="p">Everything runs locally in your browser — your files never leave your device.</p>

      <div className="grid sm-2 lg-3">
        <Link className="card" to="/tools/merge"><strong>🧩 Merge</strong><div className="p">Combine multiple PDFs</div></Link>
        <Link className="card" to="/tools/compress"><strong>🗜️ Compress (Lite)</strong><div className="p">Quick re-save optimization</div></Link>
        <Link className="card" to="/tools/split"><strong>✂️ Split</strong><div className="p">Extract or split pages</div></Link>
      </div>

      <div className="sticky-cta" style={{marginTop:'1rem'}}>
        <Link to="/tools">Open all tools</Link>
      </div>
    </main>
  );
}
