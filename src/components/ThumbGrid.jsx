// src/components/ThumbGrid.jsx
import React from "react";

export default function ThumbGrid({ items, active, onRemove, onMoveUp, onMoveDown, selectable = false, selectedSet, onToggle }) {
  return (
    <ul className="divide-y rounded-md border">
      {items.map((it, idx) => (
        <li key={idx} className={`flex items-center gap-3 p-3 ${active === idx ? "bg-blue-50" : ""}`}>
          {selectable && (
            <input
              type="checkbox"
              checked={selectedSet?.has(idx) || false}
              onChange={() => onToggle?.(idx)}
            />
          )}
          <div className="flex-1 truncate">{it.label || it.name || `Page ${idx + 1}`}</div>
          {onMoveUp && <button className="px-2 py-1 text-sm border rounded" onClick={() => onMoveUp(idx)}>↑</button>}
          {onMoveDown && <button className="px-2 py-1 text-sm border rounded" onClick={() => onMoveDown(idx)}>↓</button>}
          {onRemove && <button className="px-2 py-1 text-sm border rounded text-red-600" onClick={() => onRemove(idx)}>Remove</button>}
        </li>
      ))}
    </ul>
  );
}
