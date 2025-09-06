import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const tools = [
  { to: "/tools/merge",    title: "Merge",    desc: "Combine multiple PDFs." },
  { to: "/tools/split",    title: "Split",    desc: "Extract page ranges." },
  { to: "/tools/organize", title: "Organize", desc: "Reorder and arrange pages." },
  { to: "/tools/rotate",   title: "Rotate",   desc: "Rotate selected pages." },
  { to: "/tools/delete",   title: "Delete",   desc: "Remove unwanted pages." },
  { to: "/tools/compress", title: "Compress (Lite)", desc: "Quick re-save optimization." },
  { to: "/tools/convert",  title: "Convert (Basic)", desc: "Each page to a separate PDF." },
  { to: "/tools/text",     title: "Extract Text", desc: "Grab text content." },
  { to: "/tools/stamp",    title: "Stamp",    desc: "Add a text watermark." },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4">
      <SEO title="OnDevicePDF — Fast, private PDF tools" description="Edit, merge, split, compress and organize PDFs entirely in your browser. Files never leave your device." canonical="https://www.ondevicepdf.com/"/>
      <section className="py-10">
        <h1 className="text-3xl font-bold tracking-tight">All-in-one PDF tools</h1>
        <p className="mt-3 text-slate-600">Everything runs locally in your browser — your files never leave your device.</p>
        <div className="tools-grid mt-6">
          {tools.map(t=>(
            <Link key={t.to} to={t.to} className="card card-hover p-5">
              <h3 className="font-semibold">{t.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
