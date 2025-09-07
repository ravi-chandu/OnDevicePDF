import { useState } from 'react';
import Dropzone from '../components/Dropzone.jsx';
import StickyActionBar from '../components/StickyActionBar.jsx';
import HowToUse from '../components/HowToUse.jsx';
import SEO from '../components/SEO.jsx';
import FilenameInput from '../components/FilenameInput.jsx';
import pdfjsLib from '../utils/pdfjs.js';

export default function ExtractText(){
  const [file,setFile]=useState(null);
  const [text,setText]=useState('');
  const [busy,setBusy]=useState(false);
  const [outName,setOutName]=useState(`text-${new Date().toISOString().slice(0,10)}.txt`);
  const [keepBreaks,setKeepBreaks]=useState(true);
  const [joinHyphen,setJoinHyphen]=useState(true);

  async function onFiles([f]){
    setFile(f); setBusy(true);
    try{
      const buf=await f.arrayBuffer();
      const pdf=await pdfjsLib.getDocument({data:buf}).promise;
      let out=''; let emptyPages=0;
      for(let n=1;n<=pdf.numPages;n++){
        const page=await pdf.getPage(n);
        const tc=await page.getTextContent();
        const items = tc.items.map(it=>it.str);
        if(items.length===0) emptyPages++;
        let pg = items.join(keepBreaks? '\n' : ' ');
        if(joinHyphen) pg = pg.replace(/-\n/g,'');
        out += (n>1? '\n\n' : '') + pg;
      }
      if(emptyPages===pdf.numPages){
        out = 'No text content detected. This PDF may be scanned (OCR not enabled in this tool).';
      }
      setText(out);
    } finally { setBusy(false); }
  }

  function copy(){ navigator.clipboard.writeText(text||''); }
  function download(){
    const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([text||''],{type:'text/plain'}));
    a.download=outName||'text.txt'; a.click(); URL.revokeObjectURL(a.href);
  }

  const btn  = "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50";
  const btn2 = "px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50";

  return (
    <div className="pb-24">
      <SEO title="Extract Text from PDF" canonical="https://www.ondevicepdf.com/tools/text" />
      <h1 className="text-2xl font-semibold mb-4">📝 Extract Text</h1>

      <Dropzone onFiles={onFiles} multiple={false} />

      {file && (
        <>
          <div className="mt-3 flex flex-wrap gap-4 items-center">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={keepBreaks} onChange={e=>setKeepBreaks(e.target.checked)} />
              Keep line breaks
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={joinHyphen} onChange={e=>setJoinHyphen(e.target.checked)} />
              Join hyphenated lines
            </label>
          </div>

          <div className="mt-3">
            <textarea className="w-full h-64 border rounded p-3 font-mono text-sm" value={busy? 'Extracting…' : text} readOnly />
          </div>

          <div className="mt-4 border rounded p-3 bg-white shadow-sm">
            <FilenameInput value={outName} onChange={setOutName} />
          </div>
        </>
      )}

      <StickyActionBar>
        <button className={btn2} disabled={!text} onClick={copy}>Copy</button>
        <button className={btn}  disabled={!text} onClick={download}>Download .txt</button>
      </StickyActionBar>

      <div className="mt-6">
        <HowToUse steps={[
          "Drop one PDF.",
          "For best results, keep line breaks and join hyphenated lines.",
          "Copy the extracted text or download it as a .txt file.",
          "If your PDF is scanned, this tool may show little/no text (OCR not enabled)."
        ]} />
      </div>
    </div>
  );
}
