import React from "react";

export default function HowToUse({ steps = [] }) {
  return (
    <details className="bg-white text-slate-800 border border-slate-200 rounded p-3 text-sm dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700">
      <summary className="cursor-pointer font-medium">How to use</summary>
      <ol className="list-decimal list-inside space-y-1 mt-2">
        {steps.map((s, i) => <li key={i}>{s}</li>)}
      </ol>
      <p className="mt-2 text-slate-500 dark:text-slate-300">Privacy: everything runs in your browser — files never leave your device.</p>
    </details>
  );
}
