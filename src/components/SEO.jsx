import { Helmet } from "react-helmet";

export default function SEO({ title, description, canonical }) {
  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description}/>}
      {canonical && <link rel="canonical" href={canonical}/>}
      <meta property="og:type" content="website"/>
      {title && <meta property="og:title" content={title}/>}
      {description && <meta property="og:description" content={description}/>}
      <meta property="og:image" content="/icon-512.png"/>
      <meta name="twitter:card" content="summary_large_image"/>
    </Helmet>
  );
}
