export function parseRanges(input, maxPages){
  if(!input||!String(input).trim())return[]
  const parts=input.split(',').map(s=>s.trim()).filter(Boolean)
  const pages=new Set()
  for(const p of parts){
    if(/^\d+$/.test(p)){ const n=+p; if(n>=1&&n<=maxPages) pages.add(n-1) }
    else if(/^(\d+)-(\d+)$/.test(p)){ const[a,b]=p.split('-').map(Number); const s=Math.min(a,b),e=Math.max(a,b);
      for(let i=s;i<=e;i++) if(i>=1&&i<=maxPages) pages.add(i-1) }
  }
  return Array.from(pages).sort((a,b)=>a-b)
}
