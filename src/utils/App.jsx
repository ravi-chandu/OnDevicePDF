import React, { useEffect, useState, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import InstallBanner from '../components/InstallBanner.jsx'
import { sendPageView } from './analytics.js'

import Home from '../pages/Home.jsx'
import Tools from '../pages/Tools.jsx'
import About from '../pages/About.jsx'
import FAQ from '../pages/FAQ.jsx'
import Privacy from '../pages/Privacy.jsx'
import Contact from '../pages/Contact.jsx'
import Blog from '../pages/Blog.jsx'

const PDFMerge     = lazy(()=>import('../tools/PDFMerge.jsx'))
const PDFSplit     = lazy(()=>import('../tools/PDFSplit.jsx'))
const Organize     = lazy(()=>import('../tools/Organize.jsx'))
const DeletePages  = lazy(()=>import('../tools/Delete.jsx'))
const Rotate       = lazy(()=>import('../tools/Rotate.jsx'))
const Stamp        = lazy(()=>import('../tools/Stamp.jsx'))
const CompressLite = lazy(()=>import('../tools/CompressLite.jsx'))
const ConvertBasic = lazy(()=>import('../tools/ConvertBasic.jsx'))
const ExtractText  = lazy(()=>import('../tools/ExtractText.jsx'))
const Rename       = lazy(()=>import('../tools/Rename.jsx'))

function ScrollAndTrack(){
  const loc = useLocation()
  useEffect(()=>{ window.scrollTo(0,0); sendPageView(loc.pathname+loc.search) }, [loc])
  return null
}

export default function App(){
  const [deferredEvt, setDeferredEvt] = useState(null)
  const [hideBanner, setHideBanner] = useState(false)
  useEffect(()=>{
    const onBIP=e=>{e.preventDefault();setDeferredEvt(e)}
    window.addEventListener('beforeinstallprompt', onBIP)
    return ()=>window.removeEventListener('beforeinstallprompt', onBIP)
  },[])

  return (
    <BrowserRouter>
      <ScrollAndTrack />
      <Navbar />
      <main className="container py-8 min-h-[70vh]">
        <Suspense fallback={<div className="p-6">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/tools/merge" element={<PDFMerge />} />
            <Route path="/tools/split" element={<PDFSplit />} />
            <Route path="/tools/organize" element={<Organize />} />
            <Route path="/tools/delete" element={<DeletePages />} />
            <Route path="/tools/rotate" element={<Rotate />} />
            <Route path="/tools/stamp" element={<Stamp />} />
            <Route path="/tools/compress" element={<CompressLite />} />
            <Route path="/tools/convert" element={<ConvertBasic />} />
            <Route path="/tools/text" element={<ExtractText />} />
            <Route path="/tools/rename" element={<Rename />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      {!hideBanner && <InstallBanner event={deferredEvt} onClose={()=>setHideBanner(true)} />}
    </BrowserRouter>
  )
}
