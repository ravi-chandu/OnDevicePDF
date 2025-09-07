export default function SelectionToolbar({ total=0, selected=new Set(), onChange }){
  function setFromArray(arr){ onChange(new Set(arr)); }
  function all(){ setFromArray(Array.from({length:total},(_,i)=>i)); }
  function none(){ onChange(new Set()); }
  function invert(){
    const s = new Set();
    for(let i=0;i<total;i++) if(!selected.has(i)) s.add(i);
    onChange(s);
  }
  function odd(){ setFromArray(Array.from({length:total},(_,i)=>i).filter(i=> (i+1)%2===1)); }
  function even(){ setFromArray(Array.from({length:total},(_,i)=>i).filter(i=> (i+1)%2===0)); }
  function half(first=true){
    const cutoff = Math.floor(total/2);
    setFromArray(first ? Array.from({length:cutoff},(_,i)=>i)
                       : Array.from({length:total-cutoff},(_,i)=>i+cutoff));
  }
  const btn = "px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50";

  return (
    <div className="flex flex-wrap gap-2 items-center text-sm my-3">
      <span className="text-slate-600">Selection:</span>
      <button className={btn} onClick={all}>All</button>
      <button className={btn} onClick={none}>None</button>
      <button className={btn} onClick={invert}>Invert</button>
      <button className={btn} onClick={odd}>Odd</button>
      <button className={btn} onClick={even}>Even</button>
      <button className={btn} onClick={()=>half(true)}>First half</button>
      <button className={btn} onClick={()=>half(false)}>Second half</button>
      <button className={btn} onClick={none}>Clear</button>
      <span className="ml-2 text-slate-500">{selected.size} / {total} selected</span>
    </div>
  );
}
