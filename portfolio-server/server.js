const express = require('express');
const dotenv = require('dotenv');
const { connectNATS, subscribe } = require('./natsWrapper');

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 6000;

// In-memory cache for latest crypto stats
let latestStats = {};

app.get('/latest-stats', (req, res) => {
  res.json(latestStats);
});

app.post('/portfolio', (req, res) => {
  const portfolio = req.body;

  if (!portfolio || typeof portfolio !== 'object') {
    return res.status(400).json({ error: 'Invalid portfolio format' });
  }

  try {
    const results = Object.entries(portfolio).map(([coin, amount]) => {
      const stats = latestStats[coin];
      if (!stats) {
        throw new Error(`No stats available for coin: ${coin}`);
      }
      const price = stats.price;
      return {
        coin,
        amount,
        price,
        value: parseFloat((price * amount).toFixed(2)),
      };
    });

    const total = results.reduce((sum, r) => sum + r.value, 0);

    res.json({ total, breakdown: results });
  } catch (err) {
    res.status(500).json({ error: 'Failed to calculate portfolio', details: err.message });
  }
});

app.get('/test', (req, res) => {
  res.json({ message: 'Portfolio server is running!' });
});

const startServer = async () => {
  try {
    await connectNATS();
    console.log('✅ Connected to NATS');

    subscribe('crypto.stats.updated', (msg) => {
      try {
        latestStats = JSON.parse(msg);
        console.log('🔄 Updated latest stats cache:', latestStats);
      } catch (err) {
        console.error('❌ Failed to parse stats from NATS message:', err.message);
      }
    });

    app.listen(PORT, () => {
      console.log(`🚀 Portfolio server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Portfolio server startup error:', err);
  }
};

startServer();
