const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const DATA_SOURCES = [
  'https://portal.amfiindia.com/spages/NAVAll.txt',
  'https://www.amfiindia.com/spages/NAVAll.txt'
];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': MIME_TYPES['.json'] });
  res.end(JSON.stringify(payload));
}

async function fetchFromSources() {
  let lastError = null;

  for (const source of DATA_SOURCES) {
    try {
      const upstream = await fetch(source, {
        headers: { 'User-Agent': 'portfolio-tracker-railway' },
        signal: AbortSignal.timeout(10000)
      });

      if (!upstream.ok) {
        lastError = new Error(`Upstream responded with ${upstream.status} for ${source}`);
        continue;
      }

      return await upstream.text();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error('No data source available');
}

async function handleApiFunds(res) {
  try {
    const text = await fetchFromSources();
    res.writeHead(200, { 'Content-Type': MIME_TYPES['.txt'] });
    res.end(text);
  } catch (error) {
    sendJson(res, 500, { error: 'Failed to fetch fund data', details: error.message });
  }
}

function serveStaticFile(reqPath, res) {
  const cleanPath = reqPath === '/' ? '/index.html' : reqPath;
  const filePath = path.join(ROOT, path.normalize(cleanPath));

  if (!filePath.startsWith(ROOT)) {
    sendJson(res, 403, { error: 'Forbidden' });
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      sendJson(res, 404, { error: 'Not found' });
      return;
    }

    const ext = path.extname(filePath);
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === 'GET' && url.pathname === '/health') {
    sendJson(res, 200, { status: 'ok' });
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/funds') {
    handleApiFunds(res);
    return;
  }

  if (req.method === 'GET') {
    serveStaticFile(url.pathname, res);
    return;
  }

  sendJson(res, 405, { error: 'Method not allowed' });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
