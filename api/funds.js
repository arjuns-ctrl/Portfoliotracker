const DATA_SOURCES = [
  'https://portal.amfiindia.com/spages/NAVAll.txt',
  'https://www.amfiindia.com/spages/NAVAll.txt',
  'https://api.allorigins.win/raw?url=https://portal.amfiindia.com/spages/NAVAll.txt'
];

async function fetchFromSources() {
  let lastError = null;

  for (const source of DATA_SOURCES) {
    try {
      const upstream = await fetch(source, {
        headers: { 'User-Agent': 'portfolio-tracker-vercel' },
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

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const text = await fetchFromSources();
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(text);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fund data', details: error.message });
  }
};
