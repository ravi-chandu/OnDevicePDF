import { Helmet } from 'react-helmet'
export default function SEO({ title, description, canonical }){
  const t=title?`${title} · OnDevicePDF`:'OnDevicePDF — Fast, private PDF tools'
  const d=description||'Edit, merge, split, compress, organize, watermark, and convert PDFs entirely in your browser.'
  const c=canonical||'https://www.ondevicepdf.com/'
  return (
    <Helmet>
      <title>{t}</title><meta name="description" content={d} /><link rel="canonical" href={c} />
      <meta property="og:title" content={t} /><meta property="og:description" content={d} /><meta property="og:url" content={c} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  )
}
