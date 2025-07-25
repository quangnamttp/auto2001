const axios = require('axios');
const { PAGE_ACCESS_TOKEN } = require('../config');

function sendText(recipientId, text) {
  return axios.post(`https://graph.facebook.com/v17.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
    recipient: { id: recipientId },
    message: { text }
  });
}

module.exports = { sendText };
