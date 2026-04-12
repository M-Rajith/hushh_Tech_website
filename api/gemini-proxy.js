const FALLBACK_KEYS = [
  process.env.GEMINI_API_KEY,
  process.env.GEMINI_API_KEY_FALLBACK_1,
  process.env.GEMINI_API_KEY_FALLBACK_2,
  process.env.GEMINI_API_KEY_FALLBACK_3,
].filter(Boolean);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (FALLBACK_KEYS.length === 0) {
    return res.status(500).json({ error: 'No Gemini API keys configured server-side' });
  }

  const { model = 'gemini-1.5-flash', contents, generationConfig } = req.body;

  if (!contents) {
    return res.status(400).json({ error: 'Missing required field: contents' });
  }

  for (const apiKey of FALLBACK_KEYS) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents, generationConfig }),
        }
      );

      if (response.status === 429 || response.status === 403) continue;

      if (!response.ok) {
        const error = await response.text();
        return res.status(response.status).json({ error });
      }

      const data = await response.json();
      return res.status(200).json(data);

    } catch (err) {
      continue;
    }
  }

  return res.status(503).json({ error: 'All Gemini API keys exhausted or unavailable' });
}