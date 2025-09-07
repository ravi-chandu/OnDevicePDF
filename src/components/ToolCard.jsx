// src/components/ToolCard.jsx
import { Link } from "react-router-dom";

export default function ToolCard({ to, icon, title, desc }) {
  return (
    <Link
      to={to}
      className="block rounded-xl border border-slate-200 bg-white/80 hover:bg-white shadow-sm hover:shadow-md transition p-4"
      aria-label={title}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl leading-none select-none">{icon}</span>
        <div className="min-w-0">
          {/* ✅ Title renders exactly once */}
          <div className="font-semibold truncate">{title}</div>
          {desc ? (
            <div className="text-sm text-slate-600 mt-0.5 line-clamp-2">
              {desc}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
