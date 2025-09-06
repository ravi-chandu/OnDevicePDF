import SEO from "../components/SEO";

const QA = [
  ["Do my PDFs leave my computer?", "No. Everything runs entirely in your browser using client‑side libraries. Your files never leave your device."],
  ["Is it free?", "Yes. The core tools are free to use. There are no accounts or paywalls."],
  ["Which browsers are supported?", "Latest Chrome, Edge, Firefox, and Safari on desktop and mobile."],
  ["Is there a file size limit?", "Your device’s memory and browser limits apply. Very large files may be slow on low‑memory devices."],
  ["Can I use it offline?", "After first load, most features continue to work offline thanks to the service worker cache."]
];

export default function FAQ() {
  return (
    <main className="mx-auto max-w-3xl px-4">
      <SEO title="FAQ — OnDevicePDF" description="Answers to the most common questions about OnDevicePDF." canonical="https://www.ondevicepdf.com/faq"/>
      <section className="py-10">
        <h1 className="text-3xl font-bold tracking-tight">FAQ</h1>
        <ul className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200">
          {QA.map(([q,a]) => (
            <li key={q} className="p-4">
              <h3 className="font-semibold">{q}</h3>
              <p className="text-slate-600 mt-1">{a}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
