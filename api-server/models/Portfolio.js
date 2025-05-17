// models/Portfolio.js
const mongoose = require('mongoose');

const PortfolioSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  assets: [
    {
      coinId: String,
      amount: Number,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', PortfolioSchema);
