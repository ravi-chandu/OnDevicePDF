export default function FilenameInput({ value, onChange, label='Filename' }){
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm w-28">{label}</label>
      <input
        className="border rounded px-3 py-2 w-full"
        value={value}
        onChange={e=>onChange(e.target.value)}
      />
    </div>
  );
}
