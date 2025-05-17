const express = require('express');
const router = express.Router();
const CryptoStat = require('../models/CryptoStat');

router.get('/test', (req, res) => {
  res.json({ message: 'Test route working!' });
});
// GET /stats?coin=bitcoin
router.get('/stats', async (req, res) => {
  const { coin } = req.query;

  if (!['bitcoin', 'ethereum', 'matic-network'].includes(coin)) {
    return res.status(400).json({ error: 'Invalid coin parameter' });
  }

  try {
    // Find latest record for this coin
    const latest = await CryptoStat.findOne({ coin }).sort({ timestamp: -1 });

    if (!latest) return res.status(404).json({ error: 'No data found for this coin' });

    res.json({
      price: latest.price,
      marketCap: latest.marketCap,
      "24hChange": latest.change24h,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /deviation?coin=bitcoin
router.get('/deviation', async (req, res) => {
  const { coin } = req.query;

  if (!['bitcoin', 'ethereum', 'matic-network'].includes(coin)) {
    return res.status(400).json({ error: 'Invalid coin parameter' });
  }

  try {
    // Get last 100 records sorted by timestamp descending
    const records = await CryptoStat.find({ coin }).sort({ timestamp: -1 }).limit(100);

    if (records.length === 0) return res.status(404).json({ error: 'No data found for this coin' });

    // Calculate standard deviation of price
    const prices = records.map(r => r.price);
    const mean = prices.reduce((a,b) => a + b, 0) / prices.length;
    const variance = prices.reduce((a,b) => a + Math.pow(b - mean, 2), 0) / prices.length;
    const stdDeviation = Math.sqrt(variance);

    res.json({ deviation: parseFloat(stdDeviation.toFixed(2)) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
