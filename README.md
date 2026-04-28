# Mutual Fund Portfolio Calculator

This project fetches NAV data from AMFI and allows users to calculate the value of their mutual fund holdings.

## Features
- Live NAV data from AMFI
- Fund selection dropdown
- Portfolio value calculation
- Server-side AMFI proxy endpoint (`/api/funds`) with multi-source fallback
- Client-side fallback data sources if server fetch fails
- Server-side AMFI proxy endpoint (`/api/funds`) for reliable CORS-safe loading
- Health endpoint (`/health`) for platform checks

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
3. Railway will detect Node.js automatically.
4. Ensure the start command is `npm start` (already defined in `package.json`).
5. Deploy.

Railway injects `PORT` automatically, and `server.js` uses it.
