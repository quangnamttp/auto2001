// services/signalService.js
const newsService = require('./newsService');
const onusService = require('./onusService');

async function generateSignals() {
  try {
    const [calendar, onus] = await Promise.all([
      newsService.fetchEconomicCalendar(),
      onusService.getOnusIndex('EURUSD')
    ]);

    // Simple example: nếu onus > ngưỡng và có news lớn
    const hasHighImpact = calendar.events.some(e => e.impact === 'high');
    const signal = (onus.value > 50 && hasHighImpact) ? 'BUY' : 'HOLD';

    return { signal, onus, calendar };
  } catch (err) {
    console.error('signalService.generateSignals error:', err.message);
    throw err;
  }
}

module.exports = { generateSignals };
