import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './index.css'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Tools from './pages/Tools.jsx'
import About from './pages/About.jsx'
import FAQ from './pages/FAQ.jsx'
import Privacy from './pages/Privacy.jsx'
import Contact from './pages/Contact.jsx'
import Blog from './pages/Blog.jsx'
import PDFMerge from './tools/PDFMerge.jsx'
import PDFSplit from './tools/PDFSplit.jsx'
import Organize from './tools/Organize.jsx'
import CompressLite from './tools/CompressLite.jsx'
import ConvertBasic from './tools/ConvertBasic.jsx'
import Rename from './tools/Rename.jsx'
import Rotate from './tools/Rotate.jsx'
import DeletePages from './tools/Delete.jsx'
import ExtractText from './tools/ExtractText.jsx'
import Stamp from './tools/Stamp.jsx'
import { sendPageView } from './utils/analytics.js'

function ScrollAndTrack(){
  const loc = useLocation()
  React.useEffect(()=>{
    window.scrollTo(0,0)
    sendPageView(loc.pathname + loc.search)
  }, [loc])
  return null
}

function App(){
  return (
    <BrowserRouter>
      <ScrollAndTrack />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        {/* tools */}
        <Route path="/tools/merge" element={<PDFMerge />} />
        <Route path="/tools/split" element={<PDFSplit />} />
        <Route path="/tools/organize" element={<Organize />} />
        <Route path="/tools/compress" element={<CompressLite />} />
        <Route path="/tools/convert" element={<ConvertBasic />} />
        <Route path="/tools/rename" element={<Rename />} />
        <Route path="/tools/rotate" element={<Rotate />} />
        <Route path="/tools/delete" element={<DeletePages />} />
        <Route path="/tools/text" element={<ExtractText />} />
        <Route path="/tools/stamp" element={<Stamp />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
