import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Tools from "./pages/Tools";
import About from "./pages/About";
import FAQ from "./pages/FAQ";

const PDFMerge     = lazy(() => import("./tools/PDFMerge"));
const PDFSplit     = lazy(() => import("./tools/PDFSplit"));
const Organize     = lazy(() => import("./tools/Organize"));
const CompressLite = lazy(() => import("./tools/CompressLite"));
const ConvertBasic = lazy(() => import("./tools/ConvertBasic"));
const Rename       = lazy(() => import("./tools/Rename"));
const RotatePages  = lazy(() => import("./tools/Rotate"));
const DeletePages  = lazy(() => import("./tools/Delete"));
const ExtractText  = lazy(() => import("./tools/ExtractText"));
const Stamp        = lazy(() => import("./tools/Stamp"));

export default function App(){
  return (
    <div className="app">
      <Navbar />
      <Suspense fallback={<div className="container">Loading…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/tools/merge" element={<PDFMerge />} />
          <Route path="/tools/split" element={<PDFSplit />} />
          <Route path="/tools/organize" element={<Organize />} />
          <Route path="/tools/compress" element={<CompressLite />} />
          <Route path="/tools/convert" element={<ConvertBasic />} />
          <Route path="/tools/rename" element={<Rename />} />
          <Route path="/tools/rotate" element={<RotatePages />} />
          <Route path="/tools/delete" element={<DeletePages />} />
          <Route path="/tools/text" element={<ExtractText />} />
          <Route path="/tools/stamp" element={<Stamp />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </Suspense>
      <Footer />
    </div>
  );
}
