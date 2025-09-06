export default function ThumbGrid({ files, selected = new Set(), onToggle, onMove }) {
  const up = (i) => i>0 && onMove?.(i, i-1);
  const down = (i) => i<files.length-1 && onMove?.(i, i+1);
  return (
    <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200">
      {files.map((f,i)=>(
        <li key={i} className="p-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <input type="checkbox" checked={selected.has(i)} onChange={()=>onToggle?.(i)} />
            <span className="font-medium">{f.name || `Page ${i+1}`}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-outline" onClick={()=>up(i)}>↑</button>
            <button className="btn btn-outline" onClick={()=>down(i)}>↓</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
