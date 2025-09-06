export default function Dropzone({ onFiles, multiple=true }){
  function openPicker(){
    const input=document.createElement('input'); input.type='file'; input.accept='application/pdf'; input.multiple=multiple;
    input.onchange=e=>onFiles(Array.from(e.target.files||[])); input.click();
  }
  function onDrop(e){
    e.preventDefault(); const files=Array.from(e.dataTransfer.files||[]).filter(f=>f.type==='application/pdf'); if(files.length) onFiles(files)
  }
  return (
    <div onDragOver={e=>e.preventDefault()} onDrop={onDrop} onClick={openPicker}
      className="card text-center py-16 border-dashed hover:border-blue-600 cursor-pointer">
      <p className="text-slate-700">Drop PDF files here or click to select</p>
    </div>
  )
}
