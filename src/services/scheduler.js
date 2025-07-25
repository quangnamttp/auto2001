const cron = require('node-cron');
const { TIMEZONE } = require('../config');
const { getBotState } = require('./state');
const { sendMorningNews, sendMacroNews } = require('./reportService');
const { sendTradeSignals, sendEmergencySignals } = require('./signalService');

function startJobs() {
  cron.schedule('0 6 * * *', async () => {
    if (getBotState()) await sendMorningNews();
  }, { timezone: TIMEZONE });

  cron.schedule('0 7 * * *', async () => {
    if (getBotState()) await sendMacroNews();
  }, { timezone: TIMEZONE });

  cron.schedule('*/15 6-21 * * *', async () => {
    if (getBotState()) await sendTradeSignals();
  }, { timezone: TIMEZONE });

  cron.schedule('*/5 * * * *', async () => {
    if (getBotState()) await sendEmergencySignals();
  }, { timezone: TIMEZONE });
}

module.exports = { startJobs };
