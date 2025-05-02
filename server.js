const express = require('express');
const path    = require('path');
const app     = express();

// Serve all files in ./public at their own paths:
app.use(express.static(path.join(__dirname, 'public')));

app.get('/search', async (req, res) => {
  const query = req.query.q;
  const url = `https://html.duckduckgo.com/html?q=${encodeURIComponent(query)}`;

  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const $ = cheerio.load(response.data);
    let results = [];

    $('.result__title').each((i, el) => {
      const title = $(el).text();
      const link = $(el).find('a').attr('href');
      results.push({ title, link });
    });

    res.json({ results });

  } catch (err) {
    res.status(500).send('Search failed');
  }
});

app.listen(port, () => console.log(`Proxy search running at http://localhost:${port}`));
