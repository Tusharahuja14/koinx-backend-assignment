const mongoose = require('mongoose');

const CryptoStatSchema = new mongoose.Schema({
  coin: {
    type: String,
    enum: ['bitcoin', 'ethereum', 'matic-network'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  marketCap: {
    type: Number,
    required: true,
  },
  change24h: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('CryptoStat', CryptoStatSchema);
