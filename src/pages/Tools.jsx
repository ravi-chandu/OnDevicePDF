import { Link } from "react-router-dom";

const Card = ({to, title, desc}) => (
  <Link to={to} className="card">
    <div style={{fontWeight:600}}>{title}</div>
    <div className="p">{desc}</div>
  </Link>
);

export default function Tools(){
  return (
    <main className="container">
      <h1 className="h1">All tools</h1>
      <p className="p">Private by design — processed 100% in your browser.</p>

      <section className="grid sm-2 lg-3">
        <Card to="/tools/merge"   title="🧩 Merge"         desc="Combine multiple PDFs." />
        <Card to="/tools/split"   title="✂️ Split"         desc="Extract or split pages." />
        <Card to="/tools/organize" title="🗂️ Organize"    desc="Reorder & delete pages." />
        <Card to="/tools/compress" title="🗜️ Compress (Lite)" desc="Quick re-save optimization." />
        <Card to="/tools/convert"  title="Convert (Basic)" desc="Prep for images/ZIP." />
        <Card to="/tools/rename"   title="✏️ Rename"       desc="Change filename & PDF Title." />
        <Card to="/tools/stamp"    title="🔖 Stamp"        desc="Watermark & page numbers." />
        <Card to="/tools/rotate"   title="🔄 Rotate"       desc="Rotate specific pages." />
        <Card to="/tools/delete"   title="🗑️ Delete"       desc="Remove selected pages." />
        <Card to="/tools/text"     title="📝 Extract text" desc="Get plain text from your PDF." />
      </section>
    </main>
  );
}
