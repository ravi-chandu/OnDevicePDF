export default function StructuredData({ json }) {
  const data = typeof json === "string" ? json : JSON.stringify(json);
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: data }} />;
}
