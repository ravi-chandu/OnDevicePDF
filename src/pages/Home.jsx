// src/pages/Home.jsx
import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import StructuredData from "../components/StructuredData";

// simple tailwind card class used below
const card =
  "block rounded-2xl border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition";

export default function Home() {
  // WebApplication JSON‑LD (for SEO)
  const appLD = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "OnDevicePDF",
    url: "https://ondevicepdf.com",
    description:
      "Free PDF tools that run 100% on your device. Files never leave your browser.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
  };

  return (
    <>
      <StructuredData json={appLD} />

      <main className="mx-auto max-w-6xl p-6">
        <Helmet>
          <title>OnDevicePDF — Fast, private PDF tools</title>
          <meta
            name="description"
            content="Edit, merge, split, compress, and organize PDFs entirely in your browser. Your files never leave your device."
          />
          <link rel="canonical" href="https://ondevicepdf.com/" />
        </Helmet>

        <SEO
          title="OnDevicePDF — Fast, private PDF tools"
          description="Edit, merge, split, compress, and organize PDFs entirely in your browser. Your files never leave your device."
          canonical="https://ondevicepdf.com/"
        />

        <h1 className="text-3xl font-bold mb-2">All‑in‑one PDF tools</h1>
        <p className="text-gray-600 mb-6">
          Everything runs locally in your browser — your files never leave your device.
        </p>

        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/tools/merge" className={card}>
            <h3 className="font-semibold">🧩 Merge</h3>
            <p>Combine multiple PDFs.</p>
          </Link>

          <Link to="/tools/split" className={card}>
            <h3 className="font-semibold">✂️ Split</h3>
            <p>Extract or split pages.</p>
          </Link>

          <Link to="/tools/organize" className={card}>
            <h3 className="font-semibold">🗂️ Organize</h3>
            <p>Reorder & delete pages.</p>
          </Link>

          <Link to="/tools/compress" className={card}>
            <h3 className="font-semibold">Compress (Lite)</h3>
            <p>Quick re‑save optimization.</p>
          </Link>

          <Link to="/tools/convert" className={card}>
            <h3 className="font-semibold">Convert (Basic)</h3>
            <p>Prep for images/ZIP.</p>
          </Link>

          <Link to="/tools/rename" className={card}>
            <h3 className="font-semibold">✏️ Rename</h3>
            <p>Change filename & PDF Title.</p>
          </Link>

          <Link to="/tools/stamp" className={card}>
            <h3 className="font-semibold">🔖 Stamp</h3>
            <p>Watermark & page numbers.</p>
          </Link>

          <Link to="/tools/rotate" className={card}>
            <h3 className="font-semibold">🔄 Rotate</h3>
            <p>Rotate specific pages.</p>
          </Link>

          <Link to="/tools/delete" className={card}>
            <h3 className="font-semibold">🗑️ Delete</h3>
            <p>Remove selected pages.</p>
          </Link>

          <Link to="/tools/text" className={card}>
            <h3 className="font-semibold">📝 Extract text</h3>
            <p>Get plain text from your PDF.</p>
          </Link>
        </section>
      </main>
    </>
  );
}
