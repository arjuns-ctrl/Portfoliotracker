# Mutual Fund Portfolio Calculator

This app fetches NAV data from AMFI and lets users calculate the value of mutual fund holdings.

## Features
- Live NAV data from AMFI.
- Fund selection dropdown and portfolio value calculation.
- Vercel serverless API endpoint (`/api/funds`) with multi-source fallback.
- Client-side fallback data sources if server fetch fails.
- Health endpoint (`/api/health`) for deployment checks.

## Run locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local static server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000`.

## Deploy on Vercel
1. Push this repository to GitHub.
2. In Vercel, import this repository.
3. Keep framework preset as **Other** (no build command required).
4. Deploy.

Vercel will serve static files from the project root and expose API routes from the `api/` directory.
