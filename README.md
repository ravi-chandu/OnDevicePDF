# ondevicepdf-ab

## Production Switch Notes
- Canonical & sitemap now target **https://ondevicepdf.com**.
- GA4 is wired (`G-KPHE0WPPKM`). Track events via `src/analytics.js`.
- Add GitHub Secrets for the agent:
  - `PSI_API_KEY` (PageSpeed API key)
  - `GA4_PROPERTY_ID=501479420`
  - `GA4_SA_KEY_JSON` (optional; service account JSON for GA4).
- Run the Action **OnDevicePDF Daily Agent** to generate `/reports/latest.md`.
