const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');

// GET portfolio by userId
router.get('/:userId', async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.params.userId });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST or UPDATE portfolio
router.post('/', async (req, res) => {
  const { userId, assets } = req.body;

  try {
    let portfolio = await Portfolio.findOne({ userId });

    if (portfolio) {
      // Update existing portfolio
      portfolio.assets = assets;
      await portfolio.save();
      res.json({ message: 'Portfolio updated', portfolio });
    } else {
      // Create new portfolio
      portfolio = new Portfolio({ userId, assets });
      await portfolio.save();
      res.status(201).json({ message: 'Portfolio created', portfolio });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
