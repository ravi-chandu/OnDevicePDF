import SEO from "../components/SEO";

export default function Privacy() {
  return (
    <main className="mx-auto max-w-3xl px-4">
      <SEO title="Privacy — OnDevicePDF" description="OnDevicePDF never uploads your files. All processing occurs in your browser." canonical="https://www.ondevicepdf.com/privacy"/>
      <section className="py-10 prose prose-slate">
        <h1>Privacy policy</h1>
        <p>OnDevicePDF is designed to keep your files private: <strong>PDFs never leave your device</strong>. All features run locally in your browser using client‑side code. We don’t operate a backend that stores documents.</p>
        <h2>Analytics</h2>
        <p>If you enable analytics (e.g., Google Tag), we only track basic usage events to improve the product. No document contents are ever sent or stored.</p>
        <h2>Cookies</h2>
        <p>We avoid cookies unless required by the analytics provider you choose to enable. The app itself does not require cookies.</p>
        <h2>Contact</h2>
        <p>Questions? Reach out via the project repository or support email listed on the website.</p>
      </section>
    </main>
  );
}
