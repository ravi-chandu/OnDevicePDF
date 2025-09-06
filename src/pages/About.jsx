import SEO from "../components/SEO";

export default function About() {
  return (
    <main className="mx-auto max-w-3xl px-4">
      <SEO title="About — OnDevicePDF" description="What makes OnDevicePDF different? Privacy-by-design and pure client-side processing." canonical="https://www.ondevicepdf.com/about"/>
      <section className="py-10 prose prose-slate">
        <h1>About OnDevicePDF</h1>
        <p><strong>OnDevicePDF</strong> is a privacy‑first toolkit for everyday PDF tasks. All operations happen directly in your browser — no uploads, no accounts, no servers holding your files.</p>
        <h2>Why privacy‑first?</h2>
        <p>Documents often contain sensitive data. We remove the risk by never sending your files anywhere. Your browser performs all processing using WebAssembly and modern JavaScript libraries.</p>
        <h2>What can it do?</h2>
        <ul>
          <li>Merge, split, reorder, rotate, and delete pages</li>
          <li>Quick compression (lite re-save)</li>
          <li>Extract text and apply simple watermarks</li>
        </ul>
        <h2>Open web, no lock‑in</h2>
        <p>There is no account, subscription, or export lock‑in. It’s a utility that just works when you need it.</p>
      </section>
    </main>
  );
}
