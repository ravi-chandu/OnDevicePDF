import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import Dropzone from '../components/Dropzone.jsx'
import StickyBar from '../components/StickyBar.jsx'
import HowToUse from '../components/HowToUse.jsx'
import SEO from '../components/SEO.jsx'

export default function Rename(){
  const [file,setFile]=useState(null)
  const [meta,setMeta]=useState({title:'',author:'',subject:'',keywords:''})
  const [filename,setFilename]=useState('renamed.pdf')
  const [busy,setBusy]=useState(false)

  async function onFiles([f]){
    setFile(f)
    setFilename(f.name.replace(/\.pdf$/i,'-renamed.pdf'))
    const buf=await f.arrayBuffer()
    const doc=await PDFDocument.load(buf)
    setMeta({
      title: doc.getTitle() || '',
      author: doc.getAuthor() || '',
      subject: doc.getSubject() || '',
      keywords: (doc.getKeywords() || []).join(', ')
    })
  }

  async function apply(){
    if(!file) return
    setBusy(true)
    try{
      const buf=await file.arrayBuffer()
      const doc=await PDFDocument.load(buf)
      if(meta.title) doc.setTitle(meta.title); else doc.setTitle('')
      if(meta.author) doc.setAuthor(meta.author); else doc.setAuthor('')
      if(meta.subject) doc.setSubject(meta.subject); else doc.setSubject('')
      const kws = meta.keywords.split(',').map(s=>s.trim()).filter(Boolean)
      if(kws.length) doc.setKeywords(kws); else doc.setKeywords([])
      const bytes=await doc.save()
      const a=document.createElement('a')
      a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}))
      a.download=filename||'renamed.pdf'
      a.click(); URL.revokeObjectURL(a.href)
    } finally { setBusy(false) }
  }

  return (
    <div>
      <SEO title="Rename & Metadata" canonical="https://www.ondevicepdf.com/tools/rename" />
      <h1 className="text-2xl font-semibold mb-4">✏️ Rename & Metadata</h1>
      <Dropzone onFiles={onFiles} multiple={false} />
      <div className="card mt-4 grid sm:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2"><label className="w-28 text-sm">Filename</label><input className="border rounded px-3 py-2 w-full" value={filename} onChange={e=>setFilename(e.target.value)} /></div>
          <div className="flex items-center gap-2"><label className="w-28 text-sm">Title</label><input className="border rounded px-3 py-2 w-full" value={meta.title} onChange={e=>setMeta({...meta, title:e.target.value})} /></div>
          <div className="flex items-center gap-2"><label className="w-28 text-sm">Author</label><input className="border rounded px-3 py-2 w-full" value={meta.author} onChange={e=>setMeta({...meta, author:e.target.value})} /></div>
          <div className="flex items-center gap-2"><label className="w-28 text-sm">Subject</label><input className="border rounded px-3 py-2 w-full" value={meta.subject} onChange={e=>setMeta({...meta, subject:e.target.value})} /></div>
          <div className="flex items-center gap-2"><label className="w-28 text-sm">Keywords</label><input className="border rounded px-3 py-2 w-full" value={meta.keywords} onChange={e=>setMeta({...meta, keywords:e.target.value})} placeholder="comma,separated" /></div>
        </div>
        <div className="text-sm text-slate-600">
          <p>Update the PDF document properties and rename the file for better organization and SEO when sharing.</p>
        </div>
      </div>
      <HowToUse steps={["Drop one PDF.","Edit name and metadata.","Click “Apply & Download”."]} />
      <StickyBar>
        <button className="btn" disabled={!file||busy} onClick={apply}>{busy?'Saving…':'Apply & Download'}</button>
        <button className="btn-secondary" onClick={()=>{setFile(null)}}>Clear</button>
      </StickyBar>
    </div>
  )
}
