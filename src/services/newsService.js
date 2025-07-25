// services/newsService.js
const axios = require('axios');
const { FOREX_URL } = require('../config');

async function fetchEconomicCalendar() {
  try {
    const resp = await axios.get(FOREX_URL);
    // parse resp.data nếu cần (có thể dùng cheerio để scrape HTML)
    return resp.data;
  } catch (err) {
    console.error('newsService.fetchEconomicCalendar error:', err.message);
    throw err;
  }
}

module.exports = { fetchEconomicCalendar };
