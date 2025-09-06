import SEO from '../components/SEO.jsx'
export default function About(){
  return (
    <article className="prose max-w-none">
      <SEO title="About OnDevicePDF" canonical="https://www.ondevicepdf.com/about" />
      <h1>About OnDevicePDF</h1>
      <p><strong>OnDevicePDF</strong> is built for students who need simple, fast, and private PDF tools. All processing happens in your browser—your files never leave your device.</p>
      <h2>Why students choose us</h2>
      <ul>
        <li><strong>Privacy-first:</strong> no uploads or server storage.</li>
        <li><strong>Speed:</strong> local processing means instant results.</li>
        <li><strong>Free:</strong> no sign-up required.</li>
        <li><strong>Installable:</strong> add to your phone/desktop; works offline.</li>
      </ul>
      <h2>Use cases</h2>
      <ul>
        <li>Merge handouts and notes.</li>
        <li>Extract or rotate specific pages from assignments.</li>
        <li>Add page numbers and watermarks for submissions.</li>
        <li>Convert pages to images for presentations.</li>
      </ul>
    </article>
  )
}
