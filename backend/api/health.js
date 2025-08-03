module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.json({ 
    status: 'OK', 
    message: 'Fashion GPT API is running',
    timestamp: new Date().toISOString(),
    apiPaths: {
      health: '/api/health',
      analyzeFashion: '/api/analyze-fashion',
      serverFile: 'backend/server/index.js',
      apiFiles: {
        health: 'backend/api/health.js',
        analyzeFashion: 'backend/api/analyze-fashion.js'
      }
    }
  });
}; 