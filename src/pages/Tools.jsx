// src/pages/Tools.jsx
import ThumbGrid from "../components/ThumbGrid.jsx";
import SEO from "../components/SEO.jsx";

export default function Tools() {
  const tools = [
    { href: "/tools/merge",   icon: "🧩", title: "Merge",   desc: "Combine multiple PDFs." },
    { href: "/tools/split",   icon: "✂️", title: "Split",   desc: "Extract or split pages." },
    { href: "/tools/organize",icon: "📁", title: "Organize",desc: "Reorder, rotate, delete." },
    { href: "/tools/stamp",   icon: "🔖", title: "Stamp",   desc: "Watermark & page numbers." },
    { href: "/tools/rotate",  icon: "🔄", title: "Rotate",  desc: "Rotate specific pages." },
    { href: "/tools/delete",  icon: "🗑️", title: "Delete",  desc: "Remove selected pages." },
    { href: "/tools/compress",icon: "🗜️", title: "Compress",desc: "Quick re-save optimization." },
    { href: "/tools/convert", icon: "🔁", title: "Convert", desc: "PDF Pages → images (ZIP) / rasterized PDF." },
    { href: "/tools/text",    icon: "📝", title: "Extract text", desc: "Get plain text from PDF." },
    { href: "/tools/rename",  icon: "✏️", title: "Rename",  desc: "Change filename & metadata." },
  ];

  return (
    <div className="pb-16">
      <SEO title="All PDF tools" canonical="https://www.ondevicepdf.com/tools" />
      <h1 className="text-3xl font-semibold mb-2">All-in-one PDF tools</h1>
      <p className="text-slate-600 mb-6">Everything runs locally in your browser — your files never leave your device.</p>
      <ThumbGrid items={tools} />
    </div>
  );
}
