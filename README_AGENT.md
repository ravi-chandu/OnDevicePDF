# OnDevicePDF Agent Pack

This pack adds a **daily growth agent** to your repo. It will:
- Crawl your A/B site sitemap and check **title/description/canonical/OG** per page
- Run **PageSpeed Insights** (mobile & desktop) on key pages
- (Optionally) query **GA4** for last-24h users/sessions/views
- Write a markdown report to `/reports/YYYY-MM-DD.md` and `/reports/latest.md`
- Commit the report back to the repository automatically (GitHub Actions)

## Quick Setup

1. Copy these folders/files into your repository root:
   - `scripts/agent.mjs`
   - `.github/workflows/agent.yml`
   - Create (or keep) a `reports/` folder (the action will create it if missing).

2. Add repository **secrets** (Settings → Secrets and variables → Actions):
   - `PSI_API_KEY` — (optional) Google PageSpeed Insights API key
   - `GA4_PROPERTY_ID` — (optional) your GA4 property id (like `123456789`)
   - `GA4_SA_KEY_JSON` — (optional) contents of a Google **service account** JSON with access to your GA4 property

   > If GA4 secrets are not set, the agent still runs and skips GA4.

3. The workflow runs daily at **10:00 IST** (04:30 UTC). You can also run it manually from the **Actions → Run workflow** button.

4. Open the generated report in `/reports/latest.md`. Use it to drive daily fixes and content tasks.

## Notes
- The agent only **reads** your public site; it does **not** touch any PDF processing or private data.
- You can tune the target URLs inside `scripts/agent.mjs` (`keyUrls` array).
- To add Slack notifications, extend the workflow with a Slack webhook step after the report is generated.
