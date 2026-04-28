# Mutual Fund Portfolio Calculator

This app fetches NAV data from AMFI and lets users calculate the value of mutual fund holdings.

## Features
- Live NAV data from AMFI.
- Fund selection dropdown and portfolio value calculation.
- Server-side AMFI proxy endpoint (`/api/funds`) with multi-source fallback.
- Client-side fallback data sources if server fetch fails.
- Health endpoint (`/health`) for Railway deployment checks.

## Run locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the app:
   ```bash
   npm start
   ```
3. Open `http://localhost:3000`.

## Deploy on Railway
1. Push this repository to GitHub.
2. In Railway, create a new project and select this repository.
3. Railway auto-detects Node.js and runs `npm start`.
4. Deploy.

Railway injects `PORT` automatically, and `server.js` uses it.
