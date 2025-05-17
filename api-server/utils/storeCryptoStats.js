const axios = require('axios');
const CryptoStat = require('../models/CryptoStat');

const coins = ['bitcoin', 'ethereum', 'matic-network'];

async function storeCryptoStats() {
  try {
    const ids = coins.join(',');

    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`;

    const response = await axios.get(url);

    const data = response.data;

    const savedStats = [];

    for (const coin of coins) {
      if (data[coin]) {
        const stat = new CryptoStat({
          coin,
          price: data[coin].usd,
          marketCap: data[coin].usd_market_cap,
          change24h: data[coin].usd_24h_change,
        });
        const saved = await stat.save();
        savedStats.push(saved);
      }
    }

    console.log('✅ Crypto stats saved to DB');

    return savedStats;  // <--- Return the array of saved stats here

  } catch (error) {
    console.error('❌ Error fetching/storing crypto stats:', error.message);
    return null;  // Return null on error for safety
  }
}

module.exports = storeCryptoStats;
