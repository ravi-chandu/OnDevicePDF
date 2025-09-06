import React, { useRef } from "react";

export default function Dropzone({ multiple=true, accept='.pdf', onFiles }) {
  const ref = useRef(null);
  const onClick = () => ref.current?.click();
  const onChange = (e) => onFiles?.(Array.from(e.target.files || []));
  const onDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    onFiles?.(files);
  };

  return (
    <div className="drop text-center cursor-pointer" onClick={onClick} onDragOver={(e)=>e.preventDefault()} onDrop={onDrop}>
      <p className="font-medium">Drop PDF files here or click to select</p>
      <input hidden ref={ref} type="file" accept={accept} multiple={multiple} onChange={onChange}/>
    </div>
  );
}
