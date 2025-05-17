// server.js (api-server)
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { connectNATS, publish } = require('./natsWrapper');
const storeCryptoStats = require('./utils/storeCryptoStats');

dotenv.config();

const cryptoStatsRoutes = require('./routes/cryptoStats');
const portfolioRoutes = require('./routes/portfolio');

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

const startServer = async () => {
  try {
    const nc = await connectNATS();
    console.log('✅ Connected to NATS');

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Subscribe to the update event from worker-server
    const sc = require('nats').StringCodec();

    const subscription = nc.subscribe('crypto.update');
    (async () => {
      for await (const msg of subscription) {
        try {
          const data = sc.decode(msg.data);
          console.log('📥 Received event:', data);

          // Call your function to fetch & store crypto stats
          const stats = await storeCryptoStats();
          console.log('✅ Crypto stats updated from event');

          // Optionally publish updated stats again
          await publish('crypto.stats.updated', JSON.stringify(stats));
          console.log('📤 Published updated stats to NATS');

        } catch (error) {
          console.error('❌ Error handling update event:', error);
        }
      }
    })();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Startup error:', err);
  }
};

startServer();
