import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home        = lazy(()=>import("../pages/Home"));
const Tools       = lazy(()=>import("../pages/Tools"));
const About       = lazy(()=>import("../pages/About"));
const FAQ         = lazy(()=>import("../pages/FAQ"));
const Privacy     = lazy(()=>import("../pages/Privacy"));

const PDFMerge    = lazy(()=>import("../tools/PDFMerge"));
const PDFSplit    = lazy(()=>import("../tools/PDFSplit"));
const Organize    = lazy(()=>import("../tools/Organize"));
const Compress    = lazy(()=>import("../tools/CompressLite"));
const Convert     = lazy(()=>import("../tools/ConvertBasic"));
const Rotate      = lazy(()=>import("../tools/Rotate"));
const DeletePages = lazy(()=>import("../tools/Delete"));
const ExtractText = lazy(()=>import("../tools/ExtractText"));
const Stamp       = lazy(()=>import("../tools/Stamp"));

export default function App(){
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar/>
      <Suspense fallback={<div className="mx-auto max-w-6xl p-6">Loading…</div>}>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/tools" element={<Tools/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/faq" element={<FAQ/>}/>
          <Route path="/privacy" element={<Privacy/>}/>

          <Route path="/tools/merge" element={<PDFMerge/>}/>
          <Route path="/tools/split" element={<PDFSplit/>}/>
          <Route path="/tools/organize" element={<Organize/>}/>
          <Route path="/tools/compress" element={<Compress/>}/>
          <Route path="/tools/convert" element={<Convert/>}/>
          <Route path="/tools/rotate" element={<Rotate/>}/>
          <Route path="/tools/delete" element={<DeletePages/>}/>
          <Route path="/tools/text" element={<ExtractText/>}/>
          <Route path="/tools/stamp" element={<Stamp/>}/>
        </Routes>
      </Suspense>
      <Footer/>
    </div>
  );
}
