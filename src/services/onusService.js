// services/onusService.js
const axios = require('axios');

async function getOnusIndex(symbol) {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`;
    const { data } = await axios.get(url);
    
    return {
      symbol,
      value: data[symbol]?.usd || null
    };
  } catch (err) {
    console.error('onusService.getOnusIndex error:', err.message);
    throw err;
  }
}

module.exports = { getOnusIndex };
