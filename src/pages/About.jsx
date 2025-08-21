import { Helmet } from "react-helmet";

export default function About() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <Helmet>
        <title>About — OnDevicePDF</title>
        <link rel="canonical" href="https://www.ondevicepdf.com/about" />
      </Helmet>

      <h1 className="text-2xl font-bold mb-3">About</h1>
      <p className="text-gray-700">
        OnDevicePDF runs 100% in your browser using WebAssembly and modern JS libraries.
        No uploads, no servers—private by design.
      </p>
    </main>
  );
}
