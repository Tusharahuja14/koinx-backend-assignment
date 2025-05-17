// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { connectNATS, publish } = require('./natsWrapper'); // ✅ Import NATS helpers

dotenv.config();

const cryptoStatsRoutes = require('./routes/cryptoStats');
const portfolioRoutes = require('./routes/portfolio');
const storeCryptoStats = require('./utils/storeCryptoStats');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use('/portfolio', portfolioRoutes);
app.use('/', cryptoStatsRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('API Server is running!');
});

app.get('/test', (req, res) => {
  console.log('Test route was called');
  res.json({ message: 'Test route working!' });
});

// Start the server
const startServer = async () => {
  try {
    await connectNATS(); // ✅ Connect to NATS
    console.log('✅ Connected to NATS');

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Store crypto stats and publish to NATS
    const stats = await storeCryptoStats();
    console.log('✅ Crypto stats stored on server start');

if (!stats) {
  throw new Error('storeCryptoStats returned undefined or null');
}
await publish('crypto.stats.updated', JSON.stringify(stats));
// ✅ Publish to NATS
    console.log('📤 Published initial stats to NATS');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Startup error:', err);
  }
};

startServer();
