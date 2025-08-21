// src/App.jsx
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import workerSrc from "pdfjs-dist/legacy/build/pdf.worker.min.js?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Tools from "./pages/Tools";
import About from "./pages/About";

// ---- GA4 pageview on route change ----
function useGAPageViews() {
  const location = useLocation();
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
}
// --------------------------------------

// Lazy tool routes
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

export default function App() {
  // activate GA4 SPA tracking
  useGAPageViews();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <Suspense fallback={<div className="p-6">Loading…</div>}>
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
        </Routes>
      </Suspense>
    </div>
  );
}
