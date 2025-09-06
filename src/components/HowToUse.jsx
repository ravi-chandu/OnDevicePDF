export default function HowToUse({ steps=[], privacy=true }){
  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold mb-2">How to use</h2>
      <ol className="list-decimal ml-5 space-y-1 text-slate-700">{steps.map((s,i)=>(<li key={i}>{s}</li>))}</ol>
      {privacy && <p className="mt-3 text-sm text-slate-500">Privacy: everything runs in your browser — files never leave your device.</p>}
    </section>
  )
}
