// scripts/agent.mjs
// Daily growth agent for OnDevicePDF
// - Crawls sitemap (AB site by default), checks basic SEO fields per page
// - Calls PageSpeed Insights (mobile+desktop) for a few key URLs
// - (Optional) Queries GA4 daily totals if credentials are provided
// - Writes /reports/YYYY-MM-DD.md and /reports/latest.md

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Node 18+ has global fetch
const AB_BASE_URL = process.env.AB_BASE_URL || "https://ondevicepdf-ab.vercel.app";
const MAIN_BASE_URL = process.env.MAIN_BASE_URL || "https://www.ondevicepdf.com";
const PSI_KEY = process.env.PSI_API_KEY || ""; // optional
const OUT_DIR = path.resolve("reports");
fs.mkdirSync(OUT_DIR, { recursive: true });

const today = new Date().toISOString().slice(0,10);

async function fetchText(url){
  const res = await fetch(url, { headers: { "User-Agent": "OnDevicePDF-Agent/1.0" }});
  if(!res.ok) throw new Error(`Fetch failed ${res.status} ${url}`);
  return await res.text();
}

function extractTag(content, tagName, attr, fallback=""){
  const re = new RegExp(`<${tagName}[^>]*${attr}=["']([^"']+)["'][^>]*>`, "i");
  const m = content.match(re);
  return m ? m[1] : fallback;
}

function extractTitle(content){
  const m = content.match(/<title>([^<]+)<\/title>/i);
  return m ? m[1].trim() : "";
}

function excerpt(s, n=160){
  return s.replace(/\s+/g," ").trim().slice(0,n);
}

async function getSitemapUrls(base){
  const xml = await fetchText(`${base.replace(/\/$/, "")}/sitemap.xml`);
  const urls = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map(m=>m[1]);
  return urls;
}

async function pageSeoSnapshot(url){
  const html = await fetchText(url);
  const title = extractTitle(html);
  const desc = extractTag(html, "meta", "name=[\"']description[\"']", "");
  const canonical = extractTag(html, "link", "rel=[\"']canonical[\"']", "");
  const ogTitle = extractTag(html, "meta", "property=[\"']og:title[\"']", "");
  const ogDesc = extractTag(html, "meta", "property=[\"']og:description[\"']", "");
  return { url, title, desc, canonical, ogTitle, ogDesc };
}

async function psiScore(url, strategy="mobile"){
  if(!PSI_KEY) return { performance: null };
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&key=${PSI_KEY}`;
  const res = await fetch(endpoint);
  if(!res.ok) return { performance: null };
  const data = await res.json();
  const lighthouse = data.lighthouseResult || {};
  const categories = lighthouse.categories || {};
  const perf = categories.performance ? Math.round(categories.performance.score*100) : null;
  const audits = lighthouse.audits || {};
  const LCP = audits["largest-contentful-paint"]?.displayValue || null;
  const FCP = audits["first-contentful-paint"]?.displayValue || null;
  const TBT = audits["total-blocking-time"]?.displayValue || null;
  return { performance: perf, LCP, FCP, TBT };
}

// Optional GA4 (needs service account JSON + property id). Kept safe to skip if not configured.
async function ga4Daily(){
  try{
    const keyJson = process.env.GA4_SA_KEY_JSON ? JSON.parse(process.env.GA4_SA_KEY_JSON) : null;
    const propertyId = process.env.GA4_PROPERTY_ID;
    if(!keyJson || !propertyId) return null;

    const {BetaAnalyticsDataClient} = await import('@google-analytics/data');
    const client = new BetaAnalyticsDataClient({
      credentials: keyJson
    });

    const [resp] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: "yesterday", endDate: "today" }],
      metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }]
    });

    let out = { activeUsers: 0, sessions: 0, views: 0 };
    if(resp && resp.rows && resp.rows[0]){
      const c = resp.rows[0].metricValues.map(m=>Number(m.value||0));
      out = { activeUsers: c[0], sessions: c[1], views: c[2] };
    }
    return out;
  }catch(e){
    return null;
  }
}

async function run(){
  const urls = await getSitemapUrls(AB_BASE_URL);
  const keyUrls = [AB_BASE_URL+"/", AB_BASE_URL+"/tools", AB_BASE_URL+"/tools/merge", AB_BASE_URL+"/tools/split"];

  // SEO snapshots
  const snapshots = [];
  for(const u of urls){
    try { snapshots.push(await pageSeoSnapshot(u)); }
    catch(e){ snapshots.push({ url: u, error: e.message }); }
  }

  // PSI for a few key pages (mobile+desktop)
  const psi = [];
  for(const u of keyUrls){
    const mobile = await psiScore(u, "mobile");
    const desktop = await psiScore(u, "desktop");
    psi.push({ url: u, mobile, desktop });
  }

  const ga = await ga4Daily(); // may be null

  // Compose report
  const lines = [];
  lines.push(`# OnDevicePDF — Daily Growth Report (${today})`);
  lines.push("");
  lines.push(`**Target:** 100K views/month · **Environment:** A/B site (${AB_BASE_URL})`);
  if(ga){
    lines.push(`**GA4 (last 24h):** Views: ${ga.views} · Sessions: ${ga.sessions} · Users: ${ga.activeUsers}`);
  }else{
    lines.push(`**GA4:** not configured (set GA4_SA_KEY_JSON + GA4_PROPERTY_ID in repo secrets to enable).`);
  }
  lines.push("");
  lines.push("## PageSpeed Snapshots");
  for(const p of psi){
    const m = p.mobile.performance ?? "N/A";
    const d = p.desktop.performance ?? "N/A";
    lines.push(`- ${p.url}\n  - Mobile: ${m} (LCP ${p.mobile.LCP||"-"}, FCP ${p.mobile.FCP||"-"})\n  - Desktop: ${d} (LCP ${p.desktop.LCP||"-"}, FCP ${p.desktop.FCP||"-"})`);
  }
  lines.push("");
  lines.push("## SEO Checks (title / description / canonical / OG)");
  for(const s of snapshots){
    if(s.error){
      lines.push(`- ${s.url} — ❌ ${s.error}`);
      continue;
    }
    const okTitle = s.title && s.title.length >= 15;
    const okDesc = s.desc && s.desc.length >= 50;
    const okCanon = !!s.canonical;
    const okOG = !!s.ogTitle && !!s.ogDesc;
    const status = (okTitle && okDesc && okCanon && okOG) ? "✅" : "⚠️";
    lines.push(`- ${s.url} — ${status} title:${okTitle?"ok":"miss"} · desc:${okDesc?"ok":"miss"} · canonical:${okCanon?"ok":"miss"} · og:${okOG?"ok":"miss"}`);
  }
  lines.push("");
  lines.push("## Suggested Next Actions");
  lines.push("- Fix any pages missing meta description or canonical.");
  lines.push("- Add JSON-LD (WebApplication + FAQ) to homepage and key tool pages.");
  lines.push("- Ensure robots.txt + sitemap point to MAIN domain when promoting.");
  lines.push("- Publish 1 blog post targeting a long-tail keyword (e.g., 'merge pdf offline').");
  lines.push("- Share update on LinkedIn/Twitter/Reddit with privacy angle.");
  lines.push("");

  const md = lines.join("\n");
  const outFile = path.join(OUT_DIR, `${today}.md`);
  fs.writeFileSync(outFile, md);
  fs.writeFileSync(path.join(OUT_DIR, "latest.md"), md);

  // Stage changes (for GH Action)
  try{
    execSync("git add reports", { stdio: "inherit" });
  }catch{}
}

run().catch(e=>{
  console.error(e);
  process.exit(1);
});
