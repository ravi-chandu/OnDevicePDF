// src/components/ThumbGrid.jsx
import ToolCard from "./ToolCard.jsx";

export default function ThumbGrid({ items = [] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((it) => (
        <ToolCard
          key={it.to}
          to={it.to}
          icon={it.icon}
          title={it.title}
          desc={it.desc}
        />
      ))}
    </div>
  );
}
