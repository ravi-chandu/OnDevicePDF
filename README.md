# OnDevicePDF — Vite + React (fixed build)

- Uses `@vitejs/plugin-react` (installed) so `vite build` works on Vercel.
- SPA rewrites via `vercel.json`.
- Tailwind set up with `.cjs` configs only.
- GA4 Google Tag: set **one** of these in Vercel Project → Settings → Environment Variables:

  - `VITE_GOOGLE_TAG_ID` (preferred, e.g. `G-G6ESZ135WP`)
  - or `VITE_GA_MEASUREMENT_ID` (fallback, e.g. `G-EN0MPKLVQ5`)

- One fully working tool: **Merge PDFs** (`/tools/merge`). Other tools are placeholders.
- Service worker caches app shell and bypasses GA requests.

## Scripts

```bash
npm install
npm run dev     # local dev
npm run build   # production build
npm run preview
```
