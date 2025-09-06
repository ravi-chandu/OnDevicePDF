export default function StructuredData({ type='WebApplication' }){
  const data=type==='FAQPage'?{"@context":"https://schema.org","@type":"FAQPage",
    "mainEntity":[
      {"@type":"Question","name":"Do my PDFs upload to a server?","acceptedAnswer":{"@type":"Answer","text":"No. All tools run entirely in your browser."}},
      {"@type":"Question","name":"Is it free?","acceptedAnswer":{"@type":"Answer","text":"Yes. No sign-up required, and no watermarks added by us."}},
      {"@type":"Question","name":"Can I use it offline?","acceptedAnswer":{"@type":"Answer","text":"Yes. Install OnDevicePDF and most tools work offline."}}
    ]}:
    {"@context":"https://schema.org","@type":"WebApplication","name":"OnDevicePDF","url":"https://www.ondevicepdf.com",
     "applicationCategory":"BusinessApplication","operatingSystem":"Web","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"}}
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(data)}} />
}
