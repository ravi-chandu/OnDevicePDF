// src/components/ThumbGrid.jsx
import { Link } from "react-router-dom";

export default function ThumbGrid({ items = [] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((it) => (
        <ToolCard key={it.href} {...it} />
      ))}
    </div>
  );
}

function ToolCard({ href, icon, title, desc }) {
  return (
    <Link
      to={href}
      className="block rounded-xl border border-slate-200 bg-white/80 hover:bg-white shadow-sm hover:shadow-md transition p-4"
      aria-label={title}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl leading-none select-none">{icon}</span>
        <div className="min-w-0">
          {/* ✅ Title renders once */}
          <div className="font-semibold truncate">{title}</div>
          <div className="text-sm text-slate-600 mt-0.5 line-clamp-2">{desc}</div>
        </div>
      </div>
    </Link>
  );
}
