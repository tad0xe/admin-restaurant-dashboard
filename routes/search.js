
const express = require("express");
const router = express.Router();
const algoliaSearch = require("algoliasearch");

const client = algoliaSearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_SECRET
);

const index = client.initIndex(process.env.ALGOLIA_INDEX);

router.post('/search', async (req, res) => {
  try {
    const { title } = req.body;
    const result = await index.search(title);
    res.json(result.hits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
