import React from "react";

export default function PageTitle({ icon = "📄", title }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="text-2xl" aria-hidden>{icon}</span>
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
}
