// src/pages/Tools.jsx
import ThumbGrid from "../components/ThumbGrid.jsx";
import SEO from "../components/SEO.jsx";

export default function Tools() {
  const tools = [
    { to: "/tools/merge",    icon: "🧩", title: "Merge",        desc: "Combine multiple PDFs." },
    { to: "/tools/split",    icon: "✂️", title: "Split",        desc: "Extract or split pages." },
    { to: "/tools/organize", icon: "📁", title: "Organize",     desc: "Reorder, rotate, delete." },
    { to: "/tools/stamp",    icon: "🔖", title: "Stamp",        desc: "Watermark & page numbers." },
    { to: "/tools/rotate",   icon: "🔄", title: "Rotate",       desc: "Rotate specific pages." },
    { to: "/tools/delete",   icon: "🗑️", title: "Delete",       desc: "Remove selected pages." },
    { to: "/tools/compress", icon: "🗜️", title: "Compress",     desc: "Quick re-save optimization." },
    { to: "/tools/convert",  icon: "🔁", title: "Convert",      desc: "Pages → images (ZIP) / rasterized PDF." },
    { to: "/tools/text",     icon: "📝", title: "Extract text", desc: "Get plain text from PDF." },
    { to: "/tools/rename",   icon: "✏️", title: "Rename",       desc: "Change filename & metadata." },
  ];

  return (
    <div className="pb-16">
      <SEO title="All PDF tools" canonical="https://www.ondevicepdf.com/tools" />
      <h1 className="text-3xl font-semibold mb-2">All-in-one PDF tools</h1>
      <p className="text-slate-600 mb-6">
        Everything runs locally in your browser — your files never leave your device.
      </p>
      <ThumbGrid items={tools} />
    </div>
  );
}
