import React, { useEffect, useState } from "react";

function applyTheme(mode) {
  const root = document.documentElement;
  if (mode === "dark") {
    root.classList.add("dark");
  } else if (mode === "light") {
    root.classList.remove("dark");
  } else {
    // system
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", !!prefersDark);
  }
}

export default function ThemeSwitch() {
  const [mode, setMode] = useState(() => localStorage.getItem("theme") || "system");

  useEffect(() => {
    applyTheme(mode);
    localStorage.setItem("theme", mode);
  }, [mode]);

  return (
    <div className="flex items-center gap-2 text-white/80">
      <label className="text-sm hidden sm:block">Theme</label>
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        className="bg-transparent border border-white/20 rounded px-2 py-1 text-white/80"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
