// Parse human ranges like "1-3,5" into zero-based indices limited by total
export function parseRanges(text, total){
  const out = new Set();
  const parts = (text||'').split(',').map(s=>s.trim()).filter(Boolean);
  for(const part of parts){
    if(/^-?\d+$/.test(part)){
      let n = parseInt(part,10);
      if(n<0) n = total + n + 1; // -1 = last
      if(n>=1 && n<=total) out.add(n-1);
    } else {
      const m = part.match(/^(-?\d+)\s*-\s*(-?\d+)$/);
      if(!m) continue;
      let a = parseInt(m[1],10), b = parseInt(m[2],10);
      if(a<0) a = total + a + 1;
      if(b<0) b = total + b + 1;
      if(a>b) [a,b]=[b,a];
      a=Math.max(1,a); b=Math.min(total,b);
      for(let n=a;n<=b;n++) out.add(n-1);
    }
  }
  return Array.from(out).sort((x,y)=>x-y);
}
