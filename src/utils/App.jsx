// src/utils/App.jsx
import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// NOTE: App.jsx lives in src/utils, so use ../ to reach components/pages
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { sendPageView, initGA } from "./analytics.js";

import Home from "../pages/Home.jsx";
import Tools from "../pages/Tools.jsx";
import About from "../pages/About.jsx";
import FAQ from "../pages/FAQ.jsx";

// Tools (lazy)
const PDFMerge     = lazy(() => import("../tools/PDFMerge.jsx"));
const PDFSplit     = lazy(() => import("../tools/PDFSplit.jsx"));
const Organize     = lazy(() => import("../tools/Organize.jsx"));
const CompressLite = lazy(() => import("../tools/CompressLite.jsx"));
const ConvertBasic = lazy(() => import("../tools/ConvertBasic.jsx"));
const Rename       = lazy(() => import("../tools/Rename.jsx"));
const RotatePages  = lazy(() => import("../tools/Rotate.jsx"));
const DeletePages  = lazy(() => import("../tools/Delete.jsx"));
const ExtractText  = lazy(() => import("../tools/ExtractText.jsx"));
const Stamp        = lazy(() => import("../tools/Stamp.jsx"));

function GAOnRouteChange() {
  const loc = useLocation();
  useEffect(() => {
    initGA();
    sendPageView(loc.pathname + loc.search);
  }, [loc.pathname, loc.search]);
  return null;
}

export default function App(){
  return (
    <div className="app min-h-screen bg-white text-gray-900">
      <Navbar />
      <GAOnRouteChange />
      <Suspense fallback={<div className="container p-6">Loading…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<Tools />} />

          {/* Tool routes */}
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
